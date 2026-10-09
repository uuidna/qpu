#!/usr/bin/env node
/**
 * PORT THE GRAPH — combinatorial batches (wave.sweep stride), same gate as scripts/ports.test.mjs.
 *
 * Every node builtin is a PORT with how set and no lead. Batches use faces=14 stride, width = faces·2
 * doubling each pass, Promise.all within a pass (combinatorics.binomial / combinations coverage).
 * fs/db bind through RAID-native DocStore under the port surface.
 *
 *   node scripts/port.mjs                 both surfaces + combinatorial wave over builtins
 *   node scripts/port.mjs --all           every node builtin: must be ported (0 leads)
 *   node scripts/port.mjs --dependencies  every package.json dependency: ported or lead
 *   node scripts/port.mjs --wave          combinatorial port wave only (production-tested)
 *   node scripts/port.mjs --from 0 --width 28 --passes 2
 *
 * Requires dist (run `npm run build` / prepare first).
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { builtinModules } from 'node:module'
import { pathToFileURL } from 'node:url'
import { bits, tenOf } from './lattice-values.mjs'

const ROOT = join(dirname(new URL(import.meta.url).pathname), '..')
const argv = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`)
  return i >= 0 ? argv[i + 1] : fallback
}
const all = argv.includes('--all')
const depsOnly = argv.includes('--dependencies')
const waveOnly = argv.includes('--wave')
const both = (!all && !depsOnly && !waveOnly) || (all && depsOnly)

const readPkgDeps = () => {
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))
  return [...new Set([...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.devDependencies ?? {})])].sort()
}

const nodeSurface = () => {
  const bare = (m) => m.replace(/^node:/, '')
  return [...new Set(builtinModules.filter((m) => !m.startsWith('_') && !bare(m).includes('/')).map(bare))].sort()
}

const report = (title, names, graph, { allowLeads = true } = {}) => {
  const missing = names.filter((n) => !(n in graph))
  const extra = Object.keys(graph).filter((n) => !names.includes(n)).sort()
  const ported = names.filter((n) => graph[n] && !graph[n].lead)
  const leads = names.filter((n) => graph[n]?.lead)
  const byDomain = [...new Set(names.filter((n) => graph[n]).map((n) => graph[n].domain))].sort()
  console.log(`\n${title}`)
  console.log(`  ${names.length} across ${byDomain.length} domains (${byDomain.join(', ') || '—'})`)
  console.log(`  ${ported.length} ported${ported.length && ported.length <= 14 ? ` (${ported.join(', ')})` : ''}`)
  console.log(`  ${leads.length} leads${leads.length && leads.length <= 20 ? ` (${leads.join(', ')})` : leads.length ? ` (${leads.slice(0, 12).join(', ')}, …)` : ''}`)
  if (missing.length) console.error(`  ✗ missing from graph: ${missing.join(', ')} — add each (domain + relates + how)`)
  if (extra.length) console.error(`  ✗ graph extras not in surface: ${extra.join(', ')} — remove drifted entries`)
  if (!allowLeads && leads.length) console.error(`  ✗ node builtins still leads: ${leads.join(', ')} — clear lead; set how`)
  const holds = missing.length === 0 && extra.length === 0 && (allowLeads || leads.length === 0)
  return { missing, extra, ported, leads, holds }
}

/**
 * Combinatorial port wave: stride = faces, width concurrent indices, width doubles each pass.
 * Each cell proves one builtin: in graph, !lead, how non-empty. Promise.all within a pass.
 */
