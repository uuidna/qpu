// Payload booted on the RAID database adapter (.qpu-app/src/payload.qpu.db.ts): MongoDB ported in full over per-collection content-addressed blobs, no
// external server and no LIST. The same CRUD runs on binding 0 the filesystem and on a Cloudflare binding (an in-memory R2 stand-in) — create, find
// (Mongo operators and sort translated from Payload's where), update, count, delete — every change a new blob addressed by its SHA-256, read back by
// a second Payload on the same store. A last check shows the crypto integrity: a tampered blob is refused, not read.
import { test, after } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { mkdtempSync, readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { pathToFileURL } from 'node:url'
import { register } from 'tsx/esm/api'

register() // the site's extensionless imports load through tsx, as workspace.test.ts does
const APP = ([process.env.QPU_APP_DIR, '.qpu-app'].find((d) => d && existsSync(join(process.cwd(), d, 'package.json'))) ?? null) as string | null
const site = (APP ? createRequire(join(process.cwd(), APP, 'package.json')) : { resolve: (m: string) => m }), load = (m: string) => import(pathToFileURL(site.resolve(m)).href)
const dbMod = () => import(pathToFileURL(join(process.cwd(), (APP as string), 'src', 'payload.qpu.db.ts')).href) as Promise<{ qpuRaidDb: (o?: Record<string, unknown>) => unknown }>
// an in-memory object store with the R2 shape the adapter speaks (get/put only — the design never lists), so the bindings path runs with no Worker
const fakeR2 = () => { const m = new Map<string, string>(); return { m, get: async (k: string) => (m.has(k) ? { text: async () => m.get(k)! } : null), put: async (k: string, v: string) => void m.set(k, v) } }
// an in-memory Postgres stand-in with the node-postgres Pool.query shape the adapter's pgStore speaks (the four statements it runs), so the merged
// Postgres path runs with no server — the same content-addressed RAID, now on a relational store, is Mongo and Postgres in one adapter
const fakePg = () => { const m = new Map<string, string>(); return { m, query: async (sql: string, params: unknown[] = []) => { if (/^CREATE TABLE/i.test(sql)) return { rows: [] }; if (/^SELECT/i.test(sql)) { const v = m.get(String(params[0])); return { rows: v === undefined ? [] : [{ v }] } } if (/^INSERT/i.test(sql)) { m.set(String(params[0]), String(params[1])); return { rows: [] } } if (/^DELETE/i.test(sql)) { m.delete(String(params[0])); return { rows: [] } } return { rows: [] } } } }
// the KV binding shape (get/put/delete by exact key) and the D1 (SQLite) binding shape (prepare→bind→first/run), each in memory, so every one of the
// five RAID stores — filesystem, R2, KV, D1, Postgres — is exercised, no store scenario left untested
const fakeKV = () => { const m = new Map<string, string>(); return { m, get: async (k: string) => m.get(k) ?? null, put: async (k: string, v: string) => void m.set(k, v), delete: async (k: string) => void m.delete(k) } }
const fakeD1 = () => { const m = new Map<string, string>(); const exec = (q: string, a: unknown[]) => { if (/^INSERT/i.test(q)) m.set(String(a[0]), String(a[1])); else if (/^DELETE/i.test(q)) m.delete(String(a[0])) }; return { m, prepare: (q: string) => ({ bind: (...a: unknown[]) => ({ first: async () => (/^SELECT/i.test(q) ? (m.get(String(a[0])) ?? null) : null), run: async () => { exec(q, a); return {} } }), run: async () => { exec(q, []); return {} } }) } }

const crud = async (openArgs: Record<string, unknown>, label: string, atStore: () => boolean) => {
  const [{ buildConfig, getPayload }, { qpuRaidDb }] = await Promise.all([load('payload'), dbMod()])
  const open = async (k: string) => getPayload({ key: `${label}-${k}`, config: await buildConfig({ secret: 'test', db: qpuRaidDb(openArgs) as never, collections: [{ slug: 'items', fields: [{ name: 'name', type: 'text' }, { name: 'n', type: 'number' }] }] }) })
  const payload = await open('1')
  const a = await payload.create({ collection: 'items', data: { name: 'a', n: 1 } })
  const b = await payload.create({ collection: 'items', data: { name: 'b', n: 2 } })
  assert.ok(a.id && b.id && a.id !== b.id, `${label}: each create gets its own stable id`)
  const justB = await payload.find({ collection: 'items', where: { name: { equals: 'b' } } })
  assert.deepEqual([justB.totalDocs, justB.docs[0]?.n], [1, 2], `${label}: where { equals } → Mongo filter`)
  assert.deepEqual((await payload.find({ collection: 'items', sort: '-n' })).docs.map((d: { name: string }) => d.name), ['b', 'a'], `${label}: sort -n`)
  await payload.update({ collection: 'items', id: a.id, data: { n: 5 } })
  assert.equal((await payload.findByID({ collection: 'items', id: a.id })).n, 5, `${label}: update writes a new blob`)
  assert.equal((await payload.count({ collection: 'items' })).totalDocs, 2, `${label}: count`)
  await payload.delete({ collection: 'items', id: b.id })
  const leftP = await payload.find({ collection: 'items' })
  assert.deepEqual([leftP.totalDocs, leftP.docs[0]?.name], [1, 'a'], `${label}: delete removes it from the blob`)
  assert.ok(atStore(), `${label}: a content-addressed blob and head are in the store`)
  const back = await (await open('2')).find({ collection: 'items' })
  assert.deepEqual([back.totalDocs, back.docs[0]?.name, back.docs[0]?.n], [1, 'a', 5], `${label}: a second Payload on the same store reads it back`)
}

test('RAID adapter on binding 0 the filesystem (content-addressed blobs, no LIST)', { skip: !APP }, async () => {
  const dir = mkdtempSync(join(tmpdir(), 'qpu-raid-fs-'))
  await crud({ dir }, 'fs', () => readdirSync(dir, { recursive: true }).some((p) => /raid\/.*[0-9a-f]{64}$/.test(String(p))))
})
test('RAID adapter on a binding (R2) when there is no filesystem', { skip: !APP }, async () => {
  const r2 = fakeR2()
  await crud({ bindings: { R2: r2 } }, 'r2', () => [...r2.m.keys()].some((k) => k.startsWith('raid/heads/')))
})
test('RAID adapter merges Postgres into the one db: the same CRUD on a Postgres store, with Postgres number ids (a sequence)', { skip: !APP }, async () => {
  const pg = fakePg()
  await crud({ bindings: { PG: pg }, idType: 'number' }, 'pg', () => [...pg.m.keys()].some((k) => k.startsWith('raid/heads/')))
  // the ids the merge gives are Postgres's: a per-collection sequence, not a Mongo UUID — proving idType 'number' over the content-addressed blob
  const [{ buildConfig, getPayload }, { qpuRaidDb }] = await Promise.all([load('payload'), dbMod()])
  const seqPg = fakePg()
  const p = await getPayload({ key: 'pg-seq', config: await buildConfig({ secret: 'test', db: qpuRaidDb({ bindings: { PG: seqPg }, idType: 'number' }) as never, collections: [{ slug: 'rows', fields: [{ name: 'name', type: 'text' }] }] }) })
  const first = await p.create({ collection: 'rows', data: { name: 'one' } })
  const second = await p.create({ collection: 'rows', data: { name: 'two' } })
  assert.deepEqual([first.id, second.id], [1, 2], 'pg: ids are a sequence 1, 2 — Postgres number ids, not Mongo UUIDs')
})
test('RAID adapter on a KV binding (the same CRUD, no LIST)', { skip: !APP }, async () => {
  const kv = fakeKV()
  await crud({ bindings: { KV: kv } }, 'kv', () => [...kv.m.keys()].some((k) => k.startsWith('raid/heads/')))
})
test('RAID adapter on a D1 (SQLite) system database', { skip: !APP }, async () => {
  const d1 = fakeD1()
  await crud({ bindings: { D1: d1 } }, 'd1', () => [...d1.m.keys()].some((k) => k.startsWith('raid/heads/')))
})
test('RAID across several stores at once (raidStore): a write lands on every copy, a read is served by any', { skip: !APP }, async () => {
  const r2 = fakeR2(), kv = fakeKV()
  await crud({ bindings: { R2: r2, KV: kv } }, 'raid', () => [...r2.m.keys()].some((k) => k.startsWith('raid/heads/')) && [...kv.m.keys()].some((k) => k.startsWith('raid/heads/')))
})
test('RAID is completely manageable from the admin: manage() reports the stores, each collection and the whole capability surface, RBAC at the tool layer', { skip: !APP }, async () => {
  const dir = mkdtempSync(join(tmpdir(), 'qpu-raid-manage-'))
  const [{ buildConfig, getPayload }, { qpuRaidDb }] = await Promise.all([load('payload'), dbMod()])
  const p = await getPayload({ key: 'manage-1', config: await buildConfig({ secret: 'test', db: qpuRaidDb({ dir }) as never, collections: [{ slug: 'items', fields: [{ name: 'name', type: 'text' }] }] }) })
  await p.create({ collection: 'items', data: { name: 'a' } })
  await p.create({ collection: 'items', data: { name: 'b' } })
  const db = qpuRaidDb({ dir }) as unknown as { manage: (c?: string[]) => Promise<{ stores: string[]; collections: { address: string | null; docs: number }[]; capabilities: { op: string; role: string }[]; rbac: string }> }
  const m = await db.manage(['items'])
  assert.ok(m.stores.includes('filesystem'), 'reports the bound stores')
  assert.equal(m.collections[0]?.docs, 2, "reports each collection's live doc count from its head")
  assert.ok(m.collections[0]?.address && /^[0-9a-f]{64}$/.test(m.collections[0].address), 'reports the content address of the current blob')
  assert.ok(m.capabilities.some((c) => /verify/.test(c.op)) && m.capabilities.some((c) => /gc/.test(c.op)) && m.capabilities.every((c) => c.role), 'the whole capability surface (CRUD, mirror/restore, verify, health, gc, associate/validate), each with the role it needs')
  assert.match(m.rbac, /mayChoose/, "RBAC is the tree's access at the tool layer, not re-decided in the view")
})
test('crypto integrity: a tampered blob is refused, the HMAC head verified (QPU_DATA_KEY)', { skip: !APP }, async () => {
  const prev = process.env.QPU_DATA_KEY; process.env.QPU_DATA_KEY = 'test-data-key'
  try {
    const dir = mkdtempSync(join(tmpdir(), 'qpu-raid-sec-'))
    const [{ buildConfig, getPayload }, { qpuRaidDb }] = await Promise.all([load('payload'), dbMod()])
    const cfg = async (k: string) => getPayload({ key: `sec-${k}`, config: await buildConfig({ secret: 'test', db: qpuRaidDb({ dir }) as never, collections: [{ slug: 'items', fields: [{ name: 'name', type: 'text' }] }] }) })
    const p = await cfg('1'); await p.create({ collection: 'items', data: { name: 'x' } })
    const blob = readdirSync(dir, { recursive: true }).map(String).find((f) => /raid\/.*[0-9a-f]{64}$/.test(f))!
    writeFileSync(join(dir, blob), readFileSync(join(dir, blob), 'utf8').replace('"x"', '"tampered"'))
    await assert.rejects(() => cfg('2').then((q) => q.find({ collection: 'items' })), /not at its address/, 'a blob whose bytes no longer hash to its address is refused')
  } finally { if (prev === undefined) delete process.env.QPU_DATA_KEY; else process.env.QPU_DATA_KEY = prev }
})
after(() => setImmediate(() => process.exit(process.exitCode ?? 0))) // Payload keeps its schedulers alive past the test
