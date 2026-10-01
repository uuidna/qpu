import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readdirSync, realpathSync, rmSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const WEB = join(ROOT, 'web')
const ROOTS = [['web'], ['browser'], ['src', 'enterprise', 'ui'], ['src', 'quantum', 'experiments'], ['tests', 'ui']].map((parts) => join(ROOT, ...parts))
const TEST_FILE = /\.test\.(ts|tsx|mjs)$/
const COMPILED = /\.tsx?$/

const testsUnder = (dir, out = []) => {
  if (!existsSync(dir)) return out
  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
    const path = join(dir, entry.name)
    if (entry.isDirectory()) testsUnder(path, out)
    else if (TEST_FILE.test(entry.name)) out.push(path)
  }
  return out
}

const rootPackages = {
  name: 'root-node-modules',
  setup(pluginBuild) {
    pluginBuild.onResolve({ filter: /^[^./]/ }, async (args) => {
      if (args.pluginData === rootPackages || args.path === '@' || args.path.startsWith('@/') || args.path.startsWith('node:')) return undefined
      if (args.importer.split(sep).includes('node_modules')) return undefined
      const found = await pluginBuild.resolve(args.path, { kind: args.kind, resolveDir: ROOT, importer: args.importer, pluginData: rootPackages })
      if (found.errors.length > 0) return undefined
      return { path: found.path, external: found.external, namespace: found.namespace, sideEffects: found.sideEffects, suffix: found.suffix }
    })
  },
}

const outFileOf = (outdir, file) =>
  join(
    outdir,
    relative(ROOT, file)
      .split(sep)
      .filter((part) => part !== '..' && part !== '')
      .join(sep) + '.mjs',
  )

const compile = (file, outfile) =>
  build({
    absWorkingDir: ROOT,
    entryPoints: [file],
    outfile,
    bundle: true,
    platform: 'node',
    format: 'esm',
    jsx: 'automatic',
    alias: { '@': WEB },
    plugins: [rootPackages],
    sourcemap: 'inline',
    minifyWhitespace: true,
    define: {
      'import.meta.url': JSON.stringify(pathToFileURL(file).href),
      'import.meta.filename': JSON.stringify(file),
      'import.meta.dirname': JSON.stringify(dirname(file)),
    },
    banner: { js: "import { createRequire as __testUiCreateRequire } from 'node:module'; const require = __testUiCreateRequire(import.meta.url);" },
    logLevel: 'warning',
    logOverride: { 'module-level-directive': 'silent' },
  })

const args = process.argv.slice(2)
const flags = args.filter((arg) => arg.startsWith('-'))
const paths = args.filter((arg) => !arg.startsWith('-')).map((arg) => resolve(process.cwd(), arg))
const chosen = paths.length === 0 ? ROOTS.flatMap((dir) => testsUnder(dir)) : paths.flatMap((path) => (existsSync(path) && statSync(path).isDirectory() ? testsUnder(path) : [path]))
const files = [...new Set(chosen)]

if (files.length === 0) {
  console.log(`\n  no UI test files found under ${(paths.length === 0 ? ROOTS : paths).map((path) => relative(ROOT, path) || '.').join(', ')}\n`)
  process.exit(0)
}

const outdir = mkdtempSync(join(realpathSync(tmpdir()), 'qpu-test-ui-'))
let status = 1
try {
  const settled = await Promise.allSettled(
    files.map(async (file) => {
      if (!COMPILED.test(file)) return file
      const outfile = outFileOf(outdir, file)
      await compile(file, outfile)
      return outfile
    }),
  )
  const failed = files.filter((_, index) => settled[index].status === 'rejected')
  const runnable = settled.filter((result) => result.status === 'fulfilled').map((result) => result.value)
  for (const file of failed) console.error(`\n✗ test:ui — ${relative(ROOT, file)} did not compile`)
  if (runnable.length > 0) {
    const run = spawnSync(process.execPath, ['--enable-source-maps', '--test', '--test-reporter=spec', '--test-force-exit', ...flags, ...runnable], { cwd: ROOT, stdio: 'inherit' })
    status = run.status ?? 1
  }
  if (failed.length > 0 && status === 0) status = 1
} finally {
  rmSync(outdir, { recursive: true, force: true })
}
process.exit(status)
