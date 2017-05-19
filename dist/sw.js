importScripts('workbox.js');
var cache_name = 'my-site-cache-v41';
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

self.addEventListener('push', event => {
  if (event.data) {
    var img = '/images/icons/icon-128x128.png';
    // star wars vibration pattern
    const options = {
      body: event.data.text(),
      vibrate: [
        500,
        110,
        500,
        110,
        450,
        110,
        200,
        110,
        170,
        40,
        450,
        110,
        200,
        110,
        170,
        40,
        500
      ],
      icon: img,
      badge: img,
      image: 'https://www.allaboutbirds.org/guide/PHOTO/LARGE/annas_hummingbird_sim_1.jpg'
    };
    const promiseChain = self.registration.showNotification(
      'TodoList notification',
      options
    );
    event.waitUntil(promiseChain);
  } else {
    console.log('this push evetn has not data');
  }
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
