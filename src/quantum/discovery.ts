// Discovery before use, as a pure toolbox: the handler says what to fetch (the contracts of every host this tree talks to), the
// client fetches it, and the handler reads what came back into doors and capabilities. No I/O here; the client's own MCP
// fetches. An MCP host is asked for tools/list and, where it serves one, its catalogue door; an API host for the OpenAPI,
// index or identify document the verifiers registry names; both domains for /.well-known/qpu.json.
import type { Verifier } from './verifiers.js'
import { STANDARDS, detectStandard } from './standards.js'
import { stem } from './match.js'

export type Purpose = 'mcp-list' | 'catalogue' | 'contract' | 'well-known' | 'api-contract'
export type Request = { id: string; method: 'GET' | 'POST'; url: string; body?: unknown; purpose: Purpose; host: string; name?: string; headers?: Record<string, string> }
/** Cloudflare's MCP servers: the documentation server answers in the open; the rest answer 401 until a tenant brings its OAuth token. */
export const CLOUDFLARE_MCP: readonly { host: string; url: string; about: string }[] = [
  { host: 'docs.mcp.cloudflare.com', url: 'https://docs.mcp.cloudflare.com/mcp', about: 'the Cloudflare documentation, searchable' },
  { host: 'bindings.mcp.cloudflare.com', url: 'https://bindings.mcp.cloudflare.com/mcp', about: 'Workers bindings: KV, R2, D1, Durable Objects of the account' },
  { host: 'observability.mcp.cloudflare.com', url: 'https://observability.mcp.cloudflare.com/mcp', about: 'Workers logs and analytics of the account' },
  { host: 'radar.mcp.cloudflare.com', url: 'https://radar.mcp.cloudflare.com/mcp', about: 'Cloudflare Radar: internet traffic and trends' },
  { host: 'browser.mcp.cloudflare.com', url: 'https://browser.mcp.cloudflare.com/mcp', about: 'browser rendering: fetch and screenshot pages' },
  { host: 'ai-gateway.mcp.cloudflare.com', url: 'https://ai-gateway.mcp.cloudflare.com/mcp', about: 'AI Gateway logs and prompts' },
  { host: 'dns-analytics.mcp.cloudflare.com', url: 'https://dns-analytics.mcp.cloudflare.com/mcp', about: 'DNS analytics of the account\'s zones' },
  { host: 'autorag.mcp.cloudflare.com', url: 'https://autorag.mcp.cloudflare.com/mcp', about: 'AutoRAG: the account\'s indexed documents' },
]
/** Google's own MCP servers, measured in the registry on 2026-10-26 (search google: 296 servers, 175 with remotes, these at <service>.googleapis.com/mcp):
 *  every one a token door (Google OAuth), each mapped to what it is for the Payload plugin — an adapter the environment names, a deploy target,
 *  a measure, a door the tenant opens; proposed and never called from the tree. */
