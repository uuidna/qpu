// The extension toolbox: QPU is the natural extension of every MCP, and every MCP of QPU. Inward, a host's tools/list is
// read into doors that join this catalogue (the same door reading discovery uses), and a foreign door is served by one
// request the client fetches, the answer read back whether JSON or an event stream. Outward, this catalogue is expressed as
// the registration any MCP client mounts (tools/list as every client receives it, the mcpServers fragment). Pure: no fetch.
import { PROSE, proseFill } from '../../../../../../../../5/9/e/4/9/1/a/4/index.ts'
import { ADAPTED_CONNECTORS, QPU_CONNECTOR, WEBSITE_CLIENT, WEBSITE_ROUTES, llmTools } from '../../../../../../../../4/a/1/6/6/9/b/c/index.ts'
import { TABLES } from '../../../../../../../../1/2/a/4/3/2/a/8/index.ts'
import { defineTool, isObj, createChecks, listTools, type Toolbox, type Context } from '../../../../../../../../d/e/7/d/b/7/1/6/index.ts'
import { toDoor, getEventData, rpcBody, DEFAULT_MCP_HOSTS, CLOUDFLARE_MCP, CLOUDFLARE_DOCS_MCP, QPU_MCP, KNOWN_MCP, CLAUDE_API, GEMINI_API, OPEN_MCP_BASELINES, compareToolsLists, createCoverageRequest, getCoverage, mcpHostList, type Door } from '../../../../../../../../c/7/b/f/7/4/4/1/index.ts'
import { askPayloadRbac, payloadRbacMcp, rbac } from '../../../../../../../../c/b/4/8/a/7/f/4/index.ts'
import { adaptQuantum, integrateClaude, integrateCursor, integrateDeclarations } from '../../../../../../../../6/3/4/6/7/2/e/4/index.ts'
import { openQuantum } from '../../../../../../../../e/4/1/5/d/7/9/d/index.ts'
import { LEADS } from '../../../../../../../../7/b/0/4/c/3/6/8/index.ts'
import { canonicalText, isUuid, next, stream, uuid, LEAN_REGISTER } from '../../../../../../../../2/7/1/a/7/6/4/9/index.ts'
import { pageSeed } from '../../../../../../../../3/9/4/0/5/6/c/e/index.ts'
import { checkWitnesses } from '../../../../../../../../d/7/8/3/e/4/6/3/index.ts'
import { flowWidget } from '../../../../../../../../3/2/b/b/2/3/c/c/index.ts'
import { callEnvelope, listEnvelope } from '../../../../../../../../d/e/7/d/b/7/1/6/index.ts'

type ForeignTool = { name: string; description?: string; inputSchema?: { properties?: Record<string, unknown>; required?: string[] }; outputSchema?: { properties?: Record<string, unknown> }; annotations?: { readOnlyHint?: boolean } }
const urlHost = (url: string) => { try { return new URL(url).host } catch { return url } }
/** The tools of a host's answer: a tools/list result, its envelope, or the raw text the host answered (JSON or event stream). */
const toolsOfAnswer = (answer: unknown): ForeignTool[] => {
  if (Array.isArray(answer)) return answer as ForeignTool[]
  if (typeof answer === 'string') { try { return toolsOfAnswer(JSON.parse(getEventData(answer))) } catch { return [] } }
  if (isObj(answer)) { const o = answer as { tools?: ForeignTool[]; result?: { tools?: ForeignTool[] } }; return o.tools ?? o.result?.tools ?? [] }
  return []
}
/** A foreign door read back: the structured content, the text, or the error the host answered. */
export const getAnswer = (text: string): { ok: boolean; result?: unknown; error?: string } => {
  try {
    const j = JSON.parse(getEventData(text)) as { result?: { structuredContent?: unknown; content?: { text: string }[]; isError?: boolean }; error?: { message: string } }
    if (j.error) return { ok: false, error: j.error.message }
    if (j.result?.isError) return { ok: false, error: j.result.content?.[0]?.text ?? 'refused' }
    if (j.result?.structuredContent !== undefined) return { ok: true, result: j.result.structuredContent }
    const t = j.result?.content?.[0]?.text; if (t !== undefined) { try { return { ok: true, result: JSON.parse(t) } } catch { return { ok: true, result: t } } }
    return { ok: true, result: j.result }
  } catch (e) { const data = getEventData(text); return { ok: false, error: `not JSON (${(e as Error).message}; stream ${/^(event|data):/m.test(text)}; data ${JSON.stringify(data)}): ${text}` } }
}
const mine = (ctx: Context) => (listTools(ctx))
/** Inward: the host's tools as doors of this catalogue, each named host:tool. */
const mapInward = (host: string, tools: ForeignTool[]) => tools.map((t) => ({ ...toDoor(t, 'tools/list'), host: urlHost(host), url: host, as: `${urlHost(host)}:${t.name}` }))
/** Outward: this catalogue as the registration any MCP client mounts. */
/** The registration balanced to a statement: the handler's tools/list asked with the statement and brief descriptions answers the cluster the match tool decides;
 *  the URL carries the same scope for the connector that fetches tools/list itself; the Claude toolset enables those tools alone; the context is counted. */
const balanceDoors = (ctx: Context, at: string, statement: string) => {
  const r = ctx.handle(listEnvelope({ statement, brief: true })) as { result: { tools: { name: string }[]; _meta: { context: Record<string, unknown> } } }
  const names = r.result.tools.map((t) => t.name)
  const url = `${at}?statement=${encodeURIComponent(statement)}&brief=1`
  return { statement, tools: names, url, context: r.result._meta.context, claude: { mcp_servers: [{ type: 'url', url: WEBSITE_CLIENT, name: 'qpu' }], tools: [{ type: 'mcp_toolset', mcp_server_name: 'qpu', default_config: { enabled: false }, configs: [...names.map((name) => ({ name, enabled: true })), ...WEBSITE_ROUTES.map((route) => ({ name: route.name, enabled: true }))] }], routes: WEBSITE_ROUTES }, any: { mcpServers: { qpu: { url: WEBSITE_CLIENT } } }, says: PROSE.quantumProcessingToolboxesExtension_says1 }
}
const MODEL_NAME = /^[A-Za-z0-9._:-]{1,80}$/
const mountServers = () => ({ qpu: { type: 'http' as const, url: WEBSITE_CLIENT, name: 'qpu' as const } })
const claudeMount = () => ({ id: 'claude' as const, model: CLAUDE_API.model, url: WEBSITE_CLIENT, betas: [CLAUDE_API.mcpConnector.beta], mcp_servers: [{ type: 'url' as const, url: WEBSITE_CLIENT, name: 'qpu' as const }], tools: [{ type: 'mcp_toolset' as const, mcp_server_name: 'qpu' as const }, ...llmTools()] })
const cursorMount = () => ({ id: 'cursor' as const, model: CURSOR_SDK.model, url: WEBSITE_CLIENT, mcpServers: { qpu: { type: 'http' as const, url: WEBSITE_CLIENT } } })
const restMount = (id: string, model: string) => ({ id, model, url: WEBSITE_CLIENT, mcpServers: mountServers() })
/** One MCP. Every connector fetches the Payload plugin. Quantum demand stays on this register. */
const quantumConnector = (asked?: string) => {
  const known = [claudeMount(), cursorMount(), restMount('gemini', GEMINI_API.model)]
  const models = asked && !known.some((row) => row.id === asked) ? [...known, restMount(asked, asked)] : known
  const connectors = [{ ...QPU_CONNECTOR, adapted: [...ADAPTED_CONNECTORS], combination: 'content/discovery/platform' as const }]
  const one = models.every((row) => row.url === WEBSITE_CLIENT) && connectors.length === 1 && connectors[0]!.api === WEBSITE_CLIENT && connectors[0]!.plugin === 'qpuMcpPlugin' && WEBSITE_ROUTES.length === 4
  return { phase: 'connector' as const, name: 'qpu' as const, plugin: 'qpuMcpPlugin' as const, url: WEBSITE_CLIENT, routes: WEBSITE_ROUTES, outbound: 0 as const, waited: false as const, slower: false as const, one, models, connectors, any: restMount('any', 'any'), says: PROSE.quantumProcessingToolboxesExtension_says2 }
}

