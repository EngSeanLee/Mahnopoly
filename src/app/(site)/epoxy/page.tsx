import Image from "next/image";
import { getSettings } from "@/lib/settings";
import Ticker from "@/components/Ticker";

export const metadata = {
  title: "Epoxy Flooring in Topeka, Kansas | Mahnopoly Epoxy",
  description:
    "Professional epoxy floor installations for garages, shops, basements, workspaces, and commercial properties throughout Topeka and the surrounding area.",
};

const USES = [
  "Garages",
  "Workshops",
  "Basements",
  "Commercial spaces",
  "Utility rooms",
  "Showrooms",
  "Warehouses and work areas",
];

const DIFFERENCE = [
  {
    title: "The prep",
    body: "A great epoxy floor isn't just about what you see on top. Proper preparation of the concrete is one of the most important parts of a clean, lasting finish — we take the time to get the surface and the details right before the coating goes down.",
  },
  {
    title: "Hands-on installation",
    body: "Your project isn't passed off to an anonymous crew. Brandon Mah, Lead Installer, takes a hands-on approach to every job, with an emphasis on workmanship, consistency, and a finished product you can be proud of.",
  },
  {
    title: "Built for real life",
    body: "Garages and workspaces aren't showrooms — they get used. We build floors that stay attractive well past installation day, and hold up to the way you actually use the space.",
  },
  {
    title: "A finish that changes the room",
    body: "Epoxy can completely transform bare concrete. From clean and understated to bold decorative flake, we'll help pick a finish that complements your space, not just covers it.",
  },
];

// Real hero photo (public/epoxy-flyer.png, 1920x640) as a full-bleed
// backdrop with the redesign's overlaid headline treatment — the design
// mockup used a placeholder pattern here since this photo didn't exist
// yet when it was built; the live site has real photography, so it goes
// behind the headline instead of below it.
export default async function EpoxyPage() {
  const settings = await getSettings();
  return (
    <>
      <div style={{ position: "relative", height: 440, overflow: "hidden" }}>
        <Image
          src="/epoxy-flyer.png"
          alt="A finished garage in Topeka, Kansas with a glossy dark speckled epoxy floor coating reflecting the overhead lighting, dark cabinetry and tool storage along the wall, and natural light through a window."
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
          priority
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(10,16,34,.9), rgba(10,16,34,.35))",
          }}
        />
        <div style={{ position: "absolute", left: "2.5rem", bottom: 40, maxWidth: 640 }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              fontWeight: 600,
              letterSpacing: "0.24em",
              color: "var(--red-soft)",
            }}
          >
            EPOXY FLOORING &middot; BRANDON MAH, LEAD INSTALLER
          </span>
          <h1
            style={{
              margin: "18px 0 0",
              fontFamily: "var(--font-serif)",
              fontWeight: 400,
              fontSize: "clamp(2.2rem, 5.5vw, 4rem)",
              lineHeight: 1,
              color: "#fff",
            }}
          >
            A floor that
            <br />
            <em style={{ fontStyle: "italic" }}>outlasts the truck.</em>
          </h1>
          <a href="#estimate" className="btn btn-red" style={{ display: "inline-block", marginTop: 26 }}>
            Get a free estimate
          </a>
        </div>
      </div>

      <Ticker />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          background: "var(--cream)",
        }}
      >
        <div style={{ padding: "56px 2.5rem" }}>
          <h2 style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "2.3rem", color: "var(--navy)" }}>
            What it is
          </h2>
          <p style={{ margin: "18px 0 0", color: "var(--ink-70)", fontSize: "0.9rem", lineHeight: 1.8 }}>
            A protective coating poured over concrete — seamless, easy to
            clean, and far better looking than bare slab. Garages,
            workshops, basements, showrooms, warehouses.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 22 }}>
            {USES.map((use) => (
              <span
                key={use}
                style={{
                  padding: "8px 14px",
                  border: "1px solid var(--border)",
                  borderRadius: 99,
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6rem",
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  color: "var(--ink-62)",
                  textTransform: "uppercase",
                }}
              >
                {use}
              </span>
            ))}
          </div>
        </div>
        <div style={{ padding: "56px 2.5rem", borderLeft: "1px solid var(--border)" }}>
          <h2 style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "2.3rem", color: "var(--navy)" }}>
            What sets us apart
          </h2>
          <div style={{ display: "grid", gap: 18, marginTop: 20 }}>
            {DIFFERENCE.map((item) => (
              <div key={item.title} style={{ display: "flex", gap: 16 }}>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--red)" }}>—</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--navy)" }}>{item.title}</div>
                  <div style={{ marginTop: 4, color: "var(--ink-62)", fontSize: "0.85rem", lineHeight: 1.7 }}>
                    {item.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hidden entirely until at least one photo's uploaded via
          /admin/settings — same "hidden until set" pattern as the
          U-Haul link and tenant-portal buttons elsewhere on the site. */}
      {settings.epoxyPhotos.length > 0 && (
        <div style={{ padding: "20px 2.5rem 78px", background: "var(--cream)" }}>
          <div style={{ maxWidth: 1300, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", margin: "34px 0 22px", flexWrap: "wrap", gap: "1rem" }}>
              <h2 style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "2.3rem", color: "var(--navy)" }}>
                Recent work
              </h2>
              <a
                href="tel:+17852245499"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  color: "var(--red)",
                }}
              >
                CALL/TEXT (785) 224-5499
              </a>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: 20,
              }}
            >
              {settings.epoxyPhotos.map((url, i) => (
                <div
                  key={url}
                  style={{
                    position: "relative",
                    height: 220,
                    borderRadius: 5,
                    overflow: "hidden",
                    border: "1px solid var(--border)",
                  }}
                >
                  <Image
                    src={url}
                    alt={`Completed epoxy flooring project, photo ${i + 1}`}
                    fill
                    sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 25vw"
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div id="estimate" style={{ maxWidth: 700, margin: "0 auto", padding: "0 2.5rem 4rem" }}>
        <div className="inquiry-box" style={{ textAlign: "center" }}>
          <h3>Ready to transform your floor?</h3>
          <p style={{ color: "var(--ink-62)", margin: 0, fontSize: "0.9rem" }}>
            Tell us about your space and what you&apos;re looking for, and
            we&apos;ll help you find the right direction and an estimate.
          </p>
          <p style={{ margin: "1.5rem 0 0", fontWeight: 600, color: "var(--navy)" }}>
            Brandon Mah — Lead Installer
          </p>
          <p style={{ color: "var(--ink-62)", margin: "0.35rem 0 0", fontSize: "0.9rem" }}>
            Call/Text:{" "}
            <a href="tel:+17852245499" style={{ color: "var(--red)" }}>
              (785) 224-5499
            </a>
          </p>
          <p style={{ color: "var(--ink-62)", margin: "0.35rem 0 0", fontSize: "0.9rem" }}>
            Office:{" "}
            <a href="tel:+17853296344" style={{ color: "var(--red)" }}>
              (785) 329-6344
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
