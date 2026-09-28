/**
 * EVERY PREDICATE THIS UNIT EXPORTS IS ACTUALLY EVALUATED.
 *
 * The suite has a ratchet that refuses a new exported value with no `*Holds` beside it, and it works: 112 of them
 * exist. Nothing said any of them was ever CALLED. Measured 2026-09-28 by enumerating the module and running
 * them, which had never been done: 23 were referenced from nowhere at all — not from this file, not from another
 * source, not from a test — and two of those were FALSE.
 *
 * qpuCiteHolds pinned the version DOI as a literal, so it went false the first time the archive minted a new one
 * and stayed false through every release after; qpuMcpHolds calls it, so the whole MCP predicate went with it. A
 * counter that only asks whether a predicate EXISTS is satisfied by a predicate that has never been true.
 *
 * So the ratchet gains its other half here, and by enumeration rather than by a list: a predicate added tomorrow
 * is run the day it exists, and one that stops holding fails on the next run instead of on the next reading.
 */
import { test } from './receipted.js'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import * as unit from './index.js'

type Predicate = (...args: never[]) => unknown
const predicates = Object.entries(unit as Record<string, unknown>)
  .filter(([name, value]) => name.endsWith('Holds') && typeof value === 'function')
  .map(([name, value]) => [name, value as Predicate] as const)
  .sort(([a], [b]) => a.localeCompare(b))

test('every exported predicate is evaluated: asked with nothing, supplied a reading, or named here', () => {
  const asked = predicates.filter(([, fn]) => fn.length === 0)
  assert.ok(asked.length > predicates.length / 2, 'most predicates carry their own default reading and can simply be run')

  const notTrue: string[] = []
  for (const [name, fn] of asked) {
    let answer: unknown
    try {
      answer = fn()
    } catch (error) {
      notTrue.push(`${name} threw ${(error as Error).message}`)
      continue
    }
    if (answer !== true) notTrue.push(`${name} => ${String(answer)}`)
  }
  assert.deepEqual(notTrue, [], 'a predicate that is exported and never run is a claim nobody checks')

  /* ── and the ones that take a reading ─────────────────────────────────────────────────────────────────────── */
  // THE OTHER FIFTEEN. A predicate taking a reading cannot be run from an enumeration — it needs one — so the
  // check for those is that a suite somewhere supplies it. This reads the sources rather than trusting a list:
  // deleting the test that exercises one of them fails here rather than quietly dropping it back to unrun.
  //
  // THIS FILE COUNTS AS A SUITE, and excluding it was the wrong instinct. The exclusion was meant to stop the
  // check being satisfied by its own mention of a name; what it actually did was refuse to see the five
  // readings constructed below — the only place any of them had ever been supplied. The check still bites
  // exactly as hard: delete the test beneath this one and five names come straight back.
  const dir = join(process.cwd(), 'src/quantum/processing/unit')
  const suites = readdirSync(dir)
    .filter((f) => f.endsWith('.test.ts'))
    .map((f) => readFileSync(join(dir, f), 'utf8'))
    .join('\n')

  // A PREDICATE FOLDED INTO ITS OWN READING IS EVALUATED TOO, and that is the honest widening: qpuSeoOf calls
  // qpuSeoHolds and publishes the answer as `holds`, so a suite asserting that field has asked the predicate
  // without naming it. What is left after both forms is a predicate nothing anywhere ever runs.
  // the declaration itself is not a call, so the lines that declare one are dropped before counting
  const inUnit = readFileSync(join(dir, 'index.ts'), 'utf8')
    .split('\n')
    .filter((line) => !/^export (const|function) \w+Holds\b/.test(line))
    .join('\n')
  const calledInUnit = (name: string): boolean =>
    new RegExp(`\\b${name}\\s*\\(`).test(inUnit)

  const uncalled = predicates
    .filter(([, fn]) => fn.length > 0)
    .map(([name]) => name)
    .filter((name) => !new RegExp(`\\b${name}\\s*\\(`).test(suites) && !calledInUnit(name))

  assert.deepEqual(uncalled, [], 'each of these takes a reading, and neither a suite nor this unit ever supplies one')

/**
 * THE FIVE THAT TAKE A READING, each handed one — and each shown to refuse a broken one.
 *
 * These are the predicates the enumeration above cannot run, because each one takes a reading and an enumeration
 * has none to give. The check that found them proved they had never been evaluated by anything: four guard live
 * readings, so no suite supplied one, and a predicate never asked is indistinguishable from one that is wrong. They are asked here with CONSTRUCTED readings
 * rather than live ones, deliberately — a foreign read would make the row a reading rather than a proof, and what
 * is under test is the predicate's judgement, not whether a third party answered today.
 */
  /* ── each of those five, handed a sound reading and then a broken one ────────────────────────────────────── */
  const apis = { holds: true, sampled: 2, rows: [{ api: 'a' }, { api: 'b' }] }
  assert.equal(unit.qpuApisLiveHolds(apis as never), true)
  assert.equal(unit.qpuApisLiveHolds({ ...apis, sampled: 3 } as never), false, 'a sample that does not match its rows is not accounted for')
  assert.equal(unit.qpuApisLiveHolds({ ...apis, rows: [{ api: '' }, { api: 'b' }] } as never), false, 'a row naming no api is not a discovery')

  // A RUN IN WHICH CROSSREF DECLINED IS SOUND. The predicate is about the reading, never about the network, so a
  // row that did not resolve holds false and the reading still holds — and a row claiming to hold while its title
  // disagreed is the one shape that must not.
  const cites = { holds: true, sampled: 2, rows: [{ holds: true, live: true, agrees: true }, { holds: false, live: false, agrees: false }] }
  assert.equal(unit.qpuCitationsLiveHolds(cites as never), true)
  assert.equal(unit.qpuCitationsLiveHolds({ ...cites, rows: [{ holds: true, live: true, agrees: false }] } as never), false, 'a row cannot hold while its title disagrees')
  assert.equal(unit.qpuCitationsLiveHolds({ ...cites, rows: [{ holds: false, live: true, agrees: true }] } as never), false, 'nor refuse while both agree')

  const compose = { holds: true, entangled: 1, oneWay: 2, undecided: 3, pairs: 6 }
  assert.equal(unit.qpuComposeLiveHolds(compose as never), true)
  assert.equal(unit.qpuComposeLiveHolds({ ...compose, pairs: 7 } as never), false, 'every pair lands in exactly one bucket or the census lost one')

  const probe = { holds: true, answered: 1, gone: 1, rows: [{ verb: 'get' }, { verb: 'post' }] }
  assert.equal(unit.qpuProbeLiveHolds(probe as never), true)
  assert.equal(unit.qpuProbeLiveHolds({ ...probe, answered: 2, gone: 2 } as never), false, 'more verdicts than rows is an accounting that does not close')
  assert.equal(unit.qpuProbeLiveHolds({ ...probe, rows: [{ verb: 'put' }] } as never), false, 'a verb the schema never declared was never probed')

  const shown = unit.qpuMcpShownOf('qpu_quantum', { kind: 'probe', holds: true })
  assert.equal(unit.qpuMcpShownHolds(shown), true)
  assert.equal(unit.qpuMcpShownHolds({ ...shown, content: [] } as never), false, 'an answer with no content is not a complete result')
  assert.equal(
    unit.qpuMcpShownHolds({ ...shown, content: [{ ...shown.content[0], text: '{"different":true}' }] } as never),
    false,
    'the text block must be the structured content, or the two halves of one answer disagree',
  )
})
