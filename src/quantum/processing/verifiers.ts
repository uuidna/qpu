// Every verifiable fact names the free public sources that can check it, as requests the client's own MCP performs.
// This handler does no I/O: it emits the URL, the method, and what to compare, so a fact is verified across every
// adaptor that can see it, never by this tree's own say-so.

import type { Lead } from './leads.ts'
import { LICENSE, PRECEDENCE } from './unit/license.ts'
import { TABLES } from './tables-index.ts'

type FactKind = 'integer' | 'factors' | 'repository' | 'page' | 'preprint' | 'doi' | 'constant' | 'dataset' | 'sequence'
export type Fact = { kind: FactKind; value: string; detail?: Record<string, string | number>; lead?: string }
export type VerifyRequest = { verifier: string; url: string; method: 'GET' | 'POST'; body?: unknown; accept: string; check: string; via: string }
export type Verifier = { id: string; name: string; kind: 'api' | 'page' | 'mcp'; free: true; docs: string; /** the machine-readable contract the host publishes (OpenAPI, index, OAI identify), read by the discover step */ contract?: string; verifies: readonly FactKind[]; /** narrows a kind to the facts this adaptor actually holds */ only?: (fact: Fact) => boolean; request: (fact: Fact) => { url: string; accept: string; check: string; method?: 'POST'; body?: unknown } }

const VIA = "the client's own MCP fetches it; this handler does no I/O"
/** A DOI's creators: the author's records include the author, any other DOI its metadata's own (textbook_authorship_tracked). */
const creditCreators = (doi: string) => PRECEDENCE.some((p) => p.doi === doi) ? `include ${LICENSE.author} (${LICENSE.orcid})` : 'are its metadata\'s own'

export const VERIFIERS: readonly Verifier[] = [
  { id: 'oeis', name: 'The On-Line Encyclopedia of Integer Sequences', kind: 'api', free: true, docs: 'https://oeis.org/wiki/JSON_Format,_Compressed_Files', verifies: ['integer', 'factors', 'sequence'],
    request: (f) => ({ url: `https://oeis.org/search?fmt=json&q=${encodeURIComponent(f.kind === 'sequence' ? `id:${f.value}` : f.value)}`, accept: 'application/json', check: f.kind === 'sequence' ? `the sequence ${f.value} exists and its name agrees with the lead: ${f.detail?.title ?? ''}` : f.kind === 'factors' ? `the integer ${f.value} appears in the results; A027746 (prime factorisation rows) lists ${f.detail?.factors ?? 'its factors'}` : `the integer ${f.value} appears in at least one sequence` }) },
  { id: 'github', name: 'GitHub REST API, quantumlib organization', kind: 'api', free: true, docs: 'https://docs.github.com/en/rest/repos/repos', contract: 'https://raw.githubusercontent.com/github/rest-api-description/main/descriptions/api.github.com/api.github.com.json', verifies: ['repository'],
    request: (f) => ({ url: `https://api.github.com/repos/quantumlib/${encodeURIComponent(f.value)}`, accept: 'application/vnd.github+json', check: `description and language equal the repositories tool's entry for ${f.value}${f.detail?.language ? ` (${f.detail.language})` : ''}` }) },
  { id: 'source-page', name: 'The statement\'s own source page', kind: 'page', free: true, docs: 'https://quantumai.google', verifies: ['page'],
    request: (f) => ({ url: f.value.startsWith('http') ? f.value : `https://${f.value}`, accept: 'text/html', check: f.detail?.statement ? `the page states: ${f.detail.statement}` : 'the page is reachable and states what the lead says' }) },
  { id: 'arxiv', name: 'arXiv API', kind: 'api', free: true, docs: 'https://info.arxiv.org/help/api/index.html', contract: 'https://export.arxiv.org/oai2?verb=Identify', verifies: ['preprint'],
    request: (f) => ({ url: `https://export.arxiv.org/api/query?id_list=${encodeURIComponent(f.value)}`, accept: 'application/atom+xml', check: `the entry's title and abstract match the statements tool's echoes_preprint topic` }) },
  { id: 'datacite', name: 'DataCite REST API', kind: 'api', free: true, docs: 'https://support.datacite.org/docs/api', contract: 'https://api.datacite.org/', verifies: ['doi'],
    request: (f) => ({ url: `https://api.datacite.org/dois/${encodeURIComponent(f.value)}`, accept: 'application/vnd.api+json', check: `the DOI resolves; data.attributes.creators ${creditCreators(f.value)}` }) },
  { id: 'zenodo', name: 'Zenodo REST API', kind: 'api', free: true, docs: 'https://developers.zenodo.org', contract: 'https://zenodo.org/api/', verifies: ['doi'], only: (f) => /^10\.5281\//.test(f.value),
    request: (f) => ({ url: `https://zenodo.org/api/records/${encodeURIComponent(f.value.replace(/^10\.5281\/zenodo\./, ''))}`, accept: 'application/json', check: `metadata.creators ${creditCreators(f.value)} and metadata.title matches` }) },
  { id: 'doi-org', name: 'The DOI resolver', kind: 'api', free: true, docs: 'https://www.doi.org/the-identifier/resources/factsheets/doi-resolution-documentation', verifies: ['doi'],
    request: (f) => ({ url: `https://doi.org/api/handles/${encodeURIComponent(f.value)}`, accept: 'application/json', check: 'the handle resolves to a URL (responseCode 1)' }) },
  { id: 'crossref', name: 'Crossref REST API', kind: 'api', free: true, docs: 'https://api.crossref.org/swagger-ui/index.html', contract: 'https://api.crossref.org/swagger-docs', verifies: ['doi'], only: (f) => !/^10\.(5281|7483)\//.test(f.value),
    request: (f) => ({ url: `https://api.crossref.org/works/${encodeURIComponent(f.value)}`, accept: 'application/json', check: `the DOI is registered at Crossref; message.author ${creditCreators(f.value)}` }) },
  { id: 'cern-opendata', name: 'CERN Open Data portal API', kind: 'api', free: true, docs: 'https://opendata.cern.ch/docs/cod-api', contract: 'https://opendata.cern.ch/api/records/?size=1', verifies: ['doi', 'dataset'], only: (f) => f.kind === 'dataset' || /^10\.7483\//.test(f.value),
    request: (f) => ({ url: f.kind === 'dataset' ? `https://opendata.cern.ch/api/records/${encodeURIComponent(f.value)}` : `https://opendata.cern.ch/api/records/?q=doi:%22${encodeURIComponent(f.value)}%22`, accept: 'application/json', check: 'the record exists and its title matches the reference' }) },
  { id: 'nist-codata', name: 'NIST CODATA fundamental physical constants', kind: 'api', free: true, docs: 'https://physics.nist.gov/cuu/Constants/', verifies: ['constant'],
    request: (f) => ({ url: `https://physics.nist.gov/cgi-bin/cuu/Value?${encodeURIComponent(f.value)}`, accept: 'text/html', check: `the CODATA value of ${f.value} agrees with Qpu.Physics to the precision the Lean file states` }) },
  { id: 'cloudflare-docs', name: 'Cloudflare documentation over MCP (docs.mcp.cloudflare.com)', kind: 'mcp', free: true, docs: 'https://developers.cloudflare.com/agents/model-context-protocol/mcp-servers-for-cloudflare/', contract: 'https://docs.mcp.cloudflare.com/mcp', verifies: ['page'], only: (f) => /developers\.cloudflare\.com/.test(f.value),
    request: (f) => ({ url: 'https://docs.mcp.cloudflare.com/mcp', method: 'POST', body: { jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'search_cloudflare_documentation', arguments: { query: new URL(f.value).pathname.split('/').filter(Boolean).join(' ').replace(/-/g, ' ') || 'cloudflare' } } }, accept: 'application/json, text/event-stream', check: `the documentation search answers results for ${new URL(f.value).pathname}` }) },
  { id: 'wikipedia', name: 'Wikipedia REST summary', kind: 'api', free: true, docs: 'https://en.wikipedia.org/api/rest_v1/', contract: 'https://en.wikipedia.org/api/rest_v1/?spec', verifies: ['integer', 'repository', 'preprint', 'sequence'],
    request: (f) => ({ url: `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(String(f.detail?.title ?? f.value))}`, accept: 'application/json', check: 'the summary agrees with the lead\'s statement' }) },
]

