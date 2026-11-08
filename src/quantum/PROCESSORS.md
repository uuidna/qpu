# Quantum processors

The `processor` tool. The layouts are [`processor.ts`](processing/processor.ts). The detailed specification is [`README.md`](README.md). The algorithms are [`ALGORITHMS.md`](ALGORITHMS.md).

A site is a grid qubit at a row and a column. A coupler joins two sites that share a row and neighbouring columns, or a column and neighbouring rows. Average connectivity is 2E/N, twice the coupler count over the site count. `fitsProcessor` holds when the circuit's qubit count is at most the processor's.

Omit `name` and every layout is computed. The call is unlimited, at 432 Hz, with `params` false. The named figures are Willow's. `processors` lists all five.

| Name | Qubits | Couplers | 2E/N | What the object holds |
|---|---:|---:|---:|---|
| Willow | 105 | 182 | 3.47 | The spec-sheet grid, two chips, and the noise model. Stated average connectivity 3.47. Typical connectivity 4. |
| Sycamore | 54 | 88 | 3.26 | The printed device diagram. Stated qubits 54. Stated couplers 88. |
| Sycamore23 | 23 | 32 | 2.78 | The 23-qubit subset of that diagram. |
| Bristlecone | 72 | 121 | 3.36 | A 12-row diamond. Stated qubits 72. No gate-error rates. |
| Foxtail | 22 | 31 | 2.82 | A 2 × 11 ladder. Stated qubits 22. Stated couplers 31. No gate-error rates. |

`DEVICES` is Willow, Sycamore, and Sycamore23. The `circuit` tool validates a circuit against one of those three. Bristlecone and Foxtail are layouts the `processor` tool lists. They are not a `device` on `circuit`.

Name `Willow`, or omit the name, and the call returns the two chips.

| Chip | Single-qubit gate error | Two-qubit gate | Measurement error | T1 |
|---|---:|---|---:|---:|
| Error correction | 0.00035 ± 0.00029 | CZ 0.0033 ± 0.0018 | 0.0077 ± 0.0021, repetitive, measure qubits | 68 ± 13 µs |
| Random circuit sampling | 0.00036 ± 0.00013 | iSWAP-like 0.0014 ± 0.00052 | 0.0067 ± 0.0051, terminal, all qubits | 98 ± 32 µs |

Errors are probabilities. The error-correction chip runs 909000 cycles per second. One surface-code cycle is 1.1 µs. Λ for distances 3, 5, and 7 is 2.14 ± 0.02. `isBelowThreshold` holds because that mean is above 1. The random-circuit chip runs 63000 repetitions per second. Its application is 103 qubits, depth 40, XEB fidelity 0.001. Both chips reset by multi-level reset of \|1⟩ and above, or by leakage removal of \|2⟩ only.

`willowNoise` is the param a circuit takes. A one-qubit gate is followed by a depolarizing channel with p = 1.5 times the single-qubit gate error. A two-qubit gate is followed by a depolarizing channel with p = 0.75 times the two-qubit gate error, on each of its qubits. The names are `willow_error_correction` and `willow_random_circuit_sampling`. T1 and readout are not applied.

Magic-state cultivation is a 40-fold reduction, logical fidelity 0.9999, from a distance-3 color code to a distance-5 surface code. The error-correction preprint records distances 5 and 7, logical error per cycle 0.00143 ± 0.00003, 101 qubits in the distance-7 code, repetition-code distance 29, decoder latency 63 µs at distance 5, and beyond break-even 2.4 ± 0.3.
