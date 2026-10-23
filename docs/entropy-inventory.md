# Entropy and clock inventory

Every line in `src/` and `scripts/` (non-test, plus `src/families/heat/test.ts`, which is a fixture inside src) that draws randomness or reads the clock. Found by `grep -rnE` over `src` and `scripts` for `Math.random`, `randomBytes`, `randomUUID`, `randomInt`, `getRandomValues`, `Date.now()`, `new Date(`, `performance.now`, `process.hrtime`. Each row is one line; comments and imports are listed as `ref` so the count is complete.

Categories follow the brief: (a) randomness or clock that decides output, (b) randomness used only for test inputs, (c) clock reads that feed a reported number, (d) clock reads used only for operational timeouts. Categories `A-key` and `C-id` are sub-cases of (a) and (c) that the table makes visible.

## Totals (before any change)

| category | meaning | sites |
|---|---|---:|
| A-decide | (a) randomness or clock decides an output | 19 |
| A-key | (a) secret key material: keys, nonces, salts, session secrets | 19 |
| B-test | (b) random test inputs | 14 |
| C-time | (c) clock feeds a reported duration, rate or latency | 148 |
| C-stamp | (c) wall-clock timestamp written into a reported or stored record | 101 |
| C-id | (c) clock or random feeds an identifier in reported output | 14 |
| D | (d) operational: timeouts, deadlines, rate limits, TTL caches, liveness, progress logs | 46 |
| ref | import or comment only | 13 |
| **total** | | **374** |

Across 83 files. Runtime sites (everything except `ref`): 361.

## Sites by file

### `scripts/cross-check.mjs`

| line | category | site | planned action |
|---:|---|---|---|
| 37 | C-time | `const t0 = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 65 | C-stamp | `when: new Date().toISOString().slice(0, tenOf(1)),` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 68 | C-time | `seconds: Math.round((Date.now() - t0) / tenOf(3)),` | replace: timing removed from the result (no clock value is reported) |

### `scripts/develop.mjs`

| line | category | site | planned action |
|---:|---|---|---|
| 53 | C-time | `const at = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 60 | C-time | `return { family, matched: reading.matched ?? 0, read: reading.read ?? 0, funding: fund?.reading?.keyless ?? 0,` | replace: timing removed from the result (no clock value is reported) |
| 62 | C-time | `return { family, hot: true, ms: Date.now() - at, why: e.message } // hot: left for the next run (fail at risin` | replace: timing removed from the result (no clock value is reported) |

### `scripts/discover.mjs`

