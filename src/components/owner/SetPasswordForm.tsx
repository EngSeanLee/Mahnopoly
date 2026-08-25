"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// Clicking the invite email link lands here with a token in the URL that
// the Supabase browser client picks up automatically (detectSessionInUrl)
// and turns into a session. Unverified against a live Supabase project
// from this environment — mirrors src/components/admin/ResetPasswordForm.tsx,
// which documents the same caveat for the password-reset link, but an
// *invite* link's exact auth event isn't confirmed the same way a
// recovery link's is. Listening for both PASSWORD_RECOVERY and SIGNED_IN
// covers the documented behavior for each; do a real end-to-end test with
// a real invite email before relying on this.
export default function OwnerSetPasswordForm() {
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
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
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
      setError("Something went wrong. Ask the office to resend your invite.");
      return;
    }
    router.push("/owner");
  }

  if (invalidLink) {
    return (
      <div className="login-error" style={{ display: "block" }}>
        This invite link is invalid or has expired — ask the office to
        resend it.
      </div>
    );
  }

  if (!ready) {
    return <p style={{ color: "var(--gray)", textAlign: "center" }}>Verifying link…</p>;
  }

  return (
    <form action={handleSubmit}>
      <div className="form-row">
        <label htmlFor="password">Set a password</label>
        <input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" />
      </div>
      <div className="form-row">
        <label htmlFor="confirm">Confirm password</label>
        <input id="confirm" name="confirm" type="password" required minLength={8} autoComplete="new-password" />
      </div>
      {error && <div className="login-error" style={{ display: "block" }}>{error}</div>}
      <button className="btn btn-navy" type="submit" disabled={isPending} style={{ width: "100%" }}>
        {isPending ? "Saving…" : "Set password"}
      </button>
    </form>
  );
}
