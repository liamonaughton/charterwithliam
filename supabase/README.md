# Supabase setup

## 1. Database

Run the migration in the Supabase SQL editor:

```
supabase/migrations/0001_init_leads.sql
```

This creates the `public.leads` table, the unique constraint on `email`, an
`updated_at` trigger, and enables Row Level Security with **no** anon policies —
so the anon key cannot read or write the table. All access is server-side via the
service-role key.

## 2. Storage (lead magnet)

1. Create a **private** bucket named `lead-magnets` (Storage → New bucket →
   uncheck "Public bucket").
2. Upload the designed guide as `charter-buyers-guide.pdf` (matches
   `LEAD_MAGNET_PATH`).
3. The app generates a 7-day **signed URL** server-side and emails it — the
   bucket stays private. No storage policies are required because the
   service-role key is used.

## 3. Keys → environment variables

- `NEXT_PUBLIC_SUPABASE_URL` — Project URL (Settings → API).
- `SUPABASE_SERVICE_ROLE_KEY` — **service_role** secret (Settings → API).
  Server-only. Never expose it to the client or commit it.

## 4. Verify RLS

With only the anon key, this should return **no rows / permission denied**:

```sql
-- run as anon (e.g. from the client with the anon key)
select * from public.leads;   -- expect 0 rows / not permitted
```

## North-star metric

```sql
select count(*) from public.leads
where created_at >= date_trunc('month', now());
```
