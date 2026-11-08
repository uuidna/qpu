// The three admin APIs as one UUID program: Payload's own (REST, GraphQL, its MCP plugin), Cloudflare's (the API MCP server, its domain
// servers, the OpenAPI contract) and Google's (the Discovery documents, the googleapis.com MCP servers). Every door and every operation is
// one row addressed by its UUID (uuid(provider\nmethod server/path)), sealed, so the admin, the endpoint and the stream read one index.
// The Cloudflare meters are priced from Cloudflare's published tables; the cost is the fold Σ max(0, used − included) × rate, zero inside the
// allowances (textbook_bill_covered). Nothing is fetched here: the readings come in, the contracts come in, the rows come out.
import { seal, uuid } from '../../index.ts'
import { TABLES } from '../../../processing/tables-index.ts'
import { SHADCN_COMPONENTS, SHADCN_MCP } from '../shadcn/index.ts'

export type ApiDoor = { provider: 'payload' | 'cloudflare' | 'google' | 'shadcn'; kind: 'mcp' | 'rest' | 'graphql' | 'openapi' | 'discovery' | 'registry'; name: string; url: string; about: string; maps: string }
export type ApiRow = ApiDoor & { address: string; sealed: boolean }

/** Cloudflare's MCP servers, as https://github.com/cloudflare/mcp-server-cloudflare lists them (read 2026-11-08): the API server first (recommended), then the domain servers; each mapped to what it is for the Payload plugin. */
export const CLOUDFLARE_MCP: readonly ApiDoor[] = [
  { provider: 'cloudflare', kind: 'mcp', name: 'api', url: 'https://mcp.cloudflare.com/mcp', about: 'the Cloudflare API MCP server: broad access across the APIs through code execution', maps: 'the qpu-cloudflare-call job: every call planned against the held OpenAPI operations, the token the tenant bindings name' },
  { provider: 'cloudflare', kind: 'mcp', name: 'observability', url: 'https://observability.mcp.cloudflare.com/mcp', about: 'Workers logs and analytics', maps: 'the qpu-cloudflare-observe job: requests, CPU time, D1 rows, R2 operations, log events read into the qpu global' },
  { provider: 'cloudflare', kind: 'mcp', name: 'graphql', url: 'https://graphql.mcp.cloudflare.com/mcp', about: 'analytics through the GraphQL Analytics API', maps: 'the observe job\'s datasets: workersInvocationsAdaptive, d1AnalyticsAdaptiveGroups, r2OperationsAdaptiveGroups' },
  { provider: 'cloudflare', kind: 'mcp', name: 'bindings', url: 'https://bindings.mcp.cloudflare.com/mcp', about: 'Workers bindings: storage, AI, compute', maps: 'the adapters profile cloudflare: D1, R2, KV, Durable Objects as the app\'s wrangler bindings' },
  { provider: 'cloudflare', kind: 'mcp', name: 'builds', url: 'https://builds.mcp.cloudflare.com/mcp', about: 'Workers Builds insight and management', maps: 'the machine\'s dispatch of deploy.yml: a build read back as its receipt' },
  { provider: 'cloudflare', kind: 'mcp', name: 'logpush', url: 'https://logs.mcp.cloudflare.com/mcp', about: 'Logpush job health', maps: 'a paid route the observe job names only when logs exceed the included events' },
  { provider: 'cloudflare', kind: 'mcp', name: 'auditlogs', url: 'https://auditlogs.mcp.cloudflare.com/mcp', about: 'audit logs and reports', maps: 'the docket: every account change an entry beside the app\'s own calls' },
  { provider: 'cloudflare', kind: 'mcp', name: 'docs', url: 'https://docs.mcp.cloudflare.com/mcp', about: 'up-to-date Cloudflare reference', maps: 'the leads: a remedy cites its page' },
  { provider: 'cloudflare', kind: 'mcp', name: 'radar', url: 'https://radar.mcp.cloudflare.com/mcp', about: 'Cloudflare Radar internet insights', maps: 'the match tool\'s news and search sources' },
  { provider: 'cloudflare', kind: 'mcp', name: 'ai-gateway', url: 'https://ai-gateway.mcp.cloudflare.com/mcp', about: 'AI Gateway logs, prompts and responses', maps: 'free AI by hooks: Gemini first, every route logged through the gateway' },
  { provider: 'cloudflare', kind: 'openapi', name: 'openapi', url: 'https://raw.githubusercontent.com/cloudflare/api-schemas/main/openapi.json', about: 'the Cloudflare API contract (OpenAPI 3, 27.8 MB on 2026-11-08)', maps: 'entries of kind openapi-operation held in Payload: the call job allows a path only when an operation names it' },
  { provider: 'cloudflare', kind: 'graphql', name: 'analytics', url: 'https://api.cloudflare.com/client/v4/graphql', about: 'the GraphQL Analytics API endpoint', maps: 'the observe job posts its one query here with the Account Analytics Read token' },
]
/** Payload's own doors of the app: its REST, GraphQL and MCP under the app's origin. */
export const payloadDoors = (origin: string): readonly ApiDoor[] => [
  { provider: 'payload', kind: 'rest', name: 'rest', url: `${origin}/api`, about: 'Payload\'s REST API: every collection and global', maps: 'the merged index: one operation row per collection verb and per global' },
  { provider: 'payload', kind: 'graphql', name: 'graphql', url: `${origin}/api/graphql`, about: 'Payload\'s GraphQL API', maps: 'the same collections and globals as one schema' },
  { provider: 'payload', kind: 'mcp', name: 'mcp', url: `${origin}/api/mcp`, about: 'the Payload MCP plugin serving the QPU\'s tools', maps: 'the door every other door is reached through' },
]
/** Google's MCP servers from the table Payload holds, as doors of this program. */
export const googleDoors = (): readonly ApiDoor[] => (TABLES.GOOGLE_MCP as readonly { host: string; url: string; about: string; maps: string }[]).map((g) => ({ provider: 'google', kind: 'mcp', name: g.host.replace(/\.googleapis\.com$/, ''), url: g.url, about: g.about, maps: g.maps }))

