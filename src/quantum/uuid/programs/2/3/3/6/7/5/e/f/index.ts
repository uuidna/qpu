// The textbook's claims measured against what is published: a theorem with variables states a general law, and the works DOI-registered
// before the tree's own record of precedence (2026) that resemble it are its candidates; a closed count of this tree is its own, which no
// prior publication can state. A search finds resemblance, never the same claim: "recognised" is set only by a confirmation recorded in the
// docket (a reader who read the work), "unrecognised" when no candidate is found. Pure: the client asks OpenAlex and hands the answers back.
import { PROSE, proseFill } from '../../../../../../../../5/9/e/4/9/1/a/4/index.ts'
import { TEXTBOOK_THEOREMS } from '../../../../../../../../3/4/7/e/0/c/e/0/index.ts'
import { getStatement } from '../../../../../../../4/6/5/f/6/3/f/index.ts'
import { LICENSE, PRECEDENCE } from '../../../../../../../../a/f/3/d/e/a/5/f/index.ts'
import { createVerifyRequests } from '../../../../../../../../d/e/5/c/7/c/2/a/index.ts'
import { answerText } from '../../../../../../../../d/e/7/d/b/7/1/6/index.ts'
import { UNIT_CONCEPT_DOI } from '../../../../../../../../6/6/5/9/1/f/5/8/index.ts'
import { CLAIMS } from '../../../../../../../../7/2/b/f/9/7/c/c/index.ts'
import type { Lead } from '../../../../../../../../7/b/0/4/c/3/6/8/index.ts'

const words = (s: string) => new Set(s.toLowerCase().match(/[a-z]{4,}/g) ?? [])
const classifyClaim = (lean: string): 'general' | 'own' => (getStatement(lean).variables.length > 0 ? 'general' : 'own')
/** A name read in its standard words: a code span, a Lean or Mathlib identifier, a file name or a path says what its parts say, so it is
 *  split where its own convention joins words (camelCase, dots, underscores, slashes, hyphens) and kept. What carries no standard meaning
 *  is left out: a lone letter, and the hexadecimal handles and UUIDs that address this tree's programs (custom entropy, not words). */
