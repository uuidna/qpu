/**
 * Release Manager - Orchestrates versioning, releases, changelogs, deprecations
 */

export interface ReleaseVersion {
  major: number
  minor: number
  patch: number
  prerelease?: string
  metadata?: string
}

export interface Release {
  id: string
  version: string
  name: string
  description: string
  releaseDate: Date
  status: 'draft' | 'scheduled' | 'released' | 'archived'
  changelog: ChangelogEntry[]
  deprecations: DeprecationNotice[]
  migration: MigrationGuide[]
  supportUntil: Date
  documentationUrl: string
}

export interface ChangelogEntry {
  type: 'feature' | 'bugfix' | 'improvement' | 'breaking' | 'security' | 'deprecation'
  title: string
  description: string
  issueId?: string
  pullRequestId?: string
}

export interface DeprecationNotice {
  component: string
  reason: string
  alternative: string
  deprecatedAt: string
  removedAt: string // version
  migration: string
}

export interface MigrationGuide {
  title: string
  steps: string[]
  beforeCode: string
  afterCode: string
  resources: string[]
}

export class ReleaseManager {
  private releases: Map<string, Release> = new Map()
  private versionHistory: ReleaseVersion[] = []
  private currentVersion: ReleaseVersion = { major: 0, minor: 1, patch: 9 }

  constructor() {
    this.versionHistory.push({ ...this.currentVersion })
  }

  parseVersion(versionString: string): ReleaseVersion {
    const match = versionString.match(/(\d+)\.(\d+)\.(\d+)(?:-(.+))?(?:\+(.+))?/)
    if (!match) {
      throw new Error(`Invalid version format: ${versionString}`)
    }

    return {
      major: parseInt(match[1]),
      minor: parseInt(match[2]),
      patch: parseInt(match[3]),
      prerelease: match[4],
      metadata: match[5]
    }
  }

  versionToString(version: ReleaseVersion): string {
    let str = `${version.major}.${version.minor}.${version.patch}`
    if (version.prerelease) str += `-${version.prerelease}`
    if (version.metadata) str += `+${version.metadata}`
    return str
  }

  bump(type: 'major' | 'minor' | 'patch'): ReleaseVersion {
    const newVersion = { ...this.currentVersion }

    if (type === 'major') {
      newVersion.major++
      newVersion.minor = 0
      newVersion.patch = 0
    } else if (type === 'minor') {
      newVersion.minor++
      newVersion.patch = 0
    } else if (type === 'patch') {
      newVersion.patch++
    }

    delete newVersion.prerelease
    delete newVersion.metadata

    this.currentVersion = newVersion
    this.versionHistory.push({ ...newVersion })
    return newVersion
  }

  createRelease(data: Omit<Release, 'id' | 'releaseDate'>): Release {
    const release: Release = {
      id: `release-${Date.now()}`,
      releaseDate: new Date(),
      ...data
    }

    this.releases.set(release.version, release)
    return release
  }

  scheduleRelease(version: string, releaseDate: Date): Release | null {
    const release = this.releases.get(version)
    if (!release) return null

    release.releaseDate = releaseDate
    release.status = 'scheduled'
    return release
  }

  publishRelease(version: string): Release | null {
    const release = this.releases.get(version)
    if (!release) return null

    release.status = 'released'
    release.releaseDate = new Date()
    return release
  }

  addDeprecationNotice(version: string, notice: DeprecationNotice): Release | null {
    const release = this.releases.get(version)
    if (!release) return null

    release.deprecations.push(notice)
    return release
  }

  addMigrationGuide(version: string, guide: MigrationGuide): Release | null {
    const release = this.releases.get(version)
    if (!release) return null

    release.migration.push(guide)
    return release
  }

  generateReleaseNotes(version: string): string {
    const release = this.releases.get(version)
    if (!release) return ''

    const lines: string[] = []
    lines.push(`# Version ${version}`)
    lines.push(`**Release Date**: ${release.releaseDate.toISOString().split('T')[0]}`)
    lines.push('')

    if (release.description) {
      lines.push(release.description)
      lines.push('')
    }

    // Changelog by type
    const byType = {
      breaking: release.changelog.filter(c => c.type === 'breaking'),
      feature: release.changelog.filter(c => c.type === 'feature'),
      improvement: release.changelog.filter(c => c.type === 'improvement'),
      bugfix: release.changelog.filter(c => c.type === 'bugfix'),
      security: release.changelog.filter(c => c.type === 'security'),
      deprecation: release.changelog.filter(c => c.type === 'deprecation')
    }

    if (byType.breaking.length > 0) {
      lines.push('## ⚠️ Breaking Changes')
      byType.breaking.forEach(entry => {
        lines.push(`- ${entry.title}: ${entry.description}`)
      })
      lines.push('')
    }

    if (byType.security.length > 0) {
      lines.push('## 🔒 Security')
      byType.security.forEach(entry => {
        lines.push(`- ${entry.title}: ${entry.description}`)
      })
      lines.push('')
    }

    if (byType.feature.length > 0) {
      lines.push('## ✨ New Features')
      byType.feature.forEach(entry => {
        lines.push(`- ${entry.title}: ${entry.description}`)
      })
      lines.push('')
    }

    if (byType.improvement.length > 0) {
      lines.push('## 🚀 Improvements')
      byType.improvement.forEach(entry => {
        lines.push(`- ${entry.title}: ${entry.description}`)
      })
      lines.push('')
    }

    if (byType.bugfix.length > 0) {
      lines.push('## 🐛 Bug Fixes')
      byType.bugfix.forEach(entry => {
        lines.push(`- ${entry.title}: ${entry.description}`)
      })
      lines.push('')
    }

    if (release.deprecations.length > 0) {
      lines.push('## 📋 Deprecations')
      release.deprecations.forEach(dep => {
        lines.push(`- **${dep.component}**: ${dep.reason}`)
        lines.push(`  - Deprecated: ${dep.deprecatedAt}`)
        lines.push(`  - Removed: ${dep.removedAt}`)
        lines.push(`  - Alternative: ${dep.alternative}`)
      })
      lines.push('')
    }

    if (release.migration.length > 0) {
      lines.push('## 📖 Migration Guides')
      release.migration.forEach(guide => {
        lines.push(`### ${guide.title}`)
        guide.steps.forEach((step, idx) => {
          lines.push(`${idx + 1}. ${step}`)
        })
        lines.push('')
        lines.push('**Before:**')
        lines.push('```')
        lines.push(guide.beforeCode)
        lines.push('```')
        lines.push('')
        lines.push('**After:**')
        lines.push('```')
        lines.push(guide.afterCode)
        lines.push('```')
        lines.push('')
      })
    }

    lines.push(`## Support`)
    lines.push(`This version is supported until ${release.supportUntil.toISOString().split('T')[0]}`)

    return lines.join('\n')
  }

  getVersionTimeline(): Array<{ version: string; releaseDate: Date; status: string }> {
    return Array.from(this.releases.values()).map(release => ({
      version: release.version,
      releaseDate: release.releaseDate,
      status: release.status
    }))
  }

  getSupportedVersions(): Release[] {
    const now = new Date()
    return Array.from(this.releases.values()).filter(r => r.supportUntil > now && r.status === 'released')
  }

  getUpcomingReleases(): Release[] {
    const now = new Date()
    return Array.from(this.releases.values())
      .filter(r => r.releaseDate > now)
      .sort((a, b) => a.releaseDate.getTime() - b.releaseDate.getTime())
  }
}

export const releaseManager = new ReleaseManager()
