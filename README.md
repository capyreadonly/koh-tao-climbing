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

The site is wrapped as a native iOS app with [Capacitor](https://capacitorjs.com)
(v8) in `app/ios/` — the web build is bundled into the app and served offline
from a `capacitor://` origin (service-worker registration is skipped there;
see `app/src/main.tsx`).

Prerequisites: Xcode (with an iOS simulator runtime) and CocoaPods
(`brew install cocoapods`).

```sh
cd app
npm run build && npx cap sync ios   # rebuild the web bundle and copy it into ios/
npx cap open ios                    # open the project in Xcode
```

From the command line, build and run in the simulator:

```sh
cd app/ios/App
xcodebuild -project App.xcodeproj -scheme App -configuration Debug \
  -destination 'platform=iOS Simulator,name=iPhone 17 Pro' build CODE_SIGNING_ALLOWED=NO
xcrun simctl boot "iPhone 17 Pro"
xcrun simctl install booted <path-to>/Debug-iphonesimulator/App.app
xcrun simctl launch booted com.kohtaoclimbing.guide
```

App Store distribution additionally needs an Apple Developer account and
signing configured in Xcode (Signing & Capabilities → your team), then a
Release archive uploaded via Xcode's organizer.

## Deployment

The site is published to GitHub Pages by the GitHub Actions workflow in
`.github/workflows/deploy.yml`: every push to `main` builds `app/` and
deploys `app/dist/` to Pages. It can also be triggered manually from the
Actions tab.

## Photos and licensing

Photos are contributed by members of the Koh Tao climbing community. See the
**Sources** page on the published site for credits and licensing details
before reusing any images.
