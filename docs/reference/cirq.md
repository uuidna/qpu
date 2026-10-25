# Cirq

Cirq is Google Quantum AI's Python library for writing, manipulating and optimizing quantum circuits. This page covers the layer `src/quantum/cirq.ts` implements.

- **Qubits**: `LineQubit`, `GridQubit` and `NamedQubit`.
- **Gates**: `X`, `Y`, `Z`, `H`, `CZ`, `CNOT`, `SWAP`. A gate takes a power, so `X**0.5` is the square root of NOT, as Cirq's documentation shows. `adjointOf` gives the inverse of any gate.
- **Operations and moments**: `applied(gate, ...qubits)` and `measure(qubits, key)`. Appended operations slide to the earliest moment after their last conflict.
- **Insert strategies**: `append(op, 'EARLIEST')` slides an operation to the earliest moment after its last conflict, the default; `'NEW'` gives it a moment of its own.
- **Devices**: `Device` holds a processor's qubits and couplers. An operation fits when its qubits are the device's, and a two-qubit gate acts on a coupler. `deviceOf(WILLOW)` is Willow's device.
- **Simulator**: `simulate` returns the amplitudes, and `run(circuit, repetitions)` samples bitstrings by measurement key.

The state-vector simulator is exact for the sizes Cirq documents, about 20 qubits.

- **Density-matrix simulator**: `DensityMatrixSimulator` keeps the state as a density matrix, so noise acts exactly rather than by sampling. Its depolarizing channel is `E(ρ) = (1 − p)ρ + p/3 (XρX + YρY + ZρZ)`, applied after each gate on each of its qubits. After an X, the probability of |1> is 1 − 2p/3. It is exact up to 8 qubits.
- **Amplitude damping**: `{ amplitudeDamp: γ }` takes |1> to |0> with probability γ, as Cirq's `amplitude_damp` states. The noise options compose: `{ depolarize, amplitudeDamp }` applies both after each gate.
- **Expectation values**: `expectationOf(result, { 'line:0': 'Z', 'line:1': 'Z' })` returns Tr(ρO) for the Pauli string named by qubit. A Bell pair has ZZ and XX both equal to 1.
- **Devices**: `qubitSet` and `edges` are the device's qubits and couplers, as Cirq names them. `validateMoment` checks a moment as a whole, and `validateCircuit` checks every moment.
- **Quantum Virtual Machine**: `QuantumVirtualMachine` pairs a `Device` with noise options. A circuit runs only if it fits the device, and it runs with the machine's noise.

The Cirq page also states facts this repository does not reproduce: Cirq's simulators use float32 by default, where this simulator uses float64. qsim is recommended for deep circuits up to 30 qubits, and the QVM's Willow noise data is public but is not in this repository, so the QVM here takes its noise as options.

The wave-function part of qsim is covered by the state-vector simulator. qsim itself is a separate library, and this repository does not implement it.

## Checked against Cirq's source

The noise channel definitions and the insert strategies are checked against Cirq's own source on GitHub (`cirq-core/cirq/ops/common_channels.py` and `cirq-core/cirq/circuits/insert_strategy.py`). The Kraus operators for amplitude damping, phase damping, generalized amplitude damping and reset agree with Cirq's, and so do the mixture weights of bit flip, phase flip, depolarize and asymmetric depolarize. The four insert strategies follow Cirq's docstrings, including EARLIEST's first-moment fall-back.

## Willow's noise

The Quantum Virtual Machine's Willow noise is completed from the spec sheet's medians. A single-qubit gate takes a depolarizing channel with p = 1.5 × its single-qubit gate error, which gives an average error equal to the sheet's figure. After a two-qubit gate, each qubit takes a depolarizing channel with p = 0.75 × the two-qubit gate error, matching it to first order. Google's per-qubit calibration, T1 and readout are not on any public page, so they are not applied.
