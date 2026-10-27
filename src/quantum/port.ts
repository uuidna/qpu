// Every database, storage and mail adapter of the Payload app ported onto Cloudflare, as Cloudflare's own documentation states the port
// (read through the Cloudflare Developer Platform MCP on 2026-10-26): each adapter's binding, its migration steps, the Cloudflare MCP calls
// that create or check its resources, the plan it needs, and its missing links — a step no MCP API or migration tool covers. Every one of
// the 5 × 5 × 2 combinations is composed from its mixed-radix index (compositionOf, textbook_mixed_radix) into one workflow; the whole space
// is counted: the combinations that port completely and the missing links that block the rest, each a lead (textbook_ports_cover). Pure.
import { compositionOf, compositionsOf } from './blocks.js'
import type { Lead } from './leads.js'

type McpCall = { tool: string; write: boolean; says: string }
export type Port = { pkg: string; port: 'native' | 'd1' | 'hyperdrive' | 'durable-object' | 'r2' | 'http' | 'send_email'; bindings: Record<string, unknown>; steps: string[]; mcp: McpCall[]; plan: 'free' | 'paid'; missing: string[]; docs: string[] }
const D1_LIST: McpCall = { tool: 'd1_databases_list', write: false, says: 'whether the database exists' }
const D1_CREATE: McpCall = { tool: 'd1_database_create', write: true, says: 'the database created (the user approves)' }
const R2_LIST: McpCall = { tool: 'r2_buckets_list', write: false, says: 'whether the bucket exists' }
const R2_CREATE: McpCall = { tool: 'r2_bucket_create', write: true, says: 'the bucket created (the user approves)' }
const HD_LIST: McpCall = { tool: 'hyperdrive_configs_list', write: false, says: 'whether a Hyperdrive configuration exists' }
const HD_GET: McpCall = { tool: 'hyperdrive_config_get', write: false, says: 'the configuration read, never its password' }
const WORKER_GET: McpCall = { tool: 'workers_get_worker', write: false, says: 'the deployed Worker and its bindings' }
const DOCS: McpCall = { tool: 'search_cloudflare_documentation', write: false, says: 'the port as Cloudflare documents it' }

