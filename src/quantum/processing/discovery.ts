// Discovery before use, as a pure toolbox: the handler says what to fetch (the contracts of every host this tree talks to), the
// client fetches it, and the handler reads what came back into doors and capabilities. No I/O here; the client's own MCP
// fetches. An MCP host is asked for tools/list and, where it serves one, its catalogue door; an API host for the OpenAPI,
// index or identify document the verifiers registry names; both domains for /.well-known/qpu.json.
import type { Verifier } from './verifiers.ts'
import { ISO_OPEN_DATA, STANDARDS, detectStandard, verifyIsoOnline } from './standards.ts'
import { stem } from './match.ts'
import { KEY, keepMeasured } from './unit/theme.ts'
import { decodeImpossible, seededTrapdoor } from './algorithms.ts'
import { CODATA_URL, listConstants } from './unit/constants.ts'
import { TEXTBOOK_THEOREMS } from './textbook-theorems.ts'
import { THEOREM_KEYS } from './theorems-index.ts'
import { PRECEDENCE } from './unit/license.ts'

type Purpose = 'mcp-list' | 'mcp-call' | 'mcp-find' | 'catalogue' | 'contract' | 'well-known' | 'api-contract' | 'sitemap'
export type Request = { id: string; method: 'GET' | 'POST'; url: string; body?: unknown; purpose: Purpose; host: string; name?: string; headers?: Record<string, string>; server?: 'payload-rbac' }
export const CLOUDFLARE_DOCS_MCP = 'https://docs.mcp.cloudflare.com/mcp'
/** Cloudflare's MCP servers: the documentation server answers in the open; the rest answer 401 until a tenant brings its OAuth token. */
export const CLOUDFLARE_MCP = TABLES.CLOUDFLARE_MCP as readonly { host: string; url: string; about: string }[]
/** Google's own MCP servers, measured in the registry on 2026-10-26 (search google: 296 servers, 175 with remotes, these at <service>.googleapis.com/mcp):
 *  every one a token door (Google OAuth), each mapped to what it is for the Payload plugin — an adapter the environment names, a deploy target,
 *  a measure, a door the tenant opens; proposed and never called from the tree. */
const GOOGLE_MCP = TABLES.GOOGLE_MCP as readonly { host: string; url: string; about: string; maps: string }[]
/** Google Workspace's nine MCP servers (Gmail, Drive, Docs, Sheets, Slides, Calendar, Chat, People, Classroom): the institution's doors, each landing in the docket. */
import { WORKSPACE_MCP } from './institutions.ts'
import { TABLES } from './tables-index.ts'
export { WORKSPACE_MCP }
/** Google's MCP toolboxes in the registry (local servers): proposed, never called. */
/** Google reached by one door, the qpu-google-call job of the Payload app: a GOOGLE_HOST is called by that job alone, which reads the API's
 *  Discovery document keyless from the Discovery Service and exchanges the server's ADC refresh token at Google's token endpoint. */
export const GOOGLE_HOST = /(^|\.)(googleapis\.com|google\.com|google|google-analytics\.com|recaptcha\.net)$/
/** Google's endpoints outside Discovery the app calls, by name: each with the secret it takes as a query parameter, which the job adds from
 *  the variable the tenant's bindings name (one whose name holds `named`), never from the caller */
export const GOOGLE_ENDPOINTS = TABLES.GOOGLE_ENDPOINTS as unknown as Readonly<Record<string, { url: string; httpMethod: string; secret: { param: string; named: string } }>>
export const GOOGLE_DISCOVERY = { rest: 'https://www.googleapis.com/discovery/v1/apis/{api}/{version}/rest', token: 'https://oauth2.googleapis.com/token' } as const
/** Google's Discovery documents the workspace door reads, fetched by this door as contracts and kept in its cache: the preferred list (no Sites API in it), Forms v1, Docs v1, Drive v3 */
export const GOOGLE_DOCUMENTS = TABLES.GOOGLE_DOCUMENTS
/** A Drive file's address by id: /view to open it, /preview to embed it */
export const DRIVE_FILE_URL = 'https://drive.google.com/file/d/'
export const GOOGLE_MCPS = ['io.github.googleapis/genai-toolbox', 'io.github.googleapis/mcp-toolbox', 'io.github.GoogleCloudPlatform/gemini-cloud-assist-mcp'] as const
/** GitHub's hosted MCP server: answers 401 until a tenant brings its token (a fine-grained PAT or the OAuth flow); the read-only form beside it. */
const GITHUB_MCP: readonly { host: string; url: string; about: string }[] = [
  { host: 'api.githubcopilot.com', url: 'https://api.githubcopilot.com/mcp/', about: 'GitHub: repositories, branches, tags, releases, issues, pull requests, actions of the tenant\'s account' },
]
/** The Claude API (platform.claude.com/docs/en/api/overview, read 2026-10-25): one endpoint for messages, the MCP connector that mounts any MCP server into a request, the Models door; every door needs the tenant's key (x-api-key, anthropic-version). */
/** The Gemini API (ai.google.dev/api/generate-content and /gemini-api/docs/api-key, read 2026-10-27): POST generateContent with the key in the
 *  x-goog-api-key header, never in the URL and never in the tree (Google: "Never check API keys into source control"); the tenant's key opens it,
 *  the tree plans the request and never calls it unprompted. The model is the newest stable Flash on Google's models page. */
