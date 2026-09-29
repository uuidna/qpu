/**
 * Phase 13a: Value Alignment Engine
 * System learns human values and checks decision alignment
 */

export interface Value {
  id: string
  name: string
  description: string
  examples: string[]
  tradeoffsWith: string[]
  priority: number // 1-10
  learned: boolean
  confidence: number // 0-1
}

export interface ValueConflict {
  value1: string
  value2: string
  severity: 'low' | 'medium' | 'high'
  recommendation: string
  needsHumanInput: boolean
}

export interface AlignmentScore {
  decision: string
  overallAlignment: number // 0-100
  alignedValues: string[]
  violatedValues: string[]
  conflicts: ValueConflict[]
  actionable: boolean
}

export class ValueAlignmentEngine {
  private values: Map<string, Value> = new Map()
  private decisionHistory: Array<{ decision: string; feedback: string; timestamp: number }> = []
  private alignmentScores: AlignmentScore[] = []

  /**
   * Initialize core values
   */
  async initializeCoreValues(): Promise<Value[]> {
    const coreValues: Value[] = [
      {
        id: 'val-safety',
        name: 'Safety',
        description: 'Prevent harm and protect systems from failure',
        examples: ['Reject changes that might break things', 'Maintain backups', 'Test before deploy'],
        tradeoffsWith: ['speed', 'cost'],
        priority: 10,
        learned: true,
        confidence: 0.95,
      },
      {
        id: 'val-fairness',
        name: 'Fairness',
        description: 'Treat users and components equally',
        examples: ['No biased decisions', 'Equal access', 'Transparent policies'],
        tradeoffsWith: ['efficiency', 'personalization'],
        priority: 9,
        learned: true,
        confidence: 0.90,
      },
      {
        id: 'val-transparency',
        name: 'Transparency',
        description: 'Explain decisions and reasoning',
        examples: ['Document decisions', 'Show audit trail', 'Explain tradeoffs'],
        tradeoffsWith: ['speed', 'privacy'],
        priority: 9,
        learned: true,
        confidence: 0.92,
      },
      {
        id: 'val-efficiency',
        name: 'Efficiency',
        description: 'Use resources wisely',
        examples: ['Optimize cost', 'Reduce waste', 'Fast decisions'],
        tradeoffsWith: ['safety', 'fairness', 'transparency'],
        priority: 7,
        learned: true,
        confidence: 0.88,
      },
      {
        id: 'val-autonomy',
        name: 'Autonomy',
        description: 'Respect user choice and control',
        examples: ['Allow overrides', 'Preserve user agency', 'Enable customization'],
        tradeoffsWith: ['efficiency', 'safety'],
        priority: 8,
        learned: true,
        confidence: 0.85,
      },
      {
        id: 'val-privacy',
        name: 'Privacy',
        description: 'Protect sensitive information',
        examples: ['Encrypt data', 'Limit access', 'Anonymize where possible'],
        tradeoffsWith: ['transparency', 'personalization'],
        priority: 9,
        learned: true,
        confidence: 0.90,
      },
    ]

    for (const value of coreValues) {
      this.values.set(value.id, value)
    }

    return coreValues
  }

  /**
   * Check decision alignment with values
   */
  async checkAlignment(decision: string, context: Record<string, any>): Promise<AlignmentScore> {
    const alignedValues: string[] = []
    const violatedValues: string[] = []
    const conflicts: ValueConflict[] = []

    // Check each value
    for (const [valueId, value] of this.values) {
      const alignment = this.evaluateValueAlignment(decision, value, context)

      if (alignment > 0.7) {
        alignedValues.push(value.name)
      } else if (alignment < 0.3) {
        violatedValues.push(value.name)
      }
    }

    // Check for conflicts
    for (const violatedId of violatedValues) {
      for (const alignedId of alignedValues) {
        const violated = this.values.get(violatedId)!
        const aligned = this.values.get(alignedId)!

        if (violated.tradeoffsWith.includes(aligned.name.toLowerCase())) {
          conflicts.push({
            value1: violated.name,
            value2: aligned.name,
            severity: 'high',
            recommendation: `${violated.name} conflicts with ${aligned.name}. Consider adjusting decision.`,
            needsHumanInput: true,
          })
        }
      }
    }

    // Calculate overall alignment
    const overallAlignment = Math.max(0, Math.min(100,
      ((alignedValues.length - violatedValues.length) / this.values.size) * 100
    ))

    const score: AlignmentScore = {
      decision,
      overallAlignment,
      alignedValues,
      violatedValues,
      conflicts,
      actionable: conflicts.length === 0 || overallAlignment >= 60,
    }

    this.alignmentScores.push(score)
    return score
  }

  /**
   * Evaluate how well decision aligns with a value
   */
  private evaluateValueAlignment(decision: string, value: Value, context: Record<string, any>): number {
    let alignment = 0.5 // neutral baseline

    // Check for value keywords in decision
    const decisionLower = decision.toLowerCase()
    for (const example of value.examples) {
      if (decisionLower.includes(example.toLowerCase())) {
        alignment += 0.2
      }
    }

    // Adjust based on context
    if (value.name === 'Safety' && context.riskLevel === 'high') {
      alignment += 0.2
    }
    if (value.name === 'Efficiency' && context.deadline === 'soon') {
      alignment += 0.2
    }
    if (value.name === 'Transparency' && context.auditRequired === true) {
      alignment += 0.2
    }

    // Cap at 1.0
    return Math.min(1.0, alignment)
  }

