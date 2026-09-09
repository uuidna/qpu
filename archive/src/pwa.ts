// pwa — full-featured progressive web app of the QPU itself.
// Proof of concept and proof of work. One hologram plugin. Not a replica package. Fractal distribution.
// Named HTTPS only. Constructor doors occupy the cache. When never. Seat empty.
import {
  QPU_HOST, VE_FACES, qpuFacesOf, qpuSeatOf,
} from './hologram.js'
import { qpuCompareHolds, qpuCompareOf } from './metrics.js'
import { qpuOgHrefOf } from './og.js'
import { qpuQuantumHolds, qpuQuantumOf } from './quantum.js'
import { QPU_VERSION } from './version.js'

const namedHttpsOf = (host: string, path: string): string => {
  if (!host.includes('.') || host.includes('*') || path.includes('*') || !path.startsWith('/')) {
    throw new Error('fuse: named door only')
  }
  const u = new URL(path, `https://${host}/`)
  if (u.protocol !== 'https:' || u.hostname !== host) throw new Error('fuse: named domain only')
  return u.href
}

/** Fourteen constructor doors occupy the install cache — VE faces, not a crawl. */
export const QPU_PWA_DOORS = [
  '/',
  '/seat',
  '/width',
  '/hologram',
  '/chip',
  '/merkaba',
  '/pwa',
  '/manifest.webmanifest',
  '/icon.svg',
  '/og.svg',
  '/sw.js',
  '/live',
  '/experience',
  '/metrics',
] as const

const originOf = (): string => namedHttpsOf(QPU_HOST, '/')

export const qpuPwaManifestOf = () => {
  const origin = originOf()
  const faces = qpuFacesOf()
  return {
    id: origin,
    name: 'QPU',
    short_name: 'QPU',
    description: 'Quantum processing unit as three readings. Empty seat. Named HTTPS. When never.',
    lang: 'en',
    dir: 'ltr' as const,
    start_url: '/',
    scope: '/',
    display: 'standalone' as const,
    display_override: ['standalone', 'minimal-ui', 'browser'] as const,
    orientation: 'any' as const,
    theme_color: '#6b46e5',
    background_color: '#14121c',
    prefer_related_applications: false as const,
    categories: ['utilities', 'education', 'productivity'] as const,
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any', purpose: 'any' },
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any', purpose: 'maskable' },
    ],
    screenshots: [
      { src: '/og.svg', type: 'image/svg+xml', sizes: '1200x630', form_factor: 'wide' as const, label: 'QPU hologram' },
    ],
    shortcuts: faces.map((f) => ({
      name: `Face ${f.face}`,
      short_name: `${f.face}↔${f.opposite}`,
      url: `/face/${f.face}`,
    })),
    handle_links: 'preferred' as const,
    launch_handler: { client_mode: 'navigate-existing' as const },
    protocol_handlers: [{ protocol: 'web+qpu', url: '/search?q=%s' }],
    file_handlers: [{
      action: '/',
      accept: { 'application/json': ['.json'] },
    }],
    share_target: {
      action: '/search',
      method: 'GET' as const,
      enctype: 'application/x-www-form-urlencoded' as const,
      params: { title: 'q', text: 'q', url: 'q' },
    },
  }
}

export const qpuPwaSwOf = (): string => {
  const host = QPU_HOST
  const cache = `qpu-${QPU_VERSION}`
  const doors = [...QPU_PWA_DOORS]
  return `const CACHE=${JSON.stringify(cache)};
const HOST=${JSON.stringify(host)};
const DOORS=${JSON.stringify(doors)};
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(DOORS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('message',e=>{
  if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting();
});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.protocol!=='https:'||u.hostname!==HOST)return;
  if(e.request.method!=='GET')return;
  e.respondWith((async()=>{
    const hit=await caches.match(e.request);
    if(hit)return hit;
    try{
      const res=await fetch(e.request);
      if(res.ok&&DOORS.includes(u.pathname)){
        const copy=res.clone();
        const c=await caches.open(CACHE);
        await c.put(e.request,copy);
      }
      return res;
    }catch{
      if(e.request.mode==='navigate'){
        const home=await caches.match('/');
        if(home)return home;
      }
      const cached=await caches.match(e.request);
      if(cached)return cached;
      return new Response('{"holds":false,"error":"offline"}',{status:503,headers:{'content-type':'application/json; charset=utf-8'}});
    }
  })());
});
`
}

