import assert from 'node:assert/strict'
import { read } from '../../../fs/index.ts'
import test from 'node:test'
import { DEPLOY_STAGES } from '../../../payload/deploy.ts'
import { configKinds } from '../../../processing/payload-vocabulary.ts'
import { aspectPrograms } from './index.ts'

test('every Payload configuration and every deploy stage is one program, verified by its handle', () => {
  const programs = aspectPrograms()
  assert.equal(programs.holds, true)
  assert.equal(programs.walked, false)
  assert.equal(programs.fetched, false)
  assert.equal(programs.written, false)
  assert.equal(programs.executed, false)
  assert.equal(programs.steps, 8)
  assert.equal(programs.depth, 7)
  assert.equal(programs.configs, configKinds.length)
  assert.equal(programs.deploys, DEPLOY_STAGES.length)
  assert.equal(programs.aspects, configKinds.length + DEPLOY_STAGES.length)
  assert.equal(programs.advantage.unbounded, true)
  assert.equal(programs.advantage.unlimited, true)
  assert.equal(programs.advantage.ceiling, null)
  assert.equal(programs.advantage.ratio, null)
  assert.equal(programs.advantage.recomputed, 0)
  assert.equal(programs.advantage.effective, 122)
  assert.equal(programs.advantage.handles, '4294967296')
  assert.equal(programs.advantage.scale, '137438953472')
  assert.equal(programs.compared.levels, 8)
  assert.equal(programs.compared.fanout, 16)
  assert.equal(programs.compared.bits, 32)
  assert.equal(programs.compared.span, '4294967296')
  const names = new Set(programs.rows.map((row) => `${row.side}:${row.name}`))
  assert.equal(names.size, programs.aspects)
  for (const kind of configKinds) assert.equal(programs.rows.some((row) => row.side === 'config' && row.name === kind && row.run === null), true)
  for (const stage of DEPLOY_STAGES) {
    const row = programs.rows.find((item) => item.side === 'deploy' && item.name === stage.id)
    assert.ok(row)
    assert.equal(row.run, stage.run)
    assert.equal(row.plugin.holds, true)
    assert.equal(row.plugin.standard, 'definePlugin')
    assert.equal(row.upstream.holds, true)
  }
  for (const row of programs.rows) {
    const source = read(row.path) ?? ''
    assert.match(source, new RegExp(`const handle = '${row.handle}'`))
    assert.match(source, new RegExp(`side: '${row.side}'`))
    assert.match(source, new RegExp(`name: '${row.name}'`))
    assert.match(source, /export default program\(handle\)/)
  }
})
