import { notFound } from "next/navigation";
import Link from "next/link";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { getOwner, getOwnerDocuments } from "@/lib/owners";
import { getListings, formatPrice } from "@/lib/listings";
import DocumentUpload from "@/components/admin/DocumentUpload";
import OwnerRowActions from "@/components/admin/OwnerRowActions";

export default async function OwnerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await getSupabaseAdminClient();
  if (!supabase) notFound();

  const owner = await getOwner(supabase, id);
  if (!owner) notFound();

  const [documents, allListings] = await Promise.all([
    getOwnerDocuments(supabase, id),
    getListings(),
  ]);
  const ownedListings = allListings.filter((l) => l.ownerId === id);

  return (
    <div className="add-property-panel open">
      <h3>{owner.name}</h3>
      <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
        {owner.email} &middot;{" "}
        {owner.hasLoggedIn ? "Logged in" : "Not yet invited or not yet accepted"}
      </p>
      <OwnerRowActions owner={owner} />

      <h3 style={{ margin: "2rem 0 1rem" }}>Properties</h3>
      {ownedListings.length === 0 ? (
        <p style={{ color: "#6b7280" }}>
          No properties assigned yet — assign this owner from a property&apos;s
          edit screen.
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {ownedListings.map((listing) => (
            <li key={listing.id} style={{ padding: "0.4rem 0", borderBottom: "1px solid var(--border)" }}>
              <Link href={`/admin/listings/${listing.id}/edit`}>{listing.address}</Link>{" "}
              &middot; {formatPrice(listing)}
            </li>
          ))}
        </ul>
      )}

      <h3 style={{ margin: "2rem 0 1rem" }}>Documents</h3>
      <DocumentUpload ownerId={id} documents={documents} />
    </div>
  );
}