export const CLOUDFLARE_PORT: Readonly<Record<string, Port>> = {
  'db-d1-sqlite': { pkg: 'db-d1-sqlite', port: 'native', bindings: { d1_databases: [{ binding: 'D1' }] }, steps: ['the D1 database created', 'sqliteD1Adapter({ binding: env.D1 })'], mcp: [D1_LIST, D1_CREATE], plan: 'free', missing: [], docs: ['https://developers.cloudflare.com/d1/'] },
  'db-sqlite': { pkg: 'db-sqlite', port: 'd1', bindings: { d1_databases: [{ binding: 'D1' }] }, steps: ['the SQLite file dumped (.dump)', 'the D1 database created', 'the dump imported (wrangler d1 execute --file)', 'sqliteD1Adapter({ binding: env.D1 })'], mcp: [D1_LIST, D1_CREATE, { tool: 'd1_database_query', write: true, says: 'statements run one call at a time' }], plan: 'free', missing: ['importing a SQLite dump into D1: the Cloudflare MCP runs queries one call at a time and names no import; wrangler d1 execute --file does it'], docs: ['https://developers.cloudflare.com/d1/best-practices/import-export-data/'] },
  'db-postgres': { pkg: 'db-postgres', port: 'hyperdrive', bindings: { hyperdrive: [{ binding: 'HYPERDRIVE' }] }, steps: ['a Hyperdrive configuration created from the connection string (a secret, never in the tree)', 'postgresAdapter({ pool: { connectionString: env.HYPERDRIVE.connectionString } })'], mcp: [HD_LIST, HD_GET], plan: 'free', missing: ['creating a Hyperdrive configuration: the Cloudflare MCP lists, reads, edits and deletes them but names no create; wrangler hyperdrive create does it'], docs: ['https://developers.cloudflare.com/hyperdrive/'] },
  'db-vercel-postgres': { pkg: 'db-vercel-postgres', port: 'hyperdrive', bindings: { hyperdrive: [{ binding: 'HYPERDRIVE' }] }, steps: ['the Vercel Postgres connection string given to a Hyperdrive configuration (Postgres underneath)', 'postgresAdapter over env.HYPERDRIVE.connectionString'], mcp: [HD_LIST, HD_GET], plan: 'free', missing: ['creating a Hyperdrive configuration: the Cloudflare MCP lists, reads, edits and deletes them but names no create; wrangler hyperdrive create does it'], docs: ['https://developers.cloudflare.com/hyperdrive/'] },
  'db-mongodb': { pkg: 'db-mongodb', port: 'durable-object', bindings: { durable_objects: { bindings: [{ name: 'MONGO', class_name: 'MongoConnection' }] } }, steps: ['the MongoDB driver over Workers TCP sockets (node:net and node:tls under nodejs_compat)', 'the client kept in a Durable Object between requests (about 35 ms warm against about 300 ms without)'], mcp: [WORKER_GET, DOCS], plan: 'free', missing: ['Payload\'s mongooseAdapter keeps its client in the app process, not in a Durable Object: an adapter over a DO-held client is owed (the docket speaks the mongo language meanwhile)', 'a Durable Object namespace comes with a deploy: no Cloudflare MCP tool creates one'], docs: ['https://developers.cloudflare.com/workers/databases/third-party-integrations/mongodb/'] },
  'storage-r2': { pkg: 'storage-r2', port: 'native', bindings: { r2_buckets: [{ binding: 'R2' }] }, steps: ['the R2 bucket created', 'r2Storage({ bucket: env.R2 })'], mcp: [R2_LIST, R2_CREATE], plan: 'free', missing: [], docs: ['https://developers.cloudflare.com/r2/'] },
  'storage-s3': { pkg: 'storage-s3', port: 'r2', bindings: { r2_buckets: [{ binding: 'R2' }] }, steps: ['the R2 bucket created', 'the objects moved by Super Slurper (in bulk) or Sippy (on demand)', 'r2Storage({ bucket: env.R2 })'], mcp: [R2_LIST, R2_CREATE], plan: 'free', missing: ['starting Super Slurper or Sippy: no Cloudflare MCP tool names them; the dashboard or wrangler r2 bucket sippy enable does'], docs: ['https://developers.cloudflare.com/r2/data-migration/super-slurper/', 'https://developers.cloudflare.com/r2/data-migration/sippy/'] },
  'storage-gcs': { pkg: 'storage-gcs', port: 'r2', bindings: { r2_buckets: [{ binding: 'R2' }] }, steps: ['the R2 bucket created', 'the objects moved by Super Slurper (in bulk) or Sippy (on demand) from Google Cloud Storage', 'r2Storage({ bucket: env.R2 })'], mcp: [R2_LIST, R2_CREATE], plan: 'free', missing: ['starting Super Slurper or Sippy: no Cloudflare MCP tool names them; the dashboard or wrangler r2 bucket sippy enable does'], docs: ['https://developers.cloudflare.com/r2/data-migration/sippy/'] },
  'storage-azure': { pkg: 'storage-azure', port: 'r2', bindings: { r2_buckets: [{ binding: 'R2' }] }, steps: ['the R2 bucket created', 'the objects moved by Sippy on demand from Azure Blob Storage', 'r2Storage({ bucket: env.R2 })'], mcp: [R2_LIST, R2_CREATE], plan: 'free', missing: ['starting Sippy: no Cloudflare MCP tool names it; the dashboard or wrangler r2 bucket sippy enable does'], docs: ['https://developers.cloudflare.com/r2/data-migration/sippy/'] },
  'storage-vercel-blob': { pkg: 'storage-vercel-blob', port: 'r2', bindings: { r2_buckets: [{ binding: 'R2' }] }, steps: ['the R2 bucket created', 'every object copied through the app (listed from Vercel Blob, put into R2)', 'r2Storage({ bucket: env.R2 })'], mcp: [R2_LIST, R2_CREATE], plan: 'free', missing: ['moving Vercel Blob into R2: no Cloudflare migration tool reads Vercel Blob, so the copy is the app\'s own'], docs: ['https://developers.cloudflare.com/r2/data-migration/'] },
  'email-resend': { pkg: 'email-resend', port: 'http', bindings: {}, steps: ['resendAdapter over HTTP, which runs in a Worker (RESEND_API_KEY a secret)'], mcp: [], plan: 'free', missing: [], docs: ['https://developers.cloudflare.com/workers/runtime-apis/fetch/'] },
  'email-nodemailer': { pkg: 'email-nodemailer', port: 'send_email', bindings: { send_email: [{ name: 'EMAIL' }] }, steps: ['the sending domain onboarded to Cloudflare Email Service', 'a send_email binding', 'mail sent with env.EMAIL.send (SMTP on port 25 is blocked from Workers)'], mcp: [DOCS], plan: 'paid', missing: ['Payload has no email adapter over the send_email binding: one over env.EMAIL.send is owed', 'onboarding a domain to Email Service: no Cloudflare MCP tool does it; the dashboard does'], docs: ['https://developers.cloudflare.com/email-service/api/send-emails/workers-api/'] },
}
/** the adapters in the order of the configure kind adapters (a test holds the two equal): the radices of the space */
export const PORT_ORDER = { database: ['db-mongodb', 'db-d1-sqlite', 'db-postgres', 'db-sqlite', 'db-vercel-postgres'], storage: ['storage-vercel-blob', 'storage-r2', 'storage-s3', 'storage-gcs', 'storage-azure'], email: ['email-nodemailer', 'email-resend'] } as const
export const PORT_RADICES = [PORT_ORDER.database.length, PORT_ORDER.storage.length, PORT_ORDER.email.length] as const

