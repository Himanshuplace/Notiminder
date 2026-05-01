const CACHE_NAME = "notiminder-v3";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon.svg",
  "./maskable-icon.svg",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if(event.request.method !== "GET") return;

  if(event.request.mode === "navigate"){
    event.respondWith(
      fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => caches.match(event.request).then(cached => cached || caches.match("./index.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      const clone = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
      return response;
    }).catch(() => caches.match("./index.html")))
  );
});

self.addEventListener("push", event => {
  let data = {};
  try{
    data = event.data ? event.data.json() : {};
  }catch(err){
    data = { title: "Notiminder", body: event.data ? event.data.text() : "Reminder" };
  }

  event.waitUntil(
    self.registration.showNotification(data.title || "Notiminder", {
      body: data.body || "Reminder fired.",
      icon: "./icon-192.png",
      badge: "./icon-192.png",
      tag: data.tag || "notiminder-push",
      renotify: true,
      vibrate: [160, 70, 160],
      data: { url: data.url || "./index.html" },
      actions: [{ action: "open", title: "Open" }]
    })
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data && event.notification.data.url || "./index.html", self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(clients => {
      for(const client of clients){
        if(client.url === targetUrl && "focus" in client) return client.focus();
      }
      if(self.clients.openWindow) return self.clients.openWindow(targetUrl);
    })
  );
});
