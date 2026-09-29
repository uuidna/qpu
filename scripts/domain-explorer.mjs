#!/usr/bin/env node
/** Domain Explorer - Cross-domain analysis and bridge discovery */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dir = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dir, '..')

class DomainExplorer {
  constructor() {
    this.domains = []
    this.algorithms = new Set()
    this.bridges = []
    this.opportunities = []
  }

  scanDomains() {
    console.log('🔍 Scanning domains...\n')

    const domainsPath = path.join(ROOT, 'domains')
    if (!fs.existsSync(domainsPath)) return

    const dirs = fs.readdirSync(domainsPath)
    for (const dir of dirs) {
      const domainPath = path.join(domainsPath, dir)
      if (!fs.statSync(domainPath).isDirectory()) continue

      const files = fs.readdirSync(domainPath)
      const tsFiles = files.filter(f => f.endsWith('.ts'))

      if (tsFiles.length > 0) {
        const domain = {
          name: dir,
          files: tsFiles,
          algorithms: this.extractAlgorithms(domainPath, tsFiles),
          tools: this.extractTools(domainPath, tsFiles),
        }
        this.domains.push(domain)
        console.log(`✅ ${dir}: ${domain.algorithms.join(', ')}`)
      }
    }

    console.log(`\n Found ${this.domains.length} domains\n`)
  }

  extractAlgorithms(domainPath, files) {
    const algos = new Set()
    const qpuMethods = [
      'shorFactor', 'groverSearch', 'knapsack', 'hamiltonianSimulation',
      'graphColoring', 'discreteLog', 'batchFactor'
    ]

    for (const file of files) {
      const content = fs.readFileSync(path.join(domainPath, file), 'utf8')
      for (const algo of qpuMethods) {
        if (content.includes(algo)) {
          algos.add(algo)
          this.algorithms.add(algo)
        }
      }
    }

    return Array.from(algos)
  }

