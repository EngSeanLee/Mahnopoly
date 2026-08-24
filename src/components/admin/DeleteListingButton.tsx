"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteListingAction } from "@/app/admin/(protected)/listings/actions";

export default function DeleteListingButton({
  listingId,
  address,
}: {
  listingId: string;
  address: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        style={{ color: "#9a1f1f", background: "none", border: "none", cursor: "pointer", font: "inherit" }}
      >
        Delete
      </button>
    );
  }

  return (
    <span style={{ display: "inline-flex", gap: "0.5rem", alignItems: "center" }}>
      <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>Remove {address}?</span>
      <button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const result = await deleteListingAction(listingId);
            if (!result.ok) {
              setError(result.error ?? "Something went wrong.");
              return;
            }
            router.refresh();
          })
        }
        style={{ color: "#9a1f1f", background: "none", border: "none", cursor: "pointer", font: "inherit", fontWeight: 700 }}
      >
        {isPending ? "Removing…" : "Confirm"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        style={{ background: "none", border: "none", cursor: "pointer", font: "inherit" }}
      >
        Cancel
      </button>
      {error && <span style={{ color: "#9a1f1f", fontSize: "0.85rem" }}>{error}</span>}
    </span>
  );
}
