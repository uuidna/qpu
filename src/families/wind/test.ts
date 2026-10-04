import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { WindFormulas } from './index.js'
import '../../mcp/families.js'

test('wind: power, capacity, sweptarea, tipspeed, betz, cutinspeed, turbulence, availability — crossing to energy', async (t) => {
  assert.equal(WindFormulas.power(100, 10).value, 50, 'cube of wind speed over a swept area')
  assert.equal(WindFormulas.capacity(35, 100).value, 35, 'capacity factor')
  assert.equal(WindFormulas.sweptarea(10).value, 314)
  assert.equal(WindFormulas.tipspeed(15, 40).value, 6, 'blade tip speed')
  assert.equal(WindFormulas.betz(59, 100).value, 59, 'Betz share')
  assert.equal(WindFormulas.cutinspeed(3).value, 3)
  assert.equal(WindFormulas.turbulence(15, 100).value, 15)
  assert.equal(WindFormulas.availability(999, 1000).value, 99)
  assert.equal(WindFormulas.power(100, 10).dst, 'energy')
  assert.equal(qpuHexFamiliesOf().get('wind')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'wind', program: ['capacity'], params: [35, 100] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 35, `wind.capacity at ${uuid}`)
  qpuUuidReceiptOf('wind capacity', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; power 50, capacity 35, sweptarea 314, tipspeed 6, betz 59, cutinspeed 3, turbulence 15, availability 99; crossing to energy')
})
