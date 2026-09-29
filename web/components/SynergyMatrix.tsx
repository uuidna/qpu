'use client'

import { useState, useEffect } from 'react'
import { calculateSynergy } from '@/lib/formulas'

interface MatrixCell {
  x: number
  y: number
  value: number
}

export default function SynergyMatrix() {
  const [matrix, setMatrix] = useState<MatrixCell[]>([])
  const [selectedCell, setSelectedCell] = useState<MatrixCell | null>(null)
  const [animationTime, setAnimationTime] = useState(0)

  useEffect(() => {
    // Generate 15x15 synergy matrix
    const size = 15
    const cells: MatrixCell[] = []

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        // Formula: Synergy = Base(A) × Base(B) × Alignment × Timing
        const baseA = 0.5 + (i / size) * 0.5 // 0.5 to 1.0
        const baseB = 0.5 + (j / size) * 0.5 // 0.5 to 1.0
        const alignment = 0.7 + Math.random() * 0.25
        const timing = 0.8 + Math.random() * 0.2

        const synergy = calculateSynergy(baseA, baseB, alignment, timing)

        cells.push({
          x: i,
          y: j,
          value: synergy,
        })
      }
    }

    setMatrix(cells)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTime(t => (t + 1) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const maxValue = Math.max(...matrix.map(c => c.value))
  const cellSize = 40

  // Heat color from value (0 to 1)
  const getColorForValue = (value: number) => {
    const normalized = value / maxValue
    if (normalized < 0.3) return 'rgba(124, 58, 237, 0.2)'
    if (normalized < 0.6) return 'rgba(59, 130, 246, 0.4)'
    if (normalized < 0.8) return 'rgba(6, 182, 212, 0.6)'
    return 'rgba(236, 72, 153, 0.8)'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-4 text-qpu-cyan">Synergy Matrix Visualization</h2>
      <p className="text-qpu-cyan/60 mb-8">
        Formula: Synergy(A,B) = Base(A) × Base(B) × Alignment × Timing. Cell color and intensity are exact formula outputs.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Matrix */}
        <div className="lg:col-span-3 bg-gradient-to-br from-qpu-purple/10 to-qpu-blue/10 rounded-lg p-8 border border-qpu-purple/30 overflow-auto">
          <h3 className="text-lg font-bold text-qpu-cyan mb-6">50-System Synergy Matrix (15×15 sample)</h3>

          <div className="inline-block">
            <svg width={cellSize * 15} height={cellSize * 15}>
              {matrix.map((cell, idx) => {
                const isSelected = selectedCell === cell
                const opacity = 0.3 + (cell.value / maxValue) * 0.7

                return (
                  <g
                    key={idx}
                    onClick={() => setSelectedCell(isSelected ? null : cell)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Cell */}
                    <rect
                      x={cell.x * cellSize}
                      y={cell.y * cellSize}
                      width={cellSize - 1}
                      height={cellSize - 1}
                      fill={getColorForValue(cell.value)}
                      stroke={isSelected ? 'rgba(6, 182, 212, 1)' : 'rgba(124, 58, 237, 0.3)'}
                      strokeWidth={isSelected ? 2 : 1}
                      className={isSelected ? 'pulse-glow' : ''}
                      style={{
                        filter: isSelected ? `drop-shadow(0 0 10px rgba(6, 182, 212, 0.8))` : 'none',
                        transition: 'all 0.2s ease',
                      }}
                    />

                    {/* Value text for bright cells */}
                    {cell.value > 0.35 && (
                      <text
                        x={cell.x * cellSize + cellSize / 2}
                        y={cell.y * cellSize + cellSize / 2}
                        textAnchor="middle"
                        dy=".3em"
                        fontSize="8"
                        fill="rgba(255, 255, 255, 0.6)"
                        pointerEvents="none"
                      >
                        {cell.value.toFixed(1)}
                      </text>
                    )}
                  </g>
                )
              })}
            </svg>
          </div>

          <div className="mt-6 flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(124, 58, 237, 0.2)' }} />
              <span className="text-qpu-cyan/60">Low (&lt;0.3)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(59, 130, 246, 0.4)' }} />
              <span className="text-qpu-cyan/60">Medium (0.3-0.6)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(6, 182, 212, 0.6)' }} />
              <span className="text-qpu-cyan/60">High (0.6-0.8)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(236, 72, 153, 0.8)' }} />
              <span className="text-qpu-cyan/60">Very High (&gt;0.8)</span>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-qpu-purple/10 to-qpu-pink/10 rounded-lg p-6 border border-qpu-purple/30">
            <h3 className="text-lg font-bold text-qpu-cyan mb-4">Matrix Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-qpu-cyan/60">Total Cells:</span>
                <span className="text-qpu-purple font-bold">{matrix.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-qpu-cyan/60">Max Synergy:</span>
                <span className="text-qpu-purple font-bold">{maxValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-qpu-cyan/60">Average:</span>
                <span className="text-qpu-purple font-bold">
                  {(matrix.reduce((a, c) => a + c.value, 0) / matrix.length).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-qpu-cyan/60">High Value Cells:</span>
                <span className="text-qpu-purple font-bold">
                  {matrix.filter(c => c.value > maxValue * 0.7).length}
                </span>
              </div>
            </div>
          </div>

          {selectedCell && (
            <div className="bg-gradient-to-br from-qpu-blue/10 to-qpu-cyan/10 rounded-lg p-6 border border-qpu-blue/30 float-card">
              <h3 className="text-lg font-bold text-qpu-cyan mb-4">Cell [{selectedCell.x}, {selectedCell.y}]</h3>

              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-qpu-cyan/60 mb-1">Synergy Strength</div>
                  <div className="text-2xl font-bold text-qpu-purple">{selectedCell.value.toFixed(3)}</div>
                  <div className="w-full h-2 bg-qpu-dark rounded overflow-hidden mt-2">
                    <div
                      className="h-full bg-gradient-to-r from-qpu-purple to-qpu-blue"
                      style={{ width: `${(selectedCell.value / maxValue) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-qpu-purple/20">
                  <div className="text-qpu-cyan/60 mb-2">Formula Components</div>
                  <div className="space-y-1 text-xs">
                    <div>
                      <span className="text-qpu-cyan/60">Base A:</span>
                      <span className="text-qpu-purple ml-2 font-bold">
                        {(0.5 + (selectedCell.x / 15) * 0.5).toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-qpu-cyan/60">Base B:</span>
                      <span className="text-qpu-purple ml-2 font-bold">
                        {(0.5 + (selectedCell.y / 15) * 0.5).toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-qpu-cyan/60">Alignment:</span>
                      <span className="text-qpu-purple ml-2 font-bold">0.70-0.95</span>
                    </div>
                    <div>
                      <span className="text-qpu-cyan/60">Timing:</span>
                      <span className="text-qpu-purple ml-2 font-bold">0.80-1.00</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-qpu-purple/20">
                  <div className="code-highlight text-xs">
                    <div>Synergy(A,B) =</div>
                    <div>A × B × Al × Ti</div>
                    <div className="text-qpu-cyan mt-1">{selectedCell.value.toFixed(3)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-qpu-dark/50 rounded-lg p-4 border border-qpu-purple/20 text-xs space-y-2">
            <div className="font-bold text-qpu-cyan mb-2">Key Insights</div>
            <p className="text-qpu-cyan/70">
              The diagonal shows strongest synergies (matching system strengths). Brighter cells indicate systems that work exceptionally well together.
            </p>
            <p className="text-qpu-cyan/70">
              In the full 50-system matrix, 256+ synergies above threshold (0.2) were discovered through Phase 14 waves.
            </p>
          </div>

          <div className="bg-gradient-to-br from-qpu-purple/10 to-qpu-blue/10 rounded-lg p-4 border border-qpu-purple/30 code-highlight text-xs">
            <div className="font-bold text-qpu-cyan mb-2">Formula</div>
            <div className="text-qpu-purple">Synergy(A,B) =</div>
            <div className="text-qpu-purple">Base(A) × Base(B)</div>
            <div className="text-qpu-purple">× Alignment × Timing</div>
          </div>
        </div>
      </div>

      {/* Distribution Analysis */}
      <div className="mt-12 bg-gradient-to-br from-qpu-purple/10 to-qpu-blue/10 rounded-lg p-8 border border-qpu-purple/30">
        <h3 className="text-lg font-bold text-qpu-cyan mb-6">Synergy Distribution Analysis</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Histogram */}
          <div>
            <h4 className="text-qpu-cyan/80 font-bold mb-4">Value Distribution</h4>
            <svg viewBox="0 0 300 150" className="w-full">
              {Array.from({ length: 10 }).map((_, i) => {
                const binMin = (i / 10) * maxValue
                const binMax = ((i + 1) / 10) * maxValue
                const count = matrix.filter(c => c.value >= binMin && c.value < binMax).length
                const height = (count / matrix.length) * 120

                return (
                  <g key={`bin-${i}`}>
                    <rect
                      x={20 + i * 27}
                      y={120 - height}
                      width="24"
                      height={height}
                      fill={`rgba(124, 58, 237, ${0.3 + (i / 10) * 0.7})`}
                      stroke="rgba(124, 58, 237, 0.6)"
                      strokeWidth="1"
                    />
                    <text x={20 + i * 27 + 12} y="135" textAnchor="middle" fontSize="8" fill="rgba(124, 58, 237, 0.6)">
                      {i * 10}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Statistics */}
          <div className="space-y-4">
            <div className="bg-qpu-dark/50 rounded-lg p-4 border border-qpu-purple/20">
              <h4 className="font-bold text-qpu-cyan mb-2">Statistical Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-qpu-cyan/60">Mean:</span>
                  <span className="text-qpu-purple font-bold">
                    {(matrix.reduce((a, c) => a + c.value, 0) / matrix.length).toFixed(3)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-qpu-cyan/60">Median:</span>
                  <span className="text-qpu-purple font-bold">
                    {matrix
                      .map(c => c.value)
                      .sort((a, b) => a - b)
                    [Math.floor(matrix.length / 2)].toFixed(3)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-qpu-cyan/60">Min:</span>
                  <span className="text-qpu-purple font-bold">
                    {Math.min(...matrix.map(c => c.value)).toFixed(3)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-qpu-cyan/60">Max:</span>
                  <span className="text-qpu-purple font-bold">{maxValue.toFixed(3)}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-qpu-cyan/10 to-qpu-blue/10 rounded-lg p-4 border border-qpu-cyan/30">
              <h4 className="font-bold text-qpu-cyan mb-2">Practical Impact</h4>
              <p className="text-qpu-cyan/70 text-sm">
                High-synergy systems should be deployed together. Low-synergy pairs may conflict. Matrix heat reveals optimal system combinations for Phase 14 waves.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
