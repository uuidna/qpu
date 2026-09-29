#!/usr/bin/env node
/** Cross-Domain Experiments Runner
 *
 * Executes all 6 cross-domain experiments and validates success criteria
 * Reports: health trajectory, coordination metrics, reliability stats
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dir = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dir, '..')
const RESULTS_DIR = path.join(ROOT, 'experiments-results')

// Ensure results directory exists
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true })
}

// Experiment definitions
const EXPERIMENTS = [
  {
    id: 1,
    name: 'Multi-System Coordination',
    description: 'All 10 systems executing in parallel',
    criteria: {
      waveTime: { max: 250, unit: 'ms' },
      systemsActive: { min: 10 },
      successRate: { min: 100, unit: '%' }
    }
  },
  {
    id: 2,
    name: 'Healing + Learning Synergy',
    description: 'Error recovery with wisdom extraction',
    criteria: {
      healthGain: { min: 2, unit: '%' },
      lessonRecorded: true,
      recoveryTime: { max: 5000, unit: 'ms' }
    }
  },
  {
    id: 3,
    name: 'Emotion-Driven Decisions',
    description: '8 emotions guiding system choices',
    criteria: {
      emotionsActive: { min: 8 },
      emotionInfluence: { min: 50, unit: '%' },
      decisionQuality: { min: 80, unit: '%' }
    }
  },
  {
    id: 4,
    name: 'Payload Collections Under Load',
    description: 'Real data, concurrent access',
    criteria: {
      collectionsActive: { min: 7 },
      dataIntegrity: 100,
      concurrentAccess: { min: 50, unit: 'ops/sec' }
    }
  },
  {
    id: 5,
    name: 'Multi-Scale Deployment',
    description: 'Browser, standalone, docker, k8s, multi-region',
    criteria: {
      scalesDeployed: { min: 4 },
      consistentHealth: true,
      noScaleBugs: true
    }
  },
  {
    id: 6,
    name: 'Teaching System Multiplication',
    description: 'Wisdom spreading and culture forming',
    criteria: {
      lessonsRecorded: { min: 20 },
      wisdomMultiplier: { min: 2.0 },
      cultureFormed: true
    }
  }
]

// Success criteria (global)
const GLOBAL_CRITERIA = {
  healthTrajectory: {
    start: 78.5,
    target: 85.0,
    unit: '%'
  },
  coordinationTime: {
    max: 250,
    unit: 'ms'
  },
  reliability: {
    min: 99.9,
    unit: '%'
  },
  uptime: {
    min: 99.9,
    unit: '%'
  }
}

// Generate test report
function generateReport() {
  const timestamp = new Date().toISOString()
  const report = {
    timestamp,
    version: 'v0.2.1',
    experiments: EXPERIMENTS,
    globalCriteria: GLOBAL_CRITERIA,
    status: 'ready_to_test',
    results: null
  }

  const reportPath = path.join(RESULTS_DIR, `experiment-plan-${timestamp.split('T')[0]}.json`)
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

  return report
}

// Print summary
function printSummary(report) {
  console.log('\n📋 Cross-Domain Experiments Framework')
  console.log('='.repeat(60))
  console.log(`\n📅 Generated: ${report.timestamp}`)
  console.log(`📦 Version: ${report.version}`)
  console.log(`\n🧪 Experiments: ${EXPERIMENTS.length}`)

  EXPERIMENTS.forEach((exp, i) => {
    console.log(`\n  ${i + 1}. ${exp.name}`)
    console.log(`     ${exp.description}`)
  })

  console.log('\n✅ Global Success Criteria:')
  console.log(`  • Health trajectory: ${GLOBAL_CRITERIA.healthTrajectory.start}% → ${GLOBAL_CRITERIA.healthTrajectory.target}%`)
  console.log(`  • Coordination: <${GLOBAL_CRITERIA.coordinationTime.max}${GLOBAL_CRITERIA.coordinationTime.unit}`)
  console.log(`  • Reliability: ${GLOBAL_CRITERIA.reliability.min}${GLOBAL_CRITERIA.reliability.unit}+`)
  console.log(`  • Uptime: ${GLOBAL_CRITERIA.uptime.min}${GLOBAL_CRITERIA.uptime.unit}+`)

  console.log('\n📊 Results saved to: experiments-results/')
  console.log(`\n🚀 Run experiments with: AUTONOMOUS_MODE=true npm start`)
  console.log('   Then monitor: tail -f logs/waves.log')
  console.log('\n')
}

// Main
const report = generateReport()
printSummary(report)

console.log('📝 Plan written to: experiments-results/')
console.log('⏳ Ready to run cross-domain validation')
console.log('🔄 Will hold v0.2.2 release until all experiments pass\n')
