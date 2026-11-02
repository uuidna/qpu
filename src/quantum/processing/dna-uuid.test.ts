// uuid dna uuidna: the base-four codec, its UUID stream and tool door, and a DNA secret cross-encrypted by the σ-trapdoor.
import test from 'node:test'
import assert from 'node:assert/strict'
import { dnaToHex, hexToDna, dnaStreamOf } from './unit/blocks.ts'
import { createImpossible, decodeImpossible, testPrimality } from './algorithms.ts'
import { handle } from './mcp.ts'

const fold = (args: Record<string, unknown>) => (handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'fold', arguments: args } }) as { result: { structuredContent: Record<string, unknown> } }).result.structuredContent

test('the DNA codec is reversible: bases ↔ hex one for one, two bases a nibble', () => {
  assert.equal(dnaToHex('ACGT'), '1b') // AC = 0·4+1 = 1, GT = 2·4+3 = 11 = b
  assert.equal(hexToDna('1b'), 'ACGT')
  const seq = 'ACGTACGTGGCCAATTACGTACGTGGCCAATTACGTACGTGGCCAATTACGTACGTGGCCAATT'
  assert.equal(hexToDna(dnaToHex(seq)), seq)
})

test('dnaStreamOf makes a sequence a navigable UUID stream, read back exactly', () => {
  const seq = 'ACGTACGTGGCCAATTACGTACGTGGCCAATTACGTACGTGGCCAATTACGTACGTGGCCAATT'
  const s = dnaStreamOf(seq)
  assert.equal(s.bases, 64)
  assert.equal(s.uuids.length, 1)
  assert.equal(s.basesPerUuid, 64)
  assert.equal(s.roundTrips, true)
  assert.equal(s.readBack, seq)
  assert.equal(s.stream.rows.length, 1)
  assert.match(s.uuids[0]!, /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
})

test('the fold door encodes and decodes DNA (uuid dna uuidna)', () => {
  const seq = 'ACGTGGCCAATTACGT'
  const e = fold({ dna: seq })
  assert.equal(e.phase, 'dna')
  assert.equal(e.roundTrips, true)
  assert.equal(fold({ dna: { hex: e.hex, bases: seq.length } }).bases, seq) // the count trims the padding
  assert.throws(() => dnaStreamOf('ACGN'), /N at 3 is not a base/)
  const d2 = fold({ dna: { uuid: (e.uuids as string[])[0] } })
  assert.equal((d2.bases as string).slice(0, seq.length), seq)
})

test('crypto↔DNA cross-encryption: a DNA-seeded impossible integer decodes by its witness, never without it', () => {
  const seq = 'ACGTACGTGGCCAATTACGTACGTGGCCAATTACGTACGTGGCCAATTACGTACGTGGCCAATT'
  const nextPrime = (x: bigint) => { let n = x | 1n; while (!testPrimality(n).prime) n += 2n; return n }
  const p = nextPrime(BigInt('0x' + dnaToHex(seq.slice(0, 32))) + (1n << 80n))
  const q = nextPrime(BigInt('0x' + dnaToHex(seq.slice(32))) + (1n << 120n))
  const made = createImpossible({ p, q })
  const dec = decodeImpossible(made.N, made.witness)
  assert.equal(dec.decoded, true)
  assert.equal(dec.verified, true)
  // the same integer with the wrong witness does not decode (the DNA secret is the trapdoor)
  assert.equal(decodeImpossible(made.N, made.witness + 2n).decoded, false)
})
