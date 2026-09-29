/**
 * Enterprise Applications Index - Exports all institutional apps
 */

export { ComplianceDashboard, type ComplianceMetric, type AuditLogEntry } from './compliance-dashboard.js'
export { SupportPortal, type SupportTicket, type KnowledgeBaseArticle } from './support-portal.js'
export { TrainingPlatform, type Course, type Certification } from './training-platform.js'
export { OperationsDashboard, type SystemMetric, type Alert, type IncidentTimeline } from './operations-dashboard.js'

// Instances
export { complianceDashboard } from './compliance-dashboard.js'
export { supportPortal } from './support-portal.js'
export { trainingPlatform } from './training-platform.js'
export { operationsDashboard } from './operations-dashboard.js'
