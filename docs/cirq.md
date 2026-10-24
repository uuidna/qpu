---
title: Cirq
order: 20
---

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
- **Quantum Virtual Machine**: `QuantumVirtualMachine` pairs a `Device` with a depolarizing probability. A circuit runs only if it fits the device, and it runs with the machine's noise.

The wave-function part of qsim is covered by the state-vector simulator. qsim itself is a separate library, and this repository does not implement it.
