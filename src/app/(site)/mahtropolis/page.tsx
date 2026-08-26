import Image from "next/image";
import Ticker from "@/components/Ticker";
import PhotoPlaceholder from "@/components/PhotoPlaceholder";

export const metadata = {
  title: "Mahtropolis | Mahnopoly",
  description:
    "Mahtropolis — a 24-lot subdivision Mahnopoly platted from an open field in North Topeka: street, curbs, and recorded plat all in place, houses going up one at a time.",
};

const STATS = [
  { value: "24", label: "Lots platted" },
  { value: "1,800", label: "Ft of street" },
  { value: "6", label: "Homes under way" },
];

// New page — this and its nav link don't exist on the live site yet.
// Proposed during the redesign session (see the design project's
// github.md sync notes) and included here as part of the client-ready
// page set; flagged in the redesign summary as new scope beyond a
// visual reskin, worth a quick confirmation with William before launch.
export default function MahtropolisPage() {
  return (
    <>
      <div style={{ position: "relative", height: 480, overflow: "hidden" }}>
        <Image
          src="/home-banner-3.png"
          alt="A row of craftsman-style homes along a tree-lined street at golden hour."
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
          priority
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(10,16,34,.88), rgba(10,16,34,.2) 70%)",
          }}
        />
        <div style={{ position: "absolute", left: "2.5rem", bottom: 40, maxWidth: 480 }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              fontWeight: 600,
              letterSpacing: "0.24em",
              color: "var(--red-soft)",
            }}
          >
            NORTH TOPEKA &middot; PHASE ONE COMPLETE
          </span>
          <h1
            style={{
              margin: "18px 0 0",
              fontFamily: "var(--font-serif)",
              fontWeight: 400,
              fontSize: "clamp(2.6rem, 7vw, 5.5rem)",
              lineHeight: 0.95,
              color: "#fff",
            }}
          >
            Mahtropolis
          </h1>
          <p style={{ margin: "18px 0 0", color: "rgba(255,255,255,.75)", fontSize: "0.9rem", lineHeight: 1.75 }}>
            We bought the field, cut the street, set the curbs, and filed
            the plat. Twenty-four lots with our name on the sign.
          </p>
        </div>
      </div>

      <Ticker />

      <div className="blueprint-grid" style={{ padding: "56px 2.5rem" }}>
        <div
          style={{
            maxWidth: 1300,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 26,
            alignItems: "stretch",
          }}
        >
          <div style={{ position: "relative", minHeight: 380, background: "var(--navy-deep)", overflow: "hidden", borderRadius: 5 }}>
            <Image
              src="/redesign/plat-map.webp"
              alt="Recorded plat, phase one — the proposed Mahnopoly Avenue subdivision."
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              style={{
                objectFit: "cover",
                filter: "invert(1) sepia(1) hue-rotate(185deg) saturate(3.2) brightness(.6) contrast(1.15)",
                opacity: 0.88,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(16,26,52,.85) 20%, rgba(16,26,52,.15) 100%)",
              }}
            />
            <span
              style={{
                position: "absolute",
                left: 18,
                bottom: 16,
                fontFamily: "var(--font-mono)",
                fontSize: "0.55rem",
                lineHeight: 1.7,
                letterSpacing: "0.14em",
                color: "rgba(210,226,255,.85)",
              }}
            >
              RECORDED PLAT &middot; PHASE ONE
              <br />
              PROPOSED MAHNOPOLY AVENUE
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 10px" }}>
            <h2
              style={{
                margin: 0,
                fontFamily: "var(--font-serif)",
                fontWeight: 400,
                fontSize: "clamp(1.9rem, 4vw, 2.9rem)",
                lineHeight: 1.05,
                color: "var(--navy)",
              }}
            >
              Drawn once.
              <br />
              <em style={{ fontStyle: "italic", color: "var(--red)" }}>Done properly.</em>
            </h2>
            <p style={{ margin: "20px 0 30px", maxWidth: 440, color: "var(--ink-70)", fontSize: "0.9rem", lineHeight: 1.8 }}>
              Grading in 2023, street and curbs in 2025, lots recorded the
              same fall. Houses go up one at a time — the ones we keep and
              the ones we sell are built the same way.
            </p>
            <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
              {STATS.map((s) => (
                <div key={s.label}>
                  <div style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "2.4rem", lineHeight: 1, color: "var(--navy)" }}>
                    {s.value}
                  </div>
                  <div
                    style={{
                      marginTop: 6,
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.56rem",
                      fontWeight: 500,
                      letterSpacing: "0.14em",
                      color: "var(--ink-50)",
                      textTransform: "uppercase",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            maxWidth: 1300,
            margin: "26px auto 0",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 26,
          }}
        >
          <div style={{ position: "relative", height: 230, borderRadius: 5, overflow: "hidden" }}>
            <Image src="/home-banner-1.png" alt="" fill sizes="33vw" style={{ objectFit: "cover" }} />
          </div>
          <div style={{ position: "relative", height: 230, borderRadius: 5, overflow: "hidden" }}>
            <Image src="/home-banner-2.png" alt="" fill sizes="33vw" style={{ objectFit: "cover" }} />
          </div>
          <div style={{ borderRadius: 5, overflow: "hidden" }}>
            <PhotoPlaceholder label="First finished house on the street" height={230} />
          </div>
        </div>
      </div>
    </>
  );
}
