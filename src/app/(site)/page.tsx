import Link from "next/link";
import Image from "next/image";
import { getListings } from "@/lib/listings";
import { getSettings } from "@/lib/settings";
import ListingCard from "@/components/ListingCard";
import PhotoHero from "@/components/PhotoHero";
import Ticker from "@/components/Ticker";

// This page stays statically generated (per docs/plan.md's "static
// generation for the marketing pages") rather than force-dynamic —
// freshness comes from on-demand revalidation instead: listing changes
// already call revalidatePath("/") (see admin/listings/actions.ts), and
// settings changes now call revalidatePath("/", "layout") (see
// admin/settings/actions.ts), so both stay current without redeploying
// and without giving up the caching/speed benefit of static rendering.
export default async function Home() {
  const [listings, settings] = await Promise.all([getListings(), getSettings()]);
  const featured = listings.filter((l) => l.status !== "rented").slice(0, 3);

  return (
    <>
      <PhotoHero photos={["/home-banner-1.png", "/home-banner-2.png", "/home-banner-3.png"]}>
        <h1 className="hero-title">
          The possibilities
          <br />
          <em>are endless.</em>
        </h1>
        <p className="hero-subhead">
          Homes to rent, homes to buy, and a whole street we built from
          dirt. All of it run out of one office in Topeka.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-cream" href="/listings?tab=rent">
            See what&apos;s open
          </Link>
          <Link className="link-mono" href="/mahtropolis">
            WALK THE PLAT →
          </Link>
        </div>
      </PhotoHero>

      <Ticker />

      <div className="path-cards">
        <Link className="path-card" href="/listings?tab=rent">
          <h3>Looking to rent</h3>
          <p>Homes open across Topeka and the towns around it.</p>
          <span className="go">GO →</span>
        </Link>
        <Link className="path-card" href="/listings?tab=sale">
          <h3>Looking to buy</h3>
          <p>Finished houses and platted lots at Mahtropolis.</p>
          <span className="go">GO →</span>
        </Link>
        <Link
          className="path-card"
          href={settings.tenantPortalUrl || "/tenant-portal"}
        >
          <h3>Already a tenant</h3>
          <p>
            {settings.tenantPortalUrl
              ? "Pay rent or send us a maintenance note."
              : "Tenant portal — coming soon."}
          </p>
          <span className="go">GO →</span>
        </Link>
      </div>

      <div className="section-row">
        <h2>Open right now</h2>
        <Link className="view-all" href="/listings?tab=rent">
          ALL {listings.length} LISTINGS →
        </Link>
      </div>
      <div className="listing-grid">
        {featured.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      <div style={{ padding: "20px 2.5rem 78px", background: "var(--cream)" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.35fr 1fr",
            gap: 26,
            alignItems: "stretch",
          }}
        >
          <Link
            href="/mahtropolis"
            style={{
              position: "relative",
              minHeight: 340,
              borderRadius: 5,
              overflow: "hidden",
              display: "block",
            }}
          >
            <Image
              src="/home-banner-3.png"
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 55vw"
              style={{ objectFit: "cover" }}
              priority={false}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(10,16,34,.86) 12%, rgba(10,16,34,0) 62%)",
              }}
            />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: 30 }}>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.62rem",
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  color: "var(--red-soft)",
                }}
              >
                MAHTROPOLIS &middot; COMPLETE
              </span>
              <div
                style={{
                  marginTop: 14,
                  fontFamily: "var(--font-serif)",
                  fontWeight: 400,
                  fontSize: "clamp(1.9rem, 4vw, 3.25rem)",
                  lineHeight: 1,
                  color: "#fff",
                }}
              >
                A little bigger
                <br />
                <em style={{ fontStyle: "italic", color: "var(--red-soft)" }}>than we let on.</em>
              </div>
              <div
                style={{
                  marginTop: 20,
                  display: "inline-flex",
                  gap: 10,
                  paddingBottom: 5,
                  borderBottom: "1px solid rgba(255,255,255,.45)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6rem",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  color: "#fff",
                }}
              >
                SEE THE PLAT<span style={{ color: "var(--red-soft)" }}>→</span>
              </div>
            </div>
          </Link>
          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            <div
              style={{
                position: "relative",
                height: 224,
                background: "var(--navy-deep)",
                overflow: "hidden",
                borderRadius: 5,
              }}
            >
              <Image
                src="/redesign/plat-map.webp"
                alt="Recorded plat, phase one — the proposed Mahnopoly Avenue subdivision."
                fill
                sizes="45vw"
                style={{
                  objectFit: "cover",
                  filter:
                    "invert(1) sepia(1) hue-rotate(185deg) saturate(3.2) brightness(.6) contrast(1.15)",
                  opacity: 0.88,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(16,26,52,.85) 20%, rgba(16,26,52,.15) 100%)",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  left: 18,
                  bottom: 16,
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.55rem",
                  lineHeight: 1.7,
                  letterSpacing: "0.14em",
                  color: "rgba(210,226,255,.85)",
                }}
              >
                RECORDED PLAT &middot; PHASE ONE
                <br />
                PROPOSED MAHNOPOLY AVENUE
              </span>
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: 34,
                padding: 26,
                border: "1px solid var(--border)",
                borderRadius: 5,
                background: "#fff",
              }}
            >
              <Stat value="184" label="Homes" />
              <Stat value="15+" label="Years" />
              <Stat value="9" label="Towns" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "2.5rem", lineHeight: 1, color: "var(--navy)" }}>
        {value}
      </div>
      <div
        style={{
          marginTop: 4,
          fontFamily: "var(--font-mono)",
          fontSize: "0.56rem",
          fontWeight: 500,
          letterSpacing: "0.14em",
          color: "var(--ink-50)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
}
