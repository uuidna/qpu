#!/usr/bin/env node
/**
 * SHIP KNOWS, IT DOES NOT ASSUME. Ship does not deploy unless the code is proven COMPLETE and STABLE — machine-verified
 * here, aborting (exit 1) on any gap. The `ship` script runs this after the Lean ground truth (`lake build`), the embed,
 * and the tests, and before the Cloudflare deploy, so nothing reaches the live host that cannot answer for itself.
 *
 *   COMPLETE — the deployment gate holds: every operation resolves, `prove` holds, the embedded constants match the live
 *              recompute (no drift), and the kernel is 0 axioms with every theorem recomputed from the Lean source.
 *   LEAN     — every theorem the embedded kernel recomputes from the Lean source holds, and the registry holds families.
 *
 * No number is chosen by a person: the unit reports them and this gate compares them. Run after `npm run build` +
 * `npm run lean:embed` + `npm run build` so dist is fresh.
 */
await import('../dist/mcp/families.js') // load every family into the registry first
const core = await import('../dist/mcp/uuid-programmable-core.js')
const idx = await import('../dist/quantum/processing/unit/index.js')
const { leanRecomputed } = await import('../dist/quantum/processing/unit/lean.js')

const gate = await core.consolidatedMCP.runDeploymentGate()
const families = idx.hexFamiliesOf().size

// COMPLETE — the deployment gate (every operation resolves, embed matches, prove holds). LEAN — the embedded kernel's own
// recomputation: every theorem holds.
const complete = gate.ok === true && gate.proved === true && (gate.unresolved?.length ?? 1) === 0
const recomputed = Object.values(leanRecomputed)
const lean = recomputed.length > 0 && recomputed.every((r) => r.holds === true) && families > 0

if (!complete || !lean) {
  console.error('ship gate: REFUSED — not proven complete, and/or the kernel does not hold; not shipping')
  if (!complete) console.error(`  not complete: deployment gate ok=${gate.ok} proved=${gate.proved} unresolved=${JSON.stringify(gate.unresolved)}`)
  if (!lean) console.error(`  kernel does not hold: ${recomputed.filter((r) => r.holds !== true).length} of ${recomputed.length} theorems not held, registry families=${families}`)
  process.exit(1)
}

console.log(
  `ship gate: OK — complete (deployment gate ${gate.operationCount} operations, 0 unresolved, proved true) and the kernel ` +
    `holds lean (${recomputed.length}/${recomputed.length} theorems recomputed and held, families ${families}). Clear to deploy.`,
)
