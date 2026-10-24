#!/usr/bin/env node
/**
 * ONE RUNNER FOR THE NAMED SCRIPTS. Each package script that is a call into the unit is `tsx scripts/run.ts <command>`,
 * so a new name is a line in package.json, never a new file.
 *
 *   tsx scripts/run.ts audit <tool> [--format=json|markdown]   an auditing tool from src/mcp/mcp-auditing-tools.ts
 *   tsx scripts/run.ts factor <n>                               the crypto_rsa door on n, through the unit
 *   tsx scripts/run.ts receipts                                 regenerate lean-receipt.json from the source, rebuild, report holds
 *   tsx scripts/run.ts explain                                  name each theorem of index.lean whose text the served source lacks
 *   tsx scripts/run.ts receipt <name>                           a committed receipt, served by the connector (observe + receipt)
 *   tsx scripts/run.ts stream <file>                            follow a background run's log as it grows
 *   tsx scripts/run.ts leads                                    every open lead, crossed through the connector's funding source
 *
 * The connector calls go to QPU_HOST (a full origin, e.g. http://localhost:8787) or the local server by default.
 */
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, statSync, openSync, readSync, closeSync } from 'node:fs'
import { MCP_AUDITING_TOOLS } from '../src/mcp/mcp-auditing-tools.js'
import { mcpCallOf } from '../src/quantum/processing/unit/mcp.js'
import { leanSource } from '../src/quantum/processing/unit/lean.js'
import { tenOf } from './lattice-values.ts'

const argv = process.argv.slice(2)
const [command, ...rest] = argv
const format = rest.find((a) => a.startsWith('--format='))?.slice('--format='.length) ?? 'json'
const positional = rest.filter((a) => !a.startsWith('--'))
// ONLINE BY DEFAULT: the host the unit is served from, when it answers; the local server only when the network does not.
const HOST = process.env.QPU_HOST?.startsWith('http') ? process.env.QPU_HOST : 'https://qpu.uuidna.com'
const LOCAL = 'http://localhost:8787'
const reachable = async (origin: string) => {
  try { const r = await fetch(origin, { signal: AbortSignal.timeout(5000) }); return r.status < 500 } catch { return false }
}
const online = await reachable(HOST)
const ORIGIN = online ? HOST : (await reachable(LOCAL) ? LOCAL : HOST)

const emit = (name: string, result: unknown) => {
  const json = JSON.stringify(result, null, 2)
  if (format === 'markdown') console.log(`# ${name}\n\n\`\`\`json\n${json}\n\`\`\``)
  else console.log(json)
}

/** One connector call over MCP; the reading is the JSON text inside the tool's content envelope. */
const connector = async (args: Record<string, unknown>) => {
  const r = await fetch(`${ORIGIN}/mcp`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'connector', arguments: args } }),
  })
  const body = (await r.json()) as { result?: { content?: { text?: string }[] }; error?: unknown }
  if (body.error) throw new Error(`connector: ${JSON.stringify(body.error)}`)
  const text = body.result?.content?.[0]?.text
  return text ? JSON.parse(text) : body
}

const audit = async () => {
  const name = positional[0] ?? 'end_to_end_audit'
  const tool = (MCP_AUDITING_TOOLS as Record<string, { handler: (args: object) => unknown }>)[name]
  if (!tool) throw new Error(`no auditing tool named ${name}; the registry has: ${Object.keys(MCP_AUDITING_TOOLS).join(', ')}`)
  emit(name, await tool.handler({}))
}

const factor = async () => {
  // n is exact: a string of digits, so an integer past 2^53 is not rounded before the unit sees it
  const digits = positional[0] ?? '91'
  if (!/^[0-9]+$/.test(digits) || BigInt(digits) < 2n) throw new Error(`factor needs an integer n >= 2, got ${digits.slice(0, 40)}…`)
  const raw = (await mcpCallOf('crypto_rsa', { n: digits })) as { content?: { text?: string }[] }
  const text = raw.content?.[0]?.text
  emit(`factor ${digits.length} digits`, text ? JSON.parse(text) : raw)
}

