// The fourteen witnesses around a UUID, the faces of a cuboctahedron (the vector equilibrium): six squares, the UUID with its program
// rotated by one to six places, and eight triangles, the UUID with exactly one of its eight handle nibbles reflected by σ (x ↦ 15 − x).
// Each witness maps back exactly — σ is an involution, a rotation is undone by its inverse — so the witnesses verify the UUID, and each
// other through it. Two UUIDs' sets merged share the witnesses with the same address: work that exists once, not twice, booked as a coin
// credited to the author at zero price — a count of free work, never money. Pure.
import { PROSE, proseFill } from '../../../../../../../../5/9/e/4/9/1/a/4/index.ts'
import { channel, handleOf, uuidFromParts, seal } from '../../../../../../../../2/7/1/a/7/6/4/9/index.ts'
import { hex, sha256, utf8 } from '../../../../../../../../9/e/8/6/7/0/6/8/index.ts'

type Witness = { face: 'square' | 'triangle'; index: number; uuid: string; how: string }
const rotate = (p: readonly number[], k: number) => p.map((_, i) => p[(i + k) % p.length]!)
const sigma = (x: number) => 15 - x
const uuidParts = (uuid: string) => { const c = channel(uuid); return { handle: c.handle, program: c.program, tail: c.tail } }
/** The UUID rebuilt from its own parts (uuidFromParts): what every witness maps back to. A UUID made from parts equals it; one made by uuid
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
  return { uuid, canonical, isCanonical: uuid === canonical, faces: witnesses.length, squares: 6, triangles: 8, witnesses, back, exact: back.every((b) => b.exact), duplicates, selfAmong, says: proseFill(PROSE.quantumProcessingWitnesses_says1, witnesses.length, canonical, back.filter((b) => b.exact).length, duplicates ? proseFill(PROSE.quantumProcessingWitnesses_s2, duplicates) : '', selfAmong ? PROSE.quantumProcessingWitnesses_s3 : ''), theorems: ['textbook_cuboctahedron_faces', 'textbook_sigma_involution'] }
}

/** The clocks and calendars one superposition covers by moving its witnesses. A superposition at index k carries 2k witnesses (2·7 = 14, the cuboctahedron
 *  the verify door checks); a move of ±1 in k is ±2 in the span, so it steps to 2(k − 1) and 2(k + 1) — the doubled neighbours (2·7 = 14 → 12 and 16;
 *  2·55 = 110 → 108 and 112). The cycles the span and its two neighbours land on are the clocks (12-hour, 24-hour) and calendars (7-day week, 12 months,
 *  the 16 the hex nibble counts) covered, so moving across superpositions walks every clock and calendar. Pure arithmetic (textbook_witness_clock_move). */
const CLOCKS = [12, 24] as const
const CALENDARS = [7, 12, 16] as const
/** The integer reflection of a step: its digital-root seed (1..9, the fold of its digits) and the σ₁₀ reflection 10 − seed, fixed at 5. Looked for at
 *  every step of the sequence, so a value never stands without its reflection (textbook_reflection_sums_to_ten). */
