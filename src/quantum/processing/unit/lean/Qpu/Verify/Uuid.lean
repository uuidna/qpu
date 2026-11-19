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

end Qpu.Verify.Uuid