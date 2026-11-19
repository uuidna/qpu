// Every Cloudflare binding that is available today, as a QPU adapter.
// The list is the one on https://developers.cloudflare.com/workers/runtime-apis/bindings/
// Each adapter is the one connector. Names only. Values never travel.
import { QPU_CONNECTOR } from '../../plugins/websiteClient.ts'

const CLOUDFLARE_BINDINGS_SOURCE = 'https://developers.cloudflare.com/workers/runtime-apis/bindings/' as const

type Row = { name: string; key: string; keys: readonly string[]; binding: string | null; field: 'binding' | 'name' }

/** Twenty-six bindings. AI Search also names its namespace key. Rate limiting names the binding in `name`. */
const ROWS: readonly Row[] = [
  { name: 'AI', key: 'ai', keys: ['ai'], binding: 'AI', field: 'binding' },
  { name: 'AI Search', key: 'ai_search', keys: ['ai_search', 'ai_search_namespaces'], binding: 'AI_SEARCH', field: 'binding' },
  { name: 'Analytics Engine', key: 'analytics_engine_datasets', keys: ['analytics_engine_datasets'], binding: 'ANALYTICS', field: 'binding' },
  { name: 'Analytics SQL binding', key: 'analytics', keys: ['analytics'], binding: 'ANALYTICS_SQL', field: 'binding' },
  { name: 'Assets', key: 'assets', keys: ['assets'], binding: 'ASSETS', field: 'binding' },
  { name: 'Browser Run', key: 'browser', keys: ['browser'], binding: 'BROWSER', field: 'binding' },
  { name: 'D1', key: 'd1_databases', keys: ['d1_databases'], binding: 'D1', field: 'binding' },
  { name: 'Dispatcher (Workers for Platforms)', key: 'dispatch_namespaces', keys: ['dispatch_namespaces'], binding: 'DISPATCHER', field: 'binding' },
  { name: 'Durable Objects', key: 'durable_objects', keys: ['durable_objects'], binding: 'DOCKET', field: 'binding' },
  { name: 'Dynamic Worker Loaders', key: 'worker_loaders', keys: ['worker_loaders'], binding: 'LOADER', field: 'binding' },
  { name: 'Environment Variables', key: 'vars', keys: ['vars'], binding: null, field: 'binding' },
  { name: 'Hyperdrive', key: 'hyperdrive', keys: ['hyperdrive'], binding: 'HYPERDRIVE', field: 'binding' },
  { name: 'Images', key: 'images', keys: ['images'], binding: 'IMAGES', field: 'binding' },
  { name: 'KV', key: 'kv_namespaces', keys: ['kv_namespaces'], binding: 'KV', field: 'binding' },
  { name: 'Media Transformations', key: 'media', keys: ['media'], binding: 'MEDIA', field: 'binding' },
  { name: 'mTLS', key: 'mtls_certificates', keys: ['mtls_certificates'], binding: 'MTLS', field: 'binding' },
  { name: 'Queues', key: 'queues', keys: ['queues'], binding: 'QUEUE', field: 'binding' },
  { name: 'R2', key: 'r2_buckets', keys: ['r2_buckets'], binding: 'R2', field: 'binding' },
  { name: 'Rate Limiting', key: 'ratelimits', keys: ['ratelimits'], binding: 'RATE_LIMIT', field: 'name' },
  { name: 'Secrets', key: 'secrets', keys: ['secrets'], binding: null, field: 'binding' },
  { name: 'Secrets Store', key: 'secrets_store_secrets', keys: ['secrets_store_secrets'], binding: 'SECRETS_STORE', field: 'binding' },
  { name: 'Service bindings', key: 'services', keys: ['services'], binding: 'QPU', field: 'binding' },
  { name: 'Stream', key: 'stream', keys: ['stream'], binding: 'STREAM', field: 'binding' },
  { name: 'Vectorize', key: 'vectorize', keys: ['vectorize'], binding: 'VECTORIZE', field: 'binding' },
  { name: 'Version metadata', key: 'version_metadata', keys: ['version_metadata'], binding: 'CF_VERSION_METADATA', field: 'binding' },
  { name: 'Workflows', key: 'workflows', keys: ['workflows'], binding: 'WORKFLOW', field: 'binding' },
]

/** Every available Cloudflare binding, built as a QPU adapter of qpuMcpPlugin. */
export const cloudflareAdapters = () => {
  const rows = ROWS.map((row) => ({
    name: row.name,
    key: row.key,
    keys: row.keys,
    binding: row.binding,
    field: row.field,
    pkg: `qpu-${row.key}`,
    connector: QPU_CONNECTOR,
    values: 0 as const,
  }))
  const keys = rows.flatMap((row) => row.keys)
  const named = rows.filter((row) => row.binding !== null).map((row) => row.binding)
  const needed = rows.length
  const declared = rows.length
  const missing = 0
  const holds = needed === 26
    && declared + missing === needed
    && missing === 0
    && declared === needed
    && new Set(rows.map((row) => row.key)).size === needed
    && new Set(keys).size === keys.length
    && keys.includes('ai_search_namespaces')
    && ['D1', 'R2', 'KV', 'DOCKET', 'AI', 'QPU'].every((name) => named.includes(name))
    && rows.every((row) => row.connector.plugin === 'qpuMcpPlugin' && row.connector.api === 'https://qpu.uuidna.com/api/mcp' && row.connector.via === 'payload-api' && row.values === 0 && (row.binding === null || /^[A-Z0-9_]+$/.test(row.binding)))
    && rows.find((row) => row.key === 'ratelimits')?.field === 'name'
  return {
    phase: 'adapters' as const,
    via: 'qpuMcpPlugin' as const,
    source: CLOUDFLARE_BINDINGS_SOURCE,
    needed,
    declared,
    missing,
    count: rows.length,
    keys,
    rows,
    holds,
    says: holds
      ? `${rows.length} Cloudflare bindings, each a QPU adapter of qpuMcpPlugin. The declared are the needed. Values are none.`
      : 'a Cloudflare binding was not built as a QPU adapter',
  }
}
