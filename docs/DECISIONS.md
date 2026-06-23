# DECISIONS — architecture decision log

> Newest first. Marker: ✅ decided · △ pending. `/start` surfaces open △ items as
> a heads-up. Keep each entry short: the decision, the why, and the date.

---

### D3 △ Migration directory: `db/migrations/` vs `supabase/migrations/`
_Opened 2026-06-22._ The `/start` ritual assumes `db/migrations/` + a co-located
`db/MIGRATIONS.md`; the repo uses Supabase's `supabase/migrations/`. Current
stance: keep SQL under `supabase/` and use `db/MIGRATIONS.md` as a pointer-style
applied-state log. **Pending:** accept the harmless `/start` heads-up, or relocate
SQL to `db/migrations/`. Tracked as NOTES N7.

---

### D2 △ Sending domain: root now, dedicated subdomain later
_Opened 2026-06-22._ Send the welcome (transactional, low-volume) from the
**verified root** `@charterwithliam.com` for now — simplest, no DNS work, no
conflict with ImprovMX inbound forwarding (MX/inbound and SPF/DKIM/outbound are
independent record sets). **Pending trigger:** move to a dedicated
`send.charterwithliam.com` sending subdomain when higher-volume **marketing**
sends begin, to isolate root-domain reputation. Tracked as NOTES N6.

---

### D1 ✅ Send from verified root, not unverified subdomain
_Decided 2026-06-19/20._ `RESEND_FROM` was drifted to
`liam@send.charterwithliam.com`, which Resend rejected ("Domain not verified") —
only the root `charterwithliam.com` is verified. Changed `RESEND_FROM` to
`Liam <liam@charterwithliam.com>` and redeployed. **Why:** root is the only
verified sending identity; the `send.*` records that existed were the root's
bounce/Return-Path plumbing, not a verified From identity. Codified as CLAUDE.md
rule 5.

---

### D0 ✅ All DB access server-side via service role; RLS has no anon policies
_Decided at build._ `public.leads` is locked down with RLS and **no** anon
read/write policies; the app reaches it only through the service-role key in
`lib/supabase-server.ts`. **Why:** the anon key ships to the browser, so any anon
policy would expose lead data. Codified as CLAUDE.md rule 1.
