import Mathlib.Probability.ProbabilityMassFunction.Constructions
import Mathlib.Probability.Distributions.Uniform
import Mathlib.Data.ZMod.Basic
import Mathlib.Data.Real.Basic

/-! # Qpu.Verify.MlKem
The confidentiality of ML-KEM-768 (FIPS 203) reduced to Module-LWE with k = 3, n = 256, q = 3329: IND-CPA of its
public-key encryption K-PKE, the step the Fujisaki-Okamoto transform starts from.

SCOPE OF PROOF. Games are Mathlib's probability mass functions (`PMF`, the probability monad); an advantage is the
distance between the probabilities that two games output `true`. Every game is written out in the statement that
bounds it, from the scheme's own parts and the adversary's two steps, so no hypothesis stands in for a game or for a
step of the reduction:

* the key problem: real samples `(A, A s + e)`, random samples `(A, t)` with `t` uniform;
* the IND-CPA game: the key `(A, t)` drawn as a real sample, coins `r` and noise `(e₁, e₂)`, a hidden bit `b`, the
  adversary's two messages, the challenge `(Aᵀ r + e₁, tᵀ r + e₂ + encode m_b)`, and whether the guess is `b`;
* the encryption problem, whose matrix is the public key `(A, t)` drawn at random: real samples
  `((A, t), (Aᵀ r + e₁, tᵀ r + e₂))`, random samples `((A, t), c)` with `c` uniform;
* the two distinguishers the reduction builds from the adversary: on the key problem, the IND-CPA game run on the
  sample as the key; on the encryption problem, the challenge made by adding the chosen message to the sample.

`ind_cpa_reduces_to_mlwe` proves that the IND-CPA advantage over a coin flip is at most the sum of the two Module-LWE
advantages, for every product, every distribution of matrices, secrets and noise, and every adversary; Module-LWE
hardness is never an axiom (`ind_cpa_of_mlwe` takes it as a hypothesis). `ml_kem_768_ind_cpa_reduces_to_mlwe` is the
instance of FIPS 203 for ML-KEM-768: polynomials of 256 coefficients in `ZMod 3329` multiplied in
`ZMod 3329[X]/(X²⁵⁶ + 1)`, k = 3, the matrix uniform (the XOF expanding the seed ρ modelled as uniform), secrets and
noise centred binomial with η₁ = η₂ = 2, and the message bit encoded as 1665; the compression of the ciphertext, a
public function of it, is left to the adversary.

What remains for IND-CCA2 of ML-KEM-768 is not modelled here: the Fujisaki-Okamoto transform with implicit rejection
in the (quantum) random oracle model, which turns this IND-CPA bound into the IND-CCA2 bound of the KEM, and the
decryption failure bound it needs. -/

namespace Qpu.Verify.MlKem

open PMF

/-- A uniform distribution moved by a bijection is uniform. Proved with Mathlib's `PMF.ext`, `PMF.map_apply`,
`tsum_eq_single` with `SummationFilter.instLeAtTopUnconditional`, and `PMF.uniformOfFintype_apply`. -/
theorem uniform_shift {G : Type} [Fintype G] [Nonempty G] (f g : G → G)
    (hfg : ∀ x, f (g x) = x) (hgf : ∀ x, g (f x) = x) :
    (uniformOfFintype G).map f = uniformOfFintype G := by
  ext x
  rw [map_apply, tsum_eq_single (g x)]
  · simp [hfg]
  · intro y hy
    have : x ≠ f y := fun h => hy (by rw [h, hgf])
    simp [this]

