import Link from "next/link";
import { getListings } from "@/lib/listings";
import ListingCard from "@/components/ListingCard";

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab = tab === "sale" ? "sale" : "rent";
  const type = activeTab === "rent" ? "rental" : "sale";

  const listings = await getListings();
  const items = listings.filter((l) => l.type === type && l.status !== "rented");

  return (
    <>
      <div className="tabs">
        <Link
          className={`tab${activeTab === "rent" ? " active" : ""}`}
          href="/listings?tab=rent"
        >
          For Rent
        </Link>
        <Link
          className={`tab${activeTab === "sale" ? " active" : ""}`}
          href="/listings?tab=sale"
        >
          For Sale
        </Link>
      </div>
      <div className="listing-grid">
        {items.length ? (
          items.map((listing) => <ListingCard key={listing.id} listing={listing} />)
        ) : (
          <p style={{ color: "#6b7280" }}>
            Nothing listed here right now — check back soon.
          </p>
        )}
      </div>
    </>
  );
}
