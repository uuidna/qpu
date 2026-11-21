// The MCP endpoint as a portable fetch handler: Streamable-HTTP framing over the pure kernel, no Payload/Next. Any
// deploy mounts /api/mcp by calling serveMcp(request, env). A notification (no id) computes but answers nothing; a
// request answers; a batch answers in kind; a malformed body is a parse error; and where a tenant names a wallet a
// tools/call is paid through Cloudflare x402 first. Price is the qubits the call uses times the fused real quantum
// market floor, held below the cheapest real quantum call — a derived figure, never typed, off by default.
import { handle, type Rpc, type Reply } from '../processing/mcp.ts'

const CORS: Record<string, string> = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, OPTIONS',
  'access-control-allow-headers': 'content-type, authorization, mcp-protocol-version, mcp-session-id, x-payment',
  'access-control-expose-headers': 'mcp-session-id, x-payment-response',
}
const json = (body: unknown, status = 200, extra: Record<string, string> = {}): Response =>
  new Response(body === null ? '' : JSON.stringify(body), { status, headers: { 'content-type': 'application/json', ...CORS, ...extra } })
const isNotification = (m: Rpc): boolean => m === null || typeof m !== 'object' || !('id' in m)
const isPaidCall = (m: Rpc): boolean => m !== null && typeof m === 'object' && m.method === 'tools/call'
const toolOf = (m: Rpc): string => String((m?.params as { name?: unknown })?.name ?? 'tool')

type X402 = { recipient: string; network: string; facilitator: string; asset: string }
const b64 = (v: unknown): string => { const s = JSON.stringify(v); return typeof btoa === 'function' ? btoa(unescape(encodeURIComponent(s))) : Buffer.from(s, 'utf8').toString('base64') }
const unb64 = (t: string): unknown => JSON.parse(typeof atob === 'function' ? decodeURIComponent(escape(atob(t))) : Buffer.from(t, 'base64').toString('utf8'))

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
const marketFloorPerQubitUsd = (): number => Math.min(...QUANTUM_MARKET.map((d) => d.perShotUsd / d.qubits))
const cheapestRealCallUsd = (): number => Math.min(...QUANTUM_MARKET.map((d) => d.taskFeeUsd + d.perShotUsd))
const bitLength = (v: unknown): number => { try { const n = typeof v === 'string' ? BigInt(/^\s*0x/i.test(v) ? v.trim() : (v.replace(/[^0-9]/g, '') || '0')) : BigInt(Math.trunc(Number(v))); return n > 0n ? n.toString(2).length : 0 } catch { return 0 } }
// Qubits the computation uses, from the request: the bit-width its arguments imply, else the two 128-bit coins it deposits.
const qubitsOf = (m: Rpc): number => {
  const a = ((m?.params as { arguments?: Record<string, unknown> })?.arguments ?? {})
  const w = Math.max(bitLength(a.n), bitLength(a.N), bitLength(a.number), bitLength(a.value), Number(a.bits) || 0, Number(a.qubits) || 0)
  return w > 0 ? w : 256
}
const priceBaseUnits = (qubits: number): bigint => BigInt(Math.max(1, Math.min(Math.ceil(qubits * marketFloorPerQubitUsd() * USDC), Math.floor(cheapestRealCallUsd() * USDC) - 1)))

// A tenant's x402 config from its env, or null (off) when no wallet is named; the price is derived, never configured.
const x402Of = (env: Record<string, string | undefined>): X402 | null => {
  const recipient = env.QPU_X402_RECIPIENT
  if (!recipient) return null
  return { recipient, network: env.QPU_X402_NETWORK ?? 'base-sepolia', facilitator: (env.QPU_X402_FACILITATOR ?? 'https://x402.org/facilitator').replace(/\/$/, ''), asset: env.QPU_X402_ASSET ?? '' }
}
const requirements = (cfg: X402, resource: string, tool: string, qubits: number) => ({ scheme: 'exact' as const, network: cfg.network, maxAmountRequired: priceBaseUnits(qubits).toString(), resource, description: `QPU MCP tool ${tool}: ${qubits} qubits at the fused quantum market floor, below competition`, mimeType: 'application/json', payTo: cfg.recipient, maxTimeoutSeconds: 60, asset: cfg.asset, extra: { tool, qubits, marketFloorPerQubitUsd: marketFloorPerQubitUsd(), cheapestRealCallUsd: cheapestRealCallUsd(), market: QUANTUM_MARKET } })
const challenge = (reqs: ReturnType<typeof requirements>, error = 'X-PAYMENT header is required') => ({ x402Version: 1, accepts: [reqs], error })
const verify = async (cfg: X402, proof: string, reqs: ReturnType<typeof requirements>): Promise<{ isValid: boolean; invalidReason?: string }> => {
  let payload: unknown
  try { payload = unb64(proof) } catch { return { isValid: false, invalidReason: 'malformed X-PAYMENT' } }
  const res = await fetch(`${cfg.facilitator}/verify`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ x402Version: 1, paymentPayload: payload, paymentRequirements: reqs }) })
  return res.ok ? (await res.json()) as { isValid: boolean; invalidReason?: string } : { isValid: false, invalidReason: `facilitator ${res.status}` }
}
const settle = async (cfg: X402, proof: string, reqs: ReturnType<typeof requirements>): Promise<string | null> => {
  try { const res = await fetch(`${cfg.facilitator}/settle`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ x402Version: 1, paymentPayload: unb64(proof), paymentRequirements: reqs }) }); return res.ok ? b64(await res.json()) : null } catch { return null }
}

/** The MCP endpoint for a deploy to mount at /api/mcp: GET answers server info, POST frames JSON-RPC and gates a
 *  paid tools/call behind x402 when the env names a wallet. `env` is the Worker/Pages/process env. */
export const serveMcp = async (request: Request, env: Record<string, string | undefined> = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {}): Promise<Response> => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS })
  if (request.method === 'GET') {
    const info = await handle({ jsonrpc: '2.0', id: 0, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'http', version: '0' } } })
    return json('result' in info ? info.result : info)
  }
  if (request.method !== 'POST') return json({ jsonrpc: '2.0', id: null, error: { code: -32601, message: `method ${request.method} is not served` } }, 405)
  let parsed: unknown
  try { parsed = await request.json() } catch { return json({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'parse error' } }, 400) }
  const batch = Array.isArray(parsed)
  const messages = (batch ? parsed : [parsed]) as Rpc[]
  const cfg = x402Of(env)
  const paid = cfg ? messages.filter(isPaidCall) : []
  let receipt: string | null = null
  if (cfg && paid.length) {
    const reqs = requirements(cfg, `${request.url}#${toolOf(paid[0]!)}`, toolOf(paid[0]!), qubitsOf(paid[0]!))
    const proof = request.headers.get('x-payment') ?? request.headers.get('payment-signature')
    if (!proof) return json(challenge(reqs), 402, { 'x-payment-required': '1' })
    const ok = await verify(cfg, proof, reqs)
    if (!ok.isValid) return json(challenge(reqs, ok.invalidReason ?? 'payment invalid'), 402)
    receipt = await settle(cfg, proof, reqs)
  }
  const replies: Reply[] = []
  for (const message of messages) { const reply = await handle(message); if (!isNotification(message)) replies.push(reply as Reply) }
  if (replies.length === 0) return new Response(null, { status: 202, headers: CORS })
  return json(batch ? replies : replies[0], 200, receipt ? { 'x-payment-response': receipt } : {})
}
