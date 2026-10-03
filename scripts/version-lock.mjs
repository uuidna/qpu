#!/usr/bin/env node
/**
 * THE VERSION LOCK. package.json's version must be v1.<minor>.<state>:
 *   - major is 1, always;
 *   - minor is any integer with no leading zero (unbounded);
 *   - state is one digit 0..9, the state of development, and 0 is always LTS.
 *
 * A version may move only forward, and only once the version before it is RELEASED — published on npm — not merely
 * tagged. "Before it" is the last different version package.json carried in git history; the first version of this
 * scheme has none.
 *
 *   node scripts/version-lock.mjs              format + forward + previous released (npm registry)
 *   node scripts/version-lock.mjs --offline    format + forward (no network; used by build)
 *   node scripts/version-lock.mjs --dist-tag   prints the npm dist-tag: latest for every version (a state digit is a
 *                                              development state of the same line, published as what everyone installs)
 *
 * Exit 1 on any violation.
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
const [, minor, state] = version.split('.').map(Number)

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
    if (v !== version) return v
  }
  return undefined
}
const previous = previousOf()
const inScheme = previous !== undefined && VERSION.test(previous)

if (inScheme) {
  const [, pm, ps] = previous.split('.').map(Number)
  if (minor < pm || (minor === pm && state <= ps)) fail(`${version} does not move forward from ${previous}`)
  if (!args.includes('--offline')) {
    let released = ''
    try {
      released = execSync(`npm view ${pkg.name}@${previous} version`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
    } catch {
      released = ''
    }
    if (released !== previous) fail(`${version} may not be bumped: ${previous} is not released on npm (tagged is not released)`)
  }
}

console.log(
  `version-lock: ${version} holds (${state === 0 ? 'LTS' : `state ${state}`}; previous ${previous ?? 'none'}${
    inScheme ? (args.includes('--offline') ? ', release not checked offline' : ', released') : ', first of the scheme'
  })`,
)
