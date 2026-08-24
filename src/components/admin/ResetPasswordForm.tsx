"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// Clicking the emailed reset link lands here with a recovery token in the
// URL. The Supabase browser client picks that up automatically on init
// (detectSessionInUrl) and fires a PASSWORD_RECOVERY auth event once it
// has — that's the documented way to know the link was valid and a
// session now exists to actually change the password with.
export default function ResetPasswordForm() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });

    // If the link was already consumed/expired, no event ever fires —
    // don't leave the user staring at a spinner forever.
    const timeout = setTimeout(() => {
      setReady((alreadyReady) => {
        if (!alreadyReady) setInvalidLink(true);
        return alreadyReady;
      });
    }, 4000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const password = String(formData.get("password") || "");
    const confirm = String(formData.get("confirm") || "");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setIsPending(true);
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ password });
    setIsPending(false);
    if (error) {
      setError("Something went wrong. Try requesting a new reset link.");
      return;
    }
    router.push("/admin");
  }

  if (invalidLink) {
    return (
      <div>
        <div className="login-error" style={{ display: "block" }}>
          This reset link is invalid or has expired.
        </div>
        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          <Link href="/admin/forgot-password" style={{ color: "var(--navy)", fontSize: "0.9rem" }}>
            Request a new one
          </Link>
        </p>
      </div>
    );
  }

  if (!ready) {
    return <p style={{ color: "var(--gray)", textAlign: "center" }}>Verifying link…</p>;
  }

  return (
    <form action={handleSubmit}>
      <div className="form-row">
        <label htmlFor="password">New password</label>
        <input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" />
      </div>
      <div className="form-row">
        <label htmlFor="confirm">Confirm new password</label>
        <input id="confirm" name="confirm" type="password" required minLength={8} autoComplete="new-password" />
      </div>
      {error && <div className="login-error" style={{ display: "block" }}>{error}</div>}
      <button className="btn btn-navy" type="submit" disabled={isPending} style={{ width: "100%" }}>
        {isPending ? "Saving…" : "Set password"}
      </button>
    </form>
  );
}
