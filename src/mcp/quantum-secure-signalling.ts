function fnv1a(s: string): string {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)
    h = h >>> 0
  }
  return h.toString(16)
}

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

export class QuantumSecureSignalling {
  static BB84KeyGen(n: number): QuantumKey {
    const bits = Array.from({ length: n }, () => Math.random() > 0.5 ? 1 : 0)
    const basis = Array.from({ length: n }, () => Math.random() > 0.5 ? 1 : 0)
    const hash = fnv1a(JSON.stringify({ bits, basis }))
    return { id: `key-${Date.now()}`, bits, basis, hash }
  }

  static sign(data: unknown, key: QuantumKey): SecureSignal {
    const payload = data
    const dims = key.bits.length
    const hash = fnv1a(JSON.stringify({ payload, key: key.hash }))
    return { id: `sig-${Date.now()}`, payload, dims, hash, verified: false, timestamp: Date.now() }
  }

  static verify(sig: SecureSignal, key: QuantumKey): boolean {
    const recompute = fnv1a(JSON.stringify({ payload: sig.payload, key: key.hash }))
    return recompute === sig.hash
  }

  static encode(sig: SecureSignal, dims: number): number[] {
    const str = JSON.stringify(sig)
    const encoded: number[] = []
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i)
      for (let d = 0; d < dims; d++) {
        encoded.push((code >> d) & 1)
      }
    }
    return encoded
  }

  static decode(encoded: number[], dims: number): string {
    const chars: string[] = []
    for (let i = 0; i < encoded.length; i += dims) {
      let code = 0
      for (let d = 0; d < dims && i + d < encoded.length; d++) {
        code |= (encoded[i + d] << d)
      }
      if (code > 0) chars.push(String.fromCharCode(code))
    }
    return chars.join('')
  }

  static route(src: string, dst: string, dims: number): SignalPath {
    const hops = Math.ceil(Math.random() * dims)
    const verified = hops <= dims / 2
    return { src, dst, dims, hops, verified }
  }

  static fold(signals: SecureSignal[]): string {
    const hashes = signals.map(s => s.hash).join('')
    return fnv1a(hashes)
  }

  static distribute(n: number, dims: number, k: number): Map<string, SecureSignal[]> {
    const dist = new Map<string, SecureSignal[]>()
    for (let i = 0; i < n; i++) {
      const nodeId = `node-${i}`
      const sigs: SecureSignal[] = []
      for (let j = 0; j < k; j++) {
        const key = this.BB84KeyGen(dims)
        const sig = this.sign({ round: j, node: i }, key)
        sigs.push(sig)
      }
      dist.set(nodeId, sigs)
    }
    return dist
  }
}

export const quantumSecureSignalling = new QuantumSecureSignalling()
