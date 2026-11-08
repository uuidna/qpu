// The address functions the website can import without the quantum TypeScript graph.
// Same fold, stamp, and coil addresses as src/quantum/uuid/index.ts and mintTokenCoil.

const OFFSET = [0x2325, 0x8422, 0x9ce4, 0xcbf2]
const foldFrom = ([h0, h1, h2, h3], text) => {
  for (let i = 0; i < text.length; i++) {
    h0 ^= text.charCodeAt(i)
    const t0 = h0 * 0x1b3, t1 = h1 * 0x1b3 + (t0 >>> 16), t2 = h2 * 0x1b3 + (h0 << 8) + (t1 >>> 16)
    h3 = (h3 * 0x1b3 + (h1 << 8) + (t2 >>> 16)) & 0xffff; h0 = t0 & 0xffff; h1 = t1 & 0xffff; h2 = t2 & 0xffff
  }
  return [h0, h1, h2, h3]
}
const hex = (limbs) => limbs.map((l) => l.toString(16).padStart(4, '0')).reverse().join('')
const version = (digits) => { const r = [...digits].reduce((m, d, i) => (i === 12 ? m : (m * 16 + parseInt(d, 16)) % 91), 0); return (1 + ((r ** 7) % 91) % 8).toString(16) }
const dashed = (h) => `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`
export const stamp = (digits) => dashed(`${digits.slice(0, 12)}${version(digits)}${digits.slice(13)}`)
export const uuid = (text) => {
  const state = foldFrom(OFFSET, text)
  const high = hex(state)
  const low = hex(foldFrom(state, '\u0000shape'))
  const variant = ((parseInt(low.slice(0, 1), 16) % 4) + 8).toString(16)
  return stamp(`${high.slice(0, 12)}${high.slice(15, 16)}${high.slice(12, 15)}${variant}${low.slice(1, 4)}${low.slice(4, 16)}`)
}
export const uuidFromParts = (handle, program, tail) => {
  if (!/^[0-9a-f]{8}$/.test(handle) || program.length !== 10 || program.some((n) => !Number.isInteger(n) || n < 0 || n > 15) || !/^[0-9a-f]{12}$/.test(tail)) throw new Error('a handle is 8 hex, a program ten nibbles 0..15, a tail 12 hex')
  const p = program.map((n) => n.toString(16))
  const middle = `${p.slice(0, 4).join('')}0${p.slice(4, 7).join('')}8${p.slice(7, 10).join('')}`
  return stamp(`${handle}${middle}${tail}`)
}
export const seal = (id) => {
  const shape = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id)
  if (!shape) return { valid: false, shape, variant: false, version: { found: '', expected: '', agree: false } }
  const digits = id.replace(/-/g, '')
  const found = digits[12]
  const expected = version(digits)
  const variant = /^[89ab]$/.test(digits[16])
  return { valid: variant && found === expected, shape, variant, version: { found, expected, agree: found === expected } }
}
export const canonicalText = (value) =>
  typeof value === 'bigint' ? `"${value}n"`
    : Array.isArray(value) ? `[${value.map(canonicalText).join(',')}]`
    : value !== null && typeof value === 'object'
      ? typeof value.toJSON === 'function' ? canonicalText(value.toJSON())
        : `{${Object.keys(value).filter((k) => value[k] !== undefined).sort().map((k) => `${JSON.stringify(k)}:${canonicalText(value[k])}`).join(',')}}`
    : typeof value === 'number' && !Number.isFinite(value) ? `"${value}"` : JSON.stringify(value) ?? 'null'
export const compositions = (radices) => radices.reduce((n, r) => n * BigInt(r), 1n)

const parts = (id) => {
  const digits = id.replace(/-/g, '')
  const handle = digits.slice(0, 8)
  const middle = digits.slice(8, 20)
  const tail = digits.slice(20, 32)
  const program = [...middle].filter((_c, i) => i !== 4 && i !== 8).map((c) => parseInt(c, 16))
  return { handle, program, tail }
}
const reflectNibble = (handle, i) => handle.slice(0, i) + (15 - parseInt(handle[i], 16)).toString(16) + handle.slice(i + 1)
const mod8 = (n) => ((Math.trunc(n) % 8) + 8) % 8

/** The coil address and the two reflecting coins. Same three addresses as mintTokenCoil. */
export const tokenCoilAddresses = (seed, pairIndex = 0) => {
  const raw = parts(uuid(`${seed}\n${pairIndex}`))
  const address = uuidFromParts(raw.handle, raw.program, raw.tail)
  const ch = parts(address)
  const i = mod8(pairIndex)
  const j = (i + 1) % 8
  return {
    uuid: address,
    reflecting: [uuidFromParts(reflectNibble(ch.handle, i), ch.program, ch.tail), uuidFromParts(reflectNibble(ch.handle, j), ch.program, ch.tail)],
    pairIndex: i,
  }
}
