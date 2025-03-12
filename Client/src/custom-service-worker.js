import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, Route, NavigationRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

self.skipWaiting();
precacheAndRoute(self.__WB_MANIFEST);
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')));

const NotesRoute = new Route(
  ({ url }) => url.pathname === '/notes',
  new NetworkFirst({
    cacheName: 'note-cache',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 1,
      }),
    ],
    cacheableResponse: {
      statuses: [0, 200],
    },
  }),
);

const fontAndIconRoute = new Route(
  ({ url }) => {
    return /.*\.(woff|woff2|ttf|eot|svg)/.test(url.pathname) || 
           url.pathname.includes('@quasar/extras/material-icons') || 
           url.pathname.includes('@quasar/extras/fontawesome-v6');
  },
  new CacheFirst({
    cacheName: 'font-icon-cache',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
      }),
    ],
    cacheableResponse: {
      statuses: [0, 200],
    },
  }),
);

// Route for CSS files that might contain icon references
const cssRoute = new Route(
  ({ url }) => url.pathname.endsWith('.css'),
  new CacheFirst({
    cacheName: 'css-cache',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
      }),
    ],
    cacheableResponse: {
      statuses: [0, 200],
    },
  }),
);

// Register all routes
registerRoute(NotesRoute);
registerRoute(fontAndIconRoute);
registerRoute(cssRoute);