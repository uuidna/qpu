/**
 * HOW TO PORT, SERVED BY THE MCP — so the gate that blocks an external dependency says what to do instead.
 *
 * qpu is self-sufficient: the compute core (the unit and every family) takes no external dependency and reaches for no
 * node builtin. What node provides, qpu provides through a PORT — a door that answers the host capability (the store, the
 * server, stdio, the sandbox, the installer) — and what a library would compute, a FAMILY computes as formulas. So a new
 * capability is never a dependency; it is a port or a family. This is the instruction a reader (or an agent) gets from the
 * MCP when the gate refuses an import, and the map of which door answers which node builtin.
 */

/**
 * EVERY PORT IS A FAMILY THAT CROSSES TO A DOMAIN AND RELATES TO OTHER FAMILIES — the same graph as every other family
 * (aerospace→cern), never a flat door. A node builtin ported is a one-word family (`fs`, `crypto`, `net`), its `domain`
 * the dst it crosses to, its `relates` the families it reaches — so ported it joins the open graph and gets a hex
 * address, all eight versions at once, verification and nested-doc storage like any family. `lead: true` marks a family
 * qpu has not developed yet (a lead, not a block). `how` is the qpu capability that already answers it without node.
 */
export type Port = { domain: string; relates: readonly string[]; how?: string; lead?: boolean }
export const QPU_PORTS: Record<string, Port> = {
  // storage domain — the content-addressed store
  fs: { domain: 'storage', relates: ['path', 'stream', 'os', 'sqlite'], how: 'qpuDocDbOf — read/write at an address, not a path on a disk' },
  path: { domain: 'storage', relates: ['fs', 'url'], how: 'an address is the path: handle/row, not a filesystem path' },
  sqlite: { domain: 'storage', relates: ['fs', 'db'], how: 'qpuDocDbOf / the db family — the store, content-addressed' },
  // net domain — readings and the edge, never a raw socket
  http: { domain: 'net', relates: ['https', 'http2', 'net', 'url', 'stream', 'dns'], how: 'the fetch handler serves; data reads a host as a reading with agrees/holds' },
  https: { domain: 'net', relates: ['http', 'tls'], how: 'as http — one fetch, bounded, counted, caught' },
  http2: { domain: 'net', relates: ['http', 'tls', 'stream'], how: 'as http — the edge multiplexes' },
  net: { domain: 'net', relates: ['tls', 'dns', 'dgram', 'stream'], how: 'a reading, not a raw socket' },
  dns: { domain: 'net', relates: ['net'], how: 'resolve as a reading through data', lead: true },
  dgram: { domain: 'net', relates: ['net'], how: 'no datagram port yet', lead: true },
  url: { domain: 'net', relates: ['path', 'querystring'], how: 'URL — a Web value; an address is the unit’s own url' },
  querystring: { domain: 'net', relates: ['url'], how: 'URLSearchParams — a Web value' },
  punycode: { domain: 'net', relates: ['url'], how: 'deprecated in node; only if a family needs it', lead: true },
  // crypt domain — qpu's own crypto
  crypto: { domain: 'crypt', relates: ['tls', 'hash', 'buffer'], how: 'crypt / Web Crypto (src/core/crypt.ts) — sha256, hkdf, ed25519, x25519, aead; no node:crypto' },
  tls: { domain: 'crypt', relates: ['net', 'crypto'], how: 'crypt seals; the edge terminates TLS' },
  // compute domain — the host and the clock, read never driven
  os: { domain: 'compute', relates: ['process', 'fs'], how: 'compute_machine — cores, load, memory as readings' },
  process: { domain: 'compute', relates: ['os', 'child_process'], how: 'the unit reads its own context (compute_context), it does not fork the host' },
  perf_hooks: { domain: 'compute', relates: ['process'], how: 'every call is timed into its receipt (percall) — no separate clock' },
  timers: { domain: 'compute', relates: [], how: 'the runtime’s own timers (Web) — setTimeout/AbortSignal.timeout' },
  v8: { domain: 'compute', relates: ['process'], how: 'engine internals not ported', lead: true },
  inspector: { domain: 'compute', relates: ['process'], how: 'the receipt is the trace', lead: true },
  trace_events: { domain: 'compute', relates: ['process'], how: 'the receipt is the trace', lead: true },
  diagnostics_channel: { domain: 'compute', relates: ['events'], how: 'monitoring is formulas (heat.slow)', lead: true },
  async_hooks: { domain: 'compute', relates: ['process'], how: 'no async context port', lead: true },
  // stdio domain — the shell boundary
  console: { domain: 'stdio', relates: ['readline', 'tty', 'process'], how: 'the unit writes through its own stdio adapter' },
  readline: { domain: 'stdio', relates: ['console', 'tty', 'stream'], how: 'the unit reads a line through its own stdio adapter' },
  tty: { domain: 'stdio', relates: ['console', 'readline'], how: 'as readline/console — one stdio port' },
  repl: { domain: 'stdio', relates: ['readline', 'vm'], how: 'the MCP is the repl — ask data { ask }', lead: true },
  // sandbox domain — running code, never a forked host
  child_process: { domain: 'sandbox', relates: ['process', 'worker_threads', 'stream'], how: 'run in a sandbox, not a forked host process' },
  worker_threads: { domain: 'sandbox', relates: ['child_process', 'stream'], how: 'an isolate is the worker' },
  vm: { domain: 'sandbox', relates: ['module'], how: 'the sandbox evaluates; the expr interpreter runs formula data (expr.ts), never eval' },
  cluster: { domain: 'sandbox', relates: ['child_process', 'worker_threads'], how: 'the edge scales the isolate', lead: true },
  wasi: { domain: 'sandbox', relates: ['vm'], how: 'no wasi port yet', lead: true },
  // install domain — the manifest, regenerated from the filesystem
  module: { domain: 'install', relates: ['fs', 'vm'], how: 'qpuInstallOf — the manifest; the registry regenerates from the filesystem' },
  sea: { domain: 'install', relates: ['module'], how: 'single-executable is a deploy mode (standalone), not a core import', lead: true },
  // value domain — Web values and the stream/events families
  stream: { domain: 'value', relates: ['events', 'buffer', 'fs'], how: 'the stream family; the hex engine folds a program like a stream' },
  events: { domain: 'value', relates: ['stream'], how: 'the stream family carries events' },
  buffer: { domain: 'value', relates: ['stream', 'string_decoder', 'crypto'], how: 'bytesOf/hexOf over Uint8Array — a Web value, no Buffer' },
  string_decoder: { domain: 'value', relates: ['buffer'], how: 'TextDecoder — a Web value' },
  util: { domain: 'value', relates: ['sys'], how: 'src/core/ops — the unit’s own helpers' },
  sys: { domain: 'value', relates: ['util'], how: 'an alias of util — src/core/ops' },
  constants: { domain: 'value', relates: [], how: 'the lattice constants (qpuLatticeNamesOf) — named, not imported' },
  domain: { domain: 'value', relates: ['events'], how: 'deprecated in node; errors ride the receipt', lead: true },
  // compress domain — compression is a formula
  zlib: { domain: 'compress', relates: ['stream', 'buffer'], how: 'the compress cross (dst: compress) — compression is a formula' },
  // gate domain — the proof harness
  assert: { domain: 'gate', relates: ['test'], how: 'the receipted test harness — node:test/assert only in *.test.ts, run by the gate' },
  test: { domain: 'gate', relates: ['assert'], how: 'the receipted test harness — the gate runs scripts/*.test.mjs on every push' },
}

