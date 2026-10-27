// The fourteen witnesses around a UUID, the faces of a cuboctahedron (the vector equilibrium): six squares, the UUID with its program
// rotated by one to six places, and eight triangles, the UUID with exactly one of its eight handle nibbles reflected by σ (x ↦ 15 − x).
// Each witness maps back exactly — σ is an involution, a rotation is undone by its inverse — so the witnesses verify the UUID, and each
// other through it. Two UUIDs' sets merged share the witnesses with the same address: work that exists once, not twice, booked as a coin
// credited to the author at zero price — a count of free work, never money. Pure.
import { channelOf, uuidFromParts } from './blocks.ts'

type Witness = { face: 'square' | 'triangle'; index: number; uuid: string; how: string }
const rotate = (p: readonly number[], k: number) => p.map((_, i) => p[(i + k) % p.length]!)
const sigma = (x: number) => 15 - x
const partsOf = (uuid: string) => { const c = channelOf(uuid); return { handle: c.handle, program: c.program, tail: c.tail } }
/** The UUID rebuilt from its own parts (uuidFromParts): what every witness maps back to. A UUID made from parts equals it; one made by uuidOf
 *  carries a different stamp and differs from it in that nibble alone, which the check reports (isCanonical) rather than hides. */
const canonicalOf = (uuid: string) => { const p = partsOf(uuid); return uuidFromParts(p.handle, p.program, p.tail) }
const reflectHandle = (handle: string, i: number) => handle.slice(0, i) + sigma(parseInt(handle[i]!, 16)).toString(16) + handle.slice(i + 1)

/** The fourteen faces: six square (program rotated 1..6 places), eight triangular (one handle nibble reflected by σ). */
const witnessesOf = (uuid: string): Witness[] => {
  const { handle, program, tail } = partsOf(uuid)
  const squares = [1, 2, 3, 4, 5, 6].map((k): Witness => ({ face: 'square', index: k, uuid: uuidFromParts(handle, rotate(program, k), tail), how: `program rotated ${k} place(s)` }))
  const triangles = [0, 1, 2, 3, 4, 5, 6, 7].map((i): Witness => ({ face: 'triangle', index: i, uuid: uuidFromParts(reflectHandle(handle, i), program, tail), how: `handle nibble ${i} reflected by σ` }))
  return [...squares, ...triangles]
}

/** Every witness mapped back: a square rotated back by its places, a triangle's nibble reflected again; each must give the canonical UUID. */
export const witnessCheckOf = (uuid: string) => {
  const canonical = canonicalOf(uuid)
  const witnesses = witnessesOf(uuid)
  const back = witnesses.map((w) => { const p = partsOf(w.uuid); const b = w.face === 'square' ? uuidFromParts(p.handle, rotate(p.program, p.program.length - (w.index % p.program.length)), p.tail) : uuidFromParts(reflectHandle(p.handle, w.index), p.program, p.tail); return { face: w.face, index: w.index, back: b, exact: b === canonical } })
  const distinct = new Set(witnesses.map((w) => w.uuid))
  const duplicates = witnesses.length - distinct.size
  const selfAmong = distinct.has(canonical)
  return { uuid, canonical, isCanonical: uuid === canonical, faces: witnesses.length, squares: 6, triangles: 8, witnesses, back, exact: back.every((b) => b.exact), duplicates, selfAmong, says: `${witnesses.length} witnesses around ${canonical}: ${back.filter((b) => b.exact).length} map back exactly${duplicates ? `, ${duplicates} coincide (a rotation that repeats the program)` : ''}${selfAmong ? '; one equals the UUID itself (its program is rotation-symmetric)' : ''}`, theorems: ['textbook_cuboctahedron_faces', 'textbook_sigma_involution'] }
}

/** Two sets merged: the witnesses both share (same address) are work that exists once; each is a coin credited to the author at zero price. */
export const witnessMergeOf = (referrer: string, destination: string) => {
  const a = witnessesOf(referrer), b = witnessesOf(destination)
  const inB = new Set(b.map((w) => w.uuid))
  const shared = [...new Set(a.filter((w) => inB.has(w.uuid)).map((w) => w.uuid))]
  const distinct = new Set([...a, ...b].map((w) => w.uuid)).size
  return { referrer: { uuid: referrer, witnesses: a }, destination: { uuid: destination, witnesses: b }, shared, distinct, of: a.length + b.length, says: `${a.length} + ${b.length} witnesses, ${distinct} distinct: ${shared.length} shared by address, each work that exists once, not twice` }
}
