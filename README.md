# @uuidna/qpu v1.1.1: An exact quantum processing unit served over MCP

| document | value |
| --- | --- |
| identifier | 8e27a41e-6ec9-5931-be39-f662b696691f |
| version | 1.1.1 |
| author | Tsvetan Rouschev |
| licence | CC-BY-NC-ND-4.0 |
| language | en |

One UUID is a register of 32 hexbits of 4 qubits, less 4 version and 2 variant qubits: 122 qubits in 16 bytes (Qpu.Verify.Uuid.free\_is\_122). Its high 16 qubits address 65536 hexbit programs and its low 106 carry the message (Qpu.Verify.Uuid.program\_capacity), so a machine holds one register for every 16 bytes of its memory at 122 qubits each, as the device receipt below counts. 1663 declared theorems, 2497 in the Lean 4 kernel, rest on 0 sorry, 984 are recomputed by a worked example (textbook\_expressions\_evaluate), each statement below is shown with its Lean proof and the line it stands on, and every tool is served over MCP at <https://qpu.uuidna.com/api/mcp>.

The computer these registers make is every circuit its quantum doors build: 55 worked examples across 5 doors, each replayed on this build and each named by the kernel theorem that makes it true (textbook\_teleport\_three\_qubits is one), as the examples below list.

264 of the worked examples were made by the build itself, each from a statement no hand had worked, evaluated and replayed (textbook\_expressions\_evaluate); 679 declared theorems still have no example and stay open; and no language model takes part, so every figure here is computed by the build at no token cost.

## examples

For example, teleportation sends a message qubit across 3 qubits with 2 classical bits and 4 Pauli corrections: the density-matrix simulation of the algorithm door returns the message's X, Y and Z expectations at the receiver exactly, Lean decides the whole outcome table (QuantumCommunication.teleport\_exact), and without the corrections the receiver's reduced state is maximally mixed, so nothing travels faster than light (QuantumCommunication.teleport\_no\_signalling).

| example | door | shows |
| --- | --- | --- |
| `algorithm-factor-observe` | algorithm | Factoring reads the address instead of searching: the prime nibbles exposed in it are the only primes tried, the search count is 0, and a prime that is not in the address is not claimed. The parts that were read multiply back. |
| `algorithm-factor-1000-bit` | algorithm | The 1000-bit integer 2^999 + 1 asked of Shor is factored whole: the cyclotomic pieces of 2^k + 1, trial, and Lenstra's curves on each composite piece. The prime factors multiply back to the integer. Order-finding is not required once nothing composite remains. An RSA-class semiprime with no such split stays a named cofactor. |
| `algorithm-shor-reduction` | algorithm | Shor reduction given the order: the order of 7 mod 15 is 4, so 7^2 is a square root of 1 that is not pm 1, and gcd of it pm 1 with 15 splits it into 3 times 5 — the half of Shor that is a formula (shorReduction), exact and verified, never a search. |
| `algorithm-shor-beyond-bound` | algorithm | The same reduction at 126 bits: given the order of a mod N, gcd of a^(r/2) ± 1 with N splits N over BigInt into its two primes and checks the product. The computer is one UUID, 122 effective qubits. The formula does not depend on storing the wave. |
| `algorithm-factor-test-integer` | algorithm | The test integer (1000 bits, 301 digits): composite for certain by Miller–Rabin, no prime factor below 2^16, none split by the σ-involution reflection at ⌈√N⌉ either. Each 0 bit below 1024 is a complete double torus, found in the trinity of its position, and the σ₁₀ shift of that trinity flips polarity. The parts multiply back. |
| `algorithm-impossible-create` | algorithm | Create an impossible integer over the clay cluster: two distant primes (p = 1000003, q = 1099511627791, both above 2^16 so trial division cannot peel them) minted into the 60-bit semiprime N = 1099514926325883373, its σ-reflection witness the centre a = (p + q)/2 = 549756313897, published at the cross-UUID address afe4013e-b876-53d0-b515-241ecee7af35. Blind, the reflection climbs a − ⌈√N⌉ + 1 = 548707736325 centres from ⌈√N⌉ up to a (≈ 2^39; out of reach as the primes grow apart); with the witness, one reflection decodes it. The door creates the hard integer and holds its witness, never factors an unknown. |
| `algorithm-impossible-decode` | algorithm | Decode the impossible integer by its witness: one σ-reflection from the centre a = 549756313897 splits N = 1099514926325883373 into 1000003 × 1099511627791 (q = σ\_\{2a\}(p) = 2a − p), searched one centre, the product multiplies back, and the witness matches the published cross-UUID address. A known-answer decode through the clay cluster, never a search of an unknown (the RSA-class decline of textbook\_rsa\_beyond\_bound stands). |
| `algorithm-discover` | algorithm | No integer params: the call reads the order, Shor and factor formulas and does not run them. That discovery is faster than running all three. |
| `algorithm-one-door` | algorithm | An input that determines one door is run: an integer and nothing else is the factor door, and the result is the factors of 15. |
| `processor-unlimited` | processor | No processor name is passed. Every processor is computed, unlimited, at 432 Hz. The textbook pitch of 440 Hz is not the value. The A432 harmonics of processor are on the answer. |
| `circuit-unlimited` | circuit | No operations are passed. The circuit is not filled from a textbook example. The computation is unlimited at 432 Hz, and the A432 harmonics of this quantum tool are on the answer. 432 reflects to hue 72. |
| `echo-unlimited` | echo | No forward circuit is passed. The echo is not filled from a textbook example. The computation is unlimited at 432 Hz. |
| `algorithm-order` | algorithm | Order-finding completed over the UUID quantum space and the RAID controller: the order of 2 mod 15 is 4, found by baby-step giant-step over the content-addressed power table (the residues addressed by uuid, held in the RAID map), verified a^r ≡ 1. |
| `algorithm-factor-find` | algorithm | Factoring completed end to end where the σ-reflection cannot reach: N = 65537 × 178481 (both primes above 2^16, distant, so reflection leaves it) is split by computing the order of 2 mod N (736) over the UUID/RAID content-addressed space, then Shor's reduction — the parts multiply back, the decode bound by its UUID and the SHA-256 of its content. Order-finding at RSA scale stays bounded (a physical quantum backend). |
| `algorithm-shor-odd-order` | algorithm | Order-finding where the order is odd: 4 has the order 3 modulo 21, so this base yields no factor and another base is tried (textbook\_refuse\_is\_refuse). |
| `algorithm-shor-91` | algorithm | Shor reduction on the register's own crypto modulus 91 = rays × (faces − seed) = 7 × 13: the order of 8 mod 91 is 4, so 8^2 = 64 is a σ-reflection square root of 1 that is not ±1, and gcd(64 ∓ 1, 91) splits it into 7 and 13 — relation\_7 of the clay register, its two σ cases (the −seed gcd is rays = 7, the +seed gcd is faces − seed = 13). |
| `algorithm-factor-mersenne` | algorithm | The Mersenne prime 2^1279 − 1, 1279 bits: a probable prime by Miller–Rabin over 24 bases, said probable since it lies above the bound where those bases are certain, one part, its product itself. |
| `algorithm-factor-15` | algorithm | getInteger reads 15 from its decimal string and listFactors returns its prime factors \[3, 5\] whose product is 15, the composite certain by Miller–Rabin; the path the classical door takes, proving getInteger and listFactors. |
| `algorithm-factor-minus` | algorithm | A minus is not a refusal. The magnitude 15 is factored into 3 and 5, the reply writes the integer back as -15, and the sign is a meaning the imagine door realises. |
| `algorithm-factor-continues` | algorithm | The seeded 1000-bit integer searched blind for sixteen centres is not split, and the answer is no stop: it carries the next lead, the same door from the centre reached, addressed by the integer and that centre, which the lead runner adds to its page as the next block. |
| `algorithm-factor-seed-continues` | algorithm | A mint without a seed is not refused: the core draws no randomness, so it answers the call that continues the mint with a seed, which the app's MCP door completes from its crypto randomness. |
| `algorithm-factor-word` | algorithm | A paste with no integer is not a refusal. The word is the meaning, and the imagine door is the way it is realised. |
| `processor-willow` | processor | How many qubits Willow has, as its spec sheet states it: 105, with average connectivity 3.47, computed again from the 182 couplers of the grid (2E/N), and error correction below threshold since Λ is above 1. |
| `processor-sycamore` | processor | Sycamore from its printed diagram: 54 qubits and 88 couplers, derived and stated. |
| `processor-register` | processor | qpu's register as a processor: heldQubits laid out a row per hex digit that holds qubits and a column per held qubit, its qubits and couplers the evaluations of Qpu.Information.Qubit at hexbit width 4. |
| `circuit-hadamard-amplitudes` | circuit | A Hadamard gives two amplitudes of 1/√2. |
| `circuit-engine-receipt` | circuit | A cirq-google engine program runs on this register: Willow holds the job on a site its grid names, the Hadamard amplitudes stay in range, and the UUID receipt of that job stores every ISO standard. The call does not leave. |
| `circuit-phased-xz` | circuit | PhasedXZ(x=1, z=0, axis=0.5) is Y: \|0⟩ goes to i\|1⟩. |
| `circuit-hadamard-sampled` | circuit | The same circuit measured: 400 bitstrings, each 0 or 1, in a histogram. |
| `circuit-bit-flip-noise` | circuit | An X gate under a bit-flip channel of p = 0.1 on the density matrix: probability 0.1 of reading 0, purity 0.1² + 0.9² = 0.82. Noise does not sample; it returns the mixed state. |
| `echo-returns` | echo | H forward, Z, H back is X: the echo is destroyed, so the return probability is 0. |
| `algorithm-shor-15` | algorithm | Shor on N = 15, a = 7. Omit repetitions and the order is the exact witness on the register: order 4 and factors 3 × 5. Pass repetitions and the circuit is sampled. |
| `algorithm-handle-capacity` | algorithm | The possible handles are the qubit capacity. A handle is eight hex digits of one shape, 16 choices and 4 qubits, and each further digit is that shape again. Eight digits are 16^8 handles, 32 qubits on each, and the capacity is every handle at once. |
| `algorithm-qft-3` | algorithm | The QFT of \|5⟩ on three qubits: eight amplitudes of equal magnitude. |
| `algorithm-grover` | algorithm | Grover on two qubits finds the marked \|00⟩ with certainty. Two is the param. Omit the width and the call is the register. |
| `algorithm-teleportation` | algorithm | Teleportation: the QPU MCP processes the readout. Bob matches the message on X, Y and Z after the two corrections. Before those bits each expectation on Bob is 0. The false assumption is sent to next, and next is true. |
| `algorithm-phase-estimation` | algorithm | Phase estimation reads θ = 0.25 exactly in three bits. Eight samples are the argument. Omit them and the call is the register. |
| `algorithm-qaoa` | algorithm | QAOA on the Cirq page's 12-node instance, sampled from the state's probabilities. Twelve is the param. Omit nodes and the graph is the UUID register. |
| `algorithm-deutsch-jozsa` | algorithm | Deutsch–Jozsa on three inputs: a balanced (parity) oracle takes the inputs away from \|000\>, so one query decides balanced. The deutschJozsaCircuit circuit/compute is proven here. |
| `algorithm-bernstein-vazirani` | algorithm | Bernstein–Vazirani recovers the hidden string 110 in a single query. The bernsteinVaziraniCircuit circuit/compute is proven here. |
| `algorithm-simon` | algorithm | Simon on two qubits with period s = 11: every measured y satisfies y·s = 0. Two is the param. Omit the width and the call is the register. The simonCircuit circuit/compute is proven here. |
| `algorithm-vqe` | algorithm | VQE on one qubit for H = Z reaches the ground energy ⟨Z⟩ = −1. The vqeGroundEnergy circuit/compute is proven here. |
| `algorithm-chsh` | algorithm | The CHSH value on the Bell state reaches Tsirelson’s bound 2√2 ≈ 2.828, above the classical limit of 2. The chshValue circuit/compute is proven here. |
| `algorithm-trotter` | algorithm | Trotterization of e^(−i(X+Z)t): the fidelity to the exact evolution rises monotonically with the step count toward 1. The trotterFidelity circuit/compute is proven here. |
| `algorithm-xeb` | algorithm | XEB on a random 4-qubit circuit: the collision Σp² sits near Porter–Thomas 2/(D+1), above the uniform 1/D — the speckle of a genuine quantum sampler. The xebCollision circuit/compute is proven here. |
| `algorithm-no-cloning` | algorithm | No-cloning: the optimal universal cloning fidelity is 5/6 \< 1, so no unknown state is copied perfectly. The cloningFidelity circuit/compute is proven here. |
| `algorithm-holevo` | algorithm | Holevo bound: the accessible information χ of the \{\|0\>,\|+\>\} ensemble is ≤ log₂ d = 1 bit. The holevoChi circuit/compute is proven here. |
| `algorithm-gottesman-knill` | algorithm | Gottesman–Knill: a 10-qubit stabilizer state is 210 bits versus 1024 amplitudes — stabilizer circuits are classically simulable. The stabilizerCompression circuit/compute is proven here. |
| `algorithm-eastin-knill` | algorithm | Eastin–Knill: the single-qubit Clifford group has order 24 (finite), so no transversal gate set is universal. The cliffordOrder circuit/compute is proven here. |
| `algorithm-solovay-kitaev` | algorithm | Solovay–Kitaev: T has order 8 and does not commute with H, so \{H,T\} is dense in SU(2) and approximates any gate in O(log^c(1/ε)) length. The htUniversality circuit/compute is proven here. |
| `algorithm-steane` | algorithm | The Steane \[\[7,1,3\]\] CSS code: the Hamming syndrome locates and corrects all 14 single-qubit X and Z errors. The steaneCorrection circuit/compute is proven here. |
| `qec-bit-flip-0.1` | quantum-error-correction | The three-qubit repetition code on the density matrix at p = 0.1: logical error 3p² − 2p³ = 0.028, below the raw 0.1. |
| `algorithm-impossible-decode-small` | algorithm | The witness gates the decode: at the centre a = 4, 4² − 15 = 1², so one σ-reflection splits 15 into 3 × 5 by the witness route, the product recomputed; no address was given, so that witness is missing (null), never passed. |
| `algorithm-impossible-decode-wrong-witness` | algorithm | A wrong witness decodes nothing: 7² − 15 = 34 is no square, so the reflection at the witness fails and no ⌈√N⌉ fallback or trial division answers in its name — decoded and verified false, route null, the missing address null (it once read decoded, verified and sealed by trial division); the failed decode is still bound by its SHA-256 receipt. |
| `algorithm-factor-order-composite` | algorithm | Shor's reduction on 105 with the order 12 of 2 splits it into 5 and 21; a row is labelled only after Miller–Rabin, so 21 = 3 · 7 reads composite (it once read prime), and the receipt is bound by the SHA-256 of its content, recomputed by any holder. |

