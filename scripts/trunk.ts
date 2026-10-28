// The trunk as a standard procedure, never a decision: when the flow is green, the current branch descends from main, and
// main is not checked out, main is fast-forwarded to HEAD here. Local only: no remote is touched, nothing is pushed, nothing
// is forced; a merge that is not a fast-forward is refused and recorded. The author's push stays the author's.
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'
import { getJson } from './mcp.ts'
const ROOT = process.cwd()
function done(says: string): never { console.log(`trunk: ${says}`); process.exit(0) }
const git = (...args: string[]) => { try { return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() } catch { return null } }
const branch = git('rev-parse', '--abbrev-ref', 'HEAD'); const head = git('rev-parse', 'HEAD'); const main = git('rev-parse', 'main')
if (!branch || !head || !main) done('no git, no main: nothing to do')
if (branch === 'main') done('on main already')
if (git('worktree', 'list', '--porcelain')?.split('\n').includes('branch refs/heads/main')) done('main is checked out in a worktree: its ref stays')
const receipt = getJson(join(ROOT, 'docs', 'public', 'receipt.json')) as { steps?: { name: string; status: string }[] } | null
const red = Object.values(Object.fromEntries((receipt?.steps ?? []).map((s) => [s.name, s]))).filter((s) => s.status === 'red').map((s) => s.name)
if (red.length) done(`the flow is red (${red.join(', ')}): main stays at ${main.slice(0, 8)}`)
if (head === main) done(`main is HEAD already (${head.slice(0, 8)})`)
if (git('merge-base', '--is-ancestor', 'main', 'HEAD') === null) done(`${branch} does not descend from main (${main.slice(0, 8)}): a merge that is not a fast-forward is the author's act; recorded, nothing done`)
const moved = git('update-ref', 'refs/heads/main', head, main)
console.log(moved === null ? `trunk: could not move main` : `trunk: main fast-forwarded ${main.slice(0, 8)} → ${head.slice(0, 8)} (${git('rev-list', '--count', `${main}..${head}`)} commit(s)); nothing pushed`)
