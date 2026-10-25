// MCP Composition Engine (WAVE 7)
// Orchestrate multiple MCPs as unified services

import { mcpDiscovery } from '../mcp/mcp-discovery.js'
import { doIntegration } from '../database/durable-objects/do-integration.js'
import type { MCPServerInfo } from '../mcp/mcp-discovery.js'

export interface CompositionStep {
  id: string
  mcp: string
  operation: string
  params?: any
  depends_on?: string[]
  retry?: number
  timeout?: number
}

export interface CompositionRequest {
  intent?: string
  steps?: CompositionStep[]
  params?: any
  context?: {
    user?: string
    permissions?: string[]
    audit_log?: boolean
  }
}

export interface CompositionResult {
  success: boolean
  steps: Map<string, any>
  errors: string[]
  total_time: number
  timestamp: number
}

export class CompositionEngine {
  private discoveryCache: Map<string, MCPServerInfo> = new Map()
  private workflowCache: Map<string, any> = new Map()
  private executionLog: Array<{
    timestamp: number
    request_id: string
    mcp: string
    operation: string
    status: string
    duration: number
  }> = []

  async initialize(): Promise<void> {
    // Initialize discovery (already done but ensure it's ready)
    const servers = mcpDiscovery.listAvailableServers()
    for (const server of servers) {
      this.discoveryCache.set(server.id, server)
    }
  }

  // Main entry point: execute composition
  async execute(request: CompositionRequest): Promise<CompositionResult> {
    const startTime = performance.now()
    const request_id = `comp:${Date.now()}:${Math.random().toString(36).slice(2)}`
    const results = new Map<string, any>()
    const errors: string[] = []

    try {
      // Parse intent if provided
      let steps = request.steps
      if (request.intent && !steps) {
        steps = await this.parseIntent(request.intent, request.params)
      }

      if (!steps || steps.length === 0) {
        throw new Error('No composition steps defined')
      }

      // Acquire coordination lock
      const lockKey = `composition:${request_id}`
      await doIntegration.acquireLock(lockKey, 60000)

      try {
        // Build dependency graph
        const graph = this.buildDependencyGraph(steps)

        // Execute steps respecting dependencies
        const execution_order = this.topologicalSort(graph)

        for (const step_id of execution_order) {
          const step = steps.find(s => s.id === step_id)
          if (!step) continue

          try {
            // Check dependencies
            const deps_satisfied = step.depends_on?.every(dep => results.has(dep)) ?? true
            if (!deps_satisfied) {
              throw new Error(`Dependencies not satisfied: ${step.depends_on?.join(', ')}`)
            }

            // Resolve parameters (substitute from previous results)
            const resolved_params = this.resolveParams(step.params, results)

            // Execute step
            const step_result = await this.executeStep(step, resolved_params, request.context)
            results.set(step.id, step_result)

            // Log execution
            this.logExecution({
              timestamp: Date.now(),
              request_id,
              mcp: step.mcp,
              operation: step.operation,
              status: 'success',
              duration: step_result.duration || 0
            })
          } catch (error) {
            const message = (error as Error).message
            errors.push(`Step ${step.id}: ${message}`)

            // Log execution
            this.logExecution({
              timestamp: Date.now(),
              request_id,
              mcp: step.mcp,
              operation: step.operation,
              status: 'failed',
              duration: 0
            })

            // Retry if configured
            if ((step.retry || 0) > 0) {
              step.retry = (step.retry || 1) - 1
              // Retry this step
              return this.execute({ ...request, steps })
            }

            // Stop on error if not configured for continue-on-error
            if (!request.params?.continue_on_error) {
              throw error
            }
          }
        }
      } finally {
        // Always release lock
        await doIntegration.releaseLock(lockKey)
      }

      return {
        success: errors.length === 0,
        steps: results,
        errors,
        total_time: performance.now() - startTime,
        timestamp: Date.now()
      }
    } catch (error) {
      return {
        success: false,
        steps: results,
        errors: [...errors, (error as Error).message],
        total_time: performance.now() - startTime,
        timestamp: Date.now()
      }
    }
  }

  // Parse high-level intent into composition steps
  private async parseIntent(intent: string, params?: any): Promise<CompositionStep[]> {
    const steps: CompositionStep[] = []

    switch (intent) {
      case 'analyze':
        steps.push(
          { id: 'fetch', mcp: 'filesystem', operation: 'read', params },
          { id: 'analyze', mcp: 'ai', operation: 'analyze', depends_on: ['fetch'], params }
        )
        break

      case 'search':
        steps.push(
          { id: 'query', mcp: 'database', operation: 'query', params },
          { id: 'index', mcp: 'search', operation: 'search', depends_on: ['query'] }
        )
        break

      case 'transform':
        steps.push(
          { id: 'read', mcp: 'filesystem', operation: 'read', params },
          { id: 'process', mcp: 'ai', operation: 'transform', depends_on: ['read'] },
          { id: 'write', mcp: 'filesystem', operation: 'write', depends_on: ['process'] }
        )
        break

      case 'sync':
        steps.push(
          { id: 'fetch', mcp: 'git', operation: 'pull', params },
          { id: 'read', mcp: 'filesystem', operation: 'read', depends_on: ['fetch'] },
          { id: 'store', mcp: 'database', operation: 'write', depends_on: ['read'] }
        )
        break

      default:
        throw new Error(`Unknown intent: ${intent}`)
    }

    return steps
  }

