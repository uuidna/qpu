/**
 * Cost Optimization MCP Operations
 * Control deployment costs through formulas
 */

import { costOptimization, CostOptimization } from './cost-optimization.js'

/**
 * Analyze costs for all 4 deployment modes
 */
export async function costAnalyzeAllModes(): Promise<{
  ok: boolean
  modes: Array<{ mode: string; baseline: number; optimized: number; savings: number; percentReduction: number }>
  totalBaseline: number
  totalOptimized: number
  totalSavings: number
}> {
  const browser = CostOptimization.analyzeBrowserCost()
  const standalone = CostOptimization.analyzeStandaloneCost()
  const docker = CostOptimization.analyzeDockerCost()
  const kubernetes = CostOptimization.analyzeKubernetesCost()

  const modes = [browser, standalone, docker, kubernetes]
  const totalBaseline = modes.reduce((sum, m) => sum + m.baseline, 0)
  const totalOptimized = modes.reduce((sum, m) => sum + m.optimized, 0)
  const totalSavings = totalBaseline - totalOptimized

  return {
    ok: true,
    modes: modes.map(m => ({
      mode: m.mode,
      baseline: Math.round(m.baseline),
      optimized: Math.round(m.optimized),
      savings: Math.round(m.savings),
      percentReduction: Math.round(m.percentReduction * 100) / 100
    })),
    totalBaseline: Math.round(totalBaseline),
    totalOptimized: Math.round(totalOptimized),
    totalSavings: Math.round(totalSavings)
  }
}

/**
 * Get cost per formula execution
 */
export async function costPerFormulaExecution(mode: string): Promise<{
  ok: boolean
  mode: string
  formulas: Array<{ formula: string; costPerExecution: number; costPerDay: number; costPerMonth: number }>
}> {
  const validMode = mode as 'browser' | 'standalone' | 'docker' | 'kubernetes'
  const formulas = CostOptimization.costPerExecution(validMode)

  return {
    ok: true,
    mode,
    formulas: formulas.map((f: any) => ({
      formula: f.formula,
      costPerExecution: Number((f.costPerExecution * 1000000).toFixed(4)), // Micro-cents
      costPerDay: Math.round(f.costPerDay * 100) / 100,
      costPerMonth: Math.round(f.costPerMonth * 100) / 100
    }))
  }
}

/**
 * Recommend cheapest deployment mode
 */
export async function costRecommendMode(traffic: string): Promise<{
  ok: boolean
  recommended: string
  reasoning: string
  monthlyCost: number
  alternatives: Array<{ mode: string; cost: number; pros: string[]; cons: string[] }>
}> {
  const validTraffic = traffic as 'low' | 'medium' | 'high'
  const rec = CostOptimization.recommendCheapestMode(validTraffic)

  return {
    ok: true,
    recommended: rec.recommended,
    reasoning: rec.reasoning,
    monthlyCost: Math.round(rec.monthlyCost),
    alternatives:
      traffic === 'low'
        ? [
            { mode: 'standalone', cost: 118, pros: ['More powerful', 'Better for growth'], cons: ['2x cost', 'More overhead'] },
            { mode: 'docker', cost: 277, pros: ['Scalable', 'Load-balanced'], cons: ['3x cost', 'Complex management'] }
          ]
        : traffic === 'medium'
          ? [
              { mode: 'browser', cost: 42, pros: ['Ultra-cheap', 'No servers'], cons: ['Limited capacity', 'Browser only'] },
              { mode: 'kubernetes', cost: 830, pros: ['Highly scalable', 'Enterprise'], cons: ['10x cost', 'Complex'] }
            ]
          : [
              { mode: 'docker', cost: 277, pros: ['Simpler', 'Good scale'], cons: ['Less scalable than k8s'] },
              { mode: 'standalone', cost: 118, pros: ['Cheaper'], cons: ['Not for high traffic'] }
            ]
  }
}

/**
 * Calculate global savings across all modes
 */
