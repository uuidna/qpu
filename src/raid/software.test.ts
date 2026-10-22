import { test } from 'node:test'
import assert from 'node:assert/strict'
import { encodeRaid1, encodeRaid5, decode } from './software.js'

const sample = (n: number) => Uint8Array.from({ length: n }, (_, i) => (i * 37 + 11) & 0xff)
const withLost = (disks: (Uint8Array | null)[], lost: number[]) => disks.map((d, i) => (lost.includes(i) ? null : d))

test('RAID-5 round-trips every length and disk count', () => {
  for (const disks of [3, 4, 5, 7]) for (const n of [0, 1, 2, 7, 100, 1000]) {
    const data = sample(n)
    assert.deepEqual(decode(encodeRaid5(data, disks)), data, `disks ${disks}, length ${n}`)
  }
})

test('RAID-5 rebuilds any single lost disk, data or parity', () => {
  for (const disks of [3, 4, 5]) {
    const data = sample(257)
    const enc = encodeRaid5(data, disks)
    for (let lost = 0; lost < disks; lost++) {
      assert.deepEqual(decode({ ...enc, disks: withLost(enc.disks, [lost]) }), data, `disks ${disks}, lost ${lost}`)
    }
  }
})

test('RAID-5 refuses two lost disks instead of guessing', () => {
  const enc = encodeRaid5(sample(64), 4)
  assert.throws(() => decode({ ...enc, disks: withLost(enc.disks, [0, 2]) }), /cannot recover 2 lost disks/)
})

test('RAID-1 round-trips and survives all but one copy', () => {
  const data = sample(50)
  const enc = encodeRaid1(data, 3)
  assert.deepEqual(decode(enc), data)
  assert.deepEqual(decode({ ...enc, disks: withLost(enc.disks, [0, 1]) }), data)
  assert.throws(() => decode({ ...enc, disks: withLost(enc.disks, [0, 1, 2]) }), /every copy is lost/)
})

test('the layouts refuse too few disks', () => {
  assert.throws(() => encodeRaid5(sample(4), 2), /at least three/)
  assert.throws(() => encodeRaid1(sample(4), 1), /at least two/)
})
