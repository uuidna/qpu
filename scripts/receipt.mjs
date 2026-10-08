#!/usr/bin/env node
/**
 * EVERY RECEIPT IS WRITTEN BY WAVES OF FREE REMOTE AGENTS. This script computes nothing: it sends tools/call { hex }
 * to the host's MCP, one wave (a slice of addresses) per call, and writes the host's answers as a receipt file. The
 * agents are the host's hex programs — exact, free to the caller, each answering with its own receipt — and the
 * caller reads one summary per wave. No dist/, no local run: the host is the unit.
 *
 *   node scripts/receipt.mjs gate commit|push   gate-receipt.json    gate.commit(i) for the staged families / gate.push(from) slice by slice
 *   node scripts/receipt.mjs next               next-receipt.json    data.research(f) ∀f, data.discover(n), data.perspectives(n): the superpositions, tested or not
 *   node scripts/receipt.mjs uses               uses-receipt.json    data.imagine(c) for every registry category
 *   node scripts/receipt.mjs api                api-receipt.json     api { walk } slice by slice: every API fused and used
 *   node scripts/receipt.mjs clay               clay-receipt.json    clay.pass(faces): the six seals, their involutions, every related formula in one pass; OEIS and the record per problem
 *   node scripts/receipt.mjs registry           src/mcp/registry.ts  the APIs.guru list, reduced to what the door needs
 *   node scripts/receipt.mjs stamp <file>       rewrite one receipt with its legal block; no remote sweep
 *   QPU_HOST=http://localhost:8787 …            another host
 */
import fs from 'node:fs'
import { execSync } from 'node:child_process'
import { mintOf, tenOf, vertices } from './lattice-values.mjs'

const host = process.env.QPU_HOST ?? 'https://qpu.uuidna.com'
const [kind = 'gate', mode = 'push'] = process.argv.slice(2)
const t0 = Date.now()
let id = 0
/** One tools/call; a 5xx or a timeout is asked again after a growing pause, three times — split in time, never given up at once. */
const call = async (name, args, again = 0) => {
  const r = await fetch(`${host}/mcp`, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: ++id, method: 'tools/call', params: { name, arguments: args } }), signal: AbortSignal.timeout(120000) }).catch((e) => (again < 3 && e?.name === 'TimeoutError' ? null : Promise.reject(e)))
  if ((r === null || r.status >= 500) && again < 3) { await new Promise((ok) => setTimeout(ok, 5000 * (again + 1))); return call(name, args, again + 1) }
  const body = await r.json()
  if (!body.result) throw new Error(`${name} ${JSON.stringify(args).slice(0, 80)}: ${body.error?.message ?? r.status}`)
  return body.result.structuredContent ?? {}
}
/** A hex program at its address on the host; the formula's own reading rides with the last step. */
const hex = async (family, program, params = []) => { const sc = await call('cite', { hex: { family, program: [program], params } }); return { ...sc, ...(sc.steps?.at?.(-1)?.reading ?? {}) } }
const families = async () => (await call('cite', { doors: true })).formulas?.map((f) => f.name.split('.')[0]).filter((f, i, a) => a.indexOf(f) === i && !['qpu', 'crypto', 'api', 'data', 'gate'].includes(f)).sort() ?? []
const faces = 14
/** SPLIT, NOT SEQUENCE — one primitive for every family walk. The items are run through a coordinated pool of `faces`
 *  workers, so the wall time is the slowest item, not their sum; results keep input order, so a receipt is the same
 *  whichever worker answered first. The host's hex programs are reads that erase no bit, so by Landauer the walk's
 *  temperature is zero: time and temperature both near zero, however many families. */
const pool = async (items, run, width = faces) => {
  const out = new Array(items.length)
  let at = 0
  await Promise.all(Array.from({ length: Math.min(width, items.length) }, async () => {
    for (;;) { const i = at++; if (i >= items.length) return; out[i] = await run(items[i], i) }
  }))
  return out
}
/** Counts the receipt already carries. A missing count is not filled in. */
const countOf = (v) => (Number.isSafeInteger(v) && v >= 0 ? v : undefined)
/**
 * Legal requisites already computed by the unit, plus the zeropoint-node citation read from the npm registry.
 * A requisite with no count on this receipt is a lead: its address only. Prize acceptance is not set here.
 */
