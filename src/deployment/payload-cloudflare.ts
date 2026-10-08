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

/**
 * The frontend a combination delivers over the same Payload backend — the configs are frontend-agnostic. `next` is the
 * React app; `shadcn` adds Tailwind and shadcn/ui to it; `pwa` adds an installable web-app manifest and service worker;
 * `vitepress` delivers an alternative static docs frontend that reads the same Payload REST API. The backend (admin,
 * REST, the collections) is one; the frontend is the axis a public MCP consumer picks.
 * @wing cms
 * @kind constant
 */
export const CLOUDFLARE_FRONTENDS = ['next', 'shadcn', 'pwa', 'astro', 'sveltekit', 'nuxt', 'remix', 'solidstart', 'qwik', 'hono', 'vitepress', 'docusaurus', 'angular', 'gatsby'] as const

export type CloudflareCombination = {
  runtime: (typeof CLOUDFLARE_RUNTIMES)[number]
  db: (typeof CLOUDFLARE_DATABASES)[number]
  storage: (typeof CLOUDFLARE_STORAGE)[number]
  email: (typeof CLOUDFLARE_EMAIL)[number]
  frontend: (typeof CLOUDFLARE_FRONTENDS)[number]
  plugins: (typeof CLOUDFLARE_PLUGINS)[number][]
}

export type CloudflarePayload = PayloadTemplate & { combination: CloudflareCombination; key: string; files: Record<string, string>; dependencies: string[] }

/**
 * A combination's canonical key: the axes in order, plugins sorted — what its content UUID is taken over.
 * @wing cms
 * @kind builder
 */
export const cloudflareKeyOf = (c: CloudflareCombination): string =>
  [c.runtime, c.db, c.storage, c.email, c.frontend, [...c.plugins].sort().join('+') || '-'].join('/')

/**
 * Parse a combination key (runtime/db/storage/email/plugins) back into a combination.
 * @wing cms
 * @kind builder
 */