/**
 * EVERY DEPENDENCY, PORTED INTO THE SAME GRAPH. A package is a family too: its `domain` the dst it crosses to, its
 * `relates` the families it reaches. `uuid` is genuinely ported — qpu mints its own (uuidStampOf / uuidVersionsOf, all
 * eight RFC versions at once), so the core needs no uuid. The framework and UI packages are the DELIVERY SHELL (the site
 * qpu ships inside), which the compute core never imports; they are leads — present so the graph is complete and the
 * gate notices a new dependency, develop them as qpu grows. The gate holds package.json and this registry equal: a new
 * dependency must be ported here (with its domain and relations) or the gate refuses it.
 */
export const QPU_DEPS: Record<string, Port> = {
  // ported — qpu already provides it, the core takes no dependency
  uuid: { domain: 'crypt', relates: ['crypto'], how: 'qpu mints its own: uuidStampOf / uuidVersionsOf — the 8-4-4-4-12 address in all 8 RFC versions at once, crypto-folded; no uuid in the core' },
  // ui — the render shell (React and its widgets), a lead
  react: { domain: 'ui', relates: ['react-dom'], lead: true },
  'react-dom': { domain: 'ui', relates: ['react'], lead: true },
  '@types/react': { domain: 'ui', relates: ['react'], lead: true, how: 'types' },
  'lucide-react': { domain: 'ui', relates: ['react'], lead: true },
  'radix-ui': { domain: 'ui', relates: ['react'], lead: true },
  '@radix-ui/react-slot': { domain: 'ui', relates: ['radix-ui', 'react'], lead: true },
  recharts: { domain: 'ui', relates: ['react'], lead: true, how: 'charts — the hologram/aura families render qpu’s own' },
  '@faceless-ui/modal': { domain: 'ui', relates: ['react'], lead: true },
  '@faceless-ui/scroll-info': { domain: 'ui', relates: ['react'], lead: true },
  '@payloadcms/ui': { domain: 'ui', relates: ['payload', 'react'], lead: true },
  // css — the styling shell (Tailwind + class helpers), a lead
  tailwindcss: { domain: 'css', relates: ['postcss'], lead: true },
  '@tailwindcss/postcss': { domain: 'css', relates: ['tailwindcss', 'postcss'], lead: true },
  '@tailwindcss/typography': { domain: 'css', relates: ['tailwindcss'], lead: true },
  'tw-animate-css': { domain: 'css', relates: ['tailwindcss'], lead: true },
  postcss: { domain: 'css', relates: ['tailwindcss'], lead: true },
  clsx: { domain: 'css', relates: ['cn', 'tailwind-merge'], lead: true },
  cn: { domain: 'css', relates: ['clsx', 'tailwind-merge'], lead: true },
  'tailwind-merge': { domain: 'css', relates: ['clsx', 'tailwindcss'], lead: true },
  'class-variance-authority': { domain: 'css', relates: ['clsx', 'tailwind-merge'], lead: true },
  // cms — Payload and its core (content), a lead; the aura/css families generate qpu’s own colours
  payload: { domain: 'cms', relates: ['next', 'graphql'], lead: true },
  '@payloadcms/next': { domain: 'cms', relates: ['payload', 'next'], lead: true },
  '@payloadcms/graphql': { domain: 'cms', relates: ['payload', 'graphql'], lead: true },
  '@payloadcms/sdk': { domain: 'cms', relates: ['payload'], lead: true },
  '@payloadcms/translations': { domain: 'cms', relates: ['payload'], lead: true },
  '@payloadcms/richtext-lexical': { domain: 'cms', relates: ['payload'], lead: true },
  graphql: { domain: 'cms', relates: ['payload'], lead: true },
  '@types/express': { domain: 'cms', relates: [], lead: true, how: 'types' },
  // plugin — the Payload plugins, each relating to the qpu family that supersedes it in the core
  '@payloadcms/plugin-multi-tenant': { domain: 'plugin', relates: ['payload', 'tenant'], lead: true, how: 'the tenant family — each tenant an app' },
  '@payloadcms/plugin-nested-docs': { domain: 'plugin', relates: ['payload'], lead: true, how: 'nested docs store families as data' },
  '@payloadcms/plugin-search': { domain: 'plugin', relates: ['payload', 'search'], lead: true, how: 'the search family' },
  '@payloadcms/plugin-seo': { domain: 'plugin', relates: ['payload', 'seo'], lead: true, how: 'the seo family generates titles/descriptions from the code' },
  '@payloadcms/plugin-ecommerce': { domain: 'plugin', relates: ['payload', 'stripe'], lead: true },
  '@payloadcms/plugin-form-builder': { domain: 'plugin', relates: ['payload'], lead: true },
  '@payloadcms/plugin-import-export': { domain: 'plugin', relates: ['payload'], lead: true },
  '@payloadcms/plugin-redirects': { domain: 'plugin', relates: ['payload'], lead: true },
  '@payloadcms/plugin-mcp': { domain: 'plugin', relates: ['payload', 'module'], lead: true, how: 'qpu serves its own MCP (qpuMcpOf); this exposes payload collections' },
  '@payloadcms/plugin-sentry': { domain: 'plugin', relates: ['payload', '@sentry/nextjs'], lead: true },
  '@payloadcms/plugin-stripe': { domain: 'plugin', relates: ['payload'], lead: true },
  '@payloadcms/plugin-cloud-storage': { domain: 'plugin', relates: ['payload'], lead: true },
  // db — the Payload adapters; qpu’s own store is qpuDocDbOf, content-addressed
  '@payloadcms/db-d1-sqlite': { domain: 'db', relates: ['payload', 'sqlite'], lead: true },
  '@payloadcms/db-postgres': { domain: 'db', relates: ['payload'], lead: true },
  '@payloadcms/db-mongodb': { domain: 'db', relates: ['payload'], lead: true },
  // storage — the object stores; qpu addresses content, it does not keep a bucket
  '@payloadcms/storage-r2': { domain: 'storage', relates: ['payload'], lead: true },
  '@payloadcms/storage-s3': { domain: 'storage', relates: ['payload'], lead: true },
  // email
  '@payloadcms/email-resend': { domain: 'email', relates: ['payload'], lead: true },
  // edge — the deploy target (Cloudflare/Next), a lead; deploys are manual
  next: { domain: 'edge', relates: ['react', 'payload'], lead: true },
  '@opennextjs/cloudflare': { domain: 'edge', relates: ['next', 'wrangler'], lead: true },
  wrangler: { domain: 'edge', relates: ['@cloudflare/workers-types'], lead: true },
  '@cloudflare/workers-types': { domain: 'edge', relates: ['wrangler'], lead: true, how: 'types' },
  // obs — monitoring
  '@sentry/nextjs': { domain: 'obs', relates: ['next'], how: 'monitoring is formulas (heat.slow)', lead: true },
  // mcp — qpu IS the server; the sdk is the client shell
  '@modelcontextprotocol/sdk': { domain: 'mcp', relates: ['module'], lead: true, how: 'qpu serves its own MCP (qpuMcpOf, tools/list + tools/call); the sdk is the shell client only' },
  // value/build — types and the compiler; compiling is not computing, it stays
  '@types/node': { domain: 'value', relates: [], lead: true, how: 'types for the node builtins the ports cover' },
  typescript: { domain: 'build', relates: [], lead: true, how: 'compiling, not computing — the build tool stays' },
}

