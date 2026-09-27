# Shipping and Sign in with Apple audit

Date: 27 Sep 2026 (ICT). Read-only audit of branch `fix/dq-002-b1-dual-nulls` @ `613d845`, plus every remote branch and PR head (`origin/*`, `refs/pull/1..6`). This file is the only change.

## 1. App Store submission process

### What the repo documents

The repo has no fastlane, no ExportOptions plist, no xcconfig, no `.entitlements`, no `ci_scripts/` (Xcode Cloud), no `.github/workflows/`, and no shipping scripts. `native/KohTaoClimbing.xcodeproj/` is generated and gitignored (`native/.gitignore:2`). All the shipping material in the repo is listed below:

| What | Where |
|---|---|
| Generate the project with XcodeGen: `cd native && xcodegen generate` | `README.md:40-51`, `native/project.yml:1-2` |
| "App Store distribution needs … signing configured in Xcode … then a Release archive uploaded via Xcode's organizer." That is the whole written upload process. | `README.md:61-63` |
| Bundle id `com.kohtaoclimbing.guide`, team `JAT5L64V29`, automatic signing | `native/project.yml:41,49-50` |
| Comment says "Xcode Cloud manages signing". No Xcode Cloud config is in the repo. | `native/project.yml:48` |
| Versions in the repo: `MARKETING_VERSION "0.1"`, `CURRENT_PROJECT_VERSION "3"`. Info.plist reads both from these build settings. | `native/project.yml:46-47`, `native/KohTaoClimbing/Info.plist:19-22` |
| Export compliance: `ITSAppUsesNonExemptEncryption = false` | `native/KohTaoClimbing/Info.plist:23-24` |
| Privacy manifest (no tracking, no data collected) | `native/project.yml:28-30`, `native/KohTaoClimbing/PrivacyInfo.xcprivacy` |
| Bundled data is regenerated with `node work/export-data.mjs` (`work/` is gitignored) | `README.md:57-59` |
| Current status line: live `READY_FOR_SALE` review `717f4a17`, ASC slot 1.0.2 / build 7, CFBundle 1.0.4 from `e08edbd`, ASC app 6798921403 | `IMPROVEMENTS.md:5,7` |
| Todo: align `MARKETING_VERSION` (still 0.1) with the store version. Don't bump the build and don't archive. | `IMPROVEMENTS.md:16` |
| "Do not archive/upload to TestFlight or App Store from this list." | `IMPROVEMENTS.md:7,13,16,25` |
| Roles: "product agent ships TF/ASC". Nic gives feedback only. | `DATA-QUALITY.md:3`, `map-routes-filter-ux-spec.md:3,126,133` |
| No ad spend without Nic's yes. Nothing is written about approving App Store submissions. | `MARKETING.md:3` |

Version history from commits: `0cc0074` TestFlight 0.1 (1), 23 Aug → `b8250b7` Guideline 4.3 resubmit, build 2 → `8852fb8` 4.3 build 3 → 1.0.1 (4) live around 18 Sep (`bd0ae2f` message) → `5f11bcc` 1.0.3 → `e08edbd` 1.0.4. `e08edbd`'s message says "Release build green; all 10 tests pass" (unit tests are `native/KohTaoClimbing/Tests/DataStoreTests.swift`, UI tests are `native/KohTaoClimbing/UITests/MapTapRoutesUITests.swift`).

The version in the project is 0.1 (3) on every branch (main is 0.1 (1)). The shipped 1.0.4 (7) is not recorded anywhere in the repo. The version and build must be set outside git at archive time, either with xcodebuild overrides or with edits in the build checkout. How that is done isn't written down.

Stale or conflicting docs:
- `README.md:67-70` says GitHub Actions `deploy.yml` publishes the website. That workflow is not in the repo. `.kimi-code/skills/deploy/SKILL.md:14` says it's parked in the gitignored `work/`.
- `.kimi-code/skills/deploy/SKILL.md:14` says "Never push via SSH … Always push over HTTPS". Current bench practice is the opposite: HTTPS gh tokens on Mini 3 are invalid, so pushes go over SSH with `id_ghcapy`. That skill covers the website, not iOS.
- `MARKETING.md:6,32` still says the listing is at 1.0.1.
- `IMPROVEMENTS.md:5,13` gives the branch tip as `877a906`. It is now `613d845`, one daily docs commit later.

### Bench process (not in the repo)

1. The "app manager" agent works on Mac Mini 3 (Tailscale `mac-mini-3-1`). It archives (Release), exports, and uploads to App Store Connect, then sends the build to TestFlight.
2. It submits the version for review in ASC only after Nic gives an explicit yes. No App Store submit happens without that.
3. Now: build 7 (CFBundle 1.0.4, `e08edbd`) is live in ASC version slot 1.0.2. Review `717f4a17` was approved and has been `READY_FOR_SALE` since about 01:34 ICT on 21 Sep 2026.
4. In progress: a light/dark mode build (Claude Code, in the Mini's main checkout). It goes to TestFlight first. It is not on any pushed branch yet.
5. Pushes go to `git@github.com:capyreadonly/koh-tao-climbing.git` with `GIT_SSH_COMMAND='ssh -i ~/.ssh/id_ghcapy -o IdentitiesOnly=yes'`. The GitHub MCP can read but can't open PRs. `main` (`0cc0074`, 23 Aug) is stale. PR #6 is still at `5f11bcc`.

Gap: none of steps 1-5 are written in the repo. The archive/export/upload commands, the export method, how the version and build are set, and the Nic-approval gate for submission are all undocumented.

## 2. Sign in with Apple

**The app has never had Sign in with Apple, or any login at all.**

Evidence (all remote branches and PR heads, 78 commits):
- `git log --all -S` finds 0 commits containing `AuthenticationServices`, `ASAuthorization`, `ASAuthorizationAppleIDProvider`, `SignInWithAppleButton`, `com.apple.developer.applesignin`, `getCredentialState`, or `credentialRevokedNotification`.
- No `*.entitlements` file has ever been committed on any branch (`git log --all -- '*.entitlements'` is empty). `native/project.yml` has no `CODE_SIGN_ENTITLEMENTS` key and no capabilities block (`native/project.yml:39-50`). The `.pbxproj` is generated and never committed, and it has no source for an Apple Sign In capability.
- Searching `native/` on every branch for auth terms (sign in, login, sign out, Keychain, AuthenticationServices …) finds only the word "signing" in the `native/project.yml:48` comment.
- The app launches straight into the content tabs with no auth gate: `native/KohTaoClimbing/Sources/KohTaoClimbingApp.swift:3-9` (`@main` → `RootTabView`). The only persisted state is UI state, such as `@AppStorage("didShowAboutGuide")` at `KohTaoClimbingApp.swift:23` and the map camera (`MapCameraStore`, per `e08edbd`). No user id or credential is stored anywhere.
- The privacy manifest says no data is collected (`native/project.yml:28`). The app is an offline bundled guide.

Nothing was removed or broken, because nothing ever existed. "Can a user log in again via Sign in with Apple?" doesn't apply: there is no sign-in, no completion handler, no stored credential, no `getCredentialState` check at launch, no sign-out, and no revocation observer. There is no path to compare across branches and no Release entitlement to confirm.

Verified by code and git history: everything above. Needs a manual device check: nothing about auth. On a device you would just see the app open with no login screen. If Sign in with Apple is expected, it is probably a different app, or uncommitted work on the Mini that this audit can't see.
