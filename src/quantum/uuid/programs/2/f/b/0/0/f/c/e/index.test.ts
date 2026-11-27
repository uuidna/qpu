import { test } from 'node:test'
import assert from 'node:assert/strict'
import { call } from '../../../../../../../../3/8/5/9/0/2/0/f/index.ts'
import { LEAD_ROWS } from '../../../../../../../../f/3/5/3/8/2/1/2/index.ts'
import { existsSync, lstatSync, readFileSync, readlinkSync } from 'node:fs'
import { join } from 'node:path'
import { PLUGIN_STANDARDS, qpuSkills } from './index.ts'
import { TOOLBOXES } from '../../../../../../../../3/8/5/9/0/2/0/f/index.ts'
import { LICENSE } from '../../../../../../../../a/f/3/d/e/a/5/f/index.ts'
import { VERSION } from '../../../../../../../../c/0/7/0/9/8/4/3/index.ts'
import { WEBSITE_CLIENT } from '../../../../../../../../4/a/1/6/6/9/b/c/index.ts'

const leadsIndex = (args: Record<string, unknown>) => { const r = call('textbook', { scripts: { leadsIndex: args } }); if (r.error) throw new Error(r.error.message); return r.result!.structuredContent }
const rowsOf = (text: string) => JSON.parse(text.slice(text.indexOf('= ') + 2)) as { id: string; status: string; statement: string }[]

/** ISO/IEC/IEEE 29119-3 test case. Identifier: one call of the leads door deposits a new lead into the record and keeps every lead already recorded as it is. */
test('one call of the leads door deposits a new lead into the record and keeps every lead already recorded as it is', () => {
  const first = LEAD_ROWS[0]!
  const fresh = { id: 'test-deposit-by-add', source: 'a test', statement: 'one call deposits a lead', status: 'open', reason: 'none' }
  const s = leadsIndex({ add: [fresh, { ...first, status: 'served', statement: 'rewritten' }, { id: 'no-statement', status: 'open' }] })
  assert.equal(s.path, 'src/quantum/uuid/programs/f/3/5/3/8/2/1/2/index.ts')
  assert.deepEqual([s.added, s.kept, s.rows], [['test-deposit-by-add'], 2, LEAD_ROWS.length + 1])
  const rows = rowsOf(s.text)
  assert.deepEqual(rows.at(-1), fresh, 'the new lead is appended verbatim')
  assert.deepEqual(rows.find((l) => l.id === first.id), Object.fromEntries(Object.entries(first).filter(([k]) => ['id', 'source', 'statement', 'status', 'tool', 'reason', 'lastmod'].includes(k))), 'a recorded lead is never rewritten by add')
  assert.equal(leadsIndex({ add: [fresh, fresh] }).added.length, 1, 'the same lead twice is one lead')
})

const root = join(import.meta.dirname, '..', '..', '..', '..', '..', '..', '..', '..', '..', '..', '..', '..')

