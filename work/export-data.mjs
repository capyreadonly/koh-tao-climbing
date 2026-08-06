// Export the web app's data layer to pretty JSON + copy binary assets for the
// native SwiftUI app (native/KohTaoClimbing/AppResources). Phase A of the native port.
//
//   node work/export-data.mjs
//
// Uses the esbuild already installed in app/node_modules to bundle each
// app/src/data/*.ts file to ESM, dynamically imports the bundles, and dumps:
//   native/KohTaoClimbing/AppResources/Data/{crags,routes,photos,reports,info,services,sources}.json
// and copies (filenames preserved — they are referenced from the JSON `file` fields):
//   app/public/images/guide/*     -> native/KohTaoClimbing/AppResources/Images/guide/
//   app/public/images/community/* -> native/KohTaoClimbing/AppResources/Images/community/
//   app/public/tiles/{z}/{x}/{y}.png -> native/KohTaoClimbing/AppResources/Tiles/{z}/{x}/{y}.png
//
// Path note: JSON `file` fields are rewritten from the web layout ("images/guide/x.jpg")
// to the bundle layout ("Images/guide/x.jpg") so Swift can resolve them directly under
// AppResources/ without case-sensitivity surprises on device (iOS APFS is case-sensitive).
// The bundle folder is named AppResources (NOT Resources): a top-level Resources/
// folder in an iOS .app breaks installd ("Missing bundle ID", IXErrorDomain 13).

import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync, readdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const appDir = path.join(root, 'app')
const outResources = path.join(root, 'native', 'KohTaoClimbing', 'AppResources')
const outData = path.join(outResources, 'Data')
const esbuild = path.join(appDir, 'node_modules', '.bin', 'esbuild')

if (!existsSync(esbuild)) {
  console.error(`esbuild not found at ${esbuild} — run npm install in app/ first`)
  process.exit(1)
}

const work = mkdtempSync(path.join(tmpdir(), 'kt-export-'))

// Bundle a TS data file to ESM and import it.
const importDataFile = (name) => {
  const entry = path.join(appDir, 'src', 'data', `${name}.ts`)
  const out = path.join(work, `${name}.mjs`)
  execFileSync(esbuild, [entry, '--bundle', '--format=esm', '--platform=neutral', `--outfile=${out}`], {
    stdio: 'pipe',
  })
  return import(pathToFileURL(out).href)
}

// Rewrite web asset paths ("images/...") to bundle paths ("Images/...").
const bundlePath = (p) => (typeof p === 'string' ? p.replace(/^images\//, 'Images/') : p)

const writeJSON = (name, value) => {
  const file = path.join(outData, name)
  writeFileSync(file, JSON.stringify(value, null, 2) + '\n')
  const count = Array.isArray(value) ? value.length : Object.keys(value).length
  console.log(`  Data/${name}: ${count} entries`)
}

console.log('Bundling data sources…')
const [climbing, routesMod, photosMod, reportsMod, infoMod] = await Promise.all([
  importDataFile('climbing'),
  importDataFile('routes'),
  importDataFile('photos'),
  importDataFile('reports'),
  importDataFile('info'),
])

mkdirSync(outData, { recursive: true })
console.log('Writing JSON…')

writeJSON('crags.json', climbing.crags)
writeJSON('routes.json', routesMod.routes)
writeJSON('photos.json', {
  guide: photosMod.guidePhotos.map((p) => ({ ...p, file: bundlePath(p.file) })),
  community: photosMod.communityPhotos.map((p) => ({ ...p, file: bundlePath(p.file) })),
})
writeJSON(
  'reports.json',
  reportsMod.reports.map((r) => ({ ...r, photos: r.photos?.map(bundlePath) })),
)
writeJSON('info.json', {
  gettingThere: infoMod.gettingThere,
  seasons: infoMod.seasons,
  gearAndSafety: infoMod.gearAndSafety,
  ethics: infoMod.ethics,
  itineraries: infoMod.itineraries,
  guidebooks: infoMod.guidebooks,
})
writeJSON('services.json', climbing.services)
writeJSON('sources.json', climbing.sources)

console.log('Copying assets…')
const copies = [
  [path.join(appDir, 'public', 'images', 'guide'), path.join(outResources, 'Images', 'guide')],
  [path.join(appDir, 'public', 'images', 'community'), path.join(outResources, 'Images', 'community')],
  [path.join(appDir, 'public', 'tiles'), path.join(outResources, 'Tiles')],
]
for (const [from, to] of copies) {
  rmSync(to, { recursive: true, force: true })
  mkdirSync(path.dirname(to), { recursive: true })
  cpSync(from, to, { recursive: true })
  const n = readdirSync(from).length
  console.log(`  ${path.basename(to)}: ${n} entries`)
}

// Sanity: every photo file referenced in the JSON must exist under Resources/.
let missing = 0
const allPhotos = [...photosMod.guidePhotos, ...photosMod.communityPhotos]
for (const p of allPhotos) {
  const rel = bundlePath(p.file)
  if (!existsSync(path.join(outResources, rel))) {
    console.error(`  MISSING asset for ${p.file}`)
    missing++
  }
}
for (const r of reportsMod.reports) {
  for (const f of r.photos ?? []) {
    if (!existsSync(path.join(outResources, bundlePath(f)))) {
      console.error(`  MISSING report asset ${f}`)
      missing++
    }
  }
}

rmSync(work, { recursive: true, force: true })
console.log(
  `\nDone: ${climbing.crags.length} crags, ${routesMod.routes.length} routes, ` +
    `${photosMod.guidePhotos.length} guide + ${photosMod.communityPhotos.length} community photos, ` +
    `${reportsMod.reports.length} reports, ${climbing.services.length} services, ${climbing.sources.length} sources. ` +
    (missing ? `${missing} MISSING ASSETS — see above.` : 'All referenced assets present.'),
)
process.exit(missing ? 1 : 0)
