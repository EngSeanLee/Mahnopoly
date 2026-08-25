# Mahnopoly — the real website

William's live property website — a Next.js app that shows rental and
for-sale listings, takes inquiries on any property, and gives office
staff a panel to manage all of it without a developer.

## Live

**https://mahnopolyllc.com** — the real site, live and serving real
listing data from the production database.

## What this is, in plain terms

A public website with:
- A home page and a listings page (rentals and for-sale, filterable),
  framed statewide (Kansas), with each listing's city bolded on its card.
- A page per property with photos and an inquiry form.
- `/about`, `/contact`, and `/epoxy` (real copy; a real photo for epoxy
  is still pending from William — placeholder holds its spot).
- A U-Haul link in the nav, and Pay Rent / Maintenance Request buttons on
  `/tenant-portal` — each hidden until its URL is set in Settings.
- A `/zillow-feed.xml` feed of current rental listings, in the format
  Zillow's Rental Listing Bulk Feed Guide requires (see "The Zillow
  feed" below for what's still needed outside this codebase).
- A staff-only admin panel (`/admin`, real login required) to add/edit/
  remove listings, view inquiries, and edit every link-out URL and
  office info — no code changes needed for any of that day to day.

The full plan — scope, what's explicitly excluded, and why the pieces
were chosen — is in `docs/plan.md`.

## Running it locally

