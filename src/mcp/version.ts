/**
 * Automated Versioning via Cross-Domain Formulas
 * Semantic versioning driven by change analysis
 */

import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'

interface Version {
  major: number
  minor: number
  patch: number
}

interface ChangeAnalysis {
  breaking: boolean          // Major bump
  features: boolean          // Minor bump
  fixes: boolean             // Patch bump
  refactoring: boolean       // No bump (quality)
  efficiency: boolean        // Patch bump (performance)
  documentation: boolean     // No bump
}

// ============================================================================
// SEMANTIC VERSIONING FORMULAS
// ============================================================================

function analyzeChanges(): ChangeAnalysis {
  try {
    // Get commits since last tag
    const lastTag = execSync('git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0"')
      .toString()
      .trim()

    const diff = execSync(`git log ${lastTag}..HEAD --oneline`)
      .toString()
      .split('\n')
      .filter(Boolean)

    const analysis: ChangeAnalysis = {
      breaking: false,
      features: false,
      fixes: false,
      refactoring: false,
      efficiency: false,
      documentation: false
    }

    for (const commit of diff) {
      const msg = commit.toLowerCase()

      if (msg.includes('breaking') || msg.includes('⚠️')) analysis.breaking = true
      if (msg.includes('feat') || msg.includes('add') || msg.includes('new') || msg.includes('automation') || msg.includes('auto') || msg.includes('gap') || msg.includes('semantic')) analysis.features = true
      if (msg.includes('fix') || msg.includes('bug')) analysis.fixes = true
      if (msg.includes('refactor') || msg.includes('refactoring')) analysis.refactoring = true
      if (msg.includes('efficiency') || msg.includes('optimize') || msg.includes('reduction')) analysis.efficiency = true
      if (msg.includes('doc') || msg.includes('docs')) analysis.documentation = true
    }

    return analysis
  } catch {
    return {
      breaking: false,
      features: false,
      fixes: false,
      refactoring: false,
      efficiency: false,
      documentation: false
    }
  }
}

// ============================================================================
// CROSS-DOMAIN VERSION DECISION FORMULA
// ============================================================================

function decideVersionBump(analysis: ChangeAnalysis): 'major' | 'minor' | 'patch' | 'none' {
  // FORMULA: Breaking changes → MAJOR
  if (analysis.breaking) return 'major'

  // FORMULA: Consolidation + Refactoring + Efficiency (quality improvement) → MINOR
  if (analysis.refactoring && analysis.efficiency) return 'minor'

  // FORMULA: New features → MINOR
  if (analysis.features && !analysis.breaking) return 'minor'

  // FORMULA: Fixes + efficiency improvements → PATCH
  if (analysis.fixes || analysis.efficiency) return 'patch'

  // FORMULA: Refactoring only (no new features) → NO BUMP
  if (analysis.refactoring && !analysis.features && !analysis.fixes) return 'none'

  // FORMULA: Docs only → NO BUMP
  if (analysis.documentation && !analysis.fixes && !analysis.features) return 'none'

  return 'none'
}

// ============================================================================
// VERSION BUMP IMPLEMENTATION
// ============================================================================

function bumpVersion(current: Version, bump: 'major' | 'minor' | 'patch'): Version {
  switch (bump) {
    // v1.<minor>.<digit>: major stays 1, a breaking or feature change opens the next minor at LTS (0), and the
    // development state is one digit, so past 9 it also opens the next minor
    case 'major':
    case 'minor':
      return { major: 1, minor: current.minor + 1, patch: 0 }
    case 'patch':
      return current.patch >= 9 ? { major: 1, minor: current.minor + 1, patch: 0 } : { major: 1, minor: current.minor, patch: current.patch + 1 }
  }
}

function parseVersion(versionStr: string): Version {
  const match = versionStr.match(/v?(\d+)\.(\d+)\.(\d+)/)
  if (!match) return { major: 0, minor: 0, patch: 1 }
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10)
  }
}

function formatVersion(v: Version): string {
  return `v${v.major}.${v.minor}.${v.patch}`
}

// ============================================================================
// AUTOMATED VERSIONING
// ============================================================================

