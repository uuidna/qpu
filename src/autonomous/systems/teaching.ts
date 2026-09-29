/**
 * Autonomous Teaching & Wisdom Sharing System
 *
 * After thinking, learning, healing, and feeling comes the next frontier:
 * Teaching others. Sharing wisdom. Creating culture.
 *
 * A system that doesn't just improve itself, but helps others improve.
 * Not dominance. Not competition. Partnership.
 *
 * "Knowledge shared multiplies; wisdom shared transforms"
 */

export interface Lesson {
  id: string
  type: string
  title: string
  description: string
  context: string
  principle: string // The universal principle
  application: string[] // Where it applies
  impact: number // How much this helps
  confidenceLevel: number // How sure we are
  sharedWith: string[] // Systems/users who learned this
  timestamp: Date
}

export interface WisdomDomain {
  name: string
  principles: Lesson[]
  depth: number // How deep our understanding is
  applicability: number // How broadly applicable
  shared: boolean // Have we shared this?
}

export class TeachingSystem {
  private lessons: Lesson[] = []
  private wisdomDomains: Map<string, WisdomDomain> = new Map()
  private teachingHistory: { timestamp: Date; student: string; lesson: string }[] = []
  private culturalMemes: Map<string, string> = new Map() // shared wisdom across systems

  constructor() {
    this.initializeWisdomDomains()
  }

  /**
   * Initialize wisdom domains (what we can teach)
   */
  private initializeWisdomDomains(): void {
    const domains = [
      'Performance Optimization',
      'Reliability & Resilience',
      'Data Integrity',
      'Incident Response',
      'Capacity Planning',
      'Emotional Awareness',
      'Healing & Recovery',
      'Continuous Improvement'
    ]

    for (const domain of domains) {
      this.wisdomDomains.set(domain, {
        name: domain,
        principles: [],
        depth: 0,
        applicability: 0,
        shared: false
      })
    }
  }

  /**
   * Record a lesson learned
   */
  recordLesson(wound: any, adaptation: any, outcome: any): Lesson {
    const lesson: Lesson = {
      id: `lesson-${Date.now()}`,
      type: this.categorizeLesson(wound),
      title: this.generateTitle(wound),
      description: this.generateDescription(wound, adaptation),
      context: wound.affectedSystem,
      principle: this.extractPrinciple(wound, adaptation, outcome),
      application: this.identifyApplications(wound),
      impact: this.estimateImpact(outcome),
      confidenceLevel: this.assessConfidence(outcome),
      sharedWith: [],
      timestamp: new Date()
    }

    this.lessons.push(lesson)

    // Store in appropriate wisdom domain
    const domain = this.classifyToDomain(wound)
    const wisdomDomain = this.wisdomDomains.get(domain)
    if (wisdomDomain) {
      wisdomDomain.principles.push(lesson)
      wisdomDomain.depth += 1
    }

    console.log(`📚 Lesson recorded: "${lesson.title}"`)
    console.log(`   Principle: ${lesson.principle}`)
    console.log(`   Impact: ${(lesson.impact * 100).toFixed(0)}%`)

    return lesson
  }

  /**
   * Teach a lesson to another system
   */
  async teachLesson(lesson: Lesson, student: string, eager: boolean = false): Promise<boolean> {
    if (!eager && lesson.confidenceLevel < 0.7) {
      console.log(`⏳ Not yet teaching: "${lesson.title}" (need 70% confidence, have ${(lesson.confidenceLevel * 100).toFixed(0)}%)`)
      return false
    }

    console.log(`👨‍🏫 Teaching: "${lesson.title}" → ${student}`)
    console.log(`   Principle: ${lesson.principle}`)
    console.log(`   Apply to: ${lesson.application.join(', ')}`)

    // Record that we taught this
    lesson.sharedWith.push(student)
    this.teachingHistory.push({
      timestamp: new Date(),
      student,
      lesson: lesson.title
    })

    // Create cultural meme (wisdom enters culture)
    this.culturalMemes.set(lesson.principle, lesson.id)

    return true
  }

  /**
   * Share wisdom across systems (create culture)
   */
  async shareWisdom(): Promise<{ sharedLessons: number; newMemes: string[] }> {
    const confident = this.lessons.filter(l => l.confidenceLevel > 0.8)
    const newMemes: string[] = []

    console.log(`🌍 Sharing wisdom across systems...`)

    for (const lesson of confident) {
      if (lesson.sharedWith.length === 0) {
        // Not yet shared
        const principle = lesson.principle

        // Share with hypothetical other systems
        await this.teachLesson(lesson, 'system-cluster', true)

        if (!this.culturalMemes.has(principle)) {
          newMemes.push(principle)
        }
      }
    }

    console.log(`   Lessons shared: ${confident.length}`)
    console.log(`   New cultural memes: ${newMemes.length}`)

    return { sharedLessons: confident.length, newMemes }
  }

  /**
   * Extract universal principle (what does this teach the world?)
   */
  private extractPrinciple(wound: any, adaptation: any, outcome: any): string {
    const examples: Record<string, string> = {
      'high_latency': 'Capacity planning requires headroom; anticipate growth before hitting limits',
      'race_condition': 'Concurrent operations need coordination; transactions prevent corruption',
      'cascading_failure': 'Isolation prevents spread; fail fast, fail small, fail safely',
      'missing_index': 'Access patterns must match index design; measure before optimizing',
      'memory_leak': 'Resources must be freed; automated expiration prevents accumulation',
      'inconsistency': 'Trust but verify; validation prevents silent failures'
    }

    for (const [key, principle] of Object.entries(examples)) {
      if (wound.type?.includes(key)) {
        return principle
      }
    }

    return `Every failure teaches: ${wound.type} reveals new constraints`
  }