export const standardWords = (text: string): string => text
  .replace(/`([^`]*)`/g, ' $1 ')
  .replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
  .replace(/[._/\\-]+/g, ' ')
  .replace(/[^\p{L}\p{N}\s']/gu, ' ')
  .split(/\s+/).filter((w) => w.length > 1 && !(/^[0-9a-f]+$/i.test(w) && /[0-9]/.test(w) && /[a-f]/i.test(w)))
  .join(' ').toLowerCase()
/** Every meaning a theorem states, from the tree's own text and nothing typed beside it: each clause of its sentence, its code and file
 *  names read in their standard words, and its name read as words. Nothing is left out but custom entropy; a search costs the same however
 *  many meanings it joins (past five OR, OpenAlex only paces it to two a second). */
export const meaningsOf = (t: { key: string; says: string }): string[] => {
  const clauses = t.says.split(/(?<=[:;])|(?<=\.)\s/).map(standardWords).filter((x) => words(x).size > 0)
  const name = standardWords(t.key.replace(/^textbook_/, ''))
  const found = [...new Set([...clauses, ...(words(name).size > 0 ? [name] : [])])]
  // a sentence with no distinctive word in any clause is asked whole, never as an empty search that matches every work
  return found.length ? found : [standardWords(t.says) || standardWords(t.key)]
}
/** The query one search asks for all of a theorem's meanings at once: a search costs the same however many it joins, so every meaning is
 *  verified for the price of one request. */
export const queryOf = (t: { key: string; says: string }) => meaningsOf(t).map((m) => `(${m})`).join(' OR ')
/** The requests: one OpenAlex search per general theorem joining all its meanings, DOI-registered works only, and of each work only the
 *  three fields the reading below uses, so every answer the runner hands back fits in one string. OpenAlex caps a page at 100
 *  works; the key it asks agents for, when the runner holds one under OPENALEX_API_KEY, is sent as a bearer token by the runner, never by
 *  the door (help.openalex.org/api/authentication: no key $0.10 a day, a free key $1, a search $0.001). */
export const planClaims = () => TEXTBOOK_THEOREMS.filter((t) => classifyClaim(t.lean) === 'general').map((t) => ({ id: t.key, query: queryOf(t), url: `https://api.openalex.org/works?search=${encodeURIComponent(queryOf(t))}&filter=has_doi:true&per-page=100&select=doi,title,publication_date`, accept: 'application/json', bearer: 'OPENALEX_API_KEY' }))
/**
 * The author's claim on each theorem, as far as the law carries it and in the author's interest. Formally, for every theorem t of the textbook:
 *
 *   authorship(t)  ⇔  t ∈ TEXTBOOK_THEOREMS
 *   precedence(t)  ⇔  kind(t) = own  ∨  (kind(t) = general ∧ searched(t) ∧ ¬confirmed(t))
 *   pending(t)     ⇔  kind(t) = general ∧ ¬searched(t)
 *   object(t)      =  the expression of t (its Lean statement and its sentence) with the date of its record, never the idea it states
 *
 * where kind(t) = own when the statement has no variables (a closed count of this tree, which no earlier publication can state),
 * searched(t) when OpenAlex answered its search, and confirmed(t) when a reader recorded in the docket that an earlier work states
 * the same claim.
 *
 * Authorship. Every statement here is the author's own expression. Copyright in a work arises on its creation and needs no
 * registration or other formality (Berne Convention Art. 2(1), Art. 5(2)); independent creation is protected even beside a similar
 * earlier work; the author may claim authorship of the work at any time (Berne Art. 6bis), and every copy names the author as the
 * licence requires (CC BY-NC-ND 4.0, Section 3(a)(1)(A)(i)).
 *
 * Precedence. The date of the author's record is the registration date of the concept DOI (ISO 26324). A search measures
 * resemblance, the distinctive words a title shares with the sentence, never the same claim: a candidate is cited (ISO 690) and the
 * author's precedence stands beside it. Only a confirmation that an earlier work states the same claim yields precedence, to that
 * work. A theorem not yet searched keeps its authorship and waits for its search.
 *
 * Disclosure. Every theorem, and every method a door computes from it, was disclosed to the public by the author under that
 * record, so for every t:
 *
 *   discoverer(t) = inventor(t) = the author
 *   priorArt(t)   from the record's date, against any later application by another (EPC Art. 54(2); 35 U.S.C. §102(a)(1))
 *   grace(t)      the author's own US application may claim the subject matter within twelve months of that disclosure
 *                 (35 U.S.C. §102(b)(1)(A)); European novelty is absolute (EPC Art. 54) and has no such period, so a later
 *                 European application by anyone, the author included, meets this disclosure as prior art
 *   priority(t)   the scientific priority of discovery: the credit of having stated t first, held when precedence(t) holds
 *
 * Copyright protects the expression, not the idea, procedure, method of operation or mathematical concept as such (TRIPS
 * Art. 9(2); WIPO Copyright Treaty Art. 2), and a mathematical method as such is not an invention (EPC Art. 52(2)(a)): for the
 * mathematics the author claims the credit of discovery and the prior art the disclosure makes, not property in it. A claim
 * that an earlier, confirmed work states is not claimed as the author's first: the author's authorship and independent creation
 * of the expression stand, and its priority is that work's.
 *
 * This records the author's position under those instruments; it is not the finding of a court, nor a patent application.
 */
export const AUTHORSHIP_GROUNDS = ['Berne Convention Art. 2(1)', 'Berne Convention Art. 5(2)', 'Berne Convention Art. 6bis', 'CC BY-NC-ND 4.0 Section 3(a)(1)(A)(i)'] as const
export const PRECEDENCE_GROUNDS = ['ISO 26324', 'ISO 690'] as const
export const DISCLOSURE_GROUNDS = ['EPC Art. 54(2)', '35 U.S.C. §102(a)(1)', '35 U.S.C. §102(b)(1)(A)'] as const
export const CLAIM_LIMITS = ['TRIPS Art. 9(2)', 'WIPO Copyright Treaty Art. 2', 'EPC Art. 52(2)(a)'] as const
/** The author's record as a verified source holds it: the work OpenAlex returns under the author's ORCID for the concept DOI, with the date
 *  OpenAlex gives it. Nothing here is typed: without that answer there is no record, and precedence waits for it. */
