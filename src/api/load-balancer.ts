/**
 * Load Balancer
 * Distributes requests across multiple instances
 * Supports round-robin, least-connections, weighted routing
 */

// ============================================================================
// LOAD BALANCER TYPES
// ============================================================================

export type LoadBalancingStrategy = 'round-robin' | 'least-connections' | 'weighted' | 'ip-hash'

export interface InstanceHealth {
  id: string
  url: string
  healthy: boolean
  connections: number
  weight: number
  successRate: number
  avgResponseTime: number
  lastHealthCheck: Date
}

export interface LoadBalancerConfig {
  strategy: LoadBalancingStrategy
  healthCheckIntervalMs: number
  healthCheckTimeoutMs: number
  maxUnhealthyDuration: number
}

export interface RouteDecision {
  instanceId: string
  instanceUrl: string
  reason: string
  alternates: string[]
}

// ============================================================================
// LOAD BALANCER
// ============================================================================

export class LoadBalancer {
  private instances: Map<string, InstanceHealth> = new Map()
  private config: LoadBalancerConfig
  private requestCount = 0
  private roundRobinIndex = 0

  constructor(config: Partial<LoadBalancingStrategy | LoadBalancerConfig> = {}) {
    this.config = {
      strategy: (config as any).strategy ?? 'round-robin',
      healthCheckIntervalMs: (config as any).healthCheckIntervalMs ?? 30000,
      healthCheckTimeoutMs: (config as any).healthCheckTimeoutMs ?? 5000,
      maxUnhealthyDuration: (config as any).maxUnhealthyDuration ?? 120000
    }
  }

  /**
   * Register instance
   */
  registerInstance(id: string, url: string, weight: number = 1): void {
    this.instances.set(id, {
      id,
      url,
      healthy: true,
      connections: 0,
      weight,
      successRate: 100,
      avgResponseTime: 0,
      lastHealthCheck: new Date()
    })
  }

  /**
   * Unregister instance
   */
  unregisterInstance(id: string): void {
    this.instances.delete(id)
  }

  /**
   * Route request
   */
  route(clientIp?: string): RouteDecision {
    const healthy = Array.from(this.instances.values()).filter(i => i.healthy)

    if (healthy.length === 0) {
      throw new Error('No healthy instances available')
    }

    let selected: InstanceHealth | undefined

    switch (this.config.strategy) {
      case 'round-robin':
        selected = this.roundRobinSelect(healthy)
        break
      case 'least-connections':
        selected = this.leastConnectionsSelect(healthy)
        break
      case 'weighted':
        selected = this.weightedSelect(healthy)
        break
      case 'ip-hash':
        selected = this.ipHashSelect(healthy, clientIp)
        break
      default:
        selected = healthy[0]
    }

    if (selected) {
      selected.connections++
      this.requestCount++

      const alternates = healthy
        .filter(i => i.id !== selected!.id)
        .map(i => i.id)

      return {
        instanceId: selected.id,
        instanceUrl: selected.url,
        reason: `${this.config.strategy} selected`,
        alternates
      }
    }

    throw new Error('Could not select instance')
  }

  /**
   * Round-robin selection
   */
  private roundRobinSelect(instances: InstanceHealth[]): InstanceHealth {
    const selected = instances[this.roundRobinIndex % instances.length]
    this.roundRobinIndex++
    return selected
  }

  /**
   * Least-connections selection
   */
  private leastConnectionsSelect(instances: InstanceHealth[]): InstanceHealth {
    return instances.reduce((min, current) =>
      current.connections < min.connections ? current : min
    )
  }

  /**
   * Weighted selection
   */
  private weightedSelect(instances: InstanceHealth[]): InstanceHealth {
    const totalWeight = instances.reduce((sum, i) => sum + i.weight, 0)
    let random = Math.random() * totalWeight
    let selected = instances[0]

    for (const instance of instances) {
      random -= instance.weight
      if (random <= 0) {
        selected = instance
        break
      }
    }

    return selected
  }

  /**
   * IP-hash selection (sticky sessions)
   */
  private ipHashSelect(instances: InstanceHealth[], clientIp?: string): InstanceHealth {
    const ip = clientIp || 'default'
    let hash = 0

    for (let i = 0; i < ip.length; i++) {
      hash = (hash << 5) - hash + ip.charCodeAt(i)
      hash = hash & hash
    }

    return instances[Math.abs(hash) % instances.length]
  }

  /**
   * Record request completion
   */
  recordCompletion(instanceId: string, success: boolean, responseTime: number): void {
    const instance = this.instances.get(instanceId)
    if (!instance) return

    instance.connections = Math.max(0, instance.connections - 1)

    if (success) {
      instance.successRate =
        (instance.successRate * 0.9 + 100 * 0.1)
    } else {
      instance.successRate =
        (instance.successRate * 0.9 + 0 * 0.1)
    }

    instance.avgResponseTime =
      instance.avgResponseTime * 0.7 + responseTime * 0.3
  }

  /**
   * Mark instance health
   */
  setInstanceHealth(instanceId: string, healthy: boolean): void {
    const instance = this.instances.get(instanceId)
    if (instance) {
      instance.healthy = healthy
      instance.lastHealthCheck = new Date()
    }
  }

  /**
   * Get instance status
   */
  getInstanceStatus(instanceId: string): InstanceHealth | undefined {
    return this.instances.get(instanceId)
  }

  /**
   * Get all instances
   */
  getInstances(): InstanceHealth[] {
    return Array.from(this.instances.values())
  }

  /**
   * Get load balancer stats
   */
  getStats(): {
    totalRequests: number
    instances: number
    healthy: number
    unhealthy: number
    avgConnectionsPerInstance: number
    totalConnections: number
  } {
    const instances = Array.from(this.instances.values())
    const healthy = instances.filter(i => i.healthy).length
    const totalConnections = instances.reduce((sum, i) => sum + i.connections, 0)
    const avgConnectionsPerInstance = instances.length > 0 ? totalConnections / instances.length : 0

    return {
      totalRequests: this.requestCount,
      instances: instances.length,
      healthy,
      unhealthy: instances.length - healthy,
      avgConnectionsPerInstance,
      totalConnections
    }
  }

  /**
   * Get recommendations
   */
  getRecommendations(): string[] {
    const recommendations: string[] = []
    const instances = this.getInstances()
    const stats = this.getStats()

    if (stats.unhealthy > 0) {
      recommendations.push(`${stats.unhealthy} unhealthy instances - check and remediate`)
    }

    const overloaded = instances.filter(i => i.connections > 10)
    if (overloaded.length > 0) {
      recommendations.push(`${overloaded.length} instances overloaded - consider auto-scaling`)
    }

    const slow = instances.filter(i => i.avgResponseTime > 500)
    if (slow.length > 0) {
      recommendations.push(`${slow.length} instances slow (>500ms) - investigate performance`)
    }

    return recommendations
  }
}

// ============================================================================
// GLOBAL INSTANCE
// ============================================================================

export const loadBalancer = new LoadBalancer()

/**
 * Route request (global)
 */
export function routeRequest(clientIp?: string): RouteDecision {
  return loadBalancer.route(clientIp)
}

/**
 * Record completion (global)
 */
export function recordCompletion(
  instanceId: string,
  success: boolean,
  responseTime: number
): void {
  loadBalancer.recordCompletion(instanceId, success, responseTime)
}

export default {
  LoadBalancer,
  loadBalancer,
  routeRequest,
  recordCompletion
}
