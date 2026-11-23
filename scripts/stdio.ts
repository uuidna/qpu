// The QPU MCP over stdio: the Worker's server on the MCP SDK's stdio door, so a harness that starts a command reaches
// the same tools as one given the URL; and this machine by the machine allow-list, which the Worker never holds.
import { serveStdio } from '@modelcontextprotocol/server/stdio'
import { z } from 'zod'
import { mcpServer } from '../src/quantum/net/mcp-http.ts'
import { MACHINE_ACTIONS } from '../src/quantum/processing/machine.ts'
import { runMachine } from '../src/quantum/processing/machine-run.ts'
import { PROSE } from '../src/quantum/processing/prose-index.ts'

serveStdio(async () => {
  const server = await mcpServer(process.env)
  const inputSchema = z.looseObject({ action: z.enum(MACHINE_ACTIONS.map((a) => a.id) as [string, ...string[]]).describe(PROSE.scriptsStdio_action), files: z.array(z.string()).optional().describe(PROSE.scriptsStdio_files), message: z.string().optional().describe(PROSE.scriptsStdio_message), confirm: z.boolean().optional().describe(PROSE.scriptsStdio_confirm), branch: z.string().optional() })
  server.registerTool('machine', { description: PROSE.scriptsStdio_machine, inputSchema, annotations: { title: 'machine', readOnlyHint: false, openWorldHint: true } }, async (args) => {
    const answer = (await runMachine(args, process.cwd())).answer as { allowed?: boolean; record?: { ok?: boolean } }
    return { content: [{ type: 'text', text: JSON.stringify(answer) }], structuredContent: answer, isError: answer.allowed === false || answer.record?.ok === false }
  })
  return server
})
