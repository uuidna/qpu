// Long single tasks split into short multitasks: a step that fetches or imagines a list runs as n shards at once, each taking
// every n-th item (QPU_SHARD=i/n) and leaving what it settled in .qpu/cache/<name>.shard-<i>.json, then one merge run
// (QPU_SHARD=merge) gathers every shard's file and writes the step's artefacts. Without QPU_SHARD a step runs whole, as before.
import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { handle } from '../src/quantum/mcp.ts'

type Shard = { index: number; count: number } | 'merge' | null
const DIR = join(process.cwd(), '.qpu', 'cache')
const SHARD: Shard = (() => { const v = process.env.QPU_SHARD; if (!v) return null; if (v === 'merge') return 'merge'; const m = /^(\d+)\/(\d+)$/.exec(v); return m ? { index: Number(m[1]), count: Number(m[2]) } : null })()
export const isShard = SHARD !== null && SHARD !== 'merge'
export const isMerge = SHARD === 'merge'
/** This shard's share of a list: every count-th item from index. A whole run or the merge takes all. */
export const takeShare = <T>(list: readonly T[]): T[] => { if (!isShard) return [...list]; const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'shard', arguments: { list: list as unknown[], index: (SHARD as { index: number }).index, count: (SHARD as { count: number }).count } } }) as { result?: { structuredContent: { shareList: T[] } }; error?: { message: string } }; if (r.error) throw new Error(r.error.message); return r.result!.structuredContent.shareList }
/** What this shard settled, left for the merge. */
export const leaveShard = (name: string, data: unknown): void => { mkdirSync(DIR, { recursive: true }); writeFileSync(join(DIR, `${name}.shard-${(SHARD as { index: number }).index}.json`), JSON.stringify(data)) }
/** Every shard's file of a name, gathered (arrays concatenated, objects merged), and removed once read. */
export const gatherShards = <T>(name: string, empty: T): T => {
  if (!existsSync(DIR)) return empty
  const files = readdirSync(DIR).filter((f) => f.startsWith(`${name}.shard-`) && f.endsWith('.json'))
  let out: unknown = Array.isArray(empty) ? [] : { ...(empty as object) }
  for (const f of files) { try { const d = JSON.parse(readFileSync(join(DIR, f), 'utf8')); if (Array.isArray(out) && Array.isArray(d)) out = [...out, ...d]; else if (!Array.isArray(out) && d && typeof d === 'object') out = { ...(out as object), ...d } } catch { /* a torn shard: its share is fetched again next run */ } }
  for (const f of files) { try { unlinkSync(join(DIR, f)) } catch { /* gone */ } }
  return out as T
}
export const shardLabel = (): string => (isShard ? `shard ${(SHARD as { index: number }).index + 1}/${(SHARD as { count: number }).count}` : isMerge ? 'merge' : 'whole')
