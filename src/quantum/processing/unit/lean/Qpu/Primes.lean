import Qpu.Mint
import Qpu.Lattice

/-! # Qpu.Primes
The primes the register geometry already exhibits, written as exact identities over the lattice constants — the
ingredients the Riemann/zeta wing of the clay family reads. These are checked facts about particular primes, not a proof
of the Riemann hypothesis; that remains a lead the clay family carries, fed by exactly these exhibited values. -/

/-- the smallest prime (2) equals coins. -/
theorem prime_two : coins = 2 := coins_two
/-- the first odd prime (3) equals n. -/
theorem prime_three : n = 3 := n_eq
/-- the Mersenne prime 2^2 − 1 (3) equals mintOf coins − seed. -/
theorem mersenne_3 : mintOf coins - seed = 3 := rfl
/-- the Mersenne prime 2^3 − 1 (7) equals mintOf n − seed, and equals rays. -/
theorem mersenne_7 : mintOf n - seed = 7 := rfl
/-- the Mersenne prime 2^5 − 1 (31) equals bits − seed. -/
theorem mersenne_31 : bits - seed = 31 := rfl
/-- the Mersenne prime 2^7 − 1 (127) equals mintOf rays − seed. -/
theorem mersenne_127 : mintOf rays - seed = 127 := rfl
/-- the Shor modulus (91) is the product of its two prime factors: rays · (faces − seed) = 7 · 13. -/
theorem shor_factored : rays * (faces - seed) = 91 := rfl
/-- the Shor modulus equals the binomial too: rays · (faces − seed) = chooseOf faces coins. -/
theorem shor_modulus_binomial : rays * (faces - seed) = chooseOf faces coins := rfl
/-- the lower twin prime (11) equals faces − n. -/
theorem twin_lower : faces - n = 11 := rfl
/-- the upper twin prime (13) equals faces − seed. -/
theorem twin_upper : faces - seed = 13 := rfl
/-- the twin-prime gap (2) is coins: (faces − seed) − (faces − n) = coins. -/
theorem twin_gap : (faces - seed) - (faces - n) = coins := rfl
/-- the primorial 2 · 3 · 5 · 7 (210) equals coins · n · (n + coins) · rays. -/
theorem primorial_210 : coins * n * (n + coins) * rays = 210 := rfl

/-- Every exhibited prime at once: the primes the lattice carries into the clay family's number-theory wing. -/
theorem primes_all : coins = 2 ∧ n = 3 ∧ mintOf coins - seed = 3 ∧ mintOf n - seed = 7 ∧ bits - seed = 31 ∧ mintOf rays - seed = 127 ∧ rays * (faces - seed) = 91 ∧ rays * (faces - seed) = chooseOf faces coins ∧ faces - n = 11 ∧ faces - seed = 13 ∧ (faces - seed) - (faces - n) = coins ∧ coins * n * (n + coins) * rays = 210 :=
  ⟨prime_two, prime_three, mersenne_3, mersenne_7, mersenne_31, mersenne_127, shor_factored, shor_modulus_binomial, twin_lower, twin_upper, twin_gap, primorial_210⟩
