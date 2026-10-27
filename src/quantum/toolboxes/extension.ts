// The extension toolbox: QPU is the natural extension of every MCP, and every MCP of QPU. Inward, a host's tools/list is
// read into doors that join this catalogue (the same door reading discovery uses), and a foreign door is served by one
// request the client fetches, the answer read back whether JSON or an event stream. Outward, this catalogue is expressed as
// the registration any MCP client mounts (tools/list as every client receives it, the mcpServers fragment). Pure: no fetch.
import { toolOf, type Toolbox, type Context } from '../toolbox.js'
import { doorOf, dataOf, rpcBody, DEFAULT_MCP_HOSTS, CLOUDFLARE_MCP, KNOWN_MCP, CLAUDE_API, GEMINI_API, OPEN_MCP_BASELINES, toolsListCompareOf, coverageRequestOf, coverageOf, type Door } from '../discovery.js'
import { flowWidget } from '../widgets.js'

type ForeignTool = { name: string; description?: string; inputSchema?: { properties?: Record<string, unknown>; required?: string[] }; outputSchema?: { properties?: Record<string, unknown> }; annotations?: { readOnlyHint?: boolean } }
const hostOf = (url: string) => { try { return new URL(url).host } catch { return url } }
/** The tools of a host's answer: a tools/list result, its envelope, or the raw text the host answered (JSON or event stream). */
export const toolsOfAnswer = (answer: unknown): ForeignTool[] => {
  if (Array.isArray(answer)) return answer as ForeignTool[]
  if (typeof answer === 'string') { try { return toolsOfAnswer(JSON.parse(dataOf(answer))) } catch { return [] } }
  if (answer && typeof answer === 'object') { const o = answer as { tools?: ForeignTool[]; result?: { tools?: ForeignTool[] } }; return o.tools ?? o.result?.tools ?? [] }
  return []
}
/** A foreign door read back: the structured content, the text, or the error the host answered. */
export const answerOf = (text: string): { ok: boolean; result?: unknown; error?: string } => {
  try {
    const j = JSON.parse(dataOf(text)) as { result?: { structuredContent?: unknown; content?: { text: string }[]; isError?: boolean }; error?: { message: string } }
    if (j.error) return { ok: false, error: j.error.message }
    if (j.result?.isError) return { ok: false, error: j.result.content?.[0]?.text ?? 'refused' }
    if (j.result?.structuredContent !== undefined) return { ok: true, result: j.result.structuredContent }
    const t = j.result?.content?.[0]?.text; if (t !== undefined) { try { return { ok: true, result: JSON.parse(t) } } catch { return { ok: true, result: t } } }
    return { ok: true, result: j.result }
  } catch (e) { const data = dataOf(text); return { ok: false, error: `not JSON (${(e as Error).message.slice(0, 60)}; stream ${/^(event|data):/m.test(text)}; data ${JSON.stringify(data.slice(0, 40))}): ${text.slice(0, 80)}` } }
}
const mine = (ctx: Context) => ((ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: { full: true } }) as { result: { tools: (ForeignTool & { _meta?: { toolbox?: string } })[] } }).result.tools)
/** Inward: the host's tools as doors of this catalogue, each named host:tool. */
const inwardOf = (host: string, tools: ForeignTool[]) => tools.map((t) => ({ ...doorOf(t, 'tools/list'), host: hostOf(host), url: host, as: `${hostOf(host)}:${t.name}` }))
/** Outward: this catalogue as the registration any MCP client mounts. */
/** The registration balanced to a statement: the handler's tools/list asked with the statement and brief descriptions answers the cluster the match tool decides;
 *  the URL carries the same scope for the connector that fetches tools/list itself; the Claude toolset enables those tools alone; the context is counted. */
