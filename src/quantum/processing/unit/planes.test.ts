import { test } from './receipted.js'
import assert from 'node:assert/strict'
import { qpuPlanesHolds, qpuPlanesOf, qpuReceiptLedgerOf } from './index.js'

// ONE PLANE CANNOT HOLD ENTANGLEMENT; PLANES FOLD. 4n numbers per plane is a product state by construction. The unit
// computes a rays-qubit GHZ state and folds it into the receipt ledger: a dimension one plane's carry cannot reach.
test('a single plane of 4n numbers is fewer than an entangled register needs at n = rays', () => {
  const p = qpuPlanesOf()
  assert.equal(qpuPlanesHolds(p), true)
  assert.equal(p.qubits, 7)
  assert.equal(p.plane, 28)
  assert.equal(p.needed, 256)
  assert.equal(p.planes, 2)
  assert.ok(p.plane < p.needed)
})

test('the fold holds what the plane cannot: a 7-qubit GHZ state, support |0000000> and |1111111>, receipted', () => {
  const p = qpuPlanesOf()
  assert.equal(p.ghz.dim, 128)
  assert.deepEqual(p.ghz.support, [0, 127])
  assert.equal(p.ghz.entangled, true)
  assert.equal(p.bell.product, false)
  assert.equal(p.bell.entangled, true)
  const row = qpuReceiptLedgerOf().find((r) => r.name === 'planes')
  assert.ok(row && row.dim === 128 && row.fold === p.ghz.fold)
  assert.equal(qpuPlanesOf().ghz.fold, p.ghz.fold)
})