export const GEMINI_API = TABLES.GEMINI_API
export const CLAUDE_API = TABLES.CLAUDE_API
/** Every MCP this tree knows how to integrate, with what it does with each once the tenant's token opens it. */
export const KNOWN_MCP = TABLES.KNOWN_MCP as readonly { host: string; url: string; about: string; auth: 'none' | 'token'; maps: string }[]
/** The hosts discovered when a tenant names none: the unit, this tree, Cloudflare's eight servers and GitHub's. */
export const UNIT_MCP = 'https://uuidna.com/mcp', QPU_MCP = 'https://qpu.uuidna.com/api/mcp', DEFAULT_MCP_HOSTS: readonly string[] = [UNIT_MCP, QPU_MCP, ...CLOUDFLARE_MCP.map((c) => c.url), ...GITHUB_MCP.map((g) => g.url), ...GOOGLE_MCP.map((g) => g.url)]
/** Every MCP host this tree names, one row per URL. They are doors of the one Payload RBAC MCP, not separate servers. */
let hostList: { name: string; url: string }[] | undefined
export const mcpHostList = (): { name: string; url: string }[] => hostList ??= (() => {
  const rows = [
    ...DEFAULT_MCP_HOSTS.map((url) => ({ name: new URL(url).host, url })),
    ...KNOWN_MCP.map((row) => ({ name: row.host, url: row.url })),
    ...WORKSPACE_MCP.map((row) => ({ name: row.host, url: row.url })),
  ]
  const seen = new Set<string>()
  return rows.filter((row) => (seen.has(row.url) ? false : (seen.add(row.url), true)))
})()
/** The JSON of an MCP answer, whether the host answered JSON or an event stream (the data line that is JSON). */
export const getEventData = (text: string): string => (/^(event|data):/m.test(text) ? (text.split('\n').filter((l) => l.startsWith('data:')).map((l) => l.slice(5).trim()).find((l) => l.startsWith('{')) ?? text) : text)
export type Answer = Request & { status: number; type: string; text: string }
export type Door = { name: string; description: string; takes: string[]; required: string[]; answers: string[]; readOnly: boolean | null; contract: 'tools/list' | 'catalogue' }
type Host = { host: string; kind: 'mcp' | 'api' | 'well-known'; contract: string; status: number; detected: string; note: string; doors?: Door[]; paths?: string[] }
export type Discovery = { hosts: Host[]; doors: (Door & { host: string; url: string })[]; capabilities: { statementVerdict: string[]; signing: string[]; readiness: string[]; addressing: string[]; rbac: string[]; metaphysics: string[] }; leads: { id: string; source: string; statement: string; status: 'open'; reason: string }[]; sitemap: { index: string; sitemaps: Loc[]; urls: Loc[] }; lead: LeadDecode; upgrade: TextbookUpgrade }
// a sitemap read as sitemaps.org defines it: each <sitemap> of an index and each <url> of a urlset, its loc and its lastmod
type Loc = { loc: string; lastmod?: string }
const listLocs = (xml: string, tag: 'sitemap' | 'url'): Loc[] => [...xml.matchAll(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'g'))].map((m) => { const lastmod = /<lastmod>\s*([^<]+?)\s*<\/lastmod>/.exec(m[1]!)?.[1]; return { loc: /<loc>\s*([^<]+?)\s*<\/loc>/.exec(m[1]!)?.[1] ?? '', ...(lastmod ? { lastmod } : {}) } })
const SITEMAP = { host: 'quantumai.google', url: 'https://quantumai.google/sitemap.xml' }

/** What a client can fill from a theorem, a statement or a value, and what an answer may carry. */
export const TAKES = ['statement', 'claim', 'input', 'deposits', 'proof', 'key', 'theorems', 'message', 'q', 'query', 'text', 'value', 'sources', 'subject', 'token', 'tenant'] as const
const ANSWERS = ['verdict', 'receipt', 'deposited', 'sealed', 'signed', 'verified', 'proofRoot', 'ready', 'address', 'role'] as const

export const rpcBody = (method: string, params?: unknown) => ({ jsonrpc: '2.0', id: 1, method, params })
const requestId = (purpose: Purpose, host: string, name?: string) => `${purpose}:${host}${name ? `:${name}` : ''}`

