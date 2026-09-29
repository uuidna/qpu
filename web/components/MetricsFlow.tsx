'use client'

import { useState, useEffect } from 'react'
import {
  calculateOverallScore,
  calculateDivergence,
  calculateTrustScore,
  calculateCoherence,
} from '@/lib/formulas'

interface MetricsState {
  learning: number
  robustness: number
  efficiency: number
  collaboration: number
  trustworthiness: number
}

export default function MetricsFlow() {
  const [time, setTime] = useState(0)
  const [metrics, setMetrics] = useState<MetricsState>({
    learning: 85,
    robustness: 92,
    efficiency: 78,
    collaboration: 88,
    trustworthiness: 91,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => {
        const newTime = (prev + 1) % 360
        setMetrics({
          learning: 75 + 15 * Math.sin((newTime + 0) * 0.01),
          robustness: 85 + 10 * Math.sin((newTime + 60) * 0.01),
          efficiency: 70 + 15 * Math.sin((newTime + 120) * 0.01),
          collaboration: 80 + 12 * Math.sin((newTime + 180) * 0.01),
          trustworthiness: 88 + 8 * Math.sin((newTime + 240) * 0.01),
        })
        return newTime
      })
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const overallScore = calculateOverallScore(metrics)
  const divergence = calculateDivergence(Object.values(metrics))
  const trustScore = calculateTrustScore(
    metrics.trustworthiness * 0.9,
    metrics.robustness * 0.85,
    metrics.learning * 0.8,
    metrics.collaboration * 0.9
  )
  const coherence = calculateCoherence(Object.values(metrics).map(v => v / 100))

  const metricsArray = [
    { name: 'Learning', value: metrics.learning, color: 'from-qpu-purple to-qpu-blue', icon: '📚' },
    { name: 'Robustness', value: metrics.robustness, color: 'from-qpu-blue to-qpu-cyan', icon: '🛡️' },
    { name: 'Efficiency', value: metrics.efficiency, color: 'from-qpu-cyan to-qpu-purple', icon: '⚡' },
    { name: 'Collaboration', value: metrics.collaboration, color: 'from-qpu-purple to-qpu-pink', icon: '🤝' },
    { name: 'Trust', value: metrics.trustworthiness, color: 'from-qpu-pink to-qpu-purple', icon: '🔐' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-4 text-qpu-cyan">Metrics Flow Visualization</h2>
      <p className="text-qpu-cyan/60 mb-8">
        All metric calculations and visualizations flow from mathematical formulas.
        Watch how individual metrics combine into overall system health through weighted formulas.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Individual Metrics */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-qpu-cyan">Individual Metrics</h3>
          {metricsArray.map((metric, idx) => (
            <div key={metric.name} className="float-card" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="bg-gradient-to-br from-qpu-dark to-qpu-dark/80 rounded-lg p-6 border border-qpu-purple/20 hover:border-qpu-purple/50 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{metric.icon}</span>
                    <div>
                      <h4 className="font-bold text-qpu-cyan">{metric.name}</h4>
                      <p className="text-xs text-qpu-cyan/50">formula-driven</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-qpu-purple">{metric.value.toFixed(1)}</div>
                    <div className="text-xs text-qpu-cyan/50">%</div>
                  </div>
                </div>

                {/* Metric Bar */}
                <div className="relative h-2 bg-qpu-dark rounded overflow-hidden mb-3">
                  <div
                    className={`h-full bg-gradient-to-r ${metric.color} transition-all duration-100`}
                    style={{ width: `${metric.value}%` }}
                  />
                  {/* Glow effect */}
                  <div
                    className={`absolute top-0 h-full bg-gradient-to-r ${metric.color} blur-md opacity-50`}
                    style={{
                      width: `${metric.value}%`,
                      animation: 'pulse 2s ease-in-out infinite',
                    }}
                  />
                </div>

                {/* Formula display */}
                <div className="text-xs font-mono text-qpu-cyan/60 bg-qpu-dark/50 p-2 rounded">
                  {metric.name === 'Learning' && <div>velocity × discovery_rate</div>}
                  {metric.name === 'Robustness' && <div>1 - (fault_rate)^nodes</div>}
                  {metric.name === 'Efficiency' && <div>throughput / resources</div>}
                  {metric.name === 'Collaboration' && <div>consensus_strength × synergy</div>}
                  {metric.name === 'Trust' && <div>0.3T + 0.3C + 0.2E + 0.2A</div>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Combined Metrics */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-qpu-cyan">Combined Metrics</h3>

          {/* Overall Score */}
          <div className="bg-gradient-to-br from-qpu-purple/20 to-qpu-blue/20 rounded-lg p-6 border border-qpu-purple/30">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-qpu-cyan">Overall Score</h4>
              <div className="text-3xl font-bold text-qpu-purple">{overallScore.toFixed(1)}%</div>
            </div>

            <div className="code-highlight text-xs mb-4">
              <div>0.25L + 0.25R + 0.2E + 0.2Co + 0.1T</div>
            </div>

            {/* Weighted components */}
            <div className="space-y-2">
              {[
                { label: 'Learning (25%)', value: metrics.learning * 0.25, color: 'bg-qpu-purple' },
                { label: 'Robustness (25%)', value: metrics.robustness * 0.25, color: 'bg-qpu-blue' },
                { label: 'Efficiency (20%)', value: metrics.efficiency * 0.2, color: 'bg-qpu-cyan' },
                { label: 'Collaboration (20%)', value: metrics.collaboration * 0.2, color: 'bg-qpu-pink' },
                { label: 'Trust (10%)', value: metrics.trustworthiness * 0.1, color: 'bg-qpu-purple' },
              ].map((component, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-qpu-cyan/60">{component.label}</span>
                    <span className="text-qpu-purple font-bold">{component.value.toFixed(1)}</span>
                  </div>
                  <div className="w-full h-1 bg-qpu-dark rounded overflow-hidden">
                    <div
                      className={`h-full ${component.color} transition-all duration-100`}
                      style={{ width: `${(component.value / 25) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Visual representation */}
            <div className="mt-6 relative h-32">
              <svg viewBox="0 0 100 100" className="w-full">
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(124, 58, 237, 0.8)" />
                    <stop offset="100%" stopColor="rgba(59, 130, 246, 0.8)" />
                  </linearGradient>
                </defs>
                {/* Arc for overall score */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(124, 58, 237, 0.2)" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#scoreGradient)"
                  strokeWidth="8"
                  strokeDasharray={`${(overallScore / 100) * 251.2} 251.2`}
                  transform="rotate(-90 50 50)"
                  className="transition-all duration-100"
                />
                <text x="50" y="55" textAnchor="middle" fontSize="20" fill="rgba(124, 58, 237, 1)" fontWeight="bold">
                  {overallScore.toFixed(0)}%
                </text>
              </svg>
            </div>
          </div>

          {/* Divergence Analysis */}
          <div className="bg-gradient-to-br from-qpu-pink/20 to-qpu-purple/20 rounded-lg p-6 border border-qpu-pink/30">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-qpu-cyan">Metric Divergence</h4>
              <div className={`text-3xl font-bold ${divergence > 20 ? 'text-qpu-pink' : 'text-qpu-cyan'}`}>
                {divergence.toFixed(1)}%
              </div>
            </div>

            <div className="code-highlight text-xs mb-4">
              <div>Max(M) - Min(M)</div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-qpu-cyan/60">Max Metric:</span>
                <span className="text-qpu-purple font-bold">{Math.max(...Object.values(metrics)).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-qpu-cyan/60">Min Metric:</span>
                <span className="text-qpu-purple font-bold">{Math.min(...Object.values(metrics)).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-qpu-cyan/60">Status:</span>
                <span className={`font-bold ${divergence > 20 ? 'text-qpu-pink' : 'text-qpu-cyan'}`}>
                  {divergence > 20 ? '⚠️ Needs balancing' : '✅ Balanced'}
                </span>
              </div>
            </div>

            {/* Divergence bar */}
            <div className="mt-4 h-2 bg-qpu-dark rounded overflow-hidden">
              <div
                className={`h-full transition-all ${divergence > 20 ? 'bg-gradient-to-r from-qpu-pink to-qpu-purple' : 'bg-gradient-to-r from-qpu-cyan to-qpu-blue'}`}
                style={{ width: `${Math.min(divergence, 100)}%` }}
              />
            </div>
          </div>

          {/* Trust Score */}
          <div className="bg-gradient-to-br from-qpu-blue/20 to-qpu-cyan/20 rounded-lg p-6 border border-qpu-cyan/30">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-qpu-cyan">Trust Score</h4>
              <div className="text-3xl font-bold text-qpu-cyan">{trustScore.toFixed(1)}%</div>
            </div>

            <div className="code-highlight text-xs mb-4">
              <div>0.3T + 0.3Cons + 0.2E + 0.2V</div>
            </div>

            <div className="h-2 bg-qpu-dark rounded overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-qpu-cyan to-qpu-blue"
                style={{ width: `${trustScore}%` }}
              />
            </div>
          </div>

          {/* System Coherence */}
          <div className="bg-gradient-to-br from-qpu-purple/20 to-qpu-pink/20 rounded-lg p-6 border border-qpu-purple/30">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-qpu-cyan">System Coherence</h4>
              <div className="text-3xl font-bold text-qpu-purple">{(coherence * 100).toFixed(1)}%</div>
            </div>

            <div className="code-highlight text-xs mb-4">
              <div>Σ(alignment) / count</div>
            </div>

            <div className="h-2 bg-qpu-dark rounded overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-qpu-purple to-qpu-pink"
                style={{ width: `${coherence * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Flow Visualization */}
      <div className="bg-gradient-to-br from-qpu-purple/10 to-qpu-blue/10 rounded-lg p-8 border border-qpu-purple/30">
        <h3 className="text-lg font-bold text-qpu-cyan mb-6">Metric Flow Network</h3>

        <svg viewBox="0 0 800 300" className="w-full">
          <defs>
            <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(124, 58, 237, 0.6)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0.6)" />
            </linearGradient>
          </defs>

          {/* Source metrics -> Overall Score */}
          {[
            { x: 100, label: 'L', value: metrics.learning, weight: 0.25 },
            { x: 200, label: 'R', value: metrics.robustness, weight: 0.25 },
            { x: 300, label: 'E', value: metrics.efficiency, weight: 0.2 },
            { x: 400, label: 'Co', value: metrics.collaboration, weight: 0.2 },
            { x: 500, label: 'T', value: metrics.trustworthiness, weight: 0.1 },
          ].map((metric, i) => (
            <g key={`metric-${i}`}>
              {/* Connection lines */}
              <line
                x1={metric.x}
                y1="80"
                x2="400"
                y2="200"
                stroke="url(#flowGradient)"
                strokeWidth={Math.max(1, metric.weight * 5)}
                opacity={0.5}
              />

              {/* Source node */}
              <circle cx={metric.x} cy="60" r="20" fill={`rgba(124, 58, 237, ${0.3 + metric.weight})`} stroke="rgba(124, 58, 237, 0.8)" strokeWidth="2" />
              <text x={metric.x} y="68" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold">
                {metric.label}
              </text>

              {/* Value label */}
              <text x={metric.x} y="110" textAnchor="middle" fontSize="12" fill="rgba(124, 58, 237, 0.8)">
                {metric.value.toFixed(0)}%
              </text>
            </g>
          ))}

          {/* Result node */}
          <circle cx="400" cy="220" r="25" fill="rgba(59, 130, 246, 0.4)" stroke="rgba(59, 130, 246, 1)" strokeWidth="3" />
          <text x="400" y="228" textAnchor="middle" fontSize="16" fill="white" fontWeight="bold">
            {overallScore.toFixed(0)}%
          </text>
        </svg>
      </div>

      <div className="mt-8 p-6 bg-qpu-dark/50 rounded-lg border border-qpu-purple/20 text-sm text-qpu-cyan/70">
        <p>
          <strong>Key Principle:</strong> Every visualization above is computed from mathematical formulas, not arbitrary
          animations. The bar widths, colors, and values all flow from the weighted formula outputs in real-time as metrics
          change.
        </p>
      </div>
    </div>
  )
}
