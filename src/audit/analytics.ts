/**
 * QPU Audit Analytics & Reporting
 *
 * Full analytics pipeline for compliance assessments:
 * - Compliance metrics aggregation
 * - Risk scoring and trend analysis
 * - Gap identification and prioritization
 * - Cross-framework correlation analysis
 * - Maturity level tracking
 * - Recommendations generation and tracking
 */

import type { AuditResult } from './audit-formulas.js'

// ============================================================================
// ANALYTICS DATA STRUCTURES
// ============================================================================

export interface AuditMetrics {
  totalAssessments: number
  averageScore: number
  complianceBreakdown: Record<string, number>
  standardsBreakdown: Record<string, number>
  vectorEquilibrium: Record<string, number>
  riskDistribution: Record<string, number>
  gapAnalysis: GapMetrics
  maturityAnalysis: MaturityMetrics
  trendAnalysis: TrendMetrics
}

export interface GapMetrics {
  totalGaps: number
  criticalGaps: number
  highRiskGaps: number
  mediumRiskGaps: number
  lowRiskGaps: number
  gapsByFramework: Record<string, number>
  gapsBySeverity: Record<string, string[]>
  automationOpportunities: number
}

export interface MaturityMetrics {
  overallMaturityLevel: number
  frameworkMaturity: Record<string, number>
  standardsMaturity: Record<string, number>
  octantMaturity: Record<string, number>
  maturityProgression: number[]
}

export interface TrendMetrics {
  complianceVelocity: number
  riskTrendDirection: 'improving' | 'stable' | 'degrading'
  forecastedScore: number
  improvementOpportunities: string[]
  criticalPriorities: string[]
}

export interface ComplianceReport {
  organizationName: string
  auditDate: string
  reportPeriod: string
  executive_summary: ExecutiveSummary
  detailed_metrics: AuditMetrics
  risk_assessment: RiskAssessment
  framework_analysis: FrameworkAnalysis[]
  standards_analysis: StandardsAnalysis[]
  recommendations: Recommendation[]
  action_plan: ActionPlan
  compliance_roadmap: ComplianceRoadmap
}

export interface ExecutiveSummary {
  overallComplianceScore: number
  complianceVerdic: string
  keyFindings: string[]
  topRisks: string[]
  recommendedActions: string[]
}

export interface RiskAssessment {
  overallRiskScore: number
  riskLevel: 'critical' | 'high' | 'medium' | 'low'
  risksByCategory: Record<string, { score: number; level: string }>
  exposureAnalysis: string[]
  mitigationStatus: Record<string, number>
}

export interface FrameworkAnalysis {
  frameworkId: string
  frameworkName: string
  complianceScore: number
  requirementsMet: number
  totalRequirements: number
  criticalGaps: string[]
  automationOpportunities: string[]
  estimatedRemediationDays: number
  riskContribution: number
}

export interface StandardsAnalysis {
  standardId: string
  standardName: string
  maturityLevel: number
  controlScore: number
  totalControls: number
  readinessPercentage: number
  implementationGaps: string[]
  prioritizedControls: string[]
  estimatedComplianceCost: number
}

export interface Recommendation {
  id: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  category: string
  title: string
  description: string
  affectedFrameworks: string[]
  affectedStandards: string[]
  estimatedEffort: string
  expectedImpact: number
  timeline: string
  owner: string
}

export interface ActionPlan {
  quarter1: Action[]
  quarter2: Action[]
  quarter3: Action[]
  quarter4: Action[]
}

export interface Action {
  id: string
  title: string
  description: string
  owner: string
  dueDate: string
  priority: string
  estimatedDays: number
  successCriteria: string[]
}

export interface ComplianceRoadmap {
  currentState: string
  sixMonthGoals: string[]
  oneYearGoals: string[]
  keyMilestones: Milestone[]
  investmentRequired: number
  expectedOutcome: string
}

export interface Milestone {
  date: string
  description: string
  expectedComplianceScore: number
  successIndicators: string[]
}

// ============================================================================
// ANALYTICS ENGINE
// ============================================================================

export class AuditAnalytics {
  private assessments: any[] = []
  private historicalData: Map<string, AuditMetrics[]> = new Map()

  /**
   * Add assessment to analytics pipeline
   */
  addAssessment(assessment: any): void {
    this.assessments.push({
      ...assessment,
      timestamp: Date.now()
    })
  }