/** shadcn as a door of the QPU, not a second server: its MCP (npx shadcn@latest mcp) answers from the public registry, so the registry index is the
 *  contract and every tool of that MCP is served here from it (textbook: the shadcn program already gives each item its UUID). */
export const SHADCN_DOORS: readonly ApiDoor[] = [
  { provider: 'shadcn', kind: 'registry', name: 'registry', url: SHADCN_MCP.registry, about: 'the shadcn registry index: every registry:ui item, the contract the shadcn MCP reads', maps: 'apis { shadcn }: list, search, view and the add command answered from this index; each item one UUID program (shadcnPrograms)' },
  { provider: 'shadcn', kind: 'mcp', name: 'mcp', url: 'https://ui.shadcn.com/docs/mcp', about: `the shadcn MCP server (${SHADCN_MCP.command} ${SHADCN_MCP.args.join(' ')}): registries, items, examples, add commands, an audit checklist`, maps: 'folded into the QPU: the same seven tools reached through qpu, so no second server is declared in .mcp.json' },
  { provider: 'shadcn', kind: 'rest', name: 'create', url: SHADCN_MCP.create, about: 'the shadcn create page: a preset of components, styled from a URL', maps: 'the shadcn program\'s shadcnCreatePreset: a preset addressed by UUID' },
]
/** The shadcn MCP's tools (https://ui.shadcn.com/docs/mcp) as operations of this program, each served by apis { shadcn } from the registry contract. */
export const SHADCN_TOOLS = ['get_project_registries', 'list_items_in_registries', 'search_items_in_registries', 'view_items_in_registries', 'get_item_examples_from_registries', 'get_add_command_for_items', 'get_audit_checklist'] as const
export const shadcnOperations = (index: { items?: readonly { name: string; type?: string }[] } = {}): Operation[] => {
  const server = 'https://ui.shadcn.com'
  const items = index.items?.length ? index.items.map((i) => i.name) : SHADCN_COMPONENTS
  return [
    ...SHADCN_TOOLS.map((tool) => ({ provider: 'shadcn' as const, method: 'TOOL', server, path: `/mcp/${tool}`, id: tool, tags: ['mcp', 'shadcn'] })),
    ...items.map((name) => ({ provider: 'shadcn' as const, method: 'GET', server, path: `/r/${name}.json`, id: `registry:ui.${name}`, tags: ['registry:ui', 'shadcn'] })),
  ]
}
/** The shadcn MCP's surface answered from the registry contract: the registries a project names, the items (listed, searched, viewed with their
 *  URLs and UUID addresses), the add command for items. Nothing is fetched; the index given stands for the registry, else the saved component list. */
