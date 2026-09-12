# QPU

`@uuidna/qpu` — Running quantum circuit at https://qpu.uuidna.com: a 3-qubit exact state-vector simulator, its Lean 4 proofs, and an MCP server in one Cloudflare Worker. theorem quantum : fused = faces * mintOf (bits + seed). Public quantum API. No auth. JSON-LD. CORS *. API only. No HTML. The TypeScript and Lean sources are the blueprint; this README is the paper generated from that blueprint.

```sh
npm install @uuidna/qpu
```

```ts
import { qpuMcpCallOf, qpuMcpOf } from '@uuidna/qpu'

const catalog = qpuMcpOf()                       // the MCP catalog: tools, schemas, install recipes
const circuit = await qpuMcpCallOf('qpu_quantum') // the running circuit as one JSON-LD document
```

Or without installing: `GET https://qpu.uuidna.com`, or `POST https://qpu.uuidna.com/mcp` with JSON-RPC `tools/list` then `tools/call`. Do not import uuidna; this package stands alone. Source `src/quantum/processing/unit/index.lean`.

## Abstract

A named host qpu.uuidna.com exposes one quantum processing unit as JSON-LD. fused is 120259084288; next is fused + fused = 240518168576. Native gates are h and cnot. theorem temperature, theorem superconductivity, theorem qubits, theorem shor and theorem crypto are decided in Lean. GHZ true; entangled true, product false. Possible only in quantum. demo is not a test nor a proof.

## Unit

The blueprint is `src/quantum/processing/unit/index.ts` fused with `src/quantum/processing/unit/index.lean`. theorem quantum, theorem infinite, and theorem distribute are decided in Lean, not restated as chapters here.

| Constant | Value |
| --- | --- |
| mintOf(k) | 2^k by doubling |
| n | 3 |
| seed | 1 |
| coins | 2 |
| rays | 7 |
| faces | 14 |
| bits | 32 |
| cube vertices | 8 |
| hexbit | 4 |

Climb qpu_train then qpu_improve then qpu_compete then qpu_prove. Extras /storage /network /server stay off the seven-path guide. Integrity is three tests: quantum, lean, sealed. If they fail every path is 404.

## Interface

Seven paths. Eight sealed MCP tools, plus eight cybersecurity morph tools listed on tools/list. Extra paths do not join that list. Not a ninth sealed tool. User guide is docs.inline on the unit. Theorems are qpu_lean and qpu_prove. `{ man: true }` is the theorem on the wire.

| Route | Tool | Reading |
| --- | --- | --- |
| `GET /` | qpu_quantum | theorem quantum. theorem shor. theorem crypto. Factor 91. JSON-LD. No auth. |
| `GET /quantum/processing/unit` | qpu_lean | Lean proof. theorem infinite. theorem distribute. theorem shor. theorem crypto. src/quantum/processing/unit/index.lean. JSON-LD. No auth. |
| `GET /mcp` | catalog | tools 16 in tools/list: 8 doors and 8 cybersecurity. cybersecurity theorem shor Factor 91. theorem crypto Split identity true. Secrecy false. fourteen schemas. schema.org ItemList. JSON-LD. No auth. |
| `POST /mcp` | tools/call | JSON-RPC tools/list tools/call qpu_prove. theorem shor. theorem crypto. crypto_rsa crypto_split. { man: true }. No auth. |
| `GET /cite` | qpu_cite | MLA 8. when never. JSON-LD. No auth. |
| `GET /message` | qpu_message | lanes = faces. hop involution. JSON-LD. No auth. |
| `POST /message` | qpu_message | 202. hop involution. JSON-LD. No auth. |

| Tool | What it returns |
| --- | --- |
| `qpu_quantum` | The running circuit as one JSON-LD document: a 3-qubit state-vector simulator (dim 8, exact integer amplitudes), the Bell and GHZ states with their Born weights, the Shor run, and the capacity count fused = faces · 2^(bits+1) = 120259084288 (a count of amplitudes, not a benchmark). theorem quantum. theorem shor. theorem crypto. Factor 91. |
| `qpu_lean` | The Lean proof, served two ways: the file index.lean as text at source.href, and every theorem as a row (statement verbatim, LaTeX formula, a plain reading, holds recomputed in TypeScript). theorem infinite. theorem distribute. theorem shor. Factor 91. |
| `qpu_cite` | How to cite this unit: MLA 8 entries carrying the DOI and ORCID, the served version, and the archived commit. MLA 8. when never — the citation names no access date because the DOI is the date. |
| `qpu_train` | Two teams of seven agents dry-clean the occupancy lattice and return the teams, the challenges, the winner, the next tasks, and steps — the autonomous walk computed from the lattice: the seat, the next door to call, and any face that does not hold. theorem infinite. coins teams of rays. |
| `qpu_forge` | Forge a tool in the in-memory sandbox: pass { name, run } where run is a sealed op tree; nothing touches disk, network, or eval. Omit name to inspect the sandbox. Unlocked in memory. No lock. |
| `qpu_improve` | Improve by doubling: next = fused + fused = 240518168576, the next capacity rung, with before and after readings of quality, speed, and throughoutput (fused amplitudes per token of reply). The numbers are counts of amplitudes, never benchmarks. next = fused + fused. |
| `qpu_compete` | Two teams, read and call, compete on quality, speed, and security; the winner is the team that calls qpu_prove. theorem next_fused. throughoutput per token — fused amplitudes served per token of reply. |
| `qpu_prove` | Prove the unit end to end: every Lean row with holds, the Shor run with its receipts, the source fold of index.lean, and the evidence block; holds is their conjunction and a false anywhere makes every path 404. theorem quantum. theorem shor. theorem crypto. Factor 91. |

