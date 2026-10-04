#!/usr/bin/env node
// Scaffold UUIDNA families from an integer-op palette — MCP combinatorics in place of per-family LLM authoring.
// Each method is (name, op, [args]); the palette defines the formula string, body, holds-guard, and an evaluator
// that computes the exact integer the test asserts. Emits index.ts + test.ts byte-identical in shape to cloud/.
import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = '/Users/ceci/github/uuidna/qpu-verify'

// op: arity, formula(params)->string using x,y,z; body string; holds string; fn(args)->int
const OPS = {
  mul2:      { ar: 2, f: 'x · y',               body: 'x * y',                                   holds: 'nat(x, y)',            fn: (x, y) => x * y },
  mul3:      { ar: 3, f: 'x · y · z',           body: 'x * y * z',                               holds: 'nat(x, y, z)',         fn: (x, y, z) => x * y * z },
  add2:      { ar: 2, f: 'x + y',               body: 'x + y',                                   holds: 'nat(x, y)',            fn: (x, y) => x + y },
  add3:      { ar: 3, f: 'x + y + z',           body: 'x + y + z',                               holds: 'nat(x, y, z)',         fn: (x, y, z) => x + y + z },
  floordiv:  { ar: 2, f: '⌊x / y⌋',             body: 'y > 0 ? Math.floor(x / y) : 0',           holds: 'nat(x, y) && y > 0',   fn: (x, y) => y > 0 ? Math.floor(x / y) : 0 },
  ceildiv:   { ar: 2, f: '⌈x / y⌉',             body: 'y > 0 ? Math.ceil(x / y) : 0',            holds: 'nat(x, y) && y > 0',   fn: (x, y) => y > 0 ? Math.ceil(x / y) : 0 },
  pct:       { ar: 2, f: '⌊x · 100 / y⌋',       body: 'y > 0 ? Math.floor((x * 100) / y) : 0',   holds: 'nat(x, y) && y > 0',   fn: (x, y) => y > 0 ? Math.floor((x * 100) / y) : 0 },
  permille:  { ar: 2, f: '⌊x · 1000 / y⌋',      body: 'y > 0 ? Math.floor((x * 1000) / y) : 0',  holds: 'nat(x, y) && y > 0',   fn: (x, y) => y > 0 ? Math.floor((x * 1000) / y) : 0 },
  submax:    { ar: 2, f: 'max(0, x − y)',       body: 'Math.max(0, x - y)',                      holds: 'nat(x, y)',            fn: (x, y) => Math.max(0, x - y) },
  mod:       { ar: 2, f: 'x mod y',             body: 'y > 0 ? x % y : 0',                       holds: 'nat(x, y) && y > 0',   fn: (x, y) => y > 0 ? x % y : 0 },
  min2:      { ar: 2, f: 'min(x, y)',           body: 'Math.min(x, y)',                          holds: 'nat(x, y)',            fn: (x, y) => Math.min(x, y) },
  max2:      { ar: 2, f: 'max(x, y)',           body: 'Math.max(x, y)',                          holds: 'nat(x, y)',            fn: (x, y) => Math.max(x, y) },
  ge:        { ar: 2, f: '[x ≥ y]',             body: 'x >= y ? 1 : 0',                          holds: 'nat(x, y)',            fn: (x, y) => x >= y ? 1 : 0 },
  prod3sum:  { ar: 3, f: '⌊x · y / z⌋',         body: 'z > 0 ? Math.floor((x * y) / z) : 0',     holds: 'nat(x, y, z) && z > 0',fn: (x, y, z) => z > 0 ? Math.floor((x * y) / z) : 0 },
}
const PARAM = ['x', 'y', 'z']

function emit(spec) {
  const { fam, dst, Cls, methods } = spec
  if (methods.length !== 8) throw new Error(`${fam}: need 8 methods, got ${methods.length}`)
  const names = methods.map((m) => m[0])
  const sorted = [...names].sort()
  const proof = `${fam} arithmetic (${names.join(', ')}); scaffolded from the integer-op palette; a measure crossed to ${dst}`
  // index.ts
  const methodLines = methods.map(([name, op, args]) => {
    const o = OPS[op]; if (!o) throw new Error(`unknown op ${op}`)
    const ps = PARAM.slice(0, o.ar)
    const sig = ps.map((p) => `${p}: number`).join(', ')
    return `  static ${name}(${sig}): CrossFormula { return c('${fam}-${name}', '${name}(${ps.join(', ')}) = ${o.f}', ${o.body}, ${o.holds}, '${name}', [${ps.join(', ')}]) }`
  })
  const idx = `import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** ${fam.toUpperCase()} — scaffolded integer measures crossed to ${dst}. Every output an exact finite nonnegative integer. */

const PROOF = '${proof}'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const c = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: '${fam}', dst: '${dst}', formula, value, proof: PROOF, ...extra }, holds, { name: \`${fam}.\${name}\`, params })

export class ${Cls} {
${methodLines.join('\n')}
}

for (const name of [${sorted.map((n) => `'${n}'`).join(', ')}] as const)
  qpuHexRegisterOf('${fam}', name, (${Cls}[name] as (...x: unknown[]) => unknown).bind(${Cls}))
`
  // test.ts — compute expected from the palette fn
  const asserts = methods.map(([name, op, args]) => {
    const expected = OPS[op].fn(...args)
    return { name, args, expected }
  })
  const rt = asserts[0] // round-trip on first method; ensure its args fit hex (<=65535)
  if (rt.args.some((a) => a > 65535)) throw new Error(`${fam}.${rt.name}: round-trip arg > 65535`)
  const assertLines = asserts.map((a) => `  assert.equal(${Cls}.${a.name}(${a.args.join(', ')}).value, ${a.expected})`)
  const diag = asserts.map((a) => `${a.name} ${a.expected}`).join(', ')
  const tst = `import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { ${Cls} } from './index.js'
import '../../mcp/families.js'

test('${fam}: ${names.join(', ')} — crossing to ${dst}', async (t) => {
${assertLines.join('\n')}
  assert.equal(${Cls}.${rt.name}(${rt.args.join(', ')}).dst, '${dst}')
  assert.equal(qpuHexFamiliesOf().get('${fam}')?.length, 8)
  const uuid = qpuHexUuidOf({ family: '${fam}', program: ['${rt.name}'], params: [${rt.args.join(', ')}] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), ${rt.expected}, \`${fam}.${rt.name} at \${uuid}\`)
  qpuUuidReceiptOf('${fam} ${rt.name}', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; ${diag}; crossing to ${dst}')
})
`
  const dir = join(ROOT, 'src/families', fam)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.ts'), idx)
  writeFileSync(join(dir, 'test.ts'), tst)
  return { fam, dst, methods: asserts.map((a) => `${a.name}=${a.expected}`) }
}

// Spec comes from a JSON file path argv[2]
import { readFileSync } from 'node:fs'
const specs = JSON.parse(readFileSync(process.argv[2], 'utf8'))
for (const s of specs) console.log(JSON.stringify(emit(s)))