export const shadcnSurface = (ask: { registries?: Record<string, string>; search?: string; items?: readonly string[]; index?: { items?: readonly { name: string; type?: string; description?: string }[] } } = {}) => {
  const registries = { '@shadcn': 'https://ui.shadcn.com/r/{name}.json', ...(ask.registries ?? {}) }
  const known = ask.index?.items?.length ? ask.index.items.map((i) => ({ name: i.name, type: i.type ?? 'registry:ui', description: i.description ?? '' })) : SHADCN_COMPONENTS.map((name) => ({ name, type: 'registry:ui', description: '' }))
  const q = ask.search?.toLowerCase().trim()
  const found = q ? known.filter((i) => i.name.includes(q) || i.description.toLowerCase().includes(q)) : known
  const wanted = ask.items?.length ? known.filter((i) => ask.items!.includes(i.name)) : found
  const missing = (ask.items ?? []).filter((n) => !known.some((i) => i.name === n))
  const view = wanted.map((i) => { const address = uuid(`shadcn\n${i.name}`); return { ...i, url: registries['@shadcn']!.replace('{name}', i.name), address, sealed: seal(address).valid } })
  const add = view.length ? `npx shadcn@latest add ${view.map((i) => i.name).join(' ')}` : null
  return { phase: 'shadcn' as const, registries, tools: SHADCN_TOOLS, items: known.length, found: found.length, view, missing, add, holds: view.every((i) => i.sealed && i.address.length === 36) && missing.length === 0, theorem: 'textbook_uuid_is_36' as const }
}
const rowOf = (d: ApiDoor): ApiRow => { const address = uuid(`${d.provider}\n${d.kind} ${d.url}`); return { ...d, address, sealed: seal(address).valid } }
/** Every door of the three providers, addressed and sorted by address: the stream the admin reads. */
export const apisDoors = (origin = 'https://qpu.uuidna.com') => {
  const rows = [...payloadDoors(origin), ...CLOUDFLARE_MCP, ...googleDoors(), ...SHADCN_DOORS].map(rowOf).sort((a, b) => (a.address < b.address ? -1 : 1))
  const byProvider = { payload: rows.filter((r) => r.provider === 'payload').length, cloudflare: rows.filter((r) => r.provider === 'cloudflare').length, google: rows.filter((r) => r.provider === 'google').length, shadcn: rows.filter((r) => r.provider === 'shadcn').length }
  return { phase: 'doors' as const, rows, byProvider, total: rows.length, holds: rows.every((r) => r.sealed && r.address.length === 36), theorem: 'textbook_uuid_is_36' as const }
}

