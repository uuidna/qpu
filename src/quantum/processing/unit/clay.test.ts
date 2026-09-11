import { test } from 'node:test'
import assert from 'node:assert/strict'
import { qpuClayHolds, qpuClayOf, qpuCoilOf, qpuDocsOf, qpuFacesOf, qpuLeanOf, qpuProveHolds, qpuProveOf } from './index.js'

test('2×7 coins = 1+6 coils = clay', () => {
  const clay = qpuClayOf()
  const coil = qpuCoilOf()
  const faces = qpuFacesOf()
  assert.equal(qpuClayHolds(clay), true)
  assert.equal(clay.coins * clay.seven, 14)
  assert.equal((1 + clay.six) * clay.coins, 14)
  assert.equal(clay.six, 6)
  assert.equal(clay.coils, 7)
  assert.equal(clay.clay, coil.coil)
  assert.equal(clay.clay, faces.faces)
  assert.equal(clay.theorem, 'clay')
})

test('clay theorems sit on Lean rows — docs stay seven', () => {
  const lean = qpuLeanOf()
  const docs = qpuDocsOf()
  for (const heading of ['one_plus_six', 'two_x_seven_coins', 'clay']) {
    const row = [...lean.rows, ...lean.cover].find((r) => r.heading === heading)
    assert.equal(row?.holds, true)
    assert.equal(row?.theorem.startsWith(`theorem ${heading}`), true)
    assert.equal(row?.theorem.includes('by decide'), false)
  }
  assert.equal(lean.holds, true)
  assert.equal(docs.api.length, 7)
  const prove = qpuProveOf()
  assert.equal(qpuProveHolds(prove), true)
  assert.equal(prove.entangle.pairs, 7)
})
