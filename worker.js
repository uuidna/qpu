/** theorem qpuWorker : default fetch is dist/quantum/processing/unit. */
import unit from './dist/quantum/processing/unit/index.js'
// the cross formulas, audit formulas and paths register themselves as hex callables (cross.*, audit.*, path.*)
import './dist/mcp/cross-domain-formulas.js'
import './dist/mcp/cross-domain-paths.js'
import './dist/audit/audit-formulas.js'

// the documentation site, generated from the inline docs: browsers asking the host for HTML get the pages, every
// other client keeps the JSON-LD API on the same paths
import pages from './docs/site/pages.js'

const deployed = 'public, max-age=3600'
const pageOf = (request, env) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') return undefined
  const url = new URL(request.url)
  if (url.hostname !== (env?.QPU_HOST ?? 'qpu.uuidna.com')) return undefined
  const page = pages[url.pathname]
  if (page === undefined) return undefined
  // a .html path is always the page; / is the page only for a browser (Accept names text/html before JSON)
  const accept = request.headers.get('accept') ?? ''
  if (url.pathname === '/' && !/text\/html/.test(accept)) return undefined
  return new Response(request.method === 'HEAD' ? null : page, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': deployed, vary: 'Accept', link: '</.well-known/mcp.json>; rel="service-desc"' } })
}
const edgeOf = (request, env) => {
  if (request.method !== 'GET' || typeof caches === 'undefined') return false
  const url = new URL(request.url)
  return url.hostname === (env?.QPU_HOST ?? 'qpu.uuidna.com') && url.pathname !== '/api' && !url.pathname.startsWith('/api/')
}

export default {
  ...unit,
  async fetch(request, env, ctx) {
    const page = pageOf(request, env)
    if (page) return page
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
