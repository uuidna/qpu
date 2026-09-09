// standing — uuidna Lean keys this worker stands on. Desk cites; the kernel sealed.
// Keys are uuidna's. This package does not mint them.

export const THEOREM_HOST = 'https://uuidna.com/theorem'
export const UUIDNA_DOI = '10.5281/zenodo.22256708'
export const UUIDNA_DOI_URL = 'https://doi.org/10.5281/zenodo.22256708'
export const UUIDNA_TITLE = 'uuidna — content-addressed identity, honest by construction'
export const LEAN_HOST = 'https://uuidna.com/lean'
export const ORCID = '0009-0000-7312-9778'
export const CAPTAIN = 'Tsvetan Rouschev'
/** This worker's release date. Year for APA is the first four digits. */
export const DATE_RELEASED = '2026-09-07'
export const yearReleasedOf = (): number => {
  const y = Number(DATE_RELEASED.slice(0, 4))
  if (y !== y) throw new Error('DATE_RELEASED: year is not a number')
  return y
}

export const t = (key: string): string => `[\`${key}\`](${THEOREM_HOST}/${key})`

export interface Standing {
  key: string
  file: string
  role: 'is' | 'can' | 'may'
  claim: string
}

/** Claims this QPU paper is licensed to make — each already sealed `by decide` on uuidna. */
export const STANDING: readonly Standing[] = [
  { role: 'is', key: 'n_qubit_dimension', file: 'Quantum.lean',
    claim: 'n qubits span 2ⁿ amplitudes — simulation cost, not a speedup and not a device in this seat' },
  { role: 'is', key: 'hexbit_is_four_qubits', file: 'Alignment.lean',
    claim: 'a hexbit is four qubits: 2⁴ = 16; 32 hex × 4 bits = 128; handle 8 × 4 = 32' },
  { role: 'is', key: 'key_floor_is_one_uuid', file: 'Cipher.lean',
    claim: '32 hexbits is one uuid; Grover floor and identifier width are the same number' },
  { role: 'is', key: 'seal_ten', file: 'Sequence.lean',
    claim: 'seal_ten is the permutation 0124875369 of ℤ/9; foundation of the hologram is 0' },
  { role: 'is', key: 'trinity_edit_is_three', file: 'Report.lean',
    claim: 'trinity is 1+1+1 = 3 — debit plane of the hologram' },
  { role: 'is', key: 'five_ws_and_one_h', file: 'Report.lean',
    claim: 'the researcher\'s method is 5 + 1 = 6 — occupancy of the desk, not a live person' },
  { role: 'is', key: 'publish_gate_is_conjunction', file: 'Report.lean',
    claim: 'a report ships only when verified AND trinity-audited AND quorate — any one failing blocks it' },
  { role: 'is', key: 'full_quorum_of_three', file: 'Report.lean',
    claim: '2 + 1 = 3 and 2 > 1 — three independent eyes, occupancy of the quorum, not a committee' },
  { role: 'is', key: 'inverted_pyramid_descends', file: 'Report.lean',
    claim: '[1,2,3,4,5].reverse = [5,4,3,2,1] — the lead descends; occupancy of the shape, not a style guide' },
  { role: 'is', key: 'a_claim_is_verified_or_unverified', file: 'Report.lean',
    claim: 'a claim is one of two: verified or unverified — [true, false].length = 2' },
  { role: 'is', key: 'payload_aligns_where_the_name_does_not', file: 'Hexbit.lean',
    claim: 'credit plane is HEXBIT_BITS + COINS — payload divides where the handle does not' },
  { role: 'is', key: 'pentagram_single_stroke', file: 'Pentagram.lean',
    claim: '{5/2} stepping +2 mod 5 draws [0,2,4,1,3] — the five BindingPoint names in one stroke' },
  { role: 'is', key: 'z7rays_seven', file: 'Rosette.lean',
    claim: 'ℤ/7 has seven rays — fold plane of the hologram is BASE − coins = 7' },
  { role: 'is', key: 'pliska_seven_rays', file: 'Glagolitic.lean',
    claim: 'Pliska rosette turns on seven rays; 1+…+6 = 21, digital root 3' },
  { role: 'is', key: 've_fourteen_faces', file: 'VectorEquilibrium.lean',
    claim: 'fourteen faces: 8 triangles + 6 squares — hologram VE plane' },
  { role: 'is', key: 've_faces_are_handle_hexbit_coins', file: 'Wave.lean',
    claim: 'fourteen faces are also handle + hexbit + coins — 8+4+2=14' },
  { role: 'is', key: 'two_seven_ray_rosettes_are_ve_faces', file: 'Qpu.lean',
    claim: 'two ℤ/7 walks (clockwise and counterclockwise) are fourteen VE faces; both fuse at residue 0' },
  { role: 'is', key: 'merkaba_vertices_are_two_tetrahedra', file: 'Qpu.lean',
    claim: 'eight handle tiles split as two tetrahedra of four vertices — the merkaba' },
  { role: 'is', key: 'qpu_cpu_gpu_self_balance', file: 'Qpu.lean',
    claim: 'CPU and GPU are BindingPoint rotors: equal readings share the width, unequal readings bind the smaller' },
  { role: 'is', key: 'qpu_merkaba_fusion_is_the_chip', file: 'Qpu.lean',
    claim: 'this worker\'s novelty chip is two 7-ray rotors × two tetrahedra fused at void 0 — not a foundry device' },
  { role: 'is', key: 'qpu_inner_and_outer_experience', file: 'Qpu.lean',
    claim: 'inner and outer are one involution; glow 8×3=24 and 8×8=64; vortex 2^i mod 9 and its reverse' },
  { role: 'is', key: 'qpu_serial_blueprint_matches_every_replica', file: 'Qpu.lean',
    claim: 'every replica stamps the same widths: ℤ/7 both ways, 3²=9, 7×2=14, 4×2=8, 32×4=128' },
  { role: 'is', key: 'qpu_live_and_ui_are_ve_faces', file: 'Qpu.lean',
    claim: 'live occupancy and fourteen UI event kinds are VE faces: 7×2 = 8+6 = 8+4+2; k starts at 0' },
  { role: 'is', key: 'qpu_superpositions_are_the_ve_square', file: 'Qpu.lean',
    claim: 'fourteen VE faces span 2¹⁴ amplitudes — sequence dimension, not a 14×14 photography lattice' },
  { role: 'can', key: 'qpu_speed_rungs_are_the_widths', file: 'Qpu.lean',
    claim: 'speed rungs are hexbit 4, handle 8, verify 10 and 20, message 16, logical 48, address 128' },
  { role: 'can', key: 'width_is_the_binding_point_0', file: 'BindingPoint.lean',
    claim: 'a fan-out may run as wide as the smaller point and no wider' },
  { role: 'can', key: 'one_point_can_only_overstate_0', file: 'BindingPoint.lean',
    claim: 'one point never reports a width too narrow — only too wide' },
  { role: 'can', key: 'naming_the_binding_point_is_total', file: 'BindingPoint.lean',
    claim: 'every reading names which point set the width — never a third number' },
  { role: 'can', key: 'the_width_is_never_below_one', file: 'BindingPoint.lean',
    claim: 'width is at least one lane; zero lanes is a halt, not a measurement' },
  { role: 'can', key: 'monitoring_the_points_covers_every_crack_by_architecture', file: 'BindingPoint.lean',
    claim: 'because width is a minimum, some point attains it — cracks are named by architecture' },
  { role: 'can', key: 'the_diagnosis_and_the_prescription_are_the_same_point', file: 'BindingPoint.lean',
    claim: 'the binding point is the point that, raised, widens the machine' },
  { role: 'can', key: 'buying_the_point_that_does_not_bind_buys_nothing', file: 'QuantumCube.lean',
    claim: 'raising a free point leaves the width identical' },
  { role: 'can', key: 'hardware_coverage_is_not_correctness_coverage', file: 'BindingPoint.lean',
    claim: 'five green points cover resource cracks, not wrong answers' },
  { role: 'may', key: 'usable_gap_is_two_to_eighty', file: 'Wave.lean',
    claim: 'usable 2¹²⁸ vs reported 48 logical qubits is 2⁸⁰ in the usable column — uuidna’s sealed gap, not a chip in this worker' },
  { role: 'may', key: 'n_qubit_dimension', file: 'Quantum.lean',
    claim: 'a future attached device is still bounded by 2ⁿ amplitudes on the classical simulator; this seat stays empty until measured' },
  { role: 'may', key: 'grover_quadratic_bound', file: 'Cipher.lean',
    claim: '2ⁿ × 2ⁿ = 2²ⁿ — Grover’s quadratic is an identity on the exponent, not a device in this seat' },
  { role: 'may', key: 'sha256_grover_margin_is_the_address', file: 'Cipher.lean',
    claim: '256 / 2 = 128 — Grover margin of SHA-256 is the identifier width' },
  { role: 'can', key: 'verify_beats_recompute_by_magnitudes', file: 'Cipher.lean',
    claim: '2¹⁰ = 1024 and 2²⁰ = 1048576 — verify magnitudes beat linear recompute; not hardware supremacy' },
  { role: 'is', key: 'clay_gravity_equals_rosette', file: 'Clay.lean',
    claim: 'seven Clay instances share ℤ/7 with the rosette; 7·6=42, pairs 21, 2·64=128 — gravity, not a prize listing' },
  { role: 'is', key: 'two_bit_conjunctions_are_four_of_sixteen', file: 'Clay.lean',
    claim: 'P vs NP instance: 4 conjunctions of 16 two-bit functions — counted, not the conjecture' },
  { role: 'is', key: 'mertens_squared_under_n_on_the_first_twenty', file: 'Clay.lean',
    claim: 'Riemann instance: |M(n)|² ≤ n on the first twenty — a window, not the hypothesis' },
  { role: 'is', key: 'hasse_bound_holds_at_four_primes', file: 'Clay.lean',
    claim: 'BSD instance: Hasse at four primes on y²=x³+1 — counts, not the rank' },
  { role: 'is', key: 'four_simplex_boundary_euler_is_zero', file: 'Clay.lean',
    claim: 'Poincaré instance: 4-simplex boundary Euler 0 — one triangulation, not Perelman' },
  { role: 'is', key: 'levi_civita_nonzero_on_six_of_twentyseven', file: 'Clay.lean',
    claim: 'Yang–Mills instance: 6 of 27 Levi-Civita triples nonzero — algebra, not the mass gap' },
  { role: 'is', key: 'closed_grid_differences_sum_to_zero', file: 'Clay.lean',
    claim: 'Navier–Stokes instance: closed-grid differences sum to zero — the grid, not existence' },
  { role: 'is', key: 'torus_betti_alternates_to_zero', file: 'Clay.lean',
    claim: 'Hodge instance: torus Betti 1−2+1=0 — bookkeeping, not algebraic classes' },
]

