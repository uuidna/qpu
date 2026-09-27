import { test } from './receipted.js'
import assert from 'node:assert/strict'
import {
  QPU_TEACHINGS,
  qpuFacesOf,
  qpuTeachingCensusHolds,
  qpuTeachingCensusOf,
  qpuTeachingPairsHolds,
  qpuTeachingPairsOf,
  qpuTeachingReadingHolds,
  qpuTeachingReadingOf,
  qpuTeachingSeatingHolds,
  qpuTeachingSeatingOf,
  type QpuTeaching,
} from './index.js'

/**
 * THE SWAP CRITERION, PROVED ABLE TO COME OUT NEGATIVE.
 *
 * The claim is that sports, circus, theatre, music and arts and crafts are entangled with scientific domains
 * rather than being applications of them, and the test is the team swap: both directions must teach. A
 * classifier that answers "entangled" whatever it is given would confirm that claim for every pair anyone
 * proposed, which is exactly the shape of a measured-then-sealed fact — the answer already in the kernel.
 *
 * So every state is driven by construction, and the decisive one is the MUTATION: one instance removed turns
 * an entanglement into an application and back. If that does not flip, the direction field is decoration.
 *
 * WHAT IS NOT ASSERTED HERE is which pairs come out entangled. Writing that list into a test would put the
 * answer back where the design just took it out of — the corpus decides, and if a citation is added in a
 * missing direction tomorrow the membership changes and nothing here should have to be edited. What is
 * asserted is that the classification agrees with the evidence it was computed from.
 */

const cite = (subject: string, domain: string, direction: QpuTeaching['direction'], year: number): QpuTeaching => ({
  subject,
  domain,
  direction,
  year,
  what: `${subject} and ${domain}, ${direction}`,
  source: `fixture ${year}`,
})

test('the swap decides: both directions entangle, one applies, none is undecided', () => {
  const both = [cite('a', 'x', 'practice to theory', 1900), cite('a', 'x', 'theory to practice', 1950)]
  assert.equal(qpuTeachingPairsOf(both).pairs[0]?.swap, 'entangled')

  // THE MUTATION. One instance removed and the same pair must stop being an entanglement — if this does not
  // flip, the direction field is decoration and every pair anyone proposes comes back confirmed.
  const oneWay = qpuTeachingPairsOf([both[0]!]).pairs[0]
  assert.equal(oneWay?.swap, 'application')
  assert.equal(oneWay?.owes, 'theory to practice', 'and the missing direction is named, not merely the verdict')
  const otherWay = qpuTeachingPairsOf([both[1]!]).pairs[0]
  assert.equal(otherWay?.swap, 'application')
  assert.equal(otherWay?.owes, 'practice to theory', 'the classifier distinguishes which direction is missing')

  /* THE THIRD STATE IS NOT A NEGATIVE RESULT. A pair the corpus says nothing about is reported, and reported as
   * undecided — the same law the CERN readers follow, where an unreached host is never a wrong answer. */
  const grid = qpuTeachingPairsOf([...both, cite('b', 'y', 'practice to theory', 1800)])
  const unevidenced = grid.pairs.find((row) => row.subject === 'a' && row.domain === 'y')
  assert.equal(unevidenced?.swap, 'undecided')
  assert.equal(unevidenced?.cited, 0)
  assert.equal(unevidenced?.owes, undefined, 'an undecided pair owes nothing, because nothing has been claimed')
  assert.equal(grid.pairs.length, grid.subjects.length * grid.domains.length, 'every combination appears, evidenced or not')

  /* AND THE FLIP HAS A CONSEQUENCE ON THE LATTICE, which is the point of classifying at all. An entanglement
   * takes a ray and sits with its domain across the swap; an application takes no seat and leaves the ray
   * vacant. A verdict that changed nothing downstream would be a label rather than a finding. */
  const faces = qpuFacesOf()
  const entangled = qpuTeachingSeatingOf(qpuTeachingPairsOf(both))
  assert.equal(entangled.seated.length, 1)
  assert.equal(entangled.vacant.length, faces.rays - 1)
  assert.equal((entangled.seated[0]!.seats[0]!.face + faces.rays) % faces.faces, entangled.seated[0]!.seats[1]!.face)

  const applied = qpuTeachingSeatingOf(qpuTeachingPairsOf([both[0]!]))
  assert.equal(applied.seated.length, 0, 'an application earns no seat')
  assert.equal(applied.vacant.length, faces.rays, 'and every ray stays vacant, which is what the lattice reports')
  assert.equal(qpuTeachingSeatingHolds(applied), true, 'an empty seating is still a sound one')
})

