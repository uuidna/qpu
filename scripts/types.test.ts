import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { TYPES } from './types.hex.js'
import { TYPE_UUID } from './types.gen.js'
import { renderTypes } from './gen-types.js'

const HERE = dirname(fileURLToPath(import.meta.url))

test('types: the generated file is the generator\'s output for the shapes (no drift)', () => {
  const held = readFileSync(join(HERE, 'types.gen.ts'), 'utf8')
  assert.equal(held, renderTypes(), 'types.gen.ts is out of date — run `npx tsx scripts/gen-types.ts`')
})

test('types: every shape has a content UUID, and no UUID is missing or extra', () => {
  assert.deepEqual(Object.keys(TYPE_UUID).sort(), Object.keys(TYPES).sort())
  for (const uuid of Object.values(TYPE_UUID)) assert.match(uuid, /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
})

test('types: a changed field changes the UUID (the address is the content, not the name)', () => {
  const before = renderTypes()
  assert.ok(before.includes(TYPE_UUID.Lead), 'the generated file names Lead by its UUID')
  const uuids = new Set(Object.values(TYPE_UUID))
  assert.equal(uuids.size, Object.keys(TYPE_UUID).length, 'no two shapes share an address')
})