  /**
   * Compute comprehensive metrics from assessments
   */
  computeMetrics(assessments: any[]): AuditMetrics {
    if (assessments.length === 0) {
      return this.emptyMetrics()
    }

    const scores = assessments.map((a: any) => a.report?.summary?.overallScore || 0)
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length

    const complianceBreakdown = this.analyzeComplianceScores(assessments)
    const standardsBreakdown = this.analyzeStandardsScores(assessments)
    const riskDistribution = this.analyzeRiskDistribution(assessments)
    const gapAnalysis = this.performGapAnalysis(assessments)
    const maturityAnalysis = this.analyzeMaturity(assessments)
    const trendAnalysis = this.analyzeTrends(assessments)
    const vectorEquilibrium = this.analyzeVectorEquilibrium(assessments)

    return {
      totalAssessments: assessments.length,
      averageScore,
      complianceBreakdown,
      standardsBreakdown,
      vectorEquilibrium,
      riskDistribution,
      gapAnalysis,
      maturityAnalysis,
      trendAnalysis
    }
  }

  /**
   * Analyze compliance framework scores
   */
  private analyzeComplianceScores(assessments: any[]): Record<string, number> {
    const breakdown: Record<string, number> = {}
    const frameworks = ['gdpr', 'hipaa', 'soc2', 'iso27001', 'pci-dss', 'ccpa']

    frameworks.forEach(fw => {
      const scores = assessments
        .filter((a: any) => a.assessment?.[`audit:${fw}`])
        .map((a: any) => a.assessment?.[`audit:${fw}`]?.score || 0)

      breakdown[fw] = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
    })

    return breakdown
  }

  /**
   * Analyze industry standards scores
   */
  private analyzeStandardsScores(assessments: any[]): Record<string, number> {
    const breakdown: Record<string, number> = {}
    const standards = ['nist-csf', 'cis-controls', 'owasp-asvs', 'slsa', 'cncf-security']

    standards.forEach(std => {
      const scores = assessments
        .filter((a: any) => a.assessment?.[`audit:supply-chain`]?.riskScore)
        .map((a: any) => 100 - (a.assessment?.[`audit:supply-chain`]?.riskScore || 0))

      breakdown[std] = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
    })

    return breakdown
  }

  /**
   * Analyze risk distribution across audit domains
   */
  private analyzeRiskDistribution(assessments: any[]): Record<string, number> {
    const distribution: Record<string, number> = {}
    const domains = [
      'governance',
      'identity',
      'dataProtection',
      'infrastructure',
      'applications',
      'monitoring',
      'incidentResponse',
      'supplyChain'
    ]

    domains.forEach(domain => {
      const risks = assessments
        .map((a: any) => {
          const octant = a.assessment?.equilibrium?.octants?.[domain] || 50
          return 100 - octant // Convert score to risk
        })

      distribution[domain] = risks.length > 0 ? risks.reduce((a, b) => a + b, 0) / risks.length : 50
    })

    return distribution
  }

  /**
   * Perform gap analysis across frameworks
   */
  private performGapAnalysis(assessments: any[]): GapMetrics {
    const allGaps: string[] = []
    const gapsByFramework: Record<string, number> = {}
    const gapsBySeverity: Record<string, string[]> = {
      critical: [],
      high: [],
      medium: [],
      low: []
    }

    assessments.forEach((a: any) => {
      ;['gdpr', 'hipaa', 'soc2', 'iso27001', 'pci-dss'].forEach(fw => {
        const gaps = a.assessment?.[`audit:${fw}`]?.gaps || []
        const count = gaps.length
        gapsByFramework[fw] = (gapsByFramework[fw] || 0) + count
        allGaps.push(...gaps)

        // Classify by severity
        if (count > 5) gapsBySeverity.critical.push(`${fw}: ${count} gaps`)
        else if (count > 3) gapsBySeverity.high.push(`${fw}: ${count} gaps`)
        else if (count > 1) gapsBySeverity.medium.push(`${fw}: ${count} gaps`)
        else gapsBySeverity.low.push(`${fw}: ${count} gaps`)
      })
    })

    const criticalGaps = gapsBySeverity.critical.length
    const highRiskGaps = gapsBySeverity.high.length
    const mediumRiskGaps = gapsBySeverity.medium.length
    const lowRiskGaps = gapsBySeverity.low.length

    return {
      totalGaps: allGaps.length,
      criticalGaps,
      highRiskGaps,
      mediumRiskGaps,
      lowRiskGaps,
      gapsByFramework,
      gapsBySeverity,
      automationOpportunities: Math.round(allGaps.length * 0.65) // ~65% automatable
    }
  }

