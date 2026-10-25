// Unified Doc Template for Combinatorial Generation
// All doc types (examples, usecases, domains, frameworks, providers) use same template

export interface DocTemplate {
  type: 'usecase' | 'example' | 'domain' | 'framework' | 'provider'
  id: string
  title: string
  description: string
  tags: string[]
  metadata: {
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
    timeEstimate?: string
    industry?: string
    examples?: string[]
    frameworks?: string[]
    providers?: string[]
  }
  content: {
    overview: string
    problemStatement?: string
    quantumAdvantage?: string
    expectedOutcome?: string
    resources?: string[]
    capabilities?: Record<string, string>
  }
  relationships: {
    examples?: string[]
    usecases?: string[]
    domains?: string[]
    frameworks?: string[]
    providers?: string[]
    industries?: string[]
  }
  toolset?: {
    tools: Array<{
      name: string
      description: string
      command: string
    }>
  }
}

export class DocGenerator {
  generateFrontmatter(doc: DocTemplate): string {
    const meta = doc.metadata
    let fm = `---\n`
    fm += `type: "${doc.type}"\n`
    fm += `id: "${doc.id}"\n`
    fm += `title: "${doc.title}"\n`
    fm += `description: "${doc.description}"\n`
    fm += `tags: [${doc.tags.map(t => `"${t}"`).join(', ')}]\n`

    if (meta.difficulty) fm += `difficulty: "${meta.difficulty}"\n`
    if (meta.timeEstimate) fm += `timeEstimate: "${meta.timeEstimate}"\n`
    if (meta.industry) fm += `industry: "${meta.industry}"\n`
    if (meta.examples) fm += `examples: [${meta.examples.map(e => `"${e}"`).join(', ')}]\n`
    if (meta.frameworks) fm += `frameworks: [${meta.frameworks.map(f => `"${f}"`).join(', ')}]\n`
    if (meta.providers) fm += `providers: [${meta.providers.map(p => `"${p}"`).join(', ')}]\n`

    fm += `---\n`
    return fm
  }

  generateStructure(doc: DocTemplate): string {
    let md = this.generateFrontmatter(doc)

    // Title
    md += `\n# ${doc.title}\n\n`

    // Quick metadata
    const metaLine = this.generateMetadataLine(doc)
    if (metaLine) md += `${metaLine}\n\n`

    // Overview
    md += `## Overview\n\n${doc.content.overview}\n\n`

    // Type-specific sections
    switch (doc.type) {
      case 'usecase':
        md += this.generateUsecaseContent(doc)
        break
      case 'example':
        md += this.generateExampleContent(doc)
        break
      case 'domain':
        md += this.generateDomainContent(doc)
        break
      case 'framework':
        md += this.generateFrameworkContent(doc)
        break
      case 'provider':
        md += this.generateProviderContent(doc)
        break
    }

    // Relationships
    md += this.generateRelationships(doc)

    // Toolset
    if (doc.toolset) {
      md += this.generateToolset(doc)
    }

    // Footer
    md += this.generateFooter(doc)

    return md
  }

  private generateMetadataLine(doc: DocTemplate): string {
    const parts = []
    if (doc.metadata.difficulty) parts.push(`**Difficulty:** ${doc.metadata.difficulty}`)
    if (doc.metadata.timeEstimate) parts.push(`**Time:** ${doc.metadata.timeEstimate}`)
    if (doc.metadata.industry) parts.push(`**Industry:** ${doc.metadata.industry}`)
    return parts.length > 0 ? parts.join(' | ') : ''
  }

  private generateUsecaseContent(doc: DocTemplate): string {
    let md = ''

    if (doc.content.problemStatement) {
      md += `## The Problem\n\n${doc.content.problemStatement}\n\n`
    }

    if (doc.content.quantumAdvantage) {
      md += `## Quantum Advantage\n\n${doc.content.quantumAdvantage}\n\n`
    }

    if (doc.content.expectedOutcome) {
      md += `## Expected Outcome\n\n${doc.content.expectedOutcome}\n\n`
    }

    if (doc.content.resources && doc.content.resources.length > 0) {
      md += `## Resources Required\n\n`
      doc.content.resources.forEach(r => {
        md += `- ${r}\n`
      })
      md += `\n`
    }

    return md
  }

  private generateExampleContent(doc: DocTemplate): string {
    let md = ''

    if (doc.content.capabilities && Object.keys(doc.content.capabilities).length > 0) {
      md += `## Capabilities\n\n`
      Object.entries(doc.content.capabilities).forEach(([key, value]) => {
        md += `- **${key}:** ${value}\n`
      })
      md += `\n`
    }

    md += `## Run Example\n\n`
    md += `\`\`\`javascript\n`
    md += `const result = await mcpTool('examples/run', {\n`
    md += `  exampleId: '${doc.id}'\n`
    md += `})\n`
    md += `\`\`\`\n\n`

    md += `## Get Native Proof\n\n`
    md += `\`\`\`javascript\n`
    md += `const proof = await mcpTool('examples/native-proof', {\n`
    md += `  exampleId: '${doc.id}'\n`
    md += `})\n`
    md += `\`\`\`\n\n`

    return md
  }

