#!/usr/bin/env node
/**
 * Qpu/Clay.lean, discovered: values the running system exhibits in each wing are matched to the simplest expression over
 * the Lean formulas that equals them, and every cross-family relation the formulas reach is stated; each becomes a
 * theorem proved by rfl, and clay_wings is their conjunction. The theorems are found, not written.
 *   node scripts/lean-clay.mjs [--dry]
 */
import fs from 'node:fs'
const u = await import('../dist/quantum/processing/unit/index.js')
const e = await import('../dist/quantum/processing/unit/lean-eval.js')
const { leanSource } = await import('../dist/quantum/processing/unit/lean.js')
const receipt = (f) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : undefined)

// values the system exhibits, read from it, with the wing they come from
const sections = u.qpuHexUuidOf({ family: 'Qpu.Mint', program: ['mintOf'], params: [1] }).split('-').map((x) => x.length)
const shor = u.qpuShorOf()
const pcf = receipt('payload-cf-receipt.json')
const observed = [
  ['receipts', 'uuid_handle', sections[0], 'hex digits in a UUID handle section'],
  ['receipts', 'uuid_program_section', sections[1], 'hex digits in each UUID program section'],
  ['receipts', 'uuid_params', sections[4], 'hex digits in the UUID params section'],
  ['receipts', 'uuid_digits', sections.reduce((a, b) => a + b, 0), 'hex digits in a UUID'],
  ['receipts', 'uuid_bits', sections.reduce((a, b) => a + b, 0) * 4, 'bits in a UUID'],
  ['receipts', 'hex_program_nibbles', sections[1] + sections[2] + sections[3] - 2, 'formula nibbles in a hex program (version and variant kept)'],
  ['agents', 'mcp_tools', u.qpuMcpToolsListOf().length, 'tools the /mcp door lists'],
  ['agents', 'hex_alphabet', 16, 'values of one hex nibble'],
  ['crypto', 'shor_modulus', shor.n, 'the modulus Shor factors'],
  ['crypto', 'shor_factor_p', shor.factors.p, 'the first factor'],
  ['crypto', 'shor_factor_q', shor.factors.q, 'the second factor'],
  ['quantum', 'shor_dim', Number(shor.exact.dim), 'state dimension of the Shor register'],
  ['quantum', 'shor_qubits', shor.circuitry.qubits, 'qubits of the Shor register'],
  ['presentation', 'stylesheet_hz', u.qpuCssOf().hz, 'the stylesheet frequency'],
  ...(pcf ? [['cms', 'payload_plugins', pcf.plugins.length, 'Payload plugins a combination draws from'], ['cms', 'payload_combinations', pcf.combinations, 'Next.js + Payload configurations on Workers']] : []),
].filter(([, , v]) => Number.isSafeInteger(v) && v > 0)

// the search space: Lean constants (small ones), the Lean functions, and + * - over them, to depth two
const model = e.leanModelOf(leanSource)
const links = e.leanLinksOf(leanSource)
const familyOf = new Map(links.declarations.map((d) => [d.name, d.family]))
const order = ['Lattice', 'Mint', 'Coil', 'Hybrid', 'Shor', 'Physics']
const consts = model.order.filter((k) => e.leanArityOf(model, k) === 0 && !/^(scanner|radar|theory|practice|kvCost|r2Cost|kvSpeed|r2Speed)$/.test(k))
  .map((k) => ({ text: k, value: e.leanCallOf(model, k, []), cost: 1, family: familyOf.get(k) }))
  // structural families only: measured constants (Physics, Hybrid) would match anything and explain nothing
  .filter((c) => c.value <= 10000n && ['Lattice', 'Mint', 'Coil'].includes(c.family))
  .sort((a, b) => order.indexOf(a.family) - order.indexOf(b.family))
