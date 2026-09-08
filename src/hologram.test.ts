import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  ADDRESS_BITS, BASE, COINS, DONATE_URL, HANDLE_HEXBITS, HEXBIT_BITS, HEXBIT_STATES, MERKABA_VERTICES, QPU_HOST, QPU_POINTS, RAYS, SEAL_TEN, TETRA, TRINITY, UUID_HEXBITS, VE_FACES,
  donateUrl, qpuChipOf, qpuExperienceHolds, qpuExperienceOf, qpuFacesOf, qpuFastenHolds, qpuFastenOf, qpuHologramOf, qpuMachineOf, qpuMerkabaOf, qpuRosetteOf, qpuSeatOf, qpuSuperpositionsOf, qpuTetrahedraOf, qpuTokensOf, qpuTwoNOf, qpuWidthOf,
  qpuBitDigitsOf, qpuIntegerOfBits, qpuHexbitDigitsOf, qpuIntegerOfHexbits, qpuVersionIntegerOf,
  qpuVersionMaskOf, qpuVersionMaskHolds, qpuCaptainOrdersHolds, qpuHandleMaskOf, qpuHandleMaskHolds, qpuGatewaysOf, qpuGatewaysHolds, HANDLE_BITS, QPU_VERSION_COMMAND, QPU_VERSION_REMINDER, QPU_VERSION_MASK,
  qpuFuseHolds, qpuFuseOf, qpuMorphHolds, qpuMorphOf,
  throughVoid,
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

