import { qpuFoldOf, qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'
import { randomBytes as qpuRandomBytes } from '../../core/crypt.js'

export interface SecureSignal {
  id: string
  payload: unknown
  dims: number
  hash: string
  verified: boolean
  timestamp: number
}

export interface QuantumKey {
  id: string
  basis: number[]
  bits: number[]
  hash: string
}

export interface SignalPath {
  src: string
  dst: string
  dims: number
  hops: number
  verified: boolean
}

export interface SiftedKey {
  bits: number[]
  raw: number
  sifted: number
  sampled: number
  errors: number
  qber: number
  holds: boolean
}

export const QBER_LIMIT = 0.11

const randomBits = (n: number): number[] => {
  // the unit's own DRBG (core/crypt), never a platform CSPRNG — no external crypto
  const bytes = qpuRandomBytes(Math.ceil(n / 8))
  return Array.from({ length: n }, (_, i) => (bytes[i >> 3]! >> (i & 7)) & 1)
}

const foldBits = (s: string): bigint => BigInt(`0x${qpuFoldOf(s)}`)

const popcount = (x: bigint): number => {
  let c = 0
  for (; x > 0n; x >>= 1n) c += Number(x & 1n)
  return c
}

export const bitsToBytes = (bits: readonly number[]): Uint8Array => {
  const out = new Uint8Array(Math.ceil(bits.length / 8))
  bits.forEach((b, i) => (out[i >> 3]! |= b << (i & 7)))
  return out
}

export class QuantumSecureSignalling {
  static BB84KeyGen(n: number): QuantumKey {
    const bits = randomBits(n)
    const basis = randomBits(n)
    const hash = qpuFoldOf(JSON.stringify({ bits, basis }))
    return { id: `key-${hash}`, bits, basis, hash }
  }

  /** Bob measures every qubit in a random basis; an intercept-resend Eve measures first in hers. Matching bases are kept, a quarter of them is disclosed to estimate the error rate, the rest is the key. */
  static sift(alice: QuantumKey, eve = false): SiftedKey {
    const n = alice.bits.length
    const bob = randomBits(n)
    const eveBasis = eve ? randomBits(n) : []
    const coin = randomBits(2 * n)
    const received = alice.bits.map((bit, i) => {
      let b = bit
      let basis = alice.basis[i]
      if (eve) {
        if (eveBasis[i] !== basis) b = coin[n + i]!
        basis = eveBasis[i]
      }
      return bob[i] === basis ? b : coin[i]!
    })
    const kept = alice.bits.flatMap((_, i) => (bob[i] === alice.basis[i] ? [i] : []))
    const sampled = Math.floor(kept.length / 4)
    const errors = kept.slice(0, sampled).filter((i) => received[i] !== alice.bits[i]).length
    const qber = sampled > 0 ? errors / sampled : 0
    return { bits: kept.slice(sampled).map((i) => alice.bits[i]!), raw: n, sifted: kept.length, sampled, errors, qber, holds: sampled > 0 && qber <= QBER_LIMIT }
  }

  static sign(data: unknown, key: QuantumKey): SecureSignal {
    const hash = qpuFoldOf(JSON.stringify({ payload: data, key: key.hash }))
    return { id: `sig-${hash}`, payload: data, dims: key.bits.length, hash, verified: false, timestamp: Date.now() }
  }

  static verify(sig: SecureSignal, key: QuantumKey): boolean {
    return qpuFoldOf(JSON.stringify({ payload: sig.payload, key: key.hash })) === sig.hash
  }

  static encode(sig: SecureSignal, dims: number): number[] {
    const str = JSON.stringify(sig)
    const encoded: number[] = []
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i)
      for (let d = 0; d < dims; d++) encoded.push((code >> d) & 1)
    }
    return encoded
  }

  static decode(encoded: number[], dims: number): string {
    const chars: string[] = []
    for (let i = 0; i < encoded.length; i += dims) {
      let code = 0
      for (let d = 0; d < dims && i + d < encoded.length; d++) code |= encoded[i + d]! << d
      if (code > 0) chars.push(String.fromCharCode(code))
    }
    return chars.join('')
  }

  /** Hops on the dims-cube between the corners src and dst fold to: their Hamming distance. */
  static route(src: string, dst: string, dims: number): SignalPath {
    const d = Math.max(1, Math.min(64, Math.trunc(dims)))
    const hops = popcount((foldBits(src) ^ foldBits(dst)) & ((1n << BigInt(d)) - 1n))
    return { src, dst, dims, hops, verified: hops <= dims / 2 }
  }

  static fold(signals: SecureSignal[]): string {
    return qpuFoldOf(signals.map((s) => s.hash).join(''))
  }

  static distribute(n: number, dims: number, k: number): Map<string, SecureSignal[]> {
    const dist = new Map<string, SecureSignal[]>()
    for (let i = 0; i < n; i++) {
      const sigs: SecureSignal[] = []
      for (let j = 0; j < k; j++) sigs.push(this.sign({ round: j, node: i }, this.BB84KeyGen(dims)))
      dist.set(`node-${i}`, sigs)
    }
    return dist
  }
}

