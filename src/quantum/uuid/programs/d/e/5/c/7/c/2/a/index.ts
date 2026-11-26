// Every verifiable fact names the free public sources that can check it, as requests the client's own MCP performs.
// This handler does no I/O: it emits the URL, the method, and what to compare, so a fact is verified across every
// adaptor that can see it, never by this tree's own say-so.

import { PROSE, proseFill } from '../../../../../../../../5/9/e/4/9/1/a/4/index.ts'
import type { Lead } from '../../../../../../../../7/b/0/4/c/3/6/8/index.ts'
import { LICENSE, PRECEDENCE } from '../../../../../../../../a/f/3/d/e/a/5/f/index.ts'
import { TABLES } from '../../../../../../../../1/2/a/4/3/2/a/8/index.ts'

type FactKind = 'integer' | 'factors' | 'repository' | 'page' | 'preprint' | 'doi' | 'constant' | 'dataset' | 'sequence'
export type Fact = { kind: FactKind; value: string; detail?: Record<string, string | number>; lead?: string }
export type VerifyRequest = { verifier: string; url: string; method: 'GET' | 'POST'; body?: unknown; accept: string; check: string; via: string }
export type Verifier = { id: string; name: string; kind: 'api' | 'page' | 'mcp'; free: true; docs: string; /** the machine-readable contract the host publishes (OpenAPI, index, OAI identify), read by the discover step */ contract?: string; verifies: readonly FactKind[]; /** narrows a kind to the facts this adaptor actually holds */ only?: (fact: Fact) => boolean; request: (fact: Fact) => { url: string; accept: string; check: string; method?: 'POST'; body?: unknown } }

const VIA = PROSE.quantumProcessingVerifiers_s1
/** A DOI's creators: the author's records include the author, any other DOI its metadata's own (textbook_authorship_tracked). */
const creditCreators = (doi: string) => PRECEDENCE.some((p) => p.doi === doi) ? `include ${LICENSE.author} (${LICENSE.orcid})` : 'are its metadata\'s own'