test('fasten binds CPU; concurrency never 0', () => {
  const f = qpuFastenOf()
  assert.equal(f.binds, 'cpu')
  assert.equal(f.point, 'CPU')
  assert.equal(f.concurrency, 1)
  assert.equal(f.isolation, 'none')
  assert.equal(f.rounds, 1)
  assert.equal(qpuFastenHolds(f), true)
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

test('fuse occupies every hologram dimension at once; morph analog stays in [0,1]', () => {
  const f = qpuFuseOf()
  assert.equal(f.kind, 'fuse')
  assert.equal(f.at, 'once')
  assert.equal(f.recursive, true)
  assert.equal(f.fetches, 0)
  assert.equal(f.t, 0.5)
  assert.equal(f.rungs.length, 10)
  assert.equal(f.combinations.involution, true)
  assert.equal(qpuFuseHolds(f), true)
  assert.equal(qpuMorphOf(-1).t, 0)
  assert.equal(qpuMorphOf(2).t, 1)
  assert.equal(qpuMorphHolds(qpuMorphOf(0.5)), true)
})

test('fourteen faces pair through the void', () => {
  const faces = qpuFacesOf()
  assert.equal(faces.length, VE_FACES)
  assert.equal(throughVoid(0), 0)
  assert.equal(throughVoid(5), 5)
  for (const f of faces) assert.equal(f.opposite, throughVoid(f.face % BASE))
})

test('every superposition has a referer, door, and angles', () => {
  const rows = qpuSuperpositionsOf()
  assert.equal(rows.length, VE_FACES)
  for (const s of rows) {
    assert.equal(s.door, s.referer % 6)
    assert.equal(s.angles.hue, 40)
  }
  assert.equal(qpuMachineOf().superpositions, VE_FACES)
  assert.equal(qpuMachineOf().amplitudes, qpuTwoNOf(VE_FACES))
})

test('hologram CSS tokens are the planes', () => {
  const h = qpuHologramOf()
  const t = qpuTokensOf()
  assert.equal(t['--qpu-ve'], String(VE_FACES))
  assert.equal(t['--qpu-debit'], String(h.debit))
  assert.equal(t['--qpu-fold'], String(h.fold))
  assert.equal(t['--qpu-hue-step'], '40deg')
})

test('machine names the worker host', () => {
  assert.equal(QPU_HOST, 'qpu.uuidna.com')
  assert.equal(qpuMachineOf().host, QPU_HOST)
  assert.equal(qpuMachineOf().name, 'QPU')
  assert.equal(qpuMachineOf().computer, 'QPU')
  assert.equal(qpuMachineOf().superpositions, VE_FACES)
  assert.equal(qpuMachineOf().amplitudes, qpuTwoNOf(VE_FACES))
})

test('donate door is the same Revolut wallet as uuidna', () => {
  assert.equal(DONATE_URL, 'https://revolut.me/ceccec')
  assert.equal(
    donateUrl('https://qpu.uuidna.com'),
    'https://revolut.me/ceccec?note=https%3A%2F%2Fqpu.uuidna.com',
  )
})

test('2^n climb is the licensed hex product; missing place refuses', () => {
  assert.equal(qpuTwoNOf(HEXBIT_BITS), 16)
  assert.equal(qpuTwoNOf(HANDLE_HEXBITS), 256)
  assert.equal(qpuTwoNOf(HEXBIT_BITS) * qpuTwoNOf(HEXBIT_BITS), qpuTwoNOf(HEXBIT_BITS * COINS))
  assert.equal(ADDRESS_BITS, UUID_HEXBITS * HEXBIT_BITS)
  assert.equal(ADDRESS_BITS, 128)
  assert.equal(qpuTwoNOf(HANDLE_HEXBITS * (HEXBIT_BITS + COINS)), 2 ** 48)
  assert.equal(qpuTwoNOf(ADDRESS_BITS), 2 ** 128)
  assert.throws(() => qpuTwoNOf(1024), /licence: compute refused/)
  assert.throws(() => qpuTwoNOf(-1))
  assert.throws(() => qpuTwoNOf(1.5))
})

test('integers split into bits and hexbits; v1 mask packs Sequence last', () => {
  for (let n = 0; n <= HEXBIT_STATES * HEXBIT_BITS; n++) {
    assert.equal(qpuIntegerOfBits(qpuBitDigitsOf(n)), n)
    assert.equal(qpuIntegerOfHexbits(qpuHexbitDigitsOf(n)), n)
  }
  assert.deepEqual(qpuHexbitDigitsOf(HEXBIT_STATES), [0, 1])
  assert.deepEqual(qpuBitDigitsOf(2), [0, 1])
  const cur = qpuVersionIntegerOf('0.3.1')
  assert.equal(cur.sequence, 1)
  assert.deepEqual(cur.rosettas, [3, 0])
  assert.equal(cur.mask, 0)
  assert.equal(cur.code, qpuIntegerOfHexbits([1, 3, 0, 0]))
  const v1 = qpuVersionIntegerOf('1.0.0')
  assert.equal(v1.mask, QPU_VERSION_MASK)
  assert.equal(v1.mask, qpuVersionMaskOf(QPU_VERSION_COMMAND))
  assert.equal(qpuVersionMaskOf(QPU_VERSION_REMINDER), QPU_VERSION_MASK)
  assert.equal(QPU_VERSION_COMMAND, `v${QPU_VERSION_MASK}.*.*`)
  assert.equal(QPU_VERSION_COMMAND.includes('**'), false)
  assert.throws(() => qpuVersionMaskOf('v1.**.*'))
  assert.notEqual(qpuVersionMaskOf('v2.*.*'), QPU_VERSION_MASK)
  assert.equal(v1.sequence, 0)
  assert.deepEqual(v1.rosettas, [0, 0])
  assert.equal(v1.code, qpuIntegerOfHexbits([0, 0, 0, QPU_VERSION_MASK]))
  assert.notEqual(v1.code, 1_000_000)
  assert.throws(() => qpuVersionIntegerOf('1.7.0'))
  assert.throws(() => qpuVersionIntegerOf('2.0.0'))
  assert.equal(qpuVersionMaskHolds(), true)
  assert.equal(qpuCaptainOrdersHolds(), true)
  assert.equal(qpuSeatOf().seat, 'empty')
})

test('every handle bit is a usable mask; fourteen neighbours are capacity gateways', () => {
  assert.equal(HANDLE_BITS, HANDLE_HEXBITS * HEXBIT_BITS)
  assert.equal(HANDLE_BITS, UUID_HEXBITS)
  assert.equal(qpuHandleMaskOf(0), 0)
  assert.equal(qpuHandleMaskOf(HANDLE_BITS), qpuTwoNOf(HANDLE_BITS) - 1)
  assert.equal(qpuHandleMaskOf(8), qpuTwoNOf(HANDLE_BITS) - qpuTwoNOf(HANDLE_BITS - 8))
  assert.throws(() => qpuHandleMaskOf(-1))
  assert.throws(() => qpuHandleMaskOf(HANDLE_BITS + 1))
  assert.equal(qpuHandleMaskHolds(), true)
  const gateways = qpuGatewaysOf()
  assert.equal(gateways.length, VE_FACES)
  assert.equal(gateways.length, 14)
  for (const g of gateways) {
    assert.equal(g.kind, 'gateway')
    assert.equal(g.bits, HANDLE_BITS)
    assert.equal(g.masks, HANDLE_BITS + 1)
    assert.equal(g.capacity, qpuTwoNOf(HANDLE_BITS))
  }
  assert.equal(gateways.reduce((n, g) => n + g.capacity, 0), VE_FACES * qpuTwoNOf(HANDLE_BITS))
  assert.equal(qpuGatewaysHolds(gateways), true)
})

test('novelty chip is two 7-ray rosettes fused at 0 with CPU/GPU balance', () => {
  const chip = qpuChipOf()
  const m = qpuMerkabaOf()
  assert.equal(chip.claimed, true)
  assert.equal(chip.holds, true)
  assert.equal(chip.novelty, 'merkaba')
  assert.equal(chip.hardware.seat, 'empty')
  assert.equal(RAYS, BASE - COINS)
  assert.equal(RAYS * COINS, VE_FACES)
  assert.equal(TETRA * COINS, MERKABA_VERTICES)
  assert.equal(MERKABA_VERTICES, HANDLE_HEXBITS)
  assert.deepEqual(qpuRosetteOf(1).rays, [0, 1, 2, 3, 4, 5, 6])
  assert.deepEqual(qpuRosetteOf(-1).rays, [0, 6, 5, 4, 3, 2, 1])
  assert.equal(m.clockwise.fuse, 0)
  assert.equal(m.counterclockwise.fuse, 0)
  assert.equal(chip.balance.cpu, 'CPU')
  assert.equal(chip.balance.gpu, 'GPU')
  assert.equal(qpuMachineOf().chip.claimed, true)
  const ex = qpuExperienceOf()
  assert.equal(ex.involution, true)
  assert.equal(qpuExperienceHolds(), true)
  assert.equal(ex.inner.rotor, 'CPU')
  assert.equal(ex.outer.rotor, 'GPU')
  assert.equal(qpuTetrahedraOf().inner.length, TETRA)
  assert.equal(m.combinations.holds, true)
  assert.equal(m.combinations.inner.count, m.doors * m.rays)
  assert.equal(m.combinations.outer.count, m.rays * m.doors)
})
