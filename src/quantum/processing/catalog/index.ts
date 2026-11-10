/** Lean coin SoT: REGISTER=uuidQubits(4)=122 (textbook_coin_lean_sot). Capacity 29/232 and forged QPU refused. */
import { channel, neighbours, reflection, uuid, uuidQubits } from '../../uuid/index.ts'
import { market } from '../toolboxes/billing.ts'

export const REGISTER = (() => { const n = uuidQubits(4).effective; if (n !== 122) throw new Error(`register ${n}≠122`); return n })()

export const pack = (cases: readonly { key: string; module: string; uuid: string; qubits?: number }[]) => {
  const coins: { module: string; index: number; cases: (typeof cases)[number][]; used: number; uuid: string }[] = []
  for (const module of [...new Set(cases.map((c) => c.module))].sort()) {
    let cur: (typeof coins)[number] | null = null
    for (const row of cases.filter((c) => c.module === module)) {
      const q = Math.max(0, Math.trunc(row.qubits ?? 0))
      if (!cur || cur.used + q > REGISTER) { cur = { module, index: coins.filter((x) => x.module === module).length, cases: [], used: 0, uuid: '' }; coins.push(cur) }
      cur.cases.push(row); cur.used += Math.min(q, REGISTER)
    }
  }
  for (const c of coins) c.uuid = uuid(`${c.module}\n${c.index}\n${c.cases.map((l) => l.uuid).join(',')}`)
  return coins
}

export const cross = (coin: string) => {
  const fwd = reflection(coin)
  return [{ direction: 'σ-encrypt' as const, uuid: fwd.mirror }, { direction: 'σ-decrypt' as const, uuid: reflection(fwd.mirror).mirror }, ...neighbours(coin).neighbours.map((s) => ({ direction: `${s.axis}${s.step > 0 ? '+' : '-'}` as const, uuid: s.uuid }))]
}

export const price = (qubits: number, m = market()) => {
  const usd = qubits * m.usd!, eur = qubits * m.eur!
  return { usd, eur, bgn: eur * 1.95583, currencies: ['USD', 'EUR', 'BGN'] as const, standard: 'ISO 4217' as const, forged: m.forged }
}

export const catalog = (cases: readonly { key: string; module: string; uuid: string; qubits?: number }[]) => {
  const coins = pack(cases), m = market()
  if (!(REGISTER === 122 && m.forged.refused && m.standard === 'ISO 4217')) throw new Error('catalog refused: Lean coin SoT failed')
  return {
    register: REGISTER, market: m, holds: true as const,
    products: coins.map((c) => ({ coin: c.uuid, module: c.module, used: c.used, keys: c.cases.map((x) => x.key), handle: channel(c.uuid).handle, amounts: price(c.used, m) })),
    variants: coins.flatMap((c) => cross(c.uuid).map((a) => ({ coin: c.uuid, address: a.uuid, direction: a.direction, amounts: price(Math.ceil(c.used / 8) || 0, m) }))),
  }
}
