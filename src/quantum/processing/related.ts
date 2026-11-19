// Posts, pages, products and variants are verified against their DOIs. Every link is asked online.
// A DOI's answer is parsed for related publications, and each one is a lead that is developed at once.
// The handler does not fetch.

import { LICENSE } from './unit/license.ts'
import { createVerifyRequests, type VerifyRequest } from './verifiers.ts'

const COLLECTIONS = ['posts', 'pages', 'products', 'variants'] as const
type Collection = (typeof COLLECTIONS)[number]
type Develop = (input: { formula: string; product: string; variant: string; title: string }) => { iso?: { formula?: string; documented?: boolean } }

const isObj = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value)
const cleanDoi = (value: unknown): string => {
  if (typeof value !== 'string') return ''
  const text = value.trim().replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, '').replace(/[.,;)]+$/g, '')
  return /^10\.\d{4,9}\/\S+$/.test(text) ? text.replace(/[.,;)]+$/g, '') : ''
}
const textsOf = (value: unknown, out: string[] = []): string[] => {
  if (typeof value === 'string') out.push(value)
  else if (Array.isArray(value)) for (const item of value) textsOf(item, out)
  else if (isObj(value)) for (const item of Object.values(value)) textsOf(item, out)
  return out
}
const doisIn = (text: string) => [...text.matchAll(/10\.\d{4,9}\/[^\s<>"')\]]+/g)].map((match) => cleanDoi(match[0])).filter((doi) => doi.length > 0)
const linksIn = (text: string) => [...text.matchAll(/https?:\/\/[^\s<>"')\]]+/g)].map((match) => match[0].replace(/[.,;)]+$/g, '')).filter((url) => url.length > 0 && !/doi\.org\/10\.\d{4,9}\//i.test(url))

const citesUrl = (doi: string) => `https://api.openalex.org/works?filter=cites:${encodeURIComponent(`https://doi.org/${doi}`)}&per-page=25`

type Work = { doi: string; relation: string; title: string; year: number | null; creators: string[] }

const pushWork = (works: Work[], doi: unknown, relation: string, title: string, year: unknown, creators: string[]) => {
  const clean = cleanDoi(doi)
  if (!clean) return
  works.push({ doi: clean, relation: relation || 'related', title: title.trim(), year: typeof year === 'number' ? year : null, creators: creators.filter((name) => name.length > 0) })
}

/** Related publications named in one answer: DataCite related identifiers, Crossref references, Zenodo related identifiers, OpenAlex works. */
const worksIn = (text: string): Work[] => {
  let body: unknown
  try { body = JSON.parse(text) } catch { return doisIn(text).map((doi) => ({ doi, relation: 'mentioned', title: '', year: null, creators: [] })) }
  const works: Work[] = []
  const root = isObj(body) ? body : {}
  const attributes = isObj(root.data) && isObj(root.data.attributes) ? root.data.attributes : {}
  for (const item of Array.isArray(attributes.relatedIdentifiers) ? attributes.relatedIdentifiers : []) {
    if (!isObj(item) || String(item.relatedIdentifierType ?? 'DOI').toUpperCase() !== 'DOI') continue
    pushWork(works, item.relatedIdentifier, String(item.relationType ?? 'related'), '', null, [])
  }
  const message = isObj(root.message) ? root.message : {}
  for (const item of Array.isArray(message.reference) ? message.reference : []) {
    if (!isObj(item)) continue
    pushWork(works, item.DOI, 'references', String(item['article-title'] ?? item.unstructured ?? ''), item.year, typeof item.author === 'string' ? [item.author] : [])
  }
  const metadata = isObj(root.metadata) ? root.metadata : {}
  for (const item of Array.isArray(metadata.related_identifiers) ? metadata.related_identifiers : []) {
    if (!isObj(item) || String(item.scheme ?? 'doi').toLowerCase() !== 'doi') continue
    pushWork(works, item.identifier, String(item.relation ?? 'related'), '', null, [])
  }
  const results = Array.isArray(root.results) ? root.results : []
  for (const item of results) {
    if (!isObj(item)) continue
    const creators = Array.isArray(item.authorships) ? item.authorships.flatMap((author) => (isObj(author) && isObj(author.author) && typeof author.author.display_name === 'string' ? [author.author.display_name] : [])) : []
    pushWork(works, item.doi, 'cites', typeof item.title === 'string' ? item.title : '', item.publication_year, creators)
  }
  return works
}

const holds = (check: string, body: string) => body.length > 0 && (!check.includes(LICENSE.author) || (body.includes(LICENSE.author) && body.includes(LICENSE.orcid)))

/** Each instance of posts, pages, products and variants, verified against its DOI, its links asked online, the related publications developed. */
export const relatedWork = (raw: unknown, develop: Develop) => {
  const given = isObj(raw) ? raw : {}
  const rows = (Array.isArray(raw) ? raw : Array.isArray(given.instances) ? given.instances : []).flatMap((item) => {
    if (!isObj(item) || typeof item.collection !== 'string' || !(COLLECTIONS as readonly string[]).includes(item.collection)) return []
    const text = textsOf(item).join('\n')
    const doi = cleanDoi(item.doi) || doisIn(text)[0] || ''
    return [{ collection: item.collection as Collection, id: typeof item.id === 'string' ? item.id : '', title: typeof item.title === 'string' ? item.title.trim() : '', doi, text }]
  })
  const answers = isObj(given.answers) ? given.answers : {}
  const body = (url: string) => (typeof answers[url] === 'string' ? answers[url] : '')
  const dois = [...new Set(rows.map((row) => row.doi).filter((doi) => doi.length > 0))]
  const verify = dois.flatMap((doi) => createVerifyRequests({ kind: 'doi', value: doi }))
  const related = dois.map((doi) => ({ id: `openalex-cites:${doi}`, method: 'GET' as const, url: citesUrl(doi), accept: 'application/json', check: 'works that cite the DOI, each with its title, year and creators' }))
  const pages = [...new Set(rows.flatMap((row) => linksIn(row.text)))]
  const links = pages.map((url) => ({ id: `link:${url}`, method: 'GET' as const, url, accept: 'text/html', check: 'the page is reachable' }))
  const requests = [...verify, ...related, ...links]
  const seen = new Set<string>()
  const unique = requests.filter((request) => (seen.has(request.url) ? false : (seen.add(request.url), true)))
  const doiRequests = (doi: string): VerifyRequest[] => createVerifyRequests({ kind: 'doi', value: doi })
  const instances = rows.map((row) => {
    const asked = row.doi ? doiRequests(row.doi) : []
    const verified = row.doi !== '' && asked.length > 0 && asked.every((request) => holds(request.check, body(request.url))) && (row.title === '' || asked.some((request) => body(request.url).includes(row.title)))
    return { collection: row.collection, id: row.id, title: row.title, doi: row.doi || null, verified, requests: asked.length }
  })
  const linkRows = pages.map((url) => ({ url, verified: body(url).length > 0 }))
  const found: Work[] = []
  for (const request of unique) for (const work of worksIn(body(request.url))) if (!dois.includes(work.doi) && !found.some((item) => item.doi === work.doi)) found.push(work)
  const leads = found.map((work) => {
    const host = rows.find((row) => row.doi.length > 0) ?? rows[0]
    const collection = host?.collection ?? 'pages'
    const detail = [work.relation, `doi:${work.doi}`, work.title, work.year === null ? '' : String(work.year), work.creators.join(', ')].filter((part) => part.length > 0).join('. ')
    const citation = { standards: ['ISO 690', 'ISO 26324'] as const, source: 'doi' as const, elements: { identifier: work.doi, creator: work.creators.join(', ') || null, title: work.title || null, date: work.year }, holds: work.title.length > 0 && work.creators.length > 0 && work.year !== null }
    const variant = work.doi.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()
    const run = { tool: 'payload' as const, arguments: { develop: { formula: detail, product: collection, variant, title: work.title || work.doi } } }
    const developed = develop(run.arguments.develop)
    return { id: `related-${variant}`, source: `https://doi.org/${work.doi}`, statement: detail, status: 'open' as const, tool: 'payload' as const, reason: 'a related publication parsed from the DOI, developed at once', citation, run, developed }
  })
  const documented = leads.filter((lead) => lead.developed.iso?.documented === true).length
  const upgrade = { via: 'doi' as const, collections: COLLECTIONS, instances: instances.length, verified: instances.filter((instance) => instance.verified).length, links: linkRows.length, linksVerified: linkRows.filter((link) => link.verified).length, leads: leads.length, developed: documented }
  return { phase: 'related' as const, fetched: false as const, collections: COLLECTIONS, instances, links: linkRows, requests: unique, leads, upgrade, says: `${upgrade.instances} instance(s) of posts, pages, products and variants, ${upgrade.verified} verified against a DOI, ${upgrade.links} link(s) asked online, ${upgrade.leads} related publication(s) parsed into leads and developed: the website is upgraded by those leads` }
}