/** Cloudflare's meters on the Workers Paid plan, from its pricing pages (read 2026-11-08): the included allowance a month, the rate past it in micro-dollars per unit (the same number as USD per million units), the remedy that lowers the meter. Workers Logs moves to Observability pricing on 2026-12-01 (50 GB ingested and 10 GB-month included). */
export type Meter = { meter: string; unit: string; included: number; perMillionUsd: number; source: string; remedy: string }
export const CLOUDFLARE_PRICING: readonly Meter[] = [
  { meter: 'workers.requests', unit: 'requests', included: 10_000_000, perMillionUsd: 0.30, source: 'https://developers.cloudflare.com/workers/platform/pricing/', remedy: 'cache-control on the public reads (the feeds, the discovery document, the registry); static assets served by the ASSETS binding, never by the Worker' },
  { meter: 'workers.cpuMs', unit: 'CPU milliseconds', included: 30_000_000, perMillionUsd: 0.02, source: 'https://developers.cloudflare.com/workers/platform/pricing/', remedy: 'answer from the content address before recomputing; keep the heavy recompute in jobs on AC (battery: zero compute)' },
  { meter: 'd1.rowsRead', unit: 'rows read', included: 25_000_000_000, perMillionUsd: 0.001, source: 'https://developers.cloudflare.com/d1/platform/pricing/', remedy: 'an index on every column a where filters on; wrangler d1 insights names the queries that scan' },
  { meter: 'd1.rowsWritten', unit: 'rows written', included: 50_000_000, perMillionUsd: 1.00, source: 'https://developers.cloudflare.com/d1/platform/pricing/', remedy: 'no row per page view (events are log lines); one entry per call, never per retry' },
  { meter: 'r2.classA', unit: 'class A operations', included: 1_000_000, perMillionUsd: 4.50, source: 'https://developers.cloudflare.com/r2/pricing/', remedy: 'write media once by content address; list with prefixes, never whole buckets' },
  { meter: 'r2.classB', unit: 'class B operations', included: 10_000_000, perMillionUsd: 0.36, source: 'https://developers.cloudflare.com/r2/pricing/', remedy: 'cache media at the edge (cache-control, immutable by address)' },
  { meter: 'logs.events', unit: 'log events', included: 20_000_000, perMillionUsd: 0.60, source: 'https://developers.cloudflare.com/workers/observability/logs/workers-logs/#pricing', remedy: 'observability.logs.head_sampling_rate below 1 in wrangler.jsonc; one structured line per event, no per-request chatter' },
  // storage is billed per GB-month, so its dollar price per unit stands in the per-million column times a million: D1 "First 5 GB included + $0.75 / GB-mo" (the sum of all databases in the account), R2 Standard "10 GB-month / month" free then "$0.015 / GB-month", usage rounded up to the next billing unit (both pages read 2026-11-08)
  { meter: 'd1.storage', unit: 'GB-month', included: 5, perMillionUsd: 750_000, source: 'https://developers.cloudflare.com/d1/platform/pricing/', remedy: 'bodies by content address in R2, one row per entry in D1; wrangler d1 info names the database size; drop the versions no document names' },
  { meter: 'r2.storage', unit: 'GB-month', included: 10, perMillionUsd: 15_000, source: 'https://developers.cloudflare.com/r2/pricing/', remedy: 'one object per content address (a repeated upload stores nothing new); a lifecycle rule expiring the uploads no entry names' },
]
export type Readings = Partial<Record<string, number>>
/** The Workers Logs sampling an operator sets (observability.logs.head_sampling_rate in wrangler.jsonc, 0 to 1, default 1), given as that fraction or in permille; nothing given is 1000‰, the full stream. */
export type CostOptions = { headSamplingRate?: number; headSamplingPermille?: number }
export const samplingPermilleOf = (o: CostOptions = {}): number => {
  const given = typeof o.headSamplingPermille === 'number' && Number.isFinite(o.headSamplingPermille) ? o.headSamplingPermille : typeof o.headSamplingRate === 'number' && Number.isFinite(o.headSamplingRate) ? (o.headSamplingRate <= 1 ? o.headSamplingRate * 1000 : o.headSamplingRate) : 1000
  return Math.min(1000, Math.max(0, Math.round(given)))
}
/** Every meter priced: used floored to a unit, the overage past the allowance, the rate as integer micro-dollars per million units so the product is exact, the share of the allowance in whole percent, a lead at 80%. */
const priceRows = (readings: Readings, pricing: readonly Meter[]) => pricing.map((m) => { const used = Math.max(0, Math.floor(readings[m.meter] ?? 0)); const over = Math.max(0, used - m.included); const microUsd = Math.ceil((over * Math.round(m.perMillionUsd * 1_000_000)) / 1_000_000); const share = m.included ? Math.floor((used * 100) / m.included) : 0; return { ...m, used, over, share, microUsd, lead: share >= 80 } })
/** The bill of the readings against the meters, in integer micro-dollars: zero inside every allowance, Σ max(0, used − included) × rate past them.
 *  At a head sampling rate the log events priced are the readings' events × rate (floored, in permille), and `sampling` answers the logs meter at that
 *  rate and at the full stream, so an operator sees what the sample saves; with no rate given the two are equal and nothing else changes. */
export const apisCost = (readings: Readings, pricing: readonly Meter[] = CLOUDFLARE_PRICING, options: CostOptions = {}) => {
  const permille = samplingPermilleOf(options), events = Math.max(0, Math.floor(readings['logs.events'] ?? 0)), sampled = Math.floor((events * permille) / 1000)
  const rows = priceRows(permille === 1000 ? readings : { ...readings, 'logs.events': sampled }, pricing)
  const atRate = rows.find((r) => r.meter === 'logs.events')?.microUsd ?? 0, atFull = permille === 1000 ? atRate : priceRows(readings, pricing).find((r) => r.meter === 'logs.events')?.microUsd ?? 0
  const microUsd = rows.reduce((n, r) => n + r.microUsd, 0)
  const leads = rows.filter((r) => r.lead).map((r) => ({ id: `cloudflare-${r.meter.replace('.', '-')}-${r.share}`, statement: `${r.meter} at ${r.share}% of the included ${r.included.toLocaleString('en')} ${r.unit} this month (${r.used.toLocaleString('en')}): ${r.remedy}`, status: 'open' as const, tool: 'apis' as const, source: r.source }))
  const sampling = { permille, rate: permille / 1000, events, sampled, microUsd: atRate, microUsdFull: atFull, savedMicroUsd: atFull - atRate }
  return { phase: 'cost' as const, rows, microUsd, usd: microUsd / 1_000_000, covered: microUsd === 0, leads, sampling, theorem: 'textbook_bill_covered' as const }
}

