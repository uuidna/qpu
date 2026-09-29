/** theorem qpuWorker : default fetch is dist/quantum/processing/unit. */
import unit from './dist/quantum/processing/unit/index.js'

const deployed = 'public, max-age=3600'
const edgeOf = (request, env) => {
  if (request.method !== 'GET' || typeof caches === 'undefined') return false
  const url = new URL(request.url)
  return url.hostname === (env?.QPU_HOST ?? 'qpu.uuidna.com') && url.pathname !== '/api' && !url.pathname.startsWith('/api/')
}

export default {
  ...unit,
  async fetch(request, env, ctx) {
    if (!edgeOf(request, env)) return unit.fetch(request, env, ctx)
    const hit = await caches.default.match(request)
    if (hit) return hit
    const response = await unit.fetch(request, env, ctx)
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
