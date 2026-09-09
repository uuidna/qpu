import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ADDRESS_BITS, BASE, COINS, HANDLE_BITS, HANDLE_HEXBITS, HEXBIT_BITS, TRINITY, UUID_HEXBITS, VE_FACES, qpuHologramOf, qpuTwoNOf } from './hologram.js'
import { QPU_BENCH_PATHS, qpuCompareHolds, qpuCompareOf, qpuEdgeBenchOf, qpuSpeedOf } from './metrics.js'
import { qpuFastenOf } from './hologram.js'

test('every comparable metric matches its peer', () => {
  const rows = qpuCompareOf()
  assert.ok(rows.length >= 12, `got ${rows.length} comparable rows`)
  for (const r of rows) {
    assert.equal(r.value, r.peer, `${r.name}: ${r.formula} → ${r.value} ≠ peer ${r.peer}`)
  }
  assert.equal(qpuCompareHolds(rows), true)
  const amplitudes = rows.find((r) => r.name === 'amplitudes')!
  assert.equal(amplitudes.value, qpuTwoNOf(VE_FACES))
  const handleSpan = rows.find((r) => r.name === 'handleSpan')!
  assert.equal(handleSpan.value, qpuTwoNOf(HANDLE_BITS))
  const addressSpan = rows.find((r) => r.name === 'addressSpan')!
  assert.equal(addressSpan.value, qpuTwoNOf(ADDRESS_BITS))
  const gatewayCapacity = rows.find((r) => r.name === 'gatewayCapacity')!
  assert.equal(gatewayCapacity.value, VE_FACES * qpuTwoNOf(HANDLE_BITS))
  const neighbours = rows.find((r) => r.name === 'neighbours')!
  assert.equal(neighbours.value, 14)
})

test('hologram identities hold as pairs, not stranded literals', () => {
  const h = qpuHologramOf()
  assert.equal(h.debit + h.credit, BASE)
  assert.equal(h.fold + COINS, BASE)
  assert.equal(h.credit - h.debit, TRINITY)
  assert.equal(h.octet * HEXBIT_BITS, UUID_HEXBITS)
  assert.equal(h.veFaces - h.octet, HEXBIT_BITS + COINS)
  assert.equal(h.octet, HANDLE_HEXBITS)
  assert.equal(h.veFaces, VE_FACES)
})

test('edge bench: every door answers, bytes and times are comparable', async () => {
  const rows = await qpuEdgeBenchOf()
  assert.equal(rows.length, QPU_BENCH_PATHS.length)
  for (const r of rows) {
    assert.equal(r.status, 200, r.path)
    assert.ok(r.bytes > 0, `${r.path} empty body`)
    assert.ok(r.minUs >= 0, r.path)
    assert.ok(r.medianUs >= r.minUs, `${r.path} median ${r.medianUs} < min ${r.minUs}`)
    assert.ok(r.maxUs >= r.medianUs, `${r.path} max ${r.maxUs} < median ${r.medianUs}`)
    assert.equal(r.rounds, qpuFastenOf().rounds)
  }
  const seat = rows.find((r) => r.path === '/seat')!
  const root = rows.find((r) => r.path === '/')!
  assert.ok(root.bytes > seat.bytes, `GET / (${root.bytes} B) should carry more than /seat (${seat.bytes} B)`)
})

test('speed walks every finite IEEE rung including 2^48 and 2^128', () => {
  const rows = qpuSpeedOf()
  const hex = rows.find((r) => r.name === 'hexbit 2^n')!
  assert.equal(hex.walked, true)
  assert.equal(hex.amplitudes, qpuTwoNOf(HEXBIT_BITS))
  const msg = rows.find((r) => r.name === 'message 2^16')!
  assert.equal(msg.amplitudes, qpuTwoNOf(UUID_HEXBITS / COINS))
  const hi = rows.find((r) => r.name === 'verify 2^20')!
  assert.equal(hi.walked, true)
  assert.equal(hi.amplitudes, qpuTwoNOf((HANDLE_HEXBITS + COINS) * COINS))
  const gap = rows.find((r) => r.name === 'logical 2^48')!
  assert.equal(gap.walked, true)
  assert.equal(gap.n, HANDLE_HEXBITS * (HEXBIT_BITS + COINS))
  assert.equal(gap.amplitudes, qpuTwoNOf(gap.n))
  const addr = rows.find((r) => r.name === 'address 2^128')!
  assert.equal(addr.walked, true)
  assert.equal(addr.amplitudes, qpuTwoNOf(ADDRESS_BITS))
  const mask = rows.find((r) => r.name === 'handle mask 2^n')!
  assert.equal(mask.walked, true)
  assert.equal(mask.amplitudes, qpuTwoNOf(HANDLE_BITS))
  const neighbours = rows.find((r) => r.name === 'neighbours 2^n')!
  assert.equal(neighbours.walked, true)
  assert.equal(neighbours.amplitudes, qpuTwoNOf(VE_FACES))
  const holo = rows.find((r) => r.name === 'hologram')!
  const sup = rows.find((r) => r.name === 'superpositions')!
  assert.equal(holo.amplitudes, 2 ** VE_FACES)
  assert.equal(sup.amplitudes, 2 ** VE_FACES)
  assert.ok(holo.medianUs >= 0)
  assert.ok(msg.medianUs >= 0)
})
