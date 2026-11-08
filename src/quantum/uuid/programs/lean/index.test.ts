import assert from 'node:assert/strict'
import test from 'node:test'
import { leanPrograms } from './index.ts'

test('every quantum lean module is one uuid program and the next step rotates it', () => {
  const programs = leanPrograms()
  assert.equal(programs.holds, true)
  assert.equal(programs.written, false)
  assert.equal(programs.fetched, false)
  assert.equal(programs.executed, false)
  assert.equal(programs.via, 'lean')
  const names = programs.rows.map((row) => row.module)
  for (const module of ['Qpu', 'Qpu.Shor', 'Qpu.Textbook', 'Qpu.Leads.ProgramSynthesis']) assert.equal(names.includes(module), true)
  assert.equal(new Set(names).size, programs.modules)
  for (const row of programs.rows) {
    assert.equal(row.present, true)
    assert.equal(row.depth, 7)
    assert.equal(row.places, 10)
    assert.equal(row.aspects, 4)
    assert.equal(row.kept, true)
    assert.equal(row.back, true)
    assert.equal(row.around, true)
    assert.equal(row.sealed, true)
    assert.equal(row.witnessed, true)
    assert.equal(row.rotated, row.program.slice(1) + row.program[0])
    assert.equal(row.handle, row.address.slice(0, 8))
    assert.equal(row.next.slice(0, 8), row.handle)
  }
  assert.equal(/[0-9a-f]{8}-[0-9a-f]{4}-/.test(programs.says), false)
})
