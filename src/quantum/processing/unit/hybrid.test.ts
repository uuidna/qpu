import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
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
  assert.equal(hybrid.coordinated, true)
  assert.equal(hybrid.minimum, true)
})

test('QPU hybrid storage hosts the Payload database — four collections, secrets never', () => {
  const db = qpuPayloadDbOf()
  assert.equal(qpuPayloadDbHolds(db), true)
  assert.equal(db.key, 'databases/payload')
  assert.equal(db.collections.join(' '), 'pages users media tenants')
  assert.equal(db.seed, 1)
  assert.equal(db.remainder, 0)
  assert.equal(db.unity, true)
  assert.equal(db.secrets, false)
  assert.equal(db.auth, false)
  assert.equal(db.html, false)
  assert.equal(db.hybrid.speed, 8)
  assert.equal(db.hybrid.cost, 3)
  assert.equal(qpuStorageHolds(), true)
})

test('storage is native Alpine Linux — musl busybox overlayfs inodes, last link frees', () => {
  const alpine = qpuAlpineOf()
  const meta = qpuStorageMetaOf()
  assert.equal(qpuAlpineHolds(alpine), true)
  assert.equal(alpine.native, true)
  assert.equal(alpine.os, 'alpine')
  assert.equal(alpine.libc, 'musl')
  assert.equal(alpine.toolbox, 'busybox')
  assert.equal(alpine.fs, 'overlay')
  assert.equal(alpine.upper, 'kv')
  assert.equal(alpine.lower, 'r2')
  assert.equal(alpine.work, 'kv')
  assert.equal(alpine.work, alpine.upper)
  assert.equal(alpine.inode, true)
  assert.equal(alpine.unlink, true)
  assert.equal(alpine.last, false)
  assert.equal(alpine.infinite, true)
  assert.equal(alpine.next, alpine.fused + alpine.fused)
  assert.equal(alpine.theorem, 'next_coil')
  assert.equal(alpine.applets.join(' '), 'ln unlink stat')
  assert.equal(alpine.html, false)
  assert.equal(qpuStorageAddressHolds(), true)
  assert.equal(meta.alpine.native, true)
  assert.equal(meta.inode, true)
  assert.equal(meta.referrer, true)
  assert.equal(meta.privacy, true)
  assert.equal(meta.tracked, false)
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
  assert.equal(docs.abstract.includes('QPU hybrid storage hosts the Payload database'), true)
  assert.equal(docs.abstract.includes('Unity seed'), true)
  assert.equal(docs.abstract.includes('Remainder none'), true)
  assert.equal(docs.abstract.includes('Native Alpine Linux'), true)
  assert.equal(docs.abstract.includes('Last link deleted frees the inode'), true)
  assert.equal(docs.abstract.includes('Next is the double'), true)
})
