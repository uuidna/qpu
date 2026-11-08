import assert from 'node:assert/strict'
import test from 'node:test'

import {
  HIDDEN_PERSPECTIVES,
  PRODUCER_TRINITIES,
  extractIsoFromProducers,
  extractIsoRefs,
  unlockHiddenPerspectives,
} from './iso-deliverables.ts'

void test('NIST CERN and Clay trinities unlock each hidden perspective', () => {
  const unlocked = unlockHiddenPerspectives(true)
  assert.equal(unlocked.holds, true)
  assert.equal(unlocked.space, 8)
  assert.equal(unlocked.variants, 8)
  assert.equal(unlocked.trinities.length, 3)
  assert.deepEqual(unlocked.trinities.map((row) => row.id), ['nist', 'cern', 'clay'])
  assert.deepEqual(PRODUCER_TRINITIES.nist.trinity, [3, 6, 9])
  assert.deepEqual(PRODUCER_TRINITIES.cern.trinity, [7, 4, 1])
  assert.deepEqual(PRODUCER_TRINITIES.clay.trinity, [2, 5, 8])
  assert.equal(unlocked.most.hidden.length, 0)
  assert.equal(unlocked.most.unlocked.length, HIDDEN_PERSPECTIVES.length)
  assert.equal(unlocked.hidden.length, 0)
  assert.deepEqual([...unlocked.unlocked].sort(), [...HIDDEN_PERSPECTIVES].sort())
})

void test('a single trinity leaves the other perspectives hidden', () => {
  const onlyNist = unlockHiddenPerspectives({ bits: 0b001 })
  assert.equal(onlyNist.active.on.join(), 'nist')
  assert.deepEqual(onlyNist.unlocked.sort(), ['legal', 'public'])
  assert.equal(onlyNist.hidden.includes('operator'), true)
  assert.equal(onlyNist.hidden.includes('developer'), true)
  assert.equal(onlyNist.holds, true)
})

void test('extract ISO standards from NIST and CERN producing, Clay unlocks perspectives', () => {
  const plan = extractIsoFromProducers(true)
  assert.equal(plan.holds, true)
  assert.equal(plan.via, 'nist+cern+clay')
  assert.equal(plan.producers, 2)
  assert.ok(plan.dimensions >= 6)
  assert.equal(plan.trinity.holds, true)
  assert.equal(plan.hidden.length, 0)
  assert.equal(plan.requestList.length >= 5, true)

  const text = 'See ISO/IEC 9834-8:2014 and ISO 80000-10:2019 beside ISO 22739:2024.'
  assert.deepEqual(extractIsoRefs(text), ['ISO/IEC 9834-8:2014', 'ISO 80000-10:2019', 'ISO 22739:2024'])

  const answers: Record<string, string> = {}
  for (const req of plan.requestList) answers[req.id] = text
  const verified = extractIsoFromProducers({ answers })
  assert.equal(verified.holds, true)
  assert.equal(verified.ladder.phase, 'verified')
  assert.equal(verified.trinity.most.unlocked.length, HIDDEN_PERSPECTIVES.length)
})
