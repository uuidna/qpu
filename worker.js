/** theorem qpuWorker : default fetch is dist/quantum/processing/unit, and its PAYLOAD is the Payload app in this isolate.
 *  ONE WORKER: qpu runs on Payload running on qpu. The unit answers what it answers and hands browser pages and /api to
 *  the Payload app (OpenNext, .open-next/worker.js) in-process, where a service binding used to carry them; the app keeps
 *  its documents in the unit's own storage (db/payload on STORAGE and BLOBS). */
import unit from './dist/quantum/processing/unit/index.js'
// @ts-ignore built by `opennextjs-cloudflare build`
import app from './.open-next/worker.js'
// One registry: the build beside this worker. The unit's qpuFamilyRegistryUrlOf names this same module.
import './dist/mcp/families.js'

// THE EDGE CACHE Cloudflare's CDN will not hold for a Worker-generated response (Worker sits in front of the
// cache). Same pattern as quintessay/worker.ts: caches.default, URL-only key, only shareable public GETs,
// waitUntil(put). Pages and /api stay with Payload; HTML Accept and session cookies never enter the store.
const ORIGINAL = 'x-origin-cache-control'

const edgeOf = (request, env) => {
  if (request.method !== 'GET' || typeof caches === 'undefined') return false
  if (request.headers.has('authorization')) return false
  if (/(?:^|;\s*)payload-token=/.test(request.headers.get('cookie') ?? '')) return false
  if (request.headers.has('rsc') || request.headers.has('next-router-state-tree')) return false
  // pages are Payload's and are not cached here: the cache keys on the URL, and a browser and an API client share it
  if (/text\/html/.test(request.headers.get('accept') ?? '')) return false
  const url = new URL(request.url)
  if (url.searchParams.has('_rsc')) return false
  return url.hostname === (env?.QPU_HOST ?? 'qpu.uuidna.com') && url.pathname !== '/api' && !url.pathname.startsWith('/api/')
}

const sharedLifetime = (response) => {
  if (response.status !== 200 || response.headers.has('set-cookie')) return null
  const cc = response.headers.get('cache-control') ?? ''
  if (!/\bpublic\b/i.test(cc) || /\b(private|no-store)\b/i.test(cc)) return null
  const s = /s-maxage=(\d+)/i.exec(cc) || /(?:^|[,;\s])max-age=(\d+)/i.exec(cc)
  return s ? Number(s[1]) : null
}

const tagged = (response, state) => {
  const out = new Response(response.body, response)
  out.headers.set('x-edge-cache', state)
  return out
}

// the app as the unit's PAYLOAD: the same request, this Worker's env and context
const withApp = (env, ctx) => ({ ...env, PAYLOAD: { fetch: (request) => app.fetch(request, env, ctx) } })

export default {
  ...unit,
  async fetch(request, env, ctx) {
    const qpu = withApp(env, ctx)
    if (!edgeOf(request, env)) return unit.fetch(request, qpu, ctx)

    const cache = caches.default
    const key = new Request(request.url, { method: 'GET' })

    const hit = await cache.match(key)
    if (hit) {
      const out = tagged(hit, 'HIT')
      const original = out.headers.get(ORIGINAL)
      if (original) out.headers.set('cache-control', original)
      out.headers.delete(ORIGINAL)
      return out
    }

    const response = await unit.fetch(request, qpu, ctx)
    const lifetime = sharedLifetime(response)
    if (lifetime === null || lifetime <= 0) return response

    const stored = new Response(response.clone().body, response)
    stored.headers.set(ORIGINAL, response.headers.get('cache-control') ?? '')
    stored.headers.set('cache-control', `public, max-age=${lifetime}`)
    stored.headers.delete('vary')
    ctx.waitUntil(cache.put(key, stored))
    return tagged(response, 'MISS')
  },
}

// THE DEPOSIT DOOR IS A SERVICE BINDING, NOT A TOKEN (the captain, 2026-09-14: deposits through the MCP door, "no token
// on host"). uuidna's Worker binds this entrypoint (wrangler [[services]] entrypoint = "QpuDeposit") and hands its
// deposit to the MCP door; Cloudflare routes no public request to a named entrypoint's methods, so the binding is the
// credential. It writes through the same qpuStorageOf every storage write uses — the same key form, inode and
// referrer — marked via: 'binding', which only this method sets. It lives here, in the Workers entry, because
// cloudflare:workers exists only inside the Workers runtime; the unit's Node tests never load it.
import { WorkerEntrypoint } from 'cloudflare:workers'
import { qpuStorageOf } from './dist/quantum/processing/unit/index.js'

export class QpuDeposit extends WorkerEntrypoint {
  async deposit(key, value) {
    return qpuStorageOf(this.env, { method: 'PUT', key, value, via: 'binding' })
  }
}

// the app's Durable Objects and handlers (cache queue, tag cache), as OpenNext exports them
// @ts-ignore built by `opennextjs-cloudflare build`
export * from './.open-next/worker.js'
