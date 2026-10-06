# Reach Map

Plot where your outreach leads are from — an interactive map for tracking contacts by geography, status, and channel.

## Features

- Full-map view of outreach leads with color-coded status markers
- Add leads by city (geocoded via OpenStreetMap Nominatim)
- Search and filter by status
- Select a lead to fly to it, update status, or remove it
- Sample seed data so the map is useful on first open
- Leads persist in your browser (`localStorage`)

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- [mapcn](https://mapcn.dev) MapLibre map (`@/components/ui/map`)

## Run locally

```bash
npm install
npm run dev -- -p 43123
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

## Notes

- No account or database required — data stays in the browser.
- Location lookup needs network access to Nominatim; be respectful of their usage policy for production traffic.
- Use **Reset to sample leads** in the panel footer to restore the demo dataset.
