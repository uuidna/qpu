import { test } from './receipted.js'
import assert from 'node:assert/strict'
import {
  QPU_EXPERIMENTS,
  QPU_TEACHINGS,
  qpuCrossHolds,
  qpuCrossOf,
  qpuMixedHolds,
  qpuMixedOf,
  qpuNatureHolds,
  qpuNatureOf,
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
  assert.ok(applied.every((row) => row.owes !== undefined), 'and each names the direction it lacks rather than only its verdict')
  /* THIS ONCE DEMANDED BOTH OWED DIRECTIONS APPEAR IN THE CORPUS, and closing two arts-and-crafts pairs with
   * real citations broke it: all twenty-eight that remain owe `practice to theory`. The assertion was asking
   * the WORLD to contain both shapes in order to prove something about the CLASSIFIER, which is proved by
   * construction in the fixture test above where both come out on demand. A test that fails because the
   * evidence improved is testing the evidence.
   *
   * And what it was accidentally measuring is worth saying plainly: every remaining one-way pair is a science
   * serving a subject, not a subject that has taught one back. */
  t.diagnostic(`all ${applied.length} one-way pair(s) owe ${[...new Set(applied.map((row) => row.owes))].join(' and ')}`)

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

const mix = (left: string, right: string, forward: boolean, year: number) => ({ left, right, forward, year, what: `${left}/${right}`, source: `fixture ${year}` })

test('an unordered cross counts a pair once however it was written, and keeps the direction on the row', () => {
  /* THE GRID AND THE TRIANGLE ARE DIFFERENT SHAPES. Subjects against domains is nine by nine and ordered;
   * domains against each other is unordered, so acoustics and wave physics is ONE pair, not two, and
   * acoustics against itself is not a pair at all. */
  const grid = qpuCrossOf([mix('a', 'x', true, 1900)], false)
  assert.equal(grid.pairs.length, 1)
  const within = qpuCrossOf([mix('a', 'b', true, 1900), mix('b', 'c', true, 1910)], true)
  assert.equal(within.pairs.length, 3, 'three names make three unordered pairs, and no name pairs with itself')
  assert.ok(within.pairs.every((row) => row.left < row.right), 'canonicalised by name, so the corpus cannot spell one pair two ways')

  /* WRITTEN BOTH WAYS ROUND IS STILL ONE PAIR, and the two rows must combine into an entanglement rather
   * than sit as two half-evidenced pairs nobody notices are the same pair. */
  const bothSpellings = qpuCrossOf([mix('b', 'a', true, 1900), mix('a', 'b', true, 1950)], true)
  assert.equal(bothSpellings.pairs.length, 1)
  assert.equal(bothSpellings.pairs[0]?.swap, 'entangled', 'b taught a, and a taught b — the spelling is not the direction')
  assert.equal(qpuCrossHolds(bothSpellings), true)

  /* AND THE SAME FACT WRITTEN TWICE IS STILL ONE DIRECTION. `forward: false` with the names reversed says what
   * `forward: true` says the other way round — the first version of this fixture asserted those two rows made
   * an entanglement, which would have meant one citation could close a pair by being restated. They do not. */
  const restated = qpuCrossOf([mix('b', 'a', true, 1900), mix('a', 'b', false, 1950)], true)
  assert.equal(restated.pairs[0]?.swap, 'application', 'both rows say b taught a, so only one direction is cited')

  // and one direction only is still an application, in the unordered shape as much as the ordered one
  const oneWay = qpuCrossOf([mix('b', 'a', true, 1900)], true)
  assert.equal(oneWay.pairs[0]?.swap, 'application')
  assert.ok(oneWay.pairs[0]?.owes !== undefined)

  /* THE TRIANGLE IS THE SAME TRIANGLE THE LATTICE COUNTS. A cross within one vocabulary of v names holds
   * v(v-1)/2 pairs, and the census's same-team family is that number over the seated domains — one shape
   * computed twice, so a disagreement means one of them has miscounted. */
  const seating = qpuTeachingSeatingOf()
  const census = qpuTeachingCensusOf(seating)
  const seated = qpuCrossOf(seating.seated.map((row, i) => mix(row.domain, seating.seated[(i + 1) % seating.seated.length]!.domain, true, 1900)).filter((row) => row.left !== row.right), true)
  assert.equal(census.mathematics, (seating.seated.length * (seating.seated.length - 1)) / 2)
  assert.equal(seated.pairs.length, census.mathematics, 'the cross over the seated domains is the census family')
})

test('the universal claim can come out TRUE, or asking it proves nothing', (t) => {
  /**
   * THE TEST THAT KEEPS THIS HONEST.
   *
   * qpuNatureOf asks whether every pair teaches both ways. It answers no on the real corpus, and an answer of
   * no is worth exactly as much as the predicate's ability to say yes. A claim-checker wired to refuse would
   * refuse a world in which the claim held, which is not scepticism, it is decoration.
   */
  const everything = [mix('a', 'b', true, 1900), mix('a', 'b', false, 1910), mix('b', 'c', true, 1900), mix('b', 'c', false, 1910), mix('a', 'c', true, 1900), mix('a', 'c', false, 1910)]
  const closed = qpuNatureOf({ pairs: [] } as unknown as ReturnType<typeof qpuTeachingPairsOf>, qpuCrossOf(everything, true))
  assert.equal(closed.undecided, 0)
  assert.equal(closed.oneWay, 0)
  assert.equal(closed.supported, true, 'a corpus in which every pair teaches both ways SUPPORTS the claim')
  assert.equal(closed.openToIt, true)
  assert.equal(closed.whereEvidenced, 1000, 'all of the evidenced pairs, in thousandths')

  // ONE ROW REMOVED and the universal fails — this is the whole discriminating power of the thing.
  const broken = qpuNatureOf({ pairs: [] } as unknown as ReturnType<typeof qpuTeachingPairsOf>, qpuCrossOf(everything.slice(0, -1), true))
  assert.equal(broken.supported, false)
  assert.equal(broken.openToIt, false, 'a single one-way pair contradicts it; undecided pairs do not')
  assert.equal(broken.counters.length, 1, 'and the contradicting pair is named rather than only counted')

  /* AN UNDECIDED PAIR IS NEITHER FOR NOR AGAINST. It fails the universal, because the universal is about all
   * pairs, but it leaves `openToIt` true — nothing has contradicted the claim, nobody has looked. */
  const unlooked = qpuNatureOf({ pairs: [] } as unknown as ReturnType<typeof qpuTeachingPairsOf>, qpuCrossOf([mix('a', 'b', true, 1900), mix('a', 'b', false, 1910), mix('c', 'd', true, 1900), mix('c', 'd', false, 1910)], true))
  assert.ok(unlooked.undecided > 0)
  assert.equal(unlooked.supported, false, 'pairs nobody has evidenced are not evidence for a universal')
  assert.equal(unlooked.openToIt, true, 'but they do not contradict it either — that is the third state')

  /* AND THE REAL READING, TIED BACK TO THE LATTICE. The entangled subject-domain pairs must decompose exactly
   * into the ones that got a ray and the ones that did not — the claim counts pairs, the seating counts seats,
   * and if those two disagree one of them is lying about the same corpus. */
  const real = qpuNatureOf()
  const mixed = qpuMixedOf()
  const teaching = qpuTeachingPairsOf()
  const seating = qpuTeachingSeatingOf(teaching)
  const census = qpuTeachingCensusOf(seating)
  assert.equal(qpuNatureHolds(real), true)
  assert.equal(qpuMixedHolds(mixed), true)
  assert.equal(real.pairs, teaching.pairs.length + mixed.pairs.length)
  assert.equal(
    teaching.pairs.filter((row) => row.swap === 'entangled').length,
    seating.seated.length + seating.crowded.length,
    'every entangled subject-domain pair either holds a ray or is named as holding none',
  )
  assert.equal(census.entangled, seating.seated.length, 'and the census counts the rays the seating filled')
  // the lattice's own domain family is the pairs among SEATED domains, a triangle inside the mixed cross
  assert.equal(census.mathematics, (seating.seated.length * (seating.seated.length - 1)) / 2)

  for (const row of QPU_EXPERIMENTS) {
    assert.ok(row.source.length > 0, `${row.left}/${row.right} cites nothing`)
    assert.ok(row.left !== row.right, 'a domain is not a mixed experiment with itself')
  }
  // THE CORPUS CAN SAY NO HERE TOO — it is tempting to assume every science teaches every science.
  assert.ok(mixed.pairs.some((row) => row.swap === 'application'), 'some sciences serve another without being taught back')

  const share = (rows: { swap: string }[]) => {
    const seen = rows.filter((row) => row.swap !== 'undecided')
    return seen.length === 0 ? 0 : (rows.filter((row) => row.swap === 'entangled').length * 1000) / seen.length
  }
  t.diagnostic(`${real.pairs} pairs: ${real.entangled} entangled, ${real.oneWay} one-way, ${real.undecided} not decidable`)
  t.diagnostic(`the claim is ${real.supported ? 'supported' : 'NOT supported'}; where evidenced, ${(real.whereEvidenced / 10).toFixed(1)}% teach both ways`)
  t.diagnostic(`domains with domains ${(share(mixed.pairs) / 10).toFixed(1)}%, subjects with domains ${(share(teaching.pairs) / 10).toFixed(1)}% of evidenced pairs entangled`)
})