export const GOOGLE_MCP: readonly { host: string; url: string; about: string; maps: string }[] = [
  { host: 'sqladmin.googleapis.com', url: 'https://sqladmin.googleapis.com/mcp', about: 'Cloud SQL: create, manage, query instances', maps: 'the adapters profile google: db-postgres over a Cloud SQL instance (DATABASE_URI); the docket over it' },
  { host: 'run.googleapis.com', url: 'https://run.googleapis.com/mcp', about: 'Cloud Run: deploy applications', maps: 'the deploy target of the app beside Workers and Vercel (the bindings provider google-cloud); the migration law keeps every host until the gate decodes it' },
  { host: 'firestore.googleapis.com', url: 'https://firestore.googleapis.com/mcp', about: 'Firestore resources', maps: 'no Payload database adapter exists for Firestore: a lead (the docket mirrored as entries by address would fit)' },
  { host: 'mapstools.googleapis.com', url: 'https://mapstools.googleapis.com/mcp', about: 'Google Maps: trusted geospatial data', maps: 'the ecommerce addresses collection: geocoding proposed as a hook the tenant enables with its token, never called from the tree' },
  { host: 'monitoring.googleapis.com', url: 'https://monitoring.googleapis.com/mcp', about: 'Cloud Monitoring: performance, availability, health', maps: 'the metrics tool\'s load measures and the e2e gate\'s copies, read beside Cloud Monitoring when the app runs on Cloud Run' },
  { host: 'developerknowledge.googleapis.com', url: 'https://developerknowledge.googleapis.com/mcp', about: 'Google\'s public developer documentation', maps: 'a verifier like cloudflare-docs: a fact on developers.google.com searched there' },
  { host: 'design.googleapis.com', url: 'https://design.googleapis.com/mcp', about: 'UX capabilities for AI systems', maps: 'the UI: the shadcn items styled from the address, offered through this door when the tenant names it' },
  { host: 'stitch.googleapis.com', url: 'https://stitch.googleapis.com/mcp', about: 'the Stitch API', maps: 'the UI designs the gate pages carry, when the tenant names it' },
  { host: 'compute.googleapis.com', url: 'https://compute.googleapis.com/mcp', about: 'Compute Engine infrastructure', maps: 'infrastructure the tenant names: a door, no adapter' },
  { host: 'container.googleapis.com', url: 'https://container.googleapis.com/mcp', about: 'GKE and Kubernetes resources (read)', maps: 'infrastructure the tenant names: a door, no adapter' },
  { host: 'composer.googleapis.com', url: 'https://composer.googleapis.com/mcp', about: 'Cloud Composer resources', maps: 'the waves of next run as a Composer workflow when the tenant names it: a door' },
  { host: 'datastream.googleapis.com', url: 'https://datastream.googleapis.com/mcp', about: 'Datastream resources', maps: 'the docket streamed out of Cloud SQL: a door' },
  { host: 'bigtableadmin.googleapis.com', url: 'https://bigtableadmin.googleapis.com/mcp', about: 'Bigtable resources', maps: 'a store the docket could address: a door, no adapter' },
  { host: 'memorystore.googleapis.com', url: 'https://memorystore.googleapis.com/mcp', about: 'Memorystore for Valkey', maps: 'the cache by address (as KV on Cloudflare): a door' },
  { host: 'androidmanagement.googleapis.com', url: 'https://androidmanagement.googleapis.com/mcp', about: 'enterprise management of Android devices', maps: 'the PWA on managed devices: a door' },
]
/** Google Workspace's nine MCP servers (Gmail, Drive, Docs, Sheets, Slides, Calendar, Chat, People, Classroom): the institution's doors, each landing in the docket. */
import { WORKSPACE_MCP } from './institutions.js'
export { WORKSPACE_MCP }
/** Google's MCP toolboxes in the registry (local servers): proposed, never called. */
export const GOOGLE_MCPS = ['io.github.googleapis/genai-toolbox', 'io.github.googleapis/mcp-toolbox', 'io.github.GoogleCloudPlatform/gemini-cloud-assist-mcp'] as const
/** GitHub's hosted MCP server: answers 401 until a tenant brings its token (a fine-grained PAT or the OAuth flow); the read-only form beside it. */
export const GITHUB_MCP: readonly { host: string; url: string; about: string }[] = [
  { host: 'api.githubcopilot.com', url: 'https://api.githubcopilot.com/mcp/', about: 'GitHub: repositories, branches, tags, releases, issues, pull requests, actions of the tenant\'s account' },
]
/** The Claude API (platform.claude.com/docs/en/api/overview, read 2026-10-25): one endpoint for messages, the MCP connector that mounts any MCP server into a request, the Models door; every door needs the tenant's key (x-api-key, anthropic-version). */
export const CLAUDE_API = {
  docs: 'https://platform.claude.com/docs/en/api/overview',
  messages: 'https://api.anthropic.com/v1/messages',
  models: 'https://api.anthropic.com/v1/models',
  version: '2023-06-01',
  key: 'ANTHROPIC_API_KEY[_<TENANT>]',
  model: 'claude-opus-5-5',
  mcpConnector: { beta: 'mcp-client-2025-11-20', note: 'mcp_servers: [{ type: url, url, name }] with tools: [{ type: mcp_toolset, mcp_server_name }] — both halves, or the request is refused' },
} as const
/** Every MCP this tree knows how to integrate, with what it does with each once the tenant's token opens it. */
export const KNOWN_MCP: readonly { host: string; url: string; about: string; auth: 'none' | 'token'; maps: string }[] = [
  ...CLOUDFLARE_MCP.map((c) => ({ ...c, auth: (c.host === 'docs.mcp.cloudflare.com' ? 'none' : 'token') as 'none' | 'token', maps: c.host === 'docs.mcp.cloudflare.com' ? 'the verifier cloudflare-docs: a fact on developers.cloudflare.com is searched there (search_cloudflare_documentation)' : c.host === 'bindings.mcp.cloudflare.com' ? 'the docket\'s mirrors: KV, R2, D1 and Durable Objects of the tenant read as mirrors to heal by address' : c.host === 'observability.mcp.cloudflare.com' ? 'the metrics tool: the Worker\'s logs and analytics beside the balancer\'s own counts' : c.host === 'browser.mcp.cloudflare.com' ? 'the verification wave: a page rendered at the edge when a verifier needs the page as a browser sees it' : c.host === 'radar.mcp.cloudflare.com' ? 'the legal audit: internet-wide facts as public datasets' : c.host === 'ai-gateway.mcp.cloudflare.com' ? 'the prose tool: generation logged through the tenant\'s gateway, never a token of this tree' : c.host === 'dns-analytics.mcp.cloudflare.com' ? 'the tenants: the custom domains\' DNS read per tenant' : 'the textbook: the tenant\'s indexed documents as a textbook to categorise' })),
  { host: 'api.anthropic.com', url: CLAUDE_API.messages, about: 'the Claude API: messages, the MCP connector that mounts this catalogue into a request, the Models door', auth: 'token' as const, maps: 'the operator agent of the legal audit and the prose tool when the tenant\'s key opens it (never by default: free doors first); outward, extend answers the Messages API registration that mounts this catalogue (mcp_servers + mcp_toolset, beta mcp-client-2025-11-20)' },
  ...GOOGLE_MCP.map((g) => ({ host: g.host, url: g.url, about: g.about, auth: 'token' as const, maps: g.maps })),
  ...WORKSPACE_MCP.map((w) => ({ host: w.host, url: w.url, about: `Google Workspace ${w.product} (Developer Preview): the institution's door`, auth: 'token' as const, maps: `textbook { institution }: ${w.renders}; every record a docket entry through the Payload MCP (createEntries)` })),
  { host: 'mcp.stripe.com', url: 'https://mcp.stripe.com', about: 'Stripe\'s MCP server: its tools over the Stripe API, a tenant\'s secret key the bearer', auth: 'token' as const, maps: 'the billing toolbox: its tools read into doors beside the stripe tool\'s ops (extend, direction in); the use cases of the Stripe API compared to the MCP\'s combinations by stripe { op: usecases }' },
  ...GITHUB_MCP.map((g) => ({ ...g, auth: 'token' as const, maps: 'the repository toolbox: branches, tags and releases watched through the doors list_branches, list_tags and list_releases instead of the REST contract; the next-leads docket as issues when the tenant asks' })),
]
/** The hosts discovered when a tenant names none: the unit, this tree, Cloudflare's eight servers and GitHub's. */
export const DEFAULT_MCP_HOSTS: readonly string[] = ['https://uuidna.com/mcp', 'https://qpu.uuidna.com/mcp', ...CLOUDFLARE_MCP.map((c) => c.url), ...GITHUB_MCP.map((g) => g.url), ...GOOGLE_MCP.map((g) => g.url)]
/** The JSON of an MCP answer, whether the host answered JSON or an event stream (the data line that is JSON). */
export const dataOf = (text: string): string => (/^(event|data):/m.test(text) ? (text.split('\n').filter((l) => l.startsWith('data:')).map((l) => l.slice(5).trim()).find((l) => l.startsWith('{')) ?? text) : text)
export type Answer = Request & { status: number; type: string; text: string }
export type Door = { name: string; description: string; takes: string[]; required: string[]; answers: string[]; readOnly: boolean | null; contract: 'tools/list' | 'catalogue' }
export type Host = { host: string; kind: 'mcp' | 'api' | 'well-known'; contract: string; status: number; detected: string; note: string; doors?: Door[]; paths?: string[] }
export type Discovery = { hosts: Host[]; doors: (Door & { host: string; url: string })[]; capabilities: { statementVerdict: string[]; signing: string[]; readiness: string[]; addressing: string[]; rbac: string[]; metaphysics: string[] }; leads: { id: string; source: string; statement: string; status: 'open'; reason: string }[] }

