/**
 * Payload Templates for 4-Mode Deployment
 * Browser / Standalone / Docker / Kubernetes
 * Each mode fully specified, formula-derived, zero-config
 */

export interface PayloadTemplate {
  mode: 'browser' | 'standalone' | 'docker' | 'kubernetes' | 'cloudflare'
  version: string
  spec: Record<string, unknown>
  hardware: HardwareTarget
  optimization: OptimizationConfig
  deployment: DeploymentConfig
}

export interface HardwareTarget {
  cpu: { cores: number; freq: number; cache: string }
  memory: { gb: number; type: string }
  network: { bw: string; latency: string }
  storage: { ssd: string; type: string }
  accelerators?: string[]
}

export interface OptimizationConfig {
  cpu: { ipc: number; frequency: number; powerGating: boolean }
  memory: { prefetch: boolean; compression: number; cacheSize: number }
  network: { routing: string; linkGating: boolean }
  power: { vrm: number; thermalTarget: number }
}

export interface DeploymentConfig {
  instances: number
  scaling: { min: number; max: number; target: number }
  monitoring: boolean
  selfHealing: boolean
  autonomousOptimization: boolean
}

/**
 * Deployment templates: four hardware modes (browser, standalone, docker, kubernetes) and the Cloudflare family (cloudflarePayload) for Next.js + Payload on Workers.
 * @wing cms
 * @kind class
 */
export class PayloadTemplates {
  /**
   * BROWSER MODE: In-app execution via WebAssembly
   * Minimal footprint, real-time UI updates, no backend required
   */
  static browserPayload(): PayloadTemplate {
    return {
      mode: 'browser',
      version: '1.0.0',
      spec: {
        runtime: 'wasm',
        bundle: {
          core: 'uuid-mcp-core.wasm',
          quantum: 'quantum-secure-signalling.wasm',
          formulas: 'cross-domain-formulas.wasm',
          hardware: 'hardware-optimization-manifesto.wasm'
        },
        modules: 65, // all MCP operations
        domains: 12, // all connected domains
        size: '4.2MB', // gzipped
        initTime: '120ms',
        memoryLimit: '256MB'
      },
      hardware: {
        cpu: { cores: 2, freq: 2400, cache: '8MB' },
        memory: { gb: 4, type: 'shared' },
        network: { bw: '10Mbps', latency: '50ms' },
        storage: { ssd: '1GB', type: 'indexeddb' }
      },
      optimization: {
        cpu: { ipc: 1.2, frequency: 1800, powerGating: false },
        memory: { prefetch: true, compression: 0.65, cacheSize: 128 },
        network: { routing: 'direct', linkGating: false },
        power: { vrm: 0.8, thermalTarget: 65 }
      },
      deployment: {
        instances: 1,
        scaling: { min: 1, max: 1, target: 1 },
        monitoring: true,
        selfHealing: true,
        autonomousOptimization: true
      }
    }
  }

  /**
   * STANDALONE MODE: Desktop/CLI application
   * Full performance, all optimizations enabled, system integration
   */
  static standalonePayload(): PayloadTemplate {
    return {
      mode: 'standalone',
      version: '1.0.0',
      spec: {
        runtime: 'node.js/v20+',
        binary: 'qpu-standalone',
        entrypoint: 'dist/standalone-server.js',
        modules: 65,
        domains: 12,
        size: '15.3MB', // uncompressed
        initTime: '45ms',
        memoryLimit: '2GB'
      },
      hardware: {
        cpu: { cores: 4, freq: 3600, cache: '16MB' },
        memory: { gb: 8, type: 'local' },
        network: { bw: '1Gbps', latency: '1ms' },
        storage: { ssd: '10GB', type: 'local-filesystem' }
      },
      optimization: {
        cpu: { ipc: 1.54, frequency: 3200, powerGating: true },
        memory: { prefetch: true, compression: 0.58, cacheSize: 512 },
        network: { routing: 'optimized', linkGating: true },
        power: { vrm: 0.68, thermalTarget: 75 }
      },
      deployment: {
        instances: 1,
        scaling: { min: 1, max: 4, target: 2 },
        monitoring: true,
        selfHealing: true,
        autonomousOptimization: true
      }
    }
  }

