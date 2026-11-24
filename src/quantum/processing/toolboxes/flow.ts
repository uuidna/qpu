// The flow toolbox: what `npm run next` used to do in scripts, as tools. Each is two-phase and pure: called without answers
// it says what to fetch; called with answers it reads them into data and a page. The client between the phases is thin and
// host-agnostic: it fetches what it is told, asks the doors discovery found, and writes what comes back. Any flow tool
// called with selftest runs the toolbox's cross-test.
import { CLAY_RELATIONS } from '../clay-statements.ts'
import { PROSE, proseFill } from '../prose-index.ts'
import { getInteger, writeInteger } from '../algorithms.ts'
import { defineTool, isObj, type Toolbox, type Context } from '../toolbox.ts'
import { createDiscoveryRequests, leadDecode, listFollowUps, getDiscovery, getDiscoveryPage, textbookUpgrade, DEFAULT_MCP_HOSTS, UNIT_MCP, QPU_MCP, createRegistryRequests, listRelatedServers, createSearchRequest, listRegistryServers, type Answer, type Discovery } from '../discovery.ts'
import { createWaveRequests, getWave, getWavePage, type WaveResult } from '../wave.ts'
import { followWave, processPhysics } from '../lead-wave.ts'
import { indexPages, judgeLead, listSources, planBorder, getBorder, getReadinessPage, type BorderAnswer, type UnitAnswers } from '../readiness.ts'
import { imagineLeads, getImaginePage, claySession, allAsUuid, integerLlm, imagineClayNext, imagineNilGame } from '../imagine.ts'
import { block, canonicalText, seal, uuid } from '../../uuid/index.ts'
import { runFlowSelftest } from '../selftest.ts'
import { createMatcher } from '../match.ts'
import { VERIFIERS } from '../verifiers.ts'
import { flowWidget } from '../widgets.ts'
import { createE2eRequests, decodeE2e, getE2ePage, tree, type E2eAnswer } from '../e2e.ts'
import { standardsSeeds } from '../standards-e2e.ts'
import { TENANTS } from '../unit/tenants.ts'
import { clock, stamp } from '../../uuid/programs/clock/index.ts'
import { callEnvelope } from '../toolbox.ts'
import { coordinate, usageReport } from '../agents.ts'

const BLOCK_IDS = new WeakMap<readonly unknown[], { example: string; id: string | undefined }[]>()
/** Every example's block address, once per examples registry: the core's pure function of tool and arguments, no replay. */
const listBlockIds = (ctx: Context) => { const found = BLOCK_IDS.get(ctx.examples); if (found) return found; const ids = ctx.examples.filter((e) => e.tool !== 'audit' && !['readiness', 'imagine', 'discover', 'wave'].includes(e.tool)).map((e) => ({ example: e.id, id: block(e.tool, e.arguments, null, '', '').id })); BLOCK_IDS.set(ctx.examples, ids); return ids }
const SELFTEST = { selftest: { type: 'boolean', description: PROSE.quantumProcessingToolboxesFlow_description1 } }

