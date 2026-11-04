// Golden Drinks app on the phone (written by Divino; bump V when this file changes how it caches)
const V = 'gd-1';
self.addEventListener('install', (e) => { self.skipWaiting(); e.waitUntil(caches.open(V).then((c) => c.add('./')).catch(() => {})); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const r = e.request; const u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin || u.pathname.includes('/owner/')) return;
  if (r.mode === 'navigate' || /\/(index\.html)?$/.test(u.pathname)) {
    e.respondWith(fetch(r.url, { cache: 'no-store' }).then((res) => { if (res.ok) { const c = res.clone(); caches.open(V).then((k) => k.put('./', c)); } return res; })
      .catch(() => caches.match('./').then((m) => m || Response.error())));
    return;
  }
  if (u.pathname.includes('/img/') || /\.(png|webmanifest)$/.test(u.pathname)) {
    e.respondWith(caches.match(r).then((m) => m || fetch(r).then((res) => { if (res.ok && u.pathname.includes('/img/')) { const c = res.clone(); caches.open(V).then((k) => k.put(r, c)); } return res; })));
  }
});
