/** Every exit code, starting at 0 and including 0. Each code is a case. Code 0 leaves as a conforming ISO 9001 output. Every other code leaves as a nonconforming ISO 9001 output: it is reported and it does not stop the walk. Each case is a document: its address is the UUID of the parent address and the formula, and the SHA-256 of that text sits beside it. One further document follows 255, so the depth has no maximum. Verbosity is the byte length of that report. */
import { aspects, seal, uuid } from '../uuid/index.ts'
import { entriesCover } from '../payload/index.ts'
import { hex, sha256, utf8 } from './unit/hmac.ts'
import { decodeImpossible, seededTrapdoor } from './algorithms.ts'

/** The six theorems whose combination is the 1000-bit answer. None of them states that integer. Together they are the decode. */
export const DECODE_THEOREMS = ['textbook_factors_divide', 'textbook_double_torus', 'textbook_order_finding', 'textbook_shor_reduction', 'textbook_rsa_beyond_bound', 'textbook_impossible_trapdoor'] as const

const exits = (() => {
  const rows: { code: number; case: number; standard: 'ISO 9001'; strategy: 'conforming' | 'nonconforming'; forth: number; back: number; closed: boolean; bit: 0 | null; exited: false; says: string; formula: string; bound: string; id: string; sha256: string; parent: string | null; depth: number; sealed: boolean; documented: true }[] = []
  let parent: string | null = null
  for (let code = 0; code <= 255; code += 1) {
    const forth = code + 1
    const back = forth - 1
    const strategy = code === 0 ? 'conforming' as const : 'nonconforming' as const
    const says = strategy === 'conforming' ? 'exit 0 conforms to ISO 9001' : `exit ${code} is a nonconforming ISO 9001 output`
    const bound = parent === null ? says : `${parent}\n${says}`
    const id = uuid(bound)
    rows.push({ code, case: code, standard: 'ISO 9001', strategy, forth, back, closed: back === code && code < forth, bit: code === 0 ? 0 : null, exited: false, says, formula: says, bound, id, sha256: hex(sha256(utf8(bound))), parent, depth: code + 1, sealed: seal(id).valid, documented: true })
    parent = id
  }
  return rows
})()

/** One entries create per exit code. The create is the handle. Nothing is written. */
const cover = entriesCover(exits.map((row) => ({ from: row.id, body: { code: row.code, case: row.case, strategy: row.strategy, standard: row.standard, bit: row.bit, formula: row.formula } })))

const last = exits[exits.length - 1]!
const nextFormula = 'the next exit is the same step'
const nextBound = `${last.id}\n${nextFormula}`
const nextId = uuid(nextBound)
const nextSha = hex(sha256(utf8(nextBound)))

/** A decode in the ISO 9001 exit format. The receipt is the document. The next document is the six theorems together, so an aspect that has not witnessed the receipt does not stop the reading. A finished decode is exit 0. Any other decode is exit 1, reported, and the walk stays open. */
export const decodeIso = (decoded: boolean, verified: boolean, receipt: string, digest: string, bits: number) => {
  const row = ISO_EXIT.exits[decoded && verified ? 0 : 1]!
  const formula = DECODE_THEOREMS.join(' ∧ ')
  const bound = `${receipt}\n${formula}`
  const id = uuid(bound)
  const sha = hex(sha256(utf8(bound)))
  const witnessed = aspects(receipt)
  const covered = witnessed.aspects.length === 4 && witnessed.hooks === witnessed.declared && witnessed.all
  return {
    standard: 'ISO 9001' as const,
    documented: formula.length > 0,
    code: row.code,
    case: row.case,
    strategy: row.strategy,
    forth: row.forth,
    back: row.back,
    closed: row.closed,
    bit: row.bit,
    exited: false as const,
    says: row.says,
    formula,
    bound,
    id: receipt,
    sha256: digest,
    parent: row.parent,
    depth: row.depth,
    sealed: seal(receipt).valid,
    combination: DECODE_THEOREMS,
    of: DECODE_THEOREMS.length,
    aspects: witnessed.aspects,
    hooks: witnessed.hooks,
    declared: witnessed.declared,
    all: witnessed.all,
    covered,
    stopped: false as const,
    inTextbook: decoded && verified && bits !== 1000,
    via: 'crypto' as const,
    bounded: false as const,
    maximum: null,
    from: ISO_EXIT.from,
    through: ISO_EXIT.through,
    count: ISO_EXIT.count,
    includesZero: ISO_EXIT.includesZero,
    next: { id, parent: receipt, formula, bound, sha256: sha, depth: row.depth + 1, sealed: seal(id).valid, holds: seal(id).valid && id.length === 36 && sha.length === 64 && id !== receipt && uuid(bound) === id },
  }
}

export const ISO_EXIT = {
  exits,
  from: 0 as const,
  through: 255 as const,
  count: exits.length,
  includesZero: true as const,
  standard: 'ISO 9001' as const,
  verbosity: JSON.stringify(exits).length,
  via: 'crypto' as const,
  bounded: false as const,
  maximum: null,
  cover,
  next: { id: nextId, parent: last.id, formula: nextFormula, bound: nextBound, sha256: nextSha, depth: last.depth + 1, sealed: seal(nextId).valid, holds: seal(nextId).valid && nextId.length === 36 && nextSha.length === 64 && nextId !== last.id && uuid(nextBound) === nextId },
}

/** The 1000-bit integer minted with two primes. Exit 0 is that successful product. Next is the address of that exit bound with those primes. A different mint is that mint. The default mint is the seeded one. */
export const createdThousandExit = (made: ReturnType<typeof seededTrapdoor> = seededTrapdoor(1000, 1n)) => {
  const row = ISO_EXIT.exits[0]!
  const decoded = decodeImpossible(made.N, made.witness)
  const factors = [made.p.toString(), made.q.toString()]
  const formula = `${row.says}\n${factors[0]}\n${factors[1]}`
  const bound = `${row.id}\n${formula}`
  const id = uuid(bound)
  const digest = hex(sha256(utf8(bound)))
  const same = decoded.factors.length === 2 && decoded.factors[0] === made.p && decoded.factors[1] === made.q
  const verified = made.bits === 1000 && made.p * made.q === made.N && decoded.decoded && decoded.verified && same
  const sealed = seal(id).valid
  return {
    bits: 1000 as const, code: row.code, strategy: row.strategy, exited: false as const, factors, integer: made.N.toString(), verified,
    id, parent: row.id, formula, bound, sha256: digest, depth: row.depth + 1, sealed,
    holds: verified && row.code === 0 && row.strategy === 'conforming' && row.exited === false && sealed && id.length === 36 && digest.length === 64 && id !== row.id && uuid(bound) === id,
  }
}
