import { getSettings } from "@/lib/settings";

export const metadata = { title: "Tenant Portal | Mahnopoly" };

export default async function TenantPortalPage() {
  const settings = await getSettings();
  const hasAnyLink = settings.payRentUrl || settings.maintenanceRequestUrl;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "3rem 2rem" }}>
      <h1 style={{ marginBottom: "1.5rem" }}>Tenant Portal</h1>

      <div className="two-col" style={{ marginBottom: "1.5rem" }}>
        <a
          className="btn btn-navy"
          href={settings.payRentUrl || undefined}
          aria-disabled={!settings.payRentUrl}
          target={settings.payRentUrl ? "_blank" : undefined}
          rel={settings.payRentUrl ? "noopener noreferrer" : undefined}
          style={!settings.payRentUrl ? { pointerEvents: "none", opacity: 0.5 } : undefined}
        >
          {settings.payRentUrl ? "Pay Rent" : "Pay Rent — Coming Soon"}
        </a>
        <a
          className="btn btn-navy"
          href={settings.maintenanceRequestUrl || undefined}
          aria-disabled={!settings.maintenanceRequestUrl}
          target={settings.maintenanceRequestUrl ? "_blank" : undefined}
          rel={settings.maintenanceRequestUrl ? "noopener noreferrer" : undefined}
          style={!settings.maintenanceRequestUrl ? { pointerEvents: "none", opacity: 0.5 } : undefined}
        >
          {settings.maintenanceRequestUrl ? "Submit a Maintenance Request" : "Maintenance Request — Coming Soon"}
        </a>
      </div>

      {!hasAnyLink && (
        <div className="construction-note">
          <h3>Online rent payments and maintenance requests are coming</h3>
          <p>
            William hasn&apos;t selected a property-management platform yet.
            Until then, please call or message the office directly — see
            the phone number above or the office info in the footer below.
          </p>
        </div>
      )}
    </div>
  );
}
