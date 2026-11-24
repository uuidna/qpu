// The gate after a deploy, as requests and their judgment: one theorem Lean must accept, one it must reject, the crypto
// selftests and the audit in shares, each asked of the deployed MCP the way a client asks. The door plans the requests and
// judges the answers; the runner only fetches. A wrong answer is named with what the server said and the gate does not hold.
// A prover that is starting, busy or out of reach has given no verdict: that request alone is asked again, the reason said.
import { PROSE, proseFill } from './prose-index.ts'

export const DEPLOYED_ATTEMPTS = 5
export const DEPLOYED_WAIT_MS = 30000
const HOLDS = 'theorem t : 1 + 1 = 2 := rfl', FAILS = 'theorem t : 1 + 1 = 3 := rfl'
type Kind = 'lean-holds' | 'lean-fails' | 'selftest' | 'audit'
export type DeployedRequest = { id: string; kind: Kind; url: string; method: 'POST'; accept: string; timeoutMs: number; body: { jsonrpc: '2.0'; id: number; method: 'tools/call'; params: { name: string; arguments: Record<string, unknown> } } }
export type DeployedAnswer = DeployedRequest & { status: number; ms?: number; text: string }

/** The requests of the gate: Lean both ways, the two doors of the crypto selftest, and the audit in `shards` shares that cover it once. */
export const createDeployedRequests = (url: string, shards = 8): DeployedRequest[] => {
  const ask = (id: string, kind: Kind, name: string, args: Record<string, unknown>, timeoutMs: number, n: number): DeployedRequest => ({ id, kind, url, method: 'POST', accept: 'application/json, text/event-stream', timeoutMs, body: { jsonrpc: '2.0', id: n, method: 'tools/call', params: { name, arguments: args } } })
  return [
    ask('lean-holds', 'lean-holds', 'lean', { source: HOLDS }, 330000, 1),
    ask('lean-fails', 'lean-fails', 'lean', { source: FAILS }, 330000, 2),
    ask('selftest-seal', 'selftest', 'seal', { selftest: true }, 300000, 3),
    ask('selftest-fold', 'selftest', 'fold', { selftest: true }, 300000, 4),
    ...Array.from({ length: shards }, (_, i) => ask(`audit-${i}-of-${shards}`, 'audit', 'audit', { shard: { i, n: shards } }, 300000, 5 + i)),
  ]
}

const brief = (x: unknown) => (typeof x === 'string' ? x : JSON.stringify(x) ?? String(x)).replace(/\s+/g, ' ').slice(0, 400)
/** The structured answer of one tools/call, or the status and text the server gave in its place. */
const read = (a: DeployedAnswer): { s: Record<string, any> | null; said: string } => {
  if (a.status !== 200) return { s: null, said: `HTTP ${a.status} ${brief(a.text)}` }
  // the JSON-RPC answer, plain or as the last data line of an event stream; an answer the tool marks as an error is read too, since a rejection and a refusal are both such answers
  const line = a.text.trimStart().startsWith('{') ? a.text : a.text.split('\n').filter((l) => l.startsWith('data: ')).at(-1)?.slice(6)
  let s: Record<string, any> | null = null
  try { const sc = (JSON.parse(line ?? '') as { result?: { structuredContent?: unknown } }).result?.structuredContent; s = sc && typeof sc === 'object' ? sc as Record<string, any> : null } catch { s = null }
  return { s, said: brief(s ?? a.text) }
}
const hasError = (s: Record<string, any>) => Array.isArray(s.messages) && s.messages.some((m: { severity?: string }) => m?.severity === 'error')
/** No verdict from the prover, where asking again can help: it said so by its code, or the request never reached it. */
const noVerdict = (a: DeployedAnswer, s: Record<string, any> | null): string | null => (s && ['prover_unavailable', 'prover_busy'].includes(s.code) ? String(s.code) : a.status === 0 || a.status === 502 || a.status === 504 ? `HTTP ${a.status}` : null)

