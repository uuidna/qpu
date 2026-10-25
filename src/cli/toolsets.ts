// Toolsets CLI: Execute use cases as discoverable, composable toolsets
// Makes examples executable from command line with full control

import fs from 'fs'
import path from 'path'

interface ToolsetConfig {
  id: string
  name: string
  description: string
  category: string
  tools: ToolConfig[]
}

interface ToolConfig {
  name: string
  description: string
  command: string
  inputs: Record<string, string>
  outputs: string[]
}

export class ToolsetsManager {
  private registryPath: string
  private toolsets: Map<string, ToolsetConfig> = new Map()

  constructor(registryPath?: string) {
    this.registryPath = registryPath || './docs/toolsets/registry.json'
    this.loadRegistry()
  }

  /**
   * Load all toolsets from registry
   */
  private loadRegistry(): void {
    try {
      if (fs.existsSync(this.registryPath)) {
        const registry = JSON.parse(fs.readFileSync(this.registryPath, 'utf-8'))
        registry.toolsets.forEach((ts: ToolsetConfig) => {
          this.toolsets.set(ts.id, ts)
        })
      }
    } catch (error) {
      console.error(`Failed to load toolset registry: ${error}`)
    }
  }

  /**
   * List all available toolsets
   */
  listToolsets(filter?: { category?: string; tags?: string[] }): ToolsetConfig[] {
    let results = Array.from(this.toolsets.values())

    if (filter?.category) {
      results = results.filter(ts => ts.category === filter.category)
    }

    return results
  }

  /**
   * Get toolset by ID
   */
  getToolset(id: string): ToolsetConfig | undefined {
    return this.toolsets.get(id)
  }

  /**
   * List tools in a toolset
   */
  getTools(toolsetId: string): ToolConfig[] {
    const toolset = this.toolsets.get(toolsetId)
    return toolset?.tools || []
  }

  /**
   * Execute a tool in a toolset
   */
  async executeTool(
    toolsetId: string,
    toolName: string,
    inputs?: Record<string, any>
  ): Promise<any> {
    const toolset = this.toolsets.get(toolsetId)
    if (!toolset) {
      throw new Error(`Toolset not found: ${toolsetId}`)
    }

    const tool = toolset.tools.find(t => t.name === toolName)
    if (!tool) {
      throw new Error(`Tool not found: ${toolName} in toolset ${toolsetId}`)
    }

    // Replace placeholders with actual inputs
    let command = tool.command
    if (inputs) {
      Object.entries(inputs).forEach(([key, value]) => {
        command = command.replace(`{${key}}`, String(value))
      })
    }

    console.log(`🛠️  Executing: ${command}`)
    // In real implementation, execute the command
    return {
      toolsetId,
      toolName,
      command,
      inputs,
      expectedOutputs: tool.outputs
    }
  }

  /**
   * Get toolset documentation
   */
  getDocumentation(toolsetId: string): string {
    const toolset = this.toolsets.get(toolsetId)
    if (!toolset) {
      return ''
    }

    let doc = `# ${toolset.name}\n\n`
    doc += `${toolset.description}\n\n`
    doc += `## Tools\n\n`

    toolset.tools.forEach(tool => {
      doc += `### ${tool.name}\n\n`
      doc += `${tool.description}\n\n`
      doc += `\`\`\`bash\n${tool.command}\n\`\`\`\n\n`
      doc += `**Inputs:**\n`
      Object.entries(tool.inputs).forEach(([key, value]) => {
        doc += `- \`${key}\`: ${value}\n`
      })
      doc += `\n**Outputs:**\n`
      tool.outputs.forEach(output => {
        doc += `- ${output}\n`
      })
      doc += '\n'
    })

    return doc
  }

