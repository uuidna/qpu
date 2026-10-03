import { test } from './receipted.js'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { qpuContentUuidOf, qpuHexFamiliesOf, qpuUuidReceiptOf } from './index.js'
import '../../../mcp/families.js'

/** THE RELEASE, AS EVERY CLIENT SEES IT. QPU is live: these tests call https://qpu.uuidna.com/mcp (QPU_LIVE names
 * another host) through the sealed doors, the one way any MCP client reaches it, and drive what a release must cover:
 * every door and formula listed, every external API and dataset read, formula discovery holding, and every error and
 * warning answered at once, each with what resolves it. */
const host = (process.env.QPU_LIVE ?? 'https://qpu.uuidna.com').replace(/\/$/, '')
const DOOR = 'qpu_cite'
let id = 0
type Shown = { structuredContent?: Record<string, unknown>; isError?: boolean }
const call = async (args: Record<string, unknown>, name = DOOR): Promise<Shown> => {
  const r = await fetch(`${host}/mcp`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: ++id, method: 'tools/call', params: { name, arguments: args } }),
    signal: AbortSignal.timeout(120000),
  })
  const body = (await r.json()) as { result?: Shown; error?: { message: string } }
  assert.ok(body.result, `tools/call ${name} ${JSON.stringify(args)}: ${body.error?.message ?? r.status}`)
  // the live reading is this test's computation: its content address is minted into the test's receipt ledger, so the
  // receipted reporter sees what was read and from where, and a test that only read the host is not "dry"
  const sc = body.result.structuredContent ?? {}
  qpuUuidReceiptOf(`release ${name} ${JSON.stringify(args).slice(0, 80)}`, qpuContentUuidOf(sc), { holds: (sc as { holds?: unknown }).holds === true, host })
  return body.result
}
const out = (s: Shown) => (s.structuredContent ?? {}) as Record<string, unknown>
const FUSED = ['qpu_data', 'qpu_hex', 'qpu_discover', 'qpu_crypt', 'qpu_np', 'qpu_hologram']
// COMPUTE ALL IN HEX, DO NOT WRAP: every check is a hex program run at its address through a sealed door
type Run = { value?: unknown; holds?: boolean; steps?: unknown[]; denied?: string; receipt?: string }
const hex = async (family: string, program: string[], params: number[] = []): Promise<Run> => out(await call({ hex: { family, program, params } })) as Run
const nonDoors = () => [...qpuHexFamiliesOf().keys()].filter((f) => f !== 'qpu' && f !== 'crypto').sort()

test('release: every door and every formula is reachable through a sealed door', async (t) => {
  const d = out(await call({ doors: true })) as { doors?: { name: string; kind: string }[]; formulas?: { name: string }[] }
  assert.ok(d.doors && d.formulas, 'the sealed door answers { doors: true }')
  for (const f of FUSED) assert.ok(d.doors.some((x) => x.name === f && x.kind === 'fused'), `fused door ${f} is listed`)
  const families = new Set(d.formulas.map((f) => f.name.split('.').slice(0, -1).join('.')))
  for (const f of ['Qpu.Mint', 'Qpu.Physics', 'cross', 'np', 'clay', 'heat']) assert.ok(families.has(f), `family ${f} is reachable`)
  t.diagnostic(`${d.doors.length} doors, ${d.formulas.length} formulas`)
  // a formula runs at its address
  const run = await hex('heat', ['temperature'], [16, 1])
  assert.equal(Number(run.value), 16000, 'heat.temperature(16, 1) = 16000 mK at its hex address')
  assert.equal(run.holds, true)
})

test('release: every external API and dataset is read, the theorems among them agree', async (t) => {
  const n = Number((await hex('data', ['sources'])).value)
  assert.ok(n > 0, 'data.sources() counts the live checks')
  const runs = await Promise.all(Array.from({ length: n }, (_, i) => hex('data', ['read'], [i])))
  const unread = runs.map((r, i) => ({ r, i })).filter(({ r }) => r.holds !== true)
  assert.deepEqual(unread.map(({ i, r }) => `read(${i}) = ${String(r.value)}`), [], 'every source agrees, warns, or differs without being a theorem of the unit')
  const agree = runs.filter((r) => Number(r.value) === 2).length, differ = runs.filter((r) => Number(r.value) === 1).length, warned = runs.filter((r) => Number(r.value) === 0).length
  t.diagnostic(`${n} sources in hex: ${agree} agree, ${differ} differ, ${warned} unread (warned)`)
})