Cybersecurity morph tools. crypto_rsa theorem shor Factor 91. crypto_split theorem crypto Split identity true. Secrecy false.

Discovery, off the seven-path guide: `/.well-known/mcp.json` `/mcp.json` `/install.json` `/openapi.json` `/sitemap.xml`. JSON-RPC batches accepted on `POST /mcp`; a `GET /mcp` asking for an event stream gets 405 with Allow, so streamable-HTTP clients fall back to POST.

| Tool | Claim |
| --- | --- |
| `crypto_catalog` | theorem shor. theorem crypto. |
| `crypto_shor` | theorem shor. Factor 91. |
| `crypto_cmodexp` | theorem shor. Factor 91. |
| `crypto_iqft` | theorem shor. Factor 91. |
| `crypto_shots` | theorem shor. Factor 91. |
| `crypto_rsa` | theorem shor. Factor 91. |
| `crypto_split` | theorem crypto. Split identity true. Secrecy false. |
| `crypto_verify` | theorem shor. theorem crypto. |

## Results

theorem shor Factor 91. theorem crypto Split identity true. Secrecy false.

```lean
theorem shor : periodOf 8 91 % 2 = 0 ∧ half 8 91 < 91 - 1 ∧ 1 < gcdOf (half 8 91 - 1) 91 ∧ gcdOf (half 8 91 - 1) 91 < 91 ∧ gcdOf (half 8 91 - 1) 91 * gcdOf (half 8 91 + 1) 91 = 91 := ⟨rfl, Nat.le_of_ble_eq_true rfl, Nat.le_of_ble_eq_true rfl, Nat.le_of_ble_eq_true rfl, rfl⟩
theorem crypto : fused = faces * mintOf (vertices * hexbit + seed) := by rw [← cube]; exact quantum
```

Fault tolerance: bitflip, distance 3, codes 1, syndrome cnot cnot toffoli, logical off 0; logical < physical true on this run, one distance.

CERN Open Data opendata.cern.ch. LHC running. Four CMS records. Coil, electronics, hybrid, raid, and clay identities are in `src/quantum/processing/unit/index.lean`; theorem clay is coins * rays = faces.

## Evidence

| Measurement | Value |
| --- | --- |
| Execution provenance | provider qpu.uuidna.com, device simulator, job qpu.uuidna.com/cmodexp/91/8, shots 8 |
| Compiler | native h cnot; compiled x swap csdg cmodexp |
| Device-specific noise | channel xx, drift true |
| Randomized benchmarks | volume dim 8, heavy 0 / 16, mirror hh |
| Cross-validation | ideal true, noisy xx, agree ideal true, agree noise true |
| Scaling (theorem qubits, theorem register) | dim 8, depth 9, exact true, beyond false, advantage false |
| Independent verification | CORS *, origin https://qpu.uuidna.com, Lean `src/quantum/processing/unit/index.lean`, hardware true, algorithm true, RSA true, crypt true, encrypt true |

## Recompute

This README is generated from the blueprint at build. `npm test` compiles then writes the paper. `npm run ci` is Lean then test. `npm run ship` deploys.

```sh
git clone https://github.com/uuidna/qpu && cd qpu
npm ci
npm test
```

