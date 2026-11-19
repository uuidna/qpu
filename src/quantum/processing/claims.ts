// The textbook's claims measured against what is published: a theorem with variables states a general law, and the works DOI-registered
// before the tree's own record of precedence (2026) that resemble it are its candidates; a closed count of this tree is its own, which no
// prior publication can state. A search finds resemblance, never the same claim: "recognised" is set only by a confirmation recorded in the
// docket (a reader who read the work), "unrecognised" when no candidate is found. Pure: the client asks OpenAlex and hands the answers back.
import { TEXTBOOK_THEOREMS } from './textbook-theorems.ts'
import { getStatement } from './expressions.ts'
import { LICENSE, PRECEDENCE } from './unit/license.ts'
import { createVerifyRequests } from './verifiers.ts'

const PRECEDENCE_YEAR = 2026
const words = (s: string) => new Set(s.toLowerCase().match(/[a-z]{4,}/g) ?? [])
const classifyClaim = (lean: string): 'general' | 'own' => (getStatement(lean).variables.length > 0 ? 'general' : 'own')
/** The requests: one OpenAlex search per general theorem, its sentence as the query, DOI-registered works only. */
export const planClaims = () => TEXTBOOK_THEOREMS.filter((t) => classifyClaim(t.lean) === 'general').map((t) => ({ id: t.key, url: `https://api.openalex.org/works?search=${encodeURIComponent(t.says.split(/[:;]/)[0]!)}&filter=has_doi:true&per-page=200`, accept: 'application/json' }))
export type Claim = { theorem: string; kind: 'general' | 'own'; status: 'own' | 'candidate' | 'unrecognised' | 'recognised' | 'unasked'; candidates: { doi: string; title: string; year: number; shared: number }[]; recognisedBy: { doi: string; by: string } | null }
/** The answers read: a work is a candidate when it has a DOI, appeared before the year of precedence and shares three distinctive words or more with the theorem's sentence, at least half of its title's (two words matched medical imaging to the fold mirror: measured); a recorded confirmation makes the theorem recognised. */
export const listClaims = (answers: readonly { id: string; status: number; text: string }[], confirmations: readonly { theorem: string; doi: string; by: string }[] = []): Claim[] => TEXTBOOK_THEOREMS.map((t) => {
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

const cleanDoi = (value: string) => value.trim().replace(/^https?:\/\/(?:dx\.)?doi\.org\//, '')
/** Novelty under ISO 690 and ISO 26324. An earlier DOI-registered work that resembles the claim is prior art and is cited. None, and the author's DOI naming the author, makes the claim the author's. Nothing is fetched. */
export const claimNovelty = (raw: unknown) => {
  const given = raw && typeof raw === 'object' ? raw as { statement?: unknown; doi?: unknown; answers?: unknown; items?: unknown } : {}
  const items = Array.isArray(given.items) ? given.items : [given]
  const author = { name: LICENSE.author, orcid: LICENSE.orcid }
  const rows = items.map((item) => {
    const one = item && typeof item === 'object' ? item as { statement?: unknown; doi?: unknown; answers?: unknown } : {}
    const statement = typeof one.statement === 'string' ? one.statement.trim() : ''
    const named = typeof one.doi === 'string' ? cleanDoi(one.doi) : ''
    const record = PRECEDENCE.find((entry) => entry.doi === named) ?? null
    const doi = record?.doi ?? ''
    const year = record?.year ?? null
    const verify = doi ? createVerifyRequests({ kind: 'doi', value: doi }) : []
    const search = statement ? { id: 'openalex-novelty' as const, method: 'GET' as const, url: `https://api.openalex.org/works?search=${encodeURIComponent(statement)}&filter=has_doi:true&per-page=25`, accept: 'application/json' as const, check: 'DOI-registered works that resemble the claim, dated against the author\'s record' } : null
    const answers = one.answers && typeof one.answers === 'object' ? one.answers as Record<string, unknown> : {}
    const text = (url: string) => (typeof answers[url] === 'string' ? answers[url] : '')
    const verified = doi !== '' && verify.length > 0 && verify.every((request) => { const body = text(request.url); return body.length > 0 && (!request.check.includes(LICENSE.author) || (body.includes(LICENSE.author) && body.includes(LICENSE.orcid))) })
    const searched = search ? text(search.url) : ''
    let results: { doi?: string; title?: string; publication_year?: number; authorships?: { author?: { display_name?: string } }[] }[] = []
    if (searched) { try { results = (JSON.parse(searched) as { results?: typeof results }).results ?? [] } catch { results = [] } }
    const mine = words(statement)
    const prior = results.flatMap((work) => {
      if (!work.doi || !work.title || year === null) return []
      const workDoi = cleanDoi(work.doi)
      if (!workDoi || workDoi === doi || (work.publication_year ?? year) >= year) return []
      const shared = [...words(work.title)].filter((word) => mine.has(word)).length
      if (shared < 3 || shared * 2 < words(work.title).size) return []
      const creator = work.authorships?.find((entry) => entry.author?.display_name)?.author?.display_name ?? null
      return [{ doi: workDoi, title: work.title, year: work.publication_year ?? null, shared, citation: { standards: ['ISO 690', 'ISO 26324'] as const, source: 'doi' as const, elements: { identifier: workDoi, creator, title: work.title, date: work.publication_year ?? null }, holds: Boolean(creator && work.title && work.publication_year) } }]
    })
    const known = verified && searched.length > 0
    const novel = known ? prior.length === 0 : null
    const claimed = novel ? { author: author.name, orcid: author.orcid, doi, statement } : null
    return { statement, doi: doi || null, year, verified, novel, claimed, prior, requests: [...verify, ...(search ? [search] : [])] }
  })
  const claimed = rows.flatMap((row) => (row.claimed ? [row.claimed] : []))
  return { phase: 'novelty' as const, standards: ['ISO 690', 'ISO 26324'] as const, source: 'doi' as const, fetched: false as const, author, rows, claimed, says: `${rows.length} claim(s) read against the DOI ecosystem: ${claimed.length} novel and claimed for ${author.name}, ${rows.filter((row) => row.novel === false).length} cited as earlier work` }
}
