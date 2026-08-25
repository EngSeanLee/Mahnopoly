-- Mahnopoly database schema. Applied to the real Supabase project — this
-- is what's live, not just a plan. Kept here so the schema travels with
-- the code and a fresh project can be brought up to match by running this
-- file once. The table definitions are safe to re-run (`if not exists` /
-- `on conflict do nothing`); the `create policy` statements are not —
-- re-running this against a project that already has it applied will
-- fail on those with a "policy already exists" error, which is expected.

-- Property owners (view-only portal — see the owners/owner_documents
-- policies below). auth_user_id is null until the owner accepts their
-- invite email and logs in for the first time.
create table if not exists owners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  auth_user_id uuid unique,
  created_at timestamptz not null default now()
);

create table if not exists listings (
  id text primary key,
  address text not null,
  city text not null default '',
  zip text,
  neighborhood text not null,
  type text not null check (type in ('rental', 'sale')),
  status text not null check (status in ('available', 'rented', 'pending', 'sold')),
  price numeric not null,
  beds int not null,
  baths numeric not null,
  pets text,
  available_date text,
  description text,
  photos jsonb not null default '[]',
  owner_id uuid references owners(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Documents staff upload for a specific owner (statements, leases, tax
-- forms) — not the property photos, which stay in the separate public
-- property-photos bucket. storage_path points into the private
-- owner-documents bucket (see supabase/owner-storage.sql).
create table if not exists owner_documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references owners(id) on delete cascade,
  file_name text not null,
  storage_path text not null,
  uploaded_at timestamptz not null default now()
);

create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  listing_id text references listings(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  message text,
  created_at timestamptz not null default now()
);

-- Single-row settings table (staff-editable via the admin panel) holding
-- the operational links called out in docs/plan.md: the site never
-- hardcodes a tenant portal or maintenance URL.
create table if not exists settings (
  id int primary key default 1,
  tenant_portal_url text,
  pay_rent_url text,
  maintenance_request_url text,
  uhaul_url text,
  show_tenant_buttons boolean not null default false,
  office_address text,
  office_phone text,
  office_hours text,
  constraint settings_singleton check (id = 1)
);
insert into settings (id) values (1) on conflict (id) do nothing;

-- Staff allowlist. Owners also get real Supabase Auth logins (see the
-- owners table below), so "authenticated" alone no longer means "staff" —
-- every staff-only policy below checks membership here instead. Add a
-- staff member by inserting their login email; there's no admin UI for
-- this on purpose (staff onboarding is rare and manual, done directly in
-- the SQL editor).
create table if not exists staff (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table listings enable row level security;
alter table inquiries enable row level security;
alter table settings enable row level security;
alter table staff enable row level security;
alter table owners enable row level security;
alter table owner_documents enable row level security;

-- Public (anon) visitors can read listings and settings, and can create
-- (not read) inquiries — this is what lets the inquiry form work for a
-- logged-out visitor while keeping their own submission unreadable to
-- other visitors.
create policy "Public can read listings" on listings for select using (true);
create policy "Public can read settings" on settings for select using (true);
create policy "Public can submit inquiries" on inquiries for insert with check (true);

-- A logged-in user can confirm their own staff membership (needed for the
-- `exists` checks below to evaluate at all); nobody can read the whole
-- list or write to it from the app.
create policy "Staff can read own staff row" on staff for select
  using (email = auth.email());

-- Staff (checked against the staff table, not just "any authenticated
-- user" — owners are authenticated too, see below) can manage listings,
-- read inquiries, and edit settings.
create policy "Staff can manage listings" on listings for all
  using (exists (select 1 from staff where email = auth.email()))
  with check (exists (select 1 from staff where email = auth.email()));
create policy "Staff can read inquiries" on inquiries for select
  using (exists (select 1 from staff where email = auth.email()));
create policy "Staff can manage settings" on settings for update
  using (exists (select 1 from staff where email = auth.email()))
  with check (exists (select 1 from staff where email = auth.email()));

-- Owner portal. Listings themselves need no owner-specific policy —
-- they're already fully public via "Public can read listings" above, and
-- the owner-facing page just filters that same public data down to the
-- properties matching the owner's own id. What genuinely needs locking
-- down is the owners table (an owner should only see their own row, not
-- the whole client list) and owner_documents (financial/lease documents
-- are not public).
create policy "Staff can manage owners" on owners for all
  using (exists (select 1 from staff where email = auth.email()))
  with check (exists (select 1 from staff where email = auth.email()));
create policy "Owners can read their own row" on owners for select
  using (auth_user_id = auth.uid());

create policy "Staff can manage owner documents" on owner_documents for all
  using (exists (select 1 from staff where email = auth.email()))
  with check (exists (select 1 from staff where email = auth.email()));
create policy "Owners can read their own documents" on owner_documents for select
  using (
    owner_id in (select id from owners where auth_user_id = auth.uid())
  );
