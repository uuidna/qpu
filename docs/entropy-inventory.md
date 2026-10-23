# Entropy and clock inventory

Every line in `src/` and `scripts/` that draws randomness or reads the clock, found by `grep -rnE` over `Math.random`, `randomBytes`, `randomUUID`, `randomInt`, `getRandomValues`, `Date.now()`, `new Date(`, `performance.now`, `process.hrtime`. Test files (`*.test.*`, `tests/`) are excluded. `src/families/heat/test.ts` is in `src/` and is included. The first table is the state before any change (commit `3e60fc7`); the second is the state after the refactor; the per-site table gives each original site its final status.

Categories follow the brief: (a) randomness or clock that decides output, (b) randomness used only for test inputs, (c) clock reads that feed a reported number, (d) clock reads used only for operational timeouts. `ref` marks imports and comments, which draw nothing.

## Totals before any change

| category | meaning | sites |
|---|---|---:|
| A-decide | (a) decides an output | 19 |
| A-key | (a) secret key material (sub-case) | 19 |
| B-test | (b) test inputs | 14 |
| C-time | (c) feeds a reported duration, rate or latency | 148 |
| C-stamp | (c) timestamp in a reported or stored record | 101 |
| C-id | (c) identifier from the clock or randomness | 14 |
| D | (d) operational timeout, window, TTL, liveness or progress | 46 |
| ref | import or comment | 13 |
| **total** | | **374** |

Across 83 files; 361 runtime sites excluding `ref`.

## Totals after the refactor

| final status | sites |
|---|---:|
| replaced | 296 |
| kept (d) | 48 |
| residual (a) | 14 |
| residual (c) | 2 |
| ref | 14 |
| removed with its line | 0 |
| **total** | **374** |

`kept (d)` is the operational list, `residual (a)` and `residual (c)` are the sites the refactor could not make deterministic without a decision (see the report and the section below). Each `replaced` site has no clock or random value left in its file at that line; the replacement is described per file below.

## Residual sites that need a decision

- **residual (a), 14 sites**: secret material (keys, tokens, nonces, session ids). `src/core/crypt.ts` `randomBytes` is a ChaCha20 stream from a fixed formula seed, shared by the whole process: it reads no clock, but it is deterministic, so a token or key drawn from it is predictable. `src/utilities/workers-crypto.ts` line 35 is the one non-deterministic source left, the platform CSPRNG for Payload password salts, kept because a fixed salt would make hashes precomputable. The decision is whether secrets take real entropy at the boundary (recommended) or stay on the formula stream.
- **residual (c), 2 sites**: record timestamps required by the storage contract: `src/db/payload-qpu.ts` `now()` (Payload `createdAt`/`updatedAt`) and `src/quantum/processing/unit/docdb.ts` `$currentDate` (a MongoDB operator whose contract is the current time). Removing them breaks the Payload and MongoDB-compatible contracts.
- **kept (d)**: every remaining clock read is a timeout, a TTL, a rate-limit window, a liveness check, a circuit breaker, or a console progress line. Several of these decide an output in the gray sense (a cache hit, a rate-limit rejection, a node marked unhealthy); they are listed in the per-site table with that note.

## Replacements by file

| file | replacement |
|---|---|

