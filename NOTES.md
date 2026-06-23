# NOTES — blockers & prioritized backlog

> 5-field convention (ID · Status · Priority · Area · Note) per
> `docs/ROADMAP_PROTOCOL.md`. 🔴 blocker · 🟡 active · 🔵 backlog · 🟢 done.
> `/start` surfaces 🔴 and P0 items as blockers.

| ID | Status | Priority | Area | Note |
|----|--------|----------|------|------|
| N1 | 🔴 | P0 | db | **Confirm migration `0002` (`welcome_sent_at`) is applied in production Supabase.** `subscribe.ts` SELECT/UPDATE that column — if unapplied, every subscribe throws. Verify before the next delivery test. See `db/MIGRATIONS.md`. |
| N2 | 🟡 | P1 | email | **Verify welcome email delivers end-to-end** after the `RESEND_FROM` → root fix. Fresh email → confirm receipt + Resend "Delivered". Depends on N1. |
| N3 | 🟡 | P1 | infra | **Set `RESEND_FROM` for Vercel Preview** = `Liam <liam@charterwithliam.com>` (currently unset → falls back to `onboarding@resend.dev`). Use the dashboard. |
| N4 | 🟡 | P1 | process | **Open PR for `claude/magical-fermat-0k2i0z` → `main`** once N2 is confirmed. Pushed, not merged. |
| N5 | 🔴 | P0 | compliance | **Real mailing address for CAN-SPAM footer.** `NEXT_PUBLIC_MAILING_ADDRESS` is still the placeholder `123 Example St, City, ST 00000`. Must be a real address before any real-volume send. |
| N6 | 🔵 | P2 | email | **Option 2 — dedicated sending subdomain** (`send.charterwithliam.com` verified in Resend) for reputation isolation. Revisit when adding marketing-volume sends. See DECISIONS D2. |
| N7 | 🔵 | P2 | process | **Resolve `db/` vs `supabase/` migration path** discrepancy (`/start` expects `db/migrations/`; repo uses `supabase/migrations/`). See DECISIONS D3. |
