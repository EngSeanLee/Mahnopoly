# Mahnopoly — the real website

William's live property website — a Next.js app that shows rental and
for-sale listings, takes inquiries on any property, and gives office
staff a panel to manage all of it without a developer.

## Live

**https://mahnopolyllc.com** — the real site, live and serving real
listing data from the production database.

## What this is, in plain terms

A public website with:
- A home page and a listings page (rentals and for-sale, filterable,
  sortable by price or newest), framed statewide (Kansas), with each
  listing's city bolded on its card.
- A page per property with photos and an inquiry form.
- `/mahtropolis` — Mahnopoly's own 24-lot subdivision in Emporia, KS:
  the story, the recorded plat, and real photos of it under
  construction. New as of the 26 Aug 2026 redesign.
- `/about`, `/contact`, and `/epoxy` — all real copy and real photos
  now. `/contact` also has a general "Send a note" form (not tied to a
  specific listing) that reaches the office the same way a listing
  inquiry does.
- `/apply` — the live rental-application download and office handoff,
  now tracked in source instead of existing only in an unpushed deploy.
- `/epoxy` also has a "Recent Work" photo gallery, staff-uploadable
  through Settings — see "The epoxy photo gallery" below. Hidden
  entirely until at least one photo's been added.
- A U-Haul link in the nav, and Pay Rent / Maintenance Request buttons on
  `/tenant-portal` — each hidden until its URL is set in Settings. As of
  25 Aug 2026 the tenant portal, pay rent, and maintenance request URLs
  are all set to Innago's tenant sign-in page (see "Who hosts it" below).
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

Pushing code does not deploy production. Every pull request and push to
`main` runs `.github/workflows/ci.yml` (install, lint, tests, production
build). Production is promoted manually from a reviewed commit with the
**Deploy production** workflow. That workflow repeats the checks, builds
with the production Vercel environment, and deploys the immutable build.

Configure the GitHub `production` environment with `VERCEL_TOKEN`,
`VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID`, require an environment reviewer,
then select the exact branch/tag/commit in **Actions → Deploy production →
Run workflow**. `/release` reports the deployed commit/deployment metadata.

This preserves deliberate manual promotion without recreating the old
failure mode where an ordinary `git push` silently shipped production.

## Who hosts it, and what it costs

- **Domain:** `mahnopolyllc.com`, registered through GoDaddy, under
  William's account.
- **Email:** 2 mailboxes (`admin@`, `william@`) via GoDaddy's
  Microsoft 365 add-on, same account. Adding another mailbox (a personal
  one for a family member, say) is entirely a GoDaddy/Microsoft 365
  action — William does it himself from the GoDaddy Email & Office
  panel. It's unrelated to Supabase or the `staff` table; that only
  matters for someone who needs to log into `/admin`. Each mailbox is
  billed per seat, so check current M365 pricing before adding several.
- **Hosting:** Vercel, Pro plan ($20/month base + $20/month per
  additional deploying team seat), under the `mahnopolyllc` Vercel
  Team — not a personal account.
- **Database:** Supabase, under a `MahnopolyLLC` organization tied to
  `admin@mahnopolyllc.com` — currently on the Free tier.
- **Transactional email:** Resend, verified for `mahnopolyllc.com`
  (`inquiries@mahnopolyllc.com` for inquiry notifications; Supabase's
  own auth emails — invites, password resets — also route through
  Resend's SMTP instead of Supabase's rate-limited default sender).
  Under the developer's `leeaisolutions` Resend account, not William's —
  a candidate for moving under his ownership alongside the GitHub repo
  transfer below.
- **Tenant portal, rent payments, and maintenance requests:** Innago,
  William's account, signed up 25 Aug 2026. Innago doesn't give
  landlords a company-specific portal URL — every tenant (once William
  has invited them from his Innago account) signs in at the same
  `https://auth.innago.com/login` and reaches a single dashboard with
  rent payment, maintenance requests, documents, and messaging. That's
  the one URL set for all three link-out fields in Settings; there's no
  per-feature URL to configure. Kansas tenant-fee law — whether the
  platform fee can be passed to tenants — still hasn't been verified
  (see "What's outstanding").

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
7. `007_epoxy_photos.sql` — adds the staff-managed epoxy gallery URLs.
8. `008_harden_inquiry_submission.sql` — removes unrestricted anonymous
   inquiry inserts and replaces them with a validated, volume-limited RPC.

Apply any numbered migrations not yet present in production before deploying
code that depends on them; specifically, `008` must precede the inquiry-action
release in this change. A fresh project should just
run `schema.sql` then `storage.sql` — those already reflect the
current state, not the intermediate owner-portal detour.

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

## Marketing page photos

