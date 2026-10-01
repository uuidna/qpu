#!/usr/bin/env node

import { testAllGapsAutoFilled } from '../dist/mcp/automated-gap-filler.js'

const result = await testAllGapsAutoFilled()

console.log(result.report)

if (result.passed) {
  console.log('\n✅ TEST PASSED: All gaps automatically filled\n')
  console.log('Summary:')
  console.log(`  - MCP OS Operations: ${result.summary.mcp_os_operations.length}/80 ✅`)
  console.log(`  - Phase 11 Formulas: ${result.summary.formulas.length}/23 ✅`)
  console.log(`  - Total Fill Rate: ${result.summary.fillRate.toFixed(1)}%`)
  console.log(`  - Execution Time: ${(result.summary.endTime - result.summary.startTime)}ms`)
  process.exit(0)
} else {
  console.log('\n❌ TEST FAILED: Some gaps not filled\n')
  process.exit(1)
}
