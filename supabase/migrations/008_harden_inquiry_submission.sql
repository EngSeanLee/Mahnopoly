-- Replace unrestricted anonymous table inserts with a validated, bounded RPC.
-- Apply this migration before deploying the matching Server Action changes.

drop policy if exists "Public can submit inquiries" on inquiries;

create index if not exists inquiries_created_at_idx on inquiries (created_at desc);
create index if not exists inquiries_email_created_at_idx on inquiries (lower(email), created_at desc);

create or replace function submit_inquiry(
  p_listing_id text,
  p_name text,
  p_email text,
  p_phone text default '',
  p_message text default ''
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
  clean_name text := btrim(coalesce(p_name, ''));
  clean_email text := lower(btrim(coalesce(p_email, '')));
  clean_phone text := btrim(coalesce(p_phone, ''));
  clean_message text := btrim(coalesce(p_message, ''));
begin
  if length(clean_name) < 1 or length(clean_name) > 100 then
    raise exception 'invalid_name';
  end if;
  if length(clean_email) < 3 or length(clean_email) > 254
     or clean_email !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'invalid_email';
  end if;
  if length(clean_phone) > 40 or length(clean_message) > 4000 then
    raise exception 'invalid_length';
  end if;

  if (select count(*) from inquiries where created_at > now() - interval '10 minutes') >= 30 then
    raise exception 'rate_limit';
  end if;
  if (
    select count(*) from inquiries
    where lower(email) = clean_email
      and created_at > now() - interval '1 hour'
  ) >= 3 then
    raise exception 'rate_limit';
  end if;

  insert into inquiries (listing_id, name, email, phone, message)
  values (p_listing_id, clean_name, clean_email, clean_phone, clean_message)
  returning id into new_id;
  return new_id;
end;
$$;

revoke all on function submit_inquiry(text, text, text, text, text) from public;
grant execute on function submit_inquiry(text, text, text, text, text) to anon, authenticated;
