// Mat's Notes — Service Worker
// ⚠️ Incrémenter CACHE_VERSION à chaque déploiement pour forcer la mise à jour
const CACHE_VERSION = 'v6';
const CACHE_NAME = `mats-notes-${CACHE_VERSION}`;

const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './favicon-96x96.png',
    './apple-touch-icon.png',
    './web-app-manifest-192x192.png',
    './web-app-manifest-512x512.png'
];

// Installation
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS).catch(() => {}))
            .then(() => self.skipWaiting())
    );
});

// Activation : supprime TOUS les anciens caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            ))
            .then(() => self.clients.claim())
    );
});

// Fetch
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Polices Google
    if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
        event.respondWith(
            fetch(event.request)
                .then(res => {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
                    return res;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    // index.html : network-first (toujours la version la plus fraiche)
    if (url.pathname.endsWith('/') || url.pathname.endsWith('index.html')) {
        event.respondWith(
            fetch(event.request)
                .then(res => {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
                    return res;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    // Autres ressources locales : cache-first
    if (url.origin === location.origin) {
        event.respondWith(
            caches.match(event.request).then(cached => {
                if (cached) return cached;
                return fetch(event.request).then(res => {
                    if (res && res.status === 200) {
                        const clone = res.clone();
                        caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
                    }
                    return res;
                });
            })
        );
    }
});
