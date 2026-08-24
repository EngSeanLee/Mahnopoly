"use server";

import { getSupabasePublicClient } from "@/lib/supabase/public";
import { notifyOfficeOfInquiry } from "@/lib/notify";

export type InquiryResult =
  | { ok: true; emailed: boolean }
  | { ok: false; error: string };

// Order matters here per docs/plan.md: save the lead first, email second.
// A Resend outage must never lose an inquiry.
export async function submitInquiry(
  listingId: string,
  listingAddress: string,
  formData: FormData
): Promise<InquiryResult> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email) {
    return { ok: false, error: "Name and email are required." };
  }

  const supabase = getSupabasePublicClient();
  if (!supabase) {
    // No Supabase project wired up yet — this is expected until the
    // account from docs/plan.md exists. Fail loudly in dev rather than
    // pretending the lead was saved.
    console.warn(
      "submitInquiry: Supabase not configured — inquiry was NOT saved.",
      { listingId, name, email }
    );
    return {
      ok: false,
      error:
        "This form isn't connected to a database yet (site is still in development).",
    };
  }

  const { error: insertError } = await supabase.from("inquiries").insert({
    listing_id: listingId,
    name,
    email,
    phone,
    message,
  });

  if (insertError) {
    console.error("submitInquiry: insert failed", insertError);
    return { ok: false, error: "Something went wrong saving your message. Please call the office instead." };
  }

  const { sent } = await notifyOfficeOfInquiry({
    listingAddress,
    name,
    email,
    phone,
    message,
  });

  return { ok: true, emailed: sent };
}
