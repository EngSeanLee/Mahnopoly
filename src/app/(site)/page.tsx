import Image from "next/image";
import Link from "next/link";
import { getListings } from "@/lib/listings";
import { getSettings } from "@/lib/settings";
import ListingCard from "@/components/ListingCard";
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
        {/* Contained, full photo visible, no crop/border/full-bleed —
            pending a proper 3:1 banner photo (see globals.css note on
            .full-bleed for that future treatment). */}
        <div style={{ maxWidth: 900, margin: "0 auto 2rem", lineHeight: 0 }}>
          <Image
            src="/home-banner.png"
            alt="Mahnopoly LLC — buy, build, manage. A craftsman-style home's front porch at dusk, the Topeka skyline at sunset, and a row of new-construction homes."
            width={1536}
            height={1024}
            style={{ width: "100%", height: "auto", display: "block" }}
            sizes="(max-width: 900px) 100vw, 900px"
            priority
          />
        </div>
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
          <h3>Looking to Rent</h3>
          <p>Browse what&apos;s open now</p>
        </Link>
        <Link className="path-card buy" href="/listings?tab=sale">
          <span className="icon"><HomeIcon /></span>
          <h3>Looking to Buy</h3>
          <p>See what&apos;s on the market</p>
        </Link>
        <Link
          className="path-card tenant"
          href={settings.tenantPortalUrl || "/tenant-portal"}
        >
          <span className="icon"><UserIcon /></span>
          <h3>Already a Tenant</h3>
          <p>
            {settings.tenantPortalUrl
              ? "Pay rent or submit a request"
              : "Tenant portal — coming soon"}
          </p>
        </Link>
      </div>

      <div className="section-row">
        <h2>Available Now</h2>
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
