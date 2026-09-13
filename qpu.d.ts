/** Public QPU. Constructors live in the JS. Inferred .d.ts is not the npm types. */
export declare function qpuMcpOf(): {
  tools: readonly { name: string }[]
  holds: boolean
  origin: string
  href: string
}
export declare function qpuMcpCallOf(name: string, args?: Record<string, unknown>): Promise<unknown>
export declare function qpuQuantumOf(): { holds: boolean; fused: number; next: number }
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
