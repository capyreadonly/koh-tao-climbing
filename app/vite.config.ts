import path from "path"
import { fileURLToPath } from "url"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
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
