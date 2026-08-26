import Image from "next/image";
import Ticker from "@/components/Ticker";

export const metadata = {
  title: "About | Mahnopoly",
  description:
    "For more than 15 years, Mahnopoly has been part of the Kansas community, buying, building, and managing residential properties across the state.",
};

const STATS = [
  { value: "184", label: "Homes bought, built or rebuilt" },
  { value: "15+", label: "Years on the same streets" },
  { value: "9", label: "Kansas towns" },
  { value: "24", label: "Lots at Mahtropolis" },
];

// Contained, full photo visible, no crop, at the photo's own aspect
// ratio (2200x1238) — see README > "A gotcha worth knowing" for why
// forcing a photo into a slot shaped for a different ratio is a bad
// trade. Real Mahnopoly photography (from the Mahnopoly Pictures Drive
// folder), replacing an earlier AI-generated placeholder photo.
export default function AboutPage() {
  return (
    <>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 2rem 0", lineHeight: 0 }}>
        <Image
          src="/redesign/about-photo.jpg"
          alt="A finished Mahnopoly duplex at dusk, with warm porch lighting."
          width={2200}
          height={1238}
          style={{ width: "100%", height: "auto", display: "block", borderRadius: 5 }}
          sizes="(max-width: 900px) 100vw, 900px"
          priority
        />
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "3.5rem 2rem 0" }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            fontWeight: 600,
            letterSpacing: "0.24em",
            color: "var(--red)",
          }}
        >
          SINCE 2011
        </span>
        <h1
          style={{
            margin: "18px 0 0",
            fontFamily: "var(--font-serif)",
            fontWeight: 400,
            fontSize: "clamp(2.2rem, 6vw, 3.6rem)",
            lineHeight: 1.05,
            color: "var(--navy)",
          }}
        >
          Local roots.
          <br />
          <em style={{ fontStyle: "italic" }}>Quiet work.</em>
        </h1>

        <div style={{ marginTop: 22 }}>
          <p style={{ color: "var(--ink-70)", fontSize: "0.95rem", lineHeight: 1.85, margin: "0 0 1rem" }}>
            Mahnopoly buys, builds, and looks after houses in Topeka and the
            towns around it. Fifteen years in, the same family answers the
            phone and the same crews show up.
          </p>
          <p style={{ color: "var(--ink-70)", fontSize: "0.95rem", lineHeight: 1.85, margin: 0 }}>
            We&apos;d rather be judged by the street than by the brochure —
            so most of what we&apos;ve done is out there under someone
            else&apos;s porch light.
          </p>
        </div>

        <div
          style={{
            marginTop: 30,
            paddingTop: 22,
            borderTop: "1px solid var(--border)",
            fontFamily: "var(--font-serif)",
            fontWeight: 400,
            fontSize: "1.3rem",
            lineHeight: 1.5,
            color: "var(--navy)",
          }}
        >
          Local roots. Quality homes.
          <br />
          <em style={{ fontStyle: "italic", color: "var(--red)" }}>Stronger communities.</em>
        </div>
      </div>

      <div style={{ marginTop: 56 }}>
        <Ticker />
      </div>

      <div style={{ padding: "56px 2.5rem 78px", background: "var(--cream)" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 26,
          }}
        >
          {STATS.map((s) => (
            <div key={s.label} style={{ padding: 26, border: "1px solid var(--border)", borderRadius: 5, background: "#fff" }}>
              <div style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "3rem", lineHeight: 1, color: "var(--navy)" }}>
                {s.value}
              </div>
              <div
                style={{
                  marginTop: 10,
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
    </>
  );
}
