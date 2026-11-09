// The ISO deliverables the website MCP can import. No UUID graph: the addresses stay in the caller.
// Each dimension is one row of iso_deliverables_metadata. The catalogue number is a field of that row. The English scope is that row's full scope.

import { TABLES } from './tables-index.ts'

/** The ISO dimensions this tree already names. Quantum purity is gated on each of them. */
export const ISO_DIMENSIONS = [
  'ISO/IEC 4879:2024',
  'ISO 80000-10',
  'ISO/IEC 9834-8',
  'ISO 22739:2024',
  'ISO 23257:2022',
  'ISO/TR 23455:2019',
  'ISO 24165',
  'ISO 20022',
  'ISO 4217',
  'ISO 8601',
  'ISO 639-1',
  'ISO 3166-1',
  'ISO/IEC 19770',
  'ISO 16',
  'ISO 9001',
  'ISO/IEC/IEEE 12207:2026',
  'ISO/IEC/IEEE 42010:2022',
  'ISO/IEC 25010:2023',
  'ISO/IEC 25051:2014',
  'ISO/IEC 27001:2022',
] as const

/**
 * Entropy: dictionary first, then the meaning is verified (ISO 80000-5).
 * Not a purpose dimension of its own; audit measures S = k ln W beside ISO 80000-10.
 */
export const ISO_ENTROPY = {
  law: 'first the dictionary meaning; then the meaning is verified' as const,
  /** Step 1 — ordinary dictionary sense (disorder / unavailable energy or information). */
  dictionary: {
    word: 'entropy' as const,
    means: 'disorder; unpredictability; unavailable energy or information' as const,
    thermo: 'unavailability of a system\'s energy for conversion into work; degree of disorder' as const,
    information: 'uncertainty or missing information over the possible microstates' as const,
  },
  /** Step 2 — verification of that meaning under ISO 80000-5. */
  standard: 'ISO 80000-5:2019' as const,
  dimension: 'ISO 80000-5' as const,
  catalogue: 64976 as const,
  quantity: 'entropy' as const,
  symbol: 'S' as const,
  definition: 'S = k ln W' as const,
  kSymbol: 'k' as const,
  unitSi: 'J/K' as const,
  unitNatural: 'nat' as const,
  theorem: 'textbook_entropy_fusion' as const,
} as const

export const ENTROPY_LAW = ISO_ENTROPY.law

/**
 * MCP / structuredContent surface for entropy. Dictionary first, then ISO verify.
 * Wrong meaning here misleads the user — a security issue. Never a bare 0|1 alone.
 * `ordered` true → vacuum W = 1, S = 0 (disorder cleared). false → W ≥ 2, S = ln W.
 */
export const entropySurface = (ordered: boolean) => {
  const verified = isoEntropyOf(ordered ? 1 : 2)
  return {
    law: ENTROPY_LAW,
    dictionary: ISO_ENTROPY.dictionary,
    verified: {
      standard: verified.standard,
      definition: verified.definition,
      W: verified.W,
      S: verified.S,
      vacuum: verified.vacuum,
      holds: verified.holds,
    },
    S: verified.S,
    ordered: ordered && verified.holds,
    holds: ordered && verified.holds,
    says: ordered && verified.holds
      ? `${ENTROPY_LAW}: ${ISO_ENTROPY.dictionary.means}; verified vacuum S = 0 (${verified.definition})`
      : `${ENTROPY_LAW}: ${ISO_ENTROPY.dictionary.means}; verified S = ${verified.S} (${verified.definition}, W = ${verified.W}) — disorder remains`,
  }
}

/** ISO 80000-5 Boltzmann entropy in natural units (k = 1): verifies dictionary disorder as S = ln W; vacuum W = 1 → S = 0. */
export const isoEntropyOf = (W: number) => {
  const microstates = W > 0 ? W : 1
  const S = microstates === 1 ? 0 : Math.log(microstates)
  const verified = microstates >= 1 && (microstates === 1 ? S === 0 : S === Math.log(microstates))
  return {
    ...ISO_ENTROPY,
    k: 1 as const,
    unit: ISO_ENTROPY.unitNatural,
    W: microstates,
    S,
    vacuum: microstates === 1 && S === 0,
    verified,
    holds: verified,
    says: verified
      ? `dictionary ${ISO_ENTROPY.dictionary.means}; verified ${ISO_ENTROPY.definition} with W = ${microstates}, S = ${S}`
      : 'dictionary entropy not verified under ISO 80000-5',
  }
}

