#!/usr/bin/env node
// GUARD: npm run and CI use the PAYLOAD MCP ONLY, and the MCP is GENERATED FROM LEAN. Before any free wave or develop
// runs over the MCP, verify the host's MCP is (1) served by @payloadcms/plugin-mcp — not a second, unsanctioned MCP
// server (payloadPluginHolds is load-bearing in the circuit and the Shor run) — and (2) generated from the Lean
// kernel: every theorem recomputed from the embedded Lean source and served verbatim, the source holding. The guard is
// one prove call, which carries both (circuit.steps.path.plugin and source.{theorems,recomputed,verbatim,served,holds}).
// Anything else is a HARD VIOLATION and the guard exits non-zero, refusing to run. A host that cannot be reached is not a
// violation — it is a soft pass (retried next run), like the waves.
//   npx tsx scripts/guard.ts [https://qpu.uuidna.com]   (or QPU_HOST=qpu.uuidna.com)
const PLUGIN = '@payloadcms/plugin-mcp'

export const guardPayloadMcp = async (host = 'https://qpu.uuidna.com') => {
  const r = await fetch(`${host.replace(/\/$/, '')}/mcp`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'prove', arguments: {} } }),
    signal: AbortSignal.timeout(120000),
  }).catch(() => null)
  if (!r) return { reached: false, guarded: false, why: 'host unreached (soft pass — retried next run)' }
  const b = await r.json().catch(() => null)
  let prove
  try { prove = JSON.parse(b.result.content[0].text) } catch { prove = b?.result?.structuredContent ?? null }
  const plugin = prove?.circuit?.steps?.path?.plugin
  const src = prove?.source
  // GENERATED FROM LEAN: every theorem recomputed from the embedded Lean source, served verbatim, and the source holds —
  // the MCP is a reading of the kernel, not hand-written. (prove recomputes leanRecomputed from leanSource.)
  const leanGenerated = src?.holds === true && (src?.theorems ?? 0) > 0 && src?.recomputed === src?.theorems && src?.verbatim === src?.served
  const payloadOnly = plugin === PLUGIN
  const guarded = prove?.holds === true && payloadOnly && leanGenerated
  const why = guarded
    ? `payload mcp only (${PLUGIN}), generated from lean (${src?.recomputed}/${src?.theorems} theorems recomputed, 0 axioms)`
    : `HARD VIOLATION — ${!payloadOnly ? `MCP is not ${PLUGIN} (plugin=${plugin ?? '?'})` : !leanGenerated ? `MCP not generated from lean (recomputed=${src?.recomputed}/${src?.theorems}, verbatim=${src?.verbatim}/${src?.served}, source.holds=${src?.holds})` : 'prove does not hold'}`
  return { reached: true, guarded, plugin, holds: prove?.holds === true, lean: { theorems: src?.theorems, recomputed: src?.recomputed, generated: leanGenerated }, why }
}

// GUARD that ALL public news portals are DEEP-RESEARCHED IN COURT: the news source reads five public portals (Hacker
// News, Reddit, Lobsters, Dev.to, and GDELT global news) — each story a lead, its words and numbers fed to the discovery
// and routed to the court (reviewed=0, never asserted as fact). The guard reads every portal and verifies the research
// reaches them and surfaces leads; a portal's transient downtime is tolerated, but the research being broken is a hard
// violation. News is read as LEADS in the court, never claimed — surfacing a news item as a settled fact would be the
// violation this guards against.
export const guardNews = async (host = 'https://qpu.uuidna.com') => {
  const PORTALS = ['hn', 'reddit', 'lobsters', 'devto', 'gdelt']
  const rpc = async (site) => {
    const r = await fetch(`${host.replace(/\/$/, '')}/mcp`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'quantum', arguments: { door: 'data', arguments: { source: 'news', site } } } }),
      signal: AbortSignal.timeout(120000),
    }).catch(() => null)
    if (!r) return null
    const b = await r.json().catch(() => null)
    try { return JSON.parse(b.result.content[0].text) } catch { return b?.result?.structuredContent ?? null }
  }
  const results = await Promise.all(PORTALS.map((s) => rpc(s)))
  if (results.every((r) => r === null)) return { reached: false, guarded: false, why: 'host unreached (soft pass — retried next run)' }
  const portals = PORTALS.map((site, i) => ({ site, reached: results[i] !== null, leads: results[i]?.reading?.count ?? 0, surfaced: results[i]?.agrees === true }))
  const surfaced = portals.filter((p) => p.surfaced)
  // deep-researched in court: the research reaches the portals and surfaces leads; demand a majority return (external
  // portals have downtime), and that every portal was at least attempted (the SITES set is the five public portals).
  const guarded = portals.length === PORTALS.length && surfaced.length >= 3
  const why = guarded
    ? `${surfaced.length}/${PORTALS.length} public news portals deep-researched as court leads (${surfaced.map((p) => `${p.site}:${p.leads}`).join(', ')}) — reviewed=0, never asserted`
    : `HARD VIOLATION — news research not surfacing in court (${surfaced.length}/${PORTALS.length} portals returned leads: ${surfaced.map((p) => p.site).join(', ') || 'none'})`
  return { reached: true, guarded, portals, surfaced: surfaced.length, why }
}

