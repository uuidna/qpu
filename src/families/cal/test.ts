import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { CalFormulas } from './index.js'

/** THE CALENDAR'S DRIFT, EXACT. Every drift is seconds, minutes, days, arcseconds or degrees the calendars gain on the
 *  tropical year Meeus states: the Julian 675 s a year (a day in 128), the Gregorian 27 s (a day in 3200), the lunar
 *  10.875 d, the Metonic cycle ~125 min, the Saros 120° a return, the wheel's precession 50.29″ a year (a gate in
 *  ~403). The astronomical layers (the Sun's speed, the design arc) are bounded by the physics, not fixed. Each value
 *  crosses cal → hd, and a sample is run at its hex address. */
test('cal: every drift holds as the exact value Meeus states, and crosses the lattice at its hex address', async (t) => {
  // the Julian calendar gains 675 s a year on the Sun — a whole day in 128 years
  assert.equal(CalFormulas.julianDrift(1).value, 675)
  assert.equal(CalFormulas.julianDrift(128).value, 86400, 'a day (86 400 s) in 128 years')
  // the Gregorian gains 27 s a year — a day in 3200 years
  assert.equal(CalFormulas.gregorianDrift(1).value, 27)
  assert.equal(CalFormulas.gregorianDrift(3200).value, 86400, 'a day in 3200 years')
  // the years each calendar needs to drift a whole day: 0 = Julian, 1 = Gregorian
  assert.equal(CalFormulas.dayPer(0).value, 128)
  assert.equal(CalFormulas.dayPer(1).value, 3200)
  assert.equal(CalFormulas.dayPer(2).holds, false, 'only two calendars are addressed')
  // the tropical wheel precesses 50.29″ a year
  assert.equal(CalFormulas.precession(1).value, 50)
  assert.equal(CalFormulas.precession(100).value, 5029, '50.29″ · 100')
  // and turns one whole gate (20 250″) against the stars in ~403 years
  assert.equal(CalFormulas.gatesPrecessed(402).value, 0)
  assert.equal(CalFormulas.gatesPrecessed(403).value, 1, 'a gate in 403 years')
  // the Metonic cycle: 235 lunations exceed 19 tropical years by ~2 h 5 min
  assert.equal(CalFormulas.metonicDrift(1).value, 125, '~2 h 5 min a cycle')
  // the lunar year falls 10.875 d behind the tropical year — the Islamic year walks the seasons in ~33.6 years
  assert.equal(CalFormulas.lunarDrift(1).value, 10)
  assert.equal(CalFormulas.lunarDrift(2).value, 21)
  assert.equal(CalFormulas.lunarDrift(33).value, 358, '33 years ≈ 358 d ≈ a whole year behind')
  // the Saros shifts an eclipse 120° west each return, back to the start every third
  assert.equal(CalFormulas.sarosShift(1).value, 120)
  assert.equal(CalFormulas.sarosShift(2).value, 240)
  assert.equal(CalFormulas.sarosShift(3).value, 0, '3 returns close the triple Saros (exeligmos)')
  // the leap day and the Day Out of Time: the two faces the Dreamspell loses
  assert.equal(CalFormulas.leap(2024).value, 1)
  assert.equal(CalFormulas.leap(1900).value, 0, 'divisible by 100, not 400: no leap day')
  assert.equal(CalFormulas.leap(2000).value, 1, 'divisible by 400: a leap day')
  assert.equal(CalFormulas.coin(2024).value, 2, 'a leap year holds both uncounted days')
  assert.equal(CalFormulas.coin(2023).value, 1)
  assert.equal(CalFormulas.pairs(2000, 2024).value, 7, 'seven leap years in [2000, 2024]')
  assert.equal(CalFormulas.pairs(2024, 2000).holds, false, 'a backwards span owes nothing')
  assert.equal(CalFormulas.faces().value, 147, '1 March to 25 July: the two faces are 147 days apart')

  // the astronomical layers are bounded by the physics rather than fixed: the Sun's speed is 0.953–1.019°/day and the
  // design arc of 88° takes 86–93 days, for any birth minute
  const jdm = 2451545 * 1440 // J2000.0, in minutes
  const v = CalFormulas.sunSpeed(jdm)
  assert.equal(v.holds, true)
  assert.ok(v.value >= 953 && v.value <= 1019, `the Sun's speed stays in 0.953–1.019°/day, got ${v.value}`)
  const d = CalFormulas.designDays(jdm)
  assert.equal(d.holds, true)
  assert.ok(d.value > 8600 && d.value < 9300, `88° of solar arc is 86–93 days, got ${d.value / 100}`)

  // the family is exactly its fourteen registered formulas
  assert.equal(qpuHexFamiliesOf().get('cal')?.length, 14)

  // a sample run at its hex address agrees with the formula and holds, with a receipt
  for (const [name, params, expected] of [['julianDrift', [128], 86400], ['lunarDrift', [1], 10], ['sarosShift', [2], 240], ['faces', [], 147]] as [string, number[], number][]) {
    const uuid = qpuHexUuidOf({ family: 'cal', program: [name], params })
    const run = (await qpuHexRunOf(uuid)) as { value?: unknown; holds?: boolean }
    assert.equal(Number(run.value), expected, `cal.${name} at ${uuid}`)
    assert.equal(run.holds, true)
    qpuUuidReceiptOf(`cal ${name}`, qpuContentUuidOf(run), { uuid })
  }
  t.diagnostic('14 formulas; julianDrift(128) = 86 400 s = a day, the drift that crosses cal → hd')
})
