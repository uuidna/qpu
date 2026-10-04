import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { SoftwareFormulas } from './index.js'

/** The engineering arithmetic — kloc, coverage, cyclomatic, defects, flags, hours, velocity, semver — each exact. */
test('software: kloc, coverage, cyclomatic, defects, flags, hours, velocity, semver', async (t) => {
  assert.equal(SoftwareFormulas.kloc(12345).value, 12, '12345 loc')
  assert.equal(SoftwareFormulas.coverage(87, 100).value, 87, '87/100 covered')
  assert.equal(SoftwareFormulas.coverage(1, 0).value, 0, 'no total, no divide')
  assert.equal(SoftwareFormulas.cyclomatic(10, 8).value, 4, 'edges − nodes + 2')
  assert.equal(SoftwareFormulas.cyclomatic(1, 8).value, 0, 'floored at 0')
  assert.equal(SoftwareFormulas.defects(12, 5).value, 60, '12 kloc at 5/kloc')
  assert.equal(SoftwareFormulas.flags(10).value, 1024, '2^10 flag combos')
  assert.equal(SoftwareFormulas.hours(5).value, 20, '5 points, 4h each')
  assert.equal(SoftwareFormulas.velocity(40, 10).value, 4, '40 items over 10 days')
  assert.equal(SoftwareFormulas.semver(1, 2, 3).value, 1002003, 'packed semver')
  assert.equal(qpuHexFamiliesOf().get('software')?.length, 8)
  for (const [name, params, expected] of [['kloc', [12345], 12], ['flags', [10], 1024], ['semver', [1, 2, 3], 1002003]] as [string, number[], number][]) {
    const uuid = qpuHexUuidOf({ family: 'software', program: [name], params })
    const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
    assert.equal(Number(run.value), expected, `software.${name} at ${uuid}`)
    qpuUuidReceiptOf(`software ${name}`, qpuContentUuidOf(run), { uuid })
  }
  t.diagnostic('8 formulas; 12345→12 kloc, cyclomatic 4, 2^10 flags, semver 1.2.3→1002003')
})
