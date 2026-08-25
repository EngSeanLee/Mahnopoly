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
  file: File
): Promise<{ url: string } | { error: string }> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

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

// --- Owner documents — separate PRIVATE bucket (see
// supabase/owner-storage.sql), unlike the public property-photos one
// above. Uploaded to `{ownerId}/{random}-{original filename}`; that
// folder-per-owner path is what the storage RLS policy checks to let an
// owner see only their own files. ---

const OWNER_DOCUMENTS_BUCKET = "owner-documents";

export async function uploadOwnerDocument(
  supabase: SupabaseClient,
  ownerId: string,
  file: File
): Promise<{ storagePath: string; fileName: string } | { error: string }> {
  const path = `${ownerId}/${crypto.randomUUID()}-${file.name}`;

  const { error } = await supabase.storage.from(OWNER_DOCUMENTS_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    console.error("uploadOwnerDocument: upload failed", error);
    return { error: "Upload failed. Try again." };
  }

  return { storagePath: path, fileName: file.name };
}

export async function deleteOwnerDocumentFile(supabase: SupabaseClient, storagePath: string) {
  const { error } = await supabase.storage.from(OWNER_DOCUMENTS_BUCKET).remove([storagePath]);
  if (error) console.error("deleteOwnerDocumentFile: remove failed", error);
}

// Private bucket — no getPublicUrl. A short-lived signed URL is generated
// on demand instead (server-side, using whichever session — staff or the
// owner themselves — is asking; RLS on storage.objects decides whether
// that session is allowed to sign a URL for this path at all).
export async function getOwnerDocumentSignedUrl(
  supabase: SupabaseClient,
  storagePath: string
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(OWNER_DOCUMENTS_BUCKET)
    .createSignedUrl(storagePath, 60);
  if (error || !data) {
    console.error("getOwnerDocumentSignedUrl: failed", error);
    return null;
  }
  return data.signedUrl;
}
