// The repositories of the quantumlib GitHub organization, as its repository list states them. Each description is the
// repository's own one-line description; the language is the primary language the list shows. Cirq, qsim, Qualtran and the
// OpenFermion family are the quantumlib ones this repository implements or names elsewhere.
import { PROSE } from './prose-index.ts'
import { TABLES } from './tables-index.ts'

export type Repository = { name: string; description: string; language: string }

export const REPOSITORIES = TABLES.REPOSITORIES as readonly Repository[]

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

/**
 * Canonical `payloadcms/payload` monorepo packages mounted by `@uuidna/qpu`,
 * each mapped directly to its QPU plugin, adapter, collection, and coin-coil accounting counterpart.
 */
export const PAYLOADCMS_MONOREPO_PACKAGES: readonly PayloadcmsPackageMapping[] = TABLES.PAYLOADCMS_MONOREPO_PACKAGES

/** Workspace alignment: this repo is the full stack (website standard in src); packages come from payloadcms/payload; skills from payloadcms/skills; sibling ../payload is the Cloudflare Workers deploy. */
export const PAYLOADCMS_WORKSPACE_ALIGNMENT = {
  qpu: {
    name: '@uuidna/qpu',
    path: 'src/quantum',
    payloadVersion: '4.0.0-beta.7',
    upstreamRepos: ['payloadcms/website', 'payloadcms/payload', 'payloadcms/skills'] as const,
    exports: ['.', './feeds', './mcp', './blocks', './roles', './version', './discovery-document', './machine', './page-seed', './iso', './nested', './waves', './mcp-apps'] as const,
  },
  website: {
    name: 'qpu',
    path: 'src',
    upstreamRepo: 'payloadcms/website' as const,
    payloadVersion: '4.0.0-beta.7',
    consumes: '@payloadcms/* from payloadcms/payload',
    role: PROSE.quantumProcessingRepositories_role5,
  },
  siblingPayload: {
    name: 'uuidna-payload',
    path: '../payload',
    remote: 'github.com/uuidna/payload',
    upstreamTemplate: PROSE.quantumProcessingRepositories_upstreamTemplate6,
    payloadVersion: '4.0.0-canary.37',
    consumes: PROSE.quantumProcessingRepositories_consumes7,
    role: PROSE.quantumProcessingRepositories_role8,
  },
} as const
