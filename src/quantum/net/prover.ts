// Lean with Mathlib behind the Worker: the lean tool checks a Lean source against Mathlib and this tree's own Lean, and
// runs Lean's library search over every theorem (lean/tools/Gaps.lean). The prover runs in a Cloudflare Container with
// no internet (prover-object.ts, alpine/prover-server.ts), so the tool exists where that binding does: the deployed Worker.
import { PROSE, proseFill } from '../processing/prose-index.ts'
import { refusalOf, toolAnswer } from '../processing/contract.ts'
import { receiptOf } from '../uuid/programs/index.ts'

/** The bounds of one check, stated once: the source's length and the seconds Lean may take; and the container's, which its server
 *  (alpine/prover-server.ts: AT_ONCE, WAITING) and its Durable Object (prover-object.ts: INACTIVITY_TIMEOUT_MS) hold and the test compares. */
export const PROVER_LIMITS = { source: 65536, seconds: 300, atOnce: 2, waiting: 8, idleMinutes: 10 } as const
export type ProverNamespace = { getByName(name: string): { fetch(request: Request): Promise<Response> } }

export const PROVER_TOOLS = [
  { name: 'lean', description: `${PROSE.quantumNetProver_lean} ${proseFill(PROSE.quantumNetProver_limits, PROVER_LIMITS.source, PROVER_LIMITS.seconds, PROVER_LIMITS.atOnce, PROVER_LIMITS.waiting, PROVER_LIMITS.idleMinutes)}`, annotations: { title: 'lean', readOnlyHint: true, idempotentHint: true, openWorldHint: false }, _meta: { state: { writes: false, idempotent: true } },
    outputSchema: { type: 'object', properties: { ok: { type: 'boolean' }, verdict: { type: 'string' }, timedOut: { type: 'boolean' }, ms: { type: 'integer' }, messages: { type: 'array' }, toolchain: { type: 'string' }, receipt: { type: 'object' } } },
    inputSchema: { type: 'object', properties: { source: { type: 'string', minLength: 1, maxLength: PROVER_LIMITS.source, description: PROSE.quantumNetProver_source }, gaps: { type: 'boolean', description: PROSE.quantumNetProver_gaps } } } },
] as const

/** What the container's server answers a check with (alpine/prover-server.ts): Lean's verdict, or its own failure. */
type Checked = { ok?: unknown; timedOut?: unknown; ms?: unknown; messages?: unknown; toolchain?: unknown; error?: unknown; exit?: unknown; signal?: unknown; stderr?: unknown; retryAfterSeconds?: unknown }
/** No verdict, in the one shape every refusal has: { error, code }, with whether asking again can help and what the prover left behind. */
const noVerdict = (code: 'time_limit' | 'prover_failed' | 'prover_busy' | 'prover_unavailable', error: string, more: Record<string, unknown> = {}) => answer(refusalOf(code, error, { verdict: null, retryable: code !== 'time_limit', ...more }), true)
const hasError = (messages: unknown) => Array.isArray(messages) && messages.some((m) => (m as { severity?: unknown } | null)?.severity === 'error')

const answer = toolAnswer

/** One lean tools/call against the prover: the source checked before the container is reached, and Lean's verdict sealed as a quantum receipt.
 *  A receipt is issued for a verdict alone: accepted (ok true), or rejected (ok false with at least one error message Lean wrote). It is the
 *  address of { source, ok, messages, toolchain }, so the same source under the same toolchain has the same receipt. The time limit passing,
 *  the prover failing, being busy or being out of reach are not verdicts: each is answered by its code, with no ok and no receipt. */
export const callProver = async (prover: ProverNamespace, args: Record<string, unknown>) => {
  const lean = prover.getByName('lean')
  const unreachable = (e: unknown) => noVerdict('prover_unavailable', proseFill(PROSE.quantumNetProver_unavailable, String(e instanceof Error ? e.message : e)))
  if (args.gaps === true) {
    try {
      const r = await lean.fetch(new Request('http://prover/gaps', { method: 'POST' }))
      return answer(await r.json() as Record<string, unknown>, !r.ok)
    } catch (e) { return unreachable(e) }
  }
  if (typeof args.source !== 'string' || args.source.length === 0 || args.source.length > PROVER_LIMITS.source) { const why = proseFill(PROSE.quantumNetProver_sourceRefused, PROVER_LIMITS.source); return answer(refusalOf('invalid_params', why), true) }
  let status: number, text: string
  try {
    const r = await lean.fetch(new Request('http://prover/check', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ source: args.source, seconds: PROVER_LIMITS.seconds }) }))
    status = r.status; text = await r.text()
  } catch (e) { return unreachable(e) }
  let v: Checked
  try { v = JSON.parse(text) as Checked } catch { v = { error: 'prover_failed', stderr: text } }
  if (status === 503 && v.error === 'prover_busy') { const seconds = typeof v.retryAfterSeconds === 'number' ? v.retryAfterSeconds : 30; return noVerdict('prover_busy', proseFill(PROSE.quantumNetProver_busy, seconds), { retryAfterSeconds: seconds }) }
  // a verdict is what Lean decided and nothing else: accepted, or rejected with an error of its own
  const accepted = status === 200 && v.ok === true && v.timedOut !== true && !hasError(v.messages), rejected = status === 200 && v.ok === false && v.timedOut !== true && hasError(v.messages)
  if (status === 200 && v.ok === false && v.timedOut === true) return noVerdict('time_limit', proseFill(PROSE.quantumNetProver_timeLimit, PROVER_LIMITS.seconds), { timedOut: true, ms: v.ms, messages: v.messages, toolchain: v.toolchain })
  if (!accepted && !rejected) return noVerdict('prover_failed', proseFill(PROSE.quantumNetProver_failed, v.exit ?? status), { status, exit: v.exit ?? null, signal: v.signal ?? null, stderr: typeof v.stderr === 'string' ? v.stderr : text, toolchain: v.toolchain })
  return answer({ ok: accepted, verdict: accepted ? 'accepted' : 'rejected', timedOut: false, ms: v.ms, messages: v.messages, toolchain: v.toolchain, receipt: receiptOf('lean', { source: args.source, ok: v.ok, messages: v.messages, toolchain: v.toolchain }) }, !accepted)
}
