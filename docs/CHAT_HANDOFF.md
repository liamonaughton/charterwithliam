# CHAT_HANDOFF — where we are right now

> Canonical "current state" doc. Update at the end of every session. `/start`
> reads this + the last SESSION_LOG entry to brief the next session.

_Last updated: 2026-06-22_

## Where we are right now

The **CharterWithLiam lead-capture landing page is built and deployed to
production** (Vercel, aliased to `www.charterwithliam.com`). The lead funnel
works end-to-end: form → Zod validation → Upstash rate-limit → Cloudflare
Turnstile → upsert into Supabase `leads` → best-effort welcome/guide/empty-legs
email via Resend.

Recent arc (all on branch `claude/magical-fermat-0k2i0z`, **pushed, not merged**):

1. **Welcome email feature** added — `emails/welcome.tsx`, `sendWelcomeEmail()`
   in `lib/resend.ts`, wired into `subscribe.ts`, migration `0002` adds
   `welcome_sent_at`. (commit `a56bfc3`)
2. **Turnstile token bug fixed.** Root cause: the homepage renders **two**
   `LeadForm`/`Turnstile` widgets, but a single global `onloadTurnstileCallback`
   got clobbered by the second mount, so only one widget executed → the other
   form submitted an empty token. Fixed by polling for `window.turnstile`
   readiness per-instance + calling `execute()` to force the challenge. Verified
   live: `token present: true len: 858`, siteverify `success: true`. Diagnostic
   logging since removed. (commits `b064240`→`c78e5d1`)
3. **Resend "Domain not verified" fix.** `RESEND_FROM` had drifted to
   `liam@send.charterwithliam.com` (unverified subdomain). Changed to the
   verified root `liam@charterwithliam.com` in Vercel **Production** env + forced
   redeploy. Production is live with the fix.

## Immediate next priorities

1. **Confirm the welcome email actually delivers.** After the `RESEND_FROM` →
   root fix + redeploy, we had not yet tested an end-to-end send with a fresh
   email. Submit with a brand-new address, confirm receipt, and check Resend →
   Emails shows **Delivered** (not "Domain not verified"). _Blocked-adjacent:
   verify migration `0002` is applied first (see NOTES N1)._
2. **Set `RESEND_FROM` for Preview.** The CLI couldn't set it for "all Preview
   branches" non-interactively, and removing the Production binding cleared the
   shared Preview record — so Preview currently falls back to the code default
   `onboarding@resend.dev`. Set it via the Vercel dashboard (tick Preview) to
   `Liam <liam@charterwithliam.com>`.
3. **Open the PR.** `claude/magical-fermat-0k2i0z` is pushed but not merged to
   `main`. Once the welcome send is confirmed, open the PR for review.

## Not now (deferred)

- **Option 2 — dedicated sending subdomain.** Verifying `send.charterwithliam.com`
  as its own Resend domain for reputation isolation. Revisit when adding
  higher-volume marketing sends (empty-leg blasts). See `docs/DECISIONS.md` D2.
