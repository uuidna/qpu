import Qpu.Lattice
import Qpu.Communication.QuantumCommunication

/-! # Qpu.Coil
Two coins make a coil, named precisely: over one shared Bell pair, one qubit carries two classical bits and two classical bits
carry one qubit (`QuantumCommunication.two_coins_one_qubit`). The rest is the lattice counting: the coil's 2 × 7 = 14 faces, one
plus six, clay and fusion. -/

def theory : Nat := seed
def practice : Nat := seed
def coil : Nat := coins * rays
theorem follow_the_coins (app : Nat) : app + coins = app + theory + practice := by rw [theory, practice, coins, ← Nat.add_assoc]
theorem coil_is_faces : coil = faces := by rw [coil, around]
theorem two_coins_make_a_coil : QuantumCommunication.TwoCoins := QuantumCommunication.two_coins_one_qubit
theorem coil_efficiency : coil = faces ∧ faces = rays + rays ∧ coins * rays = faces := ⟨coil_is_faces, harmonic, around⟩
theorem next_coil : coil * mint (bits + coins) = fused + fused := by rw [coil_is_faces]; exact next_fused
theorem one_plus_six : seed + (mint n - coins) = rays := by rw [rays, n_eq, coins_two, seed_eq]; rw [show mint 3 = 8 from rfl]
theorem two_x_seven_coins : coins * rays = (seed + (mint n - coins)) * coins := by rw [one_plus_six, Nat.mul_comm]
theorem clay : coins * rays = (seed + (mint n - coins)) * coins ∧ (seed + (mint n - coins)) * coins = coil := ⟨two_x_seven_coins, by rw [← two_x_seven_coins]; rfl⟩
theorem fusion : fused = faces * mint (bits + seed) ∧ faces = rays + rays := ⟨quantum, harmonic⟩