/** ISO/IEC/IEEE 29119-3 test case. Identifier: one source writes the plugin of every harness, each naming the hosted MCP server in its own key, every skill a real folder of skills/, and the files in the tree are the generator's output. */
test('one source writes the plugin of every harness, each naming the hosted MCP server in its own key, every skill a real folder of skills/, and the files in the tree are the generator\'s output', () => {
  const skills = qpuSkills(TOOLBOXES), { files } = skills, text = (p: string) => files.find((f) => f.path === p)!.text
  const read = (p: string) => JSON.parse(text(p))
  // the Claude plugin has a root of its own, where no .mcp.json of the repository's reaches it, and the same skills
  const claudeRoot = read('.claude-plugin/marketplace.json').plugins[0].source.replace(/^\.\//, '')
  assert.notEqual(claudeRoot, ''); assert.equal(existsSync(join(root, claudeRoot, '.mcp.json')), false); assert.equal(existsSync(join(root, '.claude-plugin/plugin.json')), false)
  // a skill's text reads the terms and examples the runner passes, so the copy is read against the skill the runner wrote
  for (const s of skills.catalogue) assert.equal(readFileSync(join(root, claudeRoot, s.path), 'utf8'), readFileSync(join(root, s.path), 'utf8'), s.path)
  const portable = read('plugin.json'), claude = read(`${claudeRoot}/.claude-plugin/plugin.json`), gemini = read('gemini-extension.json'), agy = read('.antigravity-plugin/plugin.json'), registry = read('server.json')
  assert.deepEqual([portable.$schema, portable.name, portable.version, portable.license, portable.author.name], [PLUGIN_STANDARDS.agentPlugins, 'qpu', VERSION, LICENSE.spdx, LICENSE.author])
  for (const m of [claude, gemini, agy, registry]) assert.deepEqual([m.version, m.description], [portable.version, portable.description])
  assert.deepEqual(read('mcp.json').mcpServers.qpu, { type: 'streamable-http', url: WEBSITE_CLIENT })
  assert.deepEqual(claude.mcpServers.qpu, { type: 'http', url: WEBSITE_CLIENT })
  assert.deepEqual(gemini.mcpServers.qpu, { httpUrl: WEBSITE_CLIENT })
  assert.deepEqual(read('mcp_config.json').mcpServers.qpu, { serverUrl: WEBSITE_CLIENT })
  assert.deepEqual(registry.remotes, [{ type: 'streamable-http', url: WEBSITE_CLIENT }])
  for (const m of ['.claude-plugin/marketplace.json', '.cursor-plugin/marketplace.json', '.agents/plugins/marketplace.json']) assert.deepEqual(read(m).plugins.map((p: { name: string }) => p.name), ['qpu'], m)
  for (const s of skills.catalogue) { assert.match(s.path, /^skills\/qpu[^/]*\/SKILL\.md$/); assert.equal(lstatSync(join(root, s.path.replace(/\/SKILL\.md$/, ''))).isDirectory(), true, s.path); for (const l of s.links) assert.equal(readlinkSync(join(root, l.path)), l.target, l.path) }
  for (const f of files.filter((f) => !f.path.endsWith('/SKILL.md'))) assert.equal(readFileSync(join(root, f.path), 'utf8'), f.text, f.path)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: each part of a skill is sealed as the catalogue seals its documents, by its hexbit handle and a register of 122 qubits, and the skill is the RFC 6962 root over its parts, which a changed part changes. */
test('each part of a skill is sealed as the catalogue seals its documents, by its hexbit handle and a register of 122 qubits, and the skill is the RFC 6962 root over its parts, which a changed part changes', async () => {
  const { seal } = await import('../../../../../../../7/1/a/7/6/4/9/index.ts')
  const { merkleTree } = await import('../../../../../../../../e/1/9/1/6/4/9/c/index.ts')
  const { hexagonHandle } = await import('../../../../../../../../d/7/8/3/e/4/6/3/index.ts')
  const skills = qpuSkills(TOOLBOXES).catalogue.filter((r) => r.toolbox !== null) as unknown as { name: string; qubits: number; root: string; parts: { kind: string; name: string; uuid: string; handle: string }[] }[]
  assert.ok(skills.length > 0)
  for (const s of skills) {
    assert.equal(s.qubits, 122, s.name)
    assert.ok(s.parts.length >= 5 && s.parts.every((p) => seal(p.uuid).valid && p.handle === p.uuid.slice(0, 8)), s.name)
    // every handle is its hexagon's: the six rotations of its program over its tail give it back, and a changed tail gives another
    assert.ok(s.parts.every((p) => hexagonHandle(p.uuid).holds), `${s.name}: handles are their hexagons'`)
    const [first] = s.parts, tail = first!.uuid.slice(-12), changed = `${first!.uuid.slice(0, -12)}${tail.slice(0, 11)}${((parseInt(tail.at(-1)!, 16) + 1) % 16).toString(16)}`
    assert.equal(hexagonHandle(changed).holds, false, `${s.name}: a changed tail breaks its handle`)
    assert.equal(new Set(s.parts.map((p) => p.handle)).size, s.parts.length, `${s.name}: one handle per part`)
    assert.equal(s.root, (merkleTree({ leaves: s.parts.map((p) => p.uuid.replace(/-/g, '')), hex: true }) as { root: string }).root, s.name)
  }
  // a toolbox whose one tool is described otherwise is another skill root
  const [box] = TOOLBOXES, changed = { ...box!, tools: box!.tools.map((t, i) => (i === 0 ? { ...t, description: `${t.description} (changed)` } : t)) }
  const before = (qpuSkills([box!]).catalogue.find((r) => r.toolbox === box!.name) as unknown as { root: string }).root
  const after = (qpuSkills([changed]).catalogue.find((r) => r.toolbox === box!.name) as unknown as { root: string }).root
  assert.notEqual(before, after)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the seed of the Lean algebra is the 64 hex digits of every theorem the kernel holds, a changed statement another, and a part's coin sealed in the post-quantum witness ring from it closes and refuses every change. */
test('the seed of the Lean algebra is the 64 hex digits of every theorem the kernel holds, a changed statement another, and a part\'s coin sealed in the post-quantum witness ring from it closes and refuses every change', async () => {
  const { THEOREMS } = await import('../../../../../../../../3/f/0/e/7/a/6/f/index.ts')
  const { leanAlgebraSeed } = await import('../../../../../../../../3/1/0/2/7/5/b/a/index.ts')
  const { skillRing } = await import('./index.ts')
  const algebra = THEOREMS.map((t) => ({ key: t.key, statement: t.statement })), seed = leanAlgebraSeed(algebra)
  assert.match(seed, /^[0-9a-f]{64}$/)
  assert.equal(leanAlgebraSeed([...algebra].reverse()), seed, 'the order the theorems come in does not change the seed')
  assert.notEqual(leanAlgebraSeed(algebra.map((t, i) => (i === 0 ? { ...t, statement: `${t.statement} ` } : t))), seed, 'a changed statement changes the seed')
  const part = (qpuSkills(TOOLBOXES).catalogue.find((r) => r.toolbox !== null) as unknown as { parts: { uuid: string }[] }).parts[0]!
  const ring = skillRing(part, algebra)
  assert.equal(ring.seed, seed)
  assert.equal(ring.faces, 14)
  assert.ok(ring.holds && ring.closes && ring.refused)
})
