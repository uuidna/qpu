// The one MCP client every script shares. Underneath, a session with any MCP server over streamable HTTP: initialize, the session id the
// server names carried on every later message, the streamed `data:` line read, the answer's size in bytes kept. Above it, the app's Payload
// MCP: a tools/call with the user's MCP key (QPU_APP_KEY, never written anywhere) to /api/mcp (QPU_APP_MCP, else the local app), the
// plugin's json blocks parsed, a find walked page by page. Without a key or an answer it says so: an unread docket is unknown to its
// caller, its one fallback binding 0 (the RAID's own copy in hex folders, every file verified by its address).
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { LICENSE } from '../src/quantum/license.ts'
import { execFileSync } from 'node:child_process'
import { GOOGLE_HOST } from '../src/quantum/discovery.ts'
export const MCP_URL = 'http://localhost:3000/api/mcp'
// else the keychain item qpu-app-key, read once into this process and its children, never printed (the probe probe-app-key names how to store it)
if (!process.env.QPU_APP_KEY) try { const k = execFileSync('security', ['find-generic-password', '-s', 'qpu-app-key', '-w'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 5000 }).trim(); if (k) process.env.QPU_APP_KEY = k } catch { /* no keychain item */ }
/** A step's published record, docs/public/<name>.json under the licence: the one writer every step shares */
export const publishRecord = (name: string, record: object) => writeFileSync(join(process.cwd(), 'docs', 'public', `${name}.json`), JSON.stringify({ license: LICENSE.attribution, ...record }, null, 1) + '\n')
/** A toolbox's selftest run through its caller and its tally printed as every step's first line */
export const runSelftest = (name: string, call: (a: { selftest: true }) => any) => { const s = call({ selftest: true }); console.log(`${name} selftest: ${s.passed ? 'pass' : 'FAIL'} (${s.checks.filter((c: { passed: boolean }) => c.passed).length}/${s.checks.length})`); return s }
/** A published file's JSON, or the fallback when it is missing or unreadable: the one reader every script shares, never a throw */
export const readJson = (path: string, fallback: any = null): any => { try { return JSON.parse(readFileSync(path, 'utf8')) } catch { return fallback } }
const UA = 'uuidna-qpu-verify (+https://qpu.uuidna.com)'
/** A Google host asked of the qpu-google-call job through the Payload MCP, never fetched here: the call is an entry addressed by its content (one
 *  a day), the job's answer the entry naming it, read back; without the app or its key the answer says so (textbook_google_one_door) */
