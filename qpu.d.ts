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
