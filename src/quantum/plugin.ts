// A Payload plugin, as the plugin template states it: options in, then the incoming config in, a copy of that config out.
// Collections, globals, plugins and hooks are spread so nothing already mounted is dropped. onInit runs the previous
// init and then returns. enabled: false returns the incoming config unchanged. No collection is added.
// Each folder of this tree is one plugin. Its application variants are the nine official plugins, and each variant
// deploys to a tenant by the Where a Local API find already uses.

import { TENANTS } from './processing/unit/tenants.ts'

/** The nine plugins this stack mounts. The length is the combination count 2^9. */
export const OFFICIAL_PLUGINS = ['lexical', 'nested-docs', 'seo', 'search', 'redirects', 'form-builder', 'multi-tenant', 'ecommerce', 'mcp'] as const

/** The @payloadcms packages the website already installs. */
export const OFFICIAL_PACKAGES = [
  'payload',
  '@payloadcms/db-d1-sqlite',
  '@payloadcms/db-mongodb',
  '@payloadcms/email-nodemailer',
  '@payloadcms/live-preview-react',
  '@payloadcms/next',
  '@payloadcms/plugin-cloud-storage',
  '@payloadcms/plugin-ecommerce',
  '@payloadcms/plugin-form-builder',
  '@payloadcms/plugin-import-export',
  '@payloadcms/plugin-mcp',
  '@payloadcms/plugin-multi-tenant',
  '@payloadcms/plugin-nested-docs',
  '@payloadcms/plugin-redirects',
  '@payloadcms/plugin-search',
  '@payloadcms/plugin-sentry',
  '@payloadcms/plugin-seo',
  '@payloadcms/plugin-stripe',
  '@payloadcms/richtext-lexical',
  '@payloadcms/storage-r2',
  '@payloadcms/storage-vercel-blob',
  '@payloadcms/ui',
] as const

/** uuidna and psg are the named hosts. ceci is the workers.dev tenant. */
export const DEPLOY_TENANTS = [...new Set([...Object.values(TENANTS), 'ceci'])] as const

export type IncomingConfig = {
  collections?: readonly unknown[]
  globals?: readonly unknown[]
  plugins?: readonly unknown[]
  hooks?: Record<string, unknown>
  onInit?: (payload: unknown) => unknown
}

/** Enable or disable the plugin without uninstalling it. */
export type FolderPluginOptions = { enabled?: boolean }

export type Where = { and: [{ tenant: { equals: string } }, { variant: { equals: string } }] }

/** The Local API find the queries guide writes: a Where, depth 0, limit 1, pagination off. */
export type TenantFind = {
  collection: 'pages'
  where: Where
  limit: 1
  depth: 0
  pagination: false
}

export type FolderPlugin = ((options?: FolderPluginOptions) => (incoming: IncomingConfig) => IncomingConfig) & {
  folder: string
  index: string
  plugins: readonly string[]
  packages: readonly string[]
  tenants: readonly string[]
  variants: readonly { product: string; variant: string; package: string }[]
  deploy: readonly { tenant: string; variant: string; find: TenantFind }[]
}

const PACKAGE_OF: Readonly<Record<string, string>> = {
  lexical: '@payloadcms/richtext-lexical',
  'nested-docs': '@payloadcms/plugin-nested-docs',
  seo: '@payloadcms/plugin-seo',
  search: '@payloadcms/plugin-search',
  redirects: '@payloadcms/plugin-redirects',
  'form-builder': '@payloadcms/plugin-form-builder',
  'multi-tenant': '@payloadcms/plugin-multi-tenant',
  ecommerce: '@payloadcms/plugin-ecommerce',
  mcp: '@payloadcms/plugin-mcp',
}

const findOf = (tenant: string, variant: string): TenantFind => ({
  collection: 'pages',
  where: { and: [{ tenant: { equals: tenant } }, { variant: { equals: variant } }] },
  limit: 1,
  depth: 0,
  pagination: false,
})

/** One folder, one plugin. The product is the folder. Each official plugin is a variant. Each variant deploys to each tenant. */
const folderPlugin = (folder: string): FolderPlugin => {
  const variants = OFFICIAL_PLUGINS.map((variant) => ({ product: folder, variant, package: PACKAGE_OF[variant]! }))
  const deploy = DEPLOY_TENANTS.flatMap((tenant) => variants.map((variant) => ({ tenant, variant: variant.variant, find: findOf(tenant, variant.variant) })))
  const plugin = (options: FolderPluginOptions = {}) => (incoming: IncomingConfig): IncomingConfig => {
    if (options.enabled === false) return incoming
    const config: IncomingConfig = { ...incoming }
    config.collections = [...(incoming.collections ?? [])]
    config.globals = [...(incoming.globals ?? [])]
    config.plugins = [...(incoming.plugins ?? [])]
    config.hooks = { ...(incoming.hooks ?? {}) }
    const previous = incoming.onInit
    config.onInit = async (payload) => {
      if (previous) await previous(payload)
    }
    return config
  }
  return Object.assign(plugin, {
    folder,
    index: `src/quantum/${folder}/index.ts`,
    plugins: OFFICIAL_PLUGINS,
    packages: OFFICIAL_PACKAGES,
    tenants: DEPLOY_TENANTS,
    variants,
    deploy,
  })
}

export const FOLDERS = ['app', 'apps', 'config', 'db', 'engine', 'fs', 'generators', 'net', 'os', 'password', 'payload', 'processing', 'uuid'] as const

export const appPlugin = folderPlugin('app')
export const appsPlugin = folderPlugin('apps')
export const configPlugin = folderPlugin('config')
export const dbPlugin = folderPlugin('db')
export const enginePlugin = folderPlugin('engine')
export const fsPlugin = folderPlugin('fs')
export const generatorsPlugin = folderPlugin('generators')
export const netPlugin = folderPlugin('net')
export const osPlugin = folderPlugin('os')
export const passwordPlugin = folderPlugin('password')
export const payloadPlugin = folderPlugin('payload')
export const processingPlugin = folderPlugin('processing')
export const uuidPlugin = folderPlugin('uuid')

export const plugins = [appPlugin, appsPlugin, configPlugin, dbPlugin, enginePlugin, fsPlugin, generatorsPlugin, netPlugin, osPlugin, passwordPlugin, payloadPlugin, processingPlugin, uuidPlugin] as const