## statements

| theorem | statement | lean | axioms | proof |
| --- | --- | --- | --- | --- |
| `textbook_sha256_fips_180_4` | $\forall (m\ k : \mathbb{N}), \mathrm{Fintype.card} (\mathrm{Fin} (m \cdot k) \to \mathrm{Bool}) = \mathrm{Fintype.card} (\mathrm{Fin}\ m \to \mathrm{Fin}\ k \to \mathrm{Bool})$ | `theorem textbook_sha256_fips_180_4 (m k : Nat) : Fintype.card (Fin (m * k) → Bool) = Fintype.card (Fin m → Fin k → Bool) := by   simp only [Fintype.card_fun, Fintype.card_bool, Fintype.card_fin, pow_mul']` | propext, Classical.choice, Quot.sound | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean#L2208> |
| `textbook_sha3_fips_202` | $1600 - 512 = 1088 \land 512 = 2 \cdot 256 \land 1600 - 1024 = 576 \land 1024 = 2 \cdot 512$ | `theorem textbook_sha3_fips_202 : 1600 - 512 = 1088 ∧ 512 = 2 * 256 ∧ 1600 - 1024 = 576 ∧ 1024 = 2 * 512 := by decide` | none | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean#L2215> |
| `textbook_pqc_standards_three` | $202 + 1 = 203 \land 203 + 1 = 204 \land 204 + 1 = 205 \land 205 - 202 = 3 \land 384 \cdot 3 + 32 = 1184 \land 32 \cdot (10 \cdot 3 + 4) = 1088 \land 16 \cdot (1 + 14 \cdot (1 + 12) + 63 + 7 \cdot 35) = 7856$ | `theorem textbook_pqc_standards_three : 202 + 1 = 203 ∧ 203 + 1 = 204 ∧ 204 + 1 = 205 ∧ 205 - 202 = 3 ∧ 384 * 3 + 32 = 1184 ∧ 32 * (10 * 3 + 4) = 1088 ∧ 16 * (1 + 14 * (1 + 12) + 63 + 7 * 35) = 7856 := by decide` | none | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean#L2268> |
| `textbook_coil_green` | $432 \bmod 360 + 432 / 9 = 120$ | `theorem textbook_coil_green : 432 % 360 + 432 / 9 = 120 := by decide` | none | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean#L705> |

## kernel

| kernel | value |
| --- | --- |
| declared theorems | 1663 |
| kernel theorems | 2497 |
| generated lemmas | 834 |
| sorry | 0 |
| recomputed by an example | 984 |
| source | <https://github.com/uuidna/qpu/tree/v1.1.1/lean> |

## use

```json
{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"metrics","arguments":{}}}
```

| use | value |
| --- | --- |
| mcp | <https://qpu.uuidna.com/api/mcp> |
| method | POST |

## receipts

## qpu

| receipt | value |
| --- | --- |
| uuid | 8e27a41e-6ec9-5931-be39-f662b696691f |
| handle | `8e27a41e` |
| sha256 | 13d5e419df192c7d30d41908841c0ecbf2b3222cec30c2c9564fe495bc534971 |
| coin | 00000100-6ec9-6931-8e39-f662b696691f |
| currency | XXX |
| bytes / B | 256 |
| bits / bit | 2048 |
| tokens | 64 |
| joules / J | 5.8797647566412266e-18 |
| technique | `seal {"merkle":{"leaves":["uuid"]}}` |
| author | Tsvetan Rouschev |
| orcid | <https://orcid.org/0009-0000-7312-9778> |
| licence | <https://creativecommons.org/licenses/by-nc-nd/4.0/> |
| licensing | <https://uuidna.com/license> |
| donation | <https://revolut.me/ceccec> |
| contact | <https://revolut.me/ceccec> |
| parts | 4 |

| part | handle | uuid |
| --- | --- | --- |
| `textbook_sha256_fips_180_4` | `460f5805` | 460f5805-8ae0-14d0-b7fe-6d1fc9b6d8c8 |
| `textbook_sha3_fips_202` | `e0028c71` | e0028c71-0058-43c4-b4a6-ec45d856dc94 |
| `textbook_pqc_standards_three` | `ba853ce3` | ba853ce3-baac-583e-a382-a68856cb258a |
| `textbook_coil_green` | `cdb22ab5` | cdb22ab5-7757-3466-bae4-81f905bf740a |

| qpu | value |
| --- | --- |
| rfc | 6962 |
| root | 55c57fc9f121c85e5afd4bdb43834f7c32ed581c4ed3873a78a27009dbed8f6b |
| parts | 460f5805-8ae0-14d0-b7fe-6d1fc9b6d8c8, e0028c71-0058-43c4-b4a6-ec45d856dc94, ba853ce3-baac-583e-a382-a68856cb258a, cdb22ab5-7757-3466-bae4-81f905bf740a |

## textbook\_sha256\_fips\_180\_4

| receipt | value |
| --- | --- |
| uuid | 460f5805-8ae0-14d0-b7fe-6d1fc9b6d8c8 |
| handle | `460f5805` |
| sha256 | 8d17358d56238ce1c5492f5c6e41a85aaace6a2948645030d1942804c10c5891 |
| coin | 000007a8-8ae0-44d0-87fe-6d1fc9b6d8c8 |
| currency | XXX |
| bytes / B | 1960 |
| bits / bit | 15680 |
| tokens | 490 |
| joules / J | 4.501694891803439e-17 |
| technique | `lean/tools/Theorems.lean, seal {"nist":true}, seal {"nist":{"reverse":true,"via":"cern"}}` |

| textbook\_sha256\_fips\_180\_4 | value |
| --- | --- |
| theorem | `textbook_sha256_fips_180_4` |
| module | Qpu.General.Textbook |
| source | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| axioms | propext, Classical.choice, Quot.sound |

| textbook\_sha256\_fips\_180\_4.nist | value |
| --- | --- |
| host | qpu.uuidna.com |
| holds | true |

### textbook\_sha256\_fips\_180\_4.nist.probes

| id | url |
| --- | --- |
| codata | <https://physics.nist.gov/cuu/Constants/Table/allascii.txt> |
| nist-opendata | <https://data.nist.gov/rmm/records?page=0&size=5> |
| nist-beacon | <https://beacon.nist.gov/beacon/2.0/pulse/last> |
| ct-sth | <https://ct.googleapis.com/logs/us1/argon2026h2/ct/v1/get-sth> |
| acme-directory | <https://acme-v02.api.letsencrypt.org/directory> |
| nvd-cves | <https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=ML-KEM&resultsPerPage=5> |
| cern-opendata | <https://opendata.cern.ch/api/records/?q=higgs&size=5> |
| csrc-pqc | <https://csrc.nist.gov/projects/post-quantum-cryptography> |
| nist-codata | <https://physics.nist.gov/cuu/Constants/Table/allascii.txt> |
| crt-sh | <https://crt.sh/?q=qpu.uuidna.com&output=json> |

| textbook\_sha256\_fips\_180\_4.cern | value |
| --- | --- |
| host | opendata.cern.ch |
| via | cern |
| holds | true |

### textbook\_sha256\_fips\_180\_4.cern.probes

