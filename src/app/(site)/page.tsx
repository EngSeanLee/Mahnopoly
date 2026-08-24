import Link from "next/link";
import { getListings } from "@/lib/listings";
import { getSettings } from "@/lib/settings";
import ListingCard from "@/components/ListingCard";
import PhotoPlaceholder from "@/components/PhotoPlaceholder";

export default async function Home() {
  const [listings, settings] = await Promise.all([getListings(), getSettings()]);
  const featured = listings.filter((l) => l.status !== "rented").slice(0, 4);

  return (
    <>
      <section className="hero">
        <PhotoPlaceholder label="wide property photo" className="big" />
        <h1>Homes for sale and rent in Topeka</h1>
        <p className="subhead">
          Locally owned. Locally managed. Same folks on the sign in your
          neighbor&apos;s yard.
        </p>
        <Link className="btn btn-navy" href="/listings?tab=rent">
          See available properties
        </Link>
      </section>

      <div className="path-cards">
        <Link className="path-card rent" href="/listings?tab=rent">
          <span className="dot" />
          <h3>Looking to rent</h3>
          <p>Browse what&apos;s open now</p>
        </Link>
        <Link className="path-card buy" href="/listings?tab=sale">
          <span className="dot" />
          <h3>Looking to buy</h3>
          <p>See what&apos;s on the market</p>
        </Link>
        {settings.showTenantButtons && (
          <Link
            className="path-card tenant"
            href={settings.tenantPortalUrl || "/#contact"}
          >
            <span className="dot" />
            <h3>Already a tenant</h3>
            <p>
              {settings.tenantPortalUrl
                ? "Pay rent or submit a request"
                : "Get in touch with the office"}
            </p>
          </Link>
        )}
      </div>

      <div className="section-row">
        <h2>Available now</h2>
        <Link className="view-all" href="/listings?tab=rent">
          View all &rsaquo;
        </Link>
      </div>
      <div className="listing-grid">
        {featured.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      <section
        id="about"
        style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem 2.5rem" }}
      >
        <h2>About Mahnopoly</h2>
        <p style={{ color: "#6b7280", maxWidth: 700 }}>
          A short paragraph about William&apos;s background and how long the
          business has been managing and selling property in the Topeka area
          goes here — placeholder text until he sends over what he wants
          said.
        </p>
      </section>
    </>
  );
}
