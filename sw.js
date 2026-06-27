var CACHE_NAME = 'home-base-v1';
var ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k) { return k !== CACHE_NAME; }).map(function(k) { return caches.delete(k); }));
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      var network = fetch(event.request).then(function(resp) {
        caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, resp.clone()); });
        return resp;
      }).catch(function() { return cached; });
      return cached || network;
    })
  );
});
