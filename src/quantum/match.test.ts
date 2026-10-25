import test from 'node:test'
import assert from 'node:assert/strict'
import { handle } from './mcp.js'
import { EXAMPLES } from './examples.js'
import { LEADS } from './leads.js'
import { matchOf, tokens } from './match.js'

const match = (statement: string) => matchOf(statement, handle, EXAMPLES, LEADS)

test('a statement the surface serves is matched, called, and returned with its lead', () => {
  const m = match('How many qubits does Willow have?')
  assert.equal(m.verdict, 'served')
  assert.equal(m.tool, 'processor')
  assert.equal((m.result as { qubits: number }).qubits, 105)
  assert.equal(m.lead.status, 'served')
})

test('a statement that exceeds a schema bound is proved impossible by the schema', () => {
  const m = match('Factor RSA-2048 with Shor')
  assert.equal(m.verdict, 'impossible')
  assert.ok(m.evidence.some((e) => e.includes('algorithm.N') && e.includes('21')), m.evidence.join('; '))
  assert.equal(m.lead.status, 'blocked')
})

test('a statement about an out-of-scope lead is impossible with the lead\'s own reason', () => {
  const m = match('list the careers jobs page')
  assert.equal(m.verdict, 'impossible')
  assert.ok(m.evidence[0]!.includes('out_of_scope'))
})

test('a statement nothing serves becomes a new lead to develop', () => {
  const m = match('teleport a cat to the moon')
  assert.equal(m.verdict, 'unknown')
  assert.equal(m.lead.status, 'blocked')
  assert.ok(m.lead.id.length > 0)
})

test('the match tool is served over MCP and agrees with the direct call', () => {
  const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'match', arguments: { statement: 'the Sycamore couplers' } } })
  assert.ok('result' in r)
  const m = (r.result as { structuredContent: { verdict: string; tool?: string } }).structuredContent
  assert.equal(m.verdict, 'served')
  assert.equal(m.tool, 'processor')
})

test('tokens drop stop words and keep numbers', () => {
  assert.deepEqual(tokens('Show me the 105 qubits of Willow'), ['105', 'qubits', 'willow'])
})