  /**
   * Analyze maturity levels
   */
  private analyzeMaturity(assessments: any[]): MaturityMetrics {
    const frameworkMaturity: Record<string, number> = {}
    const standardsMaturity: Record<string, number> = {}
    const octantMaturity: Record<string, number> = {}

    assessments.forEach((a: any) => {
      ;['gdpr', 'hipaa', 'soc2', 'iso27001'].forEach(fw => {
        const score = a.assessment?.[`audit:${fw}`]?.score || 0
        frameworkMaturity[fw] = Math.ceil((score / 100) * 5) // 5 maturity levels
      })

      const octants = a.assessment?.equilibrium?.octants || {}
      Object.entries(octants).forEach(([name, score]: [string, any]) => {
        octantMaturity[name] = Math.ceil((score / 100) * 5)
      })
    })

    const overallMaturity = Math.round(
      (Object.values(frameworkMaturity).reduce((a, b) => a + b, 0) || 0) /
        Math.max(1, Object.keys(frameworkMaturity).length)
    )

    return {
      overallMaturityLevel: overallMaturity,
      frameworkMaturity,
      standardsMaturity,
      octantMaturity,
      maturityProgression: [1, 2, 3, 4, 5] // Planned progression
    }
  }

  /**
   * Analyze trends and forecasts
   */
  private analyzeTrends(assessments: any[]): TrendMetrics {
    const scores = assessments.map((a: any) => a.report?.summary?.overallScore || 0)
    const recentScores = scores.slice(-3)

    let riskTrendDirection: 'improving' | 'stable' | 'degrading' = 'stable'
    if (recentScores.length > 1) {
      const change = recentScores[recentScores.length - 1] - recentScores[0]
      if (change > 5) riskTrendDirection = 'improving'
      else if (change < -5) riskTrendDirection = 'degrading'
    }

    const velocity = recentScores.length > 1 ? (recentScores[recentScores.length - 1] - recentScores[0]) / (recentScores.length - 1) : 0
    const forecastedScore = Math.min(100, (scores[scores.length - 1] || 0) + velocity * 2)

    return {
      complianceVelocity: velocity,
      riskTrendDirection,
      forecastedScore: Math.round(forecastedScore),
      improvementOpportunities: this.identifyImprovements(assessments),
      criticalPriorities: this.identifyPriorities(assessments)
    }
  }

  /**
   * Analyze vector equilibrium across assessments
   */
  private analyzeVectorEquilibrium(assessments: any[]): Record<string, number> {
    const equilibrium: Record<string, number> = {}
    const domains = [
      'governance',
      'identity',
      'dataProtection',
      'infrastructure',
      'applications',
      'monitoring',
      'incidentResponse',
      'supplyChain'
    ]

    domains.forEach(domain => {
      const scores = assessments.map((a: any) => a.assessment?.equilibrium?.octants?.[domain] || 50)
      equilibrium[domain] = Math.round(scores.reduce((a, b) => a + b, 0) / Math.max(1, scores.length))
    })

    return equilibrium
  }

  /**
   * Identify improvement opportunities
   */
  private identifyImprovements(assessments: any[]): string[] {
    const opportunities: string[] = []
    const lowestScores = this.findLowestScores(assessments)

    lowestScores.forEach(({ framework, score }) => {
      if (score < 50) {
        opportunities.push(`Improve ${framework} compliance from ${score}% to 75%+`)
      } else if (score < 75) {
        opportunities.push(`Enhance ${framework} controls to reach 85%+ compliance`)
      }
    })

    return opportunities
  }

  /**
   * Identify critical priorities
   */
  private identifyPriorities(assessments: any[]): string[] {
    const priorities: string[] = []
    const gapDensity = this.calculateGapDensity(assessments)

    Object.entries(gapDensity).forEach(([framework, density]: [string, any]) => {
      if (density > 0.6) {
        priorities.push(`CRITICAL: Resolve ${framework} compliance gaps (${Math.round(density * 100)}% non-compliance)`)
      }
    })

    return priorities.slice(0, 5)
  }

