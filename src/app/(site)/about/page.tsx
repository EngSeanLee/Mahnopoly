import Image from "next/image";

export const metadata = { title: "About | Mahnopoly" };

// Real photo is in, full-bleed at the top like the home/epoxy heroes;
// the copy below is still pending from William — see docs/plan.md.
export default function AboutPage() {
  return (
    <>
      <div className="full-bleed" style={{ height: 320 }}>
        <Image
          src="/about-photo.png"
          alt="A tree-lined residential street in Topeka, Kansas at golden hour, with established homes and mature trees along the sidewalk."
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "3rem 2rem" }}>
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
