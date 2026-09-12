#!/usr/bin/env node
// examine — the external, black-box examination of a QPU host, as an outsider with curl would run it, made repeatable.
// Every check here was first found by hand across the 2026-09-11/12 examinations; a check that fails is a finding, and
// the script exits 1 so a gate or a schedule can act on it. No code access is assumed: only HTTP. Usage:
//   node scripts/examine.mjs https://qpu.uuidna.com
import { setTimeout as sleep } from 'node:timers/promises'

const origin = (process.argv[2] ?? 'https://qpu.uuidna.com').replace(/\/$/, '')
const findings = []
const notes = []
const ok = []
const finding = (name, detail) => findings.push(`${name}: ${detail}`)
const pass = (name) => ok.push(name)
const check = (name, condition, detail) => (condition ? pass(name) : finding(name, detail))

const get = async (path, headers = {}) => {
  const res = await fetch(`${origin}${path}`, { headers })
  return { status: res.status, type: res.headers.get('content-type') ?? '', headers: res.headers, text: await res.text() }
}
const json = (t) => {
  try { return JSON.parse(t) } catch { return undefined }
}
const rpc = async (body, path = '/mcp') => {
  const res = await fetch(`${origin}${path}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: typeof body === 'string' ? body : JSON.stringify(body) })
  const text = await res.text()
  return { status: res.status, text, json: json(text) }
}
const call = async (name, args = {}, id = 9) => {
  const r = await rpc({ jsonrpc: '2.0', id, method: 'tools/call', params: { name, arguments: args } })
  return { ...r, result: r.json?.result, error: r.json?.error, sc: r.json?.result?.structuredContent }
}
const fold = (text) => {
  let h = 0xcbf29ce484222325n
  const P = 0x100000001b3n
  const M = (1n << 64n) - 1n
  for (let i = 0; i < text.length; i++) { h ^= BigInt(text.charCodeAt(i)); h = (h * P) & M }
  return h.toString(16).padStart(16, '0')
}
const typeOf = (v) => (v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v === 'number' ? (Number.isInteger(v) ? 'integer' : 'number') : typeof v)
const fits = (t, v) => { const ts = Array.isArray(t) ? t : [t]; return ts.includes(typeOf(v)) || (typeOf(v) === 'integer' && ts.includes('number')) }
const validate = (schema, reply) => {
  const errs = []
  for (const k of schema.required ?? []) if (!(k in reply)) errs.push(`${k} required`)
  for (const [k, v] of Object.entries(reply)) { const p = schema.properties?.[k]; if (p && !fits(p.type, v)) errs.push(`${k}: ${typeOf(v)} not ${JSON.stringify(p.type)}`) }
  return errs
}

// 1. determinism: two fetches of the root are byte-identical
{
  const a = await get('/'); await sleep(200); const b = await get('/')
  check('root is deterministic', a.status === 200 && a.text === b.text, `status ${a.status}/${b.status}, ${a.text.length} vs ${b.text.length} bytes`)
  const root = json(a.text)
  check('root is JSON-LD with a glossary', root?.['@context'] && root?.glossary?.holds, 'no @context or glossary')
  const api = root?.docs?.api ?? []
  const answering = []
  for (const p of ['/server', '/network', '/storage']) { const r = await get(p); if (r.status === 200) answering.push(p) }
  const undocumented = answering.filter((p) => !api.some((row) => row.path === p))
  if (undocumented.length) notes.push(`docs.api lists ${api.length} rows; ${undocumented.join(', ')} answer but are not listed`)
}
// 2. protocol errors are JSON-RPC errors
{
  const p = await rpc('not json'); check('parse error is -32700 on 400', p.status === 400 && p.json?.error?.code === -32700, `${p.status} ${p.text.slice(0, 80)}`)
  const a = await rpc('[]'); check('array body is -32600 on 400', a.status === 400 && a.json?.error?.code === -32600, `${a.status} ${a.text.slice(0, 80)}`)
  const m = await rpc({ jsonrpc: '2.0', id: 3, method: 'resources/list' }); check('unknown method is -32601 with the id', m.status === 200 && m.json?.error?.code === -32601 && m.json?.id === 3, `${m.status} ${m.text.slice(0, 80)}`)
  const u = await rpc({ jsonrpc: '2.0', id: 4, method: 'tools/call', params: { name: 'nope' } }); check('unknown tool is -32602 listing the tools', u.status === 200 && u.json?.error?.code === -32602 && Array.isArray(u.json?.error?.data?.tools) && u.json.error.data.tools.length === 16, `${u.status} ${u.text.slice(0, 120)}`)
  const s = await rpc({ jsonrpc: '2.0', id: 6, method: 'nope' }, '/server'); check('sub-server unknown method is -32601, not a job', s.json?.error?.code === -32601, s.text.slice(0, 100))
}
// 3. tools/list: sixteen tools, one input schema, a derived output schema requiring holds
let tools = []
{
  const l = await rpc({ jsonrpc: '2.0', id: 2, method: 'tools/list' })
  tools = l.json?.result?.tools ?? []
  check('tools/list has sixteen tools', tools.length === 16, `${tools.length}`)
  check('tool rows carry one input schema', tools.every((t) => t.inputSchema && !('input_schema' in t) && !('parameters' in t) && !('function' in t)), 'duplicated schema keys')
  // THE CONNECT BILL (2026-09-12): the output schema left tools/list and travels with the man page, one call away.
  for (const t of tools) {
    const m = await rpc({ jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: t.name, arguments: { man: true } } })
    t.outputSchema = m.sc?.outputSchema
  }
  check('tools/list carries no output schema (the man page does)', l.json.result.tools.every((t) => t.outputSchema === undefined))
  check('output schemas are derived and require holds', tools.every((t) => t.outputSchema?.required?.includes('holds') && Object.keys(t.outputSchema.properties ?? {}).length > 3 && String(t.outputSchema.description ?? '').startsWith('derived from')), 'an empty or undescribed output schema')
  check('tools/list under one KiB per door', l.text.length < tools.length * 1024, `${l.text.length} B`)
}
// 4. every reply: two copies, honest links, validates against its own schema
{
  let linked = 0
  for (const t of tools) {
    const c = await call(t.name)
    if (!c.result) { finding(`call ${t.name}`, `no result: ${c.text.slice(0, 80)}`); continue }
    const r = c.result
    const payload = JSON.stringify(r.structuredContent)
    const keys = Object.keys(r).sort().join(',')
    check(`${t.name}: result keys are content,structuredContent,isError,_meta`, keys === '_meta,content,isError,structuredContent', keys)
    check(`${t.name}: text content equals structuredContent`, r.content?.[0]?.type === 'text' && r.content[0].text === payload, 'text differs')
    check(`${t.name}: reply is at most two copies of the payload`, c.text.length < payload.length * 2.2 + 1200, `${c.text.length} B for ${payload.length} B`)
    const errs = validate(t.outputSchema, r.structuredContent)
    check(`${t.name}: reply validates against its output schema`, errs.length === 0, errs.slice(0, 3).join('; '))
    const link = (r.content ?? []).find((x) => x.type === 'resource_link')
    if (link) {
      linked += 1
      const page = await get(new URL(link.uri).pathname)
      const same = page.status === 200 && JSON.stringify(json(page.text)) === payload
      check(`${t.name}: resource_link resolves to the same document`, same, `GET ${link.uri} -> ${page.status}, ${same ? 'equal' : 'a different document'}`)
    }
  }
  notes.push(`${linked} of ${tools.length} tools link a page that returns their reply`)
}
// 5. crypto_shor answers its inputs, reads them honestly, and the classical check is exact
{
  const s15 = (await call('crypto_shor', { n: 15, a: 7 })).sc
  check('crypto_shor 15/7 factors 3 x 5 by period', s15?.factors?.by === 'period' && [s15.factors.p, s15.factors.q].sort().join('x') === '3x5' && s15.holds === true, JSON.stringify(s15?.factors))
  const s91 = (await call('crypto_shor', { n: 91, a: 7 })).sc
  check('crypto_shor 91/7 hands the gcd factor over', s91?.factors?.by === 'gcd' && s91.rsa?.factored === true && s91.coprime === false, JSON.stringify(s91?.factors))
  const neg = (await call('crypto_shor', { n: -91, a: 8 })).sc
  check('crypto_shor -91 has no ring and holds nothing', neg?.classical?.ring === false && neg.classical.holds === false && neg.holds === false, JSON.stringify(neg?.classical))
  const garbage = (await call('crypto_shor', { n: [15], a: 7 })).sc
  check('crypto_shor garbage n runs the default and says so', garbage?.read?.n?.how === 'default' && garbage.holds === false, JSON.stringify(garbage?.read))
  const digits = (await call('crypto_shor', { n: '2305843009213693952', a: 3 })).sc
  check('crypto_shor reads 2^61 digits exactly, sparse, beyond', digits?.exact?.n === '2305843009213693952' && digits.read?.n?.exact === true && digits.prepare?.sparse === true && digits.classical?.beyond === true && !('iterated' in (digits.classical ?? {})), JSON.stringify({ read: digits?.read?.n, classical: digits?.classical }))
  const rounded = (await call('crypto_shor', { n: 2 ** 61, a: 3 })).sc
  check('crypto_shor marks a JSON number past 2^53 inexact', rounded?.read?.n?.exact === false && rounded.holds === false, JSON.stringify(rounded?.read?.n))
  const t0 = Date.now(); const wide = (await call('crypto_shor', { n: '7'.repeat(30000), a: 2 })).sc; const ms = Date.now() - t0
  check('crypto_shor 30000-digit coprime answers in under 10 s with an exact classical verdict', wide?.classical?.beyond === true && wide.classical.unit === true && ms < 10000, `${ms} ms, ${JSON.stringify(wide?.classical)}`)
  const shots = (await call('crypto_shor')).sc?.measure
  check('shots say they are enumerated, not sampled', shots?.sampled === false && shots.enumerated === true && shots.measured === true, JSON.stringify(shots && { sampled: shots.sampled, enumerated: shots.enumerated }))
}
// 6. the proof is served, folds, and the theorems are in it
{
  const lean = await get('/src/quantum/processing/unit/index.lean')
  const dataset = json((await get('/quantum/processing/unit')).text)
  check('index.lean is served as text', lean.status === 200 && lean.type.startsWith('text/plain') && lean.text.startsWith('def mintOf'), `${lean.status} ${lean.type}`)
  check('the source fold recomputes from the served bytes', dataset?.source?.fold === fold(lean.text), `${dataset?.source?.fold} vs ${fold(lean.text)}`)
  check('every served theorem is in the source verbatim', dataset?.source?.verbatim === dataset?.source?.served && dataset?.source?.holds === true, `${dataset?.source?.verbatim}/${dataset?.source?.served}`)
  check('no sorry, axiom or by decide in the proof', !/\bsorry\b|^axiom |by decide/m.test(lean.text), 'found one')
}
// 7. cite: archive named beside the served version
{
  const cite = json((await get('/cite')).text)
  check('cite names archived and served versions', typeof cite?.archived?.commit === 'string' && typeof cite?.served?.version === 'string' && typeof cite?.current === 'boolean', JSON.stringify({ archived: cite?.archived, served: cite?.served }))
  if (cite && cite.current === false) notes.push(`cite: the archive holds v${cite.archived.version} at ${cite.archived.commit}; the host serves v${cite.served.version} (publish a tag to archive it)`)
}
// 8. writes fail closed, jobs say what they are
{
  const put = await fetch(`${origin}/storage/examine-probe`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: '{"probe":1}' })
  check('storage write without a bearer is 401', put.status === 401, `${put.status}`)
  const job = (await rpc({ gates: 'nope' }, '/server')).json
  check('a nonsense job says read default and does not hold', job?.read === 'default' && job?.holds === false, JSON.stringify({ read: job?.read, holds: job?.holds }))
  const gone = await get('/server/999999')
  check('an unknown job id is a 404 that says why', gone.status === 404 && /not stored/.test(gone.text), `${gone.status}`)
}
// 9. an outbound fetch from inside the sandbox is refused
{
  const f = (await call('net_fetch', { href: 'https://example.com/' })).sc
  check('net_fetch to another host is a host escape, denied', f?.denied === 'hostEscape' && f.holds === false, JSON.stringify(f))
}

console.log(`examine: ${origin}`)
for (const line of ok) console.log(`  ok   ${line}`)
for (const line of notes) console.log(`  note ${line}`)
for (const line of findings) console.log(`  FIND ${line}`)
console.log(`examine: ${ok.length} passed, ${findings.length} finding${findings.length === 1 ? '' : 's'}, ${notes.length} note${notes.length === 1 ? '' : 's'}`)
process.exit(findings.length === 0 ? 0 : 1)
