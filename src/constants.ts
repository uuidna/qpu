/**
 * Unified Constants
 * All application-wide constants in one place
 */

// Quantum
export const quantumAlgorithms = {
  SHOR: "Shor's Algorithm",
  GROVER: "Grover's Algorithm",
  QAOA: "QAOA",
  VQE: "VQE",
  QUANTUM_TELEPORTATION: "Quantum Teleportation",
  PHASE_ESTIMATION: "Phase Estimation",
  QUANTUM_FOURIER_TRANSFORM: "Quantum Fourier Transform",
  ADIABATIC: "Adiabatic Computing"
} as const

export const quantumStatuses = {
  SOLVED: 'solved',
  SOLVING: 'solving',
  OPEN: 'open'
} as const

// MCP
export const mcpTools = [
  'quantum-optimizer',
  'quantum-proofs',
  'database-abstraction',
  'performance-monitoring'
] as const

export const mcpExampleServers = {
  EXAMPLES: 'examples-server',
  USECASES: 'usecases-server',
  COMPOSITION: 'mcp-composition'
} as const

// API
export const httpMethods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
} as const

export const httpStatusCodes = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500
} as const

// Database
export const dbModes = {
  READ: 'read',
  WRITE: 'write',
  READ_WRITE: 'read_write'
} as const

export const replicationStrategies = {
  RAID: 'raid',
  MULTI_PROVIDER: 'multi-provider',
  GEOGRAPHIC: 'geographic'
} as const

// Security
export const securityLevels = {
  PUBLIC: 'public',
  INTERNAL: 'internal',
  CONFIDENTIAL: 'confidential',
  SECRET: 'secret'
} as const

// Observability
export const logLevels = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  FATAL: 'fatal'
} as const

// Defaults
export const defaults = {
  TIMEOUT_MS: 30000,
  RETRY_COUNT: 3,
  PAGE_SIZE: 100,
  CACHE_TTL_MS: 3600000
} as const
