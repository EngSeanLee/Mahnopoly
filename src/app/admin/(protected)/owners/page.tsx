import Link from "next/link";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { getOwners } from "@/lib/owners";
import OwnerForm from "@/components/admin/OwnerForm";
import OwnerRowActions from "@/components/admin/OwnerRowActions";

export default async function OwnersPage() {
  const supabase = await getSupabaseAdminClient();
  const owners = supabase ? await getOwners(supabase) : [];

  return (
    <>
      <h3 style={{ marginBottom: "1rem" }}>Add an Owner</h3>
      <OwnerForm />

      <h3 style={{ margin: "2rem 0 1rem" }}>Owners</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Portal access</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {owners.map((owner) => (
            <tr key={owner.id}>
              <td>
                <Link href={`/admin/owners/${owner.id}`}>{owner.name}</Link>
              </td>
              <td>{owner.email}</td>
              <td>{owner.hasLoggedIn ? "Logged in" : "Not yet invited or not yet accepted"}</td>
              <td className="edit-cell" style={{ display: "flex", justifyContent: "flex-end" }}>
                <OwnerRowActions owner={owner} />
              </td>
            </tr>
          ))}
          {owners.length === 0 && (
            <tr>
              <td colSpan={4} style={{ color: "#6b7280", padding: "1.5rem 0.5rem" }}>
                No owners yet — add the first one above.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
