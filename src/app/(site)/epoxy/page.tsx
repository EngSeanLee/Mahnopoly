import Image from "next/image";

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
    title: "The Finished Floor Starts With the Prep",
    body: "A great epoxy floor isn't just about what you see on top. Proper preparation of the concrete is one of the most important parts of a clean, lasting finish — we take the time to get the surface and the details right before the coating goes down.",
  },
  {
    title: "Hands-On Installation",
    body: "Your project isn't passed off to an anonymous crew. Brandon Mah, Lead Installer, takes a hands-on approach to every job, with an emphasis on workmanship, consistency, and a finished product you can be proud of.",
  },
  {
    title: "Built for Real Life",
    body: "Garages and workspaces aren't showrooms — they get used. We build floors that stay attractive well past installation day, and hold up to the way you actually use the space.",
  },
  {
    title: "A Finish That Changes the Room",
    body: "Epoxy can completely transform bare concrete. From clean and understated to bold decorative flake, we'll help pick a finish that complements your space, not just covers it.",
  },
];

// Explicit margins throughout — the site has no global heading reset,
// so bare <h2>/<h3>/<p> tags carry browser default spacing that stacks
// unpredictably with section padding. Every heading/paragraph below
// sets its own margin rather than relying on the UA default.
export default function EpoxyPage() {
  return (
    <>
      <section className="hero">
        <h1>Epoxy Flooring in Topeka, Kansas</h1>
        <p
          className="subhead"
          style={{ fontWeight: 700, color: "var(--ink)", marginBottom: "0.85rem" }}
        >
          Built to Take a Beating. Finished to Impress.
        </p>
        <p className="subhead" style={{ marginBottom: "1.75rem" }}>
          Mahnopoly Epoxy LLC installs professional epoxy flooring for
          garages, shops, basements, workspaces, and commercial properties
          throughout Topeka and the surrounding area — turning ordinary
          concrete into a clean, durable surface, done right from the
          ground up.
        </p>
        <a href="#estimate" className="btn btn-navy">
          Get a Free Estimate
        </a>
      </section>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 2rem 0" }}>
        <div
          style={{
            width: "100%",
            borderRadius: 8,
            overflow: "hidden",
            border: "1px solid var(--border)",
            lineHeight: 0,
          }}
        >
          <Image
            src="/epoxy-flyer.png"
            alt="Mahnopoly Epoxy LLC — a finished garage floor with a dark speckled epoxy coating and matching black cabinetry, alongside the highlights: built to last, easy to clean, looks amazing, installed right."
            width={1536}
            height={1024}
            style={{ width: "100%", height: "auto", display: "block" }}
            sizes="(max-width: 900px) 100vw, 900px"
            priority
          />
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "3rem 2rem" }}>
        <h2 style={{ margin: "0 0 1rem" }}>What Is Epoxy Flooring?</h2>
        <p style={{ color: "var(--gray)", margin: "0 0 1rem" }}>
          Epoxy flooring is a protective coating system applied over
          concrete to create a seamless, durable finished surface. It can
          dramatically improve the appearance of old or unfinished concrete
          while making the floor easier to clean and better suited for
          everyday wear.
        </p>
        <p style={{ color: "var(--gray)", margin: "0 0 0.75rem" }}>
          Epoxy coatings are a great option for:
        </p>
        <ul style={{ color: "var(--gray)", paddingLeft: "1.25rem", margin: "0 0 1.5rem" }}>
          {USES.map((use) => (
            <li key={use} style={{ marginBottom: "0.3rem" }}>
              {use}
            </li>
          ))}
        </ul>
        <p style={{ color: "var(--gray)", margin: 0 }}>
          With a variety of colors, flakes, and finishes available, an
          epoxy floor can be designed to look as good as it performs.
        </p>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem 3rem" }}>
        <h2 style={{ textAlign: "center", margin: "0 0 2rem" }}>
          What Sets Us Apart
        </h2>
        <div className="path-cards" style={{ padding: 0 }}>
          {DIFFERENCE.map((item) => (
            <div className="path-card" key={item.title}>
              <h3 style={{ margin: "0 0 0.5rem" }}>{item.title}</h3>
              <p style={{ margin: 0 }}>{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div
        id="estimate"
        style={{ maxWidth: 700, margin: "0 auto", padding: "0 2rem 4rem" }}
      >
        <div className="inquiry-box" style={{ textAlign: "center" }}>
          <h3 style={{ margin: "0 0 0.75rem" }}>Ready to Transform Your Floor?</h3>
          <p style={{ color: "var(--gray)", margin: 0 }}>
            Tell us about your space and what you&apos;re looking for, and
            we&apos;ll help you find the right direction and an estimate.
          </p>
          <p style={{ margin: "1.5rem 0 0" }}>
            <strong>Brandon Mah</strong> — Lead Installer
          </p>
          <p style={{ color: "var(--gray)", margin: "0.35rem 0 0" }}>
            Call/Text:{" "}
            <a href="tel:+17852245499" style={{ color: "var(--navy)" }}>
              (785) 224-5499
            </a>
          </p>
          <p style={{ color: "var(--gray)", margin: "0.35rem 0 0" }}>
            Office:{" "}
            <a href="tel:+17853296344" style={{ color: "var(--navy)" }}>
              (785) 329-6344
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