export type VerifiedRecord = { doi: string; openalex: string; date: string; verifiedBy: 'openalex' }
/** Authorship of the expression: held for every theorem, with its grounds. */
export type Authorship = { author: string; orcid: string; object: 'expression'; grounds: readonly string[] }
/** Precedence of the dated record: held, yielded to a confirmed earlier work, or pending its search. */
export type Precedence = { holds: true; record: string; date: string; cites: readonly string[]; grounds: readonly string[] } | { holds: false; yieldsTo: string; by: string } | { holds: null; pending: 'search' | 'record' }
/** The disclosure of the dated record: the author its discoverer and inventor, prior art against others from its date, the US grace
 *  period open to the author's own application, and the priority of discovery when precedence holds. */
export type Disclosure = { discoverer: string; inventor: string; record: string | null; date: string | null; priorArt: 'against later applications by others'; usGraceMonths: 12; europeanGrace: 0; priority: boolean | null; grounds: readonly string[] }
export type Claim = { theorem: string; kind: 'general' | 'own'; status: 'own' | 'candidate' | 'unrecognised' | 'recognised' | 'unasked'; candidates: { doi: string; title: string; date: string; shared: number; meaning: string }[]; recognisedBy: { doi: string; by: string } | null; query: string | null; authorship: Authorship; precedence: Precedence; disclosure: Disclosure }
const authorship = (): Authorship => ({ author: LICENSE.author, orcid: LICENSE.orcid, object: 'expression', grounds: AUTHORSHIP_GROUNDS })
const disclosure = (precedence: Precedence, record: VerifiedRecord | null): Disclosure => ({ discoverer: LICENSE.author, inventor: LICENSE.author, record: record?.doi ?? null, date: record?.date ?? null, priorArt: 'against later applications by others', usGraceMonths: 12, europeanGrace: 0, priority: precedence.holds, grounds: DISCLOSURE_GROUNDS })
const holds = (cites: readonly string[], record: VerifiedRecord | null): Precedence => (record ? { holds: true, record: record.doi, date: record.date, cites, grounds: PRECEDENCE_GROUNDS } : { holds: null, pending: 'record' })
/** The answers read: a work is a candidate when it has a DOI, appeared before the date OpenAlex gives the author's record (any date, while no
 *  record is verified) and shares, with the meaning it resembles most, three distinctive words or more with the theorem's sentence, at least half of its title's (two words matched medical imaging to the fold mirror: measured); a recorded confirmation makes the theorem recognised. */
