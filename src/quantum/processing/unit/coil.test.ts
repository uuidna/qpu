import { test } from './receipted.js'
import assert from 'node:assert/strict'
import {
  qpuBalanceHolds,
  qpuCoilEfficiencyHolds,
  qpuCoilEfficiencyOf,
  qpuCoilHolds,
  qpuCoilOf,
  qpuCircuitHolds,
  qpuCircuitOf,
  qpuDocsOf,
  qpuElectronicsHolds,
  qpuFacesOf,
  qpuFollowHolds,
  qpuFollowOf,
  qpuHandleOf,
  qpuLeanOf,
  qpuNextHolds,
  qpuNextOf,
  qpuCssHolds,
  qpuCssOf,
  qpuHybridHolds,
  qpuHybridOf,
  qpuPresenceHolds,
  qpuPresenceOf,
  qpuProveHolds,
  qpuProveOf,
  qpuRaidHolds,
  qpuRaidOf,
  qpuSandboxRunOf,
  qpuSpeedHolds,
  qpuSpeedOf,
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
})

test('follow the coins in any practical application — theory plus practice balances the coins, every point reached', () => {
  const follow = qpuFollowOf()
  assert.equal(qpuFollowHolds(follow), true)
  assert.equal(follow.theorem, 'follow_the_coins')
  assert.equal(follow.emerge.balanced, true)
  assert.equal(follow.emerge.covered, true)
  assert.equal(follow.emerge.coil, follow.emerge.faces)
  assert.equal(
    follow.solutions.every((row) => row.balanced && row.hop === row.via),
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
  assert.equal(next.next, handle.amplitudes + handle.amplitudes)
  assert.equal(next.nextFused, next.fused + next.fused)
  assert.equal(next.nextCoil, next.nextFused)
  assert.equal(next.coil, coil.coil)
  assert.equal(next.theorem, 'next_coil')
})

test('simulator fridge — resistance declared none, computations ns none', () => {
  const circuit = qpuCircuitOf()
  const speed = qpuSpeedOf()
  const hybrid = qpuHybridOf()
  const presence = qpuPresenceOf()
  const css = qpuCssOf()
  const lean = qpuLeanOf()
  const fridge = [...lean.rows, ...lean.cover].find((r) => r.heading === 'fridge')
  assert.equal(qpuCircuitHolds(circuit), true)
  assert.equal(circuit.fridge.kind, 'simulator')
  assert.equal(circuit.fridge.resistance, 0)
  assert.equal(circuit.fridge.holds, true)
  assert.equal(qpuSpeedHolds(speed), true)
  assert.equal(speed.benchmark.every((r) => r.holds && r.value === r.amplitudes), true)
  assert.equal(qpuHybridHolds(hybrid), true)
  assert.equal(hybrid.kv.speed > hybrid.r2.speed, true)
  assert.equal(qpuPresenceHolds(presence), true)
  assert.equal(qpuCssHolds(css), true)
  assert.equal(css.css.includes('animation-delay'), false)
  assert.equal(fridge?.holds, true)
  assert.equal(fridge?.theorem.includes('resistance = 0'), true)
  assert.equal(fridge?.theorem.includes('by decide'), false)
  const related = qpuSandboxRunOf('op_quantum') as {
    value: { related: string[]; fridge: { resistance: number }; ns: number; holds: boolean }
  }
  assert.equal(related.value.holds, true)
  assert.equal(related.value.fridge.resistance, 0)
  assert.equal(circuit.lattice.nodes.every((node) => related.value.related.includes(node.name)), true)
  const split = qpuSandboxRunOf('slot_split')
  const qubits = qpuSandboxRunOf('slot_qubits')
  const gates = qpuSandboxRunOf('slot_gates')
  const measurement = qpuSandboxRunOf('slot_measurement')
  assert.equal(split.holds, true)
  assert.equal(qubits.holds, true)
  assert.equal(gates.holds, true)
  assert.equal(measurement.holds, true)
  assert.equal((qpuSandboxRunOf('slot_resistance') as { value: unknown }).value, 0)
  assert.equal((qpuSandboxRunOf('slot_ns') as { value: unknown }).value, 0)
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
  const prove = qpuProveOf()
  assert.equal(qpuProveHolds(prove), true)
  assert.equal(prove.coil.holds, true)
  assert.equal(prove.entangle.product, false)
  assert.equal(prove.entangle.pairs, 7)
  assert.equal(prove.next.theorem, 'next_coil')
  assert.equal(prove.next.nextFused, prove.next.fused + prove.next.fused)
  assert.equal(prove.next.nextCoil, prove.next.nextFused)
  assert.equal(prove.theorems.find((r) => r.heading === 'next')?.holds, true)
})
