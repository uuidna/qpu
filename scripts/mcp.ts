// The one MCP client every script shares. Underneath, a session with any MCP server over streamable HTTP: initialize, the session id the
// server names carried on every later message, the streamed `data:` line read, the answer's size in bytes kept. Above it, the app's Payload
// MCP: a tools/call with the user's MCP key (QPU_APP_KEY, never written anywhere) to /api/mcp (QPU_APP_MCP, else the local app), the
// plugin's json blocks parsed, a find walked page by page. Without a key or an answer it says so and returns nothing: an unread docket is
// unknown to its caller, never a file fallback.
import { readFileSync } from 'node:fs'
export const MCP_URL = 'http://localhost:3000/api/mcp'
/** A published file's JSON, or the fallback when it is missing or unreadable: the one reader every script shares, never a throw */
export const readJson = (path: string, fallback: any = null): any => { try { return JSON.parse(readFileSync(path, 'utf8')) } catch { return fallback } }
const UA = 'uuidna-qpu-verify (+https://qpu.uuidna.com)'
/** A GET with the named user agent and a timeout: the one fetcher of the public sources */
export const getOf = (url: string, accept = '*/*', ms = 20000) => fetch(url, { headers: { accept, 'user-agent': UA }, signal: AbortSignal.timeout(ms) })
type Reply = { status: number; bytes: number; result?: any; error?: string }
/** A session with one MCP server: every request answered as its status, the bytes of its result, the result or the error. */
export const sessionOf = (url: string, key?: string) => {
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
export const mcpOf = (url: string = process.env.QPU_APP_MCP ?? MCP_URL, key: string | undefined = process.env.QPU_APP_KEY) => {
  const s = sessionOf(url, key)
  const send = async (tool: string, args: Record<string, unknown>): Promise<Answer> => {
    if (!key) return { error: `no MCP key for ${url} (QPU_APP_KEY)` }
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