| id | url |
| --- | --- |
| cern-opendata | <https://opendata.cern.ch/api/records/?q=higgs&size=5> |
| codata | <https://physics.nist.gov/cuu/Constants/Table/allascii.txt> |
| nist-codata | <https://physics.nist.gov/cuu/Constants/Table/allascii.txt> |
| csrc-pqc | <https://csrc.nist.gov/projects/post-quantum-cryptography> |
| nvd-cves | <https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=ML-KEM&resultsPerPage=5> |
| acme-directory | <https://acme-v02.api.letsencrypt.org/directory> |
| ct-sth | <https://ct.googleapis.com/logs/us1/argon2026h2/ct/v1/get-sth> |
| nist-beacon | <https://beacon.nist.gov/beacon/2.0/pulse/last> |
| crt-sh | <https://crt.sh/?q=opendata.cern.ch&output=json> |

### textbook\_sha256\_fips\_180\_4.formula

| theorem | formula | bytes / B | bits / bit | tokens | joules / J | coin | currency | source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_sha256_fips_180_4` | $\forall (m\ k : \mathbb{N}), \mathrm{Fintype.card} (\mathrm{Fin} (m \cdot k) \to \mathrm{Bool}) = \mathrm{Fintype.card} (\mathrm{Fin}\ m \to \mathrm{Fin}\ k \to \mathrm{Bool})$ | 175 | 1400 | 44 | 4.0193704391102135e-18 | 000000af-f5c6-63f2-8613-45eb992d2fe6 | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## textbook\_sha3\_fips\_202

| receipt | value |
| --- | --- |
| uuid | e0028c71-0058-43c4-b4a6-ec45d856dc94 |
| handle | `e0028c71` |
| sha256 | 81a592cf17b3805c5fd1d071d0e3fb485d9fa4f2a4d778c95cfeb98ecda555ee |
| coin | 00000777-0058-63c4-84a6-ec45d856dc94 |
| currency | XXX |
| bytes / B | 1911 |
| bits / bit | 15288 |
| tokens | 478 |
| joules / J | 4.389152519508353e-17 |
| technique | `lean/tools/Theorems.lean, seal {"nist":true}, seal {"nist":{"reverse":true,"via":"cern"}}` |

| textbook\_sha3\_fips\_202 | value |
| --- | --- |
| theorem | `textbook_sha3_fips_202` |
| module | Qpu.General.Textbook |
| source | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| axioms |  |

| textbook\_sha3\_fips\_202.nist | value |
| --- | --- |
| host | qpu.uuidna.com |
| holds | true |

### textbook\_sha3\_fips\_202.nist.probes

| id | url |
| --- | --- |
| codata | <https://physics.nist.gov/cuu/Constants/Table/allascii.txt> |
| nist-opendata | <https://data.nist.gov/rmm/records?page=0&size=5> |
| nist-beacon | <https://beacon.nist.gov/beacon/2.0/pulse/last> |
| ct-sth | <https://ct.googleapis.com/logs/us1/argon2026h2/ct/v1/get-sth> |
| acme-directory | <https://acme-v02.api.letsencrypt.org/directory> |
| nvd-cves | <https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=ML-KEM&resultsPerPage=5> |
| cern-opendata | <https://opendata.cern.ch/api/records/?q=higgs&size=5> |
| csrc-pqc | <https://csrc.nist.gov/projects/post-quantum-cryptography> |
| nist-codata | <https://physics.nist.gov/cuu/Constants/Table/allascii.txt> |
| crt-sh | <https://crt.sh/?q=qpu.uuidna.com&output=json> |

| textbook\_sha3\_fips\_202.cern | value |
| --- | --- |
| host | opendata.cern.ch |
| via | cern |
| holds | true |

### textbook\_sha3\_fips\_202.cern.probes

| id | url |
| --- | --- |
| cern-opendata | <https://opendata.cern.ch/api/records/?q=higgs&size=5> |
| codata | <https://physics.nist.gov/cuu/Constants/Table/allascii.txt> |
| nist-codata | <https://physics.nist.gov/cuu/Constants/Table/allascii.txt> |
| csrc-pqc | <https://csrc.nist.gov/projects/post-quantum-cryptography> |
| nvd-cves | <https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=ML-KEM&resultsPerPage=5> |
| acme-directory | <https://acme-v02.api.letsencrypt.org/directory> |
| ct-sth | <https://ct.googleapis.com/logs/us1/argon2026h2/ct/v1/get-sth> |
| nist-beacon | <https://beacon.nist.gov/beacon/2.0/pulse/last> |
| crt-sh | <https://crt.sh/?q=opendata.cern.ch&output=json> |

### textbook\_sha3\_fips\_202.formula

| theorem | formula | bytes / B | bits / bit | tokens | joules / J | coin | currency | source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_sha3_fips_202` | $1600 - 512 = 1088 \land 512 = 2 \cdot 256 \land 1600 - 1024 = 576 \land 1024 = 2 \cdot 512$ | 90 | 720 | 23 | 2.0671047972566813e-18 | 0000005a-e5e3-600f-88e4-fa974e4b3cf7 | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## textbook\_pqc\_standards\_three

| receipt | value |
| --- | --- |
| uuid | ba853ce3-baac-583e-a382-a68856cb258a |
| handle | `ba853ce3` |
| sha256 | a8801ecccfc22b5cbfce544926d5f99ba15554b5eb7924ea8bc133dc92131d99 |
| coin | 00000783-baac-283e-8382-a68856cb258a |
| currency | XXX |
| bytes / B | 1923 |
| bits / bit | 15384 |
| tokens | 481 |
| joules / J | 4.416713916805109e-17 |
| technique | `lean/tools/Theorems.lean, seal {"nist":true}, seal {"nist":{"reverse":true,"via":"cern"}}` |

| textbook\_pqc\_standards\_three | value |
| --- | --- |
| theorem | `textbook_pqc_standards_three` |
| module | Qpu.General.Textbook |
| source | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| axioms |  |

| textbook\_pqc\_standards\_three.nist | value |
| --- | --- |
| host | qpu.uuidna.com |
| holds | true |

### textbook\_pqc\_standards\_three.nist.probes

| id | url |
| --- | --- |
| codata | <https://physics.nist.gov/cuu/Constants/Table/allascii.txt> |
| nist-opendata | <https://data.nist.gov/rmm/records?page=0&size=5> |
| nist-beacon | <https://beacon.nist.gov/beacon/2.0/pulse/last> |
| ct-sth | <https://ct.googleapis.com/logs/us1/argon2026h2/ct/v1/get-sth> |
| acme-directory | <https://acme-v02.api.letsencrypt.org/directory> |
| nvd-cves | <https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=ML-KEM&resultsPerPage=5> |
| cern-opendata | <https://opendata.cern.ch/api/records/?q=higgs&size=5> |
| csrc-pqc | <https://csrc.nist.gov/projects/post-quantum-cryptography> |
| nist-codata | <https://physics.nist.gov/cuu/Constants/Table/allascii.txt> |
| crt-sh | <https://crt.sh/?q=qpu.uuidna.com&output=json> |

| textbook\_pqc\_standards\_three.cern | value |
| --- | --- |
| host | opendata.cern.ch |
| via | cern |
| holds | true |

### textbook\_pqc\_standards\_three.cern.probes

| id | url |
| --- | --- |
| cern-opendata | <https://opendata.cern.ch/api/records/?q=higgs&size=5> |
| codata | <https://physics.nist.gov/cuu/Constants/Table/allascii.txt> |
| nist-codata | <https://physics.nist.gov/cuu/Constants/Table/allascii.txt> |
| csrc-pqc | <https://csrc.nist.gov/projects/post-quantum-cryptography> |
| nvd-cves | <https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=ML-KEM&resultsPerPage=5> |
| acme-directory | <https://acme-v02.api.letsencrypt.org/directory> |
| ct-sth | <https://ct.googleapis.com/logs/us1/argon2026h2/ct/v1/get-sth> |
| nist-beacon | <https://beacon.nist.gov/beacon/2.0/pulse/last> |
| crt-sh | <https://crt.sh/?q=opendata.cern.ch&output=json> |

### textbook\_pqc\_standards\_three.formula

| theorem | formula | bytes / B | bits / bit | tokens | joules / J | coin | currency | source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_pqc_standards_three` | $202 + 1 = 203 \land 203 + 1 = 204 \land 204 + 1 = 205 \land 205 - 202 = 3 \land 384 \cdot 3 + 32 = 1184 \land 32 \cdot (10 \cdot 3 + 4) = 1088 \land 16 \cdot (1 + 14 \cdot (1 + 12) + 63 + 7 \cdot 35) = 7856$ | 206 | 1648 | 52 | 4.731373202609737e-18 | 000000ce-c7be-3aef-8508-9bd7711f2bb0 | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## textbook\_coil\_green

| receipt | value |
| --- | --- |
| uuid | cdb22ab5-7757-3466-bae4-81f905bf740a |
| handle | `cdb22ab5` |
| sha256 | 64917fbf82f88e96f19f53da058d29de5d908598f4073636ff1d40dc17d54550 |
| coin | 00000771-7757-6466-8ae4-81f905bf740a |
| currency | XXX |
| bytes / B | 1905 |
| bits / bit | 15240 |
| tokens | 477 |
| joules / J | 4.3753718208599755e-17 |
| technique | `lean/tools/Theorems.lean, seal {"nist":true}, seal {"nist":{"reverse":true,"via":"cern"}}` |

| textbook\_coil\_green | value |
| --- | --- |
| theorem | `textbook_coil_green` |
| module | Qpu.General.Textbook |
| source | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| axioms |  |

| textbook\_coil\_green.nist | value |
| --- | --- |
| host | qpu.uuidna.com |
| holds | true |

### textbook\_coil\_green.nist.probes

| id | url |
| --- | --- |
| codata | <https://physics.nist.gov/cuu/Constants/Table/allascii.txt> |
| nist-opendata | <https://data.nist.gov/rmm/records?page=0&size=5> |
| nist-beacon | <https://beacon.nist.gov/beacon/2.0/pulse/last> |
| ct-sth | <https://ct.googleapis.com/logs/us1/argon2026h2/ct/v1/get-sth> |
| acme-directory | <https://acme-v02.api.letsencrypt.org/directory> |
| nvd-cves | <https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=ML-KEM&resultsPerPage=5> |
| cern-opendata | <https://opendata.cern.ch/api/records/?q=higgs&size=5> |
| csrc-pqc | <https://csrc.nist.gov/projects/post-quantum-cryptography> |
| nist-codata | <https://physics.nist.gov/cuu/Constants/Table/allascii.txt> |
| crt-sh | <https://crt.sh/?q=qpu.uuidna.com&output=json> |

| textbook\_coil\_green.cern | value |
| --- | --- |
| host | opendata.cern.ch |
| via | cern |
| holds | true |

### textbook\_coil\_green.cern.probes

| id | url |
| --- | --- |
| cern-opendata | <https://opendata.cern.ch/api/records/?q=higgs&size=5> |
| codata | <https://physics.nist.gov/cuu/Constants/Table/allascii.txt> |
| nist-codata | <https://physics.nist.gov/cuu/Constants/Table/allascii.txt> |
| csrc-pqc | <https://csrc.nist.gov/projects/post-quantum-cryptography> |
| nvd-cves | <https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=ML-KEM&resultsPerPage=5> |
| acme-directory | <https://acme-v02.api.letsencrypt.org/directory> |
| ct-sth | <https://ct.googleapis.com/logs/us1/argon2026h2/ct/v1/get-sth> |
| nist-beacon | <https://beacon.nist.gov/beacon/2.0/pulse/last> |
| crt-sh | <https://crt.sh/?q=opendata.cern.ch&output=json> |

### textbook\_coil\_green.formula

| theorem | formula | bytes / B | bits / bit | tokens | joules / J | coin | currency | source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_coil_green` | $432 \bmod 360 + 432 / 9 = 120$ | 29 | 232 | 8 | 6.660671013382639e-19 | 0000001d-a774-129f-876b-f5812d543cda | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
---

