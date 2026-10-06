// Cooled out of index.ts by the heat family (scripts/cool.mjs): qpuPayloadMcpOf, qpuPayloadFindOf, qpuFusionOf, qpuIntelligenceOf.
import {
  coins,
  mintOf,
  n,
  onceOf,
  payloadFinds,
  qpuCernCatalogsHold,
  qpuCernLearnOf,
  qpuCernProjectsOf,
  qpuHostsOf,
  qpuInstallOf,
  qpuPayloadPluginHolds,
  qpuPayloadPluginOf,
  theorem,
  toolNames,
} from './index.js'
import { qpuCircuitOf } from './circuit.js'
import { qpuFacesOf, qpuCapacityOf } from './lattice.js'
import { qpuHologramOf, qpuSchemasOf } from './presentation.js'

/**
 * The Payload MCP the unit describes: collections, find-only tools, the database plugin and its write path.
 * @wing cms
 * @kind builder
 * @evidence qpuPayloadMcpHolds
 */
export const qpuPayloadMcpOf = onceOf(() => {
  const faces = qpuFacesOf()
  const schemas = qpuSchemasOf()
  const plugin = qpuPayloadPluginOf()
  const tools = payloadFinds.map((name, i) => ({
    name,
    collection: name.slice('find'.length).toLowerCase(),
    find: name.startsWith('find'),
    create: name.startsWith('create'),
    update: name.startsWith('update'),
    delete: name.startsWith('delete'),
    sealed: (toolNames as readonly string[]).includes(name),
    face: (i + faces.rays + faces.rays) % faces.faces,
    merge: 'storage' as const}))
  const holds =
    qpuPayloadPluginHolds(plugin) &&
    tools.length === mintOf(coins) &&
    tools.every((row) => row.find && !row.create && !row.update && !row.delete && row.sealed === false && row.merge === 'storage') &&
    schemas.merge === 'storage' &&
    theorem.harmonic(faces.faces, faces.rays)
  return {
    kind: 'payload' as const,
    href: plugin.mcp,
    db: plugin.href,
    plugin,
    path: '/mcp',
    copies: plugin.copies,
    fused: plugin.fused,
    next: plugin.next,
    collections: tools.map((row) => row.collection),
    tools,
    merge: 'storage' as const,
    write: tools.some((row) => row.create || row.update || row.delete),
    morph: tools.every((row) => row.sealed === false),
    holds,
  }
})

/**
 * One Payload collection's find tool, sealed against writes.
 * @wing cms
 * @kind builder
 * @evidence qpuPayloadFindHolds
 */
export const qpuPayloadFindOf = (name: string) => {
  const payload = qpuPayloadMcpOf()
  const plugin = payload.plugin
  const tool = payload.tools.find((row) => row.name === name)
  if (!tool) {
    // grounded: theorem false with theorem only: nothing was supplied, so nothing is computed, and what is not computed is not claimed
    return { kind: 'payload' as const, name, find: name.startsWith('find'), denied: 'tool' as const, holds: false as const }
  }
  const find = name.startsWith('find')
  const create = name.startsWith('create')
  const update = name.startsWith('update')
  const drop = name.startsWith('delete')
  const sealed = (toolNames as readonly string[]).includes(name)
  return {
    kind: 'payload' as const,
    name,
    collection: tool.collection,
    href: `${plugin.href}/${tool.collection}`,
    find,
    write: create || update || drop,
    create,
    update,
    delete: drop,
    sealed,
    copies: plugin.copies,
    fused: plugin.fused,
    merge: tool.merge,
    face: tool.face,
    plugin: plugin.name,
    morph: sealed === false,
    holds: find && !create && !update && !drop && sealed === false,
    docs: payload}
}

/**
 * Fusion of catalogues, hosts, schemas, Payload, install and hologram readings over the fused capacity.
 * @wing cms
 * @kind builder
 * @evidence qpuFusionHolds
 */
export const qpuFusionOf = onceOf(() => {
  const capacity = qpuCapacityOf()
  const learn = qpuCernLearnOf()
  const tetra = qpuCernProjectsOf()
  const hosts = qpuHostsOf()
  const faces = qpuFacesOf()
  const schemas = qpuSchemasOf()
  const payload = qpuPayloadMcpOf()
  const install = qpuInstallOf({ verb: 'ask' })
  const hologram = qpuHologramOf()
  const plugins = {
    n: hologram.pentagram.points}
  const holds =
    capacity.holds &&
    learn.holds &&
    learn.lattice.occupied === faces.faces &&
    learn.lattice.vacant === n - n &&
    qpuCernCatalogsHold(learn.catalogs) &&
    tetra.projects.length === mintOf(coins) &&
    coins + coins === mintOf(coins) &&
    theorem.handle(capacity.fused, capacity.faces, capacity.kv.amplitudes) &&
    theorem.harmonic(faces.faces, faces.rays) &&
    schemas.holds &&
    schemas.merge === 'storage' &&
    payload.holds &&
    install.holds &&
    hosts.holds &&
    hosts.harnesses.length === faces.faces &&
    hosts.llms.length === faces.faces &&
    hologram.holds &&
    hologram.fractal === true 
  return {
    kind: 'fusion' as const,
    theorem: 'fusion' as const,
    catalogs: learn.catalogs,
    tetra: tetra.experiments,
    hosts,
    schemas,
    payload,
    install,
    hologram,
    plugins,
    faces: faces.faces,
    fused: capacity.fused,
    next: capacity.next,
    quantum: hologram.fractal,
    holds,
  }
})

/**
 * The 'intelligence' reading: the fusion test over free online research.
 * @wing cms
 * @kind builder
 * @evidence qpuIntelligenceHolds
 */
export const qpuIntelligenceOf = onceOf(() => {
  const circuit = qpuCircuitOf()
  const fusion = qpuFusionOf()
  const holds = circuit.holds && circuit.only.holds && fusion.holds
  return {
    kind: 'intelligence' as const,
    test: 'fusion' as const,
    research: 'free online' as const,
    fusion,
    fused: fusion.fused,
    next: fusion.next,
    circuit: { holds: circuit.holds },
    holds,
  }
})
