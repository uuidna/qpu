/** Domain Type Definitions - Replace scattered `any` types */

export type ProblemType = 'factor' | 'search' | 'optimize' | 'simulate' | 'cluster'

export interface DomainRequest {
  id: string
  domain: string
  input: Record<string, any>
  params: Record<string, number | string | boolean>
  timeout?: number
  priority?: 'low' | 'normal' | 'high'
}

export interface DomainResult {
  requestId: string
  output: any
  confidence: number
  executionTime: number
  algorithm?: string
  speedup?: number
}

export interface DomainConfig {
  name: string
  version: string
  algorithms: ProblemType[]
  timeout: number
  maxRetries: number
}

export interface DomainMetrics {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageLatency: number
  cacheHitRate: number
  lastUpdated: Date
}

export interface CacheEntry<T> {
  value: T
  timestamp: number
  ttl: number
  hits: number
}

export interface BatchRequest {
  requests: DomainRequest[]
  timeout?: number
  parallel?: boolean
}

export interface BatchResult {
  results: DomainResult[]
  totalTime: number
  failureCount: number
}

export interface HealthStatus {
  healthy: boolean
  lastCheck: Date
  metrics: {
    errorRate: number
    latency: number
    throughput: number
    cacheHitRate: number
  }
  issues: string[]
}
