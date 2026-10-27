// Every database, storage and mail adapter of the Payload app ported onto Cloudflare, as Cloudflare's own documentation states the port
// (read through the Cloudflare Developer Platform MCP on 2026-10-26): each adapter's binding, its migration steps, the Cloudflare MCP calls
// that create or check its resources, the plan it needs, and its missing links — a step no MCP API or migration tool covers. Every one of
// the combinations is composed from its mixed-radix index (compositionOf, textbook_mixed_radix) into one workflow; the whole space
// is counted: the combinations that port completely and the missing links that block the rest, each a lead (textbook_ports_cover). Pure.
import { compositionOf, compositionsOf } from './blocks.ts'
import type { Lead } from './leads.ts'
import { TABLES } from './tables-index.ts'

type McpCall = { tool: string; write: boolean; says: string }
type Port = { pkg: string; port: 'native' | 'd1' | 'hyperdrive' | 'durable-object' | 'r2' | 'http' | 'send_email'; bindings: Record<string, unknown>; steps: string[]; mcp: McpCall[]; plan: 'free' | 'paid'; missing: string[]; docs: string[] }
// each adapter's port is its ADAPTERS row's cloudflare field, held in Payload and edited in its admin: the order of the rows is the radices
const ROWS = (['database', 'storage', 'email'] as const).map((k) => TABLES.ADAPTERS[k] as unknown as readonly { pkg: string; cloudflare: Omit<Port, 'pkg' | 'bindings'> & { bindings?: Record<string, unknown> } }[])
export const CLOUDFLARE_PORT: Readonly<Record<string, Port>> = Object.fromEntries(ROWS.flat().map((r) => [r.pkg, { pkg: r.pkg, bindings: {}, ...r.cloudflare } as Port]))
export const PORT_ORDER = { database: ROWS[0]!.map((r) => r.pkg), storage: ROWS[1]!.map((r) => r.pkg), email: ROWS[2]!.map((r) => r.pkg) }
export const PORT_RADICES = [PORT_ORDER.database.length, PORT_ORDER.storage.length, PORT_ORDER.email.length] as const

/** One combination, from its index: the database, the storage and the mail adapter it chooses, their bindings joined, one workflow of every step with its MCP call, the plan, the missing links. */
export const portAt = (index: number) => {
  const count = Number(compositionsOf([...PORT_RADICES]))
  if (!Number.isInteger(index) || index < 0 || index >= count) throw new Error(`a combination is an index from 0 to ${count - 1}`)
  const [d, s, e] = compositionOf([...PORT_RADICES], BigInt(index))
  const chosen = [PORT_ORDER.database[d!]!, PORT_ORDER.storage[s!]!, PORT_ORDER.email[e!]!].map((pkg) => CLOUDFLARE_PORT[pkg]!)
  const bindings = Object.assign({}, ...chosen.map((p) => p.bindings)) as Record<string, unknown>
  const workflow = chosen.flatMap((p) => p.steps.map((step, i) => ({ adapter: p.pkg, step, mcp: p.mcp[i] ?? null })))
  const missing = [...new Set(chosen.flatMap((p) => p.missing))]
  return { index, digits: [d, s, e], database: chosen[0]!.pkg, storage: chosen[1]!.pkg, email: chosen[2]!.pkg, ports: chosen.map((p) => p.port), bindings, workflow, mcp: chosen.flatMap((p) => p.mcp), plan: chosen.some((p) => p.plan === 'paid') ? 'paid' as const : 'free' as const, missing, complete: missing.length === 0, docs: [...new Set(chosen.flatMap((p) => p.docs))] }
}

/** The whole space: every combination ported, the ones that port completely counted, the missing links each a lead naming the combinations it blocks. */
export const listPorts = () => {
  const count = Number(compositionsOf([...PORT_RADICES]))
  const all = Array.from({ length: count }, (_, i) => portAt(i))
  const links = new Map<string, number[]>(); for (const p of all) for (const m of p.missing) links.set(m, [...(links.get(m) ?? []), p.index])
  const leads: Lead[] = [...links.entries()].map(([m, at]) => ({ id: `port-${m.slice(0, 40).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')}`, source: 'the Cloudflare port of the Payload adapters', statement: `${m} (blocks ${at.length} of ${count} combinations)`, status: 'open' as const, reason: 'a step of the port no Cloudflare MCP API or migration tool covers yet' }))
  const complete = all.filter((p) => p.complete)
  return { combinations: count, radices: PORT_RADICES, complete: complete.length, blocked: count - complete.length, completeOnes: complete.map((p) => `${p.database} + ${p.storage} + ${p.email}`), missingLinks: links.size, byPlan: { free: all.filter((p) => p.plan === 'free').length, paid: all.filter((p) => p.plan === 'paid').length }, mcpTools: [...new Set(all.flatMap((p) => p.mcp.map((c) => c.tool)))].sort(), writes: [...new Set(all.flatMap((p) => p.mcp.filter((c) => c.write).map((c) => c.tool)))].sort(), leads, theorems: ['textbook_adapter_combinations', 'textbook_mixed_radix', 'textbook_ports_cover'], says: `${count} combinations ported onto Cloudflare: ${complete.length} complete, ${count - complete.length} blocked by ${links.size} missing link(s), each a lead` }
}
