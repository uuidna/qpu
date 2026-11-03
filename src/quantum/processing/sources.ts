// The immutable sources of leads, tracked by the leads tool (leads { sources }): what never changes once written (a DOI, an npm version and
// its integrity, a Software Heritage snapshot, a Wayback capture, an OpenAlex work) as precedence; the open web scanned for copies of the work
// under another name (npm, GitHub, Software Heritage), each a candidate with the case the court computes, never a verdict; the works whose
// titles neighbour the author's records, dated before or after them; every open textbook (OpenStax, the Open Textbook Library, Open Library's
// subjects, Project Gutenberg via Gutendex) routed through the theorems: the subjects a theorem reaches are the domain, a book of the domain no theorem reaches is a lead, the
// rest counted outside; and the MCP servers that serve books, proposed as doors. Public metadata only (titles, subjects, dates, licences), no
// text of any book, no credential, nothing written anywhere. Every page followed to its end (nextOf): unlimited, and the more the QPU is used
// the more it holds (textbook_use_completes). Pure: the client fetches what the plan names and hands the answers back.
import { uuidOf } from './unit/blocks.ts'
import { summonCourt } from './toolboxes/legal.ts'
import { PRECEDENCE } from './unit/license.ts'
import { routeStatement } from './match.ts'
import type { Example } from './examples.ts'
import type { Lead } from './leads.ts'
import { TABLES } from './tables-index.ts'

type SourceKind = 'immutable' | 'licence' | 'precedence' | 'textbook' | 'mcp'
export type SourceRequest = { id: string; source: string; kind: SourceKind; method: 'GET'; url: string; accept: string; page?: number }
export type SourceAnswer = { id: string; url: string; status: number; text: string }
export type SourceContext = { repository: string; owner: string; package: string; hosts: readonly string[]; subjects?: readonly string[]; maintainers?: readonly string[] }

export const SOURCES = TABLES.SOURCES as readonly { id: string; kind: SourceKind; name: string; immutable: string; url: string }[]
/** the subjects Open Library is asked for: the fields the QPU's theorems compute in */
const SUBJECTS = TABLES.SUBJECTS
const MCP_TERMS = ['book', 'textbook', 'library', 'scholar', 'paper', 'doi', 'arxiv', 'patent', 'citation'] as const

const accept = 'application/json'
const req = (source: string, kind: SourceKind, id: string, url: string, page?: number): SourceRequest => ({ id: `${source}:${id}${page === undefined ? '' : `:${page}`}`, source, kind, method: 'GET', url, accept, ...(page === undefined ? {} : { page }) })

