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
  InMemoryBackend,
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

// Convenience exports
export type { OperationMetadata, ExecutionResult, CompositionRequest } from './types.js'
export type { ImprovementCycle, OperationPattern } from './autonomous-engine.js'
export type { StoredExecutionResult } from './persistence.js'
