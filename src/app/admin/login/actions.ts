"use server";

import { redirect } from "next/navigation";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export type LoginResult = { ok: false; error: string } | void;

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

  redirect("/admin");
}

export async function signOut() {
  const supabase = await getSupabaseAdminClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/admin/login");
}
