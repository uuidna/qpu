#!/usr/bin/env node
// mcp — executable QPU MCP. JSON-RPC 2.0 over stdio. Also: --list · --call <tool> [json]
// Cursor speaks Content-Length (LSP). Newline JSON still holds for humans.
import { QPU_TOOLS, qpuMcpCall, qpuMcpToolNames } from './mcp-catalog.js'
import { handleQpuMcpRpc, type McpRpc } from './mcp-rpc.js'
import { QPU_MCP_NAME } from './version.js'

export const qpuMcpFrameOf = (msg: unknown): string => {
  const body = JSON.stringify(msg)
  return `Content-Length: ${Buffer.byteLength(body, 'utf8')}\r\n\r\n${body}`
}

export const qpuMcpTakeOf = (buf: string): { msgs: McpRpc[]; rest: string } => {
  const msgs: McpRpc[] = []
  let rest = buf
  for (;;) {
    const headed = /^\s*Content-Length:/i.test(rest)
    if (headed) {
      const crlf = rest.indexOf('\r\n\r\n')
      const lf = rest.indexOf('\n\n')
      const useCrlf = crlf >= 0 && (lf < 0 || crlf <= lf)
      const at = useCrlf ? crlf : lf
      const sep = useCrlf ? 4 : 2
      if (at < 0) return { msgs, rest }
      const n = Number(/Content-Length:\s*(\d+)/i.exec(rest.slice(0, at))?.[1])
      if (!Number.isFinite(n) || n < 0) return { msgs, rest: rest.slice(at + sep) }
      const start = at + sep
      if (rest.length < start + n) return { msgs, rest }
      try { msgs.push(JSON.parse(rest.slice(start, start + n)) as McpRpc) } catch { /* skip */ }
      rest = rest.slice(start + n)
      continue
    }
    const i = rest.indexOf('\n')
    if (i < 0) return { msgs, rest }
    const line = rest.slice(0, i).trim()
    rest = rest.slice(i + 1)
    if (!line) continue
    try { msgs.push(JSON.parse(line) as McpRpc) } catch { /* skip */ }
  }
}

export type QpuMcpCli =
  | { kind: 'list' }
  | { kind: 'call'; name: string; json?: string }
  | { kind: 'stdio' }
  | { kind: 'usage' }

/** `npm run qpu -- *` / `npm run unreal -- *` / `npm run lean -- *` — any MCP tool on any hardware. */
export const qpuMcpCliArgvOf = (argv: readonly string[]): QpuMcpCli => {
  const args = argv.filter((a) => a !== '--cursor')
  if (args.length === 0) return { kind: 'stdio' }
  if (args[0] === '--list') return { kind: 'list' }
  if (args[0] === '--call') {
    if (!args[1]) return { kind: 'usage' }
    return { kind: 'call', name: args[1], json: args[2] }
  }
  if (args[0]!.startsWith('-')) return { kind: 'usage' }
  return { kind: 'call', name: args[0]!, json: args[1] }
}

export const qpuMcpCliRunOf = async (
  argv: readonly string[],
  call: (name: string, args: Record<string, unknown>) => unknown | Promise<unknown>,
  names: () => string[],
  usage: string,
): Promise<boolean> => {
  const cli = qpuMcpCliArgvOf(argv)
  if (cli.kind === 'stdio') return false
  if (cli.kind === 'list') {
    process.stdout.write(`${names().join('\n')}\n`)
    return true
  }
  if (cli.kind === 'usage') {
    process.stderr.write(`usage: ${usage}\n`)
    process.exitCode = 1
    return true
  }
  let args: Record<string, unknown> = {}
  if (cli.json) {
    try { args = JSON.parse(cli.json) as Record<string, unknown> } catch {
      process.stderr.write(`${usage.split(' ')[0]}: arguments must be JSON\n`)
      process.exitCode = 1
      return true
    }
  }
  const out = await call(cli.name, args)
  process.stdout.write(`${typeof out === 'string' ? out : JSON.stringify(out, null, 2)}\n`)
  return true
}

const cursor = typeof process !== 'undefined' && Array.isArray(process.argv) && process.argv.includes('--cursor')

const send = (msg: unknown) => {
  process.stdout.write(qpuMcpFrameOf(msg))
}

const isMain = (() => {
  if (typeof process === 'undefined' || !Array.isArray(process.argv) || process.argv[1] === undefined) return false
  const argv1 = String(process.argv[1])
  try {
    if (import.meta.url === new URL(`file://${argv1}`).href) return true
  } catch { /* windows paths */ }
  const tail = argv1.split(/[\\/]/).pop() ?? ''
  return tail === QPU_MCP_NAME || tail === 'qpu' || tail === 'mcp.js' || tail === `${QPU_MCP_NAME}.js`
})()

const cli = async (): Promise<boolean> =>
  qpuMcpCliRunOf(process.argv.slice(2), qpuMcpCall, qpuMcpToolNames, 'npm run qpu -- <tool> [json]')

const stdio = (): void => {
  let buf = ''
  process.stdin.setEncoding('utf8')
  process.stdin.on('data', (chunk) => {
    buf += chunk
    const taken = qpuMcpTakeOf(buf)
    buf = taken.rest
    for (const msg of taken.msgs) {
      void handleQpuMcpRpc(msg, undefined, cursor ? { cursor: true } : undefined).then((out) => { if (out) send(out) }).catch((e) => {
        if (msg.id !== undefined)
          send({ jsonrpc: '2.0', id: msg.id, error: { code: -32603, message: String(e) } })
      })
    }
  })
}

if (isMain) {
  void cli().then((done) => { if (!done) stdio() })
}

export { QPU_TOOLS, qpuMcpCall, qpuMcpToolNames, handleQpuMcpRpc }
