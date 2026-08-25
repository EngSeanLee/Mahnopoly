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
      {/* Photo sits outside .hero on purpose — .hero has its own cream
          background/padding (see globals.css), which was showing as a
          bare band of color around the image when nested inside it.
          Matches the about page's structure. Three separate wide photos
          stacked with no gap between them, each shown at its own natural
          aspect ratio — replaces the earlier single 3-panel collage
          graphic, higher resolution per panel this way. */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 2rem 0", lineHeight: 0 }}>
        <Image
          src="/home-banner-1.png"
          alt="A craftsman-style home's front porch at golden hour, in a Topeka, Kansas neighborhood."
          width={1920}
          height={417}
          style={{ width: "100%", height: "auto", display: "block" }}
          sizes="(max-width: 900px) 100vw, 900px"
          priority
        />
        <Image
          src="/home-banner-2.png"
          alt="The Topeka, Kansas skyline and surrounding neighborhoods at sunset, with the State Capitol dome visible."
          width={1920}
          height={480}
          style={{ width: "100%", height: "auto", display: "block" }}
          sizes="(max-width: 900px) 100vw, 900px"
          priority
        />
        <Image
          src="/home-banner-3.png"
          alt="A row of craftsman-style homes along a tree-lined street at golden hour."
          width={1920}
          height={480}
          style={{ width: "100%", height: "auto", display: "block" }}
          sizes="(max-width: 900px) 100vw, 900px"
          priority
        />
      </div>

      {/* Still .hero for its layout/type styles (.hero h1, .hero
          p.subhead in globals.css) — just the cream background overridden
          to plain white, which was the same leftover "placeholder" look
          the photo box had, just below it instead of around it. */}
      <section className="hero" style={{ background: "#fff" }}>
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
