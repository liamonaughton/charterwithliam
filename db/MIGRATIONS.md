# MIGRATIONS — applied-state log

> **Source of truth for what's live in the database.** Each migration is a
> checkbox: `[x]` applied to production Supabase, `[ ]` not yet applied. Flip the
> box and add the date the moment you run it. Per CLAUDE.md rule 2, migrations are
> append-only — never edit an applied one.

SQL files live under **`supabase/migrations/`** (see path discrepancy note below).

| # | File | Adds | Applied |
|---|------|------|---------|
| 0001 | `supabase/migrations/0001_init_leads.sql` | `public.leads` table, unique `email`, `updated_at` trigger, RLS (no anon policies) | [x] 2026-06-19 |
| 0002 | `supabase/migrations/0002_add_welcome_sent_at.sql` | `welcome_sent_at timestamptz` on `leads` | [x] 2026-06-22 |

## Unapplied / unconfirmed

- _None._ 0002 was confirmed live in production on 2026-06-22 via
  `select column_name from information_schema.columns where table_name = 'leads'
  and column_name = 'welcome_sent_at';` (one row returned). This log was stale —
  it still read UNCONFIRMED after NOTES N1 was already closed 🟢; reconciled
  2026-06-24.

## Path discrepancy (decision needed)

The `/start` ritual globs `db/migrations/*.sql` and treats this file's directory
as the migration home. This repo keeps SQL under `supabase/migrations/` (Supabase
convention). They are **not** the same directory, so `/start` step 6 may emit a
harmless "file missing from db/migrations/" heads-up for logged entries. Options:
keep this pointer log as-is (recommended — don't fight Supabase's layout), or
relocate SQL to `db/migrations/`. Tracked as NOTES N2 / DECISIONS D3.
