/**
 * MCP Core - Ultra-minimal unified interface
 * Maximum efficiency, minimum tokens, zero redundancy
 */

import { uuid } from '../core/uuid.js'
import { registry } from '../core/ops.js'
import { obs } from '../core/obs.js'
import { cache } from '../core/cache.js'
import { health, setupDefaultChecks } from '../core/health.js'
import { limit } from '../core/limit.js'
import { circuitBreaker, bulkhead } from '../patterns/resilience.js'
import { anomaly, autoScale, costOpt } from '../ml/auto.js'
import { runAutonomousGapFilling } from './auto-gap-fill.js'

type Handler = (args: string[]) => Promise<void>

// ============================================================================
// UNIFIED SYSTEM STATE
// ============================================================================

const sys = {
  uuid,
  ops: registry,
  obs,
  cache,
  health,
  limit,
  cb: circuitBreaker,
  bulkhead,
  anomaly,
  scale: autoScale,
  cost: costOpt
}

// ============================================================================
// COMMANDS: Single unified handler
// ============================================================================

const cmd: Record<string, Handler> = {
  // STATUS COMMANDS (merged)
  status: async () => console.log(`
🟢 SYSTEM STATUS
UUID: ${sys.uuid.stats().total} | Ops: ${registry.list().length} | Health: ${(await sys.health.ok()) ? '✓' : '✗'}
Throughput: ${sys.obs.system().tps.toFixed(1)}/s | P99: ${sys.obs.system().peak}ms | Cache: ${(sys.obs.system().cache * 100).toFixed(0)}%
CB: ${sys.cb.isClosed() ? 'CLOSED' : 'OPEN'} | Bulkhead: ${sys.bulkhead.stats().active}/${sys.bulkhead.stats().available}
`),

  health: async () => {
    setupDefaultChecks()
    const st = await sys.health.status()
    console.log(`${st.ok ? '🟢' : '🔴'} ${st.msg}\n${Array.from(st.checks.entries()).map(([n, o]) => `${o ? '✓' : '✗'} ${n}`).join('\n')}`)
  },

  uuid: async () => {
    const st = sys.uuid.stats()
    console.log(`UUID: ${st.total} total | ${st.domains} domains`)
  },

  ops: async () => {
    const all = registry.list()
    const st = registry.stats()
    console.log(`Operations: ${all.length} | Domains: ${Object.entries(st.byDomain).map(([k, v]) => `${k}:${v}`).join(' ')}`)
  },

  obs: async () => {
    const s = sys.obs.system()
    console.log(`Throughput: ${s.tps.toFixed(1)}/s | Latency P99: ${s.peak}ms | Cache: ${(s.cache * 100).toFixed(0)}% | Conns: ${s.conn}`)
  },

  limit: async () => {
    const st = sys.limit.stats()
    console.log(`Rate Limit: ${Object.keys(st).length} quotas tracked`)
  },

  cache: async () => {
    console.log(`Cache: LRU utility available for ops memoization`)
  },

  resilience: async () => {
    console.log(`CB: ${sys.cb.isClosed() ? 'CLOSED' : sys.cb.isOpen() ? 'OPEN' : 'HALF-OPEN'} | BH: ${sys.bulkhead.stats().active} active/${sys.bulkhead.stats().available} avail`)
  },

  ml: async () => {
    console.log(`Anomaly: Ready | AutoScale: ${sys.scale.stats().current}/${sys.scale.stats().max} | CostOpt: Ready`)
  },

  gaps: async () => {
    const result = await runAutonomousGapFilling()
    console.log(`\n✅ Gap filling complete: ${result.gapsFilled}/${result.gapsDiscovered} gaps filled`)
  },

  // ALIASES & SHORTCUTS
  st: async (a) => cmd.status(a),
  h: async (a) => cmd.health(a),
  u: async (a) => cmd.uuid(a),
  op: async (a) => cmd.ops(a),
  o: async (a) => cmd.obs(a),
  r: async (a) => cmd.resilience(a),
  m: async (a) => cmd.ml(a),
  g: async (a) => cmd.gaps(a),

  help: async () => console.log(`
MCP CORE - Unified Handler

Commands: status health uuid ops obs limit cache resilience ml gaps
Aliases: st h u op o r m g
Usage: npm run mcp -- <cmd>

Examples:
  npm run status           # Full system overview
  npm run health           # Health checks
  npm run mcp -- help      # This help
`)
}

// ============================================================================
// ROUTER: Single entry point
// ============================================================================

export async function route(args: string[]): Promise<void> {
  // Integration operations exported from integrations-ops.ts

  const c = args[0] || 'status'
  const h = cmd[c] || cmd.status
  await h(args.slice(1))
}

// Standalone execution
const args = process.argv.slice(2)
route(args).catch(e => {
  console.error('Error:', e.message)
  process.exit(1)
})
