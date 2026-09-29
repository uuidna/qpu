/**
 * Field Reference Audit
 * Audit all text fields and create proper references instead of inline text
 *
 * Pattern: Instead of hardcoding strings, use named references that can be scoped and hooked
 */

// Field reference registry
export const fieldReferences = {
  users: {
    email: { type: 'email', required: true, unique: true, label: 'Email Address' },
    name: { type: 'text', required: true, label: 'User Name' },
    role: { type: 'select', required: true, label: 'User Role' },
    active: { type: 'checkbox', required: false, label: 'Active Status' },
  },
  complianceIssues: {
    severity: { type: 'select', required: true, label: 'Issue Severity' },
    type: { type: 'text', required: true, label: 'Issue Type' },
    description: { type: 'textarea', required: true, label: 'Issue Description' },
    file: { type: 'text', required: false, label: 'Source File' },
    line: { type: 'number', required: false, label: 'Line Number' },
    resolved: { type: 'checkbox', required: false, label: 'Resolution Status' },
    resolvedAt: { type: 'date', required: false, label: 'Resolution Date' },
    discoveredAt: { type: 'date', required: true, label: 'Discovery Date' },
  },
  auditLogs: {
    timestamp: { type: 'date', required: true, label: 'Timestamp' },
    action: { type: 'select', required: true, label: 'Action Type' },
    actor: { type: 'text', required: true, label: 'Actor ID' },
    resource: { type: 'text', required: true, label: 'Resource' },
    status: { type: 'select', required: true, label: 'Status' },
    details: { type: 'textarea', required: false, label: 'Details' },
    ipAddress: { type: 'text', required: false, label: 'IP Address' },
  },
  supportTickets: {
    ticketNumber: { type: 'text', required: true, unique: true, label: 'Ticket Number' },
    subject: { type: 'text', required: true, label: 'Subject' },
    description: { type: 'textarea', required: true, label: 'Description' },
    priority: { type: 'select', required: true, label: 'Priority Level' },
    status: { type: 'select', required: true, label: 'Ticket Status' },
    slaMet: { type: 'checkbox', required: false, label: 'SLA Met' },
  },
  enrollments: {
    courseId: { type: 'text', required: true, label: 'Course ID' },
    courseName: { type: 'text', required: false, label: 'Course Name' },
    progress: { type: 'number', required: false, label: 'Progress Percentage' },
    status: { type: 'select', required: true, label: 'Enrollment Status' },
  },
  metrics: {
    name: { type: 'text', required: true, label: 'Metric Name' },
    category: { type: 'select', required: false, label: 'Metric Category' },
    value: { type: 'number', required: true, label: 'Metric Value' },
    unit: { type: 'text', required: false, label: 'Unit of Measurement' },
    status: { type: 'select', required: false, label: 'Health Status' },
    timestamp: { type: 'date', required: true, label: 'Timestamp' },
    threshold: { type: 'number', required: false, label: 'Threshold Value' },
    trend: { type: 'select', required: false, label: 'Trend Direction' },
    source: { type: 'text', required: false, label: 'Data Source' },
  },
  certifications: {
    framework: { type: 'text', required: true, label: 'Certification Framework' },
    status: { type: 'select', required: true, label: 'Certification Status' },
    auditor: { type: 'text', required: false, label: 'Auditor Name' },
    completeness: { type: 'number', required: false, label: 'Completeness %' },
    startDate: { type: 'date', required: false, label: 'Start Date' },
    targetDate: { type: 'date', required: false, label: 'Target Date' },
    completedDate: { type: 'date', required: false, label: 'Completion Date' },
    validUntil: { type: 'date', required: false, label: 'Valid Until Date' },
  },
}

// Enum references (instead of inline arrays)
export const fieldEnums = {
  userRoles: ['admin', 'support', 'auditor', 'trainer', 'user'] as const,
  severityLevels: ['critical', 'high', 'medium', 'low', 'info'] as const,
  auditActions: ['deploy', 'access', 'modify', 'delete', 'export'] as const,
  auditStatus: ['success', 'failure', 'pending'] as const,
  ticketPriorities: ['low', 'medium', 'high', 'critical'] as const,
  ticketStatus: ['open', 'in-progress', 'waiting', 'resolved', 'closed'] as const,
  enrollmentStatus: ['enrolled', 'in-progress', 'completed', 'dropped'] as const,
  metricCategories: ['system', 'performance', 'reliability', 'business'] as const,
  metricStatus: ['healthy', 'warning', 'critical'] as const,
  metricTrends: ['up', 'down', 'stable'] as const,
  certificationStatus: ['planning', 'in-progress', 'review', 'completed', 'expired'] as const,
}

// Field paths for scoped access
export const fieldPaths = {
  users: {
    email: 'users.email',
    name: 'users.name',
    role: 'users.role',
  },
  complianceIssues: {
    severity: 'complianceIssues.severity',
    type: 'complianceIssues.type',
    description: 'complianceIssues.description',
  },
  auditLogs: {
    action: 'auditLogs.action',
    status: 'auditLogs.status',
    actor: 'auditLogs.actor',
  },
  supportTickets: {
    ticketNumber: 'supportTickets.ticketNumber',
    subject: 'supportTickets.subject',
    priority: 'supportTickets.priority',
    status: 'supportTickets.status',
  },
  enrollments: {
    courseId: 'enrollments.courseId',
    courseName: 'enrollments.courseName',
    progress: 'enrollments.progress',
  },
  metrics: {
    name: 'metrics.name',
    value: 'metrics.value',
    status: 'metrics.status',
  },
  certifications: {
    framework: 'certifications.framework',
    status: 'certifications.status',
  },
}

// Get field reference by path
export function getFieldReference(
  collection: keyof typeof fieldReferences,
  field: string,
): (typeof fieldReferences)[typeof collection][keyof typeof fieldReferences[typeof collection]] | null {
  const collectionRef = fieldReferences[collection]
  return collectionRef?.[field as keyof typeof collectionRef] || null
}

// Get enum options for a field
export function getEnumOptions(enumKey: keyof typeof fieldEnums): readonly string[] {
  return fieldEnums[enumKey]
}

// Validate field value against enum
export function validateFieldEnum(
  enumKey: keyof typeof fieldEnums,
  value: string,
): boolean {
  return getEnumOptions(enumKey).includes(value)
}

// Get field path for scoping
export function getFieldPath(
  collection: keyof typeof fieldPaths,
  field: string,
): string | null {
  const collectionPaths = fieldPaths[collection]
  return collectionPaths?.[field as keyof typeof collectionPaths] || null
}

// Audit summary
export function getFieldAuditSummary() {
  const summary = {
    collections: Object.keys(fieldReferences).length,
    totalFields: 0,
    requiredFields: 0,
    uniqueFields: 0,
    textFields: 0,
    selectFields: 0,
    numberFields: 0,
    dateFields: 0,
    enums: Object.keys(fieldEnums).length,
    fieldPaths: Object.keys(fieldPaths).length,
  }

  // Count field types
  Object.values(fieldReferences).forEach((collection) => {
    Object.values(collection).forEach((field: any) => {
      summary.totalFields++
      if (field.required) summary.requiredFields++
      if (field.unique) summary.uniqueFields++
      if (field.type === 'text' || field.type === 'textarea') summary.textFields++
      if (field.type === 'select') summary.selectFields++
      if (field.type === 'number') summary.numberFields++
      if (field.type === 'date') summary.dateFields++
    })
  })

  return summary
}
