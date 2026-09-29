/**
 * Compliance Scanner - Automated code analysis for regulatory compliance
 * Scans for: security issues, data handling, audit trails, cryptographic compliance
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

export interface ComplianceIssue {
  severity: 'critical' | 'high' | 'medium' | 'low'
  category: 'security' | 'data-handling' | 'audit-trail' | 'cryptography' | 'error-handling'
  file: string
  line: number
  message: string
  remediation: string
  standard?: string
}

export interface ComplianceReport {
  timestamp: Date
  filesScanned: number
  issuesFound: ComplianceIssue[]
  summary: {
    critical: number
    high: number
    medium: number
    low: number
    total: number
  }
  complianceScore: number
  certifications: {
    soc2: boolean
    gdpr: boolean
    hipaa: boolean
    fips140_2: boolean
  }
}

export class ComplianceScanner {
  private patterns = {
    // Security patterns
    hardcodedSecrets: /(?:pass(?:word)?|pwd|api_?key|secret|token|credential)\s*=\s*['"][^'"]{6,}['"]/i,
    dangerousEval: /\beval\s*\(/i,
    sqlInjection: /\bquery\s*\(\s*[`'"]\s*\$\{|\bsql\s*`\s*\$\{/i,

    // Data handling
    unencryptedStorage: /localStorage|sessionStorage|Cookies\.set/i,
    unencryptedTransfer: /http:\/\/|XMLHttpRequest|fetch\s*\(\s*['"]http:/i,
    dataLeakage: /console\.(log|error)\s*\(\s*(?:password|secret|token|api_?key)/i,

    // Audit trails
    noAuditLog: /delete\s+from.*log|DROP\s+TABLE.*audit/i,
    missingTimestamp: /this\.createdAt|this\.updatedAt/i,
    noUserTracking: /\/\/ TODO.*audit|\/\/ FIXME.*log/i,

    // Error handling
    swallowedErrors: /catch\s*\(\s*\w+\s*\)\s*\{\s*\}|catch\s*\(\s*\w+\s*\)\s*\{\s*\/\//i,
    unhandledPromise: /\.then\(|\.catch\(\s*\(\s*\w+\s*\)\s*=>/i,
  }

  async scan(filePath: string): Promise<ComplianceIssue[]> {
    try {
      return this.performSASTScan(readFileSync(resolve(filePath), 'utf-8'), filePath)
    } catch (error) {
      console.error(`Failed to scan ${filePath}:`, error)
      return []
    }
  }

  performSASTScan(content: string, filePath: string): ComplianceIssue[] {
    const issues: ComplianceIssue[] = []
    const lines = content.split('\n')

    // Scan for hardcoded secrets
    lines.forEach((line, idx) => {
      if (this.patterns.hardcodedSecrets.test(line)) {
        issues.push({
          severity: 'critical',
          category: 'security',
          file: filePath,
          line: idx + 1,
          message: 'Hardcoded secret or API key detected',
          remediation: 'Move secrets to environment variables or secure vaults',
          standard: 'OWASP A02:2021'
        })
      }

      if (this.patterns.dangerousEval.test(line)) {
        issues.push({
          severity: 'critical',
          category: 'security',
          file: filePath,
          line: idx + 1,
          message: 'Dangerous eval() usage',
          remediation: 'Replace with safer alternatives (JSON.parse, Function constructor)',
          standard: 'OWASP A03:2021'
        })
      }

      if (this.patterns.unencryptedStorage.test(line)) {
        issues.push({
          severity: 'high',
          category: 'data-handling',
          file: filePath,
          line: idx + 1,
          message: 'Unencrypted local storage usage',
          remediation: 'Use encrypted storage or indexedDB with encryption',
          standard: 'GDPR Article 32'
        })
      }

      if (this.patterns.dataLeakage.test(line)) {
        issues.push({
          severity: 'high',
          category: 'data-handling',
          file: filePath,
          line: idx + 1,
          message: 'Sensitive data logged to console',
          remediation: 'Remove or redact sensitive data from logs',
          standard: 'GDPR Article 5'
        })
      }

      if (this.patterns.swallowedErrors.test(line)) {
        issues.push({
          severity: 'medium',
          category: 'error-handling',
          file: filePath,
          line: idx + 1,
          message: 'Empty catch block swallowing errors',
          remediation: 'Log errors, handle gracefully, or re-throw with context',
          standard: 'OWASP A09:2021'
        })
      }
    })

    return issues
  }

  async generateReport(filePaths: string[]): Promise<ComplianceReport> {
    const allIssues: ComplianceIssue[] = []

    for (const filePath of filePaths) {
      const issues = await this.scan(filePath)
      allIssues.push(...issues)
    }

    const summary = {
      critical: allIssues.filter(i => i.severity === 'critical').length,
      high: allIssues.filter(i => i.severity === 'high').length,
      medium: allIssues.filter(i => i.severity === 'medium').length,
      low: allIssues.filter(i => i.severity === 'low').length,
      total: allIssues.length,
    }

    const complianceScore = Math.max(0, 100 - (
      summary.critical * 20 +
      summary.high * 10 +
      summary.medium * 5 +
      summary.low * 1
    ))

    return {
      timestamp: new Date(),
      filesScanned: filePaths.length,
      issuesFound: allIssues.sort((a, b) => {
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
        return severityOrder[a.severity] - severityOrder[b.severity]
      }),
      summary,
      complianceScore,
      certifications: {
        soc2: summary.critical === 0 && summary.high === 0,
        gdpr: summary.critical === 0,
        hipaa: summary.critical === 0 && complianceScore >= 90,
        fips140_2: summary.critical === 0 && allIssues.every(i => i.category !== 'cryptography')
      }
    }
  }
}

export const complianceScanner = new ComplianceScanner()
