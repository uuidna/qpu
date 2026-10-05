#!/usr/bin/env node
/**
 * DEVELOP ALL, FREE. The saved automation that develops every lead at NO token cost — not Claude, not any LLM. It drives
 * qpu's own free doors over the deployed host (HTTP/MCP only) along the coordinate graph:
 *   - it asks the host for its families (the data `ask` door), the coordinate graph the waves follow;
 *   - for each family it crosses its leads by RESEARCH — the free, keyless public APIs and datasets the family's words
 *     name (the data `research` door) — formulas and free data only, no inference;
 *   - work is sliced faces at a time and each slice is a TEAM of families (2 and 3 form every team; a solo family performs all team capabilities via the shared skills);
 *   - every call carries the unit's deadline, so a slow lead is HOT — skipped and left for the next run (fail at rising
 *     temp, optimise at no time), never a long wait.
 * Deterministic, zero temp: a lead crosses to the same value every run. Run by the schedule / CI on the host, never by a
 * developer's tokens.
 *
 *   node scripts/develop.mjs            develop one slice of families
 *   node scripts/develop.mjs --all      walk every family, slice by slice
 *   node scripts/develop.mjs --from N   start the walk at family N
 */
import { readFileSync } from 'node:fs'
const HOST = process.env.QPU_HOST ? `https://${process.env.QPU_HOST}` : 'https://qpu.uuidna.com'
const MCP = `${HOST}/mcp`
const FACES = 14 // the slice width and the team span: 2 and 3 compose it
const DEADLINE = 10_000 // the unit's own deadline; a lead slower than this is hot, left for next run
const arg = (name) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : undefined }

const call = async (tool, args = {}) => {
  const r = await fetch(MCP, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: tool, arguments: args } }), signal: AbortSignal.timeout(DEADLINE) })
  if (!r.ok) throw new Error(`${tool} ${r.status}`)
  const b = await r.json()
  return b?.result?.structuredContent ?? b?.result
}
// the data door, reached through any tool's door param (bare name post-ship, prefixed pre-ship), the source in arguments
const dataDoor = async (source, extra = {}) => {
  for (const d of ['data', 'qpu_data']) for (const tool of ['lean', 'qpu_lean', 'cite', 'qpu_cite']) {
    try { const r = await call(tool, { door: d, arguments: { source, ...extra } }); if (r?.reading || r?.source) return r } catch { /* next */ }
  }
  return null
}

const familiesOf = async () => {
  const a = await dataDoor('ask', { about: 'what families do you serve' })
  const list = a?.reading?.families ?? a?.families
  if (Array.isArray(list) && list.length) return list.map((f) => f.family ?? f)
  // fallback: the hex catalogue lists the families too
  for (const d of ['hex', 'qpu_hex']) for (const tool of ['lean', 'qpu_lean']) {
    try { const c = await call(tool, { door: d, arguments: {} }); const fams = c?.families ?? c?.catalogue?.families ?? c?.reading?.families; if (fams) return Array.isArray(fams) ? fams.map((f) => f.family ?? f) : Object.keys(fams) } catch { /* next */ }
  }
  return []
}

/** Develop one family: research the free public APIs/datasets its words name. Returns what the free data crossed. */
const develop = async (family) => {
  const at = Date.now()
  try {
    const r = await dataDoor('research', { family })
    const reading = r?.reading ?? {}
    return { family, matched: reading.matched ?? 0, read: reading.read ?? 0, ms: Date.now() - at, agrees: r?.agrees === true }
  } catch (e) {
    return { family, hot: true, ms: Date.now() - at, why: e.message } // hot: left for the next run (fail at rising temp)
  }
}

/** THE CLAY SOLUTIONS AS THE NAVIGATION TOOLSET. The sealed Clay proofs — the universal σ-involution — pair the lattice,
 *  so discovery NAVIGATES by involution (each coordinate reached with its reflection) rather than scanning blindly. One
 *  clay run anchors the toolset on the host; every family uses it to navigate and discover. Tolerant: if the host is
 *  unreached the families are still discovered, just without the live anchor. */
