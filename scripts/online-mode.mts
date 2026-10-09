/**
 * Level×mode online/offline matrix + token seal — one call, compact receipt.
 *
 *   npx tsx scripts/online-mode.mts              offline (local)
 *   npx tsx scripts/online-mode.mts --online     + host probe
 *   npm run online
 *   npm run mcp -- connector '{"offline":true}'
 *   npm run mcp -- connector '{"online":true}'
 */
import '../src/mcp/families.js'
import { onlineModeOf, waitsAuditOf, coolFormulasOf } from '../src/payload/plugins/tokens.js'

const online = process.argv.includes('--online')
const also = process.argv.includes('--waits') || process.argv.includes('--all')

const reading = await onlineModeOf(online ? { online: true } : { offline: true })
const out: Record<string, unknown> = {
  kind: reading.kind,
  call: reading.call,
  holds: reading.holds,
  goal: reading.goal,
  tokenSeal: reading.tokenSeal,
  connectBill: reading.connectBill,
  counts: reading.counts,
  matrix: reading.matrix,
  usage: (reading.usage as { target: { who: string }; bytes: number; llmTokens: number; sealed: boolean }[]).map((u) => ({
    who: u.target.who,
    bytes: u.bytes,
    llmTokens: u.llmTokens,
    sealed: u.sealed,
  })),
}

if (also) {
  const waits = waitsAuditOf({ verbosity: 1 })
  const cool = coolFormulasOf({})
  out.waits = { worst: waits.worst, rows: waits.rows.length, holds: waits.holds }
  out.cool = { millikelvin: cool.millikelvin, ways: cool.ways, cooling: cool.cooling, holds: cool.holds }
}

console.log(JSON.stringify(out, null, 2))
process.exit(reading.holds === true ? 0 : 1)