- `scripts/cross-check.mjs`: replaced 3. `seconds` removed
- `scripts/develop.mjs`: replaced 3. per-family `ms` removed; hot marking (timeout) stays
- `scripts/discover.mjs`: replaced 3. `seconds` removed
- `scripts/examine.mjs`: replaced 1. speed check removed; the verdict check stays
- `scripts/fold-gpu.ts`: replaced 3. benchmark timings removed; the exactness check stays
- `scripts/fuse-apis.mjs`: kept (d) 2, replaced 2. `seconds` removed; progress timer stays (d)
- `scripts/gap-discovery-scanner.mjs`: replaced 2. report file is `gap-discovery.json` (no date)
- `scripts/generate-combinatorial-pages.mjs`: replaced 1.
- `scripts/generate.mjs`: kept (d) 2.
- `scripts/heat.mjs`: replaced 2. age reference is HEAD commit time
- `scripts/payload-cloudflare.mjs`: replaced 1.
- `scripts/port.mjs`: replaced 6. timings removed from the report
- `scripts/quantum-advantage-meter.mjs`: replaced 1.
- `scripts/receipt.mjs`: replaced 4. `when` and `seconds` removed; receipt header names no date
- `scripts/recursive-improvement.mjs`: replaced 4. success and impact are not drawn; unmeasured outcomes are null
- `scripts/release-pipeline.mjs`: replaced 6. e2e outcomes are not drawn (not run, so not passed); lint is not run; version comes from package.json
- `scripts/site-receipt.mjs`: replaced 1.
- `scripts/use-surface.mts`: replaced 8, ref 1. timings removed; fixed fixture seed in place of random
- `scripts/wave-sweep-grid.mts`: replaced 2. wall time removed
- `src/audit/audit-operations.ts`: replaced 15. audit id is the hash of the request; proof stamp is 0 when no time is given
- `src/cloudflare/mcp-integration.ts`: replaced 12. mock responses carry no clock values
- `src/cloudflare/quantum-secure-messaging.ts`: ref 1, replaced 7. message id is a hash of the sealed envelope (fresh nonce); timestamps are a caller-supplied `at`, default 0 (unstamped)
- `src/core/cache.ts`: kept (d) 6.
- `src/core/crypt-attacks.ts`: ref 1, replaced 11. all inputs are fixed fixtures from `drbgOf`; the DRBG repetition check enumerates its own fixed stream
- `src/core/crypt.ts`: replaced 4, residual (a) 5. `checkPrime` above 2^64 uses fixed witnesses (the first 13 primes), exact below psi13, a fixed-base test above; `drbgOf(seed)` gives an explicit-seed stream
- `src/core/health.ts`: kept (d) 1, replaced 3. `response-time` probe answers without a latency budget
- `src/core/limit.ts`: kept (d) 2.
- `src/core/manager.ts`: replaced 8. execution durations and average removed from history and stats
- `src/core/obs.ts`: kept (d) 2, replaced 1.
- `src/core/operations.ts`: replaced 1. lead record has no clock id
- `src/core/uuid-bridge.ts`: replaced 1. `registered` optional and not set
- `src/core/uuid.ts`: replaced 1. `createdAt` optional and not set
- `src/db/payload-qpu.ts`: residual (c) 1, replaced 1. migration file name is the next sequence number (the record stamps are a residual)
- `src/deployment/git-hooks.ts`: replaced 2. pre-commit and pre-push timings removed
- `src/distributed/consensus.ts`: replaced 7, kept (d) 4.
- `src/distributed/distributed-executor.ts`: replaced 6. durations and average removed
- `src/distributed/formula-router.ts`: kept (d) 1, replaced 6. route priority is a sequence number; the cache TTL reads a private cache-time map
- `src/distributed/node-registry.ts`: replaced 7, kept (d) 6. event ids are a counter; gossip expiry reads a receive-time map (operational)
- `src/distributed/state-sync.ts`: replaced 3. conflict tiebreak is the larger node id (was the wall clock)
- `src/families/heat/index.ts`: replaced 4. `slow` is never established: a speed claim is not a theorem; `test.ts` asserts that
- `src/families/heat/test.ts`: replaced 1.
- `src/families/holo/index.ts`: ref 1, replaced 1. default seed is the formula stream (fixed), not the process stream
- `src/families/signal/index.ts`: ref 1, replaced 1. timestamp removed; BB84 seeded
- `src/families/wave/index.ts`: replaced 5. live timings and slowest-program reports removed
- `src/harmony/orchestrator.ts`: replaced 3. avgLatency is not measured here
- `src/integrations/kafka-client.ts`: replaced 1, kept (d) 2.
- `src/mcp/api-door.ts`: kept (d) 4, replaced 4. `seconds` fields removed; registry caches stay (d)
- `src/mcp/cli.ts`: replaced 2. calls and bytes only; no wall time reported
- `src/mcp/formulas-receipt.ts`: replaced 5. two timing rows removed; `when` stamps removed
- `src/mcp/print-all.ts`: replaced 1. `when` stamp removed
- `src/mcp/qpu-fused.ts`: replaced 7, kept (d) 4. the alpine walk has no clock bound (fail-fast on error); site walk drops its timings
- `src/mcp/secure-chat-rbac.ts`: ref 1, residual (a) 8, kept (d) 3, replaced 5. message id is the chain value after the message; `timestamp` fields optional
- `src/mcp/uuid-programmable-core.ts`: replaced 2.
- `src/mcp/whitepaper-generator.ts`: replaced 2.
- `src/ml/auto.ts`: replaced 3. window entries carry no stamp
- `src/optimization/index.ts`: replaced 2. the timed profile sample is no longer recorded
- `src/optimization/jit-compiler.ts`: replaced 1.
- `src/optimization/latency-profiler.ts`: replaced 6. window cutoff from the caller-supplied `now`; uptime removed
- `src/optimization/memory-pool.ts`: replaced 3. GC pause and allocation rate removed; `operations` is a count
- `src/optimization/parallel-executor.ts`: replaced 4. load balance from item counts, not wall time
- `src/patterns/resilience.ts`: kept (d) 2.
- `src/payload/plugins/chat-search.ts`: replaced 23. `ms` hop fields and start times removed
- `src/payload/plugins/cloudflare-account.ts`: replaced 3. per-command `ms` removed
- `src/payload/plugins/exam.ts`: replaced 17. `ms` fields removed; the exam timeout stays (d)
- `src/payload/plugins/gate-court.ts`: replaced 4. trial `ms` removed
- `src/payload/plugins/raid-compare.ts`: replaced 2. `timed` wrapper removed
- `src/payload/plugins/tenants.ts`: replaced 4. `ms` removed
- `src/payload/plugins/tokens.ts`: replaced 5. `wallMs` and the note timing removed
- `src/payload/plugins/wave.ts`: replaced 2. `wallMs` removed
- `src/production.ts`: kept (d) 5.
- `src/quantum/aws-braket.ts`: replaced 3. task ids from the deterministic suffix; completion stamps removed
- `src/quantum/ibm-qiskit.ts`: replaced 3. job ids from the deterministic suffix; completion stamps removed
- `src/quantum/ionq-connector.ts`: replaced 4. job ids from the deterministic suffix; completion stamps removed
- `src/quantum/kernel/index.ts`: replaced 2. batch count and memory only; the speed claim in `verify` is removed
- `src/quantum/processing/unit/circuit.ts`: ref 1.
- `src/quantum/processing/unit/docdb.ts`: residual (c) 1.
- `src/quantum/processing/unit/index.ts`: ref 1.
- `src/quantum/processing/unit/receipt.ts`: replaced 1. time block, total and slowest list removed
- `src/quantum/processing/unit/receipted.ts`: replaced 2. per-test clock reading removed from the reading
- `src/quantum/quantum-executor.ts`: replaced 7, kept (d) 2. durations and start-time threading removed; job id uses the foreign id or `local`
- `src/seed/index.ts`: replaced 1. error record has no stamp
- `src/utilities/formula-routing.ts`: replaced 1. sitemap `lastmod` removed
- `src/utilities/workers-crypto.ts`: ref 6, residual (a) 1.

## Sites by file

### `scripts/cross-check.mjs`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 37 | C-time | replaced | `const t0 = Date.now()` |  |
| 65 | C-stamp | replaced | `when: new Date().toISOString().slice(0, tenOf(1)),` |  |
| 68 | C-time | replaced | `seconds: Math.round((Date.now() - t0) / tenOf(3)),` |  |

### `scripts/develop.mjs`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 53 | C-time | replaced | `const at = Date.now()` |  |
| 60 | C-time | replaced | `return { family, matched: reading.matched ?? 0, read: reading.read ?? 0, funding: fund?.reading?.key` |  |
| 62 | C-time | replaced | `return { family, hot: true, ms: Date.now() - at, why: e.message } // hot: left for the next run (fai` |  |

### `scripts/discover.mjs`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 16 | C-time | replaced | `const t0 = Date.now()` |  |
| 33 | C-stamp | replaced | `when: new Date().toISOString().slice(0, tenOf(1)),` |  |
| 54 | C-time | replaced | `console.log(JSON.stringify({ families: doc.families, runs: doc.runs, relations: doc.relationsTotal, ` |  |

### `scripts/examine.mjs`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 122 | C-time | replaced | `const t0 = Date.now(); const wide = (await call('crypto_shor', { n: '7'.repeat(30000), a: 2 })).sc; ` |  |

### `scripts/fold-gpu.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 59 | C-time | replaced | `const t0 = performance.now()` |  |
| 79 | C-time | replaced | `const gpuMs = performance.now() - t0` |  |
| 82 | C-time | replaced | `const t1 = performance.now(); const want = strings.map(cpuFold); const cpuMs = performance.now() - t` |  |

### `scripts/fuse-apis.mjs`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 49 | C-time | kept (d) | `const t0 = Date.now()` | progress timer; reports no result |
| 83 | D | kept (d) | `if (++done % tenOf(2) === 0) console.error(ˋ${done}/${names.length} ${Math.round((Date.now() - t0) /` | console progress only; reports no result |
| 156 | C-stamp | replaced | `when: new Date().toISOString().slice(0, tenOf(1)),` |  |
| 180 | C-time | replaced | `seconds: Math.round((Date.now() - t0) / tenOf(3)),` |  |

### `scripts/gap-discovery-scanner.mjs`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 399 | C-stamp | replaced | `timestamp: new Date().toISOString(),` |  |
| 408 | C-id | replaced | `const resultsPath = path.join(ROOT, 'experiments-results', ˋgap-discovery-${new Date().toISOString()` |  |

