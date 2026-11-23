// The MCP endpoint as a portable fetch handler, served by Cloudflare's Agents SDK: an MCP SDK server built from the
// kernel's own tools/list and resources/list, every tool answered by the kernel, and, where a tenant names a wallet,
// every tools/call charged through x402 (withX402, paidTool) and settled by the facilitator. Price is what the call
// would cost on the market: the cheapest real quantum call a provider charges its clients, derived, never typed.
// x402 authorises a payment with an EVM ECDSA signature, which is not post-quantum: the transport is (Cloudflare's hybrid
// X25519MLKEM768 TLS), the payment rail is not.
import { McpServer } from '@modelcontextprotocol/server'
import { createMcpHandler } from 'agents/mcp/server'
import { withX402 } from 'agents/x402'
import { z } from 'zod'
import { handle, type Rpc } from '../processing/mcp.ts'
import { TENANTS } from '../processing/unit/tenants.ts'
import { MESSAGING_TOOLS, callMessaging, type MailboxNamespace } from './messaging.ts'

// The real quantum market QPU is measured against (AWS Braket per-shot + its flat task fee; source:
// quantumcomputingcost.com/aws-braket-pricing, 2026-02). A device's per-qubit price is its shot price over its
// qubits; every real call also pays the task fee. Sourced market data, to refresh like a rate source.
type Device = { provider: string; device: string; qubits: number; perShotUsd: number; taskFeeUsd: number }
const QUANTUM_MARKET: readonly Device[] = [
  { provider: 'Rigetti', device: 'Cepheus-1-108Q', qubits: 108, perShotUsd: 0.000425, taskFeeUsd: 0.30 },
  { provider: 'IQM', device: 'Garnet', qubits: 20, perShotUsd: 0.00145, taskFeeUsd: 0.30 },
  { provider: 'IQM', device: 'Emerald', qubits: 54, perShotUsd: 0.0016, taskFeeUsd: 0.30 },
  { provider: 'IonQ', device: 'Forte', qubits: 36, perShotUsd: 0.08, taskFeeUsd: 0.30 },
]
const USDC = 1_000_000
const cheapestRealCallUsd = (): number => Math.min(...QUANTUM_MARKET.map((d) => d.taskFeeUsd + d.perShotUsd))
/** The price of one call in USD: what quantum providers charge their clients for one call, the cheapest real call on the market. */
export const callPriceUsd = (): number => Math.round(cheapestRealCallUsd() * USDC) / USDC

type Env = Record<string, unknown>
type Answer = { result?: Record<string, any>; error?: { message: string } }
const kernel = async (method: string, params: unknown = {}) => (await handle({ jsonrpc: '2.0', id: 0, method, params } as Rpc)) as Answer
let listed: Promise<{ info: Record<string, any>; tools: Record<string, any>[]; resources: Record<string, any>[] }> | undefined
/** What the kernel serves, read once: its server info and instructions, its tools, and the ui:// views they render in. */
const surface = () => (listed ??= (async () => ({
  info: (await kernel('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'qpu', version: '0' } })).result ?? {},
  tools: (await kernel('tools/list')).result?.tools ?? [],
  resources: (await kernel('resources/list')).result?.resources ?? [],
}))())

/** The tenant's x402 terms from its env, or null when it names no wallet; a wallet that is not an EVM address is refused, never served free. */
export const x402Of = (env: Env) => {
  const recipient = env.QPU_X402_RECIPIENT
  if (recipient === undefined || recipient === '') return null
  if (typeof recipient !== 'string' || !/^0x[0-9a-fA-F]{40}$/.test(recipient)) throw new Error('QPU_X402_RECIPIENT is not an EVM address')
  return { network: typeof env.QPU_X402_NETWORK === 'string' ? env.QPU_X402_NETWORK : 'base-sepolia', recipient: recipient as `0x${string}`, facilitator: { url: (typeof env.QPU_X402_FACILITATOR === 'string' ? env.QPU_X402_FACILITATOR : 'https://x402.org/facilitator') as `https://${string}` } }
}

/** One MCP SDK server over the kernel: each tool registered with its own schema, paid where the tenant names a wallet. */
const build = async (env: Env) => {
  const { info, tools, resources } = await surface(), terms = x402Of(env)
  const base = new McpServer({ name: info.serverInfo?.name ?? 'qpu', version: info.serverInfo?.version ?? '0' }, { instructions: info.instructions })
  const server = terms ? withX402(base, terms) : null
  for (const t of tools) {
    const schema = z.fromJSONSchema(t.inputSchema) as z.ZodObject
    const run = async (args: Record<string, unknown>) => { const a = await kernel('tools/call', { name: t.name, arguments: args }); return (a.result ?? { content: [{ type: 'text', text: a.error?.message ?? 'no answer' }], isError: true }) as never }
    if (server) server.paidTool(t.name, t.description, callPriceUsd(), schema.shape, t.annotations ?? {}, run).update({ _meta: t._meta })
    else base.registerTool(t.name, { description: t.description, inputSchema: schema, annotations: t.annotations, _meta: t._meta }, run)
  }
  // where the Worker binds the rooms, send and receive are tools like the kernel's, charged the same way
  const rooms = env.MAILBOX as MailboxNamespace | undefined
  for (const t of rooms ? MESSAGING_TOOLS : []) {
    const schema = z.fromJSONSchema(t.inputSchema as never) as z.ZodObject, run = async (args: Record<string, unknown>) => (await callMessaging(rooms!, t.name, args)) as never
    if (server) server.paidTool(t.name, t.description, callPriceUsd(), schema.shape, t.annotations, run)
    else base.registerTool(t.name, { description: t.description, inputSchema: schema, annotations: t.annotations }, run)
  }
  for (const r of resources) base.registerResource(r.name, r.uri, { description: r.description, mimeType: r.mimeType }, async (uri: URL) => (await kernel('resources/read', { uri: uri.href })).result as never)
  return base
}

/** Where an agent harness may be pointed: the domain itself, the conventional /mcp, and /api/mcp. */
export const MCP_PATHS = ['/', '/mcp', '/api/mcp']
/** A request of the MCP protocol, not a browser's: anything but a GET at /api/mcp; elsewhere a POST, DELETE or
 *  preflight, or a GET that asks for an event stream and not for a page. */
export const isMcp = (request: Request): boolean => {
  const path = new URL(request.url).pathname, accept = request.headers.get('accept') ?? ''
  return path === '/api/mcp' || (MCP_PATHS.includes(path) && (!['GET', 'HEAD'].includes(request.method) || (accept.includes('text/event-stream') && !accept.includes('text/html'))))
}

/** The MCP endpoint at every path of MCP_PATHS: Streamable HTTP through the Agents SDK, the hostnames the tenants
 *  name (and those QPU_MCP_HOSTS adds) allowed, every origin allowed since no call rides a cookie: each carries its own payment. */
export const serveMcp = async (request: Request, env: Env = (globalThis as { process?: { env?: Env } }).process?.env ?? {}): Promise<Response> => {
  x402Of(env) // a tenant whose wallet is not an address is refused before anything is served
  const extra = typeof env.QPU_MCP_HOSTS === 'string' ? env.QPU_MCP_HOSTS.split(',').map((h) => h.trim()).filter(Boolean) : []
  const handler = createMcpHandler(() => build(env), { route: new URL(request.url).pathname, responseMode: 'json', allowedHostnames: [...Object.keys(TENANTS), ...extra], allowedOriginHostnames: '*' })
  return handler(request, env, { waitUntil: () => {}, passThroughOnException: () => {}, props: {} } as unknown as Parameters<typeof handler>[2])
}
