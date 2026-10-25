// The trunk as a standard procedure, never a decision: when the flow is green, the current branch descends from main, and
// main is not checked out, main is fast-forwarded to HEAD here. Local only: no remote is touched, nothing is pushed, nothing
// is forced; a merge that is not a fast-forward is refused and recorded. The author's push stays the author's.
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
const ROOT = process.cwd()
const git = (...args: string[]) => { try { return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() } catch { return null } }
const branch = git('rev-parse', '--abbrev-ref', 'HEAD'); const head = git('rev-parse', 'HEAD'); const main = git('rev-parse', 'main')
if (!branch || !head || !main) { console.log('trunk: no git, no main: nothing to do'); process.exit(0) }
if (branch === 'main') { console.log('trunk: on main already'); process.exit(0) }
const receiptPath = join(ROOT, 'docs', 'public', 'receipt.json')
const receipt = existsSync(receiptPath) ? JSON.parse(readFileSync(receiptPath, 'utf8')) as { steps?: { name: string; status: string }[] } : null
const red = receipt?.steps?.filter((s) => s.status === 'red').map((s) => s.name) ?? []
if (red.length) { console.log(`trunk: the flow is red (${red.join(', ')}): main stays at ${main.slice(0, 8)}`); process.exit(0) }
if (head === main) { console.log(`trunk: main is HEAD already (${head.slice(0, 8)})`); process.exit(0) }
const ancestor = git('merge-base', '--is-ancestor', 'main', 'HEAD') !== null
if (!ancestor) { console.log(`trunk: ${branch} does not descend from main (${main.slice(0, 8)}): a merge that is not a fast-forward is the author's act; recorded, nothing done`); process.exit(0) }
const moved = git('update-ref', 'refs/heads/main', head, main)
console.log(moved === null ? `trunk: could not move main` : `trunk: main fast-forwarded ${main.slice(0, 8)} → ${head.slice(0, 8)} (${git('rev-list', '--count', `${main}..${head}`)} commit(s)); nothing pushed`)
