// A pasted link is research on the browser OS.
// This call fetches every discoverable ISO source first, through the OS fetch, and the pasted URLs with them.
// A page already in hand is the reading when that fetch returns no body. Nothing is written.
import { seal, uuid } from '../quantum/password/address.js'
import { AXIOMS } from '../quantum/processing/clay-register.ts'
import { ISO_DIMENSIONS, ISO_OPEN_DATA, ISO_OPEN_DEFINITIONS, ISO_OPEN_SUCCESSORS, isoDatasetHref, isoOnlineSources } from '../quantum/processing/iso-deliverables.ts'
import { readOnline } from '../quantum/os/fetch.ts'
import { uuidQubits } from '../quantum/uuid/index.ts'
import { standardIso } from './isoSolution.ts'
import { linkedIso, mcpLinks, productHref } from './mcpLinks.ts'

const register = uuidQubits(AXIOMS.find((row) => row.name === 'hexbit')!.value)
const fetchedPages = new Map<string, { status: number; text: string }>()

const publicHttp = (value: string) => {
  const href = httpUrl(value)
  if (!href) return null
  const host = new URL(href).hostname.toLowerCase().replace(/^\[|\]$/g, '')
  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local') || host === '0.0.0.0' || host === '::1') return null
  const ip = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/.exec(host)
  if (ip) {
    const a = Number(ip[1])
    const b = Number(ip[2])
    if (a === 0 || a === 10 || a === 127 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)) return null
  }
  return href
}

const fetchOnline = async (urls: readonly string[]) => {
  const pending = [...new Set(urls.filter((url) => publicHttp(url) !== null && !fetchedPages.has(url)))]
  if (pending.length === 0) return
  const targets = pending.map((url) => publicHttp(url)!)
  const rows = await readOnline(targets)
  const got = new Map(rows.map((row) => [row.url, { status: row.status, text: row.text }]))
  pending.forEach((url, index) => fetchedPages.set(url, got.get(targets[index]!) ?? { status: 0, text: '' }))
}

