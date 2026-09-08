// fasten-run — Node test door fastened to BindingPoint width. Never --test-concurrency=0.
import { spawnSync } from 'node:child_process'
import { qpuFastenOf } from './hologram.js'

const f = qpuFastenOf()
if (!f.holds) process.exit(1)
const files = process.argv.slice(2).filter((a) => a.length > 0)
if (files.length === 0) process.exit(1)
const r = spawnSync(process.execPath, [
  '--test',
  `--test-concurrency=${f.concurrency}`,
  `--test-isolation=${f.isolation}`,
  ...files,
], { stdio: 'inherit' })
process.exit(r.status ?? 1)