export const cloudflareCombinationOf = (key: string): CloudflareCombination => {
  const [runtime, db, storage, email, frontend, plugins] = key.split('/') as [never, never, never, never, never, string]
  return { runtime, db, storage, email, frontend, plugins: plugins === '-' ? [] : (plugins.split('+') as never) }
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
    `import { adminPlugin, billingPlugin, collectionPlugin, corsPlugin, domainsPlugin, editorPlugin, globalPlugin, permaculturePlugin, seedPlugin, typescriptPlugin, upgradePlugin, videoPlugin } from '@uuidna/qpu/payload/plugins'`,
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
    ? `{ user: '${app.adminUser ?? 'users'}'${app.title ? `, meta: { titleSuffix: ' — ${app.title}' }` : ''}${app.dashboard ? `, components: { views: { dashboard: { Component: '${app.dashboard}' } } }` : ''} }`
    : ''
  const qpuPlugins = [
    'editorPlugin(lexicalEditor())',
    admin ? `adminPlugin(${admin})` : '',
    ...collectionNames.map((name) => `collectionPlugin(${name})`),
    ...(app?.globals ?? []).map((g) => `globalPlugin(${g.name})`),
    app?.origins ? `corsPlugin(${JSON.stringify(app.origins)})` : '',
    app?.typescriptOutput ? `typescriptPlugin('${app.typescriptOutput}')` : '',
    app?.seed ? `seedPlugin(${app.seed.name})` : '',
    'billingPlugin()',
    'upgradePlugin()',
    'videoPlugin()',
    'domainsPlugin()',
    'permaculturePlugin()',
    ...plugins.map((p) => withOptions(PLUGIN_CODE[p].call(targetsOf(p)), app?.pluginOptions?.[p])),
  ].filter(Boolean)
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
    `  db: ${db},`,
    c.email === 'resend' ? `  email: resendAdapter({ apiKey: process.env.RESEND_API_KEY ?? '', defaultFromAddress: process.env.EMAIL_FROM ?? 'noreply@example.com', defaultFromName: 'Payload' }),` : '',
    // Payload 4 takes storage adapters in `storage`, not in `plugins` — a lead, not a second path
    storage ? `  storage: [${storage}],` : '',
    `  plugins: [${qpuPlugins.join(', ')}],`,
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
// EVERY CLOUDFLARE-COMPATIBLE FRAMEWORK OVER ONE SHARED BACKEND. next/shadcn/pwa are the Payload-native React app; the
// rest are alternative frontends that read the same Payload REST API (set PAYLOAD_URL to the backend origin) and deploy
// to Workers with their own adapter — a minimal, valid starter per framework, the config frontend-independent and
// shared. Each framework's files live under its own folder so they never clash with the admin app; generated URLs use
// string concatenation to avoid nested template literals.
export type FrontendCtx = { name: string; head: string; collection: string; html: string; theme: string }
export const ALT_FRONTENDS: Record<string, { deps: string[]; files: (x: FrontendCtx) => Record<string, string> }> = {
  vitepress: {
    deps: ['vitepress', 'vue'],
    files: (x) => ({
      'vitepress/.vitepress/config.ts': `${x.head}\nimport { defineConfig } from 'vitepress'\nexport default defineConfig({ title: '${x.name}', description: 'A Payload site, delivered with VitePress.', cleanUrls: true })\n`,
      'vitepress/pages.data.ts': `${x.head}\nimport { defineLoader } from 'vitepress'\nconst base = process.env.PAYLOAD_URL || 'http://localhost:3000'\nexport default defineLoader({\n  async load() {\n    const r = await fetch(base + '/api/${x.collection}?limit=100&depth=0')\n    const { docs = [] } = (await r.json()) as { docs?: { title?: string; slug?: string; ${x.html}?: string }[] }\n    return docs.map((d) => ({ title: d.title || '', slug: d.slug || '', html: d.${x.html} || '' }))\n  },\n})\n`,
      'vitepress/index.md': `---\ntitle: ${x.name}\n---\n<script setup>\nimport { data as pages } from './pages.data.ts'\n</script>\n\n# {{ $frontmatter.title }}\n\n<ul>\n  <li v-for="p in pages" :key="p.slug"><a :href="'/' + p.slug">{{ p.title }}</a></li>\n</ul>\n`,
    }),
  },
  astro: {
    deps: ['astro', '@astrojs/cloudflare'],
    files: (x) => ({
      'astro/astro.config.mjs': `${x.head}\nimport { defineConfig } from 'astro/config'\nimport cloudflare from '@astrojs/cloudflare'\nexport default defineConfig({ output: 'server', adapter: cloudflare() })\n`,
      'astro/src/pages/index.astro': `---\nconst base = import.meta.env.PAYLOAD_URL || 'http://localhost:3000'\nconst { docs = [] } = await fetch(base + '/api/${x.collection}?limit=100&depth=0').then((r) => r.json())\n---\n<html lang="en"><head><meta charset="utf-8" /><title>${x.name}</title></head>\n<body><h1>${x.name}</h1><ul>{docs.map((d: any) => <li><a href={'/' + d.slug}>{d.title}</a></li>)}</ul></body></html>\n`,
    }),
  },
  sveltekit: {
    deps: ['@sveltejs/kit', '@sveltejs/adapter-cloudflare', 'svelte'],
    files: (x) => ({
      'sveltekit/svelte.config.js': `${x.head}\nimport adapter from '@sveltejs/adapter-cloudflare'\nexport default { kit: { adapter: adapter() } }\n`,
      'sveltekit/src/routes/+page.server.ts': `${x.head}\nexport const load = async ({ fetch }) => {\n  const base = process.env.PAYLOAD_URL || 'http://localhost:3000'\n  const { docs = [] } = await fetch(base + '/api/${x.collection}?limit=100&depth=0').then((r) => r.json())\n  return { docs }\n}\n`,
      'sveltekit/src/routes/+page.svelte': `<script lang="ts">export let data</script>\n<h1>${x.name}</h1>\n<ul>{#each data.docs as d}<li><a href={'/' + d.slug}>{d.title}</a></li>{/each}</ul>\n`,
    }),
  },
  nuxt: {
    deps: ['nuxt'],
    files: (x) => ({
      'nuxt/nuxt.config.ts': `${x.head}\nexport default defineNuxtConfig({ nitro: { preset: 'cloudflare_module' }, runtimeConfig: { public: { payloadUrl: process.env.PAYLOAD_URL || 'http://localhost:3000' } } })\n`,
      'nuxt/app.vue': `<script setup lang="ts">\nconst base = useRuntimeConfig().public.payloadUrl\nconst { data } = await useFetch(base + '/api/${x.collection}?limit=100&depth=0')\n</script>\n<template><h1>${x.name}</h1><ul><li v-for="d in (data?.docs || [])" :key="d.slug"><a :href="'/' + d.slug">{{ d.title }}</a></li></ul></template>\n`,
    }),
  },
  remix: {
    deps: ['react-router', '@react-router/cloudflare', 'react', 'react-dom'],
    files: (x) => ({
      'remix/react-router.config.ts': `${x.head}\nimport type { Config } from '@react-router/dev/config'\nexport default { ssr: true } satisfies Config\n`,
      'remix/app/routes/_index.tsx': `${x.head}\nexport async function loader() {\n  const base = process.env.PAYLOAD_URL || 'http://localhost:3000'\n  const { docs = [] } = await fetch(base + '/api/${x.collection}?limit=100&depth=0').then((r) => r.json())\n  return { docs }\n}\nexport default function Index({ loaderData }: { loaderData: { docs: any[] } }) {\n  return <main><h1>${x.name}</h1><ul>{loaderData.docs.map((d) => <li key={d.slug}><a href={'/' + d.slug}>{d.title}</a></li>)}</ul></main>\n}\n`,
    }),
  },
  solidstart: {
    deps: ['@solidjs/start', 'solid-js', 'vinxi'],
    files: (x) => ({
      'solidstart/app.config.ts': `${x.head}\nimport { defineConfig } from '@solidjs/start/config'\nexport default defineConfig({ server: { preset: 'cloudflare_module' } })\n`,
      'solidstart/src/routes/index.tsx': `${x.head}\nimport { createAsync, query } from '@solidjs/router'\nconst getDocs = query(async () => {\n  'use server'\n  const base = process.env.PAYLOAD_URL || 'http://localhost:3000'\n  const { docs = [] } = await fetch(base + '/api/${x.collection}?limit=100&depth=0').then((r) => r.json())\n  return docs as any[]\n}, 'docs')\nexport default function Index() {\n  const docs = createAsync(() => getDocs())\n  return <main><h1>${x.name}</h1><ul>{(docs() || []).map((d) => <li><a href={'/' + d.slug}>{d.title}</a></li>)}</ul></main>\n}\n`,
    }),
  },
  qwik: {
    deps: ['@builder.io/qwik', '@builder.io/qwik-city'],
    files: (x) => ({
      'qwik/src/routes/index.tsx': `${x.head}\nimport { component$ } from '@builder.io/qwik'\nimport { routeLoader$ } from '@builder.io/qwik-city'\nexport const useDocs = routeLoader$(async () => {\n  const base = process.env.PAYLOAD_URL || 'http://localhost:3000'\n  const { docs = [] } = await fetch(base + '/api/${x.collection}?limit=100&depth=0').then((r) => r.json())\n  return docs as any[]\n})\nexport default component$(() => {\n  const docs = useDocs()\n  return <main><h1>${x.name}</h1><ul>{docs.value.map((d) => <li><a href={'/' + d.slug}>{d.title}</a></li>)}</ul></main>\n})\n`,
    }),
  },
  hono: {
    deps: ['hono'],
    files: (x) => ({
      'hono/src/index.ts': `${x.head}\nimport { Hono } from 'hono'\nconst app = new Hono()\napp.get('/', async (c) => {\n  const base = c.env?.PAYLOAD_URL || 'http://localhost:3000'\n  const { docs = [] } = await fetch(base + '/api/${x.collection}?limit=100&depth=0').then((r) => r.json())\n  const items = docs.map((d: any) => '<li><a href=\"/' + d.slug + '\">' + d.title + '</a></li>').join('')\n  return c.html('<h1>${x.name}</h1><ul>' + items + '</ul>')\n})\nexport default app\n`,
    }),
  },
  docusaurus: {
    deps: ['@docusaurus/core', '@docusaurus/preset-classic', 'react', 'react-dom'],
    files: (x) => ({
      'docusaurus/docusaurus.config.ts': `${x.head}\nimport type { Config } from '@docusaurus/types'\nconst config: Config = { title: '${x.name}', url: 'https://example.com', baseUrl: '/', presets: [['classic', { docs: { routeBasePath: '/' } }]] }\nexport default config\n`,
      'docusaurus/src/pages/index.tsx': `${x.head}\nimport React from 'react'\nexport default function Home(): React.ReactElement {\n  return <main><h1>${x.name}</h1><p>Content is read from the Payload REST API at build time (PAYLOAD_URL).</p></main>\n}\n`,
    }),
  },
  angular: {
    deps: ['@angular/core', '@analogjs/platform', 'vite'],
    files: (x) => ({
      'angular/vite.config.ts': `${x.head}\nimport { defineConfig } from 'vite'\nimport analog from '@analogjs/platform'\nexport default defineConfig({ plugins: [analog({ nitro: { preset: 'cloudflare-module' } })] })\n`,
      'angular/src/app/pages/index.page.ts': `${x.head}\nimport { Component } from '@angular/core'\n@Component({ standalone: true, template: '<h1>${x.name}</h1>' })\nexport default class IndexPage {}\n`,
    }),
  },
  gatsby: {
    deps: ['gatsby', 'react', 'react-dom'],
    files: (x) => ({
      'gatsby/gatsby-config.ts': `${x.head}\nimport type { GatsbyConfig } from 'gatsby'\nconst config: GatsbyConfig = { siteMetadata: { title: '${x.name}' }, plugins: [] }\nexport default config\n`,
      'gatsby/src/pages/index.tsx': `${x.head}\nimport * as React from 'react'\nexport default function IndexPage(): React.ReactElement {\n  return <main><h1>${x.name}</h1></main>\n}\n`,
    }),
  },
}

const cloudflareShellOf = (c: CloudflareCombination, name = 'payload-cloudflare', app?: CloudflareApp): Record<string, string> => {
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
  // THE FRONTEND AXIS, LAYERED ON THE SAME BACKEND. shadcn adds Tailwind and shadcn tokens to the React app; pwa adds
  // an installable manifest and a service worker; vitepress adds an alternative static frontend that reads the same
  // Payload REST API. The default (next) is the plain React app. The admin, the REST routes and the config are one.
  const shadcn = c.frontend === 'shadcn'
  const pwa = c.frontend === 'pwa'
  const theme = '#7a142b'
  const layout = `${head}
import type React from 'react'
${shadcn ? "import './globals.css'\n" : ''}export const metadata = { title: '${app?.title ?? name}'${pwa ? ", manifest: '/manifest.webmanifest'" : ''} }
${pwa ? `export const viewport = { themeColor: '${theme}' }\n` : ''}export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body${shadcn ? ' className="min-h-dvh bg-background text-foreground"' : " style={{ font: '15px/1.55 system-ui, sans-serif', maxWidth: 1100, margin: '2rem auto', padding: '0 1rem' }}"}>${pwa ? `
        <script dangerouslySetInnerHTML={{ __html: "if('serviceWorker' in navigator){addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}))}" }} />` : ''}
        {children}
      </body>
    </html>
  )
}
`
  const extra: Record<string, string> = shadcn
    ? {
        'app/(frontend)/globals.css': `@import "tailwindcss";\n@theme{--color-background:#ffffff;--color-foreground:${theme};--color-primary:${theme};--radius:0.5rem}\nbody{background:var(--color-background);color:var(--color-foreground)}\n`,
        'postcss.config.mjs': `export default { plugins: { '@tailwindcss/postcss': {} } }\n`,
        'lib/utils.ts': `import { clsx, type ClassValue } from 'clsx'\nimport { twMerge } from 'tailwind-merge'\n\nexport const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))\n`,
        'components.json': `${JSON.stringify({ $schema: 'https://ui.shadcn.com/schema.json', style: 'new-york', rsc: true, tsx: true, tailwind: { config: '', css: 'app/(frontend)/globals.css', baseColor: 'neutral', cssVariables: true }, aliases: { components: '@/components', utils: '@/lib/utils', ui: '@/components/ui' } }, null, 2)}\n`,
      }
    : pwa
      ? {
          'public/manifest.webmanifest': `${JSON.stringify({ name: app?.title ?? name, short_name: (app?.title ?? name).slice(0, 12), start_url: '/', scope: '/', display: 'standalone', background_color: '#ffffff', theme_color: theme, description: 'A Payload site on Cloudflare Workers.', icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }] }, null, 2)}\n`,
          'public/icon.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="96" fill="${theme}"/><text x="256" y="356" font-family="system-ui,sans-serif" font-size="320" font-weight="700" text-anchor="middle" fill="#fff">q</text></svg>\n`,
          'public/sw.js': `const C='pwa-v1'\nself.addEventListener('install',()=>self.skipWaiting())\nself.addEventListener('activate',e=>e.waitUntil(self.clients.claim()))\nself.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;e.respondWith((async()=>{try{const net=await fetch(r);const c=await caches.open(C);c.put(r,net.clone());return net}catch{const c=await caches.open(C);return (await c.match(r))||(r.mode==='navigate'?await c.match('/'):Response.error())}})())})\n`,
        }
      : (ALT_FRONTENDS[c.frontend]?.files({ name: app?.title ?? name, head, collection: f.collection, html: f.html, theme }) ?? {})
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
    'app/(frontend)/layout.tsx': layout,
    'app/(frontend)/site.ts': site,
    'app/(frontend)/page.tsx': page(`'index'`, ''),
    [`app/(frontend)/${f.route}/[slug]/page.tsx`]: page('(await params).slug', 'params'),
    ...extra,
  }
}

