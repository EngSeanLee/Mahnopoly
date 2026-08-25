"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { inviteOwnerAction, deleteOwnerAction } from "@/app/admin/(protected)/owners/actions";
import type { Owner } from "@/lib/owners";

export default function OwnerRowActions({ owner }: { owner: Owner }) {
  const router = useRouter();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function invite() {
    setError(null);
    startTransition(async () => {
      const result = await inviteOwnerAction(owner.id);
      if (!result.ok) setError(result.error);
      else router.refresh();
    });
  }

  function remove() {
    setError(null);
    startTransition(async () => {
      const result = await deleteOwnerAction(owner.id);
      if (!result.ok) setError(result.error);
      else router.refresh();
    });
  }

  return (
    <span style={{ display: "inline-flex", gap: "0.75rem", alignItems: "center" }}>
      {!owner.hasLoggedIn && (
        <button
          type="button"
          onClick={invite}
          disabled={isPending}
          style={{ background: "none", border: "none", cursor: "pointer", font: "inherit" }}
        >
          Send invite
        </button>
      )}
      {!confirmingDelete ? (
        <button
          type="button"
          onClick={() => setConfirmingDelete(true)}
          style={{ color: "#9a1f1f", background: "none", border: "none", cursor: "pointer", font: "inherit" }}
        >
          Remove
        </button>
      ) : (
        <>
          <button
            type="button"
            disabled={isPending}
            onClick={remove}
            style={{ color: "#9a1f1f", background: "none", border: "none", cursor: "pointer", font: "inherit", fontWeight: 700 }}
          >
            {isPending ? "Removing…" : "Confirm"}
          </button>
          <button
            type="button"
            onClick={() => setConfirmingDelete(false)}
            style={{ background: "none", border: "none", cursor: "pointer", font: "inherit" }}
          >
            Cancel
          </button>
        </>
      )}
      {error && <span style={{ color: "#9a1f1f", fontSize: "0.85rem" }}>{error}</span>}
    </span>
  );
}
