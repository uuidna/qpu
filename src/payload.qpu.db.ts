// Tsvetan Rouschev, @uuidna/qpu, CC-BY-NC-ND-4.0; see NOTICE.qpu.md.
// Added to the MIT fork of payloadcms/website (Copyright (c) 2023 Payload); this file is QPU's.
// MongoDB AND Postgres merged into one RAID adapter: Payload's two database families are the same content-addressed db here. A collection is ONE
// content-addressed blob { id: doc } plus a tiny head naming its current address; reads and writes address that blob by its exact key, never a LIST
// (the costly object-store operation) and never the whole store, so a query costs one GET (then an in-process cache serves the rest) and a write one
// PUT. A relational row and a document are the same blob addressed by its id — so there is no Postgres-versus-Mongo here, one language over one store.
// Crypto is the store's integrity: the blob's key is its SHA-256, verified on read so a tampered blob is refused; the head is HMAC-signed with
// QPU_DATA_KEY when present, so the pointer cannot be forged. Storage is binding 0 — the filesystem — when one is writable, else a Cloudflare binding
// (R2 the object store, KV) or a system database (D1, SQLite) or Postgres (Cloud SQL, the google adapter's db), each the same key→value RAID store, the
// same adapter local and in the Worker. The query and update language stays the raid toolbox's `mongo` tool (Payload's `where` translated to the Mongo
// filter it ports); the id type is Mongo's text (a UUID) or Postgres's number (a sequence), whichever the config names; drafts/versions are the
// `_<collection>_versions` family, globals the `globals` family keyed by globalType; migrations and transactions are the no-ops a content-addressed,
// schemaless store needs none of (createDatabaseAdapter fills them), the blob itself the only migration and the head flip the only commit.
import { createDatabaseAdapter } from 'payload'
import type { Payload, Where } from 'payload'
import { toolCallerOf } from '@uuidna/qpu/mcp'
import { createHash, createHmac, randomUUID } from 'node:crypto'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

type Doc = Record<string, unknown>
type Bindings = { D1?: unknown; R2?: unknown; KV?: unknown; PG?: unknown; DOCKET?: unknown }
const mongo = toolCallerOf('mongo') as (a: Record<string, unknown>) => Record<string, unknown>
const sha = (s: string) => createHash('sha256').update(s).digest('hex')
const blobKey = (addr: string) => `raid/${addr.slice(0, 2)}/${addr.slice(2, 4)}/${addr}` // sharded so a filesystem never holds one huge directory
const headKey = (collection: string) => `raid/heads/${sha(collection).slice(0, 32)}`
const EMPTY_ADDR = sha('{}') // the empty collection's blob, shared by every empty collection: never autodeleted

