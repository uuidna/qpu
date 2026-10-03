#!/usr/bin/env node
/**
 * Every public API, fused and used: the registry walked through the `api` family's addresses (dist/mcp/api-door.js).
 * An API is fused when its document was read and its operations derived; used when its first read operation needing no
 * parameter was called and answered (any status: the answer is the reading). Writes api-receipt.json.
 *
 *   node scripts/api-receipt.mjs            the whole registry
 *   node scripts/api-receipt.mjs --take 50  a slice
 */
import fs from 'node:fs'
import { apiWalkOf } from '../dist/mcp/api-door.js'
import { qpuContentUuidOf, qpuUuidReceiptOf } from '../dist/quantum/processing/unit/index.js'

const at = process.argv.indexOf('--take')
const take = at > 0 ? Number(process.argv[at + 1]) : Infinity
const t0 = Date.now()
const walk = await apiWalkOf(0, take, 16)
const why = walk.rows.filter((r) => !r.used).reduce((m, r) => ({ ...m, [r.why ?? `status ${r.status}`]: (m[r.why ?? `status ${r.status}`] ?? 0) + 1 }), {})
const statuses = walk.rows.filter((r) => r.used).reduce((m, r) => ({ ...m, [r.status]: (m[r.status] ?? 0) + 1 }), {})
const doc = {
  kind: 'api-receipt',
  when: new Date().toISOString().slice(0, 10),
  registry: walk.registry,
  listed: walk.listed,
  walked: walk.take,
  fused: walk.fused,
  used: walk.used,
  statuses,
  why,
  seconds: Math.round((Date.now() - t0) / 1000),
  holds: walk.fused === walk.take,
  rows: walk.rows.map((r) => ({ name: r.api, pass: r.used, value: `${r.fused ? `${r.operations} operations` : 'not fused'} · ${r.used ? `${r.status} ${r.url}` : r.why}`, receipt: '' })),
}
doc.uuid = qpuContentUuidOf(doc.rows)
doc.receipt = qpuUuidReceiptOf('api', doc.uuid, `${doc.used}/${doc.fused}/${doc.walked}`, 'scripts/api-receipt.mjs').uuid
fs.writeFileSync('api-receipt.json', JSON.stringify(doc, null, 1) + '\n')
console.log(JSON.stringify({ listed: doc.listed, walked: doc.walked, fused: doc.fused, used: doc.used, statuses, why, seconds: doc.seconds }))
