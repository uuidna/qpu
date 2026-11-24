import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { availableParallelism, tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { lanesNow } from './machine-run.ts'
import { THEOREMS } from './theorems-index.ts'

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
