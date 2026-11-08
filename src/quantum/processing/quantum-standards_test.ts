import test from 'node:test'
import assert from 'node:assert/strict'
import { canonicalText, seal, uuid } from '../uuid/index.ts'
import { quantumStandards } from './quantum-vocabulary.ts'

/** ISO/IEC/IEEE 29119-3 test case. Identifier: each quantum standard is one sealed UUID and the receipt is that list. */
test('each quantum standard is one sealed UUID and the receipt is that list', () => {
  const s = quantumStandards()
  const again = quantumStandards()
  assert.equal(s.standard, 'ISO/IEC 4879:2024')
  assert.equal(s.via, 'uuid')
  assert.equal(s.dry, true)
  assert.equal(s.entropy, 0)
  assert.equal(s.total, 77)
  assert.equal(s.holding, 77)
  assert.equal(s.unique, 77)
  assert.equal(s.sealed, true)
  assert.equal(seal(s.address).valid, true)
  assert.equal(again.address, s.address)
  for (const t of s.terms) {
    assert.equal(t.holds, true)
    assert.equal(t.sealed, true)
    assert.equal(t.uuid, uuid(canonicalText({ clause: t.clause, name: t.name, standard: s.standard })))
    assert.equal(seal(t.uuid).valid, true)
  }
})
