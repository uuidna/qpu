// kinds — every Cloudflare Worker binding, one row, one driver.
import type { BindingSpec } from '../types.js'

const ops = (...xs: string[]): readonly string[] => Object.freeze(xs)

/** wrangler.toml section → env key → driver ops. No resource ids here. */
export const CLOUDFLARE_BINDINGS: readonly BindingSpec[] = Object.freeze([
  { provider: 'cloudflare', kind: 'assets', envKey: 'ASSETS', wrangler: 'assets', ops: ops('probe', 'fetch') },
  { provider: 'cloudflare', kind: 'kv', envKey: 'KV', wrangler: 'kv_namespaces', ops: ops('probe', 'get', 'put', 'list', 'delete') },
  { provider: 'cloudflare', kind: 'd1', envKey: 'D1', wrangler: 'd1_databases', ops: ops('probe', 'query', 'exec') },
  { provider: 'cloudflare', kind: 'r2', envKey: 'R2', wrangler: 'r2_buckets', ops: ops('probe', 'get', 'put', 'list', 'head', 'delete') },
  { provider: 'cloudflare', kind: 'durable_objects', envKey: 'DO', wrangler: 'durable_objects.bindings', ops: ops('probe', 'id', 'fetch') },
  { provider: 'cloudflare', kind: 'queues', envKey: 'QUEUE', wrangler: 'queues.producers', ops: ops('probe', 'send') },
  { provider: 'cloudflare', kind: 'ai', envKey: 'AI', wrangler: 'ai', ops: ops('probe', 'run', 'gateway') },
  { provider: 'cloudflare', kind: 'vectorize', envKey: 'VECTORIZE', wrangler: 'vectorize', ops: ops('probe', 'query', 'upsert') },
  { provider: 'cloudflare', kind: 'hyperdrive', envKey: 'HYPERDRIVE', wrangler: 'hyperdrive', ops: ops('probe', 'connect') },
  { provider: 'cloudflare', kind: 'workflows', envKey: 'WORKFLOW', wrangler: 'workflows', ops: ops('probe', 'create', 'get') },
  { provider: 'cloudflare', kind: 'containers', envKey: 'CONTAINER', wrangler: 'containers', ops: ops('probe', 'get') },
  { provider: 'cloudflare', kind: 'services', envKey: 'UUIDNA', wrangler: 'services', ops: ops('probe', 'fetch') },
  { provider: 'cloudflare', kind: 'dispatch', envKey: 'DISPATCH', wrangler: 'dispatch_namespaces', ops: ops('probe', 'get') },
  { provider: 'cloudflare', kind: 'analytics', envKey: 'AE', wrangler: 'analytics_engine_datasets', ops: ops('probe', 'write') },
  { provider: 'cloudflare', kind: 'vars', envKey: 'QPU_HOST', wrangler: 'vars', ops: ops('probe', 'get') },
  { provider: 'cloudflare', kind: 'images', envKey: 'IMAGES', wrangler: 'images', ops: ops('probe', 'info') },
  { provider: 'cloudflare', kind: 'mtls', envKey: 'MTLS', wrangler: 'mtls_certificates', ops: ops('probe', 'fetch') },
  { provider: 'cloudflare', kind: 'pipelines', envKey: 'PIPELINE', wrangler: 'pipelines', ops: ops('probe', 'send') },
  { provider: 'cloudflare', kind: 'ai_gateway', envKey: 'AI_GATEWAY', wrangler: 'ai', ops: ops('probe', 'run') },
  { provider: 'cloudflare', kind: 'worker_loaders', envKey: 'LOADER', wrangler: 'worker_loaders', ops: ops('probe', 'load', 'get') },
  { provider: 'cloudflare', kind: 'media', envKey: 'MEDIA', wrangler: 'media', ops: ops('probe', 'input') },
  { provider: 'cloudflare', kind: 'stream', envKey: 'STREAM', wrangler: 'stream', ops: ops('probe', 'upload', 'list') },
  { provider: 'cloudflare', kind: 'flagship', envKey: 'FLAGS', wrangler: 'flagship', ops: ops('probe', 'get') },
  { provider: 'cloudflare', kind: 'artifacts', envKey: 'ARTIFACTS', wrangler: 'artifacts', ops: ops('probe', 'create', 'list') },
  { provider: 'cloudflare', kind: 'vpc', envKey: 'VPC', wrangler: 'vpc_services', ops: ops('probe', 'fetch') },
  { provider: 'cloudflare', kind: 'secrets_store', envKey: 'SECRET_STORE', wrangler: 'secrets_store_secrets', ops: ops('probe', 'get') },
  { provider: 'cloudflare', kind: 'browser', envKey: 'BROWSER', wrangler: 'browser', ops: ops('probe', 'fetch') },
  { provider: 'cloudflare', kind: 'email', envKey: 'EMAIL', wrangler: 'send_email', ops: ops('probe', 'send') },
  { provider: 'cloudflare', kind: 'ai_search', envKey: 'AI_SEARCH', wrangler: 'ai_search', ops: ops('probe', 'search') },
  { provider: 'cloudflare', kind: 'ai_search_namespace', envKey: 'AI_SEARCH_NS', wrangler: 'ai_search_namespaces', ops: ops('probe', 'list') },
  { provider: 'cloudflare', kind: 'secrets', envKey: 'QPU_SECRET', wrangler: 'secrets', ops: ops('probe', 'get') },
  { provider: 'cloudflare', kind: 'version_metadata', envKey: 'CF_VERSION_METADATA', wrangler: 'version_metadata', ops: ops('probe', 'get') },
  { provider: 'cloudflare', kind: 'ratelimit', envKey: 'RATE_LIMIT', wrangler: 'ratelimits', ops: ops('probe', 'limit') },
  { provider: 'cloudflare', kind: 'tail', envKey: 'TAIL', wrangler: 'tail_consumers', ops: ops('probe') },
])

export const cloudflareBindingOf = (kind: string): BindingSpec | undefined =>
  CLOUDFLARE_BINDINGS.find((b) => b.kind === kind)
