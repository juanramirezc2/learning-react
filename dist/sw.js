var cache_name = 'my-site-cache-v37';
var urlsToCache = ['/', '/index.html', '/test.html', '/bundle.js'];

self.addEventListener('install', function(event) {
  console.log('install event');
  // Perform install steps
  event.waitUntil(
    caches.open(cache_name).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

let urlsFetched = [];
self.addEventListener('fetch', function(event) {
  urlsFetched.push(event.request);
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log('activate triggered', 'SW starts up');
  event.waitUntil(
    caches.keys().then(keyList => {
      Promise.all(
        keyList.map(key => {
          if (key !== cache_name) {
            console.log('deleting old cache');
            return caches.delete(key);
          }
        })
      );
    })
  );
});