const discover = defineTool('flow', {
  name: 'discover',
  description: PROSE.quantumProcessingToolboxesFlow_description2,
  inputSchema: { type: 'object', properties: { search: { type: 'object', description: '{ query, limit? }: the words a user types, asked of the official MCP registry online (one public GET, the limit within the registry\'s page of one hundred); with answers, the servers found, each installable one naming its install door, extend { install }' }, lead: { type: 'string', description: PROSE.quantumProcessingToolboxesFlow_description3 }, statement: { type: 'string', description: PROSE.quantumProcessingToolboxesFlow_description4 }, mcpHosts: { type: 'array', items: { type: 'string' }, description: PROSE.quantumProcessingToolboxesFlow_description5 }, auth: { type: 'object', description: PROSE.quantumProcessingToolboxesFlow_description6 }, answers: { type: 'array', items: { type: 'object' }, description: PROSE.quantumProcessingToolboxesFlow_description7 }, ...SELFTEST } },
  run: (args, ctx) => {
    // a search typed by a user: the registry asked online by those words, then its answer read into servers, each installable one with its install door
    if (isObj(args.search)) {
      const s = args.search as { query?: unknown; limit?: unknown }
      const request = createSearchRequest(String(s.query ?? ''), typeof s.limit === 'number' ? s.limit : 10)
      if (!Array.isArray(args.answers)) return { phase: 'search' as const, query: request.query, limit: request.limit, requests: 1, requestList: [request], theorem: 'textbook_mcp_search_limit', note: PROSE.quantumProcessingToolboxesFlow_note8 }
      const read = listRegistryServers(args.answers as { status: number; text: string }[])
      return { phase: 'servers' as const, query: request.query, limit: request.limit, ...read, servers: read.servers.length, serverList: read.servers, theorem: 'textbook_mcp_search_limit', says: proseFill(PROSE.quantumProcessingToolboxesFlow_says9, read.servers.length, request.query, read.installable) }
    }
    // leads first: a lead's words asked of the public MCP registry before any guess; with the registry's answers, the servers related to it and the request that extends each through this catalogue
    if (typeof args.lead === 'string') {
      const lead = ctx.leads.find((l) => l.id === args.lead) ?? (typeof args.statement === 'string' ? { id: args.lead, statement: args.statement } : null)
      if (!lead) throw new Error(proseFill(PROSE.quantumProcessingToolboxesFlow_s10, args.lead))
      if (!Array.isArray(args.answers)) { const requests = createRegistryRequests(lead); return { phase: 'registry' as const, lead: lead.id, words: [...new Set(requests.filter((r) => r.accept === 'application/json').map((r) => r.word))], directories: [...new Set(requests.map((r) => r.directory))], requests: requests.length, requestList: requests, note: PROSE.quantumProcessingToolboxesFlow_note11 } }
      const related = listRelatedServers(lead.id, args.answers as { id: string; word?: string; status: number; text: string }[])
      return { phase: 'related' as const, ...related, servers: related.servers.length, serverList: related.servers, extendRequests: related.extend.length, extendList: related.extend, leads: related.servers.length ? [] : [{ id: `no-related-mcp-${lead.id}`, statement: proseFill(PROSE.quantumProcessingToolboxesFlow_statement12, lead.id, createRegistryRequests(lead).map((r) => r.word).join(', ')), status: 'open', reason: PROSE.quantumProcessingToolboxesFlow_reason13 }] }
    }
    const hosts = Array.isArray(args.mcpHosts) ? args.mcpHosts.map(String) : DEFAULT_MCP_HOSTS
    if (!Array.isArray(args.answers)) { const requests = createDiscoveryRequests(hosts, VERIFIERS, (args.auth && typeof args.auth === 'object' ? args.auth : {}) as Record<string, string>); const lead = leadDecode(); const upgrade = textbookUpgrade(); return { phase: 'requests' as const, lead, upgrade, requests: requests.length, requestList: requests, says: lead.advantage ? proseFill(PROSE.quantumProcessingToolboxesFlow_s14, lead.searched, upgrade.kernel, upgrade.awaiting, upgrade.uncovered, upgrade.novelties) : PROSE.quantumProcessingToolboxesFlow_s15 } }
    const answers = args.answers as Answer[]
    const followUps = listFollowUps(answers)
    if (followUps.length) return { phase: 'follow-ups' as const, requests: followUps.length, requestList: followUps }
    const discovery = getDiscovery(answers, VERIFIERS)
    return { phase: 'discovery' as const, hosts: discovery.hosts.length, doors: discovery.doors.length, statementVerdict: discovery.capabilities.statementVerdict.length, leads: discovery.leads.length, discovery, page: getDiscoveryPage(discovery, stamp()) }
  },
  widget: flowWidget,
})

