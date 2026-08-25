"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { uploadPhoto, deletePhoto } from "@/lib/storage";

export default function PhotoUpload({
  initialPhotos = [],
  fieldName = "photos",
  label = "Photos",
  folder,
  placeholder = "Add photos — first one is the main photo",
}: {
  initialPhotos?: string[];
  // Name of the hidden form field this writes to — defaults to "photos"
  // (the listing form's field). Give each PhotoUpload on a page its own
  // fieldName if a page ever uses more than one at once.
  fieldName?: string;
  label?: string;
  // Subfolder within the property-photos bucket, e.g. "epoxy" — keeps a
  // global gallery's files visibly separate from per-listing photos in
  // the Supabase Storage browser. Omit for the bucket root (listings).
  folder?: string;
  placeholder?: string;
}) {
  const [photos, setPhotos] = useState<string[]>(initialPhotos);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    // Each successful upload commits to `photos` immediately, one file at
    // a time, rather than batching them all into a single state update
    // after the whole loop finishes. If a later file in the batch fails
    // (or, before the storage.ts fix, threw and broke the loop outright),
    // everything already uploaded stays visible and gets saved — instead
    // of vanishing from the UI while sitting safely, but unreferenced, in
    // Storage. try/finally guarantees "uploading" always clears, even on
    // a genuinely unexpected error, so this can't get stuck again.
    try {
      const supabase = getSupabaseBrowserClient();
      for (const file of Array.from(files)) {
        const result = await uploadPhoto(supabase, file, folder);
        if ("error" in result) {
          setError(result.error);
        } else {
          setPhotos((prev) => [...prev, result.url]);
        }
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function move(index: number, direction: -1 | 1) {
    setPhotos((prev) => {
      const next = [...prev];
      const swapWith = index + direction;
      if (swapWith < 0 || swapWith >= next.length) return prev;
      [next[index], next[swapWith]] = [next[swapWith], next[index]];
      return next;
    });
  }

  async function remove(index: number) {
    const url = photos[index];
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    const supabase = getSupabaseBrowserClient();
    await deletePhoto(supabase, url);
  }

  return (
    <div className="form-row">
      <label>{label}</label>
      {photos.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: "0.75rem",
            marginBottom: "1rem",
          }}
        >
          {photos.map((url, i) => (
            <div key={url} style={{ position: "relative" }}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: 90,
                  borderRadius: 8,
                  overflow: "hidden",
                  border: "1px solid var(--border)",
                }}
              >
                <Image src={url} alt="" fill style={{ objectFit: "cover" }} unoptimized />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.25rem" }}>
                <div style={{ display: "flex", gap: "0.25rem" }}>
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label="Move earlier"
                    style={{ font: "inherit", cursor: "pointer" }}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === photos.length - 1}
                    aria-label="Move later"
                    style={{ font: "inherit", cursor: "pointer" }}
                  >
                    →
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  style={{ color: "#9a1f1f", font: "inherit", cursor: "pointer" }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="dropzone">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          disabled={uploading}
        />
        <div>{uploading ? "Uploading…" : placeholder}</div>
      </div>
      {error && <div className="form-error">{error}</div>}

      {/* Read by the corresponding form action (one URL per line) — see
          parseListingForm in listings/actions.ts, or saveSettings in
          settings/actions.ts. */}
      <input type="hidden" name={fieldName} value={photos.join("\n")} />
    </div>
  );
}
