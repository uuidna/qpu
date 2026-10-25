// Imagination leads all leads: every lead's statement is matched with the reflection on, so each lead gets its hidden
// factors, its angles against the bounds, its mirror queries, its cluster of served possibilities and its verification
// requests; every reflection that finds something becomes a new open lead. Pure computation; no network.
import { writeFileSync, existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { handle } from '../src/quantum/mcp.ts'
import { EXAMPLES } from '../src/quantum/examples.ts'
import { LEADS, type Lead } from '../src/quantum/leads.ts'
import { matcherOf } from '../src/quantum/match.ts'
import { LICENSE } from '../src/quantum/license.ts'
import { uuidOf } from '../src/quantum/blocks.ts'
import { VERIFIERS } from '../src/quantum/verifiers.ts'

const ROOT = process.cwd()
// Fast when clean: the imagination is a function of the leads, the examples and the tools; the same inputs give the same output.
const toolsNow = handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' })
const inputs = uuidOf(JSON.stringify({ leads: LEADS, examples: EXAMPLES.map((e) => ({ id: e.id, tool: e.tool, arguments: e.arguments, shows: e.shows })), tools: toolsNow }))
const outPath = join(ROOT, 'docs', 'public', 'imagination.json')
if (existsSync(outPath)) {
  try { const prev = JSON.parse(readFileSync(outPath, 'utf8')) as { inputs?: string; imaginedLeads?: number; leads?: number }; if (prev.inputs === inputs) { console.log(`imagine: ${prev.leads} leads unchanged (inputs ${inputs}); ${prev.imaginedLeads} imagined leads stand`); process.exit(0) } } catch { /* re-imagine */ }
}
const match = matcherOf(handle, EXAMPLES, LEADS)
const started = Date.now()
const verdicts: Record<string, number> = { served: 0, impossible: 0, unknown: 0 }
const rows: { lead: string; status: string; verdict: string; tool?: string; cluster: number; verify: number; factors: number; angles: number; queries: number; opened: number }[] = []
const imagined = new Map<string, Lead>()
let verifyTotal = 0
for (const l of LEADS) {
  const m = match(l.statement)
  verdicts[m.verdict] = (verdicts[m.verdict] ?? 0) + 1
  verifyTotal += m.verify.length
  for (const r of m.reflection.leads) if (!imagined.has(r.id)) imagined.set(r.id, { ...r, source: `reflection of lead ${l.id}` })
  rows.push({ lead: l.id, status: l.status, verdict: m.verdict, tool: m.tool, cluster: m.cluster.length, verify: m.verify.length, factors: m.reflection.factors.filter((f) => f.factors).length, angles: m.reflection.angles.length, queries: m.reflection.queries.length, opened: m.reflection.leads.length })
}
// Leads from every schema: an enum value no example exercises is an untried door.
const list = handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) as { result: { tools: { name: string; inputSchema: { properties?: Record<string, { enum?: unknown[] }> } }[] } }
const exercised = new Set(EXAMPLES.flatMap((e) => Object.entries(e.arguments).map(([k, v]) => `${e.tool}.${k}=${JSON.stringify(v)}`)))
for (const t of list.result.tools) for (const [prop, spec] of Object.entries(t.inputSchema.properties ?? {})) for (const v of spec.enum ?? []) {
  const key = `${t.name}.${prop}=${JSON.stringify(v)}`
  if (!exercised.has(key)) { const id = `schema-${t.name}-${prop}-${String(v)}`.toLowerCase().replace(/[^a-z0-9-]+/g, '-'); if (!imagined.has(id)) imagined.set(id, { id, source: `tools/list ${t.name}.${prop}`, statement: `${t.name} accepts ${prop} = ${JSON.stringify(v)} and no documented example exercises it`, status: 'open', tool: t.name, reason: 'an untried door of the schema; add the example and its expectation, or remove the value' }) }
}
// Leads from every application: a device or program is an adaptor that writes entries of one schema and answers to one verifier.
const APPLICATIONS: { family: string; entry: string; verifier: string }[] = [
  { family: 'IoT sensing', entry: '{ kind: "reading", from: device, body: { quantity, unit, value, at } }', verifier: 'source-page or nist-codata for the reference value' },
  { family: 'IoT actuation', entry: '{ kind: "command", from: controller, body: { target, action, at } } and the device\'s { kind: "ack" }', verifier: 'the ack entry linked to the command' },
  { family: 'lab instruments', entry: '{ kind: "measurement", from: instrument, body: { observable, value, uncertainty } }', verifier: 'nist-codata, oeis for integer counts' },
  { family: 'phones and kiosks', entry: 'the block a human device renders (widget, Open Graph, shadcn item)', verifier: 'the audit\'s widget and licence checks' },
  { family: 'assistive devices', entry: 'the same block, read aloud or in braille from its HTML structure', verifier: 'an accessibility audit of the widgets' },
  { family: 'energy meters', entry: '{ kind: "reading", from: meter, body: { kWh, at } }', verifier: 'the grid operator\'s public interval data where published' },
  { family: 'vehicles', entry: '{ kind: "reading", from: vehicle, body: { position, speed, at } }', verifier: 'a public map or transit feed' },
  { family: 'wearables', entry: '{ kind: "reading", from: wearable, body: { heartRate, at } } under the wearer\'s consent', verifier: 'no public verifier: the wearer is the witness' },
  { family: 'education kits', entry: '{ kind: "result", from: kit, body: { exercise, answer } } (the Qubit Game is a lead already)', verifier: 'the surface\'s own tools recompute the exercise' },
  { family: 'other MCP servers', entry: '{ kind: "reply", from: host, body: the tools/call result }', verifier: 'the host\'s own receipt; the unit\'s fan-out names the hosts' },
]
for (const a of APPLICATIONS) { const id = `application-${a.family}`.toLowerCase().replace(/[^a-z0-9-]+/g, '-'); if (!imagined.has(id)) imagined.set(id, { id, source: 'the docket contract', statement: `${a.family}: an adaptor that writes ${a.entry}; verified by ${a.verifier}`, status: 'open', reason: 'the docket accepts the entry today; the adaptor, its schema and its verifier are the lead' }) }
const verifierKinds = new Set(VERIFIERS.flatMap((v) => v.verifies))
for (const kind of ['reading', 'command', 'ack', 'measurement', 'result', 'reply']) if (!verifierKinds.has(kind as never)) { const id = `fact-kind-${kind}`; if (!imagined.has(id)) imagined.set(id, { id, source: 'src/quantum/verifiers.ts', statement: `no verifier registers the fact kind "${kind}" that the application leads would write`, status: 'open', reason: 'register the kind and its free verifier with the first adaptor' }) }

