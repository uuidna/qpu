# Quantum echoes

The `echo` tool and the `echo_benchmark` tool. The circuit is [`echo.ts`](processing/echo.ts). The detailed specification is [`README.md`](README.md). The chemistry is [`CHEMISTRY.md`](CHEMISTRY.md).

`echo` runs a list of operations forward, applies one optional perturbation, then applies the adjoint of each forward operation in reverse order. The probability is the weight of \|0…0⟩ in the simulated state vector: the square of the real part of the first amplitude plus the square of its imaginary part. A gate power is inverted by the adjoint of that power. A forward operation that is not a gate is appended again on the way back.

Omit `forward` and the call does not run. The phase is `unlimited`, at 432 Hz, with `params` false.

| Argument | Meaning |
|---|---|
| `forward` | the operations run forward, then inverted |
| `perturbation` | one operation inserted between the two halves |

The call returns `probability` and `operations`. With no perturbation the probability is 1, to 10⁻¹², including a forward half that uses a gate power. A perturbation that reaches the measured qubits leaves the probability below 1 − 10⁻⁶. For two forward operations the circuit is 4 operations, or 5 when a perturbation is present.

The same pair, Hadamard then CNOT, is the coherence check in the vocabulary. The unperturbed echo holds at 1. The echo perturbed by X on the second qubit stays below 1 − 10⁻⁶.

`echo_benchmark` takes no arguments. It returns the figures Google states, none estimated here.

| Field | Stated |
|---|---|
| Processor | Willow |
| Qubits | 105 |
| Speedup | 13000 |
| Molecules | 15 and 28 atoms |
| Qubits in the figure | 65 |
| Qubits in the text | 103 |
| Quantum run | 2 hours |
| Frontier time per data point | 3.2 years |
| Classical red team | 10 person-years |
| Classical algorithms | 9 |
| NMR demonstration beyond classical | false |

The protocol is six steps: prepare a ground state with one qubit in \|ψ_M⟩, evolve forward by a random circuit U, apply a one-qubit perturbation B, evolve backward by U†, apply a one-qubit probe M, and repeat those steps k times before measuring another qubit. The figure uses no more qubits than the text, and the text uses no more than the 105-qubit array.