const e2e = defineTool('flow', {
  name: 'e2e',
  description: PROSE.quantumProcessingToolboxesFlow_description16,
  inputSchema: { type: 'object', properties: { standards: { type: 'boolean', description: PROSE.quantumProcessingToolboxesFlow_description17 }, hosts: { type: 'array', items: { type: 'string' }, description: PROSE.quantumProcessingToolboxesFlow_description18 }, tools: { type: 'array', items: { type: 'string' }, description: PROSE.quantumProcessingToolboxesFlow_description19 }, answers: { type: 'array', items: { type: 'object' } }, ...SELFTEST } },
  run: (args, ctx) => {
    if (args.standards === true) return standardsSeeds() as never
    const hosts = Array.isArray(args.hosts) ? args.hosts.map(String) : [...Object.keys(TENANTS).map((h) => `https://${h}/api/mcp`), 'https://qpu.ceci.workers.dev/api/mcp']
    if (!Array.isArray(args.answers)) { const requests = createE2eRequests(ctx, hosts, Array.isArray(args.tools) ? args.tools.map(String) : undefined); return { phase: 'requests' as const, hosts, combos: new Set(requests.map((r) => r.combo)).size, requests: requests.length, requestList: requests } }
    const r = decodeE2e(args.answers as E2eAnswer[], tree(ctx))
    return { phase: 'decoded' as const, hosts, ...r, ...r.outcomes, page: getE2ePage(r, stamp(), hosts, { remaining: 0 }) }
  },
  widget: flowWidget,
})

/** The share of a list among n shards: every item whose index mod n is the shard's index; proven to cover the list exactly once by textbook_shards_cover and textbook_shards_disjoint. */
const takeShare = <T>(list: readonly T[], index: number, count: number): T[] => list.filter((_, k) => k % count === index)
const shard = defineTool('flow', {
  name: 'shard',
  description: PROSE.quantumProcessingToolboxesFlow_description20,
  inputSchema: { type: 'object', properties: { list: { type: 'array', description: 'the items (or their ids)' }, index: { type: 'integer', minimum: 0 }, count: { type: 'integer', minimum: 1 }, agents: { type: 'integer', minimum: 1, description: PROSE.quantumProcessingAgents_agents }, secret: { type: 'string', description: PROSE.quantumProcessingAgents_secret }, usage: { type: 'object', description: PROSE.quantumProcessingAgents_usage }, ...SELFTEST } },
  run: (args, ctx) => {
    const list = Array.isArray(args.list) ? args.list : []
    if (isObj(args.usage)) return usageReport((args.usage as { calls?: unknown }).calls) as never
    if (args.agents !== undefined) return coordinate(list, args.agents, args.secret) as never
    // any index and count, exactly: a count of 0 is read as 1 (one shard holds the list), an index at or above the count as its residue mod
    // the count, the same shard (textbook_shards_cover); the share is every position the residue names, in BigInt when the count is large
    const asked = { index: getInteger(args.index, 'index', 0n), count: getInteger(args.count, 'count', 1n) }, c = asked.count < 1n ? 1n : asked.count, i = asked.index % c
    const share = c <= BigInt(Number.MAX_SAFE_INTEGER) ? takeShare(list, Number(i), Number(c)) : list.filter((_, p) => BigInt(p) === i)
    const index = writeInteger(i), count = writeInteger(c), reduced = i !== asked.index || c !== asked.count
    return { index, count, ...(reduced ? { asked: { index: writeInteger(asked.index), count: writeInteger(asked.count) }, reduced: PROSE.quantumProcessingToolboxesFlow_reduced21 } : {}), items: list.length, share: share.length, shareList: share, theorems: ['textbook_shards_cover', 'textbook_shards_disjoint'], covers: PROSE.quantumProcessingToolboxesFlow_covers22 }
  },
  widget: flowWidget,
})

const wave = defineTool('flow', {
  name: 'wave',
  description: PROSE.quantumProcessingToolboxesFlow_description23,
  inputSchema: { type: 'object', properties: { results: { type: 'array', items: { type: 'object' } }, contracts: { type: 'object', description: PROSE.quantumProcessingToolboxesFlow_description24 }, leads: { type: 'array', items: { type: 'string' }, description: PROSE.quantumProcessingToolboxesFlow_description25 }, ...SELFTEST } },
  run: (args, ctx) => {
    const chosen = Array.isArray(args.leads) ? ctx.leads.filter((l) => (args.leads as string[]).includes(l.id)) : ctx.leads
    const waveAccount = processPhysics(followWave(chosen.map((lead) => ({ id: lead.id, statement: lead.statement }))))
    if (!Array.isArray(args.results)) { const requests = createWaveRequests(chosen); return { phase: 'requests' as const, leads: chosen.length, requests: requests.length, requestList: requests, hz: waveAccount.hz, follow: waveAccount } }
    const w = getWave(args.results as WaveResult[], (args.contracts ?? {}) as Record<string, string[]>)
    return { phase: 'results' as const, leads: chosen.length, hz: waveAccount.hz, follow: waveAccount, requests: w.results.length, reachable: w.reachable, summary: w.summary, results: w.results, page: getWavePage(w, chosen.length, stamp(), Object.keys((args.contracts ?? {}) as object).length > 0) }
  },
  widget: flowWidget,
})

