// The physical constants as coins: CODATA's table (NIST, open, no key) read into integers — every value a mantissa and a power of ten, so
// nothing is rounded — each constant sealed by its content address and SHA-256 with its stated uncertainty kept beside it. A defined constant
// (the Planck constant since 2019) is exact and carries none; a measured one (the Newtonian constant of gravitation) carries the uncertainty
// its experiments give, which no seal and no factoring removes: the seal proves the value is the one published, never that it is truer. Pure.
import { uuidOf } from './blocks.ts'
import { sha256, utf8, hex } from './hmac.ts'

export const CODATA_URL = 'https://physics.nist.gov/cuu/Constants/Table/allascii.txt'
/** A decimal as written in the table ("6.674 30 e-11") as exact integers: mantissa × 10^exponent. */
const decimalOf = (s: string): { mantissa: string; exponent: number } | null => {
  const m = /^(-?)(\d+)(?:\.(\d+))?(?:e([+-]?\d+))?$/.exec(s.replace(/\s+/g, '').replace(/\.\.\.$/, ''))
  if (!m) return null
  const frac = m[3] ?? ''
  return { mantissa: `${m[1]}${(m[2]! + frac).replace(/^0+(?=\d)/, '')}`, exponent: Number(m[4] ?? 0) - frac.length }
}
type Constant = { quantity: string; value: { mantissa: string; exponent: number }; written: string; exact: boolean; uncertainty: { mantissa: string; exponent: number } | null; unit: string; relativePpb: number | null; address: string; sha256: string }
/** The table read: the rows found below its header, every row a constant with its value and uncertainty as integers, sealed. */
export const constantsOf = (text: string) => {
  const lines = text.split('\n')
  const header = lines.find((l) => /Quantity\s+Value\s+Uncertainty\s+Unit/.test(l))
  if (!header) return { adjustment: null, constants: [] as Constant[], says: 'no table header: the page changed or was not read' }
  const adjustment = /(\d{4}) CODATA adjustment/.exec(text)?.[1] ?? null
  const constants: Constant[] = []
  for (const l of lines.slice(lines.indexOf(header) + 2)) {
    // the header's labels do not sit over their columns (measured: Value at 65, the values at 60), so a row is split where two spaces or more part its fields; single spaces stay inside a value
    if (l.trim().length === 0) continue
    const [quantity = '', written = '', unc = '', unit = ''] = l.trim().split(/\s{2,}/)
    const value = decimalOf(written); if (!quantity || !value) continue
    const exact = unc === '(exact)'
    const uncertainty = exact ? null : decimalOf(unc)
    // the relative uncertainty in parts per billion, from the integers alone: |u| / |v| × 10^9, rounded down
    const abs = (s: string) => BigInt(s.replace('-', '') || '0'), d = uncertainty ? uncertainty.exponent - value.exponent + 9 : 0
    const relativePpb = uncertainty && abs(value.mantissa) > 0n ? Number(d >= 0 ? (abs(uncertainty.mantissa) * 10n ** BigInt(d)) / abs(value.mantissa) : abs(uncertainty.mantissa) / (abs(value.mantissa) * 10n ** BigInt(-d))) : null
    const body = JSON.stringify({ quantity, value, exact, uncertainty, unit, adjustment })
    constants.push({ quantity, value, written, exact, uncertainty, unit, relativePpb, address: uuidOf(body), sha256: hex(sha256(utf8(body))) })
  }
  return { adjustment, source: CODATA_URL, constants, exact: constants.filter((c) => c.exact).length, measured: constants.filter((c) => !c.exact).length, says: `${constants.length} constants of the ${adjustment ?? '?'} CODATA adjustment as integers, each sealed: ${constants.filter((c) => c.exact).length} exact by definition, ${constants.filter((c) => !c.exact).length} measured with their stated uncertainty kept; a seal proves a value is the one published, never that it is truer` }
}
