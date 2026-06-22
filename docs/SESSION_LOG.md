# SESSION_LOG

> Append-only. Newest entry at the top. Each entry: date, recap, and an explicit
> **Next session should start with:** line. `/start` reads only the latest entry.

---

## 2026-06-22 — Session scaffolding created

**Recap:** New session opened against the repo, which had no CharterPax session
scaffolding (`/start` halted — `CLAUDE.md` and `docs/` were absent). Reconstructed
the operating docs from actual repo state and the prior work arc: created
`CLAUDE.md`, `docs/CHAT_HANDOFF.md`, this log, `db/MIGRATIONS.md`, `NOTES.md`,
`docs/ROADMAP_PROTOCOL.md`, and `docs/DECISIONS.md`. No application code changed.

Flagged a structural discrepancy: the `/start` ritual expects migrations under
`db/migrations/`, but the repo uses `supabase/migrations/`. Logged in
`db/MIGRATIONS.md` and NOTES N2 for a decision.

**Next session should start with:** confirming the welcome email delivers
end-to-end on production (fresh email → Resend "Delivered"), after verifying
migration `0002` is applied (NOTES N1).

---

## 2026-06-19/20 — Welcome email + Turnstile fix + Resend domain fix

**Recap:** Integrated the welcome-email feature (template, `sendWelcomeEmail`,
`subscribe.ts` wiring, migration `0002`). Diagnosed and fixed the Turnstile
empty-token bug (two widgets / clobbered global onload → readiness polling +
`execute()`); confirmed live with `success: true`. Fixed Resend "Domain not
verified" by pointing `RESEND_FROM` at the verified root domain (Production env +
redeploy). Branch `claude/magical-fermat-0k2i0z` pushed; not merged.

**Next session should start with:** end-to-end welcome-email delivery test +
setting `RESEND_FROM` for Preview + opening the PR.
