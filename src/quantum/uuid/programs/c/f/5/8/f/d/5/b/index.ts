/** Lean coin SoT: REGISTER=uuidQubits(4)=122 (textbook_coin_lean_sot). Capacity 29/232 and forged QPU refused. */
import { PROSE } from '../../../../../../../../5/9/e/4/9/1/a/4/index.ts'
import { channel, neighbours, reflection, uuid, uuidQubits, LEAN_REGISTER } from '../../../../../../../../2/7/1/a/7/6/4/9/index.ts'
import { market } from '../../../../../../../../4/5/8/2/8/f/3/f/index.ts'
import { castRays } from '../../../../../../../../7/2/1/a/a/e/7/d/index.ts'
import { utilisationOf } from '../../../../../../../../0/8/7/0/6/d/2/8/index.ts'
import { hex, sha256 } from '../../../../../../../../9/e/8/6/7/0/6/8/index.ts'

export const REGISTER = (() => { const n = uuidQubits(4).effective; if (n !== LEAN_REGISTER) throw new Error(`register ${n}≠${LEAN_REGISTER}`); return n })()

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

/** A build's outputs as Clay cases: every file sealed by the UUID of its path and SHA-256, the rays cast over their UUIDs so no two collide (castRays),
 *  and the files packed as coins of the register (pack), a module for each folder, each case taking the qubits its content fills (utilisationOf). */
export const fusionReceipt = (files: readonly { path: string; text: string | Uint8Array }[]) => {
  const sealed = files.map((f) => { const bytes = typeof f.text === 'string' ? new TextEncoder().encode(f.text) : f.text, digest = hex(sha256(bytes)), id = uuid(`${f.path}\n${digest}`); return { path: f.path, uuid: id, handle: channel(id).handle, sha256: digest, bytes: bytes.length, qubits: utilisationOf(bytes).used } })
  const rays = castRays(sealed.map((f) => f.uuid))
  const coins = pack(sealed.map((f) => ({ key: f.path, module: f.path.includes('/') ? f.path.split('/')[0]! : 'root', uuid: f.uuid, qubits: f.qubits })))
  return { phase: 'fusion' as const, files: sealed, rays: { fits: rays.fits, collisions: rays.collisions, seams: rays.seams.length }, coins: coins.map((c) => ({ module: c.module, index: c.index, uuid: c.uuid, used: c.used, cases: c.cases.map((x) => x.key) })), root: uuid(sealed.map((f) => f.uuid).join(',')), holds: rays.fits && sealed.length > 0, theorems: ['textbook_coin_lean_sot', 'textbook_capacity_conserved'] as const }
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
  if (!(REGISTER === LEAN_REGISTER && m.forged.refused && m.standard === 'ISO 4217')) throw new Error(PROSE.quantumProcessingCatalogIndex_s1)
  return {
    register: REGISTER, market: m, holds: true as const,
    products: coins.map((c) => ({ coin: c.uuid, module: c.module, used: c.used, keys: c.cases.map((x) => x.key), handle: channel(c.uuid).handle, amounts: price(c.used, m) })),
    variants: coins.flatMap((c) => cross(c.uuid).map((a) => ({ coin: c.uuid, address: a.uuid, direction: a.direction, amounts: price(Math.ceil(c.used / 8) || 0, m) }))),
  }
}
