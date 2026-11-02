// The UUID core (blocks.ts) is the one primitive every toolbox addresses through: the fold, the stamp, the channel, the reflection, the style,
// the presentation, the stream, the mixed-radix compositions and the canonical text. These tests lock its invariants — the seal of a minted UUID
// holds, the reflection and the neighbour step round-trip, parts reassemble, and canonical text separates a BigInt, a Date and a string instead of
// throwing or colliding — so a change that breaks the address space fails here, not in a client.
import test from 'node:test'
import assert from 'node:assert/strict'
import { uuidOf, uuidFromParts, stampOf, foldOf, sealOf, channelOf, reflectionOf, neighboursOf, styleOf, presentationOf, streamOf, canonicalTextOf, memoOf, compositionsOf, compositionOf, compositionIndexOf, rosettaOf, harmonicDefaultsOf, tailReadingsOf, uuidSchemasOf } from './blocks.ts'

test('uuidOf is deterministic, RFC-shaped, and the seal it mints holds (version decided, variant 8..b)', () => {
  const a = uuidOf('hello'), b = uuidOf('hello')
  assert.equal(a, b)
  assert.match(a, /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
  const s = sealOf(a)
  assert.ok(s.valid && s.shape && s.variant && s.version.agree, JSON.stringify(s))
  assert.notEqual(uuidOf('hello'), uuidOf('hello '))
  assert.equal(foldOf('').length, 16)
})

test('a tampered middle breaks the seal (the version the content decides no longer matches)', () => {
  const u = uuidOf('tamper me')
  const hex = u.replace(/-/g, '')
  const flipped = `${hex.slice(0, 13)}${hex[13] === '0' ? '1' : '0'}${hex.slice(14)}` // flip a program nibble, keep the version slot
  const tampered = `${flipped.slice(0, 8)}-${flipped.slice(8, 12)}-${flipped.slice(12, 16)}-${flipped.slice(16, 20)}-${flipped.slice(20)}`
  assert.equal(sealOf(tampered).valid, false)
})

test('canonicalTextOf separates a BigInt, a number and a string, and never throws on a BigInt (memoOf works)', () => {
  assert.equal(canonicalTextOf(10n), '"10n"')
  assert.notEqual(canonicalTextOf(10n), canonicalTextOf(10))
  assert.notEqual(canonicalTextOf(10n), canonicalTextOf('10'))
  const id = memoOf((x: bigint) => x * 2n)
  assert.equal(id(21n), 42n) // previously threw: "Do not know how to serialize a BigInt"
})

test('canonicalTextOf gives distinct text for distinct Dates (no {} collision) and sorts object keys', () => {
  assert.notEqual(canonicalTextOf(new Date('2020-01-01')), canonicalTextOf(new Date('2021-01-01')))
  assert.equal(canonicalTextOf(new Date('2020-01-01T00:00:00.000Z')), '"2020-01-01T00:00:00.000Z"')
  assert.equal(canonicalTextOf({ b: 1, a: 2 }), canonicalTextOf({ a: 2, b: 1 }))
  assert.equal(canonicalTextOf(undefined), 'null')
  assert.equal(canonicalTextOf(Infinity), '"Infinity"')
  assert.equal(canonicalTextOf([1, 'x', true]), '[1,"x",true]')
})

test('reflectionOf applied twice returns the parts (σ_d(σ_d(x)) = x on handle, program, tail)', () => {
  const u = uuidOf('reflect'), ch = channelOf(u)
  const back = reflectionOf(reflectionOf(u).mirror)
  assert.equal(back.handle, ch.handle)
  assert.deepEqual(back.program, ch.program)
  assert.equal(back.tail, ch.tail)
})

test('neighboursOf gives six sealed one-step neighbours and the step back returns the program', () => {
  const u = uuidOf('walk'), ch = channelOf(u)
  const nb = neighboursOf(u)
  assert.equal(nb.neighbours.length, 6)
  assert.ok(nb.neighbours.every((n) => n.sealed), 'every neighbour is a valid sealed address')
  for (const n of nb.neighbours) {
    const back = neighboursOf(n.uuid).neighbours.find((m) => m.axis === n.axis && m.step === -n.step)
    assert.ok(back, `${n.axis} has a step back`)
    assert.deepEqual(channelOf(back!.uuid).program, ch.program, `step ${n.axis} ${n.step} then back returns the program`)
  }
})

test('uuidFromParts round-trips through channelOf and rejects malformed parts', () => {
  const u = uuidOf('parts'), ch = channelOf(u)
  const rebuilt = uuidFromParts(ch.handle, ch.program, ch.tail)
  const rc = channelOf(rebuilt)
  assert.equal(rc.handle, ch.handle)
  assert.deepEqual(rc.program, ch.program)
  assert.equal(rc.tail, ch.tail)
  assert.ok(sealOf(rebuilt).valid)
  assert.throws(() => uuidFromParts('xyz', ch.program, ch.tail))
  assert.throws(() => uuidFromParts(ch.handle, [1, 2, 3], ch.tail))
  assert.throws(() => uuidFromParts(ch.handle, ch.program.map(() => 16), ch.tail))
})

test('the mixed-radix compositions are a bijection: index → digits → index round-trips, and a rosetta keeps the count', () => {
  const radices = [6, 7, 2]
  assert.equal(compositionsOf(radices), 84n)
  for (const i of [0n, 1n, 41n, 83n]) {
    const d = compositionOf(radices, i)
    assert.equal(compositionIndexOf(radices, d), i)
    assert.ok(d.every((x, k) => x >= 0 && x < radices[k]!))
  }
  const r = rosettaOf(radices)
  assert.equal(r.scale, 84n)
  for (const i of [0n, 13n, 83n]) assert.equal(r.from(r.to(i)), i) // to/from are inverse
})

test('harmonicDefaultsOf always picks a combination within the schema, from the referrer or the a432 key', () => {
  const schema = { properties: { a: { enum: ['x', 'y', 'z'] }, b: { enum: [1, 2] } } }
  const d1 = harmonicDefaultsOf(schema)
  assert.equal(d1.count, 6n)
  assert.ok(d1.index >= 0n && d1.index < 6n && d1.from === 'a432')
  assert.ok(schema.properties.a.enum.includes(d1.defaults.a as string) && schema.properties.b.enum.includes(d1.defaults.b as number))
  const d2 = harmonicDefaultsOf(schema, uuidOf('a-referrer'))
  assert.equal(d2.from, 'referrer')
  assert.ok(d2.index >= 0n && d2.index < 6n)
})

test('presentationOf and streamOf read a hex as itself: a nibble is one of sixteen choices, a row styled from itself', () => {
  const u = uuidOf('present')
  const p = presentationOf(u)
  assert.equal(p.nibbles, 32)
  assert.ok(p.parts.every((x) => x.item.startsWith('qpu-') && (x.variant === 'solid' || x.variant === 'outline')))
  assert.throws(() => presentationOf('zzzz'))
  const s = streamOf([uuidOf('a'), uuidOf('b'), uuidOf('c')], { sort: 'hue' })
  assert.equal(s.stream, 3)
  assert.ok(s.rows.every((r, i) => i === 0 || r.hue >= s.rows[i - 1]!.hue), 'sorted by hue ascending')
  const styled = styleOf(u)
  assert.ok(styled.hue >= 0 && styled.hue < 360 && styled.vars['--qpu-accent'].startsWith('hsl('))
})

test('the tail reads every way and uuidSchemasOf reads one UUID as every RFC layout', () => {
  const u = uuidOf('schemas'), ch = channelOf(u)
  const t = tailReadingsOf(ch.tail)
  assert.ok(t.one48 >= 0 && t.three16.length === 3 && t.vortex.seed >= 0 && t.vortex.seed <= 9)
  const sc = uuidSchemasOf(u)
  assert.equal(sc.schemasRead, 9)
  assert.ok(sc.schemas.v4.random.length === 32 && typeof sc.schemas.v7.unix_ts_ms === 'number')
  assert.equal(uuidSchemasOf('00000000-0000-0000-0000-000000000000').isNil, true)
  assert.throws(() => uuidSchemasOf('too-short'))
})
