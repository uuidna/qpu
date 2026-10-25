# Willow

Willow is Google Quantum AI's superconducting processor. Every figure here is the one its spec sheet (published Dec 9, 2024) states. The code is `src/quantum/processor.ts`.

## Grid

105 qubits on a grid of rows 0 to 12. Two qubits are coupled when they are next to each other along a row or a column: 182 couplers, so the average connectivity is 2 × 182 / 105 = 3.47, the figure the sheet states.

## Chip 1: quantum error correction

| Figure | Value |
| --- | --- |
| Single-qubit gate error | 0.035% ± 0.029% |
| Two-qubit gate error (CZ) | 0.33% ± 0.18% |
| Measurement error (repetitive, measure qubits) | 0.77% ± 0.21% |
| T1 | 68 µs ± 13 µs |
| Error correction cycles per second | 909,000 (surface code cycle 1.1 µs) |
| Λ for code distances 3, 5, 7 | 2.14 ± 0.02 |

Λ above 1 means error correction is below threshold.

## Chip 2: random circuit sampling

| Figure | Value |
| --- | --- |
| Single-qubit gate error | 0.036% ± 0.013% |
| Two-qubit gate error (iSWAP-like) | 0.14% ± 0.052% |
| Measurement error (terminal, all qubits) | 0.67% ± 0.51% |
| T1 | 98 µs ± 32 µs |
| Circuit repetitions per second | 63,000 |
| Application | 103 qubits, depth 40, XEB fidelity 0.1% |
| Estimated time on Willow vs a classical supercomputer | 5 minutes vs 10^25 years |

## Magic state cultivation

The Google blog reports a 40-fold reduction in errors relative to un-cultivated states, T-states at a logical fidelity of 99.99%, and a distance-3 color code grafted to a distance-5 surface code.

## Willow Early Access Program

Google Quantum AI selects research partners for exclusive access to Willow, which is not yet available to the public. The submission deadline the page states is May 15, 2026. Proposals must be designed for a Willow processor, and selected applicants are notified; the page gives no notification date.

## Hardware

Google's quantum computer page states that its hardware focuses on superconducting qubits. These require specialized cryogenic environments and custom control electronics, and the processor is built in Google's Santa Barbara facility.

## The error-correction preprint

The paper the homepage links as Nature, "Quantum error correction below the surface code threshold" (arXiv 2408.13687), states: distance-5 and distance-7 memories, Λ = 2.14 ± 0.02 for each increase of two in distance, a 101-qubit distance-7 code with 0.143% ± 0.003% error per cycle, a logical memory 2.4 ± 0.3 times the lifetime of the best physical qubit, a decoder latency of 63 μs at distance 5 up to a million cycles, a cycle time of 1.1 μs, repetition codes to distance 29, and correlated error events about once an hour.

## Sycamore

The Google devices page prints Sycamore's device diagram: each character cell is a qubit at its row and column, and its 54 filled cells are the stated 54 qubits. Row and column neighbours give the 88 couplers the page states, and the tests check both counts. The page states two-qubit gates `cirq.ISWAP**0.5` (32 ns) and the Sycamore gate, equivalent to FSimGate(π/2, π/6), at 12 ns.

Cirq's known_devices source on GitHub defines the same 54-cell grid, and its Sycamore23, the 23-qubit subset, is served as a device too. The source builds couplers from neighbours and lists no coupler set.
