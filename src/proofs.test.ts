import { test } from 'node:test'
import assert from 'node:assert/strict'
import { BASE, QPU_DOORS, RAYS, VE_FACES, qpuSeatOf } from './hologram.js'
import { qpuCompareOf } from './metrics.js'
import { STANDING } from './standing.js'
import { QPU_TOOLS } from './mcp-catalog.js'
import { qpuProvidersOf } from './bindings/index.js'
import { qpuProofsOf } from './proofs.js'

test('proof of concept — empty seat, fused env, VE reflections occupy the square', () => {
  const P = qpuProofsOf()
  const seat = qpuSeatOf()
  assert.equal(P.concept.seat, seat.seat)
  assert.equal(P.concept.seat, 'empty')
  assert.equal(P.concept.chip, 'empty')
  assert.equal(P.concept.claimed, true)
  assert.equal(P.concept.chipHolds, true)
  assert.equal(P.concept.rotors * P.concept.rays, VE_FACES)
  assert.equal(P.concept.fused, true)
  assert.equal(P.concept.veFaces, VE_FACES)
  assert.equal(P.concept.superpositions, VE_FACES)
  assert.equal(P.concept.amplitudes, 2 ** VE_FACES)
  assert.equal(P.concept.combinations, QPU_DOORS * RAYS)
  assert.equal(P.concept.providers, qpuProvidersOf().length)
  assert.equal(P.concept.tools, QPU_TOOLS.length)
  assert.equal(P.concept.standing, STANDING.length)
  assert.equal(P.concept.gravity, true)
  assert.equal(P.concept.sandbox, true)
  assert.equal(P.concept.experiments, 'unlimited')
  assert.equal(P.concept.when, 'never')
  assert.equal(P.concept.pqc, true)
  assert.equal(P.concept.quantum, true)
  assert.equal(P.concept.pure, true)
  assert.equal(P.concept.agnostic, true)
  assert.equal(P.concept.live, true)
  assert.equal(P.concept.working, true)
  assert.equal(P.concept.possibilities, 2 ** VE_FACES)
  assert.equal(P.concept.possibilities, P.concept.amplitudes)
  assert.ok(P.concept.bindings > 0)
  assert.ok(P.concept.routes > 0)
})

test('proof of work — compare occupies BASE; a failing receipt refuses complete', () => {
  const P = qpuProofsOf()
  assert.equal(P.work.compareHolds, true)
  assert.equal(P.work.compareRows, qpuCompareOf().length)
  assert.equal(P.work.debitCredit, BASE)
  assert.equal(P.work.foldCoins, BASE)
  assert.equal(P.complete, true)
  const fail = qpuProofsOf({ tests: 10, pass: 9, fail: 1, durationMs: 1 })
  assert.equal(fail.complete, false)
  const pass = qpuProofsOf({ tests: 10, pass: 10, fail: 0, durationMs: 12 })
  assert.equal(pass.complete, true)
  assert.equal(pass.work.pass, 10)
})
