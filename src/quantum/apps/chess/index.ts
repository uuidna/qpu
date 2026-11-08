// The clay chess game. A team is the formulas that share a family. The player of a formula is its coin, the address of
// that formula, and two coins are against each other when their seeds sum to ten. They meet only by a chess move. Every
// coin's possibilities are the ones navigate computes now. Folding the board is σ₇ on file and rank, and each meeting
// multiplies to one product.

import { add, div, mul, natSub } from '../calculator/index.ts'
import { channel, coins, navigate } from '../../uuid/index.ts'

type Formula = { name: string; statement: string; families: readonly string[]; value: number }
type Square = { file: number; rank: number }
const PIECES = ['king', 'queen', 'rook', 'bishop', 'knight', 'pawn'] as const
type Piece = (typeof PIECES)[number]

const abs = (n: number) => n < 0 ? -n : n
const root = (n: number) => n === 0 ? 0 : 1 + ((n - 1) % 9)
const pieceOf = (family: string): Piece => PIECES[[...family].reduce((n, c) => n + c.charCodeAt(0), 0) % PIECES.length]!
const keyOf = (s: Square) => `${s.file},${s.rank}`
const fold = (s: Square): Square => ({ file: 7 - s.file, rank: 7 - s.rank })

const aligned = (df: number, dr: number) => df === 0 || dr === 0 || abs(df) === abs(dr)

const blocked = (from: Square, to: Square, occupied: ReadonlySet<string>) => {
  const df = to.file - from.file, dr = to.rank - from.rank, step = abs(df) > abs(dr) ? abs(df) : abs(dr)
  if (step <= 1 || !aligned(df, dr)) return false
  const sf = df / step, sr = dr / step
  for (let i = 1; i < step; i++) if (occupied.has(keyOf({ file: from.file + sf * i, rank: from.rank + sr * i }))) return true
  return false
}

const HEX = div(512n, 4n)
const SQUARES = div(HEX, 2n)
const SIDE = 8n
const PERIOD = 60000n
const ADLER_HEX = 8n
const pulseHolds = (t: bigint) => natSub(add(t, PERIOD), t) === PERIOD
const stepHolds = (i: bigint) => natSub(add(i, 1n), i) === 1n

type NistPulse = { outputValue?: string; pulseIndex?: number; period?: number; chainIndex?: number }
type CernRecord = { id?: string; size?: number; checksum?: string; doi?: string }
type CernPage = { total?: number; records?: readonly CernRecord[] }

const boardBytes = (output: string) => {
  const hex = output.toLowerCase()
  if (hex.length !== Number(HEX) || !/^[0-9a-f]+$/.test(hex)) return null
  const bytes: number[] = []
  for (let i = 0; i < hex.length; i += 2) bytes.push(parseInt(hex.slice(i, i + 2), 16))
  return bytes.length === Number(SQUARES) ? bytes : null
}

const cernSeat = (checksum: string): Square | null => {
  const hex = /^adler32:([0-9a-f]{8})$/i.exec(checksum)?.[1]
  if (!hex || hex.length !== Number(ADLER_HEX)) return null
  const n = BigInt(`0x${hex}`)
  return { file: Number(n % SIDE), rank: Number(div(n, SIDE) % SIDE) }
}

const standards = (nist: NistPulse | null, cern: CernPage | null) => {
  const bytes = typeof nist?.outputValue === 'string' ? boardBytes(nist.outputValue) : null
  const geometry = HEX === 128n && SQUARES === 64n && mul(SIDE, SIDE) === SQUARES && pulseHolds(0n) && stepHolds(0n) && mul(ADLER_HEX, 4n) === 32n
  const pulse = nist?.outputValue === undefined ? true : bytes !== null && nist.period === Number(PERIOD) && stepHolds(BigInt(nist.pulseIndex ?? 0))
  const records = cern?.records ?? []
  const seats = records.map((record) => {
    const seat = typeof record.checksum === 'string' ? cernSeat(record.checksum) : null
    const doi = record.doi === undefined || /^10\.\d{4,}\/\S+$/.test(record.doi)
    const size = typeof record.size === 'number' && record.size >= 0
    return { id: record.id ?? '', size: record.size ?? 0, checksum: record.checksum ?? '', seat, holds: seat !== null && doi && size }
  })
  const page = cern?.records === undefined ? true : typeof cern.total === 'number' && cern.total >= records.length && seats.every((s) => s.holds)
  return { bytes, seats, nist: geometry && pulse, cern: geometry && page, holds: geometry && pulse && page, squares: Number(SQUARES), hex: Number(HEX), bits: 512, period: Number(PERIOD), step: 1, adlerHex: Number(ADLER_HEX), pulseIndex: nist?.pulseIndex ?? null, chainIndex: nist?.chainIndex ?? null }
}

const reaches = (piece: Piece, from: Square, to: Square, occupied: ReadonlySet<string>) => {
  const df = to.file - from.file, dr = to.rank - from.rank, adf = abs(df), adr = abs(dr)
  if (adf === 0 && adr === 0) return false
  if (piece === 'knight') return (adf === 1 && adr === 2) || (adf === 2 && adr === 1)
  if (piece === 'king') return adf <= 1 && adr <= 1
  if (piece === 'pawn') return adf === 1 && adr === 1
  const slides = piece === 'rook' ? adf === 0 || adr === 0 : piece === 'bishop' ? adf === adr : piece === 'queen' ? adf === 0 || adr === 0 || adf === adr : false
  return slides && !blocked(from, to, occupied)
}

