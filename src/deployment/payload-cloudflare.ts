// Cooled out of payload-templates.ts by the heat family (scripts/cool.mjs): CLOUDFLARE_RUNTIMES, CLOUDFLARE_DATABASES, CLOUDFLARE_STORAGE, CLOUDFLARE_EMAIL, CLOUDFLARE_PLUGINS, CloudflareCombination, CloudflarePayload, cloudflareKeyOf, cloudflareCombinationOf, PluginTargets, slugs, withOptions, PLUGIN_CODE, CloudflareApp, cloudflareConfigOf, cloudflareWranglerOf, cloudflareShellOf, registryOf, cloudflareFilesOf, cloudflareDependenciesOf, cloudflarePayloadOf, cloudflareCombinations.
import type { PayloadTemplate } from './payload-templates.js'

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

// an app's options for a plugin go inside the call's object literal, after the template's own
const withOptions = (call: string, options?: string): string =>
  !options ? call : options.includes('products:') && call.includes('products: true, ') ? withOptions(call.replace('products: true, ', ''), options) : call.endsWith('({})') ? `${call.slice(0, -3)}{ ${options} })` : call.replace(/\s*\}\)$/, `, ${options} })`)

const PLUGIN_CODE: Record<CloudflareCombination['plugins'][number], { from: string; name: string; call: (t: PluginTargets) => string }> = {
  ecommerce: {
    from: '@payloadcms/plugin-ecommerce', name: 'ecommercePlugin',
    call: () => `ecommercePlugin({ products: true, customers: { slug: 'users' }, access: { isAdmin: ({ req }) => Boolean(req.user), adminOnlyFieldAccess: ({ req }) => Boolean(req.user), adminOrPublishedStatus: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }), isDocumentOwner: ({ req }) => (req.user ? { customer: { equals: req.user.id } } : false) } })`,
  },
  'form-builder': { from: '@payloadcms/plugin-form-builder', name: 'formBuilderPlugin', call: () => 'formBuilderPlugin({})' },
  'import-export': { from: '@payloadcms/plugin-import-export', name: 'importExportPlugin', call: (t) => `importExportPlugin({ collections: [${t.map((x) => `{ slug: '${x}' }`).join(', ')}] })` },
  mcp: { from: '@payloadcms/plugin-mcp', name: 'mcpPlugin', call: (t) => `mcpPlugin({ collections: { ${t.map((x) => `'${x}': { description: '${x}' }`).join(', ')} } })` },
  'multi-tenant': { from: '@payloadcms/plugin-multi-tenant', name: 'multiTenantPlugin', call: (t) => `multiTenantPlugin({ collections: { ${t.map((x) => `'${x}': {}`).join(', ')} } })` },
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
  /** where the app's source lives (`src`, as payloadcms/website keeps it): the config and the app router go under it */
  root?: string
  /** registries read off the file system: one module per folder (src/blocks/Hero, src/components/blocks/Hero), gathered
   *  into an array or a record keyed by slug, so adding a folder adds an entry and nothing is listed by hand */
  registries?: { file: string; export: string; type?: { name: string; from: string }; record?: boolean; sideEffects?: boolean; entries: { name: string; from: string; key: string }[] }[]
  /** the app's globals (site-wide documents such as a header and footer), each a GlobalConfig export */
  globals?: { name: string; from: string; slug: string }[]
  adminUser?: string
  targets?: Partial<Record<CloudflareCombination['plugins'][number], string[]>>
  dashboard?: string
  origins?: string[]
  typescriptOutput?: string
  title?: string
  /** the collection the public site renders: `/` is the document with slug `index`, `/<route>/<slug>` any other; `html`
   *  is the field holding the rendered body */
  frontend?: { collection: string; route: string; html: string }
  /** runtime shims, each exporting install(): imported first and called before the config is built */
  preload?: string[]
  /** extra named imports the app's plugin options use */
  imports?: { name: string; from: string }[]
  /** shell files the app writes itself (its own frontend): the template leaves them alone */
  own?: string[]
  /** extra options per plugin, as object-literal source appended to the plugin's call */
  pluginOptions?: Partial<Record<CloudflareCombination['plugins'][number], string>>
  /** a module exporting `seed(payload)`, run on init (idempotent upserts) */
  seed?: { name: string; from: string }
  /** where the app's wrangler file lives, relative to the app root (OpenNext reads the bindings from it) */
  wrangler?: string
  /** reached only through another Worker's service binding: no workers.dev or preview address */
  bound?: boolean
  /** the app's own Worker settings laid over the combination's (entry, routes, vars, binding ids, version metadata):
   *  one Worker that is the app and whatever fronts it */
  worker?: Record<string, unknown>
}