/** The steps to port a capability into qpu instead of depending on it — the instruction the gate points to. */
export const PORTING_STEPS: readonly string[] = [
  'Name it one lowercase word (the rule.named rule): anything ported is a FAMILY that crosses to a DOMAIN and relates to other families (its neighbours in the open graph) — never a flat door and never a package.',
  'Express what it computes as formulas — { name, params, expr } data (expr.ts), or a registered formula crossing to its dst; each becomes a hex program at an address the one engine runs, holds-checks and receipts.',
  'If it reads the outside (a host, a dataset, an API), add it as a data SOURCE — a reading with agrees/holds, sliced by { from, take } — never a dependency.',
  'If it is a host capability (fs, http, os, process, child_process), answer it through a PORT door (storage, server, stdio, sandbox, install), guarded, through the MCP — never a bare import in the core.',
  'Add the file; the registry regenerates from the filesystem (no hand lists). Do not edit a list.',
  'The gate crosses it: an uncrossed formula is a lead (gate.crossed), not a block. Develop the lead; never take the dependency.',
]

/** The MCP's answer to "how do I port this / why was my dependency refused": the steps, the port map, and the rule. */
export const qpuPortingOf = () => ({
  kind: 'porting' as const,
  rule: 'The compute core (the unit and every family) takes no external dependency and no node builtin. Port it, do not depend on it.',
  steps: PORTING_STEPS,
  ports: QPU_PORTS,
  deps: QPU_DEPS,
  blocks: 'A bare external import in src/quantum or src/families fails the gate (scripts/ports.test.mjs), and a dependency not in QPU_DEPS fails it too.',
  holds: true as const,
})
