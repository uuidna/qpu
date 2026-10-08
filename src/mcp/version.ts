/**
 * The next version is a suggestion. The base is the latest version of this package published on npm, and a feature
 * opens the next v1.<minor>.0, forward only. Nothing is written unless a human passes that exact version string.
 * A version-lock refusal restores the file; it does not choose a different version.
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
// VERSION BUMP — suggestion only, from the published version
// ============================================================================

/** v1.<minor>.<digit>, the same scheme as scripts/version-lock.mjs. Major is 1, state is one digit, 0 is LTS. */
const VERSION = /^1\.(0|[1-9][0-9]*)\.[0-9]$/

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
  const bare = versionStr.trim().replace(/^v/, '')
  const parts = bare.split('.')
  if (!VERSION.test(bare) || parts.length !== 3) throw new Error(`${versionStr} is not v1.<minor>.<digit>`)
  return { major: Number(parts[0]), minor: Number(parts[1]), patch: Number(parts[2]) }
}

function formatVersion(v: Version): string {
  return `${v.major}.${v.minor}.${v.patch}`
}

function isForward(from: string, to: string): boolean {
  const [a = 0, b = 0, c = 0] = from.split('.').map(Number)
  const [d = 0, e = 0, f = 0] = to.split('.').map(Number)
  return d > a || (d === a && (e > b || (e === b && f > c)))
}

/**
 * One next suggestion. A feature opens the next minor at LTS (state 0), forward only, from the version passed in —
 * the latest published version, never the working tree. Pure: it does not read or write a file.
 */
export function suggestNextVersion(published: string): string {
  const bare = published.trim().replace(/^v/, '')
  const suggestion = formatVersion(bumpVersion(parseVersion(bare), 'minor'))
  if (!isForward(bare, suggestion)) throw new Error(`${suggestion} is not forward from ${bare}`)
  return suggestion
}

/** Latest published version from `npm view <name> version`. There is no fallback to package.json. */
export function readPublishedVersion(name: string): string {
  let out = ''
  try {
    out = execSync(`npm view ${JSON.stringify(name)} version --json`, {
      stdio: ['ignore', 'pipe', 'pipe'],
    }).toString().trim()
  } catch (e) {
    const err = e as { stderr?: Buffer; message?: string }
    const why = err.stderr?.toString().trim() || err.message || 'no registry answer'
    throw new Error(`npm view ${name} version failed: ${why}`)
  }
  let parsed: unknown
  try { parsed = JSON.parse(out) } catch { parsed = undefined }
  const version = typeof parsed === 'string' ? parsed : ''
  if (!VERSION.test(version)) throw new Error(`npm view ${name} version returned ${out || 'nothing'}, not a published v1.<minor>.<digit>`)
  return version
}

// ============================================================================
// AUTOMATED VERSIONING
// ============================================================================

export async function autoVersion(approved?: string): Promise<{
  published: string
  suggestion: string
  currentVersion: string
  newVersion: string
  bumpType: string
  analysis: ChangeAnalysis
  tagged: boolean
  wrote: boolean
}> {
  const prior = readFileSync('package.json', 'utf8')
  const pkg = JSON.parse(prior) as { name: string; version: string }
  const published = readPublishedVersion(pkg.name)
  const suggestion = suggestNextVersion(published)
  const analysis = analyzeChanges()
  const held = pkg.version

  console.log('\nNEXT VERSION (suggestion)')
  console.log('═══════════════════════════════════════════════════════════════')
  console.log(`Published on npm: ${published}`)
  console.log(`Suggestion: ${suggestion} (a feature opens the next minor; forward only)`)
  console.log(`Working tree: ${held}`)
  console.log(`Change analysis: features ${analysis.features ? 'yes' : 'no'}, fixes ${analysis.fixes ? 'yes' : 'no'} (does not choose the number)`)

  const unchanged = {
    published,
    suggestion,
    currentVersion: held,
    newVersion: held,
    bumpType: 'minor' as const,
    analysis,
    tagged: false,
    wrote: false,
  }

  // A suggestion is not a write. The human approves by passing this exact version string.
  if (approved !== suggestion) {
    console.log(approved === undefined
      ? `Not written. Approve by passing the exact version ${suggestion}.`
      : `Not written. ${approved} is not the suggestion ${suggestion}.`)
    return unchanged
  }

  if (held === suggestion) {
    console.log(`${suggestion} is already the working tree version. package.json was not rewritten.`)
    return unchanged
  }

  const rewritten = prior.replace(/("version"\s*:\s*")[^"]+(")/, `$1${suggestion}$2`)
  if (rewritten === prior) throw new Error('package.json has no version to approve')
  writeFileSync('package.json', rewritten)
  try {
    execSync('node scripts/version-lock.mjs', { stdio: 'inherit' })
  } catch {
    writeFileSync('package.json', prior)
    console.log(`version-lock refused ${suggestion}. package.json restored to ${held}. That refusal does not choose a version; the suggestion stays ${suggestion}.`)
    return unchanged
  }
  console.log(`✓ Updated package.json to the approved version ${suggestion}`)

  try {
    execSync('git add package.json')
    execSync(`git commit -m "Release: v${suggestion}"`)
    execSync(`git tag -a v${suggestion} -m "Release v${suggestion}"`)
    console.log(`✓ Created tag: v${suggestion}`)
    return { ...unchanged, newVersion: suggestion, tagged: true, wrote: true }
  } catch (e) {
    console.log(`⚠️  Tag creation failed: ${(e as Error).message}`)
    return { ...unchanged, newVersion: suggestion, tagged: false, wrote: true }
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

    const published = readPublishedVersion(pkgJson.name)
    const suggestion = suggestNextVersion(published)
    const bumpType = decideVersionBump(analyzeChanges())

    console.log(`\nPublished on npm: ${published}`)
    console.log(`Suggestion: ${suggestion} (not written)`)
    console.log(`Working tree: ${pkgJson.version}`)
    console.log(`Last tag: ${lastTag}`)
    console.log(`Commits since tag: ${commitsSinceTag}`)
    console.log(`Commit reading: ${bumpType} (informational; the suggestion is taken from the published version)`)
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
 * The number shown is one suggestion: a feature opens the next minor from the latest version published on npm,
 * forward only. It is written only when a human passes that exact version. Commit keywords do not choose it,
 * and a version-lock refusal does not choose it either.
 */
