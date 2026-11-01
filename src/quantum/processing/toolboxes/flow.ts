// The flow toolbox: what `npm run next` used to do in scripts, as tools. Each is two-phase and pure: called without answers
// it says what to fetch; called with answers it reads them into data and a page. The client between the phases is thin and
// host-agnostic: it fetches what it is told, asks the doors discovery found, and writes what comes back. Any flow tool
// called with selftest runs the toolbox's cross-test.
import { getInteger, writeInteger } from '../algorithms.ts'
import { defineTool, type Toolbox, type Context } from '../toolbox.ts'
import { createDiscoveryRequests, listFollowUps, getDiscovery, getDiscoveryPage, DEFAULT_MCP_HOSTS, UNIT_MCP, QPU_MCP, createRegistryRequests, listRelatedServers, type Answer, type Discovery } from '../discovery.ts'
import { createWaveRequests, getWave, getWavePage, type WaveResult } from '../wave.ts'
import { indexPages, judgeLead, listSources, planBorder, getBorder, getReadinessPage, type BorderAnswer, type UnitAnswers } from '../readiness.ts'
import { imagineLeads, getImaginePage } from '../imagine.ts'
import { runFlowSelftest } from '../selftest.ts'
import { createMatcher } from '../match.ts'
import { VERIFIERS } from '../verifiers.ts'
import { flowWidget } from '../widgets.ts'
import { createE2eRequests, decodeE2e, getE2ePage, type E2eAnswer } from '../e2e.ts'
import { TENANTS } from '../unit/tenants.ts'

const BLOCK_IDS = new WeakMap<readonly unknown[], { example: string; id: string | undefined }[]>()
/** The content address of every example's block, computed once per examples registry (a readiness call must not replay the examples). */
const listBlockIds = (ctx: Context) => { const found = BLOCK_IDS.get(ctx.examples); if (found) return found; const ids = ctx.examples.filter((e) => e.tool !== 'audit' && !['readiness', 'imagine', 'discover', 'wave'].includes(e.tool)).map((e) => { const r = ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: e.tool, arguments: e.arguments } }); return { example: e.id, id: r.result?._meta?.block?.meta?.id as string | undefined } }).filter((x) => x.id); BLOCK_IDS.set(ctx.examples, ids); return ids }
const selftestOr = <T>(args: Record<string, unknown>, ctx: Context, f: () => T): T | { selftest: true; passed: boolean; checks: unknown[] } => (args.selftest ? { selftest: true, ...runFlowSelftest(ctx.handle, ctx.examples, ctx.leads) } : f())
const SELFTEST = { selftest: { type: 'boolean', description: 'run the flow toolbox\'s cross-test instead: every direction, every toolbox feeding the next' } }

