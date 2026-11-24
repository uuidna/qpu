// Lean with Mathlib behind the Worker: the lean tool checks a Lean source against Mathlib and this tree's own Lean, and
// runs Lean's library search over every theorem (lean/tools/Gaps.lean). The prover runs in a Cloudflare Container with
// no internet (prover-object.ts, alpine/prover-server.ts), so the tool exists where that binding does: the deployed Worker.
import { PROSE, proseFill } from '../processing/prose-index.ts'
import { receiptOf } from '../uuid/programs/index.ts'

/** The bounds of one check, stated once: the source's length and the seconds Lean may take. */
export const PROVER_LIMITS = { source: 65536, seconds: 300 } as const
export type ProverNamespace = { getByName(name: string): { fetch(request: Request): Promise<Response> } }

export const PROVER_TOOLS = [
  { name: 'lean', description: PROSE.quantumNetProver_lean, annotations: { title: 'lean', readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    inputSchema: { type: 'object', properties: { source: { type: 'string', minLength: 1, maxLength: PROVER_LIMITS.source, description: PROSE.quantumNetProver_source }, gaps: { type: 'boolean', description: PROSE.quantumNetProver_gaps } } } },
] as const

const answer = (structured: Record<string, unknown>, isError = false) => ({ content: [{ type: 'text' as const, text: JSON.stringify(structured) }], structuredContent: structured, isError })

/** One lean tools/call against the prover: the source checked before the container is reached, the verdict sealed as a quantum receipt. */
export const callProver = async (prover: ProverNamespace, args: Record<string, unknown>) => {
  const lean = prover.getByName('lean')
  if (args.gaps === true) {
    const r = await lean.fetch(new Request('http://prover/gaps', { method: 'POST' }))
    return answer(await r.json() as Record<string, unknown>, !r.ok)
  }
  if (typeof args.source !== 'string' || args.source.length === 0 || args.source.length > PROVER_LIMITS.source) { const why = proseFill(PROSE.quantumNetProver_sourceRefused, PROVER_LIMITS.source); return answer({ error: why, code: 'invalid_params', refused: why }, true) }
  const r = await lean.fetch(new Request('http://prover/check', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ source: args.source, seconds: PROVER_LIMITS.seconds }) }))
  const verdict = await r.json() as { ok?: boolean; messages?: unknown; toolchain?: string }
  return answer({ ...verdict, receipt: receiptOf('lean', { source: args.source, ok: verdict.ok, messages: verdict.messages, toolchain: verdict.toolchain }) }, !r.ok || verdict.ok !== true)
}
