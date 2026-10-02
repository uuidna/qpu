/** theorem qpuWorker : default fetch is dist/quantum/processing/unit. */
import unit from './dist/quantum/processing/unit/index.js'
// the cross formulas, audit formulas and paths register themselves as hex callables (cross.*, audit.*, path.*)
import './dist/mcp/cross-domain-formulas.js'
import './dist/mcp/cross-domain-paths.js'
import './dist/audit/audit-formulas.js'
import './dist/mcp/quantum-secure-signalling.js'
import './dist/mcp/hologram-streams.js'
import './dist/mcp/crypt-formulas.js'
import './dist/mcp/np-formulas.js'
import './dist/mcp/mcp-capabilities.js'

const deployed = 'public, max-age=3600'
const edgeOf = (request, env) => {
  if (request.method !== 'GET' || typeof caches === 'undefined') return false
  const url = new URL(request.url)
  // pages are Payload's and are not cached here: the cache keys on the URL, and a browser and an API client share it
  if (/text\/html/.test(request.headers.get('accept') ?? '')) return false
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
