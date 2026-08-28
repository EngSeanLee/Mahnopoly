#!/usr/bin/env node
// Verifies the row-level security policies in supabase/schema.sql and
// supabase/storage.sql actually behave as intended, against the real
// Supabase project — not a re-statement of the policies, an actual test
// of them from the outside, using only the public key (same as any real
// site visitor would have).
//
// This is the repeatable check docs/plan.md's Definition of Done calls
// for: "Row-level security is verified: a logged-out or non-staff
// request cannot read or write admin-only data." Run it any time the
// schema changes, or just to confirm nothing regressed.
//
// Usage:
//   node --env-file=.env.local scripts/verify-rls.mjs
//
// Needs NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
// from .env.local — no service-role key, no admin login. That's the point.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.\n" +
      "Run with: node --env-file=.env.local scripts/verify-rls.mjs"
  );
  process.exit(1);
}

const headers = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };

let passed = 0;
let failed = 0;

async function check(label, fn) {
  try {
    await fn();
    console.log(`  ok  ${label}`);
    passed++;
  } catch (err) {
    console.log(`FAIL  ${label}`);
    console.log(`      ${err.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

console.log(`Checking RLS against ${url}\n`);

console.log("Public (anon) — should be ALLOWED:");
await check("read listings", async () => {
  const res = await fetch(`${url}/rest/v1/listings?select=id&limit=1`, { headers });
  assert(res.ok, `expected 2xx, got ${res.status}`);
});
await check("read settings", async () => {
  const res = await fetch(`${url}/rest/v1/settings?select=id&limit=1`, { headers });
  assert(res.ok, `expected 2xx, got ${res.status}`);
});
await check("submit an inquiry", async () => {
  const res = await fetch(`${url}/rest/v1/rpc/submit_inquiry`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      p_listing_id: null,
      p_name: "RLS verification script",
      p_email: `rls-check-${Date.now()}@example.com`,
      p_phone: "",
      p_message: "Automated check (scripts/verify-rls.mjs) — safe to ignore/delete.",
    }),
  });
  assert(res.ok, `expected 2xx, got ${res.status}: ${await res.text()}`);
});
await check("view property photos in storage", async () => {
  const res = await fetch(`${url}/storage/v1/object/list/property-photos`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ prefix: "", limit: 1 }),
  });
  assert(res.ok, `expected 2xx, got ${res.status}: ${await res.text()}`);
});

console.log("\nPublic (anon) — should be DENIED:");
await check("insert directly into inquiries", async () => {
  const res = await fetch(`${url}/rest/v1/inquiries`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: "Direct insert should fail",
      email: "direct-insert@example.com",
    }),
  });
  assert(!res.ok, `expected rejection, got ${res.status}`);
});
await check("read inquiries (other people's leads)", async () => {
  const res = await fetch(`${url}/rest/v1/inquiries?select=id&limit=1`, { headers });
  const body = await res.json();
  // RLS denial on SELECT surfaces as zero rows with a 200, not an error
  // status — PostgREST filters rows out rather than rejecting the query.
  assert(Array.isArray(body) && body.length === 0, `expected zero visible rows, got ${JSON.stringify(body)}`);
});
await check("write a listing", async () => {
  const res = await fetch(`${url}/rest/v1/listings`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      id: "rls-check-should-not-exist",
      address: "test",
      neighborhood: "test",
      type: "rental",
      status: "available",
      price: 1,
      beds: 1,
      baths: 1,
    }),
  });
  assert(!res.ok, `expected rejection, got ${res.status} (this listing may now need manual cleanup)`);
});
await check("edit settings", async () => {
  // Prefer: return=representation is required here — without it a denied
  // PATCH still comes back as 204 No Content, indistinguishable from a
  // successful update of zero rows vs one. With it, an empty array means
  // RLS actually blocked the write; a populated one means it didn't.
  const res = await fetch(`${url}/rest/v1/settings?id=eq.1`, {
    method: "PATCH",
    headers: { ...headers, Prefer: "return=representation" },
    body: JSON.stringify({ office_phone: "000-000-0000" }),
  });
  const body = await res.json().catch(() => null);
  assert(!res.ok || (Array.isArray(body) && body.length === 0), `expected no rows updated, got ${res.status}: ${JSON.stringify(body)}`);
});
await check("upload a property photo", async () => {
  const res = await fetch(`${url}/storage/v1/object/property-photos/rls-check.txt`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "text/plain" },
    body: "should be rejected",
  });
  assert(!res.ok, `expected rejection, got ${res.status}`);
});

console.log(`\n${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
