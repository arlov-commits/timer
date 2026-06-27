/* dìng — offline service worker.
   Caches the app shell so it launches with no network at all. */
var CACHE = "ding-v11";
var ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./assets/logo.svg",
  "./assets/logo-mark.png",
  "./assets/favicon-32.png",
  "./assets/favicon-16.png",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/icon-maskable-512.png",
  "./assets/apple-touch-icon.png",
  "./assets/sounds/freesound_community-bell-meditation-75335.mp3",
  "./assets/sounds/freesound_community-singing-bell-hit-2-75258.mp3",
  "./assets/sounds/floraphonic-deep-meditation-bell-hit-root-chakra-1-174455.mp3",
  "./assets/sounds/mandakimdk-big-bellburmese-367944.mp3",
  "./assets/sounds/freesound_community-ding-101492.mp3"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(function (cached) {
      return cached || fetch(e.request).then(function (resp) {
        var copy = resp.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        return resp;
      }).catch(function () { return cached; });
    })
  );
});
