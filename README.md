# Mahnopoly — the real website

This is William's live property website — a Next.js app that shows rental
and for-sale listings and lets visitors send an inquiry on any property.
It replaces the clickable draft in `mockup-review/` (kept there for
reference) once this build is finished and approved.

**Status: in progress.** The public pages (home, listings, a property page,
and the inquiry form) work end to end against a real Supabase project and
Resend, reading real listing and settings data from the database. The
staff admin panel (`/admin`) is built — real Supabase Auth login, add/
edit/delete listings, view inquiries, edit settings — but not yet tested
against a real login, since creating that first staff account needs to
happen in the Supabase dashboard (see "What's left"). See that section for
what's still not done.

## What this is, in plain terms

A public website with:
- A home page and a listings page (rentals and for-sale, filterable).
- A page per property with photos-to-be and an inquiry form.
- A staff-only admin panel (`/admin`, real login required) to add/edit/
  remove listings, view inquiries, and edit the settings that control the
  tenant portal link and office info — no code changes needed for any of
  that day to day.

The full plan — scope, what's explicitly excluded, and why the pieces were
chosen — is in `docs/plan.md`.

## Running it locally

You need [Node.js](https://nodejs.org) 20 or newer.

```
npm install
npm run dev
```

Then open http://localhost:3000. No account or database is required to
browse the site locally — it runs on the same placeholder data you can
click through in production right now.

## Deploying

This repo deploys to Vercel. Pushing to `main` on GitHub is what triggers a
deploy once the project's Git integration is turned on (not yet — see
"What's left"). Until then, deploys go out with `vercel --prod` from this
folder.

## Environment variables

Copy `.env.example` to `.env.local` and fill in real values — see that
file for what each one is and where to get it. Never commit `.env.local`;
it's gitignored on purpose.

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
2. ~~Staff admin panel~~ — built (`/admin`): listings CRUD, inquiries view,
   settings editor, real Supabase Auth login (no more mockup fake
   password). Not yet tested against a real login — creating the first
   staff account has to happen manually in Supabase (Authentication >
   Users > Add user), since that needs the project's admin dashboard, not
   anything the app's own keys can do. **Photo upload is still a
   placeholder** — the listing form takes pasted photo URLs, not
   drag-and-drop upload to Supabase Storage; that's a distinct follow-up
   piece of work, not done here.
3. ~~Switch `src/lib/listings.ts` to read from the `listings` table~~ —
   done, along with `src/lib/settings.ts` for the tenant portal
   link/office info. Real listing content and photos from William still
   need to replace what's currently seeded (`supabase/seed.sql`).
4. A domain, pointed at this deployment.
5. Automated tests for the inquiry save-then-email path.

## If something breaks

- **Site is down:** check the deployment status at vercel.com (or ask
  whoever holds the Vercel account to check). Vercel's own status page is
  status.vercel.com.
- **Inquiry form errors or listings look wrong:** most likely the
  Supabase project's data or the `.env.local` / Vercel environment
  variables — check those before assuming the code is broken.
- **Anything else:** this README plus `docs/plan.md` should be enough
  context for another developer to pick this up without the original
  author.
