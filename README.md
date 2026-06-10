# CharterWithLiam — Capture Page

Lead-capture landing page for [charterwithliam.com](https://charterwithliam.com).
Converts social traffic into owned email leads in exchange for the **Charter
Buyer's Guide** and an **empty-leg deal alert** list.

> North-star metric: **leads captured / month** = row count in the Supabase
> `leads` table.

## Stack

- **Next.js 14** (App Router, TypeScript) — Server Action for the form submit
- **Tailwind CSS** — design tokens in `tailwind.config.ts`
- **Supabase** — Postgres `leads` table + private Storage bucket for the guide
- **Resend** — transactional guide + empty-leg welcome emails (react-email templates)
- **Cloudflare Turnstile** + honeypot + rate limit — bot/spam protection
- **Zod** — shared validation (client + server)
- **Vercel Web Analytics** — `lead_captured` conversion event

## Routes

| Route        | Purpose                              |
| ------------ | ------------------------------------ |
| `/`          | Landing + capture form (primary)     |
| `/thank-you` | Post-submit confirmation             |
| `/privacy`   | Privacy policy (required for consent) |

The form submits via the `subscribe` **Server Action** (`app/actions/subscribe.ts`),
which keeps the service-role key server-only. No public API route is exposed.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev
```

The site runs **without** secrets configured — Turnstile verification is skipped,
and submits fail gracefully with a friendly message if Supabase/Resend are unset.
Fill the env vars to exercise the full flow.

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
npm run build       # production build
```

Preview the emails:

```bash
npx react-email dev   # serves emails/ at http://localhost:3000
```

## Environment variables

See [`.env.example`](./.env.example). Set all of these in the Vercel project
(Production **and** Preview). Keep `SUPABASE_SERVICE_ROLE_KEY`,
`RESEND_API_KEY`, and `TURNSTILE_SECRET_KEY` server-only — never prefix them
with `NEXT_PUBLIC_`.

## Setup checklist

1. **Supabase** — run `supabase/migrations/0001_init_leads.sql`, create the
   private `lead-magnets` bucket, upload `charter-buyers-guide.pdf`. See
   [`supabase/README.md`](./supabase/README.md).
2. **Resend** — verify the sending domain (`charterwithliam.com`), set
   `RESEND_FROM` to `Liam <liam@charterwithliam.com>`.
3. **Turnstile** — create a widget at Cloudflare, set the site + secret keys.
4. **Vercel** — connect the GitHub repo, add env vars, enable Web Analytics.

## Submit flow

`app/actions/subscribe.ts`:

1. Parse + validate (Zod) — email valid, consent true, honeypot empty.
2. Honeypot filled → silently succeed and drop.
3. Rate-limit by IP (Upstash if configured, else in-memory; 5/min).
4. Verify the Turnstile token server-side.
5. Upsert into `leads` on conflict (email), OR-merging the asset flags.
6. If `wants_guide` (and not already sent): signed PDF URL → Resend, set
   `guide_sent_at`.
7. If newly `wants_empty_legs`: send the empty-leg welcome.
8. Fire the `lead_captured` analytics event (client) and redirect to
   `/thank-you`.

## Project structure

```
app/
  layout.tsx  page.tsx
  thank-you/page.tsx   privacy/page.tsx
  actions/subscribe.ts          # "use server"
  opengraph-image.tsx  icon.tsx  robots.ts  sitemap.ts
components/
  Hero  WhatsInside  Credibility  EmptyLegs  Faq  Footer  LeadForm  Turnstile
lib/
  validation  supabase-server  resend  turnstile  rate-limit  utm  analytics  env
emails/
  guide.tsx  empty-legs.tsx  theme.ts
supabase/
  migrations/0001_init_leads.sql  README.md
```
