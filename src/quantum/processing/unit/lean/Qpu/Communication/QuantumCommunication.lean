import Qpu.Physics.QuantumEntanglement

/-! # Qpu.Communication.QuantumCommunication
---
component: quantum communication, superdense coding and teleportation (ISO/IEC 4879:2024 3.6.1)
---
Teleportation on three qubits, exact over the Gaussian integers with the measurements deferred (the corrections applied as the
controlled gates they condition): qubits 1 and 2 are made a Bell pair, qubit 0 is entangled with qubit 1 by CNOT and turned by
Hadamard, then qubit 1 corrects qubit 2 by X and qubit 0 corrects it by Z. For each basis input `b` on qubit 0, every outcome of
qubits 0 and 1 leaves qubit 2 holding `b` with the same weight; the circuit is linear, so every input state is carried across.
No signalling: before the corrections arrive, qubit 2 alone is in the same state for every input, its reduced density diagonal
with equal weights, so nothing of the input crosses until the two classical bits do; this holds on the six Pauli eigenstates,
a set whose states determine any input. Superdense coding runs the exchange the other way: Alice writes two classical bits on
her half of a Bell pair with I, X, Z or ZX, and Bob's CNOT then Hadamard returns exactly those two bits. Together they are two
coins making a coil, named precisely: over one shared Bell pair, one qubit carries two classical bits and two carry one qubit. -/

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

/-- the Pauli that writes the two classical bits `m` on qubit 0: I, X, Z, ZX -/
def encode : Nat → Mat | 0 => idm | 1 => X | 2 => Z | _ => mm 2 Z X

/-- superdense coding: Alice turns her half of the Bell pair by `encode m`, Bob decodes the pair by CNOT then Hadamard -/
def superdense (m : Nat) : Vec := ap 4 (kron 2 H idm) (ap 4 CNOT (ap 4 (kron 2 (encode m) idm) bell))

/-- each of the four messages decodes to exactly its own basis state: one qubit carries two classical bits -/
theorem superdense_exact : ∀ m, m < 4 → ∀ r, r < 4 → (superdense m r ≠ 0 ↔ r = m) := by decide +kernel

/-- two coins make a coil: one qubit carries two classical bits, and two classical bits carry one qubit -/
def TwoCoins : Prop := (∀ m, m < 4 → ∀ r, r < 4 → (superdense m r ≠ 0 ↔ r = m)) ∧
  ∀ b, b < 2 → ∀ r, r < 8 → teleport b r = if r % 2 = b then 1 else 0

/-- over one shared Bell pair, superdense coding and teleportation exchange one qubit for two classical bits both ways -/
theorem two_coins_one_qubit : TwoCoins := ⟨superdense_exact, teleport_exact⟩

end QuantumCommunication
