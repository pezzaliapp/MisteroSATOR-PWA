// sw.js — Il Mistero del SATOR — cache-first app shell (v3)
const CACHE = 'sator-pwa-v10';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './readme.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k===CACHE?null:caches.delete(k)))) .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(e.request).then(resp => resp || fetch(e.request).then(f => {
        const copy = f.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return f;
      })).catch(()=>caches.match('./index.html'))
    );
  }
});