  /**
   * DOCKER MODE: Container deployment
   * Portable, reproducible, easy horizontal scaling
   */
  static dockerPayload(): PayloadTemplate {
    return {
      mode: 'docker',
      version: '1.0.0',
      spec: {
        image: 'uuidna/qpu:latest',
        dockerfile: `
FROM node:20-alpine
WORKDIR /app
COPY dist/ ./dist/
COPY package*.json ./
RUN npm ci --only=production
EXPOSE 8080
ENV NODE_ENV=production
CMD ["node", "dist/docker-server.js"]
        `,
        modules: 65,
        domains: 12,
        size: '89MB', // image size
        initTime: '800ms',
        memoryLimit: '4GB'
      },
      hardware: {
        cpu: { cores: 2, freq: 2400, cache: '8MB' },
        memory: { gb: 4, type: 'container' },
        network: { bw: '100Mbps', latency: '5ms' },
        storage: { ssd: '20GB', type: 'volume' }
      },
      optimization: {
        cpu: { ipc: 1.52, frequency: 2200, powerGating: true },
        memory: { prefetch: true, compression: 0.61, cacheSize: 256 },
        network: { routing: 'container-aware', linkGating: true },
        power: { vrm: 0.65, thermalTarget: 70 }
      },
      deployment: {
        instances: 3,
        scaling: { min: 1, max: 10, target: 3 },
        monitoring: true,
        selfHealing: true,
        autonomousOptimization: true
      }
    }
  }

  /**
   * KUBERNETES MODE: Cloud-native orchestration
   * Auto-scaling, resilience, multi-datacenter distribution
   */
  static kubernetesPayload(): PayloadTemplate {
    return {
      mode: 'kubernetes',
      version: '1.0.0',
      spec: {
        apiVersion: 'apps/v1',
        kind: 'Deployment',
        metadata: {
          name: 'qpu-deployment',
          namespace: 'production',
          labels: { app: 'qpu', version: '1.0.0' }
        },
        spec: {
          replicas: 5,
          selector: { matchLabels: { app: 'qpu' } },
          template: {
            metadata: { labels: { app: 'qpu', version: '1.0.0' } },
            spec: {
              containers: [
                {
                  name: 'qpu',
                  image: 'uuidna/qpu:1.0.0',
                  ports: [{ containerPort: 8080, name: 'http' }],
                  resources: {
                    requests: { cpu: '2', memory: '4Gi' },
                    limits: { cpu: '4', memory: '8Gi' }
                  },
                  livenessProbe: {
                    httpGet: { path: '/health', port: 8080 },
                    initialDelaySeconds: 30,
                    periodSeconds: 10
                  },
                  readinessProbe: {
                    httpGet: { path: '/ready', port: 8080 },
                    initialDelaySeconds: 10,
                    periodSeconds: 5
                  }
                }
              ],
              affinity: {
                podAntiAffinity: {
                  preferredDuringSchedulingIgnoredDuringExecution: [
                    {
                      weight: 100,
                      podAffinityTerm: {
                        labelSelector: { matchLabels: { app: 'qpu' } },
                        topologyKey: 'kubernetes.io/hostname'
                      }
                    }
                  ]
                }
              }
            }
          }
        },
        modules: 65,
        domains: 12,
        initTime: '2500ms'
      },
      hardware: {
        cpu: { cores: 8, freq: 3600, cache: '32MB' },
        memory: { gb: 32, type: 'cluster' },
        network: { bw: '10Gbps', latency: '0.5ms' },
        storage: { ssd: '100GB', type: 'persistent-volume' }
      },
      optimization: {
        cpu: { ipc: 1.96, frequency: 3400, powerGating: true },
        memory: { prefetch: true, compression: 0.51, cacheSize: 2048 },
        network: { routing: 'k8s-sdn', linkGating: true },
        power: { vrm: 0.55, thermalTarget: 65 }
      },
      deployment: {
        instances: 5,
        scaling: { min: 3, max: 50, target: 10 },
        monitoring: true,
        selfHealing: true,
        autonomousOptimization: true
      }
    }
  }

