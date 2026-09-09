// fasten-run — Node test door fastened to BindingPoint width. Never --test-concurrency=0.
// Isolation none is the CPU fasten; the CLI flag is Node 24. Node 22 still runs the door.
import { spawnSync } from 'node:child_process'
import { qpuFastenOf } from './hologram.js'

const f = qpuFastenOf()
if (!f.holds) process.exit(1)
const files = process.argv.slice(2).filter((a) => a.length > 0)
if (files.length === 0) process.exit(1)
const isolation = `--test-isolation=${f.isolation}`
const probe = spawnSync(process.execPath, [isolation, '--eval', '0'], { encoding: 'utf8' })
const flags = ['--test', `--test-concurrency=${f.concurrency}`]
if (!(probe.stderr ?? '').includes('bad option')) flags.push(isolation)
const r = spawnSync(process.execPath, [...flags, ...files], { stdio: 'inherit' })
process.exit(r.status ?? 1)
