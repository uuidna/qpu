import { REGISTER, pack, price, catalog, cross } from './index.ts'
import { market } from '../toolboxes/billing.ts'
if (REGISTER !== 122) throw new Error('register')
const m = market(), p = price(122, m)
if (p.standard !== 'ISO 4217' || !p.forged.refused || !(p.eur > 0)) throw new Error(JSON.stringify(p))
const coins = pack([{ key: 'a', module: 'M', uuid: '00000000-0000-4000-8000-000000000001', qubits: 60 }, { key: 'b', module: 'M', uuid: '00000000-0000-4000-8000-000000000002', qubits: 70 }])
if (coins.length !== 2) throw new Error('pack')
const c = catalog(coins.flatMap((x) => x.cases.map((k) => ({ ...k, qubits: Math.floor(x.used / x.cases.length) || 1 }))))
if (!c.holds || c.register !== 122 || !c.products.length) throw new Error('catalog')
if (cross(coins[0]!.uuid).length !== 8) throw new Error('cross')
console.log('catalog ok', c.products.length)