const readiness = defineTool('flow', {
  name: 'readiness',
  description: PROSE.quantumProcessingToolboxesFlow_description26,
  inputSchema: { type: 'object', properties: { verification: { type: 'object', description: PROSE.quantumProcessingToolboxesFlow_description27 }, discovery: { type: 'object', description: PROSE.quantumProcessingToolboxesFlow_description28 }, present: { type: 'array', items: { type: 'string' }, description: PROSE.quantumProcessingToolboxesFlow_description29 }, ledger: { type: 'array', items: { type: 'object' }, description: 'theorem rows {key, statement} from the theorem ledger' }, probeKey: { type: 'string', description: PROSE.quantumProcessingToolboxesFlow_description30 }, border: { type: 'array', items: { type: 'object' }, description: PROSE.quantumProcessingToolboxesFlow_description31 }, unit: { type: 'object', description: PROSE.quantumProcessingToolboxesFlow_description32 }, ...SELFTEST } },
  run: (args, ctx) => {
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
    const unitPlan = [{ name: 'check_release_readiness', arguments: { sources } }, { name: 'get_rights', arguments: {} }, { name: 'compute_address', arguments: { value: 'qpu' } }, { name: 'get_vortex_reflection', arguments: {} }, { name: 'get_triad', arguments: {} }, { name: 'compute_double_torus', arguments: { addresses: auraSubjects.map((a) => a.id) } }, ...((ctx.handle(callEnvelope('clay', { technique: 'reflection' })) as { result?: { structuredContent: { unitPlan: { name: string; arguments: Record<string, unknown> }[] } } }).result?.structuredContent.unitPlan ?? []), ...auraSubjects.map((a) => ({ name: 'compute_aura', arguments: { subject: a.id }, example: a.example }))]
    const base = { probe, judged, classes, sources, borderPlan: plan.calls, unfillable: plan.unfillable, unitPlan, leads: ctx.leads.length }
    if (!Array.isArray(args.border) || !args.unit) return { phase: 'plan' as const, served: classes.served, refuted: classes.refuted, trial: classes.trial, borderCalls: plan.calls.length, unitCalls: unitPlan.length, ...base }
    const border = [...getBorder(args.border as BorderAnswer[]), ...plan.unfillable]
    const sealedBy = border.filter((b) => b.sealed).map((b) => b.door)
    const answers = args.unit as UnitAnswers
    const date = stamp()
    return { phase: 'judged' as const, served: classes.served, refuted: classes.refuted, trial: classes.trial, ready: answers.readiness.ready, sealedBy: sealedBy.length, ...base, border, sealedByDoors: sealedBy, page: getReadinessPage({ unit: typeof args.unitUrl === 'string' ? args.unitUrl : UNIT_MCP, date, measured: verification?.date ?? null, discovered: discovery?.date ?? null, probe, judged, classes, sources, border, sealedBy, answers }) }
  },
  widget: flowWidget,
})