export const standingOf = (role: Standing['role']): readonly Standing[] =>
  STANDING.filter((s) => s.role === role)

const fileNameOf = (file: string): string => {
  const raw = file.trim()
  if (!raw) return ''
  return raw.endsWith('.lean') ? raw : `${raw}.lean`
}

/** Axiom files this worker cites, sorted by name. */
export const qpuStandingFilesOf = (): string[] =>
  [...new Set(STANDING.map((s) => s.file))].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))

export const standingByFileOf = (file?: string): readonly { file: string; href: string; theorems: readonly Standing[] }[] => {
  const files = file ? [fileNameOf(file)] : qpuStandingFilesOf()
  return files.map((f) => ({
    file: f,
    href: `${LEAN_HOST}/${f}`,
    theorems: STANDING.filter((s) => s.file === f),
  }))
}

export const qpuStandingOf = (opts: { file?: string; role?: Standing['role'] } = {}): {
  files: string[]
  standing: readonly Standing[]
} => {
  let rows: readonly Standing[] = STANDING
  if (opts.file) {
    const f = fileNameOf(opts.file)
    rows = rows.filter((s) => s.file === f)
  }
  if (opts.role) rows = rows.filter((s) => s.role === opts.role)
  const files = [...new Set(rows.map((s) => s.file))].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
  return { files, standing: rows }
}