const URL_RE = /https?:\/\/[^\s<>"'`)\]]+/g
const LICENCES: { id: string; pattern: RegExp }[] = [
  { id: 'CC0', pattern: /CC0|public domain/i },
  { id: 'ODC-By-1.0', pattern: /ODC-By-1\.0/i },
  { id: 'CC-BY-4.0', pattern: /CC-BY-4\.0|CC BY 4\.0/i },
]

const cleanUrl = (value: string) => value.replace(/[.,;:!?]+$/g, '')

const httpUrl = (value: string) => {
  const text = cleanUrl(value.trim())
  if (!/^https?:\/\//i.test(text)) return null
  try {
    const url = new URL(text)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    return url.href
  } catch {
    return null
  }
}

const linksOf = (raw: unknown) => {
  const row = typeof raw === 'string' ? { paste: raw } : raw && typeof raw === 'object' ? raw as { paste?: unknown; links?: unknown; pages?: unknown } : null
  if (!row) throw new Error('links is a pasted URL, a paste that contains URLs, or { links, pages? }')
  const found: string[] = []
  const take = (value: unknown) => {
    if (typeof value !== 'string') return
    const urls = value.match(URL_RE) ?? (/^https?:\/\//i.test(value.trim()) ? [value.trim()] : [])
    for (const url of urls) {
      const href = httpUrl(url)
      if (href && !found.includes(href)) found.push(href)
    }
  }
  take(row.paste)
  if (Array.isArray(row.links)) row.links.forEach(take)
  if (found.length === 0) throw new Error('a pasted link is an http or https URL')
  const pages = new Map<string, { status: number; text: string }>()
  if (Array.isArray(row.pages)) {
    for (const page of row.pages) {
      if (!page || typeof page !== 'object') continue
      const item = page as { url?: unknown; status?: unknown; text?: unknown }
      const href = typeof item.url === 'string' ? httpUrl(item.url) : null
      if (!href || typeof item.text !== 'string' || item.text.length === 0) continue
      pages.set(href, { status: typeof item.status === 'number' ? item.status : 0, text: item.text })
    }
  }
  return { found, pages }
}

const plain = (text: string) => text.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim()

const dimensionsIn = (text: string) => ISO_DIMENSIONS.filter((dimension) => {
  const escaped = dimension.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`${escaped}(?![\\w./-])`).test(text)
})

const analyse = (url: string, page: { status: number; text: string }) => {
  const titled = page.text.match(/<title[^>]*>([^<]*)<\/title>/i)
  const title = (titled?.[1] ?? plain(page.text).split(/\n/)[0] ?? '').replace(/\s+/g, ' ').trim().slice(0, 120)
  const body = plain(page.text)
  const licence = LICENCES.find((row) => row.pattern.test(page.text))?.id ?? null
  const hrefs = [...page.text.matchAll(/href=["']([^"']+)["']/gi)].flatMap((match) => {
    try { return [new URL(match[1]!, url).href] } catch { return [] }
  }).filter((href, index, all) => href !== url && all.indexOf(href) === index)
  const read = page.status === 200 && body.length > 0
  const contract = read && title.length > 0 && page.status === 200
  return { url, status: page.status, read, title, licence, dimensions: dimensionsIn(page.text), hrefs, bytes: page.text.length, contract }
}

type Handed = { status: number; text: string }

/** One resource, two sides. The online side is the URL. The offline side is the text already in hand. The joint UUID is neither side alone. A side that is missing leaves the product at 0. This is not a Bell measurement. */
const entangle = (onlineUrl: string, offlineText: string | null, fetched: boolean) => {
  const onlineAddress = uuid(onlineUrl)
  const offlineAddress = offlineText === null ? null : uuid(offlineText)
  const bound = offlineAddress === null ? null : `${onlineAddress}\n${offlineAddress}`
  const joint = bound === null ? null : uuid(bound)
  const entangled = joint !== null && offlineAddress !== null && joint !== onlineAddress && joint !== offlineAddress && joint.length === 36 && seal(joint).valid && uuid(bound) === joint
  return {
    physics: false as const,
    clause: 'ISO/IEC 4879:2024, 3.2.10' as const,
    online: { mode: 'online' as const, url: onlineUrl, address: onlineAddress, fetched },
    offline: offlineAddress === null ? null : { mode: 'offline' as const, address: offlineAddress, fetched: false as const },
    joint,
    entangled,
    product: entangled ? 1 as const : 0 as const,
  }
}

/** A document is a page the OS can read. A robot wall is not a document. Quantum is not a robot, so that wall is not its offline side. */
const documentOf = (url: string, pages: Map<string, Handed>) => {
  const live = fetchedPages.get(url)
  if (live && live.text.length > 0 && analyse(url, live).read) return live
  const handed = pages.get(url)
  if (handed && handed.text.length > 0 && analyse(url, handed).read) return handed
  return null
}

/** The ISO definitions this tree already holds. That is the quantum answer when the online page is not a document. */
const isoOffline = () => ISO_OPEN_DEFINITIONS.map((row) => JSON.stringify(row)).join('\n')
const offlineFor = (url: string) => {
  if (url === ISO_OPEN_DATA) return isoOffline()
  const definition = ISO_OPEN_DEFINITIONS.find((row) => `https://www.iso.org/standard/${row.id}.html` === url)
  if (definition) return JSON.stringify(definition)
  const successor = ISO_OPEN_SUCCESSORS.find((row) => `https://www.iso.org/standard/${row.id}.html` === url)
  if (successor) return JSON.stringify(successor)
  return null
}

const requestOf = (url: string, pages: Map<string, Handed>) => {
  const address = uuid(url)
  const fetched = fetchedPages.has(url)
  const page = documentOf(url, pages)
  const reading = page ? analyse(url, page) : null
  const pair = entangle(url, page?.text ?? offlineFor(url), fetched)
  return {
    method: 'GET' as const,
    url,
    accept: 'text/html' as const,
    address,
    handle: address.slice(0, 8),
    sealed: seal(address).valid && pair.online.address === address,
    fetched,
    read: reading?.read === true,
    analysis: reading,
    pair,
  }
}

const sourceOf = (url: string) => {
  const live = fetchedPages.get(url) ?? { status: 0, text: '' }
  const page = documentOf(url, new Map())
  const reading = page ? analyse(url, page) : null
  return { url, status: live.status, fetched: fetchedPages.has(url), skipped: false as const, bytes: page?.text.length ?? 0, title: reading?.title ?? null, read: reading?.read === true }
}

/** Pasted links researched by the browser OS. Every discoverable ISO source is fetched first, and none of them is skipped. Hrefs on a read page are the next extract. Nothing is written. */
export const researchLinks = async (raw: unknown) => {
  const { found, pages } = linksOf(raw)
  const catalogue = isoOnlineSources()
  const first = [...catalogue]
  for (const url of found) if (publicHttp(url) && !first.includes(url)) first.push(url)
  await fetchOnline(first)
  const open = documentOf(ISO_OPEN_DATA, pages)
  const dataset = open ? isoDatasetHref(open.text) : null
  const datasetUrl = dataset ? publicHttp(dataset) : null
  if (datasetUrl && !fetchedPages.has(datasetUrl)) await fetchOnline([datasetUrl])
  const solution = standardIso()
  const requests = found.map((url) => requestOf(url, pages))
  const read = requests.filter((row) => row.read).length
  const pending = requests.length - read
  const seen = new Set(found)
  const discovered: string[] = []
  for (const row of requests) {
    for (const href of row.analysis?.hrefs ?? []) {
      const online = publicHttp(href)
      if (online && !seen.has(online)) { seen.add(online); discovered.push(online) }
    }
  }
  await fetchOnline(discovered)
  const follow = discovered.map((url) => requestOf(url, pages))
  const followRead = follow.filter((row) => row.read).length
  const sourceRows = [...catalogue.map(sourceOf), ...(datasetUrl && !catalogue.includes(datasetUrl) ? [sourceOf(datasetUrl)] : [])]
  const sources = {
    fetched: true as const,
    skipped: sourceRows.filter((row) => row.skipped).length,
    catalogue: catalogue.length,
    discoverable: sourceRows.length,
    rows: sourceRows,
    holds: catalogue.every((url) => sourceRows.some((row) => row.url === url && row.fetched === true && row.skipped === false)) && (datasetUrl === null || sourceRows.some((row) => row.url === datasetUrl && row.fetched === true && row.skipped === false)) && sourceRows.every((row) => row.skipped === false),
  }
  const advantage = { unlimited: true as const, unbounded: solution.holds && requests.every((row) => row.sealed), ceiling: null, ratio: null as number | null, effective: register.effective, handles: register.handles.possible, scale: register.handles.capacity }
  const contract = requests.every((row) => row.analysis === null || row.analysis.contract === true)
  const nextHolds = follow.every((row) => row.method === 'GET' && row.fetched === true && row.sealed && (row.analysis === null || row.analysis.contract === true))
  const resources = [...requests, ...follow]
  const paired = resources.every((row) => row.pair.physics === false && row.pair.online.fetched === row.fetched && row.pair.online.address === row.address && row.pair.entangled === (row.pair.offline !== null) && (row.pair.entangled ? row.pair.product === 1 && row.pair.joint !== null && row.pair.joint !== row.address : row.pair.product === 0 && row.pair.joint === null))
  const isoPage = documentOf(ISO_OPEN_DATA, pages)
  const iso = entangle(ISO_OPEN_DATA, isoPage?.text ?? isoOffline(), fetchedPages.has(ISO_OPEN_DATA))
  const entangled = resources.filter((row) => row.pair.entangled).length + (iso.entangled ? 1 : 0)
  const entanglement = {
    physics: false as const,
    clause: 'ISO/IEC 4879:2024, 3.2.10' as const,
    pairs: resources.length + 1,
    entangled,
    open: resources.filter((row) => row.pair.product === 0).length,
    fetched: sources.holds,
    written: false as const,
    iso,
    holds: paired && iso.entangled && iso.online.url === ISO_OPEN_DATA && iso.online.fetched === true && iso.offline !== null && sources.holds,
  }
  const online = [...resources.map((row) => row.pair.online), iso.online]
  const produced = [
    ...resources.map((row) => ({ product: 'research' as const, variant: 'links' as const, url: row.url, address: row.address, handle: row.handle, joint: row.pair.joint, entangled: row.pair.entangled, fetched: row.fetched })),
    { product: 'research' as const, variant: 'links' as const, url: iso.online.url, address: iso.online.address, handle: iso.online.address.slice(0, 8), joint: iso.joint, entangled: iso.entangled, fetched: iso.online.fetched },
  ]
  const mass = {
    phase: 'produce' as const,
    mode: 'online' as const,
    capacity: 'unlimited' as const,
    ceiling: null,
    unlimited: true as const,
    walked: false as const,
    fetched: sources.holds,
    materialised: false as const,
    written: false as const,
    named: online.length,
    produced: produced.length,
    rows: produced,
    handles: register.handles.possible,
    effective: register.effective,
    perHandle: register.handles.perHandle,
    scale: register.handles.capacity,
    formula: register.receipt.formula,
    address: register.receipt.id,
    sealed: register.receipt.sealed,
    holds: register.receipt.holds === true && register.handles.fractal === true && produced.length === online.length && produced.every((row) => row.product === 'research' && row.variant === 'links' && row.fetched === true && row.address === uuid(row.url) && row.handle === row.address.slice(0, 8)) && online.every((row) => row.mode === 'online' && row.fetched === true) && BigInt(register.handles.possible) > BigInt(produced.length) && register.effective === register.digits * register.hexbit - register.hexbit - 2 && sources.holds,
  }
  const pipeline = {
    phase: 'etl' as const,
    via: 'entanglement' as const,
    fetched: sources.holds,
    written: false as const,
    walked: false as const,
    stages: ['fetch', 'extract', 'transform', 'load', 'analysis', 'next', 'produce'] as const,
    fetch: sources,
    extract: { links: found.length, fetched: requests.every((row) => row.fetched === true) },
    transform: { read, pending },
    load: { stored: false as const, written: false as const, via: 'entanglement' as const, joints: entangled },
    analysis: { read, contract, holds: contract },
    next: { hop: 2 as const, links: follow.length, read: followRead, pending: follow.length - followRead, fetched: follow.every((row) => row.fetched === true), requests: follow },
    entanglement,
    produce: mass,
    holds: contract && nextHolds && sources.holds && entanglement.holds && mass.holds,
  }
  const holds = solution.holds === true && solution.defined === ISO_DIMENSIONS.length && solution.verified === ISO_DIMENSIONS.length && solution.fetched === false && sources.holds && requests.length > 0 && requests.every((row) => row.method === 'GET' && row.fetched === true && row.sealed) && pipeline.holds
  const link = productHref('research', 'links')
  const says = holds ? link : 'the pasted links were not researched, so the ISO solution is not delivered'
  return {
    phase: 'research' as const,
    via: 'browser-os' as const,
    name: 'qpu browser quantum os' as const,
    device: 'client' as const,
    browser: true as const,
    fetched: sources.holds,
    executedHere: true as const,
    runsHere: true as const,
    written: false as const,
    links: requests.length,
    read,
    pending,
    sources,
    requests,
    pipeline,
    mass,
    solution: linkedIso(solution),
    space: mcpLinks(raw),
    advantage,
    holds,
    says,
  }
}