const balancedOf = (ctx: Context, at: string, statement: string) => {
  const r = ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: { statement, brief: true } }) as { result: { tools: { name: string }[]; _meta: { context: Record<string, unknown> } } }
  const names = r.result.tools.map((t) => t.name)
  const url = `${at}?statement=${encodeURIComponent(statement)}&brief=1`
  return { statement, tools: names, url, context: r.result._meta.context, claude: { mcp_servers: [{ type: 'url', url, name: 'qpu' }], tools: [{ type: 'mcp_toolset', mcp_server_name: 'qpu', default_config: { enabled: false }, configs: names.map((name) => ({ name, enabled: true })) }] }, any: { mcpServers: { qpu: { url } } }, says: 'the connector balanced to the request in real time: the tools the statement needs with brief descriptions, nothing else in the context, so compacting is never needed' }
}
const outwardOf = (ctx: Context, at: string, statement?: string) => { const tools = mine(ctx); return { ...(statement ? { scoped: balancedOf(ctx, at, statement) } : {}), tools, mcpServers: { qpu: { url: at, transport: 'http', tools: tools.length, toolboxes: [...new Set(tools.map((t) => t._meta?.toolbox ?? 'none'))] } }, claude: { endpoint: CLAUDE_API.messages, betas: [CLAUDE_API.mcpConnector.beta], model: CLAUDE_API.model, mcp_servers: [{ type: 'url', url: at, name: 'qpu' }], tools: [{ type: 'mcp_toolset', mcp_server_name: 'qpu' }], auth: `x-api-key: the tenant's ${CLAUDE_API.key}; anthropic-version: ${CLAUDE_API.version}`, note: 'the Messages API mounts this catalogue through its MCP connector: both halves, the server and the toolset, read at platform.claude.com on 2026-10-25' }, note: 'any MCP client that mounts this url receives these tools from tools/list, each result with its block, theme, JSON-LD and Payload document in _meta; the unit and every other host are extended the same way inward' } }

