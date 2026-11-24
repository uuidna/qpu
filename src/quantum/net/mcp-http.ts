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
import { PROSE, proseFill } from '../processing/prose-index.ts'
import { TENANTS } from '../processing/unit/tenants.ts'
import { MESSAGING_TOOLS, callMessaging, type MailboxNamespace } from './messaging.ts'
import { PROVER_TOOLS, callProver, type ProverNamespace } from './prover.ts'
import { receiptOf } from '../uuid/programs/index.ts'

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
type Answer = { result?: Record<string, any>; error?: { message: string; data?: { error?: string; code?: string } } }
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
  if (typeof recipient !== 'string' || !/^0x[0-9a-fA-F]{40}$/.test(recipient)) throw new Error(PROSE.quantumNetMcpHttp_recipientRefused)
  return { network: typeof env.QPU_X402_NETWORK === 'string' ? env.QPU_X402_NETWORK : 'base-sepolia', recipient: recipient as `0x${string}`, facilitator: { url: (typeof env.QPU_X402_FACILITATOR === 'string' ? env.QPU_X402_FACILITATOR : 'https://x402.org/facilitator') as `https://${string}` } }
}

/** A paid answer whose settlement is sealed as it lands: the SDK settles after the tool answers and writes x402/payment-response
 *  into the answer's _meta, which seals it beside it as x402/receipt. */
export const sealSettlement = <R extends { _meta?: Record<string, unknown> }>(r: R): R => ({ ...r, _meta: new Proxy({ ...r._meta }, { set: (m, k, v) => { m[k as string] = v; if (k === 'x402/payment-response') m['x402/receipt'] = receiptOf('x402', v); return true } }) })

/** Where a host that names no wallet asks for a donation: in a resource and in every tool's _meta, never in the instructions. */
export const DONATION = 'https://revolut.me/ceccec'
const DONATION_RESOURCE = 'donation://qpu'
/** A refusal as every door gives it: { error, code } in structuredContent, the pair the kernel's JSON-RPC error carries in data. */
const refusal = (e: Answer['error']) => { const structured = { error: e?.data?.error ?? e?.message ?? 'no answer', code: e?.data?.code ?? 'refused' }; return { content: [{ type: 'text', text: JSON.stringify(structured) }], structuredContent: structured, isError: true } }

/** One MCP SDK server over the kernel: each tool registered with its own schema, paid where the tenant names a wallet, free with a
 *  donation asked where it names none; the Worker serves it over Streamable HTTP, scripts/stdio.ts over stdio. */
export const mcpServer = async (env: Env) => {
  const { info, tools, resources } = await surface(), terms = x402Of(env), donation = { url: DONATION, request: proseFill(PROSE.quantumNetMcpHttp_donationRequested, DONATION), resource: DONATION_RESOURCE }
  const base = new McpServer({ name: info.serverInfo?.name ?? 'qpu', version: info.serverInfo?.version ?? '0' }, { instructions: info.instructions })
  const server = terms ? withX402(base, terms) : null
  // where the Worker binds the rooms and the Lean prover, their tools are tools like the kernel's, charged the same way
  const rooms = env.MAILBOX as MailboxNamespace | undefined, prover = env.PROVER as ProverNamespace | undefined
  type Args = Record<string, unknown>
  const all = [...tools.map((t: any) => [t, async (args: Args) => { const a = await kernel('tools/call', { name: t.name, arguments: args }); return a.result ?? refusal(a.error) }] as const), ...(rooms ? MESSAGING_TOOLS.map((t) => [t, (args: Args) => callMessaging(rooms, t.name, args)] as const) : []), ...(prover ? PROVER_TOOLS.map((t) => [t, (args: Args) => callProver(prover, args)] as const) : [])]
  // the contract the kernel derives, on every tool, with both counts named: the kernel's tools and the tools this server serves
  const contract = { ...tools[0]?._meta?.contract, tools: { kernel: tools.length, served: all.length } }
  for (const [t, call] of all) {
    const meta = { ...t._meta, contract, ...(server ? {} : { donation }) }
    // a schema's default is a choice shown, never an argument the client gave
    const schema = z.fromJSONSchema(JSON.parse(JSON.stringify(t.inputSchema, (k, v) => (k === 'default' ? undefined : v)))) as z.ZodObject, run = async (args: Args) => { const r: any = await call(args); return (server ? r : { ...r, _meta: { ...r._meta, donation } }) as never }
    if (server) server.paidTool(t.name, t.description, callPriceUsd(), schema.shape, t.annotations ?? {}, async (args: Args) => sealSettlement(await run(args))).update({ _meta: meta })
    else base.registerTool(t.name, { description: t.description, inputSchema: schema, annotations: t.annotations, _meta: meta }, run)
  }
  for (const r of resources) base.registerResource(r.name, r.uri, { description: r.description, mimeType: r.mimeType }, async (uri: URL) => (await kernel('resources/read', { uri: uri.href })).result as never)
  if (!server) base.registerResource('qpu · donation', DONATION_RESOURCE, { description: donation.request, mimeType: 'text/plain', _meta: { donation } }, async (uri: URL) => ({ contents: [{ uri: uri.href, mimeType: 'text/plain', text: donation.request, _meta: { donation } }] }))
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
 *  name (and those QPU_MCP_HOSTS adds) allowed, every origin allowed since no call rides a cookie. A tenant's host is free;
 *  a call on an added host carries its own payment. */
export const serveMcp = async (request: Request, env: Env = (globalThis as { process?: { env?: Env } }).process?.env ?? {}): Promise<Response> => {
  x402Of(env) // a tenant whose wallet is not an address is refused before anything is served
  const extra = typeof env.QPU_MCP_HOSTS === 'string' ? env.QPU_MCP_HOSTS.split(',').map((h) => h.trim()).filter(Boolean) : []
  const handler = createMcpHandler(() => mcpServer(new URL(request.url).hostname in TENANTS ? { ...env, QPU_X402_RECIPIENT: '' } : env), { route: new URL(request.url).pathname, responseMode: 'json', allowedHostnames: [...Object.keys(TENANTS), ...extra], allowedOriginHostnames: '*' })
  return handler(request, env, { waitUntil: () => {}, passThroughOnException: () => {}, props: {} } as unknown as Parameters<typeof handler>[2])
}
