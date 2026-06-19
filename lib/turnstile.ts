import 'server-only';

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

interface SiteVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

/**
 * Verify a Turnstile token server-side. Returns true when the token is valid.
 * If no secret is configured, verification is skipped (returns true) so the
 * site still works in local/preview environments without Turnstile set up.
 */
export async function verifyTurnstile(
  token: string | undefined,
  remoteIp?: string
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  console.log('[turnstile] secret present:', Boolean(secret), 'len:', secret?.length ?? 0);
  if (!secret) {
    // Not configured — don't block submissions in dev/preview.
    return true;
  }
  console.log('[turnstile] token present:', Boolean(token), 'len:', token?.length ?? 0);
  if (!token) return false;

  const body = new URLSearchParams();
  body.append('secret', secret);
  body.append('response', token);
  if (remoteIp) body.append('remoteip', remoteIp);

  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
      cache: 'no-store',
    });
    if (!res.ok) return false;
    const data = (await res.json()) as SiteVerifyResponse;
    console.log('[turnstile] siteverify response:', JSON.stringify(data));
    return data.success === true;
  } catch {
    return false;
  }
}
