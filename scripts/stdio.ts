// The one QPU MCP over stdio: a proxy of the Payload app's /api/mcp, so a client that speaks stdio reaches the same
// tools the app serves. Each line read is one JSON-RPC message; it is forwarded to the deployed app when
// QPU_APP_MCP names one, else to the local app, and the answer is written back as one line.
// The key is read from the keychain alone and travels only in the Authorization header: it is never printed,
// and a key in the environment is not used.
import { execFileSync } from 'node:child_process'
import { createInterface } from 'node:readline'

import { PROSE, proseFill } from '../src/quantum/processing/prose-index.ts'

type Message = { jsonrpc: '2.0'; id?: number | string | null; method: string; params?: unknown }

const ENDPOINTS = [
  { source: 'app', url: process.env.QPU_APP_MCP ?? '' },
  { source: 'local', url: process.env.QPU_LOCAL_MCP ?? 'http://127.0.0.1:3000/api/mcp' },
].filter((endpoint) => endpoint.url.length > 0)

/** The API key, from the keychain; empty when the keychain holds none. */
const keychain = (): string => {
  try {
    return execFileSync('security', ['find-generic-password', '-s', 'qpu', '-w'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    return ''
  }
}
const KEY = keychain()

/** The message sent to the first endpoint that answers, with where the answer came from; null when none answers. */
const forward = async (message: Message): Promise<{ source: string; reply: { result?: unknown; error?: unknown } | null } | null> => {
  for (const { source, url } of ENDPOINTS) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { accept: 'application/json, text/event-stream', 'content-type': 'application/json', ...(KEY ? { authorization: `users API-Key ${KEY}` } : {}) },
        body: JSON.stringify(message),
        signal: AbortSignal.timeout(30000),
      })
      const text = await response.text()
      // a notification has no answer; an event stream carries the answer on its last data line
      const body = text.trimStart().startsWith('{') ? text : (text.split('\n').filter((line) => line.startsWith('data:')).pop()?.slice(5) ?? '')
      return { source, reply: body.trim() ? (JSON.parse(body) as { result?: unknown; error?: unknown }) : null }
    } catch {
      // this endpoint does not answer: the next one is asked
    }
  }
  return null
}

const asked = ENDPOINTS.map((endpoint) => endpoint.url).join(', ')
const write = (id: Message['id'], body: { result: unknown } | { error: unknown }) => process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, ...body }) + '\n')

const answer = async (message: Message): Promise<void> => {
  const reached = await forward(message)
  if (message.id === undefined) return
  if (reached?.reply) {
    if (reached.reply.error !== undefined) return void write(message.id, { error: reached.reply.error })
    const result = reached.reply.result
    const sourced = message.method === 'tools/call' && result !== null && typeof result === 'object' ? { ...result, _meta: { ...(result as { _meta?: object })._meta, source: reached.source } } : result
    return void write(message.id, { result: sourced })
  }
  if (message.method === 'initialize') return void write(message.id, { result: { protocolVersion: '2025-06-18', capabilities: { tools: {} }, serverInfo: { name: 'qpu', version: '0' } } })
  if (message.method === 'tools/list') return void write(message.id, { result: { tools: [{ name: 'probe', description: proseFill(PROSE.scriptsStdio_probe, asked), inputSchema: { type: 'object' } }] } })
  write(message.id, { error: { code: -32000, message: proseFill(PROSE.scriptsStdio_unreached, asked) } })
}

// one message at a time, in the order read, so the answers keep the order of the questions
let queue: Promise<void> = Promise.resolve()
createInterface({ input: process.stdin }).on('line', (line) => {
  if (!line.trim()) return
  queue = queue.then(() => answer(JSON.parse(line) as Message))
})