/** What a client can fill from a theorem, a statement or a value, and what an answer may carry. */
export const TAKES = ['statement', 'claim', 'input', 'deposits', 'proof', 'key', 'theorems', 'message', 'q', 'query', 'text', 'value', 'sources', 'subject', 'token', 'tenant'] as const
export const ANSWERS = ['verdict', 'receipt', 'deposited', 'sealed', 'signed', 'verified', 'proofRoot', 'ready', 'address', 'role'] as const

export const rpcBody = (method: string, params?: unknown) => ({ jsonrpc: '2.0', id: 1, method, params })
const idOf = (purpose: Purpose, host: string, name?: string) => `${purpose}:${host}${name ? `:${name}` : ''}`

/** The first wave: every host's contract address. */
export const discoveryRequestsOf = (mcpHosts: readonly string[], verifiers: readonly Verifier[], auth: Readonly<Record<string, string>> = {}): Request[] => {
  const out: Request[] = []
  for (const url of mcpHosts) {
    const host = new URL(url).host
    const headers = auth[host] ? { authorization: `Bearer ${auth[host]}` } : undefined
    out.push({ id: idOf('mcp-list', host), method: 'POST', url, body: rpcBody('tools/list'), purpose: 'mcp-list', host, headers })
    out.push({ id: idOf('catalogue', host), method: 'POST', url, body: rpcBody('tools/call', { name: 'list_tools', arguments: {} }), purpose: 'catalogue', host, headers })
    out.push({ id: idOf('well-known', host), method: 'GET', url: `https://${host}/.well-known/qpu.json`, purpose: 'well-known', host })
  }
  for (const v of verifiers) if (v.contract) out.push({ id: idOf('api-contract', new URL(v.contract).host, v.id), method: 'GET', url: v.contract, purpose: 'api-contract', host: new URL(v.contract).host, name: v.id })
  for (const st of STANDARDS) out.push({ id: idOf('api-contract', new URL(st.contract).host, st.id), method: 'GET', url: st.contract, purpose: 'api-contract', host: new URL(st.contract).host, name: st.id })
  return out
}

