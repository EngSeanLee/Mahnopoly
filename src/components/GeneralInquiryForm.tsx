"use client";

import { useState, useTransition } from "react";
import { submitGeneralInquiry } from "@/app/(site)/contact/actions";

export default function GeneralInquiryForm({
  defaultProperty = "",
}: {
  defaultProperty?: string;
}) {
  const [formStartedAt] = useState(() => Date.now().toString());
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<
    { ok: true; emailed: boolean } | { ok: false; error: string } | null
  >(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await submitGeneralInquiry(formData);
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
        <label htmlFor="c-website">Website</label>
        <input id="c-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="formStartedAt" value={formStartedAt} />
      <div className="form-row">
        <label htmlFor="c-name">Your name</label>
        <input id="c-name" name="name" type="text" required maxLength={100} autoComplete="name" />
      </div>
      <div className="form-row">
        <label htmlFor="c-email">Email</label>
        <input id="c-email" name="email" type="email" required maxLength={254} autoComplete="email" />
      </div>
      <div className="form-row">
        <label htmlFor="c-phone">Phone (optional)</label>
        <input id="c-phone" name="phone" type="tel" maxLength={40} autoComplete="tel" />
      </div>
      <div className="form-row">
        <label htmlFor="c-property">Which property? (optional)</label>
        <input
          id="c-property"
          name="property"
          type="text"
          placeholder="Address, or leave blank"
          defaultValue={defaultProperty}
          maxLength={160}
        />
      </div>
      <div className="form-row">
        <label htmlFor="c-message">What can we help with?</label>
        <textarea id="c-message" name="message" rows={4} maxLength={4000} />
      </div>
      <button className="btn btn-red" type="submit" disabled={isPending}>
        {isPending ? "Sending…" : "Send it over"}
      </button>
      <p className="form-note">
        We&apos;ll never share your info. Response times vary by office hours.
      </p>
      {result && !result.ok && <div className="form-error" role="alert">{result.error}</div>}
    </form>
  );
}
