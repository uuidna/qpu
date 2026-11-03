// The names wave of every next, spending no one's tokens: the sources read, audit { declarations } asked through the Payload app (an entry of
// kind call, whose result the app computes), the readers and builders it maps onto the standard verbs renamed by the type checker's language
// service (machine rename --map, which records the wave in Payload so the commit pairs it), kept only while the type check and a fresh audit
// stay as green as before, else renamed back: the same door, the map reversed.
import './teleport.ts'
import { execFileSync, spawnSync } from 'node:child_process'
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'
import { toolCallerOf } from '../src/quantum/processing/mcp.ts'
import { mcpClient } from './mcp.ts'

const ROOT = process.cwd(), machine = join(dirname(fileURLToPath(import.meta.url)), 'machine.ts'), git = (a: string[]) => execFileSync('git', a, { encoding: 'utf8', maxBuffer: 1 << 28 })
// the package's public modules keep their names: renaming them is a breaking change for every consumer
const exported = new Set(Object.values((JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')) as { exports?: Record<string, string> }).exports ?? {}).map((p) => p.replace(/^\.\//, '')))
const files = Object.fromEntries(git(['ls-files', 'src', 'scripts']).trim().split('\n').filter((f) => /\.ts$/.test(f) && !/\.test\.ts$|-index\.ts$/.test(f) && !exported.has(f)).map((f) => [f, readFileSync(join(ROOT, f), 'utf8')]))
type Declarations = { renames: [string, string, string][]; kept: string[]; custom: Record<string, string[]>; says: string }
const asked = { declarations: { files } }
const d: Declarations = process.env.QPU_APP_KEY ? await (async () => { const m = mcpClient(), made = await m.call('createEntries', { kind: 'call', from: 'names', body: { tool: 'audit', arguments: asked } }); return (m.docsOf(made.text ?? '')[0] as { result?: { structuredContent?: Declarations } } | undefined)?.result?.structuredContent ?? (toolCallerOf('audit')(asked) as Declarations) })() : (toolCallerOf('audit')(asked) as Declarations)
if (!d.renames.length || !process.env.QPU_APP_KEY) { console.log(`names: ${d.says}; ${process.env.QPU_APP_KEY ? 'nothing to rename' : 'no wave without QPU_APP_KEY: an unrecorded rename would count as growth'}`); process.exit(0) }
const failed = () => Number(spawnSync('node', ['--input-type=module', '-e', "const { toolCallerOf } = await import('./src/quantum/processing/mcp.ts'); console.log(toolCallerOf('audit')().failed)"], { encoding: 'utf8', maxBuffer: 1 << 26 }).stdout.trim().split('\n').pop() ?? NaN)
const typed = () => spawnSync('npx', ['tsc', '--noEmit', '-p', 'tsconfig.json'], { encoding: 'utf8' }).status === 0
const base = failed(), dir = mkdtempSync(join(tmpdir(), 'qpu-names-')), map = join(dir, 'map.json'), back = join(dir, 'back.json')
writeFileSync(map, JSON.stringify(d.renames)); writeFileSync(back, JSON.stringify(d.renames.map(([f, a, b]) => [f, b, a])))
spawnSync('node', [machine, 'rename', '--map', map], { stdio: 'inherit' })
const kept = typed() && failed() <= base
// renamed back unrecorded: the forward records stay, unpaired, and pair nothing
if (!kept) spawnSync('node', [machine, 'rename', '--map', back], { stdio: 'ignore', env: { ...process.env, QPU_APP_KEY: '' } })
console.log(`names: ${d.says}; ${kept ? `${d.renames.length} renamed, recorded in Payload` : 'the wave turned a check red and was renamed back'}`)
