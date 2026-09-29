/** Base Domain Class - Eliminates 10+ duplicate patterns across domain implementations */

import { solver } from '../quantum/unified-solver.js'
import type { DomainRequest, DomainResult, DomainConfig, DomainMetrics, ProblemType } from '../types/domain.js'
import { ValidationError, QuantumComputeError } from '../types/errors.js'

export abstract class QuantumDomain {
  protected config: DomainConfig
  protected metrics: DomainMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageLatency: 0,
    cacheHitRate: 0,
    lastUpdated: new Date(),
  }

  constructor(config: DomainConfig) {
    this.config = config
  }

  async solve(request: DomainRequest): Promise<DomainResult> {
    const startTime = Date.now()
    this.metrics.totalRequests++

    try {
      this.validateRequest(request)

      const problemType = this.selectAlgorithm(request.input)
      const result = await solver.solve({
        type: problemType,
        params: request.params,
      })

      const duration = Date.now() - startTime
      this.metrics.successfulRequests++
      this.updateLatencyMetric(duration)

      return {
        requestId: request.id,
        output: result.result,
        confidence: this.calculateConfidence(result),
        executionTime: duration,
        algorithm: problemType,
        speedup: result.speedup,
      }
    } catch (error) {
      this.metrics.failedRequests++
      throw this.handleError(error)
    }
  }

  async batch(requests: DomainRequest[]): Promise<DomainResult[]> {
    return Promise.all(requests.map(r => this.solve(r)))
  }

  protected validateRequest(request: DomainRequest): void {
    if (!request.id) {
      throw new ValidationError('Request missing id')
    }
    if (!request.input) {
      throw new ValidationError('Request missing input')
    }
    if (!request.params) {
      throw new ValidationError('Request missing params')
    }
  }

  protected abstract selectAlgorithm(input: Record<string, any>): ProblemType

  protected calculateConfidence(result: any): number {
    return result.confidence || 0.95
  }

  protected updateLatencyMetric(duration: number): void {
    const total = this.metrics.successfulRequests
    this.metrics.averageLatency =
      (this.metrics.averageLatency * (total - 1) + duration) / total
    this.metrics.lastUpdated = new Date()
  }

  protected handleError(error: unknown): Error {
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        return new QuantumComputeError(`${this.config.name} computation timeout`, { cause: error })
      }
      return new QuantumComputeError(`${this.config.name} computation failed: ${error.message}`, {
        cause: error,
      })
    }
    return new QuantumComputeError(`${this.config.name} unknown error`, { cause: error })
  }

  getMetrics(): DomainMetrics {
    return {
      ...this.metrics,
      lastUpdated: new Date(),
    }
  }

  getSuccessRate(): number {
    if (this.metrics.totalRequests === 0) return 0
    return (this.metrics.successfulRequests / this.metrics.totalRequests) * 100
  }
}
