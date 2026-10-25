// Imagination as a pure toolbox: every lead's statement matched with the reflection on, so each lead gets its hidden factors,
// its angles, its mirror queries, its cluster and its verification requests; every reflection that finds something is a new
// open lead; every enum value no example exercises is an untried door; every application family is an adaptor to build.
import type { Example } from './examples.js'
import type { Lead } from './leads.js'
import type { Rpc } from './audit.js'
import { matcherOf } from './match.js'
import { VERIFIERS } from './verifiers.js'

export type ImagineRow = { lead: string; status: string; verdict: string; tool?: string; cluster: number; verify: number; factors: number; angles: number; queries: number; opened: number }
export type Imagination = { leads: number; verdicts: Record<string, number>; verifyRequests: number; imaginedLeads: number; rows: ImagineRow[]; imagined: Lead[] }

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

/** Every lead (or the subset named) imagined. Pure; the matcher is built once. */
export const imagineOf = (handle: (m: Rpc) => any, examples: readonly Example[], leads: readonly Lead[], subset?: readonly string[]): Imagination => {
  const match = matcherOf(handle, examples, leads)
  const chosen = subset ? leads.filter((l) => subset.includes(l.id)) : leads
  const verdicts: Record<string, number> = { served: 0, impossible: 0, unknown: 0 }
  const rows: ImagineRow[] = []
  const imagined = new Map<string, Lead>()
  let verifyTotal = 0
  for (const l of chosen) {
    const m = match(l.statement)
    verdicts[m.verdict] = (verdicts[m.verdict] ?? 0) + 1
    verifyTotal += m.verify.length
    for (const r of m.reflection.leads) if (!imagined.has(r.id)) imagined.set(r.id, { ...r, source: `reflection of lead ${l.id}` })
    rows.push({ lead: l.id, status: l.status, verdict: m.verdict, tool: m.tool, cluster: m.cluster.length, verify: m.verify.length, factors: m.reflection.factors.filter((f) => f.factors).length, angles: m.reflection.angles.length, queries: m.reflection.queries.length, opened: m.reflection.leads.length })
  }
  const list = handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) as { result: { tools: { name: string; inputSchema: { properties?: Record<string, { enum?: unknown[] }> } }[] } }
  const exercised = new Set(examples.flatMap((e) => Object.entries(e.arguments).map(([k, v]) => `${e.tool}.${k}=${JSON.stringify(v)}`)))
  for (const t of list.result.tools) for (const [prop, spec] of Object.entries(t.inputSchema.properties ?? {})) for (const v of spec.enum ?? []) {
    const key = `${t.name}.${prop}=${JSON.stringify(v)}`
    if (!exercised.has(key)) { const id = `schema-${t.name}-${prop}-${String(v)}`.toLowerCase().replace(/[^a-z0-9-]+/g, '-'); if (!imagined.has(id)) imagined.set(id, { id, source: `tools/list ${t.name}.${prop}`, statement: `${t.name} accepts ${prop} = ${JSON.stringify(v)} and no documented example exercises it`, status: 'open', tool: t.name, reason: 'an untried door of the schema; add the example and its expectation, or remove the value' }) }
  }
  for (const a of APPLICATIONS) { const id = `application-${a.family}`.toLowerCase().replace(/[^a-z0-9-]+/g, '-'); if (!imagined.has(id)) imagined.set(id, { id, source: 'the docket contract', statement: `${a.family}: an adaptor that writes ${a.entry}; verified by ${a.verifier}`, status: 'open', reason: 'the docket accepts the entry today; the adaptor, its schema and its verifier are the lead' }) }
  const verifierKinds = new Set(VERIFIERS.flatMap((v) => v.verifies as readonly string[]))
  for (const kind of ['reading', 'command', 'ack', 'measurement', 'result', 'reply']) if (!verifierKinds.has(kind)) { const id = `fact-kind-${kind}`; if (!imagined.has(id)) imagined.set(id, { id, source: 'src/quantum/verifiers.ts', statement: `no verifier registers the fact kind "${kind}" that the application leads would write`, status: 'open', reason: 'register the kind and its free verifier with the first adaptor' }) }
  return { leads: chosen.length, verdicts, verifyRequests: verifyTotal, imaginedLeads: imagined.size, rows, imagined: [...imagined.values()] }
}

export const imaginePageOf = (im: Imagination, date: string, ms: number): string => ['---', 'title: Imagination', 'order: 54', '---', '', '# Imagination leads all leads', '',
  `Generated by \`npm run next\` on ${date} in ${(ms / 1000).toFixed(1)} s through the \`imagine\` tool: every one of the ${im.leads} leads matched with the reflection on.`, '',
  '| Verdict | Leads |', '|---|---:|', ...Object.entries(im.verdicts).map(([v, n]) => `| ${v} | ${n} |`), `| verification requests emitted | ${im.verifyRequests} |`, `| leads imagined (new, open) | ${im.imaginedLeads} |`, '',
  '## Imagined leads', '', '| Lead | Statement | From |', '|---|---|---|', ...im.imagined.map((l) => `| ${l.id} | ${l.statement.replace(/\|/g, '\\|').slice(0, 160)} | ${l.source.replace(/\|/g, '\\|')} |`), '',
  '## Every lead, imagined', '', '| Lead | Status | Verdict | Tool | Cluster | Verify | Factors | Angles | Mirrors | Opened |', '|---|---|---|---|---:|---:|---:|---:|---:|---:|',
  ...im.rows.map((r) => `| ${r.lead} | ${r.status} | ${r.verdict} | ${r.tool ?? '—'} | ${r.cluster} | ${r.verify} | ${r.factors} | ${r.angles} | ${r.queries} | ${r.opened} |`), ''].join('\n')
