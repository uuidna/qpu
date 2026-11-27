// The quantum capacity: one computation from the register's own answer, carried by metrics, stated in the welcome, printed in the one text,
// and a gate every workflow step is held to. A register whose parts do not make the whole, whose receipt does not balance or that leaves a
// qubit unused does not pass.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { call, handle } from '../../../../../../../../3/8/5/9/0/2/0/f/index.ts'
import { execFileSync } from 'node:child_process'
import { capacityOf, costToFake, quantumCapacity, stabilityOf, stableSource } from './index.ts'
import { WORKFLOWS } from '../../../../../../../../d/e/a/3/e/d/e/1/index.ts'
import { TEXTBOOK_THEOREMS } from '../../../../../../../../3/4/7/e/0/c/e/0/index.ts'
import { LICENSE } from '../../../../../../../../a/f/3/d/e/a/5/f/index.ts'

const door = () => call('fold', { qubits: 4 }).result!.structuredContent as Record<string, any>

/** ISO/IEC/IEEE 29119-3 test case. Identifier: metrics carries the capacity the fold door answers, number for number, and the gate holds on it. */
test('metrics carries the capacity the fold door answers, number for number, and the gate holds on it', () => {
  const q = door(), c = call('metrics', {}).result!.structuredContent.quantumCapacity
  assert.deepEqual(c, JSON.parse(JSON.stringify(quantumCapacity())))
  assert.deepEqual([c.register.free, c.register.qubits, c.register.digits, c.used, c.left, c.full, c.gate.holds], [q.effective, q.hex, q.digits, q.organised.zero.used, q.organised.zero.left, true, true])
  assert.deepEqual([c.zero, c.scales, c.spaces.onEveryHandle, c.receipt.coin], [q.organised.zero, q.handles.scales, q.handles.capacity, q.receipt.coin])
  // the five parts are the UUID's own groups and make the register: 8 + 1 + 10 + 1 + 12 digits, 122 free of 128
  assert.deepEqual(c.parts.map((p: { part: string; digits: number; free: number }) => [p.part, p.digits, p.free]), [['handle', 8, 32], ['version', 1, 0], ['program', 10, 40], ['variant', 1, 2], ['tail', 12, 48]])
  assert.equal(c.gate.evidence, '122 + 0 = 122; 122 = 122; 122 = 122')
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the gate refuses a register that leaves a qubit unused, an unbalanced or unsealed receipt, and parts that do not make the whole. */
test('the gate refuses a register that leaves a qubit unused, an unbalanced or unsealed receipt, and parts that do not make the whole', () => {
  const q = door(), alter = (change: (x: Record<string, any>) => void) => { const x = JSON.parse(JSON.stringify(q)); change(x); return capacityOf(x).gate }
  assert.equal(capacityOf(q).gate.holds, true)
  const idle = alter((x) => { x.organised.zero.used = 120; x.organised.zero.left = 2 })
  assert.deepEqual([idle.holds, idle.evidence], [false, '120 + 2 = 122; 122 = 122; 122 = 122'])
  assert.equal(alter((x) => { x.organised.zero.used = 121 }).holds, false)
  assert.equal(alter((x) => { x.receipt.credits = 121 }).holds, false)
  assert.equal(alter((x) => { x.receipt.sealed = false }).holds, false)
  assert.equal(alter((x) => { x.effective = 124 }).holds, false)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every workflow step is gated on the full capacity, by the theorem's own sentence as Lean states it. */
test('every workflow step is gated on the full capacity, by the theorem\'s own sentence as Lean states it', () => {
  for (const workflow of WORKFLOWS) {
    const w = call('repository', { workflow, facts: {} }).result!.structuredContent as { decision: { rules: { rule: string; theorem: string; holds: boolean | null; evidence: string; says?: string }[] } }
    const rule = w.decision.rules.find((r) => r.rule === 'capacity')
    assert.deepEqual([rule?.holds, rule?.theorem, rule?.evidence], [true, 'textbook_capacity_conserved', '122 + 0 = 122; 122 = 122; 122 = 122'], workflow)
  }
  assert.ok(TEXTBOOK_THEOREMS.some((t) => t.key === 'textbook_capacity_conserved' && /used \+ \(capacity - used\) = capacity/.test(t.lean)))
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the welcome states the capacity in the licence's own words, and the one text states the hardware by the register's own count and no sentence. */
test('the welcome states the capacity in the licence\'s own words, and the one text states the hardware by the register\'s own count and no sentence', () => {
  const init = (handle({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} }) as { result: { serverInfo: { quantumCapacity: Record<string, any> }; instructions: string } }).result
  assert.deepEqual([init.serverInfo.quantumCapacity.free, init.serverInfo.quantumCapacity.left, init.serverInfo.quantumCapacity.full, init.serverInfo.quantumCapacity.gate.holds], [122, 0, true, true])
  assert.ok(init.instructions.includes(`metrics.quantumCapacity: ${JSON.stringify(init.serverInfo.quantumCapacity)}`))
  const readme = readFileSync('README.md', 'utf8'), c = quantumCapacity()
  // what the capacity is to the public is the licence's own words, in metrics and named in the welcome
  assert.deepEqual([c.public.terms, c.public.licence, c.public.deed, c.public.disclaimer], [LICENSE.terms, LICENSE.spdx, LICENSE.deed, LICENSE.disclaimer])
  assert.deepEqual(c.public.doors.map((d) => d.tool), ['fold', 'metrics', 'verify'])
  assert.deepEqual([init.serverInfo.quantumCapacity.public.licence, init.serverInfo.quantumCapacity.public.deed], [LICENSE.spdx, LICENSE.deed])
  // the one text prints no sentence of the register's theorem; its hardware states how many registers its memory holds by the register's own count, and no other qubit figure
  assert.equal(readme.includes(TEXTBOOK_THEOREMS.find((t) => t.key === 'textbook_hexbit_gateway_ftl')!.says), false)
  assert.ok(/\| registersInMemory \| \d+ \|\n\| registerQubitsInMemory \| \d+ \|/.test(readme))
  assert.equal(/stateVectorQubits|willowQubits|sycamoreQubits/.test(readme), false)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the cost to fake is the capacity inverted, and the address alone is stated below the floor the digest beside it meets. */
test('the cost to fake is the capacity inverted, and the address alone is stated below the floor the digest beside it meets', () => {
  const s = quantumCapacity().security
  assert.deepEqual([s.address.bits, s.address.preimage, s.address.collision, s.address.floor, s.address.meetsFloor], [122, { classical: 122, grover: 61 }, { classical: 61, quantum: '122/3' }, 128, false])
  assert.deepEqual([s.digest.bits, s.digest.preimage.grover, s.digest.collision.classical, s.digest.meetsFloor], [256, 128, 128, true])
  // more capacity, more cost: every free bit doubles the tries, and two halve to one under Grover's search
  assert.deepEqual([costToFake(124).address.preimage.grover - costToFake(122).address.preimage.grover, costToFake(256).address.meetsFloor, costToFake(254).address.meetsFloor], [1, true, false])
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: stable is the capacity utilised in full without entropy: a clock in a source is entropy, so time alone makes a tree unstable and its release refused. */
test('stable is the capacity utilised in full without entropy: a clock in a source is entropy, so time alone makes a tree unstable and its release refused', () => {
  const none = stabilityOf({})
  assert.deepEqual([none.stable, none.release, none.capacity.full, none.entropy.leads], [true, 'allowed', true, 0])
  const timed = stabilityOf({ 'src/quantum/processing/pure.ts': 'export const at = () => Date.now()\n' })
  assert.deepEqual([timed.stable, timed.holds, timed.release, timed.capacity.full, timed.entropy.byKind.clock], [false, false, 'refused', true, 1])
  // through the door, as the runner asks: the listing names the sources to read, the files are measured, tests and rendered indexes left out
  const listed = call('repository', { stable: { listing: 'src/quantum/processing/pure.ts\nsrc/quantum/processing/pure_test.ts\nsrc/quantum/uuid/programs/5/9/e/4/9/1/a/4/index.ts\nREADME.md\n' } }).result!.structuredContent
  assert.deepEqual(listed.readList, ['src/quantum/processing/pure.ts', 'src/quantum/uuid/programs/5/9/e/4/9/1/a/4/index.ts'])
  const judged = call('repository', { stable: {}, files: { 'src/quantum/processing/pure.ts': 'export const at = () => Date.now()\n', 'src/quantum/processing/pure_test.ts': 'Date.now()' } }).result!.structuredContent
  assert.deepEqual([judged.stable, judged.entropy.files, judged.entropy.byKind.clock], [false, 1, 1])
  // this tree as it stands, whatever its measure is
  const files = Object.fromEntries(execFileSync('git', ['ls-files', 'src/quantum', 'scripts'], { encoding: 'utf8' }).split('\n').filter(stableSource).map((f) => [f, readFileSync(f, 'utf8')]))
  const now = stabilityOf(files)
  assert.equal(now.stable, now.capacity.full && now.entropy.leads === 0)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: no hand-written program types a figure of the register: its qubits, its formula and a UUID's handle are read from the kernel and the groups Lean states, never written as numbers. */
test('no hand-written program types a figure of the register: its qubits, its formula and a UUID\'s handle are read from the kernel and the groups Lean states, never written as numbers', async () => {
  const { execFileSync } = await import('node:child_process')
  const { readFileSync } = await import('node:fs')
  const { LEAN_REGISTER, handleOf } = await import('../../../../../../../../2/7/1/a/7/6/4/9/index.ts')
  const { THEOREMS } = await import('../../../../../../../../3/f/0/e/7/a/6/f/index.ts')
  // every figure looked for is computed: the register the kernel decided, its formula as Lean states it, and the handle's width from a UUID cut by handleOf
  const formula = THEOREMS.find((t) => t.key === 'textbook_coin_lean_sot')!.statement.split('∧')[0]!.split('=')[0]!.trim()
  const width = handleOf('0123456789abcdef0123456789abcdef').length
  const figure = new RegExp(`(?<![\\w.])${LEAN_REGISTER}(?![\\w.])`), formulaRe = new RegExp(formula.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s*'))
  const cut = new RegExp(`(?:[aA]ddress|[uU]uid|order\\.id)\\.slice\\(0, ?${width}\\)`)
  assert.equal(Number.isInteger(LEAN_REGISTER), true)
  const files = execFileSync('git', ['ls-files', 'src/quantum', 'scripts'], { encoding: 'utf8' }).split('\n').filter((f) => /\.ts$/.test(f) && !/(\.test\.ts|_test\.ts|\.d\.ts)$/.test(f))
  const typed = files.flatMap((f) => {
    const text = readFileSync(f, 'utf8')
    if (text.startsWith('// GENERATED')) return []
    return text.split('\n').flatMap((line, i) => { const code = line.trim(); return !/^(\/\/|\*|\/\*)/.test(code) && (figure.test(code) || formulaRe.test(code) || cut.test(code)) ? [`${f}:${i + 1}`] : [] })
  })
  assert.deepEqual(typed, [])
})
