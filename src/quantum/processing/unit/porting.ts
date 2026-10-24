// The dependency ports of qpu. Every package.json dependency is a port here, in the domain graph, with what it does and,
// where qpu does the same work itself, which capability answers it. The commit gate reads this map through the built
// output and refuses a dependency that has no port, or a port with no domain and relates.

/** A port: the domain the dependency crosses to, the families it relates to, what it does, and whether it is a lead. */
export type Port = { domain: string; relates: readonly string[]; how?: string; lead?: boolean }

export const QPU_DEPS: Record<string, Port> = {
  '@types/node': { domain: 'value', relates: [], lead: true, how: 'types for the node builtins the ports cover' },
  tsx: { domain: 'compute', relates: [], how: 'dev runner for the scripts (npx tsx / node --import tsx): runs the .ts scripts, not part of the served unit' },
  typescript: { domain: 'build', relates: [], lead: true, how: 'compiling, not computing — the build tool stays' },
  vitepress: { domain: 'build', relates: ['typescript'], how: 'builds the docs site in docs/ from markdown; the MCP reference and the playground are generated from the handler in src/quantum/mcp.ts, so the site is the build tool and not part of the served unit' },
}
