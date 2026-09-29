/**
 * MCP Module - Unified Model Context Protocol
 * All enterprise logic consolidated and UUID-programmable
 */

export {
  UUIDOperation,
  OperationMetadata,
  CombinatorialProgram,
  CompositionRule,
  ExecutionStep,
  UUIDCombinatorialSpace,
  UUIDProgrammableExecutor,
  ExecutionResult,
  ProgramExecutionResult,
  ConsolidatedMCPOperations,
  consolidatedMCP
} from './uuid-programmable-core.js'

export {
  UnifiedMCPRequest,
  UnifiedMCPResponse,
  UnifiedMCPRouter,
  MCPBuilder,
  UNIVERSAL_OPERATION_REGISTRY,
  getOperationUUID,
  unifiedRouter
} from './unified-mcp-router.js'