const recognise = (formulas: readonly Formula[], doors: { nist?: NistPulse | null; cern?: CernPage | null } = {}) => {
  const door = standards(doors.nist ?? null, doors.cern ?? null)
  const players = formulas.map((formula) => {
    const player = coins([formula.statement]).coins[0]!
    const program = channel(player).program
    const square: Square = { file: program[0]! % 8, rank: program[1]! % 8 }
    const seed = root(formula.value)
    return { ...formula, player, seed, reflection: seed === 0 ? 0 : 10 - seed, square, pieces: formula.families.map(pieceOf), possibilities: navigate(player, { execute: true }) }
  })
  const occupied = new Set(players.map((p) => keyOf(p.square)))
  const teams = [...new Set(formulas.flatMap((f) => [...f.families]))].sort().map((family) => {
    const members = players.filter((p) => p.families.includes(family))
    return { family, piece: pieceOf(family), formulas: members.map((p) => ({ name: p.name, statement: p.statement, value: p.value })), players: members.map((p) => p.player) }
  })
  const sideOf = (seed: number) => seed < 5 ? 'nist' as const : seed > 5 ? 'cern' as const : null
  const against = players.flatMap((a, i) => players.slice(i + 1).filter((b) => a.seed + b.seed === 10 && sideOf(a.seed) !== null && sideOf(b.seed) !== null).map((b) => {
    const nist = a.seed < b.seed ? a : b
    const cern = nist === a ? b : a
    const nistPiece = nist.pieces.find((piece) => reaches(piece, nist.square, cern.square, occupied)) ?? null
    const cernPiece = cern.pieces.find((piece) => reaches(piece, cern.square, nist.square, occupied)) ?? null
    const mover = nistPiece ? 'nist' as const : cernPiece ? 'cern' as const : null
    const piece = nistPiece ?? cernPiece
    const from = mover === 'nist' ? nist.square : cern.square
    const to = mover === 'nist' ? cern.square : nist.square
    const product = mul(BigInt(nist.value), BigInt(cern.value)).toString()
    return { a: nist.name, b: cern.name, players: [nist.player, cern.player] as const, seeds: [nist.seed, cern.seed] as const, nist: nist.name, cern: cern.name, mover, piece, from, to, folded: { from: fold(from), to: fold(to) }, legal: mover !== null, product }
  }))
  const plays = against.filter((m) => m.legal)
  const combinations = plays.flatMap((m) => [m, { ...m, from: m.folded.from, to: m.folded.to, folded: { from: m.from, to: m.to } }])
  const products = combinations.map((m) => m.product)
  const online = players.every((p) => p.possibilities.neighbours.length === 6 && p.possibilities.stream.rows.length === 7)
  const folded = players.every((p) => keyOf(fold(fold(p.square))) === keyOf(p.square))
  const byteAt = (s: Square) => door.bytes?.[s.rank * Number(SIDE) + s.file] ?? null
  const seatedAt = (s: Square) => door.seats.filter((seat) => seat.seat && keyOf(seat.seat) === keyOf(s))
  const onCern = door.seats.filter((seat) => seat.seat && players.some((p) => sideOf(p.seed) === 'nist' && p.pieces.some((piece) => reaches(piece, p.square, seat.seat!, occupied))))
  const scenarios = plays.map((m) => {
    const nist = players.find((p) => p.name === m.nist)!
    const cern = players.find((p) => p.name === m.cern)!
    const nistSeat = seatedAt(nist.square)
    const cernSeat = seatedAt(cern.square)
    return { nist: { formula: nist.name, seed: nist.seed, square: nist.square, byte: byteAt(nist.square), records: nistSeat.map((s) => s.id) }, cern: { formula: cern.name, seed: cern.seed, square: cern.square, byte: byteAt(cern.square), records: cernSeat.map((s) => s.id) }, mover: m.mover, piece: m.piece, from: m.from, to: m.to, answer: m.folded, product: m.product, clay: m.seeds[0] + m.seeds[1] === 10 && m.legal }
  })
  const recognised = teams.length > 0 && players.length === formulas.length && players.every((p) => p.families.length > 0 && p.player.length === 36) && online && folded && products.length === combinations.length && scenarios.length === plays.length && scenarios.every((s) => s.clay) && door.holds
  return {
    phase: 'chess' as const,
    game: 'clay chess' as const,
    recognised,
    teams: teams.length,
    players: players.length,
    against: against.length,
    plays: plays.length,
    combinations: combinations.length,
    productCount: products.length,
    online,
    folded,
    squares: door.squares,
    hex: door.hex,
    bits: door.bits,
    period: door.period,
    step: door.step,
    nist: { holds: door.nist, side: 'nist' as const, pieces: players.filter((p) => sideOf(p.seed) === 'nist').length, squares: door.squares, hex: door.hex, bits: door.bits, period: door.period, step: door.step, pulseIndex: door.pulseIndex, chainIndex: door.chainIndex },
    cern: { holds: door.cern, side: 'cern' as const, pieces: players.filter((p) => sideOf(p.seed) === 'cern').length, adlerHex: door.adlerHex, records: door.seats.length, seated: door.seats.filter((s) => s.seat).length, onBoard: onCern.length, seats: door.seats },
    scenarios,
    roster: teams,
    meetings: against,
    possibilities: players.map((p) => ({ player: p.player, formula: p.name, side: sideOf(p.seed), square: p.square, byte: byteAt(p.square), neighbours: p.possibilities.neighbours.length, rows: p.possibilities.stream.rows.length })),
    says: `NIST and CERN play by the clay rules: a coin below seed 5 is NIST and the coin at 10 minus that seed is CERN, they meet only by a chess move, and the fold is the reply. ${scenarios.length} scenarios, ${players.filter((p) => sideOf(p.seed) === 'nist').length} NIST coins and ${players.filter((p) => sideOf(p.seed) === 'cern').length} CERN coins, on the beacon board of ${door.squares} squares, each meeting one product`,
  }
}

const chess = { recognise }

export { recognise }
export default chess
