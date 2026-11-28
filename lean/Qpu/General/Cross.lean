import Qpu.General.Lattice
import Qpu.Communication.Coil

/-! # Qpu.General.Cross
Cross forms: every quantity stated as a sum of like terms and as a product of unlike ones, and the bridges between. -/

/-- ASYMMETRIC ↔ SYMMETRIC BRIDGES: coins=2 enables transformation between product and sum forms. -/
theorem double_is_sum : ∀ x : Nat, x + x = 2 * x := fun x => (Nat.two_mul x).symm
theorem coins_bridges_forms : coins = 2 ∧ (∀ x : Nat, coins * x = x + x) :=
  ⟨coins_two, fun x => by rw [coins_two, Nat.two_mul]⟩
/-- COMPLETE CUBIC PROOF: bits as product and as nested exponential (via mint). -/
theorem bits_exponential : bits = mint (n + coins) := by rw [bits, coins_two, n_eq]
theorem bits_both_forms : bits = vertices * hexbit ∧ bits = mint (n + coins) := ⟨cube, by rw [bits, coins_two, n_eq]⟩
/-- AMPLITUDE ASYMMETRY: asymmetric and symmetric forms of amplitude constraint. -/
theorem amplitudes_from_sum : 2 * amplitudes = mint (bits + seed) := by rw [Nat.two_mul, next]
/-- FUSED COMPLETENESS: quantum defines multiplicatively; can be distributed additively. -/
theorem fused_additive_form : fused + fused = faces * mint (bits + coins) := next_fused
theorem fused_both_directions : (fused = faces * mint (bits + seed)) ∧ (fused + fused = faces * mint (bits + coins)) :=
  ⟨quantum, next_fused⟩
theorem all_complete : 
  faces = coins * rays ∧ faces = rays + rays ∧ 
  coil = faces ∧ amplitudes = mint bits ∧ 
  fused = faces * mint (bits + seed) := 
  ⟨around, faces_harmonic, coil_is_faces, rfl, quantum⟩
