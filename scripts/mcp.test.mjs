/**
 * THE MCP CONTRACT IS GATED, NOT HOPED. qpuMcpHolds folds ~100 clauses — every tool, its man page and MCP-spec hints, the
 * schemas, the connect byte budget (under a KiB per door), the crypto doors, and the recognition/reading round trips. It
 * had no test and was not in proof.holds, so a clause could silently go false (the connect bill did, when schema growth
 * crossed the budget). This asserts qpuMcpFailuresOf is empty and NAMES the broken clause — the same predicate the
 * deployment gate now blocks a push on. Put manual work in automation only: the check that was run by hand lives here and
 * at the gate. Needs dist — run `npm run build` first. Discovered by the scripts/*.test.mjs glob, run in CI.
 */
import test from 'node:test'
import assert from 'node:assert/strict'

const idx = await import('../dist/quantum/processing/unit/index.js')
if (idx.qpuHexRegistryOf) await idx.qpuHexRegistryOf()

test('the MCP contract holds — every clause true, or it names the one that is not', () => {
  assert.deepEqual(idx.qpuMcpFailuresOf(), [], 'MCP clauses failing (see qpuMcpChecksOf for each)')
})