| text | value |
| --- | --- |
| uuid | 4118997c-e7a3-3d3f-83d3-04cc786c37f7 |
| sha256 | 8dceaea191a49eb6f6b23ad31d64a96a61108ee755eb4c42598304f358fee521 |
| merge | 8e27a41e-6ec9-5931-be39-f662b696691f |
| verify | `verify {"uuid":"4118997c-e7a3-3d3f-83d3-04cc786c37f7","content":"text"}` |
| mcp | <https://qpu.uuidna.com/api/mcp> |

<!-- hardware -->

| copy | value |
| --- | --- |
| issued | 2026-11-27T21:42:19.413Z |
| hardware | 61fab1d4-4f3f-25fc-93eb-7cd3aa27c308 |

<details>
<summary>hardware</summary>

## hardware

| receipt | value |
| --- | --- |
| uuid | 61fab1d4-4f3f-25fc-93eb-7cd3aa27c308 |
| handle | `61fab1d4` |
| sha256 | da2201b3d9dfe8ea52cdf949ceb745a67c03e72e516e82afa00d5489954c2eaf |

| hardware | value |
| --- | --- |
| registerBytes | 16 |
| registerQubits | 122 |
| registersInMemory | 2147483648 |
| registerQubitsInMemory | 261993005056 |
| platform | darwin |
| type | Darwin |
| release | 27.2.0 |
| version | Darwin Kernel Version 27.2.0: Thu Oct 15 00:02:46 PDT 2026; root:xnu-13432.41.4~25/RELEASE\_ARM64\_T6000 |
| arch | arm64 |
| machine | arm64 |
| endianness | LE |
| cpu | Apple M1 Max |
| cores | 10 |
| parallelism | 10 |
| cpuMHz | 2400, 2400, 2400, 2400, 2400, 2400, 2400, 2400, 2400, 2400 |
| cpuUserMs | 557611660 |
| cpuNiceMs | 0 |
| cpuSysMs | 258728620 |
| cpuIdleMs | 2528901150 |
| cpuIrqMs | 0 |
| memoryBytes | 34359738368 |
| freeMemoryBytes | 4624384000 |
| load1 | 4.5654296875 |
| load5 | 7.99365234375 |
| load15 | 8.181640625 |
| uptimeS | 363337 |
| diskBytes | 994662584320 |
| diskFreeBytes | 805912752128 |
| diskAvailableBytes | 805912752128 |
| diskBlockBytes | 4096 |
| inodes | 7885158832 |
| inodesFree | 7870241720 |
| networkInterfaces | 10 |
| lean | leanprover/lean4:v4.33.0 |
| rssBytes | 400048128 |
| heapTotalBytes | 205635584 |
| heapUsedBytes | 125690224 |
| externalBytes | 7070402 |
| arrayBuffersBytes | 654791 |
| processUserMicros | 6575680 |
| processSystemMicros | 138964 |
| maxRssKb | 390688 |
| pageFaults | 25067 |
| fsReads | 0 |
| fsWrites | 0 |
| contextSwitches | 5171 |
| challenges | 574a161f, fb1cd940, d6d7b748, ec54afc7, bbcc2c0f, dbbc4fe8, 1feb6648, 52a07646, a7fa7c75, d8719ba7, 5d7c7a76, 4d938405, 02f60ed8, 3edf017a |
| isoHardwareTerms | 3.3.5 physical qubit, 3.3.6 physical qudit, 3.4.8 quantum processor, 3.4.10 quantum computer, 3.4.26 circuit-based quantum computer, 3.4.27 one-way quantum computer, 3.4.28 adiabatic quantum computer |
| quantumBehaviour | UNVERIFIED |
| buildMs | 4950 |
| at | 2026-11-27T21:42:19.413Z |

| hardware.versions | value |
| --- | --- |
| node | 26.13.1 |
| acorn | 8.19.0 |
| ada | 4.0.0 |
| amaro | 1.1.11 |
| ares | 1.34.9 |
| brotli | 1.2.1 |
| cldr | 48.0 |
| icu | 78.3 |
| libffi | 3.8.0 |
| lief | 1.0.0 |
| llhttp | 9.4.4 |
| merve | 1.2.2 |
| modules | 147 |
| napi | 10 |
| nbytes | 0.1.4 |
| ncrypto | 0.0.1 |
| nghttp2 | 1.70.0 |
| nghttp3 |  |
| ngtcp2 |  |
| openssl | 3.5.9 |
| simdjson | 5.0.3 |
| simdutf | 7.7.0 |
| sqlite | 3.54.1 |
| tz | 2026e |
| undici | 8.12.4 |
| unicode | 17.0 |
| uv | 1.52.1 |
| uvwasi | 0.0.23 |
| v8 | 14.6.202.34-node.40 |
| zlib | 1.3.2.1-motley-456ae73 |
| zstd | 1.5.7 |

</details>

## willow-connectivity

| receipt | value |
| --- | --- |
| uuid | 574a161f-208a-6ab1-b611-50fb8ba7b0c5 |
| handle | `574a161f` |
| sha256 | 3341344b81f5e255796aa7b0506da31df71b4b067178d4df72d3915050a6fd5a |
| coin | 0000045f-208a-8ab1-8611-50fb8ba7b0c5 |
| currency | XXX |
| bytes / B | 1119 |
| bits / bit | 8952 |
| tokens | 280 |
| joules / J | 2.5701002979224737e-17 |
| technique | `google {"challenge":"willow-connectivity"}` |

| willow-connectivity | value |
| --- | --- |
| challenge | willow-connectivity |
| title | Willow 105-Qubit Superconducting Grid, Coupler Connectivity & Code Capacity |
| category | quantum-hardware |
| theorem | `textbook_willow_connectivity` |
| relatedTheorems | `textbook_willow_connectivity`, `textbook_willow_holds_codes`, `textbook_willow_distance_seven` |
| formula | (2 \* 182 \* 100 + 52) / 105 = 347 ∧ 7 \* 7 + (7 \* 7 - 1) = 97 \< 101 ≤ 105 ∧ 103 ≤ 105 |
| holds | true |
| kernelAccepted | true |

| willow-connectivity.solution | value |
| --- | --- |
| uuid | d6ffe97c-c666-55e3-92b5-28ffe1187332 |
| sha256 | 9092d2847d698ff0ac38644142f005e6b852bd951e6363b78d5d0064da840c96 |

### willow-connectivity.iso

| clause | term | standard | qpu | uuid |
| --- | --- | --- | --- | --- |
| 3.3.3 | qubit | ISO/IEC 4879:2024 | true | add14fe8-b0f2-88d0-828e-91dc9b7c0002 |
| 3.4.8 | quantum processor | ISO/IEC 4879:2024 | true | 8efaebe5-0912-1fb1-a4b7-247fccfa5756 |
| 3.4.17 | quantum code | ISO/IEC 4879:2024 | true | de2c0bfe-6df8-3bf2-989f-816df42926b9 |
| 3.4.32 | coupler | ISO/IEC 4879:2024 | true | 28b5b13d-3018-59a3-bfe5-ea5e2523ed36 |

### willow-connectivity.formula

| theorem | formula | bytes / B | bits / bit | tokens | joules / J | coin | currency | source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_willow_connectivity` | $\forall \{V : \mathrm{Type}\ \mathrm{u\_1}\} [\mathrm{inst} : \mathrm{Fintype}\ V] [\mathrm{DecidableEq}\ V] (G : \mathrm{SimpleGraph}\ V) [\mathrm{inst\_2} : \mathrm{DecidableRel}\ \mathrm{G.Adj}], \sum v, \mathrm{G.degree}\ v = 2 \cdot \mathrm{G.edgeFinset.card}$ | 264 | 2112 | 66 | 6.063507405286265e-18 | 00000108-cc8f-5949-8064-b982a655be9f | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_willow_holds_codes` | $101 \le 105 \land 103 \le 105 \land 347 < 400$ | 45 | 360 | 12 | 1.0335523986283406e-18 | 0000002d-1afc-4df7-8a46-23f73bfaf830 | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_willow_distance_seven` | $7 \cdot 7 + (7 \cdot 7 - 1) = 97 \land 97 < 101 \land 101 \le 105$ | 65 | 520 | 17 | 1.4929090202409365e-18 | 00000041-5ede-645f-8355-b50ce404a476 | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## sycamore-topology

| receipt | value |
| --- | --- |
| uuid | fb1cd940-c0fb-2897-95a6-696de14731c9 |
| handle | `fb1cd940` |
| sha256 | 24558ef16281e3dc1e5533ff22210360d00ade12c13bd425ae265159f17af06f |
| coin | 000002de-c0fb-6897-85a6-696de14731c9 |
| currency | XXX |
| bytes / B | 734 |
| bits / bit | 5872 |
| tokens | 184 |
| joules / J | 1.6858388013182266e-17 |
| technique | `google {"challenge":"sycamore-topology"}` |

| sycamore-topology | value |
| --- | --- |
| challenge | sycamore-topology |
| title | Sycamore 54-Qubit & Sycamore23 Known-Device Grid Topology |
| category | quantum-hardware |
| theorem | `textbook_sycamore_couplers` |
| relatedTheorems | `textbook_sycamore_couplers` |
| formula | 2 \* 88 = 176 ∧ 176 ≤ 4 \* 54 ∧ qubits(Sycamore23) = 23 |
| holds | true |
| kernelAccepted | true |

| sycamore-topology.solution | value |
| --- | --- |
| uuid | 13ebf53e-dde7-2072-8a71-56f9808231e2 |
| sha256 | 8342bc3ed1d3dcf68e54572a4505a91509c7b009f05e0d4c09a5b027b5ae5a83 |

### sycamore-topology.iso

| clause | term | standard | qpu | uuid |
| --- | --- | --- | --- | --- |
| 3.3.3 | qubit | ISO/IEC 4879:2024 | true | add14fe8-b0f2-88d0-828e-91dc9b7c0002 |
| 3.4.32 | coupler | ISO/IEC 4879:2024 | true | 28b5b13d-3018-59a3-bfe5-ea5e2523ed36 |

### sycamore-topology.formula

| theorem | formula | bytes / B | bits / bit | tokens | joules / J | coin | currency | source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_sycamore_couplers` | $\forall \{V : \mathrm{Type}\ \mathrm{u\_1}\} [\mathrm{inst} : \mathrm{Fintype}\ V] [\mathrm{DecidableEq}\ V] (G : \mathrm{SimpleGraph}\ V) [\mathrm{inst\_2} : \mathrm{DecidableRel}\ \mathrm{G.Adj}], (\forall (v : V), \mathrm{G.degree}\ v \le 4) \to 2 \cdot \mathrm{G.edgeFinset.card} \le \mathrm{Fintype.card}\ V \cdot 4$ | 320 | 2560 | 80 | 7.349705945801534e-18 | 00000140-0b4d-1192-8f34-6158eacfb9e6 | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## surface-code-qec

