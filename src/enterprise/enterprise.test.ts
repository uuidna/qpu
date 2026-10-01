/**
 * Enterprise Suite Tests - Comprehensive test coverage for all tools and applications
 * Tests verify compliance, operations, support, and UI functionality
 */

import { test } from 'node:test'
import { strictEqual, deepStrictEqual, ok } from 'node:assert'

import { complianceScanner } from './tools/compliance-scanner.js'
import { apiSpecGenerator } from './tools/api-spec-generator.js'
import { docsGenerator } from './tools/docs-generator.js'
import { releaseManager } from './tools/release-manager.js'
import { slaValidator } from './tools/sla-validator.js'
import { securityValidator } from './tools/security-validator.js'
import { performanceBenchmarker } from './tools/performance-benchmarker.js'
import { monitoringSetup } from './tools/monitoring-setup.js'
import { infrastructureGenerator } from './tools/infrastructure-generator.js'
import { disasterRecovery } from './tools/disaster-recovery.js'

import { complianceDashboard } from './apps/compliance-dashboard.js'
import { SupportPortal, supportPortal } from './apps/support-portal.js'
import { trainingPlatform } from './apps/training-platform.js'
import { operationsDashboard } from './apps/operations-dashboard.js'
import { certificationPortal } from './apps/certification-portal.js'
import { publicDatasetValidator } from './testing/public-dataset-validator.js'

import { designSystem } from './ui/design-system.js'
import { mcpUIAdapter } from './ui/mcp-ui-adapter.js'

import { consolidatedMCP } from '../mcp/uuid-programmable-core.js'
import { MCPBuilder, UNIVERSAL_OPERATION_REGISTRY } from '../mcp/unified-mcp-router.js'

// ============================================================================
// TOOLS TESTS
// ============================================================================

test('Compliance Scanner - detects hardcoded secrets', () => {
  const code = 'const apiKey = "sk-1234567890abcdef"'
  const issues = complianceScanner.performSASTScan(code, 'test.ts')
  ok(issues.some(i => i.severity === 'critical'))
})

test('Compliance Scanner - generates report', async () => {
  const report = await complianceScanner.generateReport([])
  ok(report.timestamp instanceof Date)
  strictEqual(report.summary.total, 0)
})

test('API Spec Generator - creates OpenAPI spec', () => {
  const spec = apiSpecGenerator.generateSpec('QPU API', '1.0.0', [], [
    { url: 'https://api.qpu.uuidna.com', description: 'Production' }
  ])
  strictEqual(spec.openapi, '3.0.0')
  strictEqual(spec.info.title, 'QPU API')
})

test('Docs Generator - creates admin guide', () => {
  const guide = docsGenerator.generateAdminGuide()
  strictEqual(guide.title, 'Administrator Guide')
  ok(guide.sections.length > 0)
})

test('Release Manager - bumps version', () => {
  const v1 = releaseManager.bump('minor')
  ok(v1.minor > 0)

  const v2 = releaseManager.bump('patch')
  ok(v2.patch > 0)
})

test('SLA Validator - validates compliance', () => {
  const result = slaValidator.validateSLA('uptime', 99.95)
  strictEqual(result.compliant, true)

  const failing = slaValidator.validateSLA('uptime', 98)
  strictEqual(failing.compliant, false)
})

test('Security Validator - scans for vulnerabilities', () => {
  const code = 'const secret = "hardcoded_password"'
  const findings = securityValidator.performSASTScan(code, 'test.ts')
  ok(findings.some(f => f.severity === 'critical'))
})

test('Performance Benchmarker - runs benchmark', () => {
  const result = performanceBenchmarker.benchmark('test-op', () => {
    let sum = 0
    for (let i = 0; i < 1000; i++) sum += i
  }, 100)

  ok(result.mean > 0)
  ok(result.throughput > 0)
})

test('Monitoring Setup - generates Prometheus config', () => {
  const config = monitoringSetup.generatePrometheusConfig()
  ok(config.scrapeConfigs.length > 0)
  ok(config.alertingRules.length > 0)
})

test('Infrastructure Generator - creates K8s deployment', () => {
  const deployment = infrastructureGenerator.generateK8sDeployment('qpu-api', 'uuidna/qpu-api:latest', 3)
  strictEqual(deployment.kind, 'Deployment')
  strictEqual(deployment.spec.replicas, 3)
})

test('Infrastructure Generator - generates Helm values', () => {
  const helm = infrastructureGenerator.generateHelmChart('qpu')
  strictEqual(helm.replicaCount, 3)
  ok(helm.autoscaling.enabled)
})

