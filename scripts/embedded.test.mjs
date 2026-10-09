/**
 * THE COOL IS FRESH, NOT STALE. embedded.ts holds the heavy onceOf constants (computer/quantum/circuit/lean) precomputed
 * at build so a cold isolate reads instead of JIT-compiling them. This proves the embed equals a live recomputation — so
 * a changed heavy function cannot ship a stale cool. It mirrors embed-lean's generation exactly; the gate also recomputes
 * these live at push. Needs dist — run `npm run build` first. Discovered by the scripts/*.test.mjs glob, run by the gate.
 */
import test from 'node:test'
import assert from 'node:assert/strict'

const idx = await import('../dist/quantum/processing/unit/index.js')

// ONE PREDICATE, TWO CALLERS. qpuEmbedDriftOf (in the unit) recomputes all four heavy constants LIVE via the *LiveOf —
// bypassing the embed the runtime reads — and names the keys that drifted. The deployment gate calls the same predicate,
// so the cool is proved fresh at every push, not merely here in CI. A non-empty result means embedded.ts is stale.
test('the embedded heavy constants are fresh — no drift from the live computation (rerun npm run lean:embed on failure)', () => {
  assert.deepEqual(idx.qpuEmbedDriftOf(), [], 'embedded.ts is stale for these keys — run `npm run lean:embed`')
})
