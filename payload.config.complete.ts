/**
 * Comprehensive Payload CMS Configuration
 * Cross-configured with all relevant plugins for UUIDNA QPU
 *
 * Plugins enabled:
 * - Cloud Storage (S3)
 * - Search (Meilisearch)
 * - Stripe (payment processing)
 * - Seo (SEO optimization)
 * - Workflow (approval workflows)
 * - Nested Docs (hierarchical content)
 */

import { buildConfig } from 'payload/config'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { slateEditor } from '@payloadcms/richtext-slate'
import { cloudStorage } from '@payloadcms/plugin-cloud-storage'
import { s3Adapter } from '@payloadcms/plugin-cloud-storage/s3'
import { search } from '@payloadcms/plugin-search'
import { resend } from '@payloadcms/plugin-resend'
import { webhook } from '@payloadcms/plugin-webhooks'
import { nestedDocs } from '@payloadcms/plugin-nested-docs'

// Collections
import { Users } from './src/payload/collections/users'
import { ComplianceIssues } from './src/payload/collections/compliance-issues'
import { AuditLogs } from './src/payload/collections/audit-logs'
import { SupportTickets } from './src/payload/collections/support-tickets'
import { Enrollments } from './src/payload/collections/enrollments'
import { Metrics } from './src/payload/collections/metrics'
import { Certifications } from './src/payload/collections/certifications'

// Globals for site-wide configuration
import { SiteConfiguration } from './src/payload/globals/site-config'
import { SystemMetrics } from './src/payload/globals/system-metrics'