  /**
   * Generate optimized payload for detected hardware
   */
  static autoDetectPayload(hwProfile: Partial<HardwareTarget>): PayloadTemplate {
    const cores = hwProfile.cpu?.cores || 4
    const memGb = hwProfile.memory?.gb || 8
    const isSSD = hwProfile.storage?.ssd === 'yes'

    // Formula: if cores < 2, use browser; if cores < 8, standalone; if cores < 32, docker; else k8s
    if (cores < 2) return this.browserPayload()
    if (cores < 8) return this.standalonePayload()
    if (cores < 32) return this.dockerPayload()
    return this.kubernetesPayload()
  }

  /**
   * Template validation against hardware constraints
   */
  static validate(payload: PayloadTemplate, hardware: HardwareTarget): { valid: boolean; issues: string[] } {
    const issues: string[] = []

    // CPU: template core requirement vs available cores
    const templateCores = ((payload.spec as Record<string, unknown>).modules as number) || 1
    if (hardware.cpu.cores < Math.ceil((templateCores as number) / 13)) {
      issues.push(`CPU cores (${hardware.cpu.cores}) insufficient for template requirements`)
    }

    // Memory: check allocation
    const memNeeded = payload.optimization.memory.cacheSize / 1024 + 0.5
    if (hardware.memory.gb < memNeeded) {
      issues.push(`Memory (${hardware.memory.gb}GB) insufficient, need ${memNeeded}GB`)
    }

    // Network: latency check
    const maxLatency = payload.mode === 'browser' ? 50 : payload.mode === 'standalone' ? 1 : 5
    const latencyMs = parseInt(hardware.network.latency)
    if (latencyMs > maxLatency) {
      issues.push(`Network latency (${latencyMs}ms) exceeds limit (${maxLatency}ms)`)
    }

    return {
      valid: issues.length === 0,
      issues
    }
  }

  /**
   * All templates indexed by mode
   */
  /** Next.js + Payload on Cloudflare Workers for one combination; enumerate them with cloudflareCombinations(). */
  static cloudflarePayload(c: CloudflareCombination, name?: string, app?: CloudflareApp): CloudflarePayload {
    return cloudflarePayloadOf(c, name, app)
  }

  static allTemplates(): Record<string, PayloadTemplate> {
    return {
      browser: this.browserPayload(),
      standalone: this.standalonePayload(),
      docker: this.dockerPayload(),
      kubernetes: this.kubernetesPayload()
    }
  }
}

// ============================================================================
// CLOUDFLARE: Next.js + Payload on Workers, every combination
// ============================================================================

/**
 * Next.js runtimes on Workers: vinext (Cloudflare's recommended path) and the OpenNext adapter.
 * @wing cms
 * @kind constant
 */
export const CLOUDFLARE_RUNTIMES = ['vinext', 'opennext'] as const
/**
 * qpu-raid and qpu-d1 are the QPU document database (MongoDB semantics) on native bindings: a MongoDB request on Workers is one of these.
 * @wing cms
 * @kind constant
 */
export const CLOUDFLARE_DATABASES = ['d1', 'postgres', 'qpu-raid', 'qpu-d1'] as const
/**
 * Upload storage choices: R2, S3, or none.
 * @wing cms
 * @kind constant
 */
export const CLOUDFLARE_STORAGE = ['r2', 's3', 'none'] as const
/**
 * Email choices: Resend, or none.
 * @wing cms
 * @kind constant
 */
export const CLOUDFLARE_EMAIL = ['resend', 'none'] as const
/**
 * The Payload plugins a combination can include.
 * @wing cms
 * @kind constant
 */
export const CLOUDFLARE_PLUGINS = ['ecommerce', 'form-builder', 'import-export', 'mcp', 'multi-tenant', 'nested-docs', 'redirects', 'search', 'sentry', 'seo', 'stripe'] as const

export type CloudflareCombination = {
  runtime: (typeof CLOUDFLARE_RUNTIMES)[number]
  db: (typeof CLOUDFLARE_DATABASES)[number]
  storage: (typeof CLOUDFLARE_STORAGE)[number]
  email: (typeof CLOUDFLARE_EMAIL)[number]
  plugins: (typeof CLOUDFLARE_PLUGINS)[number][]
}
export type CloudflarePayload = PayloadTemplate & { combination: CloudflareCombination; key: string; files: Record<string, string>; dependencies: string[] }

