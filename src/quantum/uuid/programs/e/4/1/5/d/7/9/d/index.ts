// Leads are developed in .idea first. Anything else is placed under .idea/leads, and only those files are handled.
import { PROSE, proseFill } from '../../../../../../../../5/9/e/4/9/1/a/4/index.ts'
import { IDEA_HOME } from '../../../../../../../../6/7/8/3/c/3/4/b/index.ts'
import { ISO_EXIT } from '../../../../../../../../c/3/c/b/1/a/f/c/index.ts'
import { quantumVocabulary } from '../../../../../../../../d/f/0/d/9/1/3/b/index.ts'
import { uuid } from '../../../../../../../../2/7/1/a/7/6/4/9/index.ts'
import { TABLES } from '../../../../../../../../1/2/a/4/3/2/a/8/index.ts'
import { QPU_CONNECTOR } from '../../../../../../../../4/a/1/6/6/9/b/c/index.ts'

const IDEA_INBOX = `${IDEA_HOME}/leads` as const

export const PROCESS_LIFE = [
  { clause: 'ISO 9001:2015, 9.2', phase: 'audit', computesNext: false },
  { clause: 'ISO 9001:2015, 9.3', phase: 'next', computesNext: true },
  { clause: 'ISO 9001:2015, 10.2', phase: 'nonconformity', computesNext: false },
  { clause: 'ISO 9001:2015, 6.3', phase: 'plan', computesNext: false },
  { clause: 'ISO 9001:2015, 8.1', phase: 'control', computesNext: false },
  { clause: 'ISO 9001:2015, 8.6', phase: 'release', computesNext: false },
  { clause: 'ISO 9001:2015, 9.1', phase: 'monitor', computesNext: false },
  { clause: 'ISO 9001:2015, 10.3', phase: 'improve', computesNext: false },
] as const

export const LIFE_PER_SECOND = 1000000000
export const lifeBound = (lives: boolean, clause: string, count: number) => `${lives ? 'live' : 'exit'}\n${clause}\n${count}`

const ZENODO = 'https://github.com/zenodo/zenodo-rdm'
const DOI = 'https://www.doi.org/the-identifier/resources/'

type Draft = { folder: string; slug: string; source: string; title: string; statement: string }

