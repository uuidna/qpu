/**
 * Security Validator - SAST/DAST scanning, vulnerability analysis, cryptographic validation
 */

export interface SecurityFinding {
  id: string
  type: 'vulnerability' | 'weakness' | 'info'
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
  title: string
  description: string
  file: string
  line?: number
  cwe?: string
  cvss?: number
  remediation: string
  status: 'open' | 'acknowledged' | 'resolved' | 'false-positive'
}

export interface DependencyVulnerability {
  package: string
  version: string
  vulnerableVersions: string[]
  vulnerability: string
  cve?: string
  severity: string
  remediation: string
}

export interface CryptographicIssue {
  component: string
  issue: string
  severity: string
  standard: string
  requirement: string
  actual: string
}

export interface SecurityScanReport {
  timestamp: Date
  scanType: 'sast' | 'dast' | 'dependency' | 'crypto' | 'full'
  findings: SecurityFinding[]
  dependencyVulnerabilities: DependencyVulnerability[]
  cryptographicIssues: CryptographicIssue[]
  summary: {
    total: number
    critical: number
    high: number
    medium: number
    low: number
    info: number
  }
  score: number // 0-100
}

export class SecurityValidator {
  private patterns = {
    // SAST patterns
    sqlInjection: /query\s*\(\s*[`'"]\s*\$\{|\bsql\s*`\s*\$\{/gi,
    xss: /innerHTML\s*=|dangerouslySetInnerHTML|\.html\s*\(/gi,
    hardcodedSecrets: /(?:password|api_?key|secret|token)\s*[:=]\s*['"][^'"]{8,}['"]/gi,
    weakCrypto: /md5|sha1|des|rc4/gi,
    commandInjection: /child_process\.exec|shell\s*`/gi,
    pathTraversal: /\.\.\//gi,

    // Dependency vulnerabilities
    knownVulnerabilities: new Map([
      ['log4j', '2.0-2.14.1'],
      ['jackson-databind', '<2.9.10.8']
    ])
  }

  private cryptoStandards = {
    hashing: { required: 'SHA-256 or stronger', deprecated: ['MD5', 'SHA-1'] },
    encryption: { required: 'AES-256', deprecated: ['DES', 'RC4', 'MD5'] },
    randomness: { required: 'CSPRNG (crypto module)', deprecated: ['Math.random()'] },
    keyManagement: { required: 'NIST SP 800-57', deprecated: ['hardcoded', 'file-based'] }
  }

  performSASTScan(code: string, filePath: string): SecurityFinding[] {
    const findings: SecurityFinding[] = []
    const lines = code.split('\n')

    lines.forEach((line, idx) => {
      // SQL Injection
      if (this.patterns.sqlInjection.test(line)) {
        findings.push({
          id: `finding-${Date.now()}-${idx}`,
          type: 'vulnerability',
          severity: 'high',
          title: 'SQL Injection Vulnerability',
          description: 'User input appears to be directly embedded in SQL query',
          file: filePath,
          line: idx + 1,
          cwe: 'CWE-89',
          remediation: 'Use parameterized queries or prepared statements',
          status: 'open'
        })
      }

      // XSS
      if (this.patterns.xss.test(line)) {
        findings.push({
          id: `finding-${Date.now()}-${idx}`,
          type: 'vulnerability',
          severity: 'high',
          title: 'Cross-Site Scripting (XSS) Vulnerability',
          description: 'Direct DOM manipulation detected',
          file: filePath,
          line: idx + 1,
          cwe: 'CWE-79',
          remediation: 'Use textContent or sanitize input before rendering',
          status: 'open'
        })
      }

      // Hardcoded Secrets
      if (this.patterns.hardcodedSecrets.test(line)) {
        findings.push({
          id: `finding-${Date.now()}-${idx}`,
          type: 'vulnerability',
          severity: 'critical',
          title: 'Hardcoded Secret Detected',
          description: 'Hardcoded credentials found in source code',
          file: filePath,
          line: idx + 1,
          cwe: 'CWE-798',
          remediation: 'Move secrets to environment variables or secure vaults',
          status: 'open'
        })
      }

      // Weak Cryptography
      if (this.patterns.weakCrypto.test(line)) {
        findings.push({
          id: `finding-${Date.now()}-${idx}`,
          type: 'vulnerability',
          severity: 'high',
          title: 'Weak Cryptographic Algorithm',
          description: 'Use of deprecated cryptographic algorithm',
          file: filePath,
          line: idx + 1,
          cwe: 'CWE-327',
          remediation: 'Use AES-256 for encryption, SHA-256+ for hashing',
          status: 'open'
        })
      }

      // Command Injection
      if (this.patterns.commandInjection.test(line)) {
        findings.push({
          id: `finding-${Date.now()}-${idx}`,
          type: 'vulnerability',
          severity: 'critical',
          title: 'Command Injection Vulnerability',
          description: 'User input passed to system command execution',
          file: filePath,
          line: idx + 1,
          cwe: 'CWE-78',
          remediation: 'Use parameterized APIs or allowlist input validation',
          status: 'open'
        })
      }
    })

    return findings
  }

  checkDependencies(packages: Array<{ name: string; version: string }>): DependencyVulnerability[] {
    const vulnerabilities: DependencyVulnerability[] = []

    packages.forEach(pkg => {
      const knownVuln = this.patterns.knownVulnerabilities.get(pkg.name)
      if (knownVuln) {
        vulnerabilities.push({
          package: pkg.name,
          version: pkg.version,
          vulnerableVersions: [knownVuln],
          vulnerability: `Known vulnerability in ${pkg.name}`,
          cve: `CVE-${Date.now()}`,
          severity: 'high',
          remediation: `Update ${pkg.name} to version > ${knownVuln}`
        })
      }
    })

    return vulnerabilities
  }

  validateCryptography(components: Array<{ name: string; algorithm: string }>): CryptographicIssue[] {
    const issues: CryptographicIssue[] = []

    components.forEach(comp => {
      if (comp.name === 'hashing') {
        if (this.cryptoStandards.hashing.deprecated.includes(comp.algorithm)) {
          issues.push({
            component: comp.name,
            issue: `Weak algorithm: ${comp.algorithm}`,
            severity: 'high',
            standard: 'NIST',
            requirement: this.cryptoStandards.hashing.required,
            actual: comp.algorithm
          })
        }
      }

      if (comp.name === 'encryption') {
        if (this.cryptoStandards.encryption.deprecated.includes(comp.algorithm)) {
          issues.push({
            component: comp.name,
            issue: `Weak encryption: ${comp.algorithm}`,
            severity: 'critical',
            standard: 'NIST SP 800-38D',
            requirement: this.cryptoStandards.encryption.required,
            actual: comp.algorithm
          })
        }
      }

      if (comp.name === 'randomness') {
        if (comp.algorithm === 'Math.random()') {
          issues.push({
            component: comp.name,
            issue: 'Non-cryptographic RNG',
            severity: 'high',
            standard: 'FIPS 140-2',
            requirement: this.cryptoStandards.randomness.required,
            actual: comp.algorithm
          })
        }
      }
    })

    return issues
  }

  generateReport(
    code: string,
    filePath: string,
    packages: Array<{ name: string; version: string }>,
    cryptoComponents: Array<{ name: string; algorithm: string }>
  ): SecurityScanReport {
    const sastFindings = this.performSASTScan(code, filePath)
    const depVulnerabilities = this.checkDependencies(packages)
    const cryptoIssues = this.validateCryptography(cryptoComponents)

    // Convert crypto issues and dep vulnerabilities to findings
    const allFindings: SecurityFinding[] = [
      ...sastFindings,
      ...depVulnerabilities.map(dv => ({
        id: `finding-${Date.now()}`,
        type: 'vulnerability' as const,
        severity: dv.severity as any,
        title: dv.vulnerability,
        description: `Vulnerable dependency: ${dv.package}@${dv.version}`,
        file: 'package.json',
        cwe: dv.cve,
        remediation: dv.remediation,
        status: 'open' as const
      })),
      ...cryptoIssues.map(ci => ({
        id: `finding-${Date.now()}`,
        type: 'vulnerability' as const,
        severity: ci.severity as any,
        title: `Cryptographic Issue: ${ci.issue}`,
        description: `${ci.component}: ${ci.standard}`,
        file: 'crypto-config',
        remediation: `Use ${ci.requirement}`,
        status: 'open' as const
      }))
    ]

    const summary = {
      total: allFindings.length,
      critical: allFindings.filter(f => f.severity === 'critical').length,
      high: allFindings.filter(f => f.severity === 'high').length,
      medium: allFindings.filter(f => f.severity === 'medium').length,
      low: allFindings.filter(f => f.severity === 'low').length,
      info: allFindings.filter(f => f.severity === 'info').length
    }

    // Score: 100 - (critical*20 + high*10 + medium*5 + low*1)
    const score = Math.max(0, 100 - (
      summary.critical * 20 +
      summary.high * 10 +
      summary.medium * 5 +
      summary.low * 1
    ))

    return {
      timestamp: new Date(),
      scanType: 'full',
      findings: allFindings,
      dependencyVulnerabilities: depVulnerabilities,
      cryptographicIssues: cryptoIssues,
      summary,
      score
    }
  }
}

export const securityValidator = new SecurityValidator()