### `scripts/generate-combinatorial-pages.mjs`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 209 | C-stamp | replaced | `timestamp: new Date().toISOString(),` |  |

### `scripts/generate.mjs`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 31 | D | kept (d) | `const t0 = Date.now()` | console progress only; reports no result |
| 35 | D | kept (d) | `console.log(ˋ${ok ? '✓' : allowFail ? '~' : '✗'} ${label} (${((Date.now() - t0) / 1000).toFixed(1)}s` | console progress only; reports no result |

### `scripts/heat.mjs`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 24 | C-id | replaced | `const now = Math.floor(Date.now() / tenOf(3))` |  |
| 142 | C-stamp | replaced | `when: new Date().toISOString().slice(0, tenOf(1)),` |  |

### `scripts/payload-cloudflare.mjs`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 274 | C-stamp | replaced | `when: new Date().toISOString().slice(0, tenOf(1)),` |  |

### `scripts/port.mjs`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 80 | C-time | replaced | `const t0 = performance.now()` |  |
| 90 | C-time | replaced | `ms: Math.round((performance.now() - t0) * tenOf(3)) / tenOf(3),` |  |
| 99 | C-time | replaced | `const t0 = Date.now()` |  |
| 101 | C-time | replaced | `const wallMs = Date.now() - t0` |  |
| 124 | C-time | replaced | `const tCover = Date.now()` |  |
| 129 | C-time | replaced | `const coverMs = Date.now() - tCover` |  |

### `scripts/quantum-advantage-meter.mjs`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 186 | C-stamp | replaced | `timestamp: new Date().toISOString(),` |  |

### `scripts/receipt.mjs`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 23 | C-time | replaced | `const t0 = Date.now()` |  |
| 126 | C-time | replaced | `const seconds = Math.round((Date.now() - t0) / tenOf(3))` |  |
| 150 | C-stamp | replaced | `const out = { ...doc, legal, holds, when: new Date().toISOString().slice(0, tenOf(1)), host, seconds` |  |
| 160 | C-stamp | replaced | `const text = ˋ/** GENERATED by scripts/receipt.mjs registry from https://api.apis.guru/v2/list.json ` |  |

### `scripts/recursive-improvement.mjs`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 136 | A-decide | replaced | `const success = Math.random() > 0.2` |  |
| 141 | A-decide | replaced | `impact: Math.random() * 0.2,` |  |
| 146 | A-decide | replaced | `console.log(ˋ Impact: ${(success ? Math.random() * 20 : 0).toFixed(1)}%\nˋ)` |  |
| 215 | C-stamp | replaced | `timestamp: new Date().toISOString(),` |  |

### `scripts/release-pipeline.mjs`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 133 | A-decide | replaced | `const success = Math.random() > 0.05` |  |
| 150 | A-decide | replaced | `const lintPasses = Math.random() > 0.1` |  |
| 247 | C-id | replaced | `version: '1.0.' + Math.floor(Date.now() / tenOf(3)).toString().slice(-3),` |  |
| 248 | C-stamp | replaced | `timestamp: new Date().toISOString(),` |  |
| 324 | C-stamp | replaced | `timestamp: new Date().toISOString(),` |  |
| 335 | C-id | replaced | `ˋ.release-${Math.floor(Date.now() / 1000)}.jsonˋ` |  |

### `scripts/site-receipt.mjs`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 38 | C-stamp | replaced | `when: new Date().toISOString().slice(0, tenOf(1)),` |  |

### `scripts/use-surface.mts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 9 | C-time | replaced | `const t0 = performance.now()` |  |
| 23 | ref | ref | `const { scrypt, pbkdf2Sha512, checkPrime, randomInt, hexOf, ed25519Sign, ed25519Verify, ed25519Publi` | removed with its line |
| 62 | C-time | replaced | `const courtT0 = performance.now()` |  |
| 64 | C-time | replaced | `const courtMs = Math.round(performance.now() - courtT0)` |  |
| 116 | C-time | replaced | `const sealT0 = performance.now()` |  |
| 119 | C-time | replaced | `ms: Math.round(performance.now() - sealT0),` |  |
| 189 | B-test | replaced | `const seed = randomBytes(32)` |  |
| 193 | B-test | replaced | `log('primes/randomInt', { p17: checkPrime(17), r: randomInt(1, 10) })` |  |
| 204 | C-time | replaced | `console.log('ELAPSED_MS', Math.round(performance.now() - t0))` |  |

### `scripts/wave-sweep-grid.mts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 58 | C-time | replaced | `const t0 = Date.now()` |  |
| 67 | C-time | replaced | `const wallMs = Date.now() - t0` |  |

### `src/audit/audit-operations.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 43 | C-id | replaced | `auditId: ˋaudit-${Date.now()}ˋ,` |  |
| 57 | C-stamp | replaced | `startTime: Date.now(),` |  |
| 97 | C-stamp | replaced | `assessmentTime: Date.now()` |  |
| 136 | C-stamp | replaced | `assessmentTime: Date.now()` |  |
| 178 | C-stamp | replaced | `assessmentTime: Date.now()` |  |
| 215 | C-stamp | replaced | `assessmentTime: Date.now()` |  |
| 252 | C-stamp | replaced | `assessmentTime: Date.now()` |  |
| 285 | C-stamp | replaced | `assessmentTime: Date.now()` |  |
| 323 | C-stamp | replaced | `assessmentTime: Date.now()` |  |
| 363 | C-stamp | replaced | `assessmentTime: Date.now()` |  |
| 404 | C-stamp | replaced | `assessmentTime: Date.now()` |  |
| 445 | C-stamp | replaced | `assessmentTime: Date.now()` |  |
| 493 | C-stamp | replaced | `Date.now(),` |  |
| 500 | C-stamp | replaced | `auditDate: new Date().toISOString(),` |  |
| 517 | C-stamp | replaced | `timestamp: Date.now(),` |  |

### `src/cloudflare/mcp-integration.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 45 | C-stamp | replaced | `deployedAt: new Date().toISOString(),` |  |
| 66 | C-stamp | replaced | `timestamp: Date.now()` |  |
| 110 | C-stamp | replaced | `createdAt: Date.now(),` |  |
| 111 | C-stamp | replaced | `expiresAt: Date.now() + 24 * 60 * 60 * 1000` |  |
| 157 | C-stamp | replaced | `timestamp: Date.now()` |  |
| 175 | C-stamp | replaced | `timestamp: Date.now()` |  |
| 241 | C-id | replaced | `lastRowId: Date.now(),` |  |
| 242 | C-stamp | replaced | `timestamp: new Date().toISOString()` |  |
| 260 | C-stamp | replaced | `{ messageId: 'msg-1', recipient: 'user1', receivedAt: Date.now() }` |  |
| 289 | C-stamp | replaced | `timestamp: Date.now()` |  |
| 312 | C-stamp | replaced | `timestamp: Date.now()` |  |
| 407 | C-stamp | replaced | `createdAt: new Date().toISOString()` |  |

