// The flow toolbox: what `npm run next` used to do in scripts, as tools. Each is two-phase and pure: called without answers
// it says what to fetch; called with answers it reads them into data and a page. The client between the phases is thin and
// host-agnostic: it fetches what it is told, asks the doors discovery found, and writes what comes back. Any flow tool
// called with selftest runs the toolbox's cross-test.
import { toolOf, type Toolbox, type Context } from '../toolbox.js'
import { discoveryRequestsOf, followUpsOf, discoveryOf, discoveryPageOf, type Answer, type Discovery } from '../discovery.js'
import { waveRequestsOf, waveOf, wavePageOf, type WaveResult } from '../wave.js'
import { pagesOf, judgeOf, sourcesOf, borderPlanOf, borderOf, readinessPageOf, type BorderAnswer, type UnitAnswers } from '../readiness.js'
import { imagineOf, imaginePageOf } from '../imagine.js'
import { flowSelftestOf } from '../selftest.js'
import { matcherOf } from '../match.js'
import { VERIFIERS } from '../verifiers.js'
import { flowWidget } from '../widgets.js'

const BLOCK_IDS = new WeakMap<readonly unknown[], { example: string; id: string | undefined }[]>()
/** The content address of every example's block, computed once per examples registry (a readiness call must not replay the examples). */
const blockIdsOf = (ctx: Context) => { const found = BLOCK_IDS.get(ctx.examples); if (found) return found; const ids = ctx.examples.filter((e) => e.tool !== 'audit' && !['readiness', 'imagine', 'discover', 'wave'].includes(e.tool)).map((e) => { const r = ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: e.tool, arguments: e.arguments } }); return { example: e.id, id: r.result?._meta?.block?.meta?.id as string | undefined } }).filter((x) => x.id); BLOCK_IDS.set(ctx.examples, ids); return ids }
const DEFAULT_MCP_HOSTS = ['https://uuidna.com/mcp', 'https://qpu.uuidna.com/mcp']
const selftestOr = <T>(args: Record<string, unknown>, ctx: Context, f: () => T): T | { selftest: true; passed: boolean; checks: unknown[] } => (args.selftest ? { selftest: true, ...flowSelftestOf(ctx.handle, ctx.examples, ctx.leads) } : f())
const SELFTEST = { selftest: { type: 'boolean', description: 'run the flow toolbox\'s cross-test instead: every direction, every toolbox feeding the next' } }

const discover = toolOf('flow', {
  name: 'discover',
  description: 'Discovery before use. Without answers: every request the client must make for the contracts of the hosts this tree talks to (MCP tools/list and catalogue doors, the verifiers\' OpenAPI, index or identify documents, /.well-known/qpu.json). With answers: the follow-ups still to fetch (catalogue doors whose contract is unread) and, once none remain, the discovery: hosts, doors with what they take and answer, capabilities by which clients choose doors, and the leads (hosts with no machine contract). Pure; the client fetches.',
  inputSchema: { type: 'object', properties: { mcpHosts: { type: 'array', items: { type: 'string' }, description: 'MCP endpoints to ask; default the unit and this tree\'s own' }, answers: { type: 'array', items: { type: 'object' }, description: 'the requests answered: each request as emitted plus status, type and text' }, ...SELFTEST } },
  run: (args, ctx) => selftestOr(args, ctx, () => {
    const hosts = Array.isArray(args.mcpHosts) ? args.mcpHosts.map(String) : DEFAULT_MCP_HOSTS
    if (!Array.isArray(args.answers)) { const requests = discoveryRequestsOf(hosts, VERIFIERS); return { phase: 'requests' as const, requests: requests.length, requestList: requests } }
    const answers = args.answers as Answer[]
    const followUps = followUpsOf(answers)
    if (followUps.length) return { phase: 'follow-ups' as const, requests: followUps.length, requestList: followUps }
    const discovery = discoveryOf(answers, VERIFIERS)
    return { phase: 'discovery' as const, hosts: discovery.hosts.length, doors: discovery.doors.length, statementVerdict: discovery.capabilities.statementVerdict.length, leads: discovery.leads.length, discovery, page: discoveryPageOf(discovery, new Date().toISOString()) }
  }),
  widget: flowWidget,
})

