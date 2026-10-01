/**
 * Cross-formula resilience.
 *
 * Two halves over the same ten bridges and one multi-hop path:
 *  - local: CrossDomainFormulas fed edge inputs must stay finite and in range.
 *  - certificates: each bridge restated as an exact natural-number identity the QPU sandbox checks
 *    (qpu_forge { name, run } to forge, qpu_forge { name, args } to run). Honest vectors certify,
 *    wrong and hostile vectors do not; a hostile input is denied by the sandbox instead of computed.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { CrossDomainFormulas as X } from '../src/mcp/cross-domain-formulas.ts'

type Op = Record<string, unknown>
const a = (name: string): Op => ({ op: 'args', name })
const add = (left: unknown, right: unknown): Op => ({ op: 'add', left, right })
const mul = (left: unknown, right: unknown): Op => ({ op: 'mul', left, right })
const eq = (left: unknown, right: unknown): Op => ({ op: 'eq', left, right })
const mint = (k: unknown): Op => ({ op: 'mint', k })
const no: Op = { op: 'lit', value: false }
const all = (...tests: Op[]): Op => tests.reduceRight((then, t) => ({ op: 'if', test: t, then, else: no }))
/** den = 1 + gd: a reported fraction with a zero denominator is not a value. */
const positive = (den: unknown, gap: string): Op => eq(den, add(1, a(gap)))

export type Vector = { args: Record<string, number>; certify: boolean; why: string }
export type Certificate = { name: string; bridge: string; run: Op; vectors: Vector[] }

