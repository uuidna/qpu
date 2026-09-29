/**
 * ML Module - Advanced ML and Auto-Scaling (Phase 10)
 * Predictive routing, cost optimization, auto-scaling, and anomaly analysis
 */

// Predictive Router
export {
  PredictiveRouter,
  predictiveRouter,
  type OperationProfile,
  type RoutingDecision,
  type TrainingData,
  type PredictionModel
} from './predictive-router.js'

// Cost Optimizer
export {
  CostOptimizer,
  costOptimizer,
  type CostOptimizationStrategy,
  type CostMetrics,
  type OptimizationTarget
} from './cost-optimizer.js'

// Auto-Scaler
export {
  AutoScaler,
  autoScaler,
  type ScalingMetric,
  type ScalingPolicy,
  type ResourceAllocation,
  type ScalingAction,
  type PredictedLoad
} from './auto-scaler.js'

// Anomaly Analyzer
export {
  AnomalyAnalyzer,
  anomalyAnalyzer,
  type RootCauseAnalysis,
  type RootCauseType,
  type SystemSignal,
  type CorrelationAnalysis
} from './anomaly-analyzer.js'
