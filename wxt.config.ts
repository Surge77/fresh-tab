import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'FreshTab',
    description: 'A fast, customizable new-tab dashboard. Local-only, zero host permissions.',
    permissions: ['storage'],
  },
  // FreshTab collects no data; silence WXT's Firefox data-collection notice.
  // The AMO listing still declares "no data collection" at submission time.
  suppressWarnings: {
    firefoxDataCollection: true,
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