/** A JSON-RPC answer read: the result, or the error text. */
const resultOf = (a: Answer): { result?: any; error?: string } => {
  if (a.status !== 200) return { error: a.status === 0 ? a.text : a.status === 401 ? 'HTTP 401: auth required' : `HTTP ${a.status}` }
  try {
    const j = JSON.parse(dataOf(a.text)) as { result?: { tools?: unknown[]; structuredContent?: unknown; content?: { text: string }[]; isError?: boolean }; error?: { message: string } }
    if (j.error) return { error: j.error.message }
    if (j.result?.isError) return { error: j.result.content?.[0]?.text ?? 'refused' }
    if (j.result?.tools) return { result: j.result }
    if (j.result?.structuredContent !== undefined) return { result: j.result.structuredContent }
    if (j.result?.content?.[0]) { try { return { result: JSON.parse(j.result.content[0].text) } } catch { return { result: j.result.content[0].text } } }
    return { result: j.result }
  } catch { return { error: `not JSON: ${a.text.slice(0, 80)}` } }
}

/** A door's capability from its contract: the properties it takes (of the ones a client can fill) and the keys it answers. */
export const doorOf = (t: { name: string; description?: string; inputSchema?: { properties?: Record<string, unknown>; required?: string[] }; outputSchema?: { properties?: Record<string, unknown> }; annotations?: { readOnlyHint?: boolean } }, contract: Door['contract']): Door => {
  const props = Object.keys(t.inputSchema?.properties ?? {})
  const outKeys = Object.keys(t.outputSchema?.properties ?? {})
  const fromText = (/Returns \{([^}]*)\}/.exec(t.description ?? '')?.[1] ?? '').split(',').map((s) => s.trim()).filter(Boolean)
  const answers = [...new Set([...outKeys, ...fromText])].filter((k) => (ANSWERS as readonly string[]).includes(k))
  return { name: t.name, description: t.description ?? '', takes: props.filter((p) => (TAKES as readonly string[]).includes(p)), required: t.inputSchema?.required ?? [], answers, readOnly: t.annotations?.readOnlyHint ?? null, contract }
}

