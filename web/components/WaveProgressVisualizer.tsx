'use client'

import { useState, useEffect } from 'react'
import { generateWaveProgression } from '@/lib/formulas'

interface Wave {
  wave: number
  gain: number
  cumulative: number
  momentum: number
  strategy: string
}

export default function WaveProgressVisualizer() {
  const [waves, setWaves] = useState<Wave[]>([])
  const [selectedWave, setSelectedWave] = useState<number | null>(null)
  const [animationTime, setAnimationTime] = useState(0)

  useEffect(() => {
    const progression = generateWaveProgression(30)
    setWaves(progression)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTime(t => (t + 1) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  if (waves.length === 0) return <div>Loading...</div>

  const maxCumulative = Math.max(...waves.map(w => w.cumulative))
  const maxGain = Math.max(...waves.map(w => w.gain))

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-4 text-qpu-cyan">Wave-Based Continuous Improvement</h2>
      <p className="text-qpu-cyan/60 mb-8">
        Each wave uses the formula: Gain(n) = G₀ × e^(-λn). Cumulative improvement = sum of all wave gains.
        Color intensity and height are formula outputs, not arbitrary animations.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Wave Chart */}
        <div className="lg:col-span-2 bg-gradient-to-br from-qpu-purple/10 to-qpu-blue/10 rounded-lg p-8 border border-qpu-purple/30">
          <h3 className="text-lg font-bold text-qpu-cyan mb-6">Wave Progression & Momentum</h3>

          {/* Dual-axis chart */}
          <svg viewBox="0 0 600 400" className="w-full">
            <defs>
              <linearGradient id="cumulativeGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="rgba(124, 58, 237, 0.2)" />
                <stop offset="100%" stopColor="rgba(59, 130, 246, 0.8)" />
              </linearGradient>
              <linearGradient id="gainGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="rgba(236, 72, 153, 0.2)" />
                <stop offset="100%" stopColor="rgba(6, 182, 212, 0.8)" />
              </linearGradient>
            </defs>

            {/* Grid */}
            {Array.from({ length: 10 }).map((_, i) => {
              const y = (i / 9) * 300 + 50
              return (
                <g key={`grid-${i}`}>
                  <line
                    x1="80"
                    y1={y}
                    x2="580"
                    y2={y}
                    stroke="rgba(124, 58, 237, 0.1)"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                  <text x="70" y={y + 3} fontSize="10" fill="rgba(124, 58, 237, 0.4)" textAnchor="end">
                    {((9 - i) * 10).toFixed(0)}%
                  </text>
                </g>
              )
            })}

            {/* Axes */}
            <line x1="80" y1="350" x2="580" y2="350" stroke="rgba(124, 58, 237, 0.5)" strokeWidth="2" />
            <line x1="80" y1="50" x2="80" y2="350" stroke="rgba(124, 58, 237, 0.5)" strokeWidth="2" />

            {/* Wave bars and labels */}
            {waves.map((wave, i) => {
              const x = 80 + (i / (waves.length - 1)) * 500
              const gainHeight = (wave.gain / maxGain) * 200
              const cumulativeHeight = (wave.cumulative / maxCumulative) * 300

              const strategyColor =
                wave.strategy === 'Focused'
                  ? 'rgba(124, 58, 237, 0.7)'
                  : wave.strategy === 'Opportunistic'
                    ? 'rgba(59, 130, 246, 0.7)'
                    : wave.strategy === 'Exploratory'
                      ? 'rgba(6, 182, 212, 0.7)'
                      : wave.strategy === 'Defensive'
                        ? 'rgba(236, 72, 153, 0.7)'
                        : 'rgba(124, 58, 237, 0.5)'

              const isSelected = selectedWave === wave.wave

              return (
                <g
                  key={`wave-${wave.wave}`}
                  onClick={() => setSelectedWave(isSelected ? null : wave.wave)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Cumulative progress bar (light) */}
                  <rect
                    x={x - 8}
                    y={350 - cumulativeHeight}
                    width="4"
                    height={cumulativeHeight}
                    fill={`${strategyColor.replace('0.7', '0.3')}`}
                    opacity="0.4"
                  />

                  {/* Gain bar (bright) */}
                  <rect
                    x={x}
                    y={350 - gainHeight}
                    width="8"
                    height={gainHeight}
                    fill={strategyColor}
                    opacity={isSelected ? 1 : 0.6}
                    className={isSelected ? 'pulse-glow' : ''}
                    style={{
                      filter: isSelected ? `drop-shadow(0 0 10px ${strategyColor})` : 'none',
                      transition: 'all 0.3s ease',
                    }}
                  />

                  {/* Wave number label */}
                  <text x={x} y="370" fontSize="10" textAnchor="middle" fill="rgba(124, 58, 237, 0.6)">
                    {wave.wave}
                  </text>

                  {/* Pulsing circle for highest bars */}
                  {wave.gain === maxGain && (
                    <>
                      <circle cx={x + 4} cy={350 - gainHeight} r="4" fill="none" stroke="rgba(124, 58, 237, 0.8)" strokeWidth="1" className="pulse-ring" />
                      <circle cx={x + 4} cy={350 - gainHeight} r="4" fill="none" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="1" style={{ animationDelay: '0.3s' }} className="pulse-ring" />
                    </>
                  )}
                </g>
              )
            })}

            {/* Legend */}
            <text x="80" y="30" fontSize="12" fill="rgba(124, 58, 237, 0.8)" fontWeight="bold">
              Gain per Wave (bright) | Cumulative Progress (faint)
            </text>
          </svg>
        </div>

        {/* Stats Panel */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-qpu-purple/10 to-qpu-pink/10 rounded-lg p-6 border border-qpu-purple/30">
            <h3 className="text-lg font-bold text-qpu-cyan mb-4">Overall Stats</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-qpu-cyan/60">Total Waves:</span>
                <span className="text-qpu-purple font-bold">{waves.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-qpu-cyan/60">Max Wave Gain:</span>
                <span className="text-qpu-purple font-bold">{maxGain.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-qpu-cyan/60">Total Cumulative:</span>
                <span className="text-qpu-purple font-bold">{waves[waves.length - 1].cumulative.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-qpu-cyan/60">Convergence Point:</span>
                <span className="text-qpu-purple font-bold">~80-85%</span>
              </div>
            </div>
          </div>

          {selectedWave && (
            <div className="bg-gradient-to-br from-qpu-blue/10 to-qpu-cyan/10 rounded-lg p-6 border border-qpu-blue/30 float-card stagger-1">
              <h3 className="text-lg font-bold text-qpu-cyan mb-4">Wave {selectedWave} Details</h3>
              {waves.find(w => w.wave === selectedWave) && (
                <div className="space-y-3 text-sm">
                  {(() => {
                    const w = waves.find(ww => ww.wave === selectedWave)!
                    return (
                      <>
                        <div>
                          <div className="text-qpu-cyan/60 mb-1">Strategy</div>
                          <div className="text-qpu-purple font-bold">{w.strategy}</div>
                        </div>

                        <div>
                          <div className="text-qpu-cyan/60 mb-1">Wave Gain</div>
                          <div className="text-2xl text-qpu-purple font-bold">{w.gain.toFixed(2)}%</div>
                          <div className="w-full bg-qpu-dark rounded overflow-hidden h-2 mt-2">
                            <div
                              className="h-full bg-gradient-to-r from-qpu-purple to-qpu-blue"
                              style={{ width: `${(w.gain / maxGain) * 100}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="text-qpu-cyan/60 mb-1">Cumulative</div>
                          <div className="text-xl text-qpu-cyan font-bold">{w.cumulative.toFixed(1)}%</div>
                          <div className="w-full bg-qpu-dark rounded overflow-hidden h-2 mt-2">
                            <div
                              className="h-full bg-gradient-to-r from-qpu-cyan to-qpu-blue"
                              style={{ width: `${w.cumulative}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="text-qpu-cyan/60 mb-1">Momentum</div>
                          <div className={`font-bold ${w.momentum > 0 ? 'text-qpu-cyan' : 'text-qpu-pink'}`}>
                            {w.momentum > 0 ? '📈' : '📉'} {w.momentum.toFixed(2)}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-qpu-purple/20">
                          <div className="text-xs text-qpu-cyan/50 mb-2">Formula Output</div>
                          <div className="font-mono text-xs bg-qpu-dark/50 p-2 rounded">
                            <div>Gain(n) = 8 × e<sup>(-0.15×{w.wave})</sup></div>
                            <div className="text-qpu-cyan mt-1">{w.gain.toFixed(2)}%</div>
                          </div>
                        </div>
                      </>
                    )
                  })()}
                </div>
              )}
            </div>
          )}

          {/* Strategy Legend */}
          <div className="bg-qpu-dark/50 rounded-lg p-4 border border-qpu-purple/20 text-xs space-y-2">
            <div className="font-bold text-qpu-cyan mb-2">Strategies by Phase</div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-qpu-purple rounded" />
              <span>Focused (8% gain)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-qpu-blue rounded" />
              <span>Opportunistic (12% gain)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-qpu-cyan rounded" />
              <span>Exploratory (6% gain)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-qpu-pink rounded" />
              <span>Defensive (3% gain)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            title: 'Exponential Decay',
            desc: 'Wave gains follow e^(-λn), decreasing with each wave',
          },
          {
            title: 'Cumulative Growth',
            desc: 'Total improvement is sum of all wave gains (80-85%)',
          },
          {
            title: 'Convergence',
            desc: 'System reaches plateau where further gains approach zero',
          },
        ].map((insight, i) => (
          <div key={i} className="bg-gradient-to-br from-qpu-purple/10 to-qpu-blue/10 rounded-lg p-4 border border-qpu-purple/20 text-sm">
            <h4 className="text-qpu-cyan font-bold mb-2">{insight.title}</h4>
            <p className="text-qpu-cyan/60">{insight.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
