# CLAUDE.md — CharterWithLiam operating manual

Lead-capture landing page for **charterwithliam.com**. Next.js 16 (App Router +
Turbopack), Supabase (Postgres + Storage), Resend (email), Cloudflare Turnstile
(bot protection), deployed on Vercel. This file is the operating manual — it
overrides assumptions from prior training. Read it first every session (`/start`).

---

## 5 critical rules

1. **The service-role key is server-only.** `SUPABASE_SERVICE_ROLE_KEY` and
   `lib/supabase-server.ts` must never be imported into a Client Component or
   shipped to the browser. RLS on `public.leads` has **no anon policies** — all
   DB access is server-side via the service role. Don't add anon policies to
   "make it work" on the client.

2. **Migrations are append-only and numbered.** Never edit a migration that has
   been applied — write a new `supabase/migrations/NNNN_name.sql`. Log every
   migration in `db/MIGRATIONS.md` with its applied date. The applied-state log,
   not the file list, is the source of truth for what's live.

3. **Never commit secrets.** Real values live in Vercel env vars and local
   `.env.local` (gitignored). `.env.example` is the committed template — update
   it when you add a variable, but never put a real key in it.

4. **Emails must stay CAN-SPAM compliant.** Every template
   (`emails/*.tsx`) keeps the footer with a working unsubscribe link and a real
   physical mailing address, and `lib/resend.ts` keeps the `List-Unsubscribe`
   headers. Don't ship a send that drops them.

5. **Send only from the verified root domain.** `RESEND_FROM` must use
   `@charterwithliam.com` (the verified root). Do not point it at an unverified
   subdomain (e.g. `send.charterwithliam.com`) — Resend rejects the send and the
   welcome email silently fails. See `docs/DECISIONS.md`.

---

## Conventions

- **TypeScript strict**, ESLint via `eslint-config-next`. Run `npm run typecheck`
  before every commit — CI parity is `tsc --noEmit` returning zero.
- **Server Actions** for mutations (`app/actions/`), marked `'use server'`.
  Validation is shared client+server via Zod in `lib/validation.ts`; the server
  is the source of truth.
- **Best-effort email sends.** A failed send must not block the success path —
  `subscribe.ts` only stamps `*_sent_at` on confirmed success, so a failure
  retries naturally on the lead's next submit.
- **Env access is centralized** in `lib/env.ts` for shared constants; secrets are
  read inline from `process.env` server-side only.
- **Commit style:** imperative subject; co-author trailer on assistant commits.
  Branch off `main` for work; never force-push shared branches.
- **`main` is the production source of truth** (since 2026-06-22). Deploy from
  `main` after merging a PR — do **not** `--force`-promote a feature branch to
  prod. Workflow: branch off `main` → PR → `--no-ff` merge → deploy `main`.
  GitHub's default branch is `main`.

---

## Common commands

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run typecheck` | `tsc --noEmit` — must be zero before commit |
| `npm run lint` | ESLint |
| `vercel --prod --force` | Deploy current dir to production, no build cache |
| `vercel logs <url> --since 10m --expand` | Pull stored runtime logs (retroactive) |
| `vercel logs <url> --follow --expand` | Live stream (idles out after ~5 min) |
| `vercel env ls` | List env var names/targets (values stay encrypted) |

---

## Next.js 16 caveat (App Router + Turbopack)

- **`headers()` / `cookies()` are async** — `const h = await headers();` (see
  `app/actions/subscribe.ts`).
- **Server Actions are deployment-pinned.** A browser tab loaded against an old
  deployment that POSTs a Server Action to a new one throws *"Failed to find
  Server Action … from an older or newer deployment."* When testing after a
  deploy, **hard-refresh** (Cmd-Shift-R) first. This is expected, not a bug.
- **Client-side third-party widgets** (Turnstile) must tolerate React strict-mode
  double-invoke and multiple instances per page — see the file map note on
  `components/Turnstile.tsx`.

---

## Migration workflow

1. Write `supabase/migrations/NNNN_description.sql` (zero-padded, next number).
2. Apply it: paste into the Supabase SQL editor (or `supabase db push` via CLI).
3. **Log it** in `db/MIGRATIONS.md`: flip the checkbox to `[x]` and add the date.
4. If the schema affects types, update the affected `lib/*.ts` and run typecheck.

> Path note: SQL files physically live under **`supabase/migrations/`** (Supabase
> convention). `db/MIGRATIONS.md` is the applied-state log. See the discrepancy
> note at the bottom of `db/MIGRATIONS.md`.

---

## File map

```
app/
  actions/subscribe.ts     Server Action: validate → rate-limit → Turnstile →
                           upsert lead → best-effort welcome/guide/empty-legs email
  page.tsx                 Homepage (Hero + WhatsInside + Credibility + EmptyLegs + Faq)
  thank-you/page.tsx       Post-submit confirmation (dynamic)
  privacy/page.tsx         Privacy policy + unsubscribe anchor
  layout.tsx · icon.tsx · opengraph-image.tsx · robots.ts · sitemap.ts · globals.css

components/
  LeadForm.tsx             The subscribe form (rendered TWICE: Hero + EmptyLegs)
  Turnstile.tsx            Cloudflare widget. Polls for window.turnstile readiness
                           (NOT global onload — clobbered by the 2nd instance) and
                           calls execute() to force the challenge. Token → hidden input.
  Hero.tsx · EmptyLegs.tsx · WhatsInside.tsx · Credibility.tsx · Faq.tsx · Footer.tsx

lib/
  validation.ts            Zod schema + formDataToObject (shared client/server)
  supabase-server.ts       Service-role client (SERVER ONLY)
  resend.ts                sendWelcomeEmail / sendGuideEmail / sendEmptyLegsEmail
  turnstile.ts             verifyTurnstile (server-side siteverify)
  rate-limit.ts            Upstash rate limit (in-memory fallback)
  utm.ts · analytics.ts · env.ts

emails/
  welcome.tsx · guide.tsx · empty-legs.tsx   React Email templates
  theme.ts                 Shared styles

supabase/migrations/       0001_init_leads.sql · 0002_add_welcome_sent_at.sql
docs/                      CHAT_HANDOFF · SESSION_LOG · DECISIONS · ROADMAP_PROTOCOL
db/MIGRATIONS.md           Applied-state log (source of truth for what's live)
NOTES.md                   Blockers + prioritized backlog (5-field convention)
```

---

## Weekly review

On Fridays, reconcile `NOTES.md` against `docs/CHAT_HANDOFF.md` and close out any
`🟢 done` items into `docs/SESSION_LOG.md`.
