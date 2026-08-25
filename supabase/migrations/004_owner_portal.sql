-- One-time migration for the already-live Supabase project. Run this
-- AFTER 003_staff_table_and_rls_fix.sql — the owner-only policies here
-- depend on the staff table existing so staff-vs-owner access stays
-- separated from the moment owners can log in at all.
--
-- After running this file, also run supabase/owner-storage.sql once (not
-- a numbered migration itself, since it only needs to run after this
-- file, same as storage.sql only needing to run after the original
-- schema.sql).

create table if not exists owners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  auth_user_id uuid unique,
  created_at timestamptz not null default now()
);

alter table listings add column if not exists owner_id uuid references owners(id) on delete set null;

create table if not exists owner_documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references owners(id) on delete cascade,
  file_name text not null,
  storage_path text not null,
  uploaded_at timestamptz not null default now()
);

alter table owners enable row level security;
alter table owner_documents enable row level security;

drop policy if exists "Staff can manage owners" on owners;
create policy "Staff can manage owners" on owners for all
  using (exists (select 1 from staff where email = auth.email()))
  with check (exists (select 1 from staff where email = auth.email()));

drop policy if exists "Owners can read their own row" on owners;
create policy "Owners can read their own row" on owners for select
  using (auth_user_id = auth.uid());

drop policy if exists "Staff can manage owner documents" on owner_documents;
create policy "Staff can manage owner documents" on owner_documents for all
  using (exists (select 1 from staff where email = auth.email()))
  with check (exists (select 1 from staff where email = auth.email()));

drop policy if exists "Owners can read their own documents" on owner_documents;
create policy "Owners can read their own documents" on owner_documents for select
  using (
    owner_id in (select id from owners where auth_user_id = auth.uid())
  );
