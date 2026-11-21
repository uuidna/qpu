// Everything this installation adds to the Payload ecommerce template, kept out of the template's own files.
// The template's src/plugins/index.ts, its collections and its components stay as payloadcms/payload ships them;
// this file mounts the other Payload packages and extends the template's collections through the plugin API.
import type { Block, CollectionConfig, Config, Field, Plugin, TextField } from 'payload'

import { importExportPlugin } from '@payloadcms/plugin-import-export'
import { defineTool, mcpPlugin } from '@payloadcms/plugin-mcp'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { searchPlugin } from '@payloadcms/plugin-search'
import { sentryPlugin } from '@payloadcms/plugin-sentry'
import { stripePlugin } from '@payloadcms/plugin-stripe'
import { VERSION } from '@uuidna/qpu/version'

import { checkRole } from '@/access/utilities'
import { trialLead } from '@/collections/Pages/hooks/trialLead'
import { quantumField, runQuantumProgram } from '@/fields/quantum'
import { developedFromField, markLeadDeveloped } from '@/hooks/markLeadDeveloped'
import { qrGalleryFallback } from '@/hooks/qrGalleryFallback'
import { orderRunsField, runOrderPrograms } from '@/hooks/runOrderPrograms'
import { fuseToolResponse } from '@/plugins/isoSolution'
import qpuPlugin from '@/plugins/qpu'
import { qpuCatalogueTools } from '@/utilities/qpuCatalogue'
import { seedHoldEndpoint } from '@/utilities/seedHold'
import { callUuidna } from '@/utilities/uuidnaDoor'

import { PASSWORD_HASH_ITERATIONS } from '../quantum/processing/config-index'
import { isUuid } from '../quantum/uuid/index'

/** plugin-mcp's access arguments (permissions for the request, and the request), as its Tool type declares them */
type MCPAccessArgs = Parameters<NonNullable<ReturnType<ReturnType<typeof defineTool>['handler']>['access']>>[0]
/** readsFor: public find/count like GET /api/<slug>; auth collections still need a user. */
const readsFor = (kind: 'collections' | 'globals', tools: readonly string[]) =>
  new Proxy({}, {
    get: (_, slug) =>
      typeof slug !== 'string'
        ? undefined
        : {
            tools: Object.fromEntries(
              tools.map((tool) => [
                tool,
                {
                  access: ({ permissions, req }: MCPAccessArgs) =>
                    Boolean((permissions?.[kind] as Record<string, { read?: boolean }> | undefined)?.[slug]?.read) &&
                    (kind === 'globals' || Boolean(req.user) || !(req.payload.collections as Record<string, { config: { auth?: unknown } } | undefined>)[slug]?.config.auth),
                },
              ]),
            ),
          },
  })

/** uuidna door + qpu catalogue tools (public). */
const mcpTools = async () => ({
  uuidna: defineTool({
    access: () => true,
    description: 'Call a uuidna MCP door by name (https://uuidna.com/mcp).',
    input: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'uuidna tool name' },
        arguments: { type: 'object', description: 'tool arguments' },
      },
      required: ['name'],
    },
  }).handler(async ({ input }) => {
    const { name, arguments: args } = input as { name: string; arguments?: Record<string, unknown> }
    const answer = await callUuidna(name, args ?? {})
    return { content: [{ type: 'text', text: answer.text }], isError: answer.isError }
  }),
  ...(await qpuCatalogueTools()),
})

type Hooks = NonNullable<CollectionConfig['hooks']>
/** A collection with fields and hooks added after the ones it already has. */
const extended = (collection: CollectionConfig, more: { fields?: CollectionConfig['fields']; hooks?: Hooks; auth?: CollectionConfig['auth'] }): CollectionConfig => ({
  ...collection,
  ...(more.auth ? { auth: more.auth } : {}),
  fields: [...collection.fields, ...(more.fields ?? [])],
  hooks: {
    ...collection.hooks,
    ...Object.fromEntries(
      Object.entries(more.hooks ?? {}).map(([name, added]) => [name, [...((collection.hooks?.[name as keyof Hooks] as unknown[] | undefined) ?? []), ...(added as unknown[])]]),
    ),
  },
})

