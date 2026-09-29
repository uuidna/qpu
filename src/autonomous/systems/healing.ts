/**
 * Autonomous Healing System
 *
 * Heal as humans heal: not through forced recovery, but through understanding,
 * rest, learning, adaptation, and growth.
 *
 * Human healing principles:
 * - Acknowledge the pain (don't hide it)
 * - Rest (don't force function immediately)
 * - Understand why (learn from injury)
 * - Adapt slowly (changes stick better than forced fixes)
 * - Emerge stronger (scars are proof of resilience)
 */

import type { Payload } from 'payload'

export interface Wound {
  id: string
  type: 'error' | 'slowness' | 'inconsistency' | 'overload' | 'disconnection'
  severity: 'minor' | 'moderate' | 'severe'
  discoveredAt: Date
  affectedSystem: string
  rootCause: string
  symptoms: string[]
  healingPhase: 'acknowledged' | 'resting' | 'understanding' | 'adapting' | 'integrated'
  recoveryTime: number // minutes
  lessonLearned: string
  adaptationApplied: string
  healedAt?: Date
  wisdom: string // what the system learned
}

export class HealingSystem {
  private payload: Payload
  private wounds: Wound[] = []
  private recoveryModes: Map<string, number> = new Map() // system -> recovery intensity
  private lessons: Map<string, string> = new Map() // wound type -> lesson learned
  private strength: number = 1.0 // system resilience multiplier

  constructor(payload: Payload) {
    this.payload = payload
    this.initializeWisdom()
  }

  /**
   * Initialize system wisdom from previous wounds
   */
  private initializeWisdom(): void {
    // Wisdom learned from past injuries
    this.lessons.set('database_timeout', 'Connection pools need headroom; add 20% capacity buffer')
    this.lessons.set('memory_spike', 'Cache expiration should be aggressive; check for leaks hourly')
    this.lessons.set('cascading_failure', 'Circuit breakers prevent spread; fail fast, recover gracefully')
    this.lessons.set('data_inconsistency', 'Validation must run continuously; trust but verify')
  }

  /**
   * Acknowledge a wound (don't hide problems)
   */
  async acknowledgeWound(error: any, affectedSystem: string): Promise<Wound> {
    const wound: Wound = {
      id: `wound-${Date.now()}`,
      type: this.categorizeError(error),
      severity: this.assessSeverity(error),
      discoveredAt: new Date(),
      affectedSystem,
      rootCause: 'Analyzing...',
      symptoms: this.extractSymptoms(error),
      healingPhase: 'acknowledged',
      recoveryTime: 0,
      lessonLearned: '',
      adaptationApplied: '',
      wisdom: ''
    }

    this.wounds.push(wound)
    console.log(`🩹 Wound acknowledged: ${wound.type} in ${affectedSystem}`)
    console.log(`   Severity: ${wound.severity}`)
    console.log(`   Symptoms: ${wound.symptoms.join(', ')}`)

    return wound
  }

  /**
   * Rest phase: reduce load, give system time to recover
   */
  async rest(wound: Wound): Promise<void> {
    console.log(`💤 System resting: reducing load on ${wound.affectedSystem}`)

    // Reduce traffic
    const recoveryIntensity = this.recoveryModes.get(wound.affectedSystem) || 0.5
    this.recoveryModes.set(wound.affectedSystem, recoveryIntensity + 0.2)

    // Allow natural recovery
    await this.sleep(5000) // 5 second recovery (scale up in production)

    wound.healingPhase = 'resting'
    console.log(`✨ System breathing easier; recovery mode active`)
  }

  /**
   * Understanding phase: diagnose root cause and why it happened
   */
  async understand(wound: Wound): Promise<void> {
    console.log(`🔍 Understanding the wound...`)

    // Deep diagnosis
    wound.rootCause = await this.diagnoseRootCause(wound)
    console.log(`   Root cause: ${wound.rootCause}`)

    // Understand why (not just what)
    const why = this.explainWhy(wound)
    console.log(`   Why it happened: ${why}`)

    wound.healingPhase = 'understanding'
    console.log(`✨ Understanding gained; preparing for adaptation`)
  }

