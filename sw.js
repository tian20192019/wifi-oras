self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });
self.addEventListener('push', function(e){
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = {}; }
  e.waitUntil(self.registration.showNotification(d.title || 'WiFi Rental', {
    body: d.body || 'Malapit nang maubos ang oras ng WiFi mo.',
    tag: 'wifi-oras',
    renotify: true,
    requireInteraction: true,
    vibrate: [300, 150, 300, 150, 300]
  }));
});
self.addEventListener('notificationclick', function(e){
  e.notification.close();
  e.waitUntil(self.clients.matchAll({type: 'window', includeUncontrolled: true}).then(function(list){
    if (list.length) return list[0].focus();
    return self.clients.openWindow(self.registration.scope);
  }));
});