  /**
   * Export toolset as MCP tool definition
   */
  exportAsMCPTool(toolsetId: string): any {
    const toolset = this.toolsets.get(toolsetId)
    if (!toolset) {
      return null
    }

    return {
      name: `toolset/${toolsetId}`,
      description: toolset.description,
      inputSchema: {
        type: 'object',
        properties: {
          tool: {
            type: 'string',
            enum: toolset.tools.map(t => t.name),
            description: 'Which tool to run'
          },
          inputs: {
            type: 'object',
            description: 'Tool inputs',
            properties: toolset.tools[0]?.inputs || {}
          }
        },
        required: ['tool']
      }
    }
  }

  /**
   * Get all toolsets as MCP tools
   */
  getAllAsToolsets(): Array<{ name: string; description: string; tools: string[] }> {
    return Array.from(this.toolsets.values()).map(ts => ({
      name: ts.id,
      description: ts.description,
      tools: ts.tools.map(t => t.name)
    }))
  }

  /**
   * Search toolsets
   */
  search(query: string): ToolsetConfig[] {
    const lowerQuery = query.toLowerCase()
    return Array.from(this.toolsets.values()).filter(
      ts =>
        ts.name.toLowerCase().includes(lowerQuery) ||
        ts.description.toLowerCase().includes(lowerQuery) ||
        ts.id.toLowerCase().includes(lowerQuery)
    )
  }

  /**
   * Get toolsets by category with hierarchy
   */
  getCategoryHierarchy(): Record<string, ToolsetConfig[]> {
    const hierarchy: Record<string, ToolsetConfig[]> = {}

    Array.from(this.toolsets.values()).forEach(ts => {
      if (!hierarchy[ts.category]) {
        hierarchy[ts.category] = []
      }
      hierarchy[ts.category].push(ts)
    })

    return hierarchy
  }

  /**
   * Generate CLI help text
   */
  generateHelp(): string {
    let help = `
QPU Toolsets - Execute Use Cases as Composable Toolsets

USAGE:
  qpu toolset <command> [options]

COMMANDS:
  list              List all available toolsets
  get <id>          Get toolset details
  run <id> <tool>   Execute a tool in a toolset
  search <query>    Search toolsets
  docs <id>         Get toolset documentation
  export <id>       Export as MCP tool definition

EXAMPLES:
  qpu toolset list
  qpu toolset get qkd-toolset
  qpu toolset run qkd-toolset qkd-prepare-keys --shots 1000
  qpu toolset search "optimization"
  qpu toolset docs qkd-toolset

TOOLSET CATEGORIES:
`

    const hierarchy = this.getCategoryHierarchy()
    Object.entries(hierarchy).forEach(([category, toolsets]) => {
      help += `\n  ${category}:\n`
      toolsets.forEach(ts => {
        help += `    - ${ts.id}: ${ts.description}\n`
      })
    })

    return help
  }
}

// Export singleton instance
export const toolsetsManager = new ToolsetsManager()

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  const [, , command, ...args] = process.argv

  switch (command) {
    case 'list': {
      const toolsets = toolsetsManager.listToolsets()
      console.log(`Available Toolsets (${toolsets.length})\n`)
      toolsets.forEach(ts => {
        console.log(`🛠️  ${ts.id}`)
        console.log(`   ${ts.description}`)
        console.log(`   Tools: ${ts.tools.map(t => t.name).join(', ')}\n`)
      })
      break
    }

    case 'get': {
      const toolset = toolsetsManager.getToolset(args[0])
      if (!toolset) {
        console.error(`Toolset not found: ${args[0]}`)
        process.exit(1)
      }
      console.log(`${toolset.name}\n${toolset.description}\n`)
      console.log('Tools:')
      toolset.tools.forEach(tool => {
        console.log(`  - ${tool.name}: ${tool.description}`)
      })
      break
    }

    case 'search': {
      const results = toolsetsManager.search(args[0])
      console.log(`Search Results: "${args[0]}" (${results.length})\n`)
      results.forEach(ts => {
        console.log(`${ts.id}: ${ts.description}`)
      })
      break
    }

    case 'docs': {
      const doc = toolsetsManager.getDocumentation(args[0])
      console.log(doc)
      break
    }

    case 'help':
    default: {
      console.log(toolsetsManager.generateHelp())
    }
  }
}
