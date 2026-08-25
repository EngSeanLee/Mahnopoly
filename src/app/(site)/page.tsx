import Link from "next/link";
import { getListings } from "@/lib/listings";
import { getSettings } from "@/lib/settings";
import ListingCard from "@/components/ListingCard";
import PhotoPlaceholder from "@/components/PhotoPlaceholder";
import { KeyIcon, HomeIcon, UserIcon } from "@/components/Icons";

// This page stays statically generated (per docs/plan.md's "static
// generation for the marketing pages") rather than force-dynamic —
// freshness comes from on-demand revalidation instead: listing changes
// already call revalidatePath("/") (see admin/listings/actions.ts), and
// settings changes now call revalidatePath("/", "layout") (see
// admin/settings/actions.ts), so both stay current without redeploying
// and without giving up the caching/speed benefit of static rendering.
export default async function Home() {
  const [listings, settings] = await Promise.all([getListings(), getSettings()]);
  const featured = listings.filter((l) => l.status !== "rented").slice(0, 4);

  return (
    <>
      <section className="hero">
        <PhotoPlaceholder label="wide property photo" className="big" />
        <h1>Homes for sale and rent across Kansas</h1>
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
          <span className="icon"><KeyIcon /></span>
          <h3>Looking to rent</h3>
          <p>Browse what&apos;s open now</p>
        </Link>
        <Link className="path-card buy" href="/listings?tab=sale">
          <span className="icon"><HomeIcon /></span>
          <h3>Looking to buy</h3>
          <p>See what&apos;s on the market</p>
        </Link>
        <Link
          className="path-card tenant"
          href={settings.tenantPortalUrl || "/tenant-portal"}
        >
          <span className="icon"><UserIcon /></span>
          <h3>Already a tenant</h3>
          <p>
            {settings.tenantPortalUrl
              ? "Pay rent or submit a request"
              : "Tenant portal — coming soon"}
          </p>
        </Link>
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
    </>
  );
}
