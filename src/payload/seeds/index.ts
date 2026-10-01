/**
 * Payload CMS Seeds - Master Index
 * Consolidated seed data extracted from all test fixtures
 *
 * Usage:
 *   import { seedDatabase } from '@/payload/seeds'
 *   await seedDatabase(payload)
 */

import { usersSeed } from './users.seed.js'
import { complianceIssuesSeed } from './compliance-issues.seed.js'
import { auditLogsSeed } from './audit-logs.seed.js'
import { supportTicketsSeed } from './support-tickets.seed.js'
import { enrollmentsSeed } from './enrollments.seed.js'
import { metricsSeed } from './metrics.seed.js'
import { certificationsSeed } from './certifications.seed.js'

export { seedFuse } from './fuse.seed.js'
export { usersSeed, complianceIssuesSeed, auditLogsSeed, supportTicketsSeed, enrollmentsSeed, metricsSeed, certificationsSeed }

/**
 * Seed entire database with test fixtures converted to CMS format
 */
export async function seedDatabase(payload: any) {
  console.log('🌱 Starting Payload CMS seed process...')

  try {
    // Seed Users first (other collections reference users)
    console.log('📝 Seeding Users...')
    for (const user of usersSeed) {
      await payload.create({
        collection: 'users',
        data: user,
      })
    }
    console.log(`✅ Seeded ${usersSeed.length} users`)

    // Seed Compliance Issues
    console.log('📋 Seeding Compliance Issues...')
    for (const issue of complianceIssuesSeed) {
      await payload.create({
        collection: 'compliance-issues',
        data: issue,
      })
    }
    console.log(`✅ Seeded ${complianceIssuesSeed.length} compliance issues`)

    // Seed Audit Logs
    console.log('📊 Seeding Audit Logs...')
    for (const log of auditLogsSeed) {
      await payload.create({
        collection: 'audit-logs',
        data: log,
      })
    }
    console.log(`✅ Seeded ${auditLogsSeed.length} audit logs`)

    // Seed Support Tickets
    console.log('🎫 Seeding Support Tickets...')
    for (const ticket of supportTicketsSeed) {
      await payload.create({
        collection: 'support-tickets',
        data: ticket,
      })
    }
    console.log(`✅ Seeded ${supportTicketsSeed.length} support tickets`)

    // Seed Enrollments
    console.log('🎓 Seeding Enrollments...')
    for (const enrollment of enrollmentsSeed) {
      await payload.create({
        collection: 'enrollments',
        data: enrollment,
      })
    }
    console.log(`✅ Seeded ${enrollmentsSeed.length} enrollments`)

    // Seed Metrics
    console.log('📈 Seeding Metrics...')
    for (const metric of metricsSeed) {
      await payload.create({
        collection: 'metrics',
        data: metric,
      })
    }
    console.log(`✅ Seeded ${metricsSeed.length} metrics`)

    // Seed Certifications
    console.log('🏆 Seeding Certifications...')
    for (const cert of certificationsSeed) {
      await payload.create({
        collection: 'certifications',
        data: cert,
      })
    }
    console.log(`✅ Seeded ${certificationsSeed.length} certifications`)

    console.log('🎉 Payload CMS seeding complete!')
    console.log(`📊 Total records seeded: ${usersSeed.length + complianceIssuesSeed.length + auditLogsSeed.length + supportTicketsSeed.length + enrollmentsSeed.length + metricsSeed.length + certificationsSeed.length}`)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

/**
 * Get summary of all seed data
 */
export function getSeedSummary() {
  return {
    users: usersSeed.length,
    complianceIssues: complianceIssuesSeed.length,
    auditLogs: auditLogsSeed.length,
    supportTickets: supportTicketsSeed.length,
    enrollments: enrollmentsSeed.length,
    metrics: metricsSeed.length,
    certifications: certificationsSeed.length,
    total: usersSeed.length + complianceIssuesSeed.length + auditLogsSeed.length + supportTicketsSeed.length + enrollmentsSeed.length + metricsSeed.length + certificationsSeed.length,
  }
}
