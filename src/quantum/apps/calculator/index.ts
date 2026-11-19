// The calculator. Division by zero is total, as the kernel states it (textbook_div_zero):
// x / 0 = 0 and x % 0 = x for every number, and (x / 0) · 0 = x only when x = 0.

const div = (x: bigint, y: bigint) => y === 0n ? 0n : x / y

const mod = (x: bigint, y: bigint) => y === 0n ? x : x % y

const mul = (x: bigint, y: bigint) => x * y

const add = (x: bigint, y: bigint) => x + y

const natSub = (x: bigint, y: bigint) => { const d = x - y; return d < 0n ? 0n : d }

const pow = (x: bigint, y: bigint) => x ** y

/** x / y, total at y = 0. The quotient is 0, the remainder is x, and the quotient times the divisor is x only when x is 0. */
const divide = (x: bigint, y: bigint) => {
  const value = div(x, y)
  const remainder = mod(x, y)
  const back = mul(value, y)
  return { x, y, value, remainder, inverse: back === x, recovered: add(back, remainder) === x, total: true, theorem: 'textbook_div_zero' as const }
}

const apply = (x: bigint, op: string, y: bigint) => op === '+' ? add(x, y) : op === '-' ? natSub(x, y) : op === '*' ? mul(x, y) : op === '/' ? div(x, y) : op === '%' ? mod(x, y) : op === '^' ? pow(x, y) : null

const calculate = (x: bigint, op: string, y: bigint) => {
  const value = apply(x, op, y)
  if (value === null) throw new Error(`unread operator ${op}`)
  const byZero = (op === '/' || op === '%') && y === 0n
  return byZero ? { ...divide(x, y), op, value } : { x, y, op, value, inverse: true, recovered: true, total: true, theorem: null }
}

const calculator = { div, mod, mul, add, natSub, pow, divide, calculate }

export { calculator, div, mod, mul, add, natSub, pow, divide, calculate }
export default calculator
