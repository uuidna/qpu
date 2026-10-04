import {
  MCP_EXTENSIONS,
  RECEIPTS,
  SERVED,
  badRequest,
  coins,
  dead,
  found,
  headers,
  hexHref,
  integrityOnceOf,
  isUnknownTool,
  jsonOf,
  lost,
  mintOf,
  n,
  networkHref,
  pureArgs,
  pureTools,
  qpuCiteOf,
  qpuCssOf,
  qpuForeignReadsOf,
  qpuHexCatalogOf,
  qpuHexRunOf,
  qpuHexToolsOf,
  qpuInstallManifestOf,
  qpuLeanOf,
  qpuMcpCallOf,
  qpuMcpDiscoverOf,
  qpuMcpOf,
  qpuMcpToolsListOf,
  qpuMessageOf,
  qpuMintReceiptOf,
  qpuNetworkMcpOf,
  qpuNetworkToolsOf,
  qpuOpenApiOf,
  qpuProveHolds,
  qpuQuantumOf,
  qpuReceiptStreamsOf,
  qpuRobotsOf,
  qpuRouterOf,
  qpuServerMcpOf,
  qpuServerSubmitOf,
  qpuServerToolsOf,
  qpuSitemapOf,
  qpuStorageListOf,
  qpuStorageMaintainOf,
  qpuStorageMcpOf,
  qpuStorageOf,
  qpuStorageToolsOf,
  qpuSubRpcOf,
  qpuTenantZoneOf,
  qpuWellKnownOf,
  qpuZoneHostOf,
  rpcCodes,
  rpcErrorOf,
  rpcMethods,
  sandboxEpoch,
  seed,
  servedMemo,
  servedOf,
  serverHref,
  serverJobs,
  storageHref,
  ten,
  unauthorized,
  unit,
} from './index.js'
import type { QpuEnv, Served } from './index.js'
import { leanSource } from './lean.js'
import { packageVersion } from './version.js'

/** The unit's front door, cooled out of index.ts by the heat family: the Workers fetch that routes every path to
 *  the door that answers it, and hands the rest to Payload. Moved verbatim; index.ts keeps it as its default export.
 * @wing agents
 * @kind function
 */
