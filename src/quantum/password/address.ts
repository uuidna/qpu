// The address functions. The fold/stamp/uuid core is generated from Lean (lean/tools/Address.lean → address-core.ts),
// where the kernel proves it reproduces the JavaScript; the coil functions below build on it.
import { uuid, stamp, version } from './address-core.ts'
export { uuid, stamp }
export const uuidFromParts = (handle: string, program: readonly number[], tail: string) => {
  if (!/^[0-9a-f]{8}$/.test(handle) || program.length !== 10 || program.some((n) => !Number.isInteger(n) || n < 0 || n > 15) || !/^[0-9a-f]{12}$/.test(tail)) throw new Error('a handle is 8 hex, a program ten nibbles 0..15, a tail 12 hex')
  const p = program.map((n) => n.toString(16))
  const middle = `${p.slice(0, 4).join('')}0${p.slice(4, 7).join('')}8${p.slice(7, 10).join('')}`
  return stamp(`${handle}${middle}${tail}`)
}
export const seal = (id: string) => {
  const shape = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id)
  if (!shape) return { valid: false, shape, variant: false, version: { found: '', expected: '', agree: false } }
  const digits = id.replace(/-/g, '')
  const found = digits[12]!
  const expected = version(digits)
  const variant = /^[89ab]$/.test(digits[16]!)
  return { valid: variant && found === expected, shape, variant, version: { found, expected, agree: found === expected } }
}
export const canonicalText = (value: unknown): string =>
  typeof value === 'bigint' ? `"${value}n"`
    : Array.isArray(value) ? `[${value.map(canonicalText).join(',')}]`
    : value !== null && typeof value === 'object'
      ? typeof (value as { toJSON?: unknown }).toJSON === 'function' ? canonicalText((value as { toJSON: () => unknown }).toJSON())
        : `{${Object.keys(value as object).filter((k) => (value as Record<string, unknown>)[k] !== undefined).sort().map((k) => `${JSON.stringify(k)}:${canonicalText((value as Record<string, unknown>)[k])}`).join(',')}}`
    : typeof value === 'number' && !Number.isFinite(value) ? `"${value}"` : JSON.stringify(value) ?? 'null'
export const compositions = (radices: readonly (number | bigint)[]) => radices.reduce<bigint>((n, r) => n * BigInt(r), 1n)

const parts = (id: string) => {
  const digits = id.replace(/-/g, '')
  const program = [...digits.slice(8, 20)].filter((_c, i) => i !== 4 && i !== 8).map((c) => parseInt(c, 16))
  return { handle: digits.slice(0, 8), program, tail: digits.slice(20, 32) }
}
const reflectNibble = (handle: string, i: number) => handle.slice(0, i) + (15 - parseInt(handle[i]!, 16)).toString(16) + handle.slice(i + 1)
const mod8 = (n: number) => ((Math.trunc(n) % 8) + 8) % 8

/** The coil address and its two reflecting coins (as mintTokenCoil). */
export const tokenCoilAddresses = (seed: string, pairIndex = 0) => {
  const raw = parts(uuid(`${seed}\n${pairIndex}`))
  const address = uuidFromParts(raw.handle, raw.program, raw.tail)
  const ch = parts(address)
  const i = mod8(pairIndex), j = (i + 1) % 8
  return {
    uuid: address,
    reflecting: [uuidFromParts(reflectNibble(ch.handle, i), ch.program, ch.tail), uuidFromParts(reflectNibble(ch.handle, j), ch.program, ch.tail)],
    pairIndex: i,
  }
}
