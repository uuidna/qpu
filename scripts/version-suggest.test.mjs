/**
 * THE NEXT VERSION IS A SUGGESTION. The latest @uuidna/qpu published on npm is the base. A feature opens the next
 * v1.<minor>.0, forward only. Running that path does not rewrite package.json; a human approves by passing the exact
 * version, and this test never does.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { suggestNextVersion, autoVersion } from '../src/mcp/version.ts'

const pkgPath = 'package.json'
const versionOf = (buf) => JSON.parse(buf.toString()).version

test('version: the suggestion is the next forward number from the published version and does not rewrite package.json', async () => {
  // a feature opens the next minor at LTS. 1.0.8 does not become 1.0.9. 1.2.0 is the suggestion only when 1.1.0 is the base.
  assert.equal(suggestNextVersion('1.0.1'), '1.1.0')
  assert.equal(suggestNextVersion('1.0.8'), '1.1.0')
  assert.equal(suggestNextVersion('1.1.0'), '1.2.0')
  assert.equal(suggestNextVersion('1.9.0'), '1.10.0')

  const published = JSON.parse(execSync('npm view @uuidna/qpu version --json', { encoding: 'utf8' }))
  const suggestion = suggestNextVersion(published)
  const [, minor] = published.split('.').map(Number)
  assert.equal(suggestion, `1.${minor + 1}.0`)

  const before = readFileSync(pkgPath)
  const tree = versionOf(before)
  let after = before
  try {
    const result = await autoVersion()
    const refused = await autoVersion('not-approved')
    after = readFileSync(pkgPath)
    assert.equal(result.published, published)
    assert.equal(result.suggestion, suggestion)
    assert.equal(result.wrote, false)
    assert.equal(result.newVersion, tree)
    assert.equal(refused.wrote, false)
    assert.equal(refused.suggestion, suggestion)
    if (tree !== published) assert.notEqual(result.suggestion, suggestNextVersion(tree))
    assert.ok(after.equals(before), 'suggestion path rewrote package.json')
  } finally {
    const now = readFileSync(pkgPath)
    if (versionOf(now) !== tree) writeFileSync(pkgPath, before)
  }
})
