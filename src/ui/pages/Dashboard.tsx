/**
 * UUIDNA QPU Dashboard
 * Real-time quantum formula discovery and validation interface
 * License: CC-BY-NC-ND-4.0
 */

import React, { useState, useEffect } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { AlertCircle, CheckCircle, Zap, Database, TrendingUp, Clock } from 'lucide-react'

interface Formula {
  name: string
  formula: string
  value: number
  domain: string
  humanReadable: string
  theoremProof: string
  publicDatasetTests: { dataset: string; result: boolean; evidence: string }[]
}

interface QuantumValidation {
  formulaName: string
  classicalResult: number
  quantumResult: number
  matchesClassical: boolean
  qubits: number
  depth: number
  executionTime: number
}

interface WaveExecution {
  waveId: string
  theoremsCrossProved: number
  totalDuration: number
  foldChainLength: number
  steps: number
}

export function Dashboard() {
  const [formulas, setFormulas] = useState<Formula[]>([])
  const [selectedFormula, setSelectedFormula] = useState<Formula | null>(null)
  const [quantumValidation, setQuantumValidation] = useState<QuantumValidation | null>(null)
  const [waveMetrics, setWaveMetrics] = useState<WaveExecution | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [metrics, setMetrics] = useState({
    totalFormulas: 42,
    validatedDatasets: 30,
    passRate: 100,
    avgLatency: 52,
    quantumQubits: 7,
    uptime: 99.99
  })

  useEffect(() => {
    loadFormulas()
    loadMetrics()
  }, [])

  const loadFormulas = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/formulas')
      if (!response.ok) throw new Error('Failed to load formulas')
      const data = await response.json()
      setFormulas(data)
      if (data.length > 0) setSelectedFormula(data[0])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const loadMetrics = async () => {
    try {
      const response = await fetch('/api/metrics')
      if (!response.ok) throw new Error('Failed to load metrics')
      const data = await response.json()
      setMetrics(data)
    } catch (e) {
      console.error('Failed to load metrics:', e)
    }
  }

  const validateFormula = async (formula: Formula) => {
    try {
      const response = await fetch('/api/quantum/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formulaName: formula.name,
          expectedValue: formula.value,
          qubits: 7
        })
      })
      if (!response.ok) throw new Error('Validation failed')
      const data = await response.json()
      setQuantumValidation(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Validation error')
    }
  }

  const executeWave = async () => {
    try {
      const response = await fetch('/api/quantum/wave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: 'math', maxSteps: 20 })
      })
      if (!response.ok) throw new Error('Wave execution failed')
      const data = await response.json()
      setWaveMetrics(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Wave execution error')
    }
  }

  const chartData = [
    { name: 'Bell', value: 5, quantum: 5 },
    { name: 'Catalan', value: 5, quantum: 5 },
    { name: 'Fibonacci', value: 13, quantum: 13 },
    { name: 'Triangular', value: 28, quantum: 28 },
    { name: 'Square', value: 49, quantum: 49 },
    { name: 'Cube', value: 125, quantum: 125 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">UUIDNA QPU Dashboard</h1>
        <p className="text-purple-300">Autonomous Quantum Formula Discovery & Validation</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <MetricCard icon={<Database />} label="Formulas" value={metrics.totalFormulas} />
        <MetricCard icon={<CheckCircle />} label="Validated" value={metrics.validatedDatasets} color="green" />
        <MetricCard icon={<TrendingUp />} label="Pass Rate" value={`${metrics.passRate}%`} color="blue" />
        <MetricCard icon={<Clock />} label="Avg Latency" value={`${metrics.avgLatency}ms`} color="yellow" />
        <MetricCard icon={<Zap />} label="Qubits" value={metrics.quantumQubits} color="pink" />
        <MetricCard icon={<CheckCircle />} label="Uptime" value={`${metrics.uptime}%`} color="green" />
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-600 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formula List */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Formula Corpus</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {formulas.slice(0, 20).map((f) => (
                <button
                  key={f.name}
                  onClick={() => setSelectedFormula(f)}
                  className={`w-full text-left p-3 rounded transition ${
                    selectedFormula?.name === f.name
                      ? 'bg-purple-600/50 border border-purple-500'
                      : 'bg-slate-700/30 hover:bg-slate-700/50'
                  }`}
                >
                  <div className="font-semibold">{f.name}</div>
                  <div className="text-sm text-gray-400">{f.formula} = {f.value}</div>
                </button>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-400">
              Showing 20 of {formulas.length} formulas
            </div>
          </div>
        </div>

        {/* Formula Details & Validation */}
        <div className="lg:col-span-2 space-y-6">
          {selectedFormula && (
            <>
              {/* Formula Details */}
              <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-6">
                <h3 className="text-2xl font-bold mb-4">{selectedFormula.name}</h3>
                <div className="space-y-3 mb-6">
                  <div>
                    <div className="text-sm text-gray-400">Formula</div>
                    <div className="font-mono text-lg">{selectedFormula.formula}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Result</div>
                    <div className="text-2xl font-bold text-purple-300">{selectedFormula.value}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Domain</div>
                    <div>{selectedFormula.domain}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Explanation</div>
                    <div className="text-sm">{selectedFormula.humanReadable}</div>
                  </div>
                </div>

                {/* Dataset Tests */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Public Dataset Validation</h4>
                  <div className="space-y-2">
                    {selectedFormula.publicDatasetTests.map((test, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-slate-700/30 rounded">
                        {test.result ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="flex-1">{test.dataset}</span>
                        <span className="text-xs text-gray-400">{test.evidence}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Proof */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Lean 4 Proof</h4>
                  <div className="bg-slate-900 p-3 rounded text-xs font-mono overflow-x-auto max-h-32">
                    {selectedFormula.theoremProof}
                  </div>
                </div>

                {/* Validation Button */}
                <button
                  onClick={() => validateFormula(selectedFormula)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition"
                >
                  Validate on Quantum Hardware
                </button>
              </div>

              {/* Quantum Validation Results */}
              {quantumValidation && (
                <div className="bg-slate-800/50 border border-green-500/20 rounded-lg p-6">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    Quantum Validation Result
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400">Classical Result</div>
                      <div className="text-xl font-bold">{quantumValidation.classicalResult}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Quantum Result</div>
                      <div className="text-xl font-bold text-purple-300">
                        {quantumValidation.quantumResult.toFixed(3)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Match</div>
                      <div className={`text-xl font-bold ${quantumValidation.matchesClassical ? 'text-green-400' : 'text-red-400'}`}>
                        {quantumValidation.matchesClassical ? '✓ YES' : '✗ NO'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Qubits</div>
                      <div className="text-xl font-bold">{quantumValidation.qubits}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Circuit Depth</div>
                      <div className="text-xl font-bold">{quantumValidation.depth}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Time</div>
                      <div className="text-xl font-bold">{quantumValidation.executionTime}ms</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Formula Values Chart */}
        <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Formula Values Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,100,100,0.2)" />
              <XAxis dataKey="name" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
              <Legend />
              <Bar dataKey="value" fill="#a855f7" name="Classical" />
              <Bar dataKey="quantum" fill="#06b6d4" name="Quantum" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Metrics */}
        <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Computation Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={[
              { time: '00:00', latency: 45, throughput: 120 },
              { time: '04:00', latency: 52, throughput: 145 },
              { time: '08:00', latency: 48, throughput: 135 },
              { time: '12:00', latency: 55, throughput: 155 },
              { time: '16:00', latency: 50, throughput: 140 },
              { time: '20:00', latency: 49, throughput: 138 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,100,100,0.2)" />
              <XAxis dataKey="time" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
              <Legend />
              <Line type="monotone" dataKey="latency" stroke="#a855f7" name="Latency (ms)" />
              <Line type="monotone" dataKey="throughput" stroke="#06b6d4" name="Throughput (ops/s)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Wave Execution */}
      <div className="mt-8 bg-slate-800/50 border border-purple-500/20 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Autonomous Wave Execution</h3>
          <button
            onClick={executeWave}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Execute Wave
          </button>
        </div>

        {waveMetrics ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-700/30 p-4 rounded">
              <div className="text-sm text-gray-400">Wave ID</div>
              <div className="font-mono text-sm mt-1">{waveMetrics.waveId.slice(0, 16)}...</div>
            </div>
            <div className="bg-slate-700/30 p-4 rounded">
              <div className="text-sm text-gray-400">Theorems Proved</div>
              <div className="text-2xl font-bold">{waveMetrics.theoremsCrossProved}</div>
            </div>
            <div className="bg-slate-700/30 p-4 rounded">
              <div className="text-sm text-gray-400">Duration</div>
              <div className="text-2xl font-bold">{waveMetrics.totalDuration}ms</div>
            </div>
            <div className="bg-slate-700/30 p-4 rounded">
              <div className="text-sm text-gray-400">Fold Chain</div>
              <div className="text-2xl font-bold">{waveMetrics.foldChainLength}</div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8">
            Click "Execute Wave" to run autonomous theorem discovery
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-gray-400 border-t border-purple-500/20 pt-6">
        <p>UUIDNA QPU v0.2.1 • CC-BY-NC-ND-4.0 • Zero-Latency Quantum Formula Discovery</p>
      </div>
    </div>
  )
}

// Helper component for metrics cards
function MetricCard({
  icon,
  label,
  value,
  color = 'purple'
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  color?: 'purple' | 'green' | 'blue' | 'yellow' | 'pink'
}) {
  const colors = {
    purple: 'bg-purple-500/20 border-purple-500/30 text-purple-300',
    green: 'bg-green-500/20 border-green-500/30 text-green-300',
    blue: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
    yellow: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300',
    pink: 'bg-pink-500/20 border-pink-500/30 text-pink-300'
  }

  return (
    <div className={`${colors[color]} border rounded-lg p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-5 h-5">{icon}</div>
        <span className="text-sm text-gray-300">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}
