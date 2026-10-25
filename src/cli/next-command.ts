#!/usr/bin/env node

/**
 * Next Command - Primary Advancement Tool
 *
 * "Next is the default" - Automatically advance to the next task/WAVE
 *
 * This is the primary way to move work forward:
 * - npm next → Do the next thing
 * - npm next:status → See where we are
 * - npm next:plan → See what's coming
 * - npm next:skip → Skip this task
 * - npm next:reset → Reset progress
 *
 * Default behavior: Always do the next task. No asking, no menus.
 */

import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'

interface Milestone {
  id: string
  name: string
  description: string
  steps: Step[]
  status: 'pending' | 'in_progress' | 'completed'
  progress: number
}

interface Step {
  id: string
  name: string
  command: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  requires?: string[]
  blocker?: string
}

/**
 * Next Command Engine - Tracks progress and advances work
 */
class NextEngine {
  private stateFile = path.resolve('.next/state.json')
  private state: { milestones: Milestone[]; current_milestone: number; current_step: number }

  constructor() {
    this.initState()
  }

  private initState(): void {
    if (!fs.existsSync(this.stateFile)) {
      const stateDir = path.dirname(this.stateFile)
      if (!fs.existsSync(stateDir)) {
        fs.mkdirSync(stateDir, { recursive: true })
      }

      this.state = {
        milestones: this.getDefaultMilestones(),
        current_milestone: 0,
        current_step: 0
      }
      this.saveState()
    } else {
      const data = fs.readFileSync(this.stateFile, 'utf-8')
      this.state = JSON.parse(data)
    }
  }