/** The fields and hooks this installation adds, by collection slug. The template's collection files are not edited. */
const additions: Record<string, (collection: CollectionConfig) => CollectionConfig> = {
  // plugin-mcp v4 authenticates MCP clients with user API keys: `Authorization: users API-Key <key>`
  users: (collection) => extended(collection, { auth: { ...(typeof collection.auth === 'object' ? collection.auth : {}), useAPIKey: true } }),
  // A page that is a lead from the old tree: one module (or directory) of legacy/, to be developed into this
  // installation. The trial hook fills verdict and receipt before the page is stored.
  pages: (collection) =>
    extended(collection, {
      fields: [
        {
          name: 'lead',
          type: 'group',
          admin: { position: 'sidebar' },
          fields: [
            { name: 'kind', type: 'select', options: ['module', 'directory'] },
            { name: 'path', type: 'text', index: true, unique: true },
            { name: 'address', type: 'text' },
            { name: 'exports', type: 'text' },
            { name: 'verdict', type: 'select', options: ['VERIFIED', 'UNVERIFIED'], admin: { readOnly: true } },
            { name: 'receipt', type: 'text', admin: { readOnly: true } },
            { name: 'developedAs', type: 'relationship', relationTo: ['products', 'posts'], admin: { readOnly: true } },
          ],
        },
      ],
      hooks: { beforeChange: [trialLead] },
    }),
  // a product is a theorem: it may carry a quantum program, name the lead it develops, and fall back to its QR code
  products: (collection) =>
    extended(collection, {
      fields: [developedFromField, quantumField],
      hooks: { beforeChange: [runQuantumProgram], afterChange: [markLeadDeveloped('products')], afterRead: [qrGalleryFallback] },
    }),
  // a variant is the product's program at one setting (qubit count, shots), run by the same hook
  variants: (collection) => extended(collection, { fields: [quantumField], hooks: { beforeChange: [runQuantumProgram] } }),
  // a line that is a quantum program runs as the order is placed: the order carries its outcome and receipt
  orders: (collection) => extended(collection, { fields: [orderRunsField], hooks: { beforeChange: [runOrderPrograms] } }),
}

/** Extends the collections the template and its plugins made; it runs after them and edits none of their files. */
const collectionAdditions: Plugin = (config: Config): Config => ({
  ...config,
  collections: (config.collections ?? []).map((collection) => additions[collection.slug]?.(collection) ?? collection),
})

/** The id of an array row or a block: a UUID, where Payload's own default is a 24-character hex id. A row that
 *  arrives with another id (one the admin made, or one stored before) is given a UUID as it is saved. */
const uuidRowID: TextField = {
  name: 'id',
  type: 'text',
  admin: { hidden: true },
  defaultValue: () => crypto.randomUUID(),
  hooks: {
    beforeChange: [({ value }) => (isUuid(value) ? value : crypto.randomUUID())],
    beforeDuplicate: [() => crypto.randomUUID()],
  },
  label: 'ID',
}
const withRowID = (fields: Field[]): Field[] => (fields.some((field) => 'name' in field && field.name === 'id') ? fields : [...fields, uuidRowID])
// Payload adds its own id field to every block, so a block cannot carry a second one: the blocks field itself
// gives each of its rows a UUID before the rows are stored.
const uuidRows = ({ value }: { value?: unknown }) =>
  Array.isArray(value) ? value.map((row: { id?: unknown }) => (isUuid(row?.id) ? row : { ...row, id: crypto.randomUUID() })) : value