export const worker = {
  async fetch(request: Request, env?: QpuEnv): Promise<Response> {
    const host = env?.QPU_HOST ?? unit.host
    // THE SEAT RIDES ON THE ANSWER (the captain, 2026-09-13: the unit is a router of referrers). Set once the path
    // is known, below; every response then carries where it was computed and which door answered, so a caller can
    // see the decision instead of taking it on trust. Empty until then, which is the honest reading before a path.
    let routeHeaders: Record<string, string> = {}
    // THE ENVELOPE DECIDES THE MEDIA TYPE, ONCE, FOR EVERY DOOR. An MCP client reads the content type before the body
    // and refuses application/ld+json outright — measured as CLIENT_HTTP_UNEXPECTED_CONTENT, which is why this unit's
    // own door could not be connected to at all. That cure was written by hand inside the POST /mcp branch and nowhere
    // else, so the other doors answering JSON-RPC (/network, /server, and /storage, whose POST takes an envelope
    // although it is declared rest) kept serving the one media type that refuses them. A JSON-RPC answer names itself
    // in its own envelope, so nothing has to be listed: the answer is asked what it is.
    const rpcMedia = { 'content-type': 'application/json; charset=utf-8' } as const
    const isRpc = (body: unknown): boolean => {
      const one = (x: unknown) => x !== null && typeof x === 'object' && (x as { jsonrpc?: unknown }).jsonrpc === '2.0'
      return Array.isArray(body) ? body.length > n - n && body.every(one) : one(body)
    }
    // A RESPONSE WITH NO BODY DECLARES NO MEDIA TYPE. The redirect below already did this and the other three drifted
    // from it, each promising bytes in a content type it then sent none of. On the 405 that promise is what broke the
    // handshake: the client read a media type it refuses and never reached the status telling it to fall back to POST.
    const emptyHeaders = (extra: Record<string, string> = {}) => {
      const out: Record<string, string> = { ...headers, ...routeHeaders, ...extra }
      delete out['content-type']
      return out
    }
    const deployed = { 'cache-control': 'public, max-age=3600' } as const
    const jsonOf = (body: unknown, status = found) =>
      new Response(JSON.stringify(body), { status, headers: { ...headers, ...routeHeaders, ...(isRpc(body) ? rpcMedia : {}) } })
    /** A memoized document: 304 with no body when the client's If-None-Match is its ETag, else the bytes with the ETag. */
    const servedResponse = (row: Served) => {
      if (request.headers.get('if-none-match') === row.etag) return new Response(null, { status: found + ten * ten + mintOf(coins), headers: emptyHeaders({ etag: row.etag, ...deployed }) })
      return new Response(row.body, { status: found, headers: { ...headers, ...routeHeaders, etag: row.etag, ...deployed } })
    }
    if (host !== unit.host || host.includes('*') || !unit.holds || !integrityOnceOf()) {
      return jsonOf(JSON.parse(dead), lost)
    }
    const url = new URL(request.url)
    const raw = url.pathname.replace(/\/$/, '') || '/'
    const path = raw === '/index.html' ? '/' : raw
    const route = qpuRouterOf(request.headers.get('referer') ?? '', path)
    routeHeaders = { 'x-qpu-seat': route.seat, 'x-qpu-door': route.door }
    // QPU SERVES ALL LICENSED SITES (the captain, 2026-09-13). A tenant site lives one level under the zone —
    // <slug>.uuidna.com, the level Cloudflare's free certificate covers — and reaches this unit through a *.<zone> route.
    // It is forwarded whole to Payload over the binding, Host preserved, so Payload's tenancy rules decide what it is. The
    // zone and its reserved labels are qpuTenantZoneOf, the one declaration Payload reads too (payload src/access.ts,
    // tenantSlugOf); www keeps redirecting to the apex.
    // THE CRAWLABLE PAIR IS ANSWERED HERE FOR EVERY FIRST-PARTY HOST, ahead of both the tenant forward and the
    // named gate, and it is the ONLY thing this widening takes over. Everything else on a sibling host continues
    // exactly where it went before — which, measured 2026-09-28, is Payload over the binding: all four of lean,
    // unreal, hardware and school answer with x-powered-by: Next.js, Payload today, while their own workers
    // declare custom domains that are plainly not in effect. That disagreement is a lead for whoever owns those
    // routes; it is not something to settle from here by moving where a live page is served from.
    //
    // Taking the pair costs nothing that was being served: each of those hosts 404ed /robots.txt and
    // /sitemap.xml, so Cloudflare's managed default stood in — a file that names no sitemap at all. Off the
    // seven-path guide like the other discovery doors, so no sealed count moves.
    const zoneHost = qpuZoneHostOf(url.hostname)
    if (url.protocol === 'https:' && zoneHost !== undefined) {
      if (path === '/robots.txt')
        return new Response(qpuRobotsOf(zoneHost.host), { status: found, headers: { ...headers, ...routeHeaders, ...deployed, 'content-type': 'text/plain; charset=utf-8' } })
      if (path === '/sitemap.xml')
        return new Response(qpuSitemapOf(zoneHost.host), { status: found, headers: { ...headers, ...routeHeaders, ...deployed, 'content-type': 'application/xml; charset=utf-8' } })
      // THE DISCOVERY RECORD IS THE SAME DOCUMENT ON EVERY NAME, because it describes ONE endpoint and that
      // endpoint is this unit's. A sibling serving a copy that named itself would be the duplicate this whole
      // surface exists to avoid; a sibling serving nothing would leave the <loc> its own sitemap carries
      // unanswerable, which is the soft 404 the sitemap law here forbids — and did forbid while this shipped
      // one, measured live at faf8e51 before it was caught.
      if (path === '/.well-known/mcp.json') return servedResponse(servedOf(path, () => qpuWellKnownOf()))
    }
    const { zone, www, reserved } = qpuTenantZoneOf()
    const label = url.hostname.endsWith(`.${zone}`) ? url.hostname.slice(0, url.hostname.length - zone.length - seed) : ''
    if (url.protocol === 'https:' && label === www) {
      return new Response(null, { status: found + ten * ten + seed, headers: { location: `https://${zone}${url.pathname}${url.search}` } })
    }
    // a tenant under the zone, or a tenant's own domain registered as a Cloudflare for SaaS custom hostname (it reaches
    // this unit only through the */* route once Cloudflare has it active); both go whole to Payload, which decides
    const underZone = label && !label.includes('.') && !label.includes('*') && !reserved.includes(label)
    const ownDomain = url.hostname !== zone && !url.hostname.endsWith(`.${zone}`) && !url.hostname.includes('*')
    if (url.protocol === 'https:' && (underZone || ownDomain)) {
      if (env?.PAYLOAD) return env.PAYLOAD.fetch(request)
      // grounded: theorem false with theorem only: nothing was supplied, so nothing is computed, and what is not computed is not claimed
      return jsonOf({ holds: false, denied: 'payload', reading: 'no PAYLOAD service binding on this host' }, lost)
    }
    const named = url.protocol === 'https:' && url.hostname === unit.host
    if (!named) return jsonOf(JSON.parse(dead), lost)
    // /api IS PAYLOAD, OVER THE BINDING. Registration, REST and the find-only MCP answer at this one host; the hop is not
    // billed as a second request and Payload keeps no public route. It answers its own preflight, so this precedes OPTIONS.
    if (path === '/api' || path.startsWith('/api/')) {
      if (env?.PAYLOAD) return env.PAYLOAD.fetch(request)
      // grounded: theorem false with theorem only: nothing was supplied, so nothing is computed, and what is not computed is not claimed
      return jsonOf({ holds: false, denied: 'payload', reading: 'no PAYLOAD service binding on this host' }, lost)
    }
    if (request.method === 'OPTIONS') return new Response(null, { status: found + coins + coins, headers: emptyHeaders() })
    // PAYLOAD IS THE FRONTEND, ON EVERY PATH. A browser asking for a page (GET, text/html) gets Payload's page when
    // Payload holds one at that address; an API client keeps the unit's JSON on the same path; a page Payload does not
    // hold (a miss, a redirect it keeps for retired routes, an error while it starts) falls through to the unit's door,
    // and if the unit has none either, Payload's own not-found page is the answer (kept, not rendered twice). So a
    // page's address and a door's address may coincide (/receipts, /hex, /storage…) and each answers who asked.
    let pageMiss: Response | undefined
    if (request.method === 'GET' && env?.PAYLOAD && /text\/html/.test(request.headers.get('accept') ?? '')) {
      const page = await env.PAYLOAD.fetch(request)
      if (page.status === found) return page
      if (page.status === lost) pageMiss = page
    }
    if (path === '/health') return jsonOf({ status: 'healthy', holds: true })
    if (path === '/ready') return jsonOf({ status: 'ready', version: packageVersion, holds: qpuProveHolds() })
    if (path === '/receipts' || path.startsWith('/receipts/')) {
      const all = qpuReceiptStreamsOf()
      const stream = path.slice('/receipts/'.length)
      return jsonOf(path === '/receipts' ? { ...all, streams: all.streams.map(({ recent, ...head }) => head) } : all.streams.find((s) => s.stream === stream) ?? { kind: 'receipts' as const, stream, length: n - n, holds: false as const }, path === '/receipts' || all.streams.some((s) => s.stream === stream) ? found : lost)
    }
    if (path === '/metrics') return jsonOf({ mint: qpuMintReceiptOf(), foreign: qpuForeignReadsOf(), receipts: RECEIPTS.length, served: SERVED.length })
    if (path === '/mcp') {
      // STREAMABLE HTTP, HONESTLY (measured 2026-09-12): this unit answers every JSON-RPC request in its POST and opens no
      // server-initiated stream, so a GET asking for text/event-stream gets the spec's other allowed answer — 405 with
      // Allow — and the client falls back to POST instead of parsing a JSON-LD catalog as an event stream.
      if (request.method === 'GET' && (request.headers.get('accept') ?? '').includes('text/event-stream')) {
        return new Response(null, { status: lost + seed, headers: emptyHeaders({ allow: 'POST, OPTIONS' }) })
      }
      if (request.method === 'POST') {
        let parsed: unknown
        try {
          parsed = JSON.parse(await request.text())
        } catch {
          return jsonOf(rpcErrorOf(null, rpcCodes.parse, 'Parse error: the body is not JSON'), badRequest)
        }
        if (Array.isArray(parsed)) {
          // JSON-RPC BATCH. MCP 2025-03-26 allowed batches and 2025-06-18 removed them; a server advertising both accepts
          // them. Every member is re-dispatched through this same door, so a batch is exactly its members; a notification
          // (no id) gets no entry, per JSON-RPC 2.0; an empty array is the spec's Invalid Request.
          const members = parsed as unknown[]
          if (members.length === n - n || !members.every((m) => m !== null && typeof m === 'object' && !Array.isArray(m)))
            return jsonOf(rpcErrorOf(null, rpcCodes.invalid, 'Invalid Request: a batch must be a non-empty array of request objects'), badRequest)
          const auth = request.headers.get('authorization')
          const replies = await Promise.all(members.map(async (m) => {
            const one = new Request(request.url, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json', ...(auth ? { authorization: auth } : {}) }, body: JSON.stringify(m) })
            const r = await worker.fetch(one, env)
            return (m as { id?: unknown }).id === undefined ? null : ((await r.json()) as unknown)
          }))
          return jsonOf(replies.filter((r) => r !== null))
        }
        if (parsed === null || typeof parsed !== 'object') {
          return jsonOf(rpcErrorOf(null, rpcCodes.invalid, 'Invalid Request: expected one JSON-RPC 2.0 request object'), badRequest)
        }
        const body = parsed as { method?: unknown; params?: { name?: unknown; arguments?: unknown; protocolVersion?: unknown }; id?: unknown }
        if (typeof body.method !== 'string') {
          return jsonOf(rpcErrorOf(body.id, rpcCodes.invalid, 'Invalid Request: method must be a string'), badRequest)
        }
        // A JSON-RPC notification carries no id; the server must not answer it. Streamable HTTP: 202 Accepted, no body.
        // (A result with id null — what notifications/initialized returned — is a reply to a request that was never one.)
        if (body.id === undefined) return new Response(null, { status: 202, headers: { ...headers, ...routeHeaders } })
        if (body.method === 'initialize' || body.method === 'server/discover') {
          return jsonOf({ jsonrpc: '2.0', id: body.id ?? null, result: qpuMcpDiscoverOf(body.params?.protocolVersion) })
        }
        if (body.method === 'ping') {
          return jsonOf({ jsonrpc: '2.0', id: body.id ?? null, result: {} })
        }
        /** The envelope carries the request's id, so the memo holds the result's bytes and the envelope is spliced around
         * them — the same bytes JSON.stringify would produce for the whole object. */
        const envelope = (id: unknown, resultBody: string) => new Response(`{"jsonrpc":"2.0","id":${JSON.stringify(id ?? null)},"result":${resultBody}}`, { status: found, headers: { ...headers, ...routeHeaders, ...rpcMedia } })
        if (body.method === 'tools/list') {
          return envelope(body.id, servedOf('tools/list', () => ({ resultType: 'complete' as const, tools: qpuMcpToolsListOf() })).body)
        }
        if (body.method === 'tools/call') {
          const name = typeof body.params?.name === 'string' ? body.params.name : ''
          const args = body.params?.arguments && typeof body.params.arguments === 'object' && !Array.isArray(body.params.arguments) ? (body.params.arguments as Record<string, unknown>) : {}
          if (pureTools.has(name) && pureArgs(args)) {
            // the epoch rides in the key: a forge makes every earlier key unreachable rather than stale
            const key = `call:${name}:${sandboxEpoch}:${JSON.stringify(args)}`
            const hit = servedMemo.get(key)
            if (hit) {
              SERVED.push({ key, fold: hit.etag })
              return envelope(body.id, hit.body)
            }
            const called = await qpuMcpCallOf(name, args, env, request.headers.get('authorization'))
            if (isUnknownTool(called)) return jsonOf(rpcErrorOf(body.id, rpcCodes.params, `Unknown tool: ${name || '(none)'}`, { tools: called.tools }))
            return envelope(body.id, servedOf(key, () => called).body)
          }
          const called = await qpuMcpCallOf(name, args, env, request.headers.get('authorization'))
          if (isUnknownTool(called)) return jsonOf(rpcErrorOf(body.id, rpcCodes.params, `Unknown tool: ${name || '(none)'}`, { tools: called.tools }))
          return jsonOf({ jsonrpc: '2.0', id: body.id ?? null, result: called })
        }
        const extension = MCP_EXTENSIONS.get(body.method)
        if (extension) {
          try {
            const params = body.params && typeof body.params === 'object' && !Array.isArray(body.params) ? (body.params as Record<string, unknown>) : {}
            return jsonOf({ jsonrpc: '2.0', id: body.id ?? null, result: await extension.handler(params, env) })
          } catch (e) {
            const err = e as { code?: unknown; message?: unknown; data?: unknown }
            return jsonOf(rpcErrorOf(body.id, typeof err.code === 'number' ? err.code : rpcCodes.params, typeof err.message === 'string' ? err.message : String(e), err.data))
          }
        }
        return jsonOf(rpcErrorOf(body.id, rpcCodes.method, `Method not found: ${body.method}`, { methods: [...rpcMethods, ...MCP_EXTENSIONS.keys()] }))
      }
      return servedResponse(servedOf('/mcp', () => qpuMcpOf()))
    }
    if (path === `/${unit.fuse.lean}`) {
      return new Response(leanSource, { status: found, headers: { ...headers, ...deployed, 'content-type': 'text/plain; charset=utf-8' } })
    }
    // PAYLOAD IS THE FRONTEND: a browser asking for a page gets the Payload site over the binding; every other client
    // keeps the JSON-LD on the same path
    if (path === '/' && env?.PAYLOAD && /text\/html/.test(request.headers.get('accept') ?? '')) return env.PAYLOAD.fetch(request)
    if (path === '/') return servedResponse(servedOf('/', () => qpuQuantumOf()))
    if (path === `/${unit.path}`) return servedResponse(servedOf(`/${unit.path}`, () => qpuLeanOf()))
    if (path === '/cite') return servedResponse(servedOf('/cite', () => qpuCiteOf()))
    // DISCOVERY DOORS — extras off the seven-path guide (the README names extras as allowed). What an MCP client, a
    // registry, an OpenAPI consumer or a crawler asks for by convention, each derived from the readings above. Measured
    // 2026-09-12: all five answered 404 while the README promised install.json.
    if (path === '/.well-known/mcp.json') return servedResponse(servedOf(path, () => qpuWellKnownOf()))
    if (path === '/mcp.json') return servedResponse(servedOf(path, () => qpuMcpOf()))
    if (path === '/install.json') return servedResponse(servedOf(path, () => qpuInstallManifestOf()))
    if (path === '/openapi.json') return servedResponse(servedOf(path, () => qpuOpenApiOf()))
    /** THE SHEET, WITH THE MEDIA TYPE A BROWSER NEEDS. It was already computed and already served — as a JSON
     * string inside GET /, where nothing can link to it. A stylesheet reachable only by parsing a document that
     * quotes it is a stylesheet no page can use, which is what made the UI incomplete rather than absent.
     *
     * OFF THE SEVEN-PATH GUIDE, like the other discovery paths, so no sealed count moves: docs.api stays rays and
     * extras stays n. And NO HTML IS SERVED HERE — the unit ships the stylesheet and the seating contract, the
     * fourteen frameworks supply the DOM, and payload/src/qpu-surface.ts already states the split ("QPU is
     * API-only JSON-LD; this host is HTML"). A stylesheet is neither a document nor an API; it is the one asset
     * this contract cannot express as JSON. */
    if (path === '/qpu.css') return new Response(qpuCssOf().css, { status: found, headers: { ...headers, ...deployed, 'content-type': 'text/css; charset=utf-8' } })
    const rpcBodyOf = async <X extends object>() =>
      (await request.json().catch(() => ({}))) as { method?: string; params?: { name?: string; arguments?: Record<string, unknown> }; id?: unknown } & X
    const authedOf = (x: { holds?: boolean; denied?: unknown } | object) =>
      jsonOf(x, 'holds' in x && x.holds === false && 'denied' in x && x.denied === 'auth' ? unauthorized : found)
    if (path === '/server' || path.startsWith('/server/')) {
      if (request.method === 'POST') {
        const body = await rpcBodyOf<{ gates?: unknown }>()
        const rpc = await qpuSubRpcOf(body, qpuServerToolsOf(), serverHref)
        if (rpc) return jsonOf(rpc)
        return jsonOf(qpuServerSubmitOf(body))
      }
      if (path.startsWith('/server/') && path.length > '/server/'.length) {
        const id = Number(path.slice('/server/'.length))
        const job = serverJobs.find((row) => row.id === id)
        if (job) return jsonOf({ ...job, stored: false as const })
        // grounded: theorem false with theorem only: nothing was supplied, so nothing is computed, and what is not computed is not claimed
        return jsonOf({ kind: 'result' as const, id, holds: false as const, denied: 'job' as const, why: 'jobs are not stored; the result is returned inline with the submit, and an id lives only as long as the isolate that ran it' }, lost)
      }
      return jsonOf(qpuServerMcpOf())
    }
    if (path === '/hex' || path.startsWith('/hex/')) {
      if (request.method === 'POST') {
        const rpc = await qpuSubRpcOf(await rpcBodyOf(), qpuHexToolsOf(env), hexHref)
        if (rpc) return jsonOf(rpc)
      }
      const program = path.slice('/hex/'.length)
      return jsonOf(program ? await qpuHexRunOf(program, request.headers.get('referer') ?? undefined, env) : qpuHexCatalogOf())
    }
    if (path === '/network' || path.startsWith('/network/')) {
      if (request.method === 'POST') {
        const body = await rpcBodyOf<{ channel?: unknown; body?: unknown }>()
        const rpc = await qpuSubRpcOf(body, qpuNetworkToolsOf(), networkHref)
        if (rpc) return jsonOf(rpc)
        const send = qpuNetworkToolsOf().find((t) => t.name === 'net_send')
        return jsonOf(send ? await send.run(body) : { holds: false as const })
      }
      return jsonOf(qpuNetworkMcpOf())
    }
    if (path === '/storage' || path.startsWith('/storage/')) {
      const key = path === '/storage' ? '' : decodeURIComponent(path.slice('/storage/'.length))
      if (request.method === 'POST' && path === '/storage') {
        const body = await rpcBodyOf<{ maintain?: unknown; key?: unknown; value?: unknown }>()
        const auth = request.headers.get('authorization')
        const rpc = await qpuSubRpcOf(body, qpuStorageToolsOf(env, auth), storageHref)
        if (rpc) return jsonOf(rpc)
        if (body.maintain === true) {
          const kept = await qpuStorageMaintainOf(env, auth)
          return authedOf(kept)
        }
        if (typeof body.key === 'string') {
          const put = await qpuStorageOf(env, { method: 'PUT', key: body.key, value: body.value, auth })
          return authedOf(put)
        }
      }
      if (request.method === 'PUT' || request.method === 'POST') {
        const value = await request.json().catch(() => null)
        const put = await qpuStorageOf(env, { method: 'PUT', key, value, auth: request.headers.get('authorization') })
        return authedOf(put)
      }
      if (request.method === 'DELETE') {
        const del = await qpuStorageOf(env, { method: 'DELETE', key, auth: request.headers.get('authorization') })
        return authedOf(del)
      }
      // GET /storage?prefix=…&limit=… — the links under a prefix, ascending, with their documents (uuidna.com/live reads it)
      const listPrefix = new URL(request.url).searchParams.get('prefix')
      if (path === '/storage' && listPrefix !== null) return jsonOf(await qpuStorageListOf(env, listPrefix, Number(new URL(request.url).searchParams.get('limit') ?? '')))
      if (path === '/storage') return jsonOf(await qpuStorageMcpOf(env))
      return jsonOf(await qpuStorageOf(env, { method: 'GET', key }))
    }
    if (path === '/message') {
      if (request.method === 'POST') {
        const body = (await request.json().catch(() => ({}))) as { lane?: unknown; body?: unknown }
        const sent = qpuMessageOf(body)
        return jsonOf(sent, 'accepted' in sent && sent.accepted === true ? found + coins : found)
      }
      return jsonOf(qpuMessageOf())
    }
    // every path the unit does not answer is Payload's: the admin, its assets, the documentation pages
    if (pageMiss) return pageMiss
    if (env?.PAYLOAD) return env.PAYLOAD.fetch(request)
    return jsonOf(JSON.parse(dead), lost)
  }}
