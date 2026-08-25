-- One-time migration for the already-live Supabase project. Reverses
-- 004_owner_portal.sql — the owner portal was cut from scope (it was
-- included in the planning doc by mistake). Drops the owners/
-- owner_documents tables and their policies, the owner_id column on
-- listings, and the private owner-documents storage bucket along with
-- its policies. The staff table and its RLS fix (003) stay — that's
-- good practice independent of whether an owner portal exists.
--
-- No real data is lost: no owner was ever created for actual business
-- use, only test rows from building/verifying the feature.

drop policy if exists "Staff can upload owner documents" on storage.objects;
drop policy if exists "Staff can update owner documents" on storage.objects;
drop policy if exists "Staff can delete owner documents" on storage.objects;
drop policy if exists "Owners can view their own documents" on storage.objects;

delete from storage.objects where bucket_id = 'owner-documents';
delete from storage.buckets where id = 'owner-documents';

drop policy if exists "Staff can manage owner documents" on owner_documents;
drop policy if exists "Owners can read their own documents" on owner_documents;
drop table if exists owner_documents;

alter table listings drop column if exists owner_id;

drop policy if exists "Staff can manage owners" on owners;
drop policy if exists "Owners can read their own row" on owners;
drop table if exists owners;
