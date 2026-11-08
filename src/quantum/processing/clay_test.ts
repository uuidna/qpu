import test from 'node:test'
import assert from 'node:assert/strict'
import { recomputeClay, reflectionOfRegister, evaluate, mint, choose, powMod, multiplicativePeriod, n, vertices, faces, bits, plane, amplitudes } from './clay-register.ts'
import { compositions } from '../uuid/index.ts'
import { CLAY_RELATIONS } from './clay-statements.ts'
import { handle, call } from './mcp.ts'

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the lattice constants recompute as the Lean definitions state them. */
test('the lattice constants recompute as the Lean definitions state them', () => {
  assert.equal(n, 3); assert.equal(vertices, 8); assert.equal(faces, 14); assert.equal(bits, 32); assert.equal(plane, 28); assert.equal(amplitudes, 2 ** 32)
  assert.equal(mint(10), 1024); assert.equal(choose(32, 14), 471435600); assert.equal(choose(32, 14), 471435600)
  assert.equal(powMod(7, 4, 15), 1); assert.equal(multiplicativePeriod(7, 15), 4)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every Clay relation the kernel accepted by rfl holds in exact integer arithmetic, within 33 bits. */
test('every Clay relation the kernel accepted by rfl holds in exact integer arithmetic, within 33 bits', () => {
  const r = recomputeClay()
  assert.equal(r.total, CLAY_RELATIONS.length)
  assert.equal(r.holding, r.total)
  assert.equal(r.maxBits, 33)
  assert.deepEqual(r.relations.filter((x) => !x.holds), [])
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the reader of Lean arithmetic follows its precedence: application, then ^, then * / %, then + −, naturals truncate. */
test('the reader of Lean arithmetic follows its precedence: application, then ^, then * / %, then + −, naturals truncate', () => {
  assert.equal(evaluate('mint n + coins * rays'), 8 + 2 * 7)
  assert.equal(evaluate('2 ^ 3 * 2'), 16)
  assert.equal(evaluate('coins - rays'), 0)
  assert.equal(evaluate('choose vertices coins'), 28)
  assert.throws(() => evaluate('unknownName 3'))
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the clay tool serves the register over MCP and one relation by name. */
test('the clay tool serves the register over MCP and one relation by name', () => {
  const r = call('clay', { name: 'relation_4294967296' }) as { result: { structuredContent: { relations: { sides: { value: number }[]; bits: number }[] } } }
  assert.equal(r.result.structuredContent.relations[0]!.bits, 33)
  assert.ok(r.result.structuredContent.relations[0]!.sides.every((s) => s.value === 4294967296))
  const bad = handle({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'clay', arguments: { name: 'relation_0' } } })
  assert.ok('error' in bad)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every clay case surfaces all its kernel-accepted proofs and docs over MCP under a strict textbook-sourced name (textbook = product, case = variant). */
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
  assert.equal(rels.find((x) => x.name === 'relation_28')!.product, 'textbook_pascal_rule')
  assert.equal(rels.find((x) => x.name === 'relation_28')!.variant, 'pascal-rule-28')
  assert.ok(rels.every((rel) => rel.variants.length === rel.theorems.length && rel.variants.every((v, i) => v.product === rel.theorems[i]!.theorem && v.variant === rel.theorems[i]!.case)))
  assert.ok(rels.find((x) => x.name === 'relation_28')!.theorems.some((t) => t.theorem === 'textbook_pascal_rule' && t.proof.includes('theorem textbook_pascal_rule')))
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the qaoa and chimera products are solved, and the docs define only the framework. */
test('the qaoa and chimera products are solved, and the docs define only the framework', () => {
  const read = reflectionOfRegister(recomputeClay().relations)
  assert.equal(read.open.length, 0)
  assert.equal(read.readings.filter((x) => x.solved).length, CLAY_RELATIONS.length)
  const sequences = (value: number) => read.readings.find((x) => x.value === value)!.sequences.map((s) => s.a)
  assert.ok(sequences(14).includes('A000108'))
  for (const value of [14, 96, 224, 392]) assert.ok(sequences(value).includes('A002473'), String(value))
  const s = (call('clay', { solve: true }) as { result: { structuredContent: { solved: number; open: unknown[]; docs: { id: string; collection: string; topic: string; slug: string }[]; categories: { slug: string }[]; variants: { product: string; variant: string; relation: string; doc: string }[]; framework: { doc: string } } } }).result.structuredContent
  assert.equal(s.solved, CLAY_RELATIONS.length)
  assert.equal(s.open.length, 0)
  assert.equal(s.docs.length, 1)
  assert.equal(s.docs[0]!.collection, 'docs')
  assert.equal(s.docs[0]!.topic, 'framework')
  assert.equal(s.docs[0]!.slug, 'qpu')
  assert.equal(s.framework.doc, s.docs[0]!.id)
  assert.equal(s.categories.length, 19)
  assert.equal(new Set(s.categories.map((c) => c.slug)).size, 19)
  assert.equal(s.variants.length, 76)
  assert.equal(new Set(s.variants.map((v) => `${v.product}/${v.variant}`)).size, 76)
  const pascal = s.variants.find((v) => v.relation === 'relation_28' && v.product === 'textbook_pascal_rule')
  assert.equal(pascal?.variant, 'pascal-rule-28')
  assert.ok(s.variants.every((v) => v.product.startsWith('textbook_') && v.doc === s.docs[0]!.id && v.variant.startsWith(v.product.replace(/^textbook_/, '').replace(/_/g, '-'))))
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the axioms compute the parameters, and the parameters compute the products and variants. */
test('the axioms compute the parameters, and the parameters compute the products and variants', () => {
  const s = (call('clay', { combinations: true }) as { result: { structuredContent: { phase: string; verified: boolean; crossVerified: boolean; depth: number; solved: number; problems: number; space: string; radices: number[]; hooks: { iso: string; validated: boolean; proved: boolean }; axioms: { name: string; formula: string; value: number; holds: boolean; proved: boolean; variants: number }[]; params: Record<string, number>; products: { product: string; variants: { variant: string; relation: string; formula: string; value: number; holds: boolean; crossVerified: boolean; depth: number; params: { name: string; value: number }[]; iso: { standard: string; formula: string; documented: boolean; theorem: string }; docs: { text: string }; via: string }[] }[]; rows: { problem: string; products: number; radices: number[]; combinations: string; solved: boolean; witness: { product: string; variant: string; relation: string }[] }[] } } }).result.structuredContent
  assert.equal(s.phase, 'combinations')
  assert.equal(s.verified, true)
  assert.ok(s.axioms.every((a) => a.holds && s.params[a.name] === a.value))
  const n = s.axioms.find((a) => a.name === 'n')
  const plane = s.axioms.find((a) => a.name === 'plane')
  assert.equal(n?.formula, '["quantum", "processing", "unit"].length')
  assert.equal(n?.value, 3)
  assert.equal(plane?.value, 28)
  assert.equal(s.params.coins, 2)
  assert.equal(s.params.rays, 7)
  const pascal = s.products.find((p) => p.product === 'textbook_pascal_rule')
  const variant = pascal?.variants.find((v) => v.relation === 'relation_28')
  assert.equal(variant?.variant, 'pascal-rule-28')
  assert.equal(variant?.value, s.params.plane)
  assert.equal(variant?.holds, true)
  assert.equal(variant?.iso.standard, 'ISO 9001')
  assert.equal(variant?.iso.documented, true)
  assert.equal(variant?.iso.theorem, 'textbook_pascal_rule')
  assert.equal(variant?.docs.text, variant?.formula)
  assert.equal(variant?.via, 'hooks')
  assert.equal(variant?.crossVerified, true)
  assert.ok((variant?.depth ?? 0) > 1)
  assert.equal(s.crossVerified, true)
  assert.ok(s.depth > 1)
  assert.ok(s.products.every((p) => p.variants.every((v) => v.crossVerified && v.docs.text === v.formula && v.iso.formula === v.formula)))
  assert.deepEqual(variant?.params.map((p) => p.name), ['coins', 'plane', 'vertices'])
  assert.equal(s.hooks.iso, 'ISO 9001')
  assert.equal(s.hooks.validated, true)
  assert.equal(s.hooks.proved, true)
  assert.ok(s.axioms.every((a) => a.proved))
  assert.equal(s.products.reduce((n, p) => n + p.variants.length, 0), 76)
  assert.equal(s.solved, s.problems)
  assert.equal(s.problems, 19)
  assert.equal(s.space, compositions(s.radices).toString())
  for (const row of s.rows) {
    assert.equal(row.solved, true)
    assert.equal(row.witness.length, row.products)
    assert.equal(row.combinations, compositions(row.radices).toString())
  }
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the clay catalog: each textbook a product, each case a variant, cross-textbook theorems the variations, priced in coins per superposition. */
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
