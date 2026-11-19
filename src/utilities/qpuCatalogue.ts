import { defineTool } from '@payloadcms/plugin-mcp'
import { handle } from '@uuidna/qpu/mcp'

import { canonicalText, uuid } from '@/quantum/password/address.js'

type Tool = ReturnType<ReturnType<typeof defineTool>['handler']>
type Listed = { description: string; inputSchema: Record<string, unknown>; name: string }
type Answer = { error?: { message: string }; result?: { content?: { text?: string; type: string }[]; isError?: boolean; structuredContent?: unknown } }

/** One tools/call of qpu's catalogue, answered by its handler in this Worker: the call every MCP tool and hook makes. */
export const callCatalogue = async (name: string, args: Record<string, unknown>) => {
  const r = (await handle({ id: 1, jsonrpc: '2.0', method: 'tools/call', params: { arguments: args, name } })) as Answer
  if (r.error) return { error: r.error.message }
  return { isError: r.result?.isError === true, structured: r.result?.structuredContent as Record<string, unknown> | undefined, content: r.result?.content }
}

/** qpu's quantum handler catalogue (src/quantum/processing/mcp.ts) as plugin-mcp top-level tools: each catalogue tool
 *  keeps its name, description and input schema, and a tools/call is answered by the same handler in this Worker. The
 *  catalogue is public, as qpu.uuidna.com/mcp always served it: no key is needed to list or call it. */
export const qpuCatalogueTools = async (): Promise<Record<string, Tool>> => {
  const { result } = (await handle({ id: 1, jsonrpc: '2.0', method: 'tools/list' })) as { result: { tools: Listed[] } }
  return Object.fromEntries(
    result.tools.map((t) => [
      t.name,
      defineTool({ access: () => true, description: t.description, input: t.inputSchema as never }).handler(async ({ input }) => {
        const r = await callCatalogue(t.name, input)
        if ('error' in r) return { content: [{ type: 'text', text: JSON.stringify({ error: r.error }) }], isError: true }
        return {
          content: [{ type: 'text', text: JSON.stringify(r.structured ?? r.content ?? null) }],
          isError: r.isError,
          ...(r.structured ? { structuredContent: r.structured } : {}),
        }
      }),
    ]),
  )
}

/** A circuit program (the circuit tool's arguments) run by the classical exact simulator: its outcome, as the circuit
 *  tool at /api/mcp answers it, and a receipt, the content address of the program and the outcome together. */
export const runCircuit = async (program: Record<string, unknown>) => {
  const r = await callCatalogue('circuit', program)
  if ('error' in r || r.isError || !r.structured) throw new Error(`the circuit tool refused the program: ${'error' in r ? r.error : JSON.stringify(r.content ?? null)}`)
  return { outcome: r.structured, receipt: uuid(canonicalText({ arguments: program, outcome: r.structured, tool: 'circuit' })) as string }
}