// A key→value store addressed by exact key only — no LIST, the operation that costs on an object store. Binding 0 is the filesystem; a Cloudflare
// binding answers the same get/set when there is none (a Worker), so "hex folders, else the bindings" is this one choice.
// get/set address an exact key; del removes a superseded blob (autodelete when no head links to it) so a collection keeps one blob, not a snapshot
// per write — the content-addressed store is immutable, but a blob no head points to is garbage, and leaving it makes storage grow with the writes
type Store = { get: (key: string) => Promise<null | string>; set: (key: string, value: string) => Promise<void>; del: (key: string) => Promise<void> }
const fsStore = (dir: string): Store => ({
  get: async (key) => { const p = join(dir, key); return existsSync(p) ? readFileSync(p, 'utf8') : null },
  set: async (key, value) => { const p = join(dir, key); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, value) },
  del: async (key) => { const p = join(dir, key); if (existsSync(p)) rmSync(p) },
})
type R2Like = { get: (k: string) => Promise<{ text: () => Promise<string> } | null>; put: (k: string, v: string) => Promise<unknown>; delete: (k: string) => Promise<unknown> }
type KVLike = { get: (k: string) => Promise<null | string>; put: (k: string, v: string) => Promise<unknown>; delete: (k: string) => Promise<unknown> }
const r2Store = (b: R2Like): Store => ({ get: async (key) => { const o = await b.get(key); return o ? o.text() : null }, set: async (key, value) => void (await b.put(key, value)), del: async (key) => void (await b.delete(key)) })
const kvStore = (b: KVLike): Store => ({ get: (key) => b.get(key), set: async (key, value) => void (await b.put(key, value)), del: async (key) => void (await b.delete(key)) })
// a system database (Cloudflare D1 / SQLite) as the same key→value Store: one tiny table addressed by exact key, no scan — used when the
// filesystem is not persistent (a Worker) and no object binding is named, so the RAID lands in a persistent system db, never in ephemeral fs
type D1Like = { prepare: (q: string) => { bind: (...a: unknown[]) => { first: (col?: string) => Promise<unknown>; run: () => Promise<unknown> }; run: () => Promise<unknown> } }
type PgLike = { query: (sql: string, params?: unknown[]) => Promise<{ rows: { v: string }[] }> }
// one SQL key→value Store (CREATE/SELECT/upsert/DELETE over qpu_raid, addressed by exact key, no scan), shared by D1 (SQLite) and Postgres (Cloud SQL) —
// they differ only in the driver's shape and the placeholder, so each wraps its driver in exec(sql, params) → the selected v (or null). The RAID lands
// in a persistent system db when the filesystem is not persistent (a Worker) and no object binding is named — the merge of Payload's postgres family
// into the one db, no driver imported here (duck-typed on D1's prepare/bind and node-postgres's Pool.query; the binding carries the connection).
const sqlStore = (exec: (sql: string, params: unknown[]) => Promise<string | null>, ph: (i: number) => string): Store => {
  let ready: Promise<unknown> | null = null
  const ensure = () => (ready ??= exec('CREATE TABLE IF NOT EXISTS qpu_raid (k TEXT PRIMARY KEY, v TEXT NOT NULL)', []))
  return {
    get: async (key) => { await ensure(); return (await exec(`SELECT v FROM qpu_raid WHERE k = ${ph(1)}`, [key])) ?? null },
    set: async (key, value) => { await ensure(); await exec(`INSERT INTO qpu_raid (k, v) VALUES (${ph(1)}, ${ph(2)}) ON CONFLICT (k) DO UPDATE SET v = excluded.v`, [key, value]) },
    del: async (key) => { await ensure(); await exec(`DELETE FROM qpu_raid WHERE k = ${ph(1)}`, [key]) },
  }
}
const d1Store = (b: D1Like): Store => sqlStore(async (sql, params) => { if (/^SELECT/i.test(sql)) return ((await b.prepare(sql).bind(...params).first('v')) as string | null) ?? null; await (params.length ? b.prepare(sql).bind(...params) : b.prepare(sql)).run(); return null }, () => '?')
const pgStore = (b: PgLike): Store => sqlStore(async (sql, params) => { const r = await b.query(sql, params); return /^SELECT/i.test(sql) ? (r.rows[0]?.v ?? null) : null }, (i) => `$${i}`)
// the RAID across the available stores — error handling and fallback in one: a read tries each copy and falls back past a failed or missing one;
// a write lands on all copies (at least one must succeed, else it throws); a delete clears every copy. The blobs are content-addressed, so every
// copy holds the same bytes at the same key — a read served by any is the same value, and a copy that fails one operation never corrupts the rest.
const raidStore = (stores: readonly Store[]): Store => ({
  get: async (key) => { for (const s of stores) { try { const v = await s.get(key); if (v !== null) return v } catch { /* this copy failed: fall back to the next */ } } return null },
  set: async (key, value) => { const errs: string[] = []; let ok = 0; for (const s of stores) { try { await s.set(key, value); ok++ } catch (e) { errs.push(String((e as { message?: string }).message ?? e)) } } if (!ok) throw new Error(`qpu-raid: all ${stores.length} store(s) failed to write ${key}: ${errs.join('; ')}`) },
  del: async (key) => { for (const s of stores) { try { await s.del(key) } catch { /* a copy already gone is fine */ } } },
})

