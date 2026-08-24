"use client";

import { useState, useTransition } from "react";
import type { SiteSettings } from "@/lib/settings";
import { saveSettings } from "@/app/admin/(protected)/settings/actions";

export default function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; error?: string } | null>(null);

  function handleSubmit(formData: FormData) {
    setResult(null);
    startTransition(async () => {
      setResult(await saveSettings(formData));
    });
  }

  return (
    <form action={handleSubmit}>
      <div className="form-row">
        <label htmlFor="tenantPortalUrl">Tenant portal URL</label>
        <input
          id="tenantPortalUrl"
          name="tenantPortalUrl"
          type="url"
          defaultValue={settings.tenantPortalUrl}
          placeholder="https://…"
        />
      </div>
      <div className="form-row">
        <label htmlFor="maintenanceRequestUrl">Maintenance request URL</label>
        <input
          id="maintenanceRequestUrl"
          name="maintenanceRequestUrl"
          type="url"
          defaultValue={settings.maintenanceRequestUrl}
          placeholder="https://…"
        />
        <p className="form-note">
          The home page&apos;s &quot;Already a tenant&quot; button always shows.
          It links here once set; until then it shows &quot;coming soon.&quot;
        </p>
      </div>
      <div className="two-col">
        <div className="form-row">
          <label htmlFor="officeAddress">Office address</label>
          <input id="officeAddress" name="officeAddress" type="text" defaultValue={settings.officeAddress} />
        </div>
        <div className="form-row">
          <label htmlFor="officePhone">Office phone</label>
          <input id="officePhone" name="officePhone" type="text" defaultValue={settings.officePhone} />
        </div>
      </div>
      <div className="form-row">
        <label htmlFor="officeHours">Office hours</label>
        <input id="officeHours" name="officeHours" type="text" defaultValue={settings.officeHours} />
      </div>

      {result && result.ok && (
        <div className="form-success">Settings saved.</div>
      )}
      {result && !result.ok && <div className="form-error">{result.error}</div>}

      <div className="admin-actions">
        <button className="btn btn-navy" type="submit" disabled={isPending}>
          {isPending ? "Saving…" : "Save settings"}
        </button>
      </div>
    </form>
  );
}
