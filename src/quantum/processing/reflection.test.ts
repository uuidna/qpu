import test from 'node:test'
import assert from 'node:assert/strict'
import { handle, callOf } from './mcp.ts'
import { EXAMPLES } from './examples.ts'
import { LEADS } from './leads.ts'
import { matchStatement, reflectStatement } from './match.ts'
import { extractFacts, createVerifyRequests, VERIFIERS } from './verifiers.ts'
import { blockOf, foldOf, uuidOf, sealOf, verifyOf, channelOf, tailReadingsOf, reflectionOf, canonicalTextOf } from './unit/blocks.ts'
import { TREE_FACTS } from './verifiers.ts'
import { KEY, getCss, cmykOfUuid, accentOfUuid, hueOf, HARMONICS } from './unit/theme.ts'
import { translateOf, LOCALES } from './i18n.ts'

const match = (statement: string) => matchStatement(statement, handle, EXAMPLES, LEADS)

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
  const qs = reflectStatement('the hydrogen energy')
  assert.ok(qs.some((q) => q.includes('chemistry')))
  const bare = match('energy')
  assert.equal(bare.verdict, 'served'); assert.equal(bare.theorem, 'energy', 'the bare word names a kernel-accepted theorem: the textbook answers first')
  const m = match('the hydrogen energy')
  assert.equal(m.verdict, 'served')
  assert.equal(m.tool, 'chemistry-simulation', 'two words name no theorem; the mirror finds the chemistry tool')
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
  const reqs = createVerifyRequests({ kind: 'doi', value: '10.5281/zenodo.23156998' })
  assert.deepEqual(reqs.map((r) => r.verifier).sort(), ['datacite', 'doi-org', 'zenodo'])
  const cern = createVerifyRequests({ kind: 'doi', value: '10.7483/OPENDATA.CMS.53FG.V2S9' })
  assert.deepEqual(cern.map((r) => r.verifier).sort(), ['cern-opendata', 'datacite', 'doi-org'])
  const repo = LEADS.find((l) => l.id.startsWith('repo-'))
  if (repo) assert.ok(extractFacts(repo).some((f) => f.kind === 'repository'))
})

test('every tool result carries an Open Graph block and a shadcn registry item with the same HTML', () => {
  for (const e of EXAMPLES) {
    if (e.tool === 'audit') continue
    const r = callOf(e.tool, e.arguments)
    assert.ok('result' in r, e.id)
    const meta = (r.result as { _meta: { widget: string; openGraph: Record<string, string>; block: { $schema: string; type: string; files: { content: string }[]; meta: { id: string } } } })._meta
    assert.equal(meta.openGraph['og:site_name'], '@uuidna/qpu')
    assert.ok(meta.openGraph['og:url'].startsWith(`qpu://tools/${e.tool}`))
    assert.equal(meta.block.$schema, 'https://ui.shadcn.com/schema/registry-item.json')
    assert.equal(meta.block.type, 'registry:block')
    assert.equal(meta.block.files[0]!.content, meta.widget)
  }
  assert.notEqual(blockOf('a', {}, 1, '', '').id, blockOf('b', {}, 1, '', '').id)
})

