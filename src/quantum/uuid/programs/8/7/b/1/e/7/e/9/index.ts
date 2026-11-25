// The qpu Worker: an MCP request (at /, /mcp or /api/mcp) through serveMcp with the rooms and the Lean prover bound, every other request from the site's static assets.
import { isMcp, serveMcp } from '../../../../../../../../7/6/a/e/5/0/3/9/index.ts'
import type { MailboxNamespace } from '../../../../../../../../1/6/e/c/4/7/3/b/index.ts'
import type { ProverNamespace } from '../../../../../../../../6/a/b/e/3/a/d/f/index.ts'
export { Mailbox } from '../../../../../../../../6/1/8/6/1/c/e/2/index.ts'
export { Prover } from '../../../../../../../../3/6/6/e/b/a/3/b/index.ts'

type Env = Record<string, string | undefined> & { ASSETS: { fetch: (request: Request) => Promise<Response> }; MAILBOX: MailboxNamespace; PROVER: ProverNamespace }

export default {
  fetch: (request: Request, env: Env): Promise<Response> => (isMcp(request) ? serveMcp(request, env) : env.ASSETS.fetch(request)),
}
