// The Worker: the same pure `handle` served over HTTP at /mcp so the unit's fan-out (uuidna_fanout → qpu.uuidna.com) and
// any MCP client reach the sixteen tools; the discovery document at /.well-known/qpu.json stating only what this tree is;
// and a Durable Object docket where this tree and the unit append receipts and leads by content address and read each
// other's. Reads need no auth; docket writes carry `Authorization: Bearer QPU_WRITE_TOKEN` (a wrangler secret, never
// committed). Every response carries the licence.
import { handle, type Rpc } from './quantum/mcp.js'
import { EXAMPLES } from './quantum/examples.js'
import { LEADS } from './quantum/leads.js'
import { LICENSE } from './quantum/license.js'
import { uuidOf, sealOf, channelOf, uuidFromParts, compileOf, reflectionOf, type Step } from './quantum/blocks.js'
import { cssOf, accentOfUuid, cmykOfUuid, hueOf, KEY } from './quantum/theme.js'
import { LOCALES as LANGS, translateOf } from './quantum/i18n.js'
import { DEFAULT_MCP_HOSTS } from './quantum/discovery.js'
import { hashOf as contentHashOf } from './quantum/e2e.js'
import { VERSION } from './quantum/version.js'

/** The slice of the Workers runtime this file uses, typed here so the tree needs no runtime types package to typecheck. */
export type Storage = { get<T>(key: string): Promise<T | undefined>; put(key: string, value: unknown): Promise<void>; delete(key: string): Promise<unknown>; list<T>(opts?: { prefix?: string }): Promise<Map<string, T>> }
export type DocketStub = { fetch(request: Request): Promise<Response> }
export type Env = { QPU_WRITE_TOKEN?: string; QPU_ADMIN_TOKEN?: string; QPU_DATA_KEY?: string; QPU_MIRRORS?: string; /** the MCP host that manages roles (a Payload MCP plugin): tools/call of QPU_RBAC_TOOL with { token, tenant, host } answers { role } */ QPU_RBAC_MCP?: string; QPU_RBAC_TOOL?: string; /** the built site, served as static assets by the same Worker: the web OS */ ASSETS?: { fetch(request: Request): Promise<Response> }; DOCKET?: { idFromName(name: string): unknown; get(id: unknown): DocketStub }; [tenantToken: string]: unknown }

/** Tenants: one Worker, several hosts, each host its own docket and its own tokens. A security collision — one tenant's token
 * at another tenant's host — is not an incident but a procedure: the answer names the role, the header and who issues it. */
import { TENANTS, tenantOf } from './quantum/tenants.js'
export { TENANTS, tenantOf }
export type Role = 'reader' | 'writer' | 'admin'
export const ROLES: Readonly<Record<Role, { may: string; header: string | null; issued: string }>> = {
  reader: { may: 'GET: read the docket, the discovery document, every tool over POST /mcp', header: null, issued: 'no token: every reader is a reader' },
  writer: { may: 'POST /docket: append entries, commitments and reveals to this tenant\'s docket', header: 'Authorization: Bearer <writer token of this tenant>', issued: 'by the author, one wrangler secret per tenant (QPU_WRITE_TOKEN_<TENANT>) or the shared QPU_WRITE_TOKEN' },
  admin: { may: 'DELETE /docket/<id>: delete an unlinked entry of this tenant\'s docket', header: 'Authorization: Bearer <admin token of this tenant>', issued: 'by the author, one wrangler secret per tenant (QPU_ADMIN_TOKEN_<TENANT>) or the shared QPU_ADMIN_TOKEN' },
}
/** The role a request holds at a tenant. Asked first of the RBAC MCP host when one is configured (every MCP server's roles
 * managed in one place, over MCP itself); the tenant secrets answer when none is, or when the host does not. */
export const roleAt = async (env: Env, tenant: string, host: string, token: string | undefined, fetcher: (url: string, init: RequestInit) => Promise<Response> = fetch): Promise<{ role: Role; collision?: string; by: 'rbac-mcp' | 'tenant-secrets' }> => {
  if (env.QPU_RBAC_MCP && token) {
    try {
      const res = await fetcher(env.QPU_RBAC_MCP, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: env.QPU_RBAC_TOOL ?? 'role', arguments: { token, tenant, host } } }), signal: AbortSignal.timeout(5000) })
      const j = await res.json() as { result?: { structuredContent?: { role?: string }; content?: { text: string }[] } }
      const role = j.result?.structuredContent?.role ?? (j.result?.content?.[0] ? (JSON.parse(j.result.content[0].text) as { role?: string }).role : undefined)
      if (role === 'reader' || role === 'writer' || role === 'admin') return { role, by: 'rbac-mcp' }
    } catch { /* the RBAC host did not answer: the tenant secrets decide, and the answer says so */ }
  }
  return { ...roleOf(env, tenant, token), by: 'tenant-secrets' }
}
/** The role a request holds at a tenant, from its token alone; a token of another tenant holds no role here and says so. */
export const roleOf = (env: Env, tenant: string, token: string | undefined): { role: Role; collision?: string } => {
  const T = tenant.toUpperCase()
  const tokenOf = (kind: 'WRITE' | 'ADMIN', t: string) => (env[`QPU_${kind}_TOKEN_${t.toUpperCase()}`] as string | undefined) ?? (env[`QPU_${kind}_TOKEN`] as string | undefined)
  if (!token) return { role: 'reader' }
  if (sameToken(token, tokenOf('ADMIN', T))) return { role: 'admin' }
  if (sameToken(token, tokenOf('WRITE', T))) return { role: 'writer' }
  const other = Object.values(TENANTS).concat('ceci', 'local').find((t) => t !== tenant && (sameToken(token, tokenOf('WRITE', t)) || sameToken(token, tokenOf('ADMIN', t))))
  return other ? { role: 'reader', collision: `a token of tenant ${other} presented at tenant ${tenant}: tokens are per tenant; ask the author for a ${tenant} token (${ROLES.writer.issued})` } : { role: 'reader' }
}

