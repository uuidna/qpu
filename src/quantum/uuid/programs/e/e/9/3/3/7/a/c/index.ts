// The physical constants as coins: CODATA's table (NIST, open, no key) read into integers — every value a mantissa and a power of ten as
// written — each constant sealed by its content address and SHA-256 with its stated uncertainty kept beside it. A defined constant
// (the Planck constant since 2019) is exact and carries none; a measured one (the Newtonian constant of gravitation) carries the uncertainty
// its experiments give, which no seal and no factoring removes: the seal proves the value is the one published, never that it is truer. Pure.
import { PROSE, proseFill } from '../../../../../../../../5/9/e/4/9/1/a/4/index.ts'
import { uuid } from '../../../../../../../../2/7/1/a/7/6/4/9/index.ts'
import { sha256, utf8, hex } from '../../../../../../../../9/e/8/6/7/0/6/8/index.ts'
import { TABLES } from '../../../../../../../../1/2/a/4/3/2/a/8/index.ts'

/** NIST CODATA allascii table URL — Payload `ATTEST_APIS` id `nist-codata` only (STANDARDS may mirror the contract; code never reads it). */
export const CODATA_URL = String((TABLES.ATTEST_APIS as readonly { id: string; url: string }[]).find((a) => a.id === 'nist-codata')?.url ?? '')
/** A decimal as written in the table ("6.674 30 e-11") as exact integers: mantissa × 10^exponent. */
const getDecimal = (s: string): { mantissa: string; exponent: number } | null => {
  const m = /^(-?)(\d+)(?:\.(\d+))?(?:e([+-]?\d+))?$/.exec(s.replace(/\s+/g, '').replace('...', ''))
  if (!m) return null
  const frac = m[3] ?? ''
  return { mantissa: `${m[1]}${(m[2]! + frac).replace(/^0+(?=\d)/, '')}`, exponent: Number(m[4] ?? 0) - frac.length }
}
type Constant = { quantity: string; value: { mantissa: string; exponent: number }; written: string; exact: boolean; uncertainty: { mantissa: string; exponent: number } | null; unit: string; relativePpb: number | null; address: string; sha256: string }
/** The table read: the rows found below its header, every row a constant with its value and uncertainty as integers, sealed. */
export const listConstants = (text: string) => {
  const lines = text.split('\n')
  const header = lines.find((l) => /Quantity\s+Value\s+Uncertainty\s+Unit/.test(l))
  if (!header) return { adjustment: null, constants: [] as Constant[], says: PROSE.quantumProcessingUnitConstants_says1 }
  const adjustment = /(\d{4}) CODATA adjustment/.exec(text)?.[1] ?? null
  const constants: Constant[] = []
  for (const l of lines.slice(lines.indexOf(header) + 2)) {
    // the header's labels do not sit over their columns (measured: Value at 65, the values at 60), so a row is split where two spaces or more part its fields; single spaces stay inside a value
    if (l.trim().length === 0) continue
    const [quantity = '', written = '', unc = '', unit = ''] = l.trim().split(/\s{2,}/)
    const value = getDecimal(written); if (!quantity || !value) continue
    const exact = unc === '(exact)'
    const uncertainty = exact ? null : getDecimal(unc)
    // the relative uncertainty in parts per billion, from the integers alone: |u| / |v| × 10^9, rounded down
    const abs = (s: string) => BigInt(s.replace('-', '') || '0'), d = uncertainty ? uncertainty.exponent - value.exponent + 9 : 0
    const relativePpb = uncertainty && abs(value.mantissa) > 0n ? Number(d >= 0 ? (abs(uncertainty.mantissa) * 10n ** BigInt(d)) / abs(value.mantissa) : abs(uncertainty.mantissa) / (abs(value.mantissa) * 10n ** BigInt(-d))) : null
    const body = JSON.stringify({ quantity, value, exact, uncertainty, unit, adjustment })
    constants.push({ quantity, value, written, exact, uncertainty, unit, relativePpb, address: uuid(body), sha256: hex(sha256(utf8(body))) })
  }
  return { adjustment, source: CODATA_URL, constants, exact: constants.filter((c) => c.exact).length, measured: constants.filter((c) => !c.exact).length, says: proseFill(PROSE.quantumProcessingUnitConstants_says2, constants.length, adjustment ?? '?', constants.filter((c) => c.exact).length, constants.filter((c) => !c.exact).length) }
}