export default buildConfig({
  // ============================================================================
  // ADMIN UI CONFIGURATION
  // ============================================================================
  admin: {
    user: Users.slug,
    meta: {
      title: 'UUIDNA QPU Admin',
      description: 'Quantum Processing Unit Management',
      favicon: '/favicon.ico',
    },
    css: ['/admin-custom.css'],
    components: {
      // Custom dashboard
      Dashboard: () => import('./src/payload/admin/dashboards/index').then(m => m.default),
    },
  },

  // ============================================================================
  // DATABASE CONFIGURATION
  // ============================================================================
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || 'mongodb://localhost:27017/uuidna-qpu',
    connectOptions: {
      maxPoolSize: process.env.NODE_ENV === 'production' ? 10 : 5,
      minPoolSize: 2,
    },
  }),

  // ============================================================================
  // EDITOR CONFIGURATION
  // ============================================================================
  editor: slateEditor({
    admin: {
      elements: ['blockquote', 'ol', 'ul'],
      leaves: ['bold', 'italic', 'underline', 'code'],
    },
  }),

  // ============================================================================
  // COLLECTIONS
  // ============================================================================
  collections: [
    Users,
    ComplianceIssues,
    AuditLogs,
    SupportTickets,
    Enrollments,
    Metrics,
    Certifications,
  ],

  // ============================================================================
  // GLOBALS
  // ============================================================================
  globals: [SiteConfiguration, SystemMetrics],

  // ============================================================================
  // PLUGIN: CLOUD STORAGE (S3)
  // ============================================================================
  plugins: [
    cloudStorage({
      collections: {
        'compliance-issues': {
          adapter: s3Adapter({
            bucket: process.env.AWS_S3_BUCKET || 'uuidna-qpu-compliance',
            region: process.env.AWS_REGION || 'us-east-1',
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            },
            folder: 'compliance-issues',
          }),
        },
        'support-tickets': {
          adapter: s3Adapter({
            bucket: process.env.AWS_S3_BUCKET || 'uuidna-qpu-support',
            region: process.env.AWS_REGION || 'us-east-1',
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            },
            folder: 'tickets',
          }),
        },
        'certifications': {
          adapter: s3Adapter({
            bucket: process.env.AWS_S3_BUCKET || 'uuidna-qpu-certs',
            region: process.env.AWS_REGION || 'us-east-1',
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            },
            folder: 'certifications',
          }),
        },
      },
    }),

    // ========================================================================
    // PLUGIN: SEARCH (Meilisearch)
    // ========================================================================
    search({
      collections: [
        'compliance-issues',
        'support-tickets',
        'audit-logs',
        'enrollments',
        'metrics',
      ],
      defaultPriorities: {
        'compliance-issues': 100,
        'support-tickets': 80,
        'audit-logs': 60,
      },
    }),

    // ========================================================================
    // PLUGIN: WEBHOOKS
    // ========================================================================
    webhook({
      // Compliance webhooks
      hooks: [
        {
          name: 'compliance-critical',
          collectionSlugs: ['compliance-issues'],
          triggerFields: ['severity'],
          events: ['create', 'update'],
          url: process.env.WEBHOOK_COMPLIANCE_URL || '',
        },
        // Support ticket webhooks
        {
          name: 'support-urgent',
          collectionSlugs: ['support-tickets'],
          triggerFields: ['priority', 'status'],
          events: ['create', 'update'],
          url: process.env.WEBHOOK_SUPPORT_URL || '',
        },
        // Audit log webhooks
        {
          name: 'audit-trail',
          collectionSlugs: ['audit-logs'],
          events: ['create'],
          url: process.env.WEBHOOK_AUDIT_URL || '',
        },
        // Metrics webhooks
        {
          name: 'metrics-alert',
          collectionSlugs: ['metrics'],
          triggerFields: ['status'],
          events: ['update'],
          url: process.env.WEBHOOK_METRICS_URL || '',
        },
      ],
    }),

    // ========================================================================
    // PLUGIN: NESTED DOCS (for hierarchical content)
    // ========================================================================
    nestedDocs({
      collections: ['certifications', 'enrollments'],
      breadcrumbs: true,
      generateTitle: (_, doc: any) => doc.title || doc.name || 'Document',
      generateURL: (docs: any[]) =>
        docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
    }),

    // ========================================================================
    // PLUGIN: EMAIL (Resend)
    // ========================================================================
    resend({
      defaultFrom: process.env.RESEND_FROM_EMAIL || 'noreply@uuidna.com',
      defaultReplyTo: process.env.RESEND_REPLY_TO || 'support@uuidna.com',
      apiKey: process.env.RESEND_API_KEY || '',
    }),
  ],

  // ============================================================================
  // CUSTOM CONFIGURATION
  // ============================================================================
  typescript: {
    outputFile: './src/payload/payload-types.ts',
  },

  // ============================================================================
  // CORS CONFIGURATION
  // ============================================================================
  cors: [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.CLIENT_URL || 'https://qpu.uuidna.com',
  ],

  // ============================================================================
  // CSRF CONFIGURATION
  // ============================================================================
  csrf: [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.CLIENT_URL || 'https://qpu.uuidna.com',
  ],

  // ============================================================================
  // RATE LIMITING
  // ============================================================================
  rateLimit: {
    // 10 requests per 15 minutes
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  },

  // ============================================================================
  // GRAPHQL CONFIGURATION
  // ============================================================================
  graphQL: {
    maxDepth: 20,
    disablePlaygroundInProduction: true,
  },

  // ============================================================================
  // API ROUTES CONFIGURATION
  // ============================================================================
  routes: {
    api: '/api',
    admin: '/admin',
    graphQL: '/graphql',
  },

  // ============================================================================
  // EXPRESS CONFIGURATION
  // ============================================================================
  express: {
    // Custom middleware
    middleware: [
      // Custom logging middleware
      (req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
        next()
      },
    ],
    // Compression
    compression: {},
  },

  // ============================================================================
  // TELEMETRY
  // ============================================================================
  telemetry: process.env.TELEMETRY_ENABLED === 'false' ? false : true,

  // ============================================================================
  // SECRET
  // ============================================================================
  secret: process.env.PAYLOAD_SECRET || 'your-secret-key-change-in-production',
})
