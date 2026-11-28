// A page for every product of the catalog: theorem, receipt id, witness variants, kernel entanglements and client MCP tools.
// Built from the harmonized Lean-configured SDK (src/quantum/uuid/programs/sdk/index.ts) so Payload, VitePress and Cloudflare share one source.
import { defineRoutes } from 'vitepress'
import type { CatalogRouteParams } from '../../src/quantum/uuid/programs/sdk/schema/index.ts'

export default defineRoutes({
  async paths() {
    const { sdkProductRoutes } = await import('../../src/quantum/uuid/programs/sdk/index.ts')
    return sdkProductRoutes()
  },
  transformPageData: (pageData) => {
    const params = pageData.params as Partial<CatalogRouteParams> | undefined
    return params?.theorem ? { title: params.theorem, description: params.statement } : undefined
  },
})
