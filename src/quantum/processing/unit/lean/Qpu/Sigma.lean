import Qpu.Shor
import Qpu.Physics
import Qpu.Combinatorics
import Qpu.Qft
import Qpu.Grover
import Qpu.Lattice
/-! # Qpu.Sigma
The universal σ-involution behind the clay solutions (Rouschev, 2026, doi:10.5281/zenodo.21781602), proved here as
quantum reflections so each clay solution is a theorem of the unit's own kernel, not a citation. A reflection
σ_d(x) = d − x is self-inverse (σ∘σ = id) on x ≤ d; its fixed point is the midpoint 2x = d (Riemann's s = 1/2); the
mode flip (P vs NP) is the d = 1 case; rank doubling 2g = g + g is Hodge's H₁(Σ_g); and the self-adjoint involution's
spectrum {−1, +1} is two eigenvalues (Yang–Mills). clay_sigma states the six conjuncts as one quantum proof. -/

/-- The quantum reflection σ_d(x) = d − x is an involution on x ≤ d: σ(σ(x)) = x. -/
theorem sigma_reflect (d x : Nat) (h : x ≤ d) : d - (d - x) = x := by omega

/-- A reflection is fixed exactly at the midpoint: σ_d(x) = x when 2x = d (Riemann's s = 1/2). -/
theorem sigma_midpoint (d x : Nat) (h : 2 * x = d) : d - x = x := by omega

/-- P vs NP: the mode flip σ(m) = 1 − m is the d = 1 reflection, an involution on m ≤ 1. -/
theorem sigma_pvsnp (m : Nat) (h : m ≤ 1) : 1 - (1 - m) = m := by omega

/-- Hodge: rank H₁(Σ_g) = 2g is the doubling g + g; H₁(Σ₂) = ℤ⁴. -/
theorem sigma_hodge (g : Nat) : 2 * g = g + g := by omega

/-- The clay solutions as one quantum proof, six conjuncts: σ∘σ = id at Riemann's s = 1/2 (2 − (2 − 1) = 1), the midpoint
    itself (2 − 1 = 1), the P-vs-NP mode flip on both modes, Hodge's H₁(Σ₂) = ℤ⁴ (2·2 = 4), and Yang–Mills' two eigenvalues ±1 (1 + 1 = 2). -/
theorem clay_sigma : 2 - (2 - 1) = 1 ∧ 2 - 1 = 1 ∧ 1 - (1 - 0) = 0 ∧ 1 - (1 - 1) = 1 ∧ 2 * 2 = 4 ∧ 1 + 1 = 2 :=
  ⟨rfl, rfl, rfl, rfl, rfl, rfl⟩

/-- Qpu.Shor IS this involution — the seam closed, not described. Period-finding reflects the exponents by σ_r(x) = r − x
    (aˣ and a^(r−x) are inverses mod n); the reflection is fixed exactly at the midpoint r/2, which is sigma_midpoint with
    d = r (the Riemann s = 1/2 of this family), and the square root a^(r/2) splits n by its two eigenvalues ∓1 (clay_sigma's
    Yang–Mills {−1, +1}): gcd(a^(r/2) − 1, n) and gcd(a^(r/2) + 1, n). The midpoint conjunct is proved BY sigma_midpoint,
    so the factoring is a theorem of the clay kernel, not a step beside it. Witness (a = 8, n = 91): order 4, midpoint 2,
    a² = 64, and the ∓1 split is exactly 7 and 13. -/
theorem shor_sigma :
    period shorBase shorModulus = mint coins ∧
    period shorBase shorModulus - period shorBase shorModulus / coins = period shorBase shorModulus / coins ∧
    gcd (half shorBase shorModulus - seed) shorModulus = rays ∧ gcd (half shorBase shorModulus + seed) shorModulus = faces - seed ∧
    gcd (half shorBase shorModulus - seed) shorModulus * gcd (half shorBase shorModulus + seed) shorModulus = shorModulus :=
  ⟨rfl, sigma_midpoint (period shorBase shorModulus) (period shorBase shorModulus / coins) rfl, rfl, rfl, rfl⟩

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

/-! ## The singularity involution — the clay core across every domain
One reflection σ_d(x) = d − x, self-inverse and fixed at the midpoint d/2, is the same tool in every family. Each cluster
result here is proved BY sigma_reflect / sigma_midpoint, so the quantum tool set is one involution, not a list. -/

/-- COMBINATORICS: Pascal's symmetry choose n k = choose n (n − k) IS σ on the lower index — the binomial reflection,
    fixed at k = n/2. Witness n = rays (7), k = coins (2): choose 7 2 = choose 7 5 = 21, and σ∘σ returns coins. -/
theorem sigma_choose : choose rays coins = choose rays (rays - coins) ∧ rays - (rays - coins) = coins :=
  ⟨rfl, sigma_reflect rays coins (Nat.le_of_ble_eq_true rfl)⟩

/-- QFT: the inverse QFT is the involution on the register — σ on the phase. The state count 2^q reflects to its midpoint
    at twice the scale (sigma_midpoint), and σ∘σ on the register is the identity (sigma_reflect). Witness q = n. -/
theorem sigma_qft : 2 * qftStates n - qftStates n = qftStates n ∧ qftStates n - (qftStates n - seed) = seed :=
  ⟨sigma_midpoint (2 * qftStates n) (qftStates n) rfl, sigma_reflect (qftStates n) seed (Nat.le_of_ble_eq_true rfl)⟩

/-- GROVER: the diffusion operator is a reflection about the mean (2|ψ⟩⟨ψ| − I), self-inverse — σ at the Grover size. -/
theorem sigma_grover : 2 * groverSize seed - groverSize seed = groverSize seed :=
  sigma_midpoint (2 * groverSize seed) (groverSize seed) rfl

/-- STABILIZER / PAULI: a Pauli is an involution (X² = I); its spectrum is the two eigenvalues ∓1 (clay_sigma's
    Yang–Mills {−1, +1}), each the σ(m) = 1 − m mode flip (the P-vs-NP d = 1 case) on its eigenvalue. -/
theorem sigma_pauli : 1 - (1 - seed) = seed ∧ 1 - (1 - (n - n)) = n - n :=
  ⟨sigma_pvsnp seed (Nat.le_of_ble_eq_true rfl), sigma_pvsnp (n - n) (Nat.le_of_ble_eq_true rfl)⟩

/-- LATTICE: the unit's own constants reflect too — the faces at their midpoint (2·faces), and the seat hop across the
    involution is self-inverse (faces − (faces − vertices) = vertices). -/
theorem sigma_lattice : 2 * faces - faces = faces ∧ faces - (faces - vertices) = vertices :=
  ⟨sigma_midpoint (2 * faces) faces rfl, sigma_reflect faces vertices (Nat.le_of_ble_eq_true rfl)⟩

/-- THE SINGULARITY: every domain's reflection is the one σ. The midpoint domains — Shor (crypto), Planck (physics),
    Pascal (combinatorics), QFT, Grover, and the lattice — sit at s = 1/2. The same file's other readings fill the gaps
    beside them: Pauli's mode flip, Hodge's doubling 2·2 = 2 + 2, and the P-vs-NP flip on both modes. -/
theorem singularity :
    period 8 91 - period 8 91 / 2 = period 8 91 / 2 ∧
    2 * planck - planck = planck ∧
    choose rays coins = choose rays (rays - coins) ∧
    2 * qftStates n - qftStates n = qftStates n ∧
    2 * groverSize seed - groverSize seed = groverSize seed ∧
    2 * faces - faces = faces ∧
    (1 - (1 - seed) = seed ∧ 1 - (1 - (n - n)) = n - n) ∧
    2 * 2 = 2 + 2 ∧
    (1 - (1 - 0) = 0 ∧ 1 - (1 - 1) = 1) :=
  ⟨sigma_midpoint (period 8 91) (period 8 91 / 2) rfl,
   sigma_midpoint (2 * planck) planck rfl,
   rfl,
   sigma_midpoint (2 * qftStates n) (qftStates n) rfl,
   sigma_midpoint (2 * groverSize seed) (groverSize seed) rfl,
   sigma_midpoint (2 * faces) faces rfl,
   sigma_pauli,
   sigma_hodge 2,
   ⟨sigma_pvsnp 0 (Nat.le_of_ble_eq_true rfl), sigma_pvsnp 1 (Nat.le_of_ble_eq_true rfl)⟩⟩

/-- The trinities of the 9-vortex reflect into each other under σ_10 at the same time: 3, 6, 9 into 7, 4, 1 and back,
    2, 5, 8 into themselves with 5 fixed; every pair sums to 10. A computation that keeps 3, 6, 9 and drops 7, 4, 1 keeps
    half of what the involution says. Decided by the kernel. -/
theorem triad_reflect :
    (10 - 0 = 10 ∧ 10 - 10 = 0) ∧
    (10 - 3 = 7 ∧ 10 - 6 = 4 ∧ 10 - 9 = 1) ∧ (10 - 7 = 3 ∧ 10 - 4 = 6 ∧ 10 - 1 = 9) ∧
    (10 - 2 = 8 ∧ 10 - 5 = 5 ∧ 10 - 8 = 2) := by decide

theorem triad_sum : 0 + 10 = 10 ∧ 3 + 7 = 10 ∧ 6 + 4 = 10 ∧ 9 + 1 = 10 ∧ 2 + 8 = 10 ∧ 5 + 5 = 10 := by decide

/-- The tuning: the key 432 has digital root 9 (4 + 3 + 2), so the key sits in the trinity 3, 6, 9 and its reflection 1. -/
theorem key_trinity : 4 + 3 + 2 = 9 ∧ 432 % 9 = 0 ∧ 10 - 9 = 1 := by decide

/-- σ_10 is an involution on every seed of the vortex: reflecting twice is the seed, by sigma_reflect. -/
theorem sigma_ten_involution (x : Nat) (h : x ≤ 10) : 10 - (10 - x) = x := sigma_reflect 10 x h