const legalOf = async (doc) => {
  await import('../dist/families/law/index.js')
  const { qpuHexUuidOf, qpuHexDecodeOf, qpuEvidenceOf } = await import('../dist/quantum/processing/unit/index.js')
  const { LawFormulas } = await import('../dist/families/law/index.js')
  const evidence = qpuEvidenceOf()
  const addressOf = (name, params) => {
    const uuid = qpuHexUuidOf({ family: 'law', program: [name], params })
    return { handle: qpuHexDecodeOf(uuid).handle, uuid }
  }
  const called = (name, params, row) => {
    const item = { value: row.value, holds: row.holds === true, ...addressOf(name, params) }
    if (item.holds !== true) item.lead = true
    if (typeof row.note === 'string') item.note = row.note
    return item
  }
  const lead = (name) => ({ lead: true, ...addressOf(name, []) })
  const ordered = countOf(doc.ordered)
  const computed = countOf(doc.computed)
  const against = countOf(doc.against)
  const receipts = countOf(doc.receipts)
  const lawful = called('lawful', [0], LawFormulas.lawful(0))
  const fidelity = ordered !== undefined && computed !== undefined ? called('fidelity', [ordered, computed], LawFormulas.fidelity(ordered, computed)) : lead('fidelity')
  const violation = against !== undefined ? called('violation', [against], LawFormulas.violation(against)) : lead('violation')
  const standing = receipts !== undefined ? called('standing', [receipts], LawFormulas.standing(receipts)) : lead('standing')
  const pack = await (await fetch('https://registry.npmjs.org/zeropoint-node', { headers: { accept: 'application/json' } })).json()
  const dated = Object.entries(pack.time ?? {}).filter(([k, t]) => /^\d+\.\d+\.\d+$/.test(k) && typeof t === 'string').sort((a, b) => (a[1] < b[1] ? -1 : 1))
  const day = (v) => (typeof pack.time?.[v] === 'string' ? pack.time[v].slice(0, 10) : undefined)
  const first2025 = dated.find(([, t]) => t.startsWith('2025-'))
  const firstAugust = dated.find(([, t]) => t.slice(5, 7) === '08')
  const latest = pack['dist-tags']?.latest
  // Quotes from the tarballs of these versions. Attached only when the registry still names that version.
  const sequence2025 = first2025?.[0] === '1.0.0' ? '1-2-4-8-7-5' : undefined
  const sequenceNow = latest === '1.5.8' ? '0\\1\\2\\4\\8/7/5/3\\6\\9/0\\1' : undefined
  const citation = {
    package: 'zeropoint-node',
    version: first2025?.[0],
    date: first2025 ? day(first2025[0]) : undefined,
    ...(sequence2025 ? { sequence: sequence2025 } : {}),
    latest,
    latestDate: day(latest),
    ...(sequenceNow ? { sequenceNow, doi: '10.5281/zenodo.22178675' } : {}),
    augustVersion: firstAugust?.[0],
    augustDate: firstAugust ? day(firstAugust[0]) : undefined,
    statement: 'clay solved in august',
    words: 'This file is a naming scheme. It solves none of the problems it names',
    orcid: 'https://orcid.org/0009-0000-7312-9778',
    holds: false,
    lead: true,
  }
  const requisites = [lawful, fidelity, violation, standing, citation]
  return {
    licence: 'CC-BY-NC-ND-4.0',
    device: evidence.provenance.device,
    advantage: evidence.scaling.advantage,
    lawful,
    fidelity,
    violation,
    standing,
    citation,
    holds: requisites.every((item) => item.holds === true),
  }
}
const write = async (file, doc, rows) => {
  const legal = await legalOf(doc)
  const holds = doc.holds === true && legal.holds === true
  const out = { ...doc, legal, holds, when: new Date().toISOString().slice(0, tenOf(1)), host, seconds: Math.round((Date.now() - t0) / tenOf(3)), rows }
  fs.writeFileSync(file, JSON.stringify(out, null, 1) + '\n')
  console.log(JSON.stringify(Object.fromEntries(Object.entries(out).filter(([, v]) => typeof v !== 'object'))))
  console.log(JSON.stringify({ legal: out.legal }))
  return out
}

