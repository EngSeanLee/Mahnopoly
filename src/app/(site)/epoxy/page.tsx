import PhotoPlaceholder from "@/components/PhotoPlaceholder";

export const metadata = { title: "Epoxy Services | Mahnopoly" };

// Shell only — real copy pending from William (see docs/plan.md /
// William MVP.md open question #7). Structure is built so filling this
// in later is a content swap, not new layout work, same pattern as
// (site)/about/page.tsx.
export default function EpoxyPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "3rem 2rem" }}>
      <h1 style={{ marginBottom: "1.5rem" }}>Epoxy Services</h1>

      <PhotoPlaceholder label="epoxy project photo" className="big" height={320} />

      <div style={{ marginTop: "2rem", color: "#6b7280" }}>
        <p>
          Details on Mahnopoly&apos;s epoxy services go here — placeholder
          text until William sends over what he wants said.
        </p>
      </div>
    </div>
  );
}
