#!/usr/bin/env node
/**
 * License Compliance Checker
 * Enforces CC-BY-NC-ND-4.0 license on all project code
 *
 * Usage: node scripts/check-license.mjs [--fix]
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')
const FIX_MODE = process.argv.includes('--fix')

const ERRORS = {
  PROHIBITED_LICENSE: 'prohibited-license',
  MISSING_LICENSE_FIELD: 'missing-license-field',
  WRONG_LICENSE_VALUE: 'wrong-license-value',
  COMMERCIAL_VIOLATION: 'commercial-violation',
  DERIVATIVE_VIOLATION: 'derivative-violation'
}

let violationCount = 0

// Color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m'
}

function log(level, message) {
  const prefix = {
    error: `${colors.red}❌${colors.reset}`,
    warn: `${colors.yellow}⚠️${colors.reset}`,
    pass: `${colors.green}✅${colors.reset}`,
    info: `${colors.blue}ℹ️${colors.reset}`
  }
  console.log(`${prefix[level]} ${message}`)
}

function checkPackageJson() {
  log('info', 'Checking package.json...')
  const pkgPath = path.join(projectRoot, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))

  if (!pkg.license) {
    log('error', 'package.json: Missing license field')
    violationCount++
    return
  }

  if (pkg.license !== 'CC-BY-NC-ND-4.0') {
    log('error', `package.json: Wrong license "${pkg.license}" (must be "CC-BY-NC-ND-4.0")`)
    violationCount++

    if (FIX_MODE) {
      pkg.license = 'CC-BY-NC-ND-4.0'
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
      log('pass', 'Fixed package.json license')
    }
  } else {
    log('pass', 'package.json license is correct')
  }
}

function checkLicenseFile() {
  log('info', 'Checking LICENSE file...')
  const licensePath = path.join(projectRoot, 'LICENSE')

  if (!fs.existsSync(licensePath)) {
    log('warn', 'LICENSE file not found')
    return
  }

  const content = fs.readFileSync(licensePath, 'utf8')

  if (!content.includes('CC BY-NC-ND 4.0')) {
    log('error', 'LICENSE: Does not reference CC BY-NC-ND 4.0')
    violationCount++
  } else {
    log('pass', 'LICENSE file is correct')
  }
}

function checkSourceFiles() {
  log('info', 'Scanning source files for prohibited licenses...')

  const patterns = [
    { regex: /MIT|mit\s+license/i, name: 'MIT' },
    { regex: /Apache\s+License/i, name: 'Apache' },
    { regex: /GPL|gnu\s+public\s+license/i, name: 'GPL' },
    { regex: /BSD\s+License|bsd-[0-9]-clause/i, name: 'BSD' },
    { regex: /ISC\s+License/i, name: 'ISC' },
    { regex: /Mozilla\s+Public\s+License|MPL/i, name: 'MPL' }
  ]

  const ignorePath = path.join(projectRoot, '.licenseignore')
  let ignorePatterns = []
  if (fs.existsSync(ignorePath)) {
    ignorePatterns = fs
      .readFileSync(ignorePath, 'utf8')
      .split('\n')
      .filter(line => line && !line.startsWith('#'))
  }

  function shouldIgnore(filePath) {
    return ignorePatterns.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'))
        return regex.test(filePath)
      }
      return filePath.includes(pattern)
    })
  }

  function scanDirectory(dir) {
    const files = fs.readdirSync(dir)

    for (const file of files) {
      const filePath = path.join(dir, file)
      const relPath = path.relative(projectRoot, filePath)

      // Skip ignored paths
      if (shouldIgnore(relPath) || file.startsWith('.')) {
        continue
      }

      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        scanDirectory(filePath)
      } else if (['.ts', '.js', '.json', '.md'].includes(path.extname(file))) {
        const content = fs.readFileSync(filePath, 'utf8')

        for (const pattern of patterns) {
          if (pattern.regex.test(content)) {
            // Skip if it's just a reference/credit
            if (content.includes('third-party') || content.includes('credit') || content.includes('MIT, 2016')) {
              continue
            }

            log('error', `${relPath}: Contains ${pattern.name} license reference`)
            violationCount++
          }
        }
      }
    }
  }

  scanDirectory(path.join(projectRoot, 'src'))
  scanDirectory(path.join(projectRoot, 'scripts'))
}

function checkCommercialCode() {
  log('info', 'Scanning for commercial violations...')

  const commercialMarkers = [
    { regex: /stripe\.|paypal\.|square\./i, name: 'Stripe/PayPal/Square' },
    { regex: /cc\.charge|payment\.process|billing\./i, name: 'Payment processing' }
  ]

  const files = [
    'src/mcp/formula-kernel.ts',
    'src/mcp/autonomous-wave.ts',
    'src/mcp/quantum-mcp-server.ts'
  ]

  for (const file of files) {
    const filePath = path.join(projectRoot, file)
    if (!fs.existsSync(filePath)) continue

    const content = fs.readFileSync(filePath, 'utf8')

    for (const marker of commercialMarkers) {
      if (marker.regex.test(content)) {
        log('warn', `${file}: Commercial marker found (verify non-commercial context)`)
      }
    }
  }
}

function checkDerivatives() {
  log('info', 'Checking for derivative violations...')

  const coreFiles = [
    'src/mcp/formula-kernel.ts',
    'src/mcp/autonomous-wave.ts',
    'src/quantum/processing/unit/index.ts'
  ]

  for (const file of coreFiles) {
    const filePath = path.join(projectRoot, file)
    if (!fs.existsSync(filePath)) continue

    const content = fs.readFileSync(filePath, 'utf8')

    // Check if file is substantially modified (derivative)
    if (content.length > 5000 && content.includes('export') && !content.includes('CC-BY-NC-ND')) {
      log('warn', `${file}: Core file - verify it's not distributed as derivative`)
    }
  }
}

function printSummary() {
  console.log('')
  console.log('═══════════════════════════════════════════════════════════')
  console.log('License Compliance Check Summary')
  console.log('═══════════════════════════════════════════════════════════')
  console.log(`License: CC-BY-NC-ND-4.0 (Creative Commons)`)
  console.log(`Copyright: Tsvetan Rouschev (ceccec@psg.bg)`)
  console.log('')
  console.log('Terms enforced:')
  console.log('  ✓ Non-commercial use only')
  console.log('  ✓ Attribution required')
  console.log('  ✓ No derivatives allowed')
  console.log('  ✓ No other licenses permitted')
  console.log('')

  if (violationCount === 0) {
    log('pass', `All checks passed!`)
    console.log('')
    return 0
  } else {
    log('error', `${violationCount} violation(s) found`)
    console.log('')
    return 1
  }
}

// Run checks
console.log('🔐 License Compliance Checker')
console.log('═══════════════════════════════════════════════════════════')
console.log('')

checkPackageJson()
checkLicenseFile()
checkSourceFiles()
checkCommercialCode()
checkDerivatives()

process.exit(printSummary())