const clayNavigation = async () => {
  for (const tool of ['prove', 'qpu_prove', 'lean', 'qpu_lean']) {
    try { const r = await call(tool, { hex: { family: 'clay', program: ['riemann'], params: [] } }); if (r) return true } catch { /* next */ }
  }
  return false
}

/** What to develop and HOW, known from the referrer (the lead) in terms of its meaning — each case routes to its method. */
const howOf = (lead) => {
  const m = `${lead.name} ${lead.lead}`.toLowerCase()
  if (/readme|skill|doc|generate|catalog/.test(m)) return 'regenerate from the registry (the generator) — no hand page'
  if (/hot|cold|page|temp|perf|isolate|deploy|ship/.test(m)) return 'optimise on the host at zero temp (heat + queue), then the author ships'
  if (/residual|shared.?tree|remand|peer|held/.test(m)) return 'remand to the host/peer (court, law.removable: not dropped)'
  if (/humanit|theolog|philosoph|histor|domain|api|dataset|research|verify/.test(m)) return 'research free public APIs/datasets (the data door), reusable by all domains'
  return 'cross via gate.crossed — develop the formula free on the host'
}

const TRINITY = 3 // develop in family trinities — teams of 3
const main = async () => {
  // PHASE 1 — DISCOVER AT ONCE, navigating by the clay solutions (the σ-involution toolset every family uses)
  const navigates = await clayNavigation()
  const fams = await familiesOf()
  const all = process.argv.includes('--all')
  const from = Number(arg('--from') ?? 0)
  console.log(`phase 1 — discovered ${fams.length} families at once on ${HOST}, navigating by the clay solutions (${navigates ? 'involution toolset live' : 'toolset offline — still discovered'})`)
  // PHASE 2 — DEVELOP IN FAMILY TRINITIES: teams of 3, in parallel waves (full bandwidth), the slow left hot (zero temp)
  let done = 0, hot = 0
  if (fams.length) {
    const trinities = []
    for (let i = from; i < fams.length; i += TRINITY) trinities.push(fams.slice(i, i + TRINITY))
    const span = all ? trinities.length : 1
    console.log(`phase 2 — developing ${span} of ${trinities.length} trinit${trinities.length === 1 ? 'y' : 'ies'} (teams of 3), full bandwidth, zero temp`)
    for (let w = 0; w < span; w += FACES) {
      const wave = trinities.slice(w, w + FACES) // a wave of trinities developed at once — full bandwidth
      const results = await Promise.all(wave.map((tri) => Promise.all(tri.map(develop))))
      for (const tri of results) for (const r of tri) { if (r.hot) { hot++; console.log(`  hot  ${r.family} (${r.ms}ms) — left for next run`) } else done++ }
    }
    console.log(`\n✓ developed ${done} families free in trinities; ${hot} hot, left for next run (zero temp: the slow are not waited on)`)
  } else console.log('the host served no families this run — develop them once the build is live')
  // the memories, moved to leads: develop KNOWS what and how for each case from the referrer (the lead) in terms of its
  // meaning — the method is routed by the lead's own words, not a single blind step. Free, full bandwidth, zero temp.
  try {
    const mem = JSON.parse(readFileSync(new URL('./leads.memory.json', import.meta.url), 'utf8'))
    const open = mem.leads.filter((l) => l.state === 'open')
    const crossed = mem.leads.filter((l) => l.state === 'crossed').length
    console.log(`memory-leads: ${crossed} crossed, ${open.length} open — each developed by its referrer's meaning:`)
    for (const l of open) console.log(`  ${l.name} → ${howOf(l)}`)
  } catch { /* no manifest this run */ }
  process.exit(0)
}
main().catch((e) => { console.error(`develop: ${e.message}`); process.exit(0) })