export const askGoogle = async (url: string, httpMethod = 'GET', body: unknown = null) => {
  const m = mcpClient(), asked = { kind: 'call', from: 'qpu-google-call', body: { url, httpMethod, body, at: new Date().toISOString().slice(0, 10) } }, made = await m.call('createEntries', asked), id = (m.docsOf(made.text ?? '')[0] as { id?: string } | undefined)?.id
  const a = (m.docsOf((await m.call('findEntries', { where: JSON.stringify({ from: { equals: 'qpu-google-call' }, 'body.request': { equals: id } }), limit: 1 })).text ?? '')[0] as { body?: { status?: number; answer?: string } } | undefined)?.body
  return { status: a?.status ?? 0, text: a?.answer ?? `the qpu-google-call job did not answer (${made.error ?? 'no answer entry'})` }
}
/** A request with the named user agent and a timeout: the one fetcher of the public sources, a Google host through askGoogle */
export const fetchWithTimeout = (url: string, accept = '*/*', ms = 20000, init: { method?: string; body?: unknown; agent?: string; headers?: Record<string, string> } = {}) => (GOOGLE_HOST.test(new URL(url).hostname) ? askGoogle(url, init.method, init.body ?? null).then((a) => new Response(a.text, { status: a.status || 503 })) : fetch(url, { method: init.method, headers: { accept, 'user-agent': init.agent ?? UA, ...(init.body ? { 'content-type': 'application/json' } : {}), ...init.headers }, body: init.body ? JSON.stringify(init.body) : undefined, redirect: 'follow', signal: AbortSignal.timeout(ms) }))
type Reply = { status: number; bytes: number; result?: any; error?: string }
/** A session with one MCP server: every request answered as its status, the bytes of its result, the result or the error. */
export const openSession = (url: string, key?: string) => {
  let session: string | null = null, id = 0
  const post = async (message: Record<string, unknown>): Promise<Reply> => {
    // a kept-alive connection the server closed while the caller was busy fails once with a network error: the request is sent again on a fresh one
    const send = () => fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream', 'user-agent': UA, ...(key ? { authorization: `Bearer ${key}` } : {}), ...(session ? { 'mcp-session-id': session } : {}) }, body: JSON.stringify({ jsonrpc: '2.0', ...message }), signal: AbortSignal.timeout(30000) }).catch((e: Error) => e)
    let res = await send(); if (res instanceof Error) res = await send()
    if (res instanceof Error) return { status: 0, bytes: 0, error: res.message }
    session = res.headers.get('mcp-session-id') ?? session
    const raw = await res.text()
    if (!('id' in message)) return { status: res.status, bytes: 0 }
    if (!res.ok) return { status: res.status, bytes: 0, error: `HTTP ${res.status}` }
    const json = raw.trimStart().startsWith('{') ? raw : raw.split('\n').filter((l) => l.startsWith('data: ')).map((l) => l.slice(6)).pop() ?? '{}'
    const j = JSON.parse(json) as { result?: unknown; error?: { message: string } }
    return j.error ? { status: res.status, bytes: 0, error: j.error.message } : { status: res.status, bytes: Buffer.byteLength(JSON.stringify(j.result ?? null)), result: j.result }
  }
  const request = (method: string, params?: unknown) => post({ id: ++id, method, ...(params === undefined ? {} : { params }) })
  const initialize = async () => { const r = await request('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'qpu', version: '1' } }); if (!r.error) await post({ method: 'notifications/initialized' }); return r }
  /** a tools/call answered as its structured content, else thrown with the door's error or refusal; paid sees every answer */
  const tool = async (name: string, args: unknown, paid?: (r: Reply) => void): Promise<any> => {
    const r = await request('tools/call', { name, arguments: args }); paid?.(r)
    if (r.error !== undefined) throw new Error(r.error)
    if (r.result?.isError) throw new Error(r.result.content?.[0]?.text ?? 'the door refused without a text')
    return r.result?.structuredContent ?? (r.result?.content?.[0] ? JSON.parse(r.result.content[0].text) : r.result)
  }
  return { url, request, initialize, tool }
}

type Answer = { text: string; error?: undefined } | { text?: undefined; error: string }
export const mcpClient = (url: string = process.env.QPU_APP_MCP ?? MCP_URL, key: string | undefined = process.env.QPU_APP_KEY) => {
  const s = openSession(url, key)
  const send = async (tool: string, args: Record<string, unknown>): Promise<Answer> => {
    if (!key) return { error: `no MCP key for ${url}: QPU_APP_KEY, or the keychain item qpu-app-key (security add-generic-password -s qpu-app-key -a "$USER" -w, the user's act)` }
    const r = await s.request('tools/call', { name: tool, arguments: args })
    if (r.error !== undefined) return { error: r.error }
    return { text: ((r.result?.content ?? []) as { text: string }[]).map((c) => c.text).join('\n') }
  }
  const docsOf = (text: string): unknown[] => [...text.matchAll(/```json\n([\s\S]*?)\n```/g)].map((m) => JSON.parse(m[1]!))
  /** one document by id, as the find tool answers it ("Resource from collection …" and the JSON), or null */
  const docOf = async (find: string, id: string): Promise<Record<string, unknown> | null> => { const a = await send(find, { id, draft: true, depth: 0 }); if (a.error !== undefined) return null; const fenced = docsOf(a.text)[0]; if (fenced) return fenced as Record<string, unknown>; const at = a.text.indexOf('{'); try { return at < 0 ? null : JSON.parse(a.text.slice(at)) } catch { return null } }
  // a value sent is within the value read back when every field it names reads back equal (a relation may read back as its document)
  const within = (sent: unknown, got: unknown): boolean => Array.isArray(sent) ? Array.isArray(got) && got.length === sent.length && sent.every((v, i) => within(v, got[i])) : sent && typeof sent === 'object' ? !!got && typeof got === 'object' && Object.entries(sent).every(([k, v]) => v === undefined || within(v, (got as Record<string, unknown>)[k])) : sent === got || (sent === null && got === undefined) || (!!got && typeof got === 'object' && (got as { id?: unknown }).id === sent)
  const settled = (d: Record<string, unknown> | null) => JSON.stringify(d, (k, v) => (k === 'updatedAt' ? undefined : v))
  /** every tool called; an update is read back before and after: a field that does not read back as sent (a data wrapper, a field outside the collection) or an update that changed nothing is an error, never a silent success */
  const call = async (tool: string, args: Record<string, unknown>): Promise<Answer> => {
    if (!/^update[A-Z]/.test(tool) || typeof args.id !== 'string') return send(tool, args)
    const find = `find${tool.replace(/^update/, () => '')}`, before = await docOf(find, args.id)
    const a = await send(tool, args); if (a.error !== undefined) return a
    const after = await docOf(find, args.id)
    if (!after) return { error: `${tool} ${args.id}: not read back through ${find}` }
    const unread = Object.keys(args).filter((k) => k !== 'id' && !within(args[k], after[k]))
    if (unread.length) return { error: `${tool} ${args.id}: ${unread.join(', ')} not as sent when read back; nothing of it changed` }
    if (before && settled(before) === settled(after)) return { error: `${tool} ${args.id}: nothing changed` }
    return { text: a.text }
  }
  /** every page of a find tool's answer: the documents, or null and why */
  const findAll = async (tool: string, args: Record<string, unknown>): Promise<{ docs: unknown[] | null; says: string }> => {
    const docs: unknown[] = []
    for (let page = 1, pages = 1; page <= pages; page++) {
      const a = await call(tool, { ...args, page })
      if (a.error !== undefined) return { docs: null, says: `unread: ${a.error}` }
      const total = /Page: \d+ of (\d+)/.exec(a.text); if (!total) return { docs: null, says: `unread: ${a.text}` }
      pages = Number(total[1]); docs.push(...docsOf(a.text))
    }
    return { docs, says: `${docs.length} document(s) read through ${tool}` }
  }
  return { url, call, docsOf, docOf, findAll }
}
/** A collection read in the RAID's order: Payload's answer, else binding 0 — the copy Payload's qpu-raid hooks keep in hex folders (QPU_BINDING0,
 *  else .qpu at the root), every version verified by its address; the source named, nothing when neither holds it (textbook_binding_zero_hex_path) */
export const raidRead = async (collection: string, read: () => Promise<Record<string, unknown>[] | null>) => {
  const docs = await read().catch(() => null); if (docs) return { docs, from: 'payload' }
  const dir = process.env.QPU_BINDING0 ?? join(process.cwd(), '.qpu'), { readBinding0 } = await import('../src/quantum/toolboxes/raid.ts')
  const back = readBinding0(collection, null, existsSync(dir) ? Object.fromEntries(readdirSync(dir, { recursive: true }).map(String).filter((p) => /[\da-f-]{36}(\.latest)?$/.test(p)).map((p) => [p, readFileSync(join(dir, p), 'utf8')])) : {}) as { docs: Record<string, unknown>[]; refused: string[] }
  return { docs: back.docs.length ? back.docs : null, from: back.docs.length ? `binding 0 (${back.refused.length} refused)` : 'unread' }
}
/** The leads beyond the core: every Research leads page's record (its leads block's lead), read in the RAID's order and handed to the tools as records */
export const readLeads = async () => {
  const m = mcpClient(), find = async (where: object) => (await m.findAll('findPages', { draft: true, depth: 0, where: JSON.stringify(where) })).docs as Record<string, unknown>[] | null
  // a lead is a leads block on any page, whatever the page is for: Payload's where on the layout, binding 0's copy read the same way
  const holds = (p: Record<string, unknown>) => ((p.layout ?? []) as { tool?: string }[]).some((b) => b.tool === 'leads')
  const r = await raidRead('pages', () => find({ 'layout.tool': { equals: 'leads' } })), pages = (r.docs ?? []).filter(holds) as { layout?: { tool?: string; arguments?: { lead?: Record<string, unknown> } }[] }[]
  const { LEADS } = await import('../src/quantum/leads.ts'), records = (pages ?? []).flatMap((p) => (p.layout ?? []).flatMap((b) => (b.tool === 'leads' && b.arguments?.lead ? [b.arguments.lead] : []))) as unknown as typeof LEADS[number][], core = new Set(LEADS.map((l) => l.id))
  return { records, all: [...LEADS, ...records.filter((l) => !core.has(l.id))], from: r.from }
}

// a lead from the command line: node scripts/mcp.ts lead --title <title> --file <statements, one per paragraph> [--parent <page id>]; the page
// of that title gets the statements it does not hold yet, or is created under the parent (default: the page titled Open work) and its tenant
if (process.argv[1]?.endsWith('mcp.ts') && process.argv[2] === 'lead') {
  const a = process.argv.slice(3), flag = (n: string) => (a.includes(n) ? a[a.indexOf(n) + 1] : undefined), m = mcpClient(), title = flag('--title') ?? ''
  const find = async (where: object) => ((await m.findAll('findPages', { draft: true, depth: 0, where: JSON.stringify(where) })).docs ?? []) as { id: string; tenant?: unknown; layout?: { blockType: string; tool: string; arguments: unknown }[] }[]
  const statements = readFileSync(flag('--file') ?? '', 'utf8').split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean), block = (statement: string) => ({ blockType: 'qpu', tool: 'match', arguments: { statement } })
  const page = (await find({ title: { equals: title } }))[0], held = JSON.stringify(page?.layout ?? []), fresh = statements.filter((s) => !held.includes(JSON.stringify(s).slice(1, 120)))
  const parent = flag('--parent') ? { id: flag('--parent'), tenant: undefined } : (await find({ title: { equals: 'Open work' } }))[0]
  const r = page ? await m.call('updatePages', { id: page.id, layout: [...(page.layout ?? []).map((b) => ({ blockType: b.blockType, tool: b.tool, arguments: b.arguments })), ...fresh.map(block)] })
    : await m.call('createPages', { tenant: (parent?.tenant as { id?: string } | undefined)?.id ?? parent?.tenant, title, parent: parent?.id, hero: { type: 'default' }, layout: statements.map(block) })
  console.log(r.error ? `refused: ${String(r.error).slice(0, 300)}` : `${page ? 'appended' : 'created'}: ${title} (${page ? fresh.length : statements.length} statement(s))`)
}

// every lead of the code written into Payload as a record (a leads block each, beside the leads Payload already holds), so the
// pre-commit hook can move them out of code once their records are equal: node scripts/mcp.ts leads-sync
if (process.argv[1]?.endsWith('mcp.ts') && process.argv[2] === 'leads-sync') {
  const m = mcpClient(), { records } = await readLeads(), held = new Set(records.map((l) => l.id)), { LEADS } = await import('../src/quantum/leads.ts'), fresh = LEADS.filter((l) => !held.has(l.id))
  const page = ((await m.findAll('findPages', { draft: true, depth: 0, where: JSON.stringify({ 'layout.tool': { equals: 'leads' } }) })).docs ?? [])[0] as { id: string; tenant?: unknown; layout?: { blockType: string; tool: string; arguments: unknown }[] } | undefined, blocks = fresh.map((lead) => ({ blockType: 'qpu', tool: 'leads', arguments: { lead } }))
  const r = !fresh.length ? { error: null } : page ? await m.call('updatePages', { id: page.id, layout: [...(page.layout ?? []).map((b) => ({ blockType: b.blockType, tool: b.tool, arguments: b.arguments })), ...blocks] }) : await m.call('createPages', { title: 'Leads', hero: { type: 'default' }, layout: blocks })
  // and back: every lead Payload holds, as the generated index the pure tools read (the leads this code computes take their own place)
  const keys = ['id', 'source', 'statement', 'status', 'tool', 'reason', 'lastmod'] as const, rows = (await readLeads()).records.map((l) => Object.fromEntries(keys.filter((k) => l[k] !== undefined).map((k) => [k, l[k]])))
  if (rows.length) writeFileSync(join(process.cwd(), 'src', 'quantum', 'leads-index.ts'), "// GENERATED by node scripts/mcp.ts leads-sync from the lead records Payload holds. Do not edit: Payload decides.\nimport type { Lead } from './leads.ts'\nexport const LEAD_ROWS: readonly Lead[] = " + JSON.stringify(rows) + '\n')
  console.log(r.error ? `refused: ${String(r.error).slice(0, 300)}` : `${fresh.length} lead(s) written into Payload, ${rows.length} read back into the index`)
}

// every table Payload holds (a block whose arguments name a table and carry a row, or a key and its value, on any page) as the generated index
// the pure tools read, as const so each table keeps its exact type:
// node scripts/mcp.ts tables-sync
if (process.argv[1]?.endsWith('mcp.ts') && process.argv[2] === 'tables-sync') {
  const m = mcpClient(), r = await raidRead('pages', async () => (await m.findAll('findPages', { draft: true, depth: 0, where: JSON.stringify({ 'layout.tool': { equals: 'payload' } }) })).docs as Record<string, unknown>[] | null), tables: Record<string, unknown[] | Record<string, unknown>> = {}
  for (const p of r.docs ?? []) for (const b of (p.layout ?? []) as { arguments?: { table?: string; row?: unknown; key?: string; value?: unknown } }[]) { const a = b.arguments; if (!a?.table) continue; if (a.key !== undefined) ((tables[a.table] ??= {}) as Record<string, unknown>)[a.key] = a.value; else if (a.row !== undefined) ((tables[a.table] ??= []) as unknown[]).push(a.row) }
  if (Object.keys(tables).length) writeFileSync(join(process.cwd(), 'src', 'quantum', 'tables-index.ts'), '// GENERATED by node scripts/mcp.ts tables-sync from the tables Payload holds. Do not edit: Payload decides.\nexport const TABLES = ' + JSON.stringify(tables) + ' as const\n')
  console.log(`${Object.keys(tables).length} table(s), ${Object.values(tables).reduce((n, x) => n + (Array.isArray(x) ? x.length : Object.keys(x).length), 0)} row(s) read from ${r.from} into the index`)
}

// the leads that run themselves, started from Payload: every lead Payload holds that names its door, asked of the job qpu-lead-run by an entry
// of kind call; the job calls the door in the app, links its answer, and marks the lead served: node scripts/mcp.ts leads-run
if (process.argv[1]?.endsWith('mcp.ts') && process.argv[2] === 'leads-run') {
  const m = mcpClient(), { records } = await readLeads(), { toolCallerOf } = await import('../src/quantum/mcp.ts'), { runs } = toolCallerOf('leads')({ runnable: { leads: records } }) as { runs: { lead: string; tool: string }[] }
  let served = 0
  for (const r of runs) { const made = await m.call('createEntries', { kind: 'call', from: 'qpu-lead-run', body: { lead: r.lead } }); const answered = ((await m.findAll('findEntries', { where: JSON.stringify({ kind: { equals: 'lead-run' } }), depth: 0 })).docs ?? []).some((e) => (e as { body?: { lead?: string; ok?: boolean } }).body?.lead === r.lead && (e as { body?: { ok?: boolean } }).body?.ok); if (answered) served++; else console.log(`${r.lead}: ${String(made.error ?? 'not served').slice(0, 160)}`) }
  console.log(`${runs.length} runnable lead(s) asked of qpu-lead-run, ${served} served`)
}

// a computation through the Payload app: node scripts/mcp.ts call <tool> [--arguments-file <json>] creates an entry of kind call, whose result
// the app computes from { tool, arguments }, and prints that result
if (process.argv[1]?.endsWith('mcp.ts') && process.argv[2] === 'call') {
  const a = process.argv.slice(4), file = a.includes('--arguments-file') ? a[a.indexOf('--arguments-file') + 1] : undefined, m = mcpClient()
  const made = await m.call('createEntries', { kind: 'call', from: 'machine', body: { tool: process.argv[3], arguments: file ? JSON.parse(readFileSync(file, 'utf8')) : {} } }), doc = m.docsOf(made.text ?? '')[0] as { result?: unknown } | undefined
  console.log(doc ? JSON.stringify(doc.result ?? null) : `refused: ${String(made.text ?? made.error).slice(0, 300)}`)
}

// a read from the command line: node scripts/mcp.ts find <collection> [--where <json>] [--select <json>] prints the documents as JSON lines
if (process.argv[1]?.endsWith('mcp.ts') && process.argv[2] === 'find') {
  const a = process.argv.slice(4), flag = (n: string) => (a.includes(n) ? a[a.indexOf(n) + 1] : undefined), c = process.argv[3] ?? 'pages'
  const r = await mcpClient().findAll(`find${c[0]!.toUpperCase()}${c.slice(1)}`, { draft: true, depth: 0, ...(flag('--where') ? { where: flag('--where') } : {}), ...(flag('--select') ? { select: flag('--select') } : {}) })
  for (const d of (r.docs ?? []) as unknown[]) console.log(JSON.stringify(d)); if (!r.docs) console.error(`unread: ${r.says}`)
}
