import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  BASE, COINS, DONATE_URL, HANDLE_HEXBITS, HEXBIT_BITS, QPU_HOST, QPU_POINTS, SEAL_TEN, TRINITY, VE_FACES,
  donateUrl, qpuFacesOf, qpuHologramOf, qpuMachineOf, qpuSeatOf, qpuWidthOf, throughVoid,
} from './hologram.js'

test('seat stays empty', () => {
  const s = qpuSeatOf()
  assert.equal(s.name, 'QPU')
  assert.equal(s.seat, 'empty')
  assert.equal(s.admits, 'nothing')
})

test('width is the five BindingPoint names', () => {
  const w = qpuWidthOf()
  assert.deepEqual(w.points, ['CPU', 'GPU', 'RAM', 'CACHE', 'STORAGE'])
  assert.equal(w.pentagram, QPU_POINTS.length)
  assert.equal(w.pentagram, 5)
})

test('hologram widths are derived, not stranded', () => {
  const h = qpuHologramOf()
  assert.equal(h.foundation, 0)
  assert.equal(h.debit, TRINITY)
  assert.equal(h.credit, HEXBIT_BITS + COINS)
  assert.equal(h.pentagram, QPU_POINTS.length)
  assert.equal(h.fold, BASE - COINS)
  assert.equal(h.octet, HANDLE_HEXBITS)
  assert.equal(h.veFaces, VE_FACES)
  assert.deepEqual(h.seal, [...SEAL_TEN])
  assert.equal(h.debit, 3)
  assert.equal(h.credit, 6)
  assert.equal(h.fold, 7)
  assert.equal(h.octet, 8)
  assert.equal(h.veFaces, 14)
})

test('fourteen faces pair through the void', () => {
  const faces = qpuFacesOf()
  assert.equal(faces.length, VE_FACES)
  assert.equal(throughVoid(0), 0)
  assert.equal(throughVoid(5), 5)
})

test('machine names the worker host', () => {
  assert.equal(QPU_HOST, 'qpu.uuidna.com')
  assert.equal(qpuMachineOf().host, QPU_HOST)
})

test('donate door is the same Revolut wallet as uuidna', () => {
  assert.equal(DONATE_URL, 'https://revolut.me/ceccec')
  assert.equal(
    donateUrl('https://qpu.uuidna.com'),
    'https://revolut.me/ceccec?note=https%3A%2F%2Fqpu.uuidna.com',
  )
})