/**
 * A combination's canonical key: the axes in order, plugins sorted — what its content UUID is taken over.
 * @wing cms
 * @kind builder
 */
export const cloudflareKeyOf = (c: CloudflareCombination): string =>
  [c.runtime, c.db, c.storage, c.email, [...c.plugins].sort().join('+') || '-'].join('/')
/**
 * Parse a combination key (runtime/db/storage/email/plugins) back into a combination.
 * @wing cms
 * @kind builder
 */
export const cloudflareCombinationOf = (key: string): CloudflareCombination => {
  const [runtime, db, storage, email, plugins] = key.split('/') as [never, never, never, never, string]
  return { runtime, db, storage, email, plugins: plugins === '-' ? [] : (plugins.split('+') as never) }
}

type PluginTargets = string[]
const slugs = (t: PluginTargets) => `[${t.map((x) => `'${x}'`).join(', ')}]`
const PLUGIN_CODE: Record<CloudflareCombination['plugins'][number], { from: string; name: string; call: (t: PluginTargets) => string }> = {
  ecommerce: {
    from: '@payloadcms/plugin-ecommerce', name: 'ecommercePlugin',
    call: () => `ecommercePlugin({ products: true, customers: { slug: 'users' }, access: { isAdmin: ({ req }) => Boolean(req.user), adminOnlyFieldAccess: ({ req }) => Boolean(req.user), adminOrPublishedStatus: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }), isDocumentOwner: ({ req }) => (req.user ? { customer: { equals: req.user.id } } : false) } })`,
  },
  'form-builder': { from: '@payloadcms/plugin-form-builder', name: 'formBuilderPlugin', call: () => 'formBuilderPlugin({})' },
  'import-export': { from: '@payloadcms/plugin-import-export', name: 'importExportPlugin', call: (t) => `importExportPlugin({ collections: [${t.map((x) => `{ slug: '${x}' }`).join(', ')}] })` },
  mcp: { from: '@payloadcms/plugin-mcp', name: 'mcpPlugin', call: (t) => `mcpPlugin({ collections: { ${t.map((x) => `'${x}': { description: '${x}' }`).join(', ')} } })` },
  'multi-tenant': { from: '@payloadcms/plugin-multi-tenant', name: 'multiTenantPlugin', call: (t) => `multiTenantPlugin({ collections: { ${t.map((x) => `'${x}': {}`).join(', ')} }, userHasAccessToAllTenants: (user) => (user as { role?: string } | null)?.role === 'super-admin' })` },
  'nested-docs': { from: '@payloadcms/plugin-nested-docs', name: 'nestedDocsPlugin', call: (t) => `nestedDocsPlugin({ collections: ${slugs(t)} })` },
  redirects: { from: '@payloadcms/plugin-redirects', name: 'redirectsPlugin', call: (t) => `redirectsPlugin({ collections: ${slugs(t)} })` },
  search: { from: '@payloadcms/plugin-search', name: 'searchPlugin', call: (t) => `searchPlugin({ collections: ${slugs(t)} })` },
  sentry: { from: '@payloadcms/plugin-sentry', name: 'sentryPlugin', call: () => `sentryPlugin({ Sentry, enabled: Boolean(process.env.SENTRY_DSN) })` },
  seo: { from: '@payloadcms/plugin-seo', name: 'seoPlugin', call: (t) => `seoPlugin({ collections: ${slugs(t)} })` },
  stripe: { from: '@payloadcms/plugin-stripe', name: 'stripePlugin', call: () => `stripePlugin({ stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? '' })` },
}

/** An application's own content, carried into the generated config: its collections replace the template's Users and
 *  Pages, plugins attach to the app's collections, and admin, CORS and types output come from the app. */
export type CloudflareApp = {
  collections: { name: string; from: string; slug: string }[]
  adminUser?: string
  targets?: Partial<Record<CloudflareCombination['plugins'][number], string[]>>
  dashboard?: string
  origins?: string[]
  typescriptOutput?: string
  title?: string
  /** the collection the public site renders: `/` is the document with slug `index`, `/<route>/<slug>` any other; `html`
   *  is the field holding the rendered body */
  frontend?: { collection: string; route: string; html: string }
  /** side-effect modules imported before anything else in the config (runtime shims) */
  preload?: string[]
  /** a module exporting `seed(payload)`, run on init (idempotent upserts) */
  seed?: { name: string; from: string }
  /** where the app's wrangler file lives, relative to the app root (OpenNext reads the bindings from it) */
  wrangler?: string
  /** reached only through another Worker's service binding: no workers.dev or preview address */
  bound?: boolean
}

