#!/usr/bin/env node
/** Auto-Optimizer - Continuous performance improvements */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { tenOf } from './lattice-values.mjs'

const __dir = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dir, '..')

class AutoOptimizer {
  constructor() {
    this.metrics = {}
    this.improvements = []
  }

  // Analyze code for optimization opportunities
  analyzeCode() {
    console.log('📊 Analyzing codebase...')

    const files = this.findFiles(ROOT, ['.ts', '.js', '.go'],
      f => !f.includes('node_modules') && !f.includes('dist'))

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8')
      const lines = content.split('\n')

      // Check for optimization patterns
      if (content.includes('for (let') && content.includes('array')) {
        this.suggest(`Use array methods instead of loops in ${path.relative(ROOT, file)}`)
      }

      if (content.match(/function\s+\w+\([^)]{50,}/)) {
        this.suggest(`Reduce function parameter count in ${path.relative(ROOT, file)}`)
      }

      if (lines.filter(l => l.match(/^\s*\/\//)).length > lines.length * 0.2) {
        this.suggest(`High comment ratio in ${path.relative(ROOT, file)} - simplify code`)
      }

      if (content.match(/try\s*{[\s\S]*?catch[\s\S]*?finally/)) {
        this.suggest(`Complex error handling in ${path.relative(ROOT, file)} - extract method`)
      }
    }
  }

  // Monitor performance metrics
  monitorPerformance() {
    console.log('⚡ Monitoring performance...')

    try {
      const result = execSync('npm test 2>&1 || true', { encoding: 'utf8' })

      if (result.includes('duration_ms')) {
        const matches = result.match(/duration_ms[:"]*\s*(\d+)/g) || []
        const times = matches.map(m => parseInt(m.match(/\d+/)[0]))
        const avg = times.length ? times.reduce((a, b) => a + b) / times.length : 0

        this.metrics.avgTestTime = avg
        if (avg > tenOf(2)) this.suggest('Tests taking >100ms - optimize hot paths')
      }
    } catch {}
  }

  // Check code duplication
  detectDuplication() {
    console.log('🔍 Detecting code duplication...')

    const files = this.findFiles(ROOT, ['.ts', '.js'],
      f => !f.includes('node_modules') && !f.includes('dist') && !f.includes('test'))

    const functionMap = new Map()

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8')
      const funcs = content.match(/(?:async\s+)?(?:function|const)\s+\w+\s*[=\(]/g) || []

      for (const func of funcs) {
        const key = func.replace(/async\s+|const\s+|function\s+|=|\(/g, '').trim()
        if (!functionMap.has(key)) functionMap.set(key, [])
        functionMap.get(key).push(file)
      }
    }

    for (const [name, files] of functionMap) {
      if (files.length > 2) {
        this.suggest(`Function "${name}" defined in multiple places: ${files.map(f => path.relative(ROOT, f)).join(', ')}`)
      }
    }
  }

  // Suggest dependency optimization
  optimizeDependencies() {
    console.log('📦 Analyzing dependencies...')

    const pkgPath = path.join(ROOT, 'package.json')
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies }

      const depCount = Object.keys(allDeps).length
      if (depCount > 20) {
        this.suggest(`High dependency count (${depCount}) - audit unused packages`)
      }
    }
  }

  // Check for dead code
  findDeadCode() {
    console.log('💀 Scanning for dead code...')

    const files = this.findFiles(ROOT, ['.ts', '.js'],
      f => !f.includes('node_modules') && !f.includes('dist') && !f.includes('test'))

    const exports = new Set()
    const imports = new Set()

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8')

      // Find exports
      const exporting = content.match(/export\s+(?:const|function|class|default)\s+(\w+)/g) || []
      exporting.forEach(e => {
        const name = e.match(/\w+$/)[0]
        exports.add(name)
      })

      // Find imports
      const importing = content.match(/import\s+(?:{[^}]*}|[^,]+)/g) || []
      importing.forEach(i => {
        const names = i.match(/\w+/g) || []
        names.forEach(n => imports.add(n))
      })
    }

    const unused = Array.from(exports).filter(e => !imports.has(e))
    if (unused.length > 0) {
      this.suggest(`Potentially unused exports: ${unused.slice(0, 5).join(', ')}`)
    }
  }

  // Auto-fix simple issues
  autoFix() {
    console.log('🔧 Auto-fixing...')

    let fixed = 0
    const files = this.findFiles(ROOT, ['.ts', '.js'],
      f => !f.includes('node_modules') && !f.includes('dist'))

    for (const file of files) {
      let content = fs.readFileSync(file, 'utf8')
      const original = content

      // Remove trailing whitespace
      content = content.replace(/[ \t]+$/gm, '')

      // Fix spacing in imports
      content = content.replace(/import\s+{\s+/g, 'import { ').replace(/\s+}/g, ' }')

      // Remove unnecessary semicolons in TS
      if (file.endsWith('.ts')) {
        content = content.replace(/;(\s*$)/gm, '$1')
      }

      if (content !== original) {
        fs.writeFileSync(file, content)
        fixed++
      }
    }

    if (fixed > 0) {
      this.improvements.push(`Auto-fixed formatting in ${fixed} files`)
    }
  }

  // Generate optimization report
  report() {
    console.log('\n' + '='.repeat(60))
    console.log('📈 OPTIMIZATION REPORT')
    console.log('='.repeat(60))

    if (this.improvements.length > 0) {
      console.log('\n✅ Improvements Made:')
      this.improvements.forEach((imp, i) => {
        console.log(`  ${i + 1}. ${imp}`)
      })
    }

    console.log('\n💡 Suggestions:')
    const uniqueSuggestions = [...new Set(this.suggestions || [])]
    if (uniqueSuggestions.length > 0) {
      uniqueSuggestions.slice(0, tenOf(1)).forEach((sug, i) => {
        console.log(`  ${i + 1}. ${sug}`)
      })
    } else {
      console.log('  No optimization suggestions at this time.')
    }

    if (this.metrics.avgTestTime) {
      console.log(`\n📊 Metrics:`)
      console.log(`  Average test time: ${Math.round(this.metrics.avgTestTime)}ms`)
    }

    console.log('\n' + '='.repeat(60) + '\n')
  }

  suggest(message) {
    if (!this.suggestions) this.suggestions = []
    this.suggestions.push(message)
  }

  findFiles(dir, extensions, filter = () => true) {
    const files = []
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      for (const entry of entries) {
        if (entry.name.startsWith('.')) continue
        const fullPath = path.join(dir, entry.name)
        if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext)) && filter(fullPath)) {
          files.push(fullPath)
        } else if (entry.isDirectory() && !entry.name.includes('node_modules') && !entry.name.includes('dist')) {
          files.push(...this.findFiles(fullPath, extensions, filter))
        }
      }
    } catch {}
    return files
  }

  async run() {
    console.log('🤖 AUTONOMOUS OPTIMIZER STARTING\n')

    this.analyzeCode()
    this.monitorPerformance()
    this.detectDuplication()
    this.optimizeDependencies()
    this.findDeadCode()
    this.autoFix()
    this.report()

    console.log('✅ Optimization complete.')
  }
}

// Run
const optimizer = new AutoOptimizer()
await optimizer.run()