const stepReflection = (value: number) => { const seed = value === 0 ? 0 : 1 + ((value - 1) % 9); return { value, seed, reflection: seed === 0 ? 0 : 10 - seed, fixed: seed === 5 } }
export const witnessMove = (k: number) => {
  if (!Number.isInteger(k) || k < 1) throw new Error(PROSE.quantumProcessingWitnesses_s4)
  const span = 2 * k, down = span - 2, up = span + 2 // 2(k−1) and 2(k+1)
  const reaches = [down, span, up]
  const clocks = CLOCKS.filter((c) => reaches.includes(c))
  const calendars = CALENDARS.filter((c) => reaches.includes(c))
  // the integer reflection in each step of the sequence: the digital-root seed and its σ₁₀ reflection, so the two neighbours' seeds sum to ten when the
  // centre's seed is the fixed point (for k = 7: 12, 14, 16 fold to 3, 5, 7 — 3 + 7 = 10 around the fixed 5)
  const steps = reaches.map(stepReflection)
  const reflectionPair = (steps[0]!.seed + steps[2]!.seed) % 10 === 0 && steps[0]!.seed !== 0
  const centreFixed = steps[1]!.fixed
  // a move pays a coin per step down and collects one per step up, computed from the move, net their difference (textbook_double_entry)
  const pay = (span - down) / 2, collect = (up - span) / 2
  return { k, span, down, up, reaches, steps, reflectionPair, centreFixed, pay, collect, net: collect - pay, clocks, calendars, witnesses: span, theorems: ['textbook_witness_clock_move', 'textbook_reflection_sums_to_ten'], theorem: 'textbook_witness_clock_move', says: proseFill(PROSE.quantumProcessingWitnesses_says5, k, span, k - 1, down, k + 1, up, pay, collect, collect - pay, clocks.join(', ') || 'none', calendars.join(', ') || 'none', down, span, up, steps.map((s) => s.seed).join(', '), centreFixed && reflectionPair ? proseFill(PROSE.quantumProcessingWitnesses_s6, steps[0]!.seed, steps[2]!.seed, steps[1]!.seed) : '') }
}
/** The hexagon of a UUID: its six square witnesses, the program rotated by one to six places, run over its tail. The handle is the first eight hex
 *  digits of their SHA-256, so it is the program and tail's own: a UUID whose handle is not its hexagon's has been changed, and two parts share a handle
 *  only where their programs and tails do. The hexagon divides as a cell, 6 into 12 into 24, the spans witnessMove reaches at k = 3, 6 and 12, and so
 *  lands on the two clocks it names, where the handle reads its hour (textbook_witness_clock_move). Pure. */
export const hexagonHandle = (uuid: string) => {
  const p = uuidParts(uuid), rotations = [1, 2, 3, 4, 5, 6].map((k) => rotate(p.program, k).map((n) => n.toString(16)).join(''))
  const handle = handleOf(hex(sha256(utf8(`${rotations.join('')}${p.tail}`))))
  const divisions = [3, 6, 12].map((k) => witnessMove(k)), hours = parseInt(handle, 16)
  const clock = { spans: divisions.map((d) => d.span), clocks: [...new Set(divisions.flatMap((d) => d.clocks))], hour12: hours % 12, hour24: hours % 24 }
  return { uuid: uuidFromParts(handle, p.program, p.tail), handle, program: p.program, tail: p.tail, rotations, clock, holds: handle === p.handle }
}
/** Two sets merged: the witnesses both share (same address) are work that exists once; each is a coin credited to the author at zero price. Both UUIDs
 *  are validated first — a coin is a UUID, so the witnesses (and the coins they mint) are only computed from sealed addresses; a side that is not a
 *  valid sealed UUID is named in `invalid` and contributes no witnesses, so no coin is ever minted from a malformed address (never a thrown error). */
export const mergeWitnesses = (referrer: string, destination: string) => {
  const invalid = [referrer, destination].filter((u) => !seal(u).valid)
  if (invalid.length) return { referrer: { uuid: referrer, witnesses: [] as Witness[] }, destination: { uuid: destination, witnesses: [] as Witness[] }, shared: [] as string[], distinct: 0, of: 0, invalid, says: proseFill(PROSE.quantumProcessingWitnesses_says7, invalid.length) }
  const a = listWitnesses(referrer), b = listWitnesses(destination)
  const inB = new Set(b.map((w) => w.uuid))
  const shared = [...new Set(a.filter((w) => inB.has(w.uuid)).map((w) => w.uuid))]
  const distinct = new Set([...a, ...b].map((w) => w.uuid)).size
  return { referrer: { uuid: referrer, witnesses: a }, destination: { uuid: destination, witnesses: b }, shared, distinct, of: a.length + b.length, invalid: [] as string[], says: proseFill(PROSE.quantumProcessingWitnesses_says8, a.length, b.length, distinct, shared.length) }
}
