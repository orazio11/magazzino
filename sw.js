const CACHE_NAME = 'magazzino-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// Installazione del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aperta');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Gestione delle richieste di rete
self.addEventListener('fetch', event => {
  // Per le richieste API a Google Script, vai sempre in rete, non usare la cache
  if (event.request.url.includes('script.google.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Per tutte le altre richieste, prova a cercarle prima nella cache
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se la risorsa è in cache, restituiscila
        if (response) {
          return response;
        }
        // Altrimenti, recuperala dalla rete
        return fetch(event.request);
      })
  );
});

// Attivazione e pulizia delle vecchie versioni della cache
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
});
