importScripts('workbox.js');
var cache_name = 'my-site-cache-v46';
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
      badge: img
    };
    const promiseChain = self.registration.showNotification(
      'TodoList notification',
      options
    );
    event.waitUntil(promiseChain);
  } else {
    console.log('this push event has not data');
  }
});
self.addEventListener('notificationclick', event => {
  const clickedNotification = event.notification, examplePage = '/';
  clickedNotification.close();

  const urlToOpen = new URL(examplePage, self.location.origin).href;
  const promiseChain = clients
    .matchAll({
      type: 'window',
      includeUncontrolled: true
    })
    .then(windowClients => {
      let matchingClient = null;

      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        if (windowClient.url === urlToOpen) {
          matchingClient = windowClient;
          break;
        }
      }

      if (matchingClient) {
        return matchingClient.focus();
      } else {
        return clients.openWindow(urlToOpen);
      }
    });
  event.waitUntil(promiseChain);
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