const extend = toolOf('extension', {
  name: 'extend',
  description: 'QPU as the natural extension of every MCP and every MCP of QPU. Inward (host, tools): the host\'s tools/list read into doors that join this catalogue as host:tool, with what each takes and answers; without tools, the one request the client makes for them (a tenant\'s token travels in the request, never here). Outward: this catalogue as the registration any MCP client mounts. call (host, tool, arguments): the request that serves a foreign door; with answer, what it answered, read whether JSON or an event stream. Pure; the client fetches. Cloudflare\'s eight servers are extended by default, the documentation one in the open.',
  inputSchema: { type: 'object', properties: { coverage: { description: 'how much of the registered MCP world the QPU reaches: true names the official registry\'s first page for the client to walk (latest version of each server, a cursor per page); { registryTotal } turns the count into the gates\' MCP doors over it, as measured, and the presets that follow (each door with each QPU tool at its harmonic default)' }, gemini: { type: 'object', description: 'the Gemini API as an operator agent the tenant names: { prompt, model? } — the generateContent request planned with the key named for the x-goog-api-key header and never valued; a coil the tenant\'s harness sends, never the tree' }, compare: { description: 'the QPU\'s tools/list measured against open MCP servers that answer without a key: true names the servers and the QPU\'s own size; { answers: [{ id, status, bytes, tools }] } turns what the client measured into totals, tokens at four bytes a token, bytes per tool and ratios' }, statement: { type: 'string', description: 'with direction out: the registration balanced to this statement — the tools the match tool decides it needs, with brief descriptions, the Claude toolset enabling those alone, the context counted' }, direction: { type: 'string', enum: ['in', 'out', 'both'], description: 'default both' }, host: { type: 'string', description: 'the MCP endpoint; default this tree\'s own' }, tools: { description: 'the host\'s tools/list answer: its tools array, its JSON-RPC envelope, or the raw text (JSON or event stream)' }, call: { type: 'object', properties: { tool: { type: 'string' }, arguments: { type: 'object' } }, description: 'a foreign door to serve: the request is emitted' }, answer: { type: 'string', description: 'what the host answered the call: read back' }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    if (args.selftest) return { selftest: true, ...EXTENSION.skill.selftest(ctx) }
    // the coverage of the registered MCP world: the registry's first page named for the client to walk, then its count turned into a ratio of the gates' MCP doors
    if (args.coverage === true) return { phase: 'requests' as const, request: coverageRequestOf(), says: 'walk every page of the official registry (latest version of each server) and hand back coverage: { registryTotal }' } as never
    if (args.coverage && typeof args.coverage === 'object') { const total = Number((args.coverage as { registryTotal?: unknown }).registryTotal ?? 0); const gates = ((ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'configure', arguments: { kind: 'gates' } } }) as { result?: { structuredContent?: { config?: { gates?: { category: string }[] } } } }).result?.structuredContent?.config?.gates ?? []); const tools = ((ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: { full: true } }) as { result?: { tools?: unknown[] } }).result?.tools ?? []).length; return { phase: 'coverage' as const, ...coverageOf(gates.filter((g) => g.category === 'mcp').length, Number.isFinite(total) ? total : 0, tools) } as never }
    // the QPU's tools/list against the open MCP servers by size: the servers named for the client to ask, then the sizes it measured turned into ratios
    // the Gemini API as an operator agent the tenant names: the request planned (endpoint, header named, body), the key never valued; a coil, never called by the tree
    if (args.gemini && typeof args.gemini === 'object') { const g = args.gemini as { prompt?: string; model?: string }; if (typeof g.prompt !== 'string' || !g.prompt.trim()) throw new Error('gemini takes a prompt: { prompt, model? }'); const model = typeof g.model === 'string' && /^[a-z0-9.-]{1,80}$/.test(g.model) ? g.model : GEMINI_API.model; return { phase: 'plan' as const, api: GEMINI_API, request: { method: 'POST', url: GEMINI_API.endpoint.replace('{model}', model), headers: { 'content-type': 'application/json', [GEMINI_API.header]: `<${GEMINI_API.key}>` }, body: { contents: [{ parts: [{ text: g.prompt }] }] } }, side: 'coil', says: `a Gemini ${model} call planned for the tenant's harness: its key goes in the ${GEMINI_API.header} header from ${GEMINI_API.key}, never in the URL or the tree; a crossing to a paid service, so a coil; the tree never calls it unprompted`, theorem: 'textbook_free_or_coil' } as never }
    if (args.compare !== undefined) { const own = (ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) as { result?: { tools?: unknown[] } }).result ?? { tools: [] }; const qpu = { bytes: new TextEncoder().encode(JSON.stringify(own)).length, tools: own.tools?.length ?? 0 }; const fullList = (ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: { full: true } }) as { result?: unknown }).result ?? {}; const full = { bytes: new TextEncoder().encode(JSON.stringify(fullList)).length }; if (args.compare === true) return { phase: 'requests' as const, qpu, full, servers: OPEN_MCP_BASELINES, says: 'initialize each server, ask its tools/list with the session it names, and hand back { id, status, bytes, tools }, bytes counted over the JSON of the result' } as never; const c = args.compare as { answers?: { id: string; status: number; bytes: number; tools: number }[] }; return { phase: 'compared' as const, ...toolsListCompareOf(qpu, c.answers ?? [], full) } as never }
    const host = typeof args.host === 'string' ? args.host : 'https://qpu.uuidna.com/mcp'
    const direction = String(args.direction ?? 'both')
    if (args.call && typeof args.call === 'object') {
      const c = args.call as { tool?: string; arguments?: Record<string, unknown> }
      if (!c.tool) throw new Error('call.tool names the foreign door')
      const request = { method: 'POST' as const, url: host, accept: 'application/json, text/event-stream', body: rpcBody('tools/call', { name: c.tool, arguments: c.arguments ?? {} }) }
      if (typeof args.answer !== 'string') return { phase: 'request' as const, host: hostOf(host), door: `${hostOf(host)}:${c.tool}`, request, note: 'the client fetches this request with the tenant\'s token if the host asks for one and calls again with the answer' }
      const read = answerOf(args.answer)
      return { phase: 'served' as const, host: hostOf(host), door: `${hostOf(host)}:${c.tool}`, request, ok: read.ok, result: read.result, error: read.error }
    }
    const out: Record<string, unknown> = { host: hostOf(host), direction, defaults: DEFAULT_MCP_HOSTS, cloudflare: CLOUDFLARE_MCP, integrations: KNOWN_MCP.map((k) => ({ host: k.host, url: k.url, auth: k.auth, token: k.auth === 'token' ? `QPU_MCP_TOKEN_${k.host.toUpperCase().replace(/[.-]/g, '_')}[_<TENANT>]` : null, about: k.about, maps: k.maps })) }
    if (direction !== 'out') {
      if (args.tools === undefined) return { ...out, phase: 'requests' as const, requests: 1, requestList: [{ id: `extend:${hostOf(host)}`, method: 'POST' as const, url: host, accept: 'application/json, text/event-stream', body: rpcBody('tools/list') }], note: 'the client fetches the host\'s tools/list (with the tenant\'s token where the host asks for one) and calls again with tools' }
      const doors = inwardOf(host, toolsOfAnswer(args.tools))
      const own = mine(ctx)
      Object.assign(out, { phase: 'extended' as const, inward: doors.length, doors, catalogue: own.length + doors.length, mineCount: own.length, foreignByAnswer: Object.fromEntries([...new Set(doors.flatMap((d) => d.answers))].map((a) => [a, doors.filter((d) => d.answers.includes(a)).map((d) => d.as)])) })
    }
    if (direction !== 'in') Object.assign(out, { outward: outwardOf(ctx, host, typeof args.statement === 'string' && args.statement.trim() ? args.statement : undefined) })
    if (!('phase' in out)) out.phase = 'registration'
    return out
  },
  widget: flowWidget,
})

