/-
  Qpu.Verify.Cost — security-strength economics against NIST's PQC ladder.

  SCOPE OF PROOF. Nothing here proves SHA-256 (or any primitive) hard.
  This module records the classical strengths NIST assigns — IR 8547 (ipd)
  Table 7 rates SHA-256 at 256-bit preimage / 128-bit collision — and
  kernel-proves only the arithmetic of the margins built on them. A break
  of the primitive voids every number below; no theorem in this corpus
  can forbid one.
-/
namespace Qpu.Verify.Cost

/-- Verification is one hash evaluation; the whole asymmetry lives here. -/
def verify : Nat := 1

/-- Preimage strength in log₂: the full digest width (NIST's rating, not a halved guess). -/
def preimage (bits : Nat) : Nat := bits

/-- Collision strength in log₂: the classical birthday bound. -/
def collision (bits : Nat) : Nat := bits / 2

/-- Independent seams multiply the work, so their exponents add. -/
def chained (strength seams : Nat) : Nat := strength * seams

/-- NIST PQC categories as log₂ classical floors:
    1 ≈ AES-128 · 2 ≈ SHA-256-family collision · 3 ≈ AES-192 · 5 ≈ AES-256. -/
def category1 : Nat := 128
def category2 : Nat := 128
def category3 : Nat := 192
def category5 : Nat := 256

/-- SHA-256 preimage strength sits at the category-5 floor (256-bit classical). -/
theorem digest_preimage_at_category_five : preimage 256 = category5 := by decide

/-- Its collision strength sits at the category-2 floor (128-bit classical birthday). -/
theorem digest_collision_at_category_two : collision 256 = category2 := by decide

/-- A 122-free-bit UUID handle collides at 2⁶¹ — below category 1.
    A bare address is not a security boundary. -/
theorem uuid_handle_collides_below_category_one : collision 122 < category1 := by decide

/-- Even two UUID seams stay short. -/
theorem two_uuid_seams_are_still_short : chained (collision 122) 2 < category1 := by decide

/-- Three clear the floor — that is what multi-seam must mean to be worth saying. -/
theorem three_uuid_seams_clear_category_one : category1 ≤ chained (collision 122) 3 := by decide

/-- SHA-224 is the near miss: 112-bit collision strength is below category 1. -/
theorem sha224_collision_below_category_one : collision 224 < category1 := by decide

/-- Control: a full-width digest chained once does clear category 2 —
    the refusals above are not vacuous. -/
theorem the_anchor_holds : category2 ≤ chained (collision 256) 1 := by decide

/-- Forging costs more than verifying, for any nonempty width and seam count. -/
theorem forging_costs_more_than_verifying (bits seams : Nat) :
    verify ≤ chained (preimage (bits + 1)) (seams + 1) := by
  simp [verify, chained, preimage]
  exact Nat.succ_le_succ (Nat.zero_le _)

end Qpu.Verify.Cost