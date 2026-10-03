import { test } from '../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { courtReceipt, lawful, fidelity, standing, uuidField, court } from './index.js'

/** The MCP court as Payload hooks: usable in a collection config. The hooks are backed by the law family — a receipt and
 *  standing on every write, fidelity as a measure, the safety floor as the one opt-in refusal. */
test('hooks: the court is usable in payload configs — receipt, fidelity, standing, and the safety floor', async () => {
  // courtReceipt stamps a content UUID and is tamper-evident: a different doc gets a different UUID
  const hook = courtReceipt() as (a: unknown) => Promise<{ uuid: string }> | { uuid: string }
  const ctx = (data: Record<string, unknown>) => ({ data, operation: 'create' as const, collection: { slug: 'docs-feedback' } as unknown as { slug: string } })
  const a = await hook(ctx({ path: '/a', helpful: true }) as never) as { uuid: string }
  const b = await hook(ctx({ path: '/b', helpful: true }) as never) as { uuid: string }
  assert.match(a.uuid, /^[0-9a-f-]{36}$/, 'the write carries a content UUID')
  assert.notEqual(a.uuid, b.uuid, 'a different doc gets a different UUID — tamper-evident')
  const a2 = await hook(ctx({ path: '/a', helpful: true }) as never) as { uuid: string }
  assert.equal(a.uuid, a2.uuid, 'the same doc gets the same UUID — deterministic')

  // fidelity: 1 when the order was computed as asked, 0 when redirected
  const fid = fidelity('ordered', 'computed') as (a: unknown) => { fidelity: number }
  assert.equal(fid({ data: { ordered: 14, computed: 14 } } as never).fidelity, 1, 'order kept')
  assert.equal(fid({ data: { ordered: 14, computed: 9 } } as never).fidelity, 0, 'order redirected')

  // the safety floor: lawful refuses a write marked harmful, passes a clean one
  const floor = lawful('harm') as (a: unknown) => unknown
  assert.doesNotThrow(() => floor({ data: { harm: 0 } } as never), 'lawful exploration passes')
  assert.throws(() => floor({ data: { harm: 1 } } as never), /safety floor/, 'genuine harm is refused')

  // standing: the public reads only published, the author reads all
  assert.deepEqual(standing({ req: {} } as never), { _status: { equals: 'published' } }, 'public: published only')
  assert.equal(standing({ req: { user: { id: 1 } } } as never), true, 'author: standing')

  assert.equal((uuidField as { name?: string }).name, 'uuid')
  assert.equal(typeof court.courtReceipt, 'function')
})
