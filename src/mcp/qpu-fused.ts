import { aeadOpen, aeadSeal, bytesOf, ed25519PublicKey, ed25519Sign, ed25519Verify, fromHex, hexOf, hkdf, hmac, md5, sha256, sha512, utf8, x25519, type HashName } from '../core/crypt.js'
import { leanSource } from '../quantum/processing/unit/lean.js'
import { packageVersion } from '../quantum/processing/unit/version.js'
import { qpuCernCatalogsOf, qpuCernRecordsOf, qpuCiteOf, qpuFacesOf, qpuFailureOf, qpuHexRegisterOf, qpuContentUuidOf, qpuHexCatalogOf, qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuInstallOf, qpuMcpFuseOf, qpuUuidReceiptOf } from '../quantum/processing/unit/index.js'
import { DOORS } from './discovery.js'
import { crossFormulaOf } from './cross-domain-formulas.js'
import { apiCallOf, apiSearchOf } from './api-door.js'
import { CryptFormulas } from './crypt-formulas.js'
import { hologramStreamsOf } from './hologram-streams.js'
import { certifyUnreachable, findAssignment, findColoring, findHamCycle, generalizedPetersen, pigeonhole, verifyColoring, verifyHamCycle, verifySat, verifySubsetSum, type Graph } from './np-formulas.js'
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
  description: 'Run a hex program: { uuid } or { family, program, params }, of any registered family ({} returns the catalogue; { doors: true } through any door lists the families).',
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
  return best.length >= L.chooseOf(L.hexbit, L.coins) && new Set(best).size >= L.hexbit ? { family, formula, fixed, terms: best } : null
}
let sequences: Promise<Sequence[]> | undefined
/** Every formula of every family that is an integer sequence, read off the families rather than listed. */
export const qpuSequencesOf = (): Promise<Sequence[]> =>
  (sequences ??= (async () => {
    const out: Sequence[] = []
    for (const [family, formulas] of qpuHexFamiliesOf()) {
      if (DOORS.has(family)) continue
      for (const f of formulas) {
        if (f.arity !== 1 && f.arity !== 2) continue
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
  if (source === 'research') {
    // the research a human request needs, done by the registry: a family's formula names are the words, the APIs they
    // find are read, and their numbers go to discovery with every other live reading
    const family = str(a.family) || 'cal'
    const formulas = qpuHexFamiliesOf().get(family)
    if (!formulas) return fail('family', { families: [...qpuHexFamiliesOf().keys()] })
    const words = [...new Set([family, ...formulas.flatMap((f) => f.name.replace(/[A-Z]/g, (c) => ` ${c.toLowerCase()}`).split(' '))])]
    const found = await apiSearchOf(words, qpuFacesOf().faces)
    const reads = await Promise.all(found.apis.filter((x) => x.free !== undefined).slice(0, qpuFacesOf().faces).map(async (x) => apiCallOf(x.index, x.free!)))
    const live = { family, words: found.words, matched: found.matched, scanned: found.scanned, read: reads.length, readings: reads.map((r) => ({ api: r.api, status: r.status, url: r.url, hex: r.hex, excerpt: r.excerpt })) }
    return { source, url: 'https://apis.guru', reading: live, expected: { matched: '>= 1', answered: '>= 1' }, agrees: found.matched > 0 && reads.some((r) => r.status > 0) }
  }
  return fail('source', { sources: SOURCES })
}
const SOURCES = ['cern', 'nist', 'oeis', 'sequence', 'zenodo', 'datacite', 'orcid', 'github', 'npm', 'release', 'site', 'apis', 'research', 'catalog']

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
    const holds = r.agrees === true || r.warning !== undefined || (value === 1 && !theorem)
    return dataFormula('data-read', 'read', [i], `read(${i}): ${s.label} — 2 agrees, 1 differs, 0 unread`, value, holds, r.url ?? s.label, { label: s.label, source: s.source, reading: r.reading, ...(r.warning ? { warning: r.warning } : {}), ...(r.denied ? { denied: r.denied, resolve: r.resolve } : {}) })
  }
  /** The f-th family (sorted, doors excluded) researched in the registry: the APIs its formulas name, read live; value how many matched, holds when one answered. */
  static async research(f: number): Promise<unknown> {
    const family = familyIndexOf(f)
    if (!family) return dataFormula('data-research', 'research', [f], 'research(f)', 0, false, 'no such family')
    const r = (await qpuDataOf('research', { family })) as { agrees?: boolean; reading?: { matched: number; read: number; readings: unknown[] } }
    return dataFormula('data-research', 'research', [f], `research(${f}) = |APIs the formulas of ${family} name|`, r.reading?.matched ?? 0, r.agrees === true, 'https://apis.guru', { family, reading: r.reading })
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
  /** Discovery across every family, bounded to the first n relations: value how many values two or more families reach. */
  static async discover(n: number): Promise<unknown> {
    const { qpuDiscoverOf } = await import('./discovery.js')
    const d = await qpuDiscoverOf([])
    return dataFormula('data-discover', 'discover', [n], 'discover(n) = |values reached by two or more families|', d.relations.length, d.holds, 'qpuDiscoverOf', { families: d.families, relations: d.relations.slice(0, n) })
  }
}
for (const name of ['discover', 'errors', 'read', 'research', 'site', 'sources'] as const)
  qpuHexRegisterOf('data', name, (DataFormulas[name] as (...x: unknown[]) => unknown).bind(DataFormulas))

qpuMcpFuseOf('qpu_data', {
  description: "Read a live public dataset and check it against the unit: { source: 'cern', recid } (theorem cern), 'nist' (Planck, Boltzmann vs Qpu.Physics), 'oeis' { id: A000110 | A000108 }, 'sequence' { family, formula, fixed? } (a formula's terms identified in OEIS), 'zenodo' (latest release vs this version), 'datacite' { doi } (the cited DOIs), 'orcid' (the author), 'github' { repo }, 'npm' (the package), 'release' (the GitHub Release of the served version), 'apis' (the APIs.guru registry vs theorem fuse), 'research' { family } (the APIs a family's formula names find, read live), 'catalog' { name } (every public catalogue the unit names). { source: 'all' } lists every check.",
  inputSchema: { type: 'object', properties: { source: { type: 'string', enum: [...SOURCES, 'all'] }, recid: { type: 'integer' }, id: { type: 'string' }, name: { type: 'string' }, family: { type: 'string' }, formula: { type: 'string' }, fixed: { type: 'array', items: { type: 'integer' } }, doi: { type: 'string' }, repo: { type: 'string' } }, required: ['source'] },
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
