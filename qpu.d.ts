/** Public QPU. Constructors live in the JS. Inferred .d.ts is not the npm types. */
export declare function qpuMcpOf(): {
  tools: readonly { name: string }[]
  holds: boolean
  origin: string
  href: string
}
export declare function qpuMcpCallOf(name: string, args?: Record<string, unknown>): Promise<unknown>
export declare function qpuQuantumOf(): {
  holds: boolean
  fused: number
  next: number
  faces: ReturnType<typeof qpuFacesOf>
  cube: ReturnType<typeof qpuCubeOf>
  circuit: { register: { qubits: number } }
}
export declare function qpuLeanOf(): { holds: boolean; src: string }
export declare function qpuProveOf(): { holds: boolean }
export declare function qpuReadmeOf(): string
/** The Payload database QPU declares — one source, read by the Payload side, never restated there. */
export declare function qpuPayloadDbOf(): {
  key: string
  href: string
  collections: readonly string[]
  seed: number
  remainder: number
  unity: boolean
  holds: boolean
}
export declare function qpuPayloadDbHolds(p?: ReturnType<typeof qpuPayloadDbOf>): boolean
/** The tenant zone QPU serves and its reserved labels — one source, read by the Payload side, never restated there. */
export declare function qpuTenantZoneOf(): { zone: string; own: string; www: 'www'; reserved: readonly string[] }
export declare function qpuTenantZoneHolds(z?: ReturnType<typeof qpuTenantZoneOf>): boolean
export declare function qpuHybridOf(): { speed: number; cost: number; layers: number; holds: boolean }
export declare function qpuCoilOf(): { coins: number; rays: number; coil: number; faces: number; holds: boolean }
export declare function qpuCapacityOf(): { fused: number; next: number; amplitudes: number; bits: number; holds: boolean }

/** THE LATTICE ITSELF, so a consumer derives from it rather than restating it.
 *
 * The Payload site carried ninety-six lengths and colours typed into a stylesheet, and every one was already a
 * quantity named here — 18 is mintOf(hexbit) + coins, 64 is mintOf(n + n), 1024 is mintOf(ten), white is
 * mintOf(vertices) - seed. It could not read them: this file declared thirteen of the unit's exports, and none of
 * the three that carry the geometry. A consumer that cannot see the lattice has no choice but to copy it. */
export declare const mintOf: (k: number) => number
export declare function qpuFacesOf(): { coins: number; rays: number; faces: number }
export declare function qpuCubeOf(): { vertices: number; hexbit: number; bits: number; amplitudes: number }
