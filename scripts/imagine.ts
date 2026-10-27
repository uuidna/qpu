// The client of the imagine tool: fast when clean (the imagination is a function of the leads, the examples and the tools),
// otherwise one call, and the files written. Selftest first. Pure computation; no network.
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import './teleport.ts'
import { handle, toolCallerOf, cellOf as cell } from '../src/quantum/mcp.ts'
import { EXAMPLES } from '../src/quantum/examples.ts'
import { LEADS } from '../src/quantum/leads.ts'
import { LICENSE } from '../src/quantum/license.ts'
import { uuidOf } from '../src/quantum/blocks.ts'
import { isShard, isMerge, shareOf, leaveShard, gatherShards, shardLabel } from './shard.ts'
import { readJson } from './mcp.ts'

const ROOT = process.cwd()
mkdirSync(join(ROOT, '.qpu', 'cache'), { recursive: true })
const call = toolCallerOf('imagine')
const toolsNow = handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' })
const inputs = uuidOf(JSON.stringify({ leads: LEADS, examples: EXAMPLES.map((e) => ({ id: e.id, tool: e.tool, arguments: e.arguments, shows: e.shows })), tools: toolsNow, writer: readFileSync(import.meta.filename, 'utf8') }))
const outPath = join(ROOT, 'docs', 'public', 'imagination.json')
try { const prev = JSON.parse(readFileSync(outPath, 'utf8')) as { inputs?: string; imaginedLeads?: number; leads?: number; partial?: boolean }; if (prev.inputs === inputs && !prev.partial) { console.log(`imagine: ${prev.leads} leads unchanged (inputs ${inputs}); ${prev.imaginedLeads} imagined leads stand`); process.exit(0) } } catch { /* re-imagine */ }
const selftest = call({ selftest: true })
console.log(`imagine selftest: ${selftest.passed ? 'pass' : 'FAIL'} (${selftest.checks.filter((c: { passed: boolean }) => c.passed).length}/${selftest.checks.length})`)
// the quantum: every lead imagined once per (statement, tools), kept by its own hash; a run imagines only the new hashes, in
// chunks, for no longer than the quantum; the rest wait for the next run, said so in the file
const QUANTUM_MS = Number(process.env.QPU_QUANTUM_MS ?? 180_000)
const started = Date.now()
const rowsPath = join(ROOT, '.qpu', 'cache', 'imagination-rows.json')
type Kept = { hash: string; row: unknown; opened: unknown[]; verify: number; verdict: string }
const kept: Record<string, Kept> = readJson(rowsPath, {})
const toolsHash = uuidOf(JSON.stringify(toolsNow))
const hashOf = (l: { id: string; statement: string; status: string }) => uuidOf(`${l.id}${l.statement}${l.status}${toolsHash}`)
if (isMerge) Object.assign(kept, gatherShards<Record<string, Kept>>('imagine', {}))
const todo = shareOf(LEADS.filter((l) => kept[l.id]?.hash !== hashOf(l)))
console.log(`imagine (${shardLabel()})`)
console.log(`imagine: ${todo.length} of ${LEADS.length} leads to imagine, quantum ${QUANTUM_MS / 1000} s`)
let done = 0
// chunks of ten: the hand-written leads at the head are heavy (every integer reflected, every mirror query matched), so the quantum is checked often
for (let i = 0; i < todo.length && Date.now() - started < QUANTUM_MS; i += 10) {
  const chunk = todo.slice(i, i + 10)
  const r = call({ leads: chunk.map((l) => l.id) })
  for (const row of r.imagination.rows as { lead: string; verdict: string; verify: number }[]) { const l = chunk.find((x) => x.id === row.lead)!; kept[l.id] = { hash: hashOf(l), row, opened: (r.imagination.imagined as { source: string }[]).filter((x) => x.source === `reflection of lead ${l.id}`), verify: row.verify, verdict: row.verdict } }
  done += chunk.length
  if (!isShard) writeFileSync(rowsPath, JSON.stringify(kept) + '\n')
  if (done % 100 === 0) console.log(`imagine: ${done} imagined, ${((Date.now() - started) / 1000).toFixed(1)} s`)
}
const remaining = todo.length - done
if (isShard) { const mine: Record<string, Kept> = {}; for (const l of todo.slice(0, done)) if (kept[l.id]) mine[l.id] = kept[l.id]!; leaveShard('imagine', mine); console.log(`imagine: ${shardLabel()} imagined ${done}, ${remaining} remain`); process.exit(0) }
// the whole imagination from what is kept: every lead's row and the leads it opened, plus the schema and application leads (cheap, always)
const schema = call({ leads: [] })
const rows = LEADS.map((l) => kept[l.id]?.row).filter(Boolean) as { verdict: string; verify: number }[]
const verdicts: Record<string, number> = { served: 0, impossible: 0, unknown: 0 }; for (const r of rows) verdicts[r.verdict] = (verdicts[r.verdict] ?? 0) + 1
const imagined = new Map<string, unknown>(); for (const l of LEADS) for (const o of kept[l.id]?.opened ?? []) { const id = (o as { id: string }).id; if (!imagined.has(id)) imagined.set(id, o) }
for (const o of schema.imagination.imagined as { id: string }[]) if (!imagined.has(o.id)) imagined.set(o.id, o)
const date = new Date().toISOString()
const out = { license: LICENSE.attribution, inputs, date, ms: Date.now() - started, partial: remaining > 0, remaining, imaginedThisRun: done, selftest: { passed: selftest.passed }, leads: rows.length, verdicts, verifyRequests: rows.reduce((n, r) => n + r.verify, 0), imaginedLeads: imagined.size, rows, imagined: [...imagined.values()] }
writeFileSync(outPath, JSON.stringify(out) + '\n')
const page = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'imagine', arguments: { leads: [] } } }) as any
writeFileSync(join(ROOT, 'docs', 'imagination.md'), ['---', 'title: Imagination', 'order: 54', '---', '', '# Imagination leads all leads', '', `Generated by \`npm run next\` on ${date} through the \`imagine\` tool, lead by lead in quanta: ${rows.length} of ${LEADS.length} leads imagined and kept by their own hash${remaining ? `, ${remaining} waiting for the next quantum` : ''}; ${done} imagined in this run (${(out.ms / 1000).toFixed(1)} s).`, '', '| Verdict | Leads |', '|---|---:|', ...Object.entries(verdicts).map(([v, n]) => `| ${v} | ${n} |`), `| verification requests emitted | ${out.verifyRequests} |`, `| leads imagined (new, open) | ${imagined.size} |`, '', '## Imagined leads', '', '| Lead | Statement | From |', '|---|---|---|', ...[...imagined.values()].map((l: any) => `| ${l.id} | ${cell(l.statement)} | ${cell(l.source)} |`), '', '## Every lead, imagined', '', '| Lead | Status | Verdict | Tool | Cluster | Verify | Factors | Angles | Mirrors | Opened |', '|---|---|---|---|---:|---:|---:|---:|---:|---:|', ...rows.map((r: any) => `| ${r.lead} | ${r.status} | ${r.verdict} | ${r.tool ?? '—'} | ${r.cluster} | ${r.verify} | ${r.factors} | ${r.angles} | ${r.queries} | ${r.opened} |`), ''].join('\n'))
void page
console.log(`imagine: ${rows.length} of ${LEADS.length} leads kept, ${done} imagined this run in ${((Date.now() - started) / 1000).toFixed(1)} s${remaining ? `, ${remaining} remain for the next quantum` : ''} — ${JSON.stringify(verdicts)}, ${out.verifyRequests} verify requests, ${imagined.size} imagined leads`)
