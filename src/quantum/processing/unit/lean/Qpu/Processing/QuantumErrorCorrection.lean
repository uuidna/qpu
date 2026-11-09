/-! # Qpu.Processing.QuantumErrorCorrection
---
component: quantum error correction (ISO/IEC 4879:2024 3.4.6)
---
The three-bit repetition code corrects every single bit flip by majority decoding. -/

namespace QuantumErrorCorrection

/-- the three-bit repetition code word of `b` -/
def encode (b : Bool) : Nat := if b then 7 else 0
/-- flip bit `e` of the word (no flip when `e = 3`) -/
def flip (e w : Nat) : Nat := if e < 3 then w ^^^ 2 ^ e else w
/-- majority decoding -/
def decode (w : Nat) : Bool := ((List.range 3).filter fun k => (w / 2 ^ k) % 2 == 1).length ≥ 2

/-- the repetition code corrects every single bit flip, and no flip at all -/
theorem repetition_corrects : ∀ b : Bool, ∀ e, e < 4 → decode (flip e (encode b)) = b := by decide

end QuantumErrorCorrection