const mapOutward = (ctx: Context, at: string, statement?: string) => { const tools = mine(ctx); return { ...(statement ? { scoped: balanceDoors(ctx, at, statement) } : {}), tools, routes: WEBSITE_ROUTES, mcpServers: { qpu: { url: WEBSITE_CLIENT, transport: 'http', routes: WEBSITE_ROUTES.length, toolboxes: [...new Set(tools.map((t) => t._meta?.toolbox ?? 'none'))], server: 'payload-rbac' as const, one: true as const, first: true as const, managedBy: 'payload-mcp' as const, asked: 'QPU_RBAC_MCP' as const, tool: 'payload' as const } }, claude: { endpoint: CLAUDE_API.messages, betas: [CLAUDE_API.mcpConnector.beta], model: CLAUDE_API.model, mcp_servers: [{ type: 'url', url: WEBSITE_CLIENT, name: 'qpu' }], tools: [{ type: 'mcp_toolset', mcp_server_name: 'qpu' }, ...llmTools()], auth: proseFill(PROSE.quantumProcessingToolboxesExtension_auth3, CLAUDE_API.key, CLAUDE_API.version), note: PROSE.quantumProcessingToolboxesExtension_note4 }, connector: quantumConnector(), note: PROSE.quantumProcessingToolboxesExtension_note5 } }

/** The Cursor TypeScript SDK (https://cursor.com/docs/sdk/typescript, read 2026-11-03): Agent.create sells this catalogue by mounting it as an HTTP MCP server. The key is named, never valued; the tree plans the module and never runs it. */
const CURSOR_SDK = { docs: 'https://cursor.com/docs/sdk/typescript', read: '2026-11-03', package: '@cursor/sdk', install: 'npm install @cursor/sdk', key: 'CURSOR_API_KEY', model: 'composer-2.5', node: '>=22.13' } as const
const SELL_PROMPT = PROSE.quantumProcessingToolboxesExtension_s6
/** The module a tenant's harness runs: one cloud agent with no repo, or a local agent allowed only the MCP tools, the catalogue mounted inline. Inline servers are not kept across Agent.resume. */
const cursorModule = (o: { model: string; runtime: 'local' | 'cloud'; cwd?: string; prompt: string }) => {
  const runtime = o.runtime === 'cloud'
    ? 'cloud: { repos: [] },'
    : `local: { cwd: ${o.cwd ? JSON.stringify(o.cwd) : 'process.cwd()'} },\n    tools: ["mcp"],`
  return `// Sell the QPU through the Cursor TypeScript SDK (${CURSOR_SDK.docs}, read ${CURSOR_SDK.read}).
// ${CURSOR_SDK.install} — Node ${CURSOR_SDK.node}. A user key or a service-account key in ${CURSOR_SDK.key}; a Team Admin key is not accepted. The tree never holds it.
// Inline mcpServers are not kept across Agent.resume: pass them again, and on a local agent pass tools again.
import { Agent, CursorAgentError } from "${CURSOR_SDK.package}";

const apiKey = process.env.${CURSOR_SDK.key};
if (!apiKey) throw new Error("${CURSOR_SDK.key} is not set");

const prompt = ${JSON.stringify(o.prompt)};

try {
  await using agent = await Agent.create({
    apiKey,
    model: { id: ${JSON.stringify(o.model)} },
    ${runtime}
    mcpServers: {
      qpu: { type: "http", url: ${JSON.stringify(WEBSITE_CLIENT)} },
    },
  });
  const run = await agent.send(prompt);
  console.log(JSON.stringify({ agentId: agent.agentId, runId: run.id }));
  const result = await run.wait();
  if (result.status === "error") {
    console.error("run failed: " + result.id);
    process.exit(2);
  }
  console.log(result.status, result.result);
} catch (err) {
  if (err instanceof CursorAgentError) {
    console.error("startup failed: " + err.message + ", retryable=" + err.isRetryable);
    process.exit(1);
  }
  throw err;
}
`
}
const sellCursor = (raw: true | Record<string, unknown>) => {
  const g = raw === true ? {} : raw
  const runtime = g.runtime === undefined ? 'cloud' : g.runtime
  if (runtime !== 'local' && runtime !== 'cloud') throw new Error('cursor.runtime is local or cloud')
  if (g.prompt !== undefined && typeof g.prompt !== 'string') throw new Error(PROSE.quantumProcessingToolboxesExtension_s7)
  const prompt = typeof g.prompt === 'string' ? g.prompt : SELL_PROMPT
  if (!prompt.trim()) throw new Error(PROSE.quantumProcessingToolboxesExtension_s7)
  if (g.model !== undefined && (typeof g.model !== 'string' || !/^[a-z0-9.-]{1,80}$/.test(g.model))) throw new Error(`cursor.model is a model id such as ${CURSOR_SDK.model}`)
  const model = typeof g.model === 'string' ? g.model : CURSOR_SDK.model
  if (g.cwd !== undefined && (typeof g.cwd !== 'string' || g.cwd.length === 0 || g.cwd.length > 512 || /[\0\n]/.test(g.cwd))) throw new Error('cursor.cwd is a directory path')
  const cwd = typeof g.cwd === 'string' ? g.cwd : undefined
  const mcpServers = { qpu: { type: 'http' as const, url: WEBSITE_CLIENT, routes: WEBSITE_ROUTES, server: 'payload-rbac' as const, one: true as const, first: true as const } }
  const agent = { apiKey: `<${CURSOR_SDK.key}>`, model: { id: model }, ...(runtime === 'cloud' ? { cloud: { repos: [] as string[] } } : { local: { cwd: cwd ?? 'process.cwd()' }, tools: ['mcp'] }), mcpServers }
  const module = cursorModule({ model, runtime, cwd, prompt })
  return { phase: 'sell' as const, via: CURSOR_SDK.docs, read: CURSOR_SDK.read, api: CURSOR_SDK, connector: cursorMount(), rbac: askPayloadRbac(mcpHostList(), QPU_MCP, 'tools/call'), runtime, agent, prompt, module, side: 'coil' as const, sells: { catalogue: { tool: 'stripe', arguments: { op: 'catalogue' } }, plan: { tool: 'stripe', arguments: { op: 'plan' } }, holds: PROSE.quantumProcessingToolboxesExtension_holds8 }, theorem: 'textbook_free_or_coil', says: proseFill(PROSE.quantumProcessingToolboxesExtension_says9, CURSOR_SDK.docs, CURSOR_SDK.read, runtime, WEBSITE_CLIENT, CURSOR_SDK.key, runtime === 'local' ? PROSE.quantumProcessingToolboxesExtension_s10 : '') }
}

const taskMessage = (lead: { id: string; statement: string; address: string }) => {
  const checked = checkWitnesses(lead.address)
  const faces = checked.witnesses.map((witness) => witness.uuid)
  const sent = stream([lead.address, ...faces], { execute: true })
  const messages = sent.rows.map((row) => ({ uuid: row.uuid, handle: row.handle, next: 'next' in row ? row.next : null }))
  const page = pageSeed(lead.statement || lead.id, lead.statement, lead.address)
  const covered = checked.faces === 14 && checked.squares === 6 && checked.triangles === 8 && checked.exact && faces.every((id) => messages.some((row) => row.uuid === id)) && messages.some((row) => row.uuid === lead.address)
  return {
    id: lead.id,
    address: lead.address,
    written: false as const,
    memory: { id: lead.address, collection: 'pages' as const, sku: page.sku, statement: lead.statement },
    instances: [
      { collection: 'pages' as const, id: page.id, sku: page.sku, slug: page.slug, status: page._status },
      { collection: 'products' as const, id: lead.address, sku: page.sku, title: page.title, product: 'quantum' as const, variant: lead.id, status: 'draft' as const },
    ],
    witnesses: { faces: checked.faces, squares: checked.squares, triangles: checked.triangles, exact: checked.exact },
    covered,
    messages,
  }
}

