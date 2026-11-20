/-! # Qpu.General.Prose.QuantumProcessingWitnesses
The prose of `src/quantum/processing/witnesses.ts`. Each definition is one sentence, read in TypeScript by its name from prose-index.ts;
`⟦n⟧` marks where the nth computed value goes. -/

namespace Prose

def quantumProcessingWitnesses_says1 : String := "⟦0⟧ witnesses around ⟦1⟧: ⟦2⟧ map back exactly⟦3⟧⟦4⟧"
def quantumProcessingWitnesses_s2 : String := ", ⟦0⟧ coincide (a rotation that repeats the program)"
def quantumProcessingWitnesses_s3 : String := "; one equals the UUID itself (its program is rotation-symmetric)"
def quantumProcessingWitnesses_s4 : String := "a superposition index is a positive integer: its 2k witnesses move by ±2"
def quantumProcessingWitnesses_says5 : String := "2·⟦0⟧ = ⟦1⟧ witnesses around the superposition; a ±1 move in k is ±2 in the span, to 2·⟦2⟧ = ⟦3⟧ and 2·⟦4⟧ = ⟦5⟧, paying ⟦6⟧ coin(s) down and collecting ⟦7⟧ up (net ⟦8⟧); it covers clock(s) ⟦9⟧ and calendar(s) ⟦10⟧. The integer reflection in each step: ⟦11⟧, ⟦12⟧, ⟦13⟧ fold to seeds ⟦14⟧⟦15⟧"
def quantumProcessingWitnesses_s6 : String := " — the neighbours ⟦0⟧ and ⟦1⟧ are a σ₁₀ reflection pair (sum ten) around the fixed centre ⟦2⟧"
def quantumProcessingWitnesses_says7 : String := "⟦0⟧ side(s) are not a sealed UUID; no witnesses computed and no coin minted (a coin is a validated address)"
def quantumProcessingWitnesses_says8 : String := "⟦0⟧ + ⟦1⟧ witnesses, ⟦2⟧ distinct: ⟦3⟧ shared by address, each work that exists once, not twice"

end Prose
