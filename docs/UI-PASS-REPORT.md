# UI pass + light/dark mode — Koh Tao Climbing iOS

Branch `feat/ui-pass-light-dark` (base `origin/fix/dq-002-b1-dual-nulls` @ 2986299). Committed locally; not pushed.

Model: claude-opus-5-5 (Claude Code, headless)

## Summary

- The map is already native MapKit (`MKMapView` in a `UIViewRepresentable`) with bundled offline tiles. There are no third-party map SDKs and no packages, and it has no performance problem worth rewriting. Map changes are limited to one line for dark-mode legibility.
- The app now has a brand accent colour in the asset catalog (Any + Dark), a readable-tint helper for coloured text, and shared components (`PhotoScrim`, `BadgeRow`, a reworked `FilterChipLabel`). Hard-coded colours that failed in one appearance were replaced.
- Fixed the UI defects that the BEFORE screenshots showed (listed per screen below).
- Added an Appearance setting (System / Light / Dark). The default is System.
- Debug and Release simulator builds succeed. The full suite passes: 7/7 unit tests and 4/4 UI tests, with 1 opt-in screenshot test skipped.
- No JSON, CSV or other data file was touched.

## 1. Map library audit

**The iOS app uses native MapKit, specifically UIKit `MKMapView` wrapped for SwiftUI. It does not use the SwiftUI `Map`.**

| What | Where |
|---|---|
| `import MapKit` | `native/KohTaoClimbing/Sources/MapTabView.swift:1` |
| Offline raster tiles: `OfflineTileOverlay: MKTileOverlay` reads `AppResources/Tiles/{z}/{x}/{y}.png` from the bundle (215 PNGs, z10–15), and synthesises z16–17 by cropping the z15 ancestor | `MapTabView.swift:6-93` |
| Sea backdrop overlay under the tiles | `MapTabView.swift:126-142` |
| `OfflineMKMapView: MKMapView`, which waits for a real size before setting up the camera | `MapTabView.swift:173-188` |
| `OfflineMapView: UIViewRepresentable`: overlays, annotations, camera zoom range and boundary | `MapTabView.swift:193-303` |
| Pin tap → `onSelectCrag` → `MapTabView.selectedCrag` → `.sheet(item:)` CragDetail | `MapTabView.swift` (`didSelect` delegate, `sheet(item: $selectedCrag)`) |
| Camera persisted in `UserDefaults` once a gesture settles (`MapCameraStore`), not in SwiftUI state | `MapTabView.swift:98-122` |

Leftover SDK check:

- `native/**/Package.resolved`: none exists.
- `native/KohTaoClimbing.xcodeproj/project.pbxproj`: no `XCRemoteSwiftPackageReference`, no `XCSwiftPackageProductDependency` and no `packageReferences`. `project.yml` declares no packages.
- No Mapbox, Google Maps, MapLibre, Leaflet or `WKWebView` anywhere in `native/`.
- The web `app/` (reported only) uses **Leaflet** through `react-leaflet` (`app/src/components/CragMap.tsx:3-5`, `app/package.json`: `leaflet ^1.9.4`, `react-leaflet ^5.0.0`). It has no effect on the iOS app.

**Performance.** There is no sluggishness to fix, and I did not rewrite the map. The build-7 zoom work already fixed the real causes: camera persistence moved out of `@AppStorage` (which re-rendered the tab on every region callback), tile crops are cached in an `NSCache`, the zoom limits are calibrated from the view's real size, and annotation views are dequeued and reused. There are 12 mapped pins with clustering disabled. `mapViewDidChangeVisibleRegion` does only a rect intersection and calls back only when the coverage state flips. `MapTabView.body` depends only on `mapFocus`, the coverage flag and sheet state, so it doesn't churn during gestures. Pin-tap → sheet, "Show on map" focus and the zoom behaviour are unchanged.

**The one map change** (`MapTabView.swift`, `makeUIView`): `mapView.overrideUserInterfaceStyle = .light`. The OSM raster is a light map in every appearance. In dark mode MapKit drew the pin titles ("Sairee Beach Boulders", "Golden View") white with a halo on top of it, and they washed out. With the change the map view stays light, so the titles are dark and legible. The SwiftUI chrome over the map (legend, glass buttons, coverage banner, tab bar) still follows the system. Compare `map-dark` before and after below.

## 2. What changed, file by file

