// The client of the imagine tool: fast when clean (the imagination is a function of the leads, the examples and the tools),
// otherwise one call, and the files written. Selftest first. Pure computation; no network.
import { writeFileSync, existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { handle } from '../src/quantum/mcp.ts'
import { EXAMPLES } from '../src/quantum/examples.ts'
import { LEADS } from '../src/quantum/leads.ts'
import { LICENSE } from '../src/quantum/license.ts'
import { uuidOf } from '../src/quantum/blocks.ts'

const ROOT = process.cwd()
const call = (args: Record<string, unknown>): any => { const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'imagine', arguments: args } }) as any; if (r.error) throw new Error(r.error.message); return r.result.structuredContent }
const toolsNow = handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' })
const inputs = uuidOf(JSON.stringify({ leads: LEADS, examples: EXAMPLES.map((e) => ({ id: e.id, tool: e.tool, arguments: e.arguments, shows: e.shows })), tools: toolsNow }))
const outPath = join(ROOT, 'docs', 'public', 'imagination.json')
if (existsSync(outPath)) {
  try { const prev = JSON.parse(readFileSync(outPath, 'utf8')) as { inputs?: string; imaginedLeads?: number; leads?: number }; if (prev.inputs === inputs) { console.log(`imagine: ${prev.leads} leads unchanged (inputs ${inputs}); ${prev.imaginedLeads} imagined leads stand`); process.exit(0) } } catch { /* re-imagine */ }
}
const selftest = call({ selftest: true })
console.log(`imagine selftest: ${selftest.passed ? 'pass' : 'FAIL'} (${selftest.checks.filter((c: { passed: boolean }) => c.passed).length}/${selftest.checks.length})`)
const r = call({})
const date = new Date().toISOString()
writeFileSync(outPath, JSON.stringify({ license: LICENSE.attribution, inputs, date, ms: r.ms, selftest: { passed: selftest.passed }, leads: r.imagination.leads, verdicts: r.imagination.verdicts, verifyRequests: r.verifyRequests, imaginedLeads: r.imaginedLeads, rows: r.imagination.rows, imagined: r.imagination.imagined }) + '\n')
writeFileSync(join(ROOT, 'docs', 'imagination.md'), r.page)
console.log(`imagine: ${r.leads} leads in ${(r.ms / 1000).toFixed(1)} s — served ${r.served}, impossible ${r.impossible}, unknown ${r.unknown}, ${r.verifyRequests} verify requests, ${r.imaginedLeads} imagined leads`)
