# Mahnopoly — the real website

This is William's live property website — a Next.js app that shows rental
and for-sale listings and lets visitors send an inquiry on any property.
It replaces the clickable draft in `mockup-review/` (kept there for
reference) once this build is finished and approved.

## Live URLs

- **What William reviews today:** https://mahnopoly.vercel.app — the
  static clickable mockup (`mockup-review/`), not the real build below.
- **The real build, in progress:** preview deployment, currently
  https://mahnopoly-me2si17cy-lee-ai-solutions.vercel.app — requires
  being logged into the `lee-ai-solutions` Vercel team to view (Vercel's
  own SSO wall on non-custom-domain URLs, not something this app added).
  This URL changes on redeploy; get the current one with `vercel ls` or
  the Vercel dashboard if this one goes stale.

**Status: in progress.** The public pages (home, listings, a property page,
and the inquiry form) work end to end against a real Supabase project and
Resend, reading real listing and settings data from the database. The
staff admin panel (`/admin`) is built and verified against a real login —
add/edit/delete listings, view inquiries, edit settings all confirmed
working. See "What's left" for what's still not done.

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
browse the public pages locally — it falls back to placeholder data if
`.env.local` isn't set up. The admin panel needs real Supabase credentials
either way (see "Environment variables").

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

## Environment variables

Copy `.env.example` to `.env.local` and fill in real values — see that
file for what each one is and where to get it. Never commit `.env.local`;
it's gitignored on purpose. Preview deployments need the same variables
set in Vercel too (`vercel env add <NAME> preview`) — they don't inherit
`.env.local`.

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
   link/office info. Added 3 real sample listings (real addresses, real
   photos pulled from William's Facebook business page) alongside the 5
   placeholder ones from `supabase/seed.sql`, to prove the content
   pipeline end to end — their beds/baths/price are estimated, not
   pulled from an MLS, and are flagged as such in each listing's
   description. Still need: William's confirmation of exact specs on
   those 3, and his full real inventory replacing the remaining
   placeholders entirely before launch.
4. A domain, pointed at this deployment.
5. When the real build is ready to go live: promote a deployment to
   production (`vercel deploy --prod`), point the domain at it, and only
   then consider reconnecting GitHub auto-deploy if that's still wanted.
6. Automated tests for the inquiry save-then-email path.

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
