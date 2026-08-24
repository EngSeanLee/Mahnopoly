import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Publishable-key client with no user session attached — always acts as
// the "anon" role for row-level security purposes, regardless of who's
// logged in elsewhere. Safe to use anywhere (it can't bypass RLS): reading
// public listings/settings, and inserting inquiries.
//
// For staff (admin) actions that need the "authenticated" role RLS checks
// in supabase/schema.sql expect, use getSupabaseAdminClient from
// ./server.ts instead — that one reads the logged-in staff member's own
// session cookie.
//
// Returns null instead of throwing when the project isn't configured yet,
// so the app runs locally before Supabase exists.
export function getSupabasePublicClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) return null;
  return createClient(url, publishableKey, {
    auth: { persistSession: false },
  });
}
