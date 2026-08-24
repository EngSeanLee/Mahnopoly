"use client";

import { createBrowserClient } from "@supabase/ssr";

// Browser client for Client Components — currently only the login form
// (src/components/admin/LoginForm.tsx). Handles setting the session cookie
// that middleware.ts and getSupabaseAdminClient then read on the server.
export function getSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
