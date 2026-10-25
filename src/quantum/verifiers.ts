// Every verifiable fact names the free public sources that can check it, as requests the client's own MCP performs.
// This handler does no I/O: it emits the URL, the method, and what to compare, so a fact is verified across every
// adaptor that can see it, never by this tree's own say-so.

import type { Lead } from './leads.js'

export type FactKind = 'integer' | 'factors' | 'repository' | 'page' | 'preprint' | 'doi' | 'constant' | 'dataset'
export type Fact = { kind: FactKind; value: string; detail?: Record<string, string | number>; lead?: string }
export type VerifyRequest = { verifier: string; url: string; method: 'GET'; accept: string; check: string; via: string }
export type Verifier = { id: string; name: string; kind: 'api' | 'page'; free: true; docs: string; /** the machine-readable contract the host publishes (OpenAPI, index, OAI identify), read by the discover step */ contract?: string; verifies: readonly FactKind[]; /** narrows a kind to the facts this adaptor actually holds */ only?: (fact: Fact) => boolean; requestOf: (fact: Fact) => { url: string; accept: string; check: string ; /** the machine-readable contract the host publishes (OpenAPI, index, OAI identify), read by the discover step */ contract?: string} }

export const VIA = "the client's own MCP fetches it; this handler does no I/O"

export const VERIFIERS: readonly Verifier[] = [
  { id: 'oeis', name: 'The On-Line Encyclopedia of Integer Sequences', kind: 'api', free: true, docs: 'https://oeis.org/wiki/JSON_Format,_Compressed_Files', verifies: ['integer', 'factors'],
    requestOf: (f) => ({ url: `https://oeis.org/search?fmt=json&q=${encodeURIComponent(f.value)}`, accept: 'application/json', check: f.kind === 'factors' ? `the integer ${f.value} appears in the results; A027746 (prime factorisation rows) lists ${f.detail?.factors ?? 'its factors'}` : `the integer ${f.value} appears in at least one sequence` }) },
  { id: 'github', name: 'GitHub REST API, quantumlib organization', kind: 'api', free: true, docs: 'https://docs.github.com/en/rest/repos/repos', contract: 'https://raw.githubusercontent.com/github/rest-api-description/main/descriptions/api.github.com/api.github.com.json', verifies: ['repository'],
    requestOf: (f) => ({ url: `https://api.github.com/repos/quantumlib/${encodeURIComponent(f.value)}`, accept: 'application/vnd.github+json', check: `description and language equal the repositories tool's entry for ${f.value}${f.detail?.language ? ` (${f.detail.language})` : ''}` }) },
  { id: 'source-page', name: 'The statement\'s own source page', kind: 'page', free: true, docs: 'https://quantumai.google', verifies: ['page'],
    requestOf: (f) => ({ url: f.value.startsWith('http') ? f.value : `https://${f.value}`, accept: 'text/html', check: f.detail?.statement ? `the page states: ${f.detail.statement}` : 'the page is reachable and states what the lead says' }) },
  { id: 'arxiv', name: 'arXiv API', kind: 'api', free: true, docs: 'https://info.arxiv.org/help/api/index.html', contract: 'https://export.arxiv.org/oai2?verb=Identify', verifies: ['preprint'],
    requestOf: (f) => ({ url: `https://export.arxiv.org/api/query?id_list=${encodeURIComponent(f.value)}`, accept: 'application/atom+xml', check: `the entry's title and abstract match the statements tool's echoes_preprint topic` }) },
  { id: 'datacite', name: 'DataCite REST API', kind: 'api', free: true, docs: 'https://support.datacite.org/docs/api', contract: 'https://api.datacite.org/', verifies: ['doi'],
    requestOf: (f) => ({ url: `https://api.datacite.org/dois/${encodeURIComponent(f.value)}`, accept: 'application/vnd.api+json', check: `the DOI resolves; creators name Rouschev, Tsvetan with ORCID 0009-0000-7312-9778` }) },
  { id: 'zenodo', name: 'Zenodo REST API', kind: 'api', free: true, docs: 'https://developers.zenodo.org', contract: 'https://zenodo.org/api/', verifies: ['doi'], only: (f) => /^10\.5281\//.test(f.value),
    requestOf: (f) => ({ url: `https://zenodo.org/api/records/${encodeURIComponent(f.value.replace(/^10\.5281\/zenodo\./, ''))}`, accept: 'application/json', check: `metadata.creators[0].name is Rouschev, Tsvetan and metadata.title matches` }) },
  { id: 'doi-org', name: 'The DOI resolver', kind: 'api', free: true, docs: 'https://www.doi.org/the-identifier/resources/factsheets/doi-resolution-documentation', verifies: ['doi'],
    requestOf: (f) => ({ url: `https://doi.org/api/handles/${encodeURIComponent(f.value)}`, accept: 'application/json', check: 'the handle resolves to a URL (responseCode 1)' }) },
  { id: 'crossref', name: 'Crossref REST API', kind: 'api', free: true, docs: 'https://api.crossref.org/swagger-ui/index.html', contract: 'https://api.crossref.org/swagger-docs', verifies: ['doi'], only: (f) => !/^10\.(5281|7483)\//.test(f.value),
    requestOf: (f) => ({ url: `https://api.crossref.org/works/${encodeURIComponent(f.value)}`, accept: 'application/json', check: 'the DOI is registered at Crossref' }) },
  { id: 'cern-opendata', name: 'CERN Open Data portal API', kind: 'api', free: true, docs: 'https://opendata.cern.ch/docs/cod-api', contract: 'https://opendata.cern.ch/api/records/?size=1', verifies: ['doi', 'dataset'], only: (f) => f.kind === 'dataset' || /^10\.7483\//.test(f.value),
    requestOf: (f) => ({ url: f.kind === 'dataset' ? `https://opendata.cern.ch/api/records/${encodeURIComponent(f.value)}` : `https://opendata.cern.ch/api/records/?q=doi:%22${encodeURIComponent(f.value)}%22`, accept: 'application/json', check: 'the record exists and its title matches the reference' }) },
  { id: 'nist-codata', name: 'NIST CODATA fundamental physical constants', kind: 'api', free: true, docs: 'https://physics.nist.gov/cuu/Constants/', verifies: ['constant'],
    requestOf: (f) => ({ url: `https://physics.nist.gov/cgi-bin/cuu/Value?${encodeURIComponent(f.value)}`, accept: 'text/html', check: `the CODATA value of ${f.value} agrees with Qpu.Physics to the precision the Lean file states` }) },
  { id: 'wikipedia', name: 'Wikipedia REST summary', kind: 'api', free: true, docs: 'https://en.wikipedia.org/api/rest_v1/', contract: 'https://en.wikipedia.org/api/rest_v1/?spec', verifies: ['integer', 'repository', 'preprint'],
    requestOf: (f) => ({ url: `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(String(f.detail?.title ?? f.value))}`, accept: 'application/json', check: 'the summary agrees with the lead\'s statement' }) },
]

