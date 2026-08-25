import PhotoPlaceholder from "@/components/PhotoPlaceholder";

export const metadata = { title: "About | Mahnopoly" };

// Real content pending from William — see docs/plan.md. Structure is
// built so filling this in later is a content swap, not new layout work.
export default function AboutPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "3rem 2rem" }}>
      <h1 style={{ marginBottom: "1.5rem" }}>About Mahnopoly</h1>

      <PhotoPlaceholder label="family photo" className="big" height={320} />

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