test('the seating is ordered by the evidence, and a crowded lattice is a finding rather than a crash', () => {
  const faces = qpuFacesOf()
  const pairOf = (name: string, year: number) => [
    cite(name, `${name}-domain`, 'practice to theory', year),
    cite(name, `${name}-domain`, 'theory to practice', year + 1),
  ]

  // THE ORDER IS NOT THE AUTHOR'S. Declared late, cited early: with no contest between them, evidence decides
  // the ray, which is the tie-break doing its job rather than the rule doing it.
  const ordered = qpuTeachingSeatingOf(qpuTeachingPairsOf([...pairOf('late', 1990), ...pairOf('early', 1600)]))
  assert.equal(ordered.seated[0]?.subject, 'early')
  assert.equal(ordered.seated[1]?.subject, 'late')

  // FEWER PAIRS THAN RAYS: the empty rays are named, so a reader can see what the lattice is still waiting for.
  assert.equal(ordered.vacant.length, faces.rays - 2)
  assert.equal(ordered.crowded.length, 0)

  // MORE PAIRS THAN RAYS: the overflow is named too. Seven seats is a property of the lattice, not of the world,
  // and a pair that earns a seat and finds none is a true sentence someone can act on.
  const many = Array.from({ length: faces.rays + coinsOf() }, (_, i) => pairOf(`s${i}`, 1500 + i)).flat()
  const crowded = qpuTeachingSeatingOf(qpuTeachingPairsOf(many))
  assert.equal(crowded.earned, faces.rays + coinsOf())
  assert.equal(crowded.seated.length, faces.rays)
  assert.equal(crowded.crowded.length, coinsOf())
  assert.equal(crowded.vacant.length, 0)
  assert.equal(qpuTeachingSeatingHolds(crowded), true)

  /* AND THE SWAP IS THE INVOLUTION, read on this seating rather than restated: a subject's face plus rays is
   * its domain's face, and applied twice it returns — which is theorem involution at coins = 2. */
  for (const row of crowded.seated) {
    assert.equal((row.seats[0]!.face + faces.rays) % faces.faces, row.seats[1]!.face)
    assert.equal((row.seats[1]!.face + faces.rays) % faces.faces, row.seats[0]!.face)
    assert.notEqual(row.seats[0]!.team, row.seats[1]!.team, 'a subject and its domain sit on opposite teams')
  }
})

const coinsOf = () => qpuFacesOf().coins

test('the seating is maximal: a ray may not stand empty while a pair is turned away', () => {
  const faces = qpuFacesOf()
  const both = (subject: string, domain: string, year: number) => [
    cite(subject, domain, 'practice to theory', year),
    cite(subject, domain, 'theory to practice', year + 1),
  ]

  /**
   * THE FAULT THE CROSSED CORPUS EXPOSED, as a fixture.
   *
   * `wide` is entangled with two domains and `narrow` with only `shared`. Taking pairs in order of evidence
   * and seating whatever still fits gives `shared` to `wide`, because its citation is older — and then
   * `narrow` has nowhere to go and a ray stands empty. Seating `wide` with `only` instead holds both.
   *
   * Measured on the real corpus before this was fixed: sports took mechanics on a 1672 citation, circus was
   * left with no seat at all, and ray 6 was vacant. A rule that turns a pair away AND leaves a ray free has
   * not run out of room, it has chosen badly, and nothing in the seating noticed because nothing asked.
   */
  const contested = qpuTeachingSeatingOf(qpuTeachingPairsOf([...both('wide', 'shared', 1600), ...both('wide', 'only', 1700), ...both('narrow', 'shared', 1800)]))
  assert.equal(contested.seated.length, 2, 'both pairs are held, which greedy could not do')
  assert.equal(contested.vacant.length, faces.rays - 2)
  assert.deepEqual(
    contested.seated.map((row) => `${row.subject}/${row.domain}`).sort(),
    ['narrow/shared', 'wide/only'],
    'the older citation yields its domain, because keeping it would seat one pair instead of two',
  )

  /* THE PROPERTY, not the instance: no turned-away pair has both of its names still free, unless the lattice
   * is genuinely full. That is what maximal means, and it is what greedy silently failed. */
  for (const row of contested.crowded) {
    assert.ok(
      contested.seated.some((held) => held.subject === row.subject || held.domain === row.domain),
      `${row.subject}/${row.domain} was turned away with both seats free`,
    )
    assert.ok(row.why.length > 0, 'and it is told why, which "no room" would not have been')
  }
  assert.equal(qpuTeachingSeatingHolds(contested), true)
})