As of the redesign (see "The visual redesign" above), most public
pages carry real photography as a full-bleed backdrop rather than a
contained banner — the `.hero`-with-cream-padding pattern this section
used to document is gone (the class itself no longer exists in
`globals.css`). Not graphics with text baked in either way: page copy
is still real HTML over the photo, not pixels, for SEO/screen-reader
reasons.

**Current photos and where they came from:**

| Page | File(s) | Native size | Source |
|---|---|---|---|
| Home, `/listings` | `public/redesign/hero-1/2/3.jpg` | ~2200px wide | Real Mahnopoly rental photography (drone), from the `Mahnopoly Pictures` Google Drive folder under the `lee.aisolutions@gmail.com` account. Cross-fade backdrop behind the hero text — see `PhotoHero.tsx`. |
| `/mahtropolis` hero | `public/redesign/mahtropolis-hero.jpg` | ~2200px wide | Same Drive folder (`619D033B-...JPEG`) — a finished row of Mahnopoly townhomes at dusk. Chosen specifically for this slot, 26 Aug 2026 — not the same photo as the grid's street/water-tower shot below, on purpose. |
| `/mahtropolis` photo grid, left→right | `mahtropolis-grading.jpg`, `mahtropolis-street.jpg`, `mahtropolis-street-ground.jpg` | ~2000-2200px wide | Same Drive folder (`dji_fly_..._301...HEIC`, `Mahtropolis.JPG`, `IMG_2880.HEIC`) — the lot mid-grading (aerial), the paved street mid-construction with the water tower (aerial), and that same street at ground level. Order set 26 Aug 2026 — keep it if the grid is ever touched again. |
| `/mahtropolis` plat panel | `public/redesign/plat-map.webp` | as provided | The actual recorded subdivision plat (from the redesign's Claude Design project), tinted navy via CSS `filter`. Distinct from the site photos above — this one's a legal document, not a marketing photo. |
| `/epoxy` | `public/epoxy-flyer.png` | 1920×640 | Unchanged — real photo, predates the redesign. |
| `/about` | `public/redesign/about-photo.jpg` | 2200×1238, contained at `max-width: 900px` | Same Drive folder (`6F5FDE6C-...JPEG`) — a finished Mahnopoly duplex at dusk. Replaced an AI-generated placeholder photo, 26 Aug 2026 (William caught it). |

Every file under `public/redesign/` that came from that Drive folder
(the two above, plus the ones in "The logo" below) was resized (long
edge capped at 2200px) and re-encoded (JPEG quality 82) before adding
it here — several of the Drive originals were 12-14MB straight off a
drone. Two of the Mahtropolis grid photos were `.HEIC` — nothing
available in this environment could decode that format directly, so
each was pulled via Google Drive's own rendered preview image instead
(open the file in Drive, read the `<img>` src Drive's viewer already
rendered it to, fetch that directly) rather than the raw file.

**A gotcha worth knowing before replacing any of these:** match the
new photo's aspect ratio to how it's actually displayed. The hero/grid
images all use Next/Image `fill` + `object-fit: cover`, which crops
safely to whatever box it's given — any aspect ratio works there. The
`/about` photo does **not** — it's a plain contained image with
`width`/`height` props Next uses to size the box, so those must match
the real file's aspect ratio (2200×1238 right now) or the image will
visibly stretch/squish. If a future replacement photo has a different
shape, update those two numbers to match it — don't force it into
2200×1238. Property listing photos are a separate thing entirely —
staff upload those per-listing through `/admin`, shown at much smaller
sizes: 130px-tall cards on the listings grid, a 320px-tall main photo
and 152px-tall thumbnails on a property's own page.

## The logo

`public/redesign/logo.png` (full color, for light backgrounds — the
header) and `logo-white.png` (solid white silhouette, for the navy
footer) are the real Mahnopoly LLC logo, sourced from
`MahnopolyLLC.jpg` in the `Mahnopoly Pictures` Google Drive folder
(under `lee.aisolutions@gmail.com`) and background-removed — the
source file was a flat JPEG (white background baked in, no
transparency), processed with a threshold-based white→transparent pass
for `logo.png`, then flattened to solid white (keeping the same alpha)
for `logo-white.png`. Both are used, wrapped in a link to `/`, in
`Header.tsx` and `Footer.tsx` — update both files (and regenerate both
PNGs the same way) if the logo ever changes.

## The epoxy photo gallery

`/epoxy` shows a "Recent Work" gallery of real customer job photos,
staff-uploadable through `/admin/settings` (an "Epoxy gallery photos"
section, same upload/reorder/remove component listings already use).
The gallery section on the public page is hidden entirely until at
least one photo's been added — same "hidden until set" pattern as the
U-Haul link and tenant-portal buttons.

No new bucket or table: gallery photos reuse the existing
`property-photos` Storage bucket (just under an `epoxy/` subfolder,
for tidiness) and its staff-write/public-read RLS, which is bucket-
scoped rather than listing-scoped already. The list of gallery URLs
lives in a new `settings.epoxy_photos` jsonb column
(`supabase/migrations/007_epoxy_photos.sql`), the same array-of-URLs
shape a listing's own `photos` column already uses.

**A real incident worth knowing about:** on 25 Aug 2026, an upload of
several photos got the admin panel stuck showing "Uploading..."
indefinitely, even though the photos had actually uploaded fine
(confirmed in Supabase's Storage logs — clean 200s, no errors
anywhere). Root cause: the upload function didn't wrap the Storage
call in try/catch, so anything that made a single file's upload throw
rather than return a normal error broke the whole batch loop before it
ever recorded the files that *had* already succeeded — leaving them
orphaned in Storage but invisible in the settings form, and the button
stuck. Fixed in both `src/lib/storage.ts` (always returns an error
instead of throwing) and `src/components/admin/PhotoUpload.tsx` (each
successful upload commits to state immediately instead of waiting for
the whole batch, and a try/finally guarantees the "uploading" state
always clears). If uploads ever look stuck again: check Supabase's
Storage logs first — if the files actually landed, they're safe, and
worth attaching to `settings.epoxy_photos` directly via SQL rather than
re-uploading. Orphaned/unreferenced files in the bucket (cross-check
against `listings.photos` and `settings.epoxy_photos`) are safe to
delete from the Storage browser — that's a manual step, not something
run automatically.

## The visual redesign

**Live on `main` and in production as of 26 Aug 2026.** A full visual
redesign — navy/oxblood-red on cream, Instrument Serif display
headlines, Archivo body copy, IBM Plex Mono uppercase labels, real
Mahnopoly photography, the real logo — replaced the original site.
Built on the `redesign/mahnopoly-2026` branch (merged via PR #1), source
of truth for the visual design itself was a Claude Design project
("Mahnopoly Redesign", turn 3 / the pages marked "client-ready"): Home,
For Rent, For Sale, About, Epoxy, Contact, plus a new Mahtropolis page.
Fonts are self-hosted via `next/font/google` (see `src/app/layout.tsx`);
design tokens, the ticker/marquee, and the photo-hero pattern live in
`src/app/globals.css`, `src/components/Ticker.tsx`, and
`src/components/PhotoHero.tsx`. The admin panel's own chrome
(`.admin-*`, login, tables) was deliberately left alone beyond inheriting
the shared color tokens — no house cursor, no serif type, no ticker
there. Real photography and the real logo (see "Marketing page photos"
and "The logo" below) replaced the design mockup's own stand-ins and
the original placeholder-style stock photos.

**Still worth knowing:**

- **Mahtropolis is new scope**, not just a reskin — a page and nav link
  that didn't exist on the live site before this redesign. It was in
  the design's "client-ready" set but flagged there as "proposed" —
  it's live now; confirm with William that's actually wanted.
- **Contact page gained a real feature, not just a restyle**: a general
  "Send a note" inquiry form (`src/app/(site)/contact/actions.ts`,
  `src/components/GeneralInquiryForm.tsx`) that saves to the same
  `inquiries` table with `listing_id: null` (already nullable in
  `supabase/schema.sql` — no migration needed) and emails the office the
  same way a listing inquiry does. Worth a real test send to confirm
  end to end.
- **Listings page gained real sorting** (price / newest, via
  `?sort=`) that didn't exist before — same data, just now orderable.
- **Mahtropolis is in Emporia, not Topeka** — an earlier draft of this
  page got that wrong throughout (hero tag, meta description, alt
  text); fixed 26 Aug 2026. Worth double-checking any new Mahtropolis
  copy doesn't reintroduce a Topeka assumption.
- **The ticker's marquee loop** (`Ticker.tsx`) is a two-copies,
  animate-negative-50% loop, which is only seamless if each copy is at
  least as wide as the viewport — the original 8-phrase list came up
  short on a wide monitor, so the track ran out of content before the
  loop point and visibly stalled/snapped instead of scrolling
  continuously. Fixed 26 Aug 2026 by repeating the phrase list 4× within
  each half (`REPEAT` in that file) — same loop math, just enough width
  margin for any realistic screen. If it ever runs out again on an
  unusually wide display, bump `REPEAT` further; there's no downside to
  it being higher than strictly needed.
- **The About page photo was AI-generated**, not real — swapped 26 Aug
  2026 for a real photo from the Mahnopoly Pictures Drive folder (see
  "Marketing page photos" above) after William caught it.

## Admin panel mobile pass (26 Aug 2026)

The admin panel's tables didn't scroll on a phone — a long inquiry
message just squeezed the whole row unreadably thin (or ran off-screen
with no way to reach it), same for the properties table. Two changes:

- **`/admin/inquiries` is now a card list, not a table**
  (`src/app/admin/(protected)/inquiries/page.tsx`) — each inquiry is
  its own box with the message free to wrap and be fully read, at any
  screen width, rather than forced into one row's height. Also new:
  phone/email are real `tel:`/`mailto:` links, and the property shows
  as its actual address (linked to that listing's edit page) instead
  of the raw `listing_id` slug — resolved via `getListings()` at
  render time, so a deleted listing degrades to showing the id instead
  of breaking.
- **The properties table** (`/admin`) — kept as a table (its rows are
  short and uniform, a table still fits) but wrapped in a new
  `.table-scroll` container (`overflow-x: auto`) so on a narrow screen
  it scrolls horizontally within its own box instead of overflowing
  invisibly. Same class is there for any other admin table that needs
  it later.
- **Inquiry timestamps were wrong** — off by 5-6 hours, always ahead of
  actual local time. Root cause: `/admin/inquiries` is a Server
  Component, so `new Date(...).toLocaleString()` with no arguments was
  running on Vercel's server (UTC), not in the viewer's browser.
  Verified by forcing `TZ=UTC` locally: the old code printed a UTC
  time; explicitly formatting with `timeZone: "America/Chicago"`
  (`formatReceived` in that file) prints the correct Topeka/Emporia
  time regardless of what timezone the server itself happens to run
  in. Worth remembering if a timestamp anywhere else in the app ever
  looks off — same root cause, same fix.

Also fixed while in here: the public nav's "Staff Login" link showed a
"|" divider meant to separate it from the item before it — on a phone,
once the nav wraps onto its own lines, that divider can land alone at
the start of a line with nothing to divide from. Dropped it below the
900px breakpoint where the nav wraps (`globals.css`).

**Still open:** a text from William described "the button" as
"jumbled" near the days-of-week/hours text, but that wasn't reproduced
in a mobile check of `/contact` (where hours are shown next to the
"Send it over" button) or the footer (hours next to the phone number)
— both read cleanly. Made the `/contact` info rows (Office/Phone/
Hours/Epoxy) stack label-above-value under 480px width regardless
(`.info-row` in `globals.css`) since that's a reasonable hardening
either way, but the actual report is unconfirmed — get a screenshot
or the specific page next time this comes up rather than guessing
further.

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
- **GitHub repo ownership** — still under `EngSeanLee`'s personal
  account. "Source code transferred" is part of the MVP's definition of
  done; move it to an org under `admin@mahnopolyllc.com` (or add William
  as an owner) before this engagement formally closes.
- **Kansas tenant-fee law** — whether the platform fee can be passed to
  tenants still needs verifying. William has already signed up for
  Innago (25 Aug 2026), so this is no longer a "before he commits"
  question — it's live and worth resolving with him directly rather
  than deferring further. Doesn't block anything in this codebase.
- **Resend account ownership** — the Resend account backing both
  inquiry notifications and Supabase's auth emails is under the
  developer's own `leeaisolutions` account, not William's. Same
  category of issue as the GitHub repo above; move before this
  engagement formally closes.

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
  failure on `mail.send`, e.g. a `535` from Resend, which means the
  password saved in Supabase's SMTP settings (Auth → Emails → SMTP
  Settings) no longer matches a live Resend API key — happened once
  already (25 Aug 2026, after the domain moved off Resend's sandbox);
  fix is a fresh key in Resend, pasted into both Supabase's SMTP
  password field and Vercel's `RESEND_API_KEY`, then a redeploy so the
  function picks it up. Separately: if a reset/invite link is reported
  dead within seconds of being sent, suspect Microsoft Defender's "Safe
  Links" on the `@mahnopolyllc.com` M365 mailboxes auto-visiting (and
  thereby consuming) the one-time link before the person opens it — not
  a bug in this codebase, but worth ruling out before debugging further.
- **Photo upload in `/admin` looks stuck on "Uploading...":** check
  Supabase's Storage logs before assuming anything's wrong — a real
  incident on 25 Aug 2026 had this happen while the files had actually
  uploaded fine; see "The epoxy photo gallery" above for the full story
  and the fix. Should be fixed now, but if it recurs, the photos are
  probably already safe in Storage even though the button looks frozen.
- **Production suddenly shows the wrong thing:** check whether GitHub
  auto-deploy got reconnected (`vercel git connect` was run) and a push
  landed on `main` — see "Deploying" above for why that's dangerous here.
- **Anything else:** this README plus `docs/plan.md` should be enough
  context for another developer to pick this up without the original
  author.