const DRAFTS: readonly Draft[] = [
  { folder: 'zenodo-rdm', slug: 'communities', source: ZENODO, title: 'Communities', statement: PROSE.quantumProcessingIdeas_statement3 },
  { folder: 'zenodo-rdm', slug: 'subcommunities', source: ZENODO, title: 'Subcommunities', statement: PROSE.quantumProcessingIdeas_statement4 },
  { folder: 'zenodo-rdm', slug: 'curation', source: ZENODO, title: 'Curation', statement: PROSE.quantumProcessingIdeas_statement5 },
  { folder: 'zenodo-rdm', slug: 'moderation', source: ZENODO, title: 'Moderation', statement: 'Moderation records a decision on a record.' },
  { folder: 'zenodo-rdm', slug: 'legacy', source: ZENODO, title: 'Legacy deposit', statement: PROSE.quantumProcessingIdeas_statement6 },
  { folder: 'zenodo-rdm', slug: 'github', source: ZENODO, title: 'GitHub release', statement: PROSE.quantumProcessingIdeas_statement7 },
  { folder: 'zenodo-rdm', slug: 'exporter', source: ZENODO, title: 'Exporter', statement: PROSE.quantumProcessingIdeas_statement8 },
  { folder: 'zenodo-rdm', slug: 'metrics', source: ZENODO, title: 'Metrics', statement: PROSE.quantumProcessingIdeas_statement9 },
  { folder: 'zenodo-rdm', slug: 'stats', source: ZENODO, title: 'Statistics', statement: PROSE.quantumProcessingIdeas_statement10 },
  { folder: 'zenodo-rdm', slug: 'openaire', source: ZENODO, title: 'OpenAIRE', statement: PROSE.quantumProcessingIdeas_statement11 },
  { folder: 'zenodo-rdm', slug: 'previewer', source: ZENODO, title: 'Previewer', statement: PROSE.quantumProcessingIdeas_statement12 },
  { folder: 'zenodo-rdm', slug: 'redirector', source: ZENODO, title: 'Redirector', statement: PROSE.quantumProcessingIdeas_statement13 },
  { folder: 'zenodo-rdm', slug: 'sitemap', source: ZENODO, title: 'Sitemap', statement: PROSE.quantumProcessingIdeas_statement14 },
  { folder: 'zenodo-rdm', slug: 'facets', source: ZENODO, title: 'Facets', statement: PROSE.quantumProcessingIdeas_statement15 },
  { folder: 'zenodo-rdm', slug: 'files', source: ZENODO, title: 'Files', statement: PROSE.quantumProcessingIdeas_statement16 },
  { folder: 'zenodo-rdm', slug: 'permissions', source: ZENODO, title: 'Permissions', statement: PROSE.quantumProcessingIdeas_statement17 },
  { folder: 'zenodo-rdm', slug: 'tokens', source: ZENODO, title: 'Resource access token', statement: PROSE.quantumProcessingIdeas_statement18 },
  { folder: 'zenodo-rdm', slug: 'serializers', source: ZENODO, title: 'Serializers', statement: PROSE.quantumProcessingIdeas_statement19 },
  { folder: 'zenodo-rdm', slug: 'custom-fields', source: ZENODO, title: 'Custom fields', statement: PROSE.quantumProcessingIdeas_statement20 },
  { folder: 'zenodo-rdm', slug: 'custom-schemes', source: ZENODO, title: 'EDMO scheme', statement: PROSE.quantumProcessingIdeas_statement21 },
  { folder: 'zenodo-rdm', slug: 'partners', source: ZENODO, title: 'Partners', statement: PROSE.quantumProcessingIdeas_statement22 },
  { folder: 'zenodo-rdm', slug: 'support', source: ZENODO, title: 'Support', statement: PROSE.quantumProcessingIdeas_statement23 },
  { folder: 'zenodo-rdm', slug: 'orcha', source: ZENODO, title: 'Orcha waitlist', statement: PROSE.quantumProcessingIdeas_statement24 },
  { folder: 'doi', slug: 'key-facts', source: DOI, title: PROSE.quantumProcessingIdeas_title25, statement: PROSE.quantumProcessingIdeas_statement26 },
  { folder: 'doi', slug: 'designing', source: 'https://www.doi.org/the-identifier/resources/factsheets/designing-doi-applications', title: 'Designing DOI Applications', statement: PROSE.quantumProcessingIdeas_statement27 },
  { folder: 'doi', slug: 'interoperability', source: DOI, title: 'Identifier Interoperability', statement: PROSE.quantumProcessingIdeas_statement28 },
  { folder: 'doi', slug: 'indecs', source: DOI, title: 'The indecs Framework', statement: PROSE.quantumProcessingIdeas_statement29 },
  { folder: 'doi', slug: 'cloudflare', source: DOI, title: 'DOI System and Cloudflare', statement: PROSE.quantumProcessingIdeas_statement30 },
  { folder: 'doi', slug: 'standard-schemes', source: DOI, title: PROSE.quantumProcessingIdeas_title31, statement: PROSE.quantumProcessingIdeas_statement32 },
  { folder: 'doi', slug: 'handle', source: DOI, title: PROSE.quantumProcessingIdeas_title33, statement: PROSE.quantumProcessingIdeas_statement34 },
  { folder: 'doi', slug: 'resolution', source: 'https://www.doi.org/the-identifier/resources/factsheets/doi-resolution-documentation', title: 'DOI Resolution Documentation', statement: PROSE.quantumProcessingIdeas_statement35 },
  { folder: 'doi', slug: 'isbn', source: DOI, title: PROSE.quantumProcessingIdeas_title36, statement: PROSE.quantumProcessingIdeas_statement37 },
  { folder: 'doi', slug: 'purls', source: DOI, title: PROSE.quantumProcessingIdeas_title38, statement: PROSE.quantumProcessingIdeas_statement39 },
  { folder: 'doi', slug: 'openurl', source: DOI, title: 'DOI System and OpenURL', statement: PROSE.quantumProcessingIdeas_statement40 },
  { folder: 'doi', slug: 'topics', source: DOI, title: 'DOI Foundation and Topics', statement: PROSE.quantumProcessingIdeas_statement41 },
  { folder: 'doi', slug: 'uri-scheme', source: 'https://www.doi.org/resources/DOI_URI_Scheme.pdf', title: 'DOI URI Scheme', statement: PROSE.quantumProcessingIdeas_statement42 },
  { folder: 'doi', slug: 'faqs', source: DOI, title: 'FAQs', statement: PROSE.quantumProcessingIdeas_statement43 },
  { folder: 'doi', slug: 'news', source: DOI, title: 'DOI in the news', statement: PROSE.quantumProcessingIdeas_statement44 },
  { folder: 'doi', slug: 'licence', source: DOI, title: 'Resources licence', statement: PROSE.quantumProcessingIdeas_statement45 },
  { folder: 'crossref', slug: 'retrieval', source: 'https://www.crossref.org/services/', title: 'Metadata retrieval', statement: PROSE.quantumProcessingIdeas_statement46 },
  { folder: 'crossref', slug: 'plus', source: 'https://www.crossref.org/services/', title: 'Metadata Plus', statement: PROSE.quantumProcessingIdeas_statement47 },
  { folder: 'crossref', slug: 'registration', source: 'https://www.crossref.org/services/', title: 'Content registration', statement: PROSE.quantumProcessingIdeas_statement48 },
  { folder: 'crossref', slug: 'linking', source: 'https://www.crossref.org/services/', title: 'Reference linking', statement: PROSE.quantumProcessingIdeas_statement49 },
  { folder: 'crossref', slug: 'cited-by', source: 'https://www.crossref.org/services/', title: 'Cited-by', statement: PROSE.quantumProcessingIdeas_statement50 },
  { folder: 'crossref', slug: 'funders', source: 'https://www.crossref.org/services/', title: 'Funder Registry', statement: PROSE.quantumProcessingIdeas_statement51 },
  { folder: 'crossref', slug: 'ror', source: 'https://www.crossref.org/services/', title: 'Research Organization Registry', statement: PROSE.quantumProcessingIdeas_statement52 },
  { folder: 'crossref', slug: 'similarity', source: 'https://www.crossref.org/services/', title: 'Similarity Check', statement: PROSE.quantumProcessingIdeas_statement53 },
  { folder: 'crossref', slug: 'crossmark', source: 'https://www.crossref.org/services/', title: 'Crossmark', statement: PROSE.quantumProcessingIdeas_statement54 },
  { folder: 'crossref', slug: 'rest', source: 'https://www.crossref.org/documentation/retrieve-metadata/rest-api/', title: 'REST API', statement: PROSE.quantumProcessingIdeas_statement55 },
  { folder: 'crossref', slug: 'pools', source: 'https://www.crossref.org/documentation/retrieve-metadata/rest-api/access-and-authentication/', title: 'REST API pools', statement: PROSE.quantumProcessingIdeas_statement56 },
  { folder: 'cern', slug: 'portal', source: 'https://opendata.cern.ch/docs/about', title: 'CERN Open Data portal', statement: PROSE.quantumProcessingIdeas_statement57 },
  { folder: 'cern', slug: 'levels', source: 'https://opendata.cern.ch/docs/about', title: 'Data levels', statement: PROSE.quantumProcessingIdeas_statement58 },
  { folder: 'cern', slug: 'citation', source: 'https://opendata.cern.ch/docs/about', title: 'Citation', statement: PROSE.quantumProcessingIdeas_statement59 },
  { folder: 'cern', slug: 'invenio', source: 'https://opendata.cern.ch/docs/about', title: 'Invenio', statement: PROSE.quantumProcessingIdeas_statement60 },
  { folder: 'cern', slug: 'cernvm', source: 'https://opendata.cern.ch/docs/about', title: 'CernVM', statement: PROSE.quantumProcessingIdeas_statement61 },
  { folder: 'cern', slug: 'eos', source: 'https://opendata.cern.ch/docs/about', title: 'EOS', statement: PROSE.quantumProcessingIdeas_statement62 },
  { folder: 'cern', slug: 'records', source: 'https://opendata.cern.ch', title: 'Records', statement: PROSE.quantumProcessingIdeas_statement63 },
  { folder: 'cern', slug: 'displays', source: 'https://opendata.cern.ch', title: 'Event displays', statement: PROSE.quantumProcessingIdeas_statement64 },
  { folder: 'cern', slug: 'analyses', source: 'https://opendata.cern.ch', title: 'Analyses', statement: PROSE.quantumProcessingIdeas_statement65 },
  { folder: 'cern', slug: 'oligoarchive', source: 'https://indico.cern.ch/event/1293880/', title: 'Synthetic DNA storage', statement: PROSE.quantumProcessingIdeas_statement66 },
  { folder: 'cern', slug: 'oligoarchive-sha3', source: 'https://indico.cern.ch/event/1293880/attachments/2697241/4681188/publi-5783.pdf', title: 'SHA-3 inside a DNA oligo', statement: PROSE.quantumProcessingIdeas_statement67 },
  { folder: 'nist', slug: 'mission', source: 'https://www.nist.gov/about-nist', title: 'Mission', statement: PROSE.quantumProcessingIdeas_statement68 },
  { folder: 'nist', slug: 'nmi', source: 'https://www.nist.gov', title: 'National Metrology Institute', statement: PROSE.quantumProcessingIdeas_statement69 },
  { folder: 'nist', slug: 'competencies', source: 'https://www.nist.gov/about-nist', title: 'Core competencies', statement: PROSE.quantumProcessingIdeas_statement70 },
  { folder: 'nist', slug: 'codata', source: 'https://physics.nist.gov/cuu/Constants/', title: 'CODATA constants', statement: PROSE.quantumProcessingIdeas_statement71 },
  { folder: 'nist', slug: 'beacon', source: 'https://beacon.nist.gov', title: 'Randomness Beacon', statement: PROSE.quantumProcessingIdeas_statement72 },
  { folder: 'nist', slug: 'headquarters', source: 'https://www.nist.gov', title: 'Headquarters', statement: PROSE.quantumProcessingIdeas_statement73 },
  { folder: 'nist', slug: 'post-quantum', source: 'https://www.nist.gov', title: 'Post-quantum cryptography', statement: PROSE.quantumProcessingIdeas_statement74 },
  { folder: 'nist', slug: 'genomic-ir-8432', source: 'https://csrc.nist.gov/pubs/ir/8432/final', title: 'Cybersecurity of Genomic Data', statement: PROSE.quantumProcessingIdeas_statement75 },
  { folder: 'nist', slug: 'genomic-ir-8467', source: 'https://csrc.nist.gov/pubs/ir/8467/2pd', title: 'Genomic Data Profile', statement: PROSE.quantumProcessingIdeas_statement76 },
  { folder: 'nist', slug: 'genomic-cswp-35', source: 'https://csrc.nist.gov/pubs/cswp/35/cybersecurity-threat-modeling-the-genomic-data-seq/ipd', title: 'Sequencing threat model', statement: PROSE.quantumProcessingIdeas_statement77 },
  { folder: 'nist', slug: 'genomic-nccoe', source: 'https://www.nccoe.nist.gov/projects/cybersecurity-and-privacy-genomic-data', title: 'NCCoE genomic data', statement: PROSE.quantumProcessingIdeas_statement78 },
  { folder: 'nist', slug: 'genomic-dna', source: 'https://www.nist.gov/blogs/taking-measure/how-secure-your-dna', title: 'How secure is your DNA', statement: PROSE.quantumProcessingIdeas_statement79 },
  { folder: 'nist', slug: 'synthetic-nucleic-acid', source: 'https://www.nist.gov/programs-projects/biosecurity-synthetic-nucleic-acid-sequences', title: 'Synthetic nucleic acid sequences', statement: PROSE.quantumProcessingIdeas_statement80 },
  { folder: 'nist', slug: 'fips-202', source: 'https://csrc.nist.gov/pubs/fips/202/final', title: 'SHA-3', statement: PROSE.quantumProcessingIdeas_statement81 },
  { folder: 'proxmox', slug: 've', source: 'https://www.proxmox.com/en/downloads', title: 'Proxmox VE 9.2', statement: PROSE.quantumProcessingIdeas_statement82 },
  { folder: 'proxmox', slug: 've-arm64', source: 'https://www.proxmox.com/en/downloads', title: 'Proxmox VE 9.2 ARM64', statement: PROSE.quantumProcessingIdeas_statement83 },
  { folder: 'proxmox', slug: 'backup', source: 'https://www.proxmox.com/en/downloads', title: 'Proxmox Backup Server 4.2', statement: PROSE.quantumProcessingIdeas_statement84 },
  { folder: 'proxmox', slug: 'mail', source: 'https://www.proxmox.com/en/downloads', title: 'Proxmox Mail Gateway 9.1', statement: PROSE.quantumProcessingIdeas_statement85 },
  { folder: 'proxmox', slug: 'datacenter', source: 'https://www.proxmox.com/en/downloads', title: 'Proxmox Datacenter Manager 1.1', statement: PROSE.quantumProcessingIdeas_statement86 },
]

