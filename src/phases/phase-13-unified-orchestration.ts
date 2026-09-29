/**
 * Phase 13: Deep Reflexivity - Unified Orchestration
 * Integrates Value Alignment, Introspection, Dialogue, Meta-Learning, Uncertainty
 */

import ValueAlignmentEngine from './phase-13-value-alignment.js'
import IntrospectionEngine from './phase-13-introspection.js'
import DialogueSystem from './phase-13-dialogue.js'
import MetaLearningEngine from './phase-13-meta-learning.js'
import UncertaintyQuantifier from './phase-13-uncertainty.js'

export interface Phase13Decision {
  id: string
  description: string
  reasoning: string
  valuesAligned: boolean
  alignmentScore: number
  confidence: number
  uncertainties: string[]
  requiresHumanInput: boolean
  timestamp: number
}

export interface Phase13Report {
  decision: Phase13Decision
  valueAlignment: any
  introspection: any
  dialogue: any
  metalearning: any
  uncertainty: any
  overallWisdomScore: number
  recommendation: 'proceed' | 'ask-human' | 'reconsider'
}

export class Phase13Orchestrator {
  private valueAlignment: ValueAlignmentEngine
  private introspection: IntrospectionEngine
  private dialogue: DialogueSystem
  private metalearning: MetaLearningEngine
  private uncertainty: UncertaintyQuantifier
  private decisionHistory: Phase13Decision[] = []
  private cycleCount = 0

  constructor() {
    this.valueAlignment = new ValueAlignmentEngine()
    this.introspection = new IntrospectionEngine()
    this.dialogue = new DialogueSystem()
    this.metalearning = new MetaLearningEngine()
    this.uncertainty = new UncertaintyQuantifier()
  }

  /**
   * Initialize all Phase 13 systems
   */
  async initialize(): Promise<void> {
    await this.valueAlignment.initializeCoreValues()
    await this.metalearning.initializeMethods()
    console.log('[Phase 13] Deep Reflexivity system initialized')
  }

  /**
   * Process decision through all Phase 13 lenses
   */
  async processDecisionWithReflexivity(
    decision: string,
    reasoning: string,
    confidence: number,
    context: Record<string, any>
  ): Promise<Phase13Report> {
    this.cycleCount++

    // 1. Check value alignment
    const alignment = await this.valueAlignment.checkAlignment(decision, context)

    // 2. Introspect on decision
    const analysis: any = {
      decision,
      confidence,
      biases: [],
      assumptions: Object.keys(context),
      uncertainties: [],
      reversible: true,
      impactEstimate: 'medium',
    }
    this.introspection.recordDecision(analysis)

    // 3. Check for confusions
    const confusion = await this.introspection.identifyConfusion(decision, confidence)

    // 4. Assess uncertainties
    const uncertaintyMetrics = await this.uncertainty.quantifyUncertaintyTypes(decision)
    const failureRisk = await this.uncertainty.estimateFailureRisk(decision)

    // 5. Choose optimal learning method for this decision type
    const optimalMethod = await this.metalearning.chooseOptimalLearningStrategy(decision)

    // 6. Detect overfitting
    const overfitting = await this.metalearning.detectOverfitting()

    // 7. Generate dialogue if needed
    let dialogueOutput = ''
    if (!alignment.actionable || confusion.shouldAskForHelp || failureRisk.riskLevel === 'high') {
      dialogueOutput = await this.dialogue.askQuestion(
        `Should I proceed with: ${decision}?`,
        `Confidence: ${confidence}, Alignment: ${alignment.overallAlignment.toFixed(0)}%`,
        ['Yes, proceed', 'No, reconsider', 'Need more explanation'],
        'high'
      )
    }

    // 8. Calculate overall wisdom score
    const wisdomScore = this.calculateWisdomScore(
      alignment.overallAlignment,
      confidence,
      uncertaintyMetrics.total,
      overfitting.isOverfitting
    )

    // 9. Determine recommendation
    let recommendation: 'proceed' | 'ask-human' | 'reconsider' = 'proceed'
    if (!alignment.actionable || confusion.shouldAskForHelp) recommendation = 'ask-human'
    if (failureRisk.riskLevel === 'critical' || overfitting.isOverfitting) recommendation = 'reconsider'

    // Record decision
    const phase13Decision: Phase13Decision = {
      id: `d13-${Date.now()}`,
      description: decision,
      reasoning,
      valuesAligned: alignment.actionable,
      alignmentScore: alignment.overallAlignment,
      confidence,
      uncertainties: failureRisk.factors,
      requiresHumanInput: recommendation === 'ask-human',
      timestamp: Date.now(),
    }

    this.decisionHistory.push(phase13Decision)

    return {
      decision: phase13Decision,
      valueAlignment: alignment,
      introspection: analysis,
      dialogue: dialogueOutput,
      metalearning: optimalMethod,
      uncertainty: {
        metrics: uncertaintyMetrics,
        failureRisk,
      },
      overallWisdomScore: wisdomScore,
      recommendation,
    }
  }

