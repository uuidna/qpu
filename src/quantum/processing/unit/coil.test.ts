import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  qpuBalanceHolds,
  qpuCoilEfficiencyHolds,
  qpuCoilEfficiencyOf,
  qpuCoilHolds,
  qpuCoilOf,
  qpuCircuitHolds,
  qpuDocsOf,
  qpuElectronicsHolds,
  qpuFacesOf,
  qpuFollowHolds,
  qpuFollowOf,
  qpuHandleOf,
  qpuLeanOf,
  qpuNextHolds,
  qpuNextOf,
  qpuClayHolds,
  qpuClayOf,
  qpuRaidHolds,
  qpuRaidOf,
} from './index.js'

test('two coins make a coil used in electronics — coins balance theory in practice', () => {
  const coil = qpuCoilOf()
  const faces = qpuFacesOf()
  assert.equal(qpuCoilHolds(coil), true)
  assert.equal(qpuElectronicsHolds(), true)
  assert.equal(qpuBalanceHolds(), true)
  assert.equal(coil.windings, 2)
  assert.equal(coil.theory, coil.practice)
  assert.equal(coil.theory + coil.practice, coil.coins)
  assert.equal(coil.coil, faces.faces)
  assert.equal(coil.coil, coil.coins * coil.rays)
  assert.equal(coil.electronics, true)
})

test('follow the coins in any practical application and creative novel solutions emerge', () => {
  const follow = qpuFollowOf()
  assert.equal(qpuFollowHolds(follow), true)
  assert.equal(follow.theorem, 'follow_the_coins')
  assert.equal(follow.emerge.creative, true)
  assert.equal(follow.emerge.novel, true)
  assert.equal(follow.emerge.coil, follow.emerge.faces)
  assert.equal(
    follow.solutions.every((row) => row.novel && row.hop === row.via),
    true,
  )
})

test('measure coil efficiency in clusters — unity when coil covers faces', () => {
  const efficiency = qpuCoilEfficiencyOf()
  const raid = qpuRaidOf()
  const faces = qpuFacesOf()
  assert.equal(qpuRaidHolds(raid), true)
  assert.equal(qpuCoilEfficiencyHolds(efficiency), true)
  assert.equal(efficiency.theorem, 'coil_efficiency')
  assert.equal(efficiency.measure, faces.faces)
  assert.equal(efficiency.measure, efficiency.teams * efficiency.stripes)
  assert.equal(efficiency.remainder, 0)
  assert.equal(efficiency.unity, 1)
  assert.equal(efficiency.vacant, 0)
  assert.equal(efficiency.occupied, 14)
  assert.equal(efficiency.nodes.length, 14)
  assert.equal(raid.cluster.measure, efficiency.measure)
  assert.equal(raid.cluster.unity, 1)
  assert.equal(raid.cluster.remainder, 0)
  assert.equal(
    efficiency.nodes.every((node) => node.involution && node.holds && node.measure === efficiency.measure),
    true,
  )
})

test('next is the double — coil times mintOf bits plus coins is fused plus fused, no last k', () => {
  const next = qpuNextOf()
  const handle = qpuHandleOf()
  const coil = qpuCoilOf()
  assert.equal(qpuNextHolds(next), true)
  assert.equal(next.last, false)
  assert.equal(next.infinite, true)
  assert.equal(next.next, handle.amplitudes + handle.amplitudes)
  assert.equal(next.nextFused, next.fused + next.fused)
  assert.equal(next.nextCoil, next.nextFused)
  assert.equal(next.coil, coil.coil)
  assert.equal(next.theorem, 'next_coil')
})

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

test('coil theorems sit on Lean rows and the fridge — docs stay seven', () => {
  const lean = qpuLeanOf()
  const docs = qpuDocsOf()
  const names = [
    'two_coins_make_a_coil',
    'electronics',
    'coins_balance_theory_in_practice',
    'follow_the_coins',
    'emerge',
    'coil_efficiency',
    'next_coil',
    'one_plus_six',
    'two_x_seven_coins',
    'clay',
  ]
  for (const heading of names) {
    const row = [...lean.rows, ...lean.cover].find((r) => r.heading === heading)
    assert.equal(row?.holds, true)
    assert.equal(row?.theorem.startsWith(`theorem ${heading}`), true)
    assert.equal(row?.theorem.includes('by decide'), false)
  }
  assert.equal(lean.holds, true)
  assert.equal(qpuCircuitHolds(), true)
  assert.equal(docs.api.length, 7)
})
