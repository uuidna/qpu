import Lean

/-! # Qpu.Claims.Reflection

A theorem that reflects another says so itself. `@[reflection]` on a theorem marks it as the reflection, the
contrapositive or the converse of the theorem it follows: it belongs to that theorem and is not a product of its own.
The tools ask Lean for the mark; no rule about names decides it. -/

open Lean

/-- Marks a theorem as a reflection of the theorem it follows. -/
initialize reflectionAttr : TagAttribute ← registerTagAttribute `reflection "a theorem that reflects the theorem it follows"

namespace Qpu

/-- Whether a theorem is marked as a reflection. -/
def isReflection (env : Environment) (name : Name) : Bool := reflectionAttr.hasTag env name

end Qpu
