import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "property-photos";

// Uploads happen client-side (browser Supabase client, carrying the
// logged-in staff member's session cookie) rather than through a Server
// Action, since routing binary file uploads through an action is both
// slower and hits body-size limits sooner. RLS on storage.objects (see
// supabase/storage.sql) is what actually enforces "only staff can write"
// — the client-side call is convenience, not the security boundary.
export async function uploadPhoto(
  supabase: SupabaseClient,
  file: File,
  folder?: string
): Promise<{ url: string } | { error: string }> {
  const ext = file.name.split(".").pop() || "jpg";
  const name = `${crypto.randomUUID()}.${ext}`;
  const path = folder ? `${folder}/${name}` : name;

  // Wrapped in try/catch on top of the normal {error} return the SDK
  // gives for an ordinary failure — a dropped connection or anything
  // else that makes the call itself throw needs to become a returned
  // error too, not an uncaught rejection. Uncaught here means the
  // caller's upload loop (PhotoUpload.tsx) breaks mid-batch without
  // ever flipping "uploading" back off, which looks exactly like the
  // whole admin panel freezing even though earlier files in the same
  // batch already uploaded fine (found happening for real, 25 Aug 2026).
  try {
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      console.error("uploadPhoto: upload failed", error);
      return { error: "Upload failed. Try again." };
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return { url: data.publicUrl };
  } catch (err) {
    console.error("uploadPhoto: unexpected error", err);
    return { error: "Upload failed. Try again." };
  }
}

export async function deletePhoto(supabase: SupabaseClient, url: string) {
  // Public URLs look like .../storage/v1/object/public/property-photos/<path>
  const marker = `/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return; // not a photo from this bucket — nothing to do
  const path = url.slice(idx + marker.length);
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) console.error("deletePhoto: remove failed", error);
}
