import { createHash } from "node:crypto";
import { headers } from "next/headers";

export const INQUIRY_LIMITS = {
  name: 100,
  email: 254,
  phone: 40,
  property: 160,
  message: 4000,
} as const;

export type ValidInquiryFields = {
  name: string;
  email: string;
  phone: string;
  property: string;
  message: string;
};

export type InquiryFormResult =
  | { ok: true; fields: ValidInquiryFields }
  | { ok: false; error: string; bot?: boolean };

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const localBuckets = new Map<string, { count: number; resetAt: number }>();

function text(formData: FormData, name: string): string {
  return String(formData.get(name) || "").trim();
}

export function validateInquiryForm(
  formData: FormData,
  now = Date.now()
): InquiryFormResult {
  const honeypot = text(formData, "website");
  const startedAt = Number(formData.get("formStartedAt"));

  // Humans never see or fill `website`, and cannot normally submit the form
  // less than 1.5 seconds after it renders. Return a success-shaped response
  // to honeypot bots so they do not learn how to tune around the trap.
  if (honeypot || !Number.isFinite(startedAt) || startedAt > now || now - startedAt < 1500) {
    return { ok: false, error: "", bot: true };
  }

  const fields: ValidInquiryFields = {
    name: text(formData, "name"),
    email: text(formData, "email").toLowerCase(),
    phone: text(formData, "phone"),
    property: text(formData, "property"),
    message: text(formData, "message"),
  };

  if (!fields.name || !fields.email) {
    return { ok: false, error: "Name and email are required." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    return { ok: false, error: "Enter a valid email address." };
  }

  for (const [key, limit] of Object.entries(INQUIRY_LIMITS) as Array<
    [keyof ValidInquiryFields, number]
  >) {
    if (fields[key].length > limit) {
      return { ok: false, error: "One or more fields are too long." };
    }
  }

  return { ok: true, fields };
}

export async function inquiryRequestKey(): Promise<string> {
  const requestHeaders = await headers();
  const forwarded = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = forwarded || requestHeaders.get("x-real-ip") || "unknown";
  return createHash("sha256").update(address).digest("hex");
}

export function consumeLocalInquiryLimit(key: string, now = Date.now()): boolean {
  for (const [bucketKey, bucket] of localBuckets) {
    if (bucket.resetAt <= now) localBuckets.delete(bucketKey);
  }

  const current = localBuckets.get(key);
  if (!current || current.resetAt <= now) {
    localBuckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (current.count >= MAX_REQUESTS_PER_WINDOW) return false;
  current.count += 1;
  return true;
}

export function inquiryRateLimitError(): string {
  return "Too many messages were sent from this connection. Please wait a few minutes or call the office.";
}
