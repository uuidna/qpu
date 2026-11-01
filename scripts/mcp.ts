// The one MCP client every script shares. Underneath, a session with any MCP server over streamable HTTP: initialize, the session id the
// server names carried on every later message, the streamed `data:` line read, the answer's size in bytes kept. Above it, the app's Payload
// MCP: a tools/call with the user's MCP key (QPU_APP_KEY, never written anywhere) to /api/mcp (QPU_APP_MCP, else the local app), the
// plugin's json blocks parsed, a find walked page by page. Without a key or an answer it says so: an unread docket is unknown to its
// caller, its one fallback binding 0 (the RAID's own copy in hex folders, every file verified by its address).
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { createHash } from 'node:crypto'
import { uuidOf } from '../src/quantum/processing/unit/blocks.ts'
import { LICENSE } from '../src/quantum/processing/unit/license.ts'
import { execFileSync } from 'node:child_process'
import { GOOGLE_HOST } from '../src/quantum/processing/discovery.ts'
export const MCP_URL = 'http://localhost:3000/api/mcp'
// else the keychain item qpu-app-key, read once into this process and its children, never printed (the probe probe-app-key names how to store it)
if (!process.env.QPU_APP_KEY) try { const k = execFileSync('security', ['find-generic-password', '-s', 'qpu-app-key', '-w'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 5000 }).trim(); if (k) process.env.QPU_APP_KEY = k } catch { /* no keychain item */ }
/** A step's published record, docs/public/<name>.json under the licence: the one writer every step shares */
export const publishRecord = (name: string, record: object) => writeFileSync(join(process.cwd(), 'docs', 'public', `${name}.json`), JSON.stringify({ license: LICENSE.attribution, ...record }, null, 1) + '\n')
/** A toolbox's selftest run through its caller and its tally printed as every step's first line */
export const runSelftest = (name: string, call: (a: { selftest: true }) => any) => { const s = call({ selftest: true }); console.log(`${name} selftest: ${s.passed ? 'pass' : 'FAIL'} (${s.checks.filter((c: { passed: boolean }) => c.passed).length}/${s.checks.length})`); return s }
/** A published file's JSON, or the fallback when it is missing or unreadable: the one reader every script shares, never a throw */
export const getJson = (path: string, fallback: any = null): any => { try { return JSON.parse(readFileSync(path, 'utf8')) } catch { return fallback } }
const UA = 'uuidna-qpu-verify (+https://qpu.uuidna.com)'
/** A Google host asked of the qpu-google-call job through the Payload MCP, never fetched here: the call is an entry addressed by its content (one
 *  a day), the job's answer the entry naming it, read back; without the app or its key the answer says so (textbook_google_one_door) */
