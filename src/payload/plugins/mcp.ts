// THE QPU TOOLS, REGISTERED IN PAYLOAD'S MCP PLUGIN. The plugin's `tools` map is where its tools are declared; each tool
// here is a door of the unit, with the door's own description and input schema, and its handler calls that door. The
// plugin serves them at its endpoint, so the MCP is Payload's, and the doors are the unit's.
import type { MCPPluginConfig } from '@payloadcms/plugin-mcp'
import { mcpFusedOf, mcpToolsListOf } from '../../quantum/processing/unit/index.js'
import { mcpCallOf } from '../../quantum/processing/unit/mcp.js'

type Tools = NonNullable<MCPPluginConfig['tools']>
type Tool = Tools[string]
type Reply = Awaited<ReturnType<Tool['handler']>>

// a door answers as an MCP content envelope already, or as a plain reading: both become the plugin's response
const responseOf = (reply: unknown): Reply => {
  const r = reply as Reply
  if (Array.isArray(r?.content)) return r as Reply
  return { content: [{ type: 'text', text: JSON.stringify(reply) }], structuredContent: reply } as Reply
}

export const qpuMcpTools = (): Tools => {
  const tools: Tools = {}
  const add = (name: string, description: string, input: unknown) => {
    tools[name] = {
      description,
      input: (input ?? { type: 'object', properties: {} }) as Tool['input'],
      handler: async ({ input: args }) => responseOf(await mcpCallOf(name, (args ?? {}) as Record<string, unknown>)),
    } as Tool
  }
  for (const t of mcpToolsListOf()) add(t.name, t.description, t.inputSchema)
  for (const t of mcpFusedOf()) add(t.name, t.description, t.inputSchema)
  return tools
}
