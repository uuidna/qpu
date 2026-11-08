// The repositories of the quantumlib and payloadcms GitHub organizations, as their repository lists state them. Each description is the
// repository's own one-line description; the language is the primary language the list shows. Cirq, qsim, Qualtran and the
// OpenFermion family are the quantumlib ones this repository implements or names elsewhere; PAYLOADCMS_REPOSITORIES consolidates
// every QPU surface around its canonical github.com/payloadcms/* repository, monorepo package, and QPU plugin counterpart.
import { TABLES } from './tables-index.ts'
import { canonicalText, seal, uuid } from '../uuid/index.ts'

export type Repository = { name: string; description: string; language: string }

export const REPOSITORIES = TABLES.REPOSITORIES as readonly Repository[]

const PAYLOADCMS_ORIGIN = ['https:', '', 'github.com', 'payloadcms'].join('/')

export type PayloadcmsPackageRole =
  | 'core'
  | 'editor'
  | 'database'
  | 'storage'
  | 'email'
  | 'plugin'
  | 'tooling'

export type PayloadcmsPackageMapping = {
  /** npm package name (`payload` or `@payloadcms/*`) */
  pkg: string
  /** Upstream path in `github.com/payloadcms/payload` */
  upstreamPath: string
  /** Version pinned in `@uuidna/qpu` */
  version: string
  /** Architectural role in the Payload stack */
  role: PayloadcmsPackageRole
  /** QPU plugin / module export(s) that wrap, configure, or extend this package */
  qpuCounterparts: readonly string[]
  /** QPU plugin slug in `definePlugin` / `plugins` map */
  qpuPluginSlug: string
  /** Collections owned or hooked by this package in QPU */
  collections: readonly string[]
  /** Coin-coil / accounting / quantum role in QPU */
  accounting: string
  /** MCP / API door that configures or inspects this package */
  door: { tool: 'payload' | 'configure'; arguments: Record<string, unknown> }
}

export type PayloadcmsRepoMapping = {
  /** Short repo slug under `payloadcms` (`website`, `payload`, `skills`) */
  id: 'website' | 'payload' | 'skills'
  /** Full GitHub repository (`payloadcms/<id>`) */
  repo: `payloadcms/${'website' | 'payload' | 'skills'}`
  /** Canonical upstream URL */
  url: string
  /** Upstream license */
  licence: string
  /** Primary language */
  language: 'TypeScript' | 'Markdown'
  /** Local clone or sibling workspace path relative to `qpu` */
  localClone: string
  /** Role in the QPU architecture */
  role: string
  /** QPU exports and plugins consolidated around this repository */
  qpuExports: readonly string[]
  /** Public Payload API & MCP doors that serve this repository's surface */
  endpoints: readonly string[]
  /** MCP tool call that inspects or configures this repository */
  door: { tool: 'payload' | 'configure'; arguments: Record<string, unknown> }
  /** Upstream templates or subtrees inside this repository */
  templates?: readonly {
    name: string
    upstreamPath: string
    qpuCounterparts: readonly string[]
    collections: readonly string[]
    door: { tool: 'payload' | 'configure'; arguments: Record<string, unknown> }
  }[]
  /** Monorepo packages mapped one-for-one to QPU plugins/adapters (for `payloadcms/payload`) */
  packages?: readonly PayloadcmsPackageMapping[]
}

/**
 * Canonical `payloadcms/payload` monorepo packages mounted by `@uuidna/qpu`,
 * each mapped directly to its QPU plugin, adapter, collection, and coin-coil accounting counterpart.
 */
