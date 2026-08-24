import { getSupabasePublicClient } from "@/lib/supabase/public";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface SiteSettings {
  tenantPortalUrl: string;
  maintenanceRequestUrl: string;
  // No longer drives any UI — the home page's tenant card always shows
  // now (falls back to "coming soon" until tenantPortalUrl is set).
  // Column stays in the DB/type to avoid an unnecessary migration; not
  // exposed in the admin settings form anymore.
  showTenantButtons: boolean;
  officeAddress: string;
  officePhone: string;
  officeHours: string;
}

// Real values, matching William's Facebook business page — used both as
// the fallback when Supabase isn't reachable and as the seed for the
// settings row itself (see the update below).
const FALLBACK_SETTINGS: SiteSettings = {
  tenantPortalUrl: "",
  maintenanceRequestUrl: "",
  showTenantButtons: false,
  officeAddress: "504 SW 2nd Street, Topeka, KS 66603",
  officePhone: "(785) 329-6344",
  officeHours: "Mon–Fri hours",
};

type SettingsRow = {
  tenant_portal_url: string | null;
  maintenance_request_url: string | null;
  show_tenant_buttons: boolean;
  office_address: string | null;
  office_phone: string | null;
  office_hours: string | null;
};

function rowToSettings(row: SettingsRow): SiteSettings {
  return {
    tenantPortalUrl: row.tenant_portal_url ?? "",
    maintenanceRequestUrl: row.maintenance_request_url ?? "",
    showTenantButtons: row.show_tenant_buttons,
    officeAddress: row.office_address || FALLBACK_SETTINGS.officeAddress,
    officePhone: row.office_phone || FALLBACK_SETTINGS.officePhone,
    officeHours: row.office_hours || FALLBACK_SETTINGS.officeHours,
  };
}

// Publicly readable (per supabase/schema.sql) — used by the home page and
// footer. Falls back to hardcoded defaults if Supabase isn't configured or
// the query fails, same reasoning as src/lib/listings.ts.
export async function getSettings(): Promise<SiteSettings> {
  const supabase = getSupabasePublicClient();
  if (!supabase) return FALLBACK_SETTINGS;

  const { data, error } = await supabase
    .from("settings")
    .select(
      "tenant_portal_url, maintenance_request_url, show_tenant_buttons, office_address, office_phone, office_hours"
    )
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) {
    console.error("getSettings: query failed, using fallback", error);
    return FALLBACK_SETTINGS;
  }
  return rowToSettings(data);
}

export async function updateSettings(
  supabase: SupabaseClient,
  settings: SiteSettings
) {
  return supabase
    .from("settings")
    .update({
      tenant_portal_url: settings.tenantPortalUrl,
      maintenance_request_url: settings.maintenanceRequestUrl,
      show_tenant_buttons: settings.showTenantButtons,
      office_address: settings.officeAddress,
      office_phone: settings.officePhone,
      office_hours: settings.officeHours,
    })
    .eq("id", 1);
}
