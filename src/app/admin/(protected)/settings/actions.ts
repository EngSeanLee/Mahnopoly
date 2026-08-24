"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { updateSettings, type SiteSettings } from "@/lib/settings";

export type SaveSettingsResult = { ok: true } | { ok: false; error: string };

export async function saveSettings(formData: FormData): Promise<SaveSettingsResult> {
  const supabase = await getSupabaseAdminClient();
  if (!supabase) return { ok: false, error: "Not connected to a database yet." };

  const settings: SiteSettings = {
    tenantPortalUrl: String(formData.get("tenantPortalUrl") || "").trim(),
    maintenanceRequestUrl: String(formData.get("maintenanceRequestUrl") || "").trim(),
    showTenantButtons: formData.get("showTenantButtons") === "on",
    officeAddress: String(formData.get("officeAddress") || "").trim(),
    officePhone: String(formData.get("officePhone") || "").trim(),
    officeHours: String(formData.get("officeHours") || "").trim(),
  };

  const { error } = await updateSettings(supabase, settings);
  if (error) {
    console.error("saveSettings: update failed", error);
    return { ok: false, error: "Something went wrong saving settings." };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { ok: true };
}
