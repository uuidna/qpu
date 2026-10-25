// Featured Docs Generator with Frontmatter & Toolsets
// Generate clean, discoverable documentation with executable toolsets

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface DocMeta {
  title: string
  description: string
  tags: string[]
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  timeEstimate?: string
  industry?: string
  examples?: string[]
  frameworks?: string[]
  providers?: string[]
}

interface Toolset {
  id: string
  name: string
  description: string
  category: 'domain' | 'example' | 'usecase' | 'framework'
  tools: {
    name: string
    description: string
    command: string
    inputs: Record<string, string>
    outputs: string[]
  }[]
}

// Use case data with full metadata
const USECASES_FULL = {
  'qkd-quantum-key-distribution': {
    title: 'Quantum Key Distribution (QKD)',
    description: 'Establish theoretically unbreakable cryptographic keys using quantum entanglement',
    tags: ['cryptography', 'security', 'entanglement', 'communication'],
    difficulty: 'intermediate' as const,
    timeEstimate: '2-3 hours',
    industry: 'Cybersecurity',
    examples: ['qiskit-bell-state', 'cirq-ghz-state'],
    frameworks: ['qiskit', 'cirq'],
    providers: ['ibm-quantum', 'google-cirq'],
    problem: 'Traditional encryption vulnerable to quantum computers. Need theoretically unbreakable key distribution.',
    advantage: 'Bell states guarantee security through quantum mechanics: any eavesdropping detectable.',
    outcome: 'Secure key establishment between parties with eavesdropping detection',
    resources: ['2-qubit device', 'Classical post-processing', 'Quantum channel'],
    toolset: {
      id: 'qkd-toolset',
      tools: [
        {
          name: 'qkd-prepare-keys',
          desc: 'Prepare quantum key using Bell states',
          cmd: 'qpu examples run qiskit-bell-state --shots 1000'
        },
        {
          name: 'qkd-measure-eavesdrop',
          desc: 'Detect eavesdropping via entanglement breaking',
          cmd: 'qpu examples native-proof qiskit-bell-state'
        },
        {
          name: 'qkd-compare-providers',
          desc: 'Compare QKD security across providers',
          cmd: 'qpu examples compare qiskit-bell-state --providers ibm-quantum,google-cirq'
        }
      ]
    }
  },

  'unstructured-search': {
    title: 'Unstructured Database Search (Grover)',
    description: 'Search unsorted databases 100× faster than classical algorithms',
    tags: ['search', 'algorithm', 'amplitude-amplification', 'speedup'],
    difficulty: 'advanced' as const,
    timeEstimate: '3-4 hours',
    industry: 'Database Systems',
    examples: ['pyquil-grover'],
    frameworks: ['pyquil', 'qiskit'],
    providers: ['rigetti', 'ibm-quantum'],
    problem: 'Search N items: classical O(N), quantum O(√N)',
    advantage: 'Amplitude amplification: mark solutions, interfere to amplify probability.',
    outcome: 'Find marked element with >80% probability in √N iterations',
    resources: ['3-4 qubit device', 'Controlled-Z gates', 'High fidelity'],
    toolset: {
      id: 'grover-toolset',
      tools: [
        {
          name: 'grover-mark-solution',
          desc: 'Mark solution state in oracle',
          cmd: 'qpu examples run pyquil-grover --shots 1000'
        },
        {
          name: 'grover-measure-amplification',
          desc: 'Measure amplitude amplification factor',
          cmd: 'qpu examples native-proof pyquil-grover'
        },
        {
          name: 'grover-scale-analysis',
          desc: 'Analyze speedup as problem scales',
          cmd: 'qpu examples run pyquil-grover --analysis-scale'
        }
      ]
    }
  },

  'quantum-classification': {
    title: 'Quantum Classification with Neural Networks',
    description: 'Classify data using quantum neural network circuits',
    tags: ['machine-learning', 'classification', 'variational', 'pennylane'],
    difficulty: 'intermediate' as const,
    timeEstimate: '3-4 hours',
    industry: 'Machine Learning',
    examples: ['pennylane-deutsch-jozsa'],
    frameworks: ['pennylane'],
    providers: ['ionq'],
    problem: 'Deep networks expensive to train. Quantum may learn faster.',
    advantage: 'Quantum feature space: encode data in quantum state, measure separation.',
    outcome: 'Train quantum classifier with >85% accuracy on test set',
    resources: ['4-6 qubits', 'Measurement-based learning', 'Variational circuit'],
    toolset: {
      id: 'qml-classification-toolset',
      tools: [
        {
          name: 'qml-prepare-data',
          desc: 'Encode classical data into quantum state',
          cmd: 'qpu examples run pennylane-deutsch-jozsa --encode-data'
        },
        {
          name: 'qml-train-classifier',
          desc: 'Train variational quantum classifier',
          cmd: 'qpu examples run pennylane-deutsch-jozsa --train --epochs 100'
        },
        {
          name: 'qml-evaluate-accuracy',
          desc: 'Evaluate classifier on test set',
          cmd: 'qpu examples run pennylane-deutsch-jozsa --evaluate'
        }
      ]
    }
  }
}

