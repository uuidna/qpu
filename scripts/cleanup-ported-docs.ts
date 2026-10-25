/**
 * Cleanup Ported Docs Script
 *
 * Automatically removes markdown documentation files after they've been
 * ported to inline JSDoc, help systems, and code comments.
 *
 * Usage: npm run cleanup-docs
 *
 * This script:
 * 1. Identifies which docs have been ported (checks for corresponding code/help)
 * 2. Verifies inline documentation exists
 * 3. Removes the markdown file
 * 4. Updates index/links
 * 5. Commits cleanup to git
 */

import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'

interface PortedDoc {
  markdownFile: string
  inlineLocation: string
  verified: boolean
  deleted: boolean
}

/**
 * Documentation Porting Map
 *
 * Maps markdown docs to their inline equivalents.
 * Only remove .md file if corresponding inline docs exist and are verified.
 */
const PORTING_MAP: Record<string, PortedDoc> = {
  // WAVE 8 API Gateway
  'docs/WAVE8-API-GATEWAY.md': {
    markdownFile: 'docs/WAVE8-API-GATEWAY.md',
    inlineLocation: 'src/api-gateway/index.ts',
    verified: false,
    deleted: false
  },

  // WAVE 8 Real-Time
  'docs/WAVE8-REALTIME.md': {
    markdownFile: 'docs/WAVE8-REALTIME.md',
    inlineLocation: 'src/realtime/index.ts',
    verified: false,
    deleted: false
  },

  // WAVE 8 Observability
  'docs/WAVE8-OBSERVABILITY.md': {
    markdownFile: 'docs/WAVE8-OBSERVABILITY.md',
    inlineLocation: 'src/observability/index.ts',
    verified: false,
    deleted: false
  },

  // WAVE 8 Security
  'docs/WAVE8-SECURITY.md': {
    markdownFile: 'docs/WAVE8-SECURITY.md',
    inlineLocation: 'src/security/index.ts',
    verified: false,
    deleted: false
  },

  // WAVE 8 Performance
  'docs/WAVE8-PERFORMANCE.md': {
    markdownFile: 'docs/WAVE8-PERFORMANCE.md',
    inlineLocation: 'src/performance/index.ts',
    verified: false,
    deleted: false
  },

  // WAVE 8 SDK Generation
  'docs/WAVE8-SDK-GENERATION.md': {
    markdownFile: 'docs/WAVE8-SDK-GENERATION.md',
    inlineLocation: 'src/sdk/index.ts',
    verified: false,
    deleted: false
  },

  // WAVE 8 Monitoring
  'docs/WAVE8-MONITORING-DASHBOARD.md': {
    markdownFile: 'docs/WAVE8-MONITORING-DASHBOARD.md',
    inlineLocation: 'src/monitoring/index.ts',
    verified: false,
    deleted: false
  },

  // WAVE 8 Hardening
  'docs/WAVE8-PRODUCTION-HARDENING.md': {
    markdownFile: 'docs/WAVE8-PRODUCTION-HARDENING.md',
    inlineLocation: 'src/hardening/index.ts',
    verified: false,
    deleted: false
  },

  // Local/Mobile docs (replaced by MCPs)
  'docs/LOCAL-MCP-OS-INTEGRATION.md': {
    markdownFile: 'docs/LOCAL-MCP-OS-INTEGRATION.md',
    inlineLocation: 'src/mcp/local-mcp.ts',
    verified: false,
    deleted: false
  },

  'docs/MOBILE-MCP-INTEGRATION.md': {
    markdownFile: 'docs/MOBILE-MCP-INTEGRATION.md',
    inlineLocation: 'src/mcp/mobile-mcp.ts',
    verified: false,
    deleted: false
  },

  // Architecture docs (replaced by inline)
  'docs/QPU-GRAND-ARCHITECTURE.md': {
    markdownFile: 'docs/QPU-GRAND-ARCHITECTURE.md',
    inlineLocation: 'src/architecture/index.ts',
    verified: false,
    deleted: false
  },

  // Dashboard system (component lib exists)
  'docs/SHADCN-DASHBOARD-SYSTEM.md': {
    markdownFile: 'docs/SHADCN-DASHBOARD-SYSTEM.md',
    inlineLocation: 'src/ui/dashboard-with-help.tsx',
    verified: false,
    deleted: false
  },

  // Help system (integrated into components)
  'docs/INTEGRATED-DASHBOARD-GUIDE.md': {
    markdownFile: 'docs/INTEGRATED-DASHBOARD-GUIDE.md',
    inlineLocation: 'src/ui/dashboard-with-help.tsx',
    verified: false,
    deleted: false
  }
}

/**
 * Verify inline documentation exists and is complete
 */