  extractTools(domainPath, files) {
    const tools = new Set()
    for (const file of files) {
      const content = fs.readFileSync(path.join(domainPath, file), 'utf8')
      const matches = content.match(/async\s+(\w+)\s*\(/g) || []
      matches.forEach(m => {
        const name = m.replace(/async\s+|\(/g, '').trim()
        if (name.length > 2) tools.add(name)
      })
    }
    return Array.from(tools)
  }

  discoverBridges() {
    console.log('🌉 Discovering domain bridges...\n')

    // Domains sharing algorithms can be bridged
    for (let i = 0; i < this.domains.length; i++) {
      for (let j = i + 1; j < this.domains.length; j++) {
        const d1 = this.domains[i]
        const d2 = this.domains[j]

        const shared = d1.algorithms.filter(a => d2.algorithms.includes(a))
        if (shared.length > 0) {
          const bridge = {
            from: d1.name,
            to: d2.name,
            algorithms: shared,
            strength: shared.length,
          }
          this.bridges.push(bridge)

          console.log(`✅ ${d1.name} ↔ ${d2.name}`)
          console.log(`   Via: ${shared.join(', ')}\n`)
        }
      }
    }

    console.log(`Found ${this.bridges.length} bridges\n`)
  }

  identifyOpportunities() {
    console.log('💡 Identifying expansion opportunities...\n')

    const algoUsage = {}
    for (const algo of this.algorithms) {
      const count = this.domains.filter(d => d.algorithms.includes(algo)).length
      algoUsage[algo] = count
    }

    const mostUsed = Object.entries(algoUsage)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)

    console.log('🎯 Most versatile algorithms:')
    mostUsed.forEach(([algo, count]) => {
      console.log(`   ${algo}: used in ${count} domains`)

      // Suggest new domain applications
      const suggestions = this.suggestNewDomains(algo)
      suggestions.forEach(s => {
        console.log(`      → ${s}`)
        this.opportunities.push({
          algorithm: algo,
          domain: s,
          potential: 'high',
        })
      })
    })

    console.log()
  }

  suggestNewDomains(algorithm) {
    const suggestions = {
      shorFactor: [
        'Quantum Key Distribution',
        'Digital Signatures',
        'Hash Inversion',
        'Blockchain Security',
      ],
      groverSearch: [
        'Database Search',
        'Quantum Sensing',
        'Pattern Matching',
        'Anomaly Detection',
      ],
      knapsack: [
        'Resource Allocation',
        'Supply Chain',
        'Logistics',
        'Scheduling',
      ],
      hamiltonianSimulation: [
        'Materials Science',
        'Quantum Chemistry',
        'Drug Simulation',
        'Molecular Design',
      ],
      graphColoring: [
        'Network Routing',
        'Compiler Optimization',
        'Map Coloring',
        'Frequency Assignment',
      ],
    }

    return suggestions[algorithm] || []
  }

  generateBridgeCode() {
    console.log('🔧 Generating cross-domain bridges...\n')

    const bridges = []
    for (const bridge of this.bridges) {
      const code = `
// Bridge: ${bridge.from} ↔ ${bridge.to}
export const bridge${bridge.from}To${bridge.to} = {
  shared: ['${bridge.algorithms.join("', '")}'],
  transfer: async (data) => {
    // Convert ${bridge.from} format to ${bridge.to} format
    return await solver.solve(data)
  }
}
`
      bridges.push(code)
    }

    const bridgeFile = path.join(ROOT, 'src/quantum/bridges.ts')
    const header = `/** Cross-Domain Bridges - ${this.bridges.length} connections */\n`
    const content = header + bridges.join('\n')

    fs.writeFileSync(bridgeFile, content)
    console.log(`✅ Generated bridges.ts (${this.bridges.length} bridges)\n`)
  }

  exploreNewDomains() {
    console.log('🚀 New domain possibilities:\n')

    const newDomains = [
      {
        name: 'Quantum Sensing',
        description: 'Precision measurement and sensor optimization',
        algorithms: ['groverSearch', 'hamiltonianSimulation'],
        potential: '⭐⭐⭐⭐⭐',
      },
      {
        name: 'Materials Science',
        description: 'Molecular structure and property prediction',
        algorithms: ['hamiltonianSimulation', 'graphColoring'],
        potential: '⭐⭐⭐⭐⭐',
      },
      {
        name: 'Quantum Chemistry',
        description: 'Reaction simulation and molecular optimization',
        algorithms: ['hamiltonianSimulation', 'knapsack'],
        potential: '⭐⭐⭐⭐⭐',
      },
      {
        name: 'Network Optimization',
        description: 'Routing, bandwidth allocation, topology design',
        algorithms: ['graphColoring', 'knapsack', 'groverSearch'],
        potential: '⭐⭐⭐⭐',
      },
      {
        name: 'Supply Chain',
        description: 'Logistics optimization and resource allocation',
        algorithms: ['knapsack', 'groverSearch'],
        potential: '⭐⭐⭐⭐',
      },
    ]

    newDomains.forEach(domain => {
      console.log(`${domain.name} ${domain.potential}`)
      console.log(`  ${domain.description}`)
      console.log(`  Algorithms: ${domain.algorithms.join(', ')}\n`)
    })
  }

  generateReport() {
    console.log('═'.repeat(70))
    console.log('📊 DOMAIN EXPLORATION REPORT')
    console.log('═'.repeat(70))

    const report = {
      timestamp: new Date().toISOString(),
      domains: this.domains.map(d => ({
        name: d.name,
        algorithms: d.algorithms,
        tools: d.tools,
      })),
      algorithms: Array.from(this.algorithms),
      bridges: this.bridges,
      opportunities: this.opportunities,
      suggestions: {
        newDomains: 5,
        possibleBridges: Math.pow(this.domains.length, 2) - this.domains.length,
        algorithmCombinations: Array.from(this.algorithms).length,
      },
    }

    const reportPath = path.join(ROOT, '.domain-report.json')
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

    console.log(`\n✅ Domains discovered: ${this.domains.length}`)
    console.log(`✅ Algorithms identified: ${this.algorithms.size}`)
    console.log(`✅ Bridges discovered: ${this.bridges.length}`)
    console.log(`✅ New opportunities: ${this.opportunities.length}`)
    console.log(`✅ Possible new domains: 5`)

    console.log(`\n📁 Report saved to .domain-report.json`)
    console.log('═'.repeat(70) + '\n')
  }

  async run() {
    console.log('\n🤖 DOMAIN EXPLORER - Cross-Domain Analysis\n')
    console.log('═'.repeat(70) + '\n')

    this.scanDomains()
    this.discoverBridges()
    this.identifyOpportunities()
    this.exploreNewDomains()
    this.generateBridgeCode()
    this.generateReport()

    console.log('✅ Domain exploration complete.')
  }
}

const explorer = new DomainExplorer()
await explorer.run()
