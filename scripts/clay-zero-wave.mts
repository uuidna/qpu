/**
 * Clay-zero Rosetta reading, then the rotation merkaba.rosetta already defines,
 * then one mass wave (wave.massive — the massive wave — and, where that return
 * has no next, wave.wave, the call that launches faces agents in one receipt).
 * Reads the registry from source. Does not call gate.leads or scripts/discover.mjs.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { qpuHexFamiliesOf, qpuHexUuidOf, qpuContentUuidOf } from '../src/quantum/processing/unit/index.js'
import '../src/mcp/families.js'
import { MerkabaFormulas, flowFamiliesOf } from '../src/families/merkaba/index.js'
import { WaveFormulas, waveFamiliesOf } from '../src/families/wave/index.js'

type Step = { value: number; holds: boolean; formula: string; skipped?: string[] }

const SEED = 3

const sourceOf = new Map<string, string>()
const textOf = (family: string): string => {
  const known = sourceOf.get(family)
  if (known !== undefined) return known
  let text = ''
  try { text = readFileSync(new URL(`../src/families/${family}/index.ts`, import.meta.url), 'utf8') } catch { text = '' }
  sourceOf.set(family, text)
  return text
}
/** Parameter names the formula declares, and those it requires to be > 0. Read from the method the family already ships. */
const paramsOf = (family: string, formula: string): { names: string[]; positive: string[] } => {
  const text = textOf(family)
  const at = text.search(new RegExp(`static\\s+${formula}\\s*\\(`))
  if (at < 0) return { names: [], positive: [] }
  const body = text.slice(at, at + 800)
  const head = body.match(new RegExp(`static\\s+${formula}\\s*\\(([^)]*)\\)`))
  const names = head ? head[1].split(',').map((s) => s.trim().split(/[:=\s]/)[0] ?? '').filter(Boolean) : []
  return { names, positive: names.filter((n) => new RegExp(`\\b${n}\\s*>\\s*0\\b`).test(body)) }
}

const skipped: { family: string; formula: string; parameter: string }[] = []
const cache = new Map<string, Step>()

/** The family's first formula on its own signature. Arity 0 takes nothing. Arity 1 takes the one carried value.
 *  A wider signature has the other amounts absent: the address is recorded and the formula is not called.
 *  A 0 is not passed into a parameter the formula requires to be > 0. No next is stamped here. */
const stepOf = (family: string, value: number): Step => {
  const key = `${family}/${value}`
  const known = cache.get(key)
  if (known) return known
  const first = qpuHexFamiliesOf().get(family)?.[0]
  let out: Step
  if (!first || !Number.isSafeInteger(value) || value < 0) out = { value: 0, holds: false, formula: first?.name ?? '' }
  else if (first.arity > 1) {
    const declared = paramsOf(family, first.name).names
    const parameters = declared.length === first.arity ? declared : Array.from({ length: first.arity }, (_, i) => declared[i] || `param${i + 1}`)
    for (const parameter of parameters) skipped.push({ family, formula: first.name, parameter })
    out = { value: 0, holds: false, formula: first.name, skipped: parameters }
  } else {
    const must = value === 0 ? paramsOf(family, first.name).positive : []
    if (must.length) {
      for (const parameter of must) skipped.push({ family, formula: first.name, parameter })
      out = { value: 0, holds: false, formula: first.name, skipped: must }
    } else {
      const args = first.arity === 0 ? [] : [BigInt(value)]
      try {
        const r = first.run(args) as { value?: unknown; holds?: unknown }
        const v = typeof r === 'object' && r !== null && 'value' in r ? Number(r.value) : Number(r)
        const holds = (typeof r === 'object' && r !== null && 'holds' in r ? r.holds !== false : true) && Number.isSafeInteger(v) && v >= 0
        out = { value: Number.isSafeInteger(v) && v >= 0 ? v : 0, holds, formula: first.name }
      } catch {
        out = { value: 0, holds: false, formula: first.name }
      }
    }
  }
  cache.set(key, out)
  return out
}

