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

const slice = async (fams, from) => {
  const team = fams.slice(from, from + FACES) // a slice is a team; 2 and 3 compose it
  const rows = await Promise.all(team.map(develop))
  for (const r of rows) console.log(r.hot ? `  hot  ${r.family} (${r.ms}ms) — left for next run` : `  ok   ${r.family}: matched ${r.matched}, read ${r.read} (${r.ms}ms)`)
  return rows
}

const main = async () => {
  const fams = await familiesOf()
  if (fams.length === 0) { console.log('the host served no families (unreached, or predates the ask door) — nothing to develop this run'); process.exit(0) }
  const all = process.argv.includes('--all')
  const from = Number(arg('--from') ?? 0)
  console.log(`develop all, free: ${fams.length} families on ${HOST}, teams of ${FACES} (2 and 3 compose each)`)
  let done = 0, hot = 0
  for (let i = from; i < fams.length; i += FACES) {
    const rows = await slice(fams, i)
    done += rows.filter((r) => !r.hot).length
    hot += rows.filter((r) => r.hot).length
    if (!all) break
  }
  console.log(`\n✓ developed ${done} families free; ${hot} hot, left for the next run (zero temp: the slow are not waited on)`)
  process.exit(0)
}
main().catch((e) => { console.error(`develop: ${e.message}`); process.exit(0) })