/** The lean receipt is written from the source; the receipts index that serves it is built, so a rebuild follows. */
const receipts = async () => {
  for (const step of [['npx', ['tsx', 'scripts/lean-receipt.ts']], ['npm', ['run', 'build']]] as const) {
    const done = spawnSync(step[0], step[1], { stdio: 'inherit' })
    if (done.status !== 0) throw new Error(`${step[0]} ${step[1].join(' ')} exited ${done.status}`)
  }
  const doc = JSON.parse(readFileSync('lean-receipt.json', 'utf8')) as { theorems: number; verbatim: number; recomputed: number; holds: boolean }
  emit('lean receipt', { theorems: doc.theorems, verbatim: doc.verbatim, recomputed: doc.recomputed, holds: doc.holds })
}

/** The served source is the file; a theorem whose exact text the served source lacks is named, not counted. */
const explain = async () => {
  // the served text is the reference when the host answers; the local file is read only when it does not
  const served = online ? await fetch(`${HOST}/src/quantum/processing/unit/index.lean`).then((r) => r.text()).catch(() => null) : null
  const file = readFileSync('src/quantum/processing/unit/index.lean', 'utf8')
  const reference = served ?? leanSource
  const blocks = [...file.matchAll(/^theorem (\w+)[\s\S]*?(?=^(?:theorem|def|--|\/-!)|$(?![\s\S]))/gm)]
  const missing = blocks.filter((b) => !reference.includes(b[0].trimEnd())).map((b) => ({ name: b[1], text: b[0].trim().slice(0, 160) }))
  emit('theorems the served source lacks', { origin: served ? HOST : 'local file (offline)', theorems: blocks.length, lacking: missing.length, missing })
}

/** A committed receipt, read through the connector's observe route with its name. */
const receiptOf = async () => {
  const name = positional[0]
  if (!name) throw new Error('usage: run.ts receipt <name>, e.g. lean-receipt')
  emit(`receipt ${name}`, await connector({ observe: true, verbosity: 1, receipt: name }))
}

/** Follows a log as it grows: the last lines first, then every line appended after. */
const stream = async () => {
  const path = positional[0]
  if (!path || !existsSync(path)) throw new Error(`stream needs an existing file, got ${path}`)
  let at = Math.max(0, statSync(path).size - 4096)
  for (;;) {
    const size = statSync(path).size
    if (size > at) {
      const fd = openSync(path, 'r')
      const buf = Buffer.alloc(size - at)
      readSync(fd, buf, 0, buf.length, at)
      closeSync(fd)
      process.stdout.write(buf.toString('utf8'))
      at = size
    }
    await new Promise((resolve) => setTimeout(resolve, tenOf(3)))
  }
}

/** Every open lead, crossed through the connector's funding source; a lead the source cannot answer is named as such. */
const leads = async () => {
  const memory = JSON.parse(readFileSync('scripts/leads.memory.json', 'utf8')) as { leads: { name: string; state: string; lead: string }[] }
  const open = memory.leads.filter((l) => l.state === 'open')
  const rows = []
  for (const lead of open) {
    try {
      const reply = await connector({ source: 'funding', about: lead.name })
      rows.push({ lead: lead.name, answered: reply.kind !== 'failure', next: reply.next ?? null })
    } catch (e) {
      rows.push({ lead: lead.name, answered: false, next: [String((e as Error).message)] })
    }
  }
  emit('open leads crossed through the connector', { open: open.length, answered: rows.filter((r) => r.answered).length, rows })
}

/**
 * THE CLAY METHOD, APPLIED TO THE QUANTUM FAMILIES. The formulas discover each other over the lattice's named constants:
 * every value two or more quantum families reach is a relation, stated as a theorem proved by rfl and checked by the Lean
 * kernel, and quantum_wings is their conjunction. Same procedure as scripts/lean-clay.ts, restricted to the quantum modules.
 * Written to lean/Qpu/Quantum.lean only with --write; the Clay module is never touched.
 */