const cloudflareConfigOf = (c: CloudflareCombination, app?: CloudflareApp): string => {
  const plugins = [...c.plugins].sort()
  const targetsOf = (p: CloudflareCombination['plugins'][number]) => app?.targets?.[p] ?? (app ? app.collections.map((x) => x.slug).filter((x) => x !== app.adminUser && x !== 'tenants') : ['pages'])
  const imports = [
    `/// <reference types="@cloudflare/workers-types" />`,
    ...(app?.preload ?? []).map((p, i) => `import { install as preload${i} } from '${p}'`),
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
    ...[...(app?.collections ?? []), ...(app?.globals ?? [])].map((x) => `import { ${x.name} } from '${x.from}'`),
    ...(app?.imports ?? []).map((x) => `import { ${x.name} } from '${x.from}'`),
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
    media ? `const Media: CollectionConfig = { slug: 'media', access: { read: () => true, create: ({ req }) => Boolean(req.user), update: ({ req }) => Boolean(req.user), delete: ({ req }) => Boolean(req.user) }, defaultPopulate: { alt: true, darkModeFallback: true, filename: true, height: true, mimeType: true, url: true, width: true }, fields: [{ name: 'alt', type: 'text', required: true }, { name: 'darkModeFallback', type: 'upload', relationTo: 'media', admin: { description: 'Choose an upload to render if the visitor is using dark mode.' } }], upload: true }` : '',
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
    ...(app?.preload ?? []).map((_, i) => `preload${i}()`),
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
    app?.globals?.length ? `  globals: [${app.globals.map((x) => x.name).join(', ')}],` : '',
    `  db: ${db},`,
    c.email === 'resend' ? `  email: resendAdapter({ apiKey: process.env.RESEND_API_KEY ?? '', defaultFromAddress: process.env.EMAIL_FROM ?? 'noreply@example.com', defaultFromName: 'Payload' }),` : '',
    // Payload 4 takes storage adapters in `storage`, not in `plugins`
    storage ? `  storage: [${storage}],` : '',
    `  plugins: [${plugins.map((p) => withOptions(PLUGIN_CODE[p].call(targetsOf(p)), app?.pluginOptions?.[p])).join(', ')}],`,
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
    // A cold Payload init (many collections + plugins) plus the first render can exceed the default 30s CPU limit and
    // return 503; raise the ceiling to the paid maximum so cold renders complete. This is a ceiling, not a cost — billing
    // is on actual CPU used — so it unblocks 503→200 while the actual per-render CPU is driven down by caching upstream.
    limits: { cpu_ms: 300_000 },
  }
  if (c.db === 'd1' || c.db === 'qpu-d1') w.d1_databases = [{ binding: 'D1', database_name: `${name}-db` }]
  if (c.db === 'postgres') w.hyperdrive = [{ binding: 'HYPERDRIVE', id: '<HYPERDRIVE_ID>' }]
  if (c.db === 'qpu-raid') {
    w.kv_namespaces = [{ binding: 'STORAGE' }]
    w.r2_buckets = [{ binding: 'BLOBS', bucket_name: `${name}-blobs` }]
  }
  if (c.storage === 'r2') w.r2_buckets = [...((w.r2_buckets as unknown[]) ?? []), { binding: 'MEDIA', bucket_name: `${name}-media` }]
  return JSON.stringify({ ...w, ...app?.worker }, null, 2) + '\n'
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

// a registry module: every folder's export, as an array or as a record keyed by the slug the folder's name gives
const registryOf = (r: NonNullable<CloudflareApp['registries']>[number]): string =>
  [
    `// Generated by PayloadTemplates.cloudflarePayload from the folders beside this file — regenerate, do not edit`,
    r.type ? `import type { ${r.type.name} } from '${r.type.from}'` : '',
    ...r.entries.map((e) => (r.sideEffects ? `import '${e.from}'` : `import { ${e.name} } from '${e.from}'`)),
    '',
    r.sideEffects
      ? `export const ${r.export} = [${r.entries.map((e) => `'${e.key}'`).join(', ')}] as const`
      : r.record
      ? `export const ${r.export} = {\n${r.entries.map((e) => `  ${e.key}: ${e.name},`).join('\n')}\n}${r.type ? ` satisfies Record<string, ${r.type.name}>` : ''}`
      : `export const ${r.export}${r.type ? `: ${r.type.name}[]` : ''} = [${r.entries.map((e) => e.name).join(', ')}]`,
    '',
  ].filter((l, i) => l !== '' || i > 1).join('\n')

// the app's files: under its root the config and the app router, beside them the registries; files the app owns are left alone
const cloudflareFilesOf = (c: CloudflareCombination, name: string, app?: CloudflareApp): Record<string, string> => {
  const under = (f: string) => (app?.root && (f === 'payload.config.ts' || f.startsWith('app/')) ? `${app.root}/${f}` : f)
  const files: Record<string, string> = {
    [under('payload.config.ts')]: cloudflareConfigOf(c, app),
    'wrangler.jsonc': cloudflareWranglerOf(c, name, app),
    ...Object.fromEntries(Object.entries(cloudflareShellOf(c, app)).map(([f, text]) => [under(f), text])),
    ...Object.fromEntries((app?.registries ?? []).map((r) => [r.file, registryOf(r)])),
  }
  return Object.fromEntries(Object.entries(files).filter(([f]) => !app?.own?.includes(f)))
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
  files: cloudflareFilesOf(c, name, app),
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