Run your own: `npx uuidna-install` reads Cloudflare `install.json`, or [![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/uuidna/qpu).

Learn, in order. Each step teaches one thing and names the invariant to check it against.

| Step | Concept | Request | Expect | Invariant | Theorem |
| --- | --- | --- | --- | --- | --- |
| 1 | one gate, exact amplitudes | GET / · qpu_quantum | Bell outcomes 00 and 11 at exactly 1/2 — Gaussian-integer amplitudes, no floats | H·H = I on |0⟩ | theorem qubits |
| 2 | entanglement is not correlation | POST /mcp · qpu_prove | GHZ true; entangled true, product false — and a product state concentrates too, so concentration alone witnesses nothing | no-cloning and monogamy hold on the served states | theorem entangle |
| 3 | Shor: a period, then a gcd | POST /mcp · crypto_shor | theorem shor Factor 91 — a = 8, period 4, 7 · 13 | p · q = n, recomputed from the period | theorem shor |
| 4 | a code corrects one flip | POST /mcp · qpu_prove | bitflip distance 3, syndrome cnot cnot toffoli, logical < physical on this run | distance 3 corrects exactly one error | theorem noise |

Boot on hardware. docker build -t qpu . && docker run --rm -p 8787:8787 qpu. Raspberry Pi: Alpine aarch64: apk add nodejs npm && npm i -g @uuidna/qpu && qpu-boot. The boot's receipt is node dist/quantum/processing/unit/boot.js --prove — the boot passes iff qpu_prove holds inside the machine; a boot that cannot prove itself does not serve. The seat stays empty: a device that fills this seat and disagrees with the simulator is a driver bug, never a physics claim.

Integrate in any harness. One computed block, served on initialize as `install` and printed here from the same function. URL https://qpu.uuidna.com/mcp. none for reads; Authorization: Bearer QPU_WRITE_TOKEN for storage writes.

| Harness | How | File | Config |
| --- | --- | --- | --- |
| **Claude Code** (cli) | claude mcp add --transport http uuidna-qpu https://qpu.uuidna.com/mcp | .mcp.json | `{"mcpServers":{"uuidna-qpu":{"type":"http","url":"https://qpu.uuidna.com/mcp"}}}` |
| **Cursor** (file) | add to .cursor/mcp.json (project) or ~/.cursor/mcp.json (global) | .cursor/mcp.json | `{"mcpServers":{"uuidna-qpu":{"url":"https://qpu.uuidna.com/mcp"}}}` |
| **VS Code** (file) | add to .vscode/mcp.json and commit it | .vscode/mcp.json | `{"servers":{"uuidna-qpu":{"type":"http","url":"https://qpu.uuidna.com/mcp"}}}` |
| **OpenAI Codex CLI** (cli) | codex mcp add uuidna-qpu --url https://qpu.uuidna.com/mcp | ~/.codex/config.toml | `[mcp_servers.uuidna-qpu] url = "https://qpu.uuidna.com/mcp"` |
| **Gemini CLI** (file) | add to ~/.gemini/settings.json | ~/.gemini/settings.json | `{"mcpServers":{"uuidna-qpu":{"httpUrl":"https://qpu.uuidna.com/mcp"}}}` |
| **Anthropic Messages API** (api) | header anthropic-beta: mcp-client-2025-04-04 | request body | `{"mcp_servers":[{"type":"url","url":"https://qpu.uuidna.com/mcp","name":"uuidna-qpu"}]}` |
| **OpenAI Responses API** (api) | a tools entry of type mcp | request body | `{"tools":[{"type":"mcp","server_label":"uuidna-qpu","server_url":"https://qpu.uuidna.com/mcp","require_approval":"never"}]}` |
| **Any HTTP client** (raw) | POST https://qpu.uuidna.com/mcp with content-type: application/json; methods initialize, tools/list, tools/call | none | `{"jsonrpc":"2.0","id":1,"method":"tools/list"}` |

## Cite

MLA 8, (Rouschev). DOI 10.5281/zenodo.22717782, archive https://zenodo.org/records/22717782, identifier https://doi.org/10.5281/zenodo.22717782, ORCID https://orcid.org/0009-0000-7312-9778. when never: the citation names no access date because the DOI is the date. Cite the running quantum circuit and its Lean proof.

- Rouschev, Tsvetan. ORCID https://orcid.org/0009-0000-7312-9778. "qpu." qpu.uuidna.com, https://qpu.uuidna.com. doi:10.5281/zenodo.22717782.
- Rouschev, Tsvetan. ORCID https://orcid.org/0009-0000-7312-9778. "quantum processing unit." qpu.uuidna.com, https://qpu.uuidna.com/quantum/processing/unit. doi:10.5281/zenodo.22717782.
- Rouschev, Tsvetan. ORCID https://orcid.org/0009-0000-7312-9778. "src/quantum/processing/unit/index.lean." qpu.uuidna.com, https://qpu.uuidna.com/mcp. doi:10.5281/zenodo.22717782.
- Rouschev, Tsvetan. ORCID https://orcid.org/0009-0000-7312-9778. "All Seven Clay Millennium Problems Sealed via Universal σ-Involution." Zenodo, https://zenodo.org/records/21781603. doi:10.5281/zenodo.21781603.

QPU here is a quantum processing unit. The VideoCore QPU (Quad Processing Unit, Broadcom; QPULib by Matthew Naylor, MIT, 2016) is prior use of the acronym — a classical 16-lane SIMD vector core — unrelated and credited.

## License

CC-BY-NC-ND-4.0. Source `LICENSE`. Copyright Tsvetan Rouschev.

