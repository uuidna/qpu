/**
 * GRAVITY — MEANINGFUL PATHS, MEANINGFUL ROUTING. Gravity pulls each file to its meaningful path and each family to a
 * meaningful address. Two invariants, read from the files and the registry, run by the one workflow (scripts/*.test.mjs):
 *   1. every module that registers a hex FAMILY (not a door) sits at src/families/<name>/index.ts — its meaningful path;
 *   2. every family routes at a unique hex handle — the address names exactly one family, so routing is unambiguous.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'

const ROOT = join(dirname(new URL(import.meta.url).pathname), '..')
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]))

test('gravity: meaningful paths — every family file sits at src/families/<name>/index.ts', async () => {
  const { DOORS } = await import('../dist/mcp/discovery.js')
  const files = walk(join(ROOT, 'src')).filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts'))
  for (const f of files) {
    const m = readFileSync(f, 'utf8').match(/qpuHexRegisterOf\('([a-zA-Z.]+)'/)
    if (!m) continue
    const fam = m[1]
    if (DOORS.has(fam)) continue // a door's meaningful path is src/mcp/, beside the registry it serves
    assert.ok(f.endsWith(join('src', 'families', fam, 'index.ts')), `${f} registers family '${fam}' but is off its meaningful path src/families/${fam}/index.ts — gravity would move it there`)
  }
})

test('gravity: meaningful routing — every family routes at a unique hex handle', async () => {
  await import('../dist/mcp/families.js')
  const { qpuHexFamiliesOf, qpuHexUuidOf } = await import('../dist/quantum/processing/unit/index.js')
  const handles = new Map()
  for (const [fam, formulas] of qpuHexFamiliesOf()) {
    if (!formulas.length) continue
    const handle = qpuHexUuidOf({ family: fam, program: [formulas[0].name], params: [] }).split('-')[0]
    const other = handles.get(handle)
    assert.ok(other === undefined || other === fam, `routing collision: '${fam}' and '${other}' both route at handle ${handle}`)
    handles.set(handle, fam)
  }
  assert.ok(handles.size > 0, 'families route at handles')
})
