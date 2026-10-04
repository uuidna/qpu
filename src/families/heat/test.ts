import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { verifyHex } from '../verify.js'
import { HeatFormulas } from './index.js'
import '../../mcp/families.js'
import { qpuFacesOf, qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { flowFamiliesOf } from '../merkaba/index.js'

/** CODE QUALITY AS PHYSICS. A file's temperature is its commits over its days; its coherence the days it holds per fix;
 *  its signal the photon-to-thermal ratio; its quality the signal held over the coherence time. A hot file is split to
 *  cool it — ⌈T/k⌉ each — and the astronomical case splits into residue jobs joined by the CRT. Erasing nothing is
 *  free: a reversible computation costs no Landauer energy. Every value is exact and crosses heat → physics (or crypto).*/
test('heat: temperature, coherence, cooling and the Landauer floor — exact, crossing to physics', async (t) => {
  assert.equal(HeatFormulas.temperature(10, 100).value, 100, 'T = ⌊1000 · commits / days⌋')
  assert.equal(HeatFormulas.temperature(5, 10).value, 500)
  assert.equal(HeatFormulas.coherence(100, 0).value, 100, 'no fix: the whole window holds')
  assert.equal(HeatFormulas.coherence(100, 3).value, 25, 'T₂ = ⌊days / (fixes + 1)⌋')
  assert.equal(HeatFormulas.cooling(100, 4).value, 25, '⌈T / k⌉')
  assert.equal(HeatFormulas.cooling(100, 3).value, 34)
  assert.equal(HeatFormulas.cooling(100, 0).holds, false, 'a split is into at least one part')
  assert.equal(HeatFormulas.ways(100, 25).value, 4, 'the least k with ⌈T/k⌉ ≤ target')
  assert.equal(HeatFormulas.ways(10, 100).value, 1, 'already cold enough: one part')
  assert.equal(HeatFormulas.ways(100, 0).holds, false)
  assert.equal(HeatFormulas.residue(10, 7).value, 2, '2^10 = 1024 ≡ 2 mod 7')
  assert.equal(HeatFormulas.residue(4, 13).value, 3, '2^4 = 16 ≡ 3 mod 13')
  assert.equal(HeatFormulas.split(10, 5).value, 5, 'five residue jobs, one per prime 2, 3, 5, 7, 11')
  assert.equal(HeatFormulas.landauer(0, 310).value, 0, 'erasing nothing costs nothing — a reversible computation is free')
  assert.ok(HeatFormulas.erasure(0, 0, 4).value >= 0, 'the bits a batch must erase are non-negative, 0 exactly when reversible')
  const s0 = HeatFormulas.signal(0).value
  assert.ok(s0 > 0 && HeatFormulas.signal(1000).value <= s0, 'the signal is highest at absolute cold and never rises with heat')
  assert.equal(HeatFormulas.quality(10, 100, 3).value, HeatFormulas.signal(HeatFormulas.temperature(10, 100).value).value * HeatFormulas.coherence(100, 3).value, 'Q = S(T) · T₂')
  assert.equal(HeatFormulas.temperature(10, 100).dst, 'physics')
  await verifyHex('heat', 11, [['temperature', [10, 100], 100], ['coherence', [100, 3], 25], ['cooling', [100, 4], 25], ['ways', [100, 25], 4]])
  t.diagnostic('11 formulas; T 100, T₂ 25, cooling 25, ways 4, residue 2, split 5 jobs, landauer(0) = 0 reversible; crossing to physics')
})

test('heat.slow names a formula that answers slowly, UNVERIFIED', async () => {
  const faces = qpuFacesOf().faces
  qpuHexRegisterOf('zzslow', 'spin', () => { const t = performance.now(); while (performance.now() - t < 3 * faces); return 1 })
  const r = (await HeatFormulas.slow(flowFamiliesOf().indexOf('zzslow'), 0)) as unknown as { value: number; holds: boolean; hot: boolean; verdict: string }
  assert.ok(r.value >= 3 * faces, 'the control runs slow')
  assert.equal(r.hot, true)
  assert.equal(r.verdict, 'UNVERIFIED', 'a hot formula is unverified, a lead')
  assert.equal(r.holds, false)
})