/** One combination, from its index: the database, the storage and the mail adapter it chooses, their bindings joined, one workflow of every step with its MCP call, the plan, the missing links. */
export const portOf = (index: number) => {
  const count = Number(compositionsOf([...PORT_RADICES]))
  if (!Number.isInteger(index) || index < 0 || index >= count) throw new Error(`a combination is an index from 0 to ${count - 1}`)
  const [d, s, e] = compositionOf([...PORT_RADICES], BigInt(index))
  const chosen = [PORT_ORDER.database[d!]!, PORT_ORDER.storage[s!]!, PORT_ORDER.email[e!]!].map((pkg) => CLOUDFLARE_PORT[pkg]!)
  const bindings = Object.assign({}, ...chosen.map((p) => p.bindings)) as Record<string, unknown>
  const workflow = chosen.flatMap((p) => p.steps.map((step, i) => ({ adapter: p.pkg, step, mcp: p.mcp[i] ?? null })))
  const missing = [...new Set(chosen.flatMap((p) => p.missing))]
  return { index, digits: [d, s, e], database: chosen[0]!.pkg, storage: chosen[1]!.pkg, email: chosen[2]!.pkg, ports: chosen.map((p) => p.port), bindings, workflow, mcp: chosen.flatMap((p) => p.mcp), plan: chosen.some((p) => p.plan === 'paid') ? 'paid' as const : 'free' as const, missing, complete: missing.length === 0, docs: [...new Set(chosen.flatMap((p) => p.docs))] }
}

/** The whole space: every combination ported, the ones that port completely counted, the missing links each a lead naming the combinations it blocks. */
export const portsOf = () => {
  const count = Number(compositionsOf([...PORT_RADICES]))
  const all = Array.from({ length: count }, (_, i) => portOf(i))
  const links = new Map<string, number[]>(); for (const p of all) for (const m of p.missing) links.set(m, [...(links.get(m) ?? []), p.index])
  const leads: Lead[] = [...links.entries()].map(([m, at]) => ({ id: `port-${m.slice(0, 40).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')}`, source: 'the Cloudflare port of the Payload adapters', statement: `${m} (blocks ${at.length} of ${count} combinations)`, status: 'open' as const, reason: 'a step of the port no Cloudflare MCP API or migration tool covers yet' }))
  const complete = all.filter((p) => p.complete)
  return { combinations: count, radices: PORT_RADICES, complete: complete.length, blocked: count - complete.length, completeOnes: complete.map((p) => `${p.database} + ${p.storage} + ${p.email}`), missingLinks: links.size, byPlan: { free: all.filter((p) => p.plan === 'free').length, paid: all.filter((p) => p.plan === 'paid').length }, mcpTools: [...new Set(all.flatMap((p) => p.mcp.map((c) => c.tool)))].sort(), writes: [...new Set(all.flatMap((p) => p.mcp.filter((c) => c.write).map((c) => c.tool)))].sort(), leads, theorems: ['textbook_adapter_combinations', 'textbook_mixed_radix', 'textbook_ports_cover'], says: `${count} combinations ported onto Cloudflare: ${complete.length} complete, ${count - complete.length} blocked by ${links.size} missing link(s), each a lead` }
}
