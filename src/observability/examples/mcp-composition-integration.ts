// Example: Integration of observability with MCP Composition Engine (WAVE 8C)
// Shows how to instrument the composition engine from WAVE 7

import type { CompositionRequest, CompositionResult, CompositionStep } from '../../mcp-composition/composition-engine.js'
import { tracer, metrics, getLogger, instrumentOperation, instrumentMCPCall } from '../index.js'
import { TraceContext } from '../types.js'

/**
 * Instrumented composition execution wrapper
 * This shows how to integrate observability into the CompositionEngine.execute() method
 */
export async function executeCompositionWithObservability(
  compositionEngine: any, // CompositionEngine instance
  request: CompositionRequest,
  userId?: string
): Promise<CompositionResult> {
  // Create trace context
  const context = tracer.createTraceContext(userId, request.context?.audit_log ? undefined : undefined)
  const logger = getLogger('mcp-composition')

  logger.info('Composition request received', context, {
    intent: request.intent,
    stepCount: request.steps?.length,
    hasContext: !!request.context
  })

  // Instrument the main composition execution
  return await instrumentOperation(
    'mcp.composition.execute',
    context,
    async () => {
      const startTime = performance.now()
      const result = await compositionEngine.execute(request)
      const duration = performance.now() - startTime

      // Log composition result
      logger.info('Composition completed', context, {
        success: result.success,
        stepsCompleted: result.steps.size,
        errors: result.errors.length,
        totalTime: Math.round(duration),
        durationMs: result.total_time
      })

      return result
    },
    {
      kind: 'server',
      attributes: {
        intent: request.intent,
        step_count: request.steps?.length || 0,
        has_context: !!request.context
      }
    }
  )
}

/**
 * Instrumented step execution
 * This wraps the execution of individual composition steps
 */
export async function executeCompositionStepWithObservability(
  step: CompositionStep,
  parentContext: TraceContext,
  executeStepFn: (step: CompositionStep) => Promise<any>
): Promise<any> {
  return await instrumentMCPCall(
    step.mcp,
    step.operation,
    parentContext,
    () => executeStepFn(step),
    {
      params: {
        stepId: step.id,
        timeout: step.timeout,
        retries: step.retry,
        hasDependencies: !!step.depends_on?.length
      }
    }
  )
}

/**
 * Patch CompositionEngine with observability
 * This is a practical example of how to add observability to an existing engine
 */
export function patchCompositionEngineWithObservability(
  CompositionEngineClass: any
): any {
  const originalExecute = CompositionEngineClass.prototype.execute

  CompositionEngineClass.prototype.execute = async function(
    this: any,
    request: CompositionRequest
  ): Promise<CompositionResult> {
    // Create trace context from request or new
    const context = tracer.createTraceContext(request.context?.user)
    const logger = getLogger('composition-engine')

    logger.info('Composition.execute called', context, {
      intent: request.intent,
      steps: request.steps?.length
    })

    const startTime = performance.now()

    try {
      // Create a span for the entire composition
      const span = tracer.startSpan('composition.execute', context, 'server', {
        intent: request.intent,
        step_count: request.steps?.length || 0
      })

      // Call original execute, but we'll need to wrap individual steps
      const result = await originalExecute.call(this, request)

      const duration = performance.now() - startTime

      span.recordEvent({
        name: 'composition.result',
        timestamp: Date.now(),
        attributes: {
          success: result.success,
          steps_completed: result.steps.size,
          errors: result.errors.length,
          total_time: duration
        }
      })

      tracer.endSpan(span, result.success ? 'ok' : 'error')
      metrics.recordOperation('composition.execute', duration, result.success)

      logger.info('Composition.execute completed', context, {
        success: result.success,
        duration: Math.round(duration),
        stepsCompleted: result.steps.size,
        errors: result.errors.length
      })

      return result
    } catch (err) {
      const duration = performance.now() - startTime
      const error = err as Error

      metrics.recordOperation('composition.execute', duration, false)
      logger.error('Composition.execute failed', context, error, {
        duration: Math.round(duration)
      })

      throw err
    }
  }

  return CompositionEngineClass
}

/**
 * Instrument MCP discovery caching and performance
 */
export function instrumentMCPDiscovery(mcpDiscovery: any): void {
  const logger = getLogger('mcp-discovery')
  const originalListServers = mcpDiscovery.listAvailableServers

  mcpDiscovery.listAvailableServers = function() {
    const startTime = performance.now()
    const context = tracer.createTraceContext()

    const result = originalListServers.call(this)

    const duration = performance.now() - startTime
    metrics.recordOperation('mcp.discovery.list_servers', duration, true)

    logger.debug('MCP servers discovered', context, {
      serverCount: result.length,
      duration: Math.round(duration)
    })

    return result
  }
}

/**
 * Composition analytics helper - aggregates metrics about compositions
 */
export class CompositionAnalytics {
  private logger = getLogger('composition-analytics')
  private compositionMetrics = new Map<
    string,
    {
      count: number
      totalDuration: number
      successCount: number
      errorCount: number
      stepStats: Map<string, { count: number; avgDuration: number; errorRate: number }>
    }
  >()

  recordComposition(
    intent: string,
    duration: number,
    success: boolean,
    stepStats?: Map<string, { duration: number; success: boolean }>
  ): void {
    const existing = this.compositionMetrics.get(intent) || {
      count: 0,
      totalDuration: 0,
      successCount: 0,
      errorCount: 0,
      stepStats: new Map()
    }

    existing.count++
    existing.totalDuration += duration
    if (success) {
      existing.successCount++
    } else {
      existing.errorCount++
    }

    // Update step stats
    if (stepStats) {
      for (const [step, { duration: stepDuration, success: stepSuccess }] of stepStats.entries()) {
        const stats = existing.stepStats.get(step) || {
          count: 0,
          avgDuration: 0,
          errorRate: 0
        }
        stats.count++
        stats.avgDuration = (stats.avgDuration * (stats.count - 1) + stepDuration) / stats.count
        stats.errorRate = (stats.errorRate * (stats.count - 1) + (stepSuccess ? 0 : 1)) / stats.count
        existing.stepStats.set(step, stats)
      }
    }

    this.compositionMetrics.set(intent, existing)
  }

  getMetrics(intent: string): any {
    return this.compositionMetrics.get(intent)
  }

  getAllMetrics(): Map<string, any> {
    return new Map(this.compositionMetrics)
  }

  logSummary(): void {
    for (const [intent, metrics] of this.compositionMetrics.entries()) {
      const successRate = metrics.count > 0 ? (metrics.successCount / metrics.count) * 100 : 0

      this.logger.info(`Composition "${intent}" summary`, tracer.createTraceContext(), {
        intent,
        totalExecutions: metrics.count,
        successRate: successRate.toFixed(2) + '%',
        averageDuration: Math.round(metrics.totalDuration / metrics.count),
        errors: metrics.errorCount
      })

      // Log per-step metrics
      for (const [step, stepMetrics] of metrics.stepStats.entries()) {
        this.logger.debug(`Step "${step}" in "${intent}"`, tracer.createTraceContext(), {
          executions: stepMetrics.count,
          avgDuration: Math.round(stepMetrics.avgDuration),
          errorRate: (stepMetrics.errorRate * 100).toFixed(2) + '%'
        })
      }
    }
  }
}
