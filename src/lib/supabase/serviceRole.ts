import { createClient } from "@supabase/supabase-js";

// Service-role client — bypasses RLS entirely. Used for exactly one
// thing: inviting an owner by email (src/lib/owners.ts's inviteOwner),
// which needs Supabase's admin auth API and there is no RLS-respecting
// way to do that from a normal session.
//
// NEVER import this into a Client Component or return its client from a
// function a Client Component can call — SUPABASE_SECRET_KEY must stay
// server-only. It is deliberately not prefixed NEXT_PUBLIC_, unlike the
// publishable key in src/lib/supabase/server.ts, so bundling it into
// client JS by mistake is a build-time env-var-missing error, not a
// silent leak.
export function getSupabaseServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) return null;

  return createClient(url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
