#!/usr/bin/env node
/**
 * index.lean, split once into modules named for their formula family (src/quantum/processing/unit/lean/Qpu/<Family>.lean).
 * After the split the modules are the source; scripts/lean-bundle.mjs writes index.lean back from them.
 */
import fs from 'node:fs'
export const FAMILIES = [
  ['Mint', [], 'Doubling: mintOf k = 2^k, binomials, and the laws that make a sum inside the doubling a product outside it.', ['mintOf', 'chooseOf', 'mintOf_zero', 'mintOf_succ', 'mintOf_add', 'multiply']],
  ['Shor', [], 'Modular exponentiation, period finding by fuel recursion, gcd, and Shor on 91.', ['powModAux', 'powMod', 'periodAux', 'periodOf', 'gcdAux', 'gcdOf', 'half', 'shor', 'all_shor']],
  ['Lattice', ['Mint'], 'The register geometry: n, seed, coins, rays, vertices, hexbit, bits, faces, amplitudes, fused, plane, and every identity between them.',
    ['n', 'seed', 'coins', 'scanner', 'radar', 'rays', 'vertices', 'hexbit', 'bits', 'faces', 'amplitudes', 'fused', 'plane', 'seed_eq', 'coins_two', 'n_eq', 'mint', 'cube', 'around', 'quantum', 'harmonic', 'cluster', 'hexbit_eq', 'mintOf_ge_seed', 'mintOf_pos', 'mintOf_lt_succ', 'mintOf_lt', 'hexbit_pos', 'energy', 'propulsion', 'crypto', 'health', 'next', 'next_fused', 'split_coin', 'handle', 'kv', 'light', 'involution', 'waves', 'breakthrough', 'next_cover', 'integrity', 'infinite', 'distribute', 'raid', 'fill', 'planes', 'tetra', 'qubits', 'measurement']],
  ['Circuit', ['Lattice'], 'The running circuit on exact amplitudes: gates, noise, Bell, GHZ, no-clone, teleport, kickback, Deutsch, superdense, monogamy.',
    ['gates', 'noise', 'circuit', 'physical', 'drift', 'sciences', 'interfere', 'entangle', 'ghz', 'noclone', 'teleport', 'kickback', 'deutsch', 'dense', 'monogamy', 'only', 'computer', 'server', 'design', 'neuro', 'all_entangle', 'all_noclone']],
  ['Hybrid', ['Lattice'], 'Hybrid storage: KV and R2 cost and speed, and their sums.', ['kvCost', 'r2Cost', 'hybridCost', 'kvSpeed', 'r2Speed', 'hybridSpeed', 'hybrid_cost', 'hybrid_speed', 'hybrid']],
  ['Coil', ['Lattice'], 'Theory, practice and the coil: two coins make a coil, one plus six, clay, fusion.', ['theory', 'practice', 'coil', 'follow_the_coins', 'two_coins_make_a_coil', 'electronics', 'coil_efficiency', 'next_coil', 'one_plus_six', 'two_x_seven_coins', 'clay', 'fusion']],
  ['Physics', [], 'Planck and Boltzmann (SI exact digits), transmon temperature, BCS gaps of aluminium and niobium, cooling.', ['planck', 'boltzmann', 'transmon', 'photon', 'thermal', 'bcs', 'aluminium', 'niobium', 'gap', 'temperature', 'superconductivity', 'cooling_stays_positive', 'cooling_strictly_decreases']],
  ['Cern', [], 'CMS Open Data record integers (events = files x q + r).', ['cern']],
  ['Fuse', [], 'The fused API registry: qubits, composing pairs, specificity buckets, cut entanglement within bounds.', ['fuse']],
  ['Cross', ['Lattice', 'Coil'], 'Cross forms: every quantity stated as a sum of like terms and as a product of unlike ones, and the bridges between.',
    ['double_is_sum', 'coins_bridges_forms', 'faces_multiplicative', 'faces_additive', 'faces_both_forms', 'bits_multiplicative', 'bits_exponential', 'bits_both_forms', 'amplitudes_as_sum', 'amplitudes_from_sum', 'fused_multiplicative_form', 'fused_additive_form', 'fused_both_directions', 'all_product', 'all_sum', 'all_complete']],
  ['Primes', ['Mint', 'Lattice'], 'The primes the register geometry exhibits — Mersenne, the Shor factorization, twin primes, primorial — the number-theory ingredients the clay family reads.',
    ['prime_two', 'prime_three', 'mersenne_3', 'mersenne_7', 'mersenne_31', 'mersenne_127', 'shor_factored', 'shor_modulus_binomial', 'twin_lower', 'twin_upper', 'twin_gap', 'primorial_210', 'primes_all']],
  ['Pi', ['Mint', 'Lattice'], 'π as exact rational convergents over the lattice constants — the floor and the classical best approximations, the analytic ingredients the clay family reads.',
    ['pi_floor', 'pi_archimedes_num', 'pi_archimedes_den', 'pi_zu_num', 'pi_zu_den', 'pi_turn_degrees', 'pi_half_turn', 'pi_all']],
  // discovered, not split: written by scripts/lean-clay.mjs
  ['Clay', ['Mint', 'Shor', 'Lattice', 'Hybrid', 'Coil', 'Physics'], 'Discovered equalities joining the wings and the formula families.', []],
]
if (process.argv[1].endsWith('lean-split.mjs')) {
  const src = fs.readFileSync('src/quantum/processing/unit/index.lean', 'utf8').split('\n')
  // blocks: a declaration with its continuation lines, plus the comment lines directly above it
  const blocks = []
  let pending = []
  for (let i = 0; i < src.length; i++) {
    const m = /^(def|theorem) (\w+)/.exec(src[i])
    if (!m) { if (src[i].trim()) pending.push(src[i]); else pending = []; continue }
    let j = i + 1
    while (j < src.length && src[j].trim() !== '' && !/^(def|theorem|--|\/-)/.test(src[j])) j++
    blocks.push({ name: m[2], text: [...pending, ...src.slice(i, j)].join('\n') })
    pending = []
    i = j - 1
  }
  const owner = new Map(FAMILIES.flatMap(([f, , , names]) => names.map((nm) => [nm, f])))
  const missing = blocks.filter((b) => !owner.has(b.name)).map((b) => b.name)
  if (missing.length) { console.error('unassigned:', missing.join(' ')); process.exit(1) }
  fs.mkdirSync('src/quantum/processing/unit/lean/Qpu', { recursive: true })
  for (const [fam, imports, about] of FAMILIES) {
    const body = blocks.filter((b) => owner.get(b.name) === fam).map((b) => b.text).join('\n')
    fs.writeFileSync(`src/quantum/processing/unit/lean/Qpu/${fam}.lean`, [...imports.map((x) => `import Qpu.${x}`), ...(imports.length ? [''] : []), `/-! # Qpu.${fam}\n${about} -/`, '', body, ''].join('\n'))
  }
  fs.writeFileSync('src/quantum/processing/unit/lean/Qpu.lean', FAMILIES.map(([f]) => `import Qpu.${f}`).join('\n') + '\n')
  console.log(JSON.stringify({ blocks: blocks.length, families: FAMILIES.map(([f, , , ns]) => `${f}:${ns.length}`) }))
}