export const PAYLOADCMS_MONOREPO_PACKAGES: readonly PayloadcmsPackageMapping[] = [
  {
    pkg: 'payload',
    upstreamPath: 'packages/payload',
    version: '4.0.0-beta.7',
    role: 'core',
    qpuCounterparts: ['qpuPlugin', 'qpuCore', 'qpuHooks', 'qpuGovernance', 'Qpu', 'Entries', 'Tenants', 'QpuGlobal'],
    qpuPluginSlug: 'qpu',
    collections: ['pages', 'posts', 'media', 'users', 'entries', 'tenants'],
    accounting: 'definePlugin + buildConfig + createDatabaseAdapter + jobs queue (qpu-google-call, qpu-lead-run, qpu-news-solve, qpu-raid-verify) + 33 witness hooks',
    door: { tool: 'payload', arguments: { schemas: true } },
  },
  {
    pkg: '@payloadcms/next',
    upstreamPath: 'packages/next',
    version: '4.0.0-beta.7',
    role: 'core',
    qpuCounterparts: ['qpuCore', 'qpuPlugin'],
    qpuPluginSlug: 'qpu',
    collections: ['pages', 'entries'],
    accounting: 'Next.js App Router delivery for /admin, /api/*, /api/qpu/feeds, /api/qpu/repos, /api/mcp and OpenNext Cloudflare Worker bundle',
    door: { tool: 'configure', arguments: { kind: 'fullstack' } },
  },
  {
    pkg: '@payloadcms/ui',
    upstreamPath: 'packages/ui',
    version: '4.0.0-beta.7',
    role: 'core',
    qpuCounterparts: ['qpuCore', 'QpuLogo', 'QpuIcon', 'QpuApp'],
    qpuPluginSlug: 'qpu',
    collections: [],
    accounting: 'Admin panel graphics (QpuLogo, QpuIcon) and beforeDashboard MCP Apps host (QpuApp) styled from the tenant UUID address',
    door: { tool: 'configure', arguments: { kind: 'ui' } },
  },
  {
    pkg: '@payloadcms/richtext-lexical',
    upstreamPath: 'packages/richtext-lexical',
    version: '4.0.0-beta.7',
    role: 'editor',
    qpuCounterparts: ['qpuLexicalBlocks', 'qpuHooks', 'Qpu'],
    qpuPluginSlug: 'qpu-hooks',
    collections: ['pages', 'posts'],
    accounting: 'BlocksFeature qpu + driveFile nodes; before/after node & field witness hooks collapse into 14 cuboctahedron states',
    door: { tool: 'payload', arguments: { hooks: {} } },
  },
  {
    pkg: '@payloadcms/db-d1-sqlite',
    upstreamPath: 'packages/db-d1-sqlite',
    version: '4.0.0-beta.7',
    role: 'database',
    qpuCounterparts: ['qpuDb', 'qpuAdapterPlugins', 'qpuRaidDb', 'qpuRaid'],
    qpuPluginSlug: 'qpu-db-d1-sqlite',
    collections: ['pages', 'posts', 'media', 'users', 'entries', 'tenants', 'products', 'orders'],
    accounting: 'sqliteD1Adapter on Cloudflare D1 (profile cloudflare) + qpuRaidDb RAID store + qpuRaid binding-0 mirror',
    door: { tool: 'configure', arguments: { kind: 'adapters', env: ['D1', 'R2', 'RESEND_API_KEY'] } },
  },
  {
    pkg: '@payloadcms/db-mongodb',
    upstreamPath: 'packages/db-mongodb',
    version: '4.0.0-beta.7',
    role: 'database',
    qpuCounterparts: ['qpuDb', 'qpuAdapterPlugins', 'qpuRaidDb', 'qpuRaid'],
    qpuPluginSlug: 'qpu-db-mongodb',
    collections: ['pages', 'posts', 'media', 'users', 'entries', 'tenants', 'products', 'orders'],
    accounting: 'mongooseAdapter (profile vercel/local) + mongo query language over content-addressed RAID blobs',
    door: { tool: 'configure', arguments: { kind: 'adapters', env: ['DATABASE_URI'] } },
  },
  {
    pkg: '@payloadcms/db-postgres',
    upstreamPath: 'packages/db-postgres',
    version: '4.0.0-beta.7',
    role: 'database',
    qpuCounterparts: ['qpuDb', 'qpuAdapterPlugins', 'qpuRaidDb', 'qpuRaid'],
    qpuPluginSlug: 'qpu-db-postgres',
    collections: ['pages', 'posts', 'media', 'users', 'entries', 'tenants', 'products', 'orders'],
    accounting: 'postgresAdapter on Cloud SQL (profile google) + qpuRaidDb RAID store + qpuRaid binding-0 mirror',
    door: { tool: 'configure', arguments: { kind: 'adapters', env: ['GOOGLE_CLOUD_PROJECT', 'DATABASE_URI'] } },
  },
  {
    pkg: '@payloadcms/storage-r2',
    upstreamPath: 'packages/storage-r2',
    version: '4.0.0-beta.7',
    role: 'storage',
    qpuCounterparts: ['qpuAdapterPlugins', 'qpuRaidDb', 'qpuRaid'],
    qpuPluginSlug: 'qpu-storage-r2',
    collections: ['media'],
    accounting: 'r2Storage on Cloudflare R2 (profile cloudflare) + RAID hex-path object store',
    door: { tool: 'configure', arguments: { kind: 'adapters', env: ['D1', 'R2'] } },
  },
  {
    pkg: '@payloadcms/storage-gcs',
    upstreamPath: 'packages/storage-gcs',
    version: '4.0.0-beta.7',
    role: 'storage',
    qpuCounterparts: ['qpuAdapterPlugins', 'qpuGoogle'],
    qpuPluginSlug: 'qpu-storage-gcs',
    collections: ['media'],
    accounting: 'gcsStorage on Google Cloud Storage (profile google)',
    door: { tool: 'configure', arguments: { kind: 'adapters', env: ['GOOGLE_CLOUD_PROJECT', 'GCS_BUCKET'] } },
  },
  {
    pkg: '@payloadcms/storage-vercel-blob',
    upstreamPath: 'packages/storage-vercel-blob',
    version: '4.0.0-beta.7',
    role: 'storage',
    qpuCounterparts: ['qpuAdapterPlugins'],
    qpuPluginSlug: 'qpu-storage-vercel-blob',
    collections: ['media'],
    accounting: 'vercelBlobStorage on Vercel Blob (profile vercel/local, payloadcms/website default)',
    door: { tool: 'configure', arguments: { kind: 'adapters', env: ['BLOB_READ_WRITE_TOKEN'] } },
  },
  {
    pkg: '@payloadcms/email-nodemailer',
    upstreamPath: 'packages/email-nodemailer',
    version: '4.0.0-beta.7',
    role: 'email',
    qpuCounterparts: ['qpuEmail', 'qpuAdapterPlugins'],
    qpuPluginSlug: 'qpu-email-nodemailer',
    collections: ['users', 'form-submissions'],
    accounting: 'nodemailerAdapter over Gmail SMTP (profile google) or SendGrid SMTP (payloadcms/website default)',
    door: { tool: 'configure', arguments: { kind: 'adapters', env: ['GMAIL_USER'] } },
  },
  {
    pkg: '@payloadcms/email-resend',
    upstreamPath: 'packages/email-resend',
    version: '4.0.0-beta.7',
    role: 'email',
    qpuCounterparts: ['qpuEmail', 'qpuAdapterPlugins'],
    qpuPluginSlug: 'qpu-email-resend',
    collections: ['users', 'form-submissions'],
    accounting: 'resendAdapter over HTTP for Cloudflare Workers (profile cloudflare)',
    door: { tool: 'configure', arguments: { kind: 'adapters', env: ['D1', 'R2', 'RESEND_API_KEY'] } },
  },
  {
    pkg: '@payloadcms/plugin-ecommerce',
    upstreamPath: 'packages/plugin-ecommerce',
    version: '4.0.0-beta.7',
    role: 'plugin',
    qpuCounterparts: ['qpuEcommerce', 'QPU_CURRENCIES', 'feeds', 'ecommerceSeedItems'],
    qpuPluginSlug: 'ecommerce',
    collections: ['products', 'variants', 'carts', 'orders', 'transactions', 'addresses'],
    accounting: 'order-transaction-ledger: 6 products, 7 catalogue variants + 512 plugin-combination variants in EUR/USD/BGN via stripeAdapter; order accessToken is the licence key',
    door: { tool: 'configure', arguments: { kind: 'ecommerce' } },
  },
  {
    pkg: '@payloadcms/plugin-mcp',
    upstreamPath: 'packages/plugin-mcp',
    version: '4.0.0-beta.7',
    role: 'plugin',
    qpuCounterparts: ['qpuPlugins', 'qpuMcpPlugin', 'qpuMachineTool', 'qpuMachine', 'qpuAgents'],
    qpuPluginSlug: 'mcp',
    collections: ['payload-mcp-api-keys', 'pages', 'forms', 'form-submissions', 'media', 'products', 'carts', 'orders', 'tenants', 'entries', 'posts', 'search', 'redirects', 'variants', 'transactions', 'addresses', 'users'],
    accounting: 'website POST /api/mcp (plugin 4.0.0-beta.7, server qpu): collection find, create, update, and delete follow the signed-in user\'s collection access; 47 QPU tools stay the in-repo handler',
    door: { tool: 'configure', arguments: { kind: 'mcp' } },
  },
  {
    pkg: '@payloadcms/plugin-multi-tenant',
    upstreamPath: 'packages/plugin-multi-tenant',
    version: '4.0.0-beta.7',
    role: 'plugin',
    qpuCounterparts: ['qpuPlugins', 'Tenants', 'qpuCore'],
    qpuPluginSlug: 'multi-tenant',
    collections: ['tenants', 'pages', 'entries', 'products', 'orders'],
    accounting: 'tenant-namespace-isolation: scopes pages, entries, products, orders across uuidna, psg, ceci with tenant-admin/editor/viewer roles',
    door: { tool: 'configure', arguments: { kind: 'scopes' } },
  },
  {
    pkg: '@payloadcms/plugin-search',
    upstreamPath: 'packages/plugin-search',
    version: '4.0.0-beta.7',
    role: 'plugin',
    qpuCounterparts: ['qpuPlugins'],
    qpuPluginSlug: 'search',
    collections: ['search', 'pages', 'posts'],
    accounting: 'harmonic-priority-index: indexes pages and posts with tool/uuid fields and harmonic vortex priority',
    door: { tool: 'configure', arguments: { kind: 'payload' } },
  },
  {
    pkg: '@payloadcms/plugin-import-export',
    upstreamPath: 'packages/plugin-import-export',
    version: '4.0.0-beta.7',
    role: 'plugin',
    qpuCounterparts: ['qpuPlugins', 'qpuGovernance'],
    qpuPluginSlug: 'import-export',
    collections: ['pages', 'posts', 'entries', 'products', 'orders'],
    accounting: 'batch-transfer-seal: super-admin bulk import/export on pages, posts, entries, products, and export-only on orders',
    door: { tool: 'configure', arguments: { kind: 'payload' } },
  },
  {
    pkg: '@payloadcms/plugin-form-builder',
    upstreamPath: 'packages/plugin-form-builder',
    version: '4.0.0-beta.7',
    role: 'plugin',
    qpuCounterparts: ['websiteTemplatePlugins', 'qpuWebsitePlugins', 'qpuFormFields', 'qpuCore'],
    qpuPluginSlug: 'form-builder',
    collections: ['forms', 'form-submissions'],
    accounting: 'submission-payment-coil: Google Forms-mirrored qpuFormFields + Request an app form-submissions afterChange hook (appRequest)',
    door: { tool: 'payload', arguments: { app: { form: true } } },
  },
  {
    pkg: '@payloadcms/plugin-seo',
    upstreamPath: 'packages/plugin-seo',
    version: '4.0.0-beta.7',
    role: 'plugin',
    qpuCounterparts: ['websiteTemplatePlugins', 'qpuWebsitePlugins', 'payloadDoc'],
    qpuPluginSlug: 'seo',
    collections: ['case-studies', 'pages', 'posts'],
    accounting: 'meta-seam-optimisation: Open Graph og:title, og:description, og:image and JSON-LD bound to QPU blocks',
    door: { tool: 'payload', arguments: { hologram: true } },
  },
  {
    pkg: '@payloadcms/plugin-nested-docs',
    upstreamPath: 'packages/plugin-nested-docs',
    version: '4.0.0-beta.7',
    role: 'plugin',
    qpuCounterparts: ['websiteTemplatePlugins', 'qpuWebsitePlugins', 'payloadDoc'],
    qpuPluginSlug: 'nested-docs',
    collections: ['pages'],
    accounting: 'breadcrumb-chain: parent → child breadcrumbs for UUID referer chains and 3-deep Gates › category › gate hierarchy',
    door: { tool: 'configure', arguments: { kind: 'gates' } },
  },
  {
    pkg: '@payloadcms/plugin-redirects',
    upstreamPath: 'packages/plugin-redirects',
    version: '4.0.0-beta.7',
    role: 'plugin',
    qpuCounterparts: ['websiteTemplatePlugins', 'qpuWebsitePlugins'],
    qpuPluginSlug: 'redirects',
    collections: ['redirects', 'case-studies', 'pages', 'posts'],
    accounting: 'hop-conservation: /<prev> → /<next> program-rotation redirects conserving 1 coin down and 1 coin up',
    door: { tool: 'configure', arguments: { kind: 'payload' } },
  },
] as const

