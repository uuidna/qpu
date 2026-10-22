// The QPU service worker: the app shell works offline; everything else is network-first with the shell as the fallback.
// Only same-origin requests are handled. Calls to other origins pass through untouched, so they are never cached or faked.
const CACHE = 'qpu-shell-v1'
const SHELL = ['./qpu.html', './manifest.webmanifest', './icon.svg']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))))
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) caches.open(CACHE).then((cache) => cache.put(event.request, response.clone()))
        return response
      })
      .catch(() => caches.match(event.request).then((hit) => hit || caches.match('./qpu.html')))
  )
})
