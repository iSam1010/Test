// sw.js - very simple "app shell" cache

const CACHE_NAME = 'darts-marathon-v1';

const APP_SHELL = [
  './',
  './darts.html',
  './media/images/logo.png',
  './media/sounds/gameon.mp3',
  // add any other local assets you want offline by default
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;

  // App shell for navigations
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.match('./darts.html').then(resp => resp || fetch(req))
    );
    return;
  }

  // Cache-first for same-origin static assets
  if (new URL(req.url).origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then(resp => resp || fetch(req))
    );
    return;
  }

  // Let Firestore and other third-party requests go straight to network
});