/** The second wave: the contract of every catalogue door that answers a verdict and is not in tools/list, not yet read. */
export const followUpsOf = (answers: readonly Answer[]): Request[] => {
  const done = new Set(answers.map((a) => a.id))
  const out: Request[] = []
  for (const a of answers.filter((x) => x.purpose === 'catalogue')) {
    const r = resultOf(a); if (!r.result) continue
    const names = (Array.isArray(r.result) ? r.result : r.result.tools ?? []) as { name: string; description: string }[]
    const listed = new Set<string>((resultOf(answers.find((x) => x.id === idOf('mcp-list', a.host)) ?? a).result?.tools ?? []).map((t: { name: string }) => t.name))
    for (const t of names) {
      if (listed.has(t.name) || !doorOf({ name: t.name, description: t.description }, 'catalogue').answers.length) continue
      const id = idOf('contract', a.host, t.name)
      if (!done.has(id)) out.push({ id, method: 'POST', url: a.url, body: rpcBody('tools/call', { name: 'list_tools', arguments: { name: t.name } }), purpose: 'contract', host: a.host, name: t.name })
    }
  }
  return out
}

/** Which document a host answered with: an OpenAPI or Swagger file (and its paths), a JSON index, an OAI identify, a page, nothing. */
export const detect = (r: { status: number; type: string; text: string }): { detected: string; note: string; paths?: string[] } => {
  if (r.status === 0) return { detected: 'unreachable', note: r.text }
  if (r.status >= 400) return { detected: `HTTP ${r.status}`, note: 'no contract at this address' }
  const t = r.text.trim()
  const standard = detectStandard(t); if (standard) return standard
  try {
    const j = JSON.parse(t) as Record<string, unknown>
    if (j.openapi || j.swagger) { const paths = Object.keys((j.paths as object) ?? {}); return { detected: `openapi ${j.openapi ?? j.swagger}`, note: `${paths.length} paths, ${t.length.toLocaleString('en-US')} chars`, paths } }
    const schema = (j.data as { __schema?: { types?: unknown[] } } | undefined)?.__schema ?? (j as { __schema?: { types?: unknown[] } }).__schema
    if (schema) return { detected: 'graphql schema', note: `${schema.types?.length ?? 0} types (${t.length.toLocaleString('en-US')} chars)` }
    if (j.links || j.hits || j.tools) return { detected: 'json index', note: `${Object.keys(j).slice(0, 6).join(', ')} (${t.length.toLocaleString('en-US')} chars)` }
    return { detected: 'json', note: Object.keys(j).slice(0, 6).join(', ') }
  } catch { /* not json */ }
  if (/^openapi:\s*\d/m.test(t) || /^swagger:/m.test(t)) { const paths = (t.match(/^\s{2}(\/[^:\s]+):/gm) ?? []).map((l) => l.trim().replace(/:$/, '')); return { detected: 'openapi (yaml)', note: `${paths.length} paths, ${t.length.toLocaleString('en-US')} chars`, paths } }
  if (/<OAI-PMH|<Identify>/.test(t)) return { detected: 'oai-pmh identify', note: /<repositoryName>([^<]*)/.exec(t)?.[1] ?? 'identify' }
  if (/<html/i.test(t)) return { detected: 'html page', note: /<title>([^<]*)/i.exec(t)?.[1]?.trim().slice(0, 80) ?? 'a page: documentation for humans, no machine contract' }
  return { detected: r.type.split(';')[0] || 'unknown', note: `${t.length.toLocaleString('en-US')} chars` }
}

