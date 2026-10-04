#!/usr/bin/env node
/**
 * SCAFFOLD A WAVE OF FAMILIES FROM A SPEC, EXACT AND TESTED.
 *
 * The file system is the registry (scripts/payload-cloudflare.mjs), so a family is a src/families/<fam>/index.ts that
 * registers its formulas and a test.ts beside it. This writes both from a compact spec so a wave is one palette of
 * integer operations, not ten hand-written modules that drift. Each formula is an exact integer at a hex address,
 * crossing to its dst (uncrossed → a lead gate.crossed reports), and the test it emits computes the expected value
 * from the same palette, so the test cannot agree with a wrong implementation by copying it.
 *
 *   node scripts/scaffold-family.mjs <spec.json>
 *
 * spec.json: [{ fam, dst, Cls, methods: [[name, op, [sampleArgs...]], ...] }, ...]
 * op ∈ the palette below; sampleArgs drive the emitted test (and the hex run when they fit the params section).
 */
import fs from 'node:fs'
import path from 'node:path'

const SRC = path.resolve(import.meta.dirname, '..', 'src', 'families')

const factOf = (x) => { if (x > 12) return 0; let v = 1; for (let i = 2; i <= x; i++) v *= i; return v }
const combOf = (nn, k) => { if (k < 0 || k > nn) return 0; let kk = k > nn - k ? nn - k : k, v = 1; for (let i = 0; i < kk; i++) v = (v * (nn - i)) / (i + 1); return Math.round(v) }
const permOf = (nn, k) => (k < 0 || k > nn || nn > 20 ? 0 : combOf(nn, k) * factOf(k))

/** THE PALETTE: each op its arity, the formula text (x,y,z), the body expression, a holds guard, and the fn the test
 *  recomputes with. Integers only; divisions guard the zero divisor; subtractions floor at zero; the heavy combinatorial
 *  ops cap so the value stays a safe integer. */
const OPS = {
  mul2:    { ar: 2, text: '(x, y) = x · y',             body: 'x * y',                                        guard: '', fn: (x, y) => x * y },
  mul3:    { ar: 3, text: '(x, y, z) = x · y · z',      body: 'x * y * z',                                    guard: '', fn: (x, y, z) => x * y * z },
  add2:    { ar: 2, text: '(x, y) = x + y',             body: 'x + y',                                        guard: '', fn: (x, y) => x + y },
  add3:    { ar: 3, text: '(x, y, z) = x + y + z',      body: 'x + y + z',                                    guard: '', fn: (x, y, z) => x + y + z },
  floordiv:{ ar: 2, text: '(x, y) = x / y',             body: 'y > 0 ? Math.floor(x / y) : 0',                guard: ' && y > 0', fn: (x, y) => (y > 0 ? Math.floor(x / y) : 0) },
  ceildiv: { ar: 2, text: '(x, y) = ceil(x / y)',       body: 'y > 0 ? Math.floor((x + y - 1) / y) : 0',      guard: ' && y > 0', fn: (x, y) => (y > 0 ? Math.floor((x + y - 1) / y) : 0) },
  pct:     { ar: 2, text: '(x, y) = x · 100 / y',       body: 'y > 0 ? Math.floor((x * 100) / y) : 0',        guard: ' && y > 0', fn: (x, y) => (y > 0 ? Math.floor((x * 100) / y) : 0) },
  permille:{ ar: 2, text: '(x, y) = x · 1000 / y',      body: 'y > 0 ? Math.floor((x * 1000) / y) : 0',       guard: ' && y > 0', fn: (x, y) => (y > 0 ? Math.floor((x * 1000) / y) : 0) },
  submax:  { ar: 2, text: '(x, y) = max(0, x − y)',     body: 'Math.max(0, x - y)',                           guard: '', fn: (x, y) => Math.max(0, x - y) },
  mod:     { ar: 2, text: '(x, y) = x mod y',           body: 'y > 0 ? x % y : 0',                            guard: ' && y > 0', fn: (x, y) => (y > 0 ? x % y : 0) },
  min2:    { ar: 2, text: '(x, y) = min(x, y)',         body: 'Math.min(x, y)',                               guard: '', fn: (x, y) => Math.min(x, y) },
  max2:    { ar: 2, text: '(x, y) = max(x, y)',         body: 'Math.max(x, y)',                               guard: '', fn: (x, y) => Math.max(x, y) },
  ge:      { ar: 2, text: '(x, y) = [x ≥ y]',           body: 'x >= y ? 1 : 0',                               guard: '', fn: (x, y) => (x >= y ? 1 : 0) },
  prod3sum:{ ar: 3, text: '(x, y, z) = x · y + z',      body: 'x * y + z',                                    guard: '', fn: (x, y, z) => x * y + z },
  fact:    { ar: 1, text: '(x) = x!',                   body: 'x <= 12 ? factOf(x) : 0',                      guard: ' && x <= 12', fn: (x) => factOf(x) },
  perm:    { ar: 2, text: '(x, y) = x! / (x − y)!',     body: 'permOf(x, y)',                                 guard: ' && x <= 20 && y <= x', fn: (x, y) => permOf(x, y) },
  comb:    { ar: 2, text: '(x, y) = C(x, y)',           body: 'combOf(x, y)',                                 guard: ' && y <= x', fn: (x, y) => combOf(x, y) },
  pow2:    { ar: 1, text: '(x) = 2^x',                  body: 'x <= 30 ? 2 ** x : 0',                         guard: ' && x <= 30', fn: (x) => (x <= 30 ? 2 ** x : 0) },
}
const XYZ = ['x', 'y', 'z']