const cloudflareConfigOf = (c: CloudflareCombination, app?: CloudflareApp): string => {
  const plugins = [...c.plugins].sort()
  const targetsOf = (p: CloudflareCombination['plugins'][number]) => app?.targets?.[p] ?? (app ? app.collections.map((x) => x.slug).filter((x) => x !== app.adminUser && x !== 'tenants') : ['pages'])
  const imports = [
    `/// <reference types="@cloudflare/workers-types" />`,
    ...(app?.preload ?? []).map((p) => `import '${p}'`),
    `import { buildConfig } from 'payload'`,
    `import type { CollectionConfig } from 'payload'`,
    `import { lexicalEditor } from '@payloadcms/richtext-lexical'`,
    c.runtime === 'vinext' ? `import { env } from 'cloudflare:workers'` : `import { getCloudflareContext } from '@opennextjs/cloudflare'`,
    c.db === 'd1' ? `import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'` : '',
    c.db === 'postgres' ? `import { postgresAdapter } from '@payloadcms/db-postgres'` : '',
    c.db.startsWith('qpu') ? `import { qpuAdapter } from '@uuidna/qpu/payload'` : '',
    c.db === 'qpu-d1' ? `import { d1DocStore } from '@uuidna/qpu'` : '',
    c.storage === 'r2' ? `import { r2Storage } from '@payloadcms/storage-r2'` : '',
    c.storage === 's3' ? `import { s3Storage } from '@payloadcms/storage-s3'` : '',
    c.email === 'resend' ? `import { resendAdapter } from '@payloadcms/email-resend'` : '',
    plugins.includes('sentry') ? `import * as Sentry from '@sentry/nextjs'` : '',
    ...plugins.map((p) => `import { ${PLUGIN_CODE[p].name} } from '${PLUGIN_CODE[p].from}'`),
    ...(app?.collections ?? []).map((x) => `import { ${x.name} } from '${x.from}'`),
    app?.seed ? `import { ${app.seed.name} } from '${app.seed.from}'` : '',
  ].filter(Boolean)
  const bindings = [
    c.db === 'd1' || c.db === 'qpu-d1' ? 'D1: D1Database' : '',
    c.db === 'postgres' ? 'HYPERDRIVE: Hyperdrive' : '',
    c.db === 'qpu-raid' ? 'STORAGE: KVNamespace; BLOBS: R2Bucket' : '',
    c.storage === 'r2' ? 'MEDIA: R2Bucket' : '',
  ].filter(Boolean)
  // OpenNext: inside workerd the request context carries the bindings; the Payload CLI (generate, migrate) and
  // development read them through wrangler's platform proxy over the same wrangler file
  const local = `process.argv.some((a: string) => /^(generate|migrate)/.test(a)) || process.env.NODE_ENV !== 'production'`
  const proxy = `(await import(/* webpackIgnore: true */ \`\${'__wrangler'.replaceAll('_', '')}\`)).getPlatformProxy({ configPath: '${app?.wrangler ?? 'wrangler.jsonc'}', remoteBindings: false })`
  const cf = c.runtime === 'vinext' ? `const cf = env as unknown as CloudflareEnv` : `const cf = (${local} ? await ${proxy} : await getCloudflareContext({ async: true })).env as unknown as CloudflareEnv`
  const db = {
    d1: `sqliteD1Adapter({ binding: cf.D1 })`,
    postgres: `postgresAdapter({ pool: { connectionString: cf.HYPERDRIVE.connectionString } })`,
    'qpu-raid': `qpuAdapter({ env: { STORAGE: cf.STORAGE, BLOBS: cf.BLOBS } as never })`,
    'qpu-d1': `qpuAdapter({ store: d1DocStore(cf.D1 as never) })`,
  }[c.db]
  const storage = {
    r2: `r2Storage({ bucket: cf.MEDIA as never, collections: { media: true } })`,
    s3: `s3Storage({ bucket: process.env.S3_BUCKET ?? '', collections: { media: true }, config: { region: process.env.S3_REGION ?? 'auto', endpoint: process.env.S3_ENDPOINT, credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '', secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? '' } } })`,
    none: '',
  }[c.storage]
  const media = !app || c.storage !== 'none'
  const ownTenants = app?.collections.some((x) => x.slug === 'tenants') ?? false
  const collections = [
    app ? '' : `const Users: CollectionConfig = { slug: 'users', auth: true, fields: [] }`,
    media ? `const Media: CollectionConfig = { slug: 'media', upload: true, fields: [{ name: 'alt', type: 'text' }] }` : '',
    app ? '' : `const Pages: CollectionConfig = { slug: 'pages', versions: { drafts: true }, fields: [{ name: 'title', type: 'text', required: true }] }`,
    plugins.includes('multi-tenant') && !ownTenants ? `const Tenants: CollectionConfig = { slug: 'tenants', fields: [{ name: 'name', type: 'text', required: true }] }` : '',
  ].filter(Boolean)
  const collectionNames = [...(app ? app.collections.map((x) => x.name) : ['Users']), ...(media ? ['Media'] : []), ...(app ? [] : ['Pages']), ...(plugins.includes('multi-tenant') && !ownTenants ? ['Tenants'] : [])]
  const admin = app
    ? `  admin: { user: '${app.adminUser ?? 'users'}'${app.title ? `, meta: { titleSuffix: ' — ${app.title}' }` : ''}${app.dashboard ? `, components: { views: { dashboard: { Component: '${app.dashboard}' } } }` : ''} },`
    : ''
  return [
    `// Generated by PayloadTemplates.cloudflarePayload — ${cloudflareKeyOf(c)}${app ? ' — regenerate, do not edit' : ''}`,
    ...imports,
    '',
    `type CloudflareEnv = { ${bindings.join('; ')} }`,
    cf,
    '',
    ...collections,
    '',
    'export default buildConfig({',
    `  secret: process.env.PAYLOAD_SECRET ?? '',`,
    `  editor: lexicalEditor(),`,
    admin,
    `  collections: [${collectionNames.join(', ')}],`,
    `  db: ${db},`,
    c.email === 'resend' ? `  email: resendAdapter({ apiKey: process.env.RESEND_API_KEY ?? '', defaultFromAddress: process.env.EMAIL_FROM ?? 'noreply@example.com', defaultFromName: 'Payload' }),` : '',
    // Payload 4 takes storage adapters in `storage`, not in `plugins`
    storage ? `  storage: [${storage}],` : '',
    `  plugins: [${plugins.map((p) => PLUGIN_CODE[p].call(targetsOf(p))).join(', ')}],`,
    app?.origins ? `  cors: ${JSON.stringify(app.origins).replace(/"/g, "'")},\n  csrf: ${JSON.stringify(app.origins).replace(/"/g, "'")},` : '',
    app?.typescriptOutput ? `  typescript: { outputFile: '${app.typescriptOutput}' },` : '',
    app?.seed ? `  onInit: async (payload) => { await ${app.seed.name}(payload) },` : '',
    '})',
    '',
  ].filter((l) => l !== '').join('\n') + '\n'
}