| File | Change |
|---|---|
| `Assets.xcassets/AccentColor.colorset` (new) | Brand teal. Light: the launch-screen teal `#0E747C` (≈5.5:1 on white, and white text on it ≈5.5:1). Dark: `#16808A` (≈4.5:1 as a tint on black, and white text on a filled button ≈4.7:1). A first choice, `#209AA3`, gave only ≈3.4:1 for white text and was replaced after review. |
| `Assets.xcassets/StarRating.colorset` (new) | Stars. Light: deep amber `#C07E00` (plain `.yellow` was ≈1.5:1 on white). Dark: system-yellow-like `#FFD60A`. |
| `project.yml` | `ASSETCATALOG_COMPILER_GLOBAL_ACCENT_COLOR_NAME: AccentColor`. The app tint was system blue before, with teal applied ad hoc in a few places. |
| `CragStyle.swift` | `GuideTheme` gains `brand`, `star`, `minTapTarget` and `readable(_:)`, which mixes a tint 35% toward `.label` so coloured text darkens in light mode and lifts in dark. New `PhotoScrim` (a gradient that is the same in both modes, for text over photos) and `BadgeRow` (whole badges, with the overflow collapsed into "+N"). `StyleBadge`, `GuideCallout` (title plus a hairline border), `StarsView` and `VerifiedMark` now use readable colours. |
| `RoutesTabView.swift` | New `FilterChipLabel`: a neutral `.fill.tertiary` capsule at rest; when selected, a tinted fill, a tinted border and a readable label, so the state doesn't rely on hue alone. The capsule is drawn 36 pt tall inside a **44 pt hit area** (it was 34 pt). The filter bar is reordered to **clear → crag → grade → photo → styles → verified → sort**, because active grade and photo filters used to sit off-screen to the right. "clear" is always present and disabled when nothing is filtered, so chips don't shift sideways as filters toggle. `RouteRow`: the style badge and the "Has photo"/"No photo" label don't truncate or wrap at normal sizes. The sector sits beside them when it fits and drops to its own line when it doesn't. A last-resort layout (one item per line, with the badge allowed to truncate) keeps accessibility text sizes from spilling into the stars column. |
| `RoutesFilterModel.swift` | The photo chip reads "with photo" / "without photo" instead of "has-photo" / "no-photo". The row labels "Has photo" / "No photo" are unchanged, and so are the launch args and test hooks. |
| `CragDetailView.swift` | A combined CTA row, **[Open N routes] [Map]**, replaces the prominent button and the lone "Show on map" row that sat further down. The icon on the prominent button was blue on teal before; it is now explicitly white. The hero photo uses `PhotoScrim`, and its photo-count chip is a dark material chip with white text in both modes. The highlight star uses `GuideTheme.star`. **`PhotoViewerSheet` is always dark** (`colorScheme` .dark plus a dark toolbar), where before it showed a light-grey caption panel and bars over a black photo in light mode. |
| `CragsTabView.swift` | Crag row badges use `BadgeRow`: "sport, toprope, +2" instead of "topr…", "multi…", "entr…". |
| `CommunityTabView.swift` | `GuideHeader` section headers (matching Crags and Plan), a `ContentUnavailableView` empty state for searches with no results, and the photo library hidden during a search. Report rows use body-weight titles and a tight photo count ("▣ 2"; the label had a wide gap before), with an accessibility label ("2 photos"). Community thumbnails get rounded corners, a placeholder background and **VoiceOver labels**; they had none before. The "Watch the video" link colour is readable. |
| `AboutGuideView.swift` | Brand tint on the icon and the "Start exploring" button (the hard-coded `.teal` is removed). New **Display → Appearance** picker (not shown on the first-run sheet). |
| `KohTaoClimbingApp.swift` | `AppAppearance` enum (`@AppStorage("appearance")`, default `.system`), applied with `.preferredColorScheme` at the root. |
| `MapTabView.swift` | `overrideUserInterfaceStyle = .light` on the `MKMapView` (see §1). |
| `UITests/UIPassScreenshotTests.swift` (new) | An opt-in before/after capture of 18 screens × 2 appearances. It skips unless `/tmp/uipass/.phase` names a phase. |
| `UITests/AppearanceSettingUITests.swift` (new) | Checks that the Appearance picker exists on About, that choosing Dark updates the picker's value (so the `@AppStorage` write lands), and that it can be set back to System. It checks the stored setting, not the rendered colours; the AFTER dark screenshots cover the colours. |
| `docs/ui-pass/{before,after}/*.png` (new) | 36 + 36 screenshots. |

## 3. Screens: before / after

All shots are iPhone 17 Pro, iOS 26.2 simulator. "Before" is the unmodified `HEAD` build. Notes list what changed and why.

### Map

The pin titles in dark mode are the fix. The legend, glass buttons and banner already used materials and read fine in both modes.

| | Light | Dark |
|---|---|---|
| Before | ![](ui-pass/before/map-light.png) | ![](ui-pass/before/map-dark.png) |
| After | ![](ui-pass/after/map-light.png) | ![](ui-pass/after/map-dark.png) |

**Map with a pin's CragDetail sheet open.** The sheet uses the new CTA row and brand tint.

