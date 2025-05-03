const CACHE_NAME = 'hydrotracker-v1';
const ASSETS_TO_CACHE = [
    '/assets/style.css',
    'favicon.png',
    'index.html',
    'manifest.json',
    'notifications.json',
    'phone.png',
    'script.js',
    'settings.js',
    'style.css',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
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
});

self.addEventListener("push", function (event) {
    const data = event.data.json();
    const title = data.title || "HydroTrack";
    const body = data.body || "Trink Wasser!";
    const icon = data.icon || "/projects/hydrotrack/favicon.png";
    const url = data.url || "/";
  
    event.waitUntil(
        self.registration.showNotification(title, {
            body: body,
            icon: icon,
            data: { url: url }
        })
    );
});
  
self.addEventListener("notificationclick", function (event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});