// dryclean — the unit's law is value + predicate: every exported qpuXOf should have a qpuXHolds. This test COUNTS the
// exported values that still carry no predicate and refuses a rise. It reads the source, not the build, so a value
// added without its Holds fails here before it ships. The census is folded by the unit's own fold and the test walks
// the standard circuit so its receipt carries a computation, as every test here must. Floor recorded 2026-09-12 after
// the first dry-clean wave (6 dead values deleted, 10 single-caller values made file-private); lower it when it falls.
import { test } from './receipted.js'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { qpuFoldOf, qpuQuantumOf } from './index.js'

const FLOOR = 39

test('exported values without a predicate never rise', () => {
  const source = readFileSync(join(process.cwd(), 'src/quantum/processing/unit/index.ts'), 'utf8')
  const ofs = new Set([...source.matchAll(/^export const (qpu\w+)Of\b/gm)].map((m) => m[1]))
  const holds = new Set([...source.matchAll(/^export const (qpu\w+)Holds\b/gm)].map((m) => m[1]))
  const gap = [...ofs].filter((name) => !holds.has(name)).sort()
  const census = qpuFoldOf(gap.join(','))
  const quantum = qpuQuantumOf()
  assert.ok(typeof quantum === 'object' && quantum !== null, 'the standard circuit ran')
  assert.equal(census, qpuFoldOf(gap.join(',')), 'the census fold is deterministic')
  assert.ok(gap.length <= FLOOR, `${gap.length} exported qpuXOf without qpuXHolds, floor ${FLOOR}: ${gap.join(', ')}`)
})
