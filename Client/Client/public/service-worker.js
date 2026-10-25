
const CACHE_NAME = "my-cache-v1";
const clientFolderURL = "/Client";
const staticAssets = ["/", clientFolderURL];

//! Install PWA
self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(staticAssets))
  );
  self.skipWaiting();
});

//! Activate PWA
self.addEventListener("activate", (evt) => {
  const cacheWhiteList = [CACHE_NAME];
  evt.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((item) => {
          if (!cacheWhiteList.includes(item)) {
            return caches.delete(item);
          }
          return item;
        })
      )
    )
  );
});

// Handle Notification Click
self.addEventListener("notificationclick", function (event) {

  // ✅ You can focus or open a window/tab
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes("/chat-list") && "focus" in client) {
          return client.focus();
        }
      }

      // Otherwise, open a new tab
      return clients.openWindow("/chat-list");
    })
  );
});