/** Every request every verifier can make for a fact: cross-verification across all adaptors that can see it. */
export const verifyRequestsOf = (fact: Fact): VerifyRequest[] =>
  VERIFIERS.filter((v) => v.verifies.includes(fact.kind) && (v.only?.(fact) ?? true)).map((v) => ({ verifier: v.id, method: 'GET' as const, via: VIA, ...v.requestOf(fact) }))

/** The facts a lead carries, read from its source and statement. */
export const factsOf = (lead: Lead): Fact[] => {
  const facts: Fact[] = []
  const src = lead.source
  if (/arxiv\s*(\d{4}\.\d{4,5})/i.test(src)) facts.push({ kind: 'preprint', value: /arxiv\s*(\d{4}\.\d{4,5})/i.exec(src)![1]!, lead: lead.id })
  else if (/10\.\d{4,9}\/\S+/.test(src)) facts.push({ kind: 'doi', value: /10\.\d{4,9}\/\S+/.exec(src)![0]!, lead: lead.id })
  else if (/^repo-/.test(lead.id)) facts.push({ kind: 'repository', value: lead.id.replace(/^repo-/, ''), lead: lead.id })
  else if (/^[a-z0-9.-]+\.[a-z]{2,}(\/|$)/i.test(src) || src.startsWith('http')) facts.push({ kind: 'page', value: src.split(/[,;]/)[0]!.trim().split(/\s/)[0]!, detail: { statement: lead.statement }, lead: lead.id })
  for (const n of lead.statement.match(/\b\d{2,}\b/g) ?? []) facts.push({ kind: 'integer', value: n, lead: lead.id })
  return facts
}

/** Facts the tree itself carries beyond its leads: the physics constants Qpu.Physics names, and the DOIs its metadata cites. */
export const TREE_FACTS: readonly Fact[] = [
  { kind: 'constant', value: 'h', detail: { lean: 'Qpu.Physics.planck' } },
  { kind: 'constant', value: 'k', detail: { lean: 'Qpu.Physics.boltzmann' } },
  { kind: 'doi', value: '10.5281/zenodo.21781602', detail: { what: 'the author\'s Clay paper, cited by README and .zenodo.json' } },
  { kind: 'doi', value: '10.5281/zenodo.23156998', detail: { what: 'this software, release v1.0.1' } },
  { kind: 'doi', value: '10.5281/zenodo.22700098', detail: { what: 'this software, all versions' } },
  { kind: 'doi', value: '10.7483/OPENDATA.CMS.53FG.V2S9', detail: { what: 'CERN open data cited by .zenodo.json' } },
  { kind: 'doi', value: '10.7483/OPENDATA.CMS.RG9B.XJMD', detail: { what: 'CERN open data cited by .zenodo.json' } },
  { kind: 'doi', value: '10.7483/OPENDATA.CMS.I8HN.DF32', detail: { what: 'CERN open data cited by .zenodo.json' } },
  { kind: 'doi', value: '10.7483/OPENDATA.CMS.0LRL.BXG5', detail: { what: 'CERN open data cited by .zenodo.json' } },
]
