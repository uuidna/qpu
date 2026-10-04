/**
 * THE FILE-LEVEL RULES, AS A SUITE: what the repository's files must say, read from the files. No manual limits in the
 * Worker config; the bundler's sideEffects equal to the families registry; the registry equal to the modules that
 * register; every family within its nibble. Discovered by glob (scripts/*.test.mjs), run by the one workflow.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'

const ROOT = join(dirname(new URL(import.meta.url).pathname), '..')
const read = (f) => readFileSync(join(ROOT, f), 'utf8')

test('the Worker config names no manual limit: the work is split instead', () => {
  const w = JSON.parse(read('wrangler.jsonc').replace(/^\s*\/\/.*$/gm, ''))
  assert.equal(w.limits, undefined, 'no limits block: a sweep that needs one is split into slices')
})

test('the families registry is exactly the modules that register, and the bundler is told to keep each', () => {
  const registers = (f) => /\b(qpuHexRegisterOf|qpuMcpFuseOf|qpuMcpRegisterOf)\(/.test(read(f))
  const registering = [
    ...readdirSync(join(ROOT, 'src/families'), { withFileTypes: true }).filter((e) => e.isDirectory() && registers(`src/families/${e.name}/index.ts`)).map((e) => `./dist/families/${e.name}/index.js`),
    ...readdirSync(join(ROOT, 'src/mcp')).filter((f) => /\.ts$/.test(f) && !/\.test\.ts$|^index\.ts$|^families\.ts$|^registry\.ts$/.test(f) && registers(`src/mcp/${f}`)).map((f) => `./dist/mcp/${f.slice(0, -3)}.js`),
  ]
  const families = read('src/mcp/families.ts')
  const listed = [...families.matchAll(/^import '([^']+)'/gm)].map((m) => m[1].replace(/^\.\//, './dist/mcp/').replace(/^\.\.\//, './dist/'))
  assert.deepEqual(listed.sort(), registering.sort(), 'families.ts imports every registering module and nothing else')
  const side = JSON.parse(read('package.json')).sideEffects.filter((f) => f.startsWith('./dist/'))
  assert.deepEqual(side.sort(), ['./dist/mcp/families.js', ...registering].sort(), 'sideEffects names the registry and each of its modules')
})

test('every family is within its nibble: fifteen formulas, none truncated', async () => {
  await import('../dist/mcp/families.js')
  const { qpuHexFamiliesOf, qpuHexRegisteredSizeOf, qpuHexFamilyCapOf } = await import('../dist/quantum/processing/unit/index.js')
  const cap = qpuHexFamilyCapOf()
  assert.equal(cap, 15)
  for (const [family, formulas] of qpuHexFamiliesOf()) {
    assert.ok(formulas.length <= cap, `${family}: ${formulas.length} > ${cap}`)
    assert.ok(qpuHexRegisteredSizeOf(family) <= cap, `${family} registered ${qpuHexRegisteredSizeOf(family)}: past the nibble, split it`)
    // one word per family (the naming rule): a registered family's name is one lowercase word, no separator
    if (qpuHexRegisteredSizeOf(family) > 0) assert.match(family, /^[a-z]+$/, `${family}: a registered family is one lowercase word (the one-word rule)`)
  }
})
