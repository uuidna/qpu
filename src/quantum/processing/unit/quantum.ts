// Cooled out of index.ts by the heat family (scripts/cool.mjs): qpuQuantumOf, qpuQuantumHolds.
import {
  coins,
  cors,
  jsonldHoldsOf,
  mintOf,
  n,
  onceOf,
  qpuCapacityHolds,
  qpuCapacityOf,
  qpuContextOf,
  qpuCssHolds,
  qpuCssOf,
  qpuCubeOf,
  qpuDesignHolds,
  qpuDesignOf,
  qpuEvidenceHolds,
  qpuEvidenceOf,
  qpuFacesOf,
  qpuGenesisHolds,
  qpuGenesisOf,
  qpuGlossaryOf,
  qpuHandleOf,
  qpuNeuroHolds,
  qpuNeuroOf,
  qpuPurposeHolds,
  qpuPurposeOf,
  qpuSequenceHolds,
  qpuSequenceOf,
  qpuShorHolds,
  qpuShorOf,
  qpuSpeedHolds,
  qpuSpeedOf,
  schemaOrg,
  seed,
  unit,
} from './index.js'
import { qpuCircuitOf, qpuCircuitHolds } from './circuit.js'
import { qpuDocsOf, qpuDocsHolds } from './readme.js'
import { embeddedConstants } from './embedded.js'

/**
 * The quantum document: circuit, lattice, Shor run, sequence, purpose, evidence, network and design readings in one JSON-LD document.
 * @wing quantum
 * @kind builder
 * @evidence qpuQuantumHolds
 */
/** Runtime reads the drift-checked embed so a cold isolate never JIT-compiles qpuQuantumLiveOf; falls back to live.
 *  The gate recomputes live at push via qpuQuantumLiveOf (embed-lean regenerates + the drift-guard asserts equality). */
export const qpuQuantumOf = onceOf((): ReturnType<typeof qpuQuantumLiveOf> => (embeddedConstants.quantum as ReturnType<typeof qpuQuantumLiveOf> | undefined) ?? qpuQuantumLiveOf())
export const qpuQuantumLiveOf = onceOf(() => {
  const cube = qpuCubeOf()
  const handle = qpuHandleOf()
  const faces = qpuFacesOf()
  const fused = faces.faces * handle.kv.amplitudes
  const docs = qpuDocsOf()
  const capacity = qpuCapacityOf()
  const speed = qpuSpeedOf()
  const circuit = qpuCircuitOf()
  const shor = qpuShorOf()
  const sequence = qpuSequenceOf()
  const neuro = qpuNeuroOf()
  const design = qpuDesignOf()
  const genesis = qpuGenesisOf()
  const css = qpuCssOf('', genesis)
  const purpose = qpuPurposeOf(circuit, shor, sequence, capacity)
  const evidence = qpuEvidenceOf(circuit, shor)
  const holds =
    unit.holds &&
    cube.holds &&
    handle.holds &&
    faces.holds &&
    docs.holds &&
    capacity.holds &&
    speed.holds &&
    circuit.holds &&
    qpuShorHolds(shor) &&
    sequence.holds &&
    purpose.holds &&
    evidence.holds &&
    neuro.holds &&
    design.holds &&
    qpuGenesisHolds(genesis) &&
    qpuCssHolds(css) &&
    fused === faces.faces * mintOf(cube.bits + seed) &&
    fused === faces.faces * mintOf(cube.vertices * cube.hexbit + seed) &&
    mintOf(cube.hexbit) === mintOf(n + seed) &&
    mintOf(cube.hexbit) > seed &&
    mintOf(cube.bits + seed) === handle.amplitudes + handle.amplitudes &&
    faces.faces * mintOf(cube.bits + coins) === fused + fused
  return {
    '@context': qpuContextOf(),
    '@type': 'SoftwareApplication' as const,
    '@id': unit.origin,
    kind: 'quantum' as const,
    only: circuit.only,
    lattice: circuit.lattice,
    circuit,
    shor,
    sequence,
    purpose,
    evidence,
    neuro,
    design,
    genesis,
    css,
    host: unit.host,
    href: unit.href,
    cube,
    handle,
    faces,
    fused,
    next: fused + fused,
    capacity,
    speed,
    messaging: {
      when: 'never' as const,
      href: `${unit.origin}/message`,
      lanes: faces.faces,
      hop: 'involution' as const,
      clock_seq: faces.faces,
      await: 'never' !== 'never',
      proxy: cors === '*',
      secure: unit.origin.startsWith('https')},
    docs,
    glossary: qpuGlossaryOf(),
    ui: {
      prove: 'prove' as const,
      href: `${unit.origin}/mcp`},
    cors,
    public: cors === '*',
    auth: cors !== '*',
    isAccessibleForFree: cors === '*',
    url: unit.origin,
    name: `@uuidna/${unit.kind}`,
    holds,
  }
})

export const qpuQuantumHolds = (q = qpuQuantumOf()): boolean =>
  q.holds === true &&
  q.kind === 'quantum' &&
  q.only.holds === true &&
  q.lattice.holds === true &&
  q.lattice.occupied === q.faces.faces &&
  q.lattice.vacant === n - n &&
  q.host === unit.host &&
  q.cors === cors &&
  q.ui.prove === 'prove' &&
  qpuDocsHolds(q.docs) &&
  qpuCapacityHolds(q.capacity) &&
  qpuSpeedHolds(q.speed) &&
  qpuCircuitHolds(q.circuit) &&
  qpuShorHolds(q.shor) &&
  q.shor.factors.p * q.shor.factors.q === q.shor.n &&
  q.shor.rsa.kind === 'rsa' &&
  q.shor.rsa.factored === true &&
  q.shor.rsa.p * q.shor.rsa.q === q.shor.n &&
  qpuSequenceHolds(q.sequence) &&
  qpuPurposeHolds(q.purpose) &&
  qpuEvidenceHolds(q.evidence) &&
  qpuNeuroHolds(q.neuro) &&
  qpuDesignHolds(q.design) &&
  qpuGenesisHolds(q.genesis) &&
  qpuCssHolds(q.css) &&
  q.css.keyframes === seed &&
  q.neuro.test.holds === true &&
  q.sequence.rungs.length === mintOf(n) &&
  q.sequence.rungs[n - n]!.tool === 'quantum' &&
  q.sequence.rungs[mintOf(n) - seed]!.path === '/server' &&
  q.sequence.climb[mintOf(coins) - seed] === 'prove' &&
  q.messaging.when === 'never' &&
  q.messaging.lanes === q.faces.faces &&
  q.messaging.hop === 'involution' &&
  q.messaging.clock_seq === q.faces.faces &&
  q['@context'][n - n] === schemaOrg &&
  q['@type'] === 'SoftwareApplication' &&
  q['@id'] === unit.origin &&
  q.isAccessibleForFree === (cors === '*') &&
  q.url === unit.origin &&
  jsonldHoldsOf(q)
