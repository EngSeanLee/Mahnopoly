-- Property photo storage. Run this in the Supabase SQL editor once,
-- same as schema.sql and seed.sql. Creates a public bucket (property
-- photos are meant to be publicly viewable, like the listings they
-- belong to) with write access restricted to staff, matching the
-- listings/settings RLS pattern in schema.sql.

insert into storage.buckets (id, name, public)
values ('property-photos', 'property-photos', true)
on conflict (id) do nothing;

-- Public (anon) can view/download photos — same visibility as the
-- listings table itself.
create policy "Public can view property photos"
  on storage.objects for select
  using (bucket_id = 'property-photos');

-- Only staff (checked against the `staff` table in schema.sql, not just
-- "any authenticated user") can upload, replace, or remove photos.
create policy "Staff can upload property photos"
  on storage.objects for insert
  with check (
    bucket_id = 'property-photos'
    and exists (select 1 from staff where email = auth.email())
  );

create policy "Staff can update property photos"
  on storage.objects for update
  using (
    bucket_id = 'property-photos'
    and exists (select 1 from staff where email = auth.email())
  );

create policy "Staff can delete property photos"
  on storage.objects for delete
  using (
    bucket_id = 'property-photos'
    and exists (select 1 from staff where email = auth.email())
  );