const fileText = (draft: Draft) => `source: ${draft.source}\ntitle: ${draft.title}\n\n${draft.statement}\n`

const draftFile = (draft: Draft): IdeaFile => {
  const path = `${IDEA_INBOX}/${draft.folder}/${draft.slug}.txt`
  return { path, text: fileText(draft), from: path }
}

const cryptoBio = (draft: Draft) => draft.slug === 'oligoarchive' || draft.slug.startsWith('oligoarchive-') || draft.slug.startsWith('genomic-') || draft.slug === 'synthetic-nucleic-acid' || draft.slug === 'fips-202'

const QUANTUM_NEXT: Record<string, string> = TABLES.QUANTUM_NEXT

type GapLead = { id: string; source: string; statement: string; status?: string; tool?: string }

const QUANTUM_GAP_TOOLS = new Set(['processor', 'circuit', 'echo', 'echo_benchmark', 'algorithm', 'quantumlib', 'quantum-error-correction', 'chemistry-simulation', 'fault-tolerant-design'])

const quantumGapLead = (lead: GapLead) => {
  if (lead.status === 'served' || lead.status === 'out_of_scope' || lead.id.startsWith('iso-4879-') || !lead.statement.trim()) return false
  if (QUANTUM_GAP_TOOLS.has(lead.tool ?? '')) return true
  if (/^(chemistry-simulation|quantumlib|cirq-|gap-circuit|hardware-compliance|unit-quantum|glagolitic-above)/.test(lead.id)) return true
  return lead.source.includes('quantumai.google')
}