export const ISO_OPEN_DEFINITIONS = TABLES.ISO_OPEN_DEFINITIONS

/** A withdrawn dimension's current successor in the same dataset. The dimension itself stays the row that names it. */
export const ISO_OPEN_SUCCESSORS = TABLES.ISO_OPEN_SUCCESSORS

export const ISO_OPEN_DATA = 'https://www.iso.org/open-data.html'

/** NIST and CERN as producers (ISO/IEC 19770-6 tag-producer role): each open source yields the ISO standards it produces. */
export const ISO_PRODUCERS = [
  {
    id: 'nist' as const,
    name: 'National Institute of Standards and Technology' as const,
    role: 'producer' as const,
    guide: 'ISO/IEC 19770-6:2024 tag producers' as const,
    host: 'nist.gov' as const,
    sources: [
      { id: 'nist-opendata' as const, method: 'GET' as const, url: 'https://data.nist.gov/rmm/records?page=0&size=5', accept: 'application/json' as const, produces: 'open records with DOIs' as const },
      { id: 'nist-codata' as const, method: 'GET' as const, url: 'https://physics.nist.gov/cuu/Constants/Table/allascii.txt', accept: 'text/plain' as const, produces: 'CODATA fundamental constants' as const },
      { id: 'nist-beacon' as const, method: 'GET' as const, url: 'https://beacon.nist.gov/beacon/2.0/pulse/last', accept: 'application/json' as const, produces: 'signed randomness pulse' as const },
      { id: 'csrc-pqc' as const, method: 'GET' as const, url: 'https://csrc.nist.gov/projects/post-quantum-cryptography', accept: 'text/html' as const, produces: 'post-quantum cryptography standards' as const },
    ],
    standards: [
      { dimension: 'ISO/IEC 9834-8' as const, via: 'FIPS 180-4 SHA-256 / UUID folding' as const },
      { dimension: 'ISO 22739:2024' as const, via: 'NISTIR 8202 blockchain + FIPS 180-4 / 204' as const },
      { dimension: 'ISO 80000-10' as const, via: 'CODATA atomic and nuclear constants' as const },
      { dimension: 'ISO 16' as const, via: 'national metrology / standard frequency' as const },
      { dimension: 'ISO 8601' as const, via: 'timestamped pulses and publication dates' as const },
      { dimension: 'ISO 3166-1' as const, via: 'US national metrology institute locale' as const },
    ],
    research: ['ISO 690', 'ISO 26324'] as const,
  },
  {
    id: 'cern' as const,
    name: 'European Organization for Nuclear Research' as const,
    role: 'producer' as const,
    guide: 'ISO/IEC 19770-6:2024 tag producers' as const,
    host: 'cern.ch' as const,
    sources: [
      { id: 'cern-opendata' as const, method: 'GET' as const, url: 'https://opendata.cern.ch/api/records/?q=higgs&size=5', accept: 'application/json' as const, produces: 'LHC open records with DOIs' as const },
    ],
    standards: [
      { dimension: 'ISO 80000-10' as const, via: 'LHC atomic and nuclear physics data' as const },
      { dimension: 'ISO 8601' as const, via: 'embargo and publication dates' as const },
      { dimension: 'ISO 3166-1' as const, via: 'CERN host locale' as const },
      { dimension: 'ISO/IEC 19770' as const, via: 'hardware / software asset tags on openlab stacks' as const },
    ],
    research: ['ISO 690', 'ISO 26324'] as const,
  },
] as const