const LICENSE_HEADERS = { 'X-Qpu-Version': VERSION, 'Link': `<${LICENSE.url}>; rel="license"`, 'X-License': LICENSE.spdx, 'X-Copyright': LICENSE.copyright, 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'content-type, authorization', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS' }
const json = (body: unknown, status = 200, extra: Record<string, string> = {}): Response => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', ...LICENSE_HEADERS, ...extra } })
/** Streaming by default: a client that accepts text/event-stream receives the reply as the MCP streamable transport's event (event: message, data: the JSON-RPC reply), the same headers kept; a client that does not receives JSON. */
const streams = (request: Request): boolean => /text\/event-stream/.test(request.headers.get('accept') ?? '')
const replyOf = (request: Request, body: unknown, status = 200, extra: Record<string, string> = {}): Response => (streams(request) && status === 200 ? new Response(`event: message\ndata: ${JSON.stringify(body)}\n\n`, { status, headers: { 'content-type': 'text/event-stream; charset=utf-8', 'cache-control': 'no-cache', ...LICENSE_HEADERS, ...extra } }) : json(body, status, extra))
/** The involution that costs Cloudflare nothing: a reply is addressed by its block (content), so a client that holds the address asks with If-None-Match and receives 304 — no body computed, no bytes sent; a reply the address names is immutable and cacheable for a year anywhere between. */
const involuted = (request: Request, address: string | null, response: Response, content?: string): Response => {
  if (!address) return response
  const etag = `"${content ?? address}"`
  // the teleport: 304 carries the hash and the address, so the destination verifies the analog it holds digitally, in full
  if (request.headers.get('if-none-match') === etag) return new Response(null, { status: 304, headers: { etag, 'x-qpu-address': address, 'cache-control': 'public, max-age=31536000, immutable', ...LICENSE_HEADERS } })
  const headers = new Headers(response.headers); headers.set('etag', etag); headers.set('cache-control', 'public, max-age=31536000, immutable'); headers.set('x-qpu-address', address)
  return new Response(response.body, { status: response.status, headers })
}
const addressOfReply = (reply: unknown): string | null => { const r = reply as { result?: { _meta?: { block?: { meta?: { id?: string } } } } }; return r.result?._meta?.block?.meta?.id ?? null }

/** What this tree is, stated from its own values: nothing here is typed that the handler does not compute. */
export const discoveryOf = (origin: string, env?: Env) => {
  const tenant = tenantOf(new URL(origin).hostname)
  const version = VERSION
  const list = handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) as { result: { tools: { name: string }[] } }
  const names = list.result.tools.map((t) => t.name)
  return {
    name: '@uuidna/qpu', kind: 'qpu', mcp: `${origin}/mcp`, docket: `${origin}/docket`, methods: ['initialize', 'tools/list', 'tools/call'],
    version, versioning: 'quantum: versions coexist — every block and every page is addressed by content, so an earlier version\'s addresses answer beside the new one\'s and a migration moves no address; the e2e gate reads each host\'s version and decodes hosts on different versions as copies of one value', tenant, tenants: Object.entries(TENANTS).map(([host, t]) => ({ host, tenant: t, docket: `https://${host}/docket` })), mcpHosts: (((env as unknown as Record<string, string | undefined>)?.[`QPU_MCP_HOSTS_${tenant.toUpperCase()}`]) ?? DEFAULT_MCP_HOSTS.join(',')).split(',').map((s) => s.trim()).filter(Boolean), mcpHostsNote: 'tenant configurable: QPU_MCP_HOSTS_<TENANT> names the MCP hosts this tenant discovers and extends; QPU_MCP_TOKEN_<HOST>_<TENANT> its token per host; Cloudflare\'s servers are discovered by default, the documentation one in the open, the others when the tenant brings its OAuth token', roles: ROLES, rbac: 'one Worker, one docket per tenant (host); roles asked of the RBAC MCP host when one is configured (a Payload MCP plugin managing every MCP server\'s roles over MCP itself), otherwise one writer and one admin token per tenant; a token at another tenant\'s host holds no role there and the answer names the procedure',
    tools: names, examples: EXAMPLES.length, leads: LEADS.length,
    bounds: { shorN: 21, qubits: 6, bits: 8, nodes: 12, note: 'the exact state-vector simulator; every bound is in each tool\'s input schema' },
    key: KEY, license: { spdx: LICENSE.spdx, url: LICENSE.url, address: LICENSE.address, imprint: LICENSE.imprint, author: LICENSE.author, orcid: LICENSE.orcid },
    reverse: { host: 'uuidna.com', mcp: 'https://uuidna.com/mcp', note: 'this tree asks the unit for readiness, rights and auras each run; the unit fans out to this host' },
    honest: 'A pure handler over HTTP: no hardware, no network inside the tools, nothing factored beyond N ≤ 21.',
  }
}

/** The docket: one table of content-addressed entries and four verbs.
 *    GET  /docket?kind=&since=      the stream as a cursor
 *    GET  /docket/:id[?cheap][?heal] one entry: its body reassembled and re-hashed (parity rebuilds one lost fragment); `cheap`
 *                                     checks seal and fingerprints without decrypting; `heal` fetches a failing entry from the mirrors.
 *                                     Asked for text/html (or ?og), the id is a PAGE whose head — SEO and Open Graph tags, the aura
 *                                     swatch, the licence — is computed from the UUID ALONE (handle, hex program, message tail), with no
 *                                     lookup and no decryption; the body loads client-side from the JSON route. A UUID with no entry here
 *                                     still unfurls.
 *    POST /docket                    { kind, from, body, links? } writes content; { kind, from, address, sha256 } with no body is a
 *                                     COMMITMENT (fingerprints now, witnessed by every mirror that records it); writing the content
 *                                     later REVEALS it into the same entry. Same content twice is stored once. Same address with a
 *                                     different SHA-256 is a fold COLLISION: both kept, both fingerprinted, a collision lead written.
 *                                     A COMMIT'S IMPRINT is a commitment whose address carries the commit's eight hex as handle (the
 *                                     receipt's program and tail behind it) and links the receipt, so /<commit> opens the commit's family
 *                                     and /<commit>/<program>/<tail> walks on from the receipt's own program.
 *                                     A write REPLICATES: the same entry is forwarded to every configured mirror in the same call
 *                                     and the answer says where it landed.
 *    DELETE /docket/:id              refused while any link points at the entry; releases its links and unshared fragments.
 *  Fragments are AES-GCM under this mirror's key; addresses are the fold of the plaintext (so every mirror names content
 *  identically while ciphering it differently); the SHA-256 beside the fold is the fingerprint against a searching adversary.
 *  Parity is per STRIPE of four fragments, so one lost fragment per stripe is rebuilt and a large entry survives several losses.
 *  Identical fragments share one stored copy, so a lost SHARED fragment is lost in every stripe that names it: that case is the
 *  mirrors' to heal, not the parity's.
 *  The list carries a ROOT, the address of every entry's id and SHA-256, so two mirrors compare whole dockets with one value;
 *  a cheap read asks each mirror for its fingerprint of the entry and reports the agreement. */
export const STRIPE = 4
export const FRAGMENT_BYTES = 32 * 1024
export const MAX_ENTRY_BYTES = 4 * 1024 * 1024
const ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
const enc = new TextEncoder()
const dec = new TextDecoder()
const latin1 = (b: Uint8Array): string => { let s = ''; for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode(...b.subarray(i, i + 0x8000)); return s }
const b64 = (b: Uint8Array): string => btoa(latin1(b))
const unb64 = (t: string): Uint8Array => Uint8Array.from(atob(t), (c) => c.charCodeAt(0))
const buf = (u: Uint8Array): ArrayBuffer => u.buffer.slice(u.byteOffset, u.byteOffset + u.byteLength) as ArrayBuffer
export const hashOf = (bytes: Uint8Array): string => uuidOf(latin1(bytes))
export const sha256Of = async (bytes: Uint8Array): Promise<string> => [...new Uint8Array(await crypto.subtle.digest('SHA-256', buf(bytes)))].map((b) => b.toString(16).padStart(2, '0')).join('')
/** Constant-time string equality, so a token comparison leaks no prefix. */
export const sameToken = (a: string | undefined, b: string | undefined): boolean => {
  if (!a || !b) return false
  const x = enc.encode(a), y = enc.encode(b)
  let diff = x.length ^ y.length
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i % x.length] ?? 0) ^ (y[i % y.length] ?? 0)
  return diff === 0
}
const xorOf = (parts: Uint8Array[], length: number): Uint8Array => { const out = new Uint8Array(length); for (const p of parts) for (let i = 0; i < p.length; i++) out[i]! ^= p[i]!; return out }
const split = (bytes: Uint8Array): Uint8Array[] => { const parts: Uint8Array[] = []; for (let i = 0; i < bytes.length || parts.length === 0; i += FRAGMENT_BYTES) parts.push(bytes.subarray(i, Math.min(i + FRAGMENT_BYTES, bytes.length))); return parts }

