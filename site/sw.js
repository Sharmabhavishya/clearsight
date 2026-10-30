// Keeps the demo alive on bad venue Wi-Fi: the page is network-first, everything it loads is cached.
const VERSION = "clearsight-v5";
const CORE = ["./", "index.html", "favicon.svg", "manifest.webmanifest", "icon-192.png"];
const CACHED_HOSTS = ["res.cloudinary.com", "cdnjs.cloudflare.com", "fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return; // uploads always go to the network
  // Video streams in byte ranges, which the cache can't store; let the browser handle it.
  if (req.headers.has("range") || req.destination === "video" || req.destination === "audio") return;
  const url = new URL(req.url);

  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => { const copy = res.clone(); caches.open(VERSION).then((c) => c.put("index.html", copy)); return res; })
        .catch(() => caches.match("index.html"))
    );
    return;
  }

  if (url.origin === self.location.origin || CACHED_HOSTS.includes(url.hostname)) {
    e.respondWith(
      caches.match(req).then((hit) => {
        // An opaque copy (cached from an <img>) can't answer a script's fetch(), so go to the network instead.
        if (hit && (hit.type !== "opaque" || req.mode === "no-cors")) return hit;
        return fetch(req).then((res) => {
          if (res.status === 200 || res.type === "opaque") { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
          return res;
        });
      })
    );
  }
});