/-- Comparing any bit with a uniform bit gives a uniform bit. Proved with `Qpu.Verify.MlKem.uniform_shift`. -/
theorem uniform_eq_bit (b' : Bool) :
    ((uniformOfFintype Bool).bind fun b => PMF.pure (b' == b)) = uniformOfFintype Bool := by
  have h : ((uniformOfFintype Bool).bind fun b => PMF.pure (b' == b)) = (uniformOfFintype Bool).map (b' == ·) := rfl
  rw [h]
  cases b'
  · exact uniform_shift _ (fun b => !b) (by decide) (by decide)
  · exact uniform_shift _ id (by decide) (by decide)

/-- The reduction from IND-CPA of K-PKE to Module-LWE: for every adversary `(choose, guess)`, the advantage of the
IND-CPA game `keyReal.bind cpa` over a coin flip is at most the advantage of the distinguisher `cpa` on the key
problem (`keyReal` against `keyRand`) plus the advantage of the distinguisher `encD` on the encryption problem
(`encReal` against `encRand`). The first hop: with a random key the IND-CPA game is `encReal.bind encD`. The second:
with random samples the uniform `c` shifted by the message is uniform, so `encD` outputs a uniform bit. Proved with
Mathlib's `PMF.bind_bind`, `PMF.pure_bind`, `PMF.bind_map`, `PMF.bind_comm`, `PMF.bind_const`,
`PMF.uniformOfFintype_apply`, `sub_add_cancel`, `add_sub_cancel_right`, `Prod.mk.eta`, `ENNReal.toReal_inv`,
`ENNReal.toReal_ofNat`, `one_div` and `abs_sub_le` in the reals ordered by `Real.instIsOrderedAddMonoid`, the numeral
`Nat.instAtLeastTwoHAddOfNat`, and `Qpu.Verify.MlKem.uniform_shift` and `Qpu.Verify.MlKem.uniform_eq_bit` from this
module. -/
theorem ind_cpa_reduces_to_mlwe {M S V U W Msg σ : Type} [AddCommGroup V] [Fintype V] [Nonempty V]
    [AddCommGroup U] [Fintype U] [Nonempty U] [AddCommGroup W] [Fintype W] [Nonempty W]
    (mul : M → S → V) (mat : PMF M) (secret : PMF S) (noise : PMF V)
    (dotT : M → V → S → U × W) (coins : PMF S) (noise₁₂ : PMF (U × W)) (encode : Msg → W)
    (choose : M × V → PMF (Msg × Msg × σ)) (guess : σ → U × W → PMF Bool) :
    let keyReal : PMF (M × V) :=
      mat.bind fun A => secret.bind fun s => noise.bind fun e => PMF.pure (A, mul A s + e)
    let keyRand : PMF (M × V) := mat.bind fun A => (uniformOfFintype V).bind fun t => PMF.pure (A, t)
    let cpa (pk : M × V) : PMF Bool :=
      coins.bind fun r => noise₁₂.bind fun e => (uniformOfFintype Bool).bind fun b => (choose pk).bind fun x =>
        (guess x.2.2 ((dotT pk.1 pk.2 r + e).1, (dotT pk.1 pk.2 r + e).2 + encode (if b then x.2.1 else x.1))).bind
          fun b' => PMF.pure (b' == b)
    let encReal : PMF ((M × V) × (U × W)) :=
      keyRand.bind fun pk => coins.bind fun r => noise₁₂.bind fun e => PMF.pure (pk, dotT pk.1 pk.2 r + e)
    let encRand : PMF ((M × V) × (U × W)) := keyRand.bind fun pk => (uniformOfFintype (U × W)).bind fun c => PMF.pure (pk, c)
    let encD (y : (M × V) × (U × W)) : PMF Bool :=
      (uniformOfFintype Bool).bind fun b => (choose y.1).bind fun x =>
        (guess x.2.2 (y.2.1, y.2.2 + encode (if b then x.2.1 else x.1))).bind fun b' => PMF.pure (b' == b)
    |((keyReal.bind cpa) true).toReal - 1 / 2| ≤
      |((keyReal.bind cpa) true).toReal - ((keyRand.bind cpa) true).toReal| +
        |((encReal.bind encD) true).toReal - ((encRand.bind encD) true).toReal| := by
  intro keyReal keyRand cpa encReal encRand encD
  have hop : keyRand.bind cpa = encReal.bind encD := by
    simp only [keyRand, cpa, encReal, encD, PMF.bind_bind, PMF.pure_bind]
  have shift : ∀ (m : Msg) (k : U × W → PMF Bool),
      ((uniformOfFintype (U × W)).bind fun c => k (c.1, c.2 + encode m)) = (uniformOfFintype (U × W)).bind k := by
    intro m k
    have := uniform_shift (G := U × W) (fun c => (c.1, c.2 + encode m)) (fun c => (c.1, c.2 - encode m))
      (fun c => by simp) (fun c => by simp)
    conv_rhs => rw [← this]
    rw [bind_map]
    rfl
  have step : ∀ (pk : M × V) (b : Bool),
      ((uniformOfFintype (U × W)).bind fun c => (choose pk).bind fun x =>
        (guess x.2.2 (c.1, c.2 + encode (if b then x.2.1 else x.1))).bind fun b' => PMF.pure (b' == b)) =
      (choose pk).bind fun x => (uniformOfFintype (U × W)).bind fun c =>
        (guess x.2.2 c).bind fun b' => PMF.pure (b' == b) := by
    intro pk b
    rw [bind_comm]
    congr 1
    funext x
    exact shift _ (fun c => (guess x.2.2 c).bind fun b' => PMF.pure (b' == b))
  have inner : ∀ pk : M × V,
      ((uniformOfFintype (U × W)).bind fun c => (uniformOfFintype Bool).bind fun b => (choose pk).bind fun x =>
        (guess x.2.2 (c.1, c.2 + encode (if b then x.2.1 else x.1))).bind fun b' => PMF.pure (b' == b)) =
      uniformOfFintype Bool := by
    intro pk
    rw [bind_comm]
    simp only [step]
    simp_rw [bind_comm (uniformOfFintype Bool)]
    simp_rw [uniform_eq_bit, bind_const]
  have hidden : encRand.bind encD = uniformOfFintype Bool := by
    simp only [encRand, keyRand, encD, PMF.bind_bind, PMF.pure_bind]
    simp only [inner, bind_const]
  have half : ((encRand.bind encD) true).toReal = 1 / 2 := by
    rw [hidden, uniformOfFintype_apply]
    simp
  rw [← half, ← hop]
  exact abs_sub_le _ _ _

