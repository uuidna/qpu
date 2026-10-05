#!/usr/bin/env node
/**
 * The site, read through the public MCP: every address the host's sitemap names, asked of the host by the unit's own
 * `site` door a slice at a time ({ from, take }, take defaulting to faces), so no call exceeds an isolate's budget.
 * Writes site-receipt.json: one row per address (status, title, ms), the slowest, and whether every address answered
 * 200 with a title. Nothing is fetched here but the door: the pages are rendered by the unit, in its isolate.
 *
 *   node scripts/site-receipt.mjs                 against https://qpu.uuidna.com
 *   QPU_LIVE=https://host node scripts/site-receipt.mjs
 */
import fs from 'node:fs'
import { qpuContentUuidOf, qpuLatticeNamesOf, qpuUuidReceiptOf, tenOf } from '../dist/quantum/processing/unit/index.js'

const L = qpuLatticeNamesOf()
const host = process.env.QPU_LIVE ?? 'https://qpu.uuidna.com'
const take = L.faces
const call = async (args) => {
  const r = await fetch(`${host}/mcp`, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'prove', arguments: { door: 'data', source: 'site', ...args } } }), signal: AbortSignal.timeout(tenOf(L.hexbit) * L.coins * L.n) })
  const body = await r.json()
  return body.result?.structuredContent ?? JSON.parse(body.result?.content?.[0]?.text ?? '{}')
}

const rows = []
let from = L.n - L.n, total, sitemapMs
do {
  const slice = await call({ from, take })
  if (slice.denied) { console.error(JSON.stringify(slice)); process.exit(1) }
  total ??= slice.reading?.total ?? slice.rows?.length ?? 0
  sitemapMs ??= slice.reading?.sitemapMs
  rows.push(...(slice.rows ?? []))
  from = typeof slice.reading?.next === 'number' ? slice.reading.next : total
} while (from < total)

const failing = rows.filter((r) => r.status !== 200 || !r.title)
const slowest = rows.reduce((a, b) => (b.ms > a.ms ? b : a), rows[0] ?? { path: '', ms: 0 })
const doc = {
  kind: 'site-receipt',
  when: new Date().toISOString().slice(0, tenOf(1)),
  host,
  addresses: rows.length,
  answered: rows.filter((r) => r.status === 200).length,
  titled: rows.filter((r) => r.title).length,
  sitemapMs,
  slowest: `${slowest.path} ${slowest.ms}ms`,
  holds: rows.length > 0 && failing.length === 0,
  rows: rows.map((r) => ({ name: r.path, pass: r.status === 200 && Boolean(r.title), value: `${r.status} ${r.ms}ms${r.title ? ` · ${r.title}` : ''}${r.error ? ` · ${r.error}` : ''}`, receipt: '' })),
}
doc.uuid = qpuContentUuidOf(doc.rows)
doc.receipt = qpuUuidReceiptOf('site', doc.uuid, `${doc.answered}/${doc.addresses}`, 'scripts/site-receipt.mjs').uuid
fs.writeFileSync('site-receipt.json', JSON.stringify(doc, null, 1) + '\n')
console.log(JSON.stringify({ addresses: doc.addresses, answered: doc.answered, titled: doc.titled, sitemapMs, slowest: doc.slowest, failing: failing.map((r) => `${r.path} ${r.status}`) }))