const portWaveOf = async (porting, unit, combinatorics, opts = {}) => {
  const { QPU_PORTS } = porting
  const faces = unit.qpuFacesOf().faces
  const surface = nodeSurface()
  const n = surface.length
  const from0 = Number(opts.from ?? 0)
  const width0 = Number(opts.width ?? faces * 2)
  const passesN = Number(opts.passes ?? 2)
  const binFaces = combinatorics.CombinatoricsFormulas.binomial(faces)
  const combNk = combinatorics.CombinatoricsFormulas.combinations(n, Math.min(2, n))
  const goalCombos = combinatorics.CombinatoricsFormulas.combinations(faces, 2)

  const proveOne = async (index) => {
    const name = surface[index % n]
    const port = QPU_PORTS[name]
    const t0 = performance.now()
    const how = typeof port?.how === 'string' ? port.how.trim() : ''
    const holds = Boolean(port) && port.lead !== true && how.length > 0 && typeof port.domain === 'string'
    return {
      index,
      name,
      domain: port?.domain ?? null,
      lead: port?.lead === true,
      howLen: how.length,
      holds,
      ms: Math.round((performance.now() - t0) * tenOf(3)) / tenOf(3),
    }
  }

  const passes = []
  let from = from0
  let width = width0
  for (let p = 1; p <= passesN; p++) {
    const fromIndices = Array.from({ length: width }, (_, k) => from + k * faces)
    const t0 = Date.now()
    const rows = await Promise.all(fromIndices.map((i) => proveOne(i)))
    const wallMs = Date.now() - t0
    const covered = new Set(rows.map((r) => r.name))
    passes.push({
      pass: p,
      width,
      fromStart: from,
      fromIndices,
      sweeps: rows.length,
      holdsTrue: rows.filter((r) => r.holds).length,
      holdsFalse: rows.filter((r) => !r.holds).length,
      covered: covered.size,
      wallMs,
      rows,
    })
    from = from + width * faces
    width *= 2
  }

  // Full surface coverage pass: every builtin once, batched by faces with Promise.all
  const batches = []
  for (let i = 0; i < n; i += faces) {
    batches.push(surface.slice(i, i + faces))
  }
  const tCover = Date.now()
  const coverRows = (await Promise.all(batches.map((batch) => Promise.all(batch.map(async (name, j) => {
    const index = surface.indexOf(name)
    return proveOne(index >= 0 ? index : j)
  }))))).flat()
  const coverMs = Date.now() - tCover
  const coverHolds = coverRows.every((r) => r.holds)
  const stillLead = coverRows.filter((r) => r.lead).map((r) => r.name)

  return {
    kind: 'port-wave',
    formula: 'wave.sweep × combinatorics',
    stride: faces,
    scheme: {
      stride: faces,
      width0,
      passes: passesN,
      widthDoublesEachPass: true,
      batch: 'Promise.all',
      coverage: 'full surface in faces-sized batches',
      binomialFaces: { value: binFaces.value, holds: binFaces.holds, hex: binFaces.hex ?? null },
      combinationsN2: { value: combNk.value, holds: combNk.holds, hex: combNk.hex ?? null },
      goalCombinationsFaces2: { value: goalCombos.value, holds: goalCombos.holds, hex: goalCombos.hex ?? null },
    },
    surface: n,
    passes: passes.map((p) => ({
      pass: p.pass,
      width: p.width,
      fromStart: p.fromStart,
      sweeps: p.sweeps,
      holdsTrue: p.holdsTrue,
      holdsFalse: p.holdsFalse,
      covered: p.covered,
      wallMs: p.wallMs,
      fail: p.rows.filter((r) => !r.holds).map((r) => r.name),
    })),
    cover: {
      batches: batches.length,
      rows: coverRows.length,
      holdsTrue: coverRows.filter((r) => r.holds).length,
      holdsFalse: coverRows.filter((r) => !r.holds).length,
      stillLead,
      wallMs: coverMs,
      holds: coverHolds,
    },
    holds: coverHolds && stillLead.length === 0 && passes.every((p) => p.holdsFalse === 0),
  }
}

const main = async () => {
  const portingPath = join(ROOT, 'dist/quantum/processing/unit/porting.js')
  let porting
  try {
    porting = await import(pathToFileURL(portingPath).href)
  } catch (e) {
    console.error(`port: cannot load ${portingPath} — run build/prepare first (${e.message})`)
    process.exit(1)
  }
  const { QPU_PORTS, QPU_DEPS } = porting
  if (!QPU_PORTS || !QPU_DEPS) {
    console.error('port: porting.js has no QPU_PORTS / QPU_DEPS')
    process.exit(1)
  }

  console.log('port — QPU_PORTS / QPU_DEPS (combinatorial wave; same gate as scripts/ports.test.mjs)')
  const results = []
  if (all || both) results.push(report('node builtins (--all)', nodeSurface(), QPU_PORTS, { allowLeads: false }))
  if (depsOnly || both) results.push(report('dependencies (--dependencies)', readPkgDeps(), QPU_DEPS, { allowLeads: true }))

  let wave = null
  if (waveOnly || both || all) {
    const unit = await import(pathToFileURL(join(ROOT, 'dist/quantum/processing/unit/index.js')).href)
    const combinatorics = await import(pathToFileURL(join(ROOT, 'dist/families/combinatorics/index.js')).href)
    wave = await portWaveOf(porting, unit, combinatorics, {
      from: flag('from', '0'),
      width: flag('width', undefined),
      passes: flag('passes', '2'),
    })
    console.log('\ncombinatorial port wave')
    console.log(`  stride=${wave.stride} width0=${wave.scheme.width0} passes=${wave.scheme.passes} binomial(faces)=${wave.scheme.binomialFaces.value} C(n,2)=${wave.scheme.combinationsN2.value}`)
    for (const p of wave.passes) {
      console.log(`  pass ${p.pass}: width=${p.width} sweeps=${p.sweeps} holdsTrue=${p.holdsTrue} holdsFalse=${p.holdsFalse} covered=${p.covered} wallMs=${p.wallMs}${p.fail.length ? ` fail=[${p.fail.join(',')}]` : ''}`)
    }
    console.log(`  cover: batches=${wave.cover.batches} rows=${wave.cover.rows} holds=${wave.cover.holds} stillLead=${wave.cover.stillLead.length ? wave.cover.stillLead.join(',') : '∅'} wallMs=${wave.cover.wallMs}`)
    results.push({ holds: wave.holds, ported: wave.cover.holdsTrue, leads: wave.cover.stillLead })
  }

  const holds = results.every((r) => r.holds)
  if (!holds) {
    console.error('\n✗ port gate failed — clear node leads; set how; see src/quantum/processing/unit/porting.ts')
    process.exit(1)
  }
  console.log('\n✓ port gate holds (0 node leads; combinatorial wave holds)')
  if (wave) {
    console.log(JSON.stringify({ before: { ported: bits, leads: 13 }, after: { ported: wave.cover.holdsTrue, leads: wave.cover.stillLead.length }, wave: { holds: wave.holds, stride: wave.stride, scheme: wave.scheme, passes: wave.passes.map((p) => ({ pass: p.pass, width: p.width, holdsTrue: p.holdsTrue, wallMs: p.wallMs })), cover: wave.cover } }, null, 2))
  }
  process.exit(0)
}

main().catch((e) => {
  console.error(`port: ${e.message}`)
  process.exit(1)
})
