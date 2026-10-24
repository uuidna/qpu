// THE CATCH-ALL. Every request the home page and Payload's own routes do not answer comes here, and the unit's router decides
// the answer for each path. One handler, at the end of the routing: no path is named here.
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { worker } from '@/quantum/processing/unit/router'

export const dynamic = 'force-dynamic'

const handle = async (request: Request): Promise<Response> => {
  const { env } = await getCloudflareContext({ async: true })
  return worker.fetch(request, env as unknown as Parameters<typeof worker.fetch>[1])
}

export const GET = handle
export const HEAD = handle
export const POST = handle
export const PUT = handle
export const PATCH = handle
export const DELETE = handle
export const OPTIONS = handle
