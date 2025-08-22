
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

let appVisible = false;

// Setup BroadcastChannel listener
const visibilityChannel = new BroadcastChannel("chat_app_visibility");
visibilityChannel.onmessage = (event) => {
  appVisible = event.data?.visible === true;
};

// Handle Push
self.addEventListener("push", function (event) {
  const data = event.data?.json() || {};
  const title = data.title || "Inbox";

   const options = {
    body: data.body || 'You got new messages.',
    tag: data.tag || "default-tag", // prevent stacking
    icon: "/inbox.png",    
    badge: "/myselpost.png",
    requireInteraction: true,      // keeps notification until user interacts
  };

  event.waitUntil(
    (async () => {
      const allClients = await clients.matchAll({ type: "window", includeUncontrolled: true });

      const isClientOpen = allClients.length > 0;

      if (isClientOpen && appVisible) {
        console.log("🔕 Push suppressed — app is visible and focused");
        return;
      }

      // Show notification only if app is not actively visible
      await self.registration.showNotification(title, options);
    })()
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