| receipt | value |
| --- | --- |
| uuid | d6d7b748-ce2c-2c60-a9e2-62a3bf52b601 |
| handle | `d6d7b748` |
| sha256 | 3a7c8185ba90173febbecb0a47ae846d7a4716bea27d3362f41529f0baf66496 |
| coin | 00000375-ce2c-1c60-89e2-62a3bf52b601 |
| currency | XXX |
| bytes / B | 885 |
| bits / bit | 7080 |
| tokens | 222 |
| joules / J | 2.0326530506357364e-17 |
| technique | `google {"challenge":"surface-code-qec"}` |

| surface-code-qec | value |
| --- | --- |
| challenge | surface-code-qec |
| title | Surface Code Below Threshold (Λ = 2.14), Repetition Code & Steane \[\[7,1,3\]\] CSS QEC |
| category | quantum-error-correction |
| theorem | `textbook_bit_flip_purity` |
| relatedTheorems | `textbook_bit_flip_purity`, `textbook_steane`, `surfacecode_all`, `textbook_toric_torus_code` |
| formula | P\_L(p) = 3p² − 2p³ = 0.028 \< p = 0.1 ∧ Λ\_3,5,7 = 2.14 \> 1 ∧ Steane \[\[7,1,3\]\] = 14/14 |
| holds | true |
| kernelAccepted | true |

| surface-code-qec.solution | value |
| --- | --- |
| uuid | c7944e9f-9252-3f2f-a96e-06171a641ef7 |
| sha256 | 03552aa0694f4fa913194835d3cc4a82a58e69b71a814d17e2e1f6db6e70bf93 |

### surface-code-qec.iso

| clause | term | standard | qpu | uuid |
| --- | --- | --- | --- | --- |
| 3.4.6 | quantum error correction | ISO/IEC 4879:2024 | true | f3fa6e08-9138-5345-9c5b-9cbaa5907f12 |
| 3.4.17 | quantum code | ISO/IEC 4879:2024 | true | de2c0bfe-6df8-3bf2-989f-816df42926b9 |

### surface-code-qec.formula

| theorem | formula | bytes / B | bits / bit | tokens | joules / J | coin | currency | source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_bit_flip_purity` | $\forall \{R : \mathrm{Type}\} [\mathrm{inst} : \mathrm{CommRing}\ R] (p\ q : R), p + q = 1 \to p ^{2} + q ^{2} = 1 - 2 \cdot p \cdot q$ | 134 | 1072 | 34 | 3.077689364804392e-18 | 00000086-21a1-7fc0-89e0-d5ea28f2ad80 | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_steane` | $\forall \{F : \mathrm{Type}\} [\mathrm{inst} : \mathrm{DecidableEq}\ F] \{n : \mathbb{N}\} (d\ t : \mathbb{N}) (c_{1} c_{2} x : \mathrm{Fin}\ n \to F), (c_{1} \ne c_{2} \to d \le \mathrm{hammingDist}\ c_{1} c_{2}) \to 2 \cdot t < d \to \mathrm{hammingDist}\ c_{1} x \le t \to \mathrm{hammingDist}\ x\ c_{2} \le t \to c_{1} = c_{2}$ | 330 | 2640 | 83 | 7.57938425660783e-18 | 0000014a-ddbe-20e5-8c1d-379b199e39df | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `surfacecode_all` | $\mathrm{surfacePhysical}\ 3 = 13 \land \mathrm{surfaceCorrectable}\ 5 = 2 \land \mathrm{surfaceLogical} = 2$ | 107 | 856 | 27 | 2.4575579256273876e-18 | 0000006b-97d5-2995-8b4f-cedf95fb0ee9 | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/Processing/Surfacecode.lean> |
| `textbook_toric_torus_code` | $\forall \{F : \mathrm{Type}\} [\mathrm{inst} : \mathrm{DecidableEq}\ F] \{n : \mathbb{N}\} (d\ t : \mathbb{N}) (c_{1} c_{2} x : \mathrm{Fin}\ n \to F), (c_{1} \ne c_{2} \to d \le \mathrm{hammingDist}\ c_{1} c_{2}) \to 2 \cdot t < d \to \mathrm{hammingDist}\ c_{1} x \le t \to \mathrm{hammingDist}\ x\ c_{2} \le t \to c_{1} = c_{2}$ | 330 | 2640 | 83 | 7.57938425660783e-18 | 0000014a-ddbe-20e5-8c1d-379b199e39df | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## rcs-xeb-beyond-classical

| receipt | value |
| --- | --- |
| uuid | ec54afc7-fd30-2293-b42b-c276a6fcc436 |
| handle | `ec54afc7` |
| sha256 | 1fdf386807ece963b19d165c91c22bb2ed55ad8722bceb6f037719a2bc49fd24 |
| coin | 00000508-fd30-3293-842b-c276a6fcc436 |
| currency | XXX |
| bytes / B | 1288 |
| bits / bit | 10304 |
| tokens | 322 |
| joules / J | 2.958256643185117e-17 |
| technique | `google {"challenge":"rcs-xeb-beyond-classical"}` |

| rcs-xeb-beyond-classical | value |
| --- | --- |
| challenge | rcs-xeb-beyond-classical |
| title | Random Circuit Sampling (RCS) & Cross-Entropy Benchmarking (XEB) Porter–Thomas Speckle |
| category | quantum-algorithms |
| theorem | `textbook_xeb` |
| relatedTheorems | `textbook_xeb` |
| formula | Σ p\_k² \> 1/D ∧ 2/(D+1) \> 1/D (2 \* 16 \> 16 + 1 ∧ 16 + 1 \> 16) |
| holds | true |
| kernelAccepted | true |

| rcs-xeb-beyond-classical.solution | value |
| --- | --- |
| uuid | 801a59dc-a895-73b1-af83-f6a89161c0c5 |
| sha256 | 2dec537759661d42c7e9471f0d176292dd22e692b26de9c162a5590f349bc974 |

### rcs-xeb-beyond-classical.iso

| clause | term | standard | qpu | uuid |
| --- | --- | --- | --- | --- |
| 3.1.9 | algorithm | ISO/IEC 4879:2024 | true | 8960a7da-04a5-775e-88db-84d0185ada3e |
| 3.3.3 | qubit | ISO/IEC 4879:2024 | true | add14fe8-b0f2-88d0-828e-91dc9b7c0002 |
| 3.3.11 | fidelity | ISO/IEC 4879:2024 | true | bd389d3a-11d4-15eb-a310-8881b9798fb2 |
| 3.4.5 | quantum circuit | ISO/IEC 4879:2024 | true | cafc1b4a-7ef6-5fe7-8e9a-ac14d5a73cc4 |
| 3.4.9 | quantum algorithm | ISO/IEC 4879:2024 | true | b15d6e88-e95c-179b-b5ae-f4685dc52b1a |
| 3.5.3 | sampling algorithm | ISO/IEC 4879:2024 | true | c26c3331-b31e-50fa-98e2-cb6c1bbad62d |

### rcs-xeb-beyond-classical.formula

| theorem | formula | bytes / B | bits / bit | tokens | joules / J | coin | currency | source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_xeb` | $\forall (D : \mathbb{N}), 1 < D \to D + 1 < 2 \cdot D \land D < D + 1$ | 69 | 552 | 18 | 1.5847803445634556e-18 | 00000045-fc03-360a-86f5-6d5677afdb34 | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## quantum-echoes-otoc

| receipt | value |
| --- | --- |
| uuid | bbcc2c0f-8d77-522c-a9bf-b64802c30241 |
| handle | `bbcc2c0f` |
| sha256 | 42acf93aee3f1821fee9a427ee26951ceeca83693d680d17b455eac13d993a85 |
| coin | 00000455-8d77-622c-89bf-b64802c30241 |
| currency | XXX |
| bytes / B | 1109 |
| bits / bit | 8872 |
| tokens | 278 |
| joules / J | 2.5471324668418437e-17 |
| technique | `google {"challenge":"quantum-echoes-otoc"}` |

| quantum-echoes-otoc | value |
| --- | --- |
| challenge | quantum-echoes-otoc |
| title | Quantum Echoes Out-of-Time-Order Correlator (OTOC) Time-Reversal Protocol on Willow |
| category | quantum-algorithms |
| theorem | `textbook_echo_qubits_within_willow` |
| relatedTheorems | `textbook_echo_qubits_within_willow`, `Qpu.Verify.Gate.h_z_h_is_two_x` |
| formula | P(U† U \|0⟩ = \|0⟩) = 1 ∧ P(H† Z H \|0⟩ = \|0⟩) = 0 ∧ 65 ≤ 103 ≤ 105 |
| holds | true |
| kernelAccepted | true |

| quantum-echoes-otoc.solution | value |
| --- | --- |
| uuid | 9278d97b-36c7-4e06-962c-d3e55458972f |
| sha256 | 2b7f25a33e361ed965e2f89329ec641717bbd599e05e0e0b83141228d4c432bc |

### quantum-echoes-otoc.iso

| clause | term | standard | qpu | uuid |
| --- | --- | --- | --- | --- |
| 3.1.9 | algorithm | ISO/IEC 4879:2024 | true | 8960a7da-04a5-775e-88db-84d0185ada3e |
| 3.3.3 | qubit | ISO/IEC 4879:2024 | true | add14fe8-b0f2-88d0-828e-91dc9b7c0002 |
| 3.4.8 | quantum processor | ISO/IEC 4879:2024 | true | 8efaebe5-0912-1fb1-a4b7-247fccfa5756 |
| 3.4.9 | quantum algorithm | ISO/IEC 4879:2024 | true | b15d6e88-e95c-179b-b5ae-f4685dc52b1a |

### quantum-echoes-otoc.formula

| theorem | formula | bytes / B | bits / bit | tokens | joules / J | coin | currency | source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_echo_qubits_within_willow` | $\forall \{Q : \mathrm{Type}\} (\mathrm{figure}\ \mathrm{text}\ \mathrm{willow} : \mathrm{Finset}\ Q), \mathrm{figure} \subseteq \mathrm{text} \to \mathrm{text} \subseteq \mathrm{willow} \to \mathrm{figure.card} \le \mathrm{text.card} \land \mathrm{text.card} \le \mathrm{willow.card} \land \mathrm{figure} \subseteq \mathrm{willow}$ | 331 | 2648 | 83 | 7.602352087688462e-18 | 0000014b-9ea0-4370-8f31-22de2a2fd080 | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `Qpu.Verify.Gate.h_z_h_is_two_x` | $\mathrm{Qpu.Verify.Gate.scaledH} \cdot \mathrm{Qpu.Verify.Gate.matZ} \cdot \mathrm{Qpu.Verify.Gate.scaledH} = \{ \mathrm{a00} := \mathrm{Qpu.Verify.Gate.g}\ 0, \mathrm{a01} := \mathrm{Qpu.Verify.Gate.g}\ 2, \mathrm{a10} := \mathrm{Qpu.Verify.Gate.g}\ 2, \mathrm{a11} := \mathrm{Qpu.Verify.Gate.g}\ 0 \}$ | 302 | 2416 | 76 | 6.936284986350197e-18 | 0000012e-3ad8-4100-8591-b8f7d18c271e | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/Processing/QuantumGate.lean> |