test('the census accounts for every pair the seats admit, and loses none', (t) => {
  const census = qpuTeachingCensusOf()
  assert.equal(qpuTeachingCensusHolds(census), true)
  const faces = qpuFacesOf()
  assert.equal(census.seats, faces.faces)
  // The four kinds are disjoint and exhaustive; a decomposition that quietly drops a pair fails on this line.
  assert.equal(census.entangled + census.applied + census.craft + census.mathematics, census.pairs)
  assert.equal(census.entangled, faces.rays, 'one entangled pair per ray, which is what a ray is')
  assert.equal(census.craft, census.mathematics, 'the two same-team families are the same size, since the teams are')
  t.diagnostic(
    `${census.pairs} pairs over ${census.seats} seats: ${census.entangled} entangled, ${census.applied} applied, ${census.craft} sharing a craft, ${census.mathematics} sharing a mathematics`,
  )
})

test('the corpus as it stands agrees with itself, and the prose has no opinion of its own', (t) => {
  assert.equal(qpuTeachingPairsHolds(), true)
  assert.equal(qpuTeachingSeatingHolds(), true)
  assert.equal(qpuTeachingReadingHolds(), true)

  const read = qpuTeachingPairsOf()
  for (const row of read.pairs) {
    const practice = row.fromPractice.length > 0
    const theory = row.fromTheory.length > 0
    // the classification IS the evidence, restated — there is no other input it could have come from
    assert.equal(row.swap === 'entangled', practice && theory, `${row.subject}/${row.domain}`)
    assert.equal(row.swap === 'application', practice !== theory, `${row.subject}/${row.domain}`)
    assert.equal(row.swap === 'undecided', !practice && !theory, `${row.subject}/${row.domain}`)
  }

  /* THE CORPUS MUST BE ABLE TO SAY NO. If every evidenced pair came out entangled, the one-way rows would have
   * been quietly lost and the classifier would be confirming whatever it was handed. */
  const applied = read.pairs.filter((row) => row.swap === 'application')
  assert.ok(applied.length > 0, 'the evidence includes pairs that teach in one direction only')
  assert.ok(
    applied.some((row) => row.owes === 'practice to theory') && applied.some((row) => row.owes === 'theory to practice'),
    'and in each direction, so the classifier is not merely missing one field',
  )

  // Every generated sentence is backed by an instance; none of them is prose written beside the computation.
  for (const row of qpuTeachingReadingOf()) {
    assert.ok(row.sources.length > 0, `${row.subject}/${row.domain} cites nothing`)
    for (const source of row.sources) assert.ok(QPU_TEACHINGS.some((instance) => instance.source === source))
  }

  const seating = qpuTeachingSeatingOf(read)
  t.diagnostic(
    `${read.pairs.length} combinations: ${read.pairs.filter((r) => r.swap === 'entangled').length} entangled, ${applied.length} applied, ${read.pairs.filter((r) => r.swap === 'undecided').length} not decidable from this corpus`,
  )
  for (const row of seating.seated) t.diagnostic(`  ray ${row.ray}: ${row.subject} <-> ${row.domain} (earliest ${row.earliest})`)
  for (const row of applied) t.diagnostic(`  application: ${row.domain} serves ${row.subject}; owes ${row.owes}`)
})
