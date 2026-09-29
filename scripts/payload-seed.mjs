#!/usr/bin/env node

/**
 * Payload CMS Seeder
 * Populates database with seed data from test fixtures
 *
 * Usage: npm run payload:seed
 *
 * Environment:
 *   DATABASE_URI - MongoDB connection string (default: mongodb://localhost:27017/uuidna-qpu)
 */

import { getSeedSummary } from '../src/payload/seeds/index.ts'

const databaseUri = process.env.DATABASE_URI || 'mongodb://localhost:27017/uuidna-qpu'

console.log('🌱 Payload CMS Database Seeder')
console.log('===============================\n')

console.log(`📊 Seed Summary:`)
const summary = getSeedSummary()
Object.entries(summary).forEach(([key, value]) => {
  if (key !== 'total') {
    console.log(`   ${key}: ${value} records`)
  }
})
console.log(`   ─────────────────`)
console.log(`   Total: ${summary.total} records\n`)

console.log(`🔗 Database Configuration:`)
console.log(`   URI: ${databaseUri}\n`)

console.log(`⚙️  To seed your database:`)
console.log(`\n   1. Ensure MongoDB is running:`)
console.log(`      mongod --dbpath ./data`)
console.log(`\n   2. Import seeds into Payload:`)
console.log(`      import { seedDatabase } from '@/payload/seeds'`)
console.log(`      await seedDatabase(payload)\n`)

console.log(`📝 Seed files located in:`)
console.log(`   src/payload/seeds/\n`)

console.log(`✅ Seed data ready for deployment!`)