const wave = toolOf('flow', {
  name: 'wave',
  description: 'The verification wave. Without results: every request the surface\'s leads and tree facts need, once per URL with the leads it serves. With results (each request plus status, ok, ms and the body text): what came back read into one-line notes, a check of each request against the OpenAPI contract its host published (from discovery), and a summary by verifier. Pure; the client fetches.',
  inputSchema: { type: 'object', properties: { results: { type: 'array', items: { type: 'object' } }, contracts: { type: 'object', description: 'host → OpenAPI path templates, from the discovery' }, leads: { type: 'array', items: { type: 'string' }, description: 'lead ids to restrict the wave to; default all' }, ...SELFTEST } },
  run: (args, ctx) => selftestOr(args, ctx, () => {
    const chosen = Array.isArray(args.leads) ? ctx.leads.filter((l) => (args.leads as string[]).includes(l.id)) : ctx.leads
    if (!Array.isArray(args.results)) { const requests = waveRequestsOf(chosen); return { phase: 'requests' as const, leads: chosen.length, requests: requests.length, requestList: requests } }
    const w = waveOf(args.results as WaveResult[], (args.contracts ?? {}) as Record<string, string[]>)
    return { phase: 'results' as const, leads: chosen.length, requests: w.results.length, reachable: w.reachable, summary: w.summary, results: w.results, page: wavePageOf(w, chosen.length, new Date().toISOString(), Object.keys((args.contracts ?? {}) as object).length > 0) }
  }),
  widget: flowWidget,
})

const readiness = toolOf('flow', {
  name: 'readiness',
  description: 'The unit judges the tree. Phase one (verification, discovery, present, ledger): every lead judged by measurement into served, refuted or trial; the sources as the unit\'s readiness door takes them; the border plan — every discovered door that takes a statement and answers a verdict, with a hand-written theorem filled in; and the unit plan, the calls the client makes. Phase two (plus border answers and unit answers): the border read, and the page. Pure; the client asks the unit.',
  inputSchema: { type: 'object', properties: { verification: { type: 'object', description: 'the wave tool\'s results phase' }, discovery: { type: 'object', description: 'the discover tool\'s discovery phase' }, present: { type: 'array', items: { type: 'string' }, description: 'cleanup subjects the client measured as present (paths or branches)' }, ledger: { type: 'array', items: { type: 'object' }, description: 'theorem rows {key, statement} from the theorem ledger' }, probeKey: { type: 'string', description: 'the hand-written theorem offered at the border; default clay_sigma' }, border: { type: 'array', items: { type: 'object' }, description: 'phase two: the border calls answered ({door, host, arguments, answer | refusal})' }, unit: { type: 'object', description: 'phase two: the unit\'s answers (readiness, auras, rights, address)' }, ...SELFTEST } },
  run: (args, ctx) => selftestOr(args, ctx, () => {
    const verification = args.verification as { date?: string; results?: WaveResult[] } | undefined
    const discovery = (args.discovery as (Discovery & { date?: string }) | undefined) ?? null
    const present = new Set(Array.isArray(args.present) ? args.present.map(String) : [])
    const probeKey = typeof args.probeKey === 'string' ? args.probeKey : 'clay_sigma'
    const probeRow = (Array.isArray(args.ledger) ? (args.ledger as { key: string; statement: string }[]) : []).find((r) => r.key === probeKey)
    const probe = { key: probeKey, statement: probeRow?.statement ?? null }
    const match = matcherOf(ctx.handle, ctx.examples, ctx.leads)
    const pages = pagesOf(verification?.results ?? [])
    const judged = ctx.leads.map((l) => judgeOf(l, pages, present, match, verification?.date ?? null))
    const classes = { served: judged.filter((x) => x.class === 'served').length, refuted: judged.filter((x) => x.class === 'refuted').length, trial: judged.filter((x) => x.class === 'trial').length }
    const sources = sourcesOf(judged, ctx.leads)
    const plan = borderPlanOf(discovery, probe)
    const auraSubjects = blockIdsOf(ctx)
    const unitPlan = [{ name: 'check_release_readiness', arguments: { sources } }, { name: 'get_rights', arguments: {} }, { name: 'compute_address', arguments: { value: 'qpu' } }, { name: 'get_vortex_reflection', arguments: {} }, { name: 'get_triad', arguments: {} }, { name: 'compute_double_torus', arguments: { addresses: auraSubjects.map((a) => a.id) } }, ...((ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'clay', arguments: { technique: 'reflection' } } }) as { result?: { structuredContent: { unitPlan: { name: string; arguments: Record<string, unknown> }[] } } }).result?.structuredContent.unitPlan ?? []), ...auraSubjects.map((a) => ({ name: 'compute_aura', arguments: { subject: a.id }, example: a.example }))]
    const base = { probe, judged, classes, sources, borderPlan: plan.calls, unfillable: plan.unfillable, unitPlan, leads: ctx.leads.length }
    if (!Array.isArray(args.border) || !args.unit) return { phase: 'plan' as const, served: classes.served, refuted: classes.refuted, trial: classes.trial, borderCalls: plan.calls.length, unitCalls: unitPlan.length, ...base }
    const border = [...borderOf(args.border as BorderAnswer[]), ...plan.unfillable]
    const sealedBy = border.filter((b) => b.sealed).map((b) => b.door)
    const answers = args.unit as UnitAnswers
    const date = new Date().toISOString()
    return { phase: 'judged' as const, served: classes.served, refuted: classes.refuted, trial: classes.trial, ready: answers.readiness.ready, sealedBy: sealedBy.length, ...base, border, sealedByDoors: sealedBy, page: readinessPageOf({ unit: typeof args.unitUrl === 'string' ? args.unitUrl : 'https://uuidna.com/mcp', date, measured: verification?.date ?? null, discovered: discovery?.date ?? null, probe, judged, classes, sources, border, sealedBy, answers }) }
  }),
  widget: flowWidget,
})

