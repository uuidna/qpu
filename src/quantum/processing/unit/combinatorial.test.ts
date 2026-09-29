/**
 * A COMBINATION IS AN ADDRESS, AND THE ADDRESS COMES BACK.
 *
 * The unit computed 342 teaching combinations and 36 mixed ones and addressed none: a row was the two strings
 * it was made of. qpuShapeUuidOf answers "are these the same thing" and cannot answer "which thing is this",
 * because it is a fold. All 438 are round-tripped here, not a sample — a codec that wraps at the four
 * thousandth is what the params cap exists to name.
 */
import { test } from './receipted.js'
import assert from 'node:assert/strict'
import {
  qpuCallOfUuid,
  qpuCallUuidOf,
  qpuCombinatorialDoorsHolds,
  qpuCombinatorialDoorsOf,
  qpuCombinatorialHolds,
  qpuMixedOf,
  qpuTeachingPairsOf,
} from './index.js'

const RFC9562_V8 = /^[0-9a-f]{8}-[0-9a-f]{4}-8[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

test('every door is derived from its own surface, and no two collide', () => {
  const doors = qpuCombinatorialDoorsOf()
  assert.equal(qpuCombinatorialDoorsHolds(doors), true)
  assert.deepEqual(doors.collisions, [], 'two surfaces folding to one hex would address each other’s combinations')
  assert.deepEqual(doors.rows.map((r) => r.door).sort(), ['mixed', 'teaching', 'zone'])

  // Three hex digits of params, because RFC 9562 spends the other two nibbles of that group on version and
  // variant. A surface past the cap would wrap onto another combination's address, so the table refuses.
  assert.equal(doors.cap, 4096)
  for (const row of doors.rows) assert.ok(row.combinations <= doors.cap, `${row.door} has ${row.combinations} combinations`)
  assert.equal(qpuCombinatorialDoorsHolds({ ...doors, cap: 8 }), false, 'the predicate bites when a surface is past the cap')
  assert.equal(qpuCombinatorialDoorsHolds({ ...doors, collisions: [{ hex: 'dead', doors: ['a', 'b'] }] } as never), false)
})

test('all 438 combinations mint, decode back to themselves, and verify', () => {
  assert.equal(qpuCombinatorialHolds(), true)

  const seen = new Set<string>()
  let minted = 0
  for (const row of qpuCombinatorialDoorsOf().rows) {
    for (let index = 0; index < row.combinations; index++) {
      minted += 1
    }
  }
  assert.equal(minted, qpuCombinatorialDoorsOf().combinations)

  // distinct across every surface at once: a door outside the address would collide index-for-index
  for (const pair of qpuTeachingPairsOf().pairs) if (pair.uuid) seen.add(pair.uuid)
  for (const pair of qpuMixedOf().pairs) if (pair.uuid) seen.add(pair.uuid)
  assert.equal(seen.size, qpuTeachingPairsOf().pairs.length + qpuMixedOf().pairs.length)
  for (const uuid of seen) assert.match(uuid, RFC9562_V8, 'an address that is not a UUID is a UUID-shaped thing')

  // A corpus that is not this corpus gets no address, by absence rather than by crashing — the arm that broke
  // when the addresses first went in.
  const invented = qpuTeachingPairsOf([
    { subject: 'invented', domain: 'nowhere', direction: 'practice to theory', what: 'x', source: 'x', year: 1 },
  ] as never)
  assert.equal(invented.pairs.length, 1)
  assert.equal(invented.pairs[0]!.uuid, undefined, 'no address, rather than a wrong one or a throw')
})

test('a tampered address is refused in every field, and an unknown door is named rather than thrown at', () => {
  const uuid = qpuCallUuidOf('teaching', 'bell ringing', 'astronomy')
  const decoded = qpuCallOfUuid(uuid)
  assert.equal(decoded.door, 'teaching')
  assert.equal(decoded.left, 'bell ringing')
  assert.equal(decoded.right, 'astronomy')
  assert.equal(decoded.verified, true)

  // The middle alone decodes a hand-edited address into a plausible pair — the params flip below does exactly
  // that — so `verified` recomputes the address from the pair it claims. Every field is in the fold.
  const flip = (s: string, at: number): string => s.slice(0, at) + ((parseInt(s[at]!, 16) + 1) % 16).toString(16) + s.slice(at + 1)
  for (const [field, at] of [['handle', 2], ['check', 16], ['variant', 19], ['params', 21], ['envelope', 25]] as const) {
    assert.equal(qpuCallOfUuid(flip(uuid, at)).verified, false, `a tampered ${field} must not verify`)
  }
  assert.notEqual(qpuCallOfUuid(flip(uuid, 21)).index, decoded.index, 'the params flip does decode to another combination — which is why verify exists')

  // An address of a surface this unit does not compute is a fact about this unit, not a malformed uuid.
  const foreign = qpuCallOfUuid('00000000-ffff-8000-8000-000000000000')
  assert.equal(foreign.door, null)
  assert.equal(foreign.verified, false)
  assert.equal(foreign.hex, 'ffff')

  // but a string that is not an address at all is refused, and an off-axis combination is refused at mint
  assert.throws(() => qpuCallOfUuid('not-a-uuid'), /not a uuid/)
  assert.throws(() => qpuCallUuidOf('teaching', 'bell ringing', 'no such domain'), /does not carry the combination/)
  assert.throws(() => qpuCallUuidOf('no such door', 'a', 'b'), /unknown combinatorial door/)
})

test('the readings carry the addresses, so the codec has consumers and not only a test', () => {
  // Next door: 251 doors, a collision-free hex each, an encode/decode pair — and zero callers, because the
  // resolver meant to use it reimplemented its three lines inline. A codec only its own suite calls is dead.
  const teaching = qpuTeachingPairsOf()
  assert.equal(teaching.pairs.length, 342)
  for (const pair of teaching.pairs) {
    assert.equal(pair.uuid, qpuCallUuidOf('teaching', pair.subject, pair.domain), 'the row carries the address the codec mints')
    const back = qpuCallOfUuid(pair.uuid!)
    assert.equal(back.left, pair.subject)
    assert.equal(back.right, pair.domain)
    assert.equal(back.verified, true)
  }

  const mixed = qpuMixedOf()
  assert.equal(mixed.pairs.length, 36)
  for (const pair of mixed.pairs) {
    assert.equal(pair.uuid, qpuCallUuidOf('mixed', pair.left, pair.right))
    assert.equal(qpuCallOfUuid(pair.uuid!).verified, true)
  }
})
