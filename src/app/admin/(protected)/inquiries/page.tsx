import Link from "next/link";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { getListings } from "@/lib/listings";

interface InquiryRow {
  id: string;
  listing_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  created_at: string;
}

// Card list rather than a table — see the .inquiry-card comment in
// globals.css for why. Each card also resolves listing_id to a real
// address (falling back to the raw id if the listing's since been
// deleted) and makes phone/email tappable, which the old table didn't.
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

  const listings = await getListings();
  const addressById = new Map(listings.map((l) => [l.id, l.address]));

  if (inquiries.length === 0) {
    return <p style={{ color: "#6b7280" }}>No inquiries yet.</p>;
  }

  return (
    <div className="inquiry-list">
      {inquiries.map((inquiry) => {
        const address = inquiry.listing_id ? addressById.get(inquiry.listing_id) : null;
        const telHref = inquiry.phone ? `tel:${inquiry.phone.replace(/[^\d+]/g, "")}` : null;
        return (
          <div className="inquiry-card" key={inquiry.id}>
            <div className="inquiry-top">
              <span className="inquiry-when">
                {new Date(inquiry.created_at).toLocaleString()}
              </span>
              <span className="inquiry-property">
                {inquiry.listing_id ? (
                  address ? (
                    <Link href={`/admin/listings/${inquiry.listing_id}/edit`}>{address}</Link>
                  ) : (
                    `${inquiry.listing_id} (listing removed)`
                  )
                ) : (
                  "General inquiry"
                )}
              </span>
            </div>
            <div className="inquiry-who">
              <span>{inquiry.name}</span>
              <a href={`mailto:${inquiry.email}`}>{inquiry.email}</a>
              {telHref && <a href={telHref}>{inquiry.phone}</a>}
            </div>
            <div className={`inquiry-message${inquiry.message ? "" : " empty"}`}>
              {inquiry.message || "No message included."}
            </div>
          </div>
        );
      })}
    </div>
  );
}
