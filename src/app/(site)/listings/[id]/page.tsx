import { notFound } from "next/navigation";
import { getListing, formatPrice } from "@/lib/listings";
import ListingPhoto from "@/components/ListingPhoto";
import StatusBadge from "@/components/StatusBadge";
import InquiryForm from "@/components/InquiryForm";

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) notFound();

  return (
    <div className="property-wrap">
      <div className="gallery">
        <ListingPhoto photos={listing.photos} index={0} className="big" sizes="(max-width: 760px) 100vw, 66vw" />
        <div className="thumb-col">
          <ListingPhoto photos={listing.photos} index={1} sizes="33vw" />
          <ListingPhoto photos={listing.photos} index={2} sizes="33vw" />
        </div>
      </div>

      <div className="property-header">
        <div>
          <div className="addr">{listing.address}</div>
        </div>
        <div className={`price-big ${listing.type === "sale" ? "for-sale" : ""}`}>
          {formatPrice(listing)}
        </div>
      </div>

      <div className="property-facts">
        <span>
          <strong>{listing.beds}</strong> bed
        </span>
        <span>
          <strong>{listing.baths}</strong> bath
        </span>
        <span>
          City: <strong>{listing.city}</strong>
        </span>
        <span>
          Neighborhood: <strong>{listing.neighborhood}</strong>
        </span>
        <span>
          Pets: <strong>{listing.pets}</strong>
        </span>
        <span>
          Available: <strong>{listing.available}</strong>
        </span>
        <StatusBadge status={listing.status} />
      </div>

      <div className="detail-grid">
        <div>
          <p style={{ color: "#6b7280" }}>
            {listing.description ||
              "Full property description goes here once William provides it — square footage, features, and neighborhood notes."}
          </p>
        </div>
        <div className="inquiry-box">
          <h3>Interested in this property?</h3>
          <InquiryForm listingId={listing.id} />
        </div>
      </div>
    </div>
  );
}
