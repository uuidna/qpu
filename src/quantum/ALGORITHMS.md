# Quantum algorithms

The `algorithm` tool (ISO/IEC 4879:2024, 3.4.9). The names are the `name` enum in [`mcp.ts`](processing/mcp.ts). The circuits are [`algorithms.ts`](processing/algorithms.ts). The detailed specification is [`README.md`](README.md). The vocabulary index is [`VOCABULARY.md`](VOCABULARY.md).

Omit `name` and the call reads the formulas. It does not run them. The phase is `discovery`, unlimited, at 432 Hz, and `ran` is false. The formulas map to `order`, `shor`, and `factor`.

An omitted width is the UUID register: `uuidQubits` at `hexbit` 4, 122 effective qubits. A simulated state vector is returned only when the caller passes a width the circuit can build. At width 16 or above, and on the register width, the call returns that capacity: the formula, the sealed coin, and an empty sample table.

A superposition of the schema records every enum combination and does not write one of them in as the default. The tool stays unlimited whichever combination that superposition names. An example that proves a bound passes that bound: QFT at 3 qubits, Grover at 2, QAOA at 12 nodes, Shor at N = 15, VQE at 20 steps, XEB at depth 12.

Each result has `summary` and a table (`header`, `rows`).

| Name | Arguments that change it | What the call returns |
|---|---|---|
| `qft` | `qubits`, `input` | The Fourier transform of \|x⟩. Below 16 qubits, one amplitude and probability per basis state. |
| `inverse_qft` | `qubits`, `input` | The inverse transform, on the same table. |
| `phase_estimation` | `theta`, `bits`, `repetitions` | Estimates of the eigenphase. Below 16 estimation bits, and only when `repetitions` is passed, the estimates ranked by count. Omit the samples and the call is the register. |
| `grover` | `qubits`, `repetitions` | Query count π/4·√(2ⁿ). The two-qubit circuit runs only when `qubits` is 2, and the marked state is \|00⟩. Omit `repetitions` and that circuit is the exact outcome. Pass `repetitions` and those samples are counted. |
| `teleportation` | | Pauli expectations of the sent state and of Bob's received state. The message is X^0.25 on \|0⟩. |
| `qaoa` | `nodes`, `weights`, `alpha`, `beta`, `sweep` | A graph on the Sycamore layout. Omit `nodes` and the graph is the UUID register. Pass 12 for the page's instance. Below 16 nodes, the expected cut. `sweep` true returns the best alpha and beta on the page's grid. One weight per edge, all 1 by default. |
| `deutsch_jozsa` | `qubits`, `balanced`, `repetitions` | One query. Omit `balanced`, once the width is passed, and the oracle is balanced. Below 16 inputs, the measured inputs decide constant or balanced. Omit `repetitions` and that one query is the sample. |
| `bernstein_vazirani` | `hidden`, `repetitions` | One query recovers the hidden bit string. Omit `hidden` and the call is the register. A string of 12 bits or longer is recovered as itself. A shorter string is measured. |
| `simon` | `qubits`, `repetitions` | One query for a hidden period. The circuit runs when `qubits` is 2, and the period is `11`. Every measured y satisfies y·s = 0. Omit `repetitions` and that one query is the sample. |
| `vqe` | `steps` | A sweep of ⟨Z⟩ over θ in [0, 1]. Pass 20 to prove the ground energy. Omit `steps` and the call is unlimited. The row of lowest energy is the ground energy. |
| `chsh` | | The CHSH value S, the correlators ⟨ZZ⟩, ⟨XX⟩, ⟨ZX⟩, ⟨XZ⟩, the classical bound 2, and the Tsirelson bound 2√2. |
| `trotter` | `theta` | Fidelity of the Trotter steps 1, 2, 4, 8, 16, 32 for e^(−i(X+Z)t). `theta` is t. Pass 1 to prove the fidelity. Omit it and the call is unlimited. |
| `xeb` | `qubits`, `depth` | Collision probability Σp² against the Porter–Thomas value 2/(D+1) and the uniform value 1/D. Pass depth 12 for the page's instance. Omit `depth` and the call is the register. Below 16 qubits, and only when `depth` is passed, the collision is measured. |
| `no_cloning` | | Optimal 1→2 cloning fidelity 5/6. A perfect copy is impossible. |
| `holevo` | | Holevo χ, the von Neumann entropy, and the bound log₂ d = 1 bit. |
| `gottesman_knill` | `qubits` | Stabilizer size 2n²+n against 2ⁿ amplitudes. Above 53 qubits the sizes are the integers of that formula. |
| `eastin_knill` | | The single-qubit Clifford group is finite, so a transversal gate set is not universal. T needs magic-state distillation. |
| `solovay_kitaev` | | The order of T is 8, H and T do not commute, and ⟨H, T⟩ is dense in SU(2). The approximation length is O(log^c(1/ε)). |
| `steane` | | The [[7,1,3]] Steane code. Distance 3. Each single-qubit error, its syndrome, and the qubit located. |
| `order` | `N`, `a`, `budget` | The least r with a^r ≡ 1 (mod N), found by baby-step giant-step over the UUID register. Omit `N` or `a` and the call reads the formula. `budget` defaults to 4194304. An order above that budget stays bounded. |
| `shor` | `N`, `a`, `order`, `repetitions`, `budget` | The register is one UUID, 122 effective qubits. The circuit width is 3⌈log₂(N+1)⌉. A base that shares a factor with N is split by Euclid before any circuit. A given `order` runs the reduction gcd(a^(r/2) ± 1, N) at any size. Omit `repetitions` and the order is the exact witness on the register. Pass `repetitions` and, when N fits a safe integer and the circuit is under 24 qubits, that many circuit samples are drawn. |
| `factor` | `integer`, `reflections`, `from`, `witness`, `address`, `order`, `find`, `observe`, `create`, `a`, `budget` | A leading integer in `integer`, a minus allowed. The σ-reflection searches centres from ⌈√N⌉. `reflections` defaults to 4096 and `from` resumes a previous `reached`. `witness` is the centre (p+q)/2 and splits N in one step. `order` or `find` finishes a leftover part by order-finding, then the reduction. `observe` divides only by the primes 2, 3, 5, 7, 11, 13 that appear as nibbles of the address. The search count is then 0. `create` mints N = p·q from `{ p, q }` or from `{ bits, seed }`. Text that is not an integer is a meaning, sent to `imagine`. The product of the parts is checked. |

A reference page under `cirq`, `cirq_google`, or `openfermion` is classified in [`OPEN.md`](OPEN.md). Chemistry is `vqe` of H₂ in STO-3G, one molecule, in [`chemistry.ts`](processing/chemistry.ts). The `vqe` name on this tool sweeps ⟨Z⟩.
