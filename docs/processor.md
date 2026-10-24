---
title: Processor
order: 10
---

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
