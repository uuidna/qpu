// `npm run audit`: the MCP surface audits itself and exits non-zero on any failed check.
import { handle } from '../src/quantum/mcp.ts'

const reply = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'audit', arguments: {} } })
if (!('result' in reply)) { console.error(reply.error); process.exit(2) }
const a = reply.result.structuredContent as { total: number; passed: number; failed: number; tools: number; examples: number; leads: number; checks: { id: string; passed: boolean; evidence: string }[] }
for (const c of a.checks) console.log(`${c.passed ? '✓' : '✗'} ${c.id} — ${c.evidence}`)
console.log(`\n${a.passed}/${a.total} checks pass over ${a.tools} tools, ${a.examples} examples, ${a.leads} leads`)
process.exit(a.failed === 0 ? 0 : 1)