const turnOf = (order: string[]) => {
  const edges: { family: string; formula: string; input: number; value: number; holds: boolean; hex: string }[] = []
  let value = SEED
  let holds = order.length >= 3
  for (const family of order) {
    if (edges.length % 100 === 0) console.log(`turn ${edges.length} ${family} input=${value}`)
    const input = value
    const s = stepOf(family, value)
    let hex = ''
    try {
      const arity = qpuHexFamiliesOf().get(family)?.find((f) => f.name === s.formula)?.arity ?? 0
      const params = s.skipped || arity > 1 ? [] : arity === 0 ? [] : [input]
      hex = qpuHexUuidOf({ family, program: [s.formula], params })
    } catch { /* params do not fit the section */ }
    edges.push({ family, formula: s.formula, input, value: s.value, holds: s.holds, hex })
    value = s.value
    if (!s.holds) { holds = false; break }
  }
  return { value: holds ? value : 0, holds, edges }
}

const scalar = (run: object) => {
  const r = run as { hex?: string; value?: unknown; holds?: unknown; next?: unknown; families?: unknown; edges?: unknown; forward?: unknown; back?: unknown; crossed?: unknown; family?: unknown; agents?: unknown; calls?: unknown; receipt?: unknown; answers?: unknown; silent?: unknown; programs?: unknown; signals?: unknown }
  return {
    hex: r.hex ?? '',
    value: r.value,
    holds: r.holds === true,
    ...(r.next !== undefined ? { next: r.next } : { next: null }),
  }
}

const known = new Set<string>()
const leadWaves = JSON.parse(readFileSync(new URL('../lead-waves-receipt.json', import.meta.url), 'utf8')) as { lines?: { rows?: { address?: string }[] }[] }
for (const line of leadWaves.lines ?? []) for (const row of line.rows ?? []) if (row.address) known.add(row.address)

const ring = flowFamiliesOf()
const clayAt = ring.indexOf('clay')
const zero = MerkabaFormulas.rosetta(0) as unknown as { hex?: string; value: number; holds: boolean; next?: number; families?: number; edges?: number; forward?: number; back?: number; crossed?: string[] }
const rosettaAtZero = {
  call: 'merkaba.rosetta',
  params: [0],
  clay: clayAt,
  ...scalar(zero),
  hex: zero.hex || qpuHexUuidOf({ family: 'merkaba', program: ['rosetta'], params: [0] }),
  families: zero.families,
  edges: zero.edges,
  forward: zero.forward,
  back: zero.back,
  crossed: zero.crossed ?? [],
}
console.log(`rosetta(0) hex=${rosettaAtZero.hex} value=${rosettaAtZero.value} holds=${rosettaAtZero.holds} next=${rosettaAtZero.next}`)

let defined: Record<string, unknown> | null = null
let named: { family: string; formula: string; input: number; value: number; holds: boolean; hex: string }[] = []
if (rosettaAtZero.holds !== true) {
  const n = ring.length
  console.log(`rosetta(${n}) families=${n} clay=${clayAt}`)
  const full = MerkabaFormulas.rosetta(n) as unknown as { hex?: string; value: number; holds: boolean; next?: number; families?: number; edges?: number; forward?: number; back?: number; crossed?: string[] }
  const forward = turnOf(ring.slice(0, n))
  const back = turnOf([...ring.slice(0, n)].reverse())
  named = [...forward.edges, ...back.edges]
  defined = {
    call: 'merkaba.rosetta',
    params: [n],
    ...scalar(full),
    hex: full.hex || qpuHexUuidOf({ family: 'merkaba', program: ['rosetta'], params: [n] }),
    families: full.families,
    edges: full.edges,
    forward: full.forward,
    back: full.back,
    crossed: full.crossed ?? [],
    walked: named.length,
  }
  console.log(`rosetta(${n}) hex=${defined.hex} value=${defined.value} holds=${defined.holds} next=${defined.next} edges=${defined.edges} walked=${named.length}`)
}

const fresh = named.filter((e) => e.hex && !known.has(e.hex))
const repeated = named.filter((e) => e.hex && known.has(e.hex))
console.log(`named=${named.length} fresh=${fresh.length} alreadyInLeadWaves=${repeated.length} skippedParams=${skipped.length}`)

const waveNames = waveFamiliesOf()
const famOf = (family: string) => waveNames.indexOf(family)
const targets = [...new Set(fresh.map((e) => e.family))]
const indexes = targets.map(famOf).filter((i) => i >= 0)

