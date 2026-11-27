import test from 'node:test'
import assert from 'node:assert/strict'
import { REGISTER, pack, price, catalog, cross } from './index.ts'
import { market } from '../../../../../../../../4/5/8/2/8/f/3/f/index.ts'
if (REGISTER !== 122) throw new Error('register')
const m = market(), p = price(122, m)
if (p.standard !== 'ISO 4217' || !p.forged.refused || !(p.eur > 0)) throw new Error(JSON.stringify(p))
const coins = pack([{ key: 'a', module: 'M', uuid: '00000000-0000-4000-8000-000000000001', qubits: 60 }, { key: 'b', module: 'M', uuid: '00000000-0000-4000-8000-000000000002', qubits: 70 }])
if (coins.length !== 2) throw new Error('pack')
const c = catalog(coins.flatMap((x) => x.cases.map((k) => ({ ...k, qubits: Math.floor(x.used / x.cases.length) || 1 }))))
if (!c.holds || c.register !== 122 || !c.products.length) throw new Error('catalog')
if (cross(coins[0]!.uuid).length !== 8) throw new Error('cross')
console.log('catalog ok', c.products.length)

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a build's outputs are sealed as Clay cases, each file by its UUID and SHA-256 and packed as coins of the register, and the rays cast over them refuse a file written twice. */
test('a build\'s outputs are sealed as Clay cases, each file by its UUID and SHA-256 and packed as coins of the register, and the rays cast over them refuse a file written twice', async () => {
  const { fusionReceipt, REGISTER } = await import('./index.ts')
  const files = [{ path: 'robots.txt', text: 'User-agent: *\nAllow: /\n' }, { path: 'llms.txt', text: '# QPU\n' }, { path: '.well-known/ai-catalog.json', text: '{}' }]
  const r = fusionReceipt(files)
  assert.ok(r.holds && r.rays.fits && r.rays.collisions === 0)
  assert.deepEqual(r.coins.flatMap((c) => c.cases).sort(), files.map((f) => f.path).sort())
  assert.ok(r.coins.every((c) => c.used <= REGISTER))
  assert.ok(r.files.every((f) => f.uuid.startsWith(f.handle) && /^[0-9a-f]{64}$/.test(f.sha256)))
  const twice = fusionReceipt([...files, files[0]!])
  assert.equal(twice.holds, false)
  assert.ok(twice.rays.collisions > 0)
})
