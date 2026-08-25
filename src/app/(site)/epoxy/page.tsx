import PhotoPlaceholder from "@/components/PhotoPlaceholder";

export const metadata = { title: "Epoxy Services | Mahnopoly" };

// Generic description copy — real photo pending from William (a stock
// photo, per his own call), same PhotoPlaceholder pattern used elsewhere
// until then.
export default function EpoxyPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "3rem 2rem" }}>
      <h1 style={{ marginBottom: "1.5rem" }}>Epoxy Services</h1>

      <PhotoPlaceholder label="epoxy project photo" className="big" height={320} />

      <div style={{ marginTop: "2rem", color: "#6b7280" }}>
        <p>
          Mahnopoly applies epoxy flooring for garages, basements,
          workshops, and other concrete surfaces. Epoxy coating seals and
          protects the concrete underneath, resists stains, oil, and wear
          far better than bare concrete, and gives the floor a clean,
          durable, easy-to-clean finish that holds up for years.
        </p>
        <p>
          Call the office to talk through your space and get a quote —
          see the phone number above or the contact info in the footer
          below.
        </p>
      </div>
    </div>
  );
}
