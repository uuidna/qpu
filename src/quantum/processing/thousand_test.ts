// The thousand-bit table is written by Lean (Qpu.General.Thousand) and served over MCP.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { call } from './mcp.ts'
import { THOUSAND, THOUSAND_SHARED } from './thousand-index.ts'

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
