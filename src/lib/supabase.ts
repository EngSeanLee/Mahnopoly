import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Server-only client using the service role key — bypasses RLS, so it must
// never be imported into a Client Component or exposed to the browser.
// Used for trusted server-side writes like saving an inquiry lead.
//
// Returns null instead of throwing when the project isn't configured yet,
// so the app runs locally before Supabase exists. Once docs/plan.md's
// Supabase project is created and .env.local has real values (see
// .env.example), this starts returning a real client with no code changes
// needed elsewhere.
export function getSupabaseServerClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
