/**
 * Cost Optimization Engine
 * Minimize infrastructure costs across all 4 deployment modes
 * Formula-driven cost analysis and reduction
 */

export interface CostMetrics {
  mode: 'browser' | 'standalone' | 'docker' | 'kubernetes'
  baseline: number // USD/month
  optimized: number // USD/month
  savings: number // USD/month
  percentReduction: number // 0-1
  breakdown: Record<string, number>
}

export interface CostFormula {
  name: string
  formula: string
  baseline: number
  optimized: number
  savings: number
}

export class CostOptimization {
  /**
   * Browser Mode Cost Analysis
   * WASM deployment: minimal infrastructure
   */
  static analyzeBrowserCost(): CostMetrics {
    const baseline = {
      cdn: 50, // CDN delivery (4.2MB bundle, global)
      monitoring: 10, // Basic monitoring
      logging: 5, // Minimal logging
      total: 65
    }

    const optimized = {
      cdn: 35, // Cache 90% (reduce transfers)
      monitoring: 5, // Sampling-based monitoring
      logging: 2, // Error-only logging
      total: 42
    }

    return {
      mode: 'browser',
      baseline: baseline.total,
      optimized: optimized.total,
      savings: baseline.total - optimized.total,
      percentReduction: (baseline.total - optimized.total) / baseline.total,
      breakdown: {
        'CDN Delivery': 35,
        'Monitoring': 5,
        'Logging': 2
      }
    }
  }

  /**
   * Standalone Mode Cost Analysis
   * Single machine deployment
   */
  static analyzeStandaloneCost(): CostMetrics {
    const baseline = {
      compute: 150, // EC2 t3.large equivalent
      storage: 20, // 100GB local SSD
      network: 30, // Data transfer
      monitoring: 15, // Full monitoring
      logging: 10, // Full logging
      backups: 10, // Automated backups
      total: 235
    }

    const optimized = {
      compute: 80, // Right-size to t3.small (auto-scale 1-2)
      storage: 10, // 50GB SSD
      network: 12, // Optimize transfers
      monitoring: 7, // Sampled metrics
      logging: 4, // Aggregated logs
      backups: 5, // Minimal retention
      total: 118
    }

    return {
      mode: 'standalone',
      baseline: baseline.total,
      optimized: optimized.total,
      savings: baseline.total - optimized.total,
      percentReduction: (baseline.total - optimized.total) / baseline.total,
      breakdown: {
        'Compute': 80,
        'Storage': 10,
        'Network': 12,
        'Monitoring': 7,
        'Logging': 4,
        'Backups': 5
      }
    }
  }

  /**
   * Docker Mode Cost Analysis
   * Container deployment with orchestration
   */
  static analyzeDockerCost(): CostMetrics {
    const baseline = {
      compute: 400, // 3 × t3.medium
      storage: 60, // Persistent volumes
      network: 80, // Inter-container + egress
      registry: 20, // Container registry
      monitoring: 30, // Container monitoring
      logging: 25, // Aggregated logs
      orchestration: 0, // Docker Compose free
      total: 615
    }

    const optimized = {
      compute: 180, // 2 × t3.small + spot instances
      storage: 30, // Optimized volumes
      network: 35, // Optimized networking
      registry: 10, // Compressed images
      monitoring: 12, // Sparse monitoring
      logging: 10, // Sampling
      orchestration: 0,
      total: 277
    }

    return {
      mode: 'docker',
      baseline: baseline.total,
      optimized: optimized.total,
      savings: baseline.total - optimized.total,
      percentReduction: (baseline.total - optimized.total) / baseline.total,
      breakdown: {
        'Compute': 180,
        'Storage': 30,
        'Network': 35,
        'Registry': 10,
        'Monitoring': 12,
        'Logging': 10
      }
    }
  }