/-- IND-CPA of K-PKE from Module-LWE hardness as an explicit hypothesis: when no distinguisher has advantage above
`δ₁` on the key problem nor above `δ₂` on the encryption problem, no adversary has IND-CPA advantage above `δ₁ + δ₂`.
Composed from `Qpu.Verify.MlKem.ind_cpa_reduces_to_mlwe` with Mathlib's `le_trans` and `add_le_add`, the order of the
reals `Real.instIsOrderedAddMonoid`, `IsOrderedAddMonoid.toAddLeftMono` and `covariant_swap_add_of_covariant_add`,
and the numeral `Nat.instAtLeastTwoHAddOfNat`. -/
theorem ind_cpa_of_mlwe {M S V U W Msg σ : Type} [AddCommGroup V] [Fintype V] [Nonempty V]
    [AddCommGroup U] [Fintype U] [Nonempty U] [AddCommGroup W] [Fintype W] [Nonempty W]
    (mul : M → S → V) (mat : PMF M) (secret : PMF S) (noise : PMF V)
    (dotT : M → V → S → U × W) (coins : PMF S) (noise₁₂ : PMF (U × W)) (encode : Msg → W)
    (choose : M × V → PMF (Msg × Msg × σ)) (guess : σ → U × W → PMF Bool) (δ₁ δ₂ : ℝ) :
    let keyReal : PMF (M × V) :=
      mat.bind fun A => secret.bind fun s => noise.bind fun e => PMF.pure (A, mul A s + e)
    let keyRand : PMF (M × V) := mat.bind fun A => (uniformOfFintype V).bind fun t => PMF.pure (A, t)
    let cpa (pk : M × V) : PMF Bool :=
      coins.bind fun r => noise₁₂.bind fun e => (uniformOfFintype Bool).bind fun b => (choose pk).bind fun x =>
        (guess x.2.2 ((dotT pk.1 pk.2 r + e).1, (dotT pk.1 pk.2 r + e).2 + encode (if b then x.2.1 else x.1))).bind
          fun b' => PMF.pure (b' == b)
    let encReal : PMF ((M × V) × (U × W)) :=
      keyRand.bind fun pk => coins.bind fun r => noise₁₂.bind fun e => PMF.pure (pk, dotT pk.1 pk.2 r + e)
    let encRand : PMF ((M × V) × (U × W)) := keyRand.bind fun pk => (uniformOfFintype (U × W)).bind fun c => PMF.pure (pk, c)
    (∀ D : M × V → PMF Bool, |((keyReal.bind D) true).toReal - ((keyRand.bind D) true).toReal| ≤ δ₁) →
    (∀ D : (M × V) × (U × W) → PMF Bool, |((encReal.bind D) true).toReal - ((encRand.bind D) true).toReal| ≤ δ₂) →
    |((keyReal.bind cpa) true).toReal - 1 / 2| ≤ δ₁ + δ₂ := by
  intro keyReal keyRand cpa encReal encRand h₁ h₂
  exact le_trans (ind_cpa_reduces_to_mlwe mul mat secret noise dotT coins noise₁₂ encode choose guess)
    (add_le_add (h₁ cpa) (h₂ _))

