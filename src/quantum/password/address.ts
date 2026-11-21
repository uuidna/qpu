// The address functions, standalone: fold, stamp and coil addresses, without the uuid/index.ts graph.

const OFFSET = [0x2325, 0x8422, 0x9ce4, 0xcbf2]
const foldFrom = ([h0, h1, h2, h3]: readonly number[], text: string) => {
  let a = h0!, b = h1!, c = h2!, d = h3!
  for (let i = 0; i < text.length; i++) {
    a ^= text.charCodeAt(i)
    const t0 = a * 0x1b3, t1 = b * 0x1b3 + (t0 >>> 16), t2 = c * 0x1b3 + (a << 8) + (t1 >>> 16)
    d = (d * 0x1b3 + (b << 8) + (t2 >>> 16)) & 0xffff; a = t0 & 0xffff; b = t1 & 0xffff; c = t2 & 0xffff
  }
  return [a, b, c, d]
}
const hex = (limbs: readonly number[]) => limbs.map((l) => l.toString(16).padStart(4, '0')).reverse().join('')
const version = (digits: string) => { const r = [...digits].reduce((m, d, i) => (i === 12 ? m : (m * 16 + parseInt(d, 16)) % 91), 0); return (1 + ((r ** 7) % 91) % 8).toString(16) }
const dashed = (h: string) => `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`
export const stamp = (digits: string) => dashed(`${digits.slice(0, 12)}${version(digits)}${digits.slice(13)}`)
export const uuid = (text: string) => {
  const state = foldFrom(OFFSET, text)
  const high = hex(state)
  const low = hex(foldFrom(state, '\u0000shape'))
  const variant = ((parseInt(low.slice(0, 1), 16) % 4) + 8).toString(16)
  return stamp(`${high.slice(0, 12)}${high.slice(15, 16)}${high.slice(12, 15)}${variant}${low.slice(1, 4)}${low.slice(4, 16)}`)
}
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
