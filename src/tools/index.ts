/**
 * Tools Module
 * Developer tools for validation, profiling, auditing, and code generation
 */

export { SchemaValidator, schemaValidator, validateOperation, getOperationSchema } from './schema-validator.js'
export type { SchemaType, FieldSchema, OperationSchema, ValidationResult } from './schema-validator.js'

export {
  PerformanceProfiler,
  performanceProfiler,
  profileSystem,
  profileOperation
} from './performance-profiler.js'
export type { OperationProfile, DomainProfile, SystemProfile } from './performance-profiler.js'

export { AuditLogger, auditLogger, logExecution, logError } from './audit-logger.js'
export type { AuditLevel, AuditLogEntry, AuditQuery } from './audit-logger.js'

export { ApiClientGenerator, clientGenerator, generateClient } from './api-client-generator.js'
export type { TargetLanguage, ClientGeneratorConfig, GeneratedClient } from './api-client-generator.js'

export { LoadTester, runLoadTest } from './load-tester.js'
export type { LoadTestConfig, LoadTestResult, OperationResult } from './load-tester.js'

export default {
  schema: () => import('./schema-validator.js'),
  profiler: () => import('./performance-profiler.js'),
  audit: () => import('./audit-logger.js'),
  client: () => import('./api-client-generator.js')
}
