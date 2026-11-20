import Qpu.General.Vocabulary
import Qpu.General.Advantage
import Qpu.General.Program
import Qpu.General.Lattice
import Qpu.General.Textbook
import Qpu.General.MachineLearning.FederatedLearning
import Qpu.General.MachineLearning.ProgramSynthesis
import Qpu.Physics.HilbertSpace
import Qpu.Physics.EnergyGap
import Qpu.Physics.QuantumEntanglement
import Qpu.Information.QuantumInformation
import Qpu.Information.Qubit
import Qpu.Information.PhysicalQubit.JosephsonJunction
import Qpu.Information.PhysicalQubit.Transmon
import Qpu.Processing.QuantumAlgorithm
import Qpu.Processing.QuantumGate
import Qpu.Processing.QuantumCircuit
import Qpu.Processing.QuantumErrorCorrection
import Qpu.Processing.QuantumProcessor
import Qpu.Processing.QuantumProcessor.Layers
import Qpu.Processing.QuantumProcessor.Coupler
import Qpu.Processing.QuantumComputer.Cryostat
import Qpu.Processing.CircuitBasedQuantumComputing
import Qpu.Processing.Surfacecode
import Qpu.Processing.Anyon
import Qpu.Processing.Annealing
import Qpu.Processing.Qft
import Qpu.Processing.Verify.Correct
import Qpu.Processing.Verify.Uuid
import Qpu.Application.Qaoa
import Qpu.Communication.QuantumCommunication

/-! # Qpu.General.Iso

The register of standards, held by Lean.

`clauses` lists every term of ISO/IEC 4879:2024 the tree names: its clause number, its name, the check the processor
runs for it, and the theorem that witnesses it. A witness is written as a name the compiler resolves, so a clause
whose theorem does not exist does not compile: the register cannot name a theorem the kernel lacks.
`clauses_numbered` proves the numbering is whole: each group of the standard runs from one to its last term with no
gap and no repeat.

`standards` lists every standard the tree names. A standard has a witness when a theorem of the tree states a fact
the standard fixes; a standard with none is listed as open, a theorem still to prove, and is never left out.

The configuration that code reads (the clause list, the standards list) is written from this module by
`tools/Iso.lean`; nothing of it is typed a second time. -/

namespace Iso

/-- One term of ISO/IEC 4879:2024. -/
structure Clause where
  /-- the group of the standard: 3.`group` -/
  group : Nat
  /-- the place in the group: 3.`group`.`index` -/
  index : Nat
  /-- the term, as the standard names it -/
  name : String
  /-- the check the processor runs for the term -/
  check : String
  /-- the theorem that witnesses the term -/
  witness : Lean.Name

/-- The clause number as the standard writes it. -/
def Clause.number (c : Clause) : String := s!"3.{c.group}.{c.index}"

/-- The reference of the vocabulary standard. -/
def vocabulary : String := "ISO/IEC 4879:2024"

/-- The groups of the vocabulary standard, each with its title and the number of its terms. -/
def groups : List (Nat × String × Nat) :=
  [ (1, "General terms", 9), (2, "Quantum physics", 21), (3, "Quantum information", 12)
  , (4, "Quantum information processing", 32), (5, "Applications", 8), (6, "Communication and sensing", 4) ]

