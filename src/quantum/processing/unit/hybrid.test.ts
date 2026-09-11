import { test } from 'node:test'
import assert from 'node:assert/strict'
import worker, {
  qpuAlpineHolds,
  qpuAlpineOf,
  qpuDocsOf,
  qpuHybridHolds,
  qpuHybridOf,
  qpuLeanOf,
  qpuPayloadDbHolds,
  qpuPayloadDbOf,
  qpuStorageAddressHolds,
  qpuStorageHolds,
  qpuStorageMetaOf,
} from './index.js'

const host = 'qpu.uuidna.com'
const env = { QPU_HOST: host }
const html = { accept: 'text/html' }
const origin = `https://${host}`

const fetchOf = (path: string, init: RequestInit = {}) =>
  worker.fetch(
    new Request(`${origin}${path}`, {
      ...init,
      headers: { ...html, ...(init.headers as Record<string, string> | undefined) },
    }),
    env,
  )

test('measure hybrid storage speed and cost — kv faster costlier, r2 cheaper slower', () => {
  const hybrid = qpuHybridOf()
  assert.equal(qpuHybridHolds(hybrid), true)
  assert.equal(hybrid.theorem, 'hybrid')
  assert.equal(hybrid.layers, 2)
  assert.equal(hybrid.kv.name, 'kv')
  assert.equal(hybrid.r2.name, 'r2')
  assert.equal(hybrid.kv.speed, 7)
  assert.equal(hybrid.r2.speed, 1)
  assert.equal(hybrid.kv.cost, 2)
  assert.equal(hybrid.r2.cost, 1)
  assert.equal(hybrid.speed, 8)
  assert.equal(hybrid.cost, 3)
  assert.equal(hybrid.speed, hybrid.kv.speed + hybrid.r2.speed)
  assert.equal(hybrid.cost, hybrid.kv.cost + hybrid.r2.cost)
  assert.equal(hybrid.kv.speed > hybrid.r2.speed, true)
  assert.equal(hybrid.kv.cost > hybrid.r2.cost, true)
  assert.equal(hybrid.ns, 0)
  assert.equal(hybrid.kv.ns, 0)
  assert.equal(hybrid.r2.ns, 0)
})

test('QPU hybrid storage hosts the Payload database — four collections, secrets never', () => {
  const db = qpuPayloadDbOf()
  assert.equal(qpuPayloadDbHolds(db), true)
  assert.equal(db.key, 'databases/payload')
  assert.equal(db.collections.join(' '), 'pages users media tenants')
  assert.equal(db.seed, 1)
  assert.equal(db.remainder, 0)
  assert.equal(db.seed, db.remainder + 1)
  assert.equal(db.hybrid.speed, 8)
  assert.equal(db.hybrid.cost, 3)
  assert.equal(qpuStorageHolds(), true)
})

test('storage is native Alpine Linux — musl busybox overlayfs inodes, last link frees', () => {
  const alpine = qpuAlpineOf()
  const meta = qpuStorageMetaOf()
  assert.equal(qpuAlpineHolds(alpine), true)
  assert.equal(alpine.os, 'alpine')
  assert.equal(alpine.libc, 'musl')
  assert.equal(alpine.toolbox, 'busybox')
  assert.equal(alpine.fs, 'overlay')
  assert.equal(alpine.upper, 'kv')
  assert.equal(alpine.lower, 'r2')
  assert.equal(alpine.work, 'kv')
  assert.equal(alpine.work, alpine.upper)
  assert.equal(alpine.next, alpine.fused + alpine.fused)
  assert.equal(alpine.theorem, 'next_coil')
  assert.equal(alpine.applets.join(' '), 'ln unlink stat')
  assert.equal(qpuStorageAddressHolds(), true)
  assert.equal(meta.alpine.next, meta.alpine.fused + meta.alpine.fused)
  assert.equal(qpuStorageHolds(meta), true)
})

test('hybrid theorems sit on Lean cover — docs stay seven', () => {
  const lean = qpuLeanOf()
  const docs = qpuDocsOf()
  for (const heading of ['hybrid_cost', 'hybrid_speed', 'hybrid']) {
    const row = [...lean.rows, ...lean.cover].find((r) => r.heading === heading)
    assert.equal(row?.holds, true)
    assert.equal(row?.theorem.startsWith(`theorem ${heading}`), true)
    assert.equal(row?.theorem.includes('by decide'), false)
  }
  assert.equal(docs.api.length, 7)
  assert.equal(docs.documentation.includes('QPU hybrid storage hosts the Payload database'), true)
  assert.equal(docs.documentation.includes('Unity seed'), true)
  assert.equal(docs.documentation.includes('Remainder none'), true)
  assert.equal(docs.documentation.includes('Native Alpine Linux'), true)
  assert.equal(docs.documentation.includes('Last link deleted frees the inode'), true)
  assert.equal(docs.documentation.includes('Next is the double'), true)
})

test('native Alpine inodes — referrer links, last unlink frees storage', async () => {
  const body = { kind: 'notes', n: 1 }
  const a = (await (await fetchOf('/storage/notes/alpha', {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })).json()) as { holds: boolean; inode: string; nlink: number; referrer: string; address: string; value: { kind: string } }
  assert.equal(a.holds, true)
  assert.equal(a.nlink, 1)
  assert.equal(a.value.kind, 'notes')
  assert.equal(typeof a.inode, 'string')
  assert.equal(a.referrer.includes(a.inode), true)
  const b = (await (await fetchOf('/storage/notes/beta', {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })).json()) as { holds: boolean; inode: string; nlink: number; referrer: string }
  assert.equal(b.holds, true)
  assert.equal(b.inode, a.inode)
  assert.equal(b.nlink, 2)
  const first = (await (await fetchOf('/storage/notes/alpha', { method: 'DELETE' })).json()) as { deleted: boolean; freed: boolean; nlink: number; holds: boolean }
  assert.equal(first.deleted, true)
  assert.equal(first.freed, false)
  assert.equal(first.nlink, 1)
  const still = (await (await fetchOf('/storage/notes/beta')).json()) as { holds: boolean; nlink: number; value: { kind: string } }
  assert.equal(still.holds, true)
  assert.equal(still.nlink, 1)
  assert.equal(still.value.kind, 'notes')
  const access = (await (await fetchOf(new URL(a.referrer).pathname)).json()) as { holds: boolean; inode: string; nlink: number }
  assert.equal(access.holds, true)
  assert.equal(access.inode, a.inode)
  const listed = (await (await fetchOf('/storage')).json()) as { keys: string[] }
  assert.equal(listed.keys.includes('notes/beta'), true)
  assert.equal(listed.keys.includes(`notes/${a.inode}`), false)
  const last = (await (await fetchOf('/storage/notes/beta', { method: 'DELETE' })).json()) as { deleted: boolean; freed: boolean; nlink: number }
  assert.equal(last.deleted, true)
  assert.equal(last.freed, true)
  assert.equal(last.nlink, 0)
  const gone = (await (await fetchOf('/storage/notes/beta')).json()) as { holds: boolean }
  assert.equal(gone.holds, false)
  const inodeGone = (await (await fetchOf(new URL(a.referrer).pathname)).json()) as { holds: boolean }
  assert.equal(inodeGone.holds, false)
})