| line | category | site | planned action |
|---:|---|---|---|
| 16 | C-time | `const t0 = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 33 | C-stamp | `when: new Date().toISOString().slice(0, tenOf(1)),` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 54 | C-time | `console.log(JSON.stringify({ families: doc.families, runs: doc.runs, relations: doc.relationsTotal, live: doc.` | replace: timing removed from the result (no clock value is reported) |

### `scripts/examine.mjs`

| line | category | site | planned action |
|---:|---|---|---|
| 122 | C-time | `const t0 = Date.now(); const wide = (await call('crypto_shor', { n: '7'.repeat(30000), a: 2 })).sc; const ms =` | replace: timing removed from the result (no clock value is reported) |

### `scripts/fold-gpu.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 59 | C-time | `const t0 = performance.now()` | replace: timing removed from the result (no clock value is reported) |
| 79 | C-time | `const gpuMs = performance.now() - t0` | replace: timing removed from the result (no clock value is reported) |
| 82 | C-time | `const t1 = performance.now(); const want = strings.map(cpuFold); const cpuMs = performance.now() - t1` | replace: timing removed from the result (no clock value is reported) |

### `scripts/fuse-apis.mjs`

| line | category | site | planned action |
|---:|---|---|---|
| 49 | C-time | `const t0 = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 83 | D | `if (++done % tenOf(2) === 0) console.error(`${done}/${names.length} ${Math.round((Date.now() - t0) / 1000)}s`)` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 156 | C-stamp | `when: new Date().toISOString().slice(0, tenOf(1)),` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 180 | C-time | `seconds: Math.round((Date.now() - t0) / tenOf(3)),` | replace: timing removed from the result (no clock value is reported) |

### `scripts/gap-discovery-scanner.mjs`

| line | category | site | planned action |
|---:|---|---|---|
| 399 | C-stamp | `timestamp: new Date().toISOString(),` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 408 | C-id | `const resultsPath = path.join(ROOT, 'experiments-results', `gap-discovery-${new Date().toISOString().split('T'` | replace: deterministic identifier (content hash or sequence) |

### `scripts/generate-combinatorial-pages.mjs`

| line | category | site | planned action |
|---:|---|---|---|
| 209 | C-stamp | `timestamp: new Date().toISOString(),` | replace: timestamp removed, or an explicit caller-supplied `at` |

### `scripts/generate.mjs`

| line | category | site | planned action |
|---:|---|---|---|
| 31 | D | `const t0 = Date.now()` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 35 | D | `console.log(`${ok ? '✓' : allowFail ? '~' : '✗'} ${label} (${((Date.now() - t0) / 1000).toFixed(1)}s, exit ${c` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |

### `scripts/heat.mjs`

| line | category | site | planned action |
|---:|---|---|---|
| 24 | C-id | `const now = Math.floor(Date.now() / tenOf(3))` | replace: deterministic identifier (content hash or sequence) |
| 142 | C-stamp | `when: new Date().toISOString().slice(0, tenOf(1)),` | replace: timestamp removed, or an explicit caller-supplied `at` |

### `scripts/payload-cloudflare.mjs`

| line | category | site | planned action |
|---:|---|---|---|
| 274 | C-stamp | `when: new Date().toISOString().slice(0, tenOf(1)),` | replace: timestamp removed, or an explicit caller-supplied `at` |

### `scripts/port.mjs`

| line | category | site | planned action |
|---:|---|---|---|
| 80 | C-time | `const t0 = performance.now()` | replace: timing removed from the result (no clock value is reported) |
| 90 | C-time | `ms: Math.round((performance.now() - t0) * tenOf(3)) / tenOf(3),` | replace: timing removed from the result (no clock value is reported) |
| 99 | C-time | `const t0 = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 101 | C-time | `const wallMs = Date.now() - t0` | replace: timing removed from the result (no clock value is reported) |
| 124 | C-time | `const tCover = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 129 | C-time | `const coverMs = Date.now() - tCover` | replace: timing removed from the result (no clock value is reported) |

### `scripts/quantum-advantage-meter.mjs`

| line | category | site | planned action |
|---:|---|---|---|
| 186 | C-stamp | `timestamp: new Date().toISOString(),` | replace: timestamp removed, or an explicit caller-supplied `at` |

### `scripts/receipt.mjs`

| line | category | site | planned action |
|---:|---|---|---|
| 23 | C-time | `const t0 = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 126 | C-time | `const seconds = Math.round((Date.now() - t0) / tenOf(3))` | replace: timing removed from the result (no clock value is reported) |
| 150 | C-stamp | `const out = { ...doc, legal, holds, when: new Date().toISOString().slice(0, tenOf(1)), host, seconds, observab` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 160 | C-stamp | `const text = `/** GENERATED by scripts/receipt.mjs registry from https://api.apis.guru/v2/list.json on ${new D` | replace: timestamp removed, or an explicit caller-supplied `at` |

### `scripts/recursive-improvement.mjs`

| line | category | site | planned action |
|---:|---|---|---|
| 136 | A-decide | `const success = Math.random() > 0.2` | replace with a deterministic computation |
| 141 | A-decide | `impact: Math.random() * 0.2,` | replace with a deterministic computation |
| 146 | A-decide | `console.log(` Impact: ${(success ? Math.random() * 20 : 0).toFixed(1)}%\n`)` | replace with a deterministic computation |
| 215 | C-stamp | `timestamp: new Date().toISOString(),` | replace: timestamp removed, or an explicit caller-supplied `at` |

### `scripts/release-pipeline.mjs`

| line | category | site | planned action |
|---:|---|---|---|
| 133 | A-decide | `const success = Math.random() > 0.05` | replace with a deterministic computation |
| 150 | A-decide | `const lintPasses = Math.random() > 0.1` | replace with a deterministic computation |
| 247 | C-id | `version: '1.0.' + Math.floor(Date.now() / tenOf(3)).toString().slice(-3),` | replace: deterministic identifier (content hash or sequence) |
| 248 | C-stamp | `timestamp: new Date().toISOString(),` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 324 | C-stamp | `timestamp: new Date().toISOString(),` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 335 | C-id | ``.release-${Math.floor(Date.now() / 1000)}.json`` | replace: deterministic identifier (content hash or sequence) |

### `scripts/site-receipt.mjs`

| line | category | site | planned action |
|---:|---|---|---|
| 38 | C-stamp | `when: new Date().toISOString().slice(0, tenOf(1)),` | replace: timestamp removed, or an explicit caller-supplied `at` |

### `scripts/use-surface.mts`

| line | category | site | planned action |
|---:|---|---|---|
| 9 | C-time | `const t0 = performance.now()` | replace: timing removed from the result (no clock value is reported) |
| 23 | ref | `const { scrypt, pbkdf2Sha512, checkPrime, randomInt, hexOf, ed25519Sign, ed25519Verify, ed25519PublicKey, rand` | none: import or comment, no draw or read |
| 62 | C-time | `const courtT0 = performance.now()` | replace: timing removed from the result (no clock value is reported) |
| 64 | C-time | `const courtMs = Math.round(performance.now() - courtT0)` | replace: timing removed from the result (no clock value is reported) |
| 116 | C-time | `const sealT0 = performance.now()` | replace: timing removed from the result (no clock value is reported) |
| 119 | C-time | `ms: Math.round(performance.now() - sealT0),` | replace: timing removed from the result (no clock value is reported) |
| 189 | B-test | `const seed = randomBytes(32)` | replace: exhaustive enumeration over a stated domain |
| 193 | B-test | `log('primes/randomInt', { p17: checkPrime(17), r: randomInt(1, 10) })` | replace: exhaustive enumeration over a stated domain |
| 204 | C-time | `console.log('ELAPSED_MS', Math.round(performance.now() - t0))` | replace: timing removed from the result (no clock value is reported) |

### `scripts/wave-sweep-grid.mts`

| line | category | site | planned action |
|---:|---|---|---|
| 58 | C-time | `const t0 = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 67 | C-time | `const wallMs = Date.now() - t0` | replace: timing removed from the result (no clock value is reported) |

### `src/audit/audit-operations.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 43 | C-id | `auditId: `audit-${Date.now()}`,` | replace: deterministic identifier (content hash or sequence) |
| 57 | C-stamp | `startTime: Date.now(),` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 97 | C-stamp | `assessmentTime: Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 136 | C-stamp | `assessmentTime: Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 178 | C-stamp | `assessmentTime: Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 215 | C-stamp | `assessmentTime: Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 252 | C-stamp | `assessmentTime: Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 285 | C-stamp | `assessmentTime: Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 323 | C-stamp | `assessmentTime: Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 363 | C-stamp | `assessmentTime: Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 404 | C-stamp | `assessmentTime: Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 445 | C-stamp | `assessmentTime: Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 493 | C-stamp | `Date.now(),` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 500 | C-stamp | `auditDate: new Date().toISOString(),` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 517 | C-stamp | `timestamp: Date.now(),` | replace: timestamp removed, or an explicit caller-supplied `at` |

### `src/cloudflare/mcp-integration.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 45 | C-stamp | `deployedAt: new Date().toISOString(),` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 66 | C-stamp | `timestamp: Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 110 | C-stamp | `createdAt: Date.now(),` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 111 | C-stamp | `expiresAt: Date.now() + 24 * 60 * 60 * 1000` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 157 | C-stamp | `timestamp: Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 175 | C-stamp | `timestamp: Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 241 | C-id | `lastRowId: Date.now(),` | replace: deterministic identifier (content hash or sequence) |
| 242 | C-stamp | `timestamp: new Date().toISOString()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 260 | C-stamp | `{ messageId: 'msg-1', recipient: 'user1', receivedAt: Date.now() }` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 289 | C-stamp | `timestamp: Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 312 | C-stamp | `timestamp: Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 407 | C-stamp | `createdAt: new Date().toISOString()` | replace: timestamp removed, or an explicit caller-supplied `at` |

### `src/cloudflare/quantum-secure-messaging.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 8 | ref | `import { randomUUID, sha256Hex } from '../core/crypt.js'` | none: import or comment, no draw or read |
| 112 | C-stamp | `const now = Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 114 | A-decide | `const messageId = `msg_${randomUUID()}`` | replace with a deterministic computation |
| 193 | C-stamp | `JSON.stringify({ messageId: message.id, deliveredAt: Date.now() }),` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 251 | C-stamp | `timestamp: Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 376 | C-stamp | `receivedAt: Date.now(),` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 490 | C-stamp | `timestamp: Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 532 | C-stamp | `propagatedAt: Date.now(),` | replace: timestamp removed, or an explicit caller-supplied `at` |

### `src/core/cache.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 30 | D | `return e ? e.exp > Date.now() : false` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 35 | D | `return e ? e.exp <= Date.now() : true` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 47 | D | `if (e.exp <= Date.now()) {` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 59 | D | `exp: Date.now() + this.ttl,` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 76 | D | `const now = Date.now()` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 93 | D | `const now = Date.now()` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |

### `src/core/crypt-attacks.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 1 | ref | `import { aeadOpen, aeadSeal, concat, ed25519PublicKey, ed25519Sign, ed25519Verify, equal, fromHex, randomBytes` | none: import or comment, no draw or read |
| 33 | B-test | `const seed = randomBytes(32)` | replace: exhaustive enumeration over a stated domain |
| 53 | B-test | `const seed = randomBytes(32)` | replace: exhaustive enumeration over a stated domain |
| 67 | B-test | `const key32 = randomBytes(32), nonce = randomBytes(12), aad = utf8('header')` | replace: exhaustive enumeration over a stated domain |
| 89 | B-test | `attack('ed25519 identity public key', 'ed25519', 16, () => smallOrderForgery(le(1n), randomBytes(32)), 'forge ` | replace: exhaustive enumeration over a stated domain |
| 90 | B-test | `attack('ed25519 order-2 public key', 'ed25519', 16, () => smallOrderForgery(le(P - 1n), randomBytes(32)), 'for` | replace: exhaustive enumeration over a stated domain |
| 95 | B-test | `attack('x25519 low-order points', 'x25519', LOW_ORDER_U.length, (i) => x25519Shared(randomBytes(32), LOW_ORDER` | replace: exhaustive enumeration over a stated domain |
| 96 | B-test | `attack('x25519 contributory', 'x25519', 4, () => equal(x25519Shared(randomBytes(32), x25519PublicKey(randomByt` | replace: exhaustive enumeration over a stated domain |
| 100 | B-test | `attack('aead wrong nonce', 'chacha20-poly1305', 1, () => aeadOpen(key32, randomBytes(12), sealed, aad) !== nul` | replace: exhaustive enumeration over a stated domain |
| 102 | B-test | `attack('chat impersonation', 'chat', 1, () => decrypts({ ...toBob, signature: ed25519Sign(randomBytes(32), con` | replace: exhaustive enumeration over a stated domain |
| 111 | B-test | `attack('drbg repetition', 'drbg', 1, () => new Set(Array.from({ length: 4096 }, () => randomUUID())).size !== ` | replace: exhaustive enumeration over a stated domain |
| 113 | B-test | `const bytes = randomBytes(1 << 17)` | replace: exhaustive enumeration over a stated domain |

### `src/core/crypt.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 34 | A-key | `export const randomBytes = (n: number): Bytes => {` | residual: secret key/nonce/salt material (decision needed, see report) |
| 40 | A-key | `export const randomUUID = (): string => {` | residual: secret key/nonce/salt material (decision needed, see report) |
| 41 | A-key | `const b = randomBytes(16)` | residual: secret key/nonce/salt material (decision needed, see report) |
| 516 | A-key | `export const randomInt = (min: number, max: number): number => {` | residual: secret key/nonce/salt material (decision needed, see report) |
| 517 | A-key | `if (!Number.isSafeInteger(min) \|\| !Number.isSafeInteger(max) \|\| max <= min) throw new Error('randomInt: ne` | residual: secret key/nonce/salt material (decision needed, see report) |
| 522 | A-key | `const r = leToBig(randomBytes(bytes))` | residual: secret key/nonce/salt material (decision needed, see report) |
| 547 | A-decide | `: Array.from({ length: rounds }, () => 2n + (leToBig(randomBytes(8)) % (N - 3n)))` | replace with a deterministic computation |
| 570 | A-key | `const n = ((leToBig(randomBytes(Math.ceil(bits / 8))) & mask) \| top) \| 1n` | residual: secret key/nonce/salt material (decision needed, see report) |
| 667 | A-key | `return createSecretKey(randomBytes(options.length / 8))` | residual: secret key/nonce/salt material (decision needed, see report) |

### `src/core/health.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 60 | D | `const now = Date.now()` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 84 | C-stamp | `ts: Date.now(),` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 109 | C-time | `const start = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 111 | C-time | `return Date.now() - start < 100` | replace: timing removed from the result (no clock value is reported) |

### `src/core/limit.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 25 | D | `const now = Date.now()` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 111 | D | `const now = Date.now()` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |

### `src/core/manager.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 35 | C-time | `const start = performance.now()` | replace: timing removed from the result (no clock value is reported) |
| 45 | C-time | `const duration = performance.now() - start` | replace: timing removed from the result (no clock value is reported) |
| 50 | C-stamp | `timestamp: Date.now(),` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 62 | C-time | `const duration = performance.now() - start` | replace: timing removed from the result (no clock value is reported) |
| 66 | C-stamp | `timestamp: Date.now(),` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 82 | C-time | `const start = performance.now()` | replace: timing removed from the result (no clock value is reported) |
| 86 | C-time | `const duration = performance.now() - start` | replace: timing removed from the result (no clock value is reported) |
| 92 | C-stamp | `timestamp: Date.now(),` | replace: timestamp removed, or an explicit caller-supplied `at` |

### `src/core/obs.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 50 | D | `private flush = Date.now()` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 58 | D | `const now = Date.now()` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 148 | C-stamp | `ts: Date.now(),` | replace: timestamp removed, or an explicit caller-supplied `at` |

### `src/core/operations.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 206 | C-id | `data: { recorded: true, leadId: 'lead-' + Date.now() }` | replace: deterministic identifier (content hash or sequence) |

### `src/core/uuid-bridge.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 121 | C-stamp | `registered: new Date()` | replace: timestamp removed, or an explicit caller-supplied `at` |

### `src/core/uuid.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 90 | C-stamp | `createdAt: new Date(),` | replace: timestamp removed, or an explicit caller-supplied `at` |

### `src/db/payload-qpu.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 143 | C-stamp | `const now = () => new Date().toISOString()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 280 | C-id | `const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)` | replace: deterministic identifier (content hash or sequence) |

### `src/deployment/git-hooks.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 19 | C-time | `const t = performance.now()` | replace: timing removed from the result (no clock value is reported) |
| 21 | C-time | `return { value, seconds: Math.round((performance.now() - t) / 100) / 10 }` | replace: timing removed from the result (no clock value is reported) |

### `src/distributed/consensus.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 56 | C-stamp | `timestamp: Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 68 | C-stamp | `timestamp: Date.now(),` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 89 | C-stamp | `timestamp: Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 112 | C-stamp | `timestamp: Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 178 | C-stamp | `timestamp: Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 205 | C-stamp | `timestamp: Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 242 | D | `const startTime = Date.now()` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 260 | D | `if (Date.now() - startTime > timeout) {` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 282 | D | `const startTime = Date.now()` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 285 | D | `if (Date.now() - startTime > timeout) {` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 319 | C-stamp | `timestamp: Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |

### `src/distributed/distributed-executor.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 86 | C-time | `const startTime = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 92 | C-time | `const duration = Date.now() - startTime` | replace: timing removed from the result (no clock value is reported) |
| 100 | C-stamp | `timestamp: Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 103 | C-time | `const duration = Date.now() - startTime` | replace: timing removed from the result (no clock value is reported) |
| 111 | C-stamp | `timestamp: Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 134 | C-stamp | `timestamp: Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |

### `src/distributed/formula-router.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 63 | D | `if (cached && Date.now() - cached.priority < 10000) {` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 90 | A-decide | `route.priority = Date.now()` | replace with a deterministic computation |
| 127 | A-decide | `priority: Date.now(),` | replace with a deterministic computation |
| 150 | A-decide | `priority: Date.now(),` | replace with a deterministic computation |
| 176 | A-decide | `priority: Date.now(),` | replace with a deterministic computation |
| 261 | A-decide | `priority: Date.now(),` | replace with a deterministic computation |
| 276 | A-decide | `priority: Date.now(),` | replace with a deterministic computation |

### `src/distributed/node-registry.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 32 | C-stamp | `lastSync: Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 80 | D | `lastHeartbeat: Date.now(),` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 105 | D | `lastHeartbeat: Date.now(),` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 128 | D | `existing.lastHeartbeat = Date.now()` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 144 | C-id | `id: `node-join-${Date.now()}`,` | replace: deterministic identifier (content hash or sequence) |
| 147 | C-stamp | `timestamp: Date.now(),` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 169 | C-id | `id: `node-leave-${Date.now()}`,` | replace: deterministic identifier (content hash or sequence) |
| 172 | C-stamp | `timestamp: Date.now(),` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 183 | D | `n => n.status === 'healthy' && Date.now() - n.lastHeartbeat < 30000` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 288 | D | `const timeSinceHeartbeat = Date.now() - node.lastHeartbeat` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 318 | D | `const now = Date.now()` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 328 | C-id | `id: `heartbeat-${Date.now()}`,` | replace: deterministic identifier (content hash or sequence) |
| 331 | C-stamp | `timestamp: Date.now(),` | replace: timestamp removed, or an explicit caller-supplied `at` |

### `src/distributed/state-sync.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 49 | C-stamp | `timestamp: Date.now(),` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 79 | C-stamp | `timestamp: Date.now(),` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 169 | C-stamp | `timestamp: Date.now(),` | replace: timestamp removed, or an explicit caller-supplied `at` |

### `src/families/heat/index.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 114 | A-decide | `const once = async (run: () => unknown) => { const t = performance.now(); try { await run() } catch { /* an in` | replace with a deterministic computation |
| 116 | A-decide | `const start = performance.now()` | replace with a deterministic computation |
| 124 | A-decide | `const frozen = performance.now() - start === 0` | replace with a deterministic computation |
| 126 | A-decide | `return heatCross('heat-slow', 'physics', `slow(${family}.${formula.name}) = its slowest steady-state run in ms` | replace with a deterministic computation |

### `src/families/heat/test.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 44 | B-test | `qpuHexRegisterOf('zzslow', 'spin', () => { const t = performance.now(); while (performance.now() - t < 3 * fac` | replace: exhaustive enumeration over a stated domain |

### `src/families/holo/index.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 1 | ref | `import { concat, ed25519PublicKey, ed25519Sign, ed25519Verify, equal, fromHex, hexOf, hkdf, randomBytes, sha25` | none: import or comment, no draw or read |
| 55 | A-key | `constructor(scales: readonly string[], seed: Bytes = randomBytes(32)) {` | residual: secret key/nonce/salt material (decision needed, see report) |

### `src/families/signal/index.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 3 | ref | `import { randomBytes as qpuRandomBytes } from '../../core/crypt.js'` | none: import or comment, no draw or read |
| 93 | C-stamp | `return { id: `sig-${hash}`, payload: data, dims: key.bits.length, hash, verified: false, timestamp: Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |

### `src/families/wave/index.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 79 | C-time | `const at = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 92 | C-time | `const timed = await Promise.all(launched.map(async (l) => { const t = Date.now(); const a = await agentOf(fami` | replace: timing removed from the result (no clock value is reported) |
| 94 | C-time | `const ms = Math.max(1, Date.now() - at)` | replace: timing removed from the result (no clock value is reported) |
| 96 | C-time | `const liveAt = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 98 | C-time | `const liveMs = Math.max(0, Date.now() - liveAt)` | replace: timing removed from the result (no clock value is reported) |

### `src/harmony/orchestrator.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 48 | C-stamp | `timestamp: Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 363 | C-time | `const start = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 368 | C-time | `node.metrics.avgLatency = (node.metrics.avgLatency * (node.metrics.callCount - 1) + (Date.now() - start)) / no` | replace: timing removed from the result (no clock value is reported) |

### `src/integrations/kafka-client.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 83 | C-stamp | `timestamp: Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 133 | D | `const startTime = Date.now()` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 136 | D | `while (Date.now() - startTime < (opts.timeout \|\| 5000)) {` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |

### `src/mcp/api-door.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 48 | D | `if (registry && Date.now() - registry.at < WINDOW) return registry` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 53 | D | `return (registry = { at: Date.now(), names: Object.keys(entries).sort(), entries })` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 85 | D | `if (hit && Date.now() - hit.at < WINDOW) return hit.api` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 101 | D | `specs.set(api, { at: Date.now(), api: promise })` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 160 | C-time | `const t0 = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 168 | C-time | `if (declared > EXCERPT * 64) return sealed({ ...base, url, status: r.status, type, bytes: declared, excerpt: `` | replace: timing removed from the result (no clock value is reported) |
| 172 | C-time | `return sealed({ ...base, url, status: r.status, type, bytes: text.length, excerpt, seconds: (Date.now() - t0) ` | replace: timing removed from the result (no clock value is reported) |
| 174 | C-time | `return sealed({ ...base, url, seconds: (Date.now() - t0) / 1000, why: (e as Error).name === 'TimeoutError' ? '` | replace: timing removed from the result (no clock value is reported) |

### `src/mcp/cli.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 52 | C-time | `const t = performance.now()` | replace: timing removed from the result (no clock value is reported) |
| 54 | C-time | `const ms = performance.now() - t, out = r.structuredContent ?? r.content` | replace: timing removed from the result (no clock value is reported) |

### `src/mcp/formulas-receipt.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 21 | C-time | `const loadSeconds = Math.round(performance.now() / 100) / 10` | replace: timing removed from the result (no clock value is reported) |
| 45 | C-time | `const t = performance.now()` | replace: timing removed from the result (no clock value is reported) |
| 47 | C-time | `return { value, ms: performance.now() - t }` | replace: timing removed from the result (no clock value is reported) |
| 161 | C-stamp | `when: new Date().toISOString().slice(0, 10),` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 204 | C-stamp | `when: new Date().toISOString().slice(0, 10),` | replace: timestamp removed, or an explicit caller-supplied `at` |

### `src/mcp/print-all.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 191 | C-stamp | `when: new Date().toISOString().slice(0, 10),` | replace: timestamp removed, or an explicit caller-supplied `at` |

### `src/mcp/qpu-fused.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 372 | A-decide | `const t0 = Date.now()` | replace with a deterministic computation |
| 378 | A-decide | `for (let p = 2; p <= pages && Date.now() - t0 < DEADLINE; p++) {` | replace with a deterministic computation |
| 414 | C-time | `const sitemapAt = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 416 | C-time | `const sitemapMs = Date.now() - sitemapAt` | replace: timing removed from the result (no clock value is reported) |
| 420 | C-time | `const at = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 426 | C-time | `return { path, status: r.status, title, page, ms: Date.now() - at }` | replace: timing removed from the result (no clock value is reported) |
| 428 | C-time | `return { path, status: 0, title: '', page: false, ms: Date.now() - at, error: (e as Error).message }` | replace: timing removed from the result (no clock value is reported) |
| 1214 | D | `if (hit && Date.now() - hit.at < WINDOW) return hit.value as ReturnType<typeof readOf>` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 1216 | D | `cache.set(key, { at: Date.now(), value })` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 1224 | D | `if (Date.now() < offlineUntil)` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 1234 | D | `if (f.why === 'offline') offlineUntil = Date.now() + OFFLINE_WINDOW` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |

### `src/mcp/secure-chat-rbac.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 10 | ref | `import { aeadOpen, aeadSeal, concat, ed25519PublicKey, ed25519Sign, ed25519Verify, hexOf, hkdf, randomBytes, r` | none: import or comment, no draw or read |
| 120 | A-key | `const tokenId = `token_${hexOf(randomBytes(24))}`` | residual: secret key/nonce/salt material (decision needed, see report) |
| 121 | C-stamp | `const now = Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 141 | D | `if (Date.now() > context.expiresAt) {` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 205 | A-key | `const agree = randomBytes(32)` | residual: secret key/nonce/salt material (decision needed, see report) |
| 206 | A-key | `const sign = randomBytes(32)` | residual: secret key/nonce/salt material (decision needed, see report) |
| 207 | A-key | `const phase = randomBytes(4)` | residual: secret key/nonce/salt material (decision needed, see report) |
| 209 | A-key | `id: `qk_${randomUUID()}`,` | residual: secret key/nonce/salt material (decision needed, see report) |
| 212 | A-key | `quantumEntanglement: `entangle_${userId}_${randomUUID()}`,` | residual: secret key/nonce/salt material (decision needed, see report) |
| 214 | D | `expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 248 | A-key | `const id = `qs_${randomUUID()}`` | residual: secret key/nonce/salt material (decision needed, see report) |
| 249 | A-key | `const nonce = randomBytes(12)` | residual: secret key/nonce/salt material (decision needed, see report) |
| 255 | C-stamp | `timestamp: Date.now(),` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 416 | A-key | `id: `msg_${randomUUID()}`,` | residual: secret key/nonce/salt material (decision needed, see report) |
| 417 | C-stamp | `timestamp: Date.now(),` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 446 | C-stamp | `timestamp: Date.now(),` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 483 | C-stamp | `timestamp: Date.now(),` | replace: timestamp removed, or an explicit caller-supplied `at` |

### `src/mcp/uuid-programmable-core.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 76 | C-stamp | `timestamp: new Date().toISOString()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 96 | C-stamp | `timestamp: new Date().toISOString()` | replace: timestamp removed, or an explicit caller-supplied `at` |

### `src/mcp/whitepaper-generator.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 90 | C-stamp | `date: new Date().toISOString(),` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 137 | C-stamp | `date: new Date().toISOString(),` | replace: timestamp removed, or an explicit caller-supplied `at` |

### `src/ml/auto.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 34 | C-stamp | `this.window.push({ val, ts: Date.now() })` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 70 | C-stamp | `ts: Date.now(),` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 162 | C-stamp | `this.costs.push({ val: cost, ts: Date.now() })` | replace: timestamp removed, or an explicit caller-supplied `at` |

### `src/optimization/index.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 98 | C-time | `const startTime = performance.now()` | replace: timing removed from the result (no clock value is reported) |
| 135 | C-time | `const sampleEndTime = performance.now()` | replace: timing removed from the result (no clock value is reported) |

### `src/optimization/jit-compiler.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 163 | C-stamp | `compiledAt: Date.now(),` | replace: timestamp removed, or an explicit caller-supplied `at` |

### `src/optimization/latency-profiler.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 57 | C-time | `private startTime = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 171 | C-stamp | `timestamp: Date.now(),` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 225 | C-time | `const cutoff = Date.now() - windowMs` | replace: timing removed from the result (no clock value is reported) |
| 243 | C-time | `this.startTime = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 252 | C-stamp | `timestamp: Date.now(),` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 253 | C-time | `uptime: Date.now() - this.startTime,` | replace: timing removed from the result (no clock value is reported) |

### `src/optimization/memory-pool.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 49 | C-time | `const gcStart = performance.now()` | replace: timing removed from the result (no clock value is reported) |
| 60 | C-time | `const gcTime = performance.now() - gcStart` | replace: timing removed from the result (no clock value is reported) |
| 92 | C-time | `(this.stats.allocations + this.stats.deallocations) / (Date.now() / 1000 + 0.001)` | replace: timing removed from the result (no clock value is reported) |

### `src/optimization/parallel-executor.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 47 | C-time | `const start = performance.now()` | replace: timing removed from the result (no clock value is reported) |
| 49 | C-time | `const elapsed = performance.now() - start` | replace: timing removed from the result (no clock value is reported) |
| 135 | C-time | `const startTime = performance.now()` | replace: timing removed from the result (no clock value is reported) |
| 148 | C-time | `const totalTime = performance.now() - startTime` | replace: timing removed from the result (no clock value is reported) |

### `src/patterns/resilience.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 37 | D | `const elapsed = Date.now() - this.lastFailure` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 71 | D | `this.lastFailure = Date.now()` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |

### `src/payload/plugins/chat-search.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 420 | C-time | `const t0 = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 425 | C-time | `ms: Date.now() - t0,` | replace: timing removed from the result (no clock value is reported) |
| 432 | C-time | `const t0 = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 437 | C-time | `ms: Date.now() - t0,` | replace: timing removed from the result (no clock value is reported) |
| 444 | C-time | `const t0 = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 449 | C-time | `ms: Date.now() - t0,` | replace: timing removed from the result (no clock value is reported) |
| 456 | C-time | `const t0 = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 462 | C-time | `ms: Date.now() - t0,` | replace: timing removed from the result (no clock value is reported) |
| 468 | C-time | `const t0 = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 474 | C-time | `ms: Date.now() - t0,` | replace: timing removed from the result (no clock value is reported) |
| 480 | C-time | `const t0 = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 486 | C-time | `ms: Date.now() - t0,` | replace: timing removed from the result (no clock value is reported) |
| 494 | C-time | `const t0 = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 500 | C-time | `ms: Date.now() - t0,` | replace: timing removed from the result (no clock value is reported) |
| 506 | C-time | `const t0 = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 523 | C-time | `ms: Date.now() - t0,` | replace: timing removed from the result (no clock value is reported) |
| 528 | C-time | `hops.push({ dir: 'outside-in', layer: 'tools/list', holds: false, ms: Date.now() - t0, note: String(e) })` | replace: timing removed from the result (no clock value is reported) |
| 532 | C-time | `const t0 = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 557 | C-time | `ms: Date.now() - t0,` | replace: timing removed from the result (no clock value is reported) |
| 566 | C-time | `ms: Date.now() - t0,` | replace: timing removed from the result (no clock value is reported) |
| 572 | C-time | `const t0 = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 583 | C-time | `ms: Date.now() - t0,` | replace: timing removed from the result (no clock value is reported) |
| 588 | C-time | `hops.push({ dir: 'outside-in', layer: 'GET /api/qpu/chat', holds: false, ms: Date.now() - t0, note: String(e) ` | replace: timing removed from the result (no clock value is reported) |

### `src/payload/plugins/cloudflare-account.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 23 | C-time | `const t0 = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 32 | C-time | `return { ok: true, stdout: stripAnsi(stdout), stderr: '', ms: Date.now() - t0 }` | replace: timing removed from the result (no clock value is reported) |
| 39 | C-time | `ms: Date.now() - t0,` | replace: timing removed from the result (no clock value is reported) |

### `src/payload/plugins/exam.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 35 | C-time | `const t0 = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 44 | C-time | `return { ok: true, value, ms: Date.now() - t0 }` | replace: timing removed from the result (no clock value is reported) |
| 48 | C-time | `return { ok: false, ms: Date.now() - t0, timeout, error: String(err?.message ?? e) }` | replace: timing removed from the result (no clock value is reported) |
| 79 | C-time | `const t0 = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 83 | C-time | `hex: r.hex ?? null, ms: Date.now() - t0, holds: r.holds === true, value: r.value,` | replace: timing removed from the result (no clock value is reported) |
| 89 | C-time | `const t0 = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 92 | C-time | `hops.push(hopFail({ dir: 'inside-out', layer: 'hex-mint', family: 'clay', formula: 'riemann', ms: Date.now() -` | replace: timing removed from the result (no clock value is reported) |
| 159 | C-time | `const t0 = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 163 | C-time | `ms: Date.now() - t0, holds: doors.holds === true, value: doors.reachable,` | replace: timing removed from the result (no clock value is reported) |
| 169 | C-time | `const t0 = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 173 | C-time | `ms: Date.now() - t0, holds: fused.length > 0, value: fused.length,` | replace: timing removed from the result (no clock value is reported) |
| 179 | C-time | `const t0 = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 184 | C-time | `ms: Date.now() - t0, holds: tools.length <= 16 && bytes < 16384 && tools.every((t) => !t.name.startsWith('qpu_` | replace: timing removed from the result (no clock value is reported) |
| 191 | C-time | `const t0 = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 195 | C-time | `ms: Date.now() - t0, holds: h.holds === true, value: h.rows.length,` | replace: timing removed from the result (no clock value is reported) |
| 204 | C-time | `const t0 = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 208 | C-time | `ms: Date.now() - t0, holds: h.holds === true, value: h.rows.length,` | replace: timing removed from the result (no clock value is reported) |

### `src/payload/plugins/gate-court.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 122 | C-time | `const t0 = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 191 | C-time | `ms: Math.max(0, Date.now() - t0),` | replace: timing removed from the result (no clock value is reported) |
| 375 | C-time | `const t0 = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 392 | C-time | `const ms = Math.max(0, Date.now() - t0)` | replace: timing removed from the result (no clock value is reported) |

### `src/payload/plugins/raid-compare.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 23 | C-time | `const t0 = performance.now()` | replace: timing removed from the result (no clock value is reported) |
| 25 | C-time | `return { value, ms: Math.round((performance.now() - t0) * 1000) / 1000 }` | replace: timing removed from the result (no clock value is reported) |

### `src/payload/plugins/tenants.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 225 | C-time | `const t0 = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 253 | C-time | `served: { tenant: null as string \| null, model: 'catalog' as string \| null, needs: rows.length, ms: Date.now` | replace: timing removed from the result (no clock value is reported) |
| 278 | C-time | `served: { tenant: null, model: null, needs: [] as string[], ms: Date.now() - t0 },` | replace: timing removed from the result (no clock value is reported) |
| 322 | C-time | `ms: Date.now() - t0,` | replace: timing removed from the result (no clock value is reported) |

### `src/payload/plugins/tokens.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 376 | C-time | `const t0 = performance.now()` | replace: timing removed from the result (no clock value is reported) |
| 404 | C-time | `const wallMs = Math.round(performance.now() - t0)` | replace: timing removed from the result (no clock value is reported) |
| 585 | C-time | `const t0 = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 602 | C-time | `note: `host tools/list ${Array.isArray(tools) ? tools.length : 0} doors in ${Date.now() - t0}ms; sealed=${!sec` | replace: timing removed from the result (no clock value is reported) |
| 604 | C-time | `usage: tokenUsageOf(target, { doors: Array.isArray(tools) ? tools.length : 0, ms: Date.now() - t0 }),` | replace: timing removed from the result (no clock value is reported) |

### `src/payload/plugins/wave.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 143 | C-time | `const t0 = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 145 | C-time | `const wallMs = Date.now() - t0` | replace: timing removed from the result (no clock value is reported) |

### `src/production.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 10 | D | `const now = Date.now()` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 38 | D | `if (Date.now() - this.openedAt > resetMs) {` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 55 | D | `this.openedAt = Date.now()` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 69 | D | `entry.lastUsed = Date.now()` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 74 | D | `this.keys.set(key, { limit: rpsLimit, lastUsed: Date.now() })` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |

### `src/quantum/aws-braket.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 148 | C-id | `const taskArn = `arn:aws:braket:${this.region}:123456789012:task/${Date.now()}-${__suffix()}`` | replace: deterministic identifier (content hash or sequence) |
| 153 | C-stamp | `createdAt: Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 172 | C-stamp | `t.completedAt = Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |

### `src/quantum/ibm-qiskit.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 95 | C-id | `const jobId = `ibm-${Date.now()}-${__suffix()}`` | replace: deterministic identifier (content hash or sequence) |
| 101 | C-stamp | `createdAt: Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 116 | C-stamp | `j.completedAt = Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |

### `src/quantum/ionq-connector.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 92 | C-id | `const jobId = `ionq_${Date.now()}_${__suffix()}`` | replace: deterministic identifier (content hash or sequence) |
| 97 | C-stamp | `submittedAt: Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 113 | C-stamp | `j.completedAt = Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |
| 160 | C-stamp | `timestamp: Date.now()` | replace: timestamp removed, or an explicit caller-supplied `at` |

### `src/quantum/kernel/index.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 50 | C-time | `const batchExecute=(count:number)=>{const s=Date.now();for(let i=0;i<count;i++)unified();const ms=Date.now()-s` | replace: timing removed from the result (no clock value is reported) |
| 51 | C-time | `const microseconds=(f:()=>unknown,reps=1000)=>{const s=performance.now();for(let i=0;i<reps;i++)f();return Mat` | replace: timing removed from the result (no clock value is reported) |

### `src/quantum/processing/unit/circuit.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 156 | C-time | `typeof performance.now === 'function'` | replace: timing removed from the result (no clock value is reported) |

### `src/quantum/processing/unit/docdb.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 203 | C-stamp | `case '$currentDate': setPath(out, path, new Date().toISOString()); break` | replace: timestamp removed, or an explicit caller-supplied `at` |

### `src/quantum/processing/unit/index.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 4751 | ref | `// so a document's identity recomputes to itself on any machine at any time — the determinism law, not Date.no` | none: import or comment, no draw or read |

### `src/quantum/processing/unit/receipt.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 147 | C-time | `time: { totalNs, unit: 'ns', clock: 'process.hrtime' },` | replace: timing removed from the result (no clock value is reported) |

### `src/quantum/processing/unit/receipted.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 165 | C-time | `const started = process.hrtime.bigint()` | replace: timing removed from the result (no clock value is reported) |
| 169 | C-time | `const ns = Number(process.hrtime.bigint() - started)` | replace: timing removed from the result (no clock value is reported) |

### `src/quantum/quantum-executor.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 129 | C-time | `const startTime = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 152 | C-time | `duration: Date.now() - startTime,` | replace: timing removed from the result (no clock value is reported) |
| 182 | C-time | `duration: Date.now() - startTime,` | replace: timing removed from the result (no clock value is reported) |
| 222 | C-time | `duration: Date.now() - startTime,` | replace: timing removed from the result (no clock value is reported) |
| 259 | C-time | `duration: Date.now() - startTime,` | replace: timing removed from the result (no clock value is reported) |
| 271 | C-time | `startTime: number = Date.now()` | replace: timing removed from the result (no clock value is reported) |
| 304 | C-time | `duration: Date.now() - startTime,` | replace: timing removed from the result (no clock value is reported) |
| 316 | D | `const t0 = Date.now()` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |
| 317 | D | `while (Date.now() - t0 < deadlineMs) {` | keep: operational timeout, deadline, rate limit, TTL, liveness or progress log |

### `src/seed/index.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 133 | C-stamp | `await payload.kv.set(`seed:error:${fingerprint}`, { message: String((e as { message?: string })?.message ?? e)` | replace: timestamp removed, or an explicit caller-supplied `at` |

### `src/utilities/formula-routing.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 276 | C-stamp | `lastmod: new Date().toISOString().split('T')[0],` | replace: timestamp removed, or an explicit caller-supplied `at` |

### `src/utilities/workers-crypto.ts`

| line | category | site | planned action |
|---:|---|---|---|
| 2 | ref | `import { pbkdf2Sha256, pbkdf2Sha512, randomBytes as formulaRandomBytes } from '@uuidna/qpu/core/crypt.js'` | none: import or comment, no draw or read |
| 4 | ref | `// Payload hashes passwords through crypto.pbkdf2 (600000 iterations, SHA-256) and salts them with crypto.rand` | none: import or comment, no draw or read |
| 7 | ref | `// Salts take platform entropy via Web Crypto getRandomValues when present — formula DRBG in core/crypt stays` | none: import or comment, no draw or read |
| 32 | ref | `/** Prefer Web Crypto CSPRNG for Payload salts; fall back to formula DRBG only when getRandomValues is absent.` | none: import or comment, no draw or read |
| 35 | A-key | `const web = globalThis.crypto?.getRandomValues?.bind(globalThis.crypto)` | residual: secret key/nonce/salt material (decision needed, see report) |
| 43 | ref | `type Patchable = { pbkdf2: typeof qpuPbkdf2; randomBytes: typeof qpuRandomBytes }` | none: import or comment, no draw or read |
| 51 | ref | `target.randomBytes = qpuRandomBytes` | none: import or comment, no draw or read |

