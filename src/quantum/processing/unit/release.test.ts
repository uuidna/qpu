import { test } from './receipted.js'
import assert from 'node:assert/strict'

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
  return body.result
}
const out = (s: Shown) => (s.structuredContent ?? {}) as Record<string, unknown>
const FUSED = ['qpu_data', 'qpu_hex', 'qpu_discover', 'qpu_crypt', 'qpu_np', 'qpu_hologram']

test('release: every door and every formula is reachable through a sealed door', async (t) => {
  const d = out(await call({ doors: true })) as { doors?: { name: string; kind: string }[]; formulas?: { name: string }[] }
  assert.ok(d.doors && d.formulas, 'the sealed door answers { doors: true }')
  for (const f of FUSED) assert.ok(d.doors.some((x) => x.name === f && x.kind === 'fused'), `fused door ${f} is listed`)
  const families = new Set(d.formulas.map((f) => f.name.split('.').slice(0, -1).join('.')))
  for (const f of ['Qpu.Mint', 'Qpu.Physics', 'cross', 'np', 'clay', 'heat']) assert.ok(families.has(f), `family ${f} is reachable`)
  t.diagnostic(`${d.doors.length} doors, ${d.formulas.length} formulas`)
  // a formula runs through the door by name, its params passed as they are
  const run = out(await call({ door: 'heat.temperature', arguments: { params: [16, 1] } }))
  assert.equal(run.value, 16000, 'heat.temperature(16, 1) = 16000 mK through the door')
  // and the arguments may come flat or as a JSON string, as clients holding an older schema send them
  for (const args of [{ door: 'qpu_data', source: 'zenodo' }, { door: 'qpu_data', arguments: JSON.stringify({ source: 'zenodo' }) }]) {
    const z = out(await call(args))
    assert.notEqual(z.denied, 'source', `qpu_data received its source from ${JSON.stringify(args)}`)
  }
})

test('release: every external API and dataset is read, the theorems among them agree', async (t) => {
  const all = out(await call({ door: 'qpu_data', arguments: { source: 'all' } })) as { sources?: { source: string; args: Record<string, unknown>; label: string }[] }
  assert.ok(all.sources && all.sources.length > 0, 'qpu_data lists its sources')
  const kinds = new Set(all.sources.map((s) => s.source))
  for (const k of ['cern', 'nist', 'oeis', 'sequence', 'zenodo', 'datacite', 'orcid', 'github', 'npm', 'apis', 'catalog']) assert.ok(kinds.has(k), `a ${k} source is checked`)
  const rows = await Promise.all(all.sources.map(async (s) => ({ s, r: out(await call({ door: 'qpu_data', arguments: { ...s.args, source: s.source } })) })))
  let agree = 0, warned = 0
  for (const { s, r } of rows) {
    // every source answers: it agrees, differs with what it read, or is skipped with a warning; none is silent
    assert.ok('agrees' in r || 'warning' in r || 'denied' in r, `${s.label} answers`)
    if ('warning' in r) { warned++; assert.ok(typeof r.resolve === 'string', `${s.label}: the warning says what resolves it`); continue }
    if (r.agrees === true) agree++
    if (r.denied) assert.ok(typeof r.resolve === 'string', `${s.label}: the error says what resolves it`)
    // a theorem of the unit checked against live data must agree whenever the data could be read
    if (['cern', 'nist', 'oeis'].includes(s.source) && !r.denied) assert.equal(r.agrees, true, `${s.label} agrees with the theorem`)
  }
  t.diagnostic(`${rows.length} sources: ${agree} agree, ${warned} warned`)
})

test('release: formula discovery holds across every family', async (t) => {
  const d = out(await call({ door: 'qpu_discover', arguments: { limit: 5 } })) as { holds?: boolean; families?: string[]; perFamily?: Record<string, { runs: number }>; relationsTotal?: number }
  assert.equal(d.holds, true, 'discovery holds')
  for (const f of d.families ?? []) assert.ok((d.perFamily?.[f]?.runs ?? 0) > 0, `family ${f} ran`)
  assert.ok((d.relationsTotal ?? 0) > 0, 'two or more families reach a common value')
  t.diagnostic(`${d.families?.length} families, ${d.relationsTotal} cross-family solutions`)
})

test('release: the site end to end — every address it lists answers, every page renders as built', async (t) => {
  const get = (path: string, accept = 'text/html') => fetch(`${host}${path}`, { headers: { accept }, redirect: 'manual', signal: AbortSignal.timeout(120000) })
  // THE COLD START IS REPORTED, NOT RACED. The first page after a deploy seeds a changed site before it answers (minutes
  // on a version bump: every doc's UUID moves); this test runs right after the deploy that made the host, so it waits
  // for the first answer and records how long it took, then holds the site to its warm shape.
  const started = Date.now()
  let warm: Response | undefined
  for (let i = 0; i < 6 && !warm; i++) {
    try { warm = await get('/') } catch { /* the isolate is still seeding: ask again */ }
  }
  assert.ok(warm && warm.status === 200, `the site answers its root after a deploy (status ${warm?.status})`)
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
  // every published page renders as the admin built it: its title is the page's title
  const pages = (await (await get('/api/pages?limit=100&depth=0', 'application/json')).json()) as { docs: { slug: string; title: string; meta?: { title?: string } }[] }
  assert.ok(pages.docs.length > 0, 'Payload serves its pages')
  for (const p of pages.docs) {
    const html = await (await get(p.slug === 'home' ? '/' : `/${p.slug}`)).text()
    assert.ok(html.includes(p.meta?.title ?? p.title), `/${p.slug} renders its title`)
  }
  // the header is the admin's global, the admin answers, an unknown address is a 404 page, a program runs
  const header = (await (await get('/api/globals/header', 'application/json')).json()) as { navItems?: unknown[] }
  assert.ok((header.navItems ?? []).length > 0, 'the header global has its navigation')
  assert.equal((await get('/admin/login')).status, 200, 'the admin answers')
  assert.equal((await get('/no-such-address-anywhere')).status, 404, 'an unknown address is a 404')
  const program = await (await get('/heat/temperature+signal?p=16,1')).text()
  assert.ok(program.includes('16000'), 'a hex program renders its run: heat.temperature(16, 1) = 16000')
  t.diagnostic(`${urls.length} addresses, ${pages.docs.length} pages`)
})

test('release: every error and warning is answered at once, each with what resolves it', async (t) => {
  const e = out(await call({ errors: true })) as { errors?: { where: string; why: string; resolve: string }[]; warnings?: { where: string; why: string; resolve: string }[]; count?: number; holds?: boolean }
  assert.ok(Array.isArray(e.errors) && Array.isArray(e.warnings), 'one answer carries every error and every warning')
  for (const x of [...e.errors, ...e.warnings]) {
    assert.ok(x.where && x.why, `${JSON.stringify(x)} names where and why`)
    assert.ok(typeof x.resolve === 'string' && x.resolve.length > 0, `${x.where}: says what resolves it`)
  }
  assert.equal(e.count, e.errors.length, 'count is the errors; warnings do not count against holds')
  assert.equal(e.holds, e.errors.length === 0)
  // an unknown name is answered with every name that would resolve it, not a bare failure
  const bad = out(await call({ door: 'qpu_data', arguments: { source: 'nope' } }))
  assert.ok(Array.isArray(bad.sources) && typeof bad.resolve === 'string', `an unknown source lists every source and how to resolve it: ${JSON.stringify(bad).slice(0, 400)}`)
  t.diagnostic(`${e.errors.length} errors, ${e.warnings.length} warnings`)
})
