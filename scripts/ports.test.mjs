/**
 * NO GAP BETWEEN node:* AND qpu:*. qpu is self-sufficient: it computes everything through its own unit, so the compute
 * core — every family and the unit itself — leans on no node builtin. `node:*` survives only at the host PORTS (the
 * store, the server boot, stdio, the test harness, the deploy tooling), each a boundary qpu answers with a door; it
 * never reaches the formulas. This reads the files and holds that line, so a node builtin creeping into the compute
 * core, or a new node builtin with no qpu door, fails here. Discovered by glob (scripts/*.test.mjs), run by the one
 * workflow — the same shape as rules.test.mjs.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { builtinModules } from 'node:module'

const ROOT = join(dirname(new URL(import.meta.url).pathname), '..')
const read = (f) => readFileSync(join(ROOT, f), 'utf8')
/** The node builtins a source names, by import or require. */
const nodeOf = (src) => [...src.matchAll(/(?:from|require\()\s*'(node:[a-z_/]+)'/g)].map((m) => m[1])
/** Every .ts under a directory, recursively. */
const walk = (dir) =>
  readdirSync(join(ROOT, dir), { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(`${dir}/${e.name}`) : e.name.endsWith('.ts') ? [`${dir}/${e.name}`] : [],
  )

test('every family computes through qpu alone: no family imports node:*', () => {
  for (const e of readdirSync(join(ROOT, 'src/families'), { withFileTypes: true })) {
    if (!e.isDirectory()) continue
    const f = `src/families/${e.name}/index.ts`
    if (!existsSync(join(ROOT, f))) continue
    const used = nodeOf(read(f))
    assert.deepEqual(used, [], `${f} reaches for ${used.join(', ')} — a family is a formula, not a node program`)
  }
})

test('the unit core is node-free: it computes everything itself', () => {
  const used = nodeOf(read('src/quantum/processing/unit/index.ts'))
  assert.deepEqual(used, [], `the unit imports ${used.join(', ')} — the compute core must stand without node`)
})

test('qpu crypto is its own: node:crypto is never imported in the runtime', () => {
  const offenders = walk('src').filter((f) => !f.endsWith('.test.ts')).filter((f) => nodeOf(read(f)).includes('node:crypto'))
  assert.deepEqual(offenders, [], `node:crypto imported by ${offenders.join(', ')} — crypto is qpu_crypt / Web Crypto, no node`)
})

test('port all like node: every node builtin has a qpu port or a declared lead', async (t) => {
  const { QPU_PORTS } = await import('../dist/quantum/processing/unit/porting.js')
  const bare = (m) => m.replace(/^node:/, '')
  const surface = [...new Set(builtinModules.filter((m) => !m.startsWith('_') && !bare(m).includes('/')).map(bare))]
  const missing = surface.filter((m) => !(m in QPU_PORTS))
  assert.deepEqual(missing, [], `node builtins with no qpu port and no lead: ${missing.join(', ')} — add to QPU_PORTS (a door) or mark a lead (port all like node)`)
  const ported = surface.filter((m) => !QPU_PORTS[m].lead)
  const leads = surface.filter((m) => QPU_PORTS[m].lead)
  const byDomain = [...new Set(surface.map((m) => QPU_PORTS[m].domain))].sort()
  t.diagnostic(`${surface.length} node builtins across ${byDomain.length} domains (${byDomain.join(', ')}): ${ported.length} ported, ${leads.length} leads (${leads.join(', ')})`)
})

test('port all dependencies: every package.json dependency is a family in the port graph (ported or lead)', async (t) => {
  const { QPU_DEPS } = await import('../dist/quantum/processing/unit/porting.js')
  const pkg = JSON.parse(read('package.json'))
  const deps = [...new Set([...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.devDependencies ?? {})])]
  const missing = deps.filter((d) => !(d in QPU_DEPS))
  assert.deepEqual(missing, [], `dependencies not ported into the graph: ${missing.join(', ')} — add each to QPU_DEPS (domain + relates); ask the MCP how: qpu_data { source: 'ask', about: 'how to port' }`)
  const extra = Object.keys(QPU_DEPS).filter((d) => !deps.includes(d))
  assert.deepEqual(extra, [], `QPU_DEPS names ${extra.join(', ')} not in package.json — the graph drifted past the manifest; remove them`)
  const ported = deps.filter((d) => !QPU_DEPS[d].lead)
  const byDomain = [...new Set(deps.map((d) => QPU_DEPS[d].domain))].sort()
  t.diagnostic(`${deps.length} dependencies across ${byDomain.length} domains (${byDomain.join(', ')}): ${ported.length} ported (${ported.join(', ')}), ${deps.length - ported.length} leads`)
})

test('the gate blocks external dependencies: the compute core imports only node: and relative — port, do not depend', () => {
  const core = [...walk('src/quantum'), ...walk('src/families')]
  const offenders = []
  for (const f of core) {
    const src = read(f)
    const specs = [
      ...[...src.matchAll(/^\s*(?:import|export)\b[^\n]*?\bfrom\s*'([^']+)'/gm)].map((m) => m[1]),
      ...[...src.matchAll(/(?:^|[^.\w])(?:import|require)\(\s*'([^']+)'\)/gm)].map((m) => m[1]),
    ]
    for (const s of specs) if (!s.startsWith('.') && !s.startsWith('node:')) offenders.push(`${f}: ${s}`)
  }
  assert.deepEqual(
    offenders,
    [],
    `external dependency in the compute core:\n  ${offenders.join('\n  ')}\n→ port it into qpu, do not depend on it. Ask the MCP how: qpu_data { source: 'ask', about: 'how to port' } (src/quantum/processing/unit/porting.ts).`,
  )
})

test('node:* survives only at the host ports, and every one maps to a qpu door', (t) => {
  const byBuiltin = new Map()
  for (const f of walk('src').filter((x) => !x.endsWith('.test.ts')))
    for (const b of nodeOf(read(f))) (byBuiltin.get(b) ?? byBuiltin.set(b, new Set()).get(b)).add(f)
  // the qpu door that answers each host builtin without node — the port boundary, named
  const DOOR = {
    'node:fs': 'storage',
    'node:path': 'storage',
    'node:http': 'server',
    'node:os': 'server',
    'node:url': 'server',
    'node:console': 'stdio',
    'node:readline': 'stdio',
    'node:child_process': 'sandbox',
    'node:module': 'install',
    'node:test': 'gate',
    'node:assert/strict': 'gate',
  }
  const gaps = [...byBuiltin.keys()].filter((b) => !(b in DOOR))
  assert.deepEqual(gaps, [], `node:* with no qpu door: ${gaps.join(', ')} — add a qpu door or drop the import`)
  t.diagnostic([...byBuiltin.keys()].sort().map((b) => `${b} → ${DOOR[b]}`).join(', '))
})
