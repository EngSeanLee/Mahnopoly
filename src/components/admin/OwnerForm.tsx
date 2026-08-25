"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createOwnerAction } from "@/app/admin/(protected)/owners/actions";

export default function OwnerForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createOwnerAction(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit} className="two-col">
      <div className="form-row">
        <label htmlFor="name">Owner name</label>
        <input id="name" name="name" type="text" placeholder="Jane Smith" required />
      </div>
      <div className="form-row">
        <label htmlFor="email">Owner email</label>
        <input id="email" name="email" type="email" placeholder="jane@example.com" required />
      </div>
      {error && <div className="form-error">{error}</div>}
      <div className="admin-actions">
        <button className="btn btn-navy" type="submit" disabled={isPending}>
          {isPending ? "Adding…" : "Add owner"}
        </button>
      </div>
    </form>
  );
}