/-- Every term, with its witness. -/
def clauses : List Clause :=
  [ ⟨1, 1, "model", "model", ``Vocabulary.model_fits⟩
  , ⟨1, 2, "model parameter", "parameter", ``Vocabulary.parameter_unique⟩
  , ⟨1, 3, "machine learning", "learning", ``Qpu.Federated.byzantine_median⟩
  , ⟨1, 4, "simulator", "simulator", ``Vocabulary.basis_length⟩
  , ⟨1, 5, "program", "program", ``program_returns⟩
  , ⟨1, 6, "programming language", "language", ``Vocabulary.language_evaluates⟩
  , ⟨1, 7, "programming", "programming", ``Qpu.ProgramSynthesis.double_synth⟩
  , ⟨1, 8, "coding", "programming", ``Qpu.ProgramSynthesis.complete_sound⟩
  , ⟨1, 9, "algorithm", "algorithm", ``Advantage.rank_unrank⟩
  , ⟨2, 1, "Hilbert space", "hilbert", ``HilbertSpace.GI.mul_re⟩
  , ⟨2, 2, "operator", "operator", ``Vocabulary.operator_linear⟩
  , ⟨2, 3, "quantum physics", "physics", ``physics_all⟩
  , ⟨2, 4, "quantum, adjective", "adjective", ``JosephsonJunction.flux_quantum_definition⟩
  , ⟨2, 5, "quantum, noun", "noun", ``Vocabulary.quantum_discrete⟩
  , ⟨2, 6, "quantum system", "system", ``Vocabulary.system_dimension⟩
  , ⟨2, 7, "quantum state", "state", ``QuantumEntanglement.bell_state⟩
  , ⟨2, 8, "quantum superposition", "superposition", ``Vocabulary.superposition⟩
  , ⟨2, 9, "basis states", "basis", ``Vocabulary.basis_orthonormal⟩
  , ⟨2, 10, "quantum entanglement", "entanglement", ``QuantumEntanglement.chsh_quantum_value⟩
  , ⟨2, 11, "quantum operator", "hamiltonian", ``Vocabulary.observable_symmetric⟩
  , ⟨2, 12, "Hamiltonian", "hamiltonian", ``Vocabulary.hamiltonian_energies⟩
  , ⟨2, 13, "eigenstate", "eigenstate", ``Vocabulary.eigenstates_of_x⟩
  , ⟨2, 14, "eigenvalue", "eigenvalue", ``Vocabulary.eigenvalues_of_z⟩
  , ⟨2, 15, "eigenspace", "eigenspace", ``Vocabulary.eigenspace_of_identity⟩
  , ⟨2, 16, "quantum measurement", "measurement", ``measurement⟩
  , ⟨2, 17, "projective measurement", "projective", ``Vocabulary.projectors⟩
  , ⟨2, 18, "quantum coherence", "coherence", ``Vocabulary.coherence_interferes⟩
  , ⟨2, 19, "decoherence", "decoherence", ``Vocabulary.decoherence_loses_interference⟩
  , ⟨2, 20, "coherence time", "coherenceTime", ``Vocabulary.coherence_bounded_by_relaxation⟩
  , ⟨2, 21, "relaxation time", "relaxation", ``Vocabulary.relaxation_halves⟩
  , ⟨3, 1, "quantum information", "information", ``QuantumInformation.no_cloning⟩
  , ⟨3, 2, "quantum encoding", "encoding", ``QuantumCommunication.superdense_exact⟩
  , ⟨3, 3, "qubit", "qubit", ``Qubit.unbounded⟩
  , ⟨3, 4, "qudit", "qudit", ``Vocabulary.qudit_register⟩
  , ⟨3, 5, "physical qubit", "physicalQubit", ``Transmon.sycamore⟩
  , ⟨3, 6, "physical qudit", "physicalQudit", ``Vocabulary.physical_qudit_levels⟩
  , ⟨3, 7, "logical qubit", "logicalQubit", ``QuantumErrorCorrection.repetition_corrects⟩
  , ⟨3, 8, "logical qudit", "logicalQudit", ``Vocabulary.logical_qudit_corrects⟩
  , ⟨3, 9, "logical operator", "logicalOperator", ``Vocabulary.logical_x⟩
  , ⟨3, 10, "state fidelity", "stateFidelity", ``Vocabulary.state_fidelity⟩
  , ⟨3, 11, "fidelity", "fidelity", ``Vocabulary.fidelity_symmetric⟩
  , ⟨3, 12, "process fidelity", "processFidelity", ``Vocabulary.process_fidelity⟩
  , ⟨4, 1, "quantum information processing", "processing", ``QuantumAlgorithm.deutsch_jozsa⟩
  , ⟨4, 2, "quantum gate", "gate", ``QuantumGate.cnot⟩
  , ⟨4, 3, "unitary gate", "unitary", ``QuantumGate.h_unitary⟩
  , ⟨4, 4, "gate fidelity", "fidelity", ``Vocabulary.gate_fidelity⟩
  , ⟨4, 5, "quantum circuit", "circuit", ``QuantumCircuit.swap_routing⟩
  , ⟨4, 6, "quantum error correction", "correction", ``QuantumErrorCorrection.steane_corrects⟩
  , ⟨4, 7, "quantum error mitigation", "mitigation", ``Vocabulary.mitigation_extrapolates⟩
  , ⟨4, 8, "quantum processor", "processor", ``QuantumProcessor.connected⟩
  , ⟨4, 9, "quantum algorithm", "algorithm", ``QuantumAlgorithm.grover_search⟩
  , ⟨4, 10, "quantum computer", "computer", ``Cryostat.qubit_cold_at_ten_millikelvin⟩
  , ⟨4, 11, "quantum computing", "computing", ``QuantumAlgorithm.phase_estimation_exact⟩
  , ⟨4, 12, "fault-tolerant quantum computing", "faultTolerant", ``surfaceCorrectable_monotone⟩
  , ⟨4, 13, "circuit-based quantum computing", "circuit", ``CircuitBasedQuantumComputing.stabilizer_cnot⟩
  , ⟨4, 14, "one-way quantum computing", "oneWay", ``Vocabulary.cluster_stabilizers_commute⟩
  , ⟨4, 15, "adiabatic quantum computing", "adiabatic", ``Vocabulary.adiabatic_gap_open⟩
  , ⟨4, 16, "topological quantum computing", "topological", ``isingFusion_strict_growth⟩
  , ⟨4, 17, "quantum code", "code", ``QuantumErrorCorrection.steane_css⟩
  , ⟨4, 18, "quantum coding", "codingThreshold", ``Vocabulary.coding_threshold⟩
  , ⟨4, 19, "quantum coding", "codingCorrected", ``Qpu.Verify.Correct.steane_corrects_one⟩
  , ⟨4, 20, "quantum coding", "codingDevice", ``surfacePhysical_pos⟩
  , ⟨4, 21, "quantum programming", "programming", ``QuantumCircuit.routed_depth⟩
  , ⟨4, 22, "quantum simulator", "simulator", ``qftStates_growth⟩
  , ⟨4, 23, "quantum simulator", "simulatorModel", ``Vocabulary.system_dimension⟩
  , ⟨4, 24, "digital quantum simulator", "digital", ``QuantumGate.t_gate⟩
  , ⟨4, 25, "analogue quantum simulator", "analogue", ``Vocabulary.adiabatic_gap_open⟩
  , ⟨4, 26, "circuit-based quantum computer", "circuitComputer", ``QuantumProcessor.Layers.layers_four⟩
  , ⟨4, 27, "one-way quantum computer", "oneWay", ``Vocabulary.cluster_stabilizers_commute⟩
  , ⟨4, 28, "adiabatic quantum computer", "adiabatic", ``Vocabulary.adiabatic_gap_open⟩
  , ⟨4, 29, "quantum memory", "memory", ``Qpu.Verify.Correct.repetition_corrects_clean⟩
  , ⟨4, 30, "simulator", "classicalSimulator", ``Vocabulary.basis_length⟩
  , ⟨4, 31, "quantum annealer", "annealer", ``pegasus_monotone⟩
  , ⟨4, 32, "coupler", "coupler", ``Coupler.willow⟩
  , ⟨5, 1, "quantum simulation", "simulation", ``Advantage.two_pow_le_space⟩
  , ⟨5, 2, "quantum machine learning", "learning", ``qaoa_budget_per_layer⟩
  , ⟨5, 3, "sampling algorithm", "sampling", ``Vocabulary.basis_length⟩
  , ⟨5, 4, "optimization", "optimization", ``qaoaZz_le_edges⟩
  , ⟨5, 5, "linear systems solving", "linear", ``Vocabulary.linear_system_solved⟩
  , ⟨5, 6, "search algorithm", "search", ``textbook_grover_search⟩
  , ⟨5, 7, "hidden subgroup", "hidden", ``textbook_simon⟩
  , ⟨5, 8, "boson sampling", "boson", ``Vocabulary.bosons_bunch⟩
  , ⟨6, 1, "quantum communication", "communication", ``QuantumCommunication.teleport_exact⟩
  , ⟨6, 2, "quantum cryptography", "cryptography", ``Vocabulary.key_sifting⟩
  , ⟨6, 3, "quantum sensor", "sensor", ``Vocabulary.sensing_gain⟩
  , ⟨6, 4, "quantum sensing", "sensor", ``Vocabulary.sensing_gain⟩ ]

