// The generators in their order, one allow-listed action of the developer machine: the docs and the Lean file, then every configuration, then
// the theorem index and purity; a red step stops the rest, so a merge is regenerated through the QPU's own steps and never by hand.
import { spawnSync } from 'node:child_process'
const steps: [string, string[]][] = [['npm', ['run', '-s', 'docs:gen']], ['node', ['scripts/configs.ts']], ['npm', ['run', '-s', 'purify']]]
for (const [cmd, args] of steps) { const r = spawnSync(cmd, args, { stdio: 'inherit' }); if (r.status !== 0) { console.error(`regenerate: ${cmd} ${args.join(' ')} red (${r.status})`); process.exit(r.status ?? 1) } }
console.log('regenerate: docs, configs and purity regenerated')