  // Execute a single step
  private async executeStep(
    step: CompositionStep,
    params: any,
    context?: any
  ): Promise<any> {
    const startTime = performance.now()

    try {
      // Find MCP
      const mcp = this.discoveryCache.get(step.mcp)
      if (!mcp) {
        throw new Error(`MCP not found: ${step.mcp}`)
      }

      // Call MCP
      const response = await this.callMCP(mcp, step.operation, params, context)

      return {
        success: response.success,
        data: response.data,
        error: response.error,
        duration: performance.now() - startTime,
        mcp: step.mcp
      }
    } catch (error) {
      throw new Error(`MCP call failed: ${(error as Error).message}`)
    }
  }

  // Call MCP service
  private async callMCP(mcp: MCPServerInfo, operation: string, params: any, context?: any): Promise<any> {
    // In production, would route through actual MCP protocol
    // For now, simulate
    return {
      success: true,
      data: {
        operation,
        params,
        mcp: mcp.name,
        context: context?.user || 'anonymous'
      },
      duration: Math.random() * 100
    }
  }

  // Build dependency graph
  private buildDependencyGraph(steps: CompositionStep[]): Map<string, string[]> {
    const graph = new Map<string, string[]>()

    for (const step of steps) {
      graph.set(step.id, step.depends_on || [])
    }

    return graph
  }

  // Topological sort for dependency resolution
  private topologicalSort(graph: Map<string, string[]>): string[] {
    const visited = new Set<string>()
    const order: string[] = []

    const visit = (node: string) => {
      if (visited.has(node)) return
      visited.add(node)

      const deps = graph.get(node) || []
      for (const dep of deps) {
        visit(dep)
      }

      order.push(node)
    }

    for (const node of graph.keys()) {
      visit(node)
    }

    return order
  }

  // Resolve parameters by substituting values from previous results
  private resolveParams(params: any, results: Map<string, any>): any {
    if (!params) return {}

    const resolved: any = {}

    for (const [key, value] of Object.entries(params)) {
      if (typeof value === 'string' && value.startsWith('$')) {
        // Reference to previous result
        const [step_id, field] = value.slice(1).split('.')
        const step_result = results.get(step_id)

        if (step_result) {
          resolved[key] = field ? step_result[field] : step_result
        } else {
          throw new Error(`Reference not found: ${value}`)
        }
      } else {
        resolved[key] = value
      }
    }

    return resolved
  }

  // Define a workflow for repeated execution
  async defineWorkflow(workflow: any): Promise<string> {
    const workflow_id = `workflow:${Date.now()}:${Math.random().toString(36).slice(2)}`
    this.workflowCache.set(workflow_id, workflow)

    // Store in database
    await doIntegration.coordinatedWrite('workflows', {
      id: workflow_id,
      name: workflow.name,
      steps: workflow.steps,
      schedule: workflow.schedule,
      created_at: Date.now()
    }, ['postgresql', 'mongodb'])

    return workflow_id
  }

  // Execute a defined workflow
  async executeWorkflow(workflow_id: string): Promise<CompositionResult> {
    const workflow = this.workflowCache.get(workflow_id)
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflow_id}`)
    }

    return this.execute({ steps: workflow.steps })
  }

  // List all available MCPs and their capabilities
  async listCapabilities(): Promise<any[]> {
    const capabilities: any[] = []

    for (const [id, mcp] of this.discoveryCache.entries()) {
      for (const tool of mcp.tools) {
        capabilities.push({
          mcp: mcp.name,
          tool: tool.name,
          description: tool.description,
          mcp_id: id,
          available: mcp.available
        })
      }
    }

    return capabilities
  }

  // Get execution history
  getExecutionLog(limit: number = 100): any[] {
    return this.executionLog.slice(-limit)
  }

  // Log execution for audit trail
  private logExecution(entry: any): void {
    this.executionLog.push(entry)

    // Keep only last 1000 entries in memory
    if (this.executionLog.length > 1000) {
      this.executionLog = this.executionLog.slice(-1000)
    }
  }

  // Suggest composition for a request
  async suggestComposition(request: any): Promise<CompositionStep[]> {
    // Analyze request and suggest optimal composition
    const capabilities = await this.listCapabilities()

    // Match request to capabilities
    const suggested_steps: CompositionStep[] = []

    // Simple heuristic: if request mentions 'query', use database
    if (request.query) {
      suggested_steps.push({
        id: 'query',
        mcp: 'database',
        operation: 'query',
        params: { sql: request.query }
      })
    }

    // If request mentions 'analyze', use AI
    if (request.analyze) {
      suggested_steps.push({
        id: 'analyze',
        mcp: 'ai',
        operation: 'analyze',
        params: { data: request.data },
        depends_on: suggested_steps.length > 0 ? [suggested_steps[suggested_steps.length - 1].id] : []
      })
    }

    // If request mentions 'save' or 'store', use database
    if (request.save || request.store) {
      suggested_steps.push({
        id: 'store',
        mcp: 'database',
        operation: 'write',
        params: { data: request.data },
        depends_on: suggested_steps.length > 0 ? [suggested_steps[suggested_steps.length - 1].id] : []
      })
    }

    return suggested_steps
  }

  // Get stats about compositions
  getStats(): any {
    const logs = this.executionLog
    const successful = logs.filter(l => l.status === 'success').length
    const failed = logs.filter(l => l.status === 'failed').length
    const avg_duration = logs.reduce((sum, l) => sum + l.duration, 0) / logs.length || 0

    const by_mcp: Record<string, number> = {}
    for (const log of logs) {
      by_mcp[log.mcp] = (by_mcp[log.mcp] || 0) + 1
    }

    return {
      total_executions: logs.length,
      successful,
      failed,
      success_rate: successful / logs.length || 0,
      avg_duration,
      by_mcp,
      workflows: this.workflowCache.size
    }
  }
}

export const compositionEngine = new CompositionEngine()