You need [Node.js](https://nodejs.org) 20 or newer.

```
npm install
npm run dev
```

Then open http://localhost:3000. No account or database is required to
browse the public pages locally — it falls back to placeholder data if
`.env.local` isn't set up. The admin panel needs real Supabase
credentials either way (see "Environment variables").

## Running tests

```
npm test
```

Runs the inquiry-flow logic tests (mocked Supabase/Resend, no real
project needed). Separately, `npm run test:rls` checks row-level
security against the *real* Supabase project using only the public key
— needs `.env.local` filled in, and leaves one harmless test inquiry
behind each run (visible in `/admin`, clearly labeled).

## Deploying

Deploys are **manual only**, on purpose:

```
vercel deploy --prod --scope mahnopolyllc
```

run from this folder. GitHub auto-deploy is deliberately **not**
connected — an earlier version of this project had it silently wired up
and a `git push` once shipped a broken build straight to production
before anyone caught it. Don't reconnect it (`vercel git connect`)
without a good reason.

## Who hosts it, and what it costs

- **Domain:** `mahnopolyllc.com`, registered through GoDaddy, under
  William's account.
- **Email:** 2 mailboxes (`admin@`, `william@`) via GoDaddy's
  Microsoft 365 add-on, same account.
- **Hosting:** Vercel, Pro plan ($20/month base + $20/month per
  additional deploying team seat), under the `mahnopolyllc` Vercel
  Team — not a personal account.
- **Database:** Supabase, under a `MahnopolyLLC` organization tied to
  `admin@mahnopolyllc.com` — currently on the Free tier.
- **Transactional email:** Resend, verified for `mahnopolyllc.com`
  (`inquiries@mahnopolyllc.com` for inquiry notifications; Supabase's
  own auth emails — invites, password resets — also route through
  Resend's SMTP instead of Supabase's rate-limited default sender).

## Environment variables

Copy `.env.example` to `.env.local` and fill in real values — see that
file for what each one is and where to get it. Never commit
`.env.local`; it's gitignored on purpose. Production needs the same
variables set in Vercel too (`vercel env add <NAME> production --scope
mahnopolyllc`) — they don't inherit `.env.local`.

## Database migrations

`supabase/schema.sql` and `supabase/storage.sql` describe the *current*
schema — what a brand-new Supabase project should run once, in that
order, to match. The live project was built up incrementally instead,
via the numbered files in `supabase/migrations/`, kept here as the real
history of what ran against production, in order:

1. `001_add_city.sql` — adds the `city` column
2. `002_settings_pay_rent_and_uhaul.sql` — adds `pay_rent_url`/`uhaul_url`
3. `003_staff_table_and_rls_fix.sql` — adds the `staff` allowlist table;
   every staff-only RLS policy now checks membership here instead of
   just "is anyone logged in"
4. `004_owner_portal.sql` — added an owner portal (see below — this was
   later reversed)
5. `005_add_zip.sql` — adds the `zip` column, required by the Zillow feed
6. `006_remove_owner_portal.sql` — the owner portal in `004` was cut
   from scope (it was in the planning doc by mistake); this drops the
   `owners`/`owner_documents` tables, the `owner_id` column on listings,
   and the private `owner-documents` storage bucket. No real data was
   lost — no owner was ever created for actual business use, only test
   rows from building the feature.

All six have run against the live project. A fresh project should just
run `schema.sql` then `storage.sql` — those already reflect the
post-`006` state, not the intermediate owner-portal detour.

## The Zillow feed

`/zillow-feed.xml` generates a live feed of current rental listings in
the format Zillow's own Rental Listing Bulk Feed Guide requires (field
names and rules were read directly from that guide while building this,
not from memory — it's the kind of spec that drifts). Building the feed
file is only step one: Zillow doesn't discover it on its own. Someone
needs to email rentalfeeds@zillow.com to request approval and
test-environment setup, watch the test listings publish correctly, then
have a go-live meeting — all on Zillow's timeline, not ours. **Not yet
started.** Worth knowing before committing to that process: the feed
guide itself says a landlord with a small number of properties should
consider entering listings directly into Zillow Rental Manager instead
of building and maintaining a feed — that may end up being less total
effort than the feed-approval process, and is a fallback worth
remembering if approval drags.

A listing needs a ZIP code to appear in the feed. If one's missing,
it's silently skipped from the feed (and logged), not sent with bad
data.

## What's outstanding

- **Zillow feed submission** — not started; see above.
- **`scripts/verify-rls.mjs`** only tests the logged-out/public case, not
  a second authenticated-but-non-staff account. Low priority now that
  there's no owner portal creating that scenario, but worth keeping in
  mind if any other login type is ever added.
- **Listing content** — real specs/availability confirmation from
  William on the Facebook-sourced listings (several have estimated
  beds/baths/price, flagged in each listing's description) and any
  properties not on Facebook.
- **Epoxy page photo** — copy is real; William's supplying a stock photo
  to replace the placeholder.
- **GitHub repo ownership** — still under `EngSeanLee`'s personal
  account. "Source code transferred" is part of the MVP's definition of
  done; move it to an org under `admin@mahnopolyllc.com` (or add William
  as an owner) before this engagement formally closes.
- **Kansas tenant-fee law** — whether the platform fee can be passed to
  tenants needs verifying before William commits to Innago's tenant-paid
  pricing model. Doesn't block anything here; a Phase 2 question.

## If something breaks

- **Site is down:** check deployment status at vercel.com under the
  `mahnopolyllc` team, or status.vercel.com for a platform-wide issue.
- **Inquiry form errors, listings look wrong, or login doesn't work:**
  most likely the Supabase project's data or a Vercel/`.env.local`
  environment variable — check those before assuming the code is broken.
- **A whole section of the site 404s but the deployment shows "Ready":**
  happened once already — a *second* production deploy failed right
  after a good one and ended up holding the production alias anyway. A
  fresh `vercel deploy --prod --scope mahnopolyllc` fixes it; `vercel ls
  mahnopoly --scope mahnopolyllc` shows deployment history if it
  recurs.
- **Auth emails (invites, password resets) don't arrive, or a link says
  "invalid or expired":** check Supabase's Auth Logs
  (`/logs/auth-logs` in the dashboard) before assuming SMTP is broken —
  a stale/reused reset link produces exactly that error and is not a
  bug. Genuine SMTP misconfiguration shows up there as a distinct
  failure on `mail.send`.
- **Production suddenly shows the wrong thing:** check whether GitHub
  auto-deploy got reconnected (`vercel git connect` was run) and a push
  landed on `main` — see "Deploying" above for why that's dangerous here.
- **Anything else:** this README plus `docs/plan.md` should be enough
  context for another developer to pick this up without the original
  author.
