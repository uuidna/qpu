// The one QPU MCP over stdio, a thin proxy of Payload itself (the core runs inside it, as the plugin's handler): one JSON-RPC message per line
// in, one reply per line out, a notification answered with nothing. On initialize, on notifications/tools/list_changed, or at the first call
// it discovers Payload: the local app's /api/mcp with the key this process reads from the keychain item qpu-app-key (never from the environment
// or a file), then QPU_APP_MCP (the deployed app); every message goes to the app that answered and _meta.source names it. With none, tools/list
// names the probe in one entry and every call is an error naming it.
import { createInterface } from 'node:readline'
import { execFileSync } from 'node:child_process'
import { MCP_URL, openSession } from './mcp.ts'

const send = (m: unknown) => process.stdout.write(JSON.stringify(m) + '\n')
const PROBE = 'no Payload app answers: start the app (scripts/site-local.sh start) with its MCP key in the keychain item qpu-app-key, or set QPU_APP_MCP to the deployed app'
const readAppKey = () => { try { return execFileSync('security', ['find-generic-password', '-s', 'qpu-app-key', '-w'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 5000 }).trim() || undefined } catch { return undefined } }
let app: { source: string; session: ReturnType<typeof openSession>; init: { result?: any } } | null | undefined
const discover = async () => {
  app = null
  for (const [source, url] of [['local', process.env.QPU_LOCAL_MCP ?? MCP_URL], ['remote', process.env.QPU_APP_MCP]] as const) { if (!url) continue; const session = openSession(url, readAppKey()), init = await session.initialize(); if (!init.error) return void (app = { source, session, init }) }
}
for await (const line of createInterface({ input: process.stdin, crlfDelay: Infinity })) {
  if (!line.trim()) continue
  let m: { id?: unknown; method?: string; params?: unknown }
  try { m = JSON.parse(line) } catch { send({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'parse error' } }); continue }
  if (m.method === 'initialize' || m.method === 'notifications/tools/list_changed' || app === undefined) await discover()
  if (m.id === undefined || m.id === null) continue
  const r: { result?: any; error?: string } = !app ? (m.method === 'tools/list' ? { result: { tools: [{ name: 'qpu', description: PROBE, inputSchema: { type: 'object' } }] } } : { error: PROBE }) : m.method === 'initialize' ? app.init : await app.session.request(m.method ?? '', m.params)
  send({ jsonrpc: '2.0', id: m.id, ...(r.error ? { error: { code: -32603, message: r.error } } : { result: { ...r.result, _meta: { ...r.result?._meta, source: app?.source } } }) })
}
