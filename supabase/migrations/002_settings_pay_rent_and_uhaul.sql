-- One-time migration for the already-live Supabase project. Adds the two
-- new link-out settings called for by the MVP doc: a Pay Rent URL
-- distinct from the general tenant portal URL, and a U-Haul dealership
-- URL for the nav link. Both follow the existing pattern (settings
-- table, never hardcoded) — see supabase/schema.sql. Safe to re-run.

alter table settings add column if not exists pay_rent_url text;
alter table settings add column if not exists uhaul_url text;