export type Operation = { provider: 'payload' | 'cloudflare' | 'google' | 'shadcn'; method: string; server: string; path: string; id: string; tags: readonly string[] }
export type OperationRow = Operation & { address: string; sealed: boolean }
/** Payload's REST operations from its config: five verbs a collection, two a global. */
export const payloadOperations = (config: { collections?: readonly { slug: string }[]; globals?: readonly { slug: string }[] }, server = 'https://qpu.uuidna.com'): Operation[] => [
  ...(config.collections ?? []).flatMap((c) => [['GET', `/api/${c.slug}`, 'find'], ['POST', `/api/${c.slug}`, 'create'], ['GET', `/api/${c.slug}/{id}`, 'findByID'], ['PATCH', `/api/${c.slug}/{id}`, 'update'], ['DELETE', `/api/${c.slug}/{id}`, 'delete']].map(([method, path, verb]) => ({ provider: 'payload' as const, method: method!, server, path: path!, id: `${c.slug}.${verb}`, tags: ['collections', c.slug] }))),
  ...(config.globals ?? []).flatMap((g) => [['GET', 'findGlobal'], ['POST', 'updateGlobal']].map(([method, verb]) => ({ provider: 'payload' as const, method: method!, server, path: `/api/globals/${g.slug}`, id: `${g.slug}.${verb}`, tags: ['globals', g.slug] }))),
]
/** Cloudflare's operations from its OpenAPI paths (the whole document or the held entries), each with its operationId and tags. */
export const cloudflareOperations = (openapi: { servers?: readonly { url: string }[]; paths?: Record<string, Record<string, { operationId?: string; tags?: readonly string[] }>> }): Operation[] => {
  const server = openapi.servers?.[0]?.url ?? 'https://api.cloudflare.com/client/v4'
  return Object.entries(openapi.paths ?? {}).flatMap(([path, methods]) => Object.entries(methods).filter(([m]) => /^(get|post|put|patch|delete|head|options)$/.test(m)).map(([m, op]) => ({ provider: 'cloudflare' as const, method: m.toUpperCase(), server, path, id: op.operationId ?? `${m}:${path}`, tags: op.tags ?? [] })))
}
/** Google's operations from a Discovery document's methods (top level and resources), as one list. */
export const googleOperations = (discovery: { name?: string; version?: string; rootUrl?: string; servicePath?: string; methods?: Record<string, { httpMethod: string; path: string; id?: string }>; resources?: Record<string, unknown> }): Operation[] => {
  const server = `${discovery.rootUrl ?? 'https://www.googleapis.com/'}${discovery.servicePath ?? ''}`.replace(/\/$/, '')
  const walk = (node: { methods?: Record<string, { httpMethod: string; path: string; id?: string }>; resources?: Record<string, unknown> }, tags: string[]): Operation[] => [
    ...Object.entries(node.methods ?? {}).map(([name, m]) => ({ provider: 'google' as const, method: m.httpMethod, server, path: `/${m.path}`, id: m.id ?? [...tags, name].join('.'), tags })),
    ...Object.entries(node.resources ?? {}).flatMap(([name, r]) => walk(r as typeof node, [...tags, name])),
  ]
  return walk(discovery, [discovery.name ?? 'google', discovery.version ?? 'v1'].filter(Boolean))
}
/** The merged index: every operation of the three providers one addressed row, counted by provider and by tag, sorted by address. */
export const apisIndex = (ops: readonly Operation[]) => {
  const rows: OperationRow[] = ops.map((o) => { const address = uuid(`${o.provider}\n${o.method} ${o.server}${o.path}`); return { ...o, address, sealed: seal(address).valid } }).sort((a, b) => (a.address < b.address ? -1 : 1))
  const byProvider = { payload: rows.filter((r) => r.provider === 'payload').length, cloudflare: rows.filter((r) => r.provider === 'cloudflare').length, google: rows.filter((r) => r.provider === 'google').length, shadcn: rows.filter((r) => r.provider === 'shadcn').length }
  const byTag: Record<string, number> = {}
  for (const r of rows) for (const t of r.tags) byTag[t] = (byTag[t] ?? 0) + 1
  const distinct = new Set(rows.map((r) => r.address)).size
  return { phase: 'index' as const, rows, byProvider, byTag, total: rows.length, distinct, holds: distinct === rows.length && rows.every((r) => r.sealed && r.address.length === 36), theorem: 'textbook_uuid_is_36' as const }
}
/** The one GraphQL query of the observe job: month-to-date requests, errors, CPU quantiles, D1 rows and storage, R2 operations and storage for the account; the datasets as D1's and R2's metrics pages name them (https://developers.cloudflare.com/d1/observability/metrics-analytics/, https://developers.cloudflare.com/r2/platform/metrics-analytics/, read 2026-11-08). */
export const OBSERVE_QUERY = `query QpuObserve($accountTag: string!, $since: Time!, $until: Time!) {
  viewer { accounts(filter: { accountTag: $accountTag }) {
    workersInvocationsAdaptive(limit: 10000, filter: { datetime_geq: $since, datetime_leq: $until }) { sum { requests errors } quantiles { cpuTimeP50 cpuTimeP99 } }
    d1AnalyticsAdaptiveGroups(limit: 10000, filter: { datetime_geq: $since, datetime_leq: $until }) { sum { readQueries writeQueries rowsRead rowsWritten } }
    r2OperationsAdaptiveGroups(limit: 10000, filter: { datetime_geq: $since, datetime_leq: $until }) { dimensions { actionType } sum { requests } }
    d1StorageAdaptiveGroups(limit: 10000, filter: { datetime_geq: $since, datetime_leq: $until }) { dimensions { databaseId } max { databaseSizeBytes } }
    r2StorageAdaptiveGroups(limit: 10000, filter: { datetime_geq: $since, datetime_leq: $until }) { dimensions { bucketName } max { payloadSize metadataSize } }
  } }
}`
const R2_CLASS_A = new Set(['PutObject', 'CopyObject', 'ListObjects', 'CreateMultipartUpload', 'UploadPart', 'CompleteMultipartUpload', 'ListParts', 'PutBucket', 'ListBuckets', 'PutBucketEncryption', 'PutBucketCors', 'PutBucketLifecycleConfiguration', 'LifecycleStorageTierTransition', 'PutObjectRetention'])
/** Bytes stored as billing units: GB-month, the usage rounded up to the next unit as R2's pricing page says it bills (read 2026-11-08), a GB taken as 10⁹ bytes. */
const GB = 1_000_000_000
const gbOf = (bytes: number) => Math.ceil(Math.max(0, bytes) / GB)
/** The GraphQL answer read into meter readings (requests and CPU ms summed over the invocations, D1 rows summed, R2 operations split by class, the storage meters as the month's peak bytes per database and per bucket summed and rounded up to GB-month). */
export const readingsOf = (answer: { data?: { viewer?: { accounts?: { workersInvocationsAdaptive?: { sum: { requests: number; errors: number }; quantiles?: { cpuTimeP50?: number; cpuTimeP99?: number } }[]; d1AnalyticsAdaptiveGroups?: { sum: { readQueries: number; writeQueries: number; rowsRead: number; rowsWritten: number } }[]; r2OperationsAdaptiveGroups?: { dimensions: { actionType: string }; sum: { requests: number } }[]; d1StorageAdaptiveGroups?: { dimensions?: { databaseId?: string }; max?: { databaseSizeBytes?: number } }[]; r2StorageAdaptiveGroups?: { dimensions?: { bucketName?: string }; max?: { payloadSize?: number; metadataSize?: number } }[] }[] } } }): Readings & { errors: number; cpuTimeP50Us: number; cpuTimeP99Us: number; d1StorageBytes: number; r2StorageBytes: number } => {
  const a = answer.data?.viewer?.accounts?.[0] ?? {}
  const inv = a.workersInvocationsAdaptive ?? [], d1 = a.d1AnalyticsAdaptiveGroups ?? [], r2 = a.r2OperationsAdaptiveGroups ?? [], d1s = a.d1StorageAdaptiveGroups ?? [], r2s = a.r2StorageAdaptiveGroups ?? []
  const requests = inv.reduce((n, x) => n + (x.sum?.requests ?? 0), 0), errors = inv.reduce((n, x) => n + (x.sum?.errors ?? 0), 0)
  const p50 = inv.length ? Math.round(inv.reduce((n, x) => n + (x.quantiles?.cpuTimeP50 ?? 0), 0) / inv.length) : 0, p99 = inv.reduce((n, x) => Math.max(n, x.quantiles?.cpuTimeP99 ?? 0), 0)
  const d1StorageBytes = d1s.reduce((n, x) => n + (x.max?.databaseSizeBytes ?? 0), 0), r2StorageBytes = r2s.reduce((n, x) => n + (x.max?.payloadSize ?? 0) + (x.max?.metadataSize ?? 0), 0)
  return { 'workers.requests': requests, 'workers.cpuMs': Math.ceil((requests * p50) / 1000), 'd1.rowsRead': d1.reduce((n, x) => n + (x.sum?.rowsRead ?? 0), 0), 'd1.rowsWritten': d1.reduce((n, x) => n + (x.sum?.rowsWritten ?? 0), 0), 'r2.classA': r2.filter((x) => R2_CLASS_A.has(x.dimensions?.actionType)).reduce((n, x) => n + (x.sum?.requests ?? 0), 0), 'r2.classB': r2.filter((x) => !R2_CLASS_A.has(x.dimensions?.actionType)).reduce((n, x) => n + (x.sum?.requests ?? 0), 0), 'd1.storage': gbOf(d1StorageBytes), 'r2.storage': gbOf(r2StorageBytes), d1StorageBytes, r2StorageBytes, errors, cpuTimeP50Us: p50, cpuTimeP99Us: p99 }
}
/** The zone's request dimensions the observe job reads when a zoneTag is named: what was cached, what status the edge answered, which paths, which agents, which addresses. */
export const OBSERVE_ZONE_DIMENSIONS = ['cacheStatus', 'edgeResponseStatus', 'clientRequestPath', 'userAgent', 'clientIP'] as const
export type ZoneDimension = (typeof OBSERVE_ZONE_DIMENSIONS)[number]
/** The zone query: month-to-date HTTP requests of one zone counted per value of each dimension, one httpRequestsAdaptiveGroups group per dimension (aliased by its name) so the counts never cross-multiply, most requests first; 10000 is the API's own page, every row it returns is kept (https://developers.cloudflare.com/analytics/graphql-api/, the dataset's fields as the http_requests dataset names them, read 2026-11-08). */
export const OBSERVE_ZONE_QUERY = `query QpuObserveZone($zoneTag: string!, $since: Time!, $until: Time!) {
  viewer { zones(filter: { zoneTag: $zoneTag }) {
${OBSERVE_ZONE_DIMENSIONS.map((d) => `    ${d}: httpRequestsAdaptiveGroups(limit: 10000, filter: { datetime_geq: $since, datetime_leq: $until }, orderBy: [count_DESC]) { count dimensions { ${d} } }`).join('\n')}
  } }
}`
export type ZoneGroup = { count?: number; dimensions?: Partial<Record<ZoneDimension, string | number>> }
export type ZoneAnswer = { data?: { viewer?: { zones?: Partial<Record<ZoneDimension, ZoneGroup[]>>[] } }; errors?: { message: string }[] }
/** The zone answer read into request counts per dimension value: for each dimension every value with its count, most requests first (ties by value), none dropped;
 *  the totals per dimension, the requests (the largest total: each dimension partitions the same requests, and the adaptive sample may make them differ, `agree` says whether they do not), the top value of each. */
