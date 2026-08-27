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
- Swipe/tap between days with a sticky day picker
- Installable to an Android or iOS home screen, works offline
- Light and dark mode, tuned for both
- Fully editable trip data — no backend, no database

## Editing your trip

All itinerary content lives in one file: `src/data/tripData.ts`, currently
filled in with the real Week 1 plan (Tokyo/Hakone/Nikko) — Week 2 is still
being planned and isn't in the app yet. The shape is defined in
`src/types.ts`:

- `Trip` — title, subtitle, date range, and a list of `Day`s
- `Day` — a date, city, short summary, a list of `Activity`s, and optional
  `notes` and `foodOptions`
- `Activity` — time, title, category (`transport` / `food` / `sightseeing` /
  `lodging` / `shopping` / `experience`), and optional description, location,
  rating, tip, `map` (lat/lng/label — pin an activity by adding this), and
  `travelFromPrevious` (how to get here from the prior stop)
- `FoodOption` — a name, description, rating, and optional `map`, listed
  under each day's "Food options"

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
