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
  { id: 'echoes-protocol', source: 'blog.google, Quantum Echoes', statement: 'forward, perturb, backward, measure', status: 'served', tool: 'echo' },
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
  { id: 'qvm', source: 'quantumai.google/cirq/simulate/quantum_virtual_machine', statement: 'Virtual processor: a device with noise, and the Willow noise data', status: 'partial', tool: 'circuit', reason: 'the device and noise are served; the Willow noise data is public but is not in this repository, so noise comes from the caller' },
  { id: 'textbook-algorithms', source: 'quantumai.google/cirq/experiments/textbook_algorithms', statement: 'Teleportation, QFT and its inverse, phase estimation, Grover on two qubits', status: 'served', tool: 'algorithm' },
  { id: 'qaoa', source: 'quantumai.google/cirq/experiments/qaoa/qaoa_maxcut', statement: 'QAOA max-cut at p = 1 on the device connectivity', status: 'partial', tool: 'algorithm', reason: 'the circuit and the expected cut are served; the page uses random weights and a grid sweep that this repository does not reproduce' },
  { id: 'shor', source: 'quantumai.google/cirq/experiments/textbook_algorithms', statement: 'Shor\'s algorithm, mentioned as a later use of phase estimation', status: 'blocked', reason: 'the page names Shor\'s algorithm but gives no implementation' },
  { id: 'qsim', source: 'quantumai.google/qsim', statement: 'qsim, a separate simulator library', status: 'out_of_scope', reason: 'a separate library; this repository serves the wave-function part through the circuit tool' },
  { id: 'research', source: 'quantumai.google/research', statement: 'Research publications', status: 'blocked', reason: 'the fetched page had navigation only; no list of publications' },
  { id: 'echoes-nature', source: 'nature.com, s41586-025-09526-6', statement: 'Quantum Echoes paper', status: 'blocked', reason: 'the link redirects to a sign-in page, which was not followed' },
  { id: 'willow-nature', source: 'nature.com, Willow error correction paper', statement: 'Willow error correction paper', status: 'blocked', reason: 'linked from the homepage, not read' },
  { id: 'learn-map', source: 'quantumai.google/learn/map', statement: 'Our quantum computing journey', status: 'blocked', reason: 'the fetched page had only a title' },
  { id: 'lab', source: 'quantumai.google/learn/lab', statement: 'Discover the Quantum AI campus', status: 'blocked', reason: 'the fetched page had only a title' },
  { id: 'sycamore', source: 'quantumai.google/cirq/hardware/devices', statement: 'Sycamore: 54 qubits and 88 edges', status: 'blocked', reason: 'the page gives the Sycamore metadata only in printed output, not a layout to build' },
  { id: 'quantum-computer', source: 'quantumai.google/quantumcomputer', statement: 'Superconducting hardware, cryogenic environment, Santa Barbara', status: 'served', tool: 'statements' },
  { id: 'what-is-qc', source: 'quantumai.google/whatisqc, PDF', statement: 'What quantum computing is: superposition, interference, the problems expected', status: 'served', tool: 'statements' },
  { id: 'progress-pdf', source: 'services.google.com PDF, progress', statement: 'Progress since 2014, Milestones 1 and 2', status: 'served', tool: 'statements' },
  { id: 'vision-pdf', source: 'services.google.com PDF, vision', statement: 'Classical and quantum computers together', status: 'served', tool: 'statements' },
  { id: 'responsibility-pdf', source: 'services.google.com PDF, responsibilities', statement: 'Honest reporting, RSA risk, post-quantum cryptography, SPHINCS+, collaboration', status: 'served', tool: 'statements' },
  { id: 'coursera', source: 'coursera.org, quantum error correction course', statement: 'An external course', status: 'out_of_scope', reason: 'an external course, not content on quantumai.google' },
  { id: 'videos', source: 'youtube, Willow and Quantum Echoes videos', statement: 'Videos', status: 'out_of_scope', reason: 'video content, not carried by this repository' },
  { id: 'careers', source: 'google.com careers, quantum', statement: 'Careers', status: 'out_of_scope', reason: 'a jobs listing, not technical content' },
]