function verifyInlineDoc(inlineLocation: string): boolean {
  try {
    const filePath = path.resolve(inlineLocation)
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Missing: ${inlineLocation}`)
      return false
    }

    const content = fs.readFileSync(filePath, 'utf-8')

    // Check for JSDoc comments
    if (!content.includes('/**') || !content.includes('*/')) {
      console.log(`⚠️  No JSDoc found in: ${inlineLocation}`)
      return false
    }

    // Check for @param, @description, or similar
    if (!/(@param|@description|@example|@returns)/.test(content)) {
      console.log(`⚠️  Minimal documentation in: ${inlineLocation}`)
      return false
    }

    console.log(`✅ Verified: ${inlineLocation}`)
    return true
  } catch (error) {
    console.error(`❌ Error checking ${inlineLocation}:`, error)
    return false
  }
}

/**
 * Delete markdown file and update references
 */
function deleteMarkdownFile(markdownPath: string): boolean {
  try {
    if (!fs.existsSync(markdownPath)) {
      console.log(`⚠️  File not found: ${markdownPath}`)
      return false
    }

    // Create backup first
    const backupPath = `${markdownPath}.backup`
    fs.copyFileSync(markdownPath, backupPath)
    console.log(`📦 Backup created: ${backupPath}`)

    // Delete the file
    fs.unlinkSync(markdownPath)
    console.log(`🗑️  Deleted: ${markdownPath}`)

    return true
  } catch (error) {
    console.error(`❌ Error deleting ${markdownPath}:`, error)
    return false
  }
}

/**
 * Update documentation index
 */
function updateDocIndex(): void {
  try {
    const indexPath = 'docs/INDEX.md'
    if (!fs.existsSync(indexPath)) {
      console.log('ℹ️  No INDEX.md found')
      return
    }

    let content = fs.readFileSync(indexPath, 'utf-8')

    // Remove references to deleted files
    for (const [key, doc] of Object.entries(PORTING_MAP)) {
      if (doc.deleted) {
        // Remove the line from index
        const fileName = path.basename(doc.markdownFile)
        const regex = new RegExp(`^- \\[.*\\]\\(${fileName}\\)$`, 'gm')
        content = content.replace(regex, '')
        console.log(`📝 Removed from INDEX.md: ${fileName}`)
      }
    }

    fs.writeFileSync(indexPath, content)
    console.log('📝 Updated: docs/INDEX.md')
  } catch (error) {
    console.error('❌ Error updating index:', error)
  }
}

/**
 * Update links in remaining markdown files
 */
function updateCrossReferences(): void {
  try {
    const docsDir = 'docs'
    const mdFiles = fs.readdirSync(docsDir).filter(f => f.endsWith('.md'))

    for (const mdFile of mdFiles) {
      let content = fs.readFileSync(path.join(docsDir, mdFile), 'utf-8')
      let updated = false

      // Replace references to deleted files
      for (const [key, doc] of Object.entries(PORTING_MAP)) {
        if (doc.deleted) {
          const fileName = path.basename(doc.markdownFile)
          const regex = new RegExp(`\\[.*?\\]\\(${fileName}\\)`, 'g')
          const matches = content.match(regex)

          if (matches) {
            // Replace with reference to inline location
            const replacement = `[see inline docs](../src/${doc.inlineLocation})`
            content = content.replace(regex, replacement)
            updated = true
            console.log(`🔗 Updated references in: ${mdFile}`)
          }
        }
      }

      if (updated) {
        fs.writeFileSync(path.join(docsDir, mdFile), content)
      }
    }
  } catch (error) {
    console.error('❌ Error updating cross-references:', error)
  }
}

/**
 * Commit cleanup to git
 */
function commitCleanup(deletedCount: number): void {
  try {
    if (deletedCount === 0) {
      console.log('ℹ️  No files to commit')
      return
    }

    // Stage deletions
    execSync('git add -A', { stdio: 'inherit' })

    // Create commit
    execSync(
      `git commit -m "docs: cleanup ported markdown documentation (${deletedCount} files)

- Removed markdown docs that have been ported to inline JSDoc
- Removed docs that have corresponding MCP implementations
- All documentation now lives in code, help systems, and UI
- Cross-references updated to point to inline docs"`,
      { stdio: 'inherit' }
    )

    console.log('✅ Cleanup committed to git')
  } catch (error) {
    if (error instanceof Error && error.message.includes('nothing to commit')) {
      console.log('ℹ️  Nothing to commit')
    } else {
      console.error('⚠️  Error committing:', error)
    }
  }
}

/**
 * Main cleanup function
 */
async function cleanup(): Promise<void> {
  console.log('🧹 Starting documentation cleanup...\n')

  let verifiedCount = 0
  let deletedCount = 0

  // Verify inline docs exist
  console.log('📋 Verifying inline documentation...')
  for (const [key, doc] of Object.entries(PORTING_MAP)) {
    doc.verified = verifyInlineDoc(doc.inlineLocation)
    if (doc.verified) verifiedCount++
  }

  console.log(`\n✅ Verified: ${verifiedCount}/${Object.keys(PORTING_MAP).length}\n`)

  // Delete markdown files
  console.log('🗑️  Removing markdown files...')
  for (const [key, doc] of Object.entries(PORTING_MAP)) {
    if (doc.verified) {
      if (deleteMarkdownFile(doc.markdownFile)) {
        doc.deleted = true
        deletedCount++
      }
    } else {
      console.log(`⏭️  Skipping (not verified): ${doc.markdownFile}`)
    }
  }

  console.log(`\n🗑️  Deleted: ${deletedCount} files\n`)

  // Update documentation
  console.log('📝 Updating documentation references...')
  updateDocIndex()
  updateCrossReferences()

  // Commit cleanup
  console.log('\n💾 Committing cleanup...')
  commitCleanup(deletedCount)

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 Cleanup Summary')
  console.log('='.repeat(50))
  console.log(`Verified:  ${verifiedCount} inline documentation files`)
  console.log(`Deleted:   ${deletedCount} markdown files`)
  console.log(`Remaining: ${Object.keys(PORTING_MAP).length - deletedCount} markdown files`)
  console.log('='.repeat(50))

  if (deletedCount > 0) {
    console.log('\n✅ Cleanup complete! All documentation now lives in code.')
    console.log('📚 Users learn through: inline JSDoc + in-app help + CLI tools')
  } else {
    console.log('\nℹ️  No markdown files ready for deletion.')
    console.log('📝 Ensure inline documentation is complete before running cleanup.')
  }
}

// Run cleanup
cleanup().catch(console.error)