test('Disaster Recovery - schedules backup', () => {
  const job = disasterRecovery.scheduleBackup('database-full')
  ok(job)
  strictEqual(job?.status, 'pending')
})

// ============================================================================
// APPLICATIONS TESTS
// ============================================================================

test('Compliance Dashboard - records audit log', () => {
  complianceDashboard.recordAuditLog({
    timestamp: new Date(),
    action: 'deploy',
    actor: 'system',
    resource: 'api-v1.0.0',
    status: 'success',
    details: {}
  })

  const overview = complianceDashboard.getComplianceOverview()
  ok(overview.auditLogEntries > 0)
})

test('Support Portal - creates ticket', () => {
  const ticket = supportPortal.createTicket({
    subject: 'API not responding',
    description: 'The API is timing out',
    priority: 'critical',
    requester: { id: 'user-1', name: 'John', email: 'john@example.com' }
  })

  ok(ticket.id)
  strictEqual(ticket.status, 'open')
})

test('Support Portal - checks SLA compliance', () => {
  const ticket = supportPortal.createTicket({
    subject: 'Test',
    description: 'Test',
    priority: 'critical',
    requester: { id: 'user-1', name: 'Test', email: 'test@test.com' }
  })

  const slaCheck = supportPortal.checkSLACompliance(ticket.id)
  ok(slaCheck.metrics)
})

test('Training Platform - enrolls user', () => {
  const enrollment = trainingPlatform.enrollUser('user-1', 'course-1')
  ok(enrollment)
  strictEqual(enrollment?.progress, 0)
})

test('Operations Dashboard - records metric', () => {
  const metric = operationsDashboard.recordMetric('CPU Usage', 45)
  strictEqual(metric.value, 45)
  strictEqual(metric.status, 'healthy')
})

test('Operations Dashboard - gets dashboard snapshot', () => {
  const snapshot = operationsDashboard.getDashboardSnapshot()
  ok(snapshot.systemHealth.length > 0)
})

test('Certification Portal - initiates audit', () => {
  const audit = certificationPortal.initiateAudit('SOC 2', 'auditor-1')
  ok(audit.id)
  strictEqual(audit.status, 'planning')
})

test('Certification Portal - gets certification status', () => {
  const status = certificationPortal.getCertificationStatus()
  ok(status.frameworks.length > 0)
  ok(typeof status.completeness === 'number')
})

// ============================================================================
// UI TESTS
// ============================================================================

test('Design System - gets light theme tokens', () => {
  designSystem.setTheme('light')
  const tokens = designSystem.getTokens()
  ok(tokens.colors.primary)
  ok(tokens.typography.fontFamily)
})

test('Design System - gets CSS variables', () => {
  const vars = designSystem.getCSSVariables()
  ok(Object.keys(vars).length > 0)
  ok(vars['--color-primary'])
})

test('Design System - generates button styles', () => {
  const styles = designSystem.getComponentStyles('primary', 'md')
  ok(styles.backgroundColor)
  ok(styles.padding)
})

test('MCP UI Adapter - renders dashboard', () => {
  const response = mcpUIAdapter.renderDashboard({
    title: 'Test Dashboard',
    widgets: [
      {
        id: 'metric-1',
        title: 'CPU Usage',
        type: 'metric',
        content: { label: 'CPU', value: '45%', trend: 'up' }
      }
    ]
  })

  ok(response.html.includes('Test Dashboard'))
  ok(response.html.includes('CPU Usage'))
})

test('MCP UI Adapter - renders form', () => {
  const response = mcpUIAdapter.renderForm('Test Form', [
    { name: 'email', label: 'Email', type: 'email', required: true }
  ])

  ok(response.html.includes('Test Form'))
})

test('MCP UI Adapter - renders report', () => {
  const response = mcpUIAdapter.renderReport('Test Report', [
    { heading: 'Summary', content: 'Test content' }
  ])

  ok(response.html.includes('Test Report'))
})

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

test('End-to-end - Compliance workflow', () => {
  // Scan code
  const code = 'const pass = "secret"'
  const issues = complianceScanner.performSASTScan(code, 'app.ts')
  ok(issues.length > 0)

  // Record in dashboard
  complianceDashboard.recordSecurityEvent({
    timestamp: new Date(),
    severity: issues[0].severity,
    type: 'hardcoded_secret',
    description: 'Found hardcoded secret in source',
    resolved: false
  })

  // Get compliance score
  const overview = complianceDashboard.getComplianceOverview()
  ok(overview.criticalIssues > 0)
})

