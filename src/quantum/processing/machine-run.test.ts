import { test } from 'node:test'
import assert from 'node:assert/strict'
import { availableParallelism } from 'node:os'
import { lanesNow } from './machine-run.ts'
import { THEOREMS } from './theorems-index.ts'

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the runner's lanes, read from node:os now, lie between one and the cores, as Supremacy.lanes_pos and Supremacy.lanes_le_cores prove. */
test("the runner's lanes, read from node:os now, lie between one and the cores, as Supremacy.lanes_pos and Supremacy.lanes_le_cores prove", () => {
  const lanes = lanesNow(), cores = availableParallelism()
  assert.ok(Number.isInteger(lanes))
  assert.ok(lanes >= 1, `lanes ${lanes} below one`)
  assert.ok(lanes <= cores, `lanes ${lanes} above the ${cores} cores`)
  for (const key of ['Supremacy.lanes_pos', 'Supremacy.lanes_le_cores']) assert.ok(THEOREMS.some((t) => t.key === key), `${key} is in the kernel index`)
})
