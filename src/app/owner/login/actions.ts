"use server";

import { redirect } from "next/navigation";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export type LoginResult = { ok: false; error: string } | void;

// Reuses getSupabaseAdminClient (src/lib/supabase/server.ts) — despite
// the name it's just a cookie-session-aware server client, not
// staff-specific. What actually determines whether this is a staff or
// owner session is which table (staff vs owners) the resulting user ends
// up matching, checked in the respective (protected) layouts.
export async function signIn(formData: FormData): Promise<LoginResult> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { ok: false, error: "Email and password are required." };
  }

  const supabase = await getSupabaseAdminClient();
  if (!supabase) {
    return {
      ok: false,
      error: "Login isn't connected to a database yet (site is still in development).",
    };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { ok: false, error: "Incorrect email or password." };
  }

  redirect("/owner");
}

export async function signOut() {
  const supabase = await getSupabaseAdminClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/owner/login");
}
