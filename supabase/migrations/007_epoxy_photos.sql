-- Adds a photo gallery for the /epoxy page — same pattern as a listing's
-- `photos` column (jsonb array of Supabase Storage public URLs), just
-- living on the singleton settings row since it's one global gallery,
-- not tied to a specific listing. No new bucket or RLS needed: gallery
-- uploads reuse the existing property-photos bucket (see storage.sql),
-- whose staff-write/public-read policies are already bucket-scoped, not
-- listing-scoped.

alter table settings add column if not exists epoxy_photos jsonb not null default '[]';