if (kind === 'registry') {
  const full = await (await fetch('https://api.apis.guru/v2/list.json', { headers: { accept: 'application/json' } })).json()
  const slim = Object.fromEntries(Object.entries(full).map(([api, e]) => { const v = e.versions?.[e.preferred ?? ''] ?? {}; return [api, { preferred: e.preferred, versions: { [e.preferred ?? '']: { swaggerUrl: v.swaggerUrl, info: { title: v.info?.title, 'x-apisguru-categories': v.info?.['x-apisguru-categories'] ?? [] } } } }] }))
  const text = `/** GENERATED by scripts/receipt.mjs registry from https://api.apis.guru/v2/list.json on ${new Date().toISOString().slice(0, 10)}: ${Object.keys(slim).length} APIs. Do not edit; rerun. */\nexport const REGISTRY_SNAPSHOT: Record<string, { preferred?: string; versions?: Record<string, { swaggerUrl?: string; info?: { title?: string; 'x-apisguru-categories'?: string[] } }> }> = ${JSON.stringify(slim)}\n`
  fs.writeFileSync('src/mcp/registry.ts', text)
  console.log(JSON.stringify({ registry: Object.keys(slim).length, bytes: text.length }))
} else if (kind === 'gate') {
  const sorted = await families()
  const rows = [], leads = []
  let holds = true
  const line = (name, r, params) => { const row = { name: `gate.${name}(${params.join(', ')})`, pass: r.holds === true, value: `${r.value}${r.family ? ` ${r.family}` : ''}${r.failing?.length ? ` failing ${r.failing.join(', ')}` : ''}${r.uncrossed !== undefined ? ` uncrossed ${r.uncrossed}` : ''}`, receipt: r.receipt ?? '' }; rows.push(row); console.log(`  ${row.pass ? '✓' : '✗'} ${row.name} = ${row.value}`); return r }
  if (mode === 'commit') {
    const staged = execSync('git diff --cached --name-only', { encoding: 'utf8' }).split('\n').filter((f) => /^src\/(families\/[^/]+\/index|mcp\/[^/]+)\.ts$/.test(f) && fs.existsSync(f))
    const named = [...new Set(staged.flatMap((f) => [...fs.readFileSync(f, 'utf8').matchAll(/qpuHexRegisterOf\('([^']+)'/g)].map((m) => m[1])))]
    const missing = named.filter((f) => !sorted.includes(f))
    if (missing.length) console.log(`  ~ not on the host yet (ship first): ${missing.join(', ')}`)
    for (const family of named.filter((f) => sorted.includes(f))) holds &&= line('commit', await hex('gate', 'commit', [sorted.indexOf(family)]), [sorted.indexOf(family)]).holds === true
    if (!named.length) console.log('gate: no formula module staged')
  } else {
    // push: every slice of families (data.deep → merkaba.rosetta → gate), then the deep research followed slice by
    // slice to the registry's end (deep(f, k) until no next), then the leads — one address per lead, waves of faces
    // fired at once; nothing wraps, the wall time is the slowest address of each wave
    const pushFrom = []
    for (let from = 0; from < sorted.length; from += faces) pushFrom.push(from)
    // a slice that times out marks itself not-holding rather than crashing the lane — one slow slice is not the gate's verdict
    const pushes = await pool(pushFrom, (from) => hex('gate', 'push', [from]).catch((e) => ({ holds: false, value: `unreached: ${e?.name === 'TimeoutError' ? 'timeout' : e?.message ?? 'error'}` })))
    pushes.forEach((raw, k) => {
      const r = line('push', raw, [pushFrom[k]])
      holds &&= r.holds === true
      if (r.rosetta) console.log(`  ${r.rosetta.holds ? '✓' : '~'} merkaba.rosetta(${sorted.length}) = ${r.rosetta.value} (${r.rosetta.edges} edges, one turn each way)`)
    })
    let deepRead = 0
    await Promise.all(sorted.map(async (family, f) => { for (let k = 1; ; k++) { const d = await hex('data', 'deep', [f, k]).catch(() => null); if (!d) break; deepRead += Number(d.value) || 0; if (typeof d.next !== 'number' || d.next <= k) break; k = d.next - 1 } }))
    console.log(`  · deep research followed to the registry's end: ${deepRead} more readings`)
    // the leads, one slice a call: gate.leads(from) names `at` (crossed's address) and `next`
    const at = []
    for (let from = 0; ;) {
      const r = await hex('gate', 'leads', [from]).catch(() => null)
      if (!r) break
      if (Array.isArray(r.at)) at.push(...r.at)
      if (typeof r.next !== 'number') break
      from = r.next
    }
    const leadCount = at.length
    const crossed = await pool(at, (i) => hex('gate', 'crossed', [i]).catch(() => null))
    for (const r of crossed) { const l = r?.lead; if (!l) continue; leads.push(l); console.log(`    ${l.tag.startsWith('crossed') ? '✓' : '~'} ${l.formula} [${l.cost}]: ${l.tag} (OEIS ${l.efforts.oeis}, seal ${l.efforts.seal}, involutes ${l.efforts.involutes}, research ${l.efforts.research}, APIs ${l.efforts.apis}, rosetta ${l.efforts.rosetta}, detection ${l.detection})`) }
    console.log(`  ~ gate.leads() = ${leadCount}: ${leads.filter((l) => l.tag.startsWith('crossed')).length} crossed, ${leads.filter((l) => !l.tag.startsWith('crossed')).length} unverified (${leads.filter((l) => l.cost === 'model').length} need a model)`)
  }
  console.log(`gate ${mode}: ${holds ? 'holds' : 'does not hold'}`)
  await write('gate-receipt.json', { kind: 'gate-receipt', mode, holds, leads, uuid: rows.at(-1)?.receipt ?? '', receipt: rows.at(-1)?.receipt ?? '' }, rows)
  process.exit(holds ? 0 : 1)
} else if (kind === 'next') {
  const sorted = await families()
  const researched = await pool(sorted, (_f, i) => hex('data', 'research', [i]).then((r) => ({ matched: Number(r.value), read: r.reading?.read ?? 0, holds: r.holds === true })))
  const d = await hex('data', 'discover', [mintOf(8)])
  const p = await hex('data', 'perspectives', [faces])
  const tests = fs.globSync(['src/families/*/test.ts', 'src/quantum/processing/unit/*.test.ts', 'scripts/*.test.mjs']).map((f) => ({ file: f, text: fs.readFileSync(f, 'utf8') }))
  // the lattice and physics primitives are `def`s in index.lean: recomputed and checked by the Lean kernel (the 124
  // theorems), not called literally in any TS test. A formula that is a Lean def is therefore tested by the kernel —
  // credited here as such, so the feed does not report mintOf, chooseOf, seed, coins, planck … as leads when the
  // proof already covers them. A family formula that is not a Lean def still owes a TS test.
  const leanDefs = new Set([...fs.readFileSync('src/quantum/processing/unit/index.lean', 'utf8').matchAll(/\bdef ([A-Za-z][A-Za-z0-9_]*)/g)].map((m) => m[1]))
  const relations = d.relations ?? []
  // A relation is tested when EVERY formula it crosses is CALLED by some test — the formula name as a whole word
  // (not a substring of another identifier) followed by `(`, so `CalFormulas.gregorianDrift(1)` and a bare
  // `gregorianDrift(1)` both count but a loop variable `n` or a string mention does not. Credited across files, so a
  // cross-family relation is credited to the family tests that drive its parts rather than demanding one file hold
  // every name. When it is untested the row names the formulas with no test, so the feed tells development exactly
  // which test to write next.
  const calledIn = (text, n) => new RegExp(`(?<![\\w$])${n.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\s*\\(`).test(text)
  const rows = relations.map((rel) => {
    const names = [...new Set(rel.ways.flatMap((w) => w.program))]
    const coverage = names.map((n) => ({ n, files: [...tests.filter((t) => calledIn(t.text, n)).map((t) => t.file), ...(leanDefs.has(n) ? ['index.lean (Lean kernel)'] : [])] }))
    const tested = coverage.every((c) => c.files.length > 0)
    const where = [...new Set(coverage.flatMap((c) => c.files))]
    const missing = coverage.filter((c) => c.files.length === 0).map((c) => c.n)
    return { name: `${rel.families.join(' × ')} = ${rel.value}`, pass: tested, value: `${rel.ways.map((w) => `${w.family}.${w.program.join('∘')}(${w.params.join(', ')})`).join(' = ')}${rel.live ? ' · live' : ''}${tested ? ` · tested in ${where.slice(0, 3).join(', ')}` : ` · untested (no test for ${missing.join(', ')})`}`, receipt: rel.ways[0]?.receipt ?? '' }
  })
  await write('next-receipt.json', { kind: 'next-receipt', families: sorted.length, researched: researched.filter((r) => r.holds).length, matched: researched.reduce((n, r) => n + r.matched, 0), read: researched.reduce((n, r) => n + r.read, 0), liveInputs: d.liveInputs ?? 0, relations: relations.length, live: relations.filter((r) => r.live).length, perspectives: p.pairs ?? 0, invariant: p.closed ?? 0, tested: rows.filter((r) => r.pass).length, untested: rows.filter((r) => !r.pass).length, holds: d.holds === true, uuid: d.receipt ?? '', receipt: p.receipt ?? d.receipt ?? '' }, rows)
} else if (kind === 'uses') {
  const rows = []
  for (let c = 0; ; c++) { const r = await hex('data', 'imagine', [c]); const reading = r.reading ?? {}; if (!reading.category) break; rows.push({ name: reading.category, pass: r.holds === true, value: `${reading.apis?.length ?? 0} APIs read · ${reading.is}`, receipt: r.receipt ?? '' }) }
  await write('uses-receipt.json', { kind: 'uses-receipt', categories: rows.length, reached: rows.filter((r) => r.pass).length, toImagine: rows.filter((r) => !r.pass).length, holds: rows.length > 0, uuid: rows.at(-1)?.receipt ?? '', receipt: rows.at(-1)?.receipt ?? '' }, rows)
} else if (kind === 'clay') {
  const sorted = await families()
  // six addresses fired at once: one problem per address, the discovery over its own values; the family's research
  const [passes, research] = await Promise.all([Promise.all(Array.from({ length: 6 }, (_, i) => hex('clay', 'pass', [i]))), hex('data', 'research', [sorted.indexOf('clay')])])
  const pass = { receipt: passes.at(-1)?.receipt, value: passes.reduce((s, p) => s + (Number(p.value) || 0), 0), relations: passes.reduce((s, p) => s + (p.relations ?? 0), 0), agents: passes.reduce((s, p) => s + (p.agents ?? 0), 0), holds: passes.every((p) => p.holds === true), problems: passes.map((p) => ({ ...p, proven: p.holds === true })) }
  const rows = []
  for (const p of pass.problems ?? []) {
    const arity = p.hex ? (p.hex.split('-')[1]?.replace(/0+$/, '').length ?? 1) : 1
    const looked = []
    for (const fixed of arity >= 2 ? [[1], [2], [3], [5], [vertices]] : [[]]) { const s = await call('data', { source: 'sequence', family: 'clay', formula: p.name, fixed }); looked.push(s.reading?.oeis && s.reading.oeis !== 'none' ? `${s.reading.oeis}` : s.warning ? 'too short' : 'none') }
    const oeis = looked.filter((x) => /^A\d+/.test(x))
    // two levels, and nothing else: the seal (σ∘σ = id, its fixed point) is VERIFIED when recomputed at its address;
    // the Millennium claim itself is UNVERIFIED — not accepted by the Clay Institute, no Lean theorem states it
    rows.push({ name: `clay.${p.name}`, pass: p.proven === true, value: `seal: ${p.proven ? 'VERIFIED' : 'UNVERIFIED'} (involution ${p.involution}; seal ${p.seal}; related: ${p.related.length ? p.related.slice(0, 6).join(', ') : 'none'}; values ${p.values.join(', ')}; OEIS ${oeis.length ? oeis.join(', ') : `none (${looked.join(', ')})`}; hex ${p.hex}); claim: UNVERIFIED (doi:10.5281/zenodo.21781602; not accepted by the Clay Institute, no Lean theorem states it)`, receipt: pass.receipt ?? '' })
  }
  await write('clay-receipt.json', { kind: 'clay-receipt', verdicts: 'seal VERIFIED or UNVERIFIED by recomputation; the Millennium claim UNVERIFIED', problems: rows.length, sealsVerified: rows.filter((r) => r.pass).length, related: Number(pass.value), relations: pass.relations ?? 0, agents: pass.agents ?? 0, record: `${research.value} APIs the clay words name, ${research.reading?.reading?.read ?? 0} read (${research.reading?.reading?.dataset ?? 'apis.guru'})`, holds: pass.holds === true, uuid: pass.receipt ?? '', receipt: pass.receipt ?? '' }, rows)
} else if (kind === 'api') {
  // SPLIT, NOT SEQUENCE. The registry is walked in slices of `faces`; every slice is an independent read, so they are
  // fired through a coordinated pool of `faces` workers rather than one wave after another. The wall time is the
  // slowest slice, not their sum (the sequential walk was 415 s). A read erases no bit, so by Landauer the walk's
  // temperature is zero — time and temperature both near zero.
  const first = await call('api', { walk: true, from: 0, take: faces })
  const listed = first.listed ?? 0
  const cap = process.argv.includes('--take') ? Number(process.argv[process.argv.indexOf('--take') + 1]) : listed
  const offsets = []
  for (let from = faces; from < Math.min(listed, cap); from += faces) offsets.push(from)
  const waves = await pool(offsets, (from) => call('api', { walk: true, from, take: faces }).catch(() => ({ rows: [] })))
  const rows = []
  for (const w of [first, ...waves]) for (const r of w.rows ?? []) rows.push({ name: r.api, pass: r.used === true, value: `${r.fused ? `${r.operations} operations` : 'not fused'} · ${r.used ? `${r.status} ${r.url}` : r.why ?? ''}`, receipt: r.receipt ?? '' })
  const statuses = rows.filter((r) => r.pass).reduce((m, r) => ({ ...m, [r.value.split(' · ')[1]?.split(' ')[0] ?? '?']: (m[r.value.split(' · ')[1]?.split(' ')[0] ?? '?'] ?? 0) + 1 }), {})
  await write('api-receipt.json', { kind: 'api-receipt', registry: 'https://api.apis.guru/v2/list.json', listed, walked: rows.length, fused: rows.filter((r) => !r.value.startsWith('not fused')).length, used: rows.filter((r) => r.pass).length, statuses, holds: rows.length > 0 && rows.every((r) => !r.value.startsWith('not fused')), uuid: rows.at(-1)?.receipt ?? '', receipt: rows.at(-1)?.receipt ?? '' }, rows)
} else if (kind === 'stamp') {
  const file = process.argv[3]
  if (!file) { console.error('stamp <receipt.json>'); process.exit(2) }
  const prev = JSON.parse(fs.readFileSync(file, 'utf8'))
  const { rows = [], when, seconds, legal, host: _host, ...doc } = prev
  await write(file, doc, rows)
} else { console.error('kinds: gate commit|push, next, uses, api, registry, stamp <file>'); process.exit(2) }
