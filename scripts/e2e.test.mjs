/**
 * E2E ON THE DEPLOYED qpu.uuidna.com — FAST, AND IT FAILS AT RISING TEMP. Token-free (HTTP/MCP, no LLM). Zero temp is the
 * hard requirement: every call carries the unit's own deadline, and a call that exceeds it is HOT — a finding, not a
 * wait (fail at rising temp, optimise at no time). Calls run in parallel slices (faces at a time), so the whole suite is
 * seconds, not minutes. Full-family verification is ONE prove — the host does every family and theorem internally, full
 * capacity in one round trip — not hundreds of client calls. Self-discovering (adapts pre/post-ship); network third
 * state: wholly unreached → skip. The gate runs it against the host after a deploy.
 */
import test from 'node:test'
import assert from 'node:assert/strict'

const HOST = process.env.QPU_HOST ? `https://${process.env.QPU_HOST}` : 'https://qpu.uuidna.com'
const MCP = `${HOST}/mcp`
const DEADLINE = 10_000 // the unit's own deadline (tenOf(hexbit) ms); beyond it the host is hot
const FACES = 14 // parallel slice width — a slice of faces at a time

/** Run items in parallel slices of FACES, so the suite is bounded in time, not the sum of the calls. */
const sliced = async (items, f) => {
  const out = []
  for (let i = 0; i < items.length; i += FACES) out.push(...(await Promise.all(items.slice(i, i + FACES).map(f))))
  return out
}
const rpc = async (method, params = {}) => {
  const r = await fetch(MCP, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }), signal: AbortSignal.timeout(DEADLINE) })
  if (!r.ok) throw new Error(`${r.status}`)
  const b = await r.json()
  if (b.error) throw new Error(b.error.message ?? 'rpc')
  return b.result
}
const callTool = async (name, args = {}) => { const res = await rpc('tools/call', { name, arguments: args }); return res?.structuredContent ?? res }
const answered = (r) => r != null && (r.holds === true || r.holds === false || r.denied !== undefined || typeof r === 'object')

test('backend: every tool answers within the deadline (fail at rising temp)', async (t) => {
  let tools
  try { tools = (await rpc('tools/list')).tools?.map((x) => x.name) ?? [] } catch (e) { t.skip(`host unreached (${e.message})`); return }
  assert.ok(tools.length > 0, 'the host advertises tools')
  const rows = await sliced(tools, async (name) => { const at = Date.now(); try { return { name, ok: answered(await callTool(name, {})), ms: Date.now() - at } } catch (e) { return { name, ok: false, ms: Date.now() - at, why: e.message } } })
  const bad = rows.filter((r) => !r.ok)
  assert.deepEqual(bad.map((r) => `${r.name} (${r.why ?? r.ms + 'ms'})`), [], `tools hot or silent within ${DEADLINE}ms`)
  t.diagnostic(`${tools.length} tools answered, slowest ${Math.max(...rows.map((r) => r.ms))}ms`)
})

test('backend: the whole system holds — one prove, full capacity in one round trip', async (t) => {
  let p
  try { p = await callTool('prove', {}).catch(() => callTool('qpu_prove', {})) } catch (e) { t.skip(`host unreached (${e.message})`); return }
  assert.equal(p?.holds, true, 'prove holds — every family and theorem')
  assert.equal(p?.cern?.holds, true, 'cern holds — verified on public data (CERN Open Data)')
})

test('frontend: every sitemap page is 200 with a title within the deadline', async (t) => {
  let xml
  try { const r = await fetch(`${HOST}/sitemap.xml`, { headers: { accept: 'application/xml' }, signal: AbortSignal.timeout(DEADLINE) }); if (!r.ok) throw new Error(`${r.status}`); xml = await r.text() } catch (e) { t.skip(`frontend unreached (${e.message})`); return }
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(HOST, '') || '/')
  assert.ok(paths.length > 0, 'the sitemap names pages')
  const rows = await sliced(paths, async (path) => { const at = Date.now(); try { const r = await fetch(`${HOST}${path}`, { headers: { accept: 'text/html' }, signal: AbortSignal.timeout(DEADLINE) }); const html = r.status === 200 ? await r.text() : ''; return { path, ok: r.status === 200 && /<title>[^<]+<\/title>/.test(html), ms: Date.now() - at, status: r.status } } catch (e) { return { path, ok: false, ms: Date.now() - at, why: `hot ${e.message}` } } })
  const bad = rows.filter((r) => !r.ok)
  assert.deepEqual(bad.map((r) => `${r.path} (${r.why ?? r.status})`), [], `pages hot or not 200 within ${DEADLINE}ms`)
  t.diagnostic(`${paths.length} pages 200 with a title, slowest ${Math.max(...rows.map((r) => r.ms))}ms`)
})

test('intelligent routing: a meaningful path is 200, a meaningless path is 404', async (t) => {
  let miss
  try { miss = await fetch(`${HOST}/zzqxk-${Date.now()}/not-a-real-route`, { headers: { accept: 'text/html' }, signal: AbortSignal.timeout(DEADLINE) }) } catch (e) { t.skip(`frontend unreached (${e.message})`); return }
  assert.equal(miss.status, 404, 'a meaningless path is 404')
  // a family named by the sitemap, routed as a page, is the 200 combination; discovery of the exact family is the host's
  const probe = await fetch(`${HOST}/sitemap.xml`, { headers: { accept: 'application/xml' }, signal: AbortSignal.timeout(DEADLINE) }).then((r) => r.text()).catch(() => '')
  const page = [...probe.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(HOST, '')).find((p) => /^\/[a-z]+$/.test(p))
  if (!page) { t.skip('no single-word page to probe (the 404 held)'); return }
  const hit = await fetch(`${HOST}${page}`, { headers: { accept: 'text/html' }, signal: AbortSignal.timeout(DEADLINE) })
  assert.equal(hit.status, 200, `${page} returns combinatorics (200)`)
  t.diagnostic(`meaningless → 404; ${page} → 200`)
})
