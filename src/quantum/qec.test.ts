import test from 'node:test'
import assert from 'node:assert/strict'
import { breakEvenOf, codePoint, repetitionCycle, textbookLogicalError, unencodedCycle } from './qec.js'
import { countResources } from './counting.js'

const close = (a: number, b: number, tolerance = 1e-12) => assert.ok(Math.abs(a - b) < tolerance, `${a} is not within ${tolerance} of ${b}`)

test('the bit-flip code under bit-flip noise has the textbook logical error 3p² − 2p³, read from the density matrix, at every p tried', () => {
  for (const p of [0, 0.001, 0.01, 0.1, 0.25, 0.5, 0.75, 1]) {
    const point = codePoint('bit_flip', 'bit_flip', p, '0')
    close(point.physicalError, p)
    close(point.logicalError, 3 * p * p - 2 * p * p * p)
    close(point.logicalError, textbookLogicalError('bit_flip', 'bit_flip', '0', p)!)
  }
})

test('the phase-flip code under phase-flip noise on |0⟩ and |1⟩ gives the same 3p² − 2p³, and the bit-flip code does not correct phase flips on |+⟩', () => {
  close(codePoint('phase_flip', 'phase_flip', 0.1, '0').logicalError, 0.028)
  close(codePoint('phase_flip', 'phase_flip', 0.1, '1').logicalError, 0.028)
  const unprotected = codePoint('bit_flip', 'phase_flip', 0.1, '+')
  assert.ok(unprotected.logicalError > unprotected.physicalError, 'three exposed qubits accumulate more phase error than one')
})

test('a logical |+⟩ in the bit-flip code shows no error from bit flips, since the logical X they amount to leaves |+⟩ unchanged, and the textbook figure is not claimed for it', () => {
  close(codePoint('bit_flip', 'bit_flip', 0.2, '+').logicalError, 0)
  assert.equal(textbookLogicalError('bit_flip', 'bit_flip', '+', 0.2), null)
  assert.equal(textbookLogicalError('bit_flip', 'depolarize', '0', 0.2), null)
})

test('under depolarizing noise the bit-flip code on |0⟩ sees each qubit flipped with probability 2p/3, so its logical error is 3q² − 2q³ with q = 2p/3', () => {
  const p = 0.15
  const q = (2 * p) / 3
  const point = codePoint('bit_flip', 'depolarize', p, '0')
  close(point.physicalError, q)
  close(point.logicalError, 3 * q * q - 2 * q * q * q)
})

test('the break-even probability bisected from the simulation is 1/2 for the bit-flip code, where 3p² − 2p³ = p', () => {
  const sweep = [0.1, 0.3, 0.45, 0.55, 0.7].map((p) => codePoint('bit_flip', 'bit_flip', p, '0'))
  const breakEven = breakEvenOf('bit_flip', 'bit_flip', '0', sweep)
  assert.ok(breakEven !== null)
  close(breakEven, 0.5, 1e-9)
  assert.equal(breakEvenOf('bit_flip', 'bit_flip', '0', [0.1, 0.2].map((p) => codePoint('bit_flip', 'bit_flip', p, '0'))), null, 'no crossing in a sweep that stays below break-even')
})

test('the cycle is five qubits with three channel operations and three Toffolis, and the unencoded qubit has one channel', () => {
  const count = countResources(repetitionCycle('bit_flip', { name: 'bit_flip', p: 0.1 }, '0'))
  assert.equal(count.qubits, 5)
  assert.equal(count.channels, 3)
  assert.equal(count.gates.find((g) => g.name === 'TOFFOLI')!.count, 3)
  assert.equal(count.tCount, 21)
  assert.equal(countResources(unencodedCycle({ name: 'bit_flip', p: 0.1 }, '0')).channels, 1)
})
