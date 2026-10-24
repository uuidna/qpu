#!/usr/bin/env node
/**
 * The release gate, with the human in it. The ship gate checks that the build is consistent; it does not approve anything.
 * A release reaches other people, so this script refuses to run unless the person starting it names themselves and the
 * action in the same command:
 *
 *   npx tsx scripts/release.ts --approved-by <your name> --action deploy
 *   npx tsx scripts/release.ts --approved-by <your name> --action publish
 *
 * --auto releases automatically once every check is green on a committed tree: the scripts gate, the ship gate and a clean
 * working tree. It refuses otherwise and runs nothing.
 *
 * The script also needs an interactive terminal and the person to type the exact approval phrase it prints. Without the
 * flags, without a terminal, or with a wrong phrase, it refuses and exits 2.
 */

import { execSync } from 'node:child_process'
import { createInterface } from 'node:readline'

const arg = (name: string) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : undefined }

const approvedBy = arg('--approved-by')
const action = arg('--action')
const ACTIONS: Record<string, string> = {
  deploy: 'npm run ship:verify && npm run seed && opennextjs-cloudflare build --noMinify && opennextjs-cloudflare deploy',
  publish: 'npm publish',
}

const auto = process.argv.includes('--auto')
if (auto) {
  // automatic release: only when every gate is green on a clean, committed tree. Any failure refuses, and nothing runs.
  const run = (cmd: string) => { try { execSync(cmd, { stdio: 'pipe' }); return true } catch { return false } }
  const dirty = execSync('git status --porcelain').toString().trim()
  // before the release: a clean committed tree, the scripts gate, the ship gate, and origin reachable (the push needs it)
  const reachable = run('git fetch origin --quiet')
  const checks: [string, boolean][] = [
    ['working tree is committed (no uncommitted edits)', dirty === ''],
    ['origin is reachable for the push', reachable],
    ['scripts gate passes', run('node --import tsx --test scripts/*.test.ts')],
    ['ship gate passes', run('./node_modules/.bin/tsx scripts/ship-gate.ts')],
  ]
  for (const [name, ok] of checks) console.log(`${ok ? 'ok     ' : 'refused'} ${name}`)
  if (checks.some(([, ok]) => !ok)) {
    console.log('release refused: automatic release needs every check green.')
    process.exit(2)
  }
  // every check is green: push the committed commits, then deploy, then publish. Nothing here commits anyone's edits.
  console.log('release: automatic on green — push, deploy, publish')
  execSync('git push origin HEAD', { stdio: 'inherit' })
  execSync(ACTIONS.deploy, { stdio: 'inherit' })
  execSync(ACTIONS.publish, { stdio: 'inherit' })
  // after the deploy: the host must now serve the same theorem count the ship gate recomputed
  const local = /(\d+)\/\d+ theorems/.exec(execSync('./node_modules/.bin/tsx scripts/ship-gate.ts', { stdio: 'pipe' }).toString())?.[1]
  const reply = execSync(`curl -s -m 60 -X POST https://qpu.uuidna.com/mcp -H 'content-type: application/json' -H 'accept: application/json' -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"prove","arguments":{}}}'`).toString()
  const hosted = /"theorems"\s*:\s*(\d+)|theorems=(\d+)/.exec(reply)?.slice(1).find(Boolean)
  console.log(`after deploy: host serves ${hosted ?? '?'} theorems, local ${local ?? '?'}${hosted === local ? ' — match' : ' — mismatch, investigate'}`)
  process.exit(0)
}

if (!auto && (!approvedBy || !action || !(action in ACTIONS))) {
  console.log('release refused: a release needs --approved-by <your name> and --action deploy|publish, typed by the person releasing.')
  process.exit(2)
}

if (!process.stdin.isTTY) {
  console.log('release refused: run it in an interactive terminal, so the person releasing types the approval.')
  process.exit(2)
}
const phrase = `yes, ${action} now - ${approvedBy}`
console.log(`release: ${action}, requested by ${approvedBy}`)
console.log(`runs: ${ACTIONS[action]}`)
const ask = createInterface({ input: process.stdin, output: process.stdout })
ask.question(`type exactly: ${phrase}\n> `, (typed) => {
  ask.close()
  if (typed.trim() !== phrase) {
    console.log('release refused: the approval did not match.')
    process.exit(2)
  }
  execSync(ACTIONS[action], { stdio: 'inherit' })
})