const CERN_OPEN_DATA = 'https://opendata.cern.ch/api/records/?size=1'
const FIPS_PAGES = ['https://csrc.nist.gov/pubs/fips/180-4/upd1/final', 'https://csrc.nist.gov/pubs/fips/202/final', 'https://csrc.nist.gov/pubs/fips/203/final', 'https://csrc.nist.gov/pubs/fips/204/final', 'https://csrc.nist.gov/pubs/fips/205/final'] as const
/** The online research the 1000-bit decode leads. ISO Open Data, the CERN Open Data record, the NIST CODATA table, and the FIPS pages the textbook already names. */
export const leadResearch = (): Request[] => [
  { id: 'research:iso-open-data', method: 'GET', url: ISO_OPEN_DATA, purpose: 'api-contract', host: new URL(ISO_OPEN_DATA).host, name: 'iso-open-data' },
  { id: 'research:cern-opendata', method: 'GET', url: CERN_OPEN_DATA, purpose: 'api-contract', host: new URL(CERN_OPEN_DATA).host, name: 'cern-opendata' },
  { id: 'research:nist-codata', method: 'GET', url: CODATA_URL, purpose: 'api-contract', host: new URL(CODATA_URL).host, name: 'nist-codata' },
  ...FIPS_PAGES.map((url) => ({ id: `research:nist:${url}`, method: 'GET' as const, url, purpose: 'api-contract' as const, host: new URL(url).host, name: `nist:${url}` })),
]
type LeadDecode = { bits: number; seed: number; decoded: boolean; verified: boolean; route: 'witness' | null; searched: string; blind: string; advantage: boolean; theorems: readonly ['textbook_impossible_trapdoor', 'textbook_witness_gates_decode', 'textbook_advantage_unbounded', 'textbook_decode_not_search'] }
/** The seeded 1000-bit trapdoor, decoded by its witness in one reflection. The blind climb is not walked. The primes stay with the mint. */
export const leadDecode = (): LeadDecode => {
  const made = seededTrapdoor(1000, BigInt(KEY))
  const opened = decodeImpossible(made.N, made.witness)
  const advantage = opened.decoded && opened.verified && opened.route === 'witness' && opened.searched === 1n && made.p * made.q === made.N && made.bits === 1000 && made.blindReflections > opened.searched
  return { bits: made.bits, seed: KEY, decoded: opened.decoded, verified: opened.verified, route: opened.route, searched: opened.searched.toString(), blind: made.blindReflections.toString(), advantage, theorems: ['textbook_impossible_trapdoor', 'textbook_witness_gates_decode', 'textbook_advantage_unbounded', 'textbook_decode_not_search'] }
}
const wordsOf = (text: string) => new Set(text.toLowerCase().match(/[a-z]{4,}/g) ?? [])
const citedByPrecedence = (says: string) => {
  const mine = wordsOf(says)
  return PRECEDENCE.some((row) => [...wordsOf(`${row.title} ${row.states}`)].filter((word) => mine.has(word)).length >= 3)
}
const fipsId = (says: string) => /FIPS\s+\d+(?:-\d+)?/.exec(says)?.[0] ?? null
type TextbookUpgrade = { textbooks: number; kernel: number; opendata: { fetched: boolean; covered: number }; nist: { fetched: boolean; covered: number }; both: number; awaiting: number; uncovered: number; novelties: number; cited: number; advantage: boolean }
/** Every kernel textbook read against the Open Data and NIST answers the client brought. A source that was not read does not cover a theorem. A theorem the sources do not state stays uncovered. A theorem the precedence already states is cited. */
export const textbookUpgrade = (answers: readonly { name?: string; status?: number; text?: string }[] = []): TextbookUpgrade => {
  const lead = leadDecode()
  const textOf = (name: string) => answers.find((row) => row.name === name && row.status === 200 && typeof row.text === 'string' && row.text.length > 0)?.text ?? ''
  const isoText = textOf('iso-deliverables') || textOf('iso-open-data')
  const iso = isoText.includes('{') ? verifyIsoOnline({ status: 200, text: isoText }) : null
  const isoRefs = new Set((iso && iso.phase === 'verified' ? iso.rows : []).flatMap((row) => row.reference ? [row.reference, row.key] : []))
  const cernText = textOf('cern-opendata')
  const nistText = [textOf('nist-codata'), ...FIPS_PAGES.map((url) => textOf(`nist:${url}`))].filter((text) => text.length > 0).join('\n')
  const quantities = nistText.includes('Quantity') ? listConstants(nistText).constants.map((row) => row.quantity.toLowerCase()).filter((name) => name.length >= 8) : []
  const opendataFetched = isoRefs.size > 0 || cernText.length > 0
  const nistFetched = nistText.length > 0
  let kernel = 0, openCovered = 0, nistCovered = 0, both = 0, awaiting = 0, uncovered = 0, novelties = 0, cited = 0
  for (const book of TEXTBOOK_THEOREMS) {
    if (!THEOREM_KEYS.has(book.key)) continue
    kernel += 1
    const body = `${book.says}\n${book.lean}`
    const wantsOpen = /ISO\/IEC|ISO \d|opendata\.cern|Open Data/.test(body)
    const wantsNist = /\b(?:NIST|FIPS|CODATA)\b/.test(body)
    const fips = fipsId(book.says)
    const doi = /10\.7483\/[A-Z0-9.]+/.exec(body)?.[0] ?? ''
    const openHit = (isoRefs.size > 0 && [...isoRefs].some((ref) => ref.length > 0 && body.includes(ref))) || (doi.length > 0 && cernText.includes(doi))
    const nistHit = (fips !== null && nistText.includes(fips)) || (/\b(?:CODATA|Planck)\b/.test(book.says) && quantities.some((name) => book.says.toLowerCase().includes(name)))
    const covered = openHit || nistHit
    if (openHit) openCovered += 1
    if (nistHit) nistCovered += 1
    if (openHit && nistHit) both += 1
    if (!covered && ((wantsOpen && !opendataFetched) || (wantsNist && !nistFetched))) awaiting += 1
    else if (!covered) uncovered += 1
    if (citedByPrecedence(book.says)) cited += 1
    else if (!covered) novelties += 1
  }
  return { textbooks: TEXTBOOK_THEOREMS.length, kernel, opendata: { fetched: opendataFetched, covered: openCovered }, nist: { fetched: nistFetched, covered: nistCovered }, both, awaiting, uncovered, novelties, cited, advantage: lead.advantage }
}
/** The first wave: the 1000-bit research, then every host's contract address. */
export const createDiscoveryRequests = (mcpHosts: readonly string[], verifiers: readonly Verifier[], auth: Readonly<Record<string, string>> = {}): Request[] => {
  const out: Request[] = [...leadResearch()]
  for (const url of mcpHosts) {
    const host = new URL(url).host
    const headers = auth[host] ? { authorization: `Bearer ${auth[host]}` } : undefined
    const server = 'payload-rbac' as const
    out.push({ id: requestId('mcp-list', host), method: 'POST', url, body: rpcBody('tools/list'), purpose: 'mcp-list', host, headers, server })
    out.push({ id: requestId('catalogue', host), method: 'POST', url, body: rpcBody('tools/call', { name: 'list_tools', arguments: {} }), purpose: 'catalogue', host, headers, server })
    out.push({ id: requestId('well-known', host), method: 'GET', url: `https://${host}/.well-known/qpu.json`, purpose: 'well-known', host, server })
  }
  for (const [name, url] of [...verifiers.flatMap((v) => (v.contract ? [[v.id, v.contract]] : [])), ...STANDARDS.map((s) => [s.id, s.contract]), ...Object.entries(GOOGLE_DOCUMENTS).map(([k, u]) => [`google-${k}`, u])]) { const host = new URL(url!).host; out.push({ id: requestId('api-contract', host, name), method: 'GET', url: url!, purpose: 'api-contract', host, name }) }
  out.push({ id: requestId('sitemap', SITEMAP.host), method: 'GET', url: SITEMAP.url, purpose: 'sitemap', host: SITEMAP.host })
  return out
}

/** A JSON-RPC answer read: the result, or the error text. */
const getResult = (a: Answer): { result?: any; error?: string } => {
  if (a.status !== 200) return { error: a.status === 0 ? a.text : a.status === 401 ? 'HTTP 401: auth required' : `HTTP ${a.status}` }
  try {
    const j = JSON.parse(getEventData(a.text)) as { result?: { tools?: unknown[]; structuredContent?: unknown; content?: { text: string }[]; isError?: boolean }; error?: { message: string } }
    if (j.error) return { error: j.error.message }
    if (j.result?.isError) return { error: j.result.content?.[0]?.text ?? 'refused' }
    if (j.result?.tools) return { result: j.result }
    if (j.result?.structuredContent !== undefined) return { result: j.result.structuredContent }
    if (j.result?.content?.[0]) { try { return { result: JSON.parse(j.result.content[0].text) } } catch { return { result: j.result.content[0].text } } }
    return { result: j.result }
  } catch { return { error: `not JSON: ${a.text}` } }
}