const DOCS_FIXTURE: ForeignTool[] = [{ name: 'search_cloudflare_documentation', description: 'Search the Cloudflare documentation.', inputSchema: { type: 'object', properties: { query: { type: 'string', description: 'the search query' } }, required: ['query'] } as never }]
const STREAM_FIXTURE = 'event: message\ndata: {"jsonrpc":"2.0","id":1,"result":{"content":[{"type":"text","text":"<result><url>https://developers.cloudflare.com/workers/</url></result>"}]}}\n\n'

export const EXTENSION: Toolbox = {
  name: 'extension',
  idea: 'QPU the natural extension of every MCP and every MCP of QPU: a host\'s tools read into doors of this catalogue by the same reading discovery uses, a foreign door served by one request the client fetches, and this catalogue expressed as the registration any MCP client mounts; tenant configurable through the hosts and tokens a tenant names',
  tools: [extend],
  examples: [
    { id: 'extend-out-balanced', tool: 'extend', theorem: 'textbook_context_balanced', arguments: { direction: 'out', statement: 'verify the NIST beacon and CERN records by theorems' }, shows: 'The connector balanced to a request in real time, over MCP alone: tools/list asked with the statement answers the cluster the match tool decides (attest among them) with brief descriptions; the registration URL carries the same scope, the Claude toolset enables those tools alone, and the context is counted — a fraction of the whole list, so compacting is never needed; the saved and the kept make the whole.', expect: (s) => (s.outward.scoped.tools.includes('attest') && s.outward.scoped.context.tokens * 4 < s.outward.scoped.context.fullTokens && s.outward.scoped.context.saved + s.outward.scoped.context.tokens === s.outward.scoped.context.fullTokens && s.outward.scoped.claude.tools[0].default_config.enabled === false && s.outward.scoped.url.includes('brief=1') ? null : JSON.stringify(s.outward.scoped?.context)) },
    { id: 'extend-out', tool: 'extend', arguments: { direction: 'out' }, shows: 'This catalogue as the registration any MCP client mounts: every tool as tools/list serves it, grouped by toolbox, at this tree\'s own endpoint; and as the Claude API mounts it, through the Messages API\'s MCP connector (mcp_servers with the mcp_toolset, beta mcp-client-2025-11-20), the tenant\'s key in the request.', expect: (s) => (s.phase === 'registration' && s.outward.tools.length >= 36 && s.outward.mcpServers.qpu.url === 'https://qpu.uuidna.com/mcp' && s.outward.mcpServers.qpu.toolboxes.includes('extension') && s.outward.claude.mcp_servers[0].url === 'https://qpu.uuidna.com/mcp' && s.outward.claude.tools[0].mcp_server_name === 'qpu' && s.outward.claude.betas[0] === 'mcp-client-2025-11-20' ? null : `${s.phase} ${s.outward?.tools?.length}`) },
    { id: 'extend-in-request', tool: 'extend', theorem: 'textbook_integrations_are_thirty_five', arguments: { direction: 'in', host: 'https://docs.mcp.cloudflare.com/mcp' }, shows: 'Without the host\'s tools: the one tools/list request the client makes of Cloudflare\'s documentation server (no token needed there), and the integration matrix: every MCP this tree knows, its token name and what the tree does with it once open (GitHub → the repository watch through its doors; Cloudflare\'s eight → the verifier, the mirrors, the metrics, the wave, the audit, the prose, the tenants, the textbook; the Claude API → the operator agent, and outward the Messages API registration that mounts this catalogue).', expect: (s) => (s.phase === 'requests' && s.requestList[0].method === 'POST' && s.requestList[0].body.method === 'tools/list' && s.cloudflare.length === 8 && s.integrations.length === 35 && s.integrations.some((i: { host: string; auth: string }) => i.host === 'api.githubcopilot.com' && i.auth === 'token') && s.integrations.filter((i: { auth: string }) => i.auth === 'none').length === 1 ? null : `${s.phase} ${s.integrations?.length}`) },
    { id: 'extend-in-docs', tool: 'extend', arguments: { direction: 'in', host: 'https://docs.mcp.cloudflare.com/mcp', tools: DOCS_FIXTURE }, shows: 'Cloudflare\'s documentation server read into this catalogue: one door, docs.mcp.cloudflare.com:search_cloudflare_documentation, taking a query.', expect: (s) => (s.phase === 'extended' && s.inward === 1 && s.doors[0].as === 'docs.mcp.cloudflare.com:search_cloudflare_documentation' && s.doors[0].takes.includes('query') && s.catalogue === s.mineCount + 1 ? null : JSON.stringify(s.doors?.[0]).slice(0, 120)) },
    { id: 'extend-call-served', tool: 'extend', arguments: { host: 'https://docs.mcp.cloudflare.com/mcp', call: { tool: 'search_cloudflare_documentation', arguments: { query: 'workers assets' } }, answer: STREAM_FIXTURE }, shows: 'A foreign door served and its event-stream answer read back into the text the host returned.', expect: (s) => (s.phase === 'served' && s.ok && String(s.result).includes('developers.cloudflare.com/workers') && s.request.body.params.name === 'search_cloudflare_documentation' ? null : `${s.phase} ${s.ok} ${s.error ?? ''}`) },
  ],
  skill: {
    instructions: 'Inward: call extend with a host (direction in); fetch the one request it emits, adding the tenant\'s bearer token where the host asks for one (QPU_MCP_TOKEN_<HOST>); call again with tools and the host\'s doors join the catalogue as host:tool. Serve one: extend with call { tool, arguments }; fetch the request; call again with answer. Outward: extend with direction out gives the registration (mcpServers fragment) any MCP client mounts. The discover tool extends the default hosts (the unit, this tree, Cloudflare\'s eight servers) on every run; a tenant names its own hosts with QPU_MCP_HOSTS[_<TENANT>].',
    directions: ['server only: a fixture tools/list read into doors; an event-stream answer read back; the registration from this catalogue', 'client → server: the client fetches tools/list and tools/call of the foreign host, token in the request, never in the tool', 'server → client: every answer the host gives is read the same way discovery reads it (JSON or event stream, error, refusal)', 'toolbox → toolbox: the door reading is discovery\'s own (doorOf); the matcher never calls a foreign door to serve a statement; QPU extended by itself is the identity'],
    selftest: (ctx) => {
      const checks: { id: string; passed: boolean; evidence: string }[] = []
      const check = (id: string, passed: boolean, evidence: string) => checks.push({ id, passed, evidence })
      const run = (args: Record<string, unknown>) => (ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'extend', arguments: args } }) as { result: { structuredContent: any } }).result.structuredContent
      const inward = run({ direction: 'in', host: 'https://docs.mcp.cloudflare.com/mcp', tools: DOCS_FIXTURE })
      check('extension:inward', inward.phase === 'extended' && inward.inward === 1 && inward.doors[0].takes.join() === 'query' && inward.doors[0].required.join() === 'query', `${inward.inward} door, takes ${inward.doors?.[0]?.takes}`)
      const stream = run({ direction: 'in', host: 'https://docs.mcp.cloudflare.com/mcp', tools: 'event: message\ndata: ' + JSON.stringify({ jsonrpc: '2.0', id: 1, result: { tools: DOCS_FIXTURE } }) + '\n\n' })
      check('extension:stream-list', stream.inward === 1 && stream.doors[0].as === inward.doors[0].as, 'tools/list read from an event stream equals the array')
      const out = run({ direction: 'out' })
      const own = mine(ctx)
      check('extension:outward', out.outward.tools.length === own.length && own.every((t) => t.inputSchema), `${out.outward.tools.length} tools in the registration, every one with a schema`)
      check('extension:claude-mounts-both-halves', out.outward.claude.mcp_servers.length === 1 && out.outward.claude.tools[0].mcp_server_name === out.outward.claude.mcp_servers[0].name && out.outward.claude.betas.includes('mcp-client-2025-11-20') && !JSON.stringify(out.outward.claude).includes('sk-ant'), 'the server and its toolset under one name, the beta named, no key')
      const self = run({ direction: 'in', host: 'https://qpu.uuidna.com/mcp', tools: out.outward.tools })
      check('extension:identity', self.inward === own.length && self.doors.every((d: Door & { as: string }) => own.some((t) => `qpu.uuidna.com:${t.name}` === d.as)), 'QPU extended by its own registration is the identity on the catalogue')
      const served = run({ host: 'https://docs.mcp.cloudflare.com/mcp', call: { tool: 'search_cloudflare_documentation', arguments: { query: 'q' } }, answer: STREAM_FIXTURE })
      check('extension:served', served.ok && String(served.result).includes('developers.cloudflare.com'), 'an event-stream answer read back')
      const refused = run({ host: 'https://x/mcp', call: { tool: 't' }, answer: JSON.stringify({ jsonrpc: '2.0', id: 1, error: { code: -32601, message: 'unknown tool' } }) })
      check('extension:refusal', !refused.ok && refused.error === 'unknown tool', 'a host\'s error is the error, not a result')
      const request = run({ direction: 'in', host: 'https://bindings.mcp.cloudflare.com/mcp' })
      check('extension:request-without-token', request.phase === 'requests' && !JSON.stringify(request).includes('authorization'), 'the tool emits the request; the token is the client\'s')
      const discover = (ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'discover', arguments: {} } }) as { result: { structuredContent: { requestList: { host: string }[] } } }).result.structuredContent
      check('extension:discover-defaults', CLOUDFLARE_MCP.every((c) => discover.requestList.some((r) => r.host === c.host)), 'discovery asks every Cloudflare server by default')
      return { passed: checks.every((c) => c.passed), checks }
    },
  },
}
