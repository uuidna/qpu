import { aeadOpen, aeadSeal, bytesOf, ed25519PublicKey, ed25519Sign, ed25519Verify, fromHex, hexOf, hkdf, hmac, md5, sha256, sha512, utf8, x25519, type HashName } from '../core/crypt.js'
import { leanSource } from '../quantum/processing/unit/lean.js'
import { packageVersion } from '../quantum/processing/unit/version.js'
import { qpuCernCatalogsOf, qpuCernRecordsOf, qpuCiteOf, qpuFacesOf, qpuFailureOf, qpuHarnessesOf, qpuHexRegisterOf, qpuContentUuidOf, qpuHexCatalogOf, qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuInstallOf, qpuMcpDoorsOf, qpuMcpFuseOf, qpuMcpToolsListOf, qpuUuidReceiptOf } from '../quantum/processing/unit/index.js'
import { DOORS } from './discovery.js'
import { crossFormulaOf } from '../families/cross/index.js'
import { apiCallOf, apiOf, apiRegistryOf, apiSearchOf } from './api-door.js'
import { CryptFormulas } from '../families/crypt/index.js'
import { hologramStreamsOf } from '../families/holo/index.js'
import { certifyUnreachable, findAssignment, findColoring, findHamCycle, generalizedPetersen, pigeonhole, verifyColoring, verifyHamCycle, verifySat, verifySubsetSum, type Graph } from '../families/np/index.js'
import { chooseOf, mintOf, qpuLatticeNamesOf, tenOf, type QpuEnv } from '../quantum/processing/unit/index.js'
const L = { ...qpuLatticeNamesOf(), mintOf, chooseOf, tenOf }

type Args = Record<string, unknown>
// an unknown name is answered with every name that resolves it
const fail = (why: string, extra: Record<string, unknown> = {}) => {
  const choices = Object.entries(extra).find(([, v]) => Array.isArray(v))
  return { holds: false as const, denied: why, ...extra, resolve: choices ? `use one of the ${choices[0]}: ${(choices[1] as unknown[]).slice(0, 12).join(', ')}${(choices[1] as unknown[]).length > 12 ? ', …' : ''}` : `correct ${why}` }
}
const receiptOf = (name: string, value: unknown, holds: boolean) => qpuUuidReceiptOf(`fused ${name}`, qpuContentUuidOf(value), { holds }).uuid
const str = (x: unknown): string => (typeof x === 'string' ? x : '')
const num = (x: unknown, d: number): number => (typeof x === 'number' && Number.isSafeInteger(x) ? x : typeof x === 'string' && /^\d+$/.test(x) ? Number(x) : d)

// ---------------------------------------------------------------------------
// qpu_hex: run any hex program of any family
// ---------------------------------------------------------------------------

qpuMcpFuseOf('qpu_hex', {
  description: "Run a hex program: { uuid } or { family, program, params }, of any registered family ({} returns the catalogue; { doors: true } through any door lists the families). NEW HERE? Run the guide: { family: 'guide', program: ['families'] } is the menu, ['ways'] names every entry point, and ['formulas']/['example'] with { params: [i] } list and demonstrate the i-th family with a copy-paste call.",
  inputSchema: { type: 'object', properties: { uuid: { type: 'string' }, family: { type: 'string' }, program: { type: ['array', 'string'], items: { type: 'string' } }, params: { type: 'array', items: { type: 'integer' } } } },
  run: async (a, env) => {
    if (!a.uuid && !a.family) return qpuHexCatalogOf()
    let uuid = str(a.uuid)
    if (!uuid) {
      const program = Array.isArray(a.program) ? a.program.map(String) : str(a.program).split(',').map((x) => x.trim()).filter(Boolean)
      const params = Array.isArray(a.params) ? a.params.map(Number) : []
      try {
        uuid = qpuHexUuidOf({ family: str(a.family), program, params })
      } catch (e) {
        return fail('program', { reading: (e as Error).message })
      }
    }
    return qpuHexRunOf(uuid, undefined, env)
  },
})

// ---------------------------------------------------------------------------
// qpu_data: live public datasets against the unit's own values
// ---------------------------------------------------------------------------

// the unit's own deadline: tenOf(hexbit) milliseconds, ten seconds
const DEADLINE = L.tenOf(L.hexbit)
// once the network is found out of reach, the network work is skipped for a minute and answered with a warning
let offlineUntil = 0
const OFFLINE_WINDOW = L.tenOf(L.hexbit) * L.coins * L.n
const get = async (url: string, accept = 'application/json'): Promise<Response> => {
  const r = await fetch(url, { headers: { accept, 'user-agent': 'qpu.uuidna.com (+https://qpu.uuidna.com)' }, signal: AbortSignal.timeout(DEADLINE) })
  if (!r.ok) throw new Error(`${url} answered ${r.status}`)
  return r
}
const leanNat = (name: string): string | undefined => new RegExp(`def ${name} : Nat := (\\d+)`).exec(leanSource)?.[1]
const bellOf = (count: number): bigint[] => {
  const out: bigint[] = []
  let row = [1n]
  for (let i = 0; i < count; i++) {
    out.push(row[0]!)
    const next = [row[row.length - 1]!]
    for (const x of row) next.push(next[next.length - 1]! + x)
    row = next
  }
  return out
}
const catalanOf = (count: number): bigint[] => {
  const out = [1n]
  for (let i = 1; i < count; i++) out.push((out[i - 1]! * BigInt(2 * (2 * i - 1))) / BigInt(i + 1))
  return out
}
const SEQUENCES: Record<string, { name: string; of: (count: number) => bigint[] }> = { A000110: { name: 'Bell numbers', of: bellOf }, A000108: { name: 'Catalan numbers', of: catalanOf } }

/** A formula as an integer sequence: a unary formula over n = 0, 1, …, a binary one as its section f(2, n). The longest run
 *  of whole values is kept; it is a sequence when it has six terms and four distinct values. */
export type Sequence = { family: string; formula: string; fixed: number[]; terms: string[] }
const TERMS = L.mintOf(L.hexbit)
const sequenceOf = async (family: string, formula: string, fixed: number[]): Promise<Sequence | null> => {
  // a live formula is a reading, not a sequence: its terms are not run here
  if (qpuHexFamiliesOf().get(family)?.find((x) => x.name === formula)?.live) return null
  let best: string[] = [], run: string[] = []
  for (let n = 0; n < TERMS; n++) {
    let v: unknown
    try {
      v = ((await qpuHexRunOf(qpuHexUuidOf({ family, program: [formula], params: [...fixed, n] }), undefined, undefined, { store: false })) as { value?: unknown; holds?: boolean })
    } catch {
      v = undefined
    }
    const r = v as { value?: unknown; holds?: boolean } | undefined
    const x = r?.holds !== true ? null : typeof r.value === 'bigint' ? r.value.toString() : typeof r.value === 'number' && Number.isSafeInteger(r.value) && r.value >= 0 ? String(r.value) : typeof r.value === 'string' && /^\d+$/.test(r.value) ? r.value : null
    if (x === null) run = []
    else if ((run = [...run, x]).length > best.length) best = run
  }
  return best.length >= L.chooseOf(L.hexbit, L.coins) ? { family, formula, fixed, terms: best } : null
}
let sequences: Promise<Sequence[]> | undefined
/** Every formula of every family that is an integer sequence, read off the families rather than listed. */
export const qpuSequencesOf = (): Promise<Sequence[]> =>
  (sequences ??= (async () => {
    const out: Sequence[] = []
    for (const [family, formulas] of qpuHexFamiliesOf()) {
      if (DOORS.has(family)) continue
      for (const f of formulas) {
        if ((f.arity !== 1 && f.arity !== 2) || f.live) continue
        const s = await sequenceOf(family, f.name, f.arity === 2 ? [2] : [])
        if (s) out.push(s)
      }
    }
    return out
  })())

