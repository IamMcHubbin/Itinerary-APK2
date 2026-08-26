# Japan Itinerary

A day-by-day itinerary app for a trip to Japan — installable to a phone's home
screen as a Progressive Web App (PWA), works offline once loaded, no app
store required.

**Live app:** https://iammchubbin.github.io/Itinerary-APK2/ (deploys
automatically via GitHub Actions on every push — see
[Setup](#hosting-on-github-pages) below for the one-time step to enable it).

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
