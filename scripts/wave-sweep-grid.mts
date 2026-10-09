/**
 * Thin driver: combinatorial wave.sweep grids through the Payload connector (publicDoorFetchOf → publicMcpOf →
 * fused tools/call connector). Does not call WaveFormulas directly. Does not write lead-waves/gate/discovery receipts.
 *
 *   node --import tsx scripts/wave-sweep-grid.mts [--from 434] [--width 28] [--passes 2] [--out path]
 */
import { writeFileSync } from 'node:fs'
import '../src/mcp/families.js'
import '../src/mcp/qpu-fused.js'
import { publicDoorFetchOf } from '../src/payload/plugins/public.js'
import { qpuMcpToolsListOf } from '../src/quantum/processing/unit/index.js'

const FORBIDDEN_OUT = /(?:^|\/)(lead-waves-receipt|gate-receipt|discovery-receipt)\.json$/
const args = process.argv.slice(2)
const flag = (name: string, fallback?: string): string | undefined => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : fallback
}
const FROM0 = Number(flag('from', '434'))
const WIDTH0 = Number(flag('width', '28'))
const PASSES = Number(flag('passes', '2'))
const OUT = flag('out')

if (!Number.isSafeInteger(FROM0) || FROM0 < 0) throw new Error(`bad --from ${FROM0}`)
if (!Number.isSafeInteger(WIDTH0) || WIDTH0 < 1) throw new Error(`bad --width ${WIDTH0}`)
if (!Number.isSafeInteger(PASSES) || PASSES < 1) throw new Error(`bad --passes ${PASSES}`)
if (OUT && FORBIDDEN_OUT.test(OUT)) throw new Error(`refusing to write protected receipt path: ${OUT}`)

const env = { QPU_HOST: 'qpu.uuidna.com', PAYLOAD: { fetch: (request: Request) => publicDoorFetchOf(request, env) } }

/** tools/call connector through publicDoorFetchOf — the same path boot/stdio install. */
const connectorCallOf = async (arguments_: Record<string, unknown>) => {
  const request = new Request('https://qpu.uuidna.com/api/qpu/mcp', {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: { name: 'connector', arguments: arguments_ },
    }),
  })
  const response = await publicDoorFetchOf(request, env)
  const body = (await response.json()) as { result?: unknown; error?: unknown }
  if (body.error) throw new Error(JSON.stringify(body.error))
  return body.result
}

const tools = qpuMcpToolsListOf()
const listBytes = JSON.stringify({ resultType: 'complete', tools }).length
const bill = {
  doors: tools.length,
  bytes: listBytes,
  under16384: listBytes < 16384,
  qpuPrefixed: tools.filter((t) => t.name.startsWith('qpu_')).map((t) => t.name),
}

const t0 = Date.now()
// MCP tools/call connector (recognition may compress large pass tables — see expand note).
const mcpResult = await connectorCallOf({ from: FROM0, width: WIDTH0, passes: PASSES })
// Full pass tables through the same publicDoorFetchOf Payload wave endpoint (not a parallel stack).
const waveRes = await publicDoorFetchOf(
  new Request(`https://qpu.uuidna.com/api/qpu/wave?from=${FROM0}&width=${WIDTH0}&passes=${PASSES}`),
  env,
)
const grid = await waveRes.json()
const wallMs = Date.now() - t0

const report = {
  via: 'publicDoorFetchOf → publicMcpOf → tools/call connector (+ GET /api/qpu/wave for full tables)' as const,
  invoke: `node --import tsx scripts/wave-sweep-grid.mts --from ${FROM0} --width ${WIDTH0} --passes ${PASSES}`,
  connectBill: bill,
  wallMs,
  mcp: mcpResult,
  grid,
  goal: 'OPEN' as const,
}

const text = JSON.stringify(report, null, 2)
if (OUT) writeFileSync(OUT, text)
console.log(text)
