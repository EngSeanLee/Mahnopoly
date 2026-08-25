-- One-time migration for the already-live Supabase project. Adds the ZIP
-- code column — required by the Zillow rental feed's <zip> tag (see
-- src/app/zillow-feed.xml/route.ts) and, before this, simply missing
-- from the schema entirely. Nullable, since existing listings won't have
-- one until staff fill it in via the admin panel — the feed route skips
-- (and logs) any listing missing a zip rather than submitting bad data.

alter table listings add column if not exists zip text;
