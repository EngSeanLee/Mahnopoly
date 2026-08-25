import Link from "next/link";
import { Listing, formatPrice } from "@/lib/listings";
import ListingPhoto from "./ListingPhoto";
import StatusBadge from "./StatusBadge";

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link className="listing-card" href={`/listings/${listing.id}`}>
      <ListingPhoto photos={listing.photos} />
      <div className="listing-body">
        <div className={`price ${listing.type === "sale" ? "for-sale" : ""}`}>
          {formatPrice(listing)}
        </div>
        <div className="meta">
          {listing.beds} bd &middot; {listing.baths} ba &middot;{" "}
          <strong>{listing.city}</strong>
          {listing.neighborhood ? ` (${listing.neighborhood})` : ""}
        </div>
        <StatusBadge status={listing.status} />
      </div>
    </Link>
  );
}
