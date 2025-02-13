// vite.config.js
import { fileURLToPath, URL } from "node:url";
import { VitePWA } from "file:///D:/Notesphere/Client/node_modules/vite-plugin-pwa/dist/index.js";

// manifest.js
var manifest_default = {
  name: "Notesphere",
  short_name: "Notesphere",
  start_url: "/",
  display: "standalone",
  background_color: "#C10015",
  lang: "de",
  scope: "/",
  theme_color: "#16155a",
  id: "/",
  icons: [
    { src: "/icons/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" },
    { src: "/icons/web-app-manifest-512x512.png", sizes: "512x512", type: "image/png" }
  ]
};

// vite.config.js
import { defineConfig } from "file:///D:/Notesphere/Client/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/Notesphere/Client/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { quasar, transformAssetUrls } from "file:///D:/Notesphere/Client/node_modules/@quasar/vite-plugin/src/index.js";
var __vite_injected_original_import_meta_url = "file:///D:/Notesphere/Client/vite.config.js";
var vite_config_default = defineConfig({
  build: {
    outDir: "../server/public",
    emptyOutDir: false
  },
  server: {
    port: 8080
  },
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    VitePWA({
      manifest: manifest_default,
      includeAssets: ["**/*.{js,css,html,ico,jpg,png,svg,ttf,jpeg}"],
      workbox: {
        mode: "development",
        runtimeCaching: [
          {
            urlPattern: "/notes",
            handler: "NetworkFirst",
            options: {
              cacheName: "NotesCache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 1
                // <== 1 day
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    }),
    quasar({
      sassVariables: "src/quasar-variables.sass"
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  preview: {
    port: 4175,
    proxy: {
      "/": {
        target: "http://localhost:3000/",
        changeOrigin: true
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAibWFuaWZlc3QuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxOb3Rlc3BoZXJlXFxcXENsaWVudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcTm90ZXNwaGVyZVxcXFxDbGllbnRcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L05vdGVzcGhlcmUvQ2xpZW50L3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnO1xuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSc7XG5pbXBvcnQgbWFuaWZlc3QgZnJvbSAnLi9tYW5pZmVzdC5qcyc7XG5cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnO1xuaW1wb3J0IHsgcXVhc2FyLCB0cmFuc2Zvcm1Bc3NldFVybHMgfSBmcm9tICdAcXVhc2FyL3ZpdGUtcGx1Z2luJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6ICcuLi9zZXJ2ZXIvcHVibGljJyxcbiAgICBlbXB0eU91dERpcjogZmFsc2UsXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDgwODAsXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICB2dWUoe1xuICAgICAgdGVtcGxhdGU6IHsgdHJhbnNmb3JtQXNzZXRVcmxzIH0sXG4gICAgfSksXG4gICAgVml0ZVBXQSh7XG4gICAgICBtYW5pZmVzdCxcbiAgICAgIGluY2x1ZGVBc3NldHM6IFsnKiovKi57anMsY3NzLGh0bWwsaWNvLGpwZyxwbmcsc3ZnLHR0ZixqcGVnfSddLFxuICAgICAgd29ya2JveDoge1xuICAgICAgICBtb2RlOiAnZGV2ZWxvcG1lbnQnLFxuICAgICAgICBydW50aW1lQ2FjaGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHVybFBhdHRlcm46ICcvbm90ZXMnLFxuICAgICAgICAgICAgaGFuZGxlcjogJ05ldHdvcmtGaXJzdCcsXG4gICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgIGNhY2hlTmFtZTogJ05vdGVzQ2FjaGUnLFxuICAgICAgICAgICAgICBleHBpcmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgbWF4RW50cmllczogNTAsXG4gICAgICAgICAgICAgICAgbWF4QWdlU2Vjb25kczogNjAgKiA2MCAqIDI0ICogMSwgLy8gPD09IDEgZGF5XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGNhY2hlYWJsZVJlc3BvbnNlOiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzZXM6IFswLCAyMDBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KSxcblxuICAgIHF1YXNhcih7XG4gICAgICBzYXNzVmFyaWFibGVzOiAnc3JjL3F1YXNhci12YXJpYWJsZXMuc2FzcycsXG4gICAgfSksXG4gIF0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgfSxcbiAgfSxcbiAgcHJldmlldzoge1xuICAgIHBvcnQ6IDQxNzUsXG4gICAgcHJveHk6IHtcbiAgICAgICcvJzoge1xuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0OjMwMDAvJyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcTm90ZXNwaGVyZVxcXFxDbGllbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXE5vdGVzcGhlcmVcXFxcQ2xpZW50XFxcXG1hbmlmZXN0LmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Ob3Rlc3BoZXJlL0NsaWVudC9tYW5pZmVzdC5qc1wiO2V4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ05vdGVzcGhlcmUnLFxuICBzaG9ydF9uYW1lOiAnTm90ZXNwaGVyZScsXG4gIHN0YXJ0X3VybDogJy8nLFxuICBkaXNwbGF5OiAnc3RhbmRhbG9uZScsXG4gIGJhY2tncm91bmRfY29sb3I6ICcjQzEwMDE1JyxcbiAgbGFuZzogJ2RlJyxcbiAgc2NvcGU6ICcvJyxcbiAgdGhlbWVfY29sb3I6ICcjMTYxNTVhJyxcbiAgaWQ6ICcvJyxcbiAgaWNvbnM6IFtcbiAgICB7IHNyYzogJy9pY29ucy93ZWItYXBwLW1hbmlmZXN0LTE5MngxOTIucG5nJywgc2l6ZXM6ICcxOTJ4MTkyJywgdHlwZTogJ2ltYWdlL3BuZycgfSxcbiAgICB7IHNyYzogJy9pY29ucy93ZWItYXBwLW1hbmlmZXN0LTUxMng1MTIucG5nJywgc2l6ZXM6ICc1MTJ4NTEyJywgdHlwZTogJ2ltYWdlL3BuZycgfSxcbiAgXSxcbn07XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW9QLFNBQVMsZUFBZSxXQUFXO0FBQ3ZSLFNBQVMsZUFBZTs7O0FDRHNOLElBQU8sbUJBQVE7QUFBQSxFQUMzUCxNQUFNO0FBQUEsRUFDTixZQUFZO0FBQUEsRUFDWixXQUFXO0FBQUEsRUFDWCxTQUFTO0FBQUEsRUFDVCxrQkFBa0I7QUFBQSxFQUNsQixNQUFNO0FBQUEsRUFDTixPQUFPO0FBQUEsRUFDUCxhQUFhO0FBQUEsRUFDYixJQUFJO0FBQUEsRUFDSixPQUFPO0FBQUEsSUFDTCxFQUFFLEtBQUssdUNBQXVDLE9BQU8sV0FBVyxNQUFNLFlBQVk7QUFBQSxJQUNsRixFQUFFLEtBQUssdUNBQXVDLE9BQU8sV0FBVyxNQUFNLFlBQVk7QUFBQSxFQUNwRjtBQUNGOzs7QURWQSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsU0FBUyxRQUFRLDBCQUEwQjtBQU4wRyxJQUFNLDJDQUEyQztBQVF0TSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixhQUFhO0FBQUEsRUFDZjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxNQUNGLFVBQVUsRUFBRSxtQkFBbUI7QUFBQSxJQUNqQyxDQUFDO0FBQUEsSUFDRCxRQUFRO0FBQUEsTUFDTjtBQUFBLE1BQ0EsZUFBZSxDQUFDLDZDQUE2QztBQUFBLE1BQzdELFNBQVM7QUFBQSxRQUNQLE1BQU07QUFBQSxRQUNOLGdCQUFnQjtBQUFBLFVBQ2Q7QUFBQSxZQUNFLFlBQVk7QUFBQSxZQUNaLFNBQVM7QUFBQSxZQUNULFNBQVM7QUFBQSxjQUNQLFdBQVc7QUFBQSxjQUNYLFlBQVk7QUFBQSxnQkFDVixZQUFZO0FBQUEsZ0JBQ1osZUFBZSxLQUFLLEtBQUssS0FBSztBQUFBO0FBQUEsY0FDaEM7QUFBQSxjQUNBLG1CQUFtQjtBQUFBLGdCQUNqQixVQUFVLENBQUMsR0FBRyxHQUFHO0FBQUEsY0FDbkI7QUFBQSxZQUNGO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFFRCxPQUFPO0FBQUEsTUFDTCxlQUFlO0FBQUEsSUFDakIsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsSUFDdEQ7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxLQUFLO0FBQUEsUUFDSCxRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsTUFDaEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