### `src/cloudflare/quantum-secure-messaging.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 8 | ref | ref | `import { randomUUID, sha256Hex } from '../core/crypt.js'` | removed with its line |
| 112 | C-stamp | replaced | `const now = Date.now()` |  |
| 114 | A-decide | replaced | `const messageId = ˋmsg_${randomUUID()}ˋ` |  |
| 193 | C-stamp | replaced | `JSON.stringify({ messageId: message.id, deliveredAt: Date.now() }),` |  |
| 251 | C-stamp | replaced | `timestamp: Date.now()` |  |
| 376 | C-stamp | replaced | `receivedAt: Date.now(),` |  |
| 490 | C-stamp | replaced | `timestamp: Date.now()` |  |
| 532 | C-stamp | replaced | `propagatedAt: Date.now(),` |  |

### `src/core/cache.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 30 | D | kept (d) | `return e ? e.exp > Date.now() : false` | TTL cache expiry (operational; decides cache hit) |
| 35 | D | kept (d) | `return e ? e.exp <= Date.now() : true` | TTL cache expiry (operational; decides cache hit) |
| 47 | D | kept (d) | `if (e.exp <= Date.now()) {` | TTL cache expiry (operational; decides cache hit) |
| 59 | D | kept (d) | `exp: Date.now() + this.ttl,` | TTL cache expiry (operational; decides cache hit) |
| 76 | D | kept (d) | `const now = Date.now()` | TTL cache expiry (operational; decides cache hit) |
| 93 | D | kept (d) | `const now = Date.now()` | TTL cache expiry (operational; decides cache hit) |

### `src/core/crypt-attacks.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 1 | ref | ref | `import { aeadOpen, aeadSeal, concat, ed25519PublicKey, ed25519Sign, ed25519Verify, equal, fromHex, r` | removed with its line |
| 33 | B-test | replaced | `const seed = randomBytes(32)` |  |
| 53 | B-test | replaced | `const seed = randomBytes(32)` |  |
| 67 | B-test | replaced | `const key32 = randomBytes(32), nonce = randomBytes(12), aad = utf8('header')` |  |
| 89 | B-test | replaced | `attack('ed25519 identity public key', 'ed25519', 16, () => smallOrderForgery(le(1n), randomBytes(32)` |  |
| 90 | B-test | replaced | `attack('ed25519 order-2 public key', 'ed25519', 16, () => smallOrderForgery(le(P - 1n), randomBytes(` |  |
| 95 | B-test | replaced | `attack('x25519 low-order points', 'x25519', LOW_ORDER_U.length, (i) => x25519Shared(randomBytes(32),` |  |
| 96 | B-test | replaced | `attack('x25519 contributory', 'x25519', 4, () => equal(x25519Shared(randomBytes(32), x25519PublicKey` |  |
| 100 | B-test | replaced | `attack('aead wrong nonce', 'chacha20-poly1305', 1, () => aeadOpen(key32, randomBytes(12), sealed, aa` |  |
| 102 | B-test | replaced | `attack('chat impersonation', 'chat', 1, () => decrypts({ ...toBob, signature: ed25519Sign(randomByte` |  |
| 111 | B-test | replaced | `attack('drbg repetition', 'drbg', 1, () => new Set(Array.from({ length: 4096 }, () => randomUUID()))` |  |
| 113 | B-test | replaced | `const bytes = randomBytes(1 << 17)` |  |

### `src/core/crypt.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 34 | A-key | replaced | `export const randomBytes = (n: number): Bytes => {` |  |
| 40 | A-key | replaced | `export const randomUUID = (): string => {` |  |
| 41 | A-key | replaced | `const b = randomBytes(16)` |  |
| 516 | A-key | residual (a) | `export const randomInt = (min: number, max: number): number => {` | secret material drawn from the process-wide formula stream (src/core/crypt.ts randomBytes): deterministic from a fixed seed and call order, so a key or token is predictable; decision needed |
| 517 | A-key | residual (a) | `if (!Number.isSafeInteger(min) \|\| !Number.isSafeInteger(max) \|\| max <= min) throw new Error('ran` | secret material drawn from the process-wide formula stream (src/core/crypt.ts randomBytes): deterministic from a fixed seed and call order, so a key or token is predictable; decision needed |
| 522 | A-key | residual (a) | `const r = leToBig(randomBytes(bytes))` | secret material drawn from the process-wide formula stream (src/core/crypt.ts randomBytes): deterministic from a fixed seed and call order, so a key or token is predictable; decision needed |
| 547 | A-decide | replaced | `: Array.from({ length: rounds }, () => 2n + (leToBig(randomBytes(8)) % (N - 3n)))` |  |
| 570 | A-key | residual (a) | `const n = ((leToBig(randomBytes(Math.ceil(bits / 8))) & mask) \| top) \| 1n` | secret material drawn from the process-wide formula stream (src/core/crypt.ts randomBytes): deterministic from a fixed seed and call order, so a key or token is predictable; decision needed |
| 667 | A-key | residual (a) | `return createSecretKey(randomBytes(options.length / 8))` | secret material drawn from the process-wide formula stream (src/core/crypt.ts randomBytes): deterministic from a fixed seed and call order, so a key or token is predictable; decision needed |

### `src/core/health.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 60 | D | kept (d) | `const now = Date.now()` | health-check interval (operational) |
| 84 | C-stamp | replaced | `ts: Date.now(),` |  |
| 109 | C-time | replaced | `const start = Date.now()` |  |
| 111 | C-time | replaced | `return Date.now() - start < 100` |  |

### `src/core/limit.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 25 | D | kept (d) | `const now = Date.now()` | rate-limit window (operational; decides rejection) |
| 111 | D | kept (d) | `const now = Date.now()` | rate-limit window (operational; decides rejection) |

### `src/core/manager.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 35 | C-time | replaced | `const start = performance.now()` |  |
| 45 | C-time | replaced | `const duration = performance.now() - start` |  |
| 50 | C-stamp | replaced | `timestamp: Date.now(),` |  |
| 62 | C-time | replaced | `const duration = performance.now() - start` |  |
| 66 | C-stamp | replaced | `timestamp: Date.now(),` |  |
| 82 | C-time | replaced | `const start = performance.now()` |  |
| 86 | C-time | replaced | `const duration = performance.now() - start` |  |
| 92 | C-stamp | replaced | `timestamp: Date.now(),` |  |

### `src/core/obs.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 50 | D | kept (d) | `private flush = Date.now()` | flush interval (operational) |
| 58 | D | kept (d) | `const now = Date.now()` | flush interval (operational) |
| 148 | C-stamp | replaced | `ts: Date.now(),` |  |

### `src/core/operations.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 206 | C-id | replaced | `data: { recorded: true, leadId: 'lead-' + Date.now() }` |  |

### `src/core/uuid-bridge.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 121 | C-stamp | replaced | `registered: new Date()` |  |