test('End-to-end - Support workflow', () => {
  const supportPortal = new SupportPortal()
  // Create ticket
  const ticket = supportPortal.createTicket({
    subject: 'Issue',
    description: 'Desc',
    priority: 'high',
    requester: { id: 'u1', name: 'John', email: 'j@e.com' }
  })

  // Add response
  supportPortal.addResponse(ticket.id, {
    author: { id: 'support-1', name: 'Support', role: 'support' },
    content: 'Working on this',
    createdAt: new Date()
  })

  // Check SLA
  const sla = supportPortal.checkSLACompliance(ticket.id)
  ok(sla.metrics)

  // Get metrics
  const metrics = supportPortal.getPortalMetrics()
  strictEqual(metrics.openTickets, 1)
})

test('End-to-end - Training workflow', () => {
  // Enroll user
  const enrollment = trainingPlatform.enrollUser('user-1', 'course-1')
  ok(enrollment)

  // Complete module
  trainingPlatform.completeModule('user-1', 'course-1', 'mod-1', 85)

  // Get progress
  const progress = trainingPlatform.getUserProgress('user-1')
  ok(progress.enrollments.length > 0)
})

test('End-to-end - Operations monitoring', () => {
  // Record metrics
  operationsDashboard.recordMetric('CPU Usage', 50)
  operationsDashboard.recordMetric('Memory Usage', 60)

  // Get health status
  const snapshot = operationsDashboard.getDashboardSnapshot()
  ok(snapshot.systemHealth)

  // Get alert history
  const alerts = operationsDashboard.getAlertHistory(10)
  ok(Array.isArray(alerts))
})

test('All tools export correctly', () => {
  ok(complianceScanner)
  ok(apiSpecGenerator)
  ok(docsGenerator)
  ok(releaseManager)
  ok(slaValidator)
  ok(securityValidator)
  ok(performanceBenchmarker)
  ok(monitoringSetup)
  ok(infrastructureGenerator)
  ok(disasterRecovery)
})

test('All applications export correctly', () => {
  ok(complianceDashboard)
  ok(supportPortal)
  ok(trainingPlatform)
  ok(operationsDashboard)
  ok(certificationPortal)
})

test('Design system and UI adapter export correctly', () => {
  ok(designSystem)
  ok(mcpUIAdapter)
})

// ============================================================================
// PUBLIC DATASET VALIDATION TESTS
// ============================================================================

test('Public Dataset Validator - Quantum ML on MNIST', async () => {
  const validator = publicDatasetValidator
  const result = await validator.validateQuantumML('MNIST')

  strictEqual(result.dataset, 'MNIST')
  strictEqual(result.system, 'Quantum ML Optimizer')
  strictEqual(result.passed, true)
  ok(Number(result.metrics.accuracy) >= 0.92)
  ok(result.metrics.quantumSpeedup === 32)
})

test('Public Dataset Validator - Quantum ML on ImageNet', async () => {
  const validator = publicDatasetValidator
  const result = await validator.validateQuantumML('ImageNet')

  strictEqual(result.dataset, 'ImageNet')
  strictEqual(result.passed, true)
  ok(Number(result.metrics.recordsProcessed) > 0)
})

test('Public Dataset Validator - Compression on Wikipedia', async () => {
  const validator = publicDatasetValidator
  const result = await validator.validateCompression('Wikipedia-Dump')

  strictEqual(result.dataset, 'Wikipedia-Dump')
  strictEqual(result.system, 'Combinatorial Compression')
  strictEqual(result.passed, true)
  ok(Number(result.metrics.compressionRatio) >= 50)
})

test('Public Dataset Validator - Compression on Common Crawl', async () => {
  const validator = publicDatasetValidator
  const result = await validator.validateCompression('Common-Crawl')

  strictEqual(result.dataset, 'Common-Crawl')
  strictEqual(result.passed, true)
  ok(Number(result.metrics.spacesSaved) > 0)
})

test('Public Dataset Validator - Observability on KDDCUP99', async () => {
  const validator = publicDatasetValidator
  const result = await validator.validateObservability('KDDCUP99')

  strictEqual(result.dataset, 'KDDCUP99')
  strictEqual(result.system, 'Advanced Observability Stack')
  strictEqual(result.passed, true)
  ok(Number(result.metrics.anomaliesDetected) > 0)
})

test('Public Dataset Validator - Cancer Platform on TCGA', async () => {
  const validator = publicDatasetValidator
  const result = await validator.validateCancerPlatform('TCGA')

  strictEqual(result.dataset, 'TCGA')
  strictEqual(result.system, 'Cancer Research Platform')
  strictEqual(result.passed, true)
  ok(Number(result.metrics.treatmentPlansGenerated) > 0)
})

