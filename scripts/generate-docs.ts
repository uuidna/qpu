// Combinatorial Documentation Generator
// Generates VitePress docs from test suite, adapters, and benchmarks

import * as fs from 'fs'
import * as path from 'path'

interface Adapter {
  name: string
  category: 'quantum' | 'cicd' | 'cloud'
  operations: string[]
}

interface Benchmark {
  id: string
  name: string
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  qubits: number
  description: string
}

interface Provider {
  name: string
  category: string
  errorRate: string
  qubits: string
  url: string
}

// Data definitions
const ADAPTERS: Adapter[] = [
  {
    name: 'git',
    category: 'cicd',
    operations: ['clone', 'commit', 'push', 'pull']
  },
  {
    name: 'github',
    category: 'cicd',
    operations: ['create-release', 'list-releases', 'get-release', 'update-release']
  },
  {
    name: 'zenodo',
    category: 'cicd',
    operations: ['deposit', 'publish', 'list-records', 'get-metadata']
  },
  {
    name: 'npm',
    category: 'cicd',
    operations: ['publish', 'unpublish', 'list-versions', 'get-info']
  },
  {
    name: 'deploy',
    category: 'cloud',
    operations: ['deploy-vercel', 'deploy-railway', 'deploy-flyio', 'get-status']
  },
  {
    name: 'ibm-qiskit',
    category: 'quantum',
    operations: ['submit-circuit', 'get-results', 'cancel-job', 'list-backends']
  },
  {
    name: 'aws-braket',
    category: 'quantum',
    operations: ['submit-task', 'get-result', 'get-device', 'list-devices']
  },
  {
    name: 'ionq',
    category: 'quantum',
    operations: ['submit-job', 'get-job', 'list-jobs', 'get-properties']
  },
  {
    name: 'rigetti',
    category: 'quantum',
    operations: ['run-program', 'get-results', 'list-devices', 'get-status']
  },
  {
    name: 'google-qualtran',
    category: 'quantum',
    operations: ['compile-circuit', 'optimize', 'analyze', 'get-statistics']
  },
  {
    name: 'google-openfermion',
    category: 'quantum',
    operations: ['fermionic-to-qubit', 'simulate', 'analyze', 'get-hamiltonian']
  },
  {
    name: 'google-tensorflow-quantum',
    category: 'quantum',
    operations: ['run-circuit', 'get-expectation', 'train-model', 'get-parameters']
  },
  {
    name: 'google-willow',
    category: 'quantum',
    operations: ['submit-circuit', 'get-results', 'benchmark', 'get-metrics']
  }
]

const BENCHMARKS: Benchmark[] = [
  {
    id: 'bell-state',
    name: 'Bell State',
    difficulty: 'easy',
    qubits: 2,
    description: 'Maximally entangled 2-qubit state. Tests basic entanglement.'
  },
  {
    id: 'ghz-3qubit',
    name: 'GHZ State',
    difficulty: 'easy',
    qubits: 3,
    description: '3-qubit entangled state. Tests multi-qubit entanglement.'
  },
  {
    id: 'deutsch-jozsa',
    name: 'Deutsch-Jozsa',
    difficulty: 'medium',
    qubits: 2,
    description: 'Deterministic oracle evaluation. Tests gate fidelity.'
  },
  {
    id: 'grover-search',
    name: "Grover's Search",
    difficulty: 'medium',
    qubits: 2,
    description: 'Quantum search algorithm. Tests multi-qubit gates.'
  },
  {
    id: 'qft-3qubit',
    name: 'Quantum Fourier Transform',
    difficulty: 'medium',
    qubits: 3,
    description: 'QFT circuit. Tests phase coherence.'
  },
  {
    id: 'qaoa-maxcut',
    name: 'QAOA Max-Cut',
    difficulty: 'hard',
    qubits: 3,
    description: 'Variational quantum optimization. Tests parametric circuits.'
  },
  {
    id: 'shor-15',
    name: "Shor's Algorithm",
    difficulty: 'expert',
    qubits: 4,
    description: 'Period finding for N=15. Tests quantum advantage.'
  },
  {
    id: 'vqe-h2',
    name: 'VQE H2',
    difficulty: 'expert',
    qubits: 2,
    description: 'Variational eigensolver. Tests classical-quantum hybrid.'
  }
]

