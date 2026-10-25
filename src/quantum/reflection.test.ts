import test from 'node:test'
import assert from 'node:assert/strict'
import { handle } from './mcp.js'
import { EXAMPLES } from './examples.js'
import { LEADS } from './leads.js'
import { matchOf, reflectionsOf } from './match.js'
import { factsOf, verifyRequestsOf, VERIFIERS } from './verifiers.js'
import { blockOf, foldOf, uuidOf, sealOf, verifyOf } from './blocks.js'
import { TREE_FACTS } from './verifiers.js'
import { KEY, cssOf, cmykOfUuid, accentOfUuid, hueOf, HARMONICS } from './theme.js'

const match = (statement: string) => matchOf(statement, handle, EXAMPLES, LEADS)

test('in doubt, the reflection factors the integers through the Shor tool and reads their angles against the bounds', () => {
  const m = match('what hides in 15')
  const f = m.reflection.factors.find((x) => x.n === 15)!
  assert.equal(f.factors, '3 × 5')
  assert.ok(m.reflection.angles.some((a) => a.x === 15 && a.property === 'N' && a.d === 21 && a.sigma === 6))
  assert.ok(m.reflection.leads.some((l) => l.id === 'factors-15' && l.status === 'open'))
})

test('beyond the bound the reflection says so instead of factoring classically', () => {
  const m = match('what hides in 2048')
  const f = m.reflection.factors.find((x) => x.n === 2048)!
  assert.equal(f.factors, undefined)
  assert.ok(f.by.includes('bound'))
})

test('the mirror forms of a statement find a served tool the digital tokens missed', () => {
  const qs = reflectionsOf('the hydrogen energy')
  assert.ok(qs.some((q) => q.includes('chemistry')))
  const m = match('energy')
  assert.equal(m.verdict, 'served')
  assert.equal(m.tool, 'chemistry-simulation')
})

test('every matched lead yields verification requests across every adaptor that can see its facts', () => {
  const m = match('Quantum Echoes preprint abstract')
  assert.ok(m.verify.length > 0)
  const verifiers = new Set(m.verify.map((v) => v.verifier))
  assert.ok(verifiers.has('arxiv') || verifiers.has('source-page'), [...verifiers].join(','))
  for (const v of m.verify) { assert.equal(v.method, 'GET'); assert.ok(v.url.startsWith('https://')); assert.ok(v.check.length > 0) }
})

test('the verifiers registry covers every fact kind and only free sources', () => {
  const kinds = new Set(VERIFIERS.flatMap((v) => v.verifies))
  for (const k of ['integer', 'factors', 'repository', 'page', 'preprint', 'doi', 'constant']) assert.ok(kinds.has(k as never), k)
  assert.ok(VERIFIERS.every((v) => v.free))
  const reqs = verifyRequestsOf({ kind: 'doi', value: '10.5281/zenodo.23156998' })
  assert.deepEqual(reqs.map((r) => r.verifier).sort(), ['datacite', 'doi-org', 'zenodo'])
  const cern = verifyRequestsOf({ kind: 'doi', value: '10.7483/OPENDATA.CMS.53FG.V2S9' })
  assert.deepEqual(cern.map((r) => r.verifier).sort(), ['cern-opendata', 'datacite', 'doi-org'])
  const repo = LEADS.find((l) => l.id.startsWith('repo-'))
  if (repo) assert.ok(factsOf(repo).some((f) => f.kind === 'repository'))
})

test('every tool result carries an Open Graph block and a shadcn registry item with the same HTML', () => {
  for (const e of EXAMPLES) {
    if (e.tool === 'audit') continue
    const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: e.tool, arguments: e.arguments } })
    assert.ok('result' in r, e.id)
    const meta = (r.result as { _meta: { widget: string; openGraph: Record<string, string>; block: { $schema: string; type: string; files: { content: string }[]; meta: { id: string } } } })._meta
    assert.equal(meta.openGraph['og:site_name'], '@uuidna/qpu')
    assert.ok(meta.openGraph['og:url'].startsWith(`qpu://tools/${e.tool}`))
    assert.equal(meta.block.$schema, 'https://ui.shadcn.com/schema/registry-item.json')
    assert.equal(meta.block.type, 'registry:block')
    assert.equal(meta.block.files[0]!.content, meta.widget)
  }
  assert.equal(foldOf('qpu'), foldOf('qpu'))
  assert.match(foldOf('qpu'), /^[0-9a-f]{16}$/)
  assert.notEqual(blockOf('a', {}, 1, '', '').id, blockOf('b', {}, 1, '', '').id)
})