| | Light | Dark |
|---|---|---|
| Before | ![](ui-pass/before/map-crag-sheet-light.png) | ![](ui-pass/before/map-crag-sheet-dark.png) |
| After | ![](ui-pass/after/map-crag-sheet-light.png) | ![](ui-pass/after/map-crag-sheet-dark.png) |

**Coverage banner** (camera forced off the tiles). It is a material capsule with primary text and is legible in both modes. It is unchanged apart from the tint.

| | Light | Dark |
|---|---|---|
| Before | ![](ui-pass/before/map-edge-light.png) | ![](ui-pass/before/map-edge-dark.png) |
| After | ![](ui-pass/after/map-edge-light.png) | ![](ui-pass/after/map-edge-dark.png) |

### Crags

Whole badges plus "+N" instead of three or four truncated badges per row. Style badge text is darker in light mode and lighter in dark.

| | Light | Dark |
|---|---|---|
| Before | ![](ui-pass/before/crags-light.png) | ![](ui-pass/before/crags-dark.png) |
| After | ![](ui-pass/after/crags-light.png) | ![](ui-pass/after/crags-dark.png) |

### CragDetail

- The CTA row puts "Open 49 routes" and "Map" side by side.
- The prominent button had a blue icon on teal, and in dark mode white text on bright cyan (≈2:1). It is now the brand teal with white text and icon.
- The hero scrim is stronger, and the photo chip is a dark material with a white icon.

| | Light | Dark |
|---|---|---|
| Before | ![](ui-pass/before/crag-detail-light.png) | ![](ui-pass/before/crag-detail-dark.png) |
| After | ![](ui-pass/after/crag-detail-light.png) | ![](ui-pass/after/crag-detail-dark.png) |

**Scrolled** to show the facts grid and callouts:

| | Light | Dark |
|---|---|---|
| Before | ![](ui-pass/before/crag-detail-more-light.png) | ![](ui-pass/before/crag-detail-more-dark.png) |
| After | ![](ui-pass/after/crag-detail-more-light.png) | ![](ui-pass/after/crag-detail-more-dark.png) |

### Routes

**Routes: chips and photo labels.**

| | Light | Dark |
|---|---|---|
| Before | ![](ui-pass/before/routes-light.png) | ![](ui-pass/before/routes-dark.png) |
| After | ![](ui-pass/after/routes-light.png) | ![](ui-pass/after/routes-dark.png) |

**Routes with sport + Mid + has-photo active.** Before, the grade and photo selections were off-screen, "Has photo" wrapped onto two lines and the style badge read "sport/t…". After, clear / Mid / with photo lead the bar, and the badge and label are intact.

| | Light | Dark |
|---|---|---|
| Before | ![](ui-pass/before/routes-filtered-light.png) | ![](ui-pass/before/routes-filtered-dark.png) |
| After | ![](ui-pass/after/routes-filtered-light.png) | ![](ui-pass/after/routes-filtered-dark.png) |

**Routes with boulder + project + has-photo active.** This combination still matches routes, so these shots show a selected boulder chip, not an empty state; the no-results empty state was already a `ContentUnavailableView`.

| | Light | Dark |
|---|---|---|
| Before | ![](ui-pass/before/routes-empty-light.png) | ![](ui-pass/before/routes-empty-dark.png) |
| After | ![](ui-pass/after/routes-empty-light.png) | ![](ui-pass/after/routes-empty-dark.png) |

**Route detail.** Stars are deep amber in light mode, and the verified label is readable.

| | Light | Dark |
|---|---|---|
| Before | ![](ui-pass/before/route-detail-light.png) | ![](ui-pass/before/route-detail-dark.png) |
| After | ![](ui-pass/after/route-detail-light.png) | ![](ui-pass/after/route-detail-dark.png) |

### Photo viewer

Always dark now. In light mode it used to show a light-grey caption panel under a black photo.

| | Light | Dark |
|---|---|---|
| Before | ![](ui-pass/before/photo-viewer-light.png) | ![](ui-pass/before/photo-viewer-dark.png) |
| After | ![](ui-pass/after/photo-viewer-light.png) | ![](ui-pass/after/photo-viewer-dark.png) |

### Plan

**Plan hub.** Already semantic; only the tint changed.

| | Light | Dark |
|---|---|---|
| Before | ![](ui-pass/before/plan-light.png) | ![](ui-pass/before/plan-dark.png) |
| After | ![](ui-pass/after/plan-light.png) | ![](ui-pass/after/plan-dark.png) |

**Guidebooks.** Links use the brand tint.

| | Light | Dark |
|---|---|---|
| Before | ![](ui-pass/before/guidebooks-light.png) | ![](ui-pass/before/guidebooks-dark.png) |
| After | ![](ui-pass/after/guidebooks-light.png) | ![](ui-pass/after/guidebooks-dark.png) |

