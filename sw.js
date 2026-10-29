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
    vibrate: [300, 150, 300, 150, 300],
    data: { code: d.code || '' }
  }));
});
self.addEventListener('notificationclick', function(e){
  e.notification.close();
  var code = (e.notification.data && e.notification.data.code) || '';
  var url = self.registration.scope + (code ? '?c=' + encodeURIComponent(code) : '');
  e.waitUntil(self.clients.matchAll({type: 'window', includeUncontrolled: true}).then(function(list){
    if (list.length) {
      var c = list[0];
      if ('navigate' in c && code) {
        return c.navigate(url).then(function(n){ return (n || c).focus(); }).catch(function(){ return c.focus(); });
      }
      return c.focus();
    }
    return self.clients.openWindow(url);
  }));
});