/** the first page of every source; the rest are followed by nextOf until each source ends */
export const planSources = (c: SourceContext): SourceRequest[] => {
  const repo = c.repository.replace(/\.git$/, '').replace(/^https:\/\/github\.com\//, '')
  const terms = [...new Set([c.owner, c.package.replace(/^@/, '').replace('/', ' '), repo.split('/')[1] ?? ''].filter(Boolean))]
  return [
    req('npm-package', 'immutable', c.package, `https://registry.npmjs.org/${c.package.replace('/', '%2f')}`),
    req('swh-visits', 'immutable', repo, `https://archive.softwareheritage.org/api/1/origin/${c.repository.replace(/\.git$/, '')}/visits/?per_page=1000`),
    ...c.hosts.map((h) => req('wayback', 'immutable', h, `https://archive.org/wayback/available?url=${encodeURIComponent(h)}`)),
    ...PRECEDENCE.map((p) => req('datacite', 'immutable', p.doi, `https://api.datacite.org/dois/${p.doi}`)),
    ...PRECEDENCE.filter((p) => /zenodo\.\d+$/.test(p.doi)).map((p) => req('zenodo-record', 'immutable', p.doi, `https://zenodo.org/api/records/${p.doi.split('zenodo.')[1]}`)),
    ...PRECEDENCE.map((p) => req('openalex-work', 'precedence', p.doi, `https://api.openalex.org/works/doi:${p.doi}`)),
    ...PRECEDENCE.map((p) => req('openalex-near', 'precedence', p.doi, `https://api.openalex.org/works?search=${encodeURIComponent(p.title)}&per-page=200&page=1`, 1)),
    ...terms.map((t) => req('npm-search', 'licence', t, `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(t)}&size=250&from=0`, 0)),
    ...terms.map((t) => req('github-search', 'licence', t, `https://api.github.com/search/repositories?q=${encodeURIComponent(t)}&per_page=100&page=1`, 1)),
    req('github-forks', 'licence', repo, `https://api.github.com/repos/${repo}/forks?per_page=100&page=1`, 1),
    ...terms.map((t) => req('swh-search', 'licence', t, `https://archive.softwareheritage.org/api/1/origin/search/${encodeURIComponent(t)}/?limit=1000`)),
    req('openstax', 'textbook', 'books', 'https://openstax.org/apps/cms/api/v2/pages/?type=books.Book&fields=title,book_state,book_subjects&limit=500&offset=0', 0),
    req('open-textbook-library', 'textbook', 'books', 'https://open.umn.edu/opentextbooks/textbooks.json?page=1', 1),
    ...(c.subjects ?? SUBJECTS).map((s) => req('open-library-subject', 'textbook', s, `https://openlibrary.org/subjects/${s}.json?limit=1000&offset=0`, 0)),
    req('gutendex', 'textbook', 'books', 'https://gutendex.com/books/?page=1', 1),
    ...MCP_TERMS.map((t) => req('mcp-registry', 'mcp', t, `https://registry.modelcontextprotocol.io/v0/servers?search=${encodeURIComponent(t)}&limit=100`)),
  ]
}

const json = (t: string): any => { try { return JSON.parse(t) } catch { return null } }

/** the next page of an answer, from what the source itself says (a next link, a cursor, a count); null when the source has ended */
export const nextOf = (r: SourceRequest, a: SourceAnswer): SourceRequest | null => {
  if (a.status !== 200) return null
  const j = json(a.text); if (!j) return null
  const base = r.id.slice(0, r.id.lastIndexOf(':')), page = r.page ?? 0
  switch (r.source) {
    case 'open-textbook-library': return j.links?.next ? { ...r, id: `${base}:${page + 1}`, url: j.links.next, page: page + 1 } : null
    case 'openstax': { const n = (j.items ?? []).length; return n && page + n < (j.meta?.total_count ?? 0) ? { ...r, id: `${base}:${page + n}`, url: r.url.replace(/offset=\d+/, `offset=${page + n}`), page: page + n } : null }
    case 'open-library-subject': { const n = (j.works ?? []).length; return n && page + n < (j.work_count ?? 0) ? { ...r, id: `${base}:${page + n}`, url: r.url.replace(/offset=\d+/, `offset=${page + n}`), page: page + n } : null }
    case 'gutendex': return j.next ? { ...r, id: `${base}:${page + 1}`, url: j.next, page: page + 1 } : null
    case 'openalex-near': { const per = j.meta?.per_page ?? 200; return page * per < (j.meta?.count ?? 0) && (j.results ?? []).length === per ? { ...r, id: `${base}:${page + 1}`, url: r.url.replace(/page=\d+/, `page=${page + 1}`), page: page + 1 } : null }
    case 'npm-search': { const n = (j.objects ?? []).length; return n && page + n < (j.total ?? 0) ? { ...r, id: `${base}:${page + n}`, url: r.url.replace(/from=\d+/, `from=${page + n}`), page: page + n } : null }
    case 'github-search': return (j.items ?? []).length === 100 && page * 100 < (j.total_count ?? 0) ? { ...r, id: `${base}:${page + 1}`, url: r.url.replace(/page=\d+/, `page=${page + 1}`), page: page + 1 } : null
    case 'github-forks': return Array.isArray(j) && j.length === 100 ? { ...r, id: `${base}:${page + 1}`, url: r.url.replace(/page=\d+/, `page=${page + 1}`), page: page + 1 } : null
    case 'mcp-registry': return j.metadata?.nextCursor ? { ...r, id: `${r.id}+`, url: `${r.url.replace(/&cursor=[^&]*/, '')}&cursor=${encodeURIComponent(j.metadata.nextCursor)}` } : null
    default: return null
  }
}

type Book = { source: string; id: string; title: string; subjects: string[]; licence: string | null; year: number | null }

/** the answers judged: immutable facts, licence candidates with their cases, precedence by date, textbooks routed by the theorems, MCP doors */
export const listSources = (c: SourceContext, answers: readonly SourceAnswer[], examples: readonly Example[]) => {
  const by = (source: string) => answers.filter((a) => a.id.startsWith(`${source}:`))
  const ok = (a: SourceAnswer) => a.status === 200 ? json(a.text) : null
  const repo = c.repository.replace(/\.git$/, '').replace(/^https:\/\/github\.com\//, '')
  const owner = repo.split('/')[0]!.toLowerCase()
  const author = new Set([owner, ...(c.maintainers ?? []).map((m) => m.toLowerCase())])
  // immutable
  const pkg = by('npm-package').map(ok).find(Boolean) as { versions?: Record<string, { dist?: { integrity?: string; tarball?: string } }>; time?: Record<string, string>; maintainers?: { name: string }[] } | undefined
  for (const m of pkg?.maintainers ?? []) author.add(m.name.toLowerCase())
  const versions = Object.entries(pkg?.versions ?? {}).map(([v, d]) => ({ version: v, integrity: d.dist?.integrity ?? null, tarball: d.dist?.tarball ?? null, published: pkg?.time?.[v] ?? null }))
  // the public artifacts with the digests their registries recorded: the client downloads each and computes the digest, seal { artifacts } compares
  const zenodo = by('zenodo-record').flatMap((a) => { const j = ok(a) as { doi?: string; files?: { key: string; size: number; checksum: string; links?: { self?: string } }[] } | null; return (j?.files ?? []).map((f) => ({ source: 'zenodo', name: `${j?.doi ?? a.id.split(':')[1]} ${f.key}`, url: f.links?.self ?? '', algorithm: f.checksum.split(':')[0]!, claimed: f.checksum.split(':')[1] ?? '', bytes: f.size })) })
  const artifacts = [...versions.filter((v) => v.tarball && v.integrity).map((v) => ({ source: 'npm', name: `${c.package}@${v.version}`, url: v.tarball!, algorithm: v.integrity!.split('-')[0]!, claimed: v.integrity!.slice(v.integrity!.indexOf('-') + 1), bytes: null as number | null })), ...zenodo.filter((z) => z.url)]
  const visits = by('swh-visits').flatMap((a) => (ok(a) ?? []) as { date: string; snapshot: string | null; status: string }[]).map((v) => ({ date: v.date, snapshot: v.snapshot ? `swh:1:snp:${v.snapshot}` : null, status: v.status }))
  const captures = by('wayback').map((a) => { const s = ok(a)?.archived_snapshots?.closest; return { host: a.id.split(':')[1]!, url: s?.url ?? null, timestamp: s?.timestamp ?? null, status: a.status } })
  const records = PRECEDENCE.map((p) => { const d = by('datacite').filter((a) => a.id === `datacite:${p.doi}`).map(ok).find(Boolean)?.data?.attributes; const w = by('openalex-work').filter((a) => a.id === `openalex-work:${p.doi}`).map(ok).find(Boolean); return { doi: p.doi, title: p.title, registered: d?.registered ?? null, versions: d?.versionCount ?? null, related: (d?.relatedIdentifiers ?? []).length, published: w?.publication_date ?? null, citedBy: w?.cited_by_count ?? null, reached: { datacite: !!d, openalex: !!w } } })
  // precedence: the neighbouring works dated against each record
  const precedence = PRECEDENCE.map((p) => {
    const own = records.find((r) => r.doi === p.doi)?.published ?? `${p.year}-01-01`
    const works = by('openalex-near').filter((a) => a.id.startsWith(`openalex-near:${p.doi}`)).flatMap((a) => (ok(a)?.results ?? []) as { id: string; doi: string | null; title: string; publication_date: string }[]).filter((w) => (w.doi ?? '').toLowerCase() !== `https://doi.org/${p.doi}`.toLowerCase())
    return { doi: p.doi, title: p.title, date: own, works: works.length, before: works.filter((w) => w.publication_date < own).length, after: works.filter((w) => w.publication_date >= own).length, earliest: works.map((w) => w.publication_date).sort()[0] ?? null, says: 'neighbours by title, dated: before is prior art to cite, after is a work that may build on the record; read, never a verdict' }
  })
  // licence: copies under another name, each a candidate with its case
  // the work is named by its owner or its package, never by a word others use too (a processor unit of VideoCore is a QPU as well)
  const pkgName = c.package.toLowerCase(), pkgBare = pkgName.replace(/^@/, '')
  const mentionsWork = (s: string) => { const t = s.toLowerCase(); return new RegExp(`\\b${owner}\\b`).test(t) || t.includes(pkgName) || t.includes(pkgBare) || t.includes(pkgBare.replace('/', '-')) }
  const candidates = [
    ...by('npm-search').flatMap((a) => (ok(a)?.objects ?? []) as { package: { name: string; description?: string; publisher?: { username?: string }; links?: { npm?: string } } }[]).filter((o) => !author.has((o.package.publisher?.username ?? '').toLowerCase()) && !o.package.name.startsWith(`@${owner}/`) && mentionsWork(`${o.package.name} ${o.package.description ?? ''}`)).map((o) => ({ where: 'npm', name: o.package.name, url: o.package.links?.npm ?? `https://www.npmjs.com/package/${o.package.name}`, why: 'a package that names the work, published by another account' })),
    ...by('github-search').flatMap((a) => (ok(a)?.items ?? []) as { full_name: string; html_url: string; owner: { login: string }; fork: boolean; description: string | null }[]).filter((i) => !author.has(i.owner.login.toLowerCase()) && !i.fork && mentionsWork(`${i.full_name} ${i.description ?? ''}`)).map((i) => ({ where: 'github', name: i.full_name, url: i.html_url, why: 'a repository that names the work under another account' })),
    ...by('github-forks').flatMap((a) => (ok(a) ?? []) as { full_name: string; html_url: string; created_at: string; pushed_at: string }[]).filter((f) => f.pushed_at > f.created_at).map((f) => ({ where: 'github-fork', name: f.full_name, url: f.html_url, why: 'a fork with its own pushes after the copy: a derivative to review against the no-derivatives term' })),
    ...by('swh-search').flatMap((a) => (ok(a) ?? []) as { url: string }[]).filter((o) => !new RegExp(`/${owner}(/|$)`, 'i').test(o.url) && mentionsWork(o.url)).map((o) => ({ where: 'software-heritage', name: o.url, url: o.url, why: 'an archived origin that names the work outside the author\'s accounts' })),
  ]
  const unique = [...new Map(candidates.map((x) => [x.url, x])).values()]
  const licence = unique.map((x) => ({ ...x, case: summonCourt({ gate: `licence scan ${x.where}`, rule: 'licence', evidence: { name: x.name, url: x.url, why: x.why }, tenant: owner }) }))
  // textbooks: every book routed by the theorems
  const books: Book[] = [
    ...by('openstax').flatMap((a) => (ok(a)?.items ?? []) as { id: number; title: string; book_state?: string; book_subjects?: { subject_name?: string }[] }[]).map((b) => ({ source: 'openstax', id: String(b.id), title: b.title, subjects: (b.book_subjects ?? []).map((s) => s.subject_name ?? '').filter(Boolean), licence: 'CC BY', year: null })),
    ...by('open-textbook-library').flatMap((a) => (ok(a)?.data ?? []) as { id: number; title: string; license?: string; copyright_year?: number; subjects?: { name: string }[] }[]).map((b) => ({ source: 'open-textbook-library', id: String(b.id), title: b.title, subjects: (b.subjects ?? []).map((s) => s.name), licence: b.license ?? null, year: b.copyright_year ?? null })),
    ...by('open-library-subject').flatMap((a) => (ok(a)?.works ?? []).map((w: { key: string; title: string; subject?: string[]; first_publish_year?: number }) => ({ source: 'open-library', id: w.key, title: w.title, subjects: [a.id.split(':')[1]!.replace(/_/g, ' '), ...(w.subject ?? []).slice(0, 12)], licence: null, year: w.first_publish_year ?? null })) as Book[]),
    // Project Gutenberg through Gutendex: public-domain books by subject (titles, subjects, licence only — never the text; Gutendex's own summaries and format links are left unread)
    ...by('gutendex').flatMap((a) => (ok(a)?.results ?? []) as { id: number; title: string; subjects?: string[]; copyright?: boolean | null }[]).map((b) => ({ source: 'gutendex', id: String(b.id), title: b.title, subjects: (b.subjects ?? []).flatMap((s) => s.split(' -- ')).map((s) => s.trim()).filter(Boolean), licence: b.copyright === false ? 'Public domain' : b.copyright === true ? 'In copyright' : null, year: null })),
  ]
  const uniqueBooks = [...new Map(books.map((b) => [`${b.source}:${b.id}`, b])).values()]
  // a book is reached when its best theorem shares two words or more with it: one word rare among the theorems can be common among books
  const routed = uniqueBooks.map((b) => ({ b, r: routeStatement(`${b.title} ${b.subjects.join(' ')}`, examples, 1) }))
  const strong = (x: { r: ReturnType<typeof routeStatement> }) => x.r.routed && (x.r.theorems[0]?.shared.length ?? 0) >= 2
  const domain = new Set(routed.filter(strong).flatMap((x) => x.b.subjects))
  const reached = routed.filter(strong), inDomain = routed.filter((x) => !strong(x) && x.b.subjects.some((s) => domain.has(s))), outside = routed.length - reached.length - inDomain.length
  const byTheorem: Record<string, number> = {}; for (const x of reached) { const k = x.r.theorems[0]!.theorem; byTheorem[k] = (byTheorem[k] ?? 0) + 1 }
  const textbookLeads: Lead[] = inDomain.map((x) => ({ id: `textbook-${x.b.source}-${x.b.id.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()}`, source: `${x.b.source} ${x.b.id}`, statement: `${x.b.title} (${x.b.subjects.slice(0, 3).join(', ')}${x.b.licence ? `; ${x.b.licence}` : ''}) teaches a subject the theorems reach, and no theorem reaches this book yet`, status: 'open' as const, reason: 'a book of the domain no theorem reaches: develop the theorem its subject names' }))
  // MCP doors
  const servers = by('mcp-registry').flatMap((a) => ((ok(a)?.servers ?? []) as { server: { name: string; description?: string; version?: string; remotes?: { type: string; url: string }[]; repository?: { url?: string } } }[]).map((s) => s.server))
  const doors = [...new Map(servers.map((s) => [s.name, { name: s.name, version: s.version ?? null, description: s.description ?? '', remote: s.remotes?.[0]?.url ?? null, repository: s.repository?.url ?? null }])).values()]
  const reachedCount = answers.filter((a) => a.status === 200).length
  const leads: Lead[] = [
    ...licence.map((x) => ({ id: `licence-${x.where}-${x.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`, source: x.url, statement: `${x.name} (${x.where}): ${x.why}; the case ${x.case.case} is the author's to file`, status: 'open' as const, reason: 'a candidate, never a verdict: the court computes the case, the author decides' } as Lead)),
    ...textbookLeads,
    ...answers.filter((a) => a.status !== 200).map((a) => ({ id: `source-unreached-${a.id.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`, source: a.url, statement: `the source ${a.id} answered ${a.status || 'nothing'}`, status: 'blocked' as const, reason: 'measured on the next run' } as Lead)),
  ]
  const summary = { requests: answers.length, reached: reachedCount, versions: versions.length, visits: visits.length, captures: captures.filter((x) => x.url).length, records: records.length, candidates: licence.length, books: uniqueBooks.length, routed: reached.length, domainLeads: inDomain.length, outside, doors: doors.length, leads: leads.length }
  return {
    phase: 'judged' as const, address: uuidOf(JSON.stringify(summary)), summary,
    immutable: { package: c.package, versions, visits, captures, records, artifacts },
    precedence, licence,
    textbooks: { books: uniqueBooks.length, routed: reached.length, domain: [...domain].sort(), inDomain: inDomain.length, outside, byTheorem, theorem: 'textbook_textbooks_partition' },
    mcp: { doors, says: 'servers that serve books, papers and libraries: proposed as doors of discovery, never called from the tree' },
    leads, theorems: ['textbook_use_completes', 'textbook_textbooks_partition', 'textbook_route_or_lead', 'textbook_cheap_gates'],
    says: `${summary.reached} of ${summary.requests} answers read: ${summary.versions} immutable versions, ${summary.visits} archived snapshots, ${summary.candidates} licence candidate(s) with their cases, ${summary.books} open books of which ${summary.routed} the theorems reach and ${summary.domainLeads} of their domain are leads; ${summary.doors} MCP doors proposed`,
  }
}