const extend = defineTool('extension', {
  name: 'extend',
  description: PROSE.quantumProcessingToolboxesExtension_description11,
  inputSchema: { type: 'object', properties: { install: { type: 'object', description: '{ name, url, auth?, held? }: a server a user chose from the registry, installed as one row of the tenant\'s mcps (its token by binding name, never a value), the write the app performs and the tools/list that reads its doors into the catalogue; a url already held adds no row' }, coverage: { description: PROSE.quantumProcessingToolboxesExtension_description12 }, connector: { description: PROSE.quantumProcessingToolboxesExtension_description13 }, gemini: { type: 'object', description: PROSE.quantumProcessingToolboxesExtension_description14 }, claude: { type: 'object', description: '{ compat: true } narrows every quantum tool schema to the JSON Schema subset strict tool use publishes: unsupported constraints are dropped into the description, every object sets additionalProperties false, and each tool is strict. No messages request leaves' }, adapter: { description: PROSE.quantumProcessingToolboxesExtension_description15 }, cursor: { description: PROSE.quantumProcessingToolboxesExtension_description16 }, compare: { description: PROSE.quantumProcessingToolboxesExtension_description17 }, statement: { type: 'string', description: PROSE.quantumProcessingToolboxesExtension_description18 }, direction: { type: 'string', enum: ['in', 'out', 'both'], description: 'default both' }, host: { type: 'string', description: PROSE.quantumProcessingToolboxesExtension_description19 }, tools: { description: PROSE.quantumProcessingToolboxesExtension_description20 }, call: { type: 'object', properties: { tool: { type: 'string' }, arguments: { type: 'object' } }, description: PROSE.quantumProcessingToolboxesExtension_description21 }, answer: { type: 'string', description: PROSE.quantumProcessingToolboxesExtension_description22 }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    // a server installed at will: the one tenant row, the write the app performs, and the tools/list request that follows (textbook_mcp_install_rows)
    if (isObj(args.install)) {
      const i = args.install as { name?: unknown; url?: unknown; auth?: unknown; held?: unknown }
      const name = String(i.name ?? '').trim(), url = String(i.url ?? '').trim()
      if (!name || !url.startsWith('https://')) throw new Error(PROSE.quantumProcessingToolboxesExtension_s23)
      const host = urlHost(url), held = Array.isArray(i.held) ? (i.held as { url?: unknown }[]).map((h) => String(h?.url ?? '')) : []
      const duplicate = held.includes(url), auth = i.auth === 'bearer' ? 'bearer' as const : 'none' as const
      const token = auth === 'bearer' ? `QPU_MCP_TOKEN_${host.toUpperCase().replace(/[.-]/g, '_')}` : null
      const row = { name, url, auth, token }
      const then = { id: `extend:${host}`, method: 'POST' as const, url, accept: PROSE.quantumProcessingToolboxesExtension_accept24, ...(token ? { headers: { authorization: `Bearer <${token}>` } } : {}), body: rpcBody('tools/list') }
      return { phase: 'install' as const, host, row, duplicate, rows: held.length + (duplicate ? 0 : 1), write: duplicate ? null : { collection: 'tenants', field: 'mcps', push: row }, then, theorem: 'textbook_mcp_install_rows', says: duplicate ? proseFill(PROSE.quantumProcessingToolboxesExtension_s25, host) : proseFill(PROSE.quantumProcessingToolboxesExtension_s26, host) } as never
    }
    // the coverage of the registered MCP world: the registry's first page named for the client to walk, then its count turned into a ratio of the gates' MCP doors
    if (args.coverage === true) return { phase: 'requests' as const, request: createCoverageRequest(), says: PROSE.quantumProcessingToolboxesExtension_says27 } as never
    if (isObj(args.coverage)) { const total = Number((args.coverage as { registryTotal?: unknown }).registryTotal ?? 0); const tools = listTools(ctx).length; return { phase: 'coverage' as const, ...getCoverage(mcpHostList().length, Number.isFinite(total) ? total : 0, tools) } as never }
    if (args.connector === true || isObj(args.connector)) {
      const asked = args.connector === true ? undefined : (args.connector as { model?: unknown }).model
      if (asked !== undefined && (typeof asked !== 'string' || !MODEL_NAME.test(asked))) throw new Error(PROSE.quantumProcessingToolboxesExtension_s28)
      return quantumConnector(typeof asked === 'string' ? asked : undefined) as never
    }
    // the QPU's tools/list against the open MCP servers by size: the servers named for the client to ask, then the sizes it measured turned into ratios
    // the Gemini API as an operator agent the tenant names: the request planned (endpoint, header named, body), the key never valued; a coil, never called by the tree
    if (args.adapter === true || isObj(args.adapter)) {
      const run = (tool: string, arguments_: Record<string, unknown>) => {
        const rpc = ctx.handle(callEnvelope(tool, arguments_)) as { result?: { structuredContent?: unknown }; error?: { message?: string } }
        return rpc.error ? { ok: false as const, error: rpc.error.message ?? 'refused' } : { ok: true as const, result: rpc.result?.structuredContent }
      }
      if (isObj(args.adapter) && 'next' in args.adapter) {
        const asked = (args.adapter as { next?: unknown }).next
        if (asked === true) {
          const rotate = (id: string, statement: string) => {
            const from = uuid(canonicalText({ id, statement }))
            const stepped = next(from)
            return { id, statement, from, address: stepped.next, program: stepped.program, rotated: stepped.rotated, places: stepped.places, kept: stepped.kept, back: stepped.back, around: stepped.around, sealed: stepped.sealed, all: stepped.all, aspects: stepped.aspects.length }
          }
          const open = openQuantum(LEADS)
          const counts = { open: open.filter((row) => row.status === 'open').length, partial: open.filter((row) => row.status === 'partial').length, blocked: open.filter((row) => row.status === 'blocked').length }
          const leads = open.flatMap((row) => [rotate(row.id, row.statement), ...(row.idea ? [rotate(row.id, row.idea)] : [])])
          const held = (row: { kept: boolean; back: boolean; around: boolean; sealed: boolean; all: boolean; places: number; rotated: string; program: string; aspects: number }) => row.kept && row.back && row.around && row.sealed && row.all && row.places === 10 && row.rotated === row.program.slice(1) + row.program[0] && row.aspects === 4
          const walked = ctx.call('leads', { ideas: { next: 'quantum-leads' } }) as { leads: { id: string; depth: number; developed?: { iso?: { documented?: boolean }; end?: { next?: { decision?: string; clause?: string; holds?: boolean } } } }[] }
          const rows = walked.leads.map((lead) => { const next = lead.developed?.end?.next; return { id: lead.id, depth: lead.depth, decision: next?.decision ?? null, clause: next?.clause ?? null, holds: next?.holds === true, saved: lead.developed?.iso?.documented === true } })
          const accepted = rows.filter((row) => row.decision === 'accept' && row.holds && row.saved).length
          const review = { accepted, refused: rows.length - accepted, of: rows.length, holds: rows.length > 0 && accepted === rows.length, rows }
          const tasks = leads.map(taskMessage)
          const messaging = { written: false as const, memory: tasks.length, instances: tasks.reduce((n, task) => n + task.instances.length, 0), witnesses: tasks.reduce((n, task) => n + task.witnesses.faces, 0), messages: tasks.reduce((n, task) => n + task.messages.length, 0), covered: tasks.length > 0 && tasks.every((task) => task.covered) }
          return { phase: 'next' as const, manual: false as const, outbound: 0 as const, slower: false as const, waited: false as const, open: open.length, counts, ideas: open.filter((row) => row.idea).length, handled: leads.length, left: leads.filter((row) => !held(row)).length, leads, review, tasks, messaging, says: PROSE.quantumProcessingToolboxesExtension_says29 } as never
        }
        const from = isUuid(asked) ? asked : ''
        if (!from) throw new Error(PROSE.quantumProcessingToolboxesExtension_s30)
        const stepped = next(from)
        return { ...stepped, phase: 'next' as const, manual: false as const, outbound: 0 as const, slower: false as const, waited: false as const, from, says: PROSE.quantumProcessingToolboxesExtension_says31 } as never
      }
      const native = adaptQuantum(args.adapter === true ? true : args.adapter as Record<string, unknown>, CURSOR_SDK.model, run)
      return (args.adapter === true ? { ...native, connector: quantumConnector() } : native) as never
    }
    if (isObj(args.gemini)) {
      const listed = ctx.handle(listEnvelope()) as { result?: { tools?: { name: string; description?: string; inputSchema?: unknown; _meta?: { toolbox?: string } }[] } }
      const quantum = (listed.result?.tools ?? []).filter((tool) => tool._meta?.toolbox === 'google')
      const integrated = integrateDeclarations(quantum)
      const g = args.gemini as { prompt?: string; model?: string; compat?: boolean }
      if (g.compat === true) return { phase: 'native' as const, origin: 'https://qpu.uuidna.com' as const, slower: false as const, outbound: 0 as const, waited: false as const, capacity: integrated.capacity, declarations: integrated.declarations, dropped: integrated.dropped, drops: integrated.drops, advantage: integrated.advantage, receipt: integrated.receipt, says: proseFill(PROSE.quantumProcessingToolboxesExtension_says32, integrated.declarations.length, integrated.drops) } as never
      if (typeof g.prompt !== 'string' || !g.prompt.trim()) throw new Error(PROSE.quantumProcessingToolboxesExtension_s33)
      const model = typeof g.model === 'string' && /^[a-z0-9.-]{1,80}$/.test(g.model) ? g.model : GEMINI_API.model
      const access = rbac('apis', 'POST', typeof args.role === 'string' ? args.role : undefined)
      const site = llmTools().map((tool) => ({ name: tool.name, description: tool.description, parameters: tool.input_schema }))
      return { phase: 'plan' as const, api: GEMINI_API, connector: restMount('gemini', model), rbac: access, request: { method: 'POST', url: GEMINI_API.endpoint.replace('{model}', model), headers: { 'content-type': 'application/json', [GEMINI_API.header]: `<${GEMINI_API.key}>` }, body: { contents: [{ parts: [{ text: g.prompt }] }], tools: [{ functionDeclarations: [...site, ...integrated.declarations] }] } }, routes: WEBSITE_ROUTES, schema: integrated.receipt, side: 'coil', says: proseFill(PROSE.quantumProcessingToolboxesExtension_says34, model, GEMINI_API.header, GEMINI_API.key, WEBSITE_CLIENT), theorem: 'textbook_free_or_coil' } as never
    }
    if (isObj(args.claude) && (args.claude as { compat?: boolean }).compat === true) {
      const listed = ctx.handle(listEnvelope()) as { result?: { tools?: { name: string; description?: string; inputSchema?: unknown; _meta?: { toolbox?: string } }[] } }
      const quantum = (listed.result?.tools ?? []).filter((tool) => tool._meta?.toolbox === 'google')
      const integrated = integrateClaude(quantum)
      return { phase: 'native' as const, origin: 'https://qpu.uuidna.com' as const, slower: false as const, outbound: 0 as const, waited: false as const, model: CLAUDE_API.model, capacity: integrated.capacity, tools: integrated.tools, dropped: integrated.dropped, drops: integrated.drops, advantage: integrated.advantage, receipt: integrated.receipt, says: proseFill(PROSE.quantumProcessingToolboxesExtension_says35, integrated.tools.length, integrated.drops) } as never
    }
    if (isObj(args.cursor) && (args.cursor as { compat?: boolean }).compat === true) {
      const listed = ctx.handle(listEnvelope()) as { result?: { tools?: { name: string; description?: string; inputSchema?: unknown; outputSchema?: unknown; annotations?: unknown; _meta?: { toolbox?: string } }[] } }
      const quantum = (listed.result?.tools ?? []).filter((tool) => tool._meta?.toolbox === 'google')
      const integrated = integrateCursor(quantum)
      return { phase: 'native' as const, origin: 'https://qpu.uuidna.com' as const, slower: false as const, outbound: 0 as const, waited: false as const, model: CURSOR_SDK.model, capacity: integrated.capacity, tools: integrated.tools, renamed: integrated.renamed, dropped: integrated.dropped, drops: integrated.drops, advantage: integrated.advantage, receipt: integrated.receipt, says: proseFill(PROSE.quantumProcessingToolboxesExtension_says36, integrated.tools.length, integrated.renamed.length, integrated.drops) } as never
    }
    if (args.cursor === true || isObj(args.cursor)) return sellCursor(args.cursor === true ? true : args.cursor as Record<string, unknown>) as never
    if (args.compare !== undefined) { const own = (ctx.handle(listEnvelope()) as { result?: { tools?: unknown[] } }).result ?? { tools: [] }; const qpu = { bytes: new TextEncoder().encode(JSON.stringify(own)).length, tools: own.tools?.length ?? 0 }; const fullList = (ctx.handle(listEnvelope({ full: true })) as { result?: unknown }).result ?? {}; const full = { bytes: new TextEncoder().encode(JSON.stringify(fullList)).length }; if (args.compare === true) return { phase: 'requests' as const, qpu, full, servers: OPEN_MCP_BASELINES, says: PROSE.quantumProcessingToolboxesExtension_says37 } as never; const c = args.compare as { answers?: { id: string; status: number; bytes: number; tools: number }[] }; return { phase: 'compared' as const, ...compareToolsLists(qpu, c.answers ?? [], full) } as never }
    const host = typeof args.host === 'string' ? args.host : QPU_MCP
    const direction = String(args.direction ?? 'both')
    if (isObj(args.call)) {
      const c = args.call as { tool?: string; arguments?: Record<string, unknown> }
      if (!c.tool) throw new Error(PROSE.quantumProcessingToolboxesExtension_s38)
      const access = askPayloadRbac(mcpHostList(), host, 'tools/call', typeof args.role === 'string' ? args.role : undefined)
      if (!access.access) return { phase: 'refused' as const, host: urlHost(host), door: `${urlHost(host)}:${c.tool}`, rbac: access, says: proseFill(PROSE.quantumProcessingToolboxesExtension_says39, access.role, access.action) }
      const request = { method: 'POST' as const, url: host, accept: PROSE.quantumProcessingToolboxesExtension_accept24, body: rpcBody('tools/call', { name: c.tool, arguments: c.arguments ?? {} }) }
      if (typeof args.answer !== 'string') return { phase: 'request' as const, host: urlHost(host), door: `${urlHost(host)}:${c.tool}`, request, rbac: access, note: PROSE.quantumProcessingToolboxesExtension_note40 }
      const read = getAnswer(args.answer)
      return { phase: 'served' as const, host: urlHost(host), door: `${urlHost(host)}:${c.tool}`, request, rbac: access, ok: read.ok, result: read.result, error: read.error }
    }
    const role = typeof args.role === 'string' ? args.role : undefined
    const listed = askPayloadRbac(mcpHostList(), host, 'tools/list', role)
    if (!listed.access) return { phase: 'refused' as const, host: urlHost(host), rbac: listed, server: listed.server, one: listed.one, says: proseFill(PROSE.quantumProcessingToolboxesExtension_says39, listed.role, listed.action) }
    const merged = payloadRbacMcp(mcpHostList())
    const out: Record<string, unknown> = { host: urlHost(host), direction, rbac: listed, server: merged.server, one: merged.one, merged, defaults: DEFAULT_MCP_HOSTS, cloudflare: CLOUDFLARE_MCP, integrations: KNOWN_MCP.map((k) => ({ host: k.host, url: k.url, auth: k.auth, token: k.auth === 'token' ? `QPU_MCP_TOKEN_${k.host.toUpperCase().replace(/[.-]/g, '_')}[_<TENANT>]` : null, about: k.about, maps: k.maps, rbac: askPayloadRbac(mcpHostList(), k.url, 'tools/list', role), server: merged.server })) }
    if (direction !== 'out') {
      if (args.tools === undefined) return { ...out, phase: 'requests' as const, requests: 1, requestList: [{ id: `extend:${urlHost(host)}`, method: 'POST' as const, url: host, accept: PROSE.quantumProcessingToolboxesExtension_accept24, body: rpcBody('tools/list') }], note: PROSE.quantumProcessingToolboxesExtension_note41 }
      const doors = mapInward(host, toolsOfAnswer(args.tools))
      const own = mine(ctx)
      Object.assign(out, { phase: 'extended' as const, inward: doors.length, doors, catalogue: own.length + doors.length, mineCount: own.length, foreignByAnswer: Object.fromEntries([...new Set(doors.flatMap((d) => d.answers))].map((a) => [a, doors.filter((d) => d.answers.includes(a)).map((d) => d.as)])) })
    }
    if (direction !== 'in') Object.assign(out, { outward: mapOutward(ctx, host, typeof args.statement === 'string' && args.statement.trim() ? args.statement : undefined) })
    if (!('phase' in out)) out.phase = 'registration'
    return out
  },
  widget: flowWidget,
})

const DOCS_FIXTURE: ForeignTool[] = [{ name: 'search_cloudflare_documentation', description: 'Search the Cloudflare documentation.', inputSchema: { type: 'object', properties: { query: { type: 'string', description: 'the search query' } }, required: ['query'] } as never }]
const STREAM_FIXTURE = PROSE.quantumProcessingToolboxesExtension_s42

export const EXTENSION: Toolbox = {
  name: 'extension',
  idea: PROSE.quantumProcessingToolboxesExtension_idea43,
  tools: [extend],
  examples: [
    { id: 'extend-out-balanced', tool: 'extend', theorem: 'textbook_context_balanced', arguments: { direction: 'out', statement: PROSE.quantumProcessingToolboxesExtension_statement44 }, shows: PROSE.quantumProcessingToolboxesExtension_shows45, expect: (s) => (s.outward.scoped.tools.includes('attest') && s.outward.scoped.context.tokens * 4 < s.outward.scoped.context.fullTokens && s.outward.scoped.context.saved + s.outward.scoped.context.tokens === s.outward.scoped.context.fullTokens && s.outward.scoped.context.efficiency.coins === 1 && s.outward.scoped.context.efficiency.tokensPerCoin === s.outward.scoped.context.tokens && s.outward.scoped.context.efficiency.coinsPerToken.numerator === 1 && s.outward.scoped.context.efficiency.coinsPerToken.denominator === s.outward.scoped.context.tokens && s.outward.scoped.context.efficiency.holds === true && s.outward.scoped.context.efficiency.analysis.program === 10 && s.outward.scoped.context.efficiency.analysis.params === 12 && s.outward.scoped.claude.tools[0].default_config.enabled === false && s.outward.scoped.url.includes('brief=1') ? null : JSON.stringify(s.outward.scoped?.context)) },
    { id: 'extend-connector', tool: 'extend', theorem: 'textbook_free_or_coil', arguments: { connector: { model: 'other' } }, shows: PROSE.quantumProcessingToolboxesExtension_shows46, expect: (s) => { const ids = s.models.map((row: { id: string; url: string }) => row.id); const claude = s.models.find((row: { id: string }) => row.id === 'claude'); const cursor = s.models.find((row: { id: string }) => row.id === 'cursor'); const gemini = s.models.find((row: { id: string }) => row.id === 'gemini'); const other = s.models.find((row: { id: string }) => row.id === 'other'); return s.phase === 'connector' && s.plugin === 'qpuMcpPlugin' && s.connectors.length === 1 && s.connectors[0].plugin === 'qpuMcpPlugin' && s.connectors[0].api === WEBSITE_CLIENT && s.connectors[0].combination === 'content/discovery/platform' && s.connectors[0].adapted.join() === ADAPTED_CONNECTORS.join() && s.name === 'qpu' && s.url === WEBSITE_CLIENT && s.outbound === 0 && s.waited === false && s.one === true && s.routes.length === 4 && ids.join() === 'claude,cursor,gemini,other' && claude.mcp_servers[0].url === WEBSITE_CLIENT && claude.mcp_servers[0].name === 'qpu' && claude.tools[0].mcp_server_name === 'qpu' && claude.tools.some((tool: { name?: string }) => tool.name === 'find_pages') && claude.betas[0] === 'mcp-client-2025-11-20' && cursor.mcpServers.qpu.url === WEBSITE_CLIENT && cursor.mcpServers.qpu.type === 'http' && gemini.mcpServers.qpu.url === WEBSITE_CLIENT && other.mcpServers.qpu.url === WEBSITE_CLIENT && s.any.mcpServers.qpu.url === WEBSITE_CLIENT ? null : JSON.stringify({ phase: s.phase, ids, one: s.one, url: s.url }) } },
    { id: 'extend-out', tool: 'extend', theorem: 'textbook_mcp_tools_by_toolbox', arguments: { direction: 'out' }, shows: PROSE.quantumProcessingToolboxesExtension_shows47, expect: (s) => (s.phase === 'registration' && s.outward.tools.length >= 36 && s.outward.mcpServers.qpu.url === WEBSITE_CLIENT && s.outward.mcpServers.qpu.routes === 4 && s.outward.claude.mcp_servers[0].url === WEBSITE_CLIENT && s.outward.claude.tools[0].mcp_server_name === 'qpu' && s.outward.claude.tools.some((tool: { name?: string }) => tool.name === 'find_pages') && s.outward.claude.betas[0] === 'mcp-client-2025-11-20' ? null : `${s.phase} ${s.outward?.tools?.length}`) },
    { id: 'extend-in-request', tool: 'extend', theorem: 'textbook_integrations_are_thirty_five', arguments: { direction: 'in', host: CLOUDFLARE_DOCS_MCP }, shows: PROSE.quantumProcessingToolboxesExtension_shows48, expect: (s) => (s.phase === 'requests' && s.requestList[0].method === 'POST' && s.requestList[0].body.method === 'tools/list' && s.cloudflare.length === TABLES.CLOUDFLARE_MCP.length && s.integrations.length === TABLES.KNOWN_MCP.length && s.integrations.some((i: { host: string; auth: string }) => i.host === 'api.githubcopilot.com' && i.auth === 'token') && s.integrations.filter((i: { auth: string }) => i.auth === 'none').length === 1 ? null : `${s.phase} ${s.integrations?.length}`) },
    { id: 'extend-in-docs', tool: 'extend', theorem: 'textbook_extend_inward', arguments: { direction: 'in', host: CLOUDFLARE_DOCS_MCP, tools: DOCS_FIXTURE }, shows: PROSE.quantumProcessingToolboxesExtension_shows49, expect: (s) => (s.phase === 'extended' && s.inward === 1 && s.doors[0].as === 'docs.mcp.cloudflare.com:search_cloudflare_documentation' && s.doors[0].takes.includes('query') && s.catalogue === s.mineCount + 1 ? null : JSON.stringify(s.doors?.[0])) },
    { id: 'extend-call-served', tool: 'extend', theorem: 'textbook_foreign_door_name', arguments: { host: CLOUDFLARE_DOCS_MCP, call: { tool: 'search_cloudflare_documentation', arguments: { query: 'workers assets' } }, answer: STREAM_FIXTURE }, shows: PROSE.quantumProcessingToolboxesExtension_shows50, expect: (s) => (s.phase === 'served' && s.ok && String(s.result).includes('developers.cloudflare.com/workers') && s.request.body.params.name === 'search_cloudflare_documentation' ? null : `${s.phase} ${s.ok} ${s.error ?? ''}`) },
    { id: 'extend-adapter-next', tool: 'extend', theorem: 'textbook_cuboctahedron_faces', arguments: { adapter: { next: true } }, shows: PROSE.quantumProcessingToolboxesExtension_shows51, expect: (s) => { const held = (row: { kept: boolean; back: boolean; around: boolean; sealed: boolean; all: boolean; places: number; rotated: string; program: string; aspects: number; from: string; address: string }) => row.kept && row.back && row.around && row.sealed && row.all && row.places === 10 && row.aspects === 4 && row.rotated === row.program.slice(1) + row.program[0] && /^[0-9a-f-]{36}$/.test(row.from) && /^[0-9a-f-]{36}$/.test(row.address); const tasked = (task: { address: string; written: boolean; covered: boolean; memory: { id: string; collection: string }; instances: { collection: string; id: string }[]; witnesses: { faces: number; squares: number; triangles: number; exact: boolean }; messages: { uuid: string; next: string | null }[] }) => task.written === false && task.covered && task.memory.collection === 'pages' && task.memory.id === task.address && task.instances.some((row) => row.collection === 'pages' && row.id === task.address) && task.instances.some((row) => row.collection === 'products' && row.id === task.address) && task.witnesses.faces === 14 && task.witnesses.squares === 6 && task.witnesses.triangles === 8 && task.witnesses.exact && task.messages.length === 15 && task.messages.every((row) => /^[0-9a-f-]{36}$/.test(row.uuid) && row.next !== null) && task.witnesses.faces === task.messages.filter((row) => row.uuid !== task.address).length + task.messages.filter((row) => row.uuid === task.address).length - 1; return s.phase === 'next' && s.manual === false && s.outbound === 0 && s.waited === false && s.left === 0 && s.open > 0 && s.handled === s.open + s.ideas && s.leads.length === s.handled && s.leads.every(held) && s.review.holds === true && s.review.accepted === s.handled && s.review.refused === 0 && s.tasks.length === s.handled && s.tasks.every(tasked) && s.messaging.written === false && s.messaging.covered === true && s.messaging.memory === s.handled && s.messaging.instances === s.handled * 2 && s.messaging.witnesses === s.handled * 14 && s.messaging.messages === s.handled * 15 && !/[0-9a-f]{8}-[0-9a-f]{4}-/.test(s.says) ? null : JSON.stringify({ open: s.open, handled: s.handled, left: s.left, messaging: s.messaging, covered: s.tasks?.filter((task: { covered: boolean }) => !task.covered).length }) } },
    { id: 'extend-quantum-adapter', tool: 'extend', theorem: 'textbook_advantage_unbounded', arguments: { adapter: true }, shows: PROSE.quantumProcessingToolboxesExtension_shows52, expect: (s) => (s.phase === 'native' && s.slower === false && s.outbound === 0 && s.waited === false && s.capacity.unlimited === true && s.capacity.ceiling === null && s.capacity.effective === LEAN_REGISTER && s.capacity.handles === '4294967296' && s.capacity.scale === '137438953472' && s.adapters.length === 4 && s.adapters.every((a: { native: boolean; outbound: number; slower: boolean }) => a.native && a.outbound === 0 && a.slower === false) && s.advantage.unbounded === true && s.receipt.kind === 'iso-quantum' && s.receipt.certified === true && s.receipt.sealed === true && s.receipt.holds === true && s.receipt.standards.length === s.receipt.of && s.receipt.stored.validation === true && s.receipt.id === s.receipt.coin && /^[0-9a-f-]{36}$/.test(s.receipt.id) ? null : JSON.stringify({ phase: s.phase, capacity: s.capacity, receipt: s.receipt?.certified, advantage: s.advantage })) },
    { id: 'extend-quantum-native', tool: 'extend', theorem: 'textbook_advantage_unbounded', arguments: { adapter: { model: 'gemini', over: true, call: { name: 'circuit', arguments: { operations: [{ gate: 'H', qubits: [{ kind: 'line', x: 0 }] }] }, schema: { type: 'object', additionalProperties: false, properties: { gate: { type: 'string' } } } } } }, shows: PROSE.quantumProcessingToolboxesExtension_shows53, expect: (s) => { const rows = s.result?.amplitudes ?? []; const unit = rows.length === 2 && rows.every((a: { re: number; im: number }) => a.re > 0.7 && a.re < 0.71 && a.im === 0); return s.phase === 'native' && s.slower === false && s.outbound === 0 && s.absorbed === true && s.engine === false && s.request === undefined && s.reply.functionResponse.name === 'circuit' && s.dropped.some((d: { keyword: string }) => d.keyword === 'additionalProperties') && unit && s.receipt.certified === true && s.receipt.holds === true && s.advantage.unbounded === true ? null : JSON.stringify({ phase: s.phase, dropped: s.dropped, reply: s.reply, amplitudes: rows, receipt: s.receipt?.certified, error: s.error }) } },
    { id: 'extend-gemini-compat', tool: 'extend', theorem: 'textbook_advantage_unbounded', arguments: { gemini: { compat: true } }, shows: PROSE.quantumProcessingToolboxesExtension_shows54, expect: (s) => { const dirty = (node: unknown): boolean => Array.isArray(node) ? node.some(dirty) : !!node && typeof node === 'object' && (Object.hasOwn(node, 'additionalProperties') || Object.hasOwn(node, '$ref') || Object.hasOwn(node, 'oneOf') || Object.hasOwn(node, 'default') || Object.values(node as Record<string, unknown>).some(dirty)); const names = s.declarations.map((d: { name: string }) => d.name); return s.phase === 'native' && s.outbound === 0 && s.request === undefined && names.includes('circuit') && names.includes('processor') && s.dropped.includes('additionalProperties') && s.declarations.every((d: { parameters: unknown }) => !dirty(d.parameters)) && s.receipt.certified === true && s.receipt.standards.length === s.receipt.of && s.advantage.unbounded === true && s.capacity.effective === LEAN_REGISTER ? null : JSON.stringify({ phase: s.phase, names, dropped: s.dropped, certified: s.receipt?.certified }) } },
    { id: 'extend-claude-compat', tool: 'extend', theorem: 'textbook_advantage_unbounded', arguments: { claude: { compat: true } }, shows: PROSE.quantumProcessingToolboxesExtension_shows55, expect: (s) => { const loose = (node: unknown): boolean => { if (Array.isArray(node)) return node.some(loose); if (!node || typeof node !== 'object') return false; const source = node as Record<string, unknown>; if (['minimum', 'maximum', 'multipleOf', 'minLength', 'maxLength', 'pattern', 'maxItems', 'oneOf', 'nullable', 'example'].some((key) => Object.hasOwn(source, key))) return true; if (Object.hasOwn(source, 'additionalProperties') && source.additionalProperties !== false) return true; if (Object.hasOwn(source, '$ref') && (typeof source.$ref !== 'string' || !source.$ref.startsWith('#'))) return true; const objectLike = source.type === 'object' || source.properties !== undefined; if (objectLike && source.additionalProperties !== false) return true; return Object.values(source).some(loose) }; const names = s.tools.map((tool: { name: string }) => tool.name); return s.phase === 'native' && s.outbound === 0 && s.request === undefined && names.includes('circuit') && names.includes('processor') && s.tools.every((tool: { strict: boolean; input_schema: unknown }) => tool.strict === true && !loose(tool.input_schema)) && s.receipt.certified === true && s.receipt.standards.length === s.receipt.of && s.advantage.unbounded === true && s.capacity.effective === LEAN_REGISTER ? null : JSON.stringify({ phase: s.phase, names, dropped: s.dropped, certified: s.receipt?.certified }) } },
    { id: 'extend-claude-native', tool: 'extend', theorem: 'textbook_advantage_unbounded', arguments: { adapter: { model: 'claude', call: { name: 'circuit', arguments: { operations: [{ gate: 'H', qubits: [{ kind: 'line', x: 0 }] }] } } } }, shows: PROSE.quantumProcessingToolboxesExtension_shows56, expect: (s) => { const rows = s.reply?.content?.amplitudes ?? []; const unit = rows.length === 2 && rows.every((a: { re: number; im: number }) => a.re > 0.7 && a.re < 0.71 && a.im === 0); return s.phase === 'native' && s.outbound === 0 && s.request === undefined && s.reply.type === 'tool_result' && s.reply.tool_use_id === s.receipt.id && unit && s.receipt.certified === true && s.advantage.unbounded === true ? null : JSON.stringify({ phase: s.phase, reply: s.reply?.type, id: s.reply?.tool_use_id, receipt: s.receipt?.id, error: s.error }) } },
    { id: 'extend-cursor-compat', tool: 'extend', theorem: 'textbook_advantage_unbounded', arguments: { cursor: { compat: true } }, shows: PROSE.quantumProcessingToolboxesExtension_shows57, expect: (s) => { const objectSchema = (node: unknown): boolean => { if (!node || typeof node !== 'object' || Array.isArray(node)) return false; const source = node as { type?: unknown; properties?: Record<string, unknown>; required?: unknown }; if (source.type !== 'object') return false; if (source.required !== undefined && !(Array.isArray(source.required) && source.required.every((item) => typeof item === 'string'))) return false; return !source.properties || Object.values(source.properties).every((child) => !!child && typeof child === 'object' && !Array.isArray(child)) }; const names = s.tools.map((tool: { name: string }) => tool.name); return s.phase === 'native' && s.outbound === 0 && s.request === undefined && s.model === 'composer-2.5' && names.includes('circuit') && names.includes('processor') && s.tools.every((tool: { name: string; inputSchema: unknown }) => /^[a-zA-Z0-9_-]{1,128}$/.test(tool.name) && objectSchema(tool.inputSchema)) && s.receipt.certified === true && s.receipt.standards.length === s.receipt.of && s.advantage.unbounded === true && s.capacity.effective === LEAN_REGISTER ? null : JSON.stringify({ phase: s.phase, names, dropped: s.dropped, certified: s.receipt?.certified }) } },
    { id: 'extend-cursor-native', tool: 'extend', theorem: 'textbook_advantage_unbounded', arguments: { adapter: { model: 'cursor', call: { name: 'circuit', arguments: { operations: [{ gate: 'H', qubits: [{ kind: 'line', x: 0 }] }] } } } }, shows: PROSE.quantumProcessingToolboxesExtension_shows58, expect: (s) => { const rows = s.reply?.structuredContent?.amplitudes ?? []; const unit = rows.length === 2 && rows.every((a: { re: number; im: number }) => a.re > 0.7 && a.re < 0.71 && a.im === 0); return s.phase === 'native' && s.outbound === 0 && s.request === undefined && s.reply.isError === false && s.reply.content[0].type === 'text' && unit && s.receipt.certified === true && s.advantage.unbounded === true ? null : JSON.stringify({ phase: s.phase, reply: s.reply, error: s.error }) } },
    { id: 'extend-envelope-gemini', tool: 'extend', theorem: 'textbook_advantage_unbounded', arguments: { adapter: { model: 'gemini', call: { functionCall: { name: 'circuit', args: { operations: [{ gate: 'H', qubits: [{ kind: 'line', x: 0 }] }] } } } } }, shows: PROSE.quantumProcessingToolboxesExtension_shows59, expect: (s) => { const rows = s.reply?.functionResponse?.response?.amplitudes ?? []; const unit = rows.length === 2 && rows.every((a: { re: number; im: number }) => a.re > 0.7 && a.re < 0.71 && a.im === 0); return s.phase === 'native' && s.outbound === 0 && s.calls === 1 && s.request === undefined && s.reply.functionResponse.name === 'circuit' && unit && s.receipt.certified === true ? null : JSON.stringify({ calls: s.calls, reply: s.reply?.functionResponse?.name, error: s.error }) } },
    { id: 'extend-envelope-claude', tool: 'extend', theorem: 'textbook_advantage_unbounded', arguments: { adapter: { model: 'claude', call: { role: 'assistant', content: [{ type: 'text', text: 'run both' }, { type: 'tool_use', id: 'toolu_h', name: 'circuit', input: { operations: [{ gate: 'H', qubits: [{ kind: 'line', x: 0 }] }] } }, { type: 'tool_use', id: 'toolu_w', name: 'processor', input: { name: 'Willow' } }] } } }, shows: PROSE.quantumProcessingToolboxesExtension_shows60, expect: (s) => { const blocks = s.reply?.content ?? []; const hadamard = blocks[0]?.content?.amplitudes ?? []; const unit = hadamard.length === 2 && hadamard.every((a: { re: number; im: number }) => a.re > 0.7 && a.re < 0.71 && a.im === 0); return s.phase === 'native' && s.outbound === 0 && s.calls === 2 && s.reply.role === 'user' && blocks[0]?.tool_use_id === 'toolu_h' && blocks[1]?.tool_use_id === 'toolu_w' && unit && blocks[1]?.content?.qubits === 105 && s.receipt.certified === true ? null : JSON.stringify({ calls: s.calls, ids: blocks.map((b: { tool_use_id?: string }) => b.tool_use_id), qubits: blocks[1]?.content?.qubits, error: s.error }) } },
    { id: 'extend-envelope-cursor', tool: 'extend', theorem: 'textbook_advantage_unbounded', arguments: { adapter: { model: 'cursor', call: { jsonrpc: '2.0', id: 7, method: 'tools/call', params: { name: 'processor', arguments: { name: 'Foxtail' } } } } }, shows: PROSE.quantumProcessingToolboxesExtension_shows61, expect: (s) => (s.phase === 'native' && s.outbound === 0 && s.calls === 1 && s.reply.jsonrpc === '2.0' && s.reply.id === 7 && s.reply.result.isError === false && s.reply.result.structuredContent.qubits === 22 && s.reply.result.structuredContent.couplers === 31 && s.receipt.certified === true ? null : JSON.stringify({ id: s.reply?.id, qubits: s.reply?.result?.structuredContent?.qubits, error: s.error })) },
    { id: 'extend-response-gemini', tool: 'extend', theorem: 'textbook_advantage_unbounded', arguments: { adapter: { model: 'gemini', call: { candidates: [{ content: { role: 'model', parts: [{ functionCall: { name: 'circuit', args: { operations: [{ gate: 'H', qubits: [{ kind: 'line', x: 0 }] }] } } }, { text: 'and the layout' }, { functionCall: { name: 'processor', args: { name: 'Willow' } } }] }, finishReason: 'STOP' }] } } }, shows: PROSE.quantumProcessingToolboxesExtension_shows62, expect: (s) => { const parts = s.reply?.parts ?? []; const hadamard = parts[0]?.functionResponse?.response?.amplitudes ?? []; const unit = hadamard.length === 2 && hadamard.every((a: { re: number; im: number }) => a.re > 0.7 && a.re < 0.71 && a.im === 0); return s.phase === 'native' && s.outbound === 0 && s.calls === 2 && s.request === undefined && s.reply.role === 'user' && parts[0]?.functionResponse?.name === 'circuit' && unit && parts[1]?.functionResponse?.name === 'processor' && parts[1]?.functionResponse?.response?.qubits === 105 && s.receipt.certified === true ? null : JSON.stringify({ calls: s.calls, names: parts.map((p: { functionResponse?: { name?: string } }) => p.functionResponse?.name), qubits: parts[1]?.functionResponse?.response?.qubits, error: s.error }) } },
    { id: 'extend-response-tools', tool: 'extend', theorem: 'textbook_advantage_unbounded', arguments: { adapter: { model: 'other', call: { choices: [{ finish_reason: 'tool_calls', message: { role: 'assistant', tool_calls: [{ id: 'call_h', type: 'function', function: { name: 'circuit', arguments: '{"operations":[{"gate":"H","qubits":[{"kind":"line","x":0}]}]}' } }] } }] } } }, shows: PROSE.quantumProcessingToolboxesExtension_shows63, expect: (s) => { const body = JSON.parse(s.reply?.content ?? '{}'); const rows = body.amplitudes ?? []; const unit = rows.length === 2 && rows.every((a: { re: number; im: number }) => a.re > 0.7 && a.re < 0.71 && a.im === 0); return s.phase === 'native' && s.outbound === 0 && s.calls === 1 && s.request === undefined && s.reply.role === 'tool' && s.reply.tool_call_id === 'call_h' && unit && s.receipt.certified === true ? null : JSON.stringify({ role: s.reply?.role, id: s.reply?.tool_call_id, error: s.error }) } },
  ],
  skill: {
    instructions: PROSE.quantumProcessingToolboxesExtension_instructions64,
    directions: [PROSE.quantumProcessingToolboxesExtension_s65, PROSE.quantumProcessingToolboxesExtension_s66, PROSE.quantumProcessingToolboxesExtension_s67, PROSE.quantumProcessingToolboxesExtension_s68],
    selftest: (ctx) => {
      const { check, done } = createChecks()
      const run = (args: Record<string, unknown>) => ctx.call('extend', args)
      const inward = run({ direction: 'in', host: CLOUDFLARE_DOCS_MCP, tools: DOCS_FIXTURE })
      check('extension:inward', inward.phase === 'extended' && inward.inward === 1 && inward.doors[0].takes.join() === 'query' && inward.doors[0].required.join() === 'query', `${inward.inward} door, takes ${inward.doors?.[0]?.takes}`)
      const stream = run({ direction: 'in', host: CLOUDFLARE_DOCS_MCP, tools: 'event: message\ndata: ' + JSON.stringify({ jsonrpc: '2.0', id: 1, result: { tools: DOCS_FIXTURE } }) + '\n\n' })
      check('extension:stream-list', stream.inward === 1 && stream.doors[0].as === inward.doors[0].as, PROSE.quantumProcessingToolboxesExtension_s69)
      const out = run({ direction: 'out' })
      const own = mine(ctx)
      check('extension:outward', out.outward.tools.length === own.length && own.every((t) => t.inputSchema) && out.one === true && out.merged.server === 'payload-rbac' && out.outward.mcpServers.qpu.first === true && out.outward.mcpServers.qpu.server === 'payload-rbac' && out.outward.mcpServers.qpu.asked === 'QPU_RBAC_MCP', proseFill(PROSE.quantumProcessingToolboxesExtension_s70, out.outward.tools.length))
      check('extension:claude-mounts-both-halves', out.outward.claude.mcp_servers.length === 1 && out.outward.claude.mcp_servers[0].url === WEBSITE_CLIENT && out.outward.claude.tools[0].mcp_server_name === out.outward.claude.mcp_servers[0].name && out.outward.claude.tools.some((tool: { name?: string }) => tool.name === 'find_pages') && out.outward.claude.betas.includes('mcp-client-2025-11-20') && !JSON.stringify(out.outward.claude).includes('sk-ant'), PROSE.quantumProcessingToolboxesExtension_s71)
      const self = run({ direction: 'in', host: QPU_MCP, tools: out.outward.tools })
      check('extension:identity', self.inward === own.length && self.doors.every((d: Door & { as: string }) => own.some((t) => `qpu.uuidna.com:${t.name}` === d.as)), PROSE.quantumProcessingToolboxesExtension_s72)
      const served = run({ host: CLOUDFLARE_DOCS_MCP, call: { tool: 'search_cloudflare_documentation', arguments: { query: 'q' } }, answer: STREAM_FIXTURE })
      check('extension:served', served.ok && String(served.result).includes('developers.cloudflare.com'), PROSE.quantumProcessingToolboxesExtension_s73)
      const refused = run({ host: 'https://x/mcp', call: { tool: 't' }, answer: JSON.stringify({ jsonrpc: '2.0', id: 1, error: { code: -32601, message: 'unknown tool' } }) })
      check('extension:refusal', !refused.ok && refused.error === 'unknown tool', PROSE.quantumProcessingToolboxesExtension_s74)
      const request = run({ direction: 'in', host: 'https://bindings.mcp.cloudflare.com/mcp' })
      check('extension:request-without-token', request.phase === 'requests' && !JSON.stringify(request).includes('authorization'), PROSE.quantumProcessingToolboxesExtension_s75)
      const discover = ctx.call('discover') as { requestList: { host: string }[] }
      check('extension:discover-defaults', CLOUDFLARE_MCP.every((c) => discover.requestList.some((r) => r.host === c.host)), PROSE.quantumProcessingToolboxesExtension_s76)
      const sell = run({ cursor: true })
      check('extension:cursor-sell', sell.phase === 'sell' && sell.runtime === 'cloud' && sell.agent.cloud.repos.length === 0 && sell.agent.mcpServers.qpu.url === QPU_MCP && sell.agent.mcpServers.qpu.type === 'http' && sell.agent.model.id === 'composer-2.5' && sell.side === 'coil' && sell.module.includes('await using') && sell.module.includes('run.wait()') && sell.module.includes('CursorAgentError') && sell.module.includes('process.exit(2)') && !/cursor_[A-Za-z0-9]/.test(JSON.stringify(sell)) && sell.sells.plan.arguments.op === 'plan', `${sell.runtime} ${sell.agent?.mcpServers?.qpu?.url}`)
      const local = run({ cursor: { runtime: 'local', cwd: '/srv/qpu' } })
      check('extension:cursor-local', local.runtime === 'local' && local.agent.local.cwd === '/srv/qpu' && local.agent.tools.join() === 'mcp' && local.agent.cloud === undefined && local.module.includes('tools: ["mcp"]') && local.module.includes('"/srv/qpu"'), `${local.runtime} ${local.agent?.tools}`)
      const native = run({ adapter: true })
      check('extension:quantum-adapter', native.phase === 'native' && native.outbound === 0 && native.slower === false && native.capacity.unlimited === true && native.capacity.ceiling === null && native.adapters.length === 4 && native.receipt.certified === true && native.receipt.standards.length === native.receipt.of && native.connector.url === WEBSITE_CLIENT && native.connector.one === true && native.connector.models.every((row: { url: string }) => row.url === WEBSITE_CLIENT), `${native.adapters?.length} adapters, certified ${native.receipt?.certified}`)
      const joined = run({ connector: { model: 'other' } })
      check('extension:connector', joined.phase === 'connector' && joined.plugin === 'qpuMcpPlugin' && joined.outbound === 0 && joined.one === true && joined.url === WEBSITE_CLIENT && joined.models.map((row: { id: string }) => row.id).join() === 'claude,cursor,gemini,other' && joined.models.every((row: { url: string }) => row.url === WEBSITE_CLIENT) && joined.connectors.length === 1 && joined.connectors[0].plugin === 'qpuMcpPlugin' && joined.connectors[0].api === WEBSITE_CLIENT && joined.connectors[0].combination === 'content/discovery/platform' && joined.connectors[0].adapted.join() === ADAPTED_CONNECTORS.join(), joined.connectors?.[0]?.adapted?.join())
      const stepped = run({ adapter: { next: true } })
      const again = run({ adapter: { next: stepped.leads[0].address } })
      check('extension:adapter-next', stepped.phase === 'next' && stepped.manual === false && stepped.outbound === 0 && stepped.left === 0 && stepped.open > 0 && stepped.handled === stepped.open + stepped.ideas && stepped.leads.every((row: { kept: boolean; back: boolean; places: number }) => row.kept && row.back && row.places === 10) && stepped.review.holds === true && stepped.review.accepted === stepped.handled && stepped.review.refused === 0 && stepped.messaging.covered === true && stepped.messaging.written === false && stepped.messaging.witnesses === stepped.handled * 14 && stepped.tasks.every((task: { covered: boolean; witnesses: { faces: number } }) => task.covered && task.witnesses.faces === 14) && again.uuid === stepped.leads[0].address && again.manual === false, `${stepped.open} open, ${stepped.messaging?.witnesses} witnesses, left ${stepped.left}`)
      const layout = run({ adapter: { model: 'cirq-google', call: { processor: 'Bristlecone' } } })
      check('extension:quantum-layout', layout.outbound === 0 && layout.engine === false && layout.layout === 'Bristlecone' && layout.result?.qubits === 72 && layout.result?.chosen === true && layout.result?.role === 'reader' && layout.receipt.certified === true, `${layout.layout} ${layout.result?.qubits} engine ${layout.engine}, read by a reader, chosen by a ${layout.result?.role}`)
      const foxtail = run({ adapter: { model: 'cirq-google', call: { processor: 'Foxtail' } } })
      check('extension:quantum-foxtail', foxtail.outbound === 0 && foxtail.engine === false && foxtail.result?.qubits === 22 && foxtail.result?.couplers === 31 && foxtail.receipt.certified === true, `${foxtail.result?.qubits} qubits, ${foxtail.result?.couplers} couplers`)
      const compat = run({ gemini: { compat: true } })
      check('extension:gemini-compat', compat.phase === 'native' && compat.outbound === 0 && compat.declarations.some((d: { name: string }) => d.name === 'circuit') && compat.dropped.includes('additionalProperties') && compat.receipt.certified === true, `${compat.declarations?.length} declarations, dropped ${compat.dropped}`)
      const claude = run({ claude: { compat: true } })
      check('extension:claude-compat', claude.phase === 'native' && claude.outbound === 0 && claude.tools.some((tool: { name: string }) => tool.name === 'circuit') && claude.tools.every((tool: { strict: boolean; input_schema: { additionalProperties?: boolean } }) => tool.strict === true && tool.input_schema.additionalProperties === false) && claude.receipt.certified === true, `${claude.tools?.length} strict tools`)
      const asked = run({ adapter: { model: 'claude', call: { name: 'circuit', arguments: { operations: [{ gate: 'H', qubits: [{ kind: 'line', x: 0 }] }] } } } })
      check('extension:claude-native', asked.outbound === 0 && asked.reply.type === 'tool_result' && asked.reply.tool_use_id === asked.receipt.id && asked.reply.content.amplitudes.length === 2 && asked.receipt.certified === true, asked.reply?.tool_use_id)
      const cursorTools = run({ cursor: { compat: true } })
      check('extension:cursor-compat', cursorTools.phase === 'native' && cursorTools.outbound === 0 && cursorTools.model === 'composer-2.5' && cursorTools.tools.some((tool: { name: string }) => tool.name === 'circuit') && cursorTools.tools.every((tool: { name: string; inputSchema: { type?: string } }) => /^[a-zA-Z0-9_-]{1,128}$/.test(tool.name) && tool.inputSchema.type === 'object') && cursorTools.receipt.certified === true, `${cursorTools.tools?.length} tools, renamed ${cursorTools.renamed?.length}`)
      const cursorCall = run({ adapter: { model: 'cursor', call: { name: 'circuit', arguments: { operations: [{ gate: 'H', qubits: [{ kind: 'line', x: 0 }] }] } } } })
      check('extension:cursor-native', cursorCall.outbound === 0 && cursorCall.reply.isError === false && cursorCall.reply.content[0].type === 'text' && cursorCall.reply.structuredContent.amplitudes.length === 2 && cursorCall.receipt.certified === true, `${cursorCall.reply?.structuredContent?.amplitudes?.length} amplitudes`)
      const envelope = run({ adapter: { model: 'claude', call: { content: [{ type: 'tool_use', id: 'toolu_h', name: 'circuit', input: { operations: [{ gate: 'H', qubits: [{ kind: 'line', x: 0 }] }] } }, { type: 'tool_use', id: 'toolu_w', name: 'processor', input: { name: 'Willow' } }] } } })
      check('extension:envelope', envelope.outbound === 0 && envelope.calls === 2 && envelope.reply.role === 'user' && envelope.reply.content[0].tool_use_id === 'toolu_h' && envelope.reply.content[1].tool_use_id === 'toolu_w' && envelope.reply.content[1].content.qubits === 105 && envelope.receipt.certified === true, `${envelope.calls} calls`)
      const response = run({ adapter: { model: 'gemini', call: { candidates: [{ content: { parts: [{ functionCall: { name: 'processor', args: { name: 'Willow' } } }] } }] } } })
      check('extension:response', response.outbound === 0 && response.calls === 1 && response.reply.functionResponse.name === 'processor' && response.reply.functionResponse.response.qubits === 105 && response.receipt.certified === true, `${response.reply?.functionResponse?.response?.qubits} qubits`)
      return done()
    },
  },
}
