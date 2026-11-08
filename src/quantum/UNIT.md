# Unit

The identity and the kernel. The surface is [`processing/unit`](processing/unit/index.ts), over [`uuid`](uuid/index.ts). The detailed specification is [`README.md`](README.md). The toolboxes are [`TOOLBOXES.md`](TOOLBOXES.md).

The origin is `qpu.uuidna.com`. The apex is `uuidna.com`. The version is `1.4.0`. The kernel is published at `src/quantum/processing/unit/lean`.

`tenantAddress` reads a host and a path.

| Address | Result |
|---|---|
| `<slug>.uuidna.com` | `via: 'subdomain'`. The slug is the tenant. |
| `qpu.uuidna.com/<slug>/` | `via: 'origin-path'`. The same tenant. The internal path is `/<slug>/`. |
| `qpu.uuidna.com` with no segment | `via: 'origin-unscoped'`. The main account. It is not a tenant. |
| `localhost` or `127.0.0.1` | The same path rule as the origin. |
| any other host | `via: 'none'`. |

A slug is a letter followed by letters, digits, and dashes, or eight hex digits. The first path segments `admin`, `api`, `_next`, `static`, and `favicon.ico` stay the website's own routes. A host `qpu.uuidna.com` is the unscoped account. A dotted subdomain under the apex is not a tenant.

`channel` reads one UUID. The handle is the first eight hex digits, and it is the SKU. The door is `qpu://` plus that handle. The middle is the next twelve hex digits. The program is those twelve with the version nibble and the variant nibble set aside: ten nibbles, sixteen choices each, so the combination count is 16¹⁰. The index of those ten digits writes back as the same digits. The tail is the last twelve hex digits, three params of 16 bits each. The tail is valid when those three params write back as the tail and `seal` holds. `uuid('qpu')` is `70a13419-52d5-2702-a236-d17851bf2b4a`, and that seal holds.

`reflection` applies σ to every part. A nibble x becomes 15 − x. The version nibble is stamped again, so the parts round-trip and the stamped address is new. σ twice on a nibble is the nibble.

`uuidQubits` at `hexbit` 4 is the register. Thirty-two digits hold 128 qubits. The version nibble costs 4. The variant prefix costs 2. The effective count is `32 * 4 - 4 - 2 = 122`. The formula is a sealed coin, receipted under ISO/IEC 4879:2024, 3.3.3. Eight scales of the handle multiply the handles by 16 and add 4 qubits. The last scale is 4,294,967,296 handles and capacity 137,438,953,472.

The roles are `reader`, `writer`, and `admin`, ranked 0, 1, and 2. A claim is HMAC-SHA-256 over `role|tenant|METHOD`. The live secret is `QPU_ROLE_SECRET`. A missing secret, or a secret equal to `FORGEABLE_ROLE_SECRET`, honours no claim.

`KEY` is 432. The harmonics are 432, 216, 108, 54, and 27. A scan is 36 frames of 108 ms. That period is 3888 ms, which is 432 × 9. A coil's hue is 120.

The lattice is 2 coins, 7 rays, 14 faces, coil 14, and plane 28. The Shor modulus is 7 × 13 = 91. A token is one coil and two reflecting coins. That merge is [`WITNESSES.md`](WITNESSES.md). The arithmetic of the lattice is [`CLAY.md`](CLAY.md).

`Qpu.lean` imports Mint, Lattice, Annealing, Anyon, Cern, Circuit, Clifford, Coil, Combinatorics, Galois, Grover, Hybrid, Magic, Qaoa, Qft, Shor, Stabilizer, Clay, Cross, Fuse, Fusion, Physics, Pi, Primes, Sigma, Textbook, Surfacecode, and the lead modules CausalInference, ExplainableAI, FederatedLearning, ProgramSynthesis, ZeroShotLearning, and HarmonicClosure.
