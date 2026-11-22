// The qpu Worker: /api/mcp through serveMcp, every other path from the site's static assets.
import { serveMcp } from './mcp-http.ts'

type Env = Record<string, string | undefined> & { ASSETS: { fetch: (request: Request) => Promise<Response> } }

export default {
  fetch: (request: Request, env: Env): Promise<Response> => (new URL(request.url).pathname === '/api/mcp' ? serveMcp(request, env) : env.ASSETS.fetch(request)),
}