const PROVIDERS: Provider[] = [
  { name: 'IBM Quantum', category: 'Trapped Ion', errorRate: '~0.1%', qubits: '5-433', url: 'ibm.com/quantum' },
  { name: 'AWS Braket', category: 'Multiple', errorRate: '~0.15%', qubits: '3-30', url: 'aws.amazon.com/braket' },
  { name: 'IonQ', category: 'Trapped Ion', errorRate: '~0.2%', qubits: '11-29', url: 'ionq.com' },
  { name: 'Rigetti', category: 'Superconducting', errorRate: '~0.3%', qubits: '30+', url: 'rigetti.com' },
  { name: 'Google Cirq', category: 'Superconducting', errorRate: '~0.05%', qubits: 'Simulator', url: 'quantumai.google' },
  { name: 'Microsoft Azure', category: 'Multiple', errorRate: 'Varies', qubits: 'Via partners', url: 'azure.microsoft.com/quantum' },
  { name: 'D-Wave', category: 'Annealing', errorRate: 'N/A', qubits: '5000+', url: 'dwavesys.com' },
  { name: 'Pasqal', category: 'Neutral Atom', errorRate: '~0.5%', qubits: '100+', url: 'pasqal.io' },
  { name: 'Atom Computing', category: 'Neutral Atom', errorRate: '~0.3%', qubits: '50+', url: 'atom-computing.com' },
  { name: 'Quantinuum', category: 'Trapped Ion', errorRate: '~0.1%', qubits: 'H-series', url: 'quantinuum.com' }
]

// Document generators
function generateQuickStart(): string {
  return `# Quick Start

## Installation

\`\`\`bash
npm install @uuidna/qpu
\`\`\`

## Register Your First API

\`\`\`javascript
// Register GitHub
await mcpTool('endpoint/register', {
  name: 'github',
  method: 'POST',
  url: 'https://api.github.com/repos/user/repo/releases',
  auth: { type: 'bearer', token: process.env.GITHUB_TOKEN }
})

// Create adapter
await mcpTool('adapter/create', { name: 'github' })

// Wire operation
await mcpTool('adapter/register-operation', {
  adapterName: 'github',
  operationName: 'create-release',
  endpointName: 'github'
})

// Execute
await mcpTool('adapter/execute', {
  adapterName: 'github',
  operationName: 'create-release',
  config: { body: { tag_name: 'v1.0.0', draft: false } }
})
\`\`\`

## Test a Quantum Circuit

\`\`\`javascript
// List benchmarks
const benchmarks = await mcpTool('quantum/list-benchmarks', {})

// Run on quantum provider
await mcpTool('quantum/run-benchmark', {
  benchmarkId: 'bell-state',
  provider: 'ibm-quantum',
  shots: 1000
})

// Get results
const results = await mcpTool('quantum/get-results', {
  benchmarkId: 'bell-state'
})
\`\`\`

## Next Steps

- [Full API Reference](/api/dynamic-adapters)
- [Quantum Providers](/apis/quantum)
- [Testing Guide](/testing/overview)
`
}

function generateProviderMatrix(): string {
  const rows = PROVIDERS.map(p =>
    `| ${p.name} | ${p.category} | ${p.errorRate} | ${p.qubits} |`
  ).join('\n')

  return `# Quantum Providers

## Quick Reference

| Provider | Type | Error Rate | Qubits |
|----------|------|-----------|--------|
${rows}

## Provider Details

${PROVIDERS.map(p => `### ${p.name}
- **Type**: ${p.category}
- **Error Rate**: ${p.errorRate}
- **Qubits**: ${p.qubits}
- **Website**: ${p.url}`).join('\n\n')}
`
}

function generateBenchmarkDocs(): string {
  const byDifficulty = {
    easy: BENCHMARKS.filter(b => b.difficulty === 'easy'),
    medium: BENCHMARKS.filter(b => b.difficulty === 'medium'),
    hard: BENCHMARKS.filter(b => b.difficulty === 'hard'),
    expert: BENCHMARKS.filter(b => b.difficulty === 'expert')
  }

  let doc = `# Quantum Benchmarks

## Overview

Standard quantum circuits for cross-platform testing and validation.

`

  for (const [difficulty, benchmarks] of Object.entries(byDifficulty)) {
    doc += `## ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Benchmarks\n\n`
    for (const b of benchmarks) {
      doc += `### ${b.name}
- **ID**: \`${b.id}\`
- **Qubits**: ${b.qubits}
- **Description**: ${b.description}

\`\`\`javascript
await mcpTool('quantum/run-benchmark', {
  benchmarkId: '${b.id}',
  provider: 'ibm-quantum',
  shots: 1000
})
\`\`\`

`
    }
  }

  return doc
}

