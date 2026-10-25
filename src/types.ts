/**
 * Unified Type Definitions
 * Central source of truth for all interfaces and types
 */

// Quantum
export interface QuantumProof {
  id: string
  name: string
  algorithm: string
  solution: string
  complexity: { classical: string; quantum: string; speedup: string }
  verification: { proven: boolean; confidence: number; details: string }
  resources: { qubits: number; gates: number; time: string }
  status: 'solved' | 'solving' | 'open'
  icon: string
}

// Database
export interface StorageQuery {
  key: string
  value?: any
  timestamp?: number
}

export interface ReplicationState {
  version: number
  lastSync: number
  pending: any[]
}

// API
export interface ApiResponse<T> {
  status: 'success' | 'error'
  data?: T
  error?: string
  timestamp: number
}

// MCP
export interface MCPTool {
  name: string
  description: string
  inputSchema: Record<string, any>
}

export type MCPServer = {
  tools: MCPTool[]
  execute: (tool: string, input: any) => Promise<any>
}

// Observability
export interface Metric {
  name: string
  value: number
  timestamp: number
  labels?: Record<string, string>
}

export interface TraceSpan {
  traceId: string
  spanId: string
  name: string
  startTime: number
  duration: number
  status: 'ok' | 'error'
}

// Security
export interface AuditLog {
  id: string
  timestamp: number
  actor: string
  action: string
  resource: string
  status: 'success' | 'failure'
}

export interface SecurityContext {
  userId: string
  roles: string[]
  permissions: string[]
}