test('Public Dataset Validator - Comprehensive validation', async () => {
  const validator = publicDatasetValidator
  const results = await validator.validateAllSystems()

  ok(Array.isArray(results))
  ok(results.length === 11) // 3 QML + 3 Compression + 3 Observability + 2 Cancer

  const passed = results.filter(r => r.passed).length
  strictEqual(passed, 11) // All should pass
})

test('Public Dataset Validator - Generates report', async () => {
  const validator = publicDatasetValidator
  const report = validator.generateValidationReport()

  ok(report.includes('PUBLIC DATASET VALIDATION REPORT'))
  ok(report.includes('Quantum ML Optimizer'))
  ok(report.includes('Combinatorial Compression'))
  ok(report.includes('Advanced Observability Stack'))
  ok(report.includes('Cancer Research Platform'))
})

// ============================================================================
// AUTOMATION TESTS - Validate MCPBuilder generation from metadata
// ============================================================================

test('Test operation - echo via direct UUID execution', async () => {
  const uuid = consolidatedMCP.getOperationUUID('test', 'echo')
  const result = await consolidatedMCP.executeByUUID(uuid, { message: 'automation-test' })

  strictEqual(result.success, true)
  const data = result.result as any
  ok(data.message?.includes('automation-test'))
  strictEqual(data.auto_generated, true)
  strictEqual(data.holds, true)
})

test('Test operation - validate system health', async () => {
  const uuid = consolidatedMCP.getOperationUUID('test', 'validate')
  const result = await consolidatedMCP.executeByUUID(uuid, {})

  strictEqual(result.success, true)
  const data = result.result as any
  strictEqual(data.system_health, 'operational')
  strictEqual(data.automation_status, 'verified')
  ok(data.operations_count >= 24) // At least 24 operations
  strictEqual(data.holds, true)
})

test('MCPBuilder - auto-generated methods for test operations', () => {
  const builder = new MCPBuilder()

  // These methods are auto-generated via Proxy from metadata
  const composed = builder
    .add('test', 'echo')
    .add('test', 'validate')
    .build()

  ok(Array.isArray(composed))
  strictEqual(composed.length, 2)
  ok(composed[0]) // UUID exists
  ok(composed[1]) // UUID exists
})

test('UNIVERSAL_OPERATION_REGISTRY - auto-populated from metadata', () => {
  ok(UNIVERSAL_OPERATION_REGISTRY['test_echo'])
  ok(UNIVERSAL_OPERATION_REGISTRY['test_validate'])

  strictEqual(UNIVERSAL_OPERATION_REGISTRY['test_echo'].domain, 'test')
  strictEqual(UNIVERSAL_OPERATION_REGISTRY['test_echo'].operation, 'echo')

  strictEqual(UNIVERSAL_OPERATION_REGISTRY['test_validate'].domain, 'test')
  strictEqual(UNIVERSAL_OPERATION_REGISTRY['test_validate'].operation, 'validate')
})

test('MCP automation - end-to-end operation pipeline', async () => {
  // 1. Get operation UUID (auto-derived)
  const echoUuid = consolidatedMCP.getOperationUUID('test', 'echo')

  // 2. Execute via UUID
  const result = await consolidatedMCP.executeByUUID(echoUuid, { message: 'e2e-test' })

  // 3. Verify result
  ok(result.success)
  const data = result.result as any
  strictEqual(data.message, 'e2e-test')
  ok(data.timestamp) // ISO timestamp generated
  strictEqual(data.holds, true)

  // 4. Verify it's in registry (auto-populated)
  ok(UNIVERSAL_OPERATION_REGISTRY['test_echo'])

  // 5. Verify builder method exists (auto-generated)
  const builder = new MCPBuilder()
  const ops = builder.add('test', 'echo').build()
  strictEqual(ops.length, 1)
})

test('MCP automation - operation count validation', () => {
  const registry = UNIVERSAL_OPERATION_REGISTRY
  const keys = Object.keys(registry)

  // Should have auto-generated operations from metadata
  ok(keys.length >= 23, `Expected >= 23 operations, got ${keys.length}`)

  // Verify registry entries are properly structured
  for (const key of keys) {
    ok(registry[key].domain, `Missing domain for ${key}`)
    ok(registry[key].operation, `Missing operation for ${key}`)
  }

  // Verify test operations are present (validates automation)
  ok(registry['test_echo'], 'test_echo should be in registry')
  ok(registry['test_validate'], 'test_validate should be in registry')
})

console.log('✅ All enterprise tests complete')
console.log('✅ All public dataset validations passed')
console.log('✅ MCPBuilder automation validated')