export type Deployed = { phase: 'deployed' | 'deployed-retry'; url: string; attempt: number; required: number; right: number; wrong: string[]; checks: { id: string; passed: boolean; evidence: string }[]; retry: { id: string; why: string; says: string }[]; says: string
  /** set when nothing is left to ask: whether every required answer is right */ holds?: boolean; passed?: boolean
  /** set while a prover has given no verdict: the requests to ask again, how long to wait first, and the answers already judged */ requestList?: DeployedRequest[]; waitMs?: number; kept?: DeployedAnswer[] }
/** Each request judged by the answer handed back for it; the requests to ask again are returned as the next list. */
export const judgeDeployed = (url: string, shards: number, answers: readonly DeployedAnswer[], attempt = 1, waitMs = DEPLOYED_WAIT_MS): Deployed => {
  const requests = createDeployedRequests(url, shards), given = new Map(answers.map((a) => [a.id, a]))
  const checks: { id: string; passed: boolean; evidence: string }[] = [], retry: { id: string; why: string; says: string }[] = []
  for (const q of requests) {
    const a = given.get(q.id)
    if (!a) { checks.push({ id: q.id, passed: false, evidence: PROSE.quantumProcessingDeployed_unanswered }); continue }
    const { s, said } = read(a), ms = Math.round(a.ms ?? 0)
    if (q.kind === 'lean-holds' || q.kind === 'lean-fails') {
      const why = noVerdict(a, s)
      if (why !== null && attempt < DEPLOYED_ATTEMPTS) { retry.push({ id: q.id, why, says: proseFill(PROSE.quantumProcessingDeployed_retry, q.id, attempt + 1, DEPLOYED_ATTEMPTS, why, said) }); continue }
      if (q.kind === 'lean-holds') { const passed = s?.ok === true && !hasError(s); checks.push({ id: q.id, passed, evidence: passed ? proseFill(PROSE.quantumProcessingDeployed_holdsAccepted, s!.ms ?? ms) : proseFill(PROSE.quantumProcessingDeployed_holdsWrong, said) }) }
      else { const passed = s?.ok === false && s.timedOut !== true && hasError(s); checks.push({ id: q.id, passed, evidence: passed ? proseFill(PROSE.quantumProcessingDeployed_failsRejected, brief(s!.messages[0].text)) : proseFill(PROSE.quantumProcessingDeployed_failsWrong, said) }) }
    } else if (q.kind === 'selftest') {
      const passed = s?.selftest === true && s.passed === true && Array.isArray(s.checks) && s.checks.length > 0
      checks.push({ id: q.id, passed, evidence: passed ? proseFill(PROSE.quantumProcessingDeployed_selftestPassed, q.body.params.name, s!.checks.length, ms) : proseFill(PROSE.quantumProcessingDeployed_selftestWrong, q.body.params.name, s?.checks ? brief(s.checks.filter((c: { passed?: boolean }) => c.passed !== true)) : said) })
    } else {
      const share = q.body.params.arguments.shard as { i: number; n: number }, passed = typeof s?.total === 'number' && s.total > 0 && s.failed === 0 && s.passed === s.total && s.shard?.i === share.i && s.shard?.n === share.n
      checks.push({ id: q.id, passed, evidence: passed ? proseFill(PROSE.quantumProcessingDeployed_shardPassed, share.i, share.n, s!.total, ms) : proseFill(PROSE.quantumProcessingDeployed_shardWrong, share.i, share.n, s?.checks ? brief({ total: s.total, failed: s.failed, checks: s.checks.filter((c: { passed?: boolean }) => c.passed !== true).slice(0, 5) }) : said) })
    }
  }
  const wrong = checks.filter((c) => !c.passed), again = requests.filter((q) => retry.some((r) => r.id === q.id))
  return {
    phase: again.length ? 'deployed-retry' as const : 'deployed' as const, url, attempt, required: requests.length, right: checks.length - wrong.length, wrong: wrong.map((c) => c.id), checks, retry,
    // the gate holds only when every required answer is right and nothing is left to ask; a retry is not yet a failure
    ...(again.length ? { requestList: again, waitMs, kept: answers.filter((a) => !again.some((q) => q.id === a.id)) } : { holds: wrong.length === 0, passed: wrong.length === 0 }),
    says: proseFill(PROSE.quantumProcessingDeployed_says, url, checks.length - wrong.length, requests.length, wrong.length, again.length),
  }
}
