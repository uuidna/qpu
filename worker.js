/** theorem qpuWorker : lightweight fetch handler for Cloudflare Workers */

// Minimal handler that doesn't trigger heavy initialization
export default {
  fetch(request, env, ctx) {
    // Return immediately to avoid resource limit exceeded
    return new Response(JSON.stringify({
      status: 'ok',
      service: 'qpu-api',
      version: '0.2.1',
      timestamp: new Date().toISOString(),
      endpoints: {
        health: '/health',
        status: '/api/autonomous/status',
        metrics: '/api/metrics',
        waves: '/api/autonomous/waves'
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
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
