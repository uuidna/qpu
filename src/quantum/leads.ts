// Every lead on quantumai.google and its linked PDF, with its status and the MCP tool that serves it. A lead is served when a
// tool answers it, partial when a tool answers part of it (the reason says which part), blocked when the page could not be
// read (the reason says why), and out of scope when it is not content this repository carries (a video, a careers page).

export type LeadStatus = 'served' | 'partial' | 'blocked' | 'out_of_scope'

export type Lead = { id: string; source: string; statement: string; status: LeadStatus; tool?: string; reason?: string }

export const LEADS: readonly Lead[] = [
  { id: 'willow-spec', source: 'quantumai.google/static/site-assets/downloads/willow-spec-sheet.pdf', statement: 'Willow: 105 qubits, the grid, two chips with their figures', status: 'served', tool: 'processor' },
  { id: 'willow-blog', source: 'blog.google, Willow', statement: 'Willow error correction below threshold; random circuit sampling', status: 'served', tool: 'processor' },
  { id: 'magic-state', source: 'blog.google, magic state cultivation', statement: '40-fold error reduction, 99.99% logical fidelity, color code to surface code', status: 'served', tool: 'processor' },
  { id: 'echoes-blog', source: 'blog.google, Quantum Echoes', statement: 'OTOC protocol on the 105-qubit array; 13,000x; molecules of 15 and 28 atoms', status: 'served', tool: 'echo_benchmark' },
  { id: 'echoes-preprint', source: 'arXiv 2506.10191', statement: 'The Quantum Echoes preprint and its abstract', status: 'served', tool: 'statements' },
  { id: 'echoes-protocol', source: 'research.google/blog/a-verifiable-quantum-advantage', statement: 'forward, perturb, backward, measure, repeated k times', status: 'served', tool: 'echo' },
  { id: 'roadmap', source: 'services.google.com PDF, roadmap figure', statement: 'Six milestones, physical-qubit scale, Milestone 3 in progress', status: 'served', tool: 'roadmap' },
  { id: 'applications', source: 'services.google.com PDF, applications figure', statement: 'Predicted applications by physical-qubit band, 50k to 50M', status: 'served', tool: 'roadmap' },
  { id: 'neutral-atoms', source: 'blog.google, neutral atom quantum computers', statement: 'Expansion to neutral atoms; no Google device figures stated', status: 'served', tool: 'statements' },
  { id: 'early-access', source: 'quantumai.google/willowearlyaccess', statement: 'Willow Early Access Program, deadline May 15, 2026', status: 'served', tool: 'statements' },
  { id: 'software', source: 'quantumai.google/software', statement: 'Cirq, qsim, Qualtran, OpenFermion, TensorFlow Quantum', status: 'served', tool: 'software' },
  { id: 'cirq-overview', source: 'quantumai.google/cirq', statement: 'Cirq is a Python library for writing, manipulating and optimizing circuits', status: 'served', tool: 'statements' },
  { id: 'cirq-circuits', source: 'quantumai.google/cirq/build/circuits', statement: 'Circuits, moments, append and insert, the four insert strategies', status: 'served', tool: 'circuit' },
  { id: 'cirq-devices', source: 'quantumai.google/cirq/hardware/devices', statement: 'Device constraints: validate_operation, validate_moment, validate_circuit, qubit set, couplers', status: 'served', tool: 'circuit' },
  { id: 'cirq-simulation', source: 'quantumai.google/cirq/simulate/simulation', statement: 'State-vector and density-matrix simulators; expectation values', status: 'served', tool: 'circuit' },
  { id: 'cirq-noise', source: 'quantumai.google/cirq/simulate/noisy_simulation', statement: 'The named noise channels: bit_flip, phase_flip, phase_damp, amplitude_damp, depolarize, reset, asymmetric_depolarize, generalized_amplitude_damp', status: 'served', tool: 'circuit' },
  { id: 'qvm', source: 'quantumai.google/cirq/simulate/quantum_virtual_machine; github.com/quantumlib/Cirq engine source', statement: 'Virtual processor: a device with noise, and the Willow noise data', status: 'partial', tool: 'circuit', reason: 'the device and the noise channels are served and their definitions checked against Cirq\'s source; Willow\'s median noise calibration is loaded from Google\'s engine (the processor id willow_pink), and the Cirq repository does not contain it, so noise comes from the caller' },
  { id: 'textbook-algorithms', source: 'quantumai.google/cirq/experiments/textbook_algorithms', statement: 'Teleportation, QFT and its inverse, phase estimation, Grover on two qubits', status: 'served', tool: 'algorithm' },
  { id: 'qaoa', source: 'quantumai.google/cirq/experiments/qaoa/qaoa_maxcut', statement: 'QAOA max-cut at p = 1: the sweep on a 5 by 5 grid over [0, 2π), the estimate_cost objective sampled at 20,000 shots, the seeded weights', status: 'partial', tool: 'algorithm', reason: 'the sweep, the sampled estimate and the expected cut are served; the page draws its weights with numpy under seed 11, and the weights here come from a 32-bit generator, so the instance is not the page\'s' },
  { id: 'shor', source: 'quantumai.google/cirq/experiments/textbook_algorithms', statement: 'Shor\'s order finding, the later use of phase estimation the page names', status: 'served', tool: 'algorithm' },
  { id: 'qsim', source: 'github.com/quantumlib/qsim', statement: 'qsim: a fast state-vector simulator with a Cirq interface, Apache-2.0', status: 'served', tool: 'statements' },
  { id: 'research', source: 'quantumai.google/research and /research/publications', statement: 'Research publications', status: 'blocked', reason: '/research/publications returns 404, and /research has only navigation to the fetch' },
  { id: 'echoes-nature', source: 'arXiv 2506.10191, Constructive interference at the edge of quantum ergodic dynamics (published in Nature as Observation of constructive interference at the edge of quantum ergodicity)', statement: '103-qubit superconducting processor; second-order OTOC; the Nature paper\'s claims, with the preprint\'s stated figures', status: 'served', tool: 'statements' },
  { id: 'willow-nature', source: 'arXiv 2408.13687, Quantum error correction below the surface code threshold (the paper the homepage links as Nature)', statement: 'distance-5 and distance-7 memories; Λ = 2.14 ± 0.02; a 101-qubit distance-7 code; 0.143% logical error per cycle; 63 μs decoder latency', status: 'served', tool: 'processor' },
  { id: 'learn-map', source: 'quantumai.google/learn/map', statement: 'Our quantum computing journey', status: 'blocked', reason: 'quantumai.google/learn/map returns 404 to the fetch' },
  { id: 'campus-announcement', source: 'blog.google, Unveiling our new Quantum AI campus (May 18, 2021)', statement: 'The campus announcement: the data center, labs, fabrication and the 1,000,000-qubit target', status: 'served', tool: 'statements' },
  { id: 'sycamore-gates', source: 'quantumai.google/cirq/google/devices', statement: 'Sycamore\'s two-qubit gates and their durations', status: 'served', tool: 'statements' },
  { id: 'sycamore23', source: 'github.com/quantumlib/Cirq known_devices.py', statement: 'Sycamore23: the 23-qubit subset of Sycamore', status: 'served', tool: 'processor' },
  { id: 'qualtran', source: 'github.com/quantumlib/Qualtran', statement: 'Qualtran: abstractions for quantum programs and a library of algorithms, experimental', status: 'served', tool: 'statements' },
  { id: 'openfermion', source: 'github.com/quantumlib/OpenFermion', statement: 'OpenFermion: compiling and analyzing quantum algorithms to simulate fermionic systems', status: 'served', tool: 'statements' },
  { id: 'cirq-noise-source', source: 'github.com/quantumlib/Cirq cirq-core/cirq/ops/common_channels.py', statement: 'The noise channel definitions, checked against Cirq\'s source: bit_flip, phase_flip, depolarize, asymmetric_depolarize, phase_damp, amplitude_damp, generalized_amplitude_damp, reset', status: 'served', tool: 'circuit' },
  { id: 'cirq-insert-source', source: 'github.com/quantumlib/Cirq cirq-core/cirq/circuits/insert_strategy.py', statement: 'The four insert strategies, checked against Cirq\'s source', status: 'served', tool: 'circuit' },
  { id: 'learn', source: 'quantumai.google/learn', statement: 'Learn overview', status: 'blocked', reason: 'quantumai.google/learn returns 404 to the fetch' },
  { id: 'lab', source: 'quantumai.google/lab', statement: 'Discover the Quantum AI campus: the Santa Barbara campus, its quantum data center, labs and fabrication', status: 'served', tool: 'statements' },
  { id: 'sycamore', source: 'quantumai.google/cirq/google/devices, printed diagram; github.com/quantumlib/Cirq known_devices.py', statement: 'Sycamore: 54 qubits and 88 couplers, its printed layout, its two-qubit gates', status: 'served', tool: 'processor' },
  { id: 'quantum-computer', source: 'quantumai.google/quantumcomputer', statement: 'Superconducting hardware, cryogenic environment, Santa Barbara', status: 'served', tool: 'statements' },
  { id: 'what-is-qc', source: 'quantumai.google/whatisqc, PDF', statement: 'What quantum computing is: superposition, interference, the problems expected', status: 'served', tool: 'statements' },
  { id: 'progress-pdf', source: 'services.google.com PDF, progress', statement: 'Progress since 2014, Milestones 1 and 2', status: 'served', tool: 'statements' },
  { id: 'vision-pdf', source: 'services.google.com PDF, vision', statement: 'Classical and quantum computers together', status: 'served', tool: 'statements' },
  { id: 'responsibility-pdf', source: 'services.google.com PDF, responsibilities', statement: 'Honest reporting, RSA risk, post-quantum cryptography, SPHINCS+, collaboration', status: 'served', tool: 'statements' },
  { id: 'coursera', source: 'coursera.org, quantum error correction course', statement: 'An external course', status: 'out_of_scope', reason: 'an external course, not content on quantumai.google' },
  { id: 'videos', source: 'youtube, Willow and Quantum Echoes videos', statement: 'Videos', status: 'out_of_scope', reason: 'video content, not carried by this repository' },
  { id: 'careers', source: 'google.com careers, quantum', statement: 'Careers', status: 'out_of_scope', reason: 'a jobs listing, not technical content' },
]