/** A door's capability from its contract: the properties it takes (of the ones a client can fill) and the keys it answers. */
export const toDoor = (t: { name: string; description?: string; inputSchema?: { properties?: Record<string, unknown>; required?: string[] }; outputSchema?: { properties?: Record<string, unknown> }; annotations?: { readOnlyHint?: boolean } }, contract: Door['contract']): Door => {
  const props = Object.keys(t.inputSchema?.properties ?? {})
  const outKeys = Object.keys(t.outputSchema?.properties ?? {})
  const fromText = (/Returns \{([^}]*)\}/.exec(t.description ?? '')?.[1] ?? '').split(',').map((s) => s.trim()).filter(Boolean)
  const answers = [...new Set([...outKeys, ...fromText])].filter((k) => (ANSWERS as readonly string[]).includes(k))
  return { name: t.name, description: t.description ?? '', takes: props.filter((p) => (TAKES as readonly string[]).includes(p)), required: t.inputSchema?.required ?? [], answers, readOnly: t.annotations?.readOnlyHint ?? null, contract }
}

/** The second wave: the contract of every catalogue door that answers a verdict and is not in tools/list, not yet read. */
export const listFollowUps = (answers: readonly Answer[]): Request[] => {
  const done = new Set(answers.map((a) => a.id))
  const out: Request[] = []
  for (const a of answers.filter((x) => x.purpose === 'catalogue')) {
    const r = getResult(a); if (!r.result) continue
    const names = (Array.isArray(r.result) ? r.result : r.result.tools ?? []) as { name: string; description: string }[]
    const listed = new Set<string>((getResult(answers.find((x) => x.id === requestId('mcp-list', a.host)) ?? a).result?.tools ?? []).map((t: { name: string }) => t.name))
    for (const t of names) {
      if (listed.has(t.name) || !toDoor({ name: t.name, description: t.description }, 'catalogue').answers.length) continue
      const id = requestId('contract', a.host, t.name)
      if (!done.has(id)) out.push({ id, method: 'POST', url: a.url, body: rpcBody('tools/call', { name: 'list_tools', arguments: { name: t.name } }), purpose: 'contract', host: a.host, name: t.name, server: 'payload-rbac' })
    }
  }
  // every API Google's directory lists asked once for its own Discovery document, through the one Google door
  for (const a of answers.filter((x) => x.purpose === 'api-contract' && x.name === 'google-list' && x.status === 200)) {
    let items: { name?: string; version?: string; discoveryRestUrl?: string }[] = []; try { items = JSON.parse(a.text).items ?? [] } catch { /* not the directory's shape: nothing to follow */ }
    for (const it of items) { if (!it.name || !it.discoveryRestUrl || !URL.canParse(it.discoveryRestUrl)) continue; const host = new URL(it.discoveryRestUrl).host, name = `google-${it.name}-${it.version}`, id = requestId('api-contract', host, name); if (!done.has(id)) { done.add(id); out.push({ id, method: 'GET', url: it.discoveryRestUrl, purpose: 'api-contract', host, name }) } }
  }
  // every child an index names is asked once
  for (const a of answers.filter((x) => x.purpose === 'sitemap' && x.status === 200)) for (const s of listLocs(a.text, 'sitemap')) if (!done.has(requestId('sitemap', a.host, s.loc))) out.push({ id: requestId('sitemap', a.host, s.loc), method: 'GET', url: s.loc, purpose: 'sitemap', host: a.host, name: s.loc })
  // the ISO Open Data page names the JSONLines file; the dimensions stay unread until that file is the answer
  for (const a of answers.filter((x) => x.name === 'iso-open-data' && x.status === 200)) {
    const next = verifyIsoOnline({ status: a.status, text: a.text })
    if (next.phase === 'requests' && next.request.url !== a.url) {
      const id = 'research:iso-deliverables'
      if (!done.has(id)) out.push({ id, method: 'GET', url: next.request.url, purpose: 'api-contract', host: new URL(next.request.url).host, name: 'iso-deliverables' })
    }
  }
  return out
}

/** Which document a host answered with: an OpenAPI or Swagger file (and its paths), a JSON index, an OAI identify, a page, nothing. */
export const detect = (r: { status: number; type: string; text: string }): { detected: string; note: string; paths?: string[] } => {
  if (r.status === 0) return { detected: 'unreachable', note: r.text }
  if (r.status >= 400) return { detected: `HTTP ${r.status}`, note: 'no contract at this address' }
  const t = r.text.trim()
  const standard = detectStandard(t); if (standard) return standard
  try {
    const j = JSON.parse(t) as Record<string, unknown>
    if (j.openapi || j.swagger) { const paths = Object.keys((j.paths as object) ?? {}); return { detected: `openapi ${j.openapi ?? j.swagger}`, note: `${paths.length} paths, ${t.length.toLocaleString('en-US')} chars`, paths } }
    const schema = (j.data as { __schema?: { types?: unknown[] } } | undefined)?.__schema ?? (j as { __schema?: { types?: unknown[] } }).__schema
    if (schema) return { detected: 'graphql schema', note: `${schema.types?.length ?? 0} types (${t.length.toLocaleString('en-US')} chars)` }
    if (j.links || j.hits || j.tools) return { detected: 'json index', note: `${Object.keys(j).slice(0, 6).join(', ')} (${t.length.toLocaleString('en-US')} chars)` }
    return { detected: 'json', note: Object.keys(j).slice(0, 6).join(', ') }
  } catch { /* not json */ }
  if (/^openapi:\s*\d/m.test(t) || /^swagger:/m.test(t)) { const paths = (t.match(/^\s{2}(\/[^:\s]+):/gm) ?? []).map((l) => l.trim().replace(/:$/, '')); return { detected: 'openapi (yaml)', note: `${paths.length} paths, ${t.length.toLocaleString('en-US')} chars`, paths } }
  if (/<OAI-PMH|<Identify>/.test(t)) return { detected: 'oai-pmh identify', note: /<repositoryName>([^<]*)/.exec(t)?.[1] ?? 'identify' }
  if (/<html/i.test(t)) return { detected: 'html page', note: /<title>([^<]*)/i.exec(t)?.[1]?.trim() ?? 'a page: documentation for humans, no machine contract' }
  return { detected: r.type.split(';')[0] || 'unknown', note: `${t.length.toLocaleString('en-US')} chars` }
}

