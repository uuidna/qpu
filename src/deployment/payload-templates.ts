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
  static cloudflarePayload(c: CloudflareCombination, name?: string): CloudflarePayload {
    return cloudflarePayloadOf(c, name)
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

export const CLOUDFLARE_RUNTIMES = ['vinext', 'opennext'] as const
/** qpu-raid and qpu-d1 are the QPU document database (MongoDB semantics) on native bindings: a MongoDB request on Workers is one of these. */
export const CLOUDFLARE_DATABASES = ['d1', 'postgres', 'qpu-raid', 'qpu-d1'] as const
export const CLOUDFLARE_STORAGE = ['r2', 's3', 'none'] as const
export const CLOUDFLARE_EMAIL = ['resend', 'none'] as const
export const CLOUDFLARE_PLUGINS = ['ecommerce', 'form-builder', 'import-export', 'mcp', 'multi-tenant', 'nested-docs', 'redirects', 'search', 'sentry', 'seo', 'stripe'] as const

export type CloudflareCombination = {
  runtime: (typeof CLOUDFLARE_RUNTIMES)[number]
  db: (typeof CLOUDFLARE_DATABASES)[number]
  storage: (typeof CLOUDFLARE_STORAGE)[number]
  email: (typeof CLOUDFLARE_EMAIL)[number]
  plugins: (typeof CLOUDFLARE_PLUGINS)[number][]
}
export type CloudflarePayload = PayloadTemplate & { combination: CloudflareCombination; key: string; files: Record<string, string>; dependencies: string[] }

/** A combination's canonical key: the axes in order, plugins sorted — what its content UUID is taken over. */
export const cloudflareKeyOf = (c: CloudflareCombination): string =>
  [c.runtime, c.db, c.storage, c.email, [...c.plugins].sort().join('+') || '-'].join('/')
export const cloudflareCombinationOf = (key: string): CloudflareCombination => {
  const [runtime, db, storage, email, plugins] = key.split('/') as [never, never, never, never, string]
  return { runtime, db, storage, email, plugins: plugins === '-' ? [] : (plugins.split('+') as never) }
}

const PLUGIN_CODE: Record<CloudflareCombination['plugins'][number], { from: string; name: string; call: string; star?: boolean }> = {
  ecommerce: {
    from: '@payloadcms/plugin-ecommerce', name: 'ecommercePlugin',
    call: `ecommercePlugin({ products: true, customers: { slug: 'users' }, access: { isAdmin: ({ req }) => Boolean(req.user), adminOnlyFieldAccess: ({ req }) => Boolean(req.user), adminOrPublishedStatus: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }), isDocumentOwner: ({ req }) => (req.user ? { customer: { equals: req.user.id } } : false) } })`,
  },
  'form-builder': { from: '@payloadcms/plugin-form-builder', name: 'formBuilderPlugin', call: 'formBuilderPlugin({})' },
  'import-export': { from: '@payloadcms/plugin-import-export', name: 'importExportPlugin', call: `importExportPlugin({ collections: [{ slug: 'pages' }] })` },
  mcp: { from: '@payloadcms/plugin-mcp', name: 'mcpPlugin', call: `mcpPlugin({ collections: { pages: { description: 'Pages' } } })` },
  'multi-tenant': { from: '@payloadcms/plugin-multi-tenant', name: 'multiTenantPlugin', call: `multiTenantPlugin({ collections: { pages: {} } })` },
  'nested-docs': { from: '@payloadcms/plugin-nested-docs', name: 'nestedDocsPlugin', call: `nestedDocsPlugin({ collections: ['pages'] })` },
  redirects: { from: '@payloadcms/plugin-redirects', name: 'redirectsPlugin', call: `redirectsPlugin({ collections: ['pages'] })` },
  search: { from: '@payloadcms/plugin-search', name: 'searchPlugin', call: `searchPlugin({ collections: ['pages'] })` },
  sentry: { from: '@payloadcms/plugin-sentry', name: 'sentryPlugin', call: `sentryPlugin({ Sentry, enabled: Boolean(process.env.SENTRY_DSN) })` },
  seo: { from: '@payloadcms/plugin-seo', name: 'seoPlugin', call: `seoPlugin({ collections: ['pages'] })` },
  stripe: { from: '@payloadcms/plugin-stripe', name: 'stripePlugin', call: `stripePlugin({ stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? '' })` },
}

const cloudflareConfigOf = (c: CloudflareCombination): string => {
  const plugins = [...c.plugins].sort()
  const imports = [
    `/// <reference types="@cloudflare/workers-types" />`,
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
  ].filter(Boolean)
  const bindings = [
    c.db === 'd1' || c.db === 'qpu-d1' ? 'D1: D1Database' : '',
    c.db === 'postgres' ? 'HYPERDRIVE: Hyperdrive' : '',
    c.db === 'qpu-raid' ? 'STORAGE: KVNamespace; BLOBS: R2Bucket' : '',
    c.storage === 'r2' ? 'MEDIA: R2Bucket' : '',
  ].filter(Boolean)
  const cf = c.runtime === 'vinext' ? `const cf = env as unknown as CloudflareEnv` : `const cf = (await getCloudflareContext({ async: true })).env as unknown as CloudflareEnv`
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
  const collections = [
    `const Users: CollectionConfig = { slug: 'users', auth: true, fields: [] }`,
    `const Media: CollectionConfig = { slug: 'media', upload: true, fields: [{ name: 'alt', type: 'text' }] }`,
    `const Pages: CollectionConfig = { slug: 'pages', versions: { drafts: true }, fields: [{ name: 'title', type: 'text', required: true }] }`,
    plugins.includes('multi-tenant') ? `const Tenants: CollectionConfig = { slug: 'tenants', fields: [{ name: 'name', type: 'text', required: true }] }` : '',
  ].filter(Boolean)
  return [
    `// Generated by PayloadTemplates.cloudflarePayload — ${cloudflareKeyOf(c)}`,
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
    `  collections: [Users, Media, Pages${plugins.includes('multi-tenant') ? ', Tenants' : ''}],`,
    `  db: ${db},`,
    c.email === 'resend' ? `  email: resendAdapter({ apiKey: process.env.RESEND_API_KEY ?? '', defaultFromAddress: process.env.EMAIL_FROM ?? 'noreply@example.com', defaultFromName: 'Payload' }),` : '',
    // Payload 4 takes storage adapters in `storage`, not in `plugins`
    storage ? `  storage: [${storage}],` : '',
    `  plugins: [${plugins.map((p) => PLUGIN_CODE[p].call).join(', ')}],`,
    '})',
    '',
  ].filter((l) => l !== '').join('\n') + '\n'
}

const cloudflareWranglerOf = (c: CloudflareCombination, name: string): string => {
  const w: Record<string, unknown> = {
    $schema: './node_modules/wrangler/config-schema.json',
    name,
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

export const cloudflarePayloadOf = (c: CloudflareCombination, name = 'payload-cloudflare'): CloudflarePayload => ({
  mode: 'cloudflare',
  version: '1.0.0',
  spec: { runtime: c.runtime, db: c.db, storage: c.storage, email: c.email, plugins: [...c.plugins].sort(), edge: true, isolates: 'per request' },
  // a Worker isolate: 128 MB, CPU time per request; the hardware is Cloudflare's, so these are the platform's limits
  hardware: { cpu: { cores: 1, freq: 0, cache: 'isolate' }, memory: { gb: 0.125, type: 'isolate' }, network: { bw: 'edge', latency: '0ms' }, storage: { ssd: 'no', type: c.db } },
  optimization: { cpu: { ipc: 1, frequency: 0, powerGating: false }, memory: { prefetch: false, compression: 0, cacheSize: 128 }, network: { routing: 'anycast', linkGating: false }, power: { vrm: 0, thermalTarget: 0 } },
  deployment: { instances: 1, scaling: { min: 0, max: 0, target: 0 }, monitoring: true, selfHealing: true, autonomousOptimization: false },
  combination: { ...c, plugins: [...c.plugins].sort() },
  key: cloudflareKeyOf(c),
  files: { 'payload.config.ts': cloudflareConfigOf(c), 'wrangler.jsonc': cloudflareWranglerOf(c, name) },
  dependencies: cloudflareDependenciesOf(c),
})

/** Every combination of the axes: runtimes × databases × storage × email × every subset of the plugins. */
export function* cloudflareCombinations(): Generator<CloudflareCombination> {
  for (const runtime of CLOUDFLARE_RUNTIMES)
    for (const db of CLOUDFLARE_DATABASES)
      for (const storage of CLOUDFLARE_STORAGE)
        for (const email of CLOUDFLARE_EMAIL)
          for (let mask = 0; mask < 1 << CLOUDFLARE_PLUGINS.length; mask++)
            yield { runtime, db, storage, email, plugins: CLOUDFLARE_PLUGINS.filter((_, i) => mask & (1 << i)) }
}

export const payloadTemplates = new PayloadTemplates()
