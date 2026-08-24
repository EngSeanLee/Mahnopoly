import { describe, it, expect, vi, beforeEach } from "vitest";

// Regression test for the exact bug caught by hand this project: the
// Resend SDK resolves normally with `{ data: null, error: {...} }` for
// API-level rejections (unverified domain, invalid sender, restricted
// recipient) — it does NOT throw for those. A version of notify.ts that
// only wrapped the call in try/catch reported success regardless. This
// mocks the `resend` package itself (not notify.ts) so it exercises the
// real code path that had the bug.
// vi.mock is hoisted above top-level const declarations, so the mock's
// `send` fn has to be created via vi.hoisted() rather than a plain
// `const` — referencing an outer const directly here silently captures
// an uninitialized binding.
const { send } = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock("resend", () => ({
  // `new Resend(...)` requires a real constructor — an arrow function
  // can't be `new`-ed, which is a separate hoisting-adjacent gotcha from
  // the one above.
  Resend: vi.fn().mockImplementation(function MockResend() {
    return { emails: { send } };
  }),
}));

import { notifyOfficeOfInquiry } from "./notify";

const details = {
  listingAddress: "1412 SW Clay St",
  name: "Jane Renter",
  email: "jane@example.com",
  phone: "555-1234",
  message: "Is this still available?",
};

beforeEach(() => {
  vi.clearAllMocks();
  process.env.RESEND_API_KEY = "re_test_key";
  process.env.OFFICE_NOTIFICATION_EMAIL = "office@example.com";
});

describe("notifyOfficeOfInquiry", () => {
  it("reports sent:false without env vars configured, and never calls Resend", async () => {
    delete process.env.RESEND_API_KEY;

    const result = await notifyOfficeOfInquiry(details);

    expect(result).toEqual({ sent: false });
    expect(send).not.toHaveBeenCalled();
  });

  it("reports sent:true when Resend accepts the send", async () => {
    send.mockResolvedValue({ data: { id: "msg_123" }, error: null });

    const result = await notifyOfficeOfInquiry(details);

    expect(result).toEqual({ sent: true });
  });

  // The actual regression: Resend rejects via a resolved `error` field,
  // not a thrown exception (e.g. sandbox mode's 403 "you can only send
  // to your own address").
  it("reports sent:false when Resend resolves with an error field (no throw)", async () => {
    send.mockResolvedValue({
      data: null,
      error: { statusCode: 403, name: "validation_error", message: "restricted recipient" },
    });

    const result = await notifyOfficeOfInquiry(details);

    expect(result).toEqual({ sent: false });
  });

  it("still reports sent:false, not a thrown error, on an actual network failure", async () => {
    send.mockRejectedValue(new Error("network down"));

    const result = await notifyOfficeOfInquiry(details);

    expect(result).toEqual({ sent: false });
  });
});
