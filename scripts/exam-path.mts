/**
 * Bidirectional MCP path exam (inside-out + outside-in).
 * Forces exit after print so a timed-out clay.pass discover cannot keep the process alive.
 *
 *   npx tsx scripts/exam-path.mts
 *   npm run mcp -- connector '{"exam":true}'
 */
import '../src/mcp/families.js'
import { examOf } from '../src/payload/plugins/exam.js'

const reading = await examOf()
console.log(JSON.stringify({
  kind: reading.kind,
  maps: reading.maps,
  passBudgetMs: reading.passBudgetMs,
  counts: reading.counts,
  healthy: reading.healthy,
  blindSpots: reading.blindSpots,
  clayPass: reading.clayPass,
  connectBill: reading.connectBill,
  monitoring: reading.monitoring,
  holds: reading.holds,
  goal: reading.goal,
  hops: reading.hops.map((h) => ({
    dir: h.dir,
    layer: h.layer,
    door: h.door,
    tool: h.tool,
    family: h.family,
    formula: h.formula,
    ms: h.ms,
    holds: h.holds,
    value: h.value,
    timeout: h.timeout,
    error: h.error,
    silent: h.silent,
    note: h.note,
  })),
}, null, 2))

process.exit(0)
