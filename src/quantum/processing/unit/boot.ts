#!/usr/bin/env node
// boot — THE UNIT ON REAL HARDWARE (the captain, 2026-09-12: "make hardware bootable with qpu").
//
// The unit is a fetch handler that answers only when named: https scheme, host qpu.uuidna.com. On a machine it has no
// Cloudflare in front of it, so this adapter presents every local request AS the named origin — same bytes, same unit,
// no fork — and a Node http server carries the replies. The seat doctrine applies here first: the simulator inside is
// the reference, and this boot does not serve until the unit has proven itself on this machine (`qpu_prove` holds).
//
//   node dist/quantum/processing/unit/boot.js            → prove, then serve on $PORT (8787)
//   node dist/quantum/processing/unit/boot.js --prove    → prove and exit 0/1 (the boot's receipt; the container's HEALTHCHECK)
import { createServer, type IncomingMessage } from 'node:http'
import worker from './index.js'

const ORIGIN = 'https://qpu.uuidna.com'
const env = { QPU_HOST: 'qpu.uuidna.com' }

const bodyOf = (req: IncomingMessage): Promise<Buffer> =>
  new Promise((resolve) => { const chunks: Buffer[] = []; req.on('data', (d: Buffer) => chunks.push(d)); req.on('end', () => resolve(Buffer.concat(chunks))) })

const toRequest = async (req: IncomingMessage): Promise<Request> => {
  const method = req.method ?? 'GET'
  const headers: Record<string, string> = {}
  for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') headers[k] = v
  const body = method === 'GET' || method === 'HEAD' || method === 'OPTIONS' ? undefined : new Uint8Array(await bodyOf(req))
  return new Request(ORIGIN + (req.url ?? '/'), { method, headers, body })
}

const prove = async (): Promise<boolean> => {
  const r = await worker.fetch(new Request(`${ORIGIN}/mcp`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'qpu_prove', arguments: {} } }) }), env)
  const j = (await r.json()) as { result?: { holds?: unknown; structuredContent?: { holds?: unknown } } }
  const holds = j.result?.structuredContent?.holds ?? j.result?.holds
  console.log(`qpu boot — ${holds === true ? '✓ qpu_prove holds' : '✗ qpu_prove does not hold'} on ${process.platform}/${process.arch}, node ${process.version}`)
  return holds === true
}

const proven = await prove()
if (process.argv.includes('--prove')) process.exit(proven ? 0 : 1)
if (!proven) process.exit(1)

const port = Number(process.env.PORT ?? '8787')
createServer(async (req, res) => {
  const r = await worker.fetch(await toRequest(req), env)
  res.writeHead(r.status, Object.fromEntries(r.headers.entries()))
  res.end(Buffer.from(await r.arrayBuffer()))
}).listen(port, () => console.log(`qpu boot — serving ${ORIGIN} at http://localhost:${port} (every request presented to the unit as the named origin)`))
