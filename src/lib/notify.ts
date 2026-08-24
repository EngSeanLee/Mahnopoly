import { Resend } from "resend";

// Best-effort email notification. Per docs/plan.md the lead must already be
// saved to the database before this is called — a failed email here should
// never lose an inquiry, so this always returns rather than throwing.
export async function notifyOfficeOfInquiry(details: {
  listingAddress: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}): Promise<{ sent: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  const officeEmail = process.env.OFFICE_NOTIFICATION_EMAIL;
  if (!apiKey || !officeEmail) {
    console.warn(
      "notifyOfficeOfInquiry: RESEND_API_KEY or OFFICE_NOTIFICATION_EMAIL not set — skipping email, lead was still saved."
    );
    return { sent: false };
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "Mahnopoly Website <onboarding@resend.dev>",
      to: officeEmail,
      subject: `New inquiry: ${details.listingAddress}`,
      text: [
        `Listing: ${details.listingAddress}`,
        `Name: ${details.name}`,
        `Email: ${details.email}`,
        `Phone: ${details.phone}`,
        "",
        details.message,
      ].join("\n"),
    });
    return { sent: true };
  } catch (err) {
    console.error("notifyOfficeOfInquiry: send failed", err);
    return { sent: false };
  }
}
