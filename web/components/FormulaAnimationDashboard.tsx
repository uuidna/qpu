'use client'

import { useState, useEffect } from 'react'
import {
  calculateWaveGain,
  calculateConvergence,
  calculateSpeedup,
  calculateSynergy,
  calculateThroughput,
} from '@/lib/formulas'

export default function FormulaAnimationDashboard() {
  const [time, setTime] = useState(0)
  const [params, setParams] = useState({
    waveNumber: 10,
    parallelism: 256,
    baseA: 0.85,
    baseB: 0.90,
    alignment: 0.95,
    timing: 0.88,
    nodes: 150,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => (t + 1) % 100)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  // Calculate all formula outputs
  const waveGain = calculateWaveGain(8, 0.15, params.waveNumber)
  const convergence = calculateConvergence(100, 0.15, time * 2)
  const speedup = calculateSpeedup(0.85, params.parallelism)
  const synergy = calculateSynergy(params.baseA, params.baseB, params.alignment, params.timing)
  const throughput = calculateThroughput(100, params.nodes, 0.12)

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-8 text-qpu-cyan">
        Formula-Driven Animations
      </h2>
      <p className="text-qpu-cyan/60 mb-8">
        All animations below are computed from their exact mathematical formulas in real-time. Adjust parameters to see how formulas change the visualizations.
      </p>

      {/* Parameter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 bg-qpu-dark/50 p-6 rounded-lg border border-qpu-purple/20">
        <div>
          <label className="block text-qpu-cyan/60 text-sm mb-2">Wave Number</label>
          <input
            type="range"
            min="1"
            max="30"
            value={params.waveNumber}
            onChange={e => setParams({ ...params, waveNumber: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="text-qpu-purple font-bold mt-1">{params.waveNumber}</div>
        </div>

        <div>
          <label className="block text-qpu-cyan/60 text-sm mb-2">Parallelism</label>
          <input
            type="range"
            min="1"
            max="256"
            step="16"
            value={params.parallelism}
            onChange={e => setParams({ ...params, parallelism: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="text-qpu-purple font-bold mt-1">{params.parallelism}</div>
        </div>

        <div>
          <label className="block text-qpu-cyan/60 text-sm mb-2">Nodes</label>
          <input
            type="range"
            min="1"
            max="200"
            step="10"
            value={params.nodes}
            onChange={e => setParams({ ...params, nodes: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="text-qpu-purple font-bold mt-1">{params.nodes}</div>
        </div>

        <div>
          <label className="block text-qpu-cyan/60 text-sm mb-2">Base A Strength</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={params.baseA}
            onChange={e => setParams({ ...params, baseA: parseFloat(e.target.value) })}
            className="w-full"
          />
          <div className="text-qpu-purple font-bold mt-1">{params.baseA.toFixed(2)}</div>
        </div>
      </div>

      {/* Formula Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 1. Wave Gain Formula */}
        <div className="bg-gradient-to-br from-qpu-purple/10 to-qpu-blue/10 rounded-lg p-8 border border-qpu-purple/30">
          <h3 className="text-lg font-bold text-qpu-cyan mb-4">Wave Gain Formula</h3>
          <div className="code-highlight mb-4 text-xs">
            <div>Gain(n) = G₀ × e<sup>(-λn)</sup></div>
            <div className="mt-2 text-qpu-blue">G₀ = 8%, λ = 0.15</div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-qpu-cyan/60">Wave {params.waveNumber}</span>
              <span className="text-qpu-purple font-bold text-lg">{waveGain.toFixed(2)}%</span>
            </div>
            <div className="w-full bg-qpu-dark rounded overflow-hidden h-4">
              <div
                className="h-full bg-gradient-to-r from-qpu-purple to-qpu-blue transition-all"
                style={{
                  width: `${Math.min(waveGain, 8) * 12.5}%`,
                  boxShadow: '0 0 20px rgba(124, 58, 237, 0.8)',
                }}
              />
            </div>
          </div>

          <svg viewBox="0 0 400 200" className="w-full mt-6">
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="rgba(124, 58, 237, 0.2)" />
                <stop offset="100%" stopColor="rgba(59, 130, 246, 0.6)" />
              </linearGradient>
            </defs>

            <polyline
              points={Array.from({ length: 30 }, (_, i) => {
                const x = (i / 29) * 400
                const y = 150 - calculateWaveGain(8, 0.15, i + 1) * 15
                return `${x},${y}`
              }).join(' ')}
              fill="none"
              stroke="url(#waveGradient)"
              strokeWidth="3"
              className="connection-line"
            />

            {/* Current position */}
            <circle
              cx={(params.waveNumber / 29) * 400}
              cy={150 - waveGain * 15}
              r="4"
              fill="rgba(124, 58, 237, 1)"
              className="pulse-glow"
            />
          </svg>
        </div>

        {/* 2. Convergence Formula */}
        <div className="bg-gradient-to-br from-qpu-blue/10 to-qpu-cyan/10 rounded-lg p-8 border border-qpu-blue/30">
          <h3 className="text-lg font-bold text-qpu-cyan mb-4">Convergence Formula</h3>
          <div className="code-highlight mb-4 text-xs">
            <div>f(n) = Target × (1 - e<sup>(-k×n)</sup>)</div>
            <div className="mt-2 text-qpu-blue">Target = 100, k = 0.15</div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-qpu-cyan/60">Convergence Progress</span>
              <span className="text-qpu-purple font-bold text-lg">{convergence.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-qpu-dark rounded overflow-hidden h-4">
              <div
                className="h-full bg-gradient-to-r from-qpu-cyan to-qpu-purple transition-all"
                style={{
                  width: `${convergence}%`,
                  boxShadow: '0 0 20px rgba(6, 182, 212, 0.8)',
                }}
              />
            </div>
          </div>

          <svg viewBox="0 0 400 200" className="w-full mt-6">
            <polyline
              points={Array.from({ length: 100 }, (_, i) => {
                const x = (i / 99) * 400
                const y = 150 - calculateConvergence(100, 0.15, i) * 1.5
                return `${x},${y}`
              }).join(' ')}
              fill="none"
              stroke="rgba(6, 182, 212, 0.8)"
              strokeWidth="3"
              className="connection-line"
            />

            {/* Asymptote line */}
            <line x1="0" y1="0" x2="400" y2="0" stroke="rgba(124, 58, 237, 0.3)" strokeWidth="1" strokeDasharray="5,5" />

            {/* Current position */}
            <circle
              cx={(time / 100) * 400}
              cy={150 - convergence * 1.5}
              r="4"
              fill="rgba(6, 182, 212, 1)"
              className="pulse-glow"
            />
          </svg>
        </div>

        {/* 3. Speedup Formula */}
        <div className="bg-gradient-to-br from-qpu-pink/10 to-qpu-purple/10 rounded-lg p-8 border border-qpu-pink/30">
          <h3 className="text-lg font-bold text-qpu-cyan mb-4">Amdahl's Law (Speedup)</h3>
          <div className="code-highlight mb-4 text-xs">
            <div>Speedup(p) = 1 / ((1-f) + f/p)</div>
            <div className="mt-2 text-qpu-blue">f = 0.85 (optimizable), p = parallelism</div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-qpu-cyan/60">Speedup at {params.parallelism}x parallelism</span>
              <span className="text-qpu-purple font-bold text-lg">{speedup.toFixed(1)}x</span>
            </div>
            <div className="w-full bg-qpu-dark rounded overflow-hidden h-4">
              <div
                className="h-full bg-gradient-to-r from-qpu-pink to-qpu-purple transition-all"
                style={{
                  width: `${Math.min(speedup, 256) / 2.56}%`,
                  boxShadow: '0 0 20px rgba(236, 72, 153, 0.8)',
                }}
              />
            </div>
          </div>

          <svg viewBox="0 0 400 200" className="w-full mt-6">
            <polyline
              points={Array.from({ length: 50 }, (_, i) => {
                const p = (i / 49) * 256 + 1
                const x = (i / 49) * 400
                const y = 150 - calculateSpeedup(0.85, p)
                return `${x},${y}`
              }).join(' ')}
              fill="none"
              stroke="rgba(236, 72, 153, 0.8)"
              strokeWidth="3"
              className="connection-line"
            />

            {/* Current position */}
            <circle
              cx={((params.parallelism - 1) / 255) * 400}
              cy={150 - speedup}
              r="4"
              fill="rgba(236, 72, 153, 1)"
              className="pulse-glow"
            />
          </svg>
        </div>

        {/* 4. Synergy Formula */}
        <div className="bg-gradient-to-br from-qpu-cyan/10 to-qpu-blue/10 rounded-lg p-8 border border-qpu-cyan/30">
          <h3 className="text-lg font-bold text-qpu-cyan mb-4">Synergy Formula</h3>
          <div className="code-highlight mb-4 text-xs">
            <div>Synergy = Base(A) × Base(B) × Align × Time</div>
            <div className="mt-2 text-qpu-blue">
              A={params.baseA.toFixed(2)}, B={params.baseB.toFixed(2)}, Align=0.95, Time=0.88
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-qpu-cyan/60">Synergy Strength</span>
              <span className="text-qpu-purple font-bold text-lg">{(synergy * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-qpu-dark rounded overflow-hidden h-4">
              <div
                className="h-full bg-gradient-to-r from-qpu-cyan to-qpu-blue transition-all"
                style={{
                  width: `${synergy * 100}%`,
                  boxShadow: '0 0 20px rgba(6, 182, 212, 0.8)',
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-qpu-dark/50 p-2 rounded">
              <div className="text-qpu-cyan/60 text-xs">Base A</div>
              <div className="text-qpu-purple font-bold">{params.baseA.toFixed(2)}</div>
            </div>
            <div className="bg-qpu-dark/50 p-2 rounded">
              <div className="text-qpu-cyan/60 text-xs">Base B</div>
              <div className="text-qpu-purple font-bold">{params.baseB.toFixed(2)}</div>
            </div>
            <div className="bg-qpu-dark/50 p-2 rounded">
              <div className="text-qpu-cyan/60 text-xs">Alignment</div>
              <div className="text-qpu-purple font-bold">{params.alignment.toFixed(2)}</div>
            </div>
            <div className="bg-qpu-dark/50 p-2 rounded">
              <div className="text-qpu-cyan/60 text-xs">Timing</div>
              <div className="text-qpu-purple font-bold">{params.timing.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* 5. Throughput Formula */}
        <div className="bg-gradient-to-br from-qpu-purple/10 to-qpu-pink/10 rounded-lg p-8 border border-qpu-purple/30 lg:col-span-2">
          <h3 className="text-lg font-bold text-qpu-cyan mb-4">Throughput Scaling Formula</h3>
          <div className="code-highlight mb-4 text-xs">
            <div>Throughput(N) = Single_Node × N × (1 - Overhead)</div>
            <div className="mt-2 text-qpu-blue">
              Single_Node = 100 ops/s, Nodes = {params.nodes}, Overhead = 0.12 (12%)
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-qpu-cyan/60">Total Throughput</span>
              <span className="text-qpu-purple font-bold text-lg">{(throughput / 1000).toFixed(1)}K ops/s</span>
            </div>
            <div className="w-full bg-qpu-dark rounded overflow-hidden h-4">
              <div
                className="h-full bg-gradient-to-r from-qpu-purple to-qpu-pink transition-all"
                style={{
                  width: `${Math.min(throughput / 20, 100)}%`,
                  boxShadow: '0 0 20px rgba(236, 72, 153, 0.8)',
                }}
              />
            </div>
          </div>

          <svg viewBox="0 0 400 150" className="w-full mt-6">
            <polyline
              points={Array.from({ length: 50 }, (_, i) => {
                const n = (i / 49) * 200 + 1
                const x = (i / 49) * 400
                const tput = calculateThroughput(100, n, 0.12)
                const y = 120 - (tput / 20) * 0.6
                return `${x},${y}`
              }).join(' ')}
              fill="none"
              stroke="rgba(236, 72, 153, 0.8)"
              strokeWidth="3"
              className="connection-line"
            />

            {/* Current position */}
            <circle
              cx={((params.nodes - 1) / 199) * 400}
              cy={120 - (throughput / 20) * 0.6}
              r="4"
              fill="rgba(236, 72, 153, 1)"
              className="pulse-glow"
            />
          </svg>
        </div>
      </div>

      <div className="mt-12 p-6 bg-qpu-dark/50 rounded-lg border border-qpu-purple/20 text-sm text-qpu-cyan/70">
        <p className="mb-2">
          <strong>Key Insight:</strong> All visualizations update in real-time as you adjust parameters.
        </p>
        <p>
          The width, height, and color intensity of each animation are driven by the mathematical formula output,
          not arbitrary timings. This makes the mathematical relationships visually intuitive.
        </p>
      </div>
    </div>
  )
}
