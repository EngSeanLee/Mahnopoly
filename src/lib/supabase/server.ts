import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Session-aware client for Server Components and Server Actions under
// src/app/admin — reads the logged-in staff member's session from cookies,
// so Supabase sees them as "authenticated" and supabase/schema.sql's
// staff-only RLS policies (manage listings, read inquiries, edit settings)
// apply correctly. Never import this into a Client Component.
//
// Returns null when the project isn't configured yet (see
// src/lib/supabase/public.ts for why that matters).
export async function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) return null;

  const cookieStore = await cookies();

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component render, where cookies can't be
          // written — middleware.ts refreshes the session on every request
          // instead, so this is safe to ignore.
        }
      },
    },
  });
}