/** A statement to imagine is a string or { id, statement }: a string is addressed by the UUID of its text, so the same sentence is always the same lead. */
const statementsOf = (raw: unknown): { id: string; statement: string }[] | undefined => {
  if (!Array.isArray(raw)) return undefined
  return raw.map((s, i) => {
    if (typeof s === 'string') return { id: `statement-${uuid(s).slice(0, 8)}`, statement: s }
    if (s && typeof s === 'object' && typeof (s as { statement?: unknown }).statement === 'string') return { id: String((s as { id?: unknown }).id ?? `statement-${uuid((s as { statement: string }).statement).slice(0, 8)}`), statement: (s as { statement: string }).statement }
    throw new Error(proseFill(PROSE.quantumProcessingToolboxesFlow_s33, i))
  })
}
/** open: n takes the first n open leads (of the ids named, else of the tree), the slice a job or a cell imagines in one run. */
const openOf = (open: unknown, leads: readonly { id: string; status: string }[], ids?: string[]): string[] | undefined => {
  if (typeof open !== 'number' || !Number.isInteger(open) || open < 0) return ids
  const pool = ids ? leads.filter((l) => ids.includes(l.id)) : leads
  return pool.filter((l) => l.status === 'open').slice(0, open).map((l) => l.id)
}
const imagine = defineTool('flow', {
  name: 'imagine',
  description: PROSE.quantumProcessingToolboxesFlow_description34,
  inputSchema: { type: 'object', properties: { leads: { type: 'array', items: { type: 'string' }, description: PROSE.quantumProcessingToolboxesFlow_description35 }, all: { type: 'boolean', description: PROSE.quantumProcessingToolboxesFlow_description36 }, next: { type: 'boolean', description: PROSE.quantumProcessingToolboxesFlow_description37 }, game: { type: 'boolean', description: PROSE.quantumProcessingToolboxesFlow_description38 }, open: { type: 'integer', description: PROSE.quantumProcessingToolboxesFlow_description39 }, statements: { type: 'array', items: { type: ['string', 'object'] }, description: PROSE.quantumProcessingToolboxesFlow_description40 }, clay: { description: PROSE.quantumProcessingToolboxesFlow_description42 }, llm: { description: PROSE.quantumProcessingToolboxesFlow_description43 }, ...SELFTEST } },
  run: (args, ctx) => {
    if (args.game === true) return imagineNilGame() as never
    if (args.llm !== undefined) return integerLlm(args.llm === true ? '' : args.llm) as never
    if (args.next === true) { const clay = ctx.call('clay', {}) as { relations?: { name: string; statement: string; holds: boolean; sides: { value: number }[]; theorems: { theorem: string; proof: string }[] }[] }; return imagineClayNext(clay.relations ?? []) as never }
    if (args.all === true) return allAsUuid(ctx.leads)
    if (args.clay === true || isObj(args.clay)) return claySession(ctx.leads, args.clay === true ? true : args.clay as { session?: unknown; microdata?: unknown }) as never
    const started = clock()
    const im = imagineLeads(ctx.handle, ctx.examples, ctx.leads, openOf(args.open, ctx.leads, Array.isArray(args.leads) ? args.leads.map(String) : undefined), statementsOf(args.statements))
    return { leads: im.leads, served: im.verdicts.served ?? 0, impossible: im.verdicts.impossible ?? 0, unknown: im.verdicts.unknown ?? 0, verifyRequests: im.verifyRequests, imaginedLeads: im.imaginedLeads, ms: clock() - started, imagination: im, page: getImaginePage(im, stamp(), clock() - started) }
  },
  widget: flowWidget,
})