**Gear & Safety.** Hazard callouts have a readable title tint and a hairline border.

| | Light | Dark |
|---|---|---|
| Before | ![](ui-pass/before/gear-safety-light.png) | ![](ui-pass/before/gear-safety-dark.png) |
| After | ![](ui-pass/after/gear-safety-light.png) | ![](ui-pass/after/gear-safety-dark.png) |

### About

**About (Plan → About).** Brand icon. The new Display → Appearance setting is at the foot of the list, below the fold in these shots.

| | Light | Dark |
|---|---|---|
| Before | ![](ui-pass/before/about-light.png) | ![](ui-pass/before/about-dark.png) |
| After | ![](ui-pass/after/about-light.png) | ![](ui-pass/after/about-dark.png) |

**About (first-run sheet).** "Start exploring" uses the brand accent in both modes.

| | Light | Dark |
|---|---|---|
| Before | ![](ui-pass/before/about-first-run-light.png) | ![](ui-pass/before/about-first-run-dark.png) |
| After | ![](ui-pass/after/about-first-run-light.png) | ![](ui-pass/after/about-first-run-dark.png) |

### Community

**Community.** Editorial headers with counts and a tight photo count.

| | Light | Dark |
|---|---|---|
| Before | ![](ui-pass/before/community-light.png) | ![](ui-pass/before/community-dark.png) |
| After | ![](ui-pass/after/community-light.png) | ![](ui-pass/after/community-dark.png) |

**Report detail.** `GuideHeader` sections and a readable video link.

| | Light | Dark |
|---|---|---|
| Before | ![](ui-pass/before/report-detail-light.png) | ![](ui-pass/before/report-detail-dark.png) |
| After | ![](ui-pass/after/report-detail-light.png) | ![](ui-pass/after/report-detail-dark.png) |

**Launch screen.** Not captured: `XCUIApplication.launch()` returns after the launch screen has gone. It needs no change. `Info.plist` → `UILaunchScreen.UIColorName = LaunchBackground`, and `LaunchBackground.colorset` **already has a dark appearance**: `#0E747C` in light, `#0A5258` in dark. The new accent reuses the same light teal, so the launch screen and app tint match.

## 4. Colour audit

| Was | Where | Now |
|---|---|---|
| No accent asset; system-blue tint plus ad-hoc `.teal` | app-wide, `.tint(.teal)` in CragDetail and About, `.teal` icon in About, `.teal` crag chip | `AccentColor` asset (Any + Dark) as the global accent; `GuideTheme.brand` |
| `.yellow` stars | `StarsView`, CragDetail highlight | `StarRating` asset (deep amber in light, yellow in dark) |
| Tint as text: `.teal`, `.cyan`, `.orange`, `.pink`, `.red`, `.green` on a pale tint of themselves | `StyleBadge`, `FilterChipLabel`, "Has photo", `VerifiedMark`, route-detail verified label, `GuideCallout` title, video icon and link | `GuideTheme.readable(tint)` (mixes toward `.label`) |
| `Color.secondary.opacity(0.10)` chip background with `.secondary` text | `FilterChipLabel` at rest | `.fill.tertiary` with `.primary` text |
| `.black.opacity(0.55)` gradient, `.black.opacity(0.35)` chip | Crag hero photo | `PhotoScrim` (0 → 0.35 → 0.7 black) and an `.ultraThinMaterial` chip forced dark. It stays dark on purpose, because the photo is the backdrop. |
| `.background(.black)` plus `.bar` panel and system bars following the theme | `PhotoViewerSheet` | The whole viewer is forced to `.dark` |
| `.white` text on `.orange` badge | Map "Unmapped" count | Kept: legible in both modes |
| `.black.opacity(0.65)` with `.white` | `NdBadge` (on photos) | Kept: sits on photos |
| `UIColor(red:170,green:211,blue:223)` sea | `OfflineTileOverlay.seaColor` | Kept: it must match the raster's own sea colour |
| `UIColor(CragStyle.color…)` marker tints, `.systemGray` cluster | Map annotations | Kept: dynamic system colours |
| `LaunchBackground` colour set | Launch screen | Already had a dark variant; unchanged |

Everything else was already semantic: `.primary`/`.secondary`/`.tertiary`/`.quaternary`, `.regularMaterial`/`.bar`, `List` grouped backgrounds, `ContentUnavailableView`.

## 5. Appearance setting

**Added.** Plan → About this guide → Display → Appearance: System / Light / Dark. It is stored with `@AppStorage("appearance")`, defaults to System, and is applied with `.preferredColorScheme` on the root view in `KohTaoClimbingApp`. It is hidden on the first-run sheet. `AppearanceSettingUITests` covers it.

## 6. Builds and tests

All commands were run from `native/` after `xcodegen generate`.

