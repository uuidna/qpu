#!/usr/bin/env node
/**
 * Qpu/Clay.lean, discovered, not written: the formulas discover each other (qpuHexDiscoverOf) — every family's Lean
 * formulas are evaluated over the lattice's own constants and each value two or more families reach is a relation.
 * No list is kept; nothing is enumerated by hand. Each relation stated over the constant names becomes a theorem
 * proved by rfl, and clay_wings is their conjunction. The same discovery is consolidated as one schema.org
 * DefinedTermSet (crossDiscoverSchemaOf), so the lattice's relations are one standard-schema document as well.
 *   node scripts/lean-clay.mjs [--dry]
 */
import fs from 'node:fs'
const u = await import('../dist/quantum/processing/unit/index.js')
const e = await import('../dist/quantum/processing/unit/lean-eval.js')
const { leanSource } = await import('../dist/quantum/processing/unit/lean.js')

// the lattice's own named constants: the search space is the formulas themselves, not a hand-kept list of values
const model = e.leanModelOf(leanSource)
const links = e.leanLinksOf(leanSource)
const familyOf = new Map(links.declarations.map((d) => [d.name, d.family]))
const order = ['Lattice', 'Mint', 'Coil', 'Hybrid', 'Shor', 'Physics']
const consts = model.order.filter((k) => e.leanArityOf(model, k) === 0 && !/^(scanner|radar|theory|practice|kvCost|r2Cost|kvSpeed|r2Speed)$/.test(k))
  .map((k) => ({ text: k, value: e.leanCallOf(model, k, []), family: familyOf.get(k) }))
  // structural families only: measured constants (Physics, Hybrid) would name anything and explain nothing
  .filter((c) => c.value <= 10000n && ['Lattice', 'Mint', 'Coil'].includes(c.family))
  .sort((a, b) => order.indexOf(a.family) - order.indexOf(b.family))
const nameOf = new Map([...consts].reverse().map((c) => [c.value.toString(), c.text]))

// the discovered relations: values two or more families reach. The discoverer windows the registry (a split, not a
// raised limit), so walk every window via `next` and union the ways by value — discover ALL, not one window's worth.
const merged = new Map()
for (let from = 0; from !== undefined; ) {
  const d = u.qpuHexDiscoverOf(from)
  for (const r of d.relations) {
    const ways = merged.get(r.value) ?? merged.set(r.value, new Map()).get(r.value)
    for (const w of r.ways) if (!ways.has(w.hex)) ways.set(w.hex, w)
  }
  from = d.next
}
const rel = [...merged].map(([value, ways]) => {
  const w = [...ways.values()]
  return { value, families: [...new Set(w.map((x) => x.family))].sort(), ways: w }
}).filter((r) => r.families.length >= 2)
const relThms = []
for (const r of rel) {
  const ways = r.ways.filter((w) => w.params.every((p) => nameOf.has(String(p)))).map((w) => `${w.formula}${w.params.map((p) => ` ${nameOf.get(String(p))}`).join('')}`)
  const uniq = [...new Set(ways)]
  if (uniq.length < 2) continue
  const sides = uniq.slice(0, 3)
  const text = sides.length === 2
    ? `theorem relation_${r.value} : ${sides[0]} = ${sides[1]} := rfl`
    : `theorem relation_${r.value} : ${sides.slice(1).map((p) => `${sides[0]} = ${p}`).join(' ∧ ')} := ⟨${sides.slice(1).map(() => 'rfl').join(', ')}⟩`
  relThms.push({ name: `relation_${r.value}`, about: `${r.families.map((f) => f.replace('Qpu.', '')).join(', ')} meet at ${r.value}`, text })
}

const clay = `theorem clay_wings : ${relThms.map((t) => /^theorem \w+ : (.+) := /.exec(t.text)[1]).map((s) => (s.includes('∧') ? `(${s})` : s)).join(' ∧ ')} := ⟨${relThms.map((t) => t.name).join(', ')}⟩`
// imports are DISCOVERED too, not hand-listed: every module whose def a discovered relation names must be in scope, or
// the massive pass that reaches across all families (qaoaZz, triangular, qftGates …) names identifiers Lean cannot see.
const referenced = new Set()
for (const text of [...relThms.map((t) => t.text), clay]) for (const w of text.matchAll(/[A-Za-z]\w*/g)) { const f = familyOf.get(w[0]); if (f) referenced.add(f.replace('Qpu.', '')) }
const imports = [...referenced].filter((m) => m !== 'Clay').sort()
const text = [...imports.map((x) => `import Qpu.${x}`), '', `/-! # Qpu.Clay`, `Discovered, not written (scripts/lean-clay.mjs): the formulas discover each other — every value two or more families of formulas reach, stated over the lattice's own constant names. No list is kept. clay_wings is their conjunction, and crossDiscoverSchemaOf consolidates the same relations as one schema.org DefinedTermSet. -/`, '',
  ...relThms.flatMap((t) => [`/-- ${t.about}. -/`, t.text]), '', `/-- Every discovered relation at once: the families of formulas that meet. -/`, clay, ''].join('\n')
console.log(JSON.stringify({ discovered: relThms.map((t) => t.name), relations: relThms.length }, null, 1))
if (!process.argv.includes('--dry')) fs.writeFileSync('src/quantum/processing/unit/lean/Qpu/Clay.lean', text)
