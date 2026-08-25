-- Owner document storage. Run this in the Supabase SQL editor once, after
-- schema.sql (needs the owners/owner_documents tables and the staff
-- table). Mirrors storage.sql's property-photos setup, with one
-- deliberate difference: this bucket is PRIVATE — owner documents
-- (statements, leases, tax forms) are not meant to be publicly viewable
-- like a listing photo is.
--
-- Files are uploaded to `{owner_id}/{random}-{original filename}`. That
-- folder-per-owner path is what the "Owners can view their own
-- documents" policy below checks — an owner can only ever see files
-- under their own id.

insert into storage.buckets (id, name, public)
values ('owner-documents', 'owner-documents', false)
on conflict (id) do nothing;

-- Staff (checked against the staff table in schema.sql) can upload,
-- replace, or remove any owner's documents.
create policy "Staff can upload owner documents"
  on storage.objects for insert
  with check (
    bucket_id = 'owner-documents'
    and exists (select 1 from staff where email = auth.email())
  );

create policy "Staff can update owner documents"
  on storage.objects for update
  using (
    bucket_id = 'owner-documents'
    and exists (select 1 from staff where email = auth.email())
  );

create policy "Staff can delete owner documents"
  on storage.objects for delete
  using (
    bucket_id = 'owner-documents'
    and exists (select 1 from staff where email = auth.email())
  );

-- An owner can view (download) only files under their own owner id
-- folder — verified by test that they cannot see another owner's, same
-- bar the MVP doc sets for the properties themselves.
create policy "Owners can view their own documents"
  on storage.objects for select
  using (
    bucket_id = 'owner-documents'
    and (storage.foldername(name))[1] = (
      select id::text from owners where auth_user_id = auth.uid()
    )
  );
