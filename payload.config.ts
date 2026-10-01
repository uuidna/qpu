import { buildConfig } from 'payload/config'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { slateEditor } from '@payloadcms/richtext-slate'
import { cloudStorage } from '@payloadcms/plugin-cloud-storage'
import { s3Adapter } from '@payloadcms/plugin-cloud-storage/s3'

// Collections
import { ComplianceIssues } from './src/payload/collections/compliance-issues'
import { AuditLogs } from './src/payload/collections/audit-logs'
import { SupportTickets } from './src/payload/collections/support-tickets'
import { Enrollments } from './src/payload/collections/enrollments'
import { Metrics } from './src/payload/collections/metrics'
import { Users } from './src/payload/collections/users'
import { Certifications } from './src/payload/collections/certifications'
import { FuseApis } from './src/payload/collections/fuse-apis'
import { FuseFields } from './src/payload/collections/fuse-fields'
import { FuseFormulas } from './src/payload/collections/fuse-formulas'
import { QuantumReceipts } from './src/payload/collections/quantum-receipts'

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [
    Users,
    ComplianceIssues,
    AuditLogs,
    SupportTickets,
    Enrollments,
    Metrics,
    Certifications,
    FuseApis,
    FuseFields,
    FuseFormulas,
    QuantumReceipts,
  ],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || 'mongodb://localhost:27017/uuidna-qpu',
  }),
  editor: slateEditor({}),
  typescript: {
    outputFile: './src/payload/payload-types.ts',
  },
})