export const zoneReadingsOf = (answer: ZoneAnswer) => {
  const z = answer.data?.viewer?.zones?.[0] ?? {}
  const byDimension = Object.fromEntries(OBSERVE_ZONE_DIMENSIONS.map((d) => {
    const counts = new Map<string, number>()
    for (const g of z[d] ?? []) { const v = String(g.dimensions?.[d] ?? ''); counts.set(v, (counts.get(v) ?? 0) + Math.max(0, Math.floor(g.count ?? 0))) }
    return [d, [...counts].map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count || (a.value < b.value ? -1 : 1))]
  })) as Record<ZoneDimension, { value: string; count: number }[]>
  const totals = Object.fromEntries(OBSERVE_ZONE_DIMENSIONS.map((d) => [d, byDimension[d].reduce((n, v) => n + v.count, 0)])) as Record<ZoneDimension, number>
  const requests = Math.max(0, ...OBSERVE_ZONE_DIMENSIONS.map((d) => totals[d]))
  const top = Object.fromEntries(OBSERVE_ZONE_DIMENSIONS.map((d) => [d, byDimension[d][0] ?? null])) as Record<ZoneDimension, { value: string; count: number } | null>
  const errors = answer.errors ?? []
  return { phase: 'zone' as const, requests, byDimension, totals, top, values: OBSERVE_ZONE_DIMENSIONS.reduce((n, d) => n + byDimension[d].length, 0), agree: OBSERVE_ZONE_DIMENSIONS.every((d) => totals[d] === requests || totals[d] === 0), errors, holds: errors.length === 0, theorem: 'textbook_cloudflare_cost_gate' as const }
}

