/** Unified Error Types - Consistent error handling across all layers */

export class QPUError extends Error {
  constructor(message: string, public code: string, public details?: any) {
    super(message)
    this.name = 'QPUError'
  }
}

export class QuantumComputeError extends QPUError {
  constructor(message: string, details?: any) {
    super(message, 'QUANTUM_COMPUTE_ERROR', details)
    this.name = 'QuantumComputeError'
  }
}

export class CacheError extends QPUError {
  constructor(message: string, details?: any) {
    super(message, 'CACHE_ERROR', details)
    this.name = 'CacheError'
  }
}

export class RoutingError extends QPUError {
  constructor(message: string, details?: any) {
    super(message, 'ROUTING_ERROR', details)
    this.name = 'RoutingError'
  }
}

export class ValidationError extends QPUError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', details)
    this.name = 'ValidationError'
  }
}

export class TimeoutError extends QPUError {
  constructor(message: string, details?: any) {
    super(message, 'TIMEOUT_ERROR', details)
    this.name = 'TimeoutError'
  }
}

export class RateLimitError extends QPUError {
  constructor(message: string, details?: any) {
    super(message, 'RATE_LIMIT_ERROR', details)
    this.name = 'RateLimitError'
  }
}

export class APIError extends QPUError {
  constructor(message: string, public statusCode: number, details?: any) {
    super(message, 'API_ERROR', details)
    this.name = 'APIError'
  }
}
