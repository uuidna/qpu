// A game seed as Unreal Engine reads it: glTF 2.0, the six Khronos extensions its exporter implements.
// The seed is the asset. This file does not play a game.

const EXTENSIONS = ['KHR_lights_punctual', 'KHR_materials_unlit', 'KHR_materials_clearcoat', 'KHR_materials_variants', 'KHR_mesh_quantization', 'KHR_texture_transform'] as const

const asset = (name: string) => ({
  asset: { version: '2.0' as const, generator: 'qpu' },
  scenes: [{ nodes: [0] }],
  nodes: [{ name, mesh: 0 }],
  meshes: [{ primitives: [] as [] }],
  extensionsUsed: [] as string[],
  extensionsRequired: [] as string[],
})

const loadable = (doc: { asset?: { version?: string }; extensionsRequired?: readonly string[] }) => {
  const required = doc.extensionsRequired ?? []
  const missing = required.filter((name) => !EXTENSIONS.includes(name as (typeof EXTENSIONS)[number]))
  return { version: doc.asset?.version ?? null, loadable: doc.asset?.version === '2.0' && missing.length === 0, missing, theorem: 'textbook_gltf_required_extensions' as const }
}

const unreal = { EXTENSIONS, asset, loadable }

export { EXTENSIONS, asset, loadable }
export default unreal