/**
 * Canonical `github.com/payloadcms/*` repository registry consolidating all QPU surfaces:
 *   1. `payloadcms/website` — this repository develops in `src/` to that upstream standard; MCP mounts via `qpuMcpPlugin` / `qpuPlugin()`
 *   2. `payloadcms/payload` — the monorepo of 45 packages (21 directly mounted in `@uuidna/qpu`) + `templates/ecommerce` + `templates/website`
 *   3. `payloadcms/skills` — agent skills (`payload`, `cms-migration`) and 14 reference guides enacted by QPU tools
 */
export const PAYLOADCMS_REPOSITORIES: readonly PayloadcmsRepoMapping[] = [
  {
    id: 'website',
    repo: 'payloadcms/website',
    url: `${PAYLOADCMS_ORIGIN}/website`,
    licence: 'MIT',
    language: 'TypeScript',
    localClone: 'src',
    role: 'This full-stack repo develops in src/ against payloadcms/website (12 collections, 30 blocks, 5 globals, 10 fields). Upstream github.com/payloadcms/website is the layout standard; qpuPlugin / qpuMcpPlugin mount feeds and MCP on /api/qpu/feeds and /api/mcp',
    qpuExports: [
      'qpuWebsitePlugins',
      'websiteTemplatePlugins',
      'qpuPlugin',
      'qpuCore',
      'feeds',
      'Qpu',
      'Entries',
      'Tenants',
      'QpuGlobal',
    ],
    endpoints: ['/api/qpu/feeds', '/api/qpu/repos', '/api/qpu/google', '/api/qpu/accounting', '/api/mcp', '/api/globals/qpu', '/api/entries'],
    door: { tool: 'payload', arguments: { website: true } },
    templates: [
      {
        name: 'payloadcms.com website',
        upstreamPath: 'src/payload.config.ts',
        qpuCounterparts: ['qpuWebsitePlugins', 'websiteTemplatePlugins', 'qpuPlugin'],
        collections: ['case-studies', 'categories', 'community-help', 'docs', 'docs-feedback', 'media', 'pages', 'partners', 'posts', 'reusable-content', 'users', 'budgets', 'industries', 'regions', 'specialties'],
        door: { tool: 'configure', arguments: { kind: 'fullstack' } },
      },
    ],
  },
  {
    id: 'payload',
    repo: 'payloadcms/payload',
    url: `${PAYLOADCMS_ORIGIN}/payload`,
    licence: 'MIT',
    language: 'TypeScript',
    localClone: 'node_modules/payload',
    role: 'Payload CMS monorepo (45 packages under packages/* and official templates under templates/*): every plugin, database adapter, storage adapter, email adapter and lexical feature QPU mounts is a package from this monorepo',
    qpuExports: [
      'qpuPlugin',
      'qpuCore',
      'qpuAgents',
      'qpuMachine',
      'qpuGoogle',
      'qpuRaid',
      'qpuHooks',
      'qpuPlugins',
      'qpuEcommerce',
      'qpuDb',
      'qpuEmail',
      'qpuAdapterPlugins',
      'qpuRaid',
      'qpuLexicalBlocks',
      'qpuFormFields',
      'qpuMcpPlugin',
      'qpuMachineTool',
    ],
    endpoints: ['/api/mcp', '/api/qpu/repos', '/api/qpu/feeds', '/api/qpu/accounting'],
    door: { tool: 'configure', arguments: { kind: 'packages' } },
    templates: [
      {
        name: 'ecommerce',
        upstreamPath: 'templates/ecommerce',
        qpuCounterparts: ['qpuEcommerce', 'QPU_CURRENCIES', 'feeds', 'ecommerceSeedItems'],
        collections: ['products', 'variants', 'variantTypes', 'variantOptions', 'carts', 'orders', 'transactions', 'addresses'],
        door: { tool: 'configure', arguments: { kind: 'ecommerce' } },
      },
      {
        name: 'website',
        upstreamPath: 'templates/website',
        qpuCounterparts: ['websiteTemplatePlugins', 'qpuWebsitePlugins'],
        collections: ['pages', 'posts', 'media', 'categories', 'users'],
        door: { tool: 'payload', arguments: { site: true } },
      },
    ],
    packages: PAYLOADCMS_MONOREPO_PACKAGES,
  },
  {
    id: 'skills',
    repo: 'payloadcms/skills',
    url: `${PAYLOADCMS_ORIGIN}/skills`,
    licence: 'facts-only (names, paths, sizes)',
    language: 'Markdown',
    localClone: 'TABLES.SKILL_MAP',
    role: 'Payload skills for AI agents (2 skills: payload and cms-migration, 14 reference files): every skill and reference is mapped in TABLES.SKILL_MAP to the QPU tool (payload, configure, mongo, validate, fold) that enacts it',
    qpuExports: ['qpuMcpPlugin', 'qpuPlugin'],
    endpoints: ['/api/mcp', '/api/qpu/repos'],
    door: { tool: 'payload', arguments: { skills: true } },
  },
] as const

