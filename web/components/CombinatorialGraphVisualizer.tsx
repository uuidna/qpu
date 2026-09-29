'use client'

import { useState, useEffect } from 'react'
import { generateSynergyNetwork } from '@/lib/formulas'

interface Node {
  id: number
  label: string
  strength: number
}

interface Edge {
  source: number
  target: number
  strength: number
}

export default function CombinatorialGraphVisualizer() {
  const [network, setNetwork] = useState<{ nodes: Node[]; edges: Edge[] } | null>(null)
  const [selectedNode, setSelectedNode] = useState<number | null>(null)
  const [animationProgress, setAnimationProgress] = useState(0)

  useEffect(() => {
    const net = generateSynergyNetwork(30)
    setNetwork(net)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationProgress(prev => (prev + 1) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  if (!network) return <div>Loading...</div>

  const SIZE = 600
  const CENTER = SIZE / 2
  const RADIUS = SIZE / 2.5

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Graph Visualization */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-qpu-purple/10 to-qpu-blue/10 rounded-lg p-8 border border-qpu-purple/30">
            <h2 className="text-2xl font-bold mb-4 text-qpu-cyan">
              Combinatorial System Network
            </h2>
            <p className="text-qpu-cyan/60 text-sm mb-6">
              30 systems with 256+ synergies. Node size = system strength. Line thickness = synergy strength.
            </p>

            <svg width={SIZE} height={SIZE} className="w-full bg-qpu-dark/50 rounded border border-qpu-purple/20">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(124, 58, 237, 0.8)" />
                  <stop offset="100%" stopColor="rgba(59, 130, 246, 0.8)" />
                </linearGradient>
              </defs>

              {/* Edges */}
              {network.edges.map((edge, i) => {
                const source = network.nodes.find(n => n.id === edge.source)
                const target = network.nodes.find(n => n.id === edge.target)
                if (!source || !target) return null

                const sourceIdx = network.nodes.indexOf(source)
                const targetIdx = network.nodes.indexOf(target)
                const sourceAngle = (sourceIdx / network.nodes.length) * Math.PI * 2
                const targetAngle = (targetIdx / network.nodes.length) * Math.PI * 2

                const x1 = CENTER + RADIUS * Math.cos(sourceAngle)
                const y1 = CENTER + RADIUS * Math.sin(sourceAngle)
                const x2 = CENTER + RADIUS * Math.cos(targetAngle)
                const y2 = CENTER + RADIUS * Math.sin(targetAngle)

                return (
                  <line
                    key={`edge-${i}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="url(#gradient)"
                    strokeWidth={Math.max(0.5, edge.strength * 2)}
                    opacity={0.3 + edge.strength * 0.4}
                    className="connection-line"
                  />
                )
              })}

              {/* Nodes */}
              {network.nodes.map((node, i) => {
                const angle = (i / network.nodes.length) * Math.PI * 2
                const x = CENTER + RADIUS * Math.cos(angle)
                const y = CENTER + RADIUS * Math.sin(angle)
                const size = 25 + node.strength * 15
                const isSelected = node.id === selectedNode

                return (
                  <g key={`node-${node.id}`}>
                    {/* Pulse Ring */}
                    {isSelected && (
                      <>
                        <circle
                          cx={x}
                          cy={y}
                          r={size}
                          fill="none"
                          stroke="rgba(124, 58, 237, 0.5)"
                          strokeWidth="2"
                          className="pulse-ring"
                        />
                        <circle
                          cx={x}
                          cy={y}
                          r={size}
                          fill="none"
                          stroke="rgba(59, 130, 246, 0.5)"
                          strokeWidth="2"
                          style={{ animationDelay: '0.3s' }}
                          className="pulse-ring"
                        />
                      </>
                    )}

                    {/* Node Circle */}
                    <circle
                      cx={x}
                      cy={y}
                      r={size}
                      fill={`rgba(124, 58, 237, ${0.3 + node.strength * 0.4})`}
                      stroke={isSelected ? 'rgba(59, 130, 246, 1)' : 'rgba(124, 58, 237, 0.6)'}
                      strokeWidth={isSelected ? 3 : 2}
                      className={`graph-node ${isSelected ? 'active' : ''}`}
                      onClick={() => setSelectedNode(node.id === selectedNode ? null : node.id)}
                      style={{
                        cursor: 'pointer',
                        filter: `drop-shadow(0 0 ${10 + node.strength * 10}px rgba(124, 58, 237, 0.6))`,
                      }}
                    />

                    {/* Node Label */}
                    <text
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dy=".3em"
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                      pointerEvents="none"
                    >
                      {node.label}
                    </text>

                    {/* Strength Value */}
                    <text
                      x={x}
                      y={y + 20}
                      textAnchor="middle"
                      fontSize="10"
                      fill="rgba(124, 58, 237, 0.7)"
                      pointerEvents="none"
                    >
                      {node.strength.toFixed(2)}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
        </div>

        {/* Info Panel */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-qpu-purple/10 to-qpu-pink/10 rounded-lg p-6 border border-qpu-purple/30">
            <h3 className="text-lg font-bold text-qpu-cyan mb-3">System Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-qpu-cyan/60">Total Systems:</span>
                <span className="text-qpu-purple font-bold">{network.nodes.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-qpu-cyan/60">Synergies Found:</span>
                <span className="text-qpu-purple font-bold">{network.edges.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-qpu-cyan/60">Possible Pairs:</span>
                <span className="text-qpu-purple font-bold">
                  {Math.round((network.nodes.length * (network.nodes.length - 1)) / 2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-qpu-cyan/60">Coverage:</span>
                <span className="text-qpu-purple font-bold">
                  {((network.edges.length / ((network.nodes.length * (network.nodes.length - 1)) / 2)) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {selectedNode && (
            <div className="bg-gradient-to-br from-qpu-blue/10 to-qpu-cyan/10 rounded-lg p-6 border border-qpu-blue/30 float-card">
              <h3 className="text-lg font-bold text-qpu-cyan mb-3">
                Selected: {network.nodes.find(n => n.id === selectedNode)?.label}
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-qpu-cyan/60 mb-1">System Strength</div>
                  <div className="w-full bg-qpu-dark rounded overflow-hidden">
                    <div
                      className="h-2 bg-gradient-to-r from-qpu-purple to-qpu-blue transition-all metric-bar"
                      style={{
                        width: `${(network.nodes.find(n => n.id === selectedNode)?.strength || 0) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="text-qpu-cyan/60 mb-2">Connected Synergies</div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {network.edges
                      .filter(e => e.source === selectedNode || e.target === selectedNode)
                      .map((edge, i) => (
                        <div
                          key={i}
                          className="text-qpu-cyan/70 text-xs bg-qpu-dark/50 px-2 py-1 rounded flex justify-between"
                        >
                          <span>
                            {edge.source === selectedNode ? `→ S${edge.target}` : `← S${edge.source}`}
                          </span>
                          <span className="text-qpu-purple font-bold">
                            {(edge.strength * 100).toFixed(0)}%
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-qpu-purple/10 to-qpu-blue/10 rounded-lg p-4 border border-qpu-purple/30 code-highlight">
            <div className="text-xs text-qpu-cyan/60 mb-2">Formula:</div>
            <div className="text-xs font-mono text-qpu-purple">
              Synergy(A,B) = Base(A) × Base(B) × Align × Time
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