import { hexbit, next as turnNext, uuidQubits } from '../../index.ts'
import { OFFICIAL_PLUGINS } from '../../../plugin.ts'
/** Payload's monorepo beside its packages (https://github.com/payloadcms/payload, read 2026-11-08): the templates a site starts from and the examples a capability is shown by. */
export const PAYLOAD_TEMPLATES = ['_data', '_template', 'blank-tanstack', 'blank', 'ecommerce', 'plugin', 'website', 'with-cloudflare-d1', 'with-postgres', 'with-vercel-mongodb', 'with-vercel-postgres', 'with-vercel-website'] as const
export const PAYLOAD_EXAMPLES = ['astro', 'auth', 'custom-components', 'custom-server', 'draft-preview', 'email', 'form-builder', 'live-preview', 'localization', 'multi-tenant', 'remix', 'tailwind-shadcn-ui', 'whitelabel'] as const
export type CoverageRow = { kind: 'package' | 'plugin' | 'template' | 'example'; name: string; covered: boolean; address: string; sealed: boolean }
const packageName = (dir: string) => (dir === 'payload' ? 'payload' : `@payloadcms/${dir}`)
/** Full quantum coverage of Payload's own surface: every package of the monorepo, every official plugin, every template and example one sealed
 *  UUID row, covered when the app mounts it (a dependency, a plugin slug, the template it was forked from, an example whose capability it uses).
 *  The register is the hexbit qubits of the first gap's address and `next` is the unit's own turn of that address: the step the plugin takes. */
