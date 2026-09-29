/**
 * Core Module - Unified, DRY, Extensible
 * All types, operations, and management in one consolidated module
 */

// Types
export * from './types.js'

// Operations
export {
  operationRegistry,
  getOperation,
  listOperations,
  countByDomain,
  executeOperation,
  executeComposition
} from './operations.js'

// Manager
export {
  OperationManager,
  defaultManager,
  executeGlobal,
  executeCompositionGlobal
} from './manager.js'

// UUID Bridge (connects to UUID-programmable MCP layer)
export {
  UUIDBridge,
  uuidBridge,
  executeByUUID,
  executeByName
} from './uuid-bridge.js'

// Persistence Layer
export {
  PersistenceBackend,
  ExecutionResultStore,
  inMemoryBackend,
  executionResultStore,
  getPersistenceBackend
} from './persistence.js'

// Autonomous Intelligence Engine
export {
  AutonomousEngine,
  autonomousEngine,
  startAutonomousImprovement,
  stopAutonomousImprovement,
  getLastCycle
} from './autonomous-engine.js'

// Resilience Layer (error recovery, retries, circuit breaking)
export {
  RetryEngine,
  CircuitBreaker,
  ResilientExecutor,
  retryEngine,
  circuitBreaker,
  resilientExecutor,
  executeWithRetry,
  executeWithCircuitBreaker,
  executeResilient
} from './resilience.js'

// Rate Limiting
export {
  TokenBucket,
  RateLimiter,
  rateLimiter,
  isAllowed,
  getRateLimitStatus
} from './rate-limiter.js'

// Health Checking & Auto-Healing
export {
  HealthChecker,
  HealthEndpoint,
  healthChecker,
  healthEndpoint,
  performHealthCheck,
  isReady,
  isAlive
} from './health-checker.js'

// ML Optimization
export {
  MLOptimizer,
  mlOptimizer,
  findBestOperation,
  getSuggestions,
  recordExecution
} from './ml-optimizer.js'

// Convenience exports
export type { OperationMetadata, ExecutionResult, CompositionRequest } from './types.js'
export type { ImprovementCycle, OperationPattern } from './autonomous-engine.js'
export type { StoredExecutionResult } from './persistence.js'
export type { ResilienceMetrics } from './resilience.js'
export type { RateLimitStatus, RateLimitConfig } from './rate-limiter.js'
export type { HealthCheckResult, HealthStatus } from './health-checker.js'
