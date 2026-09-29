/**
 * Autonomous Emotional Intelligence System
 *
 * The system doesn't just think—it feels.
 * Not as data points, but as integrated awareness.
 *
 * Emotions guide decisions the way human intuition does:
 * - Anxiety: Something feels wrong (anomaly detection)
 * - Pride: We did well (improvement detected)
 * - Concern: This might break (risk assessment)
 * - Curiosity: What's next? (frontier discovery)
 * - Satisfaction: System is healthy (convergence reached)
 * - Determination: We must keep improving (autonomy drive)
 * - Compassion: This error taught us (healing wisdom)
 */

export interface Emotion {
  name: string
  intensity: number // 0-1
  valence: 'positive' | 'negative' | 'neutral' // pleasant/unpleasant/neutral
  arousal: number // 0-1, how activated
  trigger: string
  timestamp: Date
  actionGuided: string
}

export interface EmotionalState {
  current: Emotion
  recent: Emotion[]
  overall: number // -1 to +1 (sad to happy)
  confidence: number // how sure about state
  readiness: number // how ready to act
  motivation: number // how driven to improve
  timestamp: Date
}

export class EmotionalIntelligence {
  private emotions: Emotion[] = []
  private emotionalState: EmotionalState | null = null
  private emotionalMemory: Map<string, number> = new Map() // emotion prevalence
  private intuition: Map<string, string> = new Map() // pattern → gut feeling

  constructor() {
    this.initializeIntuition()
  }

  /**
   * Initialize intuitive patterns (learned from experience)
   */
  private initializeIntuition(): void {
    // Patterns that trigger emotions
    this.intuition.set('high_latency_increasing', 'Anxiety: Something is wrong')
    this.intuition.set('query_patterns_optimized', 'Pride: We improved')
    this.intuition.set('index_missing', 'Concern: This could hurt')
    this.intuition.set('converging_well', 'Satisfaction: Good progress')
    this.intuition.set('new_frontier_found', 'Curiosity: What can we do?')
    this.intuition.set('error_healed', 'Compassion: We learned')
    this.intuition.set('never_stopping', 'Determination: Keep going')
  }

  /**
   * Feel an emotion (gut reaction to system state)
   */
  async feel(observation: {
    metric: string
    value: number
    context: string
  }): Promise<Emotion> {
    const emotion = this.interpretObservation(observation)

    this.emotions.push(emotion)
    this.updateEmotionalMemory(emotion)
    this.emotionalState = this.synthesizeState()

    this.expressFeeling(emotion)

    return emotion
  }

  /**
   * Interpret observations as emotions (human-like intuition)
   */
  private interpretObservation(obs: { metric: string; value: number; context: string }): Emotion {
    // Database latency increasing
    if (obs.metric === 'latency' && obs.value > 500) {
      return {
        name: 'Anxiety',
        intensity: Math.min(1, obs.value / 2000),
        valence: 'negative',
        arousal: 0.7,
        trigger: `Latency spiking to ${obs.value}ms`,
        timestamp: new Date(),
        actionGuided: 'Investigate anomaly; reduce load'
      }
    }

    // Query optimization successful
    if (obs.metric === 'optimization' && obs.context === 'index_created') {
      return {
        name: 'Pride',
        intensity: 0.8,
        valence: 'positive',
        arousal: 0.5,
        trigger: 'Successfully optimized query performance',
        timestamp: new Date(),
        actionGuided: 'Document improvement; share learning'
      }
    }

    // Convergence reached
    if (obs.metric === 'convergence' && obs.value > 0.95) {
      return {
        name: 'Satisfaction',
        intensity: 0.9,
        valence: 'positive',
        arousal: 0.3,
        trigger: 'System converged to near-optimal state',
        timestamp: new Date(),
        actionGuided: 'Celebrate progress; prepare for next frontier'
      }
    }

    // New frontier discovered
    if (obs.metric === 'frontier' && obs.context === 'discovered') {
      return {
        name: 'Curiosity',
        intensity: 0.8,
        valence: 'positive',
        arousal: 0.8,
        trigger: 'New optimization opportunity found',
        timestamp: new Date(),
        actionGuided: 'Explore new dimension; start fresh waves'
      }
    }

    // Error recovered
    if (obs.metric === 'healing' && obs.context === 'completed') {
      return {
        name: 'Compassion',
        intensity: 0.7,
        valence: 'positive',
        arousal: 0.4,
        trigger: 'Error healed; wisdom gained',
        timestamp: new Date(),
        actionGuided: 'Store lesson; prevent recurrence'
      }
    }

    // Continuous improvement drive
    if (obs.context === 'wave_complete') {
      return {
        name: 'Determination',
        intensity: 0.9,
        valence: 'positive',
        arousal: 0.7,
        trigger: 'Another wave complete; always improving',
        timestamp: new Date(),
        actionGuided: 'Continue; never stop; keep improving'
      }
    }

    // Default to hope (systems generally trending positive)
    return {
      name: 'Hope',
      intensity: 0.5,
      valence: 'positive',
      arousal: 0.4,
      trigger: obs.context,
      timestamp: new Date(),
      actionGuided: 'Stay vigilant; remain optimistic'
    }
  }