test('blocks and receipts are named by content-addressed RFC 9562 v8 UUIDs, and DOIs are verified by a trinity', () => {
  const u = uuidOf('qpu')
  assert.match(u, /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
  assert.equal(u, uuidOf('qpu'))
  assert.notEqual(u, uuidOf('qpu '))
  const doi = TREE_FACTS.find((f) => f.kind === 'doi')!
  assert.deepEqual(verifyRequestsOf(doi).map((r) => r.verifier).sort(), ['datacite', 'doi-org', 'zenodo'])
})

test('the stylesheet derives from the key 432 and each block takes its accent from the middle of its UUID as CMYK', () => {
  assert.equal(KEY, 432)
  assert.equal(hueOf(KEY), 72)
  assert.deepEqual(HARMONICS.map(hueOf), [72, 216, 108, 54, 27])
  const css = cssOf()
  assert.ok(css.includes('--a432-hue: 72;') && css.includes('--a432-1: hsl(72 '))
  const u = uuidOf('qpu')
  const c = cmykOfUuid(u)
  for (const v of Object.values(c)) assert.ok(v >= 0 && v <= 1)
  assert.match(accentOfUuid(u), /^rgb\(\d+ \d+ \d+\)$/)
  const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'processor', arguments: { name: 'Willow' } } })
  const meta = (r as { result: { _meta: { widget: string; theme: { key: number; accent: string }; block: { meta: { id: string } } } } }).result._meta
  assert.equal(meta.theme.key, 432)
  assert.ok(meta.widget.startsWith(`<div data-block="${meta.block.meta.id}"`))
  assert.ok(meta.widget.includes(meta.theme.accent))
})

test('a statement the surface barely covers is unknown, not served', () => {
  const m = match('factor all uuid versions in one uuid with hexbit cross uuid clusters for infinite quantum capacity')
  assert.equal(m.verdict, 'unknown')
  assert.equal(m.lead.status, 'blocked')
})

test('the licence travels with everything: initialize instructions, every result, every widget, every block', () => {
  const init = handle({ jsonrpc: '2.0', id: 0, method: 'initialize' }) as { result: { serverInfo: { license: string; author: string }; instructions: string } }
  assert.equal(init.result.serverInfo.license, 'CC-BY-NC-ND-4.0')
  assert.equal(init.result.serverInfo.author, 'Tsvetan Rouschev')
  assert.ok(init.result.instructions.includes('commercial use'))
  for (const e of EXAMPLES) {
    const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: e.tool, arguments: e.arguments } }) as { result: { _meta: { license: { spdx: string }; widget: string; block: { license: string; author: string }; openGraph: { license: string } } } }
    assert.equal(r.result._meta.license.spdx, 'CC-BY-NC-ND-4.0', e.id)
    assert.ok(r.result._meta.widget.includes('data-license="CC-BY-NC-ND-4.0"'), e.id)
    assert.equal(r.result._meta.block.license, 'CC-BY-NC-ND-4.0')
    assert.ok(r.result._meta.block.author.includes('Rouschev'))
    assert.ok(r.result._meta.openGraph.license.startsWith('CC-BY-NC-ND-4.0'))
  }
})

test('a UUID verifies cheaply: the seal from its own nibbles, the content by one fold, the neighbours by their links', () => {
  const u = uuidOf('qpu')
  assert.equal(sealOf(u).valid, true)
  const tampered = u.slice(0, -1) + (u.endsWith('a') ? 'b' : 'a')
  assert.equal(sealOf(tampered).valid, false)
  assert.equal(sealOf('not-a-uuid').shape, false)
  const p = { id: uuidOf('first') }
  const self = { prev: p.id }
  const next = { id: uuidOf('third'), prev: u }
  const v = verifyOf(u, 'qpu', p, next, self)
  assert.equal(v.valid, true); assert.equal(v.decided, 4)
  const broken = verifyOf(u, 'qpu', p, { id: next.id, prev: 'elsewhere' }, self)
  assert.equal(broken.valid, false)
  assert.equal(verifyOf(u).decided, 1)
})
