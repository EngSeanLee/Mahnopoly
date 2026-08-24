# Mahnopoly Website — Phase 1

_Drafted 2026-08-21. Status: approved 2026-08-23, real build in progress
— see the root README's "Live URLs" and "What's left" sections for
current status._

## What this is

A property listings and marketing website for William's rental and sales
business. It replaces a template-locked AppFolio site with one he owns
outright, showcasing available rentals and homes for sale, and capturing
inquiries from prospective tenants and buyers.

## In scope

- Public site: home, listings (rentals and for-sale), individual property
  pages with photo galleries, and standard marketing pages (about, contact).
- Inquiry form on each listing that saves the lead to the database and emails
  the office, even if the email send fails.
- Staff admin panel (login-protected) to add/edit/remove listings, upload and
  order photos with alt text, and mark status (available, rented, pending,
  sold).
- A settings panel where staff can enter/edit the tenant portal URL,
  maintenance request URL, office address, phone, and hours — and toggle
  whether tenant buttons show at all — without a developer touching code.
- Mobile-responsive layout, fast page loads, and basic local SEO (server-
  rendered listing pages so "Topeka rentals"-type searches can find them).

## Explicitly not in scope

- Any rent collection, online payments, or tenant financial data of any
  kind. That work goes through a licensed property management platform
  (Phase 2), never through code we write.
- Selecting, purchasing, or setting up a property management platform
  (AppFolio, Buildium, Innago, etc.) — that's Phase 2, priced separately.
- Automatic two-way sync between the website and any management platform.
  Phase 1 ships with the website as the single source of truth for listings.
- Zillow or other rental-network syndication. Zillow has no public API to
  pull from, and pushing to it depends on either a Phase 2 platform or a
  separate approval process outside our control — treated as a post-launch
  add-on if it happens at all.
- A tenant or owner mobile app. If a real gap shows up after Phase 2, that's
  a possible Phase 3, not part of this build.
- Content entry and photo sourcing for the initial launch listings (staff
  provide these; we build the tool that holds them).
- Domain registration/transfer and DNS handoff logistics beyond pointing the
  domain at hosting once William confirms who holds it.
- Ongoing maintenance, feature requests, or content updates after launch —
  those are separate work once this phase is delivered and accepted.

## Approach

Next.js (App Router) deployed on Vercel, with server-rendered listing pages
for speed and search indexability and static generation for the marketing
pages. Supabase provides Postgres for listings/inquiries/settings, along with
staff login and row-level security so the admin panel can't leak data, and
file storage for property photos. This is a deliberate choice over a
headless CMS: a CMS would handle listings today but need ripping out the
moment real auth or relational data (leases, inquiries) enters the picture.
Its free tier covers a site this size. Resend sends the inquiry
notification email — the form handler writes the lead to the database
first and emails second, so a delivery failure never loses a lead. Next/Image
handles photo resizing and format conversion, since staff will upload
whatever comes off a phone and the listings page needs to stay fast anyway.

The only outward-facing dependency by design is the operational platform
link — the site never hardcodes a portal or syndication URL; those live in
the settings table so swapping platforms later is a five-minute config
change, not a redeploy. If Supabase or Resend is ever discontinued, both
are swappable (Postgres is portable; transactional email has several
drop-in alternatives) without touching the site's core.

## Open questions

1. **Hosting cost.** The SOW says $15-25/month, and Vercel's Hobby tier
   prohibits commercial use — Pro runs about $20/month. Cloudflare Pages
   permits commercial use on its free tier. Cheapest interpretation:
   confirm current terms on both before launch and pick whichever holds the
   quoted number; if neither does, that's a conversation with William before
   signing, not after. Expensive interpretation: quoting $15-25 and
   discovering after launch that compliant hosting costs more — a
   recurring cost overrun on every future invoice.

2. **Where listings live long-term.** Once William picks a Phase 2 platform,
   does the platform become the source of truth for listings (site reads
   from it) or does the website stay the source of truth (platform used
   only for rent/maintenance)? Cheapest interpretation: website stays the
   source of truth — no integration work, decision deferred to Phase 2
   platform selection. Expensive interpretation: building a read integration
   against a platform's API, which may itself require a paid tier upgrade
   (e.g., AppFolio gates API access behind Plus) — real engineering time,
   not scoped here.

3. **Owner-facing page.** Does William manage properties for third-party
   owners, or only his own? This determines whether the site needs an
   owner-facing page, which on comparable sites is a high-value feature.
   Cheapest interpretation: no owner page in Phase 1; add it later if he
   confirms he manages for others. Expensive interpretation: building
   owner login, statements, and reporting now, on spec, before knowing if
   it's needed.

4. **Unit count.** William's total unit count gates which Phase 2 platforms
   he's even eligible for (AppFolio requires 50+ units). This doesn't block
   starting the website, but affects what we can honestly tell him about
   Phase 2 options. Cheapest interpretation: ask him directly, note the
   answer, keep it out of this phase's scope. Expensive interpretation:
   recommending a platform in conversation that he turns out to be
   ineligible for, and having to walk it back.

## Definition of done

- All listing, inquiry, and admin flows work end to end on a production
  deployment, tested with real (or realistic placeholder) photos and data.
- Automated tests cover the inquiry-save-then-email path, including the
  case where email delivery fails and the lead still saves.
- Row-level security is verified: a logged-out or non-staff request cannot
  read or write admin-only data.
- The settings-driven links (portal, maintenance, tenant button visibility)
  can be changed by staff through the admin panel with no code change or
  redeploy.
- A README in plain English covers: what the site is, how to run it
  locally, how to deploy it, who hosts it, monthly recurring costs, and what
  to do if it goes down — written for William, not a developer.
- William (or a stand-in) can log into the admin panel and add a listing
  from photos to publish without our help.

## Risks

- **Hosting terms shift or don't hold the quoted price.** Mitigation:
  confirm Vercel/Cloudflare commercial-use terms and current pricing before
  the SOW is finalized, not after.
- **Phase 2 platform choice constrains what "sync" can mean.** Mitigation:
  keep Phase 1 platform-agnostic (settings-table links only) so no
  engineering work is wasted regardless of which platform William picks.
- **Zillow feed approval (if pursued) sits on someone else's timeline.**
  Mitigation: explicitly scoped as post-launch, never a launch dependency.
