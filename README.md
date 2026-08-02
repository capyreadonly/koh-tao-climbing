# Koh Tao Climbing Guide

A free, community-built climbing guide for Koh Tao, Thailand — crags, routes,
topos, photos, and community trip reports, published as a static website.

Built with Vite + React + TypeScript. The app lives in `app/`; `archive/`
keeps the original legacy single-page site for reference.

## Local development

```sh
cd app
npm install
npm run dev
```

## Build

```sh
npm run build
```

The production build outputs to `app/dist/` and works under any subpath
(relative asset base + hash routing).

## Deployment

The site is published to GitHub Pages by the GitHub Actions workflow in
`.github/workflows/deploy.yml`: every push to `main` builds `app/` and
deploys `app/dist/` to Pages. It can also be triggered manually from the
Actions tab.

## Photos and licensing

Photos are contributed by members of the Koh Tao climbing community. See the
**Sources** page on the published site for credits and licensing details
before reusing any images.
