#!/usr/bin/env node
// post-push — ask the forge what it says about THIS commit, and refuse to call anything else an answer.
//
// `gh run list --limit 1` is a window over the newest runs, not the runs of a commit. Measured 2026-09-13: the run
// for a just-pushed commit did not exist yet, the newest row belonged to the previous push, it read success, and a
// deploy that had not happened was reported as verified. So this asks `actions/runs?head_sha=<sha>`, which is exact,
// treats an absent run as UNMEASURED rather than a pass, and waits instead of concluding.
//
//   node scripts/post-push.mjs [sha] [--wait]     default sha: HEAD
import { execSync } from 'node:child_process'
import { pushVerdictOf } from '../dist/quantum/processing/unit/publish.js'

const sh = (cmd) => execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()

/** owner/repo from the tree's own remote — a law that names one repository cannot serve another. */
export const repoSlugOf = (remote) => {
  const m = /(?:github\.com[/:])([^/]+\/[^/]+?)(?:\.git)?$/.exec(String(remote).trim())
  if (!m) throw new Error(`post-push: cannot read an owner/repo out of the remote ${JSON.stringify(remote)}`)
  return m[1]
}

const ROUNDS = 30, PAUSE = 20
const args = process.argv.slice(2)
const wait = args.includes('--wait')
const sha = args.find((a) => !a.startsWith('--')) ?? sh('git rev-parse HEAD')
const slug = repoSlugOf(sh('git remote get-url origin'))

const rows = () => {
  const raw = JSON.parse(sh(`gh api repos/${slug}/actions/runs?head_sha=${encodeURIComponent(sha)} --paginate`))
  const list = raw.workflow_runs
  if (!Array.isArray(list)) throw new Error('post-push: actions/runs did not return a list — refusing to read a malformed answer as "no runs"')
  return list.map((r) => ({
    workflowName: String(r.name ?? r.workflow_id ?? 'unnamed'),
    headSha: String(r.head_sha ?? ''),
    status: String(r.status ?? ''),
    conclusion: r.conclusion == null ? null : String(r.conclusion),
    event: String(r.event ?? ''),
  }))
}

console.log(`· post-push — ${slug} @ ${sha.slice(0, 9)}`)
let verdict = pushVerdictOf(sha, rows())
for (let i = 0; wait && !verdict.settled && i < ROUNDS; i++) {
  console.log(`· post-push — ${verdict.reason}`)
  sh(`sleep ${PAUSE}`)
  verdict = pushVerdictOf(sha, rows())
}
if (verdict.ok) { console.log(`✓ post-push — ${verdict.reason}`); process.exit(0) }
console.error(`✗ post-push — ${verdict.reason}`)
for (const f of verdict.failing) console.error(`    FAILED  ${f}`)
for (const p of verdict.pending) console.error(`    RUNNING ${p}`)
process.exit(1)
