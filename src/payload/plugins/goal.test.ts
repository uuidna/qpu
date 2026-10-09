import { test } from 'node:test'
import assert from 'node:assert/strict'
import { CombinatoricsFormulas } from '../../families/combinatorics/index.js'
import { qpuFacesOf } from '../../quantum/processing/unit/index.js'
import { goalOf, goalStateOf } from './goal.js'

test('goal computes from combinatorics and is court-tried', () => {
  const faces = qpuFacesOf().faces
  const g = goalOf({ k: 1 })
  assert.equal(g.kind, 'goal')
  assert.equal(g.state, 'OPEN')
  assert.equal(g.goal, 'OPEN')
  assert.equal(g.holds, true)
  assert.equal(g.lattice.faces, faces)
  assert.equal(g.combinations.length, 5)
  const face = g.combinations.find((c) => c.role === 'faces')!
  assert.equal(face.value, CombinatoricsFormulas.combinations(faces, 1).value)
  assert.equal(face.holds, true)
  assert.ok(face.hex)
  const domain = g.combinations.find((c) => c.role === 'domain')!
  assert.ok(domain.value > 0)
  assert.equal(domain.holds, true)
  assert.equal(g.lattice.domain, domain.params[0])
  assert.equal(g.lattice.domainHeld, g.lattice.domain)
  assert.equal(g.measure, g.combinations.filter((c) => c.holds).reduce((a, c) => a + c.value, 0))
  assert.equal(g.court.case, 'goal.combinations')
  assert.equal(g.court.allow, true)
  assert.equal(g.court.fidelity.value, 1)
  assert.ok(g.court.standing.value > 0)
  assert.equal(typeof g.court.ms, 'number')
  assert.equal(g.connectBill.holds, true)
  assert.equal(goalStateOf(), 'OPEN')
})

test('goal measure grows with C(faces,k); LEAD when k out of range fails holds', () => {
  const faces = qpuFacesOf().faces
  const g1 = goalOf({ k: 1 })
  const g2 = goalOf({ k: 2 })
  assert.ok(g2.measure > g1.measure)
  assert.equal(g2.combinations.find((c) => c.role === 'faces')!.value, CombinatoricsFormulas.combinations(faces, 2).value)
  // k > faces → combinations holds false → LEAD
  const bad = goalOf({ k: faces + 1 })
  assert.equal(bad.combinations.find((c) => c.role === 'faces')!.holds, false)
  assert.equal(bad.state, 'LEAD')
  assert.equal(bad.holds, false)
})