const QUANTUM_GAP_NEXT: Record<string, string> = {
  'chemistry-simulation-lead': PROSE.quantumProcessingIdeas_s87,
  'cirq-google-integration': PROSE.quantumProcessingIdeas_s88,
  'educational-videos': PROSE.quantumProcessingIdeas_s89,
  'gap-circuit-crossing': PROSE.quantumProcessingIdeas_s90,
  'glagolitic-above-thousand': PROSE.quantumProcessingIdeas_s91,
  'hardware-compliance-by-patents': PROSE.quantumProcessingIdeas_s92,
  'hardware-compliance-by-validation': PROSE.quantumProcessingIdeas_s93,
  'learn': PROSE.quantumProcessingIdeas_s94,
  'learn-map': PROSE.quantumProcessingIdeas_s95,
  'quantumlib-documentation': PROSE.quantumProcessingIdeas_s96,
  'research': PROSE.quantumProcessingIdeas_s97,
  'unit-quantum-advantage-door-edge': PROSE.quantumProcessingIdeas_s98,
  'videos': PROSE.quantumProcessingIdeas_s89,
}

export const openQuantum = (leads: readonly GapLead[]) => leads.filter(quantumGapLead).sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)).map((lead) => ({
  id: lead.id,
  source: lead.source,
  statement: lead.statement,
  status: lead.status ?? 'open',
  tool: lead.tool ?? null,
  idea: QUANTUM_GAP_NEXT[lead.id] ?? null,
}))

