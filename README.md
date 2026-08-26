# Japan Itinerary

A day-by-day itinerary app for a trip to Japan — installable to a phone's home
screen as a Progressive Web App (PWA), works offline once loaded, no app
store required.

## Features

- Day-by-day timeline with times, locations, categories, and travel tips
- Swipe/tap between days with a sticky day picker
- Installable to an Android or iOS home screen, works offline
- Light and dark mode, tuned for both
- Fully editable trip data — no backend, no database

## Editing your trip

All itinerary content lives in one file: `src/data/tripData.ts`. It's
pre-filled with a 10-day sample Tokyo → Hakone → Kyoto → Osaka trip — replace
it with your own dates, cities, and activities. The shape is defined in
`src/types.ts`:

- `Trip` — title, subtitle, date range, and a list of `Day`s
- `Day` — a date, city, short summary, and a list of `Activity`s
- `Activity` — time, title, category (`transport` / `food` / `sightseeing` /
  `lodging` / `shopping` / `experience`), and optional description, location,
  and tip

## Running locally

```bash
npm install
npm run dev
```

Open the printed local URL in a browser (or on your phone, on the same
network) to preview.

## Building & installing on a phone

```bash
npm run build
npm run preview
```

Host the contents of `dist/` anywhere that serves static files over HTTPS
(GitHub Pages, Netlify, Vercel, Cloudflare Pages, etc.). Once it's live:

- **Android (Chrome):** open the site, tap the menu, choose "Add to Home
  screen" / "Install app".
- **iOS (Safari):** open the site, tap Share, choose "Add to Home Screen".

The app then launches full-screen like a native app and keeps working
offline, since the service worker precaches everything on first load.

## Tech stack

React + TypeScript + Vite, Tailwind CSS v4, Framer Motion, and
`vite-plugin-pwa` for the manifest and service worker.
