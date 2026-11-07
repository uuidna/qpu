// The open problems seen as a toolset of involutions, collided with each other without a limit: every open lead is its pair — its address and
// its σ-reflection on the parts (handle, program, tail; σ_15 on every nibble), which σ returns (sigma_reflect: d − (d − x) = x) — so the toolset
// reads it in both directions. Every problem is routed to the theorems; the ones no theorem reaches collide, all pairs at once, through the
// subjects they share: a subject several unreached problems share is one missing theorem that would serve them all (each problem solves many
// others, textbook_collision_solves_many). A collision is a lead to prove, never a statement the tree asserts.
import { uuid, channel, reflection, coins, seal } from '../uuid/index.ts'
import { routeStatement, routeStems } from './match.ts'
import type { Example } from './examples.ts'
import type { Lead } from './leads.ts'

/** Ideas are processed from this folder. A full pass drains the ones it verified or collided. What remains is a coverage gap. */
export const IDEA_HOME = '.idea' as const
type IdeaDoor = { holds: boolean; theorems: readonly { theorem: string; says: string }[] }
type IdeaRecord = {
  home?: string
  before?: number
  drained?: number
  left?: readonly string[]
  saved?: readonly { verified?: boolean }[]
  collided?: readonly { verified?: boolean; cern?: boolean; nist?: boolean; games?: boolean }[]
  outside?: readonly string[]
  covered?: boolean
}
const ideaPath = (p: string) => p.replace(/^\.\//, '').replace(/\\/g, '/')
const inIdea = (p: string) => p === IDEA_HOME || p.startsWith(`${IDEA_HOME}/`)
/** The measurement next and CI read. A save that was not verified, a collision that skipped CERN, NIST or the game seeds, or a covered stamp while a gap remains, does not hold. */
const ideaFlow = (g: IdeaRecord) => {
  if (g.home !== IDEA_HOME) return { holds: false as const, evidence: 'ideas are processed from .idea' }
  const left = g.left ?? [], saved = g.saved ?? [], collided = g.collided ?? [], outside = g.outside ?? []
  const before = g.before ?? 0, drained = g.drained ?? 0
  const badSave = saved.some((s) => s.verified !== true)
  const badHit = collided.some((c) => c.verified === true || c.cern !== true || c.nist !== true || c.games !== true)
  const partition = left.length + drained === before && drained <= before && drained === saved.length + collided.length
  const covered = before > 0 && left.length === 0 && outside.length === 0
  const stamped = g.covered === true && !covered
  const holds = !badSave && !badHit && partition && outside.length === 0 && !stamped
  const evidence = holds ? `${drained} of ${before} idea(s) drained from .idea; ${left.length} coverage gap(s) remain` : [badSave ? 'an idea was saved before it verified' : '', badHit ? 'a collision skipped CERN, NIST or the game seeds' : '', !partition ? 'the drain does not partition .idea' : '', outside.length ? `outside .idea: ${outside.join(', ')}` : '', stamped ? 'covered was stamped while a gap remains' : ''].filter(Boolean).join('; ')
  return { holds, evidence }
}
/**
 * Each idea is verified before it is saved. An unverified idea collides onto a variation only when the CERN door,
 * the NIST door and the games door all hold. The games door is seeds the caller hands, not this framework.
 * Processing in full drains the saved and the collided. What `.idea` still holds is the coverage gap.
 */
const coinOf = (text: string) => { const booked = coins([text]); const address = booked.coins[0] ?? null; return { address, sealed: !!address && seal(address).valid && booked.sealed } }

export const listCollisions = (leads: readonly Lead[], examples: readonly Example[]) => {
  const problems = leads.filter((l) => l.status === 'open' || l.status === 'partial')
  // every problem as an involution: its address, its mirror, and σ applied twice returning its parts
  const involutions = problems.map((l) => { const address = uuid(`lead\n${l.id}`); const once = reflection(address); const twice = reflection(once.mirror); const c = channel(address); return { id: l.id, address, mirror: once.mirror, returns: twice.handle === c.handle && twice.program.join('') === c.program.join('') && twice.tail === c.tail } })
  // routed: a theorem already reaches it; the rest collide
  const routed = problems.map((l) => ({ l, r: routeStatement(l.statement, examples, 1) }))
  // reached only when the best theorem shares two words or more: one word rare among the theorems can be common among the problems
  const strong = (x: { r: ReturnType<typeof routeStatement> }) => x.r.routed && (x.r.theorems[0]?.shared.length ?? 0) >= 2
  const reached = routed.filter(strong), open = routed.filter((x) => !strong(x)).map((x) => x.l)
  // all pairs collided at once through an inverted index: a subject shared by k problems is k(k − 1)/2 colliding pairs
  const stems = new Map(open.map((l) => [l.id, routeStems(l.statement)]))
  const bySubject = new Map<string, string[]>(); for (const [id, s] of stems) for (const w of s) bySubject.set(w, [...(bySubject.get(w) ?? []), id])
  const n = open.length, pairs = (n * (n - 1)) / 2
  const shared = [...bySubject.entries()].filter(([, ids]) => ids.length >= 2)
  // a subject every problem uses distinguishes none: the weight is how rare it is, the reach how many it would serve
  const idf = (k: number) => Math.log(Math.max(n, 2) / k)
  const candidates = shared.map(([subject, ids]) => ({ subject, solves: ids.length, pairs: (ids.length * (ids.length - 1)) / 2, weight: Math.round(ids.length * idf(ids.length) * 100) / 100, problems: ids })).filter((c) => c.weight > 0).sort((a, b) => b.weight - a.weight || b.solves - a.solves || a.subject.localeCompare(b.subject))
  const colliding = new Set(candidates.flatMap((c) => c.problems))
  const missing: Lead[] = candidates.map((c) => ({ id: `missing-theorem-${c.subject}`, source: `collisions of ${c.solves} open problems`, statement: `the theorem of ${c.subject} that ${c.solves} open problems share (${c.problems.slice(0, 3).join(', ')}${c.solves > 3 ? ', …' : ''}): proved once, it serves all of them`, status: 'open' as const, reason: 'a collision of problems no theorem reaches yet: a lead to prove, never asserted' }))
  return {
    problems: problems.length, involutions, returning: involutions.filter((i) => i.returns).length,
    routed: reached.length, unreached: open.length, pairs, collidingPairs: candidates.reduce((s, c) => s + c.pairs, 0), colliding: colliding.size, isolated: open.length - colliding.size,
    candidates, leads: missing,
    theorems: ['sigma_reflect', 'textbook_collision_solves_many', 'textbook_route_or_lead'],
    says: `${problems.length} open problems, each an involution (σ twice returns ${involutions.filter((i) => i.returns).length}); ${reached.length} reached by a theorem, ${open.length} collided in ${pairs} pairs: ${candidates.length} missing theorems, each a subject several problems share, serving ${colliding.size} of them; ${open.length - colliding.size} share no subject yet`,
  }
}
