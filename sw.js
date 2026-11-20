// Service Worker for Study GATE Exam with Arshad (PWA Offline Engine)
const CACHE_NAME = 'study-gate-v3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './cs/index.html',
  './da/index.html',
  './planner/index.html',
  './practice/index.html',
  './pyqs/index.html',
  './resources/index.html',
  './data/subjects.json',
  './assets/styles.css',
  './assets/app.js',
  './subjects/discrete-mathematics/index.html',
  './subjects/linear-algebra/index.html',
  './subjects/calculus-optimization/index.html',
  './subjects/probability-statistics/index.html',
  './subjects/digital-logic/index.html',
  './subjects/computer-organization/index.html',
  './subjects/programming-data-structures/index.html',
  './subjects/algorithms/index.html',
  './subjects/theory-of-computation/index.html',
  './subjects/compiler-design/index.html',
  './subjects/operating-systems/index.html',
  './subjects/databases/index.html',
  './subjects/computer-networks/index.html',
  './subjects/machine-learning/index.html',
  './subjects/artificial-intelligence/index.html',
  './subjects/general-aptitude/index.html',
  './assets/docs/AW+ALGO.pdf',
  './assets/docs/compiler-design-visual-study-guide.pdf'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // For same-origin requests, prefer network first to avoid stale cache on updates
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback to cache if network fails (offline)
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) return cachedResponse;
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('./index.html');
          }
        });
      })
  );
});