export const apisCoverage = (mounted: readonly string[], templateOf = 'website', examplesUsed: readonly string[] = ['multi-tenant', 'form-builder', 'live-preview', 'email', 'auth', 'tailwind-shadcn-ui']) => {
  const names = (TABLES.PAYLOAD_PACKAGES as { names?: readonly string[] }).names ?? []
  const has = new Set(mounted)
  const rows: CoverageRow[] = [
    ...names.map((n) => ({ kind: 'package' as const, name: packageName(n), covered: has.has(packageName(n)) })),
    ...OFFICIAL_PLUGINS.map((p) => ({ kind: 'plugin' as const, name: p, covered: has.has(p === 'lexical' ? '@payloadcms/richtext-lexical' : `@payloadcms/plugin-${p}`) || has.has(p) })),
    ...PAYLOAD_TEMPLATES.map((t) => ({ kind: 'template' as const, name: t, covered: t === templateOf })),
    ...PAYLOAD_EXAMPLES.map((e) => ({ kind: 'example' as const, name: e, covered: examplesUsed.includes(e) })),
  ].map((r) => { const address = uuid(`payload\n${r.kind} ${r.name}`); return { ...r, address, sealed: seal(address).valid } }).sort((a, b) => (a.address < b.address ? -1 : 1))
  const gaps = rows.filter((r) => !r.covered), first = gaps[0] ?? null
  const register = uuidQubits(4)
  const nextStep = first ? { ...first, qubits: { effective: register.effective, hexbit: hexbit(first.address) }, turn: turnNext(first.address), step: first.kind === 'package' ? `pnpm add ${first.name}` : first.kind === 'plugin' ? `mount @payloadcms/plugin-${first.name} in payload.config.ts (plugins by capability)` : first.kind === 'template' ? `read templates/${first.name} of payloadcms/payload for the conventions this fork lacks` : `read examples/${first.name} of payloadcms/payload and serve its capability as a tool` } : null
  return { phase: 'coverage' as const, rows, total: rows.length, covered: rows.length - gaps.length, gaps: gaps.length, byKind: Object.fromEntries((['package', 'plugin', 'template', 'example'] as const).map((k) => [k, { total: rows.filter((r) => r.kind === k).length, covered: rows.filter((r) => r.kind === k && r.covered).length }])), next: nextStep, holds: gaps.length === 0, sealed: rows.every((r) => r.sealed && r.address.length === 36), theorem: 'textbook_uuid_is_36' as const }
}
