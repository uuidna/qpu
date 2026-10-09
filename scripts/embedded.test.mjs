/**
 * THE COOL IS FRESH, NOT STALE. embedded.ts holds the heavy onceOf constants (computer/quantum/circuit/lean) precomputed
 * at build so a cold isolate reads instead of JIT-compiling them. This proves the embed equals a live recomputation — so
 * a changed heavy function cannot ship a stale cool. It mirrors embed-lean's generation exactly; the gate also recomputes
 * these live at push. Needs dist — run `npm run build` first. Discovered by the scripts/*.test.mjs glob, run by the gate.
 */
import test from 'node:test'
import assert from 'node:assert/strict'

const idx = await import('../dist/quantum/processing/unit/index.js')
const prf = await import('../dist/quantum/processing/unit/proof.js')
const emb = await import('../dist/quantum/processing/unit/embedded.js')
const bigintSafe = (v) => JSON.parse(JSON.stringify(v, (_k, x) => (typeof x === 'bigint' ? x.toString() : x)))

test('the embedded heavy constants are fresh — no drift from the live computation (rerun npm run lean:embed on failure)', () => {
  const fresh = {
    computer: bigintSafe(idx.qpuComputerOf()),
    quantum: bigintSafe(idx.qpuQuantumOf()),
    circuit: bigintSafe(idx.qpuCircuitOf()),
    lean: bigintSafe(prf.qpuLeanOf()),
  }
  for (const k of ['computer', 'quantum', 'circuit', 'lean']) assert.deepEqual(emb.embeddedConstants[k], fresh[k], `embedded.ts "${k}" is stale — run \`npm run lean:embed\``)
})
