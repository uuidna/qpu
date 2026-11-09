# Open

What this repository leaves open. A sitemap page is classified by `sitemapLeads` in [`leads.ts`](processing/leads.ts). The layouts are [`PROCESSORS.md`](PROCESSORS.md). The algorithm names are [`ALGORITHMS.md`](ALGORITHMS.md). The thousand-bit integer is [`CRYPTO.md`](CRYPTO.md). The routes are [`LAYOUT.md`](LAYOUT.md) and [`API.md`](API.md).

## Website

`src/payload.config.ts` mounts five endpoints: `POST /sync/docs`, `POST /redeploy/website`, `GET /refresh/mdx-to-lexical`, `POST /create-release-post`, and `POST /create-release-post-from-admin`. `src/app/api` has `analytics/event`. `tsconfig.json` excludes `src/quantum`. Pages stay Payload's local API. The import is [`index.ts`](index.ts).

The registry records `/api/qpu/repos`, `/api/qpu/feeds`, `/api/qpu/accounting`, `/api/qpu/google`, and `/api/mcp`. `POST /api/mcp` is live through `qpuMcpPlugin` (`@payloadcms/plugin-mcp` via `payload.qpu.config` / `qpuPlugin`). The other `/api/qpu/*` simulator routes stay registry doors until a deploy mounts them; pages stay Payload's local API.

## Bristlecone and Foxtail

`ALL_PROCESSORS` holds six processors: Google Quantum AI's five layouts and qpu's register (`Qpu.Information.Qubit`). `DEVICES` is the same map, so the `circuit` tool and the engine client check a circuit against every one of them.

| Layout | Qubits | Couplers | Fields the object holds |
|---|---:|---:|---|
| Bristlecone | 72 | 121 | `name`, `technology`, `qubits`, `sites`, `couplers`, `statedQubits` 72, `layout` |
| Foxtail | 22 | 31 | those fields, plus `statedCouplers` 31 |

Neither object holds a gate-error field. `willowNoise` reads Willow's two chips. A circuit that asks for spec-sheet noise passes `willow_error_correction` or `willow_random_circuit_sampling`.

`cirq_google.Sycamore`, `cirq_google.Sycamore23`, and `cirq_google.devices.known_devices` are served by the `processor` tool. `cirq_google.Bristlecone` is an open lead. Foxtail is the same branch: a `cirq_google` symbol other than those three is open. The layout is still computed by the `processor` tool.

## Symbols

`leads { sitemap }` takes `{ urls: [{ loc, lastmod }] }`. A `loc` under `https://quantumai.google/` whose path a hand-written lead already names is counted in `covered` and is not repeated. A `loc` off that site, or a `lastmod` that is not a W3C date, is named in `refused`.

A reference page `reference/python/<package>/<symbol>` is one lead:

| Package | Served or partial | Open |
|---|---|---|
| `cirq` | A symbol in the implemented map is served by `circuit`, with the export and its note. `cirq.Circuit` is served. `cirq.PhasedXZGate` is served as `phasedXZGate`. | Any other symbol. The reason is that the page is in the sitemap and no tool follows it yet. |
| `cirq_google` | `Sycamore`, `Sycamore23`, and `devices/known_devices` are served by `processor`. | Any other symbol, including `Bristlecone`. |
| `openfermion` | `chem/MolecularData` and `ops/QubitOperator` are partial, tool `chemistry-simulation`. The reason is that H₂ in STO-3G is computed here and the general class is not. `transforms/jordan_wigner` is served: one fermionic term becomes Pauli strings. | Any other symbol. |

The `algorithm` tool's `name` is one of the 22 names in [`ALGORITHMS.md`](ALGORITHMS.md). A different name is rejected, and that call does not run. `vqe` on that tool sweeps ⟨Z⟩. H₂ in STO-3G is `chemistry-simulation`.

## Cofactor

`listFactors` splits \(2^{k}\pm 1\) into cyclotomic pieces, tries primes to \(2^{20}\), then the σ-reflection, then Lenstra's curves. A composite piece those doors leave is appended to `left`. The product of `factors` and `left` is checked against the integer. A general integer has no cyclotomic split: trial below \(2^{16}\), Miller–Rabin, then the σ-reflection. The same rule names whatever remains.

\(2^{999}+1\) completes with `left` empty. The product check and the factor count are [`CRYPTO.md`](CRYPTO.md). A leftover on any other integer stays in `left` under its own value. The order door for that part is `algorithm { name: 'order', N }`. `textbook_rsa_beyond_bound` is \(2^{4} < 21 < 2^{5}\) and \(5 < 2048\).

`createImpossible` mints \(N = p \cdot q\) with the witness \(a = (p+q)/2\). `decodeImpossible` splits that \(N\) in one reflection when the witness is the one that was minted. A wrong witness decodes nothing. An unknown semiprime is not given factors.