const helpers = `const factOf = (x: number): number => { if (x > 12) return 0; let v = 1; for (let i = 2; i <= x; i++) v *= i; return v }
const combOf = (nn: number, k: number): number => { if (k < 0 || k > nn) return 0; let kk = k > nn - k ? nn - k : k, v = 1; for (let i = 0; i < kk; i++) v = (v * (nn - i)) / (i + 1); return Math.round(v) }
const permOf = (nn: number, k: number): number => (k < 0 || k > nn || nn > 20 ? 0 : combOf(nn, k) * factOf(k))
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)`

const PARAM_MAX = 65536 // 16^4 — the hex params section carries three naturals each < this

const indexOf = (spec) => {
  const { fam, dst, Cls, methods } = spec
  const names = methods.map((m) => m[0])
  const proof = `${fam} counts: ` + methods.map(([name, op]) => `${name}${OPS[op].text}`).join('; ')
  const lines = []
  lines.push(`import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'`)
  lines.push(`import { crossFormulaOf, type CrossFormula } from '../cross/index.js'`)
  lines.push('')
  lines.push(`/** ${Cls} — ${names.length} exact-integer formulas of the ${fam} domain, each at a hex address crossing to ${dst}; develops the ${fam} leads. */`)
  lines.push('')
  lines.push(`const PROOF = ${JSON.stringify(proof)}`)
  lines.push(helpers)
  lines.push(`const f = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[]): CrossFormula =>`)
  lines.push(`  crossFormulaOf({ id, src: '${fam}', dst: '${dst}', formula, value, proof: PROOF }, holds, { name: \`${fam}.\${name}\`, params })`)
  lines.push('')
  lines.push(`export class ${Cls} {`)
  for (const [name, op] of methods) {
    const { ar, text, body, guard } = OPS[op]
    const args = XYZ.slice(0, ar)
    const sig = args.map((a) => `${a}: number`).join(', ')
    lines.push(`  /** ${name}${text}. */`)
    lines.push(`  static ${name}(${sig}): CrossFormula { return f('${fam}-${name}', '${name}${text}', ${body}, nat(${args.join(', ')})${guard}, '${name}', [${args.join(', ')}]) }`)
  }
  lines.push('}')
  lines.push('')
  lines.push(`for (const name of [${names.map((x) => `'${x}'`).sort().join(', ')}] as const)`)
  lines.push(`  qpuHexRegisterOf('${fam}', name, (${Cls}[name] as (...x: unknown[]) => unknown).bind(${Cls}))`)
  return lines.join('\n') + '\n'
}

const testOf = (spec) => {
  const { fam, Cls, methods } = spec
  const rows = methods.map(([name, op, args]) => ({ name, op, args, value: OPS[op].fn(...args) }))
  // the hex run carries naturals that fit the params section (≤ 3, each < 16^4); take up to three such rows
  const runnable = rows.filter((r) => r.args.length <= 3 && r.args.every((a) => Number.isSafeInteger(a) && a >= 0 && a < PARAM_MAX)).slice(0, 3)
  const lines = []
  lines.push(`import { test } from '../../quantum/processing/unit/receipted.js'`)
  lines.push(`import assert from 'node:assert/strict'`)
  lines.push(`import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'`)
  lines.push(`import { ${Cls} } from './index.js'`)
  lines.push('')
  lines.push(`/** ${fam}: ${rows.length} exact-integer formulas, each recomputed from the palette and run at its hex address. */`)
  lines.push(`test('${fam}: ${rows.map((r) => r.name).join(', ')}', async (t) => {`)
  for (const r of rows)
    lines.push(`  assert.equal(${Cls}.${r.name}(${r.args.join(', ')}).value, ${r.value}, '${r.name}(${r.args.join(', ')})')`)
  lines.push(`  assert.equal(qpuHexFamiliesOf().get('${fam}')?.length, ${rows.length})`)
  lines.push(`  for (const [name, params, expected] of ${JSON.stringify(runnable.map((r) => [r.name, r.args, r.value]))} as [string, number[], number][]) {`)
  lines.push(`    const uuid = qpuHexUuidOf({ family: '${fam}', program: [name], params })`)
  lines.push(`    const run = (await qpuHexRunOf(uuid)) as { value?: unknown }`)
  lines.push(`    assert.equal(Number(run.value), expected, \`${fam}.\${name} at \${uuid}\`)`)
  lines.push(`    qpuUuidReceiptOf(\`${fam} \${name}\`, qpuContentUuidOf(run), { uuid })`)
  lines.push(`  }`)
  lines.push(`  t.diagnostic('${rows.length} formulas; ' + ${JSON.stringify(runnable.map((r) => `${r.name}=${r.value}`).join(', '))})`)
  lines.push(`})`)
  return lines.join('\n') + '\n'
}

const spec = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))
for (const fam of spec) {
  const dir = path.join(SRC, fam.fam)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.ts'), indexOf(fam))
  fs.writeFileSync(path.join(dir, 'test.ts'), testOf(fam))
  console.log(`scaffolded ${fam.fam}: ${fam.methods.length} formulas`)
}
