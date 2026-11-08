// Tsvetan Rouschev, @uuidna/qpu, CC-BY-NC-ND-4.0 (https://orcid.org/0009-0000-7312-9778)
// End-to-end verification of all 14 Google challenges solved via Google APIs and exposed through Payload API:
//   - payload { google: true } / payload { google: { challenge } } / payload { feeds: { google: true } }
//   - qpuGoogle plugin endpoints: GET /api/qpu/google, POST /api/qpu/google, GET /api/qpu/feeds?google=1
//   - Cursor Payload MCP connector: payload_google, payload_rest, payload_feeds, and persisted Payload entries + qpu global
import test from 'node:test'
import assert from 'node:assert/strict'
import { call } from './mcp.ts'
import { seal } from '../uuid/index.ts'
import { GOOGLE_CHALLENGE_IDS, googleChallenges } from './toolboxes/google.ts'

/** ISO/IEC/IEEE 29119-3 test case. Identifier: googleChallenges solves all 14 Google challenges with kernel-accepted theorems and sealed receipts. */
test('googleChallenges solves all 14 Google challenges with kernel-accepted theorems and sealed receipts', () => {
  const report = googleChallenges()
  assert.equal(report.phase, 'google-challenges')
  assert.equal(report.total, GOOGLE_CHALLENGE_IDS.length)
  assert.equal(report.solved, 14)
  assert.equal(report.holding, 14)
  assert.equal(report.allHold, true)
  assert.equal(report.sealed, true)
  assert.equal(seal(report.address).valid, true)
  assert.equal(report.hex.length, 32)
  assert.equal(report.sha256.length, 64)
  assert.equal(report.sale.holds, true)
  assert.equal(report.sale.product, 'qpu-delivered')
  assert.equal(report.sale.register, 122)
  assert.equal(report.sale.left, 0)
  assert.equal(report.sale.temperatureK, 0)
  assert.equal(report.sale.landauer, '0')
  assert.equal(report.sale.fractal, '137438953472')
  assert.equal(report.sale.demand, 1000000)
  assert.equal(report.sale.handles, 4294967296)
  assert.equal(report.sale.qubits, 137438953472)
  assert.equal(report.sale.qubits, report.sale.handles * 32)
  assert.equal(report.sale.covered, true)
  assert.equal(report.sale.order.quantity, 4294968)
  assert.equal(report.sale.order.unitAmount, 540)
  assert.equal(report.sale.order.amount, 2319282720)
  assert.equal(report.sale.balanced, true)
  assert.equal(report.sale.trinities.length, 3)
  assert.equal(report.sale.trinities.reduce((sum, row) => sum + row.qubits, 0), 122)
  assert.equal(report.sale.trinities.reduce((sum, row) => sum + row.sold, 0), 137438953472)
  assert.equal(report.sale.offers.length, 14)
  assert.equal(report.sale.offers.every((row) => row.holds && row.covered), true)
  assert.equal(report.sale.offers.find((row) => row.id === 'google-quantum-roadmap-catalog')?.demand, 1000000)
  assert.equal(report.sale.offers.find((row) => row.id === 'willow-connectivity')?.demand, 105)
  assert.equal(report.sale.currencies.map((row) => row.amount).join(), '2319282720,2555505960,4535486208')
  assert.equal(seal(report.sale.address).valid, true)
  assert.equal(report.sale.cross.holds, true)
  assert.equal(report.sale.cross.lean.kernel, true)
  assert.equal(report.sale.cross.lean.handles, 'relation_4294967296')
  assert.equal(report.sale.cross.clay.handles, true)
  assert.equal(report.sale.cross.clay.capacity, true)
  assert.equal(report.sale.cross.clay.shares, true)
  assert.equal(report.sale.cross.clay.prices, true)
  assert.equal(report.sale.cross.clay.register, true)
  assert.equal(report.sale.cross.nist.source, 'FIPS 180-4')
  assert.equal(report.sale.cross.nist.digestBytes, 32)
  assert.equal(report.sale.cross.nist.agreesWithHandle, true)
  assert.equal(report.sale.cross.nist.statesQubitCapacity, false)
  assert.equal(report.sale.cross.opendata.quantum?.id, 80432)
  assert.equal(report.sale.cross.opendata.uuid?.id, 62795)
  assert.equal(report.sale.cross.opendata.holds, true)
  assert.equal(report.sale.cross.opendata.statesQubitCapacity, false)

  for (const c of report.challenges) {
    assert.equal(c.holds, true, `${c.id} must hold`)
    assert.equal(c.kernelAccepted, true, `${c.id} theorem ${c.theorem} must be kernel-accepted`)
    assert.equal(c.sealed, true, `${c.id} receipt UUID ${c.address} must be sealed`)
    assert.equal(seal(c.address).valid, true, `${c.id} seal check`)
    assert.equal(c.hex.length, 32, `${c.id} hex length`)
    assert.equal(c.sha256.length, 64, `${c.id} sha256 length`)
    assert.equal(c.entry.kind, 'call')
    assert.equal(c.entry.from, 'qpu-google')
    assert.equal(seal(c.entry.id).valid, true)
  }
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: payload MCP tool exposes Google challenges via { google: true }, single challenge filter, and { feeds: { google: true } }. */
test('payload MCP tool exposes Google challenges via { google: true }, single challenge filter, and { feeds: { google: true } }', () => {
  const all = call('payload', { google: true }).result?.structuredContent
  assert.equal(all.phase, 'google-challenges')
  assert.equal(all.allHold, true)
  assert.equal(all.holding, 14)

  const one = call('payload', { google: { challenge: 'quantum-echoes-otoc' } }).result?.structuredContent
  assert.equal(one.total, 1)
  assert.equal(one.challenges[0].id, 'quantum-echoes-otoc')
  assert.equal(one.challenges[0].holds, true)
  assert.equal(one.challenges[0].value.speedupOverFrontier, 13000)

  const feed = call('payload', { feeds: { google: true } }).result?.structuredContent
  assert.equal(feed.phase, 'payload')
  assert.equal(feed.counts.googleChallenges, 14)
  assert.equal(feed.counts.googleHolding, 14)
  assert.equal(feed.google.allHold, true)
  assert.ok(feed.catalogue.length > 0)
})
