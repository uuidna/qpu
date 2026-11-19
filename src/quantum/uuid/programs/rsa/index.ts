// Each RSA case is one UUID program. The case builds its integer from the primes it was created with,
// factors that integer, and the factors are those primes. The thousand-bit mint is the example. The
// next step rotates the program one place. The handle and the tail stay. Nothing is written.
import { birth } from '../../../fs/index.ts'
import { next, uuid } from '../../index.ts'
import { createImpossible, decodeImpossible, orderFinding, seededTrapdoor, shorReduction } from '../../../processing/algorithms.ts'
import { createdThousandExit } from '../../../processing/iso-exit.ts'
import { program } from '../index.ts'

type Factored = { id: string; theorem: string; via: 'witness' | 'order' | 'reduction'; N: bigint; p: bigint; q: bigint; bits: number; factors: readonly bigint[]; verified: boolean; exit?: ReturnType<typeof createdThousandExit> }

const pair = (p: bigint, q: bigint) => p < q ? [p, q] as const : [q, p] as const

const byWitness = (id: string, theorem: string, made: ReturnType<typeof createImpossible>, exit?: ReturnType<typeof createdThousandExit>): Factored => {
  const decoded = decodeImpossible(made.N, made.witness)
  return { id, theorem, via: 'witness', N: made.N, p: made.p, q: made.q, bits: made.bits, factors: decoded.factors, verified: decoded.decoded && decoded.verified && decoded.searched === 1n, ...(exit ? { exit } : {}) }
}

const byReduction = (id: string, theorem: string, p: bigint, q: bigint, a: bigint, order: bigint | null): Factored => {
  const [lo, hi] = pair(p, q)
  const N = lo * hi
  const found = order === null ? orderFinding(a, N) : null
  const r = order ?? (found?.order !== null && found?.order !== undefined ? BigInt(found.order) : null)
  const red = r === null ? null : shorReduction(N, a, r)
  return { id, theorem, via: order === null ? 'order' : 'reduction', N, p: lo, q: hi, bits: N.toString(2).length, factors: red?.factors ?? [], verified: found?.verified !== false && red?.verified === true && red.nonTrivial === true }
}

const cases = (): Factored[] => {
  const thousand = seededTrapdoor(1000, 1n)
  const beyondP = 9223372036854775421n
  const beyondQ = 9223372036854775783n
  return [
    byWitness('thousand', 'textbook_impossible_trapdoor', thousand, createdThousandExit(thousand)),
    byWitness('kernel', 'textbook_impossible_trapdoor', createImpossible({ p: 5n, q: 13n })),
    byWitness('distant', 'textbook_impossible_trapdoor', createImpossible({ p: 1000003n, q: 1099511627791n })),
    byReduction('sigma', 'textbook_shor_sigma_root', 7n, 13n, 8n, null),
    byReduction('fifteen', 'textbook_shor_fifteen_order', 3n, 5n, 7n, null),
    byReduction('twentyone', 'textbook_shor_reduction', 3n, 7n, 2n, null),
    byReduction('onefortythree', 'textbook_order_finding', 11n, 13n, 7n, null),
    byReduction('reached', 'textbook_order_finding', 65537n, 178481n, 2n, null),
    byReduction('beyond', 'textbook_shor_reduction', beyondP, beyondQ, 2n, 42535295865117306023683814300032439220n),
  ]
}

const place = (row: Factored) => {
  const address = uuid(`rsa\n${row.id}`)
  const handle = address.slice(0, 8)
  const installed = program(handle)
  const object = installed.object
  const born = birth(address)
  const stepped = next(address)
  const moved = birth(stepped.next)
  const placed = object.folders.join('') === handle && object.folders.length === 8 && installed.path === object.path && object.path === `${object.own}/index.ts` && installed.indexed === true && installed.depth === object.depth && object.fanout === 16 && object.span === '4294967296'
  const turned = stepped.kept === true && stepped.back === true && stepped.around === true && stepped.sealed === true && stepped.places === 10 && stepped.all === true && stepped.aspects.length === 4 && stepped.handle === handle && stepped.rotated === `${stepped.program.slice(1)}${stepped.program[0]}` && moved.path === born.path && moved.handle === born.handle && moved.dnode.bonus.tail.join() === born.dnode.bonus.tail.join() && born.checksum === address && born.path === object.path && born.birth.folders.join('') === address.replace(/-/g, '')
  const primes = [row.p.toString(), row.q.toString()]
  const factors = row.factors.map((factor) => factor.toString())
  const product = row.p * row.q === row.N && factors.length === 2 && BigInt(factors[0]!) * BigInt(factors[1]!) === row.N
  const same = factors[0] === primes[0] && factors[1] === primes[1]
  const exitAgrees = row.exit === undefined || (row.exit.holds === true && row.exit.bits === 1000 && row.exit.code === 0 && row.exit.exited === false && row.exit.factors[0] === primes[0] && row.exit.factors[1] === primes[1] && row.exit.integer === row.N.toString())
  return {
    id: row.id,
    theorem: row.theorem,
    via: row.via,
    example: row.id === 'thousand',
    bits: row.bits,
    integer: row.N.toString(),
    primes,
    factors,
    product,
    same,
    verified: row.verified && product && same && exitAgrees,
    address,
    handle,
    path: object.path,
    depth: object.depth,
    program: stepped.program,
    rotated: stepped.rotated,
    next: stepped.next,
    places: stepped.places,
    kept: stepped.kept,
    back: stepped.back,
    around: stepped.around,
    sealed: stepped.sealed,
    aspects: stepped.aspects.length,
    witnessed: stepped.all === true,
    ...(row.exit ? { exit: { id: row.exit.id, code: row.exit.code, holds: row.exit.holds } } : {}),
    holds: placed && turned && product && same && row.verified && exitAgrees,
  }
}

let cached: ReturnType<typeof compute> | null = null

const compute = () => {
  const rows = cases().map(place)
  const example = rows.find((row) => row.example)
  const ids = new Set(rows.map((row) => row.id))
  const holds = example?.id === 'thousand' && example.bits === 1000 && example.via === 'witness' && example.holds === true && rows.length > 1 && ids.size === rows.length && rows.every((row) => row.holds && row.depth === 7 && row.handle === row.address.slice(0, 8))
  return {
    phase: 'programs' as const,
    via: 'rsa' as const,
    atOnce: true as const,
    walked: false as const,
    fetched: false as const,
    written: false as const,
    cases: rows.length,
    example: 'thousand' as const,
    rows,
    holds,
    says: holds
      ? `${rows.length} RSA programs. The thousand-bit integer is generated with its primes, factored, and the factors are those primes. Each other case is its own program and checks the same way. The next step rotates the program one place. The handle and the tail stay.`
      : 'an RSA program did not factor the integer it was created with',
  }
}

/** Every RSA case, each one UUID program. The thousand-bit mint is the example. */
export const rsaPrograms = () => cached ??= compute()

/** One case when a name is passed. true is every case. */
export const rsaDoor = (asked: unknown) => {
  const all = rsaPrograms()
  if (asked === true) return all
  const id = typeof asked === 'string' ? asked : ''
  const row = all.rows.find((item) => item.id === id)
  if (!row) throw new Error(`rsa takes true or one of ${all.rows.map((item) => item.id).join(', ')}`)
  return { ...all, cases: 1, rows: [row], holds: row.holds, says: row.holds ? `the ${id} program factors the integer it generated, and the factors are the primes it was created with` : 'an RSA program did not factor the integer it was created with' }
}
