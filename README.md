# Reach Map

Plot where your outreach leads are from — an interactive map for tracking contacts by geography, status, and channel.

## Features

- Google Sign-In (Auth.js) when OAuth credentials are configured
- Demo email login when Google isn’t configured yet
- Full-map view of outreach leads with color-coded custom tags
- Add leads by city (geocoded via OpenStreetMap Nominatim)
- Create and manage your own lead tags
- Set a lead date (defaults to now)
- Clear all leads with a confirmation warning
- Large total-leads count in the top right
- Search and filter by tag
- Leads and tags persist in your browser (`localStorage`)
- Sample seed data so the map is useful on first open

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Auth.js (`next-auth`) with Google + credentials demo
- [mapcn](https://mapcn.dev) MapLibre map (`@/components/ui/map`)
- Apple Human Interface–inspired materials, typography, and system colors

## Run locally

```bash
npm install
cp .env.example .env.local   # set AUTH_SECRET; add Google keys to enable Google Sign-In
npm run dev -- -p 43123
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

### Google Sign-In setup

1. Create an OAuth **Web application** client in [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Add authorized redirect URI: `http://127.0.0.1:43123/api/auth/callback/google`
3. Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `AUTH_SECRET` in `.env.local` (or Cloud Agent secrets).
4. Restart the dev server.

Until those are set, **Continue with Google** stays disabled and demo email login still works.

## Notes

- Lead data stays in the browser (`localStorage`).
- Location lookup needs network access to Nominatim; be respectful of their usage policy for production traffic.
- Use **Reset to sample leads** in the panel footer to restore the demo dataset.