const quantumGapFiles = (leads: readonly GapLead[]): IdeaFile[] => leads.filter(quantumGapLead).sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)).map((lead) => {
  const formula = lead.statement.replace(/@/g, ' ').replace(/\s+/g, ' ').trim()
  const path = `${IDEA_INBOX}/quantum/gaps/${clean(lead.id)}.txt`
  const title = formula
  const next = QUANTUM_GAP_NEXT[lead.id]
  const body = next ? `${formula}\nidea: ${next}` : formula
  return { path, text: `source: ${lead.source}\ntitle: ${title}\n\n${body}\n`, from: lead.id }
})

const quantumIdeaFiles = (): IdeaFile[] => quantumVocabulary().map((term) => {
  const slug = `${term.clause.replace(/\./g, '-')}-${clean(term.name)}`
  const path = `${IDEA_INBOX}/quantum/${slug}.txt`
  const title = `${term.clause} ${term.name}`
  const statement = term.holds ? `${title} holds on the quantum simulator.` : proseFill(PROSE.quantumProcessingIdeas_s99, title)
  const next = QUANTUM_NEXT[term.clause]
  const body = next ? `${statement}\nidea: ${next}` : statement
  return { path, text: `source: ISO/IEC 4879:2024\ntitle: ${title}\n\n${body}\n`, from: path }
})

