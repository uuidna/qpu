// The comparisons the e2e gate records on every online run, each named by a tool and measured here: the stylesheet against the CSS
// frameworks (each file fetched once, raw and gzipped, the QPU stylesheet gzipped the same way) and the tools/list against the open MCP
// servers (each initialized through the one MCP client, its tools/list measured); the tools answer the ratios.
import { gzipSync } from 'node:zlib'
import { toolCallerOf } from '../src/quantum/mcp.ts'
import { sessionOf } from './mcp.ts'

const UA = 'uuidna-qpu-verify (+https://qpu.uuidna.com)'
export const compareStylesheets = async () => {
  const css = toolCallerOf('css')
  const plan = css({ compare: true }) as { stylesheet: string; frameworks: { id: string; url: string }[] }
  const answers = await Promise.all(plan.frameworks.map(async (f) => { const res = await fetch(f.url, { headers: { 'user-agent': UA } }).catch(() => null); const body = res?.ok ? Buffer.from(await res.arrayBuffer()) : Buffer.alloc(0); return { id: f.id, status: res?.status ?? 0, bytes: body.length, gzip: body.length ? gzipSync(body).length : 0 } }))
  const qpu = Buffer.from(plan.stylesheet)
  return css({ compare: { qpu: { bytes: qpu.length, gzip: gzipSync(qpu).length }, answers } }) as { says: string; rows: unknown[]; measured: number }
}

/** The QPU's tools/list against the open MCP servers: each initialized through the one MCP client, its tools/list asked, its bytes and tools handed back. */
export const compareToolLists = async () => {
  const extend = toolCallerOf('extend')
  const plan = extend({ compare: true }) as { servers: { id: string; url: string }[] }
  const answers = await Promise.all(plan.servers.map(async (s) => { const session = sessionOf(s.url); const i = await session.initialize(); if (i.error) return { id: s.id, status: i.status, bytes: 0, tools: 0 }; const r = await session.request('tools/list'); return { id: s.id, status: r.status, bytes: r.bytes, tools: (r.result?.tools ?? []).length } }))
  return extend({ compare: { answers } }) as { says: string; rows: unknown[]; measured: number }
}
