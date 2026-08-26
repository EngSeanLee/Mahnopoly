"use server";

import { getSupabasePublicClient } from "@/lib/supabase/public";
import { notifyOfficeOfInquiry } from "@/lib/notify";
import type { InquiryResult } from "@/app/(site)/listings/[id]/actions";

// General "Send a note" inquiry from /contact — not tied to a specific
// listing (listing_id is nullable in supabase/schema.sql for exactly
// this case). Whatever the visitor typed into "Which property?" gets
// folded into the saved message so staff still see it in /admin, and
// into the office notification email's subject line.
export async function submitGeneralInquiry(formData: FormData): Promise<InquiryResult> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const property = String(formData.get("property") || "").trim();
  const messageBody = String(formData.get("message") || "").trim();

  if (!name || !email) {
    return { ok: false, error: "Name and email are required." };
  }

  const message = property ? `Which property: ${property}\n\n${messageBody}` : messageBody;
  const subject = property || "General inquiry";

  const supabase = getSupabasePublicClient();
  if (!supabase) {
    console.warn("submitGeneralInquiry: Supabase not configured — inquiry was NOT saved.", { name, email });
    return {
      ok: false,
      error: "This form isn't connected to a database yet (site is still in development).",
    };
  }

  const { error: insertError } = await supabase.from("inquiries").insert({
    listing_id: null,
    name,
    email,
    phone,
    message,
  });

  if (insertError) {
    console.error("submitGeneralInquiry: insert failed", insertError);
    return { ok: false, error: "Something went wrong saving your message. Please call the office instead." };
  }

  const { sent } = await notifyOfficeOfInquiry({
    listingAddress: subject,
    name,
    email,
    phone,
    message,
  });

  return { ok: true, emailed: sent };
}
