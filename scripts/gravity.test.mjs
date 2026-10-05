/**
 * GRAVITY, AS A GATE. The two invariants that pull every family to zero point and the registry to zero temp, read from
 * the files and the registry and run by the one workflow (scripts/*.test.mjs) — learned from uuidna/verify. The moving
 * itself is scripts/gravity.mjs --fix; this holds that nothing is off-point and no two families collide at one handle.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { sep } from 'node:path'
import { offPathOf, entriesOf, trinityOf, consensusOf } from './gravity.mjs'

const DOORS = new Set(['qpu', 'crypto', 'api', 'data', 'gate'])
const at = (family) => ['src', 'families', family, 'index.ts'].join(sep)

test('gravity: meaningful paths — every family sits at src/families/<name>/index.ts (zero point)', () => {
  const off = offPathOf(entriesOf(), DOORS)
  assert.deepEqual(
    off.map((m) => `${m.from} registers '${m.family}'`),
    [],
    `off their meaningful path — run scripts/gravity.mjs --fix to let gravity move them`,
  )
})

test('gravity: meaningful routing — every family routes at a unique hex handle (no collision)', async () => {
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

test('gravity: the trinity coordinates a move — gravity, rule and gate must all agree', () => {
  const families = new Map([['foo', [{ name: 'a' }]], ['bar', [{ name: 'b' }]]])
  const handleOf = (f) => ({ foo: 'aaaaaaaa', bar: 'bbbbbbbb', a11y: 'aaaaaaaa' }[f] ?? f)
  const clean = trinityOf({ from: 'x/index.ts', to: at('foo'), family: 'foo' }, { handleOf, families })
  assert.equal(clean.approved, true, 'a clean move: meaningful path, one-word name, unique handle')
  // a digit name dissents at rule AND collides at gate — two of the trinity refuse, so the move is held
  const bad = trinityOf({ from: 'x/index.ts', to: at('a11y'), family: 'a11y' }, { handleOf, families })
  assert.equal(bad.approved, false)
  assert.equal(bad.approvals.find((a) => a.by === 'rule').holds, false, 'rule refuses a non-one-word name')
})

test('gravity: the equilibrium agrees — every family around the center observes and holds', async () => {
  await import('../dist/mcp/families.js')
  const { qpuHexFamiliesOf, qpuHexUuidOf, qpuHexRegisteredSizeOf } = await import('../dist/quantum/processing/unit/index.js')
  const families = qpuHexFamiliesOf()
  const handleOf = (fam) => {
    const fs = families.get(fam)
    return fs?.length ? qpuHexUuidOf({ family: fam, program: [fs[0].name], params: [] }).split('-')[0] : null
  }
  const c = consensusOf(families, { handleOf, registered: (f) => qpuHexRegisteredSizeOf(f) > 0 })
  assert.ok(c.agreed, 'the equilibrium disagrees: ' + c.observers.filter((o) => !o.holds).map((o) => `${o.by}: ${o.why}`).join('; '))
  assert.ok(c.count > 0, 'the equilibrium has families')
})
