# Mahnopoly — the real website

This is William's live property website — a Next.js app that shows rental
and for-sale listings and lets visitors send an inquiry on any property.
It replaces the clickable draft in `mockup-review/` (kept there for
reference) once this build is finished and approved.

## Live URLs

- **What William reviews today:** https://mahnopoly.vercel.app — the
  static clickable mockup (`mockup-review/`), not the real build below.
- **The real build, in progress:** https://mahnopoly-preview.vercel.app
  — a stable alias (doesn't change on redeploy — re-run
  `vercel alias set <new-deployment-url> mahnopoly-preview.vercel.app`
  after future deploys to keep it current). No login required; Vercel
  deployment protection is deliberately off for this project right now.

**Status: in progress.** The public pages (home, listings, a property page,
and the inquiry form) work end to end against a real Supabase project and
Resend, reading real listing and settings data from the database. The
staff admin panel (`/admin`) is built and verified against a real login —
add/edit/delete listings, view inquiries, edit settings all confirmed
working. The owner portal, per-owner documents, the Zillow feed, and the
new pages below are built and pass `npm test` / `npm run build`, but have
**not** been run against the live Supabase project yet — several database
migrations need to run first (see "Database migrations" below) before any
of it works outside local dev's fallback data. See "What's left" for the
full list of what's still not done.

## What this is, in plain terms

A public website with:
- A home page and a listings page (rentals and for-sale, filterable),
  framed statewide (Kansas), with each listing's city bolded on its card.
- A page per property with photos-to-be and an inquiry form.
- `/about`, `/contact`, and `/epoxy` (shell, copy pending from William).
- A U-Haul link in the nav, and Pay Rent / Maintenance Request buttons on
  `/tenant-portal` — all three hidden until their URL is set in Settings.
- A `/zillow-feed.xml` feed of current rental listings, in the format
  Zillow's Rental Listing Bulk Feed Guide requires (see "The Zillow feed"
  below for what going live on Zillow additionally needs, outside this
  codebase).
- A staff-only admin panel (`/admin`, real login required) to add/edit/
  remove listings, manage owners, view inquiries, and edit the settings
  that control every link-out URL and office info — no code changes
  needed for any of that day to day.
- An owner portal (`/owner`, separate login from staff) where a property
  owner sees only their own properties and documents staff uploaded for
  them — see "The owner portal" below for the invite flow.

The full plan — scope, what's explicitly excluded, and why the pieces were
chosen — is in `docs/plan.md`.

## Running it locally

