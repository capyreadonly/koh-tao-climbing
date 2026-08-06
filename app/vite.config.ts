import path from "path"
import { fileURLToPath } from "url"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"

const dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    // PWA: installable app shell with offline caching. Precaches JS/CSS/HTML
    // (+ woff2 fonts via includeAssets); images and the self-hosted map tiles
    // are runtime-cached CacheFirst — they are static same-origin assets.
    // registerType autoUpdate: new deploys swap the SW and refresh automatically.
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['fonts/*.woff2', 'icons/*.png'],
      manifest: {
        name: 'Koh Tao Climbing Guide',
        short_name: 'KT Climbing',
        description:
          'The complete climbing guide for Koh Tao, Thailand — every crag, route, season tip and access rule, fact-checked against 2026 sources.',
        theme_color: '#ffffff',
        background_color: '#fafaf9',
        display: 'standalone',
        // Relative URLs so the app works under any subpath (GitHub Pages
        // serves it at /koh-tao-climbing/).
        start_url: './',
        scope: './',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // App shell precache (images/tiles are too many — runtime-cached instead).
        globPatterns: ['**/*.{js,css,html,woff2}'],
        // The main JS bundle is ~2.5 MB (leaflet + radix); allow precaching it.
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        runtimeCaching: [
          {
            // Guide + community photos (static same-origin files).
            urlPattern: /\/images\/.+\.(?:jpg|jpeg|png|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'kt-images',
              expiration: { maxEntries: 400, maxAgeSeconds: 60 * 60 * 24 * 90 },
            },
          },
          {
            // Self-hosted OSM tiles.
            urlPattern: /\/tiles\/.+\.png$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'kt-map-tiles',
              expiration: { maxEntries: 2000, maxAgeSeconds: 60 * 60 * 24 * 90 },
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: 3000,
    // fsevents (chokidar native watching) deadlocks on this machine (macOS 26.5);
    // polling keeps HMR working reliably.
    watch: {
      usePolling: true,
      interval: 300,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(dirname, "./src"),
    },
  },
});
