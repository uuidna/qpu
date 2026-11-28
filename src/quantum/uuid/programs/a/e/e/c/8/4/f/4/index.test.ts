// The capacity the abstract states is the capacity the code builds and the kernel proves: the register uuidQubits makes, the statements
// Lean holds of it, the computer its quantum doors make, every copy of the one text, the device receipt and the metrics door agree.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { uuidQubits } from '../../../../../../../../2/7/1/a/7/6/4/9/index.ts'
import { THEOREMS } from '../../../../../../../../3/f/0/e/7/a/6/f/index.ts'
import { RECEIPT_DEVICE, RECEIPT_TEXT } from '../../../../../../../../2/b/c/0/d/1/3/d/index.ts'
import { receiptBody } from '../../../../../../../../c/6/6/e/6/f/2/6/index.ts'
import { teleportProof } from '../../../../../../../../b/1/c/2/3/6/2/1/index.ts'
import { EXAMPLES } from '../../../../../../../../9/d/4/f/e/4/4/2/index.ts'
import { call } from '../../../../../../../../3/8/5/9/0/2/0/f/index.ts'

const statement = (key: string) => THEOREMS.find((t) => t.key === key)!.statement
const register = uuidQubits(4), { digits, hexbit: width, version, variant, effective: qubits } = register
const programs = Number(/= (\d+)$/.exec(statement('Qpu.Verify.Uuid.program_capacity'))![1]), programQubits = Math.log2(programs), bytes = (digits * width) / 8
const doors = ['algorithm', 'circuit', 'processor', 'quantum-error-correction', 'echo'], computer = EXAMPLES.filter((e) => doors.includes(e.tool))
const copies = [['README.md', readFileSync('README.md', 'utf8')], ['src/quantum/README.md', readFileSync('src/quantum/README.md', 'utf8')], ['RECEIPT_TEXT', RECEIPT_TEXT], ['.zenodo.json', (JSON.parse(readFileSync('.zenodo.json', 'utf8')) as { description: string }).description]] as const

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the register the code builds is the register the kernel proves. */
test('the register the code builds is the register the kernel proves', () => {
  assert.equal(digits * width - version - variant, qubits)
  assert.equal(register.effective, qubits)
  assert.ok(statement('Qpu.Verify.Uuid.free_is_122').endsWith(`= ${qubits}`))
  assert.ok(statement('Config.coin_qubit_space').includes(`hexbit = ${width}`))
  assert.equal(2 ** programQubits, programs)
  assert.ok(programQubits < qubits)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every copy of the one text states that capacity in its abstract. */
test('every copy of the one text states that capacity in its abstract', () => {
  const sentence = `One UUID is a register of ${digits} hexbits of ${width} qubits, less ${version} version and ${variant} variant qubits: ${qubits} qubits in ${bytes} bytes`
  const bands = `Its high ${programQubits} qubits address ${programs} hexbit programs and its low ${qubits - programQubits} carry the message`
  for (const [where, text] of copies) for (const part of [sentence, bands]) assert.ok(text.includes(part), `${where}: ${part}`)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the computer the abstract defines is every worked example of the quantum doors, each named by a theorem the kernel holds and holding now. */
test('the computer the abstract defines is every worked example of the quantum doors, each named by a theorem the kernel holds and holding now', () => {
  assert.ok(computer.length > 0)
  for (const e of computer) { assert.ok(THEOREMS.some((t) => t.key === e.theorem), `${e.id}: ${e.theorem}`); assert.equal(e.expect(call(e.tool, e.arguments).result?.structuredContent), null, e.id) }
  const listed = `${computer.length} worked examples across ${doors.length} doors`
  for (const [where, text] of copies) { assert.ok(text.includes(listed), where); for (const e of computer) assert.ok(text.includes(e.id), `${where}: ${e.id}`) }
  const made = EXAMPLES.filter((e) => e.made)
  for (const [where, text] of copies) assert.ok(text.includes(`${made.length} of the worked examples were made by the build itself`), where)
  assert.equal(teleportProof().holds, true)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the device receipt counts the machine at that capacity, and the metrics door conserves it. */
test('the device receipt counts the machine at that capacity, and the metrics door conserves it', () => {
  const facts = receiptBody((RECEIPT_DEVICE as { additionalProperty: unknown }).additionalProperty) as Record<string, number>
  assert.deepEqual([facts.registerQubits, facts.registerBytes], [qubits, bytes])
  assert.equal(facts.registersInMemory, Math.floor(facts.memoryBytes! / bytes))
  assert.equal(facts.registerQubitsInMemory, facts.registersInMemory! * qubits)
  const capacity = (call('metrics', {}).result!.structuredContent as { quantumCapacity: { register: { free: number }; left: number; gate: { holds: boolean } } }).quantumCapacity
  assert.deepEqual([capacity.register.free, capacity.left, capacity.gate.holds], [qubits, 0, true])
})
