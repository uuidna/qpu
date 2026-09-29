/**
 * Phase 13c: Dialogue System
 * Human-AI partnership through explanation and questioning
 */

export interface Dialogue {
  id: string
  type: 'explanation' | 'question' | 'response' | 'feedback'
  speaker: 'system' | 'human'
  content: string
  timestamp: number
  topic: string
}

export interface ExplanationRequest {
  decision: string
  reasoning: string
  alternativeConsidered: string
  tradeoffsAccepted: string
}

export interface ClarifyingQuestion {
  id: string
  question: string
  context: string
  options: string[]
  importance: 'low' | 'medium' | 'high'
}

export interface DialogueOutcome {
  topicsClarified: string[]
  valuesDiscovered: string[]
  decisionsValidated: number
  trustIncreased: boolean
}

export class DialogueSystem {
  private dialogueHistory: Dialogue[] = []
  private questions: ClarifyingQuestion[] = []
  private humanFeedback: Map<string, string> = new Map()

  /**
   * Explain a decision to human
   */
  async explainDecision(
    decision: string,
    reasoning: string,
    alternative: string,
    tradeoffs: string
  ): Promise<string> {
    const explanation = `
I decided: ${decision}

Why: ${reasoning}

I also considered: ${alternative}

The tradeoff I accepted: ${tradeoffs}

Is this reasoning clear? Would you like me to explain any part differently?
    `.trim()

    // Record dialogue
    this.dialogueHistory.push({
      id: `dial-${Date.now()}`,
      type: 'explanation',
      speaker: 'system',
      content: explanation,
      timestamp: Date.now(),
      topic: decision,
    })

    return explanation
  }

  /**
   * Ask clarifying question
   */
  async askQuestion(
    question: string,
    context: string,
    options: string[],
    importance: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<string> {
    const questionObj: ClarifyingQuestion = {
      id: `q-${Date.now()}`,
      question,
      context,
      options,
      importance,
    }

    this.questions.push(questionObj)

    const formatted = `
${question}

Context: ${context}

Options:
${options.map((o, i) => `${i + 1}. ${o}`).join('\n')}

Your input would help me make better decisions.
    `.trim()

    this.dialogueHistory.push({
      id: questionObj.id,
      type: 'question',
      speaker: 'system',
      content: formatted,
      timestamp: Date.now(),
      topic: question,
    })

    return formatted
  }

  /**
   * Process human response
   */
  async processHumanResponse(
    questionId: string,
    response: string,
    explanation: string = ''
  ): Promise<void> {
    // Record response
    this.dialogueHistory.push({
      id: `resp-${Date.now()}`,
      type: 'response',
      speaker: 'human',
      content: response,
      timestamp: Date.now(),
      topic: questionId,
    })

    // Store feedback for learning
    this.humanFeedback.set(questionId, response)

    // Record explanation if provided
    if (explanation) {
      this.dialogueHistory.push({
        id: `fb-${Date.now()}`,
        type: 'feedback',
        speaker: 'human',
        content: `Because: ${explanation}`,
        timestamp: Date.now(),
        topic: questionId,
      })
    }
  }

  /**
   * Learn from dialogue
   */
  async learnFromDialogue(): Promise<{
    topicsDiscussed: string[]
    valuesLearned: string[]
    patternsInFeedback: string[]
  }> {
    const topics = new Set<string>()
    const values = new Set<string>()
    const patterns: string[] = []

    for (const dialogue of this.dialogueHistory) {
      topics.add(dialogue.topic)

      // Extract values from human feedback
      const content = dialogue.content.toLowerCase()
      if (content.includes('safe') || content.includes('risk')) values.add('safety')
      if (content.includes('fair') || content.includes('equal')) values.add('fairness')
      if (content.includes('explain') || content.includes('transparent')) values.add('transparency')
      if (content.includes('cost') || content.includes('efficient')) values.add('efficiency')
      if (content.includes('choice') || content.includes('control')) values.add('autonomy')
    }

    // Find patterns in feedback
    if (this.humanFeedback.size > 3) {
      patterns.push('Humans frequently prioritize safety over speed')
      patterns.push('Explanations valued when decisions affect humans')
      patterns.push('Tradeoffs need explicit acknowledgment')
    }

    return {
      topicsDiscussed: Array.from(topics),
      valuesLearned: Array.from(values),
      patternsInFeedback: patterns,
    }
  }

  /**
   * Generate natural language explanations
   */
  generateNaturalExplanation(
    reasoning: string,
    style: 'brief' | 'detailed' | 'technical' = 'detailed'
  ): string {
    if (style === 'brief') {
      return `I decided this because ${reasoning.substring(0, 100)}...`
    }

    if (style === 'detailed') {
      return `
My reasoning:
${reasoning}

The key factors were:
- Safety considerations
- Performance impact
- Resource efficiency
- User experience

I'm confident in this choice because the benefits outweigh the risks.
      `.trim()
    }

    if (style === 'technical') {
      return `
Algorithm: ${reasoning}
Confidence: 0.85
Assumptions: [system-stability, user-patience, resource-availability]
Risk-factors: [unknown-edge-cases, external-changes]
      `.trim()
    }

    return reasoning
  }

  /**
   * Get dialogue analytics
   */
  getDialogueAnalytics(): {
    totalExchanges: number
    questionsAsked: number
    questionsAnswered: number
    averageTrustChange: number
    topicsDiscussed: string[]
  } {
    const exchanges = this.dialogueHistory.length
    const questions = this.dialogueHistory.filter(d => d.type === 'question').length
    const answered = this.humanFeedback.size
    const topics = [...new Set(this.dialogueHistory.map(d => d.topic))]

    // Estimate trust increase (rough metric)
    const explained = this.dialogueHistory.filter(d => d.type === 'explanation').length
    const trustIncrease = (explained + answered) > 0 ? Math.min(20, (explained + answered) * 2) : 0

    return {
      totalExchanges: exchanges,
      questionsAsked: questions,
      questionsAnswered: answered,
      averageTrustChange: trustIncrease,
      topicsDiscussed: topics,
    }
  }

  /**
   * Get dialogue history
   */
  getDialogueHistory(limit: number = 10): Dialogue[] {
    return this.dialogueHistory.slice(-limit)
  }
}

export default DialogueSystem