  /**
   * Kubernetes Mode Cost Analysis
   * Production cloud-native deployment
   */
  static analyzeKubernetesCost(): CostMetrics {
    const baseline = {
      compute: 1200, // 5 × t3.large nodes
      storage: 150, // PersistentVolumes
      network: 200, // Load balancer + egress
      registry: 40, // ECR/GCR storage
      monitoring: 80, // Prometheus + Grafana
      logging: 60, // ELK stack
      orchestration: 100, // EKS/GKE control plane
      dns: 10, // Route53/Cloud DNS
      total: 1840
    }

    const optimized = {
      compute: 500, // 3 × t3.small + spot instances (70% on-demand, 30% spot)
      storage: 75, // Tiered storage
      network: 80, // Optimized LB + reserved egress
      registry: 20, // Compressed images
      monitoring: 30, // Sparse sampling
      logging: 20, // Aggregated
      orchestration: 100, // Fixed cost
      dns: 5, // Consolidated
      total: 830
    }

    return {
      mode: 'kubernetes',
      baseline: baseline.total,
      optimized: optimized.total,
      savings: baseline.total - optimized.total,
      percentReduction: (baseline.total - optimized.total) / baseline.total,
      breakdown: {
        'Compute': 500,
        'Storage': 75,
        'Network': 80,
        'Registry': 20,
        'Monitoring': 30,
        'Logging': 20,
        'Orchestration': 100,
        'DNS': 5
      }
    }
  }

  /**
   * Cost per Formula Execution
   * Measure cost efficiency of each formula
   */
  static costPerExecution(mode: 'browser' | 'standalone' | 'docker' | 'kubernetes'): {
    formula: string
    costPerExecution: number // USD
    costPerDay: number // USD
    costPerMonth: number // USD
  }[] {
    // Baseline: monthly cost ÷ 30 days ÷ 86400 seconds ÷ 65 formulas
    // Assume 1 execution per second per formula on average

    const costs = {
      browser: 42 / 30 / 86400 / 65 * 1000000, // Micro-cents
      standalone: 118 / 30 / 86400 / 65 * 1000000,
      docker: 277 / 30 / 86400 / 65 * 1000000,
      kubernetes: 830 / 30 / 86400 / 65 * 1000000
    }

    const costPerExec = costs[mode]

    return [
      { formula: 'q-bb84', costPerExecution: costPerExec, costPerDay: costPerExec * 86400, costPerMonth: costPerExec * 86400 * 30 },
      { formula: 'cross-obs-ml', costPerExecution: costPerExec * 1.1, costPerDay: costPerExec * 1.1 * 86400, costPerMonth: costPerExec * 1.1 * 86400 * 30 },
      { formula: 'ml-classify', costPerExecution: costPerExec * 1.3, costPerDay: costPerExec * 1.3 * 86400, costPerMonth: costPerExec * 1.3 * 86400 * 30 },
      { formula: 'deploy-gate', costPerExecution: costPerExec * 0.8, costPerDay: costPerExec * 0.8 * 86400, costPerMonth: costPerExec * 0.8 * 86400 * 30 }
    ]
  }

  /**
   * Optimize deployment mode selection by cost
   */
  static recommendCheapestMode(expectedTraffic: 'low' | 'medium' | 'high'): {
    recommended: 'browser' | 'standalone' | 'docker' | 'kubernetes'
    reasoning: string
    monthlyCost: number
  } {
    const browser = this.analyzeBrowserCost()
    const standalone = this.analyzeStandaloneCost()
    const docker = this.analyzeDockerCost()
    const kubernetes = this.analyzeKubernetesCost()

    if (expectedTraffic === 'low') {
      return {
        recommended: 'browser',
        reasoning: 'Browser (WASM) has lowest infrastructure cost for low traffic. No servers, just CDN.',
        monthlyCost: browser.optimized
      }
    }

    if (expectedTraffic === 'medium') {
      return {
        recommended: 'docker',
        reasoning: 'Docker provides best cost/performance. 2-3 containers with auto-scaling.',
        monthlyCost: docker.optimized
      }
    }

    return {
      recommended: 'kubernetes',
      reasoning: 'Kubernetes enables spot instances (70%) + on-demand (30%) for cost savings with scale.',
      monthlyCost: kubernetes.optimized
    }
  }

  /**
   * Calculate total cost savings across all modes
   */
  static globalCostSavings(): {
    allModes: CostMetrics[]
    totalBaseline: number
    totalOptimized: number
    globalSavings: number
    globalPercentReduction: number
    yearlySavings: number
  } {
    const browser = this.analyzeBrowserCost()
    const standalone = this.analyzeStandaloneCost()
    const docker = this.analyzeDockerCost()
    const kubernetes = this.analyzeKubernetesCost()

    const allModes = [browser, standalone, docker, kubernetes]
    const totalBaseline = allModes.reduce((sum, m) => sum + m.baseline, 0)
    const totalOptimized = allModes.reduce((sum, m) => sum + m.optimized, 0)
    const globalSavings = totalBaseline - totalOptimized
    const yearlySavings = globalSavings * 12

    return {
      allModes,
      totalBaseline,
      totalOptimized,
      globalSavings,
      globalPercentReduction: globalSavings / totalBaseline,
      yearlySavings
    }
  }

