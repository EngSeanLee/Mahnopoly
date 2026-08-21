# Mahnopoly — website mockup

This is a **clickable draft**, not the real website. It's here so William can
click around and react to the layout and flow before any real build starts.
No backend, no database, no real listings — just placeholder addresses and
prices so the pages don't look empty.

## What's in here

- `index.html` — home page
- `listings.html` — for rent / for sale, with the tab toggle working
- `property.html` — a single listing's detail page, with a preview inquiry
  form (it doesn't actually send anything)
- `admin.html` — a rough look at what staff would see, including the
  "add a property" form. Not password-protected — it's a mockup, not real
  staff tooling yet.

Plain HTML/CSS/JS, no build step, no dependencies. `script.js` holds the
sample listing data every page reads from.

## Running it locally

Open `index.html` directly in a browser, or serve the folder with any static
file server, e.g. `npx serve .` from this folder.

## Deploying

This folder deploys as-is to Vercel (or any static host) with no config —
there's no framework and no build step.

## Status

Draft for client review. Once William gives feedback, the real build follows
the plan in `../docs/plan.md` and will replace this with the actual
Next.js/Supabase site described there.