## cirq-qvm-simulation

| receipt | value |
| --- | --- |
| uuid | dbbc4fe8-23c8-725d-bfed-8cb41f8a755f |
| handle | `dbbc4fe8` |
| sha256 | 4e4bc8da59d266ba1598293bc310985f938433e34b72f3fdf34e1cb6b9c480b7 |
| coin | 00000299-23c8-425d-8fed-8cb41f8a755f |
| currency | XXX |
| bytes / B | 665 |
| bits / bit | 5320 |
| tokens | 167 |
| joules / J | 1.5273607668618812e-17 |
| technique | `google {"challenge":"cirq-qvm-simulation"}` |

| cirq-qvm-simulation | value |
| --- | --- |
| challenge | cirq-qvm-simulation |
| title | Cirq State-Vector, Density-Matrix Kraus Channels & Willow Quantum Virtual Machine |
| category | quantum-hardware |
| theorem | `textbook_cirq_exports` |
| relatedTheorems | `textbook_cirq_exports` |
| formula | Tr(ρ) = 1 ∧ Tr(ρ²) = 0.1² + 0.9² = 0.82 ∧ Cirq\_exports = 28 ∧ emulated = 15/15 |
| holds | true |
| kernelAccepted | true |

| cirq-qvm-simulation.solution | value |
| --- | --- |
| uuid | b5648eb8-bf19-3908-8554-99c47b81f759 |
| sha256 | 39d3179c515b65df95ad87a66da9843e77b6bd203b6463e504f83b4fc6846e85 |

### cirq-qvm-simulation.iso

| clause | term | standard | qpu | uuid |
| --- | --- | --- | --- | --- |
| 3.2.7 | quantum state | ISO/IEC 4879:2024 | true | c6762069-f0d8-568c-aa4c-a1e6f529aa46 |

### cirq-qvm-simulation.formula

| theorem | formula | bytes / B | bits / bit | tokens | joules / J | coin | currency | source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_cirq_exports` | $7 + 3 + 11 + 10 = 31 \land 6 + 11 = 17$ | 38 | 304 | 10 | 8.72777581063932e-19 | 00000026-20ed-5082-8633-71a96dc8059c | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## recirq-qaoa-shor-algorithms

| receipt | value |
| --- | --- |
| uuid | 1feb6648-9fa0-59c8-b9e4-d01ffa634e86 |
| handle | `1feb6648` |
| sha256 | d3fa018f8d4342251f7ff6575643af18603aaa950cf98d07ef795c2e8398a361 |
| coin | 0000037c-9fa0-89c8-89e4-d01ffa634e86 |
| currency | XXX |
| bytes / B | 892 |
| bits / bit | 7136 |
| tokens | 223 |
| joules / J | 2.0487305323921775e-17 |
| technique | `google {"challenge":"recirq-qaoa-shor-algorithms"}` |

| recirq-qaoa-shor-algorithms | value |
| --- | --- |
| challenge | recirq-qaoa-shor-algorithms |
| title | ReCirq Sycamore QAOA Max-Cut, Shor Order-Finding & Bell CHSH Tsirelson Bound |
| category | quantum-algorithms |
| theorem | `textbook_shor_fifteen_order` |
| relatedTheorems | `textbook_shor_fifteen_order`, `qaoa_all`, `textbook_tsirelson`, `textbook_order_finding` |
| formula | 7^4 ≡ 1 (mod 15) ∧ gcd(7² ± 1, 15) = (3, 5) ∧ E\_QAOA(α\*, β\*) \> E\_random ∧ S\_CHSH = 2√2 \> 2 |
| holds | true |
| kernelAccepted | true |

| recirq-qaoa-shor-algorithms.solution | value |
| --- | --- |
| uuid | 84f71978-d5fe-7480-99c4-ab6e40479980 |
| sha256 | 4b0da54c37b85dfff2eac5bf03ebb64481da38596cd6f2527e3198398339a342 |

### recirq-qaoa-shor-algorithms.iso

| clause | term | standard | qpu | uuid |
| --- | --- | --- | --- | --- |
| 3.1.9 | algorithm | ISO/IEC 4879:2024 | true | 8960a7da-04a5-775e-88db-84d0185ada3e |
| 3.4.9 | quantum algorithm | ISO/IEC 4879:2024 | true | b15d6e88-e95c-179b-b5ae-f4685dc52b1a |

### recirq-qaoa-shor-algorithms.formula

| theorem | formula | bytes / B | bits / bit | tokens | joules / J | coin | currency | source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_shor_fifteen_order` | $\forall (n : \mathbb{N}) [\mathrm{NeZero}\ n] (a : (\mathrm{ZMod}\ n)^{\times}), \mathrm{orderOf}\ a \mid \mathrm{n.totient}$ | 124 | 992 | 31 | 2.8480110539980942e-18 | 0000007c-bb27-2a2e-8eab-d61b41ec13e8 | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `qaoa_all` | $\mathrm{qaoaParams}\ 3 = 6 \land \mathrm{qaoaZz}\ 2\ 5 = 10 \land \mathrm{qaoaX}\ 3\ 4 = 12$ | 91 | 728 | 23 | 2.090072628337311e-18 | 0000005b-fe79-2bad-8b65-d80bc786a833 | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/Application/Qaoa.lean> |
| `textbook_tsirelson` | $\forall (a\ x : \mathbb{R}), 0 \le x \to (a \cdot \surd x) ^{2} = a ^{2} \cdot x$ | 80 | 640 | 20 | 1.8374264864503834e-18 | 00000050-2392-3afb-8eb9-b35b3949a08e | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_order_finding` | $\forall (N : \mathbb{N}) (x : \mathrm{ZMod}\ N), x ^{\mathrm{orderOf}} x = 1 \land \forall (k : \mathbb{N}), 0 < k \to k < \mathrm{orderOf}\ x \to x ^{k} \ne 1$ | 159 | 1272 | 40 | 3.6518851418201365e-18 | 0000009f-f2c1-7bb9-87a7-e2342d4fb9a9 | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## openfermion-chemistry-h2

| receipt | value |
| --- | --- |
| uuid | 52a07646-5bee-37e3-b414-a1df0afd26f8 |
| handle | `52a07646` |
| sha256 | 1eaace8c611720c5cf1cf0d2e5b5042aaea02828e556db1a3a00887cbdd298ae |
| coin | 000003d5-5bee-17e3-8414-a1df0afd26f8 |
| currency | XXX |
| bytes / B | 981 |
| bits / bit | 7848 |
| tokens | 246 |
| joules / J | 2.2531442290097824e-17 |
| technique | `google {"challenge":"openfermion-chemistry-h2"}` |

| openfermion-chemistry-h2 | value |
| --- | --- |
| challenge | openfermion-chemistry-h2 |
| title | OpenFermion H₂ STO-3G Molecular Integrals, Pauli Hamiltonian & VQE Ground Energy |
| category | quantum-algorithms |
| theorem | `textbook_h2_below_hartree_fock` |
| relatedTheorems | `textbook_h2_below_hartree_fock` |
| formula | E\_VQE(θ\*) = min\_θ ⟨00\|exp(iθ Y⊗X) H exp(−iθ Y⊗X)\|00⟩ = E\_FCI = −1.137284 Ha \< E\_HF = −1.116759 Ha |
| holds | true |
| kernelAccepted | true |

| openfermion-chemistry-h2.solution | value |
| --- | --- |
| uuid | fb5f1d3a-d8b3-50d2-ae4c-2a8882bdd2e1 |
| sha256 | 6503673075fce3fbe2b92cba04776955a933ca6f5ff7685e0725d26824d1db48 |

### openfermion-chemistry-h2.iso

| clause | term | standard | qpu | uuid |
| --- | --- | --- | --- | --- |
| 3.1.9 | algorithm | ISO/IEC 4879:2024 | true | 8960a7da-04a5-775e-88db-84d0185ada3e |
| 3.2.12 | Hamiltonian | ISO/IEC 4879:2024 | true | 090bc065-3453-2204-b632-ac869d481a40 |
| 3.4.9 | quantum algorithm | ISO/IEC 4879:2024 | true | b15d6e88-e95c-179b-b5ae-f4685dc52b1a |

### openfermion-chemistry-h2.formula

| theorem | formula | bytes / B | bits / bit | tokens | joules / J | coin | currency | source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_h2_below_hartree_fock` | $11167 < 11373 \land 11373 - 11167 = 206 \land 1 + 2 + 1 + 1 = 5$ | 63 | 504 | 16 | 1.4469733580796768e-18 | 0000003f-8d28-8a22-8cb6-628499a73ae6 | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## qualtran-ftqc-magic-state

| receipt | value |
| --- | --- |
| uuid | a7fa7c75-e6b7-439c-a1f0-f5a3e9b645aa |
| handle | `a7fa7c75` |
| sha256 | 79bcdb2367b9b81cb714d4ca238a6192b65fcc41977f08ac806c46620487e5b4 |
| coin | 000004c1-e6b7-639c-81f0-f5a3e9b645aa |
| currency | XXX |
| bytes / B | 1217 |
| bits / bit | 9736 |
| tokens | 305 |
| joules / J | 2.7951850425126457e-17 |
| technique | `google {"challenge":"qualtran-ftqc-magic-state"}` |

| qualtran-ftqc-magic-state | value |
| --- | --- |
| challenge | qualtran-ftqc-magic-state |
| title | Qualtran Fault-Tolerant Clifford+T Resource Counts & Willow Magic State Cultivation |
| category | quantum-error-correction |
| theorem | `surfacecode_all` |
| relatedTheorems | `surfacecode_all` |
| formula | T(Toffoli) = 7 ∧ T(CS) = 3 ∧ T(T) = 1 ∧ T(Grover) = 7 ∧ T(QEC) = 21 ∧ F\_T(Willow) = 99.99% |
| holds | true |
| kernelAccepted | true |

| qualtran-ftqc-magic-state.solution | value |
| --- | --- |
| uuid | f49209a2-87b3-612a-a629-ba58077a7d34 |
| sha256 | d5ecb9c158acd2930c4d62725bb7427f60a60788e390a7c6c061ed90e415f478 |

### qualtran-ftqc-magic-state.iso

| clause | term | standard | qpu | uuid |
| --- | --- | --- | --- | --- |
| 3.2.7 | quantum state | ISO/IEC 4879:2024 | true | c6762069-f0d8-568c-aa4c-a1e6f529aa46 |
| 3.3.10 | state fidelity | ISO/IEC 4879:2024 | true | 8d3d77ca-4c0b-4351-a745-14a0dab315ba |
| 3.3.11 | fidelity | ISO/IEC 4879:2024 | true | bd389d3a-11d4-15eb-a310-8881b9798fb2 |
| 3.4.5 | quantum circuit | ISO/IEC 4879:2024 | true | cafc1b4a-7ef6-5fe7-8e9a-ac14d5a73cc4 |
| 3.4.6 | quantum error correction | ISO/IEC 4879:2024 | true | f3fa6e08-9138-5345-9c5b-9cbaa5907f12 |

