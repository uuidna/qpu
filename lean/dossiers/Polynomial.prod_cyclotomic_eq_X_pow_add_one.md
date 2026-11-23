# Prior art: `Polynomial.prod_cyclotomic_eq_X_pow_add_one`

The statement: for `0 < n` and any commutative ring `R`, `∏ d ∈ (2 * n).divisors \ n.divisors, cyclotomic d R = X ^ n + 1`.
Researched 2026-11-23, against Mathlib v4.33.0 (db584cd6d4, 2026-08-10) and current Mathlib through Loogle and LeanSearch.

## Shape searches

- The Mathlib sources this tree pins, private declarations included, searched for `X ^ n + 1`, `X_pow_add_one` and any
  cyclotomic product over a set difference of divisors: one hit, `Polynomial.leadingCoeff_X_pow_add_one`, which is not
  this statement.
- Loogle on current Mathlib, `Finset.prod _ (fun d => Polynomial.cyclotomic d _) = Polynomial.X ^ _ + 1`: 0 declarations.
  `Polynomial.cyclotomic, Polynomial.X, HAdd.hAdd, 1`: 8 declarations (`cyclotomic_two`, `cyclotomic_three`,
  `cyclotomic_six`, `cyclotomic_prime_pow_eq_geom_sum`, `cyclotomic_prime_pow_mul_X_pow_sub_one`,
  `IsPrimitiveRoot.minpoly_sub_one_eq_cyclotomic_comp` and two Eisenstein criteria), none this statement.
- LeanSearch, "X^n + 1 is the product of cyclotomic polynomials over divisors of 2n not dividing n": the nearest are the
  definition `Polynomial.cyclotomic'` and `Polynomial.prod_cyclotomic_eq_X_pow_sub_one`, the `X ^ n - 1` product.

## Derivability attempts

Over all of Mathlib, imported whole (`import Mathlib`), at 400000 heartbeats:

- `exact?`: no proof, timed out.
- `apply?`: no proof, timed out.
- `simp`, `aesop`, `grind`: each fails.

The kernel-checked proof takes the `X ^ (2n) - 1` and `X ^ n - 1` products of `prod_cyclotomic_eq_X_pow_sub_one`, splits
the first over the divisors of `n` (`Finset.prod_sdiff`), factors `X ^ (2n) - 1 = (X ^ n + 1)(X ^ n - 1)` and cancels the
monic `X ^ n - 1`: more than a corollary of three lines, and not an instance of a general library theorem found above.

## Literature

The identity is stated in its ratio form, `x ^ n + 1 = ∏_{d ∣ 2n} Φ_d(x) / ∏_{d ∣ n} Φ_d(x)`, by the
[Wolfram functions site](https://functions.wolfram.com/Polynomials/Cyclotomic/24/01/0002/); it follows from the `x ^ n - 1`
product the [cyclotomic polynomial](https://en.wikipedia.org/wiki/Cyclotomic_polynomial) and
[Encyclopedia of Mathematics](https://encyclopediaofmath.org/wiki/Cyclotomic_polynomials) articles give. No source found
states the single product over `d ∣ 2n, d ∤ n`. It is known mathematics, not new: what is new is a library statement of it.

## Other provers

- Coq, Mathematical Components `field/cyclotomic.v`: `prod_cyclotomic` and `prod_Cyclotomic`, the `X ^ n - 1` products
  only.
- Isabelle, the Archive of Formal Proofs: no entry names cyclotomic polynomials; the four theories mentioning them
  (CRYSTALS-Kyber, Combinatorial_Q_Analogues twice, Gauss_Sums) do not state this product.

## Verdict

No Mathlib equivalent, no derivation by the library's search or automation, a standard identity not yet in a library:
a novelty, proposed for `Mathlib/RingTheory/Polynomial/Cyclotomic/Basic.lean` beside `prod_cyclotomic_eq_X_pow_sub_one`.
Its use here: the thousand-bit check splits `2 ^ 999 + 1` into `Φ_d(2)` over `d ∣ 1998`, `d ∤ 999`.
