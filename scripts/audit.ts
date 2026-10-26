// `npm run audit`: the MCP surface audits itself and exits non-zero on any failed check.
import './teleport.ts'
import { handle } from '../src/quantum/mcp.ts'
import { payloadMcpOf } from './payload-mcp.ts'

// integers first: the ledger of the last confirmed integers is the newest docket entry from audit-integers, read through the Payload MCP;
// unread (no key, no app), nothing is known and every example is confirmed by text; the run's ledger is written back as a docket entry
const mcp = payloadMcpOf()
const read = await mcp.findAll('findEntries', { where: JSON.stringify({ from: { equals: 'audit-integers' } }), sort: '-createdAt', limit: 1 })
const newest = (read.docs ?? [])[0] as { body?: { integers?: Record<string, string> } } | undefined
const known: Record<string, string> = newest?.body?.integers ?? {}
const t0 = performance.now()
const reply = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'audit', arguments: { known } } })
if (!('result' in reply)) { console.error(reply.error); process.exit(2) }
const a = reply.result.structuredContent as { total: number; passed: number; failed: number; tools: number; examples: number; leads: number; checks: { id: string; passed: boolean; evidence: string }[]; integers: Record<string, string>; decided: { byInteger: number; byText: number } }
const ms = Math.round(performance.now() - t0)
for (const c of a.checks) console.log(`${c.passed ? '✓' : '✗'} ${c.id} — ${c.evidence}`)
const wrote = read.docs ? await mcp.call('createEntries', { kind: 'document', from: 'audit-integers', body: { integers: a.integers } }) : { error: read.says }
console.log(`examples decided by integers ${a.decided.byInteger}, confirmed by text ${a.decided.byText}; ${ms} ms; ledger ${read.docs ? `read (${Object.keys(known).length} known)` : read.says}, ${wrote.error === undefined ? 'written to the docket' : `not written: ${wrote.error.slice(0, 120)}`}`)
console.log(`\n${a.passed}/${a.total} checks pass over ${a.tools} tools, ${a.examples} examples, ${a.leads} leads`)
process.exit(a.failed === 0 ? 0 : 1)