/** Everything that came back, read into hosts, doors, capabilities and leads. */
export const discoveryOf = (answers: readonly Answer[], verifiers: readonly Verifier[]): Discovery => {
  const hosts: Host[] = []
  const mcpHosts = [...new Set(answers.filter((a) => a.purpose === 'mcp-list').map((a) => a.host))]
  for (const host of mcpHosts) {
    const list = answers.find((a) => a.id === idOf('mcp-list', host))!
    const r = resultOf(list)
    const wk = answers.find((a) => a.id === idOf('well-known', host))
    if (!r.result) { hosts.push({ host, kind: 'mcp', contract: list.url, status: list.status, detected: list.status === 401 ? 'auth required' : 'unreachable', note: list.status === 401 ? `${KNOWN_MCP.find((c) => c.host === host)?.about ?? 'an MCP host'}: answers 401 until the tenant brings its token; once open: ${KNOWN_MCP.find((c) => c.host === host)?.maps ?? 'its doors join the catalogue'}` : r.error ?? 'no answer', doors: [] }); if (wk) hosts.push({ host, kind: 'well-known', contract: wk.url, status: wk.status, ...detect(wk) }); continue }
    const doors: Door[] = (r.result.tools as Parameters<typeof doorOf>[0][]).map((t) => doorOf(t, 'tools/list'))
    let note = `${doors.length} tools in tools/list`
    const cat = answers.find((a) => a.id === idOf('catalogue', host))
    const cr = cat ? resultOf(cat) : { error: 'not asked' }
    if (cr.result) {
      const names = (Array.isArray(cr.result) ? cr.result : cr.result.tools ?? []) as { name: string; description: string }[]
      const listed = new Set(doors.map((d) => d.name)); let read = 0
      for (const t of names) {
        if (listed.has(t.name)) continue
        const contract = answers.find((a) => a.id === idOf('contract', host, t.name))
        const c = contract ? resultOf(contract) : null
        if (c?.result && typeof c.result === 'object') { doors.push(doorOf({ ...(c.result as object), name: t.name, description: t.description }, 'catalogue')); read += 1 }
        else doors.push({ ...doorOf({ name: t.name, description: t.description }, 'catalogue'), description: `${t.description}${c?.error ? ` (contract unread: ${c.error})` : ''}` })
      }
      note += `; ${names.length} in the catalogue door, ${read} contracts read`
    } else note += `; catalogue door: ${cr.error}`
    hosts.push({ host, kind: 'mcp', contract: list.url, status: 200, detected: 'mcp tools/list', note, doors })
    if (wk) hosts.push({ host, kind: 'well-known', contract: wk.url, status: wk.status, ...detect(wk) })
  }
  for (const st of STANDARDS) { const a = answers.find((x) => x.purpose === 'api-contract' && x.name === st.id); hosts.push(a ? { host: a.host, kind: 'api', contract: st.contract, status: a.status, ...detect(a) } : { host: new URL(st.contract).host, kind: 'api', contract: st.contract, status: 0, detected: 'not asked', note: `${st.name}: the client did not fetch this standard` }) }
  for (const v of verifiers) {
    if (!v.contract) { hosts.push({ host: new URL(v.docs).host, kind: 'api', contract: v.docs, status: 0, detected: 'no machine contract named', note: `${v.id}: the registry names documentation for humans only; a lead` }); continue }
    const a = answers.find((x) => x.purpose === 'api-contract' && x.name === v.id)
    hosts.push(a ? { host: a.host, kind: 'api', contract: v.contract, status: a.status, ...detect(a) } : { host: new URL(v.contract).host, kind: 'api', contract: v.contract, status: 0, detected: 'not asked', note: 'the client did not fetch this contract' })
  }
  const doors = hosts.flatMap((h) => (h.doors ?? []).map((d) => ({ host: h.host, url: h.contract, ...d })))
  const takesAny = (d: Door, ks: string[]) => d.takes.some((t) => ks.includes(t))
  const capabilities = {
    statementVerdict: doors.filter((d) => takesAny(d, ['statement', 'claim', 'input', 'deposits']) && d.answers.some((a) => ['verdict', 'deposited', 'sealed', 'verified', 'proofRoot'].includes(a)) && d.required.every((r) => (TAKES as readonly string[]).includes(r))).map((d) => d.name),
    signing: doors.filter((d) => d.answers.includes('signed')).map((d) => d.name),
    readiness: doors.filter((d) => d.answers.includes('ready')).map((d) => d.name),
    addressing: doors.filter((d) => d.takes.includes('value') && d.answers.includes('address')).map((d) => d.name),
    rbac: doors.filter((d) => d.takes.includes('token') && d.answers.includes('role')).map((d) => d.name),
    // the metaphysical doors: the vortex, its reflection, the units and the triad, the pentagram, the fibonacci cycle, the double torus, the involution — the arithmetic mod 9 that the tree reads from every UUID's tail
    metaphysics: doors.filter((d) => /vortex|pentagram|fibonacci|triad|torus|involution|units|digital_root|living_field|gravity|spin|coprime|crt|diamond|sequence/.test(d.name)).map((d) => d.name),
  }
  const leads = [
    ...hosts.filter((h) => h.kind === 'mcp' && h.detected === 'auth required').map((h) => ({ id: `mcp-auth-${h.host}`, source: h.contract, statement: `${h.host} answers 401 without a token: ${h.note}`, status: 'open' as const, reason: 'tenant configurable: the operator sets QPU_MCP_TOKEN_<HOST> for the tenant and discovery reads the host\'s doors on the next run; nothing is assumed about them' })),
    ...hosts.filter((h) => h.kind === 'api' && !/^openapi|json index|oai-pmh|json-ld|cldr|graphql/.test(h.detected)).map((h) => ({ id: `contract-${h.host}`, source: h.contract, statement: `${h.host} publishes no machine-readable contract at the address the registry names (${h.detected})`, status: 'open' as const, reason: 'the client is built from documentation read by a person; an OpenAPI or index document would let it be built from the host' })),
  ]
  return { hosts, doors, capabilities, leads }
}