const seen = new Map()
const exprs = []
const put = (x) => { const k = x.value.toString(); const prev = seen.get(k); if (!prev || x.cost < prev.cost) { seen.set(k, x); exprs.push(x) } }
for (const c of consts) put(c)
const level1 = [...seen.values()]
const wrap = (x) => (x.cost === 1 ? x.text : `(${x.text})`)
for (const a of level1) {
  if (a.value <= 64n) put({ text: `mintOf ${wrap(a)}`, value: e.leanCallOf(model, 'mintOf', [a.value]), cost: a.cost + 1 })
  for (const b of level1) {
    if (a.value <= 64n && b.value <= a.value) put({ text: `chooseOf ${wrap(a)} ${wrap(b)}`, value: e.leanCallOf(model, 'chooseOf', [a.value, b.value]), cost: a.cost + b.cost + 1 })
    put({ text: `${a.text} + ${b.text}`, value: a.value + b.value, cost: a.cost + b.cost + 1 })
    put({ text: `${a.text} * ${b.text}`, value: a.value * b.value, cost: a.cost + b.cost + 1 })
    if (a.value > b.value) put({ text: `${a.text} - ${b.text}`, value: a.value - b.value, cost: a.cost + b.cost + 1 })
  }
}
const level2 = [...seen.values()]
for (const a of level2) for (const b of level1) {
  if (a.cost + b.cost + 1 > 5) continue
  put({ text: `${wrap(a)} * ${b.text}`, value: a.value * b.value, cost: a.cost + b.cost + 1 })
  put({ text: `${wrap(a)} + ${b.text}`, value: a.value + b.value, cost: a.cost + b.cost + 1 })
  if (a.value > b.value) put({ text: `${wrap(a)} - ${b.text}`, value: a.value - b.value, cost: a.cost + b.cost + 1 })
  if (a.value <= 64n) put({ text: `mintOf ${wrap(a)}`, value: e.leanCallOf(model, 'mintOf', [a.value]), cost: a.cost + 1 })
}
for (const a of [...seen.values()]) for (const b of [...seen.values()].filter((x) => x.cost <= 3)) if (a.cost + b.cost + 1 <= 6) {
  put({ text: `${wrap(a)} * ${wrap(b)}`, value: a.value * b.value, cost: a.cost + b.cost + 1 })
}

const found = observed.map(([wing, label, value, about]) => ({ wing, label, value, about, expr: seen.get(String(value)) }))
const theorems = found.filter((f) => f.expr && f.expr.text !== String(f.value)).map((f) => ({ name: `${f.wing}_${f.label}`, about: `${f.about} (${f.value}) equals ${f.expr.text}`, text: `theorem ${f.wing}_${f.label} : ${f.expr.text} = ${f.value} := rfl` }))
// the numeric relations between families, stated over constant names
const nameOf = new Map([...consts].reverse().map((c) => [c.value.toString(), c.text]))
const rel = u.qpuHexDiscoverOf().relations
const relThms = []
for (const r of rel) {
  const ways = r.ways.filter((w) => w.params.every((p) => nameOf.has(String(p)))).map((w) => `${w.formula}${w.params.map((p) => ` ${nameOf.get(String(p))}`).join('')}`)
  const uniq = [...new Set(ways)]
  if (uniq.length >= 2) relThms.push({ name: `relation_${r.value}`, about: `${r.families.map((f) => f.replace('Qpu.', '')).join(', ')} meet at ${r.value}`, text: `theorem relation_${r.value} : ${uniq.slice(0, 3).join(' = ')} := ⟨${uniq.slice(1, 3).map(() => 'rfl').join(', ')}⟩`.replace(/ = ([^=]+) = ([^:]+) :=/, (m) => m) })
}
// a chain a = b = c is two equalities; state it as a conjunction Lean accepts
for (const t of relThms) {
  const m = /^theorem (\w+) : (.+) := /.exec(t.text)
  const parts = m[2].split(' = ')
  t.text = parts.length === 2 ? `theorem ${m[1]} : ${parts[0]} = ${parts[1]} := rfl` : `theorem ${m[1]} : ${parts.slice(1).map((p) => `${parts[0]} = ${p}`).join(' ∧ ')} := ⟨${parts.slice(1).map(() => 'rfl').join(', ')}⟩`
}
const all = [...theorems, ...relThms]
const clay = `theorem clay_wings : ${all.map((t) => /^theorem \w+ : (.+) := /.exec(t.text)[1]).map((s) => (s.includes('∧') ? `(${s})` : s)).join(' ∧ ')} := ⟨${all.map((t) => t.name).join(', ')}⟩`
const imports = ['Mint', 'Shor', 'Lattice', 'Hybrid', 'Coil', 'Physics']
const text = [...imports.map((x) => `import Qpu.${x}`), '', `/-! # Qpu.Clay`, `Discovered, not written (scripts/lean-clay.mjs): values the running system exhibits in each wing, each matched to the simplest expression over the formulas, and the values where families of formulas meet. clay_wings is their conjunction. -/`, '',
  ...all.flatMap((t) => [`/-- ${t.about}. -/`, t.text]), '', `/-- Every discovered relation at once: the wings and the formula families they share. -/`, clay, ''].join('\n')
console.log(JSON.stringify({ observed: found.map((f) => `${f.wing}:${f.label}=${f.value} ${f.expr ? `⇐ ${f.expr.text}` : '(no expression)'}`), relations: relThms.length }, null, 1))
if (!process.argv.includes('--dry')) fs.writeFileSync('src/quantum/processing/unit/lean/Qpu/Clay.lean', text)