const QUANTUM_FAMILIES = ['Lattice', 'Mint', 'Coil', 'Shor', 'Qft', 'Grover', 'Stabilizer', 'Clifford', 'Magic', 'Qaoa', 'Annealing', 'Anyon', 'Galois']
const quantum = async () => {
  const u = await import('../src/quantum/processing/unit/index.js')
  const e = await import('../src/quantum/processing/unit/lean-eval.js')
  const model = e.leanModelOf(leanSource)
  const links = e.leanLinksOf(leanSource)
  const familyOf = new Map(links.declarations.map((d: { name: string; family: string }) => [d.name, d.family]))
  const consts = model.order
    .filter((k: string) => e.leanArityOf(model, k) === 0)
    .map((k: string) => ({ text: k, value: e.leanCallOf(model, k, []) as bigint, family: familyOf.get(k) as string | undefined }))
    .filter((c: { value: bigint; family?: string }) => c.value <= 10000n && c.family !== undefined && QUANTUM_FAMILIES.includes(c.family.replace('Qpu.', '')))
  const nameOf = new Map<string, string>([...consts].reverse().map((c: { value: bigint; text: string }) => [c.value.toString(), c.text]))
  const merged = new Map<unknown, Map<string, { hex: string; family: string; formula: string; params: unknown[] }>>()
  for (let from: number | undefined = 0; from !== undefined; ) {
    const d = u.hexDiscoverOf(from)
    for (const r of d.relations) {
      const ways = merged.get(r.value) ?? merged.set(r.value, new Map()).get(r.value)!
      for (const w of r.ways) if (!ways.has(w.hex)) ways.set(w.hex, w)
    }
    from = d.next
  }
  const isQuantum = (family: string) => QUANTUM_FAMILIES.includes(family.replace('Qpu.', ''))
  const relations = [...merged].map(([value, ways]) => {
    const w = [...ways.values()]
    return { value, families: [...new Set(w.map((x) => x.family))].sort(), ways: w }
  }).filter((r) => r.families.filter(isQuantum).length >= 2)
  const relThms: { name: string; about: string; text: string }[] = []
  for (const r of relations) {
    const ways = r.ways.filter((w) => w.params.every((p) => nameOf.has(String(p)))).map((w) => `${w.formula}${w.params.map((p) => ` ${nameOf.get(String(p))}`).join('')}`)
    const uniq = [...new Set(ways)]
    if (uniq.length < 2) continue
    const sides = uniq.slice(0, 3)
    const text = sides.length === 2
      ? `theorem quantum_relation_${r.value} : ${sides[0]} = ${sides[1]} := rfl`
      : `theorem quantum_relation_${r.value} : ${sides.slice(1).map((p) => `${sides[0]} = ${p}`).join(' ∧ ')} := ⟨${sides.slice(1).map(() => 'rfl').join(', ')}⟩`
    relThms.push({ name: `quantum_relation_${r.value}`, about: r.families.map((x) => x.replace('Qpu.', '')).join(', '), text })
  }
  const wings = `theorem quantum_wings : ${relThms.map((t) => t.text.slice(t.text.indexOf(': ') + 2, t.text.indexOf(' := '))).map((s) => (s.includes('∧') ? `(${s})` : s)).join(' ∧ ')} := ⟨${relThms.map((t) => t.name).join(', ')}⟩`
  const imports = [...new Set(relThms.flatMap((t) => [...t.text.matchAll(/[A-Za-z]\w*/g)].map((m) => links.declarations.find((d: { name: string }) => d.name === m[0])?.family).filter(Boolean)))]
    .map((f) => String(f).replace('Qpu.', '')).filter((m) => m !== 'Quantum' && QUANTUM_FAMILIES.includes(m)).sort()
  const text = [...imports.map((m) => `import Qpu.${m}`), '', '/-! # Qpu.Quantum', 'The Clay method on the quantum families: every value two or more of them reach is a relation, proved by rfl; quantum_wings is their conjunction. Discovered, not written (scripts/run.ts quantum). -/', ...relThms.flatMap((t) => [`/-- ${t.about}. -/`, t.text]), '', wings, ''].join('\n')
  if (process.argv.includes('--write')) (await import('node:fs')).writeFileSync('src/quantum/processing/unit/lean/Qpu/Quantum.lean', text)
  emit('quantum relations', { relations: relThms.length, families: QUANTUM_FAMILIES.length, written: process.argv.includes('--write') })
}

const commands: Record<string, () => Promise<void>> = { audit, factor, receipts, explain, receipt: receiptOf, stream, leads, quantum }
const run = commands[command ?? '']
if (!run) {
  console.error(`usage: tsx scripts/run.ts <${Object.keys(commands).join('|')}> …`)
  process.exit(2)
}
await run()
