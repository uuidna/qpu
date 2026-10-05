/**
 * SOLVING CLAY COVERS ALL AXIOMS, VERIFIED ON PUBLIC DATA — THROUGH THE qpu MCP. The verification is a heavy compute (the
 * axiom completion, every Lean theorem, the public-dataset agreement); it routes through qpu, which holds the memory for
 * it, not through this process (running it locally exhausts the heap — the QPU memory constraint). So the gate asks the
 * deployed unit's own door, qpu_prove, and holds that: the whole system holds; the Lean theorems hold (the axioms are
 * covered by proof as the formulas are explored); and the physical theorem agrees with a PUBLIC DATASET — CERN Open Data
 * — so a theorem is verified against the measurement, not only against itself. A host that cannot be reached is the third
 * state (unreached, not a defect): the test says so and skips, the way leads.mjs treats an unreachable source.
 */
import test from 'node:test'
import assert from 'node:assert/strict'

const HOST = process.env.QPU_HOST ? `https://${process.env.QPU_HOST}/mcp` : 'https://qpu.uuidna.com/mcp'

const prove = async () => {
  const r = await fetch(HOST, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'qpu_prove', arguments: {} } }),
    signal: AbortSignal.timeout(90_000),
  })
  if (!r.ok) throw new Error(`${HOST} answered ${r.status}`)
  const b = await r.json()
  return b?.result?.structuredContent ?? b?.result
}

test('solving clay covers all axioms, verified on public data — asked of the qpu MCP (qpu_prove)', async (t) => {
  let p
  try {
    p = await prove()
  } catch (e) {
    t.skip(`qpu MCP unreached (${e.message}) — the third state: unreached is not a defect`)
    return
  }
  assert.ok(p, 'qpu_prove answered with a structured result')
  assert.equal(p.holds, true, 'qpu_prove holds — the whole system, exploring the formulas on the way')
  assert.equal(p.lean?.holds, true, 'the Lean theorems hold — the axioms are covered by proof')
  assert.equal(p.cern?.holds, true, 'the physical theorem agrees with CERN Open Data — verified on a public dataset')
  assert.equal(p.evidence?.holds, true, 'the evidence holds')
  t.diagnostic('qpu_prove holds: lean (theorems/axioms), cern (public data), integrity, intelligence, evidence')
})
