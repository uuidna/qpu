#!/usr/bin/env node
/**
 * The unit's MCP door from the shell, through the SDK's documented client (Streamable HTTP).
 * The package script enters at the unit (`stdio.js`) and calls this for a terminal or for arguments.
 *
 *   npm run mcp -- list [words]                     the tools, filtered by words in name or description
 *   npm run mcp -- <tool> ['<json>']                tools/call; prints structuredContent (else the content)
 *   npm run mcp -- <family>.<formula> ['[params]']  a family formula, through hex
 *   --all          follow `next` (it replaces `from`, or the first param) until the reading has none
 *   --url=<door>   another door (default: package.json homepage + /mcp)
 *   --local        the same call in-process over dist, labelled "computed locally"
 *   batch '[["tool", args], …]'  many calls over one connection at once
 *   --pick=a.b,c   print only these fields (fewer bytes into the caller's context)
 * Every run ends with its cost on stderr: calls, ms (hot above faces ms), bytes ≈ tokens.
 */
import fs from 'node:fs'
import { pathToFileURL } from 'node:url'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'

export const main = async (): Promise<void> => {
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
  const pick = argv.find((a) => a.startsWith('--pick='))?.slice('--pick='.length).split(',')
  // every call is measured: wall time and the bytes its answer puts into the caller's context (≈ tokens at 4 bytes each)
  const spent = { calls: 0, ms: 0, bytes: 0, slowest: 0 }
  const callOf = async (name: string, args: Record<string, unknown>) => {
    const t = performance.now()
    const r = await door.call(name, args)
    const ms = performance.now() - t, out = r.structuredContent ?? r.content
    const shown = pick ? Object.fromEntries(pick.map((p) => [p, p.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], out)])) : out
    const text = JSON.stringify(shown, null, 1)
    console.log(text)
    spent.calls++; spent.ms += ms; spent.bytes += text.length; spent.slowest = Math.max(spent.slowest, ms)
    if (r.isError) process.exitCode = 1
    return r
  }
  // a family formula is asked through hex; its params are a JSON array
  const asked = (tool: string, raw?: unknown): [string, Record<string, unknown>] => {
    if (tool.includes('.') && !tool.startsWith('qpu_')) { const [family, formula] = tool.split('.'); return ['hex', { family, program: [formula], params: raw ?? [] }] }
    return [tool, (raw ?? {}) as Record<string, unknown>]
  }
  try {
    if (!first || first === 'list') {
      const words = [raw, ...rest].filter(Boolean).map((w) => w!.toLowerCase())
      for (const t of await door.list()) if (words.every((w) => `${t.name} ${t.description ?? ''}`.toLowerCase().includes(w))) console.log(`${t.name.padEnd(28)} ${(t.description ?? '').split(/(?<=\.)\s/)[0]}`)
    } else if (first === 'batch') {
      // many calls over one connection, at once: [["tool", args], ["family.formula", [params]], …]
      await Promise.all((JSON.parse(raw ?? '[]') as [string, unknown][]).map(([tool, a]) => callOf(...asked(tool, a))))
    } else {
      let [name, args] = asked(first, raw ? JSON.parse(raw) : undefined)
      for (;;) {
        const r = await callOf(name, args)
        // a formula's reading rides in the last step; a door's in its own body
        const s = r.structuredContent as { next?: unknown; steps?: { reading?: { next?: unknown } }[] } | undefined
        const next = s?.steps?.at(-1)?.reading?.next ?? s?.next
        if (!all || (typeof next !== 'number' && !Array.isArray(next))) break
        // an address [a, b, …] is the next call's params whole; a number replaces `from`, or the first param
        if (Array.isArray(next)) args = { ...args, params: next }
        else if ('from' in args) args = { ...args, from: next }
        else if (Array.isArray(args.params)) args = { ...args, params: [next, ...(args.params as unknown[]).slice(1)] }
        else break
      }
    }
    // hot by the heat family's own rule: slower than faces ms (rule.slice answers faces)
    const faces = spent.calls ? Number(((await door.call(...asked('rule.slice'))).structuredContent as { value?: unknown } | undefined)?.value) : NaN
    console.error(`${via} → ${first ?? 'list'} · ${spent.calls} call${spent.calls === 1 ? '' : 's'} · ${Math.round(spent.ms)} ms (slowest ${Math.round(spent.slowest)} ms${spent.slowest > faces ? ', hot' : ''}) · ${spent.bytes} bytes ≈ ${Math.round(spent.bytes / 4)} tokens`)
  } catch (e) {
    console.error(`${via} → ${first ?? 'list'}: ${(e as Error).message}`)
    process.exitCode = 1
  } finally {
    await door.close()
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main()