  /**
   * Cost optimization recommendations
   */
  static generateOptimizations(): Array<{
    category: string
    optimization: string
    savings: number
    effort: 'easy' | 'medium' | 'hard'
    timeToImplement: string
  }> {
    return [
      {
        category: 'Compute',
        optimization: 'Use spot instances for non-critical workloads (70% discount)',
        savings: 200,
        effort: 'easy',
        timeToImplement: '1 hour'
      },
      {
        category: 'Storage',
        optimization: 'Implement tiered storage (hot/warm/cold) based on access patterns',
        savings: 80,
        effort: 'medium',
        timeToImplement: '4 hours'
      },
      {
        category: 'Network',
        optimization: 'Use CloudFront/CDN for static formula responses (50% egress reduction)',
        savings: 60,
        effort: 'easy',
        timeToImplement: '2 hours'
      },
      {
        category: 'Monitoring',
        optimization: 'Implement metric sampling (99% percentile instead of all data)',
        savings: 40,
        effort: 'medium',
        timeToImplement: '3 hours'
      },
      {
        category: 'Logging',
        optimization: 'Log aggregation with sampling (errors only in prod)',
        savings: 30,
        effort: 'easy',
        timeToImplement: '2 hours'
      },
      {
        category: 'Database',
        optimization: 'Use read replicas with cross-region replication for multi-AZ',
        savings: 100,
        effort: 'hard',
        timeToImplement: '8 hours'
      },
      {
        category: 'Reserved Capacity',
        optimization: '1-year reserved instances (40% discount on baseline)',
        savings: 150,
        effort: 'easy',
        timeToImplement: '30 minutes'
      },
      {
        category: 'Compression',
        optimization: 'Gzip all formula responses (reduce egress 60%)',
        savings: 25,
        effort: 'easy',
        timeToImplement: '1 hour'
      }
    ]
  }

  /**
   * Cost tracking formula
   * Monthly cost = f(traffic, storage, compute, network)
   */
  static calculateMonthlyForecast(
    expectedQueriesPerDay: number,
    storageGB: number,
    computeHours: number,
    networkTB: number
  ): {
    baselineCost: number
    optimizedCost: number
    savings: number
  } {
    // Formulas derived from AWS pricing
    const queryCost = (expectedQueriesPerDay / 1000000) * 0.20 // $0.20 per M queries
    const storageCost = (storageGB / 1024) * 20 // $20 per TB/month
    const computeCost = computeHours * 0.032 // t3.small ≈ $0.032/hour
    const networkCost = networkTB * 20 // $20 per TB egress

    const baselineCost = (queryCost + storageCost + computeCost + networkCost) * 30 // Monthly

    // Optimized: 40% reduction through optimizations
    const optimizedCost = baselineCost * 0.6

    return {
      baselineCost,
      optimizedCost,
      savings: baselineCost - optimizedCost
    }
  }

  /**
   * Cost-benefit analysis for formula optimization
   */
  static analyzeCostBenefit(formulaId: string, optimizationSavings: number, developmentCost: number): {
    paybackPeriodDays: number
    yearOneROI: number
    recommendation: string
  } {
    const dailySavings = optimizationSavings / 30
    const paybackPeriodDays = developmentCost / dailySavings
    const yearOneROI = ((optimizationSavings * 12 - developmentCost) / developmentCost) * 100

    let recommendation = ''
    if (paybackPeriodDays < 7) {
      recommendation = '✅ Implement immediately (payback < 1 week)'
    } else if (paybackPeriodDays < 30) {
      recommendation = '✅ Implement soon (payback < 1 month)'
    } else if (paybackPeriodDays < 90) {
      recommendation = '⏳ Consider for next quarter'
    } else {
      recommendation = '❌ Low ROI, defer unless strategic'
    }

    return {
      paybackPeriodDays,
      yearOneROI,
      recommendation
    }
  }
}

export const costOptimization = new CostOptimization()
