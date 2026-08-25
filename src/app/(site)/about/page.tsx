import Image from "next/image";

export const metadata = { title: "About | Mahnopoly" };

// Contained, full photo visible, no crop/border/full-bleed — pending a
// proper 3:1 banner photo (see globals.css note on .full-bleed for that
// future treatment). The copy below is still pending from William — see
// docs/plan.md.
export default function AboutPage() {
  return (
    <>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 2rem 0", lineHeight: 0 }}>
        <Image
          src="/about-photo.png"
          alt="A tree-lined residential street in Topeka, Kansas at golden hour, with established homes and mature trees along the sidewalk."
          width={1536}
          height={1024}
          style={{ width: "100%", height: "auto", display: "block" }}
          sizes="(max-width: 900px) 100vw, 900px"
          priority
        />
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 2rem 3rem" }}>
        <h1 style={{ marginBottom: "1.5rem" }}>About Mahnopoly</h1>

        <div style={{ color: "#6b7280" }}>
          <p>
            William&apos;s background and how long the business has been
            managing and selling property across Kansas goes here —
            placeholder text until he sends over what he wants said.
          </p>
          <p>
            A few sentences about the family/team behind Mahnopoly, and what
            makes the business different from a big property-management
            company, go here too.
          </p>
        </div>
      </div>
    </>
  );
}
