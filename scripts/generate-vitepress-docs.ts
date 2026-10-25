// VitePress-Integrated Unified Doc Generator
// Generate all docs (examples, usecases, domains, frameworks, providers)
// with proper VitePress structure and metadata

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface VitePressDoc {
  layout: 'doc' | 'home'
  title: string
  description: string
  head?: Array<[string, Record<string, string>]>
  sidebar?: boolean
}

interface UnifiedDocData {
  id: string
  type: 'example' | 'usecase' | 'domain' | 'framework' | 'provider'
  title: string
  description: string
  tags: string[]
  meta: Record<string, any>
  overview: string
  sections: Record<string, string>
  related: {
    examples?: string[]
    usecases?: string[]
    domains?: string[]
    frameworks?: string[]
    providers?: string[]
  }
  toolset?: Array<{ name: string; desc: string; cmd: string }>
}

class VitePressDocGenerator {
  private docsDir: string
  private dataDir: string

  constructor() {
    this.docsDir = path.join(__dirname, '../docs/examples')
    this.dataDir = path.join(this.docsDir, '.vitepress')
    this.ensureDirs()
  }

  private ensureDirs(): void {
    [this.docsDir, this.dataDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
    })
  }

  private generateFrontmatter(doc: UnifiedDocData): string {
    const fm: VitePressDoc = {
      layout: 'doc',
      title: doc.title,
      description: doc.description
    }

    return `---\n${Object.entries(fm)
      .map(([k, v]) => {
        if (Array.isArray(v)) {
          return `${k}: ${JSON.stringify(v)}`
        }
        return `${k}: "${v}"`
      })
      .join('\n')}\n---\n`
  }

  private generateMarkdown(doc: UnifiedDocData): string {
    let md = this.generateFrontmatter(doc)

    // Title and quick meta
    md += `# ${doc.title}\n\n`

    const meta = []
    if (doc.meta.difficulty) meta.push(`**Difficulty:** ${doc.meta.difficulty}`)
    if (doc.meta.timeEstimate) meta.push(`**Time:** ${doc.meta.timeEstimate}`)
    if (doc.meta.industry) meta.push(`**Industry:** ${doc.meta.industry}`)
    if (meta.length > 0) {
      md += `${meta.join(' | ')}\n\n`
    }

    // Tags
    if (doc.tags.length > 0) {
      md += `> ${doc.tags.map(t => `\`${t}\``).join(', ')}\n\n`
    }

    // Overview
    md += `## Overview\n\n${doc.overview}\n\n`

    // Dynamic sections based on type
    Object.entries(doc.sections).forEach(([heading, content]) => {
      md += `## ${heading}\n\n${content}\n\n`
    })

    // Related components
    if (Object.keys(doc.related).some(k => (doc.related[k as keyof typeof doc.related] || []).length > 0)) {
      md += `## See Also\n\n`

      if (doc.related.examples?.length) {
        md += `**Examples:**\n`
        doc.related.examples.forEach(e => {
          md += `- [\`${e}\`](./${e}/)\n`
        })
        md += `\n`
      }

      if (doc.related.usecases?.length) {
        md += `**Use Cases:**\n`
        doc.related.usecases.forEach(uc => {
          md += `- [\`${uc}\`](../usecases/${uc}/)\n`
        })
        md += `\n`
      }

      if (doc.related.frameworks?.length) {
        md += `**Frameworks:**\n`
        doc.related.frameworks.forEach(f => {
          md += `- [\`${f}\`](../frameworks/${f}/)\n`
        })
        md += `\n`
      }

      if (doc.related.providers?.length) {
        md += `**Providers:**\n`
        doc.related.providers.forEach(p => {
          md += `- [\`${p}\`](../providers/${p}/)\n`
        })
        md += `\n`
      }
    }

    // Toolset
    if (doc.toolset && doc.toolset.length > 0) {
      md += `## Executable Toolset\n\n`
      md += `This ${doc.type} is fully executable via MCP:\n\n`
      md += `\`\`\`bash\n`
      doc.toolset.forEach(tool => {
        md += `# ${tool.desc}\n${tool.cmd}\n\n`
      })
      md += `\`\`\`\n\n`
    }

    // Footer nav
    md += `---\n\n`
    md += `<style scoped>\n.nav-links { display: flex; gap: 1rem; margin-top: 2rem; }\n</style>\n`

    return md
  }

  generateExamples(): void {
    const examples = [
      {
        id: 'qiskit-bell-state',
        type: 'example' as const,
        title: 'Qiskit Bell State',
        description: 'Two-qubit entanglement',
        tags: ['qiskit', 'entanglement', 'ibm'],
        meta: { difficulty: 'beginner', frameworks: ['qiskit'], providers: ['ibm-quantum'] },
        overview: 'Bell state entanglement demonstration on IBM Quantum.',
        sections: {
          'Quick Start': `
\`\`\`javascript
const result = await mcpTool('examples/run', {
  exampleId: 'qiskit-bell-state',
  provider: 'ibm-quantum'
})
\`\`\`

## Validate Native Computation
\`\`\`javascript
const proof = await mcpTool('examples/native-proof', {
  exampleId: 'qiskit-bell-state'
})
\`\`\`
`.trim(),
          'Metrics': `
- **Qubits:** 2
- **Depth:** 2
- **Expected Fidelity:** >98%
- **T2 Coherence:** 25µs
`.trim()
        },
        related: { usecases: ['qkd-quantum-key-distribution'] },
        toolset: [
          { name: 'prepare', desc: 'Prepare Bell state', cmd: 'qpu examples run qiskit-bell-state' },
          {
            name: 'validate',
            desc: 'Validate native computation',
            cmd: 'qpu examples native-proof qiskit-bell-state'
          }
        ]
      }
    ]

    examples.forEach(doc => {
      const dirPath = path.join(this.docsDir, 'examples', doc.id)
      if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true })
      const filepath = path.join(dirPath, 'index.md')
      fs.writeFileSync(filepath, this.generateMarkdown(doc))
      console.log(`📄 examples/${doc.id}/`)
    })
  }

  generateUsecases(): void {
    const usecases = [
      {
        id: 'qkd-quantum-key-distribution',
        type: 'usecase' as const,
        title: 'Quantum Key Distribution',
        description: 'Secure cryptographic keys via quantum mechanics',
        tags: ['cryptography', 'security', 'entanglement', 'communication'],
        meta: {
          difficulty: 'intermediate',
          timeEstimate: '2-3 hours',
          industry: 'Cybersecurity',
          examples: ['qiskit-bell-state'],
          frameworks: ['qiskit', 'cirq'],
          providers: ['ibm-quantum', 'google-cirq']
        },
        overview:
          'Establish theoretically unbreakable cryptographic keys using quantum entanglement. Detect eavesdropping attempts through quantum mechanics.',
        sections: {
          'The Problem': `Classical encryption vulnerable to quantum computers. Need theoretically unbreakable key distribution mechanism.`,
          'Quantum Advantage': `Bell states guarantee security through quantum mechanics: any eavesdropping immediately detects entanglement breaking.`,
          'Expected Outcome': `Secure key establishment between two parties with guaranteed eavesdropping detection capability.`,
          'Resources': `
- 2-qubit quantum device
- Bell state preparation capability
- Quantum channel for transmission
- Classical post-processing
`.trim()
        },
        related: { examples: ['qiskit-bell-state'], frameworks: ['qiskit', 'cirq'], providers: ['ibm-quantum', 'google-cirq'] },
        toolset: [
          { name: 'prepare', desc: 'Prepare quantum key', cmd: 'qpu examples run qiskit-bell-state --shots 1000' },
          {
            name: 'detect',
            desc: 'Detect eavesdropping',
            cmd: 'qpu examples native-proof qiskit-bell-state'
          },
          {
            name: 'compare',
            desc: 'Compare providers',
            cmd: 'qpu examples compare qiskit-bell-state --providers ibm-quantum,google-cirq'
          }
        ]
      }
    ]

    usecases.forEach(doc => {
      const dirPath = path.join(this.docsDir, 'usecases', doc.id)
      if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true })
      const filepath = path.join(dirPath, 'index.md')
      fs.writeFileSync(filepath, this.generateMarkdown(doc))
      console.log(`📄 usecases/${doc.id}/`)
    })
  }

  generateDomains(): void {
    const domains = [
      {
        id: 'entanglement',
        type: 'domain' as const,
        title: 'Entanglement Domain',
        description: 'Multi-qubit correlations and quantum information',
        tags: ['fundamental', 'quantum-mechanics', 'multiparty'],
        meta: {},
        overview: 'Explore quantum entanglement: Bell states, GHZ states, and their applications.',
        sections: {
          'Key Concepts': `
**Superposition:** Explore many possibilities simultaneously
**Entanglement:** Correlate distant qubits for advantage
**Interference:** Amplify correct answers, cancel wrong ones
`.trim(),
          'Examples': `
- Bell State: 2-qubit entanglement
- GHZ State: 3-qubit entanglement
- W State: Symmetric superposition
`.trim()
        },
        related: {
          examples: ['qiskit-bell-state'],
          usecases: ['qkd-quantum-key-distribution']
        }
      }
    ]

    domains.forEach(doc => {
      const dirPath = path.join(this.docsDir, 'domains', doc.id)
      if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true })
      const filepath = path.join(dirPath, 'index.md')
      fs.writeFileSync(filepath, this.generateMarkdown(doc))
      console.log(`📄 domains/${doc.id}/`)
    })
  }

  generateFrameworks(): void {
    const frameworks = [
      {
        id: 'qiskit',
        type: 'framework' as const,
        title: 'Qiskit',
        description: 'IBM Quantum framework for quantum circuits',
        tags: ['ibm', 'python', 'open-source'],
        meta: {},
        overview: 'Build and execute quantum circuits using Qiskit framework.',
        sections: {
          'Integration': `
Run Qiskit circuits via QPU:
\`\`\`javascript
const result = await mcpTool('framework/compute', {
  framework: 'qiskit',
  circuitJson: '...',
  provider: 'auto'
})
\`\`\`
`.trim(),
          'Capabilities': `
- Full circuit building API
- 20+ quantum gate types
- Automatic circuit optimization
- Multiple provider backend support
`.trim()
        },
        related: {
          examples: ['qiskit-bell-state'],
          providers: ['ibm-quantum']
        }
      }
    ]

    frameworks.forEach(doc => {
      const dirPath = path.join(this.docsDir, 'frameworks', doc.id)
      if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true })
      const filepath = path.join(dirPath, 'index.md')
      fs.writeFileSync(filepath, this.generateMarkdown(doc))
      console.log(`📄 frameworks/${doc.id}/`)
    })
  }

  generateProviders(): void {
    const providers = [
      {
        id: 'ibm-quantum',
        type: 'provider' as const,
        title: 'IBM Quantum',
        description: 'IBM Quantum Cloud Services',
        tags: ['ibm', 'cloud', 'superconducting'],
        meta: {},
        overview: 'Access IBM quantum processors via cloud with native circuit execution.',
        sections: {
          'Specifications': `
- **Qubit Count:** 5-127 depending on processor
- **T1 Coherence:** >30µs
- **T2 Coherence:** >50µs
- **Gate Fidelity:** 99.5%+
- **Architecture:** Heavy Hex layout
`.trim(),
          'Connection': `
\`\`\`javascript
const result = await mcpTool('examples/run', {
  exampleId: 'qiskit-bell-state',
  provider: 'ibm-quantum'
})
\`\`\`
`.trim()
        },
        related: { examples: ['qiskit-bell-state'], frameworks: ['qiskit'] }
      }
    ]

    providers.forEach(doc => {
      const dirPath = path.join(this.docsDir, 'providers', doc.id)
      if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true })
      const filepath = path.join(dirPath, 'index.md')
      fs.writeFileSync(filepath, this.generateMarkdown(doc))
      console.log(`📄 providers/${doc.id}/`)
    })
  }

  generateIndex(): void {
    const index = `---
layout: home
title: Examples & Use Cases
description: Full combinatorial quantum examples across all domains and frameworks

hero:
  name: Quantum Examples
  text: Complete example library
  tagline: Discover, run, and validate quantum algorithms across all frameworks and providers
  image:
    src: /quantum.svg
    alt: Quantum Computing
  actions:
    - theme: brand
      text: Get Started
      link: /examples/examples/qiskit-bell-state/
    - theme: alt
      text: View All Use Cases
      link: /examples/usecases/qkd-quantum-key-distribution/

features:
  - icon: 🧮
    title: Examples
    details: 4 fully implemented quantum algorithms with native computation proofs
  - icon: 🎯
    title: Use Cases
    details: 16 real-world applications mapped to industry domains
  - icon: 🛠️
    title: Toolsets
    details: Executable toolsets for every use case
  - icon: 📚
    title: Frameworks
    details: Qiskit, Cirq, PennyLane, PyQuil integration
  - icon: ☁️
    title: Providers
    details: IBM, Google, IonQ, Rigetti, AWS support
  - icon: ✅
    title: Validated
    details: Native quantum computation proven on real hardware
---`

    fs.writeFileSync(path.join(this.docsDir, 'index.md'), index)
    console.log(`📄 index.md (home)`)
  }

  generateAll(): void {
    console.log('Generating VitePress-integrated unified docs...\n')
    this.generateIndex()
    console.log('\n📝 Examples')
    this.generateExamples()
    console.log('\n📝 Use Cases')
    this.generateUsecases()
    console.log('\n📝 Domains')
    this.generateDomains()
    console.log('\n📝 Frameworks')
    this.generateFrameworks()
    console.log('\n📝 Providers')
    this.generateProviders()
    console.log('\n✅ VitePress docs generation complete')
  }
}

// Run
const generator = new VitePressDocGenerator()
generator.generateAll()
