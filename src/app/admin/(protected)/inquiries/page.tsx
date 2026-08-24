import { getSupabaseAdminClient } from "@/lib/supabase/server";

interface InquiryRow {
  id: string;
  listing_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  created_at: string;
}

export default async function InquiriesPage() {
  const supabase = await getSupabaseAdminClient();
  let inquiries: InquiryRow[] = [];
  let error: string | null = null;

  if (!supabase) {
    error = "Not connected to a database yet.";
  } else {
    const { data, error: queryError } = await supabase
      .from("inquiries")
      .select("id, listing_id, name, email, phone, message, created_at")
      .order("created_at", { ascending: false });
    if (queryError) {
      console.error("InquiriesPage: query failed", queryError);
      error = "Something went wrong loading inquiries.";
    } else {
      inquiries = data ?? [];
    }
  }

  if (error) return <p className="form-error">{error}</p>;

  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Received</th>
          <th>Property</th>
          <th>Name</th>
          <th>Contact</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        {inquiries.map((inquiry) => (
          <tr key={inquiry.id}>
            <td style={{ whiteSpace: "nowrap" }}>
              {new Date(inquiry.created_at).toLocaleString()}
            </td>
            <td>{inquiry.listing_id ?? "—"}</td>
            <td>{inquiry.name}</td>
            <td>
              {inquiry.email}
              {inquiry.phone ? ` · ${inquiry.phone}` : ""}
            </td>
            <td>{inquiry.message || "—"}</td>
          </tr>
        ))}
        {inquiries.length === 0 && (
          <tr>
            <td colSpan={5} style={{ color: "#6b7280", padding: "1.5rem 0.5rem" }}>
              No inquiries yet.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
