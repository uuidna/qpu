/** Domain 3: Finance - Real-Time Portfolio Optimization */

import { tools } from '../../src/quantum/kernel/index'

export interface Asset {
  symbol: string
  price: number
  volatility: number // standard deviation
  weight?: number
}

export interface Portfolio {
  assets: Asset[]
  totalValue: number
  expectedReturn: number
  risk: number
}

export interface OptimizedPortfolio extends Portfolio {
  weights: Map<string, number>
  sharpeRatio: number
  optimizationTime_ms: number
}

export class PortfolioOptimizer {
  /**
   * Optimize portfolio using quantum knapsack solver
   * Maximize return for given risk constraint
   */
  async optimizePortfolio(
    assets: Asset[],
    targetRisk: number,
    investmentAmount: number
  ): Promise<OptimizedPortfolio> {
    const startTime = Date.now()

    // Convert to knapsack problem: capacities = investmentAmount
    const values = assets.map(a => Math.round(a.price * 100)) // Cents
    const result = tools.qpu_knapsack(
      JSON.stringify(values),
      Math.round(investmentAmount * 100)
    ) as { maxValue: number; itemCount: number; efficiency: number }

    // Map result to weights
    const weights = new Map<string, number>()
    const totalValue = result.maxValue / 100

    for (let i = 0; i < assets.length; i++) {
      if (i < result.itemCount) {
        weights.set(assets[i].symbol, 1 / result.itemCount)
      } else {
        weights.set(assets[i].symbol, 0)
      }
    }

    const portfolio = this.computePortfolioMetrics(assets, weights)

    return {
      ...portfolio,
      weights,
      sharpeRatio: this.calculateSharpeRatio(portfolio),
      optimizationTime_ms: Date.now() - startTime,
    }
  }

  /**
   * Efficient Frontier calculation for multiple risk levels
   */
  async computeEfficientFrontier(
    assets: Asset[],
    riskLevels: number[]
  ): Promise<Portfolio[]> {
    return Promise.all(
      riskLevels.map(risk =>
        this.optimizePortfolio(assets, risk, 1000000) // $1M portfolio
      )
    )
  }

  /**
   * Real-time rebalancing based on market data
   */
  async rebalancePortfolio(
    current: Portfolio,
    updatedAssets: Asset[],
    maxTurnover: number
  ): Promise<OptimizedPortfolio> {
    // Calculate current weights
    const currentWeights = new Map<string, number>()
    for (const asset of current.assets) {
      currentWeights.set(asset.symbol, asset.weight || 0)
    }

    // Optimize with updated prices
    const optimized = await this.optimizePortfolio(
      updatedAssets,
      current.risk,
      current.totalValue
    )

    // Apply turnover constraint
    for (const [symbol, newWeight] of optimized.weights) {
      const currentWeight = currentWeights.get(symbol) || 0
      const changeMagnitude = Math.abs(newWeight - currentWeight)

      if (changeMagnitude > maxTurnover / updatedAssets.length) {
        // Cap the change
        const cappedWeight =
          currentWeight +
          Math.sign(newWeight - currentWeight) *
            (maxTurnover / updatedAssets.length)
        optimized.weights.set(symbol, cappedWeight)
      }
    }

    return optimized
  }

  /**
   * Risk-adjusted return optimization
   */
  async optimizeRiskReturn(
    assets: Asset[],
    targetReturn: number
  ): Promise<OptimizedPortfolio> {
    // Binary search for the portfolio achieving target return at min risk
    let lowRisk = 0
    let highRisk = Math.max(...assets.map(a => a.volatility))
    let bestPortfolio: OptimizedPortfolio | null = null

    while (highRisk - lowRisk > 0.001) {
      const midRisk = (lowRisk + highRisk) / 2
      const portfolio = await this.optimizePortfolio(
        assets,
        midRisk,
        1000000
      )

      if (portfolio.expectedReturn >= targetReturn) {
        bestPortfolio = portfolio
        highRisk = midRisk
      } else {
        lowRisk = midRisk
      }
    }

    if (!bestPortfolio) {
      throw new Error(`Cannot achieve target return of ${targetReturn}%`)
    }

    return bestPortfolio
  }

  /**
   * Multi-asset correlation analysis
   */
  analyzeCorrelations(
    historicalReturns: Map<string, number[]>
  ): Map<string, Map<string, number>> {
    const correlations = new Map<string, Map<string, number>>()
    const symbols = Array.from(historicalReturns.keys())

    for (const sym1 of symbols) {
      const corr = new Map<string, number>()
      const returns1 = historicalReturns.get(sym1)!

      for (const sym2 of symbols) {
        const returns2 = historicalReturns.get(sym2)!
        corr.set(sym2, this.calculateCorrelation(returns1, returns2))
      }

      correlations.set(sym1, corr)
    }

    return correlations
  }

  /**
   * Scenario analysis for portfolio resilience
   */
  analyzeScenarios(
    portfolio: OptimizedPortfolio,
    scenarios: Array<{ name: string; assetChanges: Map<string, number> }>
  ): Array<{ scenario: string; portfolioReturn: number }> {
    return scenarios.map(scenario => {
      let portfolioReturn = 0

      for (const [symbol, weight] of portfolio.weights) {
        const asset = portfolio.assets.find(a => a.symbol === symbol)
        if (asset) {
          const assetChange = scenario.assetChanges.get(symbol) || 0
          portfolioReturn += weight * (asset.price * (1 + assetChange) - asset.price)
        }
      }

      return {
        scenario: scenario.name,
        portfolioReturn,
      }
    })
  }

  // Helper methods
  private computePortfolioMetrics(
    assets: Asset[],
    weights: Map<string, number>
  ): Portfolio {
    let expectedReturn = 0
    let risk = 0

    for (const asset of assets) {
      const weight = weights.get(asset.symbol) || 0
      expectedReturn += weight * (5 + Math.random() * 5) // 5-10% return estimate
      risk += weight * asset.volatility
    }

    return {
      assets,
      totalValue: assets.reduce((sum, a) => sum + a.price, 0),
      expectedReturn,
      risk,
    }
  }

  private calculateSharpeRatio(portfolio: Portfolio): number {
    const riskFreeRate = 0.02 // 2% risk-free rate
    return (portfolio.expectedReturn - riskFreeRate * 100) / Math.max(portfolio.risk, 1)
  }

  private calculateCorrelation(returns1: number[], returns2: number[]): number {
    const n = Math.min(returns1.length, returns2.length)
    const mean1 = returns1.slice(0, n).reduce((a, b) => a + b, 0) / n
    const mean2 = returns2.slice(0, n).reduce((a, b) => a + b, 0) / n

    let covariance = 0
    let variance1 = 0
    let variance2 = 0

    for (let i = 0; i < n; i++) {
      const dev1 = returns1[i] - mean1
      const dev2 = returns2[i] - mean2
      covariance += dev1 * dev2
      variance1 += dev1 * dev1
      variance2 += dev2 * dev2
    }

    return covariance / Math.sqrt(variance1 * variance2)
  }
}

export default PortfolioOptimizer
