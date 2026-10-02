/**
 * Payload CMS Configuration - Multi-Tenant SaaS Stack
 * Generated from Cross-Domain Formula Compositions
 *
 * Formulas used:
 * - multiTenant: Tenant isolation
 * - stripe: Billing integration
 * - mcp: MCP tool generation
 * - email: Email notifications
 * - storage: Cloud storage
 * - database: Database adapter
 */

import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { resendAdapter } from '@payloadcms/email-resend'
import { s3Storage } from '@payloadcms/storage-s3'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { stripePlugin } from '@payloadcms/plugin-stripe'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { seoPlugin } from '@payloadcms/plugin-seo'

import { Users } from './collections/Users'
import { Tenants } from './collections/Tenants'
import { Operations } from './collections/Operations'
import { Formulas } from './collections/Formulas'
import { Compositions } from './collections/Compositions'
import { APITokens } from './collections/APITokens'
import { Webhooks } from './collections/Webhooks'
import { AuditLogs } from './collections/AuditLogs'

export default buildConfig({
  // =====================================================
  // ADMIN & AUTH
  // =====================================================
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: process.cwd(),
    },
  },

  // =====================================================
  // COLLECTIONS (Multi-Tenant Scoped)
  // =====================================================
  collections: [
    Tenants,
    Users,
    Operations,
    Formulas,
    Compositions,
    APITokens,
    Webhooks,
    AuditLogs,
  ],

  // =====================================================
  // DATABASE (Formula: MONGODB)
  // =====================================================
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/qpu',
    autoCreate: true,
    migrationDir: 'payload/migrations',
  }),

  // =====================================================
  // EMAIL (Formula: RESEND)
  // =====================================================
  email: resendAdapter({
    defaultFromAddress: 'no-reply@qpu.uuidna.com',
    defaultFromName: 'QPU MCP',
    apiKey: process.env.RESEND_API_KEY,
  }),

  // =====================================================
  // STORAGE (Formula: S3)
  // =====================================================
  upload: {
    storage: s3Storage({
      bucket: process.env.AWS_S3_BUCKET || 'qpu-storage',
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    }),
  },

  // =====================================================
  // PLUGINS (Cross-Domain Formulas)
  // =====================================================
  plugins: [
    // Formula 1: Multi-Tenant Isolation
    multiTenantPlugin({
      id: 'multi-tenant',
      collections: ["operations","compositions","formulas","users"],
      tenantFieldName: 'tenant',
      slugFieldName: 'slug',
      config: {
        isolationLevel: 'strict',
        defaultTenantSlug: 'default',
        userTenantsFieldName: 'tenants',
        adminTenantAccessByDefault: true,
      },
    }),

    // Formula 2: Stripe Billing Integration
    stripePlugin({
      id: 'stripe',
      stripeSecretKey: process.env.STRIPE_SECRET_KEY,
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      webhookEndpoint: '/api/webhooks/stripe',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
      isTestKey: process.env.NODE_ENV !== 'production',
      collections: {
        tenants: {
          fieldName: 'billing.stripeCustomerId',
          subscriptionFieldName: 'billing.stripeSubscriptionId',
        },
      },
    }),

    // Formula 3: MCP Tool Generation
    mcpPlugin({
      id: 'mcp',
      collections: ["tenants","users","operations","formulas","compositions"],
      tools: [
  {
    "name": "qpu_tenants",
    "description": "Multi-tenant management - create, read, update tenants",
    "collection": "tenants",
    "operations": [
      "create",
      "read",
      "update",
      "list"
    ]
  },
  {
    "name": "qpu_operations",
    "description": "Execute QPU operations within tenant context",
    "collection": "operations",
    "operations": [
      "read",
      "list",
      "create"
    ]
  },
  {
    "name": "qpu_formulas",
    "description": "Access formula definitions and compositions across domains",
    "collection": "formulas",
    "operations": [
      "read",
      "list"
    ]
  },
  {
    "name": "qpu_compositions",
    "description": "Execute formula compositions - multi-step operations",
    "collection": "compositions",
    "operations": [
      "read",
      "list",
      "create"
    ]
  }
],
      biDirectionalSync: true,
      exposureLevel: 'safe',
    }),

    // Additional Plugins
    seoPlugin({
      collections: ['Operations', 'Formulas', 'Compositions'],
      generateTitle: ({ doc }) => `${doc.name} - QPU MCP`,
      generateDescription: ({ doc }) => doc.description || 'QPU Formula',
    }),
  ],

  // =====================================================
  // SECURITY
  // =====================================================
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-key',
  typescript: {
    outputFile: './payload-types.ts',
  },

  // =====================================================
  // HOOKS (Cross-Domain Formula Execution)
  // =====================================================
  hooks: {
    afterChange: [
      async ({ collection, doc, req, operation }) => {
        // Execute formula for each operation
        // Log to audit trail
        console.log(`[FORMULA] ${collection}: ${operation} for tenant: ${doc.tenant}`)
      },
    ],
  },

  // =====================================================
  // CORS & Security Headers
  // =====================================================
  cors: ['https://localhost:3000', process.env.ALLOWED_ORIGINS?.split(',') || []].flat(),
  csrf: [
    'https://localhost:3000',
    process.env.ALLOWED_ORIGINS?.split(',') || [],
  ].flat(),
})
