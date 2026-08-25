"use client";

import { useState, useTransition } from "react";
import { signIn } from "@/app/owner/login/actions";

export default function OwnerLoginForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await signIn(formData);
      // A successful sign-in redirects server-side and never returns here.
      if (result && !result.ok) setError(result.error);
    });
  }

  return (
    <form action={handleSubmit}>
      <div className="form-row">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="username" />
      </div>
      <div className="form-row">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </div>
      {error && <div className="login-error" style={{ display: "block" }}>{error}</div>}
      <button className="btn btn-navy" type="submit" disabled={isPending} style={{ width: "100%" }}>
        {isPending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
