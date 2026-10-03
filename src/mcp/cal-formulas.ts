import { qpuHexRegisterOf } from '../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from './cross-domain-formulas.js'
import { designJdOf, sunLongitudeOf } from './hd-formulas.js'

/** THE CALENDAR'S DRIFT, CROSSED INTO THE WHEEL. A Human Design chart is read off the tropical ecliptic at an instant;
 *  the instant comes from a calendar, and calendars drift. The Julian year (365.25 d) runs 11 min 14 s a year ahead of
 *  the tropical year (365.2422 d): a day in 128 years, which Meeus' B = 2 − A + ⌊A/4⌋ corrects for the Gregorian
 *  calendar (365.2425 d, 27 s a year, a day in 3200 years). The wheel is tropical, so it precesses against the stars
 *  at 50.29″ a year: a gate (360/64° = 20250″) in ~403 years. And the Sun's speed varies between 0.953 and 1.019°/day,
 *  so the design layer's 88° of solar arc is 86 to 93 days before birth (88/1.019 to 88/0.953), never a fixed count of days. Registered as
 *  the hex family `cal`; every value is exact in seconds, arcseconds or minutes. */

const TROPICAL = 31556925 // seconds in the mean tropical year (365.24219 d)
const JULIAN = 31557600 // 365.25 d
const GREGORIAN = 31556952 // 365.2425 d
const PRECESSION = 5029 // hundredths of an arcsecond per year (50.29″)
const GATE_ARCSEC = (360 / 64) * 3600 // 20250″
const MINUTES = 1440
const PROOF = 'Meeus, Astronomical Algorithms ch. 7 (calendar), 21 (precession), 25 (Sun); the Rave wheel is tropical'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const f = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[]): CrossFormula =>
  crossFormulaOf({ id, src: 'cal', dst: 'hd', formula, value, proof: PROOF }, holds, { name: `cal.${name}`, params })

export class CalFormulas {
  /** The Julian calendar's drift against the Sun after n years, in seconds (675 s a year: a day in 128 years). */
  static julianDrift(years: number): CrossFormula { return f('cal-julian-drift', 'drift_J(n) = n · (365.25 d − tropical year) = 675 s · n', (JULIAN - TROPICAL) * years, nat(years), 'julianDrift', [years]) }
  /** The Gregorian calendar's drift after n years, in seconds (27 s a year: a day in 3200 years). */
  static gregorianDrift(years: number): CrossFormula { return f('cal-gregorian-drift', 'drift_G(n) = n · (365.2425 d − tropical year) = 27 s · n', (GREGORIAN - TROPICAL) * years, nat(years), 'gregorianDrift', [years]) }
  /** Years until a calendar has drifted a whole day: 128 Julian, 3200 Gregorian (0 = Julian, 1 = Gregorian). */
  static dayPer(calendar: number): CrossFormula { return f('cal-day-per', 'dayPer(c) = ⌊86400 / (year_c − tropical)⌋', Math.floor(86400 / ((calendar === 0 ? JULIAN : GREGORIAN) - TROPICAL)), nat(calendar) && calendar <= 1, 'dayPer', [calendar]) }
  /** Precession of the tropical wheel against the stars after n years, in arcseconds. */
  static precession(years: number): CrossFormula { return f('cal-precession', 'p(n) = 50.29″ · n', Math.round((PRECESSION * years) / 100), nat(years), 'precession', [years]) }
  /** How many whole gates the tropical wheel has turned against the stars after n years: one per ~403 years. */
  static gatesPrecessed(years: number): CrossFormula { return f('cal-gates-precessed', 'gates(n) = ⌊50.29″ · n / 20250″⌋', Math.floor((PRECESSION * years) / 100 / GATE_ARCSEC), nat(years), 'gatesPrecessed', [years]) }
  /** The Sun's apparent speed at a birth minute, in thousandths of a degree per day (953 at aphelion, 1019 at perihelion). */
  static sunSpeed(jdm: number): CrossFormula {
    const jd = jdm / MINUTES
    const a = sunLongitudeOf(jd - 0.5), b = sunLongitudeOf(jd + 0.5)
    return f('cal-sun-speed', 'v(jdm) = λ(jd + ½) − λ(jd − ½), in 0.001°/day', Math.round((((b - a) % 360) + 360) % 360 * 1000), nat(jdm) && jdm > 0, 'sunSpeed', [jdm])
  }
  /** The days between a birth minute and its design minute (88° of solar arc): 86 to 93, by the Sun's speed. */
  static designDays(jdm: number): CrossFormula {
    const jd = jdm / MINUTES
    const days = jd - designJdOf(jd)
    return f('cal-design-days', 'd(jdm) = jd − design(jd), the days 88° of solar arc took', Math.round(days * 100), nat(jdm) && jdm > 0 && days > 86 && days < 93, 'designDays', [jdm])
  }
  /** The pure combinations of a chart of n bodies: 64ⁿ gate placements (exact while it fits a number, n ≤ 8). */
  static combinations(bodies: number): CrossFormula { return f('cal-combinations', 'C(n) = 64ⁿ', bodies <= 8 ? 64 ** bodies : 0, nat(bodies) && bodies <= 8, 'combinations', [bodies]) }
  /** The information of a chart of n bodies, in bits: 6 per gate, plus log₂ 6 per line. */
  static bits(bodies: number): CrossFormula { return f('cal-bits', 'bits(n) = n · (6 + log₂ 6), rounded', Math.round(bodies * (6 + Math.log2(6))), nat(bodies), 'bits', [bodies]) }
}

for (const name of ['bits', 'combinations', 'dayPer', 'designDays', 'gatesPrecessed', 'gregorianDrift', 'julianDrift', 'precession', 'sunSpeed'] as const)
  qpuHexRegisterOf('cal', name, (CalFormulas[name] as (...x: unknown[]) => unknown).bind(CalFormulas))
