// Mat's Notes — Service Worker v4
const CACHE_VERSION = 'v4';
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

// Libs Firebase à mettre en cache (critiques pour le mode offline)
const FIREBASE_LIBS = [
    'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js',
    'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js',
    'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js'
];

// Installation : cacher les assets locaux + libs Firebase
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            // Assets locaux (obligatoires)
            return cache.addAll(ASSETS)
                .then(() => {
                    // Libs Firebase (best-effort, pas bloquant)
                    return Promise.allSettled(
                        FIREBASE_LIBS.map(url =>
                            fetch(url).then(res => {
                                if (res.ok) cache.put(url, res);
                            }).catch(() => {})
                        )
                    );
                });
        }).then(() => self.skipWaiting())
    );
});

// Activation : supprime les anciens caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            ))
            .then(() => self.clients.claim())
    );
});

// Fetch : stratégie par type de ressource
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Libs Firebase (gstatic.com) : cache-first
    if (url.hostname === 'www.gstatic.com') {
        event.respondWith(
            caches.match(event.request).then(cached => {
                if (cached) return cached;
                return fetch(event.request).then(res => {
                    if (res && res.ok) {
                        const clone = res.clone();
                        caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
                    }
                    return res;
                });
            })
        );
        return;
    }

    // Polices Google : stale-while-revalidate
    if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
        event.respondWith(
            caches.match(event.request).then(cached => {
                const fetchPromise = fetch(event.request).then(res => {
                    if (res && res.ok) {
                        const clone = res.clone();
                        caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
                    }
                    return res;
                }).catch(() => cached);
                return cached || fetchPromise;
            })
        );
        return;
    }

    // index.html : network-first avec fallback cache
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
