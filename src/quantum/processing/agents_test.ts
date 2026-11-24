// Agent independence: every file an agent harness reads has one real copy, under .agents, readable by any harness; a harness's own
// folder (.claude, .cursor, or any later one) holds only symlinks into it. No list of harnesses is kept: a folder holding one symlink into
// .agents is a harness mirror, and a mirror holds nothing else. Build caches and the repository's own store are not configuration and
// are not walked.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { lstatSync, readdirSync, readlinkSync, existsSync, mkdtempSync, mkdirSync, writeFileSync, symlinkSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve, relative, dirname } from 'node:path'

const CACHES = new Set(['.git', '.agents', '.lake', '.wrangler', '.qpu'])
const walk = (dir: string): string[] => readdirSync(dir).flatMap((name) => { const p = join(dir, name), s = lstatSync(p); return s.isSymbolicLink() || !s.isDirectory() ? [p] : walk(p) })
/** What a tree's harnesses own instead of reading from .agents, what in .agents links out of it, and which root links miss it. */
const independence = (root: string) => {
  const agents = join(root, '.agents')
  const into = (link: string) => { const target = resolve(dirname(link), readlinkSync(link)); return !relative(agents, target).startsWith('..') && existsSync(target) }
  const linked = (p: string) => lstatSync(p).isSymbolicLink() && into(p)
  const folders = readdirSync(root).filter((n) => n.startsWith('.') && !CACHES.has(n) && lstatSync(join(root, n)).isDirectory()).map((n) => ({ n, files: walk(join(root, n)) }))
  const mirrors = folders.filter((f) => f.files.some(linked))
  return {
    mirrors: mirrors.map((f) => f.n),
    owned: mirrors.flatMap((f) => f.files.filter((p) => !linked(p)).map((p) => relative(root, p))),
    escaping: walk(agents).filter((p) => lstatSync(p).isSymbolicLink() && !into(p)).map((p) => relative(root, p)),
    rootLinks: readdirSync(root).map((n) => join(root, n)).filter((p) => lstatSync(p).isSymbolicLink() && !into(p)).map((p) => relative(root, p)),
  }
}

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a harness folder holds only symlinks into .agents, so no agent harness owns a file the others cannot read. */
test('a harness folder holds only symlinks into .agents, so no agent harness owns a file the others cannot read', () => {
  const found = independence(resolve(import.meta.dirname, '../../..'))
  assert.ok(found.mirrors.length > 0, 'at least one harness mirrors .agents')
  assert.deepEqual([found.owned, found.escaping, found.rootLinks], [[], [], []])
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the guard names a file a harness owns, a link out of .agents and a root link that misses it. */
test('the guard names a file a harness owns, a link out of .agents and a root link that misses it', () => {
  const root = mkdtempSync(join(tmpdir(), 'qpu-agents-'))
  try {
    mkdirSync(join(root, '.agents', 'rules'), { recursive: true }); mkdirSync(join(root, '.harness', 'rules'), { recursive: true })
    writeFileSync(join(root, '.agents', 'rules', 'one.md'), 'one'); writeFileSync(join(root, 'outside.md'), 'x')
    symlinkSync('../../.agents/rules/one.md', join(root, '.harness', 'rules', 'one.md'))
    writeFileSync(join(root, '.harness', 'rules', 'own.md'), 'a harness owns this')
    symlinkSync('../../outside.md', join(root, '.agents', 'rules', 'out.md'))
    symlinkSync('outside.md', join(root, 'root.md'))
    assert.deepEqual(independence(root), { mirrors: ['.harness'], owned: ['.harness/rules/own.md'], escaping: ['.agents/rules/out.md'], rootLinks: ['root.md'] })
  } finally { rmSync(root, { recursive: true, force: true }) }
})
