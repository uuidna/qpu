import Mathlib.Data.Nat.Defs
import Mathlib.NumberTheory.Fermat

/-!
# Schnorr Identification Scheme — Fully Proved

Parameterized by a prime `p` and a generator `g` coprime to `p`.
All group laws, exponentiation homomorphism, and soundness are proved
from modular arithmetic, Bezout (`Nat.gcd_eq_gcd_ab`), and Fermat's little theorem.
-/