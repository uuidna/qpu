import test from 'node:test'
import assert from 'node:assert/strict'
import { recomputeClay, evaluate, mintOf, chooseOf, choose, powMod, multiplicativePeriod, n, vertices, faces, bits, plane, amplitudes } from './clay-register.ts'
import { CLAY_RELATIONS } from './clay-statements.ts'
import { handle } from './mcp.ts'

test('the lattice constants recompute as the Lean definitions state them', () => {
  assert.equal(n, 3); assert.equal(vertices, 8); assert.equal(faces, 14); assert.equal(bits, 32); assert.equal(plane, 28); assert.equal(amplitudes, 2 ** 32)
  assert.equal(mintOf(10), 1024); assert.equal(chooseOf(32, 14), 471435600); assert.equal(choose(32, 14), 471435600)
  assert.equal(powMod(7, 4, 15), 1); assert.equal(multiplicativePeriod(7, 15), 4)
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

test('every clay case surfaces all its kernel-accepted proofs and docs over MCP under a strict textbook-sourced name (textbook = product, case = variant)', () => {
  const rels = (handle({ jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'clay', arguments: {} } }) as { result: { structuredContent: { relations: { name: string; case: string; theorems: { theorem: string; case: string; proof: string; docs: string; kernelAccepted: boolean }[] }[] } } }).result.structuredContent.relations
  assert.equal(rels.length, CLAY_RELATIONS.length)
  for (const rel of rels) {
    assert.ok(rel.theorems.length >= 1, rel.name)
    for (const t of rel.theorems) {
      const b = t.theorem.replace(/^textbook_/, '').replace(/_/g, '-')
      assert.ok(t.kernelAccepted && t.proof.length > 0 && t.docs.length > 0 && t.theorem.startsWith('textbook_'), t.theorem)
      assert.ok(/^[a-z0-9-]+$/.test(t.case) && t.case.startsWith(b) && t.case !== rel.name && !/impossible|capped|bound/.test(t.case), t.case)
    }
  }
  assert.equal(rels.find((x) => x.name === 'relation_28')!.case, 'pascal-rule-28')
  assert.ok(rels.find((x) => x.name === 'relation_28')!.theorems.some((t) => t.theorem === 'textbook_pascal_rule' && t.proof.includes('theorem textbook_pascal_rule')))
})

test('the clay catalog: each textbook a product, each case a variant, cross-textbook theorems the variations, priced in coins per superposition', () => {
  const cat = (handle({ jsonrpc: '2.0', id: 5, method: 'tools/call', params: { name: 'clay', arguments: { catalog: true } } }) as { result: { structuredContent: { total: number; products: { product: string; title: string; taxonomy: string[]; variants: { case: string; relation: string; bits: number; superposition: number; coins: number; price: string }[]; variations: string[]; kernelAccepted: boolean; price: { coins: number; superposition: number; perSuperposition: number; address: string } }[] } } }).result.structuredContent
  assert.ok(cat.total >= 1 && cat.products.length === cat.total)
  for (const p of cat.products) {
    assert.ok(p.product.startsWith('textbook_') && p.kernelAccepted, p.product)
    assert.ok(p.variants.length >= 1, `${p.product} has no variant`)
    assert.ok(Array.isArray(p.taxonomy) && !p.variations.includes(p.product), p.product)
    assert.ok(p.price.coins > 0 && p.price.superposition > 0 && /^[0-9a-f-]{36}$/.test(p.price.address), `${p.product} price`)
    for (const v of p.variants) assert.ok(v.coins > 0 && v.superposition === 2 ** v.bits && /^[0-9a-f-]{36}$/.test(v.price), `${p.product}/${v.case}`)
  }
  // cross-textbook use shows up as variations somewhere, and the families are the taxonomy
  assert.ok(cat.products.some((p) => p.variations.length >= 1), 'no cross-textbook variations')
  assert.ok(cat.products.some((p) => p.taxonomy.length >= 1), 'no taxonomy')
  // pascal-rule is a product whose variants include the clay case for relation_28
  const pascal = cat.products.find((p) => p.product === 'textbook_pascal_rule')
  assert.ok(pascal && pascal.variants.some((v) => v.relation === 'relation_28' && v.case === 'pascal-rule-28'), 'pascal-rule product missing its variant')
})