function generateAdapterDocs(): string {
  const byCategory = {
    cicd: ADAPTERS.filter(a => a.category === 'cicd'),
    cloud: ADAPTERS.filter(a => a.category === 'cloud'),
    quantum: ADAPTERS.filter(a => a.category === 'quantum')
  }

  let doc = `# Available Adapters

## CI/CD Tools\n\n`

  for (const adapter of byCategory.cicd) {
    doc += `### ${adapter.name}
Operations: ${adapter.operations.join(', ')}

\`\`\`javascript
await mcpTool('adapter/register-operation', {
  adapterName: '${adapter.name}',
  operationName: '${adapter.operations[0]}',
  endpointName: '${adapter.name}'
})
\`\`\`

`
  }

  doc += `## Cloud Deployment\n\n`
  for (const adapter of byCategory.cloud) {
    doc += `### ${adapter.name}
Operations: ${adapter.operations.join(', ')}\n\n`
  }

  doc += `## Quantum Providers\n\n`
  for (const adapter of byCategory.quantum) {
    doc += `### ${adapter.name}
Operations: ${adapter.operations.join(', ')}\n\n`
  }

  return doc
}

function generateToolReference(): string {
  return `# Dynamic Adapter Tools

## endpoint/register

Register a new API endpoint.

\`\`\`javascript
await mcpTool('endpoint/register', {
  name: 'github-releases',
  method: 'POST',
  url: 'https://api.github.com/repos/user/repo/releases',
  auth: { type: 'bearer', token: 'xxx' }
})
\`\`\`

## adapter/create

Create an adapter for an endpoint.

\`\`\`javascript
await mcpTool('adapter/create', {
  name: 'github',
  version: '1.0.0'
})
\`\`\`

## adapter/register-operation

Wire an operation to an endpoint.

\`\`\`javascript
await mcpTool('adapter/register-operation', {
  adapterName: 'github',
  operationName: 'create-release',
  endpointName: 'github-releases'
})
\`\`\`

## adapter/execute

Execute an operation.

\`\`\`javascript
await mcpTool('adapter/execute', {
  adapterName: 'github',
  operationName: 'create-release',
  config: { body: { tag_name: 'v1.0.0' } }
})
\`\`\`

## Registry Tools

List endpoints, adapters, describe adapters, and view execution history.

\`\`\`javascript
await mcpTool('registry/list-endpoints', {})
await mcpTool('registry/list-adapters', {})
await mcpTool('registry/describe-adapter', { adapterName: 'github' })
await mcpTool('registry/execution-history', { limit: 20 })
\`\`\`
`
}

// Main generation
async function generateDocs() {
  console.log('📖 Generating VitePress documentation...\n')

  const docsDir = path.join(process.cwd(), 'docs')

  // Create directories
  const dirs = [
    'guide',
    'concepts',
    'apis',
    'api',
    'testing'
  ]

  for (const dir of dirs) {
    const fullPath = path.join(docsDir, dir)
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true })
    }
  }

  // Generate files
  const files: [string, string][] = [
    ['guide/quick-start.md', generateQuickStart()],
    ['testing/benchmarks.md', generateBenchmarkDocs()],
    ['apis/quantum.md', generateProviderMatrix()],
    ['api/dynamic-adapters.md', generateToolReference()],
    ['api/adapters.md', generateAdapterDocs()]
  ]

  for (const [filePath, content] of files) {
    const fullPath = path.join(docsDir, filePath)
    fs.writeFileSync(fullPath, content)
    console.log(`✓ Generated ${filePath}`)
  }

  console.log(`\n✅ Generated ${files.length} documentation files`)
}

generateDocs().catch(console.error)

export { ADAPTERS, BENCHMARKS, PROVIDERS }