/** One entry. `fragments` empty means committed and not yet revealed. */
type Entry = { id: string; kind: string; from: string; date: string; bytes: number; sha256: string; fragments: string[]; lengths: number[]; parities: string[]; links: string[]; committedAt?: string; witness?: string; revealedAt?: string; collisions?: { sha256: string; kind: string; from: string; date: string; fragments: string[]; lengths: number[]; parities: string[] }[] }
type Sealed = { iv: string; ct: string }

export class Docket {
  private key: Promise<CryptoKey> | null = null
  constructor(private readonly storage: Storage, private readonly dataKey?: string, private readonly mirrors: string[] = [], private readonly fetcher: (url: string, init?: RequestInit) => Promise<Response> = (u, i) => fetch(u, i), private readonly writeToken?: string) {}
  private keyOf(): Promise<CryptoKey> {
    if (!this.key) {
      if (!this.dataKey) throw new Error('no data key')
      const raw = unb64(this.dataKey)
      if (raw.length !== 32) throw new Error('QPU_DATA_KEY must be 32 bytes, base64')
      this.key = crypto.subtle.importKey('raw', buf(raw), 'AES-GCM', false, ['encrypt', 'decrypt'])
    }
    return this.key
  }
  private async seal(plain: Uint8Array): Promise<Sealed> { const iv = crypto.getRandomValues(new Uint8Array(12)); return { iv: b64(iv), ct: b64(new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: buf(iv) }, await this.keyOf(), buf(plain)))) } }
  private async open(x: Sealed): Promise<Uint8Array> { return new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: buf(unb64(x.iv)) }, await this.keyOf(), buf(unb64(x.ct)))) }
  private async fragment(hash: string): Promise<Uint8Array | null> {
    const sealed = await this.storage.get<Sealed>(`frag:${hash}`)
    if (!sealed) return null
    try { const plain = await this.open(sealed); return hashOf(plain) === hash ? plain : null } catch { return null }
  }
  private async bump(prefix: 'fref' | 'ref', id: string, by: number): Promise<number> {
    const n = ((await this.storage.get<number>(`${prefix}:${id}`)) ?? 0) + by
    if (n <= 0) await this.storage.delete(`${prefix}:${id}`); else await this.storage.put(`${prefix}:${id}`, n)
    return Math.max(0, n)
  }
  private static stripesOf(parts: Uint8Array[]): Uint8Array[][] { const out: Uint8Array[][] = []; for (let i = 0; i < parts.length; i += STRIPE) out.push(parts.slice(i, i + STRIPE)); return out }
  private async store(parts: Uint8Array[]): Promise<{ fragments: string[]; lengths: number[]; parities: string[] }> {
    const put = async (p: Uint8Array) => { const h = hashOf(p); if (!(await this.storage.get(`frag:${h}`))) await this.storage.put(`frag:${h}`, await this.seal(p)); await this.bump('fref', h, 1); return h }
    const fragments: string[] = []
    for (const p of parts) fragments.push(await put(p))
    const parities: string[] = []
    for (const stripe of Docket.stripesOf(parts)) parities.push(await put(xorOf(stripe, Math.max(...stripe.map((p) => p.length)))))
    return { fragments, lengths: parts.map((p) => p.length), parities }
  }
  private async release(hashes: string[]): Promise<void> { for (const h of hashes) if ((await this.bump('fref', h, -1)) === 0) await this.storage.delete(`frag:${h}`) }
  private async entry(id: string): Promise<Entry | undefined> { return this.storage.get<Entry>(`row:${id}`) }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)
    const id = url.pathname.split('/').filter(Boolean)[1]
    if (id && !ID.test(id)) return json({ error: 'an entry id is a content-addressed RFC 9562 v8 UUID' }, 400)
    try {
      if (request.method === 'GET' && id) {
        if (url.searchParams.has('og') || /text\/html/.test(request.headers.get('accept') ?? '')) { const nx = nextOf(id, url.origin); return involuted(request, id, pageOf(id, url.origin, { prev: refererOf(request), next: { href: nx.href, label: nx.label }, compiled: nx.compiled })) }
        return await this.read(id, url.searchParams.has('cheap'), url.searchParams.has('heal'))
      }
      if (request.method === 'GET') return await this.list(url.searchParams.get('kind'), url.searchParams.get('since'))
      if (request.method === 'POST' && !id) return await this.write(request)
      if (request.method === 'DELETE' && id) return await this.remove(id)
    } catch (e) {
      if ((e as Error).message === 'no data key') return json({ error: 'this mirror has no QPU_DATA_KEY; it stores nothing' }, 503)
      throw e
    }
    return json({ error: 'GET /docket, GET /docket/:id[?cheap][?heal], POST /docket, DELETE /docket/:id' }, 405)
  }

  private async list(kind: string | null, since: string | null): Promise<Response> {
    const rows = await this.storage.list<Entry>({ prefix: 'row:' })
    const entries = [...rows.values()].filter((m) => (!kind || m.kind === kind) && (!since || m.date > since)).sort((a, b) => a.date.localeCompare(b.date))
    return json({ count: entries.length, root: await this.rootOf(), kind, since, cursor: entries.at(-1)?.date ?? since ?? null, entries: entries.map((m) => ({ id: m.id, kind: m.kind, from: m.from, date: m.date, bytes: m.bytes, sha256: m.sha256, fragments: m.fragments.length, revealed: m.fragments.length > 0, links: m.links, collisions: m.collisions?.length ?? 0 })), license: LICENSE.attribution })
  }

  private async write(request: Request): Promise<Response> {
    const e = await request.json().catch(() => null) as { kind?: string; from?: string; body?: unknown; links?: string[]; address?: string; sha256?: string } | null
    if (!e || !e.kind || !e.from) return json({ error: 'an entry is { kind, from, body, links? }; a commitment is { kind, from, address, sha256 }' }, 400)
    const date = new Date().toISOString()
    // A commitment: fingerprints now, no content. The same entry is revealed later by writing the content.
    if (e.body === undefined) {
      if (!e.address || !e.sha256 || !ID.test(e.address) || !/^[0-9a-f]{64}$/.test(e.sha256)) return json({ error: 'a commitment names an address (v8 UUID) and a sha256 (64 hex)' }, 400)
      const existing = await this.entry(e.address)
      if (existing) return json({ id: existing.id, sha256: existing.sha256, committedAt: existing.committedAt ?? existing.date, revealed: existing.fragments.length > 0, duplicate: true }, 200)
      const clinks = [...new Set(e.links ?? [])]
      for (const l of clinks) { if (!ID.test(l)) return json({ error: `link ${l} is not an entry id` }, 400); if (!(await this.entry(l))) return json({ error: `link ${l} names no entry` }, 404) }
      const witness = uuidOf(JSON.stringify({ address: e.address, sha256: e.sha256, from: e.from, date }))
      const row: Entry = { id: e.address, kind: e.kind, from: e.from, date, bytes: 0, sha256: e.sha256, fragments: [], lengths: [], parities: [], links: clinks, committedAt: date, witness }
      for (const l of clinks) await this.bump('ref', l, 1)
      await this.storage.put(`row:${row.id}`, row)
      return json({ id: row.id, sha256: row.sha256, committedAt: date, witness, revealed: false, committed: true, landed: await this.replicate(request, e) }, 201)
    }
    const links = [...new Set(e.links ?? [])]
    for (const l of links) { if (!ID.test(l)) return json({ error: `link ${l} is not an entry id` }, 400); if (!(await this.entry(l))) return json({ error: `link ${l} names no entry` }, 404) }
    const text = JSON.stringify(e.body)
    const bytes = enc.encode(text)
    if (bytes.length > MAX_ENTRY_BYTES) return json({ error: `entry exceeds ${MAX_ENTRY_BYTES} bytes` }, 413)
    const id = uuidOf(text)
    const sha256 = await sha256Of(bytes)
    const existing = await this.entry(id)
    if (existing && existing.fragments.length === 0) {
      // the reveal of a commitment
      if (existing.sha256 !== sha256) return json({ id, sha256, revealed: false, mismatch: true, committedSha256: existing.sha256, note: 'the content shown is not the content committed: a lead' }, 409)
      const stored = await this.store(split(bytes))
      for (const l of links) await this.bump('ref', l, 1)
      await this.storage.put(`row:${id}`, { ...existing, ...stored, bytes: bytes.length, links, revealedAt: date })
      return json({ id, sha256, stored: true, revealed: true, committedAt: existing.committedAt, witness: existing.witness, revealedAt: date, fragments: stored.fragments.length, landed: await this.replicate(request, e) }, 201)
    }
    if (existing && existing.sha256 === sha256) return json({ id, sha256, stored: false, duplicate: true, fragments: existing.fragments.length }, 200)
    if (existing) {
      // a fold collision: same address, different content. Both kept, both fingerprinted; a collision lead links the entry.
      if (existing.collisions?.some((c) => c.sha256 === sha256)) return json({ id, sha256, stored: false, duplicate: true, collision: true, with: existing.sha256 }, 200)
      const stored = await this.store(split(bytes))
      const collisions = [...(existing.collisions ?? []), { sha256, kind: e.kind, from: e.from, date, ...stored }]
      await this.storage.put(`row:${id}`, { ...existing, collisions })
      const lead = { kind: 'collision', from: 'docket', statement: `fold collision at ${id}: SHA-256 ${existing.sha256} (${existing.kind} from ${existing.from}) and ${sha256} (${e.kind} from ${e.from}) share one address`, status: 'open', reason: 'the fold separates content but is not collision-resistant against a search; both contents are kept and fingerprinted; develop the lead' }
      const leadBytes = enc.encode(JSON.stringify(lead))
      const leadId = uuidOf(JSON.stringify(lead))
      if (!(await this.entry(leadId))) { const st = await this.store([leadBytes]); await this.storage.put(`row:${leadId}`, { id: leadId, kind: 'collision', from: 'docket', date, bytes: leadBytes.length, sha256: await sha256Of(leadBytes), ...st, links: [id] }); await this.bump('ref', id, 1) }
      return json({ id, sha256, stored: true, collision: true, with: existing.sha256, lead: leadId, landed: await this.replicate(request, e) }, 201)
    }
    const stored = await this.store(split(bytes))
    for (const l of links) await this.bump('ref', l, 1)
    await this.storage.put(`row:${id}`, { id, kind: e.kind, from: e.from, date, bytes: bytes.length, sha256, ...stored, links })
    return json({ id, sha256, stored: true, duplicate: false, fragments: stored.fragments.length, parities: stored.parities.length, landed: await this.replicate(request, e) }, 201)
  }

  /** A write lands on every mirror in the same call. A forwarded write carries x-replica so mirrors do not forward again. */
  private async replicate(request: Request, entry: unknown): Promise<{ mirror: string; status: number }[]> {
    if (request.headers.get('x-replica') || !this.mirrors.length) return []
    const landed: { mirror: string; status: number }[] = []
    for (const mirror of this.mirrors) {
      try { const res = await this.fetcher(mirror, { method: 'POST', headers: { 'content-type': 'application/json', 'x-replica': '1', ...(this.writeToken ? { authorization: `Bearer ${this.writeToken}` } : {}) }, body: JSON.stringify(entry) }); landed.push({ mirror, status: res.status }) }
      catch { landed.push({ mirror, status: 0 }) }
    }
    return landed
  }

  /** The root: the address of every entry's id and SHA-256, so two mirrors compare whole dockets with one value. */
  private async rootOf(): Promise<string> { const rows = await this.storage.list<Entry>({ prefix: 'row:' }); return uuidOf([...rows.values()].map((m) => `${m.id}:${m.sha256}`).sort().join('\n')) }

  private async read(id: string, cheap: boolean, heal: boolean): Promise<Response> {
    const m = await this.entry(id)
    if (!m) return json({ error: `no entry ${id}` }, 404)
    const refs = (await this.storage.get<number>(`ref:${id}`)) ?? 0
    if (m.fragments.length === 0) return json({ id, sha256: m.sha256, kind: m.kind, from: m.from, committedAt: m.committedAt, witness: m.witness, revealed: false, refs, note: 'committed, not yet revealed: fingerprints only' })
    if (cheap) {
      const present = async (hs: string[]) => Promise.all(hs.map(async (h) => ({ fingerprint: h, present: !!(await this.storage.get(`frag:${h}`)), seal: sealOf(h).valid })))
      const fragments = await present(m.fragments), parities = await present(m.parities)
      const mirrors: { mirror: string; sha256: string | null; agree: boolean }[] = []
      for (const mirror of this.mirrors) { try { const res = await this.fetcher(`${mirror.replace(/\/$/, '')}/${id}?cheap`); const j = res.ok ? (await res.json()) as { sha256?: string } : {}; mirrors.push({ mirror, sha256: j.sha256 ?? null, agree: j.sha256 === m.sha256 }) } catch { mirrors.push({ mirror, sha256: null, agree: false }) } }
      return json({ id, sha256: m.sha256, seal: sealOf(id), fragments, parities, allPresent: [...fragments, ...parities].every((p) => p.present), mirrors, links: m.links, refs, collisions: m.collisions?.length ?? 0, bound: 'the fold is tamper-evident, not collision-resistant against a search; the SHA-256 is', cost: 'no decryption: one modular power per fingerprint and one lookup each' })
    }
    const assemble = async (): Promise<{ text: string; repaired: string[] } | { lost: string[] }> => {
      const parts = await Promise.all(m.fragments.map((h) => this.fragment(h)))
      const repaired: string[] = []
      for (let st = 0; st * STRIPE < parts.length; st++) {
        const idx = [...Array(Math.min(STRIPE, parts.length - st * STRIPE)).keys()].map((k) => st * STRIPE + k)
        const missing = idx.filter((i) => !parts[i])
        if (missing.length !== 1) continue
        const parity = await this.fragment(m.parities[st]!)
        if (!parity) continue
        const i = missing[0]!
        const rebuilt = xorOf([parity, ...idx.filter((j) => j !== i).map((j) => parts[j] as Uint8Array)], parity.length).subarray(0, m.lengths[i])
        if (hashOf(rebuilt) === m.fragments[i]) { parts[i] = rebuilt; repaired.push(m.fragments[i]!) }
      }
      if (parts.some((p) => !p)) return { lost: parts.map((p, i) => (p ? null : m.fragments[i]!)).filter((x): x is string => !!x) }
      const whole = new Uint8Array(m.bytes); let o = 0
      for (const p of parts as Uint8Array[]) { whole.set(p, o); o += p.length }
      const text = dec.decode(whole)
      if (uuidOf(text) !== id || (await sha256Of(whole)) !== m.sha256) return { lost: ['the reassembled body does not match its fingerprints'] }
      return { text, repaired }
    }
    let got = await assemble()
    let healedFrom: string | undefined
    if ('lost' in got && heal) {
      for (const mirror of this.mirrors) {
        try {
          const res = await this.fetcher(`${mirror.replace(/\/$/, '')}/${id}`)
          if (!res.ok) continue
          const copy = await res.json() as { body?: unknown }
          const text = JSON.stringify(copy.body); const bytes = enc.encode(text)
          if (uuidOf(text) !== id || (await sha256Of(bytes)) !== m.sha256) continue // a collision or a different entry never heals
          const parts = split(bytes)
          for (const p of parts) await this.storage.put(`frag:${hashOf(p)}`, await this.seal(p))
          for (const stripe of Docket.stripesOf(parts)) { const parity = xorOf(stripe, Math.max(...stripe.map((p) => p.length))); await this.storage.put(`frag:${hashOf(parity)}`, await this.seal(parity)) }
          healedFrom = mirror; got = await assemble(); break
        } catch { /* the next mirror */ }
      }
    }
    if ('lost' in got) return json({ error: 'integrity: fragments lost or altered beyond what one parity repairs', id, lost: got.lost, heal: this.mirrors.length ? { how: `GET /docket/${id}?heal`, mirrors: this.mirrors } : { how: 'no mirrors configured (QPU_MIRRORS)' } }, 409)
    return json({ id, sha256: m.sha256, kind: m.kind, from: m.from, date: m.date, bytes: m.bytes, fragments: m.fragments.length, repaired: got.repaired, healedFrom, committedAt: m.committedAt, witness: m.witness, revealedAt: m.revealedAt, links: m.links, refs, collisions: m.collisions?.length ?? 0, body: JSON.parse(got.text) }, 200, got.repaired.length ? { 'X-Repaired': String(got.repaired.length) } : {})
  }

  private async remove(id: string): Promise<Response> {
    const m = await this.entry(id)
    if (!m) return json({ error: `no entry ${id}` }, 404)
    const refs = (await this.storage.get<number>(`ref:${id}`)) ?? 0
    if (refs > 0) return json({ error: `entry ${id} is linked by ${refs} entr${refs === 1 ? 'y' : 'ies'}; deletion is allowed only when no links exist`, refs }, 409)
    await this.release([...m.fragments, ...m.parities, ...(m.collisions ?? []).flatMap((c) => [...c.fragments, ...c.parities])])
    for (const l of m.links) await this.bump('ref', l, -1)
    await this.storage.delete(`row:${id}`)
    return json({ id, deleted: true, releasedLinks: m.links }, 200)
  }
}

