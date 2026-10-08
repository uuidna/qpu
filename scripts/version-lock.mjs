#!/usr/bin/env node
/**
 * THE VERSION LOCK. package.json's version must be v1.<minor>.<state>:
 *   - major is 1, always;
 *   - minor is any integer with no leading zero (unbounded);
 *   - state is one digit 0..9, the state of development, and 0 is always LTS.
 *
 * The number moves forward from the last different version package.json carried in git history that was tagged
 * (v<version>). A version history carried that was never tagged is a bump withdrawn, not a step of the scheme
 * (measured 2026-10-03: 1.1.0 committed while 1.0.1 was unreleased, then withdrawn). The first version of this
 * scheme has none. The lock checks the scheme and continues from the version the tree holds.
 *
 *   node scripts/version-lock.mjs              format + forward
 *   node scripts/version-lock.mjs --offline    format + forward (used by build)
 *   node scripts/version-lock.mjs --dist-tag   prints the npm dist-tag: latest for every version (a state digit is a
 *                                              development state of the same line, published as what everyone installs)
 *
 * Exit 1 when the version string leaves the scheme or moves backward.
 */
import fs from 'node:fs'
import { execSync } from 'node:child_process'

export const VERSION = /^1\.(0|[1-9][0-9]*)\.[0-9]$/

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const version = pkg.version
const args = process.argv.slice(2)
const fail = (why) => {
  console.error(`version-lock: ${why}`)
  process.exit(1)
}

if (!VERSION.test(version)) fail(`${version} is not v1.<minor>.<digit> (major 1, minor an integer, state one digit, 0 = LTS)`)
const stateDigit = version.split('.')[2]

if (args.includes('--dist-tag')) {
  console.log('latest')
  process.exit(0)
}

/** The last version package.json carried before this one, read from git history. */
const previousOf = () => {
  let commits = []
  try {
    commits = execSync('git log --format=%H -- package.json', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().split('\n').filter(Boolean)
  } catch {
    return undefined
  }
  for (const c of commits) {
    let v
    try {
      v = JSON.parse(execSync(`git show ${c}:package.json`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString()).version
    } catch {
      continue
    }
    if (v === version) continue
    // a version that was never tagged is no step: withdrawn, skipped
    let tagged = ''
    try { tagged = execSync(`git tag -l v${v}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() } catch { tagged = '' }
    if (tagged === `v${v}`) return v
  }
  return undefined
}
const previous = previousOf()
const inScheme = previous !== undefined && VERSION.test(previous)

// Forward is code-point order of the whole string, not major, minor, and patch as integers.
if (inScheme && !(previous < version)) fail(`${version} does not move forward from ${previous}`)

console.log(
  `version-lock: ${version} holds (${stateDigit === '0' ? 'LTS' : `state ${stateDigit}`}; previous ${previous ?? 'none'}${
    inScheme ? '' : ', first of the scheme'
  })`,
)
