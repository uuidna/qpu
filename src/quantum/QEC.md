# Quantum error correction

The `quantum-error-correction` tool (ISO/IEC 4879:2024, 3.4.6) of a logical qubit (3.3.7). The cycle is [`qec.ts`](processing/qec.ts). The detailed specification is [`README.md`](README.md). The processors are [`PROCESSORS.md`](PROCESSORS.md). The [[7,1,3]] Steane table is the `steane` name in [`ALGORITHMS.md`](ALGORITHMS.md).

The code is the three-qubit repetition code. `bit_flip` encodes \|000⟩ and \|111⟩. `phase_flip` is that code inside a Hadamard frame, so the encoded states are \|+++⟩ and \|−−−⟩. Data qubits are line 0, 1, and 2. Ancillas are line 3 and 4.

One cycle prepares the logical state on line 0, copies it onto the three data qubits, applies the channel once to each data qubit, extracts the syndromes d0⊕d1 and d1⊕d2, corrects the named data qubit with three Toffolis, decodes, and undoes the preparation. The syndrome pair (1, 0) names line 0, (1, 1) names line 1, and (0, 1) names line 2. Encoding, syndrome extraction, correction, and decoding are noiseless. The channel acts once on each data qubit and nowhere else. The logical error is the probability that line 0 is \|1⟩ in the simulated density matrix. The physical error is that probability for the same state with no code.

| Argument | Values | When it is omitted |
|---|---|---|
| `code` | `bit_flip`, `phase_flip` | `bit_flip`, once `p` is passed. Omit `p` and the call is unlimited |
| `channel` | `bit_flip`, `phase_flip`, `depolarize` | `bit_flip`, once `p` is passed |
| `p` | a probability in [0, 1] | the call is unlimited. Pass 0.1 to prove the repetition code |
| `logical` | `0`, `1`, `+`, `-` | `0`, once `p` is passed |
| `sweep` | probabilities in [0, 1] | 0.01, 0.02, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, once `p` is passed |

The call returns `at` (the point at `p`), `sweep` (one point per sweep probability), `breakEven`, `helpsAtP`, and the circuit size. A point is `p`, `physicalError`, `logicalError`, and `textbook`. `helpsAtP` is true when the logical error is below the physical error. `breakEven` is the probability where that stops, found by fifty bisection steps between the last sweep point that helps and the first that does not. A sweep with no crossing returns null.

The textbook figure 3p² − 2p³ is reported when the code matches the channel and the logical state is \|0⟩ or \|1⟩. A bit-flip code under bit-flip noise, and a phase-flip code under phase-flip noise, both read that figure from the density matrix. On \|+⟩ or \|−⟩, and on a channel the code is not built for, `textbook` is null. A logical \|+⟩ in the bit-flip code has logical error 0 under bit flips, because the logical X leaves \|+⟩ unchanged. Under depolarizing noise the bit-flip code on \|0⟩ sees each qubit flipped with probability 2p/3, and the logical error is 3q² − 2q³ at that q. For the matched bit-flip code the break-even is 1/2, where 3p² − 2p³ = p.

The cycle is 5 qubits, 3 channel operations, and 3 Toffolis. The T-count of those Toffolis is 21. The unencoded qubit has one channel.

`fault-tolerant-design` with `circuit: 'qec'` counts that same bit-flip cycle at p = 0.1. The `steane` algorithm locates each of the 14 single-qubit X and Z errors of the [[7,1,3]] code. Its syndrome is the binary numeral of the qubit, and the distance is 3. Willow's surface-code distances and Λ are on the processor, not on this tool.