/** Everything that came back, read into hosts, doors, capabilities and leads. */
export const getDiscovery = (answers: readonly Answer[], verifiers: readonly Verifier[]): Discovery => {
  const hosts: Host[] = []
  const mcpHosts = [...new Set(answers.filter((a) => a.purpose === 'mcp-list').map((a) => a.host))]
  for (const host of mcpHosts) {
    const list = answers.find((a) => a.id === requestId('mcp-list', host))!
    const r = getResult(list)
    const wk = answers.find((a) => a.id === requestId('well-known', host))
    if (!r.result) { hosts.push({ host, kind: 'mcp', contract: list.url, status: list.status, detected: list.status === 401 ? 'auth required' : 'unreachable', note: list.status === 401 ? `${KNOWN_MCP.find((c) => c.host === host)?.about ?? 'an MCP host'}: answers 401 until the tenant brings its token; once open: ${KNOWN_MCP.find((c) => c.host === host)?.maps ?? 'its doors join the catalogue'}` : r.error ?? 'no answer', doors: [] }); if (wk) hosts.push({ host, kind: 'well-known', contract: wk.url, status: wk.status, ...detect(wk) }); continue }
    const doors: Door[] = (r.result.tools as Parameters<typeof toDoor>[0][]).map((t) => toDoor(t, 'tools/list'))
    let note = `${doors.length} tools in tools/list`
    const cat = answers.find((a) => a.id === requestId('catalogue', host))
    const cr = cat ? getResult(cat) : { error: 'not asked' }
    if (cr.result) {
      const names = (Array.isArray(cr.result) ? cr.result : cr.result.tools ?? []) as { name: string; description: string }[]
      const listed = new Set(doors.map((d) => d.name)); let read = 0
      for (const t of names) {
        if (listed.has(t.name)) continue
        const contract = answers.find((a) => a.id === requestId('contract', host, t.name))
        const c = contract ? getResult(contract) : null
        if (c?.result && typeof c.result === 'object') { doors.push(toDoor({ ...(c.result as object), name: t.name, description: t.description }, 'catalogue')); read += 1 }
        else doors.push({ ...toDoor({ name: t.name, description: t.description }, 'catalogue'), description: `${t.description}${c?.error ? ` (contract unread: ${c.error})` : ''}` })
      }
      note += `; ${names.length} in the catalogue door, ${read} contracts read`
    } else note += `; catalogue door: ${cr.error}`
    hosts.push({ host, kind: 'mcp', contract: list.url, status: 200, detected: 'mcp tools/list', note, doors })
    if (wk) hosts.push({ host, kind: 'well-known', contract: wk.url, status: wk.status, ...detect(wk) })
  }
  for (const st of STANDARDS) { const a = answers.find((x) => x.purpose === 'api-contract' && x.name === st.id); hosts.push(a ? { host: a.host, kind: 'api', contract: st.contract, status: a.status, ...detect(a) } : { host: new URL(st.contract).host, kind: 'api', contract: st.contract, status: 0, detected: 'not asked', note: `${st.name}: the client did not fetch this standard` }) }
  for (const v of verifiers) {
    if (!v.contract) { hosts.push({ host: new URL(v.docs).host, kind: 'api', contract: v.docs, status: 0, detected: 'no machine contract named', note: `${v.id}: the registry names documentation for humans only; a lead` }); continue }
    const a = answers.find((x) => x.purpose === 'api-contract' && x.name === v.id)
    hosts.push(a ? { host: a.host, kind: 'api', contract: v.contract, status: a.status, ...detect(a) } : { host: new URL(v.contract).host, kind: 'api', contract: v.contract, status: 0, detected: 'not asked', note: 'the client did not fetch this contract' })
  }
  const doors = hosts.flatMap((h) => (h.doors ?? []).map((d) => ({ host: h.host, url: h.contract, ...d })))
  const takesAny = (d: Door, ks: string[]) => d.takes.some((t) => ks.includes(t))
  const capabilities = {
    statementVerdict: doors.filter((d) => takesAny(d, ['statement', 'claim', 'input', 'deposits']) && d.answers.some((a) => ['verdict', 'deposited', 'sealed', 'verified', 'proofRoot'].includes(a)) && d.required.every((r) => (TAKES as readonly string[]).includes(r))).map((d) => d.name),
    signing: doors.filter((d) => d.answers.includes('signed')).map((d) => d.name),
    readiness: doors.filter((d) => d.answers.includes('ready')).map((d) => d.name),
    addressing: doors.filter((d) => d.takes.includes('value') && d.answers.includes('address')).map((d) => d.name),
    rbac: doors.filter((d) => d.takes.includes('token') && d.answers.includes('role')).map((d) => d.name),
    // the metaphysical doors: the vortex, its reflection, the units and the triad, the pentagram, the fibonacci cycle, the double torus, the involution — the arithmetic mod 9 that the tree reads from every UUID's tail
    metaphysics: doors.filter((d) => /vortex|pentagram|fibonacci|triad|torus|involution|units|digital_root|living_field|gravity|spin|coprime|crt|diamond|sequence/.test(d.name)).map((d) => d.name),
  }
  const leads = [
    ...hosts.filter((h) => h.kind === 'mcp' && h.detected === 'auth required').map((h) => ({ id: `mcp-auth-${h.host}`, source: h.contract, statement: `${h.host} answers 401 without a token: ${h.note}`, status: 'open' as const, reason: 'tenant configurable: the operator sets QPU_MCP_TOKEN_<HOST> for the tenant and discovery reads the host\'s doors on the next run; nothing is assumed about them' })),
    ...hosts.filter((h) => h.kind === 'api' && !/^openapi|json index|oai-pmh|json-ld|cldr|graphql/.test(h.detected)).map((h) => ({ id: `contract-${h.host}`, source: h.contract, statement: `${h.host} publishes no machine-readable contract at the address the registry names (${h.detected})`, status: 'open' as const, reason: 'the client is built from documentation read by a person; an OpenAPI or index document would let it be built from the host' })),
  ]
  const read = answers.filter((a) => a.purpose === 'sitemap' && a.status === 200)
  const lead = leadDecode()
  const upgrade = textbookUpgrade(answers)
  return { hosts, doors, capabilities, leads, sitemap: { index: SITEMAP.url, sitemaps: read.flatMap((a) => listLocs(a.text, 'sitemap')), urls: read.flatMap((a) => listLocs(a.text, 'url')) }, lead, upgrade }
}

