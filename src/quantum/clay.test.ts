import test from 'node:test'
import assert from 'node:assert/strict'
import { recomputeClay, evaluate, mintOf, chooseOf, choose, powMod, periodOf, n, vertices, faces, bits, plane, amplitudes } from './clay-register.ts'
import { CLAY_RELATIONS } from './clay-statements.ts'
import { handle } from './mcp.ts'

test('the lattice constants recompute as the Lean definitions state them', () => {
  assert.equal(n, 3); assert.equal(vertices, 8); assert.equal(faces, 14); assert.equal(bits, 32); assert.equal(plane, 28); assert.equal(amplitudes, 2 ** 32)
  assert.equal(mintOf(10), 1024); assert.equal(chooseOf(32, 14), 471435600); assert.equal(choose(32, 14), 471435600)
  assert.equal(powMod(7, 4, 15), 1); assert.equal(periodOf(7, 15), 4)
})

test('every Clay relation the kernel accepted by rfl holds in exact integer arithmetic, within 33 bits', () => {
  const r = recomputeClay()
  assert.equal(r.total, CLAY_RELATIONS.length)
  assert.equal(r.holding, r.total)
  assert.equal(r.maxBits, 33)
  assert.deepEqual(r.relations.filter((x) => !x.holds), [])
})

test('the reader of Lean arithmetic follows its precedence: application, then ^, then * / %, then + −, naturals truncate', () => {
  assert.equal(evaluate('mintOf n + coins * rays'), 8 + 2 * 7)
  assert.equal(evaluate('2 ^ 3 * 2'), 16)
  assert.equal(evaluate('coins - rays'), 0)
  assert.equal(evaluate('chooseOf vertices coins'), 28)
  assert.throws(() => evaluate('unknownName 3'))
})

test('the clay tool serves the register over MCP and one relation by name', () => {
  const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'clay', arguments: { name: 'relation_4294967296' } } }) as { result: { structuredContent: { relations: { sides: { value: number }[]; bits: number }[] } } }
  assert.equal(r.result.structuredContent.relations[0]!.bits, 33)
  assert.ok(r.result.structuredContent.relations[0]!.sides.every((s) => s.value === 4294967296))
  const bad = handle({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'clay', arguments: { name: 'relation_0' } } })
  assert.ok('error' in bad)
})
