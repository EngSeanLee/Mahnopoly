"use server";

import { getSupabasePublicClient } from "@/lib/supabase/public";
import { notifyOfficeOfInquiry } from "@/lib/notify";
import { getListing } from "@/lib/listings";
import {
  consumeLocalInquiryLimit,
  inquiryRateLimitError,
  inquiryRequestKey,
  validateInquiryForm,
} from "@/lib/inquiry-protection";

export type InquiryResult =
  | { ok: true; emailed: boolean }
  | { ok: false; error: string };

// Order matters here per docs/plan.md: save the lead first, email second.
// A Resend outage must never lose an inquiry.
export async function submitInquiry(
  listingId: string,
  formData: FormData
): Promise<InquiryResult> {
  const validated = validateInquiryForm(formData);
  if (!validated.ok) {
    return validated.bot
      ? { ok: true, emailed: false }
      : { ok: false, error: validated.error };
  }
  const { name, email, phone, message } = validated.fields;

  const requestKey = await inquiryRequestKey();
  if (!consumeLocalInquiryLimit(requestKey)) {
    return { ok: false, error: inquiryRateLimitError() };
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

  // Derive the address from the database instead of trusting the bound value
  // supplied by a browser. Server Action arguments are untrusted input too.
  const listing = await getListing(listingId);
  if (!listing) {
    return { ok: false, error: "This listing is no longer available. Please call the office." };
  }

  const { error: insertError } = await supabase.rpc("submit_inquiry", {
    p_listing_id: listingId,
    p_name: name,
    p_email: email,
    p_phone: phone,
    p_message: message,
  });

  if (insertError) {
    console.error("submitInquiry: insert failed", insertError);
    return { ok: false, error: "Something went wrong saving your message. Please call the office instead." };
  }

  const { sent } = await notifyOfficeOfInquiry({
    listingAddress: listing.address,
    name,
    email,
    phone,
    message,
  });

  return { ok: true, emailed: sent };
}
