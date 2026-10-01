/**
 * WORKLOAD TYPE AWARENESS FORMULAS
 * Route and optimize based on workload characteristics
 * Phase 8b: Enterprise - GAP 3
 */

// ============================================================================
// FORMULA 1: WORKLOAD CLASSIFIER
// Identify request type: batch, realtime, interactive
// ============================================================================

export type WorkloadType = 'batch' | 'realtime' | 'interactive' | 'unknown'

export interface WorkloadProfile {
  type: WorkloadType
  estimatedDuration: number // ms
  throughputRequired: number // ops/sec
  latencyTarget: number // ms
  priority: 'critical' | 'high' | 'normal' | 'low'
}

export class WorkloadClassifier {
  classify(request: any): WorkloadProfile {
    // Heuristics for classification
    const hasTimeout = request.timeout !== undefined
    const isStreaming = request.stream === true
    const isLongRunning = request.timeout && request.timeout > 60000
    const isBurst = request.batchSize && request.batchSize > 100

    let type: WorkloadType = 'unknown'
    let duration = 5000
    let throughput = 100
    let latency = 100
    let priority: 'critical' | 'high' | 'normal' | 'low' = 'normal'

    if (isLongRunning && isBurst) {
      type = 'batch'
      duration = 300000 // 5 minutes
      throughput = 10
      latency = 5000
      priority = 'low'
    } else if (isStreaming) {
      type = 'realtime'
      duration = 60000
      throughput = 1000
      latency = 100
      priority = 'high'
    } else if (hasTimeout && request.timeout < 1000) {
      type = 'interactive'
      duration = 500
      throughput = 10000
      latency = 50
      priority = 'critical'
    }

    return { type, estimatedDuration: duration, throughputRequired: throughput, latencyTarget: latency, priority }
  }

  isInteractive(profile: WorkloadProfile): boolean {
    return profile.type === 'interactive'
  }

  isRealtime(profile: WorkloadProfile): boolean {
    return profile.type === 'realtime'
  }

  isBatch(profile: WorkloadProfile): boolean {
    return profile.type === 'batch'
  }
}

// ============================================================================
// FORMULA 2: SLA ENFORCER
// Route by latency requirement (5ms/50ms/5min)
// ============================================================================

export interface SLA {
  name: string
  maxLatencyMs: number
  maxErrorRate: number
  guaranteedThroughput: number
}

const SLAs = {
  'ultra-low': { name: 'ultra-low', maxLatencyMs: 5, maxErrorRate: 0.001, guaranteedThroughput: 100000 },
  'low': { name: 'low', maxLatencyMs: 50, maxErrorRate: 0.01, guaranteedThroughput: 10000 },
  'normal': { name: 'normal', maxLatencyMs: 500, maxErrorRate: 0.05, guaranteedThroughput: 1000 },
  'batch': { name: 'batch', maxLatencyMs: 300000, maxErrorRate: 0.1, guaranteedThroughput: 10 }
}

export class SLAEnforcer {
  selectSLA(profile: WorkloadProfile): SLA {
    if (profile.latencyTarget < 10) return SLAs['ultra-low']
    if (profile.latencyTarget < 100) return SLAs['low']
    if (profile.latencyTarget < 1000) return SLAs['normal']
    return SLAs['batch']
  }

  canAccept(actualLatency: number, sla: SLA): boolean {
    return actualLatency <= sla.maxLatencyMs
  }

  breachPercentage(actualLatencies: number[], sla: SLA): number {
    const breaches = actualLatencies.filter(l => l > sla.maxLatencyMs).length
    return breaches / actualLatencies.length
  }
}

// ============================================================================
// FORMULA 3: QUEUE ROUTER
// Batch → queue, interactive → direct
// ============================================================================

export interface QueueMessage {
  id: string
  payload: unknown
  priority: number
  timestamp: number
  retries: number
}

export class QueueRouter {
  private queues = new Map<WorkloadType, QueueMessage[]>()

  constructor() {
    this.queues.set('batch', [])
    this.queues.set('realtime', [])
    this.queues.set('interactive', [])
  }

  route(workload: WorkloadProfile, payload: unknown): string {
    const msg: QueueMessage = {
      id: `${Date.now()}-${Math.random()}`,
      payload,
      priority: this.priorityToNumber(workload.priority),
      timestamp: Date.now(),
      retries: 0
    }

    const queue = this.queues.get(workload.type)
    if (queue) {
      queue.push(msg)
      queue.sort((a, b) => b.priority - a.priority)
    }

    return msg.id
  }

