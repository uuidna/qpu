// Unused quantum capacity, measured in the background: post-commit starts this detached (the machine action idle), so it never adds to a hook's
// wall time. It reads the tree through the handler — the arguments of every tool no example passes, the textbook theorems nothing names or
// cites, the gates discovery never reached, the qubits the quantum examples leave below the simulator's stated bound and the Shor N never asked —
// prices each idle item in its own unit through repository { penalties, capacity }, writes the state the hooks and next read, and, with a key,
// raises the ten largest as idle gaps in the docket and annihilates the ones now used. Progress line by line.
import { spawnSync } from 'node:child_process'
import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { capacityOf } from '../src/quantum/toolboxes/billing.ts'
import { LICENSE } from '../src/quantum/license.ts'
import { readJson } from './mcp.ts'

const ROOT = process.cwd()
const started = performance.now()
const capacityIn: Parameters<typeof capacityOf>[0] = {}
const { handle } = await import('../src/quantum/mcp.ts'), { EXAMPLES } = await import('../src/quantum/examples.ts'), { TEXTBOOK_THEOREMS } = await import('../src/quantum/textbook-theorems.ts'), { QUANTUM_BOUNDS } = await import('../src/quantum/discovery-document.ts')
const tools = (handle({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: { full: true } }) as { result: { tools: { name: string; inputSchema: { properties?: Record<string, unknown> } }[] } }).result.tools
const passed = new Set(EXAMPLES.flatMap((e) => Object.keys((e.arguments ?? {}) as Record<string, unknown>).map((k) => `${e.tool}.${k}`)))
capacityIn.doors = tools.flatMap((t) => Object.entries(t.inputSchema.properties ?? {}).map(([k, v]) => ({ name: `${t.name}.${k}`, bytes: Buffer.byteLength(JSON.stringify(v)), reached: passed.has(`${t.name}.${k}`) })))
const named = new Set(EXAMPLES.map((e) => e.theorem).filter(Boolean)), ids = new Set(EXAMPLES.map((e) => e.id))
const cited = spawnSync('git', ['grep', '-ho', '-E', 'textbook_[a-z0-9_]+', '--', 'src', 'scripts', ':!src/quantum/textbook-theorems.ts', ':!src/quantum/theorems-index.ts', ':!src/quantum/examples.ts', ':!*.lean'], { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 28 }).stdout.split('\n')
const citedSet = new Set(cited)
capacityIn.theorems = TEXTBOOK_THEOREMS.map((t) => ({ key: t.key, bytes: Buffer.byteLength(t.lean), used: named.has(t.key) || t.examples.some((x) => ids.has(x)) || citedSet.has(t.key) }))
const quantum = EXAMPLES.filter((e) => ['circuit', 'echo', 'algorithm'].includes(e.tool))
const qubitsOf = (a: unknown): number => { const xs = new Set<string>(); const walk = (v: unknown) => { if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === 'object') { const o = v as Record<string, unknown>; if (o.kind === 'line' && typeof o.x === 'number') xs.add(String(o.x)); if (typeof o.qubits === 'number') xs.add(`n${o.qubits}`); Object.values(o).forEach(walk) } }; walk(a); return [...xs].reduce((n, x) => (x.startsWith('n') ? Math.max(n, Number(x.slice(1))) : n), xs.size && [...xs].every((x) => !x.startsWith('n')) ? xs.size : 0) || (xs.size ? xs.size : 1) }
capacityIn.qubits = { bound: QUANTUM_BOUNDS.qubits, calls: quantum.filter((e) => (e.arguments as { name?: string }).name !== 'shor').map((e) => ({ door: e.tool, used: Math.min(QUANTUM_BOUNDS.qubits, qubitsOf(e.arguments)) })) }
capacityIn.shor = { bound: QUANTUM_BOUNDS.shorN, asked: quantum.map((e) => e.arguments as { name?: string; N?: number }).filter((a) => a.name === 'shor' && typeof a.N === 'number').map((a) => a.N!) }
const disc = readJson(join(ROOT, 'docs', 'public', 'discovery.json')) as { hosts?: { host: string; status: number }[] } | null
if (disc?.hosts) capacityIn.gates = disc.hosts.map((h) => ({ name: h.host, called: h.status === 200 }))

const capacity = capacityOf(capacityIn)
console.log(`idle: ${capacity.gaps.length} idle item(s); ${['doors', 'theorems', 'gates', 'qubits', 'shor'].map((k) => { const m = (capacity as Record<string, unknown>)[k] as { percentIdle: number; idle: number; unit: string } | null; return m ? `${k} ${m.percentIdle}% idle (${m.idle} ${m.unit})` : `${k} unmeasured` }).join(', ')}`)
mkdirSync(join(ROOT, 'docs', 'public'), { recursive: true })
writeFileSync(join(ROOT, 'docs', 'public', 'idle.json'), JSON.stringify({ license: LICENSE.attribution, date: new Date().toISOString(), input: capacityIn, top: capacity.top, counts: Object.fromEntries(['doors', 'theorems', 'gates', 'qubits', 'shor'].map((k) => { const m = (capacity as Record<string, unknown>)[k] as { capacity: number; used: number; idle: number; percentIdle: number; unit: string; idleNames: string[] } | null; return [k, m ? { unit: m.unit, capacity: m.capacity, used: m.used, idle: m.idle, percentIdle: m.percentIdle, idleNames: m.idleNames } : null] })), never: { shor: capacity.shor?.never ?? [], qubitsNeverPastTwo: capacity.qubits?.neverPastTwo ?? [] }, advantage: capacity.advantage }, null, 1) + '\n')
console.log('idle: state written for the hooks and next to read')
if (process.env.QPU_APP_KEY) {
  const { penalise, clear, openPenaltiesOf } = await import('./penalties.ts')
  const standing = await openPenaltiesOf()
  const open = new Map((standing.open ?? []).filter((b) => (b.snapshot?.key ?? '').startsWith('idle:')).map((b) => [b.snapshot!.key!, b]))
  const top = new Set(capacity.top.map((g) => `idle:${g.measure}:${g.name}`))
  for (const g of capacity.top) { const key = `idle:${g.measure}:${g.name}`; if (!open.has(key)) { const r = await penalise({ rule: 'idle', kind: 'idle', subject: g.name, tokens: g.tokens, committer: null, evidence: { key, measure: g.measure, name: g.name, unit: g.unit } }); console.log(`idle: raised ${key}: ${r.recorded}`) } }
  const idleNow = new Set(capacity.gaps.map((g) => `idle:${g.measure}:${g.name}`))
  for (const [key, b] of open) if (!idleNow.has(key) && !top.has(key)) { const r = await clear('idle', 'its capacity is used', b.snapshot as Record<string, unknown> & { key: string }, 'idle', b.tokens, null); console.log(`idle: annihilated ${key}: ${r.recorded}`) }
}
console.log(`idle: ${Math.round(performance.now() - started)} ms`)
