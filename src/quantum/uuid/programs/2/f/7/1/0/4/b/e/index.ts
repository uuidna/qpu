// Prose linked to the source of its proof. A sentence is linked when it names a theorem the kernel accepted: the link is that theorem's
// Lean module, the file that states it and its statement as Lean formulates it. A sentence that names none is unlinked.
// The gate: the unlinked sentences are a committed list that only shrinks. A sentence not on the list may not be unlinked, so no new
// prose enters without its proof's source, and a listed sentence that has since been linked is struck in the same commit.
// A link says the sentence names the theorem; it does not say the theorem proves all the sentence says. That stays a reader's judgment.
import { PROSE } from '../../../../../../../../5/9/e/4/9/1/a/4/index.ts'
import { THEOREMS } from '../../../../../../../../3/f/0/e/7/a/6/f/index.ts'
import { PROSE_UNLINKED } from '../../../../../../../../3/7/2/f/3/1/1/5/index.ts'

/** The theorems a text names, each with the source of its proof: the Lean module, its file and its statement. */
export const linkedTheorems = (text: string) => {
  const words = new Set(text.match(/[A-Za-z_][\w.]*/g) ?? [])
  return THEOREMS.filter((t) => /[_.]/.test(t.key) && words.has(t.key)).map((t) => ({ theorem: t.key, module: t.module, source: `lean/${t.module.replace(/\./g, '/')}.lean`, statement: t.statement, mathlib: t.module === 'Qpu.General.Meaning' }))
}
/** The names of the sentences that name no theorem, as the tree stands. */
export const unlinkedProse = (): string[] => (Object.keys(PROSE) as (keyof typeof PROSE)[]).filter((name) => linkedTheorems(PROSE[name]).length === 0).sort()
/** The gate over a committed list: what would enter it (new prose with no proof's source) and what must leave it (prose since linked). */
export const gateProseLinks = (listed: readonly string[] = PROSE_UNLINKED) => {
  const now = unlinkedProse(), held = new Set(listed), still = new Set(now)
  const entering = now.filter((name) => !held.has(name)), struck = listed.filter((name) => !still.has(name)), sentences = Object.keys(PROSE).length
  return { sentences, linked: sentences - now.length, unlinked: now.length, listed: listed.length, entering, struck, holds: entering.length === 0 && struck.length === 0, evidence: `${sentences} - ${now.length} = ${sentences - now.length}; +${entering.length} -${struck.length}${entering.length ? `: ${entering.join(', ')}` : ''}` }
}
/** The list as the next commit holds it: what is listed and still unlinked. It never takes a name it did not hold, unless it is seeded while empty. */
export const nextUnlinked = (listed: readonly string[] = PROSE_UNLINKED, seed = false): string[] => { const now = unlinkedProse(); return listed.length === 0 && seed ? now : listed.filter((name) => now.includes(name)) }