/** The page a UUID unfurls into, computed from the id alone: head from the channel (handle, hex program, message tail), the seal,
 *  the aura swatch as an inline SVG data URL, the licence. The body loads client-side from the JSON route; a crawler reads the head. */
const escapeHtml = (t: string): string => t.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
export type Superposition = { prev?: string; next?: { href: string; label: string }; compiled?: Step[]; result?: unknown; notes?: string[]; locale?: string }
/** The next step of an id: its program compiled against the tools, the first step executed, and the href that continues the walk. */
export const nextOf = (id: string, origin: string): { href: string; label: string; compiled: Step[]; result: unknown } => {
  const ch = channelOf(id)
  const tools = (handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) as { result: { tools: Parameters<typeof compileOf>[1] } }).result.tools
  const { steps, next } = compileOf(ch.program, tools, ch.message)
  const reply = next ? handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: next.tool, arguments: next.arguments } }) as { result?: { structuredContent: unknown; _meta: { widget: string } }; error?: unknown } : undefined
  const rotated = [...ch.program.slice(1), ch.program[0]!] // the walk continues: the program rotates one nibble per step
  return { href: `${origin}/${ch.handle}/${rotated.map((n) => n.toString(16)).join('')}/${ch.tail}`, label: next ? `${next.tool} ${JSON.stringify(next.arguments)}` : 'no step', compiled: steps, result: reply?.result ? { structured: reply.result.structuredContent, widget: reply.result._meta.widget } : reply?.error }
}
export const pageOf = (id: string, origin: string, sp: Superposition = {}): Response => {
  const locale = sp.locale ?? 'en'
  const t = (text: string) => translateOf(text, 'en', locale).text
  const ch = channelOf(id)
  const seal = sealOf(id)
  const accent = accentOfUuid(id)
  const swatch = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="${accent}"/><text x="60" y="340" font-family="monospace" font-size="72" fill="#fff">${ch.handle}</text><text x="60" y="440" font-family="monospace" font-size="40" fill="#fff">${ch.middle} · ${ch.tail}</text></svg>`)}`
  const title = `${ch.handle} · ${ch.program.join('')} · @uuidna/qpu`
  const description = `Docket entry ${id}: handle ${ch.handle}, hex program ${ch.program.join('')} (version ${ch.version}, variant ${ch.variant}), message ${ch.message.one48} as one 48-bit natural, ${ch.message.two24.join('/')} as two 24-bit, ${ch.message.three16.join('/')} as three 16-bit; seal ${seal.valid ? 'valid' : 'invalid'}. ${LICENSE.spdx} © ${LICENSE.author}.`
  const og: Record<string, string> = { 'og:type': 'website', 'og:site_name': '@uuidna/qpu', 'og:url': `${origin}/docket/${id}`, 'og:title': title, 'og:description': description, 'og:image': swatch, 'og:image:width': '1200', 'og:image:height': '630', 'article:author': LICENSE.author, license: `${LICENSE.spdx} ${LICENSE.url}`, 'twitter:card': 'summary_large_image' }
  const meta = Object.entries(og).map(([k, v]) => `<meta property="${escapeHtml(k)}" content="${escapeHtml(v)}">`).join('\n')
  const html = `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
${meta}
<meta name="license" content="${LICENSE.spdx}"><meta name="copyright" content="${escapeHtml(LICENSE.copyright)}"><link rel="license" href="${LICENSE.url}"><link rel="canonical" href="${origin}/docket/${id}">
${sp.prev ? `<link rel="prev" href="${escapeHtml(sp.prev)}">` : ''}${sp.next ? `<link rel="next" href="${escapeHtml(sp.next.href)}">` : ''}
<meta name="uuidna:handle" content="${ch.handle}"><meta name="uuidna:program" content="${ch.program.join('')}"><meta name="uuidna:tail" content="${ch.tail}"><meta name="uuidna:seal" content="${seal.valid}"><meta name="uuidna:aura" content="${escapeHtml(accent)}"><meta name="uuidna:key" content="${KEY}">
<style>${cssOf()}:root{--font-sans:system-ui,sans-serif;--text-primary:#111;--text-secondary:#555;--surface-1:#f4f4f5;--surface-2:#fff;--border:#ddd;--radius:8px;--pad-md:12px;--pad-sm:8px;--gap-md:12px;--gap-sm:8px;--gap-xs:4px;--font-size-footnote:12px}body{margin:0;padding:16px;background:#fafafa;font-family:var(--font-sans);color:var(--text-primary)}@media (prefers-color-scheme: dark){:root{--text-primary:#eee;--text-secondary:#aaa;--surface-1:#1c1c1e;--surface-2:#111;--border:#333}body{background:#000}}pre{white-space:pre-wrap;background:var(--surface-2);border:0.5px solid var(--border);border-radius:var(--radius);padding:var(--pad-md)}</style></head>
<body data-block="${id}" style="--block-accent: ${escapeHtml(accent)}; border-left: 3px solid var(--block-accent); padding-left: 8px;">
<h1 style="font-family:monospace">${ch.handle}</h1>
<p>${t('hex program')} <code>${ch.program.join('')}</code> · ${t('message tail')} <code>${ch.tail}</code> · ${t('seal')} ${seal.valid ? '✓' : '✗'}</p>
<table><caption>${t('the tail, read every way; the step decides')}</caption><tbody>
<tr><td>one 48-bit</td><td>${ch.message.one48}</td></tr><tr><td>two 24-bit</td><td>${ch.message.two24.join(' · ')}</td></tr><tr><td>three 16-bit</td><td>${ch.message.three16.join(' · ')}</td></tr>
<tr><td>text (6 ASCII)</td><td>${ch.message.text6 === null ? '—' : `<code>${escapeHtml(ch.message.text6)}</code>`}</td></tr><tr><td>timestamp</td><td>${ch.message.timestamp ?? '—'}</td></tr>
<tr><td>referrer handle · flags</td><td><a href="${origin}/${ch.message.referrer.handle}">${ch.message.referrer.handle}</a> · ${ch.message.referrer.flags}</td></tr>
<tr><td>colour</td><td><span style="display:inline-block;width:1em;height:1em;background:${ch.message.colour.rgb};vertical-align:middle"></span> ${ch.message.colour.rgb} · key ${ch.message.colour.key.toFixed(4)}</td></tr>
<tr><td>coordinate</td><td>${ch.message.coordinate.lat}, ${ch.message.coordinate.lon}</td></tr></tbody></table>
${(() => { const m = reflectionOf(id); const ma = accentOfUuid(m.mirror); return `<h2>${t('Reflection')}</h2><p>σ ${t('on every part at once')}: <a href="${origin}/docket/${m.mirror}?og" style="font-family:monospace">${m.mirror}</a> <span style="display:inline-block;width:1em;height:1em;background:${escapeHtml(ma)};vertical-align:middle"></span></p><table><thead><tr><th></th><th>${t('this')}</th><th>${t('mirror')}</th></tr></thead><tbody><tr><td>${t('handle')}</td><td>${ch.handle}</td><td><a href="${origin}/${m.handle}">${m.handle}</a></td></tr><tr><td>${t('program')}</td><td>${ch.program.map((n) => n.toString(16)).join('')}</td><td><a href="${origin}/${m.handle}/${m.program.map((n) => n.toString(16)).join('')}/${m.tail}">${m.program.map((n) => n.toString(16)).join('')}</a></td></tr><tr><td>${t('tail')}</td><td>${ch.tail}</td><td>${m.tail}</td></tr><tr><td>text</td><td>${ch.message.text6 === null ? '—' : escapeHtml(ch.message.text6)}</td><td>${m.readings.text6 === null ? '—' : escapeHtml(m.readings.text6)}</td></tr><tr><td>timestamp</td><td>${ch.message.timestamp ?? '—'}</td><td>${m.readings.timestamp ?? '—'}</td></tr><tr><td>${t('colour')}</td><td>${ch.message.colour.rgb}</td><td>${m.readings.colour.rgb}</td></tr><tr><td>${t('accent')}</td><td>${escapeHtml(accent)}</td><td>${escapeHtml(ma)}</td></tr></tbody></table><p style="color:var(--text-secondary)">${t('reflecting twice returns the parts')} (Qpu.Sigma, sigma_reflect).</p>` })()}<p> · hue ${hueOf(KEY)}° · cmyk ${Object.values(cmykOfUuid(id)).map((v) => v.toFixed(2)).join(' ')}</p>
${sp.notes?.length ? `<p style="color:var(--text-secondary)">${sp.notes.map(escapeHtml).join(' · ')}</p>` : ''}
${sp.compiled ? `<h2>${t('Program')}</h2><table><thead><tr><th>#</th><th>nibble</th><th>tool</th><th>arguments</th></tr></thead><tbody>${sp.compiled.map((st, i) => `<tr><td>${i}</td><td>${st.nibble.toString(16)}</td><td>${escapeHtml(st.tool)}</td><td><code>${escapeHtml(JSON.stringify(st.arguments))}</code></td></tr>`).join('')}</tbody></table>` : ''}
${sp.result && typeof sp.result === 'object' && 'widget' in (sp.result as object) ? `<h2>${t('Next, executed')}</h2>${(sp.result as { widget: string }).widget}` : sp.result ? `<h2>Next</h2><pre>${escapeHtml(JSON.stringify(sp.result, null, 2))}</pre>` : ''}
<nav style="display:flex;justify-content:space-between;gap:16px;margin:24px 0;border-top:0.5px solid var(--border);padding-top:12px"><span>${sp.prev ? `← <a href="${escapeHtml(sp.prev)}">${t('previous')}</a>` : ''}</span><span>${sp.next ? `<a href="${escapeHtml(sp.next.href)}">${t('next')}: ${escapeHtml(sp.next.label.slice(0, 80))}</a> →` : ''}</span></nav>
<noscript><p>The entry's body loads from <a href="${origin}/docket/${id}">${origin}/docket/${id}</a>; this head was computed from the UUID alone.</p></noscript>
<pre id="body">loading ${origin}/docket/${id} …</pre>
<p style="font-size:12px;color:var(--text-secondary)">© <a href="${LICENSE.orcid}" style="color:inherit">${LICENSE.author}</a> · <a href="${LICENSE.url}" style="color:inherit">${LICENSE.spdx}</a> · ${t('commercial use by licence')} (${LICENSE.contact})</p>
<script>fetch(${JSON.stringify(`${origin}/docket/${id}`)},{headers:{accept:'application/json'}}).then(r=>r.json()).then(j=>{document.getElementById('body').textContent=JSON.stringify(j,null,2)}).catch(e=>{document.getElementById('body').textContent='no entry on this mirror: '+e})</script>
</body></html>`
  return new Response(html, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8', ...LICENSE_HEADERS } })
}

/** The referer, when it names a page of this unit or any http origin: the previous step of the walk. */
export const refererOf = (request: Request): string | undefined => { const r = request.headers.get('referer'); return r && /^https?:\/\//.test(r) ? r : undefined }

/** Catch all, decide and translate later. A path is read as handle / program / tail where it is hex (the walk), a locale prefix
 *  is stripped and recorded as a translation lead, and anything else is put to the match tool as a statement: served, proved
 *  impossible, or returned as a lead. Nothing ends in a bare 404 without a decision. */
export const catchAll = (request: Request, url: URL, env: Env): Response | Promise<Response> => {
  const segments = url.pathname.split('/').filter(Boolean).map(decodeURIComponent)
  const notes: string[] = []
  let locale = 'en'
  if (segments[0] && LANGS[segments[0]] && segments[0] !== 'en') { locale = segments[0]; segments.shift(); if (!LANGS[locale]!.filled) notes.push(`translate later: ${LANGS[locale]!.name} (${locale}) has no vocabulary table yet, a lead; served in English`) }
  const t = (text: string) => { const r = translateOf(text, 'en', locale); if (r.untranslated.length && locale !== 'en') for (const w of r.untranslated) notes.push(`translate later: "${w}" (${locale})`); return r.text }
  const wantsPage = url.searchParams.has('og') || /text\/html/.test(request.headers.get('accept') ?? '')
  const [a, b, c] = segments
  if (a && /^[0-9a-f]{8}$/.test(a)) {
    const program = b && /^[0-9a-f]{10}$/.test(b) ? [...b].map((x) => parseInt(x, 16)) : undefined
    const tail = c && /^[0-9a-f]{12}$/.test(c) ? c : '000000000000'
    if (program) {
      const id = uuidFromParts(a, program, tail)
      const nx = nextOf(id, url.origin)
      if (!wantsPage) return json({ id, handle: a, program, tail, next: { href: nx.href, label: nx.label }, compiled: nx.compiled, result: nx.result && typeof nx.result === 'object' && 'structured' in (nx.result as object) ? (nx.result as { structured: unknown }).structured : nx.result, prev: refererOf(request) ?? null, notes })
      return pageOf(id, url.origin, { prev: refererOf(request), next: { href: nx.href, label: nx.label }, compiled: nx.compiled, result: nx.result, notes, locale })
    }
    // the family: the handle alone; its entries on this mirror, and the sixteen doors a first nibble opens
    const tools = (handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) as { result: { tools: { name: string }[] } }).result.tools.filter((t) => !['audit', 'match', 'verify'].includes(t.name))
    const doors = [...Array(16).keys()].map((n) => ({ nibble: n.toString(16), tool: tools[n % tools.length]!.name, href: `${url.origin}/${a}/${n.toString(16).repeat(10)}/${tail}` }))
    const family = async () => { if (!env.DOCKET) return [] as unknown[]; const res = await env.DOCKET.get(env.DOCKET.idFromName(tenantOf(url.hostname))).fetch(new Request(`${url.origin}/docket`)); const j = await res.json() as { entries: { id: string }[] }; return j.entries.filter((e) => e.id.startsWith(a)) }
    return family().then((entries) => wantsPage
      ? new Response(`<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><title>${a} · @uuidna/qpu</title><meta property="og:title" content="${a} · family · @uuidna/qpu"><meta property="og:url" content="${url.origin}/${a}"><link rel="license" href="${LICENSE.url}">${refererOf(request) ? `<link rel="prev" href="${escapeHtml(refererOf(request)!)}">` : ''}<style>${cssOf()}body{font-family:system-ui;padding:16px}</style></head><body><h1 style="font-family:monospace">${a}</h1>${notes.length ? `<p>${notes.map(escapeHtml).join(' · ')}</p>` : ''}<h2>${t('Entries of this family here')}</h2><ul>${(entries as { id: string }[]).map((e) => `<li><a href="${url.origin}/docket/${e.id}">${e.id}</a></li>`).join('') || `<li>${t('none on this mirror')}</li>`}</ul><h2>${t('Doors: the first nibble chooses next')}</h2><table><tbody>${doors.map((d) => `<tr><td>${d.nibble}</td><td>${d.tool}</td><td><a href="${d.href}">${d.href.replace(url.origin, '')}</a></td></tr>`).join('')}</tbody></table><p style="font-size:12px">© ${LICENSE.author} · ${LICENSE.spdx}</p></body></html>`, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8', ...LICENSE_HEADERS } })
      : json({ handle: a, entries, doors, prev: refererOf(request) ?? null, notes }))
  }
  // not a walk: decide by matching the path as a statement
  const statement = segments.join(' ').replace(/[-_]+/g, ' ')
  const decision = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'match', arguments: { statement } } }) as { result?: { structuredContent: { verdict: string; evidence: string[]; lead: unknown }; _meta: { widget: string } } }
  const m = decision.result?.structuredContent
  if (!wantsPage) return json({ error: `no route ${url.pathname}`, decided: m ? { verdict: m.verdict, evidence: m.evidence, lead: m.lead } : null, notes, routes: ['GET /', 'GET /.well-known/qpu.json', 'GET /health', 'POST /mcp', 'GET|POST|DELETE /docket', 'GET /<handle>[/<program>[/<tail>]]'] }, 404)
  return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${escapeHtml(statement)} · decided · @uuidna/qpu</title><meta property="og:title" content="${escapeHtml(statement)} · ${escapeHtml(m?.verdict ?? 'undecided')}"><meta property="og:url" content="${escapeHtml(url.href)}"><link rel="license" href="${LICENSE.url}"><style>${cssOf()}body{font-family:system-ui;padding:16px}</style></head><body><h1>${escapeHtml(statement)}</h1><p>${t('Caught: this path is not a walk. Decided by the match tool')}: <strong>${escapeHtml(m?.verdict ?? 'undecided')}</strong>.${notes.length ? ' ' + notes.map(escapeHtml).join(' · ') : ''}</p>${decision.result?._meta.widget ?? ''}<p style="font-size:12px">© ${LICENSE.author} · ${LICENSE.spdx}</p></body></html>`, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8', ...LICENSE_HEADERS } })
}

