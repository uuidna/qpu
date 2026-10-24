/**
 * THE MCP DOORS ARE VALIDATED THE WAY THE PAYLOAD PORTS ARE (scripts/payload.test.ts): read from the source on disk,
 * token-free, no build needed. Every fused door a file registers is wired into the unit, carries a description and an
 * input schema, and is named without the prefix the repo gate forbids. A door that is written but not wired, or is
 * named with a prefix, fails here by name. Discovered by the scripts/*.test.ts glob, run by the one gate.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'

const ROOT = join(dirname(new URL(import.meta.url).pathname), '..')
const MCP = join(ROOT, 'src', 'mcp')
const read = (f: string) => readFileSync(join(MCP, f), 'utf8')
const files = readdirSync(MCP).filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts'))

// every fused door a file registers, by name, with the file it is in
const doorsOf = () =>
  files.flatMap((file) => [...read(file).matchAll(/mcpFuseOf\('([a-z_]+)'/g)].map((m) => ({ file, name: m[1] })))

test('every fused door is wired into the unit: a side-effect or named import from qpu-fused.ts', () => {
  const wiring = read('qpu-fused.ts')
  const doors = doorsOf()
  assert.ok(doors.length > 0, 'the MCP registers fused doors')
  for (const { file } of doors) {
    if (file === 'qpu-fused.ts') continue
    const module = file.replace(/\.ts$/, '')
    assert.match(wiring, new RegExp(`from '\\./${module}\\.js'|import '\\./${module}\\.js'`), `${file} registers a door but qpu-fused.ts does not import it`)
  }
})

test('every fused door states what it does and takes: a description and an input schema beside its name', () => {
  for (const { file, name } of doorsOf()) {
    const source = read(file)
    const start = source.indexOf(`mcpFuseOf('${name}'`)
    const block = source.slice(start, start + 4000)
    assert.match(block, /description:/, `door ${name} in ${file} has no description`)
    assert.match(block, /inputSchema:/, `door ${name} in ${file} has no inputSchema`)
  }
})

test('no fused door is named with the qpu_ prefix the repo gate forbids', () => {
  for (const { file, name } of doorsOf()) assert.doesNotMatch(name, /^qpu_/, `door ${name} in ${file} carries the qpu_ prefix`)
})

test('no MCP source names a tool with the qpu_ prefix: the public names are the bare ones', () => {
  for (const file of files) {
    const named = [...read(file).matchAll(/name:\s*['"](qpu_[a-z_]+)['"]/g)].map((m) => m[1])
    assert.deepEqual(named, [], `${file} names a tool with the qpu_ prefix: ${named.join(', ')}`)
  }
})

test('no fused door declares an input named door: the connector intercepts that key before any door sees it', () => {
  for (const file of files) assert.doesNotMatch(read(file), /^\s+door:\s*\{\s*type:/m, `${file} declares an input named door`)
})

test('the connector checks about before source: a call with both is a chat call, and the order is fixed here so it cannot change by accident', () => {
  const connector = readFileSync(join(ROOT, 'src', 'payload', 'plugins', 'connector.ts'), 'utf8')
  const about = connector.indexOf("typeof args.about === 'string'")
  const source = connector.indexOf("if (typeof args.source === 'string')")
  assert.ok(about > 0 && source > 0, 'both branches exist in the connector')
  assert.ok(about < source, 'the about branch must come before the source branch')
})