const cloudflareWranglerOf = (c: CloudflareCombination, name: string, app?: CloudflareApp): string => {
  const w: Record<string, unknown> = {
    $schema: './node_modules/wrangler/config-schema.json',
    name,
    // an app reached through a service binding has no public address of its own
    ...(app?.bound ? { workers_dev: false, preview_urls: false } : {}),
    ...(c.runtime === 'opennext' ? { main: '.open-next/worker.js', assets: { directory: '.open-next/assets', binding: 'ASSETS' } } : {}),
    compatibility_date: '2026-10-01',
    compatibility_flags: ['nodejs_compat'],
    observability: { enabled: true },
  }
  if (c.db === 'd1' || c.db === 'qpu-d1') w.d1_databases = [{ binding: 'D1', database_name: `${name}-db` }]
  if (c.db === 'postgres') w.hyperdrive = [{ binding: 'HYPERDRIVE', id: '<HYPERDRIVE_ID>' }]
  if (c.db === 'qpu-raid') {
    w.kv_namespaces = [{ binding: 'STORAGE' }]
    w.r2_buckets = [{ binding: 'BLOBS', bucket_name: `${name}-blobs` }]
  }
  if (c.storage === 'r2') w.r2_buckets = [...((w.r2_buckets as unknown[]) ?? []), { binding: 'MEDIA', bucket_name: `${name}-media` }]
  return JSON.stringify(w, null, 2) + '\n'
}