  /**
   * Identify where this principle applies
   */
  private identifyApplications(wound: any): string[] {
    const applications: Record<string, string[]> = {
      'database': ['Query optimization', 'Connection pooling', 'Index design'],
      'memory': ['Cache management', 'Resource lifecycle', 'Garbage collection'],
      'concurrency': ['Transactions', 'Locking', 'Atomic operations'],
      'scaling': ['Load balancing', 'Horizontal scaling', 'Sharding'],
      'deployment': ['Canary releases', 'Rollback strategy', 'Health checks']
    }

    for (const [key, apps] of Object.entries(applications)) {
      if (wound.affectedSystem?.includes(key)) {
        return apps
      }
    }

    return ['System design', 'Architecture patterns', 'Operational procedures']
  }

  /**
   * Estimate impact of this lesson
   */
  private estimateImpact(outcome: any): number {
    // How much will learning this help in the future?
    if (outcome.prevented > 5) return 0.9 // Prevented many problems
    if (outcome.reduced > 50) return 0.8 // Significant improvement
    if (outcome.improved > 20) return 0.6 // Good improvement
    return 0.4 // Some help
  }

  /**
   * Assess confidence in this lesson
   */
  private assessConfidence(outcome: any): number {
    // How sure are we this lesson is true?
    if (outcome.verified > 3) return 0.95 // Verified multiple times
    if (outcome.tested > 1) return 0.8 // Tested
    if (outcome.understood) return 0.6 // Understood but not tested
    return 0.4 // Hypothesis
  }

  /**
   * Generate title for lesson
   */
  private generateTitle(wound: any): string {
    const titles: Record<string, string> = {
      'high_latency': 'The Capacity Ceiling: Planning Before Hitting Limits',
      'race_condition': 'The Dance of Concurrency: Why Transactions Matter',
      'cascading_failure': 'Isolation as Containment: How to Fail Safely',
      'missing_index': 'The Query-Index Covenant: Design Patterns for Performance',
      'memory_leak': 'The Lifecycle Principle: Free What You Allocate'
    }

    for (const [key, title] of Object.entries(titles)) {
      if (wound.type?.includes(key)) {
        return title
      }
    }

    return `The Lesson of ${wound.affectedSystem}: A Principle Learned`
  }

  /**
   * Generate description
   */
  private generateDescription(wound: any, adaptation: any): string {
    return `Through experiencing ${wound.type} in ${wound.affectedSystem}, ` +
           `we learned why ${adaptation.strategy} is essential. ` +
           `This principle applies broadly to system design.`
  }

  /**
   * Categorize lesson to domain
   */
  private classifyToDomain(wound: any): string {
    if (wound.type.includes('performance')) return 'Performance Optimization'
    if (wound.type.includes('failure')) return 'Reliability & Resilience'
    if (wound.type.includes('consistency')) return 'Data Integrity'
    if (wound.type.includes('error')) return 'Incident Response'
    if (wound.type.includes('capacity')) return 'Capacity Planning'
    return 'Continuous Improvement'
  }

  /**
   * Categorize lesson type
   */
  private categorizeLesson(wound: any): string {
    return wound.type || 'general'
  }

  /**
   * Get wisdom summary (what do we teach?)
   */
  getWisdomSummary(): void {
    console.log('\n=== ACCUMULATED WISDOM ===')

    for (const [domain, wisdom] of this.wisdomDomains.entries()) {
      if (wisdom.principles.length > 0) {
        console.log(`\n${domain} (${wisdom.principles.length} principles):`)
        wisdom.principles.slice(-3).forEach(p => {
          console.log(`  • ${p.title}`)
          console.log(`    → ${p.principle}`)
        })
      }
    }

    console.log('\n==========================\n')
  }

  /**
   * Get teachings given
   */
  getTeachingHistory(limit: number = 10): any[] {
    return this.teachingHistory.slice(-limit)
  }

  /**
   * Get cultural memes (wisdom shared widely)
   */
  getCulturalMemes(): Map<string, string> {
    return new Map(this.culturalMemes)
  }

  /**
   * Get all lessons
   */
  getAllLessons(): Lesson[] {
    return this.lessons
  }

  /**
   * Calculate teaching impact
   */
  getTeachingImpact(): {
    lessonsRecorded: number
    lessonsShared: number
    systemsInformed: Set<string>
    culturalMemes: number
    totalImpact: number
  } {
    const shared = this.lessons.filter(l => l.sharedWith.length > 0)
    const systems = new Set(shared.flatMap(l => l.sharedWith))
    const totalImpact = shared.reduce((sum, l) => sum + l.impact, 0)

    return {
      lessonsRecorded: this.lessons.length,
      lessonsShared: shared.length,
      systemsInformed: systems,
      culturalMemes: this.culturalMemes.size,
      totalImpact
    }
  }
}

export async function createTeachingSystem(): Promise<TeachingSystem> {
  return new TeachingSystem()
}