  private generateDomainContent(doc: DocTemplate): string {
    let md = ''

    if (doc.content.capabilities && Object.keys(doc.content.capabilities).length > 0) {
      md += `## Key Concepts\n\n`
      Object.entries(doc.content.capabilities).forEach(([concept, desc]) => {
        md += `**${concept}:** ${desc}\n\n`
      })
    }

    return md
  }

  private generateFrameworkContent(doc: DocTemplate): string {
    let md = ''

    md += `## Integration\n\n`
    md += `Run ${doc.id.toUpperCase()} circuits via QPU:\n\n`
    md += `\`\`\`javascript\n`
    md += `const result = await mcpTool('framework/compute', {\n`
    md += `  framework: '${doc.id}',\n`
    md += `  circuitJson: '...',\n`
    md += `  provider: 'auto'\n`
    md += `})\n`
    md += `\`\`\`\n\n`

    return md
  }

  private generateProviderContent(doc: DocTemplate): string {
    let md = ''

    if (doc.content.capabilities && Object.keys(doc.content.capabilities).length > 0) {
      md += `## Specifications\n\n`
      Object.entries(doc.content.capabilities).forEach(([spec, value]) => {
        md += `- **${spec}:** ${value}\n`
      })
      md += `\n`
    }

    md += `## Run on This Provider\n\n`
    md += `\`\`\`javascript\n`
    md += `const result = await mcpTool('examples/run', {\n`
    md += `  exampleId: 'example-id',\n`
    md += `  provider: '${doc.id}'\n`
    md += `})\n`
    md += `\`\`\`\n\n`

    return md
  }

  private generateRelationships(doc: DocTemplate): string {
    let md = `## Related\n\n`

    if (doc.relationships.examples && doc.relationships.examples.length > 0) {
      md += `**Examples:**\n`
      doc.relationships.examples.forEach(e => {
        md += `- [\`${e}\`](/examples/examples/${e}/)\n`
      })
      md += `\n`
    }

    if (doc.relationships.usecases && doc.relationships.usecases.length > 0) {
      md += `**Use Cases:**\n`
      doc.relationships.usecases.forEach(uc => {
        md += `- [\`${uc}\`](/examples/usecases/${uc}/)\n`
      })
      md += `\n`
    }

    if (doc.relationships.frameworks && doc.relationships.frameworks.length > 0) {
      md += `**Frameworks:**\n`
      doc.relationships.frameworks.forEach(f => {
        md += `- [\`${f}\`](/examples/frameworks/${f}/)\n`
      })
      md += `\n`
    }

    if (doc.relationships.providers && doc.relationships.providers.length > 0) {
      md += `**Providers:**\n`
      doc.relationships.providers.forEach(p => {
        md += `- [\`${p}\`](/examples/providers/${p}/)\n`
      })
      md += `\n`
    }

    return md
  }

  private generateToolset(doc: DocTemplate): string {
    if (!doc.toolset) return ''

    let md = `## Toolset\n\n`
    md += `This ${doc.type} is fully executable via MCP toolset:\n\n`
    md += `\`\`\`bash\n`

    doc.toolset.tools.forEach(tool => {
      md += `# ${tool.description}\n`
      md += `${tool.command}\n\n`
    })

    md += `\`\`\`\n\n`
    return md
  }

  private generateFooter(doc: DocTemplate): string {
    let md = `---\n\n`
    md += `**Type:** ${doc.type} | **ID:** \`${doc.id}\`\n\n`
    md += `## Learn More\n\n`
    md += `- [Examples at Scale](/guides/examples-at-scale.md)\n`
    md += `- [Framework Integration](/guides/framework-integration.md)\n`
    md += `- [Native Validation](/guides/native-validation.md)\n`

    return md
  }
}

// Example usage
export const docGenerator = new DocGenerator()

// Export for testing
export function generateExample(id: string, title: string, description: string): string {
  const doc: DocTemplate = {
    type: 'example',
    id,
    title,
    description,
    tags: ['example', id],
    metadata: {
      difficulty: 'beginner'
    },
    content: {
      overview: `Demonstrates ${title} on quantum hardware.`,
      capabilities: {
        'Framework': 'Qiskit',
        'Provider': 'IBM Quantum',
        'Qubits': '2'
      }
    },
    relationships: {
      usecases: [],
      frameworks: ['qiskit'],
      providers: ['ibm-quantum']
    }
  }

  return docGenerator.generateStructure(doc)
}
