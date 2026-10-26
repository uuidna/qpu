// The stylesheet comparison, a measure of every online e2e run: the css tool names the framework files, this client fetches each once,
// measures its bytes raw and gzipped, gzips the QPU stylesheet the same way, and hands the sizes back; the tool answers the ratios.
import { gzipSync } from 'node:zlib'
import { toolCallerOf } from '../src/quantum/mcp.ts'

const UA = 'uuidna-qpu-verify (+https://qpu.uuidna.com)'
export const compareStylesheets = async () => {
  const css = toolCallerOf('css')
  const plan = css({ compare: true }) as { stylesheet: string; frameworks: { id: string; url: string }[] }
  const answers = await Promise.all(plan.frameworks.map(async (f) => { const res = await fetch(f.url, { headers: { 'user-agent': UA } }).catch(() => null); const body = res?.ok ? Buffer.from(await res.arrayBuffer()) : Buffer.alloc(0); return { id: f.id, status: res?.status ?? 0, bytes: body.length, gzip: body.length ? gzipSync(body).length : 0 } }))
  const qpu = Buffer.from(plan.stylesheet)
  return css({ compare: { qpu: { bytes: qpu.length, gzip: gzipSync(qpu).length }, answers } }) as { says: string; rows: unknown[]; measured: number }
}