export const quantumSecureSignalling = new QuantumSecureSignalling()

const nat = (...xs: number[]): boolean => xs.every((x) => Number.isSafeInteger(x) && x >= 0)

/** The BB84 signalling formulas over naturals, sealed like the cross bridges and registered as the hex family `signal`. */
export class SignalFormulas {
  static siftedBits(raw: number): CrossFormula {
    return crossFormulaOf({ id: 'signal-sifted', src: 'qsec', dst: 'qsec', formula: 'sifted = raw / 2', value: raw / 2, proof: 'Bob guesses the basis right half the time' }, nat(raw) && raw > 0, { name: 'signal.siftedBits', params: [raw] })
  }

  static keyBits(raw: number): CrossFormula {
    return crossFormulaOf({ id: 'signal-key', src: 'qsec', dst: 'chat', formula: 'key_bits = 3 * raw / 8', value: (3 * raw) / 8, proof: 'A quarter of the sifted half is disclosed to estimate errors' }, nat(raw) && raw > 0, { name: 'signal.keyBits', params: [raw] })
  }

  static detection(checked: number): CrossFormula {
    return crossFormulaOf({ id: 'signal-detect', src: 'qsec', dst: 'obs', formula: 'p_detect = 1 - (3/4)^checked', value: 1 - 0.75 ** checked, proof: 'Intercept-resend flips each disclosed sifted bit with probability 1/4' }, nat(checked), { name: 'signal.detection', params: [checked] })
  }

  static qber(errors: number, sampled: number): CrossFormula {
    const value = sampled > 0 ? errors / sampled : 0
    return crossFormulaOf({ id: 'signal-qber', src: 'qsec', dst: 'chat', formula: `qber = errors / sampled <= ${QBER_LIMIT}`, value, proof: 'Above the BB84 bound no secret key can be distilled' }, nat(errors, sampled) && sampled > 0 && errors <= sampled && value <= QBER_LIMIT, { name: 'signal.qber', params: [errors, sampled] })
  }

  static hops(dims: number, a: number, b: number): CrossFormula {
    const value = popcount(BigInt((a ^ b) >>> 0) & ((1n << BigInt(Math.min(32, dims))) - 1n))
    return crossFormulaOf({ id: 'signal-hops', src: 'qsec', dst: 'route', formula: 'hops = popcount((a xor b) mod 2^dims)', value, proof: 'A route on the hypercube flips one differing coordinate per hop' }, nat(dims, a, b) && dims > 0 && dims <= 32, { name: 'signal.hops', params: [dims, a, b] })
  }

  static keyspace(bits: number): CrossFormula {
    return crossFormulaOf({ id: 'signal-keyspace', src: 'qsec', dst: 'enterprise', formula: 'keyspace = 2^bits', value: 2 ** bits, proof: 'Every key bit doubles the search' }, nat(bits) && Number.isSafeInteger(2 ** bits), { name: 'signal.keyspace', params: [bits] })
  }
}

for (const name of ['detection', 'hops', 'keyBits', 'keyspace', 'qber', 'siftedBits'] as const)
  qpuHexRegisterOf('signal', name, (SignalFormulas[name] as (...x: unknown[]) => unknown).bind(SignalFormulas))
