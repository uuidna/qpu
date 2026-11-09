import Qpu.Register
import Qpu.Blueprint.Coupling
import Qpu.Blueprint.Gates
import Qpu.Blueprint.Algorithms
import Qpu.Blueprint.Compile

/-! # Qpu.Blueprint
---
component: blueprint
---
The qpu processor's blueprint: every component a kernel-checked theorem whose statement says what its name claims, in exact
integers or exact Gaussian integers, never floats. The register is `Qpu.Register`; the coupling graph, the gate set, the algorithms
and the compilation are the modules below it.

Boundary: the blueprint proves the processor's DESIGN and its ALGORITHMS. Fabricating qubits is outside Lean, so the processor
verdict of ISO/IEC 4879:2024 3.4.8 (`get_qc`) stays false until an apparatus exists that realises this design. -/
