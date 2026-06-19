-- CharterWithLiam — track welcome-email sends for idempotency.
-- Run in the Supabase SQL editor (or via the Supabase CLI) after 0001.

alter table public.leads
  add column if not exists welcome_sent_at timestamptz;
