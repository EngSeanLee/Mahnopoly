-- One-time migration for the already-live Supabase project. Fixes a real
-- security gap: every staff-only policy currently checks
-- `auth.role() = 'authenticated'`, which means ANY logged-in user counts
-- as staff. That was fine while staff were the only kind of login this
-- app had. It stops being fine the moment owners get their own logins
-- (see 004_owner_portal.sql) — an owner would pass this check too and
-- get full staff access: edit any listing, read all inquiries, edit
-- settings. Run this migration BEFORE 004, not after.
--
-- IMPORTANT — do this manually before running the rest of this file:
-- find the email address(es) of the existing staff/admin login(s) (Supabase
-- dashboard > Authentication > Users, or you already know it), and use it
-- in the insert at the bottom. Do not skip that — until a row exists in
-- `staff`, the policies below lock EVERYONE out of the admin panel,
-- including the real staff account.

create table if not exists staff (
  email text primary key,
  created_at timestamptz not null default now()
);
alter table staff enable row level security;

drop policy if exists "Staff can read own staff row" on staff;
create policy "Staff can read own staff row" on staff for select
  using (email = auth.email());

drop policy if exists "Staff can manage listings" on listings;
create policy "Staff can manage listings" on listings for all
  using (exists (select 1 from staff where email = auth.email()))
  with check (exists (select 1 from staff where email = auth.email()));

drop policy if exists "Staff can read inquiries" on inquiries;
create policy "Staff can read inquiries" on inquiries for select
  using (exists (select 1 from staff where email = auth.email()));

drop policy if exists "Staff can manage settings" on settings;
create policy "Staff can manage settings" on settings for update
  using (exists (select 1 from staff where email = auth.email()))
  with check (exists (select 1 from staff where email = auth.email()));

drop policy if exists "Staff can upload property photos" on storage.objects;
create policy "Staff can upload property photos"
  on storage.objects for insert
  with check (
    bucket_id = 'property-photos'
    and exists (select 1 from staff where email = auth.email())
  );

drop policy if exists "Staff can update property photos" on storage.objects;
create policy "Staff can update property photos"
  on storage.objects for update
  using (
    bucket_id = 'property-photos'
    and exists (select 1 from staff where email = auth.email())
  );

drop policy if exists "Staff can delete property photos" on storage.objects;
create policy "Staff can delete property photos"
  on storage.objects for delete
  using (
    bucket_id = 'property-photos'
    and exists (select 1 from staff where email = auth.email())
  );

-- REQUIRED: replace with the real staff login email(s) before running,
-- or add the row separately right after. Safe to re-run (on conflict).
insert into staff (email) values ('REPLACE-WITH-REAL-STAFF-EMAIL@example.com')
on conflict (email) do nothing;
