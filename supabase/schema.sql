-- Mahnopoly database schema. Applied to the real Supabase project — this
-- is what's live, not just a plan. Kept here so the schema travels with
-- the code and a fresh project can be brought up to match by running this
-- file once. The table definitions are safe to re-run (`if not exists` /
-- `on conflict do nothing`); the `create policy` statements are not —
-- re-running this against a project that already has it applied will
-- fail on those with a "policy already exists" error, which is expected.

create table if not exists listings (
  id text primary key,
  address text not null,
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
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
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
  maintenance_request_url text,
  show_tenant_buttons boolean not null default false,
  office_address text,
  office_phone text,
  office_hours text,
  constraint settings_singleton check (id = 1)
);
insert into settings (id) values (1) on conflict (id) do nothing;

alter table listings enable row level security;
alter table inquiries enable row level security;
alter table settings enable row level security;

-- Public (anon) visitors can read listings and settings, and can create
-- (not read) inquiries — this is what lets the inquiry form work for a
-- logged-out visitor while keeping their own submission unreadable to
-- other visitors.
create policy "Public can read listings" on listings for select using (true);
create policy "Public can read settings" on settings for select using (true);
create policy "Public can submit inquiries" on inquiries for insert with check (true);

-- Staff (authenticated) can do everything. Tighten this to a specific
-- staff role/table if multiple non-staff authenticated user types are ever
-- added.
create policy "Staff can manage listings" on listings for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Staff can read inquiries" on inquiries for select
  using (auth.role() = 'authenticated');
create policy "Staff can manage settings" on settings for update
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
