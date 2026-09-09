// mcp-rpc — JSON-RPC 2.0 MCP. Workers-safe. Stdio and HTTP share this handler.
import { QPU_TOOLS, qpuMcpCall, qpuMcpToolNames } from './mcp-catalog.js'
import type { QpuEnv } from './bindings/env.js'
import { QPU_HOST } from './hologram.js'
import { QPU_MCP_NAME, QPU_MCP_PROTOCOL, QPU_VERSION } from './version.js'

export type JsonId = string | number | null

export interface McpRpc {
  jsonrpc?: string
  id?: JsonId
  method?: string
  params?: { protocolVersion?: string; name?: string; arguments?: Record<string, unknown> }
}

const INSTRUCTIONS = [
  'Call QPU tools for constructors. Do not read QPU source to learn seat, width, hologram, chip, licence, or SEO.',
  'Tools return JSON readings. Seat stays empty. Lean proofs live on uuidna.',
  'Stdio: npx @uuidna/qpu  Live: https://qpu.uuidna.com',
].join(' ')

const CURSOR_INSTRUCTIONS = [
  'Call qpu with {name} for constructors. Inner and outer are one involution.',
  'Names: qpu_seat, qpu_width, qpu_hologram, qpu_experience, qpu_chip, qpu_seo, …',
  'Do not read QPU source. Seat stays empty.',
].join(' ')

export const qpuMcpCursorToolOf = () => ({
  name: 'qpu',
  description: 'One involution for every constructor. {name} is qpu_seat, qpu_experience, qpu_hologram, …. Optional {arguments}. Do not read source.',
  inputSchema: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      arguments: { type: 'object' },
    },
    required: ['name'],
  },
})

export const qpuMcpCursorCallOf = (
  params: NonNullable<McpRpc['params']>,
): { name: string; arguments: Record<string, unknown> } => {
  const name = String(params.name ?? '')
  const args = params.arguments ?? {}
  if (name !== 'qpu') return { name, arguments: args }
  const inner = String(args.name ?? '')
  const innerArgs = (args.arguments as Record<string, unknown> | undefined) ?? {}
  if (!inner || inner === 'qpu') throw new Error('qpu: name a catalog tool')
  return { name: inner, arguments: innerArgs }
}

export const qpuMcpDiscoveryOf = (origin: string) => ({
  server: QPU_MCP_NAME,
  transport: 'stdio (Content-Length) · POST /mcp JSON-RPC',
  protocolVersion: QPU_MCP_PROTOCOL,
  endpoint: `${origin}/mcp`,
  tools: qpuMcpToolNames(),
  note: 'initialize · tools/list · tools/call · ping. Same catalog as npx @uuidna/qpu. Scale: /ws /sse /scale /fractal.',
  websocket: `${origin}/ws`,
  sse: `${origin}/sse`,
  scale: `${origin}/scale`,
  fractal: `${origin}/fractal`,
})

const listed = () =>
  QPU_TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema }))

export async function handleQpuMcpRpc(
  msg: McpRpc,
  env?: QpuEnv,
  opts?: { cursor?: boolean },
): Promise<object | null> {
  const id = msg.id
  const method = msg.method
  const params = msg.params ?? {}
  if (!method) {
    if (id === undefined) return null
    return { jsonrpc: '2.0', id, error: { code: -32600, message: 'missing method' } }
  }
  if (method === 'notifications/initialized' || method === 'initialized' || method === 'notifications/cancelled')
    return null
  if (id === undefined && method.startsWith('notifications/')) return null

  const result = async (r: unknown) => ({ jsonrpc: '2.0', id, result: r })
  const error = (code: number, message: string) => ({ jsonrpc: '2.0', id, error: { code, message } })

  if (method === 'initialize') {
    return result({
      protocolVersion: params.protocolVersion || QPU_MCP_PROTOCOL,
      capabilities: { tools: {}, resources: {}, prompts: {} },
      serverInfo: { name: QPU_MCP_NAME, version: QPU_VERSION },
      instructions: opts?.cursor ? CURSOR_INSTRUCTIONS : INSTRUCTIONS,
    })
  }
  if (method === 'ping') return result({})
  if (method === 'tools/list') return result({ tools: opts?.cursor ? [qpuMcpCursorToolOf()] : listed() })
  if (method === 'resources/list') return result({ resources: [] })
  if (method === 'prompts/list') return result({ prompts: [] })
  if (method === 'resources/templates/list') return result({ resourceTemplates: [] })
  if (method === 'tools/call') {
    try {
      const call = qpuMcpCursorCallOf(params)
      const out = await qpuMcpCall(call.name, call.arguments, env)
      const text = typeof out === 'string' ? out : JSON.stringify(out)
      return result({ content: [{ type: 'text', text }] })
    } catch (e) {
      return error(-32602, String((e as Error).message || e))
    }
  }
  return error(-32601, `method not found: ${method}`)
}

export const qpuMcpHost = QPU_HOST
