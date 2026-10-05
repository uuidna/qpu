import { execFile, execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim()
const TSC = path.join(ROOT, 'node_modules/.bin/tsc')

const PROJECTS: [string, (f: string) => boolean][] = [
  ['tsconfig.json', (f) => f.startsWith('src/') && !f.startsWith('src/payload/')],
  ['tsconfig.payload.json', (f) => /^(app|lib|src\/payload)\//.test(f) || f === 'payload.config.ts'],
]

const run = (cmd: string, args: string[]): Promise<{ ok: boolean; out: string }> =>
  new Promise((resolve) => execFile(cmd, args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 << 20 }, (e, stdout, stderr) => resolve({ ok: !e, out: `${stdout}${stderr}` })))

const timed = async <T>(start: () => Promise<T>): Promise<{ value: T; seconds: number }> => {
  const t = performance.now()
  const value = await start()
  return { value, seconds: Math.round((performance.now() - t) / 100) / 10 }
}

const pool = async <T, R>(items: T[], n: number, fn: (x: T) => Promise<R>): Promise<R[]> => {
  const out: R[] = []
  let i = 0
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) {
      const k = i++
      out[k] = await fn(items[k]!)
    }
  }))
  return out
}

const listed = (...globs: string[]): string[] => execFileSync('git', ['ls-files', '-z', ...globs], { cwd: ROOT, encoding: 'utf8' }).split('\0').filter(Boolean)
const tscErrors = (project: string) => run(TSC, ['-p', project, '--noEmit', '--incremental', 'false']).then((r) => r.out.split('\n').filter((l) => /error TS\d+/.test(l)))
const fileOfTscError = (line: string): string => line.slice(0, line.indexOf('('))

const syntaxError = async (file: string): Promise<string | null> => {
  const r = await run(process.execPath, ['--check', file])
  return r.ok ? null : (r.out.split('\n').find((l) => /Error/.test(l)) ?? 'syntax error').trim()
}

const TEXT = /\.(ts|tsx|js|mjs|cjs|json|jsonc|md|ya?ml|toml|lean|sh|css|html)$/
const CONFLICT = /^(<{7}|>{7})( |$)|^={7}$/m

const stagedFindings = async (file: string, tmp: string): Promise<string[]> => {
  if (!TEXT.test(file)) return []
  const { out: text } = await run('git', ['show', `:${file}`])
  const why: string[] = []
  if (CONFLICT.test(text)) why.push('conflict marker')
  if (file.endsWith('.json')) {
    try {
      JSON.parse(text)
    } catch (e) {
      why.push(`invalid JSON: ${(e as Error).message}`)
    }
  }
  if (/\.(js|mjs|cjs)$/.test(file)) {
    const copy = path.join(tmp, file)
    fs.mkdirSync(path.dirname(copy), { recursive: true })
    fs.writeFileSync(copy, text)
    const err = await syntaxError(copy)
    if (err) why.push(err)
  }
  return why
}

const distStale = (): boolean => {
  const built = path.join(ROOT, 'dist/quantum/processing/unit/index.js')
  if (!fs.existsSync(built)) return true
  const at = fs.statSync(built).mtimeMs
  return listed('src/*.ts').some((f) => !f.startsWith('src/payload/') && fs.statSync(path.join(ROOT, f)).mtimeMs > at)
}

type Formula = { id: string; formula: string; value: number; holds: boolean; receipt: string; hex?: string; hexExact: boolean }
type Bridges = Record<string, (...a: number[]) => Formula>
const bridgesOf = (): Promise<Bridges | null> =>
  import(pathToFileURL(path.join(ROOT, 'dist/mcp/cross-domain-formulas.js')).href).then((m) => m.CrossDomainFormulas as Bridges, () => null)

const show = (f: Formula) => console.log(`  ${f.holds ? '✓' : '·'} ${f.id.padEnd(20)} ${f.formula} = ${+f.value.toFixed(4)}  receipt ${f.receipt}${f.hexExact ? `  hex ${f.hex}` : ''}`)
const findingsOut = (findings: string[], limit = 20) => {
  for (const f of findings.slice(0, limit)) console.log(`  ✗ ${f}`)
  if (findings.length > limit) console.log(`  … ${findings.length - limit} more`)
}

/** Every package.json dependency must be ported into the family/domain port graph (QPU_DEPS); an unported one is a
 *  finding, so a dependency added without a port is caught at commit. Skips silently when dist is not built (the build/
 *  pre-push covers it then). */
const dependencyFindings = async (): Promise<string[]> => {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'))
    const deps = [...new Set([...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.devDependencies ?? {})])]
    const porting = (await import(pathToFileURL(path.join(ROOT, 'dist/quantum/processing/unit/porting.js')).href).catch(() => null)) as { QPU_DEPS?: Record<string, { domain?: string; relates?: unknown }> } | null
    if (!porting?.QPU_DEPS) return [] // dist not built — cannot check here; the build and pre-push cover it
    const out: string[] = []
    for (const d of deps) {
      const port = porting.QPU_DEPS[d]
      if (!port) out.push(`package.json: dependency '${d}' is unported — port it into QPU_DEPS in src/quantum/processing/unit/porting.ts`)
      // full compatibility: a port is complete only with a domain and a relates array — a stub is an unsuccessful port
      else if (!port.domain || !Array.isArray(port.relates)) out.push(`package.json: dependency '${d}' is ported incompletely — a full-compatibility port needs { domain, relates }`)
    }
    return out
  } catch { return [] }
}

