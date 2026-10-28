// A decision verifiable by its client: every theorem a decision rests on is named with the QPU call that serves it (textbook { theorem })
// and the place its Lean source is published, so the client checks it online — reads the source, builds it with lake — or in the UI,
// where the view asks its host to make the call. Pure: the kernel's index decides "accepted"; nothing here claims more than it holds.
import { THEOREMS, THEOREM_KEYS } from './theorems-index.ts'
import { TEXTBOOK_THEOREMS } from './textbook-theorems.ts'
import { CLAIMS } from './claims-index.ts'

const LEAN_ROOT = 'https://github.com/uuidna/qpu/blob/main/src/quantum/processing/unit/lean'
/** One theorem as the client verifies it: accepted by the kernel or not, its module and statement, its Lean text, where to read and build it. */
export const getTheorem = (key: string) => {
  const t = THEOREMS.find((x) => x.key === key), tb = TEXTBOOK_THEOREMS.find((x) => x.key === key)
  const module = t?.module ?? null
  return { theorem: key, accepted: THEOREM_KEYS.has(key), module, statement: t?.statement ?? null, lean: tb?.lean ?? null, says: tb?.says ?? null, claim: CLAIMS.find((c) => c.theorem === key) ?? null, online: module ? { source: `${LEAN_ROOT}/${module.replace(/\./g, '/')}.lean`, build: 'lake build (core Lean, no Mathlib); the module compiles only if every proof in it is accepted' } : null, theorem_: 'textbook_lean_served_whole' }
}
/** The verification a decision carries: for each theorem, the call that serves it and its source online. */
export const verifyTheorems = (keys: readonly string[]) => [...new Set(keys)].map((key) => { const t = getTheorem(key); return { theorem: key, accepted: t.accepted, call: { name: 'textbook', arguments: { theorem: key } }, online: t.online?.source ?? null } })
