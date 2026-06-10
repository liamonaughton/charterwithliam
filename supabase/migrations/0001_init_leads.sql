-- CharterWithLiam — leads schema
-- Run in the Supabase SQL editor (or via the Supabase CLI).

create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id               uuid primary key default gen_random_uuid(),
  email            text not null,
  first_name       text,
  phone            text,
  wants_guide      boolean not null default true,
  wants_empty_legs boolean not null default false,
  home_airport     text,
  typical_routes   text,
  consent          boolean not null default false,
  source           text,            -- e.g. 'instagram', 'tiktok', 'youtube', 'direct'
  utm_source       text,
  utm_medium       text,
  utm_campaign     text,
  ip_country       text,
  guide_sent_at    timestamptz,
  unsubscribed_at  timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint leads_email_unique unique (email)
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- Keep updated_at fresh on upsert/update.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_leads_updated_at on public.leads;
create trigger trg_leads_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- Row Level Security: lock the table down completely.
-- There are NO anon/authenticated policies, so the anon key can neither read
-- nor write. All access goes through the server using the SERVICE ROLE key,
-- which bypasses RLS by design.
alter table public.leads enable row level security;

-- Belt-and-braces: ensure the anon/authenticated roles have no table grants.
revoke all on public.leads from anon, authenticated;

-- The application performs an upsert on (email) with OR-merge of the flags,
-- handled in app/actions/subscribe.ts. Equivalent SQL for reference:
--
--   insert into public.leads (email, wants_guide, wants_empty_legs, ...)
--   values (...)
--   on conflict (email) do update set
--     wants_guide      = public.leads.wants_guide      or excluded.wants_guide,
--     wants_empty_legs = public.leads.wants_empty_legs or excluded.wants_empty_legs,
--     first_name       = coalesce(excluded.first_name, public.leads.first_name);
