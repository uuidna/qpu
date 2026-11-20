// The Payload app's MCP door as a client reaches it: the deployed app when QPU_APP_MCP names one, else the local app.
// The key is read from the keychain alone and travels only in the Authorization header: it is never printed,
// and a key in the environment is not used.
import { execFileSync } from 'node:child_process'

export type DoorMessage = { jsonrpc: '2.0'; id?: number | string | null; method: string; params?: unknown }
export type DoorReply = { result?: unknown; error?: unknown }

/** The doors in the order they are asked: the app named (QPU_APP_MCP unless one is handed over), then the local app. */
export const doorEndpoints = (app: string = process.env.QPU_APP_MCP ?? '') =>
  [
    { source: 'app', url: app },
    { source: 'local', url: process.env.QPU_LOCAL_MCP ?? 'http://127.0.0.1:3000/api/mcp' },
  ].filter((endpoint) => endpoint.url.length > 0)
export const DOOR_ENDPOINTS = doorEndpoints()

/** The API key, from the keychain; empty when the keychain holds none. */
const keychain = (): string => {
  try {
    return execFileSync('security', ['find-generic-password', '-s', 'qpu', '-w'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    return ''
  }
}
let key: string | undefined

/** The message sent to the first endpoint that answers, with where the answer came from; null when none answers. */
export const forward = async (message: DoorMessage, o: { endpoints?: readonly { source: string; url: string }[]; budgetMs?: number } = {}): Promise<{ source: string; reply: DoorReply | null } | null> => {
  key ??= keychain()
  for (const { source, url } of o.endpoints ?? DOOR_ENDPOINTS) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { accept: 'application/json, text/event-stream', 'content-type': 'application/json', ...(key ? { authorization: `users API-Key ${key}` } : {}) },
        body: JSON.stringify(message),
        signal: AbortSignal.timeout(o.budgetMs ?? 30000),
      })
      const text = await response.text()
      // a notification has no answer; an event stream carries the answer on its last data line
      const body = text.trimStart().startsWith('{') ? text : (text.split('\n').filter((line) => line.startsWith('data:')).pop()?.slice(5) ?? '')
      return { source, reply: body.trim() ? (JSON.parse(body) as DoorReply) : null }
    } catch {
      // this endpoint does not answer: the next one is asked
    }
  }
  return null
}