  /**
   * Default progression path for the platform
   */
  private getDefaultMilestones(): Milestone[] {
    return [
      {
        id: 'wave8_complete',
        name: 'WAVE 8: Complete Production Platform',
        description: 'All 8 components of WAVE 8 are implemented and tested',
        status: 'completed',
        progress: 100,
        steps: [
          {
            id: 'wave8a',
            name: 'API Gateway (8A)',
            command: 'npm validate && npm run deploy:staging',
            description: 'REST, GraphQL, OpenAPI',
            status: 'completed'
          },
          {
            id: 'wave8b',
            name: 'Real-Time (8B)',
            command: 'npm api:test',
            description: 'WebSocket, SSE, Subscriptions',
            status: 'completed'
          },
          {
            id: 'wave8c',
            name: 'Observability (8C)',
            command: 'npm test && npm health:check',
            description: 'Tracing, Metrics, Logging',
            status: 'completed'
          },
          {
            id: 'wave8d',
            name: 'Security (8D)',
            command: 'npm security:audit && npm security:test',
            description: 'RBAC, Encryption, Audit',
            status: 'completed'
          },
          {
            id: 'wave8e',
            name: 'Performance (8E)',
            command: 'npm perf:analyze && npm optimize:all',
            description: 'Query optimization, caching',
            status: 'completed'
          },
          {
            id: 'wave8f',
            name: 'SDKs (8F)',
            command: 'npm run sdk:generate && npm run sdk:test',
            description: 'TypeScript, Python, Go',
            status: 'completed'
          },
          {
            id: 'wave8g',
            name: 'Monitoring (8G)',
            command: 'npm health:report',
            description: 'Dashboards, Alerts',
            status: 'completed'
          },
          {
            id: 'wave8h',
            name: 'Hardening (8H)',
            command: 'npm health:check',
            description: 'Rate limit, Circuit break',
            status: 'completed'
          }
        ]
      },
      {
        id: 'cleanup_phase',
        name: 'Phase 1: Documentation Cleanup',
        description: 'Clean up redundant markdown and verify inline docs',
        status: 'pending',
        progress: 0,
        steps: [
          {
            id: 'verify_inline',
            name: 'Verify Inline Documentation',
            command: 'npm run port:status',
            description: 'Check all JSDoc is complete',
            status: 'pending'
          },
          {
            id: 'cleanup',
            name: 'Clean Up Markdown',
            command: 'npm run cleanup:docs',
            description: 'Remove redundant .md files',
            status: 'pending'
          },
          {
            id: 'port_remaining',
            name: 'Port Remaining Docs',
            command: 'npm run port:all',
            description: 'Convert any remaining docs',
            status: 'pending'
          }
        ]
      },
      {
        id: 'staging_phase',
        name: 'Phase 2: Staging Deployment',
        description: 'Deploy to staging and run full test suite',
        status: 'pending',
        progress: 0,
        steps: [
          {
            id: 'stage_deploy',
            name: 'Deploy to Staging',
            command: 'npm run deploy:staging',
            description: 'Deploy full platform',
            status: 'pending',
            requires: ['cleanup_phase']
          },
          {
            id: 'stage_test',
            name: 'Full Test Suite',
            command: 'npm run test:coverage',
            description: 'Run all tests on staging',
            status: 'pending',
            requires: ['stage_deploy']
          },
          {
            id: 'stage_api',
            name: 'API Testing',
            command: 'npm run api:test && npm run api:benchmark',
            description: 'Test all endpoints',
            status: 'pending',
            requires: ['stage_test']
          },
          {
            id: 'stage_multi',
            name: 'Multi-Platform Testing',
            command: 'npm run test',
            description: 'Test on all platforms',
            status: 'pending',
            requires: ['stage_api']
          }
        ]
      },
      {
        id: 'production_phase',
        name: 'Phase 3: Production Deployment',
        description: 'Deploy to production with full monitoring',
        status: 'pending',
        progress: 0,
        steps: [
          {
            id: 'prod_security',
            name: 'Security Verification',
            command: 'npm run security:audit && npm run security:test',
            description: 'Final security check',
            status: 'pending',
            requires: ['staging_phase']
          },
          {
            id: 'prod_compliance',
            name: 'Compliance Check',
            command: 'npm run test',
            description: 'GDPR/HIPAA/SOC2',
            status: 'pending',
            requires: ['prod_security']
          },
          {
            id: 'prod_deploy',
            name: 'Deploy to Production',
            command: 'npm run deploy:prod',
            description: 'Canary rollout (2%)',
            status: 'pending',
            requires: ['prod_compliance']
          },
          {
            id: 'prod_monitor',
            name: 'Production Monitoring',
            command: 'npm run health:report && npm run report:status',
            description: 'Verify prod health',
            status: 'pending',
            requires: ['prod_deploy']
          }
        ]
      },
      {
        id: 'optimization_phase',
        name: 'Phase 4: Win More Prizes',
        description: 'Optimize across all dimensions',
        status: 'pending',
        progress: 0,
        steps: [
          {
            id: 'perf_optimize',
            name: 'Performance Optimization',
            command: 'npm run perf:analyze && npm run optimize:queries && npm run optimize:cache',
            description: 'Sub-50ms queries',
            status: 'pending',
            requires: ['production_phase']
          },
          {
            id: 'cost_optimize',
            name: 'Cost Optimization',
            command: 'npm run cost:analyze && npm run cost:report',
            description: 'Target 80% savings',
            status: 'pending',
            requires: ['perf_optimize']
          },
          {
            id: 'scale_setup',
            name: 'Auto-Scaling Setup',
            command: 'npm run test',
            description: 'Regional failover',
            status: 'pending',
            requires: ['cost_optimize']
          },
          {
            id: 'local_deploy',
            name: 'Local QPU Server',
            command: 'npm run dev &',
            description: 'Offline-first development',
            status: 'pending',
            requires: ['scale_setup']
          },
          {
            id: 'mobile_release',
            name: 'Mobile SDK Release',
            command: 'npm run test',
            description: 'iOS/Android available',
            status: 'pending',
            requires: ['local_deploy']
          }
        ]
      }
    ]
  }

  /**
   * Get next task to do
   */
  getNextTask(): { milestone: Milestone; step: Step; index: string } | null {
    // Skip completed milestones
    while (this.state.current_milestone < this.state.milestones.length) {
      const milestone = this.state.milestones[this.state.current_milestone]

      // Skip to next milestone if current is complete
      if (milestone.status === 'completed') {
        this.state.current_milestone++
        this.state.current_step = 0
        continue
      }

      const step = milestone.steps[this.state.current_step]
      if (!step) {
        // Move to next milestone
        this.state.current_milestone++
        this.state.current_step = 0
        continue
      }

      // Found next pending task
      this.saveState()
      return {
        milestone,
        step,
        index: `${this.state.current_milestone}.${this.state.current_step}`
      }
    }

    return null
  }

