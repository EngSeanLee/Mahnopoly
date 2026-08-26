import { getSettings } from "@/lib/settings";
import GeneralInquiryForm from "@/components/GeneralInquiryForm";

export const metadata = { title: "Contact | Mahnopoly" };

export default async function ContactPage() {
  const settings = await getSettings();
  const telHref = `tel:${settings.officePhone.replace(/[^\d+]/g, "")}`;

  const rows = [
    { label: "Office", value: settings.officeAddress },
    { label: "Phone", value: settings.officePhone, href: telHref },
    { label: "Hours", value: settings.officeHours },
    { label: "Epoxy", value: "Brandon Mah — (785) 224-5499", href: "tel:+17852245499" },
  ];

  return (
    <div
      className="blueprint-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
      }}
    >
      <div style={{ padding: "5rem 2.5rem" }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            fontWeight: 600,
            letterSpacing: "0.24em",
            color: "var(--red)",
          }}
        >
          {settings.officeAddress.toUpperCase()}
        </span>
        <h1
          style={{
            margin: "22px 0 0",
            fontFamily: "var(--font-serif)",
            fontWeight: 400,
            fontSize: "clamp(2rem, 5.5vw, 3.6rem)",
            lineHeight: 1,
            color: "var(--navy)",
          }}
        >
          Call and a person
          <br />
          <em style={{ fontStyle: "italic" }}>picks up.</em>
        </h1>

        <div style={{ marginTop: 36, display: "grid", gap: 20, maxWidth: 460 }}>
          {rows.map((row) => (
            <div
              key={row.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: "1rem",
                paddingBottom: 12,
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6rem",
                  fontWeight: 500,
                  letterSpacing: "0.16em",
                  color: "var(--ink-50)",
                  textTransform: "uppercase",
                }}
              >
                {row.label}
              </span>
              {row.href ? (
                <a href={row.href} style={{ fontSize: "0.95rem", color: "var(--navy)" }}>
                  {row.value}
                </a>
              ) : (
                <span style={{ fontSize: "0.95rem", color: "var(--navy)" }}>{row.value}</span>
              )}
            </div>
          ))}
        </div>

        <p style={{ marginTop: 32, color: "var(--ink-55)", fontSize: "0.85rem", maxWidth: 460 }}>
          Interested in a specific property? Use the inquiry form on that
          listing&apos;s page and it goes straight to the office — or send
          a note here and mention the address.
        </p>
      </div>

      <div style={{ padding: "5rem 2.5rem", background: "var(--cream)", borderLeft: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "1.7rem", color: "var(--navy)" }}>
          Send a note
        </div>
        <div style={{ marginTop: 24, maxWidth: 460 }}>
          <GeneralInquiryForm />
        </div>
      </div>
    </div>
  );
}
