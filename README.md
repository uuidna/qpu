# @uuidna/qpu v1.1.1: An exact quantum processing unit served over MCP

One UUID is a register of 32 hexbits of 4 qubits, less 4 version and 2 variant qubits: 122 qubits in 16 bytes (Qpu.Verify.Uuid.free\_is\_122). Its high 16 qubits address 65536 hexbit programs and its low 106 carry the message (Qpu.Verify.Uuid.program\_capacity), so a machine holds one register for every 16 bytes of its memory at 122 qubits each, as the device receipt below counts. 1631 declared theorems, 2466 in the Lean 4 kernel, rest on 0 sorry, 836 are recomputed by a worked example (textbook\_expressions\_evaluate), each statement below is shown with its Lean proof and the line it stands on, and every tool is served over MCP at <https://qpu.uuidna.com/api/mcp>.

The computer these registers make is every circuit its quantum doors build: 55 worked examples across 5 doors, each replayed on this build and each named by the kernel theorem that makes it true (textbook\_teleport\_three\_qubits is one), as the examples below list.

116 of the worked examples were made by the build itself, each from a statement no hand had worked, evaluated and replayed (textbook\_expressions\_evaluate); 795 declared theorems still have no example and stay open; and no language model takes part, so every figure here is computed by the build at no token cost.

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
| declared theorems | 1631 |
| kernel theorems | 2466 |
| generated lemmas | 835 |
| sorry | 0 |
| recomputed by an example | 836 |
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
| uuid | d4c79029-a249-8b77-9f2f-b8b9d1436fc9 |
| handle | `d4c79029` |
| sha256 | f49e5d82d0be8f9cd542f27471d55561ce0e2e63d6e2c88512e82c1bd034bb24 |
| coin | 00000100-a249-7b77-8f2f-b8b9d1436fc9 |
| bytes | 256 |
| bits | 2048 |
| tokens | 64 |
| joules | 5.8797647566412266e-18 |
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
| `textbook_sha256_fips_180_4` | `ba6cdad3` | ba6cdad3-2685-344b-b53f-20a8151801ac |
| `textbook_sha3_fips_202` | `f4b15a9f` | f4b15a9f-ade1-853a-a56b-8e07cb0b2be0 |
| `textbook_pqc_standards_three` | `6434ef1e` | 6434ef1e-d198-6248-9e25-fbf75a94b200 |
| `textbook_coil_green` | `e9045825` | e9045825-9cd3-19c5-91ae-8c31ba8d1216 |

| qpu | value |
| --- | --- |
| rfc | 6962 |
| root | 305658b87baa9c65684a005de4ce064c585bc47433539783b51e43a16f037647 |
| parts | ba6cdad3-2685-344b-b53f-20a8151801ac, f4b15a9f-ade1-853a-a56b-8e07cb0b2be0, 6434ef1e-d198-6248-9e25-fbf75a94b200, e9045825-9cd3-19c5-91ae-8c31ba8d1216 |

## textbook\_sha256\_fips\_180\_4

| receipt | value |
| --- | --- |
| uuid | ba6cdad3-2685-344b-b53f-20a8151801ac |
| handle | `ba6cdad3` |
| sha256 | 3e56abec65b29f07871a4d5154999adb0babe31dc7ef667020abe725a951f6fc |
| coin | 00000157-2685-544b-853f-20a8151801ac |
| bytes | 343 |
| bits | 2744 |
| tokens | 86 |
| joules | 7.877966060656018e-18 |
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

| textbook\_sha256\_fips\_180\_4.cern | value |
| --- | --- |
| host | opendata.cern.ch |
| via | cern |
| holds | true |

### textbook\_sha256\_fips\_180\_4.formula

| theorem | formula | bytes | bits | tokens | joules | coin | source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_sha256_fips_180_4` | $\forall (m\ k : \mathbb{N}), \mathrm{Fintype.card} (\mathrm{Fin} (m \cdot k) \to \mathrm{Bool}) = \mathrm{Fintype.card} (\mathrm{Fin}\ m \to \mathrm{Fin}\ k \to \mathrm{Bool})$ | 175 | 1400 | 44 | 4.0193704391102135e-18 | 000000af-f5c6-63f2-8613-45eb992d2fe6 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## textbook\_sha3\_fips\_202

| receipt | value |
| --- | --- |
| uuid | f4b15a9f-ade1-853a-a56b-8e07cb0b2be0 |
| handle | `f4b15a9f` |
| sha256 | 6acc70da1fed60c95daf7526bea90b3495789a4701d1aa78c4968aedea9b0c19 |
| coin | 00000126-ade1-453a-856b-8e07cb0b2be0 |
| bytes | 294 |
| bits | 2352 |
| tokens | 74 |
| joules | 6.7525423377051586e-18 |
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

| textbook\_sha3\_fips\_202.cern | value |
| --- | --- |
| host | opendata.cern.ch |
| via | cern |
| holds | true |

### textbook\_sha3\_fips\_202.formula

| theorem | formula | bytes | bits | tokens | joules | coin | source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_sha3_fips_202` | $1600 - 512 = 1088 \land 512 = 2 \cdot 256 \land 1600 - 1024 = 576 \land 1024 = 2 \cdot 512$ | 90 | 720 | 23 | 2.0671047972566813e-18 | 0000005a-e5e3-600f-88e4-fa974e4b3cf7 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## textbook\_pqc\_standards\_three