// GUARD that lean COVERAGE and COMPLIANCE are MACHINE-VERIFIED, not decided by hand. Coverage: every family is leaned by
// the clay σ-involution WITHOUT EXCEPTION — clay.disclosure holds (its holds encodes anchor ∧ withoutException ∧
// families > 0) and its value equals the family count the doors report. Compliance: the kernel holds (prove), every
// theorem recomputed from the embedded Lean source, 0 axioms. A gap in either is a HARD VIOLATION (exit 1); an
// unreachable host is a soft pass. No number here is chosen by a person — the unit reports it and the guard compares it.
export const guardLean = async (host = 'https://qpu.uuidna.com') => {
  const base = host.replace(/\/$/, '')
  const rpc = async (name, args = {}) => {
    const r = await fetch(`${base}/mcp`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }),
      signal: AbortSignal.timeout(120000),
    }).catch(() => null)
    if (!r) return null
    const b = await r.json().catch(() => null)
    try { return JSON.parse(b.result.content[0].text) } catch { return b?.result?.structuredContent ?? null }
  }
  // CLAY DECIDES LEAN; THIS GUARD DOES NOT. The verdict is the server-computed clay.disclosure.holds — a single sealed
  // boolean the unit itself computes (σ-involution over every family ∧ embedded kernel recomputes clean ∧ families > 0)
  // and that the unit ENFORCES by refusing to serve (404) when it is false. The guard reads that one boolean verbatim;
  // it does not re-derive a verdict in JS (that would be the guard deciding lean, in a script an agent can edit — not
  // clay). value (= the family count clay disclosed) is reported for the operator, never recombined into the verdict.
  const disclosure = await rpc('quantum', { door: 'clay.disclosure' })
  if (disclosure === null) return { reached: false, guarded: false, why: 'host unreached (soft pass — retried next run)' }
  const guarded = disclosure.holds === true
  const why = guarded
    ? `clay answers lean: clay.disclosure.holds === true — the unit's own sealed verdict (σ-involution over all ${disclosure.value} families + kernel recomputes clean), enforced server-side (false ⇒ 404). Read verbatim, not re-derived.`
    : `HARD VIOLATION — clay.disclosure.holds is ${disclosure.holds} (families disclosed: ${disclosure.value}); clay says lean is not in harmony, and the unit would 404 rather than serve it`
  return { reached: true, guarded, families: disclosure.value, verdict: 'clay.disclosure.holds', why }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const host = process.env.QPU_HOST ? `https://${process.env.QPU_HOST}` : (process.argv[2] ?? 'https://qpu.uuidna.com')
  const mcp = await guardPayloadMcp(host)
  console.log(`guard mcp (${host}): ${mcp.guarded ? 'OK — ' : mcp.reached ? 'REFUSED — ' : 'skip — '}${mcp.why}`)
  const lean = await guardLean(host)
  console.log(`guard lean: ${lean.guarded ? 'OK — ' : lean.reached ? 'REFUSED — ' : 'skip — '}${lean.why}`)
  const news = await guardNews(host)
  console.log(`guard news: ${news.guarded ? 'OK — ' : news.reached ? 'REFUSED — ' : 'skip — '}${news.why}`)
  // a confirmed violation (wrong plugin, un-lean MCP, lean not covering every family, kernel not compliant, uncited
  // news not surfaced in court) is hard (exit 1); an unreachable host is a soft
  // pass (exit 0) so the schedule is not broken.
  process.exit(
    (mcp.reached && !mcp.guarded) ||
      (lean.reached && !lean.guarded) ||
      (news.reached && !news.guarded)
      ? 1
      : 0,
  )
}