/** Report-only: measures the staged files, evaluates cross formulas on the measurement, never blocks or edits. */
export const preCommit = async (): Promise<void> => {
  const staged = execFileSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z'], { cwd: ROOT, encoding: 'utf8' }).split('\0').filter(Boolean)
  if (!staged.length) return
  const bridges = bridgesOf()
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'qpu-hook-'))
  // every dependency must be ported in full compatibility — checked on every commit, not only when package.json is staged
  const depFindings = await dependencyFindings()
  const { value: findings, seconds } = await timed(async () => {
    const perFile = await Promise.all(staged.map(async (f) => (await stagedFindings(f, tmp)).map((why) => `${f}: ${why}`)))
    const ts = staged.filter((f) => /\.tsx?$/.test(f))
    const typed = await Promise.all(PROJECTS.filter(([, owns]) => ts.some(owns)).map(([p]) => tscErrors(p)))
    return [...perFile.flat(), ...typed.flat().filter((l) => staged.includes(fileOfTscError(l))), ...depFindings]
  })
  fs.rmSync(tmp, { recursive: true, force: true })
  const bad = new Set(findings.map((f) => (f.includes('): error') ? fileOfTscError(f) : f.slice(0, f.indexOf(': ')))))
  const passed = staged.length - bad.size
  console.log(`pre-commit: ${staged.length} staged, ${passed} clean, ${findings.length} findings (${seconds}s)`)
  findingsOut(findings)
  const X = await bridges
  if (X) {
    show(X.testCoverageToQuality!(passed, staged.length))
    show(X.observabilityToUI!(findings.length, staged.length))
    show(X.deploymentToObs!(seconds, 0))
  } else console.log('  cross formulas need dist/ — npm run build')
  // a port that did not succeed BLOCKS the commit — the rest of the pre-commit stays report-only
  if (depFindings.length) {
    console.log(`  ✗ ${depFindings.length} dependenc${depFindings.length === 1 ? 'y' : 'ies'} not ported in full compatibility — commit blocked until ported`)
    process.exit(1)
  }
}

/** Report-only: both TypeScript projects, every script, the deployment gate and dist freshness, as cross formulas. */
export const prePush = async (): Promise<void> => {
  const bridges = bridgesOf()
  const scripts = listed('scripts/*.mjs', 'scripts/*.js', 'tests/*.mjs')
  const [typed, syntax] = await Promise.all([
    timed(() => Promise.all(PROJECTS.map(([p]) => tscErrors(p)))),
    timed(async () => (await pool(scripts, 4, async (f) => {
      const err = await syntaxError(path.join(ROOT, f))
      return err && `${f}: ${err}`
    })).filter((x): x is string => Boolean(x))),
  ])
  const stale = distStale()
  type Gate = { ok: boolean; operationCount: number; unresolved: string[]; proved: boolean; error?: string }
  let gate: Gate | null = null
  try {
    const core = await import(pathToFileURL(path.join(ROOT, 'dist/mcp/uuid-programmable-core.js')).href).catch(() => null)
    gate = core ? await core.consolidatedMCP.runDeploymentGate() : null
  } catch (e) {
    gate = { ok: false, operationCount: 0, unresolved: [], proved: false, error: (e as Error).message.split('\n')[0] }
  }
  const [mainErrors, appErrors] = typed.value as [string[], string[]]
  const checks: [string, boolean][] = [
    ['tsconfig.json', mainErrors.length === 0],
    ['tsconfig.payload.json', appErrors.length === 0],
    [`scripts (${scripts.length})`, syntax.value.length === 0],
    ['deployment gate', Boolean(gate?.ok)],
    ['dist fresh', !stale],
  ]
  const passed = checks.filter(([, ok]) => ok).length
  const unresolved = gate?.unresolved.length ?? 0
  console.log(`pre-push: ${passed}/${checks.length} checks clean (typecheck ${typed.seconds}s, scripts ${syntax.seconds}s)`)
  for (const [name, ok] of checks) console.log(`  ${ok ? '✓' : '✗'} ${name}`)
  if (gate) console.log(`  gate: ${gate.operationCount} operations, ${unresolved} unresolved, proved ${gate.proved}${gate.error ? `, ${gate.error}` : ''}`)
  findingsOut([...mainErrors, ...appErrors, ...syntax.value])
  const X = await bridges
  if (!X) return console.log('  cross formulas need dist/ — npm run build')
  show(X.deploymentToObs!(typed.seconds, syntax.seconds))
  show(X.testCoverageToQuality!(passed, checks.length))
  show(X.observabilityToUI!(mainErrors.length + appErrors.length + syntax.value.length + unresolved, scripts.length + (gate?.operationCount ?? 0) + PROJECTS.length))
  show(X.quantumToEnterprise!((gate?.operationCount ?? 0) - unresolved + (gate?.proved ? 1 : 0)))
}

/** Thin wrappers in the repo's own hooks folder (--git-common-dir: --git-path follows core.hooksPath to a global folder). */
export const install = (): void => {
  const dir = path.resolve(ROOT, execFileSync('git', ['rev-parse', '--git-common-dir'], { cwd: ROOT, encoding: 'utf8' }).trim(), 'hooks')
  for (const name of ['pre-commit', 'pre-push']) {
    const file = path.join(dir, name)
    fs.writeFileSync(file, `#!/bin/sh\nhook="$(git rev-parse --show-toplevel)/dist/deployment/git-hooks.js"\n[ -f "$hook" ] || exit 0\nexec node "$hook" ${name} "$@"\n`, { mode: 0o755 })
    console.log(`installed ${file}`)
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const cmd = process.argv[2]
  await (cmd === 'pre-commit' ? preCommit() : cmd === 'pre-push' ? prePush() : cmd === 'install' ? Promise.resolve(install()) : Promise.resolve(console.log('usage: git-hooks pre-commit | pre-push | install')))
  process.exit(0)
}
