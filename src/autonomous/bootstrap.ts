/**
 * Autonomous System Bootstrap
 *
 * Initializes and starts the autonomous wave system
 * Integrates with Payload CMS for continuous operation
 *
 * "Stopping is a crack itself"
 * The system never stops, continuously improves, asks "what's next?" infinitely
 */

import type { Payload } from 'payload'
import { startAutonomousWaves } from './wave-coordinator'

/**
 * Bootstrap autonomous system on startup
 */
export async function bootstrapAutonomousSystem(payload: Payload): Promise<void> {
  console.log('🚀 Bootstrapping autonomous system...')

  // Start autonomous wave coordinator
  const coordinator = await startAutonomousWaves(payload)

  console.log('✅ Autonomous system bootstrapped')
  console.log('🌊 Wave-based continuous improvement started')
  console.log('📈 System will never stop improving')

  // Log status every hour
  setInterval(() => {
    const status = coordinator.getCurrentStatus()
    console.log(`📊 Wave ${status.waveNumber} | Active: ${status.isRunning} | Systems: ${status.systemsActive}`)

    if (status.lastWave) {
      console.log(`   Health: ${(status.lastWave.health.overall * 100).toFixed(1)}% | Improvements: ${status.lastWave.improvements.length}`)
    }
  }, 3600000) // Every hour
}

/**
 * Integration point for Payload server startup
 */
export function integrateWithPayload(payload: Payload): void {
  // Hook into server initialization
  if (process.env.NODE_ENV === 'production' || process.env.AUTONOMOUS_MODE === 'true') {
    bootstrapAutonomousSystem(payload).catch(error => {
      console.error('Failed to bootstrap autonomous system:', error)
      // Non-fatal: system can run without autonomous mode
    })
  }
}

export default bootstrapAutonomousSystem
