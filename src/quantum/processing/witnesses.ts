// The fourteen witnesses around a UUID, the faces of a cuboctahedron (the vector equilibrium): six squares, the UUID with its program
// rotated by one to six places, and eight triangles, the UUID with exactly one of its eight handle nibbles reflected by σ (x ↦ 15 − x).
// Each witness maps back exactly — σ is an involution, a rotation is undone by its inverse — so the witnesses verify the UUID, and each
// other through it. Two UUIDs' sets merged share the witnesses with the same address: work that exists once, not twice, booked as a coin
// credited to the author at zero price — a count of free work, never money. Pure.
import { channelOf, uuidFromParts, sealOf } from './unit/blocks.ts'

type Witness = { face: 'square' | 'triangle'; index: number; uuid: string; how: string }
const rotate = (p: readonly number[], k: number) => p.map((_, i) => p[(i + k) % p.length]!)
const sigma = (x: number) => 15 - x
const uuidParts = (uuid: string) => { const c = channelOf(uuid); return { handle: c.handle, program: c.program, tail: c.tail } }
/** The UUID rebuilt from its own parts (uuidFromParts): what every witness maps back to. A UUID made from parts equals it; one made by uuidOf
 *  carries a different stamp and differs from it in that nibble alone, which the check reports (isCanonical) rather than hides. */
const canonicalUuid = (uuid: string) => { const p = uuidParts(uuid); return uuidFromParts(p.handle, p.program, p.tail) }
const reflectHandle = (handle: string, i: number) => handle.slice(0, i) + sigma(parseInt(handle[i]!, 16)).toString(16) + handle.slice(i + 1)

/** The fourteen faces: six square (program rotated 1..6 places), eight triangular (one handle nibble reflected by σ). */
const listWitnesses = (uuid: string): Witness[] => {
  const { handle, program, tail } = uuidParts(uuid)
  const squares = [1, 2, 3, 4, 5, 6].map((k): Witness => ({ face: 'square', index: k, uuid: uuidFromParts(handle, rotate(program, k), tail), how: `program rotated ${k} place(s)` }))
  const triangles = [0, 1, 2, 3, 4, 5, 6, 7].map((i): Witness => ({ face: 'triangle', index: i, uuid: uuidFromParts(reflectHandle(handle, i), program, tail), how: `handle nibble ${i} reflected by σ` }))
  return [...squares, ...triangles]
}

/** Every witness mapped back: a square rotated back by its places, a triangle's nibble reflected again; each must give the canonical UUID. */
export const checkWitnesses = (uuid: string) => {
  const canonical = canonicalUuid(uuid)
  const witnesses = listWitnesses(uuid)
  const back = witnesses.map((w) => { const p = uuidParts(w.uuid); const b = w.face === 'square' ? uuidFromParts(p.handle, rotate(p.program, p.program.length - (w.index % p.program.length)), p.tail) : uuidFromParts(reflectHandle(p.handle, w.index), p.program, p.tail); return { face: w.face, index: w.index, back: b, exact: b === canonical } })
  const distinct = new Set(witnesses.map((w) => w.uuid))
  const duplicates = witnesses.length - distinct.size
  const selfAmong = distinct.has(canonical)
  return { uuid, canonical, isCanonical: uuid === canonical, faces: witnesses.length, squares: 6, triangles: 8, witnesses, back, exact: back.every((b) => b.exact), duplicates, selfAmong, says: `${witnesses.length} witnesses around ${canonical}: ${back.filter((b) => b.exact).length} map back exactly${duplicates ? `, ${duplicates} coincide (a rotation that repeats the program)` : ''}${selfAmong ? '; one equals the UUID itself (its program is rotation-symmetric)' : ''}`, theorems: ['textbook_cuboctahedron_faces', 'textbook_sigma_involution'] }
}

/** The clocks and calendars one superposition covers by moving its witnesses. A superposition at index k carries 2k witnesses (2·7 = 14, the cuboctahedron
 *  the verify door checks); a move of ±1 in k is ±2 in the span, so it steps to 2(k − 1) and 2(k + 1) — the doubled neighbours (2·7 = 14 → 12 and 16;
 *  2·55 = 110 → 108 and 112). The cycles the span and its two neighbours land on are the clocks (12-hour, 24-hour) and calendars (7-day week, 12 months,
 *  the 16 the hex nibble counts) covered, so moving across superpositions walks every clock and calendar. Pure arithmetic (textbook_witness_clock_move). */
export const CLOCKS = [12, 24] as const
export const CALENDARS = [7, 12, 16] as const
export const witnessMove = (k: number) => {
  if (!Number.isInteger(k) || k < 1) throw new Error('a superposition index is a positive integer: its 2k witnesses move by ±2')
  const span = 2 * k, down = span - 2, up = span + 2 // 2(k−1) and 2(k+1)
  const reaches = [down, span, up]
  const clocks = CLOCKS.filter((c) => reaches.includes(c))
  const calendars = CALENDARS.filter((c) => reaches.includes(c))
  // a move pays one coin down and collects one up — a teleport between witness states signalling the whole set — net zero (textbook_double_entry)
  return { k, span, down, up, reaches, pay: 1, collect: 1, net: 0, clocks, calendars, witnesses: span, theorem: 'textbook_witness_clock_move', says: `2·${k} = ${span} witnesses around the superposition; a ±1 move in k is ±2 in the span, to 2·${k - 1} = ${down} and 2·${k + 1} = ${up}, paying one coin down and collecting one up (net zero); it covers clock(s) ${clocks.join(', ') || 'none'} and calendar(s) ${calendars.join(', ') || 'none'}` }
}
/** Two sets merged: the witnesses both share (same address) are work that exists once; each is a coin credited to the author at zero price. Both UUIDs
 *  are validated first — a coin is a UUID, so the witnesses (and the coins they mint) are only computed from sealed addresses; a side that is not a
 *  valid sealed UUID is named in `invalid` and contributes no witnesses, so no coin is ever minted from a malformed address (never a thrown error). */
export const mergeWitnesses = (referrer: string, destination: string) => {
  const invalid = [referrer, destination].filter((u) => !sealOf(u).valid)
  if (invalid.length) return { referrer: { uuid: referrer, witnesses: [] as Witness[] }, destination: { uuid: destination, witnesses: [] as Witness[] }, shared: [] as string[], distinct: 0, of: 0, invalid, says: `${invalid.length} side(s) are not a sealed UUID; no witnesses computed and no coin minted (a coin is a validated address)` }
  const a = listWitnesses(referrer), b = listWitnesses(destination)
  const inB = new Set(b.map((w) => w.uuid))
  const shared = [...new Set(a.filter((w) => inB.has(w.uuid)).map((w) => w.uuid))]
  const distinct = new Set([...a, ...b].map((w) => w.uuid)).size
  return { referrer: { uuid: referrer, witnesses: a }, destination: { uuid: destination, witnesses: b }, shared, distinct, of: a.length + b.length, invalid: [] as string[], says: `${a.length} + ${b.length} witnesses, ${distinct} distinct: ${shared.length} shared by address, each work that exists once, not twice` }
}
