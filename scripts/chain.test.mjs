/**
 * THE TWO CHAINS MUST AGREE, because one of them is what actually runs.
 *
 * Deposited as an owed item in flaws-from-uuidna-receipt.json (2026-09-28): `npm run ci` names the gate as a single
 * chain, ci.yml re-lists those steps by hand, and NOTHING invokes `npm run ci`. So the aggregate a human reads and the
 * workflow a push runs are two hand lists that can drift, and the drift is silent — before this session ci.yml named
 * ONE scripts test (outage:test), so four of five guard suites ran in no chain at all while every board read green.
 *
 * WHAT THIS ASSERTS is the weaker, true thing: every step `npm run ci` names must be reachable from ci.yml. Not the
 * reverse — the workflow legitimately does more (caching, the kernel receipt, deploy, the hardware image), and
 * demanding symmetry would fail on work that is correctly workflow-only. A step in `ci` that the workflow never runs is
 * the fault worth catching: it is a promise the push does not keep.
 *
 * IT NEEDS NO WIRING. ci.yml runs `npm run test:scripts`, which globs scripts/*.test.mjs, so this file is asked from the
 * moment it exists — which is the point of a glob over a list.
 *
 *   node --test scripts/chain.test.mjs
 */
import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(new URL(import.meta.url).pathname), '..')
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))
const workflow = readFileSync(join(ROOT, '.github/workflows/ci.yml'), 'utf8')

/** the npm scripts `npm run ci` chains, in order, read from the script itself */
const ciSteps = () =>
  String(pkg.scripts.ci ?? '')
    .split('&&')
    .map((s) => s.trim())
    .filter(Boolean)
    // `npm test` carries no `run` to strip — the first version left the step named "npm test" and then looked for
    // "npm run npm test" in the workflow, reporting a drift that was mine and not the repository's.
    .map((s) => (s === 'npm test' ? 'test' : s.replace(/^npm run /, '')))

test('npm run ci names a chain at all', () => {
  const steps = ciSteps()
  assert.ok(steps.length >= 4, `the ci aggregate must name the gate — found ${steps.length} step(s)`)
  for (const s of steps) assert.ok(pkg.scripts[s] !== undefined || s === 'test', `ci names "${s}", which is not an npm script`)
})

test('EVERY STEP npm run ci PROMISES IS REACHABLE FROM ci.yml — a promise the push does not keep is the fault', () => {
  const missing = ciSteps().filter((s) => {
    // reachable directly, or as the bare `npm test`, or because the workflow runs the script that runs it
    if (new RegExp(`npm run ${s}\\b`).test(workflow)) return false
    if (s === 'test' && /run: npm test\b/.test(workflow)) return false
    // a step the workflow performs inline rather than by name (the proof step is a git diff in both places)
    if (s === 'proof' && /test-receipt\.json/.test(workflow)) return false
    return true
  })
  assert.deepEqual(missing, [],
    `ci promises steps the workflow never runs: ${missing.join(', ')} — either the workflow runs them or the aggregate `
    + 'stops claiming them, because the one that runs on a push is the one that counts')
})

test('the scripts suites are discovered, not listed — a suite added tomorrow is asked', () => {
  assert.match(String(pkg.scripts['test:scripts'] ?? ''), /scripts\/\*\.test\.mjs/,
    'test:scripts must glob, so no suite can be dormant by omission')
  assert.match(workflow, /npm run test:scripts/, 'and the workflow must run that glob rather than one named suite')
})

// ── THE CONTROL. Without it, the reachability test passes against a matcher that clears everything.
test('A STEP THE WORKFLOW DOES NOT RUN IS CAUGHT — the check can fail', () => {
  const invented = 'a-step-no-workflow-will-ever-name'
  assert.equal(new RegExp(`npm run ${invented}\\b`).test(workflow), false,
    'the matcher must not clear a step the workflow genuinely never mentions — if this passes, the test above proves nothing')
})
