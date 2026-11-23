// The Lean container's Durable Object: it starts the prover image (alpine/Dockerfile, stage prover) with no internet,
// waits for /health and forwards each request. Only worker.ts imports it: cloudflare:workers exists there alone.
import { DurableObject } from 'cloudflare:workers'
import { PROSE, proseFill } from '../processing/prose-index.ts'

const PORT = 8080
/** How long the container keeps Mathlib loaded after its last request. */
const INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000

export class Prover extends DurableObject<Env> {
  private starting: Promise<void> | undefined

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env)
    const container = ctx.container
    if (container?.running) void ctx.blockConcurrencyWhile(() => container.setInactivityTimeout(INACTIVITY_TIMEOUT_MS))
  }

  async fetch(request: Request): Promise<Response> {
    // concurrent requests share one startup; a failed one is retried by the next
    this.starting ??= this.startAndWaitForPort().finally(() => { this.starting = undefined })
    await this.starting
    const url = new URL(request.url)
    url.protocol = 'http:'
    url.host = 'container'
    const forwarded = new Request(url, request)
    forwarded.headers.delete('host')
    return this.ctx.container!.getTcpPort(PORT).fetch(forwarded)
  }

  private async startAndWaitForPort(): Promise<void> {
    const container = this.ctx.container!
    if (!container.running) container.start({ enableInternet: false })
    await container.setInactivityTimeout(INACTIVITY_TIMEOUT_MS)
    // start() returns before the server listens, so poll its health endpoint
    const port = container.getTcpPort(PORT)
    let lastError: unknown
    for (let attempt = 0; attempt < 300; attempt++) {
      try {
        const response = await port.fetch('http://container/health', { signal: AbortSignal.timeout(1000) })
        await response.body?.cancel()
        if (response.ok) return
        lastError = new Error(`health ${response.status}`)
      } catch (error) {
        lastError = error
      }
      await scheduler.wait(200)
    }
    throw new Error(proseFill(PROSE.quantumNetProver_unanswered, PORT), { cause: lastError })
  }
}
