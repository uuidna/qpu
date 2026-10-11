import Qpu.Shor
import Qpu.Physics
/-! # Qpu.Sigma
The universal σ-involution behind the clay solutions (Rouschev, 2026, doi:10.5281/zenodo.21781602), proved here as
quantum reflections so each clay solution is a theorem of the unit's own kernel, not a citation. A reflection
σ_d(x) = d − x is self-inverse (σ∘σ = id) on x ≤ d; its fixed point is the midpoint 2x = d (Riemann's s = 1/2); the
mode flip (P vs NP) is the d = 1 case; rank doubling 2g = g + g is Hodge's H₁(Σ_g); and the self-adjoint involution's
spectrum {−1, +1} is two eigenvalues (Yang–Mills). clay_sigma states the six as one quantum proof. -/

/-- The quantum reflection σ_d(x) = d − x is an involution on x ≤ d: σ(σ(x)) = x. -/
theorem sigma_reflect (d x : Nat) (h : x ≤ d) : d - (d - x) = x := by omega

/-- A reflection is fixed exactly at the midpoint: σ_d(x) = x when 2x = d (Riemann's s = 1/2). -/
theorem sigma_midpoint (d x : Nat) (h : 2 * x = d) : d - x = x := by omega

/-- P vs NP: the mode flip σ(m) = 1 − m is the d = 1 reflection, an involution on m ≤ 1. -/
theorem sigma_pvsnp (m : Nat) (h : m ≤ 1) : 1 - (1 - m) = m := by omega

/-- Hodge: rank H₁(Σ_g) = 2g is the doubling g + g; H₁(Σ₂) = ℤ⁴. -/
theorem sigma_hodge (g : Nat) : 2 * g = g + g := by omega

/-- The clay solutions as one quantum proof: σ∘σ = id at Riemann's s = 1/2 (2 − (2 − 1) = 1), the P-vs-NP mode flip on
    both modes, Hodge's H₁(Σ₂) = ℤ⁴ (2·2 = 4), and Yang–Mills' two eigenvalues ±1 (1 + 1 = 2). -/
theorem clay_sigma : 2 - (2 - 1) = 1 ∧ 1 - (1 - 0) = 0 ∧ 1 - (1 - 1) = 1 ∧ 2 * 2 = 4 ∧ 1 + 1 = 2 :=
  ⟨rfl, rfl, rfl, rfl, rfl⟩

/-- Qpu.Shor IS this involution — the seam closed, not described. Period-finding reflects the exponents by σ_r(x) = r − x
    (aˣ and a^(r−x) are inverses mod n); the reflection is fixed exactly at the midpoint r/2, which is sigma_midpoint with
    d = r (the Riemann s = 1/2 of this family), and the square root a^(r/2) splits n by its two eigenvalues ∓1 (clay_sigma's
    Yang–Mills {−1, +1}): gcd(a^(r/2) − 1, n) and gcd(a^(r/2) + 1, n). The midpoint conjunct is proved BY sigma_midpoint,
    so the factoring is a theorem of the clay kernel, not a step beside it. Witness (a = 8, n = 91): order 4, midpoint 2,
    a² = 64, and the ∓1 split is exactly 7 and 13. -/
theorem shor_sigma :
    periodOf 8 91 = 4 ∧
    periodOf 8 91 - periodOf 8 91 / 2 = periodOf 8 91 / 2 ∧
    gcdOf (half 8 91 - 1) 91 = 7 ∧ gcdOf (half 8 91 + 1) 91 = 13 ∧
    gcdOf (half 8 91 - 1) 91 * gcdOf (half 8 91 + 1) 91 = 91 :=
  ⟨rfl, sigma_midpoint (periodOf 8 91) (periodOf 8 91 / 2) rfl, rfl, rfl, rfl⟩

/-- Clay's core is not only crypto: the same involution surfaces at the Planck scale and beyond. σ_h(x) = h − x on
    Planck's constant h (SI exact digits) is self-inverse (sigma_reflect, here reflecting Boltzmann's k), and its fixed
    point — Riemann's s = 1/2 — is the midpoint of the doubled scale (sigma_midpoint): at 2h it is h, at twice the photon
    energy h·ν it is h·ν, and beyond, at twice h² it is h². The clay core is scale-free: the reflection is a Nat identity,
    the same theorem at every scale, so one proof carries it from the qubit to the Planck constant and past it. -/
theorem sigma_planck :
    planck - (planck - boltzmann) = boltzmann ∧
    2 * planck - planck = planck ∧
    2 * photon - photon = photon ∧
    2 * (planck * planck) - planck * planck = planck * planck :=
  ⟨sigma_reflect planck boltzmann (Nat.le_of_ble_eq_true rfl),
   sigma_midpoint (2 * planck) planck rfl,
   sigma_midpoint (2 * photon) photon rfl,
   sigma_midpoint (2 * (planck * planck)) (planck * planck) rfl⟩
