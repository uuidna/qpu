// The open problems seen as a toolset of involutions, collided with each other without a limit: every open lead is its pair — its address and
// its σ-reflection on the parts (handle, program, tail; σ_15 on every nibble), which σ returns (sigma_reflect: d − (d − x) = x) — so the toolset
// reads it in both directions. Every problem is routed to the theorems; the ones no theorem reaches collide, all pairs at once, through the
// subjects they share: a subject several unreached problems share is one missing theorem that would serve them all (each problem solves many
// others, textbook_collision_solves_many). A collision is a lead to prove, never a statement the tree asserts.
import { PROSE, proseFill } from './prose-index.ts'
import { uuid, channel, reflection } from '../uuid/index.ts'
import { routeStatement, routeStems, routedStrongly as strong } from './match.ts'
import type { Example } from './examples.ts'
import type { Lead } from './leads.ts'

/** Ideas are processed from this folder. A full pass drains the ones it verified or collided. What remains is a coverage gap. */
export const IDEA_HOME = '.idea' as const

export const listCollisions = (leads: readonly Lead[], examples: readonly Example[]) => {
  const problems = leads.filter((l) => l.status === 'open' || l.status === 'partial')
  // every problem as an involution: its address, its mirror, and σ applied twice returning its parts
  const involutions = problems.map((l) => { const address = uuid(`lead\n${l.id}`); const once = reflection(address); const twice = reflection(once.mirror); const c = channel(address); return { id: l.id, address, mirror: once.mirror, returns: twice.handle === c.handle && twice.program.join('') === c.program.join('') && twice.tail === c.tail } })
  // routed: a theorem already reaches it; the rest collide
  const routed = problems.map((l) => ({ l, r: routeStatement(l.statement, examples, 1) }))
  // reached only when the best theorem shares two words or more: one word rare among the theorems can be common among the problems
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
  const missing: Lead[] = candidates.map((c) => ({ id: `missing-theorem-${c.subject}`, source: `collisions of ${c.solves} open problems`, statement: proseFill(PROSE.quantumProcessingCollisions_statement1, c.subject, c.solves, c.problems.slice(0, 3).join(', '), c.solves > 3 ? ', …' : ''), status: 'open' as const, reason: PROSE.quantumProcessingCollisions_reason2 }))
  return {
    problems: problems.length, involutions, returning: involutions.filter((i) => i.returns).length,
    routed: reached.length, unreached: open.length, pairs, collidingPairs: candidates.reduce((s, c) => s + c.pairs, 0), colliding: colliding.size, isolated: open.length - colliding.size,
    candidates, leads: missing,
    theorems: ['sigma_reflect', 'textbook_collision_solves_many', 'textbook_route_or_lead'],
    says: proseFill(PROSE.quantumProcessingCollisions_says3, problems.length, involutions.filter((i) => i.returns).length, reached.length, open.length, pairs, candidates.length, colliding.size, open.length - colliding.size),
  }
}
