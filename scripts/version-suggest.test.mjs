/**
 * THE NEXT VERSION IS ONE STEP FROM THE ZENODO RECORD. .zenodo.json's version is the base. A feature opens the
 * next v1.<minor>.0. version:auto computes that step and returns. The files keep the record. 1.2.0 is not written
 * while the record is behind it. The workflow has no prompt.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { suggestNextVersion, autoVersion, readZenodoVersion, versionTextBefore, VERSION_ORDER_LEAD } from '../src/mcp/version.ts'

const pkgPath = 'package.json'

test('version: the workflow continues from the Zenodo record and does not write 1.2.0', async () => {
  assert.equal(suggestNextVersion('1.0.1'), '1.1.0')
  assert.equal(suggestNextVersion('1.0.8'), '1.1.0')
  assert.throws(() => suggestNextVersion('1.9.0'), /1\.10\.0 is not forward from 1\.9\.0/)

  // "1.2.0" is text in code-point order. It is not the next release and it is not written.
  assert.equal(VERSION_ORDER_LEAD, 'text.order')
  assert.equal(versionTextBefore('1.1.0', '1.2.0'), true)
  assert.equal(versionTextBefore('1.10.0', '1.2.0'), true)
  assert.equal(versionTextBefore('1.2.0', '1.9.0'), true)
  assert.equal(versionTextBefore('1.9.0', '1.10.0'), false)

  const zenodo = readZenodoVersion()
  const suggestion = suggestNextVersion(zenodo)
  assert.equal(zenodo, '1.0.1')
  assert.equal(versionTextBefore(zenodo, suggestion), true)

  const versionSrc = readFileSync('src/mcp/version.ts', 'utf8')
  const lockSrc = readFileSync('scripts/version-lock.mjs', 'utf8')
  const publish = readFileSync('.github/workflows/publish.yml', 'utf8')
  assert.doesNotMatch(versionSrc, /Approve by passing|approved !==|readline|read -p/)
  assert.doesNotMatch(lockSrc, /may not be bumped|not released on npm|npm view/)
  assert.doesNotMatch(publish, /read -p|readline|Approve by passing|previous version released on npm/)

  const pkgBefore = readFileSync(pkgPath)
  const cffBefore = readFileSync('CITATION.cff')
  const zenodoBefore = readFileSync('.zenodo.json')
  const tree = JSON.parse(pkgBefore.toString()).version
  assert.equal(tree, '1.1.0')

  const result = await autoVersion()
  execSync('node scripts/version-lock.mjs', { stdio: 'pipe' })

  assert.equal(result.zenodo, zenodo)
  assert.equal(result.suggestion, suggestion)
  assert.equal(result.wrote, false)
  assert.equal(result.tagged, false)
  assert.equal(result.currentVersion, tree)
  assert.equal(result.newVersion, tree)
  assert.ok(readFileSync(pkgPath).equals(pkgBefore), 'package.json changed')
  assert.ok(readFileSync('CITATION.cff').equals(cffBefore), 'CITATION.cff changed')
  assert.ok(readFileSync('.zenodo.json').equals(zenodoBefore), '.zenodo.json changed')
  assert.equal(JSON.parse(readFileSync('.zenodo.json', 'utf8')).version, zenodo)
  assert.notEqual(JSON.parse(readFileSync(pkgPath, 'utf8')).version, '1.2.0')
  assert.notEqual(JSON.parse(readFileSync('.zenodo.json', 'utf8')).version, '1.2.0')
  assert.doesNotMatch(readFileSync('CITATION.cff', 'utf8'), /^version:\s*1\.2\.0\s*$/m)
})
