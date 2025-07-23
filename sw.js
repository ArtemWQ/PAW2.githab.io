const CACHE_NAME = 'bike-picker-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/icons/icon-72x72.png',
    '/icons/icon-96x96.png',
    '/icons/icon-128x128.png',
    '/icons/icon-144x144.png',
    '/icons/icon-152x152.png',
    '/icons/icon-192x192.png',
    '/icons/icon-384x384.png',
    '/icons/icon-512x512.png'
];

// Установка: кэшируем ресурсы
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
    self.skipWaiting(); // Активировать сразу
});

// Перехват запросов
self.addEventListener('fetch', event => {
    // Пропускаем не-HTTP запросы
    if (!event.request.url.startsWith('http')) return;

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Возвращаем кэш, если есть
                if (response) {
                    return response;
                }
                // Иначе — запрашиваем из сети
                return fetch(event.request);
            })
    );
});

// Активация: удаляем старые кэши
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Берём контроль над страницей сразу
    clients.claim();
});