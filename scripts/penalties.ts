// The penalties recorded where every detail lives, the RAID: the pure door (repository { penalty }) prices and seals each one, this client writes
// it to the docket through the one MCP client (createEntries, from 'penalties'). The same gap has the same address, so it is one entry however
// often it is penalised; a clearing names the gap its evidence closed. Without a key or an app it says so and writes nothing — never a file.
import { toolCallerOf } from '../src/quantum/mcp.ts'
import { mcpOf } from './mcp.ts'

const repository = toolCallerOf('repository')
type Penalty = { rule: string; bytes?: number; committer?: string | null; evidence: Record<string, unknown> & { key: string } }
const write = async (body: unknown) => { const r = await mcpOf().call('createEntries', { kind: 'document', from: 'penalties', body }); return r.error === undefined ? 'recorded in the docket' : /duplicate|unique|already/i.test(r.error) ? 'already recorded (the same gap, one entry)' : `not recorded: ${r.error}` }
export const penalise = async (p: Penalty) => { const r = repository({ penalty: p }); return { ...r, recorded: await write(r.body) } }
export const clear = async (rule: string, by: string, evidence: Penalty['evidence']) => { const r = repository({ penalty: { rule, cleared: true, by, evidence } }); return { ...r, recorded: await write(r.body) } }
/** the open penalties as the docket holds them: each one's body, with the count, the tokens and the coins they book; null when the docket is unread */
export const openPenaltiesOf = async () => { const read = await mcpOf().findAll('findEntries', { where: JSON.stringify({ from: { equals: 'penalties' } }), limit: 100 }); if (!read.docs) return { read: read.says, open: null }; const bodies = (read.docs as { body?: { rule?: string; cleared?: boolean; tokens?: number; coin?: { count?: number } | null; snapshot?: { key?: string; workflow?: string; violated?: string[] } } }[]).map((d) => d.body).filter((b): b is NonNullable<typeof b> => !!b); const counts = repository({ penalties: bodies.map((body) => ({ body })) }) as { open: number; openKeys: string[]; opened: number; cleared: number }; const open = bodies.filter((b) => !b.cleared && counts.openKeys.includes(b.snapshot?.key ?? '')); return { read: read.says, counts, open, tokens: open.reduce((n, b) => n + (b.tokens ?? 0), 0), coins: open.reduce((n, b) => n + (b.coin?.count ?? 0), 0) } }
/** the penalties of a rule as the docket holds them, counted: opened, cleared, open */
export const penaltiesOf = async (rule?: string) => { const read = await mcpOf().findAll('findEntries', { where: JSON.stringify({ from: { equals: 'penalties' } }), limit: 100 }); if (!read.docs) return { read: read.says, counts: null }; const docs = (read.docs as { body?: { rule?: string } }[]).filter((d) => !rule || d.body?.rule === rule); return { read: read.says, counts: repository({ penalties: docs }) as { opened: number; cleared: number; open: number; openKeys: string[] } } }
