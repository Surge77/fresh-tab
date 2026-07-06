import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: ({ browser }) => ({
    name: 'FreshTab',
    description: 'A fast, customizable new-tab dashboard. Local-only, zero host permissions.',
    permissions: ['storage'],
    // Firefox (AMO) requires an explicit data-collection declaration since
    // 2025-11-03. FreshTab collects nothing → 'none'. gecko.id keeps the AMO
    // listing stable across re-uploads. Gecko-only keys; Chromium ignores them.
    ...(browser === 'firefox'
      ? {
          browser_specific_settings: {
            gecko: {
              id: 'freshtab@surge77.github.io',
              data_collection_permissions: { required: ['none'] },
            },
          },
        }
      : {}),
  }),
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
