import { defineTool } from '@payloadcms/plugin-mcp'
import { handle } from '@uuidna/qpu/mcp'

type Tool = ReturnType<ReturnType<typeof defineTool>['handler']>
type Listed = { description: string; inputSchema: Record<string, unknown>; name: string }
type Answer = { error?: { message: string }; result?: { content?: { text?: string; type: string }[]; isError?: boolean; structuredContent?: unknown } }

/** qpu's quantum handler catalogue (src/quantum/processing/mcp.ts) as plugin-mcp top-level tools: each catalogue tool
 *  keeps its name, description and input schema, and a tools/call is answered by the same handler in this Worker. */
export const qpuCatalogueTools = async (): Promise<Record<string, Tool>> => {
  const { result } = (await handle({ id: 1, jsonrpc: '2.0', method: 'tools/list' })) as { result: { tools: Listed[] } }
  return Object.fromEntries(
    result.tools.map((t) => [
      t.name,
      defineTool({ description: t.description, input: t.inputSchema as never }).handler(async ({ input }) => {
        const r = (await handle({ id: 1, jsonrpc: '2.0', method: 'tools/call', params: { arguments: input, name: t.name } })) as Answer
        if (r.error) return { content: [{ type: 'text', text: JSON.stringify({ error: r.error.message }) }], isError: true }
        const structured = r.result?.structuredContent as Record<string, unknown> | undefined
        return {
          content: [{ type: 'text', text: JSON.stringify(structured ?? r.result?.content ?? null) }],
          isError: r.result?.isError === true,
          ...(structured ? { structuredContent: structured } : {}),
        }
      }),
    ]),
  )
}
