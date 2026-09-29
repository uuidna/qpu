/**
 * Autonomous Systems Index
 * Exports all autonomous systems for wave coordinator
 */

export { MonitoringSystem, createMonitoringSystem } from './monitoring.js'
export { OptimizationSystem, createOptimizationSystem } from './optimization.js'
export { LearningSystem, createLearningSystem } from './learning.js'
export { ValidationSystem, createValidationSystem } from './validation.js'
export { DeploymentSystem, createDeploymentSystem } from './deployment.js'
export { CapacityPlanning, createCapacityPlanning } from './capacity.js'
export { IncidentResponse, createIncidentResponse } from './incident.js'

// System registry
export const AUTONOMOUS_SYSTEMS = [
  'monitoring',
  'optimization',
  'learning',
  'validation',
  'deployment',
  'capacity',
  'incident'
] as const

export type AutonomousSystemName = (typeof AUTONOMOUS_SYSTEMS)[number]