/** Workspace alignment: this repo is the full stack (website standard in src); packages come from payloadcms/payload; skills from payloadcms/skills; sibling ../payload is the Cloudflare Workers deploy. */
export const PAYLOADCMS_WORKSPACE_ALIGNMENT = {
  qpu: {
    name: '@uuidna/qpu',
    path: '.',
    payloadVersion: '4.0.0-beta.7',
    upstreamRepos: ['payloadcms/website', 'payloadcms/payload', 'payloadcms/skills'] as const,
    exports: ['.', './plugin', './payload.config', './payload', './feeds', './mcp', './blocks', './roles', './version', './discovery-document', './machine'] as const,
    role: 'This full-stack package: Payload website in src/, quantum unit, and qpuMcpPlugin over upstream @payloadcms/*',
  },
  website: {
    name: 'qpu',
    path: 'src',
    upstreamRepo: 'payloadcms/website' as const,
    payloadVersion: '4.0.0-beta.7',
    consumes: '@payloadcms/* from payloadcms/payload',
    role: 'Develop in src/ to the payloadcms/website standard; configure { kind: "fullstack" } refreshes overlay files in this tree, not a second .qpu-app fork',
  },
  siblingPayload: {
    name: 'uuidna-payload',
    path: '../payload',
    remote: 'github.com/uuidna/payload',
    upstreamTemplate: 'payloadcms/payload/templates/website (Cloudflare D1 + R2)',
    payloadVersion: '4.0.0-canary.37',
    consumes: '@uuidna/qpu + @uuidna/uuidna + @uuidna/school',
    role: 'Cloudflare Workers D1+R2 multi-tenant deployment consuming @uuidna/qpu lattice/db/zone primitives alongside official @payloadcms/* plugins (nested-docs, seo, redirects, search, form-builder, mcp, import-export, storage-r2, db-d1-sqlite)',
  },
} as const

