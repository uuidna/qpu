#!/usr/bin/env node
import { Console } from 'node:console'
import { createInterface } from 'node:readline'

globalThis.console = new Console(process.stderr, process.stderr)

const { default: worker, qpuHarnessesOf, rpcErrorOf } = await import('./index.js')

const { url } = qpuHarnessesOf()
const token = process.env.QPU_WRITE_TOKEN
const env = { QPU_HOST: new URL(url).hostname, ...(token ? { QPU_WRITE_TOKEN: token } : {}) }
const headers = { 'content-type': 'application/json', accept: 'application/json, text/event-stream', ...(token ? { authorization: `Bearer ${token}` } : {}) }
const internal = -32603

const isObject = (x: unknown): x is Record<string, unknown> => x !== null && typeof x === 'object' && !Array.isArray(x)
const isRpc = (x: unknown): boolean => (isObject(x) && x.jsonrpc === '2.0') || (Array.isArray(x) && x.length > 0 && x.every(isRpc))
const isNotification = (x: unknown): boolean => isObject(x) && x.id === undefined
const idsOf = (x: unknown): unknown[] => (Array.isArray(x) ? x : [x]).filter((m) => isObject(m) && m.id !== undefined).map((m) => (m as { id: unknown }).id)

const write = (reply: unknown): void => {
  process.stdout.write(`${JSON.stringify(reply)}\n`)
}

const failed = (message: unknown, data: unknown): void => {
  console.error(data)
  const errors = idsOf(message).map((id) => rpcErrorOf(id, internal, 'Internal error', data))
  if (Array.isArray(message)) {
    if (errors.length > 0) write(errors)
  } else if (!isNotification(message)) write(errors[0] ?? rpcErrorOf(null, internal, 'Internal error', data))
}

const handle = async (line: string): Promise<void> => {
  if (line.trim() === '') return
  let message: unknown
  try {
    message = JSON.parse(line)
  } catch {
    message = undefined
  }
  let reply: unknown
  let status = 0
  try {
    const response = await worker.fetch(new Request(url, { method: 'POST', headers, body: line }), env)
    status = response.status
    const text = await response.text()
    reply = text === '' ? undefined : JSON.parse(text)
  } catch (error) {
    failed(message, error instanceof Error ? { name: error.name, message: error.message } : String(error))
    return
  }
  if (isNotification(message) || (Array.isArray(reply) && reply.length === 0)) return
  if (isRpc(reply)) write(reply)
  else failed(message, { status, body: reply ?? null })
}

const pending = new Set<Promise<void>>()
const lines = createInterface({ input: process.stdin, crlfDelay: Infinity })
lines.on('line', (line) => {
  const task: Promise<void> = handle(line).finally(() => pending.delete(task))
  pending.add(task)
})
lines.on('close', () => {
  void Promise.allSettled(pending).then(() => process.stdout.write('', () => process.exit(0)))
})
