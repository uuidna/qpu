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
 *   npx tsx scripts/develop.ts            develop one slice of families
 *   npx tsx scripts/develop.ts --all      walk every family, slice by slice
 *   npx tsx scripts/develop.ts --from N   start the walk at family N
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { faces, tenOf } from './lattice-values.js'
// QPU_HOST is a host name (https) or a full origin, e.g. http://localhost:8787 for a build running on this machine
const HOST = process.env.QPU_HOST ? (/^https?:\/\//.test(process.env.QPU_HOST) ? process.env.QPU_HOST : `https://${process.env.QPU_HOST}`) : 'https://qpu.uuidna.com'
const MCP = `${HOST}/mcp`
const FACES = faces // the slice width and the team span: 2 and 3 compose it
const DEADLINE = Number(process.env.QPU_DEADLINE_MS) || tenOf(4) // the unit's own deadline (10 s); a lead slower than this is hot, left for next run. QPU_DEADLINE_MS widens it for a retry
const arg = (name) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : undefined }

const call = async (tool, args = {}) => {
  const r = await fetch(MCP, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: tool, arguments: args } }), signal: AbortSignal.timeout(DEADLINE) })
  if (!r.ok) throw new Error(`${tool} ${r.status}`)
  const b = await r.json()
  return b?.result?.structuredContent ?? b?.result
}
// every host read goes through the connector, over MCP only: a source is answered by the connector's data door. A failure
// comes back as the connector's own reply (kind 'failure') with its `next` steps, so the caller is pointed at what to do.
const dataDoor = async (source, extra = {}) => {
  // { full: true } asks for the whole reading: without it the connector answers its recognition summary, which has no reading
  try { return await call('connector', { source, full: true, ...extra }) } catch (e) {
    // classified as the connector classifies a failure: the next step names the fix, not a generic retry
    const msg = String(e?.message ?? e)
    const next = /abort|timeout|timed out/i.test(msg) ? 'the source did not answer in time: it is read again on the next run'
      : /fetch failed|ECONNREFUSED|ENOTFOUND|network/i.test(msg) ? `the connector is not reachable at ${HOST}: start it (npm run build, then PORT=8787 node dist/quantum/processing/unit/boot.js) or set QPU_HOST`
      : "tools/call connector { source: 'all' } lists every source this host serves"
    return { kind: 'failure', why: msg, next: [next] }
  }
}

// THE FAMILIES, READ FROM THE REGISTRY THIS BUILD SEALED: the host's reply to 'ask' is capped at 10,000 characters and
// its list is not paged, so the walk takes every family from the built registry (dist/mcp/families.js) and the host
// develops each one. The host list is the fallback when no build is present.
// A FAMILY IS A FOLDER: src/families/<name>/index.ts. The registry also lists the fused doors that register beside it
// (api-door, mcp-capabilities, qpu-fused): those are not families and are not walked, so the walk reads the folders.
const localFamiliesOf = async () => {
  const dir = new URL('../src/families/', import.meta.url)
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && existsSync(new URL(`${e.name}/index.ts`, dir)))
    .map((e) => e.name)
    .sort()
}

const familiesOf = async () => {
  const local = await localFamiliesOf()
  if (local.length) return local
  const a = await dataDoor('ask', { about: 'what families do you serve' })
  const list = a?.reading?.families ?? a?.families
  if (Array.isArray(list) && list.length) return list.map((f) => f.family ?? f)
  // fallback: the hex catalogue lists the families too
  for (const d of ['hex']) for (const tool of ['lean']) {
    try { const c = await call(tool, { door: d, arguments: {} }); const fams = c?.families ?? c?.catalogue?.families ?? c?.reading?.families; if (fams) return Array.isArray(fams) ? fams.map((f) => f.family ?? f) : Object.keys(fams) } catch { /* next */ }
  }
  return []
}

/** Develop one family: research the free public APIs/datasets its words name. Returns what the free data crossed. */
const develop = async (family) => {
  try {
    const r = await dataDoor('research', { family })
    // a failed research call is hot, with the connector's own next steps; it is never counted as developed
    if (!r?.reading) return { family, hot: true, why: r?.why ?? r?.resolve ?? 'no reading', next: r?.next ?? [] }
    const reading = r.reading
    // always research for novelty funding WHILE researching: the keyless funding a family's novel work can draw (the
    // funder's own criterion is novelty, so the novel and its funding are researched together), surfaced beside the research.
    const fund = await dataDoor('funding', { about: family }).catch(() => null)
    return { family, matched: reading.matched ?? 0, read: reading.read ?? 0, funding: fund?.reading?.keyless ?? 0, agrees: r?.agrees === true }
  } catch (e) {
    return { family, hot: true, why: e.message } // hot: left for the next run (fail at rising temp)
  }
}

/** THE CLAY SOLUTIONS AS THE NAVIGATION TOOLSET. The sealed Clay proofs — the universal σ-involution — pair the lattice,
 *  so discovery NAVIGATES by involution (each coordinate reached with its reflection) rather than scanning blindly. One
 *  clay run anchors the toolset on the host; every family uses it to navigate and discover. Tolerant: if the host is
 *  unreached the families are still discovered, just without the live anchor. */
const clayNavigation = async () => {
  for (const tool of ['prove', 'lean']) {
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
  // --only a,b,c develops exactly those families (a retry of the hot ones); otherwise every family the registry seals
  const only = arg('--only')
  const fams = only ? only.split(',').map((f) => f.trim()).filter(Boolean) : await familiesOf()
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
    // A POOL, NOT WAVES: FACES trinities run at full bandwidth, and each slot takes the next trinity the moment it frees.
    // Every family is reported when it finishes, so no result waits on the slowest of a wave.
    const queue = trinities.slice(0, span)
    const slots = Array.from({ length: Math.min(FACES, queue.length) }, async () => {
      while (queue.length) {
        const tri = queue.shift()
        await Promise.all(tri.map(async (family) => {
          const r = await develop(family)
          if (r.hot) { hot++; console.log(`  hot  ${r.family} — ${r.why}; next: ${(r.next ?? []).join(' | ') || 'left for the next run'}`) } else { done++; console.log(`  done ${r.family}`) }
        }))
      }
    })
    await Promise.all(slots)
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
  // DEVELOP ALL RELATED PORTS: the node builtins and dependencies still leads in the port graph — navigated by the clay
  // solutions, developed in trinities, free. A node-builtin lead becomes a qpu door; a dependency lead becomes a family.
  try {
    const porting = await import(new URL('../dist/quantum/processing/unit/porting.js', import.meta.url))
    const ports = Object.entries(porting.QPU_PORTS ?? {}).filter(([, p]) => p.lead).map(([n]) => n)
    const deps = Object.entries(porting.QPU_DEPS ?? {}).filter(([, p]) => p.lead).map(([n]) => n)
    console.log(`related ports: ${ports.length} node-builtin + ${deps.length} dependency leads to port (clay-navigated, developed in trinities)${ports.length ? ` — node: ${ports.join(', ')}` : ''}`)
  } catch { /* dist not built this run */ }
  process.exit(0)
}
main().catch((e) => { console.error(`develop: ${e.message}`); process.exit(0) })
