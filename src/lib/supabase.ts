import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Server-side client using the publishable key. This key is safe to expose
// (it's the same one a browser client would use) — it does NOT bypass row
// level security, so what it can do is exactly what supabase/schema.sql's
// policies allow: read listings/settings, and insert into inquiries.
// That's everything the current app needs.
//
// The admin panel (staff writing listings, reading inquiries) will
// authenticate real staff via Supabase Auth and rely on the "authenticated"
// RLS policies already in schema.sql — not a more powerful key. If a
// genuine need for the secret/service-role key comes up later (background
// jobs, migrations), add a separate server-only client for that then.
//
// Returns null instead of throwing when the project isn't configured yet,
// so the app runs locally before Supabase exists. Once .env.local has real
// values (see .env.example), this starts returning a real client with no
// code changes needed elsewhere.
export function getSupabaseServerClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) return null;
  return createClient(url, publishableKey, {
    auth: { persistSession: false },
  });
}