const discover = defineTool('flow', {
  name: 'discover',
  description: 'Discovery before use. Without answers: every request the client must make for the contracts of the hosts this tree talks to (MCP tools/list and catalogue doors, the verifiers\' OpenAPI, index or identify documents, /.well-known/qpu.json). With answers: the follow-ups still to fetch (catalogue doors whose contract is unread) and, once none remain, the discovery: hosts, doors with what they take and answer, capabilities by which clients choose doors, and the leads (hosts with no machine contract). Pure; the client fetches.',
  inputSchema: { type: 'object', properties: { lead: { type: 'string', description: 'a lead id: its words are asked of the public MCP registry first; with answers, the related servers and their extend requests' }, statement: { type: 'string', description: 'with lead: the statement of a lead not in the registry' }, mcpHosts: { type: 'array', items: { type: 'string' }, description: 'MCP endpoints to ask; default the unit, this tree\'s own and Cloudflare\'s eight servers; a tenant names its own' }, auth: { type: 'object', description: 'host → bearer token, the tenant\'s own: forwarded as the authorization header of the requests emitted, never kept' }, answers: { type: 'array', items: { type: 'object' }, description: 'the requests answered: each request as emitted plus status, type and text' }, ...SELFTEST } },
  run: (args, ctx) => selftestOr(args, ctx, () => {
    // leads first: a lead's words asked of the public MCP registry before any guess; with the registry's answers, the servers related to it and the request that extends each through this catalogue
    if (typeof args.lead === 'string') {
      const lead = ctx.leads.find((l) => l.id === args.lead) ?? (typeof args.statement === 'string' ? { id: args.lead, statement: args.statement } : null)
      if (!lead) throw new Error(`no lead ${args.lead}; give statement to ask for a lead not in the registry`)
      if (!Array.isArray(args.answers)) { const requests = createRegistryRequests(lead); return { phase: 'registry' as const, lead: lead.id, words: [...new Set(requests.filter((r) => r.accept === 'application/json').map((r) => r.word))], directories: [...new Set(requests.map((r) => r.directory))], requests: requests.length, requestList: requests, note: 'the client fetches each (GET, public, no token) and calls again with answers: the related servers and the tools/list request that extends each through qpu' } }
      const related = listRelatedServers(lead.id, args.answers as { id: string; word?: string; status: number; text: string }[])
      return { phase: 'related' as const, ...related, servers: related.servers.length, serverList: related.servers, extendRequests: related.extend.length, extendList: related.extend, leads: related.servers.length ? [] : [{ id: `no-related-mcp-${lead.id}`, statement: `no MCP in the public registry answers the words of lead ${lead.id} (${createRegistryRequests(lead).map((r) => r.word).join(', ')})`, status: 'open', reason: 'the lead is served by this tree alone until a server appears in the registry; the words are asked again on every run' }] }
    }
    const hosts = Array.isArray(args.mcpHosts) ? args.mcpHosts.map(String) : DEFAULT_MCP_HOSTS
    if (!Array.isArray(args.answers)) { const requests = createDiscoveryRequests(hosts, VERIFIERS, (args.auth && typeof args.auth === 'object' ? args.auth : {}) as Record<string, string>); return { phase: 'requests' as const, requests: requests.length, requestList: requests } }
    const answers = args.answers as Answer[]
    const followUps = listFollowUps(answers)
    if (followUps.length) return { phase: 'follow-ups' as const, requests: followUps.length, requestList: followUps }
    const discovery = getDiscovery(answers, VERIFIERS)
    return { phase: 'discovery' as const, hosts: discovery.hosts.length, doors: discovery.doors.length, statementVerdict: discovery.capabilities.statementVerdict.length, leads: discovery.leads.length, discovery, page: getDiscoveryPage(discovery, new Date().toISOString()) }
  }),
  widget: flowWidget,
})

const e2e = defineTool('flow', {
  name: 'e2e',
  description: 'The end-to-end gate as a repetition code. Without answers: every combination the dashboards lay out and every example of the textbook, as one tools/call request per host (default the tenants\' hosts and the operator\'s), each carrying the hash of the tree\'s own answer. With answers (each request plus status, ms, text): every combination decoded by majority over the tree and the hosts — agree, corrected (a flipped host, named by the syndrome), erased (a host that did not answer), uncorrectable (no majority) — the physical and logical error rates against the textbook 3-copy code, every error a UUID block for the stream, and the leads. Pure; the client fetches.',
  inputSchema: { type: 'object', properties: { hosts: { type: 'array', items: { type: 'string' }, description: 'MCP endpoints to call; default https://<tenant host>/mcp for every tenant and the operator\'s workers.dev' }, tools: { type: 'array', items: { type: 'string' }, description: 'only these tools\' combinations; default every tool' }, answers: { type: 'array', items: { type: 'object' } }, ...SELFTEST } },
  run: (args, ctx) => selftestOr(args, ctx, () => {
    const hosts = Array.isArray(args.hosts) ? args.hosts.map(String) : [...Object.keys(TENANTS).map((h) => `https://${h}/mcp`), 'https://qpu.ceci.workers.dev/mcp']
    if (!Array.isArray(args.answers)) { const requests = createE2eRequests(ctx, hosts, Array.isArray(args.tools) ? args.tools.map(String) : undefined); return { phase: 'requests' as const, hosts, combos: new Set(requests.map((r) => r.combo)).size, requests: requests.length, requestList: requests } }
    const r = decodeE2e(args.answers as E2eAnswer[])
    return { phase: 'decoded' as const, hosts, ...r, page: getE2ePage(r, new Date().toISOString(), hosts, { remaining: 0 }) }
  }),
  widget: flowWidget,
})