You need [Node.js](https://nodejs.org) 20 or newer.

```
npm install
npm run dev
```

Then open http://localhost:3000. No account or database is required to
browse the public pages locally — it falls back to placeholder data if
`.env.local` isn't set up. The admin panel needs real Supabase credentials
either way (see "Environment variables").

## Running tests

```
npm test
```

Runs the inquiry-flow logic tests (mocked Supabase/Resend, no real
project needed). Separately, `npm run test:rls` checks row-level security
against the *real* Supabase project using only the public key — needs
`.env.local` filled in, and leaves one harmless test inquiry behind each
run (visible in `/admin`, clearly labeled).

## Deploying

Deploys are **manual only**, on purpose: `vercel deploy` for a preview,
`vercel deploy --prod` for production, run from this folder.

This project's GitHub repo was connected to Vercel's auto-deploy-on-push
integration — silently, from before this build even started, and nobody
building this caught it until a `git push` shipped a broken build straight
to `mahnopoly.vercel.app`, the URL William was reviewing. It's been
explicitly disconnected (`vercel git disconnect`) so that can't happen
again unnoticed. If auto-deploy is ever wanted back (e.g., once the real
build is ready to become production), reconnect it deliberately — don't
assume it's already off.

**Why preview deployments 404'd for a while:** this Vercel project was
originally created for the static HTML mockup, and its framework setting
was left as `null` ("Other"). Every deploy still ran `next build`
successfully and the build logs looked completely clean, but Vercel
didn't know to read the output as Next.js — so it never registered the
actual page routes as functions, only picking up `middleware.ts` (or
nothing) as a build artifact. Every real page 404'd at Vercel's edge,
before the request ever reached application code — nothing in the app
itself was broken. Fixed by adding `vercel.json` with
`"framework": "nextjs"` at the repo root, so this can't silently drift
back even if the dashboard setting does. If a deployment ever again
serves only `middleware` (or nothing) in `vercel inspect <url>`'s Builds
list, check this first.

**Deployment protection is currently off** for this project (Vercel
Authentication/SSO disabled) — a deliberate choice after it caused
confusing, hard-to-diagnose errors (an SSO redirect-handshake failure
that looked like a generic 404) on top of the framework-detection bug
above. Anyone with a deployment URL can view it, including previews.
Nothing sensitive is exposed by that on its own — the admin panel still
requires a real Supabase Auth login regardless — but revisit this before
launch if it matters for other reasons.

## Database migrations

`supabase/schema.sql`, `supabase/storage.sql`, and `supabase/owner-storage.sql`
describe the *current* schema — what a brand-new Supabase project should
run once, in that order, to match. The live project already has an older
version of `schema.sql` applied, so it instead needs the numbered files in
`supabase/migrations/`, run in the Supabase SQL editor **in order**:

1. `001_add_city.sql`
2. `002_settings_pay_rent_and_uhaul.sql`
3. `003_staff_table_and_rls_fix.sql` — **read the comment at the top of
   this file before running it.** It requires inserting the real staff
   login email into the new `staff` table as part of the same run, or the
   admin panel locks everyone out, including the real staff account.
4. `004_owner_portal.sql`, then `supabase/owner-storage.sql` (not a
   numbered migration — same one-time-after-004 relationship
   `storage.sql` already has with the original schema)
5. `005_add_zip.sql`

None of this has been run against the live project yet — until it is, the
site keeps working off its fallback placeholder data (by design, same
safety net that's always covered a misconfigured or unreachable database),
which is what `npm run build`'s `getListings`/`getSettings` "query failed,
using fallback" log lines mean if you see them.

## Environment variables

Copy `.env.example` to `.env.local` and fill in real values — see that
file for what each one is and where to get it. Never commit `.env.local`;
it's gitignored on purpose. Preview deployments need the same variables
set in Vercel too (`vercel env add <NAME> preview`) — they don't inherit
`.env.local`.

**New since the last update:** `SUPABASE_SECRET_KEY` (the service-role
key) is now required for the owner portal's invite-by-email flow
(`src/lib/owners.ts`). It bypasses row-level security entirely and is used
server-side only — never commit it, never prefix it `NEXT_PUBLIC_`. Add it
to `.env.local` and to Vercel (`vercel env add SUPABASE_SECRET_KEY`)
before inviting any owners.

## The owner portal

A property owner logs in separately from staff, at `/owner/login`, and
sees only their own properties and any documents staff uploaded for them
— never another owner's, and never staff-only data (inquiries, settings).
That separation is enforced by row-level security, not just by which
pages exist — see `supabase/schema.sql`'s comments on the `staff` and
`owners` tables if changing any of this.

To add an owner: staff go to `/admin/owners`, add their name and email,
then click "Send invite." That calls Supabase's invite-by-email API,
which emails the owner a link to `/owner/set-password`; setting a
password there logs them straight into `/owner`, and the first visit
there is also what links their new login back to the owner record staff
created (see `claimOwnerRow` in `src/lib/owners.ts` for why that can't
happen any earlier). **Not yet tested end to end with a real invite
email** — the request side works against the real project, but nobody's
actually clicked a real invite link through this flow yet. Do that before
telling William it works, the same caution already noted below for the
staff password-reset email.

## The Zillow feed

`/zillow-feed.xml` generates a live feed of current rental listings in
the format Zillow's own Rental Listing Bulk Feed Guide requires (field
names and rules were read directly from that guide while building this,
not from memory — it's the kind of spec that drifts). Building the feed
file is only step one, though: Zillow doesn't discover it on its own.
Outside this codebase, someone needs to email rentalfeeds@zillow.com to
request approval and test-environment setup, watch the test listings
publish correctly, then have a go-live meeting — all on Zillow's
timeline, not ours. Worth knowing before committing to that process: the
feed guide itself says a landlord with a small number of properties
should consider entering listings directly into Zillow Rental Manager
instead of building and maintaining a feed — that may end up being less
total effort than the feed-approval process, and is a fallback worth
remembering if the approval process drags.

A listing needs a ZIP code to appear in the feed (required by Zillow,
previously not even stored in this app's database at all — see the "ZIP
code" field on the listing-edit form). One's missing, it's silently
skipped from the feed (and logged), not sent with bad data.

## Who hosts it, and what it costs

- **Hosting:** Vercel. Which tier (and the exact monthly cost) is still an
  open question — see "Open questions" in `docs/plan.md`. Currently
  deployed under a temporary account during development; ownership moves
  to William's own account before launch (billing and control should sit
  with him, not the developer).
- **Domain:** not secured yet. `mahnopoly.com` is owned by someone else
  (a parked/for-sale page, not William) — see the project conversation
  log for the alternatives checked and their prices (~$11-14/yr).
- **Database (Supabase) and email (Resend):** free tier is expected to
  cover a site this size; confirm once real usage is known.

## What's left before this can go live

1. ~~Supabase project created, schema applied, `.env.local` filled in~~ —
   done. ~~Resend wired in~~ — done; currently sends from Resend's shared
   sandbox address (`onboarding@resend.dev`) to a placeholder inbox
   (`leeaisolutions@gmail.com`), which only works because Resend's sandbox
   mode restricts sending to the account's own address until a domain is
   verified. Switching `OFFICE_NOTIFICATION_EMAIL` to the real office
   inbox and verifying a real domain in Resend (so mail sends from
   something like `inquiries@mahnopoly...com` instead) is a tracked
   action item, not forgotten.
2. ~~Staff admin panel~~ — built and verified (`/admin`): listings CRUD,
   inquiries view, settings editor, real Supabase Auth login. ~~Photo
   upload~~ — done: real file upload to Supabase Storage (bucket +
   staff-only write RLS in `supabase/storage.sql`), with reordering and
   remove, replacing the old pasted-URL placeholder. Verified end to end
   — a staff-uploaded photo renders on the public listing/property pages,
   and a logged-out write attempt is confirmed rejected by RLS (403).
3. ~~Switch `src/lib/listings.ts` to read from the `listings` table~~ —
   done, along with `src/lib/settings.ts` for the tenant portal
   link/office info. Added all 6 real listings findable on William's
   Facebook business page (real addresses, real photos), alongside the
   4 remaining placeholder ones from `supabase/seed.sql`. Most
   beds/baths/price are estimated, not pulled from an MLS — flagged as
   such in each listing's description; 4820 NW Redwood Dr's specs
   ($425,000, 5bd/3.5ba) are real, copied directly from William's own
   post caption. Still need: William's confirmation of exact specs on
   the estimated ones, current availability on all of them, and any
   listings not on Facebook, before launch.
4. A domain, pointed at this deployment.
5. When the real build is ready to go live: promote a deployment to
   production (`vercel deploy --prod`), point the domain at it, and only
   then consider reconnecting GitHub auto-deploy if that's still wanted.
6. ~~Automated tests for the inquiry save-then-email path~~ — done
   (`npm test`): covers validation, the save-fails case, the
   email-fails-but-lead-still-saves case (the exact bug class caught by
   hand earlier — this is now a regression test, not just a memory), and
   save-before-email ordering. Also added `npm run test:rls` —
   `scripts/verify-rls.mjs`, a standalone script (no login, just the
   public key, same access a real visitor has) that checks the actual
   Supabase project: public can read listings/settings/photos and submit
   inquiries, and is denied reading other people's inquiries, writing
   listings, editing settings, or uploading photos. Satisfies
   `docs/plan.md`'s "Definition of done" RLS-verification item — rerun
   it any time the schema changes.
7. Appearance/UX pass: dedicated `/about` page (replaces the home page's
   old inline section — content still placeholder, needs William's bio
   and a real family photo), a real `/tenant-portal` "under construction"
   page (the home page's "Already a tenant" card now always shows,
   linking there until a real portal URL is set in Settings), icons on
   the home page's rent/buy/tenant cards, a "back to the website" link on
   the staff login page, and real office phone/address/hours (pulled
   from William's Facebook page and Google listing — verify he confirms
   these). Also added a self-serve "Forgot password?" flow
   (`/admin/forgot-password` → emailed link → `/admin/reset-password`)
   — the request side is verified working against the real project; the
   full email-click round trip still needs a live human test, since
   there's no inbox to check from here.
8. Found and fixed a real bug while doing the above: `(site)/layout.tsx`
   (Header/Footer, settings-driven) was capable of serving stale,
   build-time-frozen data on some pages even after staff saved new
   Settings — silently contradicting the "no code change or redeploy"
   requirement. Now forced dynamic so every page under it reads fresh
   data on every request; documented trade-off (gives up static-page
   caching) in that file, reasonable given this site's traffic.
9. Built against the newer `William MVP.md` scope (owner portal, Zillow
   feed, U-Haul link, epoxy page, statewide Kansas framing). All of it
   passes `npm test` and `npm run build`, but **none of it has run
   against the live Supabase project yet** — see "Database migrations"
   above; nothing in this item works in production until those run.
   - Statewide framing: "Topeka"-specific copy removed from the title,
     home page, and about page; listings now carry a real `city` field
     (bolded on cards), separate from the old free-text `neighborhood`.
   - Settings gained `payRentUrl` and `uhaulUrl`, distinct from the
     existing tenant portal/maintenance URLs — each link-out button now
     shows or hides independently based on whether its own URL is set.
   - New pages: `/contact` (dedicated, replacing the old `/#contact`
     anchor), `/epoxy` (shell, copy pending from William, same pattern
     as `/about`), and a U-Haul nav link (hidden until its URL is set —
     still needed from William, blocks nothing else).
   - **Fixed a real security gap** before building the owner portal on
     top of it: every staff-only RLS policy checked
     `auth.role() = 'authenticated'`, which means *any* logged-in user
     counted as staff. Harmless while staff were the only login this app
     had; would have given every owner full staff access the moment
     they could log in at all. Replaced with an explicit `staff`
     allowlist table everywhere that check appeared (listings, settings,
     inquiries, property-photo uploads) — see `003_staff_table_and_rls_fix.sql`.
     The admin panel's own layout and middleware got the equivalent fix
     (checking staff-table membership, not just "is logged in").
   - Owner portal: `owners`, `owner_documents` tables, a private
     `owner-documents` Storage bucket, an `/admin/owners` staff screen
     (add an owner, assign them to listings from the existing
     listing-edit form, upload documents, send their invite email), and
     `/owner` (separate login, view-only, an owner's own properties and
     documents only — enforced by RLS, not just page routing). **Not yet
     tested end to end with a real invite email** — see "The owner
     portal" above.
   - `/zillow-feed.xml`: a live-generated feed in Zillow's real,
     currently-documented format (fetched and read directly from
     Zillow's own guide while building this, not written from memory).
     Manually tested against real output, not just inspected — which is
     what caught a real bug: `new Date("Sept 1")` (parsing the existing
     free-text "available" field) silently invented a year (2001)
     instead of failing, which would have sent Zillow a wrong move-in
     date on every listing without a literal year in that field. Fixed
     to require a strict `YYYY-MM-DD` match and omit the tag otherwise
     (it's optional). See "The Zillow feed" above for what's still
     needed outside this codebase before any of this reaches Zillow.
   - Not done as part of this pass: `scripts/verify-rls.mjs` still only
     tests the anonymous/public case, not "an owner is logged in but
     tries to read staff-only data" — extending it needs a real test
     owner account against the live project, which needs the migrations
     above run first.

## If something breaks

- **Site is down:** check the deployment status at vercel.com (or ask
  whoever holds the Vercel account to check). Vercel's own status page is
  status.vercel.com.
- **Inquiry form errors or listings look wrong:** most likely the
  Supabase project's data or the `.env.local` / Vercel environment
  variables — check those before assuming the code is broken.
- **Production suddenly shows the wrong thing:** check whether GitHub
  auto-deploy got reconnected (`vercel git connect` was run) and a push
  landed on `main` — see "Deploying" above for why that's dangerous here.
- **Anything else:** this README plus `docs/plan.md` should be enough
  context for another developer to pick this up without the original
  author.
