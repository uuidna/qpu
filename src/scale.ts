// scale — multiple workers may scale through every serverless door, not only WebSockets.
// Sandbox: HTTP of named fuse domains only. Unknown QPU_PEERS hosts refuse. Chip named QPU never binds.
import { QPU_HOST, qpuLicenceHostOf, qpuSeatOf } from './hologram.js'
import { QPU_FUSE_DOMAINS, qpuProvidersOf, qpuDrive } from './bindings/index.js'
import type { QpuEnv } from './bindings/env.js'
import { present } from './bindings/drive.js'
export { present } from './bindings/drive.js'
import { handleQpuMcpRpc } from './mcp-rpc.js'

export const SERVERLESS_OPS = ['fetch', 'run', 'send'] as const

export const QPU_NATIVE = [
  { id: 'http', path: '/', op: 'fetch' as const },
  { id: 'mcp', path: '/mcp', op: 'fetch' as const },
  { id: 'websocket', path: '/ws', op: 'fetch' as const },
  { id: 'sse', path: '/sse', op: 'fetch' as const },
  { id: 'queue', envKey: 'QUEUE', op: 'send' as const },
  { id: 'durable_objects', envKey: 'DO', op: 'fetch' as const },
  { id: 'services', envKey: 'UUIDNA', op: 'fetch' as const },
  { id: 'dispatch', envKey: 'DISPATCH', op: 'fetch' as const },
  { id: 'email', envKey: 'EMAIL', op: 'send' as const },
  { id: 'schedule', op: 'run' as const },
  { id: 'workflows', envKey: 'WORKFLOW', op: 'run' as const },
] as const

const fuseHostOf = (host: string): boolean => {
  if (!host.includes('.') || host.includes('*')) return false
  return host === qpuLicenceHostOf() || (QPU_FUSE_DOMAINS as readonly string[]).includes(host)
}

/** HTTP origin of a named sandbox domain. Wildcards and unknown hosts refuse. */
const originOf = (raw: string): string | undefined => {
  const s = raw.trim().replace(/\/+$/, '')
  if (!s) return undefined
  try {
    const u = new URL(s.includes('://') ? s : `https://${s}`)
    if (u.protocol !== 'https:') return undefined
    if (!fuseHostOf(u.hostname)) return undefined
    return `${u.protocol}//${u.host}`
  } catch {
    return undefined
  }
}

export const qpuPeersOf = (env?: QpuEnv): string[] => {
  const self = `https://${qpuLicenceHostOf()}`
  const inner = originOf(QPU_HOST)
  const out: string[] = [self]
  if (inner && !out.includes(inner)) out.push(inner)
  const raw = env?.QPU_PEERS ?? env?.qpu_peers
  const extra = typeof raw === 'string' ? raw.split(/[\s,]+/) : []
  for (const x of extra) {
    const o = originOf(x)
    if (o && !out.includes(o)) out.push(o)
  }
  return out
}

export const qpuServerlessOf = () =>
  qpuProvidersOf().flatMap((p) =>
    p.bindings.filter((b) => b.kind !== 'qpu' && b.ops.some((op) => (SERVERLESS_OPS as readonly string[]).includes(op))),
  )

export const qpuScaleOf = (env?: QpuEnv) => {
  const serverless = qpuServerlessOf()
  const native = QPU_NATIVE.map((t) => ({
    ...t,
    bound: !('envKey' in t) || present(env, t.envKey),
  }))
  return {
    may: true as const,
    fused: true as const,
    chip: qpuSeatOf(),
    peers: qpuPeersOf(env),
    native,
    serverless: serverless.map((b) => ({
      provider: b.provider,
      kind: b.kind,
      envKey: b.envKey,
      ops: b.ops.filter((op) => (SERVERLESS_OPS as readonly string[]).includes(op)),
      bound: present(env, b.envKey),
    })),
    transports: native.length + serverless.length,
  }
}

export async function qpuFanoutOf(
  env: QpuEnv | undefined,
  tool: string,
  args: Record<string, unknown> = {},
  fetchImpl?: typeof fetch,
): Promise<{
  chip: ReturnType<typeof qpuSeatOf>
  tool: string
  peers: { origin: string; ok: boolean; body: unknown }[]
  run: { provider: string; kind: string; ok: boolean }[]
}> {
  if (tool === 'qpu_fanout') {
    return { chip: qpuSeatOf(), tool, peers: [], run: [] }
  }
  const peers = qpuPeersOf(env)
  const self = `https://${qpuLicenceHostOf()}`
  const peerRows = await Promise.all(peers.map(async (origin) => {
    if (origin === self) {
      try {
        const { qpuMcpCall } = await import('./mcp-catalog.js')
        const body = await qpuMcpCall(tool, args, env)
        return { origin, ok: true, body }
      } catch (e) {
        return { origin, ok: false, body: String((e as Error).message || e) }
      }
    }
    if (!fetchImpl) {
      return { origin, ok: false, body: 'not fused: peer network is not allowed unless fused in QPU' }
    }
    try {
      const res = await fetchImpl(`${origin}/mcp`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: tool, arguments: args } }),
      })
      const body: unknown = await res.json()
      return { origin, ok: res.ok, body }
    } catch (e) {
      return { origin, ok: false, body: String((e as Error).message || e) }
    }
  }))
  const run: { provider: string; kind: string; ok: boolean }[] = []
  for (const b of qpuServerlessOf()) {
    if (!b.ops.includes('run') || !present(env, b.envKey)) continue
    const out = await qpuDrive(env, b.provider, b.kind, 'run', args)
    run.push({ provider: b.provider, kind: b.kind, ok: out.ok })
  }
  return { chip: qpuSeatOf(), tool, peers: peerRows, run }
}