test('small: blocks and receipts are named by content-addressed RFC 9562 v8 UUIDs over FNV-1a 64, and DOIs are verified by a trinity', () => {
  const fnv = (t: string) => [...Array(t.length).keys()].reduce((h, i) => ((h ^ BigInt(t.charCodeAt(i))) * 0x100000001b3n) % 2n ** 64n, 0xcbf29ce484222325n).toString(16).padStart(16, '0')
  for (const t of ['', 'qpu', 'Ⰰ漢字', 'x'.repeat(4096)]) assert.equal(foldOf(t), fnv(t))
  const u = uuidOf('qpu')
  assert.match(u, /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
  assert.equal(u, uuidOf('qpu'))
  assert.notEqual(u, uuidOf('qpu '))
  const doi = TREE_FACTS.find((f) => f.kind === 'doi')!
  assert.deepEqual(createVerifyRequests(doi).map((r) => r.verifier).sort(), ['datacite', 'doi-org', 'zenodo'])
})

test('the stylesheet derives from the key 432 and each block takes its accent from the middle of its UUID as CMYK', () => {
  assert.equal(KEY, 432)
  assert.equal(hueOf(KEY), 72)
  assert.deepEqual(HARMONICS.map(hueOf), [72, 216, 108, 54, 27])
  const css = getCss()
  assert.ok(css.includes('--a432-hue: 72;') && css.includes('--a432-1: hsl(72 '))
  const u = uuidOf('qpu')
  const c = cmykOfUuid(u)
  for (const v of Object.values(c)) assert.ok(v >= 0 && v <= 1)
  assert.match(accentOfUuid(u), /^rgb\(\d+ \d+ \d+\)$/)
  const r = callOf('processor', { name: 'Willow' })
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
    const r = callOf(e.tool, e.arguments) as { result: { _meta: { license: { spdx: string }; widget: string; block: { license: string; author: string }; openGraph: { license: string } } } }
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
  const p = { id: uuidOf('first'), content: 'first' } // a link is witnessed by the neighbour's content, else null
  const self = { prev: p.id }
  const next = { id: uuidOf('third'), prev: u, content: 'third' }
  const v = verifyOf(u, 'qpu', p, next, self)
  assert.equal(v.valid, true); assert.equal(v.decided, 4)
  const broken = verifyOf(u, 'qpu', p, { ...next, prev: 'elsewhere' }, self)
  assert.equal(broken.valid, false)
  assert.equal(verifyOf(u).decided, 1)
})

test('_meta.integrity names the result itself, so seal { tamper } reads an untouched one authentic', () => {
  const r = callOf('seal', { text: 'qpu' }).result as { structuredContent: unknown; _meta: { integrity: object } }
  assert.equal(callOf('seal', { text: 'x', tamper: { text: canonicalTextOf(r.structuredContent), ...r._meta.integrity } }).result?.structuredContent.verdict, 'authentic')
})

test('the channel of a UUID is read from the id alone: handle, hex program with version and variant kept, message tail in three readings', () => {
  const u = uuidOf('qpu')
  const ch = channelOf(u)
  assert.equal(ch.handle, u.slice(0, 8))
  assert.equal(ch.middle.length, 12); assert.equal(ch.tail.length, 12)
  assert.equal(ch.program.length, 10)
  assert.equal(ch.version, u.replace(/-/g, '')[12]); assert.equal(ch.variant, u.replace(/-/g, '')[16])
  assert.equal(ch.message.one48, parseInt(ch.tail, 16))
  assert.equal(ch.message.three16.length, 3)
  assert.equal(verifyOf(u).channel.handle, ch.handle)
})

test('translation is offline, token-free and bidirectional by vocabulary; what no table knows is left as is and reported', () => {
  const bg = translateOf('The next step: a tool, an example, a lead; verdict impossible', 'en', 'bg')
  assert.ok(bg.text.includes('следващ') && bg.text.includes('инструмент') && bg.text.includes('следа') && bg.text.includes('невъзможно'))
  const back = translateOf(bg.text, 'bg', 'en')
  assert.ok(back.text.includes('next') && back.text.includes('tool') && back.text.includes('impossible'))
  const unknown = translateOf('quantum chromodynamics', 'en', 'bg')
  assert.deepEqual(unknown.untranslated, ['quantum', 'chromodynamics'])
  assert.equal(unknown.text, 'quantum chromodynamics')
  const noTable = translateOf('next', 'en', 'de')
  assert.ok(noTable.via.startsWith('no table'))
  assert.equal(LOCALES.bg!.filled, true); assert.equal(LOCALES.de!.filled, false)
})

test('the tail reads every way at once: naturals, six ASCII characters, a timestamp, a referrer handle with flags, a colour, a coordinate', () => {
  const text = tailReadingsOf('717075202020') // "qpu   "
  assert.equal(text.text6, 'qpu   ')
  const ms = Date.UTC(2026, 9, 25, 12, 0, 0)
  const stamp = tailReadingsOf(ms.toString(16).padStart(12, '0'))
  assert.equal(stamp.timestamp, new Date(ms).toISOString())
  assert.equal(stamp.one48, ms)
  const r = tailReadingsOf('9452c2d40003')
  assert.equal(r.referrer.handle, '9452c2d4'); assert.equal(r.referrer.flags, 3)
  assert.equal(r.colour.rgb, '#9452c2')
  assert.ok(r.coordinate.lat >= -90 && r.coordinate.lat <= 90 && r.coordinate.lon >= -180 && r.coordinate.lon <= 180)
  assert.equal(tailReadingsOf('ffffffffffff').text6, null)
  assert.equal(channelOf(uuidOf('qpu')).message.three16.length, 3)
  const v = tailReadingsOf('000000000008').vortex
  assert.deepEqual([v.seed, v.reflection, v.fixed, v.polarity], [8, 2, false, 'plus'])
  assert.equal(tailReadingsOf('000000000005').vortex.fixed, true)
  assert.equal(tailReadingsOf('000000000012').vortex.seed, 9)
})

test('the reflection mirrors every part at once and reflecting twice returns the parts', () => {
  const u = uuidOf('qpu')
  const r = reflectionOf(u)
  assert.equal(r.mirror.length, 36); assert.equal(sealOf(r.mirror).valid, true)
  assert.deepEqual(r.program, channelOf(u).program.map((n) => 15 - n))
  assert.equal(r.fixed, 0)
  const back = reflectionOf(r.mirror)
  assert.equal(back.handle, channelOf(u).handle); assert.deepEqual(back.program, channelOf(u).program); assert.equal(back.tail, channelOf(u).tail)
  assert.equal(verifyOf(u).reflection.mirror, r.mirror)
})

test('every vortex seed carries its trinity and the reflected trinity at the same time, and reflecting twice is the seed', () => {
  const seen = new Set<string>()
  for (let i = 1; i <= 36; i++) {
    const u = uuidOf(`trinity ${i}`)
    const v = channelOf(u).message.vortex
    if (v.seed === 0) continue
    assert.equal(v.seed + v.reflection, 10); assert.equal(10 - v.reflection, v.seed, 'σ_10 is an involution: sigma_ten_involution')
    assert.ok(v.trinity.includes(v.seed) && v.reflected.includes(v.reflection))
    assert.deepEqual(v.reflected, v.trinity.map((x: number) => 10 - x))
    if (v.trinity[0] === 3) assert.deepEqual(v.reflected, [7, 4, 1]); if (v.trinity[0] === 7) assert.deepEqual(v.reflected, [3, 6, 9]); if (v.trinity[0] === 2) assert.deepEqual(v.reflected, [8, 5, 2])
    assert.equal(v.tuned, v.trinity[0] === 3); assert.equal(v.key, 432)
    seen.add(v.trinity.join())
  }
  assert.deepEqual([...seen].sort(), ['2,5,8', '3,6,9', '7,4,1'], 'all three trinities occur across the seeds')
})
