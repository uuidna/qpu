import Qpu.Physics.QuantumEntanglement

/-! # Qpu.Communication.QuantumCommunication
---
component: quantum communication, teleportation (ISO/IEC 4879:2024 3.6.1)
---
Teleportation on three qubits, exact over the Gaussian integers with the measurements deferred (the corrections applied as the
controlled gates they condition): qubits 1 and 2 are made a Bell pair, qubit 0 is entangled with qubit 1 by CNOT and turned by
Hadamard, then qubit 1 corrects qubit 2 by X and qubit 0 corrects it by Z. For each basis input `b` on qubit 0, every outcome of
qubits 0 and 1 leaves qubit 2 holding `b` with the same weight; the circuit is linear, so every input state is carried across.
No signalling: before the corrections arrive, qubit 2 alone is in the same state for every input, its reduced density diagonal
with equal weights, so nothing of the input crosses until the two classical bits do; this holds on the six Pauli eigenstates,
a set whose states determine any input. -/

namespace QuantumCommunication
open HilbertSpace Operator QuantumGate QuantumEntanglement

/-- Z on qubit 2 controlled by qubit 0 -/
def cz02 : Mat := fun r c => if r = c then (if (r / 4) % 2 = 1 ∧ r % 2 = 1 then -1 else 1) else 0

/-- the state of qubits 0 and 1 entangled with the Bell pair and turned, before any correction, for the input `v` of qubit 0 -/
def sentFrom (v : Vec) : Vec :=
  let input : Vec := fun r => if r % 4 = 0 then v (r / 4) else 0
  let bellPair := ap 8 (kron 4 idm CNOT) (ap 8 (kron 4 idm (kron 2 H idm)) input)
  ap 8 (kron 4 H idm) (ap 8 (kron 2 CNOT idm) bellPair)

/-- the reduced density of qubit 2: entry (i, j) summed over the outcomes of qubits 0 and 1 -/
def reduced2 (v : Vec) (i j : Nat) : GI := sumTo 4 fun m => v (2 * m + i) * GI.conj (v (2 * m + j))

/-- the six Pauli eigenstates on one qubit, unnormalised: |0⟩, |1⟩, |0⟩ ± |1⟩, |0⟩ ± i|1⟩ -/
def pauliEigen (s : Nat) : Vec := fun r =>
  if r = 0 then (if s = 1 then 0 else 1) else if r = 1 then (match s with | 0 => 0 | 1 => 1 | 2 => 1 | 3 => -1 | 4 => GI.i | _ => -GI.i) else 0

/-- the teleportation circuit on the basis input `b` of qubit 0 -/
def teleport (b : Nat) : Vec :=
  let bellPair := ap 8 (kron 4 idm CNOT) (ap 8 (kron 4 idm (kron 2 H idm)) (basis (4 * b)))
  let sent := ap 8 (kron 4 H idm) (ap 8 (kron 2 CNOT idm) bellPair)
  ap 8 cz02 (ap 8 (kron 4 idm CNOT) sent)

/-- every outcome of qubits 0 and 1 leaves qubit 2 holding the input, with equal weight -/
theorem teleport_exact : ∀ b, b < 2 → ∀ r, r < 8 → teleport b r = if r % 2 = b then 1 else 0 := by decide +kernel

/-- no signalling: before the corrections, qubit 2 alone is in the same state for every Pauli eigenstate input, diagonal with equal weights -/
theorem teleport_no_signalling : ∀ s, s < 6 → reduced2 (sentFrom (pauliEigen s)) 0 1 = 0 ∧ reduced2 (sentFrom (pauliEigen s)) 1 0 = 0 ∧ reduced2 (sentFrom (pauliEigen s)) 0 0 = reduced2 (sentFrom (pauliEigen s)) 1 1 := by decide +kernel

end QuantumCommunication
