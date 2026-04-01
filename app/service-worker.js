const CACHE_NAME = "growth-sdg-atlas-v3";
const APP_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./sdg-wheel.svg",
  "./sdg-wheel.png",
  "./icon.svg",
  "./icon-192.png",
  "./icon-512.png",
  "../data/site_meta.json",
  "../data/sources.json",
  "../data/countries.json",
  "../data/comparators.json",
  "../data/indicators.json",
  "../data/lenses.json",
  "../data/pathways.json",
  "../data/policies.json",
  "../data/budget_map.json",
  "../data/accelerators.json",
  "../data/signals.json",
  "../data/news_signals.json",
  "../data/external_scores.json",
  "../data/pulse_history.json",
  "../data/trajectory_2030.json",
  "../data/toolkit.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200) {
            return response;
          }

          const sameOrigin = new URL(event.request.url).origin === self.location.origin;
          if (sameOrigin) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone()));
          }

          return response;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});