// Payload's where operators mapped to the Mongo operators the raid tool ports; like/contains become a case-insensitive regex (the value escaped)
const OPS: Record<string, string> = { equals: '$eq', not_equals: '$ne', greater_than: '$gt', greater_than_equal: '$gte', less_than: '$lt', less_than_equal: '$lte', in: '$in', not_in: '$nin', exists: '$exists' }
const whereToFilter = (where: Where | undefined): Record<string, unknown> => {
  if (!where || typeof where !== 'object') return {}
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(where)) {
    if (k === 'and') out.$and = (v as Where[]).map(whereToFilter)
    else if (k === 'or') out.$or = (v as Where[]).map(whereToFilter)
    else if (v && typeof v === 'object' && !Array.isArray(v)) {
      const cond: Record<string, unknown> = {}
      for (const [op, arg] of Object.entries(v as Record<string, unknown>)) {
        if (op in OPS) cond[OPS[op]!] = op === 'in' || op === 'not_in' ? (Array.isArray(arg) ? arg : String(arg).split(',')) : arg
        else if (op === 'like' || op === 'contains') { cond.$regex = String(arg).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); cond.$options = 'i' }
        else cond.$eq = arg // best effort for an operator the tree does not port (never guessed in the tool; here it narrows to equality)
      }
      out[k] = Object.keys(cond).length ? cond : v
    } else out[k] = v
  }
  return out
}
const toSort = (sort: unknown): Record<string, 1 | -1> => {
  const out: Record<string, 1 | -1> = {}
  for (const s of Array.isArray(sort) ? sort : sort ? [sort] : []) {
    if (typeof s === 'string') out[s.replace(/^-/, '')] = s.startsWith('-') ? -1 : 1
    else if (s && typeof s === 'object') Object.assign(out, s)
  }
  return out
}
const page = <T>(rows: T[], pageN = 1, limit = 10, pagination = true): { docs: T[]; totalDocs: number; limit: number; page: number; totalPages: number; pagingCounter: number; hasPrevPage: boolean; hasNextPage: boolean; prevPage: number | null; nextPage: number | null } => {
  const paged = pagination && limit > 0, total = rows.length, lim = paged ? limit : total || 1, pages = paged ? Math.max(1, Math.ceil(total / lim)) : 1
  const p = paged ? pageN || 1 : 1, docs = paged ? rows.slice((p - 1) * lim, p * lim) : rows
  return { docs, totalDocs: total, limit: lim, page: p, totalPages: pages, pagingCounter: (p - 1) * lim + 1, hasPrevPage: p > 1, hasNextPage: p < pages, prevPage: p > 1 ? p - 1 : null, nextPage: p < pages ? p + 1 : null }
}

/** The RAID database adapter: MongoDB's language over per-collection content-addressed blobs, cached in process, verified by SHA-256, the head
 *  HMAC-signed with QPU_DATA_KEY when it is set. Binding 0 the filesystem when writable, else the R2 or KV binding. */
