// The theorem index in the RAID, a step of every online next: every textbook theorem — its key, its Lean, its sentence, the examples it backs,
// whether the kernel accepted it — written to the docket under the QPU's own tenant through the one MCP client, one entry each. An entry's
// address is the fold of its content, the same the app's hook computes, so one already present is skipped and never written twice. With no key
// or no app it says so and writes nothing: an unread docket is never a file.
import './teleport.ts'
import { TEXTBOOK_THEOREMS } from '../src/quantum/processing/textbook-theorems.ts'
import { THEOREM_KEYS } from '../src/quantum/processing/theorems-index.ts'
import { uuidOf } from '../src/quantum/processing/unit/blocks.ts'
import { mcpClient } from './mcp.ts'

const mcp = mcpClient()
// the QPU's own tenant: the one whose namespace is qpu, else the oldest — never whichever the plugin happens to list first (measured: a sandbox came first)
const tenants = await mcp.findAll('findTenants', { where: JSON.stringify({}), sort: 'createdAt', limit: 100 })
if (!tenants.docs) { console.log(`theorems-raid: ${tenants.says}; nothing written`); process.exit(0) }
const own = (tenants.docs as { id: string; namespace?: string }[]).find((t) => t.namespace === 'qpu') ?? (tenants.docs as { id: string }[])[0]
if (!own) { console.log('theorems-raid: no tenant in the app; nothing written'); process.exit(0) }
const present = await mcp.findAll('findEntries', { where: JSON.stringify({ from: { equals: 'theorems' } }), limit: 100 })
const have = new Set((present.docs ?? []).map((d) => (d as { id: string }).id))
let written = 0, skipped = 0, failed = 0
for (const t of TEXTBOOK_THEOREMS) {
  const body = { key: t.key, lean: t.lean, says: t.says, examples: t.examples, accepted: THEOREM_KEYS.has(t.key) }
  const id = uuidOf(JSON.stringify({ kind: 'document', from: 'theorems', body }))
  if (have.has(id)) { skipped++; continue }
  const r = await mcp.call('createEntries', { tenant: own.id, kind: 'document', from: 'theorems', body })
  if (r.error !== undefined || !/```json/.test(r.text)) failed++; else written++
}
console.log(`theorems-raid: ${TEXTBOOK_THEOREMS.length} textbook theorems under tenant ${own.id}: ${written} written, ${skipped} already present, ${failed} refused`)
