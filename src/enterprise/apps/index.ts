/**
 * Enterprise Applications Index - Exports all institutional apps
 */

export { ComplianceDashboard, type ComplianceMetric, type AuditLogEntry } from './compliance-dashboard'
export { SupportPortal, type SupportTicket, type KnowledgeBaseArticle } from './support-portal'
export { TrainingPlatform, type Course, type Certification } from './training-platform'
export { OperationsDashboard, type SystemMetric, type Alert, type IncidentTimeline } from './operations-dashboard'

// Instances
export { complianceDashboard } from './compliance-dashboard'
export { supportPortal } from './support-portal'
export { trainingPlatform } from './training-platform'
export { operationsDashboard } from './operations-dashboard'
