import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { qpuFuseImportHolds, qpuOccupancyExportHolds } from './fuse-gate.js'

const SRC = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'src')
const OCCUPANCY = ['chat.ts', 'events.ts', 'messenger.ts', 'fuse-gate.ts'] as const

test('occupancy imports the fused door by name; provider folders refuse', () => {
  for (const name of OCCUPANCY) {
    const src = readFileSync(join(SRC, name), 'utf8')
    assert.equal(qpuFuseImportHolds(src), true, name)
    for (const m of src.matchAll(/^export const ([A-Za-z0-9_]+) = /gm)) {
      assert.equal(qpuOccupancyExportHolds(m[1]!), true, `${name} ${m[1]}`)
    }
  }
})
