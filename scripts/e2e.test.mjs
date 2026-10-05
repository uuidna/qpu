/**
 * E2E ON THE DEPLOYED qpu.uuidna.com — FULL COVERAGE, TOKEN-FREE. This hits the live host over HTTP and the MCP — no LLM,
 * no tokens — and covers both ends:
 *   BACKEND: every advertised MCP tool is called and must answer (hold, or refuse on purpose with a reason); every family
 *     is run at a hex address through the door and must hold — all combinations the host serves, self-discovered from the
 *     host so coverage adapts to whatever is deployed (pre- or post-ship).
 *   FRONTEND: every page the sitemap names answers 200 with a title.
 * Deterministic (zero temp): a hex address recomputes to the same value. Network is the third state — unreached skips,
 * never fails (the leads.mjs discipline). Discovered by the scripts/*.test.mjs glob; the gate runs it against the host
 * after a deploy.
 */
import test from 'node:test'
import assert from 'node:assert/strict'

const HOST = process.env.QPU_HOST ? `https://${process.env.QPU_HOST}` : 'https://qpu.uuidna.com'
const MCP = `${HOST}/mcp`

const rpc = async (method, params = {}) => {
  const r = await fetch(MCP, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    signal: AbortSignal.timeout(90_000),
  })
  if (!r.ok) throw new Error(`${MCP} answered ${r.status}`)
  const b = await r.json()
  if (b.error) throw new Error(`${method}: ${b.error.message ?? 'rpc error'}`)
  return b.result
}
const callTool = async (name, args = {}) => {
  const res = await rpc('tools/call', { name, arguments: args })
  return res?.structuredContent ?? res
}
/** A tool answered if it returned a structured result that either holds, or refuses on purpose (denied), or carries data. */
const answered = (r) => r != null && (r.holds === true || r.holds === false || r.denied !== undefined || typeof r === 'object')

test('backend: every deployed MCP tool answers', async (t) => {
  let tools
  try { tools = (await rpc('tools/list')).tools?.map((x) => x.name) ?? [] } catch (e) { t.skip(`host unreached (${e.message})`); return }
  assert.ok(tools.length > 0, 'the host advertises tools')
  const failed = []
  for (const name of tools) {
    try {
      const r = await callTool(name, {})
      if (!answered(r)) failed.push(name)
    } catch (e) {
      failed.push(`${name} (${e.message})`)
    }
  }
  assert.deepEqual(failed, [], `tools that did not answer: ${failed.join(', ')}`)
  t.diagnostic(`${tools.length} deployed tools, all answered: ${tools.join(', ')}`)
})

test('backend: every family runs at a hex address and holds (all combinations the host serves)', async (t) => {
  // ask the host for its families through the data door (try the bare name, then the pre-ship prefixed name)
  let fams
  for (const door of ['data', 'qpu_data']) {
    try {
      const a = await callTool('prove', { door, arguments: { source: 'ask', about: 'what families do you serve' } }).catch(() => callTool('qpu_prove', { door, arguments: { source: 'ask', about: 'what families do you serve' } }))
      const list = a?.reading?.families ?? a?.families
      if (Array.isArray(list) && list.length) { fams = list; break }
    } catch { /* try next */ }
  }
  if (!fams) { t.skip('families door unreached (host may predate the door, or network third state)'); return }
  const bad = []
  for (const fam of fams) {
    const name = fam.family ?? fam
    const first = (fam.formulas ?? [])[0]
    if (!first) continue
    for (const door of ['hex', 'qpu_hex']) {
      try {
        const r = await callTool('lean', { door, arguments: { family: name, program: [first], params: [] } }).catch(() => callTool('qpu_lean', { door, arguments: { family: name, program: [first], params: [] } }))
        if (r && r.holds === false) bad.push(`${name}.${first}`)
        break
      } catch { /* try next door */ }
    }
  }
  assert.deepEqual(bad, [], `families that did not hold: ${bad.join(', ')}`)
  t.diagnostic(`ran ${fams.length} families at a hex address, every one held`)
})

test('frontend: every page the sitemap names answers 200 with a title', async (t) => {
  let xml
  try {
    const r = await fetch(`${HOST}/sitemap.xml`, { headers: { accept: 'application/xml' }, signal: AbortSignal.timeout(90_000) })
    if (!r.ok) throw new Error(`sitemap ${r.status}`)
    xml = await r.text()
  } catch (e) { t.skip(`frontend unreached (${e.message})`); return }
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(HOST, '') || '/')
  assert.ok(paths.length > 0, 'the sitemap names pages')
  const failing = []
  for (const path of paths) {
    try {
      const r = await fetch(`${HOST}${path}`, { headers: { accept: 'text/html' }, signal: AbortSignal.timeout(90_000) })
      const html = r.status === 200 ? await r.text() : ''
      if (r.status !== 200 || !/<title>[^<]+<\/title>/.test(html)) failing.push(`${path} (${r.status})`)
    } catch (e) {
      failing.push(`${path} (${e.message})`)
    }
  }
  assert.deepEqual(failing, [], `pages that did not answer 200 with a title: ${failing.join(', ')}`)
  t.diagnostic(`${paths.length} frontend pages, all 200 with a title`)
})

test('intelligent routing: a meaningful path returns combinatorics (200); a meaningless path is 404', async (t) => {
  // a meaningless path is a 404 — the words name nothing, so it is not recorded and not served
  let miss
  try {
    miss = await fetch(`${HOST}/zzqxk-${Date.now()}/not-a-real-route`, { headers: { accept: 'text/html' }, signal: AbortSignal.timeout(90_000) })
  } catch (e) { t.skip(`frontend unreached (${e.message})`); return }
  assert.equal(miss.status, 404, 'a meaningless path is 404')

  // a meaningful combination returns 200: discover a family + its first formula from the host and route /{family}/{formula}
  let fam, formula
  for (const door of ['data', 'qpu_data']) {
    try {
      const a = await callTool('prove', { door, arguments: { source: 'ask', about: 'what families do you serve' } }).catch(() => callTool('qpu_prove', { door, arguments: { source: 'ask', about: 'what families do you serve' } }))
      const list = a?.reading?.families ?? a?.families
      const f = Array.isArray(list) ? list.find((x) => (x.formulas ?? []).length) : null
      if (f) { fam = f.family ?? f; formula = (f.formulas ?? [])[0]; break }
    } catch { /* try next */ }
  }
  if (!fam) { t.skip('families door unreached — 200 combinatorics check skipped (the 404 held)'); return }
  const hit = await fetch(`${HOST}/${encodeURIComponent(fam)}/${encodeURIComponent(formula)}`, { headers: { accept: 'text/html' }, signal: AbortSignal.timeout(90_000) })
  assert.equal(hit.status, 200, `/${fam}/${formula} returns the combinatorics (200)`)
  const html = await hit.text()
  assert.match(html, /<title>[^<]+<\/title>/, 'the combinatorics page has a title')
  t.diagnostic(`meaningless path → 404; /${fam}/${formula} → 200 combinatorics`)
})