/** Every request every verifier can make for a fact: cross-verification across all adaptors that can see it. */
export const createVerifyRequests = (fact: Fact): VerifyRequest[] =>
  VERIFIERS.filter((v) => v.verifies.includes(fact.kind) && (v.only?.(fact) ?? true)).map((v) => ({ verifier: v.id, via: VIA, method: 'GET' as const, ...v.request(fact) }))

/** The facts a lead carries, read from its source and statement. */
export const extractFacts = (lead: Lead): Fact[] => {
  const facts: Fact[] = []
  const src = lead.source
  for (const m of src.matchAll(/\b(A\d{6})\b/g)) facts.push({ kind: 'sequence', value: m[1]!, detail: { title: (/wiki\/([A-Za-z_()]+)/.exec(src)?.[1] ?? 'Digital_root') }, lead: lead.id })
  const arxiv = /arxiv\s*(\d{4}\.\d{4,5})/i.exec(src)?.[1], doi = /10\.\d{4,9}\/\S+?(?=[).,;\]]*(\s|$))/.exec(src)?.[0]
  if (arxiv) facts.push({ kind: 'preprint', value: arxiv, lead: lead.id })
  else if (doi) facts.push({ kind: 'doi', value: doi, lead: lead.id })
  else if (/^repo-/.test(lead.id)) facts.push({ kind: 'repository', value: lead.id.replace(/^repo-/, ''), lead: lead.id })
  else if (/^[a-z0-9.-]+\.[a-z]{2,}(\/|$)/i.test(src) || src.startsWith('http')) facts.push({ kind: 'page', value: src.split(/[,;]/)[0]!.trim().split(/\s/)[0]!, detail: { statement: lead.statement }, lead: lead.id })
  for (const n of lead.statement.match(/\b\d{2,}\b/g) ?? []) facts.push({ kind: 'integer', value: n, lead: lead.id })
  return facts
}

/** Facts the tree itself carries beyond its leads: the physics constants Qpu.Physics names, and the DOIs its metadata cites. */
export const TREE_FACTS = TABLES.TREE_FACTS as readonly Fact[]
