import Link from "next/link";
import { getListings, formatPrice, STATUS_LABEL } from "@/lib/listings";
import DeleteListingButton from "@/components/admin/DeleteListingButton";

export default async function AdminDashboardPage() {
  const listings = await getListings();
  const available = listings.filter((l) => l.status === "available").length;
  const rentals = listings.filter((l) => l.type === "rental").length;
  const forSale = listings.filter((l) => l.type === "sale").length;

  return (
    <>
      <div className="stat-row">
        <div className="stat-card">
          <div className="label">Rentals listed</div>
          <div className="value">{rentals}</div>
        </div>
        <div className="stat-card">
          <div className="label">Available</div>
          <div className="value green">{available}</div>
        </div>
        <div className="stat-card">
          <div className="label">For sale</div>
          <div className="value">{forSale}</div>
        </div>
      </div>

      <div className="admin-actions" style={{ marginBottom: "1rem" }}>
        <Link className="btn btn-navy" href="/admin/listings/new">
          + Add property
        </Link>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Address</th>
            <th>Type</th>
            <th>Price</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing) => (
            <tr key={listing.id}>
              <td>{listing.address}</td>
              <td>{listing.type === "rental" ? "Rental" : "For sale"}</td>
              <td>{formatPrice(listing)}</td>
              <td>
                <span className={`status-badge status-${listing.status}`}>
                  {STATUS_LABEL[listing.status]}
                </span>
              </td>
              <td className="edit-cell" style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                <Link href={`/admin/listings/${listing.id}/edit`}>Edit</Link>
                <DeleteListingButton listingId={listing.id} address={listing.address} />
              </td>
            </tr>
          ))}
          {listings.length === 0 && (
            <tr>
              <td colSpan={5} style={{ color: "#6b7280", padding: "1.5rem 0.5rem" }}>
                No properties yet — add the first one above.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
