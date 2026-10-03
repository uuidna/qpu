/** theorem qpuWorker : default fetch is dist/quantum/processing/unit, and its PAYLOAD is the Payload app in this isolate.
 *  ONE WORKER: qpu runs on Payload running on qpu. The unit answers what it answers and hands browser pages and /api to
 *  the Payload app (OpenNext, .open-next/worker.js) in-process, where a service binding used to carry them; the app keeps
 *  its documents in the unit's own storage (db/payload on STORAGE and BLOBS). */
import unit from './dist/quantum/processing/unit/index.js'
// @ts-ignore built by `opennextjs-cloudflare build`
import app from './.open-next/worker.js'
// every hex family, fused door and MCP method registers itself on import: src/mcp/families.ts is generated from the
// modules that do so, and this is the one import of them
import './dist/mcp/families.js'

const deployed = 'public, max-age=3600'
const edgeOf = (request, env) => {
  if (request.method !== 'GET' || typeof caches === 'undefined') return false
  const url = new URL(request.url)
  // pages are Payload's and are not cached here: the cache keys on the URL, and a browser and an API client share it
  if (/text\/html/.test(request.headers.get('accept') ?? '')) return false
  return url.hostname === (env?.QPU_HOST ?? 'qpu.uuidna.com') && url.pathname !== '/api' && !url.pathname.startsWith('/api/')
}

// the app as the unit's PAYLOAD: the same request, this Worker's env and context
const withApp = (env, ctx) => ({ ...env, PAYLOAD: { fetch: (request) => app.fetch(request, env, ctx) } })

export default {
  ...unit,
  async fetch(request, env, ctx) {
    const qpu = withApp(env, ctx)
    if (!edgeOf(request, env)) return unit.fetch(request, qpu, ctx)
    const hit = await caches.default.match(request)
    if (hit) return hit
    const response = await unit.fetch(request, qpu, ctx)
    if (response.status === 200 && response.headers.get('cache-control') === deployed) ctx.waitUntil(caches.default.put(request, response.clone()))
    return response
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