/** The Next.js app around the config, for OpenNext: Payload's admin and REST routes, and a public site that renders one
 *  collection. Generated with the config so an app is one combination plus its content, nothing written by hand. */
const cloudflareShellOf = (c: CloudflareCombination, app?: CloudflareApp): Record<string, string> => {
  if (c.runtime !== 'opennext') return {}
  const head = '// Generated by PayloadTemplates.cloudflarePayload — regenerate, do not edit'
  const f = app?.frontend ?? { collection: 'pages', route: 'pages', html: 'html' }
  const site = `${head}
import config from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export const documentOf = async (slug: string) => {
  const payload = await getPayload({ config })
  const found = await payload.find({ collection: '${f.collection}' as never, where: { slug: { equals: slug } }, limit: 1, depth: 0 })
  return (found.docs[0] as { title?: string; description?: string; ${f.html}?: string } | undefined) ?? notFound()
}
`
  const page = (slugOf: string, params: string) => `${head}
import type { Metadata } from 'next'
import { documentOf } from ${params ? "'../../site'" : "'./site'"}

export const dynamic = 'force-dynamic'
${params ? `type Props = { params: Promise<{ slug: string }> }\n` : ''}
export async function generateMetadata(${params ? '{ params }: Props' : ''}): Promise<Metadata> {
  const doc = await documentOf(${slugOf})
  return { title: doc.title, description: doc.description, openGraph: { title: doc.title, description: doc.description, type: 'article' } }
}

export default async function Page(${params ? '{ params }: Props' : ''}) {
  const doc = await documentOf(${slugOf})
  return <article dangerouslySetInnerHTML={{ __html: doc.${f.html} ?? '' }} />
}
`
  return {
    'next.config.ts': `${head}
import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: { tsconfigPath: './tsconfig.payload.json' },
  // one build worker: each worker opens wrangler's local state, and parallel opens race on its SQLite lock
  experimental: { cpus: 1 },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = { '.cjs': ['.cts', '.cjs'], '.js': ['.ts', '.tsx', '.js', '.jsx'], '.mjs': ['.mts', '.mjs'] }
    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
`,
    'open-next.config.ts': `${head}
import { defineCloudflareConfig } from '@opennextjs/cloudflare'

export default { ...defineCloudflareConfig({}), buildCommand: 'npx next build --webpack' }
`,
    'app/(payload)/layout.tsx': `${head}
import config from '@payload-config'
import '@payloadcms/next/css'
import type { ServerFunctionClient } from 'payload'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import type React from 'react'
import { importMap } from './admin/importMap.js'
import './custom.scss'

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({ ...args, config, importMap })
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}
`,
    'app/(payload)/custom.scss': '',
    'app/(payload)/admin/[[...segments]]/page.tsx': `${head}
import config from '@payload-config'
import type { Metadata } from 'next'
import { generatePageMetadata, RootPage } from '@payloadcms/next/views'
import { importMap } from '../importMap.js'

type Args = { params: Promise<{ segments: string[] }>; searchParams: Promise<{ [key: string]: string | string[] }> }

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> => generatePageMetadata({ config, params, searchParams })

const Page = ({ params, searchParams }: Args) => RootPage({ config, importMap, params, searchParams })

export default Page
`,
    'app/(payload)/admin/[[...segments]]/not-found.tsx': `${head}
import config from '@payload-config'
import type { Metadata } from 'next'
import { generatePageMetadata, NotFoundPage } from '@payloadcms/next/views'
import { importMap } from '../importMap.js'

type Args = { params: Promise<{ segments: string[] }>; searchParams: Promise<{ [key: string]: string | string[] }> }

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> => generatePageMetadata({ config, params, searchParams })

const NotFound = ({ params, searchParams }: Args) => NotFoundPage({ config, importMap, params, searchParams })

export default NotFound
`,
    'app/(payload)/api/[...slug]/route.ts': `${head}
import config from '@payload-config'
import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST, REST_PUT } from '@payloadcms/next/routes'

export const GET = REST_GET(config)
export const POST = REST_POST(config)
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const PUT = REST_PUT(config)
export const OPTIONS = REST_OPTIONS(config)
`,
    'app/(frontend)/layout.tsx': `${head}
import type React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ font: '15px/1.55 system-ui, sans-serif', maxWidth: 1100, margin: '2rem auto', padding: '0 1rem' }}>{children}</body>
    </html>
  )
}
`,
    'app/(frontend)/site.ts': site,
    'app/(frontend)/page.tsx': page(`'index'`, ''),
    [`app/(frontend)/${f.route}/[slug]/page.tsx`]: page('(await params).slug', 'params'),
  }
}

