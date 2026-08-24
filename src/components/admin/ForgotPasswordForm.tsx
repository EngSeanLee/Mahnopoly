"use client";

import { useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setIsPending(true);
    const email = String(formData.get("email") || "").trim();
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });
    setIsPending(false);
    // Always show the same success message regardless of whether the
    // email exists — same reasoning as any login form: don't reveal
    // which addresses have staff accounts.
    if (error) {
      console.error("resetPasswordForEmail failed", error);
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="form-success">
        If that email has a staff account, a password reset link is on its
        way. Check the inbox (and spam folder).
      </div>
    );
  }

  return (
    <form action={handleSubmit}>
      <div className="form-row">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="username" />
      </div>
      {error && <div className="login-error" style={{ display: "block" }}>{error}</div>}
      <button className="btn btn-navy" type="submit" disabled={isPending} style={{ width: "100%" }}>
        {isPending ? "Sending…" : "Send reset link"}
      </button>
      <p style={{ textAlign: "center", marginTop: "1.25rem" }}>
        <Link href="/admin/login" style={{ color: "var(--gray)", fontSize: "0.9rem" }}>
          &larr; Back to sign in
        </Link>
      </p>
    </form>
  );
}