/** The discovery page, from the discovery alone. */
export const discoveryPageOf = (d: Discovery, date: string): string => ['---', 'title: Discovery', 'order: 46', '---', '', '# Discovery before use', '',
  `Every host this tree talks to, asked for its contract on ${date} by \`npm run next\` through the \`discover\` tool: MCP hosts for tools/list and their catalogue door, API hosts for the OpenAPI, index or identify document the verifiers registry names, both domains for \`/.well-known/qpu.json\`. The client tools choose their doors from this table by capability, never from a name in code.`, '',
  '| Host | Kind | Contract | Status | Detected | Note |', '|---|---|---|---:|---|---|', ...d.hosts.map((h) => `| ${h.host} | ${h.kind} | ${h.contract} | ${h.status || '—'} | ${h.detected} | ${h.note.replace(/\|/g, '\\|')} |`), '',
  '## Capabilities found', '', `Statement → verdict: ${d.capabilities.statementVerdict.join(', ') || 'none'}. Signing: ${d.capabilities.signing.join(', ') || 'none'}. Readiness: ${d.capabilities.readiness.join(', ') || 'none'}. Addressing: ${d.capabilities.addressing.join(', ') || 'none'}. RBAC (a token in, a role out): ${d.capabilities.rbac.join(', ') || 'none: roles come from the tenant secrets until a Payload MCP host is named'}. Metaphysics (the arithmetic mod 9 every tail carries): ${d.capabilities.metaphysics.join(', ') || 'none'}.`, '',
  '## Doors', '', `${d.doors.length} doors across ${d.hosts.filter((h) => h.kind === 'mcp').length} MCP host(s).`, '',
  '| Host | Door | Takes | Required | Answers | Read-only | From |', '|---|---|---|---|---|---|---|', ...d.doors.map((x) => `| ${x.host} | ${x.name} | ${x.takes.join(', ') || '—'} | ${x.required.join(', ') || '—'} | ${x.answers.join(', ') || '—'} | ${x.readOnly === null ? '?' : x.readOnly} | ${x.contract} |`), '',
  '## Leads', '', ...(d.leads.length ? d.leads.map((l) => `- \`${l.id}\`: ${l.statement}`) : ['none: every API host published a contract']), ''].join('\n')