/** One mass call. wave.massive is the massive wave. It has no next. The faces-agent receipt with next is wave.wave, used when massive does not name the address. */
const massFam = indexes.length ? Math.min(...indexes) : 0
const massiveRun = (await WaveFormulas.massive(massFam)) as unknown as { hex?: string; value: number; holds: boolean; next?: number; family?: string; agents?: number; programs?: number; answers?: string[]; signals?: string[]; receipt?: string }
const massive = {
  call: 'wave.massive',
  params: [massFam],
  family: massiveRun.family ?? waveNames[massFam],
  ...scalar(massiveRun),
  hex: massiveRun.hex || qpuHexUuidOf({ family: 'wave', program: ['massive'], params: [massFam] }),
  agents: massiveRun.agents,
  programs: massiveRun.programs,
  signals: massiveRun.signals ?? [],
  receipt: massiveRun.receipt,
}
console.log(`massive(${massFam}) hex=${massive.hex} value=${massive.value} holds=${massive.holds} next=${massive.next} family=${massive.family}`)

const waves: Record<string, unknown>[] = []
const from = 0
const run = (await WaveFormulas.wave(massFam, from)) as unknown as { hex?: string; value: number; holds: boolean; next?: number; family?: string; agents?: number; answers?: string[]; receipt?: string }
const row = {
  call: 'wave.wave',
  params: [massFam, from],
  family: run.family ?? waveNames[massFam],
  ...scalar(run),
  hex: run.hex || qpuHexUuidOf({ family: 'wave', program: ['wave'], params: [massFam, from] }),
  agents: run.agents,
  answers: run.answers ?? [],
  receipt: run.receipt,
}
waves.push(row)
console.log(`wave(${massFam},${from}) hex=${row.hex} value=${row.value} holds=${row.holds} next=${row.next} agents=${row.agents}`)

const mass = massive
const namedBy = new Set<string>()
for (const signal of massive.signals) namedBy.add(signal)
for (const wave of waves) {
  const answers = (wave.answers as string[]) ?? []
  for (const a of answers) namedBy.add(a)
}

const developed: Record<string, unknown>[] = []
const seen = new Set<string>()
const waveReturn = { hex: mass.hex, value: mass.value, holds: mass.holds, next: mass.next }
for (const edge of named) {
  const address = edge.hex || qpuContentUuidOf({ family: edge.family, formula: edge.formula, input: edge.input })
  if (seen.has(address)) continue
  seen.add(address)
  const namedHere = namedBy.has(address) || (massive.family === edge.family && (massive.signals as string[]).includes(address))
  developed.push({
    address,
    family: edge.family,
    formula: edge.formula,
    input: edge.input,
    value: edge.value,
    holds: edge.holds,
    hex: edge.hex || address,
    ...(known.has(edge.hex) ? { alreadyInLeadWaves: true } : {}),
    namedByWave: namedHere,
    wave: waveReturn,
  })
}

const citationAddress = qpuContentUuidOf({ where: 'legal.citation', doi: '10.5281/zenodo.22178675' })
if (!seen.has(citationAddress)) {
  developed.push({
    address: citationAddress,
    where: 'legal.citation',
    holds: false,
    namedByWave: false,
    wave: { hex: mass.hex, value: mass.value, holds: mass.holds, next: mass.next },
  })
}
const tagAddress = qpuContentUuidOf({ where: 'tag', formula: null })
developed.push({
  address: tagAddress,
  where: 'tag',
  namedByWave: false,
  wave: { hex: mass.hex, value: mass.value, holds: mass.holds, next: mass.next },
})

const doc = {
  kind: 'clay-zero-wave-receipt',
  hex: mass.hex,
  value: mass.value,
  holds: mass.holds,
  next: mass.next,
  waveHex: (waves[0] as { hex: string }).hex,
  waveValue: (waves[0] as { value: unknown }).value,
  waveHolds: (waves[0] as { holds: boolean }).holds,
  waveNext: (waves[0] as { next: unknown }).next,
  rosettaHex: rosettaAtZero.hex,
  rosettaValue: rosettaAtZero.value,
  rosettaHolds: rosettaAtZero.holds,
  rosettaNext: rosettaAtZero.next,
  rosetta: rosettaAtZero,
  ...(defined ? { rotation: defined } : {}),
  skipped,
  named: named.length,
  fresh: fresh.length,
  alreadyInLeadWaves: repeated.length,
  wave: mass,
  waves,
  developed: developed.length,
  addresses: developed,
}
writeFileSync(new URL('../clay-zero-wave-receipt.json', import.meta.url), JSON.stringify(doc, null, 1) + '\n')
console.log(`receipt clay-zero-wave-receipt.json developed=${developed.length}`)
