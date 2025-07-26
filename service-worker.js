self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('diel-cache').then(cache => {
      return cache.addAll([
        '/code/diel/',
        '/code/diel/index.html',
        '/code/diel/favicon-192.png',
        '/code/diel/favicon-512.png',
        '/code/diel/your-script.js',
        '/code/diel/style.css'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