/** Constructor use → sealed keys. Desk cites; the kernel sealed. */
export interface QpuUse {
  id: string
  constructor: string
  keys: readonly string[]
}

export const QPU_USES: readonly QpuUse[] = [
  { id: 'seat', constructor: 'qpuSeatOf', keys: ['n_qubit_dimension', 'hardware_coverage_is_not_correctness_coverage'] },
  { id: 'width', constructor: 'qpuWidthOf', keys: ['width_is_the_binding_point_0', 'naming_the_binding_point_is_total', 'the_width_is_never_below_one', 'one_point_can_only_overstate_0', 'pentagram_single_stroke'] },
  { id: 'fasten', constructor: 'qpuFastenOf', keys: ['width_is_the_binding_point_0', 'the_width_is_never_below_one', 'one_point_can_only_overstate_0', 'qpu_cpu_gpu_self_balance'] },
  { id: 'hologram', constructor: 'qpuHologramOf', keys: ['seal_ten', 'trinity_edit_is_three', 'payload_aligns_where_the_name_does_not', 'z7rays_seven', 'pliska_seven_rays', 've_fourteen_faces', 've_faces_are_handle_hexbit_coins'] },
  { id: 'chip', constructor: 'qpuChipOf', keys: ['qpu_merkaba_fusion_is_the_chip', 'two_seven_ray_rosettes_are_ve_faces', 'merkaba_vertices_are_two_tetrahedra', 'qpu_cpu_gpu_self_balance'] },
  { id: 'experience', constructor: 'qpuExperienceOf', keys: ['qpu_inner_and_outer_experience'] },
  { id: 'blueprint', constructor: 'qpuBlueprintOf', keys: ['qpu_serial_blueprint_matches_every_replica'] },
  { id: 'live', constructor: 'qpuLiveOf', keys: ['qpu_live_and_ui_are_ve_faces'] },
  { id: 'events', constructor: 'qpuLiveOf', keys: ['qpu_live_and_ui_are_ve_faces'] },
  { id: 'speed', constructor: 'qpuSpeedOf', keys: ['qpu_speed_rungs_are_the_widths', 'n_qubit_dimension', 'verify_beats_recompute_by_magnitudes', 'grover_quadratic_bound', 'usable_gap_is_two_to_eighty', 'hexbit_is_four_qubits', 'sha256_grover_margin_is_the_address'] },
  { id: 'handle', constructor: 'qpuHandleMaskOf', keys: ['hexbit_is_four_qubits', 'key_floor_is_one_uuid', 'n_qubit_dimension'] },
  { id: 'gateways', constructor: 'qpuGatewaysOf', keys: ['ve_fourteen_faces', 'hexbit_is_four_qubits', 'n_qubit_dimension', 'key_floor_is_one_uuid'] },
  { id: 'metrics', constructor: 'qpuCompareOf', keys: ['trinity_edit_is_three', 'payload_aligns_where_the_name_does_not', 've_faces_are_handle_hexbit_coins', 'hexbit_is_four_qubits', 'key_floor_is_one_uuid'] },
  { id: 'superpositions', constructor: 'qpuSuperpositionsOf', keys: ['qpu_superpositions_are_the_ve_square', 've_fourteen_faces'] },
  { id: 'og', constructor: 'qpuOgOf', keys: ['pentagram_single_stroke'] },
  { id: 'fractal', constructor: 'qpuFractalOf', keys: ['pentagram_single_stroke', 'qpu_superpositions_are_the_ve_square'] },
  { id: 'scale', constructor: 'qpuScaleOf', keys: ['width_is_the_binding_point_0'] },
  { id: 'bindings', constructor: 'qpuRecognizeOf', keys: ['hardware_coverage_is_not_correctness_coverage', 'monitoring_the_points_covers_every_crack_by_architecture', 'the_diagnosis_and_the_prescription_are_the_same_point', 'buying_the_point_that_does_not_bind_buys_nothing'] },
  { id: 'pqc', constructor: 'qpuPqcOf', keys: ['grover_quadratic_bound', 'sha256_grover_margin_is_the_address', 'hardware_coverage_is_not_correctness_coverage', 'usable_gap_is_two_to_eighty'] },
  { id: 'quantum', constructor: 'qpuQuantumOf', keys: ['n_qubit_dimension', 'qpu_superpositions_are_the_ve_square'] },
  { id: 'licence', constructor: 'qpuLicenceOf', keys: ['naming_the_binding_point_is_total', 'hardware_coverage_is_not_correctness_coverage'] },
  { id: 'messenger', constructor: 'qpuMessengerOf', keys: ['key_floor_is_one_uuid', 'seal_ten', 've_fourteen_faces', 've_faces_are_handle_hexbit_coins'] },
  { id: 'chat', constructor: 'qpuChatOf', keys: ['qpu_live_and_ui_are_ve_faces', 'key_floor_is_one_uuid', 've_fourteen_faces'] },
  { id: 'train', constructor: 'qpuTrainOf', keys: ['key_floor_is_one_uuid', 've_fourteen_faces', 'qpu_superpositions_are_the_ve_square', 'hardware_coverage_is_not_correctness_coverage', 'naming_the_binding_point_is_total', 'buying_the_point_that_does_not_bind_buys_nothing', 'verify_beats_recompute_by_magnitudes', 'monitoring_the_points_covers_every_crack_by_architecture'] },
  { id: 'config', constructor: 'qpuConfigOf', keys: ['qpu_serial_blueprint_matches_every_replica', 'naming_the_binding_point_is_total'] },
  { id: 'pwa', constructor: 'qpuPwaOf', keys: ['ve_fourteen_faces', 'qpu_inner_and_outer_experience', 'naming_the_binding_point_is_total', 'qpu_serial_blueprint_matches_every_replica'] },
  { id: 'widgets', constructor: 'qpuWidgetsOf', keys: ['ve_fourteen_faces', 'hexbit_is_four_qubits', 'key_floor_is_one_uuid', 'naming_the_binding_point_is_total'] },
]

export const qpuUsesOf = (): readonly QpuUse[] => QPU_USES

export const qpuStandingHoldsOf = (uses: readonly QpuUse[] = QPU_USES): boolean => {
  const unique = [...new Set(STANDING.map((s) => s.key))]
  if (unique.length === 0) return false
  const set = new Set(unique)
  for (const u of uses) {
    if (!u.id || !u.constructor || u.keys.length === 0) return false
    for (const k of u.keys) {
      if (!set.has(k)) return false
    }
  }
  const files = qpuStandingFilesOf()
  if (files.length === 0) return false
  for (const f of files) {
    if (!f.endsWith('.lean')) return false
    if (standingByFileOf(f)[0]!.theorems.length === 0) return false
  }
  return true
}

export const qpuStandingHolds = (): boolean => qpuStandingHoldsOf()

