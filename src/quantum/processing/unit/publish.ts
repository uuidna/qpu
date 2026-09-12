// publish — THE VERDICT A PUSH DESERVES, as a pure function. The network lives in scripts/post-push.mjs; the law
// lives here so the receipted suite can test it against crafted rows instead of a live forge.
//
// WHY THIS EXISTS (measured 2026-09-13). Publishing this unit was verified by hand with `gh run list --limit 1`,
// which is a WINDOW over the newest runs, not the runs of a commit. The run for the pushed commit did not exist
// yet, so the newest row belonged to the PREVIOUS push, it read `success`, and a deploy that had not happened was
// reported as verified — the live doors then answered with the old bytes. Asking by head sha is exact, and an
// absent run is UNMEASURED, never a pass. The sibling tree met this conflation four times before naming it; this
// is the same law carried across rather than invented a second time.

/** One run as the forge reports it. `event` matters: a schedule answers a different question than a push. */
export interface PushRun { workflowName: string; headSha: string; status: string; conclusion: string | null; event: string }
export interface PushVerdict {
  sha: string
  ok: boolean
  settled: boolean
  measured: boolean
  passed: string[]
  failing: string[]
  pending: string[]
  didNotJudge: string[]
  notThisPush: string[]
  reason: string
}

const PASSED = new Set(['success', 'neutral'])
const DID_NOT_JUDGE = new Set(['skipped', 'cancelled'])

/** pushVerdictOf(sha, runs) → what the forge says about THIS commit. Pure; the caller fetches the rows. */
export const pushVerdictOf = (sha: string, runs: readonly PushRun[]): PushVerdict => {
  if (sha.length < 7) throw new Error(`post-push: "${sha}" is too short to name a commit — seven hex characters is git's own floor`)
  const onSha = runs.filter((r) => r.headSha === sha || r.headSha.startsWith(sha))
  // ONLY A PUSH JUDGES A PUSH. A schedule or a manual dispatch can sit on the same commit and answer something else.
  const mine = onSha.filter((r) => r.event === 'push')
  const notThisPush = onSha.filter((r) => r.event !== 'push').map((r) => `${r.workflowName} (${r.event}: ${r.conclusion ?? r.status})`).sort()
  const pending = mine.filter((r) => r.status !== 'completed').map((r) => r.workflowName).sort()
  const done = mine.filter((r) => r.status === 'completed')
  const failing = done.filter((r) => !PASSED.has(r.conclusion ?? '') && !DID_NOT_JUDGE.has(r.conclusion ?? ''))
    .map((r) => `${r.workflowName} (${r.conclusion ?? 'no conclusion'})`).sort()
  const didNotJudge = done.filter((r) => DID_NOT_JUDGE.has(r.conclusion ?? '')).map((r) => `${r.workflowName} (${r.conclusion})`).sort()
  const passed = done.filter((r) => PASSED.has(r.conclusion ?? '')).map((r) => r.workflowName).sort()
  // A VERDICT NEEDS A JUDGE: absence of failure over a set where nothing judged is not a pass.
  const measured = passed.length > 0 || failing.length > 0
  const settled = mine.length > 0 && pending.length === 0
  const ok = settled && passed.length > 0 && failing.length === 0
  const short = sha.slice(0, 9)
  const aside = (didNotJudge.length ? ` — and did NOT judge: ${didNotJudge.join(', ')}` : '')
    + (notThisPush.length ? ` — and NOT this push: ${notThisPush.join(', ')}` : '')
  const reason = pending.length
    ? `still running for ${short}: ${pending.join(', ')}${aside}`
    : failing.length
      ? `FAILED for ${short}: ${failing.join(', ')}${aside}`
      : !onSha.length
        ? `UNMEASURED: the forge reports no run at all for ${short} — this is NOT a pass. It may not be queued yet; wait, never conclude.`
        : !mine.length
          ? `UNMEASURED: ${onSha.length} run(s) sit on ${short} and none was a push — ${notThisPush.join(', ')}. Another event answers another question.`
          : !passed.length
            ? `UNMEASURED: every run on ${short} declined to judge${aside}`
            : `green for ${short}: ${passed.join(', ')}${aside}`
  return { sha, ok, settled, measured, passed, failing, pending, didNotJudge, notThisPush, reason }
}

/** value + predicate: a verdict may never be ok without a run that actually passed, and never ok while one fails. */
export const pushVerdictHolds = (v: PushVerdict): boolean =>
  (!v.ok || (v.settled && v.passed.length > 0 && v.failing.length === 0)) &&
  (!v.ok || v.measured) && v.reason.length > 0

/** THE FORGE CANNOT ANSWER, versus THE FORGE ANSWERED "NOTHING". Asking for the runs of a commit the forge has not
 *  indexed returns 422 and the tool exits non-zero, so an arm that does not catch it DIES where the honest answer is
 *  UNMEASURED — and the seconds after a push are exactly when that happens. Only a refusal that names the commit may
 *  become an empty row set; a missing credential or an absent tool must stay loud, because reading those as "no runs"
 *  is the conflation this whole law refuses. A bare "Not Found" is NOT the pattern: `command not found` contains it. */
export const isUnknownCommit = (message: string): boolean =>
  /No commit found for SHA|\(HTTP (?:404|422)\)/i.test(String(message))
