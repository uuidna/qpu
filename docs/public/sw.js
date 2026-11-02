// The service worker of the web OS: the shell and every page kept by content; the MCP, the docket and the stream asked first.
const SHELL = 'qpu-shell-1.0.2-8'
const PAGES = 'qpu-pages'
const NETWORK_FIRST = [/^\/mcp/, /^\/docket/, /^\/health/, /^\/\.well-known\//, /\.ndjson$/, /\/receipt\.json$/, /\/metrics\.json$/, /\/readiness\.json$/]
// the shell: the home page and every module it preloads (the app, the theme, its own page data), so offline the home renders whole
self.addEventListener('install', (e) => { e.waitUntil(caches.open(SHELL).then(async (c) => { const home = await fetch(new Request('/', { headers: { accept: 'text/html' } })); const html = await home.clone().text(); await c.put('/', home); const modules = [...new Set([...html.matchAll(/(?:href|src)="(\/assets\/[^"]+)"/g)].map((m) => m[1]))]; await c.addAll(['/manifest.webmanifest', '/icon.svg', '/a432.css', '/uuidna.css', ...modules]) }).then(() => self.skipWaiting())) })
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('qpu-shell-') && k !== SHELL).map((k) => caches.delete(k)))).then(() => self.clients.claim())) })
// the mode the shell sets: auto (content first, the MCP first), online (network first for everything), offline (the cache alone)
// the mode is kept in the cache too: a service worker is stopped when idle and starts again without its variables
let MODE = null
const modeNow = () => (MODE ? Promise.resolve(MODE) : caches.open(PAGES).then((c) => c.match('/__mode')).then((r) => (r ? r.text() : 'auto')).then((m) => { MODE = m; return m }))
const LOG = []
const log = (path, mode, branch) => { LOG.push({ path, mode, branch, at: Date.now() }); if (LOG.length > 50) LOG.shift(); return branch }
self.addEventListener('message', (e) => {
  const reply = (m) => { if (e.ports && e.ports[0]) e.ports[0].postMessage(m); else if (e.source) e.source.postMessage(m) }
  if (e.data && typeof e.data.mode === 'string' && ['auto', 'online', 'offline'].includes(e.data.mode)) { MODE = e.data.mode; caches.open(PAGES).then((c) => c.put('/__mode', new Response(MODE))).then(() => reply({ mode: MODE })); return }
  if (e.data && e.data.ask === 'mode') modeNow().then((m) => reply({ mode: m }))
  if (e.data && e.data.ask === 'log') reply({ log: LOG, shell: SHELL })
})
// the copy is taken before the body is read by the page (a clone after the open would find the body gone)
const keep = (req, res) => { if (res && res.ok && !res.redirected) { const copy = res.clone(); caches.open(PAGES).then((c) => c.put(req, copy)).catch(() => {}) } return res }
// a navigation to a page the cache does not hold goes home (a redirect, so the page and its address agree and the shell hydrates); anything else is told so
const fallback = (req) => caches.match(req, { ignoreSearch: true }).then((r) => r || (req.mode === 'navigate' ? (new URL(req.url).pathname === '/' ? caches.match('/', { ignoreSearch: true }) : Response.redirect(new URL('/?offline=' + encodeURIComponent(new URL(req.url).pathname), req.url).href, 302)) : undefined)).then((r) => r || new Response(req.mode === 'navigate' ? 'offline: not in the cache' : '{"offline":true}', { status: 503, headers: { 'content-type': req.mode === 'navigate' ? 'text/plain' : 'application/json' } }))
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url)
  if (e.request.method !== 'GET' || url.origin !== self.location.origin || url.pathname === '/__mode') return
  // ?mode=auto|online|offline on a navigation sets the mode without a script: the escape hatch of the web OS
  const asked = e.request.mode === 'navigate' && url.searchParams.get('mode')
  if (asked && ['auto', 'online', 'offline'].includes(asked)) { MODE = asked; e.respondWith(caches.open(PAGES).then((c) => c.put('/__mode', new Response(asked))).then(() => { url.searchParams.delete('mode'); return Response.redirect(url.href, 302) })); return }
  e.respondWith(modeNow().then((mode) => {
    // offline: the cache alone; a page not yet cached falls back to the shell (a navigation), anything else is told so
    if (mode === 'offline') { log(url.pathname, mode, 'cache-only'); return fallback(e.request) }
    // online, the live surfaces, and every navigation: the network first (a page follows its deploy), the cache when the network fails
    if (mode === 'online' || e.request.mode === 'navigate' || NETWORK_FIRST.some((re) => re.test(url.pathname))) { log(url.pathname, mode, 'network-first'); return fetch(e.request).then((res) => { log(url.pathname, mode, 'network ' + res.status + (res.redirected ? ' redirected ' + res.url : '')); return keep(e.request, res) }).catch((err) => { log(url.pathname, mode, 'network failed: ' + err.message); return fallback(e.request) }) }
    // a UUID page and the built assets are content: whatever they say never changes; everything else is served from the cache and refreshed behind
    const immutable = /^\/(?:u\/)?[0-9a-f-]{36}$/.test(url.pathname) || /\/assets\//.test(url.pathname)
    log(url.pathname, mode, immutable ? 'cache-first' : 'stale-while-revalidate')
    return caches.match(e.request).then((cached) => { const fresh = fetch(e.request).then((res) => keep(e.request, res)).catch(() => cached || fallback(e.request)); return cached && immutable ? cached : cached ? (fresh, cached) : fresh })
  }))
})
