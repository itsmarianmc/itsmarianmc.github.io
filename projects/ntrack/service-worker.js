const CACHE_NAME = 'hydrotracker-v1';
const ASSETS_TO_CACHE = [
    'favicon.png',
    'index.html',
    'manifest.json',
    'style.css'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => 
            Promise.all(keys.map(key => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => 
            response || fetch(event.request)
        )
    );
});self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("ntrack-cache").then(cache => {
      return cache.addAll([
        "./",
        "./favicon-dark.png",
        "./favicon-light.png",
        "./index.html",
        "./styles.css",
        "./script.js",
        "./manifest.json"
      ]);
    }).catch(err => {
      console.error("Cache error during install:", err);
    })
  );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});