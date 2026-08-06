# Koh Tao Climbing Guide

A free, community-built climbing guide for Koh Tao, Thailand — crags, routes,
topos, photos, and community trip reports, published as a static website.

Built with Vite + React + TypeScript. The app lives in `app/`; `archive/`
keeps the original legacy single-page site for reference.

## Run locally

```sh
cd app
npm install
npm run dev
```

The dev server runs at http://localhost:3000.

To check the production build locally (this also exercises the service worker
and PWA manifest):

```sh
cd app
npm run build
npm run preview
```

The production build outputs to `app/dist/` and works under any subpath
(relative asset base + hash routing).

## Convert to app later

The site is already an installable PWA — no wrapper needed today:

- **Install now:** open the site in a mobile browser and use
  **Add to Home Screen** (Safari on iOS, Chrome menu on Android). The app
  shell, photos and map tiles are cached offline by the service worker;
  HashRouter makes routing fully server-independent.
- **App-store path later:** the build is fully static with no backend, so it
  can be wrapped as-is — run it through [PWABuilder](https://www.pwabuilder.com)
  to generate store packages, or wrap `app/dist/` with
  [Capacitor](https://capacitorjs.com) for a native shell. No code or backend
  changes are required either way.

## Deployment

The site is published to GitHub Pages by the GitHub Actions workflow in
`.github/workflows/deploy.yml`: every push to `main` builds `app/` and
deploys `app/dist/` to Pages. It can also be triggered manually from the
Actions tab.

## Photos and licensing

Photos are contributed by members of the Koh Tao climbing community. See the
**Sources** page on the published site for credits and licensing details
before reusing any images.
