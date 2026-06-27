'use client';

import Script from 'next/script';

/**
 * HubSpot embedded form (portal 246608206, region na2).
 *
 * Replaces the former custom LeadForm pipeline (Zod + Turnstile + Supabase +
 * Resend). Submissions now flow directly into HubSpot — follow-up email
 * (welcome/guide/empty-legs) is HubSpot's responsibility, and must keep an
 * unsubscribe link + physical mailing address to stay CAN-SPAM compliant.
 *
 * The portal script auto-renders the form into any `.hs-form-frame` element
 * carrying the matching data-* attributes, and uses a MutationObserver, so it
 * tolerates React mounting the frame after the script has loaded. `next/script`
 * dedupes by src, so rendering this component twice (Hero + Empty-Legs) loads
 * the script once.
 */
const HS_REGION = 'na2';
const HS_PORTAL_ID = '246608206';
const HS_FORM_ID = '9cab9e99-6507-4c04-814a-95a77e401dec';
const HS_SCRIPT_SRC = `https://js-${HS_REGION}.hsforms.net/forms/embed/${HS_PORTAL_ID}.js`;

export default function HubSpotForm({ className }: { className?: string }) {
  return (
    <>
      <div
        className={['hs-form-frame', className].filter(Boolean).join(' ')}
        data-region={HS_REGION}
        data-portal-id={HS_PORTAL_ID}
        data-form-id={HS_FORM_ID}
      />
      <Script src={HS_SCRIPT_SRC} strategy="afterInteractive" />
    </>
  );
}
