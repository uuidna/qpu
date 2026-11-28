// The qpu Worker: MCP at /, /mcp or /api/mcp through serveMcp, harmonized Payload/VitePress/Google/Pipeline SDK at /api/* through serveSdk, autonomous scheduled edge self-audit, and VitePress static assets.
import { isMcp, serveMcp } from '../../../../../../../../7/6/a/e/5/0/3/9/index.ts'
import { isSdkRequest, runAutonomousPipeline, serveSdk } from '../../../../../../../../sdk/index.ts'
import type { CloudflareWorkerEnv } from '../../../../../../../../sdk/schema/index.ts'
import type { MailboxNamespace } from '../../../../../../../../1/6/e/c/4/7/3/b/index.ts'
import type { ProverNamespace } from '../../../../../../../../6/a/b/e/3/a/d/f/index.ts'
export { Mailbox } from '../../../../../../../../6/1/8/6/1/c/e/2/index.ts'
export { Prover } from '../../../../../../../../3/6/6/e/b/a/3/b/index.ts'

type Env = CloudflareWorkerEnv<MailboxNamespace, ProverNamespace>

export default {
  fetch: (request: Request, env: Env): Promise<Response> =>
    (isMcp(request) ? serveMcp(request, env) : isSdkRequest(request) ? serveSdk(request) : env.ASSETS.fetch(request)),
  scheduled: async (): Promise<void> => {
    const receipt = runAutonomousPipeline('https://qpu.uuidna.com')
    if (!receipt.holds) throw new Error(`pipeline ${receipt.passed}/${receipt.total}`)
  },
}