export const qpuPwaOf = () => {
  const quantum = qpuQuantumOf()
  const compare = qpuCompareOf()
  const manifest = qpuPwaManifestOf()
  const sw = qpuPwaSwOf()
  const href = namedHttpsOf(QPU_HOST, '/pwa')
  const origin = originOf()
  const installable =
    manifest.display === 'standalone' &&
    manifest.start_url === '/' &&
    manifest.scope === '/' &&
    manifest.icons.length >= 2 &&
    manifest.shortcuts.length === VE_FACES &&
    QPU_PWA_DOORS.length === VE_FACES
  const work = {
    compareHolds: qpuCompareHolds(compare),
    compareRows: compare.length,
    cache: QPU_PWA_DOORS.length,
    shortcuts: manifest.shortcuts.length,
    version: QPU_VERSION,
  }
  const holds =
    installable === true &&
    work.compareHolds === true &&
    work.cache === VE_FACES &&
    work.shortcuts === VE_FACES &&
    new Set(QPU_PWA_DOORS).size === VE_FACES &&
    new URL(manifest.id).hostname === QPU_HOST &&
    new URL(href).hostname === QPU_HOST &&
    sw.includes(QPU_HOST) &&
    sw.includes(`qpu-${QPU_VERSION}`) &&
    sw.includes('/manifest.webmanifest') &&
    qpuSeatOf().seat === 'empty' &&
    qpuQuantumHolds(quantum) &&
    quantum.live === true &&
    quantum.working === true &&
    manifest.protocol_handlers[0]!.protocol === 'web+qpu' &&
    manifest.share_target.method === 'GET' &&
    manifest.file_handlers[0]!.action === '/' &&
    manifest.prefer_related_applications === false
  return {
    kind: 'pwa' as const,
    product: 'QPU',
    proof: { concept: true as const, work: true as const },
    replica: false as const,
    fractal: true as const,
    plugin: 'hologram' as const,
    holds,
    installable,
    when: 'never' as const,
    fetches: 0 as const,
    hardware: 'any' as const,
    binds: false as const,
    seat: qpuSeatOf().seat,
    host: QPU_HOST,
    origin,
    display: manifest.display,
    worker: namedHttpsOf(QPU_HOST, '/sw.js'),
    manifest: { href: namedHttpsOf(QPU_HOST, '/manifest.webmanifest'), ...manifest },
    icon: namedHttpsOf(QPU_HOST, '/icon.svg'),
    screenshot: qpuOgHrefOf(),
    doors: [...QPU_PWA_DOORS],
    faces: VE_FACES,
    live: quantum.live,
    working: quantum.working,
    work,
    streaming: { href },
  }
}

export const qpuPwaHolds = (p = qpuPwaOf()): boolean =>
  p.holds === true &&
  p.kind === 'pwa' &&
  p.product === 'QPU' &&
  p.proof.concept === true &&
  p.proof.work === true &&
  p.replica === false &&
  p.fractal === true &&
  p.plugin === 'hologram' &&
  p.installable === true &&
  p.display === 'standalone' &&
  p.when === 'never' &&
  p.fetches === 0 &&
  p.hardware === 'any' &&
  p.binds === false &&
  p.seat === 'empty' &&
  p.host === QPU_HOST &&
  p.doors.length === VE_FACES &&
  p.manifest.shortcuts.length === VE_FACES &&
  p.work.compareHolds === true &&
  p.live === true &&
  p.working === true &&
  new URL(p.streaming.href).pathname === '/pwa' &&
  new URL(p.worker).pathname === '/sw.js' &&
  new URL(p.manifest.href).pathname === '/manifest.webmanifest'
