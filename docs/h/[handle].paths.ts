// A page per handle: the first eight hex of every UUID the tree knows; a commit's short hash is such a handle too.
import { existsSync, readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import paths from '../u/[uuid].paths.ts'
export default {
  paths() {
    const handles = new Set<string>(paths.paths().map((p) => p.params.uuid.slice(0, 8)))
    try { for (const h of execSync('git log --format=%h -n 50', { encoding: 'utf8' }).split('\n').filter(Boolean)) if (/^[0-9a-f]{8}$/.test(h)) handles.add(h) } catch { /* no git: no commit handles */ }
    if (existsSync('docs/public/imprints.ndjson')) for (const line of readFileSync('docs/public/imprints.ndjson', 'utf8').split('\n').filter(Boolean)) { try { handles.add((JSON.parse(line) as { commit: string }).commit.slice(0, 8)) } catch { /* lead */ } }
    return [...handles].map((handle) => ({ params: { handle } }))
  },
}