/** The discovery page, from the discovery alone. */
export const getDiscoveryPage = (d: Discovery, date: string): string => ['---', 'title: Discovery', 'order: 46', '---', '', '# Discovery before use', '',
  `The 1000-bit trapdoor leads, seeded by ${d.lead.seed} and decoded by its witness in ${d.lead.searched} step. The blind climb is ${d.lead.blind} and is not walked. ${d.upgrade.kernel} kernel textbooks: ${d.upgrade.opendata.covered} stated by Open Data, ${d.upgrade.nist.covered} stated by NIST, ${d.upgrade.awaiting} still waiting on those sources, ${d.upgrade.uncovered} not stated by them, ${d.upgrade.novelties} not in the DOI precedence. Asked on ${date}.`, '',
  `Every host this tree talks to, asked for its contract on ${date} by \`npm run next\` through the \`discover\` tool: MCP hosts for tools/list and their catalogue door, API hosts for the OpenAPI, index or identify document the verifiers registry names, both domains for \`/.well-known/qpu.json\`. The client tools choose their doors from this table by capability, never from a name in code.`, '',
  '| Host | Kind | Contract | Status | Detected | Note |', '|---|---|---|---:|---|---|', ...d.hosts.map((h) => `| ${h.host} | ${h.kind} | ${h.contract} | ${h.status || '—'} | ${h.detected} | ${h.note.replace(/\|/g, '\\|')} |`), '',
  '## Capabilities found', '', `Statement → verdict: ${d.capabilities.statementVerdict.join(', ') || 'none'}. Signing: ${d.capabilities.signing.join(', ') || 'none'}. Readiness: ${d.capabilities.readiness.join(', ') || 'none'}. Addressing: ${d.capabilities.addressing.join(', ') || 'none'}. RBAC (a token in, a role out): ${d.capabilities.rbac.join(', ') || 'none: roles come from the tenant secrets until a Payload MCP host is named'}. Metaphysics (the arithmetic mod 9 every tail carries): ${d.capabilities.metaphysics.join(', ') || 'none'}.`, '',
  '## Doors', '', `${d.doors.length} doors across ${d.hosts.filter((h) => h.kind === 'mcp').length} MCP host(s).`, '',
  '| Host | Door | Takes | Required | Answers | Read-only | From |', '|---|---|---|---|---|---|---|', ...d.doors.map((x) => `| ${x.host} | ${x.name} | ${x.takes.join(', ') || '—'} | ${x.required.join(', ') || '—'} | ${x.answers.join(', ') || '—'} | ${x.readOnly === null ? '?' : x.readOnly} | ${x.contract} |`), '',
  '## Leads', '', ...(d.leads.length ? d.leads.map((l) => `- \`${l.id}\`: ${l.statement}`) : ['none: every API host published a contract']), ''].join('\n')

/** The public MCP registry: a lead's distinctive words asked there first, before any guess about which MCP serves it. */
export const MCP_REGISTRY = 'https://registry.modelcontextprotocol.io/v0/servers'
const REGISTRY_STOP = new Set(['the', 'a', 'an', 'of', 'to', 'in', 'on', 'for', 'and', 'or', 'is', 'are', 'it', 'its', 'with', 'by', 'as', 'at', 'from', 'this', 'that', 'every', 'any', 'all', 'no', 'not', 'be', 'into', 'over', 'through', 'here', 'there', 'one', 'two', 'per', 'via', 'tool', 'tools', 'lead', 'leads', 'qpu', 'tree', 'unit', 'served', 'open', 'mcp', 'server', 'servers'])
/** The words of a lead worth asking: its own, without the stop words, the longest first; each a registry search. */
const listRegistryWords = (lead: { id: string; statement: string; source?: string }, at = 3): string[] => {
  const words = lead.statement.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter((w) => w.length > 3 && !REGISTRY_STOP.has(w) && !/^\d+$/.test(w))
  const counts = new Map<string, number>(); for (const w of words) counts.set(w, (counts.get(w) ?? 0) + 1)
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || b[0].length - a[0].length).slice(0, at).map(([w]) => w)
}
/** The MCP directories beside the official registry, as each is read by a machine (measured 2026-10-27): a search asked with a lead's words, an
 *  open sitemap matched by its slugs, a keyed API named with its key (the key the operator's act), a site with no machine contract a lead.
 *  A path robots.txt disallows is never asked, and a page behind a bot challenge is never fetched past it. */
