#!/usr/bin/env node
/**
 * WHAT THE UNIT MAY BE, IMAGINED BY THE MCP: data.imagine(c) for every category of the registry — the public APIs of
 * that world read, the words of their titles and operations crossed with the words of every family's formulas, the
 * families reached named with the formulas the APIs name. A category no family reaches is a family to imagine.
 * Writes uses-receipt.json.
 */
import fs from 'node:fs'
import '../dist/mcp/families.js'
import { qpuContentUuidOf, qpuMcpCallOf, qpuUuidReceiptOf } from '../dist/quantum/processing/unit/index.js'

const t0 = Date.now()
const first = await qpuMcpCallOf('qpu_data', { source: 'imagine', category: 0 })
const rows = []
let c = 0
for (;;) {
  const r = await qpuMcpCallOf('qpu_cite', { hex: { family: 'data', program: ['imagine'], params: [c] } })
  const sc = r?.structuredContent ?? r
  const reading = sc.steps?.at?.(-1)?.reading?.reading
  if (!reading?.category) break
  rows.push({ name: reading.category, pass: sc.holds === true, value: `${reading.apis?.length ?? 0} APIs read · ${reading.is}`, receipt: sc.receipt ?? '' })
  c += 1
}
void first
const doc = { kind: 'uses-receipt', when: new Date().toISOString().slice(0, 10), categories: rows.length, reached: rows.filter((r) => r.pass).length, toImagine: rows.filter((r) => !r.pass).length, seconds: Math.round((Date.now() - t0) / 1000), holds: rows.length > 0, rows }
doc.uuid = qpuContentUuidOf(doc.rows)
doc.receipt = qpuUuidReceiptOf('uses', doc.uuid, `${doc.reached}/${doc.categories}`, 'scripts/uses-receipt.mjs').uuid
fs.writeFileSync('uses-receipt.json', JSON.stringify(doc, null, 1) + '\n')
console.log(JSON.stringify({ categories: doc.categories, reached: doc.reached, toImagine: doc.toImagine, seconds: doc.seconds }))