const cloudflareDependenciesOf = (c: CloudflareCombination): string[] =>
  [
    'payload', '@payloadcms/next', '@payloadcms/richtext-lexical', 'next', 'react', 'react-dom', 'wrangler',
    c.runtime === 'opennext' ? '@opennextjs/cloudflare' : 'vinext',
    { d1: '@payloadcms/db-d1-sqlite', postgres: '@payloadcms/db-postgres', 'qpu-raid': '@uuidna/qpu', 'qpu-d1': '@uuidna/qpu' }[c.db],
    c.storage === 'none' ? '' : `@payloadcms/storage-${c.storage}`,
    c.email === 'resend' ? '@payloadcms/email-resend' : '',
    ...c.plugins.map((p) => PLUGIN_CODE[p].from),
    c.plugins.includes('sentry') ? '@sentry/nextjs' : '',
  ].filter(Boolean).sort()

/**
 * Generate one combination: payload.config.ts, wrangler.jsonc and dependencies, optionally carrying an app's own collections (CloudflareApp).
 * @wing cms
 * @kind builder
 */
export const cloudflarePayloadOf = (c: CloudflareCombination, name = 'payload-cloudflare', app?: CloudflareApp): CloudflarePayload => ({
  mode: 'cloudflare',
  version: '1.0.0',
  spec: { runtime: c.runtime, db: c.db, storage: c.storage, email: c.email, plugins: [...c.plugins].sort(), edge: true, isolates: 'per request' },
  // a Worker isolate: 128 MB, CPU time per request; the hardware is Cloudflare's, so these are the platform's limits
  hardware: { cpu: { cores: 1, freq: 0, cache: 'isolate' }, memory: { gb: 0.125, type: 'isolate' }, network: { bw: 'edge', latency: '0ms' }, storage: { ssd: 'no', type: c.db } },
  optimization: { cpu: { ipc: 1, frequency: 0, powerGating: false }, memory: { prefetch: false, compression: 0, cacheSize: 128 }, network: { routing: 'anycast', linkGating: false }, power: { vrm: 0, thermalTarget: 0 } },
  deployment: { instances: 1, scaling: { min: 0, max: 0, target: 0 }, monitoring: true, selfHealing: true, autonomousOptimization: false },
  combination: { ...c, plugins: [...c.plugins].sort() },
  key: cloudflareKeyOf(c),
  files: { 'payload.config.ts': cloudflareConfigOf(c, app), 'wrangler.jsonc': cloudflareWranglerOf(c, name, app), ...cloudflareShellOf(c, app) },
  dependencies: cloudflareDependenciesOf(c),
})

/**
 * Every combination of the axes: runtimes × databases × storage × email × every subset of the plugins.
 * @wing cms
 * @kind function
 */
export function* cloudflareCombinations(): Generator<CloudflareCombination> {
  for (const runtime of CLOUDFLARE_RUNTIMES)
    for (const db of CLOUDFLARE_DATABASES)
      for (const storage of CLOUDFLARE_STORAGE)
        for (const email of CLOUDFLARE_EMAIL)
          for (let mask = 0; mask < 1 << CLOUDFLARE_PLUGINS.length; mask++)
            yield { runtime, db, storage, email, plugins: CLOUDFLARE_PLUGINS.filter((_, i) => mask & (1 << i)) }
}

/**
 * A PayloadTemplates instance.
 * @wing cms
 * @kind function
 */
export const payloadTemplates = new PayloadTemplates()
