const CACHE_NAME = 'jg-cache-v2';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                './',
                './index.html',
                './css/global.css',
                './css/animations.css',
                './css/player.css',
                './css/brand.css',
                './css/landing.css',
                './js/app.js',
                './js/brand-engine.js',
                './js/download.js',
                './js/ken-burns.js',
                './js/scroll-engine.js',
                './js/slide-renderer.js',
                './js/speech.js'
            ]);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                return response;
            }
            return fetch(event.request).then(
                (response) => {
                    // Check if we received a valid response
                    if(!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response because it's a stream
                    var responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                }
            );
        })
    );
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CACHE_EPISODE') {
        const payload = event.data.payload;
        console.log(`Caching S${payload.series}E${payload.episode}`);
        
        caches.open(CACHE_NAME).then((cache) => {
            // Add JSON
            const epNum = payload.episode.toString().padStart(2, '0');
            cache.add(`./data/series${payload.series}/episode${epNum}.json`);
            
            // Add Images (limit to avoid storage issues)
            const imagesToCache = payload.images.slice(0, 85);
            imagesToCache.forEach(img => {
                if (img) cache.add(`./${img}`).catch(e => console.error("Cache fail", e));
            });
        });
    }
});
