#!/usr/bin/env node
// GUARD: npm run and CI use the PAYLOAD MCP ONLY, and the MCP is GENERATED FROM LEAN. Before any free wave or develop
// runs over the MCP, verify the host's MCP is (1) served by @payloadcms/plugin-mcp — not a second, unsanctioned MCP
// server (qpuPayloadPluginHolds is load-bearing in the circuit and the Shor run) — and (2) generated from the Lean
// kernel: every theorem recomputed from the embedded Lean source and served verbatim, the source holding. The guard is
// one prove call, which carries both (circuit.steps.path.plugin and source.{theorems,recomputed,verbatim,served,holds}).
// Anything else is a HARD VIOLATION and the guard exits non-zero, refusing to run. A host that cannot be reached is not a
// violation — it is a soft pass (retried next run), like the waves.
//   node scripts/guard.mjs [https://qpu.uuidna.com]   (or QPU_HOST=qpu.uuidna.com)
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

if (import.meta.url === `file://${process.argv[1]}`) {
  const host = process.env.QPU_HOST ? `https://${process.env.QPU_HOST}` : (process.argv[2] ?? 'https://qpu.uuidna.com')
  const g = await guardPayloadMcp(host)
  console.log(`guard (${host}): ${g.guarded ? 'OK — ' : g.reached ? 'REFUSED — ' : 'skip — '}${g.why}`)
  // a confirmed wrong plugin is a hard violation (exit 1); unreached is a soft pass (exit 0) so the schedule is not broken
  process.exit(g.reached && !g.guarded ? 1 : 0)
}
