// GENERATED from lean/tools/Address.lean by lake run index — do not edit. Lean proves uuid('x')==='af63f54c-8602-8170-8331-b95a7d569506' (native_decide).
const OFFSET = [0x2325, 0x8422, 0x9ce4, 0xcbf2]
const MUL = 0x01b3
const foldFrom = (state: readonly number[], text: string): number[] => {
  let a = state[0]!, b = state[1]!, c = state[2]!, d = state[3]!
  for (let i = 0; i < text.length; i++) {
    a ^= text.charCodeAt(i)
    const t0 = a * MUL, t1 = b * MUL + (t0 >>> 16), t2 = c * MUL + (a << 8) + (t1 >>> 16)
    d = (d * MUL + (b << 8) + (t2 >>> 16)) & 0xffff; a = t0 & 0xffff; b = t1 & 0xffff; c = t2 & 0xffff
  }
  return [a, b, c, d]
}
const hex = (limbs: readonly number[]): string => limbs.map((l) => l.toString(16).padStart(4, '0')).reverse().join('')
const hex1 = (n: number): string => '0123456789abcdef'[n % 16]!
export const version = (digits: string): string => { const r = [...digits].reduce((m, d, i) => (i === 12 ? m : (m * 16 + parseInt(d, 16)) % 91), 0); return hex1(1 + ((r ** 7) % 91) % 8) }
const dashed = (h: string): string => h.slice(0, 8) + '-' + h.slice(8, 12) + '-' + h.slice(12, 16) + '-' + h.slice(16, 20) + '-' + h.slice(20, 32)
export const stamp = (digits: string): string => dashed(digits.slice(0, 12) + version(digits) + digits.slice(13))
export const uuid = (text: string): string => {
  const state = foldFrom(OFFSET, text)
  const high = hex(state)
  const low = hex(foldFrom(state, '\u0000shape'))
  const variant = hex1((parseInt(low.slice(0, 1), 16) % 4) + 8)
  return stamp(high.slice(0, 12) + high.slice(15, 16) + high.slice(12, 15) + variant + low.slice(1, 4) + low.slice(4, 16))
}
