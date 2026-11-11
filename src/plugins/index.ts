import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { Plugin } from 'payload'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { ecommercePlugin } from '@payloadcms/plugin-ecommerce'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import { defineTool, mcpPlugin } from '@payloadcms/plugin-mcp'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { searchPlugin } from '@payloadcms/plugin-search'
import { sentryPlugin } from '@payloadcms/plugin-sentry'
import { stripePlugin } from '@payloadcms/plugin-stripe'

import { stripeAdapter } from '@payloadcms/plugin-ecommerce/payments/stripe'

import { Page, Product } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { ProductsCollection } from '@/collections/Products'
import { adminOrPublishedStatus } from '@/access/adminOrPublishedStatus'
import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { customerOnlyFieldAccess } from '@/access/customerOnlyFieldAccess'
import { isAdmin } from '@/access/isAdmin'
import { isDocumentOwner } from '@/access/isDocumentOwner'
import { checkRole } from '@/access/utilities'
import { quantumField, runQuantumProgram } from '@/fields/quantum'
import { orderRunsField, runOrderPrograms } from '@/hooks/runOrderPrograms'
import { fuseToolResponse } from '@/plugins/isoSolution'
import qpuPlugin from '@/plugins/qpu'
import { qpuCatalogueTools } from '@/utilities/qpuCatalogue'
import { VERSION } from '@uuidna/qpu/version'
import { callUuidna } from '@/utilities/uuidnaDoor'

/** plugin-mcp's access arguments (permissions for the request, and the request), as its Tool type declares them */
type MCPAccessArgs = Parameters<NonNullable<ReturnType<ReturnType<typeof defineTool>['handler']>['access']>>[0]

const generateTitle: GenerateTitle<Product | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Payload Ecommerce Template` : 'Payload Ecommerce Template'
}

const generateURL: GenerateURL<Product | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

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

export const plugins: Plugin[] = [
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formSubmissionOverrides: {
      access: {
        delete: isAdmin,
        read: isAdmin,
        update: isAdmin,
      },
      admin: {
        group: 'Content',
      },
    },
    formOverrides: {
      access: {
        delete: isAdmin,
        read: isAdmin,
        update: isAdmin,
        create: isAdmin,
      },
      admin: {
        group: 'Content',
      },
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
  }),
  ecommercePlugin({
    access: {
      adminOnlyFieldAccess,
      adminOrPublishedStatus,
      customerOnlyFieldAccess,
      isAdmin,
      isDocumentOwner,
    },
    customers: {
      slug: 'users',
    },
    orders: {
      ordersCollectionOverride: ({ defaultCollection }) => ({
        ...defaultCollection,
        fields: [
          ...defaultCollection.fields,
          {
            name: 'accessToken',
            type: 'text',
            unique: true,
            index: true,
            admin: {
              position: 'sidebar',
              readOnly: true,
            },
            hooks: {
              beforeValidate: [
                ({ value, operation }) => {
                  if (operation === 'create' || !value) {
                    return crypto.randomUUID()
                  }
                  return value
                },
              ],
            },
          },
          orderRunsField,
        ],
        // a line that is a quantum program runs as the order is placed: the order carries its outcome and receipt
        hooks: {
          ...defaultCollection.hooks,
          beforeChange: [...(defaultCollection.hooks?.beforeChange ?? []), runOrderPrograms],
        },
      }),
    },
    payments: {
      paymentMethods: [
        stripeAdapter({
          secretKey: process.env.STRIPE_SECRET_KEY!,
          publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
          webhookSecret: process.env.STRIPE_WEBHOOKS_SIGNING_SECRET!,
        }),
      ],
    },
    products: {
      productsCollectionOverride: ProductsCollection,
      // a variant is the product's program at one setting (qubit count, shots), run by the same hook
      variants: {
        variantsCollectionOverride: ({ defaultCollection }) => ({
          ...defaultCollection,
          fields: [...defaultCollection.fields, quantumField],
          hooks: {
            ...defaultCollection.hooks,
            beforeChange: [...(defaultCollection.hooks?.beforeChange ?? []), runQuantumProgram],
          },
        }),
      },
    },
  }),
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
]