function generateFrontmatter(meta: DocMeta): string {
  return `---
title: "${meta.title}"
description: "${meta.description}"
tags: [${meta.tags.map(t => `"${t}"`).join(', ')}]
${meta.difficulty ? `difficulty: "${meta.difficulty}"` : ''}
${meta.timeEstimate ? `timeEstimate: "${meta.timeEstimate}"` : ''}
${meta.industry ? `industry: "${meta.industry}"` : ''}
${meta.examples ? `examples: [${meta.examples.map(e => `"${e}"`).join(', ')}]` : ''}
${meta.frameworks ? `frameworks: [${meta.frameworks.map(f => `"${f}"`).join(', ')}]` : ''}
${meta.providers ? `providers: [${meta.providers.map(p => `"${p}"`).join(', ')}]` : ''}
---\n`
}

function generateUsecaseDoc(id: string, data: any): string {
  const meta: DocMeta = {
    title: data.title,
    description: data.description,
    tags: data.tags,
    difficulty: data.difficulty,
    timeEstimate: data.timeEstimate,
    industry: data.industry,
    examples: data.examples,
    frameworks: data.frameworks,
    providers: data.providers
  }

  let doc = generateFrontmatter(meta)

  doc += `# ${data.title}\n\n`
  doc += `## Overview\n\n`
  doc += `**Industry:** ${data.industry} | **Difficulty:** ${data.difficulty} | **Time:** ${data.timeEstimate}\n\n`
  doc += `${data.description}\n\n`

  doc += `## The Problem\n\n`
  doc += `${data.problem}\n\n`

  doc += `## Quantum Advantage\n\n`
  doc += `${data.advantage}\n\n`

  doc += `## Expected Outcome\n\n`
  doc += `${data.outcome}\n\n`

  doc += `## Examples\n\n`
  data.examples.forEach((ex: string) => {
    doc += `- [\`${ex}\`](/examples/examples/${ex}/)\n`
  })

  doc += `\n## Frameworks\n\n`
  data.frameworks.forEach((fw: string) => {
    doc += `- [\`${fw}\`](/examples/frameworks/${fw}/)\n`
  })

  doc += `\n## Providers\n\n`
  data.providers.forEach((prov: string) => {
    doc += `- [\`${prov}\`](/examples/providers/${prov}/)\n`
  })

  doc += `\n## Resources Required\n\n`
  data.resources.forEach((res: string) => {
    doc += `- ${res}\n`
  })

  doc += `\n## Toolset\n\n`
  doc += `This use case is fully executable via MCP toolset:\n\n`
  doc += '```bash\n'
  data.toolset.tools.forEach((tool: any) => {
    doc += `# ${tool.desc}\n`
    doc += `${tool.cmd}\n\n`
  })
  doc += '```\n\n'

  doc += `## Quick Start\n\n`
  doc += `### 1. Prepare\n\n`
  doc += `\`\`\`javascript\n`
  doc += `const example = await mcpTool('examples/get', {\n`
  doc += `  exampleId: '${data.examples[0]}'\n`
  doc += `})\n`
  doc += `\`\`\`\n\n`

  doc += `### 2. Run\n\n`
  doc += `\`\`\`javascript\n`
  doc += `const result = await mcpTool('examples/run', {\n`
  doc += `  exampleId: '${data.examples[0]}',\n`
  doc += `  provider: '${data.providers[0]}'\n`
  doc += `})\n`
  doc += `\`\`\`\n\n`

  doc += `### 3. Validate\n\n`
  doc += `\`\`\`javascript\n`
  doc += `const proof = await mcpTool('examples/native-proof', {\n`
  doc += `  exampleId: '${data.examples[0]}'\n`
  doc += `})\n`
  doc += `\`\`\`\n\n`

  doc += `## Success Criteria\n\n`
  doc += `- [ ] Example runs without error\n`
  doc += `- [ ] Fidelity > 90%\n`
  doc += `- [ ] Native computation proven\n`
  doc += `- [ ] Results match expected behavior\n\n`

  doc += `## Related Use Cases\n\n`
  doc += `- See [Domain: ${data.tags[0]}](/examples/domains/${data.tags[0]}/)\n`
  doc += `- See [Industry: ${data.industry}](/examples/industries/${data.industry.toLowerCase().replace(/\\s/g, '-')}/)\n\n`

  doc += `## Learn More\n\n`
  doc += `- [Examples at Scale](/guides/examples-at-scale.md)\n`
  doc += `- [Framework Guide](/guides/framework-integration.md)\n`
  doc += `- [Native Validation](/guides/native-validation.md)\n`

  return doc
}

