import { fileURLToPath, URL } from 'node:url';
import { VitePWA } from 'vite-plugin-pwa';
import manifest from './manifest.js';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';

export default defineConfig({
  build: {
    outDir: '../server/public',
    emptyOutDir: false,
  },
  server: {
    host: true,
    port: 8080,
  },
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    VitePWA({
      manifest,
      includeAssets: ['**/*.{js,css,html,ico,jpg,png,svg,ttf,jpeg}'],
      workbox: {
        mode: 'development',
        runtimeCaching: [
          {
            urlPattern: '/notes',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'NotesCache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 1,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: new RegExp('^http://localhost:3000/notes'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'NotesApiCache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 1,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'noteImages',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),

    quasar({
      sassVariables: 'src/quasar-variables.sass',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  preview: {
    port: 4175,
    // proxy: {
    //   '/': {
    //     target: 'http://localhost:3000/',
    //     changeOrigin: true
    //   },
    // },
  },
});
