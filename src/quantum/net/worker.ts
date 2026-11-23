// The qpu Worker: an MCP request (at /, /mcp or /api/mcp) through serveMcp with the rooms bound, every other request from the site's static assets.
import { isMcp, serveMcp } from './mcp-http.ts'
import type { MailboxNamespace } from './messaging.ts'
export { Mailbox } from './mailbox.ts'

type Env = Record<string, string | undefined> & { ASSETS: { fetch: (request: Request) => Promise<Response> }; MAILBOX: MailboxNamespace }

export default {
  fetch: (request: Request, env: Env): Promise<Response> => (isMcp(request) ? serveMcp(request, env) : env.ASSETS.fetch(request)),
}
