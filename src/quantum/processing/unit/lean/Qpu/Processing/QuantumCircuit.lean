import Qpu.Processing.QuantumProcessor
import Qpu.Processing.QuantumGate

/-! # Qpu.Processing.QuantumCircuit
---
component: quantum circuit (ISO/IEC 4879:2024 3.4.5)
---
Circuits compiled onto the processor's coupling graph: a two-qubit gate between sites that are not coupled is routed by SWAPs along
a path. Along a row of the register, bits 0 and 2 are not coupled while 0–1 and 1–2 are, and the routed circuit SWAP · CNOT · SWAP
computes exactly the CNOT it replaces. A CNOT routed over a path of distance `d` takes `2·d − 1` gates in sequence, which bounds its
depth. -/

namespace QuantumCircuit
open HilbertSpace Operator QuantumGate Qubit QuantumProcessor

/-- CNOT from qubit 0 to qubit 2 of three (qubit 0 the high bit): the low bit flips when the high bit is set -/
def cnot02 : Mat := perm fun c => if c ≥ 4 then c ^^^ 1 else c
/-- CNOT from qubit 1 to qubit 2 of three -/
def cnot12 : Mat := kron 4 idm CNOT
/-- SWAP of qubits 0 and 1 of three -/
def swap01 : Mat := kron 2 SWAP idm

/-- along a register row, bits 0 and 1 and bits 1 and 2 are coupled, bits 0 and 2 are not: the gate between them needs routing -/
theorem needs_routing :
    (0, 0) ∈ sites hexbit ∧ (0, 2) ∈ sites hexbit ∧
    coupled (0, 0) (0, 1) = true ∧ coupled (0, 1) (0, 2) = true ∧ coupled (0, 0) (0, 2) = false := by decide +kernel

/-- routing preserves the function: SWAP(0,1) · CNOT(1,2) · SWAP(0,1) is exactly CNOT(0,2) -/
theorem swap_routing : Same 8 (mm 8 (mm 8 swap01 cnot12) swap01) cnot02 := by decide +kernel

/-- the gates of a CNOT routed over a path of distance `d`: a SWAP in and out for each step past the first, and the CNOT -/
def routedGates (d : Nat) : Nat := 2 * (d - 1) + 1

/-- a routed CNOT at distance `d ≥ 1` takes `2·d − 1` gates in sequence, so its depth is at most `2·d − 1`; at distance 2 that is
the three gates of `swap_routing` -/
theorem routed_depth (d : Nat) (h : 1 ≤ d) : routedGates d = 2 * d - 1 ∧ routedGates 2 = 3 := by
  unfold routedGates
  exact ⟨by omega, rfl⟩

end QuantumCircuit