/** The docket's licence entries at a tenant, as the billing toolbox reads them. */
const licenceEntries = async (origin: string, tenant: string, env: Env): Promise<unknown[]> => {
  if (!env.DOCKET) return []
  const res = await env.DOCKET.get(env.DOCKET.idFromName(tenant)).fetch(new Request(`${origin}/docket`))
  const j = await res.json() as { entries?: { id: string; kind?: string }[] }
  const docket = env.DOCKET.get(env.DOCKET.idFromName(tenant))
  const rows = (j.entries ?? []).filter((e) => e.kind === 'licence')
  // the listing carries metadata only; each licence entry is read whole (the cheap read) for its body and links
  const full = await Promise.all(rows.map(async (e) => { const r = await docket.fetch(new Request(`${origin}/docket/${e.id}`)); const d = await r.json() as { id?: string; kind?: string; from?: string; body?: unknown; links?: string[] }; return d.body ? { id: e.id, kind: 'licence', from: d.from, body: d.body, links: d.links ?? [] } : null }))
  return full.filter((x) => x !== null)
}
const call = (name: string, args: Record<string, unknown>) => handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }) as { result?: { structuredContent: any }; error?: { message: string } }
/** Stripe posts here per tenant; the tenant's webhook secret verifies; one entry per event lands in the tenant docket. */
const stripeWebhook = async (request: Request, url: URL, env: Env): Promise<Response> => {
  const tenant = tenantOf(url.hostname)
  const secret = env[`STRIPE_WEBHOOK_SECRET_${tenant.toUpperCase()}`] as string | undefined
  if (!secret) return json({ error: `tenant ${tenant} has no STRIPE_WEBHOOK_SECRET_${tenant.toUpperCase()}`, procedure: 'the author sets the tenant\'s webhook secret as a wrangler secret and registers this endpoint at Stripe' }, 503)
  const payload = await request.text()
  const entries = await licenceEntries(url.origin, tenant, env)
  const r = call('stripe', { op: 'webhook', tenant, payload, signature: request.headers.get('stripe-signature') ?? '', secret, entries })
  if (r.error) return json({ error: r.error.message }, 400)
  const out = r.result!.structuredContent
  if (!out.valid) return json({ refused: out.why, lead: out.lead }, 400)
  if (!out.entry || out.duplicate) return json({ received: out.event ?? null, state: out.state ?? null, duplicate: Boolean(out.duplicate) })
  if (!env.DOCKET) return json({ error: 'no DOCKET binding on this deployment' }, 503)
  const headers = new Headers({ 'content-type': 'application/json', 'x-qpu-tenant': tenant, 'x-qpu-role': 'writer', 'x-qpu-roles-by': 'stripe-signature' })
  const stored = await env.DOCKET.get(env.DOCKET.idFromName(tenant)).fetch(new Request(`${url.origin}/docket`, { method: 'POST', headers, body: JSON.stringify(out.entry) }))
  const sj = await stored.json() as { id?: string; duplicate?: boolean; error?: string }
  return json({ received: out.event, type: out.type, state: out.state, entry: sj.id ?? out.entry.id, duplicate: Boolean(sj.duplicate), stored: stored.status < 300 }, stored.status < 300 ? 200 : stored.status)
}
/** The licence state of a subject at this domain, from the entries this tenant holds (mirrors carry the other tenants' grants). */
const stripeState = async (subject: string, url: URL, env: Env): Promise<Response> => {
  const tenant = tenantOf(url.hostname)
  const r = call('stripe', { op: 'state', tenant, subject: decodeURIComponent(subject), domain: url.hostname, entries: await licenceEntries(url.origin, tenant, env) })
  return r.error ? json({ error: r.error.message }, 400) : json(r.result!.structuredContent)
}
/** A checkout plan executed with the tenant's secret key; without a key the plan is returned with its procedure. */
const stripeCheckout = async (reply: { result: { structuredContent: { plan: { url: string; form: Record<string, string>; headers: Record<string, string>; secret: string } } } }, url: URL, env: Env, fetcher: (url: string, init: RequestInit) => Promise<Response> = fetch): Promise<unknown> => {
  const plan = reply.result.structuredContent.plan
  const key = env[plan.secret] as string | undefined
  if (!key) return { ...reply, result: { ...reply.result, structuredContent: { ...reply.result.structuredContent, executed: false, procedure: `tenant ${tenantOf(url.hostname)} has no ${plan.secret}: the author sets it as a wrangler secret; until then the plan is returned, not sent` } } }
  try {
    const res = await fetcher(plan.url, { method: 'POST', headers: { ...plan.headers, authorization: `Bearer ${key}` }, body: new URLSearchParams(plan.form).toString(), signal: AbortSignal.timeout(20000) })
    const session = await res.json() as { id?: string; url?: string; error?: { message?: string } }
    return { ...reply, result: { ...reply.result, structuredContent: { ...reply.result.structuredContent, plan: { ...plan, form: Object.keys(plan.form) }, executed: res.ok, session: session.id ?? null, url: session.url ?? null, error: session.error?.message ?? null } } }
  } catch (e) { return { ...reply, result: { ...reply.result, structuredContent: { ...reply.result.structuredContent, executed: false, error: (e as Error).message } } } }
}
export { stripeCheckout }

