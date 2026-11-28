// ISO/IEC/IEEE 29119-3 test cases for the pipelines read against each other: what research dispatches can be dispatched, land merges
// on every gate research starts, research starts every gate land waits on, the online steps live in research alone, and the steps the
// runner's next names are the ones the pipelines call. The workflow files are read as text, line by line, for the few keys these need.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { NEXT_STEPS } from './index.ts'

const DIR = '.github/workflows'
const workflows = Object.fromEntries(readdirSync(DIR).filter((f) => f.endsWith('.yml')).map((f) => [f, readFileSync(`${DIR}/${f}`, 'utf8')]))
const nameOf = (text: string) => /^name:\s*(\S+)/m.exec(text)?.[1] ?? ''
/** The events a workflow starts on: the keys under its top-level on:. */
const triggers = (text: string) => { const block = /^on:\n((?: {2}[^\n]*\n)+)/m.exec(text)?.[1] ?? ''; return [...block.matchAll(/^ {2}([a-z_]+):/gm)].map((m) => m[1]!) }
const byName = Object.fromEntries(Object.entries(workflows).map(([file, text]) => [nameOf(text), { file, text }]))
const research = workflows['research.yml']!, land = workflows['land.yml']!, cron = workflows['cron.yml']!
const dispatched = [...research.matchAll(/for gate in ([^;]+);/g)].flatMap((m) => m[1]!.trim().split(/\s+/))
const waitedOn = (/workflows:\s*\[([^\]]+)\]/.exec(land)?.[1] ?? '').split(',').map((s) => s.trim())

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every workflow has one name, and every action it uses is pinned to a commit. */
test('every workflow has one name, and every action it uses is pinned to a commit', () => {
  const names = Object.values(workflows).map(nameOf)
  assert.equal(new Set(names).size, names.length)
  for (const [file, text] of Object.entries(workflows)) for (const m of text.matchAll(/uses:\s*([^\s#]+)/g)) if (!m[1]!.startsWith('./')) assert.match(m[1]!, /@[0-9a-f]{40}$/, `${file}: ${m[1]}`)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every gate research dispatches exists and accepts a dispatch. */
test('every gate research dispatches exists and accepts a dispatch', () => {
  assert.ok(dispatched.length > 0)
  for (const file of dispatched) { assert.ok(workflows[file], file); assert.ok(triggers(workflows[file]!).includes('workflow_dispatch'), file) }
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: land waits on exactly the gates research dispatches, and merges on a dispatched run. */
test('land waits on exactly the gates research dispatches, and merges on a dispatched run', () => {
  assert.deepEqual(dispatched.map((f) => nameOf(workflows[f]!)).sort(), [...waitedOn].sort())
  for (const name of waitedOn) { assert.ok(byName[name], name); assert.ok(triggers(byName[name]!.text).includes('pull_request'), name) }
  assert.match(land, /workflow_run\.event == 'workflow_dispatch'/)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: research runs the online steps of next, and cron stays offline. */
test('research runs the online steps of next, and cron stays offline', () => {
  const online = NEXT_STEPS.filter((s) => s.needs === 'online' && s.via === 'generator')
  assert.ok(online.length >= 2)
  for (const s of online) assert.ok(research.includes(`step ${s.tool} '${JSON.stringify(s.arguments)}' --write`), s.name)
  assert.match(cron, /next --offline/)
  for (const s of online) assert.ok(!cron.includes(`step ${s.tool} '${JSON.stringify(s.arguments)}'`), `cron runs ${s.name}`)
  assert.ok(triggers(research).includes('schedule') && triggers(research).includes('workflow_dispatch'))
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: research commits only the programs it generates, and only when something changed. */
test('research commits only the programs it generates, and only when something changed', () => {
  assert.match(research, /git diff --quiet -- src\/quantum\/uuid\/programs/)
  assert.match(research, /git add -- src\/quantum\/uuid\/programs\n/)
  assert.ok(!/git add (-A|\.)/.test(research))
  assert.match(research, /contents: write/)
  assert.match(research, /OPENALEX_API_KEY: \$\{\{ secrets\.OPENALEX_API_KEY \}\}/)
})
