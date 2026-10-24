#!/usr/bin/env node
/**
 * SHIP KNOWS, IT DOES NOT ASSUME. Ship does not deploy unless the code is proven COMPLETE and STABLE — machine-verified
 * here, aborting (exit 1) on any gap. The `ship` script runs this after the Lean ground truth (`lake build`), the embed,
 * and the tests, and before the Cloudflare deploy, so nothing reaches the live host that cannot answer for itself.
 *
 *   COMPLETE — the deployment gate holds: every operation resolves, `prove` holds, the embedded constants match the live
 *              recompute (no drift), and the kernel is 0 axioms with every theorem recomputed from the Lean source.
 *   COVERED  — lean covers every family WITHOUT EXCEPTION: clay.disclosure holds (anchor ∧ withoutException ∧ families>0)
 *              and the number of families it leans equals the number the registry holds.
 *
 * No number is chosen by a person: the unit reports them and this gate compares them. Run after `npm run build` +
 * `npm run lean:embed` + `npm run build` so dist is fresh.
 */
await import('../dist/mcp/families.js') // load every family into the registry first
const core = await import('../dist/mcp/uuid-programmable-core.js')
const idx = await import('../dist/quantum/processing/unit/index.js')
const { ClayDisclosure } = await import('../dist/families/clay/index.js')

const gate = await core.consolidatedMCP.runDeploymentGate()
const families = idx.hexFamiliesOf().size
const disc = ClayDisclosure.disclosure()

// COMPLETE — the deployment gate (every operation resolves, embed matches, prove holds). LEAN — answered by clay: the
// one authority, clay.disclosure, holds iff the σ-involution covers every family without exception AND the embedded
// kernel recomputes clean. Ship reads that one answer rather than re-deriving the kernel here.
const complete = gate.ok === true && gate.proved === true && (gate.unresolved?.length ?? 1) === 0
const lean = disc.holds === true && disc.value === families && families > 0

if (!complete || !lean) {
  console.error('ship gate: REFUSED — not proven complete, and/or clay does not answer lean; not shipping')
  if (!complete) console.error(`  not complete: deployment gate ok=${gate.ok} proved=${gate.proved} unresolved=${JSON.stringify(gate.unresolved)}`)
  if (!lean) console.error(`  clay does not answer lean: clay.disclosure holds=${disc.holds} leaned=${disc.leaned}/${disc.value} kernel=${JSON.stringify(disc.kernel)}, registry families=${families}`)
  process.exit(1)
}

console.log(
  `ship gate: OK — complete (deployment gate ${gate.operationCount} operations, 0 unresolved, proved true) and clay ` +
    `answers lean (clay.disclosure holds: σ-involution leans all ${disc.leaned}/${families} families, kernel ${disc.kernel?.held}/${disc.kernel?.theorems} theorems, ${disc.kernel?.axioms} axioms). Clear to deploy.`,
)
