// `npm run audit`: the MCP surface audits itself and exits non-zero on any failed check.
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { createHash } from 'node:crypto'
import './teleport.ts'
import { handle } from '../src/quantum/mcp.ts'
import { mcpOf } from './mcp.ts'

// integers first: the ledger of the last confirmed integers is the newest docket entry from audit-integers, read through the Payload MCP;
// unread (no key, no app), nothing is known and every example is confirmed by text; the run's ledger is written back as a docket entry
const mcp = mcpOf()
// the newest ledger only: one page of one entry, never every earlier ledger walked
const page = await mcp.call('findEntries', { where: JSON.stringify({ from: { equals: 'audit-integers' } }), sort: '-createdAt', limit: 1, page: 1 })
const read = page.error !== undefined ? { docs: null, says: `unread: ${page.error}` } : { docs: mcp.docsOf(page.text), says: 'read' }
const newest = (read.docs ?? [])[0] as { body?: { integers?: Record<string, string> } } | undefined
const known: Record<string, string> = newest?.body?.integers ?? {}
const t0 = performance.now()
const files = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap((f) => (f.isDirectory() ? (f.name === '.lake' || f.name === 'node_modules' ? [] : files(join(dir, f.name))) : /\.(ts|lean)$/.test(f.name) ? [join(dir, f.name)] : []))
const code = createHash('sha256').update([...files('src/quantum'), 'src/worker.ts'].sort().map((f) => `${f}\n${readFileSync(f, 'utf8')}`).join('\n')).digest('hex')
const reply = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'audit', arguments: { known, code } } })
if (!('result' in reply)) { console.error(reply.error); process.exit(2) }
const a = reply.result.structuredContent as { total: number; passed: number; failed: number; tools: number; examples: number; leads: number; checks: { id: string; passed: boolean; evidence: string }[]; integers: Record<string, string>; decided: { byInteger: number; byText: number } }
const ms = Math.round(performance.now() - t0)
for (const c of a.checks) console.log(`${c.passed ? '✓' : '✗'} ${c.id} — ${c.evidence}`)
const wrote = read.docs ? await mcp.call('createEntries', { kind: 'document', from: 'audit-integers', body: { integers: a.integers } }) : { error: read.says }
console.log(`examples sealed under the code ${(a.decided as { bySeal?: number }).bySeal ?? 0}, decided by integers ${a.decided.byInteger}, confirmed by text ${a.decided.byText}; ${ms} ms; ledger ${read.docs ? `read (${Object.keys(known).length} known)` : read.says}, ${wrote.error === undefined ? 'written to the docket' : `not written: ${wrote.error.slice(0, 120)}`}`)
console.log(`\n${a.passed}/${a.total} checks pass over ${a.tools} tools, ${a.examples} examples, ${a.leads} leads`)
process.exit(a.failed === 0 ? 0 : 1)
