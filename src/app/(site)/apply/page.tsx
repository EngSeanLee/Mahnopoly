import Link from "next/link";
import { getSettings } from "@/lib/settings";

export const metadata = {
  title: "Apply to Rent | Mahnopoly",
  description:
    "Download Mahnopoly's rental application and return the completed form to the Topeka office.",
};

// This is the public document currently used by the live site. Keeping the
// URL in source makes the deployed Apply page reproducible from GitHub; it can
// be moved into editable site settings later if the office replaces forms
// frequently.
const RENTAL_APPLICATION_URL =
  "https://oezsdneecodrmaolyonn.supabase.co/storage/v1/object/public/documents/rental-application.pdf";

export default async function ApplyPage() {
  const settings = await getSettings();
  const telHref = `tel:${settings.officePhone.replace(/[^\d+]/g, "")}`;

  return (
    <div className="blueprint-grid apply-page">
      <div className="apply-card">
        <span className="eyebrow">RENTAL APPLICATION</span>
        <h1>Apply to Rent</h1>
        <p>
          Download the rental application, fill it out, and return it to our
          office. We&apos;ll follow up after we&apos;ve received it.
        </p>
        <a
          className="btn btn-red"
          href={RENTAL_APPLICATION_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Download Rental Application (PDF)
        </a>
        <div className="apply-contact">
          <span>Questions before you apply?</span>
          <a href={telHref}>{settings.officePhone}</a>
          <Link href="/contact">Send the office a note</Link>
        </div>
      </div>
    </div>
  );
}
