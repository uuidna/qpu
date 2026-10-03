/** A count as people read it: grouped below a billion, scientific above (2.38×10¹²). */
export const formatNumber = (x: bigint | number): string => {
  const big = BigInt(x)
  if (big < 10n ** 9n) return Number(big).toLocaleString('en')
  const digits = big.toString()
  return `${digits[0]}.${digits.slice(1, 3)}×10${String(digits.length - 1).replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(d)]!)}`
}