/** The share of a list among n shards: every item whose index mod n is the shard's index; proven to cover the list exactly once by textbook_shards_cover and textbook_shards_disjoint. */
const takeShare = <T>(list: readonly T[], index: number, count: number): T[] => list.filter((_, k) => k % count === index)
const shard = defineTool('flow', {
  name: 'shard',
  description: 'A long single task split into short multitasks: the share of a list among n shards (index, count) is every item whose position mod n is the shard\'s index — the shares cover the list exactly once, proven by the kernel (textbook_shards_cover, textbook_shards_disjoint). The clients of the flow take their share from this door and leave what they settled for the merge; nothing is decided by hand.',
  inputSchema: { type: 'object', properties: { list: { type: 'array', description: 'the items (or their ids)' }, index: { type: 'integer', minimum: 0 }, count: { type: 'integer', minimum: 1 }, ...SELFTEST } },
  run: (args, ctx) => selftestOr(args, ctx, () => {
    const list = Array.isArray(args.list) ? args.list : []
    // any index and count, exactly: a count of 0 is read as 1 (one shard holds the list), an index at or above the count as its residue mod
    // the count, the same shard (textbook_shards_cover); the share is every position the residue names, in BigInt when the count is large
    const asked = { index: getInteger(args.index, 'index', 0n), count: getInteger(args.count, 'count', 1n) }, c = asked.count < 1n ? 1n : asked.count, i = asked.index % c
    const share = c <= BigInt(Number.MAX_SAFE_INTEGER) ? takeShare(list, Number(i), Number(c)) : list.filter((_, p) => BigInt(p) === i)
    const index = writeInteger(i), count = writeInteger(c), reduced = i !== asked.index || c !== asked.count
    return { index, count, ...(reduced ? { asked: { index: writeInteger(asked.index), count: writeInteger(asked.count) }, reduced: 'the index read as its residue mod the count, a count below 1 as 1: the same shard' } : {}), items: list.length, share: share.length, shareList: share, theorems: ['textbook_shards_cover', 'textbook_shards_disjoint'], covers: 'every item in exactly one shard' }
  }),
  widget: flowWidget,
})

const wave = defineTool('flow', {
  name: 'wave',
  description: 'The verification wave. Without results: every request the surface\'s leads and tree facts need, once per URL with the leads it serves. With results (each request plus status, ok, ms and the body text): what came back read into one-line notes, a check of each request against the OpenAPI contract its host published (from discovery), and a summary by verifier. Pure; the client fetches.',
  inputSchema: { type: 'object', properties: { results: { type: 'array', items: { type: 'object' } }, contracts: { type: 'object', description: 'host → OpenAPI path templates, from the discovery' }, leads: { type: 'array', items: { type: 'string' }, description: 'lead ids to restrict the wave to; default all' }, ...SELFTEST } },
  run: (args, ctx) => selftestOr(args, ctx, () => {
    const chosen = Array.isArray(args.leads) ? ctx.leads.filter((l) => (args.leads as string[]).includes(l.id)) : ctx.leads
    if (!Array.isArray(args.results)) { const requests = createWaveRequests(chosen); return { phase: 'requests' as const, leads: chosen.length, requests: requests.length, requestList: requests } }
    const w = getWave(args.results as WaveResult[], (args.contracts ?? {}) as Record<string, string[]>)
    return { phase: 'results' as const, leads: chosen.length, requests: w.results.length, reachable: w.reachable, summary: w.summary, results: w.results, page: getWavePage(w, chosen.length, new Date().toISOString(), Object.keys((args.contracts ?? {}) as object).length > 0) }
  }),
  widget: flowWidget,
})

