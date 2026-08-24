import { describe, it, expect, vi, beforeEach } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { submitInquiry } from "./actions";

// Mocked at the module boundary rather than hitting real Supabase/Resend —
// this tests submitInquiry's own logic (validation, ordering, error
// handling), not the third-party services themselves.
vi.mock("@/lib/supabase/public", () => ({
  getSupabasePublicClient: vi.fn(),
}));
vi.mock("@/lib/notify", () => ({
  notifyOfficeOfInquiry: vi.fn(),
}));

import { getSupabasePublicClient } from "@/lib/supabase/public";
import { notifyOfficeOfInquiry } from "@/lib/notify";

const mockedGetClient = vi.mocked(getSupabasePublicClient);
const mockedNotify = vi.mocked(notifyOfficeOfInquiry);

function formData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) fd.set(key, value);
  return fd;
}

function fakeSupabase(insertResult: { error: unknown }) {
  const insert = vi.fn().mockResolvedValue(insertResult);
  const from = vi.fn().mockReturnValue({ insert });
  // submitInquiry only ever calls .from(...).insert(...) on this client —
  // the cast stands in for the rest of SupabaseClient's surface, which
  // nothing under test touches.
  return { client: { from } as unknown as SupabaseClient, insert, from };
}

const validFields = {
  name: "Jane Renter",
  email: "jane@example.com",
  phone: "555-1234",
  message: "Is this still available?",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("submitInquiry", () => {
  it("rejects missing name/email before touching Supabase or Resend", async () => {
    const result = await submitInquiry(
      "clay-st",
      "1412 SW Clay St",
      formData({ phone: "555-1234", message: "hi" })
    );

    expect(result).toEqual({ ok: false, error: "Name and email are required." });
    expect(mockedGetClient).not.toHaveBeenCalled();
    expect(mockedNotify).not.toHaveBeenCalled();
  });

  it("fails clearly when Supabase isn't configured, without pretending to save", async () => {
    mockedGetClient.mockReturnValue(null);

    const result = await submitInquiry("clay-st", "1412 SW Clay St", formData(validFields));

    expect(result.ok).toBe(false);
    expect(mockedNotify).not.toHaveBeenCalled();
  });

  it("returns a save error and never emails when the Supabase insert fails", async () => {
    const { client, insert } = fakeSupabase({ error: { message: "db down" } });
    mockedGetClient.mockReturnValue(client);

    const result = await submitInquiry("clay-st", "1412 SW Clay St", formData(validFields));

    expect(result.ok).toBe(false);
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({ listing_id: "clay-st", name: "Jane Renter", email: "jane@example.com" })
    );
    expect(mockedNotify).not.toHaveBeenCalled();
  });

  it("reports success with emailed:true when both the save and the email succeed", async () => {
    const { client } = fakeSupabase({ error: null });
    mockedGetClient.mockReturnValue(client);
    mockedNotify.mockResolvedValue({ sent: true });

    const result = await submitInquiry("clay-st", "1412 SW Clay St", formData(validFields));

    expect(result).toEqual({ ok: true, emailed: true });
  });

  // The specific case docs/plan.md's Definition of Done calls out by name:
  // a Resend outage must never lose the lead. This is the regression test
  // for the exact bug caught by hand earlier — Resend's SDK doesn't throw
  // on API-level rejections, so a version of this code that only checked
  // for a thrown error would report emailed:true here regardless.
  it("still saves the lead and reports ok:true when the email fails", async () => {
    const { client, insert } = fakeSupabase({ error: null });
    mockedGetClient.mockReturnValue(client);
    mockedNotify.mockResolvedValue({ sent: false });

    const result = await submitInquiry("clay-st", "1412 SW Clay St", formData(validFields));

    expect(insert).toHaveBeenCalled();
    expect(result).toEqual({ ok: true, emailed: false });
  });

  it("saves the lead before attempting to email it (ordering matters)", async () => {
    const callOrder: string[] = [];
    const { client } = fakeSupabase({ error: null });
    (client.from("inquiries").insert as ReturnType<typeof vi.fn>).mockImplementation(async () => {
      callOrder.push("insert");
      return { error: null };
    });
    mockedGetClient.mockReturnValue(client);
    mockedNotify.mockImplementation(async () => {
      callOrder.push("notify");
      return { sent: true };
    });

    await submitInquiry("clay-st", "1412 SW Clay St", formData(validFields));

    expect(callOrder).toEqual(["insert", "notify"]);
  });
});