const MCP_DIRECTORIES = TABLES.MCP_DIRECTORIES as readonly { id: string; read: 'search' | 'mcp' | 'sitemap' | 'keyed' | 'none'; url: string; tool?: string; keyVar?: string; note: string }[]
type RegistryRequest = { id: string; lead: string; word: string; directory: string; method: 'GET' | 'POST'; url: string; accept: string; body?: unknown }
export const createRegistryRequests = (lead: { id: string; statement: string; source?: string }, at = 3): RegistryRequest[] => {
  const words = listRegistryWords(lead, at)
  return [...words.flatMap((word) => MCP_DIRECTORIES.filter((d) => d.read === 'search').map((d) => ({ id: d.id === 'official' ? `registry:${lead.id}:${word}` : `registry:${lead.id}:${word}:${d.id}`, lead: lead.id, word, directory: d.id, method: 'GET' as const, url: d.url + encodeURIComponent(word), accept: 'application/json' }))),
    // a directory that is an MCP server is asked by POST: its search tool called with the word (JSON-RPC tools/call)
    ...words.flatMap((word) => MCP_DIRECTORIES.filter((d) => d.read === 'mcp' && d.tool).map((d) => ({ id: `registry:${lead.id}:${word}:${d.id}`, lead: lead.id, word, directory: d.id, method: 'POST' as const, url: d.url, accept: 'application/json, text/event-stream', body: rpcBody('tools/call', { name: d.tool, arguments: { q: word, return: 'apis' } }) }))),
    ...MCP_DIRECTORIES.filter((d) => d.read === 'sitemap').flatMap((d) => d.url.split(' ').map((url, i) => ({ id: `registry:${lead.id}:${d.id}:${i}`, lead: lead.id, word: words.join(' '), directory: d.id, method: 'GET' as const, url, accept: 'application/xml' })))]
}
type RelatedServer = { name: string; description: string; remotes: string[]; word: string; directory?: string; page?: string }
/** The registry's answers read into the servers related to the lead, and the one tools/list request per remote that extends each through qpu. */
export const listRelatedServers = (lead: string, answers: readonly { id: string; word?: string; status: number; text: string }[]): { lead: string; asked: number; answered: number; servers: RelatedServer[]; extend: { id: string; server: string; method: 'POST'; url: string; accept: string; body: unknown }[] } => {
  const servers = new Map<string, RelatedServer>()
  let answered = 0
  for (const a of answers) {
    if (a.status !== 200) continue
    // a directory's sitemap: its server pages (the locale copies dropped) whose slug holds one of the lead's words
    if (a.text.trimStart().startsWith('<')) { const words = (a.word ?? '').split(' ').filter(Boolean).map(stem); answered += 1
      for (const [, page] of a.text.matchAll(/<loc>(https:\/\/[^/<]+\/(?:servers|remote-mcp-servers)\/[^<]+)<\/loc>/g)) { const slug = new URL(page!).pathname.split('/').slice(2).join('/'), shared = words.filter((w) => slug.split(/[/-]/).map(stem).includes(w))
        if (shared.length && !servers.has(slug)) servers.set(slug, { name: slug, description: '', remotes: [], word: shared.join(' '), directory: new URL(page!).host, page: page! }) }
      continue }
    try {
      // an MCP server's answer: the JSON-RPC result (or its event stream), its text content the search answer
      const raw = a.text.trimStart().startsWith('{') ? a.text : (a.text.split('data: ').pop() ?? ''), rpc = JSON.parse(raw) as { jsonrpc?: string; result?: { content?: { text?: string }[] } }
      const j = (rpc.jsonrpc ? JSON.parse(rpc.result?.content?.[0]?.text ?? '{}') : rpc) as { servers?: { server?: { name?: string; description?: string; remotes?: { url?: string }[] }; name?: string; qualifiedName?: string; description?: string; remotes?: { url?: string }[] }[]; data?: { aid?: string; description?: string; humanURL?: string }[]; apis?: { top?: { aid?: string; description?: string; humanURL?: string }[] } }
      // apis.io answers APIs, not servers: each by its id, its provider's page beside it
      for (const x of j.data ?? j.apis?.top ?? []) if (x.aid && !servers.has(x.aid)) servers.set(x.aid, { name: x.aid, description: (x.description ?? ''), remotes: [], word: a.word ?? '', directory: 'apis.io', ...(x.humanURL ? { page: x.humanURL } : {}) })
      answered += 1
      for (const x of j.servers ?? []) { const srv = x.server ?? x; const name = srv.name ?? (x as { qualifiedName?: string }).qualifiedName ?? ''; if (!name || servers.has(name)) continue; servers.set(name, { name, description: (srv.description ?? ''), remotes: (srv.remotes ?? []).map((r) => r.url).filter((u): u is string => typeof u === 'string' && /^https?:\/\//.test(u)), word: a.word ?? '' }) }
    } catch { /* not the registry's shape: nothing related read from it */ }
  }
  const extend = [...servers.values()].flatMap((s) => s.remotes.map((url) => ({ id: `extend:${lead}:${s.name}:${new URL(url).host}`, server: s.name, method: 'POST' as const, url, accept: 'application/json, text/event-stream', body: rpcBody('tools/list') })))
  return { lead, asked: answers.length, answered, servers: [...servers.values()], extend }
}

/** The foreign doors that answer a lead best: a remote's tools/list read into doors, each scored by the stems it shares with the lead (its name and description against the lead's statement, token meeting tokens, server meeting servers), the top ones proposed — never called: calling another's server is the operator's act. */
export const rankBestDoors = (lead: { id: string; statement: string }, remotes: readonly { server: string; url: string; tools: readonly { name: string; description?: string }[] }[], at = 3): { server: string; url: string; door: string; score: number; shared: string[] }[] => {
  const words = new Set(listRegistryWords(lead, 12).map(stem))
  const out: { server: string; url: string; door: string; score: number; shared: string[] }[] = []
  for (const r of remotes) for (const t of r.tools) {
    const text = `${t.name.replace(/[_-]+/g, ' ')} ${t.description ?? ''}`.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).map(stem)
    const shared = [...new Set(text.filter((w) => words.has(w)))]
    if (shared.length) out.push({ server: r.server, url: r.url, door: t.name, score: shared.length, shared })
  }
  return out.sort((a, b) => b.score - a.score || a.door.localeCompare(b.door)).slice(0, at)
}

/** Open MCP servers the QPU's tools/list is measured against: each answered initialize and tools/list without a key (measured 2026-10-26);
 *  baselines only, not integrations. Learning Commons answered 401 and is not one. */
export const OPEN_MCP_BASELINES = TABLES.OPEN_MCP_BASELINES as readonly { id: string; url: string }[]
/** A tools/list as a client pays for it: its bytes, the tokens it costs at four bytes a token, and the bytes per tool. */
const getToolsListCost = (bytes: number, tools: number) => ({ bytes, tokens: Math.ceil(bytes / 4), tools, perTool: tools ? Math.round(bytes / tools) : null })
/** The official MCP registry, latest version of each server, a page at a time (measured 2026-10-26: no total in the answer, a nextCursor while
 *  more remain), so its count is the client's walk of every page. */
const MCP_REGISTRY_SERVERS = 'https://registry.modelcontextprotocol.io/v0/servers?limit=100&version=latest'
/** The registry searched online by the words a user types: one public GET, the limit bounded to the registry's own page of one hundred (textbook_mcp_search_limit). */
export const createSearchRequest = (query: string, limit = 10) => {
  const q = query.trim().replace(/\s+/g, ' ')
  if (!q) throw new Error('search takes a query: the words asked of the official MCP registry')
  const n = Math.min(Math.max(1, Math.floor(Number.isFinite(limit) ? limit : 10)), 100)
  return { id: `registry:search:${q}`, method: 'GET' as const, url: `${MCP_REGISTRY}?search=${encodeURIComponent(q)}&limit=${n}&version=latest`, accept: 'application/json', query: q, limit: n }
}
type RegistryServer = { name: string; description: string; version: string | null; remotes: { type: string; url: string }[]; packages: { registryType: string; identifier: string }[]; installable: boolean; install: { tool: 'extend'; arguments: { install: { name: string; url: string } } } | null }
/** The registry's answer read into servers: one with a remote (streamable HTTP or SSE) is installable as a tenant's connector and names its install door,
 *  extend { install }; one with packages alone needs a runtime the edge does not run, so it is listed and not installable. */
export const listRegistryServers = (answers: readonly { status: number; text: string }[]): { answered: number; servers: RegistryServer[]; installable: number; nextCursor: string | null } => {
  const servers = new Map<string, RegistryServer>()
  let answered = 0, nextCursor: string | null = null
  for (const a of answers) {
    if (a.status !== 200) continue
    try {
      const j = JSON.parse(a.text) as { servers?: { server?: Record<string, unknown>; name?: string }[]; metadata?: { nextCursor?: string | null } }
      answered += 1
      nextCursor = j.metadata?.nextCursor ?? nextCursor
      for (const x of j.servers ?? []) {
        const s = (x.server ?? x) as { name?: string; description?: string; version?: string; remotes?: { type?: string; url?: string }[]; packages?: { registryType?: string; identifier?: string }[] }
        const name = String(s.name ?? '').trim()
        if (!name || servers.has(name)) continue
        const remotes = (s.remotes ?? []).filter((r) => typeof r.url === 'string' && r.url.startsWith('https://')).map((r) => ({ type: String(r.type ?? 'streamable-http'), url: r.url! }))
        const packages = (s.packages ?? []).filter((p) => p.identifier).map((p) => ({ registryType: String(p.registryType ?? 'npm'), identifier: String(p.identifier) }))
        const first = remotes[0]
        servers.set(name, { name, description: String(s.description ?? ''), version: typeof s.version === 'string' ? s.version : null, remotes, packages, installable: !!first, install: first ? { tool: 'extend', arguments: { install: { name, url: first.url } } } : null })
      }
    } catch { /* not the registry's shape: nothing read from it */ }
  }
  const list = [...servers.values()]
  return { answered, servers: list, installable: list.filter((s) => s.installable).length, nextCursor }
}
export const createCoverageRequest = (cursor?: string | null) => ({ url: cursor ? `${MCP_REGISTRY_SERVERS}&cursor=${encodeURIComponent(cursor)}` : MCP_REGISTRY_SERVERS, accept: 'application/json', next: 'metadata.nextCursor, until none', counts: 'servers.length on every page' })
/** How much of the registered MCP world the QPU reaches: its gates' MCP doors over the servers the registry lists, as measured, and the
 *  sets that follow — each covered door with each QPU tool at its harmonic default. A ratio over a measured total, never a claim about the internet. */
export const getCoverage = (doors: number, registryTotal: number, tools: number) => {
  const ratio = registryTotal > 0 ? Math.round((doors / registryTotal) * 1e6) / 1e6 : null
  return { doors, registryTotal, ratio, percent: ratio === null ? null : Math.floor((doors * 100) / registryTotal), sets: doors * tools, tools, says: registryTotal > 0 ? `${doors} MCP doors in the gates over ${registryTotal} servers the official registry lists: ${(ratio! * 100).toFixed(2)}% covered; ${doors * tools} sets follow (each door with each of the ${tools} QPU tools at its harmonic default)` : 'the registry was not walked: no total, no ratio', theorem: 'textbook_coverage_bounded' }
}
/** The QPU's tools/list against the open servers' as the client measured them: totals and per tool, a ratio above one meaning the server's
 *  is that many times the QPU's; a server not answering is named, never estimated. */
export const compareToolsLists = (qpu: { bytes: number; tools: number }, answers: readonly { id: string; status: number; bytes: number; tools: number }[], full?: { bytes: number }) => {
  const q = getToolsListCost(qpu.bytes, qpu.tools)
  const ratio = (a: number | null, b: number | null) => (a !== null && b ? Math.round((a / b) * 100) / 100 : null)
  const rows = OPEN_MCP_BASELINES.map((s) => { const a = answers.find((x) => x.id === s.id); if (!a || a.status !== 200 || !a.tools) return { id: s.id, url: s.url, missing: a ? `HTTP ${a.status}` : 'not asked' }; const c = getToolsListCost(a.bytes, a.tools); return { id: s.id, url: s.url, ...c, ratio: ratio(c.bytes, q.bytes), ratioPerTool: ratio(c.perTool, q.perTool) } })
  const measured = keepMeasured(rows)
  // the drop from the full list to the short one the QPU serves by default: what a client no longer pays for
  const drop = full ? { full: getToolsListCost(full.bytes, qpu.tools), short: q, savedBytes: full.bytes - qpu.bytes, savedTokens: Math.ceil(full.bytes / 4) - q.tokens, ratio: ratio(full.bytes, qpu.bytes) } : null
  return { qpu: q, drop, rows, measured: measured.length, says: `${drop ? `the full tools/list is ${drop.full.bytes} bytes and the short one served by default ${q.bytes} (${drop.ratio}× smaller, ${drop.savedTokens} tokens saved); ` : ''}the QPU's tools/list is ${q.bytes} bytes (about ${q.tokens} tokens) for ${q.tools} tools, ${q.perTool} bytes a tool; ${measured.map((r) => `${r.id} ${r.bytes} bytes for ${r.tools} (${r.perTool} a tool, ${r.ratioPerTool}× the QPU's per tool)`).join('; ') || 'no open server measured'}` }
}
