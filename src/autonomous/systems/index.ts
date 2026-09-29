/**
 * Autonomous Systems Index
 * Exports all autonomous systems for wave coordinator
 */

export { MonitoringSystem, createMonitoringSystem } from './monitoring'
export { OptimizationSystem, createOptimizationSystem } from './optimization'
export { LearningSystem, createLearningSystem } from './learning'
export { ValidationSystem, createValidationSystem } from './validation'
export { DeploymentSystem, createDeploymentSystem } from './deployment'
export { CapacityPlanning, createCapacityPlanning } from './capacity'
export { IncidentResponse, createIncidentResponse } from './incident'

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
