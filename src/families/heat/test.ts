import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf } from '../../quantum/processing/unit/index.js'
import '../../mcp/families.js'
import { flowFamiliesOf } from '../merkaba/index.js'
import { HeatFormulas } from './index.js'

const at = (family: string, name: string): [number, number] => [flowFamiliesOf().indexOf(family), (qpuHexFamiliesOf().get(family) ?? []).findIndex((f) => f.name === name)]

test('heat: erasure is zero exactly when reversible, Landauer prices it, an astronomical value splits into residue jobs', () => {
  assert.equal(HeatFormulas.erasure(...at('Qpu.Mint', 'mintOf'), 32).value, 0, '2ⁱ is injective: nothing erased')
  assert.equal(HeatFormulas.erasure(...at('clay', 'riemann'), 32).value, 31 * Math.log2(31), '31 inputs merged into one output')
  assert.equal(HeatFormulas.landauer(1, 1000).value, Math.floor(1380649 * 1000 * Math.LN2), 'one bit at 1 K: k_B · T · ln 2')
  const s = HeatFormulas.split(662607015, 64) as unknown as { value: number; exact: boolean; jobs: { p: number; residue: number }[] }
  assert.equal(s.value, 64)
  assert.equal(s.exact, false, '64 primes refute a claim about 2^planck but cannot rebuild it')
  // 2^odd ≡ 2 (mod 3); planck ≡ 3 (mod 4) so 2^planck ≡ 2³ ≡ 3 (mod 5): residues from another route
  assert.deepEqual(s.jobs.slice(0, 3).map((j) => j.residue), [0, 2, 3])
  assert.equal(HeatFormulas.residue(10, 1021).value, 1024 % 1021)
})
