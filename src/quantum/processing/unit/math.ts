// BigInt mathematical operations: GCD, modular exponentiation, order finding, and factoring.

export const bigGcdOf = (a: bigint, b: bigint): bigint => (b === 0n ? a : bigGcdOf(b, a % b))

export const bigPowModOf = (base: bigint, exp: bigint, mod: bigint): bigint => {
  if (mod === 1n) return 0n
  let result = 1n
  let b = base % mod
  let e = exp
  while (e > 0n) {
    if (e & 1n) result = (result * b) % mod
    e >>= 1n
    b = (b * b) % mod
  }
  return result
}

export const bigLcmOf = (a: bigint, b: bigint): bigint => (a / bigGcdOf(a, b)) * b

export const bigIsOddOf = (n: bigint): boolean => (n & 1n) === 1n

export const bigLog2Of = (n: bigint): number => {
  if (n <= 0n) return -Infinity
  let log = 0
  let x = n
  while (x > 1n) {
    x >>= 1n
    log++
  }
  return log
}

export const bigBitLengthOf = (n: bigint): number => (n === 0n ? 1 : bigLog2Of(n) + 1)

// Order finding via period detection: find the smallest r > 0 where base^r ≡ 1 (mod n)
// Returns { order: r, cur: base^r } or null if order not found within max iterations
export const qpuOrderFindOf = (
  base: bigint,
  mod: bigint,
  maxIterations: number = 10000000
): { order: bigint; cur: bigint } | null => {
  if (base === 0n) return null
  if (mod === 1n) return null

  let cur = base % mod
  let r = 1n
  const start = cur

  for (let i = 0; i < maxIterations; i++) {
    if (cur === 1n) return { order: r, cur }
    cur = (cur * base) % mod
    r++
  }

  return null
}

// Sliced order finding: advance by one hexbit-folder slice
// Returns { order, cur, next, from } where next is the cursor for the next slice
export const qpuOrderSliceOf = (
  base: bigint,
  mod: bigint,
  from: number,
  curState: bigint,
  sliceWidth: number = 8
): { order: bigint | null; cur: bigint; next: number | null; from: number } => {
  let cur = curState
  let r = BigInt(from)
  const sliceSize = 1 << sliceWidth // 2^sliceWidth
  const to = from + sliceSize

  for (let i = from; i < to; i++) {
    if (cur === 1n) {
      return { order: r, cur, next: null, from }
    }
    cur = (cur * base) % mod
    r++
  }

  return { order: null, cur, next: to, from }
}

// Fold a number's bits into hexbit representation (simplified: just count bits)
export const qpuFoldOf = (n: string): string => {
  const value = BigInt(n)
  return `0x${value.toString(16)}`
}
