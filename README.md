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

## Install as PWA

The site is an installable PWA — open it in a mobile browser and use
**Add to Home Screen** (Safari on iOS, Chrome menu on Android). The app
shell, photos and map tiles are cached offline by the service worker;
HashRouter makes routing fully server-independent.

## iOS app

The iOS app is a fully native SwiftUI app in `native/` (iOS 26, Swift 6,
XcodeGen). It ships the same data, photos and map tiles inside the bundle and
works completely offline. The Xcode project is generated — regenerate it after
any change to `native/project.yml`:

```sh
cd native
xcodegen generate
open KohTaoClimbing.xcodeproj        # or build from the command line:
xcodebuild -project KohTaoClimbing.xcodeproj -scheme KohTaoClimbing \
  -configuration Debug -destination 'platform=iOS Simulator,name=iPhone 17 Pro' build
```

To run in the simulator: install the built `.app` with
`xcrun simctl install booted <path-to>/KohTaoClimbing.app`, then
`xcrun simctl launch booted com.kohtaoclimbing.guide`.

The bundled JSON/images/tiles under `native/KohTaoClimbing/AppResources/` are
generated from the web data layer — re-run `node work/export-data.mjs` after
changing `app/src/data/*` or `app/public/{images,tiles}`.

App Store distribution needs an Apple Developer account and signing configured
in Xcode (Signing & Capabilities → your team), then a Release archive uploaded
via Xcode's organizer.

## Deployment

The site is published to GitHub Pages by the GitHub Actions workflow in
`.github/workflows/deploy.yml`: every push to `main` builds `app/` and
deploys `app/dist/` to Pages. It can also be triggered manually from the
Actions tab.

## Photos and licensing

Photos are contributed by members of the Koh Tao climbing community. See the
**Sources** page on the published site for credits and licensing details
before reusing any images.
