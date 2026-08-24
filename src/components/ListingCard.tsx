import Link from "next/link";
import { Listing, formatPrice } from "@/lib/listings";
import PhotoPlaceholder from "./PhotoPlaceholder";
import StatusBadge from "./StatusBadge";

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link className="listing-card" href={`/listings/${listing.id}`}>
      <PhotoPlaceholder />
      <div className="listing-body">
        <div className={`price ${listing.type === "sale" ? "for-sale" : ""}`}>
          {formatPrice(listing)}
        </div>
        <div className="meta">
          {listing.beds} bd &middot; {listing.baths} ba &middot; {listing.neighborhood}
        </div>
        <StatusBadge status={listing.status} />
      </div>
    </Link>
  );
}