  /**
   * Calculate gap density by framework
   */
  private calculateGapDensity(assessments: any[]): Record<string, number> {
    const density: Record<string, number> = {}

    assessments.forEach((a: any) => {
      ;['gdpr', 'hipaa', 'soc2', 'iso27001', 'pci-dss'].forEach(fw => {
        const score = a.assessment?.[`audit:${fw}`]?.score || 0
        density[fw] = (density[fw] || 0) + (100 - score) / 100
      })
    })

    Object.keys(density).forEach(fw => {
      density[fw] = density[fw] / Math.max(1, assessments.length)
    })

    return density
  }

  /**
   * Find lowest scoring frameworks
   */
  private findLowestScores(assessments: any[]): Array<{ framework: string; score: number }> {
    const scores: Record<string, number[]> = {}

    assessments.forEach((a: any) => {
      ;['gdpr', 'hipaa', 'soc2', 'iso27001', 'pci-dss'].forEach(fw => {
        if (!scores[fw]) scores[fw] = []
        scores[fw].push(a.assessment?.[`audit:${fw}`]?.score || 0)
      })
    })

    return Object.entries(scores)
      .map(([framework, values]) => ({
        framework,
        score: values.reduce((a, b) => a + b, 0) / values.length
      }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 5)
  }

  /**
   * Empty metrics template
   */
  private emptyMetrics(): AuditMetrics {
    return {
      totalAssessments: 0,
      averageScore: 0,
      complianceBreakdown: {},
      standardsBreakdown: {},
      vectorEquilibrium: {},
      riskDistribution: {},
      gapAnalysis: {
        totalGaps: 0,
        criticalGaps: 0,
        highRiskGaps: 0,
        mediumRiskGaps: 0,
        lowRiskGaps: 0,
        gapsByFramework: {},
        gapsBySeverity: { critical: [], high: [], medium: [], low: [] },
        automationOpportunities: 0
      },
      maturityAnalysis: {
        overallMaturityLevel: 1,
        frameworkMaturity: {},
        standardsMaturity: {},
        octantMaturity: {},
        maturityProgression: []
      },
      trendAnalysis: {
        complianceVelocity: 0,
        riskTrendDirection: 'stable',
        forecastedScore: 0,
        improvementOpportunities: [],
        criticalPriorities: []
      }
    }
  }

  /**
   * Generate comprehensive compliance report
   */
  generateReport(organizationName: string, assessments: any[]): ComplianceReport {
    const metrics = this.computeMetrics(assessments)
    const riskAssessment = this.generateRiskAssessment(metrics)
    const frameworkAnalysis = this.analyzeFrameworks(assessments)
    const standardsAnalysis = this.analyzeStandards(assessments)
    const recommendations = this.generateRecommendations(metrics, frameworkAnalysis, standardsAnalysis)

    const overallScore = Math.round(metrics.averageScore)
    const verdict =
      overallScore >= 85 ? '✅ COMPLIANT' : overallScore >= 70 ? '⚠️ PARTIAL COMPLIANCE' : '❌ NON-COMPLIANT'

    return {
      organizationName,
      auditDate: new Date().toISOString(),
      reportPeriod: 'Q4 2026',
      executive_summary: {
        overallComplianceScore: overallScore,
        complianceVerdic: verdict,
        keyFindings: this.extractKeyFindings(metrics),
        topRisks: this.identifyTopRisks(metrics),
        recommendedActions: recommendations.slice(0, 3).map(r => r.title)
      },
      detailed_metrics: metrics,
      risk_assessment: riskAssessment,
      framework_analysis: frameworkAnalysis,
      standards_analysis: standardsAnalysis,
      recommendations,
      action_plan: this.generateActionPlan(recommendations),
      compliance_roadmap: this.generateRoadmap(metrics, organizationName)
    }
  }

  private generateRiskAssessment(metrics: AuditMetrics): RiskAssessment {
    const overallRiskScore = 100 - metrics.averageScore
    const riskLevel: 'critical' | 'high' | 'medium' | 'low' =
      overallRiskScore > 60 ? 'critical' : overallRiskScore > 40 ? 'high' : overallRiskScore > 20 ? 'medium' : 'low'

    return {
      overallRiskScore: Math.round(overallRiskScore),
      riskLevel,
      risksByCategory: Object.entries(metrics.riskDistribution).reduce(
        (acc, [cat, score]: [string, any]) => ({
          ...acc,
          [cat]: {
            score: Math.round(score),
            level: score > 60 ? 'high' : score > 40 ? 'medium' : 'low'
          }
        }),
        {}
      ),
      exposureAnalysis: this.analyzeExposures(metrics),
      mitigationStatus: this.calculateMitigation(metrics)
    }
  }

  private analyzeFrameworks(assessments: any[]): FrameworkAnalysis[] {
    return ['gdpr', 'hipaa', 'soc2', 'iso27001', 'pci-dss'].map(fwId => {
      const scores = assessments.map((a: any) => a.assessment?.[`audit:${fwId}`]?.score || 0)
      const avgScore = scores.reduce((a, b) => a + b, 0) / Math.max(1, scores.length)
      const gaps = assessments.flatMap((a: any) => a.assessment?.[`audit:${fwId}`]?.gaps || [])

      return {
        frameworkId: fwId,
        frameworkName: fwId.toUpperCase(),
        complianceScore: Math.round(avgScore),
        requirementsMet: Math.round((avgScore / 100) * 20), // Assuming 20 requirements
        totalRequirements: 20,
        criticalGaps: gaps.slice(0, 3),
        automationOpportunities: gaps.slice(0, Math.round(gaps.length * 0.65)),
        estimatedRemediationDays: Math.round((100 - avgScore) / 5),
        riskContribution: (100 - avgScore) * 0.01
      }
    })
  }

  private analyzeStandards(assessments: any[]): StandardsAnalysis[] {
    return ['nist-csf', 'cis-controls', 'owasp-asvs', 'slsa'].map(stdId => {
      const scores = assessments.map((a: any) => a.assessment?.equilibrium?.octants?.governance || 50)
      const avgScore = scores.reduce((a, b) => a + b, 0) / Math.max(1, scores.length)

      return {
        standardId: stdId,
        standardName: stdId.replace('-', ' ').toUpperCase(),
        maturityLevel: Math.ceil((avgScore / 100) * 5),
        controlScore: Math.round(avgScore),
        totalControls: 15,
        readinessPercentage: Math.round((avgScore / 100) * 100),
        implementationGaps: [`Gap 1 for ${stdId}`, `Gap 2 for ${stdId}`],
        prioritizedControls: ['Control-1', 'Control-2', 'Control-3'],
        estimatedComplianceCost: Math.round((100 - avgScore) * 5000)
      }
    })
  }

  private generateRecommendations(
    metrics: AuditMetrics,
    frameworks: FrameworkAnalysis[],
    standards: StandardsAnalysis[]
  ): Recommendation[] {
    const recommendations: Recommendation[] = []

    // High-priority recommendations from low-scoring frameworks
    frameworks.forEach(fw => {
      if (fw.complianceScore < 75) {
        recommendations.push({
          id: `rec-${fw.frameworkId}`,
          priority: fw.complianceScore < 50 ? 'critical' : 'high',
          category: 'Compliance',
          title: `Improve ${fw.frameworkName} Compliance`,
          description: `Current score: ${fw.complianceScore}%. Address ${fw.criticalGaps.length} critical gaps.`,
          affectedFrameworks: [fw.frameworkId],
          affectedStandards: [],
          estimatedEffort: `${fw.estimatedRemediationDays} days`,
          expectedImpact: fw.complianceScore < 50 ? 0.3 : 0.2,
          timeline: '90 days',
          owner: 'Compliance Team'
        })
      }
    })

    // Access control improvements
    if ((metrics.riskDistribution['identity'] || 50) > 40) {
      recommendations.push({
        id: 'rec-identity',
        priority: 'high',
        category: 'Access Control',
        title: 'Strengthen Identity & Access Management',
        description: 'Implement MFA, enhance RBAC, deploy PAM',
        affectedFrameworks: ['gdpr', 'hipaa', 'iso27001'],
        affectedStandards: ['nist-csf', 'cis-controls'],
        estimatedEffort: '60-90 days',
        expectedImpact: 0.25,
        timeline: '90 days',
        owner: 'Security Team'
      })
    }

    // Encryption improvements
    if ((metrics.riskDistribution['dataProtection'] || 50) > 40) {
      recommendations.push({
        id: 'rec-encryption',
        priority: 'high',
        category: 'Data Protection',
        title: 'Enhance Data Encryption Strategy',
        description: 'Enable encryption at rest and in transit, implement DLP',
        affectedFrameworks: ['gdpr', 'ccpa', 'hipaa'],
        affectedStandards: ['owasp-asvs'],
        estimatedEffort: '30-45 days',
        expectedImpact: 0.2,
        timeline: '60 days',
        owner: 'Security Team'
      })
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
      return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]
    })
  }

  private generateActionPlan(recommendations: Recommendation[]): ActionPlan {
    return {
      quarter1: recommendations.slice(0, 3).map((r, i) => ({
        id: `action-q1-${i}`,
        title: r.title,
        description: r.description,
        owner: r.owner,
        dueDate: '2027-03-31',
        priority: r.priority,
        estimatedDays: parseInt(r.estimatedEffort) || 30,
        successCriteria: [`Reduce ${r.category} risk by ${Math.round(r.expectedImpact * 100)}%`]
      })),
      quarter2: recommendations.slice(3, 6).map((r, i) => ({
        id: `action-q2-${i}`,
        title: r.title,
        description: r.description,
        owner: r.owner,
        dueDate: '2027-06-30',
        priority: r.priority,
        estimatedDays: parseInt(r.estimatedEffort) || 30,
        successCriteria: [`Complete ${r.title}`]
      })),
      quarter3: [],
      quarter4: []
    }
  }

  private generateRoadmap(metrics: AuditMetrics, organizationName: string): ComplianceRoadmap {
    return {
      currentState: `${Math.round(metrics.averageScore)}% compliant across major frameworks`,
      sixMonthGoals: ['Achieve 80%+ compliance across all major frameworks', 'Reduce critical gaps by 75%', 'Implement automated compliance monitoring'],
      oneYearGoals: [
        'Achieve 90%+ compliance',
        'Attain ISO 27001 certification',
        'Implement continuous compliance (DevSecOps)',
        'Establish internal audit program'
      ],
      keyMilestones: [
        {
          date: '2027-01-31',
          description: 'Complete identity & access control improvements',
          expectedComplianceScore: 75,
          successIndicators: ['MFA enabled', 'RBAC implemented', 'PAM deployed']
        },
        {
          date: '2027-03-31',
          description: 'Enhance data protection and encryption',
          expectedComplianceScore: 80,
          successIndicators: ['Encryption at rest', 'Encryption in transit', 'DLP enabled']
        },
        {
          date: '2027-06-30',
          description: 'ISO 27001 certification achieved',
          expectedComplianceScore: 85,
          successIndicators: ['Full ISMS implementation', 'Third-party audit passed']
        },
        {
          date: '2027-12-31',
          description: 'Continuous compliance program operational',
          expectedComplianceScore: 90,
          successIndicators: ['Automated monitoring', 'Real-time alerts', 'Quarterly assessments']
        }
      ],
      investmentRequired: Math.round((100 - metrics.averageScore) * 50000),
      expectedOutcome: `${organizationName} will achieve industry-leading compliance posture with continuous monitoring and proactive risk management.`
    }
  }

  private extractKeyFindings(metrics: AuditMetrics): string[] {
    return [
      `Overall compliance score: ${Math.round(metrics.averageScore)}%`,
      `Total gaps identified: ${metrics.gapAnalysis.totalGaps}`,
      `${metrics.gapAnalysis.criticalGaps} critical gaps requiring immediate attention`,
      `${Math.round(metrics.gapAnalysis.automationOpportunities)} gaps can be automated`,
      `Vector equilibrium: ${metrics.trendAnalysis.riskTrendDirection} trend`
    ]
  }

  private identifyTopRisks(metrics: AuditMetrics): string[] {
    const risks: Array<{ domain: string; score: number }> = Object.entries(metrics.riskDistribution).map(([domain, score]: [string, any]) => ({
      domain,
      score
    }))

    return risks
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(r => `${r.domain}: ${Math.round(r.score)}% risk`)
  }

  private analyzeExposures(metrics: AuditMetrics): string[] {
    const exposures: string[] = []

    if (metrics.riskDistribution['identity'] > 50) exposures.push('Identity & access control exposure')
    if (metrics.riskDistribution['dataProtection'] > 50) exposures.push('Data protection exposure')
    if (metrics.riskDistribution['monitoring'] > 50) exposures.push('Logging & monitoring exposure')

    return exposures
  }

  private calculateMitigation(metrics: AuditMetrics): Record<string, number> {
    return {
      identity: Math.max(0, 100 - (metrics.riskDistribution['identity'] || 0)),
      dataProtection: Math.max(0, 100 - (metrics.riskDistribution['dataProtection'] || 0)),
      infrastructure: Math.max(0, 100 - (metrics.riskDistribution['infrastructure'] || 0)),
      monitoring: Math.max(0, 100 - (metrics.riskDistribution['monitoring'] || 0))
    }
  }
}

export const auditAnalytics = new AuditAnalytics()
