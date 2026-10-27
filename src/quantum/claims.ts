// The textbook's claims measured against what is published: a theorem with variables states a general law, and the works DOI-registered
// before the tree's own record of precedence (2026) that resemble it are its candidates; a closed count of this tree is its own, which no
// prior publication can state. A search finds resemblance, never the same claim: "recognised" is set only by a confirmation recorded in the
// docket (a reader who read the work), "unrecognised" when no candidate is found. Pure: the client asks OpenAlex and hands the answers back.
import { TEXTBOOK_THEOREMS } from './textbook-theorems.ts'
import { parseStatement } from './expressions.ts'

const PRECEDENCE_YEAR = 2026
const words = (s: string) => new Set(s.toLowerCase().match(/[a-z]{4,}/g) ?? [])
const classifyClaim = (lean: string): 'general' | 'own' => (parseStatement(lean).variables.length > 0 ? 'general' : 'own')
/** The requests: one OpenAlex search per general theorem, its sentence as the query, DOI-registered works only. */
export const planClaims = () => TEXTBOOK_THEOREMS.filter((t) => classifyClaim(t.lean) === 'general').map((t) => ({ id: t.key, url: `https://api.openalex.org/works?search=${encodeURIComponent(t.says.split(/[:;]/)[0]!)}&filter=has_doi:true&per-page=200`, accept: 'application/json' }))
export type Claim = { theorem: string; kind: 'general' | 'own'; status: 'own' | 'candidate' | 'unrecognised' | 'recognised' | 'unasked'; candidates: { doi: string; title: string; year: number; shared: number }[]; recognisedBy: { doi: string; by: string } | null }
/** The answers read: a work is a candidate when it has a DOI, appeared before the year of precedence and shares three distinctive words or more with the theorem's sentence, at least half of its title's (two words matched medical imaging to the fold mirror: measured); a recorded confirmation makes the theorem recognised. */
export const readClaims = (answers: readonly { id: string; status: number; text: string }[], confirmations: readonly { theorem: string; doi: string; by: string }[] = []): Claim[] => TEXTBOOK_THEOREMS.map((t) => {
  const kind = classifyClaim(t.lean)
  if (kind === 'own') return { theorem: t.key, kind, status: 'own', candidates: [], recognisedBy: null }
  const a = answers.find((x) => x.id === t.key)
  if (!a || a.status !== 200) return { theorem: t.key, kind, status: 'unasked', candidates: [], recognisedBy: null }
  let j: { results?: { doi?: string; title?: string; publication_year?: number }[] } = {}
  try { j = JSON.parse(a.text) } catch { j = {} }
  const mine = words(t.says)
  const candidates = (j.results ?? []).filter((w) => w.doi && w.title && (w.publication_year ?? PRECEDENCE_YEAR) < PRECEDENCE_YEAR).map((w) => ({ doi: w.doi!.replace(/^https:\/\/doi\.org\//, ''), title: w.title!, year: w.publication_year!, shared: [...words(w.title!)].filter((x) => mine.has(x)).length })).filter((w) => w.shared >= 3 && w.shared * 2 >= words(w.title).size).sort((x, y) => y.shared - x.shared || x.year - y.year)
  const confirmed = confirmations.find((c) => c.theorem === t.key)
  return { theorem: t.key, kind, status: confirmed ? 'recognised' : candidates.length ? 'candidate' : 'unrecognised', candidates, recognisedBy: confirmed ? { doi: confirmed.doi, by: confirmed.by } : null }
})
