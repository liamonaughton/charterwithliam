# NOTES — blockers & prioritized backlog

> 5-field convention (ID · Status · Priority · Area · Note) per
> `docs/ROADMAP_PROTOCOL.md`. 🔴 blocker · 🟡 active · 🔵 backlog · 🟢 done.
> `/start` surfaces 🔴 and P0 items as blockers.

| ID | Status | Priority | Area | Note |
|----|--------|----------|------|------|
| N8 | 🔴 | P0 | email | **Original test email won't re-trigger the welcome email. UNRESOLVED.** Prod `leads` row deleted (`SELECT`=0), fresh emails work, Resend suppression checked → nothing. Scenario A (wrong DB) **ruled out**; scenario B (silent Resend reject) **not confirmed**. **Next:** resubmit the address, watch **Resend → Emails live** for whether a send is even *attempted*. No attempt ⇒ upstream (caching / gate logic / propagation), not Resend. Gate: `subscribe.ts:145` `if (!existing?.welcome_sent_at)`. |
| N9 | 🔴 | P1 | email | **Surface the swallowed welcome-send failure.** Add `console.error` on `!sent.ok` for the welcome send — `subscribe.ts:145–156` has no `else`/log, which is why N8 is hard to diagnose. 1–3 lines, **off `main`, its own PR**. Borrow the pattern from `e5c58ce` (don't cherry-pick it). |
| N3 | 🟡 | P1 | infra | **Set `RESEND_FROM` for Vercel Preview** = `Liam <liam@charterwithliam.com>` (currently unset → falls back to `onboarding@resend.dev`). Dashboard fix. |
| N5 | 🔴 | P0 | compliance | **Real mailing address for CAN-SPAM footer.** `NEXT_PUBLIC_MAILING_ADDRESS` is still the placeholder `123 Example St, City, ST 00000`. Must be real before any real-volume send. |
| N10 | 🟡 | P2 | process | **Decide `claude/friendly-keller-n3pn55`'s fate.** Competing static-PDF guide delivery (`public/charter-buyers-guide.pdf` + `scripts/generate-guide.ts`); will conflict in `subscribe.ts`/`resend.ts`. Abandon or reconcile deliberately. Possibly salvage its silent-failure logging pattern (`e5c58ce`). |
| N6 | 🔵 | P2 | email | **Option 2 — dedicated sending subdomain** (`send.charterwithliam.com` verified in Resend) for reputation isolation. Revisit at marketing volume. See DECISIONS D2. |
| N7 | 🔵 | P2 | process | **Resolve `db/` vs `supabase/` migration path** discrepancy (`/start` expects `db/migrations/`; repo uses `supabase/migrations/`). See DECISIONS D3. |

## Closed this session
- **N1** 🟢 — migration `0002` (`welcome_sent_at`) confirmed present in prod.
- **N2** 🟢 — welcome email delivers end-to-end (guide-CTA send shipped & tested).
- **N4** 🟢 — `claude/magical-fermat-0k2i0z` merged to `main` (`35217c3`); `main` is now prod source of truth.
- **Turnstile re-entrancy** 🟢 — `execution:'execute'` + `executedRef` fix merged (`4966b13`) + deployed + verified (console clean).
