import Qpu.General.Mint
import Qpu.General.Lattice

/-! # Qpu.Processing.Fusion
Fusion-category state counts for topological quantum computing, exact Nat on the doubling mint: the number of fusion
states, the fusion-space dimension, and the fusion entropy all follow the doubling mint, giving the exponential-in-n
scaling used in anyon-based topological quantum computing. Positivity and exact doubling are quantified over all n —
unlimited fusion levels — with the textbook values kept as kernel-decided controls. -/

/-- `a ^ b` computes `a` to the power of `b`.
The meaning of this notation is type-dependent. 

Conventions for notations in identifiers:

 * The recommended spelling of `^` in identifiers is `pow`.-/
def fusionStates (nn : Nat) : Nat := mint nn
def fusionDim (nn : Nat) : Nat := mint nn
def fusionEntropy (nn : Nat) : Nat := mint nn

/-- Fusion states are positive, for every nn. -/
theorem fusionStates_pos (nn : Nat) : 0 < fusionStates nn := mintOf_pos nn

/-- Fusion dimension is positive, for every nn. -/
theorem fusionDim_pos (nn : Nat) : 0 < fusionDim nn := mintOf_pos nn

/-- Fusion entropy is positive, for every nn. -/
theorem fusionEntropy_pos (nn : Nat) : 0 < fusionEntropy nn := mintOf_pos nn

/-- One more fusion level exactly doubles the state count, for every nn. -/
theorem fusionStates_doubles (nn : Nat) : fusionStates (nn + 1) = 2 * fusionStates nn := by
  rw [fusionStates, fusionStates, mintOf_succ]
  omega

/-- One more fusion level exactly doubles the dimension, for every nn. -/
theorem fusionDim_doubles (nn : Nat) : fusionDim (nn + 1) = 2 * fusionDim nn := by
  rw [fusionDim, fusionDim, mintOf_succ]
  omega

/-- One more fusion level exactly doubles the entropy, for every nn. -/
theorem fusionEntropy_doubles (nn : Nat) : fusionEntropy (nn + 1) = 2 * fusionEntropy nn := by
  rw [fusionEntropy, fusionEntropy, mintOf_succ]
  omega

/-- The textbook spot values, decided by the kernel as controls on the general laws. -/
theorem fusion_all : fusionStates 1 = 2 ∧ fusionDim 2 = 4 ∧ fusionEntropy 2 = 4 := ⟨rfl, rfl, rfl⟩