const imagine = toolOf('flow', {
  name: 'imagine',
  description: 'Imagination leads all leads: every lead (or the subset named) matched with the reflection on — hidden factors, angles, mirror queries, cluster, verification requests — every reflection that finds something a new open lead, every untried enum value of every schema a lead, every application family an adaptor to build. Pure.',
  inputSchema: { type: 'object', properties: { leads: { type: 'array', items: { type: 'string' }, description: 'lead ids to imagine; default all' }, statements: { type: 'array', items: { type: 'object' }, description: 'ad-hoc statements {id, statement} to imagine instead: the rest of the leads from any text' }, ...SELFTEST } },
  run: (args, ctx) => selftestOr(args, ctx, () => {
    const started = Date.now()
    const im = imagineOf(ctx.handle, ctx.examples, ctx.leads, Array.isArray(args.leads) ? args.leads.map(String) : undefined, Array.isArray(args.statements) ? (args.statements as { id: string; statement: string }[]) : undefined)
    return { leads: im.leads, served: im.verdicts.served ?? 0, impossible: im.verdicts.impossible ?? 0, unknown: im.verdicts.unknown ?? 0, verifyRequests: im.verifyRequests, imaginedLeads: im.imaginedLeads, ms: Date.now() - started, imagination: im, page: imaginePageOf(im, new Date().toISOString(), Date.now() - started) }
  }),
  widget: flowWidget,
})

export const FLOW: Toolbox = {
  name: 'flow',
  idea: 'the run of the tree as tools: discover the hosts, verify the leads, let the unit judge, imagine the next leads; the client only fetches and writes',
  tools: [discover, wave, readiness, imagine],
  examples: [
    { id: 'discover-requests', tool: 'discover', arguments: { mcpHosts: ['https://uuidna.com/mcp'] }, shows: 'Phase one of discovery: the requests a client makes for every contract — the unit\'s tools/list, its catalogue door, its well-known file, and the verifiers\' contract documents.', expect: (s) => (s.phase === 'requests' && s.requests >= 3 + VERIFIERS.filter((v) => v.contract).length ? null : `${s.phase}, ${s.requests} requests`) },
    { id: 'wave-requests', tool: 'wave', arguments: { leads: ['willow-spec', 'repo-cirq'] }, shows: 'Phase one of the wave: the requests two leads need, once per URL, each naming the leads it serves.', expect: (s) => (s.phase === 'requests' && s.leads === 2 && s.requests > 0 && s.requestList.every((r: { leads: string[] }) => r.leads.length > 0) ? null : `${s.phase}, ${s.requests} requests for ${s.leads} leads`) },
    { id: 'readiness-plan', tool: 'readiness', arguments: {}, shows: 'Phase one of readiness without measurements: every lead judged (served by its tool, refuted by declaration, or in trial), the sources for the unit, an empty border plan because nothing was discovered, and the unit plan.', expect: (s) => (s.phase === 'plan' && s.served + s.refuted + s.trial === s.leads && s.borderCalls === 0 && s.unitCalls >= 3 ? null : `${s.phase}: ${s.served}+${s.refuted}+${s.trial} of ${s.leads}, ${s.borderCalls} border calls`) },
    { id: 'imagine-two', tool: 'imagine', arguments: { leads: ['willow-spec', 'learn'] }, shows: 'Two leads imagined: one served by the processor tool, one blocked (a 404), plus the leads every schema and application family open.', expect: (s) => (s.leads === 2 && s.served + s.impossible + s.unknown === 2 && s.imaginedLeads > 0 ? null : `${s.leads} leads, ${s.served}/${s.impossible}/${s.unknown}, ${s.imaginedLeads} imagined`) },
  ],
  skill: {
    instructions: 'Use the flow toolbox in phases. discover: call once for the request list, fetch every request as given (POST bodies verbatim), call again with the answers until the phase is "discovery"; write discovery.json and the page. wave: call for the request list, fetch each URL once (pace per host), call again with status, ok, ms and the body text, plus the contracts from the discovery; write verification.json and the page. readiness: call with the verification, the discovery, the cleanup subjects you measured present and the theorem ledger; make the border calls and the unit calls it returns, against the MCP hosts; call again with their answers; write readiness.json and the page. imagine: call once; write imagination.json and the page. Before a live run, call any flow tool with selftest and record the result; a failed check is a lead, never a stop.',
    directions: ['server only: each tool on fixtures', 'server → client: every request a tool emits is one the client can answer', 'client → server: answers read back into data and pages', 'toolbox → toolbox: discovery feeds wave and readiness, wave feeds readiness, match feeds imagine and the judge'],
    selftest: (ctx) => flowSelftestOf(ctx.handle, ctx.examples, ctx.leads),
  },
}
