// The QPU MCP over stdio: the Worker's server on the MCP SDK's stdio door, so a harness that starts a command reaches
// the same tools as one given the URL; and this machine by the machine allow-list, which the Worker never holds.
import { serveStdio } from '@modelcontextprotocol/server/stdio'
import { z } from 'zod'
import { mcpServer } from '../src/quantum/uuid/programs/7/6/a/e/5/0/3/9/index.ts'
import { MACHINE_ACTIONS } from '../src/quantum/uuid/programs/3/3/0/8/2/1/e/a/index.ts'
import { runMachine } from '../src/quantum/uuid/programs/0/d/b/3/5/7/8/9/index.ts'
import { PROSE } from '../src/quantum/uuid/programs/5/9/e/4/9/1/a/4/index.ts'

serveStdio(async () => {
  const server = await mcpServer(process.env)
  const inputSchema = z.looseObject({ action: z.enum(MACHINE_ACTIONS.map((a) => a.id) as [string, ...string[]]).describe(PROSE.scriptsStdio_action), files: z.array(z.string()).optional().describe(PROSE.scriptsStdio_files), message: z.string().optional().describe(PROSE.scriptsStdio_message), confirm: z.boolean().optional().describe(PROSE.scriptsStdio_confirm), branch: z.string().optional() })
  server.registerTool('machine', { description: PROSE.scriptsStdio_machine, inputSchema, annotations: { title: 'machine', readOnlyHint: false, openWorldHint: true } }, async (args) => {
    const answer = (await runMachine(args, process.cwd())).answer as { allowed?: boolean; record?: { ok?: boolean } }
    return { content: [{ type: 'text', text: JSON.stringify(answer) }], structuredContent: answer, isError: answer.allowed === false || answer.record?.ok === false }
  })
  return server
})