/-- IND-CPA of ML-KEM-768's K-PKE (FIPS 203) reduced to Module-LWE with k = 3, n = 256, q = 3329: with the product of
`ZMod 3329[X]/(X²⁵⁶ + 1)` (`mulRq`, `X²⁵⁶ = -1`), the uniform 3 × 3 matrix, the centred binomial secrets and noise
with η₁ = η₂ = 2 and the message encoded as 1665, every adversary's IND-CPA advantage is at most the advantage of the
distinguisher built from it on Module-LWE with the 3 × 3 matrix `A` plus that of the one built from it on Module-LWE
with the 4 × 3 matrix `(A, t)`. The instance of `Qpu.Verify.MlKem.ind_cpa_reduces_to_mlwe`, with the numeral
`Nat.instAtLeastTwoHAddOfNat`. -/
theorem ml_kem_768_ind_cpa_reduces_to_mlwe {σ : Type}
    (choose : (Fin 3 → Fin 3 → Fin 256 → ZMod 3329) × (Fin 3 → Fin 256 → ZMod 3329) →
      PMF ((Fin 256 → Bool) × (Fin 256 → Bool) × σ))
    (guess : σ → (Fin 3 → Fin 256 → ZMod 3329) × (Fin 256 → ZMod 3329) → PMF Bool) :
    let mulRq (a b : Fin 256 → ZMod 3329) : Fin 256 → ZMod 3329 := fun k =>
      ∑ i : Fin 256, ∑ j : Fin 256,
        if i.val + j.val = k.val then a i * b j else if i.val + j.val = k.val + 256 then -(a i * b j) else 0
    let cbd (x : Fin 2 → Bool × Bool) : ZMod 3329 := ∑ j, (((x j).1.toNat : ZMod 3329) - (x j).2.toNat)
    let eta : PMF (Fin 3 → Fin 256 → ZMod 3329) :=
      (uniformOfFintype (Fin 3 → Fin 256 → Fin 2 → Bool × Bool)).map fun x i c => cbd (x i c)
    let mul (A : Fin 3 → Fin 3 → Fin 256 → ZMod 3329) (s : Fin 3 → Fin 256 → ZMod 3329) : Fin 3 → Fin 256 → ZMod 3329 :=
      fun i => ∑ j, mulRq (A i j) (s j)
    let mat : PMF (Fin 3 → Fin 3 → Fin 256 → ZMod 3329) := uniformOfFintype _
    let secret := eta
    let noise := eta
    let dotT (A : Fin 3 → Fin 3 → Fin 256 → ZMod 3329) (t r : Fin 3 → Fin 256 → ZMod 3329) :
        (Fin 3 → Fin 256 → ZMod 3329) × (Fin 256 → ZMod 3329) :=
      (fun j => ∑ i, mulRq (A i j) (r i), ∑ i, mulRq (t i) (r i))
    let coins := eta
    let noise₁₂ : PMF ((Fin 3 → Fin 256 → ZMod 3329) × (Fin 256 → ZMod 3329)) :=
      (uniformOfFintype ((Fin 3 → Fin 256 → Fin 2 → Bool × Bool) × (Fin 256 → Fin 2 → Bool × Bool))).map
        fun x => (fun i c => cbd (x.1 i c), fun c => cbd (x.2 c))
    let encode (m : Fin 256 → Bool) : Fin 256 → ZMod 3329 := fun c => if m c then 1665 else 0
    let keyReal : PMF ((Fin 3 → Fin 3 → Fin 256 → ZMod 3329) × (Fin 3 → Fin 256 → ZMod 3329)) :=
      mat.bind fun A => secret.bind fun s => noise.bind fun e => PMF.pure (A, mul A s + e)
    let keyRand : PMF ((Fin 3 → Fin 3 → Fin 256 → ZMod 3329) × (Fin 3 → Fin 256 → ZMod 3329)) := mat.bind fun A => (uniformOfFintype (Fin 3 → Fin 256 → ZMod 3329)).bind fun t => PMF.pure (A, t)
    let cpa (pk : (Fin 3 → Fin 3 → Fin 256 → ZMod 3329) × (Fin 3 → Fin 256 → ZMod 3329)) : PMF Bool :=
      coins.bind fun r => noise₁₂.bind fun e => (uniformOfFintype Bool).bind fun b => (choose pk).bind fun x =>
        (guess x.2.2 ((dotT pk.1 pk.2 r + e).1, (dotT pk.1 pk.2 r + e).2 + encode (if b then x.2.1 else x.1))).bind
          fun b' => PMF.pure (b' == b)
    let encReal : PMF (((Fin 3 → Fin 3 → Fin 256 → ZMod 3329) × (Fin 3 → Fin 256 → ZMod 3329)) × ((Fin 3 → Fin 256 → ZMod 3329) × (Fin 256 → ZMod 3329))) :=
      keyRand.bind fun pk => coins.bind fun r => noise₁₂.bind fun e => PMF.pure (pk, dotT pk.1 pk.2 r + e)
    let encRand : PMF (((Fin 3 → Fin 3 → Fin 256 → ZMod 3329) × (Fin 3 → Fin 256 → ZMod 3329)) × ((Fin 3 → Fin 256 → ZMod 3329) × (Fin 256 → ZMod 3329))) := keyRand.bind fun pk => (uniformOfFintype ((Fin 3 → Fin 256 → ZMod 3329) × (Fin 256 → ZMod 3329))).bind fun c => PMF.pure (pk, c)
    let encD (y : ((Fin 3 → Fin 3 → Fin 256 → ZMod 3329) × (Fin 3 → Fin 256 → ZMod 3329)) × ((Fin 3 → Fin 256 → ZMod 3329) × (Fin 256 → ZMod 3329))) : PMF Bool :=
      (uniformOfFintype Bool).bind fun b => (choose y.1).bind fun x =>
        (guess x.2.2 (y.2.1, y.2.2 + encode (if b then x.2.1 else x.1))).bind fun b' => PMF.pure (b' == b)
    |((keyReal.bind cpa) true).toReal - 1 / 2| ≤
      |((keyReal.bind cpa) true).toReal - ((keyRand.bind cpa) true).toReal| +
        |((encReal.bind encD) true).toReal - ((encRand.bind encD) true).toReal| := by
  intro mulRq cbd eta mul mat secret noise dotT coins noise₁₂ encode
  exact ind_cpa_reduces_to_mlwe mul mat secret noise dotT coins noise₁₂ encode choose guess

end Qpu.Verify.MlKem
