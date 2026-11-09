import Qpu.Information.Qubit
import Qpu.Information.QuantumInformation
import Qpu.Physics.QuantumEntanglement
import Qpu.Processing.QuantumProcessor
import Qpu.Processing.QuantumGate
import Qpu.Processing.QuantumAlgorithm
import Qpu.Processing.QuantumErrorCorrection
import Qpu.Processing.QuantumCircuit

/-! # Qpu.Processing.QuantumComputer
---
component: quantum computer design (ISO/IEC 4879:2024 3.4.10)
---
The design of qpu as a quantum computer, each part at the path of its ISO/IEC 4879:2024 term: the Hilbert space (3.2.1) and its
operators (3.2.2), entanglement (3.2.10), quantum information (3.3.1), the qubit (3.3.3), the gate (3.4.2), the circuit (3.4.5),
error correction (3.4.6), the processor (3.4.8) and the algorithms (3.4.9). Every part is a kernel-checked theorem whose statement
says what its name claims, in exact integers or exact Gaussian integers, never floats.

Boundary: these theorems prove the DESIGN and its ALGORITHMS. Whether a device is a quantum computer depends on its qubits being
physical registers that show quantum-mechanical behaviour, which is measured, not proved: the processor verdict of ISO/IEC
4879:2024 3.4.8 (`get_qc`) stays false until an apparatus exists whose measured outcomes realise this design. -/