/**
 * Compute the consolidated `payloadcms` repository matrix, verifying that every mounted `@payloadcms/*` package
 * belongs to `TABLES.PAYLOAD_PACKAGES` (`github.com/payloadcms/payload/tree/main/packages`) and every skill
 * reference in `TABLES.SKILL_MAP` is enacted by a QPU tool.
 */
export const payloadcmsRepos = (opts: { repo?: string; role?: PayloadcmsPackageRole } = {}) => {
  const catalogNames = new Set<string>(TABLES.PAYLOAD_PACKAGES.names)
  const packages = PAYLOADCMS_MONOREPO_PACKAGES.filter((p) => !opts.role || p.role === opts.role).map((p) => {
    const shortName = p.pkg.replace(/^@payloadcms\//, '')
    const inUpstreamMonorepo = catalogNames.has(shortName)
    return {
      ...p,
      shortName,
      inUpstreamMonorepo,
    }
  })
  const repositories = PAYLOADCMS_REPOSITORIES.filter(
    (r) => !opts.repo || r.id === opts.repo || r.repo === opts.repo,
  )
  const skillEntries = Object.entries(TABLES.SKILL_MAP as Record<string, { enactedBy: readonly string[]; how: string }>)
  const allPackagesInMonorepo = packages.every((p) => p.inUpstreamMonorepo)
  const allSkillsEnacted = skillEntries.every(([, v]) => v.enactedBy.length > 0)
  const byRole = Object.fromEntries(
    (['core', 'editor', 'database', 'storage', 'email', 'plugin'] as const).map((r) => [
      r,
      PAYLOADCMS_MONOREPO_PACKAGES.filter((p) => p.role === r).length,
    ]),
  )
  const canonical = canonicalText({
    repos: PAYLOADCMS_REPOSITORIES.map((r) => r.repo),
    packages: PAYLOADCMS_MONOREPO_PACKAGES.map((p) => p.pkg),
    monorepoTotal: TABLES.PAYLOAD_PACKAGES.names.length,
    skills: skillEntries.length,
  })
  const address = uuid(canonical)
  return {
    phase: 'payloadcms-repositories' as const,
    organization: 'payloadcms' as const,
    url: PAYLOADCMS_ORIGIN,
    address,
    sealed: seal(address).valid,
    holds: allPackagesInMonorepo && allSkillsEnacted && seal(address).valid,
    counts: {
      repositories: PAYLOADCMS_REPOSITORIES.length,
      monorepoPackagesTotal: TABLES.PAYLOAD_PACKAGES.names.length,
      mountedPackages: PAYLOADCMS_MONOREPO_PACKAGES.length,
      byRole,
      websitePlugins: TABLES.PAYLOAD_WEBSITE.plugins.length,
      qpuPlugins: 9,
      qpuCombinations: 512,
      skillEntries: skillEntries.length,
      quantumlibRepositories: REPOSITORIES.length,
    },
    repositories,
    packages,
    alignment: PAYLOADCMS_WORKSPACE_ALIGNMENT,
    endpoints: {
      repos: '/api/qpu/repos',
      feeds: '/api/qpu/feeds?repos=1',
      accounting: '/api/qpu/accounting',
      google: '/api/qpu/google',
      mcp: '/api/mcp',
    },
    theorems: [
      'textbook_packages_partition',
      'textbook_website_plugins_partition',
      'textbook_plugin_combinations',
      'textbook_skills_documents',
      'textbook_fullstack_files_by_role',
    ] as const,
    says: `All QPU surfaces consolidated around ${PAYLOADCMS_REPOSITORIES.length} github.com/payloadcms/* repositories (payloadcms/website, payloadcms/payload, payloadcms/skills): ${PAYLOADCMS_MONOREPO_PACKAGES.length} of ${TABLES.PAYLOAD_PACKAGES.names.length} monorepo packages mounted and mapped to QPU plugins/adapters, ${skillEntries.length} agent skill references enacted, sealed at ${address}`,
  }
}