const readiness = defineTool('flow', {
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
    const match = createMatcher(ctx.handle, ctx.examples, ctx.leads)
    const pages = indexPages(verification?.results ?? [])
    const judged = ctx.leads.map((l) => judgeLead(l, pages, present, match, verification?.date ?? null))
    const classes = { served: judged.filter((x) => x.class === 'served').length, refuted: judged.filter((x) => x.class === 'refuted').length, trial: judged.filter((x) => x.class === 'trial').length }
    const sources = listSources(judged, ctx.leads)
    const plan = planBorder(discovery, probe)
    const auraSubjects = listBlockIds(ctx)
    const unitPlan = [{ name: 'check_release_readiness', arguments: { sources } }, { name: 'get_rights', arguments: {} }, { name: 'compute_address', arguments: { value: 'qpu' } }, { name: 'get_vortex_reflection', arguments: {} }, { name: 'get_triad', arguments: {} }, { name: 'compute_double_torus', arguments: { addresses: auraSubjects.map((a) => a.id) } }, ...((ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'clay', arguments: { technique: 'reflection' } } }) as { result?: { structuredContent: { unitPlan: { name: string; arguments: Record<string, unknown> }[] } } }).result?.structuredContent.unitPlan ?? []), ...auraSubjects.map((a) => ({ name: 'compute_aura', arguments: { subject: a.id }, example: a.example }))]
    const base = { probe, judged, classes, sources, borderPlan: plan.calls, unfillable: plan.unfillable, unitPlan, leads: ctx.leads.length }
    if (!Array.isArray(args.border) || !args.unit) return { phase: 'plan' as const, served: classes.served, refuted: classes.refuted, trial: classes.trial, borderCalls: plan.calls.length, unitCalls: unitPlan.length, ...base }
    const border = [...getBorder(args.border as BorderAnswer[]), ...plan.unfillable]
    const sealedBy = border.filter((b) => b.sealed).map((b) => b.door)
    const answers = args.unit as UnitAnswers
    const date = new Date().toISOString()
    return { phase: 'judged' as const, served: classes.served, refuted: classes.refuted, trial: classes.trial, ready: answers.readiness.ready, sealedBy: sealedBy.length, ...base, border, sealedByDoors: sealedBy, page: getReadinessPage({ unit: typeof args.unitUrl === 'string' ? args.unitUrl : UNIT_MCP, date, measured: verification?.date ?? null, discovered: discovery?.date ?? null, probe, judged, classes, sources, border, sealedBy, answers }) }
  }),
  widget: flowWidget,
})

const imagine = defineTool('flow', {
  name: 'imagine',
  description: 'Imagination leads all leads: every lead (or the subset named) matched with the reflection on — hidden factors, angles, mirror queries, cluster, verification requests — every reflection that finds something a new open lead, every untried enum value of every schema a lead, every application family an adaptor to build. Pure.',
  inputSchema: { type: 'object', properties: { leads: { type: 'array', items: { type: 'string' }, description: 'lead ids to imagine; default all' }, statements: { type: 'array', items: { type: 'object' }, description: 'ad-hoc statements {id, statement} to imagine instead: the rest of the leads from any text' }, ...SELFTEST } },
  run: (args, ctx) => selftestOr(args, ctx, () => {
    const started = Date.now()
    const im = imagineLeads(ctx.handle, ctx.examples, ctx.leads, Array.isArray(args.leads) ? args.leads.map(String) : undefined, Array.isArray(args.statements) ? (args.statements as { id: string; statement: string }[]) : undefined)
    return { leads: im.leads, served: im.verdicts.served ?? 0, impossible: im.verdicts.impossible ?? 0, unknown: im.verdicts.unknown ?? 0, verifyRequests: im.verifyRequests, imaginedLeads: im.imaginedLeads, ms: Date.now() - started, imagination: im, page: getImaginePage(im, new Date().toISOString(), Date.now() - started) }
  }),
  widget: flowWidget,
})

