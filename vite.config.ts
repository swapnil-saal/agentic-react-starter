/// <reference types="vitest/config" />
import { readFileSync } from 'node:fs'
import path from 'node:path'

import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The app's display name comes from package.json, so the project has exactly
// one name and it cannot drift between the manifest, the <title> and the UI.
const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
) as { name: string }

const APP_NAME = pkg.name
  .split('-')
  .map((word) => word[0].toUpperCase() + word.slice(1))
  .join(' ')

// https://vite.dev/config/
export default defineConfig({
  define: { __APP_NAME__: JSON.stringify(APP_NAME) },
  plugins: [
    // Keep the browser tab title in step with the project name too.
    {
      name: 'app-name-title',
      transformIndexHtml: (html: string) =>
        html.replace(/<title>.*?<\/title>/, `<title>${APP_NAME}</title>`),
    },
    // Must run before the React plugin so generated routes are transformed.
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    // Playwright specs live in e2e/ and are driven by @playwright/test.
    exclude: ['**/node_modules/**', '**/dist/**', 'e2e/**'],
  },
})
