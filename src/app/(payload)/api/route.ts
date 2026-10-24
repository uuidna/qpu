// The Payload API root is the MCP: POST /api is the JSON-RPC, and GET /api answers the same discovery. Payload's own
// collection routes live under /api/<slug>, and the MCP is the root of that same API.
import { publicMcpOf } from '@/payload/plugins/public'

export const dynamic = 'force-dynamic'

export const POST = (request: Request) => publicMcpOf(request)
export const GET = (request: Request) => publicMcpOf(request)
