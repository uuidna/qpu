// Unified Combinatorial Doc Generator
// All docs (examples, usecases, domains, frameworks, providers) use the same template

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { DocGenerator, DocTemplate } from './doc-template.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const docGenerator = new DocGenerator()

// Unified data source
const EXAMPLES = {
  'qiskit-bell-state': {
    title: 'Qiskit Bell State',
    description: 'Two-qubit entanglement Bell state',
    tags: ['entanglement', 'qiskit', 'ibm'],
    difficulty: 'beginner' as const,
    framework: 'qiskit',
    provider: 'ibm-quantum',
    capabilities: {
      Framework: 'Qiskit',
      Provider: 'IBM Quantum',
      Qubits: '2',
      Depth: '2'
    }
  }
}

const USECASES = {
  'qkd-quantum-key-distribution': {
    title: 'Quantum Key Distribution',
    description: 'Secure cryptographic keys via quantum entanglement',
    tags: ['cryptography', 'security', 'entanglement'],
    difficulty: 'intermediate' as const,
    timeEstimate: '2-3 hours',
    industry: 'Cybersecurity',
    examples: ['qiskit-bell-state'],
    frameworks: ['qiskit', 'cirq'],
    providers: ['ibm-quantum', 'google-cirq'],
    problem: 'Need theoretically unbreakable key distribution',
    advantage: 'Bell states guarantee security, eavesdropping detectable',
    outcome: 'Secure key with eavesdropping detection'
  }
}

const DOMAINS = {
  'entanglement': {
    title: 'Entanglement',
    description: 'Quantum entanglement and multi-qubit correlations',
    tags: ['fundamental', 'quantum-mechanics'],
    capabilities: {
      Superposition: 'Explore multiple states simultaneously',
      Entanglement: 'Correlate distant qubits',
      Interference: 'Amplify correct answers'
    }
  }
}

const FRAMEWORKS = {
  'qiskit': {
    title: 'Qiskit',
    description: 'IBM Quantum framework for circuit building',
    tags: ['ibm', 'framework', 'python'],
    capabilities: {
      'Circuit Building': 'Construct quantum circuits',
      'Gate Library': '20+ quantum gates',
      'Optimization': 'Circuit transpilation & optimization'
    }
  }
}

const PROVIDERS = {
  'ibm-quantum': {
    title: 'IBM Quantum',
    description: 'IBM Quantum Cloud Services',
    tags: ['ibm', 'provider', 'cloud'],
    capabilities: {
      Qubits: '5-127 depending on system',
      Coherence: 'T2 > 50µs',
      'Gate Fidelity': '99.5%+',
      Architecture: 'Heavy Hex'
    }
  }
}

interface GeneratorConfig {
  docsDir: string
  toolsetsDir: string
}

class UnifiedDocGenerator {
  config: GeneratorConfig

  constructor(config: GeneratorConfig) {
    this.config = config
    this.ensureDirs()
  }

