---
title: Cirq
order: 20
---

# Cirq

Cirq is Google Quantum AI's Python library for writing, manipulating and optimizing quantum circuits. This page covers the layer `src/quantum/cirq.ts` implements.

- **Qubits**: `LineQubit`, `GridQubit` and `NamedQubit`.
- **Gates**: `X`, `Y`, `Z`, `H`, `CZ`, `CNOT`, `SWAP`. A gate takes a power, so `X**0.5` is the square root of NOT, as Cirq's documentation shows. `adjointOf` gives the inverse of any gate.
- **Operations and moments**: `applied(gate, ...qubits)` and `measure(qubits, key)`. Appended operations slide to the earliest moment after their last conflict.
- **Simulator**: `simulate` returns the amplitudes, and `run(circuit, repetitions)` samples bitstrings by measurement key.

The simulator is exact for the sizes Cirq documents, about 20 qubits.
