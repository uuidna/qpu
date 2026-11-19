# Circuits

The Cirq layer. Qubits, gates, moments, and the two simulators are [`cirq.ts`](processing/cirq.ts). The detailed specification is [`README.md`](README.md). The import is [`API.md`](API.md). The `circuit` tool is one of the thirteen `google` tools in [`TOOLBOXES.md`](TOOLBOXES.md).

A qubit is a line (`line:x`), a grid site (`grid:row,col`), or a named qubit (`named:name`). `qubitKey` is that text. `LineQubit.range(n)` is line 0 through n − 1. `GridQubit.square(n)` is an n by n grid.

A gate is a name, an arity, a row-major unitary of pairs `[re, im]`, and a sealed UUID of those three. `defineGate` refuses a matrix whose address does not seal. `applied` refuses a qubit count other than the arity, and it seals the gate together with the qubit keys. A gate runs only when that address still matches.

| Gate | Arity | What it is |
|---|---:|---|
| `X`, `Y`, `Z`, `H` | 1 | The Pauli gates and Hadamard. Each squares to the identity. |
| `S` | 1 | diag(1, i). `S` squared is `Z`. |
| `T` | 1 | diag(1, e^{iπ/4}). `T` squared is `S`. |
| `CZ`, `CNOT`, `SWAP`, `ZZ` | 2 | The first qubit is the control, except `SWAP` and `ZZ`, which treat the pair. |
| `TOFFOLI` | 3 | Flips the third qubit when the first two are both 1. |
| `PhasedXZ` | 1 | `phasedXZGate(x, z, axis)`. The circuit in time order is Z^{−a}, X^x, Z^{a+z}. The matrix is the one Cirq publishes, including the global phase of X^x. The call passes `x`, `z`, and `axis`. Omit any of them and the operation does not run. `phasedXZOf` reads one qubit back as one PhasedXZ, up to a global phase. |

`raiseGate` is G^t for every gate. An involution keeps the ±1 spectral formula, so X**0.5 is the square root of NOT. A diagonal gate raises each eigenvalue on the principal branch, so S**0.5 is T, T**2 is S, and S**2 is Z. Any other matrix uses its Schur form. `exponentiateGate` is exp(−iθG) for every gate. An involution keeps cos θ·I − i sin θ·G, the rotation in the H₂ ansatz. Any other matrix uses the same functional calculus. `pauliProduct` tensors `X`, `Y`, `Z`, and `I` into one involution. `adjointGate` is the conjugate transpose.

An operation is a gate, a measurement (`measure`, tagged by a key), or a channel (`noisy`). A moment holds operations on disjoint qubits. A circuit places operations by an insert strategy. The default is `EARLIEST`. `NEW` gives the operation its own moment. `INLINE` uses the last moment when the qubits are free. `NEW_THEN_INLINE` starts a new moment and then inserts inline.

A `Device` is a set of qubits and a set of couplers. `validateCircuit` requires every qubit to be on the device. A two-qubit gate must sit on a coupler. The devices the `circuit` tool accepts are Willow, Sycamore, and Sycamore23, listed in [`PROCESSORS.md`](PROCESSORS.md).

`Simulator.simulate` returns the state vector. Below 24 qubits the vector is one amplitude per basis state, starting from \|0…0⟩. At 24 qubits and above the vector is the occupied amplitudes and their basis indices. `run` needs a measurement. The gates before the first measurement run once, and each repetition copies that state. `seededRandom` draws the same samples from the same seed. A channel on a state vector is refused.

`DensityMatrixSimulator` keeps a density matrix while the register is at most 12 qubits. A wider pure circuit uses the state vector and reports purity 1. A wider noisy circuit keeps the occupied amplitudes and one Kraus branch per channel. A placed channel acts where it sits. A list of channels, or a function of arity, follows every gate. Trace and purity are read from that matrix. `getExpectation` is Tr(ρ O) for a Pauli string named by qubit key.

The channels are `bit_flip`, `phase_flip`, `depolarize`, `asymmetric_depolarize`, `amplitude_damp`, `phase_damp`, `generalized_amplitude_damp`, and `reset`. A probability outside [0, 1] is refused. The three asymmetric probabilities may not sum above 1.

`QuantumVirtualMachine` validates the circuit on its device, then runs the density-matrix simulator with the noise it was given.
