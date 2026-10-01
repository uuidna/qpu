/**
 * Autonomous Wave Visualizer Component
 * Visualize quantum theorem discovery chains
 */

import React, { useEffect, useRef } from 'react'
import { Activity, Zap } from 'lucide-react'

interface WaveStep {
  index: number
  domain: string
  operation: string
  result: string
  fold?: string
}

interface WaveVisualizerProps {
  waveId: string
  steps: WaveStep[]
  folds: string[]
  isRunning?: boolean
}

export function WaveVisualizer({ waveId, steps, folds, isRunning = false }: WaveVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || steps.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw wave path
    const padding = 40
    const stepWidth = (canvas.width - padding * 2) / Math.max(steps.length - 1, 1)
    const maxValue = Math.max(...steps.map(s => {
      const val = parseInt(String(s.result))
      return isNaN(val) ? 0 : val
    }), 100)

    // Grid lines
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.2)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (canvas.height - padding * 2)) / 5
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(canvas.width - padding, y)
      ctx.stroke()
    }

    // Draw wave curve
    ctx.strokeStyle = '#a855f7'
    ctx.lineWidth = 3
    ctx.beginPath()

    steps.forEach((step, i) => {
      const val = parseInt(String(step.result))
      const displayVal = isNaN(val) ? 0 : val
      const x = padding + i * stepWidth
      const y = canvas.height - padding - (displayVal / maxValue) * (canvas.height - padding * 2)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw points
    steps.forEach((step, i) => {
      const val = parseInt(String(step.result))
      const displayVal = isNaN(val) ? 0 : val
      const x = padding + i * stepWidth
      const y = canvas.height - padding - (displayVal / maxValue) * (canvas.height - padding * 2)

      // Draw point
      ctx.fillStyle = isRunning && i === steps.length - 1 ? '#06b6d4' : '#a855f7'
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, Math.PI * 2)
      ctx.fill()

      // Draw label
      ctx.fillStyle = '#999'
      ctx.font = '12px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(step.domain, x, canvas.height - 10)
    })

    // Draw axis labels
    ctx.fillStyle = '#666'
    ctx.font = '12px monospace'
    ctx.textAlign = 'right'
    for (let i = 0; i <= 5; i++) {
      const val = Math.round((i / 5) * maxValue)
      const y = canvas.height - padding - (i * (canvas.height - padding * 2)) / 5
      ctx.fillText(String(val), padding - 10, y + 4)
    }

  }, [steps, isRunning])

  return (
    <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            {isRunning && <Activity className="w-6 h-6 animate-pulse text-cyan-400" />}
            Wave Execution Trace
          </h3>
          <p className="text-sm text-gray-400 mt-1">Wave ID: {waveId.slice(0, 16)}...</p>
        </div>
        {isRunning && (
          <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-300">Running</span>
          </div>
        )}
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={800}
        height={300}
        className="w-full border border-purple-500/20 rounded bg-slate-900 mb-6"
      />

      {/* Steps Timeline */}
      <div className="space-y-2">
        <h4 className="font-semibold text-sm mb-3">Proof Chain Steps</h4>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-3 p-2 bg-slate-700/30 rounded text-sm">
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                {i + 1}
              </div>
              <div className="flex-1">
                <span className="font-mono text-purple-300">{step.domain}</span>
                <span className="text-gray-500 mx-2">::</span>
                <span className="font-mono text-cyan-300">{step.operation}</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-green-400">{step.result}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fold Chain Info */}
      {folds.length > 0 && (
        <div className="mt-6 pt-6 border-t border-purple-500/10">
          <h4 className="font-semibold text-sm mb-3">Cryptographic Proof Chain (Folds)</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {folds.slice(0, 5).map((fold, i) => (
              <div key={i} className="font-mono text-xs text-gray-500 break-all">
                [{i}] {fold}
              </div>
            ))}
            {folds.length > 5 && (
              <div className="text-xs text-gray-500 pt-2">
                ... and {folds.length - 5} more folds
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
