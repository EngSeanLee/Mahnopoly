import Link from "next/link";
import { Listing, formatPrice } from "@/lib/listings";
import ListingPhoto from "./ListingPhoto";
import StatusBadge from "./StatusBadge";

export default function ListingCard({ listing }: { listing: Listing }) {
  const [amount, unit] = formatPrice(listing).split("/");

  return (
    <Link
      className={`listing-card${listing.status === "rented" || listing.status === "sold" ? " is-rented" : ""}`}
      href={`/listings/${listing.id}`}
    >
      <ListingPhoto photos={listing.photos} />
      <div className="listing-body">
        <div className="price-row">
          <div className="price">
            {amount}
            {unit && <span className="unit">/{unit}</span>}
          </div>
          <StatusBadge status={listing.status} />
        </div>
        <div className="addr">{listing.address}</div>
        <div className="meta">
          {listing.beds} bd &middot; {listing.baths} ba &middot;{" "}
          <strong>{listing.city}</strong>
          {listing.neighborhood ? ` (${listing.neighborhood})` : ""}
        </div>
      </div>
    </Link>
  );
}