| Command | Result |
|---|---|
| `xcodebuild build -scheme KohTaoClimbing -configuration Debug -destination 'platform=iOS Simulator,id=028BFDCC-4C68-4BB3-91F0-1880DF694EE8' -derivedDataPath build/DD` | **BUILD SUCCEEDED** |
| same with `-configuration Release` | **BUILD SUCCEEDED** |
| `xcodebuild test -scheme KohTaoClimbing -destination 'platform=iOS Simulator,id=4E8850F7-…' -derivedDataPath build/DD` | **TEST SUCCEEDED**: see the breakdown below |

Test breakdown:

- XCTest `DataStoreTests`: 7/7 passed.
- XCUITest: 4/4 passed.
  - `MapTapRoutesUITests`: pin selection → CragDetail sheet, grade + style filters, photo filter with "Has photo" labels.
  - `AppearanceSettingUITests`: 1 test.
- `UIPassScreenshotTests`: skipped in a normal run, as designed (it is opt-in). The final run had the phase set, so it also ran and passed (276 s) and produced the committed AFTER set. That makes 12/12 passed in that run.

**Why the tests ran on a second simulator.** The simulator named in the brief (`028BFDCC…`) was in use by another session running a different app ("Tippy") while I worked. My first UI-test run there stalled, so I created a dedicated iPhone 17 Pro / iOS 26.2 simulator, `UIPass iPhone 17 Pro` (`4E8850F7-8AA4-4FE5-B85E-1EDA6442F961`), for every test and screenshot run. The Debug and Release builds used the requested destination. Delete the extra simulator with `xcrun simctl delete 4E8850F7-8AA4-4FE5-B85E-1EDA6442F961` when you're done.

**No test was deleted or weakened.** The existing tests needed no changes. The photo chip label changed from "has-photo" to "with photo", but the test queries the row label "Has photo", which is unchanged, and the chip was deliberately kept distinct from it.

**How the screenshots were captured.** The procedure is written up in the `UIPassScreenshotTests` header.

- Output goes to `/tmp` because this checkout lives under `~/Documents`. That folder is privacy-protected, and a simulator test runner writing there blocks on a permission prompt no one can answer.
- Every PNG is also a named XCTAttachment. I pulled them out with `xcrun xcresulttool export attachments`.
- On this runtime, `XCUIDevice.shared.appearance = .dark` was silently ignored when the simulator started in light: the first BEFORE run produced 18 "dark" files that were light. Starting the simulator dark (`xcrun simctl ui <id> appearance dark`) made the light → dark switch reliable. Both committed sets were captured that way.
- The BEFORE set was built from sources byte-identical to `HEAD`. I had parked my first edits and reverted them, and `git status` showed only the new test file.

## 7. Review

`grok-review` couldn't run: the headless session isn't allowed to call it. Instead, an independent Claude subagent reviewed the diff read-only. It found **no blocking regressions**; all the must-keep behaviours and test identifiers were intact. Its findings and what I did about each:

1. **The appearance test pinned the setting with a launch arg and asserted weakly.** Fixed: no pinning arg, it asserts the picker's value for Dark and then System, and it restores System at the end.
2. **White text on the dark accent was ≈3.4:1.** Fixed: the dark accent is now `#16808A` (≈4.7:1).
3. **The "clear" chip appearing at the front shifted every other chip.** Fixed: it is always present and disabled when unused.
4. **Accessibility text sizes could overflow the badge and label rows.** Fixed: last-resort layouts in `RouteRow` and `BadgeRow` (down to "+N" alone).
5. **`.toolbarColorScheme` was outside the viewer's `NavigationStack`.** Fixed: moved inside.
6. **Switching Dark → System might not revert until relaunch on some iOS versions.** Not verified visually; see known issues.

## 8. Known remaining issues

- **The map raster is light in dark mode.** The OSM tiles are pre-rendered bitmaps. Darkening them would mean recolouring 215 bundled tiles or filtering every tile at runtime; neither was in scope, and neither is a small, safe change. The pin titles are now legible, and the chrome over the map is dark.
- **Liquid Glass buttons on the map adapt to what's behind them.** In dark mode "Unmapped" (over light sea) renders light while "Fit island" renders dark. This is system behaviour and I didn't override it.
- **Route rows are taller when the sector wraps.** On a 402 pt-wide phone most sectors now drop to a second line. That was the trade-off for not truncating the style badge and photo label.
- **Very large accessibility text sizes** were not screenshot-tested. `RouteRow` and `BadgeRow` have last-resort layouts for them, but I haven't seen them rendered at AX5.
- **Appearance → System after Dark** is covered for the stored value by the UI test, but I haven't confirmed on screen that the app returns to the system appearance without a relaunch. `.preferredColorScheme(nil)` has had that quirk in some past iOS releases. A 10-second manual check is worth doing.
- The routes "empty" shot doesn't show an empty state. The launch-arg filter set I chose still matches routes, and I kept it identical in both runs so the pairs stay comparable.
- `native/build/` shows as untracked in `git status` in this checkout; it isn't git-ignored here. Don't add it. It holds derived data, logs and the exported attachments.

