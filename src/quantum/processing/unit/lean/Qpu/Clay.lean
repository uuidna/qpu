import Qpu.Mint
import Qpu.Shor
import Qpu.Lattice
import Qpu.Hybrid
import Qpu.Coil
import Qpu.Physics

/-! # Qpu.Clay
Discovered, not written (scripts/lean-clay.mjs): the formulas discover each other — every value two or more families of formulas reach, stated over the lattice's own constant names. No list is kept. clay_wings is their conjunction, and crossDiscoverSchemaOf consolidates the same relations as one schema.org DefinedTermSet. -/

/-- Hybrid, Lattice, Mint, Shor meet at 8. -/
theorem relation_8 : vertices = hybridSpeed ∧ vertices = mintOf n := ⟨rfl, rfl⟩
/-- Coil, Lattice meet at 14. -/
theorem relation_14 : faces = coil := rfl
/-- Mint, Shor meet at 16. -/
theorem relation_16 : mintOf hexbit = powMod coins rays plane ∧ mintOf hexbit = powMod coins hexbit bits := ⟨rfl, rfl⟩
/-- Mint, Shor meet at 21. -/
theorem relation_21 : chooseOf rays coins = powMod rays coins plane ∧ chooseOf rays coins = powMod rays vertices plane := ⟨rfl, rfl⟩
/-- Physics, Shor meet at 25. -/
theorem relation_25 : powMod n hexbit plane = powMod n faces bits ∧ powMod n hexbit plane = powMod n plane plane := ⟨rfl, rfl⟩
/-- Lattice, Mint meet at 28. -/
theorem relation_28 : plane = chooseOf vertices coins := rfl
/-- Lattice, Mint meet at 4294967296. -/
theorem relation_4294967296 : amplitudes = mintOf bits := rfl

/-- Every discovered relation at once: the families of formulas that meet. -/
theorem clay_wings : (vertices = hybridSpeed ∧ vertices = mintOf n) ∧ faces = coil ∧ (mintOf hexbit = powMod coins rays plane ∧ mintOf hexbit = powMod coins hexbit bits) ∧ (chooseOf rays coins = powMod rays coins plane ∧ chooseOf rays coins = powMod rays vertices plane) ∧ (powMod n hexbit plane = powMod n faces bits ∧ powMod n hexbit plane = powMod n plane plane) ∧ plane = chooseOf vertices coins ∧ amplitudes = mintOf bits := ⟨relation_8, relation_14, relation_16, relation_21, relation_25, relation_28, relation_4294967296⟩