export const certificates: Certificate[] = [
  {
    name: 'x_qsec_compress',
    bridge: 'qsec→compress: 1/(1+log2 k), k = 2^b',
    run: all(positive(a('den'), 'gd'), eq(mint(a('b')), a('k')), eq(mul(a('num'), add(1, a('b'))), a('den'))),
    vectors: [
      { args: { k: 128, b: 7, num: 1, den: 8, gd: 7 }, certify: true, why: 'honest' },
      { args: { k: 128, b: 7, num: 1, den: 7, gd: 6 }, certify: false, why: 'wrong ratio' },
      { args: { k: 0, b: 0, num: 0, den: 1, gd: 0 }, certify: false, why: 'k=0: local gives -0, no b with 2^b = 0' },
    ]},
  {
    name: 'x_obs_ml',
    bridge: 'obs→ml: s/(100+s)',
    run: all(positive(a('den'), 'gd'), eq(mul(a('num'), add(100, a('s'))), mul(a('den'), a('s')))),
    vectors: [
      { args: { s: 100, num: 1, den: 2, gd: 1 }, certify: true, why: 'honest' },
      { args: { s: 100, num: 2, den: 3, gd: 2 }, certify: false, why: 'wrong accuracy' },
      { args: { s: -100, num: 1, den: 1, gd: 0 }, certify: false, why: 's=-100: local gives -Infinity' },
      { args: { s: 1.5, num: 1, den: 1, gd: 0 }, certify: false, why: 'fractional signal count' },
    ]},
  {
    name: 'x_deploy_obs',
    bridge: 'deployment→obs: (300-b)(180-t)/54000',
    run: all(
      positive(a('den'), 'gd'),
      eq(add(a('b'), a('rb')), 300),
      eq(add(a('t'), a('rt')), 180),
      eq(mul(a('num'), 54000), mul(a('den'), mul(a('rb'), a('rt'))))),
    vectors: [
      { args: { b: 60, t: 36, rb: 240, rt: 144, num: 16, den: 25, gd: 24 }, certify: true, why: 'honest 0.64' },
      { args: { b: 600, t: 360, rb: -300, rt: -180, num: 1, den: 1, gd: 0 }, certify: false, why: 'both over budget: local gives 1 (perfect health)' },
      { args: { b: 600, t: 0, rb: -300, rt: 180, num: 0, den: 1, gd: 0 }, certify: false, why: 'build over budget: local gives -1' },
    ]},
  {
    name: 'x_quantum_ent',
    bridge: 'quantum→enterprise: 1/(1+p)',
    run: all(positive(a('den'), 'gd'), eq(mul(a('num'), add(1, a('p'))), a('den'))),
    vectors: [
      { args: { p: 9, num: 1, den: 10, gd: 9 }, certify: true, why: 'honest' },
      { args: { p: -1, num: 1, den: 1, gd: 0 }, certify: false, why: 'p=-1: local gives Infinity' },
    ]},
  {
    name: 'x_med_qsec',
    bridge: 'med+qsec: 2^k · patients',
    run: eq(mul(mint(a('k')), a('patients')), a('keyspace')),
    vectors: [
      { args: { k: 20, patients: 630, keyspace: 660602880 }, certify: true, why: 'honest, exact' },
      { args: { k: 128, patients: 630, keyspace: 2.1437e41 }, certify: false, why: 'k=128: local float loses the integer; sandbox denies 2^128' },
    ]},
  {
    name: 'x_obs_ui',
    bridge: 'obs→ui: anomalies/(signals+1)',
    run: all(positive(a('den'), 'gd'), eq(mul(a('num'), add(a('s'), 1)), mul(a('den'), a('anomalies')))),
    vectors: [
      { args: { anomalies: 5, s: 999, num: 1, den: 200, gd: 199 }, certify: true, why: 'honest' },
      { args: { anomalies: 1, s: -1, num: 1, den: 1, gd: 0 }, certify: false, why: 's=-1: local gives Infinity' },
    ]},
  {
    name: 'x_qsec_compress2',
    bridge: 'qsec+compress: L²/(k+L)',
    run: all(
      positive(a('den'), 'gd'),
      positive(add(a('k'), a('L')), 'gs'),
      eq(mul(a('num'), add(a('k'), a('L'))), mul(a('den'), mul(a('L'), a('L'))))),
    vectors: [
      { args: { L: 8, k: 8, num: 4, den: 1, gd: 0, gs: 15 }, certify: true, why: 'honest' },
      { args: { L: 0, k: 0, num: 7, den: 1, gd: 0, gs: -1 }, certify: false, why: 'k+L=0: local gives NaN; 0·num = 0·den would certify anything' },
    ]},
  {
    name: 'x_obs_ml_pred',
    bridge: 'obs+ml: (d²-a)/d²',
    run: all(
      positive(a('den'), 'gd'),
      positive(mul(a('d'), a('d')), 'gs'),
      eq(add(a('anomalies'), a('r')), mul(a('d'), a('d'))),
      eq(mul(a('num'), mul(a('d'), a('d'))), mul(a('den'), a('r')))),
    vectors: [
      { args: { d: 3, anomalies: 1, r: 8, num: 8, den: 9, gd: 8, gs: 8 }, certify: true, why: 'honest' },
      { args: { d: 0, anomalies: 1, r: -1, num: 0, den: 1, gd: 0, gs: -1 }, certify: false, why: 'd=0: local gives -Infinity' },
      { args: { d: 0, anomalies: 0, r: 0, num: 5, den: 1, gd: 0, gs: -1 }, certify: false, why: 'd=0, a=0: local gives NaN' },
      { args: { d: 1, anomalies: 3, r: -2, num: 0, den: 1, gd: 0, gs: 0 }, certify: false, why: 'a > d²: local gives -2 confidence' },
    ]},
  {
    name: 'x_ent_obs_slo',
    bridge: 'enterprise→obs: compliance > 0.9 ∧ latency < 200 (compliance per mille)',
    run: all(eq(add(901, a('w1')), a('c')), eq(add(add(a('latency'), 1), a('w2')), 200)),
    vectors: [
      { args: { c: 950, latency: 120, w1: 49, w2: 79 }, certify: true, why: 'honest' },
      { args: { c: 900, latency: 120, w1: -1, w2: 79 }, certify: false, why: 'compliance exactly 0.9' },
      { args: { c: 950, latency: 200, w1: 49, w2: -1 }, certify: false, why: 'latency exactly 200' },
    ]},
  {
    name: 'x_test_quality',
    bridge: 'test→enterprise: passed/total',
    run: all(
      positive(a('den'), 'gd'),
      positive(a('total'), 'gs'),
      eq(add(a('passed'), a('failed')), a('total')),
      eq(mul(a('num'), a('total')), mul(a('den'), a('passed')))),
    vectors: [
      { args: { passed: 45, failed: 5, total: 50, num: 9, den: 10, gd: 9, gs: 49 }, certify: true, why: 'honest' },
      { args: { passed: 0, failed: 0, total: 0, num: 1, den: 1, gd: 0, gs: -1 }, certify: false, why: '0 of 0 tests: an empty suite is not quality 1' },
      { args: { passed: 60, failed: -10, total: 50, num: 6, den: 5, gd: 4, gs: 49 }, certify: false, why: 'more passed than run: local gives 1.2' },
    ]},
  {
    name: 'x_path_quality_risk',
    bridge: 'path test→quantum→enterprise: quality = passed/total, risk = 1/(1+passed)',
    run: all(
      positive(a('total'), 'gs'),
      eq(add(a('passed'), a('failed')), a('total')),
      eq(mul(a('qn'), a('total')), mul(a('qd'), a('passed'))),
      eq(mul(a('rn'), add(1, a('passed'))), a('rd'))),
    vectors: [
      { args: { passed: 45, failed: 5, total: 50, gs: 49, qn: 9, qd: 10, rn: 1, rd: 46 }, certify: true, why: 'honest two hops' },
      { args: { passed: 45, failed: 5, total: 50, gs: 49, qn: 9, qd: 10, rn: 1, rd: 45 }, certify: false, why: 'second hop off by one' },
    ]},
]

