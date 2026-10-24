---
title: Algorithms
order: 28
---

# Algorithms

The textbook algorithms of Google's Cirq experiments page, built from the Cirq layer in `src/quantum/algorithms.ts` and served by the `algorithm` tool.

- **Quantum Fourier transform.** A Hadamard on each qubit, controlled phases CZ**(1/2^k) from each less significant qubit, and the final swaps that restore the standard order. The page notes the output is reversed without the swaps. This repository's QFT is the discrete Fourier transform, checked against the formula for every input on 3, 4 and 8 qubits.
- **Phase estimation.** Hadamards on the estimation qubits, controlled U^(2^k), the inverse QFT, then a measurement. For θ = 0.234 with three bits the most frequent estimate is 0.25, the nearest multiple of 1/8.
- **Grover on two qubits.** One iteration finds the marked |00> with certainty. The oracle is an open-control Toffoli onto an ancilla in |−>.
- **Teleportation.** The page's circuit uses a mid-circuit measurement, which the simulator does not support, so the deferred-measurement form is built: the corrections are controlled by the qubits that would have been measured. Bob's Pauli expectations equal the message's.
- **QAOA max-cut, depth 1.** The cost layer is ZZ**(alpha·w) per edge, the mixer X**beta per node. The page's sweep is a 5 by 5 grid over [0, 2π), and its objective is the estimate_cost value, 2·cut − W, maximized by argmax. The objective is sampled as the page does it: 20,000 shots per point, drawn from the state's probabilities by a seeded generator, with the mean of the edge signs. The weights are seeded from a 32-bit generator, so the instance is not numpy's with seed 11.
- **Shor's order finding.** Phase estimation of U|x> = |a·x mod N>, with 2n counting qubits where n is the bit length of N. For N = 15 it finds the order 4 from bases 7 and 2, and the factors 3 and 5. The page names Shor's algorithm only as a later use of phase estimation, so this circuit is built from the page's phase estimation.
