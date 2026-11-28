import Mathlib.Data.Fintype.BigOperators

/-
  Qpu.Verify.Uuid — 128-bit handle banding: 6 fixed protocol bits,
  122 free bits split into a 16-bit program band and a 106-bit message band.
-/
namespace Qpu.Verify.Uuid

/-- Total handle width. -/
def totalBits : Nat := 128
/-- Protocol-fixed bits (version + variant). -/
def fixedBits : Nat := 6
/-- Program band width. -/
def programBits : Nat := 16
/-- Message band width. -/
def messageBits : Nat := 106

/-- The handle carries 122 bits of free entropy. -/
theorem free_is_122 : totalBits - fixedBits = 122 := by decide

/-- The program and message bands exactly cover the free bits — no overlap,
    no slack. -/
theorem bands_cover_the_free_bits : programBits + messageBits = totalBits - fixedBits := by decide

/-- Program band capacity: 16 bits address 65 536 program slots. -/
theorem program_capacity : 2 ^ programBits = 65536 := by decide

/-- Slot encoding: program in the high free bits, message in the low. -/
def encode (program message : Nat) : Nat := program * 2 ^ messageBits + message

/-- Splitting an encoded slot back out. -/
def decode (slot : Nat) : Nat × Nat := (slot / 2 ^ messageBits, slot % 2 ^ messageBits)

/-- A slot round-trips: decode ∘ encode is the identity on small inputs. -/
theorem slot_round_trips : decode (encode 3 7) = (3, 7) := by decide
/-- The round trip also holds at the program band's upper edge. -/
theorem slot_round_trips_max_program : decode (encode 65535 42) = (65535, 42) := by decide

/-- Control: distinct programs never collide at the handle layer. -/
theorem distinct_slots_distinct_handles : encode 1 0 ≠ encode 2 0 := by decide

/-- Universal 122-qubit band round-trip: for every program slot and every 106-bit message below `2 ^ messageBits`,
`decode (encode p m) = (p, m)`. Proved via `Nat.two_pow_pos`, `Nat.mul_comm`, `Nat.mul_add_div`, `Nat.div_eq_of_lt`,
`Nat.add_zero`, `Nat.mul_add_mod` and `Nat.mod_eq_of_lt`. -/
theorem decode_encode_exact (p m : Nat) (hm : m < 2 ^ messageBits) :
    decode (encode p m) = (p, m) := by
  unfold decode encode
  have hpos : 0 < 2 ^ messageBits := Nat.two_pow_pos messageBits
  have hdiv : (p * 2 ^ messageBits + m) / 2 ^ messageBits = p := by
    rw [Nat.mul_comm p (2 ^ messageBits), Nat.mul_add_div hpos, Nat.div_eq_of_lt hm, Nat.add_zero]
  have hmod : (p * 2 ^ messageBits + m) % 2 ^ messageBits = m := by
    rw [Nat.mul_comm p (2 ^ messageBits), Nat.mul_add_mod, Nat.mod_eq_of_lt hm]
  rw [hdiv, hmod]

/-- Every `(program, message)` pair within the 16-bit program band and 106-bit message band folds strictly inside the
122-qubit free register space `2 ^ (totalBits - fixedBits)`. Proved via `Nat.add_lt_add_left`, `Nat.succ_mul`,
`Nat.mul_le_mul_right`, `Nat.pow_add` and `Nat.lt_of_lt_of_le`. -/
theorem encode_lt_free_space (p m : Nat) (hp : p < 2 ^ programBits) (hm : m < 2 ^ messageBits) :
    encode p m < 2 ^ (totalBits - fixedBits) := by
  unfold encode
  have h1 : p * 2 ^ messageBits + m < (p + 1) * 2 ^ messageBits := by
    rw [Nat.succ_mul]
    exact Nat.add_lt_add_left hm (p * 2 ^ messageBits)
  have h2 : (p + 1) * 2 ^ messageBits ≤ 2 ^ programBits * 2 ^ messageBits :=
    Nat.mul_le_mul_right (2 ^ messageBits) hp
  have h3 : 2 ^ programBits * 2 ^ messageBits = 2 ^ (totalBits - fixedBits) :=
    (Nat.pow_add 2 programBits messageBits).symm
  rw [← h3]
  exact Nat.lt_of_lt_of_le h1 h2