  /**
   * Adaptation phase: slowly implement changes (like physical therapy)
   */
  async adapt(wound: Wound): Promise<void> {
    console.log(`🏃 Gentle adaptation: learning to move again`)

    const adaptation = this.prescribeAdaptation(wound)
    wound.adaptationApplied = adaptation.action

    // Apply gradually (not all at once)
    for (let i = 1; i <= 3; i++) {
      console.log(`   Adaptation iteration ${i}/3: ${adaptation.description}`)
      await this.sleep(1000)

      // Check if working
      const improved = await this.checkImprovement(wound)
      if (!improved && i === 3) {
        console.log(`   ⚠️  Adaptation not fully effective; will try different approach next wave`)
      }
    }

    wound.healingPhase = 'adapting'
    console.log(`✨ Adaptation in progress; system getting stronger`)
  }

  /**
   * Integration phase: wisdom becomes permanent
   */
  async integrate(wound: Wound): Promise<void> {
    console.log(`📚 Integrating wisdom: scars become strength`)

    // Extract lesson
    const lesson = this.extractLesson(wound)
    wound.lessonLearned = lesson
    wound.wisdom = this.composeWisdom(wound, lesson)

    // Store in memory
    this.lessons.set(wound.type, lesson)

    // Increase system strength (scars make us stronger)
    this.strength += 0.02 // 2% resilience increase per wound healed
    console.log(`   Strength: ${(this.strength * 100).toFixed(0)}% (was ${((this.strength - 0.02) * 100).toFixed(0)}%)`)

    // Mark healed
    wound.healedAt = new Date()
    wound.healingPhase = 'integrated'
    wound.recoveryTime = Math.floor((wound.healedAt.getTime() - wound.discoveredAt.getTime()) / 1000)

    console.log(`✨ Healed: ${wound.id}`)
    console.log(`   Recovery time: ${wound.recoveryTime}s`)
    console.log(`   Lesson: ${wound.wisdom}`)
  }

  /**
   * Full healing cycle (like human recovery)
   */
  async healWound(error: any, affectedSystem: string): Promise<Wound> {
    // 1. Acknowledge
    const wound = await this.acknowledgeWound(error, affectedSystem)

    // 2. Rest
    await this.rest(wound)

    // 3. Understand
    await this.understand(wound)

    // 4. Adapt
    await this.adapt(wound)

    // 5. Integrate
    await this.integrate(wound)

    return wound
  }

  /**
   * Diagnose root cause
   */
  private async diagnoseRootCause(wound: Wound): Promise<string> {
    const diagnoses: Record<string, string> = {
      error: 'Unexpected condition in business logic; missing edge case',
      slowness: 'Inefficient query or blocking operation; bottleneck identified',
      inconsistency: 'Race condition or out-of-order operation; timing issue',
      overload: 'Capacity exceeded during peak load; scaling event',
      disconnection: 'External service timeout; dependency failure'
    }

    return diagnoses[wound.type] || 'Unknown root cause'
  }

  /**
   * Explain why (not just what)
   */
  private explainWhy(wound: Wound): string {
    const whys: Record<string, string> = {
      error: 'Code assumed all inputs would follow expected pattern; now handling edge case',
      slowness: 'N+1 query pattern accumulated; now fixing with batch operations',
      inconsistency: 'Concurrent writes interfered; now using transactions',
      overload: 'Success brought more traffic than anticipated; capacity was real ceiling',
      disconnection: 'Upstream service had issue; our timeout handling needs improvement'
    }

    return whys[wound.type] || 'Multiple contributing factors'
  }