  private ensureDirs(): void {
    const dirs = [
      this.config.docsDir,
      path.join(this.config.docsDir, 'examples'),
      path.join(this.config.docsDir, 'usecases'),
      path.join(this.config.docsDir, 'domains'),
      path.join(this.config.docsDir, 'frameworks'),
      path.join(this.config.docsDir, 'providers'),
      this.config.toolsetsDir
    ]

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
    })
  }

  generateExampleDocs(): void {
    Object.entries(EXAMPLES).forEach(([id, data]) => {
      const doc: DocTemplate = {
        type: 'example',
        id,
        title: data.title,
        description: data.description,
        tags: data.tags,
        metadata: {
          difficulty: data.difficulty,
          frameworks: [data.framework],
          providers: [data.provider]
        },
        content: {
          overview: data.description,
          capabilities: data.capabilities
        },
        relationships: {
          frameworks: [data.framework],
          providers: [data.provider]
        }
      }

      const filepath = path.join(this.config.docsDir, 'examples', `${id}.md`)
      fs.writeFileSync(filepath, docGenerator.generateStructure(doc))
      console.log(`📄 examples/${id}.md`)
    })
  }

  generateUsecaseDocs(): void {
    Object.entries(USECASES).forEach(([id, data]) => {
      const doc: DocTemplate = {
        type: 'usecase',
        id,
        title: data.title,
        description: data.description,
        tags: data.tags,
        metadata: {
          difficulty: data.difficulty,
          timeEstimate: data.timeEstimate,
          industry: data.industry,
          examples: data.examples,
          frameworks: data.frameworks,
          providers: data.providers
        },
        content: {
          overview: data.description,
          problemStatement: data.problem,
          quantumAdvantage: data.advantage,
          expectedOutcome: data.outcome
        },
        relationships: {
          examples: data.examples,
          frameworks: data.frameworks,
          providers: data.providers
        }
      }

      const filepath = path.join(this.config.docsDir, 'usecases', `${id}.md`)
      fs.writeFileSync(filepath, docGenerator.generateStructure(doc))
      console.log(`📄 usecases/${id}.md`)
    })
  }

  generateDomainDocs(): void {
    Object.entries(DOMAINS).forEach(([id, data]) => {
      const doc: DocTemplate = {
        type: 'domain',
        id,
        title: data.title,
        description: data.description,
        tags: data.tags,
        metadata: {},
        content: {
          overview: data.description,
          capabilities: data.capabilities
        },
        relationships: {}
      }

      const dirPath = path.join(this.config.docsDir, 'domains', id)
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
      }
      const filepath = path.join(dirPath, 'index.md')
      fs.writeFileSync(filepath, docGenerator.generateStructure(doc))
      console.log(`📄 domains/${id}/index.md`)
    })
  }

  generateFrameworkDocs(): void {
    Object.entries(FRAMEWORKS).forEach(([id, data]) => {
      const doc: DocTemplate = {
        type: 'framework',
        id,
        title: data.title,
        description: data.description,
        tags: data.tags,
        metadata: {},
        content: {
          overview: data.description,
          capabilities: data.capabilities
        },
        relationships: {}
      }

      const dirPath = path.join(this.config.docsDir, 'frameworks', id)
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
      }
      const filepath = path.join(dirPath, 'index.md')
      fs.writeFileSync(filepath, docGenerator.generateStructure(doc))
      console.log(`📄 frameworks/${id}/index.md`)
    })
  }

  generateProviderDocs(): void {
    Object.entries(PROVIDERS).forEach(([id, data]) => {
      const doc: DocTemplate = {
        type: 'provider',
        id,
        title: data.title,
        description: data.description,
        tags: data.tags,
        metadata: {},
        content: {
          overview: data.description,
          capabilities: data.capabilities
        },
        relationships: {}
      }

      const dirPath = path.join(this.config.docsDir, 'providers', id)
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
      }
      const filepath = path.join(dirPath, 'index.md')
      fs.writeFileSync(filepath, docGenerator.generateStructure(doc))
      console.log(`📄 providers/${id}/index.md`)
    })
  }

  generateAll(): void {
    console.log('Generating unified combinatorial docs...\n')
    console.log('📝 Examples')
    this.generateExampleDocs()
    console.log('\n📝 Use Cases')
    this.generateUsecaseDocs()
    console.log('\n📝 Domains')
    this.generateDomainDocs()
    console.log('\n📝 Frameworks')
    this.generateFrameworkDocs()
    console.log('\n📝 Providers')
    this.generateProviderDocs()
    console.log('\n✅ Unified doc generation complete')
  }
}

// Run
const config: GeneratorConfig = {
  docsDir: path.join(__dirname, '../docs/examples'),
  toolsetsDir: path.join(__dirname, '../docs/toolsets')
}

const generator = new UnifiedDocGenerator(config)
generator.generateAll()
