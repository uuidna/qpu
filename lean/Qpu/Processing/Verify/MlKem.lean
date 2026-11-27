import Mathlib.Probability.ProbabilityMassFunction.Monad
import Mathlib.Data.ZMod.Defs
import Mathlib.Data.Real.Basic

/-! # Qpu.Verify.MlKem
The confidentiality of ML-KEM-768 (FIPS 203) as a reduction to Module-LWE with k = 3, n = 256, q = 3329.

SCOPE OF PROOF. This module is the first slice of that reduction. Games are Mathlib's probability mass functions
(`PMF Bool`, the probability monad); an advantage is the distance of the probability that a game outputs `true`.
The Module-LWE samples are pairs `(A, t)` of a 3 × 3 matrix and a 3-vector of polynomials of 256 coefficients in
`ZMod 3329`. Module-LWE hardness is an explicit hypothesis of the theorems below, never an axiom. The step through
the Fujisaki-Okamoto transform with implicit rejection is still a hypothesis (`hfo`, with its bound `eps`): its proof
in the random oracle model, and a model of ML-KEM's key generation, encapsulation and decapsulation, are what remains. -/

namespace Qpu.Verify.MlKem

/-- Game hopping: the advantage between the first and the last of three games is at most the sum of the advantages
of the two hops, by Mathlib's `abs_sub_le` on the probabilities that the games output `true`, with the reals ordered
by `Real.instIsOrderedAddMonoid`. -/
theorem game_hop (G₀ G₁ G₂ : PMF Bool) :
    |(G₀ true).toReal - (G₂ true).toReal| ≤
      |(G₀ true).toReal - (G₁ true).toReal| + |(G₁ true).toReal - (G₂ true).toReal| :=
  abs_sub_le _ _ _

/-- The reduction from IND-CCA2 of ML-KEM-768 to Module-LWE (k = 3, n = 256, q = 3329): for every adversary `A`
against IND-CCA2 there is a distinguisher against Module-LWE, the one `B A` the reduction builds, whose advantage
bounds the advantage of `A` together with the bound `eps A` of the Fujisaki-Okamoto hop with implicit rejection.
`cca A` is the IND-CCA2 game, `hyb A` the game after the FO hop, `real` and `rand` the Module-LWE sample distributions;
`hreal` says the hybrid is the real Module-LWE game run by `B A`, `hrand` that with uniform samples the challenge bit
is hidden. Proved with Mathlib's `abs_sub_le`, `le_trans`, `add_le_add` and `Eq.le`, the order of the reals
`Real.instIsOrderedAddMonoid`, `IsOrderedAddMonoid.toAddLeftMono` and `covariant_swap_add_of_covariant_add`, and the
numerals `Nat.instAtLeastTwoHAddOfNat` and `Nat.instNeZeroSucc`. -/
theorem ind_cca2_reduces_to_mlwe {Adv : Type*}
    (cca hyb : Adv → PMF Bool) (eps : Adv → ℝ)
    (real rand : PMF ((Fin 3 → Fin 3 → Fin 256 → ZMod 3329) × (Fin 3 → Fin 256 → ZMod 3329)))
    (B : Adv → (Fin 3 → Fin 3 → Fin 256 → ZMod 3329) × (Fin 3 → Fin 256 → ZMod 3329) → PMF Bool)
    (hfo : ∀ A, |(cca A true).toReal - (hyb A true).toReal| ≤ eps A)
    (hreal : ∀ A, hyb A = real.bind (B A))
    (hrand : ∀ A, ((rand.bind (B A)) true).toReal = 1 / 2) :
    ∀ A, ∃ D : (Fin 3 → Fin 3 → Fin 256 → ZMod 3329) × (Fin 3 → Fin 256 → ZMod 3329) → PMF Bool,
      |(cca A true).toReal - 1 / 2| ≤
        eps A + |((real.bind D) true).toReal - ((rand.bind D) true).toReal| := fun A =>
  ⟨B A, by
    have h2 : |(hyb A true).toReal - 1 / 2| =
        |((real.bind (B A)) true).toReal - ((rand.bind (B A)) true).toReal| := by rw [hreal A, hrand A]
    exact le_trans (abs_sub_le (cca A true).toReal (hyb A true).toReal (1 / 2))
      (add_le_add (hfo A) h2.le)⟩

/-- IND-CCA2 security of ML-KEM-768 from Module-LWE hardness as an explicit hypothesis `hmlwe`: when no distinguisher
has Module-LWE advantage above `δ`, no adversary has IND-CCA2 advantage above `eps A + δ`. Composed from
`Qpu.Verify.MlKem.ind_cca2_reduces_to_mlwe` with Mathlib's `le_trans`, `add_le_add` and `le_refl`, the order of the
reals `Real.instIsOrderedAddMonoid`, `IsOrderedAddMonoid.toAddLeftMono` and `covariant_swap_add_of_covariant_add`, and
the numerals `Nat.instAtLeastTwoHAddOfNat` and `Nat.instNeZeroSucc`. -/
theorem ind_cca2_of_mlwe {Adv : Type*}
    (cca hyb : Adv → PMF Bool) (eps : Adv → ℝ) (δ : ℝ)
    (real rand : PMF ((Fin 3 → Fin 3 → Fin 256 → ZMod 3329) × (Fin 3 → Fin 256 → ZMod 3329)))
    (B : Adv → (Fin 3 → Fin 3 → Fin 256 → ZMod 3329) × (Fin 3 → Fin 256 → ZMod 3329) → PMF Bool)
    (hfo : ∀ A, |(cca A true).toReal - (hyb A true).toReal| ≤ eps A)
    (hreal : ∀ A, hyb A = real.bind (B A))
    (hrand : ∀ A, ((rand.bind (B A)) true).toReal = 1 / 2)
    (hmlwe : ∀ D : (Fin 3 → Fin 3 → Fin 256 → ZMod 3329) × (Fin 3 → Fin 256 → ZMod 3329) → PMF Bool,
      |((real.bind D) true).toReal - ((rand.bind D) true).toReal| ≤ δ) :
    ∀ A, |(cca A true).toReal - 1 / 2| ≤ eps A + δ := fun A =>
  match ind_cca2_reduces_to_mlwe cca hyb eps real rand B hfo hreal hrand A with
  | ⟨D, h⟩ => le_trans h (add_le_add (le_refl _) (hmlwe D))

end Qpu.Verify.MlKem
