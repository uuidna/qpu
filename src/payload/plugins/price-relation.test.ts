import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import {
  catalogPriceRelationOf,
  nativeJobPriceOf,
  priceCourtTrialOf,
  priceRelationOf,
} from './price-relation.js'

test('price-relation: court-tried per case; half-pairs gate false; no priceInUSD', async (t) => {
  const catalog = catalogPriceRelationOf('commercial-license')
  assert.equal(catalog.kind, 'price-relation')
  assert.equal(catalog.goal, 'OPEN')
  assert.equal(catalog.ticket.minted, false)
  assert.ok(catalog.measure !== null && catalog.measure > 0)
  assert.equal(catalog.bare.length, 0)
  assert.equal(catalog.court.kind, 'price-court')
  assert.equal(catalog.court.standard.address, 'court.standard')
  assert.equal(catalog.court.fidelity.address, 'law.fidelity')
  assert.equal(catalog.court.standing.address, 'law.standing')
  assert.equal(catalog.court.reviewed.address, 'law.reviewed')
  assert.equal(catalog.court.reviewed.value, 0, 'advice gate stays a lead')
  assert.equal(catalog.court.holds, true)
  assert.equal(catalog.holds, true)
  assert.equal('priceInUSD' in catalog, false)
  assert.equal('priceInUSDEnabled' in catalog, false)

  const half = priceRelationOf({ items: 3 })
  assert.deepEqual(half.bare, ['unit'])
  assert.equal(half.court.standard.value, 0)
  assert.equal(half.holds, false, 'incomplete cart pair gates holds false')

  const fxHalf = priceRelationOf({ fxAmount: 100, latticeCost: true })
  assert.ok(fxHalf.bare.includes('fxRate'))
  assert.equal(fxHalf.holds, false)

  const fx = priceRelationOf({ items: 2, unit: 50, fxAmount: 100, fxRate: 10000 })
  assert.equal(fx.bare.length, 0)
  assert.ok(fx.legs.some((l) => l.address === 'ecommerce.cart'))
  assert.ok(fx.legs.some((l) => l.address === 'payment.fx'))
  assert.equal(fx.court.holds, true)
  assert.equal(fx.holds, true)
  assert.equal(fx.measure, 2 * 50 + 100)

  const job = nativeJobPriceOf({ vendorIndex: 0, vendor: 'qiskit', shots: 8, mode: 5, sealIndex: 0 })
  assert.equal(job.ticket.vendorIndex, 0)
  assert.equal(job.ticket.shots, 8)
  assert.ok(job.legs.some((l) => l.address === 'quantum.shots'))
  assert.ok(job.legs.some((l) => l.address === 'access.rank'))
  assert.equal(job.court.standard.value, 1)
  assert.equal(job.holds, true)

  const emptyTrial = priceCourtTrialOf([], ['rate'], null)
  assert.equal(emptyTrial.holds, false)

  t.diagnostic(`catalog measure=${catalog.measure} hex=${catalog.ticket.hex}; cart+fx measure=${fx.measure}; job legs=${job.legs.length}`)
})
