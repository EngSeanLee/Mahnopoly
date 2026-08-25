import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { getOwnerByAuthUser, getOwnerDocuments } from "@/lib/owners";
import { getListings, formatPrice, STATUS_LABEL } from "@/lib/listings";
import { getOwnerDocumentSignedUrl } from "@/lib/storage";

export default async function OwnerPortalPage() {
  const supabase = await getSupabaseAdminClient();
  if (!supabase) return null; // (protected)/layout.tsx already redirects if this happens

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null; // layout already redirects; satisfies TypeScript

  const owner = await getOwnerByAuthUser(supabase, user.id);
  if (!owner) return null; // layout already redirects

  const [allListings, documents] = await Promise.all([
    getListings(),
    getOwnerDocuments(supabase, owner.id),
  ]);
  const ownedListings = allListings.filter((l) => l.ownerId === owner.id);

  const documentsWithUrls = await Promise.all(
    documents.map(async (doc) => ({
      ...doc,
      url: await getOwnerDocumentSignedUrl(supabase, doc.storagePath),
    }))
  );

  return (
    <>
      <h3 style={{ marginBottom: "1rem" }}>Your properties</h3>
      {ownedListings.length === 0 ? (
        <p style={{ color: "#6b7280" }}>No properties on file yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Address</th>
              <th>Type</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {ownedListings.map((listing) => (
              <tr key={listing.id}>
                <td>{listing.address}</td>
                <td>{listing.type === "rental" ? "Rental" : "For sale"}</td>
                <td>{formatPrice(listing)}</td>
                <td>
                  <span className={`status-badge status-${listing.status}`}>
                    {STATUS_LABEL[listing.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3 style={{ margin: "2rem 0 1rem" }}>Your documents</h3>
      {documentsWithUrls.length === 0 ? (
        <p style={{ color: "#6b7280" }}>No documents uploaded yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {documentsWithUrls.map((doc) => (
            <li key={doc.id} style={{ padding: "0.4rem 0", borderBottom: "1px solid var(--border)" }}>
              {doc.url ? (
                <a href={doc.url}>{doc.fileName}</a>
              ) : (
                <span style={{ color: "#6b7280" }}>{doc.fileName} (unavailable right now)</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
