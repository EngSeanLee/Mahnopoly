"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { uploadOwnerDocument } from "@/lib/storage";
import { addOwnerDocumentAction, deleteOwnerDocumentAction } from "@/app/admin/(protected)/owners/actions";
import type { OwnerDocument } from "@/lib/owners";

export default function DocumentUpload({
  ownerId,
  documents,
}: {
  ownerId: string;
  documents: OwnerDocument[];
}) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    const supabase = getSupabaseBrowserClient();
    for (const file of Array.from(files)) {
      const result = await uploadOwnerDocument(supabase, ownerId, file);
      if ("error" in result) {
        setError(result.error);
        continue;
      }
      const saved = await addOwnerDocumentAction(ownerId, result.fileName, result.storagePath);
      if (!saved.ok) setError(saved.error);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    router.refresh();
  }

  function remove(doc: OwnerDocument) {
    startTransition(async () => {
      const result = await deleteOwnerDocumentAction(doc.id, doc.storagePath, ownerId);
      if (!result.ok) setError(result.error);
      else router.refresh();
    });
  }

  return (
    <div className="form-row">
      <label>Documents</label>
      {documents.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, marginBottom: "1rem" }}>
          {documents.map((doc) => (
            <li
              key={doc.id}
              style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0", borderBottom: "1px solid var(--border)" }}
            >
              <span>{doc.fileName}</span>
              <button
                type="button"
                onClick={() => remove(doc)}
                style={{ color: "#9a1f1f", background: "none", border: "none", cursor: "pointer", font: "inherit" }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="dropzone">
        <input ref={fileInputRef} type="file" multiple onChange={(e) => handleFiles(e.target.files)} disabled={uploading} />
        <div>{uploading ? "Uploading…" : "Add a document (statement, lease, tax form…)"}</div>
      </div>
      {error && <div className="form-error">{error}</div>}
    </div>
  );
}