export const FLOW: Toolbox = {
  name: 'flow',
  idea: 'the run of the tree as tools: discover the hosts, verify the leads, let the unit judge, imagine the next leads; the client only fetches and writes',
  tools: [discover, wave, readiness, imagine, e2e, shard],
  examples: [
    { id: 'shard-share', tool: 'shard', theorem: 'textbook_shards_cover', arguments: { list: ['a', 'b', 'c', 'd', 'e', 'f', 'g'], index: 1, count: 4 }, shows: 'The share of seven items for shard 1 of 4: the items at positions 1 and 5; the shares of all four shards cover the seven exactly once, proven by the kernel.', expect: (s) => (s.share === 2 && s.shareList.join() === 'b,f' && s.items === 7 && s.theorems.length === 2 ? null : `${s.share} ${s.shareList}`) },
    { id: 'discover-lead-registry', tool: 'discover', theorem: 'textbook_mcp_directories', arguments: { lead: 'payload-skills-used' }, shows: 'Leads first: a lead\'s distinctive words asked of the public MCP registry (registry.modelcontextprotocol.io) and the directories beside it (Smithery\'s open search, mcpservers.org\'s open sitemaps) before any guess about which MCP serves it; keyed directories named, never asked without their key; the client fetches, and the answers name the related servers and the request that extends each through qpu.', expect: (s) => (s.phase === 'registry' && s.requests >= 1 && ['official', 'smithery', 'mcpservers.org'].every((d) => s.requestList.some((r: { directory: string }) => r.directory === d)) ? null : `${s.phase} ${s.requests}`) },
    { id: 'discover-requests', tool: 'discover', arguments: { mcpHosts: [UNIT_MCP] }, shows: 'Phase one of discovery: the requests a client makes for every contract — the unit\'s tools/list, its catalogue door, its well-known file, and the verifiers\' contract documents.', expect: (s) => (s.phase === 'requests' && s.requests >= 3 + VERIFIERS.filter((v) => v.contract).length ? null : `${s.phase}, ${s.requests} requests`) },
    { id: 'wave-requests', tool: 'wave', arguments: { leads: ['willow-spec', 'repo-cirq'] }, shows: 'Phase one of the wave: the requests two leads need, once per URL, each naming the leads it serves.', expect: (s) => (s.phase === 'requests' && s.leads === 2 && s.requests > 0 && s.requestList.every((r: { leads: string[] }) => r.leads.length > 0) ? null : `${s.phase}, ${s.requests} requests for ${s.leads} leads`) },
    { id: 'readiness-plan', tool: 'readiness', arguments: {}, shows: 'Phase one of readiness without measurements: every lead judged (served by its tool, refuted by declaration, or in trial), the sources for the unit, an empty border plan because nothing was discovered, and the unit plan.', expect: (s) => (s.phase === 'plan' && s.served + s.refuted + s.trial === s.leads && s.borderCalls === 0 && s.unitCalls >= 3 ? null : `${s.phase}: ${s.served}+${s.refuted}+${s.trial} of ${s.leads}, ${s.borderCalls} border calls`) },
    { id: 'e2e-requests', tool: 'e2e', arguments: { hosts: [QPU_MCP], tools: ['clay', 'processor', 'roadmap'] }, shows: 'Phase one of the end-to-end gate for three tools: every dashboard cell and every example of theirs as a tools/call request to one host, each carrying the hash of the tree\'s own answer; without tools, every tool\'s.', expect: (s) => (s.phase === 'requests' && s.combos >= 10 && s.requests === s.combos && s.requestList.every((r: { local: string; method: string }) => r.method === 'POST' && /^[0-9a-f-]{36}$/.test(r.local)) ? null : `${s.phase} ${s.combos} ${s.requests}`) },
    { id: 'imagine-two', tool: 'imagine', arguments: { leads: ['willow-spec', 'learn'] }, shows: 'Two leads imagined: one served by the processor tool, one blocked (a 404), plus the leads every schema and application family open.', expect: (s) => (s.leads === 2 && s.served + s.impossible + s.unknown === 2 && s.imaginedLeads > 0 ? null : `${s.leads} leads, ${s.served}/${s.impossible}/${s.unknown}, ${s.imaginedLeads} imagined`) },
  ],
  skill: {
    instructions: 'Use the flow toolbox in phases. discover: call once for the request list, fetch every request as given (POST bodies verbatim), call again with the answers until the phase is "discovery"; write discovery.json and the page. wave: call for the request list, fetch each URL once (pace per host), call again with status, ok, ms and the body text, plus the contracts from the discovery; write verification.json and the page. readiness: call with the verification, the discovery, the cleanup subjects you measured present and the theorem ledger; make the border calls and the unit calls it returns, against the MCP hosts; call again with their answers; write readiness.json and the page. imagine: call once; write imagination.json and the page. Before a live run, call any flow tool with selftest and record the result; a failed check is a lead, never a stop.',
    directions: ['server only: each tool on fixtures', 'server → client: every request a tool emits is one the client can answer', 'client → server: answers read back into data and pages', 'toolbox → toolbox: discovery feeds wave and readiness, wave feeds readiness, match feeds imagine and the judge'],
    selftest: (ctx) => runFlowSelftest(ctx.handle, ctx.examples, ctx.leads),
  },
}