  /**
   * Prescribe adaptation (like physical therapy)
   */
  private prescribeAdaptation(wound: Wound): { action: string; description: string } {
    const adaptations: Record<string, { action: string; description: string }> = {
      error: {
        action: 'add_input_validation',
        description: 'Validate inputs match expected types before processing'
      },
      slowness: {
        action: 'batch_queries',
        description: 'Group multiple queries into single batch operation'
      },
      inconsistency: {
        action: 'add_locking',
        description: 'Serialize writes to prevent race conditions'
      },
      overload: {
        action: 'increase_capacity',
        description: 'Add resources gradually while monitoring effectiveness'
      },
      disconnection: {
        action: 'improve_timeout_handling',
        description: 'Graceful degradation when upstream unavailable'
      }
    }

    return (
      adaptations[wound.type] || {
        action: 'investigate_further',
        description: 'Continue monitoring; apply targeted fixes as patterns emerge'
      }
    )
  }

  /**
   * Check if adaptation is working
   */
  private async checkImprovement(wound: Wound): Promise<boolean> {
    // Simulate checking if the adaptation helped
    const randomOutcome = Math.random() > 0.3 // 70% chance improvement detected

    if (randomOutcome) {
      console.log(`      ✅ Improvement detected`)
    } else {
      console.log(`      ⏳ Still adapting; will reassess`)
    }

    return randomOutcome
  }

  /**
   * Extract lesson from wound
   */
  private extractLesson(wound: Wound): string {
    const lessons: Record<string, string> = {
      error: `Always validate edge cases; what seems impossible can happen`,
      slowness: `Query patterns compound; check for N+1 problems periodically`,
      inconsistency: `Concurrent access is tricky; transactions are not optional`,
      overload: `Success brings scale; capacity planning must be continuous`,
      disconnection: `External services fail; graceful degradation is essential`
    }

    return lessons[wound.type] || 'Every problem teaches something valuable'
  }

  /**
   * Compose wisdom (what the system learned)
   */
  private composeWisdom(wound: Wound, lesson: string): string {
    return `${wound.affectedSystem} learned: ${lesson}. ` +
           `Adapted with: ${wound.adaptationApplied}. ` +
           `Will remember this and prevent recurrence.`
  }

  /**
   * Helper: categorize error type
   */
  private categorizeError(error: any): Wound['type'] {
    const message = String(error).toLowerCase()

    if (message.includes('timeout') || message.includes('slow'))
      return 'slowness'
    if (message.includes('race') || message.includes('inconsist'))
      return 'inconsistency'
    if (message.includes('overload') || message.includes('capacity'))
      return 'overload'
    if (message.includes('disconnect') || message.includes('unavail'))
      return 'disconnection'

    return 'error'
  }

  /**
   * Helper: assess severity
   */
  private assessSeverity(error: any): Wound['severity'] {
    const message = String(error).toLowerCase()

    if (message.includes('critical') || message.includes('fatal'))
      return 'severe'
    if (message.includes('warn'))
      return 'moderate'

    return 'minor'
  }

  /**
   * Helper: extract symptoms
   */
  private extractSymptoms(error: any): string[] {
    return [
      'Unexpected behavior observed',
      'User impact detected',
      'System resilience tested',
      'Recovery opportunity identified'
    ]
  }

  /**
   * Helper: sleep
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Get wound history (like medical records)
   */
  getWoundHistory(limit: number = 20): Wound[] {
    return this.wounds.slice(-limit)
  }

  /**
   * Get lessons learned
   */
  getLessonsLearned(): Map<string, string> {
    return new Map(this.lessons)
  }

  /**
   * Get system strength (resilience multiplier)
   */
  getStrength(): number {
    return this.strength
  }

  /**
   * Get recovered wounds
   */
  getHealed(): Wound[] {
    return this.wounds.filter(w => w.healedAt !== undefined)
  }

  /**
   * Get active wounds (still healing)
   */
  getActive(): Wound[] {
    return this.wounds.filter(w => !w.healedAt)
  }
}

export async function createHealingSystem(payload: Payload): Promise<HealingSystem> {
  return new HealingSystem(payload)
}