export const qpuRaidDb = (opts: { dir?: string; bindings?: Bindings; idType?: 'text' | 'number' } = {}) => {
  const idType = opts.idType ?? 'text' // Mongo's text (a UUID) or Postgres's number (a per-collection sequence) — both over the one content-addressed db
  const dir = opts.dir ?? process.env.QPU_BINDING0 ?? join(process.cwd(), '..', '.qpu')
  const bound = opts.bindings ?? ((globalThis as { __qpuBindings?: Bindings }).__qpuBindings ?? {})
  const fsOk = !opts.bindings && (() => { try { mkdirSync(dir, { recursive: true }); return true } catch { return false } })()
  // every persistent store available, composed as the RAID: the filesystem when writable, and each Cloudflare binding named — object store (R2),
  // key-value (KV), system database (D1). A write lands on all, a read is served by the first that answers, a delete clears all. With none
  // available the adapter refuses loudly rather than fall back to an ephemeral filesystem and lose data on a Worker.
  // one source of truth for the stores — each a [condition, name, factory]; the names manage() reports and the Store[] the RAID uses derive from the same
  // list, so a store can never be added or reordered in one without the other (no name/store desync)
  const candidates: [unknown, string, () => Store][] = [[fsOk, 'filesystem', () => fsStore(dir)], [bound.R2, 'r2', () => r2Store(bound.R2 as R2Like)], [bound.KV, 'kv', () => kvStore(bound.KV as KVLike)], [bound.D1, 'd1', () => d1Store(bound.D1 as D1Like)], [bound.PG, 'postgres', () => pgStore(bound.PG as PgLike)]]
  const chosen = candidates.filter(([on]) => on)
  const storeNames = chosen.map(([, n]) => n), available: Store[] = chosen.map(([, , make]) => make())
  if (!available.length) throw new Error('qpu-raid: no persistent store — the filesystem is not writable and no R2, KV, D1 or Postgres binding is named; name a binding, a system database or a Postgres pool')
  const store: Store = available.length === 1 ? available[0]! : raidStore(available)
  const key = process.env.QPU_DATA_KEY
  const sign = (addr: string) => (key ? `${addr}.${createHmac('sha256', key).update(addr).digest('hex')}` : addr)
  const verifyHead = (head: string): string => { if (!key) return head; const [addr, mac] = head.split('.'); if (!addr || createHmac('sha256', key).update(addr).digest('hex') !== mac) throw new Error('qpu-raid: the head signature does not verify (QPU_DATA_KEY)'); return addr }

  // the teleport balancer: a collection's blob parsed once per content address and reused by any later read the head signals the same address for —
  // a block teleported, not re-fetched (the 304 involution), so at scale a read costs one tiny head GET and the big blob is fetched only when it
  // changed; the blocks are immutable (content-addressed), so a write clones before it mutates and never disturbs a teleported block
  const teleport = new Map<string, Map<string, Doc>>() // content address → { id: doc }
  const map = async (collection: string): Promise<Map<string, Doc>> => {
    const head = await store.get(headKey(collection)); if (!head) return new Map<string, Doc>()
    const addr = verifyHead(head), hit = teleport.get(addr); if (hit) return hit // the head signals the address; unchanged ⇒ teleport, no blob GET
    const blob = await store.get(blobKey(addr)); if (blob === null || sha(blob) !== addr) throw new Error(`qpu-raid: ${collection} blob missing or not at its address ${addr.slice(0, 12)}`)
    const m = new Map<string, Doc>(Object.entries(JSON.parse(blob) as Record<string, Doc>)); teleport.set(addr, m); return m
  }
  const save = async (collection: string, m: Map<string, Doc>) => {
    const oldHead = await store.get(headKey(collection)), oldAddr = oldHead ? verifyHead(oldHead) : null
    const blob = JSON.stringify(Object.fromEntries(m)), addr = sha(blob)
    await store.set(blobKey(addr), blob); await store.set(headKey(collection), sign(addr)); teleport.set(addr, m)
    // autodelete the superseded blob once the new head is written: no head links it, so nothing does; keeps a collection at one blob, not a
    // snapshot per write (the 242 GB bug). The empty blob is shared by every empty collection, so it is never collected. SLA holds: the new
    // blob and head are in place before the old blob goes, so a read is always served by a blob at the head's address.
    if (oldAddr && oldAddr !== addr && oldAddr !== EMPTY_ADDR) { try { await store.del(blobKey(oldAddr)); teleport.delete(oldAddr) } catch { /* already collected */ } }
  }
  const rows = async (collection: string): Promise<Doc[]> => [...(await map(collection)).values()]
  const find = async (collection: string, where: Where | undefined, sort?: unknown, skip = 0, limit?: number): Promise<Doc[]> => ((mongo({ op: 'find', collection, docs: await rows(collection), filter: whereToFilter(where), sort: toSort(sort), skip, ...(limit === undefined ? {} : { limit }) }) as { docs?: Doc[] }).docs ?? [])
  const one = async (collection: string, where: Where | undefined): Promise<Doc | null> => (await find(collection, where, undefined, 0, 1))[0] ?? null
  // the next id when none is given: Mongo's text (a UUID), or Postgres's number (one past the largest numeric id the collection holds — a sequence
  // that needs no counter row, read from the content-addressed blob already in hand)
  const nextId = (m: Map<string, Doc>): string | number => (idType === 'number' ? [...m.keys()].reduce((mx, k) => (Number.isFinite(Number(k)) ? Math.max(mx, Number(k)) : mx), 0) + 1 : randomUUID())
  const put = async (collection: string, data: Doc, id?: string): Promise<Doc> => { const m = new Map(await map(collection)), doc = { ...data, id: id ?? (data.id as string | number) ?? nextId(m) }; m.set(String(doc.id), doc); await save(collection, m); return doc }
  const drop = async (collection: string, id: unknown) => { const base = await map(collection); if (!base.has(String(id))) return; const m = new Map(base); m.delete(String(id)); await save(collection, m) }
  const byId = (id: unknown): Where => ({ id: { equals: id } })
  const vcoll = (collection: string) => `_${collection}_versions`

  // autodelete the orphaned binding-0 blobs no head links to any more — the superseded snapshots past writes left behind. Read every head for the
  // addresses still referenced, then delete every blob whose filename (its own address) is none of them. Filesystem only; a Cloudflare store uses
  // its own object-lifecycle rules. Runs when Payload initialises, so storage self-heals with no manual step (the per-save GC keeps it bounded after).
  const gcOrphanBlobs = (): { deleted: number; freed: number } => {
    if (!fsOk) return { deleted: 0, freed: 0 }
    const raid = join(dir, 'raid'); if (!existsSync(raid)) return { deleted: 0, freed: 0 }
    const referenced = new Set<string>([EMPTY_ADDR])
    const heads = join(raid, 'heads'); if (existsSync(heads)) for (const f of readdirSync(heads)) { try { referenced.add(verifyHead(readFileSync(join(heads, f), 'utf8'))) } catch { /* an unreadable head references nothing */ } }
    let deleted = 0, freed = 0
    for (const a of readdirSync(raid)) { if (a === 'heads' || a.length !== 2) continue; const ad = join(raid, a); for (const b of readdirSync(ad)) { const bd = join(ad, b); for (const fn of readdirSync(bd)) { if (referenced.has(fn)) continue; const p = join(bd, fn); try { freed += statSync(p).size; rmSync(p); deleted++ } catch { /* already collected */ } } } }
    return { deleted, freed }
  }

  // the whole RAID as the admin manages it: what is bound, what it holds, what it can do, and who may do each — reporting only; every action is a
  // `mongo` tool call run under the MCP key's roles, so RBAC is the tree's access (mayChoose), never re-decided in the view. A reader sees the state;
  // verify, mirror and a destructive rebuild or delete are gated to the roles the access config names.
  const manage = async (collections: readonly string[] = []): Promise<{ stores: string[]; idType: string; signed: boolean; collections: { collection: string; address: string | null; docs: number }[]; capabilities: { op: string; does: string; role: string }[]; rbac: string }> => {
    const cols = await Promise.all(collections.map(async (c) => { const head = await store.get(headKey(c)); const addr = head ? verifyHead(head) : null; return { collection: c, address: addr, docs: (await map(c)).size } }))
    return {
      stores: storeNames, idType, signed: Boolean(key), collections: cols,
      capabilities: [
        { op: 'find/insert/update/delete', does: 'the Mongo query language over per-collection content-addressed blobs — Payload CRUD, drafts, versions and globals; Postgres and Mongo one db', role: 'reader reads, editor writes' },
        { op: 'mirror/restore', does: 'binding 0 hex-path: each document once at its content address (g1/g2/g3/<uuid>), read back only when its address verifies', role: 'editor' },
        { op: 'verify', does: 'every copy on every binding verified against bit 0; a missing or hand-edited copy rebuilt from a verified one (the qpu-raid-verify job)', role: 'editor' },
        { op: 'health', does: 'per-binding SMART health against bit 0; a degraded binding opens a lead', role: 'reader' },
        { op: 'gc', does: 'orphan blobs no head links autodeleted (per write and on init), so storage self-heals', role: 'admin' },
        { op: 'associate/validate', does: 'Rails-style associations and validations rendered as Payload fields and hooks', role: 'editor' },
      ],
      rbac: 'reporting only: every op runs through the mongo tool under the MCP key\'s roles, and the tree\'s access (mayChoose) gates who reads, who verifies or mirrors, and who runs a destructive rebuild, GC or delete — never re-decided here',
    }
  }

  const adapter = ({ payload }: { payload: Payload }) => {
    try { const g = gcOrphanBlobs(); if (g.deleted) console.log(`qpu-raid: autodeleted ${g.deleted} orphan blob(s), freed ${(g.freed / 1e9).toFixed(1)} GB (no head links them)`) } catch { /* gc is best-effort, never blocks init */ }
    return createDatabaseAdapter({
    name: 'qpu-raid',
    payload,
    defaultIDType: idType,
    allowIDOnCreate: true,
    packageName: '@uuidna/qpu-raid',
    // collections --------------------------------------------------------
    create: async ({ collection, data }: { collection: string; data: Doc }) => put(collection, data),
    find: async ({ collection, where, sort, page: p = 1, limit = 10, pagination = true }: { collection: string; where?: Where; sort?: unknown; page?: number; limit?: number; pagination?: boolean }) => page(await find(collection, where, sort), p, limit, pagination) as never,
    findOne: async ({ collection, where }: { collection: string; where?: Where }) => (await one(collection, where)) as never,
    findDistinct: async ({ collection, field, where, sort, page: p = 1, limit = 0 }: { collection: string; field: string; where?: Where; sort?: unknown; page?: number; limit?: number }) => { const vals = [...new Map((await find(collection, where, sort)).map((d) => [JSON.stringify((d as Doc)[field]), { [field]: (d as Doc)[field] }])).values()]; return { ...page(vals, p, limit, limit > 0), values: (limit > 0 ? vals.slice((p - 1) * limit, p * limit) : vals) } as never },
    count: async ({ collection, where }: { collection: string; where?: Where }) => ({ totalDocs: (await find(collection, where)).length }),
    updateOne: async ({ collection, id, where, data }: { collection: string; id?: string; where?: Where; data: Doc }) => { const cur = id !== undefined ? await one(collection, byId(id)) : await one(collection, where); if (!cur) return null as never; return put(collection, { ...cur, ...data }, cur.id as string) },
    updateMany: async ({ collection, where, data }: { collection: string; where?: Where; data: Doc }) => { const out: Doc[] = []; for (const cur of await find(collection, where)) out.push(await put(collection, { ...cur, ...data }, cur.id as string)); return out as never },
    upsert: async ({ collection, where, data }: { collection: string; where?: Where; data: Doc }) => { const cur = await one(collection, where); return cur ? put(collection, { ...cur, ...data }, cur.id as string) : put(collection, data) },
    deleteOne: async ({ collection, where }: { collection: string; where?: Where }) => { const cur = await one(collection, where); if (cur) await drop(collection, cur.id); return cur as never },
    deleteMany: async ({ collection, where }: { collection: string; where?: Where }) => { for (const cur of await find(collection, where)) await drop(collection, cur.id) },
    queryDrafts: async ({ collection, where, sort, page: p = 1, limit = 10, pagination = true }: { collection: string; where?: Where; sort?: unknown; page?: number; limit?: number; pagination?: boolean }) => { const latest = await find(vcoll(collection), { ...(where ?? {}), latest: { equals: true } } as Where, sort); return page(latest.map((v) => ({ ...(v.version as Doc), id: v.parent })), p, limit, pagination) as never },
    // versions -----------------------------------------------------------
    createVersion: async ({ collectionSlug, parent, versionData, autosave, createdAt, updatedAt, snapshot, publishedLocale }: { collectionSlug: string; parent: unknown; versionData: Doc; autosave?: boolean; createdAt?: string; updatedAt?: string; snapshot?: unknown; publishedLocale?: string }) => { for (const old of await find(vcoll(collectionSlug), { parent: { equals: parent } } as Where)) if (old.latest) await put(vcoll(collectionSlug), { ...old, latest: false }, old.id as string); return put(vcoll(collectionSlug), { parent, version: versionData, autosave: Boolean(autosave), latest: true, snapshot, publishedLocale, createdAt: createdAt ?? new Date().toISOString(), updatedAt: updatedAt ?? new Date().toISOString() }) as never },
    createGlobalVersion: async ({ globalSlug, parent, versionData, autosave, createdAt, updatedAt, snapshot, publishedLocale }: { globalSlug: string; parent: unknown; versionData: Doc; autosave?: boolean; createdAt?: string; updatedAt?: string; snapshot?: unknown; publishedLocale?: string }) => { for (const old of await find('_globals_versions', { parent: { equals: globalSlug } } as Where)) if (old.latest) await put('_globals_versions', { ...old, latest: false }, old.id as string); return put('_globals_versions', { parent: globalSlug, global: globalSlug, version: versionData, autosave: Boolean(autosave), latest: true, snapshot, publishedLocale, createdAt: createdAt ?? new Date().toISOString(), updatedAt: updatedAt ?? new Date().toISOString() }) as never },
    findVersions: async ({ collection, where, sort, page: p = 1, limit = 10, pagination = true }: { collection: string; where?: Where; sort?: unknown; page?: number; limit?: number; pagination?: boolean }) => page(await find(vcoll(collection), where, sort), p, limit, pagination) as never,
    findGlobalVersions: async ({ global, where, sort, page: p = 1, limit = 10, pagination = true }: { global: string; where?: Where; sort?: unknown; page?: number; limit?: number; pagination?: boolean }) => page(await find('_globals_versions', { ...(where ?? {}), global: { equals: global } } as Where, sort), p, limit, pagination) as never,
    countVersions: async ({ collection, where }: { collection: string; where?: Where }) => ({ totalDocs: (await find(vcoll(collection), where)).length }),
    countGlobalVersions: async ({ global, where }: { global: string; where?: Where }) => ({ totalDocs: (await find('_globals_versions', { ...(where ?? {}), global: { equals: global } } as Where)).length }),
    updateVersion: async ({ collection, where, versionData }: { collection: string; where?: Where; versionData: Doc }) => { const cur = await one(vcoll(collection), where); if (!cur) return null as never; return put(vcoll(collection), { ...cur, version: versionData }, cur.id as string) },
    updateGlobalVersion: async ({ global, where, versionData }: { global: string; where?: Where; versionData: Doc }) => { const cur = await one('_globals_versions', { ...(where ?? {}), global: { equals: global } } as Where); if (!cur) return null as never; return put('_globals_versions', { ...cur, version: versionData }, cur.id as string) },
    deleteVersions: async ({ collection, where }: { collection: string; where?: Where }) => { for (const cur of await find(vcoll(collection), where)) await drop(vcoll(collection), cur.id) },
    // globals ------------------------------------------------------------
    createGlobal: async ({ slug, data }: { slug: string; data: Doc }) => put('globals', { ...data, globalType: slug }, slug),
    findGlobal: async ({ slug, where }: { slug: string; where?: Where }) => (await one('globals', { ...(where ?? {}), globalType: { equals: slug } } as Where)) as never,
    updateGlobal: async ({ slug, data }: { slug: string; data: Doc }) => { const cur = await one('globals', { globalType: { equals: slug } } as Where); return put('globals', { ...(cur ?? {}), ...data, globalType: slug }, slug) },
  } as never)
  }
  return { name: 'qpu-raid', allowIDOnCreate: true, defaultIDType: idType, init: adapter, manage }
}
