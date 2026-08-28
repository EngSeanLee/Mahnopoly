"use server";

import { getSupabasePublicClient } from "@/lib/supabase/public";
import { notifyOfficeOfInquiry } from "@/lib/notify";
import type { InquiryResult } from "@/app/(site)/listings/[id]/actions";
import {
  consumeLocalInquiryLimit,
  inquiryRateLimitError,
  inquiryRequestKey,
  validateInquiryForm,
} from "@/lib/inquiry-protection";

// General "Send a note" inquiry from /contact — not tied to a specific
// listing (listing_id is nullable in supabase/schema.sql for exactly
// this case). Whatever the visitor typed into "Which property?" gets
// folded into the saved message so staff still see it in /admin, and
// into the office notification email's subject line.
export async function submitGeneralInquiry(formData: FormData): Promise<InquiryResult> {
  const validated = validateInquiryForm(formData);
  if (!validated.ok) {
    return validated.bot
      ? { ok: true, emailed: false }
      : { ok: false, error: validated.error };
  }
  const { name, email, phone, property, message: messageBody } = validated.fields;

  const requestKey = await inquiryRequestKey();
  if (!consumeLocalInquiryLimit(requestKey)) {
    return { ok: false, error: inquiryRateLimitError() };
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

  const { error: insertError } = await supabase.rpc("submit_inquiry", {
    p_listing_id: null,
    p_name: name,
    p_email: email,
    p_phone: phone,
    p_message: message,
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
