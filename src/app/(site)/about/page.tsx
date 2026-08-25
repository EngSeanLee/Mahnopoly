import Image from "next/image";

export const metadata = {
  title: "About | Mahnopoly",
  description:
    "For more than 15 years, Mahnopoly has been part of the Kansas community, buying, building, and managing residential properties across the state.",
};

// Contained, full photo visible, no crop/border — genuine 3:1 photo
// (1920x640), shown at natural aspect ratio. Real copy from William as
// of 25 Aug 2026 — no longer placeholder.
export default function AboutPage() {
  return (
    <>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 2rem 0", lineHeight: 0 }}>
        <Image
          src="/about-photo.png"
          alt="A craftsman-style home's front porch at golden hour, with a row of homes and tree-lined sidewalk along a Topeka, Kansas neighborhood street."
          width={1920}
          height={640}
          style={{ width: "100%", height: "auto", display: "block" }}
          sizes="(max-width: 900px) 100vw, 900px"
          priority
        />
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 2rem 3rem" }}>
        <h1 style={{ marginBottom: "1.5rem" }}>About Mahnopoly</h1>

        <div style={{ color: "#6b7280" }}>
          <p>
            For more than 15 years, Mahnopoly has been part of the Kansas
            community, investing in homes, properties, and the
            neighborhoods around them. Through buying, building, and
            managing residential properties, our goal is simple: create
            and maintain quality places that people are proud to call
            home.
          </p>
          <p>
            We believe good property ownership is about more than
            buildings. It&apos;s about taking care of the places we
            invest in, treating people with respect, and contributing to
            stronger communities for the long term. As a locally focused
            company, Mahnopoly takes a hands-on approach and values
            straightforward communication, dependable service, and doing
            things the right way.
          </p>
          <p>
            Whether we&apos;re improving an existing property, building
            something new, or caring for one of our rental homes, we
            want every Mahnopoly property to reflect the same commitment
            to quality, responsibility, and the communities we serve.
          </p>
        </div>

        <p
          style={{
            fontWeight: 700,
            color: "var(--ink)",
            textAlign: "center",
            margin: "2rem 0 0",
          }}
        >
          Local roots. Quality homes. Stronger communities.
        </p>
      </div>
    </>
  );
}
