// The penalties recorded where every detail lives, the RAID: the pure door (repository { penalty }) prices and seals each one, this client writes
// it to the docket through the one MCP client (createEntries, from 'penalties'). The same gap has the same address, so it is one entry however
// often it is penalised; a clearing names the gap its evidence closed. Without a key or an app it says so and queues the penalty in .qpu.
import { toolCallerOf } from '../src/quantum/mcp.ts'
import { mcpClient } from './mcp.ts'
import { appendFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { RUN_FILES } from '../src/quantum/toolboxes/repository.ts'

const repository = toolCallerOf('repository')
type Penalty = { rule: string; kind?: string; subject?: string; bytes?: number; tokens?: number; committer?: string | null; evidence: Record<string, unknown> & { key: string } }
// a penalty the docket did not take (no key, no app) is queued in .qpu, never lost; whenever the docket takes one, the queue is written first
const QUEUE = join(process.cwd(), RUN_FILES.penalties), taken = (e?: string) => e === undefined || /duplicate|unique|already/i.test(e)
const post = async (body: unknown) => (await mcpClient().call('createEntries', { kind: 'document', from: 'penalties', body })).error
const write = async (body: unknown) => {
  const e = await post(body)
  if (!taken(e)) { mkdirSync(dirname(QUEUE), { recursive: true }); appendFileSync(QUEUE, JSON.stringify(body) + '\n'); return `queued in ${RUN_FILES.penalties} until the docket takes it: ${e}` }
  if (existsSync(QUEUE)) { const left: string[] = []; for (const l of readFileSync(QUEUE, 'utf8').split('\n').filter(Boolean)) if (!taken(await post(JSON.parse(l)))) left.push(l); if (left.length) writeFileSync(QUEUE, left.join('\n') + '\n'); else rmSync(QUEUE) }
  return e === undefined ? 'recorded in the docket' : 'already recorded (the same gap, one entry)'
}
export const penalise = async (p: Penalty) => { const r = repository({ penalty: p }); return { ...r, recorded: await write(r.body) } }
// a clearing books the penalty's own count back (its tokens and committer), so the offender's standing is what it was before: no punishment
export const clear = async (rule: string, by: string, evidence: Penalty['evidence'], kind?: string, tokens?: number, committer?: string | null) => { const r = repository({ penalty: { rule, kind, cleared: true, by, evidence, ...(typeof tokens === 'number' ? { tokens } : {}), ...(committer ? { committer } : {}) } }); return { ...r, recorded: await write(r.body) } }
/** a learned correction applied before the decision: recorded as prevented, no penalty raised (textbook_penalty_learned_prevents) */
export const correctPenalty = (p: Penalty, learned: readonly string[]) => { const r = repository({ penalty: { ...p, learned } }); return r.kind === 'corrected' ? r : null }
/** recorded only after the correction was applied and the rule holds again */
export const recordPrevented = async (body: unknown) => write(body)
/** the open penalties as the docket holds them: each one's body, with the count, the tokens and the coins they book; null when the docket is unread */
export const readOpenPenalties = async () => { const read = await mcpClient().findAll('findEntries', { where: JSON.stringify({ from: { equals: 'penalties' } }), limit: 100 }); if (!read.docs) return { read: read.says, open: null }; const bodies = (read.docs as { body?: { rule?: string; kind?: string; subject?: string; blocks?: boolean; cleared?: boolean; tokens?: number; coin?: { count?: number } | null; snapshot?: { key?: string; workflow?: string; violated?: string[] } } }[]).map((d) => d.body).filter((b): b is NonNullable<typeof b> => !!b); const counts = repository({ penalties: bodies.map((body) => ({ body })) }) as { open: number; openKeys: string[]; opened: number; cleared: number; learning: { learned: string[] } }; const open = bodies.filter((b) => !b.cleared && counts.openKeys.includes(b.snapshot?.key ?? '')); return { read: read.says, counts, learned: counts.learning.learned, open, tokens: open.reduce((n, b) => n + (b.tokens ?? 0), 0), coins: open.reduce((n, b) => n + (b.coin?.count ?? 0), 0) } }
