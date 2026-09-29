/**
 * Multi-Cloud Orchestrator - Orchestrates workloads across AWS, GCP, Azure, hybrid
 * Load balancing, failover, cost optimization, multi-region deployment
 */

export type CloudProvider = 'aws' | 'gcp' | 'azure' | 'on-prem'

export interface CloudRegion {
  provider: CloudProvider
  region: string
  status: 'healthy' | 'degraded' | 'down'
  latency: number // ms
  cost: number // per hour
  capacity: number // percentage
}

export interface Workload {
  id: string
  name: string
  cpuRequired: number
  memoryRequired: number
  storageRequired: number
  priority: 'critical' | 'high' | 'medium' | 'low'
  minReplicas: number
  maxReplicas: number
  currentReplicas: number
  deployedOn: CloudRegion[]
}

export interface LoadBalancingStrategy {
  type: 'round-robin' | 'latency-based' | 'cost-optimized' | 'capacity-based'
  weights?: Record<string, number>
  threshold?: number
}

export interface MultiCloudDeployment {
  workloadId: string
  strategy: LoadBalancingStrategy
  regions: CloudRegion[]
  distributionPercentage: Record<string, number>
  estimatedCost: number
  estimatedLatency: number
}

export class MultiCloudOrchestrator {
  private regions: Map<string, CloudRegion> = new Map()
  private workloads: Map<string, Workload> = new Map()
  private deployments: Map<string, MultiCloudDeployment> = new Map()

  constructor() {
    this.initializeRegions()
  }

  private initializeRegions(): void {
    const regions: CloudRegion[] = [
      // AWS
      { provider: 'aws', region: 'us-east-1', status: 'healthy', latency: 15, cost: 0.50, capacity: 65 },
      { provider: 'aws', region: 'eu-west-1', status: 'healthy', latency: 45, cost: 0.55, capacity: 80 },
      { provider: 'aws', region: 'ap-southeast-1', status: 'healthy', latency: 60, cost: 0.52, capacity: 70 },

      // GCP
      { provider: 'gcp', region: 'us-central1', status: 'healthy', latency: 20, cost: 0.48, capacity: 75 },
      { provider: 'gcp', region: 'europe-west1', status: 'healthy', latency: 40, cost: 0.52, capacity: 60 },
      { provider: 'gcp', region: 'asia-east1', status: 'healthy', latency: 55, cost: 0.50, capacity: 85 },

      // Azure
      { provider: 'azure', region: 'eastus', status: 'healthy', latency: 18, cost: 0.52, capacity: 70 },
      { provider: 'azure', region: 'westeurope', status: 'healthy', latency: 42, cost: 0.54, capacity: 72 },
      { provider: 'azure', region: 'southeastasia', status: 'healthy', latency: 58, cost: 0.51, capacity: 68 },

      // On-Premise
      { provider: 'on-prem', region: 'local-datacenter', status: 'healthy', latency: 5, cost: 0.30, capacity: 50 }
    ]

    regions.forEach(r => {
      this.regions.set(`${r.provider}-${r.region}`, r)
    })
  }

  deployWorkload(
    workloadId: string,
    config: Omit<Workload, 'id' | 'deployedOn' | 'currentReplicas'>,
    strategy: LoadBalancingStrategy
  ): MultiCloudDeployment {
    const workload: Workload = {
      ...config,
      id: workloadId,
      deployedOn: [],
      currentReplicas: config.minReplicas
    }

    this.workloads.set(workloadId, workload)

    // Determine best regions for deployment
    const selectedRegions = this.selectRegions(workload, strategy)
    workload.deployedOn = selectedRegions

    // Calculate distribution
    const distribution = this.calculateDistribution(selectedRegions, strategy)

    const deployment: MultiCloudDeployment = {
      workloadId,
      strategy,
      regions: selectedRegions,
      distributionPercentage: distribution,
      estimatedCost: this.estimateCost(selectedRegions, workload),
      estimatedLatency: this.estimateLatency(selectedRegions, distribution)
    }

    this.deployments.set(workloadId, deployment)
    return deployment
  }

  private selectRegions(workload: Workload, strategy: LoadBalancingStrategy): CloudRegion[] {
    const allRegions = Array.from(this.regions.values()).filter(r => r.status === 'healthy' && r.capacity > 20)

    if (strategy.type === 'latency-based') {
      return allRegions.sort((a, b) => a.latency - b.latency).slice(0, 3)
    } else if (strategy.type === 'cost-optimized') {
      return allRegions.sort((a, b) => a.cost - b.cost).slice(0, 3)
    } else if (strategy.type === 'capacity-based') {
      return allRegions.sort((a, b) => b.capacity - a.capacity).slice(0, 3)
    } else {
      // round-robin: distribute across all providers
      const providers = ['aws', 'gcp', 'azure']
      return providers.flatMap(p => {
        const regional = allRegions.filter(r => r.provider === p)
        return regional.length > 0 ? regional[0] : []
      })
    }
  }