## 9. Rating prompt (StoreKit)

Apple's standard rating sheet, requested with SwiftUI's `@Environment(\.requestReview)`. There is no custom pre-prompt, no incentive and no "rate us" button.

**What triggers it.** All of these must hold:

- The user has opened at least 3 **distinct** crag or route details, ever. They are counted as `crag:<slug>` or `route:<crag|name>`, and reopening one doesn't count again.
- There have been at least 2 sessions, so it never fires on first launch or in the first session. A session starts when `scenePhase` becomes `.active` after launch or after the app was in the background. The inactive → active blips from Control Center or the app switcher don't count; this is deliberately stricter than counting every `.active`.
- The user comes **back** to a resting screen: the Map with no sheet up, or the Crags or Routes list root with no pushed detail and no focused search. Only that screen's own rest state going false → true counts. Launching, or switching tabs onto a screen, never triggers it. A detail must also have closed in the last 10 s.
- After a 1.5 s settle delay, the conditions are checked again: no detail on screen, no first-run About sheet, the scene is active, and no "Show on map" / "Open in Routes" jump in the last 4 s (a sheet closed by one of those jumps is navigation, not a return). Leaving the resting state or the screen during the delay cancels the attempt. The return is marked handled only once the wait completes, because SwiftUI also restarts `.task` on the appear/disappear that follows a sheet dismissal or a pop.
- The app hasn't already asked in this `CFBundleShortVersionString`.

**Once per version.** `markPrompted()` stores the version that asked. The counts are not reset, so the next version asks once more, at the next return from a detail. That policy is tested. Apple also caps the sheet at 3 a year, and it never shows in TestFlight builds.

**Where the code lives.**

- `native/KohTaoClimbing/Sources/ReviewPromptTracker.swift`: the threshold logic, with `UserDefaults` and the app version injected. Keys: `reviewPrompt.viewedDetails`, `reviewPrompt.sessionCount` and `reviewPrompt.lastPromptedVersion`.
- `native/KohTaoClimbing/Sources/ReviewPromptCoordinator.swift`: session and detail bookkeeping, the resting-screen gate, and the `.reviewPromptDetail(_:)` and `.reviewPromptRestingScreen(isResting:)` modifiers.
- Hooks: `RootTabView` (scene phase, About sheet, environment), `CragDetailView`, `RouteDetailView`, and the `MapTabView`, `CragsTabView` and `RoutesTabView` roots.

**How tests disable it.** It is off when the app is launched with `-disableReviewPrompt`, or when `XCTestConfigurationFilePath` is set (unit tests hosted in the app). Every existing UI test and the screenshot test pass `-disableReviewPrompt`. When it's disabled, nothing is recorded either.

**How UI tests observe it (probe).** Apple's sheet is out of process, and StoreKit may suppress it, so the UI tests don't assert on Apple's UI. With `-reviewPromptProbe`, the coordinator counts its own `requestReview()` calls. A 1×1 accessibility element with identifier `reviewPromptRequested` carries the count as its label and the last decision as its value ("asked", "cancelled", "1 detail(s) on screen", …). The element is on the root and on every detail, so it is readable with or without a sheet up. Without the argument the element is never rendered and nothing is counted. `requestReview()` is called on exactly the same path either way. The tests seed eligibility with argument-domain defaults (`-reviewPrompt.sessionCount 5` and so on), which override stored values on every read, so each run starts eligible. `-reviewPromptSettleDelay <s>` lengthens the delay for the cancellation test.

The `-initialCrag` and `-selectCrag` launch hooks are now one-shot. They ran in `onAppear`, which fires again when the Crags list reappears after a pop or the map reappears after its sheet closes, so they re-pushed the detail or reopened the sheet. That is what cancelled every attempt in the first probe runs. They still only act when their launch argument is present.

