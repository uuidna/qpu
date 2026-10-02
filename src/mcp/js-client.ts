/**
 * QPU Theorem Network MCP JavaScript Client
 * TypeScript client for calling MCP theorem tools
 */

export interface MCPTool {
  name: string
  description: string
  inputSchema: any
  outputSchema: any
}

export interface MCPResponse<T = any> {
  tools?: MCPTool[]
  capabilities?: any
  status?: string
  [key: string]: any
}

export interface ToolCallRequest {
  name: string
  arguments?: Record<string, any>
}

export class QPUMCPClient {
  private baseUrl: string

  constructor(baseUrl: string = "http://localhost:3000") {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    method: string,
    path: string,
    body?: any
  ): Promise<T> {
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    }

    if (body) {
      options.body = JSON.stringify(body)
    }

    const response = await fetch(`${this.baseUrl}${path}`, options)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json() as Promise<T>
  }

  async health(): Promise<Record<string, any>> {
    return this.request("GET", "/health")
  }

  async listTools(): Promise<MCPResponse> {
    return this.request("GET", "/mcp/tools/list")
  }

  async getStats(): Promise<Record<string, any>> {
    return this.request("GET", "/mcp/tools/stats")
  }

  async callTool(request: ToolCallRequest): Promise<any> {
    return this.request("POST", "/mcp/tools/call", request)
  }

  // Convenience methods for analysis tools

  async coverageReport(): Promise<Record<string, any>> {
    return this.callTool({ name: "qpu_coverage_report" })
  }

  async deploymentReadiness(): Promise<Record<string, any>> {
    return this.callTool({ name: "qpu_deployment_readiness" })
  }

  async theoremSummary(): Promise<Record<string, any>> {
    return this.callTool({ name: "qpu_theorem_summary" })
  }

  async apiMapping(domain: string = "all"): Promise<Record<string, any>> {
    return this.callTool({
      name: "qpu_api_mapping",
      arguments: { domain }
    })
  }

  async deploymentTimeline(): Promise<Record<string, any>> {
    return this.callTool({ name: "qpu_deployment_timeline" })
  }
}

// ============================================================================
// CLI Demo (Node.js)
// ============================================================================

async function demo() {
  const client = new QPUMCPClient()

  try {
    console.log("✅ Health Check")
    const health = await client.health()
    console.log(`   Status: ${health.status}`)
    console.log(`   Theorem Tools: ${health.theorem_tools}`)
    console.log(`   Total Tools: ${health.all_tools}\n`)

    console.log("📊 MCP Statistics")
    const stats = await client.getStats()
    console.log(`   Total Tools: ${stats.total_tools}`)
    console.log(`   Proven Theorems: ${stats.proven_theorems}`)
    console.log(`   Coverage: ${stats.coverage_percentage}%`)
    console.log(`   Status: ${stats.deployment_status}\n`)

    console.log("🔧 Available Tools")
    const toolsResp = await client.listTools()
    const tools = toolsResp.tools || []
    console.log(`   Total: ${tools.length}`)
    tools.slice(0, 5).forEach(tool => {
      console.log(`   - ${tool.name}: ${tool.description.substring(0, 50)}...`)
    })
    console.log(`   ... and ${Math.max(0, tools.length - 5)} more\n`)

    console.log("📈 Coverage Report")
    const coverage = await client.coverageReport()
    console.log(`   Total: ${coverage.total_theorems}`)
    console.log(`   Proven: ${coverage.total_proven}`)
    console.log(`   Coverage: ${coverage.coverage_percentage}%\n`)

    console.log("✅ Deployment Readiness")
    const readiness = await client.deploymentReadiness()
    console.log(`   Status: ${readiness.overall_status}`)
    console.log(`   Recommendation: ${readiness.recommendation}\n`)

    console.log("📋 Theorem Summary")
    const summary = await client.theoremSummary()
    console.log(`   Proven: ${summary.summary.proven_theorems}/${summary.summary.total_theorems}`)
    console.log(`   MCP Tools: ${summary.summary.mcp_tools_deployed}`)
    console.log(`   APIs Unlocked: ${summary.summary.apis_unlocked}\n`)

  } catch (error) {
    console.error("Error:", error)
  }
}

// Run demo if this is the main module (Node.js)
if (typeof window === 'undefined' && import.meta.url === `file://${process.argv[1]}`) {
  demo()
}

export default QPUMCPClient