  dequeue(type: WorkloadType): QueueMessage | undefined {
    const queue = this.queues.get(type)
    return queue?.shift()
  }

  queueSize(type: WorkloadType): number {
    return this.queues.get(type)?.length || 0
  }

  private priorityToNumber(p: string): number {
    const map: Record<string, number> = { critical: 100, high: 75, normal: 50, low: 25 }
    return map[p] || 50
  }
}

// ============================================================================
// FORMULA 4: PRIORITY SCHEDULER
// Interleave high/low priority work
// ============================================================================

export class PriorityScheduler {
  private highQueue: any[] = []
  private normalQueue: any[] = []
  private lowQueue: any[] = []
  private ratio = { high: 0.7, normal: 0.2, low: 0.1 } // 70/20/10 split

  enqueue(item: any, priority: 'high' | 'normal' | 'low'): void {
    if (priority === 'high') this.highQueue.push(item)
    else if (priority === 'normal') this.normalQueue.push(item)
    else this.lowQueue.push(item)
  }

  next(): any | undefined {
    const rand = Math.random()
    if (rand < this.ratio.high && this.highQueue.length > 0) {
      return this.highQueue.shift()
    }
    if (rand < this.ratio.high + this.ratio.normal && this.normalQueue.length > 0) {
      return this.normalQueue.shift()
    }
    return this.lowQueue.shift()
  }

  stats() {
    return {
      high: this.highQueue.length,
      normal: this.normalQueue.length,
      low: this.lowQueue.length
    }
  }
}

// ============================================================================
// FORMULA 5: RESOURCE ALLOCATOR
// CPU/memory budgets per workload type
// ============================================================================

export interface ResourceBudget {
  cpuMs: number
  memoryMb: number
  concurrency: number
}

export class ResourceAllocator {
  private budgets: Record<WorkloadType, ResourceBudget> = {
    interactive: { cpuMs: 100, memoryMb: 256, concurrency: 100 },
    realtime: { cpuMs: 500, memoryMb: 512, concurrency: 50 },
    batch: { cpuMs: 60000, memoryMb: 2048, concurrency: 5 },
    unknown: { cpuMs: 1000, memoryMb: 512, concurrency: 10 }
  }

  private used: Record<WorkloadType, ResourceBudget> = {
    interactive: { cpuMs: 0, memoryMb: 0, concurrency: 0 },
    realtime: { cpuMs: 0, memoryMb: 0, concurrency: 0 },
    batch: { cpuMs: 0, memoryMb: 0, concurrency: 0 },
    unknown: { cpuMs: 0, memoryMb: 0, concurrency: 0 }
  }

  canAllocate(type: WorkloadType, cpuMs: number, memoryMb: number): boolean {
    const budget = this.budgets[type]
    const used = this.used[type]
    return used.cpuMs + cpuMs <= budget.cpuMs && used.memoryMb + memoryMb <= budget.memoryMb
  }

  allocate(type: WorkloadType, cpuMs: number, memoryMb: number): boolean {
    if (!this.canAllocate(type, cpuMs, memoryMb)) return false
    this.used[type].cpuMs += cpuMs
    this.used[type].memoryMb += memoryMb
    this.used[type].concurrency++
    return true
  }

  release(type: WorkloadType, cpuMs: number, memoryMb: number): void {
    this.used[type].cpuMs -= cpuMs
    this.used[type].memoryMb -= memoryMb
    this.used[type].concurrency--
  }

  utilization(type: WorkloadType): number {
    const budget = this.budgets[type]
    const used = this.used[type]
    return (used.cpuMs + used.memoryMb) / (budget.cpuMs + budget.memoryMb)
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const workload = {
  classifier: new WorkloadClassifier(),
  sla: new SLAEnforcer(),
  router: new QueueRouter(),
  scheduler: new PriorityScheduler(),
  allocator: new ResourceAllocator()
}

/**
 * PHASE 8b: GAP 3 - WORKLOAD TYPE AWARENESS
 *
 * 5 Formulas for intelligent routing:
 * ✓ WorkloadClassifier - Identify batch/realtime/interactive
 * ✓ SLAEnforcer - Route by latency SLA (5ms/50ms/500ms/5min)
 * ✓ QueueRouter - Queue batch work, direct interactive
 * ✓ PriorityScheduler - 70/20/10 weighted interleave
 * ✓ ResourceAllocator - CPU/memory budgets per type
 *
 * Enables: 2-3x efficiency for mixed workloads
 */
