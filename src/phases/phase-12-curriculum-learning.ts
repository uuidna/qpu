/**
 * Phase 12c: Curriculum Learning
 * Learn progressively from simple to complex optimizations
 */

export type DifficultyLevel = 'trivial' | 'easy' | 'medium' | 'hard' | 'expert'

export interface CurriculumTask {
  id: string
  name: string
  difficulty: DifficultyLevel
  component: string
  successThreshold: number
  timeLimit: number
  prerequisites: string[]
}

export interface TaskProgress {
  taskId: string
  completed: boolean
  successRate: number
  attemptsNeeded: number
  masteredAt: number
}

export interface CurriculumState {
  currentLevel: DifficultyLevel
  tasksCompleted: number
  mastery: number
  nextUnlockedTasks: string[]
}

export class CurriculumLearner {
  private curriculum: Map<string, CurriculumTask> = new Map()
  private progress: Map<string, TaskProgress> = new Map()
  private currentLevel: DifficultyLevel = 'trivial'
  private completedTasks = new Set<string>()

  /**
   * Initialize curriculum
   */
  async initializeCurriculum(): Promise<CurriculumTask[]> {
    const tasks: CurriculumTask[] = [
      // Trivial - just identify a component
      {
        id: 'task-trivial-1',
        name: 'Identify latency',
        difficulty: 'trivial',
        component: 'monitoring',
        successThreshold: 80,
        timeLimit: 60,
        prerequisites: [],
      },
      // Easy - simple metric optimization
      {
        id: 'task-easy-1',
        name: 'Reduce latency by 5%',
        difficulty: 'easy',
        component: 'core-engine',
        successThreshold: 85,
        timeLimit: 300,
        prerequisites: ['task-trivial-1'],
      },
      {
        id: 'task-easy-2',
        name: 'Improve throughput by 10%',
        difficulty: 'easy',
        component: 'concurrency',
        successThreshold: 85,
        timeLimit: 300,
        prerequisites: ['task-trivial-1'],
      },
      // Medium - multi-component optimization
      {
        id: 'task-medium-1',
        name: 'Compose latency + memory optimization',
        difficulty: 'medium',
        component: 'optimizer',
        successThreshold: 80,
        timeLimit: 600,
        prerequisites: ['task-easy-1', 'task-easy-2'],
      },
      {
        id: 'task-medium-2',
        name: 'Predict next improvement target',
        difficulty: 'medium',
        component: 'predictor',
        successThreshold: 75,
        timeLimit: 600,
        prerequisites: ['task-easy-1'],
      },
      // Hard - complex scenarios
      {
        id: 'task-hard-1',
        name: 'Orchestrate 3-component optimization cycle',
        difficulty: 'hard',
        component: 'orchestrator',
        successThreshold: 70,
        timeLimit: 1200,
        prerequisites: ['task-medium-1', 'task-medium-2'],
      },
      {
        id: 'task-hard-2',
        name: 'Handle failure recovery in optimization',
        difficulty: 'hard',
        component: 'resilience',
        successThreshold: 80,
        timeLimit: 1200,
        prerequisites: ['task-medium-1'],
      },
      // Expert - mastery level
      {
        id: 'task-expert-1',
        name: 'Autonomous optimization loop (self-improving)',
        difficulty: 'expert',
        component: 'autonomous',
        successThreshold: 75,
        timeLimit: 3600,
        prerequisites: ['task-hard-1', 'task-hard-2'],
      },
    ]

    for (const task of tasks) {
      this.curriculum.set(task.id, task)
    }

    return tasks
  }

  /**
   * Get available tasks for current level
   */
  getAvailableTasks(): CurriculumTask[] {
    const available: CurriculumTask[] = []

    for (const task of this.curriculum.values()) {
      if (task.difficulty !== this.currentLevel) continue

      // Check if prerequisites are met
      const prereqsMet = task.prerequisites.every(p => this.completedTasks.has(p))
      if (prereqsMet && !this.completedTasks.has(task.id)) {
        available.push(task)
      }
    }

    return available
  }

  /**
   * Complete a task
   */
  async completeTask(taskId: string, successRate: number): Promise<boolean> {
    const task = this.curriculum.get(taskId)
    if (!task) return false

    const passed = successRate >= task.successThreshold

    this.progress.set(taskId, {
      taskId,
      completed: passed,
      successRate,
      attemptsNeeded: Math.floor(Math.random() * 5) + 1,
      masteredAt: passed ? Date.now() : 0,
    })

    if (passed) {
      this.completedTasks.add(taskId)

      // Check if we can advance to next level
      const nextLevel = this.getNextLevel(this.currentLevel)
      if (this.canAdvanceToLevel(nextLevel)) {
        this.currentLevel = nextLevel
      }

      return true
    }

    return false
  }

  /**
   * Calculate mastery score
   */
  getMasteryScore(): {
    overall: number
    byLevel: Record<DifficultyLevel, number>
    readyForNextLevel: boolean
  } {
    const levels: DifficultyLevel[] = ['trivial', 'easy', 'medium', 'hard', 'expert']
    const byLevel: Record<DifficultyLevel, number> = {
      trivial: 0,
      easy: 0,
      medium: 0,
      hard: 0,
      expert: 0,
    }

    for (const task of this.curriculum.values()) {
      const prog = this.progress.get(task.id)
      if (prog?.completed) {
        byLevel[task.difficulty] += prog.successRate
      }
    }

    // Normalize by task count
    for (const level of levels) {
      const taskCount = Array.from(this.curriculum.values()).filter(t => t.difficulty === level)
        .length
      if (taskCount > 0) {
        byLevel[level] = byLevel[level] / taskCount
      }
    }

    const overall = Object.values(byLevel).reduce((a, b) => a + b, 0) / levels.length

    const nextLevel = this.getNextLevel(this.currentLevel)
    const readyForNext = this.canAdvanceToLevel(nextLevel)

    return {
      overall,
      byLevel,
      readyForNextLevel: readyForNext,
    }
  }

  /**
   * Get next level
   */
  private getNextLevel(current: DifficultyLevel): DifficultyLevel {
    const levels: DifficultyLevel[] = ['trivial', 'easy', 'medium', 'hard', 'expert']
    const index = levels.indexOf(current)
    return levels[Math.min(index + 1, levels.length - 1)]
  }

  /**
   * Check if ready to advance
   */
  private canAdvanceToLevel(level: DifficultyLevel): boolean {
    const tasksAtLevel = Array.from(this.curriculum.values()).filter(t => t.difficulty === level)

    if (tasksAtLevel.length === 0) return false

    // Need 80% success rate at current level
    const levelTasks = Array.from(this.curriculum.values()).filter(
      t => t.difficulty === this.currentLevel
    )
    const completed = levelTasks.filter(t => this.completedTasks.has(t.id)).length
    const successRate = (completed / levelTasks.length) * 100

    return successRate >= 80
  }

  /**
   * Get curriculum state
   */
  getCurriculumState(): CurriculumState {
    const mastery = this.getMasteryScore()

    const nextLevel = this.getNextLevel(this.currentLevel)
    const nextTasks = Array.from(this.curriculum.values())
      .filter(t => t.difficulty === nextLevel && !this.completedTasks.has(t.id))
      .map(t => t.id)

    return {
      currentLevel: this.currentLevel,
      tasksCompleted: this.completedTasks.size,
      mastery: mastery.overall,
      nextUnlockedTasks: nextTasks.slice(0, 3),
    }
  }
}

export default CurriculumLearner
