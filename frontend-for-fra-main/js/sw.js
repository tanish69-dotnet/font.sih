// sw.js - Service Worker

const CACHE_NAME = 'fra-cache-v1';
// This is the "app shell" - the minimal files needed to run the app
const urlsToCache = [
  '/',
  '/index.html',
  '/css/main.css',
  '/css/components.css',
  '/css/responsive.css',
  '/js/main.js',
  '/js/dashboard.js',
  '/js/map.js',
  '/js/data.js',
  '/js/documents.js',
  '/js/dss.js',
  '/js/utils.js',
  '/assets/data/fra-sample-data.json',
  '/components/header.html',
  '/components/sidebar.html',
  '/components/footer.html',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// 1. Install the service worker and cache the app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Intercept network requests and serve from cache (cache-first strategy)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Not in cache - fetch from network
        return fetch(event.request);
      }
    )
  );
});