  private calculateDistribution(regions: CloudRegion[], strategy: LoadBalancingStrategy): Record<string, number> {
    const distribution: Record<string, number> = {}
    const key = (r: CloudRegion) => `${r.provider}-${r.region}`

    if (strategy.weights) {
      const totalWeight = Object.values(strategy.weights).reduce((a, b) => a + b, 0)
      Object.entries(strategy.weights).forEach(([k, v]) => {
        distribution[k] = (v / totalWeight) * 100
      })
    } else {
      // Equal distribution
      const per = 100 / regions.length
      regions.forEach(r => {
        distribution[key(r)] = per
      })
    }

    return distribution
  }

  private estimateCost(regions: CloudRegion[], workload: Workload): number {
    return regions.reduce((sum, r) => {
      const instanceCost = r.cost * workload.minReplicas
      return sum + instanceCost
    }, 0)
  }

  private estimateLatency(regions: CloudRegion[], distribution: Record<string, number>): number {
    let totalLatency = 0
    let totalWeight = 0

    const regionsByKey = new Map(Array.from(this.regions.entries()))

    Object.entries(distribution).forEach(([key, percentage]) => {
      const region = regionsByKey.get(key)
      if (region) {
        totalLatency += region.latency * (percentage / 100)
        totalWeight += percentage / 100
      }
    })

    return Math.round(totalLatency / (totalWeight || 1))
  }

  scaleWorkload(workloadId: string, replicas: number): Workload | null {
    const workload = this.workloads.get(workloadId)
    if (!workload) return null

    workload.currentReplicas = Math.max(workload.minReplicas, Math.min(replicas, workload.maxReplicas))
    return workload
  }

  failoverToRegion(workloadId: string, targetRegion: string): boolean {
    const deployment = this.deployments.get(workloadId)
    if (!deployment) return false

    // Move workload to target region
    const newRegions = [this.regions.get(targetRegion)].filter(Boolean) as CloudRegion[]
    if (newRegions.length === 0) return false

    deployment.regions = newRegions
    deployment.distributionPercentage = { [targetRegion]: 100 }

    return true
  }

  optimizeForCost(): Map<string, MultiCloudDeployment> {
    const optimized = new Map<string, MultiCloudDeployment>()

    this.deployments.forEach((deployment, workloadId) => {
      const costOptimizedStrategy: LoadBalancingStrategy = { type: 'cost-optimized' }
      const workload = this.workloads.get(workloadId)

      if (workload) {
        const newDeployment = this.deployWorkload(workloadId, workload, costOptimizedStrategy)
        optimized.set(workloadId, newDeployment)
      }
    })

    return optimized
  }

  optimizeForLatency(): Map<string, MultiCloudDeployment> {
    const optimized = new Map<string, MultiCloudDeployment>()

    this.deployments.forEach((deployment, workloadId) => {
      const latencyOptimizedStrategy: LoadBalancingStrategy = { type: 'latency-based' }
      const workload = this.workloads.get(workloadId)

      if (workload) {
        const newDeployment = this.deployWorkload(workloadId, workload, latencyOptimizedStrategy)
        optimized.set(workloadId, newDeployment)
      }
    })

    return optimized
  }

  getRegionHealth(): Array<{ region: string; provider: string; status: string; latency: number; cost: number }> {
    return Array.from(this.regions.values()).map(r => ({
      region: r.region,
      provider: r.provider,
      status: r.status,
      latency: r.latency,
      cost: r.cost
    }))
  }

  getClusterStats(): {
    totalRegions: number
    healthyRegions: number
    totalWorkloads: number
    totalReplicas: number
    estimatedMonthlyClusterCost: number
    avgLatency: number
  } {
    const regions = Array.from(this.regions.values())
    const healthyCount = regions.filter(r => r.status === 'healthy').length
    const workloads = Array.from(this.workloads.values())
    const totalReplicas = workloads.reduce((sum, w) => sum + w.currentReplicas, 0)
    const monthlyCost = Array.from(this.deployments.values()).reduce(
      (sum, d) => sum + d.estimatedCost * 730,
      0
    ) // 730 hours per month
    const avgLatency = Array.from(this.deployments.values()).reduce(
      (sum, d) => sum + d.estimatedLatency,
      0
    ) / Math.max(this.deployments.size, 1)

    return {
      totalRegions: regions.length,
      healthyRegions: healthyCount,
      totalWorkloads: workloads.length,
      totalReplicas,
      estimatedMonthlyClusterCost: Math.round(monthlyCost),
      avgLatency: Math.round(avgLatency)
    }
  }
}

export const multiCloudOrchestrator = new MultiCloudOrchestrator()
