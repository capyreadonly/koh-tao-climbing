---
name: deploy
description: Build the Koh Tao climbing guide and publish it to GitHub Pages (gh-pages branch flow)
whenToUse: When the user asks to deploy, publish, push the site live, or update the live website
type: prompt
---

# Deploy the Koh Tao climbing guide

Live site: https://capyreadonly.github.io/koh-tao-climbing/ — repo: https://github.com/capyreadonly/koh-tao-climbing

## Why gh-pages branch (not GitHub Actions)

The capyreadonly token lacks the `workflow` scope, so `.github/workflows/deploy.yml` cannot be pushed. Deployment uses a force-pushed `gh-pages` branch containing the built `dist/`. The Actions workflow is parked at `work/deploy.yml.disabled` — if the user later runs `gh auth refresh -s workflow`, restore it and switch to Actions deploys. Never push via SSH: the local SSH key belongs to another GitHub account (thanakijwanavit). Always push over HTTPS with the gh credential helper.

## Steps (project root = the directory containing app/)

1. Build: `cd app && npm run build` — must exit 0.
2. Sanity: `node work/verify-images.mjs` — expect 0 missing.
3. Deploy the built site:
   ```sh
   rm -rf work/ghpages && mkdir -p work/ghpages && cd work/ghpages
   git init -q -b gh-pages && cp -R ../../app/dist/* . && touch .nojekyll
   git add -A && git -c user.name="koh-tao-guide" -c user.email="noreply@users.noreply.github.com" commit -qm "Deploy: <what changed>"
   git -c credential.helper= -c credential.helper='!gh auth git-credential' push -qf https://github.com/capyreadonly/koh-tao-climbing.git gh-pages
   ```
4. Commit the source to main (work/, vault/, node_modules, dist are gitignored):
   ```sh
   cd <project root> && git add -A && git commit -m "<message>"
   git -c credential.helper= -c credential.helper='!gh auth git-credential' push -q https://github.com/capyreadonly/koh-tao-climbing.git main
   ```
5. Verify the release: note the fresh `app/dist/assets/index-*.js` hash, then poll (legacy Pages build takes 1–3 min):
   ```sh
   curl -s https://capyreadonly.github.io/koh-tao-climbing/ | grep -o 'assets/index-[^"]*\.js'
   ```
   until it shows the new hash. Also curl one image, e.g. `images/guide/p01-0-X0.jpg`, expect 200.

## Gotchas

- vite `base: './'` + HashRouter are deliberate — do not "fix" them; they make the site work under the `/koh-tao-climbing/` subpath.
- Image srcs must go through `imgSrc()` in `app/src/lib/photo.ts` (prefixes `import.meta.env.BASE_URL`).
