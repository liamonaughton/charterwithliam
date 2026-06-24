'use server';

import { headers } from 'next/headers';
import { subscribeSchema, formDataToObject } from '@/lib/validation';
import { getServiceClient, isSupabaseConfigured } from '@/lib/supabase-server';
import { verifyTurnstile } from '@/lib/turnstile';
import { checkRateLimit } from '@/lib/rate-limit';
import { sendGuideEmail, sendEmptyLegsEmail, sendWelcomeEmail } from '@/lib/resend';

export interface SubscribeState {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  // Echoed back so the thank-you transition / analytics has context.
  result?: {
    email: string;
    wantsGuide: boolean;
    wantsEmptyLegs: boolean;
    source?: string;
  };
}

const GENERIC_ERROR =
  'Something went wrong on our end. Please try again in a moment.';

async function getRequestMeta(): Promise<{ ip: string; country: string | null }> {
  const h = await headers();
  const fwd = h.get('x-forwarded-for');
  const ip = fwd
    ? fwd.split(',')[0]!.trim()
    : h.get('x-real-ip') ?? 'unknown';
  return { ip, country: h.get('x-vercel-ip-country') };
}

export async function subscribe(
  _prev: SubscribeState | undefined,
  formData: FormData
): Promise<SubscribeState> {
  // 1. Parse + validate.
  const parsed = subscribeSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === 'string' && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return {
      ok: false,
      error: 'Please fix the highlighted fields.',
      fieldErrors,
    };
  }

  const data = parsed.data;

  // Honeypot: if filled, silently succeed and drop (don't tip off the bot).
  if (data.website && data.website.length > 0) {
    return {
      ok: true,
      result: {
        email: data.email,
        wantsGuide: data.wantsGuide,
        wantsEmptyLegs: data.wantsEmptyLegs,
        source: data.source,
      },
    };
  }

  const { ip, country } = await getRequestMeta();

  // 2. Rate limit by IP.
  const { success: underLimit } = await checkRateLimit(ip);
  if (!underLimit) {
    return {
      ok: false,
      error: "You're going a little fast — please wait a minute and try again.",
    };
  }

  // 3. Verify Turnstile.
  const humanVerified = await verifyTurnstile(
    data.turnstileToken,
    ip === 'unknown' ? undefined : ip
  );
  if (!humanVerified) {
    return {
      ok: false,
      error: "We couldn't verify you're human. Please refresh and try again.",
    };
  }

  // Guard: if the backend isn't configured, fail gracefully.
  if (!isSupabaseConfigured()) {
    return { ok: false, error: GENERIC_ERROR };
  }

  const supabase = getServiceClient();

  // 4. Upsert the lead, merging asset flags on conflict.
  // We read existing row first so OR-merge + coalesce is explicit and we know
  // whether we've already emailed this person.
  const { data: existing, error: selectError } = await supabase
    .from('leads')
    .select('id, first_name, wants_guide, wants_empty_legs, guide_sent_at, welcome_sent_at')
    .eq('email', data.email)
    .maybeSingle();

  if (selectError) {
    return { ok: false, error: GENERIC_ERROR };
  }

  const mergedWantsGuide = (existing?.wants_guide ?? false) || data.wantsGuide;
  const mergedWantsEmptyLegs =
    (existing?.wants_empty_legs ?? false) || data.wantsEmptyLegs;

  const row = {
    email: data.email,
    first_name: data.firstName ?? existing?.first_name ?? null,
    phone: data.phone ?? null,
    wants_guide: mergedWantsGuide,
    wants_empty_legs: mergedWantsEmptyLegs,
    home_airport: data.homeAirport ?? null,
    typical_routes: data.typicalRoutes ?? null,
    consent: data.consent,
    source: data.source ?? null,
    utm_source: data.utmSource ?? null,
    utm_medium: data.utmMedium ?? null,
    utm_campaign: data.utmCampaign ?? null,
    ip_country: country,
  };

  const { error: upsertError } = await supabase
    .from('leads')
    .upsert(row, { onConflict: 'email' });

  if (upsertError) {
    return { ok: false, error: GENERIC_ERROR };
  }

  // 5. Send emails (best-effort; failures don't block the success path).

  // Welcome: send once per lead, regardless of which assets they chose.
  if (!existing?.welcome_sent_at) {
    const sent = await sendWelcomeEmail({
      to: data.email,
      firstName: data.firstName,
    });
    if (sent.ok) {
      await supabase
        .from('leads')
        .update({ welcome_sent_at: new Date().toISOString() })
        .eq('email', data.email);
    } else {
      // Send was ATTEMPTED but Resend returned an error (or wasn't configured).
      console.error(`[subscribe] welcome send FAILED for ${data.email}: ${sent.error}`);
    }
  } else {
    // Send NOT attempted — gate saw welcome_sent_at already set on the pre-upsert snapshot.
    console.error(`[subscribe] welcome send SKIPPED for ${data.email}: welcome_sent_at already set (${existing.welcome_sent_at})`);
  }

  const alreadyHadGuide = Boolean(existing?.guide_sent_at);

  if (data.wantsGuide && !alreadyHadGuide) {
    const downloadUrl = await createSignedGuideUrl(supabase);
    if (downloadUrl) {
      const sent = await sendGuideEmail({
        to: data.email,
        firstName: data.firstName,
        downloadUrl,
      });
      if (sent.ok) {
        await supabase
          .from('leads')
          .update({ guide_sent_at: new Date().toISOString() })
          .eq('email', data.email);
      }
    }
  }

  // Only welcome to empty-legs if this submission added the flag.
  const newlyEmptyLegs = data.wantsEmptyLegs && !existing?.wants_empty_legs;
  if (newlyEmptyLegs) {
    await sendEmptyLegsEmail({
      to: data.email,
      firstName: data.firstName,
      homeAirport: data.homeAirport,
    });
  }

  return {
    ok: true,
    result: {
      email: data.email,
      wantsGuide: data.wantsGuide,
      wantsEmptyLegs: data.wantsEmptyLegs,
      source: data.source,
    },
  };
}

async function createSignedGuideUrl(
  supabase: ReturnType<typeof getServiceClient>
): Promise<string | null> {
  const bucket = process.env.LEAD_MAGNET_BUCKET || 'lead-magnets';
  const path = process.env.LEAD_MAGNET_PATH || 'charter-buyers-guide.pdf';
  const ttl = Number(process.env.LEAD_MAGNET_SIGNED_URL_TTL_SECONDS || 604800);
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, ttl);
    if (error || !data?.signedUrl) return null;
    return data.signedUrl;
  } catch {
    return null;
  }
}
