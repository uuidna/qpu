// Cost analytics and optimization dashboard (WAVE 8C)

import { AnalyticsData } from '../types.js'
import { analytics } from '../analytics.js'

export interface CostBreakdown {
  operation: string
  totalCost: number
  requestCount: number
  costPerRequest: number
  percentOfTotal: number
  trend: number // percentage change from previous period
}

export interface CostOptimization {
  operation: string
  currentCostPerRequest: number
  potentialSavings: number
  optimizationStrategy: string
  estimatedNewCostPerRequest: number
  impactLevel: 'high' | 'medium' | 'low'
}

export class CostDashboard {
  // Generate cost summary
  static generateSummary(data?: AnalyticsData): {
    totalCost: number
    costByOperation: Map<string, number>
    averageCostPerRequest: number
    topCostOperations: CostBreakdown[]
    dailyProjection: number
  } {
    let totalCost = 0
    const costByOperation = new Map<string, number>()
    let totalRequests = 0

    if (data?.costData) {
      totalCost = data.costData.totalCost
      for (const [op, cost] of data.costData.operationCosts.entries()) {
        costByOperation.set(op, cost)
      }
      for (const [, opMetrics] of data.metrics.entries()) {
        totalRequests += opMetrics.count
      }
    }

    const topOperations = this.generateBreakdown(data)

    return {
      totalCost,
      costByOperation,
      averageCostPerRequest: totalRequests > 0 ? totalCost / totalRequests : 0,
      topCostOperations: topOperations.slice(0, 10),
      dailyProjection: totalCost * 24, // Assume this is hourly data
    }
  }

  // Generate cost breakdown by operation
  static generateBreakdown(data?: AnalyticsData): CostBreakdown[] {
    const breakdown: CostBreakdown[] = []

    if (!data?.costData) {
      return breakdown
    }

    let totalCost = 0
    for (const cost of data.costData.operationCosts.values()) {
      totalCost += cost
    }

    for (const [operation, cost] of data.costData.operationCosts.entries()) {
      const opMetrics = data.metrics.get(operation)
      if (opMetrics) {
        breakdown.push({
          operation,
          totalCost: cost,
          requestCount: opMetrics.count,
          costPerRequest: opMetrics.count > 0 ? cost / opMetrics.count : 0,
          percentOfTotal: totalCost > 0 ? (cost / totalCost) * 100 : 0,
          trend: 0, // Will calculate below
        })
      }
    }

    // Calculate trends from historical data
    const historical = analytics.getHistoricalData(2)
    if (historical.length >= 2) {
      const current = historical[0]?.costData || null
      const previous = historical[1]?.costData || null

      if (current && previous) {
        for (const item of breakdown) {
          const currentCost = current.operationCosts.get(item.operation) || 0
          const previousCost = previous.operationCosts.get(item.operation) || 0

          if (previousCost > 0) {
            item.trend = ((currentCost - previousCost) / previousCost) * 100
          }
        }
      }
    }

    return breakdown.sort((a, b) => b.totalCost - a.totalCost)
  }

  // Generate cost time series
  static generateCostTimeSeries(minutes: number = 60): Array<{
    timestamp: number
    totalCost: number
    costByOperation: Map<string, number>
  }> {
    const timeSeries: Array<{
      timestamp: number
      totalCost: number
      costByOperation: Map<string, number>
    }> = []

    const historical = analytics.getHistoricalData(minutes)
    for (const data of historical) {
      const costByOperation = new Map<string, number>()
      let totalCost = 0

      if (data.costData) {
        totalCost = data.costData.totalCost
        for (const [op, cost] of data.costData.operationCosts.entries()) {
          costByOperation.set(op, cost)
        }
      }

      timeSeries.push({
        timestamp: data.timestamp,
        totalCost,
        costByOperation,
      })
    }

    return timeSeries
  }

  // Identify optimization opportunities
  static identifyOptimizations(
    data?: AnalyticsData
  ): CostOptimization[] {
    const optimizations: CostOptimization[] = []

    if (!data?.costData || !data?.metrics) {
      return optimizations
    }

    for (const [operation, opMetrics] of data.metrics.entries()) {
      const cost = data.costData.operationCosts.get(operation) || 0
      const costPerRequest = opMetrics.count > 0 ? cost / opMetrics.count : 0

      // Strategy 1: Caching optimization
      if (opMetrics.avgDuration > 100) {
        const estimatedImprovement = opMetrics.avgDuration * 0.3 // 30% improvement from caching
        const newCostPerRequest = costPerRequest * (1 - estimatedImprovement / opMetrics.avgDuration)

        optimizations.push({
          operation,
          currentCostPerRequest: costPerRequest,
          potentialSavings: costPerRequest - newCostPerRequest,
          optimizationStrategy: `Implement caching to reduce latency from ${opMetrics.avgDuration.toFixed(2)}ms`,
          estimatedNewCostPerRequest: newCostPerRequest,
          impactLevel: estimatedImprovement > 50 ? 'high' : 'medium',
        })
      }

      // Strategy 2: Batching optimization
      if (opMetrics.count > 1000 && opMetrics.avgDuration < 50) {
        const batchingGain = 0.2 // 20% improvement from batching
        const newCostPerRequest = costPerRequest * (1 - batchingGain)

        optimizations.push({
          operation,
          currentCostPerRequest: costPerRequest,
          potentialSavings: costPerRequest - newCostPerRequest,
          optimizationStrategy: `Implement request batching (${(batchingGain * 100).toFixed(0)}% potential savings)`,
          estimatedNewCostPerRequest: newCostPerRequest,
          impactLevel: 'medium',
        })
      }

      // Strategy 3: Query optimization for slow operations
      if (opMetrics.avgDuration > 500 && opMetrics.errorRate < 0.01) {
        const optimizationGain = 0.4 // 40% improvement from query optimization
        const newCostPerRequest = costPerRequest * (1 - optimizationGain)

        optimizations.push({
          operation,
          currentCostPerRequest: costPerRequest,
          potentialSavings: costPerRequest - newCostPerRequest,
          optimizationStrategy: `Optimize slow queries (current avg: ${opMetrics.avgDuration.toFixed(2)}ms)`,
          estimatedNewCostPerRequest: newCostPerRequest,
          impactLevel: 'high',
        })
      }
    }

    // Sort by potential savings
    return optimizations.sort((a, b) => b.potentialSavings - a.potentialSavings)
  }

