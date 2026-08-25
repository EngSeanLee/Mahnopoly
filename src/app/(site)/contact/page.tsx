import { getSettings } from "@/lib/settings";

export const metadata = { title: "Contact | Mahnopoly" };

export default async function ContactPage() {
  const settings = await getSettings();
  const telHref = `tel:${settings.officePhone.replace(/[^\d+]/g, "")}`;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "3rem 2rem" }}>
      <h1 style={{ marginBottom: "1.5rem" }}>Contact Mahnopoly</h1>

      <div style={{ color: "#6b7280", lineHeight: 1.8 }}>
        <p>
          <strong>Office:</strong> {settings.officeAddress}
        </p>
        <p>
          <strong>Phone:</strong> <a href={telHref}>{settings.officePhone}</a>
        </p>
        <p>
          <strong>Hours:</strong> {settings.officeHours}
        </p>
      </div>

      <p style={{ marginTop: "2rem", color: "#6b7280" }}>
        Interested in a specific property? Use the inquiry form on that
        listing&apos;s page and it goes straight to the office.
      </p>
    </div>
  );
}