export async function costGlobalSavings(): Promise<{
  ok: boolean
  totalBaseline: number
  totalOptimized: number
  monthlySavings: number
  yearlySavings: number
  percentReduction: number
  breakdownByMode: Record<string, { baseline: number; optimized: number; savings: number }>
}> {
  const result = CostOptimization.globalCostSavings()

  return {
    ok: true,
    totalBaseline: Math.round(result.totalBaseline),
    totalOptimized: Math.round(result.totalOptimized),
    monthlySavings: Math.round(result.globalSavings),
    yearlySavings: Math.round(result.yearlySavings),
    percentReduction: Math.round(result.globalPercentReduction * 100),
    breakdownByMode: result.allModes.reduce(
      (acc: Record<string, any>, m: any) => {
        acc[m.mode] = {
          baseline: Math.round(m.baseline),
          optimized: Math.round(m.optimized),
          savings: Math.round(m.savings)
        }
        return acc
      },
      {} as Record<string, any>
    )
  }
}

/**
 * Get cost optimization recommendations
 */
export async function costOptimizationRecommendations(): Promise<{
  ok: boolean
  recommendations: Array<{
    category: string
    optimization: string
    savings: number
    effort: string
    timeToImplement: string
  }>
  totalPotentialSavings: number
  easyWinsTotal: number
}> {
  const recs = CostOptimization.generateOptimizations()
  const totalPotentialSavings = recs.reduce((sum: number, r: any) => sum + r.savings, 0)
  const easyWinsTotal = recs.filter((r: any) => r.effort === 'easy').reduce((sum: number, r: any) => sum + r.savings, 0)

  return {
    ok: true,
    recommendations: recs,
    totalPotentialSavings,
    easyWinsTotal
  }
}

/**
 * Forecast monthly cost based on traffic
 */
export async function costForecast(
  queriesPerDay: number,
  storageGB: number,
  computeHours: number,
  networkTB: number
): Promise<{
  ok: boolean
  baselineCost: number
  optimizedCost: number
  monthlySavings: number
  yearlySavings: number
}> {
  const forecast = CostOptimization.calculateMonthlyForecast(queriesPerDay, storageGB, computeHours, networkTB)

  return {
    ok: true,
    baselineCost: Math.round(forecast.baselineCost),
    optimizedCost: Math.round(forecast.optimizedCost),
    monthlySavings: Math.round(forecast.savings),
    yearlySavings: Math.round(forecast.savings * 12)
  }
}

/**
 * Analyze cost-benefit of optimization
 */
export async function costBenefitAnalysis(formulaId: string, optimizationSavings: number, developmentCost: number): Promise<{
  ok: boolean
  formulaId: string
  paybackPeriodDays: number
  yearOneROI: number
  recommendation: string
}> {
  const analysis = CostOptimization.analyzeCostBenefit(formulaId, optimizationSavings, developmentCost)

  return {
    ok: true,
    formulaId,
    paybackPeriodDays: Math.round(analysis.paybackPeriodDays),
    yearOneROI: Math.round(analysis.yearOneROI),
    recommendation: analysis.recommendation
  }
}

/**
 * Cost optimization report
 */
export async function costReport(): Promise<{
  ok: boolean
  report: string
  summary: {
    currentMonthly: number
    optimizedMonthly: number
    savings: number
    yearlySavings: number
    roi: number
  }
}> {
  const result = CostOptimization.globalCostSavings()
  const recs = CostOptimization.generateOptimizations()

  let report = '\n💰 COST OPTIMIZATION REPORT\n'
  report += `${'='.repeat(70)}\n\n`

  report += `Current State:\n`
  for (const mode of result.allModes) {
    report += `  ${mode.mode.padEnd(15)}: $${Math.round(mode.baseline)}/mo baseline → $${Math.round(mode.optimized)}/mo optimized\n`
  }

  report += `\nTotal: $${Math.round(result.totalBaseline)}/mo → $${Math.round(result.totalOptimized)}/mo\n`
  report += `Savings: $${Math.round(result.globalSavings)}/month ($${Math.round(result.yearlySavings)}/year)\n\n`

  report += `Top Optimizations:\n`
  recs.slice(0, 5).forEach((r: any) => {
    report += `  • ${r.optimization} (+$${r.savings}/${r.effort})\n`
  })

  report += `\nTotal potential additional savings: $${recs.reduce((s: number, r: any) => s + r.savings, 0)}/month\n`
  report += `${'='.repeat(70)}\n`

  return {
    ok: true,
    report,
    summary: {
      currentMonthly: Math.round(result.totalBaseline),
      optimizedMonthly: Math.round(result.totalOptimized),
      savings: Math.round(result.globalSavings),
      yearlySavings: Math.round(result.yearlySavings),
      roi: Math.round((result.globalSavings * 12) / result.totalBaseline * 100)
    }
  }
}