### `src/core/uuid.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 90 | C-stamp | replaced | `createdAt: new Date(),` |  |

### `src/db/payload-qpu.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 143 | C-stamp | residual (c) | `const now = () => new Date().toISOString()` | record timestamp required by the storage contract (Payload createdAt/updatedAt; MongoDB $currentDate); decision needed |
| 280 | C-id | replaced | `const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)` |  |

### `src/deployment/git-hooks.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 19 | C-time | replaced | `const t = performance.now()` |  |
| 21 | C-time | replaced | `return { value, seconds: Math.round((performance.now() - t) / 100) / 10 }` |  |

### `src/distributed/consensus.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 56 | C-stamp | replaced | `timestamp: Date.now()` |  |
| 68 | C-stamp | replaced | `timestamp: Date.now(),` |  |
| 89 | C-stamp | replaced | `timestamp: Date.now()` |  |
| 112 | C-stamp | replaced | `timestamp: Date.now()` |  |
| 178 | C-stamp | replaced | `timestamp: Date.now()` |  |
| 205 | C-stamp | replaced | `timestamp: Date.now()` |  |
| 242 | D | kept (d) | `const startTime = Date.now()` | round timeout (operational; decides abort) |
| 260 | D | kept (d) | `if (Date.now() - startTime > timeout) {` | round timeout (operational; decides abort) |
| 282 | D | kept (d) | `const startTime = Date.now()` | round timeout (operational; decides abort) |
| 285 | D | kept (d) | `if (Date.now() - startTime > timeout) {` | round timeout (operational; decides abort) |
| 319 | C-stamp | replaced | `timestamp: Date.now()` |  |

### `src/distributed/distributed-executor.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 86 | C-time | replaced | `const startTime = Date.now()` |  |
| 92 | C-time | replaced | `const duration = Date.now() - startTime` |  |
| 100 | C-stamp | replaced | `timestamp: Date.now()` |  |
| 103 | C-time | replaced | `const duration = Date.now() - startTime` |  |
| 111 | C-stamp | replaced | `timestamp: Date.now()` |  |
| 134 | C-stamp | replaced | `timestamp: Date.now()` |  |

### `src/distributed/formula-router.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 63 | D | kept (d) | `if (cached && Date.now() - cached.priority < 10000) {` | kept (d); expression changed to a cache stamp kept in a private map |
| 90 | A-decide | replaced | `route.priority = Date.now()` |  |
| 127 | A-decide | replaced | `priority: Date.now(),` |  |
| 150 | A-decide | replaced | `priority: Date.now(),` |  |
| 176 | A-decide | replaced | `priority: Date.now(),` |  |
| 261 | A-decide | replaced | `priority: Date.now(),` |  |
| 276 | A-decide | replaced | `priority: Date.now(),` |  |

### `src/distributed/node-registry.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 32 | C-stamp | replaced | `lastSync: Date.now()` |  |
| 80 | D | kept (d) | `lastHeartbeat: Date.now(),` | heartbeat liveness and gossip expiry (operational; decides node health) |
| 105 | D | kept (d) | `lastHeartbeat: Date.now(),` | heartbeat liveness and gossip expiry (operational; decides node health) |
| 128 | D | kept (d) | `existing.lastHeartbeat = Date.now()` | heartbeat liveness and gossip expiry (operational; decides node health) |
| 144 | C-id | replaced | `id: ˋnode-join-${Date.now()}ˋ,` |  |
| 147 | C-stamp | replaced | `timestamp: Date.now(),` |  |
| 169 | C-id | replaced | `id: ˋnode-leave-${Date.now()}ˋ,` |  |
| 172 | C-stamp | replaced | `timestamp: Date.now(),` |  |
| 183 | D | kept (d) | `n => n.status === 'healthy' && Date.now() - n.lastHeartbeat < 30000` | heartbeat liveness and gossip expiry (operational; decides node health) |
| 288 | D | kept (d) | `const timeSinceHeartbeat = Date.now() - node.lastHeartbeat` | heartbeat liveness and gossip expiry (operational; decides node health) |
| 318 | D | kept (d) | `const now = Date.now()` | heartbeat liveness and gossip expiry (operational; decides node health) |
| 328 | C-id | replaced | `id: ˋheartbeat-${Date.now()}ˋ,` |  |
| 331 | C-stamp | replaced | `timestamp: Date.now(),` |  |

### `src/distributed/state-sync.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 49 | C-stamp | replaced | `timestamp: Date.now(),` |  |
| 79 | C-stamp | replaced | `timestamp: Date.now(),` |  |
| 169 | C-stamp | replaced | `timestamp: Date.now(),` |  |

### `src/families/heat/index.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 114 | A-decide | replaced | `const once = async (run: () => unknown) => { const t = performance.now(); try { await run() } catch ` |  |
| 116 | A-decide | replaced | `const start = performance.now()` |  |
| 124 | A-decide | replaced | `const frozen = performance.now() - start === 0` |  |
| 126 | A-decide | replaced | `return heatCross('heat-slow', 'physics', ˋslow(${family}.${formula.name}) = its slowest steady-state` |  |

### `src/families/heat/test.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 44 | B-test | replaced | `qpuHexRegisterOf('zzslow', 'spin', () => { const t = performance.now(); while (performance.now() - t` |  |

### `src/families/holo/index.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 1 | ref | ref | `import { concat, ed25519PublicKey, ed25519Sign, ed25519Verify, equal, fromHex, hexOf, hkdf, randomBy` | removed with its line |
| 55 | A-key | replaced | `constructor(scales: readonly string[], seed: Bytes = randomBytes(32)) {` |  |

### `src/families/signal/index.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 3 | ref | ref | `import { randomBytes as qpuRandomBytes } from '../../core/crypt.js'` | removed with its line |
| 93 | C-stamp | replaced | `return { id: ˋsig-${hash}ˋ, payload: data, dims: key.bits.length, hash, verified: false, timestamp: ` |  |

### `src/families/wave/index.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 79 | C-time | replaced | `const at = Date.now()` |  |
| 92 | C-time | replaced | `const timed = await Promise.all(launched.map(async (l) => { const t = Date.now(); const a = await ag` |  |
| 94 | C-time | replaced | `const ms = Math.max(1, Date.now() - at)` |  |
| 96 | C-time | replaced | `const liveAt = Date.now()` |  |
| 98 | C-time | replaced | `const liveMs = Math.max(0, Date.now() - liveAt)` |  |

### `src/harmony/orchestrator.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 48 | C-stamp | replaced | `timestamp: Date.now()` |  |
| 363 | C-time | replaced | `const start = Date.now()` |  |
| 368 | C-time | replaced | `node.metrics.avgLatency = (node.metrics.avgLatency * (node.metrics.callCount - 1) + (Date.now() - st` |  |

