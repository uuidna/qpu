// The seed waves, once: the games, the ISO waves and the MCP pages. Payload writes them (seedRecords.ts) and the
// VitePress site renders them (site.ts), so the two sites carry the same pages.
import { seeds } from '../engine/index.ts'
import { mcpPages, seedWaves } from './index.ts'
import { mcpHostList } from '../processing/discovery.ts'
import { TOOLBOXES } from '../processing/mcp.ts'

export const allSeedWaves = () => {
  const mcp = mcpPages(TOOLBOXES.flatMap((box) => box.tools.map((tool) => ({ name: tool.name, toolbox: box.name, description: tool.description }))), mcpHostList())
  return [
    { name: 'games', pages: seeds().map((seed) => seed.page) },
    ...seedWaves().map((wave) => ({ name: wave.name, pages: [...wave.pages] })),
    { name: mcp.name, pages: [...mcp.pages] },
  ]
}