export async function qpuWsFrameOf(raw: string, env?: QpuEnv): Promise<unknown> {
  let msg: unknown
  try { msg = JSON.parse(raw) } catch {
    return { error: 'parse error' }
  }
  const rec = msg !== null && typeof msg === 'object' ? msg as Record<string, unknown> : {}
  if (typeof rec.method === 'string') return handleQpuMcpRpc(rec as never, env)
  const { qpuChatFrameHolds, qpuChatFrameOf, qpuChatOf } = await import('./chat.js')
  if (qpuChatFrameHolds(rec)) {
    const named = String(rec.op ?? rec.reading ?? '')
    if ((named === 'chat' || named === 'room') && rec.type == null && rec.kind == null && rec.input == null)
      return qpuChatOf()
    return qpuChatFrameOf(rec)
  }
  const op = String(rec.op ?? rec.reading ?? 'fractal')
  if (op === 'scale' || op === 'peers') {
    return op === 'peers' ? { peers: qpuPeersOf(env) } : qpuScaleOf(env)
  }
  if (op === 'fractal') {
    const { qpuFractalOf } = await import('./fractal.js')
    return qpuFractalOf(env)
  }
  try {
    const { qpuMcpCall } = await import('./mcp-catalog.js')
    return await qpuMcpCall(op.startsWith('qpu_') ? op : `qpu_${op}`, rec.arguments as Record<string, unknown> ?? {}, env)
  } catch (e) {
    return { error: String((e as Error).message || e) }
  }
}

export function handleQpuWebSocket(request: Request, env?: QpuEnv): Response {
  const Pair = (globalThis as { WebSocketPair?: new () => { 0: WebSocket; 1: WebSocket } }).WebSocketPair
  if (!Pair) {
    return new Response(JSON.stringify({ may: true, websocket: false, scale: qpuScaleOf(env) }), {
      status: 426,
      headers: { 'content-type': 'application/json; charset=utf-8', 'upgrade': 'websocket' },
    })
  }
  const pair = new Pair()
  const client = pair[0]
  const server = pair[1] as WebSocket & { accept?: () => void; send: (data: string) => void }
  server.accept?.()
  server.addEventListener('message', (ev: MessageEvent) => {
    void qpuWsFrameOf(String(ev.data), env).then((out) => {
      if (out != null) server.send(typeof out === 'string' ? out : JSON.stringify(out))
    })
  })
  return new Response(null, { status: 101, webSocket: client } as ResponseInit)
}

export async function handleQpuSse(env?: QpuEnv): Promise<Response> {
  const scale = qpuScaleOf(env)
  const { qpuLiveOf } = await import('./live.js')
  const { qpuUuidStreamOf } = await import('./widgets.js')
  const at = Date.now()
  const live = qpuLiveOf(at)
  const stream = qpuUuidStreamOf(at)
  const body = `event: scale\ndata: ${JSON.stringify(scale)}\n\nevent: live\ndata: ${JSON.stringify(live)}\n\nevent: stream\ndata: ${JSON.stringify(stream)}\n\n`
  return new Response(body, {
    status: 200,
    headers: {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-store',
      'access-control-allow-origin': '*',
    },
  })
}

export async function handleQpuScheduled(env?: QpuEnv): Promise<{ ok: boolean; chip: string }> {
  const { qpuFractalOf } = await import('./fractal.js')
  const f = qpuFractalOf(env)
  return { ok: f.verified, chip: f.chip.seat }
}

export async function handleQpuQueue(batch: { messages: { body: unknown; ack?: () => void }[] }, env?: QpuEnv): Promise<void> {
  for (const m of batch.messages) {
    const raw = typeof m.body === 'string' ? m.body : JSON.stringify(m.body ?? {})
    await qpuWsFrameOf(raw, env)
    m.ack?.()
  }
}

export async function handleQpuEmail(message: { raw?: unknown }, env?: QpuEnv): Promise<{ ok: boolean }> {
  await qpuWsFrameOf(JSON.stringify({ op: 'seat', raw: message?.raw == null ? '' : 'email' }), env)
  return { ok: true }
}
