// The thousand-bit table is written by Lean (Qpu.General.Thousand) and served over MCP.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { call } from './mcp.ts'
import { THOUSAND, THOUSAND_SHARED, THOUSAND_WALK } from './thousand-index.ts'
import { THEOREM_KEYS } from './theorems-index.ts'
import { evaluate as clayEvaluate } from './clay-register.ts'

const BOUND = 2n ** 1000n

/** ISO/IEC/IEEE 29119-3 test case. Identifier: each family's last example is below the bound and reflects to what fills it. */
test("each family's last example is below the bound and reflects to what fills it", () => {
  assert.ok(THOUSAND.length > 0)
  for (const row of THOUSAND) {
    const count = BigInt(row.examples), value = BigInt(row.last.value)
    assert.equal(BigInt(row.last.size), count - 1n, row.name)
    assert.ok(value < BOUND, row.name)
    assert.equal(BigInt(row.last.reflection) + value, BOUND, row.name)
    assert.deepEqual(row.first.map((example) => example.size), ['0', '1', '2', '3'].slice(0, row.first.length), row.name)
  }
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a number several formulas reach names each formula once, and the table is served by family. */
test('a number several formulas reach names each formula once, and the table is served by family', () => {
  const formulas = new Set(THOUSAND.map((row) => row.name))
  assert.equal(THOUSAND_SHARED.every((entry) => entry.meaning.length >= 2 && new Set(entry.meaning.map((m) => m.name)).size === entry.meaning.length && entry.meaning.every((m) => formulas.has(m.name))), true)
  const fib = THOUSAND_SHARED.find((entry) => entry.number === '55')
  assert.deepEqual(fib?.meaning.filter((m) => m.name === 'fibFusion' || m.name === 'qftGates').map((m) => [m.name, m.size]), [['fibFusion', '10'], ['qftGates', '10']])
  const all = call('clay', { thousand: true }).result!.structuredContent
  assert.equal(all.formulas.length, THOUSAND.length)
  const qft = call('clay', { thousand: 'Qft' }).result!.structuredContent
  assert.deepEqual(qft.families, ['Qft'])
  assert.equal(call('clay', { thousand: 'Nope' }).result!.structuredContent.found, false)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the walk visits every qubit count below the bound, each cluster member is held by a kernel theorem, and the door's own arithmetic reaches the same superpositions. */
test("the walk visits every qubit count below the bound, each cluster member is held by a kernel theorem, and the door's own arithmetic reaches the same superpositions", () => {
  assert.equal(2n ** BigInt(THOUSAND_WALK.qubits), BOUND)
  assert.deepEqual(THOUSAND_WALK.formulas.map((f) => f.name), THOUSAND.map((row) => row.name))
  const reaches = (name: string, k: number) => ((BigInt(`0x${THOUSAND_WALK.formulas.find((f) => f.name === name)!.levels}`) >> BigInt(k)) & 1n) === 1n
  for (const f of THOUSAND_WALK.formulas) {
    assert.ok(f.binding !== null && THEOREM_KEYS.has(f.binding), `${f.name} is bound by a kernel theorem`)
    assert.equal(Array.from({ length: THOUSAND_WALK.qubits }, (_, k) => reaches(f.name, k)).filter(Boolean).length, f.reaches, f.name)
  }
  // a power of two at every count, a power of four at every even one, and never a multiple of three or of an odd constant
  assert.deepEqual(['mint', 'paulis', 'pegasus', 'thermal'].map((name) => THOUSAND_WALK.formulas.find((f) => f.name === name)!.reaches), [1000, 499, 0, 0])
  assert.deepEqual([0, 1, 2, 3, 998, 999].map((k) => reaches('paulis', k)), [false, false, true, false, true, false])
  // the door's exact integers, wherever its own port holds the formula: each small superposition is reached by the door exactly where Lean says
  let compared = 0
  for (const f of THOUSAND_WALK.formulas) {
    // every size the door's safe integers hold: a formula it does not port, or a value past them, ends the list
    const values: number[] = []
    for (let size = 0; size <= 2 ** 12 + 1; size++) { try { values.push(clayEvaluate(`${f.name} ${size}`)) } catch { break } }
    if (!values.some((v) => v >= 2 ** 10)) continue
    for (let k = 0; k <= 10; k++) { assert.equal(values.includes(2 ** k), reaches(f.name, k), `${f.name} at ${k} qubits`); compared += 1 }
  }
  assert.ok(compared >= 100, `${compared} superpositions compared`)
  const walk = call('clay', { walk: true }).result!.structuredContent
  assert.deepEqual([walk.walked, walk.discovered, walk.unclaimed, walk.qubits, walk.claimed, walk.held], [true, '100%', [], THOUSAND_WALK.qubits, THOUSAND_WALK.qubits, walk.members])
  assert.equal(walk.members, THOUSAND_WALK.formulas.reduce((n, f) => n + f.reaches, 0))
  assert.deepEqual([walk.register.discovered, walk.register.relations, walk.nist.qubits, walk.cern.qubits, walk.cern.claimedBy], [true, 38, 512, 32, ['relation_4294967296']])
  // one qubit count alone, and a count outside the walk refused
  const one = call('clay', { walk: { qubits: 3 } }).result!.structuredContent
  assert.deepEqual([one.qubits, one.value, one.bits, one.claimedBy, one.discovered], [3, '8', 4, ['relation_8'], true])
  assert.ok(one.cluster.some((m: { formula: string; theorem: string }) => m.formula === 'fibFusion' && m.theorem === 'fibFusion_eq_nat_fib'))
  assert.ok(call('clay', { walk: { qubits: THOUSAND_WALK.qubits } }).error)
})