type IdeaFile = { path: string; text: string; from: string }

const clean = (value: string) => value.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-+|-+$/g, '').replace(/\.+/g, '.') || 'idea'

const underIdea = (path: string) => {
  const p = path.replace(/^\.\//, '').replace(/\\/g, '/')
  return (p === IDEA_HOME || p.startsWith(`${IDEA_HOME}/`)) && !p.split('/').includes('..')
}

const inboxPath = (path: string) => {
  const name = clean(path.split('/').pop() ?? 'idea')
  return `${IDEA_INBOX}/inbox/${name.endsWith('.txt') ? name : `${name}.txt`}`
}

const lifeIdeaFiles = (): IdeaFile[] => {
  const living = PROCESS_LIFE.find((row) => row.computesNext)!
  const liveId = uuid(lifeBound(true, living.clause, LIFE_PER_SECOND))
  const mcp = QPU_CONNECTOR
  const parent = proseFill(PROSE.quantumProcessingIdeas_s100, living.clause, liveId, LIFE_PER_SECOND, mcp.plugin, mcp.api)
  const lines = PROCESS_LIFE.filter((row) => !row.computesNext).map((row) => proseFill(PROSE.quantumProcessingIdeas_s101, row.clause, uuid(lifeBound(false, row.clause, 1)), mcp.plugin, mcp.api))
  const path = `${IDEA_INBOX}/life/next.txt`
  return [{ path, text: proseFill(PROSE.quantumProcessingIdeas_text102, mcp.api, parent, lines.join('\n')), from: path }]
}

export const placeInIdea = (raw: unknown, leads: readonly GapLead[] = []): IdeaFile[] => {
  if (raw === true) return DRAFTS.map(draftFile)
  if (raw === 'life') return lifeIdeaFiles()
  if (raw === 'quantum') return quantumIdeaFiles()
  if (raw === 'quantum-leads') return quantumGapFiles(leads)
  if (raw === 'crypto bio' || raw === 'crypto-bio') return DRAFTS.filter(cryptoBio).map(draftFile)
  if (typeof raw === 'string') { const path = inboxPath(raw); return [{ path, text: raw, from: raw }] }
  if (Array.isArray(raw)) return raw.flatMap((item) => placeInIdea(item, leads))
  if (raw && typeof raw === 'object') {
    const given = raw as { files?: unknown; path?: unknown; text?: unknown }
    if (Array.isArray(given.files)) return given.files.flatMap((item) => placeInIdea(item, leads))
    const text = typeof given.text === 'string' ? given.text : ''
    const asked = typeof given.path === 'string' ? given.path.replace(/^\.\//, '').replace(/\\/g, '/') : ''
    const path = underIdea(asked) ? asked : inboxPath(asked || text)
    return [{ path, text, from: asked || text }]
  }
  return []
}

const readIdea = (file: { path: string; text: string }) => {
  const lines = file.text.replace(/\r\n/g, '\n').split('\n')
  let source = ''
  let title = ''
  let i = 0
  for (; i < lines.length; i++) {
    const line = lines[i] ?? ''
    if (line.startsWith('source: ')) { source = line.slice('source: '.length).trim(); continue }
    if (line.startsWith('title: ')) { title = line.slice('title: '.length).trim(); continue }
    if (line.startsWith('standard: ') || line.startsWith('documented: ')) continue
    if (line === '') { i += 1; break }
    break
  }
  const statement = lines.slice(i).join('\n').trim()
  const variant = file.path.split('/').pop()?.replace(/\.txt$/, '') ?? 'idea'
  const product = file.path.includes('/zenodo-rdm/') ? 'zenodo-rdm' : file.path.includes('/doi/') ? 'doi' : file.path.includes('/crossref/') ? 'crossref' : file.path.includes('/cern/') ? 'cern' : file.path.includes('/nist/') ? 'nist' : file.path.includes('/proxmox/') ? 'proxmox' : file.path.includes('/quantum/') ? 'quantum' : file.path.includes('/life/') ? 'life' : 'idea'
  return { source: source || file.path, title: title || statement.split('\n')[0] || variant, statement, product, variant }
}

type Developed = { iso?: { formula?: string; standard?: string; documented?: boolean } }
type Develop = (input: { formula?: string; product?: string; variant?: string; title?: string }) => Developed

type Node = { statement: string; children: Node[] }

const ideaTree = (statement: string) => {
  const body: string[] = []
  const roots: Node[] = []
  const stack: { indent: number; node: Node }[] = []
  for (const line of statement.split('\n')) {
    const mark = /^( *)idea: (.*)$/.exec(line)
    if (!mark) { if (!stack.length) body.push(line); continue }
    const indent = mark[1]?.length ?? 0
    const text = mark[2]?.trim() ?? ''
    if (!text) continue
    const node: Node = { statement: text, children: [] }
    while (stack.length && (stack[stack.length - 1]?.indent ?? 0) >= indent) stack.pop()
    const parent = stack[stack.length - 1]?.node
    if (parent) parent.children.push(node)
    else roots.push(node)
    stack.push({ indent, node })
  }
  return { statement: body.join('\n').trim(), children: roots }
}

const walkIdeas = (nodes: Node[], out: string[]) => { for (const node of nodes) { out.push(node.statement); walkIdeas(node.children, out) } }

const ideasFrom = (statement: string): string[] => { const out: string[] = []; walkIdeas(ideaTree(statement).children, out); return out }

export const ideaFilesFromLeads = (leads: readonly { id: string; source: string; statement: string }[]): IdeaFile[] => leads.flatMap((lead) => ideasFrom(lead.statement).map((statement, index) => {
  const path = `${IDEA_INBOX}/from-leads/${clean(lead.id)}-${index}-${clean(statement)}.txt`
  return { path, text: `source: ${lead.source}\ntitle: ${statement}\n\n${statement}\n`, from: lead.id }
}))

const childPath = (parent: string, title: string) => {
  const stem = parent.replace(/\.txt$/, '')
  const slug = clean(title).replace(/\.txt$/, '').replace(/^\.+|\.+$/g, '') || 'idea'
  return `${stem}/${slug}.txt`
}

const linesOf = (nodes: Node[], indent: number): string => nodes.map((node) => { const head = `${'  '.repeat(indent)}idea: ${node.statement}`; return node.children.length ? `${head}\n${linesOf(node.children, indent + 1)}` : head }).join('\n')

const written = (read: { source: string; title: string; statement: string }, developed: Developed, nodes: Node[]) => {
  const standard = developed.iso?.standard ?? ''
  const documented = developed.iso?.documented === true ? 'true' : 'false'
  const more = nodes.length ? `\n${linesOf(nodes, 0)}` : ''
  return `source: ${read.source}\ntitle: ${read.title}\nstandard: ${standard}\ndocumented: ${documented}\n\n${read.statement}${more}\n`
}

type IdeaLead = { id: string; path: string; source: string; statement: string; status: 'open'; tool: 'leads'; reason: string; run: { tool: 'leads'; arguments: { develop: { formula: string; product: string; variant: string; title: string } } }; developed: Developed }

export const developIdeas = (raw: unknown, develop: Develop) => {
  const placed = placeInIdea(raw)
  const files = placed.map(({ path, text }) => {
    const read = readIdea({ path, text })
    if (!underIdea(path) || !read.statement) return { path, text }
    const developed = develop({ formula: read.statement, product: read.product, variant: read.variant, title: read.title })
    const standard = developed.iso?.standard ?? ''
    const documented = developed.iso?.documented === true ? 'true' : 'false'
    return { path, text: `source: ${read.source}\ntitle: ${read.title}\nstandard: ${standard}\ndocumented: ${documented}\n\n${read.statement}\n` }
  })
  const leads: IdeaLead[] = []
  const left: string[] = []
  for (const file of files) {
    if (!underIdea(file.path)) continue
    const read = readIdea(file)
    if (!read.statement) { left.push(file.path); continue }
    const developed = develop({ formula: read.statement, product: read.product, variant: read.variant, title: read.title })
    const id = `idea-${file.path.slice(`${IDEA_INBOX}/`.length).replace(/\.txt$/, '').replace(/\//g, '-')}`
    leads.push({ id, path: file.path, source: read.source, statement: read.statement, status: 'open' as const, tool: 'leads' as const, reason: PROSE.quantumProcessingIdeas_reason103, run: { tool: 'leads' as const, arguments: { develop: { formula: read.statement, product: read.product, variant: read.variant, title: read.title } } }, developed })
  }
  const outside = files.filter((file) => !underIdea(file.path)).map((file) => file.path)
  const counts = { served: 0, partial: 0, blocked: 0, out_of_scope: 0, open: leads.length }
  return { phase: 'ideas' as const, home: IDEA_HOME, inbox: IDEA_INBOX, files, leads, left, outside, placed: placed.map((file) => ({ from: file.from, path: file.path })), counts, total: leads.length, says: proseFill(PROSE.quantumProcessingIdeas_says104, leads.length, IDEA_HOME) }
}

export const nextIdeas = (raw: unknown, develop: Develop) => {
  const placed = placeInIdea(raw)
  const inbox: { path: string; text: string; at: number }[] = []
  for (const file of placed) if (underIdea(file.path)) inbox.push({ path: file.path, text: file.text, at: 0 })
  const drained: { path: string; text: string }[] = []
  const leads: (IdeaLead & { depth: number })[] = []
  const dropped: string[] = []
  const seen = new Set<string>()
  let depth = 0
  while (inbox.length) {
    const file = inbox.shift()
    if (!file || seen.has(file.path)) continue
    seen.add(file.path)
    const read = readIdea(file)
    const tree = ideaTree(read.statement)
    if (!tree.statement) { dropped.push(file.path); continue }
    const developed = develop({ formula: tree.statement, product: read.product, variant: read.variant, title: read.title })
    drained.push({ path: file.path, text: written({ source: read.source, title: read.title, statement: tree.statement }, developed, tree.children) })
    const id = `idea-${file.path.slice(`${IDEA_INBOX}/`.length).replace(/\.txt$/, '').replace(/\//g, '-')}`
    leads.push({ id, path: file.path, source: read.source, statement: tree.statement, status: 'open', tool: 'leads', reason: 'developed in .idea and removed', depth: file.at, run: { tool: 'leads', arguments: { develop: { formula: tree.statement, product: read.product, variant: read.variant, title: read.title } } }, developed })
    if (file.at > depth) depth = file.at
    for (const child of tree.children) {
      const path = childPath(file.path, child.statement)
      if (seen.has(path)) continue
      const nested = child.children.length ? `\n${linesOf(child.children, 1)}` : ''
      inbox.push({ path, text: `source: ${read.source}\ntitle: ${child.statement}\n\n${child.statement}${nested}\n`, at: file.at + 1 })
    }
  }
  const files: { path: string; text: string }[] = []
  const outside = placed.filter((file) => !underIdea(file.path)).map((file) => file.path)
  const counts = { served: 0, partial: 0, blocked: 0, out_of_scope: 0, open: leads.length }
  const empty = files.length === 0 && outside.length === 0
  const mcp = raw === 'life' ? { ...QPU_CONNECTOR, src: false as const, fetched: false as const } : null
  return { phase: 'next' as const, recursive: true as const, home: IDEA_HOME, inbox: IDEA_INBOX, depth, empty, files, drained, dropped, leads, left: files.map((file) => file.path), outside, counts, total: leads.length, ...(mcp ? { mcp } : {}), ...ISO_EXIT, says: empty ? proseFill(PROSE.quantumProcessingIdeas_s105, IDEA_HOME, leads.length, ISO_EXIT.count, ISO_EXIT.cover.entries.length, ISO_EXIT.cover.exits, mcp ? ` The only door is ${mcp.plugin}.` : '') : proseFill(PROSE.quantumProcessingIdeas_s106, files.length, IDEA_HOME, ISO_EXIT.cover.entries.length, ISO_EXIT.cover.exits) }
}