### qualtran-ftqc-magic-state.formula

| theorem | formula | bytes / B | bits / bit | tokens | joules / J | coin | currency | source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `surfacecode_all` | $\mathrm{surfacePhysical}\ 3 = 13 \land \mathrm{surfaceCorrectable}\ 5 = 2 \land \mathrm{surfaceLogical} = 2$ | 107 | 856 | 27 | 2.4575579256273876e-18 | 0000006b-97d5-2995-8b4f-cedf95fb0ee9 | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/Processing/Surfacecode.lean> |

## google-quantum-roadmap-catalog

| receipt | value |
| --- | --- |
| uuid | d8719ba7-ced8-8a1d-98a2-a87e9b36fc05 |
| handle | `d8719ba7` |
| sha256 | ff5309818ca7b3db3a86a8f488f0be95a898a9c6d6169c2fcd45bc9629ef561f |
| coin | 0000038b-ced8-4a1d-88a2-a87e9b36fc05 |
| currency | XXX |
| bytes / B | 907 |
| bits / bit | 7256 |
| tokens | 227 |
| joules / J | 2.083182279013122e-17 |
| technique | `google {"challenge":"google-quantum-roadmap-catalog"}` |

| google-quantum-roadmap-catalog | value |
| --- | --- |
| challenge | google-quantum-roadmap-catalog |
| title | Google Quantum AI 6-Milestone Roadmap to 10⁶ Qubits, Software, Statements & Quantumlib |
| category | quantum-hardware |
| theorem | `textbook_software_cirq_implemented` |
| relatedTheorems | `textbook_software_cirq_implemented`, `textbook_statements_one_topic`, `textbook_repositories_by_language` |
| formula | milestones = 6 (10² → 10⁶ qubits) ∧ software = 1 + 4 = 5 ∧ repositories = 15 |
| holds | true |
| kernelAccepted | true |

| google-quantum-roadmap-catalog.solution | value |
| --- | --- |
| uuid | 9dcfcfad-6671-698f-8faa-6716200da549 |
| sha256 | c7bd046f68fa565a0cd7b03fc51044a26ba0e9bc69accdfdbc19db131c51b4e6 |

### google-quantum-roadmap-catalog.iso

| clause | term | standard | qpu | uuid |
| --- | --- | --- | --- | --- |
| 3.3.3 | qubit | ISO/IEC 4879:2024 | true | add14fe8-b0f2-88d0-828e-91dc9b7c0002 |
| 3.3.5 | physical qubit | ISO/IEC 4879:2024 | true | e8112047-4fd2-374c-8f47-bde71c844441 |

### google-quantum-roadmap-catalog.formula

| theorem | formula | bytes / B | bits / bit | tokens | joules / J | coin | currency | source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_software_cirq_implemented` | $\forall \{\alpha : \mathrm{Type}\ \mathrm{u\_1}\} (\mathrm{tools} : \mathrm{Finset} \alpha ) (\mathrm{implemented} : \alpha \to \mathrm{Prop}) [\mathrm{inst} : \mathrm{DecidablePred}\ \mathrm{implemented}], (\mathrm{Finset.filter}\ \mathrm{implemented}\ \mathrm{tools})\mathrm{.card} + \{x \in \mathrm{tools} \| \neg \mathrm{implemented}\ x\}\mathrm{.card} = \mathrm{tools.card}$ | 377 | 3016 | 95 | 8.658872317397431e-18 | 00000179-ea45-50cd-8841-20b7dce7bb58 | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_statements_one_topic` | $\forall \{\alpha : \mathrm{Type}\ \mathrm{u\_1}\} [\mathrm{inst} : \mathrm{DecidableEq} \alpha ] (\mathrm{statements} : \mathrm{Finset} \alpha ), \forall a \in \mathrm{statements}, 1 + (\mathrm{statements.erase}\ a)\mathrm{.card} = \mathrm{statements.card}$ | 256 | 2048 | 64 | 5.8797647566412266e-18 | 00000100-6e30-66e0-8be8-de7b5bf67247 | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_repositories_by_language` | $\forall \{\iota \kappa : \mathrm{Type}\} [\mathrm{inst} : \mathrm{DecidableEq} \kappa ] (f : \iota \to \kappa ) (s : \mathrm{Finset} \iota ) (t : \mathrm{Finset} \kappa ), (\forall x \in s, f\ x \in t) \to \mathrm{s.card} = \sum k \in t, \{x \in s \| f\ x = k\}\mathrm{.card}$ | 274 | 2192 | 69 | 6.293185716092563e-18 | 00000112-cc76-65d1-874d-4ad5fb7efdba | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## google-discovery-one-door

| receipt | value |
| --- | --- |
| uuid | 5d7c7a76-d6ce-8766-a033-ffe9975097a2 |
| handle | `5d7c7a76` |
| sha256 | d09c0bfa72608aef0dffe385c0376e6dae2485010b0372894ab49677d1ce4e79 |
| coin | 00000285-d6ce-2766-8033-ffe9975097a2 |
| currency | XXX |
| bytes / B | 645 |
| bits / bit | 5160 |
| tokens | 162 |
| joules / J | 1.4814251047006216e-17 |
| technique | `google {"challenge":"google-discovery-one-door"}` |

| google-discovery-one-door | value |
| --- | --- |
| challenge | google-discovery-one-door |
| title | Google Discovery Service Validation, 7 Named Endpoints, Docs Rewrite & qpu-google-call Job |
| category | google-apis-discovery |
| theorem | `textbook_google_one_door` |
| relatedTheorems | `textbook_google_one_door`, `textbook_google_call_schema`, `textbook_google_api_surfaces`, `textbook_google_measured` |
| formula | unknown + missing + broken = 0 ↔ allowed = true ∧ direct = 0 ∧ a + r = n |
| holds | true |
| kernelAccepted | true |
| iso |  |

| google-discovery-one-door.solution | value |
| --- | --- |
| uuid | 347066af-0a6a-54fe-9f12-529bd1870a21 |
| sha256 | 6e63fe2e092beba182d874ae335856e6f5c2786cb952274c8f9f1956acd9057d |

### google-discovery-one-door.formula

| theorem | formula | bytes / B | bits / bit | tokens | joules / J | coin | currency | source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_google_one_door` | $\forall (\mathrm{direct} : \mathbb{N}), \mathrm{direct} = 0 \leftrightarrow \neg 0 < \mathrm{direct}$ | 100 | 800 | 25 | 2.296783108062979e-18 | 00000064-0b65-36da-8f22-d24951397b28 | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_google_call_schema` | $\forall (\mathrm{unknown}\ \mathrm{missing}\ \mathrm{broken} : \mathbb{N}), \mathrm{unknown} + \mathrm{missing} + \mathrm{broken} = 0 \leftrightarrow \mathrm{unknown} = 0 \land \mathrm{missing} = 0 \land \mathrm{broken} = 0$ | 223 | 1784 | 56 | 5.121826330980444e-18 | 000000df-1620-2672-86ed-59f5af612683 | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_google_api_surfaces` | $\forall \{\alpha : \mathrm{Type}\ \mathrm{u\_1}\} \{\beta : \mathrm{Type}\ \mathrm{u\_2}\} [\mathrm{inst} : \mathrm{Fintype} \alpha ] [\mathrm{inst\_1} : \mathrm{Fintype} \beta ] (e : \alpha \simeq \beta ), \mathrm{Fintype.card} \alpha = \mathrm{Fintype.card} \beta $ | 266 | 2128 | 67 | 6.109443067447525e-18 | 0000010a-dbec-4ebd-81b1-bbe00293f9d1 | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_google_measured` | $\forall \{\mathrm{Call} : \mathrm{Type}\} [\mathrm{inst} : \mathrm{DecidableEq}\ \mathrm{Call}] (\mathrm{calls}\ \mathrm{refused} : \mathrm{Finset}\ \mathrm{Call}), \mathrm{refused} \subseteq \mathrm{calls} \to (\mathrm{calls} \setminus \mathrm{refused})\mathrm{.card} = \mathrm{calls.card} - \mathrm{refused.card}$ | 314 | 2512 | 79 | 7.211898959317754e-18 | 0000013a-412e-7eec-82c4-25319331e30d | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## google-workspace-roundtrip-sets

| receipt | value |
| --- | --- |
| uuid | 4d938405-148c-44cb-8983-eb8141d9d7f1 |
| handle | `4d938405` |
| sha256 | a795bed4d28b59f6413e0e9e7f02db1792df6ecd29192bb7298e130bf0d8534f |
| coin | 000002f0-148c-14cb-8983-eb8141d9d7f1 |
| currency | XXX |
| bytes / B | 752 |
| bits / bit | 6016 |
| tokens | 188 |
| joules / J | 1.7271808972633603e-17 |
| technique | `google {"challenge":"google-workspace-roundtrip-sets"}` |

| google-workspace-roundtrip-sets | value |
| --- | --- |
| challenge | google-workspace-roundtrip-sets |
| title | Google Workspace Forms v1, Docs v1, Drive v3 Bidirectional Round-Trips & 26,244 Institution Sets |
| category | google-workspace-cloud |
| theorem | `textbook_workspace_sets` |
| relatedTheorems | `textbook_workspace_sets`, `textbook_workspace_coverage`, `textbook_workspace_round_trip`, `textbook_workspace_docs_round_trip`, `textbook_workspace_drive`, `textbook_institution_bill` |
| formula | 3 \* 3^7 \* 2^2 = 26244 ∧ Forms(14/14) ∧ f(g(f(g(b)))) = b ∧ Docs(lost = 0) ∧ Drive(same = true) |
| holds | true |
| kernelAccepted | true |
| iso |  |

| google-workspace-roundtrip-sets.solution | value |
| --- | --- |
| uuid | a8bb9e92-2986-72d2-9c28-b93314789960 |
| sha256 | d3160c4d6b16a1b192f93f334d5a39f74674c9a5c5cc74104519a26d70f99c09 |

### google-workspace-roundtrip-sets.formula

| theorem | formula | bytes / B | bits / bit | tokens | joules / J | coin | currency | source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_workspace_sets` | $\forall (k : \mathbb{N}) (r : \mathrm{Fin}\ k \to \mathbb{N}), \mathrm{Fintype.card} ((i : \mathrm{Fin}\ k) \to \mathrm{Fin} (r\ i)) = \prod i, r\ i$ | 148 | 1184 | 37 | 3.399238999933209e-18 | 00000094-3fa6-602c-8443-bc6834061bfc | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_workspace_coverage` | $\forall \{\alpha : \mathrm{Type}\ \mathrm{u\_1}\} [\mathrm{inst} : \mathrm{PartialOrder} \alpha ] [\mathrm{inst\_1} : \mathrm{AddCommSemigroup} \alpha ] [\mathrm{inst\_2} : \mathrm{Sub} \alpha ] [\mathrm{OrderedSub} \alpha ] [\mathrm{AddLeftReflectLE} \alpha ] (\mathrm{held}\ \mathrm{missing}\ \mathrm{kinds} : \alpha ), \mathrm{held} + \mathrm{missing} = \mathrm{kinds} \to \mathrm{kinds} - \mathrm{missing} = \mathrm{held}$ | 425 | 3400 | 107 | 9.761328209267661e-18 | 000001a9-cdfb-55ed-8fa8-cc3157bd94d1 | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_workspace_round_trip` | $\forall \{\alpha \beta : \mathrm{Type}\} (f : \alpha \to \beta ) (g : \beta \to \alpha ), \mathrm{Function.LeftInverse}\ f\ g \to (f \circ g) \circ f \circ g = \mathrm{id}$ | 171 | 1368 | 43 | 3.927499114787694e-18 | 000000ab-85a8-5013-8333-bc86bc35fab7 | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_workspace_docs_round_trip` | $\forall \{\alpha : \mathrm{Type}\ \mathrm{u\_1}\} \{\beta : \mathrm{Type}\ \mathrm{u\_2}\} (\mathrm{shape} : \alpha \to \beta ) (\mathrm{back} : \alpha \to \alpha ), (\forall (x : \alpha ), \mathrm{shape} (\mathrm{back}\ x) = \mathrm{shape}\ x) \to \forall (n : \mathbb{N}) (x : \alpha ), \mathrm{shape} (\mathrm{back}^{}[n] x) = \mathrm{shape}\ x$ | 347 | 2776 | 87 | 7.969837384978538e-18 | 0000015b-7a9e-1654-8ae5-0d9623e82cde | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_workspace_drive` | $\forall \{\alpha \beta : \mathrm{Type}\} (e : \alpha \simeq \beta ) (x : \alpha ), \mathrm{e.symm} (e\ x) = x$ | 109 | 872 | 28 | 2.5034935877886473e-18 | 0000006d-76de-21bc-8fc2-8ebc303f19c0 | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_institution_bill` | $\forall \{\alpha : \mathrm{Type}\ \mathrm{u\_1}\} [\mathrm{inst} : \mathrm{Mul} \alpha ] [\mathrm{inst\_1} : \mathrm{Zero} \alpha ] [\mathrm{inst\_2} : \mathrm{Preorder} \alpha ] [\mathrm{MulPosMono} \alpha ] (u\ c\ p : \alpha ), u \le c \to 0 \le p \to u \cdot p \le c \cdot p$ | 277 | 2216 | 70 | 6.362089209334452e-18 | 00000115-23ae-4185-8f6f-3d15c981e251 | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## google-cloud-mcp-bindings-rbac

| receipt | value |
| --- | --- |
| uuid | 02f60ed8-974c-2e2f-be18-c7c84b82284e |
| handle | `02f60ed8` |
| sha256 | 7c9a9a122c94776a3a6568f48f661f32da6f05a824cb3a99fc7b9ec60fc91a20 |
| coin | 00000238-974c-6e2f-8e18-c7c84b82284e |
| currency | XXX |
| bytes / B | 568 |
| bits / bit | 4544 |
| tokens | 142 |
| joules / J | 1.304572805379772e-17 |
| technique | `google {"challenge":"google-cloud-mcp-bindings-rbac"}` |

| google-cloud-mcp-bindings-rbac | value |
| --- | --- |
| challenge | google-cloud-mcp-bindings-rbac |
| title | 15 Google MCPs & Standards RBAC from Workspace groups |
| category | google-workspace-cloud |
| theorem | `textbook_abilities_merge` |
| relatedTheorems | `textbook_abilities_merge`, `textbook_google_mcps`, `textbook_cannot_binds` |
| formula | roles = 4 ∧ google\_mcps = 15 + 3 = 18 ∧ cannot\_waive\_main = true |
| holds | true |
| kernelAccepted | true |
| iso |  |

| google-cloud-mcp-bindings-rbac.solution | value |
| --- | --- |
| uuid | 08e3b3ae-1dfc-4bb1-b413-82dcd61b5618 |
| sha256 | 266ac8068237450000eaf4b263e3f681f97eb6682e08a2cae3daa11cdf911514 |

### google-cloud-mcp-bindings-rbac.formula

| theorem | formula | bytes / B | bits / bit | tokens | joules / J | coin | currency | source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_abilities_merge` | $\forall \{\alpha : \mathrm{Type}\ \mathrm{u\_1}\} [\mathrm{inst} : \mathrm{BooleanAlgebra} \alpha ] (\mathrm{can}\ \mathrm{cannot} : \alpha ), \mathrm{can} \sqcap \mathrm{cannot}^{c} = \top \to \mathrm{can} = \top \land \mathrm{cannot} = \bot $ | 243 | 1944 | 61 | 5.581182952593039e-18 | 000000f3-e10b-85b0-8d15-287e19f9da1e | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_google_mcps` | $\forall (a\ b : \mathbb{N}), \mathrm{Fintype.card} (\mathrm{Fin}\ a \oplus \mathrm{Fin}\ b) = a + b$ | 99 | 792 | 25 | 2.2738152769823494e-18 | 00000063-a21d-83cb-8624-74a29b9478f0 | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_cannot_binds` | $\forall \{\alpha : \mathrm{Type}\} [\mathrm{inst} : \mathrm{BooleanAlgebra} \alpha ] (\mathrm{can}\ \mathrm{cannot} : \alpha ), \mathrm{cannot} = \top \to \mathrm{can} \sqcap \mathrm{cannot}^{c} = \bot $ | 202 | 1616 | 51 | 4.6395018782872176e-18 | 000000ca-2408-7b2a-8c45-b15d09f1d828 | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## google-patents-gemini-xprize-sitemap