/** Sandbox limits the certificates rely on, probed the same way. */
export const probes: Certificate[] = [
  {
    name: 'x_probe_depth',
    bridge: 'nesting past mintOf(n) is denied, not evaluated',
    run: [1, 2, 3, 4, 5, 6, 7, 8, 9].reduce<Op>((t) => add(t, 0), a('v')),
    vectors: [{ args: { v: 1 }, certify: false, why: 'depth 10 > 8' }]},
  {
    name: 'x_probe_overflow',
    bridge: 'a product past 2^53 is denied, not rounded',
    run: eq(mul(mint(28), mint(28)), a('v')),
    vectors: [{ args: { v: 2 ** 56 }, certify: false, why: '2^56 is not a safe integer' }]},
]

const depthOf = (x: unknown): number =>
  x && typeof x === 'object' ? 1 + Math.max(0, ...Object.values(x as object).map(depthOf)) : 0

test('certificates are forgeable: names fit the sandbox and trees fit its depth', () => {
  for (const c of [...certificates, ...probes]) {
    assert.match(c.name, /^[a-z][a-z0-9_]*$/)
    assert.ok(c.name.length <= 28, c.name)
    assert.ok(c.vectors.some((v) => v.certify) || probes.includes(c), `${c.name} has an honest vector`)
    assert.ok(c.vectors.some((v) => !v.certify), `${c.name} has a failing vector`)
  }
  for (const c of certificates) assert.ok(depthOf(c.run) <= 2 * 8, `${c.name} depth ${depthOf(c.run)}`)
})

// Each row: an input the matching certificate refuses — the local formula must say so (holds false) rather than
// hand back a number as if it were one; and an honest input it must accept.
type Formula = { value: number; holds: boolean }
const local: Array<[string, () => Formula, boolean]> = [
  ['qsec→compress k=128', () => X.bb84ToCompress(128), true],
  ['qsec→compress k=0', () => X.bb84ToCompress(0), false],
  ['qsec→compress k=0.5', () => X.bb84ToCompress(0.5), false],
  ['obs→ml s=100', () => X.observabilityToML(100), true],
  ['obs→ml s=-100', () => X.observabilityToML(-100), false],
  ['deployment→obs b=60 t=36', () => X.deploymentToObs(60, 36), true],
  ['quantum→enterprise p=-1', () => X.quantumToEnterprise(-1), false],
  ['med+qsec k=20 exact', () => X.medSecureWithQSec(630, 20), true],
  ['med+qsec k=128 exact', () => X.medSecureWithQSec(630, 128), false],
  ['obs→ui s=-1', () => X.observabilityToUI(1, -1), false],
  ['qsec+compress k=L=0', () => X.compressQSecSignals(0, 0), false],
  ['obs+ml d=0 a=1', () => X.mlOnObsForPrediction(0, 1), false],
  ['obs+ml d=1 a=3', () => X.mlOnObsForPrediction(1, 3), false],
  ['test→enterprise 45 of 50', () => X.testCoverageToQuality(45, 50), true],
  ['test→enterprise 60 of 50', () => X.testCoverageToQuality(60, 50), false],
  ['test→enterprise 0 of 0', () => X.testCoverageToQuality(0, 0), false],
]
for (const [label, run, holds] of local) {
  test(`local ${label}`, () => {
    const f = run()
    assert.equal(f.holds, holds, `${label} returned ${f.value} holds ${f.holds}`)
  })
}

test('an over-budget pipeline scores no health, not perfect health', () => {
  assert.equal(X.deploymentToObs(600, 360).value, 0)
  assert.equal(X.deploymentToObs(600, 0).value, 0)
})

// allBridges() restates six of the formulas; the restatement must agree with the formula it restates.
test('allBridges agrees with the named formulas', () => {
  const by = (from: string, to: string) => X.allBridges().find((b) => b.from === from && b.to === to)!
  assert.equal(by('obs', 'ui').transform({ anomalies: 1, signals: 0 }), X.observabilityToUI(1, 0).value)
  assert.equal(by('med', 'qsec').transform({ count: 0 }), X.medSecureWithQSec(0, 128).value)
  assert.equal(by('deployment', 'obs').transform({ build: 600, test: 360 }), X.deploymentToObs(600, 360).value)
})