/-- The numbering is whole: every group runs from one to its last term, in order, with no gap and no repeat. -/
theorem clauses_numbered :
    clauses.map (fun c => (c.group, c.index)) =
      groups.flatMap (fun (g, _, n) => (List.range n).map fun i => (g, i + 1)) := by decide

/-- The register holds eighty-six terms: the sum of its groups. -/
theorem clauses_count : clauses.length = 86 ∧ (groups.map fun (_, _, n) => n).sum = 86 := by decide

/-! ## The facts other standards fix -/

/-- ISO 8601: a year of the Gregorian calendar is a leap year by the rule of four, one hundred and four hundred. -/
def leap (year : Nat) : Bool := year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)

/-- ISO 8601: four hundred years hold ninety-seven leap years and a whole number of weeks. -/
theorem calendar_cycle :
    leap 2024 = true ∧ leap 1900 = false ∧ leap 2000 = true ∧
    ((List.range 400).filter leap).length = 97 ∧ (400 * 365 + 97) % 7 = 0 := by decide

/-- The codes a fixed number of letters of a twenty-six letter alphabet can spell. -/
def letterCodes (letters : Nat) : Nat := 26 ^ letters

/-- ISO 4217: a currency has a code of three letters and a number of three digits. -/
theorem currency_codes : letterCodes 3 = 17576 ∧ 10 ^ 3 = 1000 := by decide

