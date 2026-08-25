import Image from "next/image";

export const metadata = { title: "About | Mahnopoly" };

// Real photo is in; the copy below is still pending from William — see
// docs/plan.md.
export default function AboutPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "3rem 2rem" }}>
      <h1 style={{ marginBottom: "1.5rem" }}>About Mahnopoly</h1>

      <div
        style={{
          borderRadius: 8,
          overflow: "hidden",
          border: "1px solid var(--border)",
          lineHeight: 0,
        }}
      >
        <Image
          src="/about-photo.png"
          alt="A tree-lined residential street in Topeka, Kansas at golden hour, with established homes and mature trees along the sidewalk."
          width={1536}
          height={1024}
          style={{ width: "100%", height: "auto", display: "block" }}
          sizes="(max-width: 800px) 100vw, 736px"
        />
      </div>

      <div style={{ marginTop: "2rem", color: "#6b7280" }}>
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
  );
}
