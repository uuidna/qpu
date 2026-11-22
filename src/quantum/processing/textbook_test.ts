// Every textbook axiom has a QPU theorem linked to it: each example of the textbook names the kernel-accepted theorem it rests on, each
// textbook theorem names only examples that exist, and the same answer is served over MCP (textbook { axioms }) and checked by the audit.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { call } from './mcp.ts'
import { EXAMPLES } from './examples.ts'
import { TEXTBOOK_THEOREMS } from './textbook-theorems.ts'
import { THEOREMS } from './theorems-index.ts'
import { linkAxioms } from './audit.ts'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
const TEXTBOOK_LEAN_PATH = 'lean/Qpu/General/Textbook.lean'

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every textbook axiom has a kernel-accepted QPU theorem linked to it. */
test('every textbook axiom has a kernel-accepted QPU theorem linked to it', () => {
  const a = linkAxioms(EXAMPLES, TEXTBOOK_THEOREMS, new Set(THEOREMS.map((t) => t.key)))
  assert.deepEqual(a.axioms, [], `examples with no theorem: ${a.axioms.join(', ')}`)
  assert.deepEqual(a.broken, [], 'every linked theorem is accepted by the kernel')
  assert.deepEqual(a.dangling, [], 'every example a theorem names exists')
  assert.equal(a.linked, EXAMPLES.length)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every textbook theorem is in the kernel, and names an example or is cited by the tool that applies it. */
test('every textbook theorem is in the kernel, and names an example or is cited by the tool that applies it', () => {
  const kernel = new Set(THEOREMS.map((t) => t.key))
  const missing = TEXTBOOK_THEOREMS.filter((t) => !kernel.has(t.key)).map((t) => t.key)
  assert.deepEqual(missing, [], `textbook theorems the kernel has not accepted: ${missing.join(', ')}`)
  // a theorem a tool applies to every item it reads (a patent, a certificate) is cited by that tool's source rather than by one example
  const dir = join(process.cwd(), 'src', 'quantum', 'processing', 'toolboxes')
  const sources = readdirSync(dir).filter((f) => f.endsWith('.ts')).map((f) => readFileSync(join(dir, f), 'utf8')).join('\n')
  const unlinked = TEXTBOOK_THEOREMS.filter((t) => t.examples.length === 0 && !sources.includes(`'${t.key}'`)).map((t) => t.key)
  assert.deepEqual(unlinked, [], `textbook theorems neither linked to an example nor cited by a tool: ${unlinked.join(', ')}`)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: textbook seo is a website content seed, and the coins are the formula UUIDs. */
test('textbook seo is a website content seed, and the coins are the formula UUIDs', () => {
  const s = (call('textbook', { seo: true }) as { result?: { structuredContent: { public: boolean; component: string; coverage: { full: boolean; covered: number; of: number }; coins: { by: string; sealed: boolean; count: number; of: number; coins: string[] }; pages: { product: string; relation: string; formula: string; proof: string; coin: string; component: string; seed: { hero: { type: string }; layout: { blockType: string; contentFields: { layout: string; columnOne: { root: { children: { children: { text: string }[] }[] } } } }[]; meta: { title: string } }; create: { data: { hero: { type: string }; layout: { blockType: string }[] } } }[] } } }).result?.structuredContent
  if (!s) throw new Error('no seo answer')
  assert.equal(s.public, true)
  assert.equal(s.component, 'content')
  assert.equal(s.coverage.full, true)
  assert.equal(s.coverage.covered, s.coverage.of)
  assert.equal(s.coins.by, 'uuid')
  assert.equal(s.coins.sealed, true)
  assert.ok(s.coins.count < s.coins.of)
  const blocks = new Set(['callout', 'cta', 'cardGrid', 'caseStudyCards', 'caseStudiesHighlight', 'caseStudyParallax', 'codeFeature', 'content', 'contentGrid', 'comparisonTable', 'form', 'hoverCards', 'hoverHighlights', 'linkGrid', 'logoGrid', 'mediaBlock', 'mediaContent', 'mediaContentAccordion', 'pricing', 'reusableContentBlock', 'slider', 'statement', 'steps', 'stickyHighlights', 'exampleTabs'])
  for (const p of s.pages) {
    assert.equal(p.component, 'content')
    assert.ok(blocks.has(p.seed.layout[0]!.blockType))
    assert.equal(p.seed.hero.type, 'default')
    assert.equal(p.seed.layout[0]!.contentFields.layout, 'oneColumn')
    assert.equal(p.create.data.layout[0]!.blockType, 'content')
    assert.equal('id' in p.create.data, false)
    assert.equal('breadcrumbs' in p.create.data, false)
    const text = p.seed.layout[0]!.contentFields.columnOne.root.children.map((c) => c.children[0]!.text).join('\n')
    assert.ok(text.includes(p.formula), p.relation)
    assert.ok(text.includes(':='), p.relation)
    assert.equal(p.coin, s.coins.coins.find((id) => id === p.coin))
  }
  const pascal = s.pages.find((p) => p.relation === 'relation_28' && p.product === 'textbook_pascal_rule')
  assert.ok(pascal && pascal.proof.includes('textbook_pascal_rule'))
  assert.ok(s.pages.filter((p) => p.formula === pascal!.formula).every((p) => p.coin === pascal!.coin))
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the same answer is served over MCP: textbook { axioms }. */
test('the same answer is served over MCP: textbook { axioms }', () => {
  const r = call('textbook', { axioms: true }) as { result?: { structuredContent: { complete: boolean; examples: number; linked: number } } }
  assert.equal(r.result?.structuredContent.complete, true)
  assert.equal(r.result?.structuredContent.linked, r.result?.structuredContent.examples)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: combinatorics microdata is what its inline docs state. */
test('combinatorics microdata is what its inline docs state', () => {
  const src = readFileSync(join(process.cwd(), 'src/quantum/processing/toolboxes/crypto.ts'), 'utf8')
  const start = src.indexOf('/** schema.org microdata')
  const doc = src.slice(start, src.indexOf('*/', start))
  assert.match(doc, /list is the positions/)
  assert.match(doc, /count is the product/)
  assert.match(doc, /neither stores a composition/)
  const says = TEXTBOOK_THEOREMS.find((t) => t.key === 'textbook_queneau_compositions')!.says
  assert.match(says, /k choices on each of n strips are k\^n compositions/)
  const ev = (call('textbook', { evaluate: { theorem: 'textbook_queneau_compositions' } }) as { result?: { structuredContent: { holds: boolean; conclusion: { parts: { text: string; left: string; right: string }[] } } } }).result?.structuredContent
  if (!ev) throw new Error('no evaluation')
  assert.equal(ev.holds, true)
  const part = ev.conclusion.parts.find((p) => p.text.replace(/\s/g, '').startsWith('10^14='))
  if (!part) throw new Error('the doc formula is not in the evaluation')
  assert.equal(part.left, part.right)
  const [choices, positions] = part.text.split('=')[0]!.split('^').map((s) => Number(s.trim()))
  const s = (call('fold', { combinatorics: true }) as { result?: { structuredContent: { count: string; formula: string; best: string; microdata: { numberOfItems: number; description: string; itemListElement: { item: { value: number } }[]; additionalProperty: { name: string; value: string }[] } } } }).result?.structuredContent
  if (!s) throw new Error('no combinatorics')
  assert.equal(s.best, 'queneau')
  assert.equal(s.formula, '10 ^ 14')
  assert.equal(s.count, part.right)
  assert.equal(s.microdata.numberOfItems, positions)
  assert.equal(s.microdata.itemListElement.length, positions)
  assert.ok(s.microdata.itemListElement.every((i) => i.item.value === choices))
  assert.notEqual(String(s.microdata.numberOfItems), s.count)
  assert.equal(s.microdata.additionalProperty.find((p) => p.name === 'count')?.value, part.right)
  assert.equal(s.microdata.description, `${s.formula} = ${s.count}`)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every theorem sentence is a Lean doc comment that opens and closes once, whatever the prose holds. */
test('every theorem sentence is a Lean doc comment that opens and closes once, whatever the prose holds', async () => {
  const { escapeLeanDoc } = await import('./textbook-theorems.ts')
  const docs = readFileSync(join(process.cwd(), TEXTBOOK_LEAN_PATH), 'utf8').split('\n').filter((l) => l.startsWith('/-- '))
  assert.ok(docs.length > 0)
  for (const d of docs) { const body = d.slice(4, d.lastIndexOf(' -/')); assert.ok(!body.includes('-/') && !body.includes('/-'), d.slice(0, 80)) }
  assert.equal(escapeLeanDoc('a -/ b /- c'), 'a - / b / - c')
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the Lean file is the author of the textbook, and the index is what Lean read from it. */
test('the Lean file is the author of the textbook, and the index is what Lean read from it', () => {
  const source = readFileSync(join(process.cwd(), TEXTBOOK_LEAN_PATH), 'utf8')
  const kernel = new Set(THEOREMS.map((t) => t.key))
  assert.ok(TEXTBOOK_THEOREMS.length > 0)
  assert.equal(new Set(TEXTBOOK_THEOREMS.map((t) => t.key)).size, TEXTBOOK_THEOREMS.length, 'every textbook theorem is written once')
  // each row is a theorem the kernel accepted, and its text stands in the source as the row states it
  assert.deepEqual(TEXTBOOK_THEOREMS.filter((t) => !kernel.has(t.key) || !source.includes(t.lean)).map((t) => t.key), [])
  assert.deepEqual(TEXTBOOK_THEOREMS.filter((t) => t.example && !t.example.split('\n').every((line) => source.includes(line))).map((t) => t.key), [])
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the numbers Lean states are the numbers the data hold. */
test('the numbers Lean states are the numbers the data hold', async () => {
  const { MEASURED_THEOREMS } = await import('./textbook-measured.ts')
  const written = new Map(TEXTBOOK_THEOREMS.map((t) => [t.key, t]))
  assert.ok(MEASURED_THEOREMS.length > 0)
  const differs = MEASURED_THEOREMS.filter((m) => { const t = written.get(m.key); return !t || (m.lean !== undefined && (t.lean !== m.lean || t.says !== m.says)) || (m.example !== undefined && !(t.example ?? '').split('\n').includes(m.example)) }).map((m) => m.key)
  assert.deepEqual(differs, [], `the data moved away from what Lean states; change the theorem in ${TEXTBOOK_LEAN_PATH}: ${differs.join(', ')}`)
})