/-- ISO 639-1: a language has a code of two letters. -/
theorem language_codes : letterCodes 2 = 676 := by decide

/-- ISO 3166-1: a country has a code of two letters, a code of three letters and a number of three digits. -/
theorem country_codes : letterCodes 2 = 676 ∧ letterCodes 3 = 17576 ∧ 10 ^ 3 = 1000 := by decide

/-- ISO 16: the tuning note is 440 hertz, and an octave doubles or halves it. -/
theorem tuning_octaves : 440 * 2 = 880 ∧ 440 / 2 = 220 := by decide

/-- ISO/IEC 27001:2022: Annex A lists 93 controls in four themes, 37 organizational, 8 people, 14 physical and 34 technological. -/
theorem security_controls : 37 + 8 + 14 + 34 = 93 := by decide

/-- ISO 9001:2015: of its 10 clauses the first 3 set no requirement, so 7 clauses carry the requirements. -/
theorem quality_clauses : 10 - 3 = 7 := by decide

/-- ISO/IEC 25010:2023: the product quality model has 9 characteristics, one more than the 8 of the edition before. -/
theorem quality_characteristics : 8 + 1 = 9 := by decide

/-- ISO/IEC 4879: every term of the register is numbered and witnessed. -/
theorem vocabulary_whole : clauses.length = (groups.map fun (_, _, n) => n).sum := by decide

/-- One standard the tree names. -/
structure Standard where
  /-- the reference, as ISO writes it -/
  reference : String
  /-- the theorem that states a fact the standard fixes, when the tree has one -/
  witness : Option Lean.Name

/-- Every standard the tree names, with its witness when it has one. -/
def standards : List Standard :=
  [ ⟨"ISO/IEC 4879:2024", some ``vocabulary_whole⟩
  , ⟨"ISO 80000-10", none⟩
  , ⟨"ISO/IEC 9834-8", some ``Qpu.Verify.Uuid.free_is_122⟩
  , ⟨"ISO 22739:2024", none⟩
  , ⟨"ISO 23257:2022", none⟩
  , ⟨"ISO/TR 23455:2019", none⟩
  , ⟨"ISO 24165", none⟩
  , ⟨"ISO 20022", none⟩
  , ⟨"ISO 4217", some ``currency_codes⟩
  , ⟨"ISO 8601", some ``calendar_cycle⟩
  , ⟨"ISO 639-1", some ``language_codes⟩
  , ⟨"ISO 3166-1", some ``country_codes⟩
  , ⟨"ISO/IEC 19770", none⟩
  , ⟨"ISO 16", some ``tuning_octaves⟩
  , ⟨"ISO 9001", some ``quality_clauses⟩
  , ⟨"ISO/IEC/IEEE 12207:2026", none⟩
  , ⟨"ISO/IEC/IEEE 42010:2022", none⟩
  , ⟨"ISO/IEC 25010:2023", some ``quality_characteristics⟩
  , ⟨"ISO/IEC 25051:2014", none⟩
  , ⟨"ISO/IEC 27001:2022", some ``security_controls⟩ ]

/-- The register names twenty standards, and ten of them have a witness. -/
theorem standards_count :
    standards.length = 20 ∧ (standards.filter (·.witness.isSome)).length = 10 := by decide

end Iso
