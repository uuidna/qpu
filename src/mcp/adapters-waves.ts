// MCP Waves: Stream workflows and adapter chains via continuous execution
// Adapters call other adapters in waves, with state flowing through the pipeline

import { adapters, executeAdapterOperation, type AdapterName } from './adapters.js'

interface WaveStep {
  adapter: AdapterName
  operation: string
  config: unknown
  input?: unknown
  output?: unknown
  error?: string
  duration: number
}

interface Wave {
  id: string
  name: string
  steps: WaveStep[]
  status: 'pending' | 'running' | 'completed' | 'failed'
  startTime: Date
  endTime?: Date
  error?: string
  passThrough?: Map<string, unknown>
}

// Wave definitions: orchestrated adapter sequences
export const waves = {
  // Full CI/CD pipeline
  'full-ship': {
    name: 'Full Ship: code → git → github → zenodo → npm → deploy',
    steps: [
      { adapter: 'git' as AdapterName, operation: 'push', config: { repository: 'test/repo', branch: 'main', version: '2.0.0' } },
      { adapter: 'git' as AdapterName, operation: 'tag', config: { repository: 'test/repo', version: '2.0.0' } },
      { adapter: 'github' as AdapterName, operation: 'release', config: { owner: 'anthropics', repo: 'qpu', version: '2.0.0' } },
      { adapter: 'zenodo' as AdapterName, operation: 'register', config: { version: '2.0.0', title: 'QPU v2.0.0', description: 'Quantum Processing Unit', creators: [{ name: 'Anthropic' }], license: 'CC-BY-NC-ND-4.0', keywords: ['quantum', 'mcp'] } },
      { adapter: 'npm' as AdapterName, operation: 'publish', config: { package: '@uuidna/qpu', version: '2.0.0' } },
      { adapter: 'deploy' as AdapterName, operation: 'vercel', config: { version: '2.0.0', targets: ['vercel', 'railway', 'fly'] } },
    ],
  },

  // Quantum research stack
  'quantum-research': {
    name: 'Quantum Research: algorithm → circuit → simulate → optimize → deploy',
    steps: [
      { adapter: 'google-qualtran' as AdapterName, operation: 'compile', config: { algorithm: 'shor' } },
      { adapter: 'google-openfermion' as AdapterName, operation: 'to_circuit', config: { molecule: 'H2' } },
      { adapter: 'google-tensorflow-quantum' as AdapterName, operation: 'build_model', config: { model_type: 'qnn', layers: 3 } },
      { adapter: 'google-willow' as AdapterName, operation: 'submit_job', config: { circuit: {} } },
    ],
  },

  // Cross-cloud quantum testing
  'quantum-cloud-test': {
    name: 'Quantum Cloud Test: test on all platforms',
    steps: [
      { adapter: 'ibm-qiskit' as AdapterName, operation: 'submit', config: { backend: 'ibmq_manila', circuit: {} } },
      { adapter: 'aws-braket' as AdapterName, operation: 'submit', config: { device: 'tn1', circuit: {} } },
      { adapter: 'ionq' as AdapterName, operation: 'submit', config: { circuit: {}, target: 'harmony' } },
      { adapter: 'rigetti' as AdapterName, operation: 'run', config: { program: 'H 0\nMEASURE 0 ro[0]', device: 'Aspen-M-2' } },
    ],
  },
}

// Execute a wave
export async function executeWave(waveName: keyof typeof waves): Promise<Wave> {
  const definition = waves[waveName]
  const wave: Wave = {
    id: `${waveName}-${Date.now()}`,
    name: definition.name,
    steps: [],
    status: 'running',
    startTime: new Date(),
    passThrough: new Map(),
  }

  try {
    for (const stepDef of definition.steps) {
      const stepStart = Date.now()

      try {
        // Pass input from previous step if available
        const config = wave.passThrough?.get(`${stepDef.adapter}/${stepDef.operation}`) || stepDef.config

        const output = executeAdapterOperation(stepDef.adapter, stepDef.operation, config)

        const step: WaveStep = {
          adapter: stepDef.adapter,
          operation: stepDef.operation,
          config,
          output,
          duration: Date.now() - stepStart,
        }

        wave.steps.push(step)

        // Store output for next step
        if (output && typeof output === 'object') {
          wave.passThrough?.set(`${stepDef.adapter}/${stepDef.operation}`, output)
        }
      } catch (error) {
        const step: WaveStep = {
          adapter: stepDef.adapter,
          operation: stepDef.operation,
          config: stepDef.config,
          error: String(error),
          duration: Date.now() - stepStart,
        }

        wave.steps.push(step)
        wave.status = 'failed'
        wave.error = `Step failed: ${stepDef.adapter}.${stepDef.operation}()`
        break
      }
    }

    if (wave.status !== 'failed') {
      wave.status = 'completed'
    }
  } catch (error) {
    wave.status = 'failed'
    wave.error = String(error)
  }

  wave.endTime = new Date()
  return wave
}

// Stream waves continuously
export async function streamWaves(waveNames: (keyof typeof waves)[], intervalMs: number = 0): Promise<void> {
  for (const waveName of waveNames) {
    console.log(`\n${'═'.repeat(70)}`)
    console.log(`EXECUTING WAVE: ${waves[waveName].name}`)
    console.log('═'.repeat(70) + '\n')

    const wave = await executeWave(waveName)

    // Print wave results
    wave.steps.forEach((step, i) => {
      const icon = step.error ? '✗' : '✓'
      console.log(`${icon} Step ${i + 1}: ${step.adapter}.${step.operation}()`)
      console.log(`  Duration: ${step.duration}ms`)

      if (step.error) {
        console.log(`  Error: ${step.error}`)
      } else if (step.output) {
        console.log(`  Result: ${JSON.stringify(step.output).substring(0, 100)}...`)
      }
    })

    console.log(
      `\n${wave.status === 'completed' ? '✓' : '✗'} Wave ${wave.status} in ${(wave.endTime!.getTime() - wave.startTime.getTime()) / 1000}s\n`,
    )

    if (intervalMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, intervalMs))
    }
  }
}

// Stream report
export function generateWaveReport(wave: Wave): string {
  let report = `\nWave: ${wave.name}\n`
  report += `ID: ${wave.id}\n`
  report += `Status: ${wave.status}\n`
  report += `Duration: ${((wave.endTime?.getTime() || Date.now()) - wave.startTime.getTime()) / 1000}s\n\n`

  wave.steps.forEach((step, i) => {
    const icon = step.error ? '✗' : '✓'
    report += `${icon} ${i + 1}. ${step.adapter}.${step.operation}()\n`
    report += `   Time: ${step.duration}ms\n`
    if (step.error) {
      report += `   Error: ${step.error}\n`
    }
  })

  if (wave.error) {
    report += `\nError: ${wave.error}\n`
  }

  return report
}