// the unit's own identities: its author and DOIs from the citation, its repositories from the install manifest
const citeOf = () => qpuCiteOf() as unknown as { author: { last: string; first: string; orcid: string }; doi: string; conceptdoi: string; prior?: { title?: string; doi?: string; conceptdoi?: string } }
const doisOf = () => {
  const c = citeOf()
  return [
    ...[c.doi, c.conceptdoi].map((doi) => ({ doi, title: undefined as string | undefined })),
    ...[c.prior?.doi, c.prior?.conceptdoi].filter((d): d is string => Boolean(d)).map((doi) => ({ doi, title: c.prior?.title })),
  ]
}
const reposOf = (): string[] =>
  Object.values((qpuInstallOf() as unknown as { cloudflare?: Record<string, string> }).cloudflare ?? {})
    .map((href) => /[?&]url=https:\/\/github\.com\/([^/]+\/[^/?#]+)/.exec(href)?.[1])
    .filter((r): r is string => Boolean(r))

const reading = async (source: string, a: Args, env?: QpuEnv) => {
  if (source === 'cern') {
    const recid = num(a.recid ?? a.id, qpuCernRecordsOf().records[L.n - L.n]?.recid ?? L.n - L.n)
    const row = qpuCernRecordsOf().records.find((r) => r.recid === recid)
    if (!row) return fail('recid', { recids: qpuCernRecordsOf().records.map((r) => r.recid) })
    const url = `https://opendata.cern.ch/api/records/${recid}`
    const d = ((await (await get(url)).json()) as { metadata?: { distribution?: { number_events?: number; number_files?: number }; title?: string } }).metadata
    const live = { title: d?.title, events: d?.distribution?.number_events, files: d?.distribution?.number_files }
    const agrees = live.events === row.events && live.files === row.files && row.files * row.q + row.r === row.events
    return { source, url, reading: live, expected: { events: row.events, files: row.files, theorem: `${row.files} * ${row.q} + ${row.r} = ${row.events}` }, agrees }
  }
  if (source === 'nist') {
    const url = 'https://physics.nist.gov/cuu/Constants/Table/allascii.txt'
    const text = await (await get(url, 'text/plain')).text()
    const digitsOf = (quantity: string) => {
      const line = text.split('\n').find((l) => l.startsWith(`${quantity} `))
      const value = line?.slice(60, 85).trim() ?? ''
      return { value, digits: value.replace(/e.*$/, '').replace(/[^0-9]/g, '').replace(/^0+/, ''), exact: line?.includes('(exact)') ?? false }
    }
    const live = { planck: digitsOf('Planck constant'), boltzmann: digitsOf('Boltzmann constant') }
    const expected = { planck: leanNat('planck'), boltzmann: leanNat('boltzmann') }
    return { source, url, reading: live, expected, agrees: live.planck.digits === expected.planck && live.boltzmann.digits === expected.boltzmann && live.planck.exact && live.boltzmann.exact }
  }
  if (source === 'oeis') {
    const id = str(a.id) || 'A000110'
    const seq = SEQUENCES[id]
    if (!seq) return fail('sequence', { sequences: Object.keys(SEQUENCES) })
    const url = `https://oeis.org/search?q=id:${id}&fmt=json`
    const body = (await (await get(url)).json()) as { data?: string }[] | { results?: { data?: string }[] }
    const data = (Array.isArray(body) ? body[0]?.data : body.results?.[0]?.data) ?? ''
    const live = data.split(',').filter(Boolean).map((x) => BigInt(x))
    const mine = seq.of(live.length)
    const mismatches = live.flatMap((v, i) => (v === mine[i] ? [] : [i]))
    return { source, url, reading: { name: seq.name, terms: live.length, last: String(live.at(-1) ?? '') }, expected: { last: String(mine.at(-1) ?? ''), mismatches }, agrees: live.length > 0 && mismatches.length === 0 }
  }
  if (source === 'zenodo') {
    const concept = str(a.id) || '22700098'
    const url = `https://zenodo.org/api/records/${concept}/versions/latest`
    const d = (await (await get(url)).json()) as { id?: number; doi?: string; metadata?: { version?: string; publication_date?: string } }
    const live = { record: d.id, doi: d.doi, version: d.metadata?.version, published: d.metadata?.publication_date }
    return { source, url, reading: live, expected: { version: `v${packageVersion}` }, agrees: live.version === `v${packageVersion}` }
  }
  if (source === 'catalog') {
    const catalog = qpuCernCatalogsOf().catalogs.find((c) => c.name === str(a.name))
    if (!catalog) return fail('catalog', { catalogs: qpuCernCatalogsOf().catalogs.map((c) => c.name) })
    const body = (await (await get(catalog.href)).json()) as { hits?: { total?: number | { value?: number }; hits?: unknown[] }; total?: number; results?: unknown[]; count?: number }
    const total = body.hits?.total ?? body.total ?? body.count ?? body.results?.length ?? body.hits?.hits?.length
    const count = typeof total === 'number' ? total : typeof total === 'object' && total && typeof total.value === 'number' ? total.value : undefined
    return { source, url: catalog.href, reading: { name: catalog.name, total: count }, expected: { answers: 'records' }, agrees: count !== undefined && count > 0 }
  }
  if (source === 'sequence') {
    // identification: the formula's own terms searched in OEIS; it agrees when a sequence there holds them consecutively
    const family = str(a.family), formula = str(a.formula)
    const fixed = Array.isArray(a.fixed) ? a.fixed.map(Number) : []
    const seq = (await qpuSequencesOf()).find((s) => s.family === family && s.formula === formula && s.fixed.join() === fixed.join()) ?? (family && formula ? await sequenceOf(family, formula, fixed) : null)
    // a formula that exists but holds on fewer than six consecutive naturals (pVsNp: a mode is 0 or 1) is read, not
    // refused: the reading says how short its run is, and OEIS is not asked
    if (!seq && qpuHexFamiliesOf().get(family)?.some((f) => f.name === formula)) return { source, url: 'https://oeis.org', reading: { formula: `${family}.${formula}${fixed.length ? `(${fixed.join(',')}, n)` : '(n)'}`, terms: '', oeis: 'none', run: 'shorter than six terms' }, expected: { terms: 'six consecutive' }, warning: 'the formula holds on fewer than six consecutive naturals: no sequence to look up', agrees: false }
    if (!seq) return fail('sequence', { sequences: (await qpuSequencesOf()).map((s) => `${s.family}.${s.formula}`) })
    const terms = seq.terms.join(',')
    const url = `https://oeis.org/search?q=${terms}&fmt=json`
    const body = (await (await get(url)).json()) as { number?: number; name?: string; data?: string }[] | { results?: { number?: number; name?: string; data?: string }[] | null } | null
    const results = (Array.isArray(body) ? body : body?.results) ?? []
    const hit = results.find((r) => `,${r.data ?? ''},`.includes(`,${terms},`))
    const id = hit?.number !== undefined ? `A${String(hit.number).padStart(6, '0')}` : undefined
    return { source, url: id ? `https://oeis.org/${id}` : url, reading: { formula: `${family}.${formula}${fixed.length ? `(${fixed.join(',')}, n)` : '(n)'}`, terms, oeis: id ?? 'none', name: hit?.name ?? '', candidates: results.length }, expected: { terms }, agrees: id !== undefined }
  }
  if (source === 'datacite') {
    const doi = str(a.doi) || citeOf().doi
    const known = doisOf().find((d) => d.doi === doi)
    const url = `https://api.datacite.org/dois/${doi}`
    const d = ((await (await get(url, 'application/vnd.api+json')).json()) as { data?: { attributes?: { titles?: { title?: string }[]; creators?: { familyName?: string; name?: string }[]; publicationYear?: number; citationCount?: number; viewCount?: number; downloadCount?: number; versionCount?: number } } }).data?.attributes
    const creators = (d?.creators ?? []).map((c) => c.familyName ?? c.name ?? '')
    const live = { title: d?.titles?.[0]?.title, creators: creators.join('; '), year: d?.publicationYear, citations: d?.citationCount, views: d?.viewCount, downloads: d?.downloadCount, versions: d?.versionCount }
    const expected = { creator: citeOf().author.last, ...(known?.title ? { title: known.title } : {}) }
    return { source, url: `https://doi.org/${doi}`, reading: live, expected, agrees: creators.includes(expected.creator) && (!known?.title || live.title === known.title) }
  }
  if (source === 'orcid') {
    const { author } = citeOf()
    const id = author.orcid.replace(/^https?:\/\/orcid\.org\//, '')
    const url = `https://pub.orcid.org/v3.0/${id}`
    // the name ORCID puts on works is the credit name; the family name is the legal transliteration. The citation
    // carries the credit name, so either reading agreeing is the record naming this author.
    const d = (await (await get(url)).json()) as { person?: { name?: { 'family-name'?: { value?: string }; 'given-names'?: { value?: string }; 'credit-name'?: { value?: string } } }; 'activities-summary'?: { works?: { group?: unknown[] } } }
    const name = d.person?.name
    const live = { family: name?.['family-name']?.value, given: name?.['given-names']?.value, credit: name?.['credit-name']?.value, works: d['activities-summary']?.works?.group?.length }
    const expected = { credit: `${author.first} ${author.last}`, family: author.last, given: author.first }
    return { source, url: author.orcid, reading: live, expected, agrees: live.credit === expected.credit || (live.family === author.last && live.given === author.first) }
  }
  if (source === 'github') {
    const repo = str(a.repo) || reposOf()[0] || ''
    if (!reposOf().includes(repo)) return fail('repo', { repos: reposOf() })
    const url = `https://api.github.com/repos/${repo}`
    const d = (await (await get(url, 'application/vnd.github+json')).json()) as { private?: boolean; archived?: boolean; default_branch?: string; pushed_at?: string; stargazers_count?: number; forks_count?: number; open_issues_count?: number; license?: { spdx_id?: string } | null }
    const live = { branch: d.default_branch, pushed: d.pushed_at, license: d.license?.spdx_id ?? 'none', stars: d.stargazers_count, forks: d.forks_count, issues: d.open_issues_count }
    return { source, url: `https://github.com/${repo}`, reading: live, expected: { public: true, archived: false }, agrees: d.private === false && d.archived === false }
  }
  if (source === 'npm') {
    // the unit's package is named for its repository: github.com/owner/repo publishes @owner/repo
    const name = str(a.name) || (reposOf()[0] ? `@${reposOf()[0]}` : '')
    const url = `https://registry.npmjs.org/${name.replace('/', '%2f')}`
    const d = (await (await get(url)).json()) as { 'dist-tags'?: { latest?: string }; versions?: Record<string, unknown>; time?: { modified?: string } }
    const live = { latest: d['dist-tags']?.latest, versions: Object.keys(d.versions ?? {}).length, modified: d.time?.modified }
    return { source, url: `https://www.npmjs.com/package/${name}`, reading: live, expected: { latest: packageVersion }, agrees: live.latest === packageVersion }
  }
  if (source === 'apis') {
    // the API registry the unit fused, against theorem fuse: the APIs it listed then, read live now
    const fused = /theorem fuse : (\d+) \+ (\d+) = (\d+)/.exec(leanSource)
    const url = 'https://api.apis.guru/v2/metrics.json'
    const d = (await (await get(url)).json()) as { numAPIs?: number; numSpecs?: number; numEndpoints?: number; unreachable?: number; invalid?: number; fixes?: number }
    const live = { apis: d.numAPIs, specs: d.numSpecs, endpoints: d.numEndpoints, unreachable: d.unreachable, invalid: d.invalid }
    const expected = { apis: Number(fused?.[3]), theorem: fused ? `theorem fuse: ${fused[1]} + ${fused[2]} = ${fused[3]}` : 'theorem fuse missing' }
    return { source, url: 'https://apis.guru', reading: live, expected, agrees: live.apis === expected.apis }
  }
  if (source === 'site') {
    // the unit's own site, walked as the unit serves it: every address the sitemap names is asked of the Payload app the
    // unit hands browser pages to (in-process on Workers, the host over the network elsewhere), and a page agrees when
    // it answers 200 with a title. The reading is the site as a whole; each address that does not is named.
    const origin = (qpuCiteOf() as unknown as { href: string }).href
    const ask = async (path: string, accept: string, within = DEADLINE): Promise<Response> => {
      const request = new Request(`${origin}${path}`, { headers: { accept, 'user-agent': 'qpu.uuidna.com (+https://qpu.uuidna.com)' } })
      const door = env?.PAYLOAD ? env.PAYLOAD.fetch(request) : fetch(request)
      return Promise.race([door, new Promise<Response>((_, reject) => setTimeout(() => reject(new Error(`${path} did not answer within ${within === DEADLINE ? 'the deadline' : 'the window'}`)), within))])
    }
    // the sitemap is one read that gathers the whole site, and a cold isolate's first answer is Payload's initialisation:
    // it gets the window; every page then gets the deadline
    const sitemapAt = Date.now()
    const xml = await (await ask('/sitemap.xml', 'application/xml', OFFLINE_WINDOW)).text()
    const sitemapMs = Date.now() - sitemapAt
    const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!.replace(origin, '') || '/')
    // n addresses at a time: every page is rendered in this isolate, and sixty at once starve each other of the deadline
    const one = async (path: string) => {
      const at = Date.now()
      try {
        const r = await ask(path, 'text/html')
        const html = r.status === 200 ? await r.text() : ''
        const title = /<title>([^<]*)<\/title>/.exec(html)?.[1]?.trim() ?? ''
        return { path, status: r.status, title, ms: Date.now() - at }
      } catch (e) {
        return { path, status: 0, title: '', ms: Date.now() - at, error: (e as Error).message }
      }
    }
    // a slice per call: { from, take } with next, so no one call renders the whole site
    const total = paths.length
    const from = num(a.from, 0), take = num(a.take, qpuFacesOf().faces)
    const slice = paths.slice(from, from + take)
    const rows: Awaited<ReturnType<typeof one>>[] = []
    for (let i = 0; i < slice.length; i += L.n) rows.push(...(await Promise.all(slice.slice(i, i + L.n).map(one))))
    const failing = rows.filter((r) => r.status !== 200 || !r.title)
    const live = { sitemapMs, total, from, take: slice.length, ...(from + slice.length < total ? { next: from + slice.length } : {}), addresses: rows.length, answered: rows.filter((r) => r.status === 200).length, titled: rows.filter((r) => r.title).length, slowest: rows.reduce((a, b) => (b.ms > a.ms ? b : a), rows[0] ?? { path: '', ms: 0 }).path, failing: failing.map((r) => `${r.path} ${r.status}${r.error ? ` ${r.error}` : ''}`) }
    return { source, url: `${origin}/sitemap.xml`, reading: live, expected: { answered: rows.length, titled: rows.length }, agrees: rows.length > L.n - L.n && failing.length === L.n - L.n, rows }
  }
  if (source === 'release') {
    // the GitHub Release of the served version: the tag v<version> exists, is published, and carries notes
    const repo = reposOf()[0] ?? ''
    const url = `https://api.github.com/repos/${repo}/releases/tags/v${packageVersion}`
    const d = (await (await get(url, 'application/vnd.github+json')).json()) as { tag_name?: string; name?: string; published_at?: string; draft?: boolean; prerelease?: boolean; body?: string; html_url?: string }
    const live = { tag: d.tag_name, name: d.name, published: d.published_at, draft: d.draft, prerelease: d.prerelease, notes: (d.body ?? '').length }
    return { source, url: d.html_url ?? `https://github.com/${repo}/releases`, reading: live, expected: { tag: `v${packageVersion}`, published: true }, agrees: live.tag === `v${packageVersion}` && d.draft === false && typeof d.published_at === 'string' && live.notes > 0 }
  }
  if (source === 'patents') {
    // PATENTS, FUSED. The registry's own patent authority is USPTO's bulk data (files, not search). Search is
    // PatentsView, whose API answers with a key the operator holds as a Worker secret (PATENTSVIEW_API_KEY); without
    // it the reading says so and resolves it. A query is the inventor's last name; the reading is the patents found —
    // numbers, dates, counts — for discovery.
    const inventor = str(a.inventor) || 'Tesla'
    const key = (env as unknown as { PATENTSVIEW_API_KEY?: string } | undefined)?.PATENTSVIEW_API_KEY ?? (typeof process !== 'undefined' ? process.env.PATENTSVIEW_API_KEY : undefined)
    const bulk = await apiOf('uspto.gov:bdss')
    const bulkRead = bulk.operations.find((op) => op.verb === 'get' && op.required.length === 0)
    const bulkReading = bulkRead ? await apiCallOf(bulk.index, bulkRead.index) : undefined
    if (!key) {
      return { source, url: 'https://search.patentsview.org', reading: { inventor, bulk: bulkReading ? { url: bulkReading.url, status: bulkReading.status, why: bulkReading.why } : 'no read', search: 'needs a key' }, expected: { search: 'PatentsView answers with a key' }, agrees: false, warning: 'no PATENTSVIEW_API_KEY', resolve: 'set the Worker secret PATENTSVIEW_API_KEY (free at patentsview.org); the operator holds it, the unit never does' }
    }
    const q = encodeURIComponent(JSON.stringify({ _contains: { 'inventors.inventor_name_last': inventor } }))
    const fl = encodeURIComponent(JSON.stringify(['patent_id', 'patent_title', 'patent_date', 'patent_num_times_cited_by_us_patents']))
    const r = await fetch(`https://search.patentsview.org/api/v1/patent/?q=${q}&f=${fl}&o=${encodeURIComponent(JSON.stringify({ size: qpuFacesOf().faces }))}`, { headers: { accept: 'application/json', 'X-Api-Key': key }, signal: AbortSignal.timeout(DEADLINE) })
    if (!r.ok) throw new Error(`https://search.patentsview.org answered ${r.status}`)
    const d = (await r.json()) as { patents?: { patent_id: string; patent_title: string; patent_date: string; patent_num_times_cited_by_us_patents?: number }[]; total_hits?: number }
    const live = { inventor, total: d.total_hits, patents: (d.patents ?? []).map((p) => ({ id: p.patent_id, title: p.patent_title, date: p.patent_date, cited: p.patent_num_times_cited_by_us_patents })), bulk: bulkReading ? { url: bulkReading.url, status: bulkReading.status } : undefined }
    return { source, url: 'https://search.patentsview.org', reading: live, expected: { total: '>= 1' }, agrees: (d.total_hits ?? 0) > 0 }
  }
  if (source === 'authors') {
    // THE WORK OF THE CITED AUTHORS. The unit cites by DOI and ORCID; the record around those is read live: each cited
    // DOI's creators, year and citation count from DataCite, and for every creator with an ORCID their works (ORCID)
    // and the works Crossref indexes for that ORCID — titles, years, DOIs, counts — as readings whose numbers go to
    // discovery. A slice of faces readings per call, from `from`.
    const from = num(a.from, 0), take = num(a.take, qpuFacesOf().faces)
    const cite = citeOf()
    const dois = doisOf().map((d) => d.doi)
    const creators = new Map<string, { name: string; orcid?: string }>()
    const works: { doi: string; title?: string; year?: number; citations?: number; creators: string[] }[] = []
    for (const doi of dois) {
      const d = ((await (await get(`https://api.datacite.org/dois/${doi}`, 'application/vnd.api+json')).json()) as { data?: { attributes?: { titles?: { title?: string }[]; publicationYear?: number; citationCount?: number; creators?: { name?: string; nameIdentifiers?: { nameIdentifier?: string; nameIdentifierScheme?: string }[] }[] } } }).data?.attributes
      const names: string[] = []
      for (const c of d?.creators ?? []) {
        const orcid = c.nameIdentifiers?.find((x) => x.nameIdentifierScheme === 'ORCID')?.nameIdentifier?.replace(/^https?:\/\/orcid\.org\//, '')
        if (c.name) { names.push(c.name); creators.set(orcid ?? c.name, { name: c.name, ...(orcid ? { orcid } : {}) }) }
      }
      works.push({ doi, title: d?.titles?.[0]?.title, year: d?.publicationYear, citations: d?.citationCount, creators: names })
    }
    const own = cite.author.orcid.replace(/^https?:\/\/orcid\.org\//, '')
    if (!creators.has(own)) creators.set(own, { name: `${cite.author.first} ${cite.author.last}`, orcid: own })
    const authors = [...creators.values()].slice(from, from + take)
    const around = await Promise.all(authors.map(async (c) => {
      if (!c.orcid) return { ...c, works: works.filter((w) => w.creators.includes(c.name)).length }
      const o = (await (await get(`https://pub.orcid.org/v3.0/${c.orcid}/works`)).json()) as { group?: { 'work-summary'?: { title?: { title?: { value?: string } }; 'publication-date'?: { year?: { value?: string } }; type?: string }[] }[] }
      const summaries = (o.group ?? []).map((g) => g['work-summary']?.[0]).filter(Boolean) as NonNullable<NonNullable<typeof o.group>[number]['work-summary']>[number][]
      const cr = (await (await get(`https://api.crossref.org/works?filter=orcid:${c.orcid}&rows=0&mailto=ceccec@psg.bg`)).json().catch(() => ({}))) as { message?: { 'total-results'?: number } }
      return { ...c, works: summaries.length, years: [...new Set(summaries.map((w) => Number(w['publication-date']?.year?.value)).filter((y) => y > 0))].sort(), types: [...new Set(summaries.map((w) => w.type).filter(Boolean))], crossref: cr.message?.['total-results'] ?? null, titles: summaries.slice(0, 5).map((w) => w.title?.title?.value) }
    }))
    const live = { cited: works, authors: around, from, take: around.length, ...(from + around.length < creators.size ? { next: from + around.length } : {}) }
    return { source, url: 'https://api.datacite.org', reading: live, expected: { authors: '>= 1', works: '>= 1' }, agrees: around.length > 0 && around.some((x) => x.works > 0) }
  }
  if (source === 'research') {
    // the research a human request needs, done by the registry: a family's formula names are the words, the APIs they
    // find are read, and their numbers go to discovery with every other live reading
    const family = str(a.family) || 'cal'
    const formulas = qpuHexFamiliesOf().get(family)
    if (!formulas) return fail('family', { families: [...qpuHexFamiliesOf().keys()] })
    // the words: the family's formula names, or the words given (a lead's own); `from` continues the scan of the
    // matched documents where the last call stopped, so a deep research reads every API the words name, slice by slice
    const given = Array.isArray(a.words) ? a.words.map(String) : typeof a.words === 'string' ? a.words.split(/[\s,]+/) : []
    const words = given.length ? given : [...new Set([family, ...formulas.flatMap((f) => f.name.replace(/[A-Z]/g, (c) => ` ${c.toLowerCase()}`).split(' '))])]
    const from = typeof a.from === 'number' ? a.from : 0
    const found = await apiSearchOf(words, qpuFacesOf().faces, from)
    if (found.matched === 0) {
      // a family no API is named by (clay: riemann, hodge, navier, stokes) is tested on the dataset instead: each of
      // its formulas' terms looked up in OEIS; matched counts the sequences identified, read the formulas looked up
      const looked = await Promise.all(formulas.slice(0, qpuFacesOf().faces).map(async (x) => { const r = (await qpuDataOf('sequence', { family, formula: x.name }, env)) as { agrees?: boolean; warning?: string; reading?: { oeis?: string; terms?: string } }; return { formula: x.name, oeis: r.reading?.oeis, terms: r.reading?.terms, warning: r.warning, agrees: r.agrees === true } }))
      const live = { family, words: found.words, matched: looked.filter((x) => x.oeis && x.oeis !== 'none').length, scanned: found.scanned, read: looked.length, dataset: 'OEIS', readings: looked }
      return { source, url: 'https://oeis.org', reading: live, expected: { matched: '>= 1', answered: '>= 1' }, agrees: looked.length > 0 && looked.some((x) => (x.oeis !== undefined && x.oeis !== 'none') || x.warning !== undefined) }
    }
    const reads = await Promise.all(found.apis.filter((x) => x.free !== undefined).slice(0, qpuFacesOf().faces).map(async (x) => apiCallOf(x.index, x.free!)))
    const live = { family, words: found.words, matched: found.matched, from, scanned: found.scanned, ...(found.next !== undefined ? { next: found.next } : {}), read: reads.length, readings: reads.map((r) => ({ api: r.api, status: r.status, url: r.url, hex: r.hex, excerpt: r.excerpt })) }
    return { source, url: 'https://apis.guru', reading: live, expected: { matched: '>= 1', answered: '>= 1' }, agrees: found.matched > 0 && reads.some((r) => r.status > 0) }
  }
  if (source === 'ask') {
    // THE CHAT: a question in words answered by the formula its words name. The words of the question are crossed
    // with the words of every family and formula; the formula whose words the question covers best is the one asked;
    // the numbers in the question are its parameters, in order; the answer is the value at the address, with the
    // receipt, and the sentence that states it. A question that names no formula, or too few numbers, says what it
    // would need. Precision is the address's: the answer is the run, not a guess.
    const q = str(a.about)
    if (!q) return fail('about', { about: 'a question in words, with its numbers' })
    const wordsOf = (s: string) => s.replace(/[A-Z]/g, (c) => ` ${c.toLowerCase()}`).toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 1)
    const asked = new Set(wordsOf(q))
    const numbers = (q.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number).filter((x) => Number.isSafeInteger(x) && x >= 0)
    // THE CONNECTOR, IN CHAT: before matching a formula, the chat answers the connector's own capabilities — how to
    // connect from a coding agent, what tools and doors there are, and what families it speaks. The chat is the
    // connector: ask it to connect, to list, or to compute, and it answers from the live surface, not a guess.
    const cw = new Set(wordsOf(q))
    const has = (...ks: string[]) => ks.some((k) => cw.has(k))
    if (numbers.length === 0 && has('connect', 'connector', 'install', 'setup', 'configure', 'add') && has('mcp', 'connector', 'agent', 'claude', 'cursor', 'code', 'server', 'you')) {
      const h = qpuHarnessesOf()
      return { source, url: h.url, reading: { question: q, answer: `Add the MCP server ${h.name} at ${h.url} — ${h.rows.find((r) => r.harness === 'Claude Code')?.how}`, connect: h.rows.map((r) => ({ harness: r.harness, how: r.how })), mcpUrl: h.url, auth: h.auth }, expected: { harnesses: '>= 1' }, agrees: h.holds === true }
    }
    if (numbers.length === 0 && has('tools', 'tool', 'doors', 'door', 'capabilities', 'capability', 'offer', 'use')) {
      const doors = qpuMcpDoorsOf()
      return { source, url: `${(qpuCiteOf() as { href: string }).href}/mcp`, reading: { question: q, answer: `${qpuMcpToolsListOf().length} tools; through them ${doors.doors.length} doors and ${doors.formulas.length} formulas`, tools: qpuMcpToolsListOf().length, doors: doors.doors.map((d) => d.name), formulas: doors.formulas.length }, expected: { tools: '>= 1' }, agrees: true }
    }
    if (numbers.length === 0 && has('families', 'family', 'formulas')) {
      const fams = [...qpuHexFamiliesOf()].filter(([f]) => !DOORS.has(f)).map(([f, fs]) => ({ family: f, formulas: fs.map((x) => x.name) }))
      return { source, url: `${(qpuCiteOf() as { href: string }).href}/families`, reading: { question: q, answer: `${fams.length} families: ${fams.map((f) => f.family).join(', ')}`, families: fams }, expected: { families: '>= 1' }, agrees: fams.length > 0 }
    }
    const candidates = [...qpuHexFamiliesOf()].filter(([fam]) => !DOORS.has(fam)).flatMap(([family, formulas]) => formulas.filter((x) => !x.live).map((x) => {
      const fw = wordsOf(family), xw = wordsOf(x.name)
      const own = [...new Set([...fw, ...xw])]
      const covered = own.filter((w) => asked.has(w))
      // the formula's own words covered, weighted: a formula word counts twice a family word; ties go to the exact arity
      const score = covered.reduce((s, w) => s + (xw.includes(w) ? 2 : 1), 0) + (x.arity === numbers.length ? 0.5 : 0)
      return { family, name: x.name, arity: x.arity, score, covered, missing: own.filter((w) => !asked.has(w)) }
    })).filter((c) => c.score > 0).sort((x, y) => y.score - x.score)
    const best = candidates[0]
    if (!best) return { source, url: `${(qpuCiteOf() as { href: string }).href}/families`, reading: { question: q, answer: 'no formula is named by these words', families: [...qpuHexFamiliesOf().keys()].filter((f) => !DOORS.has(f)) }, expected: { formula: 'named' }, agrees: false }
    const params = numbers.slice(0, best.arity)
    if (params.length < best.arity) return { source, url: `${(qpuCiteOf() as { href: string }).href}/${best.family}`, reading: { question: q, formula: `${best.family}.${best.name}`, needs: best.arity, given: numbers.length, answer: `${best.family}.${best.name} takes ${best.arity} number${best.arity === 1 ? '' : 's'}; the question gives ${numbers.length}` }, expected: { numbers: best.arity }, agrees: false }
    const hex = qpuHexUuidOf({ family: best.family, program: [best.name], params })
    const r = (await qpuHexRunOf(hex, undefined, env, { store: false })) as { value?: unknown; holds?: boolean; receipt?: string; steps?: { reading?: { formula?: string } }[] }
    const value = typeof r.value === 'bigint' ? r.value.toString() : typeof r.value === 'object' && r.value !== null && 'value' in r.value ? String((r.value as { value: unknown }).value) : String(r.value)
    const alternatives = candidates.slice(1, 4).filter((c) => c.score === best.score).map((c) => `${c.family}.${c.name}`)
    const live = { question: q, formula: `${best.family}.${best.name}`, params, hex, value, holds: r.holds === true, receipt: r.receipt, answer: `${best.family}.${best.name}(${params.join(', ')}) = ${value}${r.holds === true ? '' : ' — the formula does not hold on these numbers'}${r.steps?.[0]?.reading?.formula ? ` (${r.steps[0].reading.formula})` : ''}`, covered: best.covered, ...(alternatives.length ? { alternatives } : {}) }
    return { source, url: `${(qpuCiteOf() as { href: string }).href}/${hex}`, reading: live, expected: { holds: true }, agrees: r.holds === true }
  }
  if (source === 'collisions') {
    // SO MUCH LEADS FROM HERE: the CERN Open Data catalogue — 66k records — read live and keyless. The verified record
    // 38 proved events = files · q + r against theorem cern; every other record is the same arithmetic unproven, a
    // lead. This walks a slice (from the page), reads each record's events and files, and when both are present the
    // integer quotient and remainder are the candidate relation; a human (or a new theorem) crosses it. `from` is the page.
    const page = typeof a.from === 'number' && a.from > 0 ? a.from : 1
    const url = `https://opendata.cern.ch/api/records?size=${qpuFacesOf().faces}&page=${page}&type=Dataset&sort=mostrecent`
    const body = (await get(url).then((x) => x.json()).catch(() => null)) as { hits?: { total?: { value?: number } | number; hits?: { id?: number; metadata?: { title?: string; distribution?: { number_events?: number; number_files?: number } } }[] } } | null
    const hits = body?.hits?.hits ?? []
    const total = typeof body?.hits?.total === 'object' ? body?.hits?.total?.value : body?.hits?.total
    const leads = hits.map((h) => { const ev = h.metadata?.distribution?.number_events, fi = h.metadata?.distribution?.number_files; const rel = ev && fi && fi > 0 ? { q: Math.floor(ev / fi), r: ev % fi, check: `${fi} · ${Math.floor(ev / fi)} + ${ev % fi} = ${ev}` } : undefined; return { id: h.id, title: (h.metadata?.title ?? '').slice(0, 80), events: ev, files: fi, ...(rel ? { relation: rel } : {}) } })
    const withCounts = leads.filter((l) => l.relation)
    const live = { total, page, ...(page * qpuFacesOf().faces < (total ?? 0) ? { next: page + 1 } : {}), read: leads.length, withCounts: withCounts.length, leads }
    return { source, url: 'https://opendata.cern.ch', reading: live, expected: { records: '>= 1' }, agrees: leads.length > 0 }
  }
  if (source === 'define') {
    // THE WORD, LOOKED UP — AND THE LEXICON AS LEADS. A word's meanings and phonetics come from the keyless Free
    // Dictionary (dictionaryapi.dev), its translation from the keyless MyMemory API — speech (how it sounds) and
    // translation, no token. And every dictionary/translation API the registry names is a lead for the next speech and
    // translation work. `about` is the word (default 'lead'), the very thing a lead is: a clue, a guide, a pointer.
    const word = (str(a.about) || 'lead').toLowerCase().split(/\s+/)[0]!
    const to = str(a.to) || 'es'
    const def = (await get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`).then((x) => x.json()).catch(() => null)) as { word?: string; phonetic?: string; phonetics?: { text?: string; audio?: string }[]; meanings?: { partOfSpeech?: string; definitions?: { definition?: string }[] }[] }[] | null
    const entry = Array.isArray(def) ? def[0] : null
    let meanings = (entry?.meanings ?? []).map((m) => ({ partOfSpeech: m.partOfSpeech, definition: m.definitions?.[0]?.definition }))
    // fallback to Wiktionary's keyless REST API when the Free Dictionary is down (it returned 522 on 2026-10-03)
    if (meanings.length === 0) {
      const wik = (await get(`https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(word)}`).then((x) => x.json()).catch(() => null)) as { en?: { partOfSpeech?: string; definitions?: { definition?: string }[] }[] } | null
      meanings = (wik?.en ?? []).map((m) => ({ partOfSpeech: m.partOfSpeech, definition: (m.definitions?.[0]?.definition ?? '').replace(/<[^>]+>/g, '').trim().slice(0, 160) || undefined }))
    }
    const phonetic = entry?.phonetic ?? entry?.phonetics?.find((p) => p.text)?.text
    const audio = entry?.phonetics?.find((p) => p.audio)?.audio
    const tr = (await get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|${to}`).then((x) => x.json()).catch(() => null)) as { responseData?: { translatedText?: string } } | null
    // the lexicon as leads: the registry's dictionary and translation APIs
    const found = await apiSearchOf(['dictionary', 'translate', 'translation', 'language', 'lexical', 'word', 'define', 'speech', 'phonetic'], qpuFacesOf().faces)
    const leads = found.apis.filter((x) => ['dictionary', 'translate', 'translation', 'language', 'lexical', 'speech'].some((w) => `${x.api} ${x.title}`.toLowerCase().includes(w))).map((x) => x.api)
    const live = { word, phonetic, audio, speech: Boolean(audio), meanings, translation: { to, text: tr?.responseData?.translatedText }, lexiconLeads: leads, matched: found.matched }
    return { source, url: 'https://dictionaryapi.dev + https://mymemory.translated.net', reading: live, expected: { meanings: '>= 1' }, agrees: meanings.length > 0 }
  }
  if (source === 'arxiv') {
    // OPEN RESEARCH AS LEADS: the newest arXiv preprints in a field (keyless Atom API) — the frontier, unsettled by
    // definition. Each is a lead: its title's words and numbers feed the discovery; `about` is the category (math.NT,
    // quant-ph, cs.CC …), `from` the 0-based start. The unit reads the frontier and sees what the lattice meets.
    const cat = str(a.about) || 'math'
    const start = typeof a.from === 'number' && a.from >= 0 ? a.from : 0
    const url = `http://export.arxiv.org/api/query?search_query=cat:${encodeURIComponent(cat)}*&sortBy=submittedDate&sortOrder=descending&start=${start}&max_results=${qpuFacesOf().faces}`
    const xml = await get(url, 'application/atom+xml').then((x) => x.text()).catch(() => '')
    const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((m) => m[1] ?? '')
    const field = (e: string, t: string) => (new RegExp(`<${t}[^>]*>([\s\S]*?)</${t}>`).exec(e)?.[1] ?? '').replace(/\s+/g, ' ').trim()
    const leads = entries.map((e) => { const title = field(e, 'title').slice(0, 120); return { id: field(e, 'id').split('/abs/')[1] ?? field(e, 'id'), title, numbers: (title.match(/\d+/g) ?? []).map(Number).filter((n) => Number.isSafeInteger(n) && n >= 3) } })
    const live = { category: cat, from: start, ...(entries.length === qpuFacesOf().faces ? { next: start + qpuFacesOf().faces } : {}), count: leads.length, numbers: [...new Set(leads.flatMap((l) => l.numbers))].slice(0, qpuFacesOf().faces), leads }
    return { source, url: 'https://arxiv.org', reading: live, expected: { open: '>= 1 preprint' }, agrees: leads.length > 0 }
  }
  if (source === 'unanswered') {
    // OPEN PROBLEMS AS LEADS: MathOverflow's unanswered questions, read over the keyless Stack Exchange API — research
    // mathematics nobody has answered. Each is a lead: its title's words and any numbers in it go to the discovery,
    // and a question whose value a family reaches is a cross worth a human's look; the rest stay open. The unit never
    // claims to answer them — it feeds them in and sees what the lattice meets. `from` is the 1-based page, `about` a tag.
    // like mathoverflow: every research Stack Exchange site serves an unanswered feed over the same keyless API —
    // theoretical CS, physics, statistics, quantum computing, economics, astronomy, scientific computing, and more
    const SITES = ['mathoverflow', 'cstheory', 'physics', 'stats', 'math', 'quantumcomputing', 'economics', 'astronomy', 'scicomp', 'cs', 'hsm', 'mathematica', 'stackoverflow', 'softwareengineering', 'ux', 'webmasters', 'codereview', 'graphicdesign', 'security', 'gamedev', 'dba', 'devops', 'ai']
    const site = SITES.includes(str(a.site)) ? str(a.site) : 'mathoverflow'
    const from = typeof a.from === 'number' && a.from > 0 ? a.from : 1
    const tag = str(a.about) ? `&tagged=${encodeURIComponent(str(a.about))}` : ''
    const url = `https://api.stackexchange.com/2.3/questions/no-answers?site=${site}&order=desc&sort=votes&pagesize=${qpuFacesOf().faces}&page=${from}${tag}`
    const body = (await get(url).then((x) => x.json()).catch(() => null)) as { items?: { question_id: number; title: string; tags: string[]; score: number; link: string }[]; has_more?: boolean; quota_remaining?: number } | null
    const items = body?.items ?? []
    const numbersOfTitle = (t: string) => (t.match(/\d+/g) ?? []).map(Number).filter((n) => Number.isSafeInteger(n) && n >= 3)
    const leads = items.map((q) => ({ id: q.question_id, title: q.title.replace(/&[a-z]+;/g, ' ').slice(0, 120), tags: q.tags, score: q.score, link: q.link, numbers: numbersOfTitle(q.title) }))
    const live = { site, sites: SITES, from, ...(body?.has_more ? { next: from + 1 } : {}), quota: body?.quota_remaining, count: leads.length, numbers: [...new Set(leads.flatMap((l) => l.numbers))].slice(0, qpuFacesOf().faces), leads }
    return { source, url: 'https://mathoverflow.net/unanswered', reading: live, expected: { open: '>= 1 unanswered question' }, agrees: leads.length > 0 }
  }
  if (source === 'law') {
    // THE COURT-ADMISSIBLE RECORD + THE CASE LAW: the official sources a court accepts as authoritative, read live and
    // keyless — US Federal Register, UK legislation, EU law (EUR-Lex) — and the CourtListener corpus (the Free Law
    // Project), walked by citation so the biggest cases and the firms of record surface as leads — plus the registry's
    // legal APIs. The search TERMS ARE FORMULATED from the law family's own formula names (no hand list): add a law
    // formula and the record researches its word. The review layer for the `law` family: a computed conclusion becomes
    // advice only when confirmed TRUE against one of these documents; `about` searches them, `from` walks the registry.
    // One irreducible anchor word set (the domain word a formula cannot name); the rest is the family, split to words.
    const seed = ['law', 'legal', 'court', 'case', 'jurisdiction']
    const terms = [...new Set([...seed, ...(qpuHexFamiliesOf().get('law') ?? []).flatMap((x) => x.name.replace(/[A-Z]/g, (c) => ` ${c.toLowerCase()}`).split(/[^a-z]+/)).filter((w) => w.length > 2)])]
    const ask = str(a.about) ? str(a.about).toLowerCase().split(/[\s,]+/).filter(Boolean) : []
    const from = typeof a.from === 'number' ? a.from : 0
    const nums = (t: string) => (t.match(/\d+/g) ?? []).map(Number).filter((n) => Number.isSafeInteger(n) && n >= 3)
    type Src = { source: string; title: string; jurisdiction: string; secured: boolean; operation: string; status: number; url: string; records?: number; keyless: boolean }
    const anchor: Src[] = []
    let cases: { case: string; court: string; citeCount: number; dateFiled?: string; firms: string[]; numbers: number[] }[] = []
    if (from === 0) {
      const terml = ask.length ? ask.join(' ') : terms.join(' ')
      const q = encodeURIComponent(terml)
      const clUrl = `https://www.courtlistener.com/api/rest/v4/search/?type=o&order_by=${encodeURIComponent('citeCount desc')}&q=${q}`
      const official = [
        { source: 'federalregister.gov', title: 'US Federal Register', jurisdiction: 'US', url: `https://www.federalregister.gov/api/v1/documents.json?per_page=1${ask.length ? `&conditions[term]=${q}` : ''}`, count: (b: Record<string, unknown>) => b.count as number | undefined },
        { source: 'legislation.gov.uk', title: 'UK legislation', jurisdiction: 'UK', url: `https://www.legislation.gov.uk/${ask.length ? `all?text=${q}&` : 'ukpga?'}results-count=1&format=json`, count: () => undefined },
        { source: 'data.europa.eu:eur-lex', title: 'EU law (EUR-Lex)', jurisdiction: 'EU', url: `https://data.europa.eu/api/hub/search/search?limit=1&q=${ask.length ? q : 'eur-lex'}`, count: (b: Record<string, unknown>) => (b.result as { count?: number } | undefined)?.count },
        { source: 'courtlistener.com', title: 'US case law (CourtListener / Free Law Project)', jurisdiction: 'US', url: clUrl, count: (b: Record<string, unknown>) => b.count as number | undefined },
      ]
      for (const o of official) {
        const b = (await get(o.url).then((x) => x.json()).catch(() => null)) as Record<string, unknown> | null
        const records = b ? o.count(b) : undefined
        anchor.push({ source: o.source, title: o.title, jurisdiction: o.jurisdiction, secured: false, operation: new URL(o.url).pathname, status: b ? 200 : 0, url: o.url, ...(typeof records === 'number' ? { records } : {}), keyless: b !== null })
      }
      // THE BIGGEST CASES AND THEIR FIRMS AS LEADS — ranked by the record's own citation count, not by hand
      const cl = (await get(clUrl).then((x) => x.json()).catch(() => null)) as { results?: Record<string, unknown>[] } | null
      cases = (cl?.results ?? []).slice(0, qpuFacesOf().faces).map((r) => {
        const name = str(r.caseName).replace(/\s+/g, ' ').slice(0, 120)
        const citeCount = num(r.citeCount, 0)
        const firms = [...new Set([str(r.attorney)].flatMap((s) => s.split(/[,;]| and /).map((w) => w.trim()).filter((w) => w.length > 3)))].slice(0, qpuFacesOf().faces)
        return { case: name, court: str(r.court) || str(r.court_id), citeCount, dateFiled: str(r.dateFiled) || undefined, firms, numbers: [...new Set([citeCount, ...nums(`${name} ${str(r.dateFiled)}`)])].filter((n) => n >= 3) }
      })
    }
    const found = await apiSearchOf([...terms, ...ask], qpuFacesOf().faces, from)
    const tokened = (s: string) => s.toLowerCase().split(/[^a-z]+/).some((w) => terms.includes(w))
    const matches = found.apis.filter((x) => tokened(x.api) || tokened(x.title))
    const reads = await Promise.all(matches.filter((x) => x.free !== undefined).slice(0, qpuFacesOf().faces).map(async (x) => { const api = await apiOf(x.index).catch(() => null); const r = await apiCallOf(x.index, x.free!).catch(() => null); return { source: x.api, title: x.title, jurisdiction: (x.categories[0] ?? 'registry'), secured: api?.secured === true, operation: x.operations[0]?.path ?? '', status: r?.status ?? 0, url: r?.url ?? '', keyless: api?.secured !== true && (r?.status ?? 0) === 200 } as Src }))
    const sources = [...anchor, ...reads]
    // the review: a legal claim can be confirmed when an authoritative source answered; reviewed = 1 only then
    const reviewed = sources.some((s) => s.keyless && s.status === 200) ? 1 : 0
    const live = { terms, about: ask, jurisdictions: [...new Set(anchor.map((s) => s.jurisdiction))], matched: found.matched, from, scanned: found.scanned, ...(found.next !== undefined ? { next: found.next } : {}), answered: sources.filter((s) => s.status > 0).length, keyless: sources.filter((s) => s.keyless).length, reviewed, advice: reviewed === 1 ? 'a claim confirmed on these documents is advice' : 'no authoritative document answered: computations stay leads, not advice', cases, numbers: [...new Set(cases.flatMap((c) => c.numbers))].slice(0, qpuFacesOf().faces), sources }
    return { source, url: 'https://www.federalregister.gov + https://www.legislation.gov.uk + https://data.europa.eu + https://www.courtlistener.com', reading: live, expected: { answered: '>= 1 authoritative source' }, agrees: sources.some((s) => s.keyless) || cases.length > 0 }
  }
  if (source === 'funding') {
    // FUSE THE OFFICIAL REGIONAL FUNDING: the public finds money for anything through the one door. Keyless official
    // sources are read first — the World Bank's projects (api.worldbank.org, no key) and the EU Open Data Portal's
    // datasets (data.europa.eu, no key) — then the registry's APIs whose words name funding (grant, tender, subsidy,
    // fund, finance, loan) are discovered and the keyless ones read. `about` narrows by programme, region or theme;
    // `from` walks the registry matches. Each answered source is a reading with its address — funding as a fused
    // public capability, no key, no hand list.
    const terms = ['fund', 'funding', 'grant', 'grants', 'tender', 'tenders', 'subsidy', 'subsidies', 'finance', 'loan', 'loans']
    const ask = str(a.about) ? str(a.about).toLowerCase().split(/[\s,]+/).filter(Boolean) : []
    const from = typeof a.from === 'number' ? a.from : 0
    type Fund = { source: string; title: string; region: string; secured: boolean; operation: string; status: number; url: string; records?: number; keyless: boolean }
    const anchor: Fund[] = []
    if (from === 0) {
      const q = ask.length ? encodeURIComponent(ask.join(' ')) : ''
      const official = [
        { source: 'worldbank.org:projects', title: 'World Bank projects & financing', region: 'global', url: `https://search.worldbank.org/api/v2/projects?format=json&rows=1${q ? `&qterm=${q}` : ''}`, count: (b: Record<string, unknown>) => (b.total as number | undefined) },
        { source: 'data.europa.eu:datasets', title: 'EU Open Data Portal (funding datasets)', region: 'eu', url: `https://data.europa.eu/api/hub/search/search?limit=1${q ? `&q=${q}` : '&q=funding'}`, count: (b: Record<string, unknown>) => ((b.result as { count?: number } | undefined)?.count) },
      ]
      for (const o of official) {
        const b = (await get(o.url).then((x) => x.json()).catch(() => null)) as Record<string, unknown> | null
        const records = b ? o.count(b) : undefined
        anchor.push({ source: o.source, title: o.title, region: o.region, secured: false, operation: new URL(o.url).pathname, status: b ? 200 : 0, url: o.url, ...(typeof records === 'number' ? { records } : {}), keyless: b !== null })
      }
    }
    const found = await apiSearchOf([...terms, ...ask], qpuFacesOf().faces, from)
    const tokened = (s: string) => s.toLowerCase().split(/[^a-z]+/).some((w) => terms.includes(w))
    const matches = found.apis.filter((x) => tokened(x.api) || tokened(x.title))
    const reads = await Promise.all(matches.filter((x) => x.free !== undefined).slice(0, qpuFacesOf().faces).map(async (x) => { const api = await apiOf(x.index).catch(() => null); const r = await apiCallOf(x.index, x.free!).catch(() => null); return { source: x.api, title: x.title, region: (x.categories[0] ?? 'registry'), secured: api?.secured === true, operation: x.operations[0]?.path ?? '', status: r?.status ?? 0, url: r?.url ?? '', keyless: api?.secured !== true && (r?.status ?? 0) === 200 } as Fund }))
    const sources = [...anchor, ...reads]
    const live = { terms, about: ask, matched: found.matched, named: matches.length, from, scanned: found.scanned, ...(found.next !== undefined ? { next: found.next } : {}), answered: sources.filter((s) => s.status > 0).length, keyless: sources.filter((s) => s.keyless).length, sources }
    return { source, url: 'https://api.worldbank.org + https://data.europa.eu + https://apis.guru', reading: live, expected: { answered: '>= 1 keyless official source' }, agrees: sources.some((s) => s.keyless) }
  }
  if (source === 'jobs') {
    // FUSE THE JOB BOARDS: the public searches for work through the one door. The registry's APIs whose words name
    // hiring (job, jobs, career, vacancy, hiring, employment, recruit, work, position) are found; the keyless ones
    // (no credential asked) are read live, their listing endpoints called; `about` narrows by role or place, `from`
    // walks the matches a slice at a time. Each answered board is a reading with its hex address — the job search as
    // a fused public capability, no key, no hand list.
    const terms = ['job', 'jobs', 'career', 'careers', 'vacancy', 'vacancies', 'hiring', 'employment', 'recruit', 'recruiting', 'position', 'positions']
    const ask = str(a.about) ? str(a.about).toLowerCase().split(/[\s,]+/).filter(Boolean) : []
    const from = typeof a.from === 'number' ? a.from : 0
    // the unit's own keyless board first: the INSPIRE jobs catalogue (research openings), always read, narrowed by `about`
    const inspire = qpuCernCatalogsOf().catalogs.find((c) => c.name === 'jobs')
    const anchor: { board: string; title: string; categories: string[]; secured: boolean; operation: string; status: number; url: string; openings?: number; keyless: boolean }[] = []
    if (inspire && from === 0) {
      const href = ask.length ? `${inspire.href}${inspire.href.includes('?') ? '&' : '?'}q=${encodeURIComponent(ask.join(' '))}` : inspire.href
      const r = (await get(href).then((x) => x.json()).catch(() => null)) as { hits?: { total?: number | { value?: number } } } | null
      const total = r?.hits?.total; const count = typeof total === 'number' ? total : (total as { value?: number } | undefined)?.value
      anchor.push({ board: 'inspirehep.net:jobs', title: 'INSPIRE-HEP jobs', categories: ['open_data'], secured: false, operation: '/api/jobs', status: r ? 200 : 0, url: href, ...(typeof count === 'number' ? { openings: count } : {}), keyless: r !== null })
    }
    // the registry boards: an API whose NAME or TITLE carries a hiring token as a whole word (not 'work' inside 'network')
    const found = await apiSearchOf([...terms, ...ask], qpuFacesOf().faces, from)
    const tokened = (s: string) => s.toLowerCase().split(/[^a-z]+/).some((w) => terms.includes(w))
    const matches = found.apis.filter((x) => tokened(x.api) || tokened(x.title))
    const reads = await Promise.all(matches.filter((x) => x.free !== undefined).slice(0, qpuFacesOf().faces).map(async (x) => { const api = await apiOf(x.index).catch(() => null); const r = await apiCallOf(x.index, x.free!).catch(() => null); return { board: x.api, title: x.title, categories: x.categories, secured: api?.secured === true, operation: x.operations[0]?.path ?? '', status: r?.status ?? 0, url: r?.url ?? '', keyless: api?.secured !== true && (r?.status ?? 0) === 200 } }))
    const boards = [...anchor, ...reads]
    const live = { terms, about: ask, matched: found.matched, boardsNamed: matches.length, from, scanned: found.scanned, ...(found.next !== undefined ? { next: found.next } : {}), answered: boards.filter((b) => b.status > 0).length, keyless: boards.filter((b) => b.keyless).length, boards }
    return { source, url: 'https://apis.guru + https://inspirehep.net', reading: live, expected: { answered: '>= 1 keyless board' }, agrees: boards.some((b) => b.keyless) }
  }
  if (source === 'ai') {
    // THE AI APIs THAT ANSWER FREE AND KEYLESS: the registry's machine_learning category and the APIs the request's
    // words name (ai, model, inference, language, vision, speech …), each document read for the credential it asks,
    // each free operation (a GET needing no parameter) called; keyless when the document asks no credential and the
    // operation answered 200. These are the remote agents a wave launches at no cost.
    const reg = await apiRegistryOf()
    const words = (str(a.about) || 'ai artificial intelligence machine learning model inference llm language vision speech translate nlp embedding neural').split(/[\s,]+/)
    const hit = (s: string) => words.some((w) => w.length > 1 && s.toLowerCase().split(/[^a-z]+/).includes(w.toLowerCase()))
    const named = reg.names.map((api, index) => ({ api, index, e: reg.entries[api] ?? {} })).filter(({ api, e }) => { const v = e.versions?.[e.preferred ?? '']; const cats = v?.info?.['x-apisguru-categories'] ?? []; return cats.includes('machine_learning') || hit(api) || hit(v?.info?.title ?? '') })
    const from = typeof a.from === 'number' ? a.from : 0
    const slice = named.slice(from, from + qpuFacesOf().faces)
    const read = await Promise.all(slice.map(async ({ index }) => {
      const api = await apiOf(index).catch(() => null)
      if (!api) return null
      const free = api.server ? api.operations.find((op) => op.verb === 'get' && op.required.length === 0) : undefined
      const r = free ? await apiCallOf(index, free.index).catch(() => null) : null
      return { api: api.api, title: api.title, categories: api.categories, secured: api.secured === true, operation: free ? `${free.verb} ${free.path}` : undefined, status: r?.status ?? 0, hex: r?.hex, keyless: api.secured !== true && r?.status === 200 }
    }))
    const apis = read.filter((x): x is NonNullable<typeof x> => x !== null)
    const live = { words, matched: named.length, from, scanned: slice.length, ...(from + slice.length < named.length ? { next: from + slice.length } : {}), keyless: apis.filter((x) => x.keyless).length, apis }
    return { source, url: 'https://apis.guru', reading: live, expected: { keyless: '>= 1 in the slice' }, agrees: apis.some((x) => x.keyless) }
  }
  if (source === 'payload') {
    // THE PAYLOAD RECORD, DEEP: the payloadcms/payload repository read through the GitHub API — its docs (every
    // section, every page), its templates and its examples — as the unit's own configuration vocabulary. A section
    // is crossed with the families whose formula words its pages name: what the unit configures with it.
    const repo = 'payloadcms/payload'
    const list = async (dir: string) => (await (await get(`https://api.github.com/repos/${repo}/contents/${dir}`, 'application/vnd.github+json')).json()) as { name: string; type: string; path: string }[]
    const [docs, templates, examples] = await Promise.all([list('docs'), list('templates'), list('examples')])
    const sections = (Array.isArray(docs) ? docs : []).filter((d) => d.type === 'dir').map((d) => d.name).sort()
    const c = typeof a.category === 'number' ? a.category : -1
    const section = sections[c]
    const pages = section ? (await list(`docs/${section}`)).filter((d) => d.type === 'file').map((d) => d.name.replace(/\.mdx?$/, '')) : []
    const wordsOf = (s: string) => s.replace(/[A-Z]/g, (ch) => ` ${ch.toLowerCase()}`).split(/[^a-z]+/).filter((w) => w.length > 2)
    const pageWords = new Set([...(section ? wordsOf(section) : []), ...pages.flatMap(wordsOf)])
    const families = section ? [...qpuHexFamiliesOf()].filter(([f]) => !DOORS.has(f)).map(([family, formulas]) => ({ family, formulas: formulas.filter((x) => [...new Set([...wordsOf(family), ...wordsOf(x.name)])].some((w) => pageWords.has(w))).map((x) => x.name) })).filter((x) => x.formulas.length) : []
    // DETAILED AND PRECISE: the selected section's pages are read as CONTENT, not names — the exact API vocabulary (the
    // backticked identifiers a doc uses: field types, hook names, config keys) is extracted. A term no family's words
    // name is a LEAD toward covering that API; a term a family already names is a COMBINATION (that API × that family).
    const raw = async (page: string) => (await get(`https://raw.githubusercontent.com/${repo}/main/docs/${section}/${page}.mdx`, 'text/plain').then((r) => r.text()).catch(() => ''))
    const contents = section ? await Promise.all(pages.slice(0, qpuFacesOf().faces).map(raw)) : []
    const terms = [...new Set(contents.flatMap((txt) => [...txt.matchAll(/`([a-zA-Z][a-zA-Z0-9]{2,})`/g)].map((m) => m[1]!.toLowerCase())))].sort()
    const famWords = new Set([...qpuHexFamiliesOf()].filter(([f]) => !DOORS.has(f)).flatMap(([f, fs]) => [...wordsOf(f), ...fs.flatMap((x) => wordsOf(x.name))]))
    const leads = terms.filter((t) => !famWords.has(t))
    const combinations = terms.filter((t) => famWords.has(t))
    const details = section ? { read: contents.filter((c) => c.length > 0).length, terms: terms.length, leads: leads.slice(0, 48), combinations } : undefined
    // THE REFERENCE APP, THE PAYLOAD WAY: payloadcms/website is read as the guide — its src directories, its blocks and
    // its collections are how a Payload site is handled; a directory or block it has that the unit's generated layout
    // does not is a lead toward the payload way (crossed at build by scripts/payload-cloudflare.mjs). Read once here.
    const site = async (dir: string) => ((await (await get(`https://api.github.com/repos/payloadcms/website/contents/${dir}`, 'application/vnd.github+json')).json()) as { name: string; type: string }[] | { message?: string })
    const nameOf = (x: unknown) => (Array.isArray(x) ? x.filter((e) => e.type === 'dir').map((e) => e.name).sort() : [])
    const fileNames = (x: unknown) => (Array.isArray(x) ? x.filter((e) => e.type === 'dir' || /\.tsx?$/.test(e.name)).map((e) => e.name.replace(/\.tsx?$/, '')).filter((n) => n !== 'index').sort() : [])
    const [siteSrc, siteBlocks, siteCollections] = await Promise.all([site('src'), site('src/blocks'), site('src/collections')])
    const website = { repo: 'payloadcms/website', dirs: nameOf(siteSrc), blocks: fileNames(siteBlocks), collections: fileNames(siteCollections) }
    // PAYLOAD AND ITS PLUGINS, IN DETAIL: the monorepo's packages/ holds every official extension — the plugins
    // (plugin-*), the database adapters (db-*), the storage adapters (storage-*), the rich-text (richtext-*) and the
    // email adapters (email-*). Each is read and classed, and crossed with the families whose formula words it names;
    // the ones the unit fuses in its own config are the kernel's Payload skill. A package the unit does not yet fuse
    // is a lead toward covering Payload in full.
    const packages = (Array.isArray(await list('packages')) ? (await list('packages')) : []).filter((p) => p.type === 'dir').map((p) => p.name).sort()
    const classOf = (p: string) => (p.startsWith('plugin-') ? 'plugin' : p.startsWith('db-') ? 'db adapter' : p.startsWith('storage-') ? 'storage adapter' : p.startsWith('richtext-') ? 'rich text' : p.startsWith('email-') ? 'email adapter' : p.startsWith('translations') || p.startsWith('ui') || p.startsWith('next') || p.startsWith('graphql') ? 'core' : 'package')
    // the Payload extensions the unit fuses in its own config (the generator's set), to mark coverage against packages/
    const fused = new Set(['plugin-ecommerce', 'plugin-form-builder', 'plugin-import-export', 'plugin-mcp', 'plugin-multi-tenant', 'plugin-nested-docs', 'plugin-redirects', 'plugin-search', 'plugin-sentry', 'plugin-seo', 'plugin-stripe', 'db-d1-sqlite', 'db-postgres', 'storage-s3', 'richtext-lexical', 'email-resend'])
    const ecosystem = packages.map((p) => ({ package: p, kind: classOf(p), fused: fused.has(p), families: [...qpuHexFamiliesOf()].filter(([ff]) => !DOORS.has(ff)).filter(([ff, fs]) => [...new Set([...wordsOf(ff), ...fs.flatMap((x) => wordsOf(x.name))])].some((w) => wordsOf(p).includes(w))).map(([ff]) => ff) }))
    const pluginsOnly = ecosystem.filter((e) => e.kind === 'plugin')
    const payloadPlugins = { packages: packages.length, plugins: pluginsOnly.length, dbAdapters: ecosystem.filter((e) => e.kind === 'db adapter').length, storageAdapters: ecosystem.filter((e) => e.kind === 'storage adapter').length, fusedCount: ecosystem.filter((e) => e.fused).length, notYetFused: ecosystem.filter((e) => e.kind === 'plugin' && !e.fused).map((e) => e.package), ecosystem }
    const live = { repo, docs: sections.length, sections, website, plugins: payloadPlugins, templates: (Array.isArray(templates) ? templates : []).filter((t) => t.type === 'dir').map((t) => t.name), examples: (Array.isArray(examples) ? examples : []).filter((t) => t.type === 'dir').map((t) => t.name), ...(section ? { section, pages, families, details, configures: families.length ? `${section}: ${families.map((x) => `${x.family} (${x.formulas.join(', ')})`).join('; ')}` : `${section}: no family its pages name yet` } : {}) }
    return { source, url: `https://github.com/${repo}`, reading: live, expected: { docs: '>= 1', templates: '>= 1', examples: '>= 1', plugins: '>= 1' }, agrees: sections.length > 0 && live.templates.length > 0 && payloadPlugins.plugins > 0 }
  }
  if (source === 'imagine') {
    // WHAT THE UNIT MAY BE, computed from the record: a request's words (a law firm, an auditor, a forensic expert) or
    // a category of the registry find the public APIs of that world; the words those APIs' titles and operations use
    // are crossed with the words every family's formulas use; the families reached are what the unit is for that
    // world, each with the formulas the APIs name. Proposed by the record, not claimed.
    const wordsOf = (s: string) => s.replace(/[A-Z]/g, (c) => ` ${c.toLowerCase()}`).split(/[^a-z]+/).filter((w) => w.length > 2)
    const reg = await apiRegistryOf()
    // a document that names one category as a string, not a list, names one category (measured: 'c', 'e', 'i' as categories)
    const categoryOf = (api: string): string[] => { const e = reg.entries[api] ?? {}; const c = e.versions?.[e.preferred ?? '']?.info?.['x-apisguru-categories'] as unknown; return (Array.isArray(c) ? c.map(String) : typeof c === 'string' ? [c] : []).filter(Boolean) }
    const categories = [...new Set(reg.names.flatMap(categoryOf))].sort()
    const about = str(a.about)
    const c = typeof a.category === 'number' ? a.category : -1
    const category = categories[c]
    if (!about && !category) return fail('about', { about: 'words of a request', categories })
    const found = about ? await apiSearchOf(about.split(/[\s,]+/), qpuFacesOf().faces) : undefined
    const names = found ? found.apis.map((x) => x.api) : reg.names.filter((api) => categoryOf(api).includes(category!)).slice(0, qpuFacesOf().faces)
    const apis = found ? found.apis.map((x) => ({ api: x.api, title: x.title, categories: x.categories, operations: x.operations.map((op) => op.path) })) : (await Promise.all(names.map((x) => apiOf(x).catch(() => null)))).filter((x): x is NonNullable<typeof x> => x !== null).map((x) => ({ api: x.api, title: x.title, categories: x.categories, operations: x.operations.map((op) => op.operationId ?? op.path) }))
    const apiWords = new Set(apis.flatMap((x) => [x.api, x.title, ...x.categories, ...x.operations].flatMap(wordsOf)))
    const families = [...qpuHexFamiliesOf()].filter(([f]) => !DOORS.has(f)).map(([family, formulas]) => {
      const named = formulas.map((f) => ({ name: f.name, words: [...new Set([...wordsOf(family), ...wordsOf(f.name)])].filter((w) => apiWords.has(w)) })).filter((f) => f.words.length)
      return { family, formulas: named.map((f) => f.name), words: [...new Set(named.flatMap((f) => f.words))] }
    }).filter((f) => f.formulas.length).sort((x, y) => y.formulas.length - x.formulas.length)
    const live = { ...(about ? { about } : { category }), categories: [...new Set(apis.flatMap((x) => x.categories))], apis: apis.map((x) => x.api), words: apiWords.size, families, is: families.length ? `${about ?? category}: ${families.map((f) => `${f.family} (${f.formulas.join(', ')})`).join('; ')}` : `${about ?? category}: no family the record names yet — a family to imagine` }
    return { source, url: 'https://apis.guru', reading: live, expected: { families: '>= 1' }, agrees: families.length > 0 }
  }
  return fail('source', { sources: SOURCES })
}
const SOURCES = ['cern', 'nist', 'oeis', 'sequence', 'zenodo', 'datacite', 'orcid', 'github', 'npm', 'release', 'site', 'apis', 'patents', 'authors', 'research', 'imagine', 'payload', 'ai', 'ask', 'jobs', 'funding', 'law', 'unanswered', 'arxiv', 'define', 'collisions', 'catalog']

/** Every live check there is, enumerated from the unit: each CERN record theorem cern counts, each registered sequence and
 *  every formula that is one, the physical constants, the release and its DOIs, author, repositories and package, and
 *  every catalogue the unit names. */
export const qpuDataSourcesOf = async () => [
  ...qpuCernRecordsOf().records.map((r) => ({ source: 'cern', args: { recid: r.recid } as Args, label: `CERN Open Data · record ${r.recid}`, checks: `theorem cern: ${r.files} * ${r.q} + ${r.r} = ${r.events}` })),
  { source: 'nist', args: {}, label: 'NIST CODATA · Planck, Boltzmann', checks: 'Qpu.Physics planck, boltzmann' },
  ...Object.entries(SEQUENCES).map(([id, s]) => ({ source: 'oeis', args: { id }, label: `OEIS ${id} · ${s.name}`, checks: `the unit's ${s.name.toLowerCase()}` })),
  ...(await qpuSequencesOf()).map((s) => ({ source: 'sequence', args: { family: s.family, formula: s.formula, fixed: s.fixed }, label: `OEIS · ${s.family}.${s.formula}${s.fixed.length ? `(${s.fixed.join(',')}, n)` : '(n)'}`, checks: `identifies ${s.terms.slice(0, 6).join(',')}, …` })),
  { source: 'zenodo', args: {}, label: 'Zenodo · latest release', checks: `version v${packageVersion}` },
  ...doisOf().map((d) => ({ source: 'datacite', args: { doi: d.doi }, label: `DataCite · ${d.doi}`, checks: `creator ${citeOf().author.last}${d.title ? `, title` : ''}` })),
  { source: 'orcid', args: {}, label: 'ORCID · author', checks: `${citeOf().author.first} ${citeOf().author.last}` },
  ...reposOf().map((repo) => ({ source: 'github', args: { repo }, label: `GitHub · ${repo}`, checks: 'public, not archived' })),
  { source: 'npm', args: {}, label: `npm · @${reposOf()[0] ?? ''}`, checks: `latest ${packageVersion}` },
  { source: 'site', args: {}, label: 'site · every sitemap address', checks: 'answers 200 with a title' },
  { source: 'release', args: {}, label: `GitHub Release · v${packageVersion}`, checks: 'the tag of the served version, published with notes' },
  { source: 'apis', args: {}, label: 'APIs.guru · every public API', checks: 'theorem fuse: the registry the unit fused' },
  { source: 'patents', args: {}, label: 'patents · PatentsView, USPTO bulk data', checks: 'the patents of an inventor (Tesla), with a key the operator holds' },
  { source: 'authors', args: {}, label: 'cited authors · DataCite, ORCID, Crossref', checks: 'the work around the authors the unit cites: works, years, citations' },
  ...['cal', 'hd', 'yi'].map((family) => ({ source: 'research', args: { family }, label: `research · ${family}`, checks: "the APIs the family's formulas name, read live; their numbers go to discovery" })),
  ...qpuCernCatalogsOf().catalogs.map((c) => ({ source: 'catalog', args: { name: c.name } as Args, label: `catalog · ${c.name}`, checks: 'answers with records' })),
]

// a reading is the same for ten minutes in one isolate: the public sources are read once per window, not once per view
const WINDOW = L.tenOf(L.hexbit + L.seed) * L.coins * L.n
const cache = new Map<string, { at: number; value: Promise<unknown> }>()

/** A live public dataset checked against the unit: the reading, what the unit holds, whether they agree, and a receipt. */
export const qpuDataOf = async (source: string, a: Args = {}, env?: QpuEnv) => {
  const key = JSON.stringify([source, a])
  const hit = cache.get(key)
  if (hit && Date.now() - hit.at < WINDOW) return hit.value as ReturnType<typeof readOf>
  const value = readOf(source, a, env)
  cache.set(key, { at: Date.now(), value })
  // a warning is a moment's state, not a reading: it is not kept
  void value.then((v) => { if (v && typeof v === 'object' && 'warning' in v) cache.delete(key) })
  return value
}
const readOf = async (source: string, a: Args, env?: QpuEnv) => {
  // the name first: an unknown source is answered with every source, network or not
  if (!SOURCES.includes(source)) return fail('source', { sources: SOURCES })
  if (Date.now() < offlineUntil)
    return { kind: 'data' as const, source, warning: 'offline', reading: 'skipped: the network was out of reach a moment ago', resolve: 'the network work is skipped while the network is out of reach; it runs again on the next call once it is back' }
  try {
    const r = await reading(source, a, env)
    if ('denied' in r) return r
    return { kind: 'data' as const, ...r, holds: r.agrees, receipt: receiptOf(`data ${source}`, r.reading, r.agrees) }
  } catch (e) {
    const f = qpuFailureOf(e, `data ${source}`)
    if (f.level === 'warning') {
      // only the network itself out of reach skips the next minute's network work; a slow host is its own warning
      if (f.why === 'offline') offlineUntil = Date.now() + OFFLINE_WINDOW
      return { kind: 'data' as const, source, warning: f.why, reading: f.reading, resolve: f.resolve }
    }
    return { ...fail('unreachable', { source }), reading: f.reading, why: f.why, resolve: f.resolve }
  }
}

// ---------------------------------------------------------------------------
// the data family: every live check is a hex program, not a door wrapped in a door
// ---------------------------------------------------------------------------

const dataFormula = (id: string, name: string, params: number[], formula: string, value: number, holds: boolean, proof: string, extra: Record<string, unknown> = {}) =>
  crossFormulaOf({ id, src: 'data', dst: 'science', formula, value, proof, ...extra }, holds, { name: `data.${name}`, params })
const familyIndexOf = (i: number) => [...qpuHexFamiliesOf().keys()].filter((f) => !DOORS.has(f)).sort()[i]
export class DataFormulas {
  /** How many live sources the unit checks (the index space of read). */
  static async sources(): Promise<unknown> { const n = (await qpuDataSourcesOf()).length; return dataFormula('data-sources', 'sources', [], 'sources = |every live check the unit names|', n, n > 0, 'qpuDataSourcesOf') }
  /** The i-th live source read now: 2 when it agrees with the unit, 1 when it differs, 0 when it could not be read; it
   *  holds when it agrees, when the network is out of reach (a warning), or when it differs and is not a theorem of the
   *  unit (cern, nist, oeis: those must agree). */
  static async read(i: number): Promise<unknown> {
    const sources = await qpuDataSourcesOf()
    const s = sources[i]
    if (!s) return dataFormula('data-read', 'read', [i], 'read(i)', 0, false, `no source ${i} of ${sources.length}`)
    const r = (await qpuDataOf(s.source, s.args)) as { agrees?: boolean; warning?: string; denied?: string; url?: string; reading?: unknown; resolve?: string }
    const theorem = ['cern', 'nist', 'oeis'].includes(s.source)
    const value = r.agrees ? 2 : r.denied ? 0 : 1
    // it holds when it agrees, when the network is out of reach (a warning), when it differs and is no theorem, or
    // when the source answered a refusal the unit cannot resolve on its own (403, 404: named, with what resolves it)
    const holds = r.agrees === true || r.warning !== undefined || (value === 1 && !theorem) || (value === 0 && typeof r.resolve === 'string' && !theorem)
    return dataFormula('data-read', 'read', [i], `read(${i}): ${s.label} — 2 agrees, 1 differs, 0 unread`, value, holds, r.url ?? s.label, { label: s.label, source: s.source, reading: r.reading, ...(r.warning ? { warning: r.warning } : {}), ...(r.denied ? { denied: r.denied, resolve: r.resolve } : {}) })
  }
  /** The f-th family (sorted, doors excluded) researched in the registry: the APIs its formulas name, read live; value how many matched, holds when one answered. */
  static async research(f: number, from = 0): Promise<unknown> {
    const family = familyIndexOf(f)
    if (!family) return dataFormula('data-research', 'research', [f], 'research(f)', 0, false, 'no such family')
    // from: where the scan of the matched documents continues (the reading's `next`), so research(f, next) walks on
    const r = (await qpuDataOf('research', { family, from })) as { agrees?: boolean; reading?: { matched: number; read: number; next?: number; readings: unknown[] } }
    return dataFormula('data-research', 'research', from ? [f, from] : [f], `research(${f}${from ? `, ${from}` : ''}) = |APIs the formulas of ${family} name|`, r.reading?.matched ?? 0, r.agrees === true || (r.reading?.read ?? 0) > 0 || from > 0, 'https://apis.guru', { family, reading: r.reading })
  }
  /** The errors of a slice of the live checks, from the f-th source, faces at a time: value how many, holds when none;
   *  the rows ride along with what resolves each, and next names the slice after. */
  static async errors(from: number): Promise<unknown> {
    const { qpuMcpErrorsOf } = await import('../quantum/processing/unit/index.js')
    const e = (await qpuMcpErrorsOf(undefined, from)) as { errors: unknown[]; warnings: unknown[]; count: number; next?: number }
    return dataFormula('data-errors', 'errors', [from], `errors(${from}) = |errors among the sources from ${from}|`, e.count, e.count === 0, 'qpuMcpErrorsOf', { errors: e.errors, warnings: e.warnings, ...(e.next !== undefined ? { next: e.next } : {}) })
  }
  /** The unit's own site, a slice of its sitemap from the f-th address rendered as the unit serves it: value how many
   *  answered 200 with a title, holds when all of the slice did; next names the slice after. */
  static async site(from: number): Promise<unknown> {
    const r = (await qpuDataOf('site', { from })) as { agrees?: boolean; reading?: { total?: number; next?: number; titled?: number; failing?: unknown }; warning?: string }
    return dataFormula('data-site', 'site', [from], `site(${from}): the sitemap's addresses from ${from}, rendered`, r.reading?.titled ?? 0, r.agrees === true || r.warning !== undefined, 'the sitemap', { reading: r.reading })
  }
  /** THE DEEP RESEARCH OF THE f-th FAMILY, ONE SLICE PER ADDRESS: the k-th slice of the APIs its words name read
   *  (research(f, from = k · faces)), and with k = 0 the f-th slice of the datasets — all of it in the window the
   *  discovery runs over; `next` names the slice after, and a caller follows it to the registry's end. Value the
   *  readings made; holds when the record answered. */
  static async deep(f: number, k = 0): Promise<unknown> {
    const family = familyIndexOf(f)
    if (!family) return dataFormula('data-deep', 'deep', [f, k], 'deep(f, k)', 0, false, 'no such family')
    const faces = qpuFacesOf().faces
    const r = (await qpuDataOf('research', { family, from: k * faces })) as { reading?: { matched?: number; read?: number; next?: number } }
    const slice = k === 0 ? (await qpuDataSourcesOf()).slice(f * faces, (f + 1) * faces) : []
    const datasets = (await Promise.all(slice.map((s) => qpuDataOf(s.source, s.args).catch(() => null)))).filter((x) => x !== null).length
    const read = (r.reading?.read ?? 0) + datasets
    return dataFormula('data-deep', 'deep', k ? [f, k] : [f], `deep(${f}, ${k}) = |APIs of ${family} read in slice ${k}| + |datasets of slice ${f} read|`, read, read > 0 || (r.reading?.matched ?? 0) === 0, 'https://apis.guru and every dataset', { family, matched: r.reading?.matched ?? 0, apisRead: r.reading?.read ?? 0, datasets, of: slice.length, ...(typeof r.reading?.next === 'number' ? { next: Math.ceil(r.reading.next / faces) } : {}) })
  }
  /** The CERN Open Data catalogue walked as leads: value how many records read, holds when one was. Each record's
   *  events = files · q + r is a candidate relation like the proven record 38; the slice's numbers feed the discovery. */
  static async collisions(from: number): Promise<unknown> {
    const r = (await qpuDataOf('collisions', { from: from + 1 })) as { agrees?: boolean; reading?: { total?: number; read?: number; withCounts?: number; leads?: unknown[] } }
    return dataFormula('data-collisions', 'collisions', [from], `collisions(${from}) = |CERN Open Data records read as leads (of ${r.reading?.total ?? '?'})|`, r.reading?.read ?? 0, r.agrees === true, 'https://opendata.cern.ch', { reading: r.reading })
  }
  /** A word defined and translated (keyless Free Dictionary + MyMemory), with its phonetics for speech; the registry's
   *  dictionary and translation APIs are the lexicon leads. value how many meanings; holds when the word is found. */
  static async define(from: number): Promise<unknown> {
    const r = (await qpuDataOf('define', {})) as { agrees?: boolean; reading?: { word?: string; meanings?: unknown[]; lexiconLeads?: unknown[] } }
    return dataFormula('data-define', 'define', [from], `define = |meanings of ${r.reading?.word ?? 'the word'}|`, r.reading?.meanings?.length ?? 0, r.agrees === true, 'https://dictionaryapi.dev', { reading: r.reading })
  }
  /** arXiv's newest preprints in a field as leads: value how many read; holds when one was. Their numbers feed the discovery. */
  static async arxiv(from: number): Promise<unknown> {
    const r = (await qpuDataOf('arxiv', { from })) as { agrees?: boolean; reading?: { count?: number; numbers?: number[]; next?: number; leads?: unknown[] } }
    return dataFormula('data-arxiv', 'arxiv', [from], `arxiv(${from}) = |open preprints read as leads|`, r.reading?.count ?? 0, r.agrees === true, 'https://arxiv.org', { reading: r.reading })
  }
  /** MathOverflow's unanswered questions as leads: value how many open problems read; holds when one was. Their numbers
   *  feed the discovery — an open problem a family's value reaches is a cross worth a human's look. */
  static async unanswered(from: number): Promise<unknown> {
    const r = (await qpuDataOf('unanswered', { from: from + 1 })) as { agrees?: boolean; reading?: { count?: number; numbers?: number[]; next?: number; leads?: unknown[] } }
    return dataFormula('data-unanswered', 'unanswered', [from], `unanswered(${from}) = |open MathOverflow questions read as leads|`, r.reading?.count ?? 0, r.agrees === true, 'https://mathoverflow.net/unanswered', { reading: r.reading })
  }
  /** The court-admissible legal sources of the from-th slice (Federal Register, UK legislation, EUR-Lex, registry):
   *  value how many answered keyless; holds when one did — the review layer the law family's advice gate depends on. */
  static async law(from: number): Promise<unknown> {
    const r = (await qpuDataOf('law', { from })) as { agrees?: boolean; reading?: { keyless?: number; answered?: number; reviewed?: number; jurisdictions?: string[]; next?: number; sources?: unknown[] } }
    return dataFormula('data-law', 'law', [from], `law(${from}) = |court-admissible legal sources of the slice answering keyless|`, r.reading?.keyless ?? 0, r.agrees === true, 'https://www.federalregister.gov', { reading: r.reading })
  }
  /** The official funding sources of the from-th slice that answer free and keyless (World Bank, EU Open Data, and the
   *  registry's funding APIs): value how many, holds when one did; next in the reading. qpu_data { source: 'funding', about, from }. */
  static async funding(from: number): Promise<unknown> {
    const r = (await qpuDataOf('funding', { from })) as { agrees?: boolean; reading?: { keyless?: number; answered?: number; matched?: number; next?: number; sources?: unknown[] } }
    return dataFormula('data-funding', 'funding', [from], `funding(${from}) = |official funding sources of the slice answering 200 with no credential asked|`, r.reading?.keyless ?? 0, r.agrees === true, 'https://api.worldbank.org + https://data.europa.eu', { reading: r.reading })
  }
  /** The job boards of the from-th slice that answer free and keyless: value how many, holds when one did; next in
   *  the reading. The public searches for work through the one door — qpu_data { source: 'jobs', about, from }. */
  static async jobs(from: number): Promise<unknown> {
    const r = (await qpuDataOf('jobs', { from })) as { agrees?: boolean; reading?: { keyless?: number; answered?: number; matched?: number; next?: number; boards?: unknown[] } }
    return dataFormula('data-jobs', 'jobs', [from], `jobs(${from}) = |job boards of the slice answering 200 with no credential asked|`, r.reading?.keyless ?? 0, r.agrees === true, 'https://apis.guru', { reading: r.reading })
  }
  /** The AI APIs of the from-th slice that answer free and keyless: value how many; holds when one did; next in the reading. */
  static async ai(from: number): Promise<unknown> {
    const r = (await qpuDataOf('ai', { from })) as { agrees?: boolean; reading?: { keyless?: number; matched?: number; next?: number; apis?: unknown[] } }
    return dataFormula('data-ai', 'ai', [from], `ai(${from}) = |AI APIs of the slice answering 200 with no credential asked|`, r.reading?.keyless ?? 0, r.agrees === true, 'https://apis.guru', { reading: r.reading })
  }
  /** The c-th section of Payload's docs crossed with the families: value how many families its pages name; holds
   *  when the section was read. The templates and examples ride in the reading: what the site is configured from. */
  static async payload(c: number): Promise<unknown> {
    const r = (await qpuDataOf('payload', { category: c })) as { agrees?: boolean; reading?: { section?: string; pages?: string[]; families?: unknown[]; docs?: number; templates?: string[]; examples?: string[]; configures?: string } }
    return dataFormula('data-payload', 'payload', [c], `payload(${c}) = |families the pages of docs/${r.reading?.section ?? '?'} name|`, r.reading?.families?.length ?? 0, r.agrees === true && (r.reading?.pages?.length ?? 0) > 0, 'https://github.com/payloadcms/payload', { reading: r.reading })
  }
  /** What the unit may be for the c-th category of the registry: the families whose formula words the category's APIs
   *  name; value how many families, holds when one is reached. For a request in words, qpu_data { source: 'imagine', about }. */
  static async imagine(c: number): Promise<unknown> {
    const r = (await qpuDataOf('imagine', { category: c })) as { agrees?: boolean; reading?: { category?: string; families?: unknown[]; is?: string } }
    return dataFormula('data-imagine', 'imagine', [c], `imagine(${c}) = |families the APIs of ${r.reading?.category ?? 'the category'} name|`, r.reading?.families?.length ?? 0, r.agrees === true, 'https://apis.guru', { reading: r.reading })
  }
  /** THE DOUBLE TORUS OVER THE DISCOVERY: the first n relations of the window's discovery, each a superposition of ways,
   *  every way run with every other way's address as referrer (both directions); value how many relations every
   *  perspective answers alike, holds when all of the n do. */
  static async perspectives(n: number): Promise<unknown> {
    const d = (await DataFormulas.discover(n)) as { reading?: { relations?: { value: string; ways: { hex: string }[] }[] } } & Record<string, unknown>
    const relations = ((d as { relations?: unknown }).relations ?? d.reading?.relations ?? []) as { value: string; ways: { hex: string }[] }[]
    let pairs = 0, closed = 0
    const open: string[] = []
    for (const rel of relations.slice(0, n)) {
      // each way from the perspective of its two neighbours on the ring of ways (the double torus), not every pair
      const ways = rel.ways
      const seen = await Promise.all(ways.flatMap((w, i) => [ways[(i + 1) % ways.length]!, ways[(i + ways.length - 1) % ways.length]!].filter((o) => o !== w).map(async (o) => { pairs += 1; const r = (await qpuHexRunOf(w.hex, o.hex, undefined, { store: false }).catch(() => null)) as { value?: unknown } | null; return r !== null && String(r.value) === rel.value })))
      if (seen.every(Boolean)) closed += 1
      else open.push(rel.value)
    }
    return dataFormula('data-perspectives', 'perspectives', [n], 'perspectives(n) = |relations every way of which answers the same value from every other way as referrer|', closed, relations.length > 0 && open.length === 0, 'qpuHexRunOf(way, referrer)', { relations: relations.length, pairs, closed, open: open.slice(0, qpuFacesOf().faces) })
  }
  /** Discovery across every family, bounded to the first n relations: value how many values two or more families reach. */
  /** CROSS PROBLEM-SOLVING: pose a target value, get the cross-formula ways across the lattice that reach it — the
   *  inverse of discovery. value how many families solve for the target; holds when two or more do (a genuine cross,
   *  not one family's own value). The ways are the solution paths, each a hex program with a receipt; strength is the
   *  breadth (how many distinct families reach it), so a broad solve outranks a coincidence. The target is a lead; a
   *  broad cross is its solution. */
  static async solve(target: number): Promise<unknown> {
    const { qpuDiscoverOf } = await import('./discovery.js')
    const d = await qpuDiscoverOf([target])
    const rel = d.relations.find((r) => r.value === String(target))
    const families = rel ? [...new Set(rel.ways.map((w) => w.family))] : []
    return dataFormula('data-solve', 'solve', [target], `solve(${target}) = |families whose formulas reach ${target}|`, families.length, families.length >= 2, 'qpuDiscoverOf', { target, strength: families.length, families, ways: (rel?.ways ?? []).slice(0, qpuFacesOf().faces).map((w) => ({ family: w.family, program: w.program, params: w.params, hex: w.hex, receipt: w.receipt })) })
  }
  static async discover(n: number): Promise<unknown> {
    const { qpuDiscoverOf } = await import('./discovery.js')
    // the live inputs are every reading the doors made in this window (data.read, research, the site…): reading the
    // record and discovering over it is one sequence of calls, nothing passed by hand
    const readings = await Promise.all([...cache.values()].map((c) => c.value.catch(() => null)))
    const numbersOf = (x: unknown): number[] => (typeof x === 'number' ? (Number.isSafeInteger(x) && x >= 3 ? [x] : []) : typeof x === 'string' ? (/^\d+$/.test(x) && Number.isSafeInteger(Number(x)) && Number(x) >= 3 ? [Number(x)] : []) : x && typeof x === 'object' ? Object.values(x).flatMap(numbersOf) : [])
    // a slice of the window's numbers, the smallest first: faces · hexbit of them (56) are what the formulas' small
    // inputs can meet; a window full of catalogue totals would make one discovery the lattice squared (measured
    // 2026-10-03: 22 minutes at 100% CPU after one family's research)
    const live = [...new Set(readings.flatMap((r) => numbersOf((r as { reading?: unknown } | null)?.reading ?? {})))].sort((a, b) => a - b).slice(0, qpuFacesOf().faces * 4)
    const d = await qpuDiscoverOf(live)
    return dataFormula('data-discover', 'discover', [n], 'discover(n) = |values reached by two or more families|, over every reading of the window', d.relations.length, d.holds, 'qpuDiscoverOf', { families: d.families, liveInputs: live.length, liveRelations: d.liveRelations, relationsTotal: d.relations.length, sealsTotal: d.seals.length, relations: [...d.relations].sort((a, b) => b.families.length - a.families.length || (b.live ? 1 : 0) - (a.live ? 1 : 0)).slice(0, n).map((r) => ({ value: r.value, strength: r.families.length, families: r.families, live: r.live, ways: r.ways.slice(0, 2).map((w) => ({ family: w.family, program: w.program, params: w.params, hex: w.hex })) })), seals: d.seals.slice(0, n).map((s) => ({ family: s.family, program: s.program, kind: s.kind, points: s.points.slice(0, 6) })) })
  }
}
for (const name of ['ai', 'arxiv', 'collisions', 'deep', 'define', 'discover', 'errors', 'funding', 'imagine', 'jobs', 'law', 'payload', 'perspectives', 'read', 'research', 'site', 'solve', 'sources', 'unanswered'] as const)
  qpuHexRegisterOf('data', name, (DataFormulas[name] as (...x: unknown[]) => unknown).bind(DataFormulas))

qpuMcpFuseOf('qpu_data', {
  description: "THE CHAT IS THE DEFAULT WAY IN: { source: 'ask', about } answers a question in words (with its numbers) from the formula its words name, at its address, with the receipt. Also reads live public data and checks it against the unit: { source: 'cern', recid } (theorem cern), 'nist' (Planck, Boltzmann vs Qpu.Physics), 'oeis' { id: A000110 | A000108 }, 'sequence' { family, formula, fixed? } (a formula's terms identified in OEIS), 'zenodo' (latest release vs this version), 'datacite' { doi } (the cited DOIs), 'orcid' (the author), 'github' { repo }, 'npm' (the package), 'release' (the GitHub Release of the served version), 'apis' (the APIs.guru registry vs theorem fuse), 'research' { family } (the APIs a family's formula names find, read live), 'imagine' { about } | { category } (what the unit may be for a request or a registry category: the families its APIs name), 'payload' { category } (payloadcms/payload read: docs sections, templates, examples; the c-th section crossed with the families), 'ai' { from, about? } (the AI APIs that answer free and keyless), 'jobs' { about?, from } (search for work: the public job boards fused from the registry, the keyless ones read live), 'funding' { about?, from } (find funding: World Bank, EU Open Data, registry funding APIs), 'law' { about?, from } (the court-admissible legal record, read live), 'unanswered' { site?, about?, from } (open questions as leads from any Stack Exchange site — the research ones (mathoverflow, cstheory, physics, stats, quantumcomputing, economics, astronomy…) and the web-design/developer community (stackoverflow, softwareengineering, ux, webmasters, codereview, graphicdesign, security, gamedev, dba, devops, ai)), 'arxiv' { about?, from } (the newest arXiv preprints in a field as leads), 'collisions' { from } (the CERN Open Data catalogue — 66k records — walked as leads, each an events = files·q + r arithmetic like the proven record 38), 'define' { about?, to? } (a word's meanings and phonetics from the keyless Free Dictionary and its translation from MyMemory — speech and translation; the registry's dictionary/translation APIs are the lexicon leads), 'ask' { about } (the chat: a question in words with its numbers, answered by the formula its words name, at its address, with the receipt), 'authors' { from } (the work around the cited authors: DataCite, ORCID, Crossref), 'catalog' { name } (every public catalogue the unit names). { source: 'all' } lists every check.",
  inputSchema: { type: 'object', properties: { source: { type: 'string', enum: [...SOURCES, 'all'] }, about: { type: 'string' }, to: { type: 'string' }, category: { type: 'integer' }, recid: { type: 'integer' }, id: { type: 'string' }, name: { type: 'string' }, family: { type: 'string' }, words: { type: ['string', 'array'], items: { type: 'string' } }, from: { type: 'integer' }, formula: { type: 'string' }, fixed: { type: 'array', items: { type: 'integer' } }, doi: { type: 'string' }, repo: { type: 'string' } }, required: ['source'] },
  run: async (a, env) => (str(a.source) === 'all' ? { kind: 'data-sources', sources: await qpuDataSourcesOf() } : qpuDataOf(str(a.source), a, env)),
})

// ---------------------------------------------------------------------------
// qpu_discover: cross-formulated solutions across every family
// ---------------------------------------------------------------------------

qpuMcpFuseOf('qpu_discover', {
  description: 'Discover cross-formulated solutions: every family, every program of one formula and every composition of two, over params that fit the hex split; a value reached by two or more families is a relation. { live: [naturals] } adds live readings as inputs; { limit } caps the relations returned (default 50).',
  inputSchema: { type: 'object', properties: { live: { type: 'array', items: { type: 'integer' } }, limit: { type: 'integer' } } },
  run: async (a) => {
    const { qpuDiscoverOf } = await import('./discovery.js')
    const d = await qpuDiscoverOf(Array.isArray(a.live) ? a.live.map(Number) : [])
    return { ...d, relations: d.relations.slice(0, num(a.limit, (L.hexbit + L.seed) * L.tenOf(L.seed))), relationsTotal: d.relations.length }
  },
})

// ---------------------------------------------------------------------------
// qpu_crypt: the internal crypto
// ---------------------------------------------------------------------------

const bytesArg = (a: Args, key: string): Uint8Array => (typeof a[`${key}Hex`] === 'string' ? fromHex(a[`${key}Hex`] as string) : bytesOf(str(a[key])))
const CRYPT_OPS: Record<string, (a: Args) => unknown> = {
  known: () => CryptFormulas.knownAnswers(),
  sha256: (a) => hexOf(sha256(bytesArg(a, 'text'))),
  sha512: (a) => hexOf(sha512(bytesArg(a, 'text'))),
  md5: (a) => hexOf(md5(bytesArg(a, 'text'))),
  hmac: (a) => hexOf(hmac((str(a.hash) || 'sha256') as HashName, bytesArg(a, 'key'), bytesArg(a, 'message'))),
  hkdf: (a) => hexOf(hkdf((str(a.hash) || 'sha256') as HashName, fromHex(str(a.ikm)), fromHex(str(a.salt)), utf8(str(a.info)), num(a.length, 32))),
  aead_seal: (a) => {
    const sealed = aeadSeal(fromHex(str(a.key)), fromHex(str(a.nonce)), bytesArg(a, 'plaintext'), fromHex(str(a.aad)))
    return { ct: hexOf(sealed.subarray(0, sealed.length - 16)), tag: hexOf(sealed.subarray(sealed.length - 16)) }
  },
  aead_open: (a) => {
    const opened = aeadOpen(fromHex(str(a.key)), fromHex(str(a.nonce)), fromHex(`${str(a.ct)}${str(a.tag)}`), fromHex(str(a.aad)))
    return opened ? { plaintextHex: hexOf(opened), authentic: true } : { authentic: false }
  },
  x25519: (a) => hexOf(x25519(fromHex(str(a.scalar)), fromHex(str(a.u) || '09'.padEnd(64, '0')))),
  ed25519_public: (a) => hexOf(ed25519PublicKey(fromHex(str(a.seed)))),
  ed25519_sign: (a) => hexOf(ed25519Sign(fromHex(str(a.seed)), bytesArg(a, 'message'))),
  ed25519_verify: (a) => ed25519Verify(fromHex(str(a.publicKey)), bytesArg(a, 'message'), fromHex(str(a.signature))),
}

qpuMcpFuseOf('qpu_crypt', {
  description: 'The unit\'s own crypto (FIPS 180-4, RFC 1321/2104/5869/8439/7748/8032), no external library: { op: known | sha256 | sha512 | md5 | hmac | hkdf | aead_seal | aead_open | x25519 | ed25519_public | ed25519_sign | ed25519_verify, ... }. Byte inputs are hex; text, key, message and plaintext also take <name>Hex.',
  inputSchema: { type: 'object', properties: { op: { type: 'string', enum: Object.keys(CRYPT_OPS) } }, required: ['op'] },
  run: (a) => {
    const op = CRYPT_OPS[str(a.op)]
    if (!op) return fail('op', { ops: Object.keys(CRYPT_OPS) })
    try {
      const value = op(a)
      const holds = value !== false && !(value && typeof value === 'object' && 'holds' in value && (value as { holds: unknown }).holds === false)
      return { kind: 'crypt', op: a.op, value, holds, receipt: receiptOf(`crypt ${String(a.op)}`, value, holds) }
    } catch (e) {
      return fail('input', { op: a.op, reading: (e as Error).message })
    }
  },
})

// ---------------------------------------------------------------------------
// qpu_np: certificate verifiers and the theorems they decide
// ---------------------------------------------------------------------------

const MAX_VERTICES = L.mintOf(L.n * L.hexbit)
const MAX_EDGES = L.tenOf(L.hexbit + L.seed)
const graphOf = (a: Args): Graph | null => {
  const n = num(a.n, -1)
  const edges = Array.isArray(a.edges) ? (a.edges as unknown[]).filter((e): e is [number, number] => Array.isArray(e) && e.length === 2 && e.every((v) => Number.isSafeInteger(v) && v >= 0 && v < n)) : []
  return n > 0 && n <= MAX_VERTICES && edges.length <= MAX_EDGES && edges.length === (a.edges as unknown[] | undefined)?.length ? { n, edges } : null
}
const NP_OPS: Record<string, (a: Args) => unknown> = {
  coloring: (a) => {
    const g = graphOf(a)
    return g && Array.isArray(a.colors) ? verifyColoring(g, a.colors as number[], num(a.k, 3)) : fail('graph')
  },
  ham_cycle: (a) => {
    const g = graphOf(a)
    return g && Array.isArray(a.cycle) ? verifyHamCycle(g, a.cycle as number[]) : fail('graph')
  },
  subset_sum: (a) => (Array.isArray(a.set) ? verifySubsetSum(a.set as number[], num(a.mask, 0), num(a.target, 0)) : fail('set')),
  sat: (a) => (Array.isArray(a.cnf) && Array.isArray(a.assignment) ? verifySat(a.cnf as number[][], a.assignment as boolean[]) : fail('cnf')),
  unreachable: (a) => {
    const g = graphOf(a)
    return g ? certifyUnreachable(g, num(a.s, 0), num(a.t, 0)) : fail('graph')
  },
  theorems: () => {
    const petersen = generalizedPetersen(5, 2)
    const dodecahedron = generalizedPetersen(10, 2)
    const colour = findColoring(petersen, 3)
    const cycle = findHamCycle(dodecahedron)
    const php = pigeonhole(3, 2)
    const rows = [
      { name: 'petersen chromatic 3', holds: colour !== null && verifyColoring(petersen, colour, 3) && findColoring(petersen, 2) === null },
      { name: 'petersen non-hamiltonian', holds: findHamCycle(petersen) === null },
      { name: 'dodecahedron hamiltonian', holds: cycle !== null && verifyHamCycle(dodecahedron, cycle), cycle },
      { name: 'pigeonhole 3 into 2 unsatisfiable', holds: findAssignment(php.cnf, php.vars) === null },
      { name: 'subset sum {3,7,1,9,4} reaches 13', holds: verifySubsetSum([3, 7, 1, 9, 4], 13, 13) },
    ]
    return { rows, holds: rows.every((r) => r.holds) }
  },
}

qpuMcpFuseOf('qpu_np', {
  description: 'Check NP certificates in linear time and NL non-reachability by inductive counting: { op: coloring { n, edges, colors, k } | ham_cycle { n, edges, cycle } | subset_sum { set, mask, target } | sat { cnf, assignment } | unreachable { n, edges, s, t } | theorems }.',
  inputSchema: { type: 'object', properties: { op: { type: 'string', enum: Object.keys(NP_OPS) } }, required: ['op'] },
  run: (a) => {
    const op = NP_OPS[str(a.op)]
    if (!op) return fail('op', { ops: Object.keys(NP_OPS) })
    const value = op(a)
    const holds = value === true || (value !== null && typeof value === 'object' && ('unreachable' in value ? (value as { unreachable: boolean }).unreachable : (value as { holds?: unknown }).holds === true))
    return { kind: 'np', op: a.op, value, holds, receipt: receiptOf(`np ${String(a.op)}`, value, holds) }
  },
})

// ---------------------------------------------------------------------------
// qpu_hologram: the signed hologram streams
// ---------------------------------------------------------------------------

let hologram: ReturnType<typeof hologramStreamsOf> | undefined
qpuMcpFuseOf('qpu_hologram', {
  description: "The unit's hologram as signed SHA-256 UUID streams, one per scale, each fragment carrying a Merkle proof to the root: {} for the whole, { scale } for one stream's fragments.",
  inputSchema: { type: 'object', properties: { scale: { type: 'string' } } },
  run: (a) => {
    const h = (hologram ??= hologramStreamsOf())
    const scale = str(a.scale)
    if (scale) return h.streams[scale] ? { kind: 'hologram-scale', scale, root: h.root, publicKey: h.publicKeys[scale], fragments: h.streams[scale], holds: h.holds } : fail('scale', { scales: Object.keys(h.streams) })
    return { kind: h.kind, root: h.root, publicKeys: h.publicKeys, entries: h.entries, scales: Object.fromEntries(Object.entries(h.streams).map(([k, v]) => [k, { length: v.length, head: v.at(-1)?.uuid }])), holds: h.holds }
  },
})
