#!/usr/bin/env node
/**
 * The release gate, with the human in it. The ship gate checks that the build is consistent; it does not approve anything.
 * A release reaches other people, so this script refuses to run unless the person starting it names themselves and the
 * action in the same command:
 *
 *   npx tsx scripts/release.ts --approved-by <your name> --action deploy
 *   npx tsx scripts/release.ts --approved-by <your name> --action publish
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

if (!approvedBy || !action || !(action in ACTIONS)) {
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