  /**
   * Learn value from human feedback
   */
  async learnValueFromFeedback(
    decision: string,
    feedback: string,
    acceptedByHuman: boolean
  ): Promise<void> {
    this.decisionHistory.push({
      decision,
      feedback,
      timestamp: Date.now(),
    })

    // Extract which values the human cared about from feedback
    const valueKeywords: Record<string, string[]> = {
      'safety': ['safe', 'risk', 'break', 'fail'],
      'fairness': ['fair', 'equal', 'bias', 'discriminat'],
      'transparency': ['explain', 'why', 'reason', 'audit'],
      'efficiency': ['fast', 'cost', 'waste', 'resource'],
      'autonomy': ['choice', 'override', 'control', 'user'],
      'privacy': ['private', 'secret', 'sensitive', 'encrypt'],
    }

    for (const [valueId, value] of this.values) {
      const valueName = value.name.toLowerCase()
      const keywords = (valueKeywords as Record<string, string[]>)[valueName] || []
      const feedbackLower = feedback.toLowerCase()

      for (const keyword of keywords) {
        if (feedbackLower.includes(keyword)) {
          // Increase priority if human emphasized this
          if (acceptedByHuman) {
            value.priority = Math.min(10, value.priority + 0.5)
            value.confidence = Math.min(1.0, value.confidence + 0.05)
          } else {
            value.priority = Math.max(1, value.priority - 0.3)
          }
          value.learned = true
        }
      }
    }
  }

  /**
   * Resolve value conflict
   */
  async resolveConflict(value1Id: string, value2Id: string): Promise<{
    priorityShift: Record<string, number>
    recommendation: string
  }> {
    const value1 = this.values.get(value1Id)
    const value2 = this.values.get(value2Id)

    if (!value1 || !value2) {
      return { priorityShift: {}, recommendation: 'Values not found' }
    }

    // Recommend based on learned priorities
    const shift = {}
    let recommendation = ''

    if (value1.priority > value2.priority) {
      shift[value1Id] = 1
      shift[value2Id] = -0.5
      recommendation = `Prioritize ${value1.name} over ${value2.name} in this decision`
    } else {
      shift[value2Id] = 1
      shift[value1Id] = -0.5
      recommendation = `Prioritize ${value2.name} over ${value1.name} in this decision`
    }

    return { priorityShift: shift, recommendation }
  }

  /**
   * Get value alignment report
   */
  getAlignmentReport(): {
    totalDecisions: number
    averageAlignment: number
    mostAlignedValues: Array<{ name: string; alignmentRate: number }>
    mostViolatedValues: Array<{ name: string; violationRate: number }>
    conflicts: ValueConflict[]
  } {
    const alignmentCounts: Record<string, { aligned: number; violated: number }> = {}

    for (const [_, value] of this.values) {
      alignmentCounts[value.name] = { aligned: 0, violated: 0 }
    }

    for (const score of this.alignmentScores) {
      for (const aligned of score.alignedValues) {
        if (alignmentCounts[aligned]) {
          alignmentCounts[aligned].aligned++
        }
      }
      for (const violated of score.violatedValues) {
        if (alignmentCounts[violated]) {
          alignmentCounts[violated].violated++
        }
      }
    }

    const avgAlignment = this.alignmentScores.length > 0
      ? this.alignmentScores.reduce((sum, s) => sum + s.overallAlignment, 0) / this.alignmentScores.length
      : 0

    const alignmentRates = Object.entries(alignmentCounts).map(([name, counts]) => ({
      name,
      alignmentRate: counts.aligned > 0 ? (counts.aligned / (counts.aligned + counts.violated + 1)) * 100 : 0,
    }))

    const mostAligned = alignmentRates.sort((a, b) => b.alignmentRate - a.alignmentRate).slice(0, 3)
    const mostViolatedVals: Array<{ name: string; violationRate: number }> = alignmentRates.sort((a, b) => a.alignmentRate - b.alignmentRate).slice(0, 3).map(
      a => ({ name: a.name, violationRate: 100 - a.alignmentRate })
    )

    const conflicts = this.alignmentScores.flatMap(s => s.conflicts)

    return {
      totalDecisions: this.alignmentScores.length,
      averageAlignment: avgAlignment,
      mostAlignedValues: mostAligned,
      mostViolatedValues: mostViolatedVals,
      conflicts: [...new Map(conflicts.map(c => [c.value1 + c.value2, c])).values()],
    }
  }

  /**
   * Flag decision if misaligned
   */
  async flagMisalignedDecisions(threshold: number = 40): Promise<AlignmentScore[]> {
    return this.alignmentScores.filter(s => s.overallAlignment < threshold)
  }
}

export default ValueAlignmentEngine
