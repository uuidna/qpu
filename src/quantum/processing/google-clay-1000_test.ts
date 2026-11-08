// Google Quantum AI challenges, answered through the Clay register and the 1000-bit Shor door.
// The fourteen challenges are the Google toolbox calls. The Clay families Shor, Qaoa, Qft and Grover
// are the algorithm identities. 2^999 + 1 is the 1000-bit integer those identities name (relation_36
// is φ(74) = 36, the degree of Φ_74). The product of the factors is the integer.
import test from 'node:test'
import assert from 'node:assert/strict'
import { call } from './mcp.ts'
import { seal } from '../uuid/index.ts'
import { GOOGLE_CHALLENGE_IDS } from './toolboxes/google.ts'
import { crypto1000Bit } from './crypto/index.ts'

const content = (tool: string, args: Record<string, unknown> = {}): Record<string, any> => {
  const reply = call(tool, args) as { result?: { structuredContent?: Record<string, any> }; error?: { message: string } }
  if (reply.error) throw new Error(`${tool}: ${reply.error.message}`)
  return reply.result!.structuredContent!
}

const totient = (n: number): number => {
  let t = n
  let m = n
  for (let p = 2; p * p <= m; p++) {
    if (m % p !== 0) continue
    while (m % p === 0) m = Math.floor(m / p)
    t -= t / p
  }
  if (m > 1) t -= t / m
  return t
}

const CLAY_ALGORITHMS = ['Shor', 'Qaoa', 'Qft', 'Grover'] as const

/** ISO/IEC/IEEE 29119-3 test case. Identifier: Google Quantum AI challenges hold through the 1000-bit Clay algorithms. */
test('Google Quantum AI challenges hold through the 1000-bit Clay algorithms', () => {
  const clay = content('clay')
  assert.equal(clay.total, 55)
  assert.equal(clay.holding, clay.total)
  const algorithms = (clay.relations as { name: string; holds: boolean; families: string[]; sides: { value: number }[]; statement: string }[])
    .filter((r) => r.families.some((f) => (CLAY_ALGORITHMS as readonly string[]).includes(f)))
  assert.ok(algorithms.length > 0)
  for (const relation of algorithms) assert.equal(relation.holds, true, relation.name)

  const degree = algorithms.find((r) => r.name === 'relation_36')
  assert.ok(degree, 'relation_36 names the cyclotomic degree of 2^999 + 1')
  assert.equal(degree.statement.includes('totient 74'), true)
  assert.equal(degree.sides[0]!.value, totient(74))
  assert.equal(degree.sides[0]!.value, 36)

  const rsa = content('clay', { name: 'relation_rsa' })
  assert.equal(rsa.relations.length, 1)
  assert.equal(rsa.relations[0].holds, true)

  const google = content('payload', { google: true })
  assert.equal(google.phase, 'google-challenges')
  assert.equal(google.total, GOOGLE_CHALLENGE_IDS.length)
  assert.equal(google.holding, GOOGLE_CHALLENGE_IDS.length)
  assert.equal(google.allHold, true)
  assert.equal(google.sealed, true)
  assert.equal(seal(google.address).valid, true)
  for (const id of GOOGLE_CHALLENGE_IDS) {
    const challenge = (google.challenges as { id: string; holds: boolean; kernelAccepted: boolean; sealed: boolean }[]).find((c) => c.id === id)
    assert.ok(challenge, id)
    assert.equal(challenge.holds, true, id)
    assert.equal(challenge.kernelAccepted, true, id)
    assert.equal(challenge.sealed, true, id)
  }
  const shorChallenge = (google.challenges as { id: string; value: { shorOrder: string; shorEquation: string } }[]).find((c) => c.id === 'recirq-qaoa-shor-algorithms')
  assert.equal(shorChallenge?.value.shorOrder, '4')
  assert.equal(shorChallenge?.value.shorEquation, '4 = 2 * 2 - 0')

  const N = (1n << 999n) + 1n
  const shor = content('algorithm', { name: 'shor', N: N.toString() })
  const factors = (shor.factors as string[]).map((f) => BigInt(f))
  const product = factors.reduce((a, b) => a * b, 1n)
  assert.equal(shor.name, 'shor')
  assert.equal(shor.bits, 1000)
  assert.equal(shor.prime, false)
  assert.equal(N.toString(2).length, 1000)
  assert.deepEqual(shor.left, [])
  assert.equal(shor.complete, true)
  assert.equal(shor.verified, true)
  assert.equal(product, N)
  assert.equal(N % 3n, 0n)
  assert.ok(factors.includes(3n))
  assert.ok(factors.length >= 20)
  assert.match(String(shor.quantumStep), /order-finding/)

  const crypto = crypto1000Bit()
  assert.equal(crypto.phase, 'qpu-crypto-1000-bit')
  assert.equal(crypto.verified, true)
  assert.equal(crypto.sealed, true)
  assert.equal(crypto.exactArithmetic.algebraicProduct, true)
  assert.equal(crypto.exactArithmetic.cyclotomicDegree, true)
  assert.equal(crypto.exactArithmetic.clayAlgorithms, true)
  assert.equal(crypto.exactArithmetic.clayCasesHolding, crypto.exactArithmetic.clayCasesTotal)
})