export const FLOW: Toolbox = {
  name: 'flow',
  idea: PROSE.quantumProcessingToolboxesFlow_idea44,
  tools: [discover, wave, readiness, imagine, e2e, shard],
  examples: [
    { id: 'wave-requests', tool: 'wave', theorem: 'textbook_wave_requests_by_lead', arguments: { leads: ['willow-spec', 'repo-cirq'] }, shows: PROSE.quantumProcessingToolboxesFlow_shows45, expect: (s) => (s.phase === 'requests' && s.leads === 2 && s.requests > 0 && s.requestList.every((r: { leads: string[] }) => r.leads.length > 0) ? null : `${s.phase}, ${s.requests} requests for ${s.leads} leads`) },
    { id: 'readiness-plan', tool: 'readiness', theorem: 'textbook_readiness_judged', arguments: {}, shows: PROSE.quantumProcessingToolboxesFlow_shows46, expect: (s) => (s.phase === 'plan' && s.served + s.refuted + s.trial === s.leads && s.borderCalls === 0 && s.unitCalls >= 3 ? null : `${s.phase}: ${s.served}+${s.refuted}+${s.trial} of ${s.leads}, ${s.borderCalls} border calls`) },
    { id: 'shard-agents', tool: 'shard', theorem: 'textbook_shards_disjoint', arguments: { list: ['a', 'b', 'c', 'd', 'e', 'f', 'g'], agents: 3 }, shows: PROSE.quantumProcessingAgents_showsAgents, expect: (s) => (s.phase === 'coordinate' && s.covered === true && s.rows.length === 3 && s.rows[1].shareList.join() === 'b,e' && s.largest === 3 && s.smallest === 2 && s.capacity.full === true && !('room' in s) ? null : JSON.stringify(s.rows)) },
    { id: 'shard-agents-room', tool: 'shard', theorem: 'textbook_shards_cover', arguments: { list: ['a', 'b', 'c', 'd', 'e', 'f', 'g'], agents: 3, secret: 'only we know' }, shows: PROSE.quantumProcessingAgents_showsRoom, expect: (s) => (/^[0-9a-f]{64}$/.test(s.room.id) && s.room.names.join() === 'agent-0,agent-1,agent-2' && s.room.tools.join() === 'send,receive' ? null : JSON.stringify(s.room)) },
    { id: 'shard-usage', tool: 'shard', theorem: 'textbook_coins_coils_balanced', arguments: { usage: { calls: [{ tool: 'fold', arguments: { qubits: 4 }, tokens: 500, bytes: 9000, ms: 12 }, { tool: 'fold', arguments: { qubits: 4 }, tokens: 500, bytes: 9000, ms: 12 }] } }, shows: PROSE.quantumProcessingAgents_showsUsage, expect: (s) => (s.phase === 'usage' && s.calls === 2 && s.distinct === 1 && s.again === 1 && s.ledger[0].debit === 12 && s.ledger[0].credit === 12 && s.ledger[1].credit === 9000 && s.kept === false && s.licence.spdx === 'CC-BY-NC-ND-4.0' ? null : JSON.stringify(s.ledger)) },
    { id: 'shard-share', tool: 'shard', theorem: 'textbook_shards_cover', arguments: { list: ['a', 'b', 'c', 'd', 'e', 'f', 'g'], index: 1, count: 4 }, shows: PROSE.quantumProcessingToolboxesFlow_shows47, expect: (s) => (s.share === 2 && s.shareList.join() === 'b,f' && s.items === 7 && s.theorems.length === 2 ? null : `${s.share} ${s.shareList}`) },
    { id: 'discover-lead-registry', tool: 'discover', theorem: 'textbook_mcp_directories', arguments: { lead: 'rbac-standards-as-subjects' }, shows: PROSE.quantumProcessingToolboxesFlow_shows48, expect: (s) => (s.phase === 'registry' && s.requests >= 1 && ['official', 'smithery', 'mcpservers.org'].every((d) => s.requestList.some((r: { directory: string }) => r.directory === d)) ? null : `${s.phase} ${s.requests}`) },
    { id: 'discover-requests', tool: 'discover', theorem: 'textbook_discovery_requests', arguments: { mcpHosts: [UNIT_MCP] }, shows: PROSE.quantumProcessingToolboxesFlow_shows49, expect: (s) => (s.phase === 'requests' && s.requests >= 3 + VERIFIERS.filter((v) => v.contract).length ? null : `${s.phase}, ${s.requests} requests`) },
    { id: 'discover-thousand-bit', tool: 'discover', theorem: 'textbook_impossible_trapdoor', arguments: { mcpHosts: [UNIT_MCP] }, shows: PROSE.quantumProcessingToolboxesFlow_shows50, expect: (s) => (s.phase === 'requests' && s.lead.bits === 1000 && s.lead.seed === 432 && s.lead.decoded === true && s.lead.verified === true && s.lead.route === 'witness' && s.lead.searched === '1' && s.lead.advantage === true && BigInt(s.lead.blind) > 1n && s.upgrade.advantage === true && s.upgrade.awaiting + s.upgrade.uncovered === s.upgrade.kernel && s.upgrade.cited + s.upgrade.novelties === s.upgrade.kernel && s.upgrade.opendata.fetched === false && s.upgrade.nist.fetched === false && s.requestList.some((r: { url: string }) => r.url === 'https://www.iso.org/open-data.html') && s.requestList.some((r: { url: string }) => r.url === 'https://physics.nist.gov/cuu/Constants/Table/allascii.txt') && s.requestList.some((r: { url: string }) => r.url.startsWith('https://opendata.cern.ch/api/records/')) && !('N' in s.lead) && !('p' in s.lead) && !('q' in s.lead) ? null : JSON.stringify({ bits: s.lead?.bits, advantage: s.lead?.advantage, upgrade: s.upgrade })) },
    { id: 'e2e-requests', tool: 'e2e', theorem: 'textbook_e2e_combos', arguments: { hosts: [QPU_MCP], tools: ['clay', 'processor', 'algorithm'] }, shows: PROSE.quantumProcessingToolboxesFlow_shows51, expect: (s) => (s.phase === 'requests' && s.combos >= 10 && s.requests === s.combos && s.requestList.every((r: { local: string; method: string }) => r.method === 'POST' && /^[0-9a-f-]{36}$/.test(r.local)) ? null : `${s.phase} ${s.combos} ${s.requests}`) },
    { id: 'imagine-two', tool: 'imagine', theorem: 'textbook_imagine_verdicts', arguments: { leads: ['willow-spec', 'learn'] }, shows: PROSE.quantumProcessingToolboxesFlow_shows52, expect: (s) => (s.leads === 2 && s.served + s.impossible + s.unknown === 2 && s.imaginedLeads > 0 ? null : `${s.leads} leads, ${s.served}/${s.impossible}/${s.unknown}, ${s.imaginedLeads} imagined`) },
    { id: 'imagine-statement', tool: 'imagine', theorem: 'textbook_uuid_is_36', arguments: { statements: [PROSE.quantumProcessingToolboxesFlow_s53] }, shows: PROSE.quantumProcessingToolboxesFlow_shows54, expect: (s) => ((s.leads === 1 && s.imagination.rows.length === 1 && String(s.imagination.rows[0].lead).startsWith('statement-') && s.imagination.rows[0].lead.length === 'statement-'.length + 8) ? null : PROSE.quantumProcessingToolboxesFlow_s55 + JSON.stringify({ leads: s.leads, rows: s.imagination?.rows?.map((r: { lead: unknown }) => r.lead) })) },
    { id: 'imagine-open', tool: 'imagine', theorem: 'textbook_uuid_is_36', arguments: { open: 1 }, shows: PROSE.quantumProcessingToolboxesFlow_shows56, expect: (s) => ((s.leads === 1 && s.imagination.rows.length === 1 && s.imagination.rows[0].status === 'open') ? null : PROSE.quantumProcessingToolboxesFlow_s57 + JSON.stringify({ leads: s.leads, rows: s.imagination?.rows })) },
    { id: 'imagine-clay-session', tool: 'imagine', theorem: 'textbook_search_proven', arguments: { clay: { session: 's1', microdata: [{ '@type': 'DefinedTerm', name: 'relation_15', identifier: 'clay-relation_15' }] } }, shows: PROSE.quantumProcessingToolboxesFlow_shows58, expect: (s) => (s.phase === 'verified' && s.via === 'client-session' && s.tokenFree === true && s.session === 's1' && s.possible === s.leads && s.collected === 1 && s.verified === 1 && s.open === s.leads - 1 && s.rows.length === s.leads && s.rows.find((r: { id: string }) => r.id === 'clay-relation_15')?.verified === true && s.rows.filter((r: { verified: boolean }) => r.verified).length === 1 ? null : JSON.stringify({ phase: s.phase, verified: s.verified, possible: s.possible, leads: s.leads })) },
    { id: 'imagine-integer-llm', tool: 'imagine', theorem: 'textbook_chat_call_or_question', arguments: { llm: PROSE.quantumProcessingToolboxesFlow_llm60 }, shows: PROSE.quantumProcessingToolboxesFlow_shows61, expect: (s) => (s.phase === 'llm' && s.kind === 'integer-only' && s.prose === false && s.computed === false && s.integers.join() === '72,432' && s.count === 2 && s.decimals[0].written === '1.5' && s.decimals[0].factors.join() === '1,5' && s.factors.join() === '1,5' && !/\d/.test(s.dropped) ? null : JSON.stringify({ integers: s.integers, decimals: s.decimals, dropped: s.dropped })) },
    { id: 'imagine-nil-game', tool: 'imagine', theorem: 'textbook_impossible_trapdoor', arguments: { game: true }, shows: PROSE.quantumProcessingToolboxesFlow_shows62, expect: (s) => (s.phase === 'game' && s.via === 'imagine' && s.computer === 'quantum' && s.holds === true && s.tokens === 0 && s.queue === 0 && s.fetched === false && s.written === false && s.nil === '00000000-0000-0000-0000-000000000000' && s.form === 'nil' && s.zeros === true && s.priority === 0 && s.bits.join() === '0,0,0,0,0,0,0,0' && s.depth === 7 && s.max === 7 && s.folder === 'src/quantum/uuid/programs/0/0/0/0/0/0/0/0' && s.collision.into === s.nil && s.collision.singularity === s.nil && s.collision.programs === 2 && s.involution.key === 432 && s.involution.sigma === '432 - x' && s.involution.forth === '432' && s.involution.back === '0' && s.involution.holds === true && s.example.bits === 1000 && s.example.seed === 432 && s.example.decoded === true && s.example.verified === true && s.example.route === 'witness' && s.example.product === true && s.claim.voice === 'author' && s.claim.author === 'Tsvetan Rouschev' && s.claim.doi === '10.5281/zenodo.21781602' && s.claim.year === 2026 && s.claim.submitted === '2026-08-04' && s.claim.tree === false ? null : JSON.stringify({ holds: s.holds, nil: s.nil, example: s.example, claim: s.claim, says: s.says })) },
    { id: 'imagine-clay-next', tool: 'imagine', theorem: 'textbook_clay_bridge', arguments: { all: true, next: true }, shows: PROSE.quantumProcessingToolboxesFlow_shows63, expect: (s) => (s.phase === 'next' && s.via === 'imagine' && s.practice === 'clay' && s.all === true && s.tokens === 0 && s.queue === 0 && s.fetched === false && s.written === false && s.proved === s.relations && s.relations === CLAY_RELATIONS.length && s.rows.length === CLAY_RELATIONS.length && s.rows.every((row: { proves: boolean; sealed: boolean; uuid: string; witnesses: { squares: number; triangles: number; faces: number; exact: boolean }; next: { id: string; executable: boolean } | null }, index: number) => row.proves && row.sealed && seal(row.uuid).valid && row.witnesses.squares === 6 && row.witnesses.triangles === 8 && row.witnesses.faces === 14 && row.witnesses.exact === true && (index === s.rows.length - 1 ? row.next === null : row.next !== null && row.next.id === s.rows[index + 1].uuid && row.next.executable === true && row.next.id !== row.uuid)) ? null : JSON.stringify({ all: s.all, relations: s.relations, proved: s.proved, says: s.says })) },
    { id: 'imagine-all', tool: 'imagine', theorem: 'textbook_uuid_core', arguments: { all: true }, shows: PROSE.quantumProcessingToolboxesFlow_shows64, expect: (s) => { const members = [...new Set(s.rows.map((r: { uuid: string }) => r.uuid))].sort(); return s.phase === 'uuid' && s.members + s.collapsed === s.leads && s.leads > 0 && s.sealed === true && s.core === true && s.all === uuid(canonicalText(members)) && seal(s.all).valid && s.rows.every((r: { handle: number; program: number; tail: number; stamp: number; uuid: string }) => r.handle === 8 && r.program === 10 && r.tail === 12 && r.stamp === 2 && r.handle + r.program + r.tail + r.stamp === 32 && seal(r.uuid).valid) ? null : JSON.stringify({ phase: s.phase, leads: s.leads, members: s.members, collapsed: s.collapsed, sealed: s.sealed, core: s.core }) } },
  ],
  skill: {
    instructions: PROSE.quantumProcessingToolboxesFlow_instructions65,
    directions: [PROSE.quantumProcessingToolboxesFlow_s66, PROSE.quantumProcessingToolboxesFlow_s67, PROSE.quantumProcessingToolboxesFlow_s68, PROSE.quantumProcessingToolboxesFlow_s69],
    selftest: (ctx) => runFlowSelftest(ctx.handle, ctx.examples, ctx.leads),
  },
}
