"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import {
  createOwner,
  deleteOwner,
  inviteOwner,
  addOwnerDocument,
  deleteOwnerDocument,
  getOwner,
} from "@/lib/owners";
import { deleteOwnerDocumentFile } from "@/lib/storage";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function createOwnerAction(formData: FormData): Promise<ActionResult> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  if (!name || !email) return { ok: false, error: "Name and email are required." };

  const supabase = await getSupabaseAdminClient();
  if (!supabase) return { ok: false, error: "Not connected to a database yet." };

  const { error } = await createOwner(supabase, { name, email });
  if (error) {
    if (error.code === "23505") return { ok: false, error: "An owner with that email already exists." };
    console.error("createOwnerAction: insert failed", error);
    return { ok: false, error: "Something went wrong adding this owner." };
  }

  revalidatePath("/admin/owners");
  return { ok: true };
}

export async function inviteOwnerAction(ownerId: string): Promise<ActionResult> {
  const supabase = await getSupabaseAdminClient();
  if (!supabase) return { ok: false, error: "Not connected to a database yet." };

  const owner = await getOwner(supabase, ownerId);
  if (!owner) return { ok: false, error: "Owner not found." };

  const result = await inviteOwner(owner.email);
  if (!result.ok) return result;

  revalidatePath("/admin/owners");
  revalidatePath(`/admin/owners/${ownerId}`);
  return { ok: true };
}

export async function deleteOwnerAction(ownerId: string): Promise<ActionResult> {
  const supabase = await getSupabaseAdminClient();
  if (!supabase) return { ok: false, error: "Not connected to a database yet." };

  const { error } = await deleteOwner(supabase, ownerId);
  if (error) {
    console.error("deleteOwnerAction: delete failed", error);
    return { ok: false, error: "Something went wrong removing this owner." };
  }

  revalidatePath("/admin/owners");
  revalidatePath("/admin");
  return { ok: true };
}

export async function addOwnerDocumentAction(
  ownerId: string,
  fileName: string,
  storagePath: string
): Promise<ActionResult> {
  const supabase = await getSupabaseAdminClient();
  if (!supabase) return { ok: false, error: "Not connected to a database yet." };

  const { error } = await addOwnerDocument(supabase, { ownerId, fileName, storagePath });
  if (error) {
    console.error("addOwnerDocumentAction: insert failed", error);
    return { ok: false, error: "Uploaded, but couldn't save the document record. Try again." };
  }

  revalidatePath(`/admin/owners/${ownerId}`);
  return { ok: true };
}

export async function deleteOwnerDocumentAction(
  documentId: string,
  storagePath: string,
  ownerId: string
): Promise<ActionResult> {
  const supabase = await getSupabaseAdminClient();
  if (!supabase) return { ok: false, error: "Not connected to a database yet." };

  await deleteOwnerDocumentFile(supabase, storagePath);
  const { error } = await deleteOwnerDocument(supabase, documentId);
  if (error) {
    console.error("deleteOwnerDocumentAction: delete failed", error);
    return { ok: false, error: "Something went wrong removing this document." };
  }

  revalidatePath(`/admin/owners/${ownerId}`);
  return { ok: true };
}