/** Relative registry paths are NodeNext specifiers. Families already write `.js`; a bare `./Name` gets the same. Package names stay as given. */
const registrySpecifierOf = (from: string): string =>
  from.startsWith('.') && !/\.[cm]?[jt]sx?$/.test(from) ? `${from}.js` : from

// a registry module: every folder's export, as an array or as a record keyed by the slug the folder's name gives
const registryOf = (r: NonNullable<CloudflareApp['registries']>[number]): string =>
  [
    `// Generated by PayloadTemplates.cloudflarePayload from the folders beside this file — regenerate, do not edit`,
    r.type ? `import type { ${r.type.name} } from '${r.type.from}'` : '',
    ...r.entries.map((e) => (r.sideEffects ? `import '${registrySpecifierOf(e.from)}'` : `import { ${e.name} } from '${registrySpecifierOf(e.from)}'`)),
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
    ...Object.fromEntries(Object.entries(cloudflareShellOf(c, name, app)).map(([f, text]) => [under(f), text])),
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
    // the frontend axis: shadcn brings Tailwind and the shadcn primitives; vitepress is its own static frontend; pwa
    // ships a hand-written manifest and service worker, so it needs nothing beyond next
    ...(c.frontend === 'shadcn' ? ['tailwindcss', '@tailwindcss/postcss', 'class-variance-authority', 'clsx', 'tailwind-merge', 'lucide-react'] : []),
    ...(ALT_FRONTENDS[c.frontend]?.deps ?? []),
  ].filter(Boolean).sort()

/**
 * Generate one combination: payload.config.ts, wrangler.jsonc and dependencies, optionally carrying an app's own collections (CloudflareApp).
 * @wing cms
 * @kind builder
 */
export const cloudflarePayloadOf = (c: CloudflareCombination, name = 'payload-cloudflare', app?: CloudflareApp): CloudflarePayload => ({
  mode: 'cloudflare',
  version: '1.0.0',
  spec: { runtime: c.runtime, db: c.db, storage: c.storage, email: c.email, frontend: c.frontend, plugins: [...c.plugins].sort(), edge: true, isolates: 'per request' },
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
          for (const frontend of CLOUDFLARE_FRONTENDS)
            for (let mask = 0; mask < 1 << CLOUDFLARE_PLUGINS.length; mask++)
              yield { runtime, db, storage, email, frontend, plugins: CLOUDFLARE_PLUGINS.filter((_, i) => mask & (1 << i)) }
}
