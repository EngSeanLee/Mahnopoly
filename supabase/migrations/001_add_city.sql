-- One-time migration for the already-live Supabase project (schema.sql's
-- `create table if not exists` won't retroactively add a column to a
-- table that already exists). Run this once in the Supabase SQL editor.
-- Safe to re-run: `add column if not exists` and the backfill only
-- touches rows where city is still empty.

alter table listings add column if not exists city text not null default '';

-- Backfill: every listing currently in the live project is in Topeka
-- (see supabase/seed.sql and the real listings added since). Update this
-- if that's no longer true by the time this runs.
update listings set city = 'Topeka' where city = '';