/** The public MCP registry: a lead's distinctive words asked there first, before any guess about which MCP serves it. */
export const MCP_REGISTRY = 'https://registry.modelcontextprotocol.io/v0/servers'
const REGISTRY_STOP = new Set(['the', 'a', 'an', 'of', 'to', 'in', 'on', 'for', 'and', 'or', 'is', 'are', 'it', 'its', 'with', 'by', 'as', 'at', 'from', 'this', 'that', 'every', 'any', 'all', 'no', 'not', 'be', 'into', 'over', 'through', 'here', 'there', 'one', 'two', 'per', 'via', 'tool', 'tools', 'lead', 'leads', 'qpu', 'tree', 'unit', 'served', 'open'])
/** The words of a lead worth asking: its own, without the stop words, the longest first; each a registry search. */
export const registryWordsOf = (lead: { id: string; statement: string; source?: string }, at = 3): string[] => {
  const words = lead.statement.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter((w) => w.length > 3 && !REGISTRY_STOP.has(w) && !/^\d+$/.test(w))
  const counts = new Map<string, number>(); for (const w of words) counts.set(w, (counts.get(w) ?? 0) + 1)
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || b[0].length - a[0].length).slice(0, at).map(([w]) => w)
}
export type RegistryRequest = { id: string; lead: string; word: string; method: 'GET'; url: string; accept: string }
export const registryRequestsOf = (lead: { id: string; statement: string; source?: string }, at = 3): RegistryRequest[] => registryWordsOf(lead, at).map((word) => ({ id: `registry:${lead.id}:${word}`, lead: lead.id, word, method: 'GET' as const, url: `${MCP_REGISTRY}?search=${encodeURIComponent(word)}&limit=10`, accept: 'application/json' }))
export type RelatedServer = { name: string; description: string; remotes: string[]; word: string }
/** The registry's answers read into the servers related to the lead, and the one tools/list request per remote that extends each through qpu. */
export const relatedOf = (lead: string, answers: readonly { id: string; word?: string; status: number; text: string }[]): { lead: string; asked: number; answered: number; servers: RelatedServer[]; extend: { id: string; server: string; method: 'POST'; url: string; accept: string; body: unknown }[] } => {
  const servers = new Map<string, RelatedServer>()
  let answered = 0
  for (const a of answers) {
    if (a.status !== 200) continue
    try {
      const j = JSON.parse(a.text) as { servers?: { server?: { name?: string; description?: string; remotes?: { url?: string }[] }; name?: string; description?: string; remotes?: { url?: string }[] }[] }
      answered += 1
      for (const x of j.servers ?? []) { const srv = x.server ?? x; const name = srv.name ?? ''; if (!name || servers.has(name)) continue; servers.set(name, { name, description: (srv.description ?? '').slice(0, 200), remotes: (srv.remotes ?? []).map((r) => r.url).filter((u): u is string => typeof u === 'string' && /^https?:\/\//.test(u)), word: a.word ?? '' }) }
    } catch { /* not the registry's shape: nothing related read from it */ }
  }
  const extend = [...servers.values()].flatMap((s) => s.remotes.map((url) => ({ id: `extend:${lead}:${s.name}:${new URL(url).host}`, server: s.name, method: 'POST' as const, url, accept: 'application/json, text/event-stream', body: rpcBody('tools/list') })))
  return { lead, asked: answers.length, answered, servers: [...servers.values()], extend }
}

/** The foreign doors that answer a lead best: a remote's tools/list read into doors, each scored by the stems it shares with the lead (its name and description against the lead's statement, token meeting tokens, server meeting servers), the top ones proposed — never called: calling another's server is the operator's act. */
export const bestDoorsOf = (lead: { id: string; statement: string }, remotes: readonly { server: string; url: string; tools: readonly { name: string; description?: string }[] }[], at = 3): { server: string; url: string; door: string; score: number; shared: string[] }[] => {
  const words = new Set(registryWordsOf(lead, 12).map(stem))
  const out: { server: string; url: string; door: string; score: number; shared: string[] }[] = []
  for (const r of remotes) for (const t of r.tools) {
    const text = `${t.name.replace(/[_-]+/g, ' ')} ${t.description ?? ''}`.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).map(stem)
    const shared = [...new Set(text.filter((w) => words.has(w)))]
    if (shared.length) out.push({ server: r.server, url: r.url, door: t.name, score: shared.length, shared })
  }
  return out.sort((a, b) => b.score - a.score || a.door.localeCompare(b.door)).slice(0, at)
}
