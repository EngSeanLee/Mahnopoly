import { getSupabaseServiceRoleClient } from "@/lib/supabase/serviceRole";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface Owner {
  id: string;
  name: string;
  email: string;
  hasLoggedIn: boolean; // true once auth_user_id is set (invite accepted)
}

export interface OwnerDocument {
  id: string;
  ownerId: string;
  fileName: string;
  storagePath: string;
  uploadedAt: string;
}

type OwnerRow = {
  id: string;
  name: string;
  email: string;
  auth_user_id: string | null;
};

function rowToOwner(row: OwnerRow): Owner {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    hasLoggedIn: row.auth_user_id !== null,
  };
}

// --- Staff-side (admin) reads/writes — take an already-authenticated
// staff client, same pattern as src/lib/listings.ts's admin writes. ---

export async function getOwners(supabase: SupabaseClient): Promise<Owner[]> {
  const { data, error } = await supabase
    .from("owners")
    .select("id, name, email, auth_user_id")
    .order("name");
  if (error) {
    console.error("getOwners: query failed", error);
    return [];
  }
  return data.map(rowToOwner);
}

export async function getOwner(
  supabase: SupabaseClient,
  id: string
): Promise<Owner | undefined> {
  const { data, error } = await supabase
    .from("owners")
    .select("id, name, email, auth_user_id")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return undefined;
  return rowToOwner(data);
}

// Creates the owners row and, separately, sends the invite email via
// Supabase's admin auth API (needs the service-role key — see
// src/lib/supabase/serviceRole.ts). The two are split on purpose: if the
// invite email fails, the owner row still exists and staff can retry the
// invite without re-entering name/email, same "save first" reasoning as
// the inquiry form (src/lib/notify.ts).
export async function createOwner(
  supabase: SupabaseClient,
  input: { name: string; email: string }
) {
  return supabase
    .from("owners")
    .insert({ name: input.name, email: input.email })
    .select("id, name, email, auth_user_id")
    .single();
}

export type InviteResult = { ok: true } | { ok: false; error: string };

export async function inviteOwner(email: string): Promise<InviteResult> {
  const supabase = getSupabaseServiceRoleClient();
  if (!supabase) {
    return { ok: false, error: "Owner invites aren't configured yet (missing SUPABASE_SECRET_KEY)." };
  }
  const { error } = await supabase.auth.admin.inviteUserByEmail(email);
  if (error) {
    console.error("inviteOwner: invite failed", error);
    return { ok: false, error: "Couldn't send the invite email. Try again." };
  }
  return { ok: true };
}

export async function deleteOwner(supabase: SupabaseClient, id: string) {
  return supabase.from("owners").delete().eq("id", id);
}

export async function getOwnerDocuments(
  supabase: SupabaseClient,
  ownerId: string
): Promise<OwnerDocument[]> {
  const { data, error } = await supabase
    .from("owner_documents")
    .select("id, owner_id, file_name, storage_path, uploaded_at")
    .eq("owner_id", ownerId)
    .order("uploaded_at", { ascending: false });
  if (error) {
    console.error("getOwnerDocuments: query failed", error);
    return [];
  }
  return data.map((row) => ({
    id: row.id,
    ownerId: row.owner_id,
    fileName: row.file_name,
    storagePath: row.storage_path,
    uploadedAt: row.uploaded_at,
  }));
}

export async function addOwnerDocument(
  supabase: SupabaseClient,
  input: { ownerId: string; fileName: string; storagePath: string }
) {
  return supabase.from("owner_documents").insert({
    owner_id: input.ownerId,
    file_name: input.fileName,
    storage_path: input.storagePath,
  });
}

export async function deleteOwnerDocument(supabase: SupabaseClient, id: string) {
  return supabase.from("owner_documents").delete().eq("id", id);
}

// --- Owner-side (portal) reads. ---

// The owners RLS policy ("Owners can read their own row") requires
// auth_user_id to already equal auth.uid() — which it doesn't yet the
// very first time an owner logs in after accepting their invite, since
// nothing has ever linked their new Supabase Auth account back to the
// owners row we created for them by email. This is the one place that
// link gets made — via the service-role client (bypasses RLS on
// purpose), matching strictly by exact email, which Supabase's own login
// has already verified belongs to whoever is asking. Called once from
// src/app/owner/(protected)/layout.tsx; a no-op every time after.
export async function claimOwnerRow(userId: string, email: string): Promise<void> {
  const supabase = getSupabaseServiceRoleClient();
  if (!supabase) return;
  await supabase
    .from("owners")
    .update({ auth_user_id: userId })
    .eq("email", email)
    .is("auth_user_id", null);
}

// Called with the owner's own session-authenticated client — relies on
// "Owners can read their own row" in supabase/schema.sql, not a
// privileged one, so this only ever returns the calling owner's own row.
export async function getOwnerByAuthUser(
  supabase: SupabaseClient,
  authUserId: string
): Promise<Owner | undefined> {
  const { data, error } = await supabase
    .from("owners")
    .select("id, name, email, auth_user_id")
    .eq("auth_user_id", authUserId)
    .maybeSingle();
  if (error || !data) return undefined;
  return rowToOwner(data);
}
