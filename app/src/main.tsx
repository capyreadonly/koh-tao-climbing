import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import { ThemeProvider } from 'next-themes'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'

// Importing virtual:pwa-register suppresses vite-plugin-pwa's auto-injected
// registerSW.js script tag, so registration only happens here. Skip it on
// non-http(s) origins (e.g. file:// or a webview's custom scheme) where SW
// registration is unsupported.
if (location.protocol === 'http:' || location.protocol === 'https:') {
  registerSW({ immediate: true })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* attribute="class" flips .dark on <html> (Tailwind darkMode: 'class');
        the inline script in index.html applies the class before first paint. */}
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <HashRouter>
        <App />
      </HashRouter>
    </ThemeProvider>
  </StrictMode>,
)
