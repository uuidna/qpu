/**
 * EVERY PREDICATE THIS UNIT EXPORTS IS ACTUALLY EVALUATED.
 *
 * The suite refuses a new exported value with no `*Holds` beside it, and 112 exist. Nothing said any had been
 * CALLED. Enumerating and running them, measured 2026-09-28: 23 were referenced from nowhere and two of those
 * were FALSE — qpuCiteHolds pinned a version DOI that moves on every archive, and qpuMcpHolds calls it.
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
  // A predicate taking a reading needs one supplied, so the check is that some suite does — this file
  // included. Sources are read rather than a list trusted: delete the arm below and five names come back.
  const dir = join(process.cwd(), 'src/quantum/processing/unit')
  const suites = readdirSync(dir)
    .filter((f) => f.endsWith('.test.ts'))
    .map((f) => readFileSync(join(dir, f), 'utf8'))
    .join('\n')

  // A predicate folded into its own reading counts too — qpuSeoOf publishes qpuSeoHolds as `holds`.
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

  /* Constructed readings, not live ones: a foreign read would make the row a reading rather than a proof,
   * and what is under test is the predicate's judgement, not whether a third party answered today. */
  /* ── each of those five, handed a sound reading and then a broken one ────────────────────────────────────── */
  const apis = { holds: true, sampled: 2, rows: [{ api: 'a' }, { api: 'b' }] }
  assert.equal(unit.qpuApisLiveHolds(apis as never), true)
  assert.equal(unit.qpuApisLiveHolds({ ...apis, sampled: 3 } as never), false, 'a sample that does not match its rows is not accounted for')
  assert.equal(unit.qpuApisLiveHolds({ ...apis, rows: [{ api: '' }, { api: 'b' }] } as never), false, 'a row naming no api is not a discovery')

  // A run in which Crossref declined is sound: the predicate is about the reading, never the network.
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