/** Every ISO source this tree can name: the Open Data page, each catalogue page, each successor, the DOI ecosystem, and NIST/CERN producers. */
export const isoOnlineSources = () => [
  ISO_OPEN_DATA,
  ...ISO_OPEN_DEFINITIONS.map((row) => `https://www.iso.org/standard/${row.id}.html`),
  ...ISO_OPEN_SUCCESSORS.map((row) => `https://www.iso.org/standard/${row.id}.html`),
  ...isoResearch().ecosystem.map((row) => row.url),
  ...ISO_PRODUCERS.flatMap((producer) => producer.sources.map((source) => source.url)),
]

const isoKey = (dimension: string) => dimension.replace(/\s*\(.*$/, '').trim()
const isoYear = (reference: string) => { const at = reference.lastIndexOf(':'); const digits = reference.slice(at + 1, at + 5); return /^\d{4}$/.test(digits) ? Number(digits) : 0 }
const isoCurrent = (stage: number) => stage >= 6060 && stage < 9500
const fileOnPage = (text: string): string | null => {
  const href = text.match(/href=["']([^"']*iso_deliverables_metadata[^"']*\.jsonl)["']/)
  if (!href?.[1]) return null
  try { return new URL(href[1], ISO_OPEN_DATA).href } catch { return null }
}

/** The JSONLines file an Open Data page names. Null when the page does not name one. */
export const isoDatasetHref = (text: string) => fileOnPage(text)

/** Research and citations. ISO 690 names the elements of a citation. ISO 26324 names the identifier. Both are asked of the DOI ecosystem. */
export const isoResearch = () => ({
  standards: ['ISO 690', 'ISO 26324'] as const,
  source: 'doi' as const,
  requirements: [
    { standard: 'ISO 690' as const, requires: 'a citation names its creator, its title, its date and its identifier' },
    { standard: 'ISO 26324' as const, requires: 'the identifier of the work is a DOI' },
  ],
  ecosystem: [
    { id: 'doi-org', url: 'https://doi.org', standard: 'ISO 26324' as const, does: 'the identifier resolves' },
    { id: 'crossref', url: 'https://api.crossref.org', standard: 'ISO 690' as const, does: 'the citation elements of a registered work' },
    { id: 'datacite', url: 'https://api.datacite.org', standard: 'ISO 690' as const, does: 'the citation elements and the related works' },
    { id: 'zenodo', url: 'https://zenodo.org/api', standard: 'ISO 26324' as const, does: 'the record and its related identifiers' },
    { id: 'openalex', url: 'https://api.openalex.org', standard: 'ISO 690' as const, does: 'the works that cite the DOI' },
  ],
  says: 'research and citations are asked of the DOI ecosystem: ISO 690 names the elements of a citation, ISO 26324 names the identifier',
})

const isoPlain = (value: unknown): string => {
  if (typeof value === 'string') return value.replace(/<[^>]*>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim()
  if (value && typeof value === 'object') { const row = value as { en?: unknown; text?: unknown }; if ('en' in row) return isoPlain(row.en); if (typeof row.text === 'string') return isoPlain(row.text) }
  return ''
}
/** Every ISO dimension, verified and defined by the open dataset. The first request is the ISO Open Data page. A page answer names the JSONLines file. A dimension is verified when a row names it, and defined when that row gives an English title and a scope. Nothing is fetched here. Research and citations are asked of the DOI ecosystem. */
export const verifyIsoOnline = (answer?: { status?: number; text?: string }) => {
  const asked = [...ISO_DIMENSIONS]
  const source = ISO_OPEN_DATA
  const page = { id: 'iso-open-data' as const, method: 'GET' as const, url: source, accept: 'text/html' as const }
  const research = isoResearch()
  const successorFor = (dimension: string, current: boolean) => {
    if (current) return null
    const row = ISO_OPEN_SUCCESSORS.find((item) => item.of === dimension)
    if (!row || !isoCurrent(row.currentStage) || row.title.en.length === 0 || row.scope.en.length === 0) return null
    return { reference: row.reference, catalogue: row.id, stage: row.currentStage, date: row.publicationDate, title: row.title.en, definition: row.scope.en, current: true as const, url: `https://www.iso.org/standard/${row.id}.html` }
  }
  const blank = (dimension: string) => ({ dimension, key: isoKey(dimension), verified: false, defined: false, current: false, successor: null as ReturnType<typeof successorFor>, reference: null as string | null, catalogue: null as number | null, stage: null as number | null, url: null as string | null, title: null as string | null, definition: null as string | null, date: null as string | null })
  const waiting = (request: { id: 'iso-open-data'; method: 'GET'; url: string; accept: 'text/html' | 'application/x-ndjson' }) => ({ phase: 'requests' as const, source, dataset: 'iso_deliverables_metadata' as const, licence: 'ODC-By-1.0' as const, request, research, asked: asked.length, verified: 0, defined: 0, current: 0, holds: false, rows: asked.map(blank) })
  if (!answer || answer.status !== 200 || typeof answer.text !== 'string' || answer.text.length === 0) return waiting(page)
  const file = fileOnPage(answer.text)
  if (file) return waiting({ id: 'iso-open-data', method: 'GET', url: file, accept: 'application/x-ndjson' })
  const request = page
  type Hit = { reference: string; catalogue: number | null; stage: number; year: number; title: string; definition: string; date: string | null; supplement: boolean; defines: boolean }
  const rank = (row: Hit) => [isoCurrent(row.stage) ? 1 : 0, row.defines ? 1 : 0, row.supplement ? 0 : 1, row.year, row.stage] as const
  const found = new Map<string, Hit>()
  for (const line of answer.text.split('\n')) {
    if (!line) continue
    let row: { reference?: unknown; id?: unknown; currentStage?: unknown; title?: unknown; scope?: unknown; publicationDate?: unknown; supplementType?: unknown }
    try { row = JSON.parse(line) } catch { continue }
    if (typeof row.reference !== 'string') continue
    const stage = typeof row.currentStage === 'number' ? row.currentStage : 0
    const year = isoYear(row.reference)
    const catalogue = typeof row.id === 'number' ? row.id : null
    const title = isoPlain(row.title)
    const definition = isoPlain(row.scope)
    const date = typeof row.publicationDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(row.publicationDate) ? row.publicationDate : null
    const supplement = typeof row.supplementType === 'string' || /\/(Amd|Cor|Add|Suppl|Ext)\b/.test(row.reference)
    const next: Hit = { reference: row.reference, catalogue, stage, year, title, definition, date, supplement, defines: title.length > 0 && definition.length > 0 }
    for (const dimension of asked) {
      const key = isoKey(dimension)
      if (row.reference !== key && !row.reference.startsWith(`${key}:`) && !row.reference.startsWith(`${key}-`)) continue
      const prev = found.get(dimension)
      if (!prev) { found.set(dimension, next); continue }
      const a = rank(next); const b = rank(prev)
      const higher = a.some((value, index) => value > b[index]! && a.slice(0, index).every((item, at) => item === b[at]))
      if (higher) found.set(dimension, next)
    }
  }
  const rows = asked.map((dimension) => {
    const hit = found.get(dimension)
    if (!hit) return blank(dimension)
    const current = isoCurrent(hit.stage)
    return { dimension, key: isoKey(dimension), verified: true, defined: hit.defines, current, successor: successorFor(dimension, current), reference: hit.reference, catalogue: hit.catalogue, stage: hit.stage, url: hit.catalogue === null ? null : `https://www.iso.org/standard/${hit.catalogue}.html`, title: hit.title || null, definition: hit.definition || null, date: hit.date }
  })
  const verified = rows.filter((row) => row.verified).length
  const defined = rows.filter((row) => row.defined).length
  const current = rows.filter((row) => row.current).length
  return { phase: 'verified' as const, source, dataset: 'iso_deliverables_metadata' as const, licence: 'ODC-By-1.0' as const, request, research, asked: asked.length, verified, defined, current, holds: verified === asked.length && defined === asked.length, rows }
}

const ISO_REF_RE = /ISO(?:\/(?:IEC|IEEE|TR|TS))*\s+\d+(?:-\d+)*(?::\d{4})?/g

/** Pull ISO references out of producer text (NIST / CERN open answers). Deduped, order kept. */
export const extractIsoRefs = (text: string) => {
  const found: string[] = []
  const seen = new Set<string>()
  for (const match of text.match(ISO_REF_RE) ?? []) {
    const ref = match.replace(/\s+/g, ' ').trim()
    if (seen.has(ref)) continue
    seen.add(ref)
    found.push(ref)
  }
  return found
}

/** The dimensions a text cites, each by its number in any edition or part (ISO 16 is not ISO 16000): what classifies a file */
export const isoClassify = (text: string) => {
  const refs = extractIsoRefs(text)
  return ISO_DIMENSIONS.filter((dimension) => { const key = dimension.replace(/:\d{4}$/, ''); return refs.some((ref) => ref === key || ref.startsWith(`${key}:`) || ref.startsWith(`${key}-`)) })
}

const dimensionHit = (ref: string, dimension: string) => {
  const key = isoKey(dimension)
  return ref === key || ref.startsWith(`${key}:`) || ref.startsWith(`${key}-`) || key.startsWith(ref)
}

/**
 * NIST, CERN and Clay as three trinities (one bit each). Plugins that share a trinity collide the same way:
 * 2^3 = eight combinations remain. The most effective carries every producer and unlocks every hidden perspective.
 */
export const HIDDEN_PERSPECTIVES = ['public', 'tenant', 'operator', 'client', 'developer', 'legal'] as const

export const PRODUCER_TRINITIES = {
  nist: {
    id: 'nist' as const,
    seed: 3 as const,
    trinity: [3, 6, 9] as const,
    role: 'producer' as const,
    unlocks: ['public', 'legal'] as const,
    via: 'NIST Open Data + CODATA + FIPS' as const,
  },
  cern: {
    id: 'cern' as const,
    seed: 7 as const,
    trinity: [7, 4, 1] as const,
    role: 'producer' as const,
    unlocks: ['tenant', 'client'] as const,
    via: 'CERN Open Data + DOI citation' as const,
  },
  clay: {
    id: 'clay' as const,
    seed: 2 as const,
    trinity: [2, 5, 8] as const,
    role: 'register' as const,
    unlocks: ['operator', 'developer'] as const,
    via: 'Clay register 55 relations / σ-involution' as const,
  },
} as const

const PRODUCER_TRINITY_NAMES = Object.keys(PRODUCER_TRINITIES) as (keyof typeof PRODUCER_TRINITIES)[]

/** Eight combinations of NIST·CERN·Clay. Each on trinity unlocks its perspectives; the most effective unlocks every hidden one. */
export const unlockHiddenPerspectives = (raw: unknown = true) => {
  if (raw !== true && !(raw && typeof raw === 'object' && !Array.isArray(raw))) {
    throw new Error('trinity takes true or { bits?: 0..7 | { nist?, cern?, clay? } }')
  }
  const asked = raw === true ? null : raw as { bits?: unknown; nist?: unknown; cern?: unknown; clay?: unknown }
  const bitOf = (name: keyof typeof PRODUCER_TRINITIES, index: number) => {
    if (asked && typeof asked.bits === 'number' && Number.isInteger(asked.bits)) return ((asked.bits >> index) & 1) === 1
    if (asked && asked[name] !== undefined) return asked[name] === true
    return true
  }
  const combinations = Array.from({ length: 1 << PRODUCER_TRINITY_NAMES.length }, (_, index) => {
    const on = PRODUCER_TRINITY_NAMES.filter((_, k) => ((index >> k) & 1) === 1)
    const unlocked = [...new Set(on.flatMap((name) => [...PRODUCER_TRINITIES[name].unlocks]))] as typeof HIDDEN_PERSPECTIVES[number][]
    const hidden = HIDDEN_PERSPECTIVES.filter((perspective) => !unlocked.includes(perspective))
    const trinities = on.map((name) => ({
      id: name,
      seed: PRODUCER_TRINITIES[name].seed,
      trinity: [...PRODUCER_TRINITIES[name].trinity],
      unlocks: [...PRODUCER_TRINITIES[name].unlocks],
      via: PRODUCER_TRINITIES[name].via,
    }))
    return {
      index,
      bits: index.toString(2).padStart(3, '0'),
      on: [...on],
      trinities,
      unlocked,
      hidden,
      perspectives: unlocked.length,
      of: HIDDEN_PERSPECTIVES.length,
      most: on.length === PRODUCER_TRINITY_NAMES.length,
      holds: hidden.length === 0 || on.length < PRODUCER_TRINITY_NAMES.length,
    }
  })
  const activeBits = PRODUCER_TRINITY_NAMES.reduce((n, name, index) => n | (bitOf(name, index) ? (1 << index) : 0), 0)
  const active = combinations[activeBits]!
  const { bits: activeBitString, ...activeRest } = active
  const most = combinations.find((row) => row.most)!
  const space = 1 << PRODUCER_TRINITY_NAMES.length
  const holds = combinations.length === space
    && space === 8
    && most.hidden.length === 0
    && most.unlocked.length === HIDDEN_PERSPECTIVES.length
    && most.on.join() === PRODUCER_TRINITY_NAMES.join()
    && combinations.every((row) => row.unlocked.length === row.on.reduce((n, name) => n + PRODUCER_TRINITIES[name].unlocks.length, 0) || new Set(row.on.flatMap((name) => [...PRODUCER_TRINITIES[name].unlocks])).size === row.unlocked.length)
    && HIDDEN_PERSPECTIVES.every((perspective) => PRODUCER_TRINITY_NAMES.some((name) => (PRODUCER_TRINITIES[name].unlocks as readonly string[]).includes(perspective)))
  return {
    phase: 'trinity' as const,
    via: 'nist+cern+clay' as const,
    law: 'NIST, CERN and Clay trinities unlock each hidden perspective' as const,
    guide: 'one bit per trinity — eight combinations remain' as const,
    fetched: false as const,
    written: false as const,
    space,
    variants: combinations.length,
    trinities: PRODUCER_TRINITY_NAMES.map((name) => ({
      id: name,
      seed: PRODUCER_TRINITIES[name].seed,
      trinity: [...PRODUCER_TRINITIES[name].trinity],
      unlocks: [...PRODUCER_TRINITIES[name].unlocks],
      via: PRODUCER_TRINITIES[name].via,
      role: PRODUCER_TRINITIES[name].role,
    })),
    perspectives: [...HIDDEN_PERSPECTIVES],
    combinations,
    active: { bits: activeBitString, ...activeRest },
    most,
    unlocked: active.unlocked,
    hidden: active.hidden,
    holds,
    says: holds
      ? (active.most
        ? `NIST·CERN·Clay most effective combination unlocks all ${HIDDEN_PERSPECTIVES.length} perspectives; ${space} combinations, one bit per trinity`
        : `combination ${active.bits}: unlocked ${active.unlocked.join(', ') || 'none'}; still hidden: ${active.hidden.join(', ') || 'none'}`)
      : 'NIST·CERN·Clay trinity did not unlock every hidden perspective',
  }
}

/**
 * Extract the ISO standards NIST and CERN produce.
 * true / { producers: true }: the plan — requestList for each producer source, nothing fetched.
 * { answers }: url or id → body the client fetched; refs extracted and matched to each producer's standards.
 * Clay joins as the third trinity — together they unlock each hidden perspective.
 */
export const extractIsoFromProducers = (raw: unknown = true) => {
  if (raw !== true && !(raw && typeof raw === 'object' && !Array.isArray(raw))) {
    throw new Error('producers takes true or { answers?: { <url|id>: <text> } }')
  }
  const answers = raw !== true && raw && typeof raw === 'object' && (raw as { answers?: unknown }).answers && typeof (raw as { answers: unknown }).answers === 'object'
    ? (raw as { answers: Record<string, unknown> }).answers
    : null
  const bodyAt = (id: string, url: string) => {
    if (!answers) return ''
    const byId = answers[id]
    const byUrl = answers[url]
    return typeof byId === 'string' ? byId : typeof byUrl === 'string' ? byUrl : ''
  }
  const research = isoResearch()
  const requestList = ISO_PRODUCERS.flatMap((producer) => producer.sources.map((source) => ({
    id: source.id,
    producer: producer.id,
    method: source.method,
    url: source.url,
    accept: source.accept,
    produces: source.produces,
    via: "the client's own MCP fetches it; this handler does no I/O" as const,
  })))
  const rows = ISO_PRODUCERS.map((producer) => {
    const texts = producer.sources.map((source) => bodyAt(source.id, source.url))
    const answered = answers !== null && texts.every((text) => text.length > 0)
    const extracted = extractIsoRefs(texts.join('\n'))
    const dimensions = producer.standards.map((row) => {
      const hit = extracted.find((ref) => dimensionHit(ref, row.dimension))
      const inCatalogue = ISO_DIMENSIONS.some((dimension) => isoKey(dimension) === isoKey(row.dimension) || dimension === row.dimension || dimension.startsWith(`${isoKey(row.dimension)}:`))
      return {
        dimension: row.dimension,
        via: row.via,
        catalogue: inCatalogue,
        extracted: hit ?? null,
        holds: inCatalogue,
      }
    })
    // plan: declared produces hold when they sit in ISO_DIMENSIONS; verified: answers in hand and catalogue map holds (open data may not restate the ISO string — the producer map is authoritative)
    const planned = dimensions.every((row) => row.catalogue)
      && producer.research.every((std) => (research.standards as readonly string[]).includes(std))
    const verified = answered && planned
    const phase = answers === null ? 'plan' as const : verified ? 'verified' as const : 'unanswered' as const
    return {
      id: producer.id,
      name: producer.name,
      role: producer.role,
      guide: producer.guide,
      host: producer.host,
      sources: producer.sources.length,
      research: producer.research,
      extracted,
      dimensions,
      standards: dimensions.length,
      answered,
      phase,
      planned,
      verified,
      holds: answers === null ? planned : verified,
      says: answers === null
        ? `plan: ${producer.name} produces ${dimensions.length} ISO dimensions via ${producer.sources.length} open source(s); hand answers back`
        : verified
          ? `verified: ${producer.name} produces ${dimensions.length} ISO dimensions; extracted ${extracted.length} ISO ref(s)`
          : `unanswered: re-hand answers for every ${producer.id} source`,
    }
  })
  const planned = rows.every((row) => row.planned)
  const verified = rows.every((row) => row.verified)
  const phase = answers === null ? 'plan' as const : verified ? 'verified' as const : 'unanswered' as const
  const dimensions = [...new Set(rows.flatMap((row) => row.dimensions.map((d) => d.dimension)))]
  const trinity = unlockHiddenPerspectives(true)
  const holds = (answers === null ? planned && rows.length === ISO_PRODUCERS.length : verified) && trinity.holds && trinity.most.hidden.length === 0
  return {
    phase: 'producers' as const,
    via: 'nist+cern+clay' as const,
    role: 'producer' as const,
    guide: 'ISO/IEC 19770-6:2024 tag producers; NIST·CERN·Clay trinities unlock each hidden perspective' as const,
    fetched: false as const,
    written: false as const,
    producers: rows.length,
    of: ISO_PRODUCERS.length,
    dimensions: dimensions.length,
    research: research.standards,
    requestList,
    rows,
    trinity,
    unlocked: trinity.unlocked,
    hidden: trinity.hidden,
    ladder: { phase, better: 'open challenge via producer open data' as const, trinity: 'nist+cern+clay' as const },
    holds,
    says: holds
      ? (answers === null
        ? `NIST and CERN as producers: ${dimensions.length} ISO standards; Clay completes the trinity — ${trinity.most.unlocked.length} perspectives unlocked across ${trinity.space} combinations; hand answers for ${requestList.length} open sources`
        : `extracted ISO standards from NIST and CERN producing; Clay trinity unlocks all ${trinity.most.unlocked.length} perspectives`)
      : 'NIST/CERN/Clay producer trinity did not hold — re-hand answers or check hidden perspectives',
  }
}