  /**
   * Calculate wisdom score (0-100)
   */
  private calculateWisdomScore(
    alignment: number,
    confidence: number,
    uncertainty: number,
    overfitting: boolean
  ): number {
    let score = (alignment / 100) * 25 + confidence * 25 + (1 - uncertainty) * 25 + (!overfitting ? 25 : 10)
    return Math.min(100, Math.max(0, score))
  }

  /**
   * Get comprehensive Phase 13 report
   */
  async getPhase13Report(): Promise<{
    cycles: number
    decisions: number
    averageWisdom: number
    keyInsights: string[]
    humanInterventionsNeeded: number
    systemRecommendations: string[]
  }> {
    const avgWisdom = this.decisionHistory.length > 0
      ? this.decisionHistory.reduce((sum, d) => sum + (d.alignmentScore / 100) * 100, 0) /
        this.decisionHistory.length
      : 0

    const humanIntervention = this.decisionHistory.filter(d => d.requiresHumanInput).length

    const insights: string[] = []
    const introspectionReport = this.introspection.getIntrospectionReport()

    if (introspectionReport.assessment.hasBlindSpots) {
      insights.push(`System has blind spots: ${introspectionReport.assessment.blindSpots.join(', ')}`)
    }

    if (introspectionReport.learning?.shouldRetrain) {
      insights.push('System should retrain on diverse examples')
    }

    const uncertaintyReport = this.uncertainty.getUncertaintyReport()
    insights.push(`Uncertainty trend: ${uncertaintyReport.uncertaintyTrend}`)

    const recommendations: string[] = []
    if (humanIntervention > 5) {
      recommendations.push('High frequency of human interventions - consider improving confidence estimates')
    }
    if (avgWisdom < 70) {
      recommendations.push('Wisdom score is low - focus on value alignment and uncertainty reduction')
    }

    return {
      cycles: this.cycleCount,
      decisions: this.decisionHistory.length,
      averageWisdom: avgWisdom,
      keyInsights: insights,
      humanInterventionsNeeded: humanIntervention,
      systemRecommendations: recommendations,
    }
  }

  /**
   * Get system explanation
   */
  explainPhase13(): string {
    return `
## Phase 13: Deep Reflexivity & Value Alignment

### The 5 Integrated Systems:

1. **Value Alignment Engine**
   - Checks if decisions align with stated values
   - Learns human values from feedback
   - Flags value conflicts before problems occur

2. **Introspection Engine**
   - System examines its own learning
   - Identifies biases in reasoning
   - Detects when uncertainty is high

3. **Dialogue System**
   - Explains decisions to humans
   - Asks clarifying questions
   - Learns from human feedback

4. **Meta-Learning Engine**
   - Learns about learning itself
   - Detects overfitting
   - Chooses optimal learning strategies

5. **Uncertainty Quantification**
   - Quantifies confidence in all predictions
   - Asks for help when uncertain
   - Calibrates confidence estimates

### How They Work Together:

Before any major decision:
1. Check value alignment (is this ethical?)
2. Assess uncertainty (how confident are we?)
3. Examine assumptions (what are we taking for granted?)
4. Detect biases (is reasoning sound?)
5. Estimate failure risk (what could go wrong?)
6. If needed, explain and ask for human guidance

### Result: Wise Systems (Not Just Smart Systems)

Smart: Does things efficiently
Wise: Understands why those things matter, questions own reasoning, asks for help when needed

Phase 13 adds the wisdom layer to Phase 12's intelligence.
    `
  }

  // Getters
  getValueAlignment() { return this.valueAlignment }
  getIntrospection() { return this.introspection }
  getDialogue() { return this.dialogue }
  getMetaLearning() { return this.metalearning }
  getUncertainty() { return this.uncertainty }
  getDecisionHistory() { return this.decisionHistory }
  getCycleCount() { return this.cycleCount }
}

export default Phase13Orchestrator
