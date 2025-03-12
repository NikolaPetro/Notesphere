/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-18b6bf37'], (function (workbox) { 'use strict';

  self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });

  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "assets/AboutView-_BEgq-3S.js",
    "revision": null
  }, {
    "url": "assets/HomeView-J9tuVAnd.css",
    "revision": null
  }, {
    "url": "assets/HomeView-NKIlqMAu.js",
    "revision": null
  }, {
    "url": "assets/index-g67jia64.css",
    "revision": null
  }, {
    "url": "assets/index-m1D20lmg.js",
    "revision": null
  }, {
    "url": "index.html",
    "revision": "529ad19c80b1d10a551614194fb1b2cf"
  }, {
    "url": "registerSW.js",
    "revision": "1872c500de691dce40960bb85481de07"
  }, {
    "url": "icons/web-app-manifest-192x192.png",
    "revision": "79872a352e67d615b67c74c891ce4fa3"
  }, {
    "url": "icons/web-app-manifest-512x512.png",
    "revision": "b2525ea2e308c62878a5340f4a4bf099"
  }, {
    "url": "favicon.ico",
    "revision": "caa5f9da26421f38a1ad99458fef22bc"
  }, {
    "url": "logo.png",
    "revision": "caa5f9da26421f38a1ad99458fef22bc"
  }, {
    "url": "icons/apple-touch-icon.png",
    "revision": "74126ced1d1bb6c5bf47e5278ef126a3"
  }, {
    "url": "icons/favicon-96x96.png",
    "revision": "9f11ae74838036351e5145c2daade163"
  }, {
    "url": "icons/favicon.ico",
    "revision": "8806db64bfd376514b8b88c259309ada"
  }, {
    "url": "icons/favicon.svg",
    "revision": "4bf2442d3f50fc805026f27e444890bb"
  }, {
    "url": "fonts/Montserrat/Montserrat-Regular.ttf",
    "revision": "34de1239b12123b85ff1a68b58835a1f"
  }, {
    "url": "manifest.webmanifest",
    "revision": "f13e002b83c179e9b98df54dd862ef90"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute("/notes", new workbox.NetworkFirst({
    "cacheName": "NotesCache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 50,
      maxAgeSeconds: 86400
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^http:\/\/localhost:3000\/notes/, new workbox.NetworkFirst({
    "cacheName": "NotesApiCache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 50,
      maxAgeSeconds: 86400
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(({
    request
  }) => request.destination === "image", new workbox.CacheFirst({
    "cacheName": "noteImages",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 100,
      maxAgeSeconds: 2592000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));
