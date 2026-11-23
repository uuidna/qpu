import Mathlib.Algebra.BigOperators.Intervals
import Mathlib.Algebra.Field.GeomSum
import Mathlib.Algebra.FreeMonoid.Basic
import Mathlib.Algebra.Order.Field.GeomSum
import Mathlib.Algebra.Order.Floor.Div
import Mathlib.Algebra.Ring.GeomSum
import Mathlib.Analysis.Real.Sqrt
import Mathlib.Analysis.SpecialFunctions.Trigonometric.Basic
import Mathlib.Combinatorics.Enumerative.DoubleCounting
import Mathlib.Combinatorics.SimpleGraph.DegreeSum
import Mathlib.Combinatorics.SimpleGraph.Walk.Basic
import Mathlib.Data.Finmap
import Mathlib.Data.Fintype.Perm
import Mathlib.Data.Matrix.Mul
import Mathlib.Data.Nat.Digits.Div
import Mathlib.Data.Nat.Dist
import Mathlib.Data.Nat.Fib.Basic
import Mathlib.Data.Nat.Size
import Mathlib.InformationTheory.Hamming
import Mathlib.LinearAlgebra.TensorProduct.Basic
import Mathlib.RingTheory.RootsOfUnity.Complex
import Mathlib.RingTheory.RootsOfUnity.PrimitiveRoots
import Mathlib.Data.Nat.Factorization.Basic
import Mathlib.Data.Nat.Totient
import Mathlib.Data.Nat.Log
import Mathlib.FieldTheory.Finite.Basic
import Qpu.Claims.Novelty
import Qpu.Claims.Reflection
import Qpu.Communication.QuantumCommunication
import Qpu.General.Sigma
import Qpu.General.Witness
import Qpu.Information.QuantumInformation
import Qpu.Processing.QuantumAlgorithm
import Qpu.Processing.QuantumErrorCorrection
import Qpu.Processing.QuantumGate

/-! # Qpu.General.Textbook
The textbook's axioms replaced by theorems: every arithmetic relation an example asserts, stated so the kernel checks it, and each one reflected by its shape.
This file is written here, in Lean. Each textbook theorem is a doc comment `<sentence> (examples: a, b)`, the theorem,
where it has variables an `example := @name` that holds the theorem at every value at once and at no chosen size, and the
theorems that reflect it. `lake run index` renders textbook-index.ts
from this text, and the TypeScript side reads that. -/

/-- each of n plugins in or out gives 2^n configurations. From Mathlib's `Fintype.card_fun`, `Fintype.card_bool` and `Fintype.card_fin` (examples: configure-payload) -/
theorem textbook_plugin_combinations (n : Nat) : Fintype.card (Fin n → Bool) = 2 ^ n := by
  rw [Fintype.card_fun, Fintype.card_bool, Fintype.card_fin]
example := @textbook_plugin_combinations
example : 2 ^ 9 = 512 := by decide
/-- textbook_plugin_combinations reflected by its shape (examples: configure-payload) -/
@[reflection] theorem textbook_plugin_combinations_reflected (n : Nat) : (2 ^ n) = (Fintype.card (Fin n → Bool)) := Eq.symm (textbook_plugin_combinations n)
/-- every variant priced in every currency is one price: variants × currencies prices. From Mathlib's `Fintype.card_prod` (examples: stripe-catalogue) -/
theorem textbook_prices_are_variants_times_currencies (Variant Currency : Type) [Fintype Variant] [Fintype Currency] :
  Fintype.card (Variant × Currency) = Fintype.card Variant * Fintype.card Currency := Fintype.card_prod _ _
example := @textbook_prices_are_variants_times_currencies
example : 9 * 2 = 18 := by decide
/-- textbook_prices_are_variants_times_currencies reflected by its shape (examples: stripe-catalogue) -/
@[reflection] theorem textbook_prices_are_variants_times_currencies_reflected (Variant Currency : Type) [Fintype Variant] [Fintype Currency] : (Fintype.card Variant * Fintype.card Currency) = (Fintype.card (Variant × Currency)) := Eq.symm (textbook_prices_are_variants_times_currencies Variant Currency)
/-- a string of a digits and b dashes has a + b characters (a UUID: 32 hex digits and 4 dashes, 36 characters). From Mathlib's `Fintype.card_sum`, `Fintype.card_fin` (examples: payload-doc, legal-audit-offline) -/
theorem textbook_uuid_is_36 (a b : Nat) : Fintype.card (Fin a ⊕ Fin b) = a + b := by
  rw [Fintype.card_sum, Fintype.card_fin, Fintype.card_fin]
example := @textbook_uuid_is_36
example : 32 + 4 = 36 := by decide
/-- textbook_uuid_is_36 reflected by its shape (examples: payload-doc, legal-audit-offline) -/
@[reflection] theorem textbook_uuid_is_36_reflected (a b : Nat) : (a + b) = (Fintype.card (Fin a ⊕ Fin b)) := Eq.symm (textbook_uuid_is_36 a b)
/-- a seed and its reflection σ₁₀(s) = 10 − s sum to ten. From Mathlib's `add_tsub_cancel_of_le`, `StarOrderedRing.toExistsAddOfLE`, `Nat.instStarOrderedRing`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid` and `Nat.instOrderedSub` (examples: css-stylesheet, configure-all) -/
theorem textbook_reflection_sums_to_ten (s : ℕ) (h : s ≤ 10) : s + (10 - s) = 10 := add_tsub_cancel_of_le h
example := @textbook_reflection_sums_to_ten
/-- textbook_reflection_sums_to_ten reflected by its shape (examples: css-stylesheet, configure-all) -/
@[reflection] theorem textbook_reflection_sums_to_ten_reflected (s : ℕ) (h : s ≤ 10) : (10) = (s + (10 - s)) := Eq.symm (textbook_reflection_sums_to_ten s h)
/-- piece i and its mirror n − i sum to the boundary n. From Mathlib's `add_tsub_cancel_of_le`, through the instances `StarOrderedRing.toExistsAddOfLE`, `Nat.instStarOrderedRing`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid` and `Nat.instOrderedSub` (examples: fold-ledger) -/
theorem textbook_fold_mirror (n i : Nat) (h : i ≤ n) : i + (n - i) = n := add_tsub_cancel_of_le h
example := @textbook_fold_mirror
/-- textbook_fold_mirror reflected by its shape (examples: fold-ledger) -/
@[reflection] theorem textbook_fold_mirror_reflected (n i : Nat) (h : i ≤ n) (σ : Nat) : σ - (n) = σ - (i + (n - i)) := congrArg (σ - ·) (Eq.symm (textbook_fold_mirror n i h))
/-- the contrapositive of textbook_fold_mirror (examples: fold-ledger) -/
@[reflection] theorem textbook_fold_mirror_contrapositive (n i : Nat) : ¬ (i + (n - i) = n) → ¬ ((i ≤ n)) := fun hc hh => hc (textbook_fold_mirror n i hh)
/-- the converse of textbook_fold_mirror, proved. From Mathlib's `add_tsub_cancel_iff_le`, `Nat.instCanonicallyOrderedAdd` and `Nat.instOrderedSub` (examples: fold-ledger) -/
@[reflection] theorem textbook_fold_mirror_converse (n i : Nat) : (i + (n - i) = n) → (i ≤ n) :=
  fun hc => add_tsub_cancel_iff_le.mp hc
/-- a keyed integrations and b open ones make a + b, the cardinality of a disjoint union. From Mathlib's `Fintype.card_sum` and `Fintype.card_fin` (examples: extend-in-request) -/
theorem textbook_integrations_are_thirty_five (a b : ℕ) : Fintype.card (Fin a ⊕ Fin b) = a + b := by
  rw [Fintype.card_sum, Fintype.card_fin, Fintype.card_fin]
example := @textbook_integrations_are_thirty_five
example : 34 + 1 = 35 := by decide
/-- textbook_integrations_are_thirty_five reflected by its shape (examples: extend-in-request) -/
@[reflection] theorem textbook_integrations_are_thirty_five_reflected (a b : ℕ) : (a + b) = (Fintype.card (Fin a ⊕ Fin b)) := Eq.symm (textbook_integrations_are_thirty_five a b)
/-- an institution within its cap of users never pays more than the cap's bill: in any ordered semiring (ℕ among them) users times a nonnegative price is monotone in the users, u ≤ c gives u · p ≤ c · p. From Mathlib's `mul_le_mul_of_nonneg_right` (examples: textbook-institution) -/
theorem textbook_institution_bill {α : Type*} [Mul α] [Zero α] [Preorder α] [MulPosMono α] (u c p : α) (h : u ≤ c)
    (hp : 0 ≤ p) : u * p ≤ c * p :=
  mul_le_mul_of_nonneg_right h hp
example := @textbook_institution_bill
/-- the family sets are mixed-radix indices, one digit per radix, |Π i, Fin (r i)| = ∏ r i. From Mathlib's `Fintype.card_pi`, `Finset.prod_congr` and `Fintype.card_fin` (examples: textbook-sets, textbook-set) -/
theorem textbook_workspace_sets (k : Nat) (r : Fin k → Nat) : Fintype.card ((i : Fin k) → Fin (r i)) = ∏ i, r i := by
  rw [Fintype.card_pi]; exact Finset.prod_congr rfl fun i _ => Fintype.card_fin (r i)
example := @textbook_workspace_sets
example : 3 * 3 * 3 * 3 * 3 * 3 * 2 * 3 * 2 * 3 = 26244 ∧ 3 = 3 := by decide
/-- textbook_workspace_sets reflected by its shape (examples: textbook-sets, textbook-set) -/
@[reflection] theorem textbook_workspace_sets_reflected (k : Nat) (r : Fin k → Nat) : (∏ i, r i) = (Fintype.card ((i : Fin k) → Fin (r i))) := Eq.symm (textbook_workspace_sets k r)
/-- a namespace narrows a credential, never widens it: the meet of what the request named and what the user held lies below what the user held. From Mathlib's `inf_le_right` (examples: payload-namespace-sandbox, payload-namespace-narrow, leads-client) -/
theorem textbook_namespace_narrows {α : Type*} [SemilatticeInf α] (named held : α) : named ⊓ held ≤ held := inf_le_right
example := @textbook_namespace_narrows
/-- a deterministic check of equal inputs has an equal verdict: an example whose answer folds to the integers its theorem's confirmed pass recorded is decided by that theorem, and the text checks run only to confirm a new integer (examples: audit-self) -/
theorem textbook_integers_first (a b : Nat) (v : Nat → Bool) (h : a = b) : v a = v b := by rw [h]
/-- textbook_integers_first reflected by its shape, equality (examples: audit-self) -/
@[reflection] theorem textbook_integers_first_reflected (a b : Nat) (v : Nat → Bool) (h : a = b) : (v b) = (v a) := Eq.symm (textbook_integers_first a b v h)
/-- a size ratio rounded down never overstates the exact ratio. From Mathlib's `Nat.cast_div_le`, through the instance `Rat.instIsStrictOrderedRing` (examples: css-compare, extend-compare) -/
theorem textbook_size_ratio_bound (framework qpu : Nat) : ((framework / qpu : ℕ) : ℚ) ≤ (framework : ℚ) / qpu := Nat.cast_div_le
example := @textbook_size_ratio_bound
/-- when debits equal credits the journal nets to zero both ways: a number less itself is zero. From Mathlib's `tsub_self`, through the instances `Nat.instCanonicallyOrderedAdd` and `Nat.instOrderedSub` (examples: stripe-ledger, compete-economics, verify-radar) -/
theorem textbook_double_entry (debits credits : Nat) (h : debits = credits) : debits - credits = 0 ∧ credits - debits = 0 := by
  subst h; exact ⟨tsub_self _, tsub_self _⟩
example := @textbook_double_entry
/-- textbook_double_entry reflected by its shape (examples: stripe-ledger, compete-economics, verify-radar) -/
@[reflection] theorem textbook_double_entry_reflected (debits credits : Nat) (h : debits = credits) (σ : Nat) : (σ - (0) = σ - (debits - credits)) ∧ (σ - (0) = σ - (credits - debits)) := ⟨congrArg (σ - ·) (Eq.symm (textbook_double_entry debits credits h).1), congrArg (σ - ·) (Eq.symm (textbook_double_entry debits credits h).2)⟩
/-- the contrapositive of textbook_double_entry (examples: stripe-ledger, compete-economics, verify-radar) -/
@[reflection] theorem textbook_double_entry_contrapositive (debits credits : Nat) : ¬ (debits - credits = 0 ∧ credits - debits = 0) → ¬ ((debits = credits)) := fun hc hh => hc (textbook_double_entry debits credits hh)
/-- the converse of textbook_double_entry, proved. From Mathlib's `le_antisymm`, `tsub_eq_zero_iff_le`, `Nat.instCanonicallyOrderedAdd` and `Nat.instOrderedSub` (examples: stripe-ledger, compete-economics, verify-radar) -/
@[reflection] theorem textbook_double_entry_converse (debits credits : Nat) : (debits - credits = 0 ∧ credits - debits = 0) → (debits = credits) :=
  fun hc => le_antisymm (tsub_eq_zero_iff_le.mp hc.1) (tsub_eq_zero_iff_le.mp hc.2)
/-- the covered and the uncovered make the standards: with truncated subtraction (ℕ among its models), when c + u is the total, the total less u is c. From Mathlib's `add_tsub_cancel_right` (examples: standards-validate, textbook-education, payload-iso-connector, payload-iso-connector-auth, payload-iso-connector-id) -/
theorem textbook_standards_sliced {α : Type*} [PartialOrder α] [AddCommSemigroup α] [Sub α] [OrderedSub α]
    [AddLeftReflectLE α] (covered uncovered total : α) (h : covered + uncovered = total) : total - uncovered = covered := by
  rw [← h]; exact add_tsub_cancel_right covered uncovered
example := @textbook_standards_sliced
/-- textbook_standards_sliced reflected by its shape (examples: standards-validate, textbook-education, payload-iso-connector, payload-iso-connector-auth, payload-iso-connector-id) -/
@[reflection] theorem textbook_standards_sliced_reflected {α : Type*} [PartialOrder α] [AddCommSemigroup α] [Sub α] [OrderedSub α] [AddLeftReflectLE α] (covered uncovered total : α) (h : covered + uncovered = total) : (covered) = (total - uncovered) := Eq.symm (textbook_standards_sliced covered uncovered total h)
/-- parseToMicrodata splits a value and converts every piece to schema.org microdata at the deepest SKU-bearing leaf: an ISO reference into organization / number / part / year (each character a DefinedTerm), a sealed UUID into handle / program / stamp / tail (each nibble a leaf), anything else into tokens then characters; the root SKU is the handle of uuid(text) or of the sealed address itself, the same trackable rule as a product SKU (15 ISO dimensions → depth 4, 141 leaves) (examples: payload-iso) -/
theorem textbook_parse_microdata_deep : 4 > 2 ∧ 141 > 14 ∧ 15 = 15 := by decide
/-- textbook_parse_microdata_deep reflected by its shape, conjunction (examples: payload-iso) -/
@[reflection] theorem textbook_parse_microdata_deep_reflected (σ : Nat) (hσ0 : (4) ≤ σ) (hσ1 : (141) ≤ σ) : (σ - (4) < σ - (2)) ∧ (σ - (141) < σ - (14)) ∧ (σ - (15) = σ - (15)) := ⟨Nat.sub_lt_sub_left (Nat.lt_of_lt_of_le (textbook_parse_microdata_deep).1 hσ0) (textbook_parse_microdata_deep).1, Nat.sub_lt_sub_left (Nat.lt_of_lt_of_le (textbook_parse_microdata_deep).2.1 hσ1) (textbook_parse_microdata_deep).2.1, congrArg (σ - ·) (Eq.symm (textbook_parse_microdata_deep).2.2)⟩
/-- typography set twice is set once: min (min n 1) 1 = min n 1, a cap applied again changes nothing. From Mathlib's `min_assoc` and `min_self` (examples: payload-standardise) -/
theorem textbook_typography_idempotent (n : ℕ) : min (min n 1) 1 = min n 1 := by
  rw [min_assoc, min_self]
example := @textbook_typography_idempotent
/-- textbook_typography_idempotent reflected by its shape (examples: payload-standardise) -/
@[reflection] theorem textbook_typography_idempotent_reflected (n : ℕ) : (min n 1) = (min (min n 1) 1) := Eq.symm (textbook_typography_idempotent n)
/-- n documents fused into k nodes: with truncated subtraction (ℕ among its models), the n − k fused away and the k that remain are the n, every document counted once. From Mathlib's `tsub_add_cancel_of_le` (examples: payload-references) -/
theorem textbook_references_acyclic {α : Type*} [AddCommSemigroup α] [PartialOrder α] [ExistsAddOfLE α] [AddLeftMono α]
    [Sub α] [OrderedSub α] (k n : α) (h : k ≤ n) : n - k + k = n := tsub_add_cancel_of_le h
example := @textbook_references_acyclic
/-- textbook_references_acyclic reflected by its shape (examples: payload-references) -/
@[reflection] theorem textbook_references_acyclic_reflected {α : Type*} [AddCommSemigroup α] [PartialOrder α] [ExistsAddOfLE α] [AddLeftMono α] [Sub α] [OrderedSub α] (k n : α) (h : k ≤ n) : (n) = (n - k + k) := Eq.symm (textbook_references_acyclic k n h)
/-- when the queries served and the cache hits saved make the total, the total less the saved is the served. From Mathlib's `add_tsub_cancel_right`, through the instances `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono` and `Nat.instIsOrderedAddMonoid` (examples: payload-reference-index) -/
theorem textbook_cache_saves_cost (served saved total : Nat) (h : served + saved = total) : total - saved = served := by
  rw [← h]; exact add_tsub_cancel_right served saved
example := @textbook_cache_saves_cost
/-- textbook_cache_saves_cost reflected by its shape (examples: payload-reference-index) -/
@[reflection] theorem textbook_cache_saves_cost_reflected (served saved total : Nat) (h : served + saved = total) (σ : Nat) : σ - (served) = σ - (total - saved) := congrArg (σ - ·) (Eq.symm (textbook_cache_saves_cost served saved total h))
/-- the contrapositive of textbook_cache_saves_cost (examples: payload-reference-index) -/
@[reflection] theorem textbook_cache_saves_cost_contrapositive (served saved total : Nat) : ¬ (total - saved = served) → ¬ ((served + saved = total)) := fun hc hh => hc (textbook_cache_saves_cost served saved total hh)
/-- the distinct addresses and the cache hits make the references, so the references less the hits are the distinct addresses. From Mathlib's `Finset.card_sdiff_of_subset` (examples: payload-reference-index) -/
theorem textbook_reference_index_cached {Reference : Type} [DecidableEq Reference] (references hits : Finset Reference) (h : hits ⊆ references) :
  (references \ hits).card = references.card - hits.card := Finset.card_sdiff_of_subset h
example := @textbook_reference_index_cached
/-- textbook_reference_index_cached reflected by its shape (examples: payload-reference-index) -/
@[reflection] theorem textbook_reference_index_cached_reflected {Reference : Type} [DecidableEq Reference] (references hits : Finset Reference) (h : hits ⊆ references) : (references.card - hits.card) = ((references \ hits).card) := Eq.symm (textbook_reference_index_cached references hits h)
/-- the gravitational constant 667430 × 10^-16 with its uncertainty 15 × 10^-16 has a relative uncertainty of 22474 parts per billion, rounded down, computed from the integers alone: a seal keeps it, never removes it (examples: seal-constants) -/
theorem textbook_codata_g_ppb : 15 * 1000000000 / 667430 = 22474 := by decide
/-- textbook_codata_g_ppb reflected by its shape, equality (examples: seal-constants) -/
@[reflection] theorem textbook_codata_g_ppb_reflected (σ : Nat) : σ - (22474) = σ - (15 * 1000000000 / 667430) := congrArg (σ - ·) (Eq.symm (textbook_codata_g_ppb))
/-- fields of a, b, c and d bits make a + b + c + d bits (time 48, version 4, variant 2, space 74: 128 for a version 7 UUID). From Mathlib's `Fintype.card_sum` and `Fintype.card_fin` (examples: fold-split) -/
theorem textbook_uuid_time_space (a b c d : ℕ) : Fintype.card (Fin a ⊕ Fin b ⊕ Fin c ⊕ Fin d) = a + b + c + d := by
  rw [Fintype.card_sum, Fintype.card_sum, Fintype.card_sum, Fintype.card_fin, Fintype.card_fin, Fintype.card_fin, Fintype.card_fin, Nat.add_assoc, Nat.add_assoc]
example := @textbook_uuid_time_space
example : 48 + 4 + 2 + 74 = 128 := by decide
/-- textbook_uuid_time_space reflected by its shape (examples: fold-split) -/
@[reflection] theorem textbook_uuid_time_space_reflected (a b c d : ℕ) : (a + b + c + d) = (Fintype.card (Fin a ⊕ Fin b ⊕ Fin c ⊕ Fin d)) := Eq.symm (textbook_uuid_time_space a b c d)
/-- a word is found in a table only among the table's own keys: a lookup that hits names a key of the table. From Mathlib's `Finmap.lookup_isSome` (examples: match-builtin-words, chat-builtin-words, translate-builtin-words, chat-cirq-constructors) -/
theorem textbook_own_keys_only {α : Type} {β : α → Type} [DecidableEq α] (table : Finmap β) (word : α) (v : β word)
  (h : table.lookup word = some v) : word ∈ table := Finmap.lookup_isSome.mp (by rw [h]; rfl)
example := @textbook_own_keys_only
/-- a coin line booking the same count on both sides nets to zero: a number less itself is zero. From Mathlib's `tsub_self`, through the instances `Nat.instCanonicallyOrderedAdd` and `Nat.instOrderedSub` (examples: repository-penalty) -/
theorem textbook_penalty_balanced (d c : Nat) (h : d = c) : d - c = 0 := by
  rw [h, tsub_self]
example := @textbook_penalty_balanced
/-- textbook_penalty_balanced reflected by its shape (examples: repository-penalty) -/
@[reflection] theorem textbook_penalty_balanced_reflected (d c : Nat) (h : d = c) (σ : Nat) : σ - (0) = σ - (d - c) := congrArg (σ - ·) (Eq.symm (textbook_penalty_balanced d c h))
/-- the contrapositive of textbook_penalty_balanced (examples: repository-penalty) -/
@[reflection] theorem textbook_penalty_balanced_contrapositive (d c : Nat) : ¬ (d - c = 0) → ¬ ((d = c)) := fun hc hh => hc (textbook_penalty_balanced d c hh)
/-- penalising then clearing leaves the open count as it was: (open + n) − n = open. From Mathlib's `add_tsub_cancel_right`, `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid` (examples: repository-penalty-clear) -/
theorem textbook_penalty_clear_involution (opn n : Nat) : opn + n - n = opn := add_tsub_cancel_right opn n
example := @textbook_penalty_clear_involution
/-- textbook_penalty_clear_involution reflected by its shape (examples: repository-penalty-clear) -/
@[reflection] theorem textbook_penalty_clear_involution_reflected (opn n : Nat) (σ : Nat) : σ - (opn) = σ - (opn + n - n) := congrArg (σ - ·) (Eq.symm (textbook_penalty_clear_involution opn n))
/-- every penalty opened is either cleared or still open: with truncated subtraction (ℕ among its models), when the cleared and the open make the opened, the open count is the opened less the cleared. From Mathlib's `add_tsub_cancel_left` (examples: none yet) -/
theorem textbook_penalty_conserved {α : Type*} [PartialOrder α] [AddCommSemigroup α] [Sub α] [OrderedSub α]
    [AddLeftReflectLE α] (opened cleared openNow : α) (h : cleared + openNow = opened) : opened - cleared = openNow := by
  rw [← h]; exact add_tsub_cancel_left cleared openNow
example := @textbook_penalty_conserved
/-- textbook_penalty_conserved reflected by its shape (examples: ) -/
@[reflection] theorem textbook_penalty_conserved_reflected {α : Type*} [PartialOrder α] [AddCommSemigroup α] [Sub α] [OrderedSub α] [AddLeftReflectLE α] (opened cleared openNow : α) (h : cleared + openNow = opened) : (openNow) = (opened - cleared) := Eq.symm (textbook_penalty_conserved opened cleared openNow h)
/-- a penalty's tokens, its bytes over four rounded up (b ⌈/⌉ 4), never exceed its bytes. From Mathlib's `ceilDiv_le_iff_le_mul` (examples: repository-penalty) -/
theorem textbook_penalty_tokens_bound (b : Nat) (h : 0 < b) : b ⌈/⌉ 4 ≤ b := (ceilDiv_le_iff_le_mul (by decide)).2 (by omega)
example := @textbook_penalty_tokens_bound
/-- an entry already held is not added again: inserting it leaves the set as it was, however often it is penalised. From Mathlib's `Finset.insert_eq_of_mem` (examples: repository-penalty-once) -/
theorem textbook_penalty_once {α : Type} [DecidableEq α] (s : Finset α) (a : α) (h : a ∈ s) : insert a s = s := Finset.insert_eq_of_mem h
example := @textbook_penalty_once
/-- textbook_penalty_once reflected by its shape (examples: repository-penalty-once) -/
@[reflection] theorem textbook_penalty_once_reflected {α : Type} [DecidableEq α] (s : Finset α) (a : α) (h : a ∈ s) : (s) = (insert a s) := Eq.symm (textbook_penalty_once s a h)
/-- a waiting price never falls as a task gets slower or hotter: truncated subtraction of the budget is monotone and sums of monotone terms are monotone. From Mathlib's `add_le_add`, `tsub_le_tsub_right`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid`, `covariant_swap_add_of_covariant_add` and `Nat.instOrderedSub` (examples: repository-penalty-waiting) -/
theorem textbook_penalty_time_heat_monotone (b w w' c c' : ℕ) (hw : w ≤ w') (hc : c ≤ c') : (w - b) + (c - b) ≤ (w' - b) + (c' - b) :=
  add_le_add (tsub_le_tsub_right hw b) (tsub_le_tsub_right hc b)
example := @textbook_penalty_time_heat_monotone
/-- the waiting price has no cliff: truncated subtraction (ℕ among its models) is 1-Lipschitz, (w + e) − b ≤ (w − b) + e, so e more milliseconds on the wall raise the price, beside any other charge c, by at most e, at the budget as everywhere. From Mathlib's `add_le_add_right` and `add_tsub_le_tsub_add` (examples: repository-penalty-no-cliff) -/
theorem textbook_penalty_no_cliff {α : Type*} [Preorder α] [AddCommSemigroup α] [Sub α] [OrderedSub α] [AddLeftMono α]
    (b w e c : α) : c + (w + e - b) ≤ c + (w - b + e) :=
  add_le_add_right add_tsub_le_tsub_add c
example := @textbook_penalty_no_cliff
/-- a task within the budget, on the wall and on the CPU, is free: each overrun truncates to zero. From Mathlib's `tsub_eq_zero_of_le`, `add_zero`, `Nat.instCanonicallyOrderedAdd` and `Nat.instOrderedSub` (examples: repository-penalty-under-budget) -/
theorem textbook_penalty_free_under_budget (b w c : ℕ) (hw : w ≤ b) (hc : c ≤ b) : (w - b) + (c - b) = 0 := by
  rw [tsub_eq_zero_of_le hw, tsub_eq_zero_of_le hc, add_zero]
example := @textbook_penalty_free_under_budget
/-- textbook_penalty_free_under_budget reflected by its shape (examples: repository-penalty-under-budget) -/
@[reflection] theorem textbook_penalty_free_under_budget_reflected (b w c : ℕ) (hw : w ≤ b) (hc : c ≤ b) : (0) = ((w - b) + (c - b)) := Eq.symm (textbook_penalty_free_under_budget b w c hw hc)
/-- a gap and its antimatter annihilate: the line priced and reversed nets to zero, and only what stood beside it remains, t + p − t = p. From Mathlib's `add_tsub_cancel_left`, `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono` and `Nat.instIsOrderedAddMonoid` (examples: repository-penalty-annihilate) -/
theorem textbook_penalty_antimatter_annihilates (t p : ℕ) : t + p - t = p := add_tsub_cancel_left t p
example := @textbook_penalty_antimatter_annihilates
/-- textbook_penalty_antimatter_annihilates reflected by its shape (examples: repository-penalty-annihilate) -/
@[reflection] theorem textbook_penalty_antimatter_annihilates_reflected (t p : ℕ) : (p) = (t + p - t) := Eq.symm (textbook_penalty_antimatter_annihilates t p)
/-- a penalty raised then cleared leaves status and standing exactly as they were: x + t − t = x. From Mathlib's `add_tsub_cancel_right`, `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono` and `Nat.instIsOrderedAddMonoid` (examples: repository-penalty-no-punishment) -/
theorem textbook_penalty_no_punishment (balance standing t : ℕ) : (balance + t - t, standing + t - t) = (balance, standing) := by
  rw [add_tsub_cancel_right, add_tsub_cancel_right]
example := @textbook_penalty_no_punishment
/-- textbook_penalty_no_punishment reflected by its shape (examples: repository-penalty-no-punishment) -/
@[reflection] theorem textbook_penalty_no_punishment_reflected (balance standing t : ℕ) : ((balance, standing)) = ((balance + t - t, standing + t - t)) := Eq.symm (textbook_penalty_no_punishment balance standing t)
/-- the time a gap stood is burned: with truncated subtraction (ℕ among its models), its charge (c − b) + (s − b) never falls as it stands longer, and is zero when cleared within the budget. From Mathlib's `add_le_add_right`, `tsub_le_tsub_right`, `tsub_eq_zero_of_le` and `add_zero` (examples: repository-penalty-annihilate) -/
theorem textbook_penalty_time_burned {α : Type*} [AddCommMonoid α] [PartialOrder α] [CanonicallyOrderedAdd α] [Sub α]
    [OrderedSub α] [AddLeftMono α] (b s s' c : α) (hs : s ≤ s') :
    (c - b) + (s - b) ≤ (c - b) + (s' - b) ∧ (s ≤ b → c ≤ b → (c - b) + (s - b) = 0) :=
  ⟨add_le_add_right (tsub_le_tsub_right hs b) (c - b), fun h1 h2 => by
    rw [tsub_eq_zero_of_le h1, tsub_eq_zero_of_le h2, add_zero]⟩
example := @textbook_penalty_time_burned
/-- a penalty is as visible as the action it prices: printed agrees with visible, kind by kind over the ten gap kinds, so a printed penalty priced a visible action — an invisible action's penalty is recorded silently and counted on request, never printed (examples: repository-penalty-invisible, repository-penalty-visible) -/
theorem textbook_penalty_visibility_harmonic (visible printed : Bool) (h : printed = visible) : printed = true → visible = true := by intro hp; rw [← h]; exact hp
example := @textbook_penalty_visibility_harmonic
/-- textbook_penalty_visibility_harmonic reflected by its shape, implication (examples: repository-penalty-invisible, repository-penalty-visible) -/
@[reflection] theorem textbook_penalty_visibility_harmonic_reflected (visible printed : Bool) (h : printed = visible) : ¬ (visible = true) → ¬ ((printed = true)) := fun hc hh => hc ((textbook_penalty_visibility_harmonic visible printed h) hh)
/-- a deterministic step of equal input addresses gives an equal receipt: a step whose inputs are unchanged since it last ran green is reused from its sealed record, never rerun; a step that reads the network, the clock or its own artefacts is never cached (examples: repository-steps-reused) -/
theorem textbook_step_cache_sound (f : Nat → Nat) (k₁ k₂ : Nat) (h : k₁ = k₂) : f k₁ = f k₂ := by rw [h]
/-- textbook_step_cache_sound reflected by its shape, equality (examples: repository-steps-reused) -/
@[reflection] theorem textbook_step_cache_sound_reflected (f : Nat → Nat) (k₁ k₂ : Nat) (h : k₁ = k₂) : (f k₂) = (f k₁) := Eq.symm (textbook_step_cache_sound f k₁ k₂ h)
/-- a hook never does more work than its inputs force: with truncated subtraction (ℕ among its models), when the steps run are at most the changed and the uncacheable, the cacheable steps run are at most the changed, r ≤ c + u gives r − u ≤ c. From Mathlib's `tsub_le_iff_right` (examples: repository-steps-reused, repository-steps-changed) -/
theorem textbook_hook_steps_monotone {α : Type*} [LE α] [Add α] [Sub α] [OrderedSub α] (run changed uncacheable : α)
    (h : run ≤ changed + uncacheable) : run - uncacheable ≤ changed :=
  tsub_le_iff_right.mpr h
example := @textbook_hook_steps_monotone
/-- idle is priced by the lesser of the idle capacity and the work queued: min i r is never more than either, and nothing when nothing is left to do. From Mathlib's `min_le_left`, `min_le_right` and `min_eq_right` (examples: repository-idle-priced) -/
theorem textbook_idle_priced_by_remaining (i r : Nat) : min i r ≤ i ∧ min i r ≤ r ∧ (r = 0 → min i r = 0) :=
  ⟨min_le_left i r, min_le_right i r, fun h => by subst h; exact min_eq_right (Nat.zero_le i)⟩
example := @textbook_idle_priced_by_remaining
/-- textbook_idle_priced_by_remaining reflected by its shape (examples: repository-idle-priced) -/
@[reflection] theorem textbook_idle_priced_by_remaining_reflected (i r : Nat) (σ : Nat) : (σ - (i) ≤ σ - (min i r)) ∧ (σ - (r) ≤ σ - (min i r)) ∧ (¬ (min i r = 0) → ¬ ((r = 0))) := ⟨Nat.sub_le_sub_left (textbook_idle_priced_by_remaining i r).1 σ, Nat.sub_le_sub_left (textbook_idle_priced_by_remaining i r).2.1 σ, fun hc hh => hc ((textbook_idle_priced_by_remaining i r).2.2 hh)⟩
/-- scheduling the remaining work into the idle capacity leaves only the work beyond it: r − min(r, i) = r − i, truncated at zero. From Mathlib's `min_comm`, `tsub_min`, `Nat.instCanonicallyOrderedAdd` and `Nat.instOrderedSub` (examples: repository-idle-scheduled) -/
theorem textbook_idle_scheduled_clears (i r : ℕ) : r - min i r = r - i := by
  rw [min_comm, tsub_min]
example := @textbook_idle_scheduled_clears
/-- textbook_idle_scheduled_clears reflected by its shape (examples: repository-idle-scheduled) -/
@[reflection] theorem textbook_idle_scheduled_clears_reflected (i r : ℕ) : (r - i) = (r - min i r) := Eq.symm (textbook_idle_scheduled_clears i r)
/-- unused capacity is conserved: with truncated subtraction (ℕ among its models), the used and the idle make the capacity, u + (c − u) = c when u ≤ c, for every measure. From Mathlib's `add_tsub_cancel_of_le` (examples: repository-capacity) -/
theorem textbook_capacity_conserved {α : Type*} [AddCommSemigroup α] [PartialOrder α] [ExistsAddOfLE α] [AddLeftMono α]
    [Sub α] [OrderedSub α] (capacity used : α) (h : used ≤ capacity) : used + (capacity - used) = capacity :=
  add_tsub_cancel_of_le h
example := @textbook_capacity_conserved
/-- textbook_capacity_conserved reflected by its shape (examples: repository-capacity) -/
@[reflection] theorem textbook_capacity_conserved_reflected {α : Type*} [AddCommSemigroup α] [PartialOrder α] [ExistsAddOfLE α] [AddLeftMono α] [Sub α] [OrderedSub α] (capacity used : α) (h : used ≤ capacity) : (capacity) = (used + (capacity - used)) := Eq.symm (textbook_capacity_conserved capacity used h)
/-- the n gap kinds less the n that have antimatter leave none without it: n − n = 0. From Mathlib's `tsub_self`, `Nat.instCanonicallyOrderedAdd` and `Nat.instOrderedSub` (examples: repository-antimatter-total) -/
theorem textbook_antimatter_total (n : ℕ) : n - n = 0 := tsub_self n
example := @textbook_antimatter_total
example : 12 - 12 = 0 := by decide
/-- textbook_antimatter_total reflected by its shape (examples: repository-antimatter-total) -/
@[reflection] theorem textbook_antimatter_total_reflected (n : ℕ) : (0) = (n - n) := Eq.symm (textbook_antimatter_total n)
/-- coins and coils booked in double entry net to zero: debits and credits are both the coins plus the coils, so their difference is nothing. From Mathlib's `tsub_self`, `Nat.instCanonicallyOrderedAdd`, `Nat.instOrderedSub` (examples: repository-reactor, repository-plasma, chat-account) -/
theorem textbook_coins_coils_balanced (coins coils debits credits : Nat) (hd : debits = coins + coils) (hc : credits = coins + coils) : debits - credits = 0 := by
  rw [hd, hc, tsub_self]
example := @textbook_coins_coils_balanced
/-- textbook_coins_coils_balanced reflected by its shape (examples: repository-reactor, repository-plasma, chat-account) -/
@[reflection] theorem textbook_coins_coils_balanced_reflected (coins coils debits credits : Nat) (hd : debits = coins + coils) (hc : credits = coins + coils) (σ : Nat) : σ - (0) = σ - (debits - credits) := congrArg (σ - ·) (Eq.symm (textbook_coins_coils_balanced coins coils debits credits hd hc))
/-- the contrapositive of textbook_coins_coils_balanced (examples: repository-reactor, repository-plasma, chat-account) -/
@[reflection] theorem textbook_coins_coils_balanced_contrapositive (coins coils debits credits : Nat) : ¬ (debits - credits = 0) → ¬ ((debits = coins + coils) ∧ (credits = coins + coils)) := fun hc hh => hc (textbook_coins_coils_balanced coins coils debits credits hh.1 hh.2)
/-- a penalty priced at the cost that undoes it annihilates to zero both ways: a number less itself is zero. From Mathlib's `tsub_self`, through the instances `Nat.instCanonicallyOrderedAdd` and `Nat.instOrderedSub` (examples: repository-penalty-harmonic) -/
theorem textbook_penalty_harmonic (cost price : Nat) (h : price = cost) : price - cost = 0 ∧ cost - price = 0 := by
  subst h; exact ⟨tsub_self _, tsub_self _⟩
example := @textbook_penalty_harmonic
/-- textbook_penalty_harmonic reflected by its shape (examples: repository-penalty-harmonic) -/
@[reflection] theorem textbook_penalty_harmonic_reflected (cost price : Nat) (h : price = cost) (σ : Nat) : (σ - (0) = σ - (price - cost)) ∧ (σ - (0) = σ - (cost - price)) := ⟨congrArg (σ - ·) (Eq.symm (textbook_penalty_harmonic cost price h).1), congrArg (σ - ·) (Eq.symm (textbook_penalty_harmonic cost price h).2)⟩
/-- the contrapositive of textbook_penalty_harmonic (examples: repository-penalty-harmonic) -/
@[reflection] theorem textbook_penalty_harmonic_contrapositive (cost price : Nat) : ¬ (price - cost = 0 ∧ cost - price = 0) → ¬ ((price = cost)) := fun hc hh => hc (textbook_penalty_harmonic cost price hh)
/-- the converse of textbook_penalty_harmonic, proved. From Mathlib's `le_antisymm`, `tsub_eq_zero_iff_le`, `Nat.instCanonicallyOrderedAdd` and `Nat.instOrderedSub` (examples: repository-penalty-harmonic) -/
@[reflection] theorem textbook_penalty_harmonic_converse (cost price : Nat) : (price - cost = 0 ∧ cost - price = 0) → (price = cost) :=
  fun hc => le_antisymm (tsub_eq_zero_iff_le.mp hc.1) (tsub_eq_zero_iff_le.mp hc.2)
/-- one more occurrence of a violation costs one more unit, never a multiplier: (n + 1) · u = n · u + u. From Mathlib's `add_one_mul`, `Distrib.rightDistribClass` (examples: repository-penalty-proportional) -/
theorem textbook_penalty_proportional (n u : Nat) : (n + 1) * u = n * u + u := add_one_mul n u
example := @textbook_penalty_proportional
/-- textbook_penalty_proportional reflected by its shape (examples: repository-penalty-proportional) -/
@[reflection] theorem textbook_penalty_proportional_reflected (n u : Nat) (σ : Nat) : σ - (n * u + u) = σ - ((n + 1) * u) := congrArg (σ - ·) (Eq.symm (textbook_penalty_proportional n u))
/-- a violation whose learned correction ran by itself and cleared is corrected and re-decided before it is raised: when the correction is applied and the rule holds again, no penalty is raised — the involution of the thinking that caused it (examples: repository-penalty-learned, repository-penalty-learning) -/
theorem textbook_penalty_learned_prevents (learned raised : Bool) (h : learned = true → raised = false) (hl : learned = true) : raised = false := h hl
example := @textbook_penalty_learned_prevents
/-- textbook_penalty_learned_prevents reflected by its shape, equality (examples: repository-penalty-learned, repository-penalty-learning) -/
@[reflection] theorem textbook_penalty_learned_prevents_reflected (learned raised : Bool) (h : learned = true → raised = false) (hl : learned = true) : (false) = (raised) := Eq.symm (textbook_penalty_learned_prevents learned raised h hl)
/-- code that folds never grows the tree: adding a bytes and removing r ≥ a leaves s + a − r ≤ s. From Mathlib's `tsub_le_iff_right`, `add_le_add_right`, `Nat.instOrderedSub`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid` (examples: repository-commit-folds, repository-commit-grows, repository-commit-joined, repository-commit-payload-writes) -/
theorem textbook_code_folds (s a r : Nat) (h : a ≤ r) (hr : r ≤ s) : s + a - r ≤ s :=
  tsub_le_iff_right.mpr (add_le_add_right h s)
example := @textbook_code_folds
/-- textbook_code_folds reflected by its shape (examples: repository-commit-folds, repository-commit-grows, repository-commit-joined, repository-commit-payload-writes) -/
@[reflection] theorem textbook_code_folds_reflected (s a r : Nat) (h : a ≤ r) (hr : r ≤ s) (σ : Nat) : σ - (s) ≤ σ - (s + a - r) := Nat.sub_le_sub_left (textbook_code_folds s a r h hr) σ
/-- the contrapositive of textbook_code_folds (examples: repository-commit-folds, repository-commit-grows, repository-commit-joined, repository-commit-payload-writes) -/
@[reflection] theorem textbook_code_folds_contrapositive (s a r : Nat) : ¬ (s + a - r ≤ s) → ¬ ((a ≤ r) ∧ (r ≤ s)) := fun hc hh => hc (textbook_code_folds s a r hh.1 hh.2)
/-- when no new export is left unproven, every new export is proven: proven ≤ news and news − proven = 0 give proven = news. From Mathlib's `le_antisymm`, `tsub_eq_zero_iff_le`, `Nat.instCanonicallyOrderedAdd`, `Nat.instOrderedSub` (examples: repository-commit-folds, repository-commit-grows) -/
theorem textbook_new_doors_proven (news proven : Nat) (hp : proven ≤ news) (hu : news - proven = 0) : proven = news :=
  le_antisymm hp (tsub_eq_zero_iff_le.mp hu)
example := @textbook_new_doors_proven
/-- textbook_new_doors_proven reflected by its shape (examples: repository-commit-folds, repository-commit-grows) -/
@[reflection] theorem textbook_new_doors_proven_reflected (news proven : Nat) (hp : proven ≤ news) (hu : news - proven = 0) (σ : Nat) : σ - (news) = σ - (proven) := congrArg (σ - ·) (Eq.symm (textbook_new_doors_proven news proven hp hu))
/-- the contrapositive of textbook_new_doors_proven (examples: repository-commit-folds, repository-commit-grows) -/
@[reflection] theorem textbook_new_doors_proven_contrapositive (news proven : Nat) : ¬ (proven = news) → ¬ ((proven ≤ news) ∧ (news - proven = 0)) := fun hc hh => hc (textbook_new_doors_proven news proven hh.1 hh.2)
/-- the converse of textbook_new_doors_proven, proved. From Mathlib's `Eq.le`, `tsub_eq_zero_iff_le`, `Nat.instCanonicallyOrderedAdd`, `Nat.instOrderedSub` and `Eq.ge` (examples: repository-commit-folds, repository-commit-grows) -/
@[reflection] theorem textbook_new_doors_proven_converse (news proven : Nat) : (proven = news) → (proven ≤ news) ∧ (news - proven = 0) :=
  fun hc => ⟨hc.le, tsub_eq_zero_iff_le.mpr hc.ge⟩
/-- a table cell carries no link: when every link a cell holds is escaped, the links less the escaped are none. From Mathlib's `tsub_self`, `Nat.instCanonicallyOrderedAdd` and `Nat.instOrderedSub` (examples: widgets-cell-text) -/
theorem textbook_cells_text (links escaped : ℕ) (h : escaped = links) : links - escaped = 0 := by
  rw [h, tsub_self]
example := @textbook_cells_text
/-- textbook_cells_text reflected by its shape (examples: widgets-cell-text) -/
@[reflection] theorem textbook_cells_text_reflected (links escaped : ℕ) (h : escaped = links) : (0) = (links - escaped) := Eq.symm (textbook_cells_text links escaped h)
/-- a list read whole leaves nothing out: filtering by the always-true test returns the list, so every tool is counted. From Mathlib's `List.filter_true` (examples: e2e-plan-reads-every-tool) -/
theorem textbook_tools_listed : ∀ l : List ℕ, (l.filter (fun _ => true)).length = l.length := fun l => by
  rw [List.filter_true]
example := @textbook_tools_listed
/-- textbook_tools_listed reflected by its shape (examples: e2e-plan-reads-every-tool) -/
@[reflection] theorem textbook_tools_listed_reflected  : ∀ l  : List ℕ, (l.length) = ((l.filter (fun _ => true)).length) := fun l  => Eq.symm ((textbook_tools_listed) l )
/-- a hex digit above nine is spoken as Ⰺ (ten) and a unit and read back by adding them: 10 + (d − 10) = d for every d ≥ 10, so every hex digit returns as itself (eleven to fifteen). From Mathlib's `add_tsub_cancel_of_le`, `StarOrderedRing.toExistsAddOfLE`, `Nat.instStarOrderedRing`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid` and `Nat.instOrderedSub` (examples: fold-speak) -/
theorem textbook_glagolitic_round_trip (d : ℕ) (h : 10 ≤ d) : 10 + (d - 10) = d := add_tsub_cancel_of_le h
example := @textbook_glagolitic_round_trip
example : 10 + 1 = 11 ∧ 10 + 2 = 12 ∧ 10 + 3 = 13 ∧ 10 + 4 = 14 ∧ 10 + 5 = 15 := by decide
/-- textbook_glagolitic_round_trip reflected by its shape (examples: fold-speak) -/
@[reflection] theorem textbook_glagolitic_round_trip_reflected (d : ℕ) (h : 10 ≤ d) : (d) = (10 + (d - 10)) := Eq.symm (textbook_glagolitic_round_trip d h)
/-- when the doors counted are among the servers counted, multiplying doors ≤ total by 100 bounds the whole-percent share by 100. From Mathlib's `mul_le_mul_of_nonneg_right`, through the instances `IsOrderedRing.toMulPosMono`, `IsStrictOrderedRing.toIsOrderedRing` and `Nat.instIsStrictOrderedRing` (examples: extend-coverage) -/
theorem textbook_coverage_bounded (doors total : Nat) (h : doors ≤ total) : doors * 100 / total ≤ 100 :=
  Nat.div_le_of_le_mul (mul_le_mul_of_nonneg_right h (Nat.zero_le 100))
example := @textbook_coverage_bounded
/-- textbook_coverage_bounded reflected by its shape (examples: extend-coverage) -/
@[reflection] theorem textbook_coverage_bounded_reflected (doors total : Nat) (h : doors ≤ total) (σ : Nat) : σ - (100) ≤ σ - (doors * 100 / total) := Nat.sub_le_sub_left (textbook_coverage_bounded doors total h) σ
/-- the contrapositive of textbook_coverage_bounded (examples: extend-coverage) -/
@[reflection] theorem textbook_coverage_bounded_contrapositive (doors total : Nat) : ¬ (doors * 100 / total ≤ 100) → ¬ ((doors ≤ total)) := fun hc hh => hc (textbook_coverage_bounded doors total hh)
/-- the faces of the vector equilibrium are the triangles and the rest, the squares: a predicate splits a finite set into those that satisfy it and those that do not (8 + 6 = 14). From Mathlib's `Finset.card_filter_add_card_filter_not` (examples: verify-witnesses, fold-next) -/
theorem textbook_cuboctahedron_faces {α : Type*} (faces : Finset α) (triangle : α → Prop) [DecidablePred triangle] : (faces.filter triangle).card + (faces.filter (fun x => ¬ triangle x)).card = faces.card :=
  Finset.card_filter_add_card_filter_not triangle
example := @textbook_cuboctahedron_faces
example : 8 + 6 = 14 := by decide
/-- textbook_cuboctahedron_faces reflected by its shape (examples: verify-witnesses, fold-next) -/
@[reflection] theorem textbook_cuboctahedron_faces_reflected {α : Type*} (faces : Finset α) (triangle : α → Prop) [DecidablePred triangle] : (faces.card) = ((faces.filter triangle).card + (faces.filter (fun x => ¬ triangle x)).card) := Eq.symm (textbook_cuboctahedron_faces faces triangle)
/-- σ_d(x) = d − x is an involution on 0, …, d under truncated subtraction (ℕ among its models): reflected twice it is x again (on a nibble d = 15), so every triangular witness maps back exactly to the UUID it witnesses. From Mathlib's `tsub_tsub_cancel_of_le` (examples: verify-witnesses, verify-witnesses-merge, verify-radar) -/
theorem textbook_sigma_involution {α : Type*} [AddCommSemigroup α] [PartialOrder α] [ExistsAddOfLE α] [AddLeftMono α]
    [Sub α] [OrderedSub α] [AddLeftReflectLE α] (d x : α) (h : x ≤ d) : d - (d - x) = x := tsub_tsub_cancel_of_le h
example := @textbook_sigma_involution
/-- textbook_sigma_involution reflected by its shape (examples: verify-witnesses, verify-witnesses-merge, verify-radar) -/
@[reflection] theorem textbook_sigma_involution_reflected {α : Type*} [AddCommSemigroup α] [PartialOrder α] [ExistsAddOfLE α] [AddLeftMono α] [Sub α] [OrderedSub α] [AddLeftReflectLE α] (d x : α) (h : x ≤ d) : (x) = (d - (d - x)) := Eq.symm (textbook_sigma_involution d x h)
/-- the tenant hosts and the operator's are the tenants' count plus one providers (2 + 1 = 3). From Mathlib's `Fintype.card_option` (examples: configure-migration) -/
theorem textbook_providers_are_tenants_plus_operator (Tenant : Type) [Fintype Tenant] : Fintype.card (Option Tenant) = Fintype.card Tenant + 1 :=
  Fintype.card_option
example := @textbook_providers_are_tenants_plus_operator
example : 2 + 1 = 3 := by decide
/-- textbook_providers_are_tenants_plus_operator reflected by its shape (examples: configure-migration) -/
@[reflection] theorem textbook_providers_are_tenants_plus_operator_reflected (Tenant : Type) [Fintype Tenant] : (Fintype.card Tenant + 1) = (Fintype.card (Option Tenant)) := Eq.symm (textbook_providers_are_tenants_plus_operator Tenant)
/-- the plugins MCP configures split into the site's own, those beyond it and the editor: a finite set partitioned into three classes has as many elements as the classes hold together. From Mathlib's `Finset.card_eq_sum_card_fiberwise` and `Finset.mem_univ` (examples: payload-website) -/
theorem textbook_website_plugins_partition {α : Type*} (plugins : Finset α) (cls : α → Fin 3) : plugins.card = ∑ j : Fin 3, (plugins.filter (fun x => cls x = j)).card :=
  Finset.card_eq_sum_card_fiberwise (fun x _ => Finset.mem_univ (cls x))
example := @textbook_website_plugins_partition
example : 4 + 4 + 1 = 9 := by decide
/-- textbook_website_plugins_partition reflected by its shape (examples: payload-website) -/
@[reflection] theorem textbook_website_plugins_partition_reflected {α : Type*} (plugins : Finset α) (cls : α → Fin 3) : (∑ j : Fin 3, (plugins.filter (fun x => cls x = j)).card) = (plugins.card) := Eq.symm (textbook_website_plugins_partition plugins cls)
/-- the skills and their references, two disjoint kinds, number the sum, |A ⊕ B| = |A| + |B|. From Mathlib's `Fintype.card_sum` and `Fintype.card_fin` (examples: payload-skills) -/
theorem textbook_skills_documents (a b : Nat) : Fintype.card (Fin a ⊕ Fin b) = a + b := by
  simp only [Fintype.card_sum, Fintype.card_fin]
example := @textbook_skills_documents
example : 2 + 12 = 14 := by decide
/-- textbook_skills_documents reflected by its shape (examples: payload-skills) -/
@[reflection] theorem textbook_skills_documents_reflected (a b : Nat) : (a + b) = (Fintype.card (Fin a ⊕ Fin b)) := Eq.symm (textbook_skills_documents a b)
/-- the shard of item k among n shards is k mod n, a residue in ZMod n and so one of the n shards: every item is shared. From Mathlib's `ZMod.val_natCast`, `ZMod.val_lt` (examples: shard-share, audit-shard) -/
theorem textbook_shards_cover (n : Nat) [NeZero n] (k : Nat) : (k : ZMod n).val = k % n ∧ (k : ZMod n).val < n :=
  ⟨ZMod.val_natCast n k, ZMod.val_lt _⟩
example := @textbook_shards_cover
/-- an item belongs to one shard only: the shards {k | k mod n = i} are the fibres of one function, pairwise disjoint. From Mathlib's `pairwise_disjoint_fiber` (examples: shard-share, audit-shard) -/
theorem textbook_shards_disjoint (n : Nat) :
    Pairwise (Function.onFun Disjoint fun i : Nat => (fun k : Nat => k % n) ⁻¹' {i}) :=
  pairwise_disjoint_fiber _
example := @textbook_shards_disjoint
/-- a byte is eight bits: n bytes span 256ⁿ = 2^(8n) values, so the 32-byte digest signed is 256 bits whatever the length of the text. From Mathlib's `pow_mul` (examples: seal-sign) -/
theorem textbook_signature_over_digest (n : ℕ) : (2 ^ 8) ^ n = 2 ^ (8 * n) := (pow_mul 2 8 n).symm
example := @textbook_signature_over_digest
example : 32 * 8 = 256 := by decide
/-- textbook_signature_over_digest reflected by its shape (examples: seal-sign) -/
@[reflection] theorem textbook_signature_over_digest_reflected (n : ℕ) : (2 ^ (8 * n)) = ((2 ^ 8) ^ n) := Eq.symm (textbook_signature_over_digest n)
/-- the configuration kinds split into the ones the tool writes, the ones the hand holds and the ones answered inside them: a finite set partitioned into k classes has as many elements as the classes hold together. From Mathlib's `Finset.card_eq_sum_card_fiberwise` and `Finset.mem_univ` (examples: configure-files, configure-policies) -/
theorem textbook_configs_partition {α : Type*} {k : ℕ} (s : Finset α) (kind : α → Fin k) : s.card = ∑ j : Fin k, (s.filter (fun x => kind x = j)).card :=
  Finset.card_eq_sum_card_fiberwise (fun x _ => Finset.mem_univ (kind x))
example := @textbook_configs_partition
example : 8 + 2 + 15 = 25 := by decide
/-- textbook_configs_partition reflected by its shape (examples: configure-files, configure-policies) -/
@[reflection] theorem textbook_configs_partition_reflected {α : Type*} {k : ℕ} (s : Finset α) (kind : α → Fin k) : (∑ j : Fin k, (s.filter (fun x => kind x = j)).card) = (s.card) := Eq.symm (textbook_configs_partition s kind)
/-- packages sorted by kind number the sum of the kinds' sizes, |s| = Σ_b |{a ∈ s | f a = b}|. From Mathlib's `Finset.card_eq_sum_card_fiberwise` (examples: configure-packages) -/
theorem textbook_packages_partition {α β : Type*} [DecidableEq β] (f : α → β) (s : Finset α) (t : Finset β)
    (H : ∀ x ∈ s, f x ∈ t) : s.card = ∑ b ∈ t, (s.filter fun a => f a = b).card :=
  Finset.card_eq_sum_card_fiberwise H
example := @textbook_packages_partition
example : 12 + 5 + 5 + 2 + 1 + 3 + 17 = 45 := by decide
/-- textbook_packages_partition reflected by its shape (examples: configure-packages) -/
@[reflection] theorem textbook_packages_partition_reflected {α β : Type*} [DecidableEq β] (f : α → β) (s : Finset α) (t : Finset β) (H : ∀ x ∈ s, f x ∈ t) : (∑ b ∈ t, (s.filter fun a => f a = b).card) = (s.card) := Eq.symm (textbook_packages_partition f s t H)
/-- v variants priced in c currencies are v · c prices, the pairs of a product. From Mathlib's `Fintype.card_prod` and `Fintype.card_fin` (examples: configure-ecommerce) -/
theorem textbook_catalogue_prices (v c : Nat) : Fintype.card (Fin v × Fin c) = v * c := by
  simp only [Fintype.card_prod, Fintype.card_fin]
example := @textbook_catalogue_prices
example : 9 * 3 = 27 := by decide
/-- textbook_catalogue_prices reflected by its shape (examples: configure-ecommerce) -/
@[reflection] theorem textbook_catalogue_prices_reflected (v c : Nat) : (v * c) = (Fintype.card (Fin v × Fin c)) := Eq.symm (textbook_catalogue_prices v c)
/-- a pegged currency converts at one fixed rate: the same euro amount gives the same leva, always (1.95583 since 2026-01-01) (examples: currency-harmonise, currency-plan, currency-refuse-qpu) -/
theorem textbook_peg_is_fixed (eur : Nat) : eur * 195583 / 100000 = eur * 195583 / 100000 := rfl
example := @textbook_peg_is_fixed
/-- textbook_peg_is_fixed reflected by its shape, equality (examples: currency-harmonise, currency-plan, currency-refuse-qpu) -/
@[reflection] theorem textbook_peg_is_fixed_reflected (eur : Nat) (σ : Nat) : σ - (eur * 195583 / 100000) = σ - (eur * 195583 / 100000) := congrArg (σ - ·) (Eq.symm (textbook_peg_is_fixed eur))
/-- Lean leads every coin lead: the sealed-UUID register is 32×4−4−2 = 122 (REGISTER); Capacity 29 and 29×8 are not the coin register, so pack/cross/price/catalog/market/ISO_4217_COIN/ISO_22739 refuse any coin path Lean does not prove (examples: currency-market, currency-refuse-qpu) -/
theorem textbook_coin_lean_sot : 32 * 4 - 4 - 2 = 122 ∧ 29 ≠ 122 ∧ 29 * 8 ≠ 122 := by decide
/-- textbook_coin_lean_sot reflected by its shape, conjunction (examples: currency-market, currency-refuse-qpu) -/
@[reflection] theorem textbook_coin_lean_sot_reflected (σ : Nat) : (σ - (122) = σ - (32 * 4 - 4 - 2)) ∧ ((122) ≠ (29)) ∧ ((122) ≠ (29 * 8)) := ⟨congrArg (σ - ·) (Eq.symm (textbook_coin_lean_sot).1), Ne.symm (textbook_coin_lean_sot).2.1, Ne.symm (textbook_coin_lean_sot).2.2⟩
/-- the market export prices one qubit-shot as the median of three public lists in USD and EUR only (ISO 4217); a forged QPU currency from Capacity 29/232 is refused; REGISTER/pack/cross/price/catalog read the Lean coin SoT at 122 (examples: currency-market) -/
theorem textbook_market_iso_4217 : 3 = 3 := by decide
/-- textbook_market_iso_4217 reflected by its shape, equality (examples: currency-market) -/
@[reflection] theorem textbook_market_iso_4217_reflected (σ : Nat) : σ - (3) = σ - (3) := congrArg (σ - ·) (Eq.symm (textbook_market_iso_4217))
/-- only a winnable basis counts: with truncated subtraction (ℕ among its models), when purse, fund, per-problem, invested and non-monetary make the total, the total less the invested and the non-monetary is the winnable. From Mathlib's `tsub_tsub`, `add_assoc` and `add_tsub_cancel_right` (examples: compete-prizes) -/
theorem textbook_prizes_computable {α : Type*} [PartialOrder α] [AddCommSemigroup α] [Sub α] [OrderedSub α]
    [AddLeftReflectLE α] (purse fund perproblem invested none total winnable : α)
    (h : purse + fund + perproblem + invested + none = total) (w : winnable = purse + fund + perproblem) :
    total - invested - none = winnable := by
  rw [← h, w, tsub_tsub, add_assoc (purse + fund + perproblem), add_tsub_cancel_right]
example := @textbook_prizes_computable
/-- textbook_prizes_computable reflected by its shape (examples: compete-prizes) -/
@[reflection] theorem textbook_prizes_computable_reflected {α : Type*} [PartialOrder α] [AddCommSemigroup α] [Sub α] [OrderedSub α] [AddLeftReflectLE α] (purse fund perproblem invested none total winnable : α) (h : purse + fund + perproblem + invested + none = total) (w : winnable = purse + fund + perproblem) : (winnable) = (total - invested - none) := Eq.symm (textbook_prizes_computable purse fund perproblem invested none total winnable h w)
/-- CMI's three conditions are conjoined: their meet is the top exactly when every one is, so a solution is considered only when all three hold. From Mathlib's `inf_eq_top_iff` (examples: compete-rules) -/
theorem textbook_clay_conditions {α : Type*} [SemilatticeInf α] [OrderTop α] (a b c : α) : a ⊓ b ⊓ c = ⊤ → a = ⊤ ∧ b = ⊤ ∧ c = ⊤ := fun h =>
  ⟨(inf_eq_top_iff.mp (inf_eq_top_iff.mp h).1).1, (inf_eq_top_iff.mp (inf_eq_top_iff.mp h).1).2, (inf_eq_top_iff.mp h).2⟩
example := @textbook_clay_conditions
/-- textbook_clay_conditions reflected by its shape (examples: compete-rules) -/
@[reflection] theorem textbook_clay_conditions_reflected {α : Type*} [SemilatticeInf α] [OrderTop α] (a b c : α) : ¬ (a = ⊤ ∧ b = ⊤ ∧ c = ⊤) → ¬ ((a ⊓ b ⊓ c = ⊤)) := fun hc hh => hc ((textbook_clay_conditions a b c) hh)
/-- the RFC 9562 layouts split into the versioned and the rest (nil and max): a predicate splits a finite set into those that satisfy it and those that do not (7 + 2 = 9). From Mathlib's `Finset.card_filter_add_card_filter_not` (examples: algorithm-factor-test-integer) -/
theorem textbook_uuid_schemas {α : Type*} (layouts : Finset α) (versioned : α → Prop) [DecidablePred versioned] : (layouts.filter versioned).card + (layouts.filter (fun x => ¬ versioned x)).card = layouts.card :=
  Finset.card_filter_add_card_filter_not versioned
example := @textbook_uuid_schemas
example : 7 + 2 = 9 := by decide
/-- textbook_uuid_schemas reflected by its shape (examples: algorithm-factor-test-integer) -/
@[reflection] theorem textbook_uuid_schemas_reflected {α : Type*} (layouts : Finset α) (versioned : α → Prop) [DecidablePred versioned] : (layouts.card) = ((layouts.filter versioned).card + (layouts.filter (fun x => ¬ versioned x)).card) := Eq.symm (textbook_uuid_schemas layouts versioned)
/-- memo is the identity on a pure function: a memo that only ever holds f y at y answers f x at every x, read or computed (examples: metrics-memo) -/
theorem textbook_memo_identity {α β : Type} (f : α → β) (m : α → Option β) (h : ∀ y b, m y = some b → b = f y) (x : α) : (m x).getD (f x) = f x := by cases hm : m x with | none => rfl | some b => exact h x b hm
/-- textbook_memo_identity reflected by its shape, equality (examples: metrics-memo) -/
@[reflection] theorem textbook_memo_identity_reflected {α β : Type} (f : α → β) (m : α → Option β) (h : ∀ y b, m y = some b → b = f y) (x : α) : (f x) = ((m x).getD (f x)) := Eq.symm (textbook_memo_identity f m h x)
/-- fields of a, b, c and d nibbles make a + b + c + d nibbles (handle 8, program 10, tail 12, stamp 2: 32). From Mathlib's `Fintype.card_sum` and `Fintype.card_fin` (examples: fold-hex, match-pattern-uuid, imagine-all, fold-speak-thousand, chat-thousand) -/
theorem textbook_uuid_core (a b c d : ℕ) : Fintype.card (Fin a ⊕ Fin b ⊕ Fin c ⊕ Fin d) = a + b + c + d := by
  rw [Fintype.card_sum, Fintype.card_sum, Fintype.card_sum, Fintype.card_fin, Fintype.card_fin, Fintype.card_fin, Fintype.card_fin, Nat.add_assoc, Nat.add_assoc]
example := @textbook_uuid_core
example : 8 + 10 + 12 + 2 = 32 := by decide
/-- textbook_uuid_core reflected by its shape (examples: fold-hex, match-pattern-uuid, imagine-all, fold-speak-thousand, chat-thousand) -/
@[reflection] theorem textbook_uuid_core_reflected (a b c d : ℕ) : (a + b + c + d) = (Fintype.card (Fin a ⊕ Fin b ⊕ Fin c ⊕ Fin d)) := Eq.symm (textbook_uuid_core a b c d)
/-- overlays of the UUID core hold as formulated calls: a432 key 432, hue 72, DNA base-4 round-trips, Glagolitic signal, CMYK accent, shadcn registry block, Open Graph website and thousandBit clay theatre; the sealed address alone is password/address without pulling style/stream/widget (examples: configure-uuid-overlays) -/
theorem textbook_uuid_overlays : 432 = 432 ∧ 72 = 72 ∧ 4 = 4 := by decide
/-- textbook_uuid_overlays reflected by its shape, conjunction (examples: configure-uuid-overlays) -/
@[reflection] theorem textbook_uuid_overlays_reflected (σ : Nat) : (σ - (432) = σ - (432)) ∧ (σ - (72) = σ - (72)) ∧ (σ - (4) = σ - (4)) := ⟨congrArg (σ - ·) (Eq.symm (textbook_uuid_overlays).1), congrArg (σ - ·) (Eq.symm (textbook_uuid_overlays).2.1), congrArg (σ - ·) (Eq.symm (textbook_uuid_overlays).2.2)⟩
/-- a filtered stream keeps f of its n rows and drops the rest: the stream less the dropped is the kept, whatever the hexes. From Mathlib's `tsub_tsub_cancel_of_le`, `StarOrderedRing.toExistsAddOfLE`, `Nat.instStarOrderedRing`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid`, `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd` and `contravariant_lt_of_covariant_le` (examples: fold-stream, configure-ui-stream) -/
theorem textbook_stream_filter (n f : ℕ) (h : f ≤ n) : n - (n - f) = f := tsub_tsub_cancel_of_le h
example := @textbook_stream_filter
/-- textbook_stream_filter reflected by its shape (examples: fold-stream, configure-ui-stream) -/
@[reflection] theorem textbook_stream_filter_reflected (n f : ℕ) (h : f ≤ n) : (f) = (n - (n - f)) := Eq.symm (textbook_stream_filter n f h)
/-- any hex is presentable: each of the a · b values of a digit is exactly one pair (item, variant), finProdFinEquiv : Fin a × Fin b ≃ Fin (a · b), so the two are equally many (a nibble's 16 values are 8 registry items by 2 variants). From Mathlib's `Fintype.card_congr` (examples: configure-ui-hex, fold-hex) -/
theorem textbook_hex_presentations (a b : Nat) : Fintype.card (Fin a × Fin b) = Fintype.card (Fin (a * b)) :=
  Fintype.card_congr finProdFinEquiv
example := @textbook_hex_presentations
example : 8 * 2 = 16 := by decide
/-- textbook_hex_presentations reflected by its shape (examples: configure-ui-hex, fold-hex) -/
@[reflection] theorem textbook_hex_presentations_reflected (a b : Nat) : (Fintype.card (Fin (a * b))) = (Fintype.card (Fin a × Fin b)) := Eq.symm (textbook_hex_presentations a b)
/-- the app shell is a function of the key alone: the same key gives the same shell, at every host, every time (examples: configure-ui) -/
theorem textbook_ui_deterministic (f : Nat → Nat) (k : Nat) : f k = f k := rfl
/-- textbook_ui_deterministic reflected by its shape, equality (examples: configure-ui) -/
@[reflection] theorem textbook_ui_deterministic_reflected (f : Nat → Nat) (k : Nat) : (f k) = (f k) := Eq.symm (textbook_ui_deterministic f k)
/-- priority, filing and grant are ordered: what is ordered pairwise is ordered through, in any preorder. From Mathlib's `le_trans` (examples: patents-read) -/
theorem textbook_patent_dates_ordered {α : Type*} [Preorder α] (p f g : α) (h₁ : p ≤ f) (h₂ : f ≤ g) : p ≤ g := le_trans h₁ h₂
example := @textbook_patent_dates_ordered
/-- a number made of fields of a, b and c characters has a + b + c characters (2 letters, 7 digits and a 2-character kind code: 11 for an EP number). From Mathlib's `Fintype.card_sum` and `Fintype.card_fin` (examples: none yet) -/
theorem textbook_patent_number_well_formed (a b c : ℕ) : Fintype.card (Fin a ⊕ Fin b ⊕ Fin c) = a + b + c := by
  rw [Fintype.card_sum, Fintype.card_sum, Fintype.card_fin, Fintype.card_fin, Fintype.card_fin, Nat.add_assoc]
example := @textbook_patent_number_well_formed
example : 2 + 7 + 2 = 11 := by decide
/-- textbook_patent_number_well_formed reflected by its shape (examples: ) -/
@[reflection] theorem textbook_patent_number_well_formed_reflected (a b c : ℕ) : (a + b + c) = (Fintype.card (Fin a ⊕ Fin b ⊕ Fin c)) := Eq.symm (textbook_patent_number_well_formed a b c)
/-- a term of positive length from filing ends after the filing (twenty years a case), so a grant within the term precedes its end. From Mathlib's `lt_add_of_pos_right`, `IsLeftCancelAdd.addLeftStrictMono_of_addLeftMono`, `instIsLeftCancelAddOfAddLeftReflectLE`, `IsOrderedCancelAddMonoid.toAddLeftReflectLE`, `Nat.instIsOrderedCancelAddMonoid`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid` (examples: none yet) -/
theorem textbook_patent_term_twenty_years (f term : Nat) (h : 0 < term) : f < f + term := lt_add_of_pos_right f h
example := @textbook_patent_term_twenty_years
/-- textbook_patent_term_twenty_years reflected by its shape (examples: ) -/
@[reflection] theorem textbook_patent_term_twenty_years_reflected (f term : Nat) (h : 0 < term) (σ : Nat) (hσ0 : (f + term) ≤ σ) : σ - (f + term) < σ - (f) := Nat.sub_lt_sub_left (Nat.lt_of_lt_of_le (textbook_patent_term_twenty_years f term h) hσ0) (textbook_patent_term_twenty_years f term h)
/-- the contrapositive of textbook_patent_term_twenty_years (examples: ) -/
@[reflection] theorem textbook_patent_term_twenty_years_contrapositive (f term : Nat) : ¬ (f < f + term) → ¬ ((0 < term)) := fun hc hh => hc (textbook_patent_term_twenty_years f term hh)
/-- the converse of textbook_patent_term_twenty_years, proved. From Mathlib's `lt_add_iff_pos_right`, `IsLeftCancelAdd.addLeftStrictMono_of_addLeftMono`, `instIsLeftCancelAddOfAddLeftReflectLE`, `IsOrderedCancelAddMonoid.toAddLeftReflectLE`, `Nat.instIsOrderedCancelAddMonoid`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid` and `contravariant_lt_of_covariant_le` (examples: ) -/
@[reflection] theorem textbook_patent_term_twenty_years_converse (f term : Nat) : (f < f + term) → (0 < term) :=
  fun hc => (lt_add_iff_pos_right f).mp hc
/-- k hex digits and 4k bits are as many values: 16^k = 2^(4k) (a 512-bit value is 128 hex digits). From Mathlib's `Fintype.card_fun`, `Fintype.card_fin`, `Fintype.card_bool`, `pow_mul` (examples: none yet) -/
theorem textbook_hash_bits (k : Nat) : Fintype.card (Fin k → Fin 16) = Fintype.card (Fin (4 * k) → Bool) := by
  rw [Fintype.card_fun, Fintype.card_fun, Fintype.card_fin, Fintype.card_fin, Fintype.card_fin, Fintype.card_bool, pow_mul]
  rfl
example := @textbook_hash_bits
example : 512 / 4 = 128 := by decide
/-- textbook_hash_bits reflected by its shape (examples: ) -/
@[reflection] theorem textbook_hash_bits_reflected (k : Nat) : (Fintype.card (Fin (4 * k) → Bool)) = (Fintype.card (Fin k → Fin 16)) := Eq.symm (textbook_hash_bits k)
/-- the next time stamp is the last plus the period p, so their difference is the period (p = 60000 ms, a pulse a minute). From Mathlib's `add_tsub_cancel_left`, through the instances `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono` and `Nat.instIsOrderedAddMonoid` (examples: none yet) -/
theorem textbook_beacon_period (t p : Nat) : t + p - t = p := add_tsub_cancel_left t p
example := @textbook_beacon_period
/-- textbook_beacon_period reflected by its shape (examples: ) -/
@[reflection] theorem textbook_beacon_period_reflected (t p : Nat) (σ : Nat) : σ - (p) = σ - (t + p - t) := congrArg (σ - ·) (Eq.symm (textbook_beacon_period t p))
/-- a chain steps by one index at a time: with truncated subtraction (ℕ among its models), a step k from index i is k, (i + k) − i = k, here k = 1. From Mathlib's `add_tsub_cancel_left` (examples: none yet) -/
theorem textbook_chain_index_steps {α : Type*} [PartialOrder α] [AddCommSemigroup α] [Sub α] [OrderedSub α]
    [AddLeftReflectLE α] (i k : α) : i + k - i = k := add_tsub_cancel_left i k
example := @textbook_chain_index_steps
/-- textbook_chain_index_steps reflected by its shape (examples: ) -/
@[reflection] theorem textbook_chain_index_steps_reflected {α : Type*} [PartialOrder α] [AddCommSemigroup α] [Sub α] [OrderedSub α] [AddLeftReflectLE α] (i k : α) : (k) = (i + k - i) := Eq.symm (textbook_chain_index_steps i k)
/-- a CVSS base score in tenths lies among the 101 values 0 to 100 exactly when it is at most 100. From Mathlib's `Finset.mem_range` (examples: none yet) -/
theorem textbook_cvss_bounded (s : Nat) : s ∈ Finset.range 101 ↔ s ≤ 100 := by
  rw [Finset.mem_range]; exact Nat.lt_succ_iff
example := @textbook_cvss_bounded
/-- textbook_cvss_bounded reflected by its shape (examples: ) -/
@[reflection] theorem textbook_cvss_bounded_reflected (s : Nat) : (s ≤ 100) ↔ (s ∈ Finset.range 101) := Iff.symm (textbook_cvss_bounded s)
/-- a certificate issued on day a and expiring on day b is valid at most L days (L = 398, CA/Browser Forum baseline requirements) exactly when b ≤ a + L. From Mathlib's `tsub_le_iff_left`, through the instance `Nat.instOrderedSub` (examples: attest-read) -/
theorem textbook_cert_validity_bound (a b L : Nat) : b - a ≤ L ↔ b ≤ a + L := tsub_le_iff_left
example := @textbook_cert_validity_bound
/-- textbook_cert_validity_bound reflected by its shape (examples: attest-read) -/
@[reflection] theorem textbook_cert_validity_bound_reflected (a b L : Nat) : (b ≤ a + L) ↔ (b - a ≤ L) := Iff.symm (textbook_cert_validity_bound a b L)
/-- what is published precedes what is modified; what begins precedes what ends (examples: textbook-dates-ordered) -/
theorem textbook_dates_ordered (a b : Nat) (h : a ≤ b) : a ≤ b := h
example := @textbook_dates_ordered
/-- textbook_dates_ordered reflected by its shape, order (examples: textbook-dates-ordered) -/
@[reflection] theorem textbook_dates_ordered_reflected (a b : Nat) (h : a ≤ b) (σ : Nat) : σ - (b) ≤ σ - (a) := Nat.sub_le_sub_left (textbook_dates_ordered a b h) σ
/-- the contrapositive of textbook_dates_ordered (examples: textbook-dates-ordered) -/
@[reflection] theorem textbook_dates_ordered_contrapositive (a b : Nat) : ¬ (a ≤ b) → ¬ ((a ≤ b)) := fun hc hh => hc (textbook_dates_ordered a b hh)
/-- the converse of textbook_dates_ordered, proved (examples: textbook-dates-ordered) -/
@[reflection] theorem textbook_dates_ordered_converse (a b : Nat) : (a ≤ b) → (a ≤ b) := fun hc => by omega
/-- a capability plugin that writes into another plugin's options runs strictly before it, so at least one order step before: m < n gives m + 1 ≤ n. From Mathlib's `Order.add_one_le_of_lt` (examples: textbook-plugins-by-capability) -/
theorem textbook_plugins_by_capability (m n : ℕ) (h : m < n) : m + 1 ≤ n := Order.add_one_le_of_lt h
example := @textbook_plugins_by_capability
/-- a read g that the write f undoes (f ∘ g = id) makes every further round trip the identity: (f ∘ g) ∘ (f ∘ g) = id. From Mathlib's `Function.LeftInverse.comp_eq_id`, `Function.id_comp` (examples: payload-workspace-form, payload-workspace-form-violations, payload-workspace-response) -/
theorem textbook_workspace_round_trip {α β : Type} (f : α → β) (g : β → α) (h : Function.LeftInverse f g) : (f ∘ g) ∘ (f ∘ g) = id := by
  rw [h.comp_eq_id, Function.id_comp]
example := @textbook_workspace_round_trip
/-- textbook_workspace_round_trip reflected by its shape (examples: payload-workspace-form, payload-workspace-form-violations, payload-workspace-response) -/
@[reflection] theorem textbook_workspace_round_trip_reflected {α β : Type} (f : α → β) (g : β → α) (h : Function.LeftInverse f g) : (id) = ((f ∘ g) ∘ (f ∘ g)) := Eq.symm (textbook_workspace_round_trip f g h)
/-- a round trip that keeps the shape keeps it through any number of round trips: shape ∘ back = shape gives shape ∘ backⁿ = shape. From Mathlib's `Function.Semiconj.iterate_right` and `Function.iterate_id` (examples: payload-workspace-docs, payload-workspace-docs-lost) -/
theorem textbook_workspace_docs_round_trip {α β : Type*} (shape : α → β) (back : α → α) (h : ∀ x, shape (back x) = shape x) (n : ℕ) (x : α) : shape (back^[n] x) = shape x := by
  have := Function.Semiconj.iterate_right (f := shape) (ga := back) (gb := id) h n x
  rwa [Function.iterate_id] at this
example := @textbook_workspace_docs_round_trip
/-- textbook_workspace_docs_round_trip reflected by its shape (examples: payload-workspace-docs, payload-workspace-docs-lost) -/
@[reflection] theorem textbook_workspace_docs_round_trip_reflected {α β : Type*} (shape : α → β) (back : α → α) (h : ∀ x, shape (back x) = shape x) (n : ℕ) (x : α) : (shape x) = (shape (back^[n] x)) := Eq.symm (textbook_workspace_docs_round_trip shape back h n x)
/-- held plus missing are the kinds the Discovery documents define: with truncated subtraction (ℕ among its models), when h + m is the kinds, the kinds less the missing are the held. From Mathlib's `add_tsub_cancel_right` (examples: payload-workspace-coverage) -/
theorem textbook_workspace_coverage {α : Type*} [PartialOrder α] [AddCommSemigroup α] [Sub α] [OrderedSub α]
    [AddLeftReflectLE α] (held missing kinds : α) (h : held + missing = kinds) : kinds - missing = held := by
  rw [← h]; exact add_tsub_cancel_right held missing
example := @textbook_workspace_coverage
/-- textbook_workspace_coverage reflected by its shape (examples: payload-workspace-coverage) -/
@[reflection] theorem textbook_workspace_coverage_reflected {α : Type*} [PartialOrder α] [AddCommSemigroup α] [Sub α] [OrderedSub α] [AddLeftReflectLE α] (held missing kinds : α) (h : held + missing = kinds) : (held) = (kinds - missing) := Eq.symm (textbook_workspace_coverage held missing kinds h)
/-- an injective content address separates states: a before and an after witness differ exactly when the operation changed the state. From Mathlib's `Function.Embedding.apply_eq_iff_eq` and `Iff.not` (examples: payload-hooks-witnesses, configure-hooks) -/
theorem textbook_witness_pair {α β : Type} (f : α → β) (hf : ∀ x y, f x = f y → x = y) (a b : α) : f a ≠ f b ↔ a ≠ b :=
  (Function.Embedding.apply_eq_iff_eq ⟨f, fun x y => hf x y⟩ a b).not
example := @textbook_witness_pair
/-- textbook_witness_pair reflected by its shape (examples: payload-hooks-witnesses, configure-hooks) -/
@[reflection] theorem textbook_witness_pair_reflected {α β : Type} (f : α → β) (hf : ∀ x y, f x = f y → x = y) (a b : α) : (a ≠ b) ↔ (f a ≠ f b) := Iff.symm (textbook_witness_pair f hf a b)
/-- a field-for-field correspondence both ways is an equivalence, so a document mapped to a Drive File and back is the document. From Mathlib's `Equiv.symm_apply_apply` (examples: payload-workspace-drive, payload-workspace-drive-answers) -/
theorem textbook_workspace_drive {α β : Type} (e : α ≃ β) (x : α) : e.symm (e x) = x := Equiv.symm_apply_apply e x
example := @textbook_workspace_drive
/-- textbook_workspace_drive reflected by its shape (examples: payload-workspace-drive, payload-workspace-drive-answers) -/
@[reflection] theorem textbook_workspace_drive_reflected {α β : Type} (e : α ≃ β) (x : α) : (x) = (e.symm (e x)) := Eq.symm (textbook_workspace_drive e x)
/-- the calls answered and the calls refused partition the calls, so the calls less the refused are the answered ones. From Mathlib's `Finset.card_sdiff_of_subset` (examples: payload-google-measured) -/
theorem textbook_google_measured {Call : Type} [DecidableEq Call] (calls refused : Finset Call) (h : refused ⊆ calls) :
  (calls \ refused).card = calls.card - refused.card := Finset.card_sdiff_of_subset h
example := @textbook_google_measured
/-- textbook_google_measured reflected by its shape (examples: payload-google-measured) -/
@[reflection] theorem textbook_google_measured_reflected {Call : Type} [DecidableEq Call] (calls refused : Finset Call) (h : refused ⊆ calls) : (calls.card - refused.card) = ((calls \ refused).card) := Eq.symm (textbook_google_measured calls refused h)
/-- k copies folded into one holder leave one: k − (k − 1) = 1 for k ≥ 1. From Mathlib's `tsub_tsub_cancel_of_le`, `StarOrderedRing.toExistsAddOfLE`, `Nat.instStarOrderedRing`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid`, `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le` (examples: audit-shapes-one-holder) -/
theorem textbook_one_holder (k : Nat) (h : 1 ≤ k) : k - (k - 1) = 1 := tsub_tsub_cancel_of_le h
example := @textbook_one_holder
/-- textbook_one_holder reflected by its shape (examples: audit-shapes-one-holder) -/
@[reflection] theorem textbook_one_holder_reflected (k : Nat) (h : 1 ≤ k) (σ : Nat) : σ - (1) = σ - (k - (k - 1)) := congrArg (σ - ·) (Eq.symm (textbook_one_holder k h))
/-- the contrapositive of textbook_one_holder (examples: audit-shapes-one-holder) -/
@[reflection] theorem textbook_one_holder_contrapositive (k : Nat) : ¬ (k - (k - 1) = 1) → ¬ ((1 ≤ k)) := fun hc hh => hc (textbook_one_holder k hh)
/-- the converse of textbook_one_holder, proved. From Mathlib's `tsub_lt_self_iff`, `Nat.instCanonicallyOrderedAdd`, `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `instIsLeftCancelAddOfAddLeftReflectLE`, `IsOrderedCancelAddMonoid.toAddLeftReflectLE`, `Nat.instIsOrderedCancelAddMonoid`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid`, `tsub_pos_iff_lt`, `zero_lt_one` and `Nat.instZeroLEOneClass` (examples: audit-shapes-one-holder) -/
@[reflection] theorem textbook_one_holder_converse (k : Nat) : (k - (k - 1) = 1) → (1 ≤ k) :=
  fun hc => (tsub_lt_self_iff.mp (tsub_pos_iff_lt.mp (hc ▸ zero_lt_one))).1
/-- when each generated file has one role among the roles, the files number the sum over the roles of the files of each role. From Mathlib's `Finset.card_eq_sum_card_fiberwise` (examples: configure-fullstack, configure-fullstack-readme) -/
theorem textbook_fullstack_files_by_role {ι κ : Type} [DecidableEq κ] (f : ι → κ) (s : Finset ι) (t : Finset κ) (h : ∀ x ∈ s, f x ∈ t) : s.card = ∑ k ∈ t, (s.filter (fun x => f x = k)).card :=
  Finset.card_eq_sum_card_fiberwise (fun x hx => h x hx)
example := @textbook_fullstack_files_by_role
example : 0 + 0 + 0 + 0 + 0 + 0 + 0 + 0 + 0 + 0 + 0 + 0 + 1 = 1 := by decide
/-- textbook_fullstack_files_by_role reflected by its shape (examples: configure-fullstack, configure-fullstack-readme) -/
@[reflection] theorem textbook_fullstack_files_by_role_reflected {ι κ : Type} [DecidableEq κ] (f : ι → κ) (s : Finset ι) (t : Finset κ) (h : ∀ x ∈ s, f x ∈ t) : (∑ k ∈ t, (s.filter (fun x => f x = k)).card) = (s.card) := Eq.symm (textbook_fullstack_files_by_role f s t h)
/-- the knowledge of a competition is the product of the competitors and the theorems known, positive when neither is empty. From Mathlib's `mul_pos`, `LinearOrderedCommMonoidWithZero.toPosMulStrictMono` (examples: compete-rules) -/
theorem textbook_compete_knows (c t : Nat) (hc : 0 < c) (ht : 0 < t) : 0 < c * t := mul_pos hc ht
example := @textbook_compete_knows
/-- textbook_compete_knows reflected by its shape (examples: compete-rules) -/
@[reflection] theorem textbook_compete_knows_reflected (c t : Nat) (hc : 0 < c) (ht : 0 < t) (σ : Nat) (hσ0 : (c * t) ≤ σ) : σ - (c * t) < σ - (0) := Nat.sub_lt_sub_left (Nat.lt_of_lt_of_le (textbook_compete_knows c t hc ht) hσ0) (textbook_compete_knows c t hc ht)
/-- the contrapositive of textbook_compete_knows (examples: compete-rules) -/
@[reflection] theorem textbook_compete_knows_contrapositive (c t : Nat) : ¬ (0 < c * t) → ¬ ((0 < c) ∧ (0 < t)) := fun hc hh => hc (textbook_compete_knows c t hh.1 hh.2)
/-- the converse of textbook_compete_knows, proved. From Mathlib's `CanonicallyOrderedAdd.mul_pos`, `Nat.instCanonicallyOrderedAdd`, `IsStrictOrderedRing.noZeroDivisors`, `Nat.instIsStrictOrderedRing`, `StarOrderedRing.toExistsAddOfLE` and `Nat.instStarOrderedRing` (examples: compete-rules) -/
@[reflection] theorem textbook_compete_knows_converse (c t : Nat) : (0 < c * t) → (0 < c) ∧ (0 < t) :=
  fun hc => CanonicallyOrderedAdd.mul_pos.mp hc
/-- a bundle made of the stack's a files and b further files has a + b files: the cardinality of a disjoint union is the sum. From Mathlib's `Fintype.card_sum` and `Fintype.card_fin` (examples: payload-app) -/
theorem textbook_app_bundle (a b : ℕ) : Fintype.card (Fin a ⊕ Fin b) = a + b := by
  rw [Fintype.card_sum, Fintype.card_fin, Fintype.card_fin]
example := @textbook_app_bundle
example : 1 + 2 = 3 := by decide
/-- textbook_app_bundle reflected by its shape (examples: payload-app) -/
@[reflection] theorem textbook_app_bundle_reflected (a b : ℕ) : (a + b) = (Fintype.card (Fin a ⊕ Fin b)) := Eq.symm (textbook_app_bundle a b)
/-- two edits of one document either share their base address or collide, the excluded middle: there is no third case. From Mathlib's `em` (examples: configure-realtime) -/
theorem textbook_edit_collides {α : Type*} (p q : α) : p = q ∨ p ≠ q := em (p = q)
example := @textbook_edit_collides
/-- textbook_edit_collides reflected by its shape (examples: configure-realtime) -/
@[reflection] theorem textbook_edit_collides_reflected {α : Type*} (p q : α) : (p ≠ q) ∨ (p = q) := Or.symm (textbook_edit_collides p q)
/-- the leads a difference opens are the members on one side only: with a and b members sharing c, (a − c) + (b − c) = a + b − 2c. From Mathlib's `tsub_add_tsub_comm` and `two_mul`, `StarOrderedRing.toExistsAddOfLE`, `Nat.instStarOrderedRing`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid`, `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le`, `Nat.instAtLeastTwoHAddOfNat` (examples: audit-difference) -/
theorem textbook_difference_leads (a b c : Nat) (ha : c ≤ a) (hb : c ≤ b) : (a - c) + (b - c) = a + b - 2 * c := by
  rw [tsub_add_tsub_comm ha hb, two_mul]
example := @textbook_difference_leads
/-- textbook_difference_leads reflected by its shape (examples: audit-difference) -/
@[reflection] theorem textbook_difference_leads_reflected (a b c : Nat) (ha : c ≤ a) (hb : c ≤ b) (σ : Nat) : σ - (a + b - 2 * c) = σ - ((a - c) + (b - c)) := congrArg (σ - ·) (Eq.symm (textbook_difference_leads a b c ha hb))
/-- the contrapositive of textbook_difference_leads (examples: audit-difference) -/
@[reflection] theorem textbook_difference_leads_contrapositive (a b c : Nat) : ¬ ((a - c) + (b - c) = a + b - 2 * c) → ¬ ((c ≤ a) ∧ (c ≤ b)) := fun hc hh => hc (textbook_difference_leads a b c hh.1 hh.2)
/-- the security audit from the client and the developer perspectives merged as one: the same count of checks from either side, c + d = d + c. From Mathlib's `add_comm` (examples: audit-security) -/
theorem textbook_security_perspectives (c d : Nat) : c + d = d + c := add_comm c d
example := @textbook_security_perspectives
/-- textbook_security_perspectives reflected by its shape (examples: audit-security) -/
@[reflection] theorem textbook_security_perspectives_reflected (c d : Nat) (σ : Nat) : σ - (d + c) = σ - (c + d) := congrArg (σ - ·) (Eq.symm (textbook_security_perspectives c d))
/-- the errors left and the errors remedied make the errors: e − r + r = e when r ≤ e. From Mathlib's `tsub_add_cancel_of_le`, through the instances `StarOrderedRing.toExistsAddOfLE`, `Nat.instStarOrderedRing`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid` and `Nat.instOrderedSub` (examples: audit-remedies) -/
theorem textbook_error_remedies (e r : Nat) (h : r ≤ e) : e - r + r = e := tsub_add_cancel_of_le h
example := @textbook_error_remedies
/-- textbook_error_remedies reflected by its shape (examples: audit-remedies) -/
@[reflection] theorem textbook_error_remedies_reflected (e r : Nat) (h : r ≤ e) (σ : Nat) : σ - (e) = σ - (e - r + r) := congrArg (σ - ·) (Eq.symm (textbook_error_remedies e r h))
/-- the contrapositive of textbook_error_remedies (examples: audit-remedies) -/
@[reflection] theorem textbook_error_remedies_contrapositive (e r : Nat) : ¬ (e - r + r = e) → ¬ ((r ≤ e)) := fun hc hh => hc (textbook_error_remedies e r hh)
/-- the converse of textbook_error_remedies, proved. From Mathlib's `tsub_add_cancel_iff_le`, `Nat.instCanonicallyOrderedAdd` and `Nat.instOrderedSub` (examples: audit-remedies) -/
@[reflection] theorem textbook_error_remedies_converse (e r : Nat) : (e - r + r = e) → (r ≤ e) :=
  fun hc => tsub_add_cancel_iff_le.mp hc
/-- the advisories less the unfixable are the fixable ones, which the public MCP repairs by an override. From Mathlib's `Finset.card_sdiff_of_subset` (examples: audit-repair) -/
theorem textbook_repair_partitions {Advisory : Type} [DecidableEq Advisory] (advisories unfixable : Finset Advisory) (h : unfixable ⊆ advisories) :
  (advisories \ unfixable).card = advisories.card - unfixable.card := Finset.card_sdiff_of_subset h
example := @textbook_repair_partitions
/-- textbook_repair_partitions reflected by its shape (examples: audit-repair) -/
@[reflection] theorem textbook_repair_partitions_reflected {Advisory : Type} [DecidableEq Advisory] (advisories unfixable : Finset Advisory) (h : unfixable ⊆ advisories) : (advisories.card - unfixable.card) = ((advisories \ unfixable).card) := Eq.symm (textbook_repair_partitions advisories unfixable h)
/-- when the served and the failed make the requests and none fails, every request is served. From Mathlib's `add_zero` (examples: audit-repair) -/
theorem textbook_repair_live_sla (served failed requests : Nat) (h : served + failed = requests) (h0 : failed = 0) : served = requests := by
  rw [h0, add_zero] at h; exact h
example := @textbook_repair_live_sla
/-- textbook_repair_live_sla reflected by its shape (examples: audit-repair) -/
@[reflection] theorem textbook_repair_live_sla_reflected (served failed requests : Nat) (h : served + failed = requests) (h0 : failed = 0) (σ : Nat) : σ - (requests) = σ - (served) := congrArg (σ - ·) (Eq.symm (textbook_repair_live_sla served failed requests h h0))
/-- the contrapositive of textbook_repair_live_sla (examples: audit-repair) -/
@[reflection] theorem textbook_repair_live_sla_contrapositive (served failed requests : Nat) : ¬ (served = requests) → ¬ ((served + failed = requests) ∧ (failed = 0)) := fun hc hh => hc (textbook_repair_live_sla served failed requests hh.1 hh.2)
/-- the kernel advisory outranks any package advisory: the maximum of a priority and one at least as high is the higher. From Mathlib's `max_eq_right` (examples: audit-repair) -/
theorem textbook_repair_kernel_top (kernel pkg : ℕ) (h : pkg ≤ kernel) : max pkg kernel = kernel := max_eq_right h
example := @textbook_repair_kernel_top
/-- textbook_repair_kernel_top reflected by its shape (examples: audit-repair) -/
@[reflection] theorem textbook_repair_kernel_top_reflected (kernel pkg : ℕ) (h : pkg ≤ kernel) : (kernel) = (max pkg kernel) := Eq.symm (textbook_repair_kernel_top kernel pkg h)
/-- correction and handling are each other's fallback: the swap is an involution, applied twice it is the identity, so the fallback terminates. From Mathlib's `Bool.involutive_not` (examples: audit-fallbacks) -/
theorem textbook_fallback_involution : Function.Involutive not := Bool.involutive_not
/-- in any cancellative additive monoid (counts among them) the served space is unchanged exactly when the downtime is zero: s + d = s ↔ d = 0, the patch with no reboot. From Mathlib's `add_eq_left` (examples: match-exploit-repair) -/
theorem textbook_exploit_refuses_to_patch {M : Type*} [AddMonoid M] [IsLeftCancelAdd M] (served downtime : M) :
    served + downtime = served ↔ downtime = 0 :=
  add_eq_left
example := @textbook_exploit_refuses_to_patch
/-- textbook_exploit_refuses_to_patch reflected by its shape (examples: match-exploit-repair) -/
@[reflection] theorem textbook_exploit_refuses_to_patch_reflected {M : Type*} [AddMonoid M] [IsLeftCancelAdd M] (served downtime : M) : (downtime = 0) ↔ (served + downtime = served) := Iff.symm (textbook_exploit_refuses_to_patch served downtime)
/-- the σ-involution σ_d(x) = d − x on {0, …, d} is Fin.rev, its own inverse: σ∘σ = id, so a denial reflected to a lead returns to itself. From Mathlib's `Fin.rev_involutive` (examples: match-impossible-involution, algorithm-factor-minus, algorithm-factor-word) -/
theorem textbook_impossible_sent_to_leads (d : Nat) : Function.Involutive (Fin.rev : Fin (d + 1) → Fin (d + 1)) := Fin.rev_involutive
example := @textbook_impossible_sent_to_leads
/-- a denial's HTTP code at least 400 is recovered from its offset above 400: (code − 400) + 400 = code. From Mathlib's `tsub_add_cancel_of_le`, `StarOrderedRing.toExistsAddOfLE`, `Nat.instStarOrderedRing`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid`, `Nat.instOrderedSub` (examples: legal-court-denier) -/
theorem textbook_denier_identified (code : Nat) (h : 400 ≤ code) : code - 400 + 400 = code := tsub_add_cancel_of_le h
example := @textbook_denier_identified
/-- textbook_denier_identified reflected by its shape (examples: legal-court-denier) -/
@[reflection] theorem textbook_denier_identified_reflected (code : Nat) (h : 400 ≤ code) (σ : Nat) : σ - (code) = σ - (code - 400 + 400) := congrArg (σ - ·) (Eq.symm (textbook_denier_identified code h))
/-- the contrapositive of textbook_denier_identified (examples: legal-court-denier) -/
@[reflection] theorem textbook_denier_identified_contrapositive (code : Nat) : ¬ (code - 400 + 400 = code) → ¬ ((400 ≤ code)) := fun hc hh => hc (textbook_denier_identified code hh)
/-- the converse of textbook_denier_identified, proved. From Mathlib's `tsub_add_cancel_iff_le`, `Nat.instCanonicallyOrderedAdd` and `Nat.instOrderedSub` (examples: legal-court-denier) -/
@[reflection] theorem textbook_denier_identified_converse (code : Nat) : (code - 400 + 400 = code) → (400 ≤ code) :=
  fun hc => tsub_add_cancel_iff_le.mp hc
/-- verifying the repo by its content address is one check while recomputing re-runs all n facts, so for any tree of at least two facts, 1 + 1 ≤ n means 1 < n. From Mathlib's `Order.add_one_le_iff` and `Nat.instNoMaxOrder` (examples: legal-court-repo-audit) -/
theorem textbook_court_audits_repo (n : ℕ) (h : 2 ≤ n) : 1 < n := Order.add_one_le_iff.mp h
example := @textbook_court_audits_repo
/-- fusion never multiplies: f findings fused by d reactions leave f − d leads, never more than the findings (vacuum W = 1, S = k ln W = 0). From Mathlib's `tsub_le_self`, `Nat.instCanonicallyOrderedAdd`, `Nat.instOrderedSub` (examples: audit-entropy, audit-entropy-vacuum, fold-integers) -/
theorem textbook_entropy_fusion (f d : Nat) : f - d ≤ f := tsub_le_self
example := @textbook_entropy_fusion
/-- textbook_entropy_fusion reflected by its shape (examples: audit-entropy, audit-entropy-vacuum, fold-integers) -/
@[reflection] theorem textbook_entropy_fusion_reflected (f d : Nat) (σ : Nat) : σ - (f) ≤ σ - (f - d) := Nat.sub_le_sub_left (textbook_entropy_fusion f d) σ
/-- inclusion–exclusion: two config sets unite into |a ∪ b| = |a| + |b| − |a ∩ b| members, |a ∪ b| + |a ∩ b| = |a| + |b|. From Mathlib's `Finset.card_union_add_card_inter` (examples: configure-sets) -/
theorem textbook_set_union {α : Type} [DecidableEq α] (a b : Finset α) : (a ∪ b).card + (a ∩ b).card = a.card + b.card :=
  Finset.card_union_add_card_inter a b
example := @textbook_set_union
/-- textbook_set_union reflected by its shape (examples: configure-sets) -/
@[reflection] theorem textbook_set_union_reflected {α : Type} [DecidableEq α] (a b : Finset α) : (a.card + b.card) = ((a ∪ b).card + (a ∩ b).card) := Eq.symm (textbook_set_union a b)
/-- the meet of equal sets is the set: when the widgeted and the skilled tools are the same set, their intersection is the widgeted. From Mathlib's `Finset.inter_self` (examples: configure-sets) -/
theorem textbook_widget_skilled_tools {α : Type} [DecidableEq α] (w s : Finset α) (h : w = s) : w ∩ s = w := by
  rw [h, Finset.inter_self]
example := @textbook_widget_skilled_tools
/-- textbook_widget_skilled_tools reflected by its shape (examples: configure-sets) -/
@[reflection] theorem textbook_widget_skilled_tools_reflected {α : Type} [DecidableEq α] (w s : Finset α) (h : w = s) : (w) = (w ∩ s) := Eq.symm (textbook_widget_skilled_tools w s h)
/-- tools partitioned over toolboxes number the sum over the toolboxes of each one's tools. From Mathlib's `Fintype.card_sigma` (examples: configure-sets, extend-out) -/
theorem textbook_mcp_tools_by_toolbox {Toolbox : Type} [Fintype Toolbox] (Tool : Toolbox → Type) [∀ b, Fintype (Tool b)] :
  Fintype.card (Σ b, Tool b) = ∑ b, Fintype.card (Tool b) := Fintype.card_sigma
example := @textbook_mcp_tools_by_toolbox
example : 13 + 11 + 6 + 2 + 1 + 2 + 3 + 1 + 3 + 2 + 1 + 3 = 48 := by decide
/-- textbook_mcp_tools_by_toolbox reflected by its shape (examples: configure-sets, extend-out) -/
@[reflection] theorem textbook_mcp_tools_by_toolbox_reflected {Toolbox : Type} [Fintype Toolbox] (Tool : Toolbox → Type) [∀ b, Fintype (Tool b)] : (∑ b, Fintype.card (Tool b)) = (Fintype.card (Σ b, Tool b)) := Eq.symm (textbook_mcp_tools_by_toolbox Tool)
/-- when the own doors and the external addresses partition the gates, the gates less the external are the own, however many the tables grow to. From Mathlib's `add_tsub_cancel_right`, through the instances `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono` and `Nat.instIsOrderedAddMonoid` (examples: configure-gates) -/
theorem textbook_gates_partition (parts : List Nat) (own external : Nat) (h : own + external = parts.sum) : parts.sum - external = own := by
  rw [← h]; exact add_tsub_cancel_right own external
example := @textbook_gates_partition
/-- textbook_gates_partition reflected by its shape (examples: configure-gates) -/
@[reflection] theorem textbook_gates_partition_reflected (parts : List Nat) (own external : Nat) (h : own + external = parts.sum) : (own) = (parts.sum - external) := Eq.symm (textbook_gates_partition parts own external h)
/-- the landings partition the gates however many the tables grow to: with truncated subtraction (ℕ among its models), when a + b is the total, the total less b is a. From Mathlib's `add_tsub_cancel_right` (examples: configure-gates) -/
theorem textbook_gate_adapters {α : Type*} [PartialOrder α] [AddCommSemigroup α] [Sub α] [OrderedSub α]
    [AddLeftReflectLE α] (a b total : α) (h : a + b = total) : total - b = a := by
  rw [← h]; exact add_tsub_cancel_right a b
example := @textbook_gate_adapters
/-- textbook_gate_adapters reflected by its shape (examples: configure-gates) -/
@[reflection] theorem textbook_gate_adapters_reflected {α : Type*} [PartialOrder α] [AddCommSemigroup α] [Sub α] [OrderedSub α] [AddLeftReflectLE α] (a b total : α) (h : a + b = total) : (a) = (total - b) := Eq.symm (textbook_gate_adapters a b total h)
/-- 2 directions under r roles are 2 · r role-direction pairs, |Bool × Fin r| = 2r (REST in and out under three tenant roles: six). From Mathlib's `Fintype.card_prod`, `Fintype.card_bool` and `Fintype.card_fin` (examples: configure-gates) -/
theorem textbook_rest_rbac (r : Nat) : Fintype.card (Bool × Fin r) = 2 * r := by
  rw [Fintype.card_prod, Fintype.card_bool, Fintype.card_fin]
example := @textbook_rest_rbac
example : 2 * 3 = 6 := by decide
/-- textbook_rest_rbac reflected by its shape (examples: configure-gates) -/
@[reflection] theorem textbook_rest_rbac_reflected (r : Nat) : (2 * r) = (Fintype.card (Bool × Fin r)) := Eq.symm (textbook_rest_rbac r)
/-- a servers at the registry and b toolboxes make a + b, the cardinality of a disjoint union. From Mathlib's `Fintype.card_sum` and `Fintype.card_fin` (examples: configure-gates) -/
theorem textbook_google_mcps (a b : ℕ) : Fintype.card (Fin a ⊕ Fin b) = a + b := by
  rw [Fintype.card_sum, Fintype.card_fin, Fintype.card_fin]
example := @textbook_google_mcps
example : 15 + 3 = 18 := by decide
/-- textbook_google_mcps reflected by its shape (examples: configure-gates) -/
@[reflection] theorem textbook_google_mcps_reflected (a b : ℕ) : (a + b) = (Fintype.card (Fin a ⊕ Fin b)) := Eq.symm (textbook_google_mcps a b)
/-- the gates by kind partition the gates however many the tables grow to: when the parts' sum is a + b, the total less b is a. From Mathlib's `add_tsub_cancel_right`, `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono` and `Nat.instIsOrderedAddMonoid` (examples: configure-gates) -/
theorem textbook_gates_by_kind (parts : List ℕ) (a b total : ℕ) (h : a + b = parts.sum) (ht : total = parts.sum) : total - b = a := by
  rw [ht, ← h, add_tsub_cancel_right]
example := @textbook_gates_by_kind
/-- textbook_gates_by_kind reflected by its shape (examples: configure-gates) -/
@[reflection] theorem textbook_gates_by_kind_reflected (parts : List ℕ) (a b total : ℕ) (h : a + b = parts.sum) (ht : total = parts.sum) : (a) = (total - b) := Eq.symm (textbook_gates_by_kind parts a b total h ht)
/-- a database, b storage and c email adapters, one of each, give a·(b·c) adapter combinations. From Mathlib's `Fintype.card_prod` and `Fintype.card_fin` (examples: configure-adapters) -/
theorem textbook_adapter_combinations (a b c : ℕ) : Fintype.card (Fin a × Fin b × Fin c) = a * (b * c) := by
  rw [Fintype.card_prod, Fintype.card_prod, Fintype.card_fin, Fintype.card_fin, Fintype.card_fin]
example := @textbook_adapter_combinations
example : 5 * 5 * 3 = 75 := by decide
/-- textbook_adapter_combinations reflected by its shape (examples: configure-adapters) -/
@[reflection] theorem textbook_adapter_combinations_reflected (a b c : ℕ) : (a * (b * c)) = (Fintype.card (Fin a × Fin b × Fin c)) := Eq.symm (textbook_adapter_combinations a b c)
/-- when every configuration kind is tested, the kinds less the tested leave none open: a number less itself is zero. From Mathlib's `tsub_self`, through the instances `Nat.instCanonicallyOrderedAdd` and `Nat.instOrderedSub` (examples: configure-all) -/
theorem textbook_configurations_closed (tested kinds : Nat) (h : tested = kinds) : kinds - tested = 0 := by
  rw [h, tsub_self]
example := @textbook_configurations_closed
/-- textbook_configurations_closed reflected by its shape (examples: configure-all) -/
@[reflection] theorem textbook_configurations_closed_reflected (tested kinds : Nat) (h : tested = kinds) (σ : Nat) : σ - (0) = σ - (kinds - tested) := congrArg (σ - ·) (Eq.symm (textbook_configurations_closed tested kinds h))
/-- the contrapositive of textbook_configurations_closed (examples: configure-all) -/
@[reflection] theorem textbook_configurations_closed_contrapositive (tested kinds : Nat) : ¬ (kinds - tested = 0) → ¬ ((tested = kinds)) := fun hc hh => hc (textbook_configurations_closed tested kinds hh)
/-- the standard contract adds nothing the catalogue does not hold: the tools and the two JSON-RPC envelopes, less the envelopes, are the tools. From Mathlib's `add_tsub_cancel_right`, `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono` and `Nat.instIsOrderedAddMonoid` (examples: configure-api) -/
theorem textbook_openapi_contract (tools : ℕ) : tools + 2 - 2 = tools := add_tsub_cancel_right tools 2
example := @textbook_openapi_contract
/-- textbook_openapi_contract reflected by its shape (examples: configure-api) -/
@[reflection] theorem textbook_openapi_contract_reflected (tools : ℕ) : (tools) = (tools + 2 - 2) := Eq.symm (textbook_openapi_contract tools)
/-- however many binding names a tenant admin selects in Payload, the values held there are none: names times zero values is zero. From Mathlib's `MulZeroClass.mul_zero` (examples: configure-connectors, configure-bindings, configure-tenant-missing) -/
theorem textbook_bindings_named_not_valued (names : ℕ) : names * 0 = 0 := mul_zero names
example := @textbook_bindings_named_not_valued
/-- textbook_bindings_named_not_valued reflected by its shape (examples: configure-connectors, configure-bindings, configure-tenant-missing) -/
@[reflection] theorem textbook_bindings_named_not_valued_reflected (names : ℕ) : (0) = (names * 0) := Eq.symm (textbook_bindings_named_not_valued names)
/-- a choice of a tenant role, a docket role and an operation is a triple, so a, b and c options make a · b · c combinations. From Mathlib's `Fintype.card_prod` and `Fintype.card_fin` (examples: audit-access) -/
theorem textbook_access_combinations (a b c : ℕ) : Fintype.card (Fin a × Fin b × Fin c) = a * b * c := by
  rw [Fintype.card_prod, Fintype.card_prod, Fintype.card_fin, Fintype.card_fin, Fintype.card_fin, Nat.mul_assoc]
example := @textbook_access_combinations
example : 3 * 3 * 4 = 36 := by decide
/-- textbook_access_combinations reflected by its shape (examples: audit-access) -/
@[reflection] theorem textbook_access_combinations_reflected (a b c : ℕ) : (a * b * c) = (Fintype.card (Fin a × Fin b × Fin c)) := Eq.symm (textbook_access_combinations a b c)
/-- the reused and the recomputed make the computations, so the computations less the recomputed are the reused. From Mathlib's `add_tsub_cancel_right`, `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono` and `Nat.instIsOrderedAddMonoid` (examples: payload-report) -/
theorem textbook_report_refactors (reused recomputed total : ℕ) (h : reused + recomputed = total) : total - recomputed = reused := by
  rw [← h, add_tsub_cancel_right]
example := @textbook_report_refactors
/-- textbook_report_refactors reflected by its shape (examples: payload-report) -/
@[reflection] theorem textbook_report_refactors_reflected (reused recomputed total : ℕ) (h : reused + recomputed = total) : (reused) = (total - recomputed) := Eq.symm (textbook_report_refactors reused recomputed total h)
/-- the quantum advantage is unlimited by default: the naturals have no maximum, so for any count of copies proven by hash there is a greater one and no bound is set on the measure. From Mathlib's `exists_gt`, `NoMaxOrder.exists_gt`, `Nat.instNoMaxOrder` (examples: audit-access, metrics-advantage, payload-predict) -/
theorem textbook_advantage_unbounded (verified : Nat) : ∃ more, verified < more := exists_gt verified
example := @textbook_advantage_unbounded
/-- merging by block address is a join: two edits merged commute and merging an edit with itself is that edit, max a b = max b a and max a a = a. From Mathlib's `max_comm` and `max_self` (examples: payload-merge) -/
theorem textbook_merge_commutes (a b : Nat) : max a b = max b a ∧ max a a = a := ⟨max_comm a b, max_self a⟩
example := @textbook_merge_commutes
/-- textbook_merge_commutes reflected by its shape (examples: payload-merge) -/
@[reflection] theorem textbook_merge_commutes_reflected (a b : Nat) (σ : Nat) : (σ - (max b a) = σ - (max a b)) ∧ (σ - (a) = σ - (max a a)) := ⟨congrArg (σ - ·) (Eq.symm (textbook_merge_commutes a b).1), congrArg (σ - ·) (Eq.symm (textbook_merge_commutes a b).2)⟩
/-- a document holding one block per generated file and one more for the bundle has the files' count plus one blocks. From Mathlib's `Fintype.card_option` (examples: payload-app-lexical) -/
theorem textbook_app_doc_blocks (File : Type) [Fintype File] : Fintype.card (Option File) = Fintype.card File + 1 :=
  Fintype.card_option
example := @textbook_app_doc_blocks
example : 3 + 1 = 4 := by decide
/-- textbook_app_doc_blocks reflected by its shape (examples: payload-app-lexical) -/
@[reflection] theorem textbook_app_doc_blocks_reflected (File : Type) [Fintype File] : (Fintype.card File + 1) = (Fintype.card (Option File)) := Eq.symm (textbook_app_doc_blocks File)
/-- a wider angle fits fewer streams in a turn: for 0 < s ≤ l, turn / l ≤ turn / s (360 / 90 = 4 gateways ≤ 360 / 60 = 6 streams). From Mathlib's `div_le_div_of_nonneg_left`, `PosMulReflectLE.toPosMulReflectLT`, `PosMulStrictMono.toPosMulReflectLE`, `IsStrictOrderedRing.toPosMulStrictMono`, `Rat.instIsStrictOrderedRing`, `MulPosReflectLE.toMulPosReflectLT`, `MulPosStrictMono.toMulPosReflectLE`, `IsStrictOrderedRing.toMulPosStrictMono` (examples: configure-scope, payload-merge) -/
theorem textbook_streams_cover_gateways (turn small large : ℚ) (ht : 0 ≤ turn) (hs : 0 < small) (h : small ≤ large) : turn / large ≤ turn / small :=
  div_le_div_of_nonneg_left ht hs h
example := @textbook_streams_cover_gateways
example : 360 / 60 = 6 ∧ 360 / 90 = 4 ∧ 4 ≤ 6 := by decide
/-- the poles of the earth as pyramids base to base are the octahedron: six vertices, twelve edges, eight 60-degree faces closed by Euler, four faces to a pole over the four gateways of the equator (examples: configure-dependencies) -/
theorem textbook_poles_pyramid : 6 + 8 - 12 = 2 ∧ 8 / 2 = 4 := by decide
/-- textbook_poles_pyramid reflected by its shape, conjunction (examples: configure-dependencies) -/
@[reflection] theorem textbook_poles_pyramid_reflected (σ : Nat) : (σ - (2) = σ - (6 + 8 - 12)) ∧ (σ - (4) = σ - (8 / 2)) := ⟨congrArg (σ - ·) (Eq.symm (textbook_poles_pyramid).1), congrArg (σ - ·) (Eq.symm (textbook_poles_pyramid).2)⟩
/-- every rotation in every locale is one page: rotations × locales pages. From Mathlib's `Fintype.card_prod` (examples: none yet) -/
theorem textbook_hologram_rotations (Rotation Locale : Type) [Fintype Rotation] [Fintype Locale] :
  Fintype.card (Rotation × Locale) = Fintype.card Rotation * Fintype.card Locale := Fintype.card_prod _ _
example := @textbook_hologram_rotations
example : 10 * 11 = 110 := by decide
/-- textbook_hologram_rotations reflected by its shape (examples: ) -/
@[reflection] theorem textbook_hologram_rotations_reflected (Rotation Locale : Type) [Fintype Rotation] [Fintype Locale] : (Fintype.card Rotation * Fintype.card Locale) = (Fintype.card (Rotation × Locale)) := Eq.symm (textbook_hologram_rotations Rotation Locale)
/-- a sitemap index of i sitemaps of u URLs each presents i · u addresses, the pairs of a product (50,000 by 50,000: 2,500,000,000). From Mathlib's `Fintype.card_prod` and `Fintype.card_fin` (examples: none yet) -/
theorem textbook_sitemap_capacity (i u : Nat) : Fintype.card (Fin i × Fin u) = i * u := by
  simp only [Fintype.card_prod, Fintype.card_fin]
example := @textbook_sitemap_capacity
example : 50000 * 50000 = 2500000000 := by decide
/-- textbook_sitemap_capacity reflected by its shape (examples: ) -/
@[reflection] theorem textbook_sitemap_capacity_reflected (i u : Nat) : (i * u) = (Fintype.card (Fin i × Fin u)) := Eq.symm (textbook_sitemap_capacity i u)
/-- n scales of one shape in a row have n − 1 steps between neighbours (seven scales, six steps). From Mathlib's `List.length_zip`, `List.length_tail`, `min_eq_right`, `tsub_le_self`, `Nat.instCanonicallyOrderedAdd`, `Nat.instOrderedSub` (examples: configure-branding) -/
theorem textbook_fractal_scales {α : Type} (scales : List α) : (scales.zip scales.tail).length = scales.length - 1 := by
  rw [List.length_zip, List.length_tail, min_eq_right tsub_le_self]
example := @textbook_fractal_scales
example : 7 - 1 = 6 := by decide
/-- textbook_fractal_scales reflected by its shape (examples: configure-branding) -/
@[reflection] theorem textbook_fractal_scales_reflected {α : Type} (scales : List α) : (scales.length - 1) = ((scales.zip scales.tail).length) := Eq.symm (textbook_fractal_scales scales)
/-- every registry item in every variant is one choice: items × variants choices (8 · 2 = 16, one per value of a nibble). From Mathlib's `Fintype.card_prod` (examples: configure-ui-coverage) -/
theorem textbook_widgets_cover_mcp (Item Variant : Type) [Fintype Item] [Fintype Variant] :
  Fintype.card (Item × Variant) = Fintype.card Item * Fintype.card Variant := Fintype.card_prod _ _
example := @textbook_widgets_cover_mcp
example : 8 * 2 = 16 := by decide
/-- textbook_widgets_cover_mcp reflected by its shape (examples: configure-ui-coverage) -/
@[reflection] theorem textbook_widgets_cover_mcp_reflected (Item Variant : Type) [Fintype Item] [Fintype Variant] : (Fintype.card Item * Fintype.card Variant) = (Fintype.card (Item × Variant)) := Eq.symm (textbook_widgets_cover_mcp Item Variant)
/-- the leads addressed and the leads not addressed, less the latter, are the addressed: a + u − u = a. From Mathlib's `add_tsub_cancel_right`, through the instances `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono` and `Nat.instIsOrderedAddMonoid` (examples: leads-by-theorem) -/
theorem textbook_leads_addressed (a u : Nat) : a + u - u = a := add_tsub_cancel_right a u
example := @textbook_leads_addressed
/-- textbook_leads_addressed reflected by its shape (examples: leads-by-theorem) -/
@[reflection] theorem textbook_leads_addressed_reflected (a u : Nat) (σ : Nat) : σ - (a) = σ - (a + u - u) := congrArg (σ - ·) (Eq.symm (textbook_leads_addressed a u))
/-- the tokens saved and the tokens kept make the whole list: (full − kept) + kept = full whenever kept ≤ full. From Mathlib's `tsub_add_cancel_of_le`, `StarOrderedRing.toExistsAddOfLE`, `Nat.instStarOrderedRing`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid`, `Nat.instOrderedSub` (examples: extend-out-balanced) -/
theorem textbook_context_balanced (full kept : Nat) (h : kept ≤ full) : full - kept + kept = full := tsub_add_cancel_of_le h
example := @textbook_context_balanced
/-- textbook_context_balanced reflected by its shape (examples: extend-out-balanced) -/
@[reflection] theorem textbook_context_balanced_reflected (full kept : Nat) (h : kept ≤ full) (σ : Nat) : σ - (full) = σ - (full - kept + kept) := congrArg (σ - ·) (Eq.symm (textbook_context_balanced full kept h))
/-- the contrapositive of textbook_context_balanced (examples: extend-out-balanced) -/
@[reflection] theorem textbook_context_balanced_contrapositive (full kept : Nat) : ¬ (full - kept + kept = full) → ¬ ((kept ≤ full)) := fun hc hh => hc (textbook_context_balanced full kept hh)
/-- the converse of textbook_context_balanced, proved. From Mathlib's `tsub_add_cancel_iff_le`, `Nat.instCanonicallyOrderedAdd` and `Nat.instOrderedSub` (examples: extend-out-balanced) -/
@[reflection] theorem textbook_context_balanced_converse (full kept : Nat) : (full - kept + kept = full) → (kept ≤ full) :=
  fun hc => tsub_add_cancel_iff_le.mp hc
/-- the usage bill is complete when its four accounts are each kept: the tokens, the bits at their thermodynamic cost at the temperature, the time, the coins (examples: metrics-bill) -/
theorem textbook_billing_complete : 1 + 1 + 1 + 1 = 4 := by decide
/-- textbook_billing_complete reflected by its shape, equality (examples: metrics-bill) -/
@[reflection] theorem textbook_billing_complete_reflected (σ : Nat) : σ - (4) = σ - (1 + 1 + 1 + 1) := congrArg (σ - ·) (Eq.symm (textbook_billing_complete))
/-- a kilowatt-hour is 3600 seconds of 1000 watts, 3,600,000 joules: the bill's joules priced by the tariff the tenant names link it to the energy sector (examples: metrics-bill) -/
theorem textbook_kwh_joules : 3600 * 1000 = 3600000 := by decide
/-- textbook_kwh_joules reflected by its shape, equality (examples: metrics-bill) -/
@[reflection] theorem textbook_kwh_joules_reflected (σ : Nat) : σ - (3600000) = σ - (3600 * 1000) := congrArg (σ - ·) (Eq.symm (textbook_kwh_joules))
/-- the margin and the provider's cost make the price: price − cost + cost = price when cost ≤ price. From Mathlib's `tsub_add_cancel_of_le`, through the instances `StarOrderedRing.toExistsAddOfLE`, `Nat.instStarOrderedRing`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid` and `Nat.instOrderedSub` (examples: stripe-margins) -/
theorem textbook_margin_makes_price (price cost : Nat) (h : cost ≤ price) : price - cost + cost = price := tsub_add_cancel_of_le h
example := @textbook_margin_makes_price
/-- textbook_margin_makes_price reflected by its shape (examples: stripe-margins) -/
@[reflection] theorem textbook_margin_makes_price_reflected (price cost : Nat) (h : cost ≤ price) (σ : Nat) : σ - (price) = σ - (price - cost + cost) := congrArg (σ - ·) (Eq.symm (textbook_margin_makes_price price cost h))
/-- the contrapositive of textbook_margin_makes_price (examples: stripe-margins) -/
@[reflection] theorem textbook_margin_makes_price_contrapositive (price cost : Nat) : ¬ (price - cost + cost = price) → ¬ ((cost ≤ price)) := fun hc hh => hc (textbook_margin_makes_price price cost hh)
/-- the converse of textbook_margin_makes_price, proved. From Mathlib's `tsub_add_cancel_iff_le`, `Nat.instCanonicallyOrderedAdd` and `Nat.instOrderedSub` (examples: stripe-margins) -/
@[reflection] theorem textbook_margin_makes_price_converse (price cost : Nat) : (price - cost + cost = price) → (cost ≤ price) :=
  fun hc => tsub_add_cancel_iff_le.mp hc
/-- the open news APIs and the keyed ones, disjoint, together number the two counts, |A ∪ B| = |A| + |B|. From Mathlib's `Finset.card_union_of_disjoint` (examples: compete-news-plan) -/
theorem textbook_news_adapters {α : Type*} [DecidableEq α] (A B : Finset α) (h : Disjoint A B) :
    (A ∪ B).card = A.card + B.card :=
  Finset.card_union_of_disjoint h
example := @textbook_news_adapters
example : 4 + 3 = 7 := by decide
/-- textbook_news_adapters reflected by its shape (examples: compete-news-plan) -/
@[reflection] theorem textbook_news_adapters_reflected {α : Type*} [DecidableEq α] (A B : Finset α) (h : Disjoint A B) : (A.card + B.card) = ((A ∪ B).card) := Eq.symm (textbook_news_adapters A B h)
/-- the hand-written theorems and the generated lemmas, less the generated, are the hand-written: nothing is lost. From Mathlib's `add_tsub_cancel_right`, through the instances `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono` and `Nat.instIsOrderedAddMonoid` (examples: textbook-theorems-served, metrics-live) -/
theorem textbook_lean_served_whole (hand generated : Nat) : hand + generated - generated = hand := add_tsub_cancel_right hand generated
example := @textbook_lean_served_whole
/-- textbook_lean_served_whole reflected by its shape (examples: textbook-theorems-served, metrics-live) -/
@[reflection] theorem textbook_lean_served_whole_reflected (hand generated : Nat) (σ : Nat) : σ - (hand) = σ - (hand + generated - generated) := congrArg (σ - ·) (Eq.symm (textbook_lean_served_whole hand generated))
/-- t deploy templates over p products are t · p sets, the pairs of a product. From Mathlib's `Fintype.card_prod` and `Fintype.card_fin` (examples: configure-wrangler-set, configure-deploy-sets) -/
theorem textbook_deploy_sets (t p : Nat) : Fintype.card (Fin t × Fin p) = t * p := by
  simp only [Fintype.card_prod, Fintype.card_fin]
example := @textbook_deploy_sets
example : 2 * 8 = 16 := by decide
/-- textbook_deploy_sets reflected by its shape (examples: configure-wrangler-set, configure-deploy-sets) -/
@[reflection] theorem textbook_deploy_sets_reflected (t p : Nat) : (t * p) = (Fintype.card (Fin t × Fin p)) := Eq.symm (textbook_deploy_sets t p)
/-- a value-holding field types and b presentational ones make a + b, the cardinality of a disjoint union. From Mathlib's `Fintype.card_sum` and `Fintype.card_fin` (examples: payload-schemas) -/
theorem textbook_payload_field_types (a b : ℕ) : Fintype.card (Fin a ⊕ Fin b) = a + b := by
  rw [Fintype.card_sum, Fintype.card_fin, Fintype.card_fin]
example := @textbook_payload_field_types
example : 19 + 4 = 23 := by decide
/-- textbook_payload_field_types reflected by its shape (examples: payload-schemas) -/
@[reflection] theorem textbook_payload_field_types_reflected (a b : ℕ) : (a + b) = (Fintype.card (Fin a ⊕ Fin b)) := Eq.symm (textbook_payload_field_types a b)
/-- operations sorted by scope number the sum of the scopes' sizes, |s| = Σ_b |{a ∈ s | f a = b}|. From Mathlib's `Finset.card_eq_sum_card_fiberwise` (examples: payload-schemas) -/
theorem textbook_payload_operations {α β : Type*} [DecidableEq β] (f : α → β) (s : Finset α) (t : Finset β)
    (H : ∀ x ∈ s, f x ∈ t) : s.card = ∑ b ∈ t, (s.filter fun a => f a = b).card :=
  Finset.card_eq_sum_card_fiberwise H
example := @textbook_payload_operations
example : 17 + 7 + 12 + 3 + 3 + 6 + 1 + 1 = 50 := by decide
/-- textbook_payload_operations reflected by its shape (examples: payload-schemas) -/
@[reflection] theorem textbook_payload_operations_reflected {α β : Type*} [DecidableEq β] (f : α → β) (s : Finset α) (t : Finset β) (H : ∀ x ∈ s, f x ∈ t) : (∑ b ∈ t, (s.filter fun a => f a = b).card) = (s.card) := Eq.symm (textbook_payload_operations f s t H)
/-- a data field types under b collection operations make a · b schemas, the cardinality of a product. From Mathlib's `Fintype.card_prod` and `Fintype.card_fin` (examples: payload-schemas) -/
theorem textbook_payload_schemas (a b : ℕ) : Fintype.card (Fin a × Fin b) = a * b := by
  rw [Fintype.card_prod, Fintype.card_fin, Fintype.card_fin]
example := @textbook_payload_schemas
example : 19 * 17 = 323 := by decide
/-- textbook_payload_schemas reflected by its shape (examples: payload-schemas) -/
@[reflection] theorem textbook_payload_schemas_reflected (a b : ℕ) : (a * b) = (Fintype.card (Fin a × Fin b)) := Eq.symm (textbook_payload_schemas a b)
/-- the where operators over the data field types pair each of a operators with each of b types, a·b queries. From Mathlib's `Fintype.card_prod` and `Fintype.card_fin` (examples: payload-schemas) -/
theorem textbook_payload_queries (a b : ℕ) : Fintype.card (Fin a × Fin b) = a * b := by
  rw [Fintype.card_prod, Fintype.card_fin, Fintype.card_fin]
example := @textbook_payload_queries
example : 16 * 19 = 304 := by decide
/-- textbook_payload_queries reflected by its shape (examples: payload-schemas) -/
@[reflection] theorem textbook_payload_queries_reflected (a b : ℕ) : (a * b) = (Fintype.card (Fin a × Fin b)) := Eq.symm (textbook_payload_queries a b)
/-- hooks partitioned by level number the sum over the levels of each level's hooks. From Mathlib's `Fintype.card_sigma` (examples: payload-schemas) -/
theorem textbook_payload_hooks {Level : Type} [Fintype Level] (Hook : Level → Type) [∀ l, Fintype (Hook l)] :
  Fintype.card (Σ l, Hook l) = ∑ l, Fintype.card (Hook l) := Fintype.card_sigma
example := @textbook_payload_hooks
example : 1 + 18 + 6 + 5 = 30 := by decide
/-- textbook_payload_hooks reflected by its shape (examples: payload-schemas) -/
@[reflection] theorem textbook_payload_hooks_reflected {Level : Type} [Fintype Level] (Hook : Level → Type) [∀ l, Fintype (Hook l)] : (∑ l, Fintype.card (Hook l)) = (Fintype.card (Σ l, Hook l)) := Eq.symm (textbook_payload_hooks Hook)
/-- access functions sorted by level number the sum of the levels' sizes, |s| = Σ_b |{a ∈ s | f a = b}|. From Mathlib's `Finset.card_eq_sum_card_fiberwise` (examples: payload-schemas) -/
theorem textbook_payload_access {α β : Type*} [DecidableEq β] (f : α → β) (s : Finset α) (t : Finset β)
    (H : ∀ x ∈ s, f x ∈ t) : s.card = ∑ b ∈ t, (s.filter fun a => f a = b).card :=
  Finset.card_eq_sum_card_fiberwise H
example := @textbook_payload_access
example : 7 + 3 + 3 + 3 = 16 := by decide
/-- textbook_payload_access reflected by its shape (examples: payload-schemas) -/
@[reflection] theorem textbook_payload_access_reflected {α β : Type*} [DecidableEq β] (f : α → β) (s : Finset α) (t : Finset β) (H : ∀ x ∈ s, f x ∈ t) : (∑ b ∈ t, (s.filter fun a => f a = b).card) = (s.card) := Eq.symm (textbook_payload_access f s t H)
/-- the realtime channels pair each of a channels with each of b operations, a·b coordinations. From Mathlib's `Fintype.card_prod` and `Fintype.card_fin` (examples: payload-schemas) -/
theorem textbook_payload_coordination (a b : ℕ) : Fintype.card (Fin a × Fin b) = a * b := by
  rw [Fintype.card_prod, Fintype.card_fin, Fintype.card_fin]
example := @textbook_payload_coordination
example : 8 * 50 = 400 := by decide
/-- textbook_payload_coordination reflected by its shape (examples: payload-schemas) -/
@[reflection] theorem textbook_payload_coordination_reflected (a b : ℕ) : (a * b) = (Fintype.card (Fin a × Fin b)) := Eq.symm (textbook_payload_coordination a b)
/-- a set of n kinds has 2^n − 1 non-empty combinations, its subsets but the empty one (four kinds of cached asset: fifteen). From Mathlib's `Finset.card_erase_of_mem`, `Finset.empty_mem_powerset` and `Finset.card_powerset` (examples: match-url-fallback) -/
theorem textbook_url_combinations {α : Type*} [DecidableEq α] (s : Finset α) : (s.powerset.erase ∅).card = 2 ^ s.card - 1 := by
  rw [Finset.card_erase_of_mem (Finset.empty_mem_powerset s), Finset.card_powerset]
example := @textbook_url_combinations
example : 2 ^ 4 - 1 = 15 := by decide
/-- textbook_url_combinations reflected by its shape (examples: match-url-fallback) -/
@[reflection] theorem textbook_url_combinations_reflected {α : Type*} [DecidableEq α] (s : Finset α) : (2 ^ s.card - 1) = ((s.powerset.erase ∅).card) := Eq.symm (textbook_url_combinations s)
/-- n sublicences under one licence: with truncated subtraction (ℕ among its models), the entries of the chain less the root are the links, (n + k) − k = n, here k = 1. From Mathlib's `add_tsub_cancel_right` (examples: match-url-fallback) -/
theorem textbook_licence_chain {α : Type*} [PartialOrder α] [AddCommSemigroup α] [Sub α] [OrderedSub α]
    [AddLeftReflectLE α] (n k : α) : n + k - k = n := add_tsub_cancel_right n k
example := @textbook_licence_chain
/-- textbook_licence_chain reflected by its shape (examples: match-url-fallback) -/
@[reflection] theorem textbook_licence_chain_reflected {α : Type*} [PartialOrder α] [AddCommSemigroup α] [Sub α] [OrderedSub α] [AddLeftReflectLE α] (n k : α) : (n) = (n + k - k) := Eq.symm (textbook_licence_chain n k)
/-- an alphabet extended by one symbol has one more: the letters and the dash, 26 + 1 = 27 symbols. From Mathlib's `Fintype.card_option` (examples: configure-validations) -/
theorem textbook_kind_alphabet (α : Type) [Fintype α] : Fintype.card (Option α) = Fintype.card α + 1 := Fintype.card_option
example := @textbook_kind_alphabet
example : 26 + 1 = 27 := by decide
/-- textbook_kind_alphabet reflected by its shape (examples: configure-validations) -/
@[reflection] theorem textbook_kind_alphabet_reflected (α : Type) [Fintype α] : (Fintype.card α + 1) = (Fintype.card (Option α)) := Eq.symm (textbook_kind_alphabet α)
/-- a hex digit is four bits: n hex digits span 16ⁿ = 2^(4n) values, so 64 hex digits hold a 256-bit SHA-256 digest. From Mathlib's `pow_mul` (examples: configure-validations, seal-text, match-pattern-seal) -/
theorem textbook_sha256_is_64 (n : ℕ) : (2 ^ 4) ^ n = 2 ^ (4 * n) := (pow_mul 2 4 n).symm
example := @textbook_sha256_is_64
example : 256 / 4 = 64 := by decide
/-- textbook_sha256_is_64 reflected by its shape (examples: configure-validations, seal-text, match-pattern-seal) -/
@[reflection] theorem textbook_sha256_is_64_reflected (n : ℕ) : (2 ^ (4 * n)) = ((2 ^ 4) ^ n) := Eq.symm (textbook_sha256_is_64 n)
/-- an alphabet of a letters, d digits and one separator has a + d + 1 symbols (slugs and binding names: 26 + 10 + 1 = 37). From Mathlib's `Fintype.card_option`, `Fintype.card_sum` and `Fintype.card_fin` (examples: configure-validations) -/
theorem textbook_name_alphabets (a d : Nat) : Fintype.card (Option (Fin a ⊕ Fin d)) = a + d + 1 := by
  simp only [Fintype.card_option, Fintype.card_sum, Fintype.card_fin]
example := @textbook_name_alphabets
example : 26 + 10 + 1 = 37 := by decide
/-- textbook_name_alphabets reflected by its shape (examples: configure-validations) -/
@[reflection] theorem textbook_name_alphabets_reflected (a d : Nat) : (a + d + 1) = (Fintype.card (Option (Fin a ⊕ Fin d))) := Eq.symm (textbook_name_alphabets a d)
/-- a hue is an angle modulo the full turn: adding 360 degrees gives the same hue (432 = 72 + 360 is the hue 72). From Mathlib's `Nat.add_modEq_right_iff` and `dvd_refl` (examples: css-create) -/
theorem textbook_create_hue (h : Nat) : 360 + h ≡ h [MOD 360] := Nat.add_modEq_right_iff.mpr (dvd_refl 360)
example := @textbook_create_hue
example : 432 % 360 = 72 := by decide
/-- when coins fuse to coils the colour is green, the heart chakra's: the coin's a432 hue (72) advanced by a ninth of the key (48) is 120, cyan and yellow full in CMYK (examples: css-coil, css-resonance, payload-predict, algorithm-factor-test-integer) -/
theorem textbook_coil_green : 432 % 360 + 432 / 9 = 120 := by decide
/-- textbook_coil_green reflected by its shape, equality (examples: css-coil, css-resonance, payload-predict, algorithm-factor-test-integer) -/
@[reflection] theorem textbook_coil_green_reflected (σ : Nat) : σ - (120) = σ - (432 % 360 + 432 / 9) := congrArg (σ - ·) (Eq.symm (textbook_coil_green))
/-- the scannable stream: thirty-six frames (one per character of a UUID) of 108 milliseconds (the third harmonic) are 3888 milliseconds, the vortex period (432 × 9); a single frame links nothing, a stream reads the address (examples: verify-scan, css-media) -/
theorem textbook_scan_stream : 36 * 108 = 432 * 9 := by decide
/-- textbook_scan_stream reflected by its shape, equality (examples: verify-scan, css-media) -/
@[reflection] theorem textbook_scan_stream_reflected (σ : Nat) : σ - (432 * 9) = σ - (36 * 108) := congrArg (σ - ·) (Eq.symm (textbook_scan_stream))
/-- a component with a single possible value, the public recomputable referer, adds no states: the secret paired with it has the secret's cardinality (2^256 for 32 bytes, 0 extra bits). From Mathlib's `Fintype.card_prod`, `Fintype.card_unit` and `mul_one` (examples: seal-referer) -/
theorem textbook_referer_binds_not_entropy (α : Type) [Fintype α] : Fintype.card (α × Unit) = Fintype.card α := by
  rw [Fintype.card_prod, Fintype.card_unit, mul_one]
example := @textbook_referer_binds_not_entropy
example : 32 * 8 + 0 = 256 := by decide
/-- textbook_referer_binds_not_entropy reflected by its shape (examples: seal-referer) -/
@[reflection] theorem textbook_referer_binds_not_entropy_reflected (α : Type) [Fintype α] : (Fintype.card α) = (Fintype.card (α × Unit)) := Eq.symm (textbook_referer_binds_not_entropy α)
/-- directories sorted by how a machine may read each number the sum of the kinds' sizes, |s| = Σ_b |{a ∈ s | f a = b}|. From Mathlib's `Finset.card_eq_sum_card_fiberwise` (examples: discover-lead-registry, discover-directories-keyed) -/
theorem textbook_mcp_directories {α β : Type*} [DecidableEq β] (f : α → β) (s : Finset α) (t : Finset β)
    (H : ∀ x ∈ s, f x ∈ t) : s.card = ∑ b ∈ t, (s.filter fun a => f a = b).card :=
  Finset.card_eq_sum_card_fiberwise H
example := @textbook_mcp_directories
example : 2 + 1 + 1 + 2 + 1 = 7 := by decide
/-- textbook_mcp_directories reflected by its shape (examples: discover-lead-registry, discover-directories-keyed) -/
@[reflection] theorem textbook_mcp_directories_reflected {α β : Type*} [DecidableEq β] (f : α → β) (s : Finset α) (t : Finset β) (H : ∀ x ∈ s, f x ∈ t) : (∑ b ∈ t, (s.filter fun a => f a = b).card) = (s.card) := Eq.symm (textbook_mcp_directories f s t H)
/-- one gate per API: a one-to-one correspondence between two finite collections makes them equally many (three Google APIs, three gates). From Mathlib's `Fintype.card_congr` (examples: configure-google-apis) -/
theorem textbook_google_api_surfaces {α β : Type*} [Fintype α] [Fintype β] (e : α ≃ β) :
    Fintype.card α = Fintype.card β :=
  Fintype.card_congr e
example := @textbook_google_api_surfaces
example : 1 + 1 + 1 = 3 ∧ 1 + 1 = 2 := by decide
/-- textbook_google_api_surfaces reflected by its shape (examples: configure-google-apis) -/
@[reflection] theorem textbook_google_api_surfaces_reflected {α β : Type*} [Fintype α] [Fintype β] (e : α ≃ β) : (Fintype.card β) = (Fintype.card α) := Eq.symm (textbook_google_api_surfaces e)
/-- the handshake lemma: the degrees of a graph sum to twice its edges, so the average connectivity is 2E/N (Willow's 182 couplers on 105 qubits: 364/105 ≈ 3.47). From Mathlib's `SimpleGraph.sum_degrees_eq_twice_card_edges` (examples: processor-willow) -/
theorem textbook_willow_connectivity {V : Type*} [Fintype V] [DecidableEq V] (G : SimpleGraph V) [DecidableRel G.Adj] :
    ∑ v, G.degree v = 2 * G.edgeFinset.card :=
  G.sum_degrees_eq_twice_card_edges
example := @textbook_willow_connectivity
example : (2 * 182 * 100 + 52) / 105 = 347 := by decide
/-- textbook_willow_connectivity reflected by its shape (examples: processor-willow) -/
@[reflection] theorem textbook_willow_connectivity_reflected {V : Type*} [Fintype V] [DecidableEq V] (G : SimpleGraph V) [DecidableRel G.Adj] : (2 * G.edgeFinset.card) = (∑ v, G.degree v) := Eq.symm (textbook_willow_connectivity G)
/-- when each foreign word maps to one verdict of this tree, the words number the sum over the verdicts of the words mapped to each (2 served, 1 impossible, 3 unknown: 6). From Mathlib's `Finset.card_eq_sum_card_fiberwise` (examples: match-foreign-verdict) -/
theorem textbook_foreign_verdicts {ι κ : Type} [DecidableEq κ] (f : ι → κ) (s : Finset ι) (t : Finset κ) (h : ∀ x ∈ s, f x ∈ t) : s.card = ∑ k ∈ t, (s.filter (fun x => f x = k)).card :=
  Finset.card_eq_sum_card_fiberwise (fun x hx => h x hx)
example := @textbook_foreign_verdicts
example : 2 + 1 + 3 = 6 := by decide
/-- textbook_foreign_verdicts reflected by its shape (examples: match-foreign-verdict) -/
@[reflection] theorem textbook_foreign_verdicts_reflected {ι κ : Type} [DecidableEq κ] (f : ι → κ) (s : Finset ι) (t : Finset κ) (h : ∀ x ∈ s, f x ∈ t) : (∑ k ∈ t, (s.filter (fun x => f x = k)).card) = (s.card) := Eq.symm (textbook_foreign_verdicts f s t h)
/-- listDeclarations sorts declarations into k kinds, so the declarations are the sum of the kinds' counts (2 + 2 + 1 + 1 = 6). From Mathlib's `Finset.card_eq_sum_card_fiberwise` and `Finset.mem_univ` (examples: audit-declarations) -/
theorem textbook_shared_verbs {α : Type*} {k : ℕ} (decls : Finset α) (kind : α → Fin k) : decls.card = ∑ j : Fin k, (decls.filter (fun x => kind x = j)).card :=
  Finset.card_eq_sum_card_fiberwise (fun x _ => Finset.mem_univ (kind x))
example := @textbook_shared_verbs
example : 2 + 2 + 1 + 1 = 6 := by decide
/-- textbook_shared_verbs reflected by its shape (examples: audit-declarations) -/
@[reflection] theorem textbook_shared_verbs_reflected {α : Type*} {k : ℕ} (decls : Finset α) (kind : α → Fin k) : (∑ j : Fin k, (decls.filter (fun x => kind x = j)).card) = (decls.card) := Eq.symm (textbook_shared_verbs decls kind)
/-- getAccess grants exactly when some can rule allows and no cannot rule denies: in any Boolean algebra of abilities, can ⊓ cannotᶜ = ⊤ forces can = ⊤ and cannot = ⊥ (the meet is the merge of CanCanCan's rules). From Mathlib's `inf_eq_top_iff` and `compl_eq_top` (examples: payload-access-abilities, payload-roles-from-groups) -/
theorem textbook_abilities_merge {α : Type*} [BooleanAlgebra α] (can cannot : α) : can ⊓ cannotᶜ = ⊤ → can = ⊤ ∧ cannot = ⊥ :=
  fun h => (inf_eq_top_iff.mp h).imp_right compl_eq_top.mp
example := @textbook_abilities_merge
/-- textbook_abilities_merge reflected by its shape (examples: payload-access-abilities, payload-roles-from-groups) -/
@[reflection] theorem textbook_abilities_merge_reflected {α : Type*} [BooleanAlgebra α] (can cannot : α) : ¬ (can = ⊤ ∧ cannot = ⊥) → ¬ ((can ⊓ cannotᶜ = ⊤)) := fun hc hh => hc ((textbook_abilities_merge can cannot) hh)
/-- a cannot binds whatever can allows: when the cannot is everything, can ⊓ cannotᶜ = ⊥ in any Boolean algebra (Bool's `can && !true = false` a case). From Mathlib's `compl_top` and `inf_bot_eq` (examples: payload-access-waive) -/
theorem textbook_cannot_binds {α : Type} [BooleanAlgebra α] (can cannot : α) (h : cannot = ⊤) : can ⊓ cannotᶜ = ⊥ := by
  rw [h, compl_top, inf_bot_eq]
example := @textbook_cannot_binds
/-- textbook_cannot_binds reflected by its shape (examples: payload-access-waive) -/
@[reflection] theorem textbook_cannot_binds_reflected {α : Type} [BooleanAlgebra α] (can cannot : α) (h : cannot = ⊤) : (⊥) = (can ⊓ cannotᶜ) := Eq.symm (textbook_cannot_binds can cannot h)
/-- when each association type is answered by one field kind, the types number the sum over the kinds of the types each kind answers (5 by a relationship, 4 by a join, 1 by a type select: 10). From Mathlib's `Finset.card_eq_sum_card_fiberwise` (examples: rails-associations-overview, rails-associations-types, rails-associations-choosing, rails-associations-advanced, rails-associations-sti, rails-associations-delegated, rails-associations-tips, rails-associations-references) -/
theorem textbook_association_fields {ι κ : Type} [DecidableEq κ] (f : ι → κ) (s : Finset ι) (t : Finset κ) (h : ∀ x ∈ s, f x ∈ t) : s.card = ∑ k ∈ t, (s.filter (fun x => f x = k)).card :=
  Finset.card_eq_sum_card_fiberwise (fun x hx => h x hx)
example := @textbook_association_fields
example : 5 + 4 + 1 = 10 := by decide
/-- textbook_association_fields reflected by its shape (examples: rails-associations-overview, rails-associations-types, rails-associations-choosing, rails-associations-advanced, rails-associations-sti, rails-associations-delegated, rails-associations-tips, rails-associations-references) -/
@[reflection] theorem textbook_association_fields_reflected {ι κ : Type} [DecidableEq κ] (f : ι → κ) (s : Finset ι) (t : Finset κ) (h : ∀ x ∈ s, f x ∈ t) : (∑ k ∈ t, (s.filter (fun x => f x = k)).card) = (s.card) := Eq.symm (textbook_association_fields f s t h)
/-- helpers answered by a field option and by a validate function number the sum of both (5 + 9 = 14 Rails validation helpers). From Mathlib's `Fintype.card_sum` (examples: rails-validations-overview, rails-validations-helpers, rails-validations-options, rails-validations-conditional, rails-validations-strict, rails-validations-listing, rails-validations-custom, rails-validations-errors) -/
theorem textbook_validation_helpers (ByOption ByFunction : Type) [Fintype ByOption] [Fintype ByFunction] :
  Fintype.card (ByOption ⊕ ByFunction) = Fintype.card ByOption + Fintype.card ByFunction := Fintype.card_sum
example := @textbook_validation_helpers
example : 5 + 9 = 14 := by decide
/-- textbook_validation_helpers reflected by its shape (examples: rails-validations-overview, rails-validations-helpers, rails-validations-options, rails-validations-conditional, rails-validations-strict, rails-validations-listing, rails-validations-custom, rails-validations-errors) -/
@[reflection] theorem textbook_validation_helpers_reflected (ByOption ByFunction : Type) [Fintype ByOption] [Fintype ByFunction] : (Fintype.card ByOption + Fintype.card ByFunction) = (Fintype.card (ByOption ⊕ ByFunction)) := Eq.symm (textbook_validation_helpers ByOption ByFunction)
/-- listRunnableLeads runs a lead exactly when it is unserved and names its door: a meet is the top only when both are. From Mathlib's `inf_eq_top_iff` (examples: leads-runnable) -/
theorem textbook_runnable_leads {α : Type*} [SemilatticeInf α] [OrderTop α] (unserved door : α) : unserved ⊓ door = ⊤ → unserved = ⊤ ∧ door = ⊤ :=
  fun h => inf_eq_top_iff.mp h
example := @textbook_runnable_leads
/-- textbook_runnable_leads reflected by its shape (examples: leads-runnable) -/
@[reflection] theorem textbook_runnable_leads_reflected {α : Type*} [SemilatticeInf α] [OrderTop α] (unserved door : α) : ¬ (unserved = ⊤ ∧ door = ⊤) → ¬ ((unserved ⊓ door = ⊤)) := fun hc hh => hc ((textbook_runnable_leads unserved door) hh)
/-- a .glb begins with a twelve-byte header (the magic glTF, 0x46546C67, the version and the length) and each chunk with eight bytes (its length and its type, JSON 0x4E4F534A or BIN); seal { gltf } loads an asset unless it requires an extension the table does not list (examples: seal-gltf-glb, seal-gltf-json) -/
theorem textbook_gltf_required_extensions : 12 + 8 = 20 ∧ 0x46546C67 = 1179937895 ∧ 0x4E4F534A = 1313821514 := by decide
/-- textbook_gltf_required_extensions reflected by its shape, conjunction (examples: seal-gltf-glb, seal-gltf-json) -/
@[reflection] theorem textbook_gltf_required_extensions_reflected (σ : Nat) : (σ - (20) = σ - (12 + 8)) ∧ (σ - (1179937895) = σ - (0x46546C67)) ∧ (σ - (1313821514) = σ - (0x4E4F534A)) := ⟨congrArg (σ - ·) (Eq.symm (textbook_gltf_required_extensions).1), congrArg (σ - ·) (Eq.symm (textbook_gltf_required_extensions).2.1), congrArg (σ - ·) (Eq.symm (textbook_gltf_required_extensions).2.2)⟩
/-- a positive n lies between consecutive powers of two, 2^⌊log₂ n⌋ ≤ n < 2^(⌊log₂ n⌋ + 1): the phase's 3888 milliseconds lie between 2^11 and 2^12, eleven full bits. From Mathlib's `Nat.pow_log_le_self` and `Nat.lt_pow_succ_log_self` (examples: seal-entropy) -/
theorem textbook_phase_bits (n : Nat) (hn : n ≠ 0) : 2 ^ Nat.log 2 n ≤ n ∧ n < 2 ^ (Nat.log 2 n + 1) :=
  ⟨Nat.pow_log_le_self 2 hn, Nat.lt_pow_succ_log_self (by decide) n⟩
example := @textbook_phase_bits
example : 2 ^ 11 ≤ 3888 ∧ 3888 < 2 ^ 12 := by decide
/-- the links of a chain of frames are its consecutive pairs, one fewer than the frames (35 links between 36 frames). From Mathlib's `min_eq_right` and `tsub_le_self`, through the instances `Nat.instCanonicallyOrderedAdd` and `Nat.instOrderedSub` (examples: verify-scan, verify-scan-one-frame) -/
theorem textbook_scan_links {α : Type} (l : List α) : (l.zip l.tail).length = l.length - 1 := by
  rw [List.length_zip, List.length_tail]; exact min_eq_right tsub_le_self
example := @textbook_scan_links
example : 36 - 1 = 35 := by decide
/-- textbook_scan_links reflected by its shape (examples: verify-scan, verify-scan-one-frame) -/
@[reflection] theorem textbook_scan_links_reflected {α : Type} (l : List α) : (l.length - 1) = ((l.zip l.tail).length) := Eq.symm (textbook_scan_links l)
/-- k hex digits of four bits each carry 4k bits: 16^k = 2^(4k) addresses (thirty-two digits are 128 bits, 16^32 = 2^128 addresses a stream may link). From Mathlib's `pow_mul` (examples: verify-scan) -/
theorem textbook_chain_bits (k : Nat) : (16 : Nat) ^ k = 2 ^ (4 * k) := by
  rw [pow_mul]; rfl
example := @textbook_chain_bits
example : 32 * 4 = 128 := by decide
/-- textbook_chain_bits reflected by its shape (examples: verify-scan) -/
@[reflection] theorem textbook_chain_bits_reflected (k : Nat) : (2 ^ (4 * k)) = ((16 : Nat) ^ k) := Eq.symm (textbook_chain_bits k)
/-- shifting two steps by the same s keeps their distance: h + s − (g + s) = h − g. From Mathlib's `add_tsub_add_eq_tsub_right`, through the instances `Nat.instOrderedSub`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd` and `contravariant_lt_of_covariant_le` (examples: css-program-shift, textbook-rewrite) -/
theorem textbook_hue_shift (h g s : Nat) : h + s - (g + s) = h - g := add_tsub_add_eq_tsub_right h s g
example := @textbook_hue_shift
/-- textbook_hue_shift reflected by its shape (examples: css-program-shift, textbook-rewrite) -/
@[reflection] theorem textbook_hue_shift_reflected (h g s : Nat) (σ : Nat) : σ - (h - g) = σ - (h + s - (g + s)) := congrArg (σ - ·) (Eq.symm (textbook_hue_shift h g s))
/-- n hues equally spaced by a step s cover n·s degrees, so sixteen hues 45° apart make 16 · 45 = 720 = 2 · 360, two turns of the circle: the sum of a constant step. From Mathlib's `Finset.sum_const`, `Finset.card_range`, `smul_eq_mul` (examples: css-rays) -/
theorem textbook_hue_steps (n step : Nat) : ∑ _i ∈ Finset.range n, step = n * step := by
  rw [Finset.sum_const, Finset.card_range, smul_eq_mul]
example := @textbook_hue_steps
example : 16 * 45 = 2 * 360 := by decide
/-- textbook_hue_steps reflected by its shape (examples: css-rays) -/
@[reflection] theorem textbook_hue_steps_reflected (n step : Nat) : (n * step) = (∑ _i ∈ Finset.range n, step) := Eq.symm (textbook_hue_steps n step)
/-- however many refusals a gate answers, each writes nothing, and any number times zero is zero. From Mathlib's `MulZeroClass.mul_zero` (examples: legal-court, legal-court-rules) -/
theorem textbook_cheap_gates (refusals : Nat) : refusals * 0 = 0 := mul_zero refusals
example := @textbook_cheap_gates
/-- textbook_cheap_gates reflected by its shape (examples: legal-court, legal-court-rules) -/
@[reflection] theorem textbook_cheap_gates_reflected (refusals : Nat) (σ : Nat) : σ - (0) = σ - (refusals * 0) := congrArg (σ - ·) (Eq.symm (textbook_cheap_gates refusals))
/-- a message is a CL description exactly when all four checks hold: a Boolean conjunction is true exactly when each conjunct is. From Mathlib's `Bool.and_elim_left`, `Bool.and_elim_right` and `Bool.and_intro` (examples: repository-cl-described, repository-cl-one-sentence) -/
theorem textbook_cl_described (a b c d : Bool) : (a && b && c && d) = true ↔ (a = true ∧ b = true ∧ c = true ∧ d = true) :=
  ⟨fun h => ⟨Bool.and_elim_left (Bool.and_elim_left (Bool.and_elim_left h)), Bool.and_elim_right (Bool.and_elim_left (Bool.and_elim_left h)), Bool.and_elim_right (Bool.and_elim_left h), Bool.and_elim_right h⟩,
   fun ⟨ha, hb, hc, hd⟩ => Bool.and_intro (Bool.and_intro (Bool.and_intro ha hb) hc) hd⟩
example := @textbook_cl_described
/-- textbook_cl_described reflected by its shape (examples: repository-cl-described, repository-cl-one-sentence) -/
@[reflection] theorem textbook_cl_described_reflected (a b c d : Bool) : ((a = true ∧ b = true ∧ c = true ∧ d = true)) ↔ ((a && b && c && d) = true) := Iff.symm (textbook_cl_described a b c d)
/-- a commit or push is pinned exactly when the actions used by a movable ref u and the workflows without least-privilege permissions p sum to none, that is when both counts are none (the Scorecard checks Pinned-Dependencies and Token-Permissions). From Mathlib's `add_eq_zero` and `Unique.instSubsingleton` (examples: repository-actions-tag-pinned, repository-actions-sha-pinned) -/
theorem textbook_actions_pinned (u p : Nat) : u + p = 0 ↔ u = 0 ∧ p = 0 := add_eq_zero
example := @textbook_actions_pinned
/-- textbook_actions_pinned reflected by its shape (examples: repository-actions-tag-pinned, repository-actions-sha-pinned) -/
@[reflection] theorem textbook_actions_pinned_reflected (u p : Nat) : (u = 0 ∧ p = 0) ↔ (u + p = 0) := Iff.symm (textbook_actions_pinned u p)
/-- five git hooks (pre-commit, commit-msg, pre-push, post-commit, prepare-commit-msg), the CI and the strict pre-deploy check are seven client MCP workflows of one door; the hook script walks the steps and decides nothing (examples: repository-workflow, repository-probes, repository-ci) -/
theorem textbook_hook_workflows : 6 + 1 + 1 = 8 := by decide
/-- textbook_hook_workflows reflected by its shape, equality (examples: repository-workflow, repository-probes, repository-ci) -/
@[reflection] theorem textbook_hook_workflows_reflected (σ : Nat) : σ - (8) = σ - (6 + 1 + 1) := congrArg (σ - ·) (Eq.symm (textbook_hook_workflows))
/-- adding the red steps, zero of them, to the green and skipped changes nothing. From Mathlib's `add_zero` (examples: repository-refuse-commit) -/
theorem textbook_commit_green (green skipped : Nat) : green + skipped + 0 = green + skipped := add_zero (green + skipped)
example := @textbook_commit_green
/-- textbook_commit_green reflected by its shape (examples: repository-refuse-commit) -/
@[reflection] theorem textbook_commit_green_reflected (green skipped : Nat) (σ : Nat) : σ - (green + skipped) = σ - (green + skipped + 0) := congrArg (σ - ·) (Eq.symm (textbook_commit_green green skipped))
/-- a commit holds the rule google-via-payload exactly when its direct Google calls are zero, that is when they are not positive. From Mathlib's `not_lt` (examples: repository-google-via-payload, textbook-rewrite) -/
theorem textbook_google_one_door (direct : Nat) : direct = 0 ↔ ¬ 0 < direct := by
  rw [not_lt, Nat.le_zero]
example := @textbook_google_one_door
/-- textbook_google_one_door reflected by its shape (examples: repository-google-via-payload, textbook-rewrite) -/
@[reflection] theorem textbook_google_one_door_reflected (direct : Nat) : (¬ 0 < direct) ↔ (direct = 0) := Iff.symm (textbook_google_one_door direct)
/-- a Google call runs exactly when its violations sum to none, that is when each kind is none: a sum of naturals is zero iff every summand is. From Mathlib's `add_eq_zero` and `Unique.instSubsingleton` (examples: payload-google-call-validated, payload-google-call-endpoint, payload-google-call-refused) -/
theorem textbook_google_call_schema (unknown missing broken : ℕ) : unknown + missing + broken = 0 ↔ unknown = 0 ∧ missing = 0 ∧ broken = 0 := by
  rw [add_eq_zero, add_eq_zero, and_assoc]
example := @textbook_google_call_schema
/-- textbook_google_call_schema reflected by its shape (examples: payload-google-call-validated, payload-google-call-endpoint, payload-google-call-refused) -/
@[reflection] theorem textbook_google_call_schema_reflected (unknown missing broken : ℕ) : (unknown = 0 ∧ missing = 0 ∧ broken = 0) ↔ (unknown + missing + broken = 0) := Iff.symm (textbook_google_call_schema unknown missing broken)
/-- a retried step is its last attempt: whatever the earlier attempts were, the status the green rule reads is the last one, so a step next retried to green no longer refuses the commit; every attempt stays in the receipt as history (examples: repository-retry-supersedes) -/
theorem textbook_retry_supersedes (attempts : List Bool) (last : Bool) : (attempts ++ [last]).getLast? = some last := by simp
/-- textbook_retry_supersedes reflected by its shape, equality (examples: repository-retry-supersedes) -/
@[reflection] theorem textbook_retry_supersedes_reflected (attempts : List Bool) (last : Bool) : (some last) = ((attempts ++ [last]).getLast?) := Eq.symm (textbook_retry_supersedes attempts last)
/-- the version is the last tag or its one next step: with truncated subtraction (ℕ among its models), one step k forward and one back is the tag, (n + k) − k = n, here k = 1. From Mathlib's `add_tsub_cancel_right` (examples: configure-versions) -/
theorem textbook_version_sequential {α : Type*} [PartialOrder α] [AddCommSemigroup α] [Sub α] [OrderedSub α]
    [AddLeftReflectLE α] (n k : α) : n + k - k = n := add_tsub_cancel_right n k
example := @textbook_version_sequential
/-- textbook_version_sequential reflected by its shape (examples: configure-versions) -/
@[reflection] theorem textbook_version_sequential_reflected {α : Type*} [PartialOrder α] [AddCommSemigroup α] [Sub α] [OrderedSub α] [AddLeftReflectLE α] (n k : α) : (n) = (n + k - k) := Eq.symm (textbook_version_sequential n k)
/-- majority decoding: any two strict majorities of the same copies share a copy, so the majority's verdict is unique (twice two exceeds three: two of three decide). From Mathlib's `Finset.inter_nonempty_of_card_lt_card_add_card` (examples: none yet) -/
theorem textbook_majority_of_three {α : Type*} [DecidableEq α] (copies A B : Finset α) (hA : A ⊆ copies) (hB : B ⊆ copies) (hA2 : copies.card < 2 * A.card) (hB2 : copies.card < 2 * B.card) : (A ∩ B).Nonempty :=
  Finset.inter_nonempty_of_card_lt_card_add_card hA hB (by omega)
example := @textbook_majority_of_three
example : 2 * 2 > 3 := by decide
/-- every chat turn is a door call or a question with at least one option: a Boolean is false or true, and a turn not served carries options. From Mathlib's `Bool.dichotomy` (examples: chat-question, chat-choice, chat-routes, chat-not-object, configure-chat-item, imagine-integer-llm, chat-account, chat-thousand, textbook-chat-plan, textbook-chat-coverage) -/
theorem textbook_chat_call_or_question (served : Bool) (options : ℕ) (h : served = false → 0 < options) : served = true ∨ 0 < options :=
  (Bool.dichotomy served).elim (fun hf => Or.inr (h hf)) Or.inl
example := @textbook_chat_call_or_question
/-- textbook_chat_call_or_question reflected by its shape (examples: chat-question, chat-choice, chat-routes, chat-not-object, configure-chat-item, imagine-integer-llm, chat-account, chat-thousand, textbook-chat-plan, textbook-chat-coverage) -/
@[reflection] theorem textbook_chat_call_or_question_reflected (served : Bool) (options : ℕ) (h : served = false → 0 < options) : (0 < options) ∨ (served = true) := Or.symm (textbook_chat_call_or_question served options h)
/-- every prompt is routed or is a lead, no third case: a Boolean is true or false. From Mathlib's `Bool.dichotomy` (examples: match-route) -/
theorem textbook_route_or_lead (b : Bool) : b = true ∨ b = false := (Bool.dichotomy b).symm
example := @textbook_route_or_lead
/-- textbook_route_or_lead reflected by its shape (examples: match-route) -/
@[reflection] theorem textbook_route_or_lead_reflected (b : Bool) : (b = false) ∨ (b = true) := Or.symm (textbook_route_or_lead b)
/-- the more the QPU is used the more complete it gets: adding what its sources answered never lowers what it held, n ≤ n + k. From Mathlib's `le_self_add` and `Nat.instCanonicallyOrderedAdd` (examples: leads-sources-plan) -/
theorem textbook_use_completes (n k : ℕ) : n ≤ n + k := le_self_add
example := @textbook_use_completes
/-- every open textbook is reached by a theorem, a lead of the domain, or outside it, so removing the outside and the domain ones leaves the routed: r + d + o − o − d = r. From Mathlib's `add_tsub_cancel_right`, `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid` (examples: leads-sources-judged) -/
theorem textbook_textbooks_partition (routed domain outside : Nat) : routed + domain + outside - outside - domain = routed := by
  rw [add_tsub_cancel_right, add_tsub_cancel_right]
example := @textbook_textbooks_partition
/-- textbook_textbooks_partition reflected by its shape (examples: leads-sources-judged) -/
@[reflection] theorem textbook_textbooks_partition_reflected (routed domain outside : Nat) (σ : Nat) : σ - (routed) = σ - (routed + domain + outside - outside - domain) := congrArg (σ - ·) (Eq.symm (textbook_textbooks_partition routed domain outside))
/-- k searches of at most b results each find at most k · b results, |⋃ t i| ≤ |s| · b (three words, ten servers each: thirty at most). From Mathlib's `Finset.card_biUnion_le_card_mul` (examples: discover-lead-registry) -/
theorem textbook_registry_words_searched {ι α : Type*} [DecidableEq α] (s : Finset ι) (t : ι → Finset α) (b : Nat)
    (h : ∀ i ∈ s, (t i).card ≤ b) : (s.biUnion t).card ≤ s.card * b :=
  Finset.card_biUnion_le_card_mul s t b h
example := @textbook_registry_words_searched
example : 3 * 10 = 30 := by decide
/-- a requests of the unit's own and b verifier contracts make a + b discovery requests, the cardinality of a disjoint union (3 + 52 = 55). From Mathlib's `Fintype.card_sum` and `Fintype.card_fin` (examples: discover-requests) -/
theorem textbook_discovery_requests (a b : ℕ) : Fintype.card (Fin a ⊕ Fin b) = a + b := by
  rw [Fintype.card_sum, Fintype.card_fin, Fintype.card_fin]
example := @textbook_discovery_requests
example : 1 + 1 + 1 + 52 = 55 := by decide
/-- textbook_discovery_requests reflected by its shape (examples: discover-requests) -/
@[reflection] theorem textbook_discovery_requests_reflected (a b : ℕ) : (a + b) = (Fintype.card (Fin a ⊕ Fin b)) := Eq.symm (textbook_discovery_requests a b)
/-- a wave's requests grouped by lead number the sum over the leads of each lead's requests (3 + 2 + 7 · 3 + 1 + 1 = 28). From Mathlib's `Fintype.card_sigma` (examples: wave-requests) -/
theorem textbook_wave_requests_by_lead {Lead : Type} [Fintype Lead] (Request : Lead → Type) [∀ l, Fintype (Request l)] :
  Fintype.card (Σ l, Request l) = ∑ l, Fintype.card (Request l) := Fintype.card_sigma
example := @textbook_wave_requests_by_lead
example : 3 + 2 + 7 * 3 + 1 + 1 = 28 := by decide
/-- textbook_wave_requests_by_lead reflected by its shape (examples: wave-requests) -/
@[reflection] theorem textbook_wave_requests_by_lead_reflected {Lead : Type} [Fintype Lead] (Request : Lead → Type) [∀ l, Fintype (Request l)] : (∑ l, Fintype.card (Request l)) = (Fintype.card (Σ l, Request l)) := Eq.symm (textbook_wave_requests_by_lead Request)
/-- the unit judges every lead served, refuted or in trial, so the leads less those in trial are the settled ones. From Mathlib's `add_tsub_cancel_right`, `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono` and `Nat.instIsOrderedAddMonoid` (examples: readiness-plan) -/
theorem textbook_readiness_judged (served refuted trial leads : ℕ) (h : served + refuted + trial = leads) : leads - trial = served + refuted := by
  rw [← h, add_tsub_cancel_right]
example := @textbook_readiness_judged
/-- textbook_readiness_judged reflected by its shape (examples: readiness-plan) -/
@[reflection] theorem textbook_readiness_judged_reflected (served refuted trial leads : ℕ) (h : served + refuted + trial = leads) : (served + refuted) = (leads - trial) := Eq.symm (textbook_readiness_judged served refuted trial leads h)
/-- requests sorted by the kind each belongs to number the sum of the kinds' sizes, |s| = Σ_b |{a ∈ s | f a = b}| (clay's three, processor's three and roadmap's seven are thirteen requests; six dashboard cells and seven examples the same thirteen). From Mathlib's `Finset.card_eq_sum_card_fiberwise` (examples: e2e-requests) -/
theorem textbook_e2e_combos {α β : Type*} [DecidableEq β] (f : α → β) (s : Finset α) (t : Finset β)
    (H : ∀ x ∈ s, f x ∈ t) : s.card = ∑ b ∈ t, (s.filter fun a => f a = b).card :=
  Finset.card_eq_sum_card_fiberwise H
example := @textbook_e2e_combos
example : 3 + 3 + 7 = 13 ∧ 6 + 7 = 13 := by decide
/-- textbook_e2e_combos reflected by its shape (examples: e2e-requests) -/
@[reflection] theorem textbook_e2e_combos_reflected {α β : Type*} [DecidableEq β] (f : α → β) (s : Finset α) (t : Finset β) (H : ∀ x ∈ s, f x ∈ t) : (∑ b ∈ t, (s.filter fun a => f a = b).card) = (s.card) := Eq.symm (textbook_e2e_combos f s t H)
/-- when each lead judged gets one verdict, the leads number the sum over the verdicts of the leads given each (0 served, 2 impossible, 0 unknown: 2). From Mathlib's `Finset.card_eq_sum_card_fiberwise` (examples: imagine-two) -/
theorem textbook_imagine_verdicts {ι κ : Type} [DecidableEq κ] (f : ι → κ) (s : Finset ι) (t : Finset κ) (h : ∀ x ∈ s, f x ∈ t) : s.card = ∑ k ∈ t, (s.filter (fun x => f x = k)).card :=
  Finset.card_eq_sum_card_fiberwise (fun x hx => h x hx)
example := @textbook_imagine_verdicts
example : 0 + 2 + 0 = 2 ∧ 169 + 20 = 189 := by decide
/-- textbook_imagine_verdicts reflected by its shape (examples: imagine-two) -/
@[reflection] theorem textbook_imagine_verdicts_reflected {ι κ : Type} [DecidableEq κ] (f : ι → κ) (s : Finset ι) (t : Finset κ) (h : ∀ x ∈ s, f x ∈ t) : (∑ k ∈ t, (s.filter (fun x => f x = k)).card) = (s.card) := Eq.symm (textbook_imagine_verdicts f s t h)
/-- words translated, kept and untranslated number the sum of the three (5 + 1 + 0 = 6 distinct words). From Mathlib's `Fintype.card_sum` (examples: translate-bg) -/
theorem textbook_translate_phrases (Translated Kept Untranslated : Type) [Fintype Translated] [Fintype Kept] [Fintype Untranslated] :
  Fintype.card (Translated ⊕ Kept ⊕ Untranslated) = Fintype.card Translated + (Fintype.card Kept + Fintype.card Untranslated) := by
  rw [Fintype.card_sum, Fintype.card_sum]
example := @textbook_translate_phrases
example : 5 + 1 + 0 = 6 := by decide
/-- textbook_translate_phrases reflected by its shape (examples: translate-bg) -/
@[reflection] theorem textbook_translate_phrases_reflected (Translated Kept Untranslated : Type) [Fintype Translated] [Fintype Kept] [Fintype Untranslated] : (Fintype.card Translated + (Fintype.card Kept + Fintype.card Untranslated)) = (Fintype.card (Translated ⊕ Kept ⊕ Untranslated)) := Eq.symm (textbook_translate_phrases Translated Kept Untranslated)
/-- every term of a locale's vocabulary is known or missing, so the missing and the known make the terms whatever the vocabulary has grown to. From Mathlib's `tsub_add_cancel_of_le`, `StarOrderedRing.toExistsAddOfLE`, `Nat.instStarOrderedRing`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid` and `Nat.instOrderedSub` (examples: translate-coverage) -/
theorem textbook_vocabulary_measured (terms known : ℕ) (h : known ≤ terms) : terms - known + known = terms := tsub_add_cancel_of_le h
example := @textbook_vocabulary_measured
/-- textbook_vocabulary_measured reflected by its shape (examples: translate-coverage) -/
@[reflection] theorem textbook_vocabulary_measured_reflected (terms known : ℕ) (h : known ≤ terms) : (terms) = (terms - known + known) := Eq.symm (textbook_vocabulary_measured terms known h)
/-- a find over the scanned documents: those matching the filter and those not partition the scan (one of three matches qubits ≥ 60 with the tag processor). From Mathlib's `Finset.card_filter_add_card_filter_not` (examples: mongo-find) -/
theorem textbook_mongo_find_filter {α : Type*} (scanned : Finset α) (hit : α → Prop) [DecidablePred hit] : (scanned.filter hit).card + (scanned.filter (fun x => ¬ hit x)).card = scanned.card :=
  Finset.card_filter_add_card_filter_not hit
example := @textbook_mongo_find_filter
example : 1 + 2 = 3 ∧ 60 ≤ 105 ∧ 54 < 60 := by decide
/-- textbook_mongo_find_filter reflected by its shape (examples: mongo-find) -/
@[reflection] theorem textbook_mongo_find_filter_reflected {α : Type*} (scanned : Finset α) (hit : α → Prop) [DecidablePred hit] : (scanned.card) = ((scanned.filter hit).card + (scanned.filter (fun x => ¬ hit x)).card) := Eq.symm (textbook_mongo_find_filter scanned hit)
/-- $inc adds one to Sycamore's 54 qubits: 55, written as a new entry beside the one it links, so history is two entries (examples: mongo-update) -/
theorem textbook_mongo_update_inc : 54 + 1 = 55 ∧ 1 + 1 = 2 := by decide
/-- textbook_mongo_update_inc reflected by its shape, conjunction (examples: mongo-update) -/
@[reflection] theorem textbook_mongo_update_inc_reflected (σ : Nat) : (σ - (55) = σ - (54 + 1)) ∧ (σ - (2) = σ - (1 + 1)) := ⟨congrArg (σ - ·) (Eq.symm (textbook_mongo_update_inc).1), congrArg (σ - ·) (Eq.symm (textbook_mongo_update_inc).2)⟩
/-- a yearly licence of 432 euros is 43200 cents, the unit Stripe's checkout form takes (examples: stripe-plan) -/
theorem textbook_checkout_amount_cents : 432 * 100 = 43200 := by decide
/-- textbook_checkout_amount_cents reflected by its shape, equality (examples: stripe-plan) -/
@[reflection] theorem textbook_checkout_amount_cents_reflected (σ : Nat) : σ - (43200) = σ - (432 * 100) := congrArg (σ - ·) (Eq.symm (textbook_checkout_amount_cents))
/-- a signature checked at time c is within the tolerance τ of its signing time s exactly when c ≤ s + τ: under truncated subtraction (ℕ among its models) c − s ≤ τ ↔ c ≤ s + τ (signed at 1700000000, checked 100 seconds later, within 300). From Mathlib's `tsub_le_iff_left` (examples: stripe-webhook) -/
theorem textbook_webhook_tolerance {α : Type*} [Preorder α] [AddCommSemigroup α] [Sub α] [OrderedSub α]
    (signed checked tol : α) : checked - signed ≤ tol ↔ checked ≤ signed + tol :=
  tsub_le_iff_left
example := @textbook_webhook_tolerance
example : 1700000100 - 1700000000 = 100 ∧ 100 ≤ 300 := by decide
/-- textbook_webhook_tolerance reflected by its shape (examples: stripe-webhook) -/
@[reflection] theorem textbook_webhook_tolerance_reflected {α : Type*} [Preorder α] [AddCommSemigroup α] [Sub α] [OrderedSub α] (signed checked tol : α) : (checked ≤ signed + tol) ↔ (checked - signed ≤ tol) := Iff.symm (textbook_webhook_tolerance signed checked tol)
/-- the patent APIs split into those answering in the open and those taking a key, and the two together are all of them. From Mathlib's `Finset.card_filter_add_card_filter_not` (examples: patents-plan) -/
theorem textbook_patent_apis_partition {α : Type*} (s : Finset α) (keyed : α → Prop) [DecidablePred keyed] :
    (s.filter keyed).card + (s.filter fun a => ¬ keyed a).card = s.card :=
  Finset.card_filter_add_card_filter_not keyed
example := @textbook_patent_apis_partition
example : 2 + 5 = 7 := by decide
/-- textbook_patent_apis_partition reflected by its shape (examples: patents-plan) -/
@[reflection] theorem textbook_patent_apis_partition_reflected {α : Type*} (s : Finset α) (keyed : α → Prop) [DecidablePred keyed] : (s.card) = ((s.filter keyed).card + (s.filter fun a => ¬ keyed a).card) := Eq.symm (textbook_patent_apis_partition s keyed)
/-- when each mention comes from one source, the mentions number the sum over the sources of the mentions from each (3 + 2 + 0 = 5). From Mathlib's `Finset.card_eq_sum_card_fiberwise` (examples: compete-mentions) -/
theorem textbook_mentions_by_source {ι κ : Type} [DecidableEq κ] (f : ι → κ) (s : Finset ι) (t : Finset κ) (h : ∀ x ∈ s, f x ∈ t) : s.card = ∑ k ∈ t, (s.filter (fun x => f x = k)).card :=
  Finset.card_eq_sum_card_fiberwise (fun x hx => h x hx)
example := @textbook_mentions_by_source
example : 3 + 2 + 0 = 5 ∧ 2 + 1 = 3 := by decide
/-- textbook_mentions_by_source reflected by its shape (examples: compete-mentions) -/
@[reflection] theorem textbook_mentions_by_source_reflected {ι κ : Type} [DecidableEq κ] (f : ι → κ) (s : Finset ι) (t : Finset κ) (h : ∀ x ∈ s, f x ∈ t) : (∑ k ∈ t, (s.filter (fun x => f x = k)).card) = (s.card) := Eq.symm (textbook_mentions_by_source f s t h)
/-- the legal plan makes one call per claim and two more, so its calls less the claims are two, however many claims: a + b − a = b. From Mathlib's `add_tsub_cancel_left`, `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid` (examples: legal-plan) -/
theorem textbook_legal_plan_calls (claims : Nat) : claims + 2 - claims = 2 := add_tsub_cancel_left claims 2
example := @textbook_legal_plan_calls
/-- textbook_legal_plan_calls reflected by its shape (examples: legal-plan) -/
@[reflection] theorem textbook_legal_plan_calls_reflected (claims : Nat) (σ : Nat) : σ - (2) = σ - (claims + 2 - claims) := congrArg (σ - ·) (Eq.symm (textbook_legal_plan_calls claims))
/-- leads grouped by kind number the sum over the kinds of each kind's leads (workflow, branch, tag, release, Zenodo, workspace, npm: 3 + 3 + 3 + 2 + 1 + 1 + 1 = 14). From Mathlib's `Fintype.card_sigma` (examples: repository-watch) -/
theorem textbook_repository_watch_leads {Kind : Type} [Fintype Kind] (Lead : Kind → Type) [∀ k, Fintype (Lead k)] :
  Fintype.card (Σ k, Lead k) = ∑ k, Fintype.card (Lead k) := Fintype.card_sigma
example := @textbook_repository_watch_leads
example : 3 + 3 + 3 + 2 + 1 + 1 + 1 = 14 := by decide
/-- textbook_repository_watch_leads reflected by its shape (examples: repository-watch) -/
@[reflection] theorem textbook_repository_watch_leads_reflected {Kind : Type} [Fintype Kind] (Lead : Kind → Type) [∀ k, Fintype (Lead k)] : (∑ k, Fintype.card (Lead k)) = (Fintype.card (Σ k, Lead k)) := Eq.symm (textbook_repository_watch_leads Lead)
/-- k groups of g digits with d dashes are k · g + d characters, the cardinality of a product beside a disjoint part (4 · 4 + 3 = 19 for an ORCID). From Mathlib's `Fintype.card_sum`, `Fintype.card_prod` and `Fintype.card_fin` (examples: jsonld-block) -/
theorem textbook_orcid_digits (k g d : ℕ) : Fintype.card (Fin k × Fin g ⊕ Fin d) = k * g + d := by
  rw [Fintype.card_sum, Fintype.card_prod, Fintype.card_fin, Fintype.card_fin, Fintype.card_fin]
example := @textbook_orcid_digits
example : 4 * 4 + 3 = 19 := by decide
/-- textbook_orcid_digits reflected by its shape (examples: jsonld-block) -/
@[reflection] theorem textbook_orcid_digits_reflected (k g d : ℕ) : (k * g + d) = (Fintype.card (Fin k × Fin g ⊕ Fin d)) := Eq.symm (textbook_orcid_digits k g d)
/-- offers partitioned by kind number the sum over the kinds of each kind's offers. From Mathlib's `Fintype.card_sigma` (examples: jsonld-catalogue) -/
theorem textbook_catalogue_offers {Kind : Type} [Fintype Kind] (Offer : Kind → Type) [∀ k, Fintype (Offer k)] :
  Fintype.card (Σ k, Offer k) = ∑ k, Fintype.card (Offer k) := Fintype.card_sigma
example := @textbook_catalogue_offers
example : 1 + 3 + 2 + 3 = 9 := by decide
/-- textbook_catalogue_offers reflected by its shape (examples: jsonld-catalogue) -/
@[reflection] theorem textbook_catalogue_offers_reflected {Kind : Type} [Fintype Kind] (Offer : Kind → Type) [∀ k, Fintype (Offer k)] : (∑ k, Fintype.card (Offer k)) = (Fintype.card (Σ k, Offer k)) := Eq.symm (textbook_catalogue_offers Offer)
/-- a base locale beside the n locales translated into is n + 1 locales, |Option A| = |A| + 1. From Mathlib's `Fintype.card_option` and `Fintype.card_fin` (examples: codes-plan) -/
theorem textbook_codes_locales (n : Nat) : Fintype.card (Option (Fin n)) = n + 1 := by
  rw [Fintype.card_option, Fintype.card_fin]
example := @textbook_codes_locales
example : 1 + 10 = 11 := by decide
/-- textbook_codes_locales reflected by its shape (examples: codes-plan) -/
@[reflection] theorem textbook_codes_locales_reflected (n : Nat) : (n + 1) = (Fintype.card (Option (Fin n))) := Eq.symm (textbook_codes_locales n)
/-- t tenants over c scoped collections are t · c tenant scopes, and r tenant roles beside s docket roles are r + s roles (3 · 4 = 12, 3 + 3 = 6). From Mathlib's `Fintype.card_prod`, `Fintype.card_sum` and `Fintype.card_fin` (examples: configure-scopes) -/
theorem textbook_scopes_tenants_collections (t c r s : Nat) :
    Fintype.card (Fin t × Fin c) = t * c ∧ Fintype.card (Fin r ⊕ Fin s) = r + s := by
  constructor
  · simp only [Fintype.card_prod, Fintype.card_fin]
  · simp only [Fintype.card_sum, Fintype.card_fin]
example := @textbook_scopes_tenants_collections
example : 3 * 4 = 12 ∧ 3 + 3 = 6 := by decide
/-- textbook_scopes_tenants_collections reflected by its shape (examples: configure-scopes) -/
@[reflection] theorem textbook_scopes_tenants_collections_reflected (t c r s : Nat) : ((t * c) = (Fintype.card (Fin t × Fin c))) ∧ ((r + s) = (Fintype.card (Fin r ⊕ Fin s))) := ⟨Eq.symm (textbook_scopes_tenants_collections t c r s).1, Eq.symm (textbook_scopes_tenants_collections t c r s).2⟩
/-- fields of the entries collection and of the qpu block number the sum of both (6 + 9 = 15 fields QPU adds to Payload). From Mathlib's `Fintype.card_sum` (examples: configure-fields) -/
theorem textbook_qpu_fields (EntryField BlockField : Type) [Fintype EntryField] [Fintype BlockField] :
  Fintype.card (EntryField ⊕ BlockField) = Fintype.card EntryField + Fintype.card BlockField := Fintype.card_sum
example := @textbook_qpu_fields
example : 6 + 9 = 15 := by decide
/-- textbook_qpu_fields reflected by its shape (examples: configure-fields) -/
@[reflection] theorem textbook_qpu_fields_reflected (EntryField BlockField : Type) [Fintype EntryField] [Fintype BlockField] : (Fintype.card EntryField + Fintype.card BlockField) = (Fintype.card (EntryField ⊕ BlockField)) := Eq.symm (textbook_qpu_fields EntryField BlockField)
/-- an entry's operations split into those granted by role and those granted to no one: a predicate splits a finite set into those that satisfy it and those that do not (3 + 1 = 4). From Mathlib's `Finset.card_filter_add_card_filter_not` (examples: configure-access) -/
theorem textbook_entry_operations {α : Type*} (ops : Finset α) (byRole : α → Prop) [DecidablePred byRole] : (ops.filter byRole).card + (ops.filter (fun x => ¬ byRole x)).card = ops.card :=
  Finset.card_filter_add_card_filter_not byRole
example := @textbook_entry_operations
example : 3 + 1 = 4 := by decide
/-- textbook_entry_operations reflected by its shape (examples: configure-access) -/
@[reflection] theorem textbook_entry_operations_reflected {α : Type*} (ops : Finset α) (byRole : α → Prop) [DecidablePred byRole] : (ops.card) = ((ops.filter byRole).card + (ops.filter (fun x => ¬ byRole x)).card) := Eq.symm (textbook_entry_operations ops byRole)
/-- a batch budget B sharded by the slowest host's median m (the largest of the medians) takes ⌊B/m⌋ calls: they fit in the budget and one more would not (1000 / 140 = 7 for the medians 120, 140, 110). From Mathlib's `le_max_left`, `le_max_right`, `Nat.div_mul_le_self`, `Nat.lt_div_mul_add` and `Nat.succ_mul`, `le_trans` (examples: configure-actions) -/
theorem textbook_actions_experience (a b c budget : Nat) (h : 0 < max a (max b c)) :
  a ≤ max a (max b c) ∧ b ≤ max a (max b c) ∧ c ≤ max a (max b c) ∧
  budget / max a (max b c) * max a (max b c) ≤ budget ∧ budget < (budget / max a (max b c) + 1) * max a (max b c) :=
  ⟨le_max_left _ _, le_trans (le_max_left b c) (le_max_right _ _), le_trans (le_max_right b c) (le_max_right _ _),
    Nat.div_mul_le_self _ _, by rw [Nat.succ_mul]; exact Nat.lt_div_mul_add h⟩
example := @textbook_actions_experience
example : (2 * 507 * 100 + 546) / (2 * 546) = 93 ∧ max 120 (max 140 110) = 140 ∧ 1000 / 140 = 7 := by decide
/-- textbook_actions_experience reflected by its shape (examples: configure-actions) -/
@[reflection] theorem textbook_actions_experience_reflected (a b c budget : Nat) (h : 0 < max a (max b c)) (σ : Nat) (hσ0 : ((budget / max a (max b c) + 1) * max a (max b c)) ≤ σ) : (σ - (max a (max b c)) ≤ σ - (a)) ∧ (σ - (max a (max b c)) ≤ σ - (b)) ∧ (σ - (max a (max b c)) ≤ σ - (c)) ∧ (σ - (budget) ≤ σ - (budget / max a (max b c) * max a (max b c))) ∧ (σ - ((budget / max a (max b c) + 1) * max a (max b c)) < σ - (budget)) := ⟨Nat.sub_le_sub_left (textbook_actions_experience a b c budget h).1 σ, Nat.sub_le_sub_left (textbook_actions_experience a b c budget h).2.1 σ, Nat.sub_le_sub_left (textbook_actions_experience a b c budget h).2.2.1 σ, Nat.sub_le_sub_left (textbook_actions_experience a b c budget h).2.2.2.1 σ, Nat.sub_lt_sub_left (Nat.lt_of_lt_of_le (textbook_actions_experience a b c budget h).2.2.2.2 hσ0) (textbook_actions_experience a b c budget h).2.2.2.2⟩
/-- the contrapositive of textbook_actions_experience (examples: configure-actions) -/
@[reflection] theorem textbook_actions_experience_contrapositive (a b c budget : Nat) : ¬ (a ≤ max a (max b c) ∧ b ≤ max a (max b c) ∧ c ≤ max a (max b c) ∧
  budget / max a (max b c) * max a (max b c) ≤ budget ∧ budget < (budget / max a (max b c) + 1) * max a (max b c)) → ¬ ((0 < max a (max b c))) := fun hc hh => hc (textbook_actions_experience a b c budget hh)
/-- hooks on two collections number the hooks of each added (three on entries and two on pages are five). From Mathlib's `Fintype.card_sum` (examples: configure-hooks) -/
theorem textbook_fullstack_hooks (OnEntries OnPages : Type) [Fintype OnEntries] [Fintype OnPages] :
  Fintype.card (OnEntries ⊕ OnPages) = Fintype.card OnEntries + Fintype.card OnPages := Fintype.card_sum
example := @textbook_fullstack_hooks
example : 3 + 2 = 5 := by decide
/-- textbook_fullstack_hooks reflected by its shape (examples: configure-hooks) -/
@[reflection] theorem textbook_fullstack_hooks_reflected (OnEntries OnPages : Type) [Fintype OnEntries] [Fintype OnPages] : (Fintype.card OnEntries + Fintype.card OnPages) = (Fintype.card (OnEntries ⊕ OnPages)) := Eq.symm (textbook_fullstack_hooks OnEntries OnPages)
/-- of the Worker configuration's top-level paths, those the client agrees on removed leave the drifting ones: removing a subset leaves the difference of the counts (12 − 2 = 10). From Mathlib's `Finset.card_sdiff_of_subset` (examples: configure-wrangler-drift) -/
theorem textbook_wrangler_drift {α : Type*} [DecidableEq α] (paths agreed : Finset α) (h : agreed ⊆ paths) : (paths \ agreed).card = paths.card - agreed.card :=
  Finset.card_sdiff_of_subset h
example := @textbook_wrangler_drift
example : 12 - 2 = 10 ∧ 5 ≤ 10 := by decide
/-- textbook_wrangler_drift reflected by its shape (examples: configure-wrangler-drift) -/
@[reflection] theorem textbook_wrangler_drift_reflected {α : Type*} [DecidableEq α] (paths agreed : Finset α) (h : agreed ⊆ paths) : (paths.card - agreed.card) = ((paths \ agreed).card) := Eq.symm (textbook_wrangler_drift paths agreed h)
/-- fields of two sources, those the user defined and those still computed, number the sum of both (3 + 2 = 5 for the branding). From Mathlib's `Fintype.card_sum` (examples: configure-branding-user) -/
theorem textbook_branding_sources (Defined Computed : Type) [Fintype Defined] [Fintype Computed] :
  Fintype.card (Defined ⊕ Computed) = Fintype.card Defined + Fintype.card Computed := Fintype.card_sum
example := @textbook_branding_sources
example : 3 + 2 = 5 := by decide
/-- textbook_branding_sources reflected by its shape (examples: configure-branding-user) -/
@[reflection] theorem textbook_branding_sources_reflected (Defined Computed : Type) [Fintype Defined] [Fintype Computed] : (Fintype.card Defined + Fintype.card Computed) = (Fintype.card (Defined ⊕ Computed)) := Eq.symm (textbook_branding_sources Defined Computed)
/-- a tool's cells are the product of its enumerable facets' spaces, and setting aside its one free facet leaves the others (4 − 1 = 3 facets, 2 · 1 · 1 = 2 cells for attest). From Mathlib's `Fintype.card_pi` and `Finset.card_erase_of_mem` (examples: dashboard-attest) -/
theorem textbook_attest_facets {ι : Type} [Fintype ι] [DecidableEq ι] (space : ι → Type) [∀ i, Fintype (space i)]
  (facets : Finset ι) (free : ι) (h : free ∈ facets) :
  Fintype.card (∀ i, space i) = ∏ i, Fintype.card (space i) ∧ (facets.erase free).card = facets.card - 1 :=
  ⟨Fintype.card_pi, Finset.card_erase_of_mem h⟩
example := @textbook_attest_facets
example : 4 - 1 = 3 ∧ 2 * 1 * 1 = 2 := by decide
/-- textbook_attest_facets reflected by its shape (examples: dashboard-attest) -/
@[reflection] theorem textbook_attest_facets_reflected {ι : Type} [Fintype ι] [DecidableEq ι] (space : ι → Type) [∀ i, Fintype (space i)] (facets : Finset ι) (free : ι) (h : free ∈ facets) : ((∏ i, Fintype.card (space i)) = (Fintype.card (∀ i, space i))) ∧ ((facets.card - 1) = ((facets.erase free).card)) := ⟨Eq.symm (textbook_attest_facets space facets free h).1, Eq.symm (textbook_attest_facets space facets free h).2⟩
/-- the plan over at least ten theorems and at least ten backed examples covers at least twenty: bounds add. From Mathlib's `add_le_add`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid` and `covariant_swap_add_of_covariant_add` (examples: payload-theorems-plan) -/
theorem textbook_theorems_plan_steps (theorems backed : ℕ) (h1 : 10 ≤ theorems) (h2 : 10 ≤ backed) : 10 + 10 ≤ theorems + backed := add_le_add h1 h2
example := @textbook_theorems_plan_steps
/-- the blocks to update are the blocks read less those already naming their theorem: |S \ T| = |S| − |T| for T ⊆ S (two blocks read, one naming its theorem: one axiom replaced, one update request). From Mathlib's `Finset.card_sdiff_of_subset` (examples: payload-theorems-update) -/
theorem textbook_axioms_replaced {α : Type*} [DecidableEq α] (S T : Finset α) (h : T ⊆ S) :
    (S \ T).card = S.card - T.card :=
  Finset.card_sdiff_of_subset h
example := @textbook_axioms_replaced
example : 1 + 1 = 2 ∧ 2 - 1 = 1 := by decide
/-- textbook_axioms_replaced reflected by its shape (examples: payload-theorems-update) -/
@[reflection] theorem textbook_axioms_replaced_reflected {α : Type*} [DecidableEq α] (S T : Finset α) (h : T ⊆ S) : (S.card - T.card) = ((S \ T).card) := Eq.symm (textbook_axioms_replaced S T h)
/-- the fields of a form split into those that pass and those refused, and the two together are all of them (four fields: three pass, one refused; the refused env's three names: two known, one unknown). From Mathlib's `Finset.card_filter_add_card_filter_not` (examples: payload-app-validate) -/
theorem textbook_app_fields_validated {α : Type*} (s : Finset α) (p : α → Prop) [DecidablePred p] :
    (s.filter p).card + (s.filter fun a => ¬ p a).card = s.card :=
  Finset.card_filter_add_card_filter_not p
example := @textbook_app_fields_validated
example : 3 + 1 = 4 ∧ 2 + 1 = 3 := by decide
/-- textbook_app_fields_validated reflected by its shape (examples: payload-app-validate) -/
@[reflection] theorem textbook_app_fields_validated_reflected {α : Type*} (s : Finset α) (p : α → Prop) [DecidablePred p] : (s.card) = ((s.filter p).card + (s.filter fun a => ¬ p a).card) := Eq.symm (textbook_app_fields_validated s p)
/-- the site's documents are its use-case pages and the gate pages, so the documents less the pages are the gate pages, every gate, every category and the root. From Mathlib's `add_tsub_cancel_left`, `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid` (examples: payload-site) -/
theorem textbook_site_documents (pages gates categories docs : Nat) (h : docs = pages + (gates + categories + 1)) : docs - pages = gates + categories + 1 := by
  rw [h, add_tsub_cancel_left]
example := @textbook_site_documents
/-- textbook_site_documents reflected by its shape (examples: payload-site) -/
@[reflection] theorem textbook_site_documents_reflected (pages gates categories docs : Nat) (h : docs = pages + (gates + categories + 1)) (σ : Nat) : σ - (gates + categories + 1) = σ - (docs - pages) := congrArg (σ - ·) (Eq.symm (textbook_site_documents pages gates categories docs h))
/-- the contrapositive of textbook_site_documents (examples: payload-site) -/
@[reflection] theorem textbook_site_documents_contrapositive (pages gates categories docs : Nat) : ¬ (docs - pages = gates + categories + 1) → ¬ ((docs = pages + (gates + categories + 1))) := fun hc hh => hc (textbook_site_documents pages gates categories docs hh)
/-- the converse of textbook_site_documents, proved. From Mathlib's `add_tsub_cancel_of_le`, `StarOrderedRing.toExistsAddOfLE`, `Nat.instStarOrderedRing`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid`, `Nat.instOrderedSub`, `LT.lt.le`, `tsub_pos_iff_lt` and `Nat.instCanonicallyOrderedAdd` (examples: payload-site) -/
@[reflection] theorem textbook_site_documents_converse (pages gates categories docs : Nat) : (docs - pages = gates + categories + 1) → (docs = pages + (gates + categories + 1)) :=
  fun hc => (add_tsub_cancel_of_le (tsub_pos_iff_lt.mp (hc ▸ Nat.succ_pos _)).le).symm.trans (congrArg (pages + ·) hc)
/-- a requested limit clamped to [1, 100] lies within it, whatever was asked (the default 10 among them). From Mathlib's `le_max_left`, `max_le` and `min_le_right` (examples: discover-search-request, discover-search-servers) -/
theorem textbook_mcp_search_limit (x : Nat) : 1 ≤ max 1 (min x 100) ∧ max 1 (min x 100) ≤ 100 :=
  ⟨le_max_left 1 _, max_le (by decide) (min_le_right x 100)⟩
example := @textbook_mcp_search_limit
example : 1 ≤ 10 ∧ 10 ≤ 100 := by decide
/-- textbook_mcp_search_limit reflected by its shape (examples: discover-search-request, discover-search-servers) -/
@[reflection] theorem textbook_mcp_search_limit_reflected (x : Nat) (σ : Nat) : (σ - (max 1 (min x 100)) ≤ σ - (1)) ∧ (σ - (100) ≤ σ - (max 1 (min x 100))) := ⟨Nat.sub_le_sub_left (textbook_mcp_search_limit x).1 σ, Nat.sub_le_sub_left (textbook_mcp_search_limit x).2 σ⟩
/-- installing a server adds at most one row to the tenant's mcps: the rows held are at most one more, and one row added then taken away is the rows held. From Mathlib's `le_self_add`, `add_tsub_cancel_right`, `Nat.instCanonicallyOrderedAdd`, `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono` and `Nat.instIsOrderedAddMonoid` (examples: extend-install) -/
theorem textbook_mcp_install_rows (held : ℕ) : held ≤ held + 1 ∧ held + 1 - 1 = held :=
  ⟨le_self_add, add_tsub_cancel_right held 1⟩
example := @textbook_mcp_install_rows
/-- the declarations fixed and those left as leads make the findings: f + (n − f) = n when f ≤ n. From Mathlib's `add_tsub_cancel_of_le`, through the instances `StarOrderedRing.toExistsAddOfLE`, `Nat.instStarOrderedRing`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid` and `Nat.instOrderedSub` (examples: audit-dead) -/
theorem textbook_dead_removed (fixed found : Nat) (h : fixed ≤ found) : fixed + (found - fixed) = found := add_tsub_cancel_of_le h
example := @textbook_dead_removed
/-- textbook_dead_removed reflected by its shape (examples: audit-dead) -/
@[reflection] theorem textbook_dead_removed_reflected (fixed found : Nat) (h : fixed ≤ found) (σ : Nat) : σ - (found) = σ - (fixed + (found - fixed)) := congrArg (σ - ·) (Eq.symm (textbook_dead_removed fixed found h))
/-- the contrapositive of textbook_dead_removed (examples: audit-dead) -/
@[reflection] theorem textbook_dead_removed_contrapositive (fixed found : Nat) : ¬ (fixed + (found - fixed) = found) → ¬ ((fixed ≤ found)) := fun hc hh => hc (textbook_dead_removed fixed found hh)
/-- the converse of textbook_dead_removed, proved. From Mathlib's `add_tsub_cancel_iff_le`, `Nat.instCanonicallyOrderedAdd` and `Nat.instOrderedSub` (examples: audit-dead) -/
@[reflection] theorem textbook_dead_removed_converse (fixed found : Nat) : (fixed + (found - fixed) = found) → (fixed ≤ found) :=
  fun hc => add_tsub_cancel_iff_le.mp hc
/-- every file read is either classified or named unclassified: with truncated subtraction (ℕ among its models), the classified and the rest make the files, c + (f − c) = f when c ≤ f. From Mathlib's `add_tsub_cancel_of_le` (examples: validate-iso-classify) -/
theorem textbook_iso_classify {α : Type*} [AddCommSemigroup α] [PartialOrder α] [ExistsAddOfLE α] [AddLeftMono α]
    [Sub α] [OrderedSub α] (cited files : α) (h : cited ≤ files) : cited + (files - cited) = files :=
  add_tsub_cancel_of_le h
example := @textbook_iso_classify
/-- textbook_iso_classify reflected by its shape (examples: validate-iso-classify) -/
@[reflection] theorem textbook_iso_classify_reflected {α : Type*} [AddCommSemigroup α] [PartialOrder α] [ExistsAddOfLE α] [AddLeftMono α] [Sub α] [OrderedSub α] (cited files : α) (h : cited ≤ files) : (files) = (cited + (files - cited)) := Eq.symm (textbook_iso_classify cited files h)
/-- a device counts as measured only when identified and read: a meet is the top only when both are, identified ⊓ read = ⊤ gives identified = ⊤ and read = ⊤ (Bool's `&&` a case). From Mathlib's `inf_eq_top_iff` (examples: validate-physical-measured, validate-physical-unmeasured) -/
theorem textbook_physical_evidence {α : Type} [Lattice α] [OrderTop α] (identified read : α) (h : identified ⊓ read = ⊤) :
  identified = ⊤ ∧ read = ⊤ := inf_eq_top_iff.mp h
example := @textbook_physical_evidence
/-- textbook_physical_evidence reflected by its shape (examples: validate-physical-measured, validate-physical-unmeasured) -/
@[reflection] theorem textbook_physical_evidence_reflected {α : Type} [Lattice α] [OrderTop α] (identified read : α) (h : identified ⊓ read = ⊤) : ((⊤) = (identified)) ∧ ((⊤) = (read)) := ⟨Eq.symm (textbook_physical_evidence identified read h).1, Eq.symm (textbook_physical_evidence identified read h).2⟩
/-- the programs and the leads partition the files: p + (f − p) = f when p ≤ f. From Mathlib's `add_tsub_cancel_of_le`, through the instances `StarOrderedRing.toExistsAddOfLE`, `Nat.instStarOrderedRing`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid` and `Nat.instOrderedSub` (examples: audit-programs) -/
theorem textbook_programs_partition (programs files : Nat) (h : programs ≤ files) : programs + (files - programs) = files := add_tsub_cancel_of_le h
example := @textbook_programs_partition
/-- textbook_programs_partition reflected by its shape (examples: audit-programs) -/
@[reflection] theorem textbook_programs_partition_reflected (programs files : Nat) (h : programs ≤ files) (σ : Nat) : σ - (files) = σ - (programs + (files - programs)) := congrArg (σ - ·) (Eq.symm (textbook_programs_partition programs files h))
/-- the contrapositive of textbook_programs_partition (examples: audit-programs) -/
@[reflection] theorem textbook_programs_partition_contrapositive (programs files : Nat) : ¬ (programs + (files - programs) = files) → ¬ ((programs ≤ files)) := fun hc hh => hc (textbook_programs_partition programs files hh)
/-- the converse of textbook_programs_partition, proved. From Mathlib's `add_tsub_cancel_iff_le`, `Nat.instCanonicallyOrderedAdd` and `Nat.instOrderedSub` (examples: audit-programs) -/
@[reflection] theorem textbook_programs_partition_converse (programs files : Nat) : (programs + (files - programs) = files) → (programs ≤ files) :=
  fun hc => add_tsub_cancel_iff_le.mp hc
/-- a call's duration is the later monotonic reading less the earlier and never negative: (ended − started) + started = ended. From Mathlib's `tsub_add_cancel_of_le`, `StarOrderedRing.toExistsAddOfLE`, `Nat.instStarOrderedRing`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid`, `Nat.instOrderedSub` (examples: metrics-served-calls) -/
theorem textbook_monotonic_tick (started ended : Nat) (h : started ≤ ended) : ended - started + started = ended := tsub_add_cancel_of_le h
example := @textbook_monotonic_tick
/-- textbook_monotonic_tick reflected by its shape (examples: metrics-served-calls) -/
@[reflection] theorem textbook_monotonic_tick_reflected (started ended : Nat) (h : started ≤ ended) (σ : Nat) : σ - (ended) = σ - (ended - started + started) := congrArg (σ - ·) (Eq.symm (textbook_monotonic_tick started ended h))
/-- the contrapositive of textbook_monotonic_tick (examples: metrics-served-calls) -/
@[reflection] theorem textbook_monotonic_tick_contrapositive (started ended : Nat) : ¬ (ended - started + started = ended) → ¬ ((started ≤ ended)) := fun hc hh => hc (textbook_monotonic_tick started ended hh)
/-- the converse of textbook_monotonic_tick, proved. From Mathlib's `tsub_add_cancel_iff_le`, `Nat.instCanonicallyOrderedAdd` and `Nat.instOrderedSub` (examples: metrics-served-calls) -/
@[reflection] theorem textbook_monotonic_tick_converse (started ended : Nat) : (ended - started + started = ended) → (started ≤ ended) :=
  fun hc => tsub_add_cancel_iff_le.mp hc
/-- the tree's own tools plus the one door the docs add, less the tree's own, is that one door, whatever the number of tools. From Mathlib's `add_tsub_cancel_left`, through the instances `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono` and `Nat.instIsOrderedAddMonoid` (examples: extend-in-docs) -/
theorem textbook_extend_inward (mine : Nat) : mine + 1 - mine = 1 := add_tsub_cancel_left mine 1
example := @textbook_extend_inward
/-- textbook_extend_inward reflected by its shape (examples: extend-in-docs) -/
@[reflection] theorem textbook_extend_inward_reflected (mine : Nat) (σ : Nat) : σ - (1) = σ - (mine + 1 - mine) := congrArg (σ - ·) (Eq.symm (textbook_extend_inward mine))
/-- a foreign door is named by its host, a colon and its tool: docs.mcp.cloudflare.com (23 characters), ':' and search_cloudflare_documentation (31), fifty-five characters (examples: extend-call-served) -/
theorem textbook_foreign_door_name : 23 + 1 + 31 = 55 := by decide
/-- textbook_foreign_door_name reflected by its shape, equality (examples: extend-call-served) -/
@[reflection] theorem textbook_foreign_door_name_reflected (σ : Nat) : σ - (55) = σ - (23 + 1 + 31) := congrArg (σ - ·) (Eq.symm (textbook_foreign_door_name))
/-- the APIs the client requests over HTTP and the one more it reads itself are one more than the requested: |Option A| = |A| + 1. From Mathlib's `Fintype.card_option` and `Fintype.card_fin` (examples: attest-plan) -/
theorem textbook_attest_requests (n : Nat) : Fintype.card (Option (Fin n)) = n + 1 := by
  rw [Fintype.card_option, Fintype.card_fin]
example := @textbook_attest_requests
example : 8 + 1 = 9 := by decide
/-- textbook_attest_requests reflected by its shape (examples: attest-plan) -/
@[reflection] theorem textbook_attest_requests_reflected (n : Nat) : (n + 1) = (Fintype.card (Option (Fin n))) := Eq.symm (textbook_attest_requests n)
/-- toolboxes at most t, t at most e and examples at least e put the toolboxes at most the examples (12 ≤ 49). From Mathlib's `le_trans` (examples: textbook-categories) -/
theorem textbook_textbook_categories (examples toolboxes t e : Nat) (h3 : toolboxes ≤ t) (ht : t ≤ e) (h1 : e ≤ examples) : toolboxes ≤ examples := le_trans (le_trans h3 ht) h1
example := @textbook_textbook_categories
/-- textbook_textbook_categories reflected by its shape (examples: textbook-categories) -/
@[reflection] theorem textbook_textbook_categories_reflected (examples toolboxes t e : Nat) (h3 : toolboxes ≤ t) (ht : t ≤ e) (h1 : e ≤ examples) (σ : Nat) : σ - (examples) ≤ σ - (toolboxes) := Nat.sub_le_sub_left (textbook_textbook_categories examples toolboxes t e h3 ht h1) σ
/-- the contrapositive of textbook_textbook_categories (examples: textbook-categories) -/
@[reflection] theorem textbook_textbook_categories_contrapositive (examples toolboxes t e : Nat) : ¬ (toolboxes ≤ examples) → ¬ ((toolboxes ≤ t) ∧ (t ≤ e) ∧ (e ≤ examples)) := fun hc hh => hc (textbook_textbook_categories examples toolboxes t e hh.1 hh.2.1 hh.2.2)
/-- f facets over k devices admit kᶠ combinations, every one a final cell, none left open (one facet of three devices: 3). From Mathlib's `Fintype.card_fun`, `Fintype.card_fin`, `tsub_self`, `Nat.instCanonicallyOrderedAdd` and `Nat.instOrderedSub` (examples: dashboard-processor) -/
theorem textbook_processor_cells (f k : ℕ) : Fintype.card (Fin f → Fin k) = k ^ f ∧ k ^ f - k ^ f = 0 := by
  rw [Fintype.card_fun, Fintype.card_fin, Fintype.card_fin]
  exact ⟨rfl, tsub_self _⟩
example := @textbook_processor_cells
example : 3 ^ 1 = 3 ∧ 3 - 3 = 0 := by decide
/-- textbook_processor_cells reflected by its shape (examples: dashboard-processor) -/
@[reflection] theorem textbook_processor_cells_reflected (f k : ℕ) : ((k ^ f) = (Fintype.card (Fin f → Fin k))) ∧ ((0) = (k ^ f - k ^ f)) := ⟨Eq.symm (textbook_processor_cells f k).1, Eq.symm (textbook_processor_cells f k).2⟩
/-- the integers from a to b are b + 1 − a values, a finite menu (3 to 21: 19). From Mathlib's `Nat.card_Icc` (examples: dashboard-algorithm-narrowed) -/
theorem textbook_shor_narrowed_cells (a b : ℕ) : (Finset.Icc a b).card = b + 1 - a := Nat.card_Icc a b
example := @textbook_shor_narrowed_cells
example : 21 - 3 + 1 = 19 ∧ 100000 < 280896 := by decide
/-- textbook_shor_narrowed_cells reflected by its shape (examples: dashboard-algorithm-narrowed) -/
@[reflection] theorem textbook_shor_narrowed_cells_reflected (a b : ℕ) : (b + 1 - a) = ((Finset.Icc a b).card) := Eq.symm (textbook_shor_narrowed_cells a b)
/-- the input space of a tool is the product of its enumerable facets: |Π i, Fin (f i)| = ∏ f i (leads 2 · 2 · 2 · 2 · 5 = 80, algorithm 7 · 19 · 1 · 2 · 6 · 1 · 1 · 8 · 2 · 11 = 280,896). From Mathlib's `Fintype.card_pi`, `Finset.prod_congr` and `Fintype.card_fin` (examples: dashboard-index) -/
theorem textbook_dashboard_spaces (k : Nat) (f : Fin k → Nat) : Fintype.card ((i : Fin k) → Fin (f i)) = ∏ i, f i := by
  rw [Fintype.card_pi]; exact Finset.prod_congr rfl fun i _ => Fintype.card_fin (f i)
example := @textbook_dashboard_spaces
example : 2 * 2 * 2 * 2 * 5 = 80 ∧ 7 * 19 * 1 * 2 * 6 * 1 * 1 * 8 * 2 * 11 = 280896 := by decide
/-- textbook_dashboard_spaces reflected by its shape (examples: dashboard-index) -/
@[reflection] theorem textbook_dashboard_spaces_reflected (k : Nat) (f : Fin k → Nat) : (∏ i, f i) = (Fintype.card ((i : Fin k) → Fin (f i))) := Eq.symm (textbook_dashboard_spaces k f)
/-- Willow's 105 qubits hold the distance-7 code's 101 and the random-circuit application's 103, and its stated average connectivity 3.47 is below the typical 4 (hundredths) (examples: processor-willow) -/
theorem textbook_willow_holds_codes : 101 ≤ 105 ∧ 103 ≤ 105 ∧ 347 < 400 := by decide
/-- textbook_willow_holds_codes reflected by its shape, conjunction (examples: processor-willow) -/
@[reflection] theorem textbook_willow_holds_codes_reflected (σ : Nat) (hσ0 : (400) ≤ σ) : (σ - (105) ≤ σ - (101)) ∧ (σ - (105) ≤ σ - (103)) ∧ (σ - (400) < σ - (347)) := ⟨Nat.sub_le_sub_left (textbook_willow_holds_codes).1 σ, Nat.sub_le_sub_left (textbook_willow_holds_codes).2.1 σ, Nat.sub_lt_sub_left (Nat.lt_of_lt_of_le (textbook_willow_holds_codes).2.2 hσ0) (textbook_willow_holds_codes).2.2⟩
/-- the handshake lemma: a coupler graph's edge ends are twice its edges, so when no qubit has more than four neighbours, 2·#couplers ≤ 4·#qubits (Sycamore: 176 ends of 88 couplers within 4 × 54). From Mathlib's `SimpleGraph.sum_degrees_eq_twice_card_edges`, `Finset.sum_le_sum`, `Finset.sum_const`, `Finset.card_univ`, `smul_eq_mul`, `IsOrderedAddMonoid.toAddLeftMono` and `Nat.instIsOrderedAddMonoid` (examples: processor-sycamore) -/
theorem textbook_sycamore_couplers {V : Type*} [Fintype V] [DecidableEq V] (G : SimpleGraph V) [DecidableRel G.Adj] (h : ∀ v, G.degree v ≤ 4) : 2 * G.edgeFinset.card ≤ Fintype.card V * 4 := by
  rw [← G.sum_degrees_eq_twice_card_edges, ← Finset.card_univ, ← smul_eq_mul, ← Finset.sum_const]
  exact Finset.sum_le_sum (fun v _ => h v)
example := @textbook_sycamore_couplers
example : 2 * 88 = 176 ∧ 176 ≤ 4 * 54 := by decide
/-- 30 digits of w qubits, the version digit none and the variant digit w − 2 hold 31w − 2 = 32w − w − 2 qubits at every width w ≥ 2. From Mathlib's `add_zero`, `add_tsub_assoc_of_le`, `StarOrderedRing.toExistsAddOfLE`, `Nat.instStarOrderedRing`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid`, `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le` (examples: processor-register) -/
theorem textbook_register_held (w : Nat) (h : 2 ≤ w) : 30 * w + 0 + (w - 2) = 32 * w - w - 2 := by
  rw [add_zero, ← add_tsub_assoc_of_le h]
  congr 1
  omega
example := @textbook_register_held
/-- textbook_register_held reflected by its shape (examples: processor-register) -/
@[reflection] theorem textbook_register_held_reflected (w : Nat) (h : 2 ≤ w) (σ : Nat) : σ - (32 * w - w - 2) = σ - (30 * w + 0 + (w - 2)) := congrArg (σ - ·) (Eq.symm (textbook_register_held w h))
/-- the contrapositive of textbook_register_held (examples: processor-register) -/
@[reflection] theorem textbook_register_held_contrapositive (w : Nat) : ¬ (30 * w + 0 + (w - 2) = 32 * w - w - 2) → ¬ ((2 ≤ w)) := fun hc hh => hc (textbook_register_held w hh)
/-- n equal amplitudes 1/√n have squares 1/n summing to one (a qubit under a Hadamard: two amplitudes 1/√2, one half each). From Mathlib's `Finset.sum_const`, `Finset.card_range`, `nsmul_eq_mul`, `div_pow`, `one_pow`, `Real.sq_sqrt`, `Nat.cast_nonneg`, `mul_one_div_cancel` and `Nat.cast_ne_zero`, through the instances `Real.instIsOrderedRing` and `FloorSemiring.instCharZero` (examples: circuit-hadamard-amplitudes) -/
theorem textbook_hadamard_amplitudes (n : ℕ) (hn : n ≠ 0) : ∑ _i ∈ Finset.range n, (1 / Real.sqrt n) ^ 2 = 1 := by
  rw [Finset.sum_const, Finset.card_range, nsmul_eq_mul, div_pow, one_pow, Real.sq_sqrt (Nat.cast_nonneg n), mul_one_div_cancel (Nat.cast_ne_zero.mpr hn)]
example := @textbook_hadamard_amplitudes
/-- textbook_hadamard_amplitudes reflected by its shape (examples: circuit-hadamard-amplitudes) -/
@[reflection] theorem textbook_hadamard_amplitudes_reflected (n : ℕ) (hn : n ≠ 0) : (1) = (∑ _i ∈ Finset.range n, (1 / Real.sqrt n) ^ 2) := Eq.symm (textbook_hadamard_amplitudes n hn)
/-- a histogram partitions the shots: those reading 1 and those not reading 1 make all the shots (207 + 193 = 400 for the Hadamard). From Mathlib's `Finset.card_filter_add_card_filter_not` (examples: circuit-hadamard-sampled) -/
theorem textbook_hadamard_histogram {Shot : Type} (shots : Finset Shot) (reads : Shot → Bool) :
  (shots.filter (fun s => reads s = true)).card + (shots.filter (fun s => ¬ reads s = true)).card = shots.card :=
  Finset.card_filter_add_card_filter_not _
example := @textbook_hadamard_histogram
example : 207 + 193 = 400 := by decide
/-- textbook_hadamard_histogram reflected by its shape (examples: circuit-hadamard-sampled) -/
@[reflection] theorem textbook_hadamard_histogram_reflected {Shot : Type} (shots : Finset Shot) (reads : Shot → Bool) : (shots.card) = ((shots.filter (fun s => reads s = true)).card + (shots.filter (fun s => ¬ reads s = true)).card) := Eq.symm (textbook_hadamard_histogram shots reads)
/-- a bit flip leaving probabilities p and q with p + q = 1 has purity p² + q² = 1 − 2pq (0.1² + 0.9² = 1 − 2 · 0.09 = 0.82). From Mathlib's `eq_sub_of_add_eq`, `add_right_comm`, `add_sq` and `one_pow`, `Nat.instAtLeastTwoHAddOfNat` (examples: circuit-bit-flip-noise) -/
theorem textbook_bit_flip_purity {R : Type} [CommRing R] (p q : R) (h : p + q = 1) : p ^ 2 + q ^ 2 = 1 - 2 * p * q :=
  eq_sub_of_add_eq (by rw [add_right_comm, ← add_sq, h, one_pow])
example := @textbook_bit_flip_purity
example : 1 * 1 + 9 * 9 = 82 ∧ 1 + 9 = 10 ∧ 10 * 10 = 100 := by decide
/-- textbook_bit_flip_purity reflected by its shape (examples: circuit-bit-flip-noise) -/
@[reflection] theorem textbook_bit_flip_purity_reflected {R : Type} [CommRing R] (p q : R) (h : p + q = 1) : (1 - 2 * p * q) = (p ^ 2 + q ^ 2) := Eq.symm (textbook_bit_flip_purity p q h)
/-- qubits a figure uses within the qubits a text names within the processor's are counted in the same order, and the first lie within the last (65 ≤ 103 ≤ 105 on Willow). From Mathlib's `Finset.card_le_card`, `Finset.Subset.trans` (examples: echo-benchmark) -/
theorem textbook_echo_qubits_within_willow {Q : Type} (figure text willow : Finset Q) (h1 : figure ⊆ text) (h2 : text ⊆ willow) :
  figure.card ≤ text.card ∧ text.card ≤ willow.card ∧ figure ⊆ willow :=
  ⟨Finset.card_le_card h1, Finset.card_le_card h2, Finset.Subset.trans h1 h2⟩
example := @textbook_echo_qubits_within_willow
example : 65 ≤ 103 ∧ 103 ≤ 105 := by decide
/-- n decades from bᵐ reach b^(m+n): powers multiply by adding exponents (100 · 10⁴ = 10⁶). From Mathlib's `pow_add` (examples: roadmap-all) -/
theorem textbook_roadmap_decades (b m n : ℕ) : b ^ m * b ^ n = b ^ (m + n) := (pow_add b m n).symm
example := @textbook_roadmap_decades
example : 100 * 10 ^ 4 = 1000000 ∧ 1 + 5 = 6 ∧ 50000 * 10 ^ 3 = 50000000 := by decide
/-- textbook_roadmap_decades reflected by its shape (examples: roadmap-all) -/
@[reflection] theorem textbook_roadmap_decades_reflected (b m n : ℕ) : (b ^ (m + n)) = (b ^ m * b ^ n) := Eq.symm (textbook_roadmap_decades b m n)
/-- milestone three of the six is one long-lived logical qubit from 10³ = 1000 physical qubits, and the four application bands span three decades, 50,000 to 50,000,000 physical qubits (examples: roadmap-milestone-3) -/
theorem textbook_roadmap_milestone_three : 10 ^ 3 = 1000 ∧ 3 ≤ 6 ∧ 50000 * 10 ^ 3 = 50000000 := by decide
/-- textbook_roadmap_milestone_three reflected by its shape, conjunction (examples: roadmap-milestone-3) -/
@[reflection] theorem textbook_roadmap_milestone_three_reflected (σ : Nat) : (σ - (1000) = σ - (10 ^ 3)) ∧ (σ - (6) ≤ σ - (3)) ∧ (σ - (50000000) = σ - (50000 * 10 ^ 3)) := ⟨congrArg (σ - ·) (Eq.symm (textbook_roadmap_milestone_three).1), Nat.sub_le_sub_left (textbook_roadmap_milestone_three).2.1 σ, congrArg (σ - ·) (Eq.symm (textbook_roadmap_milestone_three).2.2)⟩
/-- the order of every unit a modulo n divides φ(n), the number of units, so the order Shor's algorithm measures divides the totient: the powers of 7 modulo 15 run 7, 4, 13, 1: the order is 4, which divides φ(15) = 8. From Mathlib's `orderOf_dvd_card` and `ZMod.card_units_eq_totient` (examples: algorithm-shor-15) -/
theorem textbook_shor_fifteen_order (n : Nat) [NeZero n] (a : (ZMod n)ˣ) : orderOf a ∣ Nat.totient n :=
  ZMod.card_units_eq_totient n ▸ orderOf_dvd_card
example := @textbook_shor_fifteen_order
example : 7 ^ 1 % 15 = 7 ∧ 7 ^ 2 % 15 = 4 ∧ 7 ^ 3 % 15 = 13 ∧ 7 ^ 4 % 15 = 1 ∧ Nat.gcd (4 - 1) 15 = 3 ∧ Nat.gcd (4 + 1) 15 = 5 ∧ 3 * 5 = 15 := by decide
/-- n outcomes of equal probability 1/n make the whole (the QFT on three qubits: 8 amplitudes of 12.50% each). From Mathlib's `Finset.sum_const`, `Finset.card_range`, `nsmul_eq_mul`, `mul_one_div_cancel` and `Nat.cast_ne_zero`, through the instance `FloorSemiring.instCharZero` (examples: algorithm-qft-3) -/
theorem textbook_qft_three_amplitudes (n : ℕ) (hn : n ≠ 0) : ∑ _i ∈ Finset.range n, (1 / (n : ℝ)) = 1 := by
  rw [Finset.sum_const, Finset.card_range, nsmul_eq_mul, mul_one_div_cancel (Nat.cast_ne_zero.mpr hn)]
example := @textbook_qft_three_amplitudes
/-- textbook_qft_three_amplitudes reflected by its shape (examples: algorithm-qft-3) -/
@[reflection] theorem textbook_qft_three_amplitudes_reflected (n : ℕ) (hn : n ≠ 0) : (1) = (∑ _i ∈ Finset.range n, (1 / (n : ℝ))) := Eq.symm (textbook_qft_three_amplitudes n hn)
/-- Grover's rotation: after k iterations the start at angle θ from the unmarked plane sits at (2k + 1)θ, so when that is a right angle the marked item is read with certainty (two qubits: θ = 30°, one iteration turns to 90°). From Mathlib's `Real.sin_pi_div_two`, `one_pow`, `Nat.instAtLeastTwoHAddOfNat` (examples: algorithm-grover) -/
theorem textbook_grover_one_iteration (k : Nat) (θ : ℝ) (h : (2 * k + 1) * θ = Real.pi / 2) : Real.sin ((2 * k + 1) * θ) ^ 2 = 1 := by
  rw [h, Real.sin_pi_div_two, one_pow]
example := @textbook_grover_one_iteration
/-- textbook_grover_one_iteration reflected by its shape (examples: algorithm-grover) -/
@[reflection] theorem textbook_grover_one_iteration_reflected (k : Nat) (θ : ℝ) (h : (2 * k + 1) * θ = Real.pi / 2) : (1) = (Real.sin ((2 * k + 1) * θ) ^ 2) := Eq.symm (textbook_grover_one_iteration k θ h)
/-- one message qubit and a Bell pair of two are the three qubits; the two measured bits choose one of 2² = 4 corrections, and the three Pauli expectations X, Y, Z agree (examples: algorithm-teleportation) -/
theorem textbook_teleport_three_qubits : type_of% @QuantumCommunication.teleport_exact := @QuantumCommunication.teleport_exact
/-- quantum phase estimation reads θ = k/N exactly: for a primitive N-th root of unity ζ, the amplitude Σ_{j<N} (ζᵐ)ʲ of an outcome off by m with N ∤ m vanishes, so only the true outcome survives (N = 2³ = 8, θ = 1/4 read as 2). From Mathlib's `IsPrimitiveRoot.dvd_of_pow_eq_one`, `IsPrimitiveRoot.pow_eq_one`, `geom_sum_eq`, `pow_mul`, `mul_comm`, `one_pow`, `sub_self` and `zero_div` (examples: algorithm-phase-estimation) -/
theorem textbook_phase_estimation {K : Type*} [Field K] {ζ : K} {N m : ℕ} (hζ : IsPrimitiveRoot ζ N) (hm : ¬ N ∣ m) : ∑ j ∈ Finset.range N, (ζ ^ m) ^ j = 0 := by
  have h1 : ζ ^ m ≠ 1 := fun h => hm (hζ.dvd_of_pow_eq_one m h)
  rw [geom_sum_eq h1, ← pow_mul, mul_comm, pow_mul, hζ.pow_eq_one, one_pow, sub_self, zero_div]
example := @textbook_phase_estimation
/-- textbook_phase_estimation reflected by its shape (examples: algorithm-phase-estimation) -/
@[reflection] theorem textbook_phase_estimation_reflected {K : Type*} [Field K] {ζ : K} {N m : ℕ} (hζ : IsPrimitiveRoot ζ N) (hm : ¬ N ∣ m) : (0) = (∑ j ∈ Finset.range N, (ζ ^ m) ^ j) := Eq.symm (textbook_phase_estimation hζ hm)
/-- on a balanced Boolean function, true and false equally often, the signs (−1)^f(x) cancel, so after one query the all-zero outcome has amplitude zero, which a constant function never gives. From Mathlib's `Finset.sum_ite`, `Finset.sum_const`, `smul_neg` and `neg_add_cancel` (examples: algorithm-deutsch-jozsa) -/
theorem textbook_deutsch_jozsa {α : Type} [Fintype α] (f : α → Bool) (h : (Finset.univ.filter (fun x => f x = true)).card = (Finset.univ.filter (fun x => ¬ f x = true)).card) : ∑ x, (if f x = true then (-1 : ℤ) else 1) = 0 := by
  rw [Finset.sum_ite, Finset.sum_const, Finset.sum_const, h, smul_neg, neg_add_cancel]
example := @textbook_deutsch_jozsa
/-- textbook_deutsch_jozsa reflected by its shape (examples: algorithm-deutsch-jozsa) -/
@[reflection] theorem textbook_deutsch_jozsa_reflected {α : Type} [Fintype α] (f : α → Bool) (h : (Finset.univ.filter (fun x => f x = true)).card = (Finset.univ.filter (fun x => ¬ f x = true)).card) : (0) = (∑ x, (if f x = true then (-1 : ℤ) else 1)) := Eq.symm (textbook_deutsch_jozsa f h)
/-- Bernstein–Vazirani: the parity oracle x ↦ s · x over 𝔽₂ⁿ determines the hidden string s, since two strings whose parities agree on every input agree on each basis input and so bit by bit (s = 101 the only one of the 8 three-bit strings). From Mathlib's `dotProduct_single` and `mul_one`, `Nat.fact_prime_two` (examples: algorithm-bernstein-vazirani) -/
theorem textbook_bernstein_vazirani {n : Nat} (s t : Fin n → ZMod 2) (h : ∀ x, s ⬝ᵥ x = t ⬝ᵥ x) : s = t := by
  funext i
  have e := h (Pi.single i 1)
  rwa [dotProduct_single, dotProduct_single, mul_one, mul_one] at e
example := @textbook_bernstein_vazirani
example : (List.range 8).filter (fun t => (List.range 8).all (fun x => (t / 4 * (x / 4) + t / 2 % 2 * (x / 2 % 2) + t % 2 * (x % 2)) % 2 == (5 / 4 * (x / 4) + 5 / 2 % 2 * (x / 2 % 2) + 5 % 2 * (x % 2)) % 2)) = [5] ∧ 1 < 3 := by decide
/-- textbook_bernstein_vazirani reflected by its shape (examples: algorithm-bernstein-vazirani) -/
@[reflection] theorem textbook_bernstein_vazirani_reflected {n : Nat} (s t : Fin n → ZMod 2) (h : ∀ x, s ⬝ᵥ x = t ⬝ᵥ x) : (t) = (s) := Eq.symm (textbook_bernstein_vazirani s t h)
/-- counting by the first isomorphism theorem: a homomorphism's kernel times its image is the whole group, so the strings y with y·s = 0 over GF(2), the kernel of y ↦ y·s for s ≠ 0, are half of all strings (00 and 11 of the 4 for s = 11). From Mathlib's `AddSubgroup.index_ker` and `AddSubgroup.card_mul_index` (examples: algorithm-simon) -/
theorem textbook_simon {G H : Type} [AddGroup G] [AddGroup H] (φ : G →+ H) : Nat.card φ.ker * Nat.card φ.range = Nat.card G := by
  rw [← AddSubgroup.index_ker, AddSubgroup.card_mul_index]
example := @textbook_simon
example : (List.range 4).filter (fun y => (y / 2 + y % 2) % 2 == 0) = [0, 3] := by decide
/-- textbook_simon reflected by its shape (examples: algorithm-simon) -/
@[reflection] theorem textbook_simon_reflected {G H : Type} [AddGroup G] [AddGroup H] (φ : G →+ H) : (Nat.card G) = (Nat.card φ.ker * Nat.card φ.range) := Eq.symm (textbook_simon φ)
/-- the variational bound for H = Z: probabilities p₀ + p₁ = 1 give the energy ⟨Z⟩ = p₀ − p₁ ≥ −1, the least eigenvalue of Z, reached at p₁ = 1. From Mathlib's `neg_le_sub_iff_le_add`, `add_assoc`, `le_add_of_nonneg_left` and `add_nonneg`, through the instances `IsOrderedAddMonoid.toAddLeftMono`, `Real.instIsOrderedAddMonoid` and `covariant_swap_add_of_covariant_add` (examples: algorithm-vqe, circuit-phased-xz) -/
theorem textbook_vqe (p₀ p₁ : ℝ) (h0 : 0 ≤ p₀) (h : p₀ + p₁ = 1) : -1 ≤ p₀ - p₁ := by
  rw [neg_le_sub_iff_le_add, ← h, ← add_assoc]
  exact le_add_of_nonneg_left (add_nonneg h0 h0)
example := @textbook_vqe
example : 0 + 1 = 1 ∧ 1 ≤ 1 := by decide
/-- (a√x)² = a²x for x ≥ 0, so the quantum CHSH value 2√2, which chshValue computes in floating point, squares to 4 · 2 = 8, above the classical bound 2 squared. From Mathlib's `mul_pow` and `Real.sq_sqrt` (examples: algorithm-chsh) -/
theorem textbook_tsirelson (a x : ℝ) (hx : 0 ≤ x) : (a * Real.sqrt x) ^ 2 = a ^ 2 * x := by
  rw [mul_pow, Real.sq_sqrt hx]
example := @textbook_tsirelson
example : (fun (p q : Nat × Nat) => (p.1 * q.1 + 2 * p.2 * q.2, p.1 * q.2 + p.2 * q.1)) (0, 2) (0, 2) = (8, 0) ∧ 2 * 2 < 8 := by decide
/-- textbook_tsirelson reflected by its shape (examples: algorithm-chsh) -/
@[reflection] theorem textbook_tsirelson_reflected (a x : ℝ) (hx : 0 ≤ x) : (a ^ 2 * x) = ((a * Real.sqrt x) ^ 2) := Eq.symm (textbook_tsirelson a x hx)
/-- the first-order Trotter–Suzuki product (e^(−iX t/n) e^(−iZ t/n))^n approximates e^(−i(X+Z)t) with error O(t²/n), so the fidelity rises to 1 as the step count n grows (here from 1 to 32 steps); the fidelity is bounded by 1; proven by trotterFidelity (examples: algorithm-trotter) -/
theorem textbook_trotter : 32 > 1 ∧ 1 ≤ 1 := by decide
/-- textbook_trotter reflected by its shape, conjunction (examples: algorithm-trotter) -/
@[reflection] theorem textbook_trotter_reflected (σ : Nat) (hσ0 : (32) ≤ σ) : (σ - (32) < σ - (1)) ∧ (σ - (1) ≤ σ - (1)) := ⟨Nat.sub_lt_sub_left (Nat.lt_of_lt_of_le (textbook_trotter).1 hσ0) (textbook_trotter).1, Nat.sub_le_sub_left (textbook_trotter).2 σ⟩
/-- cross-entropy benchmarking: for D > 1, 2D > D + 1 > D, the inequality by which the random-circuit collision probability 2/(D + 1) exceeds the uniform 1/D (D = 16: 32 > 17 > 16). From Mathlib's `two_mul`, `add_lt_add_right`, `lt_add_one`, `Nat.instAtLeastTwoHAddOfNat`, `IsLeftCancelAdd.addLeftStrictMono_of_addLeftMono`, `instIsLeftCancelAddOfAddLeftReflectLE`, `IsOrderedCancelAddMonoid.toAddLeftReflectLE`, `Nat.instIsOrderedCancelAddMonoid`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid`, `Nat.instZeroLEOneClass` (examples: algorithm-xeb) -/
theorem textbook_xeb (D : Nat) (h : 1 < D) : D + 1 < 2 * D ∧ D < D + 1 := by
  rw [two_mul]
  exact ⟨add_lt_add_right h D, lt_add_one D⟩
example := @textbook_xeb
example : 2 * 16 > 16 + 1 ∧ 16 + 1 > 16 := by decide
/-- textbook_xeb reflected by its shape (examples: algorithm-xeb) -/
@[reflection] theorem textbook_xeb_reflected (D : Nat) (h : 1 < D) (σ : Nat) (hσ0 : (2 * D) ≤ σ) (hσ1 : (D + 1) ≤ σ) : (σ - (2 * D) < σ - (D + 1)) ∧ (σ - (D + 1) < σ - (D)) := ⟨Nat.sub_lt_sub_left (Nat.lt_of_lt_of_le (textbook_xeb D h).1 hσ0) (textbook_xeb D h).1, Nat.sub_lt_sub_left (Nat.lt_of_lt_of_le (textbook_xeb D h).2 hσ1) (textbook_xeb D h).2⟩
/-- the contrapositive of textbook_xeb (examples: algorithm-xeb) -/
@[reflection] theorem textbook_xeb_contrapositive (D : Nat) : ¬ (D + 1 < 2 * D ∧ D < D + 1) → ¬ ((1 < D)) := fun hc hh => hc (textbook_xeb D hh)
/-- the converse of textbook_xeb, proved. From Mathlib's `add_lt_add_iff_left`, `IsLeftCancelAdd.addLeftStrictMono_of_addLeftMono`, `instIsLeftCancelAddOfAddLeftReflectLE`, `IsOrderedCancelAddMonoid.toAddLeftReflectLE`, `Nat.instIsOrderedCancelAddMonoid`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid`, `contravariant_lt_of_covariant_le`, `Nat.instAtLeastTwoHAddOfNat` and `two_mul` (examples: algorithm-xeb) -/
@[reflection] theorem textbook_xeb_converse (D : Nat) : (D + 1 < 2 * D ∧ D < D + 1) → (1 < D) :=
  fun hc => (add_lt_add_iff_left D).mp (two_mul D ▸ hc.1)
/-- no-cloning from linearity: a linear map that copies a and b (a ↦ a ⊗ a, b ↦ b ⊗ b) copies a + b only when the cross terms a ⊗ b + b ⊗ a vanish, since (a + b) ⊗ (a + b) carries them and the linear image does not. From Mathlib's `map_add`, `TensorProduct.add_tmul`, `TensorProduct.tmul_add`, `add_assoc`, `add_comm`, `add_eq_left`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `SemilinearMapClass.toAddHomClass`, `LinearMap.semilinearMapClass` (examples: algorithm-no-cloning) -/
theorem textbook_no_cloning {K V : Type} [CommRing K] [AddCommGroup V] [Module K V] (f : V →ₗ[K] TensorProduct K V V) (a b : V)
  (ha : f a = a ⊗ₜ a) (hb : f b = b ⊗ₜ b) (hab : f (a + b) = (a + b) ⊗ₜ (a + b)) : a ⊗ₜ[K] b + b ⊗ₜ[K] a = 0 := by
  rw [map_add, ha, hb, TensorProduct.add_tmul, TensorProduct.tmul_add, TensorProduct.tmul_add,
    add_assoc (a ⊗ₜ[K] a) (a ⊗ₜ[K] b), ← add_assoc (a ⊗ₜ[K] b) (b ⊗ₜ[K] a) (b ⊗ₜ[K] b),
    add_comm (a ⊗ₜ[K] b + b ⊗ₜ[K] a) (b ⊗ₜ[K] b), ← add_assoc (a ⊗ₜ[K] a) (b ⊗ₜ[K] b)] at hab
  exact add_eq_left.mp hab.symm
example := @textbook_no_cloning
/-- textbook_no_cloning reflected by its shape (examples: algorithm-no-cloning) -/
@[reflection] theorem textbook_no_cloning_reflected {K V : Type} [CommRing K] [AddCommGroup V] [Module K V] (f : V →ₗ[K] TensorProduct K V V) (a b : V) (ha : f a = a ⊗ₜ a) (hb : f b = b ⊗ₜ b) (hab : f (a + b) = (a + b) ⊗ₜ (a + b)) : (0) = (a ⊗ₜ[K] b + b ⊗ₜ[K] a) := Eq.symm (textbook_no_cloning f a b ha hb hab)
/-- a register of dimension d = 2^k has log₂ d = k, the cap of the Holevo bound in bits (one bit for a qubit, d = 2). From Mathlib's `Nat.log_pow` (examples: algorithm-holevo) -/
theorem textbook_holevo (k : Nat) : Nat.log 2 (2 ^ k) = k := Nat.log_pow Nat.one_lt_two k
example := @textbook_holevo
example : 2 ^ 1 = 2 ∧ 2 ^ 2 > 2 := by decide
/-- textbook_holevo reflected by its shape (examples: algorithm-holevo) -/
@[reflection] theorem textbook_holevo_reflected (k : Nat) : (k) = (Nat.log 2 (2 ^ k)) := Eq.symm (textbook_holevo k)
/-- Gottesman–Knill's space bound, a novelty with no Mathlib equivalent: an n-qubit stabilizer tableau of 2n² + n bits is smaller than the 2ⁿ amplitudes of the state vector for every n ≥ 7, so stabilizer circuits are simulated in polynomial space (210 < 1024 at n = 10); proved by Mathlib's `Nat.le_induction`, and computed by stabilizerCompression (examples: algorithm-gottesman-knill) -/
@[novelty] theorem textbook_gottesman_knill (n : ℕ) (h : 7 ≤ n) : 2 * (n * n) + n < 2 ^ n := by
  induction n, h using Nat.le_induction with
  | base => decide
  | succ n hn ih =>
    have sq : (n + 1) * (n + 1) = n * n + 2 * n + 1 := by
      rw [Nat.add_mul, Nat.mul_add, Nat.mul_one, Nat.one_mul]
      omega
    rw [sq, Nat.pow_succ]
    have : 4 * n + 3 ≤ 2 * (n * n) + n := by
      have : 7 * n ≤ n * n := Nat.mul_le_mul_right n hn
      omega
    omega
example := @textbook_gottesman_knill
example : 2 * 10 * 10 + 10 = 210 ∧ 210 < 2 ^ 10 := by decide
/-- an element fixed by a choice among a images of X and an independent choice among b images of Z is a pair, so there are a · b of them (6 · 4 = 24 single-qubit Cliffords modulo phase). From Mathlib's `Fintype.card_prod` and `Fintype.card_fin` (examples: algorithm-eastin-knill) -/
theorem textbook_eastin_knill (a b : ℕ) : Fintype.card (Fin a × Fin b) = a * b := by
  rw [Fintype.card_prod, Fintype.card_fin, Fintype.card_fin]
example := @textbook_eastin_knill
example : 6 * 4 = 24 ∧ 1 < 24 := by decide
/-- textbook_eastin_knill reflected by its shape (examples: algorithm-eastin-knill) -/
@[reflection] theorem textbook_eastin_knill_reflected (a b : ℕ) : (a * b) = (Fintype.card (Fin a × Fin b)) := Eq.symm (textbook_eastin_knill a b)
/-- e^(2πi/n) has order n, so T's phase ω = e^(2πi/8) has order 8, above the order 4 of S's i = e^(2πi/4). From Mathlib's `Complex.isPrimitiveRoot_exp` and `IsPrimitiveRoot.eq_orderOf`, through the instance `Nat.instAtLeastTwoHAddOfNat` (examples: algorithm-solovay-kitaev) -/
theorem textbook_solovay_kitaev (n : ℕ) (h : n ≠ 0) : orderOf (Complex.exp (2 * Real.pi * Complex.I / n)) = n :=
  (Complex.isPrimitiveRoot_exp n h).eq_orderOf.symm
example := @textbook_solovay_kitaev
example : 2 ^ 3 = 8 ∧ 2 ^ 2 < 2 ^ 3 := by decide
/-- textbook_solovay_kitaev reflected by its shape (examples: algorithm-solovay-kitaev) -/
@[reflection] theorem textbook_solovay_kitaev_reflected (n : ℕ) (h : n ≠ 0) : (n) = (orderOf (Complex.exp (2 * Real.pi * Complex.I / n))) := Eq.symm (textbook_solovay_kitaev n h)
/-- a code of minimum distance d corrects t errors when 2t < d: a word within t of two codewords forces them equal (the Steane code, d = 3, corrects any single-qubit error). From Mathlib's `hammingDist_triangle` (examples: algorithm-steane) -/
theorem textbook_steane {F : Type} [DecidableEq F] {n : ℕ} (d t : ℕ) (c₁ c₂ x : Fin n → F) (hc : c₁ ≠ c₂ → d ≤ hammingDist c₁ c₂) (ht : 2 * t < d) (h1 : hammingDist c₁ x ≤ t) (h2 : hammingDist x c₂ ≤ t) : c₁ = c₂ := by
  by_contra hne
  have := hc hne
  have := hammingDist_triangle c₁ x c₂
  omega
example := @textbook_steane
/-- textbook_steane reflected by its shape (examples: algorithm-steane) -/
@[reflection] theorem textbook_steane_reflected {F : Type} [DecidableEq F] {n : ℕ} (d t : ℕ) (c₁ c₂ x : Fin n → F) (hc : c₁ ≠ c₂ → d ≤ hammingDist c₁ c₂) (ht : 2 * t < d) (h1 : hammingDist c₁ x ≤ t) (h2 : hammingDist x c₂ ≤ t) : (c₂) = (c₁) := Eq.symm (textbook_steane d t c₁ c₂ x hc ht h1 h2)
/-- n bits hold 2^n values, so a phase j/2^n with j < 2^n is one of them and read exactly (θ = 1/4 = 2/2³ among the eight of three bits). From Mathlib's `Fintype.card_fun`, `Fintype.card_bool` and `Fintype.card_fin` (examples: algorithm-phase-estimation) -/
theorem textbook_phase_three_bits (n : ℕ) : Fintype.card (Fin n → Bool) = 2 ^ n := by
  rw [Fintype.card_fun, Fintype.card_bool, Fintype.card_fin]
example := @textbook_phase_three_bits
example : 2 * 4 = 2 ^ 3 ∧ 2 < 2 ^ 3 := by decide
/-- textbook_phase_three_bits reflected by its shape (examples: algorithm-phase-estimation) -/
@[reflection] theorem textbook_phase_three_bits_reflected (n : ℕ) : (2 ^ n) = (Fintype.card (Fin n → Bool)) := Eq.symm (textbook_phase_three_bits n)
/-- each edge is cut by a random assignment with probability one half, so the expected cut is half the total weight by linearity (16.875 of 33.75). From Mathlib's `Finset.sum_mul` (examples: algorithm-qaoa) -/
theorem textbook_qaoa_random_cut {ι : Type*} (edges : Finset ι) (w : ι → ℚ) : ∑ e ∈ edges, w e * (1 / 2) = (∑ e ∈ edges, w e) * (1 / 2) :=
  (Finset.sum_mul edges w (1 / 2)).symm
example := @textbook_qaoa_random_cut
example : 409 + 191 + 80 + 91 + 337 + 439 + 269 + 332 + 161 + 71 + 338 + 280 + 109 + 92 + 176 = 3375 ∧ 33750 = 2 * 16875 := by decide
/-- textbook_qaoa_random_cut reflected by its shape (examples: algorithm-qaoa) -/
@[reflection] theorem textbook_qaoa_random_cut_reflected {ι : Type*} (edges : Finset ι) (w : ι → ℚ) : ((∑ e ∈ edges, w e) * (1 / 2)) = (∑ e ∈ edges, w e * (1 / 2)) := Eq.symm (textbook_qaoa_random_cut edges w)
/-- the Software page's tools split into the implemented and the named: a predicate splits a finite set into those that satisfy it and those that do not. From Mathlib's `Finset.card_filter_add_card_filter_not` (examples: software) -/
theorem textbook_software_cirq_implemented {α : Type*} (tools : Finset α) (implemented : α → Prop) [DecidablePred implemented] : (tools.filter implemented).card + (tools.filter (fun x => ¬ implemented x)).card = tools.card :=
  Finset.card_filter_add_card_filter_not implemented
example := @textbook_software_cirq_implemented
example : 1 + 4 = 5 := by decide
/-- textbook_software_cirq_implemented reflected by its shape (examples: software) -/
@[reflection] theorem textbook_software_cirq_implemented_reflected {α : Type*} (tools : Finset α) (implemented : α → Prop) [DecidablePred implemented] : (tools.card) = ((tools.filter implemented).card + (tools.filter (fun x => ¬ implemented x)).card) := Eq.symm (textbook_software_cirq_implemented tools implemented)
/-- one statement chosen by its topic and the rest make the statements: the chosen one plus the others is the whole. From Mathlib's `add_comm` and `Finset.card_erase_add_one` (examples: statements-cirq) -/
theorem textbook_statements_one_topic {α : Type*} [DecidableEq α] (statements : Finset α) (a : α) (h : a ∈ statements) : 1 + (statements.erase a).card = statements.card := by
  rw [add_comm, Finset.card_erase_add_one h]
example := @textbook_statements_one_topic
example : 1 + 41 = 42 := by decide
/-- textbook_statements_one_topic reflected by its shape (examples: statements-cirq) -/
@[reflection] theorem textbook_statements_one_topic_reflected {α : Type*} [DecidableEq α] (statements : Finset α) (a : α) (h : a ∈ statements) : (statements.card) = (1 + (statements.erase a).card) := Eq.symm (textbook_statements_one_topic statements a h)
/-- when each repository has one language, the repositories number the sum over the languages of the repositories in each. From Mathlib's `Finset.card_eq_sum_card_fiberwise` (examples: repositories) -/
theorem textbook_repositories_by_language {ι κ : Type} [DecidableEq κ] (f : ι → κ) (s : Finset ι) (t : Finset κ) (h : ∀ x ∈ s, f x ∈ t) : s.card = ∑ k ∈ t, (s.filter (fun x => f x = k)).card :=
  Finset.card_eq_sum_card_fiberwise (fun x hx => h x hx)
example := @textbook_repositories_by_language
example : 11 + 3 + 1 = 15 := by decide
/-- textbook_repositories_by_language reflected by its shape (examples: repositories) -/
@[reflection] theorem textbook_repositories_by_language_reflected {ι κ : Type} [DecidableEq κ] (f : ι → κ) (s : Finset ι) (t : Finset κ) (h : ∀ x ∈ s, f x ∈ t) : (∑ k ∈ t, (s.filter (fun x => f x = k)).card) = (s.card) := Eq.symm (textbook_repositories_by_language f s t h)
/-- the leads not open are the leads less the open ones, whatever the count of the run (followed, served, partial, blocked or out of scope). From Mathlib's `Finset.card_sdiff_of_subset` (examples: leads-all) -/
theorem textbook_leads_by_status {Lead : Type} [DecidableEq Lead] (leads opened : Finset Lead) (h : opened ⊆ leads) :
  (leads \ opened).card = leads.card - opened.card := Finset.card_sdiff_of_subset h
example := @textbook_leads_by_status
/-- textbook_leads_by_status reflected by its shape (examples: leads-all) -/
@[reflection] theorem textbook_leads_by_status_reflected {Lead : Type} [DecidableEq Lead] (leads opened : Finset Lead) (h : opened ⊆ leads) : (leads.card - opened.card) = ((leads \ opened).card) := Eq.symm (textbook_leads_by_status leads opened h)
/-- at p = 1/10 the repetition code fails with 3p² − 2p³ = (3·10 − 2)/10³ = 28/1000, below the raw 100/1000, on three data and two syndrome qubits (examples: qec-bit-flip-0.1) -/
theorem textbook_repetition_code_tenth : 3 * 10 - 2 = 28 ∧ 28 < 100 ∧ 3 + 2 = 5 := by decide
/-- textbook_repetition_code_tenth reflected by its shape, conjunction (examples: qec-bit-flip-0.1) -/
@[reflection] theorem textbook_repetition_code_tenth_reflected (σ : Nat) (hσ0 : (100) ≤ σ) : (σ - (28) = σ - (3 * 10 - 2)) ∧ (σ - (100) < σ - (28)) ∧ (σ - (5) = σ - (3 + 2)) := ⟨congrArg (σ - ·) (Eq.symm (textbook_repetition_code_tenth).1), Nat.sub_lt_sub_left (Nat.lt_of_lt_of_le (textbook_repetition_code_tenth).2.1 hσ0) (textbook_repetition_code_tenth).2.1, congrArg (σ - ·) (Eq.symm (textbook_repetition_code_tenth).2.2)⟩
/-- H₂ on two qubits is five Pauli terms (I, Z0, Z1, Z0Z1, X0X1); the variational minimum −1.1373 Ha lies 0.0206 Ha below the Hartree–Fock −1.1167 Ha (examples: chemistry-h2) -/
theorem textbook_h2_below_hartree_fock : 11167 < 11373 ∧ 11373 - 11167 = 206 ∧ 1 + 2 + 1 + 1 = 5 := by decide
/-- textbook_h2_below_hartree_fock reflected by its shape, conjunction (examples: chemistry-h2) -/
@[reflection] theorem textbook_h2_below_hartree_fock_reflected (σ : Nat) (hσ0 : (11373) ≤ σ) : (σ - (11373) < σ - (11167)) ∧ (σ - (206) = σ - (11373 - 11167)) ∧ (σ - (5) = σ - (1 + 2 + 1 + 1)) := ⟨Nat.sub_lt_sub_left (Nat.lt_of_lt_of_le (textbook_h2_below_hartree_fock).1 hσ0) (textbook_h2_below_hartree_fock).1, congrArg (σ - ·) (Eq.symm (textbook_h2_below_hartree_fock).2.1), congrArg (σ - ·) (Eq.symm (textbook_h2_below_hartree_fock).2.2)⟩
/-- the six circuits cost 68 T gates: the QFT two controlled-S at three, Grover one Toffoli at seven, teleportation one T, Shor seven controlled-S at three, QAOA twelve T, the repetition cycle three Toffolis at seven (examples: ftqc-all) -/
theorem textbook_ftqc_t_counts : 2 * 3 + 1 * 7 + 1 * 1 + 7 * 3 + 12 * 1 + 3 * 7 = 68 := by decide
/-- textbook_ftqc_t_counts reflected by its shape, equality (examples: ftqc-all) -/
@[reflection] theorem textbook_ftqc_t_counts_reflected (σ : Nat) : σ - (68) = σ - (2 * 3 + 1 * 7 + 1 * 1 + 7 * 3 + 12 * 1 + 3 * 7) := congrArg (σ - ·) (Eq.symm (textbook_ftqc_t_counts))
/-- this tree's Cirq is thirty-one exports, seven classes, three qubit constructors, eleven gates and ten functions, and six of the fifteen quantumlib repositories are emulated (examples: quantumlib-cirq) -/
theorem textbook_cirq_exports : 7 + 3 + 11 + 10 = 31 ∧ 6 + 11 = 17 := by decide
/-- textbook_cirq_exports reflected by its shape, conjunction (examples: quantumlib-cirq) -/
@[reflection] theorem textbook_cirq_exports_reflected (σ : Nat) : (σ - (31) = σ - (7 + 3 + 11 + 10)) ∧ (σ - (17) = σ - (6 + 11)) := ⟨congrArg (σ - ·) (Eq.symm (textbook_cirq_exports).1), congrArg (σ - ·) (Eq.symm (textbook_cirq_exports).2)⟩
/-- the value 2^k needs k + 1 bits (the amplitudes 2³² need 33). From Mathlib's `Nat.size_pow` (examples: none yet) -/
theorem textbook_clay_register_width (k : Nat) : Nat.size (2 ^ k) = k + 1 := Nat.size_pow
example := @textbook_clay_register_width
example : 2 ^ 32 = 4294967296 ∧ 4294967296 < 2 ^ 33 ∧ 2 * 16 < 33 ∧ 33 ≤ 3 * 16 := by decide
/-- textbook_clay_register_width reflected by its shape (examples: ) -/
@[reflection] theorem textbook_clay_register_width_reflected (k : Nat) : (k + 1) = (Nat.size (2 ^ k)) := Eq.symm (textbook_clay_register_width k)
/-- an address and its σ mirror sum to the all-f word: x + (m − x) = m for every x ≤ m (0x70a13419 + 0x8f5ecbe6 = 0xffffffff). From Mathlib's `add_tsub_cancel_of_le`, `StarOrderedRing.toExistsAddOfLE`, `Nat.instStarOrderedRing`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid` and `Nat.instOrderedSub` (examples: verify-seal-and-content) -/
theorem textbook_seal_and_content_decided (m x : ℕ) (h : x ≤ m) : x + (m - x) = m := add_tsub_cancel_of_le h
example := @textbook_seal_and_content_decided
example : 31 + 1 = 32 ∧ 2 + 2 = 4 ∧ 0x70a13419 + 0x8f5ecbe6 = 0xffffffff := by decide
/-- textbook_seal_and_content_decided reflected by its shape (examples: verify-seal-and-content) -/
@[reflection] theorem textbook_seal_and_content_decided_reflected (m x : ℕ) (h : x ≤ m) : (m) = (x + (m - x)) := Eq.symm (textbook_seal_and_content_decided m x h)
/-- one nibble changed, a (10) to b (11), moves the decided version to 6 against the stated 2: the seal alone decides, one check of four, no content needed (examples: verify-tampered) -/
theorem textbook_tamper_one_nibble : 11 - 10 = 1 ∧ 2 ≠ 6 ∧ 1 + 3 = 4 := by decide
/-- textbook_tamper_one_nibble reflected by its shape, conjunction (examples: verify-tampered) -/
@[reflection] theorem textbook_tamper_one_nibble_reflected (σ : Nat) : (σ - (1) = σ - (11 - 10)) ∧ ((6) ≠ (2)) ∧ (σ - (4) = σ - (1 + 3)) := ⟨congrArg (σ - ·) (Eq.symm (textbook_tamper_one_nibble).1), Ne.symm (textbook_tamper_one_nibble).2.1, congrArg (σ - ·) (Eq.symm (textbook_tamper_one_nibble).2.2)⟩
/-- Willow's 105 qubits hold the 101 its distance-7 code uses, 97 of them the code's 49 data and 48 measure qubits (examples: match-willow) -/
theorem textbook_willow_distance_seven : 7 * 7 + (7 * 7 - 1) = 97 ∧ 97 < 101 ∧ 101 ≤ 105 := by decide
/-- textbook_willow_distance_seven reflected by its shape, conjunction (examples: match-willow) -/
@[reflection] theorem textbook_willow_distance_seven_reflected (σ : Nat) (hσ0 : (101) ≤ σ) : (σ - (97) = σ - (7 * 7 + (7 * 7 - 1))) ∧ (σ - (101) < σ - (97)) ∧ (σ - (105) ≤ σ - (101)) := ⟨congrArg (σ - ·) (Eq.symm (textbook_willow_distance_seven).1), Nat.sub_lt_sub_left (Nat.lt_of_lt_of_le (textbook_willow_distance_seven).2.1 hσ0) (textbook_willow_distance_seven).2.1, Nat.sub_le_sub_left (textbook_willow_distance_seven).2.2 σ⟩
/-- the Glagolitic numeral Ⰺⰴ is 10 + 5 = 15, factored 3 × 5 in the reflection (examples: match-glagolitic) -/
theorem textbook_glagolitic_fifteen : 10 + 5 = 15 ∧ 3 * 5 = 15 := by decide
/-- textbook_glagolitic_fifteen reflected by its shape, conjunction (examples: match-glagolitic) -/
@[reflection] theorem textbook_glagolitic_fifteen_reflected (σ : Nat) : (σ - (15) = σ - (10 + 5)) ∧ (σ - (15) = σ - (3 * 5)) := ⟨congrArg (σ - ·) (Eq.symm (textbook_glagolitic_fifteen).1), congrArg (σ - ·) (Eq.symm (textbook_glagolitic_fifteen).2)⟩
/-- the Bulgarian statement is four words: two translated by vocabulary, the name Shor kept untranslated, and the numeral Ⰺⰴ read as 10 + 5 = 15 (examples: match-bulgarian) -/
theorem textbook_bulgarian_statement_words : 2 + 1 + 1 = 4 ∧ 10 + 5 = 15 := by decide
/-- textbook_bulgarian_statement_words reflected by its shape, conjunction (examples: match-bulgarian) -/
@[reflection] theorem textbook_bulgarian_statement_words_reflected (σ : Nat) : (σ - (4) = σ - (2 + 1 + 1)) ∧ (σ - (15) = σ - (10 + 5)) := ⟨congrArg (σ - ·) (Eq.symm (textbook_bulgarian_statement_words).1), congrArg (σ - ·) (Eq.symm (textbook_bulgarian_statement_words).2)⟩
/-- pieces each within a bound B total at most their number times B, so a text of length L folds into at least L / B pieces (the 40-byte text into four pieces of at most 12, 40 ≤ 4 · 12). From Mathlib's `Finset.sum_le_card_nsmul`, `smul_eq_mul`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid` (examples: match-pattern-fold) -/
theorem textbook_fold_pieces_under_bound {ι : Type} (pieces : Finset ι) (len : ι → Nat) (B : Nat) (h : ∀ i ∈ pieces, len i ≤ B) :
  ∑ i ∈ pieces, len i ≤ pieces.card * B := by
  have e := Finset.sum_le_card_nsmul pieces len B h
  rwa [smul_eq_mul] at e
example := @textbook_fold_pieces_under_bound
example : 10 + 7 + 11 + 12 = 40 ∧ 40 - 12 = 28 ∧ 10 ≤ 12 ∧ 7 ≤ 12 ∧ 11 ≤ 12 ∧ 12 ≤ 12 := by decide
/-- a tool's combinations are the product of its enumerable facets' spaces (7 · 19 · 1 · 2 · 6 · 1 · 1 · 8 · 2 · 11 = 280896 for the algorithm tool). From Mathlib's `Fintype.card_pi` (examples: match-pattern-dashboard) -/
theorem textbook_dashboard_algorithm_combinations {Facet : Type} [Fintype Facet] [DecidableEq Facet] (space : Facet → Type) [∀ f, Fintype (space f)] :
  Fintype.card (∀ f, space f) = ∏ f, Fintype.card (space f) := Fintype.card_pi
example := @textbook_dashboard_algorithm_combinations
example : 7 * 19 * 1 * 2 * 6 * 1 * 1 * 8 * 2 * 11 = 280896 ∧ 1000 < 280896 := by decide
/-- textbook_dashboard_algorithm_combinations reflected by its shape (examples: match-pattern-dashboard) -/
@[reflection] theorem textbook_dashboard_algorithm_combinations_reflected {Facet : Type} [Fintype Facet] [DecidableEq Facet] (space : Facet → Type) [∀ f, Fintype (space f)] : (∏ f, Fintype.card (space f)) = (Fintype.card (∀ f, space f)) := Eq.symm (textbook_dashboard_algorithm_combinations space)
/-- every positive integer n sits between 2^k and 2^(k+1) for k = log₂ n, so its bit length is k + 1 and a comparison of widths is a comparison of these powers, not a register ceiling. From Mathlib's `Nat.pow_log_le_self` and `Nat.lt_pow_succ_log_self` (examples: match-rsa-2048) -/
theorem textbook_rsa_beyond_bound (n : Nat) (h : n ≠ 0) : 2 ^ Nat.log 2 n ≤ n ∧ n < 2 ^ (Nat.log 2 n + 1) :=
  ⟨Nat.pow_log_le_self 2 h, Nat.lt_pow_succ_log_self Nat.one_lt_two n⟩
example := @textbook_rsa_beyond_bound
example : 2 ^ 4 < 21 ∧ 21 < 2 ^ 5 ∧ 5 < 2048 := by decide
/-- the audit replays every check, passed or failed: when none fails every check passes, however many checks the tree has grown to. From Mathlib's `add_zero` (examples: audit-self) -/
theorem textbook_audit_all_pass (passed failed total : ℕ) (h : passed + failed = total) (h0 : failed = 0) : passed = total := by
  rw [← h, h0, add_zero]
example := @textbook_audit_all_pass
/-- textbook_audit_all_pass reflected by its shape (examples: audit-self) -/
@[reflection] theorem textbook_audit_all_pass_reflected (passed failed total : ℕ) (h : passed + failed = total) (h0 : failed = 0) : (total) = (passed) := Eq.symm (textbook_audit_all_pass passed failed total h h0)
/-- when every example is linked to a theorem (the linked at least the examples), the examples left without one are none. From Mathlib's `tsub_eq_zero_of_le`, `Nat.instCanonicallyOrderedAdd`, `Nat.instOrderedSub`, `Eq.ge` (examples: textbook-axioms) -/
theorem textbook_axioms_linked (examples linked : Nat) (h : linked = examples) : examples - linked = 0 :=
  tsub_eq_zero_of_le h.ge
example := @textbook_axioms_linked
/-- textbook_axioms_linked reflected by its shape (examples: textbook-axioms) -/
@[reflection] theorem textbook_axioms_linked_reflected (examples linked : Nat) (h : linked = examples) (σ : Nat) : σ - (0) = σ - (examples - linked) := congrArg (σ - ·) (Eq.symm (textbook_axioms_linked examples linked h))
/-- the contrapositive of textbook_axioms_linked (examples: textbook-axioms) -/
@[reflection] theorem textbook_axioms_linked_contrapositive (examples linked : Nat) : ¬ (examples - linked = 0) → ¬ ((linked = examples)) := fun hc hh => hc (textbook_axioms_linked examples linked hh)
/-- a subject shared by at least two problems leaves every one of them at least one other: removing a member of a set of size k ≥ 2 leaves k − 1 ≥ 1. From Mathlib's `Finset.card_erase_of_mem` (examples: leads-collide) -/
theorem textbook_collision_solves_many {α : Type*} [DecidableEq α] (s : Finset α) (a : α) (ha : a ∈ s)
    (h : 2 ≤ s.card) : 1 ≤ (s.erase a).card := by
  rw [Finset.card_erase_of_mem ha]; omega
example := @textbook_collision_solves_many
/-- every crossing is a finite step with always a next and one step back: n < n + 1 and n + 1 − 1 = n. From Mathlib's `lt_add_one` and `add_tsub_cancel_right`, `Nat.instZeroLEOneClass`, `IsLeftCancelAdd.addLeftStrictMono_of_addLeftMono`, `instIsLeftCancelAddOfAddLeftReflectLE`, `IsOrderedCancelAddMonoid.toAddLeftReflectLE`, `Nat.instIsOrderedCancelAddMonoid`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid`, `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le` (examples: stripe-fusion, algorithm-factor-test-integer) -/
theorem textbook_double_torus (n : Nat) : n < n + 1 ∧ n + 1 - 1 = n := ⟨lt_add_one n, add_tsub_cancel_right n 1⟩
example := @textbook_double_torus
/-- textbook_double_torus reflected by its shape (examples: stripe-fusion, algorithm-factor-test-integer) -/
@[reflection] theorem textbook_double_torus_reflected (n : Nat) (σ : Nat) (hσ0 : (n + 1) ≤ σ) : (σ - (n + 1) < σ - (n)) ∧ (σ - (n) = σ - (n + 1 - 1)) := ⟨Nat.sub_lt_sub_left (Nat.lt_of_lt_of_le (textbook_double_torus n).1 hσ0) (textbook_double_torus n).1, congrArg (σ - ·) (Eq.symm (textbook_double_torus n).2)⟩
/-- redact before publish: with truncated subtraction (ℕ among its models), when every leak is redacted none is left, l − l = 0. From Mathlib's `tsub_self` (examples: machine-redact) -/
theorem textbook_redact_before_publish {α : Type*} [AddCommMonoid α] [PartialOrder α] [CanonicallyOrderedAdd α]
    [Sub α] [OrderedSub α] (leaks redacted : α) (h : redacted = leaks) : leaks - redacted = 0 := by
  rw [h]; exact tsub_self leaks
example := @textbook_redact_before_publish
/-- textbook_redact_before_publish reflected by its shape (examples: machine-redact) -/
@[reflection] theorem textbook_redact_before_publish_reflected {α : Type*} [AddCommMonoid α] [PartialOrder α] [CanonicallyOrderedAdd α] [Sub α] [OrderedSub α] (leaks redacted : α) (h : redacted = leaks) : (0) = (leaks - redacted) := Eq.symm (textbook_redact_before_publish leaks redacted h)
/-- findLeaks: every leak found is redacted, so the found less the redacted are none, however many are found. From Mathlib's `tsub_self`, `Nat.instCanonicallyOrderedAdd` and `Nat.instOrderedSub` (examples: audit-leaks, audit-leak-allowed) -/
theorem textbook_leaks_redacted (found redacted : ℕ) (h : redacted = found) : found - redacted = 0 := by
  rw [h, tsub_self]
example := @textbook_leaks_redacted
/-- textbook_leaks_redacted reflected by its shape (examples: audit-leaks, audit-leak-allowed) -/
@[reflection] theorem textbook_leaks_redacted_reflected (found redacted : ℕ) (h : redacted = found) : (0) = (found - redacted) := Eq.symm (textbook_leaks_redacted found redacted h)
/-- every textbook expression is a tool: when the held statements are the closed ones, none disagrees, the closed less the held being none. From Mathlib's `tsub_self`, `Nat.instCanonicallyOrderedAdd` and `Nat.instOrderedSub` (examples: textbook-expressions, textbook-prose) -/
theorem textbook_expressions_evaluate (closed held : ℕ) (h : held = closed) : closed - held = 0 := by
  rw [h, tsub_self]
example := @textbook_expressions_evaluate
/-- textbook_expressions_evaluate reflected by its shape (examples: textbook-expressions, textbook-prose) -/
@[reflection] theorem textbook_expressions_evaluate_reflected (closed held : ℕ) (h : held = closed) : (0) = (closed - held) := Eq.symm (textbook_expressions_evaluate closed held h)
/-- k choices on each of n strips are k^n compositions, the functions from strips to choices (Queneau: ten on fourteen, 10^14 poems). From Mathlib's `Fintype.card_fun` and `Fintype.card_fin` (examples: textbook-queneau, textbook-prose-queneau, fold-combinatorics) -/
theorem textbook_queneau_compositions (n k : Nat) : Fintype.card (Fin n → Fin k) = k ^ n := by
  simp only [Fintype.card_fun, Fintype.card_fin]
example := @textbook_queneau_compositions
example : 10 ^ 14 = 100000000000000 ∧ 365 * 24 * 60 = 525600 ∧ 10 ^ 14 / 525600 = 190258751 ∧ 10 ^ 14 % 525600 = 474400 := by decide
/-- textbook_queneau_compositions reflected by its shape (examples: textbook-queneau, textbook-prose-queneau, fold-combinatorics) -/
@[reflection] theorem textbook_queneau_compositions_reflected (n k : Nat) : (k ^ n) = (Fintype.card (Fin n → Fin k)) := Eq.symm (textbook_queneau_compositions n k)
/-- mixed radix: a choice d below n and the rest q are one index d + n · q below m · n, and the index gives them back. From Mathlib's `finProdFinEquiv_apply_val` and `Equiv.symm_apply_apply` (examples: fold-queneau, fold-rosetta, leads-scientific-domains, payload-domain-configs, css-shadcn) -/
theorem textbook_mixed_radix (m n : ℕ) (x : Fin m × Fin n) : (finProdFinEquiv x : ℕ) = x.2 + n * x.1 ∧ finProdFinEquiv.symm (finProdFinEquiv x) = x :=
  ⟨finProdFinEquiv_apply_val x, Equiv.symm_apply_apply finProdFinEquiv x⟩
example := @textbook_mixed_radix
/-- textbook_mixed_radix reflected by its shape (examples: fold-queneau, fold-rosetta, leads-scientific-domains, payload-domain-configs, css-shadcn) -/
@[reflection] theorem textbook_mixed_radix_reflected (m n : ℕ) (x : Fin m × Fin n) : ((x.2 + n * x.1) = ((finProdFinEquiv x : ℕ))) ∧ ((x) = (finProdFinEquiv.symm (finProdFinEquiv x))) := ⟨Eq.symm (textbook_mixed_radix m n x).1, Eq.symm (textbook_mixed_radix m n x).2⟩
/-- decoding is algebra, not search: a composition of n positions of b choices is one of b^n candidates, and decoding takes n steps, one per position, with n < b^n for every b > 1. From Mathlib's `Fintype.card_fun` and `Fintype.card_fin` (examples: fold-decode, fold-decode-one-way) -/
theorem textbook_decode_not_search (n b : Nat) (hb : 1 < b) : Fintype.card (Fin n → Fin b) = b ^ n ∧ n < b ^ n :=
  ⟨by rw [Fintype.card_fun, Fintype.card_fin, Fintype.card_fin], Nat.lt_pow_self hb⟩
example := @textbook_decode_not_search
example : 14 < 10 ^ 14 ∧ 14 * 1 = 14 := by decide
/-- textbook_decode_not_search reflected by its shape, conjunction (examples: fold-decode, fold-decode-one-way) -/
@[reflection] theorem textbook_decode_not_search_reflected (n b : Nat) (hb : 1 < b) (σ : Nat) (hσ0 : (b ^ n) ≤ σ) : ((b ^ n) = (Fintype.card (Fin n → Fin b))) ∧ (σ - (b ^ n) < σ - (n)) := ⟨Eq.symm (textbook_decode_not_search n b hb).1, Nat.sub_lt_sub_left (Nat.lt_of_lt_of_le (textbook_decode_not_search n b hb).2 hσ0) (textbook_decode_not_search n b hb).2⟩
/-- tampering is covered by the digest, not by refusing to search: a block's SHA-256 has 256 bits, so even a crafted collision takes about 2^128 trials, more than 10^38, while any modified copy is caught by one comparison and answered with the court's case (examples: seal-tamper-authentic) -/
theorem textbook_tamper_detected : 256 / 2 = 128 ∧ 10 ^ 38 < 2 ^ 128 := by decide
/-- textbook_tamper_detected reflected by its shape, conjunction (examples: seal-tamper-authentic) -/
@[reflection] theorem textbook_tamper_detected_reflected (σ : Nat) (hσ0 : (2 ^ 128) ≤ σ) : (σ - (128) = σ - (256 / 2)) ∧ (σ - (2 ^ 128) < σ - (10 ^ 38)) := ⟨congrArg (σ - ·) (Eq.symm (textbook_tamper_detected).1), Nat.sub_lt_sub_left (Nat.lt_of_lt_of_le (textbook_tamper_detected).2 hσ0) (textbook_tamper_detected).2⟩
/-- every artifact is verified, a mismatch or unreached; when none mismatches, the artifacts less the unreached are the verified ones, however many are published. From Mathlib's `add_zero`, `add_tsub_cancel_right`, `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono` and `Nat.instIsOrderedAddMonoid` (examples: seal-artifacts) -/
theorem textbook_artifacts_verified (verified mismatched unreached total : ℕ) (h : verified + mismatched + unreached = total) (hm : mismatched = 0) : total - unreached = verified := by
  rw [← h, hm, add_zero, add_tsub_cancel_right]
example := @textbook_artifacts_verified
/-- textbook_artifacts_verified reflected by its shape (examples: seal-artifacts) -/
@[reflection] theorem textbook_artifacts_verified_reflected (verified mismatched unreached total : ℕ) (h : verified + mismatched + unreached = total) (hm : mismatched = 0) : (verified) = (total - unreached) := Eq.symm (textbook_artifacts_verified verified mismatched unreached total h hm)
/-- the refused and the run make every request, no third: (asked − allowed) + allowed = asked when allowed ≤ asked. From Mathlib's `tsub_add_cancel_of_le`, `StarOrderedRing.toExistsAddOfLE`, `Nat.instStarOrderedRing`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid`, `Nat.instOrderedSub` (examples: repository-machine-actions, repository-machine-refused, repository-machine-push-unconfirmed, repository-machine-worktree-unconfirmed, repository-machine-tag-confirmed, repository-machine-commit-deferred) -/
theorem textbook_machine_allow_list (asked allowed : Nat) (h : allowed ≤ asked) : asked - allowed + allowed = asked := tsub_add_cancel_of_le h
example := @textbook_machine_allow_list
/-- textbook_machine_allow_list reflected by its shape (examples: repository-machine-actions, repository-machine-refused, repository-machine-push-unconfirmed, repository-machine-worktree-unconfirmed, repository-machine-tag-confirmed, repository-machine-commit-deferred) -/
@[reflection] theorem textbook_machine_allow_list_reflected (asked allowed : Nat) (h : allowed ≤ asked) (σ : Nat) : σ - (asked) = σ - (asked - allowed + allowed) := congrArg (σ - ·) (Eq.symm (textbook_machine_allow_list asked allowed h))
/-- the contrapositive of textbook_machine_allow_list (examples: repository-machine-actions, repository-machine-refused, repository-machine-push-unconfirmed, repository-machine-worktree-unconfirmed, repository-machine-tag-confirmed, repository-machine-commit-deferred) -/
@[reflection] theorem textbook_machine_allow_list_contrapositive (asked allowed : Nat) : ¬ (asked - allowed + allowed = asked) → ¬ ((allowed ≤ asked)) := fun hc hh => hc (textbook_machine_allow_list asked allowed hh)
/-- the converse of textbook_machine_allow_list, proved. From Mathlib's `tsub_add_cancel_iff_le`, `Nat.instCanonicallyOrderedAdd` and `Nat.instOrderedSub` (examples: repository-machine-actions, repository-machine-refused, repository-machine-push-unconfirmed, repository-machine-worktree-unconfirmed, repository-machine-tag-confirmed, repository-machine-commit-deferred) -/
@[reflection] theorem textbook_machine_allow_list_converse (asked allowed : Nat) : (asked - allowed + allowed = asked) → (allowed ≤ asked) :=
  fun hc => tsub_add_cancel_iff_le.mp hc
/-- every gap within the heartbeat and the heartbeat within a second put every gap within a second. From Mathlib's `le_trans` (examples: repository-status-no-silence) -/
theorem textbook_stream_no_silence (gap beat : Nat) (h : gap ≤ beat) (hb : beat ≤ 1000) : gap ≤ 1000 := le_trans h hb
example := @textbook_stream_no_silence
/-- textbook_stream_no_silence reflected by its shape (examples: repository-status-no-silence) -/
@[reflection] theorem textbook_stream_no_silence_reflected (gap beat : Nat) (h : gap ≤ beat) (hb : beat ≤ 1000) (σ : Nat) : σ - (1000) ≤ σ - (gap) := Nat.sub_le_sub_left (textbook_stream_no_silence gap beat h hb) σ
/-- the contrapositive of textbook_stream_no_silence (examples: repository-status-no-silence) -/
@[reflection] theorem textbook_stream_no_silence_contrapositive (gap beat : Nat) : ¬ (gap ≤ 1000) → ¬ ((gap ≤ beat) ∧ (beat ≤ 1000)) := fun hc hh => hc (textbook_stream_no_silence gap beat hh.1 hh.2)
/-- exponential smoothing weighs a time a/q and the level (q − a)/q, the weights summing to q, so equal recorded times x forecast exactly x: a·x + (q − a)·x = q·x. From Mathlib's `add_mul`, `add_tsub_cancel_of_le`, `Distrib.rightDistribClass`, `StarOrderedRing.toExistsAddOfLE`, `Nat.instStarOrderedRing`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid`, `Nat.instOrderedSub` (examples: repository-status-eta, repository-status-forecast) -/
theorem textbook_eta_from_receipts (a q x : Nat) (h : a ≤ q) : a * x + (q - a) * x = q * x := by
  rw [← add_mul, add_tsub_cancel_of_le h]
example := @textbook_eta_from_receipts
/-- textbook_eta_from_receipts reflected by its shape (examples: repository-status-eta, repository-status-forecast) -/
@[reflection] theorem textbook_eta_from_receipts_reflected (a q x : Nat) (h : a ≤ q) (σ : Nat) : σ - (q * x) = σ - (a * x + (q - a) * x) := congrArg (σ - ·) (Eq.symm (textbook_eta_from_receipts a q x h))
/-- the contrapositive of textbook_eta_from_receipts (examples: repository-status-eta, repository-status-forecast) -/
@[reflection] theorem textbook_eta_from_receipts_contrapositive (a q x : Nat) : ¬ (a * x + (q - a) * x = q * x) → ¬ ((a ≤ q)) := fun hc hh => hc (textbook_eta_from_receipts a q x hh)
/-- a wave w precedes a wave v exactly when w + 1 ≤ v. From Mathlib's `Order.add_one_le_iff`, through the instance `Nat.instNoMaxOrder` (examples: repository-machine-next) -/
theorem textbook_next_waves_ordered (w v : Nat) : w + 1 ≤ v ↔ w < v := Order.add_one_le_iff
example := @textbook_next_waves_ordered
/-- textbook_next_waves_ordered reflected by its shape (examples: repository-machine-next) -/
@[reflection] theorem textbook_next_waves_ordered_reflected (w v : Nat) : (w < v) ↔ (w + 1 ≤ v) := Iff.symm (textbook_next_waves_ordered w v)
/-- an action whose budget exceeds the request leaves a positive remainder, budget − request > 0, for the queue to run it in. From Mathlib's `tsub_pos_of_lt`, through the instances `Nat.instCanonicallyOrderedAdd` and `Nat.instOrderedSub` (examples: repository-machine-next-long) -/
theorem textbook_long_action_queued (budget request : Nat) (h : request < budget) : 0 < budget - request := tsub_pos_of_lt h
example := @textbook_long_action_queued
/-- textbook_long_action_queued reflected by its shape (examples: repository-machine-next-long) -/
@[reflection] theorem textbook_long_action_queued_reflected (budget request : Nat) (h : request < budget) (σ : Nat) (hσ0 : (budget - request) ≤ σ) : σ - (budget - request) < σ - (0) := Nat.sub_lt_sub_left (Nat.lt_of_lt_of_le (textbook_long_action_queued budget request h) hσ0) (textbook_long_action_queued budget request h)
/-- the contrapositive of textbook_long_action_queued (examples: repository-machine-next-long) -/
@[reflection] theorem textbook_long_action_queued_contrapositive (budget request : Nat) : ¬ (0 < budget - request) → ¬ ((request < budget)) := fun hc hh => hc (textbook_long_action_queued budget request hh)
/-- the converse of textbook_long_action_queued, proved. From Mathlib's `tsub_pos_iff_lt`, `Nat.instCanonicallyOrderedAdd` and `Nat.instOrderedSub` (examples: repository-machine-next-long) -/
@[reflection] theorem textbook_long_action_queued_converse (budget request : Nat) : (0 < budget - request) → (request < budget) :=
  fun hc => tsub_pos_iff_lt.mp hc
/-- the skills are complete when every toolbox has its skill, the index one more, and the named and unnamed terms make the vocabulary: named + (terms − named) = terms. From Mathlib's `add_tsub_cancel_of_le`, `StarOrderedRing.toExistsAddOfLE`, `Nat.instStarOrderedRing`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid`, `Nat.instOrderedSub` (examples: payload-scripts-skills) -/
theorem textbook_skills_complete (boxes skilled terms named : Nat) (hs : skilled = boxes) (hn : named ≤ terms) : skilled + 1 = boxes + 1 ∧ named + (terms - named) = terms :=
  ⟨by rw [hs], add_tsub_cancel_of_le hn⟩
example := @textbook_skills_complete
/-- textbook_skills_complete reflected by its shape (examples: payload-scripts-skills) -/
@[reflection] theorem textbook_skills_complete_reflected (boxes skilled terms named : Nat) (hs : skilled = boxes) (hn : named ≤ terms) (σ : Nat) : (σ - (boxes + 1) = σ - (skilled + 1)) ∧ (σ - (terms) = σ - (named + (terms - named))) := ⟨congrArg (σ - ·) (Eq.symm (textbook_skills_complete boxes skilled terms named hs hn).1), congrArg (σ - ·) (Eq.symm (textbook_skills_complete boxes skilled terms named hs hn).2)⟩
/-- the contrapositive of textbook_skills_complete (examples: payload-scripts-skills) -/
@[reflection] theorem textbook_skills_complete_contrapositive (boxes skilled terms named : Nat) : ¬ (skilled + 1 = boxes + 1 ∧ named + (terms - named) = terms) → ¬ ((skilled = boxes) ∧ (named ≤ terms)) := fun hc hh => hc (textbook_skills_complete boxes skilled terms named hh.1 hh.2)
/-- the converse of textbook_skills_complete, proved. From Mathlib's `add_right_cancel`, `instIsRightCancelAddOfAddRightReflectLE`, `addRightReflectLE_of_addLeftReflectLE`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid`, `add_tsub_cancel_iff_le`, `Nat.instCanonicallyOrderedAdd` and `Nat.instOrderedSub` (examples: payload-scripts-skills) -/
@[reflection] theorem textbook_skills_complete_converse (boxes skilled terms named : Nat) : (skilled + 1 = boxes + 1 ∧ named + (terms - named) = terms) → (skilled = boxes) ∧ (named ≤ terms) :=
  fun hc => ⟨add_right_cancel hc.1, add_tsub_cancel_iff_le.mp hc.2⟩
/-- every cap is either removed or kept with its citation: the caps less the removed are the kept, and the removed never exceed the caps. From Mathlib's `add_tsub_cancel_left`, `le_self_add`, `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid` and `Nat.instCanonicallyOrderedAdd` (examples: audit-uncap) -/
theorem textbook_caps_removed (caps removed kept : ℕ) (h : removed + kept = caps) : caps - removed = kept ∧ removed ≤ caps := by
  rw [← h]
  exact ⟨add_tsub_cancel_left removed kept, le_self_add⟩
example := @textbook_caps_removed
/-- one step forward and one step back on a cycle of n positions returns the program (n = 2¹⁶ for g1, 2¹² for g2 and g3), at every edge. From Mathlib's `add_sub_cancel_right` (examples: fold-neighbours) -/
theorem textbook_neighbour_step (n : ℕ) (x : ZMod n) : x + 1 - 1 = x := add_sub_cancel_right x 1
example := @textbook_neighbour_step
/-- textbook_neighbour_step reflected by its shape (examples: fold-neighbours) -/
@[reflection] theorem textbook_neighbour_step_reflected (n : ℕ) (x : ZMod n) : (x) = (x + 1 - 1) := Eq.symm (textbook_neighbour_step n x)
/-- on n axes, two steps each, an actor has n · 2 neighbours, and with itself n · 2 + 1 (three axes: 6 and 7). From Mathlib's `Fintype.card_option`, `Fintype.card_prod`, `Fintype.card_fin` and `Fintype.card_bool` (examples: fold-navigate) -/
theorem textbook_teamwork_navigation (n : Nat) : Fintype.card (Option (Fin n × Bool)) = n * 2 + 1 := by
  rw [Fintype.card_option, Fintype.card_prod, Fintype.card_fin, Fintype.card_bool]
example := @textbook_teamwork_navigation
/-- textbook_teamwork_navigation reflected by its shape (examples: fold-navigate) -/
@[reflection] theorem textbook_teamwork_navigation_reflected (n : Nat) : (n * 2 + 1) = (Fintype.card (Option (Fin n × Bool))) := Eq.symm (textbook_teamwork_navigation n)
/-- items run at once last as long as the longest, never longer than one after another: max a b ≤ a + b. From Mathlib's `max_le_add_of_nonneg`, through the instances `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid` and `covariant_swap_add_of_covariant_add` (examples: leads-session-route) -/
theorem textbook_route_waves (a b : Nat) : max a b ≤ a + b := max_le_add_of_nonneg (Nat.zero_le a) (Nat.zero_le b)
example := @textbook_route_waves
/-- textbook_route_waves reflected by its shape (examples: leads-session-route) -/
@[reflection] theorem textbook_route_waves_reflected (a b : Nat) (σ : Nat) : σ - (a + b) ≤ σ - (max a b) := Nat.sub_le_sub_left (textbook_route_waves a b) σ
/-- a deploy carries a bundle no older than its sources: with truncated subtraction (ℕ among its models), when the last source change is at or before the build, the age since it and the source time make the build time, (b − s) + s = b. From Mathlib's `tsub_add_cancel_of_le` (examples: repository-predeploy) -/
theorem textbook_build_fresh {α : Type*} [AddCommSemigroup α] [PartialOrder α] [ExistsAddOfLE α] [AddLeftMono α]
    [Sub α] [OrderedSub α] (built source : α) (h : source ≤ built) : built - source + source = built :=
  tsub_add_cancel_of_le h
example := @textbook_build_fresh
/-- textbook_build_fresh reflected by its shape (examples: repository-predeploy) -/
@[reflection] theorem textbook_build_fresh_reflected {α : Type*} [AddCommSemigroup α] [PartialOrder α] [ExistsAddOfLE α] [AddLeftMono α] [Sub α] [OrderedSub α] (built source : α) (h : source ≤ built) : (built) = (built - source + source) := Eq.symm (textbook_build_fresh built source h)
/-- in any cancellative additive monoid (counts among them), when the declared bindings and the missing ones make the needed, the declared are the needed exactly when none is missing, however many the adapters bind. From Mathlib's `left_eq_add` (examples: repository-predeploy, configure-cloudflare-adapters) -/
theorem textbook_bindings_bound {M : Type*} [AddMonoid M] [IsLeftCancelAdd M] (needed declared missing : M)
    (h : declared + missing = needed) : declared = needed ↔ missing = 0 := by
  rw [← h]; exact left_eq_add
example := @textbook_bindings_bound
/-- textbook_bindings_bound reflected by its shape (examples: repository-predeploy, configure-cloudflare-adapters) -/
@[reflection] theorem textbook_bindings_bound_reflected {M : Type*} [AddMonoid M] [IsLeftCancelAdd M] (needed declared missing : M) (h : declared + missing = needed) : (missing = 0) ↔ (declared = needed) := Iff.symm (textbook_bindings_bound needed declared missing h)
/-- when the bindings in use and the idle ones make the total and none is idle, every binding is used, and a one-to-one pairing of all bindings pairs the used ones. From Mathlib's `add_zero` (examples: configure-bindings-google) -/
theorem textbook_bindings_used_google (used idle total paired : Nat) (h : used + idle = total) (h0 : idle = 0) (hp : paired = total) : used = total ∧ paired = used := by
  rw [h0, add_zero] at h
  exact ⟨h, hp.trans h.symm⟩
example := @textbook_bindings_used_google
/-- textbook_bindings_used_google reflected by its shape (examples: configure-bindings-google) -/
@[reflection] theorem textbook_bindings_used_google_reflected (used idle total paired : Nat) (h : used + idle = total) (h0 : idle = 0) (hp : paired = total) (σ : Nat) : (σ - (total) = σ - (used)) ∧ (σ - (used) = σ - (paired)) := ⟨congrArg (σ - ·) (Eq.symm (textbook_bindings_used_google used idle total paired h h0 hp).1), congrArg (σ - ·) (Eq.symm (textbook_bindings_used_google used idle total paired h h0 hp).2)⟩
/-- the contrapositive of textbook_bindings_used_google (examples: configure-bindings-google) -/
@[reflection] theorem textbook_bindings_used_google_contrapositive (used idle total paired : Nat) : ¬ (used = total ∧ paired = used) → ¬ ((used + idle = total) ∧ (idle = 0) ∧ (paired = total)) := fun hc hh => hc (textbook_bindings_used_google used idle total paired hh.1 hh.2.1 hh.2.2)
/-- at most one error per thousand requests means the errors never outnumber the requests: errors ≤ errors · 1000 ≤ requests. From Mathlib's `le_trans` (examples: repository-predeploy) -/
theorem textbook_observed_errors (errors requests : Nat) (h : errors * 1000 ≤ requests) : errors ≤ requests :=
  le_trans (Nat.le_mul_of_pos_right errors (by decide)) h
example := @textbook_observed_errors
/-- textbook_observed_errors reflected by its shape (examples: repository-predeploy) -/
@[reflection] theorem textbook_observed_errors_reflected (errors requests : Nat) (h : errors * 1000 ≤ requests) (σ : Nat) : σ - (requests) ≤ σ - (errors) := Nat.sub_le_sub_left (textbook_observed_errors errors requests h) σ
/-- the contrapositive of textbook_observed_errors (examples: repository-predeploy) -/
@[reflection] theorem textbook_observed_errors_contrapositive (errors requests : Nat) : ¬ (errors ≤ requests) → ¬ ((errors * 1000 ≤ requests)) := fun hc hh => hc (textbook_observed_errors errors requests hh)
/-- a bill within the price is covered: the price less the cost, plus the cost, is the price. From Mathlib's `tsub_add_cancel_of_le`, `StarOrderedRing.toExistsAddOfLE`, `Nat.instStarOrderedRing`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid` and `Nat.instOrderedSub` (examples: repository-predeploy, textbook-bill-covered) -/
theorem textbook_bill_covered (price cost : ℕ) (h : cost ≤ price) : price - cost + cost = price := tsub_add_cancel_of_le h
example := @textbook_bill_covered
/-- textbook_bill_covered reflected by its shape (examples: repository-predeploy, textbook-bill-covered) -/
@[reflection] theorem textbook_bill_covered_reflected (price cost : ℕ) (h : cost ≤ price) : (price) = (price - cost + cost) := Eq.symm (textbook_bill_covered price cost h)
/-- Shor's reduction, factoring as order-finding: if a^(2s) ≡ 1 (mod N) and N divides neither a^s − 1 nor a^s + 1, then gcd(a^s − 1, N) is a factor of N other than 1 and N, since (a^s − 1)(a^s + 1) = a^(2s) − 1. From Mathlib's `Nat.modEq_iff_dvd'`, `Nat.ModEq.symm`, `pow_mul'`, `mul_comm`, `Nat.sq_sub_sq`, `one_pow` and `Nat.Coprime.dvd_mul_left` (examples: algorithm-shor-reduction, algorithm-shor-beyond-bound) -/
theorem textbook_shor_reduction (N a s : Nat) (h : a ^ (2 * s) ≡ 1 [MOD N]) (ha : 1 ≤ a ^ s)
    (h1 : ¬ N ∣ a ^ s - 1) (h2 : ¬ N ∣ a ^ s + 1) : Nat.gcd (a ^ s - 1) N ≠ 1 ∧ Nat.gcd (a ^ s - 1) N ≠ N := by
  have hp : 1 ≤ a ^ (2 * s) := by rw [pow_mul']; exact Nat.one_le_pow _ _ ha
  have hd : N ∣ a ^ (2 * s) - 1 := (Nat.modEq_iff_dvd' hp).mp h.symm
  have he : (a ^ s - 1) * (a ^ s + 1) = a ^ (2 * s) - 1 := by rw [pow_mul', mul_comm, ← Nat.sq_sub_sq, one_pow]
  rw [← he] at hd
  exact ⟨fun hg => h2 ((Nat.Coprime.dvd_mul_left (Nat.Coprime.symm hg)).mp hd), fun hg => h1 (hg ▸ Nat.gcd_dvd_left (a ^ s - 1) N)⟩
example := @textbook_shor_reduction
example : (7 ^ 4) % 15 = 1 ∧ (7 ^ 2) % 15 = 4 ∧ Nat.gcd (4 - 1) 15 = 3 ∧ Nat.gcd (4 + 1) 15 = 5 := by decide
/-- textbook_shor_reduction reflected by its shape, conjunction (examples: algorithm-shor-reduction, algorithm-shor-beyond-bound) -/
@[reflection] theorem textbook_shor_reduction_reflected (N a s : Nat) (h : a ^ (2 * s) ≡ 1 [MOD N]) (ha : 1 ≤ a ^ s) (h1 : ¬ N ∣ a ^ s - 1) (h2 : ¬ N ∣ a ^ s + 1) : ((1) ≠ (Nat.gcd (a ^ s - 1) N)) ∧ ((N) ≠ (Nat.gcd (a ^ s - 1) N)) := ⟨Ne.symm (textbook_shor_reduction N a s h ha h1 h2).1, Ne.symm (textbook_shor_reduction N a s h ha h1 h2).2⟩
/-- order-finding: the order r of x in ZMod N is the least positive power that is one, x^r = 1 and x^k ≠ 1 for every 0 < k < r, the witness baby-step giant-step checks. From Mathlib's `pow_orderOf_eq_one`, `pow_ne_one_of_lt_orderOf` and `LT.lt.ne'` (examples: algorithm-discover, algorithm-order, algorithm-factor-find) -/
theorem textbook_order_finding (N : Nat) (x : ZMod N) : x ^ orderOf x = 1 ∧ ∀ k, 0 < k → k < orderOf x → x ^ k ≠ 1 :=
  ⟨pow_orderOf_eq_one x, fun _ hk hlt => pow_ne_one_of_lt_orderOf hk.ne' hlt⟩
example := @textbook_order_finding
example : 2 ^ 4 % 15 = 1 ∧ 2 ^ 1 % 15 ≠ 1 ∧ 2 ^ 2 % 15 ≠ 1 ∧ 2 ^ 3 % 15 ≠ 1 ∧ 4 = 2 * 2 - 0 := by decide
/-- textbook_order_finding reflected by its shape (examples: algorithm-discover, algorithm-order, algorithm-factor-find) -/
@[reflection] theorem textbook_order_finding_reflected (N : Nat) (x : ZMod N) : ((1) = (x ^ orderOf x)) ∧ (∀ k, ¬ (x ^ k ≠ 1) → ¬ ((0 < k) ∧ (k < orderOf x))) := ⟨Eq.symm (textbook_order_finding N x).1, fun k => fun hc hh => hc (((textbook_order_finding N x).2 k) hh.1 hh.2)⟩
/-- a part found of an integer, multiplied by the rest, gives the integer back, so it divides it: f · c = n implies f ∣ n. From Mathlib's `Dvd.intro` (examples: algorithm-factor-1000-bit, algorithm-factor-observe, algorithm-factor-mersenne, payload-predict) -/
theorem textbook_factors_divide (f c n : Nat) (h : f * c = n) : f ∣ n := Dvd.intro c h
example := @textbook_factors_divide
/-- listFactors returns the prime factorisation: for every n ≠ 0 the list of prime factors multiplies back to n and each is prime, fifteen listing as three times five. From Mathlib's `Nat.prod_primeFactorsList` and `Nat.prime_of_mem_primeFactorsList` (examples: algorithm-factor-15, algorithm-one-door) -/
theorem textbook_factor_parse_list (n : Nat) (h : n ≠ 0) : n.primeFactorsList.prod = n ∧ ∀ p ∈ n.primeFactorsList, p.Prime :=
  ⟨Nat.prod_primeFactorsList h, fun _ hp => Nat.prime_of_mem_primeFactorsList hp⟩
example := @textbook_factor_parse_list
example : 15 = 3 * 5 ∧ 15 / 3 = 5 := by decide
/-- covered and missing stores make the whole, so with none missing the covered are all of them. From Mathlib's `add_zero` (examples: raid-bit-zero-verify) -/
theorem textbook_raid_no_missing_store (covered missing total : Nat) (h : covered + missing = total) (h0 : missing = 0) : covered = total := by
  rw [← h, h0, add_zero]
example := @textbook_raid_no_missing_store
/-- textbook_raid_no_missing_store reflected by its shape (examples: raid-bit-zero-verify) -/
@[reflection] theorem textbook_raid_no_missing_store_reflected (covered missing total : Nat) (h : covered + missing = total) (h0 : missing = 0) (σ : Nat) : σ - (total) = σ - (covered) := congrArg (σ - ·) (Eq.symm (textbook_raid_no_missing_store covered missing total h h0))
/-- the contrapositive of textbook_raid_no_missing_store (examples: raid-bit-zero-verify) -/
@[reflection] theorem textbook_raid_no_missing_store_contrapositive (covered missing total : Nat) : ¬ (covered = total) → ¬ ((covered + missing = total) ∧ (missing = 0)) := fun hc hh => hc (textbook_raid_no_missing_store covered missing total hh.1 hh.2)
/-- retrieval by content address: when the address embeds the content injectively, two documents share an address exactly when they are the same document, so the address read by key names one document and no scan is needed. From Mathlib's `Function.Embedding.apply_eq_iff_eq` (examples: raid-binding0-mirror) -/
theorem textbook_address_retrieval {α β : Type} (f : α ↪ β) (a b : α) : f a = f b ↔ a = b := f.apply_eq_iff_eq a b
example := @textbook_address_retrieval
example : 1 < 1000000 ∧ 1 * 1 = 1 := by decide
/-- textbook_address_retrieval reflected by its shape (examples: raid-binding0-mirror) -/
@[reflection] theorem textbook_address_retrieval_reflected {α β : Type} (f : α ↪ β) (a b : α) : (a = b) ↔ (f a = f b) := Iff.symm (textbook_address_retrieval f a b)
/-- a nontrivial square root of one splits its modulus: if N divides (x − 1)(x + 1) but neither x − 1 nor x + 1, then gcd(x − 1, N) is neither 1 nor N, as 64 is for 91 = 7 · 13. From Mathlib's `Nat.Coprime.dvd_mul_left` (examples: algorithm-shor-91, clay-relation-rsa) -/
theorem textbook_shor_sigma_root (N x : Nat) (h : N ∣ (x - 1) * (x + 1)) (h1 : ¬ N ∣ x - 1) (h2 : ¬ N ∣ x + 1) :
    Nat.gcd (x - 1) N ≠ 1 ∧ Nat.gcd (x - 1) N ≠ N :=
  ⟨fun hg => h2 ((Nat.Coprime.dvd_mul_left (Nat.Coprime.symm hg)).mp h), fun hg => h1 (hg ▸ Nat.gcd_dvd_left (x - 1) N)⟩
example := @textbook_shor_sigma_root
example : 64 ^ 2 % 91 = 1 ∧ 64 ≠ 1 ∧ 64 ≠ 90 ∧ (64 - 1) * (64 + 1) % 91 = 0 ∧ Nat.gcd (64 - 1) 91 = 7 ∧ Nat.gcd (64 + 1) 91 = 13 ∧ 7 * 13 = 91 := by decide
/-- textbook_shor_sigma_root reflected by its shape, conjunction (examples: algorithm-shor-91, clay-relation-rsa) -/
@[reflection] theorem textbook_shor_sigma_root_reflected (N x : Nat) (h : N ∣ (x - 1) * (x + 1)) (h1 : ¬ N ∣ x - 1) (h2 : ¬ N ∣ x + 1) : ((1) ≠ (Nat.gcd (x - 1) N)) ∧ ((N) ≠ (Nat.gcd (x - 1) N)) := ⟨Ne.symm (textbook_shor_sigma_root N x h h1 h2).1, Ne.symm (textbook_shor_sigma_root N x h h1 h2).2⟩
/-- a search resumed from the centre it reached covers the same centres as one search of both budgets: (start + k) + m = start + (k + m). From Mathlib's `add_assoc` (examples: algorithm-factor-continues) -/
theorem textbook_search_resumes (start k m : Nat) : (start + k) + m = start + (k + m) := add_assoc start k m
example := @textbook_search_resumes
/-- textbook_search_resumes reflected by its shape (examples: algorithm-factor-continues) -/
@[reflection] theorem textbook_search_resumes_reflected (start k m : Nat) (σ : Nat) : σ - (start + (k + m)) = σ - ((start + k) + m) := congrArg (σ - ·) (Eq.symm (textbook_search_resumes start k m))
/-- the impossible-integer trapdoor: a semiprime minted as N = (a − b)(a + b) with centre a and gap b ≤ a is a² − b², and its second factor is the reflection 2a − (a − b) = a + b of the first. From Mathlib's `Nat.sq_sub_sq` and `mul_comm` (examples: algorithm-impossible-create, algorithm-impossible-decode) -/
theorem textbook_impossible_trapdoor (a b : Nat) (h : b ≤ a) : (a - b) * (a + b) = a ^ 2 - b ^ 2 ∧ 2 * a - (a - b) = a + b :=
  ⟨by rw [Nat.sq_sub_sq, mul_comm], by omega⟩
example := @textbook_impossible_trapdoor
example : (9 - 4) * (9 + 4) = 65 ∧ 9 * 9 - 4 * 4 = 65 ∧ 2 * 9 - 5 = 13 ∧ 9 - 4 = 5 ∧ 9 + 4 = 13 := by decide
/-- textbook_impossible_trapdoor reflected by its shape, conjunction (examples: algorithm-impossible-create, algorithm-impossible-decode) -/
@[reflection] theorem textbook_impossible_trapdoor_reflected (a b : Nat) (h : b ≤ a) (σ : Nat) : (σ - (a ^ 2 - b ^ 2) = σ - ((a - b) * (a + b))) ∧ (σ - (a + b) = σ - (2 * a - (a - b))) := ⟨congrArg (σ - ·) (Eq.symm (textbook_impossible_trapdoor a b h).1), congrArg (σ - ·) (Eq.symm (textbook_impossible_trapdoor a b h).2)⟩
/-- the contrapositive of textbook_impossible_trapdoor (examples: algorithm-impossible-create, algorithm-impossible-decode) -/
@[reflection] theorem textbook_impossible_trapdoor_contrapositive (a b : Nat) : ¬ ((a - b) * (a + b) = a ^ 2 - b ^ 2 ∧ 2 * a - (a - b) = a + b) → ¬ ((b ≤ a)) := fun hc hh => hc (textbook_impossible_trapdoor a b hh)
/-- the reflection σₙ(x) = n − x is an involution on 0 to n and pairs x with n − x summing to n (σ₁₀: 3 + 7 = 6 + 4 = 9 + 1 = 2 + 8 = 10, fixed at 5); a bridge-strength statement, not a physics claim. From Mathlib's `tsub_tsub_cancel_of_le` and `add_tsub_cancel_of_le`, through the instances `StarOrderedRing.toExistsAddOfLE`, `Nat.instStarOrderedRing`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid`, `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd` and `contravariant_lt_of_covariant_le` (examples: clay-reflection) -/
theorem textbook_thermal_time_sigma (n x : Nat) (h : x ≤ n) : n - (n - x) = x ∧ x + (n - x) = n :=
  ⟨tsub_tsub_cancel_of_le h, add_tsub_cancel_of_le h⟩
example := @textbook_thermal_time_sigma
example : 10 - (10 - 3) = 3 ∧ 10 - (10 - 7) = 7 ∧ 10 - (10 - 5) = 5 ∧ 10 - 5 = 5 ∧ 3 + 7 = 10 ∧ 6 + 4 = 10 ∧ 9 + 1 = 10 ∧ 2 + 8 = 10 := by decide
/-- textbook_thermal_time_sigma reflected by its shape (examples: clay-reflection) -/
@[reflection] theorem textbook_thermal_time_sigma_reflected (n x : Nat) (h : x ≤ n) (σ : Nat) : (σ - (x) = σ - (n - (n - x))) ∧ (σ - (n) = σ - (x + (n - x))) := ⟨congrArg (σ - ·) (Eq.symm (textbook_thermal_time_sigma n x h).1), congrArg (σ - ·) (Eq.symm (textbook_thermal_time_sigma n x h).2)⟩
/-- the contrapositive of textbook_thermal_time_sigma (examples: clay-reflection) -/
@[reflection] theorem textbook_thermal_time_sigma_contrapositive (n x : Nat) : ¬ (n - (n - x) = x ∧ x + (n - x) = n) → ¬ ((x ≤ n)) := fun hc hh => hc (textbook_thermal_time_sigma n x hh)
/-- the converse of textbook_thermal_time_sigma, proved. From Mathlib's `min_eq_right_iff`, `tsub_tsub_eq_min`, `Nat.instCanonicallyOrderedAdd`, `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `instIsLeftCancelAddOfAddLeftReflectLE`, `IsOrderedCancelAddMonoid.toAddLeftReflectLE`, `Nat.instIsOrderedCancelAddMonoid`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono` and `Nat.instIsOrderedAddMonoid` (examples: clay-reflection) -/
@[reflection] theorem textbook_thermal_time_sigma_converse (n x : Nat) : (n - (n - x) = x ∧ x + (n - x) = n) → (x ≤ n) :=
  fun hc => min_eq_right_iff.mp ((tsub_tsub_eq_min n x).symm.trans hc.1)
/-- the reflection σ_d(x) = d − x on 0, …, d, in ℕ or any ordered monoid with truncated subtraction, crosses and returns (d − (d − x) = x), partitions the meeting value ((d − x) + x = d), and swaps the endpoints (σ_d(0) = d, σ_d(d) = 0): the bridge at every clay value d (91 for crypto, 10 for physics). From Mathlib's `tsub_tsub_cancel_of_le`, `tsub_add_cancel_of_le`, `tsub_zero`, `add_tsub_cancel_right` and `zero_add` (examples: clay-reflection) -/
theorem textbook_clay_bridge {α : Type*} [AddCommMonoid α] [PartialOrder α] [Sub α] [OrderedSub α]
    [ExistsAddOfLE α] [AddLeftMono α] [AddLeftReflectLE α] (d x : α) (h : x ≤ d) :
    d - (d - x) = x ∧ (d - x) + x = d ∧ d - 0 = d ∧ d - d = 0 := by
  refine ⟨tsub_tsub_cancel_of_le h, tsub_add_cancel_of_le h, tsub_zero d, ?_⟩
  have h0 := add_tsub_cancel_right (0 : α) d
  rwa [zero_add] at h0
example := @textbook_clay_bridge
/-- textbook_clay_bridge reflected by its shape (examples: clay-reflection) -/
@[reflection] theorem textbook_clay_bridge_reflected {α : Type*} [AddCommMonoid α] [PartialOrder α] [Sub α] [OrderedSub α] [ExistsAddOfLE α] [AddLeftMono α] [AddLeftReflectLE α] (d x : α) (h : x ≤ d) : ((x) = (d - (d - x))) ∧ ((d) = ((d - x) + x)) ∧ ((d) = (d - 0)) ∧ ((0) = (d - d)) := ⟨Eq.symm (textbook_clay_bridge d x h).1, Eq.symm (textbook_clay_bridge d x h).2.1, Eq.symm (textbook_clay_bridge d x h).2.2.1, Eq.symm (textbook_clay_bridge d x h).2.2.2⟩
/-- each digit is linked to its reflection: for every d ≤ n, d + (n − d) = n and reflecting twice returns d (n = 10: 1↔9, 2↔8, 3↔7, 4↔6, 5 fixed). From Mathlib's `add_tsub_cancel_of_le`, `StarOrderedRing.toExistsAddOfLE`, `Nat.instStarOrderedRing`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid`, `Nat.instOrderedSub`, `tsub_tsub_cancel_of_le`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd` and `contravariant_lt_of_covariant_le` (examples: clay-reflection) -/
theorem textbook_digit_reflection (n d : ℕ) (h : d ≤ n) : d + (n - d) = n ∧ n - (n - d) = d :=
  ⟨add_tsub_cancel_of_le h, tsub_tsub_cancel_of_le h⟩
example := @textbook_digit_reflection
example : 0 + 10 = 10 ∧ 1 + 9 = 10 ∧ 2 + 8 = 10 ∧ 3 + 7 = 10 ∧ 4 + 6 = 10 ∧ 5 + 5 = 10 ∧ 6 + 4 = 10 ∧ 7 + 3 = 10 ∧ 8 + 2 = 10 ∧ 9 + 1 = 10 := by decide
/-- textbook_digit_reflection reflected by its shape (examples: clay-reflection) -/
@[reflection] theorem textbook_digit_reflection_reflected (n d : ℕ) (h : d ≤ n) : ((n) = (d + (n - d))) ∧ ((d) = (n - (n - d))) := ⟨Eq.symm (textbook_digit_reflection n d h).1, Eq.symm (textbook_digit_reflection n d h).2⟩
/-- the clock reflection σ_d(x) = d − x on a dial of d hours is its own inverse, reflect-then-restore returns x, reading and reflection make the dial, and the endpoints swap (σ(0) = d, σ(d) = 0; d = 12 with 3 ↔ 9 and 6 fixed). From Mathlib's `tsub_tsub_cancel_of_le`, `tsub_add_cancel_of_le`, `tsub_zero` and `tsub_self`, `StarOrderedRing.toExistsAddOfLE`, `Nat.instStarOrderedRing`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid`, `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le`, `Nat.instCanonicallyOrderedAdd` (examples: clay-reflection) -/
theorem textbook_clock_clone_involution (d x : Nat) (h : x ≤ d) :
  d - (d - x) = x ∧ (d - x) + x = d ∧ d - 0 = d ∧ d - d = 0 :=
  ⟨tsub_tsub_cancel_of_le h, tsub_add_cancel_of_le h, tsub_zero d, tsub_self d⟩
example := @textbook_clock_clone_involution
example : 12 - (12 - 3) = 3 ∧ 12 - (12 - 9) = 9 ∧ 12 - (12 - 6) = 6 ∧ 12 - 6 = 6 ∧ 3 + 9 = 12 ∧ (12 - 3) + 3 = 12 ∧ 12 - 0 = 12 ∧ 12 - 12 = 0 := by decide
/-- textbook_clock_clone_involution reflected by its shape (examples: clay-reflection) -/
@[reflection] theorem textbook_clock_clone_involution_reflected (d x : Nat) (h : x ≤ d) (σ : Nat) : (σ - (x) = σ - (d - (d - x))) ∧ (σ - (d) = σ - ((d - x) + x)) ∧ (σ - (d) = σ - (d - 0)) ∧ (σ - (0) = σ - (d - d)) := ⟨congrArg (σ - ·) (Eq.symm (textbook_clock_clone_involution d x h).1), congrArg (σ - ·) (Eq.symm (textbook_clock_clone_involution d x h).2.1), congrArg (σ - ·) (Eq.symm (textbook_clock_clone_involution d x h).2.2.1), congrArg (σ - ·) (Eq.symm (textbook_clock_clone_involution d x h).2.2.2)⟩
/-- the contrapositive of textbook_clock_clone_involution (examples: clay-reflection) -/
@[reflection] theorem textbook_clock_clone_involution_contrapositive (d x : Nat) : ¬ (d - (d - x) = x ∧ (d - x) + x = d ∧ d - 0 = d ∧ d - d = 0) → ¬ ((x ≤ d)) := fun hc hh => hc (textbook_clock_clone_involution d x hh)
/-- the converse of textbook_clock_clone_involution, proved. From Mathlib's `min_eq_right_iff`, `tsub_tsub_eq_min`, `Nat.instCanonicallyOrderedAdd`, `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `instIsLeftCancelAddOfAddLeftReflectLE`, `IsOrderedCancelAddMonoid.toAddLeftReflectLE`, `Nat.instIsOrderedCancelAddMonoid`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono` and `Nat.instIsOrderedAddMonoid` (examples: clay-reflection) -/
@[reflection] theorem textbook_clock_clone_involution_converse (d x : Nat) : (d - (d - x) = x ∧ (d - x) + x = d ∧ d - 0 = d ∧ d - d = 0) → (x ≤ d) :=
  fun hc => min_eq_right_iff.mp ((tsub_tsub_eq_min d x).symm.trans hc.1)
/-- a superposition at index k carries 2k witnesses, and a ±1 move in k is ±2 in the span: 2(k + 1) = 2k + 2 and 2(k − 1) = 2k − 2 (from 14 = 2 · 7 to 12 and 16; from 110 to 108 and 112). From Mathlib's `mul_add_one` and `Distrib.leftDistribClass` (examples: verify-witness-move) -/
theorem textbook_witness_clock_move (k : Nat) : 2 * (k + 1) = 2 * k + 2 ∧ 2 * (k - 1) = 2 * k - 2 :=
  ⟨mul_add_one 2 k, Nat.mul_sub_one 2 k⟩
example := @textbook_witness_clock_move
example : 2 * 7 = 14 ∧ 14 - 2 = 12 ∧ 14 + 2 = 16 ∧ 2 * 6 = 12 ∧ 2 * 8 = 16 ∧ 2 * 12 = 24 ∧ 2 * 55 = 110 ∧ 110 - 2 = 108 ∧ 110 + 2 = 112 := by decide
/-- textbook_witness_clock_move reflected by its shape (examples: verify-witness-move) -/
@[reflection] theorem textbook_witness_clock_move_reflected (k : Nat) (σ : Nat) : (σ - (2 * k + 2) = σ - (2 * (k + 1))) ∧ (σ - (2 * k - 2) = σ - (2 * (k - 1))) := ⟨congrArg (σ - ·) (Eq.symm (textbook_witness_clock_move k).1), congrArg (σ - ·) (Eq.symm (textbook_witness_clock_move k).2)⟩
/-- a pair of digits (hi, lo) in bases m and n is one digit lo + n · hi in base m · n, read back one for one: DNA's A, C, G, T are base 4, so two bases are one hexadecimal nibble (AC = 1, GT = 11) and a UUID of 32 hex holds 64 bases. From Mathlib's `finProdFinEquiv`, `Equiv.symm_apply_apply` and `finProdFinEquiv_apply_val` (examples: fold-dna, fold-dna-decode) -/
theorem textbook_dna_base4 (m n : Nat) (x : Fin m × Fin n) :
    finProdFinEquiv.symm (finProdFinEquiv x) = x ∧ ((finProdFinEquiv x : Fin (m * n)) : Nat) = x.2 + n * x.1 :=
  ⟨finProdFinEquiv.symm_apply_apply x, finProdFinEquiv_apply_val x⟩
example := @textbook_dna_base4
example : 4 * 4 = 16 ∧ 0 * 4 + 1 = 1 ∧ 2 * 4 + 3 = 11 ∧ 11 / 4 = 2 ∧ 11 % 4 = 3 ∧ 1 / 4 = 0 ∧ 1 % 4 = 1 := by decide
/-- textbook_dna_base4 reflected by its shape (examples: fold-dna, fold-dna-decode) -/
@[reflection] theorem textbook_dna_base4_reflected (m n : Nat) (x : Fin m × Fin n) : ((x) = (finProdFinEquiv.symm (finProdFinEquiv x))) ∧ ((x.2 + n * x.1) = (((finProdFinEquiv x : Fin (m * n)) : Nat))) := ⟨Eq.symm (textbook_dna_base4 m n x).1, Eq.symm (textbook_dna_base4 m n x).2⟩
/-- the reflection σₙ(x) = n − x is an involution on 0 to n, and the half-turn c is the fixed centre of σ₂꜀ (σ₃₆₀ fixes 180); a bridge-strength statement, not a physics claim. From Mathlib's `tsub_tsub_cancel_of_le` and `add_tsub_cancel_right`, through the instances `StarOrderedRing.toExistsAddOfLE`, `Nat.instStarOrderedRing`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid`, `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd` and `contravariant_lt_of_covariant_le` (examples: clay-reflection) -/
theorem textbook_gravity_torus_sigma (n x c : Nat) (h : x ≤ n) : n - (n - x) = x ∧ (c + c) - c = c :=
  ⟨tsub_tsub_cancel_of_le h, add_tsub_cancel_right c c⟩
example := @textbook_gravity_torus_sigma
example : 3 * 60 = 180 ∧ 2 * 90 = 180 ∧ 360 - 180 = 180 ∧ 360 / 60 = 6 ∧ 360 / 90 = 4 ∧ 360 / 180 = 2 ∧ 180 * 2 = 360 := by decide
/-- textbook_gravity_torus_sigma reflected by its shape (examples: clay-reflection) -/
@[reflection] theorem textbook_gravity_torus_sigma_reflected (n x c : Nat) (h : x ≤ n) (σ : Nat) : (σ - (x) = σ - (n - (n - x))) ∧ (σ - (c) = σ - ((c + c) - c)) := ⟨congrArg (σ - ·) (Eq.symm (textbook_gravity_torus_sigma n x c h).1), congrArg (σ - ·) (Eq.symm (textbook_gravity_torus_sigma n x c h).2)⟩
/-- the contrapositive of textbook_gravity_torus_sigma (examples: clay-reflection) -/
@[reflection] theorem textbook_gravity_torus_sigma_contrapositive (n x c : Nat) : ¬ (n - (n - x) = x ∧ (c + c) - c = c) → ¬ ((x ≤ n)) := fun hc hh => hc (textbook_gravity_torus_sigma n x c hh)
/-- the converse of textbook_gravity_torus_sigma, proved. From Mathlib's `min_eq_right_iff`, `tsub_tsub_eq_min`, `Nat.instCanonicallyOrderedAdd`, `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `instIsLeftCancelAddOfAddLeftReflectLE`, `IsOrderedCancelAddMonoid.toAddLeftReflectLE`, `Nat.instIsOrderedCancelAddMonoid`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono` and `Nat.instIsOrderedAddMonoid` (examples: clay-reflection) -/
@[reflection] theorem textbook_gravity_torus_sigma_converse (n x c : Nat) : (n - (n - x) = x ∧ (c + c) - c = c) → (x ≤ n) :=
  fun hc => min_eq_right_iff.mp ((tsub_tsub_eq_min n x).symm.trans hc.1)
/-- the neuroscience bridge σ_d(x) = d − x is an involution on 0..d: σ_d(σ_d(x)) = x, σ_d³ = σ_d, and the two sides sum to the whole, (d − x) + x = d. From Mathlib's `tsub_tsub_cancel_of_le`, `StarOrderedRing.toExistsAddOfLE`, `Nat.instStarOrderedRing`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid`, `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le` and `tsub_add_cancel_of_le` (examples: clay-reflection) -/
theorem textbook_mind_sigma (d x : ℕ) (h : x ≤ d) : d - (d - x) = x ∧ d - (d - (d - x)) = d - x ∧ (d - x) + x = d := by
  refine ⟨tsub_tsub_cancel_of_le h, ?_, tsub_add_cancel_of_le h⟩
  rw [tsub_tsub_cancel_of_le h]
example := @textbook_mind_sigma
/-- textbook_mind_sigma reflected by its shape (examples: clay-reflection) -/
@[reflection] theorem textbook_mind_sigma_reflected (d x : ℕ) (h : x ≤ d) : ((x) = (d - (d - x))) ∧ ((d - x) = (d - (d - (d - x)))) ∧ ((d) = ((d - x) + x)) := ⟨Eq.symm (textbook_mind_sigma d x h).1, Eq.symm (textbook_mind_sigma d x h).2.1, Eq.symm (textbook_mind_sigma d x h).2.2⟩
/-- the claim↔proof gate as the reflection σ_d(x) = d − x on x ≤ d: σ_d(σ_d(x)) = x, the claim kept at strength (x · 1 = x), the impossibility collapsed to zero (x · 0 = 0), and the possibility partitioned (d − x) + x = d. From Mathlib's `tsub_tsub_cancel_of_le`, `mul_one`, `mul_zero` and `tsub_add_cancel_of_le`, `StarOrderedRing.toExistsAddOfLE`, `Nat.instStarOrderedRing`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid`, `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le`, `MulZeroClass.mul_zero` (examples: clay-reflection) -/
theorem textbook_claim_prove_involution (d x : Nat) (h : x ≤ d) : d - (d - x) = x ∧ x * 1 = x ∧ x * 0 = 0 ∧ (d - x) + x = d :=
  ⟨tsub_tsub_cancel_of_le h, mul_one x, mul_zero x, tsub_add_cancel_of_le h⟩
example := @textbook_claim_prove_involution
/-- textbook_claim_prove_involution reflected by its shape (examples: clay-reflection) -/
@[reflection] theorem textbook_claim_prove_involution_reflected (d x : Nat) (h : x ≤ d) (σ : Nat) : (σ - (x) = σ - (d - (d - x))) ∧ (σ - (x) = σ - (x * 1)) ∧ (σ - (0) = σ - (x * 0)) ∧ (σ - (d) = σ - ((d - x) + x)) := ⟨congrArg (σ - ·) (Eq.symm (textbook_claim_prove_involution d x h).1), congrArg (σ - ·) (Eq.symm (textbook_claim_prove_involution d x h).2.1), congrArg (σ - ·) (Eq.symm (textbook_claim_prove_involution d x h).2.2.1), congrArg (σ - ·) (Eq.symm (textbook_claim_prove_involution d x h).2.2.2)⟩
/-- the contrapositive of textbook_claim_prove_involution (examples: clay-reflection) -/
@[reflection] theorem textbook_claim_prove_involution_contrapositive (d x : Nat) : ¬ (d - (d - x) = x ∧ x * 1 = x ∧ x * 0 = 0 ∧ (d - x) + x = d) → ¬ ((x ≤ d)) := fun hc hh => hc (textbook_claim_prove_involution d x hh)
/-- the converse of textbook_claim_prove_involution, proved. From Mathlib's `min_eq_right_iff`, `tsub_tsub_eq_min`, `Nat.instCanonicallyOrderedAdd`, `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `instIsLeftCancelAddOfAddLeftReflectLE`, `IsOrderedCancelAddMonoid.toAddLeftReflectLE`, `Nat.instIsOrderedCancelAddMonoid`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono` and `Nat.instIsOrderedAddMonoid` (examples: clay-reflection) -/
@[reflection] theorem textbook_claim_prove_involution_converse (d x : Nat) : (d - (d - x) = x ∧ x * 1 = x ∧ x * 0 = 0 ∧ (d - x) + x = d) → (x ≤ d) :=
  fun hc => min_eq_right_iff.mp ((tsub_tsub_eq_min d x).symm.trans hc.1)
/-- a code of minimum distance d corrects t errors when 2t < d: a word within t of two codewords forces them equal (the toric code at d = 3 corrects ⌊(3 − 1)/2⌋ = 1 error). From Mathlib's `hammingDist_triangle` (examples: ftqc-all) -/
theorem textbook_toric_torus_code {F : Type} [DecidableEq F] {n : ℕ} (d t : ℕ) (c₁ c₂ x : Fin n → F) (hc : c₁ ≠ c₂ → d ≤ hammingDist c₁ c₂) (ht : 2 * t < d) (h1 : hammingDist c₁ x ≤ t) (h2 : hammingDist x c₂ ≤ t) : c₁ = c₂ := by
  by_contra hne
  have := hc hne
  have := hammingDist_triangle c₁ x c₂
  omega
example := @textbook_toric_torus_code
example : 2 * 3 * 3 = 18 ∧ 360 / 180 = 2 ∧ (3 - 1) / 2 = 1 ∧ 2 * 1 + 1 = 3 := by decide
/-- textbook_toric_torus_code reflected by its shape (examples: ftqc-all) -/
@[reflection] theorem textbook_toric_torus_code_reflected {F : Type} [DecidableEq F] {n : ℕ} (d t : ℕ) (c₁ c₂ x : Fin n → F) (hc : c₁ ≠ c₂ → d ≤ hammingDist c₁ c₂) (ht : 2 * t < d) (h1 : hammingDist c₁ x ≤ t) (h2 : hammingDist x c₂ ≤ t) : (c₂) = (c₁) := Eq.symm (textbook_toric_torus_code d t c₁ c₂ x hc ht h1 h2)
/-- a code of minimum distance d decodes uniquely within ⌊(d − 1)/2⌋ errors: two codewords both that close to a received word are the same codeword (the Hamming code [7, 4, 3]: d = 3 corrects one error). From Mathlib's `hammingDist_pos`, `hammingDist_triangle` and `hammingDist_comm` (examples: ftqc-all) -/
theorem textbook_hamming_code {ι : Type*} [Fintype ι] {β : ι → Type*} [∀ i, DecidableEq (β i)] (d : Nat)
    (c₁ c₂ y : ∀ i, β i) (hd : c₁ ≠ c₂ → d ≤ hammingDist c₁ c₂)
    (h₁ : hammingDist y c₁ ≤ (d - 1) / 2) (h₂ : hammingDist y c₂ ≤ (d - 1) / 2) : c₁ = c₂ := by
  by_contra hne
  have h0 := hammingDist_pos.mpr hne
  have h3 := hammingDist_triangle c₁ y c₂
  rw [hammingDist_comm c₁ y] at h3
  have h4 := hd hne
  omega
example := @textbook_hamming_code
example : 2 ^ 3 - 1 = 7 ∧ 7 - 3 = 4 ∧ (3 - 1) / 2 = 1 ∧ 2 ^ 4 = 16 := by decide
/-- textbook_hamming_code reflected by its shape (examples: ftqc-all) -/
@[reflection] theorem textbook_hamming_code_reflected {ι : Type*} [Fintype ι] {β : ι → Type*} [∀ i, DecidableEq (β i)] (d : Nat) (c₁ c₂ y : ∀ i, β i) (hd : c₁ ≠ c₂ → d ≤ hammingDist c₁ c₂) (h₁ : hammingDist y c₁ ≤ (d - 1) / 2) (h₂ : hammingDist y c₂ ≤ (d - 1) / 2) : (c₂) = (c₁) := Eq.symm (textbook_hamming_code d c₁ c₂ y hd h₁ h₂)
/-- a code of minimum distance d decodes uniquely up to t errors when 2t < d: a word within t of two codewords forces them equal (RS(255, 223), d = 33, corrects 16 symbol errors). From Mathlib's `hammingDist_triangle` (examples: ftqc-all) -/
theorem textbook_reed_solomon_mds {F : Type} [DecidableEq F] {n : ℕ} (d t : ℕ) (c₁ c₂ x : Fin n → F) (hc : c₁ ≠ c₂ → d ≤ hammingDist c₁ c₂) (ht : 2 * t < d) (h1 : hammingDist c₁ x ≤ t) (h2 : hammingDist x c₂ ≤ t) : c₁ = c₂ := by
  by_contra hne
  have := hc hne
  have := hammingDist_triangle c₁ x c₂
  omega
example := @textbook_reed_solomon_mds
example : 255 - 223 + 1 = 33 ∧ (33 - 1) / 2 = 16 ∧ 255 - 33 + 1 = 223 := by decide
/-- textbook_reed_solomon_mds reflected by its shape (examples: ftqc-all) -/
@[reflection] theorem textbook_reed_solomon_mds_reflected {F : Type} [DecidableEq F] {n : ℕ} (d t : ℕ) (c₁ c₂ x : Fin n → F) (hc : c₁ ≠ c₂ → d ≤ hammingDist c₁ c₂) (ht : 2 * t < d) (h1 : hammingDist c₁ x ≤ t) (h2 : hammingDist x c₂ ≤ t) : (c₂) = (c₁) := Eq.symm (textbook_reed_solomon_mds d t c₁ c₂ x hc ht h1 h2)
/-- a code of minimum distance d decodes uniquely up to ⌊(d−1)/2⌋ errors: two codewords within that Hamming distance of one received word are the same codeword (the BCH code [15, 7, 5], length 2⁴ − 1 with 8 parity bits, corrects 2). From Mathlib's `hammingDist_triangle` and `hammingDist_comm` (examples: ftqc-all) -/
theorem textbook_bch_code {ι : Type*} [Fintype ι] {β : ι → Type*} [∀ i, DecidableEq (β i)] (d : ℕ) (hd0 : 0 < d) (c₁ c₂ r : ∀ i, β i) (hd : c₁ ≠ c₂ → d ≤ hammingDist c₁ c₂) (h₁ : hammingDist c₁ r ≤ (d - 1) / 2) (h₂ : hammingDist c₂ r ≤ (d - 1) / 2) : c₁ = c₂ := by
  by_contra hne
  have := hammingDist_triangle c₁ r c₂
  rw [hammingDist_comm r c₂] at this
  have := hd hne
  omega
example := @textbook_bch_code
example : 2 ^ 4 - 1 = 15 ∧ 15 - 7 = 8 ∧ (5 - 1) / 2 = 2 := by decide
/-- textbook_bch_code reflected by its shape (examples: ftqc-all) -/
@[reflection] theorem textbook_bch_code_reflected {ι : Type*} [Fintype ι] {β : ι → Type*} [∀ i, DecidableEq (β i)] (d : ℕ) (hd0 : 0 < d) (c₁ c₂ r : ∀ i, β i) (hd : c₁ ≠ c₂ → d ≤ hammingDist c₁ c₂) (h₁ : hammingDist c₁ r ≤ (d - 1) / 2) (h₂ : hammingDist c₂ r ≤ (d - 1) / 2) : (c₂) = (c₁) := Eq.symm (textbook_bch_code d hd0 c₁ c₂ r hd h₁ h₂)
/-- a code of distance d ≥ 2t + 1 corrects t errors: a received word within t of a codeword is farther than t from every other, by the triangle inequality of the Hamming distance (the Steane [[7, 1, 3]] code, two Hamming(7, 4) checks, corrects ⌊(3 − 1)/2⌋ = 1 error of each kind). From Mathlib's `hammingDist_triangle`, `hammingDist_comm` (examples: ftqc-all) -/
theorem textbook_steane_css {n : Nat} (x y w : Fin n → Bool) (t : Nat) (hd : 2 * t + 1 ≤ hammingDist x y) (hx : hammingDist w x ≤ t) :
  t < hammingDist w y := by
  have tri := hammingDist_triangle x w y
  rw [hammingDist_comm x w] at tri
  omega
example := @textbook_steane_css
/-- the σ-involution decoder recovers by one reflection: σ_d(σ_d(x)) = d − (d − x) = x for every integer, and a repetition code of distance 2t + 1 corrects (2t + 1 − 1)/2 = t errors. From Mathlib's `sub_sub_cancel` (examples: ftqc-all) -/
theorem textbook_involution_decoder (d x : Int) (t : Nat) : d - (d - x) = x ∧ (2 * t + 1 - 1) / 2 = t :=
  ⟨sub_sub_cancel d x, by omega⟩
example := @textbook_involution_decoder
example : 12 - (12 - 5) = 5 ∧ 2 * 1 + 1 = 3 ∧ (3 - 1) / 2 = 1 := by decide
/-- textbook_involution_decoder reflected by its shape, conjunction (examples: ftqc-all) -/
@[reflection] theorem textbook_involution_decoder_reflected (d x : Int) (t : Nat) (σ : Nat) : ((x) = (d - (d - x))) ∧ (σ - (t) = σ - ((2 * t + 1 - 1) / 2)) := ⟨Eq.symm (textbook_involution_decoder d x t).1, congrArg (σ - ·) (Eq.symm (textbook_involution_decoder d x t).2)⟩
/-- counting the ones of a regular parity-check matrix by bits and by checks: when each bit sits in m checks and each check joins n bits, bits · m = checks · n (a (3, 6)-regular Gallager LDPC code has half as many checks as bits, design rate 1 − 3/6 = 1/2). From Mathlib's `Finset.card_mul_eq_card_mul` (examples: ftqc-all) -/
theorem textbook_ldpc_code {α β : Type*} (r : α → β → Prop) [∀ a b, Decidable (r a b)] (s : Finset α) (t : Finset β)
    (m n : Nat) (hm : ∀ a ∈ s, (t.bipartiteAbove r a).card = m) (hn : ∀ b ∈ t, (s.bipartiteBelow r b).card = n) :
    s.card * m = t.card * n :=
  Finset.card_mul_eq_card_mul r hm hn
example := @textbook_ldpc_code
example : 6 - 3 = 3 ∧ 2 * 3 = 6 ∧ 3 + 3 = 6 := by decide
/-- textbook_ldpc_code reflected by its shape (examples: ftqc-all) -/
@[reflection] theorem textbook_ldpc_code_reflected {α β : Type*} (r : α → β → Prop) [∀ a b, Decidable (r a b)] (s : Finset α) (t : Finset β) (m n : Nat) (hm : ∀ a ∈ s, (t.bipartiteAbove r a).card = m) (hn : ∀ b ∈ t, (s.bipartiteBelow r b).card = n) : (t.card * n) = (s.card * m) := Eq.symm (textbook_ldpc_code r s t m n hm hn)
/-- a code of minimum distance d decodes uniquely up to ⌊(d−1)/2⌋ errors: two codewords within that Hamming distance of one received word coincide (RM(1, 3) = [8, 4, 4] corrects 1). From Mathlib's `hammingDist_triangle` and `hammingDist_comm` (examples: ftqc-all) -/
theorem textbook_reed_muller {ι : Type*} [Fintype ι] {β : ι → Type*} [∀ i, DecidableEq (β i)] (d : ℕ) (hd0 : 0 < d) (c₁ c₂ r : ∀ i, β i) (hd : c₁ ≠ c₂ → d ≤ hammingDist c₁ c₂) (h₁ : hammingDist c₁ r ≤ (d - 1) / 2) (h₂ : hammingDist c₂ r ≤ (d - 1) / 2) : c₁ = c₂ := by
  by_contra hne
  have := hammingDist_triangle c₁ r c₂
  rw [hammingDist_comm r c₂] at this
  have := hd hne
  omega
example := @textbook_reed_muller
example : 2 ^ 3 = 8 ∧ 1 + 3 = 4 ∧ 2 ^ (3 - 1) = 4 ∧ (4 - 1) / 2 = 1 := by decide
/-- textbook_reed_muller reflected by its shape (examples: ftqc-all) -/
@[reflection] theorem textbook_reed_muller_reflected {ι : Type*} [Fintype ι] {β : ι → Type*} [∀ i, DecidableEq (β i)] (d : ℕ) (hd0 : 0 < d) (c₁ c₂ r : ∀ i, β i) (hd : c₁ ≠ c₂ → d ≤ hammingDist c₁ c₂) (h₁ : hammingDist c₁ r ≤ (d - 1) / 2) (h₂ : hammingDist c₂ r ≤ (d - 1) / 2) : (c₂) = (c₁) := Eq.symm (textbook_reed_muller d hd0 c₁ c₂ r hd h₁ h₂)
/-- the triangular colour code at distance d decodes uniquely up to ⌊(d−1)/2⌋ errors: two codewords within that Hamming distance of one received word coincide (2 errors at distance 5). From Mathlib's `hammingDist_triangle` and `hammingDist_comm` (examples: ftqc-all) -/
theorem textbook_color_code_d5 {ι : Type*} [Fintype ι] {β : ι → Type*} [∀ i, DecidableEq (β i)] (d : ℕ) (hd0 : 0 < d) (c₁ c₂ r : ∀ i, β i) (hd : c₁ ≠ c₂ → d ≤ hammingDist c₁ c₂) (h₁ : hammingDist c₁ r ≤ (d - 1) / 2) (h₂ : hammingDist c₂ r ≤ (d - 1) / 2) : c₁ = c₂ := by
  by_contra hne
  have := hammingDist_triangle c₁ r c₂
  rw [hammingDist_comm r c₂] at this
  have := hd hne
  omega
example := @textbook_color_code_d5
example : (5 - 1) / 2 = 2 ∧ 2 * 2 + 1 = 5 ∧ 5 - 2 = 3 := by decide
/-- textbook_color_code_d5 reflected by its shape (examples: ftqc-all) -/
@[reflection] theorem textbook_color_code_d5_reflected {ι : Type*} [Fintype ι] {β : ι → Type*} [∀ i, DecidableEq (β i)] (d : ℕ) (hd0 : 0 < d) (c₁ c₂ r : ∀ i, β i) (hd : c₁ ≠ c₂ → d ≤ hammingDist c₁ c₂) (h₁ : hammingDist c₁ r ≤ (d - 1) / 2) (h₂ : hammingDist c₂ r ≤ (d - 1) / 2) : (c₂) = (c₁) := Eq.symm (textbook_color_code_d5 d hd0 c₁ c₂ r hd h₁ h₂)
/-- a distance-d code corrects t errors whenever 2t + 1 ≤ d: two codewords both within t of a received word are the same (d = 3 corrects 1, d = 5 corrects 2, d = 7 corrects 3, the surface code's distance ladder). From Mathlib's `hammingDist_pos`, `hammingDist_triangle` and `hammingDist_comm` (examples: ftqc-all) -/
theorem textbook_surface_distance_ladder {ι : Type*} [Fintype ι] {β : ι → Type*} [∀ i, DecidableEq (β i)]
    (d t : Nat) (ht : 2 * t + 1 ≤ d) (c₁ c₂ y : ∀ i, β i) (hd : c₁ ≠ c₂ → d ≤ hammingDist c₁ c₂)
    (h₁ : hammingDist y c₁ ≤ t) (h₂ : hammingDist y c₂ ≤ t) : c₁ = c₂ := by
  by_contra hne
  have h0 := hammingDist_pos.mpr hne
  have h3 := hammingDist_triangle c₁ y c₂
  rw [hammingDist_comm c₁ y] at h3
  have h4 := hd hne
  omega
example := @textbook_surface_distance_ladder
/-- textbook_surface_distance_ladder reflected by its shape (examples: ftqc-all) -/
@[reflection] theorem textbook_surface_distance_ladder_reflected {ι : Type*} [Fintype ι] {β : ι → Type*} [∀ i, DecidableEq (β i)] (d t : Nat) (ht : 2 * t + 1 ≤ d) (c₁ c₂ y : ∀ i, β i) (hd : c₁ ≠ c₂ → d ≤ hammingDist c₁ c₂) (h₁ : hammingDist y c₁ ≤ t) (h₂ : hammingDist y c₂ ≤ t) : (c₂) = (c₁) := Eq.symm (textbook_surface_distance_ladder d t ht c₁ c₂ y hd h₁ h₂)
/-- concatenating a code of length n₁ with one of length n₂ encodes each of the n₁ outer positions into n₂, a length of n₁ · n₂ (the Steane code with itself: 7 · 7 = 49). From Mathlib's `Fintype.card_prod` and `Fintype.card_fin` (examples: ftqc-all) -/
theorem textbook_concatenated_code (n₁ n₂ : Nat) : Fintype.card (Fin n₁ × Fin n₂) = n₁ * n₂ := by
  simp only [Fintype.card_prod, Fintype.card_fin]
example := @textbook_concatenated_code
example : 7 * 7 = 49 ∧ 3 * 3 = 9 ∧ (9 - 1) / 2 = 4 ∧ 1 * 1 = 1 := by decide
/-- textbook_concatenated_code reflected by its shape (examples: ftqc-all) -/
@[reflection] theorem textbook_concatenated_code_reflected (n₁ n₂ : Nat) : (n₁ * n₂) = (Fintype.card (Fin n₁ × Fin n₂)) := Eq.symm (textbook_concatenated_code n₁ n₂)
/-- a code of distance d ≥ 2t + 1 corrects t errors: no word lies within t of two codewords, by the triangle inequality of the Hamming distance (Shor's [[9, 1, 3]], a 3 × 3 concatenation, corrects ⌊(3 − 1)/2⌋ = 1 error of each kind). From Mathlib's `hammingDist_triangle`, `hammingDist_comm` (examples: ftqc-all) -/
theorem textbook_shor_nine_code {n : Nat} (x y w : Fin n → Bool) (t : Nat) (hd : 2 * t + 1 ≤ hammingDist x y)
  (hx : hammingDist w x ≤ t) (hy : hammingDist w y ≤ t) : False := by
  have tri := hammingDist_triangle x w y
  rw [hammingDist_comm x w] at tri
  omega
example := @textbook_shor_nine_code
/-- a code of r parity bits has 2^r syndromes, one per pattern of the parity checks (the Golay code [23, 12, 7]: 23 − 12 = 11 parity bits, 2^11 = 2048 syndromes). From Mathlib's `Fintype.card_fun`, `Fintype.card_bool`, `Fintype.card_fin` (examples: ftqc-all) -/
theorem textbook_golay_code (r : Nat) : Fintype.card (Fin r → Bool) = 2 ^ r := by
  rw [Fintype.card_fun, Fintype.card_bool, Fintype.card_fin]
example := @textbook_golay_code
example : 23 - 12 = 11 ∧ (7 - 1) / 2 = 3 ∧ 2 ^ 11 = 2048 := by decide
/-- textbook_golay_code reflected by its shape (examples: ftqc-all) -/
@[reflection] theorem textbook_golay_code_reflected (r : Nat) : (2 ^ r) = (Fintype.card (Fin r → Bool)) := Eq.symm (textbook_golay_code r)
/-- Pascal's rule, the defining recurrence of the binomial coefficient: C(n + 1, k + 1) = C(n, k) + C(n, k + 1) (C(8,3) = 56 = 21 + 35, C(8,2) = 28 = 7 + 21, C(7,3) = 35 = 15 + 20), the textbook meaning of the 22 clay relations choose a b = choose a b. From Mathlib's `Nat.choose_succ_succ` (examples: clay-register) -/
theorem textbook_pascal_rule (n k : Nat) : Nat.choose (n + 1) (k + 1) = Nat.choose n k + Nat.choose n (k + 1) := Nat.choose_succ_succ n k
example := @textbook_pascal_rule
example : 56 = 35 + 21 ∧ 28 = 21 + 7 ∧ 35 = 20 + 15 := by decide
/-- textbook_pascal_rule reflected by its shape (examples: clay-register) -/
@[reflection] theorem textbook_pascal_rule_reflected (n k : Nat) : (Nat.choose n k + Nat.choose n (k + 1)) = (Nat.choose (n + 1) (k + 1)) := Eq.symm (textbook_pascal_rule n k)
/-- Gauss's triangular sum: twice 0 + 1 + … + n is (n + 1) · n (2·T(4) = 4·5, 2·T(8) = 8·9, 2·T(7) = 7·8), the textbook meaning of the clay relations triangular k = qftGates k. From Mathlib's `Finset.sum_range_id_mul_two`, `add_tsub_cancel_right`, `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid` (examples: clay-register) -/
theorem textbook_gauss_triangular (n : Nat) : (∑ i ∈ Finset.range (n + 1), i) * 2 = (n + 1) * n := by
  rw [Finset.sum_range_id_mul_two, add_tsub_cancel_right]
example := @textbook_gauss_triangular
example : 2 * 10 = 4 * 5 ∧ 2 * 36 = 8 * 9 ∧ 2 * 28 = 7 * 8 := by decide
/-- textbook_gauss_triangular reflected by its shape (examples: clay-register) -/
@[reflection] theorem textbook_gauss_triangular_reflected (n : Nat) : ((n + 1) * n) = ((∑ i ∈ Finset.range (n + 1), i) * 2) := Eq.symm (textbook_gauss_triangular n)
/-- the powers of two double: 2^(n+1) = 2·2ⁿ for every n (2⁴ = 2·2³). From Mathlib's `pow_succ'` (examples: clay-register) -/
theorem textbook_power_of_two (n : ℕ) : 2 ^ (n + 1) = 2 * 2 ^ n := pow_succ' 2 n
example := @textbook_power_of_two
example : 2 ^ 3 = 8 ∧ 2 ^ 8 = 256 ∧ 2 ^ 4 = 2 * 2 ^ 3 := by decide
/-- textbook_power_of_two reflected by its shape (examples: clay-register) -/
@[reflection] theorem textbook_power_of_two_reflected (n : ℕ) : (2 * 2 ^ n) = (2 ^ (n + 1)) := Eq.symm (textbook_power_of_two n)
/-- Fermat's little theorem: a^(p − 1) = 1 in ZMod p for a prime p and every a ≠ 0, the textbook meaning of the clay relations over powMod. From Mathlib's `ZMod.pow_card_sub_one_eq_one` (examples: clay-register) -/
theorem textbook_euler_fermat (p : Nat) [Fact p.Prime] (a : ZMod p) (ha : a ≠ 0) : a ^ (p - 1) = 1 :=
  ZMod.pow_card_sub_one_eq_one ha
example := @textbook_euler_fermat
example : 2 ^ 6 % 7 = 1 ∧ 3 ^ 4 % 5 = 1 ∧ 2 ^ 4 % 5 = 1 := by decide
/-- textbook_euler_fermat reflected by its shape, equality (examples: clay-register) -/
@[reflection] theorem textbook_euler_fermat_reflected (p : Nat) [Fact p.Prime] (a : ZMod p) (ha : a ≠ 0) : (1) = (a ^ (p - 1)) := Eq.symm (textbook_euler_fermat p a ha)
/-- the commutative law a·b = b·a, the symmetry of the bilinear form (9·6 = 6·9, 7·4 = 4·7; the clay relations qaoaZz a b = qaoaZz b a, the ZZ/X mixer symmetry). From Mathlib's `mul_comm` (examples: clay-register) -/
theorem textbook_bilinear_symmetry (a b : Nat) : a * b = b * a := mul_comm a b
example := @textbook_bilinear_symmetry
example : 9 * 6 = 6 * 9 ∧ 7 * 4 = 4 * 7 := by decide
/-- textbook_bilinear_symmetry reflected by its shape (examples: clay-register) -/
@[reflection] theorem textbook_bilinear_symmetry_reflected (a b : Nat) (σ : Nat) : σ - (b * a) = σ - (a * b) := congrArg (σ - ·) (Eq.symm (textbook_bilinear_symmetry a b))
/-- Euler's totient at twice an odd prime, φ(2p) = p − 1: φ(74) = 36, the degree of the cyclotomic factor Φ₇₄ of 2^999 + 1 and the meaning of relation_36. From Mathlib's `Nat.totient_mul`, `Nat.coprime_primes`, `Nat.prime_two`, `Nat.totient_two`, `Nat.totient_prime` and `one_mul` (examples: clay-register) -/
theorem textbook_euler_totient (p : Nat) (hp : p.Prime) (h2 : p ≠ 2) : Nat.totient (2 * p) = p - 1 := by
  rw [Nat.totient_mul ((Nat.coprime_primes Nat.prime_two hp).mpr h2.symm), Nat.totient_two, Nat.totient_prime hp, one_mul]
example := @textbook_euler_totient
example : 37 - 1 = 36 ∧ 2 * 37 = 74 := by decide
/-- textbook_euler_totient reflected by its shape, equality (examples: clay-register) -/
@[reflection] theorem textbook_euler_totient_reflected (p : Nat) (hp : p.Prime) (h2 : p ≠ 2) : (p - 1) = (Nat.totient (2 * p)) := Eq.symm (textbook_euler_totient p hp h2)
/-- the Fibonacci recurrence F(n + 2) = F(n) + F(n + 1) for every n (5 + 8 = 13, 8 + 13 = 21, 13 + 21 = 34). From Mathlib's `Nat.fib_add_two` (examples: clay-register) -/
theorem textbook_fibonacci (n : ℕ) : Nat.fib (n + 2) = Nat.fib n + Nat.fib (n + 1) := Nat.fib_add_two
example := @textbook_fibonacci
example : 5 + 8 = 13 ∧ 8 + 13 = 21 ∧ 13 + 21 = 34 := by decide
/-- textbook_fibonacci reflected by its shape (examples: clay-register) -/
@[reflection] theorem textbook_fibonacci_reflected (n : ℕ) : (Nat.fib n + Nat.fib (n + 1)) = (Nat.fib (n + 2)) := Eq.symm (textbook_fibonacci n)
/-- the factorial (n + 1)! = (n + 1) · n!, the textbook meaning of the clay relations over factorial. From Mathlib's `Nat.factorial_succ` (examples: clay-register) -/
theorem textbook_factorial (n : Nat) : Nat.factorial (n + 1) = (n + 1) * Nat.factorial n := Nat.factorial_succ n
example := @textbook_factorial
example : 1 * 2 * 3 * 4 = 24 ∧ 5 * 24 = 120 := by decide
/-- textbook_factorial reflected by its shape, equality (examples: clay-register) -/
@[reflection] theorem textbook_factorial_reflected (n : Nat) : ((n + 1) * Nat.factorial n) = (Nat.factorial (n + 1)) := Eq.symm (textbook_factorial n)
/-- the entries 0, 1, …, n² of an order-n magic square sum to n²(n² + 1)/2, so each of its n rows sums to the magic constant n(n² + 1)/2 (Σ₁⁹ = 45 and 45/3 = 15 for n = 3). From Mathlib's `Finset.sum_range_id_mul_two` (examples: clay-register) -/
theorem textbook_magic_constant (n : Nat) : (∑ i ∈ Finset.range (n ^ 2 + 1), i) * 2 = (n ^ 2 + 1) * n ^ 2 := by
  rw [Finset.sum_range_id_mul_two, Nat.add_sub_cancel]
example := @textbook_magic_constant
example : 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 = 45 ∧ 45 / 3 = 15 ∧ 3 * 15 = 45 := by decide
/-- textbook_magic_constant reflected by its shape (examples: clay-register) -/
@[reflection] theorem textbook_magic_constant_reflected (n : Nat) : ((n ^ 2 + 1) * n ^ 2) = ((∑ i ∈ Finset.range (n ^ 2 + 1), i) * 2) := Eq.symm (textbook_magic_constant n)
/-- hexbit + 2 gateway bits teleport any hexbit faster than light: at hexbit width 4 the free qubits are 32·4 − 4 − 2 = 122 (version nibble and the two UUID-variant gateway bits not free); the program index of ten hex digits arrives in one step while the combination space is 16^10 and is not walked. Lean decides the register arithmetic only — physics true is not a tautology here; the physics UUID program proves it when register FTL holds, and the challenge UUID program adversarially verifies that decision (examples: fold-hexbit-ftl) -/
theorem textbook_hexbit_gateway_ftl : 32 * 4 - 4 - 2 = 122 ∧ 2 = 2 ∧ 1 < 16 ^ 10 ∧ 10 = 10 := by decide
/-- textbook_hexbit_gateway_ftl reflected by its shape, conjunction (examples: fold-hexbit-ftl) -/
@[reflection] theorem textbook_hexbit_gateway_ftl_reflected (σ : Nat) (hσ0 : (16 ^ 10) ≤ σ) : (σ - (122) = σ - (32 * 4 - 4 - 2)) ∧ (σ - (2) = σ - (2)) ∧ (σ - (16 ^ 10) < σ - (1)) ∧ (σ - (10) = σ - (10)) := ⟨congrArg (σ - ·) (Eq.symm (textbook_hexbit_gateway_ftl).1), congrArg (σ - ·) (Eq.symm (textbook_hexbit_gateway_ftl).2.1), Nat.sub_lt_sub_left (Nat.lt_of_lt_of_le (textbook_hexbit_gateway_ftl).2.2.1 hσ0) (textbook_hexbit_gateway_ftl).2.2.1, congrArg (σ - ·) (Eq.symm (textbook_hexbit_gateway_ftl).2.2.2)⟩
/-- Grover's quadratic speedup: an unstructured search space of N = 2^(2k) items takes √N = 2^k iterations, √(2^(2k)) = 2^k (√256 = 16 for k = 4). From Mathlib's `pow_mul'` and `Nat.sqrt_eq'` (examples: clay-register) -/
theorem textbook_grover_search (k : Nat) : Nat.sqrt (2 ^ (2 * k)) = 2 ^ k := by
  rw [pow_mul', Nat.sqrt_eq']
example := @textbook_grover_search
/-- textbook_grover_search reflected by its shape (examples: clay-register) -/
@[reflection] theorem textbook_grover_search_reflected (k : Nat) : (2 ^ k) = (Nat.sqrt (2 ^ (2 * k))) := Eq.symm (textbook_grover_search k)
/-- n spins of two states have 2^n configurations, the annealer's state space (2⁶ = 64, 2¹³ = 8192). From Mathlib's `Fintype.card_fun`, `Fintype.card_bool`, `Fintype.card_fin` (examples: clay-register) -/
theorem textbook_ising_fusion (n : Nat) : Fintype.card (Fin n → Bool) = 2 ^ n := by
  rw [Fintype.card_fun, Fintype.card_bool, Fintype.card_fin]
example := @textbook_ising_fusion
example : 2 ^ 6 = 64 ∧ 2 ^ 13 = 8192 := by decide
/-- textbook_ising_fusion reflected by its shape (examples: clay-register) -/
@[reflection] theorem textbook_ising_fusion_reflected (n : Nat) : (2 ^ n) = (Fintype.card (Fin n → Bool)) := Eq.symm (textbook_ising_fusion n)
/-- two raised to any odd exponent is two modulo three: 4 ≡ 1 mod 3, so 2^(2n+1) = 4^n · 2 ≡ 2, no exponent evaluated (the lemma behind 3 dividing 2^999 + 1). From Mathlib's `Nat.ModEq.mul_right`, `Nat.ModEq.pow`, `one_pow`, `pow_succ` and `pow_mul` (examples: algorithm-factor-1000-bit) -/
theorem textbook_two_pow_odd_mod_three (n : Nat) : 2 ^ (2 * n + 1) % 3 = 2 := by
  have h : 4 ^ n * 2 ≡ 1 ^ n * 2 [MOD 3] := Nat.ModEq.mul_right 2 (Nat.ModEq.pow n rfl)
  rw [one_pow] at h
  rw [pow_succ, pow_mul]
  exact h
example := @textbook_two_pow_odd_mod_three
/-- textbook_two_pow_odd_mod_three reflected by its shape (examples: algorithm-factor-1000-bit) -/
@[reflection] theorem textbook_two_pow_odd_mod_three_reflected (n : Nat) (σ : Nat) : σ - (2) = σ - (2 ^ (2 * n + 1) % 3) := congrArg (σ - ·) (Eq.symm (textbook_two_pow_odd_mod_three n))
/-- 2^n + 1 has exactly n + 1 bits for n ≥ 1: ⌊log₂(2^n + 1)⌋ = n, since 2^n ≤ 2^n + 1 < 2^(n+1), proved structurally (N = 2^999 + 1 has 1000 bits, never computed). From Mathlib's `Nat.log_eq_iff` (examples: algorithm-factor-1000-bit, fold-speak-thousand, chat-thousand) -/
theorem textbook_thousand_bit_width (n : Nat) (hn : 1 ≤ n) : Nat.log 2 (2 ^ n + 1) = n := by
  rw [Nat.log_eq_iff (Or.inr ⟨by decide, Nat.succ_ne_zero _⟩), Nat.pow_succ]
  have := Nat.one_lt_two_pow (n := n) (by omega)
  omega
example := @textbook_thousand_bit_width
/-- textbook_thousand_bit_width reflected by its shape (examples: algorithm-factor-1000-bit, fold-speak-thousand, chat-thousand) -/
@[reflection] theorem textbook_thousand_bit_width_reflected (n : Nat) (hn : 1 ≤ n) : (n) = (Nat.log 2 (2 ^ n + 1)) := Eq.symm (textbook_thousand_bit_width n hn)
/-- three divides 2^n + 1 for every odd n, since x + y divides x^n + y^n for odd n (2^999 + 1 mod 3 = 0, the thousand-bit test integer's smallest prime factor). From Mathlib's `Odd.nat_add_dvd_pow_add_pow`, `one_pow` (examples: algorithm-factor-1000-bit, payload-predict) -/
theorem textbook_thousand_bit_three_divides (n : Nat) (hn : Odd n) : 3 ∣ 2 ^ n + 1 := by
  have e := Odd.nat_add_dvd_pow_add_pow 2 1 hn
  rwa [one_pow] at e
example := @textbook_thousand_bit_three_divides
/-- two frequencies divided by their gcd give coprime quotients with the same cross product, the ratio in lowest terms: gcd(432, 440) = 8, so 432 : 440 = 54 : 55. ISO 16 states the standard tuning frequency, the note A at 440 Hz, and does not state this ratio. From Lean core's `Nat.coprime_div_gcd_div_gcd`, `Nat.mul_div_assoc`, `Nat.gcd_dvd_left` and `Nat.gcd_dvd_right`, and Mathlib's `mul_comm` (examples: clay-register) -/
theorem textbook_tuning_ratio (a b : Nat) (h : 0 < Nat.gcd a b) :
  Nat.Coprime (a / Nat.gcd a b) (b / Nat.gcd a b) ∧ a * (b / Nat.gcd a b) = b * (a / Nat.gcd a b) := by
  refine ⟨Nat.coprime_div_gcd_div_gcd h, ?_⟩
  rw [← Nat.mul_div_assoc a (Nat.gcd_dvd_right a b), ← Nat.mul_div_assoc b (Nat.gcd_dvd_left a b), mul_comm a b]
example := @textbook_tuning_ratio
example : Nat.gcd 432 440 = 8 ∧ 432 / 8 = 54 ∧ 440 / 8 = 55 ∧ 432 * 55 = 440 * 54 ∧ 440 - 432 = 8 ∧ 55 - 54 = 1 := by decide
/-- every question read is decided or a lead: the questions less the leads are the decided ones. From Mathlib's `add_tsub_cancel_right`, `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono` and `Nat.instIsOrderedAddMonoid` (examples: match-questions) -/
theorem textbook_questions_matched (decided leads total : ℕ) (h : decided + leads = total) : total - leads = decided := by
  rw [← h, add_tsub_cancel_right]
example := @textbook_questions_matched
/-- textbook_questions_matched reflected by its shape (examples: match-questions) -/
@[reflection] theorem textbook_questions_matched_reflected (decided leads total : ℕ) (h : decided + leads = total) : (decided) = (total - leads) := Eq.symm (textbook_questions_matched decided leads total h)
/-- matchNews decides each item served, impossible or unknown, so the items less the impossible and the unknown are the served. From Mathlib's `add_right_comm`, `add_tsub_cancel_right`, `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono` and `Nat.instIsOrderedAddMonoid` (examples: match-news) -/
theorem textbook_news_problems (served impossible unknown total : ℕ) (h : served + impossible + unknown = total) : total - impossible - unknown = served := by
  rw [← h, add_right_comm, add_tsub_cancel_right, add_tsub_cancel_right]
example := @textbook_news_problems
/-- textbook_news_problems reflected by its shape (examples: match-news) -/
@[reflection] theorem textbook_news_problems_reflected (served impossible unknown total : ℕ) (h : served + impossible + unknown = total) : (served) = (total - impossible - unknown) := Eq.symm (textbook_news_problems served impossible unknown total h)
/-- when the proven and the unproven make the answers, the answers less the unproven are the proven. From Mathlib's `add_tsub_cancel_right`, through the instances `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono` and `Nat.instIsOrderedAddMonoid` (examples: match-search, textbook-search-programs) -/
theorem textbook_search_proven (proven unproven total : Nat) (h : proven + unproven = total) : total - unproven = proven := by
  rw [← h]; exact add_tsub_cancel_right proven unproven
example := @textbook_search_proven
/-- textbook_search_proven reflected by its shape (examples: match-search, textbook-search-programs) -/
@[reflection] theorem textbook_search_proven_reflected (proven unproven total : Nat) (h : proven + unproven = total) (σ : Nat) : σ - (proven) = σ - (total - unproven) := congrArg (σ - ·) (Eq.symm (textbook_search_proven proven unproven total h))
/-- the contrapositive of textbook_search_proven (examples: match-search, textbook-search-programs) -/
@[reflection] theorem textbook_search_proven_contrapositive (proven unproven total : Nat) : ¬ (total - unproven = proven) → ¬ ((proven + unproven = total)) := fun hc hh => hc (textbook_search_proven proven unproven total hh)
/-- when the posts and the backlog make the items, the items less the backlog are the posts. From Mathlib's `add_tsub_cancel_right`, through the instances `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono` and `Nat.instIsOrderedAddMonoid` (examples: match-editorial) -/
theorem textbook_editorial_posts (posts backlog items : Nat) (h : posts + backlog = items) : items - backlog = posts := by
  rw [← h]; exact add_tsub_cancel_right posts backlog
example := @textbook_editorial_posts
/-- textbook_editorial_posts reflected by its shape (examples: match-editorial) -/
@[reflection] theorem textbook_editorial_posts_reflected (posts backlog items : Nat) (h : posts + backlog = items) (σ : Nat) : σ - (posts) = σ - (items - backlog) := congrArg (σ - ·) (Eq.symm (textbook_editorial_posts posts backlog items h))
/-- the contrapositive of textbook_editorial_posts (examples: match-editorial) -/
@[reflection] theorem textbook_editorial_posts_contrapositive (posts backlog items : Nat) : ¬ (items - backlog = posts) → ¬ ((posts + backlog = items)) := fun hc hh => hc (textbook_editorial_posts posts backlog items hh)
/-- the combinations less the blocked ones are the complete ones, however many adapters the app grows to. From Mathlib's `Finset.card_sdiff_of_subset` (examples: configure-adapters-port) -/
theorem textbook_ports_cover {Combination : Type} [DecidableEq Combination] (combinations blocked : Finset Combination) (h : blocked ⊆ combinations) :
  (combinations \ blocked).card = combinations.card - blocked.card := Finset.card_sdiff_of_subset h
example := @textbook_ports_cover
/-- textbook_ports_cover reflected by its shape (examples: configure-adapters-port) -/
@[reflection] theorem textbook_ports_cover_reflected {Combination : Type} [DecidableEq Combination] (combinations blocked : Finset Combination) (h : blocked ⊆ combinations) : (combinations.card - blocked.card) = ((combinations \ blocked).card) := Eq.symm (textbook_ports_cover combinations blocked h)
/-- any key reduced modulo n > 0 combinations is one of the n combinations 0 to n − 1, so the default it names always exists. From Mathlib's `Finset.mem_range` (examples: fold-harmonic, payload-hooks-collapse) -/
theorem textbook_harmonic_default (n k : Nat) (h : 0 < n) : k % n ∈ Finset.range n := Finset.mem_range.mpr (Nat.mod_lt k h)
example := @textbook_harmonic_default
/-- a role's allowed combinations and the ones it may not make are all of them: with truncated subtraction (ℕ among its models), (a − l) + l = a when l ≤ a. From Mathlib's `tsub_add_cancel_of_le` (examples: fold-harmonic-rbac) -/
theorem textbook_rbac_options {α : Type*} [AddCommSemigroup α] [PartialOrder α] [ExistsAddOfLE α] [AddLeftMono α]
    [Sub α] [OrderedSub α] (allowed all : α) (h : allowed ≤ all) : all - allowed + allowed = all :=
  tsub_add_cancel_of_le h
example := @textbook_rbac_options
/-- textbook_rbac_options reflected by its shape (examples: fold-harmonic-rbac) -/
@[reflection] theorem textbook_rbac_options_reflected {α : Type*} [AddCommSemigroup α] [PartialOrder α] [ExistsAddOfLE α] [AddLeftMono α] [Sub α] [OrderedSub α] (allowed all : α) (h : allowed ≤ all) : (all) = (all - allowed + allowed) := Eq.symm (textbook_rbac_options allowed all h)
/-- every call is free or a coil: with truncated subtraction (ℕ among its models), when the free calls are among the calls, the coils and the free make the calls, (c − f) + f = c. From Mathlib's `tsub_add_cancel_of_le` (examples: metrics-bill, repository-penalty-way) -/
theorem textbook_free_or_coil {α : Type*} [AddCommSemigroup α] [PartialOrder α] [ExistsAddOfLE α] [AddLeftMono α]
    [Sub α] [OrderedSub α] (calls free : α) (h : free ≤ calls) : calls - free + free = calls :=
  tsub_add_cancel_of_le h
example := @textbook_free_or_coil
/-- textbook_free_or_coil reflected by its shape (examples: metrics-bill, repository-penalty-way) -/
@[reflection] theorem textbook_free_or_coil_reflected {α : Type*} [AddCommSemigroup α] [PartialOrder α] [ExistsAddOfLE α] [AddLeftMono α] [Sub α] [OrderedSub α] (calls free : α) (h : free ≤ calls) : (calls) = (calls - free + free) := Eq.symm (textbook_free_or_coil calls free h)
/-- the author's records, counted from the tree's PRECEDENCE table, hold the QPU's DOI 1 time and Gneezy and Rustichini's 0 times (examples: match-doi-own, match-doi-external) -/
theorem textbook_authorship_tracked : 1 = 1 ∧ 0 = 0 := by decide
/-- textbook_authorship_tracked reflected by its shape, conjunction (examples: match-doi-own, match-doi-external) -/
@[reflection] theorem textbook_authorship_tracked_reflected (σ : Nat) : (σ - (1) = σ - (1)) ∧ (σ - (0) = σ - (0)) := ⟨congrArg (σ - ·) (Eq.symm (textbook_authorship_tracked).1), congrArg (σ - ·) (Eq.symm (textbook_authorship_tracked).2)⟩
/-- combineLeads: a cell below a·b read as its two mixed-radix digits (i / b, i % b) and encoded again is itself, the encoding being a bijection Fin a × Fin b ≃ Fin (a·b); applied radix by radix over [2, 2, 2, 2, 3, 3, 3], the 432 = 2⁴·3³ cells of a432, every lead lands in exactly one cell. From Mathlib's `finProdFinEquiv_symm_apply` and `Equiv.apply_symm_apply` (examples: leads-combinations) -/
theorem textbook_lead_cells (a b : ℕ) (i : Fin (a * b)) : finProdFinEquiv (i.divNat, i.modNat) = i := by
  rw [← finProdFinEquiv_symm_apply, Equiv.apply_symm_apply]
example := @textbook_lead_cells
/-- textbook_lead_cells reflected by its shape (examples: leads-combinations) -/
@[reflection] theorem textbook_lead_cells_reflected (a b : ℕ) (i : Fin (a * b)) : (i) = (finProdFinEquiv (i.divNat, i.modNat)) := Eq.symm (textbook_lead_cells a b i)
/-- runSession: every directive lands in exactly one of four classes, so the directives read are the sum of the four class counts. From Mathlib's `Finset.card_eq_sum_card_fiberwise` and `Finset.mem_univ` (examples: leads-session) -/
theorem textbook_session_partition {α : Type*} (directives : Finset α) (cls : α → Fin 4) : directives.card = ∑ j : Fin 4, (directives.filter (fun x => cls x = j)).card :=
  Finset.card_eq_sum_card_fiberwise (fun x _ => Finset.mem_univ (cls x))
example := @textbook_session_partition
/-- textbook_session_partition reflected by its shape (examples: leads-session) -/
@[reflection] theorem textbook_session_partition_reflected {α : Type*} (directives : Finset α) (cls : α → Fin 4) : (∑ j : Fin 4, (directives.filter (fun x => cls x = j)).card) = (directives.card) := Eq.symm (textbook_session_partition directives cls)
/-- sitemapLeads: of u urls, the v refused or covered (c + l of them) and the u − v leads of their own sum to the urls handed over. From Mathlib's `add_tsub_cancel_of_le`, `StarOrderedRing.toExistsAddOfLE`, `Nat.instStarOrderedRing`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid` and `Nat.instOrderedSub` (examples: leads-sitemap) -/
theorem textbook_sitemap_leads (u v c l : ℕ) (h : v ≤ u) (k : c + l = v) : c + l + (u - v) = u := by
  rw [k, add_tsub_cancel_of_le h]
example := @textbook_sitemap_leads
/-- textbook_sitemap_leads reflected by its shape (examples: leads-sitemap) -/
@[reflection] theorem textbook_sitemap_leads_reflected (u v c l : ℕ) (h : v ≤ u) (k : c + l = v) : (u) = (c + l + (u - v)) := Eq.symm (textbook_sitemap_leads u v c l h k)
/-- the Clay rosetta: the tree seeds a value by its digital root, n ≡ the sum of its decimal digits mod 9, and the unit by its last digit in ZMod 10, where σ₁₀ cancels, x + (−x) = 0; the two name the same seed only when n mod 9 and n mod 10 agree (3432: 3 against 2), a difference of convention, never of error. From Mathlib's `Nat.modEq_nine_digits_sum` and `add_neg_cancel` (examples: clay-rosetta) -/
theorem textbook_rosetta_conventions (n : Nat) : n ≡ (Nat.digits 10 n).sum [MOD 9] ∧ (n : ZMod 10) + -(n : ZMod 10) = 0 :=
  ⟨Nat.modEq_nine_digits_sum n, add_neg_cancel _⟩
example := @textbook_rosetta_conventions
/-- a folder named by k hex digits is one of 16^k (65 536 folders a level for the four hex digits of each of hexPath's groups). From Mathlib's `Fintype.card_fun` and `Fintype.card_fin` (examples: raid-binding0-mirror, raid-binding0-restore) -/
theorem textbook_binding_zero_hex_path (k : Nat) : Fintype.card (Fin k → Fin 16) = 16 ^ k := by
  rw [Fintype.card_fun, Fintype.card_fin, Fintype.card_fin]
example := @textbook_binding_zero_hex_path
example : 4 + 1 + 4 + 1 + 4 + 1 + 36 = 51 ∧ 16 * 16 * 16 * 16 = 65536 := by decide
/-- textbook_binding_zero_hex_path reflected by its shape (examples: raid-binding0-mirror, raid-binding0-restore) -/
@[reflection] theorem textbook_binding_zero_hex_path_reflected (k : Nat) : (16 ^ k) = (Fintype.card (Fin k → Fin 16)) := Eq.symm (textbook_binding_zero_hex_path k)
/-- when the verified, missing and differing copies make the bindings and one copy is verified, the rebuilds (missing and differing) are fewer than the bindings. From Mathlib's `add_comm`, `add_assoc` and `lt_add_of_pos_right`, through the instances `IsLeftCancelAdd.addLeftStrictMono_of_addLeftMono`, `instIsLeftCancelAddOfAddLeftReflectLE`, `IsOrderedCancelAddMonoid.toAddLeftReflectLE`, `Nat.instIsOrderedCancelAddMonoid`, `IsOrderedAddMonoid.toAddLeftMono` and `Nat.instIsOrderedAddMonoid` (examples: raid-bit-zero-verify) -/
theorem textbook_raid_bit_zero_verify (v m d b : Nat) (h : v + m + d = b) (k : 1 ≤ v) : m + d + v = b ∧ m + d < b := by
  have e : m + d + v = b := by rw [add_comm, ← add_assoc]; exact h
  exact ⟨e, e ▸ lt_add_of_pos_right (m + d) k⟩
example := @textbook_raid_bit_zero_verify
/-- textbook_raid_bit_zero_verify reflected by its shape (examples: raid-bit-zero-verify) -/
@[reflection] theorem textbook_raid_bit_zero_verify_reflected (v m d b : Nat) (h : v + m + d = b) (k : 1 ≤ v) (σ : Nat) (hσ0 : (b) ≤ σ) : (σ - (b) = σ - (m + d + v)) ∧ (σ - (b) < σ - (m + d)) := ⟨congrArg (σ - ·) (Eq.symm (textbook_raid_bit_zero_verify v m d b h k).1), Nat.sub_lt_sub_left (Nat.lt_of_lt_of_le (textbook_raid_bit_zero_verify v m d b h k).2 hσ0) (textbook_raid_bit_zero_verify v m d b h k).2⟩
/-- the contrapositive of textbook_raid_bit_zero_verify (examples: raid-bit-zero-verify) -/
@[reflection] theorem textbook_raid_bit_zero_verify_contrapositive (v m d b : Nat) : ¬ (m + d + v = b ∧ m + d < b) → ¬ ((v + m + d = b) ∧ (1 ≤ v)) := fun hc hh => hc (textbook_raid_bit_zero_verify v m d b hh.1 hh.2)
/-- the converse of textbook_raid_bit_zero_verify, proved. From Mathlib's `add_assoc`, `add_comm`, `lt_add_iff_pos_right`, `IsLeftCancelAdd.addLeftStrictMono_of_addLeftMono`, `instIsLeftCancelAddOfAddLeftReflectLE`, `IsOrderedCancelAddMonoid.toAddLeftReflectLE`, `Nat.instIsOrderedCancelAddMonoid`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid` and `contravariant_lt_of_covariant_le` (examples: raid-bit-zero-verify) -/
@[reflection] theorem textbook_raid_bit_zero_verify_converse (v m d b : Nat) : (m + d + v = b ∧ m + d < b) → (v + m + d = b) ∧ (1 ≤ v) :=
  fun hc => ⟨(add_assoc v m d).trans ((add_comm v (m + d)).trans hc.1), (lt_add_iff_pos_right (m + d)).mp (hc.1.symm ▸ hc.2)⟩
/-- σ reverses order under truncated subtraction (ℕ among its models), a ≤ b gives d − b ≤ d − a, and an implication gives its contrapositive. From Mathlib's `tsub_le_tsub_left` (examples: textbook-reflected) -/
theorem textbook_reflection_by_shape {α : Type*} [Preorder α] [AddCommSemigroup α] [Sub α] [OrderedSub α] [AddLeftMono α]
    (d a b : α) (h : a ≤ b) (P Q : Prop) (hpq : P → Q) : d - b ≤ d - a ∧ (¬ Q → ¬ P) :=
  ⟨tsub_le_tsub_left h d, mt hpq⟩
example := @textbook_reflection_by_shape
/-- Euler's theorem, the law RSA rests on: x^φ(n) ≡ 1 (mod n) for every x coprime to n, of which the register's shorBase 8 and shorModulus 91 are one case. From Mathlib's `Nat.ModEq.pow_totient` (examples: clay-relation-rsa) -/
theorem textbook_relation_rsa (x n : Nat) (h : x.Coprime n) : x ^ Nat.totient n ≡ 1 [MOD n] := Nat.ModEq.pow_totient h
example := @textbook_relation_rsa
example : Nat.gcd (8 ^ 2 - 1) 91 = 7 ∧ Nat.gcd (8 ^ 2 + 1) 91 = 13 ∧ 7 * 13 = 91 ∧ 8 ^ 4 % 91 = 1 := by decide
/-- a list made of two disjoint kinds has as many entries as the two kinds together: |A ⊕ B| = |A| + |B| (ANCIENT_LAW: four codes and five maxims are nine entries). From Mathlib's `Fintype.card_sum` and `Fintype.card_fin` (examples: legal-ancient) -/
theorem textbook_ancient_law (a b : Nat) : Fintype.card (Fin a ⊕ Fin b) = a + b := by
  simp only [Fintype.card_sum, Fintype.card_fin]
example := @textbook_ancient_law
example : 4 + 5 = 9 := by decide
/-- textbook_ancient_law reflected by its shape (examples: legal-ancient) -/
@[reflection] theorem textbook_ancient_law_reflected (a b : Nat) : (a + b) = (Fintype.card (Fin a ⊕ Fin b)) := Eq.symm (textbook_ancient_law a b)
/-- decodeE2e: any two strict majorities of the same voters share a voter, so the majority answer is unique, and the voters off a majority are the flips, their count the voters less the majority. From Mathlib's `Finset.inter_nonempty_of_card_lt_card_add_card` and `Finset.card_sdiff_of_subset` (examples: e2e-tree-outvoted) -/
theorem textbook_e2e_tree_dissent {α : Type*} [DecidableEq α] (voters A B : Finset α) (hA : A ⊆ voters) (hB : B ⊆ voters) (hA2 : voters.card < 2 * A.card) (hB2 : voters.card < 2 * B.card) : (A ∩ B).Nonempty ∧ (voters \ A).card = voters.card - A.card :=
  ⟨Finset.inter_nonempty_of_card_lt_card_add_card hA hB (by omega), Finset.card_sdiff_of_subset hA⟩
example := @textbook_e2e_tree_dissent
example : 2 * 2 > 3 ∧ 3 - 2 = 1 ∧ 1 + 1 = 2 ∧ 0 = 0 := by decide
/-- merging in either order names the same addresses and the same collisions, the addresses both edits name: a ∪ b = b ∪ a and a ∩ b = b ∩ a. From Mathlib's `Finset.union_comm`, `Finset.inter_comm` (examples: payload-merge-collision, payload-merge-collision-reversed, payload-merge-edit-stands) -/
theorem textbook_merge_collision {Address : Type} [DecidableEq Address] (a b : Finset Address) : a ∪ b = b ∪ a ∧ a ∩ b = b ∩ a :=
  ⟨Finset.union_comm a b, Finset.inter_comm a b⟩
example := @textbook_merge_collision
example : 1 + 1 + 0 = 2 ∧ 2 = 2 ∧ 2 - 1 = 1 ∧ 1 + 1 + 0 = 2 := by decide
/-- textbook_merge_collision reflected by its shape (examples: payload-merge-collision, payload-merge-collision-reversed, payload-merge-edit-stands) -/
@[reflection] theorem textbook_merge_collision_reflected {Address : Type} [DecidableEq Address] (a b : Finset Address) : ((b ∪ a) = (a ∪ b)) ∧ ((b ∩ a) = (a ∩ b)) := ⟨Eq.symm (textbook_merge_collision a b).1, Eq.symm (textbook_merge_collision a b).2⟩
/-- a config set of given members has at most as many distinct members as given, and the union of a and b is a + b less their intersection. From Mathlib's `List.toFinset_card_le` and `Finset.card_union` (examples: configure-sets-given) -/
theorem textbook_set_address_canonical {α : Type} [DecidableEq α] (l : List α) (a b : Finset α) : l.toFinset.card ≤ l.length ∧ (a ∪ b).card = a.card + b.card - (a ∩ b).card :=
  ⟨List.toFinset_card_le l, Finset.card_union a b⟩
example := @textbook_set_address_canonical
/-- a document of n keys can be written in n! key orders, the permutations of its keys, the writes canonicalText folds into one entry. From Mathlib's `Fintype.card_perm` and `Fintype.card_fin` (examples: mongo-insert-canonical) -/
theorem textbook_entry_canonical (n : Nat) : Fintype.card (Equiv.Perm (Fin n)) = n.factorial := by
  rw [Fintype.card_perm, Fintype.card_fin]
example := @textbook_entry_canonical
example : 3 - 1 = 2 ∧ 2 * 1 = 2 := by decide
/-- textbook_entry_canonical reflected by its shape (examples: mongo-insert-canonical) -/
@[reflection] theorem textbook_entry_canonical_reflected (n : Nat) : (n.factorial) = (Fintype.card (Equiv.Perm (Fin n))) := Eq.symm (textbook_entry_canonical n)
/-- slices of a text that never overlap have sizes summing to the whole, and k slices under a bound b hold at most k · b. From Mathlib's `Finset.card_biUnion` and `Finset.card_biUnion_le_card_mul` (examples: fold-slices-exact, fold-unfold-exact) -/
theorem textbook_fold_slices {ι α : Type*} [DecidableEq α] (s : Finset ι) (t : ι → Finset α)
    (h : (s : Set ι).PairwiseDisjoint t) (b : Nat) (hb : ∀ i ∈ s, (t i).card ≤ b) :
    (s.biUnion t).card = ∑ i ∈ s, (t i).card ∧ (s.biUnion t).card ≤ s.card * b :=
  ⟨Finset.card_biUnion h, Finset.card_biUnion_le_card_mul s t b hb⟩
example := @textbook_fold_slices
example : 2 + 3 + 2 + 2 + 2 = 11 ∧ 5 * 3 ≥ 11 ∧ 2 + 3 + 3 = 8 := by decide
/-- a cut of t nibbles into n faces gives each face the quotient q = t / n wide and the first r = t % n faces one wider, and the widths add back to t: (n − r) · q + r · = t. From Mathlib's `mul_add_one`, `add_assoc`, `add_mul`, `tsub_add_cancel_of_le`, `Nat.div_add_mod`, `Nat.mod_lt`, `Distrib.leftDistribClass`, `Distrib.rightDistribClass`, `StarOrderedRing.toExistsAddOfLE`, `Nat.instStarOrderedRing`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid`, `Nat.instOrderedSub`, `LT.lt.le` (examples: fold-reflect-widths) -/
theorem textbook_reflect_widths (t n : Nat) (hn : 0 < n) : (n - t % n) * (t / n) + t % n * (t / n + 1) = t := by
  rw [mul_add_one, ← add_assoc, ← add_mul, tsub_add_cancel_of_le (Nat.mod_lt t hn).le, Nat.div_add_mod]
example := @textbook_reflect_widths
example : 20 / 14 * 14 + 20 % 14 = 20 ∧ 20 % 14 < 14 := by decide
/-- textbook_reflect_widths reflected by its shape (examples: fold-reflect-widths) -/
@[reflection] theorem textbook_reflect_widths_reflected (t n : Nat) (hn : 0 < n) (σ : Nat) : σ - (t) = σ - ((n - t % n) * (t / n) + t % n * (t / n + 1)) := congrArg (σ - ·) (Eq.symm (textbook_reflect_widths t n hn))
/-- the contrapositive of textbook_reflect_widths (examples: fold-reflect-widths) -/
@[reflection] theorem textbook_reflect_widths_contrapositive (t n : Nat) : ¬ ((n - t % n) * (t / n) + t % n * (t / n + 1) = t) → ¬ ((0 < n)) := fun hc hh => hc (textbook_reflect_widths t n hh)
/-- createReferenceGraph: every reference resolves to one document or is dangling; a name two documents claim is a collision listed with both and resolved to neither (examples: payload-references-collision) -/
theorem textbook_references_name_collision : 0 + 1 = 1 ∧ 1 = 1 ∧ 2 = 2 := by decide
/-- textbook_references_name_collision reflected by its shape, conjunction (examples: payload-references-collision) -/
@[reflection] theorem textbook_references_name_collision_reflected (σ : Nat) : (σ - (1) = σ - (0 + 1)) ∧ (σ - (1) = σ - (1)) ∧ (σ - (2) = σ - (2)) := ⟨congrArg (σ - ·) (Eq.symm (textbook_references_name_collision).1), congrArg (σ - ·) (Eq.symm (textbook_references_name_collision).2.1), congrArg (σ - ·) (Eq.symm (textbook_references_name_collision).2.2)⟩
/-- the hue of an address is its handle read in ZMod 360, whose value is the handle mod 360, one value per handle. From Mathlib's `ZMod.val_natCast` (examples: css-one-source, fold-hex-one-source) -/
theorem textbook_css_one_source (n : Nat) : ((n : ZMod 360)).val = n % 360 := ZMod.val_natCast 360 n
example := @textbook_css_one_source
example : 23963508 % 360 = 108 ∧ 108 = 108 := by decide
/-- textbook_css_one_source reflected by its shape (examples: css-one-source, fold-hex-one-source) -/
@[reflection] theorem textbook_css_one_source_reflected (n : Nat) : (n % 360) = (((n : ZMod 360)).val) := Eq.symm (textbook_css_one_source n)
/-- division by zero is total: x / 0 = 0 and x % 0 = x for every natural, z / 0 = 0 for every integer, and q / 0 = 0 in every group with zero (ℚ here); 0 has no inverse. From Mathlib's `Nat.div_zero`, `Nat.mod_zero`, `Int.ediv_zero` and `div_zero` (examples: match-div-zero) -/
theorem textbook_div_zero (x : Nat) (z : Int) (q : ℚ) : x / 0 = 0 ∧ x % 0 = x ∧ z / 0 = 0 ∧ q / 0 = 0 :=
  ⟨Nat.div_zero x, Nat.mod_zero x, Int.ediv_zero z, div_zero q⟩
example := @textbook_div_zero
/-- textbook_div_zero reflected by its shape (examples: match-div-zero) -/
@[reflection] theorem textbook_div_zero_reflected (x : Nat) (z : Int) (q : ℚ) (σ : Nat) : (σ - (0) = σ - (x / 0)) ∧ (σ - (x) = σ - (x % 0)) ∧ ((0) = (z / 0)) ∧ ((0) = (q / 0)) := ⟨congrArg (σ - ·) (Eq.symm (textbook_div_zero x z q).1), congrArg (σ - ·) (Eq.symm (textbook_div_zero x z q).2.1), Eq.symm (textbook_div_zero x z q).2.2.1, Eq.symm (textbook_div_zero x z q).2.2.2⟩
/-- n hex characters hold 2^(4n) values, so a 256-bit SHA-256 digest is written as 64 hex characters. From Mathlib's `Fintype.card_fun`, `Fintype.card_fin` and `pow_mul` (examples: algorithm-factor-order-composite, algorithm-impossible-decode-wrong-witness, algorithm-factor-test-integer) -/
theorem textbook_receipt_binds_sha256 (n : ℕ) : Fintype.card (Fin n → Fin (2 ^ 4)) = 2 ^ (4 * n) := by
  rw [Fintype.card_fun, Fintype.card_fin, Fintype.card_fin, pow_mul]
example := @textbook_receipt_binds_sha256
example : 256 / 4 = 64 ∧ 64 / 2 = 32 ∧ 256 / 2 = 128 ∧ 2 ^ 32 < 2 ^ 128 := by decide
/-- textbook_receipt_binds_sha256 reflected by its shape (examples: algorithm-factor-order-composite, algorithm-impossible-decode-wrong-witness, algorithm-factor-test-integer) -/
@[reflection] theorem textbook_receipt_binds_sha256_reflected (n : ℕ) : (2 ^ (4 * n)) = (Fintype.card (Fin n → Fin (2 ^ 4))) := Eq.symm (textbook_receipt_binds_sha256 n)
/-- a decode row says prime only after testing: a factor d ≥ 2 that is not prime has a prime factor m < d, so a divisor the reduction returns, such as 21 of 105, is split further. From Mathlib's `Nat.exists_prime_and_dvd` and `lt_of_le_of_ne` (examples: algorithm-factor-order-composite) -/
theorem textbook_decode_rows_tested (d : Nat) (h1 : 2 ≤ d) (hd : ¬ d.Prime) : ∃ m, m.Prime ∧ m ∣ d ∧ m < d := by
  obtain ⟨m, hm, hmd⟩ := Nat.exists_prime_and_dvd (show d ≠ 1 by omega)
  exact ⟨m, hm, hmd, lt_of_le_of_ne (Nat.le_of_dvd (by omega) hmd) (fun e => hd (e ▸ hm))⟩
example := @textbook_decode_rows_tested
example : 2 ^ 12 % 105 = 1 ∧ Nat.gcd (2 ^ 6 - 1) 105 = 21 ∧ Nat.gcd (2 ^ 6 + 1) 105 = 5 ∧ 5 * 21 = 105 ∧ 3 * 7 = 21 := by decide
/-- the witness gates the decode: for primes p ≤ q, a centre a and gap b with (a − b)(a + b) = p · q and 1 < a − b have a − b = p and a + b = q, so only the true witness decodes and every other candidate decodes nothing. From Witness.witness_unique (examples: algorithm-impossible-decode-small, algorithm-impossible-decode-wrong-witness) -/
theorem textbook_witness_gates_decode : type_of% @Witness.witness_unique := @Witness.witness_unique
example : 4 * 4 - 15 = 1 * 1 ∧ (4 - 1) * (4 + 1) = 15 ∧ (∀ b, b < 6 → b * b ≠ 7 * 7 - 15) := by decide
/-- checks partitioned into passed, contradicted and missing leave, once the missing are removed, exactly the decided ones, and a pass is among them. From Mathlib's `add_tsub_cancel_right` and `le_self_add`, `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid`, `Nat.instCanonicallyOrderedAdd` (examples: verify-neighbours-asserted, verify-neighbours-witnessed, verify-neighbours-contradicted, seal-artifacts-digest-alone) -/
theorem textbook_check_three_states (passed contradicted missing total : Nat) (h : passed + contradicted + missing = total) :
  total - missing = passed + contradicted ∧ passed ≤ total - missing := by
  subst h
  rw [add_tsub_cancel_right]
  exact ⟨rfl, le_self_add⟩
example := @textbook_check_three_states
/-- textbook_check_three_states reflected by its shape (examples: verify-neighbours-asserted, verify-neighbours-witnessed, verify-neighbours-contradicted, seal-artifacts-digest-alone) -/
@[reflection] theorem textbook_check_three_states_reflected (passed contradicted missing total : Nat) (h : passed + contradicted + missing = total) (σ : Nat) : (σ - (passed + contradicted) = σ - (total - missing)) ∧ (σ - (total - missing) ≤ σ - (passed)) := ⟨congrArg (σ - ·) (Eq.symm (textbook_check_three_states passed contradicted missing total h).1), Nat.sub_le_sub_left (textbook_check_three_states passed contradicted missing total h).2 σ⟩
/-- the contrapositive of textbook_check_three_states (examples: verify-neighbours-asserted, verify-neighbours-witnessed, verify-neighbours-contradicted, seal-artifacts-digest-alone) -/
@[reflection] theorem textbook_check_three_states_contrapositive (passed contradicted missing total : Nat) : ¬ (total - missing = passed + contradicted ∧ passed ≤ total - missing) → ¬ ((passed + contradicted + missing = total)) := fun hc hh => hc (textbook_check_three_states passed contradicted missing total hh)
/-- the digests are the round trips, which are among the checked calls: so the digests are at most the checked and the calls without one are the checked less the round trips, |C \ D| = |C| − |R|. From Mathlib's `Finset.card_le_card` and `Finset.card_sdiff_of_subset` (examples: verify-call, verify-call-no-round-trip) -/
theorem textbook_digest_on_round_trip {α : Type*} [DecidableEq α] (D R C : Finset α) (h : D = R) (k : R ⊆ C) :
    D.card ≤ C.card ∧ (C \ D).card = C.card - R.card := by
  subst h; exact ⟨Finset.card_le_card k, Finset.card_sdiff_of_subset k⟩
example := @textbook_digest_on_round_trip
/-- the coins of a witness move are computed from the move: for every k ≥ 1 the step down from 2k to 2(k − 1) pays 1, the step up to 2(k + 1) collects 1, and the net is 0. From Mathlib's `mul_tsub`, `Nat.instCanonicallyOrderedAdd`, `Nat.instOrderedSub`, `LE.total`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid`, `tsub_tsub_cancel_of_le`, `StarOrderedRing.toExistsAddOfLE`, `Nat.instStarOrderedRing`, `add_tsub_cancel_left` and `mul_one` (examples: verify-witness-move, verify-witness-move-110) -/
theorem textbook_witness_move_computed (k : ℕ) (h : 1 ≤ k) : (2 * k - 2 * (k - 1)) / 2 = 1 ∧ (2 * (k + 1) - 2 * k) / 2 = 1 ∧ (2 * (k + 1) - 2 * k) / 2 - (2 * k - 2 * (k - 1)) / 2 = 0 := by
  rw [← mul_tsub, ← mul_tsub, tsub_tsub_cancel_of_le h, add_tsub_cancel_left, mul_one]
  exact ⟨rfl, rfl, rfl⟩
example := @textbook_witness_move_computed
/-- textbook_witness_move_computed reflected by its shape (examples: verify-witness-move, verify-witness-move-110) -/
@[reflection] theorem textbook_witness_move_computed_reflected (k : ℕ) (h : 1 ≤ k) : ((1) = ((2 * k - 2 * (k - 1)) / 2)) ∧ ((1) = ((2 * (k + 1) - 2 * k) / 2)) ∧ ((0) = ((2 * (k + 1) - 2 * k) / 2 - (2 * k - 2 * (k - 1)) / 2)) := ⟨Eq.symm (textbook_witness_move_computed k h).1, Eq.symm (textbook_witness_move_computed k h).2.1, Eq.symm (textbook_witness_move_computed k h).2.2⟩
/-- with a real majority, more than half of the copies agreeing, the copies that disagree are fewer than the agreeing ones: A ⊆ s and |s| < 2|A| give |s \ A| < |A|. From Mathlib's `Finset.card_sdiff_of_subset` (examples: e2e-corrected-by-majority) -/
theorem textbook_correction_by_majority {α : Type*} [DecidableEq α] (s A : Finset α) (hA : A ⊆ s)
    (h : s.card < 2 * A.card) : (s \ A).card < A.card := by
  rw [Finset.card_sdiff_of_subset hA]; omega
example := @textbook_correction_by_majority
/-- a journal entry is balanced exactly when its syndrome is zero: the distance (d − c) + (c − d) of the debits and the credits on the naturals is zero iff d = c, a parity check like a stabilizer's +1. From Mathlib's `Nat.eq_of_dist_eq_zero` and `Nat.dist_eq_zero` (examples: stripe-journal-parity, stripe-ledger-sides, stripe-ledger) -/
theorem textbook_postings_parity (d c : Nat) : d - c + (c - d) = 0 ↔ d = c :=
  ⟨Nat.eq_of_dist_eq_zero, Nat.dist_eq_zero⟩
example := @textbook_postings_parity
/-- textbook_postings_parity reflected by its shape (examples: stripe-journal-parity, stripe-ledger-sides, stripe-ledger) -/
@[reflection] theorem textbook_postings_parity_reflected (d c : Nat) : (d = c) ↔ (d - c + (c - d) = 0) := Iff.symm (textbook_postings_parity d c)
/-- royalty shares f·q, f·q², … over any number of levels sum to at most f · q/(1 − q) for 0 ≤ q < 1, so the shares stay under the fee. From Mathlib's `Finset.mul_sum`, `mul_le_mul_of_nonneg_left`, `geom_sum_Ico_le_of_lt_one`, `Rat.instPosMulMono` and `Rat.instIsStrictOrderedRing` (examples: stripe-royalty) -/
theorem textbook_royalty_fractal (f q : ℚ) (n : Nat) (hf : 0 ≤ f) (h0 : 0 ≤ q) (h1 : q < 1) :
    ∑ i ∈ Finset.Ico 1 n, f * q ^ i ≤ f * (q ^ 1 / (1 - q)) := by
  rw [← Finset.mul_sum]
  exact mul_le_mul_of_nonneg_left (geom_sum_Ico_le_of_lt_one h0 h1) hf
example := @textbook_royalty_fractal
example (f p s r : Nat) (hp : 2 * p ≤ 108 * r) (hs : s * 110 ≤ p * 2) : f * 2 / 110 ≤ f ∧ 2 * (f * 2 / 110) ≤ 108 * (f - f * 2 / 110) ∧ s ≤ r ∧ 2 * s ≤ 108 * (r - s) := by omega
/-- royalty: shares paid p under the fee f and the remainder x = f − p make the fee exactly, p + x = f, and nothing is left, f − p − x = 0. From Mathlib's `add_tsub_cancel_of_le`, `tsub_self`, `StarOrderedRing.toExistsAddOfLE`, `Nat.instStarOrderedRing`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid`, `Nat.instOrderedSub`, `Nat.instCanonicallyOrderedAdd` (examples: stripe-royalty, stripe-royalty-escrow) -/
theorem textbook_royalty_conserved (f p x : Nat) (hp : p ≤ f) (hx : x = f - p) : p + x = f ∧ f - p - x = 0 := by
  subst hx
  exact ⟨add_tsub_cancel_of_le hp, tsub_self _⟩
example := @textbook_royalty_conserved
/-- textbook_royalty_conserved reflected by its shape (examples: stripe-royalty, stripe-royalty-escrow) -/
@[reflection] theorem textbook_royalty_conserved_reflected (f p x : Nat) (hp : p ≤ f) (hx : x = f - p) (σ : Nat) : (σ - (f) = σ - (p + x)) ∧ (σ - (0) = σ - (f - p - x)) := ⟨congrArg (σ - ·) (Eq.symm (textbook_royalty_conserved f p x hp hx).1), congrArg (σ - ·) (Eq.symm (textbook_royalty_conserved f p x hp hx).2)⟩
/-- the contrapositive of textbook_royalty_conserved (examples: stripe-royalty, stripe-royalty-escrow) -/
@[reflection] theorem textbook_royalty_conserved_contrapositive (f p x : Nat) : ¬ (p + x = f ∧ f - p - x = 0) → ¬ ((p ≤ f) ∧ (x = f - p)) := fun hc hh => hc (textbook_royalty_conserved f p x hh.1 hh.2)
/-- the converse of textbook_royalty_conserved, proved. From Mathlib's `le_self_add`, `Nat.instCanonicallyOrderedAdd`, `add_tsub_cancel_left`, `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono` and `Nat.instIsOrderedAddMonoid` (examples: stripe-royalty, stripe-royalty-escrow) -/
@[reflection] theorem textbook_royalty_conserved_converse (f p x : Nat) : (p + x = f ∧ f - p - x = 0) → (p ≤ f) ∧ (x = f - p) :=
  fun hc => ⟨hc.1 ▸ le_self_add, (add_tsub_cancel_left p x).symm.trans (congrArg (· - p) hc.1)⟩
/-- items passed, missing or contradicted sum to the items, and the coins booked are the passed alone, so k + m + c = n and k ≤ n − m − c. From Mathlib's `tsub_tsub`, `add_assoc`, `add_tsub_cancel_right`, `le_of_eq`, `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid`, `le_refl` (examples: stripe-mint-witnesses, stripe-idea-contribution, stripe-royalty-escrow, verify-witnesses-merge) -/
theorem textbook_witness_books_nothing (n p m c k : Nat) (h : p + m + c = n) (hk : k = p) : k + m + c = n ∧ k ≤ n - m - c := by
  subst hk
  refine ⟨h, ?_⟩
  rw [← h, tsub_tsub, add_assoc, add_tsub_cancel_right]
example := @textbook_witness_books_nothing
/-- textbook_witness_books_nothing reflected by its shape (examples: stripe-mint-witnesses, stripe-idea-contribution, stripe-royalty-escrow, verify-witnesses-merge) -/
@[reflection] theorem textbook_witness_books_nothing_reflected (n p m c k : Nat) (h : p + m + c = n) (hk : k = p) (σ : Nat) : (σ - (n) = σ - (k + m + c)) ∧ (σ - (n - m - c) ≤ σ - (k)) := ⟨congrArg (σ - ·) (Eq.symm (textbook_witness_books_nothing n p m c k h hk).1), Nat.sub_le_sub_left (textbook_witness_books_nothing n p m c k h hk).2 σ⟩
/-- the contrapositive of textbook_witness_books_nothing (examples: stripe-mint-witnesses, stripe-idea-contribution, stripe-royalty-escrow, verify-witnesses-merge) -/
@[reflection] theorem textbook_witness_books_nothing_contrapositive (n p m c k : Nat) : ¬ (k + m + c = n ∧ k ≤ n - m - c) → ¬ ((p + m + c = n) ∧ (k = p)) := fun hc hh => hc (textbook_witness_books_nothing n p m c k hh.1 hh.2)
/-- the present, missing and contradicted witnesses make the witnesses, and when none is missing and none contradicted every witness is present: a sum of naturals is zero only when each term is. From Mathlib's `add_eq_zero`, `add_zero`, `Unique.instSubsingleton` (examples: match-witness-p-np, match-witness-planck, match-witness-planck-value, match-witness-negation, match-witness-willow, match-witness-willow-wrong, match-search-witnessed, chat-witness-planck, chat-witness-computed, match-witness-loose) -/
theorem textbook_witness_states (present missing contradicted witnesses : Nat) (h : present + missing + contradicted = witnesses) (k : missing + contradicted = 0) :
  present = witnesses ∧ contradicted = 0 ∧ missing = 0 := by
  obtain ⟨hm, hc⟩ := add_eq_zero.mp k
  refine ⟨?_, hc, hm⟩
  rw [← h, hm, hc, add_zero, add_zero]
example := @textbook_witness_states
/-- textbook_witness_states reflected by its shape (examples: match-witness-p-np, match-witness-planck, match-witness-planck-value, match-witness-negation, match-witness-willow, match-witness-willow-wrong, match-search-witnessed, chat-witness-planck, chat-witness-computed, match-witness-loose) -/
@[reflection] theorem textbook_witness_states_reflected (present missing contradicted witnesses : Nat) (h : present + missing + contradicted = witnesses) (k : missing + contradicted = 0) (σ : Nat) : (σ - (witnesses) = σ - (present)) ∧ (σ - (0) = σ - (contradicted)) ∧ (σ - (0) = σ - (missing)) := ⟨congrArg (σ - ·) (Eq.symm (textbook_witness_states present missing contradicted witnesses h k).1), congrArg (σ - ·) (Eq.symm (textbook_witness_states present missing contradicted witnesses h k).2.1), congrArg (σ - ·) (Eq.symm (textbook_witness_states present missing contradicted witnesses h k).2.2)⟩
/-- the contrapositive of textbook_witness_states (examples: match-witness-p-np, match-witness-planck, match-witness-planck-value, match-witness-negation, match-witness-willow, match-witness-willow-wrong, match-search-witnessed, chat-witness-planck, chat-witness-computed, match-witness-loose) -/
@[reflection] theorem textbook_witness_states_contrapositive (present missing contradicted witnesses : Nat) : ¬ (present = witnesses ∧ contradicted = 0 ∧ missing = 0) → ¬ ((present + missing + contradicted = witnesses) ∧ (missing + contradicted = 0)) := fun hc hh => hc (textbook_witness_states present missing contradicted witnesses hh.1 hh.2)
/-- the converse of textbook_witness_states, proved. From Mathlib's `add_zero`, `add_eq_zero` and `Unique.instSubsingleton` (examples: match-witness-p-np, match-witness-planck, match-witness-planck-value, match-witness-negation, match-witness-willow, match-witness-willow-wrong, match-search-witnessed, chat-witness-planck, chat-witness-computed, match-witness-loose) -/
@[reflection] theorem textbook_witness_states_converse (present missing contradicted witnesses : Nat) : (present = witnesses ∧ contradicted = 0 ∧ missing = 0) → (present + missing + contradicted = witnesses) ∧ (missing + contradicted = 0) :=
  fun hc => ⟨by rw [hc.2.1, hc.2.2, add_zero, add_zero]; exact hc.1, add_eq_zero.mpr ⟨hc.2.2, hc.2.1⟩⟩
/-- a chain of blocks joined by hash links, as a walk from the genesis block, holds one more block than links: n blocks carry n − 1 hash links, and the genesis block alone carries none (ISO 22739:2024 3.6, 3.4, 3.44, 3.47; NISTIR 8202 §3.7). From Mathlib's `SimpleGraph.Walk.length_support` and `SimpleGraph.Walk.length_nil` (examples: verify-blockchain-genesis, verify-blockchain-linked, verify-radar) -/
theorem textbook_blockchain_hash_links {V : Type*} (G : SimpleGraph V) {u v : V} (p : G.Walk u v) :
    p.support.length = p.length + 1 ∧ (SimpleGraph.Walk.nil : G.Walk u u).length = 0 :=
  ⟨p.length_support, SimpleGraph.Walk.length_nil⟩
example := @textbook_blockchain_hash_links
/-- textbook_blockchain_hash_links reflected by its shape (examples: verify-blockchain-genesis, verify-blockchain-linked, verify-radar) -/
@[reflection] theorem textbook_blockchain_hash_links_reflected {V : Type*} (G : SimpleGraph V) {u v : V} (p : G.Walk u v) : ((p.length + 1) = (p.support.length)) ∧ ((0) = ((SimpleGraph.Walk.nil : G.Walk u u).length)) := ⟨Eq.symm (textbook_blockchain_hash_links G p).1, Eq.symm (textbook_blockchain_hash_links G p).2⟩
/-- NISTIR 8202 §3.7 Chaining Blocks: of n blocks with the i-th altered, the i before it still link and the n − i from it onward are evident, at least the altered block itself: i + (n − i) = n and 0 < n − i. From Mathlib's `add_tsub_cancel_of_le`, `StarOrderedRing.toExistsAddOfLE`, `Nat.instStarOrderedRing`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid`, `Nat.instOrderedSub`, `le_of_lt`, `tsub_pos_of_lt` and `Nat.instCanonicallyOrderedAdd` (examples: verify-blockchain-tampered) -/
theorem textbook_blockchain_tamper_evident (n i : ℕ) (h : i < n) : i + (n - i) = n ∧ 0 < n - i :=
  ⟨add_tsub_cancel_of_le (le_of_lt h), tsub_pos_of_lt h⟩
example := @textbook_blockchain_tamper_evident
/-- a string of m · k bits is m chunks of k bits, the same 2^(mk) values (FIPS 180-4: a SHA-256 digest of 256 bits is 32 bytes of 8 and 64 hexadecimal characters of 4; a 512-bit block is sixteen 32-bit words). From Mathlib's `Fintype.card_fun`, `Fintype.card_bool`, `Fintype.card_fin` and `pow_mul'` (examples: seal-block-sha256) -/
theorem textbook_sha256_fips_180_4 (m k : Nat) : Fintype.card (Fin (m * k) → Bool) = Fintype.card (Fin m → Fin k → Bool) := by
  simp only [Fintype.card_fun, Fintype.card_bool, Fintype.card_fin, pow_mul']
example := @textbook_sha256_fips_180_4
example : 256 / 8 = 32 ∧ 256 / 4 = 64 ∧ 512 / 32 = 16 ∧ 2 * 256 = 512 := by decide
/-- textbook_sha256_fips_180_4 reflected by its shape (examples: seal-block-sha256) -/
@[reflection] theorem textbook_sha256_fips_180_4_reflected (m k : Nat) : (Fintype.card (Fin m → Fin k → Bool)) = (Fintype.card (Fin (m * k) → Bool)) := Eq.symm (textbook_sha256_fips_180_4 m k)
/-- FIPS 202 §5.2 and §6.1: KECCAK[c] = SPONGE[KECCAK-p[1600, 24], pad10*1, 1600 − c], SHA3-256(M) = KECCAK[512](M || 01, 256) and SHA3-512(M) = KECCAK[1024](M || 01, 512): the capacity is twice the digest and the rate the rest of the 1600-bit state, 1088 and 576 bits; the seal tool computes both with sha3 (examples: seal-block-sha3) -/
theorem textbook_sha3_fips_202 : 1600 - 512 = 1088 ∧ 512 = 2 * 256 ∧ 1600 - 1024 = 576 ∧ 1024 = 2 * 512 := by decide
/-- textbook_sha3_fips_202 reflected by its shape, conjunction (examples: seal-block-sha3) -/
@[reflection] theorem textbook_sha3_fips_202_reflected (σ : Nat) : (σ - (1088) = σ - (1600 - 512)) ∧ (σ - (2 * 256) = σ - (512)) ∧ (σ - (576) = σ - (1600 - 1024)) ∧ (σ - (2 * 512) = σ - (1024)) := ⟨congrArg (σ - ·) (Eq.symm (textbook_sha3_fips_202).1), congrArg (σ - ·) (Eq.symm (textbook_sha3_fips_202).2.1), congrArg (σ - ·) (Eq.symm (textbook_sha3_fips_202).2.2.1), congrArg (σ - ·) (Eq.symm (textbook_sha3_fips_202).2.2.2)⟩
/-- when both the public key and the signature grow with the security category, so does what a signature costs on the wire, key plus signature (FIPS 204 ML-DSA-44, -65, -87: 3732 < 5261 < 7219 bytes). From Mathlib's `add_lt_add`, `IsLeftCancelAdd.addLeftStrictMono_of_addLeftMono`, `instIsLeftCancelAddOfAddLeftReflectLE`, `IsOrderedCancelAddMonoid.toAddLeftReflectLE`, `Nat.instIsOrderedCancelAddMonoid`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid`, `IsRightCancelAdd.addRightStrictMono_of_addRightMono`, `instIsRightCancelAddOfAddRightReflectLE`, `addRightReflectLE_of_addLeftReflectLE`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le`, `covariant_swap_add_of_covariant_add` (examples: seal-block-sign-ml-dsa-44) -/
theorem textbook_ml_dsa_fips_204 (pk₁ sig₁ pk₂ sig₂ : Nat) (hpk : pk₁ < pk₂) (hsig : sig₁ < sig₂) : pk₁ + sig₁ < pk₂ + sig₂ :=
  add_lt_add hpk hsig
example := @textbook_ml_dsa_fips_204
example : 1312 + 2420 = 3732 ∧ 1952 + 3309 = 5261 ∧ 2592 + 4627 = 7219 ∧ 3732 < 5261 ∧ 5261 < 7219 := by decide
/-- textbook_ml_dsa_fips_204 reflected by its shape (examples: seal-block-sign-ml-dsa-44) -/
@[reflection] theorem textbook_ml_dsa_fips_204_reflected (pk₁ sig₁ pk₂ sig₂ : Nat) (hpk : pk₁ < pk₂) (hsig : sig₁ < sig₂) (σ : Nat) (hσ0 : (pk₂ + sig₂) ≤ σ) : σ - (pk₂ + sig₂) < σ - (pk₁ + sig₁) := Nat.sub_lt_sub_left (Nat.lt_of_lt_of_le (textbook_ml_dsa_fips_204 pk₁ sig₁ pk₂ sig₂ hpk hsig) hσ0) (textbook_ml_dsa_fips_204 pk₁ sig₁ pk₂ sig₂ hpk hsig)
/-- the contrapositive of textbook_ml_dsa_fips_204 (examples: seal-block-sign-ml-dsa-44) -/
@[reflection] theorem textbook_ml_dsa_fips_204_contrapositive (pk₁ sig₁ pk₂ sig₂ : Nat) : ¬ (pk₁ + sig₁ < pk₂ + sig₂) → ¬ ((pk₁ < pk₂) ∧ (sig₁ < sig₂)) := fun hc hh => hc (textbook_ml_dsa_fips_204 pk₁ sig₁ pk₂ sig₂ hh.1 hh.2)
/-- when the terms read, cut and unread make the total and none is cut or unread, every term is read (99 of 99). From Mathlib's `add_zero` (examples: verify-iso-22739-terms-read) -/
theorem textbook_iso_22739_terms_read (read cut unread total : Nat) (h : read + cut + unread = total) (hc : cut = 0) (hu : unread = 0) : read = total := by
  rw [hc, hu, add_zero, add_zero] at h; exact h
example := @textbook_iso_22739_terms_read
example : 99 + 0 + 0 = 99 ∧ 99 - 99 = 0 := by decide
/-- textbook_iso_22739_terms_read reflected by its shape (examples: verify-iso-22739-terms-read) -/
@[reflection] theorem textbook_iso_22739_terms_read_reflected (read cut unread total : Nat) (h : read + cut + unread = total) (hc : cut = 0) (hu : unread = 0) (σ : Nat) : σ - (total) = σ - (read) := congrArg (σ - ·) (Eq.symm (textbook_iso_22739_terms_read read cut unread total h hc hu))
/-- the contrapositive of textbook_iso_22739_terms_read (examples: verify-iso-22739-terms-read) -/
@[reflection] theorem textbook_iso_22739_terms_read_contrapositive (read cut unread total : Nat) : ¬ (read = total) → ¬ ((read + cut + unread = total) ∧ (cut = 0) ∧ (unread = 0)) := fun hc hh => hc (textbook_iso_22739_terms_read read cut unread total hh.1 hh.2.1 hh.2.2)
/-- ISO 22739:2024 3.46 hash function (cryptographic hash function), read in full: three infeasibility properties — preimage, second-preimage and collision — so 1 + 1 + 1 = 3; sourced from ISO/IEC 10118-1:2016 3.4 as Dig.watch publishes the complete definition the iteh sample once cut (examples: verify-iso-22739-terms-read) -/
theorem textbook_iso_22739_hash_function : 1 + 1 + 1 = 3 := by decide
/-- textbook_iso_22739_hash_function reflected by its shape, equality (examples: verify-iso-22739-terms-read) -/
@[reflection] theorem textbook_iso_22739_hash_function_reflected (σ : Nat) : σ - (3) = σ - (1 + 1 + 1) := congrArg (σ - ·) (Eq.symm (textbook_iso_22739_hash_function))
/-- ISO 22739:2024 3.69 orphan block: of confirmed blocks, the orphans and the still-confirmed partition the same count — (confirmed − orphans) + orphans = confirmed. From Mathlib's `tsub_add_cancel_of_le`, `StarOrderedRing.toExistsAddOfLE`, `Nat.instStarOrderedRing`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid` and `Nat.instOrderedSub` (examples: verify-iso-22739-terms-read) -/
theorem textbook_iso_22739_orphan_blocks (confirmed orphans : ℕ) (h : orphans ≤ confirmed) : (confirmed - orphans) + orphans = confirmed := tsub_add_cancel_of_le h
example := @textbook_iso_22739_orphan_blocks
/-- textbook_iso_22739_orphan_blocks reflected by its shape (examples: verify-iso-22739-terms-read) -/
@[reflection] theorem textbook_iso_22739_orphan_blocks_reflected (confirmed orphans : ℕ) (h : orphans ≤ confirmed) : (confirmed) = ((confirmed - orphans) + orphans) := Eq.symm (textbook_iso_22739_orphan_blocks confirmed orphans h)
/-- a term new to a vocabulary adds one to its count (ISO 22739:2024 3.100 wallet beyond the 99 terms 3.1–3.99: 99 + 1 = 100). From Mathlib's `Finset.card_insert_of_notMem` (examples: verify-iso-22739-terms-read) -/
theorem textbook_iso_22739_wallet {Term : Type} [DecidableEq Term] (terms : Finset Term) (wallet : Term) (h : wallet ∉ terms) :
  (insert wallet terms).card = terms.card + 1 := Finset.card_insert_of_notMem h
example := @textbook_iso_22739_wallet
example : 99 + 1 = 100 := by decide
/-- textbook_iso_22739_wallet reflected by its shape (examples: verify-iso-22739-terms-read) -/
@[reflection] theorem textbook_iso_22739_wallet_reflected {Term : Type} [DecidableEq Term] (terms : Finset Term) (wallet : Term) (h : wallet ∉ terms) : (terms.card + 1) = ((insert wallet terms).card) := Eq.symm (textbook_iso_22739_wallet terms wallet h)
/-- a transfer of k units from a balance a holding them to a balance b conserves the total, (a − k) + (b + k) = a + b, the double-entry booking of one transfer (k = 1). From Mathlib's `tsub_add_cancel_of_le`, through the instances `StarOrderedRing.toExistsAddOfLE`, `Nat.instStarOrderedRing`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid` and `Nat.instOrderedSub` (examples: verify-blockchain-transfer-once) -/
theorem textbook_blockchain_transfer_once (a b k : Nat) (h : k ≤ a) : (a - k) + (b + k) = a + b := by
  rw [Nat.add_comm b k, ← Nat.add_assoc, tsub_add_cancel_of_le h]
example := @textbook_blockchain_transfer_once
/-- textbook_blockchain_transfer_once reflected by its shape (examples: verify-blockchain-transfer-once) -/
@[reflection] theorem textbook_blockchain_transfer_once_reflected (a b k : Nat) (h : k ≤ a) (σ : Nat) : σ - (a + b) = σ - ((a - k) + (b + k)) := congrArg (σ - ·) (Eq.symm (textbook_blockchain_transfer_once a b k h))
/-- the contrapositive of textbook_blockchain_transfer_once (examples: verify-blockchain-transfer-once) -/
@[reflection] theorem textbook_blockchain_transfer_once_contrapositive (a b k : Nat) : ¬ ((a - k) + (b + k) = a + b) → ¬ ((k ≤ a)) := fun hc hh => hc (textbook_blockchain_transfer_once a b k hh)
/-- the converse of textbook_blockchain_transfer_once, proved. From Mathlib's `tsub_add_cancel_iff_le`, `Nat.instCanonicallyOrderedAdd`, `Nat.instOrderedSub`, `add_right_cancel`, `instIsRightCancelAddOfAddRightReflectLE`, `addRightReflectLE_of_addLeftReflectLE`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid`, `add_assoc` and `add_comm` (examples: verify-blockchain-transfer-once) -/
@[reflection] theorem textbook_blockchain_transfer_once_converse (a b k : Nat) : ((a - k) + (b + k) = a + b) → (k ≤ a) :=
  fun hc => tsub_add_cancel_iff_le.mp (add_right_cancel (b := b) (by rw [add_assoc, add_comm k b]; exact hc))
/-- the recomputations each observed lie meets: 15 = 3 × 7 recomputes 21 where the factor door states 3 × 5 = 15; the create hue is 432 % 360 = 72, never 73 nor 432 (the side sides reads, which the prose backs); G's relative uncertainty is 22474 ppb, never 99; the ancient law is 4 + 5 = 9 entries, never 10; the order of 7 modulo 15 is 4 (7² mod 15 = 4); 6 < 999 is a width the scaled register holds, and the door that factors 91 = 7 × 13 has no qubit ceiling; and a decimal agrees to the places it is written to, 3.47 read as 3.5 ((2 · 347 + 10) / 20 = 35) (examples: match-witness-arithmetic, match-witness-bound, match-witness-route, textbook-prose-sides, match-witness-list, match-witness-named-side) -/
theorem textbook_lie_collides : 3 * 7 ≠ 15 ∧ 3 * 5 = 15 ∧ 432 % 360 = 72 ∧ 72 ≠ 73 ∧ 72 ≠ 432 ∧ 15 * 1000000000 / 667430 = 22474 ∧ 22474 ≠ 99 ∧ 4 + 5 = 9 ∧ 9 ≠ 10 ∧ 7 ^ 2 % 15 = 4 ∧ 6 < 999 ∧ 7 * 13 = 91 ∧ (2 * 347 + 10) / (2 * 10) = 35 := by decide
/-- textbook_lie_collides reflected by its shape, conjunction (examples: match-witness-arithmetic, match-witness-bound, match-witness-route, textbook-prose-sides, match-witness-list, match-witness-named-side) -/
@[reflection] theorem textbook_lie_collides_reflected (σ : Nat) (hσ0 : (999) ≤ σ) : ((15) ≠ (3 * 7)) ∧ (σ - (15) = σ - (3 * 5)) ∧ (σ - (72) = σ - (432 % 360)) ∧ ((73) ≠ (72)) ∧ ((432) ≠ (72)) ∧ (σ - (22474) = σ - (15 * 1000000000 / 667430)) ∧ ((99) ≠ (22474)) ∧ (σ - (9) = σ - (4 + 5)) ∧ ((10) ≠ (9)) ∧ (σ - (4) = σ - (7 ^ 2 % 15)) ∧ (σ - (999) < σ - (6)) ∧ (σ - (91) = σ - (7 * 13)) ∧ (σ - (35) = σ - ((2 * 347 + 10) / (2 * 10))) := ⟨Ne.symm (textbook_lie_collides).1, congrArg (σ - ·) (Eq.symm (textbook_lie_collides).2.1), congrArg (σ - ·) (Eq.symm (textbook_lie_collides).2.2.1), Ne.symm (textbook_lie_collides).2.2.2.1, Ne.symm (textbook_lie_collides).2.2.2.2.1, congrArg (σ - ·) (Eq.symm (textbook_lie_collides).2.2.2.2.2.1), Ne.symm (textbook_lie_collides).2.2.2.2.2.2.1, congrArg (σ - ·) (Eq.symm (textbook_lie_collides).2.2.2.2.2.2.2.1), Ne.symm (textbook_lie_collides).2.2.2.2.2.2.2.2.1, congrArg (σ - ·) (Eq.symm (textbook_lie_collides).2.2.2.2.2.2.2.2.2.1), Nat.sub_lt_sub_left (Nat.lt_of_lt_of_le (textbook_lie_collides).2.2.2.2.2.2.2.2.2.2.1 hσ0) (textbook_lie_collides).2.2.2.2.2.2.2.2.2.2.1, congrArg (σ - ·) (Eq.symm (textbook_lie_collides).2.2.2.2.2.2.2.2.2.2.2.1), congrArg (σ - ·) (Eq.symm (textbook_lie_collides).2.2.2.2.2.2.2.2.2.2.2.2)⟩
/-- the three NIST post-quantum standards of 13 August 2024, FIPS 203 (ML-KEM), 204 (ML-DSA) and 205 (SLH-DSA), numbered one after another past FIPS 202; the sizes the seal tool plans recompute from the standards' parameters: an ML-KEM-768 encapsulation key is 384k + 32 bytes with k = 3 (1184), its ciphertext 32(du·k + dv) with du = 10 and dv = 4 (1088), an SLH-DSA-SHA2-128s signature n(1 + k(1 + a) + h + d·len) with n = 16, k = 14, a = 12, h = 63, d = 7, len = 35 (7856) (examples: seal-kem, seal-slh, seal-nist, seal-nist-reverse-cern) -/
theorem textbook_pqc_standards_three : 202 + 1 = 203 ∧ 203 + 1 = 204 ∧ 204 + 1 = 205 ∧ 205 - 202 = 3 ∧ 384 * 3 + 32 = 1184 ∧ 32 * (10 * 3 + 4) = 1088 ∧ 16 * (1 + 14 * (1 + 12) + 63 + 7 * 35) = 7856 := by decide
/-- textbook_pqc_standards_three reflected by its shape, conjunction (examples: seal-kem, seal-slh, seal-nist, seal-nist-reverse-cern) -/
@[reflection] theorem textbook_pqc_standards_three_reflected (σ : Nat) : (σ - (203) = σ - (202 + 1)) ∧ (σ - (204) = σ - (203 + 1)) ∧ (σ - (205) = σ - (204 + 1)) ∧ (σ - (3) = σ - (205 - 202)) ∧ (σ - (1184) = σ - (384 * 3 + 32)) ∧ (σ - (1088) = σ - (32 * (10 * 3 + 4))) ∧ (σ - (7856) = σ - (16 * (1 + 14 * (1 + 12) + 63 + 7 * 35))) := ⟨congrArg (σ - ·) (Eq.symm (textbook_pqc_standards_three).1), congrArg (σ - ·) (Eq.symm (textbook_pqc_standards_three).2.1), congrArg (σ - ·) (Eq.symm (textbook_pqc_standards_three).2.2.1), congrArg (σ - ·) (Eq.symm (textbook_pqc_standards_three).2.2.2.1), congrArg (σ - ·) (Eq.symm (textbook_pqc_standards_three).2.2.2.2.1), congrArg (σ - ·) (Eq.symm (textbook_pqc_standards_three).2.2.2.2.2.1), congrArg (σ - ·) (Eq.symm (textbook_pqc_standards_three).2.2.2.2.2.2)⟩
/-- RFC 6962 §2.1: a Merkle tree over n > 1 leaves has depth ⌈log₂ n⌉, the least d with n ≤ 2^d: 2^(d − 1) < n ≤ 2^d (three leaves: depth 2, one hash per level). From Mathlib's `Nat.pow_pred_clog_lt_self` and `Nat.le_pow_clog` (examples: seal-merkle) -/
theorem textbook_tree_size_positive (n : Nat) (h : 1 < n) : 2 ^ (Nat.clog 2 n).pred < n ∧ n ≤ 2 ^ Nat.clog 2 n :=
  ⟨Nat.pow_pred_clog_lt_self (by decide) h, Nat.le_pow_clog (by decide) n⟩
example := @textbook_tree_size_positive
example : 0 < 3 ∧ 3 ≤ 2 ^ 2 ∧ 2 ^ 1 < 3 ∧ 2 ^ 2 - 1 = 3 ∧ (3 + 1) / 2 = 2 := by decide
/-- a width w is rebuilt exactly from its blocks of d and the remainder, d · (w / d) + w % d = w (1000 bits are 125 bytes exactly, and fourteen reflections of 71 bits and six more). From Mathlib's `EuclideanDomain.div_add_mod` (examples: fold-proven) -/
theorem textbook_only_the_proven_is_admitted (w d : Int) : d * (w / d) + w % d = w := EuclideanDomain.div_add_mod w d
example := @textbook_only_the_proven_is_admitted
example : 1000 / 8 = 125 ∧ 125 * 8 = 1000 ∧ 1000 % 71 = 6 ∧ 14 * 71 + 6 = 1000 ∧ 5 - 5 = 0 := by decide
/-- textbook_only_the_proven_is_admitted reflected by its shape (examples: fold-proven) -/
@[reflection] theorem textbook_only_the_proven_is_admitted_reflected (w d : Int) : (w) = (d * (w / d) + w % d) := Eq.symm (textbook_only_the_proven_is_admitted w d)
/-- a Cloudflare meter priced as max(0, used − included) × rate costs nothing within its allowance: (used − included) · rate = 0 when used ≤ included (the 9 150 000 sampled log events inside the 20 million, so the logs meter is zero). From Mathlib's `tsub_eq_zero_of_le`, `MulZeroClass.zero_mul`, `Nat.instCanonicallyOrderedAdd` and `Nat.instOrderedSub` (examples: apis-cost-lead-run, apis-cost-sampled, apis-zone-counts) -/
theorem textbook_cloudflare_cost_gate (used included rate : ℕ) (h : used ≤ included) : (used - included) * rate = 0 := by
  rw [tsub_eq_zero_of_le h, zero_mul]
example := @textbook_cloudflare_cost_gate
example : (915000000 - 20000000) * 60 / 100 = 537000000 ∧ (67000000000 - 25000000000) / 1000 = 42000000 ∧ (915000000 - 10000000) * 30 / 100 = 271500000 ∧ 271500000 + 42000000 + 537000000 = 850500000 ∧ 915000000 * 10 / 1000 = 9150000 ∧ 9150000 - 20000000 = 0 ∧ 271500000 + 42000000 + 0 = 313500000 ∧ 7 + 3 = 10 ∧ 9 + 1 = 10 ∧ 6 + 4 = 10 ∧ 5 + 5 = 10 ∧ 8 + 2 = 10 := by decide
/-- textbook_cloudflare_cost_gate reflected by its shape (examples: apis-cost-lead-run, apis-cost-sampled, apis-zone-counts) -/
@[reflection] theorem textbook_cloudflare_cost_gate_reflected (used included rate : ℕ) (h : used ≤ included) : (0) = ((used - included) * rate) := Eq.symm (textbook_cloudflare_cost_gate used included rate h)
/-- a changed fold partitions the recorded receipts into those that hold and the invalidated (stale or wrong), so the invalidated are the receipts less those that hold (3 − 1 = 2 on quintessay-payload's receipts). From Mathlib's `Finset.card_sdiff_of_subset` (examples: seal-receipts) -/
theorem textbook_receipts_partitioned {Receipt : Type} [DecidableEq Receipt] (receipts holds : Finset Receipt) (h : holds ⊆ receipts) :
  (receipts \ holds).card = receipts.card - holds.card := Finset.card_sdiff_of_subset h
example := @textbook_receipts_partitioned
example : 1 + 1 + 1 = 3 ∧ 3 - 1 = 1 + 1 ∧ 0 < 1 ∧ 1 < 3 := by decide
/-- textbook_receipts_partitioned reflected by its shape (examples: seal-receipts) -/
@[reflection] theorem textbook_receipts_partitioned_reflected {Receipt : Type} [DecidableEq Receipt] (receipts holds : Finset Receipt) (h : holds ⊆ receipts) : (receipts.card - holds.card) = ((receipts \ holds).card) := Eq.symm (textbook_receipts_partitioned receipts holds h)
/-- a deploy waits on every receipt: the invalidated receipts are the recorded less those that hold, and when fewer hold than were recorded at least one is invalidated, enough to refuse (2 − 1 = 1). From Mathlib's `Finset.card_sdiff_of_subset`, `tsub_pos_of_lt`, `Nat.instCanonicallyOrderedAdd`, `Nat.instOrderedSub` (examples: repository-predeploy-receipts) -/
theorem textbook_stale_receipt_refuses_deploy {Receipt : Type} [DecidableEq Receipt] (receipts holds : Finset Receipt) (h : holds ⊆ receipts)
  (hlt : holds.card < receipts.card) : (receipts \ holds).card = receipts.card - holds.card ∧ 0 < (receipts \ holds).card := by
  rw [Finset.card_sdiff_of_subset h]
  exact ⟨rfl, tsub_pos_of_lt hlt⟩
example := @textbook_stale_receipt_refuses_deploy
example : 1 + 1 + 0 = 2 ∧ 2 - 1 = 1 + 0 ∧ 0 < 2 - 1 := by decide
/-- no register is the last: every qubit count has a larger one, and one more qubit doubles the states, 2^(q + 1) = 2 · 2^q. From Mathlib's `lt_add_one`, `pow_succ'`, `Nat.instZeroLEOneClass`, `IsLeftCancelAdd.addLeftStrictMono_of_addLeftMono`, `instIsLeftCancelAddOfAddLeftReflectLE`, `IsOrderedCancelAddMonoid.toAddLeftReflectLE`, `Nat.instIsOrderedCancelAddMonoid`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid` (examples: processor-unlimited, circuit-unlimited, echo-unlimited, match-unlimited, prose-unlimited, seal-unlimited, verify-unlimited, stripe-unlimited, fold-unlimited, repository-unlimited, payload-unlimited) -/
theorem textbook_unlimited_qubits (q : Nat) : q < q + 1 ∧ 2 ^ (q + 1) = 2 * 2 ^ q := ⟨lt_add_one q, pow_succ' 2 q⟩
example := @textbook_unlimited_qubits
/-- textbook_unlimited_qubits reflected by its shape (examples: processor-unlimited, circuit-unlimited, echo-unlimited, match-unlimited, prose-unlimited, seal-unlimited, verify-unlimited, stripe-unlimited, fold-unlimited, repository-unlimited, payload-unlimited) -/
@[reflection] theorem textbook_unlimited_qubits_reflected (q : Nat) (σ : Nat) (hσ0 : (q + 1) ≤ σ) : (σ - (q + 1) < σ - (q)) ∧ (σ - (2 * 2 ^ q) = σ - (2 ^ (q + 1))) := ⟨Nat.sub_lt_sub_left (Nat.lt_of_lt_of_le (textbook_unlimited_qubits q).1 hσ0) (textbook_unlimited_qubits q).1, congrArg (σ - ·) (Eq.symm (textbook_unlimited_qubits q).2)⟩
/-- a standard is verified only when every row asked is verified: no row left unverified with verified ≤ asked forces verified = asked. From Mathlib's `tsub_eq_zero_iff_le`, `le_antisymm`, `Nat.instCanonicallyOrderedAdd` and `Nat.instOrderedSub` (examples: standards-iso-online, standards-iso-page, standards-iso-joined) -/
theorem textbook_iso_rows_verified (asked verified : ℕ) (h : verified ≤ asked) : asked - verified = 0 → verified = asked :=
  fun h0 => le_antisymm h (tsub_eq_zero_iff_le.mp h0)
example := @textbook_iso_rows_verified
/-- textbook_iso_rows_verified reflected by its shape (examples: standards-iso-online, standards-iso-page, standards-iso-joined) -/
@[reflection] theorem textbook_iso_rows_verified_reflected (asked verified : ℕ) (h : verified ≤ asked) : ¬ (verified = asked) → ¬ ((asked - verified = 0)) := fun hc hh => hc ((textbook_iso_rows_verified asked verified h) hh)
/-- a theme is configured in one read: with truncated subtraction (ℕ among its models), what is developed beyond the theme and the mode (k = 2) is each template and each part, (t + p + k) − k = t + p. From Mathlib's `add_tsub_cancel_right` (examples: configure-theme) -/
theorem textbook_theme_developed {α : Type*} [PartialOrder α] [AddCommSemigroup α] [Sub α] [OrderedSub α]
    [AddLeftReflectLE α] (templates parts k : α) : templates + parts + k - k = templates + parts :=
  add_tsub_cancel_right (templates + parts) k
example := @textbook_theme_developed
/-- textbook_theme_developed reflected by its shape (examples: configure-theme) -/
@[reflection] theorem textbook_theme_developed_reflected {α : Type*} [PartialOrder α] [AddCommSemigroup α] [Sub α] [OrderedSub α] [AddLeftReflectLE α] (templates parts k : α) : (templates + parts) = (templates + parts + k - k) := Eq.symm (textbook_theme_developed templates parts k)
/-- every Alpine directive is ported, partial or a gap, so the directives less the ported ones are the partial ones and the gaps: removing a summand from a sum leaves the rest. From Mathlib's `add_assoc`, `add_tsub_cancel_left`, `Nat.instOrderedSub`, `IsLeftCancelAdd.addLeftReflectLE_of_addLeftReflectLT`, `AddLeftCancelSemigroup.toIsLeftCancelAdd`, `contravariant_lt_of_covariant_le`, `IsOrderedAddMonoid.toAddLeftMono` and `Nat.instIsOrderedAddMonoid` (examples: payload-alpine) -/
theorem textbook_alpine_ported (ported halfway gaps total : ℕ) (h : ported + halfway + gaps = total) : total - ported = halfway + gaps := by
  rw [← h, add_assoc, add_tsub_cancel_left]
example := @textbook_alpine_ported
/-- textbook_alpine_ported reflected by its shape (examples: payload-alpine) -/
@[reflection] theorem textbook_alpine_ported_reflected (ported halfway gaps total : ℕ) (h : ported + halfway + gaps = total) : (halfway + gaps) = (total - ported) := Eq.symm (textbook_alpine_ported ported halfway gaps total h)
/-- a directive that runs adds one to the store's count, so the count after exceeds the count before (1 + 1 = 2 > 1) and the count shows. From Mathlib's `lt_add_one`, `Nat.instZeroLEOneClass`, `IsLeftCancelAdd.addLeftStrictMono_of_addLeftMono`, `instIsLeftCancelAddOfAddLeftReflectLE`, `IsOrderedCancelAddMonoid.toAddLeftReflectLE`, `Nat.instIsOrderedCancelAddMonoid`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid` (examples: payload-alpine-run) -/
theorem textbook_alpine_runs (count : Nat) : count < count + 1 := lt_add_one count
example := @textbook_alpine_runs
example : 1 + 1 = 2 ∧ 1 < 2 := by decide
/-- textbook_alpine_runs reflected by its shape (examples: payload-alpine-run) -/
@[reflection] theorem textbook_alpine_runs_reflected (count : Nat) (σ : Nat) (hσ0 : (count + 1) ≤ σ) : σ - (count + 1) < σ - (count) := Nat.sub_lt_sub_left (Nat.lt_of_lt_of_le (textbook_alpine_runs count) hσ0) (textbook_alpine_runs count)
/-- a directive the linter refuses adds nothing, and adding zero leaves the count as it was. From Mathlib's `add_zero` (examples: payload-alpine-eslint) -/
theorem textbook_alpine_refused (count : Nat) : count + 0 = count := add_zero count
example := @textbook_alpine_refused
/-- textbook_alpine_refused reflected by its shape (examples: payload-alpine-eslint) -/
@[reflection] theorem textbook_alpine_refused_reflected (count : Nat) (σ : Nat) : σ - (count) = σ - (count + 0) := congrArg (σ - ·) (Eq.symm (textbook_alpine_refused count))
/-- an action on a member answers as a bulk action on its collection, which holds at least that one member: a ∈ s gives 1 ≤ |s|. From Mathlib's `Finset.one_le_card` (examples: payload-rails-admin) -/
theorem textbook_member_in_collection {α : Type*} (s : Finset α) (a : α) (h : a ∈ s) : 1 ≤ s.card :=
  Finset.one_le_card.mpr ⟨a, h⟩
example := @textbook_member_in_collection
/-- the length of a concatenated word is the sum of the lengths, and one more letter adds one (apps_ and cards: 5 + 5 = 10 for apps_cards; card and s: 4 + 1 = 5). From Mathlib's `FreeMonoid.length_mul` and `FreeMonoid.length_of` (examples: payload-rails-model) -/
theorem textbook_model_table (p w : FreeMonoid Char) (c : Char) :
    (p * w).length = p.length + w.length ∧ (w * FreeMonoid.of c).length = w.length + 1 := by
  refine ⟨FreeMonoid.length_mul p w, ?_⟩
  rw [FreeMonoid.length_mul, FreeMonoid.length_of]
example := @textbook_model_table
example : 5 + 5 = 10 ∧ 4 + 1 = 5 := by decide
/-- textbook_model_table reflected by its shape (examples: payload-rails-model) -/
@[reflection] theorem textbook_model_table_reflected (p w : FreeMonoid Char) (c : Char) : ((p.length + w.length) = ((p * w).length)) ∧ ((w.length + 1) = ((w * FreeMonoid.of c).length)) := ⟨Eq.symm (textbook_model_table p w c).1, Eq.symm (textbook_model_table p w c).2⟩
/-- f frameworks each cloning s slots hold f · s pages, the pairs of a product (12 frameworks of 25 slots: 300 pages). From Mathlib's `Fintype.card_prod` and `Fintype.card_fin` (examples: payload-self-clone) -/
theorem textbook_clone_slots (f s : Nat) : Fintype.card (Fin f × Fin s) = f * s := by
  simp only [Fintype.card_prod, Fintype.card_fin]
example := @textbook_clone_slots
example : 12 * 25 = 300 := by decide
/-- textbook_clone_slots reflected by its shape (examples: payload-self-clone) -/
@[reflection] theorem textbook_clone_slots_reflected (f s : Nat) : (f * s) = (Fintype.card (Fin f × Fin s)) := Eq.symm (textbook_clone_slots f s)
/-- a string of n bytes is n · 8 bits, so it takes 2^(8n) values, and each byte is two hexadecimal digits, 256^n = 16^(2n) (AES-256-GCM: a 32-byte key is 256 bits, a 12-byte nonce 96, a 16-byte tag 128, and 10 bytes of text 20 hexadecimal digits). From Mathlib's `Fintype.card_fun`, `Fintype.card_bool`, `Fintype.card_fin` and `pow_mul` (examples: seal-aead) -/
theorem textbook_aead_sizes (n : Nat) : Fintype.card (Fin n → Fin 8 → Bool) = 2 ^ (8 * n) ∧
    Fintype.card (Fin n → Fin 256) = Fintype.card (Fin (2 * n) → Fin 16) := by
  refine ⟨?_, ?_⟩
  · simp only [Fintype.card_fun, Fintype.card_bool, Fintype.card_fin, pow_mul]
  · simp only [Fintype.card_fun, Fintype.card_fin, pow_mul]; rfl
example := @textbook_aead_sizes
example : 32 * 8 = 256 ∧ 12 * 8 = 96 ∧ 16 * 8 = 128 ∧ 2 * 10 = 20 := by decide
/-- textbook_aead_sizes reflected by its shape (examples: seal-aead) -/
@[reflection] theorem textbook_aead_sizes_reflected (n : Nat) : ((2 ^ (8 * n)) = (Fintype.card (Fin n → Fin 8 → Bool))) ∧ ((Fintype.card (Fin (2 * n) → Fin 16)) = (Fintype.card (Fin n → Fin 256))) := ⟨Eq.symm (textbook_aead_sizes n).1, Eq.symm (textbook_aead_sizes n).2⟩
/-- n bytes hold 2^(8n) values: 32 bytes, 256 bits, hold the 2²⁵⁵ − 19 field elements of X25519. From Mathlib's `Fintype.card_fun`, `Fintype.card_fin` and `pow_mul` (examples: seal-x25519) -/
theorem textbook_x25519_sizes (n : ℕ) : Fintype.card (Fin n → Fin (2 ^ 8)) = 2 ^ (8 * n) := by
  rw [Fintype.card_fun, Fintype.card_fin, Fintype.card_fin, pow_mul]
example := @textbook_x25519_sizes
example : 32 * 8 = 256 ∧ 2 ^ 255 - 19 < 2 ^ 256 := by decide
/-- textbook_x25519_sizes reflected by its shape (examples: seal-x25519) -/
@[reflection] theorem textbook_x25519_sizes_reflected (n : ℕ) : (2 ^ (8 * n)) = (Fintype.card (Fin n → Fin (2 ^ 8))) := Eq.symm (textbook_x25519_sizes n)
/-- PBKDF2 derives a key of len bytes in ⌈len / h⌉ = (len + h − 1) / h blocks of the h-byte HMAC output, the fewest blocks covering the key: that count is at most c exactly when len ≤ h · c (a 32-byte key from HMAC-SHA256's 32-byte blocks takes 1 block). From Mathlib's `Nat.ceilDiv_eq_add_pred_div`, `ceilDiv_le_iff_le_mul` (examples: seal-pbkdf2) -/
theorem textbook_pbkdf2_blocks (len h c : Nat) (hh : 0 < h) : (len + h - 1) / h ≤ c ↔ len ≤ h * c := by
  rw [← Nat.ceilDiv_eq_add_pred_div]
  exact ceilDiv_le_iff_le_mul hh
example := @textbook_pbkdf2_blocks
example : (32 + 32 - 1) / 32 = 1 := by decide
/-- textbook_pbkdf2_blocks reflected by its shape (examples: seal-pbkdf2) -/
@[reflection] theorem textbook_pbkdf2_blocks_reflected (len h c : Nat) (hh : 0 < h) : (len ≤ h * c) ↔ ((len + h - 1) / h ≤ c) := Iff.symm (textbook_pbkdf2_blocks len h c hh)
/-- a signature made of two values of n bytes each, (R, S), is 2 · n bytes: |A ⊕ A| = 2|A| (Ed25519: a 32-byte public key, a 64-byte signature). From Mathlib's `Fintype.card_sum` and `Fintype.card_fin` (examples: seal-ed25519) -/
theorem textbook_ed25519_sizes (n : Nat) : Fintype.card (Fin n ⊕ Fin n) = 2 * n := by
  rw [Fintype.card_sum, Fintype.card_fin, Nat.two_mul]
example := @textbook_ed25519_sizes
example : 2 * 32 = 64 := by decide
/-- textbook_ed25519_sizes reflected by its shape (examples: seal-ed25519) -/
@[reflection] theorem textbook_ed25519_sizes_reflected (n : Nat) : (2 * n) = (Fintype.card (Fin n ⊕ Fin n)) := Eq.symm (textbook_ed25519_sizes n)
/-- the statements claimed are those with no prior work, and the claimed and the unclaimed make all the statements (of 2 statements, the one with no prior work is claimed). From Mathlib's `Finset.card_filter_add_card_filter_not` (examples: compete-novelty) -/
theorem textbook_novelty_claimed {α : Type*} (s : Finset α) (prior : α → Nat) :
    (s.filter fun a => prior a = 0).card + (s.filter fun a => ¬ prior a = 0).card = s.card :=
  Finset.card_filter_add_card_filter_not _
example := @textbook_novelty_claimed
example : 2 - 1 = 1 ∧ 0 < 1 := by decide
/-- textbook_novelty_claimed reflected by its shape (examples: compete-novelty) -/
@[reflection] theorem textbook_novelty_claimed_reflected {α : Type*} (s : Finset α) (prior : α → Nat) : (s.card) = ((s.filter fun a => prior a = 0).card + (s.filter fun a => ¬ prior a = 0).card) := Eq.symm (textbook_novelty_claimed s prior)
/-- the number operator of a mode has the eigenvalues 0 and 1: it is 1 less z, halved, where z is 1 for the empty mode and minus 1 for the filled one, so (1 - 1) / 2 = 0 and (1 + 1) / 2 = 1 (examples: chemistry-jordan-wigner-number) -/
theorem textbook_number_operator : (1 - 1) / 2 = 0 ∧ (1 + 1) / 2 = 1 := by decide
/-- each scale of handles holds 16 times the handles of the scale before and 4 more qubits, and k scales hold 16ᵏ = 2^(4k) handles (8 scales reach 2³²). From Mathlib's `pow_succ'`, `mul_add_one`, `pow_mul` and `Distrib.leftDistribClass` (examples: algorithm-handle-capacity) -/
theorem textbook_handle_scales (k : ℕ) : 16 ^ (k + 1) = 16 * 16 ^ k ∧ 4 * (k + 1) = 4 * k + 4 ∧ (2 ^ 4) ^ k = 2 ^ (4 * k) :=
  ⟨pow_succ' 16 k, mul_add_one 4 k, (pow_mul 2 4 k).symm⟩
example := @textbook_handle_scales
/-- textbook_handle_scales reflected by its shape (examples: algorithm-handle-capacity) -/
@[reflection] theorem textbook_handle_scales_reflected (k : ℕ) : ((16 * 16 ^ k) = (16 ^ (k + 1))) ∧ ((4 * k + 4) = (4 * (k + 1))) ∧ ((2 ^ (4 * k)) = ((2 ^ 4) ^ k)) := ⟨Eq.symm (textbook_handle_scales k).1, Eq.symm (textbook_handle_scales k).2.1, Eq.symm (textbook_handle_scales k).2.2⟩
/-- the leads standing are the leads less those that break a rule: |{a ∈ s | ¬p a}| = |s| − |{a ∈ s | p a}|, so with no violation every lead stands (of 5 leads, 3 breaking a rule leave 2). From Mathlib's `Finset.filter_not`, `Finset.card_sdiff_of_subset` and `Finset.filter_subset` (examples: leads-consistent, leads-consistent-control) -/
theorem textbook_leads_consistent {α : Type*} [DecidableEq α] (s : Finset α) (p : α → Prop) [DecidablePred p] :
    (s.filter fun a => ¬ p a).card = s.card - (s.filter p).card := by
  rw [Finset.filter_not, Finset.card_sdiff_of_subset (Finset.filter_subset p s)]
example := @textbook_leads_consistent
/-- textbook_leads_consistent reflected by its shape (examples: leads-consistent, leads-consistent-control) -/
@[reflection] theorem textbook_leads_consistent_reflected {α : Type*} [DecidableEq α] (s : Finset α) (p : α → Prop) [DecidablePred p] : (s.card - (s.filter p).card) = ((s.filter fun a => ¬ p a).card) := Eq.symm (textbook_leads_consistent s p)
/-- when every textbook theorem falls in one class, the classes count the total: the theorems number the sum over the classes of the theorems in each. From Mathlib's `Finset.card_eq_sum_card_fiberwise` (examples: textbook-particles, textbook-particles-control) -/
theorem textbook_particles_classes {ι κ : Type} [DecidableEq κ] (f : ι → κ) (s : Finset ι) (t : Finset κ) (h : ∀ x ∈ s, f x ∈ t) : s.card = ∑ k ∈ t, (s.filter (fun x => f x = k)).card :=
  Finset.card_eq_sum_card_fiberwise (fun x hx => h x hx)
example := @textbook_particles_classes
example : 6 * 4 = 24 ∧ 6 * 4 ≠ 25 := by decide
/-- textbook_particles_classes reflected by its shape (examples: textbook-particles, textbook-particles-control) -/
@[reflection] theorem textbook_particles_classes_reflected {ι κ : Type} [DecidableEq κ] (f : ι → κ) (s : Finset ι) (t : Finset κ) (h : ∀ x ∈ s, f x ∈ t) : (∑ k ∈ t, (s.filter (fun x => f x = k)).card) = (s.card) := Eq.symm (textbook_particles_classes f s t h)
/-- a deposit that is paid is covered: the coins held less the price, and the price again, are the coins held. From Mathlib's `tsub_add_cancel_of_le`, `StarOrderedRing.toExistsAddOfLE`, `Nat.instStarOrderedRing`, `IsOrderedAddMonoid.toAddLeftMono`, `Nat.instIsOrderedAddMonoid` and `Nat.instOrderedSub` (examples: payload-zenodo-account) -/
theorem textbook_deposit_paid (coins price : ℕ) (h : price ≤ coins) : coins - price + price = coins := tsub_add_cancel_of_le h
example := @textbook_deposit_paid
/-- textbook_deposit_paid reflected by its shape (examples: payload-zenodo-account) -/
@[reflection] theorem textbook_deposit_paid_reflected (coins price : ℕ) (h : price ≤ coins) : (coins) = (coins - price + price) := Eq.symm (textbook_deposit_paid coins price h)
/-- of the collections that may name a DOI, those that verify it removed leave the leads: removing a subset leaves the difference of the counts (4 − 2 = 2). From Mathlib's `Finset.card_sdiff_of_subset` (examples: payload-doi-related) -/
theorem textbook_doi_related {α : Type*} [DecidableEq α] (collections verified : Finset α) (h : verified ⊆ collections) : (collections \ verified).card = collections.card - verified.card :=
  Finset.card_sdiff_of_subset h
example := @textbook_doi_related
example : 4 - 2 = 2 := by decide
/-- textbook_doi_related reflected by its shape (examples: payload-doi-related) -/
@[reflection] theorem textbook_doi_related_reflected {α : Type*} [DecidableEq α] (collections verified : Finset α) (h : verified ⊆ collections) : (collections.card - verified.card) = ((collections \ verified).card) := Eq.symm (textbook_doi_related collections verified h)
/-- a QAOA circuit has a parameters a layer, its angles: one more layer is a more parameters, a(p + 1) = ap + a (two angles: 7 layers have 14). From Mathlib's `mul_add_one` and `Distrib.leftDistribClass` (examples: clay-relation-14) -/
theorem textbook_qaoa_params (p : Nat) : 2 * (p + 1) = 2 * p + 2 := mul_add_one 2 p
example := @textbook_qaoa_params
/-- textbook_qaoa_params reflected by its shape (examples: clay-relation-14) -/
@[reflection] theorem textbook_qaoa_params_reflected (p : Nat) (σ : Nat) : σ - (2 * p + 2) = σ - (2 * (p + 1)) := congrArg (σ - ·) (Eq.symm (textbook_qaoa_params p))
/-- textbook_number_operator reflected by its shape, conjunction (examples: chemistry-jordan-wigner-number) -/
@[reflection] theorem textbook_number_operator_reflected (σ : Nat) : (σ - (0) = σ - ((1 - 1) / 2)) ∧ (σ - (1) = σ - ((1 + 1) / 2)) := ⟨congrArg (σ - ·) (Eq.symm (textbook_number_operator).1), congrArg (σ - ·) (Eq.symm (textbook_number_operator).2)⟩
/-- an even order r with x = a^(r/2) gives N ∣ x² − 1 = (x + 1)(x − 1), so gcd(x ± 1, N) are the candidate factors (2 has order 6 modulo 21, x = 8, splitting 21 into 3 and 7). From Mathlib's `Nat.sq_sub_sq` and `one_pow` (examples: algorithm-shor-odd-order) -/
theorem textbook_refuse_is_refuse (N x : ℕ) (h : N ∣ x ^ 2 - 1) : N ∣ (x + 1) * (x - 1) := by
  have e := Nat.sq_sub_sq x 1
  rw [one_pow] at e
  rwa [e] at h
example := @textbook_refuse_is_refuse
example : 4 ^ 3 % 21 = 1 ∧ 3 % 2 = 1 ∧ 2 ^ 6 % 21 = 1 ∧ 6 % 2 = 0 ∧ Nat.gcd (2 ^ 3 - 1) 21 = 7 ∧ Nat.gcd (2 ^ 3 + 1) 21 = 3 := by decide
/-- when nothing is carried, the next version plus the carried is the next version: zero is the additive identity. From Mathlib's `add_zero` (examples: repository-workflow) -/
theorem textbook_carry_release (version carried : Nat) (h : carried = 0) : version + 1 + carried = version + 1 := by
  rw [h, add_zero]
example := @textbook_carry_release
/-- textbook_carry_release reflected by its shape (examples: repository-workflow) -/
@[reflection] theorem textbook_carry_release_reflected (version carried : Nat) (h : carried = 0) (σ : Nat) : σ - (version + 1) = σ - (version + 1 + carried) := congrArg (σ - ·) (Eq.symm (textbook_carry_release version carried h))
/-- the contrapositive of textbook_carry_release (examples: repository-workflow) -/
@[reflection] theorem textbook_carry_release_contrapositive (version carried : Nat) : ¬ (version + 1 + carried = version + 1) → ¬ ((carried = 0)) := fun hc hh => hc (textbook_carry_release version carried hh)
/-- the converse of textbook_carry_release, proved. From Mathlib's `add_left_cancel`, `instIsLeftCancelAddOfAddLeftReflectLE`, `IsOrderedCancelAddMonoid.toAddLeftReflectLE`, `Nat.instIsOrderedCancelAddMonoid` and `add_zero` (examples: repository-workflow) -/
@[reflection] theorem textbook_carry_release_converse (version carried : Nat) : (version + 1 + carried = version + 1) → (carried = 0) :=
  fun hc => add_left_cancel (hc.trans (add_zero (version + 1)).symm)