export const worker = {
  async fetch(request: Request, env: Env = {}): Promise<Response> {
    const url = new URL(request.url)
    const path = url.pathname.replace(/\/$/, '') || '/'
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: LICENSE_HEADERS })
    if (path === '/health') { const m = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'metrics', arguments: {} } }) as { result?: { structuredContent: unknown } }; return json({ status: 'healthy', tenant: tenantOf(url.hostname), license: LICENSE.spdx, metrics: m.result?.structuredContent ?? null }) }
    // the root: the web OS from the assets, unless the client asks for JSON (accept application/json): then the discovery document, which also stands at /.well-known/qpu.json
    if (path === '/' && request.method === 'GET' && env.ASSETS && !/application\/json/.test(request.headers.get('accept') ?? '')) { const asset = await env.ASSETS.fetch(request); if (asset.status !== 404) return asset }
    if (path === '/.well-known/qpu.json' || (path === '/' && request.method === 'GET')) return json(discoveryOf(url.origin, env))
    if ((path === '/mcp' || path === '/') && request.method === 'POST') {
      let message: Rpc
      try { message = await request.json() as Rpc } catch { return json({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'parse error' } }, 400) }
      const reply = handle(message)
      // A checkout plan is executed here, with the tenant's key the handler never holds: the answer carries Stripe's session url.
      const params = (message as { params?: { name?: string; arguments?: { op?: string } } }).params
      // a cached reply is an involution: the block address is its ETag; the same arguments at any host answer the same address (tools/call is pure), so If-None-Match answers 304
      if ('result' in reply && params?.name !== 'stripe' && params?.name !== 'metrics') return involuted(request, addressOfReply(reply), replyOf(request, reply), contentHashOf((reply as { result: { structuredContent?: unknown } }).result.structuredContent))
      if (params?.name === 'stripe' && params.arguments?.op === 'plan' && 'result' in reply) return json(await stripeCheckout(reply as { result: { structuredContent: { plan: { url: string; form: Record<string, string>; headers: Record<string, string>; secret: string } } } }, url, env))
      return replyOf(request, reply)
    }
    // Stripe per tenant: the webhook endpoint, the licence state, both under the docket since every event is an entry.
    if (path === '/docket/stripe' && request.method === 'POST') return stripeWebhook(request, url, env)
    if (path.startsWith('/docket/stripe/') && request.method === 'GET') return stripeState(path.slice('/docket/stripe/'.length), url, env)
    if (path === '/docket' || path.startsWith('/docket/')) {
      const tenant = tenantOf(url.hostname)
      const { role, collision, by } = await roleAt(env, tenant, url.hostname, request.headers.get('authorization')?.replace(/^Bearer\s+/i, ''))
      const need: Role | null = request.method === 'DELETE' ? 'admin' : request.method === 'POST' ? 'writer' : null
      if (need && role === 'reader') return json({ error: `${request.method} ${path} at tenant ${tenant} needs the ${need} role`, procedure: ROLES[need], tenant, role, rolesBy: by, ...(collision ? { collision, lead: { id: `rbac-collision-${tenant}`, statement: collision, status: 'open', reason: 'a security collision is a procedure: the token is per tenant' } } : {}) }, collision ? 403 : 401)
      if (need === 'admin' && role !== 'admin') return json({ error: `${request.method} ${path} at tenant ${tenant} needs the admin role; this token holds ${role}`, procedure: ROLES.admin, tenant, role, rolesBy: by }, 403)
      if (!env.DOCKET) return json({ error: 'no DOCKET binding on this deployment' }, 503)
      const headers = new Headers(request.headers); headers.set('x-qpu-tenant', tenant); headers.set('x-qpu-role', role); headers.set('x-qpu-roles-by', by)
      return env.DOCKET.get(env.DOCKET.idFromName(tenant)).fetch(new Request(request, { headers }))
    }
    // the web OS: a page the site built is served as it is; what the site does not have, the catch-all computes
    if (env.ASSETS && request.method === 'GET') { const asset = await env.ASSETS.fetch(request); if (asset.status !== 404) return asset }
    return catchAll(request, url, env)
  },
}

export default worker

/** The Durable Object class the Workers runtime instantiates: it hands its storage to the pure Docket above. */
export class DocketObject {
  private readonly docket: Docket
  constructor(state: { storage: Storage }, env: Env) { this.docket = new Docket(state.storage, env.QPU_DATA_KEY, (env.QPU_MIRRORS ?? '').split(',').map((s) => s.trim()).filter(Boolean), undefined, env.QPU_WRITE_TOKEN) }
  fetch(request: Request): Promise<Response> { return this.docket.fetch(request) }
}
