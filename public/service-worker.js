const CACHE_NAME = 'code-editor-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/public/code-editor.html',
  '/app.js',
  '/scripts/debugger.js',
  '/logo.webp',
  '/manifest.json',
];

// Cài đặt Service Worker và cache các tài nguyên
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // Kích hoạt ngay khi cài đặt xong
});

// Kích hoạt Service Worker và xóa cache cũ
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Áp dụng service worker ngay cho các client
});

// Xử lý các yêu cầu và trả về từ cache hoặc mạng
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
