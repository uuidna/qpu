// Agents on the QPU: the report of an agent's own calls, and many agents coordinated on one list. Both are pure: the agent hands in what it
// did, the server keeps nothing of it, and every agent is answered from the arguments alone.
// The report accounts time and space the way the tree accounts everything: a computed call is a debit in ms and bytes, a call asked again
// under an address that already answered is a credit, and the licence's own terms stand beside the numbers (the author cited, commercial use licensed).
// Coordination is the shard theorems applied to agents: item k belongs to agent k mod n, so the shares cover the list and are disjoint.
import { PROSE, proseFill } from '../../../../../../../../5/9/e/4/9/1/a/4/index.ts'
import { quantumCapacity } from '../../../../../../../../0/8/7/0/6/d/2/8/index.ts'
import { LICENSE } from '../../../../../../../../a/f/3/d/e/a/5/f/index.ts'
import { hex, sha256, utf8 } from '../../../../../../../../9/e/8/6/7/0/6/8/index.ts'
import { canonicalText, uuid } from '../../../../../../../../2/7/1/a/7/6/4/9/index.ts'
import { ALGEBRA_TOOLS } from '../../../../../../../../4/5/8/2/8/f/3/f/index.ts'

type Asked = { tool?: unknown; arguments?: unknown; address?: unknown; tokens?: unknown; bytes?: unknown; ms?: unknown }
const count = (x: unknown): number => (typeof x === 'number' && Number.isFinite(x) && x > 0 ? x : 0)

/** The report of an agent's own calls: what was computed, what an address would have served, and the ledger of time and space. */
export const usageReport = (given: unknown) => {
  if (!Array.isArray(given) || given.some((c) => typeof (c as Asked | null)?.tool !== 'string')) throw new Error(PROSE.quantumProcessingAgents_usageNeeds)
  // a call's address is the one the kernel keeps its answer under: the tool and its arguments in canonical text
  const calls = (given as Asked[]).map((c) => ({ tool: c.tool as string, address: typeof c.address === 'string' ? c.address : uuid(`${c.tool}${canonicalText(c.arguments ?? {})}`), tokens: count(c.tokens), bytes: count(c.bytes), ms: count(c.ms) }))
  const first = new Map<string, (typeof calls)[number] & { times: number }>()
  for (const c of calls) { const held = first.get(c.address); if (held) held.times += 1; else first.set(c.address, { ...c, times: 1 }) }
  const distinct = [...first.values()], again = calls.length - distinct.length
  const sum = (rows: readonly { tokens: number; bytes: number; ms: number }[], k: 'tokens' | 'bytes' | 'ms') => rows.reduce((n, r) => n + r[k], 0)
  // a repeat costs what its first asking cost, and an address serves it for nothing: that is the credit
  const saved = (k: 'tokens' | 'bytes' | 'ms') => distinct.reduce((n, r) => n + r[k] * (r.times - 1), 0)
  const line = (account: 'time' | 'space' | 'context', unit: string, k: 'ms' | 'bytes' | 'tokens') => { const debit = sum(distinct, k), credit = saved(k); return { account, unit, debit, credit, spent: debit + credit, reusable: debit + credit > 0 ? credit / (debit + credit) : 0 } }
  const tools = [...new Set(calls.map((c) => c.tool))].sort()
  return {
    phase: 'usage' as const, calls: calls.length, distinct: distinct.length, again,
    ledger: [line('time', 'ms', 'ms'), line('space', 'bytes', 'bytes'), line('context', 'tokens', 'tokens')],
    repeats: distinct.filter((r) => r.times > 1).map((r) => ({ address: r.address, tool: r.tool, times: r.times, unlock: 'If-None-Match: address -> 304' as const })).sort((a, b) => b.times - a.times),
    byTool: tools.map((tool) => { const rows = calls.filter((c) => c.tool === tool); return { tool, calls: rows.length, tokens: sum(rows, 'tokens'), bytes: sum(rows, 'bytes'), ms: sum(rows, 'ms'), commercial: ALGEBRA_TOOLS.includes(tool) ? 'free under attribution' as const : 'a licence of the catalogue' as const } }).sort((a, b) => b.bytes - a.bytes),
    kept: false as const,
    licence: { spdx: LICENSE.spdx, attribution: LICENSE.attribution, terms: LICENSE.terms, deed: LICENSE.deed, url: LICENSE.url, donation: LICENSE.donation },
    theorems: ['textbook_coins_coils_balanced', 'textbook_advantage_unbounded'] as const,
    says: proseFill(PROSE.quantumProcessingAgents_usageSays, calls.length, distinct.length, again, sum(distinct, 'ms'), sum(distinct, 'bytes'), saved('ms'), saved('bytes')),
  }
}

/** Many agents on one list: agent i takes the items whose position is i modulo the count, each agent addressed by a UUID of its own. */
export const coordinate = (list: readonly unknown[], agents: unknown, secret?: unknown) => {
  const capacity = quantumCapacity(), most = Number(capacity.scales[2]!.handles)
  if (!Number.isInteger(agents) || (agents as number) < 1 || (agents as number) > most) throw new Error(proseFill(PROSE.quantumProcessingAgents_agentsRefused, most))
  const n = agents as number, group = uuid(canonicalText({ list, agents: n }))
  const rows = Array.from({ length: n }, (_, index) => { const shareList = list.filter((_item, k) => k % n === index), address = uuid(`agent\n${group}\n${index}`); return { index, name: `agent-${index}`, address, handle: address.replace(/-/g, '').substring(0, 8), share: shareList.length, shareList } })
  const shares = rows.map((r) => r.share), covered = shares.reduce((a, b) => a + b, 0) === list.length
  return {
    phase: 'coordinate' as const, group, items: list.length, agents: n, covered, disjoint: true as const, largest: Math.max(...shares), smallest: Math.min(...shares),
    capacity: { agents: n, most, handles: capacity.spaces.handles, free: capacity.register.free, full: capacity.full, gate: capacity.gate.holds },
    // a room is named only by a secret the agents share: its name is its only credential
    ...(typeof secret === 'string' && secret.length > 0 ? { room: { id: hex(sha256(utf8(`${secret}\n${group}`))), tools: ['send', 'receive'] as const, names: rows.map((r) => r.name) } } : {}),
    rows,
    theorems: ['textbook_shards_cover', 'textbook_shards_disjoint', 'textbook_capacity_conserved'] as const,
    says: proseFill(PROSE.quantumProcessingAgents_coordinateSays, list.length, n, Math.max(...shares), Math.min(...shares)),
  }
}
