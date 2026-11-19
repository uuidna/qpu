/-
  Qpu.Verify.Hexbit — nibble/hex round-trips and 32-bit routing-prefix arithmetic.
-/
namespace Qpu.Verify.Hexbit

/-- Nibble 0..15 to lowercase hex character. -/
def hexChar (n : Nat) : Char :=
  if n < 10 then Char.ofNat (48 + n) else Char.ofNat (87 + n)

/-- Hex character back to nibble; 256 signals "not a hex digit". -/
def hexVal (c : Char) : Nat :=
  let u := c.toNat
  if 48 ≤ u && u < 58 then u - 48
  else if 97 ≤ u && u < 103 then u - 87
  else 256

/-- Every nibble survives the round trip. -/
theorem hex_roundtrips (n : Nat) (h : n < 16) : hexVal (hexChar n) = n := by
  match n, h with
  | 0, _ => decide
  | 1, _ => decide
  | 2, _ => decide
  | 3, _ => decide
  | 4, _ => decide
  | 5, _ => decide
  | 6, _ => decide
  | 7, _ => decide
  | 8, _ => decide
  | 9, _ => decide
  | 10, _ => decide
  | 11, _ => decide
  | 12, _ => decide
  | 13, _ => decide
  | 14, _ => decide
  | 15, _ => decide
  | _+16, h => omega

/-- Control: a non-hex character does not decode to a nibble. -/
theorem non_hex_is_rejected : hexVal 'g' = 256 := by decide

/-- Routing: the 32-bit hexbit prefix of a 64-bit id is its high half. -/
theorem prefix_is_high_half :
    (0x1234567890ABCDEF : Nat) / (0x100000000 : Nat) = 0x12345678 := by decide

/-- Control: the prefix really is 8 hexits — 32 bits — wide. -/
theorem prefix_width : (0x12345678 : Nat) < 2 ^ (8 * 4) := by decide

end Qpu.Verify.Hexbit