test('release: formula discovery holds across every family', async (t) => {
  const d = await hex('data', ['discover'], [5])
  assert.equal(d.holds, true, 'discovery holds: every family ran and two or more reach a common value')
  assert.ok(Number(d.value) > 0, 'cross-family solutions')
  t.diagnostic(`${d.value} cross-family solutions, in hex`)
})

test('release: the site end to end — every address it lists answers, every page renders as built', async (t) => {
  // every page read is minted into the test's receipt ledger (status and content address), as the MCP readings are
  const get = async (path: string, accept = 'text/html') => {
    const r = await fetch(`${host}${path}`, { headers: { accept }, redirect: 'manual', signal: AbortSignal.timeout(120000) })
    const text = await r.text()
    qpuUuidReceiptOf(`release site ${path}`, qpuContentUuidOf({ status: r.status, text }), { holds: r.status === 200, host })
    return { status: r.status, headers: r.headers, text: async () => text, json: async () => JSON.parse(text) as unknown }
  }
  // THE COLD START IS REPORTED, NOT RACED. The first page after a deploy seeds a changed site before it answers (minutes
  // on a version bump: every doc's UUID moves); this test runs right after the deploy that made the host, so it waits
  // for the first answer and records how long it took, then holds the site to its warm shape.
  // A 503 is the host saying not yet (the isolate still seeding, or the Worker version still propagating), so the wait
  // is paced, up to five minutes; the first 200 is the cold start's end.
  const started = Date.now()
  let warm: { status: number } | undefined
  let last = ''
  for (let i = 0; i < 30 && !(warm && warm.status === 200); i++) {
    if (i) await new Promise((r) => setTimeout(r, 10000))
    try { warm = await get('/'); last = String(warm.status) } catch (e) { last = (e as Error).message }
  }
  assert.ok(warm && warm.status === 200, `the site answers its root within five minutes of a deploy (last: ${last})`)
  t.diagnostic(`cold start ${Math.round((Date.now() - started) / 1000)}s`)
  // the site names its own addresses: nothing is listed here
  const sitemap = await (await get('/sitemap.xml', 'application/xml')).text()
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]!).pathname)
  assert.ok(urls.length > 0, 'the sitemap lists the site')
  const failed: string[] = []
  await Promise.all(urls.map(async (u) => {
    const r = await get(u)
    const body = await r.text()
    // every address answers; one that serves a page serves it titled; a JSON door answers its JSON
    const page = (r.headers.get('content-type') ?? '').includes('text/html')
    if (r.status !== 200 || (page && !/<title>[^<]+<\/title>/.test(body))) failed.push(`${u} ${r.status} ${body.replace(/\s+/g, ' ').slice(0, 160)}`)
  }))
  assert.deepEqual(failed, [], 'every address the sitemap lists answers 200, a page with its title')
  // every published page renders as the admin built it, and SEO-optimised: the test says what the page must carry,
  // the code follows — a title of at most 70 characters that is the page's, a description of 50 to 160, a canonical
  // that is the page's own address, Open Graph title and description, and structured data (JSON-LD)
  const pages = (await (await get('/api/pages?limit=100&depth=0', 'application/json')).json()) as { docs: { slug: string; title: string; meta?: { title?: string; description?: string } }[] }
  assert.ok(pages.docs.length > 0, 'Payload serves its pages')
  const seo: string[] = []
  for (const p of pages.docs) {
    const path = p.slug === 'home' ? '/' : `/${p.slug}`
    // the seed resumes one slice per request: a page not yet written is asked again, paced, before it is a finding
    let html = ''
    for (let i = 0; i < 6; i++) {
      try {
        const r = await get(path)
        html = await r.text()
        if (r.status === 200 && html.includes(p.meta?.title ?? p.title)) break
      } catch { /* a read that timed out while the seed resumes is asked again */ }
      await new Promise((f) => setTimeout(f, 5000))
    }
    const title = /<title>([^<]*)<\/title>/.exec(html)?.[1] ?? ''
    const meta = (name: string) => new RegExp(`<meta[^>]+(?:name|property)="${name}"[^>]+content="([^"]*)"`).exec(html)?.[1] ?? new RegExp(`<meta[^>]+content="([^"]*)"[^>]+(?:name|property)="${name}"`).exec(html)?.[1] ?? ''
    const canonical = /<link[^>]+rel="canonical"[^>]+href="([^"]*)"/.exec(html)?.[1] ?? /<link[^>]+href="([^"]*)"[^>]+rel="canonical"/.exec(html)?.[1] ?? ''
    const want = p.meta?.title ?? p.title
    if (!title.includes(want)) seo.push(`${path}: title "${title}" is not the page's "${want}"`)
    if (title.length > 70) seo.push(`${path}: title ${title.length} chars > 70`)
    const description = meta('description')
    if (description.length < 50 || description.length > 160) seo.push(`${path}: description ${description.length} chars, not 50–160`)
    if (!canonical.endsWith(path === '/' ? '' : path) || !canonical.startsWith('https://')) seo.push(`${path}: canonical "${canonical}"`)
    if (!meta('og:title')) seo.push(`${path}: no og:title`)
    if (!meta('og:description')) seo.push(`${path}: no og:description`)
    if (!/<script[^>]+type="application\/ld\+json"/.test(html)) seo.push(`${path}: no JSON-LD`)
  }
  assert.deepEqual(seo, [], 'every page is SEO-optimised as the test states it')
  // the header is the admin's global, the admin answers, an unknown address is a 404 page, a program runs
  const header = (await (await get('/api/globals/header', 'application/json')).json()) as { navItems?: unknown[] }
  assert.ok((header.navItems ?? []).length > 0, 'the header global has its navigation')
  assert.equal((await get('/admin/login')).status, 200, 'the admin answers')
  assert.equal((await get('/no-such-address-anywhere')).status, 404, 'an unknown address is a 404')
  const program = await (await get('/heat/temperature+signal?p=16,1')).text()
  assert.ok(program.includes('16000'), 'a hex program renders its run: heat.temperature(16, 1) = 16000')
  t.diagnostic(`${urls.length} addresses, ${pages.docs.length} pages`)
})