  // Generate cost forecast
  static generateCostForecast(days: number = 7): Array<{
    date: string
    projectedCost: number
    confidence: number
  }> {
    const forecast: Array<{
      date: string
      projectedCost: number
      confidence: number
    }> = []

    const historical = analytics.getHistoricalData(days * 24)
    if (historical.length < 3) {
      return forecast
    }

    // Calculate average daily cost
    const dailyCosts: number[] = []
    let currentDay = new Date(historical[0].timestamp)
    currentDay.setHours(0, 0, 0, 0)
    let dayTotal = 0

    for (const data of historical) {
      const dataDay = new Date(data.timestamp)
      dataDay.setHours(0, 0, 0, 0)

      if (dataDay.getTime() !== currentDay.getTime() && dayTotal > 0) {
        dailyCosts.push(dayTotal)
        dayTotal = 0
        currentDay = new Date(dataDay)
      }

      if (data.costData) {
        dayTotal += data.costData.totalCost
      }
    }

    if (dayTotal > 0) {
      dailyCosts.push(dayTotal)
    }

    if (dailyCosts.length < 2) {
      return forecast
    }

    // Simple linear trend
    const avgCost = dailyCosts.reduce((a, b) => a + b) / dailyCosts.length
    const trend =
      (dailyCosts[dailyCosts.length - 1] - dailyCosts[0]) /
      (dailyCosts.length - 1)

    // Generate forecast
    const now = new Date()
    for (let i = 1; i <= days; i++) {
      const forecastDate = new Date(now)
      forecastDate.setDate(forecastDate.getDate() + i)
      const projectedCost = avgCost + trend * i
      const confidence = Math.max(0.5, 1 - (i * 0.05)) // Decreasing confidence over time

      forecast.push({
        date: forecastDate.toISOString().split('T')[0],
        projectedCost: Math.max(0, projectedCost),
        confidence,
      })
    }

    return forecast
  }

  // Generate budget alerts
  static generateBudgetAlerts(budgetLimit: number): Array<{
    type: 'warning' | 'critical'
    message: string
    currentSpend: number
    budgetRemaining: number
    percentageUsed: number
    timeUntilLimit: string
  }> {
    const alerts: Array<{
      type: 'warning' | 'critical'
      message: string
      currentSpend: number
      budgetRemaining: number
      percentageUsed: number
      timeUntilLimit: string
    }> = []

    const current = analytics.getHistoricalData(1)[0]
    if (!current?.costData) {
      return alerts
    }

    const monthlyProjection = current.costData.totalCost * 24 * 30 // Assume this is hourly data
    const currentSpend = current.costData.totalCost
    const percentageUsed = (currentSpend / budgetLimit) * 100
    const budgetRemaining = budgetLimit - currentSpend

    if (percentageUsed >= 90) {
      alerts.push({
        type: 'critical',
        message: `Critical: ${percentageUsed.toFixed(1)}% of monthly budget consumed`,
        currentSpend,
        budgetRemaining,
        percentageUsed,
        timeUntilLimit: this.calculateTimeUntilLimit(
          currentSpend,
          budgetRemaining
        ),
      })
    } else if (percentageUsed >= 75) {
      alerts.push({
        type: 'warning',
        message: `Warning: ${percentageUsed.toFixed(1)}% of monthly budget consumed`,
        currentSpend,
        budgetRemaining,
        percentageUsed,
        timeUntilLimit: this.calculateTimeUntilLimit(
          currentSpend,
          budgetRemaining
        ),
      })
    }

    return alerts
  }

  // Calculate time until budget limit
  private static calculateTimeUntilLimit(spent: number, remaining: number): string {
    if (spent === 0 || remaining < 0) {
      return 'Over budget'
    }

    const ratePerHour = spent
    const hoursRemaining = remaining / ratePerHour
    const daysRemaining = hoursRemaining / 24

    if (daysRemaining < 1) {
      return `${Math.floor(hoursRemaining)}h remaining`
    } else if (daysRemaining < 30) {
      return `${Math.floor(daysRemaining)}d remaining`
    } else {
      return 'More than a month'
    }
  }
}