const uuidBlock = (block: Block): Block => ({ ...block, fields: uuidFields(block.fields) })
/** Every array and every block below these fields carries a UUID row id. */
const uuidFields = (fields: Field[]): Field[] =>
  fields.map((field): Field => {
    if (field.type === 'array') return { ...field, fields: withRowID(uuidFields(field.fields)) }
    if (field.type === 'blocks') return { ...field, blocks: field.blocks.map(uuidBlock), hooks: { ...field.hooks, beforeChange: [...(field.hooks?.beforeChange ?? []), uuidRows] } }
    if (field.type === 'tabs') return { ...field, tabs: field.tabs.map((tab) => ({ ...tab, fields: uuidFields(tab.fields) })) }
    if (field.type === 'group' || field.type === 'row' || field.type === 'collapsible') return { ...field, fields: uuidFields(field.fields) } as Field
    return field
  })

/** Every text id is a UUID: documents by the database adapter, array rows and blocks by this plugin. It runs last,
 *  so it reaches the collections every other plugin made. */
const uuidRowIDs: Plugin = (config: Config): Config => ({
  ...config,
  blocks: config.blocks?.map(uuidBlock),
  collections: (config.collections ?? []).map((collection) => ({ ...collection, fields: uuidFields(collection.fields) })),
  globals: (config.globals ?? []).map((global) => ({ ...global, fields: uuidFields(global.fields) })),
})

/** Passwords are hashed with the count Lean states: Payload's default is past what a Worker runs in one call. */
const workerPasswordHash: Plugin = (config: Config): Config => ({
  ...config,
  auth: { ...config.auth, passwordHashIterations: PASSWORD_HASH_ITERATIONS as NonNullable<NonNullable<Config['auth']>['passwordHashIterations']> },
})

/** The seed's door: the deployed app holds the documents a signed seed states, beside its own database. */
const seedDoor: Plugin = (config: Config): Config => ({ ...config, endpoints: [...(config.endpoints ?? []), seedHoldEndpoint] })

export const extensions: Plugin[] = [
  collectionAdditions,
  workerPasswordHash,
  seedDoor,
  redirectsPlugin({
    collections: ['pages', 'products'],
  }),
  nestedDocsPlugin({
    collections: ['pages'],
    generateLabel: (_, doc) => String(doc.title ?? ''),
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${String(doc.slug ?? '')}`, ''),
  }),
  searchPlugin({
    collections: ['products', 'pages'],
  }),
  multiTenantPlugin({
    collections: {
      pages: {},
      products: {},
    },
    userHasAccessToAllTenants: (user) => checkRole(['admin'], user as Parameters<typeof checkRole>[1]),
  }),
  importExportPlugin({
    collections: [{ slug: 'pages' }, { slug: 'products' }, { slug: 'orders', import: false }],
  }),
  // Sentry waits on the owner: a DSN and @sentry/nextjs set up as payloadcms.com/docs/plugins/sentry documents.
  sentryPlugin({
    enabled: false,
  }),
  // plugin-stripe syncs and proxies Stripe beside the ecommerce plugin's Stripe adapter; it mounts once the key is set.
  ...(process.env.STRIPE_SECRET_KEY
    ? [
        stripePlugin({
          isTestKey: process.env.STRIPE_SECRET_KEY.startsWith('sk_test_'),
          stripeSecretKey: process.env.STRIPE_SECRET_KEY,
          stripeWebhooksEndpointSecret: process.env.STRIPE_WEBHOOKS_SIGNING_SECRET,
        }),
      ]
    : []),
  // plugin-mcp: collections/globals via readsFor; catalogue + uuidna beside them
  mcpPlugin({
    collections: readsFor('collections', ['find', 'count']),
    globals: readsFor('globals', ['find']),
    hooks: {
      afterToolCall: [
        ({ input, response, toolName }) =>
          fuseToolResponse(
            toolName === 'findDocuments' && response.doc && !response.structuredContent ? { ...response, structuredContent: response.doc } : response,
            toolName,
            input,
          ),
      ],
    },
    mcp: { serverOptions: { serverInfo: { name: 'qpu', version: VERSION } } },
    tools: await mcpTools(),
  }),
  qpuPlugin(),
  uuidRowIDs,
]
