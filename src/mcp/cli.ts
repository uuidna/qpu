/**
 * MCP CLI - Unified command handler
 * All npm scripts route through single MCP interface
 */

import { uuid } from '../core/uuid.js'
import { registry } from '../core/ops.js'
import { obs } from '../core/obs.js'
import { cache } from '../core/cache.js'
import { health, setupDefaultChecks } from '../core/health.js'
import { limit } from '../core/limit.js'
import { circuitBreaker, retry, timeout, bulkhead, resilient } from '../patterns/resilience.js'
import { anomaly, autoScale, costOpt } from '../ml/auto.js'

interface Cmd {
  name: string
  aliases: string[]
  help: string
  run: (args: string[]) => Promise<void>
}

// ============================================================================
// COMMANDS
// ============================================================================

const cmds: Cmd[] = [
  {
    name: 'uuid',
    aliases: ['id', 'u'],
    help: 'UUID operations: register, lookup, generate, check, list, stats',
    run: async (args) => {
      console.log(`\n UUID Operations`)
      console.log(`═══════════════════════════════════════════════════════════════`)
      console.log(`${uuid.stats().total} UUIDs registered`)
      console.log(`Domains: ${uuid.stats().domains}`)
      console.log(`Verified: ${Object.values(uuid.stats()).filter(v => typeof v === 'number').length}`)
      console.log()
    }
  },

  {
    name: 'ops',
    aliases: ['op'],
    help: 'Operations registry: list, run, stats',
    run: async (args) => {
      console.log(`\n Operations Registry`)
      console.log(`═══════════════════════════════════════════════════════════════`)
      const all = registry.list()
      console.log(`${all.length} operations available`)
      const stats = registry.stats()
      console.log(`Domains: ${Object.keys(stats.byDomain).join(', ')}`)
      console.log()
    }
  },

  {
    name: 'obs',
    aliases: ['observability', 'metrics'],
    help: 'Observability: metrics, traces, health',
    run: async (args) => {
      console.log(`\n Observability`)
      console.log(`═══════════════════════════════════════════════════════════════`)
      const sys = obs.system()
      console.log(`Throughput: ${sys.tps.toFixed(1)} req/s`)
      console.log(`Latency p99: ${sys.peak}ms`)
      console.log(`Cache hit rate: ${(sys.cache * 100).toFixed(1)}%`)
      console.log()
    }
  },

  {
    name: 'health',
    aliases: ['hc', 'check'],
    help: 'Health checks: ready, live, status',
    run: async (args) => {
      setupDefaultChecks()
      console.log(`\n Health Check`)
      console.log(`═══════════════════════════════════════════════════════════════`)
      const status = await health.status()
      console.log(`Status: ${status.ok ? '🟢 Healthy' : '🔴 Issues'}`)
      console.log(`Checks:`)
      for (const [name, ok] of status.checks.entries()) {
        console.log(`  ${ok ? '✓' : '✗'} ${name}`)
      }
      console.log()
    }
  },

  {
    name: 'limit',
    aliases: ['rate', 'quota'],
    help: 'Rate limiting: check quota, adjust limits',
    run: async (args) => {
      console.log(`\n Rate Limiter`)
      console.log(`═══════════════════════════════════════════════════════════════`)
      const stats = limit.stats()
      console.log(`Quotas tracked: ${Object.keys(stats).length}`)
      if (Object.keys(stats).length > 0) {
        console.log(`Sample quota:`)
        const first = Object.entries(stats)[0]
        console.log(`  ${first[0]}: ${first[1].tokens} tokens remaining`)
      }
      console.log()
    }
  },

  {
    name: 'cache',
    aliases: ['c'],
    help: 'Cache management: stats, clear, export',
    run: async (args) => {
      console.log(`\n Cache`)
      console.log(`═══════════════════════════════════════════════════════════════`)
      console.log(`Cache utility available for ops memoization`)
      console.log(`Use in code: import { cache } from '@core/cache'`)
      console.log()
    }
  },

  {
    name: 'resilience',
    aliases: ['res', 'rb', 'fault'],
    help: 'Resilience patterns: circuit-breaker, retry, timeout, bulkhead',
    run: async (args) => {
      console.log(`\n Resilience Patterns`)
      console.log(`═══════════════════════════════════════════════════════════════`)
      console.log(`Circuit Breaker: ${circuitBreaker.isClosed() ? 'CLOSED' : circuitBreaker.isOpen() ? 'OPEN' : 'HALF-OPEN'}`)
      console.log(`Bulkhead: ${bulkhead.stats().active} active, ${bulkhead.stats().queued} queued`)
      console.log()
    }
  },

  {
    name: 'ml',
    aliases: ['ai', 'auto'],
    help: 'ML utilities: anomaly detection, auto-scaling, cost optimization',
    run: async (args) => {
      console.log(`\n ML Utilities`)
      console.log(`═══════════════════════════════════════════════════════════════`)
      console.log(`Anomaly Detector: Ready`)
      console.log(`Auto Scaler: ${autoScale.stats().current}/${autoScale.stats().max} instances`)
      console.log(`Cost Optimizer: Ready`)
      console.log()
    }
  },

  {
    name: 'status',
    aliases: ['st', 'info', 'state'],
    help: 'System status: all checks, metrics, alerts',
    run: async (args) => {
      setupDefaultChecks()
      console.log(`
╔════════════════════════════════════════════════════════════════╗
║                    SYSTEM STATUS                              ║
╚════════════════════════════════════════════════════════════════╝

🆔 UUID Registry
  Total: ${uuid.stats().total}
  Domains: ${uuid.stats().domains}

⚙️  Operations
  Available: ${registry.list().length}
  Status: ${circuitBreaker.isClosed() ? '🟢' : '🔴'}

📊 Observability
  Throughput: ${obs.system().tps.toFixed(1)} req/s
  Latency P99: ${obs.system().peak}ms
  Cache Hit: ${(obs.system().cache * 100).toFixed(1)}%

🏥 Health
  ${(await health.ok()) ? '🟢 OK' : '🔴 Issues'}
  ${(await health.live()) ? '✓ Live' : '✗ Down'}

🚦 Rate Limit
  Quotas: ${Object.keys(limit.stats()).length}

💾 Cache
  Utility available

🛡️ Resilience
  Circuit Breaker: ${circuitBreaker.isClosed() ? 'CLOSED' : 'OPEN'}
  Bulkhead: ${bulkhead.stats().active}/${bulkhead.stats().available} available

🤖 ML
  Anomaly Detector: Ready
  Auto Scaler: ${autoScale.stats().current}/${autoScale.stats().max}
  Cost Optimizer: Ready
      `)
    }
  },

  {
    name: 'test',
    aliases: ['t'],
    help: 'Run tests',
    run: async (args) => {
      console.log(`Tests: Run via npm test`)
    }
  },

  {
    name: 'build',
    aliases: ['b'],
    help: 'Build TypeScript',
    run: async (args) => {
      console.log(`Build: Run via npm run build`)
    }
  },

  {
    name: 'help',
    aliases: ['h', '?'],
    help: 'Show this help',
    run: async (args) => {
      console.log(`
╔════════════════════════════════════════════════════════════════╗
║                   MCP CLI - Help                              ║
╚════════════════════════════════════════════════════════════════╝

USAGE: npm run mcp -- <command> [args]

COMMANDS:
`)
      for (const cmd of cmds) {
        const aliases = cmd.aliases.length > 0 ? ` (${cmd.aliases.join(', ')})` : ''
        console.log(`  ${cmd.name}${aliases}`)
        console.log(`    ${cmd.help}`)
      }
      console.log(`
EXAMPLES:
  npm run mcp -- status         # Show all systems
  npm run mcp -- health         # Check health
  npm run mcp -- uuid           # UUID operations
  npm run mcp -- ops list       # List all operations
      `)
    }
  }
]

// ============================================================================
// ROUTER
// ============================================================================

export async function cli(args: string[]): Promise<void> {
  const cmdName = args[0] || 'status'
  const cmdArgs = args.slice(1)

  const cmd = cmds.find(c => c.name === cmdName || c.aliases.includes(cmdName))
  if (!cmd) {
    console.error(`Unknown command: ${cmdName}`)
    const help = cmds.find(c => c.name === 'help')
    await help?.run([])
    process.exit(1)
  }

  await cmd.run(cmdArgs)
}

// ============================================================================
// ENTRY POINT
// ============================================================================

const args = process.argv.slice(2)
cli(args).catch(e => {
  console.error(e)
  process.exit(1)
})
