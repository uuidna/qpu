// The qpu Worker: /api/mcp answers through the package's own Streamable-HTTP transport (serveMcp), every other path
// is the Lean-written VitePress site built into the Worker's static assets.
import { serveMcp } from './mcp-http.ts'

type Env = Record<string, string | undefined> & { ASSETS: { fetch: (request: Request) => Promise<Response> } }

export default {
  fetch: (request: Request, env: Env): Promise<Response> => (new URL(request.url).pathname === '/api/mcp' ? serveMcp(request, env) : env.ASSETS.fetch(request)),
}