export const VERIFIERS: readonly Verifier[] = [
  { id: 'oeis', name: PROSE.quantumProcessingVerifiers_name2, kind: 'api', free: true, docs: 'https://oeis.org/wiki/JSON_Format,_Compressed_Files', verifies: ['integer', 'factors', 'sequence'],
    request: (f) => ({ url: `https://oeis.org/search?fmt=json&q=${encodeURIComponent(f.kind === 'sequence' ? `id:${f.value}` : f.value)}`, accept: 'application/json', check: f.kind === 'sequence' ? proseFill(PROSE.quantumProcessingVerifiers_s3, f.value, f.detail?.title ?? '') : f.kind === 'factors' ? proseFill(PROSE.quantumProcessingVerifiers_s4, f.value, f.detail?.factors ?? 'its factors') : proseFill(PROSE.quantumProcessingVerifiers_s5, f.value) }) },
  { id: 'github', name: PROSE.quantumProcessingVerifiers_name6, kind: 'api', free: true, docs: 'https://docs.github.com/en/rest/repos/repos', contract: 'https://raw.githubusercontent.com/github/rest-api-description/main/descriptions/api.github.com/api.github.com.json', verifies: ['repository'],
    request: (f) => ({ url: `https://api.github.com/repos/quantumlib/${encodeURIComponent(f.value)}`, accept: 'application/vnd.github+json', check: proseFill(PROSE.quantumProcessingVerifiers_check7, f.value, f.detail?.language ? ` (${f.detail.language})` : '') }) },
  { id: 'source-page', name: PROSE.quantumProcessingVerifiers_name8, kind: 'page', free: true, docs: 'https://quantumai.google', verifies: ['page'],
    request: (f) => ({ url: f.value.startsWith('http') ? f.value : `https://${f.value}`, accept: 'text/html', check: f.detail?.statement ? `the page states: ${f.detail.statement}` : PROSE.quantumProcessingVerifiers_s9 }) },
  { id: 'arxiv', name: 'arXiv API', kind: 'api', free: true, docs: 'https://info.arxiv.org/help/api/index.html', contract: 'https://export.arxiv.org/oai2?verb=Identify', verifies: ['preprint'],
    request: (f) => ({ url: `https://export.arxiv.org/api/query?id_list=${encodeURIComponent(f.value)}`, accept: 'application/atom+xml', check: PROSE.quantumProcessingVerifiers_check10 }) },
  { id: 'datacite', name: 'DataCite REST API', kind: 'api', free: true, docs: 'https://support.datacite.org/docs/api', contract: 'https://api.datacite.org/', verifies: ['doi'],
    request: (f) => ({ url: `https://api.datacite.org/dois/${encodeURIComponent(f.value)}`, accept: 'application/vnd.api+json', check: proseFill(PROSE.quantumProcessingVerifiers_check11, creditCreators(f.value)) }) },
  { id: 'zenodo', name: 'Zenodo REST API', kind: 'api', free: true, docs: 'https://developers.zenodo.org', contract: 'https://zenodo.org/api/', verifies: ['doi'], only: (f) => /^10\.5281\//.test(f.value),
    request: (f) => ({ url: `https://zenodo.org/api/records/${encodeURIComponent(f.value.replace(/^10\.5281\/zenodo\./, ''))}`, accept: 'application/json', check: proseFill(PROSE.quantumProcessingVerifiers_check12, creditCreators(f.value)) }) },
  { id: 'doi-org', name: 'The DOI resolver', kind: 'api', free: true, docs: 'https://www.doi.org/the-identifier/resources/factsheets/doi-resolution-documentation', verifies: ['doi'],
    request: (f) => ({ url: `https://doi.org/api/handles/${encodeURIComponent(f.value)}`, accept: 'application/json', check: PROSE.quantumProcessingVerifiers_check13 }) },
  { id: 'crossref', name: 'Crossref REST API', kind: 'api', free: true, docs: 'https://api.crossref.org/swagger-ui/index.html', contract: 'https://api.crossref.org/swagger-docs', verifies: ['doi'], only: (f) => !/^10\.(5281|7483)\//.test(f.value),
    request: (f) => ({ url: `https://api.crossref.org/works/${encodeURIComponent(f.value)}`, accept: 'application/json', check: proseFill(PROSE.quantumProcessingVerifiers_check14, creditCreators(f.value)) }) },
  { id: 'cern-opendata', name: PROSE.quantumProcessingVerifiers_name15, kind: 'api', free: true, docs: 'https://opendata.cern.ch/docs/cod-search-tips', contract: 'https://opendata.cern.ch/api/records/?size=1', verifies: ['doi', 'dataset'], only: (f) => f.kind === 'dataset' || /^10\.7483\//.test(f.value),
    request: (f) => ({ url: f.kind === 'dataset' ? `https://opendata.cern.ch/api/records/${encodeURIComponent(f.value)}` : `https://opendata.cern.ch/api/records/?q=doi:%22${encodeURIComponent(f.value)}%22`, accept: 'application/json', check: PROSE.quantumProcessingVerifiers_check16 }) },
  { id: 'nist-codata', name: PROSE.quantumProcessingVerifiers_name17, kind: 'api', free: true, docs: 'https://physics.nist.gov/cuu/Constants/', verifies: ['constant'],
    request: (f) => ({ url: `https://physics.nist.gov/cgi-bin/cuu/Value?${encodeURIComponent(f.value)}`, accept: 'text/html', check: proseFill(PROSE.quantumProcessingVerifiers_check18, f.value) }) },
  { id: 'cloudflare-docs', name: PROSE.quantumProcessingVerifiers_name19, kind: 'mcp', free: true, docs: 'https://developers.cloudflare.com/agents/model-context-protocol/mcp-servers-for-cloudflare/', contract: 'https://docs.mcp.cloudflare.com/mcp', verifies: ['page'], only: (f) => /developers\.cloudflare\.com/.test(f.value),
    request: (f) => ({ url: 'https://docs.mcp.cloudflare.com/mcp', method: 'POST', body: { jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'search_cloudflare_documentation', arguments: { query: new URL(f.value).pathname.split('/').filter(Boolean).join(' ').replace(/-/g, ' ') || 'cloudflare' } } }, accept: PROSE.quantumProcessingVerifiers_accept20, check: proseFill(PROSE.quantumProcessingVerifiers_check21, new URL(f.value).pathname) }) },
  { id: 'wikipedia', name: 'Wikipedia REST summary', kind: 'api', free: true, docs: 'https://en.wikipedia.org/api/rest_v1/', contract: 'https://en.wikipedia.org/api/rest_v1/?spec', verifies: ['integer', 'repository', 'preprint', 'sequence'],
    request: (f) => ({ url: `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(String(f.detail?.title ?? f.value))}`, accept: 'application/json', check: PROSE.quantumProcessingVerifiers_check22 }) },
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

/** Facts the tree itself carries beyond its leads: the physics constants Qpu.Physics.EnergyGap names, and the DOIs its metadata cites. */
export const TREE_FACTS = TABLES.TREE_FACTS as readonly Fact[]
