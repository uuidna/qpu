/**
 * Core Module Integration Tests
 * Validates all systems work together: types, operations, manager, UUID bridge, persistence, autonomy
 */

import {
  // Types
  ExecutionResult,
  OperationError,
  ValidationError,

  // Operations
  listOperations,
  countByDomain,
  executeOperation,

  // Manager
  defaultManager,
  executeGlobal,
  executeCompositionGlobal,

  // UUID Bridge
  uuidBridge,
  executeByUUID,

  // Persistence
  executionResultStore,

  // Autonomy
  autonomousEngine,
  getLastCycle
} from '../index.js'

// ============================================================================
// TESTS
// ============================================================================

/**
 * Test 1: List all operations
 */
async function testListOperations(): Promise<boolean> {
  const ops = listOperations()
  console.log(`✓ Listed ${ops.length} operations`)
  return ops.length > 0
}

/**
 * Test 2: Count operations by domain
 */
async function testCountByDomain(): Promise<boolean> {
  const counts = countByDomain()
  console.log(`✓ Domain counts:`, counts)
  return Object.keys(counts).length > 0
}

/**
 * Test 3: Execute operation by name
 */
async function testExecuteByName(): Promise<boolean> {
  const result = await executeOperation('health-check')
  console.log(`✓ Health check:`, result.success ? 'OK' : result.error)
  return result.success
}

/**
 * Test 4: Execute via manager
 */
async function testManagerExecution(): Promise<boolean> {
  const result = await defaultManager.execute('list-operations')
  console.log(`✓ Manager execute:`, result.success ? 'OK' : result.error)
  return result.success
}

/**
 * Test 5: Execute via global function
 */
async function testGlobalExecution(): Promise<boolean> {
  const result = await executeGlobal('get-metrics')
  console.log(`✓ Global execute:`, result.success ? 'OK' : result.error)
  return result.success
}

/**
 * Test 6: UUID Bridge - get UUID for operation
 */
async function testUUIDBridge(): Promise<boolean> {
  const uuid = uuidBridge.getUUID('health-check')
  console.log(`✓ UUID bridge: health-check → ${uuid}`)
  return uuid !== undefined
}

/**
 * Test 7: Execute by UUID
 */
async function testExecuteByUUID(): Promise<boolean> {
  const uuid = uuidBridge.getUUID('health-check')
  if (!uuid) return false

  const result = await executeByUUID(uuid)
  console.log(`✓ Execute by UUID:`, result.success ? 'OK' : result.error)
  return result.success
}

/**
 * Test 8: Composition execution
 */
async function testComposition(): Promise<boolean> {
  const result = await executeCompositionGlobal({
    operations: ['health-check', 'get-metrics'],
    inputs: {}
  })
  console.log(`✓ Composition:`, result.success ? 'OK' : result.error)
  return result.success
}

/**
 * Test 9: Persistence - store execution
 */
async function testPersistence(): Promise<boolean> {
  const id = await executionResultStore.store(
    'test-operation',
    { test: true },
    { success: true, data: { test: true } },
    42
  )
  console.log(`✓ Stored execution: ${id}`)

  const retrieved = await executionResultStore.get(id)
  console.log(`✓ Retrieved execution:`, retrieved?.operation)
  return retrieved !== undefined
}

/**
 * Test 10: Execution statistics
 */
async function testExecutionStats(): Promise<boolean> {
  const stats = await executionResultStore.getStats('test-operation')
  console.log(`✓ Execution stats:`, {
    total: stats.totalExecutions,
    avgDuration: stats.averageDuration,
    successRate: stats.successRate
  })
  return stats.totalExecutions > 0
}

/**
 * Test 11: Manager caching
 */
async function testManagerCaching(): Promise<boolean> {
  const start = Date.now()
  await defaultManager.execute('health-check', {})
  const first = Date.now() - start

  const start2 = Date.now()
  await defaultManager.execute('health-check', {})
  const second = Date.now() - start2

  console.log(`✓ Cache performance: first=${first}ms, second=${second}ms`)
  return second < first
}

/**
 * Test 12: Autonomy engine patterns
 */
async function testAutonomyPatterns(): Promise<boolean> {
  const patterns = autonomousEngine.getPatterns()
  console.log(`✓ Autonomy patterns discovered:`, patterns.length)
  return true
}

/**
 * Test 13: Complete flow - all systems together
 */
async function testCompleteFlow(): Promise<boolean> {
  const operations = listOperations()
  const stats = defaultManager.getStats()
  const patterns = autonomousEngine.getPatterns()

  console.log(`✓ Complete system status:`)
  console.log(`  - Operations: ${operations.length}`)
  console.log(`  - Manager stats:`, stats.successful, '/', stats.totalExecutions)
  console.log(`  - Autonomy patterns:`, patterns.length)

  return operations.length > 0 && stats.totalExecutions > 0
}

// ============================================================================
// TEST RUNNER
// ============================================================================

export async function runIntegrationTests(): Promise<void> {
  const tests = [
    { name: 'List operations', fn: testListOperations },
    { name: 'Count by domain', fn: testCountByDomain },
    { name: 'Execute by name', fn: testExecuteByName },
    { name: 'Manager execution', fn: testManagerExecution },
    { name: 'Global execution', fn: testGlobalExecution },
    { name: 'UUID bridge', fn: testUUIDBridge },
    { name: 'Execute by UUID', fn: testExecuteByUUID },
    { name: 'Composition', fn: testComposition },
    { name: 'Persistence store', fn: testPersistence },
    { name: 'Execution stats', fn: testExecutionStats },
    { name: 'Manager caching', fn: testManagerCaching },
    { name: 'Autonomy patterns', fn: testAutonomyPatterns },
    { name: 'Complete flow', fn: testCompleteFlow }
  ]

  console.log('\n=== Core Module Integration Tests ===\n')

  let passed = 0
  let failed = 0

  for (const test of tests) {
    try {
      const result = await test.fn()
      if (result) {
        passed++
      } else {
        console.log(`✗ ${test.name}`)
        failed++
      }
    } catch (err) {
      console.log(`✗ ${test.name}:`, err instanceof Error ? err.message : String(err))
      failed++
    }
  }

  console.log(`\n=== Results ===`)
  console.log(`Passed: ${passed}/${tests.length}`)
  console.log(`Failed: ${failed}/${tests.length}`)

  if (failed === 0) {
    console.log(`\n✓ ALL TESTS PASSED`)
  } else {
    process.exit(1)
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runIntegrationTests().catch(err => {
    console.error('Test runner failed:', err)
    process.exit(1)
  })
}

export default { runIntegrationTests }
