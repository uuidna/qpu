#!/usr/bin/env node
/** lean-receipt.json: every served theorem with its statement UUID, cross reading, family, uses, recomputed range and
 *  formula fold; plus the families and links the formulas discovered from their own proofs. */
import fs from 'node:fs'
const u = await import('../dist/quantum/processing/unit/index.js')
const { leanModelOf, leanRecomputeOf, leanLinksOf } = await import('../dist/quantum/processing/unit/lean-eval.js')
const { leanSource } = await import('../dist/quantum/processing/unit/lean.js')
const m = leanModelOf(leanSource)
const g = leanLinksOf(leanSource)
const byName = new Map(g.declarations.map((d) => [d.name, d]))
const l = u.qpuLeanOf()
const rows = [...l.rows, ...l.cover, l.climb].map((r) => {
  const name = r.theorem.match(/^theorem (\w+)/)[1]
  const x = leanRecomputeOf(r.theorem, m)
  return { name, family: byName.get(name)?.family, uuid: u.qpuStatementUuidOf(r.theorem), handle: r.handle, cross: r.cross, holds: r.holds, recomputed: x.holds, ...(x.over ? { over: x.over } : {}), uses: byName.get(name)?.uses ?? [], formula: u.qpuFoldOf(r.formula) }
}).sort((a, b) => a.name.localeCompare(b.name))
const doc = { kind: 'lean-receipt', source: l.source.fold, toolchain: l.source.toolchain, theorems: l.source.theorems, served: l.source.served, verbatim: l.source.verbatim, recomputed: l.source.recomputed, holds: l.holds,
  crossHolds: u.qpuCrossReadingHolds([...l.rows, ...l.cover, l.climb]), families: g.families, familyLinks: g.familyLinks, related: g.related.length, rows }
fs.writeFileSync('lean-receipt.json', JSON.stringify(doc, null, 1) + '\n')
console.log(JSON.stringify({ theorems: doc.theorems, served: doc.served, recomputed: doc.recomputed, holds: doc.holds, families: doc.families.length, related: doc.related }))