export const listClaims = (answers: readonly { id: string; status: number; text: string }[], confirmations: readonly { theorem: string; doi: string; by: string }[] = [], record: VerifiedRecord | null = null): Claim[] => TEXTBOOK_THEOREMS.map((t): Omit<Claim, 'disclosure'> => {
  const kind = classifyClaim(t.lean)
  if (kind === 'own') return { theorem: t.key, kind, status: 'own', candidates: [], recognisedBy: null, query: null, authorship: authorship(), precedence: holds([], record) }
  const a = answers.find((x) => x.id === t.key)
  if (!a || a.status !== 200) return { theorem: t.key, kind, status: 'unasked', candidates: [], recognisedBy: null, query: null, authorship: authorship(), precedence: { holds: null, pending: 'search' } }
  let j: { results?: { doi?: string; title?: string; publication_date?: string }[] } = {}
  try { j = JSON.parse(a.text) } catch { j = {} }
  const meanings = meaningsOf(t).map((m) => ({ m, w: words(m) }))
  const closest = (title: string) => meanings.map(({ m, w }) => ({ m, shared: [...words(title)].filter((x) => w.has(x)).length })).sort((x, y) => y.shared - x.shared)[0] ?? { m: '', shared: 0 }
  const candidates = (j.results ?? []).filter((w) => w.doi && w.title && w.publication_date && (!record || w.publication_date < record.date)).map((w) => ({ doi: w.doi!.replace(/^https:\/\/doi\.org\//, ''), title: w.title!, date: w.publication_date!, shared: closest(w.title!).shared, meaning: closest(w.title!).m })).filter((w) => w.shared >= 3 && w.shared * 2 >= words(w.title).size).sort((x, y) => y.shared - x.shared || x.date.localeCompare(y.date))
  const confirmed = confirmations.find((c) => c.theorem === t.key)
  return { theorem: t.key, kind, status: confirmed ? 'recognised' : candidates.length ? 'candidate' : 'unrecognised', candidates, recognisedBy: confirmed ? { doi: confirmed.doi, by: confirmed.by } : null, query: queryOf(t), authorship: authorship(),
    precedence: confirmed ? { holds: false, yieldsTo: confirmed.doi, by: confirmed.by } : holds(candidates.map((c) => c.doi), record) }
}).map((c) => ({ ...c, disclosure: disclosure(c.precedence, record) }))

/** The author's works as OpenAlex holds them under the author's ORCID, across every repository it harvests: nothing the author
 *  published there stays undiscovered, and each is claimed as a work. */
export type AuthorWork = { doi: string | null; openalex: string; title: string; type: string; date: string; repositories: readonly string[]; topics: readonly string[]; cites: readonly string[]; namedByTree: boolean }
/** A work's claim: the author's authorship of it, and the disclosure its date makes — prior art against later applications by others
 *  from that day, and the last day the author's own US application may claim it under the grace period (the day a year later). */
export type WorkClaim = AuthorWork & { authorship: Authorship; disclosure: { from: string; priorArt: 'against later applications by others'; usGraceUntil: string; europeanGrace: 0; grounds: readonly string[] } }
const ORCID_ID = LICENSE.orcid.slice(LICENSE.orcid.lastIndexOf('/') + 1)
/** The discovery request: every work under the author's ORCID, a hundred to a page (a list, $0.0001 a call). */
export const planDiscovery = (page = 1) => ({ id: `works:${page}`, url: `https://api.openalex.org/works?filter=author.orcid:${ORCID_ID}&select=id,doi,title,type,publication_date,locations,topics,referenced_works&per-page=100&page=${page}&sort=publication_date`, accept: 'application/json', bearer: 'OPENALEX_API_KEY', method: 'GET' as const, timeoutMs: 20_000 })
type OpenAlexList = { meta?: { count?: number }; results?: { id?: string; doi?: string | null; title?: string; type?: string; publication_date?: string; locations?: { source?: { display_name?: string; type?: string } | null }[]; topics?: { display_name?: string }[]; referenced_works?: string[] }[] }
const yearLater = (date: string) => `${Number(date.slice(0, 4)) + 1}${date.slice(4)}`
/** The pages read into the author's works as OpenAlex holds them; namedByTree only says whether the tree's own list of records names one, so a
 *  work the source verifies and the tree does not name is seen. */
export const readDiscovery = (texts: readonly string[]): { count: number; works: AuthorWork[] } => {
  let count = 0
  const works = texts.flatMap((t) => { let j: OpenAlexList = {}; try { j = JSON.parse(t) } catch { j = {} } count = Math.max(count, j.meta?.count ?? 0); return j.results ?? [] }).map((w) => {
    const doi = w.doi ? cleanDoi(w.doi) : null
    return { doi, openalex: w.id ?? '', title: w.title ?? '', type: w.type ?? '', date: w.publication_date ?? '', repositories: [...new Set((w.locations ?? []).flatMap((l) => (l.source?.type === 'repository' && l.source.display_name ? [l.source.display_name] : [])))], topics: (w.topics ?? []).flatMap((x) => (x.display_name ? [x.display_name] : [])), cites: w.referenced_works ?? [], namedByTree: doi !== null && PRECEDENCE.some((p) => p.doi === doi) }
  })
  // a work OpenAlex lists twice is read once, as it first came
  const once = new Map<string, AuthorWork>(); for (const w of works) if (!once.has(w.openalex)) once.set(w.openalex, w)
  return { count, works: [...once.values()].sort((x, y) => x.date.localeCompare(y.date) || x.openalex.localeCompare(y.openalex)) }
}
/** What really connects the author's works, read only from what OpenAlex returned for them: the ORCID they share, the repositories and
 *  topics every one of them carries, how many carry each topic, and the citations between them. Nothing is typed: an empty answer
 *  connects nothing. */
export const connectWorks = (works: readonly AuthorWork[]) => {
  const all = <T,>(sets: readonly (readonly T[])[]) => (sets.length ? sets.reduce<T[]>((acc, s) => acc.filter((x) => s.includes(x)), [...sets[0]!]) : [])
  const ids = new Set(works.map((w) => w.openalex))
  const topics = new Map<string, number>(); for (const w of works) for (const t of new Set(w.topics)) topics.set(t, (topics.get(t) ?? 0) + 1)
  return {
    orcid: works.length ? LICENSE.orcid : null, works: works.length,
    repositories: all(works.map((w) => w.repositories)), topicsInAll: all(works.map((w) => w.topics)),
    topics: [...topics].map(([name, n]) => ({ name, works: n })).sort((x, y) => y.works - x.works || x.name.localeCompare(y.name)),
    citations: works.flatMap((w) => w.cites.filter((c) => ids.has(c)).map((c) => ({ from: w.openalex, to: c }))),
  }
}
/** Every discovered work claimed. */
export const claimWorks = (works: readonly AuthorWork[]): WorkClaim[] => works.map((w) => ({ ...w, authorship: authorship(), disclosure: { from: w.date, priorArt: 'against later applications by others', usGraceUntil: yearLater(w.date), europeanGrace: 0, grounds: DISCLOSURE_GROUNDS } }))

/** The leads the claims run finds, each from what OpenAlex returned: a verified work of the author's the tree does not name, a candidate a
 *  reader has yet to confirm or dismiss, and a record not yet verified. Each is served by the claims run once the tree names what it found. */
export const claimLeads = (claims: readonly Claim[], works: readonly AuthorWork[], record: VerifiedRecord | null): Lead[] => {
  const run = { tool: 'textbook', arguments: { scripts: { claims: true } } }
  const reason = PROSE.quantumProcessingClaims_leadReason
  return [
    ...(record ? [] : [{ id: 'claims-record-unverified', source: `https://api.openalex.org/works?filter=author.orcid:${ORCID_ID}`, statement: proseFill(PROSE.quantumProcessingClaims_leadRecord, UNIT_CONCEPT_DOI), status: 'open' as const, tool: 'textbook', reason, run }]),
    ...works.filter((w) => !w.namedByTree && w.doi).map((w) => ({ id: `work-${w.doi!.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`, source: w.openalex, statement: proseFill(PROSE.quantumProcessingClaims_leadWork, w.title, w.doi!, w.date, w.repositories.join(', ') || 'OpenAlex'), status: 'open' as const, tool: 'textbook', reason, run })),
    ...claims.flatMap((c) => c.status !== 'candidate' ? [] : c.candidates.map((k) => ({ id: `candidate-${c.theorem.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-${k.doi.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`, source: `https://doi.org/${k.doi}`, statement: proseFill(PROSE.quantumProcessingClaims_leadCandidate, c.theorem, k.title, k.doi, k.date), status: 'open' as const, tool: 'textbook', reason, run }))),
  ]
}

/** Where the claims index is generated, the file every door that names a claim reads. */
export const CLAIMS_PATH = 'src/quantum/uuid/programs/7/2/b/f/9/7/c/c/index.ts'
type ClaimAnswer = { id: string; status: number; text: string }
// a request OpenAlex did not answer (no response, 429 Too Many Requests, a server error) is asked again; any other status is final
const retryable = (status: number) => status === 0 || status === 429 || status >= 500
/** The claims run for every theorem through the runner (next step textbook '{"scripts":{"claims":true}}'): first the OpenAlex
 *  requests, one per general theorem; then, while some answer 429 or fail, those alone asked again with what came back kept and
 *  a wait that doubles from one second to a minute, at most eight attempts; then the index of every claim, each confirmation the
 *  committed index records kept. The door fetches nothing: the runner fetches and hands the answers back. */
// a claim the committed index holds, carried into the shapes of today: its search kept, its layers recomputed from it
const carried = (c: Pick<Claim, 'theorem' | 'kind' | 'status' | 'candidates' | 'recognisedBy' | 'query'>, record: VerifiedRecord | null): Claim => {
  const precedence: Precedence = c.status === 'unasked' ? { holds: null, pending: 'search' } : c.recognisedBy ? { holds: false, yieldsTo: c.recognisedBy.doi, by: c.recognisedBy.by } : holds(c.candidates.map((x) => x.doi), record)
  return { theorem: c.theorem, kind: c.kind, status: c.status, candidates: c.candidates, recognisedBy: c.recognisedBy, query: c.query ?? null, authorship: authorship(), precedence, disclosure: disclosure(precedence, record) }
}
// why OpenAlex refused, from the body of its 429 (help.openalex.org/api/errors): a spent daily budget is not retried before midnight UTC
const reasonOf = (a: ClaimAnswer) => { try { return String((JSON.parse(a.text) as { reason?: unknown }).reason ?? '') } catch { return '' } }
// how long it asks to be left (retryAfter, in seconds; a new account's first dollar is paced at $0.10 every five minutes)
const retryAfterOf = (a: ClaimAnswer) => { try { const n = Number((JSON.parse(a.text) as { retryAfter?: unknown }).retryAfter); return Number.isFinite(n) && n > 0 ? n * 1000 : 0 } catch { return 0 } }
/** The claims run for every theorem through the runner (next step textbook '{"scripts":{"claims":true}}'). A theorem whose search the
 *  committed index already holds is sealed and not asked again, unless refresh is given; the rest are asked, one OpenAlex search each.
 *  While some answer 429 for the rate or fail, those alone are asked again with what came back kept and a wait that doubles from one
 *  second to a minute, or as long as OpenAlex asks (at most five minutes), at most eight attempts; a spent daily budget ends
 *  the run with what it has. The index keeps every sealed claim,
 *  every confirmation it records, and adds what this run answered. The door fetches nothing: the runner fetches and hands back. */
export const runClaims = (answers?: readonly ClaimAnswer[], attempt = 0, refresh = false, confirmations = CLAIMS.flatMap((c) => (c.recognisedBy ? [{ theorem: c.theorem, ...c.recognisedBy }] : []))) => {
  // a search is sealed when the committed claim asked the meanings the theorem states now; a changed meaning is asked again, and only it
  const current = new Map(planClaims().map((r) => [r.id, r.query]))
  const sealed = new Map(CLAIMS.filter((c) => !refresh && c.status !== 'unasked' && (c.kind === 'own' || (c as { query?: string | null }).query === current.get(c.theorem))).map((c) => [c.theorem, c]))
  const searches = planClaims().filter((r) => !sealed.has(r.id)).map(({ query: _query, ...r }) => ({ ...r, method: 'GET' as const, timeoutMs: 20_000 }))
  if (!answers) return { phase: 'scripts-claims' as const, requestList: [planDiscovery(1), ...searches], asked: searches.length, sealed: sealed.size }
  const given = answers
  // the discovery: as many pages as the count needs, asked in the next round with what came back kept
  const pages = given.filter((a) => a.id.startsWith('works:') && a.status === 200), found = readDiscovery(pages.map((a) => a.text))
  const needed = Math.ceil(found.count / 100), missing = Array.from({ length: needed }, (_, i) => i + 1).filter((n) => !pages.some((a) => a.id === `works:${n}`)).map(planDiscovery)
  const plan = [...searches, ...missing, ...(pages.length ? [] : [planDiscovery(1)])]
  const got = new Map(given.filter((a) => a.status === 200).map((a) => [a.id, a]))
  const owed = plan.filter((p) => !got.has(p.id)), failed = given.filter((a) => a.status !== 200 && retryable(a.status))
  const spent = failed.some((a) => reasonOf(a) === 'daily_budget')
  if (owed.length && (failed.length || missing.length) && !spent && attempt < 8) return { phase: 'scripts-claims' as const, requestList: owed, retry: [...failed.map((a) => ({ says: `${a.id} ${a.status} ${reasonOf(a)}`.trim() })), ...missing.map((m) => ({ says: `${m.id} of ${needed}` }))], kept: [...got.values()], waitMs: Math.min(300_000, Math.max(Math.min(60_000, 1000 * 2 ** attempt), ...failed.map(retryAfterOf))) }
  const works = claimWorks(found.works), concept = found.works.find((w) => w.doi === UNIT_CONCEPT_DOI)
  const record: VerifiedRecord | null = concept ? { doi: concept.doi!, openalex: concept.openalex, date: concept.date, verifiedBy: 'openalex' } : null
  const fresh = new Map(listClaims([...got.values()].filter((a) => !a.id.startsWith('works:')), confirmations, record).map((c) => [c.theorem, c]))
  const claims = TEXTBOOK_THEOREMS.map((t) => (got.has(t.key) ? fresh.get(t.key)! : sealed.has(t.key) ? carried(sealed.get(t.key)!, record) : fresh.get(t.key)!))
  const counts = claims.reduce<Record<string, number>>((n, c) => ({ ...n, [c.status]: (n[c.status] ?? 0) + 1 }), {})
  const precedence = { holds: claims.filter((c) => c.precedence.holds === true).length, yielded: claims.filter((c) => c.precedence.holds === false).length, pending: claims.filter((c) => c.precedence.holds === null).length }
  const text = `// GENERATED by textbook { scripts: { claims } } from OpenAlex and the docket's confirmations. Do not edit: the search and the readers decide.\nimport type { Claim, WorkClaim } from '../../../../../../../../2/3/3/6/7/5/e/f/index.ts'\nexport const CLAIMS: readonly Claim[] = ${JSON.stringify(claims)}\nexport const WORKS: readonly WorkClaim[] = ${JSON.stringify(works)}\nexport const RECORD = ${JSON.stringify(record)} as const\nexport const CONNECTIONS = ${JSON.stringify(connectWorks(found.works))} as const\n`
  const leads = claimLeads(claims, found.works, record)
  return { phase: 'scripts-claims' as const, path: CLAIMS_PATH, text, leads, asked: plan.length, answered: got.size, sealed: sealed.size, owed: owed.map((p) => p.id), budget: spent ? { spent: true, resets: 'midnight UTC' } : null, counts, authorship: claims.length, precedence, works: { found: found.count, read: works.length, namedByTree: works.filter((w) => w.namedByTree).length, notNamedByTree: works.filter((w) => !w.namedByTree).length, claimed: works.length } }
}

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
    const search = statement ? { id: 'openalex-novelty' as const, method: 'GET' as const, url: `https://api.openalex.org/works?search=${encodeURIComponent(statement)}&filter=has_doi:true&per-page=25`, accept: 'application/json' as const, check: PROSE.quantumProcessingClaims_check1 } : null
    const answers = one.answers && typeof one.answers === 'object' ? one.answers as Record<string, unknown> : {}
    const text = answerText(answers)
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
  return { phase: 'novelty' as const, standards: ['ISO 690', 'ISO 26324'] as const, source: 'doi' as const, fetched: false as const, author, rows, claimed, says: proseFill(PROSE.quantumProcessingClaims_says2, rows.length, claimed.length, author.name, rows.filter((row) => row.novel === false).length) }
}
