#!/usr/bin/env node
/**
 * The unit's MCP door from the shell, through the SDK's documented client (Streamable HTTP):
 *
 *   npm run mcp -- list [words]                     the tools, filtered by words in name or description
 *   npm run mcp -- <tool> ['<json>']                tools/call; prints structuredContent (else the content)
 *   npm run mcp -- <family>.<formula> ['[params]']  a family formula, through qpu_hex
 *   --all          follow `next` (it replaces `from`, or the first param) until the reading has none
 *   --url=<door>   another door (default: package.json homepage + /mcp)
 *   --local        the same call in-process over dist, labelled "computed locally"
 */
import fs from 'node:fs'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'

const argv = process.argv.slice(2)
const local = argv.includes('--local'), all = argv.includes('--all')
const pkg = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8')) as { name: string; version: string; homepage: string }
const url = argv.find((a) => a.startsWith('--url='))?.slice('--url='.length) ?? `${pkg.homepage}/mcp`
const [first, raw, ...rest] = argv.filter((a) => !a.startsWith('--'))

type Called = { structuredContent?: Record<string, unknown>; content?: unknown; isError?: boolean }
type Door = { list: () => Promise<{ name: string; description?: string }[]>; call: (name: string, args: Record<string, unknown>) => Promise<Called>; close: () => Promise<void> }

const remote = async (): Promise<Door> => {
  const client = new Client({ name: `${pkg.name} cli`, version: pkg.version })
  await client.connect(new StreamableHTTPClientTransport(new URL(url)))
  return {
    list: async () => { const tools = []; let cursor: string | undefined; do { const r = await client.listTools(cursor ? { cursor } : {}); tools.push(...r.tools); cursor = r.nextCursor } while (cursor); return tools },
    call: async (name, args) => (await client.callTool({ name, arguments: args })) as Called,
    close: () => client.close(),
  }
}
const inProcess = async (): Promise<Door> => {
  await import('./families.js')
  const unit = await import('../quantum/processing/unit/index.js')
  return { list: async () => unit.qpuMcpToolsListOf(), call: async (name, args) => (await unit.qpuMcpCallOf(name, args)) as Called, close: async () => {} }
}

const door = await (local ? inProcess() : remote())
const via = local ? 'computed locally' : `via ${new URL(url).host}`
try {
  if (!first || first === 'list') {
    const words = [raw, ...rest].filter(Boolean).map((w) => w!.toLowerCase())
    for (const t of await door.list()) if (words.every((w) => `${t.name} ${t.description ?? ''}`.toLowerCase().includes(w))) console.log(`${t.name.padEnd(28)} ${(t.description ?? '').split(/(?<=\.)\s/)[0]}`)
  } else {
    // a family formula is asked through qpu_hex; its params are a JSON array
    const dotted = first.includes('.') && !first.startsWith('qpu_')
    const [family, formula] = first.split('.')
    let name = dotted ? 'qpu_hex' : first
    let args: Record<string, unknown> = dotted ? { family, program: [formula], params: raw ? JSON.parse(raw) : [] } : raw ? JSON.parse(raw) : {}
    for (;;) {
      const r = await door.call(name, args)
      const out = r.structuredContent ?? r.content
      console.log(JSON.stringify(out, null, 1))
      if (r.isError) process.exitCode = 1
      // a formula's reading rides in the last step; a door's in its own body
      const s = r.structuredContent as { next?: unknown; steps?: { reading?: { next?: unknown } }[] } | undefined
      const next = s?.steps?.at(-1)?.reading?.next ?? s?.next
      if (!all || typeof next !== 'number') break
      if ('from' in args) args = { ...args, from: next }
      else if (Array.isArray(args.params)) args = { ...args, params: [next, ...(args.params as unknown[]).slice(1)] }
      else break
    }
  }
  console.error(`${via} → ${first ?? 'list'}`)
} catch (e) {
  console.error(`${via} → ${first ?? 'list'}: ${(e as Error).message}`)
  process.exitCode = 1
} finally {
  await door.close()
}
