import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { availableParallelism, tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { lanesNow } from './machine-run.ts'
import { THEOREMS } from './theorems-index.ts'
import { TABLES } from './tables-index.ts'
import { call } from './mcp.ts'

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the runner's lanes, read from node:os now, lie between one and the cores, as Supremacy.lanes_pos and Supremacy.lanes_le_cores prove. */
test("the runner's lanes, read from node:os now, lie between one and the cores, as Supremacy.lanes_pos and Supremacy.lanes_le_cores prove", () => {
  const lanes = lanesNow(), cores = availableParallelism()
  assert.ok(Number.isInteger(lanes))
  assert.ok(lanes >= 1, `lanes ${lanes} below one`)
  assert.ok(lanes <= cores, `lanes ${lanes} above the ${cores} cores`)
  for (const key of ['Supremacy.lanes_pos', 'Supremacy.lanes_le_cores']) assert.ok(THEOREMS.some((t) => t.key === key), `${key} is in the kernel index`)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a step run on the staged tree decides by the index alone, an unstaged change in the same file deciding nothing, and what it stages reaches the working tree only where no unstaged edit stood. */
test('a step run on the staged tree decides by the index alone, an unstaged change in the same file deciding nothing, and what it stages reaches the working tree only where no unstaged edit stood', () => {
  const runner = fileURLToPath(new URL('./machine-run.ts', import.meta.url))
  const repo = mkdtempSync(join(tmpdir(), 'qpu-staged-test-')), tools = mkdtempSync(join(tmpdir(), 'qpu-staged-step-'))
  const { GIT_DIR: _d, GIT_INDEX_FILE: _i, GIT_WORK_TREE: _w, ...env } = process.env
  const git = (...a: string[]) => execFileSync('git', a, { cwd: repo, env, encoding: 'utf8' })
  try {
    git('init', '-q'); git('config', 'user.email', 'step@example.invalid'); git('config', 'user.name', 'step'); git('config', 'commit.gpgsign', 'false')
    for (const [f, t] of [['gate.txt', 'green\n'], ['gen.txt', 'old\n'], ['kept.txt', 'old\n']]) writeFileSync(join(repo, f!), t!)
    git('add', '.'); git('commit', '-q', '-m', 'first')
    // the step: green exactly when gate.txt reads green; it writes and stages two outputs, and says where it ran
    const step = join(tools, 'step.mjs')
    writeFileSync(step, [
      "import { readFileSync, writeFileSync } from 'node:fs'",
      "import { execFileSync } from 'node:child_process'",
      "console.log('AT ' + process.cwd())",
      "writeFileSync('gen.txt', 'new\\n'); writeFileSync('kept.txt', 'generated\\n')",
      "execFileSync('git', ['add', '--', 'gen.txt', 'kept.txt'])",
      "process.exit(readFileSync('gate.txt', 'utf8') === 'green\\n' ? 0 : 1)",
    ].join('\n'))
    const run = () => { const r = spawnSync(process.execPath, [runner, 'staged', process.execPath, step], { cwd: repo, env, encoding: 'utf8' }); return { status: r.status, at: /AT (.+)/.exec(r.stdout)?.[1] ?? null, out: r.stdout + r.stderr } }

    // staged green, unstaged red: the index decides, green
    writeFileSync(join(repo, 'gate.txt'), 'red\n'); writeFileSync(join(repo, 'kept.txt'), 'mine\n')
    const green = run()
    assert.equal(green.status, 0, green.out)
    assert.ok(green.at && green.at !== repo && !existsSync(green.at), `the step ran in a checkout of its own, removed after: ${green.at}`)
    assert.equal(readFileSync(join(repo, 'gate.txt'), 'utf8'), 'red\n', 'the unstaged change is left as it was')
    assert.equal(git('show', ':gen.txt'), 'new\n'); assert.equal(readFileSync(join(repo, 'gen.txt'), 'utf8'), 'new\n', 'a staged output reaches a file with no unstaged edit')
    assert.equal(git('show', ':kept.txt'), 'generated\n'); assert.equal(readFileSync(join(repo, 'kept.txt'), 'utf8'), 'mine\n', 'an unstaged edit is never overwritten')

    // staged red, unstaged green: the index decides, red
    writeFileSync(join(repo, 'gate.txt'), 'red\n'); git('add', 'gate.txt'); writeFileSync(join(repo, 'gate.txt'), 'green\n')
    const red = run()
    assert.equal(red.status, 1, red.out)
    assert.equal(readFileSync(join(repo, 'gate.txt'), 'utf8'), 'green\n')
  } finally { rmSync(repo, { recursive: true, force: true }); rmSync(tools, { recursive: true, force: true }) }
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the tree holds none of the fakes the table names, and an entropy typed as a number is found where it is written. */
test('the tree holds none of the fakes the table names, and an entropy typed as a number is found where it is written', () => {
  const runner = fileURLToPath(new URL('./machine-run.ts', import.meta.url)), root = fileURLToPath(new URL('../../..', import.meta.url))
  const { GIT_DIR: _d, GIT_INDEX_FILE: _i, GIT_WORK_TREE: _w, ...env } = process.env
  const fakes = (cwd: string) => { const r = spawnSync(process.execPath, [runner, 'fakes'], { cwd, env, encoding: 'utf8' }); return { status: r.status, lines: r.stdout.split('\n').filter(Boolean), err: r.stderr } }
  const here = fakes(root)
  assert.deepEqual(here.lines, [])
  assert.equal(here.status, 0, here.err)
  const name = 'an entropy typed as a number'
  assert.ok(TABLES.FAKES.some((k) => k.fake === name))
  // a tree of its own with the fake written in it; the word and the number are joined here so this file holds no such line
  const repo = mkdtempSync(join(tmpdir(), 'qpu-fakes-test-'))
  try {
    const git = (...a: string[]) => execFileSync('git', a, { cwd: repo, env, encoding: 'utf8' })
    git('init', '-q'); mkdirSync(join(repo, 'src'))
    writeFileSync(join(repo, 'src', 'typed.ts'), `export const answer = { ${['entropy', ': 0'].join('')} }\n`)
    writeFileSync(join(repo, 'src', 'measured.ts'), `export const answer = (text: string) => ({ ${['entropy', ': text.length'].join('')} })\n`)
    git('add', '.')
    const there = fakes(repo)
    assert.equal(there.status, 1, there.err)
    assert.deepEqual(there.lines.map((l) => l.split(':').slice(0, 2).join(':')), [`${name}: src/typed.ts`])
  } finally { rmSync(repo, { recursive: true, force: true }) }
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a step run on the staged tree is handed none of git's own variables, so a tool with repositories of its own reads its own, and the index is named to it. */
test("a step run on the staged tree is handed none of git's own variables, so a tool with repositories of its own reads its own, and the index is named to it", () => {
  const runner = fileURLToPath(new URL('./machine-run.ts', import.meta.url))
  const repo = mkdtempSync(join(tmpdir(), 'qpu-staged-env-')), tools = mkdtempSync(join(tmpdir(), 'qpu-staged-envstep-'))
  const { GIT_DIR: _d, GIT_INDEX_FILE: _i, GIT_WORK_TREE: _w, ...env } = process.env
  const git = (...a: string[]) => execFileSync('git', a, { cwd: repo, env, encoding: 'utf8' })
  try {
    git('init', '-q'); git('config', 'user.email', '[email]'); git('config', 'user.name', 'step'); git('config', 'commit.gpgsign', 'false')
    writeFileSync(join(repo, 'a.txt'), 'a\n'); git('add', '.'); git('commit', '-q', '-m', 'first')
    // another repository beside it, as a package manager keeps
    const other = join(tools, 'package'), remote = 'https://example.invalid/package'
    mkdirSync(other); execFileSync('git', ['init', '-q'], { cwd: other, env }); execFileSync('git', ['remote', 'add', 'origin', remote], { cwd: other, env })
    const step = join(tools, 'step.mjs')
    writeFileSync(step, [
      "import { execFileSync } from 'node:child_process'",
      "const git = (cwd, ...a) => execFileSync('git', a, { cwd, encoding: 'utf8' }).trim()",
      "const e = process.env",
      "console.log('SEEN ' + JSON.stringify({ dir: e.GIT_DIR ?? null, index: e.GIT_INDEX_FILE ?? null, tree: e.GIT_WORK_TREE ?? null, named: e.QPU_STAGED_INDEX ?? null, own: git(process.cwd(), 'rev-parse', '--absolute-git-dir'), other: git(process.argv[2], 'remote', 'get-url', 'origin') }))",
    ].join('\n'))
    // as git runs a hook in a linked worktree: its directory and its index are both named
    const gitDir = git('rev-parse', '--absolute-git-dir').trim(), index = join(gitDir, 'index')
    const r = spawnSync(process.execPath, [runner, 'staged', process.execPath, step, other], { cwd: repo, env: { ...env, GIT_DIR: gitDir, GIT_INDEX_FILE: index }, encoding: 'utf8' })
    assert.equal(r.status, 0, r.stdout + r.stderr)
    assert.deepEqual(JSON.parse(/SEEN (.+)/.exec(r.stdout)![1]!), { dir: null, index: null, tree: null, named: index, own: gitDir, other: remote })
  } finally { rmSync(repo, { recursive: true, force: true }); rmSync(tools, { recursive: true, force: true }) }
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the work once done by hand is the door's: settle, sync, ratchet and intake are actions the runner itself answers, and an intake names each content once and each command by the action that covers it. */
test('the work once done by hand is the door\'s: settle, sync, ratchet and intake are actions the runner itself answers, and an intake names each content once and each command by the action that covers it', () => {
  const rows = TABLES.MACHINE_ROWS as readonly { id: string; kind: string; cmd?: string; args: readonly string[] }[]
  for (const id of ['settle', 'sync', 'ratchet', 'intake']) assert.deepEqual(rows.filter((r) => r.id === id).map((r) => [r.cmd, ...r.args]), [['node', 'src/quantum/processing/machine-run.ts', id]], id)
  const runner = fileURLToPath(new URL('./machine-run.ts', import.meta.url)), dir = mkdtempSync(join(tmpdir(), 'qpu-intake-'))
  try {
    mkdirSync(join(dir, 'work'))
    writeFileSync(join(dir, 'work', 'a.txt'), 'one content')
    writeFileSync(join(dir, 'work', 'b.txt'), 'one content')
    writeFileSync(join(dir, 'work', 'run.py'), "subprocess.run(['git', 'status'])\nsubprocess.run(['node', '.wrangler/mcp.mjs', 'seal', '{}'])\nsubprocess.run(['git', 'mv', 'a', 'b'])\n")
    const out = spawnSync(process.execPath, [runner, 'intake', 'work'], { cwd: dir, encoding: 'utf8' })
    assert.equal(out.status, 0, out.stderr)
    const answer = JSON.parse(out.stdout.trim().split('\n').pop()!)
    assert.deepEqual([answer.phase, answer.roots, answer.files, answer.distinct, answer.repeatedBytes, answer.ofTree], ['intake', 1, 3, 2, 'one content'.length, 0])
    assert.deepEqual(answer.doors, { seal: 1 })
    assert.deepEqual(answer.direct, [{ command: 'git mv', uses: 1, action: null }, { command: 'git status', uses: 1, action: 'status' }])
    // the merge is the seal door's root over the distinct digests in order, and the list stays beside the tree that asked
    const list = JSON.parse(readFileSync(join(dir, '.qpu', 'intake', `${answer.handle}.json`), 'utf8')).list as { path: string; sha256: string }[]
    assert.deepEqual(list.map((f) => f.path), ['0/a.txt', '0/b.txt', '0/run.py'])
    const leaves = [...new Set(list.map((f) => f.sha256))].sort()
    assert.equal(call('seal', { merkle: { leaves, hex: true } }).result!.structuredContent.root, answer.root)
    assert.equal(JSON.stringify(answer).includes(dir), false)
    // with no directory named there is nothing to take in
    assert.equal(spawnSync(process.execPath, [runner, 'intake'], { cwd: dir, encoding: 'utf8', env: { ...process.env, QPU_SCRATCH: '' } }).status, 1)
  } finally { rmSync(dir, { recursive: true, force: true }) }
})
