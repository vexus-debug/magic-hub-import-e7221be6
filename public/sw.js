const RELEASE = "20261001-staff-page";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.clients.claim();
      await self.registration.unregister();

      const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      await Promise.all(
        clients.map((client) => {
          const url = new URL(client.url);
          if (url.origin !== self.location.origin) return Promise.resolve();
          url.searchParams.set("app-release", RELEASE);
          return client.navigate(url.href);
        }),
      );
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});