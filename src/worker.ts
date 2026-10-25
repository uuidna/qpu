// The Worker: the same pure `handle` served over HTTP at /mcp so the unit's fan-out (uuidna_fanout → qpu.uuidna.com) and
// any MCP client reach the sixteen tools; the discovery document at /.well-known/qpu.json stating only what this tree is;
// and a Durable Object docket where this tree and the unit append receipts and leads by content address and read each
// other's. Reads need no auth; docket writes carry `Authorization: Bearer QPU_WRITE_TOKEN` (a wrangler secret, never
// committed). Every response carries the licence.
import { handle, type Rpc } from './quantum/mcp.js'
import { EXAMPLES } from './quantum/examples.js'
import { LEADS } from './quantum/leads.js'
import { LICENSE } from './quantum/license.js'
import { KEY } from './quantum/theme.js'
import { uuidOf, sealOf } from './quantum/blocks.js'

/** The slice of the Workers runtime this file uses, typed here so the tree needs no runtime types package to typecheck. */
export type Storage = { get<T>(key: string): Promise<T | undefined>; put(key: string, value: unknown): Promise<void>; delete(key: string): Promise<unknown>; list<T>(opts?: { prefix?: string }): Promise<Map<string, T>> }
export type DocketStub = { fetch(request: Request): Promise<Response> }
export type Env = { QPU_WRITE_TOKEN?: string; QPU_DATA_KEY?: string; QPU_MIRRORS?: string; DOCKET?: { idFromName(name: string): unknown; get(id: unknown): DocketStub } }

const LICENSE_HEADERS = { 'Link': `<${LICENSE.url}>; rel="license"`, 'X-License': LICENSE.spdx, 'X-Copyright': LICENSE.copyright, 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'content-type, authorization', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS' }
const json = (body: unknown, status = 200, extra: Record<string, string> = {}): Response => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', ...LICENSE_HEADERS, ...extra } })

/** What this tree is, stated from its own values: nothing here is typed that the handler does not compute. */
export const discoveryOf = (origin: string) => {
  const list = handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) as { result: { tools: { name: string }[] } }
  const names = list.result.tools.map((t) => t.name)
  return {
    name: '@uuidna/qpu', kind: 'qpu', mcp: `${origin}/mcp`, docket: `${origin}/docket`, methods: ['initialize', 'tools/list', 'tools/call'],
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
 *                                     checks seal and fingerprints without decrypting; `heal` fetches a failing entry from the mirrors
 *    POST /docket                    { kind, from, body, links? } writes content; { kind, from, address, sha256 } with no body is a
 *                                     COMMITMENT (fingerprints now, witnessed by every mirror that records it); writing the content
 *                                     later REVEALS it into the same entry. Same content twice is stored once. Same address with a
 *                                     different SHA-256 is a fold COLLISION: both kept, both fingerprinted, a collision lead written.
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
      if (request.method === 'GET' && id) return await this.read(id, url.searchParams.has('cheap'), url.searchParams.has('heal'))
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
      const witness = uuidOf(JSON.stringify({ address: e.address, sha256: e.sha256, from: e.from, date }))
      const row: Entry = { id: e.address, kind: e.kind, from: e.from, date, bytes: 0, sha256: e.sha256, fragments: [], lengths: [], parities: [], links: [], committedAt: date, witness }
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

export const worker = {
  async fetch(request: Request, env: Env = {}): Promise<Response> {
    const url = new URL(request.url)
    const path = url.pathname.replace(/\/$/, '') || '/'
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: LICENSE_HEADERS })
    if (path === '/health') return json({ status: 'healthy', tools: discoveryOf(url.origin).tools.length, license: LICENSE.spdx })
    if (path === '/.well-known/qpu.json' || (path === '/' && request.method === 'GET')) return json(discoveryOf(url.origin))
    if ((path === '/mcp' || path === '/') && request.method === 'POST') {
      let message: Rpc
      try { message = await request.json() as Rpc } catch { return json({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'parse error' } }, 400) }
      return json(handle(message))
    }
    if (path === '/docket' || path.startsWith('/docket/')) {
      if (request.method === 'POST' || request.method === 'DELETE') {
        const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
        if (!sameToken(token, env.QPU_WRITE_TOKEN)) return json({ error: 'docket writes and deletions carry Authorization: Bearer QPU_WRITE_TOKEN' }, 401)
      }
      if (!env.DOCKET) return json({ error: 'no DOCKET binding on this deployment' }, 503)
      return env.DOCKET.get(env.DOCKET.idFromName('qpu')).fetch(request)
    }
    return json({ error: `no route ${path}`, routes: ['GET /', 'GET /.well-known/qpu.json', 'GET /health', 'POST /mcp', 'GET|POST /docket'] }, 404)
  },
}

export default worker

/** The Durable Object class the Workers runtime instantiates: it hands its storage to the pure Docket above. */
export class DocketObject {
  private readonly docket: Docket
  constructor(state: { storage: Storage }, env: Env) { this.docket = new Docket(state.storage, env.QPU_DATA_KEY, (env.QPU_MIRRORS ?? '').split(',').map((s) => s.trim()).filter(Boolean), undefined, env.QPU_WRITE_TOKEN) }
  fetch(request: Request): Promise<Response> { return this.docket.fetch(request) }
}