| receipt | value |
| --- | --- |
| uuid | 3edf017a-bf65-7751-8ce4-fb1878e168d7 |
| handle | `3edf017a` |
| sha256 | 4c147f11be68175c401869f5a51871055a6260bfe64cff802a12ee8e70ee982a |
| coin | 00000391-bf65-8751-8ce4-fb1878e168d7 |
| currency | XXX |
| bytes / B | 913 |
| bits / bit | 7304 |
| tokens | 229 |
| joules / J | 2.0969629776615e-17 |
| technique | `google {"challenge":"google-patents-gemini-xprize-sitemap"}` |

| google-patents-gemini-xprize-sitemap | value |
| --- | --- |
| challenge | google-patents-gemini-xprize-sitemap |
| title | Google Patents Hardware Verification, Gemini 3.8 Flash Coil Plan & Google XPRIZE Competitions |
| category | google-apis-discovery |
| theorem | `textbook_patent_dates_ordered` |
| relatedTheorems | `textbook_patent_dates_ordered`, `textbook_patent_number_well_formed`, `textbook_patent_term_twenty_years`, `textbook_free_or_coil`, `textbook_prizes_computable`, `textbook_sitemap_leads` |
| formula | priority ≤ filing ≤ publication ∧ filing ≤ grant \< filing + 20y ∧ header = x-goog-api-key ∧ google\_competitions = 4 |
| holds | true |
| kernelAccepted | true |

| google-patents-gemini-xprize-sitemap.solution | value |
| --- | --- |
| uuid | 81c12bbb-5d29-2b80-a051-066d1fd1abc8 |
| sha256 | 959bf3b5a293dd93f432a00a7cab251d2f9d2d4848986ad1f8b556b5f3546362 |

### google-patents-gemini-xprize-sitemap.iso

| clause | term | standard | qpu | uuid |
| --- | --- | --- | --- | --- |
| 3.1.1 | model | ISO/IEC 4879:2024 | true | 5917f698-338e-73a3-b3c7-272a84148d36 |

### google-patents-gemini-xprize-sitemap.formula

| theorem | formula | bytes / B | bits / bit | tokens | joules / J | coin | currency | source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_patent_dates_ordered` | $\forall \{\alpha : \mathrm{Type}\ \mathrm{u\_1}\} [\mathrm{inst} : \mathrm{Preorder} \alpha ] (p\ f\ g : \alpha ), p \le f \to f \le g \to p \le g$ | 146 | 1168 | 37 | 3.3533033377719496e-18 | 00000092-2b67-2ac6-8044-3e83b3fba2a1 | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_patent_number_well_formed` | $\forall (a\ b\ c : \mathbb{N}), \mathrm{Fintype.card} (\mathrm{Fin}\ a \oplus \mathrm{Fin}\ b \oplus \mathrm{Fin}\ c) = a + b + c$ | 129 | 1032 | 33 | 2.962850209401243e-18 | 00000081-c6aa-8da5-8fd5-108711389085 | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_patent_term_twenty_years` | $\forall (f\ \mathrm{term} : \mathbb{N}), 0 < \mathrm{term} \to f < f + \mathrm{term}$ | 84 | 672 | 21 | 1.9292978107729025e-18 | 00000054-4f98-78ad-854d-b8820e0dd56e | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_free_or_coil` | $\forall \{\alpha : \mathrm{Type}\ \mathrm{u\_1}\} [\mathrm{inst} : \mathrm{AddCommSemigroup} \alpha ] [\mathrm{inst\_1} : \mathrm{PartialOrder} \alpha ] [\mathrm{ExistsAddOfLE} \alpha ] [\mathrm{AddLeftMono} \alpha ] [\mathrm{inst\_4} : \mathrm{Sub} \alpha ] [\mathrm{OrderedSub} \alpha ] (\mathrm{calls}\ \mathrm{free} : \alpha ), \mathrm{free} \le \mathrm{calls} \to \mathrm{calls} - \mathrm{free} + \mathrm{free} = \mathrm{calls}$ | 432 | 3456 | 108 | 9.92210302683207e-18 | 000001b0-ae89-20c5-8dbe-fe2ab544c7df | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_prizes_computable` | $\forall \{\alpha : \mathrm{Type}\ \mathrm{u\_1}\} [\mathrm{inst} : \mathrm{PartialOrder} \alpha ] [\mathrm{inst\_1} : \mathrm{AddCommSemigroup} \alpha ] [\mathrm{inst\_2} : \mathrm{Sub} \alpha ] [\mathrm{OrderedSub} \alpha ] [\mathrm{AddLeftReflectLE} \alpha ] (\mathrm{purse}\ \mathrm{fund}\ \mathrm{perproblem}\ \mathrm{invested}\ \mathrm{none}\ \mathrm{total}\ \mathrm{winnable} : \alpha ), \mathrm{purse} + \mathrm{fund} + \mathrm{perproblem} + \mathrm{invested} + \mathrm{none} = \mathrm{total} \to \mathrm{winnable} = \mathrm{purse} + \mathrm{fund} + \mathrm{perproblem} \to \mathrm{total} - \mathrm{invested} - \mathrm{none} = \mathrm{winnable}$ | 651 | 5208 | 163 | 1.4952058033489994e-17 | 0000028b-d7ee-48e6-8071-fe281125d8fb | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_sitemap_leads` | $\forall (u\ v\ c\ l : \mathbb{N}), v \le u \to c + l = v \to c + l + (u - v) = u$ | 80 | 640 | 20 | 1.8374264864503834e-18 | 00000050-5d07-84e5-8735-f89045cf7ae4 | XXX | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
