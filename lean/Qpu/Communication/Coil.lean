import Qpu.General.Lattice
import Qpu.Communication.QuantumCommunication
import Qpu.Physics.PhysicalConstant

/-! # Qpu.Communication.Coil
---
component: flux-bias coil (IEC 60050-151 coil; Krantz et al. 2019, doi:10.1063/1.5089550)
---
Unified coil module (merging communication coil geometry and physical-qubit flux-bias coil):
1. Communication coil: over one shared Bell pair, one qubit carries two classical bits and two classical bits carry one qubit
   (`QuantumCommunication.two_coins_one_qubit`), with lattice faces `2 × 7 = 14`.
2. Flux-bias coil: a current `I` through the flux-bias line threads `Φ = M·I` through the qubit SQUID, read modulo one flux
   quantum `Φ₀ = h/2e` (`Coil.periodic`). -/

def theory : Nat := seed
def practice : Nat := seed
def coil : Nat := coins * rays
theorem follow_the_coins (app : Nat) : app + coins = app + theory + practice := by rw [theory, practice, coins, ← Nat.add_assoc]
theorem coil_is_faces : coil = faces := by rw [coil, around]
theorem coil_efficiency : coil = faces ∧ faces = rays + rays ∧ coins * rays = faces := ⟨coil_is_faces, faces_harmonic, around⟩
theorem next_coil : coil * mint (bits + coins) = fused + fused := by rw [coil_is_faces]; exact next_fused
theorem one_plus_six : seed + (mint n - coins) = rays := by rw [rays, n_eq, coins_two, seed_eq]; rw [show mint 3 = 8 from rfl]
theorem two_x_seven_coins : coins * rays = (seed + (mint n - coins)) * coins := by rw [one_plus_six, Nat.mul_comm]
theorem clay : coins * rays = (seed + (mint n - coins)) * coins ∧ (seed + (mint n - coins)) * coins = coil := ⟨two_x_seven_coins, by rw [← two_x_seven_coins]; rfl⟩
theorem fusion : fused = faces * mint (bits + seed) ∧ faces = rays + rays := ⟨quantum, faces_harmonic⟩

namespace Coil
open PhysicalConstant

/-- the flux the coil threads, in units where hNum·10¹⁰ is one flux quantum -/
def flux (M I : Nat) : Nat := M * I * 2 * eNum

/-- the qubit reads the flux modulo one flux quantum: a whole flux quantum added leaves it unchanged, for every M and every current -/
theorem periodic (M I k : Nat) : (flux M I + k * (hNum * 10 ^ 10)) % (hNum * 10 ^ 10) = flux M I % (hNum * 10 ^ 10) :=
  Nat.add_mul_mod_self_right _ _ _

end Coil
