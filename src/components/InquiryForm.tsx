"use client";

import { useState, useTransition } from "react";
import { submitInquiry } from "@/app/(site)/listings/[id]/actions";

export default function InquiryForm({
  listingId,
}: {
  listingId: string;
}) {
  const [formStartedAt] = useState(() => Date.now().toString());
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<
    { ok: true; emailed: boolean } | { ok: false; error: string } | null
  >(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await submitInquiry(listingId, formData);
      setResult(res);
    });
  }

  if (result?.ok) {
    return (
      <div className="form-success" role="status" aria-live="polite">
        Thanks — we&apos;ve got your message and will be in touch soon.
      </div>
    );
  }

  return (
    <form action={handleSubmit}>
      <div className="website-field" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="formStartedAt" value={formStartedAt} />
      <div className="form-row">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" required maxLength={100} autoComplete="name" />
      </div>
      <div className="form-row">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required maxLength={254} autoComplete="email" />
      </div>
      <div className="form-row">
        <label htmlFor="phone">Phone</label>
        <input id="phone" name="phone" type="tel" maxLength={40} autoComplete="tel" />
      </div>
      <div className="form-row">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows={4} maxLength={4000} />
      </div>
      <button className="btn btn-navy" type="submit" disabled={isPending}>
        {isPending ? "Sending…" : "Send inquiry"}
      </button>
      <p className="form-note">
        We&apos;ll never share your info. Response times vary by office hours.
      </p>
      {result && !result.ok && <div className="form-error" role="alert">{result.error}</div>}
    </form>
  );
}