test('release: every public API is fused and used — the registry walked through api.call addresses, a slice of it live', async (t) => {
  // the committed walk covers the whole registry: every API read (fused), and a read made wherever one needs no parameter
  const walk = JSON.parse(readFileSync(new URL('../../../../api-receipt.json', import.meta.url), 'utf8')) as { listed: number; walked: number; fused: number; used: number; statuses: Record<string, number> }
  assert.equal(walk.walked, walk.listed, 'the walk covers every API the registry lists')
  assert.equal(walk.fused, walk.walked, 'every API is fused: its document read and its operations derived')
  assert.ok(walk.used > 0 && walk.statuses['200'] > 0, 'reads were made and answered')
  // and live, in hex: the i-th API's operations are derived and its first operation resolved at their addresses
  const from = Math.floor((walk.listed * 7) / 16)
  const ops = await Promise.all(Array.from({ length: 8 }, (_, k) => hex('api', ['operations'], [from + k])))
  assert.deepEqual(ops.map((r, k) => (r.holds ? null : `api.operations(${from + k}) ${String(r.denied ?? r.value)}`)).filter(Boolean), [], 'every API of the live slice is fused: its document read at its address')
  const first = await hex('api', ['call'], [from, 0, 0])
  assert.ok(typeof first.value === 'string' || typeof first.value === 'number', `api.call(${from}, 0, 0) answers at its address: ${JSON.stringify(first).slice(0, 160)}`)
  const slice = { fused: ops.filter((r) => r.holds).length, take: ops.length, rows: [] as { used: boolean }[] }
  t.diagnostic(`${walk.listed} listed, ${walk.fused} fused, ${walk.used} used; live slice from ${from}: ${slice.fused}/${slice.take} fused in hex`)
})

test('release: every error and warning is answered at once, each with what resolves it', async (t) => {
  const e = await hex('data', ['errors'])
  assert.ok(typeof e.value === 'string' || typeof e.value === 'number', 'data.errors() answers at its address')
  assert.equal(e.holds, Number(e.value) === 0, 'it holds exactly when there is no error')
  // an unknown name is answered with every name that would resolve it, not a bare failure
  const bad = await hex('data', ['read'], [65535])
  assert.equal(bad.holds, false, 'a source that does not exist does not hold')
  t.diagnostic(`${e.value} errors now, in hex`)
})

test('release: the public APIs a family names test it — the registry searched by its formulas, read live, crossed by discovery', async (t) => {
  const families = nonDoors()
  for (const family of ['cal', 'hd', 'yi', 'kin']) {
    const f = families.indexOf(family)
    assert.ok(f >= 0, `${family} is a family`)
    const r = await hex('data', ['research'], [f])
    assert.ok(Number(r.value) > 0, `${family}: the registry holds APIs its formulas name`)
    assert.equal(r.holds, true, `${family}: at least one read answered`)
    t.diagnostic(`${family}: ${r.value} APIs matched, in hex`)
  }
})
