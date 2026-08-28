import { describe, expect, it } from "vitest";
import { validateInquiryForm } from "./inquiry-protection";

function form(fields: Record<string, string>, now: number): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  data.set("formStartedAt", String(now - 5000));
  return data;
}

describe("validateInquiryForm", () => {
  const now = 2_000_000;

  it("normalizes valid contact fields", () => {
    const result = validateInquiryForm(
      form({ name: " Jane ", email: "JANE@EXAMPLE.COM", message: " Hello " }, now),
      now
    );
    expect(result).toEqual({
      ok: true,
      fields: {
        name: "Jane",
        email: "jane@example.com",
        phone: "",
        property: "",
        message: "Hello",
      },
    });
  });

  it("rejects invalid email and oversized input", () => {
    expect(
      validateInquiryForm(form({ name: "Jane", email: "not-an-email" }, now), now)
    ).toEqual({ ok: false, error: "Enter a valid email address." });

    expect(
      validateInquiryForm(
        form({ name: "Jane", email: "jane@example.com", message: "x".repeat(4001) }, now),
        now
      )
    ).toEqual({ ok: false, error: "One or more fields are too long." });
  });

  it("silently traps honeypot and impossibly fast submissions", () => {
    const honeypot = form(
      { name: "Bot", email: "bot@example.com", website: "https://spam.example" },
      now
    );
    expect(validateInquiryForm(honeypot, now)).toEqual({ ok: false, error: "", bot: true });

    const tooFast = form({ name: "Bot", email: "bot@example.com" }, now);
    tooFast.set("formStartedAt", String(now - 100));
    expect(validateInquiryForm(tooFast, now)).toEqual({ ok: false, error: "", bot: true });
  });
});