/-- Injectivity of the 122-qubit band encoding: distinct `(program, message)` pairs with 106-bit messages never collide
in the 122-qubit register. Composed from `Qpu.Verify.Uuid.decode_encode_exact` with `Prod.mk.inj`. -/
theorem encode_injective (p₁ m₁ p₂ m₂ : Nat)
    (h₁ : m₁ < 2 ^ messageBits) (h₂ : m₂ < 2 ^ messageBits)
    (heq : encode p₁ m₁ = encode p₂ m₂) : p₁ = p₂ ∧ m₁ = m₂ := by
  have h : (p₁, m₁) = (p₂, m₂) := by
    rw [← decode_encode_exact p₁ m₁ h₁, ← decode_encode_exact p₂ m₂ h₂, heq]
  exact Prod.mk.inj h

/-- Exact 128-bit to 122-qubit folding fiber: the 128-bit UUID state space factors exactly as the 122-qubit free
register space times the `2 ^ 6 = 64` fixed ISO/IEC 9834-8 protocol states. Proved via `Nat.pow_add`. -/
theorem fold_128_to_122_fiber :
    2 ^ totalBits = 2 ^ (totalBits - fixedBits) * 2 ^ fixedBits :=
  (Nat.pow_add 2 (totalBits - fixedBits) fixedBits).symm

/-- Cardinality decomposition of a 128-bit ISO/IEC 9834-8 UUID into 122 free qubits and 6 fixed version/variant bits.
Composed from `Qpu.Verify.Uuid.fold_128_to_122_fiber` with Mathlib's `Fintype.card_fun`, `Fintype.card_bool` and
`Fintype.card_fin`. -/
theorem card_128_eq_card_122_mul_fixed :
    Fintype.card (Fin totalBits → Bool) =
      Fintype.card (Fin (totalBits - fixedBits) → Bool) * Fintype.card (Fin fixedBits → Bool) := by
  simp only [Fintype.card_fun, Fintype.card_bool, Fintype.card_fin]
  exact fold_128_to_122_fiber

/-- Cardinality decomposition of the 122-qubit free register into the 16-qubit program band and the 106-qubit message
band. Proved with Mathlib's `Fintype.card_fun`, `Fintype.card_bool`, `Fintype.card_fin` and `Nat.pow_add`. -/
theorem card_free_eq_bands :
    Fintype.card (Fin (totalBits - fixedBits) → Bool) =
      Fintype.card (Fin programBits → Bool) * Fintype.card (Fin messageBits → Bool) := by
  simp only [Fintype.card_fun, Fintype.card_bool, Fintype.card_fin]
  exact (Nat.pow_add 2 programBits messageBits).symm

/-- Exact equivalence between 32 hexadecimal nibbles (hexbits of width 4) and 128 bits. Proved with Mathlib's
`Fintype.card_fun`, `Fintype.card_bool`, `Fintype.card_fin` and `Nat.pow_mul`. -/
theorem card_nibbles_eq_128_bits :
    Fintype.card (Fin 32 → Fin 16) = Fintype.card (Fin totalBits → Bool) := by
  simp only [Fintype.card_fun, Fintype.card_bool, Fintype.card_fin]
  rw [show (16 : Nat) = 2 ^ 4 from rfl, ← Nat.pow_mul]
  rfl

/-- ISO/IEC 9834-8 version seal invariant: the modular-power version nibble `1 + ((r ^ 7) % 91) % 8` always lies in
`1..8` for every folded residue `r`. Proved via `Nat.le_add_right`, `Nat.mod_lt`, `Nat.zero_lt_succ` and
`Nat.add_comm`. -/
theorem version_nibble_valid (r : Nat) :
    1 ≤ 1 + ((r ^ 7) % 91) % 8 ∧ 1 + ((r ^ 7) % 91) % 8 ≤ 8 := by
  refine ⟨Nat.le_add_right 1 _, ?_⟩
  rw [Nat.add_comm]
  exact Nat.mod_lt _ (Nat.zero_lt_succ 7)

/-- ISO/IEC 9834-8 variant prefix invariant: the RFC 4122/9562 variant nibble `8 + v % 4` always lies in `8..11`
(`0x8..0xb`, binary `10xx`) for every low nibble `v`. Proved via `Nat.le_add_right`, `Nat.mod_lt`, `Nat.zero_lt_succ`,
`Nat.le_of_lt_succ` and `Nat.add_le_add_left`. -/
theorem variant_nibble_valid (v : Nat) :
    8 ≤ 8 + v % 4 ∧ 8 + v % 4 ≤ 11 := by
  refine ⟨Nat.le_add_right 8 _, ?_⟩
  exact Nat.add_le_add_left (Nat.le_of_lt_succ (Nat.mod_lt v (Nat.zero_lt_succ 3))) 8

end Qpu.Verify.Uuid