const date = new Date().toISOString()
const out = { license: LICENSE.attribution, inputs, date, ms: Date.now() - started, leads: LEADS.length, verdicts, verifyRequests: verifyTotal, imaginedLeads: imagined.size, rows, imagined: [...imagined.values()] }
writeFileSync(outPath, JSON.stringify(out) + '\n')
const page = ['---', 'title: Imagination', 'order: 54', '---', '', '# Imagination leads all leads', '',
  `Generated by \`npm run next\` on ${date} in ${(out.ms / 1000).toFixed(1)} s: every one of the ${LEADS.length} leads matched with the reflection on.`, '',
  '| Verdict | Leads |', '|---|---:|', ...Object.entries(verdicts).map(([v, n]) => `| ${v} | ${n} |`), `| verification requests emitted | ${verifyTotal} |`, `| leads imagined (new, open) | ${imagined.size} |`, '',
  '## Imagined leads', '', '| Lead | Statement | From |', '|---|---|---|', ...[...imagined.values()].map((l) => `| ${l.id} | ${l.statement.replace(/\|/g, '\\|').slice(0, 160)} | ${l.source.replace(/\|/g, '\\|')} |`), '',
  '## Every lead, imagined', '', '| Lead | Status | Verdict | Tool | Cluster | Verify | Factors | Angles | Mirrors | Opened |', '|---|---|---|---|---:|---:|---:|---:|---:|---:|',
  ...rows.map((r) => `| ${r.lead} | ${r.status} | ${r.verdict} | ${r.tool ?? '—'} | ${r.cluster} | ${r.verify} | ${r.factors} | ${r.angles} | ${r.queries} | ${r.opened} |`), ''].join('\n')
writeFileSync(join(ROOT, 'docs', 'imagination.md'), page)
console.log(`imagine: ${LEADS.length} leads in ${(out.ms / 1000).toFixed(1)} s — ${JSON.stringify(verdicts)}, ${verifyTotal} verify requests, ${imagined.size} imagined leads`)