**Version bump.** `native/project.yml` went from `MARKETING_VERSION "0.1"` / `CURRENT_PROJECT_VERSION "3"` to **`"1.0.5"` / `"8"`**. `Info.plist` already reads both from `$(MARKETING_VERSION)` and `$(CURRENT_PROJECT_VERSION)`, so it is unchanged. The built Debug and Release `.app` Info.plists both show `CFBundleShortVersionString = 1.0.5` and `CFBundleVersion = 8` (`plutil -p`). No branch, tag or doc used 1.0.5 or build 8; the last shipped binary is 1.0.4 (7). `IMPROVEMENTS.md` item 4 (align to `1.0.2`, don't bump the build) predates that release and is now superseded.

**Test results** (simulator `4E8850F7-…`, iPhone 17 Pro, iOS 26.2): Debug and Release builds **SUCCEEDED**; `xcodebuild test` **TEST SUCCEEDED**.

Final full-scheme run: 30 tests, 29 passed, 1 skipped, 0 failed.

- XCTest: 22/22 passed. That is 7 `DataStoreTests` plus 15 new `ReviewPromptTrackerTests`: the 7 threshold cases from the brief, the disable switch, the probe switch, and 6 for the coordinator's gates (including the quiet period after "Show on map").
- XCUITest: 7 passed, and 1 skipped by design (`UIPassScreenshotTests` is opt-in). The 3 new `ReviewPromptUITests`, all using the probe:
  - `testRatingPromptRequestedAfterClosingMapCragSheet`: marker at 0 for 4 s while the sheet is up, 1 after Done, and it stays at 1.
  - `testNoRatingPromptWhenSwitchingTabsAwayFromDetail`: marker at 0 for 6 s after switching tabs away from a pushed detail.
  - `testNewDetailDuringDelayCancelsPromptUntilNextReturn`: go back to the list, then open `cragRow-meks-mountain` within a 6 s delay. The marker stays at 0 for 9 s, then reaches 1 after the next return.
- The screenshot test in capture mode was not re-run for this change; that run needed an approval this session couldn't get. It launches with `-disableReviewPrompt` like the other UI tests.
- Note for manual testing: the probe tests really call `requestReview()` and write `lastPromptedVersion = 1.0.5` into the test simulator's defaults, so a manual run on `4E8850F7-…` won't prompt again for 1.0.5 until the app is reinstalled.

## 10. Photo & source attribution

Version stays 1.0.5 (8). No image and no photos.json entry was removed or moved.

**Permission.** Nic has asked Goodtime Adventures for permission to use their guidebook images. Until they reply, all 179 Goodtime images and all 29 "all rights reserved" photos stay bundled, with their entries, and each one is credited in the viewer with a link to its source.

### What each item became

1. **Goodtime credit in the viewer.** There is one full-screen viewer, `PhotoViewerSheet`. Crag detail, the crag gallery, report galleries and the Community photo grid all open it. Under the caption, every guide image now shows "From Koh Tao Rock Climbing & Bouldering Guide by Goodtime Adventures (v1/14), p.N" and a "Guidebook PDF (railay.com)" link to the PDF.
2. **Credit, licence and link for other photos.** The same panel shows the author ("© Brian Ways"; no © on CC0), the licence ("CC BY-SA 4.0", or "All rights reserved" for the long "user-contributed, all rights reserved — …" value) and a tappable `sourceUrl` link labelled by site: Mountain Project, Flickr, Wikimedia Commons, Rakkup, Mapo Tapo, Rock+Run or Tumblr. Before this change the source link was never shown.
3. **Route source labels.** Route detail → Source now shows plain words. The raw values in routes.json are `guidebook` (Goodtime Adventures guidebook (PDF)), `27crags` (27crags / The Topo; 247 routes), `mountainproject` (Mountain Project) and `vault` (Vault note; 1 route, the same label the web app uses). `thecrag` is mapped too, but no route uses it. Any other value falls back to the raw string. The existing link is kept; it reads "Open the guidebook PDF" when it points at the PDF.
4. **About and Sources.**
   - The false "Photos are contributed by members of the Koh Tao climbing community…" text on About now says that photos and topos come from the Goodtime guide (credited, used with thanks) and from public sources credited on each photo, and that route data comes from the Goodtime guidebook and public databases (27crags / The Topo, Mountain Project, theCrag).
   - About and Sources both show a Goodtime credit: title, publisher, edition and the PDF link.
   - Sources has a new **Photo credits** list, built from photos.json at runtime (`PhotoCredits.sources`). It starts with the Goodtime guide and its image count (179), then each site with its photo count, then each author with licence, photo count and the source link. Authors with several photos open a list of links, one per photo.
5. **Text claims:** see the table below.

Code: `Sources/Attribution.swift` is new: `GoodtimeGuide`, `PhotoCredit`, `LicenseLabel`, `SourceHost`, `RouteSourceLabel` and `PhotoCredits`. The views are `PhotoCreditLine` in `CragDetailView.swift` and `GoodtimeCreditRow` in `AboutGuideView.swift`; `PlanTabView.swift` (Sources) and `RoutesTabView.swift` (route source) use them.

### Where the credit and page data comes from

- **PDF URL, title, publisher, edition:** the Goodtime entry in `info.json` guidebooks. The title is "Koh Tao Rock Climbing & Bouldering Guide (free PDF)", the author starts "Goodtime Adventures", the year is "v1/14", and the url is `http://www.railay.com/railay/climbing/KT-Climbing-guide-1.14-sm.compressed.pdf`. The same URL is in `sources.json`, `GUIDE-ALLOWLIST.json` and `archive/pdfs/README.md`. `AttributionTests.testGoodtimeConstantsMatchInfoJson` fails if the Swift constants drift from info.json.
- **Page:** the existing `page` field on each photos.json guide entry. If it were missing, the code would fall back to the `p{NN}-` filename prefix, which `app/src/data/photos.ts` documents as "the p{page} file prefix = PDF page number". These are PDF page numbers, not printed page numbers.
- **All 179 of 179 guide images have a page. 0 do not.** The test also checks that each `page` equals its filename prefix. photos.json was **not** edited to add fields: everything is derived in code.
- **Credit, licence and link for the other photos:** the existing `credit`, `license` and `sourceUrl` fields in photos.json. All 72 community entries have all three.

### Text claims changed

| File | Before | After |
|---|---|---|
| `info.json` gearAndSafety.bolts | "The Thaitanium Project has rebolted the vast majority of popular routes in the main areas with titanium glue-ins (role verified 2026-08-02; its current activity level is unverified — last dated rebolting evidence Oct 2024). Inspect before trusting, …" | "Mountain Project reports titanium rebolting on many popular routes (the Thaitanium Project); current status unconfirmed. Inspect bolts before trusting them, …" The Mountain Project stainless-bolt warning and "ask the Koh Tao Climbing Club" are kept. |
| `info.json` ethics.fullerPicture | "Support the stewards. Renting gear or booking a day with Goodtime Adventures / The Bunker funds the people maintaining routes; the Thaitanium Project rebolting work runs on community donations." | "Support the stewards. Rent gear or book a day with Goodtime Adventures / The Bunker, and ask them, local climbers or the Koh Tao Climbing Club about current route and bolt condition." The unsupported donation claim is gone. |
| `info.json` 27crags guidebook note | "The bouldering reference: 258 problems … (deep fetch 2026-08-04). Topo images and descriptions are paywalled (Premium). …" | "The bouldering reference. This app's list data (258 problems …, fetched 2026-08-04) comes from the free 27crags / The Topo pages. The Thai-Climb topo images are Premium and are not included in this app. …" |
| `crags.json` Jansom Bay details | "Near-coast hardware: verify bolt condition before trusting (Thaitanium rebolting context)." | "Near-coast hardware: verify bolt condition before trusting. Mountain Project reports Thaitanium rebolting on Koh Tao; current status at this crag unconfirmed." The source is `sources.json` "Mountain Project — Thailand", used for "Thaitanium Project rebolting context". |
| `crags.json` Golden View details | "MP reports “Mostly Thaitanium bolted routes!” — good current bolt condition." | "According to Mountain Project, “Mostly Thaitanium bolted routes!” — bolt condition reported as good." |

Follow-up: the web app's source files (`app/src/data/info.ts`, `app/src/data/climbing.ts`) still carry the old wording. `work/export-data.mjs` regenerates these JSONs from them, so a re-export would undo the five fixes above unless the same edits are made there. The web app was out of scope for this pass.

### Image counts: before = after

| | Before | After |
|---|---|---|
| Files in `AppResources/Images/guide` | 179 | 179 |
| Files in `AppResources/Images/community` | 72 | 72 |
| photos.json `guide` entries (no licence field) | 179 | 179 |
| photos.json community entries, CC licences (CC BY/BY-SA/BY-NC/…/CC0) | 43 | 43 |
| photos.json community entries, "all rights reserved" | 29 | 29 |
| Total files / entries | 251 / 251 | 251 / 251 |

`AttributionTests.testBundledImageAndEntryCountsUnchanged` checks these numbers against the built app bundle.

### Tests and screenshots

- New unit tests (`AttributionTests`, 12): the route-source labels (known values, the unknown fallback, and every value in routes.json labelled), the Goodtime credit with and without a page, the filename-page fallback, the constants against info.json, every guide image getting the Goodtime credit with a page, every photo with a `sourceUrl` getting an author, licence and link, the licence and host labels, the credits list covering all 72 community photos, and the inventory counts.
- New UI tests (`PhotoCreditUITests`, 3): the Goodtime credit and PDF link in the viewer, the Mountain Project credit ("© Brian Ways", "All rights reserved", Mountain Project link) in the viewer, and the Sources photo credits list.
- The screenshot test gained three shots: `photo-viewer-credit`, `photo-viewer-credit-mp` and `sources-credits`. They were captured light and dark to `/tmp/uipass/attrib/`. Copying them into `docs/ui-pass/after/` was blocked in the session that made this change; to copy them, run `cp /tmp/uipass/attrib/{photo-viewer-credit,photo-viewer-credit-mp,sources-credits,about}-{light,dark}.png docs/ui-pass/after/`.