### `src/integrations/kafka-client.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 83 | C-stamp | replaced | `timestamp: Date.now()` |  |
| 133 | D | kept (d) | `const startTime = Date.now()` | poll timeout (operational) |
| 136 | D | kept (d) | `while (Date.now() - startTime < (opts.timeout \|\| 5000)) {` | poll timeout (operational) |

### `src/mcp/api-door.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 48 | D | kept (d) | `if (registry && Date.now() - registry.at < WINDOW) return registry` | registry and spec caches (operational) |
| 53 | D | kept (d) | `return (registry = { at: Date.now(), names: Object.keys(entries).sort(), entries })` | registry and spec caches (operational) |
| 85 | D | kept (d) | `if (hit && Date.now() - hit.at < WINDOW) return hit.api` | registry and spec caches (operational) |
| 101 | D | kept (d) | `specs.set(api, { at: Date.now(), api: promise })` | registry and spec caches (operational) |
| 160 | C-time | replaced | `const t0 = Date.now()` |  |
| 168 | C-time | replaced | `if (declared > EXCERPT * 64) return sealed({ ...base, url, status: r.status, type, bytes: declared, ` | seconds field removed from the cap reply; the line stays for the size cap |
| 172 | C-time | replaced | `return sealed({ ...base, url, status: r.status, type, bytes: text.length, excerpt, seconds: (Date.no` |  |
| 174 | C-time | replaced | `return sealed({ ...base, url, seconds: (Date.now() - t0) / 1000, why: (e as Error).name === 'Timeout` |  |

### `src/mcp/cli.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 52 | C-time | replaced | `const t = performance.now()` |  |
| 54 | C-time | replaced | `const ms = performance.now() - t, out = r.structuredContent ?? r.content` |  |

### `src/mcp/formulas-receipt.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 21 | C-time | replaced | `const loadSeconds = Math.round(performance.now() / 100) / 10` |  |
| 45 | C-time | replaced | `const t = performance.now()` |  |
| 47 | C-time | replaced | `return { value, ms: performance.now() - t }` |  |
| 161 | C-stamp | replaced | `when: new Date().toISOString().slice(0, 10),` |  |
| 204 | C-stamp | replaced | `when: new Date().toISOString().slice(0, 10),` |  |

### `src/mcp/print-all.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 191 | C-stamp | replaced | `when: new Date().toISOString().slice(0, 10),` |  |

### `src/mcp/qpu-fused.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 372 | A-decide | replaced | `const t0 = Date.now()` |  |
| 378 | A-decide | replaced | `for (let p = 2; p <= pages && Date.now() - t0 < DEADLINE; p++) {` |  |
| 414 | C-time | replaced | `const sitemapAt = Date.now()` |  |
| 416 | C-time | replaced | `const sitemapMs = Date.now() - sitemapAt` |  |
| 420 | C-time | replaced | `const at = Date.now()` |  |
| 426 | C-time | replaced | `return { path, status: r.status, title, page, ms: Date.now() - at }` |  |
| 428 | C-time | replaced | `return { path, status: 0, title: '', page: false, ms: Date.now() - at, error: (e as Error).message }` |  |
| 1214 | D | kept (d) | `if (hit && Date.now() - hit.at < WINDOW) return hit.value as ReturnType<typeof readOf>` | response caches and offline window (operational) |
| 1216 | D | kept (d) | `cache.set(key, { at: Date.now(), value })` | response caches and offline window (operational) |
| 1224 | D | kept (d) | `if (Date.now() < offlineUntil)` | response caches and offline window (operational) |
| 1234 | D | kept (d) | `if (f.why === 'offline') offlineUntil = Date.now() + OFFLINE_WINDOW` | response caches and offline window (operational) |

### `src/mcp/secure-chat-rbac.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 10 | ref | ref | `import { aeadOpen, aeadSeal, concat, ed25519PublicKey, ed25519Sign, ed25519Verify, hexOf, hkdf, rand` | import or comment; no draw or read |
| 120 | A-key | residual (a) | `const tokenId = ˋtoken_${hexOf(randomBytes(24))}ˋ` | secret material drawn from the process-wide formula stream (src/core/crypt.ts randomBytes): deterministic from a fixed seed and call order, so a key or token is predictable; decision needed |
| 121 | C-stamp | kept (d) | `const now = Date.now()` | token issue time, used only for the expiry check |
| 141 | D | kept (d) | `if (Date.now() > context.expiresAt) {` | token and key lifetime (operational; decides expiry) |
| 205 | A-key | residual (a) | `const agree = randomBytes(32)` | secret material drawn from the process-wide formula stream (src/core/crypt.ts randomBytes): deterministic from a fixed seed and call order, so a key or token is predictable; decision needed |
| 206 | A-key | residual (a) | `const sign = randomBytes(32)` | secret material drawn from the process-wide formula stream (src/core/crypt.ts randomBytes): deterministic from a fixed seed and call order, so a key or token is predictable; decision needed |
| 207 | A-key | residual (a) | `const phase = randomBytes(4)` | secret material drawn from the process-wide formula stream (src/core/crypt.ts randomBytes): deterministic from a fixed seed and call order, so a key or token is predictable; decision needed |
| 209 | A-key | residual (a) | `id: ˋqk_${randomUUID()}ˋ,` | secret material drawn from the process-wide formula stream (src/core/crypt.ts randomBytes): deterministic from a fixed seed and call order, so a key or token is predictable; decision needed |
| 212 | A-key | residual (a) | `quantumEntanglement: ˋentangle_${userId}_${randomUUID()}ˋ,` | secret material drawn from the process-wide formula stream (src/core/crypt.ts randomBytes): deterministic from a fixed seed and call order, so a key or token is predictable; decision needed |
| 214 | D | kept (d) | `expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours` | token and key lifetime (operational; decides expiry) |
| 248 | A-key | residual (a) | `const id = ˋqs_${randomUUID()}ˋ` | secret material drawn from the process-wide formula stream (src/core/crypt.ts randomBytes): deterministic from a fixed seed and call order, so a key or token is predictable; decision needed |
| 249 | A-key | residual (a) | `const nonce = randomBytes(12)` | secret material drawn from the process-wide formula stream (src/core/crypt.ts randomBytes): deterministic from a fixed seed and call order, so a key or token is predictable; decision needed |
| 255 | C-stamp | replaced | `timestamp: Date.now(),` |  |
| 416 | A-key | replaced | `id: ˋmsg_${randomUUID()}ˋ,` |  |
| 417 | C-stamp | replaced | `timestamp: Date.now(),` |  |
| 446 | C-stamp | replaced | `timestamp: Date.now(),` |  |
| 483 | C-stamp | replaced | `timestamp: Date.now(),` |  |

### `src/mcp/uuid-programmable-core.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 76 | C-stamp | replaced | `timestamp: new Date().toISOString()` |  |
| 96 | C-stamp | replaced | `timestamp: new Date().toISOString()` |  |

### `src/mcp/whitepaper-generator.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 90 | C-stamp | replaced | `date: new Date().toISOString(),` |  |
| 137 | C-stamp | replaced | `date: new Date().toISOString(),` |  |

