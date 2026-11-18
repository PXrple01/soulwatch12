// Offline-Start für die Watchlist: Seite und App-Dateien werden zwischengespeichert.
// Immer zuerst aus dem Netz laden (damit neue Versionen sofort ankommen). Ohne Netz oder bei einem Server-Fehler
// (z. B. wenn der Hoster gestört ist) startet die zuletzt gespeicherte Version.
const CACHE = "jj-watchlist-v38";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon-180.png", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", e => {
  // Einzeln speichern: fehlt eine Datei, scheitert nicht gleich die ganze Installation
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(FILES.map(f => c.add(f).catch(() => {})))));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  // Cloud, Cover und Online-Suche laufen direkt übers Netz.
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  const saved = () => caches.match(e.request, { ignoreSearch: true })
    .then(r => r || (e.request.mode === "navigate" ? caches.match("./index.html").then(x => x || caches.match("./")) : undefined));
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok) { const k = r.clone(); caches.open(CACHE).then(c => c.put(e.request, k)); return r; }
    if (r.status >= 500) return saved().then(x => x || r);
    return r;
  }).catch(() => saved().then(x => x || Response.error())));
});
