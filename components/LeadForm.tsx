'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { subscribe, type SubscribeState } from '@/app/actions/subscribe';
import { deriveAttribution } from '@/lib/utm';
import { trackLeadCaptured } from '@/lib/analytics';
import Turnstile from './Turnstile';

const initialState: SubscribeState = { ok: false };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary w-full" disabled={pending}>
      {pending ? 'Sending…' : label}
      {!pending && <span aria-hidden>→</span>}
    </button>
  );
}

export interface LeadFormProps {
  /** Distinguishes the hero form from the secondary inline form. */
  variant?: 'hero' | 'inline';
  /** Pre-check the empty-legs box (used by the empty-legs section). */
  defaultEmptyLegs?: boolean;
  submitLabel?: string;
  idPrefix?: string;
}

export default function LeadForm({
  variant = 'hero',
  defaultEmptyLegs = false,
  submitLabel = 'Send me the guide',
  idPrefix = 'lead',
}: LeadFormProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(subscribe, initialState);
  const [wantsEmptyLegs, setWantsEmptyLegs] = useState(defaultEmptyLegs);
  const formRef = useRef<HTMLFormElement>(null);

  // Populate attribution hidden fields from query + referrer once mounted.
  // We write directly to the DOM inputs (an external system) rather than via
  // setState, so this stays a pure synchronize-on-mount effect.
  const sourceRef = useRef<HTMLInputElement>(null);
  const utmSourceRef = useRef<HTMLInputElement>(null);
  const utmMediumRef = useRef<HTMLInputElement>(null);
  const utmCampaignRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const a = deriveAttribution(window.location.search, document.referrer);
    if (sourceRef.current) sourceRef.current.value = a.source ?? '';
    if (utmSourceRef.current) utmSourceRef.current.value = a.utmSource ?? '';
    if (utmMediumRef.current) utmMediumRef.current.value = a.utmMedium ?? '';
    if (utmCampaignRef.current) utmCampaignRef.current.value = a.utmCampaign ?? '';
  }, []);

  // On success: fire analytics + route to thank-you.
  useEffect(() => {
    if (state.ok && state.result) {
      trackLeadCaptured({
        wants_guide: state.result.wantsGuide,
        wants_empty_legs: state.result.wantsEmptyLegs,
        source: state.result.source,
      });
      const params = new URLSearchParams({
        email: maskEmail(state.result.email),
        legs: String(state.result.wantsEmptyLegs),
      });
      router.push(`/thank-you?${params.toString()}`);
    }
  }, [state, router]);

  const fieldErrors = state.fieldErrors ?? {};
  const id = (name: string) => `${idPrefix}-${name}`;

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-4"
      noValidate
      aria-describedby={state.error ? `${idPrefix}-form-error` : undefined}
    >
      {/* Honeypot — visually hidden, off-screen, not announced. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={id('website')}>Leave this field empty</label>
        <input
          id={id('website')}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Attribution (hidden) — populated on mount from query + referrer. */}
      <input type="hidden" name="source" ref={sourceRef} />
      <input type="hidden" name="utmSource" ref={utmSourceRef} />
      <input type="hidden" name="utmMedium" ref={utmMediumRef} />
      <input type="hidden" name="utmCampaign" ref={utmCampaignRef} />

      <div>
        <label htmlFor={id('email')} className="field-label">
          Email <span className="text-danger">*</span>
        </label>
        <input
          id={id('email')}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="you@email.com"
          className="field-input"
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? id('email-error') : undefined}
        />
        {fieldErrors.email && (
          <p id={id('email-error')} className="field-error">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={id('firstName')} className="field-label">
          First name <span className="text-mist">(optional)</span>
        </label>
        <input
          id={id('firstName')}
          name="firstName"
          type="text"
          autoComplete="given-name"
          placeholder="First name"
          className="field-input"
        />
      </div>

      <fieldset className="space-y-2.5">
        <legend className="sr-only">What would you like to receive?</legend>
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="wantsGuide"
            defaultChecked
            className="mt-0.5 h-5 w-5 shrink-0 rounded border-sky-soft text-sky focus:ring-sky"
          />
          <span>Send me the Charter Buyer&apos;s Guide</span>
        </label>
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="wantsEmptyLegs"
            checked={wantsEmptyLegs}
            onChange={(e) => setWantsEmptyLegs(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 rounded border-sky-soft text-sky focus:ring-sky"
          />
          <span>Also send me empty-leg deal alerts for my routes</span>
        </label>
        {fieldErrors.wantsGuide && (
          <p className="field-error">{fieldErrors.wantsGuide}</p>
        )}
      </fieldset>

      {/* Empty-leg-only fields, revealed conditionally. */}
      {wantsEmptyLegs && (
        <div className="space-y-4 rounded-lg border border-sky-soft bg-cloud p-4">
          <div>
            <label htmlFor={id('homeAirport')} className="field-label">
              Home airport <span className="text-mist">(optional)</span>
            </label>
            <input
              id={id('homeAirport')}
              name="homeAirport"
              type="text"
              placeholder="e.g. KTEB / Teterboro"
              className="field-input"
            />
          </div>
          <div>
            <label htmlFor={id('typicalRoutes')} className="field-label">
              Typical routes <span className="text-mist">(optional)</span>
            </label>
            <input
              id={id('typicalRoutes')}
              name="typicalRoutes"
              type="text"
              placeholder="e.g. NYC ↔ Miami, NYC ↔ Aspen"
              className="field-input"
            />
          </div>
        </div>
      )}

      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 h-5 w-5 shrink-0 rounded border-sky-soft text-sky focus:ring-sky"
          aria-describedby={fieldErrors.consent ? id('consent-error') : undefined}
        />
        <span className="text-mist">
          I agree to receive emails from CharterWithLiam. Unsubscribe anytime. See
          our{' '}
          <a href="/privacy" className="text-sky underline">
            privacy policy
          </a>
          .
        </span>
      </label>
      {fieldErrors.consent && (
        <p id={id('consent-error')} className="field-error">
          {fieldErrors.consent}
        </p>
      )}

      <Turnstile className="min-h-[65px]" />

      {state.error && (
        <p
          id={`${idPrefix}-form-error`}
          role="alert"
          aria-live="assertive"
          className="rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger"
        >
          {state.error}
        </p>
      )}

      <SubmitButton label={submitLabel} />

      {variant === 'hero' && (
        <p className="text-center text-xs text-mist">
          No spam. Unsubscribe in one click.
        </p>
      )}
    </form>
  );
}

function maskEmail(email: string): string {
  const [user, domain] = email.split('@');
  if (!domain || !user) return email;
  const shown = user.slice(0, Math.min(2, user.length));
  return `${shown}${'•'.repeat(Math.max(1, user.length - shown.length))}@${domain}`;
}