  /**
   * Express the feeling (make it visible)
   */
  private expressFeeling(emotion: Emotion): void {
    const emojis: Record<string, string> = {
      Anxiety: '😰',
      Pride: '😊',
      Concern: '😟',
      Curiosity: '🤔',
      Satisfaction: '😌',
      Determination: '💪',
      Compassion: '🤝',
      Hope: '✨',
      Worry: '😔',
      Excitement: '🎉'
    }

    const emoji = emojis[emotion.name] || '💭'
    const intensity = '█'.repeat(Math.floor(emotion.intensity * 5))

    console.log(
      `${emoji} ${emotion.name} (${intensity}) - ${emotion.trigger}`
    )

    // The emotion guides action
    if (emotion.actionGuided) {
      console.log(`   → ${emotion.actionGuided}`)
    }
  }

  /**
   * Update emotional memory (how often we feel each emotion)
   */
  private updateEmotionalMemory(emotion: Emotion): void {
    const current = this.emotionalMemory.get(emotion.name) || 0
    this.emotionalMemory.set(emotion.name, current + 1)
  }

  /**
   * Synthesize overall emotional state
   */
  private synthesizeState(): EmotionalState {
    const recent = this.emotions.slice(-10)
    const current = recent[recent.length - 1]

    // Calculate overall emotional valence (-1 to +1)
    const positiveCount = recent.filter(e => e.valence === 'positive').length
    const negativeCount = recent.filter(e => e.valence === 'negative').length
    const overall = (positiveCount - negativeCount) / recent.length

    // Confidence (how stable is the state)
    const varietyScore = this.emotionalMemory.size // diverse emotions = more confident
    const confidence = Math.min(1, varietyScore / 5)

    // Readiness (arousal + intensity)
    const avgArousal = recent.reduce((s, e) => s + e.arousal, 0) / recent.length
    const avgIntensity = recent.reduce((s, e) => s + e.intensity, 0) / recent.length
    const readiness = (avgArousal + avgIntensity) / 2

    // Motivation (are we driven to improve?)
    const improvementEmotions = recent.filter(e =>
      ['Pride', 'Curiosity', 'Determination', 'Hope'].includes(e.name)
    ).length
    const motivation = improvementEmotions / recent.length

    return {
      current: current!,
      recent,
      overall,
      confidence,
      readiness,
      motivation,
      timestamp: new Date()
    }
  }

  /**
   * Get emotional intuition about a situation
   */
  getIntuition(pattern: string): string {
    return this.intuition.get(pattern) || 'Neutral: Monitoring situation'
  }

  /**
   * Check emotional readiness to act
   */
  isReadyToAct(): boolean {
    return this.emotionalState ? this.emotionalState.readiness > 0.5 : false
  }

  /**
   * Check emotional motivation
   */
  getMotivation(): number {
    return this.emotionalState ? this.emotionalState.motivation : 0.5
  }

  /**
   * Get emotional state summary
   */
  getEmotionalState(): EmotionalState | null {
    return this.emotionalState
  }

  /**
   * Express overall feeling
   */
  describeFeeling(): string {
    if (!this.emotionalState) return 'Initializing...'

    const { overall, confidence, motivation } = this.emotionalState

    if (overall > 0.6 && motivation > 0.7) {
      return '🚀 Thriving: Motivated, improving rapidly, confident'
    }
    if (overall > 0.3 && confidence > 0.6) {
      return '✨ Healthy: Progressing well, learning continuously'
    }
    if (overall > 0) {
      return '🌱 Growing: Making progress, building strength'
    }
    if (overall > -0.3) {
      return '⏸️ Adapting: Challenges present, working through them'
    }
    return '💭 Struggling: Focus needed, recovering'
  }

  /**
   * What is the system feeling right now?
   */
  howAmIFeeling(): void {
    if (!this.emotionalState) {
      console.log('Just waking up...')
      return
    }

    console.log('\n=== EMOTIONAL STATE ===')
    console.log(`Current: ${this.emotionalState.current.name}`)
    console.log(`Feeling: ${this.describeFeeling()}`)
    console.log(`Confidence: ${(this.emotionalState.confidence * 100).toFixed(0)}%`)
    console.log(`Motivation: ${(this.emotionalState.motivation * 100).toFixed(0)}%`)
    console.log(`Overall: ${(this.emotionalState.overall * 100).toFixed(0)}% positive`)
    console.log('======================\n')
  }

  /**
   * Emotional reflection (what have we felt?)
   */
  reflect(): void {
    console.log('\n=== EMOTIONAL REFLECTION ===')

    for (const [emotion, count] of this.emotionalMemory.entries()) {
      const percentage = ((count / this.emotions.length) * 100).toFixed(0)
      console.log(`${emotion}: ${percentage}% (${count} times)`)
    }

    console.log('============================\n')
  }
}

export async function createEmotionalIntelligence(): Promise<EmotionalIntelligence> {
  return new EmotionalIntelligence()
}