export const askGoogle = async (url: string, httpMethod = 'GET', body: unknown = null) => {
  const m = mcpClient(), asked = { kind: 'call', from: 'qpu-google-call', body: { url, httpMethod, body, at: new Date().toISOString().slice(0, 10) } }, made = await m.call('createEntries', asked), id = (m.docsOf(made.text ?? '')[0] as { id?: string } | undefined)?.id
  const a = (m.docsOf((await m.call('findEntries', { where: JSON.stringify({ from: { equals: 'qpu-google-call' }, 'body.request': { equals: id } }), limit: 1 })).text ?? '')[0] as { body?: { status?: number; answer?: string } } | undefined)?.body
  return { status: a?.status ?? 0, text: a?.answer ?? `the qpu-google-call job did not answer (${made.error ?? 'no answer entry'})` }
}
/** A request with the named user agent and a timeout: the one fetcher of the public sources, a Google host through askGoogle */
export const getWithTimeout = (url: string, accept = '*/*', ms = 20000, init: { method?: string; body?: unknown; agent?: string; headers?: Record<string, string> } = {}) => (GOOGLE_HOST.test(new URL(url).hostname) ? askGoogle(url, init.method, init.body ?? null).then((a) => new Response(a.text, { status: a.status || 503 })) : fetch(url, { method: init.method, headers: { accept, 'user-agent': init.agent ?? UA, ...(init.body ? { 'content-type': 'application/json' } : {}), ...init.headers }, body: init.body ? JSON.stringify(init.body) : undefined, redirect: 'follow', signal: AbortSignal.timeout(ms) }))
type Reply = { status: number; bytes: number; result?: any; error?: string }
/** A session with one MCP server: every request answered as its status, the bytes of its result, the result or the error. */
export const openSession = (url: string, key?: string) => {
  let session: string | null = null, id = 0
  const post = async (message: Record<string, unknown>): Promise<Reply> => {
    // a kept-alive connection the server closed while the caller was busy fails once with a network error: the request is sent again on a fresh one
    const send = () => fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream', 'user-agent': UA, ...(key ? { authorization: `${process.env.QPU_APP_AUTH_COLLECTION ?? 'users'} API-Key ${key}` } : {}), ...(session ? { 'mcp-session-id': session } : {}) }, body: JSON.stringify({ jsonrpc: '2.0', ...message }), signal: AbortSignal.timeout(30000) }).catch((e: Error) => e)
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
  const base = url.replace(/\/api\/mcp$/, '') + '/api', auth = `${process.env.QPU_APP_AUTH_COLLECTION ?? 'users'} API-Key ${key}`
  const fence = (o: unknown) => '```json\n' + JSON.stringify(o) + '\n```'
  // the Payload app's CRUD REST is the MCP: find<Coll> → GET /api/<collection> (where, depth, page, draft, sort, select), create → POST, update →
  // PATCH /:id, delete → DELETE /:id; any other tool runs as POST /api/entries { kind: 'call', body: { tool, arguments } }, the entries beforeValidate
  // computing the result through callOf — the same core inside the app, over its live records under the key's roles. The answer keeps the fenced-JSON
  // and "Page: N of M" shape the callers read, so call/findAll/docOf are unchanged. (The JSON-RPC MCP plugin endpoint answers "Method not found".)
  const send = async (tool: string, args: Record<string, unknown>): Promise<Answer> => {
    if (!key) return { error: `no MCP key for ${url}: QPU_APP_KEY, or the keychain item qpu-app-key (security add-generic-password -s qpu-app-key -a "$USER" -w, the user's act)` }
    const m = /^(find|create|update|delete)([A-Z].*)$/.exec(tool)
    const coll = m ? m[2]!.replace(/^./, (c) => c.toLowerCase()).replace(/[A-Z]/g, (c) => '-' + c.toLowerCase()) : null
    const headers = { 'content-type': 'application/json', accept: 'application/json', authorization: auth }
    try {
      if (m && coll) {
        if (m[1] === 'find') {
          if (typeof args.id === 'string') { const res = await fetch(`${base}/${coll}/${args.id}?depth=${Number(args.depth ?? 0)}${args.draft ? '&draft=true' : ''}`, { headers, signal: AbortSignal.timeout(30000) }); return res.ok ? { text: fence(await res.json()) } : { error: `HTTP ${res.status}` } }
          const p = new URLSearchParams(); if (args.where != null) p.set('where', typeof args.where === 'string' ? (args.where as string) : JSON.stringify(args.where)); for (const k of ['depth', 'limit', 'page', 'sort', 'select'] as const) if (args[k] != null) p.set(k, typeof args[k] === 'string' ? (args[k] as string) : JSON.stringify(args[k])); if (args.draft) p.set('draft', 'true'); if (args.pagination === false) p.set('pagination', 'false')
          const res = await fetch(`${base}/${coll}?${p.toString()}`, { headers, signal: AbortSignal.timeout(30000) }); if (!res.ok) return { error: `HTTP ${res.status}` }
          const j = (await res.json()) as { docs?: unknown[]; page?: number; totalPages?: number }
          return { text: `Page: ${j.page ?? 1} of ${j.totalPages ?? 1}\n` + (j.docs ?? []).map(fence).join('\n') }
        }
        const { id, ...data } = args, method = m[1] === 'create' ? 'POST' : m[1] === 'update' ? 'PATCH' : 'DELETE'
        const res = await fetch(`${base}/${coll}${m[1] === 'create' ? '' : `/${String(id)}`}`, { method, headers, ...(m[1] === 'delete' ? {} : { body: JSON.stringify(data) }), signal: AbortSignal.timeout(30000) })
        if (!res.ok) return { error: `HTTP ${res.status}: ${(await res.text()).slice(0, 200)}` }
        const j = (await res.json()) as { doc?: unknown }; return { text: fence(j.doc ?? j) }
      }
      const res = await fetch(`${base}/entries`, { method: 'POST', headers, body: JSON.stringify({ kind: 'call', from: 'script', body: { tool, arguments: args } }), signal: AbortSignal.timeout(30000) })
      if (!res.ok) return { error: `HTTP ${res.status}` }
      const r = ((await res.json()) as { doc?: { result?: { content?: { text: string }[]; structuredContent?: unknown } } }).doc?.result
      return { text: fence(r?.content ? JSON.parse(r.content[0]!.text) : r?.structuredContent ?? r) }
    } catch (e) { return { error: (e as Error).message } }
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
  // Rails' ActiveRecord `in_batches`/`find_in_batches` keyset cursor, merged with Payload's query API: order by the id cursor ascending, fetch a
  // stride of rows whose id is greater_than the last id seen, advance past it, stop on a short page. Reads every document (BATCH is the stride, not a
  // limit on the total — the loop runs to exhaustion), but in ~total/BATCH indexed requests with bounded memory per batch, not one request per
  // Payload default page. The id is the unique, indexed primary key, so no tiebreaker is needed (ensure_valid_options_for_batching! in Rails).
  const BATCH = 1000 // Rails default of: 1000
  const batchWhere = (base: Record<string, unknown> | undefined, cursor: string | undefined) => {
    const parts = [...(base ? [base] : []), ...(cursor ? [{ id: { greater_than: cursor } }] : [])]
    return parts.length === 0 ? undefined : parts.length === 1 ? parts[0] : { and: parts }
  }
  /** every document of a find tool's answer, a batch at a time, to a handler (Rails `find_in_batches`); the count read, or null and why */
  const findInBatches = async (tool: string, args: Record<string, unknown>, onBatch: (docs: unknown[]) => unknown | Promise<unknown>, of = BATCH): Promise<{ count: number | null; says: string }> => {
    const base = args.where == null ? undefined : typeof args.where === 'string' ? JSON.parse(args.where) as Record<string, unknown> : args.where as Record<string, unknown>
    let cursor: string | undefined, count = 0
    for (;;) {
      const where = batchWhere(base, cursor)
      const a = await call(tool, { ...args, ...(where ? { where: JSON.stringify(where) } : {}), sort: 'id', limit: of, page: 1 })
      if (a.error !== undefined) return { count: null, says: `unread: ${a.error}` }
      if (!/Page: \d+ of \d+/.test(a.text)) return { count: null, says: `unread: ${a.text}` }
      const docs = docsOf(a.text); if (!docs.length) break
      await onBatch(docs)
      count += docs.length
      cursor = (docs[docs.length - 1] as { id?: string }).id
      if (!cursor || docs.length < of) break
    }
    return { count, says: `${count} document(s) read through ${tool} in batches of ${of}` }
  }
  /** every document yielded one at a time (Rails `find_each`) */
  const findEach = (tool: string, args: Record<string, unknown>, onDoc: (doc: unknown) => unknown | Promise<unknown>, of = BATCH) =>
    findInBatches(tool, args, async (docs) => { for (const d of docs) await onDoc(d) }, of)
  /** every document of a find tool's answer accumulated (Rails `find_each`/`in_batches` under the hood): the documents, or null and why */
  const findAll = async (tool: string, args: Record<string, unknown>): Promise<{ docs: unknown[] | null; says: string }> => {
    const docs: unknown[] = []
    const r = await findInBatches(tool, args, (batch) => { docs.push(...batch) })
    return r.count === null ? { docs: null, says: r.says } : { docs, says: r.says }
  }
  return { url, call, docsOf, docOf, findAll, findInBatches, findEach }
}
// One query API that merges Rails' ActiveRecord::Relation (guides.rubyonrails.org/active_record_querying) with Payload's find (payloadcms.com/docs/queries):
// every method is named for the AR guide and maps to a Payload query option. A relation is immutable and chainable; nothing runs until a terminal
// method (all/each/inBatches/first/last/find/findBy/count/exists) is called (AR relations are lazy). The batched reads go through the keyset finder above.
export type Relation = ReturnType<typeof relation>
export const relation = (collection: string, client: ReturnType<typeof mcpClient> = mcpClient(), q: { where?: Record<string, unknown>; sort?: string; limit?: number; depth?: number; select?: Record<string, unknown>; draft?: boolean } = {}) => {
  const Cap = collection[0]!.toUpperCase() + collection.slice(1), Find = `find${Cap}`
  const next = (p: Partial<typeof q>) => relation(collection, client, { ...q, ...p })
  const and = (w: Record<string, unknown>) => (q.where ? { and: [q.where, w] } : w)
  const args = () => ({ ...(q.where ? { where: JSON.stringify(q.where) } : {}), ...(q.sort ? { sort: q.sort } : {}), ...(q.limit != null ? { limit: q.limit } : {}), ...(q.depth != null ? { depth: q.depth } : {}), ...(q.select ? { select: JSON.stringify(q.select) } : {}), ...(q.draft ? { draft: true } : {}) })
  const total = async () => { const a = await client.call(Find, { ...args(), limit: 1 }); const m = /Page: \d+ of (\d+)/.exec(a.text ?? ''); return m ? Number(m[1]) : null } // at limit 1, totalPages === totalDocs
  return {
    where: (w: Record<string, unknown>) => next({ where: and(w) }),      // AR .where
    order: (sort: string) => next({ sort }),                              // AR .order
    limit: (n: number) => next({ limit: n }),                            // AR .limit
    select: (s: Record<string, unknown>) => next({ select: s }),         // AR .select / .pluck
    depth: (n: number) => next({ depth: n }),                            // Payload depth (no AR equivalent)
    drafts: () => next({ draft: true }),                                 // Payload drafts
    all: () => client.findAll(Find, args()),                             // AR .all / .to_a — keyset batches
    each: (fn: (d: unknown) => unknown | Promise<unknown>, of?: number) => client.findEach(Find, args(), fn, of),            // AR .find_each
    inBatches: (fn: (d: unknown[]) => unknown | Promise<unknown>, of?: number) => client.findInBatches(Find, args(), fn, of), // AR .find_in_batches / .in_batches
    first: async () => ((await client.findAll(Find, { ...args(), sort: q.sort ?? 'id', limit: 1 })).docs ?? [])[0] ?? null,    // AR .first
    last: async () => ((await client.findAll(Find, { ...args(), sort: '-' + (q.sort ?? 'id'), limit: 1 })).docs ?? [])[0] ?? null, // AR .last
    find: (id: string) => client.docOf(Find, id),                        // AR .find(id)
    findBy: async (w: Record<string, unknown>) => ((await next({ where: and(w), limit: 1 }).all()).docs ?? [])[0] ?? null,     // AR .find_by
    count: total,                                                        // AR .count (Payload totalDocs)
    exists: async () => ((await total()) ?? 0) > 0,                      // AR .exists?
    create: (data: Record<string, unknown>) => client.call(`create${Cap}`, data),                 // AR .create
    update: (id: string, data: Record<string, unknown>) => client.call(`update${Cap}`, { id, ...data }), // AR .update
    delete: (id: string) => client.call(`delete${Cap}`, { id }),         // AR .destroy
  }
}
/** A collection read in the RAID's order: Payload's answer, else binding 0 — the copy Payload's qpu-raid hooks keep in hex folders (QPU_BINDING0,
 *  else .qpu at the root), every version verified by its address; the source named, nothing when neither holds it (textbook_binding_zero_hex_path) */
export const raidRead = async (collection: string, read: () => Promise<Record<string, unknown>[] | null>) => {
  const docs = await read().catch(() => null); if (docs) return { docs, from: 'payload' }
  const dir = process.env.QPU_BINDING0 ?? join(process.cwd(), '.qpu'), { getBinding0 } = await import('../src/quantum/processing/toolboxes/raid.ts')
  const back = getBinding0(collection, null, existsSync(dir) ? Object.fromEntries(readdirSync(dir, { recursive: true }).map(String).filter((p) => /[\da-f-]{36}(\.latest)?$/.test(p)).map((p) => [p, readFileSync(join(dir, p), 'utf8')])) : {}) as { docs: Record<string, unknown>[]; refused: string[] }
  return { docs: back.docs.length ? back.docs : null, from: back.docs.length ? `binding 0 (${back.refused.length} refused)` : 'unread' }
}
/** The leads beyond the core: every Research leads page's record (its leads block's lead), read in the RAID's order and handed to the tools as records */
export const listLeads = async () => {
  const m = mcpClient(), find = async (where: object) => (await m.findAll('findPages', { depth: 0, where: JSON.stringify(where) })).docs as Record<string, unknown>[] | null
  // a lead is a leads block on any page, whatever the page is for: Payload's where on the layout, binding 0's copy read the same way
  const holds = (p: Record<string, unknown>) => ((p.layout ?? []) as { tool?: string }[]).some((b) => b.tool === 'leads')
  const r = await raidRead('pages', () => find({})), pages = (r.docs ?? []).filter(holds) as { layout?: { tool?: string; arguments?: { lead?: Record<string, unknown> } }[] }[]
  const { LEADS } = await import('../src/quantum/processing/leads.ts'), records = (pages ?? []).flatMap((p) => (p.layout ?? []).flatMap((b) => (b.tool === 'leads' && b.arguments?.lead ? [b.arguments.lead] : []))) as unknown as typeof LEADS[number][], core = new Set(LEADS.map((l) => l.id))
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
  const m = mcpClient(), { records } = await listLeads(), held = new Set(records.map((l) => l.id)), { LEADS } = await import('../src/quantum/processing/leads.ts'), fresh = LEADS.filter((l) => !held.has(l.id))
  const page = ((await m.findAll('findPages', { depth: 0, where: JSON.stringify({ 'layout.tool': { equals: 'leads' } }) })).docs ?? [])[0] as { id: string; tenant?: unknown; layout?: { blockType: string; tool: string; arguments: unknown }[] } | undefined, blocks = fresh.map((lead) => ({ blockType: 'qpu', tool: 'leads', arguments: { lead } }))
  const r = !fresh.length ? { error: null } : page ? await m.call('updatePages', { id: page.id, _status: 'published', layout: [...(page.layout ?? []).map((b) => ({ blockType: b.blockType, tool: b.tool, arguments: b.arguments })), ...blocks] }) : await m.call('createPages', { title: 'Leads', _status: 'published', hero: { type: 'default' }, layout: blocks })
  // and back: every lead Payload holds, as the generated index the pure tools read (the leads this code computes take their own place)
  const keys = ['id', 'source', 'statement', 'status', 'tool', 'reason', 'lastmod'] as const, rows = (await listLeads()).records.map((l) => Object.fromEntries(keys.filter((k) => l[k] !== undefined).map((k) => [k, l[k]])))
  if (rows.length) writeFileSync(join(process.cwd(), 'src', 'quantum', 'processing', 'leads-index.ts'), "// GENERATED by node scripts/mcp.ts leads-sync from the lead records Payload holds. Do not edit: Payload decides.\nimport type { Lead } from './leads.ts'\nexport const LEAD_ROWS: readonly Lead[] = " + JSON.stringify(rows) + '\n')
  console.log(r.error ? `refused: ${String(r.error).slice(0, 300)}` : `${fresh.length} lead(s) written into Payload, ${rows.length} read back into the index`)
}

// every table Payload holds (a block whose arguments name a table and carry a row, or a key and its value, on any page) as the generated index
// the pure tools read, as const so each table keeps its exact type:
// node scripts/mcp.ts tables-sync
if (process.argv[1]?.endsWith('mcp.ts') && process.argv[2] === 'tables-sync') {
  const m = mcpClient(), r = await raidRead('pages', async () => (await m.findAll('findPages', { draft: true, depth: 0, where: JSON.stringify({ 'layout.tool': { equals: 'payload' } }) })).docs as Record<string, unknown>[] | null), tables: Record<string, unknown[] | Record<string, unknown>> = {}
  for (const p of r.docs ?? []) for (const b of (p.layout ?? []) as { arguments?: { table?: string; row?: unknown; key?: string; value?: unknown } }[]) { const a = b.arguments; if (!a?.table) continue; if (a.key !== undefined) ((tables[a.table] ??= {}) as Record<string, unknown>)[a.key] = a.value; else if (a.row !== undefined) ((tables[a.table] ??= []) as unknown[]).push(a.row) }
  if (Object.keys(tables).length) writeFileSync(join(process.cwd(), 'src', 'quantum', 'processing', 'tables-index.ts'), '// GENERATED by node scripts/mcp.ts tables-sync from the tables Payload holds. Do not edit: Payload decides.\nexport const TABLES = ' + JSON.stringify(tables) + ' as const\n')
  console.log(`${Object.keys(tables).length} table(s), ${Object.values(tables).reduce((n, x) => n + (Array.isArray(x) ? x.length : Object.keys(x).length), 0)} row(s) read from ${r.from} into the index`)
}

// the leads that run themselves, started from Payload: every lead Payload holds that names its door, asked of the job qpu-lead-run by an entry
// of kind call; the job calls the door in the app, links its answer, and marks the lead served: node scripts/mcp.ts leads-run
if (process.argv[1]?.endsWith('mcp.ts') && process.argv[2] === 'leads-run') {
  const m = mcpClient(), { records } = await listLeads(), { toolCallerOf } = await import('../src/quantum/processing/mcp.ts'), { runs } = toolCallerOf('leads')({ runnable: { leads: records } }) as { runs: { lead: string; tool: string }[] }
  let served = 0
  for (const r of runs) { const made = await m.call('createEntries', { kind: 'call', from: 'qpu-lead-run', body: { lead: r.lead } }); const answered = ((await m.findAll('findEntries', { where: JSON.stringify({ kind: { equals: 'lead-run' } }), depth: 0 })).docs ?? []).some((e) => (e as { body?: { lead?: string; ok?: boolean } }).body?.lead === r.lead && (e as { body?: { ok?: boolean } }).body?.ok); if (answered) served++; else console.log(`${r.lead}: ${String(made.error ?? 'not served').slice(0, 160)}`) }
  console.log(`${runs.length} runnable lead(s) asked of qpu-lead-run, ${served} served`)
}

// an API contract held as Payload relations: node scripts/mcp.ts openapi-import --url <OpenAPI JSON> --ops <operationId,...>; each operation an
// entry of kind openapi-operation and each schema it reaches one of kind openapi-schema, every $ref a links relation to the component it names,
// created leaves first so each names ids that exist; a $ref back into its own path (a cycle) kept as the component's name, not linked
if (process.argv[1]?.endsWith('mcp.ts') && process.argv[2] === 'openapi-import') {
  const a = process.argv.slice(3), flag = (n: string) => (a.includes(n) ? a[a.indexOf(n) + 1] : undefined), url = flag('--url') ?? '', ops = (flag('--ops') ?? '').split(',').filter(Boolean), m = mcpClient()
  const text = await (await getWithTimeout(url, 'application/json', 180000)).text(), spec = JSON.parse(text) as { servers?: { url?: string }[]; paths: Record<string, Record<string, { operationId?: string; summary?: string; requestBody?: { content?: Record<string, { schema?: unknown }> } }>>; components?: { schemas?: Record<string, unknown> } }
  const sha256 = createHash('sha256').update(text).digest('hex'), held = new Map<string, string>(), refsOf = (x: unknown): string[] => (JSON.stringify(x ?? null).match(/"#\/components\/schemas\/[^"]+"/g) ?? []).map((r) => r.slice(22, -1))
  // an entry held by its address, computed as the entries hook computes it (kind, from, body and the links it names): reused when Payload
  // holds it, created when it does not, so a second import neither duplicates nor loses a link
  const hold = async (kind: string, body: unknown, links: string[]): Promise<string | null> => { const sorted = [...links].sort(), id = uuidOf(JSON.stringify({ kind, from: 'openapi-import', body, ...(sorted.length ? { links: sorted } : {}) }))
    if (m.docsOf((await m.call('findEntries', { where: JSON.stringify({ id: { equals: id } }), depth: 0 })).text ?? '')[0]) return id
    const made = await m.call('createEntries', { kind, from: 'openapi-import', body, links }); return (m.docsOf(made.text ?? '')[0] as { id?: string } | undefined)?.id ?? null }
  // a component's id once its referenced components hold theirs: a walk with an explicit stack, a $ref on the open path left as its name
  const idOf = async (name: string): Promise<string | null> => { const open: string[] = [], stack: { name: string; done: boolean }[] = [{ name, done: false }]
    while (stack.length) { const top = stack[stack.length - 1]!; if (held.has(top.name)) { stack.pop(); continue }
      const schema = spec.components?.schemas?.[top.name]; if (schema === undefined) { stack.pop(); continue }
      const next = refsOf(schema).filter((r) => !held.has(r) && !open.includes(r) && r !== top.name)
      if (!top.done) { top.done = true; open.push(top.name); if (next.length) { stack.push(...next.map((r) => ({ name: r, done: false }))); continue } }
      const links = refsOf(schema).flatMap((r) => (held.has(r) ? [held.get(r)!] : [])), id = await hold('openapi-schema', { name: top.name, schema, source: url, sha256, cycles: refsOf(schema).filter((r) => !held.has(r)) }, links)
      if (id) held.set(top.name, id); open.splice(open.indexOf(top.name), 1); stack.pop() }
    return held.get(name) ?? null }
  for (const [path, byMethod] of Object.entries(spec.paths)) for (const [method, op] of Object.entries(byMethod)) { if (!op?.operationId || !ops.includes(op.operationId)) continue
    const schema = op.requestBody?.content?.['application/json']?.schema ?? null, links = (await Promise.all(refsOf(schema).map(idOf))).filter((x): x is string => !!x)
    const id = await hold('openapi-operation', { operationId: op.operationId, method: method.toUpperCase(), server: spec.servers?.[0]?.url ?? null, path, summary: op.summary ?? null, requestBody: schema, source: url, sha256 }, links)
    console.log(`${op.operationId}: ${id ? 'held at ' + id.slice(0, 8) + ', linking ' + links.length + ' schema(s)' : 'refused'}`) }
  console.log(`${held.size} schema component(s) held as entries, each $ref a links relation`)
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
  let rel = relation(c).drafts().depth(0)
  if (flag('--where')) rel = rel.where(JSON.parse(flag('--where')!))
  if (flag('--select')) rel = rel.select(JSON.parse(flag('--select')!))
  const r = await rel.all()
  for (const d of (r.docs ?? []) as unknown[]) console.log(JSON.stringify(d)); if (!r.docs) console.error(`unread: ${r.says}`)
}
