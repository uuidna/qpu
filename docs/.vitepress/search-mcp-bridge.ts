/**
 * MCP Search Bridge: Enhances VitePress search with live MCP queries
 *
 * When users search the docs, it:
 * 1. Returns matching documentation (VitePress default)
 * 2. Also queries MCP tools for live results
 * 3. Merges both static + dynamic results
 *
 * Examples:
 * - Search "factorize rsa-260" → shows docs + calls solve tool
 * - Search "quantum advantage" → shows docs + queries qpu://quantum-advantage resource
 * - Search "tools" → shows docs + lists all available MCP tools
 */

export interface SearchResult {
  title: string
  path: string
  content: string
  source: 'docs' | 'mcp'
  mcp?: {
    type: 'tool' | 'resource'
    name: string
    description: string
    data?: any
  }
}

export class MCPSearchBridge {
  private mcpServerUrl = 'http://localhost:3000'

  /**
   * Hybrid search: combine docs + MCP results
   */
  async search(query: string): Promise<SearchResult[]> {
    // Run both searches in parallel
    const [docsResults, mcpResults] = await Promise.all([
      this.searchDocs(query),
      this.searchMCP(query)
    ])

    // Merge and deduplicate
    return this.mergeResults([...docsResults, ...mcpResults], query)
  }

  /**
   * Search documentation (standard VitePress search)
   */
  private async searchDocs(query: string): Promise<SearchResult[]> {
    // This would integrate with VitePress's built-in search
    // For now, return placeholder
    return []
  }

  /**
   * Search MCP resources and tools
   */
  private async searchMCP(query: string): Promise<SearchResult[]> {
    const results: SearchResult[] = []
    const queryLower = query.toLowerCase()

    try {
      // 1. List all available MCP tools
      const toolsResponse = await this.callMCP('tools/list', {})
      const tools = toolsResponse.result || []

      // Filter tools matching query
      const matchingTools = tools.filter((tool: any) =>
        tool.name.toLowerCase().includes(queryLower) ||
        (tool.description && tool.description.toLowerCase().includes(queryLower))
      )

      for (const tool of matchingTools) {
        results.push({
          title: `🔧 Tool: ${tool.name}`,
          path: `/api/tools#${tool.name}`,
          content: tool.description || '',
          source: 'mcp',
          mcp: {
            type: 'tool',
            name: tool.name,
            description: tool.description
          }
        })
      }

      // 2. List all available MCP resources
      const resourcesResponse = await this.callMCP('resources/list', {})
      const resources = resourcesResponse.result || []

      // Filter resources matching query
      const matchingResources = resources.filter((res: any) =>
        res.uri.toLowerCase().includes(queryLower) ||
        (res.description && res.description.toLowerCase().includes(queryLower))
      )

      for (const resource of matchingResources) {
        results.push({
          title: `📦 Resource: ${resource.uri}`,
          path: `/api/resources#${resource.uri}`,
          content: resource.description || '',
          source: 'mcp',
          mcp: {
            type: 'resource',
            name: resource.uri,
            description: resource.description
          }
        })
      }

      // 3. If query looks like a problem, try to solve it
      if (this.isProblemQuery(query)) {
        const solveResponse = await this.callMCP('tools/call', {
          name: 'solve',
          arguments: {
            problem: query,
            network: true
          }
        })

        if (solveResponse.result) {
          results.push({
            title: `⚡ Live Solution: ${query}`,
            path: '/api/solve',
            content: `Solver: ${solveResponse.result.solver}`,
            source: 'mcp',
            mcp: {
              type: 'tool',
              name: 'solve',
              description: 'Live problem solver',
              data: solveResponse.result
            }
          })
        }
      }

      // 4. If query matches a resource URI, read it
      const resourceMatch = resources.find((r: any) =>
        r.uri.toLowerCase() === query.toLowerCase() ||
        r.uri.toLowerCase().includes(query.toLowerCase())
      )

      if (resourceMatch) {
        const resourceData = await this.callMCP('resources/read', {
          uri: resourceMatch.uri
        })

        if (resourceData.result) {
          results.push({
            title: `📊 Data: ${resourceMatch.uri}`,
            path: `/reference#${resourceMatch.uri}`,
            content: `Resource data available for ${resourceMatch.uri}`,
            source: 'mcp',
            mcp: {
              type: 'resource',
              name: resourceMatch.uri,
              description: 'Live resource data',
              data: resourceData.result
            }
          })
        }
      }
    } catch (error) {
      console.error('MCP search error:', error)
      // Gracefully degrade if MCP is unavailable
    }

    return results
  }

  /**
   * Call MCP server
   */
  private async callMCP(method: string, params: any): Promise<any> {
    const response = await fetch(`${this.mcpServerUrl}/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Math.random(),
        method,
        params
      })
    })

    if (!response.ok) {
      throw new Error(`MCP error: ${response.status}`)
    }

    return response.json()
  }

  /**
   * Detect if query looks like a problem to solve
   */
  private isProblemQuery(query: string): boolean {
    const keywords = [
      'factorize',
      'solve',
      'optimize',
      'simulate',
      'quantum',
      'rsa',
      'find',
      'compute'
    ]
    return keywords.some(kw => query.toLowerCase().includes(kw))
  }

  /**
   * Merge and deduplicate results
   */
  private mergeResults(results: SearchResult[], query: string): SearchResult[] {
    const seen = new Set<string>()
    const merged: SearchResult[] = []

    // Sort by relevance
    const scored = results.map(r => ({
      ...r,
      score: this.scoreRelevance(r, query)
    }))

    scored.sort((a, b) => b.score - a.score)

    for (const result of scored) {
      const key = `${result.source}:${result.mcp?.name || result.path}`
      if (!seen.has(key)) {
        seen.add(key)
        merged.push(result)
      }
    }

    return merged.slice(0, 10) // Limit to 10 results
  }

  /**
   * Score result relevance
   */
  private scoreRelevance(result: SearchResult, query: string): number {
    let score = 0
    const queryLower = query.toLowerCase()

    // Exact matches score highest
    if (result.title.toLowerCase() === queryLower) score += 100
    else if (result.title.toLowerCase().includes(queryLower)) score += 50

    // Content matches score lower
    if (result.content.toLowerCase().includes(queryLower)) score += 10

    // Live results from MCP get bonus
    if (result.source === 'mcp') score += 5

    return score
  }
}

/**
 * VitePress Integration
 */
export function createMCPSearch(): MCPSearchBridge {
  return new MCPSearchBridge()
}