### `src/ml/auto.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 34 | C-stamp | replaced | `this.window.push({ val, ts: Date.now() })` |  |
| 70 | C-stamp | replaced | `ts: Date.now(),` |  |
| 162 | C-stamp | replaced | `this.costs.push({ val: cost, ts: Date.now() })` |  |

### `src/optimization/index.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 98 | C-time | replaced | `const startTime = performance.now()` |  |
| 135 | C-time | replaced | `const sampleEndTime = performance.now()` |  |

### `src/optimization/jit-compiler.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 163 | C-stamp | replaced | `compiledAt: Date.now(),` |  |

### `src/optimization/latency-profiler.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 57 | C-time | replaced | `private startTime = Date.now()` |  |
| 171 | C-stamp | replaced | `timestamp: Date.now(),` |  |
| 225 | C-time | replaced | `const cutoff = Date.now() - windowMs` |  |
| 243 | C-time | replaced | `this.startTime = Date.now()` |  |
| 252 | C-stamp | replaced | `timestamp: Date.now(),` |  |
| 253 | C-time | replaced | `uptime: Date.now() - this.startTime,` |  |

### `src/optimization/memory-pool.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 49 | C-time | replaced | `const gcStart = performance.now()` |  |
| 60 | C-time | replaced | `const gcTime = performance.now() - gcStart` |  |
| 92 | C-time | replaced | `(this.stats.allocations + this.stats.deallocations) / (Date.now() / 1000 + 0.001)` |  |

### `src/optimization/parallel-executor.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 47 | C-time | replaced | `const start = performance.now()` |  |
| 49 | C-time | replaced | `const elapsed = performance.now() - start` |  |
| 135 | C-time | replaced | `const startTime = performance.now()` |  |
| 148 | C-time | replaced | `const totalTime = performance.now() - startTime` |  |

### `src/patterns/resilience.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 37 | D | kept (d) | `const elapsed = Date.now() - this.lastFailure` | circuit-breaker reset (operational; decides fail-fast) |
| 71 | D | kept (d) | `this.lastFailure = Date.now()` | circuit-breaker reset (operational; decides fail-fast) |

### `src/payload/plugins/chat-search.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 420 | C-time | replaced | `const t0 = Date.now()` |  |
| 425 | C-time | replaced | `ms: Date.now() - t0,` |  |
| 432 | C-time | replaced | `const t0 = Date.now()` |  |
| 437 | C-time | replaced | `ms: Date.now() - t0,` |  |
| 444 | C-time | replaced | `const t0 = Date.now()` |  |
| 449 | C-time | replaced | `ms: Date.now() - t0,` |  |
| 456 | C-time | replaced | `const t0 = Date.now()` |  |
| 462 | C-time | replaced | `ms: Date.now() - t0,` |  |
| 468 | C-time | replaced | `const t0 = Date.now()` |  |
| 474 | C-time | replaced | `ms: Date.now() - t0,` |  |
| 480 | C-time | replaced | `const t0 = Date.now()` |  |
| 486 | C-time | replaced | `ms: Date.now() - t0,` |  |
| 494 | C-time | replaced | `const t0 = Date.now()` |  |
| 500 | C-time | replaced | `ms: Date.now() - t0,` |  |
| 506 | C-time | replaced | `const t0 = Date.now()` |  |
| 523 | C-time | replaced | `ms: Date.now() - t0,` |  |
| 528 | C-time | replaced | `hops.push({ dir: 'outside-in', layer: 'tools/list', holds: false, ms: Date.now() - t0, note: String(` |  |
| 532 | C-time | replaced | `const t0 = Date.now()` |  |
| 557 | C-time | replaced | `ms: Date.now() - t0,` |  |
| 566 | C-time | replaced | `ms: Date.now() - t0,` |  |
| 572 | C-time | replaced | `const t0 = Date.now()` |  |
| 583 | C-time | replaced | `ms: Date.now() - t0,` |  |
| 588 | C-time | replaced | `hops.push({ dir: 'outside-in', layer: 'GET /api/qpu/chat', holds: false, ms: Date.now() - t0, note: ` |  |

### `src/payload/plugins/cloudflare-account.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 23 | C-time | replaced | `const t0 = Date.now()` |  |
| 32 | C-time | replaced | `return { ok: true, stdout: stripAnsi(stdout), stderr: '', ms: Date.now() - t0 }` |  |
| 39 | C-time | replaced | `ms: Date.now() - t0,` |  |

### `src/payload/plugins/exam.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 35 | C-time | replaced | `const t0 = Date.now()` |  |
| 44 | C-time | replaced | `return { ok: true, value, ms: Date.now() - t0 }` |  |
| 48 | C-time | replaced | `return { ok: false, ms: Date.now() - t0, timeout, error: String(err?.message ?? e) }` |  |
| 79 | C-time | replaced | `const t0 = Date.now()` |  |
| 83 | C-time | replaced | `hex: r.hex ?? null, ms: Date.now() - t0, holds: r.holds === true, value: r.value,` |  |
| 89 | C-time | replaced | `const t0 = Date.now()` |  |
| 92 | C-time | replaced | `hops.push(hopFail({ dir: 'inside-out', layer: 'hex-mint', family: 'clay', formula: 'riemann', ms: Da` |  |
| 159 | C-time | replaced | `const t0 = Date.now()` |  |
| 163 | C-time | replaced | `ms: Date.now() - t0, holds: doors.holds === true, value: doors.reachable,` |  |
| 169 | C-time | replaced | `const t0 = Date.now()` |  |
| 173 | C-time | replaced | `ms: Date.now() - t0, holds: fused.length > 0, value: fused.length,` |  |
| 179 | C-time | replaced | `const t0 = Date.now()` |  |
| 184 | C-time | replaced | `ms: Date.now() - t0, holds: tools.length <= 16 && bytes < 16384 && tools.every((t) => !t.name.starts` |  |
| 191 | C-time | replaced | `const t0 = Date.now()` |  |
| 195 | C-time | replaced | `ms: Date.now() - t0, holds: h.holds === true, value: h.rows.length,` |  |
| 204 | C-time | replaced | `const t0 = Date.now()` |  |
| 208 | C-time | replaced | `ms: Date.now() - t0, holds: h.holds === true, value: h.rows.length,` |  |

### `src/payload/plugins/gate-court.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 122 | C-time | replaced | `const t0 = Date.now()` |  |
| 191 | C-time | replaced | `ms: Math.max(0, Date.now() - t0),` |  |
| 375 | C-time | replaced | `const t0 = Date.now()` |  |
| 392 | C-time | replaced | `const ms = Math.max(0, Date.now() - t0)` |  |

### `src/payload/plugins/raid-compare.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 23 | C-time | replaced | `const t0 = performance.now()` |  |
| 25 | C-time | replaced | `return { value, ms: Math.round((performance.now() - t0) * 1000) / 1000 }` |  |