function generateToolsetJSON(usecase: any): Toolset {
  return {
    id: usecase.toolset.id,
    name: usecase.title,
    description: usecase.description,
    category: 'usecase',
    tools: usecase.toolset.tools.map((t: any) => ({
      name: t.name,
      description: t.desc,
      command: t.cmd,
      inputs: {
        'exampleId': usecase.examples[0],
        'provider': usecase.providers[0],
        'shots': '1000'
      },
      outputs: ['receipt', 'fidelity', 'nativeComputation', 'hardwareMetrics']
    }))
  }
}

async function generateAll() {
  console.log('Generating featured docs with frontmatter and toolsets...\n')

  const docsDir = path.join(__dirname, '../docs/examples')
  const toolsetsDir = path.join(__dirname, '../docs/toolsets')

  if (!fs.existsSync(toolsetsDir)) {
    fs.mkdirSync(toolsetsDir, { recursive: true })
  }

  let toolsetRegistry = { toolsets: [] as Toolset[] }

  // Generate use case docs with frontmatter
  for (const [id, data] of Object.entries(USECASES_FULL)) {
    const doc = generateUsecaseDoc(id, data)
    const filepath = path.join(docsDir, 'usecases', `${id}.md`)

    fs.writeFileSync(filepath, doc)
    console.log(`📄 ${id}.md (with frontmatter)`)

    // Generate toolset JSON
    const toolset = generateToolsetJSON(data)
    const toolsetPath = path.join(toolsetsDir, `${id}-toolset.json`)
    fs.writeFileSync(toolsetPath, JSON.stringify(toolset, null, 2))
    console.log(`🛠️  ${id}-toolset.json`)

    toolsetRegistry.toolsets.push(toolset)
  }

  // Write master toolset registry
  const registryPath = path.join(toolsetsDir, 'registry.json')
  fs.writeFileSync(registryPath, JSON.stringify(toolsetRegistry, null, 2))
  console.log(`\n📋 toolsets/registry.json (master registry)`)

  console.log(`\n✅ Generated featured documentation`)
  console.log(`   - ${Object.keys(USECASES_FULL).length} use case docs with frontmatter`)
  console.log(`   - ${Object.keys(USECASES_FULL).length} toolset JSON files`)
  console.log(`   - 1 master toolset registry`)
}

generateAll().catch(console.error)