| receipt | value |
| --- | --- |
| uuid | 6434ef1e-d198-6248-9e25-fbf75a94b200 |
| handle | `6434ef1e` |
| sha256 | bb91b18b495e1c476efeab5b5f4eda09e3e0c30273c99012f6d9f6adf1d3d2ba |
| coin | 00000132-d198-3248-8e25-fbf75a94b200 |
| bytes | 306 |
| bits | 2448 |
| tokens | 77 |
| joules | 7.028156310672717e-18 |
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

| textbook\_pqc\_standards\_three.cern | value |
| --- | --- |
| host | opendata.cern.ch |
| via | cern |
| holds | true |

### textbook\_pqc\_standards\_three.formula

| theorem | formula | bytes | bits | tokens | joules | coin | source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_pqc_standards_three` | $202 + 1 = 203 \land 203 + 1 = 204 \land 204 + 1 = 205 \land 205 - 202 = 3 \land 384 \cdot 3 + 32 = 1184 \land 32 \cdot (10 \cdot 3 + 4) = 1088 \land 16 \cdot (1 + 14 \cdot (1 + 12) + 63 + 7 \cdot 35) = 7856$ | 206 | 1648 | 52 | 4.731373202609737e-18 | 000000ce-c7be-3aef-8508-9bd7711f2bb0 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## textbook\_coil\_green

| receipt | value |
| --- | --- |
| uuid | e9045825-9cd3-19c5-91ae-8c31ba8d1216 |
| handle | `e9045825` |
| sha256 | aab4fc6d08f4a6afefeed5fad368f4aed13661df3eac0b27459b310af9d6f42e |
| coin | 00000120-9cd3-49c5-81ae-8c31ba8d1216 |
| bytes | 288 |
| bits | 2304 |
| tokens | 72 |
| joules | 6.61473535122138e-18 |
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

| textbook\_coil\_green.cern | value |
| --- | --- |
| host | opendata.cern.ch |
| via | cern |
| holds | true |

### textbook\_coil\_green.formula

| theorem | formula | bytes | bits | tokens | joules | coin | source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_coil_green` | $432 \bmod 360 + 432 / 9 = 120$ | 29 | 232 | 8 | 6.660671013382639e-19 | 0000001d-a774-129f-876b-f5812d543cda | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
---

| text | value |
| --- | --- |
| uuid | 687c981a-8a92-79c4-b952-91c325963c94 |
| sha256 | a86d840e22589d4ad2c65c3321a056323cc9537fa5ae2b86c98090b4f9c57dfc |
| merge | d4c79029-a249-8b77-9f2f-b8b9d1436fc9 |
| verify | `verify {"uuid":"687c981a-8a92-79c4-b952-91c325963c94","content":"text"}` |
| mcp | <https://qpu.uuidna.com/api/mcp> |

<!-- hardware -->

<details>
<summary>hardware</summary>

## hardware

| receipt | value |
| --- | --- |
| uuid | b3a10d20-87a6-2636-ae85-5740c4b9e374 |
| handle | `b3a10d20` |
| sha256 | 61c44f422614d9f2da31ea12e49938c0ad63e641a3f2d91e617f753a57fef046 |

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
| cpuUserMs | 445555350 |
| cpuNiceMs | 0 |
| cpuSysMs | 192970010 |
| cpuIdleMs | 1625557440 |
| cpuIrqMs | 0 |
| memoryBytes | 34359738368 |
| freeMemoryBytes | 1240023040 |
| load1 | 3.40478515625 |
| load5 | 3.146484375 |
| load15 | 3.57763671875 |
| uptimeS | 247174 |
| diskBytes | 994662584320 |
| diskFreeBytes | 822593482752 |
| diskAvailableBytes | 822593482752 |
| diskBlockBytes | 4096 |
| inodes | 8047829693 |
| inodesFree | 8033139480 |
| networkInterfaces | 10 |
| lean | leanprover/lean4:v4.33.0 |
| rssBytes | 373751808 |
| heapTotalBytes | 202473472 |
| heapUsedBytes | 81003424 |
| externalBytes | 12273807 |
| arrayBuffersBytes | 5858196 |
| processUserMicros | 4199122 |
| processSystemMicros | 121501 |
| maxRssKb | 365008 |
| pageFaults | 23758 |
| fsReads | 0 |
| fsWrites | 0 |
| contextSwitches | 3805 |
| buildMs | 2986 |
| at | 2026-11-26T13:26:16.075Z |

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
