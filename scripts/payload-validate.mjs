#!/usr/bin/env node

/**
 * Payload CMS Seed Validator
 * Validates all seed data against collection schemas
 *
 * Usage: npm run payload:validate
 */

import { printValidationReport, validateAllSeeds } from '../src/payload/utils/seed-validator.ts'

console.log('🔍 Validating Payload CMS seeds from test fixtures...\n')

const results = validateAllSeeds()
printValidationReport(results)

const allValid = results.every(r => r.valid)

if (allValid) {
  console.log('✅ All seeds validated successfully!')
  process.exit(0)
} else {
  console.log('❌ Seed validation failed!')
  process.exit(1)
}