### `src/payload/plugins/tenants.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 225 | C-time | replaced | `const t0 = Date.now()` |  |
| 253 | C-time | replaced | `served: { tenant: null as string \| null, model: 'catalog' as string \| null, needs: rows.length, ms` |  |
| 278 | C-time | replaced | `served: { tenant: null, model: null, needs: [] as string[], ms: Date.now() - t0 },` |  |
| 322 | C-time | replaced | `ms: Date.now() - t0,` |  |

### `src/payload/plugins/tokens.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 376 | C-time | replaced | `const t0 = performance.now()` |  |
| 404 | C-time | replaced | `const wallMs = Math.round(performance.now() - t0)` |  |
| 585 | C-time | replaced | `const t0 = Date.now()` |  |
| 602 | C-time | replaced | `note: ˋhost tools/list ${Array.isArray(tools) ? tools.length : 0} doors in ${Date.now() - t0}ms; sea` |  |
| 604 | C-time | replaced | `usage: tokenUsageOf(target, { doors: Array.isArray(tools) ? tools.length : 0, ms: Date.now() - t0 })` |  |

### `src/payload/plugins/wave.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 143 | C-time | replaced | `const t0 = Date.now()` |  |
| 145 | C-time | replaced | `const wallMs = Date.now() - t0` |  |

### `src/production.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 10 | D | kept (d) | `const now = Date.now()` | rate-limit window (operational; decides rejection) |
| 38 | D | kept (d) | `if (Date.now() - this.openedAt > resetMs) {` | rate-limit window (operational; decides rejection) |
| 55 | D | kept (d) | `this.openedAt = Date.now()` | rate-limit window (operational; decides rejection) |
| 69 | D | kept (d) | `entry.lastUsed = Date.now()` | rate-limit window (operational; decides rejection) |
| 74 | D | kept (d) | `this.keys.set(key, { limit: rpsLimit, lastUsed: Date.now() })` | rate-limit window (operational; decides rejection) |

### `src/quantum/aws-braket.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 148 | C-id | replaced | `const taskArn = ˋarn:aws:braket:${this.region}:123456789012:task/${Date.now()}-${__suffix()}ˋ` |  |
| 153 | C-stamp | replaced | `createdAt: Date.now()` |  |
| 172 | C-stamp | replaced | `t.completedAt = Date.now()` |  |

### `src/quantum/ibm-qiskit.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 95 | C-id | replaced | `const jobId = ˋibm-${Date.now()}-${__suffix()}ˋ` |  |
| 101 | C-stamp | replaced | `createdAt: Date.now()` |  |
| 116 | C-stamp | replaced | `j.completedAt = Date.now()` |  |

### `src/quantum/ionq-connector.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 92 | C-id | replaced | `const jobId = ˋionq_${Date.now()}_${__suffix()}ˋ` |  |
| 97 | C-stamp | replaced | `submittedAt: Date.now()` |  |
| 113 | C-stamp | replaced | `j.completedAt = Date.now()` |  |
| 160 | C-stamp | replaced | `timestamp: Date.now()` |  |

### `src/quantum/kernel/index.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 50 | C-time | replaced | `const batchExecute=(count:number)=>{const s=Date.now();for(let i=0;i<count;i++)unified();const ms=Da` |  |
| 51 | C-time | replaced | `const microseconds=(f:()=>unknown,reps=1000)=>{const s=performance.now();for(let i=0;i<reps;i++)f();` |  |

### `src/quantum/processing/unit/circuit.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 156 | C-time | ref | `typeof performance.now === 'function'` | feature check on performance.now; reads no clock |

### `src/quantum/processing/unit/docdb.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 203 | C-stamp | residual (c) | `case '$currentDate': setPath(out, path, new Date().toISOString()); break` | record timestamp required by the storage contract (Payload createdAt/updatedAt; MongoDB $currentDate); decision needed |

### `src/quantum/processing/unit/index.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 4751 | ref | ref | `// so a document's identity recomputes to itself on any machine at any time — the determinism law, n` | import or comment; no draw or read |

### `src/quantum/processing/unit/receipt.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 147 | C-time | replaced | `time: { totalNs, unit: 'ns', clock: 'process.hrtime' },` |  |

### `src/quantum/processing/unit/receipted.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 165 | C-time | replaced | `const started = process.hrtime.bigint()` |  |
| 169 | C-time | replaced | `const ns = Number(process.hrtime.bigint() - started)` |  |

### `src/quantum/quantum-executor.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 129 | C-time | replaced | `const startTime = Date.now()` |  |
| 152 | C-time | replaced | `duration: Date.now() - startTime,` |  |
| 182 | C-time | replaced | `duration: Date.now() - startTime,` |  |
| 222 | C-time | replaced | `duration: Date.now() - startTime,` |  |
| 259 | C-time | replaced | `duration: Date.now() - startTime,` |  |
| 271 | C-time | replaced | `startTime: number = Date.now()` |  |
| 304 | C-time | replaced | `duration: Date.now() - startTime,` |  |
| 316 | D | kept (d) | `const t0 = Date.now()` | job poll deadline (operational) |
| 317 | D | kept (d) | `while (Date.now() - t0 < deadlineMs) {` | job poll deadline (operational) |

### `src/seed/index.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 133 | C-stamp | replaced | `await payload.kv.set(ˋseed:error:${fingerprint}ˋ, { message: String((e as { message?: string })?.mes` |  |

### `src/utilities/formula-routing.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 276 | C-stamp | replaced | `lastmod: new Date().toISOString().split('T')[0],` |  |

### `src/utilities/workers-crypto.ts`

| line | category | status | site (at the commit before the change) | note |
|---:|---|---|---|---|
| 2 | ref | ref | `import { pbkdf2Sha256, pbkdf2Sha512, randomBytes as formulaRandomBytes } from '@uuidna/qpu/core/cryp` | import or comment; no draw or read |
| 4 | ref | ref | `// Payload hashes passwords through crypto.pbkdf2 (600000 iterations, SHA-256) and salts them with c` | import or comment; no draw or read |
| 7 | ref | ref | `// Salts take platform entropy via Web Crypto getRandomValues when present — formula DRBG in core/cr` | import or comment; no draw or read |
| 32 | ref | ref | `/** Prefer Web Crypto CSPRNG for Payload salts; fall back to formula DRBG only when getRandomValues ` | import or comment; no draw or read |
| 35 | A-key | residual (a) | `const web = globalThis.crypto?.getRandomValues?.bind(globalThis.crypto)` | secret material drawn from the process-wide formula stream (src/core/crypt.ts randomBytes): deterministic from a fixed seed and call order, so a key or token is predictable; decision needed |
| 43 | ref | ref | `type Patchable = { pbkdf2: typeof qpuPbkdf2; randomBytes: typeof qpuRandomBytes }` | import or comment; no draw or read |
| 51 | ref | ref | `target.randomBytes = qpuRandomBytes` | import or comment; no draw or read |

