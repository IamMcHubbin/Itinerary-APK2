# Japan Itinerary

A day-by-day itinerary app for a trip to Japan — installable to a phone's home
screen as a Progressive Web App (PWA), works offline once loaded, no app
store required.

**Live app:** https://iammchubbin.github.io/Itinerary-APK2/ (deploys
automatically via GitHub Actions on every push — see
[Setup](#hosting-on-github-pages) below for the one-time step to enable it).

## Features

- Day-by-day timeline with times, locations, categories, and travel tips
- Tap any stop to expand it: full details, an embedded map, and links to open
  it in Google Maps or Apple Maps
- Per-day food recommendations, same tap-to-expand + map treatment
- **Live collaborative editing** — anyone with the app open can enter Edit
  mode to drag-reorder days, edit or add/delete activities, and leave notes
  on any stop; changes sync to everyone else's device in real time
- **Wishlist** — a shared, categorized (Lodging/Sightseeing/Food) list of
  things people want to do, separate from the confirmed itinerary; check an
  item off once it's actually been planned
- Swipe/tap between days with a sticky day picker
- Installable to an Android or iOS home screen, works offline
- Light and dark mode, tuned for both

## Collaborative editing

The trip is stored in a shared Firestore document and kept in sync live
across everyone viewing the app (see [Architecture](#architecture) below).

- **Edit mode**: tap "Edit" in the header (only shown once connected — see
  the "Live"/"Connecting…" indicator next to the dates) to drag-reorder days
  (grip handle on each day pill), edit activity fields inline, and add/delete
  activities or days. Reordering days recomputes every date sequentially from
  the trip's start date — "swapping two days" moves the plan to the other
  calendar date.
- **Notes**: expand any activity and scroll to "Notes" to leave a comment —
  no login, just a display name (stored on your device) so others can see
  who left it. Comments appear for everyone live, independent of edit mode.
- **Wishlist tab**: switch to it from the header. Suggest a place under
  Lodging/Sightseeing/Food (name required the first time, remembered after
  that), then tick it off once it's actually planned — optionally picking
  which day it landed on. This is deliberately separate from the itinerary:
  it's a running "things we might want to do" list, checked off manually
  rather than auto-matched against activities.
- There's no login and no per-editor permissions — anyone with the app URL
  can edit or comment. That's a deliberate tradeoff for a small private trip
  group; see [Architecture](#architecture) if you want to lock it down further.

`src/data/tripData.ts` is still there as the local fallback/seed — used to
seed Firestore once (see `scripts/seedFirestore.ts`) and as what renders
before the app connects. Its shape (`src/types.ts`) is what's stored in
Firestore too:

- `Trip` — title, subtitle, date range, and a list of `Day`s
- `Day` — a date, city, short summary, a list of `Activity`s, and optional
  `notes` and `foodOptions`
- `Activity` — time, title, category (`transport` / `food` / `sightseeing` /
  `lodging` / `shopping` / `experience`), and optional description, location,
  rating, tip, `map` (lat/lng/label — pin an activity by adding this), and
  `travelFromPrevious` (how to get here from the prior stop)
- `FoodOption` — a name, description, rating, and optional `map`, listed
  under each day's "Food options"
- `WishlistItem` (in the separate Wishlist tab, not `tripData.ts`) — category
  (`lodging`/`sightseeing`/`food`), title, notes, who suggested it, whether
  it's planned, and optionally which day it landed on

### Map embeds

Activity/food cards with a `map` show an embedded Google Map using a keyless
embed URL (`https://maps.google.com/maps?q=...&output=embed`, in
`src/lib/maps.ts`) — no API key or billing needed, but it's an unofficial
trick that could stop working. If it does, swap `googleMapsEmbedUrl` for the
official [Maps Embed API](https://developers.google.com/maps/documentation/embed/get-started)
with a free key.

The embed and the "Open in Google/Apple Maps" links all search by the
place's `map.label` (name), not its raw coordinates — a bare lat/lng drops a
generic pin with no reviews, hours, or photos attached, while searching the
name resolves to the actual listing. `lat`/`lng` are still stored on `map`
(handy for reference) but aren't used to build these links.

## Architecture

The app talks to a single Firestore document (`trips/japan-2026`) that holds
the whole trip, kept in sync via a realtime listener (`onSnapshot`) — every
edit anywhere writes the whole `days` array back, and everyone's `onSnapshot`
listener picks up the change within a second or two. Notes/comments and
wishlist items each live in their own subcollection (`comments`, `wishlist`)
instead, so posting one doesn't require read-modify-writing the whole trip
document.

- **Config**: `src/lib/firebase.ts` reads `VITE_FIREBASE_*` env vars. These
  values aren't secret (Firebase's own guidance: client config is safe to
  expose — access control is enforced by security rules, not by hiding this),
  so they're committed in `.env.production` rather than needing GitHub Actions
  secrets. `.env.local` (git-ignored) holds the same values for local dev.
- **Security rules**: open read/write, scoped to just this app's document —
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /trips/{tripId} {
      allow read, write: if true;
      match /comments/{commentId} {
        allow read, write: if true;
      }
      match /wishlist/{itemId} {
        allow read, write: if true;
      }
    }
  }
}
```
  Anyone with the app URL can read/write this one document, its comments,
  and its wishlist — not your whole Firestore project. There's no login
  system here; add Firebase Auth + rules keyed on `request.auth` if you want
  per-editor permissions later.
- **Transport**: initialized with `experimentalAutoDetectLongPolling: true`
  so it falls back gracefully on networks that block Firestore's normal
  streaming connection (some corporate proxies, certain mobile
  carriers/VPNs) instead of just failing.
- **Seeding**: `scripts/seedFirestore.ts` pushes `tripData.ts` into Firestore
  once, as the starting point — `node --env-file=.env.local ./node_modules/.bin/tsx scripts/seedFirestore.ts`.
  It won't overwrite an existing document.
- **Wishlist from itinerary**: `scripts/populateWishlistFromItinerary.ts`
  fills the Wishlist tab from what's already planned — every scheduled
  activity (except pure transport legs) becomes a "planned" wishlist item
  linked to its day, and each day's food *options* become "open" food
  wishlist items. Reads the *live* trip document, uses deterministic IDs, and
  never touches items people added by hand — safe to re-run any time the
  itinerary changes: `node --env-file=.env.local ./node_modules/.bin/tsx scripts/populateWishlistFromItinerary.ts`.
- If Firebase env vars aren't set (e.g. a fork without its own project), the
  app still works read-only from the local `tripData.ts` seed — the "Edit"
  button and Live/Connecting indicator only appear once actually connected.

## Running locally

```bash
npm install
npm run dev
```

Open the printed local URL in a browser (or on your phone, on the same
network) to preview.

## Hosting on GitHub Pages

A workflow at `.github/workflows/deploy.yml` builds and deploys the app to
GitHub Pages automatically on every push to `main` (or this branch). One-time
setup, in the repo on GitHub:

1. **Settings → Pages → Source** → select **GitHub Actions**.
2. Push a commit (or re-run the workflow from the **Actions** tab).
3. After it finishes, the app is live at
   `https://<owner>.github.io/<repo>/` — for this repo,
   https://iammchubbin.github.io/Itinerary-APK2/.

## Installing on your phone or tablet

Once the site is live (see above), open the URL in a browser:

- **Android (Chrome):** open the site, tap the menu (⋮), choose "Add to Home
  screen" / "Install app".
- **iOS (Safari):** open the site, tap Share, choose "Add to Home Screen".

The app then launches full-screen like a native app and keeps working
offline, since the service worker precaches everything on first load.

## Building manually

```bash
npm run build
npm run preview
```

The output in `dist/` can be hosted anywhere that serves static files over
HTTPS (Netlify, Vercel, Cloudflare Pages, etc.) as an alternative to GitHub
Pages.

## Tech stack

React + TypeScript + Vite, Tailwind CSS v4, Framer Motion, and
`vite-plugin-pwa` for the manifest and service worker.