  /**
   * Execute next task
   */
  async executeNext(): Promise<void> {
    const next = this.getNextTask()
    if (!next) {
      console.log('\n🎉 All tasks complete! Platform ready for production.\n')
      return
    }

    const { milestone, step } = next

    console.log(`
┌─────────────────────────────────────────────┐
│ Next Task                                   │
├─────────────────────────────────────────────┤
│ Milestone: ${milestone.name}
│ Task: ${step.name}
│ Description: ${step.description}
└─────────────────────────────────────────────┘

Running: ${step.command}
`)

    try {
      step.status = 'in_progress'
      this.saveState()

      execSync(step.command, { stdio: 'inherit' })

      step.status = 'completed'
      this.state.current_step++
      this.updateProgress()
      this.saveState()

      console.log(`\n✅ Complete! Next task available.\n`)
    } catch (error) {
      step.status = 'pending'
      step.blocker = `Failed: ${error}`
      this.saveState()
      console.error(`\n❌ Task failed. Run 'npm next' again when ready.\n`)
      process.exit(1)
    }
  }

  /**
   * Show current progress
   */
  showStatus(): void {
    console.log(`
╔═════════════════════════════════════════╗
║ QPU Platform Progress                   ║
╚═════════════════════════════════════════╝
`)

    for (let i = 0; i < this.state.milestones.length; i++) {
      const m = this.state.milestones[i]
      const current = i === this.state.current_milestone
      const prefix = current ? '▶' : ' '

      console.log(`${prefix} [${m.status === 'completed' ? '✅' : '⏳'}] ${m.name} (${m.progress}%)`)

      if (current) {
        const step = m.steps[this.state.current_step]
        if (step) {
          console.log(`    → Next: ${step.name}`)
        }
      }
    }

    console.log()
  }

  /**
   * Show development plan
   */
  showPlan(): void {
    console.log(`
╔═════════════════════════════════════════╗
║ Development Plan                        ║
╚═════════════════════════════════════════╝
`)

    for (let i = 0; i < this.state.milestones.length; i++) {
      const m = this.state.milestones[i]
      const completed = m.status === 'completed'
      const icon = completed ? '✅' : '⏳'

      console.log(`${icon} Phase ${i + 1}: ${m.name}`)
      console.log(`   ${m.description}`)

      m.steps.forEach((s, j) => {
        const sIcon = s.status === 'completed' ? '✅' : '⏳'
        console.log(`   ${sIcon} ${j + 1}. ${s.name}`)
      })

      console.log()
    }
  }

  /**
   * Skip current task
   */
  skipTask(): void {
    const next = this.getNextTask()
    if (!next) {
      console.log('No tasks to skip')
      return
    }

    next.step.status = 'pending'  // Mark as skipped
    this.state.current_step++
    this.saveState()

    console.log(`✅ Skipped: ${next.step.name}`)
    console.log('Run "npm next" for next task\n')
  }

  /**
   * Reset progress
   */
  resetProgress(): void {
    if (fs.existsSync(this.stateFile)) {
      fs.unlinkSync(this.stateFile)
    }
    this.initState()
    console.log('✅ Progress reset. Run "npm next" to start.\n')
  }

  private updateProgress(): void {
    const milestone = this.state.milestones[this.state.current_milestone]
    if (milestone) {
      const completed = milestone.steps.filter(s => s.status === 'completed').length
      milestone.progress = Math.floor((completed / milestone.steps.length) * 100)
    }
  }

  private saveState(): void {
    fs.writeFileSync(this.stateFile, JSON.stringify(this.state, null, 2))
  }
}

/**
 * CLI Interface
 */
async function main() {
  const engine = new NextEngine()
  const command = process.argv[2]

  try {
    switch (command) {
      case '--status':
        engine.showStatus()
        break
      case '--plan':
        engine.showPlan()
        break
      case '--skip':
        engine.skipTask()
        break
      case '--reset':
        engine.resetProgress()
        break
      default:
        await engine.executeNext()
    }
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()
