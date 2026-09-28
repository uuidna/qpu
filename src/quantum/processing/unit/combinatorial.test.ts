/**
 * A COMBINATION IS AN ADDRESS, AND THE ADDRESS COMES BACK.
 *
 * The unit computed 342 teaching combinations and 36 mixed ones and addressed none of them: a row was the two
 * strings it was made of, so nothing could cite one, cache one, or hand one to another host without shipping
 * the strings and trusting both sides to spell them alike. qpuShapeUuidOf answers "are these the same thing"
 * and cannot answer "which thing is this", because it is a fold and a fold does not come back.
 *
 * WHAT IS UNDER TEST IS THAT IT COMES BACK. Every combination on every surface is minted, decoded, and checked
 * against the pair it was minted from — not a sample, all 438 of them, because a codec that round-trips the
 * first row and wraps at the four-thousandth is exactly the defect the params cap exists to name.
 *
 * AND THAT IT HAS CONSUMERS, which is the other half and the one that was learned the hard way next door: the
 * sibling repository derived a program hex for all 251 of its doors, proved the set collision-free, exposed an
 * encode/decode pair — and a consumer check found zero callers. A published codec nobody calls is the same
 * defect as a published table nobody reads. So the readings carry the addresses, and that is asserted here.
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

  // THE CAP IS A REAL BOUNDARY, not a comfortable one: the params field is three hex digits inside the middle,
  // because RFC 9562 spends the other two nibbles of that group on the version and the variant. A surface that
  // outgrew it would wrap silently onto another combination's address, so the door table refuses to hold.
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

  // and the addresses are distinct across every surface at once — a door that did not enter the address would
  // give the same sixteen bytes to the same index on two different surfaces
  for (const pair of qpuTeachingPairsOf().pairs) if (pair.uuid) seen.add(pair.uuid)
  for (const pair of qpuMixedOf().pairs) if (pair.uuid) seen.add(pair.uuid)
  assert.equal(seen.size, qpuTeachingPairsOf().pairs.length + qpuMixedOf().pairs.length)
  for (const uuid of seen) assert.match(uuid, RFC9562_V8, 'an address that is not a UUID is a UUID-shaped thing')

  // A CORPUS THAT IS NOT THIS CORPUS GETS NO ADDRESS, and says so by absence rather than by crashing: the swap
  // suites call the same reading with small invented tables, and a position on an axis those names are not on
  // is not a position. This is the arm that broke when the addresses first went in.
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

  // THE CONTENT HALVES ARE NOT DECORATION. The middle alone would decode a hand-edited address into a perfectly
  // plausible pair — flipping the params digit below does exactly that — so `verified` recomputes the whole
  // address from the pair it claims and compares. Every field is checked because every field is in the fold.
  const flip = (s: string, at: number): string => s.slice(0, at) + ((parseInt(s[at]!, 16) + 1) % 16).toString(16) + s.slice(at + 1)
  for (const [field, at] of [['handle', 2], ['check', 16], ['variant', 19], ['params', 21], ['envelope', 25]] as const) {
    assert.equal(qpuCallOfUuid(flip(uuid, at)).verified, false, `a tampered ${field} must not verify`)
  }
  assert.notEqual(qpuCallOfUuid(flip(uuid, 21)).index, decoded.index, 'the params flip does decode to another combination — which is why verify exists')

  // AN ADDRESS OF A SURFACE THIS UNIT DOES NOT COMPUTE IS A FACT ABOUT THIS UNIT, not a malformed uuid. Refusing
  // it would report the absence of a door as a broken address, which is the same substitution a soft 404 makes.
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
  // THE LESSON FROM NEXT DOOR, asserted rather than remembered. 251 doors, a collision-free hex for each, an
  // encode/decode pair — and zero callers, because the resolver that was meant to use it reimplemented its
  // three lines inline. A codec reachable only from its own suite is dead code with a passing test.
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