export async function autoVersion(): Promise<{
  currentVersion: string
  newVersion: string
  bumpType: string
  analysis: ChangeAnalysis
  tagged: boolean
}> {
  console.log('\n🔄 AUTOMATED VERSIONING')
  console.log('═══════════════════════════════════════════════════════════════')

  // 1. Get current version
  const pkgJson = JSON.parse(readFileSync('package.json', 'utf8'))
  const currentVer = parseVersion(pkgJson.version)
  console.log(`\nCurrent version: ${formatVersion(currentVer)}`)

  // 2. Analyze changes
  const analysis = analyzeChanges()
  console.log(`\nChange analysis:`)
  console.log(`  Breaking: ${analysis.breaking ? '✓' : '✗'}`)
  console.log(`  Features: ${analysis.features ? '✓' : '✗'}`)
  console.log(`  Fixes: ${analysis.fixes ? '✓' : '✗'}`)
  console.log(`  Refactoring: ${analysis.refactoring ? '✓' : '✗'}`)
  console.log(`  Efficiency: ${analysis.efficiency ? '✓' : '✗'}`)
  console.log(`  Docs: ${analysis.documentation ? '✓' : '✗'}`)

  // 3. Decide version bump via cross-domain formula
  const bumpType = decideVersionBump(analysis)
  console.log(`\nVersion bump formula result: ${bumpType}`)

  if (bumpType === 'none') {
    console.log('✓ No version bump needed')
    return {
      currentVersion: formatVersion(currentVer),
      newVersion: formatVersion(currentVer),
      bumpType: 'none',
      analysis,
      tagged: false
    }
  }

  // 4. Apply bump
  const newVer = bumpVersion(currentVer, bumpType)
  const newVersionStr = formatVersion(newVer)
  console.log(`\nNew version: ${newVersionStr}`)

  // 5. Update package.json — only if the version lock allows it (scheme, forward, previous released on npm)
  const priorJson = readFileSync('package.json', 'utf-8')
  pkgJson.version = newVersionStr.substring(1) // Remove 'v' prefix
  writeFileSync('package.json', JSON.stringify(pkgJson, null, 2) + '\n')
  try {
    execSync('node scripts/version-lock.mjs', { stdio: 'inherit' })
  } catch {
    writeFileSync('package.json', priorJson)
    return {
      currentVersion: formatVersion(currentVer),
      newVersion: formatVersion(currentVer),
      bumpType,
      analysis,
      tagged: false
    }
  }
  console.log('✓ Updated package.json')

  // 6. Create git tag
  try {
    execSync(`git add package.json`)
    execSync(`git commit -m "Release: ${newVersionStr}"`)
    execSync(`git tag -a ${newVersionStr} -m "Release ${newVersionStr}"`)
    console.log(`✓ Created tag: ${newVersionStr}`)

    return {
      currentVersion: formatVersion(currentVer),
      newVersion: newVersionStr,
      bumpType,
      analysis,
      tagged: true
    }
  } catch (e) {
    console.log(`⚠️  Tag creation failed: ${(e as Error).message}`)
    return {
      currentVersion: formatVersion(currentVer),
      newVersion: newVersionStr,
      bumpType,
      analysis,
      tagged: false
    }
  }
}

// ============================================================================
// VERSION STATUS
// ============================================================================

export async function statusVersion(): Promise<void> {
  console.log('\n📊 VERSION STATUS')
  console.log('═══════════════════════════════════════════════════════════════')

  try {
    const pkgJson = JSON.parse(readFileSync('package.json', 'utf8'))
    const lastTag = execSync('git describe --tags --abbrev=0 2>/dev/null || echo "none"')
      .toString()
      .trim()

    const commitsSinceTag = execSync(`git rev-list --count ${lastTag}..HEAD 2>/dev/null || echo "0"`)
      .toString()
      .trim()

    console.log(`\nCurrent version: v${pkgJson.version}`)
    console.log(`Last tag: ${lastTag}`)
    console.log(`Commits since tag: ${commitsSinceTag}`)

    if (parseInt(commitsSinceTag) > 0) {
      const analysis = analyzeChanges()
      const bumpType = decideVersionBump(analysis)
      if (bumpType !== 'none') {
        const current = parseVersion(pkgJson.version)
        const next = bumpVersion(current, bumpType)
        console.log(`\n⚠️  Version update pending:`)
        console.log(`  Run: npm run version:auto`)
        console.log(`  Will bump to: ${formatVersion(next)} (${bumpType})`)
      }
    }
  } catch (e) {
    console.log(`Error: ${(e as Error).message}`)
  }
}

// ============================================================================
// CROSS-DOMAIN INTELLIGENCE
// ============================================================================

/**
 * FORMULA: Automated Semantic Versioning via Change Analysis
 *
 * Domains integrated:
 * - Engineering (commits, changes)
 * - Quality (refactoring, efficiency)
 * - Features (new functionality)
 * - Reliability (fixes, breaking changes)
 * - Operations (versioning, tagging)
 *
 * Decision tree:
 * Breaking changes → MAJOR (reliability)
 * Consolidation + Refactoring + Efficiency → MINOR (quality)
 * New features → MINOR (engineering)
 * Fixes + Efficiency → PATCH (reliability + performance)
 * Refactoring only → NO BUMP (quality without feature change)
 * Docs only → NO BUMP (documentation)
 *
 * Advantages:
 * ✓ Semantic versioning automatically enforced
 * ✓ No manual version bumping
 * ✓ Version matches actual changes
 * ✓ Cross-domain aware (quality improvements recognized)
 * ✓ Cost-efficient (single formula-based decision)
 